// Wallet Commands Module
// CACHE BUST: v3.0.0 - MULTI-NETWORK SUPPORT - 2025-01-16 - NETWORK SELECTOR ENABLED
window.OmegaCommands = window.OmegaCommands || {};

console.log('🌐 WALLET COMMANDS v3.0.0 - Multi-Network Support Loaded');

window.OmegaCommands.Wallet = {
    // Connect wallet command - Now uses Multi-Network Connector
    connect: async function(terminal) {
        console.log('[DEBUG] Connect command detected - showing network selector');
        
        // Show multi-network selector modal
        if (window.MultiNetworkConnector) {
            MultiNetworkConnector.showNetworkSelector(terminal);
        } else {
            // Fallback to old behavior if multi-network not loaded
            terminal.log('Loading network selector...', 'info');
            setTimeout(() => {
                if (window.MultiNetworkConnector) {
                    MultiNetworkConnector.showNetworkSelector(terminal);
                } else {
                    terminal.log('❌ Network selector not available', 'error');
                    terminal.log('💡 Please refresh the page', 'info');
                }
            }, 1000);
        }
    },

    // Disconnect wallet command
    disconnect: async function(terminal) {
        await OmegaWallet.disconnect(terminal);
        terminal.updateConnectionStatus('DISCONNECTED');
        
        // Clear terminal wallet state
        terminal.provider = null;
        terminal.signer = null;
        terminal.contract = null;
        terminal.userAddress = null;
        terminal.pendingClaimableBalance = 0;
    },

    // Enhanced Multi-Wallet Balance Command
    balance: async function(terminal) {
        terminal.log('💰 Checking all connected wallets...', 'info');
        let hasAnyWallet = false;
        let totalBalances = [];
        
        // 1. Check EVM Wallet (Original Omega Wallet)
        if (OmegaWallet.isConnected()) {
            hasAnyWallet = true;
            try {
                const balance = await OmegaWallet.getBalance(terminal);
                if (balance !== null) {
                    terminal.log(`💰 EVM Wallet Balance: ${OmegaUtils.formatBalance(balance)} OMEGA`, 'success');
                    totalBalances.push({ type: 'EVM', amount: parseFloat(balance), symbol: 'OMEGA' });
                    
                    // Also show mining wallet balance if different
                    if (terminal.sessionOmegaWallet && terminal.userAddress !== terminal.sessionOmegaWallet.address) {
                        const miningBalance = await terminal.getMiningWalletBalance();
                        if (miningBalance !== null) {
                            terminal.log(`⛏️  Mining Wallet: ${OmegaUtils.formatBalance(miningBalance)} OMEGA`, 'info');
                        }
                    }
                    
                    // Show pending rewards if mining contract is connected
                    if (terminal.contract) {
                        try {
                            const minerInfo = await terminal.contract.getMinerInfo(OmegaWallet.getCurrentAddress());
                            const pendingRewards = window.ethers.utils.formatEther(minerInfo._pendingRewards);
                            if (parseFloat(pendingRewards) > 0) {
                                terminal.log(`⚡ Pending Mining Rewards: ${OmegaUtils.formatBalance(pendingRewards)} OMEGA`, 'info');
                            }
                        } catch (err) {
                            // Ignore errors for pending rewards
                        }
                    }
                }
            } catch (error) {
                terminal.log('❌ Error checking EVM wallet balance', 'error');
            }
        }
        
        // 2. Check NEAR Wallet Connection
        try {
            if (window.OmegaCommands && window.OmegaCommands.Near && window.OmegaCommands.Near.nearWallet) {
                const nearWallet = window.OmegaCommands.Near.nearWallet;
                if (nearWallet && nearWallet.isSignedIn && nearWallet.isSignedIn()) {
                    hasAnyWallet = true;
                    const accountId = nearWallet.getAccountId();
                    terminal.log(`🌐 NEAR Wallet Connected: ${accountId}`, 'success');
                    
                    // Try to get NEAR balance
                    try {
                        await window.OmegaCommands.Near.balance(terminal, []);
                    } catch (nearError) {
                        terminal.log('ℹ️  Use "near balance" for detailed NEAR account balance', 'info');
                    }
                }
            }
        } catch (error) {
            // NEAR not available or not connected
        }
        
        // 3. Check for Shade Agents
        try {
            const storedAgents = JSON.parse(localStorage.getItem('shade-agents') || '[]');
            if (storedAgents.length > 0) {
                hasAnyWallet = true;
                terminal.log(`🤖 Shade Agents Found: ${storedAgents.length}`, 'success');
                storedAgents.slice(0, 3).forEach(agent => {
                    terminal.log(`  ➤ ${agent.name} (${agent.chains_deployed} chains)`, 'info');
                });
                if (storedAgents.length > 3) {
                    terminal.log(`  ➤ ...and ${storedAgents.length - 3} more agents`, 'info');
                }
                terminal.log('💡 Use "near agent balance <agent-name>" for detailed portfolio', 'info');
            }
        } catch (error) {
            // Shade agents not available
        }
        
        // 4. Show summary or no wallet message
        if (!hasAnyWallet) {
            terminal.log('❌ No wallets connected.', 'error');
            terminal.log('💡 Available wallet types:', 'info');
            terminal.log('  • EVM Wallet: Use "connect" command', 'info');
            terminal.log('  • NEAR Wallet: Use "shade" when connecting', 'info');
            terminal.log('  • Shade Agents: Use "near agent deploy <name>"', 'info');
        } else {
            terminal.log('✅ Multi-wallet balance check complete!', 'success');
            if (totalBalances.length > 0) {
                const totalValue = totalBalances.reduce((sum, bal) => sum + bal.amount, 0);
                terminal.log(`📊 Total OMEGA: ${OmegaUtils.formatBalance(totalValue.toString())}`, 'success');
            }
        }
    },

    // Send command
    send: async function(terminal, command) {
        const parts = command.split(' ');
        if (parts.length < 3) {
            terminal.log('Usage: send <amount> <address>', 'error');
            terminal.log('Example: send 1.5 0x1234567890123456789012345678901234567890', 'info');
            return;
        }

        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        const amount = parts[1];
        const toAddress = parts[2];

        // Validate amount
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            terminal.log('❌ Invalid amount. Must be a positive number.', 'error');
            return;
        }

        // Validate address
        if (!OmegaUtils.isValidEthereumAddress(toAddress)) {
            terminal.log('❌ Invalid recipient address.', 'error');
            return;
        }

        try {
            terminal.log(`💸 Sending ${amount} OMEGA to ${toAddress}...`, 'info');
            
            const tx = await OmegaWallet.getSigner().sendTransaction({
                to: toAddress,
                value: window.ethers.utils.parseEther(amount)
            });

            terminal.log(`✅ Transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('⏳ Waiting for confirmation...', 'info');

            try {
                const receipt = await tx.wait();
                terminal.log(`✅ Transaction confirmed! Block: ${receipt.blockNumber}`, 'success');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`, 'info');
            } catch (waitError) {
                terminal.log('⚠️ Transaction was submitted but confirmation could not be detected.', 'warning');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">Check status on Explorer</a>`, 'info');
            }

        } catch (error) {
            terminal.log('❌ Failed to send transaction: ' + error.message, 'error');
        }
    },

    // Handle wallet choice (shade/connect/yes/import)
    handleWalletChoice: async function(terminal, choice) {
        if (choice === 'shade') {
            terminal.log('🤖 Initializing Shade Agent [Multi Chain Wallet]...', 'info');
            terminal.log('', 'info');
            terminal.log('🌐 Connecting to NEAR Protocol...', 'info');
            terminal.log('📱 This will create accounts across multiple blockchains:', 'info');
            terminal.log('  • 🟡 Bitcoin', 'info');
            terminal.log('  • 🟣 Ethereum', 'info');
            terminal.log('  • 🟢 Solana', 'info');
            terminal.log('  • 🔵 NEAR Protocol', 'info');
            terminal.log('  • 🔥 And more...', 'info');
            terminal.log('', 'info');
            
            // Initialize NEAR wallet connection
            if (window.OmegaCommands && window.OmegaCommands.Near) {
                try {
                    await OmegaCommands.Near.connect(terminal);
                    
                    // After successful NEAR connection, show multi-chain status
                    setTimeout(() => {
                        terminal.log('', 'info');
                        terminal.log('🎉 Shade Agent wallet initialized successfully!', 'success');
                        terminal.log('💡 Available commands:', 'info');
                        terminal.log('  • near balance - Check NEAR balance', 'info');
                        terminal.log('  • near account - View account details', 'info');
                        terminal.log('  • near agent deploy <name> - Deploy AI agent', 'info');
                        terminal.log('  • help - Show all commands', 'info');
                        terminal.log('', 'info');
                        terminal.log('🚀 Your multi-chain AI wallet is ready!', 'success');
                        
                        // Update terminal connection status
                        terminal.updateConnectionStatus('CONNECTED (Shade Agent)');
                    }, 1000);
                    
                } catch (error) {
                    terminal.log('❌ Failed to initialize Shade Agent wallet', 'error');
                    terminal.log('💡 You can try again with "near connect" or use other options', 'info');
                    terminal.awaitingWalletChoice = true; // Allow retry
                }
            } else {
                terminal.log('❌ NEAR commands not available', 'error');
                terminal.log('💡 Please try other wallet options', 'info');
                terminal.awaitingWalletChoice = true;
            }
            
        } else if (choice === 'connect') {
            terminal.log('🦊 Connecting MetaMask wallet...', 'info');
            await this.connect(terminal);
            
        } else if (choice === 'yes') {
            terminal.log('🆕 Creating new Omega Wallet...', 'info');
            
            const created = await OmegaWallet.createOmegaWallet(terminal);
            if (created) {
                terminal.updateConnectionStatus('CONNECTED (Omega Wallet)');
                
                // Connect mining contract for session wallet
                if (OmegaConfig.CONTRACT_ADDRESS && OmegaConfig.CONTRACT_ABI) {
                    terminal.contract = new window.ethers.Contract(
                        OmegaConfig.CONTRACT_ADDRESS, 
                        OmegaConfig.CONTRACT_ABI, 
                        OmegaWallet.getSigner()
                    );
                    terminal.log('Mining contract connected for Omega Test Wallet.', 'success');
                }
                
                // Sync wallet state to terminal
                terminal.provider = OmegaWallet.getProvider();
                terminal.signer = OmegaWallet.getSigner();
                terminal.userAddress = OmegaWallet.getCurrentAddress();
                terminal.sessionOmegaWallet = OmegaWallet.sessionOmegaWallet;
                
                terminal.log('💰 Requesting funds for your Omega Test Wallet from the relayer...', 'info');
                await this.fundOmegaWallet(OmegaWallet.getCurrentAddress(), terminal);
                terminal.log('💡 If you do not see a funding confirmation above, please check your relayer or network connection.', 'info');
                terminal.log('Type "help" to get started', 'info');
            }
            
        } else if (choice === 'import') {
            terminal.log('🔐 Importing existing Omega Wallet...', 'info');
            terminal.log('Enter your Omega Wallet private key:', 'info');
            terminal.awaitingPrivateKeyImport = true;
            
        } else {
            terminal.log('❌ Invalid option. Please type one of:', 'error');
            terminal.log('• "shade" - Shade Agent [Multi Chain Wallet]', 'info');
            terminal.log('• "connect" - Connect MetaMask wallet', 'info');
            terminal.log('• "yes" - Create new Omega wallet (auto-funded)', 'info');
            terminal.log('• "import" - Import existing wallet with private key', 'info');
            terminal.awaitingWalletChoice = true; // Keep waiting for valid input
        }
    },

    // Handle private key import
    handlePrivateKeyImport: async function(terminal, privateKeyInput) {
        const privateKey = privateKeyInput.trim();
        
        const imported = await OmegaWallet.importOmegaWallet(privateKey, terminal);
        if (imported) {
            terminal.updateConnectionStatus('CONNECTED (Imported Omega Wallet)');
            
            // Connect mining contract for imported wallet
            if (OmegaConfig.CONTRACT_ADDRESS && OmegaConfig.CONTRACT_ABI) {
                terminal.contract = new window.ethers.Contract(
                    OmegaConfig.CONTRACT_ADDRESS, 
                    OmegaConfig.CONTRACT_ABI, 
                    OmegaWallet.getSigner()
                );
                terminal.log('Mining contract connected for imported Omega Wallet.', 'success');
            }
            
            // Sync wallet state to terminal
            terminal.provider = OmegaWallet.getProvider();
            terminal.signer = OmegaWallet.getSigner();
            terminal.userAddress = OmegaWallet.getCurrentAddress();
            terminal.sessionOmegaWallet = OmegaWallet.sessionOmegaWallet;
            
            terminal.log('Type "help" to get started', 'info');
        }
    },

    // Fund omega wallet via relayer
    fundOmegaWallet: async function(address, terminal) {
        try {
            // Try the correct endpoint first
            const response = await fetch(OmegaConfig.RELAYER_URL + '/fund', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: address,
                    amount: '0.1'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                terminal.log(`✅ Your wallet is being funded! Tx: ${result.txHash}`, 'success');
                terminal.log('Please wait a few seconds before using your wallet.', 'info');
                if (result.txHash) {
                    terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${result.txHash}" target="_blank">View transaction</a>`, 'info');
                }
            } else {
                terminal.log('❌ Funding failed: ' + (result.error || 'Unknown error'), 'error');
            }
            
        } catch (error) {
            terminal.log('❌ Funding request failed: ' + error.message, 'error');
            
            // Provide specific help for common issues
            if (error.message.includes('JSON') || error.message.includes('DOCTYPE')) {
                terminal.log('💡 This usually means the relayer is not running or returned an error page', 'warning');
                terminal.log('🔧 Please check that the relayer server is running and accessible', 'info');
            } else if (error.message.includes('fetch')) {
                terminal.log('💡 Check your internet connection and relayer URL configuration', 'warning');
            }
        }
    }
};

// Global function for funding (backward compatibility)
window.fundOmegaWallet = function(address) {
    if (window.terminal) {
        return window.OmegaCommands.Wallet.fundOmegaWallet(address, window.terminal);
    }
}; 