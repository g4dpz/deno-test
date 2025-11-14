import { Router } from "jsr:@oak/oak@^17.1.3";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";
import { hasRole } from "../utils/helpers.ts";

const handle = new Handlebars({
  baseDir: "views",
  extname: ".hbs",
  defaultLayout: "",
});

export const resourcesRouter = new Router();

// Documentation page
resourcesRouter.get("/resources/documentation", async (ctx) => {
  const user = ctx.state.session?.user;
  const data = {
    title: "Documentation",
    user: user,
    isLoggedIn: !!user,
    isAdmin: hasRole(user, "admin"),
  };
  ctx.response.body = await handle.renderView("resources-documentation", data);
  ctx.response.type = "text/html";
});

// Tutorials page
resourcesRouter.get("/resources/tutorials", async (ctx) => {
  const user = ctx.state.session?.user;
  const data = {
    title: "Tutorials",
    user: user,
    isLoggedIn: !!user,
    isAdmin: hasRole(user, "admin"),
  };
  ctx.response.body = await handle.renderView("resources-tutorials", data);
  ctx.response.type = "text/html";
});

// Support page
resourcesRouter.get("/resources/support", async (ctx) => {
  const user = ctx.state.session?.user;
  const data = {
    title: "Support",
    user: user,
    isLoggedIn: !!user,
    isAdmin: hasRole(user, "admin"),
  };
  ctx.response.body = await handle.renderView("resources-support", data);
  ctx.response.type = "text/html";
});
