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
$title = sanitizeInput($_POST['title'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');
$deadline = sanitizeInput($_POST['deadline'] ?? '');
$user_id = intval($_POST['user_id'] ?? 0);
$status = sanitizeInput($_POST['status'] ?? '');

// Validate input
if ($task_id <= 0 || empty($title) || $user_id <= 0) {
    echo jsonResponse(false, 'Task ID, title, and user are required');
    exit();
}

// Validate status
$validStatuses = ['Pending', 'In Progress', 'Completed'];
if (!in_array($status, $validStatuses)) {
    echo jsonResponse(false, 'Invalid status');
    exit();
}

// Validate deadline format if provided
if (!empty($deadline)) {
    $deadlineDate = DateTime::createFromFormat('Y-m-d', $deadline);
    if (!$deadlineDate || $deadlineDate->format('Y-m-d') !== $deadline) {
        echo jsonResponse(false, 'Invalid deadline format. Use YYYY-MM-DD');
        exit();
    }
}

try {
    // Check if task exists
    $stmt = $pdo->prepare("SELECT id FROM tasks WHERE id = ?");
    $stmt->execute([$task_id]);
    
    if (!$stmt->fetch()) {
        echo jsonResponse(false, 'Task not found');
        exit();
    }
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    
    if (!$stmt->fetch()) {
        echo jsonResponse(false, 'User not found');
        exit();
    }
    
    // Update task
    $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ?, deadline = ?, user_id = ?, status = ? WHERE id = ?");
    $stmt->execute([$title, $description, $deadline ?: null, $user_id, $status, $task_id]);
    
    echo jsonResponse(true, 'Task updated successfully');
    
} catch (PDOException $e) {
    error_log("Edit task error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

