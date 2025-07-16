import { Page, Locator } from '@playwright/test';

export class OrdersHistoryPage {
  private page: Page;
  private rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('.order-row');
  }

  async getOrderIds(): Promise<string[]> {
    const orderIds: string[] = [];
    const count = await this.rows.count();
    for (let i = 0; i < count; ++i) {
      const rowOrderId = await this.rows.nth(i).locator('th').textContent();
      if (rowOrderId) orderIds.push(rowOrderId);
    }
    return orderIds;
  }
} 