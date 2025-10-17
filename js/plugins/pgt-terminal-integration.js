/**
 * PGT Terminal Integration for Omega Terminal
 * Uses localStorage + blockchain APIs (like PGT frontend)
 * Fetches real-time data directly from Etherscan/Covalent APIs
 */

(function() {
    'use strict';
    
    console.log('🎯 Loading PGT Terminal Integration (LocalStorage + Blockchain APIs)...');
    
    class PGTTerminalIntegration {
        constructor() {
            this.ready = true;
            this.wallets = [];
            this.etherscanApiKey = 'RTQXU4BP3IKG1T169R379DDXX83VIZ4UH1'; // Public key from PGT
            this.init();
        }

        init() {
            console.log('🔧 PGT Integration initialized (Direct blockchain fetching)');
            console.log('✅ PGT Integration ready immediately');
            
            // Load wallets from localStorage
            this.loadWallets();
            
            // Fire ready event immediately
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('pgt-ready'));
                this.updateConnectionStatus(true);
                
                console.log('🎯 PGT Commands Available:');
                console.log('   • pgt track <address>');
                console.log('   • pgt portfolio');
                console.log('   • pgt wallets');
                console.log('   • pgt remove <address>');
                
                // Initial refresh
                if (this.wallets.length > 0) {
                    this.refreshPortfolioStats();
                }
            }, 100);
        }

        loadWallets() {
            try {
                const saved = localStorage.getItem('omega-pgt-wallets');
                if (saved) {
                    this.wallets = JSON.parse(saved);
                    console.log(`📂 Loaded ${this.wallets.length} wallets from localStorage`);
                } else {
                    this.wallets = [];
                }
            } catch (error) {
                console.error('Error loading wallets:', error);
                this.wallets = [];
            }
        }

        saveWallets() {
            try {
                localStorage.setItem('omega-pgt-wallets', JSON.stringify(this.wallets));
                console.log(`💾 Saved ${this.wallets.length} wallets to localStorage`);
            } catch (error) {
                console.error('Error saving wallets:', error);
            }
        }

        updateConnectionStatus(connected) {
            if (window.terminal && window.terminal.log) {
                if (connected) {
                    // Silent initialization - users can discover with "pgt help"
                    console.log('✅ PGT Portfolio Tracker ready');
                    // window.terminal.log('✅ PGT Portfolio Tracker ready', 'success');
                    // window.terminal.log('📊 Use "pgt help" to see available commands', 'info');
                }
            }
        }

        async fetchEthereumBalance(address) {
            try {
                console.log(`🔍 Fetching Ethereum balance for ${address}...`);
                
                // Get ETH price from CoinGecko
                const priceResp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
                const priceData = await priceResp.json();
                const ethPrice = priceData.ethereum?.usd || 0;
                const ethChange24h = priceData.ethereum?.usd_24h_change || 0;
                
                if (ethPrice === 0) {
                    throw new Error('Failed to fetch ETH price from CoinGecko');
                }
                
                console.log(`💰 Current ETH price: $${ethPrice}`);
                
                let ethBalance = 0;
                
                // Use ethers.js with public RPC providers (already loaded in index.html)
                if (typeof ethers !== 'undefined') {
                    try {
                        console.log('🔗 Using ethers.js with public Ethereum RPC...');
                        
                        // Try multiple public RPC endpoints
                        const rpcEndpoints = [
                            'https://eth.llamarpc.com',
                            'https://rpc.ankr.com/eth',
                            'https://ethereum.publicnode.com',
                            'https://eth-mainnet.public.blastapi.io'
                        ];
                        
                        for (const rpcUrl of rpcEndpoints) {
                            try {
                                console.log(`🔗 Attempting to connect to: ${rpcUrl}`);
                                const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
                                
                                console.log(`📡 Calling getBalance for ${address}...`);
                                const balance = await provider.getBalance(address);
                                console.log(`📦 Raw balance response:`, balance.toString());
                                
                                ethBalance = parseFloat(ethers.utils.formatEther(balance));
                                console.log(`💰 Formatted balance: ${ethBalance} ETH`);
                                
                                if (ethBalance >= 0) {
                                    console.log(`✅ SUCCESS! Got balance from ${rpcUrl}: ${ethBalance} ETH`);
                                    break;
                                } else {
                                    console.log(`⚠️ ${rpcUrl} returned negative balance, trying next...`);
                                }
                            } catch (rpcError) {
                                console.error(`❌ ${rpcUrl} failed:`, rpcError);
                                console.error(`   Error message:`, rpcError.message);
                                console.error(`   Error code:`, rpcError.code);
                                continue;
                            }
                        }
                        
                        // ethBalance of 0 is valid (empty wallet)
                    } catch (ethersError) {
                        console.error('❌ Ethers.js failed:', ethersError.message);
                        throw ethersError;
                    }
                } else {
                    console.error('❌ ethers.js not available');
                    throw new Error('ethers.js library not loaded');
                }
                
                const totalValue = ethBalance * ethPrice;
                const change24h = totalValue * (ethChange24h / 100);
                
                console.log(`✅ Ethereum portfolio calculated:`, {
                    balance: `${ethBalance} ETH`,
                    price: `$${ethPrice}`,
                    totalValue: `$${totalValue.toFixed(2)}`,
                    change24h: `${ethChange24h.toFixed(2)}%`
                });
                
                return {
                    totalValue,
                    change24h,
                    change24hPercent: ethChange24h,
                    tokens: [{
                        symbol: 'ETH',
                        balance: ethBalance,
                        value: totalValue,
                        price: ethPrice
                    }]
                };
            } catch (error) {
                console.error('❌ Error fetching Ethereum data:', error);
                throw error; // Don't return demo data, let it fail
            }
        }

        async fetchSolanaBalance(address) {
            try {
                console.log(`🔍 Fetching Solana balance for ${address}...`);
                
                // Use Solana RPC
                const response = await fetch('https://api.mainnet-beta.solana.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getBalance',
                        params: [address]
                    })
                });
                
                const data = await response.json();
                const solBalance = data.result?.value ? data.result.value / 1e9 : 0;
                
                // Get SOL price
                const priceResp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true');
                const priceData = await priceResp.json();
                const solPrice = priceData.solana.usd;
                const solChange24h = priceData.solana.usd_24h_change || 0;
                
                const totalValue = solBalance * solPrice;
                const change24h = totalValue * (solChange24h / 100);
                
                console.log(`✅ Solana data:`, {
                    balance: solBalance,
                    price: solPrice,
                    totalValue,
                    change24h
                });
                
                return {
                    totalValue,
                    change24h,
                    change24hPercent: solChange24h,
                    tokens: [{
                        symbol: 'SOL',
                        balance: solBalance,
                        value: totalValue,
                        price: solPrice
                    }]
                };
            } catch (error) {
                console.error('Error fetching Solana data:', error);
                return {
                    totalValue: 0,
                    change24h: 0,
                    change24hPercent: 0,
                    tokens: []
                };
            }
        }

        async addWallet(address, network, label) {
            try {
                console.log(`📡 Adding wallet ${address} on ${network}...`);
                
                // Check if already tracked
                const existing = this.wallets.find(w => 
                    w.address.toLowerCase() === address.toLowerCase() && 
                    w.network.toLowerCase() === network.toLowerCase()
                );
                
                if (existing) {
                    console.log('ℹ️ Wallet already tracked, refreshing data...');
                    // Refresh existing wallet
                    const data = await this.fetchWalletData(address, network);
                    existing.totalValue = data.totalValue;
                    existing.change24h = data.change24h;
                    existing.change24hPercent = data.change24hPercent;
                    existing.tokens = data.tokens;
                    existing.lastUpdated = new Date().toISOString();
                    this.saveWallets();
                    this.refreshPortfolioStats();
                    
                    return {
                        success: true,
                        data: { 
                            wallet: existing,
                            message: 'Wallet data refreshed'
                        },
                        timestamp: Date.now()
                    };
                }
                
                // Fetch blockchain data
                console.log('🔍 Fetching fresh blockchain data...');
                const data = await this.fetchWalletData(address, network);
                
                console.log('💾 Creating wallet entry with data:', data);
                
                // Create wallet object
                const wallet = {
                    address,
                    network: network.toLowerCase(),
                    label: label || `${network} Wallet`,
                    totalValue: data.totalValue,
                    change24h: data.change24h,
                    change24hPercent: data.change24hPercent,
                    tokens: data.tokens,
                    addedAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
                
                console.log('📦 Wallet object created:', wallet);
                
                this.wallets.push(wallet);
                this.saveWallets();
                
                // Refresh stats panel immediately
                setTimeout(() => {
                    this.refreshPortfolioStats();
                }, 500);
                
                return {
                    success: true,
                    data: { 
                        wallet,
                        message: 'Wallet added successfully'
                    },
                    timestamp: Date.now()
                };
            } catch (error) {
                console.error('❌ Error adding wallet:', error);
                return {
                    success: false,
                    error: `Failed to fetch wallet data: ${error.message}. Please try again or check if the address is correct.`,
                    timestamp: Date.now()
                };
            }
        }

        async fetchWalletData(address, network) {
            if (network === 'ethereum' || network === 'eth') {
                return await this.fetchEthereumBalance(address);
            } else if (network === 'solana' || network === 'sol') {
                return await this.fetchSolanaBalance(address);
            } else {
                // Default to ethereum for other EVM chains
                return await this.fetchEthereumBalance(address);
            }
        }

        async getPortfolio() {
            // Calculate from local wallets
            let totalValue = 0;
            let totalChange24h = 0;
            const networks = new Set();
            
            this.wallets.forEach(w => {
                totalValue += w.totalValue || 0;
                totalChange24h += w.change24h || 0;
                networks.add(w.network);
            });
            
            const totalChange24hPercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;
            
            return {
                success: true,
                data: {
                    totalValue,
                    totalChange24h,
                    totalChange24hPercent,
                    walletCount: this.wallets.length,
                    networks: Array.from(networks),
                    wallets: this.wallets.map(w => ({
                        address: w.address,
                        network: w.network,
                        label: w.label,
                        totalValue: w.totalValue,
                        change24h: w.change24h,
                        change24hPercent: w.change24hPercent,
                        lastUpdated: w.lastUpdated
                    }))
                },
                timestamp: Date.now()
            };
        }

        async getWallets() {
            return {
                success: true,
                data: this.wallets,
                timestamp: Date.now()
            };
        }

        async removeWallet(address, network) {
            this.wallets = this.wallets.filter(w => 
                !(w.address.toLowerCase() === address.toLowerCase() && 
                  w.network.toLowerCase() === network.toLowerCase())
            );
            this.saveWallets();
            this.refreshPortfolioStats();
            
            return {
                success: true,
                data: { message: 'Wallet removed' },
                timestamp: Date.now()
            };
        }

        async getWallet(address, network) {
            const wallet = this.wallets.find(w => 
                w.address.toLowerCase() === address.toLowerCase() && 
                w.network.toLowerCase() === network.toLowerCase()
            );
            
            if (wallet) {
                return {
                    success: true,
                    data: wallet,
                    timestamp: Date.now()
                };
            }
            
            return {
                success: false,
                error: 'Wallet not found',
                timestamp: Date.now()
            };
        }

        async refreshPortfolioStats() {
            console.log('🔄 Refreshing portfolio stats...');
            
            try {
                const portfolio = await this.getPortfolio();
                console.log('📊 Portfolio data for stats:', portfolio);
                
                if (portfolio.success && portfolio.data) {
                    const { totalValue, totalChange24hPercent, walletCount } = portfolio.data;
                    
                    console.log('📈 Portfolio Values:', {
                        totalValue,
                        totalChange24hPercent,
                        walletCount
                    });
                    
                    // Update stats panel
                    const statsPanel = document.getElementById('pgt-stats-panel');
                    
                    if (walletCount > 0) {
                        console.log('✅ Showing stats panel with data');
                        if (statsPanel) statsPanel.style.display = 'flex';
                        
                        const totalValueEl = document.getElementById('pgt-total-value');
                        const change24hEl = document.getElementById('pgt-24h-change');
                        const walletCountEl = document.getElementById('pgt-wallet-count');
                        
                        if (totalValueEl) {
                            const valueText = `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                            totalValueEl.textContent = valueText;
                            console.log('💰 Updated total value:', valueText);
                        }
                        
                        if (change24hEl) {
                            const changePercent = totalChange24hPercent || 0;
                            const changeText = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
                            change24hEl.textContent = changeText;
                            
                            // Update color class for styling
                            if (changePercent >= 0) {
                                change24hEl.classList.add('positive');
                                change24hEl.classList.remove('negative');
                            } else {
                                change24hEl.classList.add('negative');
                                change24hEl.classList.remove('positive');
                            }
                            console.log('📊 Updated 24h change:', changeText);
                        }
                        
                        if (walletCountEl) {
                            walletCountEl.textContent = walletCount.toString();
                            console.log('👛 Updated wallet count:', walletCount);
                        }
                        
                        console.log('✅ Stats panel updated successfully');
                    } else {
                        console.log('ℹ️ No wallets tracked, hiding stats panel');
                        if (statsPanel) statsPanel.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('❌ Error refreshing portfolio stats:', error);
            }
        }

        async healthCheck() {
            return {
                success: true,
                data: {
                    status: 'operational',
                    mode: 'localStorage + blockchain APIs',
                    walletsTracked: this.wallets.length
                },
                timestamp: Date.now()
            };
        }
    }

    // Global instance
    window.PGT = new PGTTerminalIntegration();

    // Listen for ready event
    window.addEventListener('pgt-ready', () => {
        console.log('🎯 PGT ready - Direct blockchain fetching mode');
        console.log('💾 Storage: localStorage');
        console.log('🔗 APIs: Etherscan + CoinGecko + Solana RPC');
        
        // Test connection
        if (window.PGT) {
            window.PGT.healthCheck().then(result => {
                console.log('✅ PGT health check:', result.data);
            });
            
            // Initial stats refresh
            window.PGT.refreshPortfolioStats();
            
            // Refresh stats every 60 seconds (to fetch live prices)
            setInterval(() => {
                console.log('🔄 Auto-refreshing portfolio data...');
                // Refresh all wallet balances
                window.PGT.wallets.forEach(async (wallet) => {
                    const freshData = await window.PGT.fetchWalletData(wallet.address, wallet.network);
                    wallet.totalValue = freshData.totalValue;
                    wallet.change24hPercent = freshData.change24hPercent;
                    wallet.tokens = freshData.tokens;
                    wallet.lastUpdated = new Date().toISOString();
                });
                window.PGT.saveWallets();
                window.PGT.refreshPortfolioStats();
            }, 60000);
        }
    });
    
})();


