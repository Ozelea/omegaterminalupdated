/**
 * Modern Welcome Screen Color Integration
 * Complete redesign with enhanced color palette integration
 */

(function() {
    'use strict';
    
    console.log('[Modern Welcome Screen] Color integration initializing...');
    
    // Function to update all welcome screen colors
    function updateWelcomeScreenColors() {
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (!welcomeScreen) {
            console.log('[Modern Welcome Screen] Welcome screen not found');
            return;
        }
        
        console.log('[Modern Welcome Screen] Updating colors...');
        
        // Get current color palette values
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--palette-primary').trim() || '#00d4ff';
        const primaryGlow = computedStyle.getPropertyValue('--palette-primary-glow').trim() || 'rgba(0, 212, 255, 0.4)';
        const secondaryColor = computedStyle.getPropertyValue('--palette-secondary').trim() || '#ff00ff';
        const textPrimary = computedStyle.getPropertyValue('--palette-text-primary').trim() || '#00d4ff';
        const textSecondary = computedStyle.getPropertyValue('--palette-text-secondary').trim() || 'rgba(0, 212, 255, 0.6)';
        const bgPrimary = computedStyle.getPropertyValue('--palette-bg-primary').trim() || '#0a0a0f';
        const bgOverlay = computedStyle.getPropertyValue('--palette-bg-overlay').trim() || 'rgba(0, 212, 255, 0.05)';
        const bgHover = computedStyle.getPropertyValue('--palette-bg-hover').trim() || 'rgba(0, 212, 255, 0.1)';
        const borderColor = computedStyle.getPropertyValue('--palette-border').trim() || 'rgba(0, 212, 255, 0.1)';
        const accentColor = computedStyle.getPropertyValue('--palette-accent').trim() || '#00ff88';
        
        // Update background
        welcomeScreen.style.setProperty('background', bgPrimary, 'important');
        
        // Update grid background
        welcomeScreen.style.setProperty('--grid-color', primaryColor, 'important');
        
        // Update top bar elements
        updateTopBarColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, borderColor, accentColor);
        
        // Update logo section
        updateLogoSectionColors(primaryColor, primaryGlow, textPrimary, textSecondary);
        
        // Update loading section
        updateLoadingSectionColors(primaryColor, primaryGlow, secondaryColor, textPrimary, textSecondary, accentColor);
        
        // Update system status grid
        updateSystemStatusColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, borderColor);
        
        // Update interface selector
        updateInterfaceSelectorColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, bgHover, borderColor);
        
        // Update bottom status
        updateBottomStatusColors(textSecondary);
        
        console.log('[Modern Welcome Screen] Colors updated successfully');
        console.log('[Modern Welcome Screen] Primary:', primaryColor);
        console.log('[Modern Welcome Screen] Glow:', primaryGlow);
    }
    
    // Update top bar colors
    function updateTopBarColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, borderColor, accentColor) {
        const topBar = document.querySelector('.welcome-top-bar');
        if (topBar) {
            topBar.style.setProperty('border-bottom-color', borderColor, 'important');
        }
        
        // Status indicator
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.style.setProperty('color', textPrimary, 'important');
        }
        
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.setProperty('background', accentColor, 'important');
        }
        
        // Version badge
        const versionBadge = document.querySelector('.welcome-version-badge');
        if (versionBadge) {
            versionBadge.style.setProperty('background', bgOverlay, 'important');
            versionBadge.style.setProperty('border-color', primaryColor, 'important');
            versionBadge.style.setProperty('color', primaryColor, 'important');
        }
        
        // Security badge
        const securityBadge = document.querySelector('.welcome-security-badge');
        if (securityBadge) {
            securityBadge.style.setProperty('background', bgOverlay, 'important');
            securityBadge.style.setProperty('border-color', primaryColor, 'important');
            securityBadge.style.setProperty('color', primaryColor, 'important');
        }
    }
    
    // Update logo section colors
    function updateLogoSectionColors(primaryColor, primaryGlow, textPrimary, textSecondary) {
        const brandText = document.querySelector('.welcome-brand-text');
        if (brandText) {
            brandText.style.setProperty('color', textPrimary, 'important');
            brandText.style.setProperty('text-shadow', `0 0 20px ${primaryGlow}`, 'important');
        }
        
        const brandSubtitle = document.querySelector('.welcome-brand-subtitle');
        if (brandSubtitle) {
            brandSubtitle.style.setProperty('color', textSecondary, 'important');
        }
        
        const tagline = document.querySelector('.welcome-tagline');
        if (tagline) {
            tagline.style.setProperty('color', textSecondary, 'important');
        }
    }
    
    // Update loading section colors
    function updateLoadingSectionColors(primaryColor, primaryGlow, secondaryColor, textPrimary, textSecondary, accentColor) {
        // Spinner rings
        const spinnerRings = document.querySelectorAll('.spinner-ring');
        if (spinnerRings.length >= 3) {
            spinnerRings[0].style.setProperty('border-top-color', primaryColor, 'important');
            spinnerRings[1].style.setProperty('border-top-color', secondaryColor, 'important');
            spinnerRings[2].style.setProperty('border-top-color', accentColor, 'important');
        }
        
        // Loading text
        const loadingMainText = document.querySelector('.loading-main-text');
        if (loadingMainText) {
            loadingMainText.style.setProperty('color', textPrimary, 'important');
            loadingMainText.style.setProperty('text-shadow', `0 0 10px ${primaryGlow}`, 'important');
        }
        
        const loadingSubText = document.querySelector('.loading-sub-text');
        if (loadingSubText) {
            loadingSubText.style.setProperty('color', textSecondary, 'important');
        }
        
        // Progress elements
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.setProperty('background', `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, 'important');
            progressFill.style.setProperty('box-shadow', `0 0 10px ${primaryGlow}`, 'important');
        }
        
        const progressPercent = document.querySelector('.progress-percentage');
        if (progressPercent) {
            progressPercent.style.setProperty('color', textPrimary, 'important');
        }
    }
    
    // Update system status colors
    function updateSystemStatusColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, borderColor) {
        const statusCards = document.querySelectorAll('.system-status-card');
        statusCards.forEach(card => {
            card.style.setProperty('background', bgOverlay, 'important');
            card.style.setProperty('border-color', borderColor, 'important');
        });
        
        const statusIcons = document.querySelectorAll('.status-icon');
        statusIcons.forEach(icon => {
            icon.style.setProperty('color', primaryColor, 'important');
        });
        
        const statusTitles = document.querySelectorAll('.status-title');
        statusTitles.forEach(title => {
            title.style.setProperty('color', textSecondary, 'important');
        });
        
        const statusValues = document.querySelectorAll('.status-value');
        statusValues.forEach(value => {
            value.style.setProperty('color', textPrimary, 'important');
        });
    }
    
    // Update interface selector colors
    function updateInterfaceSelectorColors(primaryColor, primaryGlow, textPrimary, textSecondary, bgOverlay, bgHover, borderColor) {
        const selectorTitle = document.querySelector('.selector-title');
        if (selectorTitle) {
            selectorTitle.style.setProperty('color', textPrimary, 'important');
            selectorTitle.style.setProperty('text-shadow', `0 0 10px ${primaryGlow}`, 'important');
        }
        
        const selectorSubtitle = document.querySelector('.selector-subtitle');
        if (selectorSubtitle) {
            selectorSubtitle.style.setProperty('color', textSecondary, 'important');
        }
        
        const interfaceOptions = document.querySelectorAll('.interface-option');
        interfaceOptions.forEach(option => {
            option.style.setProperty('background', bgOverlay, 'important');
            option.style.setProperty('border-color', borderColor, 'important');
            
            const icon = option.querySelector('.option-icon');
            if (icon) {
                icon.style.setProperty('color', textSecondary, 'important');
            }
            
            const title = option.querySelector('.option-title');
            if (title) {
                title.style.setProperty('color', textSecondary, 'important');
            }
            
            const description = option.querySelector('.option-description');
            if (description) {
                description.style.setProperty('color', textSecondary, 'important');
            }
        });
        
        // Update active option
        const activeOption = document.querySelector('.interface-option-active');
        if (activeOption) {
            activeOption.style.setProperty('background', bgHover, 'important');
            activeOption.style.setProperty('border-color', primaryColor, 'important');
            activeOption.style.setProperty('box-shadow', `0 0 20px ${primaryGlow}, inset 0 0 20px ${primaryGlow}`, 'important');
            
            const activeIcon = activeOption.querySelector('.option-icon');
            if (activeIcon) {
                activeIcon.style.setProperty('color', primaryColor, 'important');
            }
            
            const activeTitle = activeOption.querySelector('.option-title');
            if (activeTitle) {
                activeTitle.style.setProperty('color', textPrimary, 'important');
            }
            
            const activeIndicator = activeOption.querySelector('.option-indicator');
            if (activeIndicator) {
                activeIndicator.style.setProperty('background', primaryColor, 'important');
                activeIndicator.style.setProperty('box-shadow', `0 0 10px ${primaryGlow}`, 'important');
            }
        }
    }
    
    // Update bottom status colors
    function updateBottomStatusColors(textSecondary) {
        const bottomStatus = document.querySelector('.welcome-bottom-status');
        if (bottomStatus) {
            bottomStatus.style.setProperty('border-top-color', borderColor, 'important');
        }
        
        const bottomStatusText = document.querySelector('.bottom-status-text');
        if (bottomStatusText) {
            bottomStatusText.style.setProperty('color', textSecondary, 'important');
        }
    }
    
    // Add hover effects for interface options
    function addInterfaceHoverEffects() {
        const interfaceOptions = document.querySelectorAll('.interface-option');
        interfaceOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('interface-option-active')) {
                    const computedStyle = getComputedStyle(document.documentElement);
                    const primaryColor = computedStyle.getPropertyValue('--palette-primary').trim() || '#00d4ff';
                    const primaryGlow = computedStyle.getPropertyValue('--palette-primary-glow').trim() || 'rgba(0, 212, 255, 0.4)';
                    const bgHover = computedStyle.getPropertyValue('--palette-bg-hover').trim() || 'rgba(0, 212, 255, 0.1)';
                    
                    option.style.setProperty('border-color', primaryColor, 'important');
                    option.style.setProperty('box-shadow', `0 0 20px ${primaryGlow}`, 'important');
                    option.style.setProperty('background', bgHover, 'important');
                    
                    const icon = option.querySelector('.option-icon');
                    if (icon) {
                        icon.style.setProperty('color', primaryColor, 'important');
                    }
                    
                    const title = option.querySelector('.option-title');
                    if (title) {
                        title.style.setProperty('color', primaryColor, 'important');
                    }
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('interface-option-active')) {
                    const computedStyle = getComputedStyle(document.documentElement);
                    const bgOverlay = computedStyle.getPropertyValue('--palette-bg-overlay').trim() || 'rgba(0, 212, 255, 0.05)';
                    const borderColor = computedStyle.getPropertyValue('--palette-border').trim() || 'rgba(0, 212, 255, 0.1)';
                    const textSecondary = computedStyle.getPropertyValue('--palette-text-secondary').trim() || 'rgba(0, 212, 255, 0.6)';
                    
                    option.style.setProperty('background', bgOverlay, 'important');
                    option.style.setProperty('border-color', borderColor, 'important');
                    option.style.setProperty('box-shadow', 'none', 'important');
                    
                    const icon = option.querySelector('.option-icon');
                    if (icon) {
                        icon.style.setProperty('color', textSecondary, 'important');
                    }
                    
                    const title = option.querySelector('.option-title');
                    if (title) {
                        title.style.setProperty('color', textSecondary, 'important');
                    }
                }
            });
        });
    }
    
    // Initialize the color integration system
    function initialize() {
        // Update colors immediately
        updateWelcomeScreenColors();
        addInterfaceHoverEffects();
        
        // Update colors when welcome screen is created
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.id === 'omegaWelcomeScreen') {
                            setTimeout(() => {
                                updateWelcomeScreenColors();
                                addInterfaceHoverEffects();
                            }, 100);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Update colors when color palette changes
        const colorObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                    console.log('[Modern Welcome Screen] Color change detected, updating...');
                    setTimeout(() => {
                        updateWelcomeScreenColors();
                    }, 100);
                }
            });
        });
        
        colorObserver.observe(document.body, { attributes: true });
        
        // Listen for custom color change events
        document.addEventListener('colorPaletteChanged', () => {
            console.log('[Modern Welcome Screen] Custom color change event detected');
            setTimeout(() => {
                updateWelcomeScreenColors();
            }, 100);
        });
        
        // Force update every 2 seconds to ensure colors stay in sync
        setInterval(() => {
            const welcomeScreen = document.getElementById('omegaWelcomeScreen');
            if (welcomeScreen) {
                updateWelcomeScreenColors();
            }
        }, 2000);
        
        console.log('[Modern Welcome Screen] Color integration initialized successfully');
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Export function for external use
    window.updateWelcomeScreenColors = updateWelcomeScreenColors;
    
})();

