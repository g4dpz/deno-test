import { send } from "jsr:@oak/oak@^17.1.3";

// Static file middleware
export const staticMiddleware = async (ctx: any, next: any) => {
  if (ctx.request.url.pathname.startsWith("/static/")) {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}`,
      index: "index.html",
    });
  } else {
    await next();
  }
};
