// API Integrations Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.API = {
    // DexScreener command (ds)
    dexscreener: async function(terminal, args) {
        await this.ds(terminal, args);
    },

    // DexScreener short command (fixed to use proper relayer endpoints)
    ds: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('Usage: ds <search|trending> [query]', 'info');
            terminal.log('Examples:', 'info');
            terminal.log('  ds search WETH', 'info');
            terminal.log('  ds search bitcoin', 'info');
            terminal.log('  ds trending', 'info');
            return;
        }

        const subCommand = args[1].toLowerCase();
        
        if (subCommand === 'search' && args.length >= 3) {
            const query = args.slice(2).join(' ');
            terminal.log(`🔍 Searching DexScreener for: ${query}`, 'info');
            
            try {
                const response = await fetch(`${OmegaConfig.RELAYER_URL}/dex/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    data.slice(0, 5).forEach((item, idx) => {
                        terminal.logHtml(`<b>${idx + 1}. ${item.symbol || ''} (${item.chainId || ''})</b>`, 'output');
                        terminal.logHtml(`Name: <b>${item.name || ''}</b>`, 'output');
                        terminal.logHtml(`Price: <b>${item.priceUsd || item.price || 'N/A'}</b>`, 'output');
                        terminal.logHtml(`Token Address: <span class='copyable' onclick="navigator.clipboard.writeText('${item.tokenAddress || ''}')">${item.tokenAddress || ''}</span>`, 'output');
                        if (item.url) terminal.logHtml(`<a href="${item.url}" target="_blank">View on DexScreener</a>`, 'output');
                        terminal.logHtml('<hr>', 'output');
                    });
                } else if (data.pairs && Array.isArray(data.pairs)) {
                    data.pairs.slice(0, 5).forEach((pair, idx) => {
                        terminal.logHtml(`<b>${idx + 1}. ${pair.baseToken?.symbol || ''} (${pair.chainId || ''})</b>`, 'output');
                        terminal.logHtml(`Name: <b>${pair.baseToken?.name || ''}</b>`, 'output');
                        terminal.logHtml(`Price: <b>${pair.priceUsd || pair.price || 'N/A'}</b>`, 'output');
                        terminal.logHtml(`Token Address: <span class='copyable' onclick="navigator.clipboard.writeText('${pair.baseToken?.address || ''}')">${pair.baseToken?.address || ''}</span>`, 'output');
                        if (pair.url) terminal.logHtml(`<a href="${pair.url}" target="_blank">View on DexScreener</a>`, 'output');
                        terminal.logHtml('<hr>', 'output');
                    });
                } else {
                    terminal.logHtml('<span style="color:#ff3333">No results found.</span>', 'error');
                }
            } catch (error) {
                terminal.log(`❌ DexScreener search failed: ${error.message}`, 'error');
            }
            
        } else if (subCommand === 'trending') {
            terminal.log('📈 Fetching DexScreener trending tokens...', 'info');
            
            try {
                const response = await fetch(`${OmegaConfig.RELAYER_URL}/dex/trending`);
                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    data.slice(0, 10).forEach((item, idx) => {
                        terminal.logHtml(`<b>${idx + 1}. ${item.symbol || ''} (${item.chainId || ''})</b>`, 'output');
                        terminal.logHtml(`Name: <b>${item.name || ''}</b>`, 'output');
                        terminal.logHtml(`Price: <b>${item.priceUsd || item.price || 'N/A'}</b>`, 'output');
                        terminal.logHtml(`Token Address: <span class='copyable' onclick="navigator.clipboard.writeText('${item.tokenAddress || ''}')">${item.tokenAddress || ''}</span>`, 'output');
                        if (item.url) terminal.logHtml(`<a href="${item.url}" target="_blank">View on DexScreener</a>`, 'output');
                        terminal.logHtml('<hr>', 'output');
                    });
                } else {
                    terminal.logHtml('<span style="color:#ff3333">No trending tokens found.</span>', 'error');
                }
            } catch (error) {
                terminal.log(`❌ DexScreener trending failed: ${error.message}`, 'error');
            }
        } else {
            terminal.log('Usage: ds <search|trending> [query]', 'info');
            terminal.log('Examples: ds search WETH, ds trending', 'info');
        }
    },

    // GeckoTerminal command (shows multiple results)
    geckoterminal: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('Usage: geckoterminal <search_term>', 'error');
            terminal.log('Example: geckoterminal bitcoin', 'info');
            return;
        }

        const searchTerm = args.slice(1).join(' ');
        terminal.log(`🦎 Searching GeckoTerminal for ${searchTerm}...`, 'info');

        try {
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/gecko/search?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (data && data.data && data.data.attributes && data.data.attributes.pairs) {
                const pairs = data.data.attributes.pairs.slice(0, 5);
                
                if (pairs.length > 0) {
                    terminal.log('=== GECKOTERMINAL RESULTS ===', 'info');
                    
                    pairs.forEach((pair, index) => {
                        const attributes = pair.attributes;
                        terminal.log(`${index + 1}. ${attributes.name}`, 'success');
                        terminal.log(`   💰 Price: $${parseFloat(attributes.price_in_usd || 0).toFixed(6)}`, 'info');
                        
                        const change24h = parseFloat(attributes.price_change_percentage_24h || 0);
                        terminal.log(`   📈 24h: ${change24h.toFixed(2)}%`, change24h >= 0 ? 'success' : 'error');
                        
                        if (attributes.volume_in_usd_24h) {
                            terminal.log(`   📊 24h Volume: $${OmegaUtils.formatNumber(parseFloat(attributes.volume_in_usd_24h))}`, 'info');
                        }
                        
                        terminal.log(`   🌐 Network: ${attributes.network_id} | DEX: ${attributes.dex_id}`, 'info');
                        terminal.log('', 'info');
                    });
                } else {
                    terminal.log(`❌ No results found for "${searchTerm}"`, 'error');
                }
                
            } else {
                terminal.log(`❌ No results found for "${searchTerm}"`, 'error');
            }

        } catch (error) {
            terminal.log(`❌ Failed to search GeckoTerminal: ${error.message}`, 'error');
        }
    },

    // CoinGecko/GeckoTerminal commands (exactly like original)
    cg: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.logHtml('<span style="color:#33bbff">GeckoTerminal API Commands:</span>', 'info');
            terminal.logHtml('<span style="color:#99ccff">cg search [query]</span> - Search for pairs', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg networks</span> - List networks', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg dexes [network]</span> - List dexes for a network', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg pools [network]</span> - List pools for a network', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg token [network] [address]</span> - Get token info', 'output');
            terminal.logHtml('<br><span style="color:#33bbff">Examples:</span>', 'info');
            terminal.logHtml('<span style="color:#99ccff">cg search OMEGA</span>', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg networks</span>', 'output');
            terminal.logHtml('<span style="color:#99ccff">cg dexes ethereum</span>', 'output');
            return;
        }

        // Map cg commands to relayer endpoints (exactly like original)
        if (args[1] === 'search' && args[2]) {
            await this.geckoterminal(terminal, ['geckoterminal', 'search', ...args.slice(2)]);
        } else if (args[1] === 'networks') {
            terminal.log('Fetching GeckoTerminal networks...', 'info');
            try {
                const res = await fetch(`${OmegaConfig.RELAYER_URL}/gecko/networks`);
                const data = await res.json();
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                    terminal.logHtml('<b>Available Networks:</b>', 'output');
                    data.data.forEach((item) => {
                        const net = item.attributes;
                        const id = item.id;
                        const cg = net.coingecko_asset_platform_id ? ` | Coingecko: <b>${net.coingecko_asset_platform_id}</b>` : '';
                        terminal.logHtml(`<b>${net.name}</b> (<span style='color:#99ccff'>${id}</span>)${cg}`, 'output');
                    });
                } else {
                    terminal.logHtml('<span style="color:#ff3333">No networks found.</span>', 'error');
                }
            } catch (e) {
                terminal.log('GeckoTerminal networks fetch failed: ' + e.message, 'error');
            }
        } else if (args[1] === 'dexes' && args[2]) {
            const network = args[2];
            terminal.log(`Fetching GeckoTerminal dexes for network: ${network}`, 'info');
            try {
                const res = await fetch(`${OmegaConfig.RELAYER_URL}/gecko/networks/${network}/dexes`);
                const data = await res.json();
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                    terminal.logHtml(`<b>DEXes on ${network}:</b>`, 'output');
                    data.data.forEach((item) => {
                        const dex = item.attributes;
                        const id = item.id;
                        terminal.logHtml(`<b>${dex.name}</b> (<span style='color:#99ccff'>${id}</span>)`, 'output');
                    });
                } else {
                    terminal.logHtml(`<span style="color:#ff3333">No dexes found for network: ${network}.</span>`, 'error');
                }
            } catch (e) {
                terminal.log('GeckoTerminal dexes fetch failed: ' + e.message, 'error');
            }
        } else {
            terminal.log('Type "cg" without parameters for available commands.', 'info');
        }
    },

    // Alpha Vantage commands (exactly like original)
    alpha: async function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.logHtml('<span style="color:#33bbff">Alpha Vantage API Commands:</span>', 'info');
            terminal.logHtml('<span style="color:#99ccff">alpha quote [symbol]</span> - Get stock quote', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha search [query]</span> - Search for stocks', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha daily [symbol]</span> - Get daily stock data', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha overview [symbol]</span> - Get stock overview', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha inflation</span> - Get US inflation data', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha cpi</span> - Get US CPI data', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha gdp</span> - Get US GDP data', 'output');
            terminal.logHtml('<br><span style="color:#33bbff">Examples:</span>', 'info');
            terminal.logHtml('<span style="color:#99ccff">alpha quote IBM</span>', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha search Microsoft</span>', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha daily TSLA</span>', 'output');
            terminal.logHtml('<span style="color:#99ccff">alpha overview AAPL</span>', 'output');
            return;
        }

        // Map alpha commands to relayer endpoints (exactly like original)
        if (args[1] === 'quote' && args[2]) {
            await this.stock(terminal, ['stock', 'quote', args[2]]);
        } else if (args[1] === 'search' && args[2]) {
            await this.stock(terminal, ['stock', 'search', ...args.slice(2)]);
        } else if (args[1] === 'daily' && args[2]) {
            await this.stock(terminal, ['stock', 'daily', args[2]]);
        } else if (args[1] === 'overview' && args[2]) {
            await this.stock(terminal, ['stock', 'overview', args[2]]);
        } else if (args[1] === 'inflation') {
            await this.stock(terminal, ['stock', 'inflation']);
        } else if (args[1] === 'cpi') {
            await this.stock(terminal, ['stock', 'cpi']);
        } else if (args[1] === 'gdp') {
            await this.stock(terminal, ['stock', 'gdp']);
        } else {
            terminal.log('Type alpha without parameters for available commands.', 'info');
        }
    },

    // Stock command implementation (handles relayer calls)
    stock: async function(terminal, args) {
        if (!args || args.length < 2) {
            await this.alpha(terminal, args);
            return;
        }

        const subCommand = args[1].toLowerCase();
        const symbol = args[2] ? args[2].toUpperCase() : null;

        try {
            switch (subCommand) {
                case 'quote':
                    if (!symbol) {
                        terminal.log('Usage: stock quote <symbol>', 'error');
                        return;
                    }
                    terminal.log(`📈 Getting quote for ${symbol}...`, 'info');
                    const quoteResponse = await fetch(`${OmegaConfig.RELAYER_URL}/stock/quote/${symbol}`);
                    const quoteData = await quoteResponse.json();
                    
                    if (quoteData && (quoteData.price || quoteData['Global Quote'])) {
                        const quote = quoteData['Global Quote'] || quoteData;
                        const price = quoteData.price || quote['05. price'];
                        
                        if (price && parseFloat(price) > 0) {
                            terminal.log('=== STOCK QUOTE ===', 'info');
                            terminal.log(`📊 Symbol: ${quote['01. symbol'] || symbol}`, 'success');
                            terminal.log(`💰 Price: $${parseFloat(price).toFixed(2)}`, 'info');
                            
                            if (quote['09. change']) {
                                const change = parseFloat(quote['09. change']);
                                const changePercent = quote['10. change percent'] ? parseFloat(quote['10. change percent'].toString().replace('%', '')) : 0;
                                terminal.log(`📈 Change: ${change.toFixed(2)} (${changePercent.toFixed(2)}%)`, 
                                    change >= 0 ? 'success' : 'error');
                            }
                        } else {
                            terminal.log(`❌ No valid price data for ${symbol}`, 'error');
                        }
                    } else {
                        terminal.log(`❌ No data found for ${symbol}`, 'error');
                    }
                    break;
                    
                case 'daily':
                    if (!symbol) {
                        terminal.log('Usage: stock daily <symbol>', 'error');
                        return;
                    }
                    terminal.log(`📊 Getting daily data for ${symbol}...`, 'info');
                    const dailyResponse = await fetch(`${OmegaConfig.RELAYER_URL}/stock/daily/${symbol}`);
                    const dailyData = await dailyResponse.json();
                    
                    if (dailyData && dailyData['Time Series (Daily)']) {
                        const timeSeries = dailyData['Time Series (Daily)'];
                        const dates = Object.keys(timeSeries).slice(0, 5);
                        
                        terminal.log('=== DAILY STOCK DATA ===', 'info');
                        terminal.log(`📊 Symbol: ${symbol}`, 'success');
                        terminal.log('📅 Last 5 Trading Days:', 'info');
                        
                        dates.forEach(date => {
                            const data = timeSeries[date];
                            const close = parseFloat(data['4. close'] || 0).toFixed(2);
                            const volume = OmegaUtils.formatNumber(parseFloat(data['5. volume'] || 0));
                            terminal.log(`${date}: Close $${close}, Volume ${volume}`, 'info');
                        });
                    } else {
                        terminal.log(`❌ No daily data found for ${symbol}`, 'error');
                    }
                    break;
                    
                case 'overview':
                    if (!symbol) {
                        terminal.log('Usage: stock overview <symbol>', 'error');
                        return;
                    }
                    terminal.log(`🏢 Getting overview for ${symbol}...`, 'info');
                    const overviewResponse = await fetch(`${OmegaConfig.RELAYER_URL}/stock/overview/${symbol}`);
                    const overviewData = await overviewResponse.json();
                    
                    if (overviewData && Object.keys(overviewData).length > 0) {
                        terminal.log('=== COMPANY OVERVIEW ===', 'info');
                        terminal.log(`🏢 ${overviewData.Name || symbol}`, 'success');
                        terminal.log(`📊 Symbol: ${overviewData.Symbol || symbol}`, 'info');
                        if (overviewData.Sector) terminal.log(`🏷️ Sector: ${overviewData.Sector}`, 'info');
                        if (overviewData.Industry) terminal.log(`🏭 Industry: ${overviewData.Industry}`, 'info');
                        if (overviewData.MarketCapitalization) terminal.log(`💰 Market Cap: $${OmegaUtils.formatNumber(parseFloat(overviewData.MarketCapitalization))}`, 'info');
                    } else {
                        terminal.log(`❌ No overview data found for ${symbol}`, 'error');
                    }
                    break;
                    
                case 'inflation':
                    terminal.log('🌍 Getting US inflation data...', 'info');
                    const inflationResponse = await fetch(`${OmegaConfig.RELAYER_URL}/stock/inflation`);
                    const inflationData = await inflationResponse.json();
                    
                    if (inflationData && inflationData.data) {
                        terminal.log('=== US INFLATION DATA ===', 'info');
                        const recent = inflationData.data.slice(0, 5);
                        recent.forEach(item => {
                            terminal.log(`${item.date}: ${item.value}%`, 'info');
                        });
                    } else {
                        terminal.log('❌ Failed to fetch inflation data', 'error');
                    }
                    break;
                    
                default:
                    terminal.log('Type "alpha" without parameters for available commands.', 'info');
            }
            
        } catch (error) {
            terminal.log(`❌ Stock command failed: ${error.message}`, 'error');
        }
    },

    // Stock command (alias for alpha)
    stock: async function(terminal, args) {
        await this.alpha(terminal, args);
    },

    // Alpha Vantage quote (fixed to match relayer response structure)
    alphaQuote: async function(terminal, args) {
        if (!args || args.length < 3) {
            terminal.log('Usage: alpha quote <symbol>', 'error');
            terminal.log('Example: alpha quote AAPL', 'info');
            return;
        }

        const symbol = args[2].toUpperCase();
        terminal.log(`📈 Getting real-time quote for ${symbol}...`, 'info');

        try {
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/stock/quote/${symbol}`);
            const data = await response.json();

            if (data && (data.price || data['Global Quote'])) {
                // Handle both response formats
                const quote = data['Global Quote'] || data;
                const price = data.price || quote['05. price'];
                const change = data.change || quote['09. change'];
                const changePercent = data.changePercent || quote['10. change percent'];
                
                if (price && parseFloat(price) > 0) {
                    terminal.log('=== STOCK QUOTE ===', 'info');
                    
                    terminal.log(`📊 Symbol: ${quote['01. symbol'] || symbol}`, 'success');
                    terminal.log(`💰 Price: $${parseFloat(price).toFixed(2)}`, 'info');
                    
                    if (change) {
                        const changeVal = parseFloat(change);
                        const percentVal = changePercent ? parseFloat(changePercent.toString().replace('%', '')) : 0;
                        terminal.log(`📈 Change: ${changeVal.toFixed(2)} (${percentVal.toFixed(2)}%)`, 
                            changeVal >= 0 ? 'success' : 'error');
                    }
                    
                    if (quote['02. open']) terminal.log(`🏁 Open: $${parseFloat(quote['02. open']).toFixed(2)}`, 'info');
                    if (quote['03. high']) terminal.log(`📊 High: $${parseFloat(quote['03. high']).toFixed(2)}`, 'info');
                    if (quote['04. low']) terminal.log(`📉 Low: $${parseFloat(quote['04. low']).toFixed(2)}`, 'info');
                    if (quote['08. previous close']) terminal.log(`📊 Previous Close: $${parseFloat(quote['08. previous close']).toFixed(2)}`, 'info');
                    if (quote['07. latest trading day']) terminal.log(`📅 Latest Trading Day: ${quote['07. latest trading day']}`, 'info');
                    
                } else {
                    terminal.log(`❌ No valid price data found for symbol: ${symbol}`, 'error');
                    terminal.log('💡 Try a different symbol or check if markets are open', 'info');
                }
                
            } else {
                terminal.log(`❌ No data found for symbol: ${symbol}`, 'error');
                terminal.log('💡 Verify the symbol is correct and try again', 'info');
            }

        } catch (error) {
            terminal.log(`❌ Failed to fetch stock quote: ${error.message}`, 'error');
        }
    },

    // Alpha Vantage daily
    alphaDaily: async function(terminal, args) {
        if (!args || args.length < 3) {
            terminal.log('Usage: alpha daily <symbol>', 'error');
            terminal.log('Example: alpha daily AAPL', 'info');
            return;
        }

        const symbol = args[2].toUpperCase();
        terminal.log(`📊 Getting daily data for ${symbol}...`, 'info');

        try {
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/stock/daily/${symbol}`);

            const data = await response.json();

            if (data && data['Time Series (Daily)']) {
                const timeSeries = data['Time Series (Daily)'];
                const dates = Object.keys(timeSeries).slice(0, 5); // Last 5 days
                
                terminal.log('=== DAILY STOCK DATA ===', 'info');
                terminal.log(`📊 Symbol: ${symbol}`, 'success');
                terminal.log('📅 Last 5 Trading Days:', 'info');
                
                dates.forEach(date => {
                    const data = timeSeries[date];
                    const open = parseFloat(data['1. open'] || 0).toFixed(2);
                    const high = parseFloat(data['2. high'] || 0).toFixed(2);
                    const low = parseFloat(data['3. low'] || 0).toFixed(2);
                    const close = parseFloat(data['4. close'] || 0).toFixed(2);
                    const volume = OmegaUtils.formatNumber(parseFloat(data['5. volume'] || 0));
                    
                    terminal.log(`${date}: Open $${open}, High $${high}, Low $${low}, Close $${close}, Volume ${volume}`, 'info');
                });
                
            } else {
                terminal.log(`❌ Alpha Vantage error: ${result.error || 'Unknown error'}`, 'error');
            }

        } catch (error) {
            terminal.log(`❌ Failed to fetch daily data: ${error.message}`, 'error');
        }
    },

    // Alpha Vantage overview
    alphaOverview: async function(terminal, args) {
        if (!args || args.length < 3) {
            terminal.log('Usage: alpha overview <symbol>', 'error');
            terminal.log('Example: alpha overview AAPL', 'info');
            return;
        }

        const symbol = args[2].toUpperCase();
        terminal.log(`🏢 Getting company overview for ${symbol}...`, 'info');

        try {
            const response = await fetch(`${OmegaConfig.RELAYER_URL}/stock/overview/${symbol}`);
            const data = await response.json();

            if (data && Object.keys(data).length > 0) {
                terminal.log('=== COMPANY OVERVIEW ===', 'info');
                
                terminal.log(`🏢 ${data.Name || symbol}`, 'success');
                terminal.log(`📊 Symbol: ${data.Symbol || symbol}`, 'info');
                terminal.log(`🏷️ Sector: ${data.Sector || 'N/A'}`, 'info');
                terminal.log(`🏭 Industry: ${data.Industry || 'N/A'}`, 'info');
                terminal.log(`🌍 Country: ${data.Country || 'N/A'}`, 'info');
                terminal.log(`💰 Market Cap: $${OmegaUtils.formatNumber(parseFloat(data.MarketCapitalization || 0))}`, 'info');
                terminal.log(`📈 P/E Ratio: ${data.PERatio || 'N/A'}`, 'info');
                terminal.log(`💸 Dividend Yield: ${data.DividendYield ? (parseFloat(data.DividendYield) * 100).toFixed(2) + '%' : 'N/A'}`, 'info');
                terminal.log(`📊 52 Week High: $${parseFloat(data['52WeekHigh'] || 0).toFixed(2)}`, 'info');
                terminal.log(`📉 52 Week Low: $${parseFloat(data['52WeekLow'] || 0).toFixed(2)}`, 'info');
                
                if (data.Description && data.Description.length > 0) {
                    const shortDesc = data.Description.length > 200 ? 
                        data.Description.substring(0, 200) + '...' : 
                        data.Description;
                    terminal.log(`📝 Description: ${shortDesc}`, 'info');
                }
                
            } else {
                terminal.log(`❌ No data found for symbol: ${symbol}`, 'error');
            }

        } catch (error) {
            terminal.log(`❌ Failed to fetch company overview: ${error.message}`, 'error');
        }
    },

    // Alpha Vantage API Key management
    alphakey: async function(terminal, args) {
        terminal.log('=== ALPHA VANTAGE API INFORMATION ===', 'info');
        terminal.log('📈 Alpha Vantage provides real-time and historical stock market data', 'info');
        terminal.log('🔑 API Key: Y4N6LC9U5OH8Q4MQ (configured on relayer)', 'success');
        terminal.log('⚡ Rate Limit: 5 API requests per minute, 500 requests per day', 'warning');
        terminal.log('📊 Available data: Real-time quotes, historical daily data, company overviews', 'info');
        terminal.log('💡 Usage: alpha quote AAPL | alpha daily MSFT | alpha overview GOOGL', 'info');
        terminal.logHtml('🌐 <a href="https://www.alphavantage.co" target="_blank">Get your own API key at alphavantage.co</a>', 'info');
    },

    // Alpha Vantage macro economic data
    alphaMacro: async function(terminal, args) {
        if (!args || args.length < 3) {
            terminal.log('Usage: alpha macro <indicator>', 'error');
            terminal.log('Available indicators: GDP, INFLATION, UNEMPLOYMENT, INTEREST_RATE', 'info');
            terminal.log('Example: alpha macro GDP', 'info');
            return;
        }

        const indicator = args[2].toUpperCase();
        terminal.log(`🌍 Getting macro economic data for ${indicator}...`, 'info');

        try {
            let endpoint;
            switch (indicator) {
                case 'GDP':
                    endpoint = 'gdp';
                    break;
                case 'INFLATION':
                    endpoint = 'inflation';
                    break;
                case 'CPI':
                    endpoint = 'cpi';
                    break;
                default:
                    endpoint = 'inflation'; // default fallback
            }

            const response = await fetch(`${OmegaConfig.RELAYER_URL}/stock/${endpoint}`);

            const result = await response.json();

            if (result.success && result.data) {
                const data = result.data.data || result.data;
                terminal.log('=== MACRO ECONOMIC DATA ===', 'info');
                terminal.log(`📊 Indicator: ${indicator}`, 'success');
                
                if (Array.isArray(data)) {
                    terminal.log('📅 Recent Data Points:', 'info');
                    data.slice(0, 5).forEach(point => {
                        terminal.log(`${point.date}: ${point.value}`, 'info');
                    });
                } else {
                    terminal.log('📊 Latest Data:', 'info');
                    Object.keys(data).slice(0, 5).forEach(key => {
                        terminal.log(`${key}: ${data[key]}`, 'info');
                    });
                }
                
            } else {
                terminal.log(`❌ Alpha Vantage error: ${result.error || 'Unknown error'}`, 'error');
                terminal.log('💡 Try one of: GDP, INFLATION, UNEMPLOYMENT, INTEREST_RATE', 'info');
            }

        } catch (error) {
            terminal.log(`❌ Failed to fetch macro data: ${error.message}`, 'error');
        }
    },

    // Alpha key command for managing API key
    alphakey: function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('Usage: alphakey <your_api_key>', 'error');
            terminal.log('Get a free API key from: https://www.alphavantage.co/support/#api-key', 'info');
            terminal.log('This will be stored locally and sent to the relayer for API calls', 'info');
            return;
        }

        const apiKey = args[1];
        localStorage.setItem('omega-alphavantage-key', apiKey);
        terminal.log('✅ Alpha Vantage API key stored locally', 'success');
        terminal.log('💡 This key will be used for stock and economic data requests', 'info');
    }
}; 