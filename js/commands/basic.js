// Basic Terminal Commands
window.OmegaCommands = window.OmegaCommands || {};

console.log("[DEBUG] Loading OmegaCommands.Basic...");

// Test if this executes
window.testBasicLoading = function () {
  console.log("Basic.js is loading!");
};
window.testBasicLoading();

window.OmegaCommands.Basic = {
  // Help command
  help: function (terminal, args) {
    // Check if user wants category-specific help
    if (args && args.length > 1) {
      const category = args[1].toLowerCase();
      this.showCategoryHelp(terminal, category);
      return;
    }
    terminal.log("=== Ω Terminal v2.0.1 Commands ===", "info");
    terminal.log("");

    // New Features Section
    terminal.log("🆕 --- NEW FEATURES (v2.0.1) ----", "success");
    terminal.log("🍎 Modern UI:", "info");
    terminal.log("modern ui | modern-dark", "output");
    terminal.log("Apple-style glass-morphism", "output");
    terminal.log("", "output");
    terminal.log("📊 DexScreener Analytics:", "info");
    terminal.log(
      "dexscreener search | analytics | portfolio | watchlist",
      "output"
    );
    terminal.log("Complete token analysis suite", "output");
    terminal.log("", "output");
    terminal.log("🦙 DeFi Llama:", "info");
    terminal.log("defillama tvl | protocols | price | chains", "output");
    terminal.log("TVL & price data", "output");
    terminal.log("", "output");
    terminal.log("🎮 Games & Fun:", "info");
    terminal.log("games | arcade | flappy | mystery-box", "output");
    terminal.log("Entertainment & challenges", "output");
    terminal.log("", "output");
    terminal.log("🎯 PGT Portfolio:", "info");
    terminal.log("pgt track <address> | pgt portfolio | pgt wallets", "output");
    terminal.log("Auto-detect network, real-time tracking", "output");
    terminal.log("", "output");
    terminal.log("🏗️ Terminal Builder:", "info");
    terminal.log("terminal create | list | launch", "output");
    terminal.log("Create custom terminals with URLs", "output");
    terminal.log("", "output");
    terminal.log("🔵 NEAR Wallet:", "info");
    terminal.log("near connect | balance | swap", "output");
    terminal.log("NEAR ecosystem integration", "output");
    terminal.log("", "output");
    terminal.log("🌊 OpenSea NFTs:", "info");
    terminal.log(
      "nft search | collection | floor | trending | portfolio",
      "output"
    );
    terminal.log("Professional NFT analytics & trading", "output");
    terminal.log(
      "• Search collections • Floor price tracking • Portfolio management",
      "output"
    );
    terminal.log("");

    // Core Wallet Functions
    terminal.log("--- Core Wallet Functions ----", "info");
    terminal.log(
      "Commands: connect | disconnect | balance | faucet | send | network | forceadd | rpccheck",
      "output"
    );
    terminal.log("");

    // AI Assistant
    terminal.log("--- AI Assistant ----", "info");
    terminal.log(
      "AI Mode: ai - Toggle AI assistant to answer questions and execute commands naturally",
      "output"
    );
    terminal.log("");

    // Mining & Rewards
    terminal.log("--- Mining & Rewards ---", "info");
    terminal.log("Commands: mine | claim | status | stats", "output");
    terminal.log("");

    // Themes & Interface
    terminal.log("🎨 --- Themes & Interface ----", "info");
    terminal.log(
      "Themes: modern ui | modern-dark | dark | matrix | retro | bitcoin | ethereum | solana | pepe",
      "output"
    );
    terminal.log(
      "GUI Modes: gui [ios, chatgpt, discord, aol, windows95, limewire]",
      "output"
    );
    terminal.log("");

    // Analytics & Data
    terminal.log("📊 --- Analytics & Data ----", "info");
    terminal.log("DexScreener:", "info");
    terminal.log("dexscreener search BONK", "output");
    terminal.log("dexscreener analytics ETH", "output");
    terminal.log("dexscreener portfolio", "output");
    terminal.log("", "output");
    terminal.log("DeFi Llama:", "info");
    terminal.log("defillama tvl", "output");
    terminal.log("defillama price ethereum", "output");
    terminal.log("defillama protocols", "output");
    terminal.log("", "output");
    terminal.log("OpenSea NFTs:", "info");
    terminal.log("nft search azuki", "output");
    terminal.log("nft floor bayc", "output");
    terminal.log("nft trending", "output");
    terminal.log("", "output");
    terminal.log("GeckoTerminal:", "info");
    terminal.log("cg help", "output");
    terminal.log("");

    // Blockchain Networks
    terminal.log("--- Blockchain Networks ---", "info");
    terminal.log("Solana:", "info");
    terminal.log("solana help", "output");
    terminal.log("", "output");
    terminal.log("Eclipse:", "info");
    terminal.log("eclipse help", "output");
    terminal.log("", "output");
    terminal.log("NEAR:", "info");
    terminal.log("near connect | near help", "output");
    terminal.log("", "output");
    terminal.log("Hyperliquid:", "info");
    terminal.log("hyperliquid help", "output");
    terminal.log("", "output");
    terminal.log("OpenSea NFTs:", "info");
    terminal.log("nft search | nft trending | nft portfolio", "output");
    terminal.log("");

    // Advanced Features
    terminal.log("--- Advanced Features ---", "info");
    terminal.log("Mixer (Privacy):", "info");
    terminal.log("mixer help", "output");
    terminal.log("", "output");
    terminal.log("Ambassador:", "info");
    terminal.log("ambassador help", "output");
    terminal.log("", "output");
    terminal.log("Polymarket:", "info");
    terminal.log("polymarket help", "output");
    terminal.log("", "output");
    terminal.log("🎮 Games:", "info");
    terminal.log("game list | play", "output");
    terminal.log("", "output");
    terminal.log("Email:", "info");
    terminal.log("email | inbox", "output");
    terminal.log("Encrypted messaging system", "output");
    terminal.log("");

    // Quick Start Guide
    terminal.log("🚀 --- Quick Start Guide ----", "info");
    terminal.log(
      "💡 Try: modern ui for beautiful Apple-style interface",
      "output"
    );
    terminal.log(
      "💡 Try: dexscreener search BONK for token analysis",
      "output"
    );
    terminal.log("💡 Try: defillama tvl for DeFi data", "output");
    terminal.log("💡 Try: nft trending for hot NFT collections", "output");
    terminal.log(
      "💡 Try: pgt portfolio for multi-chain portfolio tracking",
      "output"
    );
    terminal.log("💡 Try: game list for interactive games", "output");
    terminal.log("");

    // Economy & Trading
    terminal.log("--- Economy & Trading ---", "info");
    terminal.log("alpha help stocks & economy data", "output");
    terminal.log("");

    // Footer
    terminal.log("---", "output");
    terminal.log(
      "Ω Terminal v2.0.1 - Modern Apple UI • Enhanced Analytics • DeFi Integration • NFT Trading",
      "info"
    );
  },

  // Category-specific help
  showCategoryHelp: function (terminal, category) {
    terminal.log(`=== ${category.toUpperCase()} HELP ===`, "info");
    terminal.log("");

    switch (category) {
      case "wallet":
      case "wallets":
        terminal.log("💰 WALLET COMMANDS:", "info");
        terminal.log(
          "  connect              → Connect MetaMask or create Omega wallet"
        );
        terminal.log("  disconnect           → Disconnect current wallet");
        terminal.log(
          "  balance              → Show all wallet balances & total value"
        );
        terminal.log("  send <amount> <to>   → Send OMEGA tokens");
        terminal.log("  import <private-key> → Import wallet from private key");
        terminal.log("  export               → Export wallet for other apps");
        terminal.log(
          "  test-wallet          → Test wallet connection & status"
        );
        terminal.log(
          "  fund                 → Try to fund wallet with 0.1 OMEGA"
        );
        terminal.log(
          "  fund-direct          → Direct blockchain funding (bypass relayer)"
        );
        break;

      case "mining":
        terminal.log("⛏️  MINING COMMANDS:", "info");
        terminal.log("  mine                 → Start mining OMEGA tokens");
        terminal.log("  claim                → Claim mining rewards");
        terminal.log(
          "  faucet               → Claim from faucet (24h cooldown)"
        );
        terminal.log("  faucet status        → Check faucet claim status");
        terminal.log("  status               → Show mining status");
        terminal.log(
          "  stats                → Show detailed mining statistics"
        );
        break;

      case "market":
      case "analytics":
        terminal.log("📊 MARKET DATA & ANALYTICS:", "info");
        terminal.log(
          "  ds search <token>    → DexScreener token search & analysis"
        );
        terminal.log("  ds trending          → DexScreener trending tokens");
        terminal.log("  ds analytics <token> → Detailed token analytics");
        terminal.log("  ds portfolio         → Portfolio tracking & analytics");
        terminal.log("  defillama tvl        → Total DeFi TVL (calculated)");
        terminal.log("  defillama protocols [limit] → Top protocols by TVL");
        terminal.log("  defillama chains [limit] → TVL by blockchain");
        terminal.log("  defillama tvl <protocol> → Specific protocol TVL");
        terminal.log("  defillama price <token> → Current token price");
        terminal.log("  defillama tokens <t1,t2,t3> → Multiple token prices");
        terminal.log("  defillama trending   → Protocols by 24h change");
        terminal.log("  defillama debug <token> → Debug token price lookup");
        terminal.log("  llama <command>      → Alias for defillama commands");
        terminal.log(
          "  chart <symbol>       → Live trading charts (BTC, ETH, SOL)"
        );
        terminal.log("  cg search <token>    → GeckoTerminal token search");
        terminal.log("  cg networks          → GeckoTerminal networks");
        break;

      case "ai":
      case "nft":
        terminal.log("🤖 AI & NFT TOOLS:", "info");
        terminal.log(
          "  ai <message>         → Chat with OMEGA AI (natural language)"
        );
        terminal.log("  chat init <api-key>  → Initialize ChainGPT AI");
        terminal.log('  chat ask "<question>" → Ask ChainGPT Web3 AI');
        terminal.log('  chat stream "<question>" → Real-time AI streaming');
        terminal.log('  chat context "<question>" → AI with custom context');
        terminal.log(
          '  chat history "<question>" → AI with conversation memory'
        );
        terminal.log("  chat test            → Test ChainGPT connection");
        terminal.log("  chat help            → Show chat commands help");
        terminal.log(
          "  nft init <api-key>   → Initialize ChainGPT NFT Generator"
        );
        terminal.log("  nft generate <prompt> → Generate AI NFT images");
        terminal.log("  nft enhance <prompt> → Enhance prompt with AI");
        terminal.log("  nft models           → Show available AI models");
        terminal.log("  nft styles           → Show art styles");
        terminal.log("  nft gallery          → View generated NFT gallery");
        terminal.log("  nft test             → Test NFT API connection");
        terminal.log("  nft help             → Show full NFT commands");
        break;

      case "news":
        terminal.log("📰 CRYPTO NEWS:", "info");
        terminal.log("  news latest          → Latest crypto news");
        terminal.log("  news hot             → Trending crypto news");
        terminal.log("  news btc             → Bitcoin news");
        terminal.log("  news eth             → Ethereum news");
        terminal.log("  news sol             → Solana news");
        terminal.log('  news search "<query>" → Search crypto news');
        terminal.log("  news category news   → News articles");
        terminal.log("  news sources         → News sources");
        terminal.log("  news expand-all      → Expand all articles");
        terminal.log("  news collapse-all    → Collapse all articles");
        terminal.log("  news clear-expansions → Clear & reload");
        terminal.log("  news help            → Show news commands help");
        break;

      case "solana":
      case "near":
      case "eclipse":
        terminal.log("🌐 MULTI-CHAIN SUPPORT:", "info");
        terminal.log("  solana connect       → Connect Phantom wallet");
        terminal.log("  solana generate      → Generate browser wallet");
        terminal.log("  solana status        → Show available wallets");
        terminal.log("  solana search <token> → Search tokens with details");
        terminal.log("  solana swap          → Token swaps");
        terminal.log("  near connect         → Connect NEAR wallet");
        terminal.log("  near balance         → Check NEAR balance");
        terminal.log("  near account         → Get account information");
        terminal.log("  near validators      → Show network validators");
        terminal.log("  near agent           → Deploy/manage AI Shade Agents");
        terminal.log("  near deploy          → Deploy smart contracts");
        terminal.log("  near help            → Show detailed NEAR commands");
        terminal.log("  eclipse wallet       → Eclipse wallet operations");
        terminal.log("  eclipse swap         → Eclipse token swaps");
        break;

      case "games":
      case "entertainment":
        terminal.log("🎮 GAMES & ENTERTAINMENT:", "info");
        terminal.log("  game list            → Show all available games");
        terminal.log(
          "  play <game>          → Play a game (snake, pacman, clicker, etc.)"
        );
        terminal.log("  game help            → Show game commands");
        terminal.log("  rickroll, matrix, hack, disco, fortune → Fun commands");
        break;

      case "theme":
      case "interface":
      case "ui":
        terminal.log("🎨 INTERFACE & THEMES:", "info");
        terminal.log("  theme [light|dark]   → Toggle light/dark mode");
        terminal.log(
          "  gui <style>          → Transform UI (chatgpt, discord, aol, windows95, limewire)"
        );
        terminal.log("  view [basic|futuristic] → Toggle view mode");
        terminal.log("  clear                → Clear terminal");
        break;

      default:
        terminal.log(`❌ Unknown category: ${category}`, "error");
        terminal.log(
          "💡 Available categories: wallet, mining, market, ai, news, solana, near, games, theme",
          "info"
        );
        terminal.log('💡 Use "help" to see all commands', "info");
    }

    terminal.log("");
    terminal.log('💡 Use "help" to see all commands', "info");
  },

  // Clear terminal
  clear: function (terminal) {
    terminal.clearTerminal();
  },

  // Theme command
  theme: function (terminal, args) {
    if (!args[1] || args[1] === "help" || args[1] === "list") {
      terminal.log("🎨 Omega Terminal Theme System", "info");
      terminal.log("═══════════════════════════════════════", "output");
      terminal.log("");

      // Show actual available themes from config
      const availableThemes = window.OmegaConfig?.THEMES || [
        "dark",
        "light",
        "matrix",
        "retro",
        "powershell",
        "executive",
      ];
      const currentTheme =
        window.OmegaThemes?.getCurrentTheme() ||
        localStorage.getItem("omega-terminal-theme") ||
        "dark";

      terminal.log("💎 PREMIUM THEMES:", "success");
      terminal.log(
        "  theme executive        ⭐ Premium professional with gold accents",
        "output"
      );
      terminal.log(
        "  theme modern ui        Apple-style glass-morphism",
        "output"
      );
      terminal.log("  theme modern           Same as modern ui", "output");
      terminal.log("  theme apple            Same as modern ui", "output");
      terminal.log("  theme modern-dark      Apple UI in dark mode", "output");
      terminal.log("  theme apple-dark       Same as modern-dark", "output");
      terminal.log("");

      terminal.log("🎨 CLASSIC THEMES:", "success");
      terminal.log(
        "  theme dark             Default dark terminal theme",
        "output"
      );
      terminal.log(
        "  theme light            Light mode with dark text",
        "output"
      );
      terminal.log(
        "  theme matrix           Green-on-black Matrix style",
        "output"
      );
      terminal.log("  theme retro            Retro amber terminal", "output");
      terminal.log(
        "  theme powershell       Windows PowerShell blue theme",
        "output"
      );
      terminal.log("");

      terminal.log("🎮 GUI INTERFACE STYLES:", "success");
      terminal.log(
        "  gui chatgpt            ChatGPT-style interface",
        "output"
      );
      terminal.log(
        "  gui discord            Discord-style interface",
        "output"
      );
      terminal.log(
        "  gui aol                AOL Instant Messenger style",
        "output"
      );
      terminal.log("  gui windows95          Windows 95 retro style", "output");
      terminal.log("  gui limewire           LimeWire P2P style", "output");
      terminal.log(
        "  gui terminal           Return to normal terminal",
        "output"
      );
      terminal.log("");

      terminal.log("📊 VIEW MODES:", "success");
      terminal.log("  view basic             Minimal terminal view", "output");
      terminal.log(
        "  view futuristic        Full dashboard view (recommended with Executive)",
        "output"
      );
      terminal.log("  view toggle            Toggle between views", "output");
      terminal.log("");

      terminal.log("💡 RECOMMENDED COMBINATIONS:", "info");
      terminal.log(
        "  theme executive + view futuristic  → Premium dashboard experience",
        "output"
      );
      terminal.log(
        "  theme executive + view basic       → Professional terminal",
        "output"
      );
      terminal.log(
        "  theme matrix + view basic          → Hacker mode",
        "output"
      );
      terminal.log("");

      terminal.log("🎯 CURRENT SETTINGS:", "info");
      terminal.log(
        `  Theme: ${currentTheme}${
          currentTheme === "executive" ? " ⭐ (Premium)" : ""
        }`,
        "output"
      );

      const currentView =
        localStorage.getItem("omega-view-mode") || "futuristic";
      const currentGUI = localStorage.getItem("omega-gui-style") || "terminal";
      terminal.log(
        `  View: ${
          currentView === "basic"
            ? "⌨️  Basic Terminal"
            : "📊 Futuristic Dashboard"
        }`,
        "output"
      );
      terminal.log(`  GUI Style: ${currentGUI}`, "output");
      terminal.log("");

      terminal.log("✨ Your preferences are saved automatically", "success");
      return;
    }

    const themeName = args[1].toLowerCase();

    // Handle light/dark mode
    if (themeName === "light") {
      if (window.toggleOldTerminalTheme || window.FuturisticDashboard) {
        const currentTheme = localStorage.getItem("omega-theme-mode") || "dark";
        if (currentTheme !== "light") {
          if (
            window.FuturisticDashboard &&
            window.FuturisticDashboard.toggleThemeMode
          ) {
            window.FuturisticDashboard.toggleThemeMode();
          } else if (window.toggleOldTerminalTheme) {
            window.toggleOldTerminalTheme();
          }
        }
        terminal.log("✅ Switched to light mode", "success");
      }
      return;
    }

    if (themeName === "dark") {
      if (window.toggleOldTerminalTheme || window.FuturisticDashboard) {
        const currentTheme = localStorage.getItem("omega-theme-mode") || "dark";
        if (currentTheme !== "dark") {
          if (
            window.FuturisticDashboard &&
            window.FuturisticDashboard.toggleThemeMode
          ) {
            window.FuturisticDashboard.toggleThemeMode();
          } else if (window.toggleOldTerminalTheme) {
            window.toggleOldTerminalTheme();
          }
        }
        terminal.log("✅ Switched to dark mode", "success");
      }
      return;
    }

    if (themeName === "toggle") {
      if (
        window.FuturisticDashboard &&
        window.FuturisticDashboard.toggleThemeMode
      ) {
        window.FuturisticDashboard.toggleThemeMode();
      } else if (window.toggleOldTerminalTheme) {
        window.toggleOldTerminalTheme();
      }
      terminal.log("✅ Theme toggled", "success");
      return;
    }

    // Legacy theme system fallback
    if (OmegaConfig.THEMES && OmegaConfig.THEMES.includes(themeName)) {
      if (window.OmegaThemes && window.OmegaThemes.setTheme) {
        OmegaThemes.setTheme(themeName);
      } else {
        terminal.log(
          '⚠️ Legacy theme system not available. Use "theme light" or "theme dark"',
          "warning"
        );
      }
      return;
    }

    terminal.log(`❌ Unknown theme: ${themeName}`, "error");
    terminal.log(
      '💡 Type "theme" or "theme help" for available options',
      "info"
    );
  },

  // GUI command for interface transformations
  gui: function (terminal, args) {
    const availableStyles = [
      "chatgpt",
      "aol",
      "discord",
      "windows95",
      "limewire",
      "terminal",
    ];

    if (!args[1] || args[1] === "help" || args[1] === "list") {
      const currentStyle =
        localStorage.getItem("omega-gui-style") || "terminal";
      const currentTheme = localStorage.getItem("omega-theme-mode") || "dark";

      terminal.log("🎮 GUI Interface Styles", "info");
      terminal.log("═══════════════════════════════════════", "output");
      terminal.log("");

      terminal.log(
        "💬 gui chatgpt      - ChatGPT conversation interface",
        "output"
      );
      terminal.log(
        "   Modern chat UI with sidebar and message bubbles",
        "info"
      );
      terminal.log("");

      terminal.log("👾 gui discord      - Discord server interface", "output");
      terminal.log("   Channel-based chat with Discord aesthetics", "info");
      terminal.log("");

      terminal.log("📧 gui aol          - AOL Instant Messenger", "output");
      terminal.log('   Classic AOL chat with "You\'ve got mail" vibes', "info");
      terminal.log("");

      terminal.log("🪟 gui windows95    - Windows 95 retro", "output");
      terminal.log("   Classic Windows 95 window chrome and style", "info");
      terminal.log("");

      terminal.log("🔥 gui limewire     - LimeWire P2P interface", "output");
      terminal.log("   Y2K-era file sharing aesthetic", "info");
      terminal.log("");

      terminal.log("⌨️  gui terminal     - Default terminal UI", "output");
      terminal.log("   Return to standard terminal interface", "info");
      terminal.log("");

      terminal.log("💡 ALL GUI STYLES:", "success");
      terminal.log("  ✅ Work in both Light & Dark mode", "output");
      terminal.log("  ✅ Preserve all terminal commands", "output");
      terminal.log("  ✅ Support futuristic dashboard features", "output");
      terminal.log("  ✅ Auto-save your preference", "output");
      terminal.log("");

      terminal.log("🎯 CURRENT:", "info");
      terminal.log(`  GUI Style: ${currentStyle}`, "output");
      terminal.log(
        `  Theme: ${currentTheme === "light" ? "🌞 Light" : "🌙 Dark"}`,
        "output"
      );
      terminal.log("");
      terminal.log("💡 Try: gui chatgpt", "success");
      return;
    }

    const style = args[1].toLowerCase();
    if (!availableStyles.includes(style)) {
      terminal.log(`❌ Invalid GUI style: ${style}`, "error");
      terminal.log(
        "💡 Available: chatgpt, discord, aol, windows95, limewire, terminal",
        "info"
      );
      return;
    }

    terminal.log(`✅ Transforming interface to ${style}...`, "success");

    // Apply the dramatic GUI transformation
    this.transformInterface(style, terminal);
    localStorage.setItem("omega-gui-style", style);

    terminal.log(`✅ Interface transformed to: ${style}`, "success");
    terminal.log(
      `💡 All commands still work! Type "gui terminal" to restore.`,
      "info"
    );
  },

  // Transform the entire interface structure
  transformInterface: function (style, terminal) {
    const body = document.body;

    // Remove existing GUI classes
    body.className = body.className.replace(/gui-\w+/g, "");
    body.classList.add(`gui-${style}`);

    switch (style) {
      case "chatgpt":
        this.createChatGptInterface(terminal);
        break;
      case "aol":
        this.createAolInterface(terminal);
        break;
      case "discord":
        this.createDiscordInterface(terminal);
        break;
      case "windows95":
        this.createWindows95Interface(terminal);
        break;
      case "limewire":
        this.createLimewireInterface(terminal);
        break;
      case "terminal":
      default:
        this.restoreTerminalInterface(terminal);
        break;
    }
  },

  // ChatGPT-style interface with chat bubbles
  createChatGptInterface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    // Save the current terminal content
    this.saveCurrentContent(terminal);

    terminalEl.innerHTML = `
            <div style="height: 100vh; width: 100vw; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; background: #212121; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <!-- Header with back button -->
                <div style="position: absolute; top: 20px; left: 20px; z-index: 100;">
                    <button onclick="window.OmegaCommands.Basic.transformInterface('terminal', window.terminal)" 
                            style="background: #424242; color: #ececec; border: 1px solid #565656; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        ← Terminal
                    </button>
                </div>
                
                <!-- Conversation area -->
                <div class="chatgpt-conversation" style="flex: 1; overflow-y: auto; padding: 80px 20px 200px 20px; max-width: 768px; margin: 0 auto; width: 100%;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                        <h1 style="color: #ececec; font-size: 32px; font-weight: 300; margin: 0;">Omega Terminal AI</h1>
                        <p style="color: #8e8ea0; margin-top: 12px; font-size: 16px;">How can I help you today?</p>
                    </div>
                    
                    <div style="display: flex; gap: 16px; margin-bottom: 32px; max-width: 100%;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #ab68ff; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🤖</div>
                        <div style="max-width: 65%;">
                            <div style="background: transparent; padding: 0; font-size: 15px; line-height: 1.5; color: #ececec;">
                                Hi there! I'm your Omega Terminal assistant. I can help you with blockchain operations, answer crypto questions, or just have a friendly chat. What's on your mind today?
                            </div>
                            <div style="margin-top: 8px; display: flex; gap: 8px; opacity: 0.7;">
                                <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Copy">📋</button>
                                <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Good response">👍</button>
                                <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Bad response">👎</button>
                                <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Regenerate">🔄</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Centered input at bottom -->
                <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #212121; padding: 32px 20px; border-top: 1px solid #424242;">
                    <div style="max-width: 768px; margin: 0 auto;">
                                            <div style="position: relative; display: flex; align-items: center; background: #2f2f2f; border: 1px solid #565656; border-radius: 24px; padding: 12px 16px;">
                        <div style="color: #8e8ea0; margin-right: 12px; font-size: 20px;">+</div>
                        <input type="text" 
                               placeholder="Ask anything..." 
                               id="chatgptInput" 
                               onkeypress="if(event.key==='Enter') window.OmegaCommands.Basic.handleChatGptInput()"
                               style="flex: 1; background: none; border: none; color: #ececec; font-size: 16px; outline: none; padding: 4px 0;" />
                        <div style="display: flex; gap: 8px; margin-left: 12px;">
                            <button onclick="window.OmegaCommands.Basic.addChatMessage('user', 'TEST USER MESSAGE')" 
                                    style="background: #ff6b6b; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;">TEST</button>
                            <div style="color: #8e8ea0; cursor: pointer; padding: 4px;">🎤</div>
                            <div onclick="window.OmegaCommands.Basic.handleChatGptInput()" 
                                 style="background: #19c37d; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                ➤
                            </div>
                        </div>
                    </div>
                        <p style="text-align: center; color: #8e8ea0; font-size: 13px; margin-top: 16px; margin-bottom: 0;">
                            Omega Terminal can make mistakes. Check important info.
                        </p>
                    </div>
                </div>
            </div>
        `;

    // Focus the input
    setTimeout(() => {
      document.getElementById("chatgptInput")?.focus();
    }, 100);
  },

  // AOL Instant Messenger interface
  createAolInterface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    this.saveCurrentContent(terminal);

    terminalEl.innerHTML = `
            <div class="aol-window">
                <div class="aol-titlebar">
                    <div class="aol-title">Omega Terminal - AOL Instant Messenger</div>
                    <div class="aol-buttons">
                        <button onclick="window.OmegaCommands.Basic.transformInterface('terminal', window.terminal)">X</button>
                    </div>
                </div>
                <div class="aol-content">
                    <div class="aol-buddylist">
                        <div class="aol-section">
                            <strong>🟢 Online (1)</strong>
                            <div class="buddy">OmegaUser (You)</div>
                        </div>
                        <div class="aol-section">
                            <strong>📶 Commands</strong>
                            <div class="buddy clickable" onclick="window.terminal.executeCommand('help')">help</div>
                            <div class="buddy clickable" onclick="window.terminal.executeCommand('balance')">balance</div>
                            <div class="buddy clickable" onclick="window.terminal.executeCommand('mine')">mine</div>
                            <div class="buddy clickable" onclick="window.terminal.executeCommand('faucet')">faucet</div>
                        </div>
                    </div>
                    <div class="aol-chat">
                        <div class="aol-messages">
                            <div class="aol-message">
                                <strong>OmegaSystem:</strong> Welcome to AOL Omega Terminal!<br>
                                Click commands on the left or type below.
                            </div>
                        </div>
                        <div class="aol-input">
                            <input type="text" placeholder="Type a message..." id="aolInput" onkeypress="if(event.key==='Enter') window.OmegaCommands.Basic.handleAolInput()" />
                            <button onclick="window.OmegaCommands.Basic.handleAolInput()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    setTimeout(() => {
      document.getElementById("aolInput")?.focus();
    }, 100);
  },

  // Discord-style interface
  createDiscordInterface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    this.saveCurrentContent(terminal);

    terminalEl.innerHTML = `
            <div class="discord-app">
                <div class="discord-sidebar">
                    <div class="discord-server">Ω</div>
                    <div class="discord-channels">
                        <div class="channel-category">OMEGA CHANNELS</div>
                        <div class="channel active" onclick="window.OmegaCommands.Basic.handleDiscordChannel('terminal')"># terminal</div>
                        <div class="channel" onclick="window.OmegaCommands.Basic.handleDiscordChannel('mining')"># mining</div>
                        <div class="channel" onclick="window.OmegaCommands.Basic.handleDiscordChannel('trading')"># trading</div>
                        <div class="channel" onclick="window.OmegaCommands.Basic.handleDiscordChannel('general')"># general</div>
                        <div class="channel" onclick="window.OmegaCommands.Basic.transformInterface('terminal', window.terminal)">← Exit Discord</div>
                    </div>
                </div>
                <div class="discord-main">
                    <div class="discord-header">
                        <span># terminal</span>
                    </div>
                    <div class="discord-messages">
                        <div class="discord-message">
                            <div class="message-author">OmegaBot</div>
                            <div class="message-text">Welcome to the Omega Terminal Discord! Type commands below or click channels on the left.</div>
                        </div>
                    </div>
                    <div class="discord-input">
                        <input type="text" placeholder="Message #terminal" id="discordInput" onkeypress="if(event.key==='Enter') window.OmegaCommands.Basic.handleDiscordInput()" />
                        <button onclick="window.OmegaCommands.Basic.handleDiscordInput()">Send</button>
                    </div>
                </div>
            </div>
        `;

    setTimeout(() => {
      document.getElementById("discordInput")?.focus();
    }, 100);
  },

  // Windows 95-style interface
  createWindows95Interface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    this.saveCurrentContent(terminal);

    terminalEl.innerHTML = `
            <div class="win95-desktop">
                <div class="win95-window">
                    <div class="win95-titlebar">
                        <div class="win95-title">Omega Terminal - MS-DOS Prompt</div>
                        <div class="win95-buttons">
                            <button onclick="window.OmegaCommands.Basic.transformInterface('terminal', window.terminal)">X</button>
                        </div>
                    </div>
                    <div class="win95-menubar">
                        <span class="menu-item">File</span>
                        <span class="menu-item">Edit</span>
                        <span class="menu-item">View</span>
                        <span class="menu-item">Help</span>
                    </div>
                    <div class="win95-content">
                        <div class="dos-prompt">
                            Microsoft Windows 95<br>
                            (C) Copyright Microsoft Corp 1981-1995.<br><br>
                            C:\\OMEGA&gt; Welcome to Omega Terminal<br>
                            C:\\OMEGA&gt; Type 'help' for available commands<br><br>
                            <span id="dos-output"></span>
                            <div class="dos-input-line">
                                C:\\OMEGA&gt; <input type="text" id="dosInput" onkeypress="if(event.key==='Enter') window.OmegaCommands.Basic.handleDosInput()" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="win95-taskbar">
                    <div class="start-button">Start</div>
                    <div class="taskbar-item">Omega Terminal</div>
                </div>
            </div>
        `;

    setTimeout(() => {
      document.getElementById("dosInput")?.focus();
    }, 100);
  },

  // LimeWire-style interface
  createLimewireInterface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    this.saveCurrentContent(terminal);

    terminalEl.innerHTML = `
            <div class="limewire-app">
                <div class="limewire-header">
                    <div class="limewire-logo">🔥 Omega Terminal - P2P Network</div>
                    <button onclick="window.OmegaCommands.Basic.transformInterface('terminal', window.terminal)">Exit</button>
                </div>
                <div class="limewire-tabs">
                    <div class="tab active">Search</div>
                    <div class="tab">Monitor</div>
                    <div class="tab">Library</div>
                    <div class="tab">Connections</div>
                </div>
                <div class="limewire-search">
                    <div class="search-bar">
                        <input type="text" placeholder="Search the blockchain network..." id="limewireSearch" onkeypress="if(event.key==='Enter') window.OmegaCommands.Basic.handleLimewireSearch()" />
                        <button onclick="window.OmegaCommands.Basic.handleLimewireSearch()">Search</button>
                    </div>
                </div>
                                        <div class="limewire-results" id="limewire-results">
                    <div class="result-header">Network Commands Available:</div>
                    <div class="result-item" onclick="window.terminal.executeCommand('help')">
                        <span class="file-name">help.cmd</span>
                        <span class="file-size">1KB</span>
                        <span class="file-type">Command</span>
                        <button>Execute</button>
                    </div>
                    <div class="result-item" onclick="window.terminal.executeCommand('balance')">
                        <span class="file-name">balance.cmd</span>
                        <span class="file-size">2KB</span>
                        <span class="file-type">Wallet</span>
                        <button>Execute</button>
                    </div>
                    <div class="result-item" onclick="window.terminal.executeCommand('mine')">
                        <span class="file-name">mine.exe</span>
                        <span class="file-size">5KB</span>
                        <span class="file-type">Mining</span>
                        <button>Execute</button>
                    </div>
                </div>
                <div class="limewire-status">
                    <div class="status-bar">Connected to Omega Network | Terminal Commands Active</div>
                </div>
            </div>
        `;

    setTimeout(() => {
      document.getElementById("limewireSearch")?.focus();
    }, 100);
  },

  // Restore original terminal interface
  restoreTerminalInterface: function (terminal) {
    const terminalEl = document.getElementById("terminal");
    if (!terminalEl) return;

    // Restore original terminal HTML structure
    terminalEl.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-title">Omega Terminal v2.0.1</div>
                <div style="display: flex; align-items: center; gap: 18px; margin-left: auto;">
                    <label for="aiProviderSelect" style="color:#00bcf2; font-family: 'Courier New', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">AI:</label>
                    <select id="aiProviderSelect" title="Select AI Provider" style="background: rgba(0, 188, 242, 0.1); border: 1px solid rgba(0, 188, 242, 0.3); border-radius: 6px; padding: 6px 10px; color: #00bcf2; font-family: 'Courier New', monospace; font-size: 11px; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; appearance: none; -webkit-appearance: none; -moz-appearance: none; background-image: linear-gradient(45deg, transparent 50%, #00bcf2 50%), linear-gradient(135deg, #00bcf2 50%, transparent 50%); background-position: calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px); background-size: 5px 5px, 5px 5px; background-repeat: no-repeat; min-width: 110px;">
                        <option value="off">Off</option>
                        <option value="near">NEAR AI</option>
                        <option value="openai">OpenAI</option>
                    </select>
                    <button class="theme-toggle" title="Toggle Theme"></button>
                    <div class="terminal-status" id="connectionStatus">DISCONNECTED</div>
                </div>
            </div>
            <div class="tab-bar" id="tabBar" style="display: flex; align-items: center; background: #111; border-bottom: 1px solid #fff;">
                <div class="tab active" data-tab="0" style="padding: 8px 18px; cursor: pointer; border-right: 1px solid #333; color: #fff; font-weight: bold;">Terminal 1</div>
                <div id="addTabBtn" style="padding: 8px 18px; cursor: pointer; color: #00bcf2; font-size: 1.3em;">+</div>
            </div>
            <div id="faucetInfoBox" style="background: rgba(0, 153, 255, 0.10); border: 1px solid #99ccff; color: #99ccff; padding: 10px 16px; border-radius: 6px; margin: 0 0 12px 0; font-size: 15px;">
                <b>⚡ Faucet Cooldown:</b> Each wallet can only claim once every 24 hours.<br>
                If you try to claim again before the cooldown is over, the transaction will fail.<br><br>
                <b>📱 Platform Notice:</b> Mobile experience is currently being optimized. For the best terminal experience with full features and optimal performance, we recommend using a desktop browser. Mobile support coming soon! 🚀
            </div>
            <div class="terminal-content" id="terminalContent"></div>
            <div class="terminal-input-section">
                <div class="input-line">
                    <span class="input-prompt">Ω Terminal:~$</span>
                    <input type="text" class="input-field" id="commandInput" placeholder="Enter command..." autocomplete="off">
                    <span class="cursor">|</span>
                </div>
            </div>
        `;

    // Restore saved content if available
    this.restoreCurrentContent(terminal);

    // Re-initialize terminal functionality
    this.reconnectTerminal(terminal);
  },

  // Execute command in GUI mode and display output
  executeCommandInGUI: async function (command, guiType) {
    if (!window.terminal) return;

    try {
      // Create a temporary output capture
      let capturedOutput = "";
      const originalLog = window.terminal.log;

      // Override the log function temporarily to capture output
      window.terminal.log = function (message, type = "info") {
        capturedOutput += (capturedOutput ? "\n" : "") + message;
        // Still call the original log function
        originalLog.call(this, message, type);
      };

      // Execute the command
      await window.terminal.executeCommand(command);

      // Restore the original log function
      window.terminal.log = originalLog;

      // Small delay to ensure all output is processed
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Use captured output or fall back to generic message
      let output = capturedOutput || "Command executed successfully";

      // Clean up HTML tags and format for display
      output = output
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (!output) output = "Command completed";

      // Display output in appropriate GUI format
      setTimeout(() => {
        switch (guiType) {
          case "chatgpt":
            this.addChatMessage("assistant", output);
            break;
          case "aol":
            this.addAolMessage("OmegaSystem", output);
            break;
          case "discord":
            this.addDiscordMessage("OmegaBot", output);
            break;
          case "windows95":
            const dosOutput = document.getElementById("dos-output");
            if (dosOutput) {
              dosOutput.innerHTML += output.replace(/\n/g, "<br>") + "<br>";
              dosOutput.scrollTop = dosOutput.scrollHeight;
            }
            break;
          case "limewire":
            const limewireResults = document.getElementById("limewire-results");
            if (limewireResults) {
              limewireResults.innerHTML += `<div class="search-result">📊 ${output}</div>`;
              limewireResults.scrollTop = limewireResults.scrollHeight;
            }
            break;
        }
      }, 50);
    } catch (error) {
      console.error("Error executing command in GUI:", error);
      const errorMsg = `Error: ${error.message || "Command failed"}`;

      switch (guiType) {
        case "chatgpt":
          this.addChatMessage("assistant", errorMsg);
          break;
        case "aol":
          this.addAolMessage("OmegaSystem", errorMsg);
          break;
        case "discord":
          this.addDiscordMessage("OmegaBot", errorMsg);
          break;
        case "windows95":
          const dosOutput = document.getElementById("dos-output");
          if (dosOutput) {
            dosOutput.innerHTML += errorMsg + "<br>";
          }
          break;
        case "limewire":
          const limewireResults = document.getElementById("limewire-results");
          if (limewireResults) {
            limewireResults.innerHTML += `<div class="search-result">❌ ${errorMsg}</div>`;
          }
          break;
      }
    }
  },

  // Helper functions to handle input from different interfaces
  handleChatGptInput: function () {
    const input = document.getElementById("chatgptInput");
    if (input && input.value.trim() && window.terminal) {
      const message = input.value.trim();
      this.addChatMessage("user", message);

      // Special handling for gui terminal command
      if (message === "gui terminal") {
        this.transformInterface("terminal", window.terminal);
        localStorage.setItem("omega-gui-style", "terminal");
        return;
      }

      // Handle both conversational messages and terminal commands
      this.handleChatGptResponse(message);
      input.value = "";
    }
  },

  handleChatGptResponse: function (message) {
    const lowerMsg = message.toLowerCase();

    // Conversational responses
    if (
      lowerMsg.includes("hi") ||
      lowerMsg.includes("hello") ||
      lowerMsg === "hey"
    ) {
      const greetings = [
        "Hello! How can I help you today?",
        "Hi there! What would you like to know?",
        "Hey! How's your day going?",
        "Hello! I'm here to help with any questions you have.",
      ];
      setTimeout(() => {
        this.addChatMessage(
          "assistant",
          greetings[Math.floor(Math.random() * greetings.length)]
        );
      }, 500);
      return;
    }

    if (lowerMsg.includes("how are you")) {
      setTimeout(() => {
        this.addChatMessage(
          "assistant",
          "I'm doing well, thank you for asking! I'm here to help you with the Omega Terminal or answer any questions you might have. What can I assist you with?"
        );
      }, 500);
      return;
    }

    if (lowerMsg.includes("what can you do") || lowerMsg.includes("help")) {
      setTimeout(() => {
        this.addChatMessage(
          "assistant",
          "I can help you with:\n\n• Terminal commands like `balance`, `mine`, `faucet`\n• Blockchain and DeFi questions\n• Trading and swaps on Solana, Eclipse, and Near\n• General crypto and Web3 information\n\nFeel free to ask me anything or try a terminal command!"
        );
      }, 500);
      return;
    }

    // Check if it's a terminal command using the comprehensive command list
    const availableCommands = window.OmegaConfig?.AVAILABLE_COMMANDS || [
      "help",
      "clear",
      "ai",
      "connect",
      "disconnect",
      "yes",
      "import",
      "balance",
      "faucet",
      "mine",
      "claim",
      "status",
      "stats",
      "send",
      "ens",
      "mixer",
      "stress",
      "stopstress",
      "stressstats",
      "theme",
      "gui",
      "rickroll",
      "fortune",
      "matrix",
      "hack",
      "disco",
      "stop",
      "tab",
      "email",
      "inbox",
      "dexscreener",
      "geckoterminal",
      "stock",
      "alphakey",
      "ds",
      "cg",
      "alpha",
      "solana",
      "near",
      "eclipse",
      "airdrop",
      "hyperliquid",
      "polymarket",
      "magiceden",
      "create",
      "ascii",
      "ambassador",
      "referral",
    ];

    // Check if message starts with any available command or contains command patterns
    const isTerminalCommand = availableCommands.some((cmd) => {
      return (
        lowerMsg === cmd ||
        lowerMsg.startsWith(cmd + " ") ||
        lowerMsg.startsWith(cmd)
      );
    });

    if (isTerminalCommand) {
      // Execute as terminal command
      this.executeCommandInGUI(message, "chatgpt");
    } else {
      // Generate conversational response
      setTimeout(() => {
        const responses = [
          "That's an interesting question! While I don't have specific information about that, I can help you with Omega Terminal commands and blockchain-related queries. Try asking about balance, mining, or trading!",
          "I'd be happy to help! Could you be more specific about what you'd like to know? I'm great with terminal commands and crypto-related questions.",
          "Great question! I'm designed to help with Omega Terminal functions and blockchain operations. What specific area would you like to explore?",
          "Thanks for asking! I can assist with various terminal operations and cryptocurrency functions. Would you like to try a command like `balance` or `help`?",
        ];
        this.addChatMessage(
          "assistant",
          responses[Math.floor(Math.random() * responses.length)]
        );
      }, 800);
    }
  },

  handleAolInput: function () {
    const input = document.getElementById("aolInput");
    if (input && input.value.trim() && window.terminal) {
      const command = input.value.trim();
      this.addAolMessage("OmegaUser", command);

      // Special handling for gui terminal command
      if (command === "gui terminal") {
        this.transformInterface("terminal", window.terminal);
        localStorage.setItem("omega-gui-style", "terminal");
        return;
      }

      this.executeCommandInGUI(command, "aol");
      input.value = "";
    }
  },

  handleDiscordInput: function () {
    const input = document.getElementById("discordInput");
    if (input && input.value.trim() && window.terminal) {
      const command = input.value.trim();
      this.addDiscordMessage("OmegaUser", command);

      // Special handling for gui terminal command
      if (command === "gui terminal") {
        this.transformInterface("terminal", window.terminal);
        localStorage.setItem("omega-gui-style", "terminal");
        return;
      }

      this.executeCommandInGUI(command, "discord");
      input.value = "";
    }
  },

  handleLimewireSearch: function () {
    const input = document.getElementById("limewireSearch");
    if (input && input.value.trim() && window.terminal) {
      const command = input.value.trim();
      const results = document.getElementById("limewire-results");

      // Add search indicator
      if (results) {
        results.innerHTML += `<div class="search-result">🔍 Searching for: ${command}</div>`;
      }

      // Special handling for gui terminal command
      if (command === "gui terminal") {
        this.transformInterface("terminal", window.terminal);
        localStorage.setItem("omega-gui-style", "terminal");
        return;
      }

      this.executeCommandInGUI(command, "limewire");
      input.value = "";
    }
  },

  handleDosInput: function () {
    const input = document.getElementById("dosInput");
    if (input && input.value.trim() && window.terminal) {
      const command = input.value.trim();
      const output = document.getElementById("dos-output");

      // Add command to DOS output
      if (output) {
        output.innerHTML += `C:\\OMEGA&gt; ${command}<br>`;
      }

      // Special handling for gui terminal command
      if (command === "gui terminal") {
        this.transformInterface("terminal", window.terminal);
        localStorage.setItem("omega-gui-style", "terminal");
        return;
      }

      // Execute command and capture output
      this.executeCommandInGUI(command, "windows95");
      input.value = "";
    }
  },

  // Helper functions to add messages to different interfaces
  addChatMessage: function (sender, message) {
    console.log("[DEBUG] addChatMessage called with:", sender, message); // Debug line
    const conversation = document.querySelector(".chatgpt-conversation");
    if (conversation) {
      const messageEl = document.createElement("div");
      const isUser = sender === "user";
      console.log("[DEBUG] isUser:", isUser); // Debug line

      if (isUser) {
        console.log("[DEBUG] Creating user message on RIGHT side"); // Debug line
        // User message - aligned to the right
        messageEl.style.cssText = `
                    display: flex; 
                    justify-content: flex-end;
                    margin-bottom: 32px; 
                    width: 100%;
                `;

        messageEl.innerHTML = `
                    <div style="display: flex; gap: 16px; align-items: flex-start; max-width: 70%;">
                        <div style="
                            background: #19c37d; 
                            padding: 12px 16px; 
                            border-radius: 18px;
                            font-size: 15px; 
                            line-height: 1.5; 
                            color: white;
                            border: 1px solid #22d35b;
                            word-wrap: break-word;
                            order: 1;
                        ">
                            ${message}
                        </div>
                        <div style="
                            width: 40px; 
                            height: 40px; 
                            border-radius: 50%; 
                            background: #19c37d; 
                            color: white; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            flex-shrink: 0; 
                            font-size: 18px;
                            order: 2;
                        ">👤</div>
                    </div>
                `;
      } else {
        console.log("[DEBUG] Creating assistant message on LEFT side"); // Debug line
        // Assistant message - aligned to the left
        messageEl.style.cssText = `
                    display: flex; 
                    gap: 16px; 
                    margin-bottom: 32px; 
                    width: 100%;
                `;

        messageEl.innerHTML = `
                    <div style="
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        background: #ab68ff; 
                        color: white; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        flex-shrink: 0; 
                        font-size: 18px;
                    ">🤖</div>
                    <div style="max-width: 70%;">
                        <div style="
                            background: transparent; 
                            padding: 0; 
                            font-size: 15px; 
                            line-height: 1.5; 
                            color: #ececec;
                        ">
                            ${message}
                        </div>
                        <div style="margin-top: 8px; display: flex; gap: 8px; opacity: 0.7;">
                            <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Copy">📋</button>
                            <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Good response">👍</button>
                            <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Bad response">👎</button>
                            <button style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 4px; border-radius: 4px;" title="Regenerate">🔄</button>
                        </div>
                    </div>
                `;
      }

      conversation.appendChild(messageEl);
      conversation.scrollTop = conversation.scrollHeight;
    }
  },

  addAolMessage: function (sender, message) {
    const messages = document.querySelector(".aol-messages");
    if (messages) {
      const messageEl = document.createElement("div");
      messageEl.className = "aol-message";
      messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
      messages.appendChild(messageEl);
      messages.scrollTop = messages.scrollHeight;
    }
  },

  addDiscordMessage: function (sender, message) {
    const messages = document.querySelector(".discord-messages");
    if (messages) {
      const messageEl = document.createElement("div");
      messageEl.className = "discord-message";
      messageEl.innerHTML = `
                <div class="message-author">${sender}</div>
                <div class="message-text">${message}</div>
            `;
      messages.appendChild(messageEl);
      messages.scrollTop = messages.scrollHeight;
    }
  },

  // Save/restore content helpers
  saveCurrentContent: function (terminal) {
    const content = document.getElementById("terminalContent");
    if (content && terminal) {
      terminal._savedContent = content.innerHTML;
    }
  },

  restoreCurrentContent: function (terminal) {
    const content = document.getElementById("terminalContent");
    if (content && terminal && terminal._savedContent) {
      content.innerHTML = terminal._savedContent;
    }
  },

  // Reconnect terminal functionality after restoring interface
  reconnectTerminal: function (terminal) {
    if (!terminal) return;

    // Reconnect the command input
    const commandInput = document.getElementById("commandInput");
    if (commandInput) {
      // Clear any existing listeners
      commandInput.removeEventListener("keypress", terminal.handleKeyPress);

      // Add the keypress listener back
      terminal.handleKeyPress = function (event) {
        if (event.key === "Enter") {
          const command = event.target.value.trim();
          if (command) {
            terminal.executeCommand(command);
            event.target.value = "";
          }
        }
      };

      // Event listener handled by terminal-core.js ensureCommandInputVisible()

      // Focus the input
      commandInput.focus();
    }

    // Reconnect other terminal UI elements
    const connectionStatus = document.getElementById("connectionStatus");
    if (connectionStatus && terminal.userAddress) {
      connectionStatus.textContent = "CONNECTED";
      connectionStatus.style.color = "#00ff00";
    }

    // Show welcome message if terminal was just restored
    if (terminal.log) {
      terminal.log("✅ Terminal interface restored", "success");
      terminal.log('Type "help" for available commands', "info");
    }
  },

  // Apply GUI style function (simplified)
  applyGuiStyle: function (styleName) {
    // Remove existing GUI style classes
    const body = document.body;
    body.className = body.className.replace(/gui-\w+/g, "");

    // Add new GUI style class
    body.classList.add(`gui-${styleName}`);

    console.log(`Applied GUI style: ${styleName}`);
  },

  // Force terminal input to be visible - aggressive fix
  forceTerminalInputVisible: function () {
    console.log("[DEBUG] forceTerminalInputVisible called");

    let commandInput = document.getElementById("commandInput");
    let inputSection = document.querySelector(".terminal-input-section");
    let terminal = document.getElementById("terminal");

    console.log("[DEBUG] Found elements:", {
      commandInput: !!commandInput,
      inputSection: !!inputSection,
      terminal: !!terminal,
    });

    // If input section is missing, recreate it
    if (!inputSection && terminal) {
      console.log("[DEBUG] Recreating missing input section");

      const newInputSection = document.createElement("div");
      newInputSection.className = "terminal-input-section";
      newInputSection.style.cssText =
        "display: flex !important; width: calc(100vw - 40px) !important; max-width: calc(100vw - 40px) !important; box-sizing: border-box !important; background: rgba(255,255,255,0.05) !important; border: 1px solid #ffffff !important; border-radius: 5px !important; padding: 15px !important; margin: 0 !important; overflow: hidden !important;";
      newInputSection.innerHTML = `
                                  <div class="input-line" style="display: flex !important; width: 100% !important; align-items: center;">
                      <span class="input-prompt">Ω Terminal:~$</span>
                      <input type="text" class="input-field" id="commandInput" placeholder="" autocomplete="off" style="flex: 1 !important; width: 100% !important; min-width: 0 !important; background: none !important; border: none !important; color: #ffffff !important; font-family: 'Courier New', monospace !important; outline: none !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; overflow: visible !important;">
                  </div>
            `;

      terminal.appendChild(newInputSection);
      commandInput = document.getElementById("commandInput");
      inputSection = newInputSection;
    }

    // Force visibility with multiple approaches
    if (inputSection) {
      inputSection.style.display = "flex !important";
      inputSection.style.visibility = "visible";
      inputSection.style.opacity = "1";
      inputSection.classList.remove("hidden");
      console.log("[DEBUG] Input section forced visible");
    }

    if (commandInput) {
      commandInput.style.display = "block !important";
      commandInput.style.visibility = "visible";
      commandInput.style.opacity = "1";
      commandInput.classList.remove("hidden");

      // Event listener handled by terminal-core.js ensureCommandInputVisible()

      // Focus the input
      commandInput.focus();
      console.log("[DEBUG] Command input forced visible and focused");
    }

    // Remove any GUI classes that might be hiding the input
    document.body.className = document.body.className.replace(/gui-\w+/g, "");
    console.log("[DEBUG] GUI classes removed to ensure terminal visibility");

    // Also force the main terminal to be visible
    if (terminal) {
      terminal.style.display = "flex";
      terminal.style.visibility = "visible";
      terminal.style.opacity = "1";
      console.log("[DEBUG] Terminal element forced visible");
    }

    // Hide boot animation if it's still showing
    const bootAnimation = document.getElementById("bootAnimation");
    if (bootAnimation) {
      bootAnimation.style.display = "none";
      console.log("[DEBUG] Boot animation hidden");
    }
  },

  // Status command
  status: function (terminal) {
    terminal.log("=== SYSTEM STATUS ===", "info");
    terminal.log(`Version: ${OmegaConfig.VERSION}`, "info");
    terminal.log(`Theme: ${OmegaThemes.getCurrentTheme()}`, "info");
    terminal.log(
      `GUI Style: ${localStorage.getItem("omega-gui-style") || "terminal"}`,
      "info"
    );

    const isAIMode = localStorage.getItem("omega-ai-mode") === "true";
    terminal.log(
      `AI Mode: ${isAIMode ? "ON 🤖" : "OFF"}`,
      isAIMode ? "success" : "info"
    );

    if (terminal.provider && terminal.signer) {
      terminal.log("Wallet: Connected", "success");
      if (terminal.userAddress) {
        terminal.log(`Address: ${terminal.userAddress}`, "info");
      }
    } else {
      terminal.log("Wallet: Not connected", "warning");
    }

    if (terminal.contract) {
      terminal.log("Mining Contract: Connected", "success");
    } else {
      terminal.log("Mining Contract: Not connected", "warning");
    }

    terminal.log(`Relayer URL: ${OmegaConfig.RELAYER_URL}`, "info");
    terminal.log(`RPC URL: ${OmegaConfig.OMEGA_RPC_URL}`, "info");

    if (isAIMode) {
      terminal.log(
        "\n🤖 AI Assistant is ready! Ask me anything or use natural language.",
        "success"
      );
    }
  },

  // Tab management
  tab: function (terminal, args) {
    if (args.length < 2) {
      terminal.log("Usage: tab <new|close|switch> [number]", "info");
      return;
    }

    const action = args[1].toLowerCase();
    switch (action) {
      case "new":
        // This would be handled by the terminal class
        terminal.log("Creating new tab...", "info");
        break;
      case "close":
        terminal.log("Closing current tab...", "info");
        break;
      case "switch":
        const tabNum = parseInt(args[2]);
        if (isNaN(tabNum)) {
          terminal.log("Please specify tab number", "error");
          return;
        }
        terminal.log(`Switching to tab ${tabNum}...`, "info");
        break;
      default:
        terminal.log("Invalid tab command", "error");
    }
  },

  // View mode command - toggle between basic and futuristic
  view: function (terminal, args) {
    if (!args || args.length < 2) {
      // Show current mode
      const currentMode =
        localStorage.getItem("omega-view-mode") || "futuristic";
      terminal.log("📺 Terminal View Modes:", "info");
      terminal.log("");
      terminal.log(
        `  Current mode: ${currentMode.toUpperCase()}`,
        currentMode === "basic" ? "success" : "info"
      );
      terminal.log("");
      terminal.log("Available commands:", "info");
      terminal.log("  view basic       → Modern terminal only (no dashboard)");
      terminal.log("  view futuristic  → Full dashboard with sidebar & stats");
      terminal.log("  view toggle      → Switch between modes");
      terminal.log("");
      terminal.log("💡 Your preference is saved automatically!", "info");
      return;
    }

    const mode = args[1].toLowerCase();

    if (!window.FuturisticDashboard) {
      terminal.log("❌ Dashboard system not loaded", "error");
      return;
    }

    switch (mode) {
      case "basic":
      case "classic":
      case "simple":
        window.FuturisticDashboard.enableBasicMode();
        break;

      case "futuristic":
      case "dashboard":
      case "advanced":
        window.FuturisticDashboard.enableFuturisticMode();
        break;

      case "toggle":
      case "switch":
        window.FuturisticDashboard.toggleClassicMode();
        break;

      default:
        terminal.log("❌ Invalid view mode", "error");
        terminal.log(
          "Use: view basic, view futuristic, or view toggle",
          "info"
        );
    }
  },

  // AI Command - Chat with OMEGA AI
  ai: function (terminal, args) {
    if (!args || args.length === 0) {
      terminal.log("🤖 OMEGA AI Assistant", "info");
      terminal.log("Usage: ai <your message>", "info");
      terminal.log('Example: ai "What is my balance?"', "info");
      terminal.log('Example: ai "Help me create a token"', "info");
      terminal.log("", "info");
      const isAIMode = localStorage.getItem("omega-ai-mode") === "true";
      terminal.log(`AI Mode: ${isAIMode ? "ON 🟢" : "OFF 🔴"}`, "info");
      terminal.log("Toggle AI Mode using the button in the header", "info");
      return;
    }

    const message = args.join(" ");
    this.callAI(terminal, message, false); // false = not AI mode, explicit ai command
  },

  // Call AI API
  callAI: async function (terminal, prompt, isAIMode = false) {
    if (!prompt || prompt.trim() === "") {
      terminal.log("❌ Please provide a message for the AI", "error");
      return;
    }

    try {
      // Removed processing messages for cleaner UX
      console.log(
        "[DEBUG] 🎯 Calling AI endpoint:",
        `${OmegaConfig.RELAYER_URL}/ai`
      );

      const response = await fetch(`${OmegaConfig.RELAYER_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: "terminal-user",
          canExecute: true, // Allow AI to execute commands
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.type === "command") {
        // AI decided to execute a command
        terminal.log(`🤖 ${data.answer}`, "success");

        // Execute the command
        if (data.command && data.command !== "ai") {
          const fullCommand = data.params
            ? `${data.command} ${data.params}`
            : data.command;
          terminal.log(`⚡ Executing: ${fullCommand}`, "info");
          await terminal.executeCommand(fullCommand);
        }
      } else {
        // Regular AI response
        terminal.log(`🤖 AI: ${data.answer}`, "info");
      }
    } catch (error) {
      console.error("AI Error:", error);
      terminal.log(`❌ AI Error: ${error.message}`, "error");

      if (error.message.includes("not configured")) {
        terminal.log(
          "💡 Make sure OPENAI_API_KEY is set in your .env file",
          "info"
        );
      }
    }
  },
};

console.log("[DEBUG] OmegaCommands.Basic loaded successfully");
console.log(
  "[DEBUG] GUI function exists:",
  typeof window.OmegaCommands.Basic.gui
);
