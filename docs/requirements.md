# Software Requirements Specification (SRS)
## Project: Course Registration System (Academic DBMS Project)

---

### 1. Project Overview
The **Course Registration System** is an academic Database Management System (DBMS) designed for a B.Tech Computer Science and Engineering curriculum. Its primary objective is to manage academic course offerings, course sections, student enrollments, faculty assignments, and registration tracking while strictly maintaining relational integrity, normalization standards, and business logic constraints using **Oracle Database** and **SQL*Plus**.

The system balances academic clarity (simple, defensible concepts for viva voce) with professional UI/UX standards, strictly avoiding over-engineering, unnecessary microservices, third-party authentication overhead, or bloated frameworks.

---

### 2. Functional Requirements

#### 2.1 Department Management
- **FR-DEP-01**: The system shall allow administrators to view all academic departments with their codes, names, and descriptions.
- **FR-DEP-02**: The system shall allow adding new departments with unique names.
- **FR-DEP-03**: The system shall allow updating existing department information.
- **FR-DEP-04**: The system shall prevent the deletion of a department if it is referenced by existing students, instructors, or courses (referential integrity).
- **FR-DEP-05**: The system shall provide search and filter capabilities for departments.

#### 2.2 Student Management
- **FR-STU-01**: The system shall manage student records including `Student_ID`, `Student_Name`, unique `Email`, `Phone`, `Date_of_Birth`, and associated `Department_ID`.
- **FR-STU-02**: The system shall validate email format and verify uniqueness prior to persistence.
- **FR-STU-03**: The system shall allow adding, viewing, editing, and deleting student profiles.
- **FR-STU-04**: The system shall block student deletion if active course registrations exist for that student.
- **FR-STU-05**: The system shall allow searching students by name, email, or department.

#### 2.3 Instructor Management
- **FR-INS-01**: The system shall maintain faculty profiles containing `Instructor_ID`, `Instructor_Name`, unique `Email`, `Phone`, and `Department_ID`.
- **FR-INS-02**: The system shall allow creating, updating, and deleting instructor records.
- **FR-INS-03**: The system shall restrict instructor deletion if the instructor is actively assigned to any course section.

#### 2.4 Course Management
- **FR-CRS-01**: The system shall maintain course offerings with `Course_ID`, `Course_Name`, `Credits` (positive integer), and `Department_ID`.
- **FR-CRS-02**: The system shall enforce that `Credits > 0`.
- **FR-CRS-03**: The system shall allow full CRUD operations on courses with department attribution.
- **FR-CRS-04**: The system shall prevent course deletion if active sections exist for that course.

#### 2.5 Course Section Management
- **FR-SEC-01**: The system shall allow creating sections for existing courses, linking `Course_ID`, `Instructor_ID`, `Semester`, `Academic_Year`, `Room`, and `Capacity`.
- **FR-SEC-02**: The system shall enforce that `Capacity > 0`.
- **FR-SEC-03**: The system shall track available seats vs. total capacity dynamically based on active registrations.
- **FR-SEC-04**: The system shall allow updating section details (such as classroom, instructor, or capacity).

#### 2.6 Registration Management
- **FR-REG-01**: The system shall enable students to register for active course sections.
- **FR-REG-02 (Duplicate Prevention)**: The system shall reject duplicate registration attempts for the same student in the same section (`UNIQUE(Student_ID, Section_ID)`).
- **FR-REG-03 (Capacity Enforcement)**: The system shall check available capacity before creating a registration and reject requests if the section has reached its maximum enrollment capacity (`Active Registrations >= Section Capacity`).
- **FR-REG-04**: The system shall record registration timestamp (`Registration_Date`) automatically defaulting to system date (`SYSDATE`).
- **FR-REG-05**: The system shall support valid registration statuses: `REGISTERED`, `DROPPED`, `COMPLETED`.
- **FR-REG-06**: The system shall support recording academic grades (`A+`, `A`, `B+`, `B`, `C+`, `C`, `D`, `F`) when a section completes.

#### 2.7 Analytical Reports & Dashboard
- **FR-REP-01 (Summary Metrics)**: Real-time count of total students, departments, instructors, courses, active sections, and registrations.
- **FR-REP-02 (Relational Reports)**:
  - Students with their departments.
  - Courses with departments and credits.
  - Course sections with assigned instructors and schedules.
  - Student enrollment rosters per course/section.
  - Section occupancy and seat availability report.
  - Students registered in multiple courses.
  - Courses with zero registrations.
  - Instructors teaching multiple course sections.
  - Registration distribution by department and semester.

---

### 3. Non-Functional Requirements

- **NFR-01 (Database Engine)**: Must exclusively utilize **Oracle Database** (Oracle Database 23ai Free) and execute all DDL/DML via **SQL*Plus**.
- **NFR-02 (Data Integrity)**: Strict enforcement of Primary Keys, Foreign Keys, Not Null constraints, Unique constraints, and Check constraints at the database engine level.
- **NFR-03 (Simplicity & Academic Transparency)**: The codebase and SQL scripts must be clean, readable, well-commented, and directly explainable by a B.Tech student in an oral examination (viva voce).
- **NFR-04 (Security & Configuration)**: Database credentials must be externalized via `.env` configuration; passwords must never be hard-coded into source repositories.
- **NFR-05 (User Experience)**: Intuitive web-based desktop UI using standard HTML5/CSS3/JavaScript with clear validation feedback and human-friendly error messages (masking raw ORA-xxxxx error codes).

---

### 4. Technical Constraints
1. **No Non-Oracle Engines**: Strictly forbidden: MySQL, PostgreSQL, SQLite, MongoDB, SQL Server.
2. **Oracle Dialect**: Use `VARCHAR2`, `NUMBER`, `DATE`, `SYSDATE`, `DUAL`, Oracle sequences, and standard Oracle triggers.
3. **No Auto-Increment**: Use Oracle Sequences (`dept_seq`, `student_seq`, etc.) combined with simple `BEFORE INSERT` triggers or sequence `.NEXTVAL` references.
4. **Architectural Simplicity**: Standard 3-tier architecture:
   - Presentation: HTML5 / CSS3 / Vanilla JavaScript.
   - Application: Node.js with Express.js.
   - Persistence: Oracle Database 23ai via `node-oracledb` (Thin Mode).
