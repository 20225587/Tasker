

const SignupManager = {
    // Initialize signup page
    init() {
        this.setupEventListeners();
        this.addVisualEnhancements();
    },

    // Setup event listeners
    setupEventListeners() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));
        }

        // Add real-time validation
        const fields = ['username', 'email', 'password', 'confirm_password'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            }
        });

        // Password confirmation validation
        const confirmPassword = document.getElementById('confirm_password');
        const password = document.getElementById('password');
        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
            
            password.addEventListener('input', () => {
                if (confirmPassword.value) {
                    this.validatePasswordMatch();
                }
            });
        }
    },

    // Add visual enhancements
    addVisualEnhancements() {
        // Add floating label effect
        const inputGroups = document.querySelectorAll('.input-group input');
        inputGroups.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Add card entrance animation
        const card = document.querySelector('.card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }

        // Add icon rotation on hover
        const taskIcon = document.querySelector('.fa-tasks');
        if (taskIcon) {
            taskIcon.addEventListener('mouseenter', () => {
                taskIcon.style.transform = 'rotate(360deg)';
                taskIcon.style.transition = 'transform 0.6s ease-in-out';
            });
            
            taskIcon.addEventListener('mouseleave', () => {
                taskIcon.style.transform = 'rotate(0deg)';
            });
        }
    },

    // Handle signup form submission
    async handleSignupSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate form
        if (!this.validateForm(form)) {
            this.shakeForm(form);
            return;
        }
        
        // Show loading state
        Utils.setButtonLoading(submitBtn, true);
        
        try {
            const formData = new FormData(form);
            const response = await Utils.ajax('api/auth/signup.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                
                // Add success animation
                this.addSuccessAnimation(form);
                
                // Clear form
                form.reset();
                
                // Redirect to login after delay
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 2000);
            } else {
                Utils.showAlert('danger', response.message);
                this.shakeForm(form);
            }
        } catch (error) {
            Utils.showAlert('danger', 'An error occurred. Please try again.');
            this.shakeForm(form);
        } finally {
            Utils.setButtonLoading(submitBtn, false);
        }
    },

    // Validate entire form
    validateForm(form) {
        const username = form.querySelector('#username');
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        const confirmPassword = form.querySelector('#confirm_password');
        
        let isValid = true;
        
        // Validate username
        if (!this.validateField(username)) {
            isValid = false;
        }
        
        // Validate email
        if (!this.validateField(email)) {
            isValid = false;
        } else if (!this.isValidEmail(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!this.validateField(password)) {
            isValid = false;
        } else if (password.value.length < 6) {
            this.showFieldError(password, 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        // Validate password confirmation
        if (!this.validateField(confirmPassword)) {
            isValid = false;
        } else if (!this.validatePasswordMatch()) {
            isValid = false;
        }
        
        return isValid;
    },

    // Validate individual field
    validateField(field) {
        if (!field) return false;
        
        const value = field.value.trim();
        let message = '';
        
        switch (field.id) {
            case 'username':
                if (!value) {
                    message = 'Username is required';
                } else if (value.length < 3) {
                    message = 'Username must be at least 3 characters long';
                } else if (value.length > 50) {
                    message = 'Username must be less than 50 characters';
                }
                break;
            case 'email':
                if (!value) {
                    message = 'Email is required';
                }
                break;
            case 'password':
                if (!value) {
                    message = 'Password is required';
                }
                break;
            case 'confirm_password':
                if (!value) {
                    message = 'Please confirm your password';
                }
                break;
        }
        
        if (message) {
            this.showFieldError(field, message);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    },

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        
        if (!password || !confirmPassword) return false;
        
        if (password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        } else {
            this.clearFieldError(confirmPassword);
            return true;
        }
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Show field error
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Remove existing error
        const existingError = field.parentElement.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentElement.parentElement.appendChild(errorDiv);
        
        // Add shake animation to input group
        const inputGroup = field.parentElement;
        inputGroup.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            inputGroup.style.animation = '';
        }, 500);
    },

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorMessage = field.parentElement.parentElement.querySelector('.invalid-feedback');
        if (errorMessage) {
            errorMessage.remove();
        }
    },

    // Shake form animation
    shakeForm(form) {
        form.style.animation = 'shake 0.6s ease-in-out';
        
        setTimeout(() => {
            form.style.animation = '';
        }, 600);
    },

    // Add success animation
    addSuccessAnimation(form) {
        const card = form.closest('.card');
        if (card) {
            card.style.transform = 'scale(1.02)';
            card.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.3)';
            card.style.transition = 'all 0.3s ease-in-out';
            
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '';
            }, 300);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    SignupManager.init();
});

// Export for global access
window.SignupManager = SignupManager;

