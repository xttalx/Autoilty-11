# 🚀 Deployment Guide - Autoilty.com

## Pre-Deployment Checklist

- [ ] API keys configured (Google Places, Yelp)
- [ ] MongoDB connection string set
- [ ] Redis configured
- [ ] Environment variables verified
- [ ] SSL certificates obtained (production)
- [ ] Domain DNS configured
- [ ] Email SMTP settings configured
- [ ] Analytics tracking IDs set
- [ ] PIPEDA compliance review complete

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-org/autoilty.git
cd autoilty
npm install
cd client && npm install && cd ..
pip3 install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Services

```bash
# Option A: Individual terminals
npm run dev          # Backend
npm run client       # Frontend

# Option B: Concurrent
npm run dev:full

# Option C: Docker
docker-compose up
```

### 4. Seed Database

```bash
npm run seed
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- GraphQL: http://localhost:5000/graphql

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

#### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-org/autoilty.git
cd autoilty

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

#### Step 3: Initialize Database

```bash
# Seed database
docker-compose exec backend npm run seed

# Run initial scraper
docker-compose exec backend python3 scripts/data-scraper.py
```

#### Step 4: Configure Nginx (if not using Docker Nginx)

```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/autoilty
sudo ln -s /etc/nginx/sites-available/autoilty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 2: Manual Deployment

#### Backend Deployment

```bash
# Install PM2
npm install -g pm2

# Start backend
cd /var/www/autoilty
pm2 start server/index.js --name autoilty-api

# Enable startup
pm2 startup
pm2 save
```

#### Frontend Deployment

```bash
# Build React app
cd client
npm run build

# Serve with Nginx
sudo cp -r build/* /var/www/html/autoilty/
```

#### MongoDB Setup

```bash
# Install MongoDB 7.0
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Run init script
mongosh < scripts/mongo-init.js
```

#### Redis Setup

```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your-strong-password

# Restart Redis
sudo systemctl restart redis
```

---

## Environment Variables (Production)

```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=https://autoilty.com

# Database
MONGODB_URI=mongodb://username:password@localhost:27017/autoilty-curator?authSource=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-strong-redis-password

# Security
JWT_SECRET=generate-with-openssl-rand-base64-64

# APIs
GOOGLE_PLACES_API_KEY=your-production-google-key
YELP_API_KEY=your-production-yelp-key

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

---

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d autoilty.com -d www.autoilty.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Monitoring Setup

### 1. Health Monitoring

```bash
# Start monitor
pm2 start scripts/monitor.js --name autoilty-monitor

# View logs
pm2 logs autoilty-monitor
```

### 2. Scheduled Tasks

```bash
# Edit crontab
crontab -e

# Add jobs
0 2 * * * cd /var/www/autoilty && node scripts/score-updater.js >> logs/score-update.log 2>&1
0 3 * * 0 cd /var/www/autoilty && python3 scripts/data-scraper.py >> logs/scraper.log 2>&1
```

### 3. Log Rotation

```bash
sudo nano /etc/logrotate.d/autoilty
```

```
/var/www/autoilty/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Performance Tuning

### 1. MongoDB Optimization

```javascript
// Connection pooling
mongoose.connect(uri, {
  maxPoolSize: 50,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
});
```

### 2. Redis Tuning

```bash
# /etc/redis/redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### 3. Node.js Clustering

```javascript
// Use PM2 cluster mode
pm2 start server/index.js -i max --name autoilty-api
```

---

## Backup Strategy

### Database Backup

```bash
#!/bin/bash
# /var/www/autoilty/scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/autoilty"

# MongoDB backup
mongodump --db autoilty-curator --out $BACKUP_DIR/mongo_$DATE

# Compress
tar -czf $BACKUP_DIR/mongo_$DATE.tar.gz $BACKUP_DIR/mongo_$DATE
rm -rf $BACKUP_DIR/mongo_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "mongo_*.tar.gz" -mtime +7 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/mongo_$DATE.tar.gz s3://autoilty-backups/
```

```bash
# Schedule daily backups
crontab -e
0 1 * * * /var/www/autoilty/scripts/backup.sh
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
    
  frontend:
    deploy:
      replicas: 2
```

```bash
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

### Load Balancer

```nginx
upstream backend_cluster {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 3. Security Headers

Already configured in `nginx/nginx.conf`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

---

## Troubleshooting

### Check Service Status

```bash
# Docker
docker-compose ps
docker-compose logs backend

# PM2
pm2 status
pm2 logs autoilty-api

# System services
sudo systemctl status mongod
sudo systemctl status redis
sudo systemctl status nginx
```

### Common Issues

**MongoDB Connection Failed:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh $MONGODB_URI
```

**Redis Connection Failed:**
```bash
# Test Redis
redis-cli ping
redis-cli -a your-password ping
```

**High Memory Usage:**
```bash
# Check processes
htop

# Restart services
pm2 restart all
docker-compose restart
```

---

## Rollback Procedure

```bash
# Docker rollback
docker-compose down
git checkout previous-stable-tag
docker-compose up -d --build

# PM2 rollback
pm2 stop all
git checkout previous-stable-tag
npm install
pm2 restart all

# Restore database backup
mongorestore --drop --db autoilty-curator /var/backups/autoilty/mongo_YYYYMMDD/autoilty-curator
```

---

## Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Business profiles display properly
- [ ] User authentication works
- [ ] API endpoints responsive (<500ms)
- [ ] SSL certificate valid
- [ ] Sitemap accessible
- [ ] Analytics tracking
- [ ] Email notifications working
- [ ] Scheduled jobs running
- [ ] Backups configured
- [ ] Monitoring active

---

## Support

For deployment issues:
- Email: devops@autoilty.com
- Docs: https://docs.autoilty.com
- GitHub Issues: https://github.com/your-org/autoilty/issues

---

**Deployment completed! 🎉**

*Monitor the system for the first 24-48 hours and adjust resources as needed.*


