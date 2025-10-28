/**
 * Omega Custom Music Player
 * Allows users to upload their own music files and create playlists
 * Integrates with the existing music player system
 */

(function() {
    'use strict';

    console.log('🎵 Loading Omega Custom Music Player...');

    // Custom Music Configuration
    const CUSTOM_MUSIC_CONFIG = {
        STORAGE_KEY: 'omega-custom-music-playlist',
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
        ALLOWED_FORMATS: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'],
        PLAYER_ID: 'omega-custom-music-player',
        PLAYER_TITLE: 'Custom Music Player',
        DEFAULT_PLAYLIST_NAME: 'My Playlist'
    };

    class OmegaCustomMusicPlayer {
        constructor() {
            this.currentPlaylist = [];
            this.currentTrackIndex = 0;
            this.isPlaying = false;
            this.audioElement = null;
            this.playlistName = CUSTOM_MUSIC_CONFIG.DEFAULT_PLAYLIST_NAME;
            
            // Initialize the custom music player
            this.init();
        }

        // Initialize the Custom Music player
        init() {
            console.log('🎵 Initializing Custom Music Player...');
            this.loadPlaylist();
            console.log('✅ Custom Music Player initialized');
        }

        // Load playlist from localStorage
        loadPlaylist() {
            try {
                const saved = localStorage.getItem(CUSTOM_MUSIC_CONFIG.STORAGE_KEY);
                if (saved) {
                    const data = JSON.parse(saved);
                    this.currentPlaylist = data.playlist || [];
                    this.playlistName = data.name || CUSTOM_MUSIC_CONFIG.DEFAULT_PLAYLIST_NAME;
                    console.log('✅ Custom playlist loaded:', this.currentPlaylist.length, 'tracks');
                }
            } catch (error) {
                console.error('Error loading custom playlist:', error);
                this.currentPlaylist = [];
            }
        }

        // Save playlist to localStorage
        savePlaylist() {
            try {
                const data = {
                    playlist: this.currentPlaylist,
                    name: this.playlistName,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem(CUSTOM_MUSIC_CONFIG.STORAGE_KEY, JSON.stringify(data));
                console.log('✅ Custom playlist saved');
            } catch (error) {
                console.error('Error saving custom playlist:', error);
            }
        }

        // Handle file upload
        handleFileUpload(files) {
            console.log('🎵 Processing', files.length, 'files...');
            
            let addedCount = 0;
            let rejectedCount = 0;
            const rejectedReasons = [];
            
            Array.from(files).forEach(file => {
                const validationResult = this.validateFile(file);
                if (validationResult === true) {
                    const wasAdded = this.addTrackToPlaylist(file);
                    if (wasAdded) {
                        addedCount++;
                    } else {
                        rejectedCount++;
                        rejectedReasons.push(`${file.name}: Already in playlist`);
                    }
                } else {
                    rejectedCount++;
                    rejectedReasons.push(`${file.name}: ${validationResult}`);
                }
            });
            
            if (addedCount > 0) {
                this.savePlaylist();
                this.updatePlaylistDisplay();
                console.log(`✅ Added ${addedCount} tracks to playlist`);
                
                // Show success feedback
                if (window.terminal) {
                    window.terminal.log(`🎵 Added ${addedCount} track${addedCount > 1 ? 's' : ''} to playlist!`, 'success');
                }
                
                // Clear file input to prevent re-uploading same files
                this.clearFileInput();
            }
            
            if (rejectedCount > 0) {
                console.warn('Rejected files:', rejectedReasons);
                if (window.terminal) {
                    window.terminal.log(`❌ ${rejectedCount} file${rejectedCount > 1 ? 's' : ''} rejected:`, 'error');
                    rejectedReasons.forEach(reason => {
                        window.terminal.log(`   • ${reason}`, 'error');
                    });
                }
            }
            
            if (addedCount === 0 && rejectedCount === 0) {
                if (window.terminal) {
                    window.terminal.log('❌ No valid audio files were found', 'error');
                }
            }
        }

        // Clear file input to prevent re-uploading same files
        clearFileInput() {
            const fileInput = document.querySelector('.custom-music-file-input');
            if (fileInput) {
                fileInput.value = '';
                console.log('✅ File input cleared');
            }
        }

        // Validate uploaded file
        validateFile(file) {
            console.log('🎵 Validating file:', file.name, 'Type:', file.type, 'Size:', file.size);
            
            // Check file extension as fallback for MIME type issues
            const fileName = file.name.toLowerCase();
            const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma'];
            const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
            
            // Check MIME type
            const validMimeTypes = [
                'audio/mp3', 'audio/mpeg', 'audio/mp4',
                'audio/wav', 'audio/wave', 'audio/x-wav',
                'audio/ogg', 'audio/vorbis',
                'audio/m4a', 'audio/mp4a-latm', 'audio/x-m4a',
                'audio/aac', 'audio/aacp',
                'audio/flac', 'audio/x-flac',
                'audio/wma', 'audio/x-ms-wma'
            ];
            
            const hasValidMimeType = validMimeTypes.includes(file.type);
            
            if (!hasValidMimeType && !hasValidExtension) {
                console.warn('❌ Unsupported file type:', file.type, 'Extension check:', hasValidExtension);
                return `Unsupported file type (${file.type})`;
            }

            // Check file size
            if (file.size > CUSTOM_MUSIC_CONFIG.MAX_FILE_SIZE) {
                console.warn('❌ File too large:', file.size, 'bytes (max:', CUSTOM_MUSIC_CONFIG.MAX_FILE_SIZE, ')');
                return `File too large (${Math.round(file.size / 1024 / 1024)}MB, max 50MB)`;
            }

            console.log('✅ File validation passed:', file.name);
            return true;
        }

        // Add track to playlist
        addTrackToPlaylist(file) {
            // Check if track already exists to prevent duplicates
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            const existingTrack = this.currentPlaylist.find(track => track.name === fileName);
            
            if (existingTrack) {
                console.log('⚠️ Track already exists:', fileName);
                if (window.terminal) {
                    window.terminal.log(`⚠️ Track "${fileName}" already in playlist`, 'warning');
                }
                return false; // Don't add duplicate
            }

            const track = {
                id: Date.now() + Math.random(),
                name: fileName,
                file: file,
                url: URL.createObjectURL(file),
                duration: 0, // Will be set when loaded
                addedAt: new Date().toISOString()
            };

            this.currentPlaylist.push(track);
            console.log('✅ Added track:', track.name);
            return true; // Successfully added
        }

        // Remove track from playlist
        removeTrack(trackId) {
            const track = this.currentPlaylist.find(t => t.id === trackId);
            if (!track) {
                console.warn('Track not found for removal:', trackId);
                return;
            }

            // Show confirmation dialog
            const confirmed = confirm(`Are you sure you want to remove "${track.name}" from the playlist?`);
            if (!confirmed) {
                return;
            }

            const index = this.currentPlaylist.findIndex(t => t.id === trackId);
            if (index !== -1) {
                // If we're removing the currently playing track, stop playback
                if (index === this.currentTrackIndex) {
                    if (this.audioElement) {
                        this.audioElement.pause();
                        this.audioElement.src = '';
                    }
                    this.isPlaying = false;
                    this.stopWaveformAnimation();
                    this.updatePlayButton();
                    
                    // Adjust current track index if needed
                    if (this.currentTrackIndex >= this.currentPlaylist.length - 1) {
                        this.currentTrackIndex = Math.max(0, this.currentPlaylist.length - 2);
                    }
                } else if (index < this.currentTrackIndex) {
                    // Adjust current track index if we removed a track before the current one
                    this.currentTrackIndex--;
                }
                
                // Revoke object URL to free memory
                URL.revokeObjectURL(track.url);
                this.currentPlaylist.splice(index, 1);
                this.savePlaylist();
                this.updatePlaylistDisplay();
                
                console.log('✅ Track removed:', track.name);
                
                if (window.terminal) {
                    window.terminal.log(`🗑️ Removed: ${track.name}`, 'info');
                }
            } else {
                console.warn('Track not found for removal:', trackId);
            }
        }

        // Create and show the Custom Music player panel
        createPanel() {
            console.log('🎵 Creating Custom Music Player panel...');

            // Remove existing panel if any
            const existingPanel = document.querySelector('.custom-music-player-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            // Create panel
            const panel = document.createElement('div');
            panel.className = 'custom-music-player-panel';
            panel.innerHTML = this.getPlayerHTML();

            // Add to right panel (omega-stats) like other players
            const statsPanel = document.querySelector('.omega-stats');
            if (statsPanel) {
                // In dashboard mode, add to stats panel
                statsPanel.appendChild(panel);
            } else {
                // In regular mode, add to body
                document.body.appendChild(panel);
            }

            // Setup audio element
            this.setupAudioElement();

            // Setup event listeners for the new panel
            this.setupPanelEventListeners();

            console.log('✅ Custom Music player panel created');
        }

        // Get player HTML
        getPlayerHTML() {
            return `
                <div class="custom-music-player-container">
                    <div class="custom-music-player-header">
                        <div class="custom-music-player-title">
                            <span class="custom-music-icon">🎵</span>
                            <span>Custom Music</span>
                        </div>
                        <button class="custom-music-close-btn" onclick="window.OmegaCustomMusicPlayer.closePanel()" title="Close Player">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="custom-music-player-content">
                        <!-- Upload Section -->
                        <div class="custom-music-upload-section">
                            <div class="custom-music-upload-area">
                                <input type="file" class="custom-music-file-input" multiple accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma">
                                <div class="upload-icon">📁</div>
                                <div class="upload-text">Drop files here or click to upload</div>
                                <div class="upload-formats">MP3, WAV, OGG, M4A, AAC, FLAC, WMA</div>
                            </div>
                        </div>

                        <!-- Playlist Section -->
                        <div class="custom-music-playlist-section">
                            <div class="playlist-header">
                                <span class="playlist-title">${this.playlistName}</span>
                                <span class="playlist-count">${this.currentPlaylist.length} tracks</span>
                            </div>
                            
                            <div class="playlist-tracks">
                                ${this.getPlaylistTracksHTML()}
                            </div>
                        </div>

                        <!-- Player Controls -->
                        <div class="custom-music-player-controls">
                            <div class="track-info">
                                <div class="track-name">${this.getCurrentTrackName()}</div>
                                <div class="track-artist">Custom Playlist</div>
                            </div>
                            
                            <div class="player-buttons">
                                <button class="prev-track-btn" onclick="window.OmegaCustomMusicPlayer.previousTrack()" title="Previous Track">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/>
                                    </svg>
                                </button>
                                <button class="play-pause-btn" onclick="window.OmegaCustomMusicPlayer.togglePlayPause()">
                                    <svg class="play-icon" viewBox="0 0 24 24">
                                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                                    </svg>
                                    <svg class="pause-icon" viewBox="0 0 24 24" style="display: none;">
                                        <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
                                    </svg>
                                </button>
                                <button class="next-track-btn" onclick="window.OmegaCustomMusicPlayer.nextTrack()" title="Next Track">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6,18V6H8V18H6M15,6V18L6,12L15,6Z"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="waveform-container">
                                <div class="waveform">
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                    <div class="waveform-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Get playlist tracks HTML
        getPlaylistTracksHTML() {
            if (this.currentPlaylist.length === 0) {
                return '<div class="empty-playlist">No tracks uploaded yet</div>';
            }

            return this.currentPlaylist.map((track, index) => `
                <div class="playlist-track ${index === this.currentTrackIndex ? 'active' : ''}" 
                     onclick="window.OmegaCustomMusicPlayer.playTrack(${index})">
                    <div class="track-number">${index + 1}</div>
                    <div class="track-details">
                        <div class="track-name">${track.name}</div>
                        <div class="track-duration">${this.formatDuration(track.duration)}</div>
                    </div>
                    <button class="remove-track-btn" onclick="event.stopPropagation(); window.OmegaCustomMusicPlayer.removeTrack(${track.id})" title="Remove Track">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        // Get current track name
        getCurrentTrackName() {
            if (this.currentPlaylist.length === 0) return 'No tracks';
            const track = this.currentPlaylist[this.currentTrackIndex];
            return track ? track.name : 'Unknown';
        }

        // Format duration
        formatDuration(seconds) {
            if (!seconds) return '--:--';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Setup audio element
        setupAudioElement() {
            if (!this.audioElement) {
                this.audioElement = new Audio();
                
                // Add event listeners
                this.audioElement.addEventListener('loadedmetadata', () => {
                    const track = this.currentPlaylist[this.currentTrackIndex];
                    if (track) {
                        track.duration = this.audioElement.duration;
                        this.savePlaylist();
                        this.updatePlaylistDisplay();
                    }
                });
                
                this.audioElement.addEventListener('ended', () => {
                    this.nextTrack();
                });
                
                this.audioElement.addEventListener('error', (e) => {
                    console.error('Audio error:', e);
                    if (window.terminal) {
                        window.terminal.log('❌ Audio playback error', 'error');
                    }
                });
                
                this.audioElement.addEventListener('canplay', () => {
                    console.log('✅ Audio can play');
                });
                
                this.audioElement.addEventListener('loadstart', () => {
                    console.log('🎵 Loading audio...');
                });
            }
        }

        // Play specific track
        playTrack(index) {
            if (index >= 0 && index < this.currentPlaylist.length) {
                this.currentTrackIndex = index;
                const track = this.currentPlaylist[index];
                
                console.log('🎵 Playing track:', track.name);
                
                if (this.audioElement) {
                    this.audioElement.src = track.url;
                    this.audioElement.load();
                    
                    // Try to play the audio
                    const playPromise = this.audioElement.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updatePlaylistDisplay();
            this.updateNavigationButtons();
            this.startWaveformAnimation();
                            console.log('✅ Track started playing');
                            
                            if (window.terminal) {
                                window.terminal.log(`🎵 Now playing: ${track.name}`, 'success');
                            }
                        }).catch(error => {
                            console.error('Playback failed:', error);
                            this.isPlaying = false;
                            this.updatePlayButton();
                            
                            if (window.terminal) {
                                window.terminal.log(`❌ Failed to play: ${track.name}`, 'error');
                            }
                        });
                    }
                }
            } else {
                console.warn('Invalid track index:', index);
            }
        }

        // Toggle play/pause
        togglePlayPause() {
            if (this.currentPlaylist.length === 0) {
                if (window.terminal) {
                    window.terminal.log('❌ No tracks in playlist', 'error');
                }
                return;
            }

            console.log('🎵 Toggle play/pause, current state:', this.isPlaying);

            if (!this.audioElement.src && this.currentPlaylist.length > 0) {
                console.log('🎵 No track loaded, starting first track');
                this.playTrack(0);
                return;
            }

            if (this.isPlaying) {
                this.audioElement.pause();
                this.isPlaying = false;
                this.stopWaveformAnimation();
                this.updateNavigationButtons();
                console.log('⏸️ Paused');
                
                if (window.terminal) {
                    window.terminal.log('⏸️ Music paused', 'info');
                }
            } else {
                const playPromise = this.audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.isPlaying = true;
                        this.startWaveformAnimation();
                        this.updateNavigationButtons();
                        console.log('▶️ Resumed');
                        
                        if (window.terminal) {
                            window.terminal.log('▶️ Music resumed', 'success');
                        }
                    }).catch(error => {
                        console.error('Resume failed:', error);
                        if (window.terminal) {
                            window.terminal.log('❌ Failed to resume playback', 'error');
                        }
                    });
                }
            }
            
            this.updatePlayButton();
        }

        // Next track
        nextTrack() {
            if (this.currentPlaylist.length > 0) {
                // Check if we're at the last track
                if (this.currentTrackIndex >= this.currentPlaylist.length - 1) {
                    // Stop playback at the end of playlist
                    console.log('🎵 End of playlist reached, stopping playback');
                    this.isPlaying = false;
                    this.stopWaveformAnimation();
                    this.updatePlayButton();
                    this.updateNavigationButtons();
                    
                    if (window.terminal) {
                        window.terminal.log('🎵 Playlist finished', 'info');
                    }
                    return;
                }
                
                // Move to next track
                this.currentTrackIndex++;
                this.playTrack(this.currentTrackIndex);
            }
        }

        // Previous track
        previousTrack() {
            if (this.currentPlaylist.length > 0) {
                this.currentTrackIndex = this.currentTrackIndex === 0 
                    ? this.currentPlaylist.length - 1 
                    : this.currentTrackIndex - 1;
                this.playTrack(this.currentTrackIndex);
            }
        }

        // Update navigation button states
        updateNavigationButtons() {
            const panel = document.querySelector('.custom-music-player-panel');
            if (!panel) return;

            const prevBtn = panel.querySelector('.prev-track-btn');
            const nextBtn = panel.querySelector('.next-track-btn');

            if (prevBtn) {
                prevBtn.disabled = this.currentTrackIndex === 0;
            }
            if (nextBtn) {
                nextBtn.disabled = this.currentTrackIndex >= this.currentPlaylist.length - 1;
            }
        }

        // Update play button
        updatePlayButton() {
            const panel = document.querySelector('.custom-music-player-panel');
            if (!panel) return;
            
            const playIcon = panel.querySelector('.play-icon');
            const pauseIcon = panel.querySelector('.pause-icon');
            
            if (playIcon && pauseIcon) {
                if (this.isPlaying) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            } else {
                console.warn('Play button icons not found');
            }
        }

        // Update playlist display
        updatePlaylistDisplay() {
            const panel = document.querySelector('.custom-music-player-panel');
            if (panel) {
                const playlistTracks = panel.querySelector('.playlist-tracks');
                const playlistCount = panel.querySelector('.playlist-count');
                
                if (playlistTracks) {
                    playlistTracks.innerHTML = this.getPlaylistTracksHTML();
                }
                if (playlistCount) {
                    playlistCount.textContent = `${this.currentPlaylist.length} tracks`;
                }
            }
        }

        // Start waveform animation
        startWaveformAnimation() {
            const waveformBars = document.querySelectorAll('.custom-music-player-panel .waveform-bar');
            waveformBars.forEach((bar, index) => {
                bar.style.animation = `waveformPulse ${0.5 + index * 0.1}s ease-in-out infinite`;
            });
        }

        // Stop waveform animation
        stopWaveformAnimation() {
            const waveformBars = document.querySelectorAll('.custom-music-player-panel .waveform-bar');
            waveformBars.forEach(bar => {
                bar.style.animation = 'none';
            });
        }

        // Setup event listeners for the panel
        setupPanelEventListeners() {
            const panel = document.querySelector('.custom-music-player-panel');
            if (!panel) return;

            // File input change handler
            const fileInput = panel.querySelector('.custom-music-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    console.log('🎵 File input changed:', e.target.files.length, 'files');
                    this.handleFileUpload(e.target.files);
                });
            }

            // Upload area click handler
            const uploadArea = panel.querySelector('.custom-music-upload-area');
            if (uploadArea) {
                uploadArea.addEventListener('click', () => {
                    if (fileInput) {
                        fileInput.click();
                    }
                });

                // Drag and drop handlers
                uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadArea.classList.add('drag-over');
                });

                uploadArea.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    uploadArea.classList.remove('drag-over');
                });

                uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadArea.classList.remove('drag-over');
                    console.log('🎵 Files dropped:', e.dataTransfer.files.length, 'files');
                    this.handleFileUpload(e.dataTransfer.files);
                });
            }

            // Play button handler
            const playButton = panel.querySelector('.play-pause-btn');
            if (playButton) {
                playButton.addEventListener('click', () => {
                    this.togglePlayPause();
                });
            }
        }

        // Close panel
        closePanel() {
            const panel = document.querySelector('.custom-music-player-panel');
            if (panel) {
                panel.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (panel.parentNode) {
                        panel.parentNode.removeChild(panel);
                    }
                }, 300);
            }

            // Stop audio
            if (this.audioElement) {
                this.audioElement.pause();
                this.isPlaying = false;
            }

            console.log('✅ Custom Music player panel closed');
        }
    }

    // Initialize the Custom Music player
    window.OmegaCustomMusicPlayer = new OmegaCustomMusicPlayer();

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.OmegaCustomMusicPlayer.init();
        });
    } else {
        window.OmegaCustomMusicPlayer.init();
    }

    console.log('✅ Omega Custom Music Player loaded');

})();
