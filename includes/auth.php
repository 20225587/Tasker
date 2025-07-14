<?php


// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if user is logged in
 * @return bool True if user is logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Check if current user is admin
 * @return bool True if user is admin, false otherwise
 */
function isAdmin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1;
}

/**
 * Require user to be logged in, redirect to login if not
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: index.php');
        exit();
    }
}

/**
 * Require user to be admin, redirect to user dashboard if not
 */
function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        header('Location: user.php');
        exit();
    }
}

/**
 * Login user and create session
 * @param array $user User data from database
 */
function loginUser($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['is_admin'] = $user['is_admin'];
}

/**
 * Logout user and destroy session
 */
function logoutUser() {
    session_unset();
    session_destroy();
}

/**
 * Get current user ID
 * @return int|null User ID or null if not logged in
 */
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}

/**
 * Get current username
 * @return string|null Username or null if not logged in
 */
function getCurrentUsername() {
    return isset($_SESSION['username']) ? $_SESSION['username'] : null;
}
?>

