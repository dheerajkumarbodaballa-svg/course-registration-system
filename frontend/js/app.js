// ============================================================================
// Application: app.js
// Description: UI Controller, Event Handlers, Form Management, and View Routing
// ============================================================================

const app = {
    currentView: 'dashboard',
    departmentsCache: [],
    coursesCache: [],
    instructorsCache: [],
    sectionsCache: [],

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboard();
        this.refreshLookups();
    },

    // Navigation setup
    setupNavigation() {
        const navButtons = document.querySelectorAll('.sidebar-nav .nav-item');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.switchView(view);
            });
        });

        document.getElementById('btn-refresh').addEventListener('click', () => {
            this.refreshCurrentView();
            this.showToast('Data refreshed from PostgreSQL', 'info');
        });
    },

    setupEventListeners() {
        // Debounced search for students
        const searchStudents = document.getElementById('search-students');
        if (searchStudents) {
            searchStudents.addEventListener('input', this.debounce(() => {
                this.loadStudents(searchStudents.value);
            }, 300));
        }

        // Debounced search for instructors
        const searchInstructors = document.getElementById('search-instructors');
        if (searchInstructors) {
            searchInstructors.addEventListener('input', this.debounce(() => {
                this.loadInstructors(searchInstructors.value);
            }, 300));
        }

        // Debounced search for courses
        const searchCourses = document.getElementById('search-courses');
        if (searchCourses) {
            searchCourses.addEventListener('input', this.debounce(() => {
                this.loadCourses(searchCourses.value);
            }, 300));
        }

        // Report selector
        const reportSelect = document.getElementById('report-select');
        if (reportSelect) {
            reportSelect.addEventListener('change', () => {
                this.loadSelectedReport();
            });
        }
    },

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    // View Routing
    switchView(viewName) {
        this.currentView = viewName;

        // Update nav items
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
        });

        // Update view sections
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update Titles
        const titles = {
            dashboard: { title: 'System Dashboard', subtitle: 'Academic Overview & Operational Metrics' },
            students: { title: 'Student Management', subtitle: 'Enrolled Students & Academic Records' },
            departments: { title: 'Department Management', subtitle: 'Academic Faculties & Divisions' },
            instructors: { title: 'Instructor Management', subtitle: 'Faculty Profiles & Teaching Assignments' },
            courses: { title: 'Course Catalog', subtitle: 'Curriculum Syllabi & Credit Weightings' },
            sections: { title: 'Course Sections', subtitle: 'Scheduled Offerings, Venues & Seat Allocations' },
            registrations: { title: 'Registration Management', subtitle: 'Course Enrollments, Grade Records & Capacity' },
            reports: { title: 'Academic Reports', subtitle: 'DBMS Analytics, Joins, Aggregations & Groupings' }
        };

        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        if (titles[viewName]) {
            pageTitle.textContent = titles[viewName].title;
            pageSubtitle.textContent = titles[viewName].subtitle;
        }

        this.refreshCurrentView();
    },

    refreshCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'students':
                this.loadStudents();
                break;
            case 'departments':
                this.loadDepartments();
                break;
            case 'instructors':
                this.loadInstructors();
                break;
            case 'courses':
                this.loadCourses();
                break;
            case 'sections':
                this.loadSections();
                break;
            case 'registrations':
                this.loadRegistrations();
                break;
            case 'reports':
                this.loadSelectedReport();
                break;
        }
    },

    async refreshLookups() {
        try {
            const [deptRes, courseRes, instRes, secRes] = await Promise.all([
                api.getDepartments(),
                api.getCourses(),
                api.getInstructors(),
                api.getSections()
            ]);
            this.departmentsCache = deptRes.data || [];
            this.coursesCache = courseRes.data || [];
            this.instructorsCache = instRes.data || [];
            this.sectionsCache = secRes.data || [];
        } catch (err) {
            console.error('Lookup caching error:', err);
        }
    },

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // Modal Helpers
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    // ------------------------------------------------------------------------
    // 1. DASHBOARD
    // ------------------------------------------------------------------------
    async loadDashboard() {
        try {
            const res = await api.getDashboardStats();
            const stats = res.data;
            document.getElementById('stat-students').textContent = stats.TOTAL_STUDENTS || 0;
            document.getElementById('stat-departments').textContent = stats.TOTAL_DEPARTMENTS || 0;
            document.getElementById('stat-instructors').textContent = stats.TOTAL_INSTRUCTORS || 0;
            document.getElementById('stat-courses').textContent = stats.TOTAL_COURSES || 0;
            document.getElementById('stat-sections').textContent = stats.TOTAL_SECTIONS || 0;
            document.getElementById('stat-registrations').textContent = stats.TOTAL_REGISTRATIONS || 0;

            // Load brief sections summary
            const secRes = await api.getSections();
            const sections = secRes.data.slice(0, 5);
            const tbody = document.getElementById('dashboard-sections-table');
            if (sections.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center">No sections scheduled.</td></tr>`;
                return;
            }

            tbody.innerHTML = sections.map(s => `
                <tr>
                    <td><strong>#${s.SECTION_ID}</strong></td>
                    <td>${s.COURSE_NAME}</td>
                    <td>${s.SEMESTER} ${s.ACADEMIC_YEAR}</td>
                    <td>${s.CAPACITY}</td>
                    <td>${s.ACTIVE_REGISTRATIONS}</td>
                    <td>
                        <span class="badge ${s.SECTION_STATUS === 'FULL' ? 'badge-full' : 'badge-available'}">
                            ${s.SECTION_STATUS}
                        </span>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 2. STUDENTS
    // ------------------------------------------------------------------------
    async loadStudents(search = '') {
        try {
            const res = await api.getStudents(search);
            const tbody = document.getElementById('students-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center">No students found.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map((s, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${s.STUDENT_NAME}</strong></td>
                    <td>${s.EMAIL}</td>
                    <td>${s.PHONE || '--'}</td>
                    <td>${s.DATE_OF_BIRTH}</td>
                    <td>${s.DEPARTMENT_NAME}</td>
                    <td><span class="badge badge-registered">${s.REGISTRATION_COUNT} Enrolled</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editStudent(${s.STUDENT_ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteStudent(${s.STUDENT_ID}, '${s.STUDENT_NAME}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openStudentModal(student = null) {
        await this.refreshLookups();
        if (!student) {
            document.getElementById('form-student').reset();
        }
        const select = document.getElementById('student-department');
        select.innerHTML = this.departmentsCache.map(d => `
            <option value="${d.DEPARTMENT_ID}">${d.DEPARTMENT_NAME}</option>
        `).join('');

        if (student) {
            document.getElementById('student-modal-title').textContent = 'Edit Student';
            document.getElementById('student-id').value = student.STUDENT_ID;
            document.getElementById('student-name').value = student.STUDENT_NAME;
            document.getElementById('student-email').value = student.EMAIL;
            document.getElementById('student-phone').value = student.PHONE || '';
            document.getElementById('student-dob').value = student.DATE_OF_BIRTH;
            select.value = student.DEPARTMENT_ID;
        } else {
            document.getElementById('student-modal-title').textContent = 'Add New Student';
            document.getElementById('student-id').value = '';
        }
        this.openModal('modal-student');
    },

    async editStudent(id) {
        try {
            const res = await api.getStudent(id);
            this.openStudentModal(res.data);
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async handleStudentSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('student-id').value;
        const payload = {
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            phone: document.getElementById('student-phone').value,
            dob: document.getElementById('student-dob').value,
            department_id: document.getElementById('student-department').value
        };

        try {
            if (id) {
                await api.updateStudent(id, payload);
                this.showToast('Student updated successfully!', 'success');
            } else {
                await api.createStudent(payload);
                this.showToast('Student added successfully!', 'success');
            }
            this.closeModal('modal-student');
            this.loadStudents();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteStudent(id, name) {
        if (!confirm(`Are you sure you want to delete student "${name}"?`)) return;
        try {
            await api.deleteStudent(id);
            this.showToast('Student deleted successfully!', 'success');
            this.loadStudents();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 3. DEPARTMENTS
    // ------------------------------------------------------------------------
    async loadDepartments() {
        try {
            const res = await api.getDepartments();
            const tbody = document.getElementById('departments-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center">No departments found.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map(d => `
                <tr>
                    <td>${d.DEPARTMENT_ID}</td>
                    <td><strong>${d.DEPARTMENT_NAME}</strong></td>
                    <td>${d.DESCRIPTION || '--'}</td>
                    <td>${d.STUDENT_COUNT}</td>
                    <td>${d.INSTRUCTOR_COUNT}</td>
                    <td>${d.COURSE_COUNT}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editDepartment(${d.DEPARTMENT_ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteDepartment(${d.DEPARTMENT_ID}, '${d.DEPARTMENT_NAME}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openDepartmentModal(dept = null) {
        if (dept) {
            document.getElementById('department-modal-title').textContent = 'Edit Department';
            document.getElementById('department-id').value = dept.DEPARTMENT_ID;
            document.getElementById('department-name').value = dept.DEPARTMENT_NAME;
            document.getElementById('department-description').value = dept.DESCRIPTION || '';
        } else {
            document.getElementById('department-modal-title').textContent = 'Add New Department';
            document.getElementById('form-department').reset();
            document.getElementById('department-id').value = '';
        }
        this.openModal('modal-department');
    },

    async editDepartment(id) {
        try {
            const res = await api.request(`/departments/${id}`);
            this.openDepartmentModal(res.data);
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async handleDepartmentSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('department-id').value;
        const payload = {
            name: document.getElementById('department-name').value,
            description: document.getElementById('department-description').value
        };

        try {
            if (id) {
                await api.updateDepartment(id, payload);
                this.showToast('Department updated successfully!', 'success');
            } else {
                await api.createDepartment(payload);
                this.showToast('Department added successfully!', 'success');
            }
            this.closeModal('modal-department');
            this.loadDepartments();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteDepartment(id, name) {
        if (!confirm(`Are you sure you want to delete department "${name}"?`)) return;
        try {
            await api.deleteDepartment(id);
            this.showToast('Department deleted successfully!', 'success');
            this.loadDepartments();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 4. INSTRUCTORS
    // ------------------------------------------------------------------------
    async loadInstructors(search = '') {
        try {
            const res = await api.getInstructors(search);
            const tbody = document.getElementById('instructors-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center">No instructors found.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map(i => `
                <tr>
                    <td>${i.INSTRUCTOR_ID}</td>
                    <td><strong>${i.INSTRUCTOR_NAME}</strong></td>
                    <td>${i.EMAIL}</td>
                    <td>${i.PHONE || '--'}</td>
                    <td>${i.DEPARTMENT_NAME}</td>
                    <td>${i.SECTIONS_COUNT}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editInstructor(${i.INSTRUCTOR_ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteInstructor(${i.INSTRUCTOR_ID}, '${i.INSTRUCTOR_NAME}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openInstructorModal(inst = null) {
        await this.refreshLookups();
        if (!inst) {
            document.getElementById('form-instructor').reset();
        }
        const select = document.getElementById('instructor-department');
        select.innerHTML = this.departmentsCache.map(d => `
            <option value="${d.DEPARTMENT_ID}">${d.DEPARTMENT_NAME}</option>
        `).join('');

        if (inst) {
            document.getElementById('instructor-modal-title').textContent = 'Edit Instructor';
            document.getElementById('instructor-id').value = inst.INSTRUCTOR_ID;
            document.getElementById('instructor-name').value = inst.INSTRUCTOR_NAME;
            document.getElementById('instructor-email').value = inst.EMAIL;
            document.getElementById('instructor-phone').value = inst.PHONE || '';
            select.value = inst.DEPARTMENT_ID;
        } else {
            document.getElementById('instructor-modal-title').textContent = 'Add New Instructor';
            document.getElementById('instructor-id').value = '';
        }
        this.openModal('modal-instructor');
    },

    async editInstructor(id) {
        try {
            const res = await api.request(`/instructors/${id}`);
            this.openInstructorModal(res.data);
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async handleInstructorSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('instructor-id').value;
        const payload = {
            name: document.getElementById('instructor-name').value,
            email: document.getElementById('instructor-email').value,
            phone: document.getElementById('instructor-phone').value,
            department_id: document.getElementById('instructor-department').value
        };

        try {
            if (id) {
                await api.updateInstructor(id, payload);
                this.showToast('Instructor updated successfully!', 'success');
            } else {
                await api.createInstructor(payload);
                this.showToast('Instructor added successfully!', 'success');
            }
            this.closeModal('modal-instructor');
            this.loadInstructors();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteInstructor(id, name) {
        if (!confirm(`Are you sure you want to delete instructor "${name}"?`)) return;
        try {
            await api.deleteInstructor(id);
            this.showToast('Instructor deleted successfully!', 'success');
            this.loadInstructors();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 5. COURSES
    // ------------------------------------------------------------------------
    async loadCourses(search = '') {
        try {
            const res = await api.getCourses(search);
            const tbody = document.getElementById('courses-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center">No courses found.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map(c => `
                <tr>
                    <td>${c.COURSE_ID}</td>
                    <td><strong>${c.COURSE_NAME}</strong></td>
                    <td>${c.CREDITS} Credits</td>
                    <td>${c.DEPARTMENT_NAME}</td>
                    <td>${c.SECTION_COUNT}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editCourse(${c.COURSE_ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteCourse(${c.COURSE_ID}, '${c.COURSE_NAME}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openCourseModal(course = null) {
        await this.refreshLookups();
        if (!course) {
            document.getElementById('form-course').reset();
        }
        const select = document.getElementById('course-department');
        select.innerHTML = this.departmentsCache.map(d => `
            <option value="${d.DEPARTMENT_ID}">${d.DEPARTMENT_NAME}</option>
        `).join('');

        if (course) {
            document.getElementById('course-modal-title').textContent = 'Edit Course';
            document.getElementById('course-id').value = course.COURSE_ID;
            document.getElementById('course-name').value = course.COURSE_NAME;
            document.getElementById('course-credits').value = course.CREDITS;
            select.value = course.DEPARTMENT_ID;
        } else {
            document.getElementById('course-modal-title').textContent = 'Add New Course';
            document.getElementById('course-id').value = '';
        }
        this.openModal('modal-course');
    },

    async editCourse(id) {
        try {
            const res = await api.request(`/courses/${id}`);
            this.openCourseModal(res.data);
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async handleCourseSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('course-id').value;
        const payload = {
            name: document.getElementById('course-name').value,
            credits: document.getElementById('course-credits').value,
            department_id: document.getElementById('course-department').value
        };

        try {
            if (id) {
                await api.updateCourse(id, payload);
                this.showToast('Course updated successfully!', 'success');
            } else {
                await api.createCourse(payload);
                this.showToast('Course created successfully!', 'success');
            }
            this.closeModal('modal-course');
            this.loadCourses();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteCourse(id, name) {
        if (!confirm(`Are you sure you want to delete course "${name}"?`)) return;
        try {
            await api.deleteCourse(id);
            this.showToast('Course deleted successfully!', 'success');
            this.loadCourses();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 6. COURSE SECTIONS
    // ------------------------------------------------------------------------
    async loadSections() {
        try {
            const res = await api.getSections();
            const tbody = document.getElementById('sections-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="11" class="text-center">No sections scheduled.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map(s => `
                <tr>
                    <td><strong>#${s.SECTION_ID}</strong></td>
                    <td>${s.COURSE_NAME}</td>
                    <td>${s.CREDITS}</td>
                    <td>${s.INSTRUCTOR_NAME}</td>
                    <td>${s.SEMESTER} ${s.ACADEMIC_YEAR}</td>
                    <td>${s.ROOM}</td>
                    <td>${s.CAPACITY}</td>
                    <td>${s.ACTIVE_REGISTRATIONS}</td>
                    <td><strong>${s.AVAILABLE_SEATS}</strong></td>
                    <td>
                        <span class="badge ${s.SECTION_STATUS === 'FULL' ? 'badge-full' : 'badge-available'}">
                            ${s.SECTION_STATUS}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.editSection(${s.SECTION_ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteSection(${s.SECTION_ID})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openSectionModal(section = null) {
        await this.refreshLookups();
        if (!section) {
            document.getElementById('form-section').reset();
        }
        const courseSelect = document.getElementById('section-course');
        const instSelect = document.getElementById('section-instructor');

        courseSelect.innerHTML = this.coursesCache.map(c => `
            <option value="${c.COURSE_ID}">${c.COURSE_NAME} (${c.CREDITS} Cr)</option>
        `).join('');

        instSelect.innerHTML = this.instructorsCache.map(i => `
            <option value="${i.INSTRUCTOR_ID}">${i.INSTRUCTOR_NAME} (${i.DEPARTMENT_NAME})</option>
        `).join('');

        if (section) {
            document.getElementById('section-modal-title').textContent = 'Edit Course Section';
            document.getElementById('section-id').value = section.SECTION_ID;
            courseSelect.value = section.COURSE_ID;
            instSelect.value = section.INSTRUCTOR_ID;
            document.getElementById('section-semester').value = section.SEMESTER;
            document.getElementById('section-year').value = section.ACADEMIC_YEAR;
            document.getElementById('section-room').value = section.ROOM;
            document.getElementById('section-capacity').value = section.CAPACITY;
        } else {
            document.getElementById('section-modal-title').textContent = 'Schedule New Section';
            document.getElementById('section-id').value = '';
            document.getElementById('section-year').value = '2025-2026';
            document.getElementById('section-capacity').value = '30';
        }
        this.openModal('modal-section');
    },

    async editSection(id) {
        try {
            const res = await api.request(`/sections/${id}`);
            this.openSectionModal(res.data);
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async handleSectionSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('section-id').value;
        const payload = {
            course_id: document.getElementById('section-course').value,
            instructor_id: document.getElementById('section-instructor').value,
            semester: document.getElementById('section-semester').value,
            academic_year: document.getElementById('section-year').value,
            room: document.getElementById('section-room').value,
            capacity: document.getElementById('section-capacity').value
        };

        try {
            if (id) {
                await api.updateSection(id, payload);
                this.showToast('Course section updated successfully!', 'success');
            } else {
                await api.createSection(payload);
                this.showToast('Course section scheduled successfully!', 'success');
            }
            this.closeModal('modal-section');
            this.loadSections();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteSection(id) {
        if (!confirm(`Are you sure you want to delete Course Section #${id}?`)) return;
        try {
            await api.deleteSection(id);
            this.showToast('Section deleted successfully!', 'success');
            this.loadSections();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 7. REGISTRATIONS
    // ------------------------------------------------------------------------
    async loadRegistrations() {
        try {
            const res = await api.getRegistrations();
            const tbody = document.getElementById('registrations-table-body');
            if (res.data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9" class="text-center">No registrations found.</td></tr>`;
                return;
            }

            tbody.innerHTML = res.data.map(r => `
                <tr>
                    <td><strong>#${r.REGISTRATION_ID}</strong></td>
                    <td>${r.STUDENT_NAME}</td>
                    <td>${r.COURSE_NAME} (Sec #${r.SECTION_ID})</td>
                    <td>${r.INSTRUCTOR_NAME}</td>
                    <td>${r.SEMESTER} ${r.ACADEMIC_YEAR}</td>
                    <td>${r.REGISTRATION_DATE}</td>
                    <td>
                        <span class="badge badge-${r.STATUS.toLowerCase()}">${r.STATUS}</span>
                    </td>
                    <td><strong>${r.GRADE || 'In Progress'}</strong></td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="app.openEditRegistrationModal(${r.REGISTRATION_ID}, '${r.STUDENT_NAME}', '${r.COURSE_NAME}', '${r.STATUS}', '${r.GRADE || ''}')">Update</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteRegistration(${r.REGISTRATION_ID})">Cancel</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async openRegistrationModal() {
        await this.refreshLookups();
        document.getElementById('form-registration').reset();

        const studentRes = await api.getStudents();
        const students = studentRes.data || [];

        const studentSelect = document.getElementById('reg-student');
        studentSelect.innerHTML = students.map(s => `
            <option value="${s.STUDENT_ID}">${s.STUDENT_NAME} (${s.DEPARTMENT_NAME})</option>
        `).join('');

        const secRes = await api.getSections();
        const sections = secRes.data || [];
        this.sectionsCache = sections;

        const secSelect = document.getElementById('reg-section');
        secSelect.innerHTML = sections.map(s => `
            <option value="${s.SECTION_ID}" ${s.SECTION_STATUS === 'FULL' ? 'style="color:red;"' : ''}>
                Section #${s.SECTION_ID}: ${s.COURSE_NAME} - ${s.INSTRUCTOR_NAME} (${s.SEMESTER}) [${s.ACTIVE_REGISTRATIONS}/${s.CAPACITY} seats] ${s.SECTION_STATUS === 'FULL' ? '- FULL' : ''}
            </option>
        `).join('');

        if (sections.length > 0) {
            this.onSectionSelectChange(sections[0].SECTION_ID);
        }

        document.getElementById('reg-status').value = 'REGISTERED';
        this.openModal('modal-registration');
    },

    onSectionSelectChange(sectionId) {
        const sec = this.sectionsCache.find(s => s.SECTION_ID == sectionId);
        const info = document.getElementById('reg-section-info');
        if (sec) {
            if (sec.SECTION_STATUS === 'FULL') {
                info.textContent = `⚠️ SECTION IS FULL (${sec.ACTIVE_REGISTRATIONS}/${sec.CAPACITY} seats). Registration will be rejected by business rules!`;
                info.style.color = '#dc2626';
                info.style.fontWeight = 'bold';
            } else {
                info.textContent = `Available: ${sec.AVAILABLE_SEATS} seats remaining out of ${sec.CAPACITY}.`;
                info.style.color = '#059669';
                info.style.fontWeight = 'normal';
            }
        }
    },

    async handleRegistrationSubmit(e) {
        e.preventDefault();
        const payload = {
            student_id: document.getElementById('reg-student').value,
            section_id: document.getElementById('reg-section').value,
            status: document.getElementById('reg-status').value,
            grade: document.getElementById('reg-grade').value || null
        };

        try {
            await api.createRegistration(payload);
            this.showToast('Student successfully registered!', 'success');
            this.closeModal('modal-registration');
            this.loadRegistrations();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    openEditRegistrationModal(id, studentName, courseName, status, grade) {
        document.getElementById('edit-reg-id').value = id;
        document.getElementById('edit-reg-student').value = studentName;
        document.getElementById('edit-reg-course').value = courseName;
        document.getElementById('edit-reg-status').value = status;
        document.getElementById('edit-reg-grade').value = grade;
        this.openModal('modal-edit-registration');
    },

    async handleEditRegistrationSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('edit-reg-id').value;
        const payload = {
            status: document.getElementById('edit-reg-status').value,
            grade: document.getElementById('edit-reg-grade').value || null
        };

        try {
            await api.updateRegistration(id, payload);
            this.showToast('Registration record updated successfully!', 'success');
            this.closeModal('modal-edit-registration');
            this.loadRegistrations();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async deleteRegistration(id) {
        if (!confirm(`Cancel/Delete registration #${id}?`)) return;
        try {
            await api.deleteRegistration(id);
            this.showToast('Registration cancelled successfully!', 'success');
            this.loadRegistrations();
            this.refreshLookups();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // ------------------------------------------------------------------------
    // 8. REPORTS
    // ------------------------------------------------------------------------
    async loadSelectedReport() {
        const reportKey = document.getElementById('report-select').value;
        const reportTitle = document.getElementById('report-select').selectedOptions[0].text;
        document.getElementById('report-title').textContent = reportTitle;

        const thead = document.getElementById('report-table-head');
        const tbody = document.getElementById('report-table-body');
        const rowCount = document.getElementById('report-row-count');

        tbody.innerHTML = `<tr><td class="text-center">Loading report data from PostgreSQL...</td></tr>`;

        try {
            const res = await api.getReport(reportKey);
            const rows = res.data || [];
            rowCount.textContent = `${rows.length} rows returned`;

            if (rows.length === 0) {
                thead.innerHTML = '';
                tbody.innerHTML = `<tr><td class="text-center">No records matched this report criteria.</td></tr>`;
                return;
            }

            // Dynamically generate column headers from object keys
            const columns = Object.keys(rows[0]);
            thead.innerHTML = `<tr>${columns.map(col => `<th>${col.replace(/_/g, ' ')}</th>`).join('')}</tr>`;

            tbody.innerHTML = rows.map(r => `
                <tr>
                    ${columns.map(col => `<td>${r[col] !== null && r[col] !== undefined ? r[col] : '--'}</td>`).join('')}
                </tr>
            `).join('');
        } catch (err) {
            this.showToast(err.message, 'error');
            tbody.innerHTML = `<tr><td class="text-center" style="color:red;">Error loading report: ${err.message}</td></tr>`;
        }
    }
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
