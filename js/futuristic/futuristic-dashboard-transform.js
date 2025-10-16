// Futuristic Dashboard Transformation
// Transforms the existing terminal into a 3-panel dashboard

(function() {
    'use strict';
    
    console.log('🚀 Loading Futuristic Dashboard Transform...');
    
    function transformToDashboard() {
        console.log('🔧 Transforming terminal to futuristic dashboard...');
        
        // Wait for terminal to be ready
        if (!document.getElementById('terminal')) {
            console.log('⏳ Waiting for terminal...');
            setTimeout(transformToDashboard, 100);
            return;
        }
        
        const terminal = document.getElementById('terminal');
        if (!terminal) return;
        
        // Create dashboard wrapper
        const dashboard = document.createElement('div');
        dashboard.className = 'omega-dashboard';
        dashboard.innerHTML = `
        <!-- Header -->
        <header class="omega-header">
             <div class="header-brand">
                 <div class="header-logo-container">
                     <!-- Logo will be replaced by omega-symbol-logo.js -->
                 </div>
                <div class="brand-text">OMEGA TERMINAL</div>
                <div class="version-badge">v2.0.1 CLASSIFIED</div>
            </div>
                
                <div class="header-status">
                    <div class="status-indicator">
                        <div class="status-dot" id="futuristic-connection-status"></div>
                        <span id="futuristic-connection-text">INITIALIZING</span>
                    </div>
                    
                    <div class="status-indicator">
                        <span id="futuristic-wallet-info">NO WALLET</span>
                    </div>
                    
                    <button class="sidebar-button" id="header-ai-toggle" onclick="window.FuturisticDashboard && window.FuturisticDashboard.toggleAI()" style="padding: 6px 12px; margin-right: 8px;" title="Toggle AI Mode">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span id="header-ai-label">AI</span>
                    </button>
                    
                    <button class="sidebar-button" onclick="window.FuturisticDashboard && window.FuturisticDashboard.cycleTheme()" style="padding: 6px 12px;" title="Cycle Color Scheme">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                    </button>
                </div>
            </header>
            
            <!-- Sidebar -->
            <aside class="omega-sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">QUICK ACTIONS</div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('help')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/></svg>
                        <span>System Help</span>
                    </button>
                    <button class="sidebar-button" onclick="MultiNetworkConnector.showNetworkSelector(window.terminal)">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18H21M12,16V8H21V16H12Z"/></svg>
                        <span>Connect Wallet</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('balance')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/></svg>
                        <span>Check Balance</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('faucet')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        <span>Claim Faucet</span>
                    </button>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">TRADING & ANALYTICS</div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'charts')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z"/></svg>
                        <span>Live Charts</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="charts" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.showChart('BTC')">
                            <span>→ Bitcoin Chart</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.showChart('ETH')">
                            <span>→ Ethereum Chart</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.showChart('SOL')">
                            <span>→ Solana Chart</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chart', 'Enter symbol (BTC, ETH, SOL, etc.) and press Enter:')">
                            <span>→ Custom Chart</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'trading')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/></svg>
                        <span>Market Analytics</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="trading" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommand('dexscreener BTC')">
                            <span>→ BTC Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommand('dexscreener ETH')">
                            <span>→ ETH Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommand('dexscreener SOL')">
                            <span>→ SOL Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('dexscreener', 'Enter token symbol and press Enter:')">
                            <span>→ Custom Token</span>
                        </button>
                    </div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommand('defillama')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>
                        <span>DeFi Llama</span>
                    </button>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">PORTFOLIO TRACKER</div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'pgt')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H21V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"/></svg>
                        <span>Track Wallet</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="pgt" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('pgt track', 'Enter wallet address and press Enter:')">
                            <span>→ Track New Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('pgt portfolio')">
                            <span>→ View Portfolio</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('pgt wallets')">
                            <span>→ List Wallets</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('pgt refresh')">
                            <span>→ Refresh Data</span>
                        </button>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">OMEGA NETWORK</div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('mine')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M14,2H10L9,3H5V5H19V3H15L14,2M6,7V19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6M8,9H16V19H8V9Z"/></svg>
                        <span>Start Mining</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('claim')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/></svg>
                        <span>Claim Rewards</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'omega-tools')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z"/></svg>
                        <span>Build Tools</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="omega-tools" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('create')">
                            <span>→ Create Token</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft')">
                            <span>→ Create NFT Collection</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('ens register', 'Enter ENS name and press Enter:')">
                            <span>→ Register ENS Name</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('mixer')">
                            <span>→ Privacy Mixer</span>
                        </button>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">TRANSACTIONS</div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandWithInput('send', 'Enter amount and address (e.g., 1.5 0x123...) and press Enter:')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/></svg>
                        <span>Send Tokens</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('email')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>
                        <span>Send Email</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('inbox')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"/></svg>
                        <span>View Inbox</span>
                    </button>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">NFT & WEB3</div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'nft')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/></svg>
                        <span>NFT Tools</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="nft" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft')">
                            <span>→ Create NFT Collection</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommand('opensea trending')">
                            <span>→ Trending NFTs</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('near agent deploy', 'Enter agent name and press Enter:')">
                            <span>→ Deploy Shade Agent</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'solana')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        <span>Solana Tools</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="solana" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana connect')">
                            <span>→ Connect Phantom</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana generate')">
                            <span>→ Generate Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana status')">
                            <span>→ Wallet Status</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana swap')">
                            <span>→ Token Swap</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('solana search', 'Enter token name or symbol and press Enter:')">
                            <span>→ Search Tokens</span>
                        </button>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">SYSTEM</div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.toggleAI()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span id="sidebar-ai-toggle">Toggle AI</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('clear')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>
                        <span>Clear Terminal</span>
                    </button>
                </div>
            </aside>
            
            <!-- Main Terminal (will be moved here) -->
            <main class="omega-terminal" id="terminal-wrapper">
                <div class="terminal-header">
                    <div class="terminal-title">
                        <span>▶</span>
                        <span>COMMAND CENTER</span>
                    </div>
                    <div class="terminal-controls">
                        <div class="terminal-control-btn close" title="Close"></div>
                        <div class="terminal-control-btn minimize" title="Minimize"></div>
                        <div class="terminal-control-btn maximize" title="Maximize"></div>
                    </div>
                </div>
                <!-- Original terminal will be inserted here -->
            </main>
            
            <!-- Stats Panel -->
            <aside class="omega-stats">
                <div class="stats-panel">
                    <div class="stats-title">SYSTEM INFO</div>
                    <div class="stat-item">
                        <span class="stat-label">Commands Run</span>
                        <span class="stat-value" id="futuristic-commands">0</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-label">Uptime</span>
                        <span class="stat-value" id="futuristic-uptime">00:00:00</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-label">Status</span>
                        <span class="stat-value text-matrix">OPERATIONAL</span>
                    </div>
                </div>
                
                <div class="stats-panel" id="pgt-stats-panel" style="display: none;">
                    <div class="stats-title">PORTFOLIO TRACKER</div>
                    <div class="stat-item">
                        <span class="stat-label">Total Value</span>
                        <span class="stat-value" id="pgt-total-value">$0.00</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">24h Change</span>
                        <span class="stat-value" id="pgt-24h-change">+0.00%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Wallets</span>
                        <span class="stat-value" id="pgt-wallet-count">0</span>
                    </div>
                </div>
                
                <div class="stats-panel" id="chart-panel" style="display: none;">
                    <div class="stats-title">
                        📈 CHART
                        <button onclick="window.FuturisticDashboard.closeChart()" style="background: none; border: none; color: var(--cyber-blue-dim); cursor: pointer; float: right; font-size: 16px; padding: 0;" title="Close Chart">✕</button>
                    </div>
                    <div id="chart-symbol-display" style="font-size: 11px; color: var(--cyber-blue-bright); margin-bottom: 8px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                        BTC/USD
                    </div>
                    <div id="chart-container" style="width: 100%; height: 280px; position: relative; background: rgba(0, 0, 0, 0.3); border-radius: 8px; overflow: hidden;">
                        <!-- TradingView widget will be inserted here -->
                    </div>
                </div>
            </aside>
        `;
        
        // Insert dashboard before terminal
        document.body.insertBefore(dashboard, terminal);
        
        // Move terminal into dashboard
        const terminalWrapper = document.getElementById('terminal-wrapper');
        terminalWrapper.appendChild(terminal);
        
        // Remove terminal header (we have our own)
        const originalHeader = terminal.querySelector('.terminal-header');
        if (originalHeader) {
            originalHeader.style.display = 'none';
        }
        
        // Style the terminal for dashboard
        terminal.style.cssText = `
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
        `;
        
        // Setup command input handling
        window.FuturisticDashboard.setupCommandInput();
        
         // Start monitoring
         window.FuturisticDashboard.startMonitoring();
        
        console.log('✅ Dashboard transformation complete!');
    }
    
    // Dashboard controller
    window.FuturisticDashboard = {
        commandCount: 0,
        startTime: Date.now(),
        
        executeCommand: function(cmd) {
            console.log('Executing command:', cmd);
            this.commandCount++;
            document.getElementById('futuristic-commands').textContent = this.commandCount;
            
            // Add to activity log
            const activity = document.getElementById('futuristic-activity');
            if (activity) {
                const entry = document.createElement('div');
                entry.style.padding = '4px 0';
                entry.textContent = `• ${cmd}`;
                activity.insertBefore(entry, activity.firstChild);
                
                // Keep only last 10
                while (activity.children.length > 10) {
                    activity.removeChild(activity.lastChild);
                }
            }
            
            // Execute command properly
            this.sendCommandToTerminal(cmd);
        },
        
        toggleSubActions: function(button, parentId) {
            const subMenu = document.querySelector(`.sub-actions[data-parent="${parentId}"]`);
            const expandIcon = button.querySelector('.expand-icon');
            
            if (!subMenu) return;
            
            // Close other sub-menus
            document.querySelectorAll('.sub-actions').forEach(menu => {
                if (menu !== subMenu) {
                    menu.style.display = 'none';
                    const otherButton = document.querySelector(`.sidebar-expandable[onclick*="${menu.dataset.parent}"]`);
                    if (otherButton) {
                        const otherIcon = otherButton.querySelector('.expand-icon');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                        otherButton.classList.remove('expanded');
                    }
                }
            });
            
            // Toggle current menu
            const isOpen = subMenu.style.display === 'block';
            subMenu.style.display = isOpen ? 'none' : 'block';
            if (expandIcon) {
                expandIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
            button.classList.toggle('expanded', !isOpen);
        },
        
        executeCommandWithInput: function(baseCmd, promptText) {
            // Use terminal's input instead of popup
            const terminal = window.terminal;
            const input = document.getElementById('commandInput');
            
            if (!terminal || !input) {
                console.error('Terminal or input not found');
                return;
            }
            
            // Show prompt in terminal
            terminal.log('💡 ' + promptText, 'info');
            terminal.log('', 'output');
            
            // Pre-fill the command input with the base command and a space
            input.value = baseCmd + ' ';
            
            // Focus the input so user can type
            input.focus();
            
            // Position cursor at the end
            setTimeout(() => {
                input.setSelectionRange(input.value.length, input.value.length);
            }, 0);
        },
        
        sendCommandToTerminal: function(cmd) {
            const input = document.getElementById('commandInput');
            if (!input) {
                console.error('Command input not found');
                return;
            }
            
            // Set the command value
            input.value = cmd;
            
            // Trigger the input event first
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
            
            // Create and dispatch keypress event (what terminal-core.js listens for)
            const keypressEvent = new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            console.log('Dispatching keypress event for command:', cmd);
            input.dispatchEvent(keypressEvent);
            
            // Also try keydown as backup
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(keydownEvent);
        },
        
        // Direct command execution (bypasses input field)
        executeCommandDirect: function(cmd) {
            console.log('Executing command directly:', cmd);
            
            // Increment command counter
            this.commandCount++;
            document.getElementById('futuristic-commands').textContent = this.commandCount;
            
            // Try to use terminal's direct method if available
            if (window.terminal && typeof window.terminal.executeCommand === 'function') {
                window.terminal.executeCommand(cmd);
                return;
            }
            
            // Try to use terminal's log method to show command
            if (window.terminal && typeof window.terminal.log === 'function') {
                window.terminal.log(`> ${cmd}`, 'info');
                
                // Simulate command processing
                setTimeout(() => {
                    this.processCommandResult(cmd);
                }, 100);
                return;
            }
            
            // Fallback to input method
            this.sendCommandToTerminal(cmd);
        },
        
        processCommandResult: function(cmd) {
            // Handle common commands
            const cmdLower = cmd.toLowerCase().trim();
            
            switch (cmdLower) {
                case 'help':
                    window.terminal.log('Available commands:', 'info');
                    window.terminal.log('• help - Show this help', 'info');
                    window.terminal.log('• connect - Connect wallet', 'info');
                    window.terminal.log('• balance - Check balance', 'info');
                    window.terminal.log('• clear - Clear terminal', 'info');
                    break;
                case 'clear':
                    const output = document.getElementById('terminalOutput');
                    if (output) {
                        output.innerHTML = '';
                    }
                    break;
                case 'connect':
                    window.terminal.log('Connecting to wallet...', 'warning');
                    window.terminal.log('Please use browser wallet extension', 'info');
                    break;
                case 'balance':
                    window.terminal.log('Balance: 0.00 ETH', 'warning');
                    window.terminal.log('Connect wallet to see balance', 'info');
                    break;
                default:
                    window.terminal.log(`Command not found: ${cmd}`, 'error');
                    window.terminal.log('Type "help" for available commands', 'info');
            }
        },
        
        // Handle manual command input from terminal
        setupCommandInput: function() {
            const input = document.getElementById('commandInput');
            if (!input) return;
            
            // Method 1: Hook into terminal's executeCommand if available
            if (window.terminal && typeof window.terminal.executeCommand === 'function') {
                const originalExecute = window.terminal.executeCommand;
                const self = this;
                
                window.terminal.executeCommand = function(cmd) {
                    // Increment counter
                    self.commandCount++;
                    const commandsEl = document.getElementById('futuristic-commands');
                    if (commandsEl) {
                        commandsEl.textContent = self.commandCount;
                        // Add subtle flash effect
                        commandsEl.style.color = 'var(--cyber-blue-bright)';
                        setTimeout(() => {
                            commandsEl.style.color = '';
                        }, 200);
                    }
                    
                    // Call original function
                    return originalExecute.apply(this, arguments);
                };
                
                console.log('✅ Command counter hooked into terminal.executeCommand');
            }
            
            // Method 2: Listen to command input keypress events
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    // Small delay to let terminal process first
                    setTimeout(() => {
                        this.commandCount++;
                        const commandsEl = document.getElementById('futuristic-commands');
                        if (commandsEl) {
                            commandsEl.textContent = this.commandCount;
                            commandsEl.style.color = 'var(--cyber-blue-bright)';
                            setTimeout(() => {
                                commandsEl.style.color = '';
                            }, 200);
                        }
                    }, 50);
                }
            });
            
            console.log('✅ Command input handler attached');
            console.log('✅ Command counter active on all executions');
        },
        
        startMonitoring: function() {
            // Sync initial AI toggle state
            this.syncAIToggleState();
            
            // Update uptime every second
            setInterval(() => {
                const uptime = Math.floor((Date.now() - this.startTime) / 1000);
                const hours = Math.floor(uptime / 3600).toString().padStart(2, '0');
                const mins = Math.floor((uptime % 3600) / 60).toString().padStart(2, '0');
                const secs = (uptime % 60).toString().padStart(2, '0');
                const uptimeEl = document.getElementById('futuristic-uptime');
                if (uptimeEl) {
                    uptimeEl.textContent = `${hours}:${mins}:${secs}`;
                }
            }, 1000);
            
            // Periodically sync AI toggle state (in case it's changed from main terminal)
            setInterval(() => {
                this.syncAIToggleState();
            }, 1000);
        },
        
        syncAIToggleState: function() {
            // Sync AI toggle labels with terminal's actual state
            if (window.terminal && window.terminal.isAIModeOn !== undefined) {
                const sidebarToggle = document.getElementById('sidebar-ai-toggle');
                const headerAILabel = document.getElementById('header-ai-label');
                const headerAIToggle = document.getElementById('header-ai-toggle');
                
                if (window.terminal.isAIModeOn) {
                    if (sidebarToggle) sidebarToggle.textContent = 'AI: ON';
                    if (headerAILabel) headerAILabel.textContent = 'AI: ON';
                    if (headerAIToggle) headerAIToggle.classList.add('ai-active');
                } else {
                    if (sidebarToggle) sidebarToggle.textContent = 'AI: OFF';
                    if (headerAILabel) headerAILabel.textContent = 'AI: OFF';
                    if (headerAIToggle) headerAIToggle.classList.remove('ai-active');
                }
            }
        },
        
        toggleAI: function() {
            // Toggle AI mode by calling the terminal's toggleAIMode method
            if (window.terminal && typeof window.terminal.toggleAIMode === 'function') {
                window.terminal.toggleAIMode();
                
                // Update sidebar and header labels to match + add animation
                const sidebarToggle = document.getElementById('sidebar-ai-toggle');
                const headerAILabel = document.getElementById('header-ai-label');
                const headerAIToggle = document.getElementById('header-ai-toggle');
                
                if (window.terminal.isAIModeOn) {
                    if (sidebarToggle) sidebarToggle.textContent = 'AI: ON';
                    if (headerAILabel) headerAILabel.textContent = 'AI: ON';
                    if (headerAIToggle) headerAIToggle.classList.add('ai-active');
                } else {
                    if (sidebarToggle) sidebarToggle.textContent = 'AI: OFF';
                    if (headerAILabel) headerAILabel.textContent = 'AI: OFF';
                    if (headerAIToggle) headerAIToggle.classList.remove('ai-active');
                }
            } else {
                console.error('Terminal instance or toggleAIMode method not found');
            }
        },
        
        cycleTheme: function() {
            if (window.OmegaCustomizer) {
                window.OmegaCustomizer.cycleColorScheme();
            }
        },
        
        showChart: function(symbol) {
            console.log(`📈 Loading chart for ${symbol}`);
            
            // Show the chart panel
            const chartPanel = document.getElementById('chart-panel');
            if (chartPanel) {
                chartPanel.style.display = 'block';
            }
            
            // Update symbol display
            const symbolDisplay = document.getElementById('chart-symbol-display');
            if (symbolDisplay) {
                symbolDisplay.textContent = `${symbol.toUpperCase()}/USD`;
            }
            
            // Clear previous chart
            const container = document.getElementById('chart-container');
            if (!container) return;
            
            container.innerHTML = '';
            
            // Create TradingView widget
            const widgetConfig = {
                symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
                interval: '60',
                theme: 'dark',
                style: '1',
                locale: 'en',
                toolbar_bg: 'rgba(0, 0, 0, 0.5)',
                enable_publishing: false,
                allow_symbol_change: false,
                hide_top_toolbar: false,
                hide_legend: true,
                save_image: false,
                container_id: 'chart-container',
                autosize: true,
                studies: [],
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                gridColor: 'rgba(0, 212, 255, 0.1)',
                height: 280,
                width: '100%'
            };
            
            // Create iframe with TradingView widget
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width: 100%; height: 280px; border: none; display: block;';
            iframe.scrolling = 'no';
            
            // Use TradingView's lightweight chart embed
            iframe.src = `https://s.tradingview.com/embed-widget/symbol-overview/?locale=en#${encodeURIComponent(JSON.stringify({
                symbols: [[`BINANCE:${symbol.toUpperCase()}USDT|1D`]],
                chartOnly: false,
                width: '100%',
                height: '280',
                colorTheme: 'dark',
                showVolume: false,
                scalePosition: 'no',
                scaleMode: 'Normal',
                fontFamily: 'Courier New, monospace',
                fontSize: '10',
                noTimeScale: false,
                valuesTracking: '1',
                changeMode: 'price-and-percent',
                chartType: 'area',
                lineColor: 'rgba(0, 212, 255, 1)',
                topColor: 'rgba(0, 212, 255, 0.4)',
                bottomColor: 'rgba(0, 212, 255, 0.0)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                gridLineColor: 'rgba(0, 212, 255, 0.1)'
            }))}`;
            
            container.appendChild(iframe);
            
            // Log to terminal
            if (window.terminal) {
                window.terminal.log(`📈 Chart loaded: ${symbol.toUpperCase()}/USD`, 'success');
                window.terminal.log(`📊 View the chart in the right panel →`, 'info');
            }
        },
        
        closeChart: function() {
            const chartPanel = document.getElementById('chart-panel');
            if (chartPanel) {
                chartPanel.style.display = 'none';
            }
        },
        
        toggleClassicMode: function() {
            const dashboard = document.querySelector('.omega-dashboard');
            const terminal = document.getElementById('terminal');
            
            if (dashboard && terminal) {
                // Toggle visibility
                if (dashboard.style.display === 'none') {
                    // Switch to futuristic mode
                    dashboard.style.display = 'grid';
                    document.body.classList.add('futuristic-mode');
                    console.log('🎨 Switched to Futuristic Mode');
                } else {
                    // Switch to classic mode
                    dashboard.style.display = 'none';
                    terminal.style.display = 'flex';
                    terminal.style.position = 'relative';
                    terminal.style.width = '100%';
                    terminal.style.height = '100vh';
                    terminal.style.maxWidth = '100%';
                    document.body.classList.remove('futuristic-mode');
                    console.log('🎨 Switched to Classic Mode');
                }
            }
        }
    };
    
    // Auto-transform when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformToDashboard);
    } else {
        transformToDashboard();
    }
    
})();
