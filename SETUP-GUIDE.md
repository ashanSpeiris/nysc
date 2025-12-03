# 🚀 NYSC Volunteer Portal - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

### Installation

1. **Navigate to project directory**
   ```bash
   cd volunteer-portal
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
volunteer-portal/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── login/          # Admin login page
│   │   │   ├── volunteers/     # Volunteer management
│   │   │   ├── statistics/     # Analytics dashboard
│   │   │   ├── layout.tsx      # Admin layout with sidebar
│   │   │   └── page.tsx        # Admin home
│   │   ├── layout.tsx          # Locale layout
│   │   └── page.tsx            # Public home page
│   ├── api/                     # API Routes
│   │   └── volunteer/
│   │       └── register/
│   │           └── route.ts    # Registration endpoint (TODO: connect to DB)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root redirect
│   ├── not-found.tsx           # 404 page
│   ├── error.tsx               # Error boundary
│   └── loading.tsx             # Loading state
│
├── components/                  # React Components
│   ├── chat/
│   │   └── PhoenixChat.tsx     # AI chat interface
│   ├── forms/
│   │   └── VolunteerForm.tsx   # Registration form
│   ├── layout/
│   │   ├── Header.tsx          # Site header
│   │   └── Footer.tsx          # Site footer
│   └── ui/                     # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── confetti.tsx        # Success animation
│       ├── skeleton.tsx        # Loading skeletons
│       └── ...
│
├── lib/                        # Utilities and configs
│   ├── constants/
│   │   └── index.ts           # App constants (districts, types, etc.)
│   ├── validations/
│   │   └── volunteer.ts       # Zod schemas
│   └── utils.ts               # Helper functions
│
├── messages/                   # Internationalization
│   ├── en.json                # English translations
│   ├── si.json                # Sinhala translations
│   └── ta.json                # Tamil translations
│
├── public/                    # Static assets
│   └── images/
│       ├── nysc-logo.png
│       └── sri-lanka-emblem.png
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🎮 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🌐 Pages Overview

### Public Pages
- **/** → `/en` (redirects to English)
- **/en** - Main landing page (English)
- **/si** - Main landing page (Sinhala)
- **/ta** - Main landing page (Tamil)

### Admin Pages (Demo Login: admin@nysc.lk / admin123)
- **/en/admin/login** - Admin login
- **/en/admin** - Dashboard
- **/en/admin/volunteers** - Volunteer list & management
- **/en/admin/statistics** - Analytics & charts

### Error Pages
- **/404** - Custom not found page
- **/error** - Error boundary

---

## 🔧 Configuration

### Environment Variables (Create `.env.local`)

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (TODO: Add when implementing backend)
# DATABASE_URL="postgresql://..."

# Authentication (TODO: Add when implementing backend)
# NEXTAUTH_SECRET="your-secret-key"
# NEXTAUTH_URL="http://localhost:3000"

# Phoenix AI (TODO: Add when integrating AI)
# PHOENIX_AI_API_KEY="your-api-key"
# PHOENIX_AI_ENDPOINT="https://..."

# Email/SMS (TODO: Add for notifications)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-password"

# WhatsApp API (TODO: Add for notifications)
# WHATSAPP_API_KEY="your-api-key"
# WHATSAPP_API_URL="https://..."

# reCAPTCHA (TODO: Add for bot protection)
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
# RECAPTCHA_SECRET_KEY="your-secret-key"

# Redis (TODO: Add for rate limiting)
# REDIS_URL="redis://localhost:6379"
```

---

## 🎨 Customization

### Colors (tailwind.config.ts)
```typescript
colors: {
  primary: "hsl(221.2, 83.2%, 53.3%)",   // NYSC Blue
  secondary: "hsl(142.1, 76.2%, 36.3%)", // Teal
  accent: "hsl(24.6, 95%, 53.1%)",       // Orange
  // ... customize as needed
}
```

### Languages
Add/modify translations in `messages/*.json`

### Logo
Replace logos in `public/images/`:
- `nysc-logo.png`
- `sri-lanka-emblem.png`

---

## 📝 TODO: Backend Integration

### 1. Database Setup
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Create schema in prisma/schema.prisma
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 2. Authentication
```bash
# Install NextAuth
npm install next-auth@beta

# Create auth configuration
# Add API routes for authentication
```

### 3. Security Packages
```bash
# Install security packages
npm install bcryptjs argon2 ioredis rate-limiter-flexible
npm install helmet validator next-recaptcha-v3
```

### 4. Connect API Routes
Update `app/api/volunteer/register/route.ts` to:
- Save data to database
- Send email/WhatsApp confirmations
- Implement rate limiting
- Add CAPTCHA verification

---

## 🔒 Security Checklist (TODO for Backend)

- [ ] Environment variables for secrets
- [ ] HTTPS only in production
- [ ] CSRF protection
- [ ] Rate limiting (Redis)
- [ ] Input sanitization (already validated with Zod)
- [ ] SQL injection prevention (use Prisma ORM)
- [ ] XSS protection (React handles this)
- [ ] Password hashing (bcrypt/argon2)
- [ ] Session management (NextAuth)
- [ ] CAPTCHA (reCAPTCHA v3)
- [ ] Security headers (helmet)
- [ ] File upload validation
- [ ] Audit logging

---

## 🚀 Deployment Guide (Ubuntu Server)

### 1. Server Requirements
- Ubuntu 20.04+ LTS
- Node.js 18+
- Nginx
- PostgreSQL
- Redis
- SSL Certificate (Let's Encrypt)

### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 3. Clone and Build
```bash
# Clone project (or upload via FTP/SCP)
cd /var/www
sudo git clone <your-repo-url> volunteer-portal
cd volunteer-portal

# Install dependencies
npm install

# Build for production
npm run build
```

### 4. Configure PM2
```bash
# Create PM2 ecosystem file
pm2 ecosystem

# Edit ecosystem.config.js
module.exports = {
  apps: [{
    name: 'volunteer-portal',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/volunteer-portal',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Auto-start on boot
pm2 startup
```

### 5. Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/volunteer-portal

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/volunteer-portal /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 7. Database Setup
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE volunteer_portal;
CREATE USER volunteer_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE volunteer_portal TO volunteer_user;
\q

# Run migrations (from project directory)
npx prisma migrate deploy
```

### 8. Security Hardening
```bash
# Configure firewall
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable

# Configure fail2ban (brute force protection)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs volunteer-portal

# Check status
pm2 status

# Restart app
pm2 restart volunteer-portal

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Find process on port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac

# Kill process
# Windows: taskkill /F /PID <process_id>
# Linux/Mac: kill -9 <process_id>
```

### Build errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📞 Support

- **Developer**: TecWyze (https://tecwyze.lk/)
- **Email**: onemillionvolunteer@nysc.lk
- **Phone**: 0701553202

---

**Happy Coding! 🚀**
