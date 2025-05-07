// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation and submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic form validation
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            // Get submit button and show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

            try {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    department: document.getElementById('department').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    message: document.getElementById('message').value
                };

                // Simulate API call with timeout
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showAlert('Appointment booked successfully! We will contact you shortly.', 'success');
                
                // Reset form
                this.reset();
                this.classList.remove('was-validated');
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    // Add fade-in animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Doctor profile buttons
    const profileButtons = document.querySelectorAll('.btn-outline-primary');
    profileButtons.forEach(button => {
        button.addEventListener('click', function() {
            const doctorName = this.parentElement.querySelector('.card-title').textContent;
            const doctorSpecialty = this.parentElement.querySelector('.card-text').textContent;
            showAlert(`Viewing profile of ${doctorName} - ${doctorSpecialty}`, 'info');
        });
    });

    // Form validation feedback
    const formInputs = document.querySelectorAll('#appointmentForm input, #appointmentForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });
    });

    // Enhanced Chat Widget Functionality
    const chatButton = document.querySelector('.chat-widget-button');
    const chatContainer = document.querySelector('.chat-widget-container');
    const closeButton = document.querySelector('.close-chat');
    const messageInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-message');
    const messagesContainer = document.querySelector('.chat-widget-messages');
    const notificationBadge = document.querySelector('.notification-badge');
    const typingIndicator = document.querySelector('.typing-indicator');
    const attachFileButton = document.querySelector('#attachFile');
    const fileInput = document.querySelector('#fileInput');
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');
    const emojiButton = document.querySelector('#emojiButton');
    const emojiPicker = document.querySelector('#emojiPicker');
    const emojiList = document.querySelector('#emojiList');
    const chatFeedback = document.querySelector('#chatFeedback');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const feedbackText = document.querySelector('#feedbackText');
    const submitFeedback = document.querySelector('#submitFeedback');

    let unreadMessages = 0;
    let isTyping = false;
    let typingTimeout;

    // Emoji data
    const emojis = {
        recent: ['😊', '👍', '❤️', '🙏', '🎉'],
        smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋'],
        people: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍'],
        nature: ['🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼']
    };

    // Initialize emoji picker
    function initEmojiPicker() {
        // Populate emoji list
        function populateEmojis(category) {
            emojiList.innerHTML = '';
            emojis[category].forEach(emoji => {
                const emojiItem = document.createElement('div');
                emojiItem.className = 'emoji-item';
                emojiItem.textContent = emoji;
                emojiItem.setAttribute('role', 'button');
                emojiItem.setAttribute('tabindex', '0');
                emojiItem.addEventListener('click', () => insertEmoji(emoji));
                emojiItem.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        insertEmoji(emoji);
                    }
                });
                emojiList.appendChild(emojiItem);
            });
        }

        // Insert emoji into input
        function insertEmoji(emoji) {
            messageInput.value += emoji;
            messageInput.focus();
            emojiPicker.classList.remove('show');
        }

        // Show emoji picker
        emojiButton.addEventListener('click', () => {
            emojiPicker.classList.toggle('show');
            if (emojiPicker.classList.contains('show')) {
                populateEmojis('recent');
            }
        });

        // Handle emoji categories
        document.querySelectorAll('.emoji-category').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.emoji-category.active').classList.remove('active');
                button.classList.add('active');
                populateEmojis(button.dataset.category);
            });
        });

        // Close emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!emojiPicker.contains(e.target) && !emojiButton.contains(e.target)) {
                emojiPicker.classList.remove('show');
            }
        });
    }

    // Enhanced file handling with image preview
    function handleFileUpload(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message image-preview';
                messageDiv.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Show typing indicator
                showTypingIndicator();
                
                // Simulate support response
                setTimeout(() => {
                    hideTypingIndicator();
                    addMessage("I've received your image. How can I help you with it?", 'support');
                }, 1500);
            };
            reader.readAsDataURL(file);
        } else {
            addFileMessage(file);
        }
    }

    // Enhanced chat feedback system
    function initChatFeedback() {
        let selectedRating = 0;
        let selectedCategories = new Set();

        // Enhanced feedback categories with hospital-specific options
        const feedbackCategories = [
            { id: 'response_time', label: 'Response Time', icon: 'fa-clock' },
            { id: 'helpfulness', label: 'Helpfulness', icon: 'fa-hand-holding-heart' },
            { id: 'clarity', label: 'Clarity of Information', icon: 'fa-comment-medical' },
            { id: 'ease_of_use', label: 'Ease of Use', icon: 'fa-mouse-pointer' },
            { id: 'medical_info', label: 'Medical Information Quality', icon: 'fa-stethoscope' },
            { id: 'privacy', label: 'Privacy & Security', icon: 'fa-shield-alt' },
            { id: 'accessibility', label: 'Accessibility', icon: 'fa-universal-access' },
            { id: 'follow_up', label: 'Follow-up Support', icon: 'fa-phone-alt' }
        ];

        // Create feedback categories
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'feedback-categories';
        feedbackCategories.forEach(category => {
            const checkbox = document.createElement('div');
            checkbox.className = 'form-check';
            checkbox.innerHTML = `
                <input class="form-check-input" type="checkbox" id="${category.id}" value="${category.id}">
                <label class="form-check-label" for="${category.id}">
                    <i class="fas ${category.icon} me-2"></i>${category.label}
                </label>
            `;
            categoriesContainer.appendChild(checkbox);
        });

        // Insert categories before the textarea
        const feedbackText = document.querySelector('#feedbackText');
        feedbackText.parentNode.insertBefore(categoriesContainer, feedbackText);

        // Handle rating selection with enhanced visual feedback
        ratingButtons.forEach(button => {
            button.addEventListener('click', () => {
                selectedRating = parseInt(button.dataset.rating);
                ratingButtons.forEach(btn => {
                    const icon = btn.querySelector('i');
                    if (parseInt(btn.dataset.rating) <= selectedRating) {
                        icon.className = 'fas fa-star';
                        btn.classList.add('active');
                    } else {
                        icon.className = 'far fa-star';
                        btn.classList.remove('active');
                    }
                });
            });

            // Enhanced keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' && selectedRating < 5) {
                    ratingButtons[selectedRating].click();
                } else if (e.key === 'ArrowLeft' && selectedRating > 1) {
                    ratingButtons[selectedRating - 2].click();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Handle category selection
        document.querySelectorAll('.feedback-categories input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedCategories.add(checkbox.value);
                } else {
                    selectedCategories.delete(checkbox.value);
                }
            });
        });

        // Enhanced submit feedback
        submitFeedback.addEventListener('click', () => {
            if (selectedRating > 0) {
                const feedback = {
                    rating: selectedRating,
                    categories: Array.from(selectedCategories),
                    comment: feedbackText.value,
                    timestamp: new Date().toISOString()
                };
                
                // Here you would typically send the feedback to your server
                console.log('Feedback submitted:', feedback);
                
                // Show enhanced thank you message
                const thankYouMessage = document.createElement('div');
                thankYouMessage.className = 'message system';
                thankYouMessage.innerHTML = `
                    <div class="feedback-thank-you">
                        <i class="fas fa-check-circle text-success"></i>
                        <p>Thank you for your feedback!</p>
                        <p class="small text-muted">Your input helps us improve our service.</p>
                    </div>
                `;
                messagesContainer.appendChild(thankYouMessage);
                
                // Close feedback form with animation
                chatFeedback.classList.add('fade-out');
                setTimeout(() => {
                    chatFeedback.classList.remove('show', 'fade-out');
                }, 300);
                
                // Reset feedback form
                selectedRating = 0;
                selectedCategories.clear();
                feedbackText.value = '';
                ratingButtons.forEach(btn => {
                    btn.querySelector('i').className = 'far fa-star';
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.feedback-categories input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            } else {
                // Show error message if no rating selected
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-warning';
                errorMessage.textContent = 'Please select a rating before submitting.';
                chatFeedback.insertBefore(errorMessage, submitFeedback);
                setTimeout(() => errorMessage.remove(), 3000);
            }
        });
    }

    // Show feedback form after chat ends
    function showFeedbackForm() {
        chatFeedback.classList.add('show');
    }

    // Initialize new features
    initEmojiPicker();
    initChatFeedback();

    // Update file input handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // Add keyboard navigation for quick replies
    quickReplyButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Toggle chat window
    chatButton.addEventListener('click', function() {
        chatContainer.classList.toggle('show');
        if (chatContainer.classList.contains('show')) {
            unreadMessages = 0;
            updateNotificationBadge();
            messageInput.focus();
        }
    });

    // Close chat window
    closeButton.addEventListener('click', function() {
        chatContainer.classList.remove('show');
    });

    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.classList.add('show');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.classList.remove('show');
    }

    // Handle file attachment
    attachFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Enhanced file handling
    function addFileMessage(file) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message attachment';
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        messageDiv.innerHTML = `
            <i class="fas ${fileIcon}"></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate support response for file
        setTimeout(() => {
            hideTypingIndicator();
            addMessage("I've received your file. How can I help you with it?", 'support');
            
            // Add quick replies for file handling
            const quickReplies = document.createElement('div');
            quickReplies.className = 'quick-replies';
            quickReplies.innerHTML = `
                <button class="quick-reply-btn" data-reply="Please review this document">Review Document</button>
                <button class="quick-reply-btn" data-reply="I need to upload another file">Upload Another</button>
            `;
            messagesContainer.appendChild(quickReplies);
            
            // Add event listeners to new quick reply buttons
            quickReplies.querySelectorAll('.quick-reply-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const reply = button.dataset.reply;
                    messageInput.value = reply;
                    sendMessage();
                    quickReplies.style.display = 'none';
                });
            });
        }, 1500);
    }

    // Get file icon based on type
    function getFileIcon(type) {
        if (type.startsWith('image/')) return 'fa-image';
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word')) return 'fa-file-word';
        return 'fa-file';
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update notification badge
    function updateNotificationBadge() {
        if (unreadMessages > 0) {
            notificationBadge.textContent = unreadMessages;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add welcome message
    setTimeout(() => {
        addMessage("Welcome to MediCare! How can we assist you today?", 'system');
    }, 500);

    // Enhanced response templates with context awareness
    const responseTemplates = {
        greeting: [
            "Hello! How can I assist you today?",
            "Welcome to MediCare! How may I help you?",
            "Hi there! What can I do for you today?"
        ],
        appointment: [
            "I can help you schedule an appointment. Would you like to book one now?",
            "You can book an appointment through our online system or by calling our reception.",
            "I'll be happy to guide you through the appointment booking process."
        ],
        emergency: [
            "For emergencies, please call our emergency hotline immediately at (123) 456-7890.",
            "If this is an emergency, please call (123) 456-7890 right away.",
            "For urgent medical attention, please call our emergency number: (123) 456-7890."
        ],
        records: [
            "You can access your medical records through our patient portal. Would you like me to guide you through the process?",
            "To access your medical records, you'll need to log in to our secure patient portal.",
            "I can help you set up access to your medical records. Do you already have a patient portal account?"
        ],
        insurance: [
            "We accept most major insurance plans. Would you like me to check if your plan is covered?",
            "I can help you verify your insurance coverage. Do you have your insurance card handy?",
            "Let me guide you through our insurance verification process."
        ],
        directions: [
            "We're located at 123 Medical Center Drive. Would you like detailed directions?",
            "I can provide you with directions to our hospital. Are you coming from the north or south?",
            "We have plenty of parking available. Would you like information about parking locations?"
        ]
    };

    // Enhanced quick reply categories with hospital-specific options
    const quickReplyCategories = {
        general: [
            { text: "Book Appointment", reply: "I need to book an appointment" },
            { text: "Operating Hours", reply: "What are your operating hours?" },
            { text: "Emergency Help", reply: "I have an emergency" }
        ],
        records: [
            { text: "Access Records", reply: "How do I access my medical records?" },
            { text: "Update Information", reply: "I need to update my personal information" },
            { text: "View Test Results", reply: "How can I view my test results?" },
            { text: "Request Records", reply: "I need to request my medical records" },
            { text: "Share Records", reply: "How can I share my records with another doctor?" }
        ],
        insurance: [
            { text: "Insurance Info", reply: "What insurance plans do you accept?" },
            { text: "Verify Coverage", reply: "Can you verify my insurance coverage?" },
            { text: "Payment Options", reply: "What payment options are available?" },
            { text: "Financial Aid", reply: "Do you offer any financial assistance programs?" },
            { text: "Billing Questions", reply: "I have questions about my bill" }
        ],
        location: [
            { text: "Directions", reply: "How do I get to the hospital?" },
            { text: "Parking Info", reply: "Where can I park?" },
            { text: "Public Transport", reply: "What public transport options are available?" },
            { text: "Wheelchair Access", reply: "Is the facility wheelchair accessible?" },
            { text: "Visitor Info", reply: "What are the visitor policies?" }
        ],
        services: [
            { text: "Available Services", reply: "What medical services do you offer?" },
            { text: "Specialists", reply: "Which specialists are available?" },
            { text: "Lab Services", reply: "Do you provide laboratory services?" },
            { text: "Imaging", reply: "What imaging services are available?" },
            { text: "Pharmacy", reply: "Is there an on-site pharmacy?" }
        ],
        covid: [
            { text: "COVID Testing", reply: "How can I get a COVID-19 test?" },
            { text: "Vaccination", reply: "Do you offer COVID-19 vaccinations?" },
            { text: "Safety Measures", reply: "What COVID-19 safety measures are in place?" },
            { text: "Visitor Policy", reply: "What is your COVID-19 visitor policy?" }
        ],
        prescriptions: [
            { text: "Refill Request", reply: "How do I request a prescription refill?" },
            { text: "New Prescription", reply: "How do I get a new prescription?" },
            { text: "Pharmacy Hours", reply: "What are the pharmacy hours?" },
            { text: "Delivery Options", reply: "Do you offer prescription delivery?" }
        ]
    };

    // Update the feedback categories creation
    function createFeedbackCategories() {
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'feedback-categories';
        
        feedbackCategories.forEach(category => {
            const checkbox = document.createElement('div');
            checkbox.className = 'form-check';
            checkbox.innerHTML = `
                <input class="form-check-input" type="checkbox" id="${category.id}" value="${category.id}">
                <label class="form-check-label" for="${category.id}">
                    <i class="fas ${category.icon} me-2"></i>${category.label}
                </label>
            `;
            categoriesContainer.appendChild(checkbox);
        });
        
        return categoriesContainer;
    }

    // Update the showContextQuickReplies function
    function showContextQuickReplies(context) {
        const quickReplies = document.createElement('div');
        quickReplies.className = 'quick-replies';
        quickReplies.setAttribute('role', 'group');
        quickReplies.setAttribute('aria-label', 'Quick reply options');

        // Get relevant categories based on context
        let relevantCategories = [quickReplyCategories.general];
        if (context === 'records') relevantCategories.push(quickReplyCategories.records);
        if (context === 'insurance') relevantCategories.push(quickReplyCategories.insurance);
        if (context === 'location') relevantCategories.push(quickReplyCategories.location);
        if (context === 'services') relevantCategories.push(quickReplyCategories.services);
        if (context === 'covid') relevantCategories.push(quickReplyCategories.covid);
        if (context === 'prescriptions') relevantCategories.push(quickReplyCategories.prescriptions);

        // Create category sections
        relevantCategories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'quick-reply-category';
            
            category.forEach(item => {
                const button = document.createElement('button');
                button.className = 'quick-reply-btn';
                button.textContent = item.text;
                button.dataset.reply = item.reply;
                button.setAttribute('role', 'button');
                button.setAttribute('tabindex', '0');
                
                // Add keyboard navigation
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        button.click();
                    }
                });
                
                button.addEventListener('click', () => {
                    messageInput.value = item.reply;
                    sendMessage();
                    quickReplies.style.display = 'none';
                });
                
                categorySection.appendChild(button);
            });
            
            quickReplies.appendChild(categorySection);
        });

        messagesContainer.appendChild(quickReplies);
    }

    // Enhanced message handling
    function handleUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let context = 'general';
        
        // Determine context from message
        if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
            context = 'appointment';
        } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            context = 'emergency';
        } else if (lowerMessage.includes('record') || lowerMessage.includes('medical history')) {
            context = 'records';
        } else if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage')) {
            context = 'insurance';
        } else if (lowerMessage.includes('location') || lowerMessage.includes('directions') || lowerMessage.includes('parking')) {
            context = 'location';
        }

        // Show typing indicator
        showTypingIndicator();

        // Simulate support response with delay
        setTimeout(() => {
            hideTypingIndicator();
            const responses = responseTemplates[context];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, 'support');
            
            // Show context-aware quick replies
            showContextQuickReplies(context);
        }, 1500);
    }

    // Update sendMessage function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';
            handleUserMessage(message);
        }
    }

    // Add message to chat
    function addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add animation class
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);
    }

    // Function to show alerts
    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alertDiv.style.zIndex = '1050';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Add active class to navigation links based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Back to Top Button functionality
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark mode functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Update icon
        darkModeToggle.innerHTML = isDarkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
            darkModeToggle.innerHTML = e.matches ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    });
}); 