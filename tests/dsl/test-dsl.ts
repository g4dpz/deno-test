import { WebDriver, By, until, Key } from "npm:selenium-webdriver@4.16.0";

/**
 * Domain-Specific Language for testing the Deno web application
 * Provides a fluent API for common test operations
 */
export class TestDSL {
  constructor(private driver: WebDriver, private baseUrl: string) {}

  // Navigation
  async goToHome() {
    await this.driver.get(this.baseUrl);
    return this;
  }

  async goToLogin() {
    await this.driver.get(`${this.baseUrl}/login`);
    return this;
  }

  async goToAbout() {
    await this.driver.get(`${this.baseUrl}/about`);
    return this;
  }

  async goToAdminUsers() {
    await this.driver.get(`${this.baseUrl}/admin/users`);
    return this;
  }

  async goToAdminRoles() {
    await this.driver.get(`${this.baseUrl}/admin/roles`);
    return this;
  }

  async clickLink(id: string) {
    await this.driver.findElement(By.id(id)).click();
    return this;
  }

  // Authentication
  async login(email: string, password: string) {
    await this.goToLogin();
    await this.fillField("login-email", email);
    await this.fillField("login-password", password);
    await this.clickButton("login-submit-btn");
    await this.waitForNavigation();
    return this;
  }

  async logout() {
    await this.clickLink("nav-logout");
    await this.waitForNavigation();
    return this;
  }

  // Form interactions
  async fillField(id: string, value: string) {
    const element = await this.driver.findElement(By.id(id));
    await element.clear();
    await element.sendKeys(value);
    return this;
  }

  async clickButton(id: string) {
    await this.driver.findElement(By.id(id)).click();
    return this;
  }

  async checkCheckbox(id: string) {
    const checkbox = await this.driver.findElement(By.id(id));
    const isChecked = await checkbox.isSelected();
    if (!isChecked) {
      await checkbox.click();
    }
    return this;
  }

  async uncheckCheckbox(id: string) {
    const checkbox = await this.driver.findElement(By.id(id));
    const isChecked = await checkbox.isSelected();
    if (isChecked) {
      await checkbox.click();
    }
    return this;
  }

  // User management
  async createUser(email: string, name: string, password: string, roles: string[]) {
    await this.fillField("create-user-email", email);
    await this.fillField("create-user-name", name);
    await this.fillField("create-user-password", password);
    
    for (const role of roles) {
      await this.checkCheckbox(`create-role-${role}`);
    }
    
    await this.clickButton("create-user-submit-btn");
    await this.waitForNavigation();
    return this;
  }

  async deleteUser(email: string) {
    await this.clickButton(`delete-user-${email}`);
    await this.driver.switchTo().alert().accept();
    await this.waitForNavigation();
    return this;
  }

  async editUser(email: string) {
    await this.clickButton(`edit-user-${email}`);
    await this.waitForModal("edit-user-modal");
    return this;
  }

  async updateUser(name: string, password: string, roles: string[]) {
    await this.fillField("edit-user-name", name);
    if (password) {
      await this.fillField("edit-user-password", password);
    }
    
    // Uncheck all roles first
    const checkboxes = await this.driver.findElements(By.className("edit-role-checkbox"));
    for (const checkbox of checkboxes) {
      const isChecked = await checkbox.isSelected();
      if (isChecked) {
        await checkbox.click();
      }
    }
    
    // Check selected roles
    for (const role of roles) {
      await this.checkCheckbox(`edit-role-${role}`);
    }
    
    await this.clickButton("edit-user-submit-btn");
    await this.waitForNavigation();
    return this;
  }

  // Role management
  async createRole(name: string, description: string) {
    await this.fillField("create-role-name", name);
    await this.fillField("create-role-description", description);
    await this.clickButton("create-role-submit-btn");
    await this.waitForNavigation();
    return this;
  }

  async deleteRole(name: string) {
    await this.clickButton(`delete-role-${name}`);
    await this.driver.switchTo().alert().accept();
    await this.waitForNavigation();
    return this;
  }

  async editRole(name: string) {
    await this.clickButton(`edit-role-${name}`);
    await this.waitForModal("edit-role-modal");
    return this;
  }

  async updateRole(name: string, description: string) {
    await this.fillField("edit-role-name", name);
    await this.fillField("edit-role-description", description);
    await this.clickButton("edit-role-submit-btn");
    await this.waitForNavigation();
    return this;
  }

  // Assertions
  async assertElementExists(id: string) {
    const element = await this.driver.findElement(By.id(id));
    if (!element) {
      throw new Error(`Element with id '${id}' not found`);
    }
    return this;
  }

  async assertElementNotExists(id: string) {
    try {
      await this.driver.findElement(By.id(id));
      throw new Error(`Element with id '${id}' should not exist`);
    } catch (error: any) {
      if (error.name === "NoSuchElementError") {
        return this;
      }
      throw error;
    }
  }

  async assertTextContains(id: string, text: string) {
    const element = await this.driver.findElement(By.id(id));
    const elementText = await element.getText();
    if (!elementText.includes(text)) {
      throw new Error(`Element '${id}' text '${elementText}' does not contain '${text}'`);
    }
    return this;
  }

  async assertUrlContains(path: string) {
    const currentUrl = await this.driver.getCurrentUrl();
    if (!currentUrl.includes(path)) {
      throw new Error(`URL '${currentUrl}' does not contain '${path}'`);
    }
    return this;
  }

  async assertSuccessMessage() {
    await this.assertElementExists("success-message");
    return this;
  }

  async assertLoginErrorMessage() {
    await this.assertElementExists("login-error-message");
    return this;
  }

  async assertLoggedIn() {
    await this.assertElementExists("user-info-display");
    await this.assertElementExists("nav-logout");
    return this;
  }

  async assertLoggedOut() {
    await this.assertElementExists("nav-login");
    return this;
  }

  async assertIsAdmin() {
    await this.assertElementExists("nav-admin-users");
    await this.assertElementExists("nav-admin-roles");
    return this;
  }

  async assertUserInTable(email: string) {
    const rows = await this.driver.findElements(By.css(`tr[data-user-email="${email}"]`));
    if (rows.length === 0) {
      throw new Error(`User '${email}' not found in table`);
    }
    return this;
  }

  async assertRoleInTable(name: string) {
    const rows = await this.driver.findElements(By.css(`tr[data-role-name="${name}"]`));
    if (rows.length === 0) {
      throw new Error(`Role '${name}' not found in table`);
    }
    return this;
  }

  // Utilities
  async waitForNavigation() {
    await this.driver.sleep(500); // Wait for navigation to complete
    return this;
  }

  async waitForModal(id: string) {
    await this.driver.wait(until.elementLocated(By.id(id)), 5000);
    await this.driver.wait(
      until.elementIsVisible(await this.driver.findElement(By.id(id))),
      5000
    );
    return this;
  }

  async takeScreenshot(filename: string) {
    const screenshot = await this.driver.takeScreenshot();
    // Decode base64 string to Uint8Array
    const binaryString = atob(screenshot);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    await Deno.writeFile(filename, bytes);
    return this;
  }

  async close() {
    await this.driver.quit();
  }
}
