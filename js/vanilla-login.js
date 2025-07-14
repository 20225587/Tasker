

const LoginManager = {
    // Initialize login page
    init() {
        this.setupEventListeners();
        this.addVisualEnhancements();
    },

    // Setup event listeners
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }

        // Add real-time validation
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');

        if (usernameField) {
            usernameField.addEventListener('blur', () => {
                this.validateField(usernameField, 'Username is required');
            });
            
            usernameField.addEventListener('input', () => {
                this.clearFieldError(usernameField);
            });
        }

        if (passwordField) {
            passwordField.addEventListener('blur', () => {
                this.validateField(passwordField, 'Password is required');
            });
            
            passwordField.addEventListener('input', () => {
                this.clearFieldError(passwordField);
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

    // Handle login form submission
    async handleLoginSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const usernameField = form.querySelector('#username');
        const passwordField = form.querySelector('#password');
        
        // Validate form
        let isValid = true;
        
        if (!this.validateField(usernameField, 'Username is required')) {
            isValid = false;
        }
        
        if (!this.validateField(passwordField, 'Password is required')) {
            isValid = false;
        }
        
        if (!isValid) {
            this.shakeForm(form);
            return;
        }
        
        // Show loading state
        Utils.setButtonLoading(submitBtn, true);
        
        try {
            const formData = new FormData(form);
            const response = await Utils.ajax('api/auth/login.php', {
                method: 'POST',
                body: Utils.formDataToParams(formData)
            });
            
            if (response.success) {
                Utils.showAlert('success', response.message);
                
                // Add success animation
                this.addSuccessAnimation(form);
                
                // Redirect after animation
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 1500);
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

    // Validate form field
    validateField(field, message) {
        if (!field) return false;
        
        const value = field.value.trim();
        
        if (!value) {
            this.showFieldError(field, message);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .input-group.focused {
        transform: scale(1.02);
        transition: transform 0.2s ease-in-out;
    }
    
    .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .card:hover {
        box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LoginManager.init();
});

// Export for global access
window.LoginManager = LoginManager;

