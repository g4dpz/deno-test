import { Builder } from "npm:selenium-webdriver@4.16.0";
import { TestDSL } from "./dsl/test-dsl.ts";

const BASE_URL = Deno.env.get("TEST_BASE_URL") || "http://localhost:8000";

Deno.test({
  name: "Authentication - Login with valid credentials",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .goToLogin()
        .then(t => t.fillField("login-email", "demo@example.com"))
        .then(t => t.fillField("login-password", "password123"))
        .then(t => t.clickButton("login-submit-btn"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertLoggedIn())
        .then(t => t.assertUrlContains("/"))
        .then(t => t.assertTextContains("welcome-message", "Welcome back"));

      console.log("✓ Login with valid credentials test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name: "Authentication - Login with invalid credentials",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .goToLogin()
        .then(t => t.fillField("login-email", "invalid@example.com"))
        .then(t => t.fillField("login-password", "wrongpassword"))
        .then(t => t.clickButton("login-submit-btn"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/login"))
        .then(t => t.assertLoginErrorMessage());

      console.log("✓ Login with invalid credentials test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name: "Authentication - Logout",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .login("demo@example.com", "password123")
        .then(t => t.assertLoggedIn())
        .then(t => t.logout())
        .then(t => t.assertLoggedOut())
        .then(t => t.assertUrlContains("/"));

      console.log("✓ Logout test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name: "Authentication - Admin access",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.assertLoggedIn())
        .then(t => t.assertIsAdmin())
        .then(t => t.goToAdminUsers())
        .then(t => t.assertUrlContains("/admin/users"));

      console.log("✓ Admin access test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name: "Authentication - Non-admin cannot access admin pages",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .login("demo@example.com", "password123")
        .then(t => t.assertLoggedIn())
        .then(t => t.goToAdminUsers())
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/login"));

      console.log("✓ Non-admin access restriction test passed");
    } finally {
      await test.close();
    }
  }
});
