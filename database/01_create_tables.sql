-- ============================================================================
-- Script: 01_create_tables.sql
-- Description: Creates the 6 core relational tables for Course Registration System
-- Author: B.Tech CSE Student
-- Compatible with: Oracle Database 23ai / SQL*Plus
-- ============================================================================

PROMPT ========================================
PROMPT Dropping existing tables (if any)...
PROMPT ========================================

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Registration CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Course_Section CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Course CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Instructor CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Student CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Department CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

PROMPT ========================================
PROMPT Creating Core Tables...
PROMPT ========================================

-- 1. DEPARTMENT Table
CREATE TABLE Department (
    Department_ID   NUMBER,
    Department_Name VARCHAR2(100) NOT NULL,
    Description     VARCHAR2(255)
);

-- 2. STUDENT Table
CREATE TABLE Student (
    Student_ID      NUMBER,
    Student_Name    VARCHAR2(100) NOT NULL,
    Email           VARCHAR2(100) NOT NULL,
    Phone           VARCHAR2(20),
    Date_of_Birth   DATE NOT NULL,
    Department_ID   NUMBER NOT NULL
);

-- 3. INSTRUCTOR Table
CREATE TABLE Instructor (
    Instructor_ID   NUMBER,
    Instructor_Name VARCHAR2(100) NOT NULL,
    Email           VARCHAR2(100) NOT NULL,
    Phone           VARCHAR2(20),
    Department_ID   NUMBER NOT NULL
);

-- 4. COURSE Table
CREATE TABLE Course (
    Course_ID       NUMBER,
    Course_Name     VARCHAR2(100) NOT NULL,
    Credits         NUMBER NOT NULL,
    Department_ID   NUMBER NOT NULL
);

-- 5. COURSE_SECTION Table
CREATE TABLE Course_Section (
    Section_ID      NUMBER,
    Course_ID       NUMBER NOT NULL,
    Instructor_ID   NUMBER NOT NULL,
    Semester        VARCHAR2(20) NOT NULL,
    Academic_Year   VARCHAR2(20) NOT NULL,
    Room            VARCHAR2(50) NOT NULL,
    Capacity        NUMBER NOT NULL
);

-- 6. REGISTRATION Table
CREATE TABLE Registration (
    Registration_ID   NUMBER,
    Student_ID        NUMBER NOT NULL,
    Section_ID        NUMBER NOT NULL,
    Registration_Date DATE DEFAULT SYSDATE NOT NULL,
    Status            VARCHAR2(20) DEFAULT 'REGISTERED' NOT NULL,
    Grade             VARCHAR2(5)
);

PROMPT Tables created successfully.
