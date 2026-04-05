# Finance Dashboard API

A backend for a finance dashboard built with Node.js, Express, TypeScript, Prisma, Zod, and SQLite.

## Overview

This project was built as a backend assessment submission. It focuses on clear API design, role-based access control, validation, data persistence, and summary-level dashboard analytics while keeping the codebase compact and easy to review.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Zod
- JWT authentication
- bcrypt

## Features Implemented

- User and role management
- Active and inactive user status handling
- JWT-based authentication
- Financial records CRUD
- Filtering records by date, category, and type
- Dashboard summary APIs
- Role-based access control
- Input validation and centralized error handling
- SQLite persistence with Prisma
- Seed script with test users and sample records

## Setup Instructions

### 1. Install dependencies

```bash
npm install
   ```

2. **Environment Variables**
   The project comes with a `.env` file pointing to a local SQLite database (`file:./dev.db`) and a mock `JWT_SECRET`. No need to set up anything manually for assessment review.

3. **Database Initialization**
   Apply the migrations and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the Database**
   ```bash
   npx ts-node prisma/seed.ts
   ```
   **Default Users Created:**
   - Admin: `admin@finance.local` / `admin123`
   - Analyst: `analyst@finance.local` / `analyst123`
   - Viewer: `viewer@finance.local` / `viewer123`

5. **Start the Server**
   ```bash
   npx ts-node src/server.ts
   ```
   Server runs at `http://localhost:3000`.

## Architecture & Assumptions

- **Simplified Layers**: DB access logic is grouped into controllers. Schema validation (Zod) lives alongside the route definitions/controllers to reduce file bloat.
- **RBAC**: 
  - Admin: Can manage users, alter user roles, and full CRUD on records.
  - Analyst/Viewer: View-only access on records and dashboards.
- **Soft Delete**: Records are marked as `isDeleted` instead of hard deleted. All dashboard aggregations and queries exclude deleted records.
- **Global Visibility**: Finance records are globally visible to the organization. Creator/updater information is tracked for auditing rather than data isolation.
- **Validation over Database Enums**: Attributes like `Role`, `RecordType` and `Status` are stored as simple strings in SQLite. Strictness is enforced via Zod schemas and TypeScript unions at the application layer. This deliberate simplification avoids database-level enum complexities while ensuring complete type safety and domain correctness.

## API Endpoints

### Authentication

| Method | Endpoint               | Description                        | Access        | 
| ------ | ---------------------- | ---------------------------------- | ------------- |
| POST   | `/api/auth/register`   | Create a new user (Viewer default) | Public        |
| POST   | `/api/auth/login`      | Login and get JWT                  | Public        |
| GET    | `/api/auth/me`         | Get current verified user profile  | Authenticated |

### Users Management

| Method | Endpoint                 | Description                          | Access | 
| ------ | ------------------------ | ------------------------------------ | ------ |
| GET    | `/api/users`             | List all users                       | Admin  |
| GET    | `/api/users/:id`         | Get specific user                    | Admin  |
| POST   | `/api/users`             | Add a user directly                  | Admin  |
| PATCH  | `/api/users/:id`         | Update name                          | Admin  |
| PATCH  | `/api/users/:id/role`    | Update user role                     | Admin  |
| PATCH  | `/api/users/:id/status`  | Update user status (active/inactive) | Admin  |

### Financial Records

| Method | Endpoint             | Description                                  | Access            | 
| ------ | -------------------- | -------------------------------------------- | ----------------- |
| GET    | `/api/records`       | List records (supports date, typing filters) | All Authenticated |
| GET    | `/api/records/:id`   | View specific record insights                | All Authenticated |
| POST   | `/api/records`       | Add a newly registered record                | Admin             |
| PUT    | `/api/records/:id`   | Modify an existing record                    | Admin             |
| DELETE | `/api/records/:id`   | Soft delete a recorded entry                 | Admin             |

### Dashboard

| Method | Endpoint                            | Description                        | Access            | 
| ------ | ----------------------------------- | ---------------------------------- | ----------------- |
| GET    | `/api/dashboard/summary`            | Global stats (inc, exp, net)       | All Authenticated |
| GET    | `/api/dashboard/category-breakdown` | Grouped amounts by categories      | All Authenticated |
| GET    | `/api/dashboard/recent-activity`    | Most recent 10 records             | All Authenticated |
| GET    | `/api/dashboard/monthly-trends`     | Month over month expenses & income | All Authenticated |