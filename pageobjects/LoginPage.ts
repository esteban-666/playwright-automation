import { Page } from '@playwright/test';

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
    await this.page.goto("https://rahulshettyacademy.com/client");
  }

  async validLogin(username: string, password: string): Promise<void> {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.signInbutton.click();
    await this.page.waitForLoadState('networkidle');
  }
} 