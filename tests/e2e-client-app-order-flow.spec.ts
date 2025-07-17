import { test, expect, Page } from '@playwright/test';

// Helper to slow down actions
async function slowDown(page: Page) {
  await page.waitForTimeout(4000);
}

test('@Webst Client App login', async ({ page }) => {
  // Define test data
  const email = 'anshika@gmail.com';
  const productName = 'ZARA COAT 3';
  const products = page.locator('.card-body');

  // Go to the client app login page
  await slowDown(page);
  await page.goto('https://rahulshettyacademy.com/client');

  // Fill in login credentials
  await slowDown(page);
  await page.locator('#userEmail').fill(email);
  await slowDown(page);
  await page.locator('#userPassword').fill('Iamking@000');

  // Click the login button
  await slowDown(page);
  await page.locator("[value='Login']").click();

  // Wait for the page to finish loading
  await slowDown(page);
  await page.waitForLoadState('networkidle');

  // Wait for the product cards to be visible
  await slowDown(page);
  await page.locator('.card-body b').first().waitFor();

  // Get all product titles and log them
  await slowDown(page);
  const titles = await page.locator('.card-body b').allTextContents();
  console.log('Product titles:', titles);

  // Find and add the desired product to the cart
  const count = await products.count();
  console.log('Adding product to cart...');
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator('b').textContent()) === productName) {
      await slowDown(page);
      await products.nth(i).locator('text= Add To Cart').click();
      console.log(`Clicked Add To Cart for: ${productName}`);
      break;
    }
  }

  // Go to the cart page
  await slowDown(page);
  await page.locator("[routerlink*='cart']").click();
  console.log('Navigated to cart page. Waiting for cart item...');

  // Wait for the cart to load and assert visibility (robust for CI)
  await slowDown(page);
  await expect(page.locator('div li').first()).toBeVisible({ timeout: 30000 });
  console.log('Cart item appeared!');

  // Verify the product is displayed in the cart
  await slowDown(page);
  const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
  expect(bool).toBeTruthy();

  // Proceed to checkout
  await slowDown(page);
  await page.locator('text=Checkout').click();

  // Fill in the country (simulate typing 'ind')
  await slowDown(page);
  await page.locator("[placeholder*='Country']").pressSequentially('ind');

  // Wait for the country dropdown to appear
  await slowDown(page);
  const dropdown = page.locator('.ta-results');
  await dropdown.waitFor();

  // Select 'India' from the dropdown
  const optionsCount = await dropdown.locator('button').count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator('button').nth(i).textContent();
    if (text === ' India') {
      await slowDown(page);
      await dropdown.locator('button').nth(i).click();
      break;
    }
  }

  // Verify the email is pre-filled in the checkout form
  await slowDown(page);
  await expect(page.locator('.user__name [type="text"]').first()).toHaveText(email);

  // Submit the order
  await slowDown(page);
  await page.locator('.action__submit').click();

  // Verify the thank you message is displayed
  await slowDown(page);
  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

  // Get the order ID from the confirmation page
  await slowDown(page);
  const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
  console.log(orderId);

  // Go to the orders page
  await slowDown(page);
  await page.locator('button[routerlink*="myorders"]').click();

  // Wait for the orders table to load
  await slowDown(page);
  await page.locator('tbody').waitFor();

  // Find the order in the orders table and view its details
  const rows = page.locator('tbody tr');
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId && rowOrderId && orderId.includes(rowOrderId)) {
      await slowDown(page);
      await rows.nth(i).locator('button').first().click();
      break;
    }
  }

  // Verify the order ID in the details matches the original order ID
  await slowDown(page);
  const orderIdDetails = await page.locator('.col-text').textContent();
  expect(orderId && orderIdDetails && orderId.includes(orderIdDetails)).toBeTruthy();
}); 