# Deno Web Application

A web application built with Deno, Oak, Handlebars, TypeScript, and MySQL.

## Prerequisites

- [Deno](https://deno.land/) installed on your system
- MySQL 5.7+ or MariaDB 10.3+
- MySQL client

## Database Setup

### 1. Create the database schema

```bash
mysql -u root -p < db/schema.sql
```

### 2. Seed the database with initial data

```bash
mysql -u root -p < db/seed.sql
```

### 3. Configure environment variables

Edit the `.env` file with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=deno_app
```

**Note:** Deno will automatically load the `.env` file when you use the `--env` flag (already configured in `deno.json` tasks).

## Getting Started

### Development Mode (with auto-reload)
```bash
deno task dev
```

### Production Mode
```bash
deno task start
```

**Alternative:** You can also set environment variables directly:

```bash
DB_HOST=localhost DB_USER=myuser DB_PASSWORD=mypass deno task start
```

The server will start on `http://localhost:8000`

## Default Users

After seeding the database:

- **Demo User**
  - Email: demo@example.com
  - Password: password123
  - Roles: user

- **Admin User**
  - Email: admin@example.com
  - Password: admin123
  - Roles: admin, user

## Routes

- `/` - Home page
- `/about` - About page
- `/login` - Login page
- `/logout` - Logout
- `/admin/users` - User management (admin only)
- `/api/data` - JSON API endpoint

## Project Structure

```
.
├── deno.json          # Deno configuration and tasks
├── main.ts            # Application entry point
├── db/
│   ├── schema.sql     # Database schema
│   ├── seed.sql       # Initial data
│   ├── database.ts    # Database operations
│   ├── config.ts      # Database configuration
│   └── README.md      # Database documentation
├── views/
│   ├── home.hbs       # Home page template
│   ├── about.hbs      # About page template
│   ├── login.hbs      # Login page template
│   └── admin-users.hbs # Admin user management
├── static/
│   └── styles.css     # Application styles
└── README.md
```

## Features

- TypeScript support out of the box
- Oak middleware framework
- Handlebars templating
- MySQL database integration
- User authentication with sessions
- Role-based access control (multiple roles per user)
- Admin panel for user management (CRUD operations)
- Hot reload in development mode
- Selenium-ready test IDs on all interactive elements
