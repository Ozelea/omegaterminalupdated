/**
 * Welcome Screen Color Integration
 * Ensures welcome screen colors update with color palette changes
 */

(function() {
    'use strict';
    
    console.log('[Welcome Screen Color Integration] Initializing...');
    
    // Function to update welcome screen colors
    function updateWelcomeScreenColors() {
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (!welcomeScreen) {
            console.log('[Welcome Screen Color Integration] Welcome screen not found');
            return;
        }
        
        console.log('[Welcome Screen Color Integration] Updating colors...');
        
        // Get current color palette values
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--palette-primary').trim() || '#00d4ff';
        const primaryGlow = computedStyle.getPropertyValue('--palette-primary-glow').trim() || 'rgba(0, 212, 255, 0.4)';
        const textPrimary = computedStyle.getPropertyValue('--palette-text-primary').trim() || '#00d4ff';
        const textSecondary = computedStyle.getPropertyValue('--palette-text-secondary').trim() || 'rgba(0, 212, 255, 0.6)';
        const bgPrimary = computedStyle.getPropertyValue('--palette-bg-primary').trim() || '#0a0a0a';
        const bgOverlay = computedStyle.getPropertyValue('--palette-bg-overlay').trim() || 'rgba(15, 15, 26, 0.6)';
        const bgHover = computedStyle.getPropertyValue('--palette-bg-hover').trim() || 'rgba(15, 15, 26, 0.8)';
        const borderColor = computedStyle.getPropertyValue('--palette-border').trim() || 'rgba(0, 212, 255, 0.15)';
        const accentColor = computedStyle.getPropertyValue('--palette-accent').trim() || '#00ff88';
        const primaryLight = computedStyle.getPropertyValue('--palette-primary-light').trim() || '#33ddff';
        
        // Update background
        welcomeScreen.style.setProperty('background', bgPrimary, 'important');
        
        // Update grid background - use CSS custom property
        welcomeScreen.style.setProperty('--grid-color', primaryColor, 'important');
        
        // Force grid update by temporarily changing a property
        const currentOpacity = welcomeScreen.style.opacity || '1';
        welcomeScreen.style.setProperty('opacity', '0.999', 'important');
        setTimeout(() => {
            welcomeScreen.style.setProperty('opacity', currentOpacity, 'important');
        }, 10);
        
        // Update logo colors
        const logo = welcomeScreen.querySelector('.welcome-omega-logo, .welcome-omega-logo-fallback');
        if (logo) {
            logo.style.setProperty('fill', primaryColor, 'important');
            logo.style.setProperty('filter', `drop-shadow(0 0 20px ${primaryGlow})`, 'important');
        }
        
        // Update brand text
        const brandText = welcomeScreen.querySelector('.welcome-brand-text');
        if (brandText) {
            brandText.style.setProperty('color', '#ffffff', 'important');
            brandText.style.setProperty('text-shadow', '0 0 10px rgba(255, 255, 255, 0.5)', 'important');
        }
        
        // Update version text
        const versionText = welcomeScreen.querySelector('.welcome-version');
        if (versionText) {
            versionText.style.setProperty('color', textPrimary, 'important');
            versionText.style.setProperty('text-shadow', `0 0 5px ${primaryGlow}`, 'important');
            console.log('[Welcome Screen Color Integration] Updated version text color to:', textPrimary);
        }
        
        // Update spinner
        const spinner = welcomeScreen.querySelector('.welcome-spinner');
        if (spinner) {
            spinner.style.setProperty('border-color', `${primaryColor}20`, 'important');
            spinner.style.setProperty('border-top-color', primaryColor, 'important');
            spinner.style.setProperty('box-shadow', `0 0 15px ${primaryGlow}`, 'important');
        }
        
        // Update status text
        const statusText = welcomeScreen.querySelector('.welcome-status');
        if (statusText) {
            statusText.style.setProperty('color', textPrimary, 'important');
            statusText.style.setProperty('text-shadow', `0 0 10px ${primaryGlow}`, 'important');
            console.log('[Welcome Screen Color Integration] Updated status text color to:', textPrimary);
        }
        
        // Update sub status
        const subStatus = welcomeScreen.querySelector('.welcome-sub-status');
        if (subStatus) {
            subStatus.style.setProperty('color', textPrimary, 'important');
            subStatus.style.setProperty('text-shadow', `0 0 5px ${primaryGlow}`, 'important');
            console.log('[Welcome Screen Color Integration] Updated sub status text color to:', textPrimary);
        }
        
        // Update progress bar
        const progressBar = welcomeScreen.querySelector('.welcome-progress-bar');
        if (progressBar) {
            progressBar.style.setProperty('background', `linear-gradient(90deg, ${primaryColor}, ${primaryLight})`, 'important');
            progressBar.style.setProperty('box-shadow', `0 0 10px ${primaryGlow}`, 'important');
        }
        
        // Update progress bar background
        const progressBg = welcomeScreen.querySelector('.welcome-progress');
        if (progressBg) {
            progressBg.style.setProperty('background', `${primaryColor}20`, 'important');
        }
        
        // Update security badge
        const securityBadge = welcomeScreen.querySelector('.welcome-security-badge');
        if (securityBadge) {
            securityBadge.style.setProperty('background', `${primaryColor}1a`, 'important');
            securityBadge.style.setProperty('border-color', primaryColor, 'important');
            securityBadge.style.setProperty('color', primaryColor, 'important');
            securityBadge.style.setProperty('box-shadow', `0 0 5px ${primaryGlow}`, 'important');
        }
        
        // Update status items
        const statusItems = welcomeScreen.querySelectorAll('.welcome-status-item');
        statusItems.forEach(item => {
            item.style.setProperty('color', textSecondary, 'important');
            item.style.setProperty('text-shadow', `0 0 5px ${primaryGlow}`, 'important');
        });
        
        // Update status dots
        const statusDots = welcomeScreen.querySelectorAll('.welcome-status-dot');
        statusDots.forEach(dot => {
            dot.style.setProperty('background', accentColor, 'important');
        });
        
        // Update selector title
        const selectorTitle = welcomeScreen.querySelector('.welcome-selector-title');
        if (selectorTitle) {
            selectorTitle.style.setProperty('color', primaryColor, 'important');
            selectorTitle.style.setProperty('text-shadow', `0 0 5px ${primaryGlow}`, 'important');
            console.log('[Welcome Screen Color Integration] Updated selector title color to:', primaryColor);
        }
        
        // Update view options
        const viewOptions = welcomeScreen.querySelectorAll('.welcome-view-option');
        console.log('[Welcome Screen Color Integration] Found', viewOptions.length, 'view options');
        viewOptions.forEach((option, index) => {
            option.style.setProperty('background', bgOverlay, 'important');
            option.style.setProperty('border-color', borderColor, 'important');
            console.log(`[Welcome Screen Color Integration] Updated option ${index + 1} border to:`, borderColor);
            
            // Update SVG icons
            const svg = option.querySelector('svg');
            if (svg) {
                svg.style.setProperty('color', textSecondary, 'important');
            }
            
            // Update titles
            const title = option.querySelector('.view-option-title');
            if (title) {
                title.style.setProperty('color', textSecondary, 'important');
                console.log(`[Welcome Screen Color Integration] Updated option ${index + 1} title to:`, textSecondary);
            }
            
            // Update descriptions
            const desc = option.querySelector('.view-option-desc');
            if (desc) {
                desc.style.setProperty('color', textSecondary, 'important');
                desc.style.setProperty('opacity', '0.7', 'important');
            }
        });
        
        // Update active view option
        const activeOption = welcomeScreen.querySelector('.welcome-view-option-active');
        if (activeOption) {
            activeOption.style.setProperty('background', bgHover, 'important');
            activeOption.style.setProperty('border-color', primaryColor, 'important');
            activeOption.style.setProperty('box-shadow', `0 0 20px ${primaryGlow}, inset 0 0 12px ${primaryGlow}`, 'important');
            console.log('[Welcome Screen Color Integration] Updated active option border to:', primaryColor);
            
            const activeSvg = activeOption.querySelector('svg');
            if (activeSvg) {
                activeSvg.style.setProperty('color', primaryColor, 'important');
            }
            
            const activeTitle = activeOption.querySelector('.view-option-title');
            if (activeTitle) {
                activeTitle.style.setProperty('color', primaryLight, 'important');
                console.log('[Welcome Screen Color Integration] Updated active option title to:', primaryLight);
            }
            
            const activeDesc = activeOption.querySelector('.view-option-desc');
            if (activeDesc) {
                activeDesc.style.setProperty('color', textSecondary, 'important');
                activeDesc.style.setProperty('opacity', '1', 'important');
            }
            
            // Update active indicator dot
            const activeDot = activeOption.querySelector('::after');
            if (activeDot) {
                activeOption.style.setProperty('--active-dot-color', primaryColor, 'important');
            }
        }
        
        // Debug: Log all found elements
        console.log('[Welcome Screen Color Integration] Elements found:');
        console.log('- Brand text:', !!brandText);
        console.log('- Version text:', !!versionText);
        console.log('- Status text:', !!statusText);
        console.log('- Sub status:', !!subStatus);
        console.log('- Security badge:', !!securityBadge);
        console.log('- Status items:', statusItems.length);
        console.log('- View options:', viewOptions.length);
        console.log('- Active option:', !!activeOption);
        
        // Force update selector boxes with a slight delay to ensure DOM is ready
        setTimeout(() => {
            const selectorBoxes = welcomeScreen.querySelectorAll('.welcome-view-option');
            selectorBoxes.forEach((box, index) => {
                box.style.setProperty('border-color', borderColor, 'important');
                box.style.setProperty('background', bgOverlay, 'important');
                
                const title = box.querySelector('.view-option-title');
                if (title) {
                    title.style.setProperty('color', textSecondary, 'important');
                }
                
                const svg = box.querySelector('svg');
                if (svg) {
                    svg.style.setProperty('color', textSecondary, 'important');
                }
                
                console.log(`[Welcome Screen Color Integration] Force updated selector box ${index + 1}`);
            });
            
            // Update all glow effects
            updateGlowEffects(primaryColor, primaryGlow, textPrimary, textSecondary);
        }, 50);
        
        console.log('[Welcome Screen Color Integration] Colors updated successfully');
        console.log('[Welcome Screen Color Integration] Primary color:', primaryColor);
        console.log('[Welcome Screen Color Integration] Text primary:', textPrimary);
        console.log('[Welcome Screen Color Integration] Border color:', borderColor);
        console.log('[Welcome Screen Color Integration] Text secondary:', textSecondary);
    }
    
    // Function to update all glow effects
    function updateGlowEffects(primaryColor, primaryGlow, textPrimary, textSecondary) {
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (!welcomeScreen) return;
        
        // Update logo glow effects
        const logos = welcomeScreen.querySelectorAll('.welcome-omega-logo, .welcome-omega-logo-fallback');
        logos.forEach(logo => {
            logo.style.setProperty('filter', `drop-shadow(0 0 20px ${primaryGlow})`, 'important');
        });
        
        // Update all text shadows
        const textElements = welcomeScreen.querySelectorAll('.welcome-version, .welcome-status, .welcome-sub-status, .welcome-selector-title, .welcome-status-item');
        textElements.forEach(element => {
            if (element.classList.contains('welcome-version') || element.classList.contains('welcome-status')) {
                element.style.setProperty('text-shadow', `0 0 10px ${primaryGlow}`, 'important');
            } else {
                element.style.setProperty('text-shadow', `0 0 5px ${primaryGlow}`, 'important');
            }
        });
        
        // Update all box shadows
        const boxElements = welcomeScreen.querySelectorAll('.welcome-spinner, .welcome-progress-bar, .welcome-security-badge');
        boxElements.forEach(element => {
            if (element.classList.contains('welcome-spinner')) {
                element.style.setProperty('box-shadow', `0 0 15px ${primaryGlow}`, 'important');
            } else if (element.classList.contains('welcome-progress-bar')) {
                element.style.setProperty('box-shadow', `0 0 10px ${primaryGlow}`, 'important');
            } else if (element.classList.contains('welcome-security-badge')) {
                element.style.setProperty('box-shadow', `0 0 5px ${primaryGlow}`, 'important');
            }
        });
        
        // Update selector box glow effects
        const selectorBoxes = welcomeScreen.querySelectorAll('.welcome-view-option');
        selectorBoxes.forEach(box => {
            if (box.classList.contains('welcome-view-option-active')) {
                box.style.setProperty('box-shadow', `0 0 20px ${primaryGlow}, inset 0 0 12px ${primaryGlow}`, 'important');
            } else {
                box.style.setProperty('box-shadow', 'none', 'important');
            }
        });
        
        console.log('[Welcome Screen Color Integration] Updated all glow effects with:', primaryGlow);
    }
    
    // Function to add hover effects
    function addWelcomeScreenHoverEffects() {
        const welcomeScreen = document.getElementById('omegaWelcomeScreen');
        if (!welcomeScreen) return;
        
        const viewOptions = welcomeScreen.querySelectorAll('.welcome-view-option');
        viewOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('welcome-view-option-active')) {
                    const computedStyle = getComputedStyle(document.documentElement);
                    const primaryColor = computedStyle.getPropertyValue('--palette-primary').trim() || '#00d4ff';
                    const primaryGlow = computedStyle.getPropertyValue('--palette-primary-glow').trim() || 'rgba(0, 212, 255, 0.4)';
                    const bgHover = computedStyle.getPropertyValue('--palette-bg-hover').trim() || 'rgba(15, 15, 26, 0.8)';
                    
                    option.style.setProperty('background', bgHover, 'important');
                    option.style.setProperty('border-color', `${primaryColor}4d`, 'important');
                    option.style.setProperty('transform', 'translateY(-1px)', 'important');
                    option.style.setProperty('box-shadow', `0 2px 12px ${primaryGlow}`, 'important');
                    
                    const svg = option.querySelector('svg');
                    if (svg) {
                        svg.style.setProperty('color', primaryColor, 'important');
                        svg.style.setProperty('opacity', '0.9', 'important');
                    }
                    
                    const title = option.querySelector('.view-option-title');
                    if (title) {
                        title.style.setProperty('color', primaryColor, 'important');
                    }
                    
                    const desc = option.querySelector('.view-option-desc');
                    if (desc) {
                        desc.style.setProperty('color', textSecondary, 'important');
                        desc.style.setProperty('opacity', '0.9', 'important');
                    }
                    
                    // Update border on hover
                    option.style.setProperty('border-color', primaryColor, 'important');
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('welcome-view-option-active')) {
                    const computedStyle = getComputedStyle(document.documentElement);
                    const bgOverlay = computedStyle.getPropertyValue('--palette-bg-overlay').trim() || 'rgba(15, 15, 26, 0.6)';
                    const borderColor = computedStyle.getPropertyValue('--palette-border').trim() || 'rgba(0, 212, 255, 0.15)';
                    const textSecondary = computedStyle.getPropertyValue('--palette-text-secondary').trim() || 'rgba(0, 212, 255, 0.6)';
                    
                    option.style.setProperty('background', bgOverlay, 'important');
                    option.style.setProperty('border-color', borderColor, 'important');
                    option.style.setProperty('transform', 'none', 'important');
                    option.style.setProperty('box-shadow', 'none', 'important');
                    
                    const svg = option.querySelector('svg');
                    if (svg) {
                        svg.style.setProperty('color', textSecondary, 'important');
                        svg.style.setProperty('opacity', '0.6', 'important');
                    }
                    
                    const title = option.querySelector('.view-option-title');
                    if (title) {
                        title.style.setProperty('color', textSecondary, 'important');
                    }
                    
                    const desc = option.querySelector('.view-option-desc');
                    if (desc) {
                        desc.style.setProperty('color', textSecondary, 'important');
                        desc.style.setProperty('opacity', '0.7', 'important');
                    }
                    
                    // Reset border on mouse leave
                    option.style.setProperty('border-color', borderColor, 'important');
                }
            });
        });
    }
    
    // Initialize on DOM ready
    function initialize() {
        // Update colors immediately
        updateWelcomeScreenColors();
        addWelcomeScreenHoverEffects();
        
        // Update colors when welcome screen is created
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.id === 'omegaWelcomeScreen') {
                            setTimeout(() => {
                                updateWelcomeScreenColors();
                                addWelcomeScreenHoverEffects();
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
                    console.log('[Welcome Screen Color Integration] Color change detected, updating...');
                    setTimeout(() => {
                        updateWelcomeScreenColors();
                    }, 100);
                }
            });
        });
        
        colorObserver.observe(document.body, { attributes: true });
        
        // Also listen for custom color change events
        document.addEventListener('colorPaletteChanged', () => {
            console.log('[Welcome Screen Color Integration] Custom color change event detected');
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
        
        console.log('[Welcome Screen Color Integration] Initialized successfully');
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
