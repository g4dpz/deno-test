# Docker Setup

This document explains how to run the Deno web application using Docker.

## Prerequisites

- Docker installed
- Docker Compose installed

## Quick Start

### Production Mode

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at `http://localhost:8000`

### Development Mode (with hot reload)

```bash
# Start with development configuration
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose -f docker-compose.dev.yml down
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (or use the existing one):

```env
DB_PASSWORD=your_secure_password
DB_NAME=deno_app
```

### Default Credentials

After the containers start, the database is automatically seeded with:

- **Demo User**
  - Email: demo@example.com
  - Password: password123
  - Roles: user

- **Admin User**
  - Email: admin@example.com
  - Password: admin123
  - Roles: admin, user

## Docker Commands

### Build the application image

```bash
docker-compose build
```

### Start services in background

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Stop services

```bash
docker-compose down
```

### Stop and remove volumes (deletes database data)

```bash
docker-compose down -v
```

### Restart a service

```bash
docker-compose restart app
```

### Execute commands in containers

```bash
# Access app container shell
docker-compose exec app sh

# Access MySQL
docker-compose exec mysql mysql -u root -p deno_app

# Run migrations
docker-compose exec app deno run --allow-net --allow-read --allow-env --env scripts/migrate-passwords.ts
```

## Services

### App Service
- **Container:** deno-app
- **Port:** 8000
- **Image:** Built from Dockerfile
- **Depends on:** MySQL

### MySQL Service
- **Container:** deno-app-mysql
- **Port:** 3306
- **Image:** mysql:8.0
- **Volume:** mysql_data (persistent storage)
- **Auto-initialization:** Runs schema.sql and seed.sql on first start

## Development vs Production

### Production (docker-compose.yml)
- No volume mounts (code is baked into image)
- Optimized for deployment
- Restart policy: unless-stopped

### Development (docker-compose.dev.yml)
- Volume mounts for live code changes
- Hot reload enabled with --watch flag
- Easier debugging

## Networking

Both services are on the same Docker network (`deno-network`), allowing the app to connect to MySQL using the hostname `mysql`.

## Troubleshooting

### Database connection issues

Wait for MySQL to be fully ready:
```bash
docker-compose logs mysql
```

Look for: "ready for connections"

### Application not starting

Check if MySQL is healthy:
```bash
docker-compose ps
```

### Reset everything

```bash
docker-compose down -v
docker-compose up -d
```

## Production Deployment

For production deployment:

1. Update `.env` with secure passwords
2. Consider using Docker secrets for sensitive data
3. Use a reverse proxy (nginx) for HTTPS
4. Set up proper backup for MySQL volume
5. Configure resource limits in docker-compose.yml

Example with resource limits:

```yaml
app:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
- name: Build Docker image
  run: docker-compose build

- name: Start services
  run: docker-compose up -d

- name: Wait for services
  run: sleep 10

- name: Run tests
  run: docker-compose exec -T app deno task test

- name: Stop services
  run: docker-compose down
```
