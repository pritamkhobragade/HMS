// Utility Functions for Admin Panel

// Session Management
const SessionManager = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('authToken') !== null;
    },

    // Set authentication token
    setAuthToken: function(token) {
        localStorage.setItem('authToken', token);
    },

    // Get authentication token
    getAuthToken: function() {
        return localStorage.getItem('authToken');
    },

    // Remove authentication token
    removeAuthToken: function() {
        localStorage.removeItem('authToken');
    },

    // Check session timeout
    checkSessionTimeout: function() {
        const lastActivity = localStorage.getItem('lastActivity');
        const timeout = parseInt(localStorage.getItem('sessionTimeout')) || 30; // Default 30 minutes
        if (lastActivity) {
            const now = new Date().getTime();
            const diff = (now - parseInt(lastActivity)) / (1000 * 60); // Convert to minutes
            if (diff > timeout) {
                this.logout();
                return true;
            }
        }
        return false;
    },

    // Update last activity timestamp
    updateLastActivity: function() {
        localStorage.setItem('lastActivity', new Date().getTime());
    },

    // Logout user
    logout: function() {
        this.removeAuthToken();
        localStorage.removeItem('lastActivity');
        window.location.href = 'login.html';
    }
};

// Form Validation
const FormValidator = {
    // Validate email format
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone number format
    isValidPhone: function(phone) {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    },

    // Validate password strength
    isStrongPassword: function(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && 
               hasUpperCase && 
               hasLowerCase && 
               hasNumbers && 
               hasSpecialChar;
    },

    // Validate date format (YYYY-MM-DD)
    isValidDate: function(date) {
        const re = /^\d{4}-\d{2}-\d{2}$/;
        if (!re.test(date)) return false;
        
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    // Validate time format (HH:MM)
    isValidTime: function(time) {
        const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return re.test(time);
    }
};

// Data Formatting
const DataFormatter = {
    // Format date to locale string
    formatDate: function(date, format = 'default') {
        const d = new Date(date);
        switch (format) {
            case 'short':
                return d.toLocaleDateString();
            case 'long':
                return d.toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            case 'time':
                return d.toLocaleTimeString();
            default:
                return d.toLocaleString();
        }
    },

    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Format phone number
    formatPhoneNumber: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    }
};

// API Request Handler
const APIHandler = {
    // Make API request
    async request(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SessionManager.getAuthToken()}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // Get data
    async get(url) {
        return this.request(url);
    },

    // Post data
    async post(url, data) {
        return this.request(url, 'POST', data);
    },

    // Put data
    async put(url, data) {
        return this.request(url, 'PUT', data);
    },

    // Delete data
    async delete(url) {
        return this.request(url, 'DELETE');
    }
};

// Export utilities
window.SessionManager = SessionManager;
window.FormValidator = FormValidator;
window.DataFormatter = DataFormatter;
window.APIHandler = APIHandler; 