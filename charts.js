// Chart Utility for Admin Panel

const ChartManager = {
    // Chart types
    types: {
        LINE: 'line',
        BAR: 'bar',
        PIE: 'pie',
        DOUGHNUT: 'doughnut',
        RADAR: 'radar',
        POLAR_AREA: 'polarArea'
    },

    // Default chart options
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    },

    // Create chart
    create: function(canvas, type, data, options = {}) {
        const ctx = canvas.getContext('2d');
        const chartOptions = { ...this.defaultOptions, ...options };

        // Add dark mode support
        if (document.body.classList.contains('dark-mode')) {
            chartOptions.plugins.legend.labels.color = '#fff';
            if (chartOptions.scales) {
                if (chartOptions.scales.x) {
                    chartOptions.scales.x.grid.color = 'rgba(255, 255, 255, 0.1)';
                    chartOptions.scales.x.ticks.color = '#fff';
                }
                if (chartOptions.scales.y) {
                    chartOptions.scales.y.grid.color = 'rgba(255, 255, 255, 0.1)';
                    chartOptions.scales.y.ticks.color = '#fff';
                }
            }
        }

        return new Chart(ctx, {
            type: type,
            data: data,
            options: chartOptions
        });
    },

    // Create line chart
    createLineChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            scales: {
                x: {
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                }
            }
        };

        return this.create(canvas, this.types.LINE, data, { ...defaultOptions, ...options });
    },

    // Create bar chart
    createBarChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                }
            }
        };

        return this.create(canvas, this.types.BAR, data, { ...defaultOptions, ...options });
    },

    // Create pie chart
    createPieChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        };

        return this.create(canvas, this.types.PIE, data, { ...defaultOptions, ...options });
    },

    // Create doughnut chart
    createDoughnutChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '50%'
        };

        return this.create(canvas, this.types.DOUGHNUT, data, { ...defaultOptions, ...options });
    },

    // Create radar chart
    createRadarChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        backdropColor: 'transparent'
                    }
                }
            }
        };

        return this.create(canvas, this.types.RADAR, data, { ...defaultOptions, ...options });
    },

    // Create polar area chart
    createPolarAreaChart: function(canvas, data, options = {}) {
        const defaultOptions = {
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        };

        return this.create(canvas, this.types.POLAR_AREA, data, { ...defaultOptions, ...options });
    },

    // Update chart data
    updateChart: function(chart, newData) {
        chart.data = newData;
        chart.update();
    },

    // Update chart options
    updateOptions: function(chart, newOptions) {
        chart.options = { ...chart.options, ...newOptions };
        chart.update();
    },

    // Destroy chart
    destroyChart: function(chart) {
        if (chart) {
            chart.destroy();
        }
    },

    // Generate random colors
    generateColors: function(count, alpha = 1) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, ${alpha})`);
        }
        return colors;
    },

    // Format chart data
    formatData: function(labels, datasets) {
        return {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor || this.generateColors(1, 0.2)[0],
                borderColor: dataset.borderColor || this.generateColors(1)[0],
                borderWidth: dataset.borderWidth || 2
            }))
        };
    }
};

// Export chart manager
window.ChartManager = ChartManager; 