// Solana Commands - Handles Solana token swaps and wallet operations
window.OmegaCommands = window.OmegaCommands || {};
window.OmegaCommands.Solana = {

    // Main solana command handler
    solana: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('=== Solana Commands ===', 'info');
            terminal.log('solana connect - Connect Phantom wallet', 'output');
            terminal.log('solana generate - Generate new Solana wallet', 'output');
            terminal.log('solana status - Show available wallets', 'output');
        terminal.log('solana test   - Test network connectivity', 'output');
            terminal.log('solana search <query> - Search for Solana tokens', 'output');
            terminal.log('solana quote <amount> <fromMint> <toMint> - Get swap quote', 'output');
            terminal.log('solana swap - Open interactive swap interface', 'output');
            terminal.log('solana swap <amount> <fromMint> <toMint> - Execute swap', 'output');
            terminal.log('', 'output');
            terminal.log('Examples:', 'info');
            terminal.log('solana connect', 'output');
            terminal.log('solana generate', 'output');
            terminal.log('solana status', 'output');
            terminal.log('solana search bonk', 'output');
            terminal.log('solana swap', 'output');
            terminal.log('', 'info');
            terminal.log('💡 You can use browser-generated OR Phantom wallets for swaps', 'info');
            terminal.log('🔥 Search shows verified tokens with audit info and exchange listings', 'success');
            return;
        }

        const subCommand = args[1].toLowerCase();

        switch (subCommand) {
            case 'connect':
                await this.connectPhantom(terminal);
                break;
            case 'generate':
            case 'gen-wallet':
                await this.generateWallet(terminal);
                break;
            case 'search':
                if (args[2]) {
                    await this.searchTokens(terminal, args.slice(2).join(' '));
                } else {
                    terminal.log('Usage: solana search <query>', 'error');
                }
                break;
            case 'quote':
                if (args.length >= 5) {
                    await this.getSwapQuote(terminal, args[2], args[3], args[4]);
                } else {
                    terminal.log('Usage: solana quote <amount> <fromMint> <toMint>', 'error');
                }
                break;
            case 'swap':
                if (args.length >= 5) {
                    await this.executeSwap(terminal, args[2], args[3], args[4]);
                } else {
                    await this.showSwapInterface(terminal);
                }
                break;
            case 'status':
            case 'wallets':
                await this.showWalletStatus(terminal);
                break;
            case 'test':
            case 'rpc':
                await this.testRpcConnectivity(terminal);
                break;
            default:
                terminal.log('Unknown solana command. Type "solana" for help.', 'error');
        }
    },

    // Test RPC connectivity
    testRpcConnectivity: async function(terminal) {
        terminal.log('🔍 Testing Solana network connectivity...', 'info');
        
        try {
            const connection = new window.solanaWeb3.Connection('https://mainnet.helius-rpc.com/?api-key=94a04704-448e-45a8-82e5-8f4c63b25082');
            
            // Test 1: Get version
            terminal.log('📡 Testing: getVersion()...', 'info');
            const version = await connection.getVersion();
            terminal.log(`✅ Solana version: ${version['solana-core']}`, 'success');
            
            // Test 2: Get current slot
            terminal.log('📊 Testing: getSlot()...', 'info');
            const slot = await connection.getSlot();
            terminal.log(`✅ Current slot: ${slot.toLocaleString()}`, 'success');
            
            // Test 3: Get recent blockhash
            terminal.log('🔒 Testing: getLatestBlockhash()...', 'info');
            const blockhash = await connection.getLatestBlockhash();
            terminal.log(`✅ Latest blockhash: ${blockhash.blockhash.slice(0, 8)}...`, 'success');
            
            terminal.log('', 'output');
            terminal.log('🎉 All network tests passed!', 'success');
            terminal.log('✅ Your network can access Solana blockchain', 'success');
            terminal.log('🚀 Swaps should work properly', 'success');
            
        } catch (error) {
            terminal.log('', 'output');
            terminal.log('❌ Network connectivity failed', 'error');
            terminal.log(`🔍 Error: ${error.message}`, 'error');
            
            if (error.message.includes('403') || error.message.includes('forbidden')) {
                terminal.log('', 'output');
                terminal.log('💡 Diagnosis: Access Forbidden (403)', 'warning');
                terminal.log('🔧 Likely causes:', 'info');
                terminal.log('   • ISP blocking cryptocurrency requests', 'info');
                terminal.log('   • Corporate/school firewall', 'info');
                terminal.log('   • VPN/proxy interference', 'info');
                terminal.log('', 'output');
                terminal.log('🛠️ Solutions:', 'success');
                terminal.log('   • Try mobile hotspot', 'info');
                terminal.log('   • Use different WiFi network', 'info');
                terminal.log('   • Try VPN (if not already using)', 'info');
                terminal.log('   • Disable VPN (if currently using)', 'info');
            } else if (error.message.includes('network') || error.message.includes('timeout')) {
                terminal.log('', 'output');
                terminal.log('💡 Diagnosis: Network Issue', 'warning');
                terminal.log('🔧 Solutions:', 'info');
                terminal.log('   • Check internet connection', 'info');
                terminal.log('   • Try again in a few seconds', 'info');
                terminal.log('   • Use different network', 'info');
            }
        }
    },

    // Connect Phantom wallet
    connectPhantom: async function(terminal) {
        try {
            // Check if browser wallet already exists
            if (window.solanaWallet && window.solanaWallet.publicKey) {
                terminal.log('💡 You already have a browser-generated wallet ready to use!', 'info');
                terminal.log(`📍 Browser Wallet: ${window.solanaWallet.publicKey}`, 'info');
                terminal.log('You can still connect Phantom if you prefer...', 'info');
            }
            
            if (typeof window.solana === 'undefined') {
                terminal.log('❌ Phantom wallet not found. Please install Phantom browser extension.', 'error');
                terminal.logHtml('🔗 <a href="https://phantom.app" target="_blank">Download Phantom Wallet</a>', 'info');
                
                if (window.solanaWallet && window.solanaWallet.publicKey) {
                    terminal.log('✅ You can still swap using your browser-generated wallet!', 'success');
                }
                return;
            }

            terminal.log('🟣 Connecting to Phantom wallet...', 'info');
            const response = await window.solana.connect();
            
            if (response && response.publicKey) {
                terminal.log('✅ Phantom wallet connected successfully!', 'success');
                terminal.log(`📍 Phantom Address: ${response.publicKey.toString()}`, 'info');
                
                // Store for later use
                window.phantomWallet = {
                    publicKey: response.publicKey,
                    connected: true
                };
                
                if (window.solanaWallet && window.solanaWallet.publicKey) {
                    terminal.log('💡 You now have both wallets available for swaps!', 'info');
                }
            } else {
                terminal.log('❌ Failed to connect to Phantom wallet', 'error');
            }
        } catch (error) {
            terminal.log(`❌ Phantom connection failed: ${error.message}`, 'error');
        }
    },

    // Search Solana tokens (with complete information like original)
    searchTokens: async function(terminal, query) {
        try {
            terminal.log(`🔍 Searching Solana tokens for: ${query}`, 'info');
            
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/jupiter/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach((token, idx) => {
                    // Card-like top section: logo | name (symbol) | mint | price
                    let cardTop = `<div style='display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:4px;'>`;
                    
                    // Left: logo, name, symbol, mint, price, volume, holders
                    cardTop += `<div style='display:flex;align-items:center;gap:14px;'>`;
                    if (token.logoURI || token.icon) {
                        const logo = token.logoURI || token.icon;
                        cardTop += `<img src='${logo}' alt='icon' style='width:40px;height:40px;border-radius:50%;background:#fff;padding:2px;'>`;
                    }
                    cardTop += `<div><span style='font-size:1.2em;font-weight:bold;'>${token.name || ''}</span> <span style='color:#99ccff;'>(${token.symbol || ''})</span><br>`;
                    cardTop += `Mint: <span class='copyable' onclick="navigator.clipboard.writeText('${token.address || token.id}')">${token.address || token.id}</span><br>`;
                    
                    if (token.usdPrice !== undefined) cardTop += `Price: <b>$${Number(token.usdPrice).toLocaleString(undefined, {maximumFractionDigits:8})}</b><br>`;
                    
                    if (token.volume24h !== undefined || token.stats24h?.buyVolume !== undefined || token.stats24h?.sellVolume !== undefined) {
                        let vol = token.volume24h;
                        if (vol === undefined && token.stats24h) {
                            const buy = Number(token.stats24h.buyVolume || 0);
                            const sell = Number(token.stats24h.sellVolume || 0);
                            vol = buy + sell;
                        }
                        if (vol !== undefined) cardTop += `24h Volume: <b>$${Number(vol).toLocaleString(undefined, {maximumFractionDigits:2})}</b><br>`;
                    }
                    
                    if (token.holderCount !== undefined) cardTop += `Holders: <b>${Number(token.holderCount).toLocaleString()}</b><br>`;
                    cardTop += `</div></div>`;
                    
                    // Middle: audit and CEXes
                    cardTop += `<div style='min-width:200px;text-align:center;'>`;
                    if (token.audit) {
                        cardTop += `<div style='margin-bottom:4px;'><b>Audit</b><br>`;
                        if (token.audit.mintAuthorityDisabled !== undefined) cardTop += `Mint Authority: <b>${token.audit.mintAuthorityDisabled ? 'Disabled' : 'Enabled'}</b><br>`;
                        if (token.audit.freezeAuthorityDisabled !== undefined) cardTop += `Freeze Authority: <b>${token.audit.freezeAuthorityDisabled ? 'Disabled' : 'Enabled'}</b><br>`;
                        if (token.audit.topHoldersPercentage !== undefined) cardTop += `Top Holders: <b>${Number(token.audit.topHoldersPercentage).toLocaleString(undefined, {maximumFractionDigits:2})}%</b><br>`;
                        cardTop += `</div>`;
                    }
                    if (token.cexes && Array.isArray(token.cexes) && token.cexes.length > 0) {
                        cardTop += `<div><b>CEXs</b><br><span style='font-size:0.95em;'>${token.cexes.join(', ')}</span></div>`;
                    }
                    cardTop += `</div>`;
                    
                    // Right: mcap and fdv
                    cardTop += `<div style='text-align:right;min-width:180px;'>`;
                    if (token.mcap !== undefined) cardTop += `Market Cap:<br><b>$${Number(token.mcap).toLocaleString(undefined, {maximumFractionDigits:2})}</b><br>`;
                    if (token.fdv !== undefined) cardTop += `FDV:<br><b>$${Number(token.fdv).toLocaleString(undefined, {maximumFractionDigits:2})}</b><br>`;
                    cardTop += `</div>`;
                    cardTop += `</div>`;
                    
                    // Add swap buttons section
                    let swapSection = `<div style='margin-top:8px;padding:8px;background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:4px;'>`;
                    swapSection += `<div style='font-weight:bold;margin-bottom:4px;'>Quick Swap Actions:</div>`;
                    swapSection += `<div style='display:flex;gap:8px;flex-wrap:wrap;'>`;
                    
                    // Swap from SOL to this token (use 1 SOL = 1,000,000,000 lamports)
                    swapSection += `<button onclick="window.terminal.executeCommand('solana swap 1000000000 So11111111111111111111111111111111111111112 ${token.address || token.id}')" style='background:#00ff00;color:#000;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;'>Swap 1 SOL → ${token.symbol || 'Token'}</button>`;
                    
                    // Swap from this token to SOL (use 1,000,000 units; adjust decimals as needed)
                    swapSection += `<button onclick="window.terminal.executeCommand('solana swap 1000000 ${token.address || token.id} So11111111111111111111111111111111111111112')" style='background:#ff6600;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;'>Swap 1M ${token.symbol || 'Token'} → SOL</button>`;
                    
                    // Custom swap button
                    swapSection += `<button onclick="window.OmegaCommands.Solana.promptCustomSwap(window.terminal, '${token.address || token.id}', '${token.symbol || 'Token'}')" style='background:#0066ff;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;'>Custom Swap</button>`;
                    
                    swapSection += `</div></div>`;
                    
                    terminal.logHtml(cardTop + swapSection, 'output');
                    terminal.logHtml('<hr>', 'output');
                });
            } else {
                terminal.logHtml('<span style="color:#ff3333">No results found.</span>', 'error');
            }
        } catch (error) {
            terminal.log(`❌ Solana token search failed: ${error.message}`, 'error');
        }
    },

    // Get swap quote
    getSwapQuote: async function(terminal, amount, fromMint, toMint) {
        try {
            terminal.log('💱 Getting swap quote...', 'info');
            
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/jupiter/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputMint: fromMint,
                    outputMint: toMint,
                    amount: amount
                })
            });

            const data = await response.json();

            if (data && !data.error) {
                terminal.log('=== SOLANA SWAP QUOTE ===', 'info');
                
                // Format input amount with proper decimals
                const inputDecimals = fromMint === 'So11111111111111111111111111111111111111112' ? 9 : 6;
                const formattedInput = (parseFloat(data.inAmount || amount) / Math.pow(10, inputDecimals)).toFixed(inputDecimals === 9 ? 4 : 2);
                
                // Format output amount with proper decimals  
                const outputDecimals = toMint === 'So11111111111111111111111111111111111111112' ? 9 : 6;
                const formattedOutput = (parseFloat(data.outAmount) / Math.pow(10, outputDecimals)).toFixed(outputDecimals === 9 ? 4 : 2);
                
                terminal.log(`📊 Input Amount: ${formattedInput}`, 'info');
                terminal.log(`📊 Output Amount: ${formattedOutput}`, 'success');
                terminal.log(`💰 Price Impact: ${data.priceImpactPct || 'N/A'}%`, 'info');
                
                if (data.routePlan && data.routePlan.length > 0) {
                    terminal.log(`🛣️ Route: ${data.routePlan.length} step(s)`, 'info');
                    data.routePlan.forEach((step, i) => {
                        terminal.log(`   ${i + 1}. ${step.swapInfo?.label || 'Unknown DEX'}`, 'info');
                    });
                }
            } else {
                terminal.log(`❌ Failed to get quote: ${data.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            terminal.log(`❌ Quote request failed: ${error.message}`, 'error');
        }
    },

    // Execute Solana swap
    executeSwap: async function(terminal, amount, fromMint, toMint) {
        try {
            // Check for any available wallet (Phantom or browser-generated)
            let wallet = null;
            let publicKey = null;
            
            if (window.phantomWallet && window.phantomWallet.connected) {
                wallet = window.phantomWallet;
                publicKey = wallet.publicKey.toString();
                terminal.log('🟣 Using connected Phantom wallet...', 'info');
            } else if (window.solanaWallet && window.solanaWallet.publicKey) {
                wallet = window.solanaWallet;
                publicKey = wallet.publicKey;
                terminal.log('🟣 Using browser-generated wallet...', 'info');
            } else {
                terminal.log('❌ No wallet available. Use "solana connect" or "solana generate"', 'error');
                return;
            }

            terminal.log('🟣 Executing Solana swap...', 'info');
            
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/jupiter/swap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputMint: fromMint,
                    outputMint: toMint,
                    amount: amount,
                    userPublicKey: publicKey
                })
            });

            const data = await response.json();

            if (data && data.success && data.transaction) {
                terminal.log('✅ Swap transaction prepared successfully!', 'success');
                terminal.log('🔄 Signing and submitting transaction...', 'info');
                
                // Validation
                if (!data.transaction || typeof data.transaction !== 'string') {
                    throw new Error('Invalid transaction data received');
                }
                
                let signature;
                
                try {
                    terminal.log('🔄 Processing transaction...', 'info');
                    
                    // Step 1: Convert base64 transaction to VersionedTransaction
                    const transactionBase64 = data.transaction;
                    const transactionBuffer = Buffer.from(transactionBase64, 'base64');
                    
                    // Step 2: Deserialize to VersionedTransaction
                    let transaction;
                    if (window.solanaWeb3.VersionedTransaction) {
                        try {
                            transaction = window.solanaWeb3.VersionedTransaction.deserialize(transactionBuffer);
                            terminal.log('✅ Successfully deserialized as VersionedTransaction', 'success');
                        } catch (versionedError) {
                            terminal.log('⚠️ VersionedTransaction failed, trying legacy...', 'warning');
                            transaction = window.solanaWeb3.Transaction.from(transactionBuffer);
                            terminal.log('✅ Successfully deserialized as legacy Transaction', 'success');
                        }
                    } else {
                        terminal.log('⚠️ VersionedTransaction not available, using legacy...', 'warning');
                        transaction = window.solanaWeb3.Transaction.from(transactionBuffer);
                    }
                    
                    // Step 3: Sign the transaction based on wallet type
                    if (wallet === window.phantomWallet && window.solana?.signTransaction) {
                        // Phantom wallet signing
                        terminal.log('👻 Signing with Phantom wallet...', 'info');
                        transaction = await window.solana.signTransaction(transaction);
                        
                    } else if (wallet === window.solanaWallet && wallet.keypair) {
                        // Browser wallet signing
                        terminal.log('🌐 Signing with browser wallet...', 'info');
                        if (transaction.sign) {
                            // VersionedTransaction
                            transaction.sign([wallet.keypair]);
                        } else {
                            // Legacy Transaction
                            transaction.partialSign(wallet.keypair);
                        }
                    } else {
                        throw new Error('No valid wallet found for signing');
                    }
                    
                    // Step 4: Serialize signed transaction and send to network
                    // Step 4: Send to Solana network
                    const connection = new window.solanaWeb3.Connection('https://mainnet.helius-rpc.com/?api-key=94a04704-448e-45a8-82e5-8f4c63b25082', {
                        commitment: 'confirmed',
                        confirmTransactionInitialTimeout: 60000
                    });
                    
                    const serializedTransaction = transaction.serialize();
                    
                    signature = await connection.sendRawTransaction(serializedTransaction, {
                        maxRetries: 3,
                        skipPreflight: true,
                        preflightCommitment: 'confirmed'
                    });
                    
                    terminal.log('✅ Transaction sent successfully!', 'success');
                    
                    // Step 5: Confirm transaction
                    terminal.log('🔄 Confirming transaction...', 'info');
                    try {
                        const confirmation = await connection.confirmTransaction(signature, 'finalized');
                        
                        if (confirmation.value.err) {
                            throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
                        } else {
                            terminal.log('✅ Transaction confirmed!', 'success');
                        }
                    } catch (confirmError) {
                        terminal.log('⚠️ Confirmation failed but transaction was sent', 'warning');
                        terminal.log(`Transaction signature: ${signature}`, 'info');
                        // Don't throw error here - transaction was sent successfully
                    }
                    
                } catch (error) {
                    terminal.log(`❌ Transaction failed: ${error.message}`, 'error');
                    
                    // Parse common Solana RPC errors
                    let errorMsg = error.message;
                    if (errorMsg.includes('insufficient funds')) {
                        throw new Error('Insufficient SOL balance for transaction fees. Add more SOL to your wallet.');
                    } else if (errorMsg.includes('blockhash not found')) {
                        throw new Error('Transaction expired. Please try the swap again immediately.');
                    } else if (errorMsg.includes('Simulation failed')) {
                        throw new Error('Transaction simulation failed. This swap may not be possible at this time.');
                    } else if (errorMsg.includes('403') || errorMsg.includes('Access forbidden')) {
                        // This suggests network/ISP blocking
                        terminal.log('💡 The Helius RPC is being blocked', 'warning');
                        terminal.log('🔧 This might be due to:', 'info');
                        terminal.log('   • Your ISP blocking the request', 'info');
                        terminal.log('   • Corporate firewall restrictions', 'info');
                        terminal.log('   • VPN interference', 'info');
                        terminal.log('   • Try using a different internet connection', 'info');
                        throw new Error('Network access blocked. Try a different internet connection.');
                    } else {
                        throw error;
                    }
                }
                
                terminal.log(`🎉 Solana swap completed successfully!`, 'success');
                terminal.log(`📝 Transaction ID: ${signature}`, 'success');
                terminal.logHtml(`🔍 <a href="https://solscan.io/tx/${signature}" target="_blank">View transaction on Solscan</a>`, 'info');
                
            } else {
                terminal.log(`❌ Swap failed: ${data.error || data.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            terminal.log(`❌ Swap execution failed: ${error.message}`, 'error');
            
            // Provide helpful debugging info
            if (error.message.includes('403') || error.message.includes('Access forbidden') || error.message.includes('RPC access blocked')) {
                terminal.log('💡 Network access is being blocked', 'warning');
                terminal.log('🔧 Common causes and solutions:', 'info');
                terminal.log('   • ISP blocking cryptocurrency-related requests', 'info');
                terminal.log('   • Corporate/school network restrictions', 'info');
                terminal.log('   • VPN or proxy interference', 'info');
                terminal.log('   • Try using mobile hotspot or different WiFi', 'info');
                terminal.log('   • Try using a VPN if not already using one', 'info');
            } else if (error.message.includes('VersionedMessage') || error.message.includes('VersionedTransaction')) {
                terminal.log('💡 Transaction format compatibility issue', 'warning');
                terminal.log('🔧 Solutions:', 'info');
                terminal.log('   • Try using Phantom wallet: "solana connect"', 'info');
                terminal.log('   • Your Solana Web3.js may need updating', 'info');
                terminal.log('   • Try refreshing the page', 'info');
            } else if (error.message.includes('insufficient funds')) {
                terminal.log('💡 Make sure your wallet has enough SOL for the swap + fees (~0.01 SOL)', 'warning');
            } else if (error.message.includes('slippage')) {
                terminal.log('💡 Price moved too much during swap', 'warning');
                terminal.log('   • Try again (market prices change quickly)', 'info');
                terminal.log('   • Use a smaller swap amount', 'info');
            } else if (error.message.includes('blockhash') || error.message.includes('expired')) {
                terminal.log('💡 Transaction timed out', 'warning');
                terminal.log('   • Try the swap again immediately', 'info');
            } else {
                terminal.log('💡 General troubleshooting:', 'info');
                terminal.log('   • Check your internet connection', 'info');
                terminal.log('   • Ensure wallet is connected', 'info');
                terminal.log('   • Try a different token or amount', 'info');
                terminal.log('   • Check Solana network status', 'info');
            }
        }
    },

    // Show interactive swap interface with token search
    showSwapInterface: async function(terminal) {
        try {
            terminal.log('🟣 Solana Swap Interface with Token Search', 'info');
            
            let html = '<div style="background: #1a1a1a; border: 1px solid #00bfff; padding: 20px; margin: 10px 0; border-radius: 8px;">';
            html += '<h3 style="margin: 0 0 15px 0; color: #00bfff;">🟣 Solana Swap</h3>';
            
            // From token selection with searchable dropdown
            html += '<div style="margin-bottom: 15px;">';
            html += '<label style="color: #cccccc; display: block; margin-bottom: 5px;">From Token:</label>';
            html += '<div style="position: relative;">';
            html += '<input type="text" id="solanaFromSearch" placeholder="Search tokens..." style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #444; border-radius: 3px; box-sizing: border-box; cursor: text;" autocomplete="off">';
            html += '<div id="solanaFromList" style="position: absolute; top: 100%; left: 0; right: 0; max-height: 200px; overflow-y: auto; background: #222; border: 1px solid #444; border-top: none; z-index: 1000; display: none;"></div>';
            html += '</div>';
            html += '<input type="hidden" id="fromTokenAddress" value="So11111111111111111111111111111111111111112">';
            html += '<div id="fromTokenDisplay" style="margin-top: 5px; padding: 8px; background: #333; border-radius: 3px; color: #00bfff; border-left: 3px solid #00bfff;">SOL - Solana <span style="color: #00ff00; font-size: 12px;">✅ VERIFIED</span><br><span style="font-size: 11px; color: #888;">So11111111111111111111111111111111111111112</span></div>';
            html += '</div>';
            
            // To token selection with searchable dropdown  
            html += '<div style="margin-bottom: 15px;">';
            html += '<label style="color: #cccccc; display: block; margin-bottom: 5px;">To Token:</label>';
            html += '<div style="position: relative;">';
            html += '<input type="text" id="solanaToSearch" placeholder="Search tokens..." style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #444; border-radius: 3px; box-sizing: border-box; cursor: text;" autocomplete="off">';
            html += '<div id="solanaToList" style="position: absolute; top: 100%; left: 0; right: 0; max-height: 200px; overflow-y: auto; background: #222; border: 1px solid #444; border-top: none; z-index: 1000; display: none;"></div>';
            html += '</div>';
            html += '<input type="hidden" id="toTokenAddress" value="">';
            html += '<div id="toTokenDisplay" style="margin-top: 5px; padding: 8px; background: #333; border-radius: 3px; color: #cccccc; border-left: 3px solid #666;">Select a token</div>';
            html += '</div>';
            
            html += '<div style="margin-bottom: 15px;">';
            html += '<label style="color: #cccccc; display: block; margin-bottom: 5px;">Amount:</label>';
            html += '<input type="text" id="swapAmount" placeholder="1.0" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #fff; border-radius: 4px; cursor: text;" autocomplete="off">';
            html += '</div>';
            
            html += '<div style="display: flex; gap: 10px; margin-bottom: 15px;">';
            html += '<button id="solanaQuoteBtn" style="flex: 1; padding: 12px; background: linear-gradient(45deg, #0080ff, #00bfff); color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Get Quote</button>';
            html += '<button id="solanaSwapBtn" style="flex: 1; padding: 12px; background: linear-gradient(45deg, #00bfff, #0080ff); color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Execute Swap</button>';
            html += '</div>';
            
            html += '<div style="background: #2a2a2a; padding: 10px; border-radius: 4px; border-left: 3px solid #00bfff;">';
            html += '<small style="color: #cccccc;">🔍 Start typing to search for tokens by name or symbol. Best rates across all Solana DEXs.</small>';
            html += '</div>';
            
            html += '</div>';
            
            terminal.logHtml(html, 'output');
            
            // Add CSS for better input focus handling
            const focusStyle = document.createElement('style');
            focusStyle.textContent = `
                #solanaFromSearch:focus, #solanaToSearch:focus, #swapAmount:focus {
                    outline: none !important;
                    border-color: #00bfff !important;
                    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.3) !important;
                }
                #solanaFromSearch, #solanaToSearch, #swapAmount {
                    transition: border-color 0.2s, box-shadow 0.2s !important;
                }
            `;
            document.head.appendChild(focusStyle);

            // Add event listeners
            setTimeout(() => {
                this.setupTokenSearch(terminal);
                
                const quoteBtn = document.getElementById('solanaQuoteBtn');
                const swapBtn = document.getElementById('solanaSwapBtn');
                
                if (quoteBtn) {
                    quoteBtn.addEventListener('click', () => this.executeQuoteFromInterface(terminal));
                }
                
                if (swapBtn) {
                    swapBtn.addEventListener('click', () => this.executeSwapFromInterface(terminal));
                }
                
                // Ensure inputs are properly focusable
                const fromSearchInput = document.getElementById('solanaFromSearch');
                const toSearchInput = document.getElementById('solanaToSearch');
                const amountInput = document.getElementById('swapAmount');
                
                if (fromSearchInput) {
                    fromSearchInput.setAttribute('tabindex', '1');
                    fromSearchInput.style.cursor = 'text';
                }
                
                if (toSearchInput) {
                    toSearchInput.setAttribute('tabindex', '2');
                    toSearchInput.style.cursor = 'text';
                }
                
                if (amountInput) {
                    amountInput.setAttribute('tabindex', '3');
                    amountInput.style.cursor = 'text';
                    
                    // Add click handler for amount input
                    amountInput.addEventListener('click', (e) => {
                        e.target.focus();
                        e.stopPropagation();
                    });
                    
                    amountInput.addEventListener('focus', (e) => {
                        e.target.focus();
                    });
                }
            }, 100);
            
        } catch (error) {
            terminal.log(`Failed to load Solana swap interface: ${error.message}`, 'error');
        }
    },

    // Setup token search functionality
    setupTokenSearch: function(terminal) {
        const fromSearch = document.getElementById('solanaFromSearch');
        const toSearch = document.getElementById('solanaToSearch');
        const fromList = document.getElementById('solanaFromList');
        const toList = document.getElementById('solanaToList');
        
        // From token search
        if (fromSearch && fromList) {
            let fromSearchTimeout;
            fromSearch.addEventListener('input', (e) => {
                clearTimeout(fromSearchTimeout);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    fromList.style.display = 'none';
                    return;
                }
                
                fromSearchTimeout = setTimeout(async () => {
                    fromList.innerHTML = '<div style="padding: 8px; color: #666;">Searching...</div>';
                    fromList.style.display = 'block';
                    
                    try {
                        const res = await fetch(`${OmegaConfig.RELAYER_URL}/jupiter/search?q=${encodeURIComponent(query)}`);
                        const data = await res.json();
                        
                        fromList.innerHTML = '';
                        
                        if (data && data.length > 0) {
                            data.slice(0, 10).forEach(token => {
                                const item = document.createElement('div');
                                item.style.cssText = 'padding: 8px; cursor: pointer; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 8px;';
                                
                                let content = '';
                                if (token.logoURI) {
                                    content += `<img src="${token.logoURI}" style="width: 20px; height: 20px; border-radius: 50%;">`;
                                }
                                content += `<div><div style="font-weight: bold;">${token.symbol || 'Unknown'}</div><div style="font-size: 12px; color: #888;">${token.name || 'Unknown'}</div></div>`;
                                
                                item.innerHTML = content;
                                
                                item.addEventListener('mousedown', (e) => {
                                    e.preventDefault(); // Prevent blur from firing
                                });
                                
                                item.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    document.getElementById('fromTokenAddress').value = token.address || token.id;
                                    
                                    // Show verification info
                                    const isVerified = token.verified || token.tags?.includes('verified') || false;
                                    const verificationBadge = isVerified ? 
                                        '<span style="color: #00ff00; font-size: 12px;">✅ VERIFIED</span>' : 
                                        '<span style="color: #ff4444; font-size: 12px;">⚠️ UNVERIFIED</span>';
                                    
                                    const contractAddr = token.address || token.id;
                                    const shortAddr = contractAddr.substring(0, 8) + '...' + contractAddr.substring(contractAddr.length - 8);
                                    
                                    document.getElementById('fromTokenDisplay').innerHTML = 
                                        `${token.symbol} - ${token.name} ${verificationBadge}<br><span style="font-size: 11px; color: #888;">${shortAddr}</span>`;
                                    document.getElementById('fromTokenDisplay').style.borderLeftColor = isVerified ? '#00bfff' : '#ff4444';
                                    document.getElementById('fromTokenDisplay').style.color = isVerified ? '#00bfff' : '#ffaa00';
                                    
                                    fromSearch.value = '';
                                    fromList.style.display = 'none';
                                });
                                
                                fromList.appendChild(item);
                            });
                        } else {
                            fromList.innerHTML = '<div style="padding: 8px; color: #666;">No results found</div>';
                        }
                    } catch (err) {
                        fromList.innerHTML = '<div style="padding: 8px; color: #666;">Search failed</div>';
                    }
                }, 300);
            });
            
            fromSearch.addEventListener('focus', (e) => {
                e.target.focus(); // Ensure focus
                if (fromList.children.length > 0) {
                    fromList.style.display = 'block';
                }
            });
            
            fromSearch.addEventListener('click', (e) => {
                e.target.focus(); // Force focus on click
                e.stopPropagation();
            });
            
            fromSearch.addEventListener('blur', (e) => {
                // Longer delay to allow for dropdown clicks
                setTimeout(() => {
                    if (!fromSearch.matches(':focus')) {
                        fromList.style.display = 'none';
                    }
                }, 300);
            });
        }
        
        // To token search (similar logic)
        if (toSearch && toList) {
            let toSearchTimeout;
            toSearch.addEventListener('input', (e) => {
                clearTimeout(toSearchTimeout);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    toList.style.display = 'none';
                    return;
                }
                
                toSearchTimeout = setTimeout(async () => {
                    toList.innerHTML = '<div style="padding: 8px; color: #666;">Searching...</div>';
                    toList.style.display = 'block';
                    
                    try {
                        const res = await fetch(`${OmegaConfig.RELAYER_URL}/jupiter/search?q=${encodeURIComponent(query)}`);
                        const data = await res.json();
                        
                        toList.innerHTML = '';
                        
                        if (data && data.length > 0) {
                            data.slice(0, 10).forEach(token => {
                                const item = document.createElement('div');
                                item.style.cssText = 'padding: 8px; cursor: pointer; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 8px;';
                                
                                let content = '';
                                if (token.logoURI) {
                                    content += `<img src="${token.logoURI}" style="width: 20px; height: 20px; border-radius: 50%;">`;
                                }
                                content += `<div><div style="font-weight: bold;">${token.symbol || 'Unknown'}</div><div style="font-size: 12px; color: #888;">${token.name || 'Unknown'}</div></div>`;
                                
                                item.innerHTML = content;
                                
                                item.addEventListener('mousedown', (e) => {
                                    e.preventDefault(); // Prevent blur from firing
                                });
                                
                                item.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    document.getElementById('toTokenAddress').value = token.address || token.id;
                                    
                                    // Show verification info
                                    const isVerified = token.verified || token.tags?.includes('verified') || false;
                                    const verificationBadge = isVerified ? 
                                        '<span style="color: #00ff00; font-size: 12px;">✅ VERIFIED</span>' : 
                                        '<span style="color: #ff4444; font-size: 12px;">⚠️ UNVERIFIED</span>';
                                    
                                    const contractAddr = token.address || token.id;
                                    const shortAddr = contractAddr.substring(0, 8) + '...' + contractAddr.substring(contractAddr.length - 8);
                                    
                                    document.getElementById('toTokenDisplay').innerHTML = 
                                        `${token.symbol} - ${token.name} ${verificationBadge}<br><span style="font-size: 11px; color: #888;">${shortAddr}</span>`;
                                    document.getElementById('toTokenDisplay').style.borderLeftColor = isVerified ? '#00bfff' : '#ff4444';
                                    document.getElementById('toTokenDisplay').style.color = isVerified ? '#00bfff' : '#ffaa00';
                                    
                                    toSearch.value = '';
                                    toList.style.display = 'none';
                                });
                                
                                toList.appendChild(item);
                            });
                        } else {
                            toList.innerHTML = '<div style="padding: 8px; color: #666;">No results found</div>';
                        }
                    } catch (err) {
                        toList.innerHTML = '<div style="padding: 8px; color: #666;">Search failed</div>';
                    }
                }, 300);
            });
            
            toSearch.addEventListener('focus', (e) => {
                e.target.focus(); // Ensure focus
                if (toList.children.length > 0) {
                    toList.style.display = 'block';
                }
            });
            
            toSearch.addEventListener('click', (e) => {
                e.target.focus(); // Force focus on click
                e.stopPropagation();
            });
            
            toSearch.addEventListener('blur', (e) => {
                // Longer delay to allow for dropdown clicks
                setTimeout(() => {
                    if (!toSearch.matches(':focus')) {
                        toList.style.display = 'none';
                    }
                }, 300);
            });
        }
    },

    // Execute quote from interface  
    executeQuoteFromInterface: async function(terminal) {
        try {
            const fromToken = document.getElementById('fromTokenAddress')?.value;
            const toToken = document.getElementById('toTokenAddress')?.value;
            const amount = document.getElementById('swapAmount')?.value;
            
            if (!fromToken || !toToken || !amount) {
                terminal.log('❌ Please select both tokens and enter an amount', 'error');
                return;
            }
            
            if (fromToken === toToken) {
                terminal.log('❌ Cannot swap the same token', 'error');
                return;
            }
            
            // Convert amount to proper decimals (assume SOL = 9 decimals, others = 6)
            const decimals = fromToken === 'So11111111111111111111111111111111111111112' ? 9 : 6;
            const swapAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals));
            
            await this.getSwapQuote(terminal, swapAmount.toString(), fromToken, toToken);
            
        } catch (error) {
            terminal.log(`❌ Quote failed: ${error.message}`, 'error');
        }
    },

    // Execute swap from interface
    executeSwapFromInterface: async function(terminal) {
        try {
            const fromToken = document.getElementById('fromTokenAddress')?.value;
            const toToken = document.getElementById('toTokenAddress')?.value;
            const amount = document.getElementById('swapAmount')?.value;
            
            if (!fromToken || !toToken || !amount) {
                terminal.log('❌ Please select both tokens and enter an amount', 'error');
                return;
            }
            
            if (fromToken === toToken) {
                terminal.log('❌ Cannot swap the same token', 'error');
                return;
            }
            
            // Convert amount to proper decimals (assume SOL = 9 decimals, others = 6)
            const decimals = fromToken === 'So11111111111111111111111111111111111111112' ? 9 : 6;
            const swapAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals));
            
            await this.executeSwap(terminal, swapAmount.toString(), fromToken, toToken);
            
        } catch (error) {
            terminal.log(`❌ Interface swap failed: ${error.message}`, 'error');
        }
    },

    // Generate Solana wallet in browser
    generateWallet: async function(terminal) {
        try {
            if (!window.solanaWeb3) {
                terminal.log('❌ Solana Web3 library not loaded. Cannot generate Solana wallet.', 'error');
                return;
            }
            
            terminal.log('🟣 Generating new Solana wallet keypair...', 'info');
            
            // Generate Solana keypair
            const keypair = window.solanaWeb3.Keypair.generate();
            const publicKey = keypair.publicKey.toString();
            const privateKey = Array.from(keypair.secretKey).map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Store in session
            window.solanaWallet = { 
                publicKey, 
                privateKey, 
                keypair,
                network: 'Solana Mainnet',
                rpcUrl: 'https://api.mainnet-beta.solana.com'
            };
            
            let html = `<b>✅ New Solana Wallet Generated!</b><br>`;
            html += `<span style='color:#ff3333'>⚠️ SECURITY WARNING: Save your private key securely. Anyone with this key can access your funds!</span><br><br>`;
            html += `<b>Public Key:</b> <span class='copyable' onclick="navigator.clipboard.writeText('${publicKey}').then(() => window.terminal.log('✅ Public key copied!', 'success'))">${publicKey}</span><br>`;
            html += `<b>Private Key:</b> <span class='copyable' onclick="navigator.clipboard.writeText('${privateKey}').then(() => window.terminal.log('✅ Private key copied!', 'success'))">${privateKey}</span><br>`;
            html += `<b>Network:</b> Solana Mainnet<br>`;
            html += `<b>RPC URL:</b> https://api.mainnet-beta.solana.com<br><br>`;
            
            html += `<button onclick="(() => { const blob = new Blob(['Public Key: ${publicKey}\\nPrivate Key: ${privateKey}\\nNetwork: Solana Mainnet\\nRPC URL: https://api.mainnet-beta.solana.com'], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'solana-wallet.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); })()" style="background:#00bfff;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;margin-right:10px;">📥 Download Wallet Info</button>`;
            html += `<button onclick="window.OmegaCommands.Solana.importToPhantom(window.terminal, '${privateKey}')" style="background:#0080ff;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer;">👻 Import to Phantom</button><br><br>`;
            
            html += `💡 <b>Next Steps:</b><br>`;
            html += `1. Save your private key in a secure location<br>`;
            html += `2. Send SOL to your public key to fund the wallet<br>`;
            html += `3. Import to Phantom or use with any Solana wallet<br>`;
            html += `4. Use <b>solana connect</b> to connect Phantom wallet<br><br>`;
            
            terminal.logHtml(html, 'output');
            
        } catch (error) {
            terminal.log(`❌ Failed to generate Solana wallet: ${error.message}`, 'error');
        }
    },

    // Import wallet to Phantom (show instructions)
    importToPhantom: function(terminal, privateKey) {
        terminal.log('👻 Import Wallet to Phantom:', 'info');
        terminal.log('1. Open Phantom wallet extension', 'info');
        terminal.log('2. Click "Add / Connect Wallet"', 'info');
        terminal.log('3. Select "Import Private Key"', 'info');
        terminal.log('4. Paste your private key (already copied)', 'info');
        terminal.log('5. Complete the setup process', 'info');
        terminal.log('', 'info');
        terminal.log(`🔑 Private Key: ${privateKey}`, 'warning');
        terminal.log('✅ Private key copied to clipboard!', 'success');
        
        // Copy to clipboard
        navigator.clipboard.writeText(privateKey).catch(() => {
            terminal.log('❌ Failed to copy to clipboard', 'error');
        });
    },

    // Prompt custom swap amounts
    promptCustomSwap: function(terminal, tokenAddress, tokenSymbol) {
        terminal.log(`💱 Custom Swap for ${tokenSymbol}`, 'info');
        
        let html = '<div style="background: #1a1a1a; border: 1px solid #00bfff; padding: 15px; margin: 10px 0; border-radius: 8px;">';
        html += `<h4 style="color: #00bfff; margin: 0 0 10px 0;">Custom Swap: ${tokenSymbol}</h4>`;
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="color: #cccccc; display: block; margin-bottom: 5px;">Amount:</label>';
        html += `<input type="text" id="customSwapAmount" placeholder="Enter amount" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #fff; border-radius: 4px;">`;
        html += '</div>';
        
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="color: #cccccc; display: block; margin-bottom: 5px;">Direction:</label>';
        html += '<select id="customSwapDirection" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: #fff; border-radius: 4px;">';
        html += `<option value="to-sol">Sell ${tokenSymbol} → Get SOL</option>`;
        html += `<option value="from-sol">Buy ${tokenSymbol} ← Spend SOL</option>`;
        html += '</select>';
        html += '</div>';
        
        html += '<div style="display: flex; gap: 10px;">';
        html += `<button onclick="window.OmegaCommands.Solana.executeCustomSwap(window.terminal, '${tokenAddress}', '${tokenSymbol}')" style="flex: 1; padding: 10px; background: #00bfff; color: white; border: none; border-radius: 4px; cursor: pointer;">Execute Swap</button>`;
        html += `<button onclick="this.parentElement.parentElement.style.display='none'" style="padding: 10px 15px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>`;
        html += '</div>';
        
        html += '</div>';
        
        terminal.logHtml(html, 'output');
    },

    // Execute custom swap
    executeCustomSwap: async function(terminal, tokenAddress, tokenSymbol) {
        try {
            const amount = document.getElementById('customSwapAmount')?.value;
            const direction = document.getElementById('customSwapDirection')?.value;
            
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                terminal.log('❌ Please enter a valid amount', 'error');
                return;
            }
            
            let fromMint, toMint, swapAmount;
            
            if (direction === 'to-sol') {
                // Selling token for SOL
                fromMint = tokenAddress;
                toMint = 'So11111111111111111111111111111111111111112';
                swapAmount = Math.floor(parseFloat(amount) * 1000000); // Assume 6 decimals
            } else {
                // Buying token with SOL  
                fromMint = 'So11111111111111111111111111111111111111112';
                toMint = tokenAddress;
                swapAmount = Math.floor(parseFloat(amount) * 1000000000); // SOL has 9 decimals
            }
            
            terminal.log(`💱 Executing custom swap: ${amount} ${direction === 'to-sol' ? tokenSymbol + ' → SOL' : 'SOL → ' + tokenSymbol}`, 'info');
            
            // Hide the custom swap interface
            const customSwapElements = document.querySelectorAll('[id*="customSwap"]');
            customSwapElements.forEach(el => {
                const container = el.closest('div[style*="border: 1px solid #00bfff"]');
                if (container) container.style.display = 'none';
            });
            
            // Execute the swap
            await this.executeSwap(terminal, swapAmount.toString(), fromMint, toMint);
            
        } catch (error) {
            terminal.log(`❌ Custom swap failed: ${error.message}`, 'error');
        }
    },

    // Show wallet status
    showWalletStatus: async function(terminal) {
        terminal.log('=== SOLANA WALLET STATUS ===', 'info');
        
        let hasWallet = false;
        
        // Check browser-generated wallet
        if (window.solanaWallet && window.solanaWallet.publicKey) {
            terminal.log('✅ Browser-Generated Wallet:', 'success');
            terminal.log(`   📍 Address: ${window.solanaWallet.publicKey}`, 'info');
            terminal.log('   🔐 Status: Ready for swaps', 'success');
            hasWallet = true;
        }
        
        // Check Phantom wallet
        if (window.phantomWallet && window.phantomWallet.connected) {
            terminal.log('✅ Phantom Wallet:', 'success');
            terminal.log(`   📍 Address: ${window.phantomWallet.publicKey.toString()}`, 'info');
            terminal.log('   🔐 Status: Connected and ready', 'success');
            hasWallet = true;
        } else if (typeof window.solana !== 'undefined') {
            terminal.log('⚪ Phantom Wallet:', 'warning');
            terminal.log('   📍 Status: Detected but not connected', 'warning');
            terminal.log('   💡 Use "solana connect" to connect', 'info');
        }
        
        if (!hasWallet) {
            terminal.log('❌ No wallets available', 'error');
            terminal.log('', 'info');
            terminal.log('💡 Get a wallet:', 'info');
            terminal.log('   • solana generate  - Create browser wallet', 'info');
            terminal.log('   • solana connect   - Connect Phantom wallet (recommended)', 'info');
        } else {
            terminal.log('', 'info');
            
            // Check Web3.js capabilities
            const hasVersionedSupport = !!(window.solanaWeb3?.VersionedTransaction && window.solanaWeb3?.VersionedMessage);
            terminal.log(`🔧 Advanced transaction support: ${hasVersionedSupport ? '✅ Available' : '❌ Limited'}`, hasVersionedSupport ? 'success' : 'warning');
            
            if (window.solanaWallet && !window.phantomWallet?.connected) {
                terminal.log('⚠️ Using browser wallet - may have compatibility issues', 'warning');
                terminal.log('💡 For best results: "solana connect" (use Phantom)', 'info');
            }
            
            if (!hasVersionedSupport) {
                terminal.log('⚠️ Your Solana Web3.js version may be outdated', 'warning');  
                terminal.log('💡 Some swaps may fail - try refreshing the page', 'info');
            }
            
            terminal.log('🚀 Ready to swap! Use "solana swap" to get started', 'success');
        }
    }
}; 