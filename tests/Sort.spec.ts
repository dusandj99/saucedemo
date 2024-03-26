import { test, expect, type Page } from '@playwright/test';
import { Login } from '../page-objects/Login';
import { Products } from '../page-objects/Products';

let page:Page;
let loginPage:Login;
let productsPage:Products;

test.beforeAll(async({ browser }) => {

    page = await browser.newPage();
    loginPage = new Login(page);
    productsPage = new Products(page);
  
})

test('User can sort items by price', async () => {

    await loginPage.goTo();
    await loginPage.fillLoginForm('standard_user', 'secret_sauce');
    await productsPage.selectFilter(productsPage.dropdown.lowToHigh);

    let prices_array = await productsPage.getProductElement('.inventory_item_price');
    let trimmedArray: number[] = prices_array.map((str) => str.substring(1)).map(str => parseFloat(str));
    let sorted = false;

    if(productsPage.arraysAreEqual(trimmedArray, trimmedArray.sort((a, b) => a - b))){
        sorted = true;
    }
    expect(sorted).toBeTruthy();
});

test('User can sort items by alphabetical order', async () => {
    
    await loginPage.goTo();
    await loginPage.fillLoginForm('standard_user', 'secret_sauce');
    await productsPage.selectFilter(productsPage.dropdown.zToa);

    let product_name_array = await productsPage.getProductElement('.inventory_item_name ');
    //console.log(product_name_array);
    let sortedZtoA = product_name_array.sort(function(a, b){
        if(a < b) { return 1; }
        if(a > b) { return -1; }
        return 0;
    })
    let sorted = false;
    if(productsPage.arraysAreEqual(product_name_array, sortedZtoA)){
        sorted = true;
    }
    expect(sorted).toBeTruthy();
});

test.afterAll(async () => {
    await page.close();
  });
