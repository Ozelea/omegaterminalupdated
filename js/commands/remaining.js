// Remaining Commands Module (Placeholder/Stub implementations)
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Remaining = {
  // Email commands (real implementation)
  email: function (terminal, args) {
    if (args && args.length > 1 && args[1] === "clearkey") {
      terminal.e2eePrivateKey = null;
      terminal.log("E2EE private key cleared from memory.", "success");
      return;
    }

    if (!OmegaWallet.isConnected()) {
      terminal.log(
        "❌ Please connect your wallet first using: connect",
        "error"
      );
      return;
    }

    terminal.awaitingDMRecipient = true;
    terminal.awaitingDMMessage = false;
    terminal.tempDMRecipient = "";
    terminal.log("📧 Send an on-chain encrypted message", "info");
    terminal.log("Enter recipient (address or ENS):", "info");
  },

  inbox: async function (terminal, args) {
    if (!OmegaWallet.isConnected()) {
      terminal.log(
        "❌ Please connect your wallet first using: connect",
        "error"
      );
      return;
    }

    const showAll = args && args.length > 1 && args[1] === "all";
    await this.showInbox(terminal, showAll);
  },

  // ENS commands (Omega Network ENS - full implementation)
  ens: async function (terminal, args) {
    if (!args || args.length < 2) {
      terminal.log(
        "Usage: ens register <name> | ens resolve <name> | ens search <name>",
        "info"
      );
      terminal.log("Examples:", "info");
      terminal.log("  ens register myname", "info");
      terminal.log("  ens resolve myname", "info");
      terminal.log("  ens search myname", "info");
      return;
    }

    const subCommand = args[1].toLowerCase();

    if (subCommand === "register" && args[2]) {
      if (!OmegaWallet.isConnected()) {
        terminal.log(
          "❌ Please connect your wallet first using: connect",
          "error"
        );
        return;
      }

      const name = args[2];
      terminal.log(`📝 Registering ENS name: ${name}...`, "info");
      try {
        const ens = this.getENSContract(OmegaWallet.getSigner());
        const tx = await ens.register(name);
        terminal.log(`✅ Registration transaction sent: ${tx.hash}`, "success");
        terminal.log("⏳ Waiting for confirmation...", "info");
        await tx.wait();
        terminal.log(`✅ Name registered: ${name}`, "success");
        terminal.logHtml(
          `🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`,
          "info"
        );
      } catch (err) {
        terminal.log(`❌ Registration failed: ${err.message}`, "error");
        if (err.message.includes("already exists")) {
          terminal.log(
            "💡 This name is already registered by someone else",
            "info"
          );
        }
      }
    } else if (subCommand === "resolve" && args[2]) {
      const name = args[2];
      terminal.log(`🌐 Resolving ENS name: ${name}...`, "info");
      try {
        const ens = this.getENSContract();
        const address = await ens.resolve(name);
        if (
          address &&
          address !== "0x0000000000000000000000000000000000000000"
        ) {
          terminal.logHtml(
            `✅ <b>${name}</b> resolves to <span class="copyable" onclick="navigator.clipboard.writeText('${address}').then(() => window.terminal.log('✅ Address copied!', 'success'))">${address}</span>`,
            "success"
          );
        } else {
          terminal.log(`❌ Name not found: ${name}`, "error");
          terminal.log("💡 This ENS name has not been registered yet", "info");
        }
      } catch (err) {
        terminal.log(`❌ Resolve failed: ${err.message}`, "error");
      }
    } else if (subCommand === "search" && args[2]) {
      const name = args[2];
      terminal.log(`🔍 Searching for ENS name: ${name}...`, "info");
      try {
        const ens = this.getENSContract();
        const address = await ens.resolve(name);
        if (
          address &&
          address !== "0x0000000000000000000000000000000000000000"
        ) {
          terminal.logHtml(
            `✅ <b>${name}</b> is owned by <span class="copyable" onclick="navigator.clipboard.writeText('${address}').then(() => window.terminal.log('✅ Address copied!', 'success'))">${address}</span>`,
            "success"
          );
        } else {
          terminal.log(`❌ Name not found: ${name}`, "error");
          terminal.log(
            "💡 This ENS name is available for registration",
            "info"
          );
        }
      } catch (err) {
        terminal.log(`❌ ENS search failed: ${err.message}`, "error");
      }
    } else {
      terminal.log(
        "Usage: ens register <name> | ens resolve <name> | ens search <name>",
        "info"
      );
      terminal.log("Examples:", "info");
      terminal.log(
        "  ens register myname    - Register a new ENS name",
        "info"
      );
      terminal.log(
        "  ens resolve myname     - Get address for ENS name",
        "info"
      );
      terminal.log(
        "  ens search myname      - Check if ENS name exists",
        "info"
      );
    }
  },

  // Airdrop commands
  airdrop: function (terminal, args) {
    terminal.log("=== AIRDROP SCANNER ===", "info");
    terminal.log("🪂 Scanning for available airdrops...", "info");
    terminal.log(
      "🚧 Airdrop scanner is being refactored for modular version",
      "warning"
    );
    terminal.log(
      "💡 This will check your wallet for eligible airdrops",
      "info"
    );
    terminal.log("🔜 Coming soon in next update!", "info");
  },

  // Solana/Eclipse commands
  solana: function (terminal, args) {
    terminal.log("=== SOLANA INTEGRATION ===", "info");
    terminal.log("☀️ Solana blockchain integration", "info");
    terminal.log(
      "🚧 Solana commands are being refactored for modular version",
      "warning"
    );
    terminal.log(
      "💡 This will support Solana wallet operations and token swaps",
      "info"
    );
    terminal.log("🔜 Coming soon in next update!", "info");
  },

  eclipse: function (terminal, args) {
    terminal.log("=== ECLIPSE INTEGRATION ===", "info");
    terminal.log("🌘 Eclipse blockchain integration", "info");
    terminal.log(
      "🚧 Eclipse commands are being refactored for modular version",
      "warning"
    );
    terminal.log("💡 This will support Eclipse network operations", "info");
    terminal.log("🔜 Coming soon in next update!", "info");
  },

  // Trading platform integrations
  hyperliquid: function (terminal, args) {
    terminal.log("=== HYPERLIQUID INTEGRATION ===", "info");
    terminal.log("🚀 Hyperliquid DEX integration", "info");
    terminal.log(
      "🚧 Hyperliquid commands are being refactored for modular version",
      "warning"
    );
    terminal.log("💡 This will support Hyperliquid trading operations", "info");
    terminal.log("🔜 Coming soon in next update!", "info");
  },

  polymarket: async function (terminal, args) {
    console.log("🔧 DEBUG: handlePolymarketCommand called with args:", args);

    if (args.length === 0) {
      this.showPolymarketHelp(terminal);
      return;
    }

    const subcommand = args[0].toLowerCase();
    console.log("🔧 DEBUG: Processing subcommand:", subcommand);

    switch (subcommand) {
      case "help":
        this.showPolymarketHelp(terminal);
        break;
      case "markets":
        await this.getPolymarketMarkets(terminal);
        break;
      case "trending":
        await this.getPolymarketTrending(terminal);
        break;
      case "events":
        await this.getPolymarketEvents(terminal);
        break;
      case "recent":
        await this.getPolymarketRecent(terminal);
        break;
      case "new":
        await this.getPolymarketNew(terminal);
        break;
      case "breaking":
        await this.getPolymarketBreaking(terminal);
        break;
      case "politics":
        await this.getPolymarketPolitics(terminal);
        break;
      case "sports":
        await this.getPolymarketSports(terminal);
        break;
      case "crypto":
        await this.getPolymarketCrypto(terminal);
        break;
      case "earnings":
        await this.getPolymarketEarnings(terminal);
        break;
      case "geopolitics":
        await this.getPolymarketGeopolitics(terminal);
        break;
      case "tech":
        await this.getPolymarketTech(terminal);
        break;
      case "culture":
        await this.getPolymarketCulture(terminal);
        break;
      case "world":
        await this.getPolymarketWorld(terminal);
        break;
      case "economy":
        await this.getPolymarketEconomy(terminal);
        break;
      case "trump":
        await this.getPolymarketTrump(terminal);
        break;
      case "elections":
        await this.getPolymarketElections(terminal);
        break;
      case "search":
        if (args.length < 2) {
          terminal.log("❌ Usage: polymarket search <query>", "error");
          return;
        }
        await this.searchPolymarket(terminal, args.slice(1).join(" "));
        break;
      default:
        terminal.log(`❌ Unknown subcommand: ${subcommand}`, "error");
        this.showPolymarketHelp(terminal);
    }
  },

  showPolymarketHelp: function (terminal) {
    terminal.log("🎯 POLYMARKET PREDICTION MARKETS", "info");
    terminal.log("════════════════════════════════════", "output");
    terminal.log("📋 MAIN COMMANDS:", "info");
    terminal.log("polymarket help        Show this help", "output");
    terminal.log("polymarket markets     Get current active markets", "output");
    terminal.log("polymarket trending    Get top volume markets", "output");
    terminal.log(
      "polymarket events      Get recent events (last 6 months)",
      "output"
    );
    terminal.log(
      "polymarket recent      Get very recent events (last month)",
      "output"
    );
    terminal.log("polymarket search <q>  Search markets", "output");
    terminal.log("", "output");
    terminal.log("🔥 CATEGORY COMMANDS:", "info");
    terminal.log("polymarket breaking    Breaking news markets", "output");
    terminal.log("polymarket new         Newest markets", "output");
    terminal.log("polymarket politics    Political markets", "output");
    terminal.log("polymarket sports      Sports markets", "output");
    terminal.log("polymarket crypto      Crypto markets", "output");
    terminal.log("polymarket earnings    Earnings markets", "output");
    terminal.log("polymarket geopolitics Geopolitical markets", "output");
    terminal.log("polymarket tech        Technology markets", "output");
    terminal.log("polymarket culture     Culture markets", "output");
    terminal.log("polymarket world       World events", "output");
    terminal.log("polymarket economy     Economic markets", "output");
    terminal.log("polymarket trump       Trump-related markets", "output");
    terminal.log("polymarket elections   Election markets", "output");
    terminal.log("", "output");
    terminal.log("🎯 EXAMPLES:", "info");
    terminal.log("polymarket markets     # Current active markets", "output");
    terminal.log("polymarket trending    # Highest volume markets", "output");
    terminal.log("polymarket politics    # Political predictions", "output");
    terminal.log("polymarket crypto      # Crypto predictions", "output");
    terminal.log("polymarket breaking    # Breaking news markets", "output");
    terminal.log('polymarket search "AI" # Search for AI markets', "output");
  },

  makePolymarketRequest: async function (endpoint) {
    console.log(
      "🔧 DEBUG: makePolymarketRequest called with endpoint:",
      endpoint
    );

    // Use proxy to avoid CORS issues - automatically uses Render URL in production
    const baseUrl =
      window.OmegaConfig?.RELAYER_URL || "https://terminal-v1-5-9.onrender.com";
    const fullUrl = `${baseUrl}/polymarket${endpoint}`;
    console.log("🔧 DEBUG: Making request to:", fullUrl);

    try {
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("🔧 DEBUG: API response received:", data);
      return data;
    } catch (error) {
      console.log("🔧 DEBUG: API request failed:", error);
      throw new Error(`Polymarket API Error: ${error.message}`);
    }
  },

  getPolymarketMarkets: async function (terminal) {
    terminal.log("📊 Fetching comprehensive Polymarket markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=100"
      );
      this.displayPolymarketMarkets(terminal, data, "Current Active Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketTrending: async function (terminal) {
    terminal.log("🔥 Fetching trending Polymarket markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=volume&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(
        terminal,
        data,
        "Trending Markets (Highest Volume)"
      );
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketEvents: async function (terminal) {
    terminal.log("📅 Fetching recent Polymarket events...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=100"
      );
      this.displayPolymarketMarkets(
        terminal,
        data,
        "Recent Events (Last 6 Months)"
      );
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketRecent: async function (terminal) {
    terminal.log("🆕 Fetching very recent Polymarket events...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(
        terminal,
        data,
        "Very Recent Events (Last Month)"
      );
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketNew: async function (terminal) {
    terminal.log("🆕 Fetching newest markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=100"
      );
      this.displayPolymarketMarkets(terminal, data, "Newest Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketBreaking: async function (terminal) {
    terminal.log("🚨 Fetching breaking news markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Breaking News Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketPolitics: async function (terminal) {
    terminal.log("🏛️ Fetching political markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Political Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketSports: async function (terminal) {
    terminal.log("⚽ Fetching sports markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Sports Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketCrypto: async function (terminal) {
    terminal.log("₿ Fetching crypto markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Crypto Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketEarnings: async function (terminal) {
    terminal.log("💰 Fetching earnings markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Earnings Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketGeopolitics: async function (terminal) {
    terminal.log("🌍 Fetching geopolitical markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Geopolitical Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketTech: async function (terminal) {
    terminal.log("💻 Fetching technology markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Technology Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketCulture: async function (terminal) {
    terminal.log("🎭 Fetching culture markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Culture Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketWorld: async function (terminal) {
    terminal.log("🌎 Fetching world events markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "World Events Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketEconomy: async function (terminal) {
    terminal.log("📈 Fetching economic markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Economic Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketTrump: async function (terminal) {
    terminal.log("🗽 Fetching Trump-related markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Trump-Related Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  getPolymarketElections: async function (terminal) {
    terminal.log("🗳️ Fetching election markets...", "info");

    try {
      const data = await this.makePolymarketRequest(
        "/events?order=id&ascending=false&closed=false&limit=50"
      );
      this.displayPolymarketMarkets(terminal, data, "Election Markets");
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  searchPolymarket: async function (terminal, query) {
    terminal.log(`🔍 Searching Polymarket for: "${query}"`, "info");

    try {
      const data = await this.makePolymarketRequest(
        `/events?order=id&ascending=false&closed=false&limit=50`
      );
      // Filter results by query (client-side filtering since API doesn't support search)
      const filteredData = data.filter(
        (event) =>
          event.question &&
          event.question.toLowerCase().includes(query.toLowerCase())
      );
      this.displayPolymarketMarkets(
        terminal,
        filteredData,
        `Search Results for "${query}"`
      );
    } catch (error) {
      terminal.log(`❌ ${error.message}`, "error");
      terminal.log(
        "💡 Make sure the relayer server is running: npm run start:relayer (or node server/relayer-faucet.js)",
        "info"
      );
    }
  },

  displayPolymarketMarkets: function (terminal, data, title) {
    if (!data || data.length === 0) {
      terminal.log("❌ No markets found", "error");
      return;
    }

    terminal.log(`📊 ${title}`, "info");
    terminal.log(
      "════════════════════════════════════════════════════════════════════════════════",
      "output"
    );
    terminal.log("");

    data.slice(0, 20).forEach((market, index) => {
      const num = (index + 1).toString().padStart(2, " ");
      const question = market.question || "No question available";
      const volume = market.volume
        ? `$${parseFloat(market.volume).toLocaleString()}`
        : "N/A";
      const endDate = market.end_date_iso
        ? new Date(market.end_date_iso).toLocaleDateString()
        : "N/A";
      const status = market.closed ? "🔒 Closed" : "🟢 Active";

      terminal.log(`${num}. ${question}`, "output");
      terminal.log(
        `    💰 Volume: ${volume} | 📅 End: ${endDate} | ${status}`,
        "info"
      );

      if (market.outcomes && market.outcomes.length > 0) {
        market.outcomes.forEach((outcome) => {
          const price = outcome.price
            ? `$${parseFloat(outcome.price).toFixed(2)}`
            : "N/A";
          terminal.log(`    📊 ${outcome.name}: ${price}`, "output");
        });
      }

      terminal.log("", "output");
    });

    if (data.length > 20) {
      terminal.log(`... and ${data.length - 20} more markets`, "info");
    }

    terminal.log('💡 Use "polymarket help" for more commands', "info");
  },

  magiceden: function (terminal, args) {
    terminal.log("=== MAGIC EDEN INTEGRATION ===", "info");
    terminal.log("🎨 Magic Eden NFT marketplace integration", "info");
    terminal.log(
      "🚧 Magic Eden commands are being refactored for modular version",
      "warning"
    );
    terminal.log("💡 This will support NFT trading and analytics", "info");
    terminal.log("🔜 Coming soon in next update!", "info");
  },

  // Send direct message (email implementation)
  sendDirectMessage: async function (terminal, recipient, message) {
    if (!OmegaWallet.isConnected()) {
      terminal.log("Please connect your wallet first using: connect", "error");
      return;
    }

    // Resolve ENS if needed
    let toAddress = recipient;
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      try {
        const ens = this.getENSContract();
        const resolved = await ens.resolve(recipient);
        if (
          resolved &&
          resolved !== "0x0000000000000000000000000000000000000000"
        ) {
          toAddress = resolved;
        } else {
          terminal.log("❌ ENS name not found: " + recipient, "error");
          return;
        }
      } catch (err) {
        terminal.log("❌ Failed to resolve ENS: " + err.message, "error");
        return;
      }
    }

    // Send DM on-chain
    try {
      const dmABI = [
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "string", name: "ensName", type: "string" },
            { internalType: "string", name: "message", type: "string" },
          ],
          name: "sendMessage",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const dmContract = new window.ethers.Contract(
        "0x26e31516e5e7790f8aaa35278735970a93fee213",
        dmABI,
        OmegaWallet.getSigner()
      );
      let tx;

      if (/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        // It's an address
        tx = await dmContract.sendMessage(recipient, "", message);
      } else {
        // It's an ENS name
        tx = await dmContract.sendMessage(
          "0x0000000000000000000000000000000000000000",
          recipient,
          message
        );
      }

      terminal.log(
        "⏳ Sending Email on-chain... (tx: " + tx.hash + ")",
        "info"
      );
      await tx.wait();
      terminal.log("✅ Email sent!", "success");
      terminal.logHtml(
        `🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`,
        "info"
      );
    } catch (err) {
      terminal.log("❌ Failed to send email: " + err.message, "error");
    }
  },

  // Show inbox implementation
  showInbox: async function (terminal, showAll = false) {
    try {
      const dmABI = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "message",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          name: "DirectMessage",
          type: "event",
        },
      ];

      const dmContract = new window.ethers.Contract(
        "0x26e31516e5e7790f8aaa35278735970a93fee213",
        dmABI,
        OmegaWallet.getProvider()
      );
      const myAddr = OmegaWallet.getCurrentAddress();
      const filter = dmContract.filters.DirectMessage(null, myAddr);

      terminal.log(
        "📬 Fetching inbox events from last 100,000 blocks...",
        "info"
      );

      const currentBlock = await OmegaWallet.getProvider().getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 100000);

      const events = await dmContract.queryFilter(filter, fromBlock, "latest");

      if (events.length === 0) {
        terminal.log("📭 No messages found in your inbox", "info");
        return;
      }

      terminal.log(`=== INBOX (${events.length} messages) ===`, "info");

      const messagesToShow = showAll ? events : events.slice(-10);

      for (const event of messagesToShow.reverse()) {
        const from = event.args.from;
        const message = event.args.message;
        const timestamp = event.args.timestamp.toNumber() * 1000;
        const date = new Date(timestamp).toLocaleString();

        terminal.logHtml(
          `<div style="border: 1px solid #333; padding: 10px; margin: 5px 0; border-radius: 5px;">`,
          "output"
        );
        terminal.logHtml(
          `<b>From:</b> <span class="copyable" onclick="navigator.clipboard.writeText('${from}')">${from}</span>`,
          "output"
        );
        terminal.logHtml(`<b>Date:</b> ${date}`, "output");
        terminal.logHtml(`<b>Message:</b> ${message}`, "output");
        terminal.logHtml(`</div>`, "output");
      }

      if (!showAll && events.length > 10) {
        terminal.log(
          `Showing last 10 messages. Use "inbox all" to show all ${events.length} messages.`,
          "info"
        );
      }
    } catch (error) {
      terminal.log(`❌ Failed to fetch inbox: ${error.message}`, "error");
    }
  },

  // ENS contract helper (Omega Network ENS)
  getENSContract: function (signerOrProvider = null) {
    const ensABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "NameRegistered",
        type: "event",
      },
      {
        inputs: [{ internalType: "string", name: "name", type: "string" }],
        name: "register",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transfer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "string", name: "", type: "string" }],
        name: "names",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "string", name: "name", type: "string" }],
        name: "resolve",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ];

    // Use Omega Network ENS contract address
    const provider =
      signerOrProvider || OmegaWallet.getSigner() || OmegaWallet.getProvider();
    return new window.ethers.Contract(
      "0xd9ce49734db4f033362d2fd51d52f24cabeb87fa",
      ensABI,
      provider
    );
  },

  // Create token functionality
  createToken: async function (terminal, args) {
    if (!OmegaWallet.isConnected()) {
      terminal.log(
        "❌ Please connect your wallet first using: connect",
        "error"
      );
      return;
    }

    try {
      terminal.log("🚀 Omega Token Creator", "info");
      terminal.log(
        "This will deploy a new ERC20 token on the Omega Network",
        "info"
      );
      terminal.log("", "");

      // Get token parameters interactively
      terminal.log('Enter token name (e.g., "My Awesome Token"):', "info");
      const name = await terminal.promptTerminalInput();
      if (!name || !name.trim()) {
        terminal.log("Token creation cancelled.", "warning");
        return;
      }

      terminal.log('Enter token symbol (e.g., "MAT"):', "info");
      const symbol = await terminal.promptTerminalInput();
      if (!symbol || !symbol.trim()) {
        terminal.log("Token creation cancelled.", "warning");
        return;
      }

      terminal.log("Enter decimals (default 18):", "info");
      const decimalsInput = await terminal.promptTerminalInput();
      let decimals = 18;
      if (decimalsInput && decimalsInput.trim()) {
        const parsed = parseInt(decimalsInput.trim());
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 36) {
          decimals = parsed;
        }
      }

      terminal.log("Enter initial supply (e.g., 1000000):", "info");
      const supplyInput = await terminal.promptTerminalInput();
      if (!supplyInput || !supplyInput.trim()) {
        terminal.log("Token creation cancelled.", "warning");
        return;
      }

      const initialSupply = window.ethers.BigNumber.from(supplyInput.trim());
      if (initialSupply.lte(0)) {
        terminal.log(
          "Invalid supply amount. Please enter a positive number.",
          "error"
        );
        return;
      }

      terminal.log("Mintable? (yes/no, default yes):", "info");
      const mintableInput = await terminal.promptTerminalInput();
      const mintable =
        !mintableInput || mintableInput.trim().toLowerCase() !== "no";

      terminal.log("Pausable? (yes/no, default yes):", "info");
      const pausableInput = await terminal.promptTerminalInput();
      const pausable =
        !pausableInput || pausableInput.trim().toLowerCase() !== "no";

      // Show summary
      terminal.log("", "");
      terminal.log("📋 Token Details:", "info");
      terminal.log(`Name: ${name.trim()}`, "output");
      terminal.log(`Symbol: ${symbol.trim()}`, "output");
      terminal.log(`Decimals: ${decimals}`, "output");
      terminal.log(
        `Initial Supply: ${initialSupply.toLocaleString()}`,
        "output"
      );
      terminal.log(`Mintable: ${mintable ? "Yes" : "No"}`, "output");
      terminal.log(`Pausable: ${pausable ? "Yes" : "No"}`, "output");
      terminal.log("", "");

      terminal.log("Deploy token? (yes/no):", "info");
      const confirm = await terminal.promptTerminalInput();
      if (!confirm || confirm.trim().toLowerCase() !== "yes") {
        terminal.log("Token creation cancelled.", "warning");
        return;
      }

      // Deploy token using factory contract
      const FACTORY_ADDRESS = "0x1f568dbb3a7b9ea05062b132094a848ef1443cfe";
      const FACTORY_ABI = [
        {
          inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
            { internalType: "uint8", name: "decimals_", type: "uint8" },
            {
              internalType: "uint256",
              name: "initialSupply_",
              type: "uint256",
            },
            { internalType: "bool", name: "mintable_", type: "bool" },
            { internalType: "bool", name: "pausable_", type: "bool" },
          ],
          name: "createToken",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const factory = new window.ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        OmegaWallet.getSigner()
      );

      terminal.log("🚀 Deploying token contract...", "info");
      const tx = await factory.createToken(
        name.trim(),
        symbol.trim(),
        decimals,
        initialSupply,
        mintable,
        pausable
      );

      terminal.log(
        `✅ Token deployment submitted! Hash: ${tx.hash}`,
        "success"
      );
      terminal.log("⏳ Waiting for confirmation...", "info");

      const receipt = await tx.wait();
      terminal.log(
        `✅ Token deployed successfully! Block: ${receipt.blockNumber}`,
        "success"
      );

      // Try to extract token address from events
      if (receipt.events) {
        const tokenCreatedEvent = receipt.events.find(
          (e) => e.event === "TokenCreated"
        );
        if (tokenCreatedEvent && tokenCreatedEvent.args) {
          const tokenAddress = tokenCreatedEvent.args.token;
          terminal.log(`🎉 Your new token address: ${tokenAddress}`, "success");
          terminal.logHtml(
            `<span class="copyable" onclick="navigator.clipboard.writeText('${tokenAddress}')">${tokenAddress}</span>`,
            "output"
          );
        }
      }

      terminal.logHtml(
        `🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`,
        "info"
      );
    } catch (error) {
      terminal.log(`❌ Token creation failed: ${error.message}`, "error");
    }
  },

  // Rome Network Commands
  rome: function (terminal, args) {
    if (!args || args.length < 2) {
      terminal.log("=== Rome Network Commands ===", "info");
      terminal.log("rome help - Show Rome commands", "output");
      terminal.log(
        "rome token create - Create a new token on Rome Network",
        "output"
      );
      return;
    }

    const subCommand = args[1].toLowerCase();

    switch (subCommand) {
      case "help":
        terminal.log("=== Rome Network Help ===", "info");
        terminal.log(
          "rome token create - Creates a new token on Rome Network",
          "output"
        );
        break;

      case "token":
        if (args[2] && args[2].toLowerCase() === "create") {
          terminal.log("🏛️ Rome Token Creation Coming Soon!", "info");
          terminal.log(
            "This will create a token on the Rome Network",
            "output"
          );
        } else {
          terminal.log("Usage: rome token create", "error");
        }
        break;

      default:
        terminal.log(
          'Unknown rome command. Type "rome help" for available commands.',
          "error"
        );
        break;
    }
  },

  // Create NFT Collection functionality
  createNFT: async function (terminal, args) {
    if (!OmegaWallet.isConnected()) {
      terminal.log(
        "❌ Please connect your wallet first using: connect",
        "error"
      );
      return;
    }

    try {
      terminal.log("🎨 Omega NFT Collection Creator", "info");
      terminal.log(
        "This will deploy a new ERC721 NFT collection on the Omega Network",
        "info"
      );
      terminal.log("", "");

      // Get NFT parameters interactively
      terminal.log(
        'Enter collection name (e.g., "Cool NFT Collection"):',
        "info"
      );
      const name = await terminal.promptTerminalInput();
      if (!name || !name.trim()) {
        terminal.log("NFT creation cancelled.", "warning");
        return;
      }

      terminal.log('Enter collection symbol (e.g., "COOL"):', "info");
      const symbol = await terminal.promptTerminalInput();
      if (!symbol || !symbol.trim()) {
        terminal.log("NFT creation cancelled.", "warning");
        return;
      }

      terminal.log(
        'Enter base URI for metadata (e.g., "ipfs://QmXxx/"):',
        "info"
      );
      const baseURI = await terminal.promptTerminalInput();
      if (!baseURI || !baseURI.trim()) {
        terminal.log("NFT creation cancelled.", "warning");
        return;
      }

      terminal.log("Enter max supply (0 for unlimited):", "info");
      const maxSupplyInput = await terminal.promptTerminalInput();
      let maxSupply = 0;
      if (maxSupplyInput && maxSupplyInput.trim()) {
        const parsed = parseInt(maxSupplyInput.trim());
        if (!isNaN(parsed) && parsed >= 0) {
          maxSupply = parsed;
        }
      }

      terminal.log("Initial mint amount (how many to mint now):", "info");
      const mintAmountInput = await terminal.promptTerminalInput();
      let mintAmount = 0;
      if (mintAmountInput && mintAmountInput.trim()) {
        const parsed = parseInt(mintAmountInput.trim());
        if (!isNaN(parsed) && parsed >= 0) {
          mintAmount = parsed;
        }
      }

      // Show summary
      terminal.log("", "");
      terminal.log("📋 NFT Collection Details:", "info");
      terminal.log(`Name: ${name.trim()}`, "output");
      terminal.log(`Symbol: ${symbol.trim()}`, "output");
      terminal.log(`Base URI: ${baseURI.trim()}`, "output");
      terminal.log(
        `Max Supply: ${maxSupply === 0 ? "Unlimited" : maxSupply}`,
        "output"
      );
      terminal.log(`Initial Mint: ${mintAmount} NFTs`, "output");
      terminal.log("", "");

      terminal.log("Deploy NFT collection? (yes/no):", "info");
      const confirm = await terminal.promptTerminalInput();
      if (!confirm || confirm.trim().toLowerCase() !== "yes") {
        terminal.log("NFT creation cancelled.", "warning");
        return;
      }

      // Deploy NFT using factory contract
      const NFT_FACTORY_ADDRESS = "0x9a8e3d3c7b1f2e4a5c6d8f9e0a1b2c3d4e5f6a7b"; // TODO: Replace with actual NFT factory
      const NFT_FACTORY_ABI = [
        {
          inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
            { internalType: "string", name: "baseURI_", type: "string" },
            { internalType: "uint256", name: "maxSupply_", type: "uint256" },
            { internalType: "uint256", name: "mintAmount_", type: "uint256" },
          ],
          name: "createNFTCollection",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const factory = new window.ethers.Contract(
        NFT_FACTORY_ADDRESS,
        NFT_FACTORY_ABI,
        OmegaWallet.getSigner()
      );

      terminal.log("🚀 Deploying NFT collection contract...", "info");
      const tx = await factory.createNFTCollection(
        name.trim(),
        symbol.trim(),
        baseURI.trim(),
        maxSupply,
        mintAmount
      );

      terminal.log(
        `✅ NFT collection deployment submitted! Hash: ${tx.hash}`,
        "success"
      );
      terminal.log("⏳ Waiting for confirmation...", "info");

      const receipt = await tx.wait();
      terminal.log(
        `✅ NFT collection deployed successfully! Block: ${receipt.blockNumber}`,
        "success"
      );

      // Try to extract NFT contract address from events
      if (receipt.events) {
        const nftCreatedEvent = receipt.events.find(
          (e) => e.event === "NFTCollectionCreated"
        );
        if (nftCreatedEvent && nftCreatedEvent.args) {
          const nftAddress = nftCreatedEvent.args.collection;
          terminal.log(
            `🎉 Your new NFT collection address: ${nftAddress}`,
            "success"
          );
          terminal.logHtml(
            `<span class="copyable" onclick="navigator.clipboard.writeText('${nftAddress}')">${nftAddress}</span>`,
            "output"
          );
          if (mintAmount > 0) {
            terminal.log(
              `🎨 Minted ${mintAmount} NFTs to your wallet!`,
              "success"
            );
          }
        }
      }

      terminal.logHtml(
        `🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`,
        "info"
      );
    } catch (error) {
      terminal.log(
        `❌ NFT collection creation failed: ${error.message}`,
        "error"
      );
      terminal.log(
        "💡 Note: NFT factory contract must be deployed first",
        "info"
      );
    }
  },
};
