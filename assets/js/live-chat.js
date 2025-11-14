/**
 * Live Chat Support System
 * Widget chat untuk customer support real-time
 */

class LiveChatSystem {
    constructor() {
        this.messages = this.loadMessages();
        this.isOpen = false;
        this.unreadCount = 0;
        this.init();
    }

    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.loadChat();
    }

    createChatWidget() {
        if (document.getElementById('liveChatWidget')) return;

        const widget = document.createElement('div');
        widget.id = 'liveChatWidget';
        widget.innerHTML = `
            <style>
                #chatContainer {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 380px;
                    height: 600px;
                    border-radius: 15px;
                    box-shadow: 0 5px 40px rgba(0,0,0,0.2);
                    background: white;
                    display: flex;
                    flex-direction: column;
                    z-index: 9999;
                    animation: slideUp 0.3s ease;
                    font-family: 'Rajdhani', sans-serif;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #chatHeader {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 15px 15px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #chatHeader h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .chat-status {
                    font-size: 0.8rem;
                    opacity: 0.9;
                }

                .close-chat {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-chat:hover {
                    opacity: 0.8;
                }

                #messagesContainer {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f8f9fa;
                }

                .chat-message {
                    margin-bottom: 15px;
                    display: flex;
                    gap: 10px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .chat-message.user {
                    justify-content: flex-end;
                }

                .message-bubble {
                    max-width: 70%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    word-wrap: break-word;
                    line-height: 1.4;
                    font-size: 0.9rem;
                }

                .chat-message.user .message-bubble {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px 0 12px 12px;
                }

                .chat-message.agent .message-bubble {
                    background: white;
                    color: #333;
                    border: 1px solid #ddd;
                    border-radius: 0 12px 12px 12px;
                }

                .message-time {
                    font-size: 0.75rem;
                    color: #999;
                    margin-top: 4px;
                }

                #inputContainer {
                    padding: 15px 20px;
                    background: white;
                    border-top: 1px solid #eee;
                    border-radius: 0 0 15px 15px;
                    display: flex;
                    gap: 10px;
                }

                #messageInput {
                    flex: 1;
                    border: 2px solid #eee;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-family: inherit;
                    font-size: 0.9rem;
                    outline: none;
                    transition: border-color 0.3s ease;
                }

                #messageInput:focus {
                    border-color: #667eea;
                }

                #sendBtn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 15px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #sendBtn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }

                #sendBtn:active {
                    transform: translateY(0);
                }

                #chatToggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 1.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                    z-index: 9998;
                    animation: bounce 2s infinite;
                    transition: all 0.3s ease;
                }

                @keyframes bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                #chatToggle:hover {
                    transform: scale(1.15);
                }

                .unread-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4444;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .scroll-indicator {
                    text-align: center;
                    color: #999;
                    font-size: 0.8rem;
                    padding: 10px;
                    background: white;
                    border-radius: 8px;
                    margin: 5px;
                }

                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 10px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #999;
                    animation: typing 1.4s infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typing {
                    0%, 60%, 100% { opacity: 0.5; transform: translateY(0); }
                    30% { opacity: 1; transform: translateY(-10px); }
                }

                @media (max-width: 600px) {
                    #chatContainer {
                        width: calc(100% - 20px);
                        height: 80vh;
                        max-height: 600px;
                    }

                    .message-bubble {
                        max-width: 85%;
                    }
                }

                .dark-mode #messagesContainer {
                    background: #1e1e1e;
                }

                .dark-mode #messageInput {
                    background: #2a2a2a;
                    color: white;
                    border-color: #404040;
                }

                .dark-mode .chat-message.agent .message-bubble {
                    background: #2a2a2a;
                    color: white;
                    border-color: #404040;
                }

                .dark-mode #inputContainer {
                    background: #1e1e1e;
                    border-color: #404040;
                }
            </style>

            <button id="chatToggle" title="Buka Chat">
                <i class="fas fa-comments"></i>
                <div class="unread-badge" id="unreadBadge" style="display: none;">0</div>
            </button>

            <div id="chatContainer" style="display: none;">
                <div id="chatHeader">
                    <div>
                        <h3>💬 Chat Support</h3>
                        <div class="chat-status">● Kami siap membantu</div>
                    </div>
                    <button class="close-chat" onclick="toggleChat()">−</button>
                </div>
                <div id="messagesContainer"></div>
                <div id="inputContainer">
                    <input 
                        type="text" 
                        id="messageInput" 
                        placeholder="Tulis pesan..." 
                        onkeypress="handleChatKeyPress(event)"
                    >
                    <button id="sendBtn" onclick="sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleChat());
        }

        const input = document.getElementById('messageInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        const container = document.getElementById('chatContainer');
        const toggle = document.getElementById('chatToggle');
        
        if (container.style.display === 'none') {
            container.style.display = 'flex';
            toggle.style.display = 'none';
            this.unreadCount = 0;
            this.updateBadge();
            this.scrollToBottom();
        } else {
            container.style.display = 'none';
            toggle.style.display = 'flex';
        }
    }

    loadMessages() {
        try {
            return JSON.parse(localStorage.getItem('chatMessages') || '[]');
        } catch {
            return [];
        }
    }

    saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }

    loadChat() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.messages.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #999; padding: 20px;">
                    <p style="font-size: 2rem; margin-bottom: 10px;">💬</p>
                    <p>Mulai percakapan dengan tim support kami</p>
                    <p style="font-size: 0.85rem; margin-top: 10px;">Kami siap membantu Anda!</p>
                </div>
            `;
            return;
        }

        this.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = `chat-message ${msg.sender}`;
            msgEl.innerHTML = `
                <div>
                    <div class="message-bubble">${this.escapeHTML(msg.text)}</div>
                    <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            `;
            container.appendChild(msgEl);
        });

        this.scrollToBottom();
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();

        if (!text) return;

        // Add user message
        this.messages.push({
            text,
            sender: 'user',
            timestamp: Date.now()
        });

        input.value = '';
        this.saveMessages();
        this.loadChat();

        // Simulate agent response
        setTimeout(() => {
            this.addAgentMessage();
        }, 1000 + Math.random() * 2000);
    }

    addAgentMessage() {
        const responses = [
            'Halo! 👋 Terima kasih telah menghubungi kami.',
            'Ada yang bisa kami bantu? Kami siap melayani! 😊',
            'Untuk informasi lebih lanjut, silakan klik menu FAQ di website kami.',
            'Biasanya pesanan diproses dalam 1-24 jam kerja. Bagaimana dengan pesanan Anda?',
            'Anda bisa melacak pesanan melalui menu "Pesananku" di navbar.',
            'Jika ada kesulitan, jangan ragu untuk menghubungi kami via WhatsApp: +62 812-1447-7714',
            'Apakah ada pertanyaan lain yang bisa kami jawab?',
            'Terima kasih telah mempercayai DEV ROBLOX SHOP! 🙏'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        this.messages.push({
            text: randomResponse,
            sender: 'agent',
            timestamp: Date.now()
        });

        this.saveMessages();
        this.loadChat();
    }

    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    scrollToBottom() {
        const container = document.getElementById('messagesContainer');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    updateBadge() {
        const badge = document.getElementById('unreadBadge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    addUnreadMessage() {
        if (document.getElementById('chatContainer').style.display === 'none') {
            this.unreadCount++;
            this.updateBadge();
        }
    }
}

// Global instance
let liveChat = null;

// Initialize on DOM ready
function initLiveChat() {
    if (!liveChat) {
        liveChat = new LiveChatSystem();
    }
}

// Global functions
function toggleChat() {
    if (liveChat) liveChat.toggleChat();
}

function sendMessage() {
    if (liveChat) liveChat.sendMessage();
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveChat);
} else {
    initLiveChat();
}
