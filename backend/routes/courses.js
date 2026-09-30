// ============================================================================
// Route: courses.js
// Description: CRUD endpoints for Course entity
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all courses
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        let sql = `
            SELECT c.Course_ID,
                   c.Course_Name,
                   c.Credits,
                   c.Department_ID,
                   d.Department_Name,
                   (SELECT COUNT(*) FROM Course_Section cs WHERE cs.Course_ID = c.Course_ID) AS section_count
            FROM Course c
            JOIN Department d ON c.Department_ID = d.Department_ID
        `;
        let binds = {};

        if (search && search.trim() !== '') {
            sql += `
                WHERE UPPER(c.Course_Name) LIKE UPPER(:search)
                   OR UPPER(d.Department_Name) LIKE UPPER(:search)
            `;
            binds.search = `%${search.trim()}%`;
        }

        sql += ` ORDER BY c.Course_ID ASC`;

        const result = await db.execute(sql, binds);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single course by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT c.Course_ID,
                   c.Course_Name,
                   c.Credits,
                   c.Department_ID,
                   d.Department_Name
            FROM Course c
            JOIN Department d ON c.Department_ID = d.Department_ID
            WHERE c.Course_ID = :id
        `;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create course
router.post('/', async (req, res) => {
    const { name, credits, department_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Course Name is required.' });
    }
    if (!credits || Number(credits) <= 0) {
        return res.status(400).json({ success: false, message: 'Credits must be a positive number greater than 0.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            INSERT INTO Course (Course_Name, Credits, Department_ID)
            VALUES (:name, :credits, :dept_id)
        `;
        await db.execute(sql, {
            name: name.trim(),
            credits: Number(credits),
            dept_id: Number(department_id)
        });
        res.status(201).json({ success: true, message: 'Course created successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update course
router.put('/:id', async (req, res) => {
    const { name, credits, department_id } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Course Name is required.' });
    }
    if (!credits || Number(credits) <= 0) {
        return res.status(400).json({ success: false, message: 'Credits must be a positive number greater than 0.' });
    }
    if (!department_id) {
        return res.status(400).json({ success: false, message: 'Department selection is required.' });
    }

    try {
        const sql = `
            UPDATE Course
            SET Course_Name = :name,
                Credits = :credits,
                Department_ID = :dept_id
            WHERE Course_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            name: name.trim(),
            credits: Number(credits),
            dept_id: Number(department_id)
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.json({ success: true, message: 'Course updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE course
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Course WHERE Course_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        res.json({ success: true, message: 'Course deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
