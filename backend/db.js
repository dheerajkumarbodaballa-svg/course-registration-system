// ============================================================================
// Module: db.js
// Description: Centralized Oracle Database connection pool and query executor.
// Compatible with: Oracle Database 23ai / node-oracledb (Thin Mode)
// ============================================================================

const oracledb = require('oracledb');
require('dotenv').config();

// Ensure output format is JavaScript Object with lowercase column names for clean frontend consumption
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false; // We control transactions explicitly

const dbConfig = {
    user: process.env.ORACLE_USER || 'COURSE_REGISTRATION',
    password: process.env.ORACLE_PASSWORD || 'crs_password',
    connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521/FREEPDB1',
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
    poolTimeout: 60
};

let pool;

/**
 * Initialize Oracle Connection Pool
 */
async function initializePool() {
    try {
        pool = await oracledb.createPool(dbConfig);
        console.log('Connected to Oracle Database 23ai successfully.');
        console.log(`Pool created for user: ${dbConfig.user} on ${dbConfig.connectString}`);
    } catch (err) {
        console.error('Failed to initialize Oracle connection pool:', err.message);
        throw err;
    }
}

/**
 * Execute a SQL statement using a pooled connection
 * @param {string} sql - Oracle SQL statement
 * @param {object|array} binds - Bind variables
 * @param {object} options - Execution options (e.g., autoCommit)
 */
async function execute(sql, binds = {}, options = {}) {
    let connection;
    try {
        if (!pool) {
            await initializePool();
        }
        connection = await pool.getConnection();
        const opts = {
            autoCommit: true,
            ...options
        };
        const result = await connection.execute(sql, binds, opts);
        return result;
    } catch (err) {
        // Map common Oracle error codes into clear academic messages
        let friendlyMessage = err.message;
        if (err.message.includes('ORA-00001')) {
            if (err.message.toUpperCase().includes('UQ_STUDENT_SECTION')) {
                friendlyMessage = 'Duplicate registration: Student is already registered for this section.';
            } else if (err.message.toUpperCase().includes('EMAIL')) {
                friendlyMessage = 'Duplicate email address: A record with this email already exists.';
            } else if (err.message.toUpperCase().includes('NAME')) {
                friendlyMessage = 'Duplicate entry: A record with this name already exists.';
            } else {
                friendlyMessage = 'Unique constraint violation: Duplicate value not permitted.';
            }
        } else if (err.message.includes('ORA-02291')) {
            friendlyMessage = 'Referential integrity error: Referenced parent record does not exist.';
        } else if (err.message.includes('ORA-02292')) {
            friendlyMessage = 'Cannot delete record: It is referenced by other existing records.';
        } else if (err.message.includes('ORA-02290')) {
            friendlyMessage = 'Check constraint violation: Submitted value does not meet business rules.';
        }

        const customError = new Error(friendlyMessage);
        customError.oracleError = err.message;
        customError.code = err.errorNum || 500;
        throw customError;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeErr) {
                console.error('Error closing connection:', closeErr);
            }
        }
    }
}

/**
 * Gracefully close pool
 */
async function closePool() {
    try {
        if (pool) {
            await pool.close(10);
            console.log('Oracle connection pool closed.');
        }
    } catch (err) {
        console.error('Error closing pool:', err);
    }
}

module.exports = {
    initializePool,
    execute,
    closePool
};
