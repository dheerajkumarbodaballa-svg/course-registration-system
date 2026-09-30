# Test Execution Matrix & Quality Assurance Report
## Project: Course Registration System (Oracle Database 23ai)

---

### 1. Overview
This document records the comprehensive functional, relational integrity, constraint validation, and business rule tests conducted against the **Course Registration System**. Tests were executed across both the Oracle Database engine via **SQL*Plus** and the application layer via **Express.js REST APIs** connected to Oracle Database 23ai Free (`FREEPDB1`).

---

### 2. Comprehensive Test Cases Matrix

| Test ID | Test Scenario | Input Data | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---:|
| **TC-01** | Add Student (Valid) | Name: `"Test Student"`, Email: `"test.student@aditya.ac.in"`, DOB: `"2004-01-01"`, Dept: `1` | HTTP 201 Created; Auto-assigned `Student_ID = 16` via sequence + trigger | Record persisted; sequence assigned ID; success message returned | **PASSED** |
| **TC-02** | Edit Student | Update `Student_ID = 16` Name to `"Updated Test Student"` | HTTP 200 OK; Name updated in database | Name updated in Oracle `Student` table | **PASSED** |
| **TC-03** | Delete Student (Unreferenced) | `DELETE /api/students/16` | HTTP 200 OK; Record removed from database | Record deleted cleanly | **PASSED** |
| **TC-04** | Add Department (Valid) | Name: `"Civil Engineering"`, Description: `"Structural & transportation engineering"` | HTTP 201 Created; Auto-assigned `Department_ID` | Record created successfully in `Department` table | **PASSED** |
| **TC-05** | Add Instructor (Valid) | Name: `"Dr. Neeraj Sharma"`, Email: `"neeraj@aditya.ac.in"`, Dept: `1` | HTTP 201 Created; Faculty profile persisted | Record created successfully in `Instructor` table | **PASSED** |
| **TC-06** | Add Course (Valid) | Name: `"Compiler Design"`, Credits: `4`, Dept: `1` | HTTP 201 Created; Course record stored | Record created successfully in `Course` table | **PASSED** |
| **TC-07** | Add Course Section (Valid) | Course: `1`, Instructor: `1`, Term: `"Fall"`, Year: `"2025-2026"`, Room: `"LH-105"`, Capacity: `30` | HTTP 201 Created; Section scheduled | Record created successfully in `Course_Section` table | **PASSED** |
| **TC-08** | Register Student (Valid) | Student: `15` (Sanjay Choudhury), Section: `2` (Capacity: 30, Enrolled: 2) | HTTP 201 Created; Registration recorded | Enrolled successfully; seat count updated | **PASSED** |
| **TC-09** | Duplicate Registration Prevention | Student: `1` (Rahul Verma), Section: `1` (already registered) | HTTP 400 Bad Request; Rejection message; Database `UQ_STUDENT_SECTION` enforced | Rejected with: *"Duplicate registration: This student is already registered for this section"* | **PASSED** |
| **TC-10** | Section Capacity Limit (Full Section) | Student: `5` (Rohan Nair), Section: `1` (Capacity: 3, Active Enrolled: 3) | HTTP 400 Bad Request; Enrollment blocked | Rejected with: *"Course section is full. Current enrollment (3/3) has reached maximum capacity."* | **PASSED** |
| **TC-11** | Foreign Key Violation (Invalid Parent) | Student insertion with non-existent `Department_ID = 999` | Oracle constraint violation `ORA-02291` | Caught `ORA-02291`: integrity constraint `FK_STUDENT_DEPT` violated - parent key not found | **PASSED** |
| **TC-12** | Unique Constraint Violation (Duplicate Email) | Student with email `"rahul.verma@student.ac.in"` | Oracle unique constraint violation `ORA-00001` | Caught `ORA-00001`: unique constraint `UQ_STUDENT_EMAIL` violated | **PASSED** |
| **TC-13** | Check Constraint Violation (Negative Credits) | Course with `Credits = -3` | Oracle check constraint violation `ORA-02290` | Caught `ORA-02290`: check constraint `CHK_COURSE_CREDITS` violated | **PASSED** |
| **TC-14** | Check Constraint Violation (Invalid Status) | Registration with `Status = 'SUSPENDED'` | Oracle check constraint violation `ORA-02290` | Caught `ORA-02290`: check constraint `CHK_REG_STATUS` violated | **PASSED** |
| **TC-15** | Referential Integrity (Delete Parent Protected) | `DELETE FROM Department WHERE Department_ID = 1` | Oracle `ORA-02292` child record found; friendly error | Caught `ORA-02292`: *"Cannot delete record: It is referenced by other existing records."* | **PASSED** |
| **TC-16** | Invalid Email Format | Student insertion with email `"invalid-email"` | HTTP 400 Bad Request | Rejected with: *"A valid Email address is required."* | **PASSED** |
| **TC-17** | Empty Required Field | Student insertion with `name = ""` | HTTP 400 Bad Request | Rejected with: *"Student Name is required."* | **PASSED** |
| **TC-18** | Database Connection Health | `GET /api/health` | HTTP 200 OK; status: `"UP"`, database: `"Oracle Database 23ai Free"` | Health endpoint verified active connection pool | **PASSED** |
| **TC-19** | Analytical Reports Integrity | Execution of all 10 academic report endpoints | All 10 reports return valid data with zero SQL errors | Verified 10/10 reports return correct relational datasets | **PASSED** |

---

### 3. Conclusion
All 19 test cases successfully met expected outcomes. Constraints (Primary Key, Foreign Key, Unique, and Check) function both at the Oracle SQL engine level and through the application API validation layer, ensuring absolute relational integrity and crash-free user interaction.
