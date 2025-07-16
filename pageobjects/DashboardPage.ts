import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;
  private products: Locator;
  private productsText: Locator;
  private cart: Locator;
  private orders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator('.card-body');
    this.productsText = page.locator('.card-body b');
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
  }

  async searchProductAddCart(productName: string): Promise<void> {
    const titles = await this.productsText.allTextContents();
    console.log(titles);
    const count = await this.products.count();
    for (let i = 0; i < count; ++i) {
      if (await this.products.nth(i).locator('b').textContent() === productName) {
        await this.products.nth(i).locator('text= Add To Cart').click();
        break;
      }
    }
  }

  async navigateToOrders(): Promise<void> {
    await this.orders.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cart.click();
  }
} 