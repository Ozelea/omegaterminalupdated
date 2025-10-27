/**
 * ChainGPT AI Smart Contract Auditor Commands
 * Integrates ChainGPT's AI Smart Contract Auditor API and SDK into Omega Terminal
 * Documentation: https://docs.chaingpt.org/ai-tools-and-applications/ai-smart-contract-auditor
 */

console.log('[DEBUG] Loading ChainGPT Smart Contract Auditor module...');

const ChainGPTSmartContractAuditor = {
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

    // Audit severity levels
    severityLevels: {
        'critical': 'Critical - Immediate action required',
        'high': 'High - Should be fixed before deployment',
        'medium': 'Medium - Should be addressed soon',
        'low': 'Low - Consider fixing in future updates',
        'info': 'Info - Suggestions and best practices'
    },

    // Security categories
    securityCategories: {
        'access_control': 'Access Control & Authorization',
        'reentrancy': 'Reentrancy Vulnerabilities',
        'integer_overflow': 'Integer Overflow/Underflow',
        'unchecked_calls': 'Unchecked External Calls',
        'gas_optimization': 'Gas Optimization',
        'logic_errors': 'Logic Errors',
        'front_running': 'Front-running Vulnerabilities',
        'denial_of_service': 'Denial of Service',
        'upgradeability': 'Upgradeability Issues',
        'randomness': 'Randomness & Oracle Issues'
    },

    /**
     * Initialize ChainGPT Smart Contract Auditor (optional API key)
     */
    init: function(apiKey) {
        if (apiKey) {
            // User provided their own API key
            this.config.apiKey = apiKey;
            localStorage.setItem('chaingpt-api-key', apiKey);
            console.log('[DEBUG] ChainGPT Smart Contract Auditor initialized with user API key');
        } else {
            // Use default API key from config
            const defaultKey = this.getDefaultApiKey();
            if (defaultKey) {
                this.config.apiKey = defaultKey;
                console.log('[DEBUG] ChainGPT Smart Contract Auditor initialized with default API key');
            } else {
                return {
                    success: false,
                    error: 'No API key available. Please provide one or check configuration.'
                };
            }
        }

        this.config.initialized = true;
        
        // Load working configuration if available
        const savedBaseUrl = localStorage.getItem('chaingpt-auditor-working-base-url');
        if (savedBaseUrl) {
            this.config.baseUrl = savedBaseUrl;
            console.log(`[DEBUG] Loaded saved base URL: ${savedBaseUrl}`);
        }

        return {
            success: true,
            message: 'ChainGPT Smart Contract Auditor initialized successfully'
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
     * Audit smart contract
     */
    auditContract: async function(options) {
        let apiKey = this.getApiKey();
        if (!apiKey) {
            // Try to auto-initialize with default key
            try {
                const initResult = this.init();
                if (initResult.success) {
                    apiKey = this.getApiKey();
                } else {
                    throw new Error('Not initialized. Use: auditor init [api-key] or auditor init (for default key)');
                }
            } catch (error) {
                throw new Error('Not initialized. Use: auditor init [api-key] or auditor init (for default key)');
            }
        }

        // Use the correct ChainGPT Smart Contract Auditor endpoint (likely same as generator)
        const endpoint = '/chat/stream';
        
        // Build the question with context for auditing
        let question = `Please audit this smart contract for security vulnerabilities and best practices:\n\n${options.contractCode}`;
        
        if (options.contractType && options.contractType !== 'custom') {
            question = `Please audit this ${options.contractType} smart contract for security vulnerabilities and best practices:\n\n${options.contractCode}`;
        }
        if (options.blockchain && options.blockchain !== 'ethereum') {
            question += `\n\nThis contract is for ${options.blockchain} blockchain.`;
        }
        if (options.auditLevel && options.auditLevel !== 'comprehensive') {
            question += `\n\nPlease perform a ${options.auditLevel} audit.`;
        }
        if (options.focusAreas && options.focusAreas.length > 0) {
            question += `\n\nFocus on these areas: ${options.focusAreas.join(', ')}.`;
        }
        if (options.includeGasAnalysis === false) {
            question += `\n\nSkip gas analysis.`;
        }

        // Use the correct payload structure according to ChainGPT documentation
        const payload = {
            model: 'smart_contract_auditor', // Assuming this is the model name for auditor
            question: question,
            chatHistory: 'off',
            sdkUniqueId: options.sdkUniqueId || undefined
        };

        console.log('[DEBUG] Smart contract audit payload:', payload);

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

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log(`[DEBUG] Error response body:`, errorData);
                
                // If it's an authentication error and we have fallback keys, try next key
                if ((response.status === 401 || response.status === 403) && !localStorage.getItem('chaingpt-api-key')) {
                    const nextKey = this.tryNextApiKey();
                    if (nextKey) {
                        console.log('[DEBUG] Retrying with next API key...');
                        return this.auditContract(options);
                    }
                }
                
                throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            // Handle streaming response
            const result = await this.handleStreamingResponse(response);
            console.log('[DEBUG] Smart contract audit successful');
            
            // Save working configuration
            localStorage.setItem('chaingpt-auditor-working-base-url', this.config.baseUrl);
            
            return result;
        } catch (error) {
            console.log(`[DEBUG] Smart contract audit failed:`, error.message);
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
            
            // Parse the complete response
            const lines = fullResponse.split('\n').filter(line => line.trim());
            let auditReport = '';
            
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.content) {
                        auditReport += data.content;
                    }
                } catch (e) {
                    // Skip invalid JSON lines
                    continue;
                }
            }
            
            return {
                success: true,
                data: {
                    audit: auditReport,
                    fullResponse: fullResponse
                }
            };
        } catch (error) {
            console.log('[DEBUG] Error handling streaming response:', error);
            throw new Error('Failed to process streaming response');
        }
    },

    /**
     * Format audit results
     */
    formatAuditResults: function(results) {
        if (!results || !results.issues) {
            return 'No audit results available';
        }

        let formatted = '';
        const issues = results.issues;
        
        // Group issues by severity
        const groupedIssues = {};
        Object.keys(this.severityLevels).forEach(severity => {
            groupedIssues[severity] = issues.filter(issue => issue.severity === severity);
        });

        // Display issues by severity
        Object.entries(groupedIssues).forEach(([severity, severityIssues]) => {
            if (severityIssues.length > 0) {
                const severityColor = this.getSeverityColor(severity);
                formatted += `\n[${severity.toUpperCase()}] ${severityIssues.length} Issues Found:\n`;
                
                severityIssues.forEach((issue, index) => {
                    formatted += `\n${index + 1}. ${issue.title}\n`;
                    formatted += `   Location: ${issue.location || 'N/A'}\n`;
                    formatted += `   Description: ${issue.description}\n`;
                    if (issue.recommendation) {
                        formatted += `   Recommendation: ${issue.recommendation}\n`;
                    }
                    if (issue.codeSnippet) {
                        formatted += `   Code: ${issue.codeSnippet}\n`;
                    }
                });
            }
        });

        // Add summary
        if (results.summary) {
            formatted += `\n\nAUDIT SUMMARY:\n`;
            formatted += `Overall Risk Level: ${results.summary.riskLevel || 'Unknown'}\n`;
            formatted += `Total Issues: ${results.summary.totalIssues || 0}\n`;
            formatted += `Critical: ${results.summary.critical || 0}\n`;
            formatted += `High: ${results.summary.high || 0}\n`;
            formatted += `Medium: ${results.summary.medium || 0}\n`;
            formatted += `Low: ${results.summary.low || 0}\n`;
        }

        return formatted;
    },

    /**
     * Get severity color
     */
    getSeverityColor: function(severity) {
        const colors = {
            'critical': '#ff0000',
            'high': '#ff6600',
            'medium': '#ffaa00',
            'low': '#00aa00',
            'info': '#0066ff'
        };
        return colors[severity] || '#666666';
    }
};

/**
 * ChainGPT Smart Contract Auditor Commands
 */
const ChainGPTSmartContractAuditorCommands = {
    /**
     * Main command handler
     */
    auditor: async function(terminal, args) {
        console.log('[DEBUG] ChainGPTSmartContractAuditorCommands.auditor called with args:', args);
        
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
            case 'audit':
            case 'check':
                await this.handleAudit(terminal, args);
                break;
            case 'severity':
            case 'levels':
                await this.handleSeverity(terminal);
                break;
            case 'categories':
                await this.handleCategories(terminal);
                break;
            case 'test':
                await this.handleTest(terminal);
                break;
            case 'help':
                this.handleHelp(terminal);
                break;
            default:
                // Treat as an audit request if no subcommand matches
                await this.handleAudit(terminal, args);
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
            const result = ChainGPTSmartContractAuditor.init(apiKey);
            if (result.success) {
                if (apiKey) {
                    terminal.log('✅ ChainGPT Smart Contract Auditor initialized with your API key!', 'success');
                    terminal.log('🚀 Ready to audit smart contracts', 'info');
                } else {
                    terminal.log('✅ ChainGPT Smart Contract Auditor initialized with default API key!', 'success');
                    terminal.log('🚀 Ready to audit smart contracts', 'info');
                    terminal.log('💡 Using default key for testing. Use "auditor init <your-api-key>" for your own key', 'info');
                }
                terminal.log('');
                terminal.log('🎯 NEXT STEPS:', 'info');
                terminal.log('  1. Test connection: auditor test', 'output');
                terminal.log('  2. See severity levels: auditor severity', 'output');
                terminal.log('  3. Audit contract: auditor audit "your contract code"', 'output');
                terminal.log('');
                terminal.log('💡 EXAMPLE: auditor audit "contract MyToken { ... }"', 'info');
            } else {
                terminal.log('[-] ' + result.error, 'error');
            }
        } catch (error) {
            console.log('[DEBUG] Initialization error:', error);
            terminal.log(`[-] Initialization failed: ${error.message}`, 'error');
        }
    },

    /**
     * Audit smart contract
     */
    handleAudit: async function(terminal, args) {
        if (args.length < 2) {
            terminal.log('[-] Usage: auditor audit "<contract code>" [options]', 'error');
            terminal.log('[!] Example: auditor audit "contract MyToken { ... }"', 'info');
            return;
        }

        const contractCode = args.slice(1).join(' ');
        
        // Parse options
        let contractType = 'custom';
        let blockchain = 'ethereum';
        let auditLevel = 'comprehensive';
        let focusAreas = [];
        let includeGasAnalysis = true;

        // Check for type option
        const typeMatch = contractCode.match(/--type=(\w+)/);
        if (typeMatch) {
            contractType = typeMatch[1];
        }

        // Check for blockchain option
        const chainMatch = contractCode.match(/--chain=(\w+)/);
        if (chainMatch) {
            blockchain = chainMatch[1];
        }

        // Check for audit level
        const levelMatch = contractCode.match(/--level=(\w+)/);
        if (levelMatch) {
            auditLevel = levelMatch[1];
        }

        // Check for focus areas
        const focusMatch = contractCode.match(/--focus=([^"]+)/);
        if (focusMatch) {
            focusAreas = focusMatch[1].split(',').map(f => f.trim());
        }

        // Check for gas analysis
        const gasMatch = contractCode.match(/--no-gas/);
        if (gasMatch) {
            includeGasAnalysis = false;
        }

        // Clean the contract code
        const cleanCode = contractCode
            .replace(/--type=\w+/g, '')
            .replace(/--chain=\w+/g, '')
            .replace(/--level=\w+/g, '')
            .replace(/--focus=[^"]+/g, '')
            .replace(/--no-gas/g, '')
            .trim();

        terminal.log('[+] Auditing smart contract...', 'info');
        terminal.log(`[+] Type: ${contractType} | Chain: ${blockchain} | Level: ${auditLevel}`, 'info');
        terminal.log(`[+] Gas Analysis: ${includeGasAnalysis ? 'Enabled' : 'Disabled'}`, 'info');
        terminal.log('');

        try {
            const result = await ChainGPTSmartContractAuditor.auditContract({
                contractCode: cleanCode,
                contractType: contractType,
                blockchain: blockchain,
                auditLevel: auditLevel,
                focusAreas: focusAreas,
                includeGasAnalysis: includeGasAnalysis
            });

            if (result && result.data && result.data.audit) {
                terminal.log('[+] Smart Contract Audit Completed!', 'success');
                terminal.log('');
                
                const auditHtml = `
                    <div style="background: linear-gradient(135deg, rgba(220,53,69,0.1), rgba(255,255,255,0.95)); border: 2px solid rgba(220,53,69,0.3); border-radius: 20px; padding: 20px; margin: 20px 0; backdrop-filter: blur(30px); box-shadow: 0 12px 40px rgba(220,53,69,0.2);">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="color: #DC3545; margin: 0 0 10px 0; font-size: 1.5em;">🔍 Security Audit Report</h3>
                            <p style="color: #666; margin: 0;">Type: ${contractType} | Chain: ${blockchain} | Level: ${auditLevel}</p>
                        </div>
                        
                        <div style="background: rgba(0,0,0,0.8); border-radius: 16px; padding: 20px; margin: 16px 0; font-family: 'Courier New', monospace; font-size: 0.9em; line-height: 1.4; color: #ffffff; overflow-x: auto; max-height: 500px; overflow-y: auto;">
                            <pre style="margin: 0; white-space: pre-wrap;">${result.data.audit}</pre>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
                            <button onclick="navigator.clipboard.writeText(\`${result.data.audit.replace(/`/g, '\\`')}\`); window.terminal && window.terminal.log('📋 Audit report copied to clipboard!', 'success');" style="
                                background: linear-gradient(135deg, rgba(220,53,69,0.12), rgba(220,53,69,0.06)); 
                                color: #DC3545; 
                                border: 1px solid rgba(220,53,69,0.3); 
                                padding: 12px 24px; 
                                border-radius: 8px; 
                                cursor: pointer; 
                                font-weight: 600; 
                                box-shadow: 0 4px 16px rgba(220,53,69,0.2), inset 0 1px 0 rgba(255,255,255,0.1); 
                                transition: all 0.3s ease; 
                                font-family: var(--font-tech);
                                font-size: 0.9em;
                                letter-spacing: 0.5px;
                                text-transform: uppercase;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220,53,69,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; this.style.borderColor='rgba(220,53,69,0.5)'; this.style.background='linear-gradient(135deg, rgba(220,53,69,0.18), rgba(220,53,69,0.1))';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(220,53,69,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.borderColor='rgba(220,53,69,0.3)'; this.style.background='linear-gradient(135deg, rgba(220,53,69,0.12), rgba(220,53,69,0.06))';">
                                <span style="margin-right: 8px; font-size: 1.1em;">📋</span>COPY REPORT
                            </button>
                        </div>
                        
                        <div style="text-align: center; margin-top: 16px; font-size: 0.9em; color: #666;">
                            [*] Audited by ChainGPT AI | Security Analysis Complete
                        </div>
                    </div>
                `;
                
                terminal.logHtml(auditHtml, 'output');
            } else {
                terminal.log('[-] Unexpected response format', 'error');
                console.log('[DEBUG] Result structure:', result);
            }
        } catch (error) {
            terminal.log(`[-] Contract audit failed: ${error.message}`, 'error');
        }
    },

    /**
     * Show severity levels
     */
    handleSeverity: async function(terminal) {
        terminal.log('[+] Audit Severity Levels:', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');

        Object.entries(ChainGPTSmartContractAuditor.severityLevels).forEach(([level, description]) => {
            const color = ChainGPTSmartContractAuditor.getSeverityColor(level);
            terminal.log(`[+] ${level.toUpperCase()}`, 'info');
            terminal.log(`    ${description}`, 'output');
            terminal.log('');
        });

        terminal.log('[!] Usage Examples:', 'info');
        terminal.log('  auditor audit "contract code" --level=comprehensive', 'output');
        terminal.log('  auditor audit "contract code" --level=quick', 'output');
    },

    /**
     * Show security categories
     */
    handleCategories: async function(terminal) {
        terminal.log('[+] Security Audit Categories:', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');

        Object.entries(ChainGPTSmartContractAuditor.securityCategories).forEach(([key, name]) => {
            terminal.log(`[+] ${name}`, 'info');
            terminal.log(`    ID: ${key}`, 'output');
            terminal.log('');
        });

        terminal.log('[!] Usage Examples:', 'info');
        terminal.log('  auditor audit "contract code" --focus=access_control,reentrancy', 'output');
        terminal.log('  auditor audit "contract code" --focus=gas_optimization', 'output');
    },

    /**
     * Test API connection
     */
    handleTest: async function(terminal) {
        if (!ChainGPTSmartContractAuditor.isInitialized()) {
            terminal.log('❌ Not initialized. Please run: auditor init', 'error');
            terminal.log('💡 This will initialize with the default API key for testing', 'info');
            return;
        }

        terminal.log('🧪 Testing ChainGPT Smart Contract Auditor API connection...', 'info');
        terminal.log('');
        
        const apiKey = ChainGPTSmartContractAuditor.getApiKey();
        terminal.log(`🔑 API Key: ${apiKey ? '✅ Present' : '❌ Missing'}`, apiKey ? 'success' : 'error');
        terminal.log(`🌐 Base URL: ${ChainGPTSmartContractAuditor.config.baseUrl}`, 'info');
        terminal.log(`⚙️  Initialized: ${ChainGPTSmartContractAuditor.isInitialized() ? '✅ Yes' : '❌ No'}`, 'info');
        terminal.log('');
        
        if (apiKey && ChainGPTSmartContractAuditor.isInitialized()) {
            terminal.log('✅ API connection test completed successfully!', 'success');
            terminal.log('🚀 You\'re ready to audit smart contracts!', 'info');
            terminal.log('');
            terminal.log('💡 Try: auditor audit "contract MyToken { ... }"', 'info');
        } else {
            terminal.log('❌ API connection test failed. Please run: auditor init', 'error');
        }
    },

    /**
     * Show help
     */
    handleHelp: function(terminal) {
        terminal.log('🔍 ChainGPT Smart Contract Auditor', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');
        terminal.log('📋 STEP-BY-STEP SETUP GUIDE:', 'info');
        terminal.log('');
        terminal.log('  STEP 1: Initialize the system', 'output');
        terminal.log('    auditor init                       ← Start here! (uses default API key)', 'output');
        terminal.log('    auditor init <your-api-key>        ← Or use your own ChainGPT API key', 'output');
        terminal.log('');
        terminal.log('  STEP 2: Test the connection', 'output');
        terminal.log('    auditor test                       ← Verify everything is working', 'output');
        terminal.log('');
        terminal.log('  STEP 3: Explore audit options', 'output');
        terminal.log('    auditor severity                   ← See severity levels', 'output');
        terminal.log('    auditor categories                 ← See security categories', 'output');
        terminal.log('');
        terminal.log('  STEP 4: Audit your contract', 'output');
        terminal.log('    auditor audit "your contract code here"', 'output');
        terminal.log('');
        terminal.log('🚀 QUICK AUDIT EXAMPLES:', 'info');
        terminal.log('');
        terminal.log('  Basic Audit:', 'output');
        terminal.log('    auditor audit "contract MyToken { ... }"', 'output');
        terminal.log('');
        terminal.log('  Comprehensive Audit:', 'output');
        terminal.log('    auditor audit "contract code" --level=comprehensive', 'output');
        terminal.log('');
        terminal.log('  Focused Security Check:', 'output');
        terminal.log('    auditor audit "contract code" --focus=reentrancy,access_control', 'output');
        terminal.log('');
        terminal.log('  Token-Specific Audit:', 'output');
        terminal.log('    auditor audit "contract code" --type=token --chain=ethereum', 'output');
        terminal.log('');
        terminal.log('⚙️  AVAILABLE OPTIONS:', 'info');
        terminal.log('    --type=<type>        Contract type (token, nft, dex, staking, etc.)', 'output');
        terminal.log('    --chain=<chain>      Blockchain (ethereum, bsc, arbitrum, polygon, etc.)', 'output');
        terminal.log('    --level=<level>      Audit level (quick, standard, comprehensive)', 'output');
        terminal.log('    --focus=<areas>      Focus areas (access_control, reentrancy, etc.)', 'output');
        terminal.log('    --no-gas             Disable gas analysis', 'output');
        terminal.log('');
        terminal.log('💡 TIP: Start with "auditor init" to get started!', 'info');
        terminal.log('🔗 Powered by ChainGPT Security LLM - AI-powered smart contract auditing', 'info');
    }
};

// Export for global access
window.ChainGPTSmartContractAuditor = ChainGPTSmartContractAuditor;
window.ChainGPTSmartContractAuditorCommands = ChainGPTSmartContractAuditorCommands;

console.log('[DEBUG] ChainGPT Smart Contract Auditor module loaded successfully');

// Auto-initialize with default key if config is available
if (window.OmegaConfig && window.OmegaConfig.CHAINGPT && window.OmegaConfig.CHAINGPT.AUTO_INITIALIZE) {
    try {
        const result = ChainGPTSmartContractAuditor.init();
        if (result.success) {
            console.log('[DEBUG] ChainGPT Smart Contract Auditor auto-initialized with default key');
        } else {
            console.log('[DEBUG] ChainGPT Smart Contract Auditor auto-initialization failed:', result.error);
        }
    } catch (error) {
        console.log('[DEBUG] ChainGPT Smart Contract Auditor auto-initialization error:', error.message);
    }
}
