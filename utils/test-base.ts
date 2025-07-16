import { test as base, TestInfo } from '@playwright/test';

interface TestDataForOrder {
  username: string;
  password: string;
  productName: string;
}

export const customtest = base.extend<{ testDataForOrder: TestDataForOrder }>({
  testDataForOrder: async ({}, use) => {
    await use({
      username: "anshika@gmail.com",
      password: "Iamking@000",
      productName: "ADIDAS ORIGINAL"
    });
  },
}); 