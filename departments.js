// +epartments Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeCharts();

    // Handle department form submission
    const departmentForm = document.getElementById('departmentForm');
    if (departmentForm) {
        departmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const departmentData = {
                name: formData.get('name'),
                description: formData.get('description'),
                head: formData.get('head'),
                location: formData.get('location'),
                contact: formData.get('contact'),
                beds: formData.get('beds'),
                status: formData.get('status')
            };

            // Here you would typically send this data to your backend
            console.log('New department:', departmentData);

            // Close modal and show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('newDepartmentModal'));
            modal.hide();
            showNotification('Success', 'Department added successfully', 'success');

            // Refresh department list
            refreshDepartmentList();
        });
    }

    // Handle department status changes
    const statusButtons = document.querySelectorAll('.department-status');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const departmentId = this.dataset.id;
            const newStatus = this.dataset.status;
            
            // Here you would typically update the status in your backend
            console.log(`Updating department ${departmentId} to ${newStatus}`);

            // Update UI
            const statusBadge = this.closest('tr').querySelector('.badge');
            if (statusBadge) {
                statusBadge.className = `badge bg-${getStatusColor(newStatus)}`;
                statusBadge.textContent = newStatus;
            }

            showNotification('Success', 'Department status updated', 'success');
        });
    });

    // Helper function to get status color
    function getStatusColor(status) {
        const colors = {
            'Active': 'success',
            'Inactive': 'danger',
            'Under Maintenance': 'warning'
        };
        return colors[status] || 'secondary';
    }

    // Handle department search and filters
    const searchInput = document.querySelector('.department-search');
    const statusFilter = document.querySelector('.status-filter');

    function filterDepartments() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        const rows = document.querySelectorAll('#departmentsTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = row.dataset.status;

            const matchesSearch = text.includes(searchTerm);
            const matchesStatus = !status || rowStatus === status;

            row.style.display = matchesSearch && matchesStatus ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterDepartments);
    if (statusFilter) statusFilter.addEventListener('change', filterDepartments);

    // Initialize Charts
    function initializeCharts() {
        // Staff Distribution Chart
        const staffChart = document.getElementById('staffDistributionChart');
        if (staffChart) {
            new Chart(staffChart, {
                type: 'pie',
                data: {
                    labels: ['Doctors', 'Nurses', 'Support Staff', 'Administrative'],
                    datasets: [{
                        data: [30, 40, 20, 10],
                        backgroundColor: [
                            '#0d6efd',
                            '#198754',
                            '#ffc107',
                            '#dc3545'
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

        // Bed Utilization Chart
        const bedChart = document.getElementById('bedUtilizationChart');
        if (bedChart) {
            new Chart(bedChart, {
                type: 'bar',
                data: {
                    labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
                    datasets: [{
                        label: 'Bed Utilization',
                        data: [85, 65, 75, 90, 70],
                        backgroundColor: '#0d6efd'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Utilization (%)'
                            }
                        }
                    }
                }
            });
        }
    }

    // Refresh department list
    function refreshDepartmentList() {
        // Here you would typically fetch updated data from your backend
        console.log('Refreshing department list');
        
        // For now, we'll just show a notification
        showNotification('Info', 'Department list refreshed', 'info');
    }

    // Handle department export
    const exportButtons = document.querySelectorAll('.export-departments');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            // Here you would typically generate and download the file
            console.log(`Exporting departments as ${format}`);
            showNotification('Success', `Departments exported as ${format}`, 'success');
        });
    });

    // Handle department statistics refresh
    const refreshStatsButton = document.querySelector('.refresh-stats');
    if (refreshStatsButton) {
        refreshStatsButton.addEventListener('click', function() {
            // Here you would typically fetch updated statistics from your backend
            console.log('Refreshing department statistics');
            
            // For now, we'll just show a notification
            showNotification('Info', 'Department statistics refreshed', 'info');
        });
    }
}); 