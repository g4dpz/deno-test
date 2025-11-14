import { Router } from "jsr:@oak/oak@^17.1.3";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";
import { db } from "../db/database.ts";

const handle = new Handlebars({
  baseDir: "views",
  extname: ".hbs",
  defaultLayout: "",
});

export const authRouter = new Router();

// Login page
authRouter.get("/login", async (ctx) => {
  const data = {
    title: "Login",
    error: ctx.request.url.searchParams.get("error"),
  };
  ctx.response.body = await handle.renderView("login", data);
  ctx.response.type = "text/html";
});

// Login handler
authRouter.post("/login", async (ctx) => {
  const body = ctx.request.body;
  const formData = await body.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.getUserByEmail(email);
  if (user && user.password === password) {
    const sessionId = crypto.randomUUID();
    await db.createSession(sessionId, user.id);
    await ctx.cookies.set("session_id", sessionId, { httpOnly: true });
    ctx.response.redirect("/");
  } else {
    ctx.response.redirect("/login?error=Invalid credentials");
  }
});

// Logout handler
authRouter.get("/logout", async (ctx) => {
  const sessionId = await ctx.cookies.get("session_id");
  if (sessionId) {
    await db.deleteSession(sessionId);
    await ctx.cookies.delete("session_id");
  }
  ctx.response.redirect("/");
});
