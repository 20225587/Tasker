

const UserDashboard = {
    currentTaskId: null,
    refreshInterval: null,

    // Initialize user dashboard
    init() {
        this.loadUserTasks();
        this.setupEventListeners();
        this.startAutoRefresh();
    },

    // Setup event listeners
    setupEventListeners() {
        // Modal event listeners
        const taskDetailsModal = document.getElementById('taskDetailsModal');
        if (taskDetailsModal) {
            const updateBtn = taskDetailsModal.querySelector('.btn-primary');
            if (updateBtn) {
                updateBtn.addEventListener('click', this.updateTaskStatusFromModal.bind(this));
            }
        }
    },

    // Start auto-refresh
    startAutoRefresh() {
        // Auto-refresh tasks every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadUserTasks();
        }, 30000);
    },

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    },

    // Load user tasks and update dashboard
    async loadUserTasks() {
        try {
            const response = await Utils.ajax('api/tasks/view.php');
            
            if (response.success) {
                const tasks = response.data;
                this.updateDashboardStats(tasks);
                this.populateUserTasksTable(tasks);
            } else {
                Utils.showAlert('danger', response.message);
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to load tasks. Please try again.');
        }
    },

    // Update dashboard statistics with animations
    updateDashboardStats(tasks) {
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
        const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
        const completedTasks = tasks.filter(task => task.status === 'Completed').length;
        
        this.animateStatUpdate('totalTasks', totalTasks);
        this.animateStatUpdate('pendingTasks', pendingTasks);
        this.animateStatUpdate('inProgressTasks', inProgressTasks);
        this.animateStatUpdate('completedTasks', completedTasks);
    },

    // Animate stat update
    animateStatUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            // Add pulse animation
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.2s ease-in-out';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                this.countUpAnimation(element, currentValue, newValue, 300);
            }, 100);
        }
    },

    // Count up animation
    countUpAnimation(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (difference * easeOutQuart));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    },

    // Populate user tasks table
    populateUserTasksTable(tasks) {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;
        
        // Clear existing content
        tbody.innerHTML = '';
        
        if (tasks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="text-center text-muted">
                    <div class="py-4">
                        <i class="fas fa-inbox fa-3x mb-3 text-muted"></i>
                        <h5 class="text-muted">No tasks assigned</h5>
                        <p class="text-muted">You don't have any tasks assigned to you yet.</p>
                    </div>
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        tasks.forEach((task, index) => {
            const row = this.createUserTaskRow(task, index);
            tbody.appendChild(row);
        });
    },

    // Create user task row
    createUserTaskRow(task, index) {
        const row = document.createElement('tr');
        const deadlineClass = Utils.getDeadlineClass(task.deadline);
        const deadlineText = task.deadline_formatted;
        
        // Truncate description for table display
        const shortDescription = task.description && task.description.length > 50 
            ? task.description.substring(0, 50) + '...' 
            : (task.description || 'No description');
        
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="task-priority-indicator me-2" data-status="${task.status}"></div>
                    <div>
                        <strong>${task.title}</strong>
                        <div class="d-md-none">
                            <small class="text-muted">${shortDescription}</small>
                        </div>
                    </div>
                </div>
            </td>
            <td class="d-none d-md-table-cell">${task.description || 'No description'}</td>
            <td>${Utils.getStatusBadge(task.status)}</td>
            <td class="${deadlineClass}">
                <i class="fas fa-calendar-alt me-1"></i>
                ${deadlineText}
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-info btn-sm view-task-btn" 
                            data-task-id="${task.id}"
                            data-title="${task.title}"
                            data-description="${task.description || ''}"
                            data-status="${task.status}"
                            data-deadline="${task.deadline_formatted}"
                            title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <select class="form-select form-select-sm status-select" 
                            data-task-id="${task.id}"
                            title="Update Status">
                        <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
            </td>
        `;
        
        // Add fade-in animation
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        // Add event listeners
        this.addUserTaskRowEventListeners(row);
        
        // Animate in with delay
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease-in-out';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
        
        return row;
    },

    // Add event listeners to user task row
    addUserTaskRowEventListeners(row) {
        // View button listener
        const viewBtn = row.querySelector('.view-task-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                this.viewTaskDetails(
                    btn.dataset.taskId,
                    btn.dataset.title,
                    btn.dataset.description,
                    btn.dataset.status,
                    btn.dataset.deadline
                );
            });
        }
        
        // Status change listener
        const statusSelect = row.querySelector('.status-select');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.updateTaskStatus(e.target.dataset.taskId, e.target.value);
            });
        }
    },

    // View task details in modal
    viewTaskDetails(taskId, title, description, status, deadline) {
        this.currentTaskId = taskId;
        
        // Populate modal
        document.getElementById('detailTitle').textContent = title;
        document.getElementById('detailDescription').textContent = description || 'No description provided';
        document.getElementById('detailStatus').innerHTML = Utils.getStatusBadge(status);
        document.getElementById('detailDeadline').textContent = deadline;
        document.getElementById('newStatus').value = status;
        
        // Show modal with animation
        const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
        modal.show();
        
        // Add entrance animation to modal content
        const modalDialog = document.querySelector('#taskDetailsModal .modal-dialog');
        if (modalDialog) {
            modalDialog.style.transform = 'scale(0.8)';
            modalDialog.style.transition = 'transform 0.3s ease-in-out';
            
            setTimeout(() => {
                modalDialog.style.transform = 'scale(1)';
            }, 100);
        }
    },

    // Update task status from modal
    async updateTaskStatusFromModal() {
        if (!this.currentTaskId) return;
        
        const newStatus = document.getElementById('newStatus').value;
        const updateBtn = document.querySelector('#taskDetailsModal .btn-primary');
        
        Utils.setButtonLoading(updateBtn, true);
        
        try {
            const formData = new FormData();
            formData.append('task_id', this.currentTaskId);
            formData.append('status', newStatus);
            
            const response = await Utils.ajax('api/tasks/update_status.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal'));
                modal.hide();
                
                // Reload tasks
                this.loadUserTasks();
            } else {
                Utils.showAlert('danger', response.message, '#taskDetailsModal .modal-body');
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to update task status. Please try again.', '#taskDetailsModal .modal-body');
        } finally {
            Utils.setButtonLoading(updateBtn, false);
        }
    },

    // Update task status (from dropdown)
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
                
                // Add visual feedback
                const statusSelect = document.querySelector(`[data-task-id="${taskId}"]`);
                if (statusSelect) {
                    statusSelect.style.transform = 'scale(1.05)';
                    statusSelect.style.transition = 'transform 0.2s ease-in-out';
                    
                    setTimeout(() => {
                        statusSelect.style.transform = 'scale(1)';
                    }, 200);
                }
                
                // Reload tasks after a short delay
                setTimeout(() => {
                    this.loadUserTasks();
                }, 1000);
            } else {
                Utils.showAlert('danger', response.message);
                this.loadUserTasks();
            }
        } catch (error) {
            Utils.showAlert('danger', 'Failed to update task status. Please try again.');
            this.loadUserTasks();
        }
    },

    // Cleanup when leaving page
    cleanup() {
        this.stopAutoRefresh();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UserDashboard.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    UserDashboard.cleanup();
});

// Export for global access
window.UserDashboard = UserDashboard;

