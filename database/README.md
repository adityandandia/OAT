# OneTestDB — Database Setup

This document covers the **database layer** of the project: schema design, setup steps, and how to work with it locally.

## Overview

`OneTestDB` is a SQL Server database supporting login/authentication and role-based routing (Learner / Creator / Admin), along with basic course, test, and enrollment tracking.

## Tech

- **SQL Server** (local instance via SSMS)
- Connection managed through `.env` (`DB_NAME=OneTestDB`)

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Creates the database schema — all tables, primary keys, foreign keys |
| `seed.sql` | Inserts dummy data for local testing (employees, courses, tests, etc.) |

## Schema

7 tables total:

**Core entities**
- `Employee` — Employee ID, Name, Department, Role, Username, PasswordHash. Unifies "User" and "Course Creator" — same shape, `Role` field determines which page a user lands on after login.
- `Batch` — cohort grouping (Batch ID, Batch Name)
- `Course` — Course ID, Course Name, CreatedBy (FK → Employee), EnrolledCount, AttemptedCount
- `Test` — Test ID, Test Name, CourseID (FK → Course)

**Junction tables** (many-to-many relationships)
- `Enrollment` — links Employee ↔ Course (which employees are enrolled in which courses)
- `TestAttempt` — links Employee ↔ Test, plus `Score`
- `BatchCourse` — links Batch ↔ Course (a course can be shared across multiple batches)

### Relationships

- One Employee (Creator) → many Courses (`1:N`)
- One Course → many Tests (`1:N`)
- Employee ↔ Course → many-to-many via `Enrollment` (`M:N`)
- Employee ↔ Test → many-to-many via `TestAttempt` (`M:N`)
- Batch ↔ Course → many-to-many via `BatchCourse` (`M:N`)

## Local Setup

1. Open SSMS, connect to `localhost` (Windows Authentication or `sa` login).
2. Run in a New Query window:
   ```sql
   CREATE DATABASE OneTestDB;
   ```
3. Open `schema.sql`, confirm the toolbar dropdown shows `OneTestDB`, and execute (F5).
4. Open `seed.sql` the same way and execute (F5) to load dummy data.
5. Verify:
   ```sql
   SELECT * FROM Employee;
   ```
   should return 4 rows.
6. In your project `.env`, set:
   ```
   DB_NAME=OneTestDB
   ```

## Notes for Backend

- Login check: query `Employee` by `Username`, verify `PasswordHash`, return `Role` to the frontend for routing.
- **Passwords in `seed.sql` are plain placeholder text** (v0.1 only) — replace with real hashing before anything resembling production use.
- `EnrolledCount` / `AttemptedCount` on `Course` are currently synced manually in `seed.sql`; in a real implementation these should be computed live via query, not stored/duplicated.

## Status

- [x] Schema designed and reviewed
- [x] Tables created in `OneTestDB`
- [x] Seed data loaded and verified
- [ ] Backend API wired to this schema
- [ ] Frontend login/routing built against API