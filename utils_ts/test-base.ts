
import {test as baseTest} from '@playwright/test';
interface TestDataForOrder {
    username: string;
    password: string;
    productName: string;
};
export const customTest = baseTest.extend<{testDataForOrder:TestDataForOrder}>(
{
testDataForOrder :    {
    username : "rahulshetty@gmail.com",
    password : "Iamking@000",
    productName:"ADIDAS ORIGINAL"
    
    }

}

)




