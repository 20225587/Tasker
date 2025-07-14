<?php


require_once '../../includes/db.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Check if user is logged in
requireLogin();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo jsonResponse(false, 'Method not allowed');
    exit();
}

// Get input data
$task_id = intval($_POST['task_id'] ?? 0);
$status = sanitizeInput($_POST['status'] ?? '');

// Validate input
if ($task_id <= 0 || empty($status)) {
    echo jsonResponse(false, 'Task ID and status are required');
    exit();
}

// Validate status
$validStatuses = ['Pending', 'In Progress', 'Completed'];
if (!in_array($status, $validStatuses)) {
    echo jsonResponse(false, 'Invalid status');
    exit();
}

try {
    // Check if task exists and belongs to the user (or user is admin)
    if (isAdmin()) {
        $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = ?");
        $stmt->execute([$task_id]);
    } else {
        $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
        $stmt->execute([$task_id, getCurrentUserId()]);
    }
    
    if (!$stmt->fetch()) {
        echo jsonResponse(false, 'Task not found or access denied');
        exit();
    }
    
    // Update task status
    $stmt = $pdo->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $stmt->execute([$status, $task_id]);
    
    echo jsonResponse(true, 'Task status updated successfully');
    
} catch (PDOException $e) {
    error_log("Update task status error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

