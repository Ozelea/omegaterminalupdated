// Omega Terminal Initialization
console.log('🚀 OMEGA TERMINAL INIT v2.0.1 LOADED');
console.log('🚀 CACHE BUSTED - UPDATED MODULAR CODE SHOULD BE ACTIVE');
console.log('🚀 MODULAR STRUCTURE IMPLEMENTED');
console.log('🚀 TIMESTAMP: ' + new Date().toISOString());

// Version check and cache busting
console.log('🚀 Checking cache bust status...');
OmegaUtils.checkCacheBust();

// Phantom blocking - Completely prevent Phantom from taking over window.ethereum
const originalEthereum = window.ethereum;
if (originalEthereum && originalEthereum.isPhantom) {
    console.log('Phantom detected in init script - blocking immediately');
    // Store the original providers before Phantom takes over
    const providers = originalEthereum.providers || [];
    const metamaskProvider = providers.find(p => p.isMetaMask);
    
    if (metamaskProvider) {
        window.ethereum = metamaskProvider;
        console.log('MetaMask restored in init script');
    } else {
        window.ethereum = null;
        console.log('No MetaMask found - blocking all wallets');
    }
}

// Force MetaMask preference immediately after libraries load
(function() {
    // More aggressive MetaMask forcing
    if (window.ethereum && window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
        if (metamaskProvider) {
            // Completely replace window.ethereum with MetaMask
            window.ethereum = metamaskProvider;
            console.log('MetaMask provider selected (init)');
            
            // Also set a flag to prevent other providers from taking over
            window.ethereum._forceMetaMask = true;
        }
    }
    
    // Additional check: if we detect Phantom, try to find MetaMask again
    if (window.ethereum && window.ethereum.isPhantom && !window.ethereum._forceMetaMask) {
        console.log('Phantom detected in init, searching for MetaMask...');
        // Look for MetaMask in the original providers array
        if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
            const metamaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
            if (metamaskProvider) {
                window.ethereum = metamaskProvider;
                window.ethereum._forceMetaMask = true;
                console.log('MetaMask found and forced after Phantom detection in init');
            }
        }
    }
})();

// Ensure Solana Web3 is accessible
if (typeof window.solanaWeb3 === 'undefined' && typeof solanaWeb3 !== 'undefined') {
    window.solanaWeb3 = solanaWeb3;
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM Content Loaded - Initializing Terminal');
    
    // Create global terminal instance
    try {
        console.log('[DEBUG] Creating OmegaMinerTerminal instance');
        window.terminal = new OmegaMinerTerminal();
        console.log('[DEBUG] Terminal instance created successfully');
        
        // Force terminal input to be visible with aggressive approach  
        setTimeout(() => {
            if (window.OmegaCommands && window.OmegaCommands.Basic) {
                window.OmegaCommands.Basic.forceTerminalInputVisible();
            } else {
                // Fallback if Basic commands not loaded yet
                console.log('[DEBUG] OmegaCommands.Basic not ready, using fallback');
                const terminal = document.getElementById('terminal');
                const bootAnimation = document.getElementById('bootAnimation');
                
                if (bootAnimation) {
                    bootAnimation.style.display = 'none';
                }
                
                if (terminal) {
                    terminal.style.display = 'flex';
                    terminal.style.visibility = 'visible';
                }
                
                let inputSection = document.querySelector('.terminal-input-section');
                if (!inputSection && terminal) {
                    const newInputSection = document.createElement('div');
                    newInputSection.className = 'terminal-input-section';
                    newInputSection.style.cssText = 'display: flex !important; width: calc(100vw - 40px) !important; max-width: calc(100vw - 40px) !important; box-sizing: border-box !important; background: rgba(255,255,255,0.05) !important; border: 1px solid #ffffff !important; border-radius: 5px !important; padding: 15px !important; margin: 0 !important; overflow: hidden !important;';
                    newInputSection.innerHTML = `
                                                  <div class="input-line" style="display: flex !important; width: 100% !important; align-items: center;">
                              <span class="input-prompt">Ω Terminal:~$</span>
                                                             <input type="text" class="input-field" id="commandInput" placeholder="" autocomplete="off" style="flex: 1 !important; width: 100% !important; min-width: 0 !important; background: none !important; border: none !important; color: #ffffff !important; font-family: 'Courier New', monospace !important; outline: none !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; overflow: visible !important;">
                          </div>
                    `;
                    terminal.appendChild(newInputSection);
                    
                    const input = document.getElementById('commandInput');
                    if (input) {
                        input.focus();
                        
                        // POSITION CURSOR AT END - Force with invisible characters
                        const CURSOR_PADDING = '                                                                    '; // ~80 spaces
                        
                        const positionCursorAtEnd = () => {
                            const currentText = input.value.replace(/\s+$/, ''); // Remove trailing spaces
                            input.value = currentText + CURSOR_PADDING;
                            // Set cursor right after the real text (at start of padding)
                            input.setSelectionRange(currentText.length, currentText.length);
                        };
                        
                        // Override the getValue to return clean text without padding
                        input.getRealValue = function() {
                            return this.value.replace(/\s+$/, '');
                        };
                        
                        // Position cursor at end immediately
                        positionCursorAtEnd();
                        
                        // Re-position on any interaction
                        input.addEventListener('click', positionCursorAtEnd);
                        input.addEventListener('focus', positionCursorAtEnd);
                        input.addEventListener('keyup', positionCursorAtEnd);
                        
                        console.log('[DEBUG] Applied forced cursor positioning at end');
                        
                        // Event listener will be attached by terminal-core.js
                    }
                }
            }
        }, 500);
        
        // Restore saved GUI style (default to terminal)
        const savedGuiStyle = localStorage.getItem('omega-gui-style') || 'terminal';
        console.log(`[DEBUG] Saved GUI style: ${savedGuiStyle}`);
        
        // Only apply non-terminal GUI styles if specifically requested
        if (savedGuiStyle && savedGuiStyle !== 'terminal' && window.OmegaCommands && window.OmegaCommands.Basic) {
            console.log(`[DEBUG] Restoring GUI style: ${savedGuiStyle}`);
            window.OmegaCommands.Basic.applyGuiStyle(savedGuiStyle);
        } else {
            // Ensure we're in terminal mode
            document.body.className = document.body.className.replace(/gui-\w+/g, '');
            console.log('[DEBUG] Terminal mode ensured - GUI classes removed');
        }
        
        // Initialize AI toggle button state (FORCE OFF)
        setTimeout(() => {
            console.log('[DEBUG] Starting AI Mode initialization...');
            
            // FORCE CLEAR any existing AI Mode settings
            localStorage.removeItem('omega-ai-mode');
            localStorage.setItem('omega-ai-mode', 'false');
            console.log('[DEBUG] AI Mode FORCED to OFF - localStorage cleared and set to false');
            
            const aiToggle = document.querySelector('.ai-toggle');
            if (aiToggle) {
                // Force the button text to OFF
                aiToggle.textContent = 'AI Mode: OFF';
                console.log('[DEBUG] AI toggle button text FORCED to OFF');
                console.log('[DEBUG] Current localStorage value:', localStorage.getItem('omega-ai-mode'));
            } else {
                console.log('[DEBUG] AI toggle button not found!');
            }
        }, 50);
        
        // Additional check to ensure it stays OFF
        setTimeout(() => {
            console.log('[DEBUG] Secondary AI Mode check...');
            const aiToggle = document.querySelector('.ai-toggle');
            const currentValue = localStorage.getItem('omega-ai-mode');
            console.log('[DEBUG] AI Mode localStorage after 200ms:', currentValue);
            
            if (currentValue !== 'false') {
                console.log('[DEBUG] AI Mode was changed! Forcing back to false...');
                localStorage.setItem('omega-ai-mode', 'false');
            }
            
            if (aiToggle && !aiToggle.textContent.includes('OFF')) {
                console.log('[DEBUG] Button text was changed! Forcing back to OFF...');
                aiToggle.textContent = 'AI Mode: OFF';
            }
        }, 200);
    } catch (error) {
        console.error('[ERROR] Failed to create terminal instance:', error);
        
        // Fallback error display
        document.body.innerHTML = `
            <div style="background: #000; color: #fff; padding: 20px; font-family: monospace;">
                <h1 style="color: #ff3333;">❌ Omega Terminal Initialization Error</h1>
                <p>Failed to initialize the terminal. Please check the console for details.</p>
                <p style="color: #ffff00;">Error: ${error.message}</p>
                <p style="color: #cccccc;">Try refreshing the page. If the problem persists, please report this issue.</p>
            </div>
        `;
    }
});

// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    console.log('[DEBUG] Document is still loading, waiting for DOMContentLoaded');
} else {
    console.log('[DEBUG] Document already loaded, initializing immediately');
    setTimeout(() => {
        if (!window.terminal) {
            console.log('[DEBUG] Creating terminal instance (fallback)');
            try {
                window.terminal = new OmegaMinerTerminal();
                console.log('[DEBUG] Terminal instance created successfully (fallback)');
                
                // Force hide cursor immediately after terminal creation
                setTimeout(() => {
                    const input = document.getElementById('commandInput');
                    if (input) {
                        input.style.caretColor = 'transparent';
                        input.style.color = 'transparent';
                        input.style.textShadow = '0 0 0 #ffffff';
                        input.style.overflow = 'visible';
                        input.style.textOverflow = 'clip';
                        console.log('[DEBUG] Applied cursor-hiding styles (fallback)');
                        
                        // Re-apply on focus/click
                        input.addEventListener('focus', () => {
                            input.style.caretColor = 'transparent';
                            input.style.color = 'transparent';
                            input.style.textShadow = '0 0 0 #ffffff';
                        });
                    }
                }, 100);
                
                // Restore saved GUI style (fallback, default to terminal)
                const savedGuiStyle = localStorage.getItem('omega-gui-style') || 'terminal';
                if (savedGuiStyle && window.OmegaCommands && window.OmegaCommands.Basic) {
                    console.log(`[DEBUG] Restoring GUI style (fallback): ${savedGuiStyle}`);
                    if (savedGuiStyle !== 'terminal') {
                        window.OmegaCommands.Basic.applyGuiStyle(savedGuiStyle);
                    }
                }
            } catch (error) {
                console.error('[ERROR] Failed to create terminal instance (fallback):', error);
            }
        }
    }, 100);
}

// Add global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    if (window.terminal && window.terminal.log) {
        window.terminal.log('⚠️ A JavaScript error occurred. Check the console for details.', 'warning');
    }
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.terminal && window.terminal.log) {
        window.terminal.log('⚠️ An unhandled promise rejection occurred. Check the console for details.', 'warning');
    }
});

console.log('🚀 OMEGA TERMINAL INIT SCRIPT COMPLETE - WAITING FOR DOM');

// Export version info for debugging
window.OmegaTerminalVersion = {
    version: OmegaConfig.VERSION,
    timestamp: new Date().toISOString(),
    modular: true,
    components: [
        'terminal-core.js',
        'wallet.js',
        'themes.js',
        'utils.js',
        'config.js',
        'commands/basic.js',
        'commands/wallet-commands.js',
        'commands/mining.js',
        'commands/network.js',
        'commands/mixer.js',
        'commands/api.js',
        'commands/entertainment.js',
        'commands/remaining.js'
    ]
}; 