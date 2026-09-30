# Comprehensive DBMS Viva Voce Questions & Answers
## Project: Course Registration System (Oracle Database 23ai)

---

### Category 1: Relational Concepts & Database Schema

#### Q1: What is a Relational Database Management System (RDBMS)?
**Answer**: An RDBMS is a database management software based on the relational data model introduced by E.F. Codd. Data is represented in mathematical relations (tables) composed of rows (tuples) and columns (attributes), and relationships between tables are maintained through foreign keys. In our project, we use **Oracle Database 23ai**.

#### Q2: What are the core entities (tables) in your project, and what are their roles?
**Answer**: Our project uses exactly 6 normalized tables:
1. `DEPARTMENT`: Stores academic departments (parent for students, instructors, and courses).
2. `STUDENT`: Stores admitted student profiles and their home department.
3. `INSTRUCTOR`: Stores faculty members and their departmental affiliation.
4. `COURSE`: Stores master syllabus offerings and credit weightings.
5. `COURSE_SECTION`: Represents a scheduled class offering of a course in a given semester, room, and capacity, assigned to an instructor.
6. `REGISTRATION`: The associative table recording which student is enrolled in which course section, including status and grade.

#### Q3: What is a Primary Key? Identify the primary keys in your project.
**Answer**: A Primary Key is a column or set of columns that uniquely identifies every tuple (row) in a table. It enforces entity integrity: values must be unique and cannot contain `NULL`.
- In our schema:
  - `Department.Department_ID`
  - `Student.Student_ID`
  - `Instructor.Instructor_ID`
  - `Course.Course_ID`
  - `Course_Section.Section_ID`
  - `Registration.Registration_ID`

#### Q4: What is a Foreign Key? Give an example from your project.
**Answer**: A Foreign Key is an attribute in a child table that references the Primary Key of a parent table to enforce **referential integrity**.
- Example: In `STUDENT`, `Department_ID` references `DEPARTMENT(Department_ID)`. This prevents assigning a student to a department that does not exist in the university.

#### Q5: What is the difference between a One-to-Many and a Many-to-Many relationship? How did you resolve Many-to-Many in your design?
**Answer**:
- **One-to-Many ($1:M$)**: One record in Table A is related to multiple records in Table B, but each record in Table B relates to only one in Table A. (e.g., One `DEPARTMENT` offers many `COURSES`).
- **Many-to-Many ($M:N$)**: Multiple records in Table A relate to multiple records in Table B. In our system, a student takes multiple course sections, and a course section has multiple enrolled students.
- **Resolution**: An RDBMS cannot cleanly implement direct $M:N$ relationships without creating duplicate data or violating 1NF. We resolved it by introducing an **associative entity (bridge table)**: **`REGISTRATION`**, which decomposes the $M:N$ into two $1:M$ relationships (`Student` $\rightarrow$ `Registration` and `Course_Section` $\rightarrow$ `Registration`).

---

### Category 2: Constraints & Business Rules

#### Q6: What constraints did you implement in Oracle Database?
**Answer**:
1. **PRIMARY KEY**: Enforces unique identity and NOT NULL on all surrogate ID columns.
2. **FOREIGN KEY**: Enforces referential integrity across parent-child relationships.
3. **NOT NULL**: Ensures essential columns (like names, emails, dates) cannot be omitted.
4. **UNIQUE**:
   - `Department_Name` in `Department`
   - `Email` in `Student` and `Instructor`
   - `Course_Name` in `Course`
   - Composite `UNIQUE(Student_ID, Section_ID)` in `Registration` to prevent duplicate enrollments.
5. **CHECK**:
   - `Credits > 0` on `Course`
   - `Capacity > 0` on `Course_Section`
   - `Status IN ('REGISTERED', 'DROPPED', 'COMPLETED')` on `Registration`
   - `Grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F') OR Grade IS NULL` on `Registration`.

#### Q7: How does your system prevent duplicate registrations?
**Answer**: Duplicate registration is prevented at two independent layers:
1. **Database Layer**: Enforced by a compound unique constraint:
   ```sql
   CONSTRAINT uq_student_section UNIQUE (Student_ID, Section_ID);
   ```
   If a duplicate insert is attempted, Oracle raises error `ORA-00001: unique constraint violated`.
2. **Application Layer**: Before inserting, the backend checks:
   ```sql
   SELECT COUNT(*) FROM Registration WHERE Student_ID = :student_id AND Section_ID = :section_id;
   ```
   If count > 0, an HTTP 400 response is returned with the friendly message: *"Student is already registered for this course section."*

#### Q8: How does your system enforce section capacity?
**Answer**: Each course section has an allotted `Capacity` (e.g., 40). Before enrolling a student with `Status = 'REGISTERED'`, the system queries active enrollments:
```sql
SELECT COUNT(*) FROM Registration WHERE Section_ID = :section_id AND Status = 'REGISTERED';
```
If `Active Enrollments >= Capacity`, the registration is blocked with: *"Course section is full. Maximum capacity reached."* Furthermore, dropped registrations (`Status = 'DROPPED'`) do not consume capacity, freeing seats dynamically.

#### Q9: What happens if an administrator tries to delete a Department that has active students?
**Answer**: Because our foreign key constraints do not specify `ON DELETE CASCADE`, Oracle's default referential integrity rule (`RESTRICT`) activates. The deletion is blocked by the database engine with error `ORA-02292: integrity constraint violated - child record found`. Our backend intercepts this error and returns a clean user message: *"Cannot delete record: It is referenced by other existing records."*

---

### Category 3: Database Normalization

#### Q10: Explain 1NF, 2NF, and 3NF with respect to your database.
**Answer**:
- **1NF**: Every column contains atomic values, there are no repeating groups, and all tables have defined primary keys.
- **2NF**: It is in 1NF and contains no partial functional dependencies. Since all master tables use single-column surrogate primary keys, partial dependency is physically impossible. In `REGISTRATION`, attributes (`Registration_Date`, `Status`, `Grade`) depend on the full combination of student and section.
- **3NF**: It is in 2NF and contains no transitive functional dependencies ($X \rightarrow Y \rightarrow Z$). Non-key attributes depend only on the primary key:
  - Department details are not stored inside `Student` or `Course`.
  - Course details and instructor details are not duplicated inside `Course_Section`.

---

### Category 4: Oracle Database & SQL*Plus

#### Q11: Why did you use Oracle Database instead of MySQL?
**Answer**: Oracle Database is an enterprise-grade, ACID-compliant RDBMS widely used in industry and academia. It provides robust PL/SQL support, advanced data dictionary views, multi-tenant container architecture (CDB/PDB), sequences, and strict constraint enforcement.

#### Q12: How does auto-increment work in Oracle Database without MySQL's `AUTO_INCREMENT`?
**Answer**: Oracle uses **Sequences** and **Triggers**:
1. We create independent Oracle sequences (e.g., `student_seq START WITH 1 INCREMENT BY 1 NOCACHE;`).
2. We create `BEFORE INSERT FOR EACH ROW` triggers that automatically assign `:NEW.Student_ID := student_seq.NEXTVAL;` if no ID is explicitly provided.
*(In Oracle 23ai, `DEFAULT seq.NEXTVAL` can also be used; our triggers demonstrate classical PL/SQL programming).*

#### Q13: What is SQL*Plus?
**Answer**: SQL*Plus is Oracle's native command-line interface tool used to connect to Oracle Database instances, execute SQL statements, run PL/SQL blocks, and run batch database creation scripts (`@run_all.sql`).

#### Q14: What is the difference between CDB and PDB in Oracle 23ai?
**Answer**: Oracle 23ai uses a Multitenant architecture:
- **CDB (Container Database)**: The root database container (named `FREE`) that holds system metadata and shared background processes.
- **PDB (Pluggable Database)**: A portable, self-contained user database (named `FREEPDB1`) that houses application schemas, tables, and data. Our project schema `COURSE_REGISTRATION` resides inside `FREEPDB1`.

---

### Category 5: SQL Queries, Joins, Aggregates & Views

#### Q15: What is the difference between `INNER JOIN` and `LEFT JOIN`? Give examples from your project.
**Answer**:
- **`INNER JOIN`**: Returns only rows that have matching values in both tables.
  - *Example*: Joining `Student` and `Department` returns only students who have a valid matching department.
- **`LEFT JOIN`**: Returns all rows from the left table, and matching rows from the right table. If no match exists, `NULL` values are returned for right-table columns.
  - *Example*: In our report *"Courses with No Registrations"*, we `LEFT JOIN` `Course` with `Registration`. Courses that have zero registrations return `NULL` for `Registration_ID`, which allows us to filter them using `HAVING COUNT(Registration_ID) = 0`.

#### Q16: What is the difference between `WHERE` and `HAVING` clauses?
**Answer**:
- **`WHERE`**: Filters individual rows **before** any grouping or aggregation takes place. (e.g., `WHERE Credits >= 4`).
- **`HAVING`**: Filters groups of rows **after** the `GROUP BY` clause has aggregated them. (e.g., `GROUP BY s.Student_ID, s.Student_Name HAVING COUNT(r.Registration_ID) > 1` to find students enrolled in multiple courses).

#### Q17: What aggregate functions did you use?
**Answer**:
- `COUNT()`: Total registrations, students, sections.
- `AVG()`: Average course credits and average section capacities.
- `MIN()` and `MAX()`: Minimum and maximum section capacities and course credits.
- `SUM()`: Total university seat capacity across all scheduled sections.

#### Q18: What is a Database View, and why did you use views?
**Answer**: A View is a virtual table defined by a stored SQL `SELECT` query. It does not store physical data; rather, it dynamically runs the underlying query when accessed.
- **Benefits in our project**:
  1. **Simplification**: Pre-joins tables so the application does not have to repeat complex 4-way join SQL.
  2. **Security & Abstraction**: Exposes calculated metrics like `Available_Seats` and `Section_Status` without altering the physical table.
  - Example: `vw_section_schedule` computes real-time seat occupancy and availability.

#### Q19: What is a Subquery? Give an example from your project.
**Answer**: A subquery is a query nested inside another query (e.g., inside `WHERE`, `FROM`, or `SELECT`).
- *Example*: Finding courses that have credits greater than the departmental average:
  ```sql
  SELECT Course_Name, Credits
  FROM Course
  WHERE Credits > (SELECT AVG(Credits) FROM Course);
  ```

---

### Category 6: Application Architecture & Transactions

#### Q20: Explain the 3-Tier Architecture of your application.
**Answer**:
1. **Presentation Tier (Frontend)**: Built with HTML5, CSS3, and JavaScript (Fetch API). Renders responsive cards, forms, tables, and modal dialogs.
2. **Application Tier (Backend)**: Built with Node.js and Express.js. Handles RESTful routing, input sanitization, business validation (capacity and duplicate checks), and Oracle connection pooling.
3. **Database Tier (Persistence)**: Oracle Database 23ai Free running locally, executing SQL and enforcing data integrity.

#### Q21: What is a Connection Pool, and why is it important?
**Answer**: A connection pool maintains a cache of active database connections that can be reused across incoming HTTP requests. Establishing a new TCP connection and authenticating to Oracle for every single web request is computationally expensive. By using `oracledb.createPool()`, connections are borrowed, used, and returned to the pool in milliseconds, maximizing throughput and preventing connection exhaustion.

#### Q22: What are ACID properties in database transactions?
**Answer**:
- **Atomicity**: All operations in a transaction succeed, or all are rolled back ("all or nothing").
- **Consistency**: A transaction takes the database from one valid state to another, upholding all constraints.
- **Isolation**: Concurrent transactions execute independently without interfering with each other.
- **Durability**: Once a transaction is committed, changes persist permanently even in case of power failure.
