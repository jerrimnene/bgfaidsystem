#!/bin/bash

# BGF Aid Management System - Automated Deployment Script
# This script sets up the entire system for production use

set -e  # Exit on any error

echo "🚀 BGF Aid Management System - Deployment Script"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the bgf-aid-system root directory"
    exit 1
fi

print_step "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker Desktop."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

print_success "All prerequisites met!"

# Environment setup
print_step "Setting up environment configuration..."

if [ ! -f ".env" ]; then
    print_step "Creating .env file from template..."
    cp backend/.env.example .env
    
    # Generate secure random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 16)
    
    # Update .env with secure defaults
    sed -i '' "s|your-super-secret-jwt-key-change-in-production|$JWT_SECRET|g" .env
    sed -i '' "s|your-super-secret-refresh-key-change-in-production|$JWT_REFRESH_SECRET|g" .env
    sed -i '' "s|password|$DB_PASSWORD|g" .env
    
    print_success "Environment file created with secure defaults"
    print_warning "Please edit .env file to add your email/SMS API keys for notifications"
else
    print_success "Environment file already exists"
fi

# Ask deployment mode
echo ""
echo "Choose deployment mode:"
echo "1) Development (separate terminals)"
echo "2) Production (Docker containers)"
read -p "Enter your choice (1 or 2): " deployment_mode

if [ "$deployment_mode" = "1" ]; then
    # Development mode
    print_step "Setting up development environment..."
    
    # Install dependencies
    print_step "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_step "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    # Start database services
    print_step "Starting database services..."
    docker-compose up -d database redis
    
    # Wait for database
    print_step "Waiting for database to be ready..."
    sleep 10
    
    # Check if database is ready
    while ! docker exec bgf-database pg_isready -U bgf_user -d bgf_aid_system &> /dev/null; do
        echo "Waiting for database..."
        sleep 5
    done
    
    print_success "Database is ready!"
    
    # Instructions for development
    echo ""
    echo "🎉 Development environment is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Open a new terminal and run: cd backend && npm run dev"
    echo "2. Open another terminal and run: cd frontend && npm run dev"
    echo ""
    echo "Access URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:3001"
    echo ""
    echo "Demo login accounts:"
    echo "- Admin: admin@bgf.com / password123"
    echo "- Project Officer: project.officer@bgf.com / password123"
    echo "- All other demo accounts use password123"
    
elif [ "$deployment_mode" = "2" ]; then
    # Production mode
    print_step "Deploying production environment..."
    
    # Build and start all services
    print_step "Building and starting all services..."
    docker-compose --profile production up -d --build
    
    # Wait for services to be healthy
    print_step "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    print_step "Checking service health..."
    
    # Check database
    if docker exec bgf-database pg_isready -U bgf_user -d bgf_aid_system &> /dev/null; then
        print_success "Database is healthy"
    else
        print_error "Database is not healthy"
    fi
    
    # Check backend
    if curl -f http://localhost:3001/health &> /dev/null; then
        print_success "Backend is healthy"
    else
        print_warning "Backend may still be starting..."
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend may still be starting..."
    fi
    
    print_success "Production deployment complete!"
    echo ""
    echo "🎉 Production environment is ready!"
    echo ""
    echo "Access URLs:"
    echo "- Application: http://localhost"
    echo "- API: http://localhost/api"
    echo "- Direct Frontend: http://localhost:3000"
    echo "- Direct Backend: http://localhost:3001"
    
else
    print_error "Invalid choice. Please run the script again."
    exit 1
fi

# Display system information
echo ""
echo "📋 System Information:"
echo "======================"
echo "- Frontend: Next.js 14 with TypeScript"
echo "- Backend: Node.js with Express"
echo "- Database: PostgreSQL 15"
echo "- Cache: Redis"
echo "- Containerization: Docker & Docker Compose"
echo ""

# Display user accounts
echo "👥 Demo User Accounts:"
echo "======================"
echo "- Project Officer: project.officer@bgf.com"
echo "- Program Manager: program.manager@bgf.com"
echo "- Finance Director: finance.director@bgf.com"
echo "- Hospital Director: hospital.director@bgf.com"
echo "- Executive Director: executive.director@bgf.com"
echo "- CEO: ceo@bgf.com"
echo "- Founder (Male): founder.male@bgf.com"
echo "- Founder (Female): founder.female@bgf.com"
echo "- Admin: admin@bgf.com"
echo ""
echo "Password for all accounts: password123"
echo ""

# Display features
echo "✅ Key Features Available:"
echo "=========================="
echo "- Role-based access control (8 roles)"
echo "- Hierarchical approval workflow"
echo "- Real-time notifications"
echo "- Document upload and management"
echo "- Public application portal"
echo "- Staff management portal"
echo "- Comprehensive reporting"
echo "- Multi-channel notifications (Email/SMS)"
echo "- Home navigation (logo click)"
echo "- Application status tracking"
echo ""

echo "🔧 Useful Commands:"
echo "==================="
echo "- View logs: docker-compose logs -f [service-name]"
echo "- Stop services: docker-compose down"
echo "- Restart services: docker-compose restart"
echo "- View running services: docker-compose ps"
echo "- Test role-based access: cd frontend && node verify-roles.js"
echo ""

print_success "BGF Aid Management System deployment completed successfully!"
print_success "The system is now ready for use!"

echo ""
echo "📖 For detailed documentation, see: PRODUCTION_SETUP.md"
echo "🐛 For troubleshooting, check the Health Monitoring section in the docs"
echo ""
echo "Happy managing! 🎉"