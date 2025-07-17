import { test, expect, request, APIRequestContext, Page } from '@playwright/test';
import { APiUtils } from '../utils/APiUtils';

const loginPayLoad = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const orderPayLoad = { orders: [{ country: 'India', productOrderedId: '6262e95ae26b7e1a10e89bf0' }] };
const fakePayLoadOrders = { data: [], message: 'No Orders' };

let response: { token: string; orderId: string };

test.beforeAll(async () => {
  const apiContext: APIRequestContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

test('@SP Place the order', async ({ page }) => {
  page.addInitScript((value: string) => {
    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto('https://rahulshettyacademy.com/client');

  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', async route => {
    const response = await page.request.fetch(route.request());
    let body = JSON.stringify(fakePayLoadOrders);
    route.fulfill({
      response,
      body,
    });
  });

  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*');
  console.log(await page.locator('.mt-4').textContent());
}); 