import { test, expect, request, APIRequestContext, Page } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';

// Define login and order payloads
const loginPayLoad = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const orderPayLoad = { orders: [{ country: 'India', productOrderedId: '6262e95ae26b7e1a10e89bf0' }] };
const fakePayLoadOrders = { data: [], message: 'No Orders' };

// Store the response with token and orderId
let response: { token: string; orderId: string };

test.beforeAll(async () => {
  // Create a new API request context
  const apiContext: APIRequestContext = await request.newContext();
  // Initialize API utility with login payload
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  // Create an order and store the response
  response = await apiUtils.createOrder(orderPayLoad);
});

test('@SP Place the order', async ({ page }) => {
  // Inject the token into localStorage before the page loads
  page.addInitScript((value: string) => {
    window.localStorage.setItem('token', value);
  }, response.token);

  // Go to the client app
  await page.goto('https://rahulshettyacademy.com/client');

  // Intercept the network request for getting orders and mock the response
  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', async route => {
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayLoadOrders);
    route.fulfill({
      response,
      body,
    });
  });

  // Navigate to the orders page
  await page.locator('button[routerlink*="myorders"]').click();

  // Wait for the mocked response to be received
  await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*');

  // Log the message displayed when there are no orders
  console.log(await page.locator('.mt-4').textContent());
}); 