// Department Analysis Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeDepartmentCharts();
    initializeDepartmentTable();
    initializeRealTimeUpdates();
    initializeExportFunctionality();
    initializePeriodSelector();
});

// Enhanced Charts with Zoom, Pan, and Interactive Features
function initializeDepartmentCharts() {
    // Common chart options for zoom and pan
    const zoomOptions = {
        pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'ctrl'
        },
        zoom: {
            wheel: {
                enabled: true,
                modifierKey: 'ctrl'
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
            drag: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.1)'
            }
        }
    };

    // Common annotation options
    const annotationOptions = {
        annotations: {
            point1: {
                type: 'point',
                xValue: 2,
                yValue: 180000,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                radius: 5,
                label: {
                    enabled: true,
                    content: 'Peak Revenue',
                    position: 'top'
                }
            }
        }
    };

    // Department Performance Chart with Enhanced Interactivity
    const performanceCtx = document.getElementById('departmentPerformanceChart').getContext('2d');
    const performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Cardiology',
                    data: [120000, 150000, 180000, 160000, 200000, 220000],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Neurology',
                    data: [100000, 130000, 160000, 140000, 180000, 200000],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Orthopedics',
                    data: [80000, 110000, 140000, 120000, 160000, 180000],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Department Performance Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        },
                        title: function(context) {
                            return `Month: ${context[0].label}`;
                        }
                    }
                },
                zoom: zoomOptions,
                annotation: annotationOptions,
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const datasetIndex = elements[0].datasetIndex;
                    const department = this.data.datasets[datasetIndex].label;
                    const value = this.data.datasets[datasetIndex].data[index];
                    showDetailedMetrics(department, this.data.labels[index], value);
                }
            }
        }
    });

    // Revenue Distribution Chart with Enhanced Interactivity
    const revenueCtx = document.getElementById('revenueDistributionChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency'],
            datasets: [{
                label: 'Revenue',
                data: [220000, 200000, 180000, 150000, 250000],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1,
                hoverBackgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue Distribution by Department'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `Revenue: $${context.raw.toLocaleString()} (${percentage}%)`;
                        }
                    }
                },
                legend: {
                    display: false
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
                    const department = this.data.labels[index];
                    const value = this.data.datasets[0].data[index];
                    showDepartmentBreakdown(department, value);
                }
            }
        }
    });

    // Cost Analysis Chart with Enhanced Interactivity
    const costCtx = document.getElementById('costAnalysisChart').getContext('2d');
    const costChart = new Chart(costCtx, {
        type: 'bar',
        data: {
            labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency'],
            datasets: [{
                label: 'Operating Costs',
                data: [150000, 130000, 120000, 100000, 180000],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)'
            }, {
                label: 'Staff Costs',
                data: [80000, 70000, 60000, 50000, 90000],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cost Analysis by Department'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.dataset.label}: $${context.raw.toLocaleString()} (${percentage}%)`;
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
                    const datasetIndex = elements[0].datasetIndex;
                    const department = this.data.labels[index];
                    const costType = this.data.datasets[datasetIndex].label;
                    const value = this.data.datasets[datasetIndex].data[index];
                    showCostBreakdown(department, costType, value);
                }
            }
        }
    });

    // Store chart instances for updates
    window.charts = {
        performance: performanceChart,
        revenue: revenueChart,
        cost: costChart
    };
}

// Period Selector for Charts
function initializePeriodSelector() {
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            updateChartPeriod(period);
            
            // Update active state
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateChartPeriod(period) {
    // Fetch data for the selected period
    fetch(`/api/department-metrics?period=${period}`)
        .then(response => response.json())
        .then(data => {
            updateChartsWithNewData(data);
        })
        .catch(error => {
            console.error('Error fetching period data:', error);
            showNotification('Failed to update period data', 'error');
        });
}

// Enhanced Export Functionality
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Department Financial Analysis Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Financial Summary', 20, 45);
    
    // Add department table
    const table = document.getElementById('departmentTable');
    const rows = Array.from(table.querySelectorAll('tr'));
    const tableData = rows.map(row => {
        return Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent);
    });
    
    doc.autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: 50,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255
        }
    });
    
    // Add charts
    const charts = ['departmentPerformanceChart', 'revenueDistributionChart', 'costAnalysisChart'];
    let yOffset = doc.lastAutoTable.finalY + 20;
    
    charts.forEach((chartId, index) => {
        const canvas = document.getElementById(chartId);
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, yOffset, 170, 100);
        yOffset += 120;
    });
    
    // Save the PDF
    doc.save('department-analysis.pdf');
    showNotification('PDF report generated successfully', 'success');
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    // Add department summary sheet
    const summaryData = [
        ['Department Financial Analysis Report'],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [],
        ['Department', 'Revenue', 'Expenses', 'Profit', 'Profit Margin', 'Trend']
    ];
    
    const table = document.getElementById('departmentTable');
    const rows = Array.from(table.querySelectorAll('tr'));
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        summaryData.push(cells.map(cell => cell.textContent));
    });
    
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    
    // Add detailed metrics sheet
    const metricsData = [
        ['Detailed Department Metrics'],
        [],
        ['Department', 'Metric', 'Value', 'Change', 'Trend']
    ];
    
    // Add performance metrics
    const performanceChart = window.charts.performance;
    performanceChart.data.datasets.forEach(dataset => {
        dataset.data.forEach((value, index) => {
            metricsData.push([
                dataset.label,
                'Monthly Revenue',
                value,
                index > 0 ? ((value - dataset.data[index - 1]) / dataset.data[index - 1] * 100).toFixed(2) + '%' : 'N/A',
                value > dataset.data[index - 1] ? 'Up' : 'Down'
            ]);
        });
    });
    
    const metricsWs = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(wb, metricsWs, 'Detailed Metrics');
    
    // Save the Excel file
    XLSX.writeFile(wb, 'department-analysis.xlsx');
    showNotification('Excel report generated successfully', 'success');
}

// Enhanced Real-time Updates
function initializeRealTimeUpdates() {
    // Set up WebSocket connection
    const ws = new WebSocket('ws://your-websocket-server');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
            case 'department_update':
                updateDepartmentData(data);
                break;
            case 'financial_alert':
                showFinancialAlert(data);
                break;
            case 'performance_update':
                updatePerformanceMetrics(data);
                break;
            case 'threshold_alert':
                handleThresholdAlert(data);
                break;
            case 'trend_alert':
                handleTrendAlert(data);
                break;
        }
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        // Fallback to polling
        setInterval(fetchDepartmentUpdates, 30000);
    };
}

function handleThresholdAlert(data) {
    const { department, metric, value, threshold } = data;
    const alertClass = value > threshold ? 'warning' : 'info';
    showNotification(
        `${department} ${metric} (${value}) has crossed the threshold (${threshold})`,
        alertClass
    );
}

function handleTrendAlert(data) {
    const { department, metric, trend, percentage } = data;
    const alertClass = trend === 'up' ? 'success' : 'danger';
    showNotification(
        `${department} ${metric} shows ${trend}ward trend (${percentage}%)`,
        alertClass
    );
}

// Interactive Chart Features
function showDetailedMetrics(department, period, value) {
    // Create and show modal with detailed metrics
    const modal = new bootstrap.Modal(document.getElementById('metricsModal'));
    const modalBody = document.querySelector('#metricsModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>${department} - ${period}</h4>
        <div class="metrics-grid">
            <div class="metric-card">
                <h5>Revenue</h5>
                <p class="value">$${value.toLocaleString()}</p>
            </div>
            <div class="metric-card">
                <h5>Expenses</h5>
                <p class="value">$${(value * 0.7).toLocaleString()}</p>
            </div>
            <div class="metric-card">
                <h5>Profit</h5>
                <p class="value">$${(value * 0.3).toLocaleString()}</p>
            </div>
        </div>
    `;
    
    modal.show();
}

function showDepartmentBreakdown(department, revenue) {
    // Create and show modal with department breakdown
    const modal = new bootstrap.Modal(document.getElementById('breakdownModal'));
    const modalBody = document.querySelector('#breakdownModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>${department} Revenue Breakdown</h4>
        <div class="breakdown-chart">
            <canvas id="departmentBreakdownChart"></canvas>
        </div>
    `;
    
    modal.show();
    
    // Initialize breakdown chart
    const ctx = document.getElementById('departmentBreakdownChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Inpatient', 'Outpatient', 'Procedures', 'Other'],
            datasets: [{
                data: [
                    revenue * 0.4,
                    revenue * 0.3,
                    revenue * 0.2,
                    revenue * 0.1
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue Sources'
                }
            }
        }
    });
}

function showCostBreakdown(department, costType, value) {
    // Create and show modal with cost breakdown
    const modal = new bootstrap.Modal(document.getElementById('costModal'));
    const modalBody = document.querySelector('#costModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>${department} - ${costType} Breakdown</h4>
        <div class="cost-breakdown">
            <div class="cost-item">
                <span>Equipment</span>
                <span>$${(value * 0.4).toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Supplies</span>
                <span>$${(value * 0.3).toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Maintenance</span>
                <span>$${(value * 0.2).toLocaleString()}</span>
            </div>
            <div class="cost-item">
                <span>Other</span>
                <span>$${(value * 0.1).toLocaleString()}</span>
            </div>
        </div>
    `;
    
    modal.show();
}

// Export functions
window.viewDepartmentDetails = function(department) {
    showNotification(`Loading details for ${department}...`, 'info');
    // Implement department details view
};

window.exportDepartmentReport = function(department) {
    showNotification(`Generating report for ${department}...`, 'info');
    // Implement department-specific report export
}; 