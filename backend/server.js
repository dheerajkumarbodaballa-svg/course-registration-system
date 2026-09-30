// ============================================================================
// Server: server.js
// Description: Express.js application server entry point for Course Registration System
// ============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const departmentRoutes = require('./routes/departments');
const studentRoutes = require('./routes/students');
const instructorRoutes = require('./routes/instructors');
const courseRoutes = require('./routes/courses');
const sectionRoutes = require('./routes/sections');
const registrationRoutes = require('./routes/registrations');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        database: 'Oracle Database 23ai Free',
        time: new Date().toISOString()
    });
});

// Single Page Application Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start Server after initializing Oracle Connection Pool
async function startServer() {
    try {
        await db.initializePool();
        app.listen(PORT, () => {
            console.log(`=======================================================`);
            console.log(`  Course Registration System is running!`);
            console.log(`  URL: http://localhost:${PORT}`);
            console.log(`  Connected to: ${process.env.ORACLE_CONNECT_STRING}`);
            console.log(`=======================================================`);
        });
    } catch (err) {
        console.error('Failed to start server due to Oracle Database error:', err);
        process.exit(1);
    }
}

// Handle clean shutdown
process.on('SIGINT', async () => {
    console.log('\nGracefully shutting down...');
    await db.closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nGracefully shutting down...');
    await db.closePool();
    process.exit(0);
});

startServer();
