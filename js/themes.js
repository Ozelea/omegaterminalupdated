// Omega Terminal Theme Management
window.OmegaThemes = {
    currentTheme: 'dark',
    
    // Load saved theme preference
    loadTheme: function() {
        const savedTheme = localStorage.getItem('omega-terminal-theme') || 'dark';
        this.setTheme(savedTheme);
    },
    
    // Set theme
    setTheme: function(themeName) {
        if (!OmegaConfig.THEMES.includes(themeName)) {
            console.warn(`Theme "${themeName}" not found. Available themes:`, OmegaConfig.THEMES);
            return;
        }
        
        // Remove all theme classes
        document.body.classList.remove(...OmegaConfig.THEMES.map(t => 'theme-' + t));
        
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.classList.remove(...OmegaConfig.THEMES.map(t => 'theme-' + t));
        }
        
        // Add new theme class
        document.body.classList.add('theme-' + themeName);
        if (terminal) {
            terminal.classList.add('theme-' + themeName);
        }
        
        // Save theme preference
        localStorage.setItem('omega-terminal-theme', themeName);
        this.currentTheme = themeName;
        
        // Log theme change if terminal exists
        if (window.terminal) {
            window.terminal.log(`Theme set to ${themeName} mode`, 'success');
        } else {
            console.log(`Theme set to ${themeName} mode`);
        }
    },
    
    // Toggle between themes
    toggleTheme: function() {
        const currentIndex = OmegaConfig.THEMES.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % OmegaConfig.THEMES.length;
        const nextTheme = OmegaConfig.THEMES[nextIndex];
        this.setTheme(nextTheme);
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
    
    // Theme descriptions for help command
    getThemeDescriptions: function() {
        return {
            'dark': 'Default dark terminal theme',
            'light': 'Light mode with dark text on light background',
            'matrix': 'Green-on-black Matrix movie style',
            'retro': 'Retro amber terminal style',
            'powershell': 'Windows PowerShell blue theme'
        };
    }
}; 