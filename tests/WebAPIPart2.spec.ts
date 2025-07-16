import { test, expect, BrowserContext, Page } from '@playwright/test';
let webContext: BrowserContext;

// Before all tests, log in and set up a browser context with storage state
// This allows tests to run as an authenticated user without UI login

test.beforeAll(async ({ browser }) => {
  // Create a new browser context
  const context = await browser.newContext();
  // Open a new page
  const page = await context.newPage();
  // Go to the client app login page
  await page.goto('https://rahulshettyacademy.com/client');
  // Fill in login credentials
  await page.locator('#userEmail').fill('rahulshetty@gmail.com');
  await page.locator('#userPassword').fill('Iamking@000');
  // Click the login button
  await page.locator("[value='Login']").click();
  // Wait for the page to finish loading
  await page.waitForLoadState('networkidle');
  // Save the authenticated state to a file
  await context.storageState({ path: 'state.json' });
  // Create a new context using the saved state for use in tests
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('@QA Client App login', async () => {
  // Define test data
  const email = 'rahulshetty@gmail.com';
  const productName = 'IPHONE 13 PRO';
  // Open a new page in the authenticated context
  const page = await webContext.newPage();
  // Go to the client app
  await page.goto('https://rahulshettyacademy.com/client');
  // Get all product cards
  const products = page.locator('.card-body');
  // Get all product titles and log them
  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);
  // Find and add the desired product to the cart
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator('b').textContent()) === productName) {
      await products.nth(i).locator('text= Add To Cart').click();
      break;
    }
  }
  // Go to the cart page
  await page.locator("[routerlink*='cart']").click();
  // Wait for the cart to load
  console.log('Navigating to cart and waiting for cart item...');
  await page.locator('div li').first().waitFor();
  console.log('Cart item appeared!');
  // Verify the product is displayed in the cart
  const bool = await page.locator("h3:has-text('iphone 13 pro')").isVisible();
  expect(bool).toBeTruthy();
  // Proceed to checkout
  await page.locator('text=Checkout').click();
  // Fill in the country
  await page.waitForTimeout(3000);
  const countryInput = page.locator("[placeholder*='Country']");
  await countryInput.click();
  await countryInput.pressSequentially('Ind');
  await page.waitForSelector('.ta-item.list-group-item.ng-star-inserted', { timeout: 5000 });
  // Wait for the country dropdown to appear
  const dropdown = page.locator('.ta-item.list-group-item.ng-star-inserted');
  
  // Find and click the button with text 'India'
  const options = page.locator('.ta-item.list-group-item.ng-star-inserted');
  const dropdownCount = await options.count();
  for (let i = 0; i < dropdownCount; ++i) {
    const text = await options.nth(i).textContent();
    if (text && text.includes('India')) {
      await options.nth(i).click();
      break;
    }
  }
  // Verify the email is pre-filled in the checkout form
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
  // Submit the order
  await page.locator('.action__submit').click();
  // Verify the thank you message is displayed
  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
  // Get the order ID from the confirmation page
  const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
  console.log(orderId);
  // Go to the orders page
  await page.locator('button[routerlink*="myorders"]').click();
  // Wait for the orders table to load
  await page.locator('tbody').waitFor();
  // Find the order in the orders table and view its details
  const rows = page.locator('tbody tr');
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId && rowOrderId && orderId.includes(rowOrderId)) {
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }
  // Get the order ID from the details page and verify it matches
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(orderId && orderIdDetails && orderId.includes(orderIdDetails)).toBeTruthy();
});

test('@API Test case 2', async () => {
  // Define test data
  const productName = 'iphone 13 pro';
  // Open a new page in the authenticated context
  const page = await webContext.newPage();
  // Go to the client app
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');
  // Get all product cards
  const products = page.locator('.card-body');
  // Get all product titles and log them
  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);
}); 