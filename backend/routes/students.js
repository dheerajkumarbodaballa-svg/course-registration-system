// ============================================================================
// Route: students.js
// Description: CRUD endpoints for Student entity
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all students (supports optional search query)
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let sql = `
            SELECT s.Student_ID,
                   s.Student_Name,
                   s.Email,
                   s.Phone,
                   TO_CHAR(s.Date_of_Birth, 'YYYY-MM-DD') AS Date_of_Birth,
                   s.Department_ID,
                   d.Department_Name,
                   (SELECT COUNT(*) FROM Registration r WHERE r.Student_ID = s.Student_ID) AS registration_count
            FROM Student s
            JOIN Department d ON s.Department_ID = d.Department_ID
        `;
        let binds = {};

        if (search && search.trim() !== '') {
            sql += `
                WHERE UPPER(s.Student_Name) LIKE UPPER(:search)
                   OR UPPER(s.Email) LIKE UPPER(:search)
                   OR UPPER(d.Department_Name) LIKE UPPER(:search)
            `;
            binds.search = `%${search.trim()}%`;
        }

        sql += ` ORDER BY s.Student_ID ASC`;

        const result = await db.execute(sql, binds);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT s.Student_ID,
                   s.Student_Name,
                   s.Email,
                   s.Phone,
                   TO_CHAR(s.Date_of_Birth, 'YYYY-MM-DD') AS Date_of_Birth,
                   s.Department_ID,
                   d.Department_Name
            FROM Student s
            JOIN Department d ON s.Department_ID = d.Department_ID
            WHERE s.Student_ID = :id
        `;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create student
router.post('/', async (req, res) => {
    const { name, email, phone, dob, department_id } = req.body;

    // Basic Validation
    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Student Name is required.' });
    }
    if (!email || email.trim() === '' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid Email address is required.' });
    }
    if (!dob) {
        return res.status(400).json({ success: false, message: 'Date of Birth is required.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            INSERT INTO Student (Student_Name, Email, Phone, Date_of_Birth, Department_ID)
            VALUES (:name, :email, :phone, :dob, :dept_id)
        `;
        await db.execute(sql, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            dob: dob,
            dept_id: Number(department_id)
        });
        res.status(201).json({ success: true, message: 'Student registered successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    const { name, email, phone, dob, department_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Student Name is required.' });
    }
    if (!email || email.trim() === '' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid Email address is required.' });
    }
    if (!dob) {
        return res.status(400).json({ success: false, message: 'Date of Birth is required.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            UPDATE Student
            SET Student_Name = :name,
                Email = :email,
                Phone = :phone,
                Date_of_Birth = :dob,
                Department_ID = :dept_id
            WHERE Student_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            dob: dob,
            dept_id: Number(department_id)
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, message: 'Student updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Student WHERE Student_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        res.json({ success: true, message: 'Student deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
