<?php


require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

// Logout user
logoutUser();

// Redirect to login page
header('Location: ../../index.php');
exit();
?>

