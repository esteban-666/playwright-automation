import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';
import { OrdersReviewPage } from './OrdersReviewPage';
import { CartPage } from './CartPage';

export class POManager {
  private page: any;
  private loginPage: LoginPage | undefined;
  private dashboardPage: DashboardPage | undefined;
  private ordersHistoryPage: OrdersHistoryPage | undefined;
  private ordersReviewPage: OrdersReviewPage | undefined;
  private cartPage: CartPage | undefined;

  constructor(page: any) {
    this.page = page;
  }

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getDashboardPage(): DashboardPage {
    if (!this.dashboardPage) {
      this.dashboardPage = new DashboardPage(this.page);
    }
    return this.dashboardPage;
  }

  getOrdersHistoryPage(): OrdersHistoryPage {
    if (!this.ordersHistoryPage) {
      this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    }
    return this.ordersHistoryPage;
  }

  getOrdersReviewPage(): OrdersReviewPage {
    if (!this.ordersReviewPage) {
      this.ordersReviewPage = new OrdersReviewPage(this.page);
    }
    return this.ordersReviewPage;
  }

  getCartPage(): CartPage {
    if (!this.cartPage) {
      this.cartPage = new CartPage(this.page);
    }
    return this.cartPage;
  }
} 