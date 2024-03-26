import { test, expect, type Page } from '@playwright/test';
import { Products } from '../page-objects/Products';
import { Login } from '../page-objects/Login';
import { Cart } from '../page-objects/Cart';

const itemName = 'Sauce Labs Bike Light';
const itemNameSecond = 'Sauce Labs Backpack';

let page: Page;
let loginPage: Login;
let productPage: Products;
let cartPage: Cart;

test.beforeAll(async({ browser }) => {

  page = await browser.newPage();
  loginPage = new Login(page);
  productPage = new Products(page);
  cartPage = new Cart(page);

  await loginPage.goTo();
  await loginPage.fillLoginForm('standard_user', 'secret_sauce');
})

// test.beforeEach(async() => {

//   await loginPage.goTo();
//   await loginPage.fillLoginForm('standard_user', 'secret_sauce');

// })

  test('User can remove item from the cart from the products page', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);

    const removeButton = await productPage.getProductButtonByName(itemName);
    await removeButton?.waitFor({state: 'visible'});
    await productPage.clickItemButtonByName(itemName, productPage.action.remove);
    await removeButton?.waitFor({state: 'hidden'});

    await productPage.goToCart();
    let itemPresent = await cartPage.getCartItemByName(itemName);
    expect(itemPresent).toBeNull();

  });

  test('User can remove item from the cart page', async () => {

    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.getCartList().locator('.cart_item').first().waitFor();
    await cartPage.removeItemFromCart(itemName);

    await cartPage.getCartList().locator('.cart_item').first().waitFor({state: 'hidden'});

    let itemPresent = await cartPage.getCartItemByName(itemName);
    expect(itemPresent).toBeNull();
  });

  test('Number of items in cart is correct', async () => {

    expect(await page.locator('.shopping_cart_badge').count()).toEqual(0);

    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.clickItemButtonByName(itemNameSecond, productPage.action.add);

    expect(await cartPage.getShoppingCartBadge()).toHaveText('2');
  });

  test.only('User can add item to cart', async () => {
    
    await productPage.clickItemButtonByName(itemName, productPage.action.add);
    await productPage.goToCart();
    await cartPage.getCartList().locator('.cart_item').first().waitFor();
  
    const item = await cartPage.getCartItemByName(itemName);
    expect(await item?.textContent()).toContain(itemName);
  
  });

  // test.afterEach(async () => {
  //   await productPage.goToCart();
  //   await cartPage.removeAllItemsFromCart();
  // })

  test.afterAll(async () => {
    await page.close();
  });


