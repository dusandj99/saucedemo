import { Locator, Page } from '@playwright/test';

export class Product {

    page: Page;

    constructor(page:Page){
        this.page = page;
    }

    //---------

    public getProductName():Locator {
        return this.page.locator('.inventory_details_name');
    }

    public getProductDesc():Locator {
        return this.page.locator('.inventory_details_desc');
    }

    public getProductPrice():Locator {
        return this.page.locator('.inventory_details_price');
    }

    public getBackButton():Locator {
        return this.page.locator('#back-to-products')
    }

    public getAddToCartButton():Locator {
        return this.page.locator('#add-to-cart');
    }

    public getRemoveButton():Locator {
        return this.page.locator('#remove');
    }

    //---------

    async addItem():Promise<void>{
        this.getAddToCartButton().click();
    }

    async removeItem():Promise<void>{
        this.getRemoveButton().click();
    }

    async goBack():Promise<void>{
        this.getBackButton().click();
    }


}