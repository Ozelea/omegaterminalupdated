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
                    <div class="sidebar-title">🎵 MUSIC PLAYER</div>
                    <button class="sidebar-button" onclick="window.OmegaSpotify && window.OmegaSpotify.openPanel()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                        <span>Open Player</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'spotify')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span>Quick Controls</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="spotify" style="display: none;">
                        <button class="sub-action-button" onclick="window.OmegaSpotify && window.OmegaSpotify.togglePlay()">
                            <span>→ Play/Pause</span>
                        </button>
                        <button class="sub-action-button" onclick="window.OmegaSpotify && window.OmegaSpotify.nextTrack()">
                            <span>→ Next Track</span>
                        </button>
                        <button class="sub-action-button" onclick="window.OmegaSpotify && window.OmegaSpotify.previousTrack()">
                            <span>→ Previous Track</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('spotify search', 'Enter song or artist and press Enter:')">
                            <span>→ Search Music</span>
                        </button>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">SYSTEM</div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.toggleAI()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span id="sidebar-ai-toggle">Toggle AI</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.toggleViewMode()" id="view-mode-toggle-btn">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/></svg>
                        <span id="view-mode-label">Basic View</span>
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
                        <a href="https://omeganetwork.co/landing" target="_blank" class="terminal-icon-btn" title="Omega Network">
                            <svg viewBox="0 0 24 24"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                        </a>
                        <a href="https://discord.com/invite/omeganetwork" target="_blank" class="terminal-icon-btn" title="Discord">
                            <svg viewBox="0 0 24 24"><path d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8Z"/></svg>
                        </a>
                        <a href="https://x.com/omega_netw0rk" target="_blank" class="terminal-icon-btn" title="X (Twitter)">
                            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href="https://omega-6.gitbook.io/omega/" target="_blank" class="terminal-icon-btn" title="Documentation">
                            <svg viewBox="0 0 24 24"><path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5Z"/></svg>
                        </a>
                        <div class="terminal-divider"></div>
                        <button class="terminal-action-btn" onclick="window.FuturisticDashboard.toggleThemeMode()" id="theme-toggle-btn" title="Toggle Dark/Light Mode">
                            <svg viewBox="0 0 24 24"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/></svg>
                            <span id="theme-mode-label">Light</span>
                        </button>
                        <button class="terminal-action-btn" onclick="window.FuturisticDashboard.toggleViewMode()" id="view-toggle-btn" title="Toggle Basic/Dashboard View">
                            <svg viewBox="0 0 24 24"><path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/></svg>
                            <span id="view-mode-header-label">Basic</span>
                        </button>
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
        
        // Remove OLD terminal header from index.html (we have our own modern one)
        const originalHeader = terminal.querySelector('.terminal-header');
        if (originalHeader) {
            originalHeader.style.display = 'none';
        }
        
        // Remove old tab bar from index.html
        const oldTabBar = terminal.querySelector('.tab-bar');
        if (oldTabBar) {
            oldTabBar.style.display = 'none';
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
        
        // Replace header logo with SVG
        setTimeout(() => {
            if (window.OmegaSymbolLogo && window.OmegaSymbolLogo.replaceHeaderLogo) {
                window.OmegaSymbolLogo.replaceHeaderLogo();
                console.log('✅ Header logo initialized');
            }
        }, 100);
        
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
            const currentMode = localStorage.getItem('omega-view-mode') || 'futuristic';
            
            if (dashboard) {
                // Toggle based on current mode
                if (currentMode === 'basic') {
                    // Switch to futuristic mode
                    this.enableFuturisticMode();
                } else {
                    // Switch to basic mode
                    this.enableBasicMode();
                }
            }
        },
        
        toggleViewMode: function() {
            this.toggleClassicMode();
        },
        
        updateViewModeButton: function() {
            const viewModeLabel = document.getElementById('view-mode-label');
            const viewModeHeaderLabel = document.getElementById('view-mode-header-label');
            const currentMode = localStorage.getItem('omega-view-mode') || 'futuristic';
            
            if (viewModeLabel) {
                if (currentMode === 'basic') {
                    viewModeLabel.textContent = 'Dashboard View';
                } else {
                    viewModeLabel.textContent = 'Basic View';
                }
            }
            
            if (viewModeHeaderLabel) {
                if (currentMode === 'basic') {
                    viewModeHeaderLabel.textContent = 'Dashboard';
                } else {
                    viewModeHeaderLabel.textContent = 'Basic';
                }
            }
        },
        
        toggleThemeMode: function() {
            const currentTheme = localStorage.getItem('omega-theme-mode') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('omega-theme-mode', newTheme);
            
            // Check if terminal is in Apple UI (Modern UI) mode
            const terminal = document.getElementById('terminal');
            const isAppleUI = terminal && terminal.classList.contains('apple-ui');
            
            if (newTheme === 'light') {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                
                // Handle Apple UI theme specifically
                if (isAppleUI && terminal) {
                    terminal.classList.remove('dark');
                    console.log('✅ Apple UI: Switched to light mode');
                }
            } else {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                
                // Handle Apple UI theme specifically
                if (isAppleUI && terminal) {
                    terminal.classList.add('dark');
                    console.log('✅ Apple UI: Switched to dark mode');
                }
            }
            
            this.updateThemeModeButton();
            
            if (window.terminal) {
                window.terminal.log(`✅ Switched to ${newTheme} mode`, 'success');
            }
            
            console.log(`🎨 Theme switched to ${newTheme} mode`);
        },
        
        updateThemeModeButton: function() {
            const themeModeLabel = document.getElementById('theme-mode-label');
            const currentTheme = localStorage.getItem('omega-theme-mode') || 'dark';
            
            if (themeModeLabel) {
                if (currentTheme === 'dark') {
                    themeModeLabel.textContent = 'Light';
                } else {
                    themeModeLabel.textContent = 'Dark';
                }
            }
        },
        
        enableBasicMode: function() {
            const dashboard = document.querySelector('.omega-dashboard');
            const terminal = document.getElementById('terminal');
            const terminalWrapper = document.getElementById('terminal-wrapper');
            
            if (dashboard && terminalWrapper) {
                // Hide dashboard (keep terminal wrapper structure)
                dashboard.style.display = 'none';
                
                // Move terminal wrapper to body (not just terminal)
                if (terminalWrapper.parentElement !== document.body) {
                    document.body.appendChild(terminalWrapper);
                }
                
                // Style terminal wrapper for full-screen basic mode
                terminalWrapper.style.display = 'flex';
                terminalWrapper.style.flexDirection = 'column';
                terminalWrapper.style.position = 'fixed';
                terminalWrapper.style.top = '0';
                terminalWrapper.style.left = '0';
                terminalWrapper.style.width = '100vw';
                terminalWrapper.style.height = '100vh';
                terminalWrapper.style.maxWidth = '100vw';
                terminalWrapper.style.maxHeight = '100vh';
                terminalWrapper.style.zIndex = '1000';
                terminalWrapper.style.background = 'var(--void-black, #0a0a0f)';
                terminalWrapper.style.padding = '0';
                terminalWrapper.style.boxSizing = 'border-box';
                
                // HIDE the original terminal's header (from index.html) - prevent duplicates
                if (terminal) {
                    const originalTerminalHeader = terminal.querySelector('.terminal-header');
                    if (originalTerminalHeader) {
                        originalTerminalHeader.style.display = 'none';
                        originalTerminalHeader.style.visibility = 'hidden';
                        originalTerminalHeader.style.opacity = '0';
                    }
                    
                    // Also hide the old tab bar if it exists
                    const oldTabBar = terminal.querySelector('.tab-bar');
                    if (oldTabBar) {
                        oldTabBar.style.display = 'none';
                    }
                    
                    terminal.style.display = 'flex';
                    terminal.style.flexDirection = 'column';
                    terminal.style.width = '100%';
                    terminal.style.height = '100%';
                    terminal.style.background = 'transparent';
                    terminal.style.padding = '0';
                }
                
                // Apply modern futuristic UI classes
                document.body.classList.remove('futuristic-mode');
                document.body.classList.add('basic-terminal-mode');
                document.body.classList.add('modern-terminal-ui');
                
                // Ensure terminal wrapper has modern styling
                if (terminal) {
                    terminal.classList.add('modern-ui');
                    terminal.classList.add('futuristic-theme');
                }
                
                localStorage.setItem('omega-view-mode', 'basic');
                
                console.log('📺 Basic terminal mode enabled with modern UI');
                if (window.terminal) {
                    window.terminal.log('✅ Basic terminal mode enabled', 'success');
                }
                this.updateViewModeButton();
                this.updateThemeModeButton();
                
                // SHOW ONLY the terminal wrapper's header (the dashboard-style header with all controls)
                const terminalWrapperHeader = terminalWrapper.querySelector('.terminal-header');
                if (terminalWrapperHeader) {
                    terminalWrapperHeader.style.display = 'flex';
                    terminalWrapperHeader.style.visibility = 'visible';
                    terminalWrapperHeader.style.opacity = '1';
                    terminalWrapperHeader.style.pointerEvents = 'auto';
                }
                
                // Make sure terminal wrapper is visible
                terminalWrapper.style.display = 'flex';
            }
        },
        
        enableFuturisticMode: function() {
            const dashboard = document.querySelector('.omega-dashboard');
            const terminal = document.getElementById('terminal');
            const terminalWrapper = document.getElementById('terminal-wrapper');
            const dashboardTerminalSlot = dashboard ? dashboard.querySelector('main.omega-terminal') : null;
            
            if (dashboard && terminalWrapper) {
                // Find the correct place in dashboard to put terminal wrapper back
                const mainTerminalSlot = dashboard.querySelector('.omega-sidebar').nextElementSibling;
                
                // Move terminal wrapper back into dashboard
                if (mainTerminalSlot && terminalWrapper.parentElement !== mainTerminalSlot.parentElement) {
                    mainTerminalSlot.parentElement.insertBefore(terminalWrapper, mainTerminalSlot.nextSibling);
                }
                
                // Reset terminal wrapper styles
                if (terminalWrapper) {
                    terminalWrapper.style.display = '';
                    terminalWrapper.style.flexDirection = '';
                    terminalWrapper.style.position = '';
                    terminalWrapper.style.top = '';
                    terminalWrapper.style.left = '';
                    terminalWrapper.style.width = '';
                    terminalWrapper.style.height = '';
                    terminalWrapper.style.maxWidth = '';
                    terminalWrapper.style.maxHeight = '';
                    terminalWrapper.style.zIndex = '';
                    terminalWrapper.style.background = '';
                    terminalWrapper.style.padding = '';
                    terminalWrapper.style.boxSizing = '';
                }
                
                // Reset terminal styles
                if (terminal) {
                    terminal.style.display = '';
                    terminal.style.flexDirection = '';
                    terminal.style.width = '';
                    terminal.style.height = '';
                    terminal.style.background = '';
                    terminal.style.padding = '';
                    
                    // Keep modern UI classes
                    terminal.classList.add('modern-ui');
                    terminal.classList.add('futuristic-theme');
                }
                
                // Don't remove floating toggle - using header button instead
                // this.removeBasicModeToggle();
                
                // Show dashboard
                dashboard.style.display = 'grid';
                document.body.classList.add('futuristic-mode');
                document.body.classList.remove('basic-terminal-mode');
                document.body.classList.add('modern-terminal-ui');
                localStorage.setItem('omega-view-mode', 'futuristic');
                console.log('🚀 Futuristic dashboard mode enabled');
                if (window.terminal) {
                    window.terminal.log('✅ Futuristic dashboard mode enabled', 'success');
                }
                this.updateViewModeButton();
                this.updateThemeModeButton();
            } else {
                // Create dashboard if it doesn't exist
                transformToDashboard();
                document.body.classList.add('futuristic-mode');
                document.body.classList.remove('basic-terminal-mode');
                document.body.classList.add('modern-terminal-ui');
                localStorage.setItem('omega-view-mode', 'futuristic');
                this.updateViewModeButton();
                this.updateThemeModeButton();
            }
        },
        
        createBasicModeToggle: function() {
            // Don't create toggle if welcome screen is still showing
            if (!document.body.classList.contains('omega-initialized')) {
                console.log('⏳ Waiting for welcome screen to finish...');
                return;
            }
            
            // Remove existing toggle if it exists
            this.removeBasicModeToggle();
            
            // Create floating toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'basic-mode-toggle';
            toggleBtn.className = 'basic-mode-toggle';
            toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/>
                </svg>
                <span>Dashboard</span>
            `;
            toggleBtn.title = 'Switch to Dashboard View';
            toggleBtn.onclick = () => {
                this.enableFuturisticMode();
            };
            
            // Add styles - matching futuristic theme
            toggleBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(15, 15, 26, 0.85);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 8px;
                padding: 10px 16px;
                color: #00d4ff;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.25s ease;
                box-shadow: 0 2px 12px rgba(0, 212, 255, 0.15);
                backdrop-filter: blur(10px);
                text-transform: uppercase;
                letter-spacing: 1.5px;
            `;
            
            // Add hover effect
            toggleBtn.onmouseenter = () => {
                toggleBtn.style.background = 'rgba(15, 15, 26, 0.95)';
                toggleBtn.style.borderColor = '#00d4ff';
                toggleBtn.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.25)';
                toggleBtn.style.transform = 'translateY(-2px)';
                toggleBtn.style.color = '#00ffff';
            };
            
            toggleBtn.onmouseleave = () => {
                toggleBtn.style.background = 'rgba(15, 15, 26, 0.85)';
                toggleBtn.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                toggleBtn.style.boxShadow = '0 2px 12px rgba(0, 212, 255, 0.15)';
                toggleBtn.style.transform = 'translateY(0)';
                toggleBtn.style.color = '#00d4ff';
            };
            
            document.body.appendChild(toggleBtn);
            
            // Fade in animation
            setTimeout(() => {
                toggleBtn.style.opacity = '0';
                toggleBtn.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    toggleBtn.style.transition = 'all 0.3s ease';
                    toggleBtn.style.opacity = '1';
                    toggleBtn.style.transform = 'translateY(0)';
                }, 10);
            }, 10);
        },
        
        removeBasicModeToggle: function() {
            const existingToggle = document.getElementById('basic-mode-toggle');
            if (existingToggle) {
                existingToggle.remove();
            }
        }
    };
    
    // Auto-transform when DOM is ready (unless user prefers basic mode)
    const savedViewMode = localStorage.getItem('omega-view-mode');
    const savedTheme = localStorage.getItem('omega-theme-mode') || 'dark';
    
    // Apply theme immediately
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Always create the dashboard, but hide it if basic mode is preferred
            transformToDashboard();
            if (savedViewMode === 'basic') {
                setTimeout(() => {
                    window.FuturisticDashboard.enableBasicMode();
                    window.FuturisticDashboard.updateThemeModeButton();
                }, 100);
            } else {
                // Initialize button labels
                setTimeout(() => {
                    window.FuturisticDashboard.updateViewModeButton();
                    window.FuturisticDashboard.updateThemeModeButton();
                }, 100);
            }
        });
    } else {
        transformToDashboard();
        if (savedViewMode === 'basic') {
            setTimeout(() => {
                window.FuturisticDashboard.enableBasicMode();
                window.FuturisticDashboard.updateThemeModeButton();
            }, 100);
        } else {
            // Initialize button labels
            setTimeout(() => {
                window.FuturisticDashboard.updateViewModeButton();
                window.FuturisticDashboard.updateThemeModeButton();
            }, 100);
        }
    }
    
})();
