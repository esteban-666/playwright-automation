import { test as base, expect, Page, BrowserContext } from '@playwright/test';

// Custom error class for better error handling
export class TestError extends Error {
  constructor(message: string, public screenshot?: string, public context?: string) {
    super(message);
    this.name = 'TestError';
  }
}

// Smart wait utility
export async function waitForElement(page: Page, selector: string, options: {
  state?: 'visible' | 'hidden' | 'attached' | 'detached';
  timeout?: number;
  context?: string;
} = {}) {
  const { state = 'visible', timeout = 10000, context = 'Element' } = options;
  
  try {
    await page.waitForSelector(selector, { state, timeout });
  } catch (error) {
    const screenshot = await page.screenshot({ fullPage: true });
    throw new TestError(
      `${context} with selector '${selector}' not found in ${timeout}ms`,
      screenshot.toString('base64'),
      context
    );
  }
}

// Enhanced test fixture with better setup
export const test = base.extend<{
  testDataForOrder: {
    username: string;
    password: string;
    productName: string;
  };
  authenticatedPage: Page;
}>({
  testDataForOrder: {
    username: "rahulshetty@gmail.com",
    password: "Iamking@000",
    productName: "ADIDAS ORIGINAL"
  },

  // Enhanced page setup with proper configuration
  page: async ({ page }, use) => {
    // Set default viewport and timeout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.setDefaultTimeout(30000);
    await page.setDefaultNavigationTimeout(30000);
    
    // Add error handling for unhandled rejections
    page.on('pageerror', error => {
      console.error('Page error:', error);
    });
    
    // Add request/response logging for debugging
    page.on('request', request => {
      if (request.url().includes('api')) {
        console.log(`API Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('api') && response.status() >= 400) {
        console.error(`API Error: ${response.status()} ${response.url()}`);
      }
    });
    
    await use(page);
  },

  // Authenticated page fixture for tests that need login
  authenticatedPage: async ({ page, testDataForOrder }, use) => {
    // Navigate to login page
    await page.goto('https://rahulshettyacademy.com/client');
    
    // Login with smart waits
    await waitForElement(page, '#userEmail', { context: 'Email field' });
    await page.locator('#userEmail').fill(testDataForOrder.username);
    await page.locator('#userPassword').fill(testDataForOrder.password);
    await page.locator("[value='Login']").click();
    
    // Wait for successful login
    await page.waitForLoadState('networkidle');
    
    // Verify login success by checking for dashboard elements
    await waitForElement(page, '.card-body', { context: 'Dashboard' });
    
    await use(page);
  }
});

export { expect } from '@playwright/test'; 