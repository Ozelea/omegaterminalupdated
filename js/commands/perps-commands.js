/**
 * Perps Commands Module
 * Handles Omega Perps interface commands
 */

window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Perps = {
    // Open perps viewer
    open: function(terminal, pair = 'ETH_USDC') {
        if (window.OmegaPerpsViewer) {
            const url = `https://omegaperps.omeganetwork.co/perp/PERP_${pair.toUpperCase()}/`;
            window.OmegaPerpsViewer.openPanel(url);
        } else {
            terminal.log('❌ Perps Viewer not loaded. Please refresh.', 'error');
        }
    },

    // Close perps viewer
    close: function(terminal) {
        if (window.OmegaPerpsViewer) {
            window.OmegaPerpsViewer.closePanel();
        }
    },

    // Help command
    help: function(terminal) {
        terminal.log('📊 Omega Perps Commands:', 'info');
        terminal.log('', 'output');
        terminal.log('  perp                   Open perps trading interface', 'info');
        terminal.log('  perp open              Same as above', 'info');
        terminal.log('  perp close             Close perps interface', 'info');
        terminal.log('  perps                  Alias for perp', 'info');
        terminal.log('', 'output');
        terminal.log('📊 Available Pairs:', 'info');
        terminal.log('  • ETH/USDC - Ethereum perpetual', 'output');
        terminal.log('  • BTC/USDC - Bitcoin perpetual (coming soon)', 'output');
        terminal.log('  • SOL/USDC - Solana perpetual (coming soon)', 'output');
        terminal.log('', 'output');
        terminal.log('💡 Opens a trading interface in the sidebar panel', 'success');
        terminal.log('🌐 Network: Omega Network', 'info');
    },

    // Main perp command router
    perp: function(terminal, args) {
        if (!args || args.length === 0) {
            // Default: open perps viewer
            this.open(terminal);
            return;
        }

        const subCommand = args[0]?.toLowerCase();

        switch (subCommand) {
            case 'open':
                const pair = args[1] || 'ETH_USDC';
                this.open(terminal, pair);
                break;
            
            case 'close':
                this.close(terminal);
                break;
            
            case 'help':
            case '--help':
            case '-h':
                this.help(terminal);
                break;
            
            default:
                // Unknown subcommand, open with default
                this.open(terminal);
                break;
        }
    }
};

console.log('📊 Perps Commands Module loaded');

