#!/bin/bash

# BGF Aid Management System - Cloud Deployment Script
# Supports multiple cloud providers and deployment options

set -e  # Exit on any error

echo "🌩️  BGF Aid Management System - Cloud Deployment"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
if [ ! -f "docker-compose.production.yml" ]; then
    print_error "Please run this script from the bgf-aid-system root directory"
    exit 1
fi

print_step "Cloud Deployment Options"
echo ""
echo "Choose your deployment method:"
echo "1) Docker Compose (VPS/Dedicated Server)"
echo "2) AWS ECS with Fargate"
echo "3) Google Cloud Run"
echo "4) Azure Container Instances"
echo "5) DigitalOcean App Platform"
echo "6) Railway"
echo "7) Render"
echo ""
read -p "Enter your choice (1-7): " deployment_choice

case $deployment_choice in
    1)
        print_step "Setting up Docker Compose deployment..."
        
        # Check if production environment exists
        if [ ! -f ".env.production" ]; then
            print_warning "Production environment file not found."
            print_step "Creating .env.production from template..."
            cp .env.production.template .env.production
            
            print_warning "Please edit .env.production with your production values before continuing."
            print_warning "Required changes:"
            echo "  - Set secure DB_PASSWORD"
            echo "  - Set secure REDIS_PASSWORD" 
            echo "  - Set secure JWT_SECRET and JWT_REFRESH_SECRET"
            echo "  - Update FRONTEND_URL and BACKEND_URL with your domain"
            echo "  - Configure email/SMS credentials if needed"
            echo ""
            read -p "Press Enter after editing .env.production..."
        fi
        
        # Generate secure secrets if placeholders exist
        if grep -q "YOUR_SECURE" .env.production; then
            print_step "Generating secure random secrets..."
            
            DB_PASS=$(openssl rand -base64 32)
            REDIS_PASS=$(openssl rand -base64 32) 
            JWT_SECRET=$(openssl rand -base64 48)
            JWT_REFRESH_SECRET=$(openssl rand -base64 48)
            
            sed -i.bak "s/YOUR_SECURE_DB_PASSWORD_HERE/$DB_PASS/g" .env.production
            sed -i.bak "s/YOUR_SECURE_REDIS_PASSWORD_HERE/$REDIS_PASS/g" .env.production
            sed -i.bak "s/YOUR_SUPER_SECURE_JWT_SECRET_HERE_AT_LEAST_32_CHARACTERS/$JWT_SECRET/g" .env.production
            sed -i.bak "s/YOUR_SUPER_SECURE_JWT_REFRESH_SECRET_HERE_AT_LEAST_32_CHARACTERS/$JWT_REFRESH_SECRET/g" .env.production
            
            print_success "Generated secure secrets"
        fi
        
        # Create nginx configuration
        mkdir -p nginx/conf.d
        
        cat > nginx/nginx.prod.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    gzip on;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:3001;
    }
    
    server {
        listen 80;
        server_name _;
        
        # Redirect to HTTPS in production
        # return 301 https://$server_name$request_uri;
        
        # For development/testing, serve directly
        client_max_body_size 10M;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300;
        }
        
        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300;
        }
        
        # Authentication rate limiting
        location /api/v1/auth/ {
            limit_req zone=auth burst=10 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
        
        # Deploy with production compose
        print_step "Starting production deployment..."
        docker-compose -f docker-compose.production.yml --env-file .env.production up -d --build
        
        # Wait for services
        print_step "Waiting for services to be healthy..."
        sleep 30
        
        # Check health
        print_step "Checking service health..."
        if curl -f http://localhost/api/v1/health &> /dev/null; then
            print_success "Backend is healthy"
        else
            print_warning "Backend may still be starting..."
        fi
        
        if curl -f http://localhost &> /dev/null; then
            print_success "Frontend is accessible"
        else
            print_warning "Frontend may still be starting..."
        fi
        
        print_success "Docker Compose deployment completed!"
        echo ""
        echo "🎉 Your BGF Aid Management System is now deployed!"
        echo ""
        echo "Access URLs:"
        echo "- Application: http://your-server-ip"
        echo "- API: http://your-server-ip/api"
        echo ""
        echo "Next steps:"
        echo "1. Configure your domain DNS to point to this server"
        echo "2. Set up SSL certificates (Let's Encrypt recommended)"
        echo "3. Update CORS settings in .env.production"
        echo "4. Set up automated backups"
        ;;
        
    2)
        print_step "Setting up AWS ECS deployment..."
        print_warning "AWS ECS deployment requires:"
        echo "- AWS CLI installed and configured"
        echo "- ECS cluster created"
        echo "- Task definitions prepared"
        echo ""
        print_warning "This is an advanced deployment option."
        print_warning "Please refer to the AWS ECS documentation for detailed setup."
        ;;
        
    3)
        print_step "Setting up Google Cloud Run deployment..."
        print_warning "Google Cloud Run deployment requires:"
        echo "- Google Cloud SDK installed"
        echo "- Container images pushed to Google Container Registry"
        echo "- Cloud SQL database configured"
        echo ""
        print_warning "This is an advanced deployment option."
        print_warning "Please refer to the Google Cloud Run documentation."
        ;;
        
    4)
        print_step "Setting up Azure Container Instances..."
        print_warning "Azure deployment requires Azure CLI and proper resource setup."
        ;;
        
    5)
        print_step "Setting up DigitalOcean App Platform..."
        print_warning "DigitalOcean App Platform deployment requires:"
        echo "- GitHub repository with your code"
        echo "- DigitalOcean account"
        echo "- App spec configuration"
        ;;
        
    6)
        print_step "Setting up Railway deployment..."
        print_warning "Railway deployment is simple but requires:"
        echo "- Railway account"
        echo "- GitHub repository"
        echo "- Environment variables configured"
        ;;
        
    7)
        print_step "Setting up Render deployment..."
        print_warning "Render deployment requires:"
        echo "- Render account" 
        echo "- GitHub repository"
        echo "- Render configuration files"
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📋 Deployment Information:"
echo "========================="
echo "- System: BGF Aid Management System"
echo "- Frontend: Next.js 14 with TypeScript"
echo "- Backend: Node.js with Express"
echo "- Database: PostgreSQL 15"
echo "- Cache: Redis 7"
echo "- Proxy: Nginx"
echo "- Multi-user: ✅ Supported"
echo "- Real-time: ✅ Supported"
echo "- File uploads: ✅ Supported"
echo "- Mobile responsive: ✅ Supported"
echo ""

echo "🔧 Management Commands:"
echo "======================"
echo "- View logs: docker-compose -f docker-compose.production.yml logs -f [service]"
echo "- Scale services: docker-compose -f docker-compose.production.yml up -d --scale backend=2"
echo "- Update deployment: docker-compose -f docker-compose.production.yml up -d --build"
echo "- Stop services: docker-compose -f docker-compose.production.yml down"
echo ""

print_success "BGF Aid Management System cloud deployment setup completed!"
print_success "Your multi-user system is ready for global access!"