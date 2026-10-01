-- ============================================================================
-- Script: init.sql
-- Description: PostgreSQL schema + sample data for Course Registration System
--              Replaces Oracle sequences/triggers with SERIAL (auto-increment)
--              Run this once on your Render PostgreSQL database.
-- ============================================================================

-- Drop existing tables (safe cascade)
DROP TABLE IF EXISTS Registration CASCADE;
DROP TABLE IF EXISTS Course_Section CASCADE;
DROP TABLE IF EXISTS Course CASCADE;
DROP TABLE IF EXISTS Instructor CASCADE;
DROP TABLE IF EXISTS Student CASCADE;
DROP TABLE IF EXISTS Department CASCADE;

-- ============================================================================
-- TABLE DEFINITIONS (SERIAL = auto-increment primary key)
-- ============================================================================

CREATE TABLE Department (
    Department_ID   SERIAL PRIMARY KEY,
    Department_Name VARCHAR(100) NOT NULL UNIQUE,
    Description     VARCHAR(255)
);

CREATE TABLE Student (
    Student_ID      SERIAL PRIMARY KEY,
    Student_Name    VARCHAR(100) NOT NULL,
    Email           VARCHAR(100) NOT NULL UNIQUE,
    Phone           VARCHAR(20),
    Date_of_Birth   DATE NOT NULL,
    Department_ID   INTEGER NOT NULL REFERENCES Department(Department_ID)
);

CREATE TABLE Instructor (
    Instructor_ID   SERIAL PRIMARY KEY,
    Instructor_Name VARCHAR(100) NOT NULL,
    Email           VARCHAR(100) NOT NULL UNIQUE,
    Phone           VARCHAR(20),
    Department_ID   INTEGER NOT NULL REFERENCES Department(Department_ID)
);

CREATE TABLE Course (
    Course_ID       SERIAL PRIMARY KEY,
    Course_Name     VARCHAR(100) NOT NULL UNIQUE,
    Credits         INTEGER NOT NULL CHECK (Credits > 0),
    Department_ID   INTEGER NOT NULL REFERENCES Department(Department_ID)
);

CREATE TABLE Course_Section (
    Section_ID      SERIAL PRIMARY KEY,
    Course_ID       INTEGER NOT NULL REFERENCES Course(Course_ID),
    Instructor_ID   INTEGER NOT NULL REFERENCES Instructor(Instructor_ID),
    Semester        VARCHAR(20) NOT NULL,
    Academic_Year   VARCHAR(20) NOT NULL,
    Room            VARCHAR(50) NOT NULL,
    Capacity        INTEGER NOT NULL CHECK (Capacity > 0)
);

CREATE TABLE Registration (
    Registration_ID   SERIAL PRIMARY KEY,
    Student_ID        INTEGER NOT NULL REFERENCES Student(Student_ID),
    Section_ID        INTEGER NOT NULL REFERENCES Course_Section(Section_ID),
    Registration_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    Status            VARCHAR(20) NOT NULL DEFAULT 'REGISTERED'
                        CHECK (Status IN ('REGISTERED', 'DROPPED', 'COMPLETED')),
    Grade             VARCHAR(5) CHECK (Grade IN ('A+','A','B+','B','C+','C','D','F') OR Grade IS NULL),
    CONSTRAINT uq_student_section UNIQUE (Student_ID, Section_ID)
);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

INSERT INTO Department (Department_Name, Description) VALUES
('Computer Science and Engineering', 'Focuses on algorithms, software architecture, databases, and AI systems'),
('Information Technology', 'Focuses on web application engineering, networks, and cloud computing'),
('Electronics and Communication Engineering', 'Focuses on embedded systems, microprocessors, and digital signal processing'),
('Mechanical Engineering', 'Focuses on thermodynamics, mechanics, robotics, and manufacturing'),
('Electrical and Electronics Engineering', 'Focuses on electrical power systems, machines, and control circuits');

INSERT INTO Instructor (Instructor_Name, Email, Phone, Department_ID) VALUES
('Dr. Rajesh Sharma', 'rajesh.sharma@aditya.ac.in', '+91 98480 12341', 1),
('Dr. Priya Nair', 'priya.nair@aditya.ac.in', '+91 98480 12342', 1),
('Prof. Arun Kumar', 'arun.kumar@aditya.ac.in', '+91 98480 12343', 2),
('Dr. Sunita Reddy', 'sunita.reddy@aditya.ac.in', '+91 98480 12344', 2),
('Prof. Vikram Verma', 'vikram.verma@aditya.ac.in', '+91 98480 12345', 3),
('Dr. Ananya Iyer', 'ananya.iyer@aditya.ac.in', '+91 98480 12346', 3),
('Prof. Suresh Patil', 'suresh.patil@aditya.ac.in', '+91 98480 12347', 4),
('Dr. Ramesh Rao', 'ramesh.rao@aditya.ac.in', '+91 98480 12348', 5);

INSERT INTO Course (Course_Name, Credits, Department_ID) VALUES
('Database Management Systems', 4, 1),
('Data Structures and Algorithms', 4, 1),
('Operating Systems', 3, 1),
('Computer Networks', 3, 2),
('Web Technologies', 3, 2),
('Software Engineering', 3, 2),
('Digital Signal Processing', 4, 3),
('Microprocessors and Microcontrollers', 3, 3),
('Engineering Thermodynamics', 4, 4),
('Power Systems Analysis', 4, 5),
('Artificial Intelligence and Machine Learning', 4, 1);

INSERT INTO Student (Student_Name, Email, Phone, Date_of_Birth, Department_ID) VALUES
('Rahul Verma', 'rahul.verma@student.ac.in', '+91 97011 22331', '2004-05-14', 1),
('Sneha Patel', 'sneha.patel@student.ac.in', '+91 97011 22332', '2004-08-22', 1),
('Amit Sharma', 'amit.sharma@student.ac.in', '+91 97011 22333', '2003-11-10', 1),
('Pooja Rao', 'pooja.rao@student.ac.in', '+91 97011 22334', '2004-02-18', 1),
('Rohan Nair', 'rohan.nair@student.ac.in', '+91 97011 22335', '2003-09-05', 2),
('Neha Gupta', 'neha.gupta@student.ac.in', '+91 97011 22336', '2004-06-30', 2),
('Karthik Reddy', 'karthik.reddy@student.ac.in', '+91 97011 22337', '2003-12-12', 2),
('Priya Joshi', 'priya.joshi@student.ac.in', '+91 97011 22338', '2004-04-25', 3),
('Vikram Singh', 'vikram.singh@student.ac.in', '+91 97011 22339', '2004-01-15', 3),
('Divya Kumar', 'divya.kumar@student.ac.in', '+91 97011 22340', '2003-07-19', 3),
('Manoj Pillai', 'manoj.pillai@student.ac.in', '+91 97011 22341', '2004-03-08', 4),
('Anjali Mishra', 'anjali.mishra@student.ac.in', '+91 97011 22342', '2004-10-02', 4),
('Sai Teja', 'sai.teja@student.ac.in', '+91 97011 22343', '2003-05-20', 5),
('Swathi Krishna', 'swathi.krishna@student.ac.in', '+91 97011 22344', '2004-09-17', 1),
('Sanjay Choudhury', 'sanjay.c@student.ac.in', '+91 97011 22345', '2004-12-01', 2);

INSERT INTO Course_Section (Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity) VALUES
(1, 1, 'Fall', '2025-2026', 'LH-101', 3),
(1, 2, 'Spring', '2025-2026', 'LH-102', 30),
(2, 1, 'Fall', '2025-2026', 'Lab-201', 25),
(3, 2, 'Spring', '2025-2026', 'LH-103', 30),
(4, 3, 'Fall', '2025-2026', 'Lab-301', 35),
(5, 4, 'Spring', '2025-2026', 'Lab-302', 30),
(6, 3, 'Fall', '2025-2026', 'LH-204', 40),
(7, 5, 'Fall', '2025-2026', 'Lab-401', 25),
(8, 6, 'Spring', '2025-2026', 'Lab-402', 20),
(9, 7, 'Fall', '2025-2026', 'Mech-LH1', 40),
(10, 8, 'Spring', '2025-2026', 'EEE-LH2', 30);

INSERT INTO Registration (Student_ID, Section_ID, Registration_Date, Status, Grade) VALUES
(1, 1, '2025-08-01', 'REGISTERED', NULL),
(2, 1, '2025-08-01', 'REGISTERED', NULL),
(3, 1, '2025-08-02', 'REGISTERED', NULL),
(4, 2, '2025-08-03', 'REGISTERED', NULL),
(14, 2, '2025-08-04', 'REGISTERED', NULL),
(1, 3, '2025-08-02', 'REGISTERED', NULL),
(2, 3, '2025-08-02', 'REGISTERED', NULL),
(4, 3, '2025-08-03', 'REGISTERED', NULL),
(3, 4, '2025-01-10', 'COMPLETED', 'A'),
(1, 4, '2025-01-10', 'COMPLETED', 'A+'),
(5, 5, '2025-08-05', 'REGISTERED', NULL),
(6, 5, '2025-08-05', 'REGISTERED', NULL),
(7, 5, '2025-08-06', 'REGISTERED', NULL),
(15, 5, '2025-08-06', 'DROPPED', NULL),
(5, 6, '2025-08-07', 'REGISTERED', NULL),
(6, 6, '2025-08-07', 'REGISTERED', NULL),
(7, 7, '2025-08-08', 'REGISTERED', NULL),
(15, 7, '2025-08-08', 'REGISTERED', NULL),
(8, 8, '2025-08-09', 'REGISTERED', NULL),
(9, 8, '2025-08-09', 'REGISTERED', NULL),
(10, 8, '2025-08-10', 'REGISTERED', NULL),
(8, 9, '2025-01-15', 'COMPLETED', 'B+'),
(9, 9, '2025-01-15', 'COMPLETED', 'A'),
(11, 10, '2025-08-11', 'REGISTERED', NULL),
(12, 10, '2025-08-11', 'REGISTERED', NULL),
(13, 11, '2025-08-12', 'REGISTERED', NULL);
