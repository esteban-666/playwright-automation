import { Page } from '@playwright/test';
import { waitForElement, TestError } from '../utils/test-base';
import { config } from '../config/environment';

export class LoginPage {
  private page: Page;
  private signInbutton;
  private userName;
  private password;

  constructor(page: Page) {
    this.page = page;
    this.signInbutton = page.locator("[value='Login']");
    this.userName = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
  }

  async goTo(): Promise<void> {
    try {
      await this.page.goto(`${config.baseUrl}/client`);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      throw new TestError(
        `Failed to navigate to login page: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Navigation'
      );
    }
  }

  async validLogin(username: string, password: string): Promise<void> {
    try {
      // Wait for login form elements
      await waitForElement(this.page, '#userEmail', { 
        context: 'Login form',
        timeout: config.timeouts.element 
      });
      await waitForElement(this.page, '#userPassword', { 
        context: 'Password field',
        timeout: config.timeouts.element 
      });
      await waitForElement(this.page, "[value='Login']", { 
        context: 'Login button',
        timeout: config.timeouts.element 
      });

      // Fill credentials
      await this.userName.fill(username);
      await this.password.fill(password);
      
      // Click login and wait for response
      await this.signInbutton.click();
      await this.page.waitForLoadState('networkidle');
      
      // Verify successful login by checking for dashboard elements
      await waitForElement(this.page, '.card-body', { 
        context: 'Dashboard after login',
        timeout: config.timeouts.navigation 
      });
      
    } catch (error) {
      // Check for login error messages
      const errorElement = this.page.locator('[class*="error"], [role="alert"]');
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new TestError(
          `Login failed: ${errorText}`,
          await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
          'Login'
        );
      }
      
      throw new TestError(
        `Login failed: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Login'
      );
    }
  }

  async invalidLogin(username: string, password: string): Promise<string> {
    try {
      await waitForElement(this.page, '#userEmail', { context: 'Login form' });
      
      await this.userName.fill(username);
      await this.password.fill(password);
      await this.signInbutton.click();
      
      // Wait for error message
      await waitForElement(this.page, '[class*="error"], [role="alert"]', { 
        context: 'Error message',
        timeout: config.timeouts.element 
      });
      
      const errorElement = this.page.locator('[class*="error"], [role="alert"]');
      return await errorElement.textContent() || 'Unknown error';
      
    } catch (error) {
      throw new TestError(
        `Invalid login test failed: ${error}`,
        await this.page.screenshot({ fullPage: true }).then(s => s.toString('base64')),
        'Invalid Login'
      );
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await waitForElement(this.page, '.card-body', { 
        context: 'Dashboard',
        timeout: 5000 
      });
      return true;
    } catch {
      return false;
    }
  }
} 