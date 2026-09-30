// ============================================================================
// Route: instructors.js
// Description: CRUD endpoints for Instructor entity
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all instructors
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let sql = `
            SELECT i.Instructor_ID,
                   i.Instructor_Name,
                   i.Email,
                   i.Phone,
                   i.Department_ID,
                   d.Department_Name,
                   (SELECT COUNT(*) FROM Course_Section cs WHERE cs.Instructor_ID = i.Instructor_ID) AS sections_count
            FROM Instructor i
            JOIN Department d ON i.Department_ID = d.Department_ID
        `;
        let binds = {};

        if (search && search.trim() !== '') {
            sql += `
                WHERE UPPER(i.Instructor_Name) LIKE UPPER(:search)
                   OR UPPER(i.Email) LIKE UPPER(:search)
                   OR UPPER(d.Department_Name) LIKE UPPER(:search)
            `;
            binds.search = `%${search.trim()}%`;
        }

        sql += ` ORDER BY i.Instructor_ID ASC`;

        const result = await db.execute(sql, binds);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single instructor by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT i.Instructor_ID,
                   i.Instructor_Name,
                   i.Email,
                   i.Phone,
                   i.Department_ID,
                   d.Department_Name
            FROM Instructor i
            JOIN Department d ON i.Department_ID = d.Department_ID
            WHERE i.Instructor_ID = :id
        `;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Instructor not found.' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create instructor
router.post('/', async (req, res) => {
    const { name, email, phone, department_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Instructor Name is required.' });
    }
    if (!email || email.trim() === '' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid Email is required.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            INSERT INTO Instructor (Instructor_Name, Email, Phone, Department_ID)
            VALUES (:name, :email, :phone, :dept_id)
        `;
        await db.execute(sql, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            dept_id: Number(department_id)
        });
        res.status(201).json({ success: true, message: 'Instructor created successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update instructor
router.put('/:id', async (req, res) => {
    const { name, email, phone, department_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Instructor Name is required.' });
    }
    if (!email || email.trim() === '' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid Email is required.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            UPDATE Instructor
            SET Instructor_Name = :name,
                Email = :email,
                Phone = :phone,
                Department_ID = :dept_id
            WHERE Instructor_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            dept_id: Number(department_id)
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Instructor not found.' });
        }
        res.json({ success: true, message: 'Instructor updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE instructor
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Instructor WHERE Instructor_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Instructor not found.' });
        }
        res.json({ success: true, message: 'Instructor deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
