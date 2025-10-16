# BGF Aid System - Production Deployment Guide for bgfaidzim.org

This guide provides step-by-step instructions for deploying the BGF Aid System to production on your domain `bgfaidzim.org`.

## 🎯 Overview

The system will be deployed with:
- **Main Domain**: https://bgfaidzim.org (Frontend)
- **API Domain**: https://api.bgfaidzim.org (Backend)
- **Database**: PostgreSQL with production data
- **SSL**: Automatic HTTPS with security headers
- **Container Management**: Docker & Docker Compose

## 🔧 Prerequisites

### 1. Server Requirements
- Ubuntu 20.04+ or CentOS 8+ server
- Minimum 4GB RAM, 2 CPU cores, 40GB storage
- Root access or sudo privileges
- Public IP address

### 2. Domain Configuration
Set up DNS records for `bgfaidzim.org`:

```
Type    Name                Value               TTL
A       @                   YOUR_SERVER_IP      300
A       www                 YOUR_SERVER_IP      300
A       api                 YOUR_SERVER_IP      300
CNAME   www.bgfaidzim.org   bgfaidzim.org       300
```

### 3. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (for SSL certificates)
sudo apt install nginx certbot python3-certbot-nginx -y

# Reboot to apply Docker group changes
sudo reboot
```

## 🚀 Deployment Steps

### Step 1: Upload Your Application

```bash
# Create application directory
sudo mkdir -p /opt/bgf-aid-system
sudo chown $USER:$USER /opt/bgf-aid-system
cd /opt/bgf-aid-system

# Upload your application files (use scp, rsync, or git)
# Option 1: Using git (if you have a repository)
git clone https://your-repo-url.git .

# Option 2: Using scp from your local machine
# scp -r /Users/providencemtendereki/bgf-aid-system/* user@your-server:/opt/bgf-aid-system/
```

### Step 2: Configure Environment Variables

```bash
# Create environment file
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Edit the production environment files
nano backend/.env
```

Update these critical values in `backend/.env`:
```bash
# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 32)

# Set your domain
CORS_ORIGIN=https://bgfaidzim.org
ADMIN_EMAIL=admin@bgfaidzim.org
```

### Step 3: Obtain SSL Certificates

```bash
# Get SSL certificates for both domains
sudo certbot certonly --standalone -d bgfaidzim.org -d www.bgfaidzim.org
sudo certbot certonly --standalone -d api.bgfaidzim.org

# Create SSL directory for Docker
sudo mkdir -p /opt/bgf-aid-system/nginx/ssl

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/bgfaidzim.org/fullchain.pem /opt/bgf-aid-system/nginx/ssl/bgfaidzim.org.crt
sudo cp /etc/letsencrypt/live/bgfaidzim.org/privkey.pem /opt/bgf-aid-system/nginx/ssl/bgfaidzim.org.key
sudo cp /etc/letsencrypt/live/api.bgfaidzim.org/fullchain.pem /opt/bgf-aid-system/nginx/ssl/api.bgfaidzim.org.crt
sudo cp /etc/letsencrypt/live/api.bgfaidzim.org/privkey.pem /opt/bgf-aid-system/nginx/ssl/api.bgfaidzim.org.key

# Set proper permissions
sudo chown -R root:root /opt/bgf-aid-system/nginx/ssl
sudo chmod 600 /opt/bgf-aid-system/nginx/ssl/*.key
sudo chmod 644 /opt/bgf-aid-system/nginx/ssl/*.crt
```

### Step 4: Configure Docker Environment

Create `.env` file for Docker Compose:
```bash
cat > .env << EOF
# Database
DB_PASSWORD=$(openssl rand -base64 32)

# JWT Secrets
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
EOF
```

### Step 5: Build and Deploy

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build -d

# Check if all services are running
docker-compose -f docker-compose.prod.yml ps

# View logs if needed
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 6: Initialize Database

```bash
# Run database setup
docker-compose -f docker-compose.prod.yml exec backend npm run setup-db

# Verify database is working
docker-compose -f docker-compose.prod.yml exec postgres psql -U bgf_user -d bgf_aid_production -c "SELECT COUNT(*) FROM users;"
```

### Step 7: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Check firewall status
sudo ufw status
```

### Step 8: Set Up SSL Certificate Auto-Renewal

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Create renewal script
sudo cat > /usr/local/bin/renew-bgf-certs.sh << 'EOF'
#!/bin/bash

# Renew certificates
certbot renew --quiet

# Copy renewed certificates
cp /etc/letsencrypt/live/bgfaidzim.org/fullchain.pem /opt/bgf-aid-system/nginx/ssl/bgfaidzim.org.crt
cp /etc/letsencrypt/live/bgfaidzim.org/privkey.pem /opt/bgf-aid-system/nginx/ssl/bgfaidzim.org.key
cp /etc/letsencrypt/live/api.bgfaidzim.org/fullchain.pem /opt/bgf-aid-system/nginx/ssl/api.bgfaidzim.org.crt
cp /etc/letsencrypt/live/api.bgfaidzim.org/privkey.pem /opt/bgf-aid-system/nginx/ssl/api.bgfaidzim.org.key

# Set permissions
chown -R root:root /opt/bgf-aid-system/nginx/ssl
chmod 600 /opt/bgf-aid-system/nginx/ssl/*.key
chmod 644 /opt/bgf-aid-system/nginx/ssl/*.crt

# Reload nginx
docker-compose -f /opt/bgf-aid-system/docker-compose.prod.yml exec nginx nginx -s reload
EOF

# Make script executable
sudo chmod +x /usr/local/bin/renew-bgf-certs.sh

# Add to crontab (run twice daily)
echo "0 0,12 * * * root /usr/local/bin/renew-bgf-certs.sh" | sudo tee -a /etc/crontab
```

### Step 9: Configure Monitoring and Backups

```bash
# Create backup script
sudo mkdir -p /opt/bgf-backups

sudo cat > /usr/local/bin/backup-bgf.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/bgf-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Backup database
docker-compose -f /opt/bgf-aid-system/docker-compose.prod.yml exec -T postgres pg_dump -U bgf_user bgf_aid_production > $BACKUP_DIR/$DATE/database.sql

# Backup uploaded files
cp -r /opt/bgf-aid-system/uploads $BACKUP_DIR/$DATE/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "20*" -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR/$DATE"
EOF

sudo chmod +x /usr/local/bin/backup-bgf.sh

# Schedule daily backups at 2 AM
echo "0 2 * * * root /usr/local/bin/backup-bgf.sh" | sudo tee -a /etc/crontab
```

### Step 10: System Health Monitoring

```bash
# Create health check script
sudo cat > /usr/local/bin/bgf-health-check.sh << 'EOF'
#!/bin/bash

# Check if services are running
if ! docker-compose -f /opt/bgf-aid-system/docker-compose.prod.yml ps | grep -q "Up"; then
    echo "BGF services are down, restarting..."
    docker-compose -f /opt/bgf-aid-system/docker-compose.prod.yml up -d
    # Send email notification (optional)
    # echo "BGF services were restarted" | mail -s "BGF System Alert" admin@bgfaidzim.org
fi

# Check website accessibility
if ! curl -s -o /dev/null -w "%{http_code}" https://bgfaidzim.org | grep -q "200"; then
    echo "Website is not accessible"
    # Send notification
fi

# Check API accessibility
if ! curl -s -o /dev/null -w "%{http_code}" https://api.bgfaidzim.org/health | grep -q "200"; then
    echo "API is not accessible"
    # Send notification
fi
EOF

sudo chmod +x /usr/local/bin/bgf-health-check.sh

# Run health check every 5 minutes
echo "*/5 * * * * root /usr/local/bin/bgf-health-check.sh" | sudo tee -a /etc/crontab
```

## 🔍 Verification Steps

### 1. Test Website Access
```bash
# Test main website
curl -I https://bgfaidzim.org
curl -I https://www.bgfaidzim.org

# Test API
curl https://api.bgfaidzim.org/health
```

### 2. Test Application Functionality

Visit your website and test:
- ✅ Main homepage loads
- ✅ Staff portal page loads
- ✅ Education support page loads
- ✅ Application form submission works
- ✅ Staff login works with demo accounts
- ✅ Dashboard loads after login

### 3. Security Test
```bash
# Check SSL rating (optional)
curl -s "https://api.ssllabs.com/api/v3/analyze?host=bgfaidzim.org" | jq .

# Test security headers
curl -I https://bgfaidzim.org | grep -E "(Strict-Transport|X-Frame|X-Content)"
```

## 🛠️ Maintenance Commands

### Common Docker Commands
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f [service_name]

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service_name]

# Update application
git pull
docker-compose -f docker-compose.prod.yml up --build -d

# Clean up unused Docker resources
docker system prune -a
```

### Database Commands
```bash
# Access database
docker-compose -f docker-compose.prod.yml exec postgres psql -U bgf_user -d bgf_aid_production

# Backup database manually
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U bgf_user bgf_aid_production > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U bgf_user -d bgf_aid_production < backup.sql
```

## 🚨 Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in /opt/bgf-aid-system/nginx/ssl/bgfaidzim.org.crt -noout -text
   
   # Renew manually
   sudo /usr/local/bin/renew-bgf-certs.sh
   ```

2. **Database Connection Issues**
   ```bash
   # Check database container
   docker-compose -f docker-compose.prod.yml logs postgres
   
   # Test connection
   docker-compose -f docker-compose.prod.yml exec postgres psql -U bgf_user -d bgf_aid_production -c "SELECT 1;"
   ```

3. **Application Not Loading**
   ```bash
   # Check all services
   docker-compose -f docker-compose.prod.yml ps
   
   # View application logs
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

### Emergency Recovery

If the system goes down completely:
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start fresh
docker-compose -f docker-compose.prod.yml up -d

# If database is corrupted, restore from backup
# (Make sure to stop services first)
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U bgf_user -d bgf_aid_production < /opt/bgf-backups/LATEST/database.sql
```

## 📧 Support

For technical support:
- **System Administrator**: admin@bgfaidzim.org
- **Emergency Contact**: (backup contact method)

## 🔐 Security Best Practices

1. **Regularly update system packages**
2. **Monitor access logs** in `/opt/bgf-aid-system/nginx/logs/`
3. **Change default passwords** in production environment files
4. **Review firewall rules** periodically
5. **Monitor SSL certificate expiration**
6. **Regular security audits** of application and server

---

## 🎉 Congratulations!

Your BGF Aid System is now live at:
- **Main Website**: https://bgfaidzim.org
- **Staff Portal**: https://bgfaidzim.org/staff
- **Education Support**: https://bgfaidzim.org/education-support
- **API**: https://api.bgfaidzim.org

The system is ready for users to:
- Submit applications
- Staff to login and manage applications
- View educational support information
- Use all features with full HTTPS security

**Test User Accounts**: Use the demo accounts shown on the login page to test all functionality.

Remember to customize the content, replace placeholder values, and regularly maintain your system!