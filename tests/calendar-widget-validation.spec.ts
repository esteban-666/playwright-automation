
import { test, expect, Page } from '@playwright/test';

test('Calendar validations', async ({ page }) => {
  const monthNumber = '6';
  const date = '15';
  const year = '2027';
  // Go to the offers page
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

  // Open the date picker
  await page.locator('.react-date-picker__inputGroup').click();

  // Switch to year selection
  await page.locator('.react-calendar__navigation__label').click();
  await page.locator('.react-calendar__navigation__label').click();

  // Select the year
  await page.getByText(year).click();

  // Select the month
  await page.locator('.react-calendar__year-view__months__month').nth(Number(monthNumber) - 1).click();

  // Select the day
  await page.locator(`//abbr[text()='${date}']`).click();

  // Get the input fields from the date picker
  const inputs = await page.locator('.react-date-picker__inputGroup input');

  // Extract the date parts from the ISO string (YYYY-MM-DD)
  const fullDateValue = await inputs.nth(0).getAttribute('value');
  // Example: fullDateValue = "2027-06-15"
  const [yearValue, monthValue, dayValue] = fullDateValue ? fullDateValue.split('-') : [null, null, null];

  // Prepare the expected values in the order: day, month, year
  const actualList = [String(Number(dayValue)), String(Number(monthValue)), yearValue];
  const expectedList = [date, monthNumber, year];

  // Compare each value
  for (let i = 0; i < expectedList.length; i++) {
    expect(actualList[i]).toEqual(expectedList[i]);
  }
}); 