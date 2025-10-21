/**
 * YouTube Commands for Omega Terminal
 * Allows users to search and watch YouTube videos in the sidebar
 */

window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.YouTube = {
    
    // Main YouTube command handler
    youtube: async function(terminal, args) {
        const subcommand = args[1] ? args[1].toLowerCase() : 'help';
        
        switch (subcommand) {
            case 'open':
                await this.open(terminal);
                break;
            
            case 'close':
                this.close(terminal);
                break;
            
            case 'search':
                const searchQuery = args.slice(2).join(' ');
                await this.search(terminal, searchQuery);
                break;
            
            case 'play':
                const videoId = args[2];
                this.play(terminal, videoId);
                break;
            
            case 'pause':
                this.pause(terminal);
                break;
            
            case 'next':
                this.next(terminal);
                break;
            
            case 'prev':
            case 'previous':
                this.previous(terminal);
                break;
            
            case 'mute':
                this.mute(terminal);
                break;
            
            case 'unmute':
                this.unmute(terminal);
                break;
            
            case 'help':
            default:
                this.help(terminal);
                break;
        }
    },
    
    // Open YouTube player panel
    open: async function(terminal) {
        if (window.OmegaYouTube) {
            if (window.OmegaYouTube.isOpen()) {
                terminal.log('ℹ️ YouTube Player is already open', 'info');
                return;
            }
            
            terminal.log('🎥 Opening YouTube Player...', 'info');
            await window.OmegaYouTube.createPanel();
        } else {
            terminal.log('❌ YouTube Player not available. Please refresh the page.', 'error');
        }
    },
    
    // Close YouTube player panel
    close: function(terminal) {
        if (window.OmegaYouTube) {
            window.OmegaYouTube.closePanel();
        } else {
            terminal.log('❌ YouTube Player not available', 'error');
        }
    },
    
    // Search YouTube videos
    search: async function(terminal, query) {
        if (!query || query.trim() === '') {
            terminal.log('❌ Please provide a search query', 'error');
            terminal.log('💡 Usage: youtube search <query>', 'info');
            terminal.log('💡 Example: youtube search lofi hip hop', 'info');
            return;
        }
        
        if (!window.OmegaYouTube) {
            terminal.log('❌ YouTube Player not available', 'error');
            return;
        }
        
        // Open panel if not already open
        if (!window.OmegaYouTube.isOpen()) {
            await this.open(terminal);
            // Wait a bit for panel to render
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Perform search
        await window.OmegaYouTube.search(query);
    },
    
    // Play a specific video by ID
    play: function(terminal, videoId) {
        if (!videoId) {
            terminal.log('❌ Please provide a video ID', 'error');
            terminal.log('💡 Usage: youtube play <video-id>', 'info');
            terminal.log('💡 Example: youtube play dQw4w9WgXcQ', 'info');
            return;
        }
        
        if (!window.OmegaYouTube) {
            terminal.log('❌ YouTube Player not available', 'error');
            return;
        }
        
        // Open panel if not already open
        if (!window.OmegaYouTube.isOpen()) {
            this.open(terminal);
            setTimeout(() => {
                window.OmegaYouTube.playVideo(videoId);
            }, 500);
        } else {
            window.OmegaYouTube.playVideo(videoId);
        }
    },
    
    // Pause current video
    pause: function(terminal) {
        if (!window.OmegaYouTube || !window.OmegaYouTube.player) {
            terminal.log('❌ No video is playing', 'error');
            return;
        }
        
        window.OmegaYouTube.player.pauseVideo();
        terminal.log('⏸️ Video paused', 'info');
    },
    
    // Play next video in playlist
    next: function(terminal) {
        if (!window.OmegaYouTube || !window.OmegaYouTube.player) {
            terminal.log('❌ No playlist available', 'error');
            return;
        }
        
        window.OmegaYouTube.next();
    },
    
    // Play previous video in playlist
    previous: function(terminal) {
        if (!window.OmegaYouTube || !window.OmegaYouTube.player) {
            terminal.log('❌ No playlist available', 'error');
            return;
        }
        
        window.OmegaYouTube.previous();
    },
    
    // Mute video
    mute: function(terminal) {
        if (!window.OmegaYouTube || !window.OmegaYouTube.player) {
            terminal.log('❌ No video is playing', 'error');
            return;
        }
        
        window.OmegaYouTube.player.mute();
        terminal.log('🔇 Video muted', 'info');
    },
    
    // Unmute video
    unmute: function(terminal) {
        if (!window.OmegaYouTube || !window.OmegaYouTube.player) {
            terminal.log('❌ No video is playing', 'error');
            return;
        }
        
        window.OmegaYouTube.player.unMute();
        terminal.log('🔊 Video unmuted', 'info');
    },
    
    // Display help information
    help: function(terminal) {
        terminal.log('🎥 YouTube Player Commands', 'info');
        terminal.log('═══════════════════════════════════════', 'output');
        terminal.log('');
        
        terminal.log('📺 PLAYER CONTROLS:', 'success');
        terminal.log('  youtube open              Open YouTube player panel', 'output');
        terminal.log('  youtube close             Close YouTube player panel', 'output');
        terminal.log('  youtube search <query>    Search for videos', 'output');
        terminal.log('  youtube play <video-id>   Play specific video by ID', 'output');
        terminal.log('  youtube pause             Pause current video', 'output');
        terminal.log('  youtube next              Play next video in playlist', 'output');
        terminal.log('  youtube prev              Play previous video', 'output');
        terminal.log('  youtube mute              Mute audio', 'output');
        terminal.log('  youtube unmute            Unmute audio', 'output');
        terminal.log('');
        
        terminal.log('💡 EXAMPLES:', 'info');
        terminal.log('  youtube search lofi hip hop        Search for lofi videos', 'output');
        terminal.log('  youtube search coding music        Search for coding music', 'output');
        terminal.log('  youtube search crypto news         Search for crypto news', 'output');
        terminal.log('  youtube play dQw4w9WgXcQ           Play specific video', 'output');
        terminal.log('');
        
        terminal.log('✨ FEATURES:', 'success');
        terminal.log('  • Search YouTube with any query', 'output');
        terminal.log('  • Watch videos in sidebar panel', 'output');
        terminal.log('  • Click thumbnails to play', 'output');
        terminal.log('  • Auto-play next video in playlist', 'output');
        terminal.log('  • Full playback controls', 'output');
        terminal.log('  • Works with all themes', 'output');
        terminal.log('');
        
        terminal.log('🎯 QUICK START:', 'info');
        terminal.log('  1. youtube open', 'output');
        terminal.log('  2. youtube search your favorite topic', 'output');
        terminal.log('  3. Click any thumbnail to watch!', 'output');
        terminal.log('');
        
        terminal.log('💡 TIP: YouTube player appears in the right sidebar', 'success');
        terminal.log('        Use "view futuristic" for the best experience', 'info');
    }
};

console.log('🎥 YouTube Commands loaded');

