/* Modern Futuristic Welcome Screen - Complete Redesign */

window.OmegaWelcomeScreen = {
    initialized: false,
    progressInterval: null,
    currentProgress: 0,
    selectedViewMode: localStorage.getItem('omega-view-mode') || 'futuristic',
    loadingSteps: [
        'INITIALIZING OMEGA PROTOCOL...',
        'ESTABLISHING SECURE CONNECTION...',
        'LOADING MULTI-CHAIN SUPPORT...',
        'PREPARING WALLET INTEGRATION...',
        'CALIBRATING AI SYSTEMS...',
        'SYSTEM READY FOR ACCESS...'
    ],
    currentStep: 0,
    
    init: function() {
        if (this.initialized) {
            console.log('[OMEGA] Welcome screen already initialized');
            return;
        }
        
        console.log('[OMEGA] Initializing modern futuristic welcome screen...');
        
        // Check if mobile and auto-select basic mode
        this.checkMobileAndSetMode();
        
        this.createWelcomeScreen();
        this.updateViewModeSelection();
        
        // Skip loading sequence - make interface selector immediately available
        setTimeout(() => {
            const interfaceOptions = document.querySelectorAll('.interface-option');
            interfaceOptions.forEach(option => {
                option.style.pointerEvents = 'auto';
                option.style.opacity = '1';
            });
            document.getElementById('omegaWelcomeScreen').classList.add('welcome-ready');
        }, 100);
        
        this.initialized = true;
    },
    
    createWelcomeScreen: function() {
        if (document.getElementById('omegaWelcomeScreen')) {
            console.log('[OMEGA] Welcome screen already exists');
            return;
        }
        
        const welcomeHTML = `
            <div class="omega-welcome-screen" id="omegaWelcomeScreen">
                <!-- Animated Background Grid -->
                <div class="welcome-bg-grid"></div>
                
                <!-- Main Content Area -->
                <div class="welcome-main-content">
                    <!-- Interface Selector -->
                    <div class="welcome-interface-selector" style="margin-top: 0;">
                        <div class="selector-header">
                            <div class="selector-title">SELECT INTERFACE</div>
                            <div class="selector-subtitle">Choose your preferred workspace</div>
                        </div>
                        
                        <div class="interface-options">
                            <button class="interface-option ${this.selectedViewMode === 'basic' ? 'interface-option-active' : ''}" id="welcomeViewBasic" onclick="window.OmegaWelcomeScreen.selectViewMode('basic')">
                                <div class="option-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M2,3H22V5H2V3M2,7H22V9H2V7M2,11H22V13H2V11M2,15H22V17H2V15M2,19H22V21H2V19Z"/>
                                    </svg>
                                </div>
                                <div class="option-content">
                                    <div class="option-title">BASIC TERMINAL</div>
                                    <div class="option-description">Clean, focused command interface</div>
                                </div>
                                <div class="option-indicator"></div>
                            </button>
                            
                            <button class="interface-option ${this.selectedViewMode === 'futuristic' ? 'interface-option-active' : ''} desktop-only-option" id="welcomeViewDashboard" onclick="window.OmegaWelcomeScreen.selectViewMode('futuristic')">
                                <div class="option-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V13Z"/>
                                    </svg>
                                </div>
                                <div class="option-content">
                                    <div class="option-title">DASHBOARD</div>
                                    <div class="option-description">Advanced multi-panel interface</div>
                                </div>
                                <div class="option-indicator"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', welcomeHTML);
        
        // Initialize color integration
        if (window.updateWelcomeScreenColors) {
            setTimeout(() => {
                window.updateWelcomeScreenColors();
            }, 100);
        }
    },
    
    startLoadingSequence: function() {
        this.currentStep = 0;
        this.currentProgress = 0;
        
        const loadingText = document.getElementById('welcomeLoadingText');
        const loadingSubText = document.getElementById('welcomeLoadingSubText');
        const progressFill = document.getElementById('welcomeProgressFill');
        const progressPercent = document.getElementById('welcomeProgressPercent');
        
        const updateStep = () => {
            if (this.currentStep < this.loadingSteps.length) {
                const step = this.loadingSteps[this.currentStep];
                loadingText.textContent = step;
                
                // Update sub-text based on step
                const subTexts = [
                    'Establishing secure connection...',
                    'Loading multi-chain support...',
                    'Preparing wallet integration...',
                    'Calibrating AI systems...',
                    'Finalizing system initialization...',
                    'Ready for user access'
                ];
                loadingSubText.textContent = subTexts[this.currentStep] || '';
                
                this.currentStep++;
            }
        };
        
        const updateProgress = () => {
            this.currentProgress += 2;
            if (this.currentProgress > 100) {
                this.currentProgress = 100;
            }
            
            progressFill.style.width = this.currentProgress + '%';
            progressPercent.textContent = this.currentProgress + '%';
            
            if (this.currentProgress >= 100) {
                clearInterval(this.progressInterval);
                setTimeout(() => {
                    this.completeLoading();
                }, 500);
            }
        };
        
        // Start the sequence
        updateStep();
        this.progressInterval = setInterval(() => {
            updateProgress();
            if (this.currentProgress % 20 === 0 && this.currentStep < this.loadingSteps.length) {
                updateStep();
            }
        }, 100);
    },
    
    completeLoading: function() {
        const loadingText = document.getElementById('welcomeLoadingText');
        const loadingSubText = document.getElementById('welcomeLoadingSubText');
        
        loadingText.textContent = 'SYSTEM READY FOR ACCESS';
        loadingSubText.textContent = 'All systems operational';
        
        // Enable interface selection
        const interfaceOptions = document.querySelectorAll('.interface-option');
        interfaceOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
        });
        
        // Add ready animation
        document.getElementById('omegaWelcomeScreen').classList.add('welcome-ready');
    },
    
    selectViewMode: function(mode) {
        this.selectedViewMode = mode;
        localStorage.setItem('omega-view-mode', mode);
        
        // Update visual selection with smooth animation
        document.querySelectorAll('.interface-option').forEach(option => {
            option.classList.remove('interface-option-active');
        });
        
        if (mode === 'basic') {
            document.getElementById('welcomeViewBasic').classList.add('interface-option-active');
        } else {
            document.getElementById('welcomeViewDashboard').classList.add('interface-option-active');
        }
        
        // Add selection feedback
        const selectedOption = document.getElementById(mode === 'basic' ? 'welcomeViewBasic' : 'welcomeViewDashboard');
        if (selectedOption) {
            selectedOption.style.transform = 'scale(1.05)';
            setTimeout(() => {
                selectedOption.style.transform = '';
            }, 200);
        }
        
        // Transition to main interface immediately
        setTimeout(() => {
            this.transitionToMainInterface();
        }, 300);
    },
    
    transitionToMainInterface: function() {
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (welcomeScreen) {
            // Ensure dashboard system is ready BEFORE starting exit animation
            if (!window.FuturisticDashboard) {
                console.log('[OMEGA] Dashboard system not ready, waiting...');
                setTimeout(() => this.transitionToMainInterface(), 100);
                return;
            }
            
            // Initialize the selected interface IMMEDIATELY
            if (this.selectedViewMode === 'basic') {
                console.log('[OMEGA] Initializing Basic Terminal mode...');
                window.FuturisticDashboard.enableBasicMode();
            } else {
                console.log('[OMEGA] Initializing Dashboard mode...');
                window.FuturisticDashboard.enableFuturisticMode();
            }
            
            // Wait for interface to be ready, then start exit animation
            setTimeout(() => {
                // Start exit animation
                welcomeScreen.classList.add('welcome-exiting');
                
                // Remove welcome screen after animation
                setTimeout(() => {
                    welcomeScreen.remove();
                    document.body.classList.add('omega-initialized');
                    
                    // Finalize interface setup
                    this.finalizeInterfaceSetup();
                }, 400);
                
            }, 100);
        }
    },
    
    finalizeInterfaceSetup: function() {
        // Ensure proper initialization
        if (window.FuturisticDashboard) {
            // Update button states
            window.FuturisticDashboard.updateViewModeButton();
            window.FuturisticDashboard.updateThemeModeButton();
            
            // Ensure proper styling
            if (this.selectedViewMode === 'basic') {
                document.body.classList.add('basic-terminal-mode');
                document.body.classList.remove('futuristic-mode');
            } else {
                document.body.classList.add('futuristic-mode');
                document.body.classList.remove('basic-terminal-mode');
            }
            
            // Initialize terminal if available
            if (window.terminal) {
                setTimeout(() => {
                    window.terminal.log(`✅ ${this.selectedViewMode === 'basic' ? 'Basic Terminal' : 'Dashboard'} mode initialized successfully`, 'success');
                }, 100);
            }
        }
        
        console.log(`[OMEGA] Interface transition complete: ${this.selectedViewMode} mode`);
    },
    
    updateViewModeSelection: function() {
        // This will be handled by the new interface selector
    },
    
    checkMobileAndSetMode: function() {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768 || 
                        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
        
        if (isMobile) {
            console.log('[OMEGA] Mobile device detected - Auto-selecting Basic Terminal mode');
            this.selectedViewMode = 'basic';
            localStorage.setItem('omega-view-mode', 'basic');
            localStorage.setItem('omega-mobile-mode', 'true');
        }
    },
    
    skipToTerminal: function() {
        console.log('[OMEGA] Skipping welcome screen to terminal');
        
        // Force basic mode for mobile
        if (window.MobileBasicMode && window.MobileBasicMode.isMobileMode()) {
            this.selectedViewMode = 'basic';
            localStorage.setItem('omega-view-mode', 'basic');
        }
        
        // Hide welcome screen
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('welcome-exiting');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 300);
        }
        
        // Show terminal immediately
        this.transitionToInterface();
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.OmegaWelcomeScreen.init();
    });
} else {
    window.OmegaWelcomeScreen.init();
}
