// Terminal Theme Bridge - Ensures terminal output uses theme colors

(function() {
    'use strict';
    
    console.log('🎨 Terminal Theme Bridge Loading...');
    
    // Wait for terminal to be ready
    function hookTerminalLog() {
        if (!window.terminal || !window.terminal.log) {
            setTimeout(hookTerminalLog, 100);
            return;
        }
        
        console.log('✅ Hooking into terminal.log for theme support...');
        
        const originalLog = window.terminal.log.bind(window.terminal);
        
        window.terminal.log = function(message, type = 'info') {
            // Call original log
            originalLog(message, type);
            
            // Play sound effect based on message type
            if (window.OmegaSoundEffects && window.OmegaSoundEffects.isSoundEnabled()) {
                switch (type) {
                    case 'error':
                        window.OmegaSoundEffects.playSound('error', { volume: 0.6 });
                        break;
                    case 'success':
                        window.OmegaSoundEffects.playSound('success', { volume: 0.7 });
                        break;
                    case 'warning':
                        window.OmegaSoundEffects.playSound('system-notify', { volume: 0.5 });
                        break;
                    default:
                        // No sound for info messages to avoid spam
                        break;
                }
            }
            
            // Add CSS class to last line added
            setTimeout(() => {
                const output = document.getElementById('terminalOutput');
                if (!output) return;
                
                const lastLine = output.lastElementChild;
                if (lastLine) {
                    // Add type class
                    lastLine.classList.add('terminal-line', type);
                    
                    // Ensure it uses theme colors
                    lastLine.style.removeProperty('color');
                }
            }, 10);
        };
        
        console.log('✅ Terminal log hooked - theme colors will update dynamically!');
    }
    
    // Start hooking
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hookTerminalLog);
    } else {
        hookTerminalLog();
    }
    
})();

