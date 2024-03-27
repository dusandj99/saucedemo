import { test, expect, type Page } from '@playwright/test';
import { Login } from '../page-objects/Login';
import { Products } from '../page-objects/Products';
const data = JSON.parse(JSON.stringify(require('../utils/data.json')));

let page:Page;
let loginPage:Login;
let productsPage:Products;

test.beforeAll(async({ browser }) => {

    page = await browser.newPage();
    loginPage = new Login(page);
    productsPage = new Products(page);
    
    await loginPage.goTo();
    await loginPage.fillLoginForm(data.credentials.username, data.credentials.password);
})

test('User can sort items by price', async () => {

    await productsPage.selectFilter(productsPage.dropdown.lowToHigh);

    let prices_array = await productsPage.getProductPrice(); 
    let trimmedArray: number[] = prices_array.map((str) => str.substring(1)).map(str => parseFloat(str));
    let sorted = false;

    if(productsPage.arraysAreEqual(trimmedArray, trimmedArray.sort((a, b) => a - b))){
        sorted = true;
    }
    expect(sorted).toBeTruthy();
});

test('User can sort items by alphabetical order', async () => {
    
    await productsPage.selectFilter(productsPage.dropdown.zToa);

    let product_name_array = await productsPage.getProductName(); 
    let sortedZtoA = await productsPage.sortProducts(product_name_array);
    let sorted = false;
    if(productsPage.arraysAreEqual(product_name_array, sortedZtoA)){
        sorted = true;
    }
    expect(sorted).toBeTruthy();
});

test.afterEach(async () => {
    await productsPage.goTo();
})

test.afterAll(async () => {
    await page.close();
  });
