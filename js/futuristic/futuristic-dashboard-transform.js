// Futuristic Dashboard Transformation
// Transforms the existing terminal into a 3-panel dashboard

(function () {
  "use strict";

  console.log("🚀 Loading Futuristic Dashboard Transform...");

  function transformToDashboard() {
    console.log("🔧 Transforming terminal to futuristic dashboard...");

    // Wait for terminal to be ready
    if (!document.getElementById("terminal")) {
      console.log("⏳ Waiting for terminal...");
      setTimeout(transformToDashboard, 100);
      return;
    }

    const terminal = document.getElementById("terminal");
    if (!terminal) return;

    // Create dashboard wrapper
    const dashboard = document.createElement("div");
    dashboard.className = "omega-dashboard";
    dashboard.innerHTML = `
        <!-- Header removed - using terminal-wrapper header instead -->
            
            <!-- Sidebar -->
            <aside class="omega-sidebar">
                <div class="sidebar-section" data-section="system">
                    <div class="sidebar-title quick-actions-title">
                        <span>QUICK ACTIONS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('system')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('help')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"/></svg>
                        <span>System Help</span>
                    </button>
                    <button class="sidebar-button" onclick="if (window.MultiNetworkConnector && window.terminal) { MultiNetworkConnector.showNetworkSelector(window.terminal); } else { window.FuturisticDashboard.executeCommandDirect('connect'); }">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18H21M12,16V8H21V16H12Z"/></svg>
                        <span>Connect Wallet</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('faucet')">
                        <span>Claim Faucet</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'ai-assistant')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span>AI Assistant</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="ai-assistant" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.toggleAI()">
                            <span id="sidebar-ai-toggle">→ 🏠 Local AI Toggle</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('help')">
                            <span>→ 📚 Local AI Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.toggleViewMode()" id="view-mode-toggle-btn">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/></svg>
                        <span id="view-mode-label">Basic View</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('clear')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>
                        <span>Clear Terminal</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'terminal-style')">
                        <span>Terminal Style</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="terminal-style" style="display: none;">
                        <!-- Color Palettes Subsection -->
                        <div class="sub-section-header">
                            <span>Color Palettes</span>
                        </div>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.cycleColorPalette()">
                            <span>🔄 Cycle Palette</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color red')">
                            <span>Crimson</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color anime')">
                            <span>Anime</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color ocean')">
                            <span>Ocean</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color forest')">
                            <span>Forest</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color sunset')">
                            <span>Sunset</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color purple')">
                            <span>Purple</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color cyber')">
                            <span>Cyber</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color gold')">
                            <span>Gold</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color ice')">
                            <span>Ice</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color fire')">
                            <span>Fire</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('color reset')">
                            <span>Reset Default</span>
                        </button>
                        
                        <!-- Themes Subsection -->
                        <div class="sub-section-header">
                            <span>Themes</span>
                        </div>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.cycleTheme()">
                            <span>🔄 Cycle Theme</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme executive')">
                            <span>Executive</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme modern')">
                            <span>Modern UI</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme dark')">
                            <span>Dark</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme light')">
                            <span>Light</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme matrix')">
                            <span>Matrix</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme retro')">
                            <span>Retro</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('theme powershell')">
                            <span>PowerShell</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="crypto-news">
                    <div class="sidebar-title">
                        <span>CRYPTO NEWS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('crypto-news')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.OmegaNewsReader && window.OmegaNewsReader.openPanel()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z"/></svg>
                        <span>Open News Reader</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('news latest')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M4,6H20V8H4V6M4,11H20V13H4V11M4,16H20V18H4V16Z"/></svg>
                        <span>Latest News</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('news hot')">
                        <span>Trending News</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'crypto-news')">
                        <span>Crypto News</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="crypto-news" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news btc')">
                            <span>→ ₿ Bitcoin News</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news eth')">
                            <span>→ Ξ Ethereum News</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news sol')">
                            <span>→ ◎ Solana News</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('news search', 'Enter search query and press Enter:')">
                            <span>→ 🔍 Search News</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news category news')">
                            <span>→ 📰 News Articles</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news sources')">
                            <span>→ 📡 News Sources</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news expand-all')">
                            <span>→ 📖 Expand All</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news collapse-all')">
                            <span>→ 📄 Collapse All</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news clear-expansions')">
                            <span>→ 🧹 Clear & Reload</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('news help')">
                            <span>→ ❓ News Help</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="nft-explorer">
                    <div class="sidebar-title">
                        <span>NFT EXPLORER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('nft-explorer')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'magiceden')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M21.71,8.71C22.68,7.74 23.5,6.67 24,5.5C22.8,5.56 21.65,6.03 20.68,6.79C19.69,7.56 18.9,8.58 18.4,9.75C17.9,10.92 17.7,12.19 17.84,13.44C18,14.69 18.5,15.87 19.27,16.87C18.32,17.78 17.18,18.46 15.95,18.87C14.72,19.27 13.42,19.39 12.15,19.21C10.88,19.03 9.67,18.56 8.63,17.84C7.6,17.12 6.74,16.16 6.13,15.06C6.53,15.93 7.11,16.7 7.81,17.33C8.5,17.95 9.31,18.42 10.18,18.72C11.05,19.03 11.97,19.16 12.89,19.11C13.8,19.06 14.7,18.83 15.53,18.44C16.36,18.05 17.09,17.5 17.69,16.84C18.29,16.17 18.76,15.4 19.06,14.56C19.37,13.72 19.51,12.83 19.47,11.94C19.44,11.05 19.22,10.18 18.84,9.38L18.85,9.35C19.19,8.94 19.57,8.56 20,8.22C20.65,7.73 21.17,8.21 21.71,8.71M12,2C10.69,2 9.39,2.3 8.18,2.86C6.97,3.42 5.88,4.23 4.95,5.22C3.03,7.2 2,9.88 2,12.67C2,15.47 3.03,18.15 4.95,20.13C5.88,21.12 6.97,21.93 8.18,22.49C9.39,23.05 10.69,23.35 12,23.35C14.78,23.35 17.43,22.25 19.39,20.26C21.35,18.27 22.42,15.56 22.42,12.72C22.42,9.88 21.35,7.17 19.39,5.18C17.43,3.19 14.78,2.09 12,2.09V2M12,4C14.12,4 16.16,4.84 17.66,6.36C19.16,7.89 20,9.96 20,12.11C20,14.27 19.16,16.34 17.66,17.86C16.16,19.39 14.12,20.23 12,20.23C9.88,20.23 7.84,19.39 6.34,17.86C4.84,16.34 4,14.27 4,12.11C4,9.96 4.84,7.89 6.34,6.36C7.84,4.84 9.88,4 12,4Z"/></svg>
                        <span>Solana NFTs</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="magiceden" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden view', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 🖼️ View Collection</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('magiceden trending 7d')">
                            <span>→ 🔥 Trending NFTs</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden activities', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 📊 Collection Activity</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden stats', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 📈 Collection Stats</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden listings', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 🏷️ Listings</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden holders', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 👥 Holder Stats</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('magiceden attributes', 'Enter collection symbol (e.g., degods) and press Enter:')">
                            <span>→ 🎨 Attributes</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('magiceden help')">
                            <span>→ ❓ Magic Eden Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button" style="opacity: 0.5; cursor: not-allowed;">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C8.69,6 6,8.69 6,12C6,15.31 8.69,18 12,18C15.31,18 18,15.31 18,12C18,8.69 15.31,6 12,6Z"/></svg>
                        <span>EVM (Coming Soon)</span>
                    </button>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="trading-analytics">
                    <div class="sidebar-title">
                        <span>TRADING & ANALYTICS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('trading-analytics')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.OmegaPerpsViewer && window.OmegaPerpsViewer.openPanel()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6M16,17V15H14V17M14,13V7H12V13M10,17V11H8V17H10Z"/></svg>
                        <span>Omega Perps</span>
                    </button>
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
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.showChart('TVC:GOLD')">
                            <span>→ Gold Chart</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.showChart('TVC:SILVER')">
                            <span>→ Silver Chart</span>
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
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('dexscreener search BTC')">
                            <span>→ BTC Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('dexscreener search ETH')">
                            <span>→ ETH Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('dexscreener search SOL')">
                            <span>→ SOL Analytics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('dexscreener', 'Enter token symbol and press Enter:')">
                            <span>→ Custom Token</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'defillama')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>
                        <span>DeFi Llama</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="defillama" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama tvl')">
                            <span>→ 📊 Total DeFi TVL</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama protocols 5')">
                            <span>→ 🏛️ Top 5 Protocols</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama chains 10')">
                            <span>→ ⛓️ Top 10 Chains</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('defillama tvl', 'Enter protocol name and press Enter:')">
                            <span>→ 🔍 Protocol TVL</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama price ethereum')">
                            <span>→ 💰 ETH Price</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama tokens eth,btc,sol')">
                            <span>→ 💎 Multi-Token Prices</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('defillama price', 'Enter token name and press Enter:')">
                            <span>→ 🔍 Custom Token Price</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('defillama trending')">
                            <span>→ 📈 Trending Protocols</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('defillama debug', 'Enter token name to debug and press Enter:')">
                            <span>→ 🐛 Debug Token Price</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="portfolio-tracker">
                    <div class="sidebar-title">
                        <span>PORTFOLIO TRACKER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('portfolio-tracker')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('balance')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/></svg>
                        <span>Check Balance</span>
                    </button>
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
                </div>
                
                <div class="sidebar-section" data-section="network">
                    <div class="sidebar-title">
                        <span>NETWORK</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('network')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <!-- EVM Networks Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'evm')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/></svg>
                        <span>EVM Networks</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="evm" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('connect')">
                            <span>→ 🔗 Connect Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('disconnect')">
                            <span>→ 🔌 Disconnect</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('send', 'Enter: <amount> <address> (e.g., 0.5 0x123...):')">
                            <span>→ 📤 Send Tokens</span>
                        </button>
                        <div style="border-top: 1px solid rgba(0, 212, 255, 0.2); margin: 8px 0; padding-top: 4px;"></div>
                        <button class="sub-action-button" style="font-size: 0.85em; color: rgba(255,255,255,0.7);">
                            <span>⟠ Ethereum • 🟡 BSC • 🟣 Polygon</span>
                        </button>
                        <button class="sub-action-button" style="font-size: 0.85em; color: rgba(255,255,255,0.7);">
                            <span>🔵 Arbitrum • 🔴 Optimism • 🔷 Base</span>
                        </button>
                    </div>
                    <!-- Omega Network Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'omega')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                        <span>Omega Network</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="omega" style="display: none;">
                        <!-- Ambassador Program Subsection -->
                        <div class="sub-section-header">
                            <span>Ambassador Program</span>
                        </div>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral create')">
                            <span>→ 🎯 Create Referral Code</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral stats')">
                            <span>→ 📊 View Stats</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral leaderboard')">
                            <span>→ 🏆 Leaderboard</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral share twitter')">
                            <span>→ 🐦 Share on Twitter</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral share discord')">
                            <span>→ 💬 Share on Discord</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('referral dashboard')">
                            <span>→ 📈 Open Dashboard</span>
                        </button>
                        
                        <!-- Network Tools Subsection -->
                        <div class="sub-section-header">
                            <span>Network Tools</span>
                        </div>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('faucet')">
                            <span>→ 💧 Claim Faucet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome help')">
                            <span>→ 🏛️ Rome Commands</span>
                        </button>
                        
                        <!-- External Links Subsection -->
                        <div class="sub-section-header">
                            <span>External Links</span>
                        </div>
                        <button class="sub-action-button" onclick="window.open('https://omeganetwork.co/landing', '_blank')">
                            <span>→ 🌐 Omega Network</span>
                        </button>
                        <button class="sub-action-button" onclick="window.open('https://discord.com/invite/omeganetwork', '_blank')">
                            <span>→ 💬 Discord</span>
                        </button>
                        <button class="sub-action-button" onclick="window.open('https://x.com/omega_netw0rk', '_blank')">
                            <span>→ 🐦 X (Twitter)</span>
                        </button>
                    </div>
                    <!-- Solana Network Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'solana')">
                        <span>Solana</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="solana" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana connect')">
                            <span>→ 👛 Connect Phantom</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana generate')">
                            <span>→ 🔑 Generate Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana status')">
                            <span>→ 📊 Wallet Status</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('solana swap')">
                            <span>→ 🔄 Token Swap</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('solana search', 'Enter token name or symbol and press Enter:')">
                            <span>→ 🔍 Search Tokens</span>
                        </button>
                    </div>
                    <!-- NEAR Network Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'near')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M17,8L12,17L7,8H9.5L12,13.29L14.5,8M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z"/></svg>
                        <span>NEAR Protocol</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="near" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near connect')">
                            <span>→ 👛 Connect NEAR Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near disconnect')">
                            <span>→ 🔌 Disconnect Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near account')">
                            <span>→ 📋 Account Info</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near swap')">
                            <span>→ 🔄 Token Swap</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('near quote', 'Enter: <from> <to> <amount> (e.g., NEAR USDT 1.0):')">
                            <span>→ 💱 Get Swap Quote</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near validators')">
                            <span>→ ✅ View Validators</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('near help')">
                            <span>→ ❓ NEAR Help</span>
                        </button>
                    </div>
                    <!-- ROME Network Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'rome')">
                        <span>ROME Network</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="rome" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome help')">
                            <span>→ ❓ ROME Help</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome token create')">
                            <span>→ 🪙 Create Token</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome network status')">
                            <span>→ 📊 Network Status</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome transactions')">
                            <span>→ 📋 View Transactions</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('rome validators')">
                            <span>→ ✅ Validators</span>
                        </button>
                    </div>
                    <!-- FAIR Blockchain Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'fair')">
                        <span>FAIR Blockchain</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="fair" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair help')">
                            <span>→ ❓ FAIR Help</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair generate')">
                            <span>→ 🔑 Generate Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair connect')">
                            <span>→ 🔗 Connect MetaMask</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair network')">
                            <span>→ 🌐 Network Info</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('fair transactions')">
                            <span>→ 📋 View Transactions</span>
                        </button>
                    </div>
                    <!-- MONAD Network Subsection -->
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'monad')">
                        <span>MONAD Network</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="monad" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad help')">
                            <span>→ ❓ MONAD Help</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad connect')">
                            <span>→ 🔗 Connect Wallet</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad balance')">
                            <span>→ 💰 Check Balance</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad network')">
                            <span>→ 🌐 Network Info</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad validators')">
                            <span>→ ✅ Validators</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad transactions')">
                            <span>→ 📋 View Transactions</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad staking')">
                            <span>→ 🏦 Staking</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('monad governance')">
                            <span>→ 🗳️ Governance</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="transactions">
                    <div class="sidebar-title">
                        <span>TRANSACTIONS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('transactions')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
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
                </div>
                
                <div class="sidebar-section" data-section="chaingpt-tools">
                    <div class="sidebar-title">
                        <span>CHAINGPT TOOLS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('chaingpt-tools')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'chaingpt-chat')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span>ChainGPT Chat</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="chaingpt-chat" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chat init', 'Enter your ChainGPT API key (optional - uses default if empty):')">
                            <span>→ 🔑 Custom API Key</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chat ask', 'Enter your question and press Enter:')">
                            <span>→ 💬 Ask Question</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chat stream', 'Enter your question for real-time streaming:')">
                            <span>→ 🌊 Stream Response</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chat context', 'Enter your question with custom context:')">
                            <span>→ 🎯 With Context</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('chat history', 'Enter your question with conversation memory:')">
                            <span>→ 🧠 With Memory</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('chat test')">
                            <span>→ 🧪 Test API</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('chat help')">
                            <span>→ ❓ Chat Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'nft')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/></svg>
                        <span>NFT Generator</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="nft" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('nft init', 'Enter your ChainGPT API key (optional - uses default if empty):')">
                            <span>→ 🔑 Custom API Key</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('nft generate', 'Enter your NFT prompt and press Enter:')">
                            <span>→ 🎨 Generate AI NFT</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft models')">
                            <span>→ 🤖 AI Models</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft styles')">
                            <span>→ 🎭 Art Styles</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('nft enhance', 'Enter prompt to enhance and press Enter:')">
                            <span>→ ✨ Enhance Prompt</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft gallery')">
                            <span>→ 🖼️ View Gallery</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft test')">
                            <span>→ 🧪 Test API</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('opensea trending')">
                            <span>→ 📊 Trending NFTs</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('nft help')">
                            <span>→ ❓ NFT Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'smart-contract-creator')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
                        <span>Smart Contract Creator</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="smart-contract-creator" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('contract init', 'Enter your ChainGPT API key (optional - uses default if empty):')">
                            <span>→ 🔑 Custom API Key</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('contract generate', 'Enter your smart contract description and press Enter:')">
                            <span>→ 📜 Generate Contract</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('contract templates')">
                            <span>→ 📋 Templates</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('contract chains')">
                            <span>→ ⛓️ Supported Chains</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('contract types')">
                            <span>→ 🏗️ Contract Types</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('contract test')">
                            <span>→ 🧪 Test API</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('contract help')">
                            <span>→ ❓ Creator Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'smart-contract-auditor')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/></svg>
                        <span>Smart Contract Auditor</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="smart-contract-auditor" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('auditor init', 'Enter your ChainGPT API key (optional - uses default if empty):')">
                            <span>→ 🔑 Custom API Key</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('auditor audit', 'Enter your smart contract code to audit and press Enter:')">
                            <span>→ 🔍 Audit Contract</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('auditor severity')">
                            <span>→ ⚠️ Severity Levels</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('auditor categories')">
                            <span>→ 🛡️ Security Categories</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('auditor levels')">
                            <span>→ 📊 Audit Levels</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('auditor test')">
                            <span>→ 🧪 Test API</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('auditor help')">
                            <span>→ ❓ Auditor Help</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="music-player">
                    <div class="sidebar-title">
                        <span>MUSIC PLAYER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('music-player')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.OmegaSpotify && window.OmegaSpotify.openPanel()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                        <span>Open Spotify</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'spotify')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <span>Spotify Controls</span>
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
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'custom-music')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V3H12Z"/></svg>
                        <span>Custom Music</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="custom-music" style="display: none;">
                        <button class="sub-action-button" onclick="window.OmegaCustomMusicPlayer && window.OmegaCustomMusicPlayer.createPanel()">
                            <span>→ Open Custom Player</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('upload music')">
                            <span>→ Upload Tracks</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('playlist')">
                            <span>→ Manage Playlist</span>
                        </button>
                    </div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('blues')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V3H12Z"/></svg>
                        <span>Omega Player</span>
                    </button>
                    </div>
                </div>
                
                <div class="sidebar-section" data-section="youtube-player">
                    <div class="sidebar-title">
                        <span>YOUTUBE PLAYER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('youtube-player')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.OmegaYouTube && window.OmegaYouTube.createPanel()">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"/></svg>
                        <span>Open YouTube</span>
                    </button>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'youtube')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
                        <span>YouTube Controls</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="youtube" style="display: none;">
                        <button class="sub-action-button" onclick="window.OmegaYouTube && window.OmegaYouTube.togglePlayPause()">
                            <span>→ Play/Pause</span>
                        </button>
                        <button class="sub-action-button" onclick="window.OmegaYouTube && window.OmegaYouTube.next()">
                            <span>→ Next Video</span>
                        </button>
                        <button class="sub-action-button" onclick="window.OmegaYouTube && window.OmegaYouTube.previous()">
                            <span>→ Previous Video</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('youtube search', 'Enter search query and press Enter:')">
                            <span>→ Search Videos</span>
                        </button>
                        <button class="sub-action-button" onclick="window.OmegaYouTube && window.OmegaYouTube.toggleMute()">
                            <span>→ Mute/Unmute</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('youtube help')">
                            <span>→ YouTube Help</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <!-- Mining & Rewards Section -->
                <div class="sidebar-section" data-section="mining-rewards">
                    <div class="sidebar-title">
                        <span>MINING & REWARDS</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('mining-rewards')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('mine')">
                        <span>Start Mining</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('claim')">
                        <span>Claim Rewards</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('status')">
                        <span>Mining Status</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('stats')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6M16,17V15H14V17M14,13V7H12V13M10,17V11H8V17H10Z"/></svg>
                        <span>Mining Stats</span>
                    </button>
                    </div>
                </div>
                
                <!-- Advanced Trading Section -->
                <div class="sidebar-section" data-section="advanced-trading">
                    <div class="sidebar-title">
                        <span>ADVANCED TRADING</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('advanced-trading')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'hyperliquid')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/></svg>
                        <span>Hyperliquid</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="hyperliquid" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('hyperliquid help')">
                            <span>→ Hyperliquid Help</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('hyperliquid markets')">
                            <span>→ Markets</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('hyperliquid positions')">
                            <span>→ Positions</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'polymarket')">
                        <span>Polymarket</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="polymarket" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket markets')">
                            <span>→ Active Markets</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket trending')">
                            <span>→ Trending</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket politics')">
                            <span>→ Politics</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket sports')">
                            <span>→ Sports</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket crypto')">
                            <span>→ Crypto</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket breaking')">
                            <span>→ Breaking News</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandWithInput('polymarket search', 'Enter search query and press Enter:')">
                            <span>→ Search Markets</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('polymarket help')">
                            <span>→ Polymarket Help</span>
                        </button>
                    </div>
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'kalshi')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 12,8Z"/></svg>
                        <span>Kalshi</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="kalshi" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('kalshi help')">
                            <span>→ Kalshi Help</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('kalshi markets')">
                            <span>→ Markets</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('kalshi trending')">
                            <span>→ Trending</span>
                        </button>
                    </div>
                    </div>
                </div>
                
                <!-- Entertainment & Games Section -->
                <div class="sidebar-section" data-section="entertainment">
                    <div class="sidebar-title">
                        <span>ENTERTAINMENT & GAMES</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('entertainment')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                    <button class="sidebar-button sidebar-expandable" onclick="window.FuturisticDashboard.toggleSubActions(this, 'games')">
                        <span>Games</span>
                        <svg class="expand-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </button>
                    <div class="sub-actions" data-parent="games" style="display: none;">
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('games')">
                            <span>→ Game List</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('play snake')">
                            <span>→ Snake Game</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('play pacman')">
                            <span>→ Pacman</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('play clicker')">
                            <span>→ Clicker Game</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('arcade')">
                            <span>→ Arcade Mode</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('flappy')">
                            <span>→ Flappy Bird</span>
                        </button>
                        <button class="sub-action-button" onclick="window.FuturisticDashboard.executeCommandDirect('mystery-box')">
                            <span>→ Mystery Box</span>
                        </button>
                    </div>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('fortune')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        <span>Fortune Cookie</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('matrix')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M2,2V4H4V2H2M6,2V4H8V2H6M10,2V4H12V2H10M14,2V4H16V2H14M18,2V4H20V2H18M22,2V4H24V2H22M2,6V8H4V6H2M6,6V8H8V6H6M10,6V8H12V6H10M14,6V8H16V6H14M18,6V8H20V6H18M22,6V8H24V6H22M2,10V12H4V10H2M6,10V12H8V10H6M10,10V12H12V10H10M14,10V12H16V10H14M18,10V12H20V10H18M22,10V12H24V10H22M2,14V16H4V14H2M6,14V16H8V14H6M10,14V16H12V14H10M14,14V16H16V14H14M18,14V16H20V14H18M22,14V16H24V14H22M2,18V20H4V18H2M6,18V20H8V18H6M10,18V20H12V18H10M14,18V20H16V18H14M18,18V20H20V18H18M22,18V20H24V18H22M2,22V24H4V22H2M6,22V24H8V22H6M10,22V24H12V22H10M14,22V24H16V22H14M18,22V24H20V22H18M22,22V24H24V22H22Z"/></svg>
                        <span>Matrix Effect</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('hack')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        <span>Hack Effect</span>
                    </button>
                    <button class="sidebar-button" onclick="window.FuturisticDashboard.executeCommandDirect('disco')">
                        <svg class="sidebar-icon" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        <span>Disco Mode</span>
                    </button>
                    </div>
                </div>
                
                
            </aside>
            
            <!-- Main Terminal (will be moved here) -->
            <main class="omega-terminal" id="terminal-wrapper">
                <div class="terminal-header">
                    <div class="terminal-title">
                        <span id="omega-title-symbol"></span>
                        <span>OMEGA TERMINAL v2.0.1</span>
                    </div>
                    <div class="terminal-controls">
                        <!-- Status Indicators -->
                        <div class="status-indicator">
                            <div class="status-dot" id="futuristic-connection-status"></div>
                            <span id="futuristic-connection-text">INITIALIZING</span>
                        </div>
                        
                        <div class="status-indicator">
                            <span id="futuristic-wallet-info">NO WALLET</span>
                        </div>
                        
                        <div class="status-indicator" id="network-status-display" style="display: none;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div id="network-logo-container" style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: 20px;
                                    height: 20px;
                                    background: var(--palette-bg-primary, rgba(0, 0, 0, 0.9));
                                    border-radius: 50%;
                                    font-size: 14px;
                                    font-weight: bold;
                                    font-family: serif, 'Times New Roman';
                                    color: var(--palette-primary, #ffffff);
                                    box-shadow: 0 0 8px var(--palette-primary-glow, rgba(255, 255, 255, 0.6));
                                    border: 1px solid var(--palette-primary, #ffffff);
                                    backdrop-filter: blur(10px);
                                ">Ω</div>
                                <span id="network-name-display">Omega Network</span>
                            </div>
                            <span id="wallet-address-display">0x3d0e...133d</span>
                        </div>
                        
                        <div class="terminal-divider"></div>
                        
                        <!-- AI Provider Select -->
                        <label for="wrapperAiProviderSelect" style="color: var(--palette-text-primary, var(--cyber-blue-bright)); font-family: 'Courier New', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 6px;">AI:</label>
                        <select id="wrapperAiProviderSelect" title="Select AI Provider" style="
                            background: var(--palette-bg-overlay, rgba(0, 212, 255, 0.08));
                            border: 1px solid var(--palette-border, rgba(0, 212, 255, 0.3));
                            border-radius: 6px;
                            padding: 6px 10px;
                            color: var(--palette-text-primary, var(--cyber-blue-bright));
                            font-family: 'Courier New', monospace;
                            font-size: 11px;
                            font-weight: 600;
                            cursor: pointer;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            background-image: linear-gradient(45deg, transparent 50%, var(--palette-primary, var(--cyber-blue-bright)) 50%), linear-gradient(135deg, var(--palette-primary, var(--cyber-blue-bright)) 50%, transparent 50%);
                            background-position: calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px);
                            background-size: 5px 5px, 5px 5px;
                            background-repeat: no-repeat;
                            min-width: 120px;
                            margin-right: 8px;
                        ">
                            <option value="off">Off</option>
                            <option value="near">NEAR AI</option>
                            <option value="openai">OpenAI</option>
                        </select>
                        
                        <!-- Theme Toggle -->
                        <button class="terminal-icon-btn" onclick="window.FuturisticDashboard.toggleThemeMode()" id="theme-toggle-btn" title="Toggle Dark/Light Mode">
                            <svg viewBox="0 0 24 24"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/></svg>
                        </button>
                        
                        <!-- Color Palette Toggle -->
                        <button class="terminal-icon-btn" onclick="window.FuturisticDashboard.cycleColorPalette()" id="palette-toggle-btn" title="Cycle Color Palette">
                            <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/></svg>
                        </button>
                        
                        <!-- Theme Cycle Toggle -->
                        <button class="terminal-icon-btn" onclick="window.FuturisticDashboard.cycleTheme()" id="theme-cycle-btn" title="Cycle Theme">
                            <svg viewBox="0 0 24 24"><path d="M12,2C6.5,2 2,6.5 2,12C2,17.5 6.5,22 12,22C17.5,22 22,17.5 22,12C22,6.5 17.5,2 12,2M12,4C16.4,4 20,7.6 20,12C20,16.4 16.4,20 12,20C7.6,20 4,16.4 4,12C4,7.6 7.6,4 12,4M12,6C8.7,6 6,8.7 6,12C6,15.3 8.7,18 12,18C15.3,18 18,15.3 18,12C18,8.7 15.3,6 12,6M12,8C14.2,8 16,9.8 16,12C16,14.2 14.2,16 12,16C9.8,16 8,14.2 8,12C8,9.8 9.8,8 12,8M12,10C10.9,10 10,10.9 10,12C10,13.1 10.9,14 12,14C13.1,14 14,13.1 14,12C14,10.9 13.1,10 12,10Z"/></svg>
                        </button>
                        
                        <!-- View Mode Toggle -->
                        <button class="terminal-icon-btn" onclick="window.FuturisticDashboard.toggleViewMode()" id="view-toggle-btn" title="Toggle Basic/Dashboard View">
                            <svg viewBox="0 0 24 24"><path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/></svg>
                        </button>
                        
                        <div class="terminal-divider"></div>
                        
                        <!-- External Links -->
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
                    </div>
                </div>
                <!-- Original terminal will be inserted here -->
            </main>
            
            <!-- Stats Panel -->
            <aside class="omega-sidebar omega-stats">
                <div class="sidebar-section" data-section="portfolio-tracker" id="pgt-stats-panel" style="display: none;">
                    <div class="sidebar-title">
                        <span>PORTFOLIO TRACKER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.toggleSection('portfolio-tracker')" title="Minimize/Expand Section">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
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
                </div>
                
                <div class="sidebar-section" data-section="chart-viewer" id="chart-panel" style="display: none;">
                    <div class="sidebar-title">
                        <span>CHART VIEWER</span>
                        <button class="section-toggle" onclick="window.FuturisticDashboard.closeChart()" title="Close Chart">
                            <svg class="toggle-icon" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>
                        </button>
                    </div>
                    <div class="sidebar-section-content">
                        <div id="chart-symbol-display" style="font-size: 11px; color: var(--palette-text-primary, var(--cyber-blue-bright)); margin-bottom: 8px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-mono);">
                        BTC/USD
                    </div>
                        <div id="chart-container" style="width: 100%; height: 280px; position: relative; background: var(--palette-bg-overlay, rgba(0, 0, 0, 0.3)); border-radius: 8px; overflow: hidden; border: 1px solid var(--palette-border, rgba(0, 212, 255, 0.2));">
                        <!-- TradingView widget will be inserted here -->
                        </div>
                    </div>
                </div>
            </aside>
        `;

    // Insert dashboard before terminal
    document.body.insertBefore(dashboard, terminal);

    // Move terminal into dashboard
    const terminalWrapper = document.getElementById("terminal-wrapper");
    terminalWrapper.appendChild(terminal);

    // Initialize header AI provider dropdown
    setTimeout(() => {
      const selWrapper = document.getElementById("wrapperAiProviderSelect");
      const applyInit = (control) => {
        if (!control) return;
        let provider = "off";
        if (window.terminal && window.terminal.aiProvider) {
          provider = window.terminal.aiProvider;
        } else {
          provider = localStorage.getItem("omega-ai-provider") || "off";
        }
        try {
          control.value = provider;
          // Initialize colors based on current provider
          window.FuturisticDashboard.updateAIDropdownColors(control, provider);
        } catch (e) {}
        control.addEventListener("change", (e) => {
          const val = e.target.value;
          if (
            window.terminal &&
            typeof window.terminal.setAIProvider === "function"
          ) {
            window.terminal.setAIProvider(val);
          } else {
            localStorage.setItem("omega-ai-provider", val);
          }
          // Update sidebar label immediately
          if (
            window.FuturisticDashboard &&
            typeof window.FuturisticDashboard.syncAIToggleState === "function"
          ) {
            window.FuturisticDashboard.syncAIToggleState();
          }
          // Update AI dropdown colors based on state
          window.FuturisticDashboard.updateAIDropdownColors(control, val);
        });
      };
      applyInit(selWrapper);
    }, 0);

    // Remove OLD terminal header from index.html (we have our own modern one)
    const originalHeader = terminal.querySelector(".terminal-header");
    if (originalHeader) {
      originalHeader.style.display = "none";
    }

    // Remove old tab bar from index.html
    const oldTabBar = terminal.querySelector(".tab-bar");
    if (oldTabBar) {
      oldTabBar.style.display = "none";
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

    // Restore minimized sections
    setTimeout(() => {
      window.FuturisticDashboard.restoreMinimizedSections();
    }, 100);

    // Replace header logo with SVG
    setTimeout(() => {
      if (window.OmegaSymbolLogo && window.OmegaSymbolLogo.replaceHeaderLogo) {
        window.OmegaSymbolLogo.replaceHeaderLogo();
        console.log("✅ Header logo initialized");
      }
    }, 100);

    // Initialize Omega symbol in title
    setTimeout(() => {
      const titleSymbol = document.getElementById('omega-title-symbol');
      if (titleSymbol && window.OmegaSymbolLogo && window.OmegaSymbolLogo.createOmegaSVG) {
        const omegaSymbol = window.OmegaSymbolLogo.createOmegaSVG({
          size: 24,
          color: 'var(--palette-primary, #ffffff)',
          glowColor: 'var(--palette-primary-glow, rgba(255, 255, 255, 0.6))',
          className: 'title-omega-svg',
          showOuterRing: false,
          showGlow: true
        });
        titleSymbol.appendChild(omegaSymbol);
        console.log("✅ Title Omega symbol initialized");
      }
    }, 100);

    console.log("✅ Dashboard transformation complete!");
  }

  // Dashboard controller
  window.FuturisticDashboard = {
    commandCount: 0,
    startTime: Date.now(),

    executeCommand: function (cmd) {
      console.log("Executing command:", cmd);
      this.commandCount++;
      const commandsEl = document.getElementById("futuristic-commands");
      if (commandsEl) {
        commandsEl.textContent = this.commandCount;
      }

      // Add to activity log
      const activity = document.getElementById("futuristic-activity");
      if (activity) {
        const entry = document.createElement("div");
        entry.style.padding = "4px 0";
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

    toggleSubActions: function (button, parentId) {
      const subMenu = document.querySelector(
        `.sub-actions[data-parent="${parentId}"]`
      );
      const expandIcon = button.querySelector(".expand-icon");

      if (!subMenu) return;

      // Close other sub-menus
      document.querySelectorAll(".sub-actions").forEach((menu) => {
        if (menu !== subMenu) {
          menu.style.display = "none";
          const otherButton = document.querySelector(
            `.sidebar-expandable[onclick*="${menu.dataset.parent}"]`
          );
          if (otherButton) {
            const otherIcon = otherButton.querySelector(".expand-icon");
            if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
            otherButton.classList.remove("expanded");
          }
        }
      });

      // Toggle current menu
      const isOpen = subMenu.style.display === "block";
      subMenu.style.display = isOpen ? "none" : "block";
      if (expandIcon) {
        expandIcon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
      }
      button.classList.toggle("expanded", !isOpen);
    },

    executeCommandWithInput: function (baseCmd, promptText) {
      // Use terminal's input instead of popup
      const terminal = window.terminal;
      const input = document.getElementById("commandInput");

      if (!terminal || !input) {
        console.error("Terminal or input not found");
        return;
      }

      // Show prompt in terminal
      terminal.log("💡 " + promptText, "info");
      terminal.log("", "output");

      // Pre-fill the command input with the base command and a space
      input.value = baseCmd + " ";

      // Focus the input so user can type
      input.focus();

      // Position cursor at the end
      setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    },

    sendCommandToTerminal: function (cmd) {
      const input = document.getElementById("commandInput");
      if (!input) {
        console.error("Command input not found");
        return;
      }

      // Set the command value
      input.value = cmd;

      // Trigger the input event first
      const inputEvent = new Event("input", { bubbles: true });
      input.dispatchEvent(inputEvent);

      // Create and dispatch keypress event (what terminal-core.js listens for)
      const keypressEvent = new KeyboardEvent("keypress", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });

      console.log("Dispatching keypress event for command:", cmd);
      input.dispatchEvent(keypressEvent);

      // Also try keydown as backup
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(keydownEvent);
    },

    // Show command feedback in futuristic UI
    showCommandFeedback: function(command, message) {
        console.log('🎯 Showing command feedback:', command, message);
        
        // Create or update command feedback display
        let feedbackEl = document.getElementById('futuristic-command-feedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('div');
            feedbackEl.id = 'futuristic-command-feedback';
            feedbackEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border: 2px solid var(--palette-primary, #00d4ff);
                border-radius: 12px;
                padding: 16px 20px;
                color: var(--palette-primary, #00d4ff);
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: 700;
                z-index: 10001;
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.1);
                transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                max-width: 350px;
                word-wrap: break-word;
                text-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
                animation: futuristicPulse 2s ease-in-out infinite;
            `;
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes futuristicPulse {
                    0%, 100% { 
                        box-shadow: 0 0 30px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.1);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(0, 212, 255, 0.8), inset 0 0 30px rgba(0, 212, 255, 0.2);
                        transform: scale(1.02);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(feedbackEl);
            console.log('✅ Created futuristic feedback element');
        }
        
        // Update feedback message
        feedbackEl.textContent = message;
        feedbackEl.style.opacity = '1';
        feedbackEl.style.transform = 'translateY(0) scale(1)';
        feedbackEl.style.display = 'block';
        
        console.log('✅ Updated feedback message:', message);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            if (feedbackEl) {
                feedbackEl.style.opacity = '0';
                feedbackEl.style.transform = 'translateY(-30px) scale(0.95)';
                setTimeout(() => {
                    if (feedbackEl && feedbackEl.parentNode) {
                        feedbackEl.parentNode.removeChild(feedbackEl);
                        console.log('✅ Removed feedback element');
                    }
                }, 400);
            }
        }, 4000);
    },

    // Direct command execution (bypasses input field)
    executeCommandDirect: function (cmd) {
      console.log("🚀 Executing command directly:", cmd);
      console.log("🔍 Terminal object available:", !!window.terminal);
      console.log(
        "🔍 Terminal executeCommand method:",
        !!(
          window.terminal &&
          typeof window.terminal.executeCommand === "function"
        )
      );

      // Increment command counter
      this.commandCount++;
      const commandsEl = document.getElementById("futuristic-commands");
      if (commandsEl) {
        commandsEl.textContent = this.commandCount;
      }

      // Try to use terminal's direct method if available
      if (
        window.terminal &&
        typeof window.terminal.executeCommand === "function"
      ) {
        console.log("✅ Using terminal.executeCommand for:", cmd);
        try {
          window.terminal.executeCommand(cmd);
          return;
        } catch (error) {
          console.error("❌ Error executing command:", error);
          window.terminal.log(
            `❌ Error executing command: ${error.message}`,
            "error"
          );
          return;
        }
      }

      // Try to use terminal's log method to show command
      if (window.terminal && typeof window.terminal.log === "function") {
        console.log("⚠️ Using terminal.log fallback for:", cmd);
        window.terminal.log(`> ${cmd}`, "info");

        // Simulate command processing
        setTimeout(() => {
          this.processCommandResult(cmd);
        }, 100);
        return;
      }

      // Fallback to input method
      console.log("🔄 Using sendCommandToTerminal for:", cmd);
      this.sendCommandToTerminal(cmd);
    },

    processCommandResult: function (cmd) {
      // Handle common commands
      const cmdLower = cmd.toLowerCase().trim();

      switch (cmdLower) {
        case "help":
          window.terminal.log("Available commands:", "info");
          window.terminal.log("• help - Show this help", "info");
          window.terminal.log("• connect - Connect wallet", "info");
          window.terminal.log("• balance - Check balance", "info");
          window.terminal.log("• clear - Clear terminal", "info");
          break;
        case "clear":
          const output = document.getElementById("terminalOutput");
          if (output) {
            output.innerHTML = "";
          }
          break;
        case "connect":
          window.terminal.log("Connecting to wallet...", "warning");
          window.terminal.log("Please use browser wallet extension", "info");
          break;
        case "balance":
          window.terminal.log("Balance: 0.00 ETH", "warning");
          window.terminal.log("Connect wallet to see balance", "info");
          break;
        default:
          window.terminal.log(`Command not found: ${cmd}`, "error");
          window.terminal.log('Type "help" for available commands', "info");
      }
    },

    // Handle manual command input from terminal
    setupCommandInput: function () {
      const input = document.getElementById("commandInput");
      if (!input) return;

      // Method 1: Hook into terminal's executeCommand if available
      if (
        window.terminal &&
        typeof window.terminal.executeCommand === "function"
      ) {
        const originalExecute = window.terminal.executeCommand;
        const self = this;

        window.terminal.executeCommand = function (cmd) {
          // Increment counter
          self.commandCount++;
          const commandsEl = document.getElementById("futuristic-commands");
          if (commandsEl) {
            commandsEl.textContent = self.commandCount;
            // Add subtle flash effect
            commandsEl.style.color = "var(--cyber-blue-bright)";
            setTimeout(() => {
              commandsEl.style.color = "";
            }, 200);
          }

          // Call original function
          return originalExecute.apply(this, arguments);
        };

        console.log("✅ Command counter hooked into terminal.executeCommand");
      }

      // Method 2: Listen to command input keypress events
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          // Small delay to let terminal process first
          setTimeout(() => {
            this.commandCount++;
            const commandsEl = document.getElementById("futuristic-commands");
            if (commandsEl) {
              commandsEl.textContent = this.commandCount;
              commandsEl.style.color = "var(--cyber-blue-bright)";
              setTimeout(() => {
                commandsEl.style.color = "";
              }, 200);
            }
          }, 50);
        }
      });

      console.log("✅ Command input handler attached");
      console.log("✅ Command counter active on all executions");
    },

    startMonitoring: function () {
      // Sync initial AI toggle state
      this.syncAIToggleState();

      // Update uptime every second
      setInterval(() => {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptime / 3600)
          .toString()
          .padStart(2, "0");
        const mins = Math.floor((uptime % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const secs = (uptime % 60).toString().padStart(2, "0");
        const uptimeEl = document.getElementById("futuristic-uptime");
        if (uptimeEl) {
          uptimeEl.textContent = `${hours}:${mins}:${secs}`;
        }
      }, 1000);

      // Periodically sync AI toggle state (in case it's changed from main terminal)
      setInterval(() => {
        this.syncAIToggleState();
      }, 1000);
    },

    syncAIToggleState: function () {
      // Sync AI controls with terminal's actual state
      const provider =
        (window.terminal && window.terminal.aiProvider) ||
        localStorage.getItem("omega-ai-provider") ||
        "off";
      const sidebarToggle = document.getElementById("sidebar-ai-toggle");
      const headerSelect = document.getElementById("headerAiProviderSelect");
      const wrapperSelect = document.getElementById("wrapperAiProviderSelect");

      // Sidebar label shows OFF/NEAR/OPENAI
      if (sidebarToggle) {
        const label =
          provider === "off" ? "OFF" : provider === "near" ? "NEAR" : "OPENAI";
        sidebarToggle.textContent = `AI: ${label}`;
      }
      // Header select reflects provider
      if (headerSelect && headerSelect.value !== provider) {
        try {
          headerSelect.value = provider;
        } catch (e) {}
      }
      if (wrapperSelect && wrapperSelect.value !== provider) {
        try {
          wrapperSelect.value = provider;
        } catch (e) {}
      }
    },

    toggleAI: function () {
      // Cycle provider using terminal's toggleAIMode (off -> near -> openai -> off)
      if (
        window.terminal &&
        typeof window.terminal.toggleAIMode === "function"
      ) {
        window.terminal.toggleAIMode();
        this.syncAIToggleState();
      } else {
        console.error("Terminal instance or toggleAIMode method not found");
      }
    },

    cycleTheme: function () {
      console.log("🔄 cycleTheme() called from FuturisticDashboard");

      // Cycle through all available themes (dark, light, matrix, retro, powershell, executive)
      if (
        typeof window.OmegaThemes !== "undefined" &&
        typeof window.OmegaThemes.toggleTheme === "function"
      ) {
        console.log("✅ OmegaThemes available, calling toggleTheme()");

        try {
          const newTheme = window.OmegaThemes.toggleTheme();
          console.log("✅ New theme applied:", newTheme);

          // Get theme description
          const themeDescriptions = window.OmegaThemes.getThemeDescriptions();
          const description = themeDescriptions[newTheme] || newTheme;

          // Show notification in terminal
          if (window.terminal && typeof window.terminal.log === "function") {
            window.terminal.log(`Theme cycled to: ${newTheme}`, "success");
            window.terminal.log(`   ${description}`, "info");
          }

          console.log(`✅ Theme cycled to: ${newTheme} - ${description}`);

          // Trigger input field fix for the new theme
          if (typeof window.fixInputField === "function") {
            setTimeout(() => {
              window.fixInputField(newTheme, false, false);
            }, 100);
          }
        } catch (error) {
          console.error("❌ Error cycling theme:", error);
        }
      } else {
        console.error("❌ OmegaThemes system not available");
        console.log("window.OmegaThemes:", window.OmegaThemes);
        console.log("Type of OmegaThemes:", typeof window.OmegaThemes);
      }
    },

    showChart: function (symbol) {
      console.log(`📈 Loading chart for ${symbol}`);

      // Show the chart panel
      const chartPanel = document.getElementById("chart-panel");
      if (chartPanel) {
        chartPanel.style.display = "block";
      }

      // Update symbol display
      const symbolDisplay = document.getElementById("chart-symbol-display");
      if (symbolDisplay) {
        symbolDisplay.textContent = `${symbol.toUpperCase()}/USD`;
      }

      // Clear previous chart
      const container = document.getElementById("chart-container");
      if (!container) return;

      container.innerHTML = "";

      // Create TradingView widget
      const widgetConfig = {
        symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
        interval: "60",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "rgba(0, 0, 0, 0.5)",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_legend: true,
        save_image: false,
        container_id: "chart-container",
        autosize: true,
        studies: [],
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        gridColor: "rgba(0, 212, 255, 0.1)",
        height: 280,
        width: "100%",
      };

      // Create iframe with TradingView widget
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "width: 100%; height: 280px; border: none; display: block;";
      iframe.scrolling = "no";

      // Use TradingView's lightweight chart embed
      iframe.src = `https://s.tradingview.com/embed-widget/symbol-overview/?locale=en#${encodeURIComponent(
        JSON.stringify({
          symbols: [[`BINANCE:${symbol.toUpperCase()}USDT|1D`]],
          chartOnly: false,
          width: "100%",
          height: "280",
          colorTheme: "dark",
          showVolume: false,
          scalePosition: "no",
          scaleMode: "Normal",
          fontFamily: "Courier New, monospace",
          fontSize: "10",
          noTimeScale: false,
          valuesTracking: "1",
          changeMode: "price-and-percent",
          chartType: "area",
          lineColor: "rgba(0, 212, 255, 1)",
          topColor: "rgba(0, 212, 255, 0.4)",
          bottomColor: "rgba(0, 212, 255, 0.0)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          gridLineColor: "rgba(0, 212, 255, 0.1)",
        })
      )}`;

      container.appendChild(iframe);

      // Log to terminal
      if (window.terminal) {
        window.terminal.log(
          `📈 Chart loaded: ${symbol.toUpperCase()}/USD`,
          "success"
        );
        window.terminal.log(`📊 View the chart in the right panel →`, "info");
      }
    },

    closeChart: function () {
      const chartPanel = document.getElementById("chart-panel");
      if (chartPanel) {
        chartPanel.style.display = "none";
      }
    },

    toggleClassicMode: function () {
      // Prevent view mode switching on mobile devices
      const isMobile = this.isMobileDevice();
      if (isMobile) {
        console.log("📱 View mode switching is disabled on mobile devices");
        if (window.terminal) {
          window.terminal.log(
            "📱 Basic terminal mode is locked on mobile devices",
            "info"
          );
        }
        return;
      }

      const dashboard = document.querySelector(".omega-dashboard");
      const currentMode =
        localStorage.getItem("omega-view-mode") || "futuristic";

      if (dashboard) {
        // Toggle based on current mode
        if (currentMode === "basic") {
          // Switch to futuristic mode
          this.enableFuturisticMode();
        } else {
          // Switch to basic mode
          this.enableBasicMode();
        }
      }
    },

    toggleViewMode: function () {
      this.toggleClassicMode();
    },

    isMobileDevice: function () {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      return isMobileUA || isSmallScreen;
    },

    updateViewModeButton: function () {
      const viewModeLabel = document.getElementById("view-mode-label");
      const viewModeHeaderLabel = document.getElementById(
        "view-mode-header-label"
      );
      const currentMode =
        localStorage.getItem("omega-view-mode") || "futuristic";

      if (viewModeLabel) {
        if (currentMode === "basic") {
          viewModeLabel.textContent = "Dashboard View";
        } else {
          viewModeLabel.textContent = "Basic View";
        }
      }

      if (viewModeHeaderLabel) {
        if (currentMode === "basic") {
          viewModeHeaderLabel.textContent = "Dashboard";
        } else {
          viewModeHeaderLabel.textContent = "Basic";
        }
      }
    },

    toggleThemeMode: function () {
      const currentTheme = localStorage.getItem("omega-theme-mode") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("omega-theme-mode", newTheme);

      // Add switching class to ensure smooth transitions
      document.body.classList.add("switching-theme");

      // Check if terminal is in Apple UI (Modern UI) mode
      const terminal = document.getElementById("terminal");
      const isAppleUI = terminal && terminal.classList.contains("apple-ui");

      // Ensure command input stays focused and visible during switch
      const commandInput = document.getElementById("commandInput");
      const wasActive = document.activeElement === commandInput;

      if (newTheme === "light") {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");

        // Handle Apple UI theme specifically
        if (isAppleUI && terminal) {
          terminal.classList.remove("dark");
          console.log("✅ Apple UI: Switched to light mode");
        }
      } else {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");

        // Handle Apple UI theme specifically
        if (isAppleUI && terminal) {
          terminal.classList.add("dark");
          console.log("✅ Apple UI: Switched to dark mode");
        }
      }

      // Restore focus to command input if it was active
      if (wasActive && commandInput) {
        setTimeout(() => {
          commandInput.focus();
        }, 0);
      }

      // Remove switching class after transition
      setTimeout(() => {
        document.body.classList.remove("switching-theme");
      }, 300);

      this.updateThemeModeButton();

      if (window.terminal) {
        window.terminal.log(`✅ Switched to ${newTheme} mode`, "success");
      }

      console.log(`🎨 Theme switched to ${newTheme} mode`);
    },

    updateThemeModeButton: function () {
      const themeModeLabel = document.getElementById("theme-mode-label");
      const currentTheme = localStorage.getItem("omega-theme-mode") || "dark";

      if (themeModeLabel) {
        if (currentTheme === "dark") {
          themeModeLabel.textContent = "Light";
        } else {
          themeModeLabel.textContent = "Dark";
        }
      }
    },

    enableBasicMode: function () {
      const dashboard = document.querySelector(".omega-dashboard");
      const terminal = document.getElementById("terminal");
      const terminalWrapper = document.getElementById("terminal-wrapper");

      if (dashboard && terminalWrapper) {
        // Smooth transition - fade out dashboard first
        dashboard.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
        dashboard.style.opacity = "0";
        dashboard.style.transform = "scale(0.98)";
        
        setTimeout(() => {
        dashboard.style.display = "none";
          dashboard.style.transition = "";
          dashboard.style.opacity = "";
          dashboard.style.transform = "";
        }, 300);

        // Move terminal wrapper to body (not just terminal)
        if (terminalWrapper.parentElement !== document.body) {
          document.body.appendChild(terminalWrapper);
        }

        // Style terminal wrapper for full-screen basic mode
        terminalWrapper.style.display = "flex";
        terminalWrapper.style.flexDirection = "column";
        terminalWrapper.style.position = "fixed";
        terminalWrapper.style.top = "0";
        terminalWrapper.style.left = "0";
        terminalWrapper.style.width = "100vw";
        terminalWrapper.style.height = "100vh";
        terminalWrapper.style.maxWidth = "100vw";
        terminalWrapper.style.maxHeight = "100vh";
        terminalWrapper.style.zIndex = "1000";
        terminalWrapper.style.background = "var(--void-black, #0a0a0f)";
        terminalWrapper.style.padding = "0";
        terminalWrapper.style.boxSizing = "border-box";

        // HIDE the original terminal's header (from index.html) - prevent duplicates
        if (terminal) {
          const originalTerminalHeader =
            terminal.querySelector(".terminal-header");
          if (originalTerminalHeader) {
            originalTerminalHeader.style.display = "none";
            originalTerminalHeader.style.visibility = "hidden";
            originalTerminalHeader.style.opacity = "0";
          }

          // Also hide the old tab bar if it exists
          const oldTabBar = terminal.querySelector(".tab-bar");
          if (oldTabBar) {
            oldTabBar.style.display = "none";
          }

          terminal.style.display = "flex";
          terminal.style.flexDirection = "column";
          terminal.style.width = "100%";
          terminal.style.height = "100%";
          terminal.style.background = "transparent";
          terminal.style.padding = "0";
        }

        // Apply modern futuristic UI classes
        document.body.classList.remove("futuristic-mode");
        document.body.classList.add("basic-terminal-mode");
        document.body.classList.add("modern-terminal-ui");

        // Ensure terminal wrapper has modern styling
        if (terminal) {
          terminal.classList.add("modern-ui");
          terminal.classList.add("futuristic-theme");
        }

        localStorage.setItem("omega-view-mode", "basic");

        console.log("📺 Basic terminal mode enabled with modern UI");
        if (window.terminal) {
          window.terminal.log("✅ Basic terminal mode enabled", "success");
        }
        this.updateViewModeButton();
        this.updateThemeModeButton();

        // SHOW ONLY the terminal wrapper's header (the dashboard-style header with all controls)
        const terminalWrapperHeader =
          terminalWrapper.querySelector(".terminal-header");
        if (terminalWrapperHeader) {
          terminalWrapperHeader.style.display = "flex";
          terminalWrapperHeader.style.visibility = "visible";
          terminalWrapperHeader.style.opacity = "1";
          terminalWrapperHeader.style.pointerEvents = "auto";
          console.log("✅ Terminal wrapper header found and shown");
        } else {
          console.log("❌ Terminal wrapper header not found, creating one...");
          // Create the header if it doesn't exist
          const header = document.createElement("div");
          header.className = "terminal-header";
          header.innerHTML = `
            <div class="terminal-title">
              <span id="omega-title-symbol"></span>
              <span>OMEGA TERMINAL v2.0.1</span>
            </div>
            <div class="terminal-controls">
              <!-- Status Indicators -->
              <div class="status-indicator">
                <div class="status-dot" id="futuristic-connection-status"></div>
                <span id="futuristic-connection-text">INITIALIZING</span>
              </div>
              
              <div class="status-indicator">
                <span id="futuristic-wallet-info">NO WALLET</span>
              </div>
              
              <div class="status-indicator" id="network-status-display" style="display: none;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div id="network-logo-container" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    background: var(--palette-bg-primary, rgba(0, 0, 0, 0.9));
                    border-radius: 50%;
                    font-size: 14px;
                    font-weight: bold;
                    font-family: serif, 'Times New Roman';
                    color: var(--palette-primary, #ffffff);
                    box-shadow: 0 0 8px var(--palette-primary-glow, rgba(255, 255, 255, 0.6));
                    border: 1px solid var(--palette-primary, #ffffff);
                    backdrop-filter: blur(10px);
                  ">Ω</div>
                  <span id="network-name-display">Omega Network</span>
                </div>
                <span id="wallet-address-display">0x3d0e...133d</span>
              </div>
              
              <div class="terminal-divider"></div>
              
              <!-- AI Provider Select -->
              <label for="wrapperAiProviderSelect" style="color: var(--palette-text-primary, var(--cyber-blue-bright)); font-family: 'Courier New', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 6px;">AI:</label>
              <select id="wrapperAiProviderSelect" title="Select AI Provider" style="
                background: var(--palette-bg-overlay, rgba(0, 212, 255, 0.08));
                border: 1px solid var(--palette-border, rgba(0, 212, 255, 0.3));
                border-radius: 6px;
                padding: 6px 10px;
                color: var(--palette-text-primary, var(--cyber-blue-bright));
                font-family: 'Courier New', monospace;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                background-image: linear-gradient(45deg, transparent 50%, var(--palette-primary, #00d4ff) 50%), linear-gradient(135deg, var(--palette-primary, #00d4ff) 50%, transparent 50%);
                background-position: calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px);
                background-size: 5px 5px, 5px 5px;
                background-repeat: no-repeat;
                min-width: 110px;
                margin-right: 12px;
              ">
                <option value="off">Off</option>
                <option value="near">NEAR AI</option>
                <option value="openai">OpenAI</option>
              </select>
              
              <!-- Theme Toggle -->
              <button class="theme-toggle" id="theme-toggle-btn" title="Toggle Theme" style="
                background: var(--palette-bg-overlay, rgba(0, 212, 255, 0.08));
                border: 1px solid var(--palette-border, rgba(0, 212, 255, 0.3));
                border-radius: 6px;
                padding: 6px 10px;
                color: var(--palette-text-primary, var(--cyber-blue-bright));
                font-family: 'Courier New', monospace;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-right: 12px;
                min-width: 60px;
              ">
                <span id="theme-mode-label">Light</span>
              </button>
              
              <!-- View Mode Toggle -->
              <button class="view-mode-toggle" id="view-mode-toggle-btn" title="Toggle View Mode" style="
                background: var(--palette-bg-overlay, rgba(0, 212, 255, 0.08));
                border: 1px solid var(--palette-border, rgba(0, 212, 255, 0.3));
                border-radius: 6px;
                padding: 6px 10px;
                color: var(--palette-text-primary, var(--cyber-blue-bright));
                font-family: 'Courier New', monospace;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-right: 12px;
                min-width: 80px;
              ">
                <span id="view-mode-label">Dashboard</span>
              </button>
              
              <!-- Window Controls -->
              <div class="window-controls" style="display: flex; gap: 8px;">
                <button class="window-control minimize" title="Minimize" style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #ffbd2e;
                  border: none;
                  cursor: pointer;
                "></button>
                <button class="window-control maximize" title="Maximize" style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #28ca42;
                  border: none;
                  cursor: pointer;
                "></button>
                <button class="window-control close" title="Close" style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background: #ff5f56;
                  border: none;
                  cursor: pointer;
                "></button>
              </div>
            </div>
          `;
          
          // Insert header at the beginning of terminal wrapper
          terminalWrapper.insertBefore(header, terminalWrapper.firstChild);
          console.log("✅ Terminal wrapper header created and inserted");
          
          // Initialize the header controls
          setTimeout(() => {
            this.initializeHeaderControls();
          }, 100);
        }

        // Make sure terminal wrapper is visible
        terminalWrapper.style.display = "flex";
        
        // Ensure terminal is properly initialized
        this.ensureTerminalInitialization();
      }
    },

    enableFuturisticMode: function () {
      // Set body classes IMMEDIATELY to prevent flash
      document.body.classList.add("futuristic-mode");
      document.body.classList.remove("basic-terminal-mode");
      document.body.classList.add("modern-terminal-ui");
      localStorage.setItem("omega-view-mode", "futuristic");
      
      const dashboard = document.querySelector(".omega-dashboard");
      const terminal = document.getElementById("terminal");
      const terminalWrapper = document.getElementById("terminal-wrapper");
      const dashboardTerminalSlot = dashboard
        ? dashboard.querySelector("main.omega-terminal")
        : null;

      if (dashboard && terminalWrapper) {
        // Find the correct place in dashboard to put terminal wrapper back
        const mainTerminalSlot =
          dashboard.querySelector(".omega-sidebar").nextElementSibling;

        // Move terminal wrapper back into dashboard
        if (
          mainTerminalSlot &&
          terminalWrapper.parentElement !== mainTerminalSlot.parentElement
        ) {
          mainTerminalSlot.parentElement.insertBefore(
            terminalWrapper,
            mainTerminalSlot.nextSibling
          );
        }

        // Reset terminal wrapper styles
        if (terminalWrapper) {
          terminalWrapper.style.display = "";
          terminalWrapper.style.flexDirection = "";
          terminalWrapper.style.position = "";
          terminalWrapper.style.top = "";
          terminalWrapper.style.left = "";
          terminalWrapper.style.width = "";
          terminalWrapper.style.height = "";
          terminalWrapper.style.maxWidth = "";
          terminalWrapper.style.maxHeight = "";
          terminalWrapper.style.zIndex = "";
          terminalWrapper.style.background = "";
          terminalWrapper.style.padding = "";
          terminalWrapper.style.boxSizing = "";
        }

        // Reset terminal styles
        if (terminal) {
          terminal.style.display = "";
          terminal.style.flexDirection = "";
          terminal.style.width = "";
          terminal.style.height = "";
          terminal.style.background = "";
          terminal.style.padding = "";

          // Keep modern UI classes
          terminal.classList.add("modern-ui");
          terminal.classList.add("futuristic-theme");
        }

        // Don't remove floating toggle - using header button instead
        // this.removeBasicModeToggle();

        // Show dashboard immediately (no transition during welcome screen exit)
        dashboard.style.display = "grid";
        dashboard.style.opacity = "1";
        dashboard.style.transform = "scale(1)";
        dashboard.style.transition = "";
        console.log("🚀 Futuristic dashboard mode enabled");
        if (window.terminal) {
          window.terminal.log(
            "✅ Futuristic dashboard mode enabled",
            "success"
          );
        }
        this.updateViewModeButton();
        this.updateThemeModeButton();
        
        // Ensure terminal is properly initialized
        this.ensureTerminalInitialization();
        
        // Force a layout update to ensure everything renders correctly
        setTimeout(() => {
          if (window.terminal && window.terminal.resize) {
            window.terminal.resize();
          }
        }, 100);
      } else {
        // Create dashboard if it doesn't exist
        console.log("🚀 Creating new futuristic dashboard...");
        transformToDashboard();
        
        // Wait for dashboard to be created
        setTimeout(() => {
        document.body.classList.add("futuristic-mode");
        document.body.classList.remove("basic-terminal-mode");
        document.body.classList.add("modern-terminal-ui");
        localStorage.setItem("omega-view-mode", "futuristic");
          
        this.updateViewModeButton();
        this.updateThemeModeButton();
          
          // Ensure terminal is properly initialized
          this.ensureTerminalInitialization();
          
          console.log("🚀 New futuristic dashboard created and enabled");
          if (window.terminal) {
            window.terminal.log(
              "✅ Futuristic dashboard mode enabled",
              "success"
            );
          }
        }, 100);
      }
    },
    
    ensureTerminalInitialization: function() {
      // Ensure terminal is properly sized and positioned
      const terminal = document.getElementById("terminal");
      const terminalWrapper = document.getElementById("terminal-wrapper");
      
      if (terminal && terminalWrapper) {
        // Force a resize to ensure proper layout
        setTimeout(() => {
          if (window.terminal && window.terminal.resize) {
            window.terminal.resize();
          }
          
          // Ensure terminal output is visible
          const terminalOutput = terminal.querySelector('.terminal-output');
          if (terminalOutput) {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
          }
        }, 100);
      }
    },

    createBasicModeToggle: function () {
      // Don't create toggle if welcome screen is still showing
      if (!document.body.classList.contains("omega-initialized")) {
        console.log("⏳ Waiting for welcome screen to finish...");
        return;
      }

      // Remove existing toggle if it exists
      this.removeBasicModeToggle();

      // Create floating toggle button
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "basic-mode-toggle";
      toggleBtn.className = "basic-mode-toggle";
      toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/>
                </svg>
                <span>Dashboard</span>
            `;
      toggleBtn.title = "Switch to Dashboard View";
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
        toggleBtn.style.background = "rgba(15, 15, 26, 0.95)";
        toggleBtn.style.borderColor = "#00d4ff";
        toggleBtn.style.boxShadow = "0 4px 20px rgba(0, 212, 255, 0.25)";
        toggleBtn.style.transform = "translateY(-2px)";
        toggleBtn.style.color = "#00ffff";
      };

      toggleBtn.onmouseleave = () => {
        toggleBtn.style.background = "rgba(15, 15, 26, 0.85)";
        toggleBtn.style.borderColor = "rgba(0, 212, 255, 0.3)";
        toggleBtn.style.boxShadow = "0 2px 12px rgba(0, 212, 255, 0.15)";
        toggleBtn.style.transform = "translateY(0)";
        toggleBtn.style.color = "#00d4ff";
      };

      document.body.appendChild(toggleBtn);

      // Fade in animation
      setTimeout(() => {
        toggleBtn.style.opacity = "0";
        toggleBtn.style.transform = "translateY(-20px)";
        setTimeout(() => {
          toggleBtn.style.transition = "all 0.3s ease";
          toggleBtn.style.opacity = "1";
          toggleBtn.style.transform = "translateY(0)";
        }, 10);
      }, 10);
    },

    removeBasicModeToggle: function () {
      const existingToggle = document.getElementById("basic-mode-toggle");
      if (existingToggle) {
        existingToggle.remove();
      }
    },

    // Toggle section minimize/expand
    toggleSection: function (sectionId) {
      console.log("Toggling section:", sectionId);

      const section = document.querySelector(`[data-section="${sectionId}"]`);
      if (!section) {
        console.error("Section not found:", sectionId);
        return;
      }

      const content =
        section.querySelector(".sidebar-section-content") || section;
      const toggleButton = section.querySelector(".section-toggle");
      const toggleIcon = toggleButton.querySelector(".toggle-icon");

      // Check if section is currently minimized
      const isMinimized = section.classList.contains("minimized");

      if (isMinimized) {
        // Expand section
        section.classList.remove("minimized");
        content.style.display = "block";
        toggleIcon.style.transform = "rotate(0deg)";
        console.log("Expanded section:", sectionId);
      } else {
        // Minimize section
        section.classList.add("minimized");
        content.style.display = "none";
        toggleIcon.style.transform = "rotate(-90deg)";
        console.log("Minimized section:", sectionId);
      }

      // Save state to localStorage
      const minimizedSections = JSON.parse(
        localStorage.getItem("omega-minimized-sections") || "[]"
      );
      if (isMinimized) {
        // Remove from minimized list
        const index = minimizedSections.indexOf(sectionId);
        if (index > -1) {
          minimizedSections.splice(index, 1);
        }
      } else {
        // Add to minimized list
        if (!minimizedSections.includes(sectionId)) {
          minimizedSections.push(sectionId);
        }
      }
      localStorage.setItem(
        "omega-minimized-sections",
        JSON.stringify(minimizedSections)
      );
    },

    // Restore minimized sections from localStorage
    restoreMinimizedSections: function () {
      const minimizedSections = JSON.parse(
        localStorage.getItem("omega-minimized-sections") || "[]"
      );
      console.log("Restoring minimized sections:", minimizedSections);

      // Ensure these sections are always expanded by default
      const alwaysExpandedSections = ['mining-rewards', 'advanced-trading', 'entertainment'];
      
      // Remove these sections from localStorage to ensure they start expanded
      const filteredSections = minimizedSections.filter(sectionId => !alwaysExpandedSections.includes(sectionId));
      localStorage.setItem("omega-minimized-sections", JSON.stringify(filteredSections));
      
      minimizedSections.forEach((sectionId) => {
        // Skip sections that should always be expanded
        if (alwaysExpandedSections.includes(sectionId)) {
          console.log("Skipping restoration for always-expanded section:", sectionId);
          return;
        }
        
        const section = document.querySelector(`[data-section="${sectionId}"]`);
        if (section) {
          const content =
            section.querySelector(".sidebar-section-content") || section;
          const toggleButton = section.querySelector(".section-toggle");
          const toggleIcon = toggleButton.querySelector(".toggle-icon");

          section.classList.add("minimized");
          content.style.display = "none";
          toggleIcon.style.transform = "rotate(-90deg)";
          console.log("Restored minimized section:", sectionId);
        }
      });
      
      // Ensure critical sections are expanded
      alwaysExpandedSections.forEach((sectionId) => {
        const section = document.querySelector(`[data-section="${sectionId}"]`);
        if (section) {
          section.classList.remove("minimized");
          const content = section.querySelector(".sidebar-section-content") || section;
          const toggleButton = section.querySelector(".section-toggle");
          const toggleIcon = toggleButton.querySelector(".toggle-icon");
          
          content.style.display = "block";
          toggleIcon.style.transform = "rotate(0deg)";
          console.log("Ensured section is expanded:", sectionId);
        }
      });
    },

    // Chart functionality
    showChart: function (symbol) {
      console.log("Showing chart for:", symbol);

      // Play chart viewer sound effect
      if (window.OmegaSoundEffects && window.OmegaSoundEffects.isSoundEnabled()) {
        window.OmegaSoundEffects.playChartViewerSound();
      }

      // Hide other panels
      const pgtPanel = document.getElementById("pgt-stats-panel");
      if (pgtPanel) pgtPanel.style.display = "none";

      // Show chart panel
      const chartPanel = document.getElementById("chart-panel");
      if (chartPanel) {
        chartPanel.style.display = "block";

        // Update symbol display
        const symbolDisplay = document.getElementById("chart-symbol-display");
        if (symbolDisplay) {
          symbolDisplay.textContent = `${symbol}/USD`;
        }

        // Create TradingView widget
        this.createTradingViewWidget(symbol);
      }
    },

    closeChart: function () {
      const chartPanel = document.getElementById("chart-panel");
      if (chartPanel) {
        chartPanel.style.display = "none";
      }
    },

    createTradingViewWidget: function (symbol) {
      const container = document.getElementById("chart-container");
      if (!container) return;

      // Clear existing content
      container.innerHTML = "";

      // Create TradingView widget configuration
      const widgetConfig = {
        symbol: `BINANCE:${symbol}USDT`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1e1e1e",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: "chart-container",
        studies: [],
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        gridColor: "rgba(0, 212, 255, 0.1)",
        height: 280,
        width: "100%",
      };

      // Create iframe with TradingView widget
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "width: 100%; height: 280px; border: none; display: block;";
      iframe.scrolling = "no";
      iframe.src = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${Date.now()}&symbol=${encodeURIComponent(
        widgetConfig.symbol
      )}&interval=${
        widgetConfig.interval
      }&symboledit=1&saveimage=0&toolbarbg=1e1e1e&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=omegaterminal.com&utm_medium=widget&utm_campaign=chart&utm_term=${symbol}`;

      container.appendChild(iframe);
    },

    // Color palette cycling function
    cycleColorPalette: function() {
      // Use the same palette list as color-commands.js
      const palettes = [
        'red', 'anime', 'ocean', 'forest', 'sunset', 'purple', 
        'cyber', 'gold', 'ice', 'fire', 'mint', 'rose', 'amber', 'slate',
        'lavender', 'toxic'
      ];
      
      // Get current palette from localStorage or default to 'cyber'
      const currentPalette = localStorage.getItem('omega-color-palette') || 'cyber';
      const currentIndex = palettes.indexOf(currentPalette);
      
      console.log('🎨 Color Palette Cycle Debug:', {
        currentPalette: currentPalette,
        currentIndex: currentIndex,
        palettes: palettes
      });
      
      // If current palette not found in list, start from beginning
      const startIndex = currentIndex >= 0 ? currentIndex : 0;
      
      // Get next palette (cycle back to start if at end)
      const nextIndex = (startIndex + 1) % palettes.length;
      const nextPalette = palettes[nextIndex];
      
      console.log('🎨 Next palette:', {
        startIndex: startIndex,
        nextIndex: nextIndex,
        nextPalette: nextPalette
      });
      
      // Execute the color command
      this.executeCommandDirect(`color ${nextPalette}`);
      
      // Fallback: Directly apply palette if command doesn't work
      setTimeout(() => {
        const currentAppliedPalette = document.body.getAttribute('data-color-palette');
        if (currentAppliedPalette !== nextPalette) {
          console.log('🎨 Fallback: Directly applying palette', nextPalette);
          document.body.setAttribute('data-color-palette', nextPalette);
          localStorage.setItem('omega-color-palette', nextPalette);
        }
      }, 500);
      
      // Show feedback with more detail
      if (window.terminal && window.terminal.log) {
        window.terminal.log(`🎨 Color Palette Changed!`, 'success');
        window.terminal.log(`   From: ${currentPalette} → To: ${nextPalette}`, 'info');
        window.terminal.log(`   Palette ${nextIndex + 1} of ${palettes.length}`, 'info');
      }
      
      // Also update the palette toggle button if it exists
      const paletteBtn = document.getElementById('palette-toggle-btn');
      if (paletteBtn) {
        paletteBtn.title = `Current: ${nextPalette} | Click to cycle`;
      }
    },

    // Theme cycling function - Enhanced to handle Modern UI properly
    cycleTheme: function() {
      const themes = [
        'executive', 'modern', 'dark', 'light', 'matrix', 'retro', 'powershell'
      ];
      
      // Get current theme from localStorage or detect from DOM
      let currentTheme = localStorage.getItem('omega-terminal-theme') || 'dark';
      
      // Check if Modern UI is currently active
      const terminal = document.getElementById('terminal') || document.querySelector('.terminal');
      const isModernUIActive = terminal && terminal.classList.contains('apple-ui');
      
      if (isModernUIActive) {
        // If Modern UI is active, we need to deactivate it first
        if (window.terminal && window.terminal.deactivateAppleUI) {
          window.terminal.deactivateAppleUI();
        }
        currentTheme = 'modern'; // Set as current for cycling
      }
      
      const currentIndex = themes.indexOf(currentTheme);
      
      // Get next theme (cycle back to start if at end)
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      
      // Special handling for Modern UI theme
      if (nextTheme === 'modern') {
        // Play modern UI theme sound effect
        if (window.OmegaSoundEffects && window.OmegaSoundEffects.isSoundEnabled()) {
          window.OmegaSoundEffects.playModernUIThemeSound();
        }
        
        // Activate Modern UI directly
        if (window.terminal && window.terminal.activateAppleUI) {
          window.terminal.activateAppleUI(false); // Light mode
          localStorage.setItem('omega-terminal-theme', 'modern');
        } else {
          // Fallback to command execution
          this.executeCommandDirect(`theme ${nextTheme}`);
        }
      } else {
        // For other themes, execute normally
        this.executeCommandDirect(`theme ${nextTheme}`);
      }
      
      // Show feedback
      if (window.terminal && window.terminal.log) {
        window.terminal.log(`Cycling to ${nextTheme} theme`, 'success');
        console.log(`[Theme Cycle] Switched from ${currentTheme} to ${nextTheme}`);
      }
    },

    // Update connection status
    updateConnectionStatus: function(status, address = null) {
      const statusElement = document.getElementById('futuristic-connection-status');
      const textElement = document.getElementById('futuristic-connection-text');
      const walletElement = document.getElementById('futuristic-wallet-info');
      const networkDisplay = document.getElementById('network-status-display');
      const networkName = document.getElementById('network-name-display');
      const walletAddress = document.getElementById('wallet-address-display');
      
      if (statusElement && textElement) {
        if (status === 'connected') {
          statusElement.style.background = '#00ff88';
          textElement.textContent = 'CONNECTED';
          textElement.style.color = '#00ff88';
          
          // Show network status display
          if (networkDisplay && networkName && walletAddress) {
            networkDisplay.style.display = 'flex';
            networkName.textContent = 'Omega Network';
            if (address) {
              const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
              walletAddress.textContent = shortAddress;
            }
          }
          
          if (walletElement && address) {
            const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
            walletElement.innerHTML = `
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 16px;
                  height: 16px;
                  background: var(--palette-bg-primary, rgba(0, 0, 0, 0.9));
                  border-radius: 50%;
                  font-size: 12px;
                  font-weight: bold;
                  font-family: serif, 'Times New Roman';
                  color: var(--palette-primary, #ffffff);
                  box-shadow: 0 0 6px var(--palette-primary-glow, rgba(255, 255, 255, 0.6));
                  border: 1px solid var(--palette-primary, #ffffff);
                  backdrop-filter: blur(8px);
                ">Ω</div>
                <span style="color: var(--palette-primary, #00d4ff);">${shortAddress}</span>
              </div>
            `;
          }
        } else {
          statusElement.style.background = '#ff3366';
          textElement.textContent = 'DISCONNECTED';
          textElement.style.color = '#ff3366';
          
          // Hide network status display
          if (networkDisplay) {
            networkDisplay.style.display = 'none';
          }
          
          if (walletElement) {
            walletElement.textContent = 'NO WALLET';
            walletElement.style.color = '#666';
          }
        }
      }
    },

    // Update AI dropdown colors based on state
    updateAIDropdownColors: function(dropdown, value) {
      if (!dropdown) return;
      
      // Define colors for different AI states
      const colors = {
        off: {
          border: '#ff4757',      // Red border
          color: '#ff4757',       // Red text
          label: '#ff4757'        // Red label
        },
        near: {
          border: '#00ff88',      // Green border
          color: '#00ff88',       // Green text
          label: '#00ff88'        // Green label
        },
        openai: {
          border: '#00ff88',      // Green border
          color: '#00ff88',       // Green text
          label: '#00ff88'        // Green label
        }
      };

      const colorScheme = colors[value] || colors.off;
      
      // Update dropdown styles with !important to override CSS (border and text only)
      dropdown.style.setProperty('border-color', colorScheme.border, 'important');
      dropdown.style.setProperty('color', colorScheme.color, 'important');
      
      // Update dropdown arrow color
      dropdown.style.setProperty('background-image', 
        `linear-gradient(45deg, transparent 50%, ${colorScheme.color} 50%), linear-gradient(135deg, ${colorScheme.color} 50%, transparent 50%)`, 
        'important');
      
      // Update the AI label color
      const label = document.querySelector('label[for="wrapperAiProviderSelect"]');
      if (label) {
        label.style.setProperty('color', colorScheme.label, 'important');
      }
      
      // Also update any other AI dropdowns on the page
      const allAIDropdowns = document.querySelectorAll('#aiProviderSelect, #headerAiProviderSelect, #wrapperAiProviderSelect');
      allAIDropdowns.forEach(dropdownEl => {
        if (dropdownEl !== dropdown) {
          dropdownEl.style.setProperty('border-color', colorScheme.border, 'important');
          dropdownEl.style.setProperty('color', colorScheme.color, 'important');
          dropdownEl.style.setProperty('background-image', 
            `linear-gradient(45deg, transparent 50%, ${colorScheme.color} 50%), linear-gradient(135deg, ${colorScheme.color} 50%, transparent 50%)`, 
            'important');
        }
      });
      
      // Update all AI labels
      const allAILabels = document.querySelectorAll('label[for="aiProviderSelect"], label[for="headerAiProviderSelect"], label[for="wrapperAiProviderSelect"]');
      allAILabels.forEach(labelEl => {
        labelEl.style.setProperty('color', colorScheme.label, 'important');
      });
      
      console.log(`AI Dropdown colors updated: ${value} - ${colorScheme.color}`);
    },

    // Initialize header controls for basic mode
    initializeHeaderControls: function() {
      // Initialize AI provider select
      const aiSelect = document.getElementById('wrapperAiProviderSelect');
      if (aiSelect) {
        aiSelect.addEventListener('change', (e) => {
          const provider = e.target.value;
          if (window.terminal && window.terminal.setAIProvider) {
            window.terminal.setAIProvider(provider);
          }
        });
      }

      // Initialize theme toggle
      const themeToggle = document.getElementById('theme-toggle-btn');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          this.toggleThemeMode();
        });
      }

      // Initialize view mode toggle
      const viewModeToggle = document.getElementById('view-mode-toggle-btn');
      if (viewModeToggle) {
        viewModeToggle.addEventListener('click', () => {
          this.toggleViewMode();
        });
      }

      // Initialize window controls
      const minimizeBtn = document.querySelector('.window-control.minimize');
      const maximizeBtn = document.querySelector('.window-control.maximize');
      const closeBtn = document.querySelector('.window-control.close');

      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
          // Minimize functionality
          console.log('Minimize clicked');
        });
      }

      if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
          // Maximize functionality
          console.log('Maximize clicked');
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          // Close functionality
          console.log('Close clicked');
        });
      }

      console.log('✅ Header controls initialized');
    },
  };

  // Mobile detection function
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUA || isSmallScreen;
  };

  // Auto-transform when DOM is ready (unless user prefers basic mode)
  const isMobile = isMobileDevice();
  let savedViewMode = localStorage.getItem("omega-view-mode");
  const savedTheme = localStorage.getItem("omega-theme-mode") || "dark";

  // Force basic mode on mobile devices
  if (isMobile) {
    savedViewMode = "basic";
    localStorage.setItem("omega-view-mode", "basic");
    console.log("📱 Mobile device detected - forcing basic terminal mode");
  }

  // Apply theme immediately
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Always create the dashboard, but hide it if basic mode is preferred
      transformToDashboard();
      if (savedViewMode === "basic") {
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
    if (savedViewMode === "basic") {
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

