import { Locator, Page } from '@playwright/test';

export class Products {

    page: Page;
    
    readonly action = {
        add: 'add-to-cart',
        remove: 'remove'
    }
    readonly dropdown = {
        aToz:'az',
        zToa:'za',
        lowToHigh: 'lohi',
        highToLow: 'hilo'
    }

    constructor(page:Page){
        this.page = page;
    }

    //---------
    public getInventoryItems():Locator {
        return this.page.locator('.inventory_list');
    }

    public getCardButton():Locator {
        return this.page.locator('.shopping_cart_link');
    }

    public getSortDropdown():Locator {
        return this.page.locator('.product_sort_container');
    }

    public getItemCount():Locator {
        return this.page.locator('.shopping_cart_badge');
    }

    //---------
    async goTo()
    {
        await this.page.goto("https://www.saucedemo.com/inventory.html");
    }

    async goToCart(){
        await this.getCardButton().click();
    }

    async getProductButtonByName(itemName:string){
        let items = await this.getInventoryItems().locator('.inventory_item').all();

        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let itemText = await item.locator('.inventory_item_name ').textContent();
            if(itemText === itemName){
                itemText = itemText.toLowerCase().replace(/ /g,'-');
                return item.locator(`#remove-${itemText}`);
            }
        }
        return null;
    }

    async clickItemButtonByName(itemName:string, action:string){
        
        let items = await this.getInventoryItems().locator('.inventory_item').all();

        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let itemText = await item.locator('.inventory_item_name ').textContent();
            if(itemText === itemName){
                itemText = itemText.toLowerCase().replace(/ /g,'-');
                item.locator(`#${action}-${itemText}`).click();
                await this.page.waitForSelector(`#${action === 'add-to-cart' ? 'remove' : 'add-to-cart'}-${itemText}`); //here
                break;
            }
        }
    }

    async getProductElement(selector:string){
        
        let items = await this.getInventoryItems().locator('.inventory_item').all();
        let prices:string[] = [];

        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let price = await item.locator(selector).textContent();
            prices[i] = price !== null ? price : '';
        }
        return prices;
    }

    async selectFilter(value:string){
        await this.getSortDropdown().selectOption(value);
    }

    arraysAreEqual(array1, array2){
        if (array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

}