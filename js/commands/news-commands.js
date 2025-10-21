/**
 * News Commands Module
 * Handles news panel and terminal commands
 */

window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.News = {
    // Open news reader panel
    open: async function(terminal) {
        if (window.OmegaNewsReader) {
            await window.OmegaNewsReader.openPanel();
        } else {
            terminal.log('❌ News Reader not loaded. Please refresh.', 'error');
        }
    },

    // Close news reader panel
    close: function(terminal) {
        if (window.OmegaNewsReader) {
            window.OmegaNewsReader.closePanel();
        } else {
            terminal.log('❌ News Reader not loaded.', 'error');
        }
    },

    // Help command
    help: function(terminal) {
        terminal.log('📰 News Reader Commands:', 'info');
        terminal.log('', 'output');
        terminal.log('  news open              Open news reader panel', 'info');
        terminal.log('  news close             Close news reader panel', 'info');
        terminal.log('  news latest            Show latest news in terminal', 'info');
        terminal.log('  news hot               Show hot news in terminal', 'info');
        terminal.log('  news bullish           Show bullish news', 'info');
        terminal.log('  news bearish           Show bearish news', 'info');
        terminal.log('  news btc               Bitcoin news', 'info');
        terminal.log('  news eth               Ethereum news', 'info');
        terminal.log('  news sol               Solana news', 'info');
        terminal.log('', 'output');
        terminal.log('💡 Use "news open" to view news in a modern sidebar panel!', 'success');
    },

    // Main news command router
    news: async function(terminal, args) {
        if (!args || args.length === 0) {
            // Default: open news reader panel
            await this.open(terminal);
            return;
        }

        const subCommand = args[0]?.toLowerCase();

        switch (subCommand) {
            case 'open':
                await this.open(terminal);
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
                // Pass to original crypto news commands if they exist
                if (window.CryptoNewsCommands && window.CryptoNewsCommands.news) {
                    await window.CryptoNewsCommands.news(terminal, args);
                } else {
                    terminal.log(`❌ Unknown news command: ${subCommand}`, 'error');
                    terminal.log('💡 Type "news help" for available commands', 'info');
                }
                break;
        }
    }
};

console.log('📰 News Commands Module loaded');

