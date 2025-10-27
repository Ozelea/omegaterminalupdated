/**
 * Core Modern UI Integration - Main Terminal
 * Ensures modern UI command input is properly integrated and styled
 * Works with both futuristic and basic terminal views
 */

window.CoreModernUIIntegration = {
    initialized: false,
    monitorInterval: null,
    
    init: function() {
        if (this.initialized) return;
        
        console.log('[Core Modern UI Integration] Initializing...');
        
        // Monitor for modern UI theme activation
        this.observeThemeChanges();
        
        // Apply integration immediately if already in modern UI
        if (document.body.classList.contains('modern-ui-futuristic')) {
            this.applyModernUIIntegration();
        }
        
        this.initialized = true;
    },
    
    observeThemeChanges: function() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (document.body.classList.contains('modern-ui-futuristic')) {
                        console.log('[Core Modern UI Integration] Modern UI theme detected, applying integration...');
                        setTimeout(() => this.applyModernUIIntegration(), 50);
                    } else {
                        // Stop monitoring if not in modern UI
                        this.stopMonitoring();
                    }
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    },
    
    applyModernUIIntegration: function() {
        console.log('[Core Modern UI Integration] Applying modern UI integration...');
        
        // Apply terminal styling
        this.applyTerminalStyling();
        
        // Apply command input styling
        this.applyCommandInputStyling();
        
        // Apply status message styling
        this.applyStatusMessageStyling();
        
        // Start continuous monitoring
        this.startContinuousMonitoring();
        
        console.log('[Core Modern UI Integration] Modern UI integration applied successfully');
    },
    
    applyTerminalStyling: function() {
        const terminal = document.getElementById('terminal');
        if (terminal) {
            // Ensure terminal has modern UI classes
            terminal.classList.add('modern-ui', 'futuristic-theme');
            
            // Apply modern UI styling
            terminal.style.setProperty('background', 'var(--modern-bg-primary, #1C1C1E)', 'important');
            terminal.style.setProperty('border', '1px solid var(--modern-border, rgba(255, 255, 255, 0.1))', 'important');
            terminal.style.setProperty('border-radius', 'var(--modern-radius-lg, 16px)', 'important');
            terminal.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
            terminal.style.setProperty('-webkit-backdrop-filter', 'blur(20px)', 'important');
            terminal.style.setProperty('font-family', 'var(--modern-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", sans-serif)', 'important');
            terminal.style.setProperty('color', 'var(--modern-text-primary, #FFFFFF)', 'important');
        }
        
        // Apply terminal content styling
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            terminalContent.style.setProperty('background', 'transparent', 'important');
            terminalContent.style.setProperty('color', 'var(--modern-text-primary, #FFFFFF)', 'important');
            terminalContent.style.setProperty('font-family', 'var(--modern-font-mono, "SF Mono", "Monaco", "Consolas", monospace)', 'important');
            terminalContent.style.setProperty('font-size', '14px', 'important');
            terminalContent.style.setProperty('line-height', '1.6', 'important');
            terminalContent.style.setProperty('padding', 'var(--modern-spacing-lg, 24px)', 'important');
        }
        
        // Apply terminal output styling
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            terminalOutput.style.setProperty('background', 'transparent', 'important');
            terminalOutput.style.setProperty('color', 'var(--modern-text-primary, #FFFFFF)', 'important');
            terminalOutput.style.setProperty('font-family', 'var(--modern-font-mono, "SF Mono", "Monaco", "Consolas", monospace)', 'important');
            terminalOutput.style.setProperty('font-size', '14px', 'important');
            terminalOutput.style.setProperty('line-height', '1.6', 'important');
        }
    },
    
    applyCommandInputStyling: function() {
        // Apply input section styling
        const inputSection = document.querySelector('.terminal-input-section');
        if (inputSection) {
            inputSection.style.setProperty('background', 'var(--modern-bg-secondary, #2C2C2E)', 'important');
            inputSection.style.setProperty('border-top', '1px solid var(--modern-border, rgba(255, 255, 255, 0.1))', 'important');
            inputSection.style.setProperty('border-radius', '0 0 var(--modern-radius-lg, 16px) var(--modern-radius-lg, 16px)', 'important');
            inputSection.style.setProperty('padding', 'var(--modern-spacing-md, 16px) var(--modern-spacing-lg, 24px)', 'important');
            inputSection.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
            inputSection.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important');
        }
        
        // Apply input line styling
        const inputLine = document.querySelector('.input-line');
        if (inputLine) {
            inputLine.style.setProperty('display', 'flex', 'important');
            inputLine.style.setProperty('align-items', 'center', 'important');
            inputLine.style.setProperty('background', 'var(--modern-bg-tertiary, #3A3A3C)', 'important');
            inputLine.style.setProperty('border', '1px solid var(--modern-border, rgba(255, 255, 255, 0.1))', 'important');
            inputLine.style.setProperty('border-radius', 'var(--modern-radius-md, 12px)', 'important');
            inputLine.style.setProperty('padding', 'var(--modern-spacing-sm, 8px) var(--modern-spacing-md, 16px)', 'important');
            inputLine.style.setProperty('gap', 'var(--modern-spacing-sm, 8px)', 'important');
            inputLine.style.setProperty('box-shadow', '0 2px 8px var(--modern-shadow, rgba(0, 0, 0, 0.3))', 'important');
            inputLine.style.setProperty('backdrop-filter', 'blur(5px)', 'important');
            inputLine.style.setProperty('-webkit-backdrop-filter', 'blur(5px)', 'important');
        }
        
        // Apply input prompt styling
        const inputPrompt = document.querySelector('.input-prompt');
        if (inputPrompt) {
            inputPrompt.style.setProperty('color', 'var(--modern-primary, #007AFF)', 'important');
            inputPrompt.style.setProperty('font-family', 'var(--modern-font-mono, "SF Mono", "Monaco", "Consolas", monospace)', 'important');
            inputPrompt.style.setProperty('font-weight', '600', 'important');
            inputPrompt.style.setProperty('font-size', '14px', 'important');
            inputPrompt.style.setProperty('text-shadow', '0 0 8px var(--modern-primary-glow, rgba(0, 122, 255, 0.3))', 'important');
            inputPrompt.style.setProperty('letter-spacing', '0.5px', 'important');
            inputPrompt.style.setProperty('flex-shrink', '0', 'important');
            inputPrompt.style.setProperty('white-space', 'nowrap', 'important');
        }
        
        // Apply input field styling
        const inputField = document.querySelector('.input-field, #commandInput');
        if (inputField) {
            inputField.style.setProperty('flex', '1', 'important');
            inputField.style.setProperty('background', 'transparent', 'important');
            inputField.style.setProperty('border', 'none', 'important');
            inputField.style.setProperty('color', 'var(--modern-text-primary, #FFFFFF)', 'important');
            inputField.style.setProperty('font-family', 'var(--modern-font-mono, "SF Mono", "Monaco", "Consolas", monospace)', 'important');
            inputField.style.setProperty('font-size', '14px', 'important');
            inputField.style.setProperty('font-weight', '400', 'important');
            inputField.style.setProperty('line-height', '1.6', 'important');
            inputField.style.setProperty('outline', 'none', 'important');
            inputField.style.setProperty('padding', '0', 'important');
            inputField.style.setProperty('margin', '0', 'important');
            inputField.style.setProperty('min-width', '0', 'important');
            inputField.style.setProperty('width', '100%', 'important');
            inputField.style.setProperty('text-rendering', 'optimizeLegibility', 'important');
            inputField.style.setProperty('-webkit-font-smoothing', 'antialiased', 'important');
            inputField.style.setProperty('-moz-osx-font-smoothing', 'grayscale', 'important');
            inputField.style.setProperty('caret-color', 'var(--modern-primary, #007AFF)', 'important');
            inputField.style.setProperty('caret-shape', 'block', 'important');
            inputField.style.setProperty('caret-width', '2px', 'important');
        }
    },
    
    applyStatusMessageStyling: function() {
        // Apply success message styling
        const successMessages = document.querySelectorAll('.text-success, .log-success, .terminal-line.success');
        successMessages.forEach(msg => {
            msg.style.setProperty('color', 'var(--modern-success, #34C759)', 'important');
            msg.style.setProperty('background', 'rgba(52, 199, 89, 0.1)', 'important');
            msg.style.setProperty('border-left', '3px solid var(--modern-success, #34C759)', 'important');
            msg.style.setProperty('padding', 'var(--modern-spacing-xs, 4px) var(--modern-spacing-sm, 8px)', 'important');
            msg.style.setProperty('border-radius', '0 var(--modern-radius-sm, 8px) var(--modern-radius-sm, 8px) 0', 'important');
        });
        
        // Apply error message styling
        const errorMessages = document.querySelectorAll('.text-error, .log-error, .terminal-line.error');
        errorMessages.forEach(msg => {
            msg.style.setProperty('color', 'var(--modern-error, #FF3B30)', 'important');
            msg.style.setProperty('background', 'rgba(255, 59, 48, 0.1)', 'important');
            msg.style.setProperty('border-left', '3px solid var(--modern-error, #FF3B30)', 'important');
            msg.style.setProperty('padding', 'var(--modern-spacing-xs, 4px) var(--modern-spacing-sm, 8px)', 'important');
            msg.style.setProperty('border-radius', '0 var(--modern-radius-sm, 8px) var(--modern-radius-sm, 8px) 0', 'important');
        });
        
        // Apply warning message styling
        const warningMessages = document.querySelectorAll('.text-warning, .log-warning, .terminal-line.warning');
        warningMessages.forEach(msg => {
            msg.style.setProperty('color', 'var(--modern-warning, #FF9500)', 'important');
            msg.style.setProperty('background', 'rgba(255, 149, 0, 0.1)', 'important');
            msg.style.setProperty('border-left', '3px solid var(--modern-warning, #FF9500)', 'important');
            msg.style.setProperty('padding', 'var(--modern-spacing-xs, 4px) var(--modern-spacing-sm, 8px)', 'important');
            msg.style.setProperty('border-radius', '0 var(--modern-radius-sm, 8px) var(--modern-radius-sm, 8px) 0', 'important');
        });
        
        // Apply info message styling
        const infoMessages = document.querySelectorAll('.text-info, .log-info, .terminal-line.info');
        infoMessages.forEach(msg => {
            msg.style.setProperty('color', 'var(--modern-info, #5AC8FA)', 'important');
            msg.style.setProperty('background', 'rgba(90, 200, 250, 0.1)', 'important');
            msg.style.setProperty('border-left', '3px solid var(--modern-info, #5AC8FA)', 'important');
            msg.style.setProperty('padding', 'var(--modern-spacing-xs, 4px) var(--modern-spacing-sm, 8px)', 'important');
            msg.style.setProperty('border-radius', '0 var(--modern-radius-sm, 8px) var(--modern-radius-sm, 8px) 0', 'important');
        });
    },
    
    startContinuousMonitoring: function() {
        // Clear existing monitor
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        
        // Monitor every 1 second
        this.monitorInterval = setInterval(() => {
            if (document.body.classList.contains('modern-ui-futuristic')) {
                // Check if input field styling is correct
                const inputField = document.querySelector('.input-field, #commandInput');
                if (inputField && inputField.style.color !== 'rgb(255, 255, 255)') {
                    inputField.style.setProperty('color', 'var(--modern-text-primary, #FFFFFF)', 'important');
                    inputField.style.setProperty('font-family', 'var(--modern-font-mono, "SF Mono", "Monaco", "Consolas", monospace)', 'important');
                }
                
                // Check if prompt styling is correct
                const inputPrompt = document.querySelector('.input-prompt');
                if (inputPrompt && inputPrompt.style.color !== 'rgb(0, 122, 255)') {
                    inputPrompt.style.setProperty('color', 'var(--modern-primary, #007AFF)', 'important');
                }
            } else {
                // Stop monitoring if not in modern UI
                this.stopMonitoring();
            }
        }, 1000);
    },
    
    stopMonitoring: function() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            console.log('[Core Modern UI Integration] Stopped monitoring');
        }
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CoreModernUIIntegration.init();
    });
} else {
    window.CoreModernUIIntegration.init();
}

