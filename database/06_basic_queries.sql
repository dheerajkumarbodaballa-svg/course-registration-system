-- ============================================================================
-- Script: 06_basic_queries.sql
-- Description: Demonstrates basic SQL operations: SELECT, WHERE, ORDER BY,
--              pattern matching (LIKE), and comparison operators.
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET LINESIZE 160;
SET PAGESIZE 50;

PROMPT ============================================================================
PROMPT 1. VIEW ALL DEPARTMENTS
PROMPT ============================================================================
SELECT Department_ID, Department_Name, Description
FROM Department
ORDER BY Department_ID;

PROMPT ============================================================================
PROMPT 2. VIEW ALL STUDENTS SORTED BY NAME ALPHABETICALLY
PROMPT ============================================================================
SELECT Student_ID, Student_Name, Email, Phone, TO_CHAR(Date_of_Birth, 'YYYY-MM-DD') AS DOB, Department_ID
FROM Student
ORDER BY Student_Name ASC;

PROMPT ============================================================================
PROMPT 3. FILTER INSTRUCTORS FROM DEPARTMENT 1 (CSE)
PROMPT ============================================================================
SELECT Instructor_ID, Instructor_Name, Email, Phone
FROM Instructor
WHERE Department_ID = 1
ORDER BY Instructor_Name;

PROMPT ============================================================================
PROMPT 4. FILTER COURSES WITH CREDITS >= 4
PROMPT ============================================================================
SELECT Course_ID, Course_Name, Credits, Department_ID
FROM Course
WHERE Credits >= 4
ORDER BY Course_Name;

PROMPT ============================================================================
PROMPT 5. FILTER COURSE SECTIONS IN 'Fall' SEMESTER
PROMPT ============================================================================
SELECT Section_ID, Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity
FROM Course_Section
WHERE Semester = 'Fall'
ORDER BY Section_ID;

PROMPT ============================================================================
PROMPT 6. PATTERN MATCHING: FIND STUDENTS WHOSE NAME STARTS WITH 'S' OR 'R'
PROMPT ============================================================================
SELECT Student_ID, Student_Name, Email
FROM Student
WHERE Student_Name LIKE 'S%' OR Student_Name LIKE 'R%'
ORDER BY Student_Name;

PROMPT ============================================================================
PROMPT 7. REGISTRATIONS WITH SPECIFIC STATUS ('COMPLETED')
PROMPT ============================================================================
SELECT Registration_ID, Student_ID, Section_ID, TO_CHAR(Registration_Date, 'YYYY-MM-DD') AS Reg_Date, Status, Grade
FROM Registration
WHERE Status = 'COMPLETED'
ORDER BY Registration_ID;
