<?php


require_once '../../includes/db.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo jsonResponse(false, 'Method not allowed');
    exit();
}

// Get input data
$username = sanitizeInput($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    echo jsonResponse(false, 'Username and password are required');
    exit();
}

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && verifyPassword($password, $user['password'])) {
        // Login successful
        loginUser($user);
        
        // Determine redirect URL based on user role
        $redirectUrl = $user['is_admin'] ? 'admin.php' : 'user.php';
        
        echo jsonResponse(true, 'Login successful', ['redirect' => $redirectUrl]);
    } else {
        // Login failed
        echo jsonResponse(false, 'Invalid username or password');
    }
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

