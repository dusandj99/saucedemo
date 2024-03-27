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

    public async getRemoveButtons():Promise<Locator[]>{
        return this.page.getByText('Remove').all();
    }

    //-----

    async waitForItemsFromCart():Promise<void>{
        await this.getCartList().locator('.cart_item').first().waitFor();
    }

    async getCartItemByName(itemName:string):Promise<Locator | null>{
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

    async removeItemFromCart(itemName:string):Promise<void>{

        let item = await this.getCartItemByName(itemName);
        item?.getByRole('button', { name: 'Remove'}).click();
    }

    async removeAllItemsFromCart():Promise<void>{
        let items = await this.getRemoveButtons();
        for(let i = 0; i < items.length; i++){
            items[i].click();
        }
    }

    async checkout():Promise<void>{
        await this.getCheckoutButton().click();
    }
    
}