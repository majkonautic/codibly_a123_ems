# A123 EMS Deployment Guide

## Prerequisites

- Docker image built and saved: `a123-ems.tar.gz`
- EC2 instance running at: `54.87.55.141`
- SSH access to EC2 instance
- Domain configured: `a123systems.dev` → `44.198.74.215`

## Deployment Steps

### 1. Prepare Environment Variables

Edit `.env.production` and update the following values:

```bash
# Generate a secure PostgreSQL password
POSTGRES_PASSWORD=<your-secure-password>

# Generate a secure NextAuth secret (min 32 characters)
NEXTAUTH_SECRET=<your-secure-secret>

# Update the database URL with your PostgreSQL password
DATABASE_URL=postgresql://a123user:<your-secure-password>@db:5432/a123_ems?schema=public
```

### 2. Deploy to EC2

Run the deployment script:

```bash
./deploy.sh
```

This script will:
- Upload the Docker image to EC2
- Upload docker-compose.yml and .env files
- Load the Docker image on EC2
- Start the containers using docker-compose
- Display deployment status

### 3. Set Up Nginx Reverse Proxy

SSH into the EC2 instance:

```bash
ssh ubuntu@54.87.55.141
cd /home/ubuntu/a123-ems
```

Copy the Nginx setup script and configuration:

```bash
# From your local machine
scp nginx.conf ubuntu@54.87.55.141:/home/ubuntu/a123-ems/
scp setup-nginx.sh ubuntu@54.87.55.141:/home/ubuntu/a123-ems/
```

On the EC2 instance, run:

```bash
chmod +x setup-nginx.sh
sudo ./setup-nginx.sh
```

### 4. Configure SSL with Let's Encrypt

On the EC2 instance:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d a123systems.dev.codibly.com -d a123systems.dev
```

### 5. Verify Deployment

Check container status:

```bash
docker-compose ps
docker-compose logs -f app
```

Test the application:
- HTTP: http://54.87.55.141:3000
- HTTPS: https://a123systems.dev.codibly.com

## Docker Image Details

- **Image**: `krajewskim/a123-ems:latest`
- **Platforms**: linux/amd64, linux/arm64
- **Size**: ~1.5GB (compressed)

## Services

### Application Container (`app`)
- Port: 3000
- Environment: Production
- Depends on: PostgreSQL database

### Database Container (`db`)
- Image: PostgreSQL 15 Alpine
- Port: 5432
- Data: Persistent volume (`postgres_data`)

## Security Checklist

- [ ] Update `.env` with secure passwords and secrets
- [ ] Configure SSL certificate with Let's Encrypt
- [ ] Update EC2 security group to allow ports 80 and 443
- [ ] Restrict PostgreSQL port (5432) to localhost only
- [ ] Enable firewall (UFW) on EC2:
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

## Maintenance

### View Logs
```bash
docker-compose logs -f app
docker-compose logs -f db
```

### Restart Services
```bash
docker-compose restart
```

### Update Application
```bash
# Stop containers
docker-compose down

# Pull new image or load new tar
docker load < a123-ems-new.tar.gz

# Start containers
docker-compose up -d
```

### Database Backup
```bash
docker-compose exec db pg_dump -U a123user a123_ems > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
cat backup.sql | docker-compose exec -T db psql -U a123user a123_ems
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs app
docker-compose logs db
```

### Database connection issues
1. Check database container is running: `docker-compose ps`
2. Verify DATABASE_URL in `.env`
3. Check database logs: `docker-compose logs db`

### Nginx issues
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/a123-ems-error.log
```

## Monitoring

Set up monitoring for:
- Container health: `docker-compose ps`
- Disk usage: `df -h`
- Memory usage: `free -h`
- Application logs: `docker-compose logs -f`

## Support

For issues or questions, contact the development team.
