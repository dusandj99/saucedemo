import { test, expect, type Page } from '@playwright/test';
import { Login } from '../page-objects/Login';
const dataSet = JSON.parse(JSON.stringify(require('../utils/login.json')));
const data = JSON.parse(JSON.stringify(require('../utils/data.json')));

let page:Page;
let loginPage:Login;

test.beforeAll(async({ browser }) => {

  page = await browser.newPage();
  loginPage = new Login(page);
  await loginPage.goTo();
})

test('User can log in with valid credentials', async () => {
    
    await loginPage.fillLoginForm(data.credentials.username, data.credentials.password);

    await expect(page).toHaveURL(data.url.inventoryUrl);
  });

for(const testCase of dataSet){
  test(testCase.testName, async () => {

    await loginPage.fillLoginForm(testCase.username, testCase.password);

    await expect(page).toHaveURL(data.url.baseUrl);
    await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');

  });
}

test('User can not log in with empty fields', async () => {
    
  await loginPage.emptyLogin();

  await expect(page).toHaveURL(data.url.baseUrl);
  await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');

});

test('User can log out', async () => {
    
  //await loginPage.goTo();
  await loginPage.fillLoginForm(data.credentials.username, data.credentials.password);
  await loginPage.logOut();

  await expect(page).toHaveURL(data.url.baseUrl);

});

test.afterEach(async() => {
  if(page.url() !== data.url.baseUrl){
    await loginPage.logOut();
  }
})

test.afterAll(async () => {
  await page.close();
});