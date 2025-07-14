<?php


/**
 
 * @param string 
 * @return string 
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Validate email format
 * @param string $email Email to validate
 * @return bool True if valid email, false otherwise
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Hash password securely
 * @param string $password Plain text password
 * @return string Hashed password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verify password against hash
 * @param string $password Plain text password
 * @param string $hash Hashed password
 * @return bool True if password matches, false otherwise
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Generate JSON response
 * @param bool $success Success status
 * @param string $message Response message
 * @param array $data Additional data (optional)
 * @return string JSON response
 */
function jsonResponse($success, $message, $data = []) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if (!empty($data)) {
        $response['data'] = $data;
    }
    
    header('Content-Type: application/json');
    return json_encode($response);
}

/**
 * Format date for display
 * @param string $date Date string
 * @return string Formatted date
 */
function formatDate($date) {
    if (empty($date)) return 'No deadline';
    return date('M d, Y', strtotime($date));
}

/**
 * Get status badge class for Bootstrap
 * @param string $status Task status
 * @return string Bootstrap badge class
 */
function getStatusBadgeClass($status) {
    switch ($status) {
        case 'Pending':
            return 'badge-warning';
        case 'In Progress':
            return 'badge-info';
        case 'Completed':
            return 'badge-success';
        default:
            return 'badge-secondary';
    }
}

/**
 * Send email notification
 * @param string 
 * @param string 
 * @param string 
 * @return bool 
 */
function sendEmail($to, $subject, $message) {
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Task Manager <noreply@taskmanager.com>" . "\r\n";
    
  
    return mail($to, $subject, $message, $headers);
}
?>

