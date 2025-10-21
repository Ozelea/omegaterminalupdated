/**
 * Omega Perps Viewer
 * Integrated perpetual trading interface for the Omega Terminal
 * Displays Omega Perps in an iframe panel
 */

(function() {
    'use strict';

    const PERPS_CONFIG = {
        DEFAULT_URL: 'https://omegaperps.omeganetwork.co/perp/PERP_ETH_USDC/',
        PANEL_ID: 'omega-perps-panel'
    };

    class OmegaPerpsViewer {
        constructor() {
            this.isPanelOpen = false;
            this.currentUrl = PERPS_CONFIG.DEFAULT_URL;
        }

        // Create the perps viewer panel
        createPanel() {
            // Remove existing panel if any
            const existing = document.getElementById(PERPS_CONFIG.PANEL_ID);
            if (existing) {
                existing.remove();
            }

            const panel = document.createElement('div');
            panel.id = PERPS_CONFIG.PANEL_ID;
            panel.className = 'perps-viewer-panel';
            
            panel.innerHTML = `
                <div class="perps-panel-header">
                    <div class="perps-panel-title">
                        <svg class="perps-panel-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6M16,17V15H14V17M14,13V7H12V13M10,17V11H8V17H10Z"/>
                        </svg>
                        <span>Omega Perps</span>
                    </div>
                    <div class="perps-panel-header-buttons">
                        <button id="perps-refresh-btn" class="perps-header-btn" title="Refresh">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                            </svg>
                        </button>
                        <button id="perps-fullscreen-btn" class="perps-header-btn" title="Open in New Tab">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                            </svg>
                        </button>
                        <button id="perps-close-btn" class="perps-header-btn" title="Close">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="perps-info-bar">
                    <div class="perps-info-item">
                        <span class="perps-info-label">Pair:</span>
                        <span class="perps-info-value">ETH/USDC</span>
                    </div>
                    <div class="perps-info-item">
                        <span class="perps-info-label">Network:</span>
                        <span class="perps-info-value">Omega</span>
                    </div>
                    <div class="perps-info-item">
                        <span class="perps-info-label">Type:</span>
                        <span class="perps-info-value">Perpetual</span>
                    </div>
                </div>

                <div class="perps-iframe-container">
                    <iframe 
                        id="perps-iframe"
                        src="${this.currentUrl}"
                        class="perps-iframe"
                        title="Omega Perps Trading Interface"
                        frameborder="0"
                        allow="clipboard-write; clipboard-read"
                        allowfullscreen
                    ></iframe>
                    <div class="perps-loading">
                        <div class="perps-spinner"></div>
                        <div>Loading Omega Perps...</div>
                    </div>
                </div>

                <div class="perps-panel-footer">
                    <div class="perps-footer-info">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                        </svg>
                        <span>Omega Network Perpetual DEX</span>
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
            
            // Hide loading overlay when iframe loads
            const iframe = document.getElementById('perps-iframe');
            const loading = panel.querySelector('.perps-loading');
            
            if (iframe && loading) {
                iframe.addEventListener('load', () => {
                    loading.style.display = 'none';
                });
            }

            return panel;
        }

        // Setup event listeners
        setupEventListeners() {
            // Close button
            const closeBtn = document.getElementById('perps-close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => this.closePanel();
            }

            // Refresh button
            const refreshBtn = document.getElementById('perps-refresh-btn');
            if (refreshBtn) {
                refreshBtn.onclick = () => this.refresh();
            }

            // Fullscreen button
            const fullscreenBtn = document.getElementById('perps-fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.onclick = () => this.openInNewTab();
            }
        }

        // Open the perps viewer panel
        openPanel(url = null) {
            if (this.isPanelOpen) {
                console.log('📊 Perps viewer already open');
                return;
            }

            if (url) {
                this.currentUrl = url;
            }

            this.isPanelOpen = true;
            this.createPanel();
            
            if (window.terminal) {
                window.terminal.log('📊 Omega Perps Interface opened', 'success');
                window.terminal.log('💡 Trading ETH/USDC perpetuals on Omega Network', 'info');
            }
        }

        // Close the perps viewer panel
        closePanel() {
            const panel = document.getElementById(PERPS_CONFIG.PANEL_ID);
            if (panel) {
                panel.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    panel.remove();
                    this.isPanelOpen = false;
                    
                    if (window.terminal) {
                        window.terminal.log('📊 Omega Perps Interface closed', 'info');
                    }
                }, 300);
            }
        }

        // Refresh the iframe
        refresh() {
            const iframe = document.getElementById('perps-iframe');
            const loading = document.querySelector('.perps-loading');
            
            if (iframe) {
                if (loading) {
                    loading.style.display = 'flex';
                }
                
                iframe.src = iframe.src; // Reload iframe
                
                if (window.terminal) {
                    window.terminal.log('🔄 Refreshing Omega Perps...', 'info');
                }
            }
        }

        // Open in new tab
        openInNewTab() {
            window.open(this.currentUrl, '_blank', 'noopener,noreferrer');
            
            if (window.terminal) {
                window.terminal.log('🌐 Opening Omega Perps in new tab...', 'info');
            }
        }

        // Change trading pair (for future use)
        changePair(pair) {
            const baseUrl = 'https://omegaperps.omeganetwork.co/perp/';
            const pairUrl = `${baseUrl}PERP_${pair.toUpperCase()}/`;
            
            this.currentUrl = pairUrl;
            
            const iframe = document.getElementById('perps-iframe');
            if (iframe) {
                const loading = document.querySelector('.perps-loading');
                if (loading) {
                    loading.style.display = 'flex';
                }
                iframe.src = pairUrl;
            }
            
            if (window.terminal) {
                window.terminal.log(`📊 Switching to ${pair.toUpperCase()} perpetual...`, 'info');
            }
        }
    }

    // Create global instance
    window.OmegaPerpsViewer = new OmegaPerpsViewer();
    console.log('📊 Omega Perps Viewer loaded');

})();

