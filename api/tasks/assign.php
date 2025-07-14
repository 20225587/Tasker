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
$title = sanitizeInput($_POST['title'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');
$deadline = sanitizeInput($_POST['deadline'] ?? '');
$user_id = intval($_POST['user_id'] ?? 0);

// Validate input
if (empty($title) || $user_id <= 0) {
    echo jsonResponse(false, 'Title and user are required');
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
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, email, username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo jsonResponse(false, 'User not found');
        exit();
    }
    
    // Insert new task
    $stmt = $pdo->prepare("INSERT INTO tasks (title, description, deadline, user_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $description, $deadline ?: null, $user_id]);
    
    // Send email notification
    $emailSubject = "New Task Assigned: " . $title;
    $emailMessage = "
    <html>
    <body>
        <h2>New Task Assigned</h2>
        <p>Hello {$user['username']},</p>
        <p>A new task has been assigned to you:</p>
        <ul>
            <li><strong>Title:</strong> {$title}</li>
            <li><strong>Description:</strong> " . ($description ?: 'No description provided') . "</li>
            <li><strong>Deadline:</strong> " . ($deadline ? formatDate($deadline) : 'No deadline') . "</li>
        </ul>
        <p>Please log in to the task management system to view and manage your tasks.</p>
        <p>Best regards,<br>Task Management System</p>
    </body>
    </html>
    ";
    
    // Send email (in production, consider using a proper email service)
    sendEmail($user['email'], $emailSubject, $emailMessage);
    
    echo jsonResponse(true, 'Task assigned successfully and notification sent');
    
} catch (PDOException $e) {
    error_log("Assign task error: " . $e->getMessage());
    echo jsonResponse(false, 'An error occurred. Please try again.');
}
?>

