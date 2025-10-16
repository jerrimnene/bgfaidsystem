# BGF Aid System - Staff Login Credentials

## All Staff Login Accounts

All accounts use the same password: **password123**

### Staff Hierarchy (Project Officer to Founders)

| Role | Email | Name | Access Level |
|------|-------|------|--------------|
| **Project Officer** | `project.officer@bgf.com` | Bibiana Matambo | Application review and initial assessment |
| **Programs Manager** | `program.manager@bgf.com` | Patisiwe Zaba | Team management and application assignment |
| **Finance Director** | `finance.director@bgf.com` | Nsandula Sinchuke | Budget approval and financial oversight |
| **Hospital Director** | `hospital.director@bgf.com` | Dr. Chimuka | Medical assistance approval |
| **Executive Director** | `executive.director@bgf.com` | Prof. B. Nyahuma | Executive-level approvals |
| **CEO** | `ceo@bgf.com` | Mr M. Chitambo | CEO-level approvals and strategic oversight |
| **Founder (Male)** | `founder.male@bgf.com` | Mr. Tagwirei | Final approval authority |
| **Founder (Female)** | `founder.female@bgf.com` | Mrs. Tagwirei | Final approval authority |

### Additional Staff Roles

| Role | Email | Name | Access Level |
|------|-------|------|--------------|
| **Finance Release** | `finance.release@bgf.com` | Finance Release Officer | Fund disbursement |
| **Hospital Acceptance** | `hospital.acceptance@bgf.com` | Hospital Acceptance Officer | Medical service coordination |

### Other Account Types

| Role | Email | Name | Access Level |
|------|-------|------|--------------|
| **Admin** | `admin@bgf.com` | System Administrator | Full system access |
| **Applicant** | `applicant@bgf.com` | John Mukamuri | Application submission |
| **Applicant** | `user@example.com` | Grace Moyo | Application submission |

## How to Login

1. Go to the login page at `http://localhost:3000/auth/login`
2. Enter any of the email addresses above
3. Enter password: `password123`
4. Click "Login"

The system will automatically:
- Assign the appropriate role
- Show role-specific dashboard
- Provide access to relevant navigation items
- Display personalized user information

## Role-Based Features

Each role has different dashboard views and navigation options:

- **Project Officers**: Review applications, manage assignments
- **Program Managers**: Assign applications, manage team
- **Finance/Hospital Directors**: Approve applications, view reports
- **Executive Director/CEO**: High-level approvals, analytics
- **Founders**: Final approvals, impact reports
- **Finance Release**: Fund disbursements
- **Hospital Acceptance**: Medical service coordination
- **Admin**: User management, system settings

## Development Notes

- All accounts are demo accounts for development/testing
- In production, these would be replaced with real authentication
- The role-based access control is fully implemented
- Each role has appropriate navigation and dashboard views