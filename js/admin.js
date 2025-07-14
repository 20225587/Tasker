
$(document).ready(function() {
    // Load initial data
    loadDashboardStats();
    loadTasks('#tasksTableBody', true);
    loadUsers('#taskUser'); // For task assignment dropdown
    loadUsersTable();
    
    // Task form submission
    $('#taskForm').on('submit', function(e) {
        e.preventDefault();
        
        const isEdit = $('#taskId').val() !== '';
        const url = isEdit ? 'api/tasks/edit.php' : 'api/tasks/assign.php';
        const formData = new FormData(this);
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showAlert('success', response.message);
                    $('#taskModal').modal('hide');
                    loadTasks('#tasksTableBody', true);
                    loadDashboardStats();
                    resetForm('#taskForm');
                } else {
                    showAlert('danger', response.message, '#taskModal .modal-body');
                }
            },
            error: function() {
                showAlert('danger', 'An error occurred. Please try again.', '#taskModal .modal-body');
            }
        });
    });
    
    // User form submission
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        
        const isEdit = $('#userId').val() !== '';
        const url = isEdit ? 'api/users/edit.php' : 'api/users/add.php';
        const formData = new FormData(this);
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showAlert('success', response.message);
                    $('#userModal').modal('hide');
                    loadUsersTable();
                    loadUsers('#taskUser'); // Refresh task assignment dropdown
                    loadDashboardStats();
                    resetForm('#userForm');
                } else {
                    showAlert('danger', response.message, '#userModal .modal-body');
                }
            },
            error: function() {
                showAlert('danger', 'An error occurred. Please try again.', '#userModal .modal-body');
            }
        });
    });
    
    // Reset forms when modals are hidden
    $('#taskModal').on('hidden.bs.modal', function() {
        resetForm('#taskForm');
        $('#taskModalTitle').text('Assign New Task');
        $('#taskStatusGroup').hide();
        $('#taskId').val('');
    });
    
    $('#userModal').on('hidden.bs.modal', function() {
        resetForm('#userForm');
        $('#userModalTitle').text('Add New User');
        $('#userId').val('');
        $('#userPassword').prop('required', true);
    });
});

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    // Load tasks to calculate stats
    $.ajax({
        url: 'api/tasks/view.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                const tasks = response.data;
                const totalTasks = tasks.length;
                const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
                const completedTasks = tasks.filter(task => task.status === 'Completed').length;
                
                $('#totalTasks').text(totalTasks);
                $('#pendingTasks').text(pendingTasks);
                $('#completedTasks').text(completedTasks);
            }
        }
    });
    
    // Load users count
    $.ajax({
        url: 'api/users/list.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                $('#totalUsers').text(response.data.length);
            }
        }
    });
}

/**
 * Load users table
 */
function loadUsersTable() {
    $.ajax({
        url: 'api/users/list.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                populateUsersTable(response.data);
            } else {
                showAlert('danger', response.message);
            }
        },
        error: function() {
            showAlert('danger', 'Failed to load users. Please try again.');
        }
    });
}

/**
 * Populate users table
 * @param {array} users - Users array
 */
function populateUsersTable(users) {
    const tbody = $('#usersTableBody');
    tbody.empty();
    
    if (users.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="fas fa-users fa-2x mb-2"></i><br>
                    No users found
                </td>
            </tr>
        `);
        return;
    }
    
    users.forEach(user => {
        const roleText = user.is_admin ? 'Administrator' : 'User';
        const roleBadge = user.is_admin ? 'bg-danger' : 'bg-primary';
        
        const row = `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${roleBadge}">${roleText}</span></td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary btn-sm" 
                                onclick="editUser(${user.id}, '${user.username}', '${user.email}', ${user.is_admin})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm" 
                                onclick="deleteUser(${user.id}, '${user.username}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

/**
 * Edit task
 * @param {number} taskId - Task ID
 */
function editTask(taskId) {
    // Find task data from the current table
    $.ajax({
        url: 'api/tasks/view.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                const task = response.data.find(t => t.id == taskId);
                if (task) {
                    $('#taskId').val(task.id);
                    $('#taskTitle').val(task.title);
                    $('#taskDescription').val(task.description);
                    $('#taskUser').val(task.user_id);
                    $('#taskDeadline').val(task.deadline);
                    $('#taskStatus').val(task.status);
                    $('#taskStatusGroup').show();
                    $('#taskModalTitle').text('Edit Task');
                    $('#taskModal').modal('show');
                }
            }
        }
    });
}

/**
 * Delete task
 * @param {number} taskId - Task ID
 */
function deleteTask(taskId) {
    confirmAction('Are you sure you want to delete this task?', function() {
        $.ajax({
            url: 'api/tasks/delete.php',
            type: 'POST',
            data: { task_id: taskId },
            success: function(response) {
                if (response.success) {
                    showAlert('success', response.message);
                    loadTasks('#tasksTableBody', true);
                    loadDashboardStats();
                } else {
                    showAlert('danger', response.message);
                }
            },
            error: function() {
                showAlert('danger', 'Failed to delete task. Please try again.');
            }
        });
    });
}

/**
 * Edit user
 * @param {number} userId - User ID
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {boolean} isAdmin - Is admin
 */
function editUser(userId, username, email, isAdmin) {
    $('#userId').val(userId);
    $('#userUsername').val(username);
    $('#userEmail').val(email);
    $('#userIsAdmin').prop('checked', isAdmin);
    $('#userPassword').prop('required', false);
    $('#userModalTitle').text('Edit User');
    $('#userModal').modal('show');
}

/**
 * Delete user
 * @param {number} userId - User ID
 * @param {string} username - Username
 */
function deleteUser(userId, username) {
    confirmAction(`Are you sure you want to delete user "${username}"? This will also delete all their tasks.`, function() {
        $.ajax({
            url: 'api/users/delete.php',
            type: 'POST',
            data: { user_id: userId },
            success: function(response) {
                if (response.success) {
                    showAlert('success', response.message);
                    loadUsersTable();
                    loadUsers('#taskUser'); // Refresh task assignment dropdown
                    loadTasks('#tasksTableBody', true); // Refresh tasks table
                    loadDashboardStats();
                } else {
                    showAlert('danger', response.message);
                }
            },
            error: function() {
                showAlert('danger', 'Failed to delete user. Please try again.');
            }
        });
    });
}

