// Eclipse Commands - Solar DEX + Deserialize Aggregator Integration (Original Implementation)
window.OmegaCommands = window.OmegaCommands || {};
window.OmegaCommands.Eclipse = {

    // SOLAR token address for smart routing
    SOLAR_TOKEN_ADDRESS: 'CwrZKtPiZJrAK3tTjNPP22rD9VzeoxQv8iHd6EeyNoze',
    
    // Eclipse RPC URL 
    ECLIPSE_RPC_URL: 'https://mainnetbeta-rpc.eclipse.xyz',

    // Main eclipse command handler
    eclipse: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('=== Eclipse Commands ===', 'info');
            terminal.log('eclipse tokens - List all available tokens', 'output');
            terminal.log('eclipse price <mint> - Get token price', 'output');  
            terminal.log('eclipse swap - Interactive swap interface', 'output');
            terminal.log('eclipse swap <amount> <fromMint> <toMint> <slippageBps> - Execute swap', 'output');
            terminal.log('eclipse connect - Connect Eclipse wallet', 'output');
            terminal.log('eclipse generate - Generate Eclipse wallet', 'output');
            terminal.log('eclipse balance - Check Eclipse balance', 'output');
            terminal.log('', 'output');
            terminal.log('Examples:', 'info');
            terminal.log('eclipse tokens', 'output');
            terminal.log('eclipse price CwrZKtPiZJrAK3tTjNPP22rD9VzeoxQv8iHd6EeyNoze', 'output');
            terminal.log('eclipse swap', 'output');
            terminal.log('', 'info');
            terminal.log('🔵 Solar DEX | 🟠 Deserialize Aggregator | 🟢 Both DEXes', 'info');
            terminal.log('💫 Smart routing: SOLAR token → Solar DEX, Others → Deserialize', 'success');
            return;
        }

        const subCommand = args[1].toLowerCase();

        switch (subCommand) {
            case 'tokens':
            case 'list':
                await this.showTokenList(terminal);
                break;
            case 'price':
                if (args[2]) {
                    await this.getTokenPrice(terminal, args[2]);
                } else {
                    terminal.log('Usage: eclipse price <mint>', 'error');
                }
                break;
            case 'swap':
                if (args.length >= 6) {
                    // Direct swap: eclipse swap <amount> <fromMint> <toMint> <slippageBps>
                    await this.executeSwap(terminal, args[2], args[3], args[4], args[5]);
                } else {
                    // Interactive swap interface
                    await this.showSwapInterface(terminal);
                }
                break;
            case 'connect':
                await this.connectEclipse(terminal);
                break;
            case 'generate':
                await this.generateWallet(terminal);
                break;
            case 'balance':
                await this.checkBalance(terminal);
                break;
            default:
                terminal.log('Unknown eclipse command. Type "eclipse" for help.', 'error');
        }
    },

    // Show token list with prices from both Solar DEX and Deserialize
    showTokenList: async function(terminal) {
        try {
            terminal.log('🔄 Loading Eclipse tokens...', 'info');
            terminal.log('Fetching Solar DEX tokens...', 'info');
            terminal.log('Fetching Deserialize tokens...', 'info');
            
            // Fetch from both APIs
            const [solarResponse, deserializeResponse] = await Promise.all([
                fetch('https://api.solarstudios.co/mint/list'),
                fetch('https://api.deserialize.xyz/tokenList')
            ]);
            
            let solarTokens = [];
            let deserializeTokens = [];
            
            if (solarResponse.ok) {
                const solarData = await solarResponse.json();
                if (solarData.success && solarData.data && solarData.data.mintList) {
                    solarTokens = solarData.data.mintList;
                }
            }
            
            if (deserializeResponse.ok) {
                const deserializeData = await deserializeResponse.json();
                if (deserializeData.data && Array.isArray(deserializeData.data)) {
                    deserializeTokens = deserializeData.data;
                }
            }
            
            // Merge tokens
            const allTokens = new Map();
            
            // Add Solar tokens
            solarTokens.forEach(token => {
                allTokens.set(token.address, {
                    address: token.address,
                    symbol: token.symbol,
                    name: token.name,
                    decimals: token.decimals,
                    source: 'Solar'
                });
            });
            
            // Add Deserialize tokens (will override if duplicate address)
            deserializeTokens.forEach(token => {
                allTokens.set(token.address, {
                    address: token.address,
                    symbol: token.metadata?.symbol || 'N/A',
                    name: token.metadata?.name || 'N/A', 
                    decimals: token.decimals,
                    source: allTokens.has(token.address) ? 'Both' : 'Deserialize'
                });
            });
            
            const tokens = Array.from(allTokens.values()).sort((a, b) => a.symbol.localeCompare(b.symbol));
            
            // Create table header
            let html = `<table style='border-collapse: collapse; width: 100%; margin: 10px 0;'>`;
            html += `<tr style='background: rgba(255,255,255,0.1);'><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Icon</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Symbol</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Name</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Mint Address</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Source</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Solar DEX</th><th style='padding: 8px; text-align: left; border: 1px solid #333;'>Deserialize Agg</th></tr>`;
            
            // Get mint addresses for batch price fetch from Solar
            const mintAddresses = tokens.map(token => token.address).join(',');
            
            // Fetch Solar prices for all tokens
            terminal.log('Fetching Solar DEX prices...', 'info');
            let solarPriceData = { data: {} };
            try {
                const solarPriceResponse = await fetch(`https://api.solarstudios.co/mint/price?mints=${mintAddresses}`);
                if (solarPriceResponse.ok) {
                    solarPriceData = await solarPriceResponse.json();
                }
            } catch (error) {
                terminal.log('⚠️ Solar price fetch failed', 'warning');
            }
            
            // Fetch Deserialize prices for all tokens
            terminal.log('Fetching Deserialize prices...', 'info');
            const deserializePrices = {};
            
            // Fetch prices one by one for Deserialize (since it doesn't support batch)
            for (const token of tokens.slice(0, 20)) { // Limit to first 20 to avoid rate limits
                try {
                    const deserializeResponse = await fetch(`https://api.deserialize.xyz/tokenPrice/${token.address}`);
                    if (deserializeResponse.ok) {
                        const deserializeData = await deserializeResponse.json();
                        deserializePrices[token.address] = deserializeData.price;
                    }
                } catch (error) {
                    // Skip failed price fetches
                }
            }
            
            // Add token rows
            tokens.forEach(token => {
                const solarPrice = solarPriceData.data?.[token.address];
                const deserializePrice = deserializePrices[token.address];
                
                const solarPriceDisplay = solarPrice ? `$${parseFloat(solarPrice).toFixed(6)}` : 'N/A';
                const deserializePriceDisplay = deserializePrice ? `$${parseFloat(deserializePrice).toFixed(6)}` : 'N/A';
                
                let sourceColor = '#ffffff';
                if (token.source === 'Solar') sourceColor = '#99ccff';
                if (token.source === 'Deserialize') sourceColor = '#ffcc99';
                if (token.source === 'Both') sourceColor = '#99ff99';
                
                const sourceIcon = token.source === 'Solar' ? '🔵' : token.source === 'Deserialize' ? '🟠' : '🟢';
                
                html += `<tr><td style='padding: 8px; border: 1px solid #333;'>${sourceIcon}</td><td style='padding: 8px; border: 1px solid #333;'>${token.symbol}</td><td style='padding: 8px; border: 1px solid #333;'>${token.name}</td><td style='padding: 8px; border: 1px solid #333; font-family: monospace; font-size: 10px;'><span class='copyable' onclick="navigator.clipboard.writeText('${token.address}')">${token.address}</span></td><td style='padding: 8px; border: 1px solid #333; color: ${sourceColor}'>${token.source}</td><td style='padding: 8px; border: 1px solid #333;'>${solarPriceDisplay}</td><td style='padding: 8px; border: 1px solid #333;'>${deserializePriceDisplay}</td></tr>`;
            });
            
            html += `</table>`;
            html += `<p style='font-size: 12px; color: #999; margin-top: 10px;'>🔵 Solar DEX | 🟠 Deserialize Aggregator | 🟢 Available on Both</p>`;
            html += `<p style='font-size: 12px; color: #999;'>Smart Routing: SOLAR token uses Solar DEX, others use Deserialize Aggregator</p>`;
            
            terminal.logHtml(html, 'output');
            terminal.log(`✅ Found ${tokens.length} tokens (${solarTokens.length} Solar, ${deserializeTokens.length} Deserialize)`, 'success');
            
        } catch (error) {
            terminal.log(`❌ Failed to load token list: ${error.message}`, 'error');
        }
    },

    // Get token price from Solar DEX
    getTokenPrice: async function(terminal, mint) {
        try {
            terminal.log(`🔍 Getting price for: ${mint}`, 'info');
            
            const response = await fetch(`https://api.solarstudios.co/mint/price?mints=${mint}`);
            const data = await response.json();
            
            if (data && data.data && data.data[mint]) {
                const price = parseFloat(data.data[mint]);
                terminal.log(`💰 Solar DEX Price: $${price.toFixed(8)}`, 'success');
                
                // Also try Deserialize for comparison
                try {
                    const deserializeResponse = await fetch(`https://api.deserialize.xyz/tokenPrice/${mint}`);
                    if (deserializeResponse.ok) {
                        const deserializeData = await deserializeResponse.json();
                        const deserializePrice = parseFloat(deserializeData.price);
                        terminal.log(`💰 Deserialize Price: $${deserializePrice.toFixed(8)}`, 'info');
                    }
                } catch (error) {
                    terminal.log('⚠️ Deserialize price unavailable', 'warning');
                }
            } else {
                terminal.log(`❌ Price not found for ${mint}`, 'error');
            }
        } catch (error) {
            terminal.log(`❌ Price lookup failed: ${error.message}`, 'error');
        }
    },

    // Show interactive swap interface (original implementation)
    showSwapInterface: async function(terminal) {
        try {
            terminal.log('🔄 Eclipse Swap Interface', 'info');
            terminal.log('Loading available tokens...', 'info');
            
            // Fetch tokens from both APIs
            const [solarResponse, deserializeResponse] = await Promise.all([
                fetch('https://api.solarstudios.co/mint/list'),
                fetch('https://api.deserialize.xyz/tokenList')
            ]);
            
            let solarTokens = [];
            let deserializeTokens = [];
            
            if (solarResponse.ok) {
                const solarData = await solarResponse.json();
                if (solarData.success && solarData.data && solarData.data.mintList) {
                    solarTokens = solarData.data.mintList;
                }
            }
            
            if (deserializeResponse.ok) {
                const deserializeData = await deserializeResponse.json();
                if (deserializeData.data && Array.isArray(deserializeData.data)) {
                    deserializeTokens = deserializeData.data;
                }
            }
            
            // Merge tokens
            const allTokens = new Map();
            
            solarTokens.forEach(token => {
                allTokens.set(token.address, {
                    address: token.address,
                    symbol: token.symbol,
                    name: token.name,
                    decimals: token.decimals,
                    source: 'Solar'
                });
            });
            
            deserializeTokens.forEach(token => {
                allTokens.set(token.address, {
                    address: token.address,
                    symbol: token.metadata?.symbol || 'N/A',
                    name: token.metadata?.name || 'N/A',
                    decimals: token.decimals,
                    source: allTokens.has(token.address) ? 'Both' : 'Deserialize'
                });
            });
            
            const tokens = Array.from(allTokens.values()).sort((a, b) => a.symbol.localeCompare(b.symbol));
            
            // Find ETH and SOLAR tokens for defaults (do this first)
            const ethToken = tokens.find(t => t.symbol === 'ETH' || t.name.includes('Ethereum'));
            const solarToken = tokens.find(t => t.symbol === 'SOLAR' || t.name.includes('SOLAR'));
            
            const defaultFromToken = ethToken || tokens[0];
            const defaultToToken = solarToken || tokens[1] || tokens[0];
            
            // Create swap interface with custom dropdowns
            let html = `<div style="background: rgba(255,255,255,0.05); border: 1px solid #ffffff; padding: 15px; border-radius: 5px; margin: 10px 0;">`;
            html += `<h3 style="margin: 0 0 15px 0; color: #ffffff;">🔄 Eclipse Swap</h3>`;
            
            // From token selection with custom dropdown
            html += `<div style="margin-bottom: 15px;">`;
            html += `<label style="display: block; margin-bottom: 5px; color: #cccccc;">From Token:</label>`;
            html += `<div class="custom-dropdown" style="position: relative; width: 100%;">`;
            html += `<div class="dropdown-header" id="eclipseFromTokenHeader" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #111; color: #fff; border: 1px solid #333; border-radius: 3px; cursor: pointer;">`;
            html += `<span id="eclipseFromTokenDisplay">🟢 ${defaultFromToken?.name || 'Ethereum'}</span>`;
            html += `<span style="color: #666;">▼</span>`;
            html += `</div>`;
            html += `<div class="dropdown-content" id="eclipseFromTokenDropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #111; border: 1px solid #333; border-top: none; border-radius: 0 0 3px 3px; max-height: 200px; overflow-y: auto; z-index: 1000;">`;
            tokens.forEach(token => {
                const sourceIcon = token.source === 'Solar' ? '🔵' : token.source === 'Deserialize' ? '🟠' : '🟢';
                html += `<div class="dropdown-item" data-value="${token.address}" data-symbol="${token.symbol}" data-decimals="${token.decimals}" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">`;
                html += `${sourceIcon} ${token.name}`;
                html += `</div>`;
            });
            html += `</div>`;
            html += `<input type="hidden" id="eclipseFromToken" value="${defaultFromToken?.address || ''}">`;
            html += `</div>`;
            html += `</div>`;
            
            // To token selection with custom dropdown
            html += `<div style="margin-bottom: 15px;">`;
            html += `<label style="display: block; margin-bottom: 5px; color: #cccccc;">To Token:</label>`;
            html += `<div class="custom-dropdown" style="position: relative; width: 100%;">`;
            html += `<div class="dropdown-header" id="eclipseToTokenHeader" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #111; color: #fff; border: 1px solid #333; border-radius: 3px; cursor: pointer;">`;
            html += `<span id="eclipseToTokenDisplay">🔵 ${defaultToToken?.name || 'SOLAR STUDIOS'}</span>`;
            html += `<span style="color: #666;">▼</span>`;
            html += `</div>`;
            html += `<div class="dropdown-content" id="eclipseToTokenDropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #111; border: 1px solid #333; border-top: none; border-radius: 0 0 3px 3px; max-height: 200px; overflow-y: auto; z-index: 1000;">`;
            tokens.forEach(token => {
                const sourceIcon = token.source === 'Solar' ? '🔵' : token.source === 'Deserialize' ? '🟠' : '🟢';
                html += `<div class="dropdown-item" data-value="${token.address}" data-symbol="${token.symbol}" data-decimals="${token.decimals}" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">`;
                html += `${sourceIcon} ${token.name}`;
                html += `</div>`;
            });
            html += `</div>`;
            html += `<input type="hidden" id="eclipseToToken" value="${defaultToToken?.address || ''}">`;
            html += `</div>`;
            html += `</div>`;
            
            // Amount input
            html += `<div style="margin-bottom: 15px;">`;
            html += `<label style="display: block; margin-bottom: 5px; color: #cccccc;">Amount:</label>`;
            html += `<input type="number" id="eclipseAmount" placeholder="Enter amount" step="0.000001" style="width: 100%; padding: 8px; background: #111; color: #fff; border: 1px solid #333; border-radius: 3px; box-sizing: border-box;">`;
            html += `</div>`;
            
            // Slippage selection with custom dropdown
            html += `<div style="margin-bottom: 15px;">`;
            html += `<label style="display: block; margin-bottom: 5px; color: #cccccc;">Slippage:</label>`;
            html += `<div class="custom-dropdown" style="position: relative; width: 100%;">`;
            html += `<div class="dropdown-header" id="eclipseSlippageHeader" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #111; color: #fff; border: 1px solid #333; border-radius: 3px; cursor: pointer;">`;
            html += `<span id="eclipseSlippageDisplay">1.0% (Standard)</span>`;
            html += `<span style="color: #666;">▼</span>`;
            html += `</div>`;
            html += `<div class="dropdown-content" id="eclipseSlippageDropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #111; border: 1px solid #333; border-top: none; border-radius: 0 0 3px 3px; max-height: 200px; overflow-y: auto; z-index: 1000;">`;
            html += `<div class="dropdown-item" data-value="50" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">0.5% (Conservative)</div>`;
            html += `<div class="dropdown-item" data-value="100" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">1.0% (Standard)</div>`;
            html += `<div class="dropdown-item" data-value="200" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">2.0% (Aggressive)</div>`;
            html += `<div class="dropdown-item" data-value="500" style="padding: 8px; cursor: pointer; border-bottom: 1px solid #333; color: #fff;">5.0% (High Risk)</div>`;
            html += `</div>`;
            html += `<input type="hidden" id="eclipseSlippage" value="100">`;
            html += `</div>`;
            html += `</div>`;
            
            // Quote display section
            html += `<div id="eclipseQuoteDisplay" style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid #333; border-radius: 3px; display: none;">`;
            html += `<div style="font-size: 12px; color: #999; margin-bottom: 5px;">Estimated Output:</div>`;
            html += `<div id="eclipseQuoteAmount" style="font-size: 16px; color: #fff; font-weight: bold;"></div>`;
            html += `<div id="eclipseQuotePrice" style="font-size: 12px; color: #999; margin-top: 3px;"></div>`;
            html += `</div>`;
            
            // Swap button
            html += `<button id="eclipseSwapBtn" style="width: 100%; padding: 12px; background: linear-gradient(45deg, #00ff41, #00cc33); color: black; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 10px; box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);">🔄 Execute Swap</button>`;
            
            // Info section
            html += `<div style="font-size: 12px; color: #999; line-height: 1.4;">`;
            html += `<p><strong>Smart Routing:</strong> Automatically uses Solar DEX for SOLAR token, Deserialize Aggregator for others.</p>`;
            html += `</div>`;
            
            html += `</div>`;
            
            terminal.logHtml(html, 'output');
            
            // Add event listeners for custom dropdowns
            setTimeout(() => {
                this.setupEclipseDropdowns();
                const swapBtn = document.getElementById('eclipseSwapBtn');
                if (swapBtn) {
                    swapBtn.addEventListener('click', () => this.executeEclipseSwapFromInterface(terminal));
                }
            }, 100);
            
        } catch (error) {
            terminal.log(`❌ Failed to load swap interface: ${error.message}`, 'error');
        }
    },

    // Setup dropdown event handlers
    setupEclipseDropdowns: function() {
        // From token dropdown
        const fromHeader = document.getElementById('eclipseFromTokenHeader');
        const fromDropdown = document.getElementById('eclipseFromTokenDropdown');
        const fromDisplay = document.getElementById('eclipseFromTokenDisplay');
        const fromInput = document.getElementById('eclipseFromToken');
        
        if (fromHeader && fromDropdown) {
            fromHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                fromDropdown.style.display = fromDropdown.style.display === 'none' ? 'block' : 'none';
                // Hide other dropdowns
                const toDropdown = document.getElementById('eclipseToTokenDropdown');
                const slippageDropdown = document.getElementById('eclipseSlippageDropdown');
                if (toDropdown) toDropdown.style.display = 'none';
                if (slippageDropdown) slippageDropdown.style.display = 'none';
            });
            
            fromDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fromInput.value = item.dataset.value;
                    fromDisplay.textContent = item.textContent;
                    fromDropdown.style.display = 'none';
                });
            });
        }
        
        // To token dropdown
        const toHeader = document.getElementById('eclipseToTokenHeader');
        const toDropdown = document.getElementById('eclipseToTokenDropdown');
        const toDisplay = document.getElementById('eclipseToTokenDisplay');
        const toInput = document.getElementById('eclipseToToken');
        
        if (toHeader && toDropdown) {
            toHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                toDropdown.style.display = toDropdown.style.display === 'none' ? 'block' : 'none';
                // Hide other dropdowns
                if (fromDropdown) fromDropdown.style.display = 'none';
                const slippageDropdown = document.getElementById('eclipseSlippageDropdown');
                if (slippageDropdown) slippageDropdown.style.display = 'none';
            });
            
            toDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toInput.value = item.dataset.value;
                    toDisplay.textContent = item.textContent;
                    toDropdown.style.display = 'none';
                });
            });
        }
        
        // Slippage dropdown
        const slippageHeader = document.getElementById('eclipseSlippageHeader');
        const slippageDropdown = document.getElementById('eclipseSlippageDropdown');
        const slippageDisplay = document.getElementById('eclipseSlippageDisplay');
        const slippageInput = document.getElementById('eclipseSlippage');
        
        if (slippageHeader && slippageDropdown) {
            slippageHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                slippageDropdown.style.display = slippageDropdown.style.display === 'none' ? 'block' : 'none';
                // Hide other dropdowns
                if (fromDropdown) fromDropdown.style.display = 'none';
                if (toDropdown) toDropdown.style.display = 'none';
            });
            
            slippageDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    slippageInput.value = item.dataset.value;
                    slippageDisplay.textContent = item.textContent;
                    slippageDropdown.style.display = 'none';
                });
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            if (fromDropdown) fromDropdown.style.display = 'none';
            if (toDropdown) toDropdown.style.display = 'none';
            if (slippageDropdown) slippageDropdown.style.display = 'none';
        });
    },

    // Execute swap from interface
    executeEclipseSwapFromInterface: async function(terminal) {
        try {
            const fromMint = document.getElementById('eclipseFromToken').value;
            const toMint = document.getElementById('eclipseToToken').value;
            const amount = document.getElementById('eclipseAmount').value;
            const slippageBps = document.getElementById('eclipseSlippage').value;
            
            if (!fromMint || !toMint || !amount || !slippageBps) {
                terminal.log('❌ Please fill in all fields', 'error');
                return;
            }
            
            if (parseFloat(amount) <= 0) {
                terminal.log('❌ Amount must be greater than 0', 'error');
                return;
            }
            
            await this.executeSwap(terminal, amount, fromMint, toMint, slippageBps);
            
        } catch (error) {
            terminal.log(`❌ Swap interface error: ${error.message}`, 'error');
        }
    },

    // Execute swap with smart routing (original logic)
    executeSwap: async function(terminal, amount, fromMint, toMint, slippageBps) {
        try {
            if (!window.eclipseWallet || !window.eclipseWallet.keypair) {
                terminal.log('❌ Eclipse wallet not connected. Use "eclipse connect" first.', 'error');
                return;
            }
            
            terminal.log('🔄 Executing Eclipse swap...', 'info');
            
            // Smart routing: Solar DEX for SOLAR token, Deserialize for others
            const useSolarDex = fromMint === this.SOLAR_TOKEN_ADDRESS || toMint === this.SOLAR_TOKEN_ADDRESS;
            const dexName = useSolarDex ? 'Solar DEX' : 'Deserialize Aggregator';
            
            terminal.log(`📈 Using ${dexName} for this swap`, 'info');
            
            if (useSolarDex) {
                await this.executeSolarSwap(terminal, fromMint, toMint, amount, slippageBps);
            } else {
                await this.executeDeserializeSwap(terminal, fromMint, toMint, amount, slippageBps);
            }
            
        } catch (error) {
            terminal.log(`❌ Swap failed: ${error.message}`, 'error');
        }
    },

    // Execute Solar DEX swap (original implementation)
    executeSolarSwap: async function(terminal, inputMint, outputMint, amount, slippageBps) {
        try {
            // Step 1: Get quote using GET request with query parameters
            terminal.log('Getting Solar DEX quote...', 'info');
            
            // Ensure we have the correct SOL mint address
            const solMintAddress = 'So11111111111111111111111111111111111111112';
            const actualInputMint = inputMint === '11111111111111111111111111111111' ? solMintAddress : inputMint;
            const actualOutputMint = outputMint === '11111111111111111111111111111111' ? solMintAddress : outputMint;
            
            // Convert amount to proper decimals (assuming 9 decimals for most tokens)
            const amountInDecimals = parseFloat(amount) * 1e9;
            
            // Build query parameters
            const queryParams = new URLSearchParams({
                inputMint: actualInputMint,
                outputMint: actualOutputMint,
                amount: amountInDecimals.toString(),
                slippageBps: slippageBps.toString(),
                txVersion: 'LEGACY'
            });
            
            const quoteResponse = await fetch(`https://api.solarstudios.co/compute/swap-base-in?${queryParams.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!quoteResponse.ok) {
                throw new Error('Solar quote failed');
            }
            
            const quoteData = await quoteResponse.json();
            
            if (!quoteData.success) {
                throw new Error('Solar quote failed');
            }
            
            // Step 2: Get transaction using the quote response
            terminal.log('Getting Solar transaction...', 'info');
            
            const transactionPayload = {
                computeUnitPriceMicroLamports: String(300000),
                swapResponse: quoteData,
                txVersion: 'LEGACY',
                wallet: window.eclipseWallet.keypair.publicKey.toString(),
                wrapSol: actualInputMint === solMintAddress,
                unwrapSol: actualOutputMint === solMintAddress,
                inputAccount: window.eclipseWallet.keypair.publicKey.toString(),
                outputAccount: window.eclipseWallet.keypair.publicKey.toString()
            };
            
            const txResponse = await fetch('https://api.solarstudios.co/transaction/swap-base-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionPayload)
            });
            
            if (!txResponse.ok) {
                throw new Error('Solar transaction failed');
            }
            
            const txData = await txResponse.json();
            
            if (!txData.success) {
                throw new Error('Solar transaction failed');
            }
            
            // Step 3: Sign and send transactions
            terminal.log('Signing and sending transactions...', 'info');
            
            const connection = new window.solanaWeb3.Connection(this.ECLIPSE_RPC_URL, 'confirmed');
            
            // Handle multiple transactions
            const allTxBuf = txData.data.map(tx => Buffer.from(tx.transaction, 'base64'));
            const allTransactions = allTxBuf.map(txBuf => window.solanaWeb3.Transaction.from(txBuf));
            
            terminal.log(`Total ${allTransactions.length} transactions to process`, 'info');
            
            for (let idx = 0; idx < allTransactions.length; idx++) {
                const transaction = allTransactions[idx];
                
                // Add blockhash
                const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                
                // Sign the transaction
                transaction.sign(window.eclipseWallet.keypair);
                
                // Serialize and send
                const txId = await connection.sendRawTransaction(transaction.serialize(), {
                    skipPreflight: false,
                });
                
                terminal.log(`Transaction ${idx + 1} sent: ${txId}`, 'info');
                
                await connection.confirmTransaction({
                    blockhash,
                    lastValidBlockHeight,
                    signature: txId,
                }, 'confirmed');
                
                terminal.log(`✅ Solar swap completed successfully!`, 'success');
                terminal.logHtml(`🔍 <a href="https://explorer.eclipse.xyz/tx/${txId}" target="_blank">View transaction on Eclipse Explorer</a>`, 'info');
                return;
            }
            
        } catch (error) {
            terminal.log(`❌ Solar swap failed: ${error.message}`, 'error');
        }
    },

    // Execute Deserialize swap (original implementation)
    executeDeserializeSwap: async function(terminal, inputMint, outputMint, amount, slippageBps) {
        try {
            terminal.log('Getting Deserialize quote...', 'info');
            
            const amountInDecimals = parseFloat(amount) * 1e9;
            
            const quoteResponse = await fetch('https://api.deserialize.xyz/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputMint: inputMint,
                    outputMint: outputMint,
                    amount: amountInDecimals.toString(),
                    slippageBps: parseInt(slippageBps)
                })
            });
            
            if (!quoteResponse.ok) {
                throw new Error('Deserialize quote failed');
            }
            
            const quoteData = await quoteResponse.json();
            
            terminal.log('Getting Deserialize transaction...', 'info');
            
            const txResponse = await fetch('https://api.deserialize.xyz/swap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...quoteData,
                    wallet: window.eclipseWallet.keypair.publicKey.toString()
                })
            });
            
            if (!txResponse.ok) {
                throw new Error('Deserialize transaction failed');
            }
            
            const txData = await txResponse.json();
            
            terminal.log('Deserialize transaction received, signing...', 'info');
            
            const connection = new window.solanaWeb3.Connection(this.ECLIPSE_RPC_URL, 'confirmed');
            
            // Try to deserialize as a regular transaction first
            let transaction;
            try {
                transaction = window.solanaWeb3.Transaction.from(Buffer.from(txData.transaction, 'base64'));
            } catch (e) {
                // Try versioned transaction format
                transaction = window.solanaWeb3.VersionedTransaction.deserialize(Buffer.from(txData.transaction, 'base64'));
            }
            
            // Sign and send
            if (transaction.sign) {
                transaction.sign([window.eclipseWallet.keypair]);
            } else {
                transaction.partialSign(window.eclipseWallet.keypair);
            }
            
            const signature = await connection.sendRawTransaction(transaction.serialize());
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            
            if (confirmation.value.err) {
                throw new Error('Deserialize transaction failed');
            }
            
            terminal.log(`✅ Deserialize swap completed successfully!`, 'success');
            terminal.logHtml(`🔍 <a href="https://explorer.eclipse.xyz/tx/${signature}" target="_blank">View transaction on Eclipse Explorer</a>`, 'info');
            
        } catch (error) {
            terminal.log(`❌ Deserialize swap failed: ${error.message}`, 'error');
        }
    },

    // Connect Eclipse wallet (Phantom compatibility)
    connectEclipse: async function(terminal) {
        try {
            if (typeof window.solana === 'undefined') {
                terminal.log('❌ Eclipse-compatible wallet not found. Eclipse uses Solana-compatible wallets.', 'error');
                terminal.logHtml('🔗 <a href="https://phantom.app" target="_blank">Download Phantom Wallet</a>', 'info');
                return;
            }

            terminal.log('💫 Connecting to Eclipse via Phantom wallet...', 'info');
            const response = await window.solana.connect();
            
            if (response && response.publicKey) {
                terminal.log('✅ Eclipse wallet connected successfully!', 'success');
                terminal.log(`📍 Eclipse Address: ${response.publicKey.toString()}`, 'info');
                terminal.log('🌐 Network: Eclipse Mainnet', 'info');
                
                // Store for later use with keypair simulation (for demo purposes)
                window.eclipseWallet = {
                    publicKey: response.publicKey,
                    keypair: response, // In real implementation, this would be handled differently
                    connected: true,
                    rpcUrl: this.ECLIPSE_RPC_URL
                };
                
                await this.checkBalance(terminal);
            } else {
                terminal.log('❌ Failed to connect to Eclipse wallet', 'error');
            }
        } catch (error) {
            terminal.log(`❌ Eclipse connection failed: ${error.message}`, 'error');
        }
    },

    // Generate Eclipse wallet
    generateWallet: async function(terminal) {
        try {
            if (!window.solanaWeb3) {
                terminal.log('❌ Solana Web3 not available', 'error');
                return;
            }

            terminal.log('🔄 Generating Eclipse wallet...', 'info');
            
            const keypair = window.solanaWeb3.Keypair.generate();
            const publicKey = keypair.publicKey.toString();
            const privateKey = Array.from(keypair.secretKey).map(b => b.toString(16).padStart(2, '0')).join('');
            
            let html = `<b>✅ New Eclipse Wallet Generated!</b><br>`;
            html += `<span style='color:#ff3333'>⚠️ SECURITY WARNING: Save your private key securely!</span><br><br>`;
            html += `<b>Public Key:</b> <span class='copyable' onclick="navigator.clipboard.writeText('${publicKey}').then(() => window.terminal.log('✅ Public key copied!', 'success'))">${publicKey}</span><br>`;
            html += `<b>Private Key:</b> <span class='copyable' onclick="navigator.clipboard.writeText('${privateKey}').then(() => window.terminal.log('✅ Private key copied!', 'success'))">${privateKey}</span><br>`;
            html += `<b>Network:</b> Eclipse Mainnet<br>`;
            html += `<b>RPC URL:</b> ${this.ECLIPSE_RPC_URL}<br><br>`;
            html += `💡 <b>Next Steps:</b><br>`;
            html += `1. Save your private key in a secure location<br>`;
            html += `2. Send Eclipse ETH to your public key to fund the wallet<br>`;
            html += `3. Use "eclipse connect" to connect with Phantom<br><br>`;
            
            terminal.logHtml(html, 'output');
            
            // Store for use
            window.eclipseWallet = {
                publicKey: keypair.publicKey,
                keypair: keypair,
                connected: true,
                rpcUrl: this.ECLIPSE_RPC_URL
            };
            
        } catch (error) {
            terminal.log(`❌ Wallet generation failed: ${error.message}`, 'error');
        }
    },

    // Check Eclipse balance
    checkBalance: async function(terminal) {
        try {
            if (!window.eclipseWallet || !window.eclipseWallet.publicKey) {
                terminal.log('❌ Eclipse wallet not connected', 'error');
                return;
            }

            terminal.log('🔄 Checking Eclipse balance...', 'info');
            
            const connection = new window.solanaWeb3.Connection(this.ECLIPSE_RPC_URL);
            const balance = await connection.getBalance(window.eclipseWallet.publicKey);
            const balanceInEth = balance / 1e9; // Eclipse uses 9 decimals like SOL
            
            terminal.log(`💰 Eclipse Balance: ${balanceInEth.toFixed(6)} ETH`, 'success');
            terminal.log(`📍 Address: ${window.eclipseWallet.publicKey.toString()}`, 'info');
            
        } catch (error) {
            terminal.log(`❌ Balance check failed: ${error.message}`, 'error');
        }
    }

}; 