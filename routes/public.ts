import { Router } from "jsr:@oak/oak@^17.1.3";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";
import { hasRole } from "../utils/helpers.ts";

const handle = new Handlebars({
  baseDir: "views",
  extname: ".hbs",
  defaultLayout: "",
});

export const publicRouter = new Router();

// Home page
publicRouter.get("/", async (ctx) => {
  const user = ctx.state.session?.user;
  const data = {
    title: "Home",
    message: user ? `Welcome back, ${user.name}!` : "Welcome to Deno + Oak + Handlebars!",
    items: ["TypeScript", "Oak Framework", "Handlebars Templating"],
    user: user,
    isLoggedIn: !!user,
    isAdmin: hasRole(user, "admin"),
  };
  ctx.response.body = await handle.renderView("home", data);
  ctx.response.type = "text/html";
});

// About page
publicRouter.get("/about", async (ctx) => {
  const user = ctx.state.session?.user;
  const data = {
    title: "About",
    description: "This is a simple Deno web application demonstrating Oak and Handlebars.",
    user: user,
    isLoggedIn: !!user,
    isAdmin: hasRole(user, "admin"),
  };
  ctx.response.body = await handle.renderView("about", data);
  ctx.response.type = "text/html";
});

// API endpoint
publicRouter.get("/api/data", (ctx) => {
  ctx.response.body = {
    success: true,
    data: { timestamp: new Date().toISOString() }
  };
});
