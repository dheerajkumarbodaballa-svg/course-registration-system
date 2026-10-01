// ============================================================================
// Route: dashboard.js
// Description: Returns database-calculated summary metrics for the dashboard
// ============================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Student) AS total_students,
                (SELECT COUNT(*) FROM Department) AS total_departments,
                (SELECT COUNT(*) FROM Instructor) AS total_instructors,
                (SELECT COUNT(*) FROM Course) AS total_courses,
                (SELECT COUNT(*) FROM Course_Section) AS total_sections,
                (SELECT COUNT(*) FROM Registration) AS total_registrations,
                (SELECT COUNT(*) FROM Registration WHERE Status = 'REGISTERED') AS active_registrations,
                (SELECT COUNT(*) FROM Registration WHERE Status = 'COMPLETED') AS completed_registrations,
                (SELECT COUNT(*) FROM Registration WHERE Status = 'DROPPED') AS dropped_registrations
        `;

        const result = await db.execute(statsQuery);
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
