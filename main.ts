import { Application } from "jsr:@oak/oak@^17.1.3";
import { db } from "./db/database.ts";
import { sessionMiddleware } from "./middleware/session.ts";
import { staticMiddleware } from "./middleware/static.ts";
import { publicRouter } from "./routes/public.ts";
import { authRouter } from "./routes/auth.ts";
import { adminUsersRouter } from "./routes/admin-users.ts";
import { adminRolesRouter } from "./routes/admin-roles.ts";

const app = new Application();

// Connect to database
await db.connect();

// Apply middleware
app.use(sessionMiddleware);
app.use(staticMiddleware);

// Apply routes
app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(adminUsersRouter.routes());
app.use(adminUsersRouter.allowedMethods());
app.use(adminRolesRouter.routes());
app.use(adminRolesRouter.allowedMethods());

// Start server
const PORT = 8000;
console.log(`🦕 Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
