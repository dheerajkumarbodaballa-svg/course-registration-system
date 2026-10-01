// ============================================================================
// Module: db.js
// Description: Centralized PostgreSQL connection pool and query executor.
// Compatible with: PostgreSQL (Render managed database) via node-postgres (pg)
// ============================================================================

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool using the DATABASE_URL environment variable (Render provides this)
// or fall back to individual env vars for local development
const pool = new Pool(
    process.env.DATABASE_URL
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: { rejectUnauthorized: false } // Required for Render hosted PostgreSQL
          }
        : {
              host: process.env.PGHOST || 'localhost',
              port: process.env.PGPORT || 5432,
              database: process.env.PGDATABASE || 'course_registration',
              user: process.env.PGUSER || 'postgres',
              password: process.env.PGPASSWORD || 'postgres'
          }
);

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database successfully.');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Initialize the Pool (verify connectivity on startup)
 */
async function initializePool() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        client.release();
        console.log(`Pool initialized. DB time: ${res.rows[0].now}`);
        console.log(`Connected to: ${process.env.DATABASE_URL ? 'Render PostgreSQL' : 'Local PostgreSQL'}`);
    } catch (err) {
        console.error('Failed to initialize PostgreSQL connection pool:', err.message);
        throw err;
    }
}

/**
 * Execute a SQL statement using a pooled connection.
 * Converts Oracle-style :named binds to PostgreSQL $1, $2, ... positional params.
 * @param {string} sql - SQL statement (may use :name Oracle-style bind variables)
 * @param {object|array} binds - Named bind object or positional array
 * @param {object} options - Unused; kept for API compatibility
 */
async function execute(sql, binds = {}, options = {}) {
    let pgSql = sql;
    let pgParams = [];

    // Convert Oracle :named bind variables to PostgreSQL $1, $2, ... positional params
    if (binds && typeof binds === 'object' && !Array.isArray(binds)) {
        const keys = Object.keys(binds);
        // Replace each :key with a $N placeholder (handle repeated references to same key)
        const usedKeys = [];
        pgSql = pgSql.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, key) => {
            const existingIndex = usedKeys.indexOf(key);
            if (existingIndex !== -1) {
                return `$${existingIndex + 1}`;
            }
            usedKeys.push(key);
            pgParams.push(binds[key] !== undefined ? binds[key] : null);
            return `$${usedKeys.length}`;
        });
    } else if (Array.isArray(binds)) {
        pgParams = binds;
    }

    try {
        const result = await pool.query(pgSql, pgParams);

        // Normalize result to match Oracle oracledb API shape used in routes:
        // result.rows       -> array of row objects (lowercase keys from pg)
        // result.rowsAffected -> for UPDATE/DELETE/INSERT

        // pg uses result.rowCount for affected rows
        // Uppercase column names to match Oracle's default OUT_FORMAT_OBJECT behaviour
        const upperCasedRows = result.rows.map(row => {
            const upperRow = {};
            for (const key of Object.keys(row)) {
                upperRow[key.toUpperCase()] = row[key];
            }
            return upperRow;
        });

        return {
            rows: upperCasedRows,
            rowsAffected: result.rowCount
        };
    } catch (err) {
        // Map common PostgreSQL error codes into clear messages matching original Oracle error messages
        let friendlyMessage = err.message;

        if (err.code === '23505') {
            // unique_violation
            const detail = (err.detail || '').toUpperCase();
            if (detail.includes('EMAIL')) {
                friendlyMessage = 'Duplicate email address: A record with this email already exists.';
            } else if (detail.includes('DEPARTMENT_NAME') || detail.includes('COURSE_NAME')) {
                friendlyMessage = 'Duplicate entry: A record with this name already exists.';
            } else if (detail.includes('STUDENT_ID') && detail.includes('SECTION_ID')) {
                friendlyMessage = 'Duplicate registration: Student is already registered for this section.';
            } else {
                friendlyMessage = 'Unique constraint violation: Duplicate value not permitted.';
            }
        } else if (err.code === '23503') {
            // foreign_key_violation
            if (err.detail && err.detail.includes('is still referenced')) {
                friendlyMessage = 'Cannot delete record: It is referenced by other existing records.';
            } else {
                friendlyMessage = 'Referential integrity error: Referenced parent record does not exist.';
            }
        } else if (err.code === '23514') {
            // check_violation
            friendlyMessage = 'Check constraint violation: Submitted value does not meet business rules.';
        }

        const customError = new Error(friendlyMessage);
        customError.pgError = err.message;
        customError.code = err.code || 500;
        throw customError;
    }
}

/**
 * Gracefully close the pool (called on SIGINT/SIGTERM)
 */
async function closePool() {
    try {
        await pool.end();
        console.log('PostgreSQL connection pool closed.');
    } catch (err) {
        console.error('Error closing pool:', err);
    }
}

module.exports = {
    initializePool,
    execute,
    closePool
};
