import { test, expect, Page } from '@playwright/test';

test('Playwright Special locators', async ({ page }) => {
  // Go to the Angular practice form page
  await page.goto('https://rahulshettyacademy.com/angularpractice/');

  // Click the checkbox labeled 'Check me out if you Love IceCreams!'
  await page.getByLabel('Check me out if you Love IceCreams!').click();

  // Check the 'Employed' radio button
  await page.getByLabel('Employed').check();

  // Select 'Female' from the Gender dropdown
  await page.getByLabel('Gender').selectOption('Female');

  // Fill in the password field
  await page.getByPlaceholder('Password').fill('abc123');

  // Click the 'Submit' button
  await page.getByRole('button', { name: 'Submit' }).click();

  // Assert that the success message is visible
  await expect(page.getByText('Success! The Form has been submitted successfully!.')).toBeVisible();

  // Click the 'Shop' link to go to the shop page
  await page.getByRole('link', { name: 'Shop' }).click();

  // Find the 'Nokia Edge' product card and click its button
  await page.locator('app-card').filter({ hasText: 'Nokia Edge' }).getByRole('button').click();
}); 