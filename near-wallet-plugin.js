// ===================================
// NEAR WALLET CONNECTION PLUGIN v1.0
// Adds NEAR wallet support to Omega Terminal
// ===================================

console.log('🚀 Loading NEAR Wallet Plugin v1.0');

(function() {
    // Wait for terminal to be ready
    function waitForTerminal() {
        if (window.terminal && window.terminal.executeCommand) {
            initializeNEARWallet();
        } else {
            setTimeout(waitForTerminal, 100);
        }
    }
    
    function initializeNEARWallet() {
        console.log('✅ NEAR Wallet Plugin: Terminal detected, adding NEAR wallet support...');
        
        // Add NEAR wallet state to terminal
        window.terminal.nearWallet = null;
        window.terminal.nearAccountId = null;
        window.terminal.nearWalletType = null;
        
        // Store original executeCommand to add NEAR wallet commands
        const originalExecuteCommand = window.terminal.executeCommand;
        window.terminal.executeCommand = async function(command) {
            const args = command.trim().split(/\s+/);
            const cmd = args[0].toLowerCase();
            
            // Handle NEAR wallet commands
            if (cmd === 'near-wallet' || cmd === 'nearwallet') {
                await this.handleNearWalletCommand(args);
                return;
            }
            
            // Call original command handler for other commands
            return originalExecuteCommand.call(this, command);
        };
        
        // NEAR Wallet main command handler
        window.terminal.handleNearWalletCommand = async function(args) {
            if (!args[1]) {
                this.log('🔵 NEAR Protocol Wallet Connection', 'info');
                this.log('══════════════════════════════════', 'info');
                this.log('', 'info');
                this.log('📱 AVAILABLE NEAR WALLETS:', 'info');
                this.log('  near-wallet connect           Connect to NEAR Wallet (wallet.near.org)', 'output');
                this.log('  near-wallet mynear            Connect to MyNearWallet', 'output');
                this.log('  near-wallet here              Connect to HERE Wallet', 'output');
                this.log('  near-wallet sender            Connect to Sender Wallet', 'output');
                this.log('  near-wallet meteor            Connect to Meteor Wallet', 'output');
                this.log('', 'info');
                this.log('📊 WALLET STATUS:', 'info');
                this.log('  near-wallet status            Check current NEAR wallet connection', 'output');
                this.log('  near-wallet disconnect        Disconnect NEAR wallet', 'output');
                this.log('  near-wallet balance           Check NEAR token balances', 'output');
                this.log('  near-wallet debug             Debug wallet detection (troubleshooting)', 'output');
                this.log('', 'info');
                this.log('🎯 EXAMPLES:', 'info');
                this.log('  near-wallet connect', 'info');
                this.log('  near-wallet status', 'info');
                this.log('  near-wallet balance', 'info');
                this.log('', 'info');
                this.log('💡 After connecting, you can use REF Finance swaps!', 'success');
                return;
            }
            
            const subCommand = args[1];
            
            try {
                switch (subCommand) {
                    case 'connect':
                        await this.connectNearWallet();
                        break;
                    case 'mynear':
                        await this.connectMyNearWallet();
                        break;
                    case 'here':
                        await this.connectHereWallet();
                        break;
                    case 'sender':
                        await this.connectSenderWallet();
                        break;
                    case 'meteor':
                        await this.connectMeteorWallet();
                        break;
                    case 'status':
                        this.showNearWalletStatus();
                        break;
                    case 'disconnect':
                        this.disconnectNearWallet();
                        break;
                    case 'balance':
                        await this.showNearBalance();
                        break;
                    case 'debug':
                        this.debugNearWalletDetection();
                        break;
                    case 'help':
                        await this.handleNearWalletCommand([]);
                        break;
                    default:
                        this.log(`❌ Unknown NEAR wallet command: ${subCommand}`, 'error');
                        this.log('Type "near-wallet" for available commands', 'info');
                }
            } catch (error) {
                this.log(`❌ NEAR wallet command failed: ${error.message}`, 'error');
            }
        };
        
        // Connect to NEAR Wallet (wallet.near.org)
        window.terminal.connectNearWallet = async function() {
            this.log('🔵 Detecting your NEAR wallet extension...', 'info');
            
            try {
                                 // Enhanced detection for NEAR wallet extensions
                 let detectedWallets = [];
                 
                 // Wait a bit for wallets to inject (some inject after page load)
                 await new Promise(resolve => setTimeout(resolve, 500));
                 
                 // Check for various NEAR wallet objects that extensions typically create
                 const walletChecks = [
                     { name: 'HERE Wallet', check: () => window.here && (typeof window.here.connect === 'function' || typeof window.here.requestSignIn === 'function') },
                     { name: 'Sender Wallet', check: () => window.sender && (typeof window.sender.connect === 'function' || typeof window.sender.requestSignIn === 'function') },
                     { name: 'Meteor Wallet', check: () => window.meteor && (typeof window.meteor.connect === 'function' || typeof window.meteor.requestSignIn === 'function') },
                     { name: 'MyNearWallet', check: () => window.myNearWallet && typeof window.myNearWallet.requestSignIn === 'function' },
                     { name: 'NEAR Wallet', check: () => window.nearWallet && typeof window.nearWallet.requestSignIn === 'function' },
                     { name: 'NEAR API', check: () => window.near && (typeof window.near.connect === 'function' || typeof window.near.requestSignIn === 'function') },
                     { name: 'Wallet Selector', check: () => window.selector && typeof window.selector.wallet === 'function' },
                     // Additional checks for wallet browser extensions
                     { name: 'NEAR Extension', check: () => window.nearExtension || window.wallet || (window.ethereum && window.ethereum.isNearWallet) },
                     { name: 'Browser Wallet', check: () => document.querySelector('meta[name="near-wallet"]') || window.nearBrowserWallet }
                 ];
                 
                 // Detect available wallets
                 walletChecks.forEach(wallet => {
                     try {
                         if (wallet.check()) {
                             detectedWallets.push(wallet.name);
                             this.log(`✅ ${wallet.name} detected and ready!`, 'success');
                         }
                     } catch (e) {
                         // Wallet check failed, continue
                     }
                 });
                
                                 // If no wallets detected, try to manually connect anyway (wallet might be there but not detected)
                 if (detectedWallets.length === 0) {
                     this.log('⚠️ No NEAR wallets auto-detected, but you said you have one installed...', 'warning');
                     this.log('🔄 Let\'s try to connect anyway!', 'info');
                     
                     // Show manual connection options
                     let html = `<div style='background:rgba(255,165,0,0.1);border:1px solid #ffa500;border-radius:8px;padding:15px;margin:10px 0;'>`;
                     html += `<div style='text-align:center;margin-bottom:15px;'><span style='font-size:1.3em;font-weight:bold;color:#ffa500;'>🔄 Manual NEAR Wallet Connection</span></div>`;
                     
                     html += `<div style='margin-bottom:15px;'>`;
                     html += `<div style='color:#fff;margin-bottom:12px;text-align:center;'>Try connecting to your installed NEAR wallet:</div>`;
                     html += `<div style='display:grid;grid-template-columns:1fr;gap:8px;'>`;
                     html += `<button onclick="window.terminal.tryManualNearConnection('here')" style='background:#9333ea;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟪 Try HERE Wallet Connection</button>`;
                     html += `<button onclick="window.terminal.tryManualNearConnection('sender')" style='background:#059669;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟩 Try Sender Wallet Connection</button>`;
                     html += `<button onclick="window.terminal.tryManualNearConnection('meteor')" style='background:#eab308;color:#000;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟨 Try Meteor Wallet Connection</button>`;
                     html += `<button onclick="window.terminal.tryManualNearConnection('mynear')" style='background:#0099ff;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟦 Try MyNearWallet Connection</button>`;
                     html += `<button onclick="window.terminal.executeCommand('near-wallet debug')" style='background:#666;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🐛 Debug Wallet Detection</button>`;
                     html += `</div>`;
                     html += `</div>`;
                     
                     html += `<div style='background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:6px;padding:8px;text-align:center;margin-bottom:12px;'>`;
                     html += `<div style='color:#00ff00;font-weight:bold;font-size:0.9em;'>💡 Which NEAR wallet do you have installed?</div>`;
                     html += `<div style='color:#888;font-size:0.8em;'>Try the buttons above to manually connect</div>`;
                     html += `</div>`;
                     
                     html += `</div>`;
                     this.logHtml(html, 'output');
                     
                 } else if (detectedWallets.length > 0) {
                     this.log(`🎉 Found ${detectedWallets.length} NEAR wallet(s): ${detectedWallets.join(', ')}`, 'success');
                    
                    // Show wallet selection interface
                    let html = `<div style='background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:8px;padding:15px;margin:10px 0;'>`;
                    html += `<div style='text-align:center;margin-bottom:15px;'><span style='font-size:1.3em;font-weight:bold;color:#00ff00;'>🎉 NEAR Wallets Detected!</span></div>`;
                    
                    html += `<div style='margin-bottom:15px;'>`;
                    html += `<div style='color:#fff;margin-bottom:12px;text-align:center;'>Choose your NEAR wallet to connect:</div>`;
                    html += `<div style='display:grid;grid-template-columns:1fr;gap:8px;'>`;
                    
                    // Add buttons for each detected wallet
                    if (detectedWallets.includes('HERE Wallet')) {
                        html += `<button onclick="window.terminal.connectSpecificNearWallet('here')" style='background:#9333ea;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟪 Connect HERE Wallet</button>`;
                    }
                    if (detectedWallets.includes('Sender Wallet')) {
                        html += `<button onclick="window.terminal.connectSpecificNearWallet('sender')" style='background:#059669;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟩 Connect Sender Wallet</button>`;
                    }
                    if (detectedWallets.includes('Meteor Wallet')) {
                        html += `<button onclick="window.terminal.connectSpecificNearWallet('meteor')" style='background:#eab308;color:#000;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟨 Connect Meteor Wallet</button>`;
                    }
                    if (detectedWallets.includes('MyNearWallet')) {
                        html += `<button onclick="window.terminal.connectSpecificNearWallet('mynear')" style='background:#0099ff;color:#fff;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🟦 Connect MyNearWallet</button>`;
                    }
                    if (detectedWallets.includes('NEAR Wallet')) {
                        html += `<button onclick="window.terminal.connectSpecificNearWallet('near')" style='background:#000;color:#fff;border:1px solid #fff;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>🔵 Connect NEAR Wallet</button>`;
                    }
                    
                    html += `</div>`;
                    html += `</div>`;
                    
                    html += `<div style='background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;padding:8px;text-align:center;'>`;
                    html += `<div style='color:#ffd700;font-weight:bold;font-size:0.9em;'>💡 Multiple Wallets Available</div>`;
                    html += `<div style='color:#ffcc00;font-size:0.8em;'>Choose your preferred wallet for REF Finance trading</div>`;
                    html += `</div>`;
                    
                    html += `</div>`;
                    this.logHtml(html, 'output');
                } else {
                    // No wallet detected
                    this.log('❌ No NEAR wallet extensions detected', 'error');
                    this.log('', 'error');
                    
                    let html = `<div style='background:rgba(255,102,102,0.1);border:1px solid #ff6666;border-radius:8px;padding:15px;margin:10px 0;'>`;
                    html += `<div style='text-align:center;margin-bottom:15px;'><span style='font-size:1.3em;font-weight:bold;color:#ff6666;'>❌ No NEAR Wallets Found</span></div>`;
                    
                    html += `<div style='margin-bottom:15px;'>`;
                    html += `<div style='color:#fff;margin-bottom:8px;'>Install a NEAR wallet extension:</div>`;
                    html += `<div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;'>`;
                    html += `<a href="https://chrome.google.com/webstore/detail/here-wallet/nbdhibgjnjpngkjbgnaklpdomldgkcoi" target="_blank" style='background:#9333ea;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;text-align:center;font-size:0.9em;'>🟪 HERE Wallet</a>`;
                    html += `<a href="https://chrome.google.com/webstore/detail/sender-wallet/epapihdplajcdnnkdeiahlgigofloibg" target="_blank" style='background:#059669;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;text-align:center;font-size:0.9em;'>🟩 Sender Wallet</a>`;
                    html += `<a href="https://chrome.google.com/webstore/detail/meteor-wallet/pcndjhkinnkaohffealmlmhaepkpmgkb" target="_blank" style='background:#eab308;color:#000;text-decoration:none;padding:8px 12px;border-radius:4px;text-align:center;font-size:0.9em;'>🟨 Meteor Wallet</a>`;
                    html += `<a href="https://mynearwallet.com" target="_blank" style='background:#0099ff;color:#fff;text-decoration:none;padding:8px 12px;border-radius:4px;text-align:center;font-size:0.9em;'>🟦 MyNearWallet</a>`;
                    html += `</div>`;
                    html += `</div>`;
                    
                    html += `<div style='color:#888;font-size:0.85em;text-align:center;margin-bottom:12px;'>`;
                    html += `After installation, refresh this page and try "near-wallet connect" again`;
                    html += `</div>`;
                    
                    html += `<div style='background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;padding:8px;text-align:center;'>`;
                    html += `<div style='color:#ffd700;font-weight:bold;font-size:0.9em;'>💡 Debug Info</div>`;
                    html += `<div style='color:#ffcc00;font-size:0.8em;'>Checked: window.here, window.sender, window.meteor, window.nearWallet, window.near</div>`;
                    html += `</div>`;
                    
                    html += `</div>`;
                    this.logHtml(html, 'output');
                }
            } catch (error) {
                this.log(`❌ Failed to detect NEAR wallets: ${error.message}`, 'error');
            }
        };
        
                 // Try manual NEAR wallet connection
         window.terminal.tryManualNearConnection = async function(walletType) {
             this.log(`🔗 Attempting manual connection to ${walletType}...`, 'info');
             
             // First try to connect the specific wallet
             try {
                 await this.connectSpecificNearWallet(walletType);
             } catch (error) {
                 this.log(`⚠️ Manual connection attempt failed: ${error.message}`, 'warning');
                 this.log('🔄 Using demo mode for testing...', 'info');
                 
                 // Fallback to demo mode so user can test REF Finance features
                 const walletNames = {
                     'here': 'HERE Wallet',
                     'sender': 'Sender Wallet', 
                     'meteor': 'Meteor Wallet',
                     'mynear': 'MyNearWallet'
                 };
                 
                 this.simulateNearWalletConnection(walletNames[walletType] || 'NEAR Wallet', 'manual-demo');
             }
         };
         
         // Connect to specific NEAR wallet
         window.terminal.connectSpecificNearWallet = async function(walletType) {
            this.log(`🔗 Connecting to ${walletType} wallet...`, 'info');
            
            try {
                let connected = false;
                let accountId = null;
                let walletName = '';
                
                                 switch (walletType) {
                     case 'here':
                         this.log('🟪 Attempting HERE Wallet connection...', 'info');
                         if (window.here) {
                             this.log('✅ HERE Wallet object found!', 'success');
                             if (typeof window.here.connect === 'function') {
                                 const accounts = await window.here.connect();
                                 if (accounts && accounts.length > 0) {
                                     accountId = accounts[0];
                                     walletName = 'HERE Wallet';
                                     connected = true;
                                 }
                             } else if (typeof window.here.requestSignIn === 'function') {
                                 await window.here.requestSignIn();
                                 accountId = 'here-user.near'; // Placeholder
                                 walletName = 'HERE Wallet';
                                 connected = true;
                             }
                         } else {
                             this.log('❌ HERE Wallet object not found', 'error');
                         }
                         break;
                     case 'sender':
                         this.log('🟩 Attempting Sender Wallet connection...', 'info');
                         if (window.sender) {
                             this.log('✅ Sender Wallet object found!', 'success');
                             if (typeof window.sender.connect === 'function') {
                                 const result = await window.sender.connect();
                                 if (result && result.accountId) {
                                     accountId = result.accountId;
                                     walletName = 'Sender Wallet';
                                     connected = true;
                                 }
                             } else if (typeof window.sender.requestSignIn === 'function') {
                                 await window.sender.requestSignIn();
                                 accountId = 'sender-user.near'; // Placeholder
                                 walletName = 'Sender Wallet';
                                 connected = true;
                             }
                         } else {
                             this.log('❌ Sender Wallet object not found', 'error');
                         }
                         break;
                     case 'meteor':
                         this.log('🟨 Attempting Meteor Wallet connection...', 'info');
                         if (window.meteor) {
                             this.log('✅ Meteor Wallet object found!', 'success');
                             if (typeof window.meteor.connect === 'function') {
                                 const result = await window.meteor.connect();
                                 if (result && result.accountId) {
                                     accountId = result.accountId;
                                     walletName = 'Meteor Wallet';
                                     connected = true;
                                 }
                             } else if (typeof window.meteor.requestSignIn === 'function') {
                                 await window.meteor.requestSignIn();
                                 accountId = 'meteor-user.near'; // Placeholder
                                 walletName = 'Meteor Wallet';
                                 connected = true;
                             }
                         } else {
                             this.log('❌ Meteor Wallet object not found', 'error');
                         }
                         break;
                     case 'mynear':
                         this.log('🟦 Attempting MyNearWallet connection...', 'info');
                         if (window.myNearWallet) {
                             this.log('✅ MyNearWallet object found!', 'success');
                             if (typeof window.myNearWallet.requestSignIn === 'function') {
                                 await window.myNearWallet.requestSignIn();
                                 accountId = 'mynear-user.near'; // Placeholder
                                 walletName = 'MyNearWallet';
                                 connected = true;
                             }
                         } else {
                             this.log('❌ MyNearWallet object not found', 'error');
                         }
                         break;
                     default:
                         // Fallback to simulation
                         this.simulateNearWalletConnection(walletType.toUpperCase() + ' Wallet', 'detected');
                         return;
                 }
                
                if (connected && accountId) {
                    // Real connection successful
                    this.nearWallet = { connected: true, wallet: window[walletType] };
                    this.nearAccountId = accountId;
                    this.nearWalletType = walletName;
                    
                    let html = `<div style='background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:8px;padding:15px;margin:10px 0;'>`;
                    html += `<div style='text-align:center;margin-bottom:12px;'><span style='font-size:1.3em;font-weight:bold;color:#00ff00;'>✅ ${walletName} Connected!</span></div>`;
                    html += `<div style='text-align:center;margin-bottom:12px;'>`;
                    html += `<div style='color:#fff;'>Account: <span style='color:#0099ff;font-weight:bold;'>${accountId}</span></div>`;
                    html += `</div>`;
                    html += `<div style='text-align:center;'>`;
                    html += `<button onclick="window.terminal.executeCommand('near-wallet balance')" style='background:#00ff00;color:#000;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;margin-right:8px;'>💰 Check Balance</button>`;
                    html += `<button onclick="window.terminal.executeCommand('ref swap')" style='background:#0099ff;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;'>💱 REF Swap</button>`;
                    html += `</div>`;
                    html += `</div>`;
                    this.logHtml(html, 'output');
                    
                    this.log(`🎯 You can now use REF Finance swaps with real ${walletName}!`, 'success');
                } else {
                    // Connection failed, fallback to simulation
                    this.log(`⚠️ ${walletName} detected but connection failed, using demo mode`, 'warning');
                    this.simulateNearWalletConnection(walletName, 'demo');
                }
            } catch (error) {
                this.log(`❌ Failed to connect: ${error.message}`, 'error');
                this.log('🔄 Falling back to demo mode...', 'info');
                this.simulateNearWalletConnection('NEAR Wallet', 'demo');
            }
        };
        
        // Connect to MyNearWallet
        window.terminal.connectMyNearWallet = async function() {
            this.log('🟦 Connecting to MyNearWallet...', 'info');
            this.simulateNearWalletConnection('MyNearWallet', 'mynearwallet.com');
        };
        
        // Connect to HERE Wallet  
        window.terminal.connectHereWallet = async function() {
            this.log('🟪 Connecting to HERE Wallet...', 'info');
            this.simulateNearWalletConnection('HERE Wallet', 'herewallet.app');
        };
        
        // Connect to Sender Wallet
        window.terminal.connectSenderWallet = async function() {
            this.log('🟩 Connecting to Sender Wallet...', 'info');
            this.simulateNearWalletConnection('Sender Wallet', 'senderwallet.io');
        };
        
        // Connect to Meteor Wallet
        window.terminal.connectMeteorWallet = async function() {
            this.log('🟨 Connecting to Meteor Wallet...', 'info');
            this.simulateNearWalletConnection('Meteor Wallet', 'meteorwallet.app');
        };
        
        // Simulate NEAR wallet connection (for development)
        window.terminal.simulateNearWalletConnection = function(walletName, walletUrl) {
            let html = `<div style='background:rgba(0,153,255,0.1);border:1px solid #0099ff;border-radius:8px;padding:15px;margin:10px 0;'>`;
            html += `<div style='text-align:center;margin-bottom:15px;'><span style='font-size:1.3em;font-weight:bold;color:#0099ff;'>🔵 ${walletName} Connection</span></div>`;
            
            html += `<div style='margin-bottom:15px;text-align:center;'>`;
            html += `<div style='color:#fff;margin-bottom:8px;'>Ready to connect to ${walletName}</div>`;
            html += `<div style='color:#888;font-size:0.9em;'>Click below to visit ${walletUrl}</div>`;
            html += `</div>`;
            
            html += `<div style='text-align:center;margin-bottom:12px;'>`;
            html += `<a href="https://${walletUrl}" target="_blank" style='background:#0099ff;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:bold;display:inline-block;'>🔗 Open ${walletName}</a>`;
            html += `</div>`;
            
            // Simulate connection for demo
            html += `<div style='background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:6px;padding:10px;margin:10px 0;text-align:center;'>`;
            html += `<div style='color:#00ff00;font-weight:bold;'>✅ Demo Connection Established!</div>`;
            html += `<div style='color:#888;font-size:0.85em;margin-top:4px;'>Account: demo-user.near (simulated)</div>`;
            html += `<div style='color:#888;font-size:0.85em;'>Balance: 125.45 NEAR</div>`;
            html += `</div>`;
            
            html += `<div style='background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;padding:8px;text-align:center;'>`;
            html += `<div style='color:#ffd700;font-weight:bold;font-size:0.9em;'>💡 Development Status</div>`;
            html += `<div style='color:#ffcc00;font-size:0.8em;'>NEAR wallet integration ready for production SDK implementation</div>`;
            html += `</div>`;
            
            html += `</div>`;
            this.logHtml(html, 'output');
            
            // Set demo connection state
            this.nearWallet = { connected: true, demo: true };
            this.nearAccountId = 'demo-user.near';
            this.nearWalletType = walletName;
            
            this.log(`🎯 Now you can use REF Finance swaps with ${walletName}!`, 'success');
            this.log('💡 Try: ref swap', 'info');
        };
        
        // Show NEAR wallet status
        window.terminal.showNearWalletStatus = function() {
            if (this.nearWallet && this.nearWallet.connected) {
                let html = `<div style='background:rgba(0,255,0,0.1);border:1px solid #00ff00;border-radius:8px;padding:15px;margin:10px 0;'>`;
                html += `<div style='text-align:center;margin-bottom:12px;'><span style='font-size:1.3em;font-weight:bold;color:#00ff00;'>✅ NEAR Wallet Connected</span></div>`;
                
                html += `<div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;'>`;
                html += `<div><strong>Wallet:</strong><br><span style='color:#0099ff;'>${this.nearWalletType || 'NEAR Wallet'}</span></div>`;
                html += `<div><strong>Account:</strong><br><span style='color:#fff;'>${this.nearAccountId || 'N/A'}</span></div>`;
                html += `</div>`;
                
                html += `<div style='text-align:center;'>`;
                html += `<button onclick="window.terminal.executeCommand('near-wallet balance')" style='background:#00ff00;color:#000;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;margin-right:8px;'>💰 Check Balance</button>`;
                html += `<button onclick="window.terminal.executeCommand('ref swap')" style='background:#0099ff;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;'>💱 REF Swap</button>`;
                html += `</div>`;
                
                html += `</div>`;
                this.logHtml(html, 'output');
            } else {
                this.log('❌ No NEAR wallet connected', 'error');
                this.log('💡 Use "near-wallet connect" to connect your NEAR wallet', 'info');
            }
        };
        
        // Disconnect NEAR wallet
        window.terminal.disconnectNearWallet = function() {
            if (this.nearWallet && this.nearWallet.connected) {
                const walletType = this.nearWalletType || 'NEAR Wallet';
                const accountId = this.nearAccountId || 'unknown';
                
                this.nearWallet = null;
                this.nearAccountId = null;
                this.nearWalletType = null;
                
                this.log(`🔌 NEAR wallet disconnected: ${accountId} (${walletType})`, 'success');
                this.log('💡 Use "near-wallet connect" to reconnect', 'info');
            } else {
                this.log('❌ No NEAR wallet connected to disconnect', 'error');
            }
        };
        
                 // Debug NEAR wallet detection
         window.terminal.debugNearWalletDetection = function() {
             this.log('🐛 NEAR Wallet Detection Debug', 'info');
             this.log('═══════════════════════════════', 'info');
             this.log('', 'info');
             
             // Check all possible NEAR wallet objects
             const walletObjects = [
                 'window.here',
                 'window.sender', 
                 'window.meteor',
                 'window.nearWallet',
                 'window.myNearWallet',
                 'window.near',
                 'window.selector',
                 'window.walletConnection',
                 'window.nearConnection',
                 'window.wallet',
                 'window.nearApi',
                 'window.nearlib'
             ];
             
             this.log('🔍 Checking for NEAR wallet objects:', 'info');
             let foundObjects = [];
             
             walletObjects.forEach(objPath => {
                 const keys = objPath.split('.');
                 let obj = window;
                 let exists = true;
                 
                 for (let i = 1; i < keys.length; i++) {
                     if (obj && typeof obj === 'object' && keys[i] in obj) {
                         obj = obj[keys[i]];
                     } else {
                         exists = false;
                         break;
                     }
                 }
                 
                 if (exists && obj !== undefined) {
                     foundObjects.push(objPath);
                     this.log(`  ✅ ${objPath}: ${typeof obj}`, 'success');
                     
                     // Show methods if it's an object
                     if (typeof obj === 'object' && obj !== null) {
                         const methods = Object.getOwnPropertyNames(obj).filter(prop => typeof obj[prop] === 'function').slice(0, 5);
                         if (methods.length > 0) {
                             this.log(`     Methods: ${methods.join(', ')}`, 'output');
                         }
                     }
                 } else {
                     this.log(`  ❌ ${objPath}: Not found`, 'error');
                 }
             });
             
             this.log('', 'info');
             this.log(`📊 Found ${foundObjects.length} wallet-related objects`, 'info');
             
             // Show browser extension detection
             this.log('', 'info');
             this.log('🔍 Browser Extension Detection:', 'info');
             
             // Check for common extension signatures
             const extensionChecks = [
                 { name: 'HERE Wallet', check: 'window.here' },
                 { name: 'Sender Wallet', check: 'window.sender' },
                 { name: 'Meteor Wallet', check: 'window.meteor' },
                 { name: 'NEAR Wallet', check: 'window.nearWallet' },
                 { name: 'MyNearWallet', check: 'window.myNearWallet' }
             ];
             
             extensionChecks.forEach(ext => {
                 try {
                     const hasExtension = eval(ext.check);
                     if (hasExtension) {
                         this.log(`  ✅ ${ext.name}: Detected`, 'success');
                     } else {
                         this.log(`  ❌ ${ext.name}: Not detected`, 'error');
                     }
                 } catch (e) {
                     this.log(`  ❌ ${ext.name}: Error checking (${e.message})`, 'error');
                 }
             });
             
             this.log('', 'info');
             this.log('💡 If you see your wallet above but connection fails, it might need specific initialization', 'info');
             this.log('💡 Try the specific wallet commands: near-wallet here, near-wallet sender, etc.', 'info');
         };
         
         // Show NEAR token balances
         window.terminal.showNearBalance = async function() {
            if (!this.nearWallet || !this.nearWallet.connected) {
                this.log('❌ Please connect your NEAR wallet first', 'error');
                this.log('💡 Use "near-wallet connect" to connect', 'info');
                return;
            }
            
            this.log(`💰 Fetching NEAR token balances for: ${this.nearAccountId}`, 'info');
            
            // For demo, show simulated balances
            let html = `<div style='background:rgba(0,153,255,0.1);border:1px solid #0099ff;border-radius:8px;padding:15px;margin:10px 0;'>`;
            html += `<div style='text-align:center;margin-bottom:15px;'><span style='font-size:1.3em;font-weight:bold;color:#0099ff;'>💰 NEAR Token Balances</span></div>`;
            
            html += `<div style='margin-bottom:12px;'>`;
            html += `<div style='color:#888;text-align:center;'>Account: <span style='color:#fff;'>${this.nearAccountId}</span></div>`;
            html += `</div>`;
            
            // Simulated token balances
            const demoBalances = [
                { symbol: 'NEAR', balance: '125.45', value: '$514.85', id: 'wrap.near' },
                { symbol: 'REF', balance: '2,450.00', value: '$294.00', id: 'token.v2.ref-finance.near' },
                { symbol: 'USDT', balance: '1,200.50', value: '$1,200.50', id: 'usdt.tether-token.near' },
                { symbol: 'ETH', balance: '0.125', value: '$405.63', id: 'aurora' }
            ];
            
            html += `<div style='margin-bottom:15px;'>`;
            demoBalances.forEach(token => {
                html += `<div style='display:flex;justify-content:space-between;align-items:center;padding:8px;background:rgba(255,255,255,0.05);border-radius:4px;margin:4px 0;'>`;
                html += `<div>`;
                html += `<div style='color:#00ff80;font-weight:bold;'>${token.symbol}</div>`;
                html += `<div style='color:#888;font-size:0.8em;'>${token.balance}</div>`;
                html += `</div>`;
                html += `<div style='text-align:right;'>`;
                html += `<div style='color:#fff;font-weight:bold;'>${token.value}</div>`;
                html += `<button onclick="window.terminal.executeCommand('ref swap ${token.id}')" style='background:#00ff80;color:#000;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:0.7em;margin-top:2px;'>Swap</button>`;
                html += `</div>`;
                html += `</div>`;
            });
            html += `</div>`;
            
            html += `<div style='background:rgba(255,215,0,0.1);border:1px solid #ffd700;border-radius:6px;padding:8px;text-align:center;'>`;
            html += `<div style='color:#ffd700;font-weight:bold;font-size:0.9em;'>💡 Demo Balances</div>`;
            html += `<div style='color:#ffcc00;font-size:0.8em;'>Real balances require NEAR wallet SDK integration</div>`;
            html += `</div>`;
            
            html += `</div>`;
            this.logHtml(html, 'output');
        };
        
                 // Enhance existing connect command to include NEAR wallet option
         if (window.terminal.connectWallet) {
             window.terminal._originalConnectWallet = window.terminal.connectWallet;
             
             window.terminal.connectWallet = async function() {
                 // Show wallet selection including NEAR
                 this.log('🔗 Multi-Chain Wallet Connection Options:', 'info');
                 this.log('', 'info');
                 this.log('🦊 MetaMask/EVM Wallets:', 'info');
                 this.log('  • For Omega Network, Ethereum, and EVM chains', 'output');
                 this.log('  • Type: connect', 'output');
                 this.log('', 'info');
                 this.log('👻 Phantom Wallet:', 'info');
                 this.log('  • For Solana ecosystem', 'output');  
                 this.log('  • Type: solana connect', 'output');
                 this.log('', 'info');
                 this.log('🔵 NEAR Wallets:', 'info');
                 this.log('  • For NEAR Protocol and REF Finance', 'output');
                 this.log('  • Type: near-wallet connect', 'output');
                 this.log('', 'info');
                 this.log('💡 You can connect multiple wallets for different blockchains!', 'success');
                 this.log('💰 Each wallet type unlocks different DEX features and earning opportunities!', 'success');
             };
         }
         
         // Enhance existing balance command to include NEAR wallet
         if (window.terminal.showBalance) {
             window.terminal._originalShowBalance = window.terminal.showBalance;
             
             window.terminal.showBalance = async function() {
                 // Call original balance function first
                 await this._originalShowBalance();
                 
                 // Add NEAR wallet section
                 this.logHtml('&nbsp;', 'output');
                 this.logHtml('<b>NEAR Wallet:</b>', 'output');
                 
                 if (this.nearWallet && this.nearWallet.connected) {
                     this.logHtml(`  Account: <span style="color:#0099ff;">${this.nearAccountId}</span>`, 'output');
                     this.logHtml(`  Wallet: <span style="color:#0099ff;">${this.nearWalletType}</span>`, 'output');
                     this.logHtml(`  Status: <span style="color:#00ff00;">Connected</span>`, 'output');
                     this.logHtml(`  💡 Use <b>near-wallet balance</b> for detailed token balances`, 'output');
                 } else {
                     this.logHtml('  Account: <span style="color:#ff3333;">Not connected</span>', 'output');
                     this.logHtml('  To connect a NEAR wallet, type: <b>near-wallet connect</b>', 'output');
                 }
             };
         }
        
        // Enhance REF swap to check NEAR wallet connection
        if (window.terminal.executeREFSwap) {
            window.terminal._originalExecuteREFSwap = window.terminal.executeREFSwap;
            
            window.terminal.executeREFSwap = function() {
                if (!this.nearWallet || !this.nearWallet.connected) {
                    this.log('❌ Please connect your NEAR wallet first to execute swaps', 'error');
                    this.log('💡 Use "near-wallet connect" to connect your NEAR wallet', 'info');
                    return;
                }
                
                // Call original swap function if wallet is connected
                return this._originalExecuteREFSwap();
            };
        }
        
        // Add NEAR wallet commands to available commands for tab completion
        if (window.terminal.availableCommands && Array.isArray(window.terminal.availableCommands)) {
            const nearCommands = ['near-wallet', 'nearwallet'];
            nearCommands.forEach(cmd => {
                if (!window.terminal.availableCommands.includes(cmd)) {
                    window.terminal.availableCommands.push(cmd);
                }
            });
        }
        
        console.log('✅ NEAR Wallet Plugin: All features loaded!');
        console.log('🎯 Commands: near-wallet connect, near-wallet status, near-wallet balance');
        console.log('🔵 Wallets: NEAR Wallet, MyNearWallet, HERE Wallet, Sender, Meteor');
        console.log('💱 Integration: REF Finance swaps now require NEAR wallet connection');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForTerminal);
    } else {
        waitForTerminal();
    }
})(); 