import { test, expect, request, APIRequestContext, Page } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';

// Define login and order payloads
const loginPayLoad = { userEmail: 'rahulshetty@gmail.com', userPassword: 'Iamking@000' };
const orderPayLoad = { orders: [{ country: 'Cuba', productOrderedId: '687752eb6eb3777530a0555c' }] };

// Store the response with token and orderId
let response: { token: string; orderId: string };

// Before all tests, create an order using the API
test.beforeAll(async () => {
  // Create a new API request context
  const apiContext: APIRequestContext = await request.newContext();
  // Initialize API utility with login payload
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  // Create an order and store the response
  response = await apiUtils.createOrder(orderPayLoad);
  // Log the API response for debugging
  console.log('API createOrder response:', response);
});

test('@API Place the order', async ({ page, request }) => {
  // --- Step 1: Login and get token ---
  const loginResponse = await request.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    data: {
          userEmail: 'rahulshetty@gmail.com',
    userPassword: 'Iamking@000',
    },
  });
  const loginResponseBody = await loginResponse.json();
  const dynamicToken = loginResponseBody.token;
  console.log('[LOGIN API] Status:', loginResponse.status());
  console.log('[LOGIN API] Body:', loginResponseBody);

  // --- Step 2: Create an order dynamically using the API ---
  const createOrderResponse = await request.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Authorization': dynamicToken,
    },
    data: {
      orders: [{ country: 'India', productOrderedId: '67a8dde5c0d3e6622a297cc8' }],
    },
  });
  const createOrderBody = await createOrderResponse.json();
  console.log('[CREATE ORDER API] Status:', createOrderResponse.status());
  console.log('[CREATE ORDER API] Body:', createOrderBody);
  const apiOrderId = createOrderBody.orders && Array.isArray(createOrderBody.orders) && createOrderBody.orders.length > 0 ? createOrderBody.orders[0] : null;

  // --- Step 3: Inject the token into localStorage before the page loads ---
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, dynamicToken);

  // --- Step 4: Go to the client app and navigate to orders page ---
  await page.goto('https://rahulshettyacademy.com/client');
  await page.locator('button[routerlink*="myorders"]').click();

  // Reload the page and wait to ensure the UI fetches the latest orders
  await page.reload();
  await page.waitForTimeout(2000); // wait for 2 seconds

  await page.locator('tbody').waitFor();

  // --- Step 5: Find and click the order in the UI that matches the API orderId ---
  console.log('API Order ID:', apiOrderId);
  const rows = page.locator('tbody tr');
  let found = false;
  const rowCount = await rows.count();
  for (let i = 0; i < rowCount; ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    console.log(`Row ${i} Order ID:`, rowOrderId);
    if (apiOrderId && rowOrderId && apiOrderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      found = true;
      break;
    }
  }
  expect(found).toBeTruthy(); // Ensure the order was found in the UI

  // --- Step 6: Compare the orderId from the API to the one shown in the UI details ---
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(apiOrderId.includes(orderIdDetails || '')).toBeTruthy();
}); 