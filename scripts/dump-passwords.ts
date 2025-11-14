import { hash, genSalt } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "../db/config.ts";

// Connect to database
const client = new Client();
await client.connect(dbConfig);
console.log("✅ Connected to MySQL database");

console.log("🔐 Dumping user passwords as bcrypt hashes (rounds: 12)...\n");

// Get all users with their plain text passwords
const users = await client.query(
  "SELECT id, email, name, password FROM users ORDER BY email"
);

const passwordDump: Array<{
  email: string;
  name: string;
  plainPassword: string;
  bcryptHash: string;
}> = [];

for (const user of users) {
  const plainPassword = String(user.password);
  
  // Generate salt with 12 rounds
  const salt = await genSalt(12);
  
  // Generate bcrypt hash with the salt
  const bcryptHash = await hash(plainPassword, salt);
  
  passwordDump.push({
    email: String(user.email),
    name: String(user.name),
    plainPassword: plainPassword,
    bcryptHash: bcryptHash,
  });
  
  console.log(`✓ ${user.email}: ${bcryptHash}`);
}

// Write to file
const outputFile = "password-dump.json";
await Deno.writeTextFile(
  outputFile,
  JSON.stringify(passwordDump, null, 2)
);

console.log(`\n✅ Password dump saved to: ${outputFile}`);
console.log(`\n⚠️  WARNING: This file contains sensitive information!`);
console.log(`   Keep it secure and delete it when no longer needed.`);

// Disconnect from database
await client.close();
console.log("❌ Disconnected from MySQL database");
