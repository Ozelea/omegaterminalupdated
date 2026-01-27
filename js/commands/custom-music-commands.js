// Custom Music Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.CustomMusic = {
    // Upload music command
    'upload music': function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('upload music', '🎵 OPENING CUSTOM MUSIC PLAYER...');
        }
        
        terminal.log('🎵 Opening Custom Music Player...', 'info');
        
        // Open the custom music player panel
        if (window.OmegaCustomMusicPlayer) {
            window.OmegaCustomMusicPlayer.createPanel();
            terminal.log('✅ Custom Music Player opened!', 'success');
            terminal.log('💡 Drag and drop audio files or click to upload', 'info');
            terminal.log('🎧 Supported formats: MP3, WAV, OGG, M4A, AAC', 'info');
        } else {
            terminal.log('❌ Custom Music Player not available', 'error');
        }
    },

    // Playlist management command
    'playlist': function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('playlist', '📋 MANAGING CUSTOM PLAYLIST...');
        }
        
        terminal.log('📋 Custom Playlist Management', 'info');
        
        if (window.OmegaCustomMusicPlayer) {
            const playlist = window.OmegaCustomMusicPlayer.currentPlaylist;
            const playlistName = window.OmegaCustomMusicPlayer.playlistName;
            
            terminal.log('', '');
            terminal.log(`🎵 Playlist: ${playlistName}`, 'info');
            terminal.log(`📊 Tracks: ${playlist.length}`, 'info');
            
            if (playlist.length === 0) {
                terminal.log('📝 No tracks in playlist yet', 'info');
                terminal.log('💡 Use "upload music" to add tracks', 'info');
            } else {
                terminal.log('', '');
                terminal.log('🎶 Current Playlist:', 'info');
                playlist.forEach((track, index) => {
                    const duration = window.OmegaCustomMusicPlayer.formatDuration(track.duration);
                    terminal.log(`  ${index + 1}. ${track.name} (${duration})`, 'info');
                });
            }
            
            terminal.log('', '');
            terminal.log('💡 Commands:', 'info');
            terminal.log('  • upload music - Open player to add tracks', 'info');
            terminal.log('  • playlist - Show current playlist', 'info');
        } else {
            terminal.log('❌ Custom Music Player not available', 'error');
        }
    },

    // Help command
    'help': function(terminal) {
        terminal.log('🎵 Custom Music Commands:', 'info');
        terminal.log('', '');
        terminal.log('📁 upload music - Open custom music player', 'info');
        terminal.log('📋 playlist - Show current playlist', 'info');
        terminal.log('❓ help - Show this help message', 'info');
        terminal.log('', '');
        terminal.log('🎧 Supported audio formats:', 'info');
        terminal.log('  • MP3, WAV, OGG, M4A, AAC', 'info');
        terminal.log('', '');
        terminal.log('💡 Features:', 'info');
        terminal.log('  • Upload your own music files', 'info');
        terminal.log('  • Create custom playlists', 'info');
        terminal.log('  • Play tracks with waveform animation', 'info');
        terminal.log('  • Persistent storage in browser', 'info');
    }
};

// Add commands to terminal
if (window.terminal && window.terminal.addCommand) {
    window.terminal.addCommand('upload music', window.OmegaCommands.CustomMusic['upload music']);
    window.terminal.addCommand('playlist', window.OmegaCommands.CustomMusic.playlist);
    window.terminal.addCommand('custom music help', window.OmegaCommands.CustomMusic.help);
}

console.log('✅ Custom Music Commands loaded');
