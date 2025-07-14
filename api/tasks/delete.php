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
$task_id = intval($_POST['task_id'] ?? 0);

// Validate input
if ($task_id <= 0) {
    echo jsonResponse(false, 'Valid task ID is required');
    exit();
}

try {
    // Check if task exists
    $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = ?");
    $stmt->execute([$task_id]);
    
    if (!$stmt->fetch()) {
        echo jsonResponse(false, 'Task not found');
        exit();
    }
    
    // Delete task
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$task_id]);
    
    echo jsonResponse(true, 'Task deleted successfully');
    
} catch (PDOException $e) {
    error_log("Delete task error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

