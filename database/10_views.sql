-- ============================================================================
-- Script: 10_views.sql
-- Description: Creates relational database views for academic reporting,
--              data abstraction, and fast query access.
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Creating Relational Views...
PROMPT ========================================

-- ----------------------------------------------------------------------------
-- View 1: Student Details with Department Name
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_student_details AS
SELECT s.Student_ID,
       s.Student_Name,
       s.Email,
       s.Phone,
       TO_CHAR(s.Date_of_Birth, 'YYYY-MM-DD') AS Date_of_Birth,
       s.Department_ID,
       d.Department_Name
FROM Student s
JOIN Department d
ON s.Department_ID = d.Department_ID;

-- ----------------------------------------------------------------------------
-- View 2: Course Catalog with Department Attribution
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_course_catalog AS
SELECT c.Course_ID,
       c.Course_Name,
       c.Credits,
       c.Department_ID,
       d.Department_Name
FROM Course c
JOIN Department d
ON c.Department_ID = d.Department_ID;

-- ----------------------------------------------------------------------------
-- View 3: Section Schedule with Occupancy & Real-Time Available Seats
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_section_schedule AS
SELECT cs.Section_ID,
       cs.Course_ID,
       c.Course_Name,
       cs.Instructor_ID,
       i.Instructor_Name,
       cs.Semester,
       cs.Academic_Year,
       cs.Room,
       cs.Capacity,
       COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS Active_Registrations,
       cs.Capacity - COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS Available_Seats,
       CASE
           WHEN COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) >= cs.Capacity THEN 'FULL'
           ELSE 'AVAILABLE'
       END AS Section_Status
FROM Course_Section cs
JOIN Course c ON cs.Course_ID = c.Course_ID
JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
LEFT JOIN Registration r ON cs.Section_ID = r.Section_ID
GROUP BY cs.Section_ID, cs.Course_ID, c.Course_Name, cs.Instructor_ID, i.Instructor_Name,
         cs.Semester, cs.Academic_Year, cs.Room, cs.Capacity;

-- ----------------------------------------------------------------------------
-- View 4: Complete Registration Summary
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_registration_summary AS
SELECT r.Registration_ID,
       r.Student_ID,
       s.Student_Name,
       s.Email AS Student_Email,
       r.Section_ID,
       c.Course_Name,
       i.Instructor_Name,
       cs.Semester,
       cs.Academic_Year,
       cs.Room,
       TO_CHAR(r.Registration_Date, 'YYYY-MM-DD') AS Registration_Date,
       r.Status,
       NVL(r.Grade, 'N/A') AS Grade
FROM Registration r
JOIN Student s ON r.Student_ID = s.Student_ID
JOIN Course_Section cs ON r.Section_ID = cs.Section_ID
JOIN Course c ON cs.Course_ID = c.Course_ID
JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID;

-- ----------------------------------------------------------------------------
-- View 5: Department Statistics Summary
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_department_stats AS
SELECT d.Department_ID,
       d.Department_Name,
       (SELECT COUNT(*) FROM Student s WHERE s.Department_ID = d.Department_ID) AS Total_Students,
       (SELECT COUNT(*) FROM Instructor i WHERE i.Department_ID = d.Department_ID) AS Total_Instructors,
       (SELECT COUNT(*) FROM Course c WHERE c.Department_ID = d.Department_ID) AS Total_Courses
FROM Department d;

PROMPT Views created successfully.

PROMPT ========================================
PROMPT Testing Created Views...
PROMPT ========================================
SELECT * FROM vw_department_stats;
