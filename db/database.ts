import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { dbConfig } from "./config.ts";

export class Database {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async connect() {
    await this.client.connect(dbConfig);
    console.log("✅ Connected to MySQL database");
  }

  async disconnect() {
    await this.client.close();
    console.log("❌ Disconnected from MySQL database");
  }

  // User operations
  async getUserByEmail(email: string) {
    const result = await this.client.query(
      "SELECT id, email, name, password FROM users WHERE email = ?",
      [email]
    );
    return result.length > 0 ? result[0] : null;
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const result = await this.client.query(
      `SELECT r.name FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );
    return result.map((row: any) => row.name);
  }

  async getAllUsers() {
    const users = await this.client.query(
      "SELECT id, email, name FROM users ORDER BY email"
    );
    
    const usersWithRoles = [];
    for (const user of users) {
      const roles = await this.getUserRoles(user.id);
      usersWithRoles.push({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: roles,
      });
    }
    return usersWithRoles;
  }

  async createUser(email: string, name: string, password: string, roles: string[]) {
    // Insert user
    const result = await this.client.execute(
      "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
      [email, name, password]
    );
    const userId = result.lastInsertId;

    // Assign roles
    if (roles.length > 0) {
      await this.assignRoles(userId, roles);
    }

    return userId;
  }

  async updateUser(email: string, name: string, password: string | null, roles: string[]) {
    // Get user ID
    const user = await this.getUserByEmail(email);
    if (!user) return false;

    // Update user info
    if (password) {
      await this.client.execute(
        "UPDATE users SET name = ?, password = ? WHERE email = ?",
        [name, password, email]
      );
    } else {
      await this.client.execute(
        "UPDATE users SET name = ? WHERE email = ?",
        [name, email]
      );
    }

    // Update roles
    await this.client.execute("DELETE FROM user_roles WHERE user_id = ?", [user.id]);
    if (roles.length > 0) {
      await this.assignRoles(user.id, roles);
    }

    return true;
  }

  async deleteUser(email: string) {
    const result = await this.client.execute(
      "DELETE FROM users WHERE email = ?",
      [email]
    );
    return result.affectedRows > 0;
  }

  private async assignRoles(userId: number, roleNames: string[]) {
    for (const roleName of roleNames) {
      const roleResult = await this.client.query(
        "SELECT id FROM roles WHERE name = ?",
        [roleName]
      );
      if (roleResult.length > 0) {
        await this.client.execute(
          "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
          [userId, roleResult[0].id]
        );
      }
    }
  }

  async getAllRoles(): Promise<string[]> {
    const result = await this.client.query("SELECT name FROM roles ORDER BY name");
    return result.map((row: any) => row.name);
  }

  async getAllRolesWithDetails() {
    const result = await this.client.query(
      "SELECT id, name, description, created_at FROM roles ORDER BY name"
    );
    return result;
  }

  async getRoleByName(name: string) {
    const result = await this.client.query(
      "SELECT id, name, description FROM roles WHERE name = ?",
      [name]
    );
    return result.length > 0 ? result[0] : null;
  }

  async createRole(name: string, description: string) {
    const result = await this.client.execute(
      "INSERT INTO roles (name, description) VALUES (?, ?)",
      [name, description]
    );
    return result.lastInsertId;
  }

  async updateRole(oldName: string, newName: string, description: string) {
    const result = await this.client.execute(
      "UPDATE roles SET name = ?, description = ? WHERE name = ?",
      [newName, description, oldName]
    );
    return result.affectedRows > 0;
  }

  async deleteRole(name: string) {
    const result = await this.client.execute(
      "DELETE FROM roles WHERE name = ?",
      [name]
    );
    return result.affectedRows > 0;
  }

  async getRoleUsageCount(name: string): Promise<number> {
    const result = await this.client.query(
      `SELECT COUNT(*) as count FROM user_roles ur
       INNER JOIN roles r ON ur.role_id = r.id
       WHERE r.name = ?`,
      [name]
    );
    return result[0]?.count || 0;
  }

  // Session operations
  async createSession(sessionId: string, userId: number) {
    await this.client.execute(
      "INSERT INTO sessions (id, user_id) VALUES (?, ?)",
      [sessionId, userId]
    );
  }

  async getSession(sessionId: string) {
    const result = await this.client.query(
      `SELECT s.id, s.user_id, u.email, u.name
       FROM sessions s
       INNER JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [sessionId]
    );
    
    if (result.length === 0) return null;
    
    const session = result[0];
    const roles = await this.getUserRoles(session.user_id);
    
    return {
      id: session.id,
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        roles: roles,
      },
    };
  }

  async deleteSession(sessionId: string) {
    await this.client.execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
  }
}

// Singleton instance
export const db = new Database();
