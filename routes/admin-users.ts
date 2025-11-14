import { Router } from "jsr:@oak/oak@^17.1.3";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";
import { db } from "../db/database.ts";
import { requireAdmin } from "../middleware/auth.ts";
import { hashPassword } from "../utils/password.ts";

const handle = new Handlebars({
  baseDir: "views",
  extname: ".hbs",
  defaultLayout: "",
});

export const adminUsersRouter = new Router();

// User management page
adminUsersRouter.get("/admin/users", requireAdmin, async (ctx) => {
  const user = ctx.state.session?.user;
  const userList = await db.getAllUsers();
  const availableRoles = await db.getAllRoles();
  
  const usersWithRolesString = userList.map(u => ({
    ...u,
    rolesString: u.roles.join(", "),
  }));
  
  const data = {
    title: "User Management",
    user: user,
    isLoggedIn: true,
    isAdmin: true,
    users: usersWithRolesString,
    availableRoles: availableRoles,
  };
  ctx.response.body = await handle.renderView("admin-users", data);
  ctx.response.type = "text/html";
});

// Create user
adminUsersRouter.post("/admin/users/create", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const roles = formData.getAll("roles") as string[];

  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    ctx.response.redirect("/admin/users?error=User already exists");
  } else {
    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    await db.createUser(email, name, hashedPassword, roles);
    ctx.response.redirect("/admin/users?success=User created");
  }
});

// Update user
adminUsersRouter.post("/admin/users/update", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const roles = formData.getAll("roles") as string[];

  // Hash password if provided
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  const updated = await db.updateUser(email, name, hashedPassword, roles);
  if (updated) {
    ctx.response.redirect("/admin/users?success=User updated");
  } else {
    ctx.response.redirect("/admin/users?error=User not found");
  }
});

// Delete user
adminUsersRouter.post("/admin/users/delete", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const email = formData.get("email") as string;

  const deleted = await db.deleteUser(email);
  if (deleted) {
    ctx.response.redirect("/admin/users?success=User deleted");
  } else {
    ctx.response.redirect("/admin/users?error=User not found");
  }
});
