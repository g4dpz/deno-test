import { Router } from "jsr:@oak/oak@^17.1.3";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";
import { db } from "../db/database.ts";
import { requireAdmin } from "../middleware/auth.ts";

const handle = new Handlebars({
  baseDir: "views",
  extname: ".hbs",
  defaultLayout: "",
});

export const adminRolesRouter = new Router();

// Role management page
adminRolesRouter.get("/admin/roles", requireAdmin, async (ctx) => {
  const user = ctx.state.session?.user;
  const roles = await db.getAllRolesWithDetails();
  
  const rolesWithUsage = [];
  for (const role of roles) {
    const usageCount = await db.getRoleUsageCount(role.name);
    rolesWithUsage.push({
      ...role,
      usageCount: usageCount,
    });
  }
  
  const data = {
    title: "Role Management",
    user: user,
    isLoggedIn: true,
    isAdmin: true,
    roles: rolesWithUsage,
    error: ctx.request.url.searchParams.get("error"),
    success: ctx.request.url.searchParams.get("success"),
  };
  ctx.response.body = await handle.renderView("admin-roles", data);
  ctx.response.type = "text/html";
});

// Create role
adminRolesRouter.post("/admin/roles/create", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const existingRole = await db.getRoleByName(name);
  if (existingRole) {
    ctx.response.redirect("/admin/roles?error=Role already exists");
  } else {
    await db.createRole(name, description);
    ctx.response.redirect("/admin/roles?success=Role created");
  }
});

// Update role
adminRolesRouter.post("/admin/roles/update", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const oldName = formData.get("oldName") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const updated = await db.updateRole(oldName, name, description);
  if (updated) {
    ctx.response.redirect("/admin/roles?success=Role updated");
  } else {
    ctx.response.redirect("/admin/roles?error=Role not found");
  }
});

// Delete role
adminRolesRouter.post("/admin/roles/delete", requireAdmin, async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const name = formData.get("name") as string;

  const usageCount = await db.getRoleUsageCount(name);
  if (usageCount > 0) {
    ctx.response.redirect(`/admin/roles?error=Cannot delete role: ${usageCount} user(s) assigned`);
  } else {
    const deleted = await db.deleteRole(name);
    if (deleted) {
      ctx.response.redirect("/admin/roles?success=Role deleted");
    } else {
      ctx.response.redirect("/admin/roles?error=Role not found");
    }
  }
});
