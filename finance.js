// Finance Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize finance components
    initializeFinancialOverview();
    initializeCharts();
    initializeTransactionsTable();
    initializePendingInvoices();
    initializeDarkMode();
    initializeExportButtons();
    startRealTimeUpdates();
});

// Financial Overview with Real-time Updates
function initializeFinancialOverview() {
    // Initial data load
    updateFinancialMetrics();
    
    // Set up real-time updates
    setInterval(updateFinancialMetrics, 30000); // Update every 30 seconds
}

function updateFinancialMetrics() {
    // Simulated API call - replace with actual API endpoint
    fetch('/api/financial-metrics')
        .then(response => response.json())
        .then(data => {
            animateCounter('totalRevenue', data.totalRevenue, '$');
            animateCounter('pendingPayments', data.pendingPayments, '$');
            animateCounter('monthlyExpenses', data.monthlyExpenses, '$');
            animateCounter('netProfit', data.netProfit, '$');
        })
        .catch(() => {
            // Fallback to simulated data if API fails
            const financialData = {
                totalRevenue: 1250000,
                pendingPayments: 45000,
                monthlyExpenses: 85000,
                netProfit: 115000
            };
            
            animateCounter('totalRevenue', financialData.totalRevenue, '$');
            animateCounter('pendingPayments', financialData.pendingPayments, '$');
            animateCounter('monthlyExpenses', financialData.monthlyExpenses, '$');
            animateCounter('netProfit', financialData.netProfit, '$');
        });
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

// Enhanced Charts with Drill-down
function initializeCharts() {
    initializeRevenueExpensesChart();
    initializePaymentMethodsChart();
    initializeDrillDownCharts();
}

function initializeRevenueExpensesChart() {
    const ctx = document.getElementById('revenueExpensesChart').getContext('2d');
    const revenueExpensesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [120000, 150000, 180000, 160000, 200000, 220000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.1)'
            }, {
                label: 'Expenses',
                data: [80000, 85000, 90000, 95000, 100000, 105000],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.1)'
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
                    text: 'Revenue vs Expenses'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
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
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    showDrillDownModal('monthly', this.data.labels[index]);
                }
            }
        }
    });

    // Period selector with real-time updates
    document.querySelectorAll('[data-period]').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            updateChartData(period);
            document.querySelectorAll('[data-period]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initializeDrillDownCharts() {
    // Create drill-down modal if it doesn't exist
    if (!document.getElementById('drillDownModal')) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'drillDownModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detailed Analysis</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <canvas id="drillDownChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function showDrillDownModal(period, label) {
    const modal = new bootstrap.Modal(document.getElementById('drillDownModal'));
    const ctx = document.getElementById('drillDownChart').getContext('2d');
    
    // Fetch detailed data for the selected period
    fetch(`/api/financial-details/${period}/${label}`)
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.categories,
                    datasets: [{
                        label: 'Revenue',
                        data: data.revenue,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    }, {
                        label: 'Expenses',
                        data: data.expenses,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Detailed Analysis - ${label}`
                        }
                    }
                }
            });
        })
        .catch(() => {
            // Fallback to simulated data
            const simulatedData = {
                categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
                revenue: [30000, 25000, 20000, 15000],
                expenses: [20000, 18000, 15000, 12000]
            };
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: simulatedData.categories,
                    datasets: [{
                        label: 'Revenue',
                        data: simulatedData.revenue,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    }, {
                        label: 'Expenses',
                        data: simulatedData.expenses,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Detailed Analysis - ${label}`
                        }
                    }
                }
            });
        });
    
    modal.show();
}

function initializePaymentMethodsChart() {
    const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Credit Card', 'Cash', 'Insurance', 'Bank Transfer'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)'
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
                    text: 'Payment Methods Distribution'
                }
            }
        }
    });
}

// Export Functionality
function initializeExportButtons() {
    // Add export buttons to the page
    const exportButtons = `
        <div class="btn-group ms-2">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="exportToPDF()" title="Export to PDF">
                <i class="fas fa-file-pdf"></i> PDF
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="exportToExcel()" title="Export to Excel">
                <i class="fas fa-file-excel"></i> Excel
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="exportToCSV()" title="Export to CSV">
                <i class="fas fa-file-csv"></i> CSV
            </button>
        </div>
    `;
    
    document.querySelectorAll('.card-header').forEach(header => {
        if (header.querySelector('.card-title')) {
            header.querySelector('.card-title').insertAdjacentHTML('afterend', exportButtons);
        }
    });
}

function exportToPDF() {
    // Implement PDF export using jsPDF
    showNotification('Generating PDF report...', 'info');
    // Add actual PDF generation logic here
}

function exportToExcel() {
    // Implement Excel export using SheetJS
    showNotification('Generating Excel report...', 'info');
    // Add actual Excel generation logic here
}

function exportToCSV() {
    // Implement CSV export
    showNotification('Generating CSV report...', 'info');
    // Add actual CSV generation logic here
}

// Real-time Updates
function startRealTimeUpdates() {
    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket('ws://your-websocket-server');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
            case 'financial_metrics':
                updateFinancialMetrics();
                break;
            case 'new_transaction':
                updateTransactionsTable(data.transaction);
                break;
            case 'payment_received':
                updatePendingInvoices(data.invoice);
                break;
        }
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        // Fallback to polling if WebSocket fails
        setInterval(updateFinancialMetrics, 30000);
    };
}

// Enhanced Transactions Table
function initializeTransactionsTable() {
    const table = $('#transactionsTable').DataTable({
        data: [
            ['2024-03-15', 'Patient Consultation', 'Consultation', '$150', 'Completed', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['2024-03-14', 'Medical Supplies', 'Equipment', '$500', 'Pending', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['2024-03-13', 'Staff Salary', 'Salary', '$25000', 'Completed', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['2024-03-12', 'Utility Bill', 'Utility', '$2000', 'Pending', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['2024-03-11', 'Surgery Procedure', 'Procedure', '$5000', 'Completed', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>']
        ],
        columns: [
            { title: 'Date' },
            { title: 'Description' },
            { title: 'Category' },
            { title: 'Amount' },
            { title: 'Status' },
            { 
                title: 'Actions',
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info" title="View details" onclick="viewTransactionDetails('${row[0]}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" title="Export receipt" onclick="exportReceipt('${row[0]}')">
                            <i class="fas fa-file-export"></i>
                        </button>
                    `;
                }
            }
        ],
        order: [[0, 'desc']],
        pageLength: 5,
        language: {
            search: "Search transactions:"
        }
    });
    
    // Add real-time update capability
    window.updateTransactionsTable = function(newTransaction) {
        table.row.add([
            newTransaction.date,
            newTransaction.description,
            newTransaction.category,
            `$${newTransaction.amount}`,
            newTransaction.status,
            `<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>`
        ]).draw();
    };
}

// Export functions
window.initializeFinancialOverview = initializeFinancialOverview;
window.initializeCharts = initializeCharts;
window.initializeTransactionsTable = initializeTransactionsTable;
window.initializePendingInvoices = initializePendingInvoices;
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;
window.exportToCSV = exportToCSV;
window.viewTransactionDetails = function(id) {
    // Implement transaction details view
    showNotification('Loading transaction details...', 'info');
};
window.exportReceipt = function(id) {
    // Implement receipt export
    showNotification('Generating receipt...', 'info');
}; 