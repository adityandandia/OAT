OneTest

A full-stack testing & assessment platform for educational institutions
and training organizations.

OneTest lets course creators design tests, manage student batches
(cohorts), track performance with detailed analytics, and run a complete
learning assessment workflow — from login to results.

For new interns: Read this document before writing code. It
explains what is real, what is mocked, and where everything lives.

Table of Contents

Project Status at a Glance

Tech Stack

Architecture Overview

Project Structure

Getting Started

Environment Variables

Database Schema

Backend API Reference

Authentication Flow

Frontend Guide

Mock Data & Mock Mode

Development Workflow

Testing the API

Troubleshooting

Production Deployment Checklist

Contributing Guide for Interns

FAQ

1. Project Status at a Glance

Layer

Status

Notes

Frontend

✅ Fully functional

React 19 + Vite, runs on port 5173, mostly using mock data

Backend

⚠️ Partially implemented

FastAPI on port 8000; authentication routes are live

Database

⚠️ Schema partially built

MSSQL; 3 of 7 planned tables are implemented and wired up

Auth

✅ Working

JWT token-based, role-based access for Learner, Creator, and Admin

Important: The frontend and backend are not fully connected yet.
Most frontend features — tests, courses, cohorts, and results — use
mock/local data through AppContext.jsx and testsService.js,
persisted to localStorage. The frontend currently has
MOCK_LOGIN_ENABLED = true.

2. Tech Stack

Frontend

React 19.1.0

Vite 7.0.0

React Router DOM 7.6.0

Axios 1.18.1

Tailwind CSS 4.3.3

Lucide React 0.468.0

Backend

FastAPI 0.115.6

Uvicorn 0.34.0

SQLAlchemy 2.0.36

Pydantic 2.10.4

PyJWT 2.10.1

Passlib (bcrypt) 1.7.4

PyODBC 5.2.0

python-dotenv 1.0.1

Database

MSSQL Server 2019+ (SQL Server Express is fine)

ODBC Driver 18 for SQL Server

Database name: OneTestDB

3. Architecture Overview

React Frontend (localhost:5173)
          │ HTTP / JSON
          ▼
FastAPI Backend (localhost:8000)
          │ SQL
          ▼
MSSQL Server (OneTestDB)

Frontend mock data is currently stored in localStorage using the `shai_` prefix.

The frontend talks to the backend through src/api/axios.js, which
attaches the JWT from localStorage to requests.

Currently, authentication is the backend-backed area. Tests, courses,
cohorts, and results are still simulated in the frontend. The long-term
plan is to replace testsService.js and mock/default data in
AppContext.jsx with real FastAPI routes as they are implemented.

4. Project Structure

OneTest/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── CreateAssessmentModal.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   ├── AppContext.jsx
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── CoursePage.jsx
│       ├── services/
│       │   └── testsService.js
│       └── views/
│           ├── AdminDashboard.jsx
│           ├── CreatorDashboard.jsx
│           ├── StudentDashboard.jsx
│           ├── TestTaking.jsx
│           └── CourseEditor.jsx
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── dependencies.py
│   ├── security.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── test_connection.py
│   └── diagnostic.py
├── database/
│   ├── README.md
│   ├── requirements.txt
│   ├── schema/
│   │   ├── schema.sql
│   │   └── auth_schemas.py
│   └── scripts/
│       ├── test_connection.py
│       └── seed/
│           └── seed.sql
├── pseudocode/
│   └── authentication_pseudocode.txt
├── node-portable/
│   └── node-v20.12.2-win-x64/
└── README.md

5. Getting Started

Prerequisites

Node.js 20+ (or the bundled node-portable/ on Windows)

Python 3.10+

MSSQL Server 2019+ with ODBC Driver 18

Git

Step 1 — Clone and create the database

git clone <your-repository-url>
cd OneTest

In SQL Server Management Studio or sqlcmd:

CREATE DATABASE OneTestDB;

Run database/schema/schema.sql against OneTestDB.

Optionally run database/scripts/seed/seed.sql for sample data.

Step 2 — Backend setup

cd backend
pip install -r requirements.txt

Create backend/.env as described in Section 6.

Start the API:

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

Verify it:

curl http://localhost:8000/

Expected:

{
  "message": "OneTest Backend API is running successfully!"
}

Step 3 — Frontend setup

In a second terminal:

cd frontend
npm install
npm run dev

Open http://localhost:5173.

Step 4 — Login

Mock login is currently enabled, so any credentials work:

Username: admin
Password: anything

Once mock mode is disabled, use a real row from the Employee table.

6. Environment Variables

Create backend/.env:

DB_SERVER=localhost
DB_NAME=OneTestDB
DB_USER=sa
DB_PASSWORD=YourMSSQLPassword
JWT_SECRET=your_super_secret_key_change_in_production

Variable

Description

DB_SERVER

MSSQL host

DB_NAME

Database name

DB_USER

MSSQL login

DB_PASSWORD

MSSQL password

JWT_SECRET

Secret used to sign JWTs

Never commit .env to Git. Add it to .gitignore.

7. Database Schema

Seven tables are planned; three are currently implemented and wired to
code.

Employee

Users of every role.

Learner: take tests, view own results, browse enrolled courses

Creator: create/edit tests and courses, view batch performance

Admin: full system access

CREATE TABLE Employee (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Department VARCHAR(100) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

Batch

Cohorts/groups of students used for test assignment and performance
tracking.

CREATE TABLE Batch (
    BatchID INT IDENTITY(1,1) PRIMARY KEY,
    BatchName VARCHAR(100) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

Course

Learning modules.

Relationship: 1 Creator → N Courses.

CREATE TABLE Course (
    CourseID INT IDENTITY(1,1) PRIMARY KEY,
    CourseName VARCHAR(150) NOT NULL,
    CreatedBy INT NOT NULL,
    EnrolledCount INT NOT NULL DEFAULT 0,
    AttemptedCount INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Course_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Employee(EmployeeID)
);

Planned tables

Table

Purpose

Test

Assessment configurations: questions, timing, attempts allowed

Enrollment

M — Employees ↔ Batches

TestAttempt

Student test submissions and scores

BatchCourse

M — Batches ↔ Tests

If implementing one of these tables, add the SQLAlchemy model to
models.py, SQL to schema.sql, a Pydantic schema to schemas.py, and
a router under routers/.

8. Backend API Reference

Base URL: http://localhost:8000

GET /

Health check.

{
  "message": "OneTest Backend API is running successfully!"
}

POST /auth/login

Authenticates a user with username or Employee ID + password and returns
a JWT.

Request:

{
  "identifier": "john_doe",
  "password": "password123"
}

Successful response:

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "employee_id": 1,
    "name": "John Doe",
    "username": "john_doe",
    "department": "Engineering",
    "role": "Learner"
  }
}

Possible errors:

400 — missing required fields

401 — invalid credentials

403 — role is not allowed

GET /auth/me

Protected endpoint returning the authenticated user.

Header:

Authorization: Bearer <token>

Successful response:

{
  "employee_id": 1,
  "name": "John Doe",
  "username": "john_doe",
  "department": "Engineering",
  "role": "Learner"
}

Possible errors:

{ "detail": "Invalid token" }

{ "detail": "User not found" }

HTTP Status Codes

Code

Meaning

What to check

200

Success

—

400

Bad Request

Missing fields

401

Unauthorized

Invalid/expired token or credentials

403

Forbidden

Role not allowed

404

Not Found

Endpoint/resource does not exist

500

Server Error

Backend terminal logs

9. Authentication Flow

Login form
   │
   ▼
POST /auth/login
   │
   ▼
Validate fields → Query Employee → Check password → Check role
   │
   ▼
Generate JWT
   │
   ▼
Frontend stores token/user in localStorage/AppContext
   │
   ▼
Dashboard loads
   │
   ▼
GET /auth/me with Bearer JWT
   │
   ▼
Backend verifies JWT and returns user
   │
   ▼
Dashboard rendered according to role

Implementation notes:

JWTs use HS256 and expire after 24 hours.

Passwords should use bcrypt through Passlib.

dependencies.py provides get_current_user() for protected routes.

The current login() implementation directly compares
user.password_hash != password; this must be changed to
verify_password() before production.

Seeded passwords must be hashed, not stored in plaintext.

10. Frontend Guide

Global state — AppContext.jsx

Contains:

user

tests

courses

studentResults

cohorts

and actions such as:

login()

createTest()

createCourse()

createCohort()

addStudentToCohort()

submitTestResult()

Key views

File

Purpose

Login.jsx

Login form and role redirect

CoursePage.jsx

Enrolled courses

AdminDashboard.jsx

Batches, performance, test assignment, analytics

CreatorDashboard.jsx

Create/edit/delete tests and courses

StudentDashboard.jsx

Available tests, attempts, scores, courses

TestTaking.jsx

Test-taking UI

CourseEditor.jsx

Course authoring

Routing

ProtectedRoute.jsx provides role-based route protection:

No user → /login

Wrong role → /unauthorized

API client

src/api/axios.js uses:

http://localhost:8000

It attaches the JWT as:

Authorization: Bearer <token>

and redirects to /login on 401.

11. Mock Data & Mock Mode

Most of the application currently uses mock data because the backend is
not yet complete.

Mock data lives in:

context/AppContext.jsx

DEFAULT_TESTS

DEFAULT_COURSES

DEFAULT_STUDENT_RESULTS

DEFAULT_COHORTS

services/testsService.js

getAllTests()

getEnrolledCourses()

createTest()

deleteTest()

The mock service uses a simulated 400 ms network delay.

Mock login

const MOCK_LOGIN_ENABLED = true;

When enabled, any username/password combination logs in with a fake
token.

localStorage keys

shai_user
shai_tests
shai_courses
shai_student_results
shai_cohorts

Inspect them:

JSON.parse(localStorage.getItem('shai_tests'))
JSON.parse(localStorage.getItem('shai_courses'))
JSON.parse(localStorage.getItem('shai_student_results'))
JSON.parse(localStorage.getItem('shai_cohorts'))

Built-in sample tests:

js-basics — JavaScript & Web Engineering

react-fundamentals — React Fundamentals

html-css — HTML & CSS Design System

db-basics — Database & SQL Engineering

python-basics — Python Programming

12. Development Workflow

Backend

Edit files under backend/.

Uvicorn auto-reloads with --reload.

Watch the terminal for tracebacks.

Frontend

Edit files under frontend/src/.

Vite hot-reloads the browser.

Watch the browser console for errors.

Quick map

Task

Action

Add API endpoint

Add handler under backend/routers/, register it in main.py, add models to schemas.py

Add database table

Add ORM model to models.py and SQL to schema.sql

Change mock data

Edit DEFAULT_* arrays or mock services

Test endpoint without UI

Use cURL, Postman, or browser console

13. Testing the API

cURL

curl -X POST http://localhost:8000/auth/login   -H "Content-Type: application/json"   -d '{"identifier":"admin","password":"test"}'

Postman

New request → POST

URL: http://localhost:8000/auth/login

Body → raw JSON

Send and inspect the response

Example body:

{
  "identifier": "admin",
  "password": "test"
}

Browser console

fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ identifier: 'admin', password: 'test' })
}).then(r => r.json()).then(console.log);

Protected endpoint:

fetch('http://localhost:8000/auth/me', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN_HERE' }
}).then(r => r.json()).then(console.log);

14. Troubleshooting

Backend won't start

Check Python version.

Run pip install -r requirements.txt.

Check backend/.env.

Read the terminal traceback.

Frontend won't load

Check Node.js version.

Run npm install.

Run npm run dev.

Check port 5173.

Check the browser console.

Database connection failed

Confirm MSSQL is running.

Confirm ODBC Driver 18 is installed.

Confirm OneTestDB exists.

Check the database environment variables.

Use the project's database connection test utilities.

CORS errors

Confirm main.py allows the frontend origin:

http://localhost:5173

15. Production Deployment Checklist

Replace JWT_SECRET with a strong random value.

Set a real production database password.

Point database configuration at the production MSSQL instance.

Replace plaintext password comparison with verify_password() and
bcrypt hashes.

Use a production ASGI setup such as Gunicorn + Uvicorn workers.

Run npm run build for the frontend.

Serve the frontend through Nginx/Apache.

Set up HTTPS/SSL.

Restrict CORS to the production domain.

Turn off MOCK_LOGIN_ENABLED.

Set up database backups.

Add logging, monitoring, and alerting.

16. Contributing Guide for Interns

Pull before you push.

Use a branch per feature:

git checkout -b feature/short-description

Do not commit .env, node_modules/, or __pycache__/.

Update the API Reference when adding/changing backend routes.

Update the Mock Data section when changing frontend mock data.

Ask before removing mock mode.

Prefer small PRs.

When stuck, check Troubleshooting first and then report:

what you ran

what you expected

what you got

the actual error/traceback

17. FAQ

Why does login work with any password?

Because MOCK_LOGIN_ENABLED = true in AppContext.jsx.

Where are new tests and courses saved?

Currently to localStorage through AppContext.jsx, not the database.

Why doesn't adding an Employee row make login work?

Because the frontend is still in mock mode. Disable mock login when the
real /auth/login flow is ready.

Which port does what?

Service

URL

Port

Frontend

http://localhost:5173

5173

Backend API

http://localhost:8000

8000

Backend health check

http://localhost:8000/

8000

MSSQL Server

localhost

1433

What is safe to build right now?

The Employee, Batch, and Course tables plus authentication are the
current working foundation. The remaining backend features require both
backend routes and frontend wiring.

Project Status Reminder

Not everything visible in the frontend is backed by MSSQL yet.

Authentication has a backend implementation, while most tests, courses,
cohorts, and results are still simulated through frontend mock data and
localStorage.

When adding a backend-backed feature, update both the implementation and
this README so the documentation stays in sync.
