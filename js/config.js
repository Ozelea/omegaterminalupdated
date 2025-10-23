// Omega Terminal Configuration v2.0.1 - UPDATED 2025-01-14
console.log('[DEBUG] 🔧 Loading config.js v2.0.1...');
window.OmegaConfig = {
    // Version Info
    VERSION: '2.0.1',
    
    // Relayer and API URLs
    RELAYER_URL: 'http://localhost:4000',
    OMEGA_RPC_URL: 'https://0x4e454228.rpc.aurora-cloud.dev',
    
    // Contract Addresses
    CONTRACT_ADDRESS: "0x54c731627f2d2b55267b53e604c869ab8e6a323b", // SimpleMiner contract with claimTo
    FAUCET_ADDRESS: "0xf8e00f8cfaccf9b95f703642ec589d1c6ceee1a9", // Faucet contract
    MINER_FAUCET_ADDRESS: '0x1c4ffffcc804ba265f6cfccffb94d0ae28b36207', // OmegaMinerFaucet contract
    MIXER_ADDRESS: '0xc57824b37a7fc769871075103c4dd807bfb3fd3e', // Omega Mixer contract
    
    // Contract ABIs
    CONTRACT_ABI: [
        "function mineBlock(uint256 nonce, bytes32 solution) external",
        "function claimRewards() external",
        "function claimTo(address recipient) external",
        "function getMinerInfo(address miner) external view returns (uint256 _totalMined, uint256 _lastMineTime, uint256 _pendingRewards)",
        "function calculateReward(address miner, uint256 nonce, bytes32 solution) external view returns (uint256)",
        "function cooldownPeriod() external view returns (uint256)",
        "function totalRewardsDistributed() external view returns (uint256)",
        "function owner() external view returns (address)",
        "function setCooldownPeriod(uint256 _cooldown) external",
        "function withdrawExcess() external",
        "event BlockMined(address indexed miner, uint256 nonce, bytes32 solution, uint256 reward)",
        "event RewardsClaimed(address indexed miner, uint256 amount)"
    ],
    
    FAUCET_ABI: [
        {
            "inputs": [],
            "name": "claim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "user", "type": "address" }
            ],
            "name": "getFaucetStatus",
            "outputs": [
                { "internalType": "bool", "name": "canClaimNow", "type": "bool" },
                { "internalType": "uint256", "name": "lastClaim", "type": "uint256" },
                { "internalType": "uint256", "name": "timeUntilNextClaim", "type": "uint256" },
                { "internalType": "uint256", "name": "claimAmount", "type": "uint256" },
                { "internalType": "uint256", "name": "faucetBalance", "type": "uint256" },
                { "internalType": "uint256", "name": "totalClaims_", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "emergencyWithdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FaucetRefilled",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "refillFaucet",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "TokensClaimed",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "withdrawFaucet",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "canClaim",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "CLAIM_AMOUNT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "CLAIM_COOLDOWN",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "faucetBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getClaimInfo",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "canClaimNow",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "lastClaim",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "timeUntilNextClaim",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "claimAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFaucetBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getTimeUntilNextClaim",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "lastClaimTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalClaims",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    
    MINER_FAUCET_ABI: [
        {
            "inputs": [],
            "name": "mine",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "", "type": "address"}],
            "name": "totalMined",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "", "type": "address"}],
            "name": "lastMineTime",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    
    MIXER_ABI: [
        "function deposit(bytes32 commitment) external payable",
        "function withdraw(bytes32 secret, address to) external"
    ],
    
    // Network Configuration
    OMEGA_NETWORK: {
        chainId: '0x4e454228',
        chainIdDecimal: 1313161256,
        chainName: 'Omega Network',
        nativeCurrency: { 
            name: 'OMEGA', 
            symbol: 'OMEGA', 
            decimals: 18 
        },
        rpcUrls: ['https://0x4e454228.rpc.aurora-cloud.dev'],
        blockExplorerUrls: ['https://0x4e454228.explorer.aurora-cloud.dev/']
    },
    
    // Command List for Autocomplete
    AVAILABLE_COMMANDS: [
        'help', 'clear', 'ai', 'connect', 'disconnect', 'yes', 'import', 'balance', 'faucet', 'faucet status', 'mine', 'claim', 'status', 'stats',
        'send', 'ens register', 'ens resolve', 'ens search', 'mixer', 'stress', 'stopstress', 'stressstats', 
        'theme', 'color', 'palette', 'gui', 'gui ios', 'gui aol', 'gui limewire', 'gui discord', 'gui windows95', 'gui terminal', 'view', 'view basic', 'view futuristic', 'view toggle',
        'rickroll', 'fortune', 'matrix', 'hack', 'disco', 'stop', 'tab', 'email', 'inbox', 
        'dexscreener', 'geckoterminal', 'stock', 'alphakey', 'ds search', 'ds trending', 'cg search', 'cg networks', 'alpha', 
        'alpha quote', 'alpha daily', 'alpha overview', 'alpha macro', 'solana connect', 'solana generate', 'solana status', 'solana test', 'solana search', 'solana swap',
        'near generate', 'near connect', 'near swap', 'near tokens', 'eclipse tokens', 'eclipse price', 'eclipse swap', 'eclipse connect', 'eclipse generate', 'eclipse balance',
        'airdrop', 'hyperliquid', 'polymarket', 'magiceden', 'import', 'create', 'nft', 'ascii', 'rome', 'rome help', 'rome token create', 'profile', 'profile open', 'profile close', 'game', 'game list', 'game help', 'play', 'play snake', 'play pacman', 'play clicker', 'play cookies',
        'spotify', 'spotify open', 'spotify connect', 'spotify disconnect', 'spotify play', 'spotify pause', 'spotify next', 'spotify prev', 'spotify search', 'spotify close', 'spotify help', 'music',
        'youtube', 'youtube open', 'youtube close', 'youtube search', 'youtube play', 'youtube pause', 'youtube next', 'youtube prev', 'youtube mute', 'youtube unmute', 'youtube help', 'yt', 'video',
        'referral', 'referral create', 'referral stats', 'referral share', 'referral leaderboard', 'referral dashboard', 'referral help', 'refer', 'ambassador',
        'news', 'news open', 'news close', 'news latest', 'news hot', 'news help', 'perp', 'perps', 'perp open', 'perp close',
        'chat', 'chat init', 'chat ask', 'chat stream', 'chat context', 'chat history', 'chat test', 'chat help',
        'contract', 'contract init', 'contract generate', 'contract create', 'contract templates', 'contract types', 'contract chains', 'contract test', 'contract help',
        'auditor', 'auditor init', 'auditor audit', 'auditor check', 'auditor severity', 'auditor levels', 'auditor categories', 'auditor test', 'auditor help'
    ],
    
    // Theme Options
    THEMES: ['dark', 'light', 'matrix', 'retro', 'powershell', 'executive', 'modern'],
    
    // Cache Busting URLs
    CACHE_BUSTER_PARAMS: ['v=', 'v=1752771858262', 'v=20241219'],
    
    // ChainGPT API Configuration
    CHAINGPT: {
        // Production API key from environment variable (Vercel)
        PRODUCTION_API_KEY: null, // Will be loaded dynamically
        
        // Fallback API keys for testing (users can override with their own)
        DEFAULT_API_KEYS: [
            '5e9305e6-7713-4216-9bed-e554e9bb8d08',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM2ZGQyZmRiMjk3NzdjMmM5MWE0MzciLCJpYXQiOjE3MzE2MjQyMzl9.vG8xW5tQVqPwJxqCqTqGQp_GiFWxqPKJPTqpR_1MrfI'
        ],
        BASE_URL: 'https://api.chaingpt.org',
        CHAT_ENDPOINT: '/chat/stream',
        NFT_ENDPOINT: '/nft/generate-nft',
        SMART_CONTRACT_ENDPOINT: '/chat/stream',
        AUDITOR_ENDPOINT: '/chat/stream',
        DEFAULT_MODEL: 'general_assistant',
        AUTO_INITIALIZE: true,  // Auto-initialize with available keys
        
        // Get the best available API key (production first, then defaults)
        getApiKey: function() {
            // Priority: Production API key > Default API keys
            if (this.PRODUCTION_API_KEY) {
                console.log('[DEBUG] Using production ChainGPT API key from environment');
                return this.PRODUCTION_API_KEY;
            }
            
            // Fallback to default keys
            console.log('[DEBUG] Using default ChainGPT API keys');
            return this.DEFAULT_API_KEYS[0];
        },
        
        // Get all available API keys
        getAllApiKeys: function() {
            const keys = [];
            if (this.PRODUCTION_API_KEY) {
                keys.push(this.PRODUCTION_API_KEY);
            }
            keys.push(...this.DEFAULT_API_KEYS);
            return keys;
        },
        
        // Load environment variables from API endpoint
        loadEnvVars: async function() {
            try {
                // Try to load from API endpoint (for Vercel deployment)
                const response = await fetch('/api/env');
                if (response.ok) {
                    const envData = await response.json();
                    if (envData.CHAINGPT_API_KEY) {
                        this.PRODUCTION_API_KEY = envData.CHAINGPT_API_KEY;
                        console.log('[DEBUG] Loaded production API key from Vercel environment');
                        return true;
                    }
                }
            } catch (error) {
                console.log('[DEBUG] Could not load environment variables from API:', error.message);
            }
            
            // Fallback: try to load from window.ENV (build-time injection)
            if (typeof window !== 'undefined' && window.ENV && window.ENV.CHAINGPT_API_KEY) {
                this.PRODUCTION_API_KEY = window.ENV.CHAINGPT_API_KEY;
                console.log('[DEBUG] Loaded production API key from build-time injection');
                return true;
            }
            
            console.log('[DEBUG] No production API key found, using default keys');
            return false;
        }
    }
};

// Debug config loading
console.log('[DEBUG] ✅ Config loaded - RELAYER_URL:', window.OmegaConfig.RELAYER_URL);
console.log('[DEBUG] ✅ Config loaded - VERSION:', window.OmegaConfig.VERSION);

// Load environment variables when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', async () => {
        try {
            await window.OmegaConfig.CHAINGPT.loadEnvVars();
            console.log('[DEBUG] ✅ Environment variables loaded');
        } catch (error) {
            console.log('[DEBUG] ⚠️ Could not load environment variables:', error.message);
        }
    });
} 