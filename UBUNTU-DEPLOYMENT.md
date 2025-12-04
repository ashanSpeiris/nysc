# Ubuntu Server Deployment Guide

Complete guide to deploy the NYSC Volunteer Portal on your Ubuntu server.

## 📋 Prerequisites

- Ubuntu Server 22.04 LTS or newer
- Root or sudo access
- Domain name (optional but recommended)
- At least 2GB RAM, 20GB disk space

---

## 🚀 Step 1: Install Required Software

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v20.x
```

### Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install Redis
```bash
sudo apt install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

---

## 🗄️ Step 2: Configure PostgreSQL

### Create Database and User
```bash
sudo -u postgres psql
```

In PostgreSQL shell:
```sql
-- Create database
CREATE DATABASE volunteer_portal;

-- Create user with password
CREATE USER nysc_admin WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE volunteer_portal TO nysc_admin;

-- Connect to database
\c volunteer_portal

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO nysc_admin;

-- Exit
\q
```

### Enable Remote Connections (if needed)
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Find and uncomment:
```
listen_addresses = 'localhost'  # or '*' for all interfaces
```

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Add:
```
host    volunteer_portal    nysc_admin    127.0.0.1/32    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## 📦 Step 3: Deploy Application

### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/ashanSpeiris/nysc.git volunteer-portal
cd volunteer-portal
sudo chown -R $USER:$USER /var/www/volunteer-portal
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Update with your values:
```env
# Database
DATABASE_URL="postgresql://nysc_admin:your_secure_password_here@localhost:5432/volunteer_portal?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-domain.com"  # or http://your-ip:3000

# Admin Credentials
DEFAULT_ADMIN_EMAIL="admin@nysc.lk"
DEFAULT_ADMIN_PASSWORD="Change_This_Secure_Password_123!"
DEFAULT_ADMIN_NAME="NYSC Administrator"

# Production Mode
NODE_ENV="production"

# Rate Limiting
RATE_LIMIT_MAX=10

# Security
SECURE_COOKIES="true"  # Set to true if using HTTPS
```

### Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema and create tables
npm run db:push

# Create initial admin user
npm run db:seed
```

### Build Application
```bash
npm run build
```

---

## 🔄 Step 4: Configure PM2

### Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'volunteer-portal',
    script: 'npm',
    args: 'start',
    instances: 2,  // or 'max' for all CPUs
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
```

### Start Application
```bash
mkdir logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the command it outputs
```

### Verify Application is Running
```bash
pm2 status
pm2 logs volunteer-portal
curl http://localhost:3000
```

---

## 🌐 Step 5: Configure Nginx

### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/volunteer-portal
```

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=volunteer_limit:10m rate=10r/s;

# Upstream
upstream volunteer_app {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Change this

    # Rate limiting
    limit_req zone=volunteer_limit burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy settings
    location / {
        proxy_pass http://volunteer_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://volunteer_app;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Images caching
    location /images {
        proxy_pass http://volunteer_app;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600";
    }

    # Block sensitive files
    location ~ /\. {
        deny all;
    }
}
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/volunteer-portal /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## 🔒 Step 6: SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### Auto-renewal
```bash
sudo certbot renew --dry-run  # Test renewal
```

---

## 🔐 Step 7: Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## 💾 Step 8: Database Backup Configuration

### Create Backup Script
```bash
sudo nano /usr/local/bin/backup-volunteer-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/volunteer-portal"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="volunteer_portal"
DB_USER="nysc_admin"
DB_PASSWORD="your_secure_password_here"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

### Make Executable
```bash
sudo chmod +x /usr/local/bin/backup-volunteer-db.sh
```

### Schedule Daily Backups
```bash
sudo crontab -e
```

Add:
```
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-volunteer-db.sh >> /var/log/volunteer-backup.log 2>&1
```

---

## 📊 Step 9: Monitoring

### PM2 Monitoring
```bash
# View logs
pm2 logs volunteer-portal

# Monitor resources
pm2 monit

# View detailed info
pm2 info volunteer-portal
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop

# Check system resources
htop

# Check disk usage
df -h

# Check PostgreSQL status
sudo systemctl status postgresql

# Check Redis status
sudo systemctl status redis
```

---

## 🔄 Step 10: Updates and Maintenance

### Update Application
```bash
cd /var/www/volunteer-portal
git pull
npm install
npm run db:generate
npm run db:push  # Apply any schema changes
npm run build
pm2 restart volunteer-portal
```

### Database Maintenance
```bash
# Vacuum database (monthly)
sudo -u postgres psql -d volunteer_portal -c "VACUUM ANALYZE;"

# Check database size
sudo -u postgres psql -d volunteer_portal -c "SELECT pg_size_pretty(pg_database_size('volunteer_portal'));"
```

---

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:3000/api/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Volunteer",
    "email": "test@example.com",
    "whatsapp": "+94771234567",
    "ageRange": "20-30",
    "sex": "male",
    "district": "Colombo",
    "volunteerType": "cleaning",
    "startDate": "2025-01-01",
    "duration": "full",
    "availableDistricts": ["colombo", "gampaha"]
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nysc.lk",
    "password": "admin123"
  }'
```

---

## 📱 Access Points

- **Main Site**: http://your-domain.com (or http://your-ip:3000)
- **Admin Login**: http://your-domain.com/en/admin/login
- **API Health**: http://your-domain.com/api/volunteer/register

### Default Admin Credentials
- Email: admin@nysc.lk
- Password: admin123 (or what you set in .env)

⚠️ **IMPORTANT**: Change the default admin password immediately after first login!

---

## 🐛 Troubleshooting

### Application won't start
```bash
pm2 logs volunteer-portal --lines 100
```

### Database connection errors
```bash
# Test PostgreSQL connection
psql -U nysc_admin -d volunteer_portal -h localhost

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Redis connection errors
```bash
# Test Redis
redis-cli ping  # Should return PONG

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

### High memory usage
```bash
# Restart application
pm2 restart volunteer-portal

# Check memory
pm2 info volunteer-portal
```

---

## 📞 Support

For issues or questions:
- Email: onemillionvolunteer@nysc.lk
- GitHub Issues: https://github.com/ashanSpeiris/nysc/issues

---

## ✅ Post-Deployment Checklist

- [ ] PostgreSQL database created and running
- [ ] Redis server running
- [ ] Application built successfully
- [ ] PM2 running application
- [ ] Nginx configured and serving site
- [ ] SSL certificate installed (if using domain)
- [ ] Firewall configured
- [ ] Database backups scheduled
- [ ] Admin user created and tested
- [ ] Volunteer registration tested
- [ ] Default admin password changed
- [ ] Environment variables secured (.env file permissions)
- [ ] Monitoring setup and tested

---

**Congratulations!** 🎉 Your volunteer portal is now live and ready to serve 1M+ users!
