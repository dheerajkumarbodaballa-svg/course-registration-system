-- ============================================================================
-- Script: 07_join_queries.sql
-- Description: Demonstrates relational JOIN operations (INNER JOIN, LEFT JOIN,
--              Multi-Table Joins) across the 6 normalized entities.
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET LINESIZE 180;
SET PAGESIZE 60;

PROMPT ============================================================================
PROMPT 1. STUDENTS WITH THEIR DEPARTMENTS (INNER JOIN)
PROMPT ============================================================================
SELECT s.Student_ID,
       s.Student_Name,
       s.Email,
       d.Department_Name
FROM Student s
JOIN Department d
ON s.Department_ID = d.Department_ID
ORDER BY d.Department_Name, s.Student_Name;

PROMPT ============================================================================
PROMPT 2. COURSES WITH THEIR OFFERING DEPARTMENTS (INNER JOIN)
PROMPT ============================================================================
SELECT c.Course_ID,
       c.Course_Name,
       c.Credits,
       d.Department_Name
FROM Course c
JOIN Department d
ON c.Department_ID = d.Department_ID
ORDER BY c.Course_ID;

PROMPT ============================================================================
PROMPT 3. COURSE SECTIONS WITH COURSE AND INSTRUCTOR DETAILS (3-WAY INNER JOIN)
PROMPT ============================================================================
SELECT cs.Section_ID,
       c.Course_Name,
       i.Instructor_Name,
       cs.Semester,
       cs.Academic_Year,
       cs.Room,
       cs.Capacity
FROM Course_Section cs
JOIN Course c
ON cs.Course_ID = c.Course_ID
JOIN Instructor i
ON cs.Instructor_ID = i.Instructor_ID
ORDER BY cs.Section_ID;

PROMPT ============================================================================
PROMPT 4. STUDENTS REGISTERED IN COURSES (4-WAY INNER JOIN: Student + Reg + Sec + Course)
PROMPT ============================================================================
SELECT r.Registration_ID,
       s.Student_Name,
       c.Course_Name,
       cs.Semester,
       cs.Academic_Year,
       r.Status,
       NVL(r.Grade, 'In Progress') AS Grade
FROM Registration r
JOIN Student s
ON r.Student_ID = s.Student_ID
JOIN Course_Section cs
ON r.Section_ID = cs.Section_ID
JOIN Course c
ON cs.Course_ID = c.Course_ID
ORDER BY c.Course_Name, s.Student_Name;

PROMPT ============================================================================
PROMPT 5. ALL COURSES AND ANY CORRESPONDING SECTIONS (LEFT JOIN)
PROMPT Shows all courses, including those that currently have no scheduled sections.
PROMPT ============================================================================
SELECT c.Course_ID,
       c.Course_Name,
       cs.Section_ID,
       cs.Semester,
       cs.Room
FROM Course c
LEFT JOIN Course_Section cs
ON c.Course_ID = cs.Course_ID
ORDER BY c.Course_ID, cs.Section_ID;

PROMPT ============================================================================
PROMPT 6. ALL INSTRUCTORS AND SECTIONS THEY TEACH (LEFT JOIN)
PROMPT Identifies faculty teaching assignments or unassigned instructors.
PROMPT ============================================================================
SELECT i.Instructor_ID,
       i.Instructor_Name,
       d.Department_Name,
       cs.Section_ID,
       cs.Semester
FROM Instructor i
JOIN Department d
ON i.Department_ID = d.Department_ID
LEFT JOIN Course_Section cs
ON i.Instructor_ID = cs.Instructor_ID
ORDER BY i.Instructor_ID;

PROMPT ============================================================================
PROMPT 7. STUDENTS FROM A SPECIFIC DEPARTMENT ('Computer Science and Engineering')
PROMPT ============================================================================
SELECT s.Student_ID,
       s.Student_Name,
       s.Email,
       d.Department_Name
FROM Student s
JOIN Department d
ON s.Department_ID = d.Department_ID
WHERE d.Department_Name = 'Computer Science and Engineering'
ORDER BY s.Student_Name;
