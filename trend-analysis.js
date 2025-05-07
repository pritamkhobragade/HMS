// Trend Analysis Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeTrendCharts();
    initializeTrendTable();
    initializeRealTimeUpdates();
    initializeExportFunctionality();
    initializePeriodSelector();
});

// Enhanced Charts with Zoom, Pan, and Interactive Features
function initializeTrendCharts() {
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
                yValue: 1800000,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                radius: 5,
                label: {
                    enabled: true,
                    content: 'Peak Revenue',
                    position: 'top'
                }
            },
            line1: {
                type: 'line',
                yMin: 0,
                yMax: 0,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                    enabled: true,
                    content: 'Baseline',
                    position: 'left'
                }
            }
        }
    };

    // Enhanced point options for better interaction
    const pointOptions = {
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
    };

    // Trend Overview Chart with Enhanced Interactivity
    const overviewCtx = document.getElementById('trendOverviewChart').getContext('2d');
    const overviewChart = new Chart(overviewCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Total Revenue',
                    data: [1200000, 1500000, 1800000, 1600000, 2000000, 2200000],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    ...pointOptions
                },
                {
                    label: 'Total Expenses',
                    data: [900000, 1100000, 1300000, 1200000, 1500000, 1600000],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    ...pointOptions
                },
                {
                    label: 'Net Profit',
                    data: [300000, 400000, 500000, 400000, 500000, 600000],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    ...pointOptions
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Financial Trends Overview'
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
                    const metric = this.data.datasets[datasetIndex].label;
                    const value = this.data.datasets[datasetIndex].data[index];
                    showDetailedMetrics(metric, this.data.labels[index], value);
                }
            }
        }
    });

    // Revenue Trends Chart
    const revenueCtx = document.getElementById('revenueTrendsChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Inpatient Revenue',
                    data: [500000, 600000, 700000, 650000, 800000, 900000],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Outpatient Revenue',
                    data: [400000, 500000, 600000, 550000, 700000, 800000],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Other Revenue',
                    data: [300000, 400000, 500000, 400000, 500000, 500000],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue Trends by Category'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                },
                zoom: zoomOptions
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
                    }
                }
            }
        }
    });

    // Cost Trends Chart
    const costCtx = document.getElementById('costTrendsChart').getContext('2d');
    const costChart = new Chart(costCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Operating Costs',
                    data: [600000, 700000, 800000, 750000, 900000, 1000000],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Staff Costs',
                    data: [300000, 400000, 500000, 450000, 600000, 600000],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cost Trends by Category'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                },
                zoom: zoomOptions
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
                    }
                }
            }
        }
    });

    // Store chart instances for updates
    window.charts = {
        overview: overviewChart,
        revenue: revenueChart,
        cost: costChart
    };
}

// Trend Analysis Table
function initializeTrendTable() {
    const table = $('#trendAnalysisTable').DataTable({
        data: [
            ['Total Revenue', '$2,200,000', '$2,000,000', '+10%', '<span class="text-success"><i class="fas fa-arrow-up"></i> Upward</span>', '$2,400,000', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['Total Expenses', '$1,600,000', '$1,500,000', '+6.7%', '<span class="text-warning"><i class="fas fa-arrow-up"></i> Upward</span>', '$1,700,000', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['Net Profit', '$600,000', '$500,000', '+20%', '<span class="text-success"><i class="fas fa-arrow-up"></i> Upward</span>', '$700,000', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>'],
            ['Profit Margin', '27.3%', '25%', '+2.3%', '<span class="text-success"><i class="fas fa-arrow-up"></i> Upward</span>', '29.2%', '<button class="btn btn-sm btn-info" title="View details"><i class="fas fa-eye"></i></button>']
        ],
        columns: [
            { title: 'Metric' },
            { title: 'Current Value' },
            { title: 'Previous Value' },
            { title: 'Change' },
            { title: 'Trend' },
            { title: 'Forecast' },
            { 
                title: 'Actions',
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info" title="View details" onclick="viewTrendDetails('${row[0]}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" title="Export report" onclick="exportTrendReport('${row[0]}')">
                            <i class="fas fa-file-export"></i>
                        </button>
                    `;
                }
            }
        ],
        order: [[3, 'desc']], // Sort by change by default
        pageLength: 10,
        language: {
            search: "Search metrics:"
        }
    });

    // Add real-time update capability
    window.updateTrendTable = function(newData) {
        table.row.add(newData).draw();
    };
}

// Period Selector
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
    fetch(`/api/trend-metrics?period=${period}`)
        .then(response => response.json())
        .then(data => {
            updateChartsWithNewData(data);
        })
        .catch(error => {
            console.error('Error fetching period data:', error);
            showNotification('Failed to update period data', 'error');
        });
}

// Enhanced Real-time Updates
function initializeRealTimeUpdates() {
    // Set up WebSocket connection
    const ws = new WebSocket('ws://your-websocket-server');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
            case 'trend_update':
                updateTrendData(data);
                break;
            case 'financial_alert':
                showFinancialAlert(data);
                break;
            case 'forecast_update':
                updateForecast(data);
                break;
            case 'threshold_alert':
                handleThresholdAlert(data);
                break;
            case 'anomaly_detection':
                handleAnomalyDetection(data);
                break;
            case 'correlation_alert':
                handleCorrelationAlert(data);
                break;
            case 'seasonal_pattern':
                handleSeasonalPattern(data);
                break;
        }
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        // Fallback to polling with exponential backoff
        let retryCount = 0;
        const maxRetries = 5;
        
        function pollWithBackoff() {
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    fetchTrendUpdates();
                    retryCount++;
                    pollWithBackoff();
                }, Math.min(1000 * Math.pow(2, retryCount), 30000));
            } else {
                showNotification('Connection lost. Please refresh the page.', 'error');
            }
        }
        
        pollWithBackoff();
    };
}

function updateTrendData(data) {
    // Update charts and table with new data
    updateChartsWithNewData(data);
    updateTrendTable(data);
    showNotification(`Trend data updated for ${data.metric}`, 'info');
}

function updateForecast(data) {
    // Update forecast data
    const { metric, forecast, confidence } = data;
    showNotification(`New forecast for ${metric}: ${forecast} (${confidence}% confidence)`, 'info');
}

function handleThresholdAlert(data) {
    const { metric, value, threshold } = data;
    const alertClass = value > threshold ? 'warning' : 'info';
    showNotification(
        `${metric} (${value}) has crossed the threshold (${threshold})`,
        alertClass
    );
}

function handleAnomalyDetection(data) {
    const { metric, value, expectedRange, timestamp } = data;
    const deviation = ((value - expectedRange.average) / expectedRange.average * 100).toFixed(1);
    
    showNotification({
        title: 'Anomaly Detected',
        message: `${metric} shows unusual value: $${value.toLocaleString()} (${deviation}% deviation)`,
        type: 'warning',
        duration: 10000,
        actions: [
            {
                label: 'View Details',
                onClick: () => showAnomalyDetails(data)
            },
            {
                label: 'Dismiss',
                onClick: () => {}
            }
        ]
    });
}

function handleCorrelationAlert(data) {
    const { metric1, metric2, correlation, strength } = data;
    
    showNotification({
        title: 'Correlation Detected',
        message: `${metric1} and ${metric2} show ${strength} correlation (${correlation})`,
        type: 'info',
        duration: 8000,
        actions: [
            {
                label: 'Analyze',
                onClick: () => showCorrelationAnalysis(data)
            }
        ]
    });
}

function handleSeasonalPattern(data) {
    const { metric, pattern, confidence } = data;
    
    showNotification({
        title: 'Seasonal Pattern Identified',
        message: `${metric} shows ${pattern} pattern (${confidence}% confidence)`,
        type: 'info',
        duration: 8000,
        actions: [
            {
                label: 'View Pattern',
                onClick: () => showSeasonalAnalysis(data)
            }
        ]
    });
}

function showAnomalyDetails(data) {
    const modal = new bootstrap.Modal(document.getElementById('trendDetailsModal'));
    const modalBody = document.querySelector('#trendDetailsModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>Anomaly Analysis</h4>
        <div class="anomaly-details">
            <div class="metric-card">
                <h5>Metric</h5>
                <p>${data.metric}</p>
            </div>
            <div class="metric-card">
                <h5>Value</h5>
                <p>$${data.value.toLocaleString()}</p>
            </div>
            <div class="metric-card">
                <h5>Expected Range</h5>
                <p>$${data.expectedRange.min.toLocaleString()} - $${data.expectedRange.max.toLocaleString()}</p>
            </div>
            <div class="metric-card">
                <h5>Deviation</h5>
                <p class="${data.value > data.expectedRange.max ? 'text-danger' : 'text-warning'}">
                    ${((data.value - data.expectedRange.average) / data.expectedRange.average * 100).toFixed(1)}%
                </p>
            </div>
        </div>
        <div class="trend-chart mt-4">
            <canvas id="anomalyChart"></canvas>
        </div>
        <div class="analysis-controls mt-3">
            <div class="btn-group" role="group">
                <button class="btn btn-outline-primary" onclick="toggleAnomalyView('timeline')">
                    <i class="fas fa-chart-line"></i> Timeline
                </button>
                <button class="btn btn-outline-primary" onclick="toggleAnomalyView('distribution')">
                    <i class="fas fa-chart-bar"></i> Distribution
                </button>
                <button class="btn btn-outline-primary" onclick="toggleAnomalyView('heatmap')">
                    <i class="fas fa-th"></i> Heatmap
                </button>
            </div>
            <div class="btn-group ms-2" role="group">
                <button class="btn btn-outline-secondary" onclick="exportAnomalyAnalysis()">
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-outline-secondary" onclick="setAnomalyAlert()">
                    <i class="fas fa-bell"></i> Set Alert
                </button>
            </div>
        </div>
        <div class="anomaly-insights mt-3">
            <h5>Insights</h5>
            <div class="insights-list">
                ${generateAnomalyInsights(data)}
            </div>
        </div>
    `;
    
    modal.show();
    
    // Initialize anomaly chart with enhanced options
    const ctx = document.getElementById('anomalyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.historicalData.labels,
            datasets: [
                {
                    label: data.metric,
                    data: data.historicalData.values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Expected Range',
                    data: data.historicalData.expectedValues,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    borderDash: [5, 5],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.1)'
                },
                {
                    label: 'Confidence Interval',
                    data: data.historicalData.confidenceInterval,
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    borderDash: [2, 2],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.05)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Anomaly Analysis'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        anomaly: {
                            type: 'point',
                            xValue: data.timestamp,
                            yValue: data.value,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 2,
                            radius: 6,
                            label: {
                                enabled: true,
                                content: 'Anomaly',
                                position: 'top'
                            }
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
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
                    }
                }
            }
        }
    });
}

function toggleAnomalyView(viewType) {
    const chart = Chart.getChart('anomalyChart');
    if (!chart) return;

    switch(viewType) {
        case 'timeline':
            updateAnomalyTimelineView(chart);
            break;
        case 'distribution':
            updateAnomalyDistributionView(chart);
            break;
        case 'heatmap':
            updateAnomalyHeatmapView(chart);
            break;
    }
}

function updateAnomalyTimelineView(chart) {
    chart.config.type = 'line';
    chart.update();
}

function updateAnomalyDistributionView(chart) {
    chart.config.type = 'bar';
    chart.config.options.scales.x.type = 'category';
    chart.update();
}

function updateAnomalyHeatmapView(chart) {
    // Create heatmap visualization
    const ctx = document.getElementById('anomalyChart').getContext('2d');
    const heatmapData = generateHeatmapData(chart.data);
    
    new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                data: heatmapData,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    return getHeatmapColor(value);
                },
                borderWidth: 1,
                borderColor: '#fff',
                width: ({ chart }) => (chart.chartArea || {}).width / heatmapData.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / 10 - 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const data = context[0].dataset.data[context[0].dataIndex];
                            return `${data.x}, ${data.y}`;
                        },
                        label: function(context) {
                            const data = context.dataset.data[context.dataIndex];
                            return `Value: $${data.v.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    offset: true
                },
                y: {
                    type: 'category',
                    offset: true
                }
            }
        }
    });
}

function generateHeatmapData(chartData) {
    // Convert time series data to heatmap format
    const heatmapData = [];
    const values = chartData.datasets[0].data;
    const labels = chartData.labels;
    
    for (let i = 0; i < values.length; i++) {
        heatmapData.push({
            x: labels[i],
            y: Math.floor(i / 10),
            v: values[i]
        });
    }
    
    return heatmapData;
}

function getHeatmapColor(value) {
    // Generate color based on value intensity
    const intensity = Math.min(1, value / 1000000);
    return `rgba(255, ${Math.floor(255 * (1 - intensity))}, ${Math.floor(255 * (1 - intensity))}, 0.8)`;
}

function generateAnomalyInsights(data) {
    const insights = [];
    
    // Add statistical insights
    insights.push(`
        <div class="insight-card">
            <h6>Statistical Analysis</h6>
            <p>This anomaly represents a ${((data.value - data.expectedRange.average) / data.expectedRange.average * 100).toFixed(1)}% deviation from the expected value.</p>
        </div>
    `);
    
    // Add trend insights
    if (data.value > data.expectedRange.max) {
        insights.push(`
            <div class="insight-card">
                <h6>Trend Analysis</h6>
                <p>This value is significantly higher than the historical trend, suggesting a potential positive shift in the metric.</p>
            </div>
        `);
    } else {
        insights.push(`
            <div class="insight-card">
                <h6>Trend Analysis</h6>
                <p>This value is significantly lower than the historical trend, suggesting a potential negative shift in the metric.</p>
            </div>
        `);
    }
    
    // Add seasonal insights
    if (data.seasonalFactor) {
        insights.push(`
            <div class="insight-card">
                <h6>Seasonal Impact</h6>
                <p>This anomaly may be influenced by seasonal factors, with a ${data.seasonalFactor}% seasonal impact.</p>
            </div>
        `);
    }
    
    return insights.join('');
}

function exportAnomalyAnalysis() {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Anomaly Analysis Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add anomaly details
    doc.setFontSize(14);
    doc.text('Anomaly Details', 20, 45);
    
    // Add chart
    const canvas = document.getElementById('anomalyChart');
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, 60, 170, 100);
    
    // Add insights
    doc.setFontSize(14);
    doc.text('Insights', 20, 170);
    
    const insights = document.querySelectorAll('.insight-card');
    let yOffset = 180;
    
    insights.forEach(insight => {
        const title = insight.querySelector('h6').textContent;
        const content = insight.querySelector('p').textContent;
        
        doc.setFontSize(12);
        doc.text(title, 20, yOffset);
        doc.setFontSize(10);
        doc.text(content, 20, yOffset + 7);
        
        yOffset += 20;
    });
    
    // Save the PDF
    doc.save('anomaly-analysis.pdf');
    showNotification('Anomaly analysis exported successfully', 'success');
}

function setAnomalyAlert() {
    const modal = new bootstrap.Modal(document.getElementById('alertSettingsModal'));
    const modalBody = document.querySelector('#alertSettingsModal .modal-body');
    
    modalBody.innerHTML = `
        <h5>Set Anomaly Alert</h5>
        <form id="anomalyAlertForm">
            <div class="mb-3">
                <label class="form-label">Threshold</label>
                <input type="number" class="form-control" name="threshold" placeholder="Enter threshold value">
            </div>
            <div class="mb-3">
                <label class="form-label">Alert Type</label>
                <select class="form-select" name="alertType">
                    <option value="email">Email</option>
                    <option value="notification">In-app Notification</option>
                    <option value="both">Both</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Frequency</label>
                <select class="form-select" name="frequency">
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Alert</button>
        </form>
    `;
    
    modal.show();
    
    // Handle form submission
    document.getElementById('anomalyAlertForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const alertSettings = Object.fromEntries(formData.entries());
        
        // Save alert settings
        saveAnomalyAlert(alertSettings);
        modal.hide();
        showNotification('Anomaly alert settings saved successfully', 'success');
    });
}

function saveAnomalyAlert(settings) {
    // Implementation for saving alert settings
    console.log('Saving alert settings:', settings);
}

// Interactive Features
function viewTrendDetails(metric) {
    const modal = new bootstrap.Modal(document.getElementById('trendDetailsModal'));
    const modalBody = document.querySelector('#trendDetailsModal .modal-body');
    
    // Fetch detailed data for the metric
    fetch(`/api/trend-details?metric=${encodeURIComponent(metric)}`)
        .then(response => response.json())
        .then(data => {
            modalBody.innerHTML = `
                <h4>${metric} Trend Analysis</h4>
                <div class="trend-details-grid">
                    <div class="trend-card">
                        <h5>Current Value</h5>
                        <p class="value">$${data.currentValue.toLocaleString()}</p>
                    </div>
                    <div class="trend-card">
                        <h5>Previous Value</h5>
                        <p class="value">$${data.previousValue.toLocaleString()}</p>
                    </div>
                    <div class="trend-card">
                        <h5>Change</h5>
                        <p class="value ${data.change >= 0 ? 'text-success' : 'text-danger'}">
                            ${data.change >= 0 ? '+' : ''}${data.change}%
                        </p>
                    </div>
                    <div class="trend-card">
                        <h5>Forecast</h5>
                        <p class="value">$${data.forecast.toLocaleString()}</p>
                    </div>
                </div>
                <div class="trend-chart mt-4">
                    <canvas id="trendDetailsChart"></canvas>
                </div>
            `;
            
            modal.show();
            
            // Initialize detailed trend chart
            const ctx = document.getElementById('trendDetailsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: metric,
                        data: data.values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `${metric} Trend`
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `$${context.raw.toLocaleString()}`;
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
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching trend details:', error);
            showNotification('Failed to load trend details', 'error');
        });
}

// Export functions
window.viewTrendDetails = function(metric) {
    showNotification(`Loading details for ${metric}...`, 'info');
    viewTrendDetails(metric);
};

window.exportTrendReport = function(metric) {
    showNotification(`Generating report for ${metric}...`, 'info');
    // Implement metric-specific report export
};

// Add new function for detailed metrics view
function showDetailedMetrics(metric, period, value) {
    const modal = new bootstrap.Modal(document.getElementById('trendDetailsModal'));
    const modalBody = document.querySelector('#trendDetailsModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>${metric} - ${period}</h4>
        <div class="metrics-grid">
            <div class="metric-card">
                <h5>Value</h5>
                <p class="value">$${value.toLocaleString()}</p>
            </div>
            <div class="metric-card">
                <h5>Change from Previous</h5>
                <p class="value">${calculateChange(metric, period)}</p>
            </div>
            <div class="metric-card">
                <h5>Trend</h5>
                <p class="value">${calculateTrend(metric, period)}</p>
            </div>
            <div class="metric-card">
                <h5>Forecast</h5>
                <p class="value">${calculateForecast(metric, period)}</p>
            </div>
        </div>
        <div class="trend-chart mt-4">
            <canvas id="detailedMetricsChart"></canvas>
        </div>
    `;
    
    modal.show();
    
    // Initialize detailed metrics chart
    const ctx = document.getElementById('detailedMetricsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: getHistoricalData(metric).labels,
            datasets: [{
                label: metric,
                data: getHistoricalData(metric).values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                ...pointOptions
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${metric} Historical Trend`
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        point1: {
                            type: 'point',
                            xValue: period,
                            yValue: value,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 2,
                            radius: 5,
                            label: {
                                enabled: true,
                                content: 'Selected Point',
                                position: 'top'
                            }
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
            }
        }
    });
}

// Helper functions for detailed metrics
function calculateChange(metric, period) {
    // Implementation for calculating change from previous period
    return '+10%';
}

function calculateTrend(metric, period) {
    // Implementation for calculating trend
    return 'Upward';
}

function calculateForecast(metric, period) {
    // Implementation for calculating forecast
    return '$2,400,000';
}

function getHistoricalData(metric) {
    // Implementation for getting historical data
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [1200000, 1500000, 1800000, 1600000, 2000000, 2200000]
    };
}

function showCorrelationAnalysis(data) {
    const modal = new bootstrap.Modal(document.getElementById('trendDetailsModal'));
    const modalBody = document.querySelector('#trendDetailsModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>Correlation Analysis</h4>
        <div class="correlation-details">
            <div class="metric-card">
                <h5>Metrics</h5>
                <p>${data.metric1} vs ${data.metric2}</p>
            </div>
            <div class="metric-card">
                <h5>Correlation</h5>
                <p>${data.correlation}</p>
            </div>
            <div class="metric-card">
                <h5>Strength</h5>
                <p>${data.strength}</p>
            </div>
            <div class="metric-card">
                <h5>Confidence</h5>
                <p>${data.confidence}%</p>
            </div>
        </div>
        <div class="analysis-controls mt-3">
            <div class="btn-group" role="group">
                <button class="btn btn-outline-primary" onclick="toggleCorrelationView('scatter')">
                    <i class="fas fa-chart-scatter"></i> Scatter Plot
                </button>
                <button class="btn btn-outline-primary" onclick="toggleCorrelationView('heatmap')">
                    <i class="fas fa-th"></i> Correlation Heatmap
                </button>
                <button class="btn btn-outline-primary" onclick="toggleCorrelationView('timeline')">
                    <i class="fas fa-chart-line"></i> Timeline
                </button>
            </div>
            <div class="btn-group ms-2" role="group">
                <button class="btn btn-outline-secondary" onclick="exportCorrelationAnalysis()">
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-outline-secondary" onclick="setCorrelationAlert()">
                    <i class="fas fa-bell"></i> Set Alert
                </button>
            </div>
        </div>
        <div class="trend-chart mt-4">
            <canvas id="correlationChart"></canvas>
        </div>
        <div class="correlation-insights mt-3">
            <h5>Insights</h5>
            <div class="insights-list">
                ${generateCorrelationInsights(data)}
            </div>
        </div>
    `;
    
    modal.show();
    
    // Initialize correlation chart with enhanced options
    const ctx = document.getElementById('correlationChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Correlation',
                data: data.correlationData,
                backgroundColor: function(context) {
                    const value = context.raw.v;
                    return getCorrelationColor(value);
                },
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Correlation Analysis'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const data = context.dataset.data[context.dataIndex];
                            return [
                                `${data.metric1}: $${data.x.toLocaleString()}`,
                                `${data.metric2}: $${data.y.toLocaleString()}`,
                                `Correlation: ${data.v}`
                            ];
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: data.metric1
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: data.metric2
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function toggleCorrelationView(viewType) {
    const chart = Chart.getChart('correlationChart');
    if (!chart) return;

    switch(viewType) {
        case 'scatter':
            updateCorrelationScatterView(chart);
            break;
        case 'heatmap':
            updateCorrelationHeatmapView(chart);
            break;
        case 'timeline':
            updateCorrelationTimelineView(chart);
            break;
    }
}

function updateCorrelationScatterView(chart) {
    chart.config.type = 'scatter';
    chart.update();
}

function updateCorrelationHeatmapView(chart) {
    const ctx = document.getElementById('correlationChart').getContext('2d');
    const heatmapData = generateCorrelationHeatmapData(chart.data);
    
    new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                data: heatmapData,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    return getCorrelationHeatmapColor(value);
                },
                borderWidth: 1,
                borderColor: '#fff',
                width: ({ chart }) => (chart.chartArea || {}).width / heatmapData.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / heatmapData.length - 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const data = context[0].dataset.data[context[0].dataIndex];
                            return `${data.x} vs ${data.y}`;
                        },
                        label: function(context) {
                            const data = context.dataset.data[context.dataIndex];
                            return `Correlation: ${data.v}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    offset: true
                },
                y: {
                    type: 'category',
                    offset: true
                }
            }
        }
    });
}

function updateCorrelationTimelineView(chart) {
    const ctx = document.getElementById('correlationChart').getContext('2d');
    const timelineData = generateCorrelationTimelineData(chart.data);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timelineData.labels,
            datasets: [
                {
                    label: chart.data.datasets[0].label,
                    data: timelineData.values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Correlation: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: -1,
                    max: 1,
                    ticks: {
                        stepSize: 0.2
                    }
                }
            }
        }
    });
}

function generateCorrelationHeatmapData(chartData) {
    const heatmapData = [];
    const metrics = ['Revenue', 'Expenses', 'Profit', 'Patient Count', 'Average Stay'];
    
    for (let i = 0; i < metrics.length; i++) {
        for (let j = 0; j < metrics.length; j++) {
            heatmapData.push({
                x: metrics[i],
                y: metrics[j],
                v: i === j ? 1 : Math.random() * 2 - 1
            });
        }
    }
    
    return heatmapData;
}

function getCorrelationHeatmapColor(value) {
    const intensity = Math.abs(value);
    const hue = value > 0 ? 120 : 0;
    return `hsla(${hue}, 70%, ${50 + intensity * 25}%, 0.8)`;
}

function generateCorrelationInsights(data) {
    const insights = [];
    
    // Add correlation strength insight
    insights.push(`
        <div class="insight-card">
            <h6>Correlation Strength</h6>
            <p>The correlation between ${data.metric1} and ${data.metric2} is ${data.strength} (${data.correlation}).</p>
        </div>
    `);
    
    // Add trend insight
    if (data.correlation > 0.7) {
        insights.push(`
            <div class="insight-card">
                <h6>Strong Positive Correlation</h6>
                <p>These metrics show a strong positive relationship, suggesting they tend to move together.</p>
            </div>
        `);
    } else if (data.correlation < -0.7) {
        insights.push(`
            <div class="insight-card">
                <h6>Strong Negative Correlation</h6>
                <p>These metrics show a strong negative relationship, suggesting they tend to move in opposite directions.</p>
            </div>
        `);
    } else {
        insights.push(`
            <div class="insight-card">
                <h6>Weak Correlation</h6>
                <p>These metrics show a weak relationship, suggesting they may not be directly related.</p>
            </div>
        `);
    }
    
    // Add confidence insight
    insights.push(`
        <div class="insight-card">
            <h6>Statistical Confidence</h6>
            <p>This correlation has a ${data.confidence}% confidence level, indicating ${data.confidence > 95 ? 'high' : 'moderate'} statistical reliability.</p>
        </div>
    `);
    
    return insights.join('');
}

function setCorrelationAlert() {
    const modal = new bootstrap.Modal(document.getElementById('alertSettingsModal'));
    const modalBody = document.querySelector('#alertSettingsModal .modal-body');
    
    modalBody.innerHTML = `
        <h5>Set Correlation Alert</h5>
        <form id="correlationAlertForm">
            <div class="mb-3">
                <label class="form-label">Correlation Threshold</label>
                <input type="number" class="form-control" name="threshold" min="-1" max="1" step="0.1" placeholder="Enter correlation threshold">
            </div>
            <div class="mb-3">
                <label class="form-label">Alert Type</label>
                <select class="form-select" name="alertType">
                    <option value="email">Email</option>
                    <option value="notification">In-app Notification</option>
                    <option value="both">Both</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Frequency</label>
                <select class="form-select" name="frequency">
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Alert Conditions</label>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="conditions" value="increase" id="increaseCheck">
                    <label class="form-check-label" for="increaseCheck">Correlation Increase</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="conditions" value="decrease" id="decreaseCheck">
                    <label class="form-check-label" for="decreaseCheck">Correlation Decrease</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="conditions" value="threshold" id="thresholdCheck">
                    <label class="form-check-label" for="thresholdCheck">Threshold Cross</label>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Save Alert</button>
        </form>
    `;
    
    modal.show();
    
    // Handle form submission
    document.getElementById('correlationAlertForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const alertSettings = Object.fromEntries(formData.entries());
        
        // Save alert settings
        saveCorrelationAlert(alertSettings);
        modal.hide();
        showNotification('Correlation alert settings saved successfully', 'success');
    });
}

function saveCorrelationAlert(settings) {
    // Implementation for saving correlation alert settings
    console.log('Saving correlation alert settings:', settings);
}

function showSeasonalAnalysis(data) {
    const modal = new bootstrap.Modal(document.getElementById('trendDetailsModal'));
    const modalBody = document.querySelector('#trendDetailsModal .modal-body');
    
    modalBody.innerHTML = `
        <h4>Seasonal Pattern Analysis</h4>
        <div class="seasonal-details">
            <div class="metric-card">
                <h5>Metric</h5>
                <p>${data.metric}</p>
            </div>
            <div class="metric-card">
                <h5>Pattern</h5>
                <p>${data.pattern}</p>
            </div>
            <div class="metric-card">
                <h5>Confidence</h5>
                <p>${data.confidence}%</p>
            </div>
            <div class="metric-card">
                <h5>Seasonal Impact</h5>
                <p>${data.seasonalImpact}%</p>
            </div>
        </div>
        <div class="analysis-controls mt-3">
            <div class="btn-group" role="group">
                <button class="btn btn-outline-primary" onclick="toggleSeasonalView('timeline')">
                    <i class="fas fa-chart-line"></i> Timeline
                </button>
                <button class="btn btn-outline-primary" onclick="toggleSeasonalView('decomposition')">
                    <i class="fas fa-layer-group"></i> Decomposition
                </button>
                <button class="btn btn-outline-primary" onclick="toggleSeasonalView('calendar')">
                    <i class="fas fa-calendar-alt"></i> Calendar
                </button>
            </div>
            <div class="btn-group ms-2" role="group">
                <button class="btn btn-outline-secondary" onclick="exportSeasonalAnalysis()">
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-outline-secondary" onclick="setSeasonalAlert()">
                    <i class="fas fa-bell"></i> Set Alert
                </button>
            </div>
        </div>
        <div class="trend-chart mt-4">
            <canvas id="seasonalChart"></canvas>
        </div>
        <div class="seasonal-insights mt-3">
            <h5>Insights</h5>
            <div class="insights-list">
                ${generateSeasonalInsights(data)}
            </div>
        </div>
    `;
    
    modal.show();
    
    // Initialize seasonal chart with enhanced options
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.seasonalData.labels,
            datasets: [
                {
                    label: 'Actual',
                    data: data.seasonalData.actual,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Seasonal Pattern',
                    data: data.seasonalData.pattern,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'Trend',
                    data: data.seasonalData.trend,
                    borderColor: 'rgba(54, 162, 235, 0.5)',
                    borderDash: [2, 2],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Seasonal Pattern Analysis'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
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
                    }
                }
            }
        }
    });
}

function toggleSeasonalView(viewType) {
    const chart = Chart.getChart('seasonalChart');
    if (!chart) return;

    switch(viewType) {
        case 'timeline':
            updateSeasonalTimelineView(chart);
            break;
        case 'decomposition':
            updateSeasonalDecompositionView(chart);
            break;
        case 'calendar':
            updateSeasonalCalendarView(chart);
            break;
    }
}

function updateSeasonalTimelineView(chart) {
    chart.config.type = 'line';
    chart.update();
}

function updateSeasonalDecompositionView(chart) {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    const decompositionData = generateSeasonalDecompositionData(chart.data);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: decompositionData.labels,
            datasets: [
                {
                    label: 'Trend',
                    data: decompositionData.trend,
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Seasonal',
                    data: decompositionData.seasonal,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Residual',
                    data: decompositionData.residual,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Seasonal Decomposition'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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
}

function updateSeasonalCalendarView(chart) {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    const calendarData = generateSeasonalCalendarData(chart.data);
    
    new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                data: calendarData,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    return getSeasonalCalendarColor(value);
                },
                borderWidth: 1,
                borderColor: '#fff',
                width: ({ chart }) => (chart.chartArea || {}).width / 12 - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / 5 - 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const data = context[0].dataset.data[context[0].dataIndex];
                            return `${data.month} ${data.year}`;
                        },
                        label: function(context) {
                            const data = context.dataset.data[context.dataIndex];
                            return `Value: $${data.v.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                y: {
                    type: 'category',
                    labels: ['2020', '2021', '2022', '2023', '2024']
                }
            }
        }
    });
}

function generateSeasonalDecompositionData(chartData) {
    // Implementation for generating seasonal decomposition data
    return {
        labels: chartData.labels,
        trend: chartData.datasets[2].data,
        seasonal: chartData.datasets[1].data,
        residual: chartData.datasets[0].data.map((value, index) => 
            value - chartData.datasets[1].data[index] - chartData.datasets[2].data[index]
        )
    };
}

function generateSeasonalCalendarData(chartData) {
    const calendarData = [];
    const years = ['2020', '2021', '2022', '2023', '2024'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    years.forEach(year => {
        months.forEach(month => {
            calendarData.push({
                x: month,
                y: year,
                v: Math.random() * 1000000
            });
        });
    });
    
    return calendarData;
}

function getSeasonalCalendarColor(value) {
    const intensity = Math.min(1, value / 1000000);
    return `rgba(75, 192, 192, ${0.3 + intensity * 0.7})`;
}

function generateSeasonalInsights(data) {
    const insights = [];
    
    // Add pattern insight
    insights.push(`
        <div class="insight-card">
            <h6>Pattern Analysis</h6>
            <p>This metric shows a ${data.pattern} pattern with ${data.confidence}% confidence.</p>
        </div>
    `);
    
    // Add seasonal impact insight
    insights.push(`
        <div class="insight-card">
            <h6>Seasonal Impact</h6>
            <p>The seasonal component accounts for ${data.seasonalImpact}% of the total variation in this metric.</p>
        </div>
    `);
    
    // Add trend insight
    if (data.trendDirection === 'up') {
        insights.push(`
            <div class="insight-card">
                <h6>Trend Analysis</h6>
                <p>The underlying trend is upward, suggesting long-term growth despite seasonal fluctuations.</p>
            </div>
        `);
    } else if (data.trendDirection === 'down') {
        insights.push(`
            <div class="insight-card">
                <h6>Trend Analysis</h6>
                <p>The underlying trend is downward, suggesting long-term decline despite seasonal fluctuations.</p>
            </div>
        `);
    } else {
        insights.push(`
            <div class="insight-card">
                <h6>Trend Analysis</h6>
                <p>The underlying trend is stable, with variations primarily driven by seasonal factors.</p>
            </div>
        `);
    }
    
    return insights.join('');
}

function setSeasonalAlert() {
    const modal = new bootstrap.Modal(document.getElementById('alertSettingsModal'));
    const modalBody = document.querySelector('#alertSettingsModal .modal-body');
    
    modalBody.innerHTML = `
        <h5>Set Seasonal Alert</h5>
        <form id="seasonalAlertForm">
            <div class="mb-3">
                <label class="form-label">Deviation Threshold</label>
                <input type="number" class="form-control" name="threshold" min="0" step="0.1" placeholder="Enter deviation threshold (%)">
            </div>
            <div class="mb-3">
                <label class="form-label">Alert Type</label>
                <select class="form-select" name="alertType">
                    <option value="email">Email</option>
                    <option value="notification">In-app Notification</option>
                    <option value="both">Both</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Frequency</label>
                <select class="form-select" name="frequency">
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Seasonal Factors</label>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="factors" value="peak" id="peakCheck">
                    <label class="form-check-label" for="peakCheck">Peak Season</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="factors" value="trough" id="troughCheck">
                    <label class="form-check-label" for="troughCheck">Trough Season</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="factors" value="transition" id="transitionCheck">
                    <label class="form-check-label" for="transitionCheck">Seasonal Transition</label>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Save Alert</button>
        </form>
    `;
    
    modal.show();
    
    // Handle form submission
    document.getElementById('seasonalAlertForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const alertSettings = Object.fromEntries(formData.entries());
        
        // Save alert settings
        saveSeasonalAlert(alertSettings);
        modal.hide();
        showNotification('Seasonal alert settings saved successfully', 'success');
    });
}

function saveSeasonalAlert(settings) {
    // Implementation for saving seasonal alert settings
    console.log('Saving seasonal alert settings:', settings);
} 