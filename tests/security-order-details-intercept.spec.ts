import { test, expect, Page } from '@playwright/test';

test('@QW Security test request intercept', async ({ page }) => {
  // Go to the client app login page
  await page.goto('https://rahulshettyacademy.com/client');

  // Fill in login credentials
  await page.locator('#userEmail').fill('rahulshetty@gmail.com');
  await page.locator('#userPassword').fill('Iamking@000');

  // Click the login button
  await page.locator("[value='Login']").click();

  // Wait for the page to finish loading
  await page.waitForLoadState('networkidle');

  // Wait for the product cards to be visible
  await page.locator('.card-body b').first().waitFor();

  // Navigate to the orders page
  await page.locator('button[routerlink*="myorders"]').click();

  // Intercept the order details API request and redirect it to a specific order ID
  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*', route =>
    route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' })
  );

  // Click the first 'View' button to view order details
  await page.locator("button:has-text('View')").first().click();

  // Assert that the unauthorized message is displayed
  await expect(page.locator('p').last()).toHaveText('You are not authorize to view this order');
}); 