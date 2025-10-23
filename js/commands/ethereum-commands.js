// Ethereum Collections Commands (Magic Eden API)
(function() {
    'use strict';

    console.log('🔷 Loading Ethereum Collections Commands...');

    // Register commands with Omega Commands
    if (!window.OmegaCommands) {
        window.OmegaCommands = {};
    }

    window.OmegaCommands.Ethereum = {
        // Main eth command router
        eth: async function(terminal, args) {
            const subcommand = args[0];

            if (!subcommand || subcommand === 'help') {
                this.showHelp(terminal);
                return;
            }

            switch (subcommand.toLowerCase()) {
                case 'collections':
                    await this.showCollections(terminal, args.slice(1));
                    break;
                default:
                    terminal.log(`❌ Unknown command: eth ${subcommand}`, 'error');
                    terminal.log('Type "eth help" for available commands', 'info');
            }
        },

        // Show top Ethereum collections
        showCollections: async function(terminal, params) {
            const limit = params[0] ? parseInt(params[0]) : 20;

            terminal.log(`📊 Loading Ethereum collections...`, 'info');
            terminal.log(''); // Blank line

            try {
                const url = `http://localhost:4000/magiceden/eth/collections?limit=${limit}&sortBy=allTimeVolume`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const collections = data.collections || [];

                if (collections.length === 0) {
                    terminal.log('❌ No collections found', 'warning');
                    return;
                }

                terminal.logHtml(`<div style="font-size: 16px; font-weight: 500; color: #00D4FF; margin-bottom: 10px;">Top ${collections.length} Ethereum Collections</div>`, 'output');

                // Display in grid like Solana view
                let gridHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; margin: 0;">';
                
                collections.forEach((collection, index) => {
                    const name = collection.name || 'Unknown';
                    const imageUrl = collection.image || 'https://via.placeholder.com/200?text=No+Image';
                    
                    // Volume and floor price formatting
                    const volume = collection.volume?.allTime ? `${(collection.volume.allTime / 1e18).toFixed(2)} ETH` : 'N/A';
                    const floorPrice = collection.floorAsk?.price?.amount?.native ? `${collection.floorAsk.price.amount.native.toFixed(4)} ETH` : 'N/A';
                    
                    gridHTML += `
                        <div style="background: rgba(0, 212, 255, 0.02); border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 3px; overflow: hidden; transition: all 0.15s; cursor: pointer;" 
                             onmouseover="this.style.borderColor='rgba(0, 212, 255, 0.4)'; this.style.background='rgba(0, 212, 255, 0.05)';"
                             onmouseout="this.style.borderColor='rgba(0, 212, 255, 0.1)'; this.style.background='rgba(0, 212, 255, 0.02)';">
                            <img src="${imageUrl}" alt="${name}" style="width: 100%; aspect-ratio: 1; object-fit: cover; display: block;" onerror="this.src='https://via.placeholder.com/200?text=No+Image'" />
                            <div style="padding: 4px 6px;">
                                <div style="color: rgba(255, 255, 255, 0.7); font-weight: 500; font-size: 9px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${name}">${name}</div>
                                <div style="color: #00FF88; font-weight: 600; font-size: 10px;">${floorPrice}</div>
                                <div style="color: rgba(255, 255, 255, 0.5); font-size: 8px;">Vol: ${volume}</div>
                            </div>
                        </div>
                    `;
                });
                
                gridHTML += '</div>';
                terminal.logHtml(gridHTML, 'output');

            } catch (error) {
                terminal.log(`❌ Failed to fetch collections: ${error.message}`, 'error');
                if (error.message.includes('fetch') || error.message.includes('timeout')) {
                    terminal.log('⚠️ Magic Eden API may be temporarily unavailable. Try again in a moment.', 'warning');
                }
            }
        },

        // Show help
        showHelp: function(terminal) {
            terminal.log('', 'output');
            terminal.log('═══════════════════════════════════════════', 'output');
            terminal.log('🔷 ETHEREUM COLLECTIONS (Magic Eden)', 'output');
            terminal.log('═══════════════════════════════════════════', 'output');
            terminal.log('', 'output');
            terminal.log('Available Commands:', 'info');
            terminal.log('  eth collections [limit]    - Show top Ethereum collections', 'output');
            terminal.log('', 'output');
            terminal.log('Examples:', 'info');
            terminal.log('  eth collections           - Show top 20 Ethereum collections', 'output');
            terminal.log('  eth collections 10        - Show top 10 collections', 'output');
            terminal.log('', 'output');
        }
    };

    // Register the main eth command
    if (window.terminal && window.terminal.registerCommand) {
        window.terminal.registerCommand('eth', {
            description: 'Ethereum collections commands',
            execute: async function(...args) {
                await window.OmegaCommands.Ethereum.eth(this, args);
            }
        });
        console.log('✅ Ethereum commands registered: eth');
    }

    console.log('✅ Ethereum Collections Commands loaded successfully!');
})();

