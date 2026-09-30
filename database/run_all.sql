-- ============================================================================
-- Script: run_all.sql
-- Description: Master runner script to set up complete database schema,
--              constraints, sequences, triggers, and sample data.
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET ECHO OFF
SET FEEDBACK ON
SET SERVEROUTPUT ON
SET LINESIZE 200
SET PAGESIZE 50

PROMPT ============================================================================
PROMPT STARTING DATABASE SETUP FOR COURSE REGISTRATION SYSTEM
PROMPT ============================================================================

PROMPT Step 1: Creating Tables...
@@01_create_tables.sql

PROMPT Step 2: Adding Constraints (PK, FK, Unique, Check)...
@@02_constraints.sql

PROMPT Step 3: Creating Sequences...
@@03_sequences.sql

PROMPT Step 4: Creating Triggers...
@@04_triggers.sql

PROMPT Step 5: Inserting Sample Data...
@@05_insert_sample_data.sql

PROMPT ============================================================================
PROMPT VERIFYING TABLE ROW COUNTS
PROMPT ============================================================================

SELECT 'Department' AS Table_Name, COUNT(*) AS Total_Rows FROM Department
UNION ALL
SELECT 'Instructor', COUNT(*) FROM Instructor
UNION ALL
SELECT 'Course', COUNT(*) FROM Course
UNION ALL
SELECT 'Student', COUNT(*) FROM Student
UNION ALL
SELECT 'Course_Section', COUNT(*) FROM Course_Section
UNION ALL
SELECT 'Registration', COUNT(*) FROM Registration;

PROMPT ============================================================================
PROMPT DATABASE SETUP COMPLETED SUCCESSFULLY!
PROMPT ============================================================================
