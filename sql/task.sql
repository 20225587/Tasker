CREATE DATABASE IF NOT EXISTS task_manager;

USE task_manager;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  `deadline` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- Insert sample users
INSERT INTO `users` (`username`, `password`, `email`, `is_admin`) VALUES
('admin', 'admin1234', 'admin@taskmanager.com', 1),
('user', 'musa1234', 'user@taskmanager.com', 0),
('peter', 'musa1234', 'peter@example.com', 0),
('nesh', 'musa1234', 'nesh@example.com', 0);

-- Insert sample tasks
INSERT INTO `tasks` (`title`, `description`, `status`, `deadline`, `user_id`) VALUES
('Complete Project Documentation', 'Write comprehensive documentation for the new project including API docs and user manual', 'In Progress', '2025-07-20', 2),
('Review Code Changes', 'Review and approve pending pull requests in the development branch', 'Pending', '2025-07-18', 3),
('Database Optimization', 'Optimize database queries and improve performance for the user dashboard', 'Completed', '2025-07-15', 2),
('Client Meeting Preparation', 'Prepare presentation materials for the upcoming client meeting', 'Pending', '2025-07-22', 4),
('Bug Fix - Login Issue', 'Fix the reported login issue where users cannot access their accounts', 'In Progress', '2025-07-16', 3),
('Update User Interface', 'Implement the new UI design for the dashboard and improve user experience', 'Pending', '2025-07-25', 4);



