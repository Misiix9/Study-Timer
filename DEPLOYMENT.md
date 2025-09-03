# 🚀 Study Timer - Deployment Guide

This comprehensive guide covers all deployment options for the Study Timer application, from local development to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [AWS Deployment](#aws-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: 18+ (LTS recommended)
- **PostgreSQL**: 13+ or compatible cloud service
- **npm/yarn**: Latest version
- **Git**: For version control

### Required Services
- PostgreSQL database (local or cloud)
- Email service (optional, for notifications)
- Redis (optional, for session storage and caching)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/study-timer.git
cd study-timer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/study_timer"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Service (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@studytimer.app"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Study Timer"

# Security
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN="7d"

# Features
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_FOCUS_MODE=true
```

### 4. Generate Secure Keys

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Setup

### Local PostgreSQL

1. **Install PostgreSQL**:
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

2. **Create Database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE study_timer;
CREATE USER study_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE study_timer TO study_user;
```

3. **Setup Prisma**:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### Cloud Database Options

#### Supabase (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy database URL from Settings > Database
4. Update `DATABASE_URL` in `.env.local`

#### PlanetScale
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Create branch and get connection string
4. Update `DATABASE_URL` in `.env.local`

#### Neon
1. Create account at [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Update `DATABASE_URL` in `.env.local`

## Development Deployment

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Access application at `http://localhost:3000`

### Development Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
```

## Production Deployment

### 1. Build Application

```bash
# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build
```

### 2. Database Migration

```bash
# Run migrations
npx prisma migrate deploy

# (Optional) Seed production data
npx prisma db seed
```

### 3. Environment Variables

Set production environment variables:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### 4. Start Production Server

```bash
npm start
```

### 5. Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "study-timer" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t study-timer .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  study-timer
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The compose file includes:
- Next.js application
- PostgreSQL database
- Redis (optional)

## Vercel Deployment

### Automatic Deployment

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

2. **Environment Variables**:
   Add in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - OAuth provider credentials

3. **Build Configuration**:
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## AWS Deployment

### EC2 Instance

1. **Launch EC2 Instance**:
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (HTTP, HTTPS, SSH)
   - Launch with key pair

2. **Setup Instance**:
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clone repository
git clone https://github.com/yourusername/study-timer.git
cd study-timer

# Install dependencies and build
npm ci --only=production
npm run build

# Setup PM2
npm install -g pm2
pm2 start npm --name "study-timer" -- start
pm2 startup
pm2 save
```

3. **Configure Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL Certificate**:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### AWS Amplify

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings

2. **Build Specification**:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Monitoring & Maintenance

### Application Monitoring

1. **Health Checks**:
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:3000/api/health || echo "App is down" | mail -s "Study Timer Down" admin@yourdomain.com
```

2. **Log Monitoring**:
```bash
# PM2 logs
pm2 logs study-timer

# Application logs
tail -f /var/log/study-timer.log
```

3. **Performance Monitoring**:
   - Use services like New Relic, DataDog, or Sentry
   - Monitor Core Web Vitals
   - Set up alerts for high error rates

### Database Maintenance

1. **Backup**:
```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

2. **Maintenance**:
```bash
# Update statistics
ANALYZE;

# Vacuum database
VACUUM;

# Reindex
REINDEX DATABASE study_timer;
```

### Updates & Security

1. **Automated Updates**:
```bash
# Create update script
#!/bin/bash
cd /path/to/study-timer
git pull origin main
npm ci --only=production
npm run build
pm2 reload study-timer
```

2. **Security Updates**:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Verify Prisma schema
npx prisma db pull
npx prisma generate
```

2. **Build Failures**:
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

3. **Authentication Issues**:
```bash
# Verify NextAuth configuration
echo $NEXTAUTH_SECRET | wc -c  # Should be > 32
curl -I $NEXTAUTH_URL/api/auth/providers
```

4. **Performance Issues**:
```bash
# Analyze bundle size
npm run analyze

# Check memory usage
pm2 monit

# Database performance
EXPLAIN ANALYZE SELECT * FROM sessions WHERE user_id = 'user-id';
```

### Logs and Debugging

1. **Application Logs**:
```bash
# PM2 logs
pm2 logs --lines 100

# Custom log file
tail -f logs/application.log
```

2. **Database Logs**:
```bash
# PostgreSQL logs (Ubuntu)
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

3. **Nginx Logs**:
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs  
sudo tail -f /var/log/nginx/error.log
```

## Support & Resources

- 📧 **Support**: support@studytimer.app
- 📖 **Documentation**: [docs.studytimer.app](https://docs.studytimer.app)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/study-timer/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/studytimer)

---

**Need help?** Join our community or reach out to our support team. We're here to help you succeed! 🚀