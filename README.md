
APPROVAL-WORKFLOW-SYSTEM API
📋 Project Overview
The Approval Workflow System is a comprehensive backend API built to manage organizational approval processes. It enables companies to streamline request submissions, approvals, and rejections through a hierarchical workflow system. The system supports multiple user roles including Admins, Employees, Department Heads, and HR personnel, each with specific permissions and capabilities.

Key features include:

Multi-role user authentication and authorization
Company and department management
Request creation, approval, and rejection workflows
User profile management
Archive management for completed requests
🛠️ Tech Stack
Technology	Purpose
NestJS	Backend framework with modular architecture
JWT (JSON Web Tokens)	Secure authentication and authorization
Prisma ORM	Type-safe database access and migrations
PostgreSQL	Relational database for data persistence
TypeScript	Type-safe development
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
PostgreSQL (v14 or higher)
npm or yarn package manager
Installation
Clone the repository
git clone https://github.com/your-username/    approval-workflow-system.gitcd approval-workflow-system
Install dependencies
npm install# oryarn install
Set up environment variables
cp .env.example .env
Configure your database and run migrations
npx prisma migrate devnpx prisma generate
Seed the database (optional)
npx prisma db seed
Start the development server
npm run start:dev# oryarn start:dev
The API will be available at http://localhost:8000

🔐 Environment Variables
Create a .env file in the root directory with the following variables:

# Database ConfigurationDATABASE_URL="postgresql://    username:password@localhost:5432/    approval_workflow_db?schema=public"# JWT ConfigurationJWT_SECRET="your-super-secret-jwt-key-here"JWT_EXPIRES_IN="24h"JWT_REFRESH_SECRET="your-refresh-token-secret    "JWT_REFRESH_EXPIRES_IN="7d"# Application ConfigurationPORT=8000NODE_ENV=development# Optional: Bcrypt ConfigurationBCRYPT_SALT_ROUNDS=10
Variable	Description	Required
DATABASE_URL	PostgreSQL connection string	✅
JWT_SECRET	Secret key for signing JWT tokens	✅
JWT_EXPIRES_IN	Token expiration time (e.g., "24h", "1d")	✅
JWT_REFRESH_SECRET	Secret for refresh tokens	✅
JWT_REFRESH_EXPIRES_IN	Refresh token expiration	✅
PORT	Server port number	❌ (default: 8000)
NODE_ENV	Environment mode	❌
📡 API Endpoints
Base URL: http://localhost:8000

🔑 AUTH Endpoints
Authentication endpoints for user registration and login.

Register Admin
Creates a new admin user account.

Property	Value
Method	POST
URL	/auth/register-admin
Auth Required	No
Request Headers:

Content-Type: application/json
Request Body:

{    "email": "admin@company.com",    "password": "securePassword123",    "name": "Admin User",    "companyName": "Tech Corp"}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "Admin registered     "data": {        "id": 1,        "email": "admin@company.com",        "name": "Admin User",        "role": "ADMIN",        "companyId": 1,        "createdAt": "2024-01-15T10:30:00.        successfully",            000Z"    }}
Login
Authenticates a user and returns a JWT token.

Property	Value
Method	POST
URL	/auth/login
Auth Required	No
Request Headers:

Content-Type: application/json
Request Body:

{    "email": "user@company.com",    "password": "yourPassword123"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Login successful",    "data": {        "accessToken":             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX            VCJ9...",        "refreshToken":             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX            VCJ9...",        "user": {            "id": 1,            "email": "user@company.com",            "name": "John Doe",            "role": "EMPLOYEE"        }    }}
Register as Employee
Registers a new employee user.

Property	Value
Method	POST
URL	/auth/register-employee
Auth Required	No
Request Headers:

Content-Type: application/json
Request Body:

{    "email": "employee@company.com",    "password": "securePassword123",    "name": "Jane Employee",    "companyCode": "TECH001"}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "Employee registered         successfully",    "data": {        "id": 2,        "email": "employee@company.com",        "name": "Jane Employee",        "role": "EMPLOYEE",        "companyId": 1,        "createdAt": "2024-01-15T11:00:00.    }            000Z"}
Register as Department Head
Registers a new department head user.

Property	Value
Method	POST
URL	/auth/register-departmentHead
Auth Required	No
Request Headers:

Content-Type: application/json
Request Body:

{    "email": "depthead@company.com",    "password": "securePassword123",    "name": "Department Head",    "companyCode": "TECH001",    "department": "Engineering"}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "Department Head registered         successfully",    "data": {        "id": 3,        "email": "depthead@company.com",        "name": "Department Head",        "role": "DEPARTMENT_HEAD",        "department": "Engineering",        "companyId": 1,        "createdAt": "2024-01-15T11:30:00.    }            000Z"}
Register as HR
Registers a new HR personnel user.

Property	Value
Method	POST
URL	/auth/register-departmentHead
Auth Required	No
Request Headers:

Content-Type: application/json
Request Body:

{    "email": "hr@company.com",    "password": "securePassword123",    "name": "HR Manager",    "companyCode": "TECH001",    "role": "HR"}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "HR registered successfully",    "data": {        "id": 4,        "email": "hr@company.com",        "name": "HR Manager",        "role": "HR",        "companyId": 1,        "createdAt": "2024-01-15T12:00:00.    }            000Z"}
🏢 COMPANY Endpoints
Endpoints for managing company information.

Get My Company
Retrieves the current user's company information.

Property	Value
Method	GET
URL	/company
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Company retrieved         successfully",    "data": {        "id": 1,        "name": "Tech Corp",        "code": "TECH001",        "address": "123 Tech Street",        "industry": "Technology",        "employeeCount": 150,        "createdAt": "2024-01-01T00:00:00.        "updatedAt": "2024-01-15T10:00:00.            000Z",            000Z"    }}
Update Company
Updates company information (Admin only).

Property	Value
Method	PATCH
URL	/company/:id
Auth Required	Yes (Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "name": "Tech Corp International",    "address": "456 Innovation Avenue",    "industry": "Software Development"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Company updated     "data": {        "id": 4,        "name": "Tech Corp International",        "code": "TECH001",        "address": "456 Innovation Avenue",        "industry": "Software Development",        "updatedAt": "2024-01-15T14:00:00.        successfully",            000Z"    }}
Delete Company
Deletes a company (Admin only).

Property	Value
Method	DELETE
URL	/company/:id
Auth Required	Yes (Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Company deleted successfully"}
👥 USERS Endpoints
Endpoints for user management.

Get All Users in Own Company
Retrieves all users belonging to the current user's company.

Property	Value
Method	GET
URL	/users/own-company
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Users retrieved     "data": [        {            "id": 1,            "email": "admin@company.com",            "name": "Admin User",            "role": "ADMIN"        },        {            "id": 2,            "email": "employee@company.com",            "name": "Jane Employee",            "role": "EMPLOYEE"        }    ]        successfully",}
Get Current User
Retrieves the currently authenticated user's information.

Property	Value
Method	GET
URL	/users/current
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "User retrieved successfully",    "data": {        "id": 1,        "email": "user@company.com",        "name": "John Doe",        "role": "EMPLOYEE",        "companyId": 1,        "createdAt": "2024-01-10T08:00:00.    }            000Z"}
Update User
Updates a user's information.

Property	Value
Method	PATCH
URL	/users/details/:id
Auth Required	Yes (Admin/Self)
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "name": "John Updated",    "email": "john.updated@company.com"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "User updated successfully",    "data": {        "id": 6,        "email": "john.updated@company.com",        "name": "John Updated",        "role": "EMPLOYEE",        "updatedAt": "2024-01-15T15:00:00.    }            000Z"}
Delete User
Deletes a user account.

Property	Value
Method	DELETE
URL	/users/details/:id
Auth Required	Yes (Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "User deleted successfully"}
📝 REQUEST Endpoints
Endpoints for managing approval requests.

Create Request
Creates a new approval request.

Property	Value
Method	POST
URL	/requests
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "title": "Leave Request",    "description": "Annual leave for     "type": "LEAVE",    "startDate": "2024-02-01",    "endDate": "2024-02-05",    "details": {        "reason": "Family vacation",        "daysRequested": 5    }        vacation",}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "Request created     "data": {        "id": 1,        "title": "Leave Request",        "description": "Annual leave for             vacation",        "type": "LEAVE",        "status": "PENDING",        "userId": 2,        "createdAt": "2024-01-15T16:00:00.        successfully",            000Z"    }}
Get All My Requests
Retrieves all requests created by the current user.

Property	Value
Method	GET
URL	/requests/my-records
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Requests retrieved         successfully",    "data": [        {            "id": 1,            "title": "Leave Request",            "status": "PENDING",            "createdAt":         },        {            "id": 2,            "title": "Equipment Request",            "status": "APPROVED",            "createdAt":         }                "2024-01-15T16:00:00.000Z"                "2024-01-10T09:00:00.000Z"    ]}
Get Request by ID
Retrieves a specific request by its ID.

Property	Value
Method	GET
URL	/requests/:id
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Request retrieved         successfully",    "data": {        "id": 7,        "title": "Leave Request",        "description": "Annual leave for             vacation",        "type": "LEAVE",        "status": "PENDING",        "userId": 2,        "approvedBy": null,        "createdAt": "2024-01-15T16:00:00.        "updatedAt": "2024-01-15T16:00:00.            000Z",            000Z"    }}
Approve Request
Approves a pending request (Department Head/HR/Admin only).

Property	Value
Method	PATCH
URL	/requests/approved/:id
Auth Required	Yes (Department Head/HR/Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body (optional):

{    "comments": "Approved. Enjoy your         vacation!"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Request approved     "data": {        "id": 12,        "status": "APPROVED",        "approvedBy": 3,        "approvedAt": "2024-01-15T17:00:00.        "comments": "Approved. Enjoy your             vacation!"        successfully",            000Z",    }}
Get Pending Requests
Retrieves all pending requests (for approvers).

Property	Value
Method	GET
URL	/requests/pending-requests
Auth Required	Yes (Department Head/HR/Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Pending requests retrieved         successfully",    "data": [        {            "id": 5,            "title": "Leave Request",            "status": "PENDING",            "user": {                "id": 2,                "name": "Jane Employee"            },            "createdAt":         }    ]                "2024-01-15T16:00:00.000Z"}
Reject Request
Rejects a pending request (Department Head/HR/Admin only).

Property	Value
Method	PATCH
URL	/requests/reject/:id
Auth Required	Yes (Department Head/HR/Admin)
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "reason": "Insufficient leave balance"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Request rejected     "data": {        "id": 12,        "status": "REJECTED",        "rejectedBy": 3,        "rejectedAt": "2024-01-15T17:30:00.        "rejectionReason": "Insufficient             leave balance"        successfully",            000Z",    }}
Get All Archive Requests
Retrieves all archived (completed) requests.

Property	Value
Method	GET
URL	/requests/archive-requests
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Archived requests retrieved         successfully",    "data": [        {            "id": 1,            "title": "Equipment Request",            "status": "APPROVED",            "archivedAt":                 "2024-01-14T10:00:00.000Z"        },        {            "id": 2,            "title": "Budget Request",            "status": "REJECTED",            "archivedAt":                 "2024-01-13T15:00:00.000Z"        }    ]}
Delete Own Request
Deletes a specific request owned by the current user.

Property	Value
Method	DELETE
URL	/requests/:id
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Request deleted successfully"}
Delete All My Requests
Deletes all requests owned by the current user.

Property	Value
Method	DELETE
URL	/requests/delete-all
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "All requests deleted         successfully",    "data": {        "deletedCount": 5    }}
👤 PROFILE Endpoints
Endpoints for managing user profiles.

Create Profile
Creates a profile for the current user.

Property	Value
Method	POST
URL	/profile
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "firstName": "John",    "lastName": "Doe",    "phone": "+1234567890",    "address": "123 Main Street",    "department": "Engineering",    "position": "Software Developer",    "dateOfBirth": "1990-05-15"}
Sample Response (201 Created):

{    "statusCode": 201,    "message": "Profile created     "data": {        "id": 1,        "userId": 2,        "firstName": "John",        "lastName": "Doe",        "phone": "+1234567890",        "department": "Engineering",        "position": "Software Developer",        "createdAt": "2024-01-15T18:00:00.        successfully",            000Z"    }}
Get Own Profile
Retrieves the current user's profile.

Property	Value
Method	GET
URL	/profile/current-profile
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Profile retrieved         successfully",    "data": {        "id": 1,        "userId": 2,        "firstName": "John",        "lastName": "Doe",        "phone": "+1234567890",        "address": "123 Main Street",        "department": "Engineering",        "position": "Software Developer",        "dateOfBirth": "1990-05-15",        "createdAt": "2024-01-15T18:00:00.    }            000Z"}
Update Profile
Updates the current user's profile.

Property	Value
Method	PATCH
URL	/profile
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>Content-Type: application/json
Request Body:

{    "phone": "+0987654321",    "address": "456 New Avenue",    "position": "Senior Software Developer"}
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Profile updated     "data": {        "id": 1,        "phone": "+0987654321",        "address": "456 New Avenue",        "position": "Senior Software         "updatedAt": "2024-01-15T19:00:00.        successfully",            Developer",            000Z"    }}
Delete Profile
Deletes the current user's profile.

Property	Value
Method	DELETE
URL	/profile
Auth Required	Yes
Request Headers:

Authorization: Bearer <your_jwt_token>
Sample Response (200 OK):

{    "statusCode": 200,    "message": "Profile deleted successfully"}
🔒 Authentication
This API uses JWT (JSON Web Token) for authentication.

Authentication Flow
┌─────────────┐     ┌─────────────┐         ┌─────────────┐│   Client    │────▶│  /auth/login │────▶│       Server    │└─────────────┘     └─────────────┘         └─────────────┘                           │                           ▼                    ┌─────────────┐                    │ Validate    │                    │ Credentials │                    └─────────────┘                           │                           ▼                    ┌─────────────┐                    │ Generate    │                    │ JWT Token   │                    └─────────────┘                           │                           ▼                    ┌─────────────┐                    │ Return Token│                    │ to Client   │                    └─────────────┘
Using the Token
Include the JWT token in the Authorization header for all protected routes:

Authorization: Bearer     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Token Structure
The JWT payload contains:

{    "sub": 1,    "email": "user@company.com",    "role": "EMPLOYEE",    "companyId": 1,    "iat": 1705312800,    "exp": 1705399200}
👥 User Roles
Role	Description	Permissions
ADMIN	System administrator	Full access to all resources, company management, user management
DEPARTMENT_HEAD	Department manager	Approve/reject requests in their department, view department users
HR	Human Resources	Manage employee profiles, approve/reject HR-related requests
EMPLOYEE	Regular employee	Create requests, manage own profile, view own requests
Role Hierarchy
ADMIN  └── Full system access  └── Company CRUD operations  └── User management  └── All request operationsDEPARTMENT_HEAD  └── Approve/Reject department requests  └── View department employees  └── Create own requestsHR  └── Approve/Reject HR requests  └── View all employee profiles  └── Create own requestsEMPLOYEE  └── Create requests  └── View own requests  └── Manage own profile
🗄️ Database Schema
Prisma Models Overview
// User Modelmodel User {  id          Int       @id @default    (autoincrement())  email       String    @unique  password    String  name        String  role        Role      @default(EMPLOYEE)  companyId   Int  company     Company   @relation(fields:     [companyId], references: [id])  profile     Profile?  requests    Request[]  createdAt   DateTime  @default(now())  updatedAt   DateTime  @updatedAt}// Company Modelmodel Company {  id            Int       @id @default    (autoincrement())  name          String  code          String    @unique  address       String?  industry      String?  users         User[]  createdAt     DateTime  @default(now())  updatedAt     DateTime  @updatedAt}// Profile Modelmodel Profile {  id          Int       @id @default    (autoincrement())  userId      Int       @unique  user        User      @relation(fields:     [userId], references: [id])  firstName   String  lastName    String  phone       String?  address     String?  department  String?  position    String?  dateOfBirth DateTime?  createdAt   DateTime  @default(now())  updatedAt   DateTime  @updatedAt}// Request Modelmodel Request {  id              Int           @id @default    (autoincrement())  title           String  description     String?  type            RequestType  status          RequestStatus @default    (PENDING)  userId          Int  user            User          @relation    (fields: [userId], references: [id])  approvedBy      Int?  rejectedBy      Int?  comments        String?  rejectionReason String?  isArchived      Boolean       @default    (false)  createdAt       DateTime      @default(now    ())  updatedAt       DateTime      @updatedAt}// Enumsenum Role {  ADMIN  DEPARTMENT_HEAD  HR  EMPLOYEE}enum RequestStatus {  PENDING  APPROVED  REJECTED}enum RequestType {  LEAVE  EQUIPMENT  BUDGET  TRAVEL  OTHER}
Entity Relationship Diagram
┌──────────────┐       ┌──────────────┐│   Company    │───────│     User     │└──────────────┘  1:N  └──────────────┘                              │                    ┌─────────┴─────────┐                    │                   │                   1:1                 1:N                    │                   │              ┌─────▼─────┐                      ┌──────▼─────┐              │  Profile  │      │                  Request   │              └───────────┘                      └────────────┘
📋 Error Responses
The API returns consistent error responses:

{    "statusCode": 400,    "message": "Validation failed",    "error": "Bad Request",    "details": [        {            "field": "email",            "message": "Invalid email format"        }    ]}
Common HTTP Status Codes
Code	Description
200	Success
201	Created
400	Bad Request - Invalid input
401	Unauthorized - Invalid/missing token
403	Forbidden - Insufficient permissions
404	Not Found - Resource doesn't exist
409	Conflict - Resource already exists
500	Internal Server Error
📝 License
This project is licensed under the MIT License.
