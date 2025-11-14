# Database Setup

This directory contains the database schema and seed files for the Deno web application.

## Prerequisites

- MySQL 5.7+ or MariaDB 10.3+
- MySQL client installed

## Setup Instructions

### 1. Create the database and tables

```bash
mysql -u root -p < db/schema.sql
```

### 2. Seed the database with initial data

```bash
mysql -u root -p < db/seed.sql
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=deno_app
```

## Database Schema

### Tables

- **users**: Stores user account information
  - id (INT, PRIMARY KEY)
  - email (VARCHAR, UNIQUE)
  - name (VARCHAR)
  - password (VARCHAR) - Note: Should be hashed in production
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- **roles**: Stores available roles
  - id (INT, PRIMARY KEY)
  - name (VARCHAR, UNIQUE)
  - description (VARCHAR)
  - created_at (TIMESTAMP)

- **user_roles**: Junction table for many-to-many relationship
  - user_id (INT, FOREIGN KEY)
  - role_id (INT, FOREIGN KEY)
  - assigned_at (TIMESTAMP)

- **sessions**: Stores active user sessions
  - id (VARCHAR, PRIMARY KEY)
  - user_id (INT, FOREIGN KEY)
  - created_at (TIMESTAMP)
  - expires_at (TIMESTAMP)

## Default Users

After seeding, the following users are available:

- **Demo User**
  - Email: demo@example.com
  - Password: password123
  - Roles: user

- **Admin User**
  - Email: admin@example.com
  - Password: admin123
  - Roles: admin, user

## Environment Variables

The application reads database configuration from environment variables or the `.env` file:

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_NAME` - Database name (default: deno_app)

Make sure to update the `.env` file in the project root with your MySQL credentials.

## Security Notes

⚠️ **Important**: The current implementation stores passwords in plain text for demonstration purposes. In production, you should:

1. Hash passwords using bcrypt or similar
2. Use environment variables for sensitive configuration
3. Implement password complexity requirements
4. Add session expiration
5. Use HTTPS in production
6. Implement rate limiting for login attempts
7. Never commit `.env` file to version control
