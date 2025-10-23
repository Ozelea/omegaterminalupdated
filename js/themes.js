// Omega Terminal Theme Management
window.OmegaThemes = {
    currentTheme: 'dark',
    
    // Load saved theme preference
    loadTheme: function() {
        const savedTheme = localStorage.getItem('omega-terminal-theme') || 'dark';
        this.setTheme(savedTheme);
    },
    
    // Set theme
    setTheme: function(themeName, silent = false) {
        if (!OmegaConfig.THEMES.includes(themeName)) {
            console.warn(`Theme "${themeName}" not found. Available themes:`, OmegaConfig.THEMES);
            return;
        }
        
        // Remove all theme classes
        document.body.classList.remove(...OmegaConfig.THEMES.map(t => 'theme-' + t));
        document.body.classList.remove('modern-ui-futuristic', 'modern-terminal-ui', 'apple-ui');
        
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.classList.remove(...OmegaConfig.THEMES.map(t => 'theme-' + t));
            terminal.classList.remove('modern-ui', 'futuristic-theme', 'apple-ui');
        }
        
        // Handle modern UI theme specially
        if (themeName === 'modern') {
            // Play modern UI theme sound effect
            if (window.OmegaSoundEffects && window.OmegaSoundEffects.isSoundEnabled()) {
                window.OmegaSoundEffects.playModernUIThemeSound();
            }
            
            document.body.classList.add('modern-ui-futuristic', 'modern-terminal-ui');
            if (terminal) {
                terminal.classList.add('modern-ui', 'futuristic-theme');
            }
            
            // Force modern UI input styling
            setTimeout(() => {
                this.forceModernUIInputStyling();
                // Set up continuous monitoring for modern UI
                this.startModernUIMonitoring();
            }, 100);
        } else {
            // Stop modern UI monitoring if switching away
            if (this.modernUIMonitor) {
                clearInterval(this.modernUIMonitor);
                this.modernUIMonitor = null;
                console.log('[Modern UI] Stopped input styling monitoring');
            }
            
            // Add new theme class for other themes
            document.body.classList.add('theme-' + themeName);
            if (terminal) {
                terminal.classList.add('theme-' + themeName);
            }
        }
        
        // Save theme preference
        localStorage.setItem('omega-terminal-theme', themeName);
        this.currentTheme = themeName;
        
        // Log theme change if terminal exists (unless silent mode)
        if (!silent) {
            if (window.terminal) {
                window.terminal.log(`✅ Theme set to ${themeName} mode`, 'success');
            } else {
                console.log(`Theme set to ${themeName} mode`);
            }
        } else {
            console.log(`Theme set to ${themeName} mode`);
        }
        
        // Trigger input field fix
        if (window.fixInputField) {
            setTimeout(() => {
                window.fixInputField(themeName, false, false);
            }, 50);
        }
    },
    
    // Toggle between themes
    toggleTheme: function() {
        const currentIndex = OmegaConfig.THEMES.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % OmegaConfig.THEMES.length;
        const nextTheme = OmegaConfig.THEMES[nextIndex];
        // Use silent mode - let caller handle the message
        this.setTheme(nextTheme, true);
        return nextTheme;
    },
    
    // Apply theme (called during initialization)
    applyTheme: function() {
        this.loadTheme();
    },
    
    // Get current theme
    getCurrentTheme: function() {
        return this.currentTheme;
    },
    
    // Get available themes
    getAvailableThemes: function() {
        return [...OmegaConfig.THEMES];
    },
    
    // Force modern UI input styling
    forceModernUIInputStyling: function() {
        const inputElements = document.querySelectorAll('#commandInput, .input-field, .terminal-input-section input');
        inputElements.forEach(input => {
            if (input) {
                input.style.setProperty('color', '#ffffff', 'important');
                input.style.setProperty('font-family', "'Courier New', monospace", 'important');
                input.style.setProperty('font-weight', '400', 'important');
                input.style.setProperty('font-size', '14px', 'important');
                input.style.setProperty('text-rendering', 'optimizeLegibility', 'important');
                input.style.setProperty('-webkit-font-smoothing', 'antialiased', 'important');
                input.style.setProperty('-moz-osx-font-smoothing', 'grayscale', 'important');
                input.style.setProperty('opacity', '1', 'important');
                input.style.setProperty('background', 'transparent', 'important');
                input.style.setProperty('border', 'none', 'important');
                input.style.setProperty('outline', 'none', 'important');
            }
        });
        
        console.log('[Modern UI] Forced input styling applied to', inputElements.length, 'elements');
    },
    
    // Start monitoring for modern UI input styling
    startModernUIMonitoring: function() {
        // Clear any existing monitoring
        if (this.modernUIMonitor) {
            clearInterval(this.modernUIMonitor);
        }
        
        // Set up continuous monitoring
        this.modernUIMonitor = setInterval(() => {
            if (document.body.classList.contains('modern-ui-futuristic')) {
                this.forceModernUIInputStyling();
            } else {
                // Stop monitoring if not in modern UI
                clearInterval(this.modernUIMonitor);
                this.modernUIMonitor = null;
            }
        }, 1000);
        
        console.log('[Modern UI] Started input styling monitoring');
    },
    
    // Theme descriptions for help command
    getThemeDescriptions: function() {
        return {
            'dark': 'Default dark terminal theme',
            'light': 'Light mode with dark text on light background',
            'matrix': 'Green-on-black Matrix movie style',
            'retro': 'Retro amber terminal style',
            'powershell': 'Windows PowerShell blue theme',
            'executive': '⭐ Premium professional theme with gold accents',
            'modern': '🎨 Modern UI with sleek design and glass morphism'
        };
    }
}; 