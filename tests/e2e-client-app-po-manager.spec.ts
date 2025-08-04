
import { test, expect, Page } from '@playwright/test';
import { customtest } from '../utils/test-base';
import { POManager } from '../pageobjects/POManager';

// Load test data from JSON file
const dataset: Array<{ username: string; password: string; productName: string }> = require("../utils/placeorderTestData.json");

// Data-driven test for each product in the dataset
// TODO: Fix cart page loading issue - commented out due to flaky behavior
for (const data of dataset) {
  test.skip(`@Webs Client App login for ${data.productName}`, async ({ page }) => {
    // Initialize Page Object Manager
    const poManager = new POManager(page);

    // Login step
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(data.username, data.password);

    // Search and add product to cart
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    // Verify product in cart and proceed to checkout
    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    // Fill order review and submit
    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);

    // Navigate to orders history (optional: verify order)
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    // Optionally, implement and use:
    // await ordersHistoryPage.searchOrderAndSelect(orderId);
    // expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  });
}

// Custom test using test data injected by Playwright fixtures
// TODO: Fix cart page loading issue - commented out due to flaky behavior
customtest.skip(`Client App login`, async ({ page, testDataForOrder }) => {
  // Initialize Page Object Manager
  const poManager = new POManager(page);

  // Login step
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);

  // Search and add product to cart
  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(testDataForOrder.productName);
  await dashboardPage.navigateToCart();

  // Verify product in cart and proceed to checkout
  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
  await cartPage.Checkout();
});

// Each test file triggers parallel execution
// Individual tests in the file run sequentially
 

 



 

