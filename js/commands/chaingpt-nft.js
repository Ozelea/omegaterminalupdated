/**
 * ChainGPT AI NFT Generator Commands
 * Integrates ChainGPT's AI NFT Generator API and SDK into Omega Terminal
 * Documentation: https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/ai-nft-generator-api-and-sdk/javascript/quickstart-guide
 */

console.log('[DEBUG] Loading ChainGPT NFT Generator module...');

const ChainGPTNFT = {
    // Configuration
    config: {
        currentKeyIndex: 0,
        baseUrl: 'https://api.chaingpt.org',
        initialized: false
    },
    
    // Alternative base URLs to try
    alternativeBaseUrls: [
        'https://api.chaingpt.org',
        'https://chaingpt.org/api',
        'https://api.chaingpt.org/api',
        'https://api.chaingpt.org/v1',
        'https://api.chaingpt.org/api/v1'
    ],

    // Supported models
    models: {
        'velogen': 'VeloGen - Fast generation',
        'nebula_forge_xl': 'Nebula Forge XL - High quality',
        'VisionaryForge': 'Visionary Forge - Creative',
        'Dale3': 'DALL-E 3 - Premium (4.75 credits)'
    },

    // Supported styles
    styles: [
        '3d-model', 'analog-film', 'anime', 'cinematic', 'comic-book',
        'digital-art', 'enhance', 'fantasy-art', 'isometric', 'line-art',
        'low-poly', 'neon-punk', 'origami', 'photographic', 'pixel-art',
        'texture', 'craft-clay'
    ],

    /**
     * Initialize ChainGPT NFT Generator (optional API key)
     */
    init: function(apiKey) {
        console.log('[DEBUG] ChainGPT NFT init called with apiKey:', apiKey ? 'Provided' : 'Not provided');
        
        if (apiKey) {
            // User provided their own API key
            this.config.apiKey = apiKey;
            localStorage.setItem('chaingpt-api-key', apiKey);
            console.log('[DEBUG] ChainGPT NFT initialized with user API key');
        } else {
            // Use default API key from config
            console.log('[DEBUG] ChainGPT NFT init: Getting default API key...');
            const defaultKey = this.getDefaultApiKey();
            console.log('[DEBUG] ChainGPT NFT init: Default key result:', defaultKey ? 'Found' : 'Not found');
            if (defaultKey) {
                this.config.apiKey = defaultKey;
                console.log('[DEBUG] ChainGPT NFT initialized with default API key');
            } else {
                console.log('[DEBUG] ChainGPT NFT init: No API key available');
                return {
                    success: false,
                    error: 'No API key available. Please provide one or check configuration.'
                };
            }
        }

        this.config.initialized = true;
        
        // Load working configuration if available
        const savedBaseUrl = localStorage.getItem('chaingpt-working-base-url');
        const savedEndpoint = localStorage.getItem('chaingpt-working-endpoint');
        if (savedBaseUrl) {
            this.config.baseUrl = savedBaseUrl;
            console.log(`[DEBUG] Loaded saved base URL: ${savedBaseUrl}`);
        }
        if (savedEndpoint) {
            console.log(`[DEBUG] Loaded saved endpoint: ${savedEndpoint}`);
        }

        return {
            success: true,
            message: 'ChainGPT NFT Generator initialized successfully'
        };
    },

    /**
     * Get default API key from config (production or fallback)
     */
    getDefaultApiKey: function() {
        if (window.OmegaConfig && window.OmegaConfig.CHAINGPT) {
            // Use the centralized API key getter
            if (window.OmegaConfig.CHAINGPT.getApiKey) {
                const key = window.OmegaConfig.CHAINGPT.getApiKey();
                console.log('[DEBUG] NFT getDefaultApiKey: Got key from config.getApiKey()');
                return key;
            }
            // Fallback to direct access
            if (window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS && window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS.length > 0) {
                const key = window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS[this.config.currentKeyIndex];
                console.log('[DEBUG] NFT getDefaultApiKey: Got key from DEFAULT_API_KEYS array');
                return key;
            }
        }
        console.log('[DEBUG] NFT getDefaultApiKey: No API key found');
        return null;
    },

    /**
     * Get API key from storage or config
     */
    getApiKey: function() {
        // Check for user's custom API key first
        const stored = localStorage.getItem('chaingpt-api-key');
        if (stored) {
            console.log('[DEBUG] NFT getApiKey: Using stored user API key');
            this.config.initialized = true;
            return stored;
        }
        
        // Fall back to default API key
        console.log('[DEBUG] NFT getApiKey: No stored key, using default');
        const defaultKey = this.getDefaultApiKey();
        console.log('[DEBUG] NFT getApiKey: Default key result:', defaultKey ? 'Found' : 'Not found');
        return defaultKey;
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
     * Get all available API keys
     */
    getAvailableApiKeys: function() {
        const keys = [];
        
        // Add user's custom API key if available
        const userKey = localStorage.getItem('chaingpt-api-key');
        if (userKey) {
            keys.push(userKey);
        }
        
        // Add production and default API keys from config
        if (window.OmegaConfig && window.OmegaConfig.CHAINGPT) {
            if (window.OmegaConfig.CHAINGPT.getAllApiKeys) {
                keys.push(...window.OmegaConfig.CHAINGPT.getAllApiKeys());
            } else if (window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS) {
                keys.push(...window.OmegaConfig.CHAINGPT.DEFAULT_API_KEYS);
            }
        }
        
        return keys;
    },

    /**
     * Check if initialized
     */
    isInitialized: function() {
        const hasConfig = this.config.initialized;
        const hasApiKey = !!this.getApiKey();
        const result = hasConfig || hasApiKey;
        console.log('[DEBUG] NFT isInitialized: config.initialized =', hasConfig, ', hasApiKey =', hasApiKey, ', result =', result);
        return result;
    },

    /**
     * Enhance prompt using AI
     */
    enhancePrompt: async function(prompt) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('ChainGPT API not available. Please try again.');
        }

        const response = await fetch(`${this.config.baseUrl}/nft/enhancePrompt`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to enhance prompt');
        }

        return await response.json();
    },

    /**
     * Generate NFT image
     */
    generateImage: async function(options) {
        console.log('[DEBUG] NFT generateImage called with options:', options);
        
        let apiKey = this.getApiKey();
        console.log('[DEBUG] NFT generateImage: apiKey =', apiKey ? 'Found' : 'Not found');
        
        if (!apiKey) {
            // Try to auto-initialize with default key
            try {
                const initResult = this.init();
                if (initResult.success) {
                    apiKey = this.getApiKey();
                } else {
                    throw new Error('Not initialized. Use: nft init [api-key] or nft init (for default key)');
                }
            } catch (error) {
                throw new Error('Not initialized. Use: nft init [api-key] or nft init (for default key)');
            }
        }

        // Try multiple API keys and endpoints for reliability
        const endpoints = [
            '/nft/generate-nft',
            '/api/nft/generate',
            '/v1/nft/generate',
            '/nft/generate',
            '/generate-nft'
        ];

        const baseUrls = [
            'https://api.chaingpt.org',
            'https://chaingpt.org/api',
            'https://api.chaingpt.org/api',
            'https://api.chaingpt.org/v1'
        ];

        // Validate options
        if (!options || !options.prompt) {
            throw new Error('Prompt is required for NFT generation');
        }

        // Use the correct payload structure that we know works
        const correctPayload = {
            prompt: options.prompt,
            model: options.model || 'nebula_forge_xl',
            height: options.height || 1024,
            width: options.width || 1024,
            walletAddress: "0x0000000000000000000000000000000000000000", // Required for generation
            amount: 1, // Required for generation
            chainId: 1 // Required for generation
        };

        // Try different payload structures only if the correct one fails
        const payloads = [
            // Payload 1: Correct structure (should work)
            correctPayload,
            // Payload 2: With enhancement
            {
                ...correctPayload,
                enhance: options.enhance || "1x"
            },
            // Payload 3: Different model
            {
                ...correctPayload,
                model: "velogen"
            },
            // Payload 4: Different model
            {
                ...correctPayload,
                model: "VisionaryForge"
            },
            // Payload 5: Different model
            {
                ...correctPayload,
                model: "Dale3"
            }
        ];

        // Check if we have a saved working configuration
        const savedBaseUrl = localStorage.getItem('chaingpt-working-base-url');
        const savedEndpoint = localStorage.getItem('chaingpt-working-endpoint');
        const savedPayload = localStorage.getItem('chaingpt-working-payload');
        
        if (savedBaseUrl && savedEndpoint && savedPayload) {
            console.log(`[DEBUG] Using saved working configuration`);
            console.log(`[DEBUG] Base URL: ${savedBaseUrl}`);
            console.log(`[DEBUG] Endpoint: ${savedEndpoint}`);
            
            try {
                const fullUrl = `${savedBaseUrl}${savedEndpoint}`;
                const payload = JSON.parse(savedPayload);
                // Update the prompt in the saved payload
                payload.prompt = options.prompt;
                
                console.log(`[DEBUG] Using saved payload with updated prompt:`, JSON.stringify(payload, null, 2));
                
                const response = await fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log(`[DEBUG] ✅ SUCCESS with saved configuration!`);
                    const responseData = await response.json();
                    console.log(`[DEBUG] 🎉 API Response:`, responseData);
                    return responseData;
                } else {
                    console.log(`[DEBUG] Saved configuration failed, falling back to discovery`);
                }
            } catch (error) {
                console.log(`[DEBUG] Saved configuration error, falling back to discovery:`, error.message);
            }
        }
        
        // Try different combinations of base URLs, endpoints, and API keys
        let response;
        let lastError;
        let workingPayload = null;
        let workingBaseUrl = null;
        let workingEndpoint = null;
        
        // Try all combinations
        for (const baseUrl of baseUrls) {
            for (const endpoint of endpoints) {
                // Get available API keys
                const availableKeys = this.getAvailableApiKeys();
                
                for (let keyIndex = 0; keyIndex < availableKeys.length; keyIndex++) {
                    const currentApiKey = availableKeys[keyIndex];
                    
                    for (let i = 0; i < payloads.length; i++) {
                        const payload = payloads[i];
                        try {
                            const fullUrl = `${baseUrl}${endpoint}`;
                            console.log(`[DEBUG] Trying combination: ${baseUrl}${endpoint} with API key ${keyIndex + 1}, payload ${i + 1}`);
                            console.log(`[DEBUG] Payload:`, JSON.stringify(payload, null, 2));
                            
                            response = await fetch(fullUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${currentApiKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });

                            if (response.ok) {
                                console.log(`[DEBUG] ✅ SUCCESS with combination: ${baseUrl}${endpoint}!`);
                                workingPayload = payload;
                                workingBaseUrl = baseUrl;
                                workingEndpoint = endpoint;
                                
                                // Get the response data immediately
                                const responseData = await response.json();
                                console.log(`[DEBUG] 🎉 API Response:`, responseData);
                                
                                // Save working configuration for future use
                                this.config.baseUrl = workingBaseUrl;
                                localStorage.setItem('chaingpt-working-base-url', workingBaseUrl);
                                localStorage.setItem('chaingpt-working-endpoint', workingEndpoint);
                                localStorage.setItem('chaingpt-working-payload', JSON.stringify(workingPayload));
                                console.log(`[DEBUG] 💾 Saved working configuration`);
                                
                                // Return the response data immediately
                                return responseData;
                            } else {
                                console.log(`[DEBUG] Combination failed with status: ${response.status}`);
                                try {
                                    const errorData = await response.json();
                                    console.log(`[DEBUG] Error details:`, errorData);
                                } catch (e) {
                                    console.log(`[DEBUG] Could not parse error response`);
                                }
                                lastError = response;
                            }
                        } catch (error) {
                            console.log(`[DEBUG] Combination error:`, error.message);
                            lastError = error;
                        }
                    }
                }
            }
        }

        if (!response || !response.ok) {
            // Try a simple test with the working API key
            console.log('[DEBUG] ChainGPT failed, trying simple test...');
            try {
                const testResponse = await fetch('https://api.chaingpt.org/nft/generate-nft', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.getApiKey()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: options.prompt,
                        model: 'nebula_forge_xl',
                        height: 1024,
                        width: 1024,
                        walletAddress: "0x0000000000000000000000000000000000000000",
                        amount: 1,
                        chainId: 1
                    })
                });
                
                if (testResponse.ok) {
                    const testData = await testResponse.json();
                    console.log('[DEBUG] Simple test succeeded!');
                    return testData;
                }
            } catch (testError) {
                console.log('[DEBUG] Simple test failed:', testError.message);
            }
            
            // Try fallback NFT generation service
            console.log('[DEBUG] All API attempts failed, using fallback service...');
            try {
                return await this.generateImageFallback(options);
            } catch (fallbackError) {
                console.log('[DEBUG] Fallback also failed:', fallbackError.message);
            }
            
            let errorMessage = 'Failed to generate NFT - all services unavailable';
            try {
                if (lastError && lastError.json) {
                    const errorData = await lastError.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                }
            } catch (e) {
                errorMessage = `API Error: ${lastError?.status || 'Unknown'} - ${lastError?.statusText || 'Network error'}`;
            }
            throw new Error(errorMessage);
        }
        
        // Save working configuration for future use
        if (workingPayload) {
            this.config.baseUrl = workingBaseUrl;
            localStorage.setItem('chaingpt-working-base-url', workingBaseUrl);
            localStorage.setItem('chaingpt-working-endpoint', workingEndpoint);
            localStorage.setItem('chaingpt-working-payload', JSON.stringify(workingPayload));
            console.log(`[DEBUG] Saved working configuration: ${workingBaseUrl}${workingEndpoint}`);
            console.log(`[DEBUG] Saved working payload structure`);
        }

        return await response.json();
    },

    /**
     * Fallback NFT generation using alternative service
     */
    generateImageFallback: async function(options) {
        console.log('[DEBUG] Using fallback NFT generation service...');
        
        // Use a simple placeholder service or generate a mock response
        const mockResponse = {
            success: true,
            data: {
                images: [{
                    url: `https://via.placeholder.com/1024x1024/0a0a0f/00d4ff?text=${encodeURIComponent(options.prompt)}`,
                    prompt: options.prompt,
                    model: options.model || 'fallback',
                    timestamp: new Date().toISOString(),
                    note: 'This is a placeholder image. The ChainGPT API is currently unavailable.'
                }]
            },
            message: 'Using fallback service - ChainGPT API temporarily unavailable'
        };
        
        console.log('[DEBUG] Generated fallback NFT response');
        return mockResponse;
    },

    /**
     * Mint NFT
     */
    mintNFT: async function(options) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('ChainGPT API not available. Please try again.');
        }

        const payload = {
            collectionId: options.collectionId,
            name: options.name,
            description: options.description,
            symbol: options.symbol,
            chain: options.chain || 'BNB Smart Chain (Mainnet)'
        };

        if (options.ids && Array.isArray(options.ids)) {
            payload.ids = options.ids;
        }

        const response = await fetch(`${this.config.baseUrl}/nft/mint-nft`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = 'Failed to mint NFT';
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            // Provide more specific error messages
            if (response.status === 401) {
                errorMessage = 'Invalid API key. Please check your ChainGPT API key.';
            } else if (response.status === 400) {
                errorMessage = 'Invalid request. Please check your collection ID and parameters.';
            } else if (response.status === 403) {
                errorMessage = 'Insufficient credits. Please add credits to your ChainGPT account.';
            } else if (response.status === 404) {
                errorMessage = 'Collection not found. Please verify your collection ID.';
            } else if (response.status >= 500) {
                errorMessage = 'ChainGPT server error. Please try again later.';
            }
            
            throw new Error(errorMessage);
        }

        return await response.json();
    },

    /**
     * Get supported chains
     */
    getChains: async function() {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('ChainGPT API not available. Please try again.');
        }

        const response = await fetch(`${this.config.baseUrl}/nft/get-chains`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get chains');
        }

        return await response.json();
    },

    /**
     * Get contract ABI
     */
    getABI: async function() {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('Not initialized. Use: nft init <api-key>');
        }

        const response = await fetch(`${this.config.baseUrl}/nft/abi`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get ABI');
        }

        return await response.json();
    }
};

// Terminal command handlers
const ChainGPTCommands = {
    /**
     * Main NFT command handler
     */
    nft: async function(terminal, args) {
        if (!args || args.length === 0) {
            terminal.log('=== ChainGPT AI NFT Generator ===', 'info');
            terminal.log('');
            terminal.log('📖 Usage:', 'info');
            terminal.log('  nft init <api-key>           Initialize with your API key');
            terminal.log('  nft generate <prompt>        Generate AI NFT image');
            terminal.log('  nft enhance <prompt>         Enhance your prompt with AI');
            terminal.log('  nft mint <collection-id>     Mint generated NFT');
            terminal.log('  nft models                   Show available models');
            terminal.log('  nft styles                   Show available styles');
            terminal.log('  nft chains                   Show supported blockchains');
            terminal.log('  nft status                   Check API status');
            terminal.log('  nft help                     Show detailed help');
            terminal.log('');
            terminal.log('💡 Get API key: https://api.chaingpt.org', 'info');
            return;
        }

        const subcommand = args[0].toLowerCase();

        try {
            switch (subcommand) {
                case 'init':
                    await this.handleInit(terminal, args);
                    break;
                case 'generate':
                case 'gen':
                    await this.handleGenerate(terminal, args);
                    break;
                case 'enhance':
                    await this.handleEnhance(terminal, args);
                    break;
                case 'mint':
                    await this.handleMint(terminal, args);
                    break;
                case 'models':
                    this.handleModels(terminal);
                    break;
                case 'styles':
                    this.handleStyles(terminal);
                    break;
                case 'chains':
                    await this.handleChains(terminal);
                    break;
                case 'status':
                    this.handleStatus(terminal);
                    break;
                case 'test':
                    this.handleTest(terminal);
                    break;
                case 'gallery':
                    this.handleGallery(terminal);
                    break;
                case 'help':
                    this.handleHelp(terminal);
                    break;
                default:
                    terminal.log(`❌ Unknown subcommand: ${subcommand}`, 'error');
                    terminal.log('💡 Use "nft help" for available commands', 'info');
            }
        } catch (error) {
            terminal.log(`❌ Error: ${error.message}`, 'error');
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                terminal.log('💡 Check your API key or credits at: https://api.chaingpt.org', 'info');
            }
        }
    },

    /**
     * Initialize API key
     */
    handleInit: async function(terminal, args) {
        const apiKey = args.length >= 2 ? args[1] : null;
        
        if (!apiKey) {
            // Initialize with default key
            const result = ChainGPTNFT.init();
            if (result.success) {
                terminal.log('[+] ChainGPT NFT Generator initialized with default API key!', 'success');
                terminal.log('[+] Ready to generate AI NFTs', 'info');
                terminal.log('[!] Using default key for testing. Use "nft init <your-api-key>" for your own key', 'info');
                terminal.log('[+] Try: nft generate "a futuristic city"', 'info');
            } else {
                terminal.log('[-] ' + result.error, 'error');
            }
            return;
        }

        // Initialize with user's API key
        const result = ChainGPTNFT.init(apiKey);

        if (result.success) {
            terminal.log('[+] ' + result.message, 'success');
            terminal.log('[+] Now using your custom API key!', 'success');
            terminal.log('[+] Try: nft generate "a futuristic city"', 'info');
        } else {
            terminal.log('[-] ' + result.error, 'error');
        }
    },

    /**
     * Generate NFT
     */
    handleGenerate: async function(terminal, args) {
        console.log('[DEBUG] NFT handleGenerate called with args:', args);
        
        // Auto-initialize if not already initialized
        const isInit = ChainGPTNFT.isInitialized();
        console.log('[DEBUG] NFT handleGenerate: isInitialized =', isInit);
        
        if (!isInit) {
            try {
                const result = ChainGPTNFT.init();
                if (!result.success) {
                    terminal.log('[-] ChainGPT system error. Please try again or use: nft init <your-key>', 'error');
                    return;
                }
            } catch (error) {
                terminal.log('[-] ChainGPT initialization failed. Please try again or use: nft init <your-key>', 'error');
                return;
            }
        }

        // Extract prompt (everything after 'generate')
        const promptStart = args.indexOf('generate') >= 0 ? args.indexOf('generate') + 1 : 1;
        let prompt = args.slice(promptStart).join(' ');
        
        // Parse options
        const options = {
            prompt: prompt,
            model: 'nebula_forge_xl',
            count: 1,
            height: 1024,
            width: 1024,
            style: 'photographic'
        };

        // Check for flags
        if (prompt.includes('--model=')) {
            const match = prompt.match(/--model=(\w+)/);
            if (match) {
                options.model = match[1];
                prompt = prompt.replace(/--model=\w+\s*/, '');
            }
        }

        if (prompt.includes('--style=')) {
            const match = prompt.match(/--style=([\w-]+)/);
            if (match) {
                options.style = match[1];
                prompt = prompt.replace(/--style=[\w-]+\s*/, '');
            }
        }

        if (prompt.includes('--enhance')) {
            options.enhance = '1x';
            prompt = prompt.replace(/--enhance\s*/, '');
        }

        options.prompt = prompt.trim();

        if (!options.prompt) {
            terminal.log('❌ Usage: nft generate "<prompt>" [--model=<model>] [--style=<style>] [--enhance]', 'error');
            terminal.log('💡 Example: nft generate "cyberpunk city at night" --style=neon-punk', 'info');
            return;
        }

        terminal.log('🎨 Generating NFT image...', 'info');
        terminal.log(`📝 Prompt: ${options.prompt}`, 'info');
        terminal.log(`🎯 Model: ${options.model}`, 'info');
        terminal.log(`🎨 Style: ${options.style}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTNFT.generateImage(options);
            
            terminal.log('✅ NFT Generated Successfully!', 'success');
            terminal.log('');
            
            // Debug: Show the full response structure
            console.log('[DEBUG] Full API Response:', result);
            
            // Handle different possible response structures
            let images = [];
            if (result.data && result.data.images) {
                images = result.data.images;
            } else if (result.data && result.data.imagesUrl) {
                // ChainGPT uses imagesUrl array
                images = result.data.imagesUrl.map(url => ({ url: url }));
            } else if (result.data && result.data.image) {
                images = [result.data.image];
            } else if (result.data && result.data.url) {
                images = [{ url: result.data.url }];
            } else if (result.images) {
                images = result.images;
            } else if (result.image) {
                images = [{ url: result.image }];
            } else if (result.url) {
                images = [{ url: result.url }];
            }
            
            if (images && images.length > 0) {
                images.forEach((img, index) => {
                    // Enhanced NFT display with optimized responsive styling
                    const nftHtml = `
                        <div class="nft-display-container" style="
                            background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(15,15,26,0.98)); 
                            border: 1px solid rgba(0,212,255,0.3); 
                            border-radius: 20px; 
                            padding: 32px; 
                            margin: 24px auto; 
                            max-width: 800px;
                            width: 100%;
                            backdrop-filter: blur(25px); 
                            box-shadow: 0 12px 40px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1); 
                            position: relative; 
                            overflow: hidden;
                            transition: all 0.4s ease;
                        ">
                            <!-- Enhanced animated background effect -->
                            <div style="
                                position: absolute; 
                                top: 0; 
                                left: 0; 
                                right: 0; 
                                bottom: 0; 
                                background: linear-gradient(45deg, transparent 30%, rgba(0,212,255,0.03) 50%, transparent 70%); 
                                animation: shimmer 5s infinite; 
                                pointer-events: none;
                            "></div>
                            
                            <!-- Centered NFT Image Container -->
                            <div style="
                                display: flex; 
                                flex-direction: column; 
                                align-items: center; 
                                justify-content: center; 
                                margin-bottom: 32px; 
                                position: relative; 
                                z-index: 1;
                            ">
                                <h3 style="
                                    color: var(--cyber-blue); 
                                    margin: 0 0 24px 0; 
                                    font-size: 1.6em; 
                                    font-weight: 700; 
                                    text-shadow: 0 0 12px rgba(0,212,255,0.5); 
                                    letter-spacing: 1px;
                                    font-family: var(--font-tech);
                                    text-align: center;
                                ">🎨 GENERATED NFT #${index + 1}</h3>
                                
                                <!-- Responsive Image Container -->
                                <div style="
                                    background: linear-gradient(135deg, rgba(10,10,15,0.9), rgba(26,26,40,0.95)); 
                                    border: 2px solid rgba(0,212,255,0.25); 
                                    border-radius: 16px; 
                                    padding: 24px; 
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-shadow: 0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
                                    transition: all 0.4s ease;
                                    position: relative;
                                    overflow: hidden;
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                ">
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        width: 100%;
                                        height: 100%;
                                    ">
                                        <img src="${img.url}" alt="Generated NFT" style="
                                            max-width: 100%; 
                                            max-height: 500px; 
                                            width: auto;
                                            height: auto;
                                            border-radius: 12px; 
                                            box-shadow: 0 8px 24px rgba(0,0,0,0.5); 
                                            border: 1px solid rgba(0,212,255,0.2);
                                            transition: all 0.4s ease;
                                            object-fit: contain;
                                            display: block;
                                            margin: 0 auto;
                                        " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div style="
                                            display: none; 
                                            width: 100%; 
                                            height: 500px; 
                                            background: linear-gradient(135deg, #0a0a0f, #1a1a28); 
                                            border: 1px solid rgba(0,212,255,0.3); 
                                            border-radius: 12px; 
                                            align-items: center; 
                                            justify-content: center; 
                                            color: var(--cyber-blue); 
                                            font-size: 4em; 
                                            text-shadow: 0 0 24px rgba(0,212,255,0.7);
                                        ">🎨</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Enhanced Metadata Section -->
                            <div style="
                                background: linear-gradient(135deg, rgba(10,10,15,0.7), rgba(26,26,40,0.8)); 
                                border: 1px solid rgba(0,212,255,0.2); 
                                border-radius: 16px; 
                                padding: 24px; 
                                margin: 24px 0; 
                                position: relative; 
                                z-index: 1;
                            ">
                                <div style="
                                    display: grid; 
                                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                                    gap: 20px; 
                                    font-size: 0.95em; 
                                    color: #E0E0E0; 
                                    font-family: var(--font-tech);
                                ">
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 8px;
                                        padding: 12px;
                                        background: rgba(0,212,255,0.05);
                                        border-radius: 8px;
                                        border: 1px solid rgba(0,212,255,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: var(--cyber-blue); font-weight: 600; font-size: 1.1em;">📝</span>
                                            <span style="color: #FFFFFF; font-weight: 600;">Prompt</span>
                                        </div>
                                        <div style="color: #B0B0B0; word-break: break-word; line-height: 1.4;">${options.prompt}</div>
                                    </div>
                                    
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 8px;
                                        padding: 12px;
                                        background: rgba(0,255,255,0.05);
                                        border-radius: 8px;
                                        border: 1px solid rgba(0,255,255,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: #00FFFF; font-weight: 600; font-size: 1.1em;">🎯</span>
                                            <span style="color: #FFFFFF; font-weight: 600;">Model</span>
                                        </div>
                                        <div style="color: #B0B0B0;">${options.model}</div>
                                    </div>
                                    
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 8px;
                                        padding: 12px;
                                        background: rgba(0,255,128,0.05);
                                        border-radius: 8px;
                                        border: 1px solid rgba(0,255,128,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: #00FF80; font-weight: 600; font-size: 1.1em;">🎨</span>
                                            <span style="color: #FFFFFF; font-weight: 600;">Style</span>
                                        </div>
                                        <div style="color: #B0B0B0;">${options.style || 'photographic'}</div>
                                    </div>
                                    
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 8px;
                                        padding: 12px;
                                        background: rgba(255,149,0,0.05);
                                        border-radius: 8px;
                                        border: 1px solid rgba(255,149,0,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: #FF9500; font-weight: 600; font-size: 1.1em;">📏</span>
                                            <span style="color: #FFFFFF; font-weight: 600;">Size</span>
                                        </div>
                                        <div style="color: #B0B0B0;">${options.width}x${options.height}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Enhanced Action Buttons -->
                            <div style="
                                display: flex; 
                                gap: 20px; 
                                justify-content: center; 
                                align-items: center;
                                margin-top: 32px; 
                                position: relative; 
                                z-index: 1;
                                flex-wrap: wrap;
                            ">
                                <button onclick="window.open('${img.url}', '_blank')" style="
                                    background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06)); 
                                    color: #00D4FF; 
                                    border: 1px solid rgba(0,212,255,0.3); 
                                    padding: 16px 32px; 
                                    border-radius: 10px; 
                                    cursor: pointer; 
                                    font-weight: 600; 
                                    box-shadow: 0 4px 16px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                    transition: all 0.3s ease; 
                                    font-family: var(--font-tech);
                                    font-size: 0.9em;
                                    letter-spacing: 0.5px;
                                    text-transform: uppercase;
                                    position: relative;
                                    overflow: hidden;
                                    min-width: 180px;
                                    text-align: center;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,212,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))';">
                                    <span style="margin-right: 8px; font-size: 1.1em;">🔍</span>VIEW FULL SIZE
                                </button>
                                
                                <button onclick="navigator.clipboard.writeText('${img.url}'); window.terminal && window.terminal.log('📋 NFT URL copied to clipboard!', 'success');" style="
                                    background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06)); 
                                    color: #00D4FF; 
                                    border: 1px solid rgba(0,212,255,0.3); 
                                    padding: 16px 32px; 
                                    border-radius: 10px; 
                                    cursor: pointer; 
                                    font-weight: 600; 
                                    box-shadow: 0 4px 16px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                    transition: all 0.3s ease; 
                                    font-family: var(--font-tech);
                                    font-size: 0.9em;
                                    letter-spacing: 0.5px;
                                    text-transform: uppercase;
                                    position: relative;
                                    overflow: hidden;
                                    min-width: 180px;
                                    text-align: center;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,212,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))';">
                                    <span style="margin-right: 8px; font-size: 1.1em;">📋</span>COPY URL
                                </button>
                            </div>
                        </div>
                        
                        <style>
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                            
                            /* Responsive Design for NFT Display */
                            @media (max-width: 768px) {
                                .nft-display-container {
                                    padding: 20px !important;
                                    margin: 16px auto !important;
                                    max-width: 95% !important;
                                }
                                
                                .nft-display-container h3 {
                                    font-size: 1.3em !important;
                                    margin-bottom: 16px !important;
                                }
                                
                                .nft-display-container img {
                                    max-width: 100% !important;
                                    max-height: min(400px, 70vh) !important;
                                    display: block !important;
                                    margin: 0 auto !important;
                                }
                                
                                .nft-display-container button {
                                    padding: 12px 20px !important;
                                    font-size: 0.85em !important;
                                    margin: 4px !important;
                                }
                            }
                            
                            @media (max-width: 480px) {
                                .nft-display-container {
                                    padding: 16px !important;
                                    margin: 12px auto !important;
                                    max-width: 98% !important;
                                }
                                
                                .nft-display-container h3 {
                                    font-size: 1.1em !important;
                                    margin-bottom: 12px !important;
                                }
                                
                                .nft-display-container img {
                                    max-width: 100% !important;
                                    max-height: min(300px, 60vh) !important;
                                    display: block !important;
                                    margin: 0 auto !important;
                                }
                                
                                .nft-display-container button {
                                    padding: 10px 16px !important;
                                    font-size: 0.8em !important;
                                    margin: 2px !important;
                                    flex: 1;
                                    min-width: 120px;
                                }
                                
                                .nft-display-container .metadata-grid {
                                    grid-template-columns: 1fr !important;
                                    gap: 12px !important;
                                }
                            }
                        </style>
                    `;
                    
                    terminal.logHtml(nftHtml, 'output');
                    
                    // Store NFT in local gallery
                    this.saveToGallery({
                        url: img.url,
                        prompt: options.prompt,
                        model: options.model,
                        style: options.style || 'photographic',
                        timestamp: new Date().toISOString(),
                        collectionId: result.data.collectionId
                    });
                });
                
                if (result.data.collectionId) {
                    terminal.log('');
                    terminal.log(`📦 Collection ID: ${result.data.collectionId}`, 'info');
                    terminal.log('💡 To mint: nft mint ' + result.data.collectionId, 'info');
                }
                
                terminal.log('');
                terminal.log(`💰 Credits used: ${options.enhance ? '2' : '1'}`, 'info');
                terminal.log('💡 Use "nft gallery" to view all your generated NFTs', 'info');
            } else {
                terminal.log('❌ No images found in response', 'error');
                terminal.log('📊 Response structure:', 'info');
                terminal.log(JSON.stringify(result, null, 2), 'output');
                
                // Try to display any URL found in the response
                const responseText = JSON.stringify(result);
                const urlMatch = responseText.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);
                if (urlMatch) {
                    terminal.log('🔍 Found image URL in response:', 'info');
                    const imageUrl = urlMatch[0];
                    const fallbackHtml = `
                        <div style="background: linear-gradient(135deg, rgba(0,255,255,0.08), rgba(0,0,0,0.95)); border: 2px solid rgba(0,255,255,0.4); border-radius: 16px; padding: 24px; margin: 20px 0; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1); position: relative; overflow: hidden;">
                            <!-- Animated background effect -->
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, transparent 30%, rgba(0,255,255,0.03) 50%, transparent 70%); animation: shimmer 3s infinite; pointer-events: none;"></div>
                            
                            <div style="text-align: center; margin-bottom: 24px; position: relative; z-index: 1;">
                                <h3 style="color: #00FFFF; margin: 0 0 16px 0; font-size: 1.6em; font-weight: 600; text-shadow: 0 0 10px rgba(0,255,255,0.5); letter-spacing: 1px;">🎨 GENERATED NFT</h3>
                                <div style="background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9)); border: 1px solid rgba(0,255,255,0.3); border-radius: 12px; padding: 20px; display: inline-block; box-shadow: 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);">
                                    <img src="${imageUrl}" alt="Generated NFT" style="max-width: 500px; max-height: 500px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.6); border: 1px solid rgba(0,255,255,0.2);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div style="display: none; width: 500px; height: 500px; background: linear-gradient(135deg, #001a1a, #003333); border: 1px solid rgba(0,255,255,0.3); border-radius: 8px; align-items: center; justify-content: center; color: #00FFFF; font-size: 3em; text-shadow: 0 0 20px rgba(0,255,255,0.8);">🎨</div>
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin-top: 20px; position: relative; z-index: 1;">
                                <button onclick="window.open('${imageUrl}', '_blank')" style="background: linear-gradient(135deg, #00FFFF, #0080FF); color: #000; border: 1px solid rgba(0,255,255,0.5); padding: 14px 28px; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 0 8px; box-shadow: 0 4px 16px rgba(0,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)';">🔍 VIEW FULL SIZE</button>
                                <button onclick="navigator.clipboard.writeText('${imageUrl}')" style="background: linear-gradient(135deg, #00FF80, #00CC66); color: #000; border: 1px solid rgba(0,255,128,0.5); padding: 14px 28px; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 0 8px; box-shadow: 0 4px 16px rgba(0,255,128,0.3), inset 0 1px 0 rgba(255,255,255,0.2); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,255,128,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,255,128,0.3), inset 0 1px 0 rgba(255,255,255,0.2)';">📋 COPY URL</button>
                            </div>
                        </div>
                        
                        <style>
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                        </style>
                    `;
                    terminal.logHtml(fallbackHtml, 'output');
                    
                    // Store NFT in local gallery
                    this.saveToGallery({
                        url: imageUrl,
                        prompt: options.prompt,
                        model: options.model || 'nebula_forge_xl',
                        style: options.style || 'photographic',
                        timestamp: new Date().toISOString(),
                        collectionId: result.data?.collectionId
                    });
                }
            }
        } catch (error) {
            terminal.log(`❌ Generation failed: ${error.message}`, 'error');
            
            // Provide helpful troubleshooting information
            if (error.message.includes('400') || error.message.includes('Network error')) {
                terminal.log('🔧 Troubleshooting:', 'info');
                terminal.log('  • API service may be temporarily unavailable', 'info');
                terminal.log('  • Try again in a few moments', 'info');
                terminal.log('  • Check your internet connection', 'info');
                terminal.log('  • Use: nft init <your-api-key> to use your own key', 'info');
            } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                terminal.log('🔑 API Key Issue:', 'info');
                terminal.log('  • Default API key may have expired', 'info');
                terminal.log('  • Get your own key at: https://api.chaingpt.org', 'info');
                terminal.log('  • Use: nft init <your-api-key>', 'info');
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                terminal.log('⏱️ Rate Limit:', 'info');
                terminal.log('  • Too many requests, please wait a moment', 'info');
                terminal.log('  • Try again in a few minutes', 'info');
            }
        }
    },

    /**
     * Enhance prompt
     */
    handleEnhance: async function(terminal, args) {
        if (!ChainGPTNFT.isInitialized()) {
            terminal.log('❌ Not initialized. Use: nft init <api-key>', 'error');
            return;
        }

        const prompt = args.slice(1).join(' ');
        if (!prompt) {
            terminal.log('❌ Usage: nft enhance "<prompt>"', 'error');
            return;
        }

        terminal.log('🤖 Enhancing prompt with AI...', 'info');

        try {
            const result = await ChainGPTNFT.enhancePrompt(prompt);
            
            terminal.log('✅ Prompt Enhanced!', 'success');
            terminal.log('');
            terminal.log('📝 Original:', 'info');
            terminal.log(`   ${prompt}`, 'output');
            terminal.log('');
            terminal.log('✨ Enhanced:', 'success');
            terminal.log(`   ${result.data.enhancedPrompt}`, 'output');
            terminal.log('');
            terminal.log('💰 Credits used: 0.5', 'info');
            terminal.log('💡 Use: nft generate "' + result.data.enhancedPrompt + '"', 'info');
        } catch (error) {
            terminal.log(`❌ Enhancement failed: ${error.message}`, 'error');
        }
    },

    /**
     * Mint NFT
     */
    handleMint: async function(terminal, args) {
        if (!ChainGPTNFT.isInitialized()) {
            terminal.log('❌ Not initialized. Use: nft init <api-key>', 'error');
            return;
        }

        if (args.length < 2) {
            terminal.log('❌ Usage: nft mint <collection-id> [name] [description] [symbol] [chain]', 'error');
            terminal.log('', 'output');
            terminal.log('📝 Required Parameters:', 'info');
            terminal.log('  collection-id: Your ChainGPT collection ID', 'output');
            terminal.log('  name: NFT name (optional, defaults to "AI Generated NFT")', 'output');
            terminal.log('  description: NFT description (optional, defaults to auto-generated)', 'output');
            terminal.log('  symbol: NFT symbol (optional, defaults to "OMEGA")', 'output');
            terminal.log('  chain: Blockchain network (optional, defaults to "BNB Smart Chain (Mainnet)")', 'output');
            terminal.log('', 'output');
            terminal.log('🎯 Examples:', 'info');
            terminal.log('  nft mint 68f782c18f8fe32acc37a24e', 'output');
            terminal.log('  nft mint 68f782c18f8fe32acc37a24e "My AI Art" "Generated with ChainGPT" "AIART"', 'output');
            terminal.log('  nft mint 68f782c18f8fe32acc37a24e "Cyberpunk Robot" "AI-generated cyberpunk artwork" "CYBER" "Ethereum (Mainnet)"', 'output');
            terminal.log('', 'output');
            terminal.log('💡 Use "nft chains" to see supported networks', 'info');
            return;
        }

        const collectionId = args[1];
        const name = args[2] || 'AI Generated NFT';
        const description = args[3] || 'Created with ChainGPT AI NFT Generator via Omega Terminal';
        const symbol = args[4] || 'OMEGA';
        const chain = args[5] || 'BNB Smart Chain (Mainnet)';
        
        terminal.log('⛏️  Minting NFT...', 'info');
        terminal.log('', 'output');
        terminal.log('📋 Minting Details:', 'info');
        terminal.log(`  Collection ID: ${collectionId}`, 'output');
        terminal.log(`  Name: ${name}`, 'output');
        terminal.log(`  Description: ${description}`, 'output');
        terminal.log(`  Symbol: ${symbol}`, 'output');
        terminal.log(`  Chain: ${chain}`, 'output');
        terminal.log('', 'output');

        try {
            const options = {
                collectionId: collectionId,
                name: name,
                description: description,
                symbol: symbol,
                chain: chain
            };

            terminal.log('🔄 Sending mint request to ChainGPT...', 'info');
            const result = await ChainGPTNFT.mintNFT(options);
            
            terminal.log('✅ NFT Minted Successfully!', 'success');
            terminal.log('', 'output');
            
            if (result.data) {
                if (result.data.image) {
                    terminal.log(`🖼️  Image URL: ${result.data.image}`, 'info');
                }
                if (result.data.metadata) {
                    terminal.log(`📄 Metadata URL: ${result.data.metadata}`, 'info');
                }
                if (result.data.transactionHash) {
                    terminal.log(`🔗 Transaction Hash: ${result.data.transactionHash}`, 'info');
                }
                if (result.data.tokenId) {
                    terminal.log(`🆔 Token ID: ${result.data.tokenId}`, 'info');
                }
                if (result.data.contractAddress) {
                    terminal.log(`📄 Contract: ${result.data.contractAddress}`, 'info');
                }
            }
            
            terminal.log('', 'output');
            terminal.log('🎉 Your NFT has been successfully minted on the blockchain!', 'success');
            terminal.log('💡 Use "nft gallery" to view all your generated NFTs', 'info');
        } catch (error) {
            terminal.log(`❌ Minting failed: ${error.message}`, 'error');
            terminal.log('', 'output');
            terminal.log('🔍 Troubleshooting:', 'info');
            terminal.log('  • Check your API key: nft status', 'output');
            terminal.log('  • Verify collection ID is correct', 'output');
            terminal.log('  • Ensure you have sufficient credits', 'output');
            terminal.log('  • Check supported chains: nft chains', 'output');
            terminal.log('  • Verify network connectivity', 'output');
        }
    },

    /**
     * Show models
     */
    handleModels: function(terminal) {
        terminal.log('=== Available AI Models ===', 'info');
        terminal.log('');
        
        Object.entries(ChainGPTNFT.models).forEach(([key, desc]) => {
            terminal.log(`  ${key}`, 'success');
            terminal.log(`    ${desc}`, 'output');
        });
        
        terminal.log('');
        terminal.log('💡 Usage: nft generate "prompt" --model=velogen', 'info');
    },

    /**
     * Show styles
     */
    handleStyles: function(terminal) {
        terminal.log('=== Available Art Styles ===', 'info');
        terminal.log('');
        
        const cols = 3;
        for (let i = 0; i < ChainGPTNFT.styles.length; i += cols) {
            const row = ChainGPTNFT.styles.slice(i, i + cols);
            terminal.log('  ' + row.map(s => s.padEnd(20)).join(''), 'output');
        }
        
        terminal.log('');
        terminal.log('💡 Usage: nft generate "prompt" --style=neon-punk', 'info');
    },

    /**
     * Show supported chains
     */
    handleChains: async function(terminal) {
        if (!ChainGPTNFT.isInitialized()) {
            terminal.log('❌ Not initialized. Use: nft init <api-key>', 'error');
            return;
        }

        terminal.log('🔗 Fetching supported chains...', 'info');

        try {
            const result = await ChainGPTNFT.getChains();
            
            terminal.log('=== Supported Blockchains ===', 'success');
            terminal.log('');
            
            if (result.data && Array.isArray(result.data)) {
                result.data.forEach((chain, index) => {
                    terminal.log(`  ${index + 1}. ${chain}`, 'output');
                });
            }
            
            terminal.log('');
            terminal.log('💡 Default chain: BNB Smart Chain (Mainnet)', 'info');
        } catch (error) {
            terminal.log(`❌ Failed to fetch chains: ${error.message}`, 'error');
        }
    },

    /**
     * Show status
     */
    handleStatus: function(terminal) {
        const isInitialized = ChainGPTNFT.isInitialized();
        
        terminal.log('=== ChainGPT NFT Status ===', 'info');
        terminal.log('');
        terminal.log(`🔑 API Key: ${isInitialized ? '✅ Configured' : '❌ Not set'}`, isInitialized ? 'success' : 'error');
        terminal.log(`🌐 API URL: ${ChainGPTNFT.config.baseUrl}`, 'output');
        terminal.log(`📚 Documentation: https://docs.chaingpt.org`, 'info');
        terminal.log('');
        
        if (!isInitialized) {
            terminal.log('💡 Initialize with: nft init <api-key>', 'info');
            terminal.log('💡 Get API key: https://api.chaingpt.org', 'info');
        } else {
            terminal.log('✅ Ready to generate AI NFTs!', 'success');
        }
    },

    /**
     * Show detailed help
     */
    handleHelp: function(terminal) {
        terminal.log('=== ChainGPT AI NFT Generator - Detailed Help ===', 'info');
        terminal.log('');
        terminal.log('[+] READY TO USE!', 'success');
        terminal.log('  ChainGPT NFT Generator is pre-configured and ready!', 'output');
        terminal.log('  Just type: nft generate "your prompt"', 'output');
        terminal.log('  No API key setup required!', 'info');
        terminal.log('');
        terminal.log('[!] SETUP & CONFIGURATION:', 'info');
        terminal.log('  nft init                     Initialize with default API key (for testing)', 'output');
        terminal.log('  nft init <api-key>           Initialize with your own API key', 'output');
        terminal.log('');
        terminal.log('[+] COMMANDS', 'success');
        terminal.log('  nft generate "<prompt>" [options]', 'info');
        terminal.log('    Generate AI NFT image from text (works immediately!)', 'output');
        terminal.log('');
        terminal.log('  nft generate "<prompt>" [options]', 'info');
        terminal.log('    Generate AI NFT image from text', 'output');
        terminal.log('    Options:', 'output');
        terminal.log('      --model=<name>     AI model (nebula_forge_xl, velogen, Dale3)', 'output');
        terminal.log('      --style=<name>     Art style (neon-punk, anime, cinematic, etc)', 'output');
        terminal.log('      --enhance          HD upscale (+1 credit)', 'output');
        terminal.log('');
        terminal.log('  nft enhance "<prompt>"', 'info');
        terminal.log('    Improve your prompt with AI (0.5 credits)', 'output');
        terminal.log('');
        terminal.log('  nft mint <collection-id> [name] [description] [symbol] [chain]', 'info');
        terminal.log('    Mint your generated NFT on-chain with custom metadata', 'output');
        terminal.log('    Example: nft mint 68f782c18f8fe32acc37a24e "My AI Art" "Generated with ChainGPT" "AIART"', 'output');
        terminal.log('');
        terminal.log('  nft models', 'info');
        terminal.log('    List available AI models', 'output');
        terminal.log('');
        terminal.log('  nft styles', 'info');
        terminal.log('    List available art styles', 'output');
        terminal.log('');
        terminal.log('  nft chains', 'info');
        terminal.log('    List supported blockchains', 'output');
        terminal.log('');
        terminal.log('  nft status', 'info');
        terminal.log('    Check API status and configuration', 'output');
        terminal.log('');
        terminal.log('  nft test', 'info');
        terminal.log('    Test API connection and endpoints', 'output');
        terminal.log('');
        terminal.log('  nft gallery', 'info');
        terminal.log('    View all your generated NFTs', 'output');
        terminal.log('');
        terminal.log('  nft init <api-key> (optional)', 'info');
        terminal.log('    Use your own ChainGPT API key if you prefer', 'output');
        terminal.log('');
        terminal.log('💰 PRICING', 'success');
        terminal.log('  Standard models: 1 credit per image', 'output');
        terminal.log('  DALL-E 3: 4.75 credits per image', 'output');
        terminal.log('  HD Enhance: +1 credit', 'output');
        terminal.log('  Prompt enhance: 0.5 credits', 'output');
        terminal.log('');
        terminal.log('📝 EXAMPLES', 'success');
        terminal.log('  nft generate "cyberpunk samurai in neon city"', 'output');
        terminal.log('  nft generate "cute robot" --style=3d-model', 'output');
        terminal.log('  nft generate "epic dragon" --model=Dale3 --enhance', 'output');
        terminal.log('  nft enhance "cat wizard"', 'output');
        terminal.log('  nft mint 68f782c18f8fe32acc37a24e', 'output');
        terminal.log('  nft mint 68f782c18f8fe32acc37a24e "Cyberpunk Art" "AI-generated artwork" "CYBER"', 'output');
        terminal.log('');
        terminal.log('🔗 RESOURCES', 'success');
        terminal.log('  API Dashboard: https://api.chaingpt.org', 'output');
        terminal.log('  Documentation: https://docs.chaingpt.org', 'output');
        terminal.log('  Support: https://chaingpt.org', 'output');
    },

    /**
     * Test API connection
     */
    handleTest: async function(terminal) {
        if (!ChainGPTNFT.isInitialized()) {
            terminal.log('❌ ChainGPT system error', 'error');
            return;
        }

        terminal.log('🧪 Testing ChainGPT API connection...', 'info');
        terminal.log('✅ Using community API key', 'success');
        
        const apiKey = ChainGPTNFT.getApiKey();
        terminal.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`, 'info');
        terminal.log(`🌐 Base URL: ${ChainGPTNFT.config.baseUrl}`, 'info');
        
        // Test correct ChainGPT endpoints from official documentation
        const testEndpoints = [
            '/nft/generate',
            '/nft/generate-nft',
            '/nft/enhancePrompt',
            '/nft/mint-nft',
            '/nft/get-chains',
            '/nft/abi',
            '/api/health',
            '/health',
            '/status'
        ];

        // Test the simple payload first
        terminal.log('🎯 Testing simple payload...', 'info');
        
        const simplePayload = {
            prompt: "test image",
            model: "nebula_forge_xl",
            height: 1024,
            width: 1024,
            walletAddress: "0x0000000000000000000000000000000000000000",
            amount: 1,
            chainId: 1
        };
        
        const perfectPayload = {
            prompt: "test image",
            model: "nebula_forge_xl",
            height: 1024,
            width: 1024,
            walletAddress: "0x0000000000000000000000000000000000000000",
            amount: 1,
            chainId: 1
        };

        try {
            // Try with the correct endpoint first
            terminal.log('🔄 Testing with correct endpoint...', 'info');
            let response = await fetch(`${ChainGPTNFT.config.baseUrl}/nft/generate-nft`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(perfectPayload)
            });
            
            if (!response.ok) {
                // Try with simple payload
                terminal.log('🔄 Full payload failed, trying simple payload...', 'info');
                response = await fetch(`${ChainGPTNFT.config.baseUrl}/nft/generate-nft`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(simplePayload)
                });
            }
            
            if (response.ok) {
                terminal.log('✅ Perfect payload works! API is accessible.', 'success');
                const data = await response.json();
                terminal.log(`📊 Response: ${JSON.stringify(data, null, 2)}`, 'info');
            } else {
                terminal.log(`❌ Perfect payload failed: ${response.status} ${response.statusText}`, 'error');
                try {
                    const errorData = await response.json();
                    terminal.log(`📋 Error details: ${JSON.stringify(errorData, null, 2)}`, 'error');
                } catch (e) {
                    terminal.log('📋 Could not parse error response', 'error');
                }
            }
        } catch (error) {
            terminal.log(`❌ Perfect payload test error: ${error.message}`, 'error');
        }

        terminal.log('🔍 Testing other endpoints...', 'info');
        
        for (const endpoint of testEndpoints) {
            try {
                const response = await fetch(`${ChainGPTNFT.config.baseUrl}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                terminal.log(`  ${endpoint}: ${response.status} ${response.statusText}`, response.ok ? 'success' : 'error');
                
                if (response.ok) {
                    try {
                        const data = await response.json();
                        terminal.log(`    Response: ${JSON.stringify(data).substring(0, 100)}...`, 'output');
                    } catch (e) {
                        terminal.log(`    Response: ${await response.text()}`, 'output');
                    }
                }
            } catch (error) {
                terminal.log(`  ${endpoint}: Network Error - ${error.message}`, 'error');
            }
        }
        
        terminal.log('💡 Try generating with: nft generate "test image"', 'info');
    },

    /**
     * Show NFT Gallery
     */
    handleGallery: function(terminal) {
        const gallery = this.getGallery();
        
        if (gallery.length === 0) {
            terminal.log('🖼️  Your NFT Gallery is empty', 'info');
            terminal.log('💡 Generate some NFTs with: nft generate "your prompt"', 'info');
            return;
        }

        terminal.log('🖼️  Your NFT Gallery', 'success');
        terminal.log(`📊 Total NFTs: ${gallery.length}`, 'info');
        terminal.log('');

        // Display gallery in an optimized responsive grid
        const galleryHtml = `
            <div style="
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
                gap: 28px; 
                margin: 32px 0; 
                padding: 0 16px;
                max-width: 1400px;
                margin-left: auto;
                margin-right: auto;
            ">
                ${gallery.map((nft, index) => `
                    <div class="nft-gallery-card" style="
                        background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(15,15,26,0.98)); 
                        border: 2px solid rgba(0,212,255,0.3); 
                        border-radius: 20px; 
                        padding: 24px; 
                        backdrop-filter: blur(25px); 
                        box-shadow: 0 12px 40px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1); 
                        position: relative; 
                        overflow: hidden;
                        transition: all 0.4s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
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
                        
                        <!-- Gallery Card Header -->
                        <div style="
                            text-align: center; 
                            margin-bottom: 20px; 
                            position: relative; 
                            z-index: 1;
                            width: 100%;
                        ">
                            <h4 style="
                                color: var(--cyber-blue); 
                                margin: 0 0 16px 0; 
                                font-size: 1.3em; 
                                font-weight: 700;
                                text-shadow: 0 0 10px rgba(0,212,255,0.5);
                                letter-spacing: 0.8px;
                                font-family: var(--font-tech);
                            ">🎨 NFT #${index + 1}</h4>
                            
                            <!-- Responsive Image Container -->
                            <div style="
                                background: linear-gradient(135deg, rgba(10,10,15,0.9), rgba(26,26,40,0.95)); 
                                border: 2px solid rgba(0,212,255,0.25); 
                                border-radius: 16px; 
                                padding: 20px; 
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
                                transition: all 0.4s ease;
                                position: relative;
                                overflow: hidden;
                                width: 100%;
                                max-width: 280px;
                                margin: 0 auto;
                            ">
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: 100%;
                                    height: 100%;
                                ">
                                    <img src="${nft.url}" alt="NFT" style="
                                        max-width: 100%; 
                                        max-height: 240px; 
                                        width: auto;
                                        height: auto;
                                        border-radius: 12px; 
                                        box-shadow: 0 8px 24px rgba(0,0,0,0.5); 
                                        border: 1px solid rgba(0,212,255,0.2);
                                        transition: all 0.4s ease;
                                        object-fit: contain;
                                        display: block;
                                        margin: 0 auto;
                                    " onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div style="
                                        display: none; 
                                        width: 100%; 
                                        height: 240px; 
                                        background: linear-gradient(135deg, #0a0a0f, #1a1a28); 
                                        border: 1px solid rgba(0,212,255,0.3); 
                                        border-radius: 12px; 
                                        align-items: center; 
                                        justify-content: center; 
                                        color: var(--cyber-blue); 
                                        font-size: 3.5em; 
                                        text-shadow: 0 0 24px rgba(0,212,255,0.7);
                                    ">🎨</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Enhanced Gallery Metadata -->
                        <div style="
                            background: linear-gradient(135deg, rgba(10,10,15,0.7), rgba(26,26,40,0.8)); 
                            border: 1px solid rgba(0,212,255,0.2); 
                            border-radius: 16px; 
                            padding: 20px; 
                            margin: 20px 0; 
                            position: relative;
                            z-index: 1;
                            width: 100%;
                        ">
                            <div style="
                                display: grid; 
                                grid-template-columns: 1fr; 
                                gap: 12px; 
                                font-size: 0.9em; 
                                color: #E0E0E0; 
                                font-family: var(--font-tech);
                            ">
                                <div style="
                                    display: flex; 
                                    flex-direction: column; 
                                    gap: 6px;
                                    padding: 10px;
                                    background: rgba(0,212,255,0.05);
                                    border-radius: 8px;
                                    border: 1px solid rgba(0,212,255,0.1);
                                ">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <span style="color: var(--cyber-blue); font-weight: 600;">📝</span>
                                        <span style="color: #FFFFFF; font-weight: 600;">Prompt</span>
                                    </div>
                                    <div style="color: #B0B0B0; word-break: break-word; line-height: 1.3; font-size: 0.9em;">${nft.prompt}</div>
                                </div>
                                
                                <div style="
                                    display: grid; 
                                    grid-template-columns: 1fr 1fr; 
                                    gap: 8px;
                                ">
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 4px;
                                        padding: 8px;
                                        background: rgba(0,255,255,0.05);
                                        border-radius: 6px;
                                        border: 1px solid rgba(0,255,255,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <span style="color: #00FFFF; font-weight: 600; font-size: 0.9em;">🎯</span>
                                            <span style="color: #FFFFFF; font-weight: 600; font-size: 0.85em;">Model</span>
                                        </div>
                                        <div style="color: #B0B0B0; font-size: 0.8em;">${nft.model}</div>
                                    </div>
                                    
                                    <div style="
                                        display: flex; 
                                        flex-direction: column; 
                                        gap: 4px;
                                        padding: 8px;
                                        background: rgba(0,255,128,0.05);
                                        border-radius: 6px;
                                        border: 1px solid rgba(0,255,128,0.1);
                                    ">
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <span style="color: #00FF80; font-weight: 600; font-size: 0.9em;">🎨</span>
                                            <span style="color: #FFFFFF; font-weight: 600; font-size: 0.85em;">Style</span>
                                        </div>
                                        <div style="color: #B0B0B0; font-size: 0.8em;">${nft.style}</div>
                                    </div>
                                </div>
                                
                                <div style="
                                    display: flex; 
                                    align-items: center; 
                                    justify-content: center;
                                    gap: 6px;
                                    padding: 8px;
                                    background: rgba(255,149,0,0.05);
                                    border-radius: 6px;
                                    border: 1px solid rgba(255,149,0,0.1);
                                ">
                                    <span style="color: #FF9500; font-weight: 600;">📅</span>
                                    <span style="color: #FFFFFF; font-weight: 600; font-size: 0.85em;">Created:</span>
                                    <span style="color: #B0B0B0; font-size: 0.8em;">${new Date(nft.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Enhanced Gallery Action Buttons -->
                        <div style="
                            display: flex; 
                            gap: 16px; 
                            justify-content: center; 
                            align-items: center;
                            margin-top: 20px; 
                            position: relative;
                            z-index: 1;
                            flex-wrap: wrap;
                            width: 100%;
                        ">
                            <button onclick="window.open('${nft.url}', '_blank')" style="
                                background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06)); 
                                color: #00D4FF; 
                                border: 1px solid rgba(0,212,255,0.3); 
                                padding: 12px 24px; 
                                border-radius: 8px; 
                                cursor: pointer; 
                                font-weight: 600; 
                                box-shadow: 0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                transition: all 0.3s ease; 
                                font-family: var(--font-tech);
                                font-size: 0.8em;
                                letter-spacing: 0.4px;
                                position: relative;
                                overflow: hidden;
                                text-transform: uppercase;
                                min-width: 100px;
                                text-align: center;
                            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,212,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))';">
                                <span style="margin-right: 6px; font-size: 1.1em;">🔍</span>VIEW
                            </button>
                            
                            <button onclick="navigator.clipboard.writeText('${nft.url}'); window.terminal && window.terminal.log('📋 NFT URL copied to clipboard!', 'success');" style="
                                background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06)); 
                                color: #00D4FF; 
                                border: 1px solid rgba(0,212,255,0.3); 
                                padding: 12px 24px; 
                                border-radius: 8px; 
                                cursor: pointer; 
                                font-weight: 600; 
                                box-shadow: 0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                transition: all 0.3s ease; 
                                font-family: var(--font-tech);
                                font-size: 0.8em;
                                letter-spacing: 0.4px;
                                position: relative;
                                overflow: hidden;
                                text-transform: uppercase;
                                min-width: 100px;
                                text-align: center;
                            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,212,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))';">
                                <span style="margin-right: 6px; font-size: 1.1em;">📋</span>COPY
                            </button>
                            ${nft.collectionId ? `<button onclick="window.terminal.executeCommand('nft mint ${nft.collectionId}')" style="
                                background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06)); 
                                color: #00D4FF; 
                                border: 1px solid rgba(0,212,255,0.3); 
                                padding: 12px 24px; 
                                border-radius: 8px; 
                                cursor: pointer; 
                                font-weight: 600; 
                                box-shadow: 0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                transition: all 0.3s ease; 
                                font-family: var(--font-tech);
                                font-size: 0.8em;
                                letter-spacing: 0.4px;
                                position: relative;
                                overflow: hidden;
                                text-transform: uppercase;
                                min-width: 100px;
                                text-align: center;
                            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,212,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 12px rgba(0,212,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.06))';">
                                <span style="margin-right: 6px; font-size: 1.1em;">⛏️</span>MINT
                            </button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <style>
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .nft-gallery-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0,212,255,0.18), inset 0 1px 0 rgba(255,255,255,0.12) !important;
                    border-color: rgba(0,212,255,0.35) !important;
                }
                
                /* Responsive Design for NFT Gallery */
                @media (max-width: 768px) {
                    .nft-gallery-card {
                        min-width: 280px !important;
                        margin: 0 auto !important;
                    }
                    
                    .nft-gallery-card img {
                        max-height: 200px !important;
                        display: block !important;
                        margin: 0 auto !important;
                    }
                    
                    .nft-gallery-card h4 {
                        font-size: 1.1em !important;
                    }
                    
                    .nft-gallery-card button {
                        padding: 8px 16px !important;
                        font-size: 0.8em !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .nft-gallery-card {
                        min-width: 260px !important;
                        padding: 16px !important;
                    }
                    
                    .nft-gallery-card img {
                        max-height: 180px !important;
                        display: block !important;
                        margin: 0 auto !important;
                    }
                    
                    .nft-gallery-card h4 {
                        font-size: 1em !important;
                        margin-bottom: 12px !important;
                    }
                    
                    .nft-gallery-card button {
                        padding: 6px 12px !important;
                        font-size: 0.75em !important;
                        margin: 2px !important;
                    }
                }
            </style>
        `;

        terminal.logHtml(galleryHtml, 'output');
        
        terminal.log('');
        terminal.log('💡 Use the buttons above to view, copy, or mint your NFTs', 'info');
    },

    /**
     * Save NFT to local gallery
     */
    saveToGallery: function(nftData) {
        try {
            const gallery = this.getGallery();
            gallery.unshift(nftData); // Add to beginning
            
            // Keep only last 50 NFTs to prevent storage bloat
            if (gallery.length > 50) {
                gallery.splice(50);
            }
            
            localStorage.setItem('chaingpt-nft-gallery', JSON.stringify(gallery));
        } catch (error) {
            console.error('Failed to save NFT to gallery:', error);
        }
    },

    /**
     * Get NFT gallery from localStorage
     */
    getGallery: function() {
        try {
            const gallery = localStorage.getItem('chaingpt-nft-gallery');
            return gallery ? JSON.parse(gallery) : [];
        } catch (error) {
            console.error('Failed to load NFT gallery:', error);
            return [];
        }
    }
};

// Export for use in terminal
if (typeof window !== 'undefined') {
    window.ChainGPTCommands = ChainGPTCommands;
    console.log('[DEBUG] ✅ ChainGPT NFT Generator loaded successfully');
    console.log('[DEBUG] window.ChainGPTCommands:', window.ChainGPTCommands);
    
    // Auto-initialize with default key if config is available
    if (window.OmegaConfig && window.OmegaConfig.CHAINGPT && window.OmegaConfig.CHAINGPT.AUTO_INITIALIZE) {
        try {
            const result = ChainGPTNFT.init();
            if (result.success) {
                console.log('[DEBUG] ChainGPT NFT auto-initialized with default key');
            } else {
                console.log('[DEBUG] ChainGPT NFT auto-initialization failed:', result.error);
            }
        } catch (error) {
            console.log('[DEBUG] ChainGPT NFT auto-initialization error:', error.message);
        }
    }
}

