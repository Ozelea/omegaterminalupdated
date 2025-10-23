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
        
        this.createWelcomeScreen();
        this.updateViewModeSelection();
        this.startLoadingSequence();
        
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
                
                <!-- Top Status Bar -->
                <div class="welcome-top-bar">
                    <div class="welcome-system-info">
                        <div class="welcome-status-indicator">
                            <div class="status-dot"></div>
                            <span class="status-text">OMEGA NETWORK</span>
                        </div>
                        <div class="welcome-version-badge">v2.0.1</div>
                    </div>
                    <div class="welcome-security-badge">
                        <svg class="security-icon" viewBox="0 0 24 24">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.6C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
                        </svg>
                        <span>CLASSIFIED ACCESS</span>
                    </div>
                </div>
                
                <!-- Main Content Area -->
                <div class="welcome-main-content">
                    <!-- Logo Section -->
                    <div class="welcome-logo-section">
                        <div class="welcome-logo-container">
                            <div class="welcome-brand-text">OMEGA</div>
                            <div class="welcome-brand-subtitle">TERMINAL</div>
                        </div>
                        <div class="welcome-tagline">ADVANCED MULTI-CHAIN INTERFACE</div>
                    </div>
                    
                    <!-- Loading Section -->
                    <div class="welcome-loading-section">
                        <div class="welcome-loading-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                        
                        <div class="welcome-loading-text">
                            <div class="loading-main-text" id="welcomeLoadingText">INITIALIZING OMEGA PROTOCOL...</div>
                            <div class="loading-sub-text" id="welcomeLoadingSubText">Establishing secure connection...</div>
                        </div>
                        
                        <div class="welcome-progress-container">
                            <div class="progress-track">
                                <div class="progress-fill" id="welcomeProgressFill"></div>
                            </div>
                            <div class="progress-percentage" id="welcomeProgressPercent">0%</div>
                        </div>
                    </div>
                    
                    <!-- System Status Grid -->
                    <div class="welcome-system-grid">
                        <div class="system-status-card">
                            <div class="status-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                                </svg>
                            </div>
                            <div class="status-content">
                                <div class="status-title">SECURITY</div>
                                <div class="status-value">LEVEL OMEGA</div>
                            </div>
                        </div>
                        
                        <div class="system-status-card">
                            <div class="status-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                                </svg>
                            </div>
                            <div class="status-content">
                                <div class="status-title">NETWORKS</div>
                                <div class="status-value">MULTI-CHAIN</div>
                            </div>
                        </div>
                        
                        <div class="system-status-card">
                            <div class="status-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                                </svg>
                            </div>
                            <div class="status-content">
                                <div class="status-title">WALLET</div>
                                <div class="status-value">READY</div>
                            </div>
                        </div>
                        
                        <div class="system-status-card">
                            <div class="status-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                                </svg>
                            </div>
                            <div class="status-content">
                                <div class="status-title">AI</div>
                                <div class="status-value">ACTIVE</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Interface Selector -->
                    <div class="welcome-interface-selector">
                        <div class="selector-header">
                            <div class="selector-title">SELECT INTERFACE</div>
                            <div class="selector-subtitle">Choose your preferred workspace</div>
                        </div>
                        
                        <div class="interface-options">
                            <button class="interface-option" id="welcomeViewBasic" onclick="window.OmegaWelcomeScreen.selectViewMode('basic')">
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
                            
                            <button class="interface-option interface-option-active" id="welcomeViewDashboard" onclick="window.OmegaWelcomeScreen.selectViewMode('futuristic')">
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
                
                <!-- Bottom Status -->
                <div class="welcome-bottom-status">
                    <div class="bottom-status-text">OMEGA PROTOCOL v2.0.1 - SYSTEM READY</div>
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
        
        // Update loading text to show transition
        const loadingText = document.getElementById('welcomeLoadingText');
        const loadingSubText = document.getElementById('welcomeLoadingSubText');
        if (loadingText && loadingSubText) {
            loadingText.textContent = 'PREPARING INTERFACE...';
            loadingSubText.textContent = `Initializing ${mode === 'basic' ? 'Basic Terminal' : 'Dashboard'} mode...`;
        }
        
        // Transition to main interface with better timing
        setTimeout(() => {
            this.transitionToMainInterface();
        }, 500);
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
