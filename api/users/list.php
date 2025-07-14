<?php


require_once '../../includes/db.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Check if user is admin
requireAdmin();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo jsonResponse(false, 'Method not allowed');
    exit();
}

try {
    // Get all users
    $stmt = $pdo->prepare("SELECT id, username, email, is_admin FROM users ORDER BY username");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    echo jsonResponse(true, 'Users retrieved successfully', $users);
    
} catch (PDOException $e) {
    error_log("List users error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

