// Login Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form with default credentials
    initializeLoginForm();
    
    // Initialize password visibility toggle
    initializePasswordToggle();
    
    // Initialize remember me functionality
    initializeRememberMe();
    
    // Initialize dark mode
    initializeDarkMode();
});

// Login Form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    // Set default credentials
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Check for remembered username first
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        if (usernameInput && rememberMeCheckbox) {
            usernameInput.value = rememberedUsername;
            rememberMeCheckbox.checked = true;
        }
    } else {
        // Set default credentials if no remembered username
        if (usernameInput) {
            usernameInput.value = 'admin';
        }
        if (passwordInput) {
            passwordInput.value = 'admin123';
        }
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!this.checkValidity()) {
            event.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

            // Simulate API call (replace with actual API call)
            const response = await loginUser(username, password);
            
            if (response.success) {
                // Store auth token
                SessionManager.setAuthToken(response.token);
                
                // Update last activity
                SessionManager.updateLastActivity();
                
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }

                // Show success message
                NotificationSystem.success('Login successful! Redirecting...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                throw new Error(response.message || 'Invalid credentials');
            }
        } catch (error) {
            NotificationSystem.error(error.message || 'Login failed. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Simulated login API call (replace with actual API call)
async function loginUser(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // This is a mock implementation. In a real application:
    // 1. Send credentials to server
    // 2. Server validates credentials
    // 3. Server returns JWT or session token
    // 4. Store token securely
    
    // For demo purposes, accept any non-empty credentials
    if (username && password) {
        return {
            success: true,
            token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 1,
                username: username,
                role: 'admin'
            }
        };
    }
    
    throw new Error('Invalid credentials');
}

// Password Visibility Toggle
function initializePasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            this.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
}

// Remember Me
function initializeRememberMe() {
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const usernameInput = document.getElementById('username');
    
    if (rememberMeCheckbox && usernameInput) {
        rememberMeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('rememberedUsername', usernameInput.value);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
        });
    }
}

// Dark Mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check for saved preference
        const darkMode = localStorage.getItem('darkMode') === 'enabled';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }

        darkModeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            updateDarkModeIcon(isDarkMode);
        });
    }
}

function updateDarkModeIcon(isDarkMode) {
    const icon = document.querySelector('#darkModeToggle i');
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Forgot Password
document.getElementById('forgotPassword')?.addEventListener('click', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    if (!username) {
        NotificationSystem.warning('Please enter your username first');
        return;
    }

    // Show confirmation dialog
    NotificationSystem.confirm(
        'Reset Password',
        'Are you sure you want to reset your password? Instructions will be sent to your registered email.',
        async () => {
            try {
                // Show loading state
                NotificationSystem.info('Sending reset instructions...');
                
                // Simulate API call (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                NotificationSystem.success('Password reset instructions have been sent to your email');
            } catch (error) {
                NotificationSystem.error('Failed to send reset instructions. Please try again.');
            }
        }
    );
});

// Export functions
window.initializeLoginForm = initializeLoginForm;
window.initializePasswordToggle = initializePasswordToggle;
window.initializeRememberMe = initializeRememberMe;
window.initializeDarkMode = initializeDarkMode;

// Show notification
function showNotification(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Prevent form submission on Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Add input event listeners for real-time validation
const inputs = document.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim() === '') {
            this.setCustomValidity('This field is required');
        } else {
            this.setCustomValidity('');
        }
    });
});
 