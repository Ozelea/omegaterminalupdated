/**
 * Omega Terminal Sound Effects System
 * Manages MP4 audio playback for user interactions
 */

class OmegaSoundEffects {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isEnabled = true;
        this.volume = 0.7;
        this.currentlyPlaying = new Set();
        
        // Initialize audio context on first user interaction
        this.initializeAudioContext();
        
        // Load default sound effects
        this.loadDefaultSounds();
    }

    /**
     * Initialize Web Audio API context
     */
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('[OmegaSoundEffects] Audio context initialized, state:', this.audioContext.state);
        } catch (error) {
            console.warn('[OmegaSoundEffects] Web Audio API not supported:', error);
            this.isEnabled = false;
        }
    }

    /**
     * Load default sound effects
     */
    loadDefaultSounds() {
        console.log('[OmegaSoundEffects] Loading default sounds...');
        
        // Interface selection sound
        this.registerSound('interface-select', {
            src: 'sounds/wookie.mp4.mp3',
            volume: 0.8,
            duration: 2000,
            description: 'Interface selection confirmation'
        });

        // Button click sound (temporarily disabled - file missing)
        // this.registerSound('button-click', {
        //     src: 'sounds/button-click.mp4',
        //     volume: 0.6,
        //     duration: 500,
        //     description: 'Button click feedback'
        // });

        // Command execution sound (temporarily disabled - file missing)
        // this.registerSound('command-execute', {
        //     src: 'sounds/command-execute.mp4',
        //     volume: 0.7,
        //     duration: 1000,
        //     description: 'Command execution confirmation'
        // });

        // System notification sound (temporarily disabled - file missing)
        // this.registerSound('system-notify', {
        //     src: 'sounds/system-notify.mp4',
        //     volume: 0.5,
        //     duration: 1500,
        //     description: 'System notification'
        // });

        // Error sound (temporarily disabled - file missing)
        // this.registerSound('error', {
        //     src: 'sounds/error.mp4',
        //     volume: 0.6,
        //     duration: 800,
        //     description: 'Error notification'
        // });

        // Success sound (temporarily disabled - file missing)
        // this.registerSound('success', {
        //     src: 'sounds/success.mp4',
        //     volume: 0.7,
        //     duration: 1200,
        //     description: 'Success confirmation'
        // });

        // Wallet connection success sound
        this.registerSound('wallet-connect', {
            src: 'sounds/robot-gmb.mp3',
            volume: 0.8,
            duration: 2000,
            description: 'Wallet connection success'
        });

        // AI toggle sound
        this.registerSound('ai-toggle', {
            src: 'sounds/i-am-a-robot.mp3',
            volume: 1.0,
            duration: null, // Let it play to natural end
            description: 'AI toggle activation'
        });

        // Balance/wealth sound
        this.registerSound('balance-wealth', {
            src: 'sounds/so-you-rich.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            description: 'Balance check and wealth tracking'
        });

        // Chart viewer sound
        this.registerSound('chart-viewer', {
            src: 'sounds/so-you-rich.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            description: 'Chart viewer opening'
        });

        // Basic view sound
        this.registerSound('basic-view', {
            src: 'sounds/oh-fucking.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            preload: false, // Disable preloading for this large file
            description: 'Basic view activation'
        });

        // Clear terminal sound
        this.registerSound('clear-terminal', {
            src: 'sounds/you-cocky.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            preload: false, // Disable preloading for this file
            description: 'Terminal clear command'
        });

        // Modern UI theme sound
        this.registerSound('modern-ui-theme', {
            src: 'sounds/grandmas-boy.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            description: 'Modern UI theme selection'
        });

        // Help command sound
        this.registerSound('help-command', {
            src: 'sounds/grandmas-boy.mp3',
            volume: 0.8,
            duration: null, // Let it play to natural end
            description: 'Help command activation'
        });
    }

    /**
     * Register a new sound effect
     * @param {string} name - Unique identifier for the sound
     * @param {Object} config - Sound configuration
     */
    registerSound(name, config) {
        if (!this.isEnabled) return;

        const soundConfig = {
            src: config.src,
            volume: config.volume || 0.7,
            duration: config.duration || 1000,
            description: config.description || 'Sound effect',
            preload: config.preload !== false,
            loop: config.loop || false,
            ...config
        };

        this.sounds.set(name, soundConfig);
        console.log(`[OmegaSoundEffects] Registered sound: ${name} -> ${config.src}`);

        // Preload the sound if specified
        if (soundConfig.preload) {
            this.preloadSound(name);
        }
    }

    /**
     * Preload a sound file
     * @param {string} name - Sound identifier
     */
    async preloadSound(name) {
        const soundConfig = this.sounds.get(name);
        if (!soundConfig) return;

        try {
            const audio = new Audio(soundConfig.src);
            audio.preload = 'auto';
            audio.volume = soundConfig.volume * this.volume;
            
            // Store the audio element for reuse
            soundConfig.audioElement = audio;
            
            // Load the audio
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve, { once: true });
                audio.addEventListener('error', reject, { once: true });
                audio.load();
            });

            console.log(`[OmegaSoundEffects] Preloaded sound: ${name}`);
        } catch (error) {
            console.warn(`[OmegaSoundEffects] Failed to preload sound ${name}:`, error);
        }
    }

    /**
     * Play a sound effect
     * @param {string} name - Sound identifier
     * @param {Object} options - Playback options
     */
    async playSound(name, options = {}) {
        console.log(`[OmegaSoundEffects] playSound called for: ${name}`);
        if (!this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects disabled, returning');
            return;
        }

        const soundConfig = this.sounds.get(name);
        if (!soundConfig) {
            console.warn(`[OmegaSoundEffects] Sound not found: ${name}`);
            console.log('[OmegaSoundEffects] Available sounds:', Array.from(this.sounds.keys()));
            return;
        }
        
        console.log(`[OmegaSoundEffects] Found sound config for ${name}:`, soundConfig);

        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('[OmegaSoundEffects] Failed to resume audio context:', error);
            }
        }

        try {
            let audio;
            
            // Use preloaded audio element if available
            if (soundConfig.audioElement) {
                audio = soundConfig.audioElement.cloneNode();
            } else {
                audio = new Audio(soundConfig.src);
            }

            // Configure audio
            audio.volume = (soundConfig.volume * this.volume) * (options.volume || 1);
            audio.loop = options.loop || soundConfig.loop;

            // Add to currently playing set
            this.currentlyPlaying.add(name);

            // Set up event listeners
            const cleanup = () => {
                this.currentlyPlaying.delete(name);
                audio.removeEventListener('ended', cleanup);
                audio.removeEventListener('error', cleanup);
            };

            audio.addEventListener('ended', cleanup, { once: true });
            audio.addEventListener('error', (error) => {
                console.warn(`[OmegaSoundEffects] Error playing sound ${name}:`, error);
                cleanup();
            }, { once: true });

            // Play the sound
            console.log(`[OmegaSoundEffects] Attempting to play sound: ${name}`);
            try {
                await audio.play();
                console.log(`[OmegaSoundEffects] Successfully started playing sound: ${name}`);
            } catch (playError) {
                console.error(`[OmegaSoundEffects] Failed to play sound ${name}:`, playError);
                cleanup();
                return;
            }

            // Auto-stop after duration if specified and not looping (fallback only)
            if (soundConfig.duration && !audio.loop) {
                setTimeout(() => {
                    // Only stop if the audio hasn't ended naturally
                    if (!audio.paused && !audio.ended) {
                        console.log(`[OmegaSoundEffects] Auto-stopping sound ${name} after ${soundConfig.duration}ms`);
                        audio.pause();
                        audio.currentTime = 0;
                        cleanup();
                    }
                }, soundConfig.duration);
            }

            console.log(`[OmegaSoundEffects] Playing sound: ${name}`);
            return audio;

        } catch (error) {
            console.warn(`[OmegaSoundEffects] Failed to play sound ${name}:`, error);
            this.currentlyPlaying.delete(name);
        }
    }

    /**
     * Stop a specific sound
     * @param {string} name - Sound identifier
     */
    stopSound(name) {
        const soundConfig = this.sounds.get(name);
        if (soundConfig && soundConfig.audioElement) {
            soundConfig.audioElement.pause();
            soundConfig.audioElement.currentTime = 0;
        }
        this.currentlyPlaying.delete(name);
    }

    /**
     * Stop all currently playing sounds
     */
    stopAllSounds() {
        this.sounds.forEach((soundConfig, name) => {
            if (soundConfig.audioElement) {
                soundConfig.audioElement.pause();
                soundConfig.audioElement.currentTime = 0;
            }
        });
        this.currentlyPlaying.clear();
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update volume for all preloaded sounds
        this.sounds.forEach((soundConfig) => {
            if (soundConfig.audioElement) {
                soundConfig.audioElement.volume = soundConfig.volume * this.volume;
            }
        });
    }

    /**
     * Enable or disable sound effects
     * @param {boolean} enabled - Whether to enable sounds
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        
        if (!enabled) {
            this.stopAllSounds();
        }
        
        // Save preference to localStorage
        localStorage.setItem('omega-sound-effects-enabled', enabled.toString());
    }

    /**
     * Check if sound effects are enabled
     * @returns {boolean}
     */
    isSoundEnabled() {
        return this.isEnabled;
    }

    /**
     * Get list of registered sounds
     * @returns {Array} Array of sound information
     */
    getRegisteredSounds() {
        return Array.from(this.sounds.entries()).map(([name, config]) => ({
            name,
            description: config.description,
            duration: config.duration,
            volume: config.volume,
            isPlaying: this.currentlyPlaying.has(name)
        }));
    }

    /**
     * Check if a sound is currently playing
     * @param {string} name - Sound identifier
     * @returns {boolean}
     */
    isPlaying(name) {
        return this.currentlyPlaying.has(name);
    }

    /**
     * Initialize sound effects from user preferences
     */
    initializeFromPreferences() {
        const savedEnabled = localStorage.getItem('omega-sound-effects-enabled');
        if (savedEnabled !== null) {
            this.setEnabled(savedEnabled === 'true');
        }
        
        const savedVolume = localStorage.getItem('omega-sound-effects-volume');
        if (savedVolume !== null) {
            this.setVolume(parseFloat(savedVolume));
        }
        
        // Set up global button click handlers
        this.setupGlobalButtonHandlers();
    }

    /**
     * Set up global button click handlers for sound effects
     */
    setupGlobalButtonHandlers() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachGlobalButtonSounds();
            });
        } else {
            this.attachGlobalButtonSounds();
        }
    }

    /**
     * Attach sound effects to all buttons globally
     */
    attachGlobalButtonSounds() {
        // Add click sound to all buttons
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Check if clicked element is a button or has button-like behavior
            if (this.isButtonElement(target)) {
                this.playSound('button-click', {
                    volume: 0.5
                });
            }
        });

        // Add touch sound for mobile
        document.addEventListener('touchstart', (event) => {
            const target = event.target;
            
            if (this.isButtonElement(target)) {
                this.playSound('button-click', {
                    volume: 0.4
                });
            }
        });

        console.log('[OmegaSoundEffects] Global button sound handlers attached');
    }

    /**
     * Check if element is a button or button-like element
     * @param {Element} element - Element to check
     * @returns {boolean}
     */
    isButtonElement(element) {
        // Direct button elements
        if (element.tagName === 'BUTTON') {
            return true;
        }
        
        // Elements with button role
        if (element.getAttribute('role') === 'button') {
            return true;
        }
        
        // Clickable elements with cursor pointer
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.cursor === 'pointer') {
            return true;
        }
        
        // Elements with onclick handlers
        if (element.onclick || element.getAttribute('onclick')) {
            return true;
        }
        
        // Interface option buttons (specific to Omega Terminal)
        if (element.classList.contains('interface-option')) {
            return true;
        }
        
        // Tab elements
        if (element.classList.contains('tab')) {
            return true;
        }
        
        // Theme toggle buttons
        if (element.classList.contains('theme-toggle')) {
            return true;
        }
        
        return false;
    }

    /**
     * Create a sound effect trigger for interface elements
     * @param {string} elementId - Element ID to attach sound to
     * @param {string} soundName - Sound to play
     * @param {Object} options - Additional options
     */
    attachSoundToElement(elementId, soundName, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`[OmegaSoundEffects] Element not found: ${elementId}`);
            return;
        }

        const playSound = () => {
            this.playSound(soundName, options);
        };

        // Attach to click events
        element.addEventListener('click', playSound);
        
        // Also attach to touch events for mobile
        element.addEventListener('touchstart', playSound);

        console.log(`[OmegaSoundEffects] Attached sound ${soundName} to element ${elementId}`);
    }

    /**
     * Create a sound effect trigger for multiple elements with same class
     * @param {string} className - CSS class name
     * @param {string} soundName - Sound to play
     * @param {Object} options - Additional options
     */
    attachSoundToClass(className, soundName, options = {}) {
        const elements = document.querySelectorAll(`.${className}`);
        if (elements.length === 0) {
            console.warn(`[OmegaSoundEffects] No elements found with class: ${className}`);
            return;
        }

        const playSound = () => {
            this.playSound(soundName, options);
        };

        elements.forEach(element => {
            element.addEventListener('click', playSound);
            element.addEventListener('touchstart', playSound);
        });

        console.log(`[OmegaSoundEffects] Attached sound ${soundName} to ${elements.length} elements with class ${className}`);
    }

    /**
     * Play wallet connection success sound
     * @param {Object} options - Additional options
     */
    playWalletConnectSound(options = {}) {
        if (this.isEnabled) {
            this.playSound('wallet-connect', {
                volume: 0.8,
                ...options
            });
        }
    }

    /**
     * Play AI toggle sound
     * @param {Object} options - Additional options
     */
    playAIToggleSound(options = {}) {
        if (this.isEnabled) {
            this.playSound('ai-toggle', {
                volume: 0.8,
                ...options
            });
        }
    }

    /**
     * Play balance/wealth sound
     * @param {Object} options - Additional options
     */
    playBalanceWealthSound(options = {}) {
        console.log('[OmegaSoundEffects] playBalanceWealthSound called');
        console.log('[OmegaSoundEffects] System enabled:', this.isEnabled);
        console.log('[OmegaSoundEffects] Audio context state:', this.audioContext ? this.audioContext.state : 'null');
        console.log('[OmegaSoundEffects] Registered sounds:', Array.from(this.sounds.keys()));
        
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing balance-wealth sound');
            this.playSound('balance-wealth', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }

    /**
     * Play chart viewer sound
     * @param {Object} options - Additional options
     */
    playChartViewerSound(options = {}) {
        console.log('[OmegaSoundEffects] playChartViewerSound called');
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing chart-viewer sound');
            this.playSound('chart-viewer', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }

    /**
     * Play basic view sound
     * @param {Object} options - Additional options
     */
    playBasicViewSound(options = {}) {
        console.log('[OmegaSoundEffects] playBasicViewSound called');
        console.log('[OmegaSoundEffects] System enabled:', this.isEnabled);
        console.log('[OmegaSoundEffects] Audio context state:', this.audioContext ? this.audioContext.state : 'null');
        console.log('[OmegaSoundEffects] Registered sounds:', Array.from(this.sounds.keys()));
        
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing basic-view sound');
            this.playSound('basic-view', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }

    playClearTerminalSound(options = {}) {
        console.log('[OmegaSoundEffects] playClearTerminalSound called');
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing clear-terminal sound');
            this.playSound('clear-terminal', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }

    playModernUIThemeSound(options = {}) {
        console.log('[OmegaSoundEffects] playModernUIThemeSound called');
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing modern-ui-theme sound');
            this.playSound('modern-ui-theme', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }

    playHelpCommandSound(options = {}) {
        console.log('[OmegaSoundEffects] playHelpCommandSound called');
        if (this.isEnabled) {
            console.log('[OmegaSoundEffects] Sound effects enabled, playing help-command sound');
            this.playSound('help-command', {
                volume: 0.8,
                ...options
            });
        } else {
            console.log('[OmegaSoundEffects] Sound effects disabled');
        }
    }
}

// Create global instance
window.OmegaSoundEffects = new OmegaSoundEffects();

// Initialize from user preferences
window.OmegaSoundEffects.initializeFromPreferences();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OmegaSoundEffects;
}
