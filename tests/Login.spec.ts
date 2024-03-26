import { test, expect, type Page } from '@playwright/test';
import { Login } from '../page-objects/Login';
const dataSet = JSON.parse(JSON.stringify(require('../utils/login.json')));

let page:Page;
let loginPage:Login;

test.beforeAll(async({ browser }) => {

  page = await browser.newPage();
  loginPage = new Login(page);

})

test('User can log in with valid credentials', async () => {
    
    await loginPage.goTo();
    await loginPage.fillLoginForm('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

for(const data of dataSet){
  test( data.testName , async () => {

    await loginPage.goTo();
    await loginPage.fillLoginForm(data.username, data.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username and password do not match any user in this service');

  });
}

test('User can not log in with empty fields', async () => {
    
  await loginPage.goTo();
  await loginPage.emptyLogin();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(loginPage.getErrorMessage()).toHaveText('Epic sadface: Username is required');

});

test.afterAll(async () => {
  await page.close();
});

//valid username-invalid password 4 -> 2
//invlaid username-valid password 5 -> 2