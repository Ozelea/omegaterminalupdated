/**
 * Omega YouTube Player
 * Integrated YouTube video player for the Omega Terminal
 * Allows users to search and watch YouTube videos in the sidebar
 */

(function() {
    'use strict';

    // YouTube Configuration
    const YOUTUBE_CONFIG = {
        CLIENT_ID: '119481701339-b4fm5sujtt2mjupu2rk1s2v749cess44.apps.googleusercontent.com',
        API_KEY: 'AIzaSyCpz49l79hdPYN1VmREpPjylwlHmfki3S0',
        PLAYER_ID: 'omega-youtube-player',
        SEARCH_RESULTS_LIMIT: 10,
        // Bloomberg Technology's channel
        DEFAULT_CHANNEL_ID: 'UCrM7B7SL_g1edFOnmj-SDKg', // Bloomberg Technology channel
        DEFAULT_CHANNEL_HANDLE: '@BloombergTechnology',
        DEFAULT_CHANNEL_NAME: 'Bloomberg Technology',
        // OAuth scopes for advanced features (optional)
        SCOPES: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ].join(' ')
    };
    
    console.log('🎥 YouTube API Key configured');
    console.log('🎥 YouTube Client ID:', YOUTUBE_CONFIG.CLIENT_ID.substring(0, 20) + '...');
    console.log('🎥 Default Channel:', YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME, YOUTUBE_CONFIG.DEFAULT_CHANNEL_HANDLE);

    class OmegaYouTubePlayer {
        constructor() {
            this.player = null;
            this.currentVideo = null;
            this.currentVideoId = null;
            this.isPlaying = false;
            this.isPanelOpen = false;
            this.searchResults = [];
            this.playlist = [];
            this.currentIndex = 0;
        }
        
        // Get default channel's recent videos (Bloomberg Technology)
        async getDefaultChannelVideos() {
            try {
                // Use channel ID to get latest uploads directly
                const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CONFIG.DEFAULT_CHANNEL_ID}&maxResults=15&order=date&type=video&key=${YOUTUBE_CONFIG.API_KEY}`;
                
                console.log(`🔍 Fetching ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} videos...`);
                const response = await fetch(searchUrl);
                const data = await response.json();

                if (data.error) {
                    console.error(`❌ YouTube API error for ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME}:`, data.error);
                    return [];
                }

                if (data.items && data.items.length > 0) {
                    // Videos are already filtered by channelId in the API request
                    console.log(`✅ Found ${data.items.length} videos from ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME}`);
                    return data.items;
                } else {
                    console.log(`⚠️ No videos found for ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME}`);
                    return [];
                }
            } catch (error) {
                console.error(`❌ Error fetching ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} videos:`, error);
                return [];
            }
        }

        // Initialize YouTube IFrame Player API
        async init() {
            return new Promise((resolve) => {
                // Load YouTube IFrame API if not already loaded
                if (!window.YT) {
                    const tag = document.createElement('script');
                    tag.src = 'https://www.youtube.com/iframe_api';
                    const firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                    window.onYouTubeIframeAPIReady = () => {
                        console.log('✅ YouTube IFrame API loaded');
                        resolve(true);
                    };
                } else {
                    console.log('✅ YouTube IFrame API already loaded');
                    resolve(true);
                }
            });
        }

        // Create and show the YouTube player panel
        async createPanel() {
            // Remove existing panel if any
            const existingPanel = document.querySelector('.youtube-player-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            // Create panel HTML
            const panel = document.createElement('div');
            panel.className = 'youtube-player-panel';
            panel.innerHTML = `
                <!-- Panel Header -->
                <div class="youtube-panel-header">
                    <div class="youtube-header-title">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"/>
                        </svg>
                        YouTube Player
                    </div>
                    <div class="youtube-header-buttons">
                        <button class="youtube-watch-btn" id="youtube-watch-on-yt-btn" onclick="window.OmegaYouTube.openOnYouTube()" title="Watch on YouTube" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                            </svg>
                        </button>
                        <button class="youtube-close-btn" onclick="window.OmegaYouTube.closePanel()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="youtube-search-section">
                    <div class="youtube-search-box">
                        <input 
                            type="text" 
                            id="youtube-search-input" 
                            placeholder="Search YouTube videos..."
                            onkeypress="if(event.key==='Enter'){window.OmegaYouTube.search(this.value)}"
                        />
                        <button onclick="window.OmegaYouTube.search(document.getElementById('youtube-search-input').value)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Player Section -->
                <div class="youtube-player-section">
                    <div id="${YOUTUBE_CONFIG.PLAYER_ID}" class="youtube-video-container"></div>
                    <div class="youtube-now-playing" id="youtube-now-playing">
                        <div class="youtube-no-video">Loading ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} latest video...</div>
                    </div>
                </div>

                <!-- Player Controls -->
                <div class="youtube-controls" id="youtube-controls" style="display: none;">
                    <button class="youtube-control-btn" onclick="window.OmegaYouTube.previous()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"/>
                        </svg>
                    </button>
                    <button class="youtube-control-btn youtube-play-btn" id="youtube-play-btn" onclick="window.OmegaYouTube.togglePlayPause()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                        </svg>
                    </button>
                    <button class="youtube-control-btn" onclick="window.OmegaYouTube.next()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"/>
                        </svg>
                    </button>
                    <button class="youtube-control-btn" onclick="window.OmegaYouTube.toggleMute()">
                        <svg viewBox="0 0 24 24" fill="currentColor" id="youtube-volume-icon">
                            <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                        </svg>
                    </button>
                </div>

                <!-- Search Results -->
                <div class="youtube-results" id="youtube-results"></div>
            `;

            // Add to page
            const statsPanel = document.querySelector('.omega-stats');
            if (statsPanel) {
                // In dashboard mode, add to stats panel
                statsPanel.appendChild(panel);
            } else {
                // In regular mode, add to body
                document.body.appendChild(panel);
            }

            this.isPanelOpen = true;

            // Initialize player if API is loaded
            if (window.YT && window.YT.Player) {
                this.setupPlayer();
            } else {
                await this.init();
                this.setupPlayer();
            }

            if (window.terminal) {
                window.terminal.log('🎥 YouTube Player opened', 'success');
                window.terminal.log(`📺 Loading ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} latest videos...`, 'info');
            }
            
            // Load default channel's recent videos automatically
            setTimeout(() => {
                this.loadDefaultChannelVideos();
            }, 500);
        }
        
        // Load default channel's recent videos (Bloomberg Technology)
        async loadDefaultChannelVideos() {
            console.log(`🎥 loadDefaultChannelVideos() called for ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME}`);
            const videos = await this.getDefaultChannelVideos();
            
            if (videos && videos.length > 0) {
                console.log(`✅ Got ${videos.length} ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} videos`);
                
                if (window.terminal) {
                    window.terminal.log(`✅ Loaded ${videos.length} videos from ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_HANDLE}`, 'success');
                    window.terminal.log('💡 Most recent video ready. Click play or click any thumbnail!', 'info');
                }
                
                // Store as search results and display
                this.searchResults = videos;
                this.displaySearchResults();
                
                // Auto-load first (most recent) video
                if (videos[0]) {
                    const firstVideo = videos[0];
                    this.currentVideoId = firstVideo.id.videoId;
                    
                    // Update now playing to show ready state
                    const nowPlaying = document.getElementById('youtube-now-playing');
                    if (nowPlaying) {
                        nowPlaying.innerHTML = `
                            <div class="youtube-playing-title">Latest: ${this.escapeHtml(firstVideo.snippet.title)}</div>
                            <div class="youtube-playing-channel">${YOUTUBE_CONFIG.DEFAULT_CHANNEL_HANDLE}</div>
                        `;
                    }
                    
                    // Show watch on YouTube button
                    const watchBtn = document.getElementById('youtube-watch-on-yt-btn');
                    if (watchBtn) {
                        watchBtn.style.display = 'flex';
                    }
                    
                    // Load video in player (ready to play)
                    setTimeout(() => {
                        if (this.player && this.player.cueVideoById) {
                            this.player.cueVideoById(firstVideo.id.videoId);
                            
                            // Show controls
                            const controls = document.getElementById('youtube-controls');
                            if (controls) {
                                controls.style.display = 'flex';
                            }
                        }
                    }, 800);
                }
            } else {
                console.error(`❌ Could not load ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} videos`);
                if (window.terminal) {
                    window.terminal.log(`⚠️ Could not load ${YOUTUBE_CONFIG.DEFAULT_CHANNEL_NAME} videos. Use search to find videos.`, 'warning');
                }
                
                // Show search prompt
                const nowPlaying = document.getElementById('youtube-now-playing');
                if (nowPlaying) {
                    nowPlaying.innerHTML = `<div class="youtube-no-video">Search for videos to watch</div>`;
                }
            }
        }

        // Setup YouTube player
        setupPlayer() {
            if (this.player) return; // Already set up

            this.player = new YT.Player(YOUTUBE_CONFIG.PLAYER_ID, {
                height: '200',
                width: '100%',
                playerVars: {
                    'playsinline': 1,
                    'controls': 1,
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onReady': (event) => this.onPlayerReady(event),
                    'onStateChange': (event) => this.onPlayerStateChange(event)
                }
            });
        }

        // Player ready callback
        onPlayerReady(event) {
            console.log('✅ YouTube player ready');
            this.updateUI();
        }

        // Player state change callback
        onPlayerStateChange(event) {
            // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
            if (event.data === YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                this.currentVideo = this.player.getVideoData();
                this.updatePlayButton(true);
                this.updateNowPlaying();
            } else if (event.data === YT.PlayerState.PAUSED) {
                this.isPlaying = false;
                this.updatePlayButton(false);
            } else if (event.data === YT.PlayerState.ENDED) {
                this.isPlaying = false;
                this.next(); // Auto-play next video
            }
        }

        // Search YouTube videos
        async search(query) {
            if (!query || query.trim() === '') {
                if (window.terminal) {
                    window.terminal.log('❌ Please enter a search query', 'error');
                }
                return;
            }

            if (window.terminal) {
                window.terminal.log(`🔍 Searching YouTube for: ${query}...`, 'info');
            }

            try {
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${YOUTUBE_CONFIG.SEARCH_RESULTS_LIMIT}&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_CONFIG.API_KEY}`;
                
                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.message);
                }

                this.searchResults = data.items || [];
                this.displaySearchResults();

                if (window.terminal) {
                    window.terminal.log(`✅ Found ${this.searchResults.length} videos`, 'success');
                }
            } catch (error) {
                console.error('YouTube search error:', error);
                if (window.terminal) {
                    window.terminal.log(`❌ Search failed: ${error.message}`, 'error');
                }
            }
        }

        // Display search results
        displaySearchResults() {
            const resultsContainer = document.getElementById('youtube-results');
            if (!resultsContainer) return;

            if (this.searchResults.length === 0) {
                resultsContainer.innerHTML = '<div class="youtube-no-results">No videos found</div>';
                return;
            }

            resultsContainer.innerHTML = this.searchResults.map((video, index) => `
                <div class="youtube-result-item" onclick="window.OmegaYouTube.playVideo('${video.id.videoId}', ${index})">
                    <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
                    <div class="youtube-result-info">
                        <div class="youtube-result-title">${this.escapeHtml(video.snippet.title)}</div>
                        <div class="youtube-result-channel">${this.escapeHtml(video.snippet.channelTitle)}</div>
                    </div>
                    <svg class="youtube-result-play" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                </div>
            `).join('');

            // Store as playlist
            this.playlist = this.searchResults.map(v => ({
                id: v.id.videoId,
                title: v.snippet.title,
                channel: v.snippet.channelTitle
            }));
        }

        // Play a specific video
        playVideo(videoId, index = 0) {
            if (!this.player) {
                console.error('YouTube player not initialized');
                return;
            }

            this.currentIndex = index;
            this.currentVideoId = videoId;
            this.player.loadVideoById(videoId);
            this.currentVideo = { video_id: videoId };

            // Show controls
            const controls = document.getElementById('youtube-controls');
            if (controls) {
                controls.style.display = 'flex';
            }
            
            // Show "Watch on YouTube" button
            const watchBtn = document.getElementById('youtube-watch-on-yt-btn');
            if (watchBtn) {
                watchBtn.style.display = 'flex';
            }

            if (window.terminal) {
                const videoInfo = this.playlist[index];
                if (videoInfo) {
                    window.terminal.log(`▶️ Playing: ${videoInfo.title}`, 'success');
                }
            }
        }
        
        // Open current video on YouTube.com
        openOnYouTube() {
            if (!this.currentVideoId) {
                console.log('No video currently playing');
                if (window.terminal) {
                    window.terminal.log('⚠️ No video currently playing', 'warning');
                }
                return;
            }
            
            const youtubeUrl = `https://www.youtube.com/watch?v=${this.currentVideoId}`;
            window.open(youtubeUrl, '_blank');
            
            if (window.terminal) {
                window.terminal.log('🔗 Opened video on YouTube.com', 'success');
            }
        }

        // Toggle play/pause
        togglePlayPause() {
            if (!this.player) return;

            if (this.isPlaying) {
                this.player.pauseVideo();
            } else {
                this.player.playVideo();
            }
        }

        // Play next video in playlist
        next() {
            if (this.playlist.length === 0) return;

            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
            this.playVideo(this.playlist[this.currentIndex].id, this.currentIndex);
        }

        // Play previous video in playlist
        previous() {
            if (this.playlist.length === 0) return;

            this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
            this.playVideo(this.playlist[this.currentIndex].id, this.currentIndex);
        }

        // Toggle mute
        toggleMute() {
            if (!this.player) return;

            if (this.player.isMuted()) {
                this.player.unMute();
            } else {
                this.player.mute();
            }
        }

        // Update play/pause button
        updatePlayButton(playing = this.isPlaying) {
            const playBtn = document.getElementById('youtube-play-btn');
            if (!playBtn) return;

            if (playing) {
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
                    </svg>
                `;
            } else {
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                `;
            }
        }

        // Update now playing display
        updateNowPlaying() {
            const nowPlaying = document.getElementById('youtube-now-playing');
            if (!nowPlaying || !this.currentVideo) return;

            const videoInfo = this.playlist[this.currentIndex];
            if (videoInfo) {
                nowPlaying.innerHTML = `
                    <div class="youtube-playing-title">${this.escapeHtml(videoInfo.title)}</div>
                    <div class="youtube-playing-channel">${this.escapeHtml(videoInfo.channel)}</div>
                `;
            }
        }

        // Update UI
        updateUI() {
            this.updatePlayButton();
            this.updateNowPlaying();
        }

        // Close panel
        closePanel() {
            const panel = document.querySelector('.youtube-player-panel');
            if (panel) {
                panel.remove();
            }

            if (this.player) {
                this.player.stopVideo();
            }

            this.isPanelOpen = false;

            if (window.terminal) {
                window.terminal.log('🎥 YouTube Player closed', 'info');
            }
        }

        // Escape HTML to prevent XSS
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Check if panel is open
        isOpen() {
            return this.isPanelOpen;
        }
    }

    // Create global instance
    window.OmegaYouTube = new OmegaYouTubePlayer();

    console.log('🎥 Omega YouTube Player loaded');
})();

