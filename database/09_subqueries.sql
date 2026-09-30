-- ============================================================================
-- Script: 09_subqueries.sql
-- Description: Demonstrates Subqueries (IN, NOT IN, EXISTS, NOT EXISTS,
--              Scalar Subqueries, and Correlated Subqueries).
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET LINESIZE 160;
SET PAGESIZE 50;

PROMPT ============================================================================
PROMPT 1. SCALAR SUBQUERY: COURSES WITH CREDITS GREATER THAN AVERAGE CREDITS
PROMPT ============================================================================
SELECT Course_ID,
       Course_Name,
       Credits
FROM Course
WHERE Credits > (SELECT AVG(Credits) FROM Course)
ORDER BY Course_ID;

PROMPT ============================================================================
PROMPT 2. SUBQUERY WITH 'IN': STUDENTS REGISTERED IN AT LEAST ONE COURSE
PROMPT ============================================================================
SELECT Student_ID,
       Student_Name,
       Email
FROM Student
WHERE Student_ID IN (
    SELECT DISTINCT Student_ID
    FROM Registration
)
ORDER BY Student_ID;

PROMPT ============================================================================
PROMPT 3. SUBQUERY WITH 'NOT IN': STUDENTS NOT REGISTERED IN ANY COURSE
PROMPT ============================================================================
SELECT Student_ID,
       Student_Name,
       Email
FROM Student
WHERE Student_ID NOT IN (
    SELECT DISTINCT Student_ID
    FROM Registration
)
ORDER BY Student_ID;

PROMPT ============================================================================
PROMPT 4. SUBQUERY WITH 'EXISTS': INSTRUCTORS ASSIGNED TO AT LEAST ONE SECTION
PROMPT ============================================================================
SELECT i.Instructor_ID,
       i.Instructor_Name,
       i.Email
FROM Instructor i
WHERE EXISTS (
    SELECT 1
    FROM Course_Section cs
    WHERE cs.Instructor_ID = i.Instructor_ID
)
ORDER BY i.Instructor_ID;

PROMPT ============================================================================
PROMPT 5. SUBQUERY WITH 'NOT EXISTS': COURSES WITHOUT ANY ACTIVE SECTIONS
PROMPT ============================================================================
SELECT c.Course_ID,
       c.Course_Name
FROM Course c
WHERE NOT EXISTS (
    SELECT 1
    FROM Course_Section cs
    WHERE cs.Course_ID = c.Course_ID
)
ORDER BY c.Course_ID;

PROMPT ============================================================================
PROMPT 6. CORRELATED SUBQUERY: SECTIONS AT MAXIMUM CAPACITY
PROMPT ============================================================================
SELECT cs.Section_ID,
       cs.Capacity,
       (SELECT COUNT(*) FROM Registration r WHERE r.Section_ID = cs.Section_ID AND r.Status = 'REGISTERED') AS Active_Enrolled
FROM Course_Section cs
WHERE cs.Capacity <= (
    SELECT COUNT(*)
    FROM Registration r
    WHERE r.Section_ID = cs.Section_ID
      AND r.Status = 'REGISTERED'
)
ORDER BY cs.Section_ID;

PROMPT ============================================================================
PROMPT 7. DERIVED TABLE (INLINE VIEW): DEPARTMENTS RANKED BY TOTAL STUDENTS
PROMPT ============================================================================
SELECT dept_counts.Department_Name,
       dept_counts.Student_Count
FROM (
    SELECT d.Department_Name,
           COUNT(s.Student_ID) AS Student_Count
    FROM Department d
    LEFT JOIN Student s
    ON d.Department_ID = s.Department_ID
    GROUP BY d.Department_Name
) dept_counts
ORDER BY dept_counts.Student_Count DESC;
