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
<img width="1869" height="420" alt="Screenshot 2026-03-08 003801" src="https://github.com/user-attachments/assets/14969c65-04f4-43c5-a2bc-07e93b009458" />


COMPANY MODULE
| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET    | `/company`     | Get own company             |
| PATCH  | `/company/:id` | Update company (Admin only) |
| DELETE | `/company/:id` | Delete company (Admin only) |
<img width="1869" height="281" alt="Screenshot 2026-03-08 003734" src="https://github.com/user-attachments/assets/b9921f4d-6b99-4d85-98e5-c0053c842806" />


USER MODULE
| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/users/current`     | Get current user         |
| GET    | `/users/own-company` | Get all users in company |
| PATCH  | `/users/details/:id` | Update user              |
| DELETE | `/users/details/:id` | Delete user (Admin only) |
<img width="1859" height="416" alt="Screenshot 2026-03-08 003256" src="https://github.com/user-attachments/assets/d532b680-c615-4ba1-907b-9eadf7cc9e15" />


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
<img width="1845" height="700" alt="Screenshot 2026-03-08 003618" src="https://github.com/user-attachments/assets/f59ef084-cff6-4fd4-a5c1-3793345a0f82" />


PROFILE MODULE
| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| POST   | `/profile`                 | Create profile  |
| GET    | `/profile/current-profile` | Get own profile |
| PATCH  | `/profile`                 | Update profile  |
| DELETE | `/profile`                 | Delete profile  |
<img width="1843" height="348" alt="Screenshot 2026-03-08 003543" src="https://github.com/user-attachments/assets/cf598a80-a085-4f48-9e31-30260f2906a6" />


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
