<?php


require_once 'includes/auth.php';

// Check if user is logged in
requireLogin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Tasks - Task Manager</title>
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
                    <i class="fas fa-user me-1"></i>
                    Welcome, <?php echo getCurrentUsername(); ?>
                </span>
                <?php if (isAdmin()): ?>
                <a class="nav-link me-3" href="admin.php">
                    <i class="fas fa-cog me-1"></i>Admin Panel
                </a>
                <?php endif; ?>
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
                <div class="card dashboard-card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">My Tasks</h5>
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
                                <h5 class="card-title">Pending</h5>
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
                <div class="card dashboard-card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5 class="card-title">In Progress</h5>
                                <h2 id="inProgressTasks">-</h2>
                            </div>
                            <div class="align-self-center">
                                <i class="fas fa-spinner fa-2x"></i>
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
                                <h5 class="card-title">Completed</h5>
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

        <!-- Tasks Table -->
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-list me-2"></i>My Tasks
                </h5>
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
        
        <!-- Task Details Modal -->
        <div class="modal fade" id="taskDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Task Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Title:</label>
                            <p id="detailTitle" class="mb-0"></p>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Description:</label>
                            <p id="detailDescription" class="mb-0"></p>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Current Status:</label>
                            <p id="detailStatus" class="mb-0"></p>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Deadline:</label>
                            <p id="detailDeadline" class="mb-0"></p>
                        </div>
                        <div class="mb-3">
                            <label for="newStatus" class="form-label fw-bold">Update Status:</label>
                            <select class="form-select" id="newStatus">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="updateTaskStatusFromModal()">Update Status</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Vanilla JavaScript -->
    <script src="js/vanilla-script.js"></script>
    <script src="js/vanilla-user.js"></script>
</body>
</html>

