

const AdminManager = {
    // Initialize admin dashboard
    init() {
        this.loadDashboardStats();
        this.loadTasks();
        this.loadUsers();
        this.loadUsersTable();
        this.setupEventListeners();
    },

    // Set up event listeners
    setupEventListeners() {
        // Task form submission
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', this.handleTaskFormSubmit.bind(this));
        }

        // User form submission
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', this.handleUserFormSubmit.bind(this));
        }

        // Modal event listeners
        this.setupModalListeners();
    },

    // Setup modal event listeners
    setupModalListeners() {
        const taskModal = document.getElementById('taskModal');
        const userModal = document.getElementById('userModal');

        if (taskModal) {
            taskModal.addEventListener('hidden.bs.modal', () => {
                this.resetTaskModal();
            });
        }

        if (userModal) {
            userModal.addEventListener('hidden.bs.modal', () => {
                this.resetUserModal();
            });
        }
    },

    // Load dashboard statistics
    async loadDashboardStats() {
        try {
            // Load tasks to calculate stats
            const tasksResponse = await Utils.ajax('api/tasks/view.php');
            if (tasksResponse.success) {
                const tasks = tasksResponse.data;
                const totalTasks = tasks.length;
                const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
                const completedTasks = tasks.filter(task => task.status === 'Completed').length;
                
                this.updateStatCard('totalTasks', totalTasks);
                this.updateStatCard('pendingTasks', pendingTasks);
                this.updateStatCard('completedTasks', completedTasks);
            }

            // Load users count
            const usersResponse = await Utils.ajax('api/users/list.php');
            if (usersResponse.success) {
                this.updateStatCard('totalUsers', usersResponse.data.length);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    },

    // Update stat card with animation
    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Animate number change
        const currentValue = parseInt(element.textContent) || 0;
        const targetValue = value;
        
        if (currentValue !== targetValue) {
            this.animateNumber(element, currentValue, targetValue, 500);
        }
    },

    // Animate number counting
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (difference * easeOutQuart));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    },

    // Load tasks
    async loadTasks() {
        await TaskManager.loadTasks('#tasksTableBody', true);
    },

    // Load users for dropdown
    async loadUsers() {
        await UserManager.loadUsers('#taskUser');
    },

    // Load users table
    async loadUsersTable() {
        try {
            const response = await Utils.ajax('api/users/list.php');
            
            if (response.success) {
                this.populateUsersTable(response.data);
            } else {
                Utils.showAlert('danger', response.message);
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to load users. Please try again.');
        }
    },

    // Populate users table
    populateUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" class="text-center text-muted">
                    <i class="fas fa-users fa-2x mb-2"></i><br>
                    No users found
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        users.forEach(user => {
            const row = this.createUserRow(user);
            tbody.appendChild(row);
        });
    },

    // Create user row
    createUserRow(user) {
        const row = document.createElement('tr');
        const roleText = user.is_admin ? 'Administrator' : 'User';
        const roleBadge = user.is_admin ? 'bg-danger' : 'bg-primary';
        
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge ${roleBadge}">${roleText}</span></td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary btn-sm edit-user-btn" 
                            data-user-id="${user.id}"
                            data-username="${user.username}"
                            data-email="${user.email}"
                            data-is-admin="${user.is_admin}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm delete-user-btn" 
                            data-user-id="${user.id}"
                            data-username="${user.username}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Add event listeners
        this.addUserRowEventListeners(row);
        
        return row;
    },

    // Add event listeners to user row
    addUserRowEventListeners(row) {
        const editBtn = row.querySelector('.edit-user-btn');
        const deleteBtn = row.querySelector('.delete-user-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                this.editUser(
                    btn.dataset.userId,
                    btn.dataset.username,
                    btn.dataset.email,
                    btn.dataset.isAdmin === '1'
                );
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                this.deleteUser(btn.dataset.userId, btn.dataset.username);
            });
        }
    },

    // Handle task form submission
    async handleTaskFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const isEdit = document.getElementById('taskId').value !== '';
        const url = isEdit ? 'api/tasks/edit.php' : 'api/tasks/assign.php';
        
        // Validate form
        if (!this.validateTaskForm(form)) {
            return;
        }
        
        Utils.setButtonLoading(submitBtn, true);
        
        try {
            const formData = new FormData(form);
            const response = await Utils.ajax(url, {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
                modal.hide();
                
                // Reload data
                this.loadTasks();
                this.loadDashboardStats();
                Utils.resetForm(form);
            } else {
                Utils.showAlert('danger', response.message, '#taskModal .modal-body');
            }
        } catch (error) {
            Utils.showAlert('danger', 'An error occurred. Please try again.', '#taskModal .modal-body');
        } finally {
            Utils.setButtonLoading(submitBtn, false);
        }
    },

    // Handle user form submission
    async handleUserFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const isEdit = document.getElementById('userId').value !== '';
        const url = isEdit ? 'api/users/edit.php' : 'api/users/add.php';
        
        // Validate form
        if (!this.validateUserForm(form)) {
            return;
        }
        
        Utils.setButtonLoading(submitBtn, true);
        
        try {
            const formData = new FormData(form);
            const response = await Utils.ajax(url, {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
                modal.hide();
                
                // Reload data
                this.loadUsersTable();
                this.loadUsers();
                this.loadDashboardStats();
                Utils.resetForm(form);
            } else {
                Utils.showAlert('danger', response.message, '#userModal .modal-body');
            }
        } catch (error) {
            Utils.showAlert('danger', 'An error occurred. Please try again.', '#userModal .modal-body');
        } finally {
            Utils.setButtonLoading(submitBtn, false);
        }
    },

    // Validate task form
    validateTaskForm(form) {
        const title = form.querySelector('#taskTitle');
        const user = form.querySelector('#taskUser');
        
        let isValid = true;
        
        if (!Utils.validateField(title, 'Title is required')) {
            isValid = false;
        }
        
        if (!Utils.validateField(user, 'Please select a user')) {
            isValid = false;
        }
        
        return isValid;
    },

    // Validate user form
    validateUserForm(form) {
        const username = form.querySelector('#userUsername');
        const email = form.querySelector('#userEmail');
        const password = form.querySelector('#userPassword');
        const isEdit = document.getElementById('userId').value !== '';
        
        let isValid = true;
        
        if (!Utils.validateField(username, 'Username is required')) {
            isValid = false;
        }
        
        if (!Utils.validateField(email, 'Email is required')) {
            isValid = false;
        }
        
        // Validate email format
        if (email.value && !this.isValidEmail(email.value)) {
            Utils.validateField({ value: '', classList: email.classList, parentNode: email.parentNode }, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation (required for new users, optional for edit)
        if (!isEdit && !Utils.validateField(password, 'Password is required')) {
            isValid = false;
        }
        
        if (password.value && password.value.length < 6) {
            Utils.validateField({ value: '', classList: password.classList, parentNode: password.parentNode }, 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        return isValid;
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Edit task
    async editTask(taskId) {
        try {
            const response = await Utils.ajax('api/tasks/view.php');
            
            if (response.success) {
                const task = response.data.find(t => t.id == taskId);
                if (task) {
                    // Populate form
                    document.getElementById('taskId').value = task.id;
                    document.getElementById('taskTitle').value = task.title;
                    document.getElementById('taskDescription').value = task.description;
                    document.getElementById('taskUser').value = task.user_id;
                    document.getElementById('taskDeadline').value = task.deadline;
                    document.getElementById('taskStatus').value = task.status;
                    
                    // Show status group and update modal title
                    document.getElementById('taskStatusGroup').style.display = 'block';
                    document.getElementById('taskModalTitle').textContent = 'Edit Task';
                    
                    // Show modal
                    const modal = new bootstrap.Modal(document.getElementById('taskModal'));
                    modal.show();
                }
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to load task data.');
        }
    },

    // Delete task
    async deleteTask(taskId) {
        if (!Utils.confirmAction('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('task_id', taskId);
            
            const response = await Utils.ajax('api/tasks/delete.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                this.loadTasks();
                this.loadDashboardStats();
            } else {
                Utils.showAlert('danger', response.message);
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to delete task. Please try again.');
        }
    },

    // Edit user
    editUser(userId, username, email, isAdmin) {
        document.getElementById('userId').value = userId;
        document.getElementById('userUsername').value = username;
        document.getElementById('userEmail').value = email;
        document.getElementById('userIsAdmin').checked = isAdmin;
        document.getElementById('userPassword').required = false;
        document.getElementById('userModalTitle').textContent = 'Edit User';
        
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    },

    // Delete user
    async deleteUser(userId, username) {
        if (!Utils.confirmAction(`Are you sure you want to delete user "${username}"? This will also delete all their tasks.`)) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('user_id', userId);
            
            const response = await Utils.ajax('api/users/delete.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                this.loadUsersTable();
                this.loadUsers();
                this.loadTasks();
                this.loadDashboardStats();
            } else {
                Utils.showAlert('danger', response.message);
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to delete user. Please try again.');
        }
    },

    // Reset task modal
    resetTaskModal() {
        const form = document.getElementById('taskForm');
        Utils.resetForm(form);
        document.getElementById('taskModalTitle').textContent = 'Assign New Task';
        document.getElementById('taskStatusGroup').style.display = 'none';
        document.getElementById('taskId').value = '';
    },

    // Reset user modal
    resetUserModal() {
        const form = document.getElementById('userForm');
        Utils.resetForm(form);
        document.getElementById('userModalTitle').textContent = 'Add New User';
        document.getElementById('userId').value = '';
        document.getElementById('userPassword').required = true;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AdminManager.init();
});

// Export for global access
window.AdminManager = AdminManager;

