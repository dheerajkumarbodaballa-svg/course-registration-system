// ============================================================================
// Module: api.js
// Description: Client API wrapper for communicating with Express REST endpoints
// ============================================================================

const API_BASE = '/api';

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const res = await fetch(url, config);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `Request failed with status ${res.status}`);
            }
            return data;
        } catch (err) {
            console.error(`API Error on [${config.method || 'GET'} ${endpoint}]:`, err);
            throw err;
        }
    },

    // Dashboard
    getDashboardStats() {
        return this.request('/dashboard/stats');
    },

    // Students
    getStudents(search = '') {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/students${query}`);
    },
    getStudent(id) {
        return this.request(`/students/${id}`);
    },
    createStudent(payload) {
        return this.request('/students', { method: 'POST', body: payload });
    },
    updateStudent(id, payload) {
        return this.request(`/students/${id}`, { method: 'PUT', body: payload });
    },
    deleteStudent(id) {
        return this.request(`/students/${id}`, { method: 'DELETE' });
    },

    // Departments
    getDepartments() {
        return this.request('/departments');
    },
    createDepartment(payload) {
        return this.request('/departments', { method: 'POST', body: payload });
    },
    updateDepartment(id, payload) {
        return this.request(`/departments/${id}`, { method: 'PUT', body: payload });
    },
    deleteDepartment(id) {
        return this.request(`/departments/${id}`, { method: 'DELETE' });
    },

    // Instructors
    getInstructors(search = '') {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/instructors${query}`);
    },
    createInstructor(payload) {
        return this.request('/instructors', { method: 'POST', body: payload });
    },
    updateInstructor(id, payload) {
        return this.request(`/instructors/${id}`, { method: 'PUT', body: payload });
    },
    deleteInstructor(id) {
        return this.request(`/instructors/${id}`, { method: 'DELETE' });
    },

    // Courses
    getCourses(search = '') {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/courses${query}`);
    },
    createCourse(payload) {
        return this.request('/courses', { method: 'POST', body: payload });
    },
    updateCourse(id, payload) {
        return this.request(`/courses/${id}`, { method: 'PUT', body: payload });
    },
    deleteCourse(id) {
        return this.request(`/courses/${id}`, { method: 'DELETE' });
    },

    // Sections
    getSections() {
        return this.request('/sections');
    },
    createSection(payload) {
        return this.request('/sections', { method: 'POST', body: payload });
    },
    updateSection(id, payload) {
        return this.request(`/sections/${id}`, { method: 'PUT', body: payload });
    },
    deleteSection(id) {
        return this.request(`/sections/${id}`, { method: 'DELETE' });
    },

    // Registrations
    getRegistrations() {
        return this.request('/registrations');
    },
    createRegistration(payload) {
        return this.request('/registrations', { method: 'POST', body: payload });
    },
    updateRegistration(id, payload) {
        return this.request(`/registrations/${id}`, { method: 'PUT', body: payload });
    },
    deleteRegistration(id) {
        return this.request(`/registrations/${id}`, { method: 'DELETE' });
    },

    // Reports
    getReport(reportKey) {
        return this.request(`/reports/${reportKey}`);
    }
};
