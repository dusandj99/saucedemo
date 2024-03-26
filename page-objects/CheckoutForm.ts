import { Locator, Page } from '@playwright/test';

export class CheckoutForm {

    page:Page;

    constructor(page:Page){
        this.page = page;
    }

    //-----

    public getFirstnameInput():Locator {
        return this.page.locator('#first-name');
    }

    public getLastnameInput():Locator {
        return this.page.locator('#last-name');
    }

    public getZipInput():Locator {
        return this.page.locator('#postal-code');
    }

    public getContinueButton():Locator {
        return this.page.locator('#continue');
    }

    public getErrorMessage():Locator {
        return this.page.locator('[data-test="error"]');
    }

    //-----

    async continueWithCheckout(){
        await this.getContinueButton().click();
    }

    async fillCheckoutForm(firstname:string, lastname:string, zip:string){

        await this.getFirstnameInput().fill(firstname);
        await this.getLastnameInput().fill(lastname);
        await this.getZipInput().fill(zip);
    }
    
    async emptyCheckoutForm(){
        await this.getFirstnameInput().clear();
        await this.getLastnameInput().clear();
        await this.continueWithCheckout();
    }
}