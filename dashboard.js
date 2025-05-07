// Dashboard Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initializeStatistics();
    initializeCharts();
    initializeActivityTable();
    initializeInventoryAlerts();
    initializeDarkMode();
    initializeRevenueChart();
    initializeDemographicsCharts();
    initializeSystemStatus();
    initializeQuickActions();
    initializeSidebarNavigation();
});

// Statistics Cards
function initializeStatistics() {
    // Simulated data - replace with actual API calls
    const stats = {
        totalPatients: 1250,
        totalDoctors: 85,
        todayAppointments: 45,
        monthlyRevenue: 125000
    };

    // Update statistics with animation
    animateCounter('totalPatients', stats.totalPatients);
    animateCounter('totalDoctors', stats.totalDoctors);
    animateCounter('todayAppointments', stats.todayAppointments);
    animateCounter('monthlyRevenue', stats.monthlyRevenue, '$');
}

function animateCounter(elementId, target, prefix = '') {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
        step++;
        current = Math.round(stepValue * step);
        
        if (step === steps) {
            current = target;
            clearInterval(interval);
        }

        element.textContent = prefix + current.toLocaleString();
    }, duration / steps);
}

// Charts
function initializeCharts() {
    initializePatientStatsChart();
    initializeDepartmentChart();
}

function initializePatientStatsChart() {
    const ctx = document.getElementById('patientStatsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Patients',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: 'Returning Patients',
                data: [28, 48, 40, 19, 86, 27],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeDepartmentChart() {
    const ctx = document.getElementById('departmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Others'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Activity Table
function initializeActivityTable() {
    $('#activityTable').DataTable({
        data: [
            ['10:30 AM', 'New patient registration', 'Dr. Smith', 'Completed'],
            ['11:15 AM', 'Lab test results uploaded', 'Nurse Johnson', 'Completed'],
            ['12:00 PM', 'Appointment scheduled', 'Admin', 'Pending'],
            ['01:45 PM', 'Prescription issued', 'Dr. Brown', 'Completed'],
            ['02:30 PM', 'Inventory update', 'Admin', 'In Progress']
        ],
        columns: [
            { title: 'Time' },
            { title: 'Activity' },
            { title: 'User' },
            { title: 'Status' }
        ],
        order: [[0, 'desc']],
        pageLength: 5,
        language: {
            search: "Search activities:"
        }
    });
}

// Inventory Alerts
function initializeInventoryAlerts() {
    const alerts = [
        { type: 'warning', message: 'Low stock: Bandages (5 remaining)' },
        { type: 'danger', message: 'Critical: Antibiotics (2 remaining)' },
        { type: 'info', message: 'New shipment arriving tomorrow' },
        { type: 'success', message: 'Inventory updated successfully' }
    ];

    const alertContainer = document.querySelector('.list-group');
    alerts.forEach(alert => {
        const alertElement = document.createElement('a');
        alertElement.href = '#';
        alertElement.className = `list-group-item list-group-item-${alert.type} d-flex justify-content-between align-items-center`;
        alertElement.innerHTML = `
            ${alert.message}
            <i class="fas fa-chevron-right"></i>
        `;
        alertContainer.appendChild(alertElement);
    });
}

// Dark Mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Revenue Analytics Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [65000, 59000, 80000, 81000, 56000, 55000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Monthly Revenue'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Period selector functionality
    document.querySelectorAll('[data-period]').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            // Update chart data based on period
            // This is where you would fetch new data from the server
            document.querySelectorAll('[data-period]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Patient Demographics Charts
function initializeDemographicsCharts() {
    // Age Distribution Chart
    const ageCtx = document.getElementById('ageDistributionChart').getContext('2d');
    new Chart(ageCtx, {
        type: 'bar',
        data: {
            labels: ['0-18', '19-30', '31-45', '46-60', '60+'],
            datasets: [{
                label: 'Number of Patients',
                data: [150, 300, 250, 200, 100],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Age Distribution'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gender Distribution Chart
    const genderCtx = document.getElementById('genderDistributionChart').getContext('2d');
    new Chart(genderCtx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female', 'Other'],
            datasets: [{
                data: [45, 50, 5],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 206, 86)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Gender Distribution'
                }
            }
        }
    });
}

// System Status Monitoring
function initializeSystemStatus() {
    // Simulate real-time system status updates
    setInterval(() => {
        updateSystemStatus('server', Math.random() * 100);
        updateSystemStatus('database', Math.random() * 100);
        updateSystemStatus('storage', Math.random() * 100);
        updateSystemStatus('network', Math.random() * 100);
    }, 5000);
}

function updateSystemStatus(type, value) {
    const progressBar = document.querySelector(`[data-status="${type}"] .progress-bar`);
    if (progressBar) {
        const percentage = Math.round(value);
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
        
        // Update color based on percentage
        if (percentage >= 90) {
            progressBar.className = 'progress-bar bg-success';
        } else if (percentage >= 70) {
            progressBar.className = 'progress-bar bg-info';
        } else if (percentage >= 50) {
            progressBar.className = 'progress-bar bg-warning';
        } else {
            progressBar.className = 'progress-bar bg-danger';
        }
    }
}

// Quick Actions Form Handlers
function initializeQuickActions() {
    // New Appointment Form
    const appointmentForm = document.getElementById('newAppointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle appointment creation
            showNotification('Appointment scheduled successfully!', 'success');
            $('#newAppointmentModal').modal('hide');
        });
    }

    // New Patient Form
    const patientForm = document.getElementById('newPatientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle patient creation
            showNotification('Patient added successfully!', 'success');
            $('#newPatientModal').modal('hide');
        });
    }

    // New Doctor Form
    const doctorForm = document.getElementById('newDoctorForm');
    if (doctorForm) {
        doctorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle doctor creation
            showNotification('Doctor added successfully!', 'success');
            $('#newDoctorModal').modal('hide');
        });
    }
}

// Export functions
window.initializeStatistics = initializeStatistics;
window.initializeCharts = initializeCharts;
window.initializeActivityTable = initializeActivityTable;
window.initializeInventoryAlerts = initializeInventoryAlerts;
window.initializeDarkMode = initializeDarkMode;
window.initializeRevenueChart = initializeRevenueChart;
window.initializeDemographicsCharts = initializeDemographicsCharts;
window.initializeSystemStatus = initializeSystemStatus;
window.initializeQuickActions = initializeQuickActions;

// Admin Dashboard Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeSidebar();
    initializeCharts();
    initializeNotifications();
    initializeRealTimeUpdates();
});

// Sidebar Toggle
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    
    sidebarCollapse.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Initialize Notifications
function initializeNotifications() {
    // WebSocket connection for real-time notifications
    const ws = new WebSocket('ws://your-websocket-server');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleNotification(data);
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        // Fallback to polling
        startPolling();
    };
}

// Handle different types of notifications
function handleNotification(data) {
    switch(data.type) {
        case 'financial_alert':
            showFinancialAlert(data);
            break;
        case 'inventory_alert':
            showInventoryAlert(data);
            break;
        case 'patient_alert':
            showPatientAlert(data);
            break;
        case 'system_alert':
            showSystemAlert(data);
            break;
    }
}

// Show different types of alerts
function showFinancialAlert(data) {
    const alertHtml = `
        <div class="alert alert-${data.severity} alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle"></i>
            <div class="alert-content">
                <h6>${data.title}</h6>
                <p>${data.message}</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.alert-list').insertAdjacentHTML('afterbegin', alertHtml);
}

function showInventoryAlert(data) {
    const alertHtml = `
        <div class="alert alert-${data.severity} alert-dismissible fade show" role="alert">
            <i class="fas fa-box"></i>
            <div class="alert-content">
                <h6>${data.title}</h6>
                <p>${data.message}</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.alert-list').insertAdjacentHTML('afterbegin', alertHtml);
}

function showPatientAlert(data) {
    const alertHtml = `
        <div class="alert alert-${data.severity} alert-dismissible fade show" role="alert">
            <i class="fas fa-user-injured"></i>
            <div class="alert-content">
                <h6>${data.title}</h6>
                <p>${data.message}</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.alert-list').insertAdjacentHTML('afterbegin', alertHtml);
}

function showSystemAlert(data) {
    const alertHtml = `
        <div class="alert alert-${data.severity} alert-dismissible fade show" role="alert">
            <i class="fas fa-cog"></i>
            <div class="alert-content">
                <h6>${data.title}</h6>
                <p>${data.message}</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.querySelector('.alert-list').insertAdjacentHTML('afterbegin', alertHtml);
}

// Polling fallback for notifications
function startPolling() {
    setInterval(() => {
        fetch('/api/notifications')
            .then(response => response.json())
            .then(data => {
                data.forEach(notification => {
                    handleNotification(notification);
                });
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }, 30000); // Poll every 30 seconds
}

// Real-time Updates
function initializeRealTimeUpdates() {
    // Update quick stats
    updateQuickStats();
    
    // Update activity list
    updateActivityList();
    
    // Set up periodic updates
    setInterval(updateQuickStats, 60000); // Update every minute
    setInterval(updateActivityList, 300000); // Update every 5 minutes
}

// Update quick stats
function updateQuickStats() {
    fetch('/api/quick-stats')
        .then(response => response.json())
        .then(data => {
            // Update revenue
            document.querySelector('.card.bg-primary .card-text').textContent = 
                `$${data.revenue.toLocaleString()}`;
            
            // Update patients
            document.querySelector('.card.bg-success .card-text').textContent = 
                data.patients.toLocaleString();
            
            // Update staff
            document.querySelector('.card.bg-warning .card-text').textContent = 
                data.staff.toLocaleString();
            
            // Update beds
            document.querySelector('.card.bg-info .card-text').textContent = 
                `${data.availableBeds}/${data.totalBeds}`;
        })
        .catch(error => {
            console.error('Error updating quick stats:', error);
        });
}

// Update activity list
function updateActivityList() {
    fetch('/api/recent-activities')
        .then(response => response.json())
        .then(data => {
            const activityList = document.querySelector('.activity-list');
            activityList.innerHTML = '';
            
            data.forEach(activity => {
                const activityHtml = `
                    <div class="activity-item">
                        <i class="fas ${getActivityIcon(activity.type)} text-${getActivityColor(activity.type)}"></i>
                        <div class="activity-content">
                            <h6>${activity.title}</h6>
                            <p>${activity.description}</p>
                        </div>
                    </div>
                `;
                
                activityList.insertAdjacentHTML('beforeend', activityHtml);
            });
        })
        .catch(error => {
            console.error('Error updating activity list:', error);
        });
}

// Helper functions for activity icons and colors
function getActivityIcon(type) {
    const icons = {
        'patient': 'fa-user-plus',
        'invoice': 'fa-file-invoice',
        'staff': 'fa-user-md',
        'inventory': 'fa-box',
        'system': 'fa-cog'
    };
    
    return icons[type] || 'fa-info-circle';
}

function getActivityColor(type) {
    const colors = {
        'patient': 'success',
        'invoice': 'info',
        'staff': 'warning',
        'inventory': 'danger',
        'system': 'secondary'
    };
    
    return colors[type] || 'primary';
}

// Export functionality
window.exportDashboard = function() {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Dashboard Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add quick stats
    doc.setFontSize(14);
    doc.text('Quick Stats', 20, 45);
    
    const stats = document.querySelectorAll('.card');
    let yOffset = 55;
    
    stats.forEach(stat => {
        const title = stat.querySelector('.card-title').textContent;
        const value = stat.querySelector('.card-text').textContent;
        
        doc.setFontSize(12);
        doc.text(title, 20, yOffset);
        doc.setFontSize(10);
        doc.text(value, 20, yOffset + 7);
        
        yOffset += 20;
    });
    
    // Add charts
    const charts = document.querySelectorAll('canvas');
    charts.forEach((chart, index) => {
        const imgData = chart.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, yOffset, 170, 100);
        yOffset += 120;
    });
    
    // Save the PDF
    doc.save('dashboard-report.pdf');
    showNotification('Dashboard report exported successfully', 'success');
};

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Enhanced Sidebar Navigation
function initializeSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('#sidebar ul.components li');
    const prevButton = document.getElementById('prevSidebarItem');
    const nextButton = document.getElementById('nextSidebarItem');
    const toggleButton = document.getElementById('toggleSidebar');
    const toggleAutoAdvance = document.getElementById('toggleAutoAdvance');
    const toggleSpeed = document.getElementById('toggleSpeed');
    const progressBar = document.querySelector('.sidebar-progress-bar');
    const navIndicators = document.querySelector('.sidebar-nav-indicators');
    let currentIndex = 0;
    let isAutoAdvancing = true;
    let advanceSpeed = 5000; // Default 5 seconds
    let autoAdvanceInterval;

    // Create navigation indicators
    function createNavIndicators() {
        sidebarItems.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateSidebarItems();
            });
            navIndicators.appendChild(indicator);
        });
    }

    // Initialize the first item and indicators
    createNavIndicators();
    updateSidebarItems();

    // Update progress bar with animation
    function updateProgress() {
        const progress = ((currentIndex + 1) / sidebarItems.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update visible items with enhanced animations
    function updateSidebarItems() {
        sidebarItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('visible');
                item.classList.add('active');
                // Update navigation indicators
                document.querySelectorAll('.nav-indicator').forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            } else {
                item.classList.remove('visible');
                item.classList.remove('active');
            }
        });
        updateProgress();
        updateNavigationButtons();
    }

    // Update navigation buttons state
    function updateNavigationButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === sidebarItems.length - 1;
    }

    // Enhanced auto-advance functionality
    function startAutoAdvance() {
        if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(() => {
            if (currentIndex < sidebarItems.length - 1) {
                currentIndex++;
                updateSidebarItems();
            } else {
                clearInterval(autoAdvanceInterval);
            }
        }, advanceSpeed);
        toggleAutoAdvance.innerHTML = '<i class="fas fa-pause"></i>';
        isAutoAdvancing = true;
    }

    function stopAutoAdvance() {
        if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
        toggleAutoAdvance.innerHTML = '<i class="fas fa-play"></i>';
        isAutoAdvancing = false;
    }

    function toggleAutoAdvanceState() {
        if (isAutoAdvancing) {
            stopAutoAdvance();
        } else {
            startAutoAdvance();
        }
    }

    function changeAdvanceSpeed() {
        const speeds = [3000, 5000, 8000, 10000]; // 3s, 5s, 8s, 10s
        const currentSpeedIndex = speeds.indexOf(advanceSpeed);
        const nextSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        advanceSpeed = speeds[nextSpeedIndex];
        
        // Update speed indicator
        const speedIcons = ['fa-tachometer-slow', 'fa-tachometer-alt', 'fa-tachometer-fast', 'fa-tachometer-fastest'];
        toggleSpeed.innerHTML = `<i class="fas ${speedIcons[nextSpeedIndex]}"></i>`;
        
        if (isAutoAdvancing) {
            startAutoAdvance(); // Restart with new speed
        }
    }

    // Event listeners
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSidebarItems();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < sidebarItems.length - 1) {
            currentIndex++;
            updateSidebarItems();
        }
    });

    toggleButton.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    toggleAutoAdvance.addEventListener('click', toggleAutoAdvanceState);
    toggleSpeed.addEventListener('click', changeAdvanceSpeed);

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSidebarItems();
                }
                break;
            case 'ArrowDown':
                if (currentIndex < sidebarItems.length - 1) {
                    currentIndex++;
                    updateSidebarItems();
                }
                break;
            case 'Space':
                toggleAutoAdvanceState();
                break;
            case 'Escape':
                stopAutoAdvance();
                break;
        }
    });

    // Mouse interaction
    const sidebar = document.getElementById('sidebar');
    sidebar.addEventListener('mouseenter', stopAutoAdvance);
    sidebar.addEventListener('mouseleave', () => {
        if (isAutoAdvancing) {
            startAutoAdvance();
        }
    });

    // Touch interaction for mobile
    let touchStartX = 0;
    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    sidebar.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentIndex < sidebarItems.length - 1) {
                // Swipe left
                currentIndex++;
                updateSidebarItems();
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right
                currentIndex--;
                updateSidebarItems();
            }
        }
    });

    // Initialize auto-advance
    startAutoAdvance();
}

// Sidebar Customization
function initializeSidebarCustomization() {
    const sidebar = document.getElementById('sidebar');
    const themeOptions = document.querySelectorAll('.theme-option');
    const compactModeToggle = document.getElementById('compactMode');
    const iconsOnlyToggle = document.getElementById('iconsOnly');
    const animationSpeed = document.getElementById('animationSpeed');
    const enableAnimations = document.getElementById('enableAnimations');
    const showTooltips = document.getElementById('showTooltips');
    const showProgressBar = document.getElementById('showProgressBar');
    const showNavIndicators = document.getElementById('showNavIndicators');

    // Theme Selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Save preference
            savePreference('theme', theme);
        });
    });

    // Compact Mode
    compactModeToggle.addEventListener('change', () => {
        sidebar.classList.toggle('compact-mode', compactModeToggle.checked);
        savePreference('compactMode', compactModeToggle.checked);
    });

    // Icons Only Mode
    iconsOnlyToggle.addEventListener('change', () => {
        sidebar.classList.toggle('icons-only', iconsOnlyToggle.checked);
        savePreference('iconsOnly', iconsOnlyToggle.checked);
    });

    // Animation Speed
    animationSpeed.addEventListener('input', () => {
        const speed = animationSpeed.value;
        document.documentElement.style.setProperty('--transition-speed', `${speed}ms`);
        savePreference('animationSpeed', speed);
    });

    // Enable Animations
    enableAnimations.addEventListener('change', () => {
        document.body.classList.toggle('no-animations', !enableAnimations.checked);
        savePreference('enableAnimations', enableAnimations.checked);
    });

    // Show Tooltips
    showTooltips.addEventListener('change', () => {
        sidebar.classList.toggle('show-tooltips', showTooltips.checked);
        savePreference('showTooltips', showTooltips.checked);
    });

    // Show Progress Bar
    showProgressBar.addEventListener('change', () => {
        sidebar.classList.toggle('show-progress', showProgressBar.checked);
        savePreference('showProgressBar', showProgressBar.checked);
    });

    // Show Navigation Indicators
    showNavIndicators.addEventListener('change', () => {
        sidebar.classList.toggle('show-indicators', showNavIndicators.checked);
        savePreference('showNavIndicators', showNavIndicators.checked);
    });

    // Load saved preferences
    loadPreferences();
}

function setTheme(theme) {
    const sidebar = document.getElementById('sidebar');
    sidebar.dataset.theme = theme;
    
    // Update body class for dark mode
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function savePreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('sidebarPreferences') || '{}');
    preferences[key] = value;
    localStorage.setItem('sidebarPreferences', JSON.stringify(preferences));
}

function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('sidebarPreferences') || '{}');
    
    // Apply theme
    if (preferences.theme) {
        setTheme(preferences.theme);
        document.querySelector(`.theme-option[data-theme="${preferences.theme}"]`)?.classList.add('active');
    }
    
    // Apply compact mode
    if (preferences.compactMode) {
        document.getElementById('sidebar').classList.add('compact-mode');
        document.getElementById('compactMode').checked = true;
    }
    
    // Apply icons only mode
    if (preferences.iconsOnly) {
        document.getElementById('sidebar').classList.add('icons-only');
        document.getElementById('iconsOnly').checked = true;
    }
    
    // Apply animation speed
    if (preferences.animationSpeed) {
        document.getElementById('animationSpeed').value = preferences.animationSpeed;
        document.documentElement.style.setProperty('--transition-speed', `${preferences.animationSpeed}ms`);
    }
    
    // Apply animations
    if (preferences.enableAnimations === false) {
        document.body.classList.add('no-animations');
        document.getElementById('enableAnimations').checked = false;
    }
    
    // Apply tooltips
    if (preferences.showTooltips) {
        document.getElementById('sidebar').classList.add('show-tooltips');
        document.getElementById('showTooltips').checked = true;
    }
    
    // Apply progress bar
    if (preferences.showProgressBar) {
        document.getElementById('sidebar').classList.add('show-progress');
        document.getElementById('showProgressBar').checked = true;
    }
    
    // Apply navigation indicators
    if (preferences.showNavIndicators) {
        document.getElementById('sidebar').classList.add('show-indicators');
        document.getElementById('showNavIndicators').checked = true;
    }
}

// Initialize customization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebarCustomization();
}); 