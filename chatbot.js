// Chat Bot Configuration
const chatbotConfig = {
    welcomeMessage: "Hello! I'm your healthcare assistant. How can I help you today?",
    typingSpeed: 50, // milliseconds per character
    responseDelay: 1000, // milliseconds before response
    maxMessageLength: 500,
    supportHours: {
        start: 8, // 8 AM
        end: 20, // 8 PM
        timezone: 'local'
    }
};

// Chat Bot Class
class ChatBot {
    constructor(config) {
        this.config = { ...chatbotConfig, ...config };
        this.isOpen = false;
        this.isTyping = false;
        this.messageQueue = [];
        this.currentContext = null;
        this.initializeElements();
        this.attachEventListeners();
        this.checkSupportHours();
    }

    // Initialize DOM elements
    initializeElements() {
        this.container = document.createElement('div');
        this.container.className = 'chatbot-container';
        this.container.innerHTML = `
            <div class="chatbot-header">
                <h3>Healthcare Assistant</h3>
                <div class="chatbot-controls">
                    <button class="minimize-btn" aria-label="Minimize chat">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="close-btn" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-typing-indicator" style="display: none;">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="chatbot-input-container">
                <textarea class="chatbot-input" placeholder="Type your message..." rows="1"></textarea>
                <button class="send-btn" aria-label="Send message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="chatbot-quick-replies"></div>
        `;
        document.body.appendChild(this.container);
    }

    // Attach event listeners
    attachEventListeners() {
        const minimizeBtn = this.container.querySelector('.minimize-btn');
        const closeBtn = this.container.querySelector('.close-btn');
        const sendBtn = this.container.querySelector('.send-btn');
        const input = this.container.querySelector('.chatbot-input');

        minimizeBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.handleUserInput());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        });
    }

    // Check if support is available
    checkSupportHours() {
        const now = new Date();
        const hour = now.getHours();
        const isSupportAvailable = hour >= this.config.supportHours.start && 
                                 hour < this.config.supportHours.end;

        if (!isSupportAvailable) {
            this.addSystemMessage("Our support hours are from 8 AM to 8 PM. Please leave a message and we'll get back to you during our support hours.");
        }
    }

    // Toggle chat window
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('minimized');
        if (this.isOpen) {
            this.container.querySelector('.chatbot-input').focus();
        }
    }

    // Close chat window
    closeChat() {
        this.isOpen = false;
        this.container.classList.remove('minimized');
        this.container.style.display = 'none';
    }

    // Handle user input
    async handleUserInput() {
        const input = this.container.querySelector('.chatbot-input');
        const message = input.value.trim();

        if (message && !this.isTyping) {
            this.addUserMessage(message);
            input.value = '';
            input.style.height = 'auto';
            await this.processUserMessage(message);
        }
    }

    // Process user message and generate response
    async processUserMessage(message) {
        this.showTypingIndicator();
        await this.simulateTyping();
        this.hideTypingIndicator();

        const response = this.generateResponse(message);
        this.addBotMessage(response);
        this.showQuickReplies(this.getContextQuickReplies(message));
    }

    // Generate bot response based on message context
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Basic response patterns
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! How can I assist you today?";
        } else if (lowerMessage.includes('appointment')) {
            return "I can help you schedule an appointment. Would you like to book one now?";
        } else if (lowerMessage.includes('emergency')) {
            return "For emergencies, please call our emergency hotline immediately at (123) 456-7890.";
        } else if (lowerMessage.includes('hours') || lowerMessage.includes('schedule')) {
            return "Our operating hours are Monday to Friday, 8 AM to 8 PM, and Saturday, 9 AM to 5 PM.";
        } else if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
            return "We're located at 123 Medical Center Drive. Would you like directions?";
        } else {
            return "I'm here to help. Could you please provide more details about your inquiry?";
        }
    }

    // Show typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        const indicator = this.container.querySelector('.chatbot-typing-indicator');
        indicator.style.display = 'flex';
    }

    // Hide typing indicator
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = this.container.querySelector('.chatbot-typing-indicator');
        indicator.style.display = 'none';
    }

    // Simulate typing delay
    async simulateTyping() {
        return new Promise(resolve => setTimeout(resolve, this.config.responseDelay));
    }

    // Add user message to chat
    addUserMessage(message) {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    // Add bot message to chat
    addBotMessage(message) {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    // Add system message
    addSystemMessage(message) {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message system-message';
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    // Show quick reply buttons
    showQuickReplies(replies) {
        const quickRepliesContainer = this.container.querySelector('.chatbot-quick-replies');
        quickRepliesContainer.innerHTML = '';

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', () => {
                this.addUserMessage(reply);
                this.processUserMessage(reply);
                quickRepliesContainer.innerHTML = '';
            });
            quickRepliesContainer.appendChild(button);
        });
    }

    // Get context-based quick replies
    getContextQuickReplies(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('appointment')) {
            return [
                "Book new appointment",
                "Reschedule appointment",
                "Cancel appointment",
                "View upcoming appointments"
            ];
        } else if (lowerMessage.includes('emergency')) {
            return [
                "Call emergency hotline",
                "Find nearest hospital",
                "Contact on-call doctor"
            ];
        } else {
            return [
                "Book appointment",
                "Operating hours",
                "Location & directions",
                "Contact support"
            ];
        }
    }

    // Scroll chat to bottom
    scrollToBottom() {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatBot = new ChatBot();
}); 