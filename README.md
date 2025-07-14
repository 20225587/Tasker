# Task Management System

A comprehensive task management system built with PHP, MySQL, and vanilla JavaScript. This system allows administrators to manage users and tasks, while providing users with a clean interface to view and update their assigned tasks.

## Features

### Administrator Features
- **User Management**: Add, edit, and delete users
- **Task Management**: Assign tasks to users with deadlines, edit and delete tasks
- **Dashboard**: View statistics and manage all system data
- **User Registration**: Create new user accounts (regular users or administrators)

### User Features
- **Task Viewing**: View all assigned tasks with status and deadlines
- **Status Updates**: Update task status (Pending, In Progress, Completed)
- **Dashboard**: Personal task statistics and overview
- **Account Creation**: Self-registration for new users

### System Features
- **Authentication**: Secure login/logout system with session management
- **Email Notifications**: Automatic email notifications when tasks are assigned
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Vanilla JavaScript**: Modern, clean JavaScript without external dependencies
- **User Registration**: Complete signup system for both users and administrators

## Technology Stack

- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Icons**: Font Awesome 6
- **Email**: PHP mail() function

## Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

### Setup Instructions

1. **Database Setup**
   ```bash
   mysql -u root -p < sql/dump.sql
   ```

2. **Configuration**
   - Update database credentials in `includes/db.php`
   - Configure email settings in your PHP environment

3. **File Permissions**
   ```bash
   chmod -R 755 /path/to/project
   chown -R www-data:www-data /path/to/project
   ```

4. **Web Server Configuration**
   - Point your web server document root to the project directory
   - Ensure PHP is properly configured

## Usage

### Getting Started
1. Navigate to the application URL in your web browser
2. Click "Sign Up" to create a new account
3. Choose whether to create a regular user or administrator account
4. Login with your new credentials

### For Administrators
1. Access the admin dashboard after login
2. Use the "Users" tab to manage user accounts
3. Use the "Tasks" tab to view and manage all tasks
4. Click "Assign Task" to create new tasks for users

### For Users
1. Access the user dashboard after login
2. View all assigned tasks in the main table
3. Click status dropdowns to update task progress
4. Use the dashboard statistics to track your progress

## API Endpoints

### Authentication
- `POST /api/auth/login.php` - User login
- `POST /api/auth/logout.php` - User logout
- `POST /api/auth/signup.php` - User registration

### User Management (Admin only)
- `GET /api/users/list.php` - List all users
- `POST /api/users/add.php` - Add new user
- `POST /api/users/edit.php` - Edit user
- `POST /api/users/delete.php` - Delete user

### Task Management
- `GET /api/tasks/view.php` - View tasks
- `POST /api/tasks/assign.php` - Assign new task (Admin only)
- `POST /api/tasks/edit.php` - Edit task (Admin only)
- `POST /api/tasks/delete.php` - Delete task (Admin only)
- `POST /api/tasks/update_status.php` - Update task status

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed)
- `email` (Unique)
- `is_admin` (Boolean)

### Tasks Table
- `id` (Primary Key)
- `title`
- `description`
- `status` (Enum: Pending, In Progress, Completed)
- `deadline` (Date)
- `user_id` (Foreign Key)


## Security Features

- Password hashing using PHP's `password_hash()`
- SQL injection prevention using prepared statements
- Session-based authentication
- Input validation and sanitization
- CSRF protection considerations

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
├── index.php              # Login page
├── signup.php             # User registration page
├── admin.php              # Administrator dashboard
├── user.php               # User dashboard
├── api/                   # API endpoints
│   ├── auth/              # Authentication endpoints
│   ├── users/             # User management endpoints
│   └── tasks/             # Task management endpoints
├── includes/              # PHP includes
│   ├── db.php             # Database connection
│   ├── auth.php           # Authentication functions
│   └── functions.php      # Utility functions
├── css/                   # Stylesheets
├── js/                    # JavaScript files
├── sql/                   # Database files
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


