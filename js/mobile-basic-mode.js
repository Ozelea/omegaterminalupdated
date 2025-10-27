/* Mobile Basic Mode - Force Basic Terminal for Mobile Devices */

window.MobileBasicMode = {
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    
    init: function() {
        this.detectDevice();
        this.applyMobileBasicMode();
        this.setupMobileOptimizations();
        console.log('[OMEGA] Mobile Basic Mode initialized - Device:', this.getDeviceType());
    },
    
    detectDevice: function() {
        const userAgent = navigator.userAgent.toLowerCase();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Mobile detection
        this.isMobile = (
            /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
            screenWidth <= 768 ||
            (screenWidth <= 1024 && screenHeight <= 768 && 'ontouchstart' in window)
        );
        
        // Tablet detection
        this.isTablet = (
            /ipad|android(?!.*mobile)|tablet/i.test(userAgent) ||
            (screenWidth > 768 && screenWidth <= 1024 && 'ontouchstart' in window)
        );
        
        // Desktop detection
        this.isDesktop = !this.isMobile && !this.isTablet;
        
        // Store in localStorage for persistence
        localStorage.setItem('omega-device-type', this.getDeviceType());
    },
    
    getDeviceType: function() {
        if (this.isMobile) return 'mobile';
        if (this.isTablet) return 'tablet';
        return 'desktop';
    },
    
    applyMobileBasicMode: function() {
        if (this.isMobile) {
            console.log('[OMEGA] Mobile detected - Forcing basic terminal mode');
            
            // Force basic terminal mode
            this.forceBasicMode();
            
            // Hide complex UI elements
            this.hideComplexFeatures();
            
            // Apply mobile-specific styles
            this.applyMobileStyles();
            
            // Fix welcome screen for mobile
            this.fixWelcomeScreenMobile();
            
            // Set mobile flag in localStorage
            localStorage.setItem('omega-mobile-mode', 'true');
            localStorage.setItem('omega-view-mode', 'basic');
            
        } else {
            // Remove mobile mode if not mobile
            localStorage.removeItem('omega-mobile-mode');
        }
    },
    
    forceBasicMode: function() {
        // Add mobile basic mode class to body
        document.body.classList.add('mobile-basic-mode');
        document.body.classList.add('basic-terminal-mode');
        
        // Force basic terminal view
        if (window.OmegaTerminal && window.OmegaTerminal.setViewMode) {
            window.OmegaTerminal.setViewMode('basic');
        }
        
        // Hide futuristic dashboard
        const dashboard = document.querySelector('.omega-dashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
        }
        
        // Show basic terminal
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.style.display = 'block';
            terminal.classList.add('mobile-optimized');
        }
    },
    
    hideComplexFeatures: function() {
        // Hide sidebar and stats panels
        const sidebar = document.querySelector('.omega-sidebar');
        const stats = document.querySelector('.omega-stats');
        
        if (sidebar) sidebar.style.display = 'none';
        if (stats) stats.style.display = 'none';
        
        // Hide view mode toggle buttons
        const viewToggles = document.querySelectorAll(
            '#view-mode-toggle-btn, #view-toggle-btn, #basic-mode-toggle, .view-mode-toggle'
        );
        viewToggles.forEach(toggle => {
            toggle.style.display = 'none';
            toggle.style.visibility = 'hidden';
        });
        
        // Hide complex theme selectors
        const themeSelectors = document.querySelectorAll('.theme-selector, #theme-menu');
        themeSelectors.forEach(selector => {
            selector.style.display = 'none';
        });
        
        // Hide AI mode button on mobile
        const aiModeBtn = document.getElementById('ai-mode-btn');
        if (aiModeBtn) {
            aiModeBtn.style.display = 'none';
        }
        
        // Hide complex navigation
        const complexNav = document.querySelectorAll('.complex-nav, .advanced-controls');
        complexNav.forEach(nav => {
            nav.style.display = 'none';
        });
    },
    
    applyMobileStyles: function() {
        // Add mobile-specific CSS
        const mobileStyles = `
            <style id="mobile-basic-styles">
                .mobile-basic-mode #terminal {
                    width: 100vw !important;
                    height: 100vh !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                    border-radius: 0 !important;
                    background: #000 !important;
                    color: #00ff00 !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                .mobile-basic-mode .terminal-output {
                    padding: 10px !important;
                    font-size: 14px !important;
                    line-height: 1.4 !important;
                    max-height: calc(100vh - 80px) !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    word-wrap: break-word !important;
                }
                
                .mobile-basic-mode .input-container {
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    padding: 10px !important;
                    background: rgba(0, 0, 0, 0.9) !important;
                    border-top: 1px solid #00ff00 !important;
                }
                
                .mobile-basic-mode #user-input {
                    width: 100% !important;
                    font-size: 16px !important;
                    padding: 12px !important;
                    background: #000 !important;
                    color: #00ff00 !important;
                    border: 1px solid #00ff00 !important;
                    border-radius: 4px !important;
                    font-family: 'Courier New', monospace !important;
                }
                
                .mobile-basic-mode .prompt {
                    color: #00ff00 !important;
                    font-weight: bold !important;
                }
                
                /* Hide all non-essential elements */
                .mobile-basic-mode .omega-dashboard,
                .mobile-basic-mode .omega-sidebar,
                .mobile-basic-mode .omega-stats,
                .mobile-basic-mode .theme-selector,
                .mobile-basic-mode #view-mode-toggle-btn,
                .mobile-basic-mode #view-toggle-btn,
                .mobile-basic-mode #basic-mode-toggle,
                .mobile-basic-mode .view-mode-toggle,
                .mobile-basic-mode #ai-mode-btn,
                .mobile-basic-mode .complex-nav,
                .mobile-basic-mode .advanced-controls {
                    display: none !important;
                    visibility: hidden !important;
                }
                
                /* Mobile terminal header */
                .mobile-basic-mode .terminal-header {
                    background: #000 !important;
                    color: #00ff00 !important;
                    padding: 10px !important;
                    text-align: center !important;
                    border-bottom: 1px solid #00ff00 !important;
                    font-size: 14px !important;
                }
                
                /* Mobile-friendly buttons */
                .mobile-basic-mode button {
                    min-height: 44px !important;
                    min-width: 44px !important;
                    padding: 10px 16px !important;
                    font-size: 14px !important;
                    background: #000 !important;
                    color: #00ff00 !important;
                    border: 1px solid #00ff00 !important;
                    border-radius: 4px !important;
                }
                
                /* Mobile scrollbar */
                .mobile-basic-mode ::-webkit-scrollbar {
                    width: 6px !important;
                }
                
                .mobile-basic-mode ::-webkit-scrollbar-thumb {
                    background: #00ff00 !important;
                    border-radius: 3px !important;
                }
                
                .mobile-basic-mode ::-webkit-scrollbar-track {
                    background: #000 !important;
                }
            </style>
        `;
        
        // Remove existing mobile styles if any
        const existingStyles = document.getElementById('mobile-basic-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // Add new mobile styles
        document.head.insertAdjacentHTML('beforeend', mobileStyles);
    },
    
    setupMobileOptimizations: function() {
        if (this.isMobile) {
            // Prevent zoom on input focus
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });
            
            // Handle virtual keyboard
            this.handleVirtualKeyboard();
            
            // Add touch optimizations
            this.addTouchOptimizations();
        }
    },
    
    handleVirtualKeyboard: function() {
        let initialHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = initialHeight - currentHeight;
            
            if (heightDiff > 150) {
                // Keyboard is open
                document.body.classList.add('keyboard-open');
                const output = document.querySelector('.terminal-output');
                if (output) {
                    output.style.maxHeight = 'calc(50vh - 60px)';
                }
            } else {
                // Keyboard is closed
                document.body.classList.remove('keyboard-open');
                const output = document.querySelector('.terminal-output');
                if (output) {
                    output.style.maxHeight = 'calc(100vh - 80px)';
                }
            }
        });
    },
    
    addTouchOptimizations: function() {
        // Add touch event support
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'INPUT') {
                e.target.focus();
            }
        });
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    },
    
    fixWelcomeScreenMobile: function() {
        // Ensure welcome screen is scrollable on mobile
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.overflowY = 'auto';
            welcomeScreen.style.overflowX = 'hidden';
            welcomeScreen.style.webkitOverflowScrolling = 'touch';
            welcomeScreen.style.height = '100vh';
            welcomeScreen.style.maxHeight = '100vh';
            
            // Add mobile class for additional styling
            welcomeScreen.classList.add('mobile-welcome-screen');
        }
        
        // Ensure main content is scrollable
        const mainContent = document.querySelector('.welcome-main-content');
        if (mainContent) {
            mainContent.style.overflowY = 'auto';
            mainContent.style.flex = '1';
            mainContent.style.minHeight = 'auto';
        }
        
        // Hide Dashboard option and auto-select Basic Terminal on mobile
        this.configureMobileWelcomeInterface();
        
        // Add skip welcome button for mobile users
        this.addSkipWelcomeButton();
    },
    
    addSkipWelcomeButton: function() {
        // Check if skip button already exists
        if (document.getElementById('mobile-skip-welcome')) {
            return;
        }
        
        // Create skip welcome button
        const skipButton = document.createElement('button');
        skipButton.id = 'mobile-skip-welcome';
        skipButton.innerHTML = 'Skip to Terminal';
        skipButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            background: rgba(0, 255, 0, 0.2);
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            cursor: pointer;
            backdrop-filter: blur(10px);
        `;
        
        // Add click handler
        skipButton.addEventListener('click', function() {
            // Skip welcome screen and go directly to terminal
            if (window.OmegaWelcomeScreen && window.OmegaWelcomeScreen.skipToTerminal) {
                window.OmegaWelcomeScreen.skipToTerminal();
            } else {
                // Fallback: hide welcome screen and show terminal
                const welcomeScreen = document.getElementById('omegaWelcomeScreen');
                if (welcomeScreen) {
                    welcomeScreen.style.display = 'none';
                }
                
                // Show terminal
                const terminal = document.getElementById('terminal');
                if (terminal) {
                    terminal.style.display = 'block';
                }
                
                // Add initialized class
                document.body.classList.add('omega-initialized');
            }
        });
        
        // Add to welcome screen
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.appendChild(skipButton);
        }
    },
    
    configureMobileWelcomeInterface: function() {
        // Hide Dashboard option on mobile
        const dashboardOption = document.getElementById('welcomeViewDashboard');
        if (dashboardOption) {
            dashboardOption.style.display = 'none';
            dashboardOption.style.visibility = 'hidden';
        }
        
        // Auto-select Basic Terminal option
        const basicOption = document.getElementById('welcomeViewBasic');
        if (basicOption) {
            // Remove active class from dashboard option
            const dashboardBtn = document.getElementById('welcomeViewDashboard');
            if (dashboardBtn) {
                dashboardBtn.classList.remove('interface-option-active');
            }
            
            // Add active class to basic option
            basicOption.classList.add('interface-option-active');
            
            // Update the selected view mode
            if (window.OmegaWelcomeScreen) {
                window.OmegaWelcomeScreen.selectedViewMode = 'basic';
            }
        }
        
        // Update interface selector title for mobile
        const selectorTitle = document.querySelector('.selector-title');
        if (selectorTitle) {
            selectorTitle.textContent = 'MOBILE OPTIMIZED INTERFACE';
        }
        
        const selectorSubtitle = document.querySelector('.selector-subtitle');
        if (selectorSubtitle) {
            selectorSubtitle.textContent = 'Basic Terminal mode selected for optimal mobile experience';
        }
    },
    
    // Public method to check if mobile mode is active
    isMobileMode: function() {
        return this.isMobile;
    },
    
    // Public method to get device info
    getDeviceInfo: function() {
        return {
            type: this.getDeviceType(),
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent
        };
    }
};

// Initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.MobileBasicMode.init();
    });
} else {
    window.MobileBasicMode.init();
}

// Also initialize after a short delay to ensure all other scripts are loaded
setTimeout(() => {
    window.MobileBasicMode.init();
}, 100);
