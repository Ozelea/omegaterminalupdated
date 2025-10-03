// Omega Terminal Wallet Management
window.OmegaWallet = {
    // Wallet state
    provider: null,
    signer: null,
    userAddress: null,
    sessionOmegaWallet: null,

    // MetaMask detection and provider forcing
    async isRealMetaMask() {
        if (typeof window.ethereum === 'undefined') {
            return false;
        }

        // Force MetaMask preference immediately
        if (window.ethereum && window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
            const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
            if (metamaskProvider) {
                // Completely replace window.ethereum with MetaMask
                window.ethereum = metamaskProvider;
                console.log('MetaMask provider selected (wallet check)');
                window.ethereum._forceMetaMask = true;
            }
        }

        // Additional check: if we detect Phantom, try to find MetaMask again
        if (window.ethereum && window.ethereum.isPhantom && !window.ethereum._forceMetaMask) {
            console.log('Phantom detected, searching for MetaMask...');
            if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
                const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
                if (metamaskProvider) {
                    window.ethereum = metamaskProvider;
                    window.ethereum._forceMetaMask = true;
                    console.log('MetaMask found and forced after Phantom detection');
                }
            }
        }

        return window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isPhantom;
    },

    // Connect MetaMask wallet
    async connectMetaMask(terminal) {
        try {
            if (!window.ethers) {
                terminal.log('Ethers library not loaded. Please refresh the page.', 'error');
                return false;
            }

            // Smart MetaMask detection and Phantom handling
            let provider;
            let providerName = 'Unknown';
            
            if (window.ethereum) {
                // If we already have MetaMask selected, use it
                if (window.ethereum.isMetaMask) {
                    provider = window.ethereum;
                    providerName = 'MetaMask';
                    terminal.log('✅ Using MetaMask provider', 'success');
                }
                // Check if we have multiple providers and can find MetaMask
                else if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
                    const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
                    if (metamaskProvider) {
                        // Force MetaMask
                        window.ethereum = metamaskProvider;
                        provider = metamaskProvider;
                        providerName = 'MetaMask';
                        terminal.log('✅ MetaMask provider found and forced', 'success');
                    } else if (window.ethereum.isPhantom) {
                        // Only Phantom available - reject
                        terminal.log('❌ Only Phantom EVM detected - blocking connection', 'error');
                        terminal.log('💡 Please install MetaMask for Omega network support', 'info');
                        return false;
                    } else {
                        // Other provider - try to use it but warn
                        provider = window.ethereum;
                        providerName = 'Other';
                        terminal.log('⚠️ Using non-MetaMask provider - may not support Omega network', 'warning');
                    }
                }
                // Single provider case
                else {
                    if (window.ethereum.isPhantom) {
                        terminal.log('❌ Phantom EVM detected - blocking connection', 'error');
                        terminal.log('💡 Please disable Phantom EVM or use MetaMask for Omega network', 'info');
                        return false;
                    } else {
                        provider = window.ethereum;
                        providerName = window.ethereum.isMetaMask ? 'MetaMask' : 'Other';
                        if (!window.ethereum.isMetaMask) {
                            terminal.log('⚠️ Using non-MetaMask provider - may not support Omega network', 'warning');
                        }
                    }
                }
            } else {
                terminal.log('No EVM wallet found. Please install MetaMask.', 'error');
                return false;
            }
            
            terminal.log(`🔗 Connecting to ${providerName}...`, 'info');

            // Request account access
            try {
                await provider.request({ method: 'eth_requestAccounts' });
                terminal.log('✅ Account access granted', 'success');
            } catch (requestError) {
                terminal.log('❌ Connection denied by user', 'error');
                return false;
            }

            this.provider = new window.ethers.providers.Web3Provider(provider);
            this.signer = this.provider.getSigner();

            terminal.log('🔍 Getting wallet address...', 'info');
            const address = await this.signer.getAddress();
            this.userAddress = address;
            
            // CRITICAL: Check if this is actually MetaMask by testing network switching
            try {
                const currentNetwork = await this.provider.getNetwork();
                terminal.log(`🔍 Current network: Chain ID ${currentNetwork.chainId}`, 'info');
                
                // Try to switch to Omega network - this will fail with Phantom EVM
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x4e454228' }], // Omega chain ID
                    });
                    terminal.log('✅ Successfully switched to Omega network - this is MetaMask!', 'success');
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        // Chain not added, try to add it
                        await this.addOmegaNetwork(provider, terminal);
                    } else {
                        terminal.log('❌ Failed to switch to Omega network - this might be Phantom EVM', 'error');
                        terminal.log('💡 Phantom EVM does not support custom networks like Omega', 'info');
                        return false;
                    }
                }
            } catch (networkError) {
                terminal.log('❌ Failed to check network - this might be Phantom EVM', 'error');
                return false;
            }

            // Check if we're using fallback ethers (which would return 0x000... address)
            if (address === '0x0000000000000000000000000000000000000000') {
                terminal.log('⚠️ Using fallback ethers - real transactions not available', 'warning');
                terminal.log('💡 Please check your internet connection and refresh the page', 'info');
                return false;
            }

            terminal.log(`✅ Wallet connected: ${address}`, 'success');
            return true;

        } catch (error) {
            console.error('Connect wallet error:', error);
            terminal.log('❌ Failed to connect wallet: ' + error.message, 'error');
            terminal.log('💡 Make sure MetaMask is unlocked and you approve the connection', 'info');
            return false;
        }
    },

    // Add Omega network to MetaMask
    async addOmegaNetwork(provider, terminal) {
        try {
            const networkConfig = {
                chainId: '0x4e454228',
                chainName: 'Omega Network',
                nativeCurrency: { name: 'OMEGA', symbol: 'OMEGA', decimals: 18 },
                rpcUrls: ['https://0x4e454228.rpc.aurora-cloud.dev'],
                blockExplorerUrls: ['https://0x4e454228.explorer.aurora-cloud.dev/']
            };
            
            terminal.log('🔍 Adding network with config:', 'info');
            terminal.log(`   Chain ID: ${networkConfig.chainId} (${parseInt(networkConfig.chainId, 16)} decimal)`, 'info');
            terminal.log(`   RPC URL: ${networkConfig.rpcUrls[0]}`, 'info');
            terminal.log(`   Explorer: ${networkConfig.blockExplorerUrls[0]}`, 'info');
            
            console.log('[DEBUG] Sending wallet_addEthereumChain request:', {
                method: 'wallet_addEthereumChain',
                params: [networkConfig]
            });
            
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [networkConfig]
            });
            terminal.log('✅ Successfully added Omega network - this is MetaMask!', 'success');
            return true;
        } catch (addError) {
            terminal.log('❌ Failed to add Omega network - this might be Phantom EVM', 'error');
            terminal.log('💡 Phantom EVM does not support custom networks like Omega', 'info');
            return false;
        }
    },

    // Create Omega session wallet
    async createOmegaWallet(terminal) {
        try {
            // Set up a public RPC provider
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            this.provider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            this.sessionOmegaWallet = window.ethers.Wallet.createRandom();
            this.signer = this.sessionOmegaWallet.connect(this.provider);
            this.userAddress = this.sessionOmegaWallet.address;

            terminal.log('DEBUG: Omega wallet created and provider set', 'info');
            terminal.logHtml('<span style="color:#ff3333;font-weight:bold;">This is currently in beta. We recommend you transfer any OMEGA tokens you receive to a MetaMask wallet for safekeeping. Do NOT use this wallet for large amounts or long-term storage.</span>', 'error');
            
            const addr = this.sessionOmegaWallet.address;
            const privKey = this.sessionOmegaWallet.privateKey;
            
            terminal.logHtml(`<span style='color:#33bbff'>Omega Wallet Address:</span> <span style='color:#fff'>${addr}</span> <button onclick=\"navigator.clipboard.writeText('${addr}')\">Copy</button>`, 'info');
            // Add private key reveal below address
            terminal.logHtml(`<span style='color:#ff3333'>Omega Private Key [Never Share]:</span> <span id='privkey-reveal' style='color:#fff'><button onclick=\"this.style.display='none';document.getElementById('privkey-value').style.display='inline'\">Click to Reveal</button><span id='privkey-value' style='display:none;'>${privKey} <button onclick=\"navigator.clipboard.writeText('${privKey}')\">Copy</button></span></span>`, 'error');
            
            return true;
        } catch (error) {
            terminal.log('❌ Failed to create Omega wallet: ' + error.message, 'error');
            return false;
        }
    },

    // Import Omega wallet from private key
    async importOmegaWallet(privateKey, terminal) {
        try {
            // Validate private key format
            if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
                throw new Error('Invalid private key format. Must start with 0x and be 66 characters long.');
            }
            
            // Set up RPC provider
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            this.provider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            
            // Create wallet from private key
            this.sessionOmegaWallet = new window.ethers.Wallet(privateKey, this.provider);
            this.signer = this.sessionOmegaWallet;
            this.userAddress = this.sessionOmegaWallet.address;
            
            terminal.log('DEBUG: Omega wallet imported and provider set', 'info');
            terminal.logHtml('<span style="color:#ff3333;font-weight:bold;">This is currently in beta. We recommend you transfer any OMEGA tokens you receive to a MetaMask wallet for safekeeping. do NOT use this wallet for large amounts or long-term storage.</span>', 'error');
            
            const addr = this.sessionOmegaWallet.address;
            terminal.logHtml(`<span style='color:#33bbff'>Imported Omega Wallet Address:</span> <span style='color:#fff'>${addr}</span> <button onclick=\"navigator.clipboard.writeText('${addr}')\">Copy</button>`, 'info');
            terminal.log('✅ Omega Wallet imported successfully!', 'success');
            
            return true;
        } catch (error) {
            terminal.log('❌ Failed to import wallet: ' + error.message, 'error');
            terminal.log('Please check your private key and try again.', 'warning');
            return false;
        }
    },

    // Disconnect wallet
    async disconnect(terminal) {
        try {
            if (!this.signer) {
                terminal.log('No wallet connected to disconnect.', 'warning');
                return;
            }
            
            // Get the address before disconnecting for the message
            const address = this.userAddress || 'Unknown';
            
            // Clear all wallet-related properties
            this.provider = null;
            this.signer = null;
            this.userAddress = null;
            this.sessionOmegaWallet = null;
            
            terminal.log(`🔌 Wallet disconnected: ${address}`, 'success');
            terminal.log('💡 Use "connect" command to reconnect your wallet', 'info');
            
        } catch (error) {
            console.error('Disconnect wallet error:', error);
            terminal.log('❌ Error disconnecting wallet: ' + error.message, 'error');
        }
    },

    // Get wallet balance
    async getBalance(terminal) {
        if (!this.provider || !this.userAddress) {
            terminal.log('❌ No wallet connected', 'error');
            return null;
        }

        try {
            const balance = await this.provider.getBalance(this.userAddress);
            const balanceEth = window.ethers.utils.formatEther(balance);
            return balanceEth;
        } catch (error) {
            terminal.log('❌ Failed to get balance: ' + error.message, 'error');
            return null;
        }
    },

    // Check if wallet is connected
    isConnected() {
        return this.provider && this.signer && this.userAddress;
    },

    // Get current address
    getCurrentAddress() {
        return this.userAddress;
    },

    // Get signer for transactions
    getSigner() {
        return this.signer;
    },

    // Get provider
    getProvider() {
        return this.provider;
    }
}; 