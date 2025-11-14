import { db } from "../db/database.ts";

// Session middleware
export const sessionMiddleware = async (ctx: any, next: any) => {
  const sessionId = await ctx.cookies.get("session_id");
  ctx.state.session = sessionId ? await db.getSession(sessionId) : null;
  await next();
};
