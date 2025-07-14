<?php


require_once 'includes/auth.php';

// Redirect if already logged in
if (isLoggedIn()) {
    if (isAdmin()) {
        header('Location: admin.php');
    } else {
        header('Location: user.php');
    }
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager - Login</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/vanilla-enhancements.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm mt-5">
                    <div class="card-body">
                        <div class="text-center mb-4">
                            <i class="fas fa-tasks fa-3x text-primary mb-3"></i>
                            <h2 class="card-title">Task Manager</h2>
                            <p class="text-muted">Please sign in to your account</p>
                        </div>
                        
                        <!-- Login Form -->
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    <input type="text" class="form-control" id="username" name="username" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    <input type="password" class="form-control" id="password" name="password" required>
                                </div>
                            </div>
                            
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-sign-in-alt me-2"></i>Sign In
                                </button>
                            </div>
                        </form>
                        
                        <!-- Alert for messages -->
                        <div id="alertContainer" class="mt-3"></div>
                        
                        <!-- Signup Link -->
                        <div class="text-center mt-4">
                            <p class="mb-0">
                                Don't have an account? 
                                <a href="signup.php" class="text-decoration-none">
                                    <i class="fas fa-user-plus me-1"></i>
                                    Sign Up
                                </a>
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Vanilla JavaScript -->
    <script src="js/vanilla-script.js"></script>
    <script src="js/vanilla-login.js"></script>
</body>
</html>

