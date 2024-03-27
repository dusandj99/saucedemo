import { Locator, Page } from '@playwright/test';

export class CheckoutOverview {

    page:Page;

    constructor(page:Page){
        this.page = page;
    }

    //-----

    public getFinishButton():Locator {
        return this.page.locator('#finish');
    }

    public getCartList():Locator {
        return this.page.locator('.cart_list');
    }

    public getItemTotal():Locator {
        return this.page.locator('.summary_subtotal_label');
    }

    //-----

    async finishCheckout():Promise<void>{
        await this.getFinishButton().click();
    }

    async isItemInOverview(itemName:string):Promise<boolean>{

        let overviewItems = await this.getCartList().locator('.inventory_item_name').all();
        for(let i = 0; i < overviewItems.length; i++){
            if(await overviewItems[i].textContent() === itemName)
                return true;
        }
        return false;
    }

    async getOverviewTotalPrice():Promise<number>{
        let overviewItems = await this.getCartList().locator('.inventory_item_price').all();
        let total = 0;
        for(let i = 0; i < overviewItems.length; i++){
            let price = await overviewItems[i].textContent();
            total += price !== null ? parseFloat(price.slice(1)) : 0;
        }
        return total;
    }
}