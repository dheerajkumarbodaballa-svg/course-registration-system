-- ============================================================================
-- Script: 08_aggregate_queries.sql
-- Description: Demonstrates SQL aggregate functions (COUNT, SUM, AVG, MIN, MAX),
--              GROUP BY, and HAVING clause filtering.
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET LINESIZE 160;
SET PAGESIZE 50;

PROMPT ============================================================================
PROMPT 1. AGGREGATE SUMMARY ON COURSES AND SECTIONS (AVG, MIN, MAX)
PROMPT ============================================================================
SELECT ROUND(AVG(Credits), 2) AS Average_Credits,
       MIN(Credits) AS Min_Credits,
       MAX(Credits) AS Max_Credits,
       COUNT(*) AS Total_Courses
FROM Course;

SELECT ROUND(AVG(Capacity), 1) AS Average_Capacity,
       MIN(Capacity) AS Minimum_Capacity,
       MAX(Capacity) AS Maximum_Capacity,
       SUM(Capacity) AS Total_Seat_Capacity
FROM Course_Section;

PROMPT ============================================================================
PROMPT 2. NUMBER OF REGISTRATIONS PER SECTION (GROUP BY with LEFT JOIN)
PROMPT ============================================================================
SELECT cs.Section_ID,
       c.Course_Name,
       cs.Capacity,
       COUNT(r.Registration_ID) AS Total_Registrations,
       cs.Capacity - COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS Available_Seats
FROM Course_Section cs
JOIN Course c
ON cs.Course_ID = c.Course_ID
LEFT JOIN Registration r
ON cs.Section_ID = r.Section_ID
GROUP BY cs.Section_ID, c.Course_Name, cs.Capacity
ORDER BY cs.Section_ID;

PROMPT ============================================================================
PROMPT 3. SECTIONS WITH MORE THAN 2 REGISTRATIONS (HAVING CLAUSE)
PROMPT ============================================================================
SELECT cs.Section_ID,
       c.Course_Name,
       COUNT(r.Registration_ID) AS Registration_Count
FROM Course_Section cs
JOIN Course c
ON cs.Course_ID = c.Course_ID
LEFT JOIN Registration r
ON cs.Section_ID = r.Section_ID
GROUP BY cs.Section_ID, c.Course_Name
HAVING COUNT(r.Registration_ID) > 2
ORDER BY Registration_Count DESC;

PROMPT ============================================================================
PROMPT 4. STUDENTS REGISTERED FOR MORE THAN ONE COURSE (HAVING CLAUSE)
PROMPT ============================================================================
SELECT s.Student_ID,
       s.Student_Name,
       COUNT(r.Registration_ID) AS Enrolled_Courses_Count
FROM Student s
JOIN Registration r
ON s.Student_ID = r.Student_ID
GROUP BY s.Student_ID, s.Student_Name
HAVING COUNT(r.Registration_ID) > 1
ORDER BY Enrolled_Courses_Count DESC;

PROMPT ============================================================================
PROMPT 5. COURSES WITH NO REGISTRATIONS (HAVING COUNT = 0)
PROMPT ============================================================================
SELECT c.Course_ID,
       c.Course_Name,
       d.Department_Name
FROM Course c
JOIN Department d
ON c.Department_ID = d.Department_ID
LEFT JOIN Course_Section cs
ON c.Course_ID = cs.Course_ID
LEFT JOIN Registration r
ON cs.Section_ID = r.Section_ID
GROUP BY c.Course_ID, c.Course_Name, d.Department_Name
HAVING COUNT(r.Registration_ID) = 0
ORDER BY c.Course_ID;

PROMPT ============================================================================
PROMPT 6. INSTRUCTORS TEACHING MULTIPLE SECTIONS (HAVING CLAUSE)
PROMPT ============================================================================
SELECT i.Instructor_ID,
       i.Instructor_Name,
       d.Department_Name,
       COUNT(cs.Section_ID) AS Sections_Taught
FROM Instructor i
JOIN Department d
ON i.Department_ID = d.Department_ID
JOIN Course_Section cs
ON i.Instructor_ID = cs.Instructor_ID
GROUP BY i.Instructor_ID, i.Instructor_Name, d.Department_Name
HAVING COUNT(cs.Section_ID) > 1
ORDER BY Sections_Taught DESC;

PROMPT ============================================================================
PROMPT 7. REGISTRATION DISTRIBUTION BY STATUS (GROUP BY)
PROMPT ============================================================================
SELECT Status,
       COUNT(*) AS Status_Count
FROM Registration
GROUP BY Status
ORDER BY Status_Count DESC;

PROMPT ============================================================================
PROMPT 8. STUDENT AND INSTRUCTOR COUNTS BY DEPARTMENT
PROMPT ============================================================================
SELECT d.Department_Name,
       (SELECT COUNT(*) FROM Student s WHERE s.Department_ID = d.Department_ID) AS Total_Students,
       (SELECT COUNT(*) FROM Instructor i WHERE i.Department_ID = d.Department_ID) AS Total_Instructors,
       (SELECT COUNT(*) FROM Course c WHERE c.Department_ID = d.Department_ID) AS Total_Courses
FROM Department d
ORDER BY d.Department_ID;
