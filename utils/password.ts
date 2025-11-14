import { hash, genSalt, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const BCRYPT_ROUNDS = 12;

/**
 * Hash a password using bcrypt with 12 rounds
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await genSalt(BCRYPT_ROUNDS);
  return await hash(plainPassword, salt);
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Check if a password is already hashed (bcrypt format)
 */
export function isPasswordHashed(password: string): boolean {
  return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
}
