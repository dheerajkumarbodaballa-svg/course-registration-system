-- ============================================================================
-- Script: 04_triggers.sql
-- Description: Creates simple BEFORE INSERT triggers for automatic Primary Key assignment
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Creating Auto-ID Triggers...
PROMPT ========================================

-- Trigger for Department
CREATE OR REPLACE TRIGGER trg_dept_id
BEFORE INSERT ON Department
FOR EACH ROW
BEGIN
    IF :NEW.Department_ID IS NULL THEN
        :NEW.Department_ID := dept_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger for Student
CREATE OR REPLACE TRIGGER trg_student_id
BEFORE INSERT ON Student
FOR EACH ROW
BEGIN
    IF :NEW.Student_ID IS NULL THEN
        :NEW.Student_ID := student_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger for Instructor
CREATE OR REPLACE TRIGGER trg_instructor_id
BEFORE INSERT ON Instructor
FOR EACH ROW
BEGIN
    IF :NEW.Instructor_ID IS NULL THEN
        :NEW.Instructor_ID := instructor_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger for Course
CREATE OR REPLACE TRIGGER trg_course_id
BEFORE INSERT ON Course
FOR EACH ROW
BEGIN
    IF :NEW.Course_ID IS NULL THEN
        :NEW.Course_ID := course_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger for Course_Section
CREATE OR REPLACE TRIGGER trg_section_id
BEFORE INSERT ON Course_Section
FOR EACH ROW
BEGIN
    IF :NEW.Section_ID IS NULL THEN
        :NEW.Section_ID := section_seq.NEXTVAL;
    END IF;
END;
/

-- Trigger for Registration
CREATE OR REPLACE TRIGGER trg_registration_id
BEFORE INSERT ON Registration
FOR EACH ROW
BEGIN
    IF :NEW.Registration_ID IS NULL THEN
        :NEW.Registration_ID := reg_seq.NEXTVAL;
    END IF;
END;
/

PROMPT Triggers created successfully.
