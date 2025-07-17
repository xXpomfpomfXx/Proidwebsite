if (!window.Chatbot) {
    class Chatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.typingTimeout = null;
            
            // Random responses for general conversation
            this.randomResponses = [
                "That's an interesting question! 🤔",
                "I'm here to help with Urban Quest! 🏗️",
                "Great question! Let me think about that...",
                "I'm learning about cities just like you! 🌆",
                "That's something to explore in our quest stations!",
                "Have you tried building that in Minecraft? 🎮",
                "Urban planning is fascinating, isn't it?",
                "I'd love to hear more about your city ideas!",
                "That reminds me of sustainable development! 🌱",
                "Interesting perspective on urban design!",
                "Have you visited our quest stations yet?",
                "Cities are like living organisms! 🏙️",
                "What's your favorite part of city planning?",
                "I'm here to guide your urban adventure!",
                "That's a creative approach to city building!",
                "Have you earned any rewards yet? 🏆",
                "Community engagement is key to great cities!",
                "What would you build in your ideal city?",
                "I'm excited about your urban journey!",
                "Let's make cities better together! 🤝"
            ];

            // Keyword-based responses
            this.keywordResponses = {
                'minecraft': [
                    "Minecraft is perfect for learning urban planning! 🎮 You can build entire cities and experiment with different layouts. Check out our Minecraft World page for more details!",
                    "I love Minecraft for city building! It's a great way to visualize urban concepts. Have you tried our building challenges?",
                    "Minecraft + urban planning = endless possibilities! 🏗️ You can create sustainable cities, transportation systems, and more!"
                ],
                'quest': [
                    "Our quest stations are the heart of Urban Quest! 🎯 There are 5 interactive stations where you can learn about different aspects of city planning.",
                    "The quest stations will guide you through urban development concepts! Each station focuses on a different aspect of city building.",
                    "Ready for an adventure? Our quest stations combine learning with fun challenges! 🚀"
                ],
                'reward': [
                    "Earn real rewards while learning! 🏆 You can get ActiveSG credits, SkillsFuture credits, and exclusive access to community programs.",
                    "Complete challenges to unlock amazing rewards! From fitness credits to learning opportunities, there's something for everyone.",
                    "Rewards make learning even more exciting! Check out our rewards page to see what you can earn! 🎁"
                ],
                'station': [
                    "We have 5 amazing quest stations! Each one teaches different urban planning concepts through interactive activities.",
                    "The quest stations are where the magic happens! 🎪 You'll learn about sustainability, transportation, community building, and more.",
                    "Visit our quest stations page to see all the interactive learning opportunities! 📍"
                ],
                'city': [
                    "Cities are amazing places! 🌆 They're where people live, work, and play. Urban planning helps make them better for everyone.",
                    "Every great city starts with a vision! What kind of city would you like to build?",
                    "Cities are like puzzles - every piece matters! 🧩 From parks to transportation to housing, it all works together."
                ],
                'urban': [
                    "Urban planning is all about creating better places for people! 🏙️ It combines design, sustainability, and community needs.",
                    "Urban development is fascinating! It's about balancing growth, sustainability, and quality of life.",
                    "Urban areas are where most people live today! Making them better is crucial for our future."
                ],
                'help': [
                    "I'm here to help! 🤖 You can ask me about Urban Quest, quest stations, rewards, Minecraft, or anything about city planning!",
                    "Need assistance? I can guide you through our website, explain concepts, or just chat about urban development!",
                    "I'm your friendly Urban Quest assistant! Ask me anything about our program or city planning in general!"
                ],
                'hello': [
                    "Hello there! 👋 Welcome to Urban Quest! I'm here to help you learn about city building and urban planning.",
                    "Hi! 🏗️ Ready to build the future? I can help you explore Urban Quest and learn about city development!",
                    "Greetings! 🌆 I'm excited to help you discover the world of urban planning through our interactive quest!"
                ],
                'bye': [
                    "Goodbye! 👋 Thanks for chatting with me! Come back anytime to learn more about Urban Quest!",
                    "See you later! 🏗️ Keep building amazing cities and learning about urban planning!",
                    "Farewell! 🌆 Don't forget to visit our quest stations and earn those rewards!"
                ],
                'ura': [
                    "URA (Urban Redevelopment Authority) is one of our amazing partners! 🏛️ They help shape Singapore's urban landscape.",
                    "URA is a key partner in Urban Quest! They bring expertise in urban planning and development to our program.",
                    "URA is instrumental in Singapore's urban development! They're helping us create better cities for everyone."
                ],
                'activesg': [
                    "ActiveSG is a fantastic partner! 🏃‍♂️ They help promote active lifestyles and provide fitness opportunities.",
                    "ActiveSG credits are one of the rewards you can earn! Stay active while learning about urban planning!",
                    "ActiveSG is all about healthy living! They're helping us create cities that promote physical activity and wellness."
                ],
                'sustainability': [
                    "Sustainability is crucial for future cities! 🌱 We need to balance development with environmental protection.",
                    "Sustainable urban development is key! It's about creating cities that can thrive for generations to come.",
                    "Green cities are the future! 🌿 Sustainability in urban planning helps protect our environment and improve quality of life."
                ]
            };

            this.init();
        }

        init() {
            this.createChatbotHTML();
            this.bindEvents();
            this.addWelcomeMessage();
        }

        createChatbotHTML() {
            const chatbotHTML = `
                <div class="chatbot-container">
                    <button class="chatbot-toggle" id="chatbotToggle">🤖</button>
                    <div class="chatbot-window" id="chatbotWindow">
                        <div class="chatbot-header">
                            <h3>Urban Quest Assistant</h3>
                            <button class="chatbot-close" id="chatbotClose">×</button>
                        </div>
                        <div class="chatbot-messages" id="chatbotMessages"></div>
                        <div class="chatbot-typing" id="chatbotTyping">
                            <span>Assistant is typing</span>
                            <div class="typing-dots">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                        </div>
                        <div class="chatbot-input-container">
                            <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask me anything about Urban Quest...">
                            <button class="chatbot-send" id="chatbotSend">➤</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        }

        bindEvents() {
            const toggle = document.getElementById('chatbotToggle');
            const close = document.getElementById('chatbotClose');
            const input = document.getElementById('chatbotInput');
            const send = document.getElementById('chatbotSend');
            const window = document.getElementById('chatbotWindow');

            toggle.addEventListener('click', () => this.toggleChatbot());
            close.addEventListener('click', () => this.closeChatbot());
            send.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Close chatbot when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.chatbot-container') && this.isOpen) {
                    this.closeChatbot();
                }
            });
        }

        toggleChatbot() {
            if (this.isOpen) {
                this.closeChatbot();
            } else {
                this.openChatbot();
            }
        }

        openChatbot() {
            this.isOpen = true;
            document.getElementById('chatbotToggle').classList.add('active');
            document.getElementById('chatbotToggle').textContent = '✕';
            document.getElementById('chatbotWindow').classList.add('active');
            document.getElementById('chatbotInput').focus();
        }

        closeChatbot() {
            this.isOpen = false;
            document.getElementById('chatbotToggle').classList.remove('active');
            document.getElementById('chatbotToggle').textContent = '🤖';
            document.getElementById('chatbotWindow').classList.remove('active');
        }

        addWelcomeMessage() {
            const welcomeMessages = [
                "Hello! 👋 I'm your Urban Quest assistant! I can help you learn about city planning, quest stations, rewards, and more!",
                "Hi there! 🏗️ Welcome to Urban Quest! Ask me anything about urban development, Minecraft building, or our interactive stations!",
                "Greetings! 🌆 I'm here to guide you through your urban planning adventure! What would you like to know?"
            ];
            
            const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            this.addMessage(randomWelcome, 'bot');
        }

        sendMessage() {
            const input = document.getElementById('chatbotInput');
            const message = input.value.trim();
            
            if (message) {
                this.addMessage(message, 'user');
                input.value = '';
                this.showTyping();
                
                // Simulate typing delay
                setTimeout(() => {
                    this.hideTyping();
                    this.generateResponse(message);
                }, 1000 + Math.random() * 2000);
            }
        }

        showTyping() {
            document.getElementById('chatbotTyping').style.display = 'flex';
            this.scrollToBottom();
        }

        hideTyping() {
            document.getElementById('chatbotTyping').style.display = 'none';
        }

        generateResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            let response = '';

            // Check for keyword matches
            for (const [keyword, responses] of Object.entries(this.keywordResponses)) {
                if (lowerMessage.includes(keyword)) {
                    response = responses[Math.floor(Math.random() * responses.length)];
                    break;
                }
            }

            // If no keyword match, use random response
            if (!response) {
                response = this.randomResponses[Math.floor(Math.random() * this.randomResponses.length)];
            }

            this.addMessage(response, 'bot');
        }

        addMessage(text, sender) {
            const messagesContainer = document.getElementById('chatbotMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;
            
            const bubble = document.createElement('div');
            bubble.className = `message-bubble ${sender}`;
            bubble.textContent = text;
            
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            
            this.messages.push({ text, sender, timestamp: Date.now() });
            this.scrollToBottom();
        }

        scrollToBottom() {
            const messagesContainer = document.getElementById('chatbotMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    window.Chatbot = Chatbot;
    document.addEventListener('DOMContentLoaded', () => {
        new Chatbot();
    });
} 