/* ===================================
   ENHANCED PROFILE SYSTEM v2.0
   Omega ENS, Address Book, Chat, Fullscreen
   =================================== */

console.log('🔧 Loading Enhanced Profile System...');

(function() {
    
    // ===================================
    // ENHANCED PROFILE DATA STRUCTURE
    // ===================================
    
    const profileData = {
        username: '',
        email: '',
        profilePicture: '',
        ensName: '',
        ensRegistered: false,
        addressBook: [],
        pythonScripts: [],
        apiKeys: {
            opensea: '',
            dexscreener: '',
            defillama: '',
            pgt: ''
        },
        preferences: {
            theme: 'default',
            fullscreen: false,
            autoSave: true
        }
    };
    
    // Load saved data
    function loadProfileData() {
        const saved = localStorage.getItem('omega-profile-data');
        if (saved) {
            Object.assign(profileData, JSON.parse(saved));
        }
    }
    
    // Save data
    function saveProfileData() {
        localStorage.setItem('omega-profile-data', JSON.stringify(profileData));
    }
    
    // ===================================
    // OMEGA ENS INTEGRATION
    // ===================================
    
    async function registerENS(ensName) {
        try {
            if (!window.terminal || !window.terminal.signer) {
                throw new Error('Wallet not connected');
            }
            
            const address = await window.terminal.signer.getAddress();
            
            // Use the existing ENS registration system
            if (window.terminal.executeCommand) {
                window.terminal.log(`Registering ENS: ${ensName}`, 'info');
                
                // Call the actual ENS registration command
                const ensCommand = `ens register ${ensName}`;
                window.terminal.executeCommand(ensCommand);
                
                // Simulate success for now (in real implementation, this would wait for the ENS command to complete)
                setTimeout(() => {
                    profileData.ensName = ensName;
                    profileData.ensRegistered = true;
                    saveProfileData();
                    updateProfileUI();
                    window.terminal.log(`✅ ENS registered: ${ensName}.omega`, 'success');
                }, 2000);
                
                return true;
            } else {
                throw new Error('Terminal not available');
            }
        } catch (error) {
            window.terminal.log(`❌ ENS registration failed: ${error.message}`, 'error');
            return false;
        }
    }
    
    async function simulateENSRegistration(ensName, address) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success/failure
        if (ensName.length < 3) {
            return { success: false, error: 'ENS name must be at least 3 characters' };
        }
        
        return {
            success: true,
            data: {
                name: ensName,
                address: address,
                registered: true,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
            }
        };
    }
    
    // ===================================
    // ADDRESS BOOK MANAGEMENT
    // ===================================
    
    function addToAddressBook(name, address, ens = '') {
        const entry = {
            id: Date.now(),
            name: name,
            address: address,
            ens: ens,
            added: new Date().toISOString()
        };
        
        profileData.addressBook.push(entry);
        saveProfileData();
        updateAddressBookUI();
        
        window.terminal.log(`✅ Added to address book: ${name}`, 'success');
    }
    
    function removeFromAddressBook(id) {
        const index = profileData.addressBook.findIndex(entry => entry.id === id);
        if (index !== -1) {
            const removed = profileData.addressBook.splice(index, 1)[0];
            saveProfileData();
            updateAddressBookUI();
            window.terminal.log(`🗑️ Removed from address book: ${removed.name}`, 'info');
        }
    }
    
    // ===================================
    // CHAT INTEGRATION
    // ===================================
    
    function toggleChat() {
        profileData.chatSettings.enabled = !profileData.chatSettings.enabled;
        saveProfileData();
        updateChatUI();
        
        if (profileData.chatSettings.enabled) {
            window.terminal.log('Chat enabled - use "chat" command', 'success');
        } else {
            window.terminal.log('Chat disabled', 'info');
        }
    }
    
    // ===================================
    // FULLSCREEN PROFILE
    // ===================================
    
    function toggleFullscreen() {
        const sidebar = document.getElementById('enhanced-profile-sidebar');
        if (!sidebar) return;
        
        profileData.preferences.fullscreen = !profileData.preferences.fullscreen;
        saveProfileData();
        
        if (profileData.preferences.fullscreen) {
            sidebar.style.width = '100vw';
            sidebar.style.height = '100vh';
            sidebar.style.right = '0';
            sidebar.style.top = '0';
            sidebar.style.borderRadius = '0';
            sidebar.style.maxWidth = 'none';
        } else {
            sidebar.style.width = '450px';
            sidebar.style.height = '100vh';
            sidebar.style.right = '-450px';
            sidebar.style.top = '0';
            sidebar.style.borderRadius = '0';
            sidebar.style.maxWidth = '450px';
        }
        
        updateFullscreenUI();
    }
    
    // ===================================
    // ENHANCED PROFILE UI
    // ===================================
    
    function createEnhancedProfileSidebar() {
        // Remove existing sidebar
        const existingSidebar = document.getElementById('enhanced-profile-sidebar');
        if (existingSidebar) existingSidebar.remove();
        
            const sidebarHtml = `
                <style>
                    @keyframes pulse-glow {
                        0%, 100% {
                            opacity: 1;
                            text-shadow: 0 0 20px var(--matrix-green, #00ff88), 0 2px 4px rgba(0, 0, 0, 0.8);
                        }
                        50% {
                            opacity: 0.7;
                            text-shadow: 0 0 30px var(--matrix-green, #00ff88), 0 2px 4px rgba(0, 0, 0, 0.8);
                        }
                    }
                    
                    #enhanced-profile-sidebar::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    #enhanced-profile-sidebar::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.3);
                    }
                    
                    #enhanced-profile-sidebar::-webkit-scrollbar-thumb {
                        background: var(--matrix-green, #00ff88);
                        opacity: 0.4;
                        border-radius: 4px;
                    }
                    
                    #enhanced-profile-sidebar::-webkit-scrollbar-thumb:hover {
                        opacity: 0.6;
                    }
                </style>
                <div id="enhanced-profile-sidebar" style="
                    position: fixed;
                    right: -450px;
                    top: 0;
                    width: 450px;
                    height: 100vh;
                    background: linear-gradient(135deg, var(--void-black, #0a0a0f), var(--deep-space, #0f0f1a));
                    backdrop-filter: blur(40px);
                    border-left: 2px solid var(--matrix-green, #00ff88);
                    box-shadow: -8px 0 40px rgba(0, 255, 136, 0.2), -4px 0 32px rgba(0, 0, 0, 0.5);
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    z-index: 10000;
                    overflow-y: auto;
                    font-family: var(--font-mono, 'Courier New', monospace);
                ">
                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(18, 18, 18, 0.95));
                        color: white;
                        padding: 24px;
                        text-align: center;
                        position: relative;
                        border-bottom: 2px solid rgba(0, 255, 65, 0.3);
                        box-shadow: 0 4px 24px rgba(0, 255, 65, 0.15);
                    ">
                        <div style="
                            font-size: 1.6em;
                            font-weight: 800;
                            margin-bottom: 8px;
                            color: var(--matrix-green, #00ff88);
                            text-shadow: 0 0 20px rgba(0, 255, 136, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8);
                            font-family: var(--font-mono, 'Courier New', monospace);
                            letter-spacing: 2px;
                            text-transform: uppercase;
                        ">
                            <svg viewBox="0 0 24 24" width="20" height="20" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                            </svg> USER PROFILE
                        </div>
                        <div style="
                            font-size: 0.9em;
                            color: var(--cyber-blue, #00d4ff);
                            font-weight: 500;
                            font-family: var(--font-mono, 'Courier New', monospace);
                            letter-spacing: 1px;
                        ">[ SYSTEM ACCESS CONTROL ]</div>
                    
                    <button onclick="closeEnhancedProfile()" style="
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        background: var(--danger-red, #ff3366);
                        color: #fff;
                        border: 1px solid var(--danger-red, #ff3366);
                        padding: 8px;
                        border-radius: var(--radius-md, 8px);
                        cursor: pointer;
                        font-size: 1em;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all var(--transition-fast, 0.15s);
                        font-weight: bold;
                        box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
                    " onmouseover="this.style.boxShadow='0 0 20px rgba(255, 51, 102, 0.7)'; this.style.transform='scale(1.05)'" onmouseout="this.style.boxShadow='0 0 10px rgba(255, 51, 102, 0.4)'; this.style.transform='scale(1)'">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                    
                    <button onclick="toggleFullscreen()" style="
                        position: absolute;
                        top: 16px;
                        right: 64px;
                        background: var(--cyber-blue, #00d4ff);
                        color: #000;
                        border: 1px solid var(--cyber-blue, #00d4ff);
                        padding: 8px;
                        border-radius: var(--radius-md, 8px);
                        cursor: pointer;
                        font-size: 1em;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all var(--transition-fast, 0.15s);
                        font-weight: bold;
                        box-shadow: 0 0 10px var(--cyber-blue-glow, rgba(0, 212, 255, 0.3));
                    " onmouseover="this.style.boxShadow='0 0 20px var(--cyber-blue-glow, rgba(0, 212, 255, 0.6))'; this.style.transform='scale(1.05)'" onmouseout="this.style.boxShadow='0 0 10px var(--cyber-blue-glow, rgba(0, 212, 255, 0.3))'; this.style.transform='scale(1)'" title="Toggle Fullscreen">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/>
                        </svg>
                    </button>
                </div>
                
                <div style="padding: 24px;">
                    
                    <!-- Profile Card Section - Redesigned -->
                    <div style="
                        background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 212, 255, 0.05));
                        border: 1px solid rgba(0, 255, 136, 0.3);
                        border-radius: var(--radius-xl, 16px);
                        padding: 24px;
                        margin-bottom: 32px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.1);
                    ">
                        <!-- Profile Picture with Modern Card Design -->
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                            <!-- Avatar Container -->
                            <div style="position: relative; flex-shrink: 0;">
                                <div id="enhanced-profile-pic" onclick="document.getElementById('enhanced-img-upload').click()" style="
                                    width: 120px;
                                    height: 120px;
                                    background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2));
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 3em;
                                    cursor: pointer;
                                    border: 3px solid var(--matrix-green, #00ff88);
                                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2);
                                    transition: all var(--transition-normal, 0.3s) cubic-bezier(0.4, 0, 0.2, 1);
                                    overflow: hidden;
                                    color: var(--matrix-green, #00ff88);
                                    position: relative;
                                " onmouseover="this.style.transform='scale(1.08)'; this.style.boxShadow='0 0 40px rgba(0, 255, 136, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'">
                                    <svg viewBox="0 0 24 24" width="60" height="60" style="position: relative; z-index: 2;">
                                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                                    </svg>
                                    <div style="
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        bottom: 0;
                                        background: radial-gradient(circle at center, rgba(0, 255, 136, 0.1), transparent);
                                        z-index: 1;
                                    "></div>
                                </div>
                                
                                <!-- Upload Badge -->
                                <div onclick="document.getElementById('enhanced-img-upload').click()" style="
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    background: linear-gradient(135deg, var(--matrix-green, #00ff88), var(--cyber-blue, #00d4ff));
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    border: 3px solid var(--void-black, #0a0a0f);
                                    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
                                    transition: all var(--transition-fast, 0.2s);
                                    font-size: 1.2em;
                                " onmouseover="this.style.transform='scale(1.1) rotate(15deg)'; this.style.boxShadow='0 6px 16px rgba(0, 255, 136, 0.6)'" onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 4px 12px rgba(0, 255, 136, 0.4)'">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                                    </svg>
                                </div>
                                
                                <input type="file" id="enhanced-img-upload" accept="image/*" style="display: none;" onchange="uploadEnhancedImage(this)">
                            </div>
                            
                            <!-- User Info Card -->
                            <div style="flex: 1; min-width: 0;">
                                <div id="profile-username-display" style="
                                    font-size: 1.5em;
                                    font-weight: 800;
                                    color: var(--matrix-green, #00ff88);
                                    margin-bottom: 6px;
                                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                                    letter-spacing: 0.5px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                ">Anonymous User</div>
                                
                                <div id="profile-wallet-display" style="
                                    font-size: 0.85em;
                                    color: rgba(255, 255, 255, 0.6);
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    margin-bottom: 8px;
                                    padding: 6px 10px;
                                    background: rgba(0, 0, 0, 0.3);
                                    border-radius: var(--radius-md, 8px);
                                    border: 1px solid rgba(0, 255, 136, 0.2);
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                ">
                                    <svg viewBox="0 0 24 24" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                                        <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                                    </svg> No wallet connected
                                </div>
                                
                                <div id="profile-ens-display" style="
                                    font-size: 0.85em;
                                    color: var(--cyber-blue, #00d4ff);
                                    padding: 4px 10px;
                                    background: rgba(0, 212, 255, 0.1);
                                    border-radius: var(--radius-md, 8px);
                                    border: 1px solid rgba(0, 212, 255, 0.3);
                                    display: inline-block;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                ">
                                    <svg viewBox="0 0 24 24" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                                        <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"/>
                                    </svg> No ENS name
                                </div>
                            </div>
                        </div>
                        
                        <!-- Divider -->
                        <div style="
                            height: 1px;
                            background: linear-gradient(to right, transparent, var(--matrix-green, #00ff88), transparent);
                            opacity: 0.3;
                            margin: 24px 0;
                        "></div>
                        
                        <!-- Profile Information Fields -->
                        <div style="margin-bottom: 0;">
                            <div style="
                                font-size: 1.1em;
                                font-weight: 700;
                                color: var(--matrix-green, #00ff88);
                                margin-bottom: 16px;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                font-family: var(--font-mono, 'Courier New', monospace);
                            ">
                                <svg viewBox="0 0 24 24" width="20" height="20" style="display: inline-block;">
                                    <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                                </svg>
                                <span>Profile Information</span>
                            </div>
                            
                            <!-- Username Field -->
                            <div style="margin-bottom: 16px;">
                                <label style="
                                    display: block;
                                    color: rgba(255, 255, 255, 0.9);
                                    font-weight: 600;
                                    margin-bottom: 8px;
                                    font-size: 0.9em;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    letter-spacing: 0.5px;
                                ">
                                    USERNAME
                                </label>
                                <div style="position: relative;">
                                    <span style="
                                        position: absolute;
                                        left: 14px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        font-size: 1.1em;
                                        z-index: 2;
                                    ">
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                                        </svg>
                                    </span>
                                    <input type="text" id="enhanced-username" placeholder="Enter your username" style="
                                        width: 100%;
                                        padding: 14px 16px 14px 44px;
                                        border: 1px solid rgba(0, 255, 136, 0.3);
                                        border-radius: var(--radius-md, 8px);
                                        font-size: 1em;
                                        background: rgba(0, 0, 0, 0.4);
                                        color: var(--matrix-green, #00ff88);
                                        transition: all var(--transition-normal, 0.3s);
                                        box-sizing: border-box;
                                        font-family: var(--font-mono, 'Courier New', monospace);
                                        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                                    " onfocus="this.style.border='1px solid var(--matrix-green, #00ff88)'; this.style.boxShadow='inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 12px rgba(0, 255, 136, 0.3)'" onblur="this.style.border='1px solid rgba(0, 255, 136, 0.3)'; this.style.boxShadow='inset 0 2px 8px rgba(0, 0, 0, 0.3)'" onchange="updateProfileField('username', this.value)">
                                </div>
                            </div>
                            
                            <!-- Email Field -->
                            <div style="margin-bottom: 16px;">
                                <label style="
                                    display: block;
                                    color: rgba(255, 255, 255, 0.9);
                                    font-weight: 600;
                                    margin-bottom: 8px;
                                    font-size: 0.9em;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    letter-spacing: 0.5px;
                                ">
                                    EMAIL
                                </label>
                                <div style="position: relative;">
                                    <span style="
                                        position: absolute;
                                        left: 14px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        font-size: 1.1em;
                                        z-index: 2;
                                    ">
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                                        </svg>
                                    </span>
                                    <input type="email" id="enhanced-email" placeholder="user@omega.network" style="
                                        width: 100%;
                                        padding: 14px 16px 14px 44px;
                                        border: 1px solid rgba(0, 212, 255, 0.3);
                                        border-radius: var(--radius-md, 8px);
                                        font-size: 1em;
                                        background: rgba(0, 0, 0, 0.4);
                                        color: var(--cyber-blue, #00d4ff);
                                        transition: all var(--transition-normal, 0.3s);
                                        box-sizing: border-box;
                                        font-family: var(--font-mono, 'Courier New', monospace);
                                        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
                                    " onfocus="this.style.border='1px solid var(--cyber-blue, #00d4ff)'; this.style.boxShadow='inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 12px var(--cyber-blue-glow, rgba(0, 212, 255, 0.3))'" onblur="this.style.border='1px solid rgba(0, 212, 255, 0.3)'; this.style.boxShadow='inset 0 2px 8px rgba(0, 0, 0, 0.3)'" onchange="updateProfileField('email', this.value)">
                                </div>
                            </div>
                            
                            <!-- Connected Wallet Display -->
                            <div style="margin-top: 16px; padding: 12px; background: rgba(0, 0, 0, 0.5); border-radius: var(--radius-md, 8px); border: 1px solid rgba(255, 255, 255, 0.1);">
                                <div style="font-size: 0.85em; color: rgba(255, 255, 255, 0.5); margin-bottom: 6px; font-family: var(--font-mono, 'Courier New', monospace);">WALLET ADDRESS</div>
                                <div id="profile-wallet-address" style="
                                    font-size: 0.9em;
                                    color: var(--matrix-green, #00ff88);
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    word-break: break-all;
                                    padding: 8px;
                                    background: rgba(0, 255, 136, 0.05);
                                    border-radius: var(--radius-sm, 4px);
                                    border: 1px solid rgba(0, 255, 136, 0.2);
                                ">Not connected</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Omega ENS Section -->
                    <div style="
                        margin-bottom: 32px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(0, 191, 255, 0.3);
                        border-radius: 12px;
                        padding: 20px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    ">
                        <div style="
                            font-size: 1.1em;
                            font-weight: 700;
                            color: #00bfff;
                            margin-bottom: 16px;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            font-family: 'Courier New', monospace;
                        ">
                            <svg viewBox="0 0 24 24" width="22" height="22" style="display: inline-block;">
                                <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"/>
                            </svg>
                            <span>OMEGA ENS REGISTRY</span>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="
                                display: block;
                                color: rgba(255, 255, 255, 0.8);
                                font-weight: 600;
                                margin-bottom: 8px;
                                font-size: 0.85em;
                                font-family: 'Courier New', monospace;
                                letter-spacing: 0.5px;
                            ">
                                ENS NAME
                            </label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="enhanced-ens-name" placeholder="yourname.omega" style="
                                    flex: 1;
                                    padding: 12px 14px;
                                    border: 1px solid rgba(0, 191, 255, 0.4);
                                    border-radius: 8px;
                                    font-size: 0.95em;
                                    background: rgba(0, 0, 0, 0.5);
                                    color: #00bfff;
                                    transition: all 0.3s ease;
                                    box-sizing: border-box;
                                    font-family: 'Courier New', monospace;
                                    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
                                " onfocus="this.style.border='1px solid rgba(0, 191, 255, 0.8)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 191, 255, 0.4)'" onblur="this.style.border='1px solid rgba(0, 191, 255, 0.4)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4)'">
                                <button onclick="registerENSFromProfile()" style="
                                    background: linear-gradient(135deg, var(--matrix-green, #00ff88), #00cc66);
                                    color: #000;
                                    border: 1px solid var(--matrix-green, #00ff88);
                                    padding: 12px 24px;
                                    border-radius: var(--radius-md, 8px);
                                    font-size: 0.9em;
                                    font-weight: 700;
                                    cursor: pointer;
                                    box-shadow: 0 0 16px rgba(0, 255, 136, 0.4);
                                    white-space: nowrap;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    letter-spacing: 1px;
                                    transition: all var(--transition-fast, 0.2s);
                                " onmouseover="this.style.boxShadow='0 0 24px rgba(0, 255, 136, 0.6)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 0 16px rgba(0, 255, 136, 0.4)'; this.style.transform='translateY(0)'">REGISTER</button>
                            </div>
                        </div>
                        
                        <div id="ens-status" style="
                            padding: 14px;
                            border-radius: 8px;
                            background: rgba(255, 149, 0, 0.1);
                            font-size: 0.9em;
                            color: #ffaa00;
                            border: 1px solid rgba(255, 149, 0, 0.3);
                            font-family: 'Courier New', monospace;
                            text-align: center;
                        ">
                            <svg viewBox="0 0 24 24" width="18" height="18" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                                <path fill="currentColor" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                            </svg> No ENS registered<br>
                            <span style="font-size: 0.85em; opacity: 0.8;">Register an ENS name to get started</span>
                        </div>
                    </div>
                    
                    <!-- Address Book Section -->
                    <div style="
                        margin-bottom: 32px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(138, 43, 226, 0.3);
                        border-radius: 12px;
                        padding: 20px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    ">
                        <div style="
                            font-size: 1.1em;
                            font-weight: 700;
                            color: #ba55d3;
                            margin-bottom: 16px;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            font-family: 'Courier New', monospace;
                        ">
                            <svg viewBox="0 0 24 24" width="22" height="22" style="display: inline-block;">
                                <path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z"/>
                            </svg>
                            <span>ADDRESS BOOK</span>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
                                <input type="text" id="address-book-name" placeholder="Contact name" style="
                                    padding: 12px 14px;
                                    border: 1px solid rgba(138, 43, 226, 0.4);
                                    border-radius: 8px;
                                    font-size: 0.9em;
                                    background: rgba(0, 0, 0, 0.5);
                                    color: #ba55d3;
                                    font-family: 'Courier New', monospace;
                                    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
                                    transition: all 0.3s ease;
                                " onfocus="this.style.border='1px solid rgba(186, 85, 211, 0.8)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 12px rgba(186, 85, 211, 0.4)'" onblur="this.style.border='1px solid rgba(138, 43, 226, 0.4)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4)'">
                                <input type="text" id="address-book-address" placeholder="0x... or name.omega" style="
                                    padding: 12px 14px;
                                    border: 1px solid rgba(138, 43, 226, 0.4);
                                    border-radius: 8px;
                                    font-size: 0.9em;
                                    background: rgba(0, 0, 0, 0.5);
                                    color: #ba55d3;
                                    font-family: 'Courier New', monospace;
                                    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
                                    transition: all 0.3s ease;
                                " onfocus="this.style.border='1px solid rgba(186, 85, 211, 0.8)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 12px rgba(186, 85, 211, 0.4)'" onblur="this.style.border='1px solid rgba(138, 43, 226, 0.4)'; this.style.boxShadow='inset 0 2px 6px rgba(0, 0, 0, 0.4)'">
                                <button onclick="addToAddressBookFromProfile()" style="
                                    width: 100%;
                                    background: linear-gradient(135deg, var(--neon-purple, #9d00ff), #7700cc);
                                    color: white;
                                    border: 1px solid var(--neon-purple, #9d00ff);
                                    padding: 12px;
                                    border-radius: var(--radius-md, 8px);
                                    font-size: 0.9em;
                                    font-weight: 700;
                                    cursor: pointer;
                                    font-family: var(--font-mono, 'Courier New', monospace);
                                    letter-spacing: 1px;
                                    box-shadow: 0 0 12px rgba(157, 0, 255, 0.3);
                                    transition: all var(--transition-fast, 0.2s);
                                " onmouseover="this.style.boxShadow='0 0 20px rgba(157, 0, 255, 0.5)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 0 12px rgba(157, 0, 255, 0.3)'; this.style.transform='translateY(0)'">+ ADD CONTACT</button>
                            </div>
                        </div>
                        
                        <div id="address-book-list" style="
                            max-height: 200px;
                            overflow-y: auto;
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 8px;
                            border: 1px solid rgba(138, 43, 226, 0.2);
                        ">
                            <!-- Address book entries will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Terminal Chatter Section -->
                    <div style="
                        margin-bottom: 32px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 105, 180, 0.3);
                        border-radius: 12px;
                        padding: 20px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    ">
                        <div style="
                            font-size: 1.1em;
                            font-weight: 700;
                            color: #ff69b4;
                            margin-bottom: 16px;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            font-family: 'Courier New', monospace;
                        ">
                            <svg viewBox="0 0 24 24" width="22" height="22" style="display: inline-block;">
                                <path fill="currentColor" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9M10,16V19.08L13.08,16H20V4H4V16H10Z"/>
                            </svg>
                            <span>TERMINAL CHATTER</span>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="
                                padding: 16px;
                                border-radius: 8px;
                                background: rgba(255, 105, 180, 0.1);
                                border: 1px solid rgba(255, 105, 180, 0.3);
                                margin-bottom: 12px;
                            ">
                                <div style="color: #ff69b4; font-weight: 700; margin-bottom: 8px; font-family: 'Courier New', monospace;">TELEGRAM-STYLE CHAT</div>
                                <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.85em; line-height: 1.5; font-family: 'Courier New', monospace;">
                                    Join the Omega Terminal community chat! Real-time messaging with other users.
                                </div>
                            </div>
                            
                            <button onclick="openChatFromProfile()" style="
                                width: 100%;
                                background: linear-gradient(135deg, var(--neon-pink, #ff0099), #ff33aa);
                                color: white;
                                border: 1px solid var(--neon-pink, #ff0099);
                                padding: 16px;
                                border-radius: var(--radius-md, 8px);
                                font-size: 1em;
                                font-weight: 700;
                                cursor: pointer;
                                box-shadow: 0 0 16px rgba(255, 0, 153, 0.4);
                                transition: all var(--transition-fast, 0.2s);
                                font-family: var(--font-mono, 'Courier New', monospace);
                                letter-spacing: 1px;
                            " onmouseover="this.style.boxShadow='0 0 24px rgba(255, 0, 153, 0.6)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 0 16px rgba(255, 0, 153, 0.4)'; this.style.transform='translateY(0)'">
                                OPEN CHATTER
                            </button>
                        </div>
                        
                        <div style="
                            padding: 12px;
                            border-radius: 6px;
                            background: rgba(0, 0, 0, 0.4);
                            font-size: 0.85em;
                            color: rgba(255, 255, 255, 0.6);
                            font-family: 'Courier New', monospace;
                            border: 1px solid rgba(255, 105, 180, 0.2);
                        ">
                            <div style="margin-bottom: 8px; color: #ff69b4; font-weight: 700;">[ QUICK COMMANDS ]</div>
                            <div style="margin-left: 12px; line-height: 1.8;">
                                <div><code style="background: rgba(0, 255, 65, 0.2); padding: 2px 8px; border-radius: 4px; color: #00ff41;">chat</code> - Open chat</div>
                                <div><code style="background: rgba(0, 255, 65, 0.2); padding: 2px 8px; border-radius: 4px; color: #00ff41;">chat settings</code> - Settings</div>
                                <div><code style="background: rgba(0, 255, 65, 0.2); padding: 2px 8px; border-radius: 4px; color: #00ff41;">chat help</code> - Help</div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <!-- API Keys Management Section -->
                    <div class="api-keys-container" style="
                        margin-bottom: 32px;
                        background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(15,15,26,0.95)); 
                        border: 1px solid rgba(0,212,255,0.25); 
                        border-radius: 16px; 
                        padding: 24px; 
                        backdrop-filter: blur(20px); 
                        box-shadow: 0 8px 32px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08); 
                        position: relative; 
                        overflow: hidden;
                        transition: all 0.3s ease;
                    ">
                        <!-- Animated background effect -->
                        <div style="
                            position: absolute; 
                            top: 0; 
                            left: 0; 
                            right: 0; 
                            bottom: 0; 
                            background: linear-gradient(45deg, transparent 30%, rgba(0,212,255,0.02) 50%, transparent 70%); 
                            animation: shimmer 4s infinite; 
                            pointer-events: none;
                        "></div>
                        
                        <div style="
                            font-size: 1.2em;
                            font-weight: 700;
                            color: var(--cyber-blue);
                            margin-bottom: 20px;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            font-family: var(--font-tech);
                            text-shadow: 0 0 8px rgba(0,212,255,0.4);
                            position: relative;
                            z-index: 1;
                        ">
                            <svg viewBox="0 0 24 24" width="24" height="24" style="display: inline-block;">
                                <path fill="currentColor" d="M7,14A2,2 0 0,1 5,12A2,2 0 0,1 7,10A2,2 0 0,1 9,12A2,2 0 0,1 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65Z"/>
                            </svg>
                            <span>API KEYS MANAGEMENT</span>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, rgba(10,10,15,0.6), rgba(26,26,40,0.7)); 
                            border: 1px solid rgba(0,212,255,0.15); 
                            border-radius: 12px; 
                            padding: 20px; 
                            margin-bottom: 20px; 
                            position: relative;
                            z-index: 1;
                        ">
                            <div style="
                                display: grid; 
                                grid-template-columns: 1fr 1fr; 
                                gap: 16px; 
                                margin-bottom: 16px;
                            ">
                                <!-- ChainGPT NFT Generator -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        ChainGPT NFT
                                    </label>
                                    <input type="password" id="chaingpt-nft-key" placeholder="Enter ChainGPT NFT API key..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('chaingpt-nft', this.value)">
                                </div>
                                
                                <!-- ChainGPT Chat -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        ChainGPT Chat
                                    </label>
                                    <input type="password" id="chaingpt-chat-key" placeholder="Enter ChainGPT Chat API key..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('chaingpt-chat', this.value)">
                                </div>
                                
                                <!-- OpenSea -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        OpenSea
                                    </label>
                                    <input type="password" id="opensea-key" placeholder="sk_..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('opensea', this.value)">
                                </div>
                                
                                <!-- DexScreener -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        DexScreener
                                    </label>
                                    <input type="password" id="dexscreener-key" placeholder="ds_..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('dexscreener', this.value)">
                                </div>
                                
                                <!-- DeFi Llama -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        DeFi Llama
                                    </label>
                                    <input type="password" id="defillama-key" placeholder="ll_..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('defillama', this.value)">
                                </div>
                                
                                <!-- Alpha Vantage -->
                                <div style="margin-bottom: 12px;">
                                    <label style="display: block; color: rgba(255, 255, 255, 0.9); font-weight: 600; margin-bottom: 6px; font-size: 0.85em; font-family: var(--font-tech); letter-spacing: 0.5px;">
                                        Alpha Vantage
                                    </label>
                                    <input type="password" id="alpha-vantage-key" placeholder="AV_..." style="
                                        width: 100%;
                                        padding: 12px 14px;
                                        border: 1px solid rgba(0,212,255,0.3);
                                        border-radius: 8px;
                                        font-size: 0.9em;
                                        background: rgba(0,0,0,0.4);
                                        color: var(--cyber-blue);
                                        transition: all 0.3s ease;
                                        box-sizing: border-box;
                                        font-family: var(--font-tech);
                                        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
                                    " onfocus="this.style.border='1px solid rgba(0,212,255,0.6)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(0,212,255,0.3)'" onblur="this.style.border='1px solid rgba(0,212,255,0.3)'; this.style.boxShadow='inset 0 2px 6px rgba(0,0,0,0.3)'" onchange="updateAPIKey('alpha-vantage', this.value)">
                                </div>
                            </div>
                            
                            <!-- API Enhancement Disclaimer -->
                            <div style="
                                background: linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.04)); 
                                border: 1px solid rgba(0,255,136,0.2); 
                                border-radius: 10px; 
                                padding: 16px; 
                                margin: 16px 0; 
                                position: relative;
                                z-index: 1;
                            ">
                                <div style="
                                    display: flex; 
                                    align-items: flex-start; 
                                    gap: 12px;
                                ">
                                    <div style="
                                        font-size: 1.2em; 
                                        color: var(--matrix-green); 
                                        margin-top: 2px;
                                        text-shadow: 0 0 8px rgba(0,255,136,0.4);
                                    ">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" d="M12,2A7,7 0 0,1 19,9C19,11.38 17.19,13.47 14.39,14.5C14.61,14.99 15,15.64 15,16.5C15,17.14 14.78,17.73 14.42,18.21C14.71,18.53 14.88,18.95 14.88,19.42C14.88,20.12 14.58,20.76 14.08,21.21V21.5C14.08,22.33 13.41,23 12.58,23H11.42C10.59,23 9.92,22.33 9.92,21.5V21.21C9.42,20.76 9.12,20.12 9.12,19.42C9.12,18.95 9.29,18.53 9.58,18.21C9.22,17.73 9,17.14 9,16.5C9,15.64 9.39,14.99 9.61,14.5C6.81,13.47 5,11.38 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10.5,13.58C10.5,13.58 11,13.5 11,16.5C11,17 11.45,17.5 12,17.5C12.55,17.5 13,17 13,16.5C13,13.5 13.5,13.58 13.5,13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div style="
                                            color: var(--matrix-green); 
                                            font-weight: 600; 
                                            font-size: 0.9em; 
                                            margin-bottom: 6px;
                                            font-family: var(--font-tech);
                                            letter-spacing: 0.5px;
                                        ">ENHANCE YOUR TERMINAL</div>
                                        <div style="
                                            color: rgba(255,255,255,0.8); 
                                            font-size: 0.8em; 
                                            line-height: 1.4;
                                            font-family: var(--font-tech);
                                        ">
                                            Add your personal API keys to unlock premium features and enhanced functionality. 
                                            Your keys are stored locally and securely encrypted.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Quick Actions -->
                            <div style="
                                display: flex; 
                                gap: 12px; 
                                margin-top: 16px;
                                flex-wrap: wrap;
                            ">
                                <button onclick="testAllAPIKeys()" style="
                                    background: linear-gradient(135deg, var(--matrix-green), #00cc66); 
                                    color: #000; 
                                    border: 1px solid var(--matrix-green); 
                                    padding: 10px 16px; 
                                    border-radius: 8px; 
                                    font-size: 0.85em; 
                                    font-weight: 600; 
                                    cursor: pointer; 
                                    font-family: var(--font-tech);
                                    box-shadow: 0 4px 16px rgba(0,255,136,0.25);
                                    transition: all 0.3s ease;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,255,136,0.35)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,255,136,0.25)'">TEST ALL</button>
                                
                                <button onclick="clearAllAPIKeys()" style="
                                    background: linear-gradient(135deg, var(--danger-red), #ff4477); 
                                    color: white; 
                                    border: 1px solid var(--danger-red); 
                                    padding: 10px 16px; 
                                    border-radius: 8px; 
                                    font-size: 0.85em; 
                                    font-weight: 600; 
                                    cursor: pointer; 
                                    font-family: var(--font-tech);
                                    box-shadow: 0 4px 16px rgba(255,51,102,0.25);
                                    transition: all 0.3s ease;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255,51,102,0.35)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(255,51,102,0.25)'">CLEAR ALL</button>
                                
                                <button onclick="exportAPIKeys()" style="
                                    background: linear-gradient(135deg, var(--cyber-blue), var(--cyber-blue-dim)); 
                                    color: #000; 
                                    border: 1px solid var(--cyber-blue); 
                                    padding: 10px 16px; 
                                    border-radius: 8px; 
                                    font-size: 0.85em; 
                                    font-weight: 600; 
                                    cursor: pointer; 
                                    font-family: var(--font-tech);
                                    box-shadow: 0 4px 16px rgba(0,212,255,0.25);
                                    transition: all 0.3s ease;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,212,255,0.35)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,212,255,0.25)'">EXPORT</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Save Button -->
                    <button onclick="saveEnhancedProfile()" style="
                        width: 100%;
                        background: linear-gradient(135deg, var(--matrix-green, #00ff88), #00cc66);
                        color: #000;
                        border: 1px solid var(--matrix-green, #00ff88);
                        padding: 18px;
                        border-radius: var(--radius-lg, 12px);
                        font-size: 1.2em;
                        font-weight: 800;
                        cursor: pointer;
                        box-shadow: 0 0 24px rgba(0, 255, 136, 0.5);
                        transition: all var(--transition-normal, 0.3s);
                        font-family: var(--font-mono, 'Courier New', monospace);
                        letter-spacing: 2px;
                        text-transform: uppercase;
                    " onmouseover="this.style.boxShadow='0 0 32px rgba(0, 255, 136, 0.7)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.boxShadow='0 0 24px rgba(0, 255, 136, 0.5)'; this.style.transform='translateY(0)'">
                        SAVE PROFILE
                    </button>
                    
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', sidebarHtml);
        loadProfileData();
        updateProfileUI();
    }
    
    // ===================================
    // UI UPDATE FUNCTIONS
    // ===================================
    
    function updateProfileUI() {
        // Update form fields
        const usernameField = document.getElementById('enhanced-username');
        const emailField = document.getElementById('enhanced-email');
        const ensNameField = document.getElementById('enhanced-ens-name');
        
        if (usernameField) usernameField.value = profileData.username;
        if (emailField) emailField.value = profileData.email;
        if (ensNameField) ensNameField.value = profileData.ensName;
        
        // Update profile picture
        const profilePic = document.getElementById('enhanced-profile-pic');
        if (profilePic && profileData.profilePicture) {
            profilePic.style.backgroundImage = `url(${profileData.profilePicture})`;
            profilePic.style.backgroundSize = 'cover';
            profilePic.style.backgroundPosition = 'center';
            profilePic.innerHTML = ''; // Clear emoji
        }
        
        // Update username display (new)
        const usernameDisplay = document.getElementById('profile-username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = profileData.username || 'Anonymous User';
        }
        
        // Update wallet display (new)
        const walletDisplay = document.getElementById('profile-wallet-display');
        const walletAddress = document.getElementById('profile-wallet-address');
        if (walletDisplay && walletAddress) {
            if (window.OmegaWallet && window.OmegaWallet.userAddress) {
                const addr = window.OmegaWallet.userAddress;
                const shortAddr = addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
                walletDisplay.innerHTML = `🔗 ${shortAddr}`;
                walletAddress.textContent = addr;
            } else if (window.terminal && window.terminal.userAddress) {
                const addr = window.terminal.userAddress;
                const shortAddr = addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
                walletDisplay.innerHTML = `🔗 ${shortAddr}`;
                walletAddress.textContent = addr;
            } else {
                walletDisplay.innerHTML = '🔐 No wallet connected';
                walletAddress.textContent = 'Not connected';
            }
        }
        
        // Update ENS display (new)
        const ensDisplay = document.getElementById('profile-ens-display');
        if (ensDisplay) {
            if (profileData.ensName && profileData.ensRegistered) {
                ensDisplay.innerHTML = `📛 ${profileData.ensName}.omega`;
                ensDisplay.style.background = 'rgba(0, 255, 65, 0.15)';
                ensDisplay.style.borderColor = 'rgba(0, 255, 65, 0.4)';
                ensDisplay.style.color = '#00ff41';
            } else {
                ensDisplay.innerHTML = '📛 No ENS name';
                ensDisplay.style.background = 'rgba(0, 191, 255, 0.1)';
                ensDisplay.style.borderColor = 'rgba(0, 191, 255, 0.3)';
                ensDisplay.style.color = 'rgba(0, 191, 255, 0.8)';
            }
        }
        
        // Update ENS status
        updateENSStatus();
        
        // Update address book
        updateAddressBookUI();
        
        // Update API keys
        updateAPIKeysUI();
    }
    
    // New function to update wallet displays with current connection
    function updateWalletDisplays() {
        // Update username display
        const usernameDisplay = document.getElementById('profile-username-display');
        if (usernameDisplay && profileData.username) {
            usernameDisplay.textContent = profileData.username;
        }
        
        // Update wallet display in card
        const walletDisplay = document.getElementById('profile-wallet-display');
        const walletAddress = document.getElementById('profile-wallet-address');
        
        if (walletDisplay && walletAddress) {
            // Check multiple sources for wallet address
            let addr = null;
            
            if (window.OmegaWallet && window.OmegaWallet.userAddress) {
                addr = window.OmegaWallet.userAddress;
            } else if (window.terminal && window.terminal.userAddress) {
                addr = window.terminal.userAddress;
            } else if (window.MultiNetworkConnector && window.MultiNetworkConnector.currentAddress) {
                addr = window.MultiNetworkConnector.currentAddress;
            }
            
            if (addr) {
                const shortAddr = addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
                walletDisplay.innerHTML = `🔗 ${shortAddr}`;
                walletDisplay.style.color = 'var(--matrix-green, #00ff88)';
                walletDisplay.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                walletAddress.textContent = addr;
                walletAddress.style.cursor = 'pointer';
                walletAddress.title = 'Click to copy';
                walletAddress.onclick = () => {
                    navigator.clipboard.writeText(addr).then(() => {
                        if (window.terminal) {
                            window.terminal.log('✅ Wallet address copied!', 'success');
                        }
                    });
                };
            } else {
                walletDisplay.innerHTML = '🔐 No wallet connected';
                walletDisplay.style.color = 'rgba(255, 255, 255, 0.6)';
                walletDisplay.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                walletAddress.textContent = 'Not connected';
                walletAddress.style.cursor = 'default';
                walletAddress.onclick = null;
            }
        }
        
        // Update ENS display
        const ensDisplay = document.getElementById('profile-ens-display');
        if (ensDisplay) {
            if (profileData.ensName && profileData.ensRegistered) {
                ensDisplay.innerHTML = `📛 ${profileData.ensName}.omega`;
                ensDisplay.style.background = 'rgba(0, 255, 136, 0.15)';
                ensDisplay.style.borderColor = 'var(--matrix-green, #00ff88)';
                ensDisplay.style.color = 'var(--matrix-green, #00ff88)';
                ensDisplay.style.opacity = '0.6';
            } else {
                ensDisplay.innerHTML = '📛 No ENS name';
                ensDisplay.style.background = 'rgba(0, 212, 255, 0.1)';
                ensDisplay.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                ensDisplay.style.color = 'var(--cyber-blue, #00d4ff)';
            }
        }
    }
    
    function updateENSStatus() {
        const ensStatus = document.getElementById('ens-status');
        if (!ensStatus) return;
        
        // Update wallet displays first
        updateWalletDisplays();
        
        if (profileData.ensRegistered && profileData.ensName) {
            ensStatus.innerHTML = `
                <div style="color: var(--matrix-green, #00ff88); font-weight: 700; font-family: var(--font-mono, 'Courier New', monospace);">
                    ✅ REGISTERED: ${profileData.ensName}.omega
                </div>
                <div style="font-size: 0.85em; color: rgba(255, 255, 255, 0.6); margin-top: 6px; font-family: var(--font-mono, 'Courier New', monospace);">
                    Connected to your wallet
                </div>
            `;
            ensStatus.style.background = 'rgba(0, 255, 136, 0.15)';
            ensStatus.style.color = 'var(--matrix-green, #00ff88)';
            ensStatus.style.border = '1px solid var(--matrix-green, #00ff88)';
            ensStatus.style.borderOpacity = '0.4';
        } else {
            ensStatus.innerHTML = `
                <span style="font-size: 1.2em;">⚠️</span> No ENS registered<br>
                <span style="font-size: 0.85em; opacity: 0.8;">Register an ENS name to get started</span>
            `;
            ensStatus.style.background = 'rgba(255, 170, 0, 0.1)';
            ensStatus.style.color = 'var(--warning-amber, #ffaa00)';
            ensStatus.style.border = '1px solid rgba(255, 170, 0, 0.3)';
        }
    }
    
    function updateAddressBookUI() {
        const addressBookList = document.getElementById('address-book-list');
        if (!addressBookList) return;
        
        if (profileData.addressBook.length === 0) {
            addressBookList.innerHTML = `
                <div style="text-align: center; color: #666; padding: 20px; font-style: italic;">
                    No contacts in address book
                </div>
            `;
            return;
        }
        
        addressBookList.innerHTML = profileData.addressBook.map(entry => `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                margin-bottom: 8px;
                background: rgba(28, 28, 30, 0.5);
            ">
                <div>
                    <div style="font-weight: 600; color: #FFFFFF;">${entry.name}</div>
                    <div style="font-size: 0.8em; color: #8E8E93;">${entry.address}</div>
                    ${entry.ens ? `<div style="font-size: 0.8em; color: #007AFF;">${entry.ens}</div>` : ''}
                </div>
                <button onclick="removeFromAddressBook(${entry.id})" style="
                    background: #FF3B30;
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 0.8em;
                    cursor: pointer;
                ">Remove</button>
            </div>
        `).join('');
    }
    
    
    function updateAPIKeysUI() {
        // ChainGPT APIs
        const chaingptNftKey = document.getElementById('chaingpt-nft-key');
        const chaingptChatKey = document.getElementById('chaingpt-chat-key');
        
        // Market Data APIs
        const openseaKey = document.getElementById('opensea-key');
        const dexscreenerKey = document.getElementById('dexscreener-key');
        const defillamaKey = document.getElementById('defillama-key');
        
        // Stock APIs
        const alphaVantageKey = document.getElementById('alpha-vantage-key');
        
        // Update values
        if (chaingptNftKey) chaingptNftKey.value = profileData.apiKeys['chaingpt-nft'] || '';
        if (chaingptChatKey) chaingptChatKey.value = profileData.apiKeys['chaingpt-chat'] || '';
        if (openseaKey) openseaKey.value = profileData.apiKeys.opensea || '';
        if (dexscreenerKey) dexscreenerKey.value = profileData.apiKeys.dexscreener || '';
        if (defillamaKey) defillamaKey.value = profileData.apiKeys.defillama || '';
        if (alphaVantageKey) alphaVantageKey.value = profileData.apiKeys['alpha-vantage'] || '';
    }
    
    function updateFullscreenUI() {
        const fullscreenBtn = document.querySelector('[onclick="toggleFullscreen()"]');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = profileData.preferences.fullscreen ? '📱' : '🖥️';
            fullscreenBtn.title = profileData.preferences.fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
        }
    }
    
    // ===================================
    // EVENT HANDLERS
    // ===================================
    
    window.openEnhancedProfile = function() {
        createEnhancedProfileSidebar();
        const sidebar = document.getElementById('enhanced-profile-sidebar');
        if (sidebar) {
            sidebar.style.right = '0';
            
            // Update wallet displays immediately when opening
            setTimeout(() => {
                updateWalletDisplays();
                
                // Set up periodic wallet check while profile is open
                const walletCheckInterval = setInterval(() => {
                    const profileSidebar = document.getElementById('enhanced-profile-sidebar');
                    if (!profileSidebar || profileSidebar.style.right === '-450px') {
                        clearInterval(walletCheckInterval);
                        return;
                    }
                    updateWalletDisplays();
                }, 1000); // Check every second
            }, 100);
        }
    };
    
    window.closeEnhancedProfile = function() {
        const sidebar = document.getElementById('enhanced-profile-sidebar');
        if (sidebar) {
            sidebar.style.right = '-450px';
            setTimeout(() => {
                if (sidebar.parentNode) {
                    sidebar.remove();
                }
            }, 400);
        }
    };
    
    window.toggleFullscreen = toggleFullscreen;
    
    window.updateProfileField = function(field, value) {
        profileData[field] = value;
        saveProfileData();
    };
    
    window.updateAPIKey = function(service, key) {
        profileData.apiKeys[service] = key;
        saveProfileData();
        
        // Update global API keys if they exist
        if (window.terminal && window.terminal.apiKeys) {
            window.terminal.apiKeys[service] = key;
        }
        
        // Update localStorage for specific services
        if (service === 'chaingpt-nft') {
            localStorage.setItem('chaingpt-nft-api-key', key);
        } else if (service === 'chaingpt-chat') {
            localStorage.setItem('chaingpt-chat-api-key', key);
        }
    };
    
    // New API key management functions
    window.testAllAPIKeys = function() {
        window.terminal.log('🧪 Testing all API keys...', 'info');
        
        const apiServices = [
            { key: 'chaingpt-nft', name: 'ChainGPT NFT', test: () => window.terminal.log('✅ ChainGPT NFT API key configured', 'success') },
            { key: 'chaingpt-chat', name: 'ChainGPT Chat', test: () => window.terminal.log('✅ ChainGPT Chat API key configured', 'success') },
            { key: 'opensea', name: 'OpenSea', test: () => window.terminal.log('✅ OpenSea API key configured', 'success') },
            { key: 'dexscreener', name: 'DexScreener', test: () => window.terminal.log('✅ DexScreener API key configured', 'success') },
            { key: 'defillama', name: 'DeFi Llama', test: () => window.terminal.log('✅ DeFi Llama API key configured', 'success') },
            { key: 'alpha-vantage', name: 'Alpha Vantage', test: () => window.terminal.log('✅ Alpha Vantage API key configured', 'success') }
        ];
        
        apiServices.forEach(service => {
            const key = profileData.apiKeys[service.key];
            if (key && key.trim()) {
                service.test();
            } else {
                window.terminal.log(`❌ ${service.name} API key not configured`, 'error');
            }
        });
        
        window.terminal.log('', 'output');
        window.terminal.log('💡 Configure missing API keys in the profile to enable all features', 'info');
    };
    
    window.clearAllAPIKeys = function() {
        if (confirm('⚠️ Are you sure you want to clear all API keys? This action cannot be undone.')) {
            // Clear all API keys
            profileData.apiKeys = {};
            saveProfileData();
            
            // Clear localStorage
            localStorage.removeItem('chaingpt-nft-api-key');
            localStorage.removeItem('chaingpt-chat-api-key');
            
            // Update UI
            updateAPIKeysUI();
            
            window.terminal.log('🗑️ All API keys cleared', 'info');
        }
    };
    
    window.exportAPIKeys = function() {
        const apiKeysData = {
            timestamp: new Date().toISOString(),
            apiKeys: profileData.apiKeys
        };
        
        const dataStr = JSON.stringify(apiKeysData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `omega-terminal-api-keys-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        window.terminal.log('📤 API keys exported successfully', 'success');
    };
    
    
    window.registerENSFromProfile = async function() {
        const ensNameField = document.getElementById('enhanced-ens-name');
        const ensName = ensNameField.value.trim();
        
        if (!ensName) {
            window.terminal.log('❌ Please enter an ENS name', 'error');
            return;
        }
        
        const success = await registerENS(ensName);
        if (success) {
            ensNameField.value = '';
        }
    };
    
    window.addToAddressBookFromProfile = function() {
        const nameField = document.getElementById('address-book-name');
        const addressField = document.getElementById('address-book-address');
        
        const name = nameField.value.trim();
        const address = addressField.value.trim();
        
        if (!name || !address) {
            window.terminal.log('❌ Please enter both name and address', 'error');
            return;
        }
        
        addToAddressBook(name, address);
        nameField.value = '';
        addressField.value = '';
    };
    
    window.removeFromAddressBook = removeFromAddressBook;
    
    // Python Script Management
    window.uploadPythonScript = function(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const script = {
                id: Date.now(),
                name: file.name.replace('.py', ''),
                content: e.target.result,
                size: file.size,
                uploaded: new Date().toISOString()
            };
            
            profileData.pythonScripts.push(script);
            saveProfileData();
            updatePythonScriptsUI();
            
            // Also upload to Python system if available
            if (window.omegaPython && window.omegaPython.uploadScript) {
                window.omegaPython.uploadScript(script.name, script.content);
            }
            
            window.terminal.log(`✅ Python script uploaded: ${script.name}`, 'success');
        };
        reader.readAsText(file);
    };
    
    window.createPythonScript = function() {
        const nameField = document.getElementById('python-script-name');
        const name = nameField.value.trim();
        
        if (!name) {
            window.terminal.log('❌ Please enter a script name', 'error');
            return;
        }
        
        const script = {
            id: Date.now(),
            name: name,
            content: `# ${name}\nprint("Hello from ${name}!")\n`,
            size: 0,
            uploaded: new Date().toISOString()
        };
        
        profileData.pythonScripts.push(script);
        saveProfileData();
        updatePythonScriptsUI();
        
        // Also create in Python system if available
        if (window.omegaPython && window.omegaPython.uploadScript) {
            window.omegaPython.uploadScript(script.name, script.content);
        }
        
        nameField.value = '';
        window.terminal.log(`✅ Python script created: ${name}`, 'success');
    };
    
    window.selectPythonScript = function(index) {
        // Remove previous selection
        document.querySelectorAll('[id^="python-script-"]').forEach(el => {
            el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            el.style.background = 'rgba(28, 28, 30, 0.5)';
        });
        
        // Select current script
        const scriptEl = document.getElementById(`python-script-${index}`);
        if (scriptEl) {
            scriptEl.style.border = '1px solid #007AFF';
            scriptEl.style.background = 'rgba(0, 122, 255, 0.1)';
        }
        
        // Store selected index
        window.selectedPythonScriptIndex = index;
    };
    
    window.runPythonScriptFromProfile = function() {
        if (window.selectedPythonScriptIndex === undefined) {
            window.terminal.log('❌ Please select a script first', 'error');
            return;
        }
        
        const script = profileData.pythonScripts[window.selectedPythonScriptIndex];
        if (!script) {
            window.terminal.log('❌ Script not found', 'error');
            return;
        }
        
        // Run script using Python system
        if (window.omegaPython && window.omegaPython.runScript) {
            window.omegaPython.runScript(script.name);
            window.terminal.log(`▶️ Running Python script: ${script.name}`, 'info');
        } else {
            window.terminal.log('❌ Python system not available', 'error');
        }
    };
    
    window.deletePythonScriptFromProfile = function() {
        if (window.selectedPythonScriptIndex === undefined) {
            window.terminal.log('❌ Please select a script first', 'error');
            return;
        }
        
        const script = profileData.pythonScripts[window.selectedPythonScriptIndex];
        if (!script) {
            window.terminal.log('❌ Script not found', 'error');
            return;
        }
        
        // Remove from profile data
        profileData.pythonScripts.splice(window.selectedPythonScriptIndex, 1);
        saveProfileData();
        updatePythonScriptsUI();
        
        // Remove from Python system if available
        if (window.omegaPython && window.omegaPython.deleteScript) {
            window.omegaPython.deleteScript(script.name);
        }
        
        window.selectedPythonScriptIndex = undefined;
        window.terminal.log(`🗑️ Deleted Python script: ${script.name}`, 'info');
    };
    
    // Terminal Chatter Integration
    window.openChatFromProfile = function() {
        if (window.openChat) {
            window.openChat();
            window.terminal.log('Opening Terminal Chatter...', 'info');
        } else {
            window.terminal.log('❌ Terminal Chatter not available', 'error');
        }
    };
    
    window.uploadEnhancedImage = function(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            profileData.profilePicture = e.target.result;
            saveProfileData();
            updateProfileUI();
            window.terminal.log('✅ Profile picture updated', 'success');
        };
        reader.readAsDataURL(file);
    };
    
    window.saveEnhancedProfile = function() {
        saveProfileData();
        window.terminal.log('✅ Profile saved successfully', 'success');
    };
    
    // ===================================
    // COMMAND HANDLER
    // ===================================
    
    window.handleEnhancedProfileCommand = function(args) {
        const subcommand = args[0]?.toLowerCase();
        
        switch (subcommand) {
            case 'open':
            case 'show':
                openEnhancedProfile();
                break;
                
            case 'close':
                closeEnhancedProfile();
                break;
                
            case 'fullscreen':
                toggleFullscreen();
                break;
                
            case 'help':
                showEnhancedProfileHelp();
                break;
                
            default:
                openEnhancedProfile();
        }
    };
    
    function showEnhancedProfileHelp() {
        window.terminal.log('Enhanced Profile Commands:', 'info');
        window.terminal.log('', 'output');
        window.terminal.log('  profile open          - Open enhanced profile', 'output');
        window.terminal.log('  profile close         - Close profile', 'output');
        window.terminal.log('  profile fullscreen    - Toggle fullscreen mode', 'output');
        window.terminal.log('  profile help          - Show this help', 'output');
        window.terminal.log('', 'output');
        window.terminal.log('Features:', 'info');
        window.terminal.log('  Omega ENS registration', 'output');
        window.terminal.log('  Address book management', 'output');
        window.terminal.log('  Terminal Chatter (Telegram-like)', 'output');
        window.terminal.log('  Python script management', 'output');
        window.terminal.log('  API key management', 'output');
        window.terminal.log('  Fullscreen mode', 'output');
    }
    
    // ===================================
    // INTEGRATION WITH MAIN TERMINAL
    // ===================================
    
    function integrateEnhancedProfile() {
        if (window.terminal && window.terminal.executeCommand) {
            console.log('🔧 Integrating Enhanced Profile with main terminal...');
            
            const originalExecuteCommand = window.terminal.executeCommand;
            window.terminal.executeCommand = function(command) {
                const args = command.trim().split(/\s+/);
                const cmd = args[0].toLowerCase();
                
                if (cmd === 'profile') {
                    handleEnhancedProfileCommand(args.slice(1));
                    return;
                }
                
                return originalExecuteCommand.call(this, command);
            };
            
            console.log('✅ Enhanced Profile integration successful!');
            return true;
        }
        return false;
    }
    
    // Try to integrate when ready
    function tryIntegrateEnhancedProfile() {
        if (!integrateEnhancedProfile()) {
            setTimeout(tryIntegrateEnhancedProfile, 500);
        }
    }
    
    // Start integration
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryIntegrateEnhancedProfile);
    } else {
        tryIntegrateEnhancedProfile();
    }
    
    // Initialize
    loadProfileData();
    
    console.log('✅ Enhanced Profile System loaded successfully!');
    console.log('💡 Use "profile" command to open enhanced profile');
    
})();
