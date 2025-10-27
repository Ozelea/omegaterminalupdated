/**
 * Terminal Output Color Integration
 * Ensures all terminal output text updates correctly with color palette and theme changes
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeColorIntegration);
    } else {
        initializeColorIntegration();
    }

    function initializeColorIntegration() {
        console.log('🎨 Initializing Terminal Output Color Integration...');

        // Create a MutationObserver to watch for new terminal output
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            updateElementColors(node);
                        }
                    });
                }
            });
        });

        // Start observing the terminal output area
        const terminalOutput = document.querySelector('.terminal-output') || document.getElementById('terminalOutput');
        if (terminalOutput) {
            observer.observe(terminalOutput, {
                childList: true,
                subtree: true
            });
        }

        // Also observe the main terminal container for any new content
        const terminal = document.getElementById('terminal') || document.querySelector('.terminal');
        if (terminal) {
            observer.observe(terminal, {
                childList: true,
                subtree: true
            });
        }

        // Update existing elements
        updateAllTerminalColors();

        // Listen for color palette changes
        window.addEventListener('colorPaletteChanged', function(event) {
            console.log('Color palette changed, updating terminal output colors...');
            updateAllTerminalColors();
        });

        // Listen for theme changes
        window.addEventListener('themeChanged', function(event) {
            console.log('🎨 Theme changed, updating terminal output colors...');
            updateAllTerminalColors();
        });

        // Listen for storage changes (when palette is changed in another tab)
        window.addEventListener('storage', function(event) {
            if (event.key === 'omega-color-palette' || event.key === 'omega-terminal-theme') {
                console.log('🎨 Storage change detected, updating terminal output colors...');
                setTimeout(updateAllTerminalColors, 100);
            }
        });

        console.log('✅ Terminal Output Color Integration initialized');
    }

    function updateAllTerminalColors() {
        // Update all terminal output elements
        const elements = document.querySelectorAll(`
            .terminal-output,
            .terminal-line,
            .output-line,
            .log-line,
            .terminal-prompt,
            .prompt,
            .input-prompt,
            .prompt-user,
            .prompt-host,
            .prompt-path,
            .prompt-separator,
            .text-success,
            .log-success,
            .terminal-line.success,
            .output.success,
            .text-error,
            .log-error,
            .terminal-line.error,
            .output.error,
            .text-warning,
            .log-warning,
            .terminal-line.warning,
            .output.warning,
            .text-info,
            .log-info,
            .terminal-line.info,
            .output.info,
            #commandInput,
            .input-field,
            .terminal-input-section,
            .input-line,
            .omega-sidebar,
            .sidebar-title,
            .sidebar-button,
            .sub-action-button,
            .omega-stats,
            .stat-card,
            .stat-label,
            .stat-number,
            .terminal-header,
            .terminal-title,
            .header-control-btn
        `);

        elements.forEach(updateElementColors);
    }

    function updateElementColors(element) {
        if (!element || !element.nodeType === Node.ELEMENT_NODE) return;

        // Force a reflow to ensure CSS variables are updated
        element.style.display = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.display = '';

        // Add a subtle animation to show the color change
        element.style.transition = 'color 0.3s ease, text-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease';
        
        // Remove transition after animation completes
        setTimeout(() => {
            if (element.style) {
                element.style.transition = '';
            }
        }, 300);
    }

    // Function to manually trigger color updates (can be called from other scripts)
    window.updateTerminalOutputColors = function() {
        console.log('🎨 Manually updating terminal output colors...');
        updateAllTerminalColors();
    };

    // Function to update colors when palette changes
    window.onColorPaletteChange = function(paletteName) {
        console.log(`Color palette changed to: ${paletteName}`);
        
        // Update body data attribute
        document.body.setAttribute('data-color-palette', paletteName);
        
        // Trigger color update
        setTimeout(updateAllTerminalColors, 50);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('colorPaletteChanged', {
            detail: { palette: paletteName }
        }));
    };

    // Function to update colors when theme changes
    window.onThemeChange = function(themeName) {
        console.log(`🎨 Theme changed to: ${themeName}`);
        
        // Update body data attribute
        document.body.setAttribute('data-theme', themeName);
        
        // Trigger color update
        setTimeout(updateAllTerminalColors, 50);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    };

    // Override the existing color command to trigger updates
    if (window.OmegaCommands && window.OmegaCommands.Color) {
        const originalSetColorPalette = window.OmegaCommands.Color.setColorPalette;
        window.OmegaCommands.Color.setColorPalette = function(paletteName) {
            const result = originalSetColorPalette.call(this, paletteName);
            setTimeout(() => {
                window.onColorPaletteChange(paletteName);
            }, 100);
            return result;
        };
    }

    // Override the existing theme command to trigger updates
    if (window.terminal && window.terminal.setTheme) {
        const originalSetTheme = window.terminal.setTheme;
        window.terminal.setTheme = function(themeName) {
            const result = originalSetTheme.call(this, themeName);
            setTimeout(() => {
                window.onThemeChange(themeName);
            }, 100);
            return result;
        };
    }

    console.log('🎨 Terminal Output Color Integration loaded successfully');
})();





