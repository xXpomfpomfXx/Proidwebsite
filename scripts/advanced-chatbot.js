// Advanced AI-Powered Chatbot

// Prevent old chatbot from initializing
if (window.Chatbot) {
    delete window.Chatbot;
}

class AdvancedChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userContext = {
            name: '',
            interests: [],
            currentStation: null,
            progress: 0,
            lastInteraction: Date.now()
        };
        this.isExpanded = false; // Track expansion state
        this.responses = this.loadResponses();
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.initEventListeners();
        this.loadUserContext();
        this.showWelcomeMessage();
    }

    loadResponses() {
        return {
            greetings: [
                "Hello! I'm your Mindcraft AI assistant! 🏗️ How can I help you today?",
                "Hi there! Ready to explore Singapore's future with Mindcraft? 🎯",
                "Welcome to Mindcraft! I'm here to guide you through DMP2025! 🌟"
            ],
            station_info: {
                "urban-planning": "🏙️ The Urban Planning Station helps you understand city planning fundamentals and how DMP2025 affects your daily life. You'll learn about zoning, infrastructure, and creating sustainable communities!",
                "active-living": "🏃‍♀️ The Active Living Station focuses on sports, recreation, and community health. Learn how to design spaces that promote healthy lifestyles and bring people together!",
                "creative-arts": "🎨 The Creative Arts Station explores artistic urban design and cultural spaces. Discover how art and creativity can make Singapore more vibrant and engaging for youths!",
                "innovation-lab": "💡 The Innovation Lab Station covers smart city technology and innovation. Learn about IoT, AI, and how technology can solve urban challenges!",
                "sustainability": "🌱 The Sustainability Station focuses on environmental planning and green solutions. Understand how to build a greener, more sustainable Singapore!"
            },
            help: [
                "I can help you with: 📋\n• Quest station information (5 interactive stations)\n• Progress tracking and achievements\n• Minecraft world guidance (6 building zones)\n• DMP2025 explanations\n• Partner information\n• Contact and support",
                "Here's what I can do for you: 🎯\n• Guide you through our 5 quest stations\n• Explain urban planning concepts\n• Help with Minecraft building challenges\n• Track your progress and rewards\n• Answer questions about Singapore's future"
            ],
            minecraft: [
                "🎮 Our Minecraft world has 6 different building zones: Downtown District, Suburbs, Industrial Area, Coastal Zone, Transportation Hub, and Education Campus. Each zone represents different aspects of DMP2025!",
                "🏗️ In our Minecraft world, you can build with special DMP2025 tools, collaborate with other youths, and complete real-world urban planning challenges. Your creations directly influence Singapore's future!"
            ],
            dmp2025: [
                "📋 DMP2025 (Development Master Plan 2025) is Singapore's blueprint for the next decade. It covers housing, transport, environment, and community development. Your input helps shape this plan!",
                "🏛️ The Development Master Plan 2025 will guide Singapore's development for the next 10 years. It's crucial that young voices like yours are heard in this planning process!"
            ],
            partners: [
                "🤝 Our key partners include URA (Urban Redevelopment Authority), ActiveSG, People's Association, EduTech Solutions, Green Future Initiative, and Art4City. They help us make DMP2025 accessible to youths!",
                "🏛️ We work with government agencies like URA and community organizations to ensure your ideas reach the right people and make real impact on Singapore's future!"
            ],
            rewards: [
                "🏆 Complete quest stations to earn badges, points, and special rewards. Your achievements unlock new Minecraft building tools and recognition in the community!",
                "🎁 Rewards include: Progress badges, Minecraft building credits, community recognition, and the chance to have your ideas featured in DMP2025 planning!"
            ]
        };
    }

    createChatbotUI() {
        // Remove ALL existing chatbots (both old and new)
        const existingChatbots = document.querySelectorAll('.chatbot-container, .advanced-chatbot, #chatbot-container, #advanced-chatbot');
        existingChatbots.forEach(chatbot => {
            chatbot.remove();
        });

        // Also remove any old chatbot elements that might be created by the old script
        const oldChatbotElements = document.querySelectorAll('[id*="chatbot"], [class*="chatbot"]');
        oldChatbotElements.forEach(element => {
            if (element.tagName !== 'SCRIPT' && element.tagName !== 'LINK') {
                element.remove();
            }
        });

        const chatbotHTML = `
            <div class="advanced-chatbot" id="advanced-chatbot">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">🤖</div>
                    <div class="chatbot-info">
                        <h3>Mindcraft AI</h3>
                        <span class="status">● Online</span>
                    </div>
                    <button class="chatbot-toggle" id="chatbot-toggle">
                        <span class="toggle-icon">💬</span>
                    </button>
                </div>
                <div class="chatbot-body" id="chatbot-body" style="display: none;">
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be inserted here -->
                    </div>
                    <div class="chat-input-container">
                        <div class="quick-actions" id="quick-actions">
                            <button class="quick-action" data-action="stations">🎯 Quest Stations</button>
                            <button class="quick-action" data-action="minecraft">🎮 Minecraft</button>
                            <button class="quick-action" data-action="partners">🤝 Partners</button>
                            <button class="quick-action" data-action="rewards">🏆 Rewards</button>
                            <button class="quick-action" data-action="progress">📊 Progress</button>
                            <button class="quick-action" data-action="help">💡 Help</button>
                        </div>
                        <div class="input-group">
                            <input type="text" id="chat-input" placeholder="Ask me anything about Mindcraft..." />
                            <button id="send-message" class="send-btn">🚀</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Force the chatbot to be visible
        setTimeout(() => {
            const chatbot = document.getElementById('advanced-chatbot');
            if (chatbot) {
                chatbot.style.display = 'block';
                chatbot.style.visibility = 'visible';
                chatbot.style.opacity = '1';
                chatbot.style.zIndex = '9999';
                chatbot.style.transform = 'translateY(0) scale(1)';
                
                // Ensure header is visible
                const header = chatbot.querySelector('.chatbot-header');
                if (header) {
                    header.style.display = 'flex';
                    header.style.visibility = 'visible';
                    header.style.opacity = '1';
                    header.style.zIndex = '10000';
                }
                
                // Ensure toggle button is visible
                const toggle = chatbot.querySelector('.chatbot-toggle');
                if (toggle) {
                    toggle.style.display = 'flex';
                    toggle.style.visibility = 'visible';
                    toggle.style.opacity = '1';
                    toggle.style.zIndex = '10001';
                }
                
                // Force a repaint
                chatbot.offsetHeight;
            }
        }, 100);
    }

    initEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        const quickActions = document.getElementById('quick-actions');

        toggle.addEventListener('click', () => this.toggleChatbot());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });

        sendBtn.addEventListener('click', () => this.handleUserInput());

        quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });
    }

    toggleChatbot() {
        const chatbot = document.getElementById('advanced-chatbot');
        const body = document.getElementById('chatbot-body');
        const toggle = document.getElementById('chatbot-toggle');
        const icon = toggle.querySelector('.toggle-icon');

        if (!this.isExpanded) {
            // Open chatbot
            body.style.display = 'flex';
            icon.textContent = '×';
            chatbot.classList.add('expanded');
            this.isExpanded = true;
            
            // Add opening animation
            body.style.animation = 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Focus on input when opening
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) {
                    input.focus();
                    input.style.animation = 'focusGlow 0.5s ease-out';
                }
            }, 150);
        } else {
            // Close chatbot
            body.style.animation = 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                body.style.display = 'none';
                icon.textContent = '💬';
                chatbot.classList.remove('expanded');
                this.isExpanded = false;
            }, 300);
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = this.getRandomResponse('greetings');
        this.addMessage('bot', welcomeMessage);
        
        // Show quick actions after welcome
        setTimeout(() => {
            this.addMessage('bot', 'What would you like to know about? I can help you with our 5 quest stations, Minecraft building challenges, partner information, rewards, or anything about DMP2025! 🎯');
        }, 2000);
    }

    handleUserInput() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        // Process the message and generate response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
        }, 500);
    }

    handleQuickAction(action) {
        let response = '';
        
        switch(action) {
            case 'stations':
                response = "Here are our 5 Quest Stations: 🎯\n\n1. 🏙️ Urban Planning Station\n2. 🏃‍♀️ Active Living Station\n3. 🎨 Creative Arts Station\n4. 💡 Innovation Lab Station\n5. 🌱 Sustainability Station\n\nEach station takes 30-60 minutes and connects urban planning to your daily life. Which one interests you most?";
                break;
            case 'minecraft':
                response = this.getRandomResponse('minecraft');
                break;
            case 'partners':
                response = this.getRandomResponse('partners');
                break;
            case 'rewards':
                response = this.getRandomResponse('rewards');
                break;
            case 'progress':
                if (window.progressTracker) {
                    const progress = window.progressTracker.progress;
                    response = `Your Progress: 📊\n\n🏆 Level: ${progress.currentLevel}\n📈 Points: ${progress.totalPoints}\n🎯 Stations: ${progress.completedStations}/${progress.totalStations}\n⭐ XP: ${progress.experience}\n\nKeep going! You're doing great!`;
                } else {
                    response = "I can't access your progress right now. Try refreshing the page! 🔄";
                }
                break;
            case 'help':
                response = this.getRandomResponse('help');
                break;
        }

        this.addMessage('bot', response);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific keywords and generate contextual responses
        if (lowerMessage.includes('station') || lowerMessage.includes('quest')) {
            return this.handleStationQuery(message);
        } else if (lowerMessage.includes('minecraft') || lowerMessage.includes('build')) {
            return this.getRandomResponse('minecraft');
        } else if (lowerMessage.includes('dmp') || lowerMessage.includes('plan')) {
            return this.getRandomResponse('dmp2025');
        } else if (lowerMessage.includes('partner') || lowerMessage.includes('ura') || lowerMessage.includes('activesg')) {
            return this.getRandomResponse('partners');
        } else if (lowerMessage.includes('reward') || lowerMessage.includes('badge') || lowerMessage.includes('achievement')) {
            return this.getRandomResponse('rewards');
        } else if (lowerMessage.includes('progress') || lowerMessage.includes('level')) {
            return this.handleProgressQuery();
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getRandomResponse('help');
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return this.getRandomResponse('greetings');
        } else {
            return this.generateSmartResponse(message);
        }
    }

    handleStationQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [station, info] of Object.entries(this.responses.station_info)) {
            if (lowerMessage.includes(station.replace('-', ' ')) || 
                lowerMessage.includes(station.split('-')[0]) || 
                lowerMessage.includes(station.split('-')[1])) {
                return info;
            }
        }
        
        return "I can tell you about any of our 5 quest stations! 🎯\n\nWhich one interests you?\n• Urban Planning 🏙️\n• Active Living 🏃‍♀️\n• Creative Arts 🎨\n• Innovation Lab 💡\n• Sustainability 🌱";
    }

    handleProgressQuery() {
        if (window.progressTracker) {
            const progress = window.progressTracker.progress;
            const achievements = window.progressTracker.achievements.filter(a => a.unlocked).length;
            
            return `Your Urban Quest Progress: 📊\n\n🏆 Level: ${progress.currentLevel}\n📈 Total Points: ${progress.totalPoints}\n🎯 Stations Completed: ${progress.completedStations}/${progress.totalStations}\n⭐ Experience: ${progress.experience}\n🏅 Achievements: ${achievements}/5\n\nYou're making great progress! Keep exploring! 🌟`;
        }
        
        return "I can't access your progress right now. Make sure you're logged in and try refreshing the page! 🔄";
    }

    generateSmartResponse(message) {
        // Simple AI-like response generation
        const responses = [
            "That's an interesting question! 🤔 Let me help you with that...",
            "Great question! I'd be happy to help you with that. 🎯",
            "I understand you're asking about that. Let me provide some information... 📚",
            "That's a thoughtful question about urban planning! Here's what I know... 🏗️",
            "I'm here to help with Urban Quest and Singapore's future! What specific aspect interests you? 🌟"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)] + 
               "\n\nYou can ask me about:\n• Quest stations and activities\n• Minecraft building challenges\n• Your progress and achievements\n• DMP2025 and urban planning\n• General help and guidance";
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    addMessage(sender, message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        // Add entrance animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        messagesContainer.appendChild(messageDiv);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        // Smooth scrolling to bottom
        setTimeout(() => {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
        
        // Add to conversation history
        this.conversationHistory.push({
            sender,
            message,
            timestamp: Date.now()
        });
        
        // Add typing indicator effect for bot messages
        if (sender === 'bot') {
            this.addTypingEffect(messageDiv.querySelector('.message-text'));
        }
    }
    
    addTypingEffect(element) {
        const text = element.innerHTML;
        element.innerHTML = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 20);
    }

    formatMessage(message) {
        // Clean up the message formatting
        return message
            .replace(/<br>/gi, '\n') // Convert any existing <br> tags to newlines
            .replace(/\n/g, '<br>') // Convert newlines to proper <br> tags
            .replace(/&/g, '&amp;') // Escape ampersands
            .replace(/</g, '&lt;') // Escape less than
            .replace(/>/g, '&gt;'); // Escape greater than
    }

    loadUserContext() {
        const saved = localStorage.getItem('urbanQuestUserContext');
        if (saved) {
            this.userContext = { ...this.userContext, ...JSON.parse(saved) };
        }
    }

    saveUserContext() {
        localStorage.setItem('urbanQuestUserContext', JSON.stringify(this.userContext));
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        // Remove any existing chatbots first
        const existingChatbots = document.querySelectorAll('.chatbot-container, .advanced-chatbot, #chatbot-container, #advanced-chatbot');
        existingChatbots.forEach(chatbot => {
            chatbot.remove();
        });
        
        // Prevent old chatbot from initializing
        if (window.Chatbot) {
            delete window.Chatbot;
        }
        
        window.advancedChatbot = new AdvancedChatbot();
    }, 100);
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    setTimeout(() => {
        // Remove any existing chatbots first
        const existingChatbots = document.querySelectorAll('.chatbot-container, .advanced-chatbot, #chatbot-container, #advanced-chatbot');
        existingChatbots.forEach(chatbot => {
            chatbot.remove();
        });
        
        // Prevent old chatbot from initializing
        if (window.Chatbot) {
            delete window.Chatbot;
        }
        
        window.advancedChatbot = new AdvancedChatbot();
    }, 100);
} 