

// Utility functions
const Utils = {
    /**
     * Make AJAX requests using fetch API
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise} - Fetch promise
     */
    async ajax(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('AJAX Error:', error);
            throw error;
        }
    },

    /**
     * Convert FormData to URLSearchParams for POST requests
     * @param {FormData} formData - Form data
     * @returns {URLSearchParams} - URL encoded parameters
     */
    formDataToParams(formData) {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            params.append(key, value);
        }
        return params;
    },

    /**
     * Show alert message with animation
      @param {string} type 
      @param {string} message 
      @param {string} container 
     */
    showAlert(type, message, container = '#alertContainer') {
        const alertContainer = document.querySelector(container);
        if (!alertContainer) return;

        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Add smooth entrance animation
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(-20px)';
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertDiv);

        // Animate in
        requestAnimationFrame(() => {
            alertDiv.style.transition = 'all 0.3s ease-in-out';
            alertDiv.style.opacity = '1';
            alertDiv.style.transform = 'translateY(0)';
        });

        // Auto-hide success alerts after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.hideAlert(alertDiv);
            }, 3000);
        }

        // Add click handler for close button
        const closeBtn = alertDiv.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideAlert(alertDiv));
        }
    },

    /**
     * Hide alert with animation
     * @param {HTMLElement} alertElement - Alert element to hide
     */
    hideAlert(alertElement) {
        if (!alertElement) return;

        alertElement.style.transition = 'all 0.3s ease-in-out';
        alertElement.style.opacity = '0';
        alertElement.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
        }, 300);
    },

    /**
     * Format date for display
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'No deadline';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Get status badge HTML
     * @param {string} status - Task status
     * @returns {string} Badge HTML
     */
    getStatusBadge(status) {
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
    },

    /**
     * Get deadline class based on date
     * @param {string} deadline - Deadline date string
     * @returns {string} CSS class
     */
    getDeadlineClass(deadline) {
        if (!deadline) return '';
        
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'deadline-overdue';
        if (diffDays === 0) return 'deadline-today';
        if (diffDays <= 3) return 'deadline-upcoming';
        return '';
    },

    /**
     * Confirm action with user
     * @param {string} message - Confirmation message
     * @returns {boolean} - User confirmation
     */
    confirmAction(message) {
        return confirm(message);
    },

    /**
     * Reset form and clear validation
     * @param {HTMLFormElement} form - Form element
     */
    resetForm(form) {
        if (!form) return;
        
        form.reset();
        
        // Remove validation classes
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
        
        // Remove error messages
        const errorMessages = form.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(msg => msg.remove());
    },

    /**
     * Validate form field
     * @param {HTMLElement} field - Field element
     * @param {string} message - Error message
     * @returns {boolean} Is valid
     */
    validateField(field, message) {
        if (!field) return false;
        
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('is-invalid');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
            
            return false;
        } else {
            field.classList.remove('is-invalid');
            const errorMessage = field.parentNode.querySelector('.invalid-feedback');
            if (errorMessage) {
                errorMessage.remove();
            }
            return true;
        }
    },

    /**
     * Add loading state to button
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    },

    /**
     * Smooth scroll to element
     * @param {HTMLElement} element - Target element
     */
    smoothScrollTo(element) {
        if (!element) return;
        
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Task Management functionality
const TaskManager = {
    /**
     * Load tasks and populate table
     * @param {string} tableSelector - Table body selector
     * @param {boolean} isAdmin - Whether current user is admin
     */
    async loadTasks(tableSelector, isAdmin = false) {
        try {
            const response = await Utils.ajax('api/tasks/view.php');
            
            if (response.success) {
                this.populateTasksTable(tableSelector, response.data, isAdmin);
            } else {
                Utils.showAlert('danger', response.message);
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to load tasks. Please try again.');
        }
    },

    /**
     * Populate tasks table
     * @param {string} tableSelector - Table body selector
     * @param {array} tasks - Tasks array
     * @param {boolean} isAdmin - Whether current user is admin
     */
    populateTasksTable(tableSelector, tasks, isAdmin = false) {
        const tbody = document.querySelector(tableSelector);
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (tasks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="${isAdmin ? '7' : '5'}" class="text-center text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i><br>
                    No tasks found
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        tasks.forEach(task => {
            const row = this.createTaskRow(task, isAdmin);
            tbody.appendChild(row);
        });
    },

    /**
     * Create task row element
     * @param {Object} task - Task data
     * @param {boolean} isAdmin - Whether current user is admin
     * @returns {HTMLElement} Table row element
     */
    createTaskRow(task, isAdmin) {
        const row = document.createElement('tr');
        const deadlineClass = Utils.getDeadlineClass(task.deadline);
        const deadlineText = task.deadline_formatted;
        
        let rowHTML = `
            <td>${task.title}</td>
            <td class="d-none d-md-table-cell">${task.description || 'No description'}</td>
            <td>${Utils.getStatusBadge(task.status)}</td>
            <td class="${deadlineClass}">${deadlineText}</td>
        `;
        
        if (isAdmin) {
            rowHTML += `<td>${task.username || 'Unassigned'}</td>`;
        }
        
        // Actions column
        rowHTML += '<td>';
        
        // Status update dropdown
        rowHTML += `
            <select class="form-select form-select-sm status-select me-2" 
                    data-task-id="${task.id}">
                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;
        
        if (isAdmin) {
            rowHTML += `
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary btn-sm edit-task-btn" 
                            data-task-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm delete-task-btn" 
                            data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        rowHTML += '</td>';
        row.innerHTML = rowHTML;
        
        // Add event listeners
        this.addTaskRowEventListeners(row, task, isAdmin);
        
        return row;
    },

    /**
     * Add event listeners to task row
     * @param {HTMLElement} row - Table row element
     * @param {Object} task - Task data
     * @param {boolean} isAdmin - Whether current user is admin
     */
    addTaskRowEventListeners(row, task, isAdmin) {
        // Status change listener
        const statusSelect = row.querySelector('.status-select');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.updateTaskStatus(task.id, e.target.value);
            });
        }
        
        if (isAdmin) {
            // Edit button listener
            const editBtn = row.querySelector('.edit-task-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    window.AdminManager.editTask(task.id);
                });
            }
            
            // Delete button listener
            const deleteBtn = row.querySelector('.delete-task-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    window.AdminManager.deleteTask(task.id);
                });
            }
        }
    },

    /**
     * Update task status
     * @param {number} taskId - Task ID
     * @param {string} status - New status
     */
    async updateTaskStatus(taskId, status) {
        try {
            const formData = new FormData();
            formData.append('task_id', taskId);
            formData.append('status', status);
            
            const response = await Utils.ajax('api/tasks/update_status.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                // Reload tasks after a short delay
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                Utils.showAlert('danger', response.message);
                location.reload();
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to update task status. Please try again.');
            location.reload();
        }
    }
};

// User Management functionality
const UserManager = {
    /**
     * Load users for dropdown
     * @param {string} selectSelector - Select element selector
     */
    async loadUsers(selectSelector) {
        try {
            const response = await Utils.ajax('api/users/list.php');
            
            if (response.success) {
                const select = document.querySelector(selectSelector);
                if (!select) return;
                
                select.innerHTML = '<option value="">Select User</option>';
                
                response.data.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.username} (${user.email})`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to load users.');
        }
    }
};

// Initialize tooltips and other Bootstrap components
const BootstrapInit = {
    init() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
};

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    BootstrapInit.init();
    
    // Add smooth transitions to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.style.transition = 'all 0.2s ease-in-out';
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});

// Export utilities for global access
window.Utils = Utils;
window.TaskManager = TaskManager;
window.UserManager = UserManager;

