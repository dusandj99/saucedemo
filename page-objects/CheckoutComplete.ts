import { Locator, Page } from '@playwright/test';

export class CheckoutComplete {

    page:Page;

    constructor(page:Page){
        this.page = page;
    }

    //-----

    public getBackButtom():Locator {
        return this.page.locator('#back-to-products');
    }

    public getOrderMessage():Locator {
        return this.page.locator('.complete-header');
    }

    //-----

    async backHome():Promise<void>{
        await this.getBackButtom().click();
    }

}