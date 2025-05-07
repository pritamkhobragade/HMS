// Session Management Utility

const SessionManager = {
    // Session timeout in milliseconds (30 minutes)
    SESSION_TIMEOUT: 30 * 60 * 1000,
    
    // Last activity timestamp
    lastActivity: null,
    
    // Initialize session
    init() {
        this.lastActivity = Date.now();
        this.checkSessionTimeout();
        
        // Update last activity on user interaction
        document.addEventListener('click', () => this.updateLastActivity());
        document.addEventListener('keypress', () => this.updateLastActivity());
        document.addEventListener('mousemove', () => this.updateLastActivity());
        
        // Check session timeout periodically
        setInterval(() => this.checkSessionTimeout(), 60000); // Check every minute
    },
    
    // Check if user is logged in
    isLoggedIn() {
        return !!this.getAuthToken();
    },
    
    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('authToken');
    },
    
    // Set authentication token
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
        this.updateLastActivity();
    },
    
    // Remove authentication token
    removeAuthToken() {
        localStorage.removeItem('authToken');
    },
    
    // Update last activity timestamp
    updateLastActivity() {
        this.lastActivity = Date.now();
    },
    
    // Check if session has timed out
    checkSessionTimeout() {
        if (!this.isLoggedIn()) return false;
        
        const now = Date.now();
        const timeSinceLastActivity = now - this.lastActivity;
        
        if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
            this.logout();
            return true;
        }
        
        return false;
    },
    
    // Logout user
    logout() {
        this.removeAuthToken();
        window.location.href = 'login.html';
    },
    
    // Get user information
    getUserInfo() {
        const token = this.getAuthToken();
        if (!token) return null;
        
        try {
            // In a real application, you would decode the JWT token
            // For demo purposes, we'll return mock user data
            return {
                id: 1,
                username: 'admin',
                role: 'admin',
                permissions: ['read', 'write', 'delete']
            };
        } catch (error) {
            console.error('Error decoding user info:', error);
            return null;
        }
    },
    
    // Check if user has required permission
    hasPermission(permission) {
        const userInfo = this.getUserInfo();
        if (!userInfo) return false;
        
        return userInfo.permissions.includes(permission);
    },
    
    // Check if user has required role
    hasRole(role) {
        const userInfo = this.getUserInfo();
        if (!userInfo) return false;
        
        return userInfo.role === role;
    },
    
    // Refresh session
    async refreshSession() {
        if (!this.isLoggedIn()) return false;
        
        try {
            // In a real application, you would call your API to refresh the token
            // For demo purposes, we'll just update the last activity
            this.updateLastActivity();
            return true;
        } catch (error) {
            console.error('Error refreshing session:', error);
            return false;
        }
    },
    
    // Handle API response
    handleApiResponse(response) {
        if (response.status === 401) {
            // Unauthorized - session expired
            this.logout();
            return false;
        }
        
        if (response.status === 403) {
            // Forbidden - insufficient permissions
            NotificationSystem.error('You do not have permission to perform this action');
            return false;
        }
        
        return true;
    }
};

// Initialize session manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SessionManager.init();
});

// Export session manager
window.SessionManager = SessionManager; 