export class APiUtils {
  private apiContext: any;
  private loginPayLoad: any;

  constructor(apiContext: any, loginPayLoad: any) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
      data: this.loginPayLoad
    });
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayLoad: any): Promise<{ token: string; orderId: string }> {
    let response: { token?: string; orderId?: string } = {};
    response.token = await this.getToken();
    const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
      data: orderPayLoad,
      headers: {
        'Authorization': response.token,
        'Content-Type': 'application/json'
      }
    });
    const orderResponseJson = await orderResponse.json();
    console.log('Order API response:', orderResponseJson);

    let orderId;
    if (orderResponseJson.orders && Array.isArray(orderResponseJson.orders) && orderResponseJson.orders.length > 0) {
      orderId = orderResponseJson.orders[0];
    } else {
      console.error('No orders found in response:', orderResponseJson);
      orderId = null;
    }
    response.orderId = orderId;
    return response as { token: string; orderId: string };
  }
} 