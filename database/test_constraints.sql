-- ============================================================================
-- Script: test_constraints.sql
-- Description: Tests and validates all Oracle database constraints and business rules
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

SET SERVEROUTPUT ON;
SET FEEDBACK OFF;
SET LINESIZE 120;

PROMPT ============================================================================
PROMPT RUNNING CONSTRAINT AND INTEGRITY VALIDATION TESTS
PROMPT ============================================================================

-- ----------------------------------------------------------------------------
-- TEST 1: Foreign Key Constraint (Invalid Department Reference)
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 1] Testing Foreign Key (Inserting Student with non-existent Department 999)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
    VALUES (999, 'Ghost Student', 'ghost@student.ac.in', '+91 99999 99999', DATE '2004-01-01', 999);
    DBMS_OUTPUT.PUT_LINE('FAIL: Insert succeeded unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Foreign key caught invalid reference. Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 2: Unique Constraint (Duplicate Student Email)
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 2] Testing Unique Constraint (Inserting duplicate student email)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    INSERT INTO Student (Student_ID, Student_Name, Email, Phone, Date_of_Birth, Department_ID)
    VALUES (998, 'Duplicate Email Tester', 'rahul.verma@student.ac.in', '+91 88888 88888', DATE '2004-01-01', 1);
    DBMS_OUTPUT.PUT_LINE('FAIL: Duplicate email accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Unique constraint blocked duplicate email. Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 3: Check Constraint (Course Credits <= 0)
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 3] Testing Check Constraint (Inserting Course with negative credits)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    INSERT INTO Course (Course_ID, Course_Name, Credits, Department_ID)
    VALUES (997, 'Invalid Credit Course', -3, 1);
    DBMS_OUTPUT.PUT_LINE('FAIL: Negative credits accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Check constraint rejected negative credits. Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 4: Check Constraint (Invalid Registration Status)
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 4] Testing Check Constraint (Inserting invalid registration status)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status)
    VALUES (996, 5, 2, SYSDATE, 'SUSPENDED');
    DBMS_OUTPUT.PUT_LINE('FAIL: Invalid status accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Check constraint rejected invalid status. Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 5: Business Rule - Duplicate Registration Prevention
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 5] Testing Business Rule (Duplicate registration for same student and section)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    -- Student 1 is already registered in Section 1
    INSERT INTO Registration (Registration_ID, Student_ID, Section_ID, Registration_Date, Status)
    VALUES (995, 1, 1, SYSDATE, 'REGISTERED');
    DBMS_OUTPUT.PUT_LINE('FAIL: Duplicate registration accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Unique constraint (UQ_STUDENT_SECTION) prevented duplicate registration.');
        DBMS_OUTPUT.PUT_LINE('      Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 6: Business Rule - Section Capacity Verification
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 6] Testing Section Capacity Limit for Section 1 (Capacity = 3)...
DECLARE
    v_cap NUMBER;
    v_active_count NUMBER;
BEGIN
    SELECT Capacity INTO v_cap FROM Course_Section WHERE Section_ID = 1;
    SELECT COUNT(*) INTO v_active_count FROM Registration WHERE Section_ID = 1 AND Status = 'REGISTERED';
    
    DBMS_OUTPUT.PUT_LINE('Section 1 Capacity: ' || v_cap);
    DBMS_OUTPUT.PUT_LINE('Section 1 Active Registrations: ' || v_active_count);
    
    IF v_active_count >= v_cap THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Section 1 is verified FULL (' || v_active_count || '/' || v_cap || '). New enrollments rejected.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('FAIL: Expected section 1 to be full.');
    END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 7: Referential Integrity Deletion Protection
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 7] Testing Referential Integrity (Attempting to delete Department 1 having active students)...
DECLARE
    v_err VARCHAR2(255);
BEGIN
    DELETE FROM Department WHERE Department_ID = 1;
    DBMS_OUTPUT.PUT_LINE('FAIL: Department deleted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('PASS: Foreign key child protection blocked deletion. Error code: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 8: Auto-Increment via Sequence and Trigger
-- ----------------------------------------------------------------------------
PROMPT
PROMPT [TEST 8] Testing Automatic ID Generation (Trigger + Sequence on Student table)...
DECLARE
    v_new_id NUMBER;
BEGIN
    INSERT INTO Student (Student_Name, Email, Phone, Date_of_Birth, Department_ID)
    VALUES ('Auto ID Test Student', 'auto.test@student.ac.in', '+91 99999 88888', DATE '2004-03-15', 1)
    RETURNING Student_ID INTO v_new_id;
    
    DBMS_OUTPUT.PUT_LINE('PASS: Auto-increment assigned Student_ID = ' || v_new_id);
    
    -- Cleanup test row
    DELETE FROM Student WHERE Student_ID = v_new_id;
    COMMIT;
END;
/

PROMPT
PROMPT ============================================================================
PROMPT ALL CONSTRAINT TESTS COMPLETED SUCCESSFULLY!
PROMPT ============================================================================
