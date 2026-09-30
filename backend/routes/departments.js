// ============================================================================
// Route: departments.js
// Description: CRUD endpoints for Department entity
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all departments
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT d.Department_ID,
                   d.Department_Name,
                   d.Description,
                   (SELECT COUNT(*) FROM Student s WHERE s.Department_ID = d.Department_ID) AS student_count,
                   (SELECT COUNT(*) FROM Instructor i WHERE i.Department_ID = d.Department_ID) AS instructor_count,
                   (SELECT COUNT(*) FROM Course c WHERE c.Department_ID = d.Department_ID) AS course_count
            FROM Department d
            ORDER BY d.Department_ID ASC
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single department by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `SELECT * FROM Department WHERE Department_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create department
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Department Name is required.' });
    }

    try {
        const sql = `
            INSERT INTO Department (Department_Name, Description)
            VALUES (:name, :description)
        `;
        await db.execute(sql, {
            name: name.trim(),
            description: description ? description.trim() : null
        });
        res.status(201).json({ success: true, message: 'Department created successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update department
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Department Name is required.' });
    }

    try {
        const sql = `
            UPDATE Department
            SET Department_Name = :name,
                Description = :description
            WHERE Department_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            name: name.trim(),
            description: description ? description.trim() : null
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }
        res.json({ success: true, message: 'Department updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE department
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Department WHERE Department_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }
        res.json({ success: true, message: 'Department deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
