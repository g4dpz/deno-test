import { Builder } from "npm:selenium-webdriver@4.16.0";
import { TestDSL } from "./dsl/test-dsl.ts";

const BASE_URL = Deno.env.get("TEST_BASE_URL") || "http://localhost:8000";

Deno.test({
  name:"User Management - Create new user", 
  sanitizeResources: false,
  sanitizeOps: false,
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminUsers())
        .then(t => t.createUser(testEmail, "Test User", "testpass123", ["user"]))
        .then(t => t.assertSuccessMessage())
        .then(t => t.assertUserInTable(testEmail));

      console.log("✓ Create new user test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"User Management - Update user",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
  
  }
});

Deno.test({
  name:"User Management - Delete user", 
  sanitizeResources: false,
  sanitizeOps: false,
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const testEmail = `test-delete-${Date.now()}@example.com`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminUsers())
        .then(t => t.createUser(testEmail, "To Delete", "testpass123", ["user"]))
        .then(t => t.assertUserInTable(testEmail))
        .then(t => t.deleteUser(testEmail))
        .then(t => t.assertSuccessMessage());

      console.log("✓ Delete user test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"User Management - Assign multiple roles",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const testEmail = `test-roles-${Date.now()}@example.com`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminUsers())
        .then(t => t.createUser(testEmail, "Multi Role User", "testpass123", ["user", "admin", "role1"]))
        .then(t => t.assertSuccessMessage())
        .then(t => t.assertUserInTable(testEmail));

      console.log("✓ Assign multiple roles test passed");
    } finally {
      await test.close();
    }
  }
});
