import { Builder } from "npm:selenium-webdriver@4.16.0";
import { TestDSL } from "./dsl/test-dsl.ts";

const BASE_URL = Deno.env.get("TEST_BASE_URL") || "http://localhost:8000";

Deno.test({
  name: "Navigation - Home page loads",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .goToHome()
        .then(t => t.assertElementExists("page-title"))
        .then(t => t.assertElementExists("features-list"));

      console.log("✓ Home page loads test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name: "Navigation - About page loads", 
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .goToAbout()
        .then(t => t.assertElementExists("page-title"))
        .then(t => t.assertElementExists("tech-stack-section"));

      console.log("✓ About page loads test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"Navigation - Navigate between pages", 
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .goToHome()
        .then(t => t.clickLink("nav-about"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/about"))
        .then(t => t.clickLink("nav-home"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/"));

      console.log("✓ Navigate between pages test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"Navigation - Admin navigation visible for admin", 
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.assertElementExists("nav-admin-users"))
        .then(t => t.assertElementExists("nav-admin-roles"))
        .then(t => t.clickLink("nav-admin-users"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/admin/users"))
        .then(t => t.clickLink("nav-admin-roles"))
        .then(t => t.waitForNavigation())
        .then(t => t.assertUrlContains("/admin/roles"));

      console.log("✓ Admin navigation test passed");
    } finally {
      await test.close();
    }
  }
});
