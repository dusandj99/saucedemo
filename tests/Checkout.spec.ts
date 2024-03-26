import { test, expect, type Page } from '@playwright/test';
import { Products } from '../page-objects/Products';
import { Login } from '../page-objects/Login';
import { Cart } from '../page-objects/Cart';
import { CheckoutForm } from '../page-objects/CheckoutForm';
import { CheckoutOverview } from '../page-objects/CheckoutOverview';
import { CheckoutComplete } from '../page-objects/CheckoutComplete';

const itemName = 'Sauce Labs Bike Light';
const secondItemName = 'Sauce Labs Bolt T-Shirt';

let page: Page;
let loginPage: Login;
let productPage: Products;
let cartPage: Cart;
let checkoutPage: CheckoutForm;
let checkoutOverview: CheckoutOverview;
let checkoutComplete: CheckoutComplete;

test.beforeAll(async({ browser }) => {

    page = await browser.newPage();
    loginPage = new Login(page);
    productPage = new Products(page);
    cartPage = new Cart(page);
    checkoutPage = new CheckoutForm(page);
    checkoutOverview = new CheckoutOverview(page);
    checkoutComplete = new CheckoutComplete(page);

})

test.beforeEach(async() => {

    await loginPage.goTo();
    await loginPage.fillLoginForm('standard_user', 'secret_sauce');

})

test('User can proceed to checkout with an item', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});

test('User can proceed to purchase overview by filling the form with valid data', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    
    await checkoutPage.fillCheckoutForm('Random','Blank','10000');
    await checkoutPage.continueWithCheckout();

    expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});

test('Correct items are being presented in the checkout overview', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    
    await checkoutPage.fillCheckoutForm('Random','Blank','10000');
    await checkoutPage.continueWithCheckout();

    expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    expect(await checkoutOverview.isItemInOverview(itemName)).toBeTruthy();
});

test('User can not proceed to purchase overview with an empty form', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    
    await checkoutPage.emptyCheckoutForm();
    await checkoutPage.continueWithCheckout();

    expect(await checkoutPage.getErrorMessage().textContent()).toContain('Error: First Name is required');
});

test('User can complete the purchase of and item', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    
    await checkoutPage.fillCheckoutForm('Random','Blank','10000');
    await checkoutPage.continueWithCheckout();
    await checkoutOverview.finishCheckout(); 
    expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    expect(await checkoutComplete.getOrderMessage().textContent()).toContain('Thank you for your order!');
});

test('Price of added items in checkout overview is correct', async() => {

    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await page.waitForTimeout(500);
    await productPage.clickItemButtonByName(secondItemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillCheckoutForm('Random','Blank','10000');
    await checkoutPage.continueWithCheckout();

    let totalPrice = await checkoutOverview.getItemTotal().textContent();
    let trimmedPrice = 0;
    if (totalPrice !== null && totalPrice !== undefined) {
        trimmedPrice = parseFloat(totalPrice?.slice(totalPrice.indexOf('$') + 1));
    }

    let calculatedPrice = await checkoutOverview.getOverviewTotalPrice();
    await expect(trimmedPrice).toEqual(calculatedPrice);
})

test.afterAll(async () => {
    await page.close();
});