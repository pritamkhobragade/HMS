// Settings Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle hospital information form
    const hospitalForm = document.getElementById('hospitalForm');
    if (hospitalForm) {
        hospitalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const hospitalData = {
                name: formData.get('name'),
                type: formData.get('type'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                website: formData.get('website'),
                timezone: formData.get('timezone')
            };

            // Here you would typically send this data to your backend
            console.log('Updating hospital information:', hospitalData);
            showNotification('Success', 'Hospital information updated successfully', 'success');
        });
    }

    // Handle user management
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                role: formData.get('role'),
                department: formData.get('department'),
                status: formData.get('status')
            };

            // Here you would typically send this data to your backend
            console.log('Adding new user:', userData);

            // Add user to table
            addUserToList({
                id: Date.now(),
                ...userData,
                lastLogin: new Date().toISOString()
            });

            // Close modal and show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('newUserModal'));
            modal.hide();
            showNotification('Success', 'User added successfully', 'success');
        });
    }

    // Add user to list
    function addUserToList(user) {
        const tbody = document.querySelector('#usersTable tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.department}</td>
                <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>${new Date(user.lastLogin).toLocaleString()}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-primary" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.insertBefore(tr, tbody.firstChild);
        }
    }

    // Handle system configuration
    const systemForm = document.getElementById('systemForm');
    if (systemForm) {
        systemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const systemData = {
                language: formData.get('language'),
                dateFormat: formData.get('dateFormat'),
                timeFormat: formData.get('timeFormat'),
                timezone: formData.get('timezone'),
                sessionTimeout: formData.get('sessionTimeout'),
                maintenanceMode: formData.get('maintenanceMode') === 'on'
            };

            // Here you would typically send this data to your backend
            console.log('Updating system configuration:', systemData);
            showNotification('Success', 'System configuration updated successfully', 'success');
        });
    }

    // Handle notification settings
    const notificationForm = document.getElementById('notificationForm');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const notificationData = {
                emailNotifications: formData.get('emailNotifications') === 'on',
                systemNotifications: formData.get('systemNotifications') === 'on',
                appointmentReminders: formData.get('appointmentReminders') === 'on',
                billingAlerts: formData.get('billingAlerts') === 'on',
                securityAlerts: formData.get('securityAlerts') === 'on'
            };

            // Here you would typically send this data to your backend
            console.log('Updating notification settings:', notificationData);
            showNotification('Success', 'Notification settings updated successfully', 'success');
        });
    }

    // Handle backup and restore
    const backupForm = document.getElementById('backupForm');
    if (backupForm) {
        backupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const backupData = {
                type: formData.get('backupType'),
                schedule: formData.get('backupSchedule'),
                retention: formData.get('retentionPeriod')
            };

            // Here you would typically send this data to your backend
            console.log('Creating backup:', backupData);

            // Add backup to list
            addBackupToList({
                id: Date.now(),
                type: backupData.type,
                date: new Date().toISOString(),
                size: '2.5 MB',
                status: 'Completed'
            });

            showNotification('Success', 'Backup created successfully', 'success');
        });
    }

    // Add backup to list
    function addBackupToList(backup) {
        const tbody = document.querySelector('#backupsTable tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${backup.id}</td>
                <td>${backup.type}</td>
                <td>${new Date(backup.date).toLocaleString()}</td>
                <td>${backup.size}</td>
                <td><span class="badge bg-success">${backup.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-success" title="Download Backup">
                            <i class="fas fa-download"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" title="Delete Backup">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.insertBefore(tr, tbody.firstChild);
        }
    }

    // Handle user search and filters
    const searchInput = document.querySelector('.user-search');
    const roleFilter = document.querySelector('.role-filter');
    const statusFilter = document.querySelector('.status-filter');

    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const role = roleFilter.value;
        const status = statusFilter.value;

        const rows = document.querySelectorAll('#usersTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowRole = row.dataset.role;
            const rowStatus = row.dataset.status;

            const matchesSearch = text.includes(searchTerm);
            const matchesRole = !role || rowRole === role;
            const matchesStatus = !status || rowStatus === status;

            row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterUsers);
    if (roleFilter) roleFilter.addEventListener('change', filterUsers);
    if (statusFilter) statusFilter.addEventListener('change', filterUsers);

    // Handle user actions
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.title.toLowerCase();
        const row = target.closest('tr');
        const userId = row.querySelector('td:first-child').textContent;

        switch (action) {
            case 'edit user':
                editUser(userId);
                break;
            case 'delete user':
                deleteUser(userId, row);
                break;
            case 'download backup':
                downloadBackup(userId);
                break;
            case 'delete backup':
                deleteBackup(userId, row);
                break;
        }
    });

    // Edit user
    function editUser(userId) {
        // Here you would typically fetch user data and show edit modal
        console.log(`Editing user ${userId}`);
        showNotification('Info', 'Opening user editor...', 'info');
    }

    // Delete user
    function deleteUser(userId, row) {
        if (confirm('Are you sure you want to delete this user?')) {
            // Here you would typically delete the user from your backend
            console.log(`Deleting user ${userId}`);
            row.remove();
            showNotification('Success', 'User deleted successfully', 'success');
        }
    }

    // Download backup
    function downloadBackup(backupId) {
        // Here you would typically generate and download the backup file
        console.log(`Downloading backup ${backupId}`);
        showNotification('Success', 'Backup download started', 'success');
    }

    // Delete backup
    function deleteBackup(backupId, row) {
        if (confirm('Are you sure you want to delete this backup?')) {
            // Here you would typically delete the backup from your backend
            console.log(`Deleting backup ${backupId}`);
            row.remove();
            showNotification('Success', 'Backup deleted successfully', 'success');
        }
    }

    // Handle maintenance mode toggle
    const maintenanceToggle = document.querySelector('#maintenanceMode');
    if (maintenanceToggle) {
        maintenanceToggle.addEventListener('change', function() {
            const enabled = this.checked;
            // Here you would typically update maintenance mode in your backend
            console.log(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
            showNotification('Info', `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
        });
    }
}); 