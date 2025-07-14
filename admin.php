<?php


require_once 'includes/auth.php';

// Check if user is admin
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Task Manager</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/vanilla-enhancements.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <i class="fas fa-tasks me-2"></i>Task Manager
            </a>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text me-3">
                    <i class="fas fa-user-shield me-1"></i>
                    Welcome, <?php echo getCurrentUsername(); ?>
                </span>
                <a class="nav-link" href="api/auth/logout.php">
                    <i class="fas fa-sign-out-alt me-1"></i>Logout
                </a>
            </div>
        </div>
    </nav>

    <div class="container-fluid mt-4">
        <!-- Alert Container -->
        <div id="alertContainer"></div>
        
        <!-- Dashboard Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card dashboard-card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Total Users</h5>
                                <h2 id="totalUsers">-</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-users fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card dashboard-card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Total Tasks</h5>
                                <h2 id="totalTasks">-</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-tasks fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card dashboard-card bg-warning text-dark">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Pending Tasks</h5>
                                <h2 id="pendingTasks">-</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-clock fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card dashboard-card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">Completed Tasks</h5>
                                <h2 id="completedTasks">-</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-check-circle fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="adminTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="tasks-tab" data-bs-toggle="tab" data-bs-target="#tasks" type="button" role="tab">
                    <i class="fas fa-tasks me-2"></i>Tasks
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab">
                    <i class="fas fa-users me-2"></i>Users
                </button>
            </li>
        </ul>

        <div class="tab-content" id="adminTabsContent">
            <!-- Tasks Tab -->
            <div class="tab-pane fade show active" id="tasks" role="tabpanel">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Task Management</h5>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModal">
                            <i class="fas fa-plus me-2"></i>Assign Task
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th class="d-none d-md-table-cell">Description</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Assigned To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="tasksTableBody">
                                    <!-- Tasks will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Tab -->
            <div class="tab-pane fade" id="users" role="tabpanel">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">User Management</h5>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userModal">
                            <i class="fas fa-plus me-2"></i>Add User
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="usersTableBody">
                                    <!-- Users will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Task Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="taskModalTitle">Assign New Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="taskForm">
                    <div class="modal-body">
                        <input type="hidden" id="taskId" name="task_id">
                        
                        <div class="mb-3">
                            <label for="taskTitle" class="form-label">Title *</label>
                            <input type="text" class="form-control" id="taskTitle" name="title" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="taskDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="taskDescription" name="description" rows="3"></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="taskUser" class="form-label">Assign To *</label>
                            <select class="form-select" id="taskUser" name="user_id" required>
                                <!-- Users will be loaded here -->
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="taskDeadline" class="form-label">Deadline</label>
                            <input type="date" class="form-control" id="taskDeadline" name="deadline">
                        </div>
                        
                        <div class="mb-3" id="taskStatusGroup" style="display: none;">
                            <label for="taskStatus" class="form-label">Status</label>
                            <select class="form-select" id="taskStatus" name="status">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userModalTitle">Add New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="userForm">
                    <div class="modal-body">
                        <input type="hidden" id="userId" name="user_id">
                        
                        <div class="mb-3">
                            <label for="userUsername" class="form-label">Username *</label>
                            <input type="text" class="form-control" id="userUsername" name="username" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="userEmail" class="form-label">Email *</label>
                            <input type="email" class="form-control" id="userEmail" name="email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="userPassword" class="form-label">Password *</label>
                            <input type="password" class="form-control" id="userPassword" name="password" required>
                            <div class="form-text">Minimum 6 characters</div>
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="userIsAdmin" name="is_admin">
                            <label class="form-check-label" for="userIsAdmin">
                                Administrator privileges
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Vanilla JavaScript -->
    <script src="js/vanilla-script.js"></script>
    <script src="js/vanilla-admin.js"></script>
</body>
</html>

