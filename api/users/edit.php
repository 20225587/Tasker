<?php

require_once '../../includes/db.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Check if user is admin
requireAdmin();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo jsonResponse(false, 'Method not allowed');
    exit();
}

// Get input data
$user_id = intval($_POST['user_id'] ?? 0);
$username = sanitizeInput($_POST['username'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$is_admin = isset($_POST['is_admin']) ? 1 : 0;

// Validate input
if ($user_id <= 0 || empty($username) || empty($email)) {
    echo jsonResponse(false, 'User ID, username, and email are required');
    exit();
}

if (!validateEmail($email)) {
    echo jsonResponse(false, 'Invalid email format');
    exit();
}

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    
    if (!$stmt->fetch()) {
        echo jsonResponse(false, 'User not found');
        exit();
    }
    
    // Check if username or email already exists for other users
    $stmt = $pdo->prepare("SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?");
    $stmt->execute([$username, $email, $user_id]);
    
    if ($stmt->fetch()) {
        echo jsonResponse(false, 'Username or email already exists');
        exit();
    }
    
    // Prepare update query
    if (!empty($password)) {
        // Update with new password
        if (strlen($password) < 6) {
            echo jsonResponse(false, 'Password must be at least 6 characters long');
            exit();
        }
        
        $hashedPassword = hashPassword($password);
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, password = ?, is_admin = ? WHERE id = ?");
        $stmt->execute([$username, $email, $hashedPassword, $is_admin, $user_id]);
    } else {
        // Update without changing password
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, is_admin = ? WHERE id = ?");
        $stmt->execute([$username, $email, $is_admin, $user_id]);
    }
    
    echo jsonResponse(true, 'User updated successfully');
    
} catch (PDOException $e) {
    error_log("Edit user error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

