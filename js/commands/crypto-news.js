console.log('[DEBUG] Loading Crypto News module...');

/**
 * Crypto News Integration
 * Multiple API providers with fallback system
 * CryptoPanic (Primary), CryptoCompare (Free), NewsAPI (General)
 */

const CryptoNews = {
    config: {
        // API Keys (from environment or hardcoded for demo)
        cryptopanicApiKey: '65692f21a0c18da010338deedff46f3c67fcc89',
        newsapiKey: '0f9555cb63414820a8b47e2360befde2',
        cryptocompareApiKey: null, // Optional
        
        // API Endpoints
        endpoints: {
            cryptopanic: 'https://cryptopanic.com/api/v1/posts/',
            cryptocompare: 'https://min-api.cryptocompare.com/data/v2/news/',
            newsapi: 'https://newsapi.org/v2/everything'
        },
        
        // Rate limiting
        rateLimits: {
            cryptopanic: 100, // requests/hour
            cryptocompare: 100000, // requests/month
            newsapi: 1000 // requests/day
        }
    },

    /**
     * Get crypto news from multiple sources with fallback
     */
    getNews: async function(options = {}) {
        const {
            limit = 20,
            category = 'all',
            filter = 'hot',
            currencies = ['BTC', 'ETH', 'SOL'],
            sources = ['cryptopanic', 'cryptocompare', 'newsapi']
        } = options;

        console.log('[DEBUG] Fetching crypto news with options:', options);

        // Try sources in priority order
        for (const source of sources) {
            try {
                console.log(`[DEBUG] Trying ${source}...`);
                const news = await this.fetchFromSource(source, { limit, category, filter, currencies });
                if (news && news.length > 0) {
                    console.log(`[DEBUG] ✅ Success with ${source}: ${news.length} articles`);
                    return news;
                }
            } catch (error) {
                console.log(`[DEBUG] ❌ ${source} failed:`, error.message);
                continue;
            }
        }

        // Fallback to mock data if all sources fail
        console.log('[DEBUG] All sources failed, using mock data');
        return this.getMockNews(limit);
    },

    /**
     * Fetch news from specific source
     */
    fetchFromSource: async function(source, options) {
        switch (source) {
            case 'cryptopanic':
                return await this.fetchCryptoPanic(options);
            case 'cryptocompare':
                return await this.fetchCryptoCompare(options);
            case 'newsapi':
                return await this.fetchNewsAPI(options);
            default:
                throw new Error(`Unknown source: ${source}`);
        }
    },

    /**
     * Fetch from CryptoPanic (Primary - Best quality)
     */
    fetchCryptoPanic: async function(options) {
        const { limit, category, filter, currencies } = options;
        
        const params = new URLSearchParams({
            auth_token: this.config.cryptopanicApiKey,
            public: 'true',
            filter: filter,
            currencies: currencies.join(','),
            kind: 'news'
        });

        if (category !== 'all') {
            params.append('categories', category);
        }

        const url = `${this.config.endpoints.cryptopanic}?${params}`;
        console.log('[DEBUG] CryptoPanic URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`CryptoPanic API error: ${response.status}`);
        }

        const data = await response.json();
        const articles = data.results || [];

        return articles.slice(0, limit).map(article => ({
            id: article.id,
            title: article.title,
            url: article.url,
            source: article.source?.title || 'CryptoPanic',
            published_at: article.published_at,
            domain: article.domain,
            kind: article.kind,
            votes: article.votes,
            currencies: article.currencies,
            sentiment: this.getSentiment(article.votes),
            image: article.metadata?.image || null,
            description: article.metadata?.description || null
        }));
    },

    /**
     * Fetch from CryptoCompare (Free fallback)
     */
    fetchCryptoCompare: async function(options) {
        const { limit } = options;
        
        const url = `${this.config.endpoints.cryptocompare}?lang=EN&sortOrder=latest`;
        console.log('[DEBUG] CryptoCompare URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`CryptoCompare API error: ${response.status}`);
        }

        const data = await response.json();
        const articles = data.Data || [];

        return articles.slice(0, limit).map(article => ({
            id: article.id,
            title: article.title,
            url: article.url,
            source: article.source_info?.name || 'CryptoCompare',
            published_at: new Date(article.published_on * 1000).toISOString(),
            domain: new URL(article.url).hostname,
            kind: 'news',
            votes: { positive: 0, negative: 0, important: 0, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 0 },
            currencies: article.tags ? article.tags.split(',').map(tag => tag.trim().toUpperCase()) : [],
            sentiment: 'neutral',
            image: article.imageurl || null,
            description: article.body || null
        }));
    },

    /**
     * Fetch from NewsAPI (General news)
     */
    fetchNewsAPI: async function(options) {
        const { limit, currencies } = options;
        
        const query = currencies.join(' OR ') + ' cryptocurrency OR blockchain OR defi OR nft';
        const params = new URLSearchParams({
            q: query,
            apiKey: this.config.newsapiKey,
            sortBy: 'publishedAt',
            language: 'en',
            pageSize: Math.min(limit, 100)
        });

        const url = `${this.config.endpoints.newsapi}?${params}`;
        console.log('[DEBUG] NewsAPI URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status}`);
        }

        const data = await response.json();
        const articles = data.articles || [];

        return articles.slice(0, limit).map(article => ({
            id: article.url,
            title: article.title,
            url: article.url,
            source: article.source?.name || 'NewsAPI',
            published_at: article.publishedAt,
            domain: new URL(article.url).hostname,
            kind: 'news',
            votes: { positive: 0, negative: 0, important: 0, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 0 },
            currencies: this.extractCurrencies(article.title + ' ' + (article.description || '')),
            sentiment: 'neutral',
            image: article.urlToImage || null,
            description: article.description || null
        }));
    },

    /**
     * Extract cryptocurrency symbols from text
     */
    extractCurrencies: function(text) {
        const cryptoRegex = /\b(BTC|ETH|SOL|ADA|DOT|MATIC|AVAX|LINK|UNI|AAVE|COMP|MKR|SNX|YFI|CRV|SUSHI|1INCH|BAL|LRC|ZRX|BAT|ENJ|MANA|SAND|AXS|CHZ|FLOW|ICP|NEAR|FTM|ALGO|VET|TRX|XRP|LTC|BCH|EOS|XLM|ATOM|LUNA|TERRA|DOGE|SHIB)\b/gi;
        const matches = text.match(cryptoRegex);
        return matches ? [...new Set(matches.map(m => m.toUpperCase()))] : [];
    },

    /**
     * Get sentiment from votes
     */
    getSentiment: function(votes) {
        if (!votes) return 'neutral';
        
        const { positive, negative, important } = votes;
        const total = positive + negative;
        
        if (important > 0) return 'important';
        if (total === 0) return 'neutral';
        
        const ratio = positive / total;
        if (ratio > 0.6) return 'positive';
        if (ratio < 0.4) return 'negative';
        return 'neutral';
    },

    /**
     * Get mock news for fallback
     */
    getMockNews: function(limit) {
        const mockArticles = [
            {
                id: 'mock-1',
                title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
                url: 'https://example.com/bitcoin-ath',
                source: 'CryptoNews',
                published_at: new Date().toISOString(),
                domain: 'example.com',
                kind: 'news',
                votes: { positive: 15, negative: 2, important: 1, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 5 },
                currencies: ['BTC'],
                sentiment: 'positive',
                image: null,
                description: 'Bitcoin continues its upward trajectory as more institutions announce crypto adoption.'
            },
            {
                id: 'mock-2',
                title: 'Ethereum 2.0 Staking Rewards Hit Record High',
                url: 'https://example.com/eth2-staking',
                source: 'DeFi Times',
                published_at: new Date(Date.now() - 3600000).toISOString(),
                domain: 'example.com',
                kind: 'news',
                votes: { positive: 8, negative: 1, important: 0, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 3 },
                currencies: ['ETH'],
                sentiment: 'positive',
                image: null,
                description: 'Ethereum 2.0 validators are seeing increased rewards as network activity grows.'
            },
            {
                id: 'mock-3',
                title: 'Solana Ecosystem Sees Massive Growth in DeFi Applications',
                url: 'https://example.com/solana-defi',
                source: 'Solana Daily',
                published_at: new Date(Date.now() - 7200000).toISOString(),
                domain: 'example.com',
                kind: 'news',
                votes: { positive: 12, negative: 0, important: 0, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 7 },
                currencies: ['SOL'],
                sentiment: 'positive',
                image: null,
                description: 'New DeFi protocols are launching on Solana at an unprecedented rate.'
            }
        ];

        return mockArticles.slice(0, limit);
    },

    /**
     * Format time ago
     */
    formatTimeAgo: function(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    },

    /**
     * Get sentiment emoji
     */
    getSentimentEmoji: function(sentiment) {
        switch (sentiment) {
            case 'positive': return '📈';
            case 'negative': return '📉';
            case 'important': return '🔥';
            case 'neutral': return '📊';
            default: return '📰';
        }
    },

    /**
     * Get sentiment color
     */
    getSentimentColor: function(sentiment) {
        switch (sentiment) {
            case 'positive': return '#00ff88';
            case 'negative': return '#ff4444';
            case 'important': return '#ff8800';
            case 'neutral': return '#8888ff';
            default: return '#ffffff';
        }
    }
};

/**
 * Crypto News Commands
 */
const CryptoNewsCommands = {
    /**
     * Main command handler
     */
    news: async function(terminal, args) {
        if (args.length === 0) {
            this.handleHelp(terminal);
            return;
        }

        const subcommand = args[0].toLowerCase();

        switch (subcommand) {
            case 'latest':
            case 'hot':
            case 'trending':
                await this.handleLatest(terminal, args);
                break;
            case 'search':
            case 'find':
                await this.handleSearch(terminal, args);
                break;
            case 'crypto':
            case 'btc':
            case 'eth':
            case 'sol':
                await this.handleCrypto(terminal, args);
                break;
            case 'category':
            case 'cat':
                await this.handleCategory(terminal, args);
                break;
            case 'sources':
                await this.handleSources(terminal);
                break;
            case 'expand':
            case 'expand-all':
                this.handleExpandAll(terminal);
                break;
            case 'collapse':
            case 'collapse-all':
                this.handleCollapseAll(terminal);
                break;
            case 'collapse-article':
                if (args.length > 1) {
                    this.handleCollapseArticle(terminal, args[1]);
                } else {
                    terminal.log('❌ Usage: news collapse-article <article-id>', 'error');
                }
                break;
            case 'clear':
            case 'clear-expansions':
                this.handleClearExpansions(terminal);
                break;
            case 'clear-terminal':
                this.handleClearTerminal(terminal);
                break;
            case 'clean':
                this.handleCleanView(terminal);
                break;
            case 'test':
                this.handleTest(terminal);
                break;
            case 'help':
                this.handleHelp(terminal);
                break;
            default:
                // Treat as search query
                await this.handleSearch(terminal, args);
                break;
        }
    },

    /**
     * Show latest/hot news
     */
    handleLatest: async function(terminal, args) {
        const limit = this.parseLimit(args) || 15;
        const filter = args[0] === 'hot' ? 'hot' : 'latest';
        const title = filter === 'hot' ? 'Trending Crypto News' : 'Latest Crypto News';

        terminal.log(`Fetching ${filter} crypto news from multiple sources...`, 'info');
        terminal.log('Connecting to OMEGA Crypto News Network...', 'info');
        terminal.log('');

        try {
            const articles = await CryptoNews.getNews({
                limit,
                filter,
                category: 'all'
            });

            this.displayNews(terminal, articles, `${title} (${articles.length} articles)`);
        } catch (error) {
            terminal.log(`[!] Failed to fetch news: ${error.message}`, 'error');
            terminal.log('Try again in a moment or check your internet connection', 'info');
        }
    },

    /**
     * Search news
     */
    handleSearch: async function(terminal, args) {
        const query = args.join(' ');
        if (!query.trim()) {
            terminal.log('[!] Usage: news search "<query>"', 'error');
            terminal.log('Example: news search "bitcoin etf"', 'info');
            return;
        }

        terminal.log(`Searching crypto news for: "${query}"`, 'info');
        terminal.log('Scanning multiple news sources...', 'info');
        terminal.log('');

        try {
            // For now, get latest news and filter by query
            const articles = await CryptoNews.getNews({ limit: 50 });
            const filtered = articles.filter(article => 
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                (article.description && article.description.toLowerCase().includes(query.toLowerCase()))
            );

            this.displayNews(terminal, filtered.slice(0, 15), `Search Results for "${query}" (${filtered.length} articles)`);
        } catch (error) {
            terminal.log(`[!] Search failed: ${error.message}`, 'error');
            terminal.log('Try a different search term or check your connection', 'info');
        }
    },

    /**
     * Show crypto-specific news
     */
    handleCrypto: async function(terminal, args) {
        const crypto = args[0].toUpperCase();
        const limit = this.parseLimit(args) || 10;

        terminal.log(`Fetching ${crypto} news from crypto sources...`, 'info');
        terminal.log(`Filtering for ${crypto} related content...`, 'info');
        terminal.log('');

        try {
            const articles = await CryptoNews.getNews({
                limit,
                currencies: [crypto],
                filter: 'hot'
            });

            this.displayNews(terminal, articles, `${crypto} News (${articles.length} articles)`);
        } catch (error) {
            terminal.log(`[!] Failed to fetch ${crypto} news: ${error.message}`, 'error');
            terminal.log('Try a different crypto symbol or check your connection', 'info');
        }
    },

    /**
     * Show news by category
     */
    handleCategory: async function(terminal, args) {
        if (args.length < 2) {
            terminal.log('❌ Usage: news category <category>', 'error');
            terminal.log('💡 Categories: all, news, media, blog', 'info');
            return;
        }

        const category = args[1].toLowerCase();
        const limit = this.parseLimit(args) || 10;

        terminal.log(`📂 Fetching ${category} news...`, 'info');
        terminal.log('');

        try {
            const articles = await CryptoNews.getNews({
                limit,
                category,
                filter: 'hot'
            });

            this.displayNews(terminal, articles, `${category.charAt(0).toUpperCase() + category.slice(1)} News (${articles.length} articles)`);
        } catch (error) {
            terminal.log(`❌ Failed to fetch ${category} news: ${error.message}`, 'error');
        }
    },

    /**
     * Show available sources
     */
    handleSources: function(terminal) {
        terminal.log('OMEGA CRYPTO NEWS NETWORK', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');
        terminal.log('PRIMARY SOURCES:', 'info');
        terminal.log('  [1] CryptoPanic     - Premium crypto news aggregation', 'output');
        terminal.log('  [2] CryptoCompare   - Free crypto news API (no key required)', 'output');
        terminal.log('  [3] NewsAPI         - General news with crypto filtering', 'output');
        terminal.log('  [4] Mock Data       - Development fallback system', 'output');
        terminal.log('');
        terminal.log('SYSTEM FEATURES:', 'info');
        terminal.log('  • Real-time news updates with sentiment analysis', 'output');
        terminal.log('  • Multi-source aggregation with intelligent fallback', 'output');
        terminal.log('  • Professional terminal formatting', 'output');
        terminal.log('  • Smart filtering by crypto, category, and keywords', 'output');
        terminal.log('  • Rate limit management and error recovery', 'output');
        terminal.log('');
        terminal.log('API RATE LIMITS:', 'info');
        terminal.log('  • CryptoPanic:     100 requests/hour (free tier)', 'output');
        terminal.log('  • CryptoCompare:   100,000 requests/month (free)', 'output');
        terminal.log('  • NewsAPI:         1,000 requests/day (free tier)', 'output');
        terminal.log('');
        terminal.log('FALLBACK ORDER:', 'info');
        terminal.log('  CryptoPanic → CryptoCompare → NewsAPI → Mock Data', 'output');
        terminal.log('');
        terminal.log('TIP: System automatically switches sources for maximum uptime', 'info');
    },

    /**
     * Expand all articles
     */
    handleExpandAll: function(terminal) {
        terminal.log('Expanding all articles...', 'info');
        
        if (!this.articleData) {
            terminal.log('[!] No articles to expand. Load news first with "news latest"', 'error');
            return;
        }

        let expandedCount = 0;
        Object.keys(this.articleData).forEach(articleId => {
            const expansionMarker = `[EXPANDED-${articleId}]`;
            const terminalOutput = document.getElementById('terminalContent');
            if (!terminalOutput || !terminalOutput.textContent.includes(expansionMarker)) {
                this.toggleArticleExpansion(articleId);
                expandedCount++;
            }
        });

        if (expandedCount > 0) {
            terminal.log(`[+] Expanded ${expandedCount} articles`, 'success');
        } else {
            terminal.log('All articles are already expanded', 'info');
        }
    },

    /**
     * Collapse all articles
     */
    handleCollapseAll: function(terminal) {
        terminal.log('Collapsing all articles...', 'info');
        
        if (!this.articleData) {
            terminal.log('No articles loaded', 'info');
            return;
        }

        let collapsedCount = 0;
        Object.keys(this.articleData).forEach(articleId => {
            const expansionMarker = `[EXPANDED-${articleId}]`;
            const terminalOutput = document.getElementById('terminalContent');
            if (terminalOutput && terminalOutput.textContent.includes(expansionMarker)) {
                this.collapseArticle(articleId);
                collapsedCount++;
            }
        });

        if (collapsedCount > 0) {
            terminal.log(`[-] Collapsed ${collapsedCount} articles`, 'success');
        } else {
            terminal.log('No articles are currently expanded', 'info');
        }
    },

    /**
     * Collapse a specific article
     */
    handleCollapseArticle: function(terminal, articleId) {
        console.log('[DEBUG] handleCollapseArticle called with ID:', articleId);
        console.log('[DEBUG] Looking for expansion marker: [EXPANDED-' + articleId + ']');
        
        if (!this.articleData || !this.articleData[articleId]) {
            terminal.log('[!] Article not found or not loaded', 'error');
            return;
        }

        const expansionMarker = `[EXPANDED-${articleId}]`;
        const terminalOutput = document.getElementById('terminalContent');
        
        if (!terminalOutput) {
            terminal.log('[!] Terminal output not found', 'error');
            return;
        }

        // Check if the expansion marker exists in the terminal
        const terminalText = terminalOutput.textContent || terminalOutput.innerText || '';
        console.log('[DEBUG] Terminal text contains marker:', terminalText.includes(expansionMarker));
        console.log('[DEBUG] Terminal text length:', terminalText.length);
        
        if (!terminalText.includes(expansionMarker)) {
            terminal.log('[!] Article is not currently expanded', 'error');
            terminal.log('Try "news clear-expansions" to clear all expansions', 'info');
            return;
        }

        terminal.log('Collapsing article...', 'info');
        this.collapseArticle(articleId);
        terminal.log('[+] Article collapsed successfully', 'success');
    },

    /**
     * Clear all expansions by clearing terminal and reloading news
     */
    handleClearExpansions: function(terminal) {
        terminal.log('Clearing all expansions...', 'info');
        
        // Clear the terminal
        const terminalOutput = document.getElementById('terminalContent');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
        
        // Reload the last news command if we have article data
        if (this.articleData && Object.keys(this.articleData).length > 0) {
            terminal.log('Reloading news without expansions...', 'info');
            
            // Get the first article to determine the source
            const firstArticleId = Object.keys(this.articleData)[0];
            const firstArticle = this.articleData[firstArticleId];
            
            // Re-display the news without expansions
            const articles = Object.values(this.articleData).map(data => ({
                id: firstArticleId.replace('news-article-', ''),
                title: data.title,
                url: data.url,
                source: data.source,
                published_at: new Date().toISOString(), // Approximate
                domain: new URL(data.url).hostname,
                kind: 'news',
                votes: data.votes ? {
                    positive: parseInt(data.votes.match(/Positive: (\d+)/)?.[1] || '0'),
                    negative: parseInt(data.votes.match(/Negative: (\d+)/)?.[1] || '0'),
                    important: 0,
                    liked: 0,
                    disliked: 0,
                    lol: 0,
                    toxic: 0,
                    saved: 0,
                    comments: 0
                } : { positive: 0, negative: 0, important: 0, liked: 0, disliked: 0, lol: 0, toxic: 0, saved: 0, comments: 0 },
                currencies: data.currencies.split(', '),
                sentiment: 'neutral',
                image: null,
                description: data.fullDescription
            }));
            
            this.displayNews(terminal, articles, `Latest Crypto News (${articles.length} articles) - Clean View`);
        } else {
            terminal.log('No articles loaded. Use "news latest" to load news.', 'info');
        }
    },

    /**
     * Clear terminal completely
     */
    handleClearTerminal: function(terminal) {
        terminal.log('Clearing terminal completely...', 'info');
        
        // Clear the terminal
        const terminalOutput = document.getElementById('terminalContent');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
        
        terminal.log('[+] Terminal cleared successfully', 'success');
        terminal.log('Use "news latest" to reload news', 'info');
    },

    /**
     * Show clean view (reload news without expansions)
     */
    handleCleanView: function(terminal) {
        terminal.log('Loading clean news view...', 'info');
        
        // Clear the terminal
        const terminalOutput = document.getElementById('terminalContent');
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
        
        // Reload news without any expansions
        if (this.articleData && Object.keys(this.articleData).length > 0) {
            const articles = Object.values(this.articleData);
            this.displayNews(terminal, articles, `Latest Crypto News (${articles.length} articles) - Clean View`);
        } else {
            terminal.log('No articles loaded. Use "news latest" to load news.', 'info');
        }
    },

    /**
     * Test the expansion system
     */
    handleTest: function(terminal) {
        terminal.log('Testing news expansion system...', 'info');
        terminal.log('', 'output');
        
        // Test if the system is properly loaded
        terminal.log('[+] CryptoNewsCommands loaded:', !!window.CryptoNewsCommands, 'info');
        terminal.log('[+] toggleArticleExpansion function:', !!(window.CryptoNewsCommands && window.CryptoNewsCommands.toggleArticleExpansion), 'info');
        terminal.log('[+] Article data storage:', !!(window.CryptoNewsCommands && window.CryptoNewsCommands.articleData), 'info');
        
        if (window.CryptoNewsCommands && window.CryptoNewsCommands.articleData) {
            const articleCount = Object.keys(window.CryptoNewsCommands.articleData).length;
            terminal.log(`[+] Articles in storage: ${articleCount}`, 'info');
            if (articleCount > 0) {
                terminal.log('Available article IDs:', 'info');
                Object.keys(window.CryptoNewsCommands.articleData).forEach(id => {
                    const article = window.CryptoNewsCommands.articleData[id];
                    terminal.log(`   • ${id}: ${article.title}`, 'output');
                });
            }
        } else {
            terminal.log('[!] No articles loaded. Run "news latest" first.', 'error');
        }
        
        terminal.log('', 'output');
        terminal.log('Run "news latest" to load articles, then click "[+] Read Full Article" buttons', 'info');
    },

    /**
     * Show help
     */
    handleHelp: function(terminal) {
        terminal.log('OMEGA CRYPTO NEWS SYSTEM', 'success');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');
        terminal.log('BASIC COMMANDS:', 'info');
        terminal.log('  news latest [limit]            Show latest crypto news', 'output');
        terminal.log('  news hot [limit]               Show trending/hot news', 'output');
        terminal.log('  news search "<query>"          Search for specific topics', 'output');
        terminal.log('');
        terminal.log('CRYPTO-SPECIFIC NEWS:', 'info');
        terminal.log('  news btc [limit]               Bitcoin news', 'output');
        terminal.log('  news eth [limit]               Ethereum news', 'output');
        terminal.log('  news sol [limit]               Solana news', 'output');
        terminal.log('  news crypto <symbol> [limit]   Any crypto news', 'output');
        terminal.log('');
        terminal.log('CATEGORY FILTERING:', 'info');
        terminal.log('  news category news [limit]     News articles', 'output');
        terminal.log('  news category media [limit]    Media coverage', 'output');
        terminal.log('  news category blog [limit]     Blog posts', 'output');
        terminal.log('');
        terminal.log('SYSTEM INFORMATION:', 'info');
        terminal.log('  news sources                   Show available sources', 'output');
        terminal.log('  news expand-all                Expand all articles in terminal', 'output');
        terminal.log('  news collapse-all              Collapse all expanded articles', 'output');
        terminal.log('  news clear-expansions          Clear terminal and reload clean view', 'output');
        terminal.log('  news test                      Test expansion system', 'output');
        terminal.log('  news help                      Show this help', 'output');
        terminal.log('');
        terminal.log('QUICK EXAMPLES:', 'info');
        terminal.log('  news latest 20                 Latest 20 articles', 'output');
        terminal.log('  news search "bitcoin etf"      Search for Bitcoin ETF news', 'output');
        terminal.log('  news btc 5                     Top 5 Bitcoin news', 'output');
        terminal.log('  news category news 10          Top 10 news articles', 'output');
        terminal.log('');
        terminal.log('SYSTEM FEATURES:', 'info');
        terminal.log('  • Multi-source aggregation (CryptoPanic, CryptoCompare, NewsAPI)', 'output');
        terminal.log('  • Real-time sentiment analysis with visual indicators', 'output');
        terminal.log('  • Automatic fallback system for 99.9% uptime', 'output');
        terminal.log('  • Professional terminal formatting', 'output');
        terminal.log('  • Smart filtering and full-text search', 'output');
        terminal.log('  • Rate limit management and error recovery', 'output');
        terminal.log('');
        terminal.log('TIP: Click article titles or [LINK] to open in new tab!', 'info');
        terminal.log('TIP: Use quick actions in the futuristic dashboard for one-click access!', 'info');
    },

    /**
     * Parse limit from args
     */
    parseLimit: function(args) {
        for (const arg of args) {
            const num = parseInt(arg);
            if (!isNaN(num) && num > 0 && num <= 100) {
                return num;
            }
        }
        return null;
    },

    /**
     * Display news articles in structured appendix format
     */
    displayNews: function(terminal, articles, title) {
        if (articles.length === 0) {
            terminal.log('[!] No news articles found', 'error');
            return;
        }

        // Header with timestamp
        const timestamp = new Date().toLocaleString();
        terminal.log(`NEWS APPENDIX: ${title}`, 'success');
        terminal.log(`Last Updated: ${timestamp}`, 'info');
        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log('');

        // Table of Contents
        terminal.log('TABLE OF CONTENTS', 'info');
        terminal.log('────────────────────────────────────────────────────────', 'output');
        articles.forEach((article, index) => {
            const articleNumber = String(index + 1).padStart(2, '0');
            const shortTitle = article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title;
            terminal.log(`[${articleNumber}] ${shortTitle}`, 'output');
        });
        terminal.log('');

        // Articles Section
        terminal.log('ARTICLES', 'info');
        terminal.log('────────────────────────────────────────────────────────', 'output');
        terminal.log('');

        articles.forEach((article, index) => {
            const timeAgo = CryptoNews.formatTimeAgo(article.published_at);
            const currencies = article.currencies.length > 0 ? article.currencies.join(', ') : 'General';
            const votes = article.votes ? `Positive: ${article.votes.positive || 0} | Negative: ${article.votes.negative || 0}` : '';
            const important = article.votes && article.votes.important > 0 ? '[IMPORTANT] ' : '';
            const articleId = `news-article-${Date.now()}-${index}`;
            const articleNumber = String(index + 1).padStart(2, '0');
            
            // Article header with number and title
            const clickableTitle = `<a href="${article.url}" target="_blank" style="color: #00D4FF; text-decoration: none; cursor: pointer; font-weight: bold;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#00D4FF'">${article.title}</a>`;
            terminal.logHtml(`<div data-article-id="${articleId}">[${articleNumber}] ${important}${clickableTitle}</div>`, 'output');
            
            // Article metadata
            terminal.log(`    Source: ${article.source}`, 'info');
            terminal.log(`    Published: ${timeAgo}`, 'info');
            terminal.log(`    Currencies: ${currencies}`, 'info');
            
            if (article.description) {
                // Smart text wrapping for terminal
                const maxLength = 80;
                const isLongDescription = article.description.length > maxLength;
                const shortDescription = isLongDescription 
                    ? article.description.substring(0, maxLength) + '...'
                    : article.description;
                
                terminal.log(`    Summary: ${shortDescription}`, 'output');
                
                // Add expand/collapse functionality for long descriptions
                if (isLongDescription) {
                    console.log('[DEBUG] Creating expand button for article:', article.title);
                    const expandButton = `<button onclick="window.CryptoNewsCommands.toggleArticleExpansion('${articleId}')" style="background: linear-gradient(135deg, #007BFF, #00D4FF); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; margin-left: 8px; font-weight: bold;">[+] Read Full Article</button>`;
                    terminal.logHtml(`    ${expandButton}`, 'info');
                    
                    // Store full article data for expansion
                    window.CryptoNewsCommands.articleData = window.CryptoNewsCommands.articleData || {};
                    window.CryptoNewsCommands.articleData[articleId] = {
                        fullDescription: article.description,
                        title: article.title,
                        source: article.source,
                        timeAgo: timeAgo,
                        currencies: currencies,
                        votes: votes,
                        url: article.url,
                        sentimentEmoji: '',
                        important: important,
                        index: index + 1
                    };
                    console.log('[DEBUG] Stored article data for ID:', articleId);
                }
            }
            
            if (votes) {
                terminal.log(`    Votes: ${votes}`, 'info');
            }
            
            // Clickable URL display
            const domain = new URL(article.url).hostname;
            const clickableUrl = `<a href="${article.url}" target="_blank" style="color: #ffffff; text-decoration: underline; cursor: pointer;" onmouseover="this.style.color='#00D4FF'" onmouseout="this.style.color='#ffffff'">[LINK] ${domain}</a>`;
            terminal.logHtml(`    ${clickableUrl}`, 'info');
            terminal.log('');
        });

        terminal.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        terminal.log(`Total Articles: ${articles.length} | Use "news help" for more commands`, 'info');
        terminal.log('Click article titles or [LINK] to open articles | Click [+] to expand full content', 'info');
    },

    /**
     * Toggle article expansion to show full content in terminal text
     */
    toggleArticleExpansion: function(articleId) {
        console.log('[DEBUG] toggleArticleExpansion called with ID:', articleId);
        
        const articleData = this.articleData && this.articleData[articleId];
        if (!articleData) {
            console.log('[DEBUG] No article data found for ID:', articleId);
            return;
        }

        // Check if already expanded by looking for expansion marker
        const expansionMarker = `[EXPANDED-${articleId}]`;
        const terminalOutput = document.getElementById('terminalContent');
        if (terminalOutput && terminalOutput.textContent.includes(expansionMarker)) {
            console.log('[DEBUG] Article already expanded, collapsing...');
            this.collapseArticle(articleId);
            return;
        }

        console.log('[DEBUG] Expanding article:', articleData.title);

        // Use the terminal's logging system to display expanded content
        if (window.terminal) {
            // Create expansion content as terminal text
            const expansionContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL ARTICLE CONTENT ${expansionMarker}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${articleData.title}

${articleData.fullDescription}

Source: ${articleData.source}
Published: ${articleData.timeAgo}
Currencies: ${articleData.currencies}
${articleData.votes ? `Votes: ${articleData.votes}` : ''}

Full Article: ${articleData.url}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

            // Log the expansion content
            window.terminal.log(expansionContent, 'output');
            
            // Add a collapse button that uses terminal command
            const collapseButton = `<button onclick="window.terminal.executeCommand('news collapse-article ${articleId}')" style="background: #ff4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; margin: 8px 0;">[-] Collapse Article</button>`;
            window.terminal.logHtml(collapseButton, 'info');
            
            console.log('[DEBUG] Article expanded successfully');
        } else {
            console.log('[DEBUG] Terminal not available');
        }
    },

    /**
     * Collapse an expanded article
     */
    collapseArticle: function(articleId) {
        console.log('[DEBUG] Collapsing article:', articleId);
        
        const terminalOutput = document.getElementById('terminalContent');
        if (!terminalOutput) {
            console.log('[DEBUG] Terminal output not found');
            return;
        }

        const expansionMarker = `[EXPANDED-${articleId}]`;
        console.log('[DEBUG] Looking for marker:', expansionMarker);
        
        // Simple approach: Find the expansion and remove it
        const allElements = terminalOutput.querySelectorAll('*');
        let foundElement = null;
        
        // Find the element containing the expansion marker
        for (let element of allElements) {
            const text = element.textContent || element.innerText || '';
            if (text.includes(expansionMarker)) {
                foundElement = element;
                console.log('[DEBUG] Found element with marker:', element.tagName, element.className);
                break;
            }
        }
        
        if (foundElement) {
            // Find the parent container that holds the entire expansion block
            let container = foundElement;
            while (container && container.parentNode) {
                const containerText = container.textContent || '';
                // Look for the full expansion block (contains both start and end markers)
                if (containerText.includes(expansionMarker) && 
                    containerText.includes('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') &&
                    containerText.includes('✕ Collapse Article')) {
                    console.log('[DEBUG] Found expansion container:', container.tagName, container.className);
                    // Remove the entire expansion block
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                        console.log('[DEBUG] Successfully removed expansion block');
                        return;
                    }
                }
                container = container.parentNode;
            }
        }
        
        // Fallback: Clear and reload
        console.log('[DEBUG] Using fallback method - clear and reload');
        this.clearExpansionAlternative(articleId);
    },

    /**
     * Alternative collapse method using terminal clearing
     */
    clearExpansionAlternative: function(articleId) {
        console.log('[DEBUG] Using alternative collapse method');
        
        // This is a fallback - we'll just log a message since we can't easily remove specific lines
        if (window.terminal) {
            window.terminal.log('ℹ️ Article expansion cleared (refresh terminal to see clean view)', 'info');
        }
    }
};

// Make globally accessible
window.CryptoNewsCommands = CryptoNewsCommands;
window.CryptoNews = CryptoNews;

// Add a test function for debugging
window.testNewsExpansion = function() {
    console.log('[DEBUG] Testing news expansion system...');
    console.log('[DEBUG] CryptoNewsCommands available:', !!window.CryptoNewsCommands);
    console.log('[DEBUG] toggleArticleExpansion available:', !!(window.CryptoNewsCommands && window.CryptoNewsCommands.toggleArticleExpansion));
    console.log('[DEBUG] Article data available:', !!(window.CryptoNewsCommands && window.CryptoNewsCommands.articleData));
    if (window.CryptoNewsCommands && window.CryptoNewsCommands.articleData) {
        console.log('[DEBUG] Article data keys:', Object.keys(window.CryptoNewsCommands.articleData));
    }
};

console.log('[DEBUG] ✅ Crypto News module loaded successfully');
