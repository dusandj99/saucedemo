import { Locator, Page } from '@playwright/test';

export class Login {

    page: Page;

    constructor(page: Page){
        this.page = page;
    }
    //------
    public getUsernameInput():Locator {
        return this.page.locator('#user-name');
    }

    public getPasswordInput():Locator {
        return this.page.locator('#password');
    }

    public getLoginButton():Locator {
        return this.page.locator('#login-button');
    }

    public getErrorMessage():Locator {
        return this.page.locator('h3');
    }
    //------

    async goTo()
    {
        await this.page.goto("https://www.saucedemo.com/");
    }

    async login(){
        await this.getLoginButton().click();
        await this.page.waitForLoadState('networkidle');
    }

    async emptyLogin(){
        await this.getUsernameInput().clear();
        await this.getPasswordInput().clear();
        await this.login();
    }

    async fillLoginForm(username: string, password:string){
        await this.getUsernameInput().fill(username);
        await this.getPasswordInput().fill(password);
        await this.login();
    }
 
}