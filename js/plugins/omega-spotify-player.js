/**
 * Omega Spotify Player
 * Integrated Spotify music player for the Omega Terminal
 * Allows users to authenticate and play music while using the terminal
 */

(function() {
    'use strict';

    // Spotify Configuration
    const SPOTIFY_CONFIG = {
        CLIENT_ID: 'dc96d602cecc4ff0a28e122dc71fa8af',
        // Dynamically set redirect URI based on current domain
        REDIRECT_URI: window.location.origin + '/pages/spotify-callback.html',
        SCOPES: [
            'streaming',
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-library-read',
            'playlist-read-private',
            'user-top-read'
        ].join(' '),
        // Token endpoint for PKCE flow
        TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token'
    };
    
    // Log the redirect URI being used for debugging
    console.log('🎵 Spotify Redirect URI:', SPOTIFY_CONFIG.REDIRECT_URI);
    
    // PKCE Helper Functions
    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], '');
    }
    
    async function sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }
    
    function base64encode(input) {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
    
    async function generateCodeChallenge(codeVerifier) {
        const hashed = await sha256(codeVerifier);
        return base64encode(hashed);
    }
    
    // Validate setup
    const isSpotifyConfigured = () => {
        return SPOTIFY_CONFIG.CLIENT_ID && SPOTIFY_CONFIG.CLIENT_ID !== 'YOUR_SPOTIFY_CLIENT_ID';
    };

    class OmegaSpotifyPlayer {
        constructor() {
            this.accessToken = localStorage.getItem('spotify_access_token');
            this.refreshToken = localStorage.getItem('spotify_refresh_token');
            this.tokenExpiry = localStorage.getItem('spotify_token_expiry');
            this.player = null;
            this.deviceId = null;
            this.currentTrack = null;
            this.isPlaying = false;
            this.isPanelOpen = false;
        }

        // Initialize Spotify Web Playback SDK
        async init() {
            if (!this.accessToken || this.isTokenExpired()) {
                console.log('🎵 Spotify: No valid token found');
                return false;
            }

            return new Promise((resolve) => {
                // Load Spotify Web Playback SDK
                if (!window.Spotify) {
                    const script = document.createElement('script');
                    script.src = 'https://sdk.scdn.co/spotify-player.js';
                    script.async = true;
                    document.body.appendChild(script);

                    window.onSpotifyWebPlaybackSDKReady = () => {
                        this.setupPlayer();
                        resolve(true);
                    };
                } else {
                    this.setupPlayer();
                    resolve(true);
                }
            });
        }

        // Setup Spotify Player
        setupPlayer() {
            this.player = new Spotify.Player({
                name: 'Omega Terminal Player',
                getOAuthToken: cb => { cb(this.accessToken); },
                volume: 0.5
            });

            // Error handling
            this.player.addListener('initialization_error', ({ message }) => {
                console.error('Spotify initialization error:', message);
            });
            this.player.addListener('authentication_error', ({ message }) => {
                console.error('Spotify auth error:', message);
                this.logout();
            });
            this.player.addListener('account_error', ({ message }) => {
                console.error('Spotify account error:', message);
            });
            this.player.addListener('playback_error', ({ message }) => {
                console.error('Spotify playback error:', message);
            });

            // Playback status updates
            this.player.addListener('player_state_changed', state => {
                console.log('🎵 Player state changed:', state);
                if (!state) return;
                
                this.currentTrack = state.track_window.current_track;
                this.isPlaying = !state.paused;
                
                console.log('🎵 Now playing:', this.currentTrack?.name, '| Playing:', this.isPlaying);
                
                // Update UI immediately
                this.updateUI();
                
                // Also update play button directly if panel is open
                this.updatePlayButton();
            });

            // Ready
            this.player.addListener('ready', ({ device_id }) => {
                console.log('🎵 Spotify player ready with device ID:', device_id);
                this.deviceId = device_id;
                this.transferPlayback();
            });

            // Not Ready
            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('🎵 Spotify device has gone offline:', device_id);
            });

            // Connect to the player
            this.player.connect();
        }

        // Check if token is expired
        isTokenExpired() {
            if (!this.tokenExpiry) return true;
            return Date.now() >= parseInt(this.tokenExpiry);
        }

        // Authenticate with Spotify (PKCE Flow)
        async authenticate() {
            // Check if Spotify is configured
            if (!isSpotifyConfigured()) {
                if (window.terminal) {
                    window.terminal.log('❌ Spotify is not configured', 'error');
                    window.terminal.log('', 'output');
                    window.terminal.log('📝 Setup Instructions:', 'info');
                    window.terminal.log('1. Go to https://developer.spotify.com/dashboard', 'output');
                    window.terminal.log('2. Create a new app', 'output');
                    window.terminal.log('3. Add redirect URI: ' + SPOTIFY_CONFIG.REDIRECT_URI, 'output');
                    window.terminal.log('4. Copy your Client ID', 'output');
                    window.terminal.log('5. Open js/plugins/omega-spotify-player.js', 'output');
                    window.terminal.log('6. Replace YOUR_SPOTIFY_CLIENT_ID with your actual Client ID', 'output');
                }
                
                // Show setup instructions in panel
                this.showSetupInstructions();
                return;
            }
            
            // Generate PKCE code verifier and challenge
            const codeVerifier = generateRandomString(64);
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            
            // Store code verifier for later use
            localStorage.setItem('spotify_code_verifier', codeVerifier);
            
            // Build authorization URL with PKCE
            const authUrl = `https://accounts.spotify.com/authorize?` +
                `client_id=${SPOTIFY_CONFIG.CLIENT_ID}` +
                `&response_type=code` +
                `&redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.REDIRECT_URI)}` +
                `&scope=${encodeURIComponent(SPOTIFY_CONFIG.SCOPES)}` +
                `&code_challenge_method=S256` +
                `&code_challenge=${codeChallenge}` +
                `&show_dialog=true`;

            console.log('🎵 Using PKCE flow for authentication');

            // Open popup for auth
            const width = 500;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            
            const popup = window.open(
                authUrl,
                'Spotify Login',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for auth callback
            const messageHandler = (event) => {
                // Filter out non-Spotify messages (like MetaMask)
                if (!event.data || !event.data.type) {
                    return;
                }
                
                // Ignore MetaMask and other extension messages
                if (event.data.target === 'metamask-inpage' || 
                    event.data.target === 'metamask-contentscript' ||
                    event.data.type.includes('metamask')) {
                    return;
                }
                
                // Only log Spotify messages
                if (event.data.type === 'spotify-auth-success') {
                    console.log('🎵 Spotify auth message received:', event.data);
                    
                    // Security check - verify origin (allow same origin)
                    if (event.origin !== window.location.origin) {
                        console.warn('⚠️ Message from different origin:', event.origin);
                        console.log('Expected origin:', window.location.origin);
                        // Still process if it's a Spotify message
                    }
                    
                    console.log('✅ Processing Spotify authentication...');
                    this.handleAuthSuccess(event.data);
                    
                    // Close popup
                    if (popup && !popup.closed) {
                        popup.close();
                    }
                    
                    // Remove listener after successful auth
                    window.removeEventListener('message', messageHandler);
                }
            };
            
            window.addEventListener('message', messageHandler);
            
            // Also check if popup was blocked
            if (!popup || popup.closed) {
                console.error('❌ Popup was blocked or closed immediately');
                if (window.terminal) {
                    window.terminal.log('❌ Popup blocked! Please allow popups for this site.', 'error');
                }
            }
        }

        // Handle successful authentication
        handleAuthSuccess(data) {
            console.log('🎵 handleAuthSuccess called with:', data);
            
            if (!data.access_token) {
                console.error('❌ No access token in data:', data);
                if (window.terminal) {
                    window.terminal.log('❌ Authentication failed: No access token received', 'error');
                }
                return;
            }
            
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            
            localStorage.setItem('spotify_access_token', this.accessToken);
            localStorage.setItem('spotify_token_expiry', this.tokenExpiry);
            
            console.log('✅ Spotify authenticated successfully');
            console.log('Token expires at:', new Date(this.tokenExpiry).toLocaleString());
            
            if (window.terminal) {
                window.terminal.log('✅ Spotify connected successfully!', 'success');
                window.terminal.log('🎵 You can now use: spotify [command]', 'info');
            }
            
            this.init();
            this.updateUI();
            
            // If panel was waiting, open it now
            if (this.isPanelOpen) {
                this.createPanel();
            }
        }

        // Logout
        logout() {
            this.accessToken = null;
            this.tokenExpiry = null;
            localStorage.removeItem('spotify_access_token');
            localStorage.removeItem('spotify_token_expiry');
            
            if (this.player) {
                this.player.disconnect();
                this.player = null;
            }
            
            this.updateUI();
        }

        // Transfer playback to this device
        async transferPlayback() {
            if (!this.deviceId) return;

            try {
                await fetch('https://api.spotify.com/v1/me/player', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        device_ids: [this.deviceId],
                        play: false
                    })
                });
            } catch (error) {
                console.error('Error transferring playback:', error);
            }
        }

        // Play/Pause toggle
        async togglePlay() {
            if (!this.player) {
                console.warn('⚠️ Player not initialized');
                return;
            }
            
            console.log('🎵 Toggle play - Current state:', this.isPlaying);
            await this.player.togglePlay();
            
            // Toggle state optimistically (will be confirmed by state_changed event)
            this.isPlaying = !this.isPlaying;
            this.updatePlayButton();
        }

        // Next track
        async nextTrack() {
            if (!this.player) {
                console.warn('⚠️ Player not initialized');
                return;
            }
            
            console.log('⏭️ Next track');
            await this.player.nextTrack();
        }

        // Previous track
        async previousTrack() {
            if (!this.player) {
                console.warn('⚠️ Player not initialized');
                return;
            }
            
            console.log('⏮️ Previous track');
            await this.player.previousTrack();
        }

        // Set volume (0-1)
        async setVolume(volume) {
            if (!this.player) return;
            
            this.player.setVolume(volume);
        }

        // Search for tracks
        async search(query) {
            if (!this.accessToken) return null;

            try {
                const response = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                    }
                );

                const data = await response.json();
                return data.tracks.items;
            } catch (error) {
                console.error('Error searching Spotify:', error);
                return null;
            }
        }

        // Play a track by URI
        async playTrack(uri) {
            if (!this.deviceId) return;

            try {
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        uris: [uri]
                    })
                });
            } catch (error) {
                console.error('Error playing track:', error);
            }
        }

        // Get user's playlists
        async getUserPlaylists() {
            if (!this.accessToken) return null;

            try {
                const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                });

                const data = await response.json();
                return data.items;
            } catch (error) {
                console.error('Error fetching playlists:', error);
                return null;
            }
        }

        // Open Spotify Panel
        async openPanel() {
            if (this.isPanelOpen) {
                this.closePanel();
                return;
            }

            // Check if Spotify is configured
            if (!isSpotifyConfigured()) {
                if (window.terminal) {
                    window.terminal.log('❌ Spotify is not configured yet', 'error');
                    window.terminal.log('Run "spotify help" for setup instructions', 'info');
                }
                this.showSetupInstructions();
                return;
            }

            // Check authentication
            if (!this.accessToken || this.isTokenExpired()) {
                if (window.terminal) {
                    window.terminal.log('🎵 Please connect to Spotify first', 'info');
                }
                this.authenticate();
                return;
            }

            // Initialize player if not already
            if (!this.player) {
                await this.init();
            }

            this.isPanelOpen = true;
            this.createPanel();
        }
        
        // Show setup instructions panel
        showSetupInstructions() {
            const panel = document.createElement('div');
            panel.id = 'spotify-player-panel';
            panel.className = 'spotify-player-panel';
            panel.innerHTML = `
                <div class="spotify-panel-header">
                    <div class="spotify-header-title">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        <span>SPOTIFY SETUP REQUIRED</span>
                    </div>
                    <button class="spotify-close-btn" onclick="window.OmegaSpotify.closePanel()">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="spotify-panel-content">
                    <div class="spotify-login-screen">
                        <div class="spotify-logo-large">
                            <svg viewBox="0 0 24 24" width="80" height="80" fill="#ff6b6b">
                                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12A10 10 0 0 0 12 22a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8z"/>
                            </svg>
                        </div>
                        <h2>Setup Required</h2>
                        <p>To use Spotify in Omega Terminal, you need to configure your Spotify App credentials.</p>
                        
                        <div class="spotify-setup-note" style="text-align: left; margin-top: 20px;">
                            <strong>📝 Quick Setup Guide:</strong><br><br>
                            
                            <strong>1. Create Spotify App</strong><br>
                            • Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style="color: var(--cyber-blue);">developer.spotify.com/dashboard</a><br>
                            • Click "Create App"<br>
                            • Name: "Omega Terminal"<br>
                            • Redirect URI: <code>${SPOTIFY_CONFIG.REDIRECT_URI}</code><br><br>
                            
                            <strong>2. Get Client ID</strong><br>
                            • Copy your Client ID from the app dashboard<br><br>
                            
                            <strong>3. Configure Terminal</strong><br>
                            • Open: <code>js/plugins/omega-spotify-player.js</code><br>
                            • Find line 10: <code>CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID'</code><br>
                            • Replace with your actual Client ID<br>
                            • Save and reload the page<br><br>
                            
                            <strong>4. Connect</strong><br>
                            • Run: <code>spotify connect</code><br>
                            • Enjoy your music! 🎵
                        </div>
                        
                        <button class="spotify-connect-btn" onclick="window.open('https://developer.spotify.com/dashboard', '_blank')" style="margin-top: 20px;">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                            </svg>
                            Open Spotify Dashboard
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            this.isPanelOpen = true;
        }

        // Close Spotify Panel
        closePanel() {
            const panel = document.getElementById('spotify-player-panel');
            if (panel) {
                panel.remove();
            }
            this.isPanelOpen = false;
        }

        // Create the Spotify Player Panel UI
        createPanel() {
            // Remove existing panel
            this.closePanel();

            const panel = document.createElement('div');
            panel.id = 'spotify-player-panel';
            panel.className = 'spotify-player-panel';
            panel.innerHTML = `
                <div class="spotify-panel-header">
                    <div class="spotify-header-title">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        <span>SPOTIFY PLAYER</span>
                    </div>
                    <button class="spotify-close-btn" onclick="window.OmegaSpotify.closePanel()">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                <div class="spotify-panel-content">
                    ${this.accessToken ? this.renderPlayer() : this.renderLogin()}
                </div>
            `;

            document.body.appendChild(panel);

            // Add to stats panel if in dashboard mode
            if (window.FuturisticDashboard) {
                const statsPanel = document.querySelector('.omega-stats');
                if (statsPanel) {
                    statsPanel.appendChild(panel);
                }
            }
        }

        // Render login screen
        renderLogin() {
            return `
                <div class="spotify-login-screen">
                    <div class="spotify-logo-large">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="var(--matrix-green)">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </div>
                    <h2>Connect Spotify</h2>
                    <p>Listen to your favorite music while coding in the Omega Terminal</p>
                    <button class="spotify-connect-btn" onclick="window.OmegaSpotify.authenticate()">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Connect to Spotify
                    </button>
                    <div class="spotify-setup-note">
                        <strong>Setup Required:</strong> Add your Spotify Client ID in <code>omega-spotify-player.js</code>
                    </div>
                </div>
            `;
        }

        // Render player interface
        renderPlayer() {
            const track = this.currentTrack;
            const isPlaying = this.isPlaying;
            
            return `
                <div class="spotify-player-container">
                    <!-- Now Playing -->
                    <div class="spotify-now-playing">
                        <div class="track-artwork">
                            ${track ? `<img src="${track.album.images[0]?.url}" alt="Album art">` : `
                                <div class="no-track-art">
                                    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                    </svg>
                                </div>
                            `}
                        </div>
                        <div class="track-info">
                            <div class="track-name">${track ? track.name : 'No track playing'}</div>
                            <div class="track-artist">${track ? track.artists.map(a => a.name).join(', ') : 'Search or select a track'}</div>
                        </div>
                    </div>

                    <!-- Playback Controls -->
                    <div class="spotify-controls">
                        <button class="control-btn" onclick="window.OmegaSpotify.previousTrack()" title="Previous Track">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                            </svg>
                        </button>
                        <button class="control-btn play-btn ${isPlaying ? 'playing' : ''}" id="spotify-play-btn" onclick="window.OmegaSpotify.togglePlay()" title="${isPlaying ? 'Pause' : 'Play'}">
                            ${isPlaying ? `
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            ` : `
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            `}
                        </button>
                        <button class="control-btn" onclick="window.OmegaSpotify.nextTrack()" title="Next Track">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Volume Control -->
                    <div class="spotify-volume">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                        <input type="range" min="0" max="100" value="50" class="volume-slider" 
                               oninput="window.OmegaSpotify.setVolume(this.value / 100)">
                    </div>

                    <!-- Search -->
                    <div class="spotify-search">
                        <input type="text" placeholder="Search for tracks..." id="spotify-search-input" 
                               onkeyup="if(event.key==='Enter') window.OmegaSpotify.performSearch(this.value)">
                        <button onclick="window.OmegaSpotify.performSearch(document.getElementById('spotify-search-input').value)">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Search Results / Playlists -->
                    <div class="spotify-tracks" id="spotify-tracks-list">
                        <div class="tracks-empty">🎵 Search for music or select a playlist</div>
                    </div>

                    <!-- Footer Actions -->
                    <div class="spotify-footer">
                        <button class="spotify-action-btn" onclick="window.OmegaSpotify.loadPlaylists()">
                            📋 My Playlists
                        </button>
                        <button class="spotify-action-btn" onclick="window.OmegaSpotify.logout(); window.OmegaSpotify.closePanel(); window.OmegaSpotify.openPanel();">
                            🚪 Disconnect
                        </button>
                    </div>
                </div>
            `;
        }

        // Update UI
        updateUI() {
            if (!this.isPanelOpen) return;

            const content = document.querySelector('.spotify-panel-content');
            if (content) {
                content.innerHTML = this.accessToken ? this.renderPlayer() : this.renderLogin();
            }
            
            console.log('🎵 UI updated - Playing:', this.isPlaying);
        }
        
        // Update just the play button
        updatePlayButton() {
            const playBtn = document.getElementById('spotify-play-btn');
            if (!playBtn) return;
            
            const isPlaying = this.isPlaying;
            
            playBtn.title = isPlaying ? 'Pause' : 'Play';
            playBtn.className = `control-btn play-btn ${isPlaying ? 'playing' : ''}`;
            playBtn.innerHTML = isPlaying ? `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            ` : `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            
            console.log('🎵 Play button updated - Playing:', isPlaying);
        }

        // Perform search
        async performSearch(query) {
            if (!query.trim()) return;

            const tracks = await this.search(query);
            const tracksList = document.getElementById('spotify-tracks-list');
            
            if (!tracks || tracks.length === 0) {
                tracksList.innerHTML = '<div class="tracks-empty">No tracks found</div>';
                return;
            }

            tracksList.innerHTML = tracks.map(track => `
                <div class="spotify-track-item" onclick="window.OmegaSpotify.playTrack('${track.uri}')">
                    <img src="${track.album.images[2]?.url || track.album.images[0]?.url}" alt="${track.name}">
                    <div class="track-item-info">
                        <div class="track-item-name">${track.name}</div>
                        <div class="track-item-artist">${track.artists.map(a => a.name).join(', ')}</div>
                    </div>
                    <div class="track-item-duration">${this.formatDuration(track.duration_ms)}</div>
                </div>
            `).join('');
        }

        // Load playlists
        async loadPlaylists() {
            const playlists = await this.getUserPlaylists();
            const tracksList = document.getElementById('spotify-tracks-list');
            
            if (!playlists || playlists.length === 0) {
                tracksList.innerHTML = '<div class="tracks-empty">No playlists found</div>';
                return;
            }

            tracksList.innerHTML = playlists.map(playlist => `
                <div class="spotify-playlist-item" onclick="window.OmegaSpotify.playPlaylist('${playlist.uri}')">
                    <img src="${playlist.images[0]?.url}" alt="${playlist.name}">
                    <div class="playlist-item-info">
                        <div class="playlist-item-name">${playlist.name}</div>
                        <div class="playlist-item-tracks">${playlist.tracks.total} tracks</div>
                    </div>
                </div>
            `).join('');
        }

        // Play playlist
        async playPlaylist(uri) {
            if (!this.deviceId) return;

            try {
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        context_uri: uri
                    })
                });
            } catch (error) {
                console.error('Error playing playlist:', error);
            }
        }

        // Format duration
        formatDuration(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = ((ms % 60000) / 1000).toFixed(0);
            return `${minutes}:${seconds.padStart(2, '0')}`;
        }
    }

    // Initialize and expose globally
    window.OmegaSpotify = new OmegaSpotifyPlayer();

    console.log('🎵 Omega Spotify Player loaded');
})();

