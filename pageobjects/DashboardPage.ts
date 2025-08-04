import { Page, Locator } from '@playwright/test';
import { waitForElement, TestError } from '../utils/test-base';
import { config } from '../config/environment';

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

  async waitForProducts(): Promise<void> {
    await waitForElement(this.page, '.card-body', { 
      context: 'Product cards',
      timeout: config.timeouts.element 
    });
  }

  async searchProductAddCart(productName: string): Promise<void> {
    try {
      // Wait for products to load
      await this.waitForProducts();
      
      const titles = await this.productsText.allTextContents();
      console.log('Available products:', titles);
      
      const count = await this.products.count();
      let productFound = false;
      
      for (let i = 0; i < count; ++i) {
        const productTitle = await this.products.nth(i).locator('b').textContent();
        if (productTitle === productName) {
          // Wait for the Add To Cart button to be visible and enabled
          const addToCartBtn = this.products.nth(i).locator('text= Add To Cart');
          
          // Wait for button to be visible
          await addToCartBtn.waitFor({ state: 'visible', timeout: config.timeouts.element });
          
          // Ensure button is not disabled
          await this.page.waitForFunction(
            (selector) => {
              const btn = document.querySelector(selector);
              return btn && !btn.hasAttribute('disabled');
            },
            addToCartBtn.toString(),
            { timeout: config.timeouts.element }
          );
          
          await addToCartBtn.click();
          console.log(`Successfully added ${productName} to cart`);
          productFound = true;
          break;
        }
      }
      
      if (!productFound) {
        throw new TestError(
          `Product '${productName}' not found in available products: ${titles.join(', ')}`,
          await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
          'Product Search'
        );
      }
      
    } catch (error) {
      throw new TestError(
        `Failed to add product to cart: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Add to Cart'
      );
    }
  }

  async navigateToOrders(): Promise<void> {
    try {
      await waitForElement(this.page, "button[routerlink*='myorders']", { 
        context: 'Orders button',
        timeout: config.timeouts.element 
      });
      await this.orders.click();
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      throw new TestError(
        `Failed to navigate to orders: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Navigation'
      );
    }
  }

  async navigateToCart(): Promise<void> {
    try {
      await waitForElement(this.page, "[routerlink*='cart']", { 
        context: 'Cart button',
        timeout: config.timeouts.element 
      });
      await this.cart.click();
      await this.page.waitForLoadState('networkidle');
      
      // Wait for cart page to load
      await waitForElement(this.page, 'div li', { 
        context: 'Cart items',
        timeout: config.timeouts.navigation 
      });
      
    } catch (error) {
      throw new TestError(
        `Failed to navigate to cart: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Navigation'
      );
    }
  }

  async getProductCount(): Promise<number> {
    await this.waitForProducts();
    return await this.products.count();
  }

  async getProductTitles(): Promise<string[]> {
    await this.waitForProducts();
    return await this.productsText.allTextContents();
  }

  async isProductAvailable(productName: string): Promise<boolean> {
    try {
      await this.waitForProducts();
      const titles = await this.getProductTitles();
      return titles.includes(productName);
    } catch {
      return false;
    }
  }
} 