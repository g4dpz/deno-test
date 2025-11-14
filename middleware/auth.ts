import { hasRole } from "../utils/helpers.ts";

// Admin middleware
export const requireAdmin = async (ctx: any, next: any) => {
  const user = ctx.state.session?.user;
  if (!user || !hasRole(user, "admin")) {
    ctx.response.status = 403;
    ctx.response.redirect("/login?error=Admin access required");
    return;
  }
  await next();
};
