let currentTaskId = null;

$(document).ready(function() {
    // Load initial data
    loadUserTasks();
    
    // Auto-refresh tasks every 30 seconds
    setInterval(loadUserTasks, 30000);
});

/**
 * Load user tasks and update dashboard
 */
function loadUserTasks() {
    $.ajax({
        url: 'api/tasks/view.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                const tasks = response.data;
                updateDashboardStats(tasks);
                populateUserTasksTable(tasks);
            } else {
                showAlert('danger', response.message);
            }
        },
        error: function() {
            showAlert('danger', 'Failed to load tasks. Please try again.');
        }
    });
}

/**
 * Update dashboard statistics
 * @param {array} tasks - Tasks array
 */
function updateDashboardStats(tasks) {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    
    $('#totalTasks').text(totalTasks);
    $('#pendingTasks').text(pendingTasks);
    $('#inProgressTasks').text(inProgressTasks);
    $('#completedTasks').text(completedTasks);
}

/**
 * Populate user tasks table
 * @param {array} tasks - Tasks array
 */
function populateUserTasksTable(tasks) {
    const tbody = $('#tasksTableBody');
    tbody.empty();
    
    if (tasks.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3"></i><br>
                    <h5>No tasks assigned</h5>
                    <p>You don't have any tasks assigned to you yet.</p>
                </td>
            </tr>
        `);
        return;
    }
    
    tasks.forEach(task => {
        const deadlineClass = getDeadlineClass(task.deadline);
        const deadlineText = task.deadline_formatted;
        
        // Truncate description for table display
        const shortDescription = task.description && task.description.length > 50 
            ? task.description.substring(0, 50) + '...' 
            : (task.description || 'No description');
        
        const row = `
            <tr>
                <td>
                    <strong>${task.title}</strong>
                    ${task.description ? `<br><small class="text-muted d-md-none">${shortDescription}</small>` : ''}
                </td>
                <td class="d-none d-md-table-cell">${task.description || 'No description'}</td>
                <td>${getStatusBadge(task.status)}</td>
                <td class="${deadlineClass}">${deadlineText}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-info btn-sm" 
                                onclick="viewTaskDetails(${task.id}, '${task.title}', '${task.description || ''}', '${task.status}', '${task.deadline_formatted}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <select class="form-select form-select-sm status-select" 
                                onchange="updateTaskStatus(${task.id}, this.value)">
                            <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

/**
 * View task details in modal
 * @param {number} taskId - Task ID
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} status - Task status
 * @param {string} deadline - Task deadline
 */
function viewTaskDetails(taskId, title, description, status, deadline) {
    currentTaskId = taskId;
    
    $('#detailTitle').text(title);
    $('#detailDescription').text(description || 'No description provided');
    $('#detailStatus').html(getStatusBadge(status));
    $('#detailDeadline').text(deadline);
    $('#newStatus').val(status);
    
    $('#taskDetailsModal').modal('show');
}

/**
 * Update task status from modal
 */
function updateTaskStatusFromModal() {
    if (!currentTaskId) return;
    
    const newStatus = $('#newStatus').val();
    
    $.ajax({
        url: 'api/tasks/update_status.php',
        type: 'POST',
        data: {
            task_id: currentTaskId,
            status: newStatus
        },
        success: function(response) {
            if (response.success) {
                showAlert('success', response.message);
                $('#taskDetailsModal').modal('hide');
                loadUserTasks(); // Refresh the tasks
            } else {
                showAlert('danger', response.message, '#taskDetailsModal .modal-body');
            }
        },
        error: function() {
            showAlert('danger', 'Failed to update task status. Please try again.', '#taskDetailsModal .modal-body');
        }
    });
}

/**
 * Override the global updateTaskStatus function for user dashboard
 * @param {number} taskId - Task ID
 * @param {string} status - New status
 */
function updateTaskStatus(taskId, status) {
    $.ajax({
        url: 'api/tasks/update_status.php',
        type: 'POST',
        data: {
            task_id: taskId,
            status: status
        },
        success: function(response) {
            if (response.success) {
                showAlert('success', response.message);
                // Reload tasks after a short delay
                setTimeout(() => {
                    loadUserTasks();
                }, 1000);
            } else {
                showAlert('danger', response.message);
                // Reload to reset the dropdown
                loadUserTasks();
            }
        },
        error: function() {
            showAlert('danger', 'Failed to update task status. Please try again.');
            loadUserTasks();
        }
    });
}

