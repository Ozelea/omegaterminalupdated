# Omega Terminal v2.0.1

**The Ultimate Multi-Chain Web3 Terminal** - A powerful, modular terminal interface for Web3 trading, NFTs, DeFi, and blockchain interactions.

![Version](https://img.shields.io/badge/version-2.0.1-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Web3](https://img.shields.io/badge/Web3-Multi--Chain-purple.svg)

## Live Demo
**[Try Omega Terminal](https://omeganetwork.co)** 

---

## Key Features


- Wallet Integration: MetaMask, Phantom, NEAR Wallet, Shade Agents
- Cross-chain portfolio tracking and trading
- Omega Network native support

### Trading & Analytics
- **Polymarket**: Prediction markets with categories (politics, sports, crypto, tech)
- **Perpetuals Trading**: Integrated Omega Perps interface
- **DexScreener**: Ultimate analytics dashboard with real-time data
- **DeFi Llama**: TVL and protocol analytics
- **Price Tracking**: Across multiple DEXs and exchanges
- **Portfolio Analytics**: P&L tracking and performance metrics

### NFT Trading Suite
- OpenSea Integration with real-time market data
- NFT Discovery, search, and analytics
- Collection Analytics with floor prices and trends
- Activity Feed with real-time blockchain events
- On-chain NFT minting capabilities

### Profile & API Management
- User Profiles with customizable settings
- API Key Management for enhanced features
- Personal preferences and wallet connections
- Command history and favorites

### Omega Arcade
- Built-in Games: Flappy Omega, Snake.io, Brick Breaker
- Leaderboards with on-chain integration
- Credit System with wallet-based authentication

### AI-Powered Features
- Intelligent command processing
- Market analysis and trading insights
- Automated responses for common queries

---

## Quick Start

### 1. Open the Terminal
Open `terminal.html` in your browser

### 2. Connect a Wallet

**Option A: Browser Wallet (Recommended)**
```bash
connect
```
This will connect your MetaMask or compatible EVM wallet.

**Option B: Create Omega Wallet**
If you don't have a browser wallet installed:
```bash
connect
# When prompted, type:
yes
```
This generates a new Omega Wallet and funds it with 0.1 OMEGA tokens automatically.

**Option C: Other Chains**
```bash
# For Solana/Phantom
solana wallet

# For NEAR Protocol  
near connect

# For Shade Agents (Multi-chain)
shade
```

### 3. Explore Features

**Trading Commands:**
```bash
polymarket trending          # View trending prediction markets
polymarket crypto            # Crypto-focused markets
perp                         # Open Omega Perps trading interface
```

**NFT Commands:**
```bash
nft assets boredapeyachtclub    # View NFT collection
nft analytics cryptopunks        # Collection analytics
```

**Analytics Commands:**
```bash
dexscreener BTC              # Token analytics
defillama protocols          # DeFi protocol data
```

**Profile & Settings:**
```bash
profile                      # Open profile management
help                         # View all available commands
```

---

## Command Reference

### Core Commands
- `connect` - Connect wallet or create Omega Wallet
- `disconnect` - Disconnect current wallet
- `balance` - Check wallet balance
- `help` - Display all available commands
- `clear` - Clear terminal screen

### Polymarket Commands
- `polymarket trending` - Trending markets
- `polymarket markets` - Recent markets  
- `polymarket events` - All events
- `polymarket politics` - Politics category
- `polymarket sports` - Sports betting
- `polymarket crypto` - Crypto markets
- `polymarket tech` - Technology markets

### Trading Commands
- `perp` - Open Omega Perps interface
- `dexscreener <TOKEN>` - Token analytics
- `defillama` - DeFi protocol data

### NFT Commands
- `nft assets <collection>` - View collection
- `nft analytics <collection>` - Collection stats
- `nft search <query>` - Search NFTs

### Profile Commands
- `profile` - Open profile management
- `profile apikeys` - Manage API keys

### Media Commands
- `spotify open` - Open Spotify music player
- `spotify search <query>` - Search and play music
- `youtube open` - Open YouTube video player  
- `youtube search <query>` - Search and watch videos
- `yt` / `video` - Aliases for YouTube

---

## Project Structure

```
omega-terminal/
├── terminal.html                       # Main terminal interface
├── index.html                          # Redirect to terminal.html
├── README.md                           # This file
├── package.json                        # NPM dependencies
│
├── js/                                 # Core JavaScript
│   ├── terminal-core.js               # Core terminal logic
│   ├── config.js                      # Configuration
│   ├── init.js                        # Initialization
│   ├── wallet.js                      # Wallet connection
│   ├── themes.js                      # Theme management
│   ├── utils.js                       # Utility functions
│   └── commands/                      # Modular command system
│       ├── basic.js                   # Basic commands
│       ├── wallet-commands.js         # Wallet operations
│       ├── mining.js                  # Mining features
│       ├── network.js                 # Network commands
│       ├── solana.js                  # Solana integration
│       ├── near.js                    # NEAR Protocol
│       ├── eclipse.js                 # Eclipse chain
│       ├── api.js                     # API integrations
│       ├── entertainment.js           # Games & fun
│       ├── kalshi.js                  # Kalshi integration
│       ├── mixer.js                   # Mixer features
│       ├── referral.js                # Referral system
│       └── remaining.js               # Misc commands
│
├── styles/                             # Core CSS
│   ├── base.css                       # Base styling
│   ├── themes.css                     # Color themes
│   ├── animations.css                 # Animations
│   └── gui-themes.css                 # GUI themes
│
├── css/                                # Additional CSS
│   ├── apple-ui-theme.css             # Apple-style UI
│   ├── mobile-terminal-fix.css        # Mobile fixes
│   ├── mobile-games-fix.css           # Mobile game fixes
│   ├── mobile-fixes.css               # General mobile
│   └── simple-input-fix.css           # Input fixes
│
├── plugins/                            # Feature plugins
│   ├── apple-ui-plugin.js             # Apple UI
│   ├── dexscreener-analytics-ultimate.js  # DEX analytics
│   ├── defillama-api-plugin.js        # DeFi Llama
│   ├── opensea-enhanced-plugin.js     # NFT marketplace
│   ├── enhanced-profile-system.js     # User profiles
│   ├── terminal-games-system.js       # Game system
│   ├── terminal-chatter-mode.js       # Chat mode
│   ├── omega-nft-onchain.js           # On-chain NFTs
│   ├── omega-arcade-sdk.js            # Arcade SDK
│   ├── omega-referral-system.js       # Referrals
│   ├── pgt-integration-live.js        # PGT integration
│   ├── pgt-cors-proxy.js              # PGT proxy
│   └── python-integration-system.js   # Python bridge
│
├── server/                             # Backend services
│   ├── relayer-faucet.js              # Faucet & relayer
│   ├── polymarket-proxy.js            # Polymarket proxy
│   ├── bot_hyperliquid.py             # Trading bot
│   └── omega-network.db               # Database
│
├── pages/                              # Standalone pages
│   ├── index-modular.html             # Modular version
│   ├── mystery-box.html               # Mystery box game
│   └── near-auth.html                 # NEAR auth flow
│
├── contracts/                          # Smart contracts
│   ├── megarometoken-optimized.sol    # Token contract
│   └── rome-username-registry.sol     # Username registry
│
└── docs/                               # Documentation
    ├── API_DOCUMENTATION.md           # API docs
    ├── SETUP.md                       # Setup guide
    ├── EXTENSIONS-README.md           # Extensions
    ├── OMEGA_ARCADE_README.md         # Arcade docs
    ├── OMEGA-NFT-README.md            # NFT docs
    ├── REFERRAL-README.md             # Referral docs
    ├── README-AI-SETUP.md             # AI setup
    ├── HELP-SYSTEM-UPDATE.md          # Help system
    ├── DEXSCREENER-ANALYTICS-ULTIMATE-README.md  # DEX docs
    ├── OMEGA_TERMINAL_COMPLETE_AI_DOCUMENTATION.txt  # Full AI docs
    └── datav3.md                      # Data specs
```

---

## Configuration

### API Keys (Optional)
Enhance functionality with your own API keys:

1. Type `profile` in the terminal
2. Navigate to API Keys section
3. Add keys for:
   - **OpenSea** - Enhanced NFT data
   - **DexScreener** - Advanced analytics
   - **DeFi Llama** - Protocol insights
   - **CoinGecko** - Price data
   - **Alpha Vantage** - Market data

### Themes
Switch between multiple visual themes:
```bash
theme executive    # ⭐ NEW! Premium professional theme with gold accents
theme dark         # Default dark terminal theme
theme light        # Light mode with dark text
theme matrix       # Green-on-black Matrix style
theme retro        # Retro amber terminal
theme powershell   # Windows PowerShell blue theme
```

**New: Executive Theme** - A premium, professional UI with:
- Luxurious gold & navy color scheme
- Glass-morphism effects
- Smooth animations
- Professional typography
- Perfect for presentations and professional use

---

## Development

### Running Locally

**1. Start Python HTTP Server:**
```bash
python -m http.server 8000
```

**2. Start Polymarket Proxy (Optional):**
```bash
node server/polymarket-proxy.js
```

**3. Start Relayer Server (Optional):**
```bash
node server/relayer-faucet.js
```

**4. Open Browser:**
Navigate to `http://localhost:8000`

### Adding New Commands

1. Create a new function in `index.html` or modular command file
2. Add case handler in the command switch statement
3. Update help documentation
4. Test thoroughly

### Adding New Features

1. Follow existing code patterns
2. Maintain modular architecture
3. Add error handling
4. Update README with new commands

---

## Technical Details

### Architecture
- **Frontend**: Pure HTML/CSS/JavaScript
- **Blockchain**: Ethers.js v5 for EVM chains
- **APIs**: Direct integration with multiple Web3 APIs
- **Storage**: LocalStorage for settings and preferences

### Supported Networks
- Omega Network (0x4e454228)
- Ethereum Mainnet
- Solana Mainnet
- NEAR Protocol
- Eclipse Mainnet
- BSC, Polygon, Arbitrum, Avalanche

### Browser Compatibility
- Chrome/Brave (Recommended)
- Firefox
- Edge
- Safari (Limited wallet support)

---

## Security

### Best Practices
- **Never share private keys** - Use browser wallet extensions
- **API keys stored locally** - Only in your browser
- **No server-side storage** - All data stays client-side
- **CORS compliant** - Secure API integrations

### Omega Wallet Security
- Generated wallets are client-side only
- Save your private key securely
- Use hardware wallets for large amounts
- Test with small amounts first

---

## Troubleshooting

### Connection Issues
**Problem**: "No EVM wallet found"  
**Solution**: Install MetaMask or type `yes` to create Omega Wallet

**Problem**: "Failed to switch network"  
**Solution**: Manually add Omega Network to MetaMask

### API Issues
**Problem**: "API request failed"  
**Solution**: Check if proxy servers are running (polymarket-proxy.js, relayer-faucet.js)

### Cache Issues
**Problem**: "Old version loading"  
**Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test all changes thoroughly
- Update documentation
- Keep commits atomic and descriptive

---

## Latest Updates (v2.0.1)

### New Features
- **Omega Wallet Creation**: Generate wallets without browser extensions
- **Polymarket Integration**: Full prediction market support with categories
- **Omega Perps Command**: One-click access to perpetuals trading
- **Updated Loading Screen**: Modernized feature display (AI, Defi, NFTs)
- **Enhanced Profile System**: Improved API key management

### Improvements
- Better wallet detection and connection flow
- Improved error handling for API requests
- Cleaner UI with neutral color schemes
- Enhanced mobile responsiveness

### Bug Fixes
- Fixed wallet creation when no browser extension detected
- Improved cache busting for updates
- Fixed Polymarket category filtering
- Enhanced network switching logic

---

## License

MIT License - See LICENSE file for details

## Support

- **Documentation**: This README and in-terminal `help` command
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord/Telegram for support
- **Updates**: Star the repo to receive notifications

---

**Built for the Web3 Community**

If you find this project useful, please star the repository and share it with others!

[GitHub Repository](https://github.com/OmegaNetwork-source/omegaterminalupdated) | [Live Demo](https://omeganetwork.co) | [Documentation](https://github.com/OmegaNetwork-source/omegaterminalupdated/wiki)
