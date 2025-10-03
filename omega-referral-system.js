// ===================================
// OMEGA NETWORK REFERRAL SYSTEM
// Social-First Referral Program
// ===================================

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===================================
// DATABASE SETUP
// ===================================

const db = new sqlite3.Database('omega-referrals.db');

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet_address TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE NOT NULL,
        twitter_handle TEXT,
        discord_id TEXT,
        total_referrals INTEGER DEFAULT 0,
        total_earned DECIMAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Referrals table
    db.run(`CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_code TEXT NOT NULL,
        referee_wallet TEXT NOT NULL,
        referee_ip TEXT,
        source_platform TEXT, -- 'twitter', 'discord', 'direct'
        status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
        referral_reward DECIMAL DEFAULT 0.0,
        referee_reward DECIMAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY(referrer_code) REFERENCES users(referral_code)
    )`);

    // Rewards table
    db.run(`CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet_address TEXT NOT NULL,
        referral_id INTEGER,
        reward_type TEXT, -- 'referral', 'signup', 'milestone'
        amount DECIMAL NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'confirmed'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        sent_at DATETIME,
        FOREIGN KEY(referral_id) REFERENCES referrals(id)
    )`);

    // Social campaigns table
    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet_address TEXT NOT NULL,
        campaign_type TEXT, -- 'twitter_post', 'discord_share', 'custom'
        content TEXT,
        social_url TEXT,
        engagement_count INTEGER DEFAULT 0,
        bonus_earned DECIMAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ Database tables initialized');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

function generateReferralCode(walletAddress) {
    const hash = crypto.createHash('sha256').update(walletAddress + Date.now()).digest('hex');
    return 'OMEGA' + hash.substring(0, 8).toUpperCase();
}

function validateWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// ===================================
// API ENDPOINTS
// ===================================

// Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'Omega Referral System',
        version: '1.0.0',
        status: 'operational',
        features: [
            'referral_links',
            'social_integration', 
            'reward_tracking',
            'analytics_dashboard'
        ]
    });
});

// Create referral code for user
app.post('/api/referral/create', (req, res) => {
    const { walletAddress, twitterHandle, discordId } = req.body;
    
    if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid wallet address' 
        });
    }

    const referralCode = generateReferralCode(walletAddress);
    
    db.run(`INSERT OR REPLACE INTO users 
            (wallet_address, referral_code, twitter_handle, discord_id) 
            VALUES (?, ?, ?, ?)`, 
           [walletAddress, referralCode, twitterHandle, discordId], 
           function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Database error' 
            });
        }
        
        res.json({
            success: true,
            referralCode,
            referralUrl: `https://omega.network/ref/${referralCode}`,
            socialShare: {
                twitter: `🚀 Join me on @OmegaNetwork! Get FREE $OMEGA tokens when you sign up with my referral link: https://omega.network/ref/${referralCode}\n\n#OmegaNetwork #Web3 #DeFi`,
                discord: `🔥 Hey everyone! Join Omega Network and earn FREE $OMEGA tokens! Use my referral link: https://omega.network/ref/${referralCode}`
            }
        });
    });
});

// Track referral click
app.get('/api/referral/track/:code', (req, res) => {
    const { code } = req.params;
    const source = req.query.source || 'direct';
    const clientIP = getClientIP(req);
    
    db.get(`SELECT * FROM users WHERE referral_code = ?`, [code], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ 
                success: false, 
                error: 'Invalid referral code' 
            });
        }
        
        // Store click data (you can extend this)
        res.json({
            success: true,
            referrerInfo: {
                code: user.referral_code,
                totalReferrals: user.total_referrals
            },
            message: 'Welcome to Omega Network! Create your wallet to earn rewards.',
            ctaUrl: 'https://omega.network/terminal'
        });
    });
});

// Complete referral (when new user creates wallet)
app.post('/api/referral/complete', (req, res) => {
    const { referralCode, newWalletAddress, sourcePlatform } = req.body;
    
    if (!validateWalletAddress(newWalletAddress)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid wallet address' 
        });
    }
    
    const clientIP = getClientIP(req);
    
    // Check if referral code exists
    db.get(`SELECT * FROM users WHERE referral_code = ?`, [referralCode], (err, referrer) => {
        if (err || !referrer) {
            return res.status(404).json({ 
                success: false, 
                error: 'Invalid referral code' 
            });
        }
        
        // Check if wallet already used a referral
        db.get(`SELECT * FROM referrals WHERE referee_wallet = ?`, [newWalletAddress], (err, existing) => {
            if (existing) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Wallet already used a referral' 
                });
            }
            
            // Create referral record
            const referralReward = 10.0; // 10 OMEGA for referrer
            const refereeReward = 5.0;   // 5 OMEGA for new user
            
            db.run(`INSERT INTO referrals 
                    (referrer_code, referee_wallet, referee_ip, source_platform, referral_reward, referee_reward, status) 
                    VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
                   [referralCode, newWalletAddress, clientIP, sourcePlatform, referralReward, refereeReward], 
                   function(err) {
                if (err) {
                    console.error('Referral creation error:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Failed to create referral' 
                    });
                }
                
                const referralId = this.lastID;
                
                // Update referrer stats
                db.run(`UPDATE users 
                        SET total_referrals = total_referrals + 1, 
                            total_earned = total_earned + ?,
                            last_active = CURRENT_TIMESTAMP 
                        WHERE referral_code = ?`, 
                       [referralReward, referralCode]);
                
                // Create reward records
                db.run(`INSERT INTO rewards (wallet_address, referral_id, reward_type, amount) 
                        VALUES (?, ?, 'referral', ?)`, 
                       [referrer.wallet_address, referralId, referralReward]);
                       
                db.run(`INSERT INTO rewards (wallet_address, referral_id, reward_type, amount) 
                        VALUES (?, ?, 'signup', ?)`, 
                       [newWalletAddress, referralId, refereeReward]);
                
                res.json({
                    success: true,
                    referralComplete: true,
                    rewards: {
                        referrer: `${referralReward} OMEGA`,
                        referee: `${refereeReward} OMEGA`
                    },
                    message: `🎉 Referral successful! You've earned ${refereeReward} OMEGA tokens!`
                });
            });
        });
    });
});

// Get user referral stats
app.get('/api/referral/stats/:walletAddress', (req, res) => {
    const { walletAddress } = req.params;
    
    if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid wallet address' 
        });
    }
    
    db.get(`SELECT * FROM users WHERE wallet_address = ?`, [walletAddress], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ 
                success: false, 
                error: 'User not found' 
            });
        }
        
        // Get detailed referral stats
        db.all(`SELECT * FROM referrals WHERE referrer_code = ? ORDER BY created_at DESC`, 
               [user.referral_code], (err, referrals) => {
            if (err) {
                console.error('Referral stats error:', err);
                referrals = [];
            }
            
            // Get reward history
            db.all(`SELECT * FROM rewards WHERE wallet_address = ? ORDER BY created_at DESC LIMIT 10`,
                   [walletAddress], (err, rewards) => {
                if (err) {
                    console.error('Rewards history error:', err);
                    rewards = [];
                }
                
                const totalPending = rewards
                    .filter(r => r.status === 'pending')
                    .reduce((sum, r) => sum + r.amount, 0);
                    
                const totalConfirmed = rewards
                    .filter(r => r.status === 'confirmed')
                    .reduce((sum, r) => sum + r.amount, 0);
                
                res.json({
                    success: true,
                    userInfo: {
                        walletAddress: user.wallet_address,
                        referralCode: user.referral_code,
                        referralUrl: `https://omega.network/ref/${user.referral_code}`,
                        twitterHandle: user.twitter_handle,
                        discordId: user.discord_id
                    },
                    stats: {
                        totalReferrals: user.total_referrals,
                        totalEarned: user.total_earned,
                        pendingRewards: totalPending,
                        confirmedRewards: totalConfirmed
                    },
                    recentReferrals: referrals.slice(0, 5),
                    recentRewards: rewards.slice(0, 5),
                    socialShare: {
                        twitter: `🚀 Join me on @OmegaNetwork! Get FREE $OMEGA tokens: https://omega.network/ref/${user.referral_code}\n\n#OmegaNetwork #Web3 #DeFi`,
                        discord: `🔥 Join Omega Network and earn FREE $OMEGA tokens! Use my link: https://omega.network/ref/${user.referral_code}`
                    }
                });
            });
        });
    });
});

// Get leaderboard
app.get('/api/referral/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    
    db.all(`SELECT wallet_address, referral_code, twitter_handle, total_referrals, total_earned 
            FROM users 
            WHERE total_referrals > 0 
            ORDER BY total_referrals DESC, total_earned DESC 
            LIMIT ?`, [limit], (err, leaders) => {
        if (err) {
            console.error('Leaderboard error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch leaderboard' 
            });
        }
        
        // Get total platform stats
        db.get(`SELECT 
                COUNT(*) as total_users,
                SUM(total_referrals) as total_referrals,
                SUM(total_earned) as total_rewards_distributed
                FROM users`, (err, stats) => {
            if (err) {
                console.error('Platform stats error:', err);
                stats = { total_users: 0, total_referrals: 0, total_rewards_distributed: 0 };
            }
            
            res.json({
                success: true,
                leaderboard: leaders.map((user, index) => ({
                    rank: index + 1,
                    wallet: `${user.wallet_address.substring(0, 6)}...${user.wallet_address.substring(38)}`,
                    twitterHandle: user.twitter_handle || 'Anonymous',
                    referrals: user.total_referrals,
                    earned: user.total_earned
                })),
                platformStats: {
                    totalUsers: stats.total_users,
                    totalReferrals: stats.total_referrals,
                    totalRewardsDistributed: stats.total_rewards_distributed
                }
            });
        });
    });
});

// Social campaign tracking
app.post('/api/referral/campaign', (req, res) => {
    const { walletAddress, campaignType, content, socialUrl } = req.body;
    
    if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid wallet address' 
        });
    }
    
    const bonusEarned = campaignType === 'twitter_post' ? 2.0 : 1.0; // Bonus for social sharing
    
    db.run(`INSERT INTO campaigns 
            (wallet_address, campaign_type, content, social_url, bonus_earned) 
            VALUES (?, ?, ?, ?, ?)`,
           [walletAddress, campaignType, content, socialUrl, bonusEarned], function(err) {
        if (err) {
            console.error('Campaign tracking error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to track campaign' 
            });
        }
        
        // Add bonus reward
        db.run(`INSERT INTO rewards (wallet_address, reward_type, amount) 
                VALUES (?, 'social_bonus', ?)`, 
               [walletAddress, bonusEarned]);
        
        res.json({
            success: true,
            bonusEarned: `${bonusEarned} OMEGA`,
            message: 'Social campaign tracked! Bonus rewards added.'
        });
    });
});

// ===================================
// SERVER STARTUP
// ===================================

const PORT = process.env.REFERRAL_PORT || 5000;

app.listen(PORT, () => {
    console.log('🚀 OMEGA REFERRAL SYSTEM STARTED');
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/referral`);
    console.log('');
    console.log('✨ Features Active:');
    console.log('   📋 Referral Code Generation');
    console.log('   🎯 Social Media Integration');
    console.log('   💰 Automatic Reward Tracking');
    console.log('   📈 Real-time Analytics');
    console.log('   🏆 Leaderboards');
}); 