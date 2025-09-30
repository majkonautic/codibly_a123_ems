# Docker Setup for EMS-SCADA

Your Next.js application is now fully dockerized! Here's how to use it:

## Quick Start Commands

### Development Environment
```bash
# Start development environment with hot reload
npm run docker:dev

# Stop development environment
npm run docker:dev:down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Environment
```bash
# Build and start production environment
npm run docker:prod

# Stop production environment
npm run docker:prod:down

# View logs
docker-compose logs -f
```

## Direct Docker Commands

### Development
```bash
# Build development image
docker build -f Dockerfile.dev -t ems-scada:dev .

# Run development container
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Or use docker-compose
docker-compose up --build
```

## Access Your Application

- **Development**: http://localhost:3002 (with hot reload)
- **Production**: http://localhost:3002 (optimized build)

## Features

- ✅ Multi-stage Docker builds for optimized production images
- ✅ Development environment with hot reload and file watching
- ✅ Persistent SQLite database using Docker volumes
- ✅ Proper handling of Next.js standalone output
- ✅ Prisma database generation included
- ✅ Environment variable support
- ✅ Optimized .dockerignore for faster builds

## Database

The SQLite database persists in a Docker volume called `ems-scada_sqlite_data`, so your data won't be lost when containers are stopped/restarted.

## Rebuilding After Changes

If you make changes to your code:

**Development**: Files are auto-synced and the app will reload automatically

**Production**: Rebuild the image:
```bash
docker-compose down
docker-compose up --build
```