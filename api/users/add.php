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
$username = sanitizeInput($_POST['username'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$is_admin = isset($_POST['is_admin']) ? 1 : 0;

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    echo jsonResponse(false, 'All fields are required');
    exit();
}

if (!validateEmail($email)) {
    echo jsonResponse(false, 'Invalid email format');
    exit();
}

if (strlen($password) < 6) {
    echo jsonResponse(false, 'Password must be at least 6 characters long');
    exit();
}

try {
    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->fetch()) {
        echo jsonResponse(false, 'Username or email already exists');
        exit();
    }
    
    // Hash password
    $hashedPassword = hashPassword($password);
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword, $is_admin]);
    
    echo jsonResponse(true, 'User added successfully');
    
} catch (PDOException $e) {
    error_log("Add user error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

