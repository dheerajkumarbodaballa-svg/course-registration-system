-- ============================================================================
-- Script: 05_insert_sample_data.sql
-- Description: Inserts realistic academic sample data into all 6 tables
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Inserting Departments...
PROMPT ========================================

INSERT INTO Department (Department_ID, Department_Name, Description)
VALUES (1, 'Computer Science and Engineering', 'Focuses on algorithms, software architecture, databases, and AI systems');

INSERT INTO Department (Department_ID, Department_Name, Description)
VALUES (2, 'Information Technology', 'Focuses on web application engineering, networks, and cloud computing');

INSERT INTO Department (Department_ID, Department_Name, Description)
VALUES (3, 'Electronics and Communication Engineering', 'Focuses on embedded systems, microprocessors, and digital signal processing');

INSERT INTO Department (Department_ID, Department_Name, Description)
VALUES (4, 'Mechanical Engineering', 'Focuses on thermodynamics, mechanics, robotics, and manufacturing');

INSERT INTO Department (Department_ID, Department_Name, Description)
VALUES (5, 'Electrical and Electronics Engineering', 'Focuses on electrical power systems, machines, and control circuits');

PROMPT ========================================
PROMPT Inserting Instructors...
PROMPT ========================================

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (1, 'Dr. Rajesh Sharma', 'rajesh.sharma@aditya.ac.in', '+91 98480 12341', 1);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (2, 'Dr. Priya Nair', 'priya.nair@aditya.ac.in', '+91 98480 12342', 1);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (3, 'Prof. Arun Kumar', 'arun.kumar@aditya.ac.in', '+91 98480 12343', 2);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (4, 'Dr. Sunita Reddy', 'sunita.reddy@aditya.ac.in', '+91 98480 12344', 2);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (5, 'Prof. Vikram Verma', 'vikram.verma@aditya.ac.in', '+91 98480 12345', 3);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (6, 'Dr. Ananya Iyer', 'ananya.iyer@aditya.ac.in', '+91 98480 12346', 3);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (7, 'Prof. Suresh Patil', 'suresh.patil@aditya.ac.in', '+91 98480 12347', 4);

INSERT INTO Instructor (Instructor_ID, Instructor_Name, Email, Phone, Department_ID)
VALUES (8, 'Dr. Ramesh Rao', 'ramesh.rao@aditya.ac.in', '+91 98480 12348', 5);

PROMPT ========================================
PROMPT Inserting Courses...
PROMPT ========================================

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (1, 'Database Management Systems', 4, 1);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (2, 'Data Structures and Algorithms', 4, 1);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (3, 'Operating Systems', 3, 1);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (4, 'Computer Networks', 3, 2);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (5, 'Web Technologies', 3, 2);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (6, 'Software Engineering', 3, 2);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (7, 'Digital Signal Processing', 4, 3);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (8, 'Microprocessors and Microcontrollers', 3, 3);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (9, 'Engineering Thermodynamics', 4, 4);

INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (10, 'Power Systems Analysis', 4, 5);

-- Course with NO sections or registrations (to demonstrate unassigned courses)
INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
VALUES (11, 'Artificial Intelligence and Machine Learning', 4, 1);

PROMPT ========================================
PROMPT Inserting Students...
PROMPT ========================================

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (1, 'Rahul Verma', 'rahul.verma@student.ac.in', '+91 97011 22331', DATE '2004-05-14', 1);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (2, 'Sneha Patel', 'sneha.patel@student.ac.in', '+91 97011 22332', DATE '2004-08-22', 1);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (3, 'Amit Sharma', 'amit.sharma@student.ac.in', '+91 97011 22333', DATE '2003-11-10', 1);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (4, 'Pooja Rao', 'pooja.rao@student.ac.in', '+91 97011 22334', DATE '2004-02-18', 1);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (5, 'Rohan Nair', 'rohan.nair@student.ac.in', '+91 97011 22335', DATE '2003-09-05', 2);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (6, 'Neha Gupta', 'neha.gupta@student.ac.in', '+91 97011 22336', DATE '2004-06-30', 2);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (7, 'Karthik Reddy', 'karthik.reddy@student.ac.in', '+91 97011 22337', DATE '2003-12-12', 2);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (8, 'Priya Joshi', 'priya.joshi@student.ac.in', '+91 97011 22338', DATE '2004-04-25', 3);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (9, 'Vikram Singh', 'vikram.singh@student.ac.in', '+91 97011 22339', DATE '2004-01-15', 3);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (10, 'Divya Kumar', 'divya.kumar@student.ac.in', '+91 97011 22340', DATE '2003-07-19', 3);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (11, 'Manoj Pillai', 'manoj.pillai@student.ac.in', '+91 97011 22341', DATE '2004-03-08', 4);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (12, 'Anjali Mishra', 'anjali.mishra@student.ac.in', '+91 97011 22342', DATE '2004-10-02', 4);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (13, 'Sai Teja', 'sai.teja@student.ac.in', '+91 97011 22343', DATE '2003-05-20', 5);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (14, 'Swathi Krishna', 'swathi.krishna@student.ac.in', '+91 97011 22344', DATE '2004-09-17', 1);

INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
VALUES (15, 'Sanjay Choudhury', 'sanjay.c@student.ac.in', '+91 97011 22345', DATE '2004-12-01', 2);

PROMPT ========================================
PROMPT Inserting Course Sections...
PROMPT ========================================

-- Section 1: Capacity 3 (Intentionally set to 3 to easily demonstrate full section / capacity rejection)
INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (1, 1, 1, 'Fall', '2025-2026', 'LH-101', 3);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (2, 1, 2, 'Spring', '2025-2026', 'LH-102', 30);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (3, 2, 1, 'Fall', '2025-2026', 'Lab-201', 25);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (4, 3, 2, 'Spring', '2025-2026', 'LH-103', 30);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (5, 4, 3, 'Fall', '2025-2026', 'Lab-301', 35);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (6, 5, 4, 'Spring', '2025-2026', 'Lab-302', 30);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (7, 6, 3, 'Fall', '2025-2026', 'LH-204', 40);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (8, 7, 5, 'Fall', '2025-2026', 'Lab-401', 25);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (9, 8, 6, 'Spring', '2025-2026', 'Lab-402', 20);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (10, 9, 7, 'Fall', '2025-2026', 'Mech-LH1', 40);

INSERT INTO Course_Section (Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
VALUES (11, 10, 8, 'Spring', '2025-2026', 'EEE-LH2', 30);

PROMPT ========================================
PROMPT Inserting Registrations...
PROMPT ========================================

-- Section 1 has capacity 3. These 3 registrations make it completely FULL!
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (1, 1, 1, DATE '2025-08-01', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (2, 2, 1, DATE '2025-08-01', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (3, 3, 1, DATE '2025-08-02', 'REGISTERED', NULL);

-- Section 2
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (4, 4, 2, DATE '2025-08-03', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (5, 14, 2, DATE '2025-08-04', 'REGISTERED', NULL);

-- Section 3 (Rahul Verma & Sneha Patel taking multiple courses)
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (6, 1, 3, DATE '2025-08-02', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (7, 2, 3, DATE '2025-08-02', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (8, 4, 3, DATE '2025-08-03', 'REGISTERED', NULL);

-- Section 4 (Completed courses with grades)
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (9, 3, 4, DATE '2025-01-10', 'COMPLETED', 'A');

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (10, 1, 4, DATE '2025-01-10', 'COMPLETED', 'A+');

-- Section 5
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (11, 5, 5, DATE '2025-08-05', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (12, 6, 5, DATE '2025-08-05', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (13, 7, 5, DATE '2025-08-06', 'REGISTERED', NULL);

-- Dropped registration example
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (14, 15, 5, DATE '2025-08-06', 'DROPPED', NULL);

-- Section 6
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (15, 5, 6, DATE '2025-08-07', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (16, 6, 6, DATE '2025-08-07', 'REGISTERED', NULL);

-- Section 7
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (17, 7, 7, DATE '2025-08-08', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (18, 15, 7, DATE '2025-08-08', 'REGISTERED', NULL);

-- Section 8
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (19, 8, 8, DATE '2025-08-09', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (20, 9, 8, DATE '2025-08-09', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (21, 10, 8, DATE '2025-08-10', 'REGISTERED', NULL);

-- Section 9 (Completed with grades)
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (22, 8, 9, DATE '2025-01-15', 'COMPLETED', 'B+');

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (23, 9, 9, DATE '2025-01-15', 'COMPLETED', 'A');

-- Section 10
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (24, 11, 10, DATE '2025-08-11', 'REGISTERED', NULL);

INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (25, 12, 10, DATE '2025-08-11', 'REGISTERED', NULL);

-- Section 11
INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status, Grade)
VALUES (26, 13, 11, DATE '2025-08-12', 'REGISTERED', NULL);

COMMIT;

PROMPT ========================================
PROMPT Synchronizing Sequences with Inserted IDs...
PROMPT ========================================

ALTER SEQUENCE dept_seq RESTART START WITH 6;
ALTER SEQUENCE instructor_seq RESTART START WITH 9;
ALTER SEQUENCE course_seq RESTART START WITH 12;
ALTER SEQUENCE student_seq RESTART START WITH 16;
ALTER SEQUENCE section_seq RESTART START WITH 12;
ALTER SEQUENCE reg_seq RESTART START WITH 27;

PROMPT Sample data inserted and sequences synchronized successfully.
