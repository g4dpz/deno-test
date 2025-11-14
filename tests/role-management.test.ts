import { Builder } from "npm:selenium-webdriver@4.16.0";
import { TestDSL } from "./dsl/test-dsl.ts";

const BASE_URL = Deno.env.get("TEST_BASE_URL") || "http://localhost:8000";

Deno.test({
  name:"Role Management - Create new role",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const roleName = `testrole-${Date.now()}`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminRoles())
        .then(t => t.createRole(roleName, "Test role description"))
        .then(t => t.assertSuccessMessage())
        .then(t => t.assertRoleInTable(roleName));

      console.log("✓ Create new role test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"Role Management - Update role",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const roleName = `testrole-update-${Date.now()}`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminRoles())
        .then(t => t.createRole(roleName, "Original description"))
        .then(t => t.editRole(roleName))
        .then(t => t.updateRole(roleName, "Updated description"))
        .then(t => t.assertSuccessMessage());

      console.log("✓ Update role test passed");
    } finally {
      await test.close();
    }
  }
});

Deno.test({
  name:"Role Management - Delete role",
  sanitizeResources: false,
  sanitizeOps: false, 
  fn:async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    const test = new TestDSL(driver, BASE_URL);

    try {
      const roleName = `testrole-delete-${Date.now()}`;
      
      await test
        .login("admin@example.com", "admin123")
        .then(t => t.goToAdminRoles())
        .then(t => t.createRole(roleName, "To be deleted"))
        .then(t => t.assertRoleInTable(roleName))
        .then(t => t.deleteRole(roleName))
        .then(t => t.assertSuccessMessage());

      console.log("✓ Delete role test passed");
    } finally {
      await test.close();
    }
  }
});
