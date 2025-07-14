

/**
 * Show alert message
 * @param {string} type - 
 * @param {string} message - 
 * @param {string} container -
 */
function showAlert(type, message, container = '#alertContainer') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $(container).html(alertHtml);
    
    // Auto-hide success alerts after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            $(container + ' .alert').alert('close');
        }, 3000);
    }
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Get status badge HTML
 * @param {string} status - Task status
 * @returns {string} Badge HTML
 */
function getStatusBadge(status) {
    let badgeClass = '';
    switch (status) {
        case 'Pending':
            badgeClass = 'bg-warning text-dark';
            break;
        case 'In Progress':
            badgeClass = 'bg-info';
            break;
        case 'Completed':
            badgeClass = 'bg-success';
            break;
        default:
            badgeClass = 'bg-secondary';
    }
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

/**
 * Get deadline class based on date
 * @param {string} deadline - Deadline date string
 * @returns {string} CSS class
 */
function getDeadlineClass(deadline) {
    if (!deadline) return '';
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'deadline-overdue';
    if (diffDays === 0) return 'deadline-today';
    if (diffDays <= 3) return 'deadline-upcoming';
    return '';
}

/**
 * Confirm action with user
 * @param {string} message - Confirmation message
 * @param {function} callback - Callback function if confirmed
 */
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

/**
 * Load tasks and populate table
 * @param {string} tableSelector - Table body selector
 * @param {boolean} isAdmin - Whether current user is admin
 */
function loadTasks(tableSelector, isAdmin = false) {
    $.ajax({
        url: 'api/tasks/view.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                populateTasksTable(tableSelector, response.data, isAdmin);
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
 * Populate tasks table
 * @param {string} tableSelector - Table body selector
 * @param {array} tasks - Tasks array
 * @param {boolean} isAdmin - Whether current user is admin
 */
function populateTasksTable(tableSelector, tasks, isAdmin = false) {
    const tbody = $(tableSelector);
    tbody.empty();
    
    if (tasks.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="${isAdmin ? '7' : '5'}" class="text-center text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i><br>
                    No tasks found
                </td>
            </tr>
        `);
        return;
    }
    
    tasks.forEach(task => {
        const deadlineClass = getDeadlineClass(task.deadline);
        const deadlineText = task.deadline_formatted;
        
        let row = `
            <tr>
                <td>${task.title}</td>
                <td class="d-none d-md-table-cell">${task.description || 'No description'}</td>
                <td>${getStatusBadge(task.status)}</td>
                <td class="${deadlineClass}">${deadlineText}</td>
        `;
        
        if (isAdmin) {
            row += `<td>${task.username || 'Unassigned'}</td>`;
        }
        
        // Actions column
        row += '<td>';
        
        // Status update dropdown
        row += `
            <select class="form-select form-select-sm status-select me-2" 
                    onchange="updateTaskStatus(${task.id}, this.value)">
                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;
        
        if (isAdmin) {
            row += `
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary btn-sm" 
                            onclick="editTask(${task.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" 
                            onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        row += '</td></tr>';
        tbody.append(row);
    });
}

/**
 * Update task status
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
                    location.reload();
                }, 1000);
            } else {
                showAlert('danger', response.message);
                // Reload to reset the dropdown
                location.reload();
            }
        },
        error: function() {
            showAlert('danger', 'Failed to update task status. Please try again.');
            location.reload();
        }
    });
}

/**
 * Load users for dropdown (admin only)
 * @param {string} selectSelector - Select element selector
 */
function loadUsers(selectSelector) {
    $.ajax({
        url: 'api/users/list.php',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                const select = $(selectSelector);
                select.empty();
                select.append('<option value="">Select User</option>');
                
                response.data.forEach(user => {
                    select.append(`<option value="${user.id}">${user.username} (${user.email})</option>`);
                });
            }
        },
        error: function() {
            showAlert('danger', 'Failed to load users.');
        }
    });
}

/**
 * Reset form and clear validation
 * @param {string} formSelector - Form selector
 */
function resetForm(formSelector) {
    $(formSelector)[0].reset();
    $(formSelector + ' .is-invalid').removeClass('is-invalid');
    $(formSelector + ' .invalid-feedback').remove();
}

/**
 * Validate form field
 * @param {string} fieldSelector - Field selector
 * @param {string} message - Error message
 * @returns {boolean} Is valid
 */
function validateField(fieldSelector, message) {
    const field = $(fieldSelector);
    const value = field.val().trim();
    
    if (!value) {
        field.addClass('is-invalid');
        if (!field.next('.invalid-feedback').length) {
            field.after(`<div class="invalid-feedback">${message}</div>`);
        }
        return false;
    } else {
        field.removeClass('is-invalid');
        field.next('.invalid-feedback').remove();
        return true;
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize tooltips when document is ready
$(document).ready(function() {
    initializeTooltips();
});

