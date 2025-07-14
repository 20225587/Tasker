<?php


require_once '../../includes/db.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Check if user is logged in
requireLogin();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo jsonResponse(false, 'Method not allowed');
    exit();
}

try {
    if (isAdmin()) {
        // Admin can see all tasks with user information
        $stmt = $pdo->prepare("
            SELECT t.*, u.username, u.email 
            FROM tasks t 
            LEFT JOIN users u ON t.user_id = u.id 
            ORDER BY t.deadline ASC, t.id DESC
        ");
        $stmt->execute();
    } else {
        // Regular users can only see their own tasks
        $stmt = $pdo->prepare("
            SELECT t.*, u.username, u.email 
            FROM tasks t 
            LEFT JOIN users u ON t.user_id = u.id 
            WHERE t.user_id = ? 
            ORDER BY t.deadline ASC, t.id DESC
        ");
        $stmt->execute([getCurrentUserId()]);
    }
    
    $tasks = $stmt->fetchAll();
    
    // Format tasks for display
    $formattedTasks = [];
    foreach ($tasks as $task) {
        $formattedTasks[] = [
            'id' => $task['id'],
            'title' => $task['title'],
            'description' => $task['description'],
            'status' => $task['status'],
            'deadline' => $task['deadline'],
            'deadline_formatted' => formatDate($task['deadline']),
            'user_id' => $task['user_id'],
            'username' => $task['username'],
            'email' => $task['email'],
            'status_badge_class' => getStatusBadgeClass($task['status'])
        ];
    }
    
    echo jsonResponse(true, 'Tasks retrieved successfully', $formattedTasks);
    
} catch (PDOException $e) {
    error_log("View tasks error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

