import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "../db/config.ts";
import { hashPassword, isPasswordHashed } from "../utils/password.ts";

// Connect to database
const client = new Client();
await client.connect(dbConfig);
console.log("✅ Connected to MySQL database");

console.log("🔄 Migrating plain text passwords to bcrypt (rounds: 12)...\n");

// Get all users with their passwords
const users = await client.query(
  "SELECT id, email, name, password FROM users ORDER BY email"
);

let migratedCount = 0;
let skippedCount = 0;

for (const user of users) {
  const email = String(user.email);
  const plainPassword = String(user.password);
  
  // Check if password is already hashed
  if (isPasswordHashed(plainPassword)) {
    console.log(`⏭️  ${email}: Already hashed, skipping`);
    skippedCount++;
    continue;
  }
  
  // Hash the plain text password
  const hashedPassword = await hashPassword(plainPassword);
  
  // Update in database
  await client.execute(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email]
  );
  
  console.log(`✓ ${email}: Migrated to bcrypt`);
  migratedCount++;
}

console.log(`\n✅ Migration complete!`);
console.log(`   Migrated: ${migratedCount} user(s)`);
console.log(`   Skipped: ${skippedCount} user(s) (already hashed)`);

// Disconnect from database
await client.close();
console.log("❌ Disconnected from MySQL database");
