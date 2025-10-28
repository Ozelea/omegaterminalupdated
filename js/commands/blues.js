/**
 * Blues Commands for Omega Terminal
 * Custom music player command for Blues audio
 */

window.OmegaCommands = window.OmegaCommands || {};

console.log('🎵 Loading Blues Commands...');

window.OmegaCommands.Blues = {
    
    // Main Blues command handler
    blues: async function(terminal, args) {
        const subcommand = args[1] ? args[1].toLowerCase() : 'play';
        
        switch (subcommand) {
            case 'play':
                await this.play(terminal);
                break;
            
            case 'stop':
                this.stop(terminal);
                break;
            
            case 'pause':
                this.pause(terminal);
                break;
            
            case 'volume':
                const volume = args[2];
                this.setVolume(terminal, volume);
                break;
            
            case 'help':
            default:
                this.help(terminal);
                break;
        }
    },
    
    // Play Blues music
    play: async function(terminal) {
        terminal.log('🎵 Loading Blues Player...', 'info');
        
        if (!window.OmegaBluesPlayer) {
            terminal.log('❌ Blues Player not available. Please refresh the page.', 'error');
            return;
        }
        
        try {
            // Check if player is already open
            if (window.OmegaBluesPlayer.isOpen()) {
                terminal.log('ℹ️ Blues Player is already open', 'info');
                window.OmegaBluesPlayer.play();
                return;
            }
            
            // Create and show the player panel
            await window.OmegaBluesPlayer.createPanel();
            terminal.log('✅ Blues Player opened successfully!', 'success');
            terminal.log('🎵 Now playing: Dark Blues Playlist', 'info');
            
        } catch (error) {
            console.error('Blues player error:', error);
            terminal.log('❌ Failed to open Blues Player', 'error');
            terminal.log('💡 Please try refreshing the page', 'info');
        }
    },
    
    // Stop Blues music
    stop: function(terminal) {
        if (!window.OmegaBluesPlayer) {
            terminal.log('❌ Blues Player not available', 'error');
            return;
        }
        
        if (!window.OmegaBluesPlayer.isOpen()) {
            terminal.log('ℹ️ Blues Player is not open', 'info');
            return;
        }
        
        window.OmegaBluesPlayer.pause();
        terminal.log('⏹️ Blues music stopped', 'info');
    },
    
    // Pause Blues music
    pause: function(terminal) {
        if (!window.OmegaBluesPlayer) {
            terminal.log('❌ Blues Player not available', 'error');
            return;
        }
        
        if (!window.OmegaBluesPlayer.isOpen()) {
            terminal.log('ℹ️ Blues Player is not open', 'info');
            return;
        }
        
        window.OmegaBluesPlayer.togglePlayPause();
        terminal.log('⏸️ Blues music paused/resumed', 'info');
    },
    
    // Set volume
    setVolume: function(terminal, volume) {
        if (!volume) {
            terminal.log('❌ Please provide a volume level (0-100)', 'error');
            terminal.log('💡 Usage: blues volume 50', 'info');
            return;
        }
        
        const volumeNum = parseInt(volume);
        if (isNaN(volumeNum) || volumeNum < 0 || volumeNum > 100) {
            terminal.log('❌ Volume must be a number between 0 and 100', 'error');
            return;
        }
        
        if (!window.OmegaBluesPlayer) {
            terminal.log('❌ Blues Player not available', 'error');
            return;
        }
        
        window.OmegaBluesPlayer.setVolume(volumeNum / 100);
        terminal.log(`🔊 Volume set to ${volumeNum}%`, 'success');
    },
    
    // Show help
    help: function(terminal) {
        terminal.log('🎵 Omega Blues Commands:', 'info');
        terminal.log('', '');
        terminal.log('  blues          - Open Omega Blues Player and start playing', 'info');
        terminal.log('  blues play     - Start playing Dark Blues Playlist', 'info');
        terminal.log('  blues pause    - Pause/resume Dark Blues Playlist', 'info');
        terminal.log('  blues stop     - Stop Dark Blues Playlist', 'info');
        terminal.log('  blues volume <0-100> - Set volume level', 'info');
        terminal.log('  blues help     - Show this help message', 'info');
        terminal.log('', '');
        terminal.log('🎵 Features:', 'info');
        terminal.log('  • Custom Dark Blues audio player', 'info');
        terminal.log('  • Volume control', 'info');
        terminal.log('  • Progress bar with seek functionality', 'info');
        terminal.log('  • Play/pause controls', 'info');
        terminal.log('  • Right panel integration', 'info');
        terminal.log('', '');
        terminal.log('💡 Example: blues volume 75', 'info');
    }
};
