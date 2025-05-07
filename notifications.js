// Notification System for Admin Panel

const NotificationSystem = {
    // Notification types
    types: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },

    // Create toast container if it doesn't exist
    init: function() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }
    },

    // Show notification
    show: function(message, type = this.types.INFO, duration = 5000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        document.getElementById('toast-container').appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: duration
        });
        bsToast.show();

        // Remove toast from DOM after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },

    // Show success notification
    success: function(message, duration) {
        this.show(message, this.types.SUCCESS, duration);
    },

    // Show error notification
    error: function(message, duration) {
        this.show(message, this.types.ERROR, duration);
    },

    // Show warning notification
    warning: function(message, duration) {
        this.show(message, this.types.WARNING, duration);
    },

    // Show info notification
    info: function(message, duration) {
        this.show(message, this.types.INFO, duration);
    },

    // Show confirmation dialog
    confirm: function(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Action</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary confirm-btn">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);

        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            bsModal.hide();
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        });

        modal.addEventListener('hidden.bs.modal', () => {
            if (typeof onCancel === 'function') {
                onCancel();
            }
            modal.remove();
        });

        bsModal.show();
    },

    // Show loading indicator
    showLoading: function(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.className = 'loading-indicator';
        loading.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="loading-message">${message}</div>
        `;

        document.body.appendChild(loading);
    },

    // Hide loading indicator
    hideLoading: function() {
        const loading = document.getElementById('loading-indicator');
        if (loading) {
            loading.remove();
        }
    }
};

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .toast-container {
        z-index: 1050;
    }

    .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .loading-message {
        margin-top: 1rem;
        font-size: 1.1rem;
        color: #333;
    }

    body.dark-mode .loading-indicator {
        background: rgba(0, 0, 0, 0.8);
    }

    body.dark-mode .loading-message {
        color: #fff;
    }
`;
document.head.appendChild(style);

// Export notification system
window.NotificationSystem = NotificationSystem; 