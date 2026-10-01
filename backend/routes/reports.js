// ============================================================================
// Route: reports.js
// Description: Academic DBMS Analytical Reports endpoints
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Students and their departments
router.get('/students-departments', async (req, res) => {
    try {
        const sql = `
            SELECT s.Student_ID, s.Student_Name, s.Email, s.Phone, d.Department_Name
            FROM Student s
            JOIN Department d ON s.Department_ID = d.Department_ID
            ORDER BY d.Department_Name, s.Student_Name
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Courses and their departments
router.get('/courses-departments', async (req, res) => {
    try {
        const sql = `
            SELECT c.Course_ID, c.Course_Name, c.Credits, d.Department_Name
            FROM Course c
            JOIN Department d ON c.Department_ID = d.Department_ID
            ORDER BY c.Course_ID
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Courses with assigned instructors (Sections)
router.get('/courses-instructors', async (req, res) => {
    try {
        const sql = `
            SELECT cs.Section_ID, c.Course_Name, i.Instructor_Name, cs.Semester, cs.Academic_Year, cs.Room
            FROM Course_Section cs
            JOIN Course c ON cs.Course_ID = c.Course_ID
            JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
            ORDER BY cs.Section_ID
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Students registered in each course (NVL -> COALESCE for PostgreSQL)
router.get('/students-in-courses', async (req, res) => {
    try {
        const sql = `
            SELECT s.Student_Name, s.Email, c.Course_Name, cs.Semester, cs.Academic_Year, r.Status,
                   COALESCE(r.Grade, 'In Progress') AS Grade
            FROM Registration r
            JOIN Student s ON r.Student_ID = s.Student_ID
            JOIN Course_Section cs ON r.Section_ID = cs.Section_ID
            JOIN Course c ON cs.Course_ID = c.Course_ID
            ORDER BY c.Course_Name, s.Student_Name
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. Number of students in each course section (Section Occupancy)
router.get('/section-occupancy', async (req, res) => {
    try {
        const sql = `
            SELECT cs.Section_ID,
                   c.Course_Name,
                   i.Instructor_Name,
                   cs.Semester,
                   cs.Capacity,
                   COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS enrolled_students,
                   cs.Capacity - COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS available_seats,
                   CASE 
                       WHEN COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) >= cs.Capacity THEN 'FULL'
                       ELSE 'AVAILABLE'
                   END AS section_status
            FROM Course_Section cs
            JOIN Course c ON cs.Course_ID = c.Course_ID
            JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
            LEFT JOIN Registration r ON cs.Section_ID = r.Section_ID
            GROUP BY cs.Section_ID, c.Course_Name, i.Instructor_Name, cs.Semester, cs.Capacity
            ORDER BY cs.Section_ID
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. Students registered for multiple courses (HAVING > 1)
router.get('/students-multiple-courses', async (req, res) => {
    try {
        const sql = `
            SELECT s.Student_ID, s.Student_Name, d.Department_Name, COUNT(r.Registration_ID) AS course_count
            FROM Student s
            JOIN Department d ON s.Department_ID = d.Department_ID
            JOIN Registration r ON s.Student_ID = r.Student_ID
            GROUP BY s.Student_ID, s.Student_Name, d.Department_Name
            HAVING COUNT(r.Registration_ID) > 1
            ORDER BY course_count DESC, s.Student_Name
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 7. Courses with no registrations (HAVING = 0)
router.get('/courses-no-registrations', async (req, res) => {
    try {
        const sql = `
            SELECT c.Course_ID, c.Course_Name, d.Department_Name, c.Credits
            FROM Course c
            JOIN Department d ON c.Department_ID = d.Department_ID
            LEFT JOIN Course_Section cs ON c.Course_ID = cs.Course_ID
            LEFT JOIN Registration r ON cs.Section_ID = r.Section_ID
            GROUP BY c.Course_ID, c.Course_Name, d.Department_Name, c.Credits
            HAVING COUNT(r.Registration_ID) = 0
            ORDER BY c.Course_ID
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 8. Instructors teaching multiple sections (HAVING > 1)
router.get('/instructors-multiple-sections', async (req, res) => {
    try {
        const sql = `
            SELECT i.Instructor_ID, i.Instructor_Name, d.Department_Name, COUNT(cs.Section_ID) AS section_count
            FROM Instructor i
            JOIN Department d ON i.Department_ID = d.Department_ID
            JOIN Course_Section cs ON i.Instructor_ID = cs.Instructor_ID
            GROUP BY i.Instructor_ID, i.Instructor_Name, d.Department_Name
            HAVING COUNT(cs.Section_ID) > 1
            ORDER BY section_count DESC
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 9. Registration statistics by department
router.get('/stats-by-department', async (req, res) => {
    try {
        const sql = `
            SELECT d.Department_Name,
                   COUNT(DISTINCT s.Student_ID) AS total_students,
                   COUNT(r.Registration_ID) AS total_registrations
            FROM Department d
            LEFT JOIN Student s ON d.Department_ID = s.Department_ID
            LEFT JOIN Registration r ON s.Student_ID = r.Student_ID
            GROUP BY d.Department_Name
            ORDER BY total_registrations DESC
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 10. Registration statistics by semester
router.get('/stats-by-semester', async (req, res) => {
    try {
        const sql = `
            SELECT cs.Semester,
                   cs.Academic_Year,
                   COUNT(r.Registration_ID) AS total_registrations,
                   COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS active_registrations,
                   COUNT(CASE WHEN r.Status = 'COMPLETED' THEN 1 END) AS completed_registrations,
                   COUNT(CASE WHEN r.Status = 'DROPPED' THEN 1 END) AS dropped_registrations
            FROM Course_Section cs
            JOIN Registration r ON cs.Section_ID = r.Section_ID
            GROUP BY cs.Semester, cs.Academic_Year
            ORDER BY cs.Academic_Year, cs.Semester
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
