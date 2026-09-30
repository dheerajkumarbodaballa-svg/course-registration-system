-- ============================================================================
-- Script: 02_constraints.sql
-- Description: Adds Primary Keys, Foreign Keys, Unique, and Check Constraints
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Adding Primary Key Constraints...
PROMPT ========================================

ALTER TABLE Department
    ADD CONSTRAINT pk_department PRIMARY KEY (Department_ID);

ALTER TABLE Student
    ADD CONSTRAINT pk_student PRIMARY KEY (Student_ID);

ALTER TABLE Instructor
    ADD CONSTRAINT pk_instructor PRIMARY KEY (Instructor_ID);

ALTER TABLE Course
    ADD CONSTRAINT pk_course PRIMARY KEY (Course_ID);

ALTER TABLE Course_Section
    ADD CONSTRAINT pk_course_section PRIMARY KEY (Section_ID);

ALTER TABLE Registration
    ADD CONSTRAINT pk_registration PRIMARY KEY (Registration_ID);

PROMPT ========================================
PROMPT Adding Foreign Key Constraints...
PROMPT ========================================

-- Student -> Department
ALTER TABLE Student
    ADD CONSTRAINT fk_student_dept FOREIGN KEY (Department_ID)
    REFERENCES Department (Department_ID);

-- Instructor -> Department
ALTER TABLE Instructor
    ADD CONSTRAINT fk_instructor_dept FOREIGN KEY (Department_ID)
    REFERENCES Department (Department_ID);

-- Course -> Department
ALTER TABLE Course
    ADD CONSTRAINT fk_course_dept FOREIGN KEY (Department_ID)
    REFERENCES Department (Department_ID);

-- Course_Section -> Course
ALTER TABLE Course_Section
    ADD CONSTRAINT fk_section_course FOREIGN KEY (Course_ID)
    REFERENCES Course (Course_ID);

-- Course_Section -> Instructor
ALTER TABLE Course_Section
    ADD CONSTRAINT fk_section_instructor FOREIGN KEY (Instructor_ID)
    REFERENCES Instructor (Instructor_ID);

-- Registration -> Student
ALTER TABLE Registration
    ADD CONSTRAINT fk_reg_student FOREIGN KEY (Student_ID)
    REFERENCES Student (Student_ID);

-- Registration -> Course_Section
ALTER TABLE Registration
    ADD CONSTRAINT fk_reg_section FOREIGN KEY (Section_ID)
    REFERENCES Course_Section (Section_ID);

PROMPT ========================================
PROMPT Adding Unique Constraints...
PROMPT ========================================

ALTER TABLE Department
    ADD CONSTRAINT uq_dept_name UNIQUE (Department_Name);

ALTER TABLE Student
    ADD CONSTRAINT uq_student_email UNIQUE (Email);

ALTER TABLE Instructor
    ADD CONSTRAINT uq_instructor_email UNIQUE (Email);

ALTER TABLE Course
    ADD CONSTRAINT uq_course_name UNIQUE (Course_Name);

-- Business Rule: A student cannot register twice for the same course section
ALTER TABLE Registration
    ADD CONSTRAINT uq_student_section UNIQUE (Student_ID, Section_ID);

PROMPT ========================================
PROMPT Adding Check Constraints...
PROMPT ========================================

-- Credits must be greater than zero
ALTER TABLE Course
    ADD CONSTRAINT chk_course_credits CHECK (Credits > 0);

-- Section capacity must be strictly positive
ALTER TABLE Course_Section
    ADD CONSTRAINT chk_section_capacity CHECK (Capacity > 0);

-- Registration status must be REGISTERED, DROPPED, or COMPLETED
ALTER TABLE Registration
    ADD CONSTRAINT chk_reg_status CHECK (Status IN ('REGISTERED', 'DROPPED', 'COMPLETED'));

-- Grade must be valid academic grade or NULL (when in progress)
ALTER TABLE Registration
    ADD CONSTRAINT chk_reg_grade CHECK (Grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F') OR Grade IS NULL);

PROMPT Constraints added successfully.
