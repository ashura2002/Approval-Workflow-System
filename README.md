🚀 Approval Workflow System API

A NestJS-based approval workflow system with JWT authentication, Prisma ORM, and PostgreSQL.

🧰 Tech Stack
NestJS
JWT Authentication
Prisma ORM
PostgreSQL

⚙️ Setup
npm install
npx prisma migrate dev
npm run start:dev

Environment Variables
DATABASE_URL="postgresql://user:password@localhost:5432/approval_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
SERVER_PORT=8000

API Endpoints
Base URL -> http://localhost:8000
⚠️ All protected routes require: Authorization: Bearer <token>

AUTH MODULE
| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| POST   | `/auth/register-admin`          | Register admin (creates company) |
| POST   | `/auth/register-employee`       | Register employee                |
| POST   | `/auth/register-departmentHead` | Register department head         |
| POST   | `/auth/register-hr`             | Register HR                      |
| POST   | `/auth/login`                   | Login and receive JWT token      |

COMPANY MODULE
| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET    | `/company`     | Get own company             |
| PATCH  | `/company/:id` | Update company (Admin only) |
| DELETE | `/company/:id` | Delete company (Admin only) |

USER MODULE
| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/users/current`     | Get current user         |
| GET    | `/users/own-company` | Get all users in company |
| PATCH  | `/users/details/:id` | Update user              |
| DELETE | `/users/details/:id` | Delete user (Admin only) |

REQUEST MODULE
| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| POST   | `/requests`                  | Create request                   |
| GET    | `/requests/my-records`       | Get own requests                 |
| GET    | `/requests/:id`              | Get request by ID                |
| GET    | `/requests/pending-requests` | Get pending requests (Approvers) |
| GET    | `/requests/archive-requests` | Get archived requests            |
| PATCH  | `/requests/approved/:id`     | Approve request                  |
| PATCH  | `/requests/reject/:id`       | Reject request                   |
| DELETE | `/requests/:id`              | Delete own request               |
| DELETE | `/requests/delete-all`       | Delete all own requests          |

PROFILE MODULE
| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| POST   | `/profile`                 | Create profile  |
| GET    | `/profile/current-profile` | Get own profile |
| PATCH  | `/profile`                 | Update profile  |
| DELETE | `/profile`                 | Delete profile  |

USER MODULE
| Role            | Permissions                            |
| --------------- | -------------------------------------- |
| ADMIN           | Full access, company & user management |
| DEPARTMENT_HEAD | Approve/reject department requests     |
| HR              | Manage profiles, approve HR requests   |
| EMPLOYEE        | Create requests, manage own profile    |

Database Models
User
 ├── Profile (1:1)
 ├── Request (1:N)
 └── Company (N:1)

 ENUMS
 Roles:
  ADMIN
  DEPARTMENT_HEAD
  HR
  EMPLOYEE
  
RequestStatus:
  PENDING
  APPROVED
  REJECTED
  
RequestType:
  LEAVE
  EQUIPMENT
  BUDGET
  TRAVEL
  OTHER
