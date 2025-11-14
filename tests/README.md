# Selenium Tests with Domain-Specific Language

Automated end-to-end tests for the Deno web application using Selenium WebDriver and a custom DSL.

## Prerequisites

- Chrome browser installed
- ChromeDriver installed and in PATH
- MySQL database set up and running
- **Application must be running before tests** on `http://localhost:8000`

## Installation

ChromeDriver is automatically managed by Selenium WebDriver. No additional installation needed.

## Setup Before Running Tests

### 1. Start the application in a separate terminal

```bash
# Terminal 1 - Start the application
deno task start
```

Wait for the message: `🦕 Server running on http://localhost:8000`

### 2. Run the tests in another terminal

```bash
# Terminal 2 - Run tests
deno task test
```

## Running Tests

### Run all tests (manual - requires server running)
```bash
deno task test
```

### Run all tests (automatic - starts and stops server)
```bash
deno task test:all
```

### Run specific test file
```bash
deno task test:auth
deno task test:users
deno task test:roles
deno task test:nav
```

### Run with custom base URL
```bash
TEST_BASE_URL=http://localhost:3000 deno task test
```

## Quick Start

**Option 1: Manual (recommended for development)**
```bash
# Terminal 1
deno task start

# Terminal 2
deno task test
```

**Option 2: Automatic (for CI/CD)**
```bash
deno task test:all
```

## Test Structure

### Domain-Specific Language (DSL)

The `TestDSL` class in `dsl/test-dsl.ts` provides a fluent API for testing:

```typescript
await test
  .login("admin@example.com", "admin123")
  .then(t => t.goToAdminUsers())
  .then(t => t.createUser("new@example.com", "New User", "pass123", ["user"]))
  .then(t => t.assertSuccessMessage());
```

### DSL Methods

**Navigation:**
- `goToHome()` - Navigate to home page
- `goToLogin()` - Navigate to login page
- `goToAbout()` - Navigate to about page
- `goToAdminUsers()` - Navigate to user management
- `goToAdminRoles()` - Navigate to role management
- `clickLink(id)` - Click a navigation link

**Authentication:**
- `login(email, password)` - Log in with credentials
- `logout()` - Log out current user

**Form Interactions:**
- `fillField(id, value)` - Fill a form field
- `clickButton(id)` - Click a button
- `checkCheckbox(id)` - Check a checkbox
- `uncheckCheckbox(id)` - Uncheck a checkbox

**User Management:**
- `createUser(email, name, password, roles)` - Create a new user
- `editUser(email)` - Open edit modal for user
- `updateUser(name, password, roles)` - Update user details
- `deleteUser(email)` - Delete a user

**Role Management:**
- `createRole(name, description)` - Create a new role
- `editRole(name)` - Open edit modal for role
- `updateRole(name, description)` - Update role details
- `deleteRole(name)` - Delete a role

**Assertions:**
- `assertElementExists(id)` - Assert element is present
- `assertElementNotExists(id)` - Assert element is not present
- `assertTextContains(id, text)` - Assert element contains text
- `assertUrlContains(path)` - Assert URL contains path
- `assertSuccessMessage()` - Assert success message is shown
- `assertLoginErrorMessage()` - Assert login error message is shown
- `assertLoggedIn()` - Assert user is logged in
- `assertLoggedOut()` - Assert user is logged out
- `assertIsAdmin()` - Assert user has admin access
- `assertUserInTable(email)` - Assert user exists in table
- `assertRoleInTable(name)` - Assert role exists in table

**Utilities:**
- `waitForNavigation()` - Wait for page navigation
- `waitForModal(id)` - Wait for modal to appear
- `takeScreenshot(filename)` - Take a screenshot
- `close()` - Close the browser

## Test Files

- `auth.test.ts` - Authentication tests (login, logout, access control)
- `user-management.test.ts` - User CRUD operations
- `role-management.test.ts` - Role CRUD operations
- `navigation.test.ts` - Page navigation and UI tests

## Writing New Tests

Example test using the DSL:

```typescript
import { Builder } from "npm:selenium-webdriver@4.16.0";
import { TestDSL } from "./dsl/test-dsl.ts";

const BASE_URL = Deno.env.get("TEST_BASE_URL") || "http://localhost:8000";

Deno.test("My custom test", async () => {
  const driver = await new Builder().forBrowser("chrome").build();
  const test = new TestDSL(driver, BASE_URL);

  try {
    await test
      .goToHome()
      .then(t => t.assertElementExists("page-title"))
      .then(t => t.login("admin@example.com", "admin123"))
      .then(t => t.assertLoggedIn());

    console.log("✓ My custom test passed");
  } finally {
    await test.close();
  }
});
```

## Debugging

To take screenshots during test execution:

```typescript
await test.takeScreenshot("screenshot.png");
```

## Troubleshooting

### Error: ERR_CONNECTION_REFUSED

This means the application is not running. Make sure to:
1. Start the application: `deno task start`
2. Wait for the server to be ready (you should see "🦕 Server running on http://localhost:8000")
3. Then run tests in a separate terminal

### Error: ChromeDriver not found

Install ChromeDriver:
- **macOS**: `brew install chromedriver`
- **Linux**: Download from https://chromedriver.chromium.org/
- **Windows**: Download from https://chromedriver.chromium.org/

### Tests are flaky

Increase wait times in the DSL if tests are failing intermittently:
```typescript
await this.driver.sleep(1000); // Increase from 500ms
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Setup Database
  run: mysql -u root -p < db/schema.sql && mysql -u root -p < db/seed.sql

- name: Run E2E Tests
  run: deno task test:all
```

Or manually:

```yaml
- name: Start Application
  run: deno task start &

- name: Wait for Server
  run: sleep 5

- name: Run Tests
  run: deno task test
```
