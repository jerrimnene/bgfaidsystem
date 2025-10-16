# BGF Aid Automation System

A comprehensive, production-ready web application for the Bridging Gap Foundation (BGF) NGO to manage grants, scholarships, and medical assistance programs with an automated workflow system.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React         │    │ • REST API      │    │ • User Data     │
│ • TypeScript    │    │ • JWT Auth      │    │ • Applications  │
│ • Tailwind CSS  │    │ • Workflow      │    │ • Logs & M&E    │
│ • Forms         │    │ • Notifications │    │ • Files         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Notifications  │
                    │                 │
                    │ • SendGrid      │
                    │ • Twilio        │
                    │ • Telegram      │
                    └─────────────────┘
```

## 🚀 Features

### Core Functionality
- **Multi-type Applications**: Small grants, high school scholarships, excellence scholarships, medical assistance
- **Complete Workflow System**: 8-stage approval process (PO → Manager → Finance/Hospital → Executive → CEO → Founders)
- **Role-based Access Control**: 9 user roles with specific permissions
- **Real-time Notifications**: Email, SMS, and Telegram notifications
- **Document Management**: File upload and verification system
- **Monitoring & Evaluation**: Impact tracking and disbursement management

### User Roles & Workflow

1. **Applicant** → Submits applications
2. **Project Officer** → Initial review and validation
3. **Program Manager** → Assigns and oversees workflow
4. **Finance Director** → Fund availability verification (grants/scholarships)
5. **Hospital Director** → Service availability verification (medical)
6. **Executive Director** → Strategic review
7. **CEO** → Executive approval
8. **Founders** → Final approval authority
9. **Admin** → System administration

### Application Types & Workflow Routes

#### Grants & Scholarships Route:
`Applicant → PO → Manager → Finance → Executive → CEO → Founders → Completed`

#### Medical Assistance Route:
`Applicant → PO → Manager → Hospital → Executive → CEO → Founders → Completed`

## 📁 Project Structure

```
bgf-aid-system/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication, validation
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   └── types/           # TypeScript types
│   └── package.json
├── frontend/                # Next.js React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── contexts/        # React contexts
│   │   └── types/           # TypeScript types
│   └── package.json
├── shared/                  # Shared types and utilities
├── database/                # Database schema and migrations
│   └── schema.sql
├── docker-compose.yml       # Docker services
├── Dockerfile               # Production Docker image
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd bgf-aid-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run setup
```

### 3. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Configure the following variables:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/bgf_aid_system
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bgf_aid_system
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.org
FROM_NAME=BGF Aid System

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Optional Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

#### Frontend (.env.local)
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local
echo "NEXT_PUBLIC_APP_NAME=BGF Aid System" >> .env.local
```

### 4. Database Setup

#### Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run -d \
  --name bgf-postgres \
  -e POSTGRES_DB=bgf_aid_system \
  -e POSTGRES_USER=bgf_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15
```

#### Manual PostgreSQL Setup
```bash
# Create database
createdb bgf_aid_system

# Run schema migration
psql -d bgf_aid_system -f database/schema.sql
```

### 5. Start Development Servers

#### Option 1: All services at once
```bash
npm run dev
```

#### Option 2: Individual services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Health Check**: http://localhost:3001/health

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update user profile

### Applications
- `GET /applications` - List applications (filtered by role)
- `POST /applications` - Create new application
- `GET /applications/:id` - Get application details
- `PUT /applications/:id` - Update application
- `POST /applications/:id/actions` - Execute workflow action
- `GET /applications/pending` - Get pending applications for user
- `GET /applications/stats` - Get application statistics

### Admin Routes
- `GET /users` - List all users (admin only)
- `PUT /users/:id/role` - Update user role (admin only)
- `PUT /users/:id/status` - Toggle user status (admin only)
- `GET /settings` - Get system settings (admin only)
- `PUT /settings/:key` - Update system setting (admin only)

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Authorization** (RBAC)
- **Input Validation** using Joi schemas
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **Password Hashing** using bcrypt
- **SQL Injection Prevention** using parameterized queries

## 📧 Notifications

The system supports multi-channel notifications:

### Email (SendGrid)
- Application status updates
- Assignment notifications
- Approval/rejection notices

### SMS (Twilio)  
- Critical status changes
- Urgent notifications
- Final approval alerts

### Telegram (Optional)
- Real-time updates for admins
- System alerts

## 🔄 Workflow States

### Application Status Flow:
```
new_submission
    ↓
po_review → po_approved → manager_review → manager_approved
    ↓              ↓              ↓              ↓
po_rejected   po_rejected   manager_rejected   (finance_review OR hospital_review)
    ↓              ↓              ↓              ↓
edit_requested edit_requested edit_requested  (finance_approved OR hospital_approved)
    ↓              ↓              ↓              ↓
(resubmit)    (resubmit)     (resubmit)     executive_review
                                                ↓
                                           executive_approved
                                                ↓
                                            ceo_review
                                                ↓
                                            ceo_approved
                                                ↓
                                           founder_review
                                                ↓
                                           founder_approved
                                                ↓
                                            completed
```

## 📈 Monitoring & Evaluation

### Tracking Features:
- **Beneficiary Profiles** - Complete recipient information
- **Fund Disbursement** - Track payment schedules and amounts
- **Impact Metrics** - Custom KPIs for each application type
- **Progress Reports** - Regular updates from beneficiaries
- **Follow-up Scheduling** - Automated reminder system

### Reporting:
- Application statistics dashboard
- Financial disbursement reports
- Success rate analytics
- User activity logs

## 🐳 Production Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Scale services (optional)
docker-compose up -d --scale backend=2 --scale frontend=2
```

### Environment Variables (Production)
Ensure all production environment variables are configured:
- Database connection strings
- API keys for third-party services
- JWT secrets (generate secure random strings)
- CORS origins for production domains

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests  
```bash
cd frontend
npm test
```

### Run All Tests
```bash
npm test
```

## 📝 Development Guidelines

### Code Style
- **ESLint** for code linting
- **Prettier** for code formatting  
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

### Database Migrations
- All schema changes should be in migration files
- Test migrations on development before production
- Keep backups before running migrations

### API Development
- Follow RESTful conventions
- Implement proper error handling
- Add input validation for all endpoints
- Document API changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete workflow system
- Multi-channel notifications  
- Role-based access control
- M&E tracking
- Admin panel

---

**Built with ❤️ for Bridging Gap Foundation**