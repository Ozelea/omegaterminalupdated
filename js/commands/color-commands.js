/**
 * Color Palette Commands Module
 * Dynamic color scheme system for Omega Terminal
 * Changes color palettes while maintaining current theme
 */

window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Color = {
    // Available color palettes
    palettes: {
        'red': 'Crimson - Fierce and bold red tones',
        'crimson': 'Crimson - Fierce and bold red tones',
        'anime': 'Anime - Vibrant pink, purple and cyan',
        'ocean': 'Ocean - Deep blue and teal waves',
        'blue': 'Ocean - Deep blue and teal waves',
        'forest': 'Forest - Emerald green nature',
        'green': 'Forest - Emerald green nature',
        'sunset': 'Sunset - Orange, pink and purple sky',
        'purple': 'Purple - Royal violet mystique',
        'violet': 'Purple - Royal violet mystique',
        'cyber': 'Cyber - Neon cyan and magenta electric',
        'neon': 'Cyber - Neon cyan and magenta electric',
        'gold': 'Gold - Opulent gold and bronze luxury',
        'luxury': 'Gold - Opulent gold and bronze luxury',
        'ice': 'Ice - Glacial blue and silver frost',
        'frost': 'Ice - Glacial blue and silver frost',
        'fire': 'Fire - Blazing red, orange and yellow flames',
        'flame': 'Fire - Blazing red, orange and yellow flames',
        'mint': 'Mint - Fresh turquoise and teal',
        'turquoise': 'Mint - Fresh turquoise and teal',
        'rose': 'Rose - Soft pink and rose gold',
        'pink': 'Rose - Soft pink and rose gold',
        'amber': 'Amber - Warm amber and honey',
        'honey': 'Amber - Warm amber and honey',
        'slate': 'Slate - Cool gray and silver tech',
        'silver': 'Slate - Cool gray and silver tech',
        'lavender': 'Lavender - Soft purple and lilac',
        'lilac': 'Lavender - Soft purple and lilac',
        'toxic': 'Toxic - Radioactive lime green',
        'radioactive': 'Toxic - Radioactive lime green'
    },

    // Current color palette
    currentPalette: null,

    // Set color palette
    setColorPalette: function(paletteName, silent = false) {
        const palette = paletteName.toLowerCase();

        // Validate palette
        if (!this.palettes[palette]) {
            return {
                success: false,
                error: `Invalid color palette: ${paletteName}`
            };
        }

        // Apply palette to body
        document.body.setAttribute('data-color-palette', palette);
        
        // Store in localStorage
        localStorage.setItem('omega-color-palette', palette);
        this.currentPalette = palette;

        // Get palette description
        const description = this.palettes[palette];

        if (!silent && window.terminal) {
            window.terminal.log(`Color palette changed to: ${palette}`, 'success');
            window.terminal.log(`${description}`, 'info');
        }

        return {
            success: true,
            palette: palette,
            description: description
        };
    },

    // Get current palette
    getCurrentPalette: function() {
        if (!this.currentPalette) {
            this.currentPalette = localStorage.getItem('omega-color-palette') || 'default';
        }
        return this.currentPalette;
    },

    // Load saved palette
    loadSavedPalette: function() {
        const savedPalette = localStorage.getItem('omega-color-palette');
        if (savedPalette && this.palettes[savedPalette]) {
            document.body.setAttribute('data-color-palette', savedPalette);
            this.currentPalette = savedPalette;
            console.log(`Loaded saved color palette: ${savedPalette}`);
        }
    },

    // Reset to default (no palette)
    resetPalette: function(terminal) {
        document.body.removeAttribute('data-color-palette');
        localStorage.removeItem('omega-color-palette');
        this.currentPalette = null;

        if (terminal) {
            terminal.log('Color palette reset to default', 'success');
        }

        return { success: true };
    },

    // List all available palettes
    listPalettes: function(terminal) {
        terminal.log('', 'output');
        terminal.log('═══════════════════════════════════════════════', 'output');
        terminal.log('       OMEGA TERMINAL - COLOR PALETTES', 'info');
        terminal.log('═══════════════════════════════════════════════', 'output');
        terminal.log('', 'output');

        const current = this.getCurrentPalette();
        
        terminal.log('VIBRANT COLORS:', 'info');
        terminal.log('  color red          Crimson - Fierce red tones', 'output');
        terminal.log('  color anime        Anime - Vibrant pink/purple/cyan', 'output');
        terminal.log('  color cyber        Cyber - Neon cyan/magenta', 'output');
        terminal.log('  color fire         Fire - Blazing flames', 'output');
        terminal.log('  color toxic        Toxic - Radioactive lime', 'output');
        terminal.log('', 'output');
        
        terminal.log('COOL TONES:', 'info');
        terminal.log('  color ocean        Ocean - Deep blue/teal', 'output');
        terminal.log('  color ice          Ice - Glacial frost', 'output');
        terminal.log('  color mint         Mint - Fresh turquoise', 'output');
        terminal.log('  color slate        Slate - Cool gray/silver', 'output');
        terminal.log('', 'output');
        
        terminal.log('WARM TONES:', 'info');
        terminal.log('  color sunset       Sunset - Orange/pink/purple', 'output');
        terminal.log('  color rose         Rose - Soft pink/rose gold', 'output');
        terminal.log('  color amber        Amber - Warm honey', 'output');
        terminal.log('  color gold         Gold - Luxury gold/bronze', 'output');
        terminal.log('', 'output');
        
        terminal.log('MYSTICAL:', 'info');
        terminal.log('  color purple       Purple - Royal violet', 'output');
        terminal.log('  color lavender     Lavender - Soft lilac', 'output');
        terminal.log('', 'output');
        
        terminal.log('NATURE:', 'info');
        terminal.log('  color forest       Forest - Emerald green', 'output');
        terminal.log('', 'output');
        
        terminal.log('COMMANDS:', 'info');
        terminal.log('  color list         Show this list', 'output');
        terminal.log('  color reset        Reset to default colors', 'output');
        terminal.log('  color current      Show current palette', 'output');
        terminal.log('', 'output');
        
        if (current && current !== 'default') {
            terminal.log(`Current palette: ${current} - ${this.palettes[current] || ''}`, 'success');
        } else {
            terminal.log('Current palette: Default (Cyber Blue)', 'info');
        }
        terminal.log('', 'output');
        terminal.log('Color palettes work with ALL themes!', 'success');
        terminal.log('Try: color anime, then theme executive', 'info');
        terminal.log('', 'output');
    },

    // Show current palette
    showCurrent: function(terminal) {
        const current = this.getCurrentPalette();
        
        if (current && current !== 'default' && this.palettes[current]) {
            terminal.log(`Current color palette: ${current}`, 'success');
            terminal.log(`${this.palettes[current]}`, 'info');
        } else {
            terminal.log('Current color palette: Default (Cyber Blue)', 'info');
        }
    },

    // Main color command handler
    color: function(terminal, args) {
        if (!args || args.length === 0) {
            this.listPalettes(terminal);
            return;
        }

        const subCommand = args[0]?.toLowerCase();

        switch (subCommand) {
            case 'list':
            case 'all':
            case 'help':
                this.listPalettes(terminal);
                break;
            
            case 'current':
            case 'show':
                this.showCurrent(terminal);
                break;
            
            case 'reset':
            case 'default':
                this.resetPalette(terminal);
                break;
            
            default:
                // Try to set the palette
                const result = this.setColorPalette(subCommand);
                
                if (result.success) {
                    terminal.log(`Color palette: ${result.description}`, 'success');
                    terminal.log('Applied to current theme', 'info');
                } else {
                    terminal.log(`${result.error}`, 'error');
                    terminal.log('Type "color list" to see available palettes', 'info');
                }
                break;
        }
    }
};

// Auto-load saved palette on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.OmegaCommands && window.OmegaCommands.Color) {
        window.OmegaCommands.Color.loadSavedPalette();
    }
});

console.log('Color Palette Commands loaded - 10 palettes available!');

