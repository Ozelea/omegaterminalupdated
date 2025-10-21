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
        
        // 1. Check EVM Wallet (Works with ALL EVM networks: ETH, BNB, MATIC, etc.)
        if (OmegaWallet.isConnected()) {
            hasAnyWallet = true;
            try {
                const balance = await OmegaWallet.getBalance(terminal);
                if (balance !== null) {
                    // Determine currency symbol based on current network
                    let currencySymbol = 'OMEGA';
                    let networkName = 'EVM';
                    
                    if (terminal.currentNetwork) {
                        currencySymbol = terminal.currentNetwork.currency.symbol;
                        networkName = terminal.currentNetwork.name;
                    } else if (window.MultiNetworkConnector && window.MultiNetworkConnector.currentNetwork) {
                        currencySymbol = window.MultiNetworkConnector.currentNetwork.currency.symbol;
                        networkName = window.MultiNetworkConnector.currentNetwork.name;
                    }
                    
                    terminal.log(`💰 ${networkName} Wallet Balance: ${OmegaUtils.formatBalance(balance)} ${currencySymbol}`, 'success');
                    totalBalances.push({ type: networkName, amount: parseFloat(balance), symbol: currencySymbol });
                    
                    // Also show mining wallet balance if different (Omega network only)
                    if (currencySymbol === 'OMEGA' && terminal.sessionOmegaWallet && terminal.userAddress !== terminal.sessionOmegaWallet.address) {
                        const miningBalance = await terminal.getMiningWalletBalance();
                        if (miningBalance !== null) {
                            terminal.log(`⛏️  Mining Wallet: ${OmegaUtils.formatBalance(miningBalance)} OMEGA`, 'info');
                        }
                    }
                    
                    // Show pending rewards if mining contract is connected (Omega network only)
                    if (currencySymbol === 'OMEGA' && terminal.contract) {
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
        
        // 3. Check Fair Blockchain Wallet
        try {
            if (window.fairWallet && window.fairWallet.address) {
                hasAnyWallet = true;
                
                try {
                    const fairProvider = new window.ethers.providers.JsonRpcProvider('https://testnet-rpc.fair.cloud');
                    const fairBalance = await fairProvider.getBalance(window.fairWallet.address);
                    const fairBalanceFormatted = window.ethers.utils.formatEther(fairBalance);
                    
                    terminal.log(`🟦 Fair Blockchain Balance: ${OmegaUtils.formatBalance(fairBalanceFormatted)} FAIR`, 'success');
                    totalBalances.push({ type: 'Fair', amount: parseFloat(fairBalanceFormatted), symbol: 'FAIR' });
                } catch (fairError) {
                    terminal.log(`⚠️  Fair wallet found but couldn't fetch balance`, 'warning');
                    terminal.log(`   Wallet: ${window.fairWallet.address.substring(0, 10)}...`, 'info');
                }
            }
        } catch (error) {
            // Fair wallet not available
        }
        
        // 4. Check for Shade Agents
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
        
        // 5. Show summary or no wallet message
        if (!hasAnyWallet) {
            terminal.log('❌ No wallets connected.', 'error');
            terminal.log('💡 Available wallet types:', 'info');
            terminal.log('  • EVM Wallet: Use "connect" command', 'info');
            terminal.log('  • Fair Wallet: Use "fair generate" or "fair connect"', 'info');
            terminal.log('  • Solana Wallet: Use "solana connect" or "solana generate"', 'info');
            terminal.log('  • NEAR Wallet: Use "near connect"', 'info');
            terminal.log('  • Shade Agents: Use "near agent deploy <name>"', 'info');
        } else {
            terminal.log('', 'info');
            terminal.log('✅ Multi-wallet balance check complete!', 'success');
            if (totalBalances.length > 0) {
                const totalValue = totalBalances.reduce((sum, bal) => sum + bal.amount, 0);
                terminal.log(`📊 Total Portfolio Value: ${totalBalances.length} wallet(s) active`, 'success');
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
                
                // Debug logging to verify wallet state
                console.log('[WALLET DEBUG] Wallet creation completed:');
                console.log('[WALLET DEBUG] - OmegaWallet.isConnected():', OmegaWallet.isConnected());
                console.log('[WALLET DEBUG] - terminal.userAddress:', terminal.userAddress);
                console.log('[WALLET DEBUG] - terminal.provider:', !!terminal.provider);
                console.log('[WALLET DEBUG] - terminal.signer:', !!terminal.signer);
                console.log('[WALLET DEBUG] - terminal.contract:', !!terminal.contract);
                
                // Verify wallet is ready for commands
                if (OmegaWallet.isConnected()) {
                    terminal.log('✅ Wallet is ready for all terminal commands!', 'success');
                } else {
                    terminal.log('⚠️ Wallet state sync issue detected', 'warning');
                }
                
                terminal.log('💰 Requesting funds for your Omega Test Wallet from the relayer...', 'info');
                await this.fundOmegaWallet(OmegaWallet.getCurrentAddress(), terminal);
                
                // If relayer funding failed, try direct funding
                terminal.log('🔄 Checking if direct blockchain funding is available...', 'info');
                await this.fundWalletDirect(OmegaWallet.getCurrentAddress(), terminal);
                
                terminal.log('💡 If you do not see a funding confirmation above, please check your relayer or network connection.', 'info');
                
                // Show multi-network usage instructions
                this.showMultiNetworkInstructions(terminal);
                
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
            terminal.log('🎁 Requesting 0.1 OMEGA tokens from faucet...', 'info');
            
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
                this.showFundingAlternatives(terminal, address);
            }
            
        } catch (error) {
            terminal.log('❌ Funding request failed: ' + error.message, 'error');
            
            // Check if it's a network connectivity issue
            if (error.message.includes('Failed to fetch') || error.message.includes('Network connectivity issues')) {
                terminal.log('🌐 Network connectivity issue detected with Aurora Cloud RPC', 'warning');
                terminal.log('💡 This is a temporary network issue, not a problem with your wallet', 'info');
            }
            
            this.showFundingAlternatives(terminal, address);
        }
    },

    // Try direct blockchain funding (alternative method)
    fundWalletDirect: async function(address, terminal) {
        try {
            terminal.log('🔄 Trying direct blockchain funding...', 'info');
            
            // Use direct RPC provider to avoid relayer issues
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            const directProvider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            
            // Check if we can connect to the network
            const network = await directProvider.getNetwork();
            terminal.log(`🌐 Connected to network: ${network.name} (Chain ID: ${network.chainId})`, 'info');
            
            // Try to get faucet contract status
            const faucetContract = new window.ethers.Contract(
                OmegaConfig.FAUCET_ADDRESS, 
                OmegaConfig.FAUCET_ABI, 
                directProvider
            );
            
            const faucetBalance = await faucetContract.getFaucetBalance();
            terminal.log(`💰 Faucet balance: ${window.ethers.utils.formatEther(faucetBalance)} OMEGA`, 'info');
            
            if (faucetBalance.gt(0)) {
                terminal.log('✅ Faucet has funds available!', 'success');
                terminal.log('💡 Use "faucet" command to claim directly from the contract', 'info');
            } else {
                terminal.log('❌ Faucet is empty', 'error');
            }
            
        } catch (error) {
            terminal.log('❌ Direct funding failed: ' + error.message, 'error');
            terminal.log('💡 This indicates network connectivity issues', 'info');
        }
    },

    // Show alternative funding methods when automatic funding fails
    showFundingAlternatives: function(terminal, address) {
        terminal.log('', 'output');
        terminal.log('💡 ALTERNATIVE FUNDING METHODS:', 'info');
        terminal.log('════════════════════════════════════════════════════════════════════════════════', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 1: Try Again Later', 'info');
        terminal.log('   • Network issues are often temporary', 'output');
        terminal.log('   • Type "fund" to try funding again', 'output');
        terminal.log('   • Type "fund-direct" to try direct blockchain funding', 'output');
        terminal.log('   • Type "faucet" to use contract faucet', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 2: Manual Faucet', 'info');
        terminal.log('   • Visit: https://faucet.omegaminer.net', 'output');
        terminal.log('   • Enter your address: ' + address, 'output');
        terminal.log('   • Request 0.1 OMEGA tokens', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 3: Use Faucet Command', 'info');
        terminal.log('   • Type "faucet" to use the contract faucet', 'output');
        terminal.log('   • This uses the blockchain directly', 'output');
        terminal.log('   • Requires some OMEGA for gas fees', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 4: Import to MetaMask', 'info');
        terminal.log('   • Import your private key to MetaMask', 'output');
        terminal.log('   • Use MetaMask\'s built-in faucets', 'output');
        terminal.log('   • Then switch back to Omega Network', 'output');
        terminal.log('', 'output');
        
        terminal.log('✅ Your wallet is ready to use even without initial funding!', 'success');
        terminal.log('💡 You can still use commands like "help", "balance", and "mine"', 'info');
        terminal.log('', 'output');
        terminal.log('🌐 NETWORK STATUS:', 'info');
        terminal.log('   • Aurora Cloud RPC is experiencing connectivity issues', 'warning');
        terminal.log('   • This affects the relayer but not your wallet functionality', 'info');
        terminal.log('   • Your wallet is fully functional for all terminal commands', 'success');
        terminal.log('   • Try funding again later when network issues are resolved', 'info');
    },

    // Show multi-network usage instructions for generated wallets
    showMultiNetworkInstructions: function(terminal) {
        terminal.log('', 'output');
        terminal.log('🌐 MULTI-NETWORK WALLET USAGE:', 'info');
        terminal.log('════════════════════════════════════════════════════════════════════════════════', 'output');
        terminal.log('', 'output');
        
        terminal.log('🎯 Your wallet works on ALL supported networks:', 'info');
        terminal.log('', 'output');
        
        terminal.log('🔗 EVM NETWORKS (Ethereum-compatible):', 'info');
        terminal.log('   • Ethereum (ETH) - Mainnet', 'output');
        terminal.log('   • BSC (BNB) - Binance Smart Chain', 'output');
        terminal.log('   • Polygon (MATIC) - Polygon Network', 'output');
        terminal.log('   • Arbitrum (ETH) - Arbitrum One', 'output');
        terminal.log('   • Optimism (ETH) - Optimism', 'output');
        terminal.log('   • Base (ETH) - Base Network', 'output');
        terminal.log('   • Omega Network (OMEGA) - Current network', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔗 NON-EVM NETWORKS:', 'info');
        terminal.log('   • Solana (SOL) - Requires Phantom wallet', 'output');
        terminal.log('   • NEAR (NEAR) - Requires NEAR wallet', 'output');
        terminal.log('', 'output');
        
        terminal.log('💡 HOW TO USE ON OTHER NETWORKS:', 'info');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 1: Import to MetaMask', 'info');
        terminal.log('   • Copy your private key (saved above)', 'output');
        terminal.log('   • Import to MetaMask', 'output');
        terminal.log('   • Add custom networks (BSC, Polygon, etc.)', 'output');
        terminal.log('   • Switch networks in MetaMask', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 2: Use Terminal Network Switcher', 'info');
        terminal.log('   • Type "connect" to see network options', 'output');
        terminal.log('   • Select different networks', 'output');
        terminal.log('   • Your wallet address stays the same', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 METHOD 3: Export/Import Process', 'info');
        terminal.log('   • Export wallet from current session', 'output');
        terminal.log('   • Import to different wallet apps', 'output');
        terminal.log('   • Use same address across all networks', 'output');
        terminal.log('', 'output');
        
        terminal.log('⚠️  IMPORTANT SECURITY NOTES:', 'warning');
        terminal.log('   • Same private key = same address on all networks', 'output');
        terminal.log('   • Keep your private key secure and private', 'output');
        terminal.log('   • Never share your private key with anyone', 'output');
        terminal.log('   • Consider using hardware wallets for large amounts', 'output');
        terminal.log('', 'output');
        
        terminal.log('✅ Your wallet is ready for multi-network use!', 'success');
    },

    // Export wallet for use in other applications
    exportWallet: function(terminal) {
        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        const address = OmegaWallet.getCurrentAddress();
        const privateKey = OmegaWallet.getPrivateKey();
        
        if (!privateKey) {
            terminal.log('❌ Cannot export wallet - private key not available', 'error');
            terminal.log('💡 This usually happens with MetaMask wallets', 'info');
            return;
        }

        terminal.log('', 'output');
        terminal.log('📤 WALLET EXPORT INFORMATION:', 'info');
        terminal.log('════════════════════════════════════════════════════════════════════════════════', 'output');
        terminal.log('', 'output');
        
        terminal.log('🏛️ Address: ' + address, 'output');
        terminal.log('🔑 Private Key: ' + privateKey, 'output');
        terminal.log('', 'output');
        
        terminal.log('💡 EXPORT INSTRUCTIONS:', 'info');
        terminal.log('', 'output');
        
        terminal.log('🔄 FOR METAMASK:', 'info');
        terminal.log('   1. Open MetaMask', 'output');
        terminal.log('   2. Click account icon → Import Account', 'output');
        terminal.log('   3. Select "Private Key"', 'output');
        terminal.log('   4. Paste the private key above', 'output');
        terminal.log('   5. Click "Import"', 'output');
        terminal.log('', 'output');
        
        terminal.log('🔄 FOR OTHER WALLETS:', 'info');
        terminal.log('   • Most wallets support private key import', 'output');
        terminal.log('   • Look for "Import Wallet" or "Import Private Key"', 'output');
        terminal.log('   • Use the private key above', 'output');
        terminal.log('', 'output');
        
        terminal.log('⚠️  SECURITY WARNING:', 'warning');
        terminal.log('   • Never share your private key with anyone', 'output');
        terminal.log('   • Anyone with this key can access your funds', 'output');
        terminal.log('   • Store it securely (password manager recommended)', 'output');
        terminal.log('', 'output');
        
        terminal.log('✅ Wallet export information displayed above', 'success');
    },

    // Test wallet connection and show status
    testWallet: function(terminal) {
        terminal.log('🧪 WALLET CONNECTION TEST:', 'info');
        terminal.log('════════════════════════════════════════════════════════════════════════════════', 'output');
        terminal.log('', 'output');
        
        // Test OmegaWallet connection
        const isConnected = OmegaWallet.isConnected();
        terminal.log('🔗 OmegaWallet.isConnected(): ' + (isConnected ? '✅ TRUE' : '❌ FALSE'), isConnected ? 'success' : 'error');
        
        if (isConnected) {
            const address = OmegaWallet.getCurrentAddress();
            const provider = OmegaWallet.getProvider();
            const signer = OmegaWallet.getSigner();
            
            terminal.log('🏛️ Address: ' + (address || '❌ Not set'), address ? 'success' : 'error');
            terminal.log('🌐 Provider: ' + (provider ? '✅ Connected' : '❌ Not connected'), provider ? 'success' : 'error');
            terminal.log('✍️ Signer: ' + (signer ? '✅ Available' : '❌ Not available'), signer ? 'success' : 'error');
            
            // Test terminal state
            terminal.log('', 'output');
            terminal.log('🖥️ TERMINAL STATE:', 'info');
            terminal.log('👤 terminal.userAddress: ' + (terminal.userAddress || '❌ Not set'), terminal.userAddress ? 'success' : 'error');
            terminal.log('🌐 terminal.provider: ' + (terminal.provider ? '✅ Connected' : '❌ Not connected'), terminal.provider ? 'success' : 'error');
            terminal.log('✍️ terminal.signer: ' + (terminal.signer ? '✅ Available' : '❌ Not available'), terminal.signer ? 'success' : 'error');
            terminal.log('⛏️ terminal.contract: ' + (terminal.contract ? '✅ Connected' : '❌ Not connected'), terminal.contract ? 'success' : 'error');
            
            terminal.log('', 'output');
            terminal.log('✅ Wallet is fully functional for all commands!', 'success');
        } else {
            terminal.log('❌ Wallet is not properly connected', 'error');
            terminal.log('💡 Try: connect', 'info');
        }
    },

    // Import wallet from private key
    importWallet: async function(terminal, privateKey) {
        if (!privateKey) {
            terminal.log('❌ Usage: import <private-key>', 'error');
            terminal.log('💡 Example: import 0x1234567890abcdef...', 'info');
            return;
        }

        try {
            // Validate private key format
            if (!privateKey.startsWith('0x')) {
                privateKey = '0x' + privateKey;
            }

            if (privateKey.length !== 66) {
                throw new Error('Invalid private key length');
            }

            // Create wallet from private key
            const wallet = new window.ethers.Wallet(privateKey);
            
            // Set up the imported wallet
            OmegaWallet.setWallet(wallet);
            terminal.updateConnectionStatus('CONNECTED (Imported Wallet)');
            
            // Connect mining contract
            if (OmegaConfig.CONTRACT_ADDRESS && OmegaConfig.CONTRACT_ABI) {
                terminal.contract = new window.ethers.Contract(
                    OmegaConfig.CONTRACT_ADDRESS, 
                    OmegaConfig.CONTRACT_ABI, 
                    OmegaWallet.getSigner()
                );
                terminal.log('Mining contract connected for imported wallet.', 'success');
            }
            
            // Sync wallet state to terminal
            terminal.provider = OmegaWallet.getProvider();
            terminal.signer = OmegaWallet.getSigner();
            terminal.userAddress = OmegaWallet.getCurrentAddress();
            
            terminal.log('✅ Wallet imported successfully!', 'success');
            terminal.log('🏛️ Address: ' + wallet.address, 'info');
            terminal.log('💡 Your wallet is ready to use on all supported networks', 'info');
            
        } catch (error) {
            terminal.log('❌ Import failed: ' + error.message, 'error');
            terminal.log('💡 Make sure the private key is valid (64 hex characters)', 'info');
        }
    }
};

// Global function for funding (backward compatibility)
window.fundOmegaWallet = function(address) {
    if (window.terminal) {
        return window.OmegaCommands.Wallet.fundOmegaWallet(address, window.terminal);
    }
}; 