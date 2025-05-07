// Appointments Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('appointmentsCalendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                {
                    title: 'Dr. Smith - Cardiology',
                    start: '2024-03-20T10:00:00',
                    end: '2024-03-20T11:00:00',
                    className: 'bg-primary'
                },
                {
                    title: 'Dr. Johnson - Neurology',
                    start: '2024-03-21T14:00:00',
                    end: '2024-03-21T15:00:00',
                    className: 'bg-success'
                }
            ],
            eventClick: function(info) {
                showAppointmentDetails(info.event);
            },
            dateClick: function(info) {
                showNewAppointmentModal(info.date);
            }
        });
        calendar.render();
    }

    // Appointment Details Modal
    function showAppointmentDetails(event) {
        const modal = new bootstrap.Modal(document.getElementById('appointmentDetailsModal'));
        const modalTitle = document.querySelector('#appointmentDetailsModal .modal-title');
        const modalBody = document.querySelector('#appointmentDetailsModal .modal-body');

        modalTitle.textContent = event.title;
        modalBody.innerHTML = `
            <div class="mb-3">
                <strong>Date:</strong> ${event.start.toLocaleDateString()}
            </div>
            <div class="mb-3">
                <strong>Time:</strong> ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}
            </div>
            <div class="mb-3">
                <strong>Status:</strong> <span class="badge bg-success">Confirmed</span>
            </div>
            <div class="mb-3">
                <strong>Notes:</strong>
                <p>Regular checkup appointment</p>
            </div>
        `;

        modal.show();
    }

    // New Appointment Modal
    function showNewAppointmentModal(date) {
        const modal = new bootstrap.Modal(document.getElementById('newAppointmentModal'));
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.value = date.toISOString().split('T')[0];
        }
        modal.show();
    }

    // Handle appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const appointmentData = {
                patient: formData.get('patient'),
                doctor: formData.get('doctor'),
                department: formData.get('department'),
                type: formData.get('type'),
                date: formData.get('date'),
                time: formData.get('time'),
                notes: formData.get('notes')
            };

            // Here you would typically send this data to your backend
            console.log('New appointment:', appointmentData);

            // Add event to calendar
            calendar.addEvent({
                title: `${appointmentData.doctor} - ${appointmentData.department}`,
                start: `${appointmentData.date}T${appointmentData.time}`,
                end: `${appointmentData.date}T${appointmentData.time.split(':')[0] + 1}:00`,
                className: 'bg-primary'
            });

            // Close modal and show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('newAppointmentModal'));
            modal.hide();
            showNotification('Success', 'Appointment scheduled successfully', 'success');
        });
    }

    // Handle appointment status changes
    const statusButtons = document.querySelectorAll('.appointment-status');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentId = this.dataset.id;
            const newStatus = this.dataset.status;
            
            // Here you would typically update the status in your backend
            console.log(`Updating appointment ${appointmentId} to ${newStatus}`);

            // Update UI
            const statusBadge = this.closest('tr').querySelector('.badge');
            if (statusBadge) {
                statusBadge.className = `badge bg-${getStatusColor(newStatus)}`;
                statusBadge.textContent = newStatus;
            }

            showNotification('Success', 'Appointment status updated', 'success');
        });
    });

    // Helper function to get status color
    function getStatusColor(status) {
        const colors = {
            'Scheduled': 'primary',
            'Confirmed': 'success',
            'Cancelled': 'danger',
            'Completed': 'info'
        };
        return colors[status] || 'secondary';
    }

    // Handle appointment search and filters
    const searchInput = document.querySelector('.appointment-search');
    const departmentFilter = document.querySelector('.department-filter');
    const statusFilter = document.querySelector('.status-filter');

    function filterAppointments() {
        const searchTerm = searchInput.value.toLowerCase();
        const department = departmentFilter.value;
        const status = statusFilter.value;

        const rows = document.querySelectorAll('#appointmentsTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowDepartment = row.dataset.department;
            const rowStatus = row.dataset.status;

            const matchesSearch = text.includes(searchTerm);
            const matchesDepartment = !department || rowDepartment === department;
            const matchesStatus = !status || rowStatus === status;

            row.style.display = matchesSearch && matchesDepartment && matchesStatus ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterAppointments);
    if (departmentFilter) departmentFilter.addEventListener('change', filterAppointments);
    if (statusFilter) statusFilter.addEventListener('change', filterAppointments);

    // Handle appointment export
    const exportButtons = document.querySelectorAll('.export-appointments');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            // Here you would typically generate and download the file
            console.log(`Exporting appointments as ${format}`);
            showNotification('Success', `Appointments exported as ${format}`, 'success');
        });
    });
}); 