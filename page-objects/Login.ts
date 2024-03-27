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

    public getHamburgerIcon():Locator {
        return this.page.locator('#react-burger-menu-btn');
    }

    public getLogoutButton():Locator {
        return this.page.locator('#logout_sidebar_link');
    }
    //------

    async goTo():Promise<void>
    {
        await this.page.goto("https://www.saucedemo.com/");
    }

    async login():Promise<void>{
        await this.getLoginButton().click();
        await this.page.waitForLoadState('networkidle');
    }

    async emptyLogin():Promise<void>{
        await this.getUsernameInput().clear();
        await this.getPasswordInput().clear();
        await this.login();
    }

    async fillLoginForm(username: string, password:string):Promise<void>{
        await this.getUsernameInput().fill(username);
        await this.getPasswordInput().fill(password);
        await this.login();
    }

    async logOut():Promise<void> {
        await this.getHamburgerIcon().click();
        await this.getLogoutButton().click();
    }

}