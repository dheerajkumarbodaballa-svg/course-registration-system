// ============================================================================
// Route: registrations.js
// Description: Core Registration controller implementing duplicate prevention
//              and section capacity validation.
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all registrations
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT r.Registration_ID,
                   r.Student_ID,
                   s.Student_Name,
                   s.Email AS Student_Email,
                   r.Section_ID,
                   c.Course_Name,
                   c.Credits,
                   i.Instructor_Name,
                   cs.Semester,
                   cs.Academic_Year,
                   cs.Room,
                   TO_CHAR(r.Registration_Date, 'YYYY-MM-DD') AS Registration_Date,
                   r.Status,
                   r.Grade
            FROM Registration r
            JOIN Student s ON r.Student_ID = s.Student_ID
            JOIN Course_Section cs ON r.Section_ID = cs.Section_ID
            JOIN Course c ON cs.Course_ID = c.Course_ID
            JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
            ORDER BY r.Registration_ID DESC
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single registration by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT r.*,
                   s.Student_Name,
                   c.Course_Name
            FROM Registration r
            JOIN Student s ON r.Student_ID = s.Student_ID
            JOIN Course_Section cs ON r.Section_ID = cs.Section_ID
            JOIN Course c ON cs.Course_ID = c.Course_ID
            WHERE r.Registration_ID = :id
        `;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Registration not found.' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST register student for a course section
router.post('/', async (req, res) => {
    const { student_id, section_id, status, grade } = req.body;

    if (!student_id) {
        return res.status(400).json({ success: false, message: 'Student selection is required.' });
    }
    if (!section_id) {
        return res.status(400).json({ success: false, message: 'Course Section selection is required.' });
    }

    const regStatus = status || 'REGISTERED';
    const regGrade = grade || null;

    try {
        // Step 1: Verify Section exists and retrieve capacity
        const sectionCheckSql = `
            SELECT cs.Capacity, c.Course_Name
            FROM Course_Section cs
            JOIN Course c ON cs.Course_ID = c.Course_ID
            WHERE cs.Section_ID = :section_id
        `;
        const sectionResult = await db.execute(sectionCheckSql, { section_id: Number(section_id) });

        if (sectionResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Selected Course Section does not exist.' });
        }

        const capacity = sectionResult.rows[0].CAPACITY;
        const courseName = sectionResult.rows[0].COURSE_NAME;

        // Step 2: Check for Duplicate Registration
        const duplicateCheckSql = `
            SELECT Registration_ID, Status
            FROM Registration
            WHERE Student_ID = :student_id AND Section_ID = :section_id
        `;
        const dupResult = await db.execute(duplicateCheckSql, {
            student_id: Number(student_id),
            section_id: Number(section_id)
        });

        if (dupResult.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Duplicate registration: This student is already registered for this section (${courseName}).`
            });
        }

        // Step 3: Check Section Capacity (Only active 'REGISTERED' students consume capacity)
        if (regStatus === 'REGISTERED') {
            const countSql = `
                SELECT COUNT(*) AS active_count
                FROM Registration
                WHERE Section_ID = :section_id AND Status = 'REGISTERED'
            `;
            const countResult = await db.execute(countSql, { section_id: Number(section_id) });
            const activeCount = Number(countResult.rows[0].ACTIVE_COUNT);

            if (activeCount >= capacity) {
                return res.status(400).json({
                    success: false,
                    message: `Course section is full. Current enrollment (${activeCount}/${capacity}) has reached maximum capacity.`
                });
            }
        }

        // Step 4: Insert Registration (CURRENT_DATE replaces Oracle SYSDATE)
        const insertSql = `
            INSERT INTO Registration (Student_ID, Section_ID, Registration_Date, Status, Grade)
            VALUES (:student_id, :section_id, CURRENT_DATE, :status, :grade)
        `;
        await db.execute(insertSql, {
            student_id: Number(student_id),
            section_id: Number(section_id),
            status: regStatus,
            grade: regGrade
        });

        res.status(201).json({
            success: true,
            message: `Student successfully registered for ${courseName}.`
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update registration status / grade
router.put('/:id', async (req, res) => {
    const { status, grade } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    try {
        const sql = `
            UPDATE Registration
            SET Status = :status,
                Grade = :grade
            WHERE Registration_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            status: status,
            grade: grade || null
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Registration record not found.' });
        }
        res.json({ success: true, message: 'Registration record updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE registration
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Registration WHERE Registration_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Registration record not found.' });
        }
        res.json({ success: true, message: 'Registration cancelled / deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
