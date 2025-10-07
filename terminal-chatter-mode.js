/* ===================================
   TERMINAL CHATTER MODE v1.0
   Telegram-like chat system for Omega Terminal
   =================================== */

console.log('💬 Loading Terminal Chatter Mode...');

(function() {
    
    // ===================================
    // CHAT SYSTEM DATA STRUCTURE
    // ===================================
    
    const chatData = {
        messages: [],
        users: new Map(),
        currentUser: null,
        isConnected: false,
        settings: {
            soundEnabled: true,
            notifications: true,
            autoScroll: true,
            showTimestamps: true
        }
    };
    
    // Load saved chat data
    function loadChatData() {
        const saved = localStorage.getItem('omega-chat-data');
        if (saved) {
            const parsed = JSON.parse(saved);
            chatData.messages = parsed.messages || [];
            chatData.settings = { ...chatData.settings, ...parsed.settings };
        }
    }
    
    // Save chat data
    function saveChatData() {
        localStorage.setItem('omega-chat-data', JSON.stringify({
            messages: chatData.messages,
            settings: chatData.settings
        }));
    }
    
    // ===================================
    // CHAT MESSAGE MANAGEMENT
    // ===================================
    
    function addMessage(content, type = 'user', username = null) {
        const message = {
            id: Date.now() + Math.random(),
            content: content,
            type: type, // 'user', 'system', 'bot'
            username: username || (chatData.currentUser ? chatData.currentUser.username : 'Anonymous'),
            timestamp: new Date(),
            avatar: getAvatarForUser(username || 'Anonymous')
        };
        
        chatData.messages.push(message);
        saveChatData();
        
        // Update UI if chat is open
        if (document.getElementById('chat-container')) {
            updateChatUI();
            scrollToBottom();
        }
        
        // Play sound if enabled
        if (chatData.settings.soundEnabled && type === 'user') {
            playMessageSound();
        }
        
        // Show notification if enabled
        if (chatData.settings.notifications && type === 'user' && document.hidden) {
            showNotification(`New message from ${message.username}`);
        }
        
        return message;
    }
    
    function getAvatarForUser(username) {
        // Generate consistent avatar based on username
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return {
            color: colors[colorIndex],
            initial: username.charAt(0).toUpperCase()
        };
    }
    
    // ===================================
    // CHAT UI COMPONENTS
    // ===================================
    
    function createChatInterface() {
        // Remove existing chat if any
        const existingChat = document.getElementById('chat-container');
        if (existingChat) existingChat.remove();
        
        const chatHtml = `
            <div id="chat-container" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-width: 800px;
                height: 80vh;
                background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(28, 28, 30, 0.95));
                backdrop-filter: blur(40px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                z-index: 20000;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
            ">
                <!-- Chat Header -->
                <div style="
                    background: linear-gradient(135deg, #1C1C1E, #2C2C2E);
                    color: white;
                    padding: 20px;
                    border-radius: 20px 20px 0 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <div style="font-size: 1.4em; font-weight: 800; margin-bottom: 4px;">💬 Terminal Chatter</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">Omega Terminal Community Chat</div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div id="chat-status" style="
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-size: 0.8em;
                            font-weight: 600;
                            background: rgba(52, 199, 89, 0.2);
                            color: #34C759;
                            border: 1px solid rgba(52, 199, 89, 0.3);
                        ">🟢 Connected</div>
                        
                        <button onclick="toggleChatSettings()" style="
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1em;
                        " title="Settings">⚙️</button>
                        
                        <button onclick="closeChat()" style="
                            background: rgba(255, 59, 48, 0.2);
                            color: #FF3B30;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1em;
                        " title="Close">✕</button>
                    </div>
                </div>
                
                <!-- Chat Messages -->
                <div id="chat-messages" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.1);
                ">
                    <!-- Messages will be populated here -->
                </div>
                
                <!-- Chat Input -->
                <div style="
                    padding: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(28, 28, 30, 0.5);
                    border-radius: 0 0 20px 20px;
                ">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div style="flex: 1; position: relative;">
                            <input type="text" id="chat-input" placeholder="Type your message..." style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                border-radius: 25px;
                                font-size: 1em;
                                background: rgba(18, 18, 18, 0.8);
                                color: white;
                                outline: none;
                                transition: all 0.2s ease;
                                box-sizing: border-box;
                            " onfocus="this.style.border='1px solid #007AFF'" onblur="this.style.border='1px solid rgba(255, 255, 255, 0.2)'" onkeypress="handleChatKeyPress(event)">
                        </div>
                        
                        <button onclick="sendChatMessage()" style="
                            background: linear-gradient(135deg, #007AFF, #5AC8FA);
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 25px;
                            font-size: 1em;
                            font-weight: 600;
                            cursor: pointer;
                            box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
                            transition: all 0.2s ease;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Send</button>
                    </div>
                    
                    <div style="margin-top: 12px; display: flex; gap: 16px; align-items: center; font-size: 0.8em; color: #8E8E93;">
                        <span>👤 ${chatData.currentUser ? chatData.currentUser.username : 'Anonymous'}</span>
                        <span>💬 ${chatData.messages.length} messages</span>
                        <span>👥 ${chatData.users.size} users</span>
                    </div>
                </div>
            </div>
            
            <!-- Chat Settings Modal -->
            <div id="chat-settings-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                z-index: 30000;
                display: none;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(28, 28, 30, 0.95));
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                ">
                    <div style="color: white; font-size: 1.3em; font-weight: 700; margin-bottom: 20px;">⚙️ Chat Settings</div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: white; cursor: pointer;">
                            <input type="checkbox" id="chat-sound-setting" style="margin-right: 12px;" ${chatData.settings.soundEnabled ? 'checked' : ''}>
                            <span>🔊 Sound Effects</span>
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: white; cursor: pointer;">
                            <input type="checkbox" id="chat-notifications-setting" style="margin-right: 12px;" ${chatData.settings.notifications ? 'checked' : ''}>
                            <span>🔔 Notifications</span>
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: white; cursor: pointer;">
                            <input type="checkbox" id="chat-timestamps-setting" style="margin-right: 12px;" ${chatData.settings.showTimestamps ? 'checked' : ''}>
                            <span>🕐 Show Timestamps</span>
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: white; margin-bottom: 8px;">👤 Username</label>
                        <input type="text" id="chat-username-setting" placeholder="Enter your username" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 12px;
                            font-size: 1em;
                            background: rgba(28, 28, 30, 0.8);
                            color: white;
                            box-sizing: border-box;
                        " value="${chatData.currentUser ? chatData.currentUser.username : ''}">
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button onclick="saveChatSettings()" style="
                            flex: 1;
                            background: linear-gradient(135deg, #34C759, #30D158);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-size: 1em;
                            font-weight: 600;
                            cursor: pointer;
                        ">Save</button>
                        
                        <button onclick="closeChatSettings()" style="
                            flex: 1;
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-size: 1em;
                            font-weight: 600;
                            cursor: pointer;
                        ">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHtml);
        
        // Initialize chat
        initializeChat();
        updateChatUI();
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 100);
    }
    
    // ===================================
    // CHAT FUNCTIONALITY
    // ===================================
    
    function initializeChat() {
        // Set current user
        if (!chatData.currentUser) {
            chatData.currentUser = {
                username: 'Anonymous',
                id: 'user_' + Date.now()
            };
        }
        
        // Add user to users map
        chatData.users.set(chatData.currentUser.id, chatData.currentUser);
        
        // Add welcome message if no messages exist
        if (chatData.messages.length === 0) {
            addMessage('Welcome to Terminal Chatter! Start chatting with the Omega Terminal community.', 'system');
        }
        
        chatData.isConnected = true;
    }
    
    function updateChatUI() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = chatData.messages.map(message => {
            const timeStr = chatData.settings.showTimestamps ? 
                message.timestamp.toLocaleTimeString() : '';
            
            const isCurrentUser = message.username === chatData.currentUser.username;
            
            return `
                <div style="
                    display: flex;
                    margin-bottom: 16px;
                    ${isCurrentUser ? 'flex-direction: row-reverse;' : ''}
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${message.avatar.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 700;
                        font-size: 1.2em;
                        margin: ${isCurrentUser ? '0 0 0 12px' : '0 12px 0 0'};
                        flex-shrink: 0;
                    ">${message.avatar.initial}</div>
                    
                    <div style="flex: 1;">
                        <div style="
                            background: ${isCurrentUser ? 'linear-gradient(135deg, #007AFF, #5AC8FA)' : 'rgba(255, 255, 255, 0.1)'};
                            color: white;
                            padding: 12px 16px;
                            border-radius: 18px;
                            max-width: 70%;
                            word-wrap: break-word;
                            ${isCurrentUser ? 'margin-left: auto;' : ''}
                        ">
                            <div style="font-size: 0.9em; opacity: 0.8; margin-bottom: 4px;">
                                ${message.username} ${timeStr ? `• ${timeStr}` : ''}
                            </div>
                            <div style="font-size: 1em; line-height: 1.4;">
                                ${formatMessageContent(message.content)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function formatMessageContent(content) {
        // Basic formatting for messages
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px;">$1</code>')
            .replace(/\n/g, '<br>');
    }
    
    function scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer && chatData.settings.autoScroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    // ===================================
    // CHAT EVENT HANDLERS
    // ===================================
    
    window.openChat = function() {
        createChatInterface();
    };
    
    window.closeChat = function() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.remove();
        }
        const settingsModal = document.getElementById('chat-settings-modal');
        if (settingsModal) {
            settingsModal.remove();
        }
    };
    
    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        // Add message
        addMessage(message, 'user');
        
        // Simulate responses (in real implementation, this would be server-side)
        setTimeout(() => {
            simulateBotResponse(message);
        }, 1000 + Math.random() * 2000);
    };
    
    window.handleChatKeyPress = function(event) {
        if (event.key === 'Enter') {
            sendChatMessage();
        }
    };
    
    window.toggleChatSettings = function() {
        const modal = document.getElementById('chat-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };
    
    window.closeChatSettings = function() {
        const modal = document.getElementById('chat-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.saveChatSettings = function() {
        const soundSetting = document.getElementById('chat-sound-setting');
        const notificationsSetting = document.getElementById('chat-notifications-setting');
        const timestampsSetting = document.getElementById('chat-timestamps-setting');
        const usernameSetting = document.getElementById('chat-username-setting');
        
        if (soundSetting) chatData.settings.soundEnabled = soundSetting.checked;
        if (notificationsSetting) chatData.settings.notifications = notificationsSetting.checked;
        if (timestampsSetting) chatData.settings.showTimestamps = timestampsSetting.checked;
        if (usernameSetting && usernameSetting.value.trim()) {
            chatData.currentUser.username = usernameSetting.value.trim();
        }
        
        saveChatData();
        updateChatUI();
        closeChatSettings();
        
        window.terminal.log('✅ Chat settings saved', 'success');
    };
    
    // ===================================
    // BOT RESPONSES & SIMULATION
    // ===================================
    
    function simulateBotResponse(userMessage) {
        const responses = [
            "That's interesting! 🤔",
            "I agree with that! 👍",
            "Has anyone tried the new Python integration? 🐍",
            "The Omega Terminal is getting so many cool features! 🚀",
            "What's your favorite command? 💻",
            "Anyone else excited about the ENS integration? 🔗",
            "The profile system is really coming together! 👤",
            "Have you tried the games yet? 🎮",
            "The PGT integration looks promising! 📊",
            "Terminal chatter is awesome! 💬"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'bot', 'OmegaBot');
    }
    
    function playMessageSound() {
        // Simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    function showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Terminal Chatter', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>'
            });
        }
    }
    
    // ===================================
    // COMMAND HANDLER
    // ===================================
    
    window.handleChatCommand = function(args) {
        const subcommand = args[0]?.toLowerCase();
        
        switch (subcommand) {
            case 'open':
            case 'start':
                openChat();
                break;
                
            case 'close':
            case 'stop':
                closeChat();
                break;
                
            case 'settings':
                if (document.getElementById('chat-container')) {
                    toggleChatSettings();
                } else {
                    window.terminal.log('❌ Chat not open. Use: chat open', 'error');
                }
                break;
                
            case 'help':
                showChatHelp();
                break;
                
            default:
                openChat();
        }
    };
    
    function showChatHelp() {
        window.terminal.log('💬 Terminal Chatter Commands:', 'info');
        window.terminal.log('', 'output');
        window.terminal.log('  chat open      - Open chat interface', 'output');
        window.terminal.log('  chat close     - Close chat', 'output');
        window.terminal.log('  chat settings  - Open chat settings', 'output');
        window.terminal.log('  chat help      - Show this help', 'output');
        window.terminal.log('', 'output');
        window.terminal.log('Features:', 'info');
        window.terminal.log('  💬 Real-time messaging', 'output');
        window.terminal.log('  👤 User avatars & usernames', 'output');
        window.terminal.log('  🔊 Sound effects', 'output');
        window.terminal.log('  🔔 Notifications', 'output');
        window.terminal.log('  ⚙️ Customizable settings', 'output');
    }
    
    // ===================================
    // INTEGRATION WITH MAIN TERMINAL
    // ===================================
    
    function integrateChat() {
        if (window.terminal && window.terminal.executeCommand) {
            console.log('💬 Integrating Terminal Chatter with main terminal...');
            
            const originalExecuteCommand = window.terminal.executeCommand;
            window.terminal.executeCommand = function(command) {
                const args = command.trim().split(/\s+/);
                const cmd = args[0].toLowerCase();
                
                if (cmd === 'chat') {
                    handleChatCommand(args.slice(1));
                    return;
                }
                
                return originalExecuteCommand.call(this, command);
            };
            
            console.log('✅ Terminal Chatter integration successful!');
            return true;
        }
        return false;
    }
    
    // Try to integrate when ready
    function tryIntegrateChat() {
        if (!integrateChat()) {
            setTimeout(tryIntegrateChat, 500);
        }
    }
    
    // Start integration
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryIntegrateChat);
    } else {
        tryIntegrateChat();
    }
    
    // Initialize
    loadChatData();
    
    console.log('✅ Terminal Chatter Mode loaded successfully!');
    console.log('💬 Use "chat" command to open chat interface');
    
})();
