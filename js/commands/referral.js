// ===================================
// OMEGA TERMINAL REFERRAL COMMANDS
// Social-First Referral Integration
// ===================================

window.OmegaCommands = window.OmegaCommands || {};

console.log('[DEBUG] Loading OmegaCommands.Referral...');

window.OmegaCommands.Referral = {
    // Production API - Correct Omega Network API endpoints
    WILDCARD_API: 'https://omeganetwork.co/api/wildcard',
    REFERRAL_API: 'https://omeganetwork.co/api/wildcard/referrals',
    AMBASSADOR_API: 'https://omeganetwork.co/api/v1/ambassadors',
    // Local development server (fallback for testing)
    LOCAL_API: 'http://localhost:3000/api/referral',
    // Mock API for demonstration (when no server is available)
    MOCK_API: true,

    // Main referral command router
    async referral(terminal, args) {
        if (!args || args.length < 2) {
            await this.help(terminal);
            return;
        }

        const subCommand = args[1].toLowerCase();
        
        try {
            switch (subCommand) {
                case 'create':
                    await this.create(terminal, args.slice(2));
                    break;
                case 'stats':
                    await this.stats(terminal, args.slice(2));
                    break;
                case 'share':
                    await this.share(terminal, args.slice(2));
                    break;
                case 'leaderboard':
                    await this.leaderboard(terminal, args.slice(2));
                    break;
                case 'dashboard':
                    this.openDashboard(terminal);
                    break;
                case 'complete':
                    await this.complete(terminal, args.slice(2));
                    break;
                case 'help':
                    await this.help(terminal);
                    break;
                default:
                    terminal.log(`❌ Unknown referral command: ${subCommand}`, 'error');
                    terminal.log('Type "referral help" for available commands', 'info');
            }
        } catch (error) {
            console.error('Referral command error:', error);
            terminal.log(`❌ Referral command failed: ${error.message}`, 'error');
        }
    },

    // Create referral code
    async create(terminal, args) {
        // Get current wallet address
        let walletAddress = null;
        
        // Try to get from session wallet
        console.log('[DEBUG] Checking wallet connection...');
        console.log('[DEBUG] window.OmegaWallet exists:', !!window.OmegaWallet);
        
        // Check if global OmegaWallet exists (with error handling)
        let globalOmegaWallet = false;
        try {
            globalOmegaWallet = !!OmegaWallet;
        } catch (e) {
            console.log('[DEBUG] OmegaWallet (global) not defined:', e.message);
        }
        console.log('[DEBUG] OmegaWallet (global) exists:', globalOmegaWallet);
        
        console.log('[DEBUG] getCurrentAddress method exists:', !!(window.OmegaWallet && window.OmegaWallet.getCurrentAddress));
        
        let globalGetCurrentAddress = false;
        try {
            globalGetCurrentAddress = !!(OmegaWallet && OmegaWallet.getCurrentAddress);
        } catch (e) {
            console.log('[DEBUG] OmegaWallet.getCurrentAddress not accessible:', e.message);
        }
        console.log('[DEBUG] getCurrentAddress method exists (global):', globalGetCurrentAddress);
        
        if (window.OmegaWallet && window.OmegaWallet.getCurrentAddress) {
            walletAddress = window.OmegaWallet.getCurrentAddress();
            console.log('[DEBUG] Got wallet address from window.OmegaWallet:', walletAddress);
        } else {
            try {
                if (OmegaWallet && OmegaWallet.getCurrentAddress) {
                    walletAddress = OmegaWallet.getCurrentAddress();
                    console.log('[DEBUG] Got wallet address from OmegaWallet (global):', walletAddress);
                }
            } catch (e) {
                console.log('[DEBUG] Error accessing global OmegaWallet:', e.message);
            }
        }
        
        // Or from provided argument
        if (args && args[0]) {
            walletAddress = args[0];
            console.log('[DEBUG] Using provided wallet address:', walletAddress);
        }
        
        // Try to get from terminal object as fallback
        if (!walletAddress && terminal.userAddress) {
            walletAddress = terminal.userAddress;
            console.log('[DEBUG] Got wallet address from terminal.userAddress:', walletAddress);
        }
        
        // Additional debug info
        console.log('[DEBUG] Terminal object available:', !!terminal);
        console.log('[DEBUG] terminal.userAddress:', terminal.userAddress);
        console.log('[DEBUG] terminal.provider:', !!terminal.provider);
        console.log('[DEBUG] terminal.signer:', !!terminal.signer);
        
        if (!walletAddress) {
            terminal.log('❌ No wallet address found. Please connect a wallet first or provide an address:', 'error');
            terminal.log('Usage: referral create [wallet_address] [@twitter] [discord#id]', 'info');
            console.log('[DEBUG] No wallet address available');
            return;
        }
        
        const twitterHandle = args[1] || null;
        const discordId = args[2] || null;
        
        terminal.log('Creating your referral code...', 'info');
        terminal.log('🔗 Connecting to Omega Network Wildcard API...', 'info');
        
        try {
            let response;
            let result;
            
            // Try Omega Network Wildcard API first
            try {
                response = await fetch(`${this.REFERRAL_API}/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress,
                        twitterHandle,
                        discordId
                    })
                });
                
                console.log('[DEBUG] Omega Network Wildcard API response status:', response.status);
                
                // Check if response is successful
                if (response.ok) {
                    result = await response.json();
                    console.log('[DEBUG] ✅ Omega Network API working!');
                } else {
                    throw new Error(`Omega Network API returned ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.log('[DEBUG] Production API failed:', error.message);
                console.log('[DEBUG] Trying local API...');
                
                try {
                    // Try local API as fallback
                    response = await fetch(`${this.LOCAL_API}/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            walletAddress,
                            twitterHandle,
                            discordId
                        })
                    });
                    
                    console.log('[DEBUG] Local API response status:', response.status);
                    
                    if (response.ok) {
                        result = await response.json();
                    } else {
                        throw new Error(`Local API returned ${response.status}: ${response.statusText}`);
                    }
                } catch (localError) {
                    console.log('[DEBUG] Local API failed:', localError.message);
                    console.log('[DEBUG] Using mock API for demonstration...');
                    
                    // Use mock API for demonstration
                    result = this.getMockReferralResult(walletAddress, twitterHandle, discordId);
                }
            }
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('Referral code created successfully!', 'success');
            terminal.log(`Your Code: ${result.referralCode}`, 'success');
            terminal.log(`Your Link: ${result.referralUrl}`, 'info');
            
            // Show API status message if using mock
            if (result.message && result.message.includes('Mock')) {
                terminal.log('', 'info');
                terminal.log('ℹ️  Note: Using demonstration mode (Omega Network API not available)', 'info');
                terminal.log('   This is a mock referral for testing purposes', 'info');
                terminal.log('   Contact Omega Network for production API access', 'info');
            } else {
                terminal.log('', 'info');
                terminal.log('✅ Connected to Omega Network Wildcard API', 'success');
            }
            
            terminal.log('', 'info');
            terminal.log('SOCIAL SHARING:', 'info');
            terminal.log(`Twitter: "${result.socialShare.twitter}"`, 'info');
            terminal.log(`Discord: "${result.socialShare.discord}"`, 'info');
            terminal.log('', 'info');
            terminal.log('Tip: Use "referral share" to post automatically!', 'success');
            
        } catch (error) {
            console.error('Referral creation error:', error);
            terminal.log(`❌ Failed to create referral: ${error.message}`, 'error');
        }
    },

    // Get referral stats
    async stats(terminal, args) {
        let walletAddress = null;
        
        // Get wallet address (same logic as create)
        console.log('[DEBUG] Stats: Checking wallet connection...');
        console.log('[DEBUG] Stats: window.OmegaWallet exists:', !!window.OmegaWallet);
        
        // Check if global OmegaWallet exists (with error handling)
        let globalOmegaWallet = false;
        try {
            globalOmegaWallet = !!OmegaWallet;
        } catch (e) {
            console.log('[DEBUG] Stats: OmegaWallet (global) not defined:', e.message);
        }
        console.log('[DEBUG] Stats: OmegaWallet (global) exists:', globalOmegaWallet);
        
        console.log('[DEBUG] Stats: getCurrentAddress method exists:', !!(window.OmegaWallet && window.OmegaWallet.getCurrentAddress));
        
        let globalGetCurrentAddress = false;
        try {
            globalGetCurrentAddress = !!(OmegaWallet && OmegaWallet.getCurrentAddress);
        } catch (e) {
            console.log('[DEBUG] Stats: OmegaWallet.getCurrentAddress not accessible:', e.message);
        }
        console.log('[DEBUG] Stats: getCurrentAddress method exists (global):', globalGetCurrentAddress);
        
        if (window.OmegaWallet && window.OmegaWallet.getCurrentAddress) {
            walletAddress = window.OmegaWallet.getCurrentAddress();
            console.log('[DEBUG] Stats: Got wallet address from window.OmegaWallet:', walletAddress);
        } else {
            try {
                if (OmegaWallet && OmegaWallet.getCurrentAddress) {
                    walletAddress = OmegaWallet.getCurrentAddress();
                    console.log('[DEBUG] Stats: Got wallet address from OmegaWallet (global):', walletAddress);
                }
            } catch (e) {
                console.log('[DEBUG] Stats: Error accessing global OmegaWallet:', e.message);
            }
        }
        
        if (args && args[0]) {
            walletAddress = args[0];
            console.log('[DEBUG] Stats: Using provided wallet address:', walletAddress);
        }
        
        // Try to get from terminal object as fallback
        if (!walletAddress && terminal.userAddress) {
            walletAddress = terminal.userAddress;
            console.log('[DEBUG] Stats: Got wallet address from terminal.userAddress:', walletAddress);
        }
        
        if (!walletAddress) {
            terminal.log('❌ No wallet address found. Please connect a wallet first.', 'error');
            console.log('[DEBUG] Stats: No wallet address available');
            return;
        }
        
        terminal.log('Loading your referral stats...', 'info');
        
        try {
            let response;
            let result;
            
            // Try Omega Network Wildcard API first
            try {
                response = await fetch(`${this.WILDCARD_API}/user/profile?walletAddress=${walletAddress}`);
                console.log('[DEBUG] Stats: Omega Network Wildcard API response status:', response.status);
                
                if (response.ok) {
                    const profileData = await response.json();
                    // Also get referral stats
                    const statsResponse = await fetch(`${this.REFERRAL_API}/stats?walletAddress=${walletAddress}`);
                    const statsData = statsResponse.ok ? await statsResponse.json() : {};
                    
                    result = {
                        success: true,
                        userInfo: {
                            ...profileData,
                            ...statsData
                        }
                    };
                    console.log('[DEBUG] ✅ Omega Network API working for stats!');
                } else {
                    throw new Error(`Omega Network API returned ${response.status}: ${response.statusText}`);
                }
                } catch (error) {
                    console.log('[DEBUG] Stats: Production API failed:', error.message);
                    console.log('[DEBUG] Stats: Trying local API...');
                    
                    try {
                        // Try local API as fallback
                        response = await fetch(`${this.LOCAL_API}/stats/${walletAddress}`);
                        console.log('[DEBUG] Stats: Local API response status:', response.status);
                        
                        if (response.ok) {
                            result = await response.json();
                        } else {
                            throw new Error(`Local API returned ${response.status}: ${response.statusText}`);
                        }
                    } catch (localError) {
                        console.log('[DEBUG] Stats: Local API failed:', localError.message);
                        console.log('[DEBUG] Stats: Using mock API for demonstration...');
                        
                        // Use mock API for demonstration
                        result = this.getMockStatsResult(walletAddress);
                    }
                }
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('REFERRAL DASHBOARD', 'success');
            terminal.log('══════════════════════════════════', 'success');
            terminal.log(`Referral Code: ${result.userInfo.referralCode}`, 'info');
            terminal.log(`Referral URL: ${result.userInfo.referralUrl}`, 'info');
            terminal.log('', 'info');
            
            terminal.log('PERFORMANCE STATS:', 'info');
            terminal.log(`Total Referrals: ${result.stats.totalReferrals}`, 'info');
            terminal.log(`Total Earned: ${result.stats.totalEarned} OMEGA`, 'success');
            terminal.log(`Pending Rewards: ${result.stats.pendingRewards} OMEGA`, 'warning');
            terminal.log(`Confirmed Rewards: ${result.stats.confirmedRewards} OMEGA`, 'success');
            terminal.log('', 'info');
            
            if (result.recentReferrals && result.recentReferrals.length > 0) {
                terminal.log('RECENT REFERRALS:', 'info');
                result.recentReferrals.slice(0, 3).forEach((ref, index) => {
                    const date = new Date(ref.created_at).toLocaleDateString();
                    terminal.log(`   ${index + 1}. ${ref.referee_wallet.substring(0, 10)}... (+${ref.referral_reward} OMEGA) - ${date}`, 'info');
                });
            }
            
            terminal.log('', 'info');
            terminal.log('Commands: referral share | referral leaderboard | referral dashboard', 'success');
            
        } catch (error) {
            console.error('Referral stats error:', error);
            terminal.log(`❌ Failed to load stats: ${error.message}`, 'error');
        }
    },

    // Social sharing
    async share(terminal, args) {
        const platform = args[0] ? args[0].toLowerCase() : 'all';
        
        let walletAddress = null;
        if (window.OmegaWallet && window.OmegaWallet.getCurrentAddress) {
            walletAddress = window.OmegaWallet.getCurrentAddress();
        } else {
            try {
                if (OmegaWallet && OmegaWallet.getCurrentAddress) {
                    walletAddress = OmegaWallet.getCurrentAddress();
                }
            } catch (e) {
                console.log('[DEBUG] Share: Error accessing global OmegaWallet:', e.message);
            }
        }
        
        // Try to get from terminal object as fallback
        if (!walletAddress && terminal.userAddress) {
            walletAddress = terminal.userAddress;
            console.log('[DEBUG] Share: Got wallet address from terminal.userAddress:', walletAddress);
        }
        
        if (!walletAddress) {
            terminal.log('❌ Please connect your wallet first to get sharing links', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.REFERRAL_API}/stats/${walletAddress}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('SOCIAL SHARING OPTIONS:', 'info');
            terminal.log('══════════════════════════════════', 'info');
            terminal.log('', 'info');
            
            if (platform === 'all' || platform === 'twitter') {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.socialShare.twitter)}`;
                terminal.log('TWITTER SHARE:', 'info');
                terminal.log(`Link: ${twitterUrl}`, 'success');
                terminal.log('', 'info');
            }
            
            if (platform === 'all' || platform === 'discord') {
                terminal.log('DISCORD SHARE:', 'info');
                terminal.log(`Message: "${result.socialShare.discord}"`, 'success');
                terminal.log('', 'info');
            }
            
            terminal.log('YOUR REFERRAL LINK:', 'info');
            terminal.log(`${result.userInfo.referralUrl}`, 'success');
            terminal.log('', 'info');
            terminal.log('Earn 10 OMEGA for each successful referral + 2 OMEGA for social sharing!', 'success');
            
            // Track social campaign
            if (platform !== 'all') {
                await this.trackSocialCampaign(walletAddress, platform);
            }
            
        } catch (error) {
            console.error('Social sharing error:', error);
            terminal.log(`❌ Failed to generate sharing links: ${error.message}`, 'error');
        }
    },

    // Track social campaign
    async trackSocialCampaign(walletAddress, platform) {
        try {
            await fetch(`${this.REFERRAL_API}/campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress,
                    campaignType: platform + '_share',
                    content: `Shared referral link on ${platform}`
                })
            });
        } catch (error) {
            console.error('Campaign tracking error:', error);
        }
    },

    // Show leaderboard
    async leaderboard(terminal, args) {
        const limit = args[0] ? parseInt(args[0]) : 10;
        
        terminal.log('Loading referral leaderboard...', 'info');
        
        try {
            let response;
            let result;
            
            // Try Omega Network Ambassador API first
            try {
                response = await fetch(`${this.AMBASSADOR_API}/leaderboard?limit=${limit}&includeStats=true`);
                console.log('[DEBUG] Leaderboard: Omega Network Ambassador API response status:', response.status);
                
                if (response.ok) {
                    result = await response.json();
                    console.log('[DEBUG] ✅ Omega Network Ambassador API working!');
                } else {
                    // Try wildcard leaderboard as fallback
                    console.log('[DEBUG] Ambassador API failed, trying wildcard leaderboard...');
                    response = await fetch(`${this.WILDCARD_API}/leaderboard?limit=${limit}`);
                    if (response.ok) {
                        result = await response.json();
                        console.log('[DEBUG] ✅ Omega Network Wildcard API working!');
                    } else {
                        throw new Error(`Omega Network API returned ${response.status}: ${response.statusText}`);
                    }
                }
            } catch (error) {
                console.log('[DEBUG] Leaderboard: Production API failed:', error.message);
                console.log('[DEBUG] Leaderboard: Trying local API...');
                
                try {
                    // Try local API as fallback
                    response = await fetch(`${this.LOCAL_API}/leaderboard?limit=${limit}`);
                    console.log('[DEBUG] Leaderboard: Local API response status:', response.status);
                    
                    if (response.ok) {
                        result = await response.json();
                    } else {
                        throw new Error(`Local API returned ${response.status}: ${response.statusText}`);
                    }
                } catch (localError) {
                    console.log('[DEBUG] Leaderboard: Local API failed:', localError.message);
                    console.log('[DEBUG] Leaderboard: Using mock API for demonstration...');
                    
                    // Use mock API for demonstration
                    result = this.getMockLeaderboardResult(limit);
                }
            }
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('OMEGA AMBASSADOR LEADERBOARD', 'success');
            terminal.log('══════════════════════════════════════', 'success');
            terminal.log('', 'info');
            
            // Platform stats
            const stats = result.platformStats;
            terminal.log(`Total Users: ${stats.totalUsers} | Total Referrals: ${stats.totalReferrals} | Rewards: ${stats.totalRewardsDistributed} OMEGA`, 'info');
            terminal.log('', 'info');
            
            // Leaderboard
            result.leaderboard.forEach((user, index) => {
                const rank = user.rank === 1 ? '[1st]' : user.rank === 2 ? '[2nd]' : user.rank === 3 ? '[3rd]' : `[${user.rank}]`;
                const handle = user.twitterHandle || 'Anonymous';
                terminal.log(`${rank} ${handle} - ${user.referrals} referrals (${user.earned} OMEGA)`, 'info');
            });
            
            terminal.log('', 'info');
            terminal.log('Start referring friends to climb the leaderboard!', 'success');
            
        } catch (error) {
            console.error('Leaderboard error:', error);
            terminal.log(`❌ Failed to load leaderboard: ${error.message}`, 'error');
        }
    },

    // Complete referral (for testing/admin)
    async complete(terminal, args) {
        if (args.length < 2) {
            terminal.log('Usage: referral complete <referral_code> <new_wallet_address> [platform]', 'error');
            return;
        }
        
        const referralCode = args[0];
        const newWalletAddress = args[1];
        const sourcePlatform = args[2] || 'terminal';
        
        terminal.log('Completing referral...', 'info');
        
        try {
            const response = await fetch(`${this.REFERRAL_API}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referralCode,
                    newWalletAddress,
                    sourcePlatform
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('Referral completed successfully!', 'success');
            terminal.log(result.message, 'success');
            terminal.log(`Rewards distributed:`, 'info');
            terminal.log(`   Referrer: ${result.rewards.referrer}`, 'success');
            terminal.log(`   New User: ${result.rewards.referee}`, 'success');
            
        } catch (error) {
            console.error('Referral completion error:', error);
            terminal.log(`❌ Failed to complete referral: ${error.message}`, 'error');
        }
    },

    // Open dashboard in new window
    openDashboard(terminal) {
        terminal.log('Opening ambassador dashboard...', 'info');
        
        try {
            const dashboardUrl = 'https://omeganetwork.co/ambassador/dashboard';
            window.open(dashboardUrl, '_blank');
            terminal.log('Dashboard opened in new tab!', 'success');
            terminal.log(`URL: ${dashboardUrl}`, 'info');
        } catch (error) {
            terminal.log('❌ Failed to open dashboard. Make sure referral server is running.', 'error');
            terminal.log('Start server: node omega-referral-system.js', 'info');
        }
    },

    // Help command
    async help(terminal) {
        terminal.log('OMEGA AMBASSADOR PROGRAM', 'info');
        terminal.log('═══════════════════════════════════════', 'info');
        terminal.log('', 'info');
        
        terminal.log('COMMANDS:', 'info');
        terminal.log('  referral create [wallet] [@twitter] [discord]  Generate referral link', 'info');
        terminal.log('  referral stats [wallet]                        View your statistics', 'info');
        terminal.log('  referral share [platform]                      Get sharing links', 'info');
        terminal.log('  referral leaderboard [limit]                   View top ambassadors', 'info');
        terminal.log('  referral dashboard                             Open web dashboard', 'info');
        terminal.log('', 'info');
        
        terminal.log('EXAMPLES:', 'info');
        terminal.log('  referral create                                Use connected wallet', 'info');
        terminal.log('  referral create 0x123... @myhandle discord#1234 With social handles', 'info');
        terminal.log('  referral share twitter                         Share on Twitter', 'info');
        terminal.log('  referral leaderboard 20                        Top 20 ambassadors', 'info');
        terminal.log('', 'info');
        
        terminal.log('REWARDS:', 'info');
        terminal.log('  10 OMEGA tokens for each successful referral', 'success');
        terminal.log('  5 OMEGA tokens for new users who join', 'success');
        terminal.log('  2 OMEGA bonus for social media sharing', 'success');
        terminal.log('', 'info');
        
        terminal.log('Get started: referral create', 'success');
    },

    // Mock API functions for demonstration when real APIs are not available
    getMockReferralResult: function(walletAddress, twitterHandle, discordId) {
        const referralCode = this.generateMockReferralCode();
        const referralUrl = `https://omeganetwork.co/ref/${referralCode}`;
        
        return {
            success: true,
            referralCode: referralCode,
            referralUrl: referralUrl,
            walletAddress: walletAddress,
            twitterHandle: twitterHandle,
            discordId: discordId,
            socialShare: {
                twitter: `🚀 Join me on Omega Network! Use my referral code: ${referralCode} and earn 10 OMEGA tokens! ${referralUrl}`,
                discord: `Join Omega Network with my referral code: **${referralCode}** and earn 10 OMEGA tokens! ${referralUrl}`
            },
            message: "Mock referral created for demonstration (Omega Network API not available)"
        };
    },

    getMockStatsResult: function(walletAddress) {
        return {
            success: true,
            userInfo: {
                walletAddress: walletAddress,
                referralCode: this.generateMockReferralCode(),
                referralUrl: `https://omeganetwork.co/ref/${this.generateMockReferralCode()}`,
                totalReferrals: Math.floor(Math.random() * 50) + 1,
                totalEarnings: (Math.random() * 1000).toFixed(2),
                rank: Math.floor(Math.random() * 100) + 1
            },
            message: "Mock stats for demonstration (Omega Network API not available)"
        };
    },

    getMockLeaderboardResult: function(limit = 10) {
        const leaderboard = [];
        for (let i = 1; i <= limit; i++) {
            leaderboard.push({
                rank: i,
                walletAddress: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
                totalReferrals: Math.floor(Math.random() * 100) + 1,
                totalEarnings: (Math.random() * 5000).toFixed(2),
                referralCode: this.generateMockReferralCode()
            });
        }
        
        return {
            success: true,
            leaderboard: leaderboard,
            message: "Mock leaderboard for demonstration (Omega Network API not available)"
        };
    },

    generateMockReferralCode: function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

console.log('[DEBUG] ✅ OmegaCommands.Referral loaded successfully'); 