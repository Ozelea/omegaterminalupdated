/**
 * Kalshi Prediction Markets Integration
 * Provides comprehensive access to Kalshi's prediction market API
 */

class KalshiAPI {
    constructor() {
        this.baseURL = 'https://api.elections.kalshi.com/trade-api/v2';
        this.apiKey = null;
        this.privateKey = null;
        this.isAuthenticated = false;
    }

    /**
     * Set API credentials for authenticated requests
     */
    setCredentials(apiKey, privateKey) {
        this.apiKey = apiKey;
        this.privateKey = privateKey;
        this.isAuthenticated = true;
    }

    /**
     * Make authenticated API request with proper headers
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authentication headers if available
        if (this.isAuthenticated && this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Kalshi API request failed:', error);
            throw error;
        }
    }

    /**
     * Get exchange status and trading hours
     */
    async getExchangeStatus() {
        return await this.makeRequest('/exchange/status');
    }

    /**
     * Get all available markets with optional filters
     */
    async getMarkets(options = {}) {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.event_ticker) params.append('event_ticker', options.event_ticker);
        if (options.series_ticker) params.append('series_ticker', options.series_ticker);
        if (options.status) params.append('status', options.status);
        if (options.tickers) params.append('tickers', options.tickers);

        const queryString = params.toString();
        const endpoint = queryString ? `/markets?${queryString}` : '/markets';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Get specific market details
     */
    async getMarket(ticker) {
        return await this.makeRequest(`/markets/${ticker}`);
    }

    /**
     * Get market order book
     */
    async getMarketOrderbook(ticker, depth = null) {
        const params = depth ? `?depth=${depth}` : '';
        return await this.makeRequest(`/markets/${ticker}/orderbook${params}`);
    }

    /**
     * Get market trades
     */
    async getMarketTrades(options = {}) {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.ticker) params.append('ticker', options.ticker);
        if (options.min_ts) params.append('min_ts', options.min_ts);
        if (options.max_ts) params.append('max_ts', options.max_ts);

        const queryString = params.toString();
        const endpoint = queryString ? `/markets/trades?${queryString}` : '/markets/trades';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Get events with optional filters
     */
    async getEvents(options = {}) {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.status) params.append('status', options.status);
        if (options.series_ticker) params.append('series_ticker', options.series_ticker);
        if (options.with_nested_markets) params.append('with_nested_markets', options.with_nested_markets);

        const queryString = params.toString();
        const endpoint = queryString ? `/events?${queryString}` : '/events';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Get specific event details
     */
    async getEvent(eventTicker) {
        return await this.makeRequest(`/events/${eventTicker}`);
    }

    /**
     * Get series information
     */
    async getSeries(seriesTicker) {
        return await this.makeRequest(`/series/${seriesTicker}`);
    }

    /**
     * Get series list by category
     */
    async getSeriesList(category, options = {}) {
        const params = new URLSearchParams();
        params.append('category', category);
        
        if (options.tags) params.append('tags', options.tags);
        if (options.include_product_metadata) params.append('include_product_metadata', options.include_product_metadata);

        return await this.makeRequest(`/series?${params.toString()}`);
    }

    /**
     * Get user balance (requires authentication)
     */
    async getBalance() {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for balance endpoint');
        }
        return await this.makeRequest('/portfolio/balance');
    }

    /**
     * Get user positions (requires authentication)
     */
    async getPositions(options = {}) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for positions endpoint');
        }

        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.count_filter) params.append('count_filter', options.count_filter);
        if (options.settlement_status) params.append('settlement_status', options.settlement_status);
        if (options.ticker) params.append('ticker', options.ticker);
        if (options.event_ticker) params.append('event_ticker', options.event_ticker);

        const queryString = params.toString();
        const endpoint = queryString ? `/portfolio/positions?${queryString}` : '/portfolio/positions';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Get user orders (requires authentication)
     */
    async getOrders(options = {}) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for orders endpoint');
        }

        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.ticker) params.append('ticker', options.ticker);
        if (options.event_ticker) params.append('event_ticker', options.event_ticker);
        if (options.status) params.append('status', options.status);
        if (options.min_ts) params.append('min_ts', options.min_ts);
        if (options.max_ts) params.append('max_ts', options.max_ts);

        const queryString = params.toString();
        const endpoint = queryString ? `/portfolio/orders?${queryString}` : '/portfolio/orders';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Create order (requires authentication)
     */
    async createOrder(orderData) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for order creation');
        }

        return await this.makeRequest('/portfolio/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Cancel order (requires authentication)
     */
    async cancelOrder(orderId) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for order cancellation');
        }

        return await this.makeRequest(`/portfolio/orders/${orderId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Get user fills (requires authentication)
     */
    async getFills(options = {}) {
        if (!this.isAuthenticated) {
            throw new Error('Authentication required for fills endpoint');
        }

        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.cursor) params.append('cursor', options.cursor);
        if (options.ticker) params.append('ticker', options.ticker);
        if (options.order_id) params.append('order_id', options.order_id);
        if (options.min_ts) params.append('min_ts', options.min_ts);
        if (options.max_ts) params.append('max_ts', options.max_ts);

        const queryString = params.toString();
        const endpoint = queryString ? `/portfolio/fills?${queryString}` : '/portfolio/fills';
        
        return await this.makeRequest(endpoint);
    }

    /**
     * Get market candlesticks for historical data
     */
    async getMarketCandlesticks(seriesTicker, ticker, startTs, endTs, periodInterval) {
        const params = new URLSearchParams();
        params.append('start_ts', startTs);
        params.append('end_ts', endTs);
        params.append('period_interval', periodInterval);

        return await this.makeRequest(`/series/${seriesTicker}/markets/${ticker}/candlesticks?${params.toString()}`);
    }
}

// Initialize global Kalshi API instance
window.kalshiAPI = new KalshiAPI();

/**
 * Kalshi command handler for Omega Terminal
 */
async function handleKalshiCommand(args, terminal) {
    if (!args || args.length < 1) {
        terminal.log('🎯 KALSHI PREDICTION MARKETS', 'info');
        terminal.log('', 'output');
        terminal.log('📊 Market Commands:', 'info');
        terminal.log('  kalshi markets [limit] [status] - Browse prediction markets', 'output');
        terminal.log('  kalshi market <ticker> - Get specific market details', 'output');
        terminal.log('  kalshi orderbook <ticker> - View market order book', 'output');
        terminal.log('  kalshi trades <ticker> - View recent trades', 'output');
        terminal.log('', 'output');
        terminal.log('📈 Event Commands:', 'info');
        terminal.log('  kalshi events [status] - Browse events', 'output');
        terminal.log('  kalshi event <ticker> - Get specific event details', 'output');
        terminal.log('  kalshi series <ticker> - Get series information', 'output');
        terminal.log('', 'output');
        terminal.log('💰 Portfolio Commands (requires auth):', 'info');
        terminal.log('  kalshi balance - Check account balance', 'output');
        terminal.log('  kalshi positions - View current positions', 'output');
        terminal.log('  kalshi orders - View active orders', 'output');
        terminal.log('  kalshi fills - View recent fills', 'output');
        terminal.log('', 'output');
        terminal.log('🔐 Auth Commands:', 'info');
        terminal.log('  kalshi auth <api_key> <private_key> - Set API credentials', 'output');
        terminal.log('  kalshi status - Check exchange and trading status', 'output');
        terminal.log('', 'output');
        terminal.log('📚 Examples:', 'info');
        terminal.log('  kalshi markets 10 open', 'output');
        terminal.log('  kalshi market PRES-2024', 'output');
        terminal.log('  kalshi events open', 'output');
        terminal.log('  kalshi auth your_api_key your_private_key', 'output');
        return;
    }

    const command = args[0].toLowerCase();

    try {
        switch (command) {
            case 'markets':
                await handleMarketsCommand(args.slice(1), terminal);
                break;
            case 'market':
                await handleMarketCommand(args.slice(1), terminal);
                break;
            case 'orderbook':
                await handleOrderbookCommand(args.slice(1), terminal);
                break;
            case 'trades':
                await handleTradesCommand(args.slice(1), terminal);
                break;
            case 'events':
                await handleEventsCommand(args.slice(1), terminal);
                break;
            case 'event':
                await handleEventCommand(args.slice(1), terminal);
                break;
            case 'series':
                await handleSeriesCommand(args.slice(1), terminal);
                break;
            case 'balance':
                await handleBalanceCommand(terminal);
                break;
            case 'positions':
                await handlePositionsCommand(args.slice(1), terminal);
                break;
            case 'orders':
                await handleOrdersCommand(args.slice(1), terminal);
                break;
            case 'fills':
                await handleFillsCommand(args.slice(1), terminal);
                break;
            case 'auth':
                await handleAuthCommand(args.slice(1), terminal);
                break;
            case 'status':
                await handleStatusCommand(terminal);
                break;
            default:
                terminal.log(`❌ Unknown command: ${command}`, 'error');
                terminal.log('Type "kalshi" for available commands', 'output');
        }
    } catch (error) {
        terminal.log(`❌ Error: ${error.message}`, 'error');
        console.error('Kalshi command error:', error);
    }
}

/**
 * Handle markets command - browse prediction markets
 */
async function handleMarketsCommand(args, terminal) {
    const options = {};
    
    // Parse arguments
    if (args.length > 0 && !isNaN(args[0])) {
        options.limit = parseInt(args[0]);
    }
    if (args.length > 1) {
        options.status = args[1];
    }

    terminal.log('🔍 Fetching prediction markets...', 'info');
    
    try {
        const response = await window.kalshiAPI.getMarkets(options);
        
        if (!response.markets || response.markets.length === 0) {
            terminal.log('No markets found matching your criteria', 'output');
            return;
        }

        terminal.log(`📊 Found ${response.markets.length} markets:`, 'info');
        terminal.log('', 'output');

        response.markets.forEach((market, index) => {
            const yesPrice = (market.yes_bid_dollars || '0.00');
            const noPrice = (market.no_bid_dollars || '0.00');
            const volume = market.volume_24h || 0;
            const status = market.status || 'unknown';
            
            terminal.log(`${index + 1}. ${market.subtitle || market.title}`, 'output');
            terminal.log(`   Ticker: ${market.ticker}`, 'output');
            terminal.log(`   Yes: $${yesPrice} | No: $${noPrice} | Volume: ${volume}`, 'output');
            terminal.log(`   Status: ${status} | Close: ${new Date(market.close_time).toLocaleString()}`, 'output');
            terminal.log('', 'output');
        });

        if (response.cursor) {
            terminal.log(`📄 More results available. Use cursor: ${response.cursor}`, 'info');
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch markets: ${error.message}`, 'error');
    }
}

/**
 * Handle market command - get specific market details
 */
async function handleMarketCommand(args, terminal) {
    if (args.length < 1) {
        terminal.log('❌ Usage: kalshi market <ticker>', 'error');
        return;
    }

    const ticker = args[0];
    terminal.log(`🔍 Fetching market details for ${ticker}...`, 'info');

    try {
        const response = await window.kalshiAPI.getMarket(ticker);
        const market = response.market;

        terminal.log(`📊 Market Details: ${market.subtitle || market.title}`, 'info');
        terminal.log('', 'output');
        terminal.log(`Ticker: ${market.ticker}`, 'output');
        terminal.log(`Event: ${market.event_ticker}`, 'output');
        terminal.log(`Type: ${market.market_type}`, 'output');
        terminal.log(`Status: ${market.status}`, 'output');
        terminal.log('', 'output');
        
        terminal.log('💰 Current Prices:', 'info');
        terminal.log(`Yes Bid: $${market.yes_bid_dollars || '0.00'} | Yes Ask: $${market.yes_ask_dollars || '0.00'}`, 'output');
        terminal.log(`No Bid: $${market.no_bid_dollars || '0.00'} | No Ask: $${market.no_ask_dollars || '0.00'}`, 'output');
        terminal.log(`Last Price: $${market.last_price_dollars || '0.00'}`, 'output');
        terminal.log('', 'output');
        
        terminal.log('📈 Market Stats:', 'info');
        terminal.log(`Volume (24h): ${market.volume_24h || 0}`, 'output');
        terminal.log(`Total Volume: ${market.volume || 0}`, 'output');
        terminal.log(`Open Interest: ${market.open_interest || 0}`, 'output');
        terminal.log(`Liquidity: $${market.liquidity_dollars || '0.00'}`, 'output');
        terminal.log('', 'output');
        
        terminal.log('⏰ Schedule:', 'info');
        terminal.log(`Open: ${new Date(market.open_time).toLocaleString()}`, 'output');
        terminal.log(`Close: ${new Date(market.close_time).toLocaleString()}`, 'output');
        terminal.log(`Expires: ${new Date(market.expiration_time).toLocaleString()}`, 'output');

    } catch (error) {
        terminal.log(`❌ Failed to fetch market: ${error.message}`, 'error');
    }
}

/**
 * Handle orderbook command - view market order book
 */
async function handleOrderbookCommand(args, terminal) {
    if (args.length < 1) {
        terminal.log('❌ Usage: kalshi orderbook <ticker> [depth]', 'error');
        return;
    }

    const ticker = args[0];
    const depth = args[1] ? parseInt(args[1]) : null;

    terminal.log(`🔍 Fetching order book for ${ticker}...`, 'info');

    try {
        const response = await window.kalshiAPI.getMarketOrderbook(ticker, depth);
        const orderbook = response.orderbook;

        terminal.log(`📊 Order Book: ${ticker}`, 'info');
        terminal.log('', 'output');

        // Display YES orders
        terminal.log('🟢 YES Orders:', 'info');
        if (orderbook.yes_dollars && orderbook.yes_dollars.length > 0) {
            orderbook.yes_dollars.forEach(([price, quantity]) => {
                terminal.log(`  $${price} - ${quantity} contracts`, 'output');
            });
        } else {
            terminal.log('  No YES orders available', 'output');
        }

        terminal.log('', 'output');

        // Display NO orders
        terminal.log('🔴 NO Orders:', 'info');
        if (orderbook.no_dollars && orderbook.no_dollars.length > 0) {
            orderbook.no_dollars.forEach(([price, quantity]) => {
                terminal.log(`  $${price} - ${quantity} contracts`, 'output');
            });
        } else {
            terminal.log('  No NO orders available', 'output');
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch order book: ${error.message}`, 'error');
    }
}

/**
 * Handle trades command - view recent trades
 */
async function handleTradesCommand(args, terminal) {
    const options = {};
    
    if (args.length > 0) {
        options.ticker = args[0];
    }
    if (args.length > 1 && !isNaN(args[1])) {
        options.limit = parseInt(args[1]);
    }

    terminal.log('🔍 Fetching recent trades...', 'info');

    try {
        const response = await window.kalshiAPI.getMarketTrades(options);
        
        if (!response.trades || response.trades.length === 0) {
            terminal.log('No recent trades found', 'output');
            return;
        }

        terminal.log(`📈 Recent Trades (${response.trades.length}):`, 'info');
        terminal.log('', 'output');

        response.trades.forEach((trade, index) => {
            const time = new Date(trade.created_time).toLocaleString();
            const side = trade.taker_side === 'yes' ? '🟢 YES' : '🔴 NO';
            
            terminal.log(`${index + 1}. ${trade.ticker}`, 'output');
            terminal.log(`   ${side} - ${trade.count} contracts at $${trade.yes_price_fixed || '0.00'}`, 'output');
            terminal.log(`   Time: ${time}`, 'output');
            terminal.log('', 'output');
        });

    } catch (error) {
        terminal.log(`❌ Failed to fetch trades: ${error.message}`, 'error');
    }
}

/**
 * Handle events command - browse events
 */
async function handleEventsCommand(args, terminal) {
    const options = {};
    
    if (args.length > 0) {
        options.status = args[0];
    }
    if (args.length > 1 && !isNaN(args[1])) {
        options.limit = parseInt(args[1]);
    }

    terminal.log('🔍 Fetching events...', 'info');

    try {
        const response = await window.kalshiAPI.getEvents(options);
        
        if (!response.events || response.events.length === 0) {
            terminal.log('No events found matching your criteria', 'output');
            return;
        }

        terminal.log(`📅 Found ${response.events.length} events:`, 'info');
        terminal.log('', 'output');

        response.events.forEach((event, index) => {
            const marketCount = event.markets ? event.markets.length : 0;
            
            terminal.log(`${index + 1}. ${event.title}`, 'output');
            terminal.log(`   Ticker: ${event.event_ticker}`, 'output');
            terminal.log(`   Series: ${event.series_ticker}`, 'output');
            terminal.log(`   Markets: ${marketCount}`, 'output');
            terminal.log(`   Type: ${event.mutually_exclusive ? 'Mutually Exclusive' : 'Independent'}`, 'output');
            terminal.log('', 'output');
        });

        if (response.cursor) {
            terminal.log(`📄 More results available. Use cursor: ${response.cursor}`, 'info');
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch events: ${error.message}`, 'error');
    }
}

/**
 * Handle event command - get specific event details
 */
async function handleEventCommand(args, terminal) {
    if (args.length < 1) {
        terminal.log('❌ Usage: kalshi event <ticker>', 'error');
        return;
    }

    const ticker = args[0];
    terminal.log(`🔍 Fetching event details for ${ticker}...`, 'info');

    try {
        const response = await window.kalshiAPI.getEvent(ticker);
        const event = response.event;

        terminal.log(`📅 Event: ${event.title}`, 'info');
        terminal.log('', 'output');
        terminal.log(`Ticker: ${event.event_ticker}`, 'output');
        terminal.log(`Series: ${event.series_ticker}`, 'output');
        terminal.log(`Type: ${event.mutually_exclusive ? 'Mutually Exclusive' : 'Independent'}`, 'output');
        terminal.log(`Collateral Return: ${event.collateral_return_type}`, 'output');
        terminal.log('', 'output');

        if (event.markets && event.markets.length > 0) {
            terminal.log(`📊 Markets (${event.markets.length}):`, 'info');
            event.markets.forEach((market, index) => {
                terminal.log(`  ${index + 1}. ${market.subtitle} (${market.ticker})`, 'output');
                terminal.log(`     Yes: $${market.yes_bid_dollars || '0.00'} | No: $${market.no_bid_dollars || '0.00'}`, 'output');
            });
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch event: ${error.message}`, 'error');
    }
}

/**
 * Handle series command - get series information
 */
async function handleSeriesCommand(args, terminal) {
    if (args.length < 1) {
        terminal.log('❌ Usage: kalshi series <ticker>', 'error');
        return;
    }

    const ticker = args[0];
    terminal.log(`🔍 Fetching series information for ${ticker}...`, 'info');

    try {
        const response = await window.kalshiAPI.getSeries(ticker);
        const series = response.series;

        terminal.log(`📚 Series: ${series.title}`, 'info');
        terminal.log('', 'output');
        terminal.log(`Ticker: ${series.ticker}`, 'output');
        terminal.log(`Category: ${series.category}`, 'output');
        terminal.log(`Frequency: ${series.frequency}`, 'output');
        terminal.log(`Fee Type: ${series.fee_type}`, 'output');
        terminal.log(`Fee Multiplier: ${series.fee_multiplier || 1}`, 'output');
        terminal.log('', 'output');

        if (series.tags && series.tags.length > 0) {
            terminal.log(`🏷️ Tags: ${series.tags.join(', ')}`, 'output');
        }

        if (series.settlement_sources && series.settlement_sources.length > 0) {
            terminal.log('', 'output');
            terminal.log('📋 Settlement Sources:', 'info');
            series.settlement_sources.forEach((source, index) => {
                terminal.log(`  ${index + 1}. ${source.name}`, 'output');
                if (source.url) {
                    terminal.log(`     URL: ${source.url}`, 'output');
                }
            });
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch series: ${error.message}`, 'error');
    }
}

/**
 * Handle balance command - check account balance
 */
async function handleBalanceCommand(terminal) {
    terminal.log('💰 Checking account balance...', 'info');

    try {
        const response = await window.kalshiAPI.getBalance();
        
        const balance = (response.balance / 100).toFixed(2);
        const portfolioValue = (response.portfolio_value / 100).toFixed(2);
        
        terminal.log('💰 Account Balance:', 'info');
        terminal.log(`Available Balance: $${balance}`, 'output');
        terminal.log(`Portfolio Value: $${portfolioValue}`, 'output');
        terminal.log(`Last Updated: ${new Date(response.updated_ts * 1000).toLocaleString()}`, 'output');

    } catch (error) {
        terminal.log(`❌ Failed to fetch balance: ${error.message}`, 'error');
        if (error.message.includes('Authentication required')) {
            terminal.log('💡 Use "kalshi auth <api_key> <private_key>" to authenticate', 'info');
        }
    }
}

/**
 * Handle positions command - view current positions
 */
async function handlePositionsCommand(args, terminal) {
    const options = {};
    
    if (args.length > 0) {
        options.settlement_status = args[0];
    }
    if (args.length > 1 && !isNaN(args[1])) {
        options.limit = parseInt(args[1]);
    }

    terminal.log('📊 Checking current positions...', 'info');

    try {
        const response = await window.kalshiAPI.getPositions(options);
        
        const marketPositions = response.market_positions || [];
        const eventPositions = response.event_positions || [];
        
        if (marketPositions.length === 0 && eventPositions.length === 0) {
            terminal.log('No positions found', 'output');
            return;
        }

        if (marketPositions.length > 0) {
            terminal.log(`📈 Market Positions (${marketPositions.length}):`, 'info');
            marketPositions.forEach((position, index) => {
                const side = position.position > 0 ? 'YES' : 'NO';
                const pnl = (position.realized_pnl / 100).toFixed(2);
                const exposure = (position.market_exposure / 100).toFixed(2);
                
                terminal.log(`  ${index + 1}. ${position.ticker}`, 'output');
                terminal.log(`     Position: ${Math.abs(position.position)} ${side}`, 'output');
                terminal.log(`     Exposure: $${exposure} | P&L: $${pnl}`, 'output');
            });
        }

        if (eventPositions.length > 0) {
            terminal.log('', 'output');
            terminal.log(`📅 Event Positions (${eventPositions.length}):`, 'info');
            eventPositions.forEach((position, index) => {
                const exposure = (position.event_exposure / 100).toFixed(2);
                const pnl = (position.realized_pnl / 100).toFixed(2);
                
                terminal.log(`  ${index + 1}. ${position.event_ticker}`, 'output');
                terminal.log(`     Exposure: $${exposure} | P&L: $${pnl}`, 'output');
            });
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch positions: ${error.message}`, 'error');
        if (error.message.includes('Authentication required')) {
            terminal.log('💡 Use "kalshi auth <api_key> <private_key>" to authenticate', 'info');
        }
    }
}

/**
 * Handle orders command - view active orders
 */
async function handleOrdersCommand(args, terminal) {
    const options = {};
    
    if (args.length > 0) {
        options.status = args[0];
    }
    if (args.length > 1 && !isNaN(args[1])) {
        options.limit = parseInt(args[1]);
    }

    terminal.log('📋 Checking active orders...', 'info');

    try {
        const response = await window.kalshiAPI.getOrders(options);
        
        if (!response.orders || response.orders.length === 0) {
            terminal.log('No orders found', 'output');
            return;
        }

        terminal.log(`📋 Orders (${response.orders.length}):`, 'info');
        terminal.log('', 'output');

        response.orders.forEach((order, index) => {
            const side = order.side === 'yes' ? 'YES' : 'NO';
            const action = order.action === 'buy' ? 'BUY' : 'SELL';
            const price = order.yes_price_dollars || order.no_price_dollars || '0.00';
            const created = new Date(order.created_time).toLocaleString();
            
            terminal.log(`${index + 1}. ${order.ticker}`, 'output');
            terminal.log(`   ${action} ${side} - ${order.remaining_count}/${order.initial_count} at $${price}`, 'output');
            terminal.log(`   Status: ${order.status} | Created: ${created}`, 'output');
            if (order.order_id) {
                terminal.log(`   Order ID: ${order.order_id}`, 'output');
            }
            terminal.log('', 'output');
        });

    } catch (error) {
        terminal.log(`❌ Failed to fetch orders: ${error.message}`, 'error');
        if (error.message.includes('Authentication required')) {
            terminal.log('💡 Use "kalshi auth <api_key> <private_key>" to authenticate', 'info');
        }
    }
}

/**
 * Handle fills command - view recent fills
 */
async function handleFillsCommand(args, terminal) {
    const options = {};
    
    if (args.length > 0) {
        options.ticker = args[0];
    }
    if (args.length > 1 && !isNaN(args[1])) {
        options.limit = parseInt(args[1]);
    }

    terminal.log('📈 Checking recent fills...', 'info');

    try {
        const response = await window.kalshiAPI.getFills(options);
        
        if (!response.fills || response.fills.length === 0) {
            terminal.log('No fills found', 'output');
            return;
        }

        terminal.log(`📈 Recent Fills (${response.fills.length}):`, 'info');
        terminal.log('', 'output');

        response.fills.forEach((fill, index) => {
            const side = fill.purchased_side === 'yes' ? 'YES' : 'NO';
            const action = fill.action === 'buy' ? 'BOUGHT' : 'SOLD';
            const price = fill.yes_price_fixed || fill.no_price_fixed || '0.00';
            const time = new Date(fill.created_time).toLocaleString();
            
            terminal.log(`${index + 1}. ${fill.ticker}`, 'output');
            terminal.log(`   ${action} ${fill.count} ${side} at $${price}`, 'output');
            terminal.log(`   Time: ${time} | Taker: ${fill.is_taker ? 'Yes' : 'No'}`, 'output');
            terminal.log('', 'output');
        });

    } catch (error) {
        terminal.log(`❌ Failed to fetch fills: ${error.message}`, 'error');
        if (error.message.includes('Authentication required')) {
            terminal.log('💡 Use "kalshi auth <api_key> <private_key>" to authenticate', 'info');
        }
    }
}

/**
 * Handle auth command - set API credentials
 */
async function handleAuthCommand(args, terminal) {
    if (args.length < 2) {
        terminal.log('❌ Usage: kalshi auth <api_key> <private_key>', 'error');
        terminal.log('💡 Get your API credentials from Kalshi account settings', 'info');
        return;
    }

    const apiKey = args[0];
    const privateKey = args[1];

    try {
        window.kalshiAPI.setCredentials(apiKey, privateKey);
        terminal.log('✅ Kalshi API credentials set successfully', 'success');
        terminal.log('You can now use authenticated commands like balance, positions, orders', 'info');
        
    } catch (error) {
        terminal.log(`❌ Failed to set credentials: ${error.message}`, 'error');
    }
}

/**
 * Handle status command - check exchange and trading status
 */
async function handleStatusCommand(terminal) {
    terminal.log('🔍 Checking Kalshi exchange status...', 'info');

    try {
        const response = await window.kalshiAPI.getExchangeStatus();
        
        terminal.log('🏛️ Kalshi Exchange Status:', 'info');
        terminal.log(`Exchange Active: ${response.exchange_active ? '✅ Yes' : '❌ No'}`, 'output');
        terminal.log(`Trading Active: ${response.trading_active ? '✅ Yes' : '❌ No'}`, 'output');
        
        if (response.exchange_estimated_resume_time) {
            const resumeTime = new Date(response.exchange_estimated_resume_time).toLocaleString();
            terminal.log(`Estimated Resume: ${resumeTime}`, 'output');
        }

        // Also check if authenticated
        if (window.kalshiAPI.isAuthenticated) {
            terminal.log('', 'output');
            terminal.log('🔐 Authentication: ✅ Connected', 'success');
        } else {
            terminal.log('', 'output');
            terminal.log('🔐 Authentication: ❌ Not connected', 'error');
            terminal.log('💡 Use "kalshi auth <api_key> <private_key>" to authenticate', 'info');
        }

    } catch (error) {
        terminal.log(`❌ Failed to fetch exchange status: ${error.message}`, 'error');
    }
}

// Export the main command handler
window.handleKalshiCommand = handleKalshiCommand;

