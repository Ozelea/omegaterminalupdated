// Magic Eden Commands for Omega Terminal
console.log('🚀 Magic Eden Commands: Loading...');
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.MagicEden = {
    // Main magic eden command router
    magiceden: async function(terminal, args) {
        if (!args || args.length === 0) {
            this.showHelp(terminal);
            return;
        }

        const subcommand = args[0].toLowerCase();
        const params = args.slice(1);

        switch (subcommand) {
            case 'view':
            case 'collection':
                await this.showView(terminal, params);
                break;
            case 'activities':
            case 'activity':
                await this.showActivities(terminal, params);
                break;
            case 'stats':
                await this.showStats(terminal, params);
                break;
            case 'listings':
                await this.showListings(terminal, params);
                break;
            case 'holders':
            case 'holder':
                await this.showHolderStats(terminal, params);
                break;
            case 'attributes':
            case 'attrs':
                await this.showAttributes(terminal, params);
                break;
            case 'trending':
            case 'popular':
                await this.showTrending(terminal, params);
                break;
            case 'help':
                this.showHelp(terminal);
                break;
            default:
                terminal.log(`❌ Unknown subcommand: ${subcommand}`, 'error');
                terminal.log('Type "magiceden help" for available commands', 'info');
        }
    },

    // Alias commands
    me: async function(terminal, args) {
        await this.magiceden(terminal, args);
    },

    // Show more NFTs (pagination helper)
    showMoreNFTs: function(collectionSymbol) {
        if (!window._meCollectionData || window._meCollectionData.symbol !== collectionSymbol) {
            window.terminal.log('❌ Collection data not found. Please run the view command again.', 'error');
            return;
        }

        const data = window._meCollectionData;
        const nextBatch = Math.min(data.currentlyShowing + 5, data.allListings.length);
        const newItems = data.allListings.slice(data.currentlyShowing, nextBatch);

        // Add new NFTs to the grid
        const gridElement = document.getElementById('me-nft-grid');
        if (!gridElement) {
            window.terminal.log('❌ Grid element not found', 'error');
            return;
        }

            newItems.forEach(item => {
                const price = item.price ? window.MagicEdenAPI.formatSOL(item.price) : 'N/A';
                const imageUrl = item.extra?.img || item.token?.image || item.img || item.image || 'https://via.placeholder.com/200?text=No+Image';
                const tokenName = item.token?.name || item.tokenName || item.name || 'Unknown';

                const nftCard = document.createElement('div');
                nftCard.style.cssText = 'background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden; transition: all 0.15s; cursor: pointer;';
                nftCard.onmouseover = function() { 
                    this.style.borderColor = 'rgba(0, 212, 255, 0.4)'; 
                    this.style.background = 'rgba(0, 212, 255, 0.05)'; 
                };
                nftCard.onmouseout = function() { 
                    this.style.borderColor = 'rgba(0, 212, 255, 0.1)'; 
                    this.style.background = 'rgba(0, 212, 255, 0.02)'; 
                };

                nftCard.innerHTML = `
                    <img src="${imageUrl}" alt="${tokenName}" style="width: 100%; aspect-ratio: 1; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                    <div style="padding: 4px 6px;">
                        <div style="color: rgba(255, 255, 255, 0.7); font-weight: 400; font-size: 9px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${tokenName}">${tokenName}</div>
                        <div style="color: #00FF88; font-weight: 600; font-size: 10px;">${price}</div>
                    </div>
                `;

                gridElement.appendChild(nftCard);
            });

        // Update counter
        data.currentlyShowing = nextBatch;

        // Update or remove the "Show More" button
        const buttonContainer = document.querySelector('[onclick*="showMoreNFTs"]')?.parentElement;
        if (buttonContainer) {
            if (nextBatch < data.allListings.length) {
                buttonContainer.innerHTML = `
                    <button onclick="window.OmegaCommands.MagicEden.showMoreNFTs('${collectionSymbol}')" 
                            style="padding: 6px 20px; background: rgba(0, 212, 255, 0.08); color: #00D4FF; border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 3px; cursor: pointer; font-size: 10px; font-weight: 500; text-align: center; transition: all 0.2s;"
                            onmouseover="this.style.background='rgba(0, 212, 255, 0.15)'; this.style.borderColor='#00D4FF';"
                            onmouseout="this.style.background='rgba(0, 212, 255, 0.08)'; this.style.borderColor='rgba(0, 212, 255, 0.25)';">
                        Show More
                    </button>
                `;
            } else {
                buttonContainer.innerHTML = `<div style="color: rgba(255, 255, 255, 0.4); font-size: 10px; text-align: center;">All loaded</div>`;
            }
        }

        // Update the header counter
        const headerElement = document.querySelector('[style*="NFTs"]');
        if (headerElement) {
            headerElement.innerHTML = `NFTs (showing ${nextBatch} of ${data.allListings.length})`;
        }
    },

    // Show collection view with images and traits
    showView: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden view degods', 'info');
            return;
        }

        const collectionSymbol = params[0];
        const limit = params[1] ? parseInt(params[1]) : 5;

        terminal.log(`🖼️ Loading collection view for ${collectionSymbol}...`, 'info');
        terminal.log(''); // Blank line

        try {
            // Fetch collection stats first
            const stats = await window.MagicEdenAPI.fetchStats(collectionSymbol);
            
            // Format values properly (stats come in lamports)
            const floorPrice = stats.floorPrice ? `${(stats.floorPrice / 1e9).toFixed(3)} SOL` : 'N/A';
            const volume24h = stats.volumeAll ? `${(stats.volumeAll / 1e9).toLocaleString(undefined, {maximumFractionDigits: 0})} SOL` : 'N/A';
            const avgPrice = stats.avgPrice24hr ? `${(stats.avgPrice24hr / 1e9).toFixed(3)} SOL` : 'N/A';
            
            // Display collection header
            terminal.logHtml(`
                <div style="margin: 16px 0 20px 0;">
                    <div style="font-size: 20px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${stats.name || collectionSymbol.toUpperCase()}</div>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px;">
                        <span style="color: rgba(255, 255, 255, 0.5);">Floor <span style="color: #00FF88; font-weight: 500;">${floorPrice}</span></span>
                        <span style="color: rgba(255, 255, 255, 0.5);">Volume <span style="color: #FFB800; font-weight: 500;">${volume24h}</span></span>
                        <span style="color: rgba(255, 255, 255, 0.5);">Avg <span style="color: #00D4FF; font-weight: 500;">${avgPrice}</span></span>
                        <span style="color: rgba(255, 255, 255, 0.5);">Listed <span style="color: #FF1493; font-weight: 500;">${stats.listedCount || 0}</span></span>
                    </div>
                </div>
            `, 'output');

            // Fetch listings with images (Magic Eden API max is 20 per call)
            let allListings = await window.MagicEdenAPI.fetchListings(collectionSymbol, 20);

            // Ensure we have an array
            if (!Array.isArray(allListings)) {
                console.error('Magic Eden API returned non-array:', allListings);
                terminal.log('❌ Invalid API response format', 'error');
                return;
            }

            if (allListings.length === 0) {
                terminal.log('❌ No listings found for this collection', 'warning');
                return;
            }

            // Store all listings globally for pagination
            window._meCollectionData = {
                symbol: collectionSymbol,
                allListings: allListings,
                currentlyShowing: limit
            };

            // Display NFTs in a grid (first batch)
            const listings = allListings.slice(0, limit);
            terminal.logHtml(`<div style="color: rgba(255, 255, 255, 0.6); margin: 4px 0 4px 0; font-size: 12px;">NFTs (showing ${listings.length} of ${allListings.length})</div>`, 'output');
            
            // Create grid of NFTs
            let gridHTML = '<div id="me-nft-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; margin: 0;">';
            
            listings.forEach(item => {
                const price = item.price ? window.MagicEdenAPI.formatSOL(item.price) : 'N/A';
                // Extract image from Magic Eden's nested structure
                const imageUrl = item.extra?.img || item.token?.image || item.img || item.image || 'https://via.placeholder.com/200?text=No+Image';
                const tokenName = item.token?.name || item.tokenName || item.name || 'Unknown';
                
                gridHTML += `
                    <div style="background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden; transition: all 0.15s; cursor: pointer;" 
                         onmouseover="this.style.borderColor='rgba(0, 212, 255, 0.4)'; this.style.background='rgba(0, 212, 255, 0.05)';"
                         onmouseout="this.style.borderColor='rgba(0, 212, 255, 0.1)'; this.style.background='rgba(0, 212, 255, 0.02)';">
                        <img src="${imageUrl}" alt="${tokenName}" style="width: 100%; aspect-ratio: 1; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                        <div style="padding: 4px 6px;">
                            <div style="color: rgba(255, 255, 255, 0.7); font-weight: 400; font-size: 9px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${tokenName}">${tokenName}</div>
                            <div style="color: #00FF88; font-weight: 600; font-size: 10px;">${price}</div>
                        </div>
                    </div>
                `;
            });
            
            gridHTML += '</div>';
            terminal.logHtml(gridHTML, 'output');

            // Show "Load More" button if there are more NFTs
            if (allListings.length > limit) {
                terminal.logHtml(`
                    <div style="display: flex; justify-content: center; margin: 8px 0 0 0;">
                        <button onclick="window.OmegaCommands.MagicEden.showMoreNFTs('${collectionSymbol}')" 
                                style="padding: 6px 20px; background: rgba(0, 212, 255, 0.08); color: #00D4FF; border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 3px; cursor: pointer; font-size: 10px; font-weight: 500; text-align: center; transition: all 0.2s;"
                                onmouseover="this.style.background='rgba(0, 212, 255, 0.15)'; this.style.borderColor='#00D4FF';"
                                onmouseout="this.style.background='rgba(0, 212, 255, 0.08)'; this.style.borderColor='rgba(0, 212, 255, 0.25)';">
                            Show More
                        </button>
                    </div>
                `, 'output');
            }

        } catch (error) {
            terminal.log(`❌ Error loading collection: ${error.message}`, 'error');
            console.error('Magic Eden View Error:', error);
        }
    },

    // Show collection activities
    showActivities: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden activities degods', 'info');
            return;
        }

        const collectionSymbol = params[0];
        const limit = params[1] ? parseInt(params[1]) : 10;

        terminal.log(`📊 Loading activities...`, 'info');
        terminal.log(''); // Blank line

        try {
            const activities = await window.MagicEdenAPI.fetchActivities(collectionSymbol, limit);

            if (!activities || activities.length === 0) {
                terminal.log('No activities found for this collection', 'warning');
                return;
            }

            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${collectionSymbol.toUpperCase()} - Recent Activity</div>`, 'output');

            activities.forEach((activity, index) => {
                const type = (activity.type || 'unknown').toUpperCase();
                
                // Handle price - convert from lamports if needed
                let price = 'N/A';
                if (activity.price) {
                    price = `${(activity.price / 1e9).toFixed(3)} SOL`;
                } else if (activity.priceInfo?.solPrice?.rawAmount) {
                    price = `${(activity.priceInfo.solPrice.rawAmount / 1e9).toFixed(3)} SOL`;
                }
                
                const time = activity.blockTime ? window.MagicEdenAPI.formatTime(activity.blockTime) : 'Unknown';

                const activityLine = `
                    <div style="margin: 4px 0; padding: 5px 8px; background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; font-size: 11px;">
                        <span style="color: #00D4FF; font-weight: 600;">#${index + 1}</span>
                        <span style="color: rgba(255, 255, 255, 0.8); font-weight: 500;">${type}</span>
                        <span style="color: rgba(255, 255, 255, 0.3); margin: 0 6px;">•</span>
                        <span style="color: #00FF88; font-weight: 600;">${price}</span>
                        <span style="color: rgba(255, 255, 255, 0.3); margin: 0 6px;">•</span>
                        <span style="color: rgba(255, 255, 255, 0.5); font-size: 10px;">${time}</span>
                    </div>
                `;

                terminal.logHtml(activityLine, 'output');
            });

        } catch (error) {
            terminal.log(`❌ Failed to fetch activities: ${error.message}`, 'error');
        }
    },

    // Show collection stats
    showStats: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden stats degods', 'info');
            return;
        }

        const collectionSymbol = params[0];
        terminal.log(`📈 Loading stats...`, 'info');
        terminal.log(''); // Blank line

        try {
            const stats = await window.MagicEdenAPI.fetchStats(collectionSymbol);

            if (!stats) {
                terminal.log('No stats found for this collection', 'warning');
                return;
            }

            const floorPrice = stats.floorPrice ? `${(stats.floorPrice / 1e9).toFixed(3)} SOL` : 'N/A';
            const volume = stats.volumeAll ? `${(stats.volumeAll / 1e9).toLocaleString(undefined, {maximumFractionDigits: 0})} SOL` : 'N/A';
            const avgPrice = stats.avgPrice24hr ? `${(stats.avgPrice24hr / 1e9).toFixed(3)} SOL` : 'N/A';

            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${stats.name || collectionSymbol.toUpperCase()} - Stats</div>`, 'output');

            const statsHtml = `
                <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px; margin-bottom: 10px;">
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Floor</div>
                        <div style="color: #00FF88; font-weight: 600;">${floorPrice}</div>
                    </div>
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Volume</div>
                        <div style="color: #FFB800; font-weight: 600;">${volume}</div>
                    </div>
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Avg 24h</div>
                        <div style="color: #00D4FF; font-weight: 600;">${avgPrice}</div>
                    </div>
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Listed</div>
                        <div style="color: rgba(255, 255, 255, 0.9); font-weight: 600;">${stats.listedCount || 'N/A'}</div>
                    </div>
                </div>
            `;

            terminal.logHtml(statsHtml, 'output');

        } catch (error) {
            terminal.log(`❌ Failed to fetch stats: ${error.message}`, 'error');
        }
    },

    // Show collection listings
    showListings: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden listings degods', 'info');
            return;
        }

        const collectionSymbol = params[0];
        const limit = params[1] ? parseInt(params[1]) : 10;

        terminal.log(`🏷️ Loading listings...`, 'info');
        terminal.log(''); // Blank line

        try {
            const listings = await window.MagicEdenAPI.fetchListings(collectionSymbol, limit);

            if (!listings || listings.length === 0) {
                terminal.log('No listings found for this collection', 'warning');
                return;
            }

            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${collectionSymbol.toUpperCase()} - Listings</div>`, 'output');

            // Create grid of NFTs like view command
            let gridHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; margin: 0;">';
            
            listings.forEach(item => {
                // Handle price - convert from lamports if needed
                let price = 'N/A';
                if (item.price) {
                    price = `${(item.price / 1e9).toFixed(3)} SOL`;
                } else if (item.priceInfo?.solPrice?.rawAmount) {
                    price = `${(item.priceInfo.solPrice.rawAmount / 1e9).toFixed(3)} SOL`;
                }
                
                const imageUrl = item.extra?.img || item.token?.image || item.img || item.image || 'https://via.placeholder.com/200?text=No+Image';
                const tokenName = item.token?.name || item.tokenName || item.name || 'Unknown';
                
                gridHTML += `
                    <div style="background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden; transition: all 0.15s; cursor: pointer;" 
                         onmouseover="this.style.borderColor='rgba(0, 212, 255, 0.4)'; this.style.background='rgba(0, 212, 255, 0.05)';"
                         onmouseout="this.style.borderColor='rgba(0, 212, 255, 0.1)'; this.style.background='rgba(0, 212, 255, 0.02)';">
                        <img src="${imageUrl}" alt="${tokenName}" style="width: 100%; aspect-ratio: 1; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                        <div style="padding: 4px 6px;">
                            <div style="color: rgba(255, 255, 255, 0.7); font-weight: 400; font-size: 9px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${tokenName}">${tokenName}</div>
                            <div style="color: #00FF88; font-weight: 600; font-size: 10px;">${price}</div>
                        </div>
                    </div>
                `;
            });
            
            gridHTML += '</div>';
            terminal.logHtml(gridHTML, 'output');

        } catch (error) {
            terminal.log(`❌ Failed to fetch listings: ${error.message}`, 'error');
        }
    },

    // Show holder stats
    showHolderStats: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden holders degods', 'info');
            return;
        }

        const collectionSymbol = params[0];

        try {
            terminal.log(`🏆 Loading holder stats...`, 'info');
            terminal.log(''); // Blank line

            const holderStats = await window.MagicEdenAPI.fetchHolderStats(collectionSymbol);

            if (!holderStats) {
                terminal.log('❌ No holder stats found', 'error');
                return;
            }

            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${collectionSymbol.toUpperCase()} - Holder Stats</div>`, 'output');

            const holderPct = holderStats.uniqueHolders && holderStats.totalSupply 
                ? `${((holderStats.uniqueHolders / holderStats.totalSupply) * 100).toFixed(1)}%` 
                : 'N/A';

            const statsHtml = `
                <div style="display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px; margin-bottom: 10px;">
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Unique Holders</div>
                        <div style="color: #00D4FF; font-weight: 600;">${holderStats.uniqueHolders || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Total Supply</div>
                        <div style="color: #00FF88; font-weight: 600;">${holderStats.totalSupply || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="color: rgba(255, 255, 255, 0.5); font-size: 10px; margin-bottom: 2px;">Holder %</div>
                        <div style="color: #FFD700; font-weight: 600;">${holderPct}</div>
                    </div>
                </div>
            `;

            terminal.logHtml(statsHtml, 'output');

        } catch (error) {
            terminal.log(`❌ Failed to fetch holder stats: ${error.message}`, 'error');
            if (error.message.includes('fetch') || error.message.includes('timeout')) {
                terminal.log('⚠️ Magic Eden API may be temporarily unavailable. Try again in a moment.', 'warning');
            }
        }
    },

    // Show collection attributes
    showAttributes: async function(terminal, params) {
        if (params.length === 0) {
            terminal.log('❌ Please provide a collection symbol', 'error');
            terminal.log('Example: magiceden attributes degods', 'info');
            return;
        }

        const collectionSymbol = params[0];

        try {
            terminal.log(`🎨 Loading attributes...`, 'info');
            terminal.log(''); // Blank line

            const response = await window.MagicEdenAPI.fetchAttributes(collectionSymbol);

            // Handle Magic Eden's response structure
            const attributes = response.results?.availableAttributes || response.availableAttributes || [];

            if (!attributes || attributes.length === 0) {
                terminal.log('❌ No attributes found', 'error');
                return;
            }

            // Group attributes by trait type
            const groupedAttributes = {};
            attributes.forEach(item => {
                const traitType = item.attribute.trait_type;
                const value = item.attribute.value;
                
                if (!groupedAttributes[traitType]) {
                    groupedAttributes[traitType] = [];
                }
                
                groupedAttributes[traitType].push({
                    value: value,
                    count: item.count,
                    floor: item.floor
                });
            });

            const traitTypeCount = Object.keys(groupedAttributes).length;
            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">${collectionSymbol.toUpperCase()} - Attributes (${traitTypeCount} types)</div>`, 'output');

            // Get first attribute from each type (most common one)
            const topAttributes = [];
            Object.entries(groupedAttributes).forEach(([traitType, values]) => {
                const topValue = values.sort((a, b) => b.count - a.count)[0];
                if (topValue) {
                    topAttributes.push({
                        ...topValue,
                        traitType: traitType
                    });
                }
            });

            // Display in grid like view command
            let gridHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; margin: 0;">';
            
            // Fetch images for attributes (if available)
            const attributesWithImages = attributes.slice(0, 10); // Show first 10 attributes with images
            attributesWithImages.forEach(item => {
                const imageUrl = item.image || 'https://via.placeholder.com/200?text=No+Image';
                const value = item.attribute.value;
                const traitType = item.attribute.trait_type;
                const count = item.count;
                
                // Handle floor price - convert from lamports if needed
                let floor = 'N/A';
                if (item.floor) {
                    floor = `${(item.floor / 1e9).toFixed(3)} SOL`;
                }
                
                gridHTML += `
                    <div style="background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden; transition: all 0.15s; cursor: pointer;" 
                         onmouseover="this.style.borderColor='rgba(0, 212, 255, 0.4)'; this.style.background='rgba(0, 212, 255, 0.05)';"
                         onmouseout="this.style.borderColor='rgba(0, 212, 255, 0.1)'; this.style.background='rgba(0, 212, 255, 0.02)';">
                        <img src="${imageUrl}" alt="${value}" style="width: 100%; aspect-ratio: 1; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                        <div style="padding: 4px 6px;">
                            <div style="color: rgba(255, 255, 255, 0.5); font-weight: 400; font-size: 8px; margin-bottom: 1px;">${traitType}</div>
                            <div style="color: rgba(255, 255, 255, 0.8); font-weight: 500; font-size: 9px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}">${value}</div>
                            <div style="color: #00FF88; font-weight: 600; font-size: 10px;">${floor} <span style="color: rgba(255, 255, 255, 0.5); font-size: 8px;">×${count}</span></div>
                        </div>
                    </div>
                `;
            });
            
            gridHTML += '</div>';
            terminal.logHtml(gridHTML, 'output');

        } catch (error) {
            terminal.log(`❌ Failed to fetch attributes: ${error.message}`, 'error');
        }
    },

    // Show trending collections
    showTrending: async function(terminal, params) {
        const timeRange = params[0] || '1d';
        const validRanges = ['1h', '1d', '7d', '30d'];
        
        if (!validRanges.includes(timeRange)) {
            terminal.log('❌ Invalid time range. Use: 1h, 1d, 7d, or 30d', 'error');
            terminal.log('Example: magiceden trending 7d', 'info');
            return;
        }

        try {
            terminal.log(`🔥 Loading trending collections (${timeRange})...`, 'info');
            terminal.log(''); // Blank line

            const collections = await window.MagicEdenAPI.fetchTrending(timeRange);

            if (!collections || collections.length === 0) {
                terminal.log('❌ No trending collections found', 'error');
                return;
            }

            // Show only top 5
            const topCollections = collections.slice(0, 5);

            terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">Top ${topCollections.length} Trending (${timeRange})</div>`, 'output');

            topCollections.forEach((collection, index) => {
                const symbol = collection.symbol || 'N/A';
                const name = collection.name || symbol;
                const url = `https://magiceden.io/marketplace/${symbol}`;
                
                const collectionLine = `
                    <div style="margin: 4px 0; padding: 5px 8px; background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; font-size: 11px;">
                        <span style="color: #00D4FF; font-weight: 600;">#${index + 1}</span>
                        <span style="color: rgba(255, 255, 255, 0.8); font-weight: 500; margin-left: 8px;">${name}</span>
                        <span style="color: rgba(255, 255, 255, 0.3); margin: 0 6px;">•</span>
                        <a href="${url}" target="_blank" style="color: #00D4FF; text-decoration: none; font-size: 10px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">View</a>
                    </div>
                `;
                terminal.logHtml(collectionLine, 'output');
            });

        } catch (error) {
            terminal.log(`❌ Failed to fetch trending collections: ${error.message}`, 'error');
            if (error.message.includes('fetch') || error.message.includes('timeout')) {
                terminal.log('⚠️ Magic Eden API may be temporarily unavailable. Try again in a moment.', 'warning');
            }
        }
    },

    // Show help
    showHelp: function(terminal) {
        terminal.log('', 'output');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('🔮 SOLANA NFTs - MAGIC EDEN MARKETPLACE', 'output');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('', 'output');
        terminal.log('🖼️ FEATURED:', 'output');
        terminal.log('  magiceden view <symbol> [limit]        - View collection with NFT images & traits', 'output');
        terminal.log('', 'output');
        terminal.log('📊 COLLECTION DATA:', 'output');
        terminal.log('  magiceden activities <symbol> [limit]  - Show recent collection activities', 'output');
        terminal.log('  magiceden stats <symbol>               - Show collection stats (floor, volume)', 'output');
        terminal.log('  magiceden listings <symbol> [limit]    - Show current listings', 'output');
        terminal.log('  magiceden holders <symbol>             - Show holder statistics', 'output');
        terminal.log('  magiceden attributes <symbol>          - Show collection attributes/traits', 'output');
        terminal.log('', 'output');
        terminal.log('🔥 TRENDING:', 'output');
        terminal.log('  magiceden trending [timeRange]         - Show popular collections (1h, 1d, 7d, 30d)', 'output');
        terminal.log('', 'output');
        terminal.log('💡 EXAMPLES:', 'output');
        terminal.log('  magiceden view degods                  - View DeGods collection with images', 'output');
        terminal.log('  magiceden activities degods            - Get DeGods activities', 'output');
        terminal.log('  magiceden stats okay_bears             - Get Okay Bears stats', 'output');
        terminal.log('  magiceden listings mad_lads 5          - Get 5 Mad Lads listings', 'output');
        terminal.log('  magiceden holders degods               - Get DeGods holder stats', 'output');
        terminal.log('  magiceden attributes degods            - Get DeGods attributes', 'output');
        terminal.log('  magiceden trending 7d                  - Get 7-day trending collections', 'output');
        terminal.log('  me trending 1h                         - Get hourly trending (short alias)', 'output');
        terminal.log('', 'output');
        terminal.log('📌 ALIASES: me = magiceden', 'output');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('', 'output');
    }
};

console.log('✅ Magic Eden Commands: Object created successfully');
console.log('✅ Available commands:', Object.keys(window.OmegaCommands.MagicEden));

// Register commands when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 Magic Eden: Registering commands for autocomplete...');
    
    // Add commands to available commands list for autocomplete
    const meCommands = ['magiceden', 'me'];
    
    if (window.OmegaConfig && window.OmegaConfig.AVAILABLE_COMMANDS) {
        meCommands.forEach(cmd => {
            if (!window.OmegaConfig.AVAILABLE_COMMANDS.includes(cmd)) {
                window.OmegaConfig.AVAILABLE_COMMANDS.push(cmd);
            }
        });
    }
    
    console.log('✅ Magic Eden: Commands registered for autocomplete');
});

