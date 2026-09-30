// ============================================================================
// Route: sections.js
// Description: CRUD endpoints for Course_Section entity
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all course sections with real-time occupancy calculation
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT cs.Section_ID,
                   cs.Course_ID,
                   c.Course_Name,
                   c.Credits,
                   cs.Instructor_ID,
                   i.Instructor_Name,
                   cs.Semester,
                   cs.Academic_Year,
                   cs.Room,
                   cs.Capacity,
                   COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS active_registrations,
                   cs.Capacity - COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) AS available_seats,
                   CASE 
                       WHEN COUNT(CASE WHEN r.Status = 'REGISTERED' THEN 1 END) >= cs.Capacity THEN 'FULL'
                       ELSE 'AVAILABLE'
                   END AS section_status
            FROM Course_Section cs
            JOIN Course c ON cs.Course_ID = c.Course_ID
            JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
            LEFT JOIN Registration r ON cs.Section_ID = r.Section_ID
            GROUP BY cs.Section_ID, cs.Course_ID, c.Course_Name, c.Credits, cs.Instructor_ID,
                     i.Instructor_Name, cs.Semester, cs.Academic_Year, cs.Room, cs.Capacity
            ORDER BY cs.Section_ID ASC
        `;
        const result = await db.execute(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single section by ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT cs.Section_ID,
                   cs.Course_ID,
                   c.Course_Name,
                   cs.Instructor_ID,
                   i.Instructor_Name,
                   cs.Semester,
                   cs.Academic_Year,
                   cs.Room,
                   cs.Capacity
            FROM Course_Section cs
            JOIN Course c ON cs.Course_ID = c.Course_ID
            JOIN Instructor i ON cs.Instructor_ID = i.Instructor_ID
            WHERE cs.Section_ID = :id
        `;
        const result = await db.execute(sql, { id: req.params.id });
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Course section not found.' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create course section
router.post('/', async (req, res) => {
    const { course_id, instructor_id, semester, academic_year, room, capacity } = req.body;

    if (!course_id) {
        return res.status(400).json({ success: false, message: 'Course selection is required.' });
    }
    if (!instructor_id) {
        return res.status(400).json({ success: false, message: 'Instructor selection is required.' });
    }
    if (!semester || semester.trim() === '') {
        return res.status(400).json({ success: false, message: 'Semester is required.' });
    }
    if (!academic_year || academic_year.trim() === '') {
        return res.status(400).json({ success: false, message: 'Academic Year is required.' });
    }
    if (!room || room.trim() === '') {
        return res.status(400).json({ success: false, message: 'Classroom / Lab Venue is required.' });
    }
    if (!capacity || Number(capacity) <= 0) {
        return res.status(400).json({ success: false, message: 'Capacity must be greater than 0.' });
    }

    try {
        const sql = `
            INSERT INTO Course_Section (Course_ID, Instructor_ID, Semester, Academic_Year, Room, Capacity)
            VALUES (:course_id, :instructor_id, :semester, :academic_year, :room, :capacity)
        `;
        await db.execute(sql, {
            course_id: Number(course_id),
            instructor_id: Number(instructor_id),
            semester: semester.trim(),
            academic_year: academic_year.trim(),
            room: room.trim(),
            capacity: Number(capacity)
        });
        res.status(201).json({ success: true, message: 'Course section created successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT update course section
router.put('/:id', async (req, res) => {
    const { course_id, instructor_id, semester, academic_year, room, capacity } = req.body;

    if (!course_id) {
        return res.status(400).json({ success: false, message: 'Course selection is required.' });
    }
    if (!instructor_id) {
        return res.status(400).json({ success: false, message: 'Instructor selection is required.' });
    }
    if (!semester || semester.trim() === '') {
        return res.status(400).json({ success: false, message: 'Semester is required.' });
    }
    if (!academic_year || academic_year.trim() === '') {
        return res.status(400).json({ success: false, message: 'Academic Year is required.' });
    }
    if (!room || room.trim() === '') {
        return res.status(400).json({ success: false, message: 'Classroom / Lab Venue is required.' });
    }
    if (!capacity || Number(capacity) <= 0) {
        return res.status(400).json({ success: false, message: 'Capacity must be greater than 0.' });
    }

    try {
        const sql = `
            UPDATE Course_Section
            SET Course_ID = :course_id,
                Instructor_ID = :instructor_id,
                Semester = :semester,
                Academic_Year = :academic_year,
                Room = :room,
                Capacity = :capacity
            WHERE Section_ID = :id
        `;
        const result = await db.execute(sql, {
            id: req.params.id,
            course_id: Number(course_id),
            instructor_id: Number(instructor_id),
            semester: semester.trim(),
            academic_year: academic_year.trim(),
            room: room.trim(),
            capacity: Number(capacity)
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Course section not found.' });
        }
        res.json({ success: true, message: 'Course section updated successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE course section
router.delete('/:id', async (req, res) => {
    try {
        const sql = `DELETE FROM Course_Section WHERE Section_ID = :id`;
        const result = await db.execute(sql, { id: req.params.id });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Course section not found.' });
        }
        res.json({ success: true, message: 'Course section deleted successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
