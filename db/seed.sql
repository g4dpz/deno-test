-- Seed data for Deno web application
USE deno_app;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full access'),
  ('user', 'Regular user with basic access'),
  ('role1', 'Role 1 permissions'),
  ('role2', 'Role 2 permissions'),
  ('role3', 'Role 3 permissions'),
  ('role4', 'Role 4 permissions')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Insert demo users
-- Note: In production, passwords should be hashed using bcrypt or similar
INSERT INTO users (email, name, password) VALUES
  ('demo@example.com', 'Demo User', 'password123'),
  ('admin@example.com', 'Admin User', 'admin123')
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password);

-- Assign roles to users
-- Demo user gets 'user' role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'demo@example.com' AND r.name = 'user'
ON DUPLICATE KEY UPDATE assigned_at=CURRENT_TIMESTAMP;

-- Admin user gets 'admin' and 'user' roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.name IN ('admin', 'user')
ON DUPLICATE KEY UPDATE assigned_at=CURRENT_TIMESTAMP;
