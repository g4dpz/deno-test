// Database configuration
export const dbConfig = {
  hostname: Deno.env.get("DB_HOST") || "localhost",
  port: parseInt(Deno.env.get("DB_PORT") || "3306"),
  username: Deno.env.get("DB_USER") || "denoapp",
  password: Deno.env.get("DB_PASSWORD") || "denopassword",
  db: Deno.env.get("DB_NAME") || "deno_app",
};
