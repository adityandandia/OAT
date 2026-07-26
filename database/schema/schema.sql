-- =========================================================
-- schema.sql
-- Run this AFTER: CREATE DATABASE OneTestDB;  and  USE OneTestDB;
-- =========================================================

USE OneTestDB;
GO

-- ---------------------------------------------------------
-- 1. Employee
--    Unifies "User" and "Course Creator" — same shape,
--    Role decides what page they land on after login.
-- ---------------------------------------------------------
CREATE TABLE Employee (
    EmployeeID   INT IDENTITY(1,1) PRIMARY KEY,
    Name         VARCHAR(100)  NOT NULL,
    Department   VARCHAR(100)  NOT NULL,
    Role         VARCHAR(50)   NOT NULL,   -- e.g. 'Learner', 'Creator', 'Admin'
    Username     VARCHAR(50)   NOT NULL UNIQUE,
    PasswordHash VARCHAR(255)  NOT NULL,   -- never store plain text passwords
    CreatedAt    DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- ---------------------------------------------------------
-- 2. Batch (Cohort)
-- ---------------------------------------------------------
CREATE TABLE Batch (
    BatchID     INT IDENTITY(1,1) PRIMARY KEY,
    BatchName   VARCHAR(100) NOT NULL,
    CreatedAt   DATETIME     NOT NULL DEFAULT GETDATE()
);
GO

-- ---------------------------------------------------------
-- 3. Course
--    Created by one Employee (the "Creator" role, 1:N)
-- ---------------------------------------------------------
CREATE TABLE Course (
    CourseID      INT IDENTITY(1,1) PRIMARY KEY,
    CourseName    VARCHAR(150) NOT NULL,
    CreatedBy     INT          NOT NULL,
    EnrolledCount INT          NOT NULL DEFAULT 0,
    AttemptedCount INT         NOT NULL DEFAULT 0,
    CreatedAt     DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Course_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Employee(EmployeeID)
);
GO

-- ---------------------------------------------------------
-- 4. Test
--    Belongs to exactly one Course (1:N)
-- ---------------------------------------------------------
CREATE TABLE Test (
    TestID     INT IDENTITY(1,1) PRIMARY KEY,
    TestName   VARCHAR(150) NOT NULL,
    CourseID   INT          NOT NULL,
    CreatedAt  DATETIME     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Test_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID)
);
GO

-- ---------------------------------------------------------
-- 5. Enrollment (junction table: Employee <-> Course, M:N)
-- ---------------------------------------------------------
CREATE TABLE Enrollment (
    EnrollmentID  INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID    INT      NOT NULL,
    CourseID      INT      NOT NULL,
    EnrolledDate  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Enrollment_Employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee(EmployeeID),
    CONSTRAINT FK_Enrollment_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID),
    CONSTRAINT UQ_Enrollment UNIQUE (EmployeeID, CourseID)  -- no duplicate enrollments
);
GO

-- ---------------------------------------------------------
-- 6. TestAttempt (junction table: Employee <-> Test, M:N)
--    Holds the score for this v0.1 (no per-question detail yet)
-- ---------------------------------------------------------
CREATE TABLE TestAttempt (
    AttemptID   INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID  INT      NOT NULL,
    TestID      INT      NOT NULL,
    Score       DECIMAL(5,2) NULL,
    AttemptedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TestAttempt_Employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee(EmployeeID),
    CONSTRAINT FK_TestAttempt_Test FOREIGN KEY (TestID)
        REFERENCES Test(TestID)
);
GO

-- ---------------------------------------------------------
-- 7. BatchCourse (junction table: Batch <-> Course, M:N)
-- ---------------------------------------------------------
CREATE TABLE BatchCourse (
    BatchCourseID INT IDENTITY(1,1) PRIMARY KEY,
    BatchID       INT NOT NULL,
    CourseID      INT NOT NULL,
    CONSTRAINT FK_BatchCourse_Batch FOREIGN KEY (BatchID)
        REFERENCES Batch(BatchID),
    CONSTRAINT FK_BatchCourse_Course FOREIGN KEY (CourseID)
        REFERENCES Course(CourseID),
    CONSTRAINT UQ_BatchCourse UNIQUE (BatchID, CourseID)  -- no duplicate links
);
GO