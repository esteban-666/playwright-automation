const base = require('@playwright/test');


exports.customtest = base.test.extend(
{
testDataForOrder :    {
    username : "rahulshetty@gmail.com",
    password : "Iamking@000",
    productName:"ADIDAS ORIGINAL"
    
    }

}

)




