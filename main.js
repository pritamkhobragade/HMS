// Main JavaScript file for Admin Panel

// Initialize all utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize session management
    initializeSession();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize notifications
    initializeNotifications();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize event listeners
    initializeEventListeners();
});

// Session Management
function initializeSession() {
    // Check if user is logged in
    if (!SessionManager.isLoggedIn() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Update last activity timestamp
    SessionManager.updateLastActivity();

    // Check session timeout periodically
    setInterval(() => {
        if (SessionManager.checkSessionTimeout()) {
            NotificationSystem.warning('Your session has expired. Please log in again.');
        }
    }, 60000); // Check every minute

    // Update activity timestamp on user interaction
    document.addEventListener('click', () => SessionManager.updateLastActivity());
    document.addEventListener('keypress', () => SessionManager.updateLastActivity());
}

// Dark Mode
function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }

    // Initialize dark mode toggle if it exists
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    updateDarkModeIcon(isDarkMode);
    
    // Update charts if they exist
    if (window.activeCharts) {
        window.activeCharts.forEach(chart => {
            ChartManager.updateOptions(chart, {
                plugins: {
                    legend: {
                        labels: {
                            color: isDarkMode ? '#fff' : '#666'
                        }
                    }
                }
            });
        });
    }
}

function updateDarkModeIcon(isDarkMode) {
    const icon = document.querySelector('#darkModeToggle i');
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Form Validation
function initializeFormValidation() {
    // Initialize all forms with needs-validation class
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
            });
        });
    });
}

function validateInput(input) {
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.setCustomValidity('This field is required');
    } else if (input.type === 'email' && !FormValidator.isValidEmail(input.value)) {
        input.setCustomValidity('Please enter a valid email address');
    } else if (input.type === 'tel' && !FormValidator.isValidPhone(input.value)) {
        input.setCustomValidity('Please enter a valid phone number');
    } else {
        input.setCustomValidity('');
    }
}

// Notifications
function initializeNotifications() {
    // Initialize notification system
    NotificationSystem.init();

    // Add global error handler
    window.addEventListener('error', function(event) {
        NotificationSystem.error('An error occurred: ' + event.message);
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        NotificationSystem.error('An error occurred: ' + event.reason);
    });
}

// Charts
function initializeCharts() {
    // Store active charts
    window.activeCharts = new Set();

    // Initialize all charts on the page
    const chartElements = document.querySelectorAll('canvas[data-chart]');
    chartElements.forEach(canvas => {
        const chartType = canvas.dataset.chart;
        const chartData = JSON.parse(canvas.dataset.chartData || '{}');
        const chartOptions = JSON.parse(canvas.dataset.chartOptions || '{}');

        let chart;
        switch (chartType) {
            case 'line':
                chart = ChartManager.createLineChart(canvas, chartData, chartOptions);
                break;
            case 'bar':
                chart = ChartManager.createBarChart(canvas, chartData, chartOptions);
                break;
            case 'pie':
                chart = ChartManager.createPieChart(canvas, chartData, chartOptions);
                break;
            case 'doughnut':
                chart = ChartManager.createDoughnutChart(canvas, chartData, chartOptions);
                break;
            case 'radar':
                chart = ChartManager.createRadarChart(canvas, chartData, chartOptions);
                break;
            case 'polarArea':
                chart = ChartManager.createPolarAreaChart(canvas, chartData, chartOptions);
                break;
        }

        if (chart) {
            window.activeCharts.add(chart);
        }
    });
}

// Event Listeners
function initializeEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', function(event) {
        const form = event.target;
        if (form.classList.contains('needs-validation')) {
            return; // Let the form validation handle it
        }

        // Show loading state for form submissions
        if (form.dataset.loading !== 'false') {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                
                // Reset button state after form submission
                form.addEventListener('submit', function resetButton() {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    form.removeEventListener('submit', resetButton);
                }, { once: true });
            }
        }
    });

    // Handle delete confirmations
    document.addEventListener('click', function(event) {
        const deleteButton = event.target.closest('[data-delete]');
        if (deleteButton) {
            event.preventDefault();
            const message = deleteButton.dataset.deleteMessage || 'Are you sure you want to delete this item?';
            NotificationSystem.confirm(message, () => {
                const form = deleteButton.closest('form');
                if (form) {
                    form.submit();
                } else {
                    const href = deleteButton.getAttribute('href');
                    if (href) {
                        window.location.href = href;
                    }
                }
            });
        }
    });

    // Handle file inputs
    document.addEventListener('change', function(event) {
        const fileInput = event.target.closest('input[type="file"]');
        if (fileInput) {
            const fileName = fileInput.files[0]?.name;
            const fileLabel = fileInput.nextElementSibling;
            if (fileLabel && fileName) {
                fileLabel.textContent = fileName;
            }
        }
    });
}

// Export initialization functions
window.initializeSession = initializeSession;
window.initializeDarkMode = initializeDarkMode;
window.initializeFormValidation = initializeFormValidation;
window.initializeNotifications = initializeNotifications;
window.initializeCharts = initializeCharts;
window.initializeEventListeners = initializeEventListeners; 