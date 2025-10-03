// ===================================
// OMEGA TERMINAL REFERRAL COMMANDS
// Social-First Referral Integration
// ===================================

window.OmegaCommands = window.OmegaCommands || {};

console.log('[DEBUG] Loading OmegaCommands.Referral...');

window.OmegaCommands.Referral = {
    REFERRAL_API: 'http://localhost:5000/api/referral',

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
        if (window.OmegaWallet && window.OmegaWallet.getCurrentAddress) {
            walletAddress = window.OmegaWallet.getCurrentAddress();
        }
        
        // Or from provided argument
        if (args && args[0]) {
            walletAddress = args[0];
        }
        
        if (!walletAddress) {
            terminal.log('❌ No wallet address found. Please connect a wallet first or provide an address:', 'error');
            terminal.log('Usage: referral create [wallet_address] [@twitter] [discord#id]', 'info');
            return;
        }
        
        const twitterHandle = args[1] || null;
        const discordId = args[2] || null;
        
        terminal.log('🔗 Creating your referral code...', 'info');
        
        try {
            const response = await fetch(`${this.REFERRAL_API}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress,
                    twitterHandle,
                    discordId
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('✅ Referral code created successfully!', 'success');
            terminal.log(`🎯 Your Code: ${result.referralCode}`, 'success');
            terminal.log(`🔗 Your Link: ${result.referralUrl}`, 'info');
            terminal.log('', 'info');
            terminal.log('📢 SOCIAL SHARING:', 'info');
            terminal.log(`🐦 Twitter: "${result.socialShare.twitter}"`, 'info');
            terminal.log(`💬 Discord: "${result.socialShare.discord}"`, 'info');
            terminal.log('', 'info');
            terminal.log('💡 Tip: Use "referral share" to post automatically!', 'success');
            
        } catch (error) {
            console.error('Referral creation error:', error);
            terminal.log(`❌ Failed to create referral: ${error.message}`, 'error');
        }
    },

    // Get referral stats
    async stats(terminal, args) {
        let walletAddress = null;
        
        // Get wallet address (same logic as create)
        if (window.OmegaWallet && window.OmegaWallet.getCurrentAddress) {
            walletAddress = window.OmegaWallet.getCurrentAddress();
        }
        
        if (args && args[0]) {
            walletAddress = args[0];
        }
        
        if (!walletAddress) {
            terminal.log('❌ No wallet address found. Please connect a wallet first.', 'error');
            return;
        }
        
        terminal.log('📊 Loading your referral stats...', 'info');
        
        try {
            const response = await fetch(`${this.REFERRAL_API}/stats/${walletAddress}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('✅ REFERRAL DASHBOARD', 'success');
            terminal.log('═════════════════════', 'success');
            terminal.log(`🎯 Referral Code: ${result.userInfo.referralCode}`, 'info');
            terminal.log(`🔗 Referral URL: ${result.userInfo.referralUrl}`, 'info');
            terminal.log('', 'info');
            
            terminal.log('📈 PERFORMANCE STATS:', 'info');
            terminal.log(`👥 Total Referrals: ${result.stats.totalReferrals}`, 'info');
            terminal.log(`💰 Total Earned: ${result.stats.totalEarned} OMEGA`, 'success');
            terminal.log(`⏳ Pending Rewards: ${result.stats.pendingRewards} OMEGA`, 'warning');
            terminal.log(`✅ Confirmed Rewards: ${result.stats.confirmedRewards} OMEGA`, 'success');
            terminal.log('', 'info');
            
            if (result.recentReferrals && result.recentReferrals.length > 0) {
                terminal.log('🔥 RECENT REFERRALS:', 'info');
                result.recentReferrals.slice(0, 3).forEach((ref, index) => {
                    const date = new Date(ref.created_at).toLocaleDateString();
                    terminal.log(`   ${index + 1}. ${ref.referee_wallet.substring(0, 10)}... (+${ref.referral_reward} OMEGA) - ${date}`, 'info');
                });
            }
            
            terminal.log('', 'info');
            terminal.log('💡 Commands: referral share | referral leaderboard | referral dashboard', 'success');
            
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
            
            terminal.log('📢 SOCIAL SHARING OPTIONS:', 'info');
            terminal.log('═══════════════════════════', 'info');
            terminal.log('', 'info');
            
            if (platform === 'all' || platform === 'twitter') {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.socialShare.twitter)}`;
                terminal.log('🐦 TWITTER SHARE:', 'info');
                terminal.log(`Link: ${twitterUrl}`, 'success');
                terminal.log('', 'info');
            }
            
            if (platform === 'all' || platform === 'discord') {
                terminal.log('💬 DISCORD SHARE:', 'info');
                terminal.log(`Message: "${result.socialShare.discord}"`, 'success');
                terminal.log('', 'info');
            }
            
            terminal.log('📋 YOUR REFERRAL LINK:', 'info');
            terminal.log(`${result.userInfo.referralUrl}`, 'success');
            terminal.log('', 'info');
            terminal.log('💰 Earn 10 OMEGA for each successful referral + 2 OMEGA for social sharing!', 'success');
            
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
        
        terminal.log('🏆 Loading referral leaderboard...', 'info');
        
        try {
            const response = await fetch(`${this.REFERRAL_API}/leaderboard?limit=${limit}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            terminal.log('🏆 OMEGA REFERRAL LEADERBOARD', 'success');
            terminal.log('═══════════════════════════════', 'success');
            terminal.log('', 'info');
            
            // Platform stats
            const stats = result.platformStats;
            terminal.log(`📊 Total Users: ${stats.totalUsers} | Total Referrals: ${stats.totalReferrals} | Rewards: ${stats.totalRewardsDistributed} OMEGA`, 'info');
            terminal.log('', 'info');
            
            // Leaderboard
            result.leaderboard.forEach((user, index) => {
                const emoji = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : '🏅';
                const handle = user.twitterHandle || 'Anonymous';
                terminal.log(`${emoji} #${user.rank} ${handle} - ${user.referrals} referrals (${user.earned} OMEGA)`, 'info');
            });
            
            terminal.log('', 'info');
            terminal.log('💡 Start referring friends to climb the leaderboard!', 'success');
            
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
        
        terminal.log('✅ Completing referral...', 'info');
        
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
            
            terminal.log('🎉 Referral completed successfully!', 'success');
            terminal.log(result.message, 'success');
            terminal.log(`💰 Rewards distributed:`, 'info');
            terminal.log(`   • Referrer: ${result.rewards.referrer}`, 'success');
            terminal.log(`   • New User: ${result.rewards.referee}`, 'success');
            
        } catch (error) {
            console.error('Referral completion error:', error);
            terminal.log(`❌ Failed to complete referral: ${error.message}`, 'error');
        }
    },

    // Open dashboard in new window
    openDashboard(terminal) {
        terminal.log('🚀 Opening referral dashboard...', 'info');
        
        try {
            const dashboardUrl = 'http://localhost:5000/dashboard.html';
            window.open(dashboardUrl, '_blank');
            terminal.log('✅ Dashboard opened in new tab!', 'success');
            terminal.log(`🔗 URL: ${dashboardUrl}`, 'info');
        } catch (error) {
            terminal.log('❌ Failed to open dashboard. Make sure referral server is running.', 'error');
            terminal.log('Start server: node omega-referral-system.js', 'info');
        }
    },

    // Help command
    async help(terminal) {
        terminal.log('🔗 OMEGA REFERRAL COMMANDS', 'info');
        terminal.log('═════════════════════════', 'info');
        terminal.log('', 'info');
        
        terminal.log('📋 BASIC COMMANDS:', 'info');
        terminal.log('  referral create [wallet] [@twitter] [discord]  Create referral code', 'info');
        terminal.log('  referral stats [wallet]                        View your stats', 'info');
        terminal.log('  referral share [platform]                      Get sharing links', 'info');
        terminal.log('  referral leaderboard [limit]                   View top referrers', 'info');
        terminal.log('  referral dashboard                              Open web dashboard', 'info');
        terminal.log('', 'info');
        
        terminal.log('🎯 EXAMPLES:', 'info');
        terminal.log('  referral create                                 # Use connected wallet', 'info');
        terminal.log('  referral create 0x123... @myhandle discord#1234 # With social handles', 'info');
        terminal.log('  referral share twitter                         # Share on Twitter', 'info');
        terminal.log('  referral leaderboard 20                        # Top 20 referrers', 'info');
        terminal.log('', 'info');
        
        terminal.log('💰 REWARDS:', 'info');
        terminal.log('  • 10 OMEGA tokens for each successful referral', 'success');
        terminal.log('  • 5 OMEGA tokens for new users who join', 'success');
        terminal.log('  • 2 OMEGA bonus for social media sharing', 'success');
        terminal.log('', 'info');
        
        terminal.log('🚀 Get started: referral create', 'success');
    }
};

console.log('[DEBUG] OmegaCommands.Referral loaded successfully'); 