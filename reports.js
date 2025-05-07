// Reports Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeCharts();

    // Handle report generation
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const reportData = {
                type: formData.get('reportType'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                department: formData.get('department'),
                format: formData.get('format')
            };

            // Here you would typically send this data to your backend
            console.log('Generating report:', reportData);

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';

            // Simulate report generation
            setTimeout(() => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;

                // Add report to list
                addReportToList({
                    id: Date.now(),
                    type: reportData.type,
                    date: new Date().toISOString(),
                    status: 'Completed',
                    format: reportData.format
                });

                showNotification('Success', 'Report generated successfully', 'success');
            }, 2000);
        });
    }

    // Add report to list
    function addReportToList(report) {
        const tbody = document.querySelector('#reportsTable tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${report.id}</td>
                <td>${report.type}</td>
                <td>${new Date(report.date).toLocaleString()}</td>
                <td><span class="badge bg-success">${report.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-primary" title="View Report">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-success" title="Download Report">
                            <i class="fas fa-download"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" title="Delete Report">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.insertBefore(tr, tbody.firstChild);
        }
    }

    // Initialize Charts
    function initializeCharts() {
        // Revenue vs Expenses Chart
        const revenueChart = document.getElementById('revenueChart');
        if (revenueChart) {
            new Chart(revenueChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [12000, 19000, 15000, 25000, 22000, 30000],
                            borderColor: '#198754',
                            tension: 0.1
                        },
                        {
                            label: 'Expenses',
                            data: [8000, 12000, 10000, 15000, 14000, 18000],
                            borderColor: '#dc3545',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Amount ($)'
                            }
                        }
                    }
                }
            });
        }

        // Department Performance Chart
        const performanceChart = document.getElementById('departmentPerformanceChart');
        if (performanceChart) {
            new Chart(performanceChart, {
                type: 'radar',
                data: {
                    labels: ['Patient Care', 'Efficiency', 'Staff Satisfaction', 'Resource Utilization', 'Quality Metrics'],
                    datasets: [
                        {
                            label: 'Cardiology',
                            data: [85, 75, 80, 90, 85],
                            backgroundColor: 'rgba(13, 110, 253, 0.2)',
                            borderColor: '#0d6efd'
                        },
                        {
                            label: 'Neurology',
                            data: [90, 85, 75, 80, 90],
                            backgroundColor: 'rgba(25, 135, 84, 0.2)',
                            borderColor: '#198754'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    // Handle report search and filters
    const searchInput = document.querySelector('.report-search');
    const typeFilter = document.querySelector('.type-filter');
    const statusFilter = document.querySelector('.status-filter');

    function filterReports() {
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const status = statusFilter.value;

        const rows = document.querySelectorAll('#reportsTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowType = row.dataset.type;
            const rowStatus = row.dataset.status;

            const matchesSearch = text.includes(searchTerm);
            const matchesType = !type || rowType === type;
            const matchesStatus = !status || rowStatus === status;

            row.style.display = matchesSearch && matchesType && matchesStatus ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterReports);
    if (typeFilter) typeFilter.addEventListener('change', filterReports);
    if (statusFilter) statusFilter.addEventListener('change', filterReports);

    // Handle report actions
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.title.toLowerCase();
        const row = target.closest('tr');
        const reportId = row.querySelector('td:first-child').textContent;

        switch (action) {
            case 'view report':
                viewReport(reportId);
                break;
            case 'download report':
                downloadReport(reportId);
                break;
            case 'delete report':
                deleteReport(reportId, row);
                break;
        }
    });

    // View report
    function viewReport(reportId) {
        // Here you would typically fetch and display the report
        console.log(`Viewing report ${reportId}`);
        showNotification('Info', 'Opening report viewer...', 'info');
    }

    // Download report
    function downloadReport(reportId) {
        // Here you would typically generate and download the file
        console.log(`Downloading report ${reportId}`);
        showNotification('Success', 'Report download started', 'success');
    }

    // Delete report
    function deleteReport(reportId, row) {
        if (confirm('Are you sure you want to delete this report?')) {
            // Here you would typically delete the report from your backend
            console.log(`Deleting report ${reportId}`);
            row.remove();
            showNotification('Success', 'Report deleted successfully', 'success');
        }
    }

    // Handle financial overview refresh
    const refreshButton = document.querySelector('.refresh-financial');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // Here you would typically fetch updated financial data from your backend
            console.log('Refreshing financial overview');
            showNotification('Info', 'Financial data refreshed', 'info');
        });
    }
}); 