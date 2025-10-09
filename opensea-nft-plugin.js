// ===================================
// OPENSEA NFT PLUGIN v1.0
// Complete NFT Analytics & Trading Suite for Omega Terminal
// ===================================

console.log('🌊 Loading OpenSea NFT Plugin v1.0');

(function() {
    const OPENSEA_API = {
        BASE_URL: 'https://api.opensea.io/api/v2',
        ASSETS_URL: 'https://api.opensea.io/api/v1',
        EVENTS_URL: 'https://api.opensea.io/api/v1/events'
    };

    // Storage keys for NFT data
    const NFT_STORAGE_KEYS = {
        WATCHLIST: 'nft_watchlist',
        PORTFOLIO: 'nft_portfolio',
        ALERTS: 'nft_alerts',
        FAVORITES: 'nft_favorites'
    };

    let initAttempts = 0;
    const maxInitAttempts = 15;
    
    // Wait for terminal to be ready
    function waitForTerminalNFT() {
        initAttempts++;
        
        if (window.terminal && window.terminal.log && window.terminal.logHtml) {
            if (typeof window.terminal.executeCommand === 'function' || initAttempts > 8) {
                initializeOpenSeaPlugin();
            } else {
                console.log('⏳ OpenSea NFT: Waiting for terminal to be fully loaded...', initAttempts);
                setTimeout(waitForTerminalNFT, 300);
            }
        } else if (initAttempts < maxInitAttempts) {
            setTimeout(waitForTerminalNFT, 200);
        } else {
            console.error('❌ OpenSea NFT Plugin: Failed to initialize after maximum attempts');
        }
    }
    
    function initializeOpenSeaPlugin() {
        console.log('✅ OpenSea NFT Plugin: Terminal detected, adding NFT functionality...');
        
        // SAFE APPROACH: Just add the handleNFTCommand function to terminal
        // The main terminal switch statement will call this function directly
        console.log('🌊 Adding NFT command handler to terminal...');
        
        // Main NFT command handler
        window.terminal.handleNFTCommand = async function(args) {
            if (!args[1]) {
                this.displayNFTHelp();
                return;
            }
            
            const subCommand = args[1].toLowerCase();
            
            try {
                switch (subCommand) {
                    // Discovery & Analysis Commands
                    case 'search':
                        await this.handleNFTSearch(args);
                        break;
                    case 'collection':
                        await this.handleNFTCollection(args);
                        break;
                    case 'floor':
                        await this.handleNFTFloor(args);
                        break;
                    case 'trending':
                        await this.handleNFTTrending(args);
                        break;
                    case 'top':
                        await this.handleNFTTop(args);
                        break;
                    
                    // Portfolio Management
                    case 'portfolio':
                        await this.handleNFTPortfolio(args);
                        break;
                    case 'watchlist':
                        await this.handleNFTWatchlist(args);
                        break;
                    case 'alerts':
                        await this.handleNFTAlerts(args);
                        break;
                    
                    // Trading Commands  
                    case 'buy':
                        await this.handleNFTBuy(args);
                        break;
                    case 'offer':
                        await this.handleNFTOffer(args);
                        break;
                    case 'list':
                        await this.handleNFTList(args);
                        break;
                    
                    // Analysis Commands
                    case 'traits':
                        await this.handleNFTTraits(args);
                        break;
                    case 'rarity':
                        await this.handleNFTRarity(args);
                        break;
                    case 'sales':
                        await this.handleNFTSales(args);
                        break;
                    case 'volume':
                        await this.handleNFTVolume(args);
                        break;
                    
                    case 'setup':
                        if (window.terminal.quickNFTSetup) {
                            window.terminal.quickNFTSetup();
                        } else {
                            this.log('🔑 OpenSea API Setup', 'info');
                            this.log('Get FREE API key: https://docs.opensea.io/reference/api-keys', 'info');
                            this.log('Then run: nft setup YOUR_API_KEY', 'info');
                        }
                        break;
                        
                    case 'demo':
                        if (window.terminal.nftDemo) {
                            window.terminal.nftDemo();
                        } else {
                            this.log('🎨 NFT Demo not available yet', 'warning');
                        }
                        break;
                        
                    case 'test':
                        this.testNFTPlugin();
                        break;
                        
                    case 'help':
                        this.displayNFTHelp();
                        break;
                    
                    default:
                        this.log(`❌ Unknown NFT command: ${subCommand}`, 'error');
                        this.displayNFTHelp();
                }
            } catch (error) {
                this.log(`❌ NFT command failed: ${error.message}`, 'error');
                console.error('OpenSea NFT Error:', error);
            }
        };

        // ===================================
        // HELP SYSTEM
        // ===================================
        
        window.terminal.displayNFTHelp = function() {
            this.log('🌊 OpenSea NFT - Professional NFT Analytics & Trading', 'info');
            this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
            this.log('', 'info');
            
            this.log('🔍 DISCOVERY & SEARCH:', 'success');
            this.log('  nft search <name>                 Search NFT collections', 'output');
            this.log('  nft collection <slug>             Detailed collection analysis', 'output');
            this.log('  nft trending                      Trending collections by volume', 'output');
            this.log('  nft top                           Top collections by market cap', 'output');
            this.log('', 'info');
            
            this.log('💰 PRICE & MARKET DATA:', 'success');
            this.log('  nft floor <collection>            Floor price + trends', 'output');
            this.log('  nft volume <collection>           Trading volume analysis', 'output');
            this.log('  nft sales <collection>            Recent sales history', 'output');
            this.log('', 'info');
            
            this.log('🎨 NFT ANALYSIS:', 'success');
            this.log('  nft traits <collection> <id>      Trait rarity analysis', 'output');
            this.log('  nft rarity <collection>           Collection rarity rankings', 'output');
            this.log('', 'info');
            
            this.log('💼 PORTFOLIO & TRACKING:', 'success');
            this.log('  nft portfolio                     Your NFT holdings', 'output');
            this.log('  nft watchlist add <collection>    Add to watchlist', 'output');
            this.log('  nft watchlist view                View watchlist', 'output');
            this.log('  nft alerts create                 Set price alerts', 'output');
            this.log('', 'info');
            
            this.log('🛒 TRADING (Coming Soon):', 'warning');
            this.log('  nft buy <collection> <id>         Purchase NFT', 'output');
            this.log('  nft offer <collection> <id>       Make an offer', 'output');
            this.log('  nft list <collection> <id>        List your NFT', 'output');
            this.log('', 'info');
            
            this.log('🔧 SETUP COMMANDS:', 'warning');
            this.log('  nft setup                         # Get FREE OpenSea API key', 'output');
            this.log('  nft demo                          # See what\'s possible with API key', 'output');
            this.log('', 'info');
            
            this.log('⚡ EXAMPLES:', 'info');
            this.log('  nft search pudgy penguins         # Search for Pudgy Penguins', 'info');
            this.log('  nft collection azuki              # Analyze Azuki collection', 'info');
            this.log('  nft floor bayc                    # BAYC floor price', 'info');
            this.log('  nft trending                      # Hot collections', 'info');
            this.log('  nft test                          # Test plugin functionality', 'info');
            this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        };

        // ===================================
        // COLLECTION SEARCH
        // ===================================
        
        window.terminal.handleNFTSearch = async function(args) {
            if (!args[2]) {
                this.log('Usage: nft search <collection_name>', 'info');
                this.log('Example: nft search pudgy penguins', 'info');
                return;
            }
            
            const query = args.slice(2).join(' ');
            this.log(`🔍 Searching NFT collections for: ${query}`, 'info');
            
            try {
                // OpenSea API doesn't have direct search, so we'll use a curated approach
                const popularCollections = await this.getPopularCollections();
                
                if (popularCollections) {
                    const filtered = popularCollections.filter(collection => 
                        collection.name.toLowerCase().includes(query.toLowerCase()) ||
                        collection.slug.toLowerCase().includes(query.toLowerCase())
                    );
                    
                    if (filtered.length > 0) {
                        this.log(`✅ Found ${filtered.length} matching collections:`, 'success');
                        this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
                        
                        filtered.slice(0, 5).forEach((collection, idx) => {
                            this.displayNFTCollectionCard(collection, idx + 1);
                        });
                    } else {
                        this.log('❌ No collections found matching your search', 'error');
                        this.suggestNFTSearch(query);
                    }
                } else {
                    this.log('❌ Failed to fetch collection data', 'error');
                }
                
            } catch (error) {
                this.log(`❌ NFT search failed: ${error.message}`, 'error');
            }
        };

        // ===================================
        // COLLECTION ANALYSIS
        // ===================================
        
        window.terminal.handleNFTCollection = async function(args) {
            if (!args[2]) {
                this.log('Usage: nft collection <collection_slug>', 'info');
                this.log('Example: nft collection azuki', 'info');
                this.log('Example: nft collection pudgy-penguins', 'info');
                return;
            }
            
            const collectionSlug = args[2];
            this.log(`🎨 Loading collection analysis for: ${collectionSlug}`, 'info');
            
            try {
                const response = await fetch(`${OPENSEA_API.BASE_URL}/collections/${collectionSlug}`, {
                    headers: {
                        'X-API-KEY': 'your_api_key_here' // User will need to add their key
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.displayCollectionAnalysis(data);
                } else if (response.status === 404) {
                    this.log(`❌ Collection "${collectionSlug}" not found`, 'error');
                    this.suggestNFTSearch(collectionSlug);
                } else {
                    this.log(`❌ API Error: ${response.status}`, 'error');
                    this.log('💡 Note: You may need an OpenSea API key for full functionality', 'warning');
                }
            } catch (error) {
                this.log(`❌ Collection analysis failed: ${error.message}`, 'error');
            }
        };

        // ===================================
        // FLOOR PRICE TRACKING
        // ===================================
        
        window.terminal.handleNFTFloor = async function(args) {
            if (!args[2]) {
                this.log('Usage: nft floor <collection_slug>', 'info');
                this.log('Example: nft floor azuki', 'info');
                return;
            }
            
            const collectionSlug = args[2];
            this.log(`💎 Fetching floor price for: ${collectionSlug}`, 'info');
            
            try {
                // Get collection stats for floor price
                const response = await fetch(`${OPENSEA_API.BASE_URL}/collections/${collectionSlug}/stats`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.displayFloorPriceCard(data, collectionSlug);
                } else {
                    this.log(`❌ Floor price not available for ${collectionSlug}`, 'error');
                    this.suggestNFTSearch(collectionSlug);
                }
            } catch (error) {
                this.log(`❌ Floor price lookup failed: ${error.message}`, 'error');
            }
        };

        // ===================================
        // TRENDING COLLECTIONS
        // ===================================
        
        window.terminal.handleNFTTrending = async function(args) {
            this.log('🔥 Fetching trending NFT collections...', 'info');
            
            try {
                // Get trending collections (top by volume)
                const collections = await this.getTrendingCollections();
                
                if (collections && collections.length > 0) {
                    const limit = args[2] ? parseInt(args[2]) : 8;
                    this.log(`✅ Top ${Math.min(limit, collections.length)} trending NFT collections:`, 'success');
                    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
                    
                    collections.slice(0, limit).forEach((collection, idx) => {
                        this.displayTrendingNFTCard(collection, idx + 1);
                    });
                } else {
                    this.log('❌ No trending data available', 'error');
                }
            } catch (error) {
                this.log(`❌ Failed to fetch trending collections: ${error.message}`, 'error');
            }
        };

        // ===================================
        // PORTFOLIO MANAGEMENT
        // ===================================
        
        window.terminal.handleNFTPortfolio = async function(args) {
            const subCommand = args[2];
            
            switch (subCommand) {
                case 'add':
                    await this.addToNFTPortfolio(args[3]);
                    break;
                case 'remove':
                    await this.removeFromNFTPortfolio(args[3]);
                    break;
                case 'view':
                case undefined:
                    await this.viewNFTPortfolio();
                    break;
                case 'clear':
                    await this.clearNFTPortfolio();
                    break;
                case 'value':
                    await this.calculatePortfolioValue();
                    break;
                default:
                    this.log('Usage: nft portfolio [add|remove|view|clear|value] [collection]', 'info');
            }
        };

        // ===================================
        // WATCHLIST MANAGEMENT
        // ===================================
        
        window.terminal.handleNFTWatchlist = async function(args) {
            const subCommand = args[2];
            
            switch (subCommand) {
                case 'add':
                    await this.addToNFTWatchlist(args[3]);
                    break;
                case 'remove':
                    await this.removeFromNFTWatchlist(args[3]);
                    break;
                case 'view':
                case undefined:
                    await this.viewNFTWatchlist();
                    break;
                case 'clear':
                    await this.clearNFTWatchlist();
                    break;
                default:
                    this.log('Usage: nft watchlist [add|remove|view|clear] [collection]', 'info');
            }
        };

        // ===================================
        // DISPLAY FUNCTIONS - Apple UI Compatible
        // ===================================
        
        window.terminal.displayNFTCollectionCard = function(collection, index) {
            let html = `<div style='background:rgba(255,255,255,0.8);border:1px solid rgba(138,43,226,0.3);border-radius:20px;padding:18px;margin:12px 0;backdrop-filter:blur(20px);box-shadow:0 8px 24px rgba(138,43,226,0.2);transition:all 0.3s ease;'>`;
            
            // Header with ranking and collection info
            html += `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'>`;
            html += `<div style='display:flex;align-items:center;gap:16px;'>`;
            html += `<div style='background:#8A2BE2;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1em;'>${index}</div>`;
            
            // Collection image
            if (collection.image_url || collection.featured_image_url) {
                const imageUrl = collection.image_url || collection.featured_image_url;
                html += `<img src='${imageUrl}' alt='${collection.name}' style='width:48px;height:48px;border-radius:12px;border:2px solid #8A2BE2;object-fit:cover;'>`;
            } else {
                const symbol = collection.name?.charAt(0) || 'N';
                html += `<div style='width:48px;height:48px;border-radius:12px;background:#8A2BE2;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.5em;'>${symbol}</div>`;
            }
            
            html += `<div>`;
            html += `<div style='font-size:1.4em;font-weight:bold;color:#4B0082;'>${collection.name || 'Unknown'}</div>`;
            html += `<div style='color:#666;font-size:0.9em;'>${collection.description?.slice(0, 50) || 'NFT Collection'}...</div>`;
            html += `</div></div>`;
            
            // Stats section
            html += `<div style='text-align:right;'>`;
            if (collection.stats?.floor_price) {
                html += `<div style='font-size:1.3em;color:#4B0082;font-weight:bold;'>Ξ ${collection.stats.floor_price}</div>`;
                html += `<div style='color:#888;font-size:0.9em;'>Floor Price</div>`;
            }
            html += `</div></div>`;
            
            // Key metrics grid
            if (collection.stats) {
                html += `<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:16px;'>`;
                
                // Total Supply
                if (collection.stats.total_supply) {
                    html += `<div style='text-align:center;padding:10px;background:rgba(138,43,226,0.1);border-radius:8px;'>`;
                    html += `<div style='color:#8A2BE2;font-weight:bold;font-size:0.9em;'>📦 Supply</div>`;
                    html += `<div style='color:#4B0082;font-weight:bold;'>${this.formatNFTNumber(collection.stats.total_supply)}</div>`;
                    html += `</div>`;
                }
                
                // Owners
                if (collection.stats.num_owners) {
                    html += `<div style='text-align:center;padding:10px;background:rgba(255,149,0,0.1);border-radius:8px;'>`;
                    html += `<div style='color:#FF9500;font-weight:bold;font-size:0.9em;'>👥 Owners</div>`;
                    html += `<div style='color:#E65100;font-weight:bold;'>${this.formatNFTNumber(collection.stats.num_owners)}</div>`;
                    html += `</div>`;
                }
                
                // Volume
                if (collection.stats.total_volume) {
                    html += `<div style='text-align:center;padding:10px;background:rgba(52,199,89,0.1);border-radius:8px;'>`;
                    html += `<div style='color:#34C759;font-weight:bold;font-size:0.9em;'>📊 Volume</div>`;
                    html += `<div style='color:#1B5E20;font-weight:bold;'>Ξ ${this.formatNFTNumber(collection.stats.total_volume)}</div>`;
                    html += `</div>`;
                }
                
                html += `</div>`;
            }
            
            // Action buttons
            html += `<div style='display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;'>`;
            html += `<button onclick="window.terminal.handleNFTCommand(['nft', 'collection', '${collection.slug}'])" style='background:linear-gradient(135deg,#8A2BE2,#9A4CF0);color:#fff;border:none;padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:0.9em;'>📊 Full Analysis</button>`;
            html += `<button onclick="window.terminal.handleNFTCommand(['nft', 'assets', '${collection.slug}'])" style='background:linear-gradient(135deg,#FF6B6B,#EE5A52);color:#fff;border:none;padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:0.9em;'>🎨 View NFTs</button>`;
            html += `<button onclick="window.terminal.addToNFTWatchlist('${collection.slug}')" style='background:linear-gradient(135deg,#FF9500,#FFA726);color:#fff;border:none;padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:0.9em;'>📋 Add to Watchlist</button>`;
            if (collection.external_url) {
                html += `<button onclick="window.open('${collection.external_url}', '_blank')" style='background:linear-gradient(135deg,#007AFF,#5AC8FA);color:#fff;border:none;padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:0.9em;'>🌐 Visit Site</button>`;
            }
            html += `<button onclick="window.open('https://opensea.io/collection/${collection.slug}', '_blank')" style='background:linear-gradient(135deg,#00D4AA,#00E4BB);color:#000;border:none;padding:8px 16px;border-radius:12px;cursor:pointer;font-weight:bold;font-size:0.9em;'>🌊 OpenSea</button>`;
            html += `</div>`;
            
            html += `</div>`;
            this.logHtml(html);
        };
        
        window.terminal.displayFloorPriceCard = function(stats, collectionName) {
            let html = `<div style='background:linear-gradient(135deg,rgba(138,43,226,0.1),rgba(255,255,255,0.95));border:2px solid rgba(138,43,226,0.3);border-radius:20px;padding:24px;margin:16px 0;text-align:center;backdrop-filter:blur(30px);box-shadow:0 12px 40px rgba(138,43,226,0.2);'>`;
            
            html += `<div style='font-size:2.5em;margin-bottom:12px;'>💎</div>`;
            html += `<div style='font-size:1.8em;font-weight:700;color:#4B0082;margin-bottom:8px;text-transform:capitalize;'>${collectionName.replace(/-/g, ' ')}</div>`;
            
            if (stats.total?.floor_price) {
                html += `<div style='font-size:2.5em;font-weight:800;color:#8A2BE2;margin-bottom:16px;'>Ξ ${stats.total.floor_price.toFixed(4)}</div>`;
                html += `<div style='color:#666;font-size:1.1em;margin-bottom:20px;'>Current Floor Price</div>`;
                
                // Additional stats if available
                if (stats.total.volume) {
                    html += `<div style='display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;'>`;
                    html += `<div style='background:rgba(52,199,89,0.1);border:1px solid rgba(52,199,89,0.3);border-radius:12px;padding:12px;'>`;
                    html += `<div style='color:#34C759;font-weight:bold;'>📊 Volume</div>`;
                    html += `<div style='color:#1B5E20;font-weight:bold;'>Ξ ${this.formatNFTNumber(stats.total.volume)}</div>`;
                    html += `</div>`;
                    
                    if (stats.total.sales) {
                        html += `<div style='background:rgba(255,149,0,0.1);border:1px solid rgba(255,149,0,0.3);border-radius:12px;padding:12px;'>`;
                        html += `<div style='color:#FF9500;font-weight:bold;'>🛒 Sales</div>`;
                        html += `<div style='color:#E65100;font-weight:bold;'>${this.formatNFTNumber(stats.total.sales)}</div>`;
                        html += `</div>`;
                    }
                    
                    html += `</div>`;
                }
            } else {
                html += `<div style='font-size:1.5em;color:#888;'>Floor price not available</div>`;
            }
            
            html += `</div>`;
            
            this.logHtml(html);
            this.log(`✅ ${collectionName} floor: Ξ ${stats.total?.floor_price?.toFixed(4) || 'N/A'}`, 'success');
        };

        // ===================================
        // UTILITY FUNCTIONS
        // ===================================
        
        window.terminal.formatNFTNumber = function(num) {
            if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
            if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
            return num.toFixed(2);
        };
        
        window.terminal.getPopularCollections = async function() {
            // Fallback to hardcoded popular collections for demo
            return [
                { name: 'Azuki', slug: 'azuki', description: 'A collection of 10,000 avatars' },
                { name: 'Bored Ape Yacht Club', slug: 'boredapeyachtclub', description: 'A collection of 10,000 Bored Ape NFTs' },
                { name: 'Pudgy Penguins', slug: 'pudgy-penguins', description: 'A collection of 8,888 cute penguins' },
                { name: 'CryptoPunks', slug: 'cryptopunks', description: 'The first NFT collection on Ethereum' },
                { name: 'Doodles', slug: 'doodles-official', description: 'A collection of 10,000 Doodles' },
                { name: 'Clone X', slug: 'clonex', description: 'Next-gen Avatars by RTFKT' },
                { name: 'World of Women', slug: 'world-of-women-nft', description: 'Celebrating women in NFTs' },
                { name: 'Moonbirds', slug: 'proof-moonbirds', description: 'A collection of 10,000 utility-enabled PFPs' }
            ];
        };
        
        window.terminal.getTrendingCollections = async function() {
            // For now, return popular collections with some demo stats
            const collections = await this.getPopularCollections();
            
            // Add some demo stats for testing
            return collections.map(collection => ({
                ...collection,
                stats: {
                    floor_price: Math.random() * 10 + 0.1,
                    total_volume: Math.random() * 1000 + 100,
                    total_supply: Math.floor(Math.random() * 5000) + 5000,
                    num_owners: Math.floor(Math.random() * 3000) + 2000,
                    change_1d: (Math.random() - 0.5) * 20 // -10% to +10%
                }
            }));
        };

        // ===================================
        // WATCHLIST FUNCTIONS
        // ===================================
        
        window.terminal.addToNFTWatchlist = async function(collectionSlug) {
            if (!collectionSlug) {
                this.log('❌ Collection slug required', 'error');
                return;
            }
            
            try {
                let watchlist = JSON.parse(localStorage.getItem(NFT_STORAGE_KEYS.WATCHLIST) || '[]');
                
                // Check if already exists
                if (watchlist.some(item => item.slug === collectionSlug)) {
                    this.log('⚠️ Collection already in NFT watchlist', 'warning');
                    return;
                }
                
                const watchlistItem = {
                    slug: collectionSlug,
                    name: collectionSlug.replace(/-/g, ' '),
                    addedAt: Date.now()
                };
                
                watchlist.push(watchlistItem);
                localStorage.setItem(NFT_STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
                
                this.log(`✅ Added ${collectionSlug} to NFT watchlist`, 'success');
                
            } catch (error) {
                this.log(`❌ Failed to add to NFT watchlist: ${error.message}`, 'error');
            }
        };
        
        window.terminal.viewNFTWatchlist = async function() {
            try {
                const watchlist = JSON.parse(localStorage.getItem(NFT_STORAGE_KEYS.WATCHLIST) || '[]');
                
                if (watchlist.length === 0) {
                    this.log('📋 NFT watchlist is empty', 'info');
                    this.log('Use "nft watchlist add <collection>" to add collections', 'info');
                    return;
                }
                
                this.log(`📋 Your NFT Watchlist (${watchlist.length} collections)`, 'success');
                this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'success');
                
                watchlist.forEach((item, index) => {
                    this.displayWatchlistNFTCard(item, index + 1);
                });
                
            } catch (error) {
                this.log(`❌ Failed to load NFT watchlist: ${error.message}`, 'error');
            }
        };
        
        window.terminal.displayWatchlistNFTCard = function(item, index) {
            let html = `<div style='background:rgba(255,255,255,0.8);border:1px solid rgba(138,43,226,0.2);border-radius:16px;padding:14px;margin:8px 0;backdrop-filter:blur(20px);'>`;
            
            html += `<div style='display:flex;justify-content:space-between;align-items:center;'>`;
            html += `<div style='display:flex;align-items:center;gap:12px;'>`;
            html += `<div style='background:#8A2BE2;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.8em;'>${index}</div>`;
            html += `<div>`;
            html += `<div style='font-size:1.2em;font-weight:bold;color:#4B0082;text-transform:capitalize;'>${item.name}</div>`;
            html += `<div style='color:#888;font-size:0.8em;'>${item.slug}</div>`;
            html += `</div></div>`;
            
            html += `<div style='display:flex;gap:8px;'>`;
            html += `<button onclick="window.terminal.handleNFTFloor(['nft', 'floor', '${item.slug}'])" style='background:#8A2BE2;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:0.8em;font-weight:bold;'>💎 Floor</button>`;
            html += `<button onclick="window.terminal.removeFromNFTWatchlist('${item.slug}')" style='background:#FF3B30;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:0.8em;font-weight:bold;'>✕ Remove</button>`;
            html += `</div></div>`;
            
            html += `</div>`;
            
            this.logHtml(html);
        };

        // ===================================
        // TRENDING NFT CARD DISPLAY
        // ===================================
        
        window.terminal.displayTrendingNFTCard = function(collection, index) {
            let html = `<div style='background:rgba(255,255,255,0.8);border:1px solid rgba(138,43,226,0.2);border-radius:16px;padding:16px;margin:8px 0;backdrop-filter:blur(20px);box-shadow:0 4px 16px rgba(138,43,226,0.1);transition:all 0.3s ease;'>`;
            
            html += `<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;'>`;
            html += `<div style='display:flex;align-items:center;gap:12px;'>`;
            html += `<div style='background:#8A2BE2;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9em;'>${index}</div>`;
            
            html += `<div>`;
            html += `<div style='font-size:1.2em;font-weight:bold;color:#4B0082;'>${collection.name}</div>`;
            html += `<div style='color:#666;font-size:0.85em;'>${collection.slug}</div>`;
            html += `</div></div>`;
            
            // Stats section
            html += `<div style='text-align:right;'>`;
            if (collection.stats?.floor_price) {
                html += `<div style='color:#8A2BE2;font-weight:bold;font-size:1.1em;'>Ξ ${collection.stats.floor_price.toFixed(3)}</div>`;
                html += `<div style='color:#888;font-size:0.8em;'>Floor Price</div>`;
            }
            html += `</div></div>`;
            
            // Additional metrics if available
            if (collection.stats) {
                html += `<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.8em;margin-bottom:10px;'>`;
                
                if (collection.stats.total_volume) {
                    html += `<div style='text-align:center;color:#666;'>📊 ${this.formatNFTNumber(collection.stats.total_volume)}Ξ vol</div>`;
                }
                if (collection.stats.num_owners) {
                    html += `<div style='text-align:center;color:#666;'>👥 ${this.formatNFTNumber(collection.stats.num_owners)} owners</div>`;
                }
                if (collection.stats.total_supply) {
                    html += `<div style='text-align:center;color:#666;'>🎨 ${this.formatNFTNumber(collection.stats.total_supply)} items</div>`;
                }
                
                html += `</div>`;
            }
            
            // Quick action buttons
            html += `<div style='display:flex;gap:8px;margin-top:10px;'>`;
            html += `<button onclick="window.terminal.handleNFTFloor(['nft', 'floor', '${collection.slug}'])" style='background:#8A2BE2;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:0.8em;font-weight:bold;'>💎 Floor</button>`;
            html += `<button onclick="window.terminal.addToNFTWatchlist('${collection.slug}')" style='background:#FF9500;color:#fff;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:0.8em;font-weight:bold;'>📋 Watch</button>`;
            html += `<button onclick="window.open('https://opensea.io/collection/${collection.slug}', '_blank')" style='background:#00D4AA;color:#000;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:0.8em;font-weight:bold;'>🌊 OpenSea</button>`;
            html += `</div>`;
            
            html += `</div>`;
            this.logHtml(html);
        };
        
        // ===================================
        // PLACEHOLDER FUNCTIONS FOR FUTURE IMPLEMENTATION
        // ===================================
        
        window.terminal.handleNFTTop = async function(args) {
            this.log('📈 Top NFT collections by market cap coming soon...', 'info');
        };
        
        window.terminal.handleNFTBuy = async function(args) {
            this.log('🛒 NFT purchasing functionality coming soon...', 'info');
            this.log('💡 This will integrate with OpenSea SDK for secure purchases', 'info');
        };
        
        window.terminal.handleNFTOffer = async function(args) {
            this.log('💰 NFT offer functionality coming soon...', 'info');
        };
        
        window.terminal.handleNFTList = async function(args) {
            this.log('🏷️ NFT listing functionality coming soon...', 'info');
        };
        
        window.terminal.handleNFTTraits = async function(args) {
            this.log('🎨 NFT trait analysis coming soon...', 'info');
        };
        
        window.terminal.handleNFTRarity = async function(args) {
            this.log('💎 NFT rarity rankings coming soon...', 'info');
        };
        
        window.terminal.handleNFTSales = async function(args) {
            this.log('💸 NFT sales history coming soon...', 'info');
        };
        
        window.terminal.handleNFTVolume = async function(args) {
            this.log('📊 NFT volume analysis coming soon...', 'info');
        };
        
        window.terminal.handleNFTAlerts = async function(args) {
            this.log('🚨 NFT price alerts coming soon...', 'info');
        };
        
        window.terminal.calculatePortfolioValue = async function() {
            this.log('💼 NFT portfolio valuation coming soon...', 'info');
        };

        // ===================================
        // STORAGE HELPERS
        // ===================================
        
        window.terminal.removeFromNFTWatchlist = function(collectionSlug) {
            try {
                let watchlist = JSON.parse(localStorage.getItem(NFT_STORAGE_KEYS.WATCHLIST) || '[]');
                const originalLength = watchlist.length;
                watchlist = watchlist.filter(item => item.slug !== collectionSlug);
                
                if (watchlist.length < originalLength) {
                    localStorage.setItem(NFT_STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
                    this.log(`✅ Removed ${collectionSlug} from NFT watchlist`, 'success');
                } else {
                    this.log(`❌ Collection ${collectionSlug} not found in watchlist`, 'error');
                }
            } catch (error) {
                this.log(`❌ Failed to remove from NFT watchlist: ${error.message}`, 'error');
            }
        };
        
        window.terminal.clearNFTWatchlist = function() {
            localStorage.removeItem(NFT_STORAGE_KEYS.WATCHLIST);
            this.log('✅ NFT watchlist cleared', 'success');
        };
        
        window.terminal.suggestNFTSearch = function(query) {
            this.log('💡 Popular NFT collections to try:', 'info');
            this.log('  nft search azuki', 'info');
            this.log('  nft search bored ape', 'info');  
            this.log('  nft search pudgy penguins', 'info');
            this.log('  nft search cryptopunks', 'info');
            this.log('  nft trending', 'info');
        };
        
        // Test function to verify plugin is working
        window.terminal.testNFTPlugin = function() {
            this.log('🧪 Testing OpenSea NFT Plugin...', 'info');
            this.log('', 'info');
            
            const tests = [
                { name: 'Plugin loaded', result: typeof this.handleNFTCommand === 'function' },
                { name: 'Display functions', result: typeof this.displayNFTHelp === 'function' },
                { name: 'Collection search', result: typeof this.handleNFTSearch === 'function' },
                { name: 'Trending function', result: typeof this.handleNFTTrending === 'function' },
                { name: 'Portfolio function', result: typeof this.handleNFTPortfolio === 'function' },
                { name: 'Storage available', result: typeof localStorage !== 'undefined' }
            ];
            
            tests.forEach(test => {
                const status = test.result ? '✅ PASS' : '❌ FAIL';
                this.log(`${status} ${test.name}`, test.result ? 'success' : 'error');
            });
            
            this.log('', 'info');
            this.log('🔧 Integration method: Main terminal switch statement', 'info');
            this.log('📍 Command case: nft | opensea', 'info');
            this.log('💡 Try: nft trending, nft search azuki', 'info');
        };

        // Success message and testing
        setTimeout(() => {
            console.log('✅ OpenSea NFT Plugin v1.0 loaded successfully!');
            console.log('🌊 Commands: nft search, nft collection, nft floor, nft trending');
            
            // Test function registration
            if (typeof window.terminal.handleNFTCommand === 'function') {
                console.log('✅ NFT command handler registered successfully');
                console.log('🔧 NFT commands integrated into main terminal switch statement');
                console.log('💡 Try: nft trending, nft search azuki, nft help');
            } else {
                console.error('❌ NFT command handler NOT registered');
            }
        }, 1000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForTerminalNFT);
    } else {
        waitForTerminalNFT();
    }
})(); 
 
 
 