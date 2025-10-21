/**
 * Omega News Reader
 * Integrated crypto news reader for the Omega Terminal
 * Displays news articles in a user-friendly sidebar panel
 */

(function() {
    'use strict';

    class OmegaNewsReader {
        constructor() {
            this.isPanelOpen = false;
            this.currentArticles = [];
            this.currentIndex = 0;
            this.autoRefreshInterval = null;
        }

        // Create the news reader panel
        createPanel() {
            // Remove existing panel if any
            const existing = document.getElementById('news-reader-panel');
            if (existing) {
                existing.remove();
            }

            const panel = document.createElement('div');
            panel.id = 'news-reader-panel';
            panel.className = 'news-reader-panel';
            
            panel.innerHTML = `
                <div class="news-panel-header">
                    <div class="news-panel-title">
                        <svg class="news-panel-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z"/>
                        </svg>
                        <span>Crypto News</span>
                    </div>
                    <div class="news-panel-header-buttons">
                        <button id="news-refresh-btn" class="news-header-btn" title="Refresh News">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                            </svg>
                        </button>
                        <button id="news-close-btn" class="news-header-btn" title="Close">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="news-filter-bar">
                    <button class="news-filter-btn active" data-filter="hot">🔥 Hot</button>
                    <button class="news-filter-btn" data-filter="latest">⚡ Latest</button>
                    <button class="news-filter-btn" data-filter="bullish">📈 Bullish</button>
                    <button class="news-filter-btn" data-filter="bearish">📉 Bearish</button>
                </div>

                <div class="news-content" id="news-content-area">
                    <div class="news-loading">
                        <div class="news-spinner"></div>
                        <div>Loading crypto news...</div>
                    </div>
                </div>

                <div class="news-panel-footer">
                    <div class="news-source-indicator" id="news-source-info">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                        </svg>
                        <span>CryptoPanic</span>
                    </div>
                </div>
            `;

            // Add to stats panel if in dashboard mode, otherwise float
            const statsPanel = document.querySelector('.omega-stats');
            if (statsPanel) {
                statsPanel.appendChild(panel);
            } else {
                document.body.appendChild(panel);
            }

            // Setup event listeners
            this.setupEventListeners();
            
            return panel;
        }

        // Setup event listeners
        setupEventListeners() {
            // Close button
            const closeBtn = document.getElementById('news-close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => this.closePanel();
            }

            // Refresh button
            const refreshBtn = document.getElementById('news-refresh-btn');
            if (refreshBtn) {
                refreshBtn.onclick = () => this.refreshNews();
            }

            // Filter buttons
            const filterBtns = document.querySelectorAll('.news-filter-btn');
            filterBtns.forEach(btn => {
                btn.onclick = () => {
                    // Update active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Load news with filter
                    const filter = btn.dataset.filter;
                    this.loadNews({ filter });
                };
            });
        }

        // Open the news reader panel
        async openPanel() {
            if (this.isPanelOpen) {
                console.log('📰 News reader already open');
                return;
            }

            this.isPanelOpen = true;
            this.createPanel();
            
            if (window.terminal) {
                window.terminal.log('📰 News Reader opened', 'success');
                window.terminal.log('📡 Loading latest crypto news...', 'info');
            }

            // Load initial news
            await this.loadNews({ filter: 'hot', limit: 20 });

            // Auto-refresh every 5 minutes
            this.autoRefreshInterval = setInterval(() => {
                this.refreshNews(true);
            }, 300000);
        }

        // Close the news reader panel
        closePanel() {
            const panel = document.getElementById('news-reader-panel');
            if (panel) {
                panel.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    panel.remove();
                    this.isPanelOpen = false;
                    
                    if (window.terminal) {
                        window.terminal.log('📰 News Reader closed', 'info');
                    }
                }, 300);
            }

            // Clear auto-refresh
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = null;
            }
        }

        // Load news articles
        async loadNews(options = {}) {
            const {
                filter = 'hot',
                limit = 20,
                currencies = ['BTC', 'ETH', 'SOL']
            } = options;

            const contentArea = document.getElementById('news-content-area');
            if (!contentArea) return;

            // Show loading
            contentArea.innerHTML = `
                <div class="news-loading">
                    <div class="news-spinner"></div>
                    <div>Loading ${filter} news...</div>
                </div>
            `;

            try {
                // Use CryptoNews module to fetch news
                if (typeof CryptoNews === 'undefined') {
                    throw new Error('CryptoNews module not loaded');
                }

                const news = await CryptoNews.getNews({
                    limit,
                    filter,
                    currencies
                });

                if (news && news.length > 0) {
                    this.currentArticles = news;
                    this.displayNews(news);
                    
                    if (window.terminal) {
                        window.terminal.log(`✅ Loaded ${news.length} ${filter} articles`, 'success');
                    }
                } else {
                    contentArea.innerHTML = `
                        <div class="news-empty">
                            <svg viewBox="0 0 24 24" width="48" height="48">
                                <path fill="currentColor" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                            </svg>
                            <p>No news articles found</p>
                            <button class="news-retry-btn" onclick="window.OmegaNewsReader.refreshNews()">Try Again</button>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('❌ Error loading news:', error);
                contentArea.innerHTML = `
                    <div class="news-error">
                        <svg viewBox="0 0 24 24" width="48" height="48">
                            <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
                        </svg>
                        <p>Failed to load news</p>
                        <button class="news-retry-btn" onclick="window.OmegaNewsReader.refreshNews()">Retry</button>
                    </div>
                `;
            }
        }

        // Display news articles
        displayNews(articles) {
            const contentArea = document.getElementById('news-content-area');
            if (!contentArea) return;

            let html = '<div class="news-articles-list">';

            articles.forEach((article, index) => {
                const votes = article.votes || {};
                const sentiment = this.getSentiment(votes);
                const timeAgo = this.getTimeAgo(article.published_at || article.created_at);
                const source = article.source?.title || article.domain || 'Unknown';
                
                html += `
                    <article class="news-article" data-index="${index}">
                        <div class="news-article-header">
                            <div class="news-sentiment ${sentiment.class}">
                                ${sentiment.icon}
                            </div>
                            <div class="news-article-meta">
                                <span class="news-source">${this.escapeHtml(source)}</span>
                                <span class="news-time">${timeAgo}</span>
                            </div>
                        </div>
                        
                        <h3 class="news-article-title">${this.escapeHtml(article.title)}</h3>
                        
                        ${article.currencies && article.currencies.length > 0 ? `
                            <div class="news-currencies">
                                ${article.currencies.slice(0, 4).map(c => 
                                    `<span class="news-currency-tag">${c.code}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="news-article-footer">
                            <button class="news-read-btn" onclick="window.OmegaNewsReader.openArticle('${this.escapeQuotes(article.url)}')">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                                </svg>
                                Read Full Article
                            </button>
                            ${votes.positive || votes.negative ? `
                                <div class="news-votes">
                                    <span class="news-vote positive">👍 ${votes.positive || 0}</span>
                                    <span class="news-vote negative">👎 ${votes.negative || 0}</span>
                                </div>
                            ` : ''}
                        </div>
                    </article>
                `;
            });

            html += '</div>';
            contentArea.innerHTML = html;
        }

        // Get sentiment from votes
        getSentiment(votes) {
            if (!votes || (!votes.positive && !votes.negative)) {
                return { icon: '📰', class: 'neutral' };
            }

            const positive = votes.positive || 0;
            const negative = votes.negative || 0;
            const total = positive + negative;

            if (total === 0) {
                return { icon: '📰', class: 'neutral' };
            }

            const ratio = positive / total;

            if (ratio > 0.6) {
                return { icon: '🚀', class: 'bullish' };
            } else if (ratio < 0.4) {
                return { icon: '📉', class: 'bearish' };
            } else {
                return { icon: '📊', class: 'neutral' };
            }
        }

        // Get time ago string
        getTimeAgo(timestamp) {
            if (!timestamp) return 'Just now';

            const now = new Date();
            const past = new Date(timestamp);
            const diff = Math.floor((now - past) / 1000); // seconds

            if (diff < 60) return 'Just now';
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
            if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
            return past.toLocaleDateString();
        }

        // Refresh news
        async refreshNews(silent = false) {
            if (!silent && window.terminal) {
                window.terminal.log('🔄 Refreshing news...', 'info');
            }

            const activeFilter = document.querySelector('.news-filter-btn.active');
            const filter = activeFilter ? activeFilter.dataset.filter : 'hot';

            await this.loadNews({ filter });
        }

        // Open article in new tab
        openArticle(url) {
            window.open(url, '_blank', 'noopener,noreferrer');
            
            if (window.terminal) {
                window.terminal.log('📖 Opening article...', 'info');
            }
        }

        // Utility: Escape HTML
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Utility: Escape quotes for attributes
        escapeQuotes(text) {
            return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        }
    }

    // Create global instance
    window.OmegaNewsReader = new OmegaNewsReader();
    console.log('📰 Omega News Reader loaded');

})();

