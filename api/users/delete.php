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

// Validate input
if ($user_id <= 0) {
    echo jsonResponse(false, 'Valid user ID is required');
    exit();
}

// Prevent admin from deleting themselves
if ($user_id == getCurrentUserId()) {
    echo jsonResponse(false, 'You cannot delete your own account');
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
    
    // Delete user (tasks will be deleted automatically due to foreign key constraint)
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    
    echo jsonResponse(true, 'User deleted successfully');
    
} catch (PDOException $e) {
    error_log("Delete user error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

