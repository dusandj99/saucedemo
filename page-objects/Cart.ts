import { Locator, Page } from '@playwright/test';

export class Cart {

    page: Page;
    
    constructor(page:Page){
        this.page = page;
    }
    //-----

    public getCartList():Locator{
        return this.page.locator('.cart_list');
    }

    public getCheckoutButton():Locator{
        return this.page.locator('#checkout');
    }

    public getShoppingCartBadge():Locator {
        return this.page.locator('.shopping_cart_badge');
    }

    //-----

    async getCartItemByName(itemName:string){
        let items = await this.getCartList().locator('.cart_item').all();

        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let itemText = await item.locator('.inventory_item_name').textContent();
            if(itemText === itemName){
                return item;
            }
        }
        return null;
    }

    async removeItemFromCart(itemName:string){

        let item = await this.getCartItemByName(itemName);
        item?.getByRole('button', { name: 'Remove'}).click();
    }

    async removeAllItemsFromCart(){
        await this.page.waitForSelector('.cart_list');
        let items = await this.getCartList().locator('.cart_item').all();
        for(let i = 0; i < items.length; i++){
            items[i].locator('button').click();
        }
    }

    async checkout(){
        await this.getCheckoutButton().click();
    }
    
}