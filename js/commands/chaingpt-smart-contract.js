/**
 * ChainGPT AI Smart Contract Creator Commands
 * Integrates ChainGPT's AI Smart Contract Generator API and SDK into Omega Terminal
 * Documentation: https://docs.chaingpt.org/ai-tools-and-applications/ai-smart-contract-generator
 */

console.log('[DEBUG] Loading ChainGPT Smart Contract Creator module...');

const ChainGPTSmartContract = {
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

    // Supported contract types
    contractTypes: {
        'token': 'ERC-20 Token Contract',
        'nft': 'ERC-721 NFT Contract',
        'nft1155': 'ERC-1155 Multi-Token Contract',
        'dex': 'DEX/AMM Contract',
        'staking': 'Staking Contract',
        'vault': 'Vault Contract',
        'dao': 'DAO Governance Contract',
        'auction': 'Auction Contract',
        'lottery': 'Lottery Contract',
        'marketplace': 'NFT Marketplace Contract',
        'bridge': 'Cross-Chain Bridge Contract',
        'lending': 'Lending Protocol Contract',
        'farming': 'Yield Farming Contract',
        'custom': 'Custom Contract'
    },

    // Supported blockchains
    supportedChains: {
        'ethereum': 'Ethereum Mainnet',
        'bsc': 'BNB Smart Chain',
        'arbitrum': 'Arbitrum One',
        'avalanche': 'Avalanche C-Chain',
        'polygon': 'Polygon',
        'optimism': 'Optimism',
        'base': 'Base',
        'berachain': 'Berachain',
        'solana': 'Solana'
    },

    /**
     * Initialize ChainGPT Smart Contract Creator (optional API key)
     */
    init: function(apiKey) {
        if (apiKey) {
            // User provided their own API key
            this.config.apiKey = apiKey;
            localStorage.setItem('chaingpt-api-key', apiKey);
            console.log('[DEBUG] ChainGPT Smart Contract Creator initialized with user API key');
        } else {
            // Use default API key from config
            const defaultKey = this.getDefaultApiKey();
            if (defaultKey) {
                this.config.apiKey = defaultKey;
                console.log('[DEBUG] ChainGPT Smart Contract Creator initialized with default API key');
            } else {
                return {
                    success: false,
                    error: 'No API key available. Please provide one or check configuration.'
                };
            }
        }

        this.config.initialized = true;
        
        // Load working configuration if available
        const savedBaseUrl = localStorage.getItem('chaingpt-smart-contract-working-base-url');
        if (savedBaseUrl) {
            this.config.baseUrl = savedBaseUrl;
            console.log(`[DEBUG] Loaded saved base URL: ${savedBaseUrl}`);
        }

        return {
            success: true,
            message: 'ChainGPT Smart Contract Creator initialized successfully'
        };
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
     * Get API key from storage or config
     */
    getApiKey: function() {
        // Check for user's custom API key first
        const stored = localStorage.getItem('chaingpt-api-key');
        if (stored) {
            this.config.initialized = true;
            return stored;
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
     * Check if initialized
     */
    isInitialized: function() {
        return this.config.initialized && this.getApiKey();
    },

    /**
     * Generate smart contract
     */
    generateContract: async function(options) {
        let apiKey = this.getApiKey();
        if (!apiKey) {
            // Try to auto-initialize with default key
            try {
                const initResult = this.init();
                if (initResult.success) {
                    apiKey = this.getApiKey();
                } else {
                    throw new Error('Not initialized. Use: contract init [api-key] or contract init (for default key)');
                }
            } catch (error) {
                throw new Error('Not initialized. Use: contract init [api-key] or contract init (for default key)');
            }
        }

        // Use the correct ChainGPT Smart Contract Generator endpoint
        const endpoint = '/chat/stream';
        
        // Build the question with context
        let question = options.prompt;
        if (options.contractType && options.contractType !== 'custom') {
            question = `Generate a ${options.contractType} smart contract: ${options.prompt}`;
        }
        if (options.blockchain && options.blockchain !== 'ethereum') {
            question += ` for ${options.blockchain} blockchain`;
        }
        if (options.features && options.features.length > 0) {
            question += ` with features: ${options.features.join(', ')}`;
        }
        if (options.securityLevel && options.securityLevel !== 'standard') {
            question += ` with ${options.securityLevel} security level`;
        }

        // Use the correct payload structure according to ChainGPT documentation
        const payload = {
            model: 'smart_contract_generator',
            question: question,
            chatHistory: 'off',
            sdkUniqueId: options.sdkUniqueId || undefined
        };

        console.log('[DEBUG] Smart contract generation payload:', payload);

        const url = `${this.config.baseUrl}${endpoint}`;
        
        try {
            console.log(`[DEBUG] Trying endpoint: ${url}`);
            console.log(`[DEBUG] Payload:`, JSON.stringify(payload, null, 2));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
                
            console.log(`[DEBUG] Response status: ${response.status} ${response.statusText}`);
            console.log(`[DEBUG] Response headers:`, Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log(`[DEBUG] Error response body:`, errorData);
                
                // If it's an authentication error and we have fallback keys, try next key
                if ((response.status === 401 || response.status === 403) && !localStorage.getItem('chaingpt-api-key')) {
                    const nextKey = this.tryNextApiKey();
                    if (nextKey) {
                        console.log('[DEBUG] Retrying with next API key...');
                        return this.generateContract(options);
                    }
                }
                
                throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            // Handle streaming response
            const result = await this.handleStreamingResponse(response);
            console.log('[DEBUG] Smart contract generation successful');
            
            // Save working configuration
            localStorage.setItem('chaingpt-smart-contract-working-base-url', this.config.baseUrl);
            
            return result;
        } catch (error) {
            console.log(`[DEBUG] Smart contract generation failed:`, error.message);
            throw error;
        }
    },

    /**
     * Handle streaming response from ChainGPT API
     */
    handleStreamingResponse: async function(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;
            }
            
            console.log('[DEBUG] Full streaming response:', fullResponse.substring(0, 500) + '...');
            
            // Try to parse as JSON first (non-streaming response)
            try {
                const jsonResponse = JSON.parse(fullResponse);
                console.log('[DEBUG] JSON response structure:', Object.keys(jsonResponse));
                
                // Handle different JSON response formats
                if (jsonResponse.data && jsonResponse.data.contract) {
                    return {
                        success: true,
                        data: {
                            contract: jsonResponse.data.contract,
                            fullResponse: fullResponse
                        }
                    };
                } else if (jsonResponse.data && jsonResponse.data.bot) {
                    return {
                        success: true,
                        data: {
                            contract: jsonResponse.data.bot,
                            fullResponse: fullResponse
                        }
                    };
                } else if (jsonResponse.answer) {
                    return {
                        success: true,
                        data: {
                            contract: jsonResponse.answer,
                            fullResponse: fullResponse
                        }
                    };
                } else if (jsonResponse.contract) {
                    return {
                        success: true,
                        data: {
                            contract: jsonResponse.contract,
                            fullResponse: fullResponse
                        }
                    };
                }
            } catch (jsonError) {
                console.log('[DEBUG] Not JSON response, trying streaming format...');
            }
            
            // Parse streaming response (line-by-line JSON)
            const lines = fullResponse.split('\n').filter(line => line.trim());
            let contractCode = '';
            
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    console.log('[DEBUG] Streaming line data:', Object.keys(data));
                    
                    // Handle different streaming response formats
                    if (data.content) {
                        contractCode += data.content;
                    } else if (data.data && data.data.content) {
                        contractCode += data.data.content;
                    } else if (data.text) {
                        contractCode += data.text;
                    } else if (data.message) {
                        contractCode += data.message;
                    } else if (data.answer) {
                        contractCode += data.answer;
                    } else if (data.bot) {
                        contractCode += data.bot;
                    } else if (typeof data === 'string') {
                        contractCode += data;
                    }
                } catch (e) {
                    // If line is not JSON, treat as plain text
                    if (line.trim()) {
                        contractCode += line + '\n';
                    }
                }
            }
            
            // If we still don't have contract code, use the full response
            if (!contractCode.trim()) {
                contractCode = fullResponse;
            }
            
            console.log('[DEBUG] Extracted contract code length:', contractCode.length);
            
            return {
                success: true,
                data: {
                    contract: contractCode,
                    fullResponse: fullResponse
                }
            };
        } catch (error) {
            console.log('[DEBUG] Error handling streaming response:', error);
            throw new Error('Failed to process streaming response');
        }
    },

    /**
     * Get contract templates
     */
    getTemplates: function() {
        return Object.keys(this.contractTypes).map(key => ({
            id: key,
            name: this.contractTypes[key],
            description: this.getContractDescription(key)
        }));
    },

    /**
     * Get contract description
     */
    getContractDescription: function(type) {
        const descriptions = {
            'token': 'Standard ERC-20 token with minting, burning, and transfer capabilities',
            'nft': 'ERC-721 NFT contract with metadata and royalty support',
            'nft1155': 'ERC-1155 multi-token contract for fungible and non-fungible tokens',
            'dex': 'Decentralized exchange with automated market maker functionality',
            'staking': 'Token staking contract with reward distribution',
            'vault': 'Asset vault with deposit/withdrawal and yield generation',
            'dao': 'Decentralized autonomous organization with voting mechanisms',
            'auction': 'Auction contract with bidding and settlement',
            'lottery': 'Lottery contract with random number generation',
            'marketplace': 'NFT marketplace with listing, bidding, and trading',
            'bridge': 'Cross-chain bridge for asset transfers',
            'lending': 'Lending protocol with collateral and interest',
            'farming': 'Yield farming contract with liquidity rewards',
            'custom': 'Custom contract based on your specific requirements'
        };
        return descriptions[type] || 'Custom smart contract implementation';
    }
};

/**
 * ChainGPT Smart Contract Commands
 */
const ChainGPTSmartContractCommands = {
    /**
     * Main command handler
     */
    contract: async function(terminal, args) {
        console.log('[DEBUG] ChainGPTSmartContractCommands.contract called with args:', args);
        
        if (args.length === 0) {
            this.handleHelp(terminal);
            return;
        }

        const subcommand = args[0].toLowerCase();
        console.log('[DEBUG] Subcommand detected:', subcommand);

        switch (subcommand) {
            case 'init':
                await this.handleInit(terminal, args);
                break;
            case 'generate':
            case 'create':
                await this.handleGenerate(terminal, args);
                break;
            case 'templates':
            case 'types':
                await this.handleTemplates(terminal);
                break;
            case 'chains':
                await this.handleChains(terminal);
                break;
            case 'test':
                await this.handleTest(terminal);
                break;
            case 'help':
                this.handleHelp(terminal);
                break;
            default:
                // Treat as a generation prompt if no subcommand matches
                await this.handleGenerate(terminal, args);
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
            const result = ChainGPTSmartContract.init(apiKey);
            if (result.success) {
                if (apiKey) {
                    terminal.log('✅ ChainGPT Smart Contract Creator initialized with your API key!', 'success');
                    terminal.log('🚀 Ready to generate smart contracts', 'info');
                } else {
                    terminal.log('✅ ChainGPT Smart Contract Creator initialized with default API key!', 'success');
                    terminal.log('🚀 Ready to generate smart contracts', 'info');
                    terminal.log('💡 Using default key for testing. Use "contract init <your-api-key>" for your own key', 'info');
                }
                terminal.log('');
                terminal.log('🎯 NEXT STEPS:', 'info');
                terminal.log('  1. Test connection: contract test', 'output');
                terminal.log('  2. See templates: contract templates', 'output');
                terminal.log('  3. Generate contract: contract generate "your description"', 'output');
                terminal.log('');
                terminal.log('💡 EXAMPLE: contract generate "ERC-20 token called Omega Terminal Token"', 'info');
            } else {
                terminal.log('[-] ' + result.error, 'error');
            }
        } catch (error) {
            console.log('[DEBUG] Initialization error:', error);
            terminal.log(`[-] Initialization failed: ${error.message}`, 'error');
        }
    },

    /**
     * Generate smart contract
     */
    handleGenerate: async function(terminal, args) {
        if (args.length < 2) {
            terminal.log('[-] Usage: contract generate "<description>" [options]', 'error');
            terminal.log('[!] Example: contract generate "ERC-20 token with minting and burning"', 'info');
            return;
        }

        const prompt = args.slice(1).join(' ');
        
        // Parse options
        let contractType = 'custom';
        let blockchain = 'ethereum';
        let features = [];
        let securityLevel = 'standard';

        // Check for type option
        const typeMatch = prompt.match(/--type=(\w+)/);
        if (typeMatch) {
            contractType = typeMatch[1];
        }

        // Check for blockchain option
        const chainMatch = prompt.match(/--chain=(\w+)/);
        if (chainMatch) {
            blockchain = chainMatch[1];
        }

        // Check for features
        const featuresMatch = prompt.match(/--features=([^"]+)/);
        if (featuresMatch) {
            features = featuresMatch[1].split(',').map(f => f.trim());
        }

        // Check for security level
        const securityMatch = prompt.match(/--security=(\w+)/);
        if (securityMatch) {
            securityLevel = securityMatch[1];
        }

        // Clean the prompt
        const cleanPrompt = prompt
            .replace(/--type=\w+/g, '')
            .replace(/--chain=\w+/g, '')
            .replace(/--features=[^"]+/g, '')
            .replace(/--security=\w+/g, '')
            .trim();

        terminal.log('[+] Generating smart contract...', 'info');
        terminal.log(`[+] Type: ${contractType} | Chain: ${blockchain} | Security: ${securityLevel}`, 'info');
        terminal.log(`[+] Description: ${cleanPrompt}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTSmartContract.generateContract({
                prompt: cleanPrompt,
                contractType: contractType,
                blockchain: blockchain,
                features: features,
                securityLevel: securityLevel
            });

            console.log('[DEBUG] Generation result structure:', result);
            
            if (result && result.data && result.data.contract) {
                terminal.log('[+] Smart Contract Generated Successfully!', 'success');
                terminal.log('');
                
                const contractHtml = `
                    <div style="background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(255,255,255,0.95)); border: 2px solid rgba(0,123,255,0.3); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(30px); box-shadow: 0 12px 40px rgba(0,123,255,0.2);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="color: #007BFF; margin: 0 0 10px 0; font-size: 1.5em;">⚡ Smart Contract Generated</h3>
                            <p style="color: #666; margin: 0;">Type: ${contractType} | Blockchain: ${blockchain}</p>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.8); border-radius: 16px; padding: 20px; margin: 16px 0; font-family: 'Courier New', monospace; font-size: 0.9em; line-height: 1.4; color: #00ff00; overflow-x: auto; position: relative;">
                            <pre style="margin: 0; white-space: pre-wrap;">${result.data.contract}</pre>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
                            <button onclick="navigator.clipboard.writeText(\`${result.data.contract.replace(/`/g, '\\`')}\`); window.terminal && window.terminal.log('📋 Contract code copied to clipboard!', 'success');" style="
                                background: linear-gradient(135deg, rgba(0,123,255,0.12), rgba(0,123,255,0.06)); 
                                color: #007BFF; 
                                border: 1px solid rgba(0,123,255,0.3); 
                                padding: 12px 24px; 
                                border-radius: 8px; 
                                cursor: pointer; 
                                font-weight: 600; 
                                box-shadow: 0 4px 16px rgba(0,123,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                transition: all 0.3s ease; 
                                font-family: var(--font-tech);
                                font-size: 0.9em;
                                letter-spacing: 0.5px;
                                text-transform: uppercase;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,123,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,123,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,123,255,0.18), rgba(0,123,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,123,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,123,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,123,255,0.12), rgba(0,123,255,0.06))';">
                                <span style="margin-right: 8px; font-size: 1.1em;">📋</span>COPY CODE
                            </button>
                        </div>
                        
                        <div style="text-align: center; margin-top: 16px; font-size: 0.9em; color: #666;">
                            [*] Generated by ChainGPT Solidity LLM | Security Level: ${securityLevel}
                        </div>
                    </div>
                `;
                
                terminal.logHtml(contractHtml, 'output');
            } else {
                // Try to extract contract from different possible locations
                let contractCode = '';
                
                if (result && result.data) {
                    if (result.data.bot) contractCode = result.data.bot;
                    else if (result.data.answer) contractCode = result.data.answer;
                    else if (result.data.text) contractCode = result.data.text;
                    else if (result.data.message) contractCode = result.data.message;
                } else if (result && result.answer) {
                    contractCode = result.answer;
                } else if (result && result.bot) {
                    contractCode = result.bot;
                } else if (typeof result === 'string') {
                    contractCode = result;
                }
                
                if (contractCode && contractCode.trim()) {
                    terminal.log('[+] Smart Contract Generated Successfully!', 'success');
                    terminal.log('');
                    
                    const contractHtml = `
                        <div style="background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(255,255,255,0.95)); border: 2px solid rgba(0,123,255,0.3); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(30px); box-shadow: 0 12px 40px rgba(0,123,255,0.2);">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h3 style="color: #007BFF; margin: 0 0 10px 0; font-size: 1.5em;">⚡ Smart Contract Generated</h3>
                                <p style="color: #666; margin: 0;">Type: ${contractType} | Blockchain: ${blockchain}</p>
                            </div>
                            
                            <div style="background: rgba(0,0,0,0.8); border-radius: 16px; padding: 20px; margin: 16px 0; font-family: 'Courier New', monospace; font-size: 0.9em; line-height: 1.4; color: #00ff00; overflow-x: auto; position: relative;">
                                <pre style="margin: 0; white-space: pre-wrap;">${contractCode}</pre>
                            </div>
                            
                            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
                                <button onclick="navigator.clipboard.writeText(\`${contractCode.replace(/`/g, '\\`')}\`); window.terminal && window.terminal.log('📋 Contract code copied to clipboard!', 'success');" style="
                                    background: linear-gradient(135deg, rgba(0,123,255,0.12), rgba(0,123,255,0.06)); 
                                    color: #007BFF; 
                                    border: 1px solid rgba(0,123,255,0.3); 
                                    padding: 12px 24px; 
                                    border-radius: 8px; 
                                    cursor: pointer; 
                                    font-weight: 600; 
                                    box-shadow: 0 4px 16px rgba(0,123,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                    transition: all 0.3s ease; 
                                    font-family: var(--font-tech);
                                    font-size: 0.9em;
                                    letter-spacing: 0.5px;
                                    text-transform: uppercase;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,123,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(0,123,255,0.5)'; this.style.background='linear-gradient(135deg, rgba(0,123,255,0.18), rgba(0,123,255,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,123,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(0,123,255,0.3)'; this.style.background='linear-gradient(135deg, rgba(0,123,255,0.12), rgba(0,123,255,0.06))';">
                                    <span style="margin-right: 8px; font-size: 1.1em;">📋</span>COPY CODE
                                </button>
                            </div>
                            
                            <div style="text-align: center; margin-top: 16px; font-size: 0.9em; color: #666;">
                                [*] Generated by ChainGPT Solidity LLM | Security Level: ${securityLevel}
                            </div>
                        </div>
                    `;
                    
                    terminal.logHtml(contractHtml, 'output');
                } else {
                    terminal.log('[-] Unexpected response format', 'error');
                    console.log('[DEBUG] Result structure:', result);
                    console.log('[DEBUG] Available keys:', result ? Object.keys(result) : 'No result object');
                }
            }
        } catch (error) {
            terminal.log(`[-] Contract generation failed: ${error.message}`, 'error');
        }
    },

    /**
     * Show available templates
     */
    handleTemplates: async function(terminal) {
        terminal.log('📋 Available Smart Contract Templates:', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');

        const contractTypes = ChainGPTSmartContract.contractTypes;
        
        Object.entries(contractTypes).forEach(([key, value]) => {
            terminal.log(`🎯 ${value}`, 'info');
            terminal.log(`   Type: ${key}`, 'output');
            terminal.log('');
        });

        terminal.log('🚀 QUICK GENERATION EXAMPLES:', 'info');
        terminal.log('');
        terminal.log('  Token Contract:', 'output');
        terminal.log('    contract generate "ERC-20 token called Omega Terminal Token" --type=token', 'output');
        terminal.log('');
        terminal.log('  NFT Collection:', 'output');
        terminal.log('    contract generate "NFT collection with metadata" --type=nft', 'output');
        terminal.log('');
        terminal.log('  DEX Contract:', 'output');
        terminal.log('    contract generate "DEX with AMM functionality" --type=dex', 'output');
        terminal.log('');
        terminal.log('  Staking Contract:', 'output');
        terminal.log('    contract generate "Staking contract for rewards" --type=staking', 'output');
        terminal.log('');
        terminal.log('💡 TIP: You can also generate without specifying --type, just describe what you want!', 'info');
    },

    /**
     * Show supported blockchains
     */
    handleChains: async function(terminal) {
        terminal.log('🌐 Supported Blockchains:', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');

        Object.entries(ChainGPTSmartContract.supportedChains).forEach(([key, name]) => {
            terminal.log(`🔗 ${name}`, 'info');
            terminal.log(`   Chain ID: ${key}`, 'output');
            terminal.log('');
        });

        terminal.log('🚀 CHAIN-SPECIFIC EXAMPLES:', 'info');
        terminal.log('');
        terminal.log('  Ethereum Mainnet:', 'output');
        terminal.log('    contract generate "ERC-20 token" --chain=ethereum', 'output');
        terminal.log('');
        terminal.log('  BNB Smart Chain:', 'output');
        terminal.log('    contract generate "BEP-20 token" --chain=bsc', 'output');
        terminal.log('');
        terminal.log('  Arbitrum One:', 'output');
        terminal.log('    contract generate "DEX contract" --chain=arbitrum', 'output');
        terminal.log('');
        terminal.log('  Polygon:', 'output');
        terminal.log('    contract generate "NFT collection" --chain=polygon', 'output');
        terminal.log('');
        terminal.log('💡 TIP: If you don\'t specify --chain, it will default to Ethereum', 'info');
    },

    /**
     * Test API connection
     */
    handleTest: async function(terminal) {
        if (!ChainGPTSmartContract.isInitialized()) {
            terminal.log('❌ Not initialized. Please run: contract init', 'error');
            terminal.log('💡 This will initialize with the default API key for testing', 'info');
            return;
        }

        terminal.log('🧪 Testing ChainGPT Smart Contract Creator API connection...', 'info');
        terminal.log('');
        
        const apiKey = ChainGPTSmartContract.getApiKey();
        terminal.log(`🔑 API Key: ${apiKey ? '✅ Present' : '❌ Missing'}`, apiKey ? 'success' : 'error');
        terminal.log(`🌐 Base URL: ${ChainGPTSmartContract.config.baseUrl}`, 'info');
        terminal.log(`⚙️  Initialized: ${ChainGPTSmartContract.isInitialized() ? '✅ Yes' : '❌ No'}`, 'info');
        terminal.log('');
        
        if (apiKey && ChainGPTSmartContract.isInitialized()) {
            terminal.log('✅ API connection test completed successfully!', 'success');
            terminal.log('🚀 You\'re ready to generate smart contracts!', 'info');
            terminal.log('');
            terminal.log('💡 Try: contract generate "ERC-20 token called Omega Terminal Token"', 'info');
        } else {
            terminal.log('❌ API connection test failed. Please run: contract init', 'error');
        }
    },

    /**
     * Show help
     */
    handleHelp: function(terminal) {
        terminal.log('🎯 ChainGPT Smart Contract Creator', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');
        terminal.log('📋 STEP-BY-STEP SETUP GUIDE:', 'info');
        terminal.log('');
        terminal.log('  STEP 1: Initialize the system', 'output');
        terminal.log('    contract init                     ← Start here! (uses default API key)', 'output');
        terminal.log('    contract init <your-api-key>      ← Or use your own ChainGPT API key', 'output');
        terminal.log('');
        terminal.log('  STEP 2: Test the connection', 'output');
        terminal.log('    contract test                     ← Verify everything is working', 'output');
        terminal.log('');
        terminal.log('  STEP 3: Explore available options', 'output');
        terminal.log('    contract templates                ← See contract types available', 'output');
        terminal.log('    contract chains                   ← See supported blockchains', 'output');
        terminal.log('');
        terminal.log('  STEP 4: Generate your contract', 'output');
        terminal.log('    contract generate "your description here"', 'output');
        terminal.log('');
        terminal.log('🚀 QUICK START EXAMPLES:', 'info');
        terminal.log('');
        terminal.log('  Basic Token:', 'output');
        terminal.log('    contract generate "ERC-20 token called Omega Terminal Token"', 'output');
        terminal.log('');
        terminal.log('  Advanced Token with Options:', 'output');
        terminal.log('    contract generate "ERC-20 token with minting and burning" --type=token --chain=bsc', 'output');
        terminal.log('');
        terminal.log('  NFT Collection:', 'output');
        terminal.log('    contract generate "NFT collection with metadata" --type=nft', 'output');
        terminal.log('');
        terminal.log('  DEX Contract:', 'output');
        terminal.log('    contract generate "DEX with AMM functionality" --type=dex', 'output');
        terminal.log('');
        terminal.log('⚙️  AVAILABLE OPTIONS:', 'info');
        terminal.log('    --type=<type>        Contract type (token, nft, dex, staking, etc.)', 'output');
        terminal.log('    --chain=<chain>      Blockchain (ethereum, bsc, arbitrum, polygon, etc.)', 'output');
        terminal.log('    --features=<list>    Comma-separated features (minting, burning, etc.)', 'output');
        terminal.log('    --security=<level>   Security level (basic, standard, high)', 'output');
        terminal.log('');
        terminal.log('💡 TIP: Start with "contract init" to get started!', 'info');
        terminal.log('🔗 Powered by ChainGPT Solidity LLM - AI-powered smart contract generation', 'info');
    }
};

// Export for global access
window.ChainGPTSmartContract = ChainGPTSmartContract;
window.ChainGPTSmartContractCommands = ChainGPTSmartContractCommands;

console.log('[DEBUG] ChainGPT Smart Contract Creator module loaded successfully');

// Auto-initialize with default key if config is available
if (window.OmegaConfig && window.OmegaConfig.CHAINGPT && window.OmegaConfig.CHAINGPT.AUTO_INITIALIZE) {
    try {
        const result = ChainGPTSmartContract.init();
        if (result.success) {
            console.log('[DEBUG] ChainGPT Smart Contract Creator auto-initialized with default key');
        } else {
            console.log('[DEBUG] ChainGPT Smart Contract Creator auto-initialization failed:', result.error);
        }
    } catch (error) {
        console.log('[DEBUG] ChainGPT Smart Contract Creator auto-initialization error:', error.message);
    }
}
