-- ============================================================================
-- Script: 03_sequences.sql
-- Description: Creates Oracle Sequences for automatic surrogate key generation
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Dropping existing sequences (if any)...
PROMPT ========================================

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE dept_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE student_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE instructor_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE course_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE section_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE reg_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

PROMPT ========================================
PROMPT Creating Sequences...
PROMPT ========================================

-- Sequence for Department IDs
CREATE SEQUENCE dept_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Sequence for Student IDs
CREATE SEQUENCE student_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Sequence for Instructor IDs
CREATE SEQUENCE instructor_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Sequence for Course IDs
CREATE SEQUENCE course_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Sequence for Course_Section IDs
CREATE SEQUENCE section_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- Sequence for Registration IDs
CREATE SEQUENCE reg_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

PROMPT Sequences created successfully.
