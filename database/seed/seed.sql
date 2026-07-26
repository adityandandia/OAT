-- =========================================================
-- seed.sql
-- Run this AFTER schema.sql, against OneTestDB.
-- Passwords are plain placeholder text for now (v0.1) --
-- swap for real hashing once auth logic is built.
-- =========================================================

USE OneTestDB;
GO

-- ---------------------------------------------------------
-- Employees (mix of roles so you can test different
-- post-login routing: Learner vs Creator vs Admin)
-- ---------------------------------------------------------
INSERT INTO Employee (Name, Department, Role, Username, PasswordHash)
VALUES
    ('Aditya Sharma',   'Engineering', 'Learner', 'aditya.sharma', 'password12a'),
    ('Priya Verma',     'Engineering', 'Creator', 'priya.verma',   'password12p'),
    ('Rahul Nair',      'HR',          'Admin',   'rahul.nair',    'password12r'),
    ('Sneha Iyer',      'Sales',       'Learner', 'sneha.iyer',    'password12s');
GO

-- ---------------------------------------------------------
-- Batch
-- ---------------------------------------------------------
INSERT INTO Batch (BatchName)
VALUES
    ('Batch 2026-A'),
    ('Batch 2026-B');
GO

-- ---------------------------------------------------------
-- Course (CreatedBy = Priya Verma, EmployeeID 2, the Creator)
-- ---------------------------------------------------------
INSERT INTO Course (CourseName, CreatedBy, EnrolledCount, AttemptedCount)
VALUES
    ('Intro to SQL', 2, 0, 0),
    ('Workplace Security Basics', 2, 0, 0);
GO

-- ---------------------------------------------------------
-- Test (linked to Course)
-- ---------------------------------------------------------
INSERT INTO Test (TestName, CourseID)
VALUES
    ('Intro to SQL - Final Quiz', 1),
    ('Workplace Security - Quiz', 2);
GO

-- ---------------------------------------------------------
-- Enrollment (junction: Employee <-> Course)
-- ---------------------------------------------------------
INSERT INTO Enrollment (EmployeeID, CourseID)
VALUES
    (1, 1),  -- Aditya enrolled in Intro to SQL
    (4, 1),  -- Sneha enrolled in Intro to SQL
    (4, 2);  -- Sneha enrolled in Workplace Security Basics
GO

-- ---------------------------------------------------------
-- TestAttempt (junction: Employee <-> Test, with Score)
-- ---------------------------------------------------------
INSERT INTO TestAttempt (EmployeeID, TestID, Score)
VALUES
    (1, 1, 85.50),
    (4, 1, 72.00);
GO

-- ---------------------------------------------------------
-- BatchCourse (junction: Batch <-> Course)
-- ---------------------------------------------------------
INSERT INTO BatchCourse (BatchID, CourseID)
VALUES
    (1, 1),
    (1, 2),
    (2, 1);
GO

-- ---------------------------------------------------------
-- Update EnrolledCount / AttemptedCount to match actual data
-- (in a real app this would be computed via query, but for
-- v0.1 dummy data we sync it manually)
-- ---------------------------------------------------------
UPDATE Course SET EnrolledCount = (SELECT COUNT(*) FROM Enrollment WHERE Enrollment.CourseID = Course.CourseID);
GO