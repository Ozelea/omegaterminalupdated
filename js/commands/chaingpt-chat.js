console.log('[DEBUG] Loading ChainGPT Web3 AI Chatbot module...');

/**
 * ChainGPT Web3 AI Chatbot & LLM Integration
 * Based on: https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/web3-ai-chatbot-and-llm-api-and-sdk/javascript/quickstart-guide
 */

const ChainGPTChat = {
    config: {
        baseUrl: 'https://api.chaingpt.org',
        endpoint: '/chat/stream',
        model: 'general_assistant',
        currentKeyIndex: 0,
        initialized: false
    },

    /**
     * Initialize with API key (optional - will use default if not provided)
     */
    init: function(apiKey) {
        if (apiKey) {
            // User provided their own API key
            this.config.apiKey = apiKey;
            localStorage.setItem('chaingpt-chat-api-key', apiKey);
            localStorage.setItem('chaingpt-chat-initialized', 'true');
            console.log('[DEBUG] ChainGPT Chat initialized with user API key');
        } else {
            // Use default API key from config
            const defaultKey = this.getDefaultApiKey();
            if (defaultKey) {
                this.config.apiKey = defaultKey;
                localStorage.setItem('chaingpt-chat-initialized', 'true');
                console.log('[DEBUG] ChainGPT Chat initialized with default API key');
            } else {
                throw new Error('No API key available. Please provide one or check configuration.');
            }
        }
        
        this.config.initialized = true;
        return true;
    },

    /**
     * Check if initialized
     */
    isInitialized: function() {
        const initFlag = localStorage.getItem('chaingpt-chat-initialized');
        const apiKey = this.getApiKey();
        console.log('[DEBUG] isInitialized check:');
        console.log('[DEBUG] - initFlag:', initFlag);
        console.log('[DEBUG] - apiKey present:', !!apiKey);
        console.log('[DEBUG] - result:', initFlag === 'true' && !!apiKey);
        return initFlag === 'true' && apiKey;
    },

    /**
     * Get default API key from config (production or fallback)
     */
    getDefaultApiKey: function() {
        if (window.OmegaConfig && window.OmegaConfig.CHAINGPT) {
            // Use the centralized API key getter
            if (window.OmegaConfig.CHAINGPT.getApiKey) {
                return window.OmegaConfig.CHAINGPT.getApiKey();
            }
            // Fallback to old method
            if (window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS) {
                return window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS[this.config.currentKeyIndex];
            }
        }
        return null;
    },

    /**
     * Get API key (user key takes priority, then default)
     */
    getApiKey: function() {
        // First try user's custom API key
        const userKey = localStorage.getItem('chaingpt-chat-api-key');
        if (userKey) {
            return userKey;
        }
        
        // Fall back to default API key
        return this.getDefaultApiKey();
    },

    /**
     * Try next API key if current one fails
     */
    tryNextApiKey: function() {
        if (window.OmegaConfig && window.OmegaConfig.CHAINGPT && window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS) {
            const defaultKeys = window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS;
            if (defaultKeys.length > 1) {
                this.config.currentKeyIndex = (this.config.currentKeyIndex + 1) % defaultKeys.length;
                console.log(`[DEBUG] Trying next API key (index: ${this.config.currentKeyIndex})`);
                return this.getDefaultApiKey();
            }
        }
        return null;
    },

    /**
     * Create chat blob (single response)
     */
    createChatBlob: async function(options) {
        let apiKey = this.getApiKey();
        if (!apiKey) {
            // Try to auto-initialize with default key
            try {
                this.init();
                apiKey = this.getApiKey();
            } catch (error) {
                throw new Error('Not initialized. Use: chat init [api-key] or chat init (for default key)');
            }
        }

        const payload = {
            model: options.model || this.config.model,
            question: options.question,
            chatHistory: options.chatHistory || 'off'
        };

        // Add optional parameters
        if (options.sdkUniqueId) {
            payload.sdkUniqueId = options.sdkUniqueId;
        }

        if (options.useCustomContext) {
            payload.useCustomContext = options.useCustomContext;
            if (options.contextInjection) {
                payload.contextInjection = options.contextInjection;
            }
        }

        console.log('[DEBUG] Chat payload:', payload);

        const response = await fetch(`${this.config.baseUrl}${this.config.endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // If it's an authentication error and we have fallback keys, try next key
            if ((response.status === 401 || response.status === 403) && !localStorage.getItem('chaingpt-chat-api-key')) {
                const nextKey = this.tryNextApiKey();
                if (nextKey) {
                    console.log('[DEBUG] Retrying with next API key...');
                    return this.createChatBlob(options);
                }
            }
            
            throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        // Check if response is JSON or plain text
        const contentType = response.headers.get('content-type');
        console.log('[DEBUG] Response content-type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // Handle plain text or HTML response
            const textResponse = await response.text();
            console.log('[DEBUG] Non-JSON response received:', textResponse.substring(0, 200) + '...');
            
            // Return as a structured object for consistency
            return {
                success: true,
                data: {
                    answer: textResponse,
                    type: 'text'
                }
            };
        }
    },

    /**
     * Create chat stream (real-time streaming)
     */
    createChatStream: async function(options) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('Not initialized. Use: chat init <api-key>');
        }

        const payload = {
            model: options.model || this.config.model,
            question: options.question,
            chatHistory: options.chatHistory || 'off'
        };

        // Add optional parameters
        if (options.sdkUniqueId) {
            payload.sdkUniqueId = options.sdkUniqueId;
        }

        if (options.useCustomContext) {
            payload.useCustomContext = options.useCustomContext;
            if (options.contextInjection) {
                payload.contextInjection = options.contextInjection;
            }
        }

        console.log('[DEBUG] Chat stream payload:', payload);

        const response = await fetch(`${this.config.baseUrl}${this.config.endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        return response.body.getReader();
    }
};

/**
 * ChainGPT Chat Commands
 */
const ChainGPTChatCommands = {
    /**
     * Main command handler
     */
    chat: async function(terminal, args) {
        console.log('[DEBUG] ChainGPTChatCommands.chat called with args:', args);
        
        if (args.length === 0) {
            this.handleHelp(terminal);
            return;
        }

        const subcommand = args[0].toLowerCase();
        console.log('[DEBUG] Subcommand detected:', subcommand);

        switch (subcommand) {
            case 'init':
                console.log('[DEBUG] Calling handleInit...');
                await this.handleInit(terminal, args);
                break;
            case 'ask':
            case 'question':
                await this.handleAsk(terminal, args);
                break;
            case 'stream':
                await this.handleStream(terminal, args);
                break;
            case 'context':
                await this.handleContext(terminal, args);
                break;
            case 'history':
                await this.handleHistory(terminal, args);
                break;
            case 'test':
                await this.handleTest(terminal);
                break;
            case 'help':
                this.handleHelp(terminal);
                break;
            default:
                // Treat as a question if no subcommand matches
                await this.handleAsk(terminal, args);
                break;
        }
    },

    /**
     * Initialize with API key (optional)
     */
    handleInit: async function(terminal, args) {
        console.log('[DEBUG] handleInit called with args:', args);
        
        const apiKey = args.length >= 2 ? args[1] : null;
        console.log('[DEBUG] API Key received:', apiKey ? 'Present' : 'Using default');
        
        try {
            ChainGPTChat.init(apiKey);
            console.log('[DEBUG] ChainGPT Chat init completed');
            
            // Verify initialization
            const isInit = ChainGPTChat.isInitialized();
            console.log('[DEBUG] Is initialized after init:', isInit);
            console.log('[DEBUG] API key in localStorage:', localStorage.getItem('chaingpt-chat-api-key') ? 'Present' : 'Missing');
            
            if (apiKey) {
                terminal.log('[+] ChainGPT Chat initialized with your API key!', 'success');
                terminal.log('[+] Ready to chat with Web3 AI assistant', 'info');
            } else {
                terminal.log('[+] ChainGPT Chat initialized with default API key!', 'success');
                terminal.log('[+] Ready to chat with Web3 AI assistant', 'info');
                terminal.log('[!] Using default key for testing. Use "chat init <your-api-key>" for your own key', 'info');
            }
            terminal.log('[+] Try: chat ask "What is ChainGPT?"', 'info');
        } catch (error) {
            console.log('[DEBUG] Initialization error:', error);
            terminal.log(`❌ Initialization failed: ${error.message}`, 'error');
        }
    },

    /**
     * Ask a question (blob response)
     */
    handleAsk: async function(terminal, args) {
        if (!ChainGPTChat.isInitialized()) {
            terminal.log('❌ Not initialized. Use: chat init <api-key>', 'error');
            return;
        }

        // Join all args as the question (skip 'ask' or 'question' if present)
        let question = args.join(' ');
        if (args[0].toLowerCase() === 'ask' || args[0].toLowerCase() === 'question') {
            question = args.slice(1).join(' ');
        }

        if (!question.trim()) {
            terminal.log('❌ Usage: chat ask "<your question>"', 'error');
            terminal.log('💡 Example: chat ask "What is DeFi?"', 'info');
            return;
        }

        terminal.log('🤖 Asking ChainGPT Web3 AI...', 'info');
        terminal.log(`📝 Question: ${question}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTChat.createChatBlob({
                question: question,
                chatHistory: 'off'
            });

            console.log('[DEBUG] Full API response:', result);
            
            // Handle different response formats
            let responseText = '';
            let isSuccess = false;
            
            if (result.status && result.data && result.data.bot) {
                // Standard JSON response format
                responseText = result.data.bot;
                isSuccess = true;
            } else if (result.success && result.data && result.data.answer) {
                // Plain text response format
                responseText = result.data.answer;
                isSuccess = true;
            } else if (result.data && result.data.answer) {
                // Alternative text response format
                responseText = result.data.answer;
                isSuccess = true;
            } else if (typeof result === 'string') {
                // Direct string response
                responseText = result;
                isSuccess = true;
            } else if (result.answer) {
                // Simple answer format
                responseText = result.answer;
                isSuccess = true;
            }
            
            if (isSuccess && responseText) {
                terminal.log('✅ ChainGPT Response:', 'success');
                terminal.log('');
                
                // Display response with beautiful formatting
                const responseHtml = `
                    <div class="chaingpt-chat-container" style="
                        background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(15,15,26,0.95)); 
                        border: 1px solid rgba(0,212,255,0.25); 
                        border-radius: 16px; 
                        padding: 24px; 
                        margin: 20px 0; 
                        backdrop-filter: blur(20px); 
                        box-shadow: 0 8px 32px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08); 
                        position: relative; 
                        overflow: hidden;
                        transition: all 0.3s ease;
                    ">
                        <!-- Animated background effect -->
                        <div style="
                            position: absolute; 
                            top: 0; 
                            left: 0; 
                            right: 0; 
                            bottom: 0; 
                            background: linear-gradient(45deg, transparent 30%, rgba(0,212,255,0.02) 50%, transparent 70%); 
                            animation: shimmer 4s infinite; 
                            pointer-events: none;
                        "></div>
                        
                        <div style="text-align: center; margin-bottom: 20px; position: relative; z-index: 1;">
                            <h3 style="
                                color: var(--cyber-blue); 
                                margin: 0 0 10px 0; 
                                font-size: 1.4em; 
                                font-weight: 600;
                                text-shadow: 0 0 8px rgba(0,212,255,0.4);
                                letter-spacing: 0.5px;
                                font-family: var(--font-tech);
                            ">🤖 ChainGPT Web3 AI</h3>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, rgba(10,10,15,0.8), rgba(26,26,40,0.9)); 
                            border: 1px solid rgba(0,212,255,0.15); 
                            border-radius: 12px; 
                            padding: 20px; 
                            margin: 16px 0; 
                            font-size: 1em; 
                            line-height: 1.6; 
                            color: #E0E0E0;
                            font-family: var(--font-tech);
                            position: relative;
                            z-index: 1;
                        ">
                            ${responseText.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div style="
                            text-align: center; 
                            margin-top: 16px; 
                            font-size: 0.85em; 
                            color: #B0B0B0;
                            font-family: var(--font-tech);
                            position: relative;
                            z-index: 1;
                        ">
                            💰 Credits used: 0.5 | 🤖 Model: general_assistant
                        </div>
                    </div>
                `;
                
                terminal.logHtml(responseHtml, 'output');
                
                terminal.log('');
                terminal.log('💡 Use "chat stream" for real-time responses', 'info');
                terminal.log('💡 Use "chat history on" for conversation memory', 'info');
            } else {
                terminal.log('❌ Unexpected response format', 'error');
                terminal.log('📊 Response:', JSON.stringify(result, null, 2), 'output');
                terminal.log('💡 The API might be returning HTML or plain text instead of JSON', 'info');
            }
        } catch (error) {
            console.log('[DEBUG] Chat error:', error);
            
            if (error.message.includes('Unexpected token') || error.message.includes('not valid JSON')) {
                terminal.log('❌ API returned non-JSON response (HTML or plain text)', 'error');
                terminal.log('💡 This might be a temporary API issue or incorrect endpoint', 'info');
                terminal.log('💡 Try again in a moment or check your API key', 'info');
            } else {
                terminal.log(`❌ Chat failed: ${error.message}`, 'error');
            }
        }
    },

    /**
     * Stream a question (real-time response)
     */
    handleStream: async function(terminal, args) {
        if (!ChainGPTChat.isInitialized()) {
            terminal.log('❌ Not initialized. Use: chat init <api-key>', 'error');
            return;
        }

        // Join all args as the question (skip 'stream' if present)
        let question = args.join(' ');
        if (args[0].toLowerCase() === 'stream') {
            question = args.slice(1).join(' ');
        }

        if (!question.trim()) {
            terminal.log('❌ Usage: chat stream "<your question>"', 'error');
            terminal.log('💡 Example: chat stream "Explain DeFi in detail"', 'info');
            return;
        }

        terminal.log('🌊 Streaming ChainGPT Web3 AI response...', 'info');
        terminal.log(`📝 Question: ${question}`, 'info');
        terminal.log('');

        try {
            const reader = await ChainGPTChat.createChatStream({
                question: question,
                chatHistory: 'off'
            });

            terminal.log('🤖 ChainGPT Response (Streaming):', 'success');
            terminal.log('');

            let fullResponse = '';
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (data.data && data.data.bot) {
                                process.stdout.write(data.data.bot);
                                fullResponse += data.data.bot;
                            }
                        } catch (e) {
                            // Skip non-JSON lines
                        }
                    }
                }
            }

            terminal.log('');
            terminal.log('');
            terminal.log('✅ Streaming complete!', 'success');
            terminal.log('💰 Credits used: 0.5', 'info');
        } catch (error) {
            terminal.log(`❌ Streaming failed: ${error.message}`, 'error');
        }
    },

    /**
     * Set custom context
     */
    handleContext: async function(terminal, args) {
        if (!ChainGPTChat.isInitialized()) {
            terminal.log('❌ Not initialized. Use: chat init <api-key>', 'error');
            return;
        }

        if (args.length < 2) {
            terminal.log('❌ Usage: chat context "<your question>"', 'error');
            terminal.log('💡 Example: chat context "Explain our DeFi project"', 'info');
            return;
        }

        const question = args.slice(1).join(' ');

        terminal.log('🎯 Asking with custom context...', 'info');
        terminal.log(`📝 Question: ${question}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTChat.createChatBlob({
                question: question,
                chatHistory: 'off',
                useCustomContext: true,
                contextInjection: {
                    companyName: "Omega Terminal",
                    companyDescription: "A Web3 terminal with AI-powered tools",
                    aiTone: "PRE_SET_TONE",
                    selectedTone: "FRIENDLY"
                }
            });

            if (result.status && result.data && result.data.bot) {
                terminal.log('✅ ChainGPT Response (with context):', 'success');
                terminal.log('');
                
                const responseHtml = `
                    <div style="background: linear-gradient(135deg, rgba(255,193,7,0.1), rgba(255,255,255,0.95)); border: 2px solid rgba(255,193,7,0.3); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(30px); box-shadow: 0 12px 40px rgba(255,193,7,0.2);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="color: #FFC107; margin: 0 0 10px 0; font-size: 1.5em;">🎯 ChainGPT (Custom Context)</h3>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.9); border-radius: 16px; padding: 20px; margin: 16px 0; font-size: 1.1em; line-height: 1.6; color: #333;">
                            ${result.data.bot.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div style="text-align: center; margin-top: 16px; font-size: 0.9em; color: #666;">
                            💰 Credits used: 0.5 | 🎯 Custom context applied
                        </div>
                    </div>
                `;
                
                terminal.logHtml(responseHtml, 'output');
            } else {
                terminal.log('❌ Unexpected response format', 'error');
            }
        } catch (error) {
            terminal.log(`❌ Context chat failed: ${error.message}`, 'error');
        }
    },

    /**
     * Chat with history
     */
    handleHistory: async function(terminal, args) {
        if (!ChainGPTChat.isInitialized()) {
            terminal.log('❌ Not initialized. Use: chat init <api-key>', 'error');
            return;
        }

        if (args.length < 2) {
            terminal.log('❌ Usage: chat history "<your question>"', 'error');
            terminal.log('💡 Example: chat history "What did I ask before?"', 'info');
            return;
        }

        const question = args.slice(1).join(' ');
        const sessionId = 'omega-terminal-user'; // Fixed session ID for terminal

        terminal.log('🧠 Asking with conversation memory...', 'info');
        terminal.log(`📝 Question: ${question}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTChat.createChatBlob({
                question: question,
                chatHistory: 'on',
                sdkUniqueId: sessionId
            });

            if (result.status && result.data && result.data.bot) {
                terminal.log('✅ ChainGPT Response (with memory):', 'success');
                terminal.log('');
                
                const responseHtml = `
                    <div style="background: linear-gradient(135deg, rgba(40,167,69,0.1), rgba(255,255,255,0.95)); border: 2px solid rgba(40,167,69,0.3); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(30px); box-shadow: 0 12px 40px rgba(40,167,69,0.2);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="color: #28A745; margin: 0 0 10px 0; font-size: 1.5em;">🧠 ChainGPT (With Memory)</h3>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.9); border-radius: 16px; padding: 20px; margin: 16px 0; font-size: 1.1em; line-height: 1.6; color: #333;">
                            ${result.data.bot.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div style="text-align: center; margin-top: 16px; font-size: 0.9em; color: #666;">
                            💰 Credits used: 1.0 | 🧠 Conversation memory active
                        </div>
                    </div>
                `;
                
                terminal.logHtml(responseHtml, 'output');
            } else {
                terminal.log('❌ Unexpected response format', 'error');
            }
        } catch (error) {
            terminal.log(`❌ History chat failed: ${error.message}`, 'error');
        }
    },

    /**
     * Test API connection
     */
    handleTest: async function(terminal) {
        if (!ChainGPTChat.isInitialized()) {
            terminal.log('❌ Not initialized. Use: chat init <api-key>', 'error');
            return;
        }

        terminal.log('🧪 Testing ChainGPT Chat API connection...', 'info');
        
        const apiKey = ChainGPTChat.getApiKey();
        terminal.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`, 'info');
        terminal.log(`🌐 Base URL: ${ChainGPTChat.config.baseUrl}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTChat.createChatBlob({
                question: "Hello! Are you working?",
                chatHistory: 'off'
            });

            if (result.status && result.data && result.data.bot) {
                terminal.log('✅ ChainGPT Chat API is working!', 'success');
                terminal.log('🤖 Test Response:', 'info');
                terminal.log(`   ${result.data.bot}`, 'output');
                terminal.log('');
                terminal.log('💰 Credits used: 0.5', 'info');
            } else {
                terminal.log('❌ Unexpected response format', 'error');
                terminal.log('📊 Response:', JSON.stringify(result, null, 2), 'output');
            }
        } catch (error) {
            terminal.log(`❌ Test failed: ${error.message}`, 'error');
        }
    },

    /**
     * Show help
     */
    handleHelp: function(terminal) {
        terminal.log('[+] ChainGPT Web3 AI Chatbot & LLM', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');
        terminal.log('[!] SETUP & CONFIGURATION:', 'info');
        terminal.log('  chat init                     Initialize with default API key (for testing)', 'output');
        terminal.log('  chat init <api-key>           Initialize with your own API key', 'output');
        terminal.log('  chat test                     Test API connection', 'output');
        terminal.log('');
        terminal.log('💬 CHAT COMMANDS:', 'info');
        terminal.log('  chat ask "<question>"         Ask a question (single response)', 'output');
        terminal.log('  chat stream "<question>"      Ask with real-time streaming', 'output');
        terminal.log('  chat context "<question>"     Ask with custom context', 'output');
        terminal.log('  chat history "<question>"     Ask with conversation memory', 'output');
        terminal.log('');
        terminal.log('⚡ EXAMPLES:', 'info');
        terminal.log('  chat ask "What is DeFi?"', 'output');
        terminal.log('  chat stream "Explain blockchain technology"', 'output');
        terminal.log('  chat context "Tell me about our project"', 'output');
        terminal.log('  chat history "What did I ask before?"', 'output');
        terminal.log('');
        terminal.log('💰 CREDITS:', 'info');
        terminal.log('  • Single response: 0.5 credits', 'output');
        terminal.log('  • With history: +0.5 credits (total 1.0)', 'output');
        terminal.log('  • Get credits: https://api.chaingpt.org', 'output');
        terminal.log('');
        terminal.log('🔗 RESOURCES:', 'info');
        terminal.log('  API Dashboard: https://api.chaingpt.org', 'output');
        terminal.log('  Documentation: https://docs.chaingpt.org', 'output');
    }
};

// Make globally accessible
window.ChainGPTChatCommands = ChainGPTChatCommands;

console.log('[DEBUG] ✅ ChainGPT Web3 AI Chatbot loaded successfully');

// Auto-initialize with default key if config is available
if (window.OmegaConfig && window.OmegaConfig.CHAINGPT && window.OmegaConfig.CHAINGPT.AUTO_INITIALIZE) {
    try {
        ChainGPTChat.init();
        console.log('[DEBUG] ChainGPT Chat auto-initialized with default key');
    } catch (error) {
        console.log('[DEBUG] ChainGPT Chat auto-initialization failed:', error.message);
    }
}
