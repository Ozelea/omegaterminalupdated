/**
 * Omega Blues Player
 * Custom music player for Blues audio extracted from YouTube
 * Integrates with the existing YouTube/Spotify player system
 */

(function() {
    'use strict';

    console.log('🎵 Loading Omega Blues Player...');

    // Blues Configuration
    const BLUES_CONFIG = {
        VIDEO_ID: '4DxKNOUzvJU',
        VIDEO_URL: 'https://www.youtube.com/watch?v=4DxKNOUzvJU',
        AUDIO_SOURCE: null, // Will be set dynamically
        PLAYER_ID: 'omega-blues-player',
        PLAYER_TITLE: 'Omega Blues',
        ARTIST: 'Dark Blues Playlist',
        TRACK_TITLE: 'Dark Blues Playlist'
    };

    class OmegaBluesPlayer {
        constructor() {
            this.audio = null;
            this.isPlaying = false;
            this.isPanelOpen = false;
            this.currentTime = 0;
            this.duration = 0;
            this.volume = 0.7;
            this.isMuted = false;
            this.isLoading = false;
        }

        // Initialize the Blues player
        async init() {
            console.log('🎵 Initializing Blues Player...');
            return new Promise((resolve) => {
                // Try to extract audio from YouTube video
                this.extractAudioFromYouTube().then(() => {
                    console.log('✅ Blues audio ready');
                    resolve(true);
                }).catch((error) => {
                    console.warn('⚠️ Audio extraction failed, using fallback:', error);
                    this.setupFallbackAudio();
                    resolve(true);
                });
            });
        }

        // Extract audio from YouTube video
        async extractAudioFromYouTube() {
            try {
                console.log('🎵 Attempting to extract audio from YouTube video...');
                
                // Method 1: Try using YouTube's embed API with audio focus
                const iframe = document.createElement('iframe');
                iframe.id = 'blues-audio-iframe';
                iframe.src = `https://www.youtube.com/embed/${BLUES_CONFIG.VIDEO_ID}?autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&fs=0&cc_load_policy=0&playsinline=1`;
                iframe.style.cssText = 'position:absolute;width:0;height:0;border:none;opacity:0;pointer-events:none;';
                iframe.allow = 'autoplay; encrypted-media';
                iframe.setAttribute('allowfullscreen', '');
                
                document.body.appendChild(iframe);
                
                // Create a dummy audio element for UI control
                this.audio = new Audio();
                this.duration = 180; // Assume 3 minutes for UI purposes
                
                // Set up audio event listeners for UI
                this.setupAudioEventListeners();
                
                // Wait for iframe to load
                return new Promise((resolve, reject) => {
                    iframe.addEventListener('load', () => {
                        console.log('✅ YouTube iframe loaded successfully');
                        resolve();
                    });
                    
                    iframe.addEventListener('error', (e) => {
                        console.warn('❌ YouTube iframe failed to load:', e);
                        reject(e);
                    });
                    
                    // Timeout after 10 seconds
                    setTimeout(() => {
                        console.log('⚠️ YouTube iframe load timeout, proceeding anyway');
                        resolve();
                    }, 10000);
                });
                
            } catch (error) {
                console.error('❌ Audio extraction error:', error);
                throw error;
            }
        }

        // Setup fallback audio (using YouTube embed with audio focus)
        setupFallbackAudio() {
            console.log('🎵 Setting up fallback audio system...');
            
            // Create a hidden iframe for YouTube audio
            const iframe = document.createElement('iframe');
            iframe.id = 'blues-audio-iframe';
            iframe.src = `https://www.youtube.com/embed/${BLUES_CONFIG.VIDEO_ID}?autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`;
            iframe.style.cssText = 'position:absolute;width:0;height:0;border:none;opacity:0;pointer-events:none;';
            iframe.allow = 'autoplay';
            
            document.body.appendChild(iframe);
            
            // Create a dummy audio element for UI control
            this.audio = new Audio();
            this.duration = 180; // Assume 3 minutes for UI purposes
            
            console.log('✅ Fallback audio system ready');
        }

        // Setup audio event listeners
        setupAudioEventListeners() {
            if (!this.audio) return;

            this.audio.addEventListener('timeupdate', () => {
                this.currentTime = this.audio.currentTime;
                // Progress bar removed - no UI to update
            });

            this.audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayButton();
                this.currentTime = 0;
            });

            this.audio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayButton();
            });

            this.audio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayButton();
            });

            this.audio.addEventListener('volumechange', () => {
                this.volume = this.audio.volume;
                this.isMuted = this.audio.muted;
                // Volume controls removed - no UI to update
            });
        }

        // Create and show the Blues player panel
        async createPanel() {
            // Remove existing panel if any
            const existingPanel = document.querySelector('.blues-player-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            // Create the player panel
            const panel = document.createElement('div');
            panel.className = 'blues-player-panel';
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

            // Initialize player controls
            this.initializeControls();

            this.isPanelOpen = true;
            console.log('✅ Blues player panel created');

            // Auto-play when panel opens
            setTimeout(() => {
                console.log('🎵 Auto-starting Omega Blues...');
                
                // Show loading indicator
                if (window.terminal) {
                    window.terminal.log('🎵 Starting Omega Blues...', 'info');
                }
                
                // Ensure iframe is ready before playing
                const iframe = document.getElementById('blues-audio-iframe');
                if (iframe) {
                    console.log('✅ Iframe found, starting playback...');
                    this.play();
                    
                    // Provide user feedback
                    if (window.terminal) {
                        window.terminal.log('🎵 Omega Blues auto-started', 'success');
                    }
                } else {
                    console.warn('⚠️ Iframe not found, retrying in 1 second...');
                    // Retry after iframe is created
                    setTimeout(() => {
                        this.play();
                        if (window.terminal) {
                            window.terminal.log('🎵 Omega Blues started (delayed)', 'success');
                        }
                    }, 1000);
                }
            }, 500);
        }

        // Get player HTML
        getPlayerHTML() {
            return `
                <div class="blues-player-container">
                    <div class="blues-player-header">
                        <div class="blues-player-title">
                            <span class="blues-icon">🎵</span>
                            <span>Omega Blues</span>
                        </div>
                        <button class="blues-close-btn" onclick="window.OmegaBluesPlayer.closePanel()" title="Close Player">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="blues-player-content">
                        <div class="blues-track-info">
                            <div class="blues-track-title">Dark Blues Playlist</div>
                            <div class="blues-track-artist">Dark Blues Playlist</div>
                        </div>
                        
                        <div class="blues-waveform-container">
                            <div class="blues-waveform" id="blues-waveform">
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                                <div class="wave-bar"></div>
                            </div>
                        </div>
                        
                        <div class="blues-player-controls">
                            <div class="blues-control-buttons">
                                <button class="blues-btn blues-play-pause" id="blues-play-pause-btn" title="Play/Pause">
                                    <svg class="play-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                                    </svg>
                                    <svg class="pause-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                        <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }


        // Initialize player controls
        initializeControls() {
            // Play/Pause button
            const playPauseBtn = document.getElementById('blues-play-pause-btn');
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', () => {
                    this.togglePlayPause();
                });
            }

            // Initialize waveform animation
            this.initializeWaveform();
        }

        // Initialize waveform animation
        initializeWaveform() {
            const waveform = document.getElementById('blues-waveform');
            if (!waveform) return;

            const waveBars = waveform.querySelectorAll('.wave-bar');
            
            // Set random heights for each bar to create a blues-like pattern
            waveBars.forEach((bar, index) => {
                const height = Math.random() * 60 + 20; // Random height between 20-80px
                bar.style.height = `${height}px`;
                
                // Add slight delay to each bar for wave effect
                bar.style.animationDelay = `${index * 0.1}s`;
            });
        }

        // Player control methods
        play() {
            console.log('🎵 Playing Blues music...');
            this.playViaIframe();
            this.isPlaying = true;
            this.updatePlayButton();
            this.startWaveformAnimation();
            
            // Provide user feedback
            if (window.terminal) {
                window.terminal.log('▶️ Omega Blues playing', 'success');
            }
        }

        pause() {
            console.log('⏸️ Pausing Blues music...');
            this.pauseViaIframe();
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopWaveformAnimation();
            
            // Provide user feedback
            if (window.terminal) {
                window.terminal.log('⏸️ Omega Blues paused', 'info');
            }
        }

        playViaIframe() {
            const iframe = document.getElementById('blues-audio-iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    // Only send play command, don't seek to beginning
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    console.log('🎵 Sent play command to iframe');
                } catch (e) {
                    console.warn('Iframe play command failed:', e);
                }
            } else {
                console.warn('⚠️ Iframe not ready for playback, retrying...');
                // Retry after a short delay
                setTimeout(() => {
                    this.playViaIframe();
                }, 500);
            }
        }

        pauseViaIframe() {
            const iframe = document.getElementById('blues-audio-iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    console.log('⏸️ Sent pause command to iframe');
                } catch (e) {
                    console.warn('Iframe pause command failed:', e);
                }
            }
        }

        togglePlayPause() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }

        // Waveform animation methods
        startWaveformAnimation() {
            const waveform = document.getElementById('blues-waveform');
            if (!waveform) return;

            waveform.classList.add('waveform-playing');
            console.log('🎵 Waveform animation started');
        }

        stopWaveformAnimation() {
            const waveform = document.getElementById('blues-waveform');
            if (!waveform) return;

            waveform.classList.remove('waveform-playing');
            console.log('🎵 Waveform animation stopped');
        }

        // Volume methods removed - no volume controls in simplified player

        seekTo(time) {
            this.currentTime = time;
            if (this.audio) {
                this.audio.currentTime = time;
            }
            // Progress bar removed - no UI to update
        }

        // UI update methods
        updatePlayButton() {
            const playIcon = document.querySelector('.blues-play-pause .play-icon');
            const pauseIcon = document.querySelector('.blues-play-pause .pause-icon');
            
            if (this.isPlaying) {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            } else {
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            }
        }

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Control methods - removed unused methods
        // Only keeping essential methods for Play/Pause functionality

        // Close panel
        closePanel() {
            const panel = document.querySelector('.blues-player-panel');
            if (panel) {
                panel.remove();
            }
            
            if (this.audio) {
                this.audio.pause();
            }
            
            this.isPanelOpen = false;
            console.log('✅ Blues player panel closed');
        }

        // Check if panel is open
        isOpen() {
            return this.isPanelOpen;
        }
    }

    // Initialize the Blues player
    window.OmegaBluesPlayer = new OmegaBluesPlayer();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.OmegaBluesPlayer.init();
        });
    } else {
        window.OmegaBluesPlayer.init();
    }

    console.log('✅ Omega Blues Player loaded');

})();
