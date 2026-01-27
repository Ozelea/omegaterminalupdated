// Magic Eden NFT Plugin for Omega Terminal
// API Integration for Magic Eden Marketplace
(function () {
  console.log("🔮 Magic Eden Plugin Loading...");

  // Magic Eden API Configuration
  const MAGICEDEN_CONFIG = {
    RELAYER_URL: "https://terminal-v1-5-9.onrender.com",
    ENDPOINTS: {
      ACTIVITIES: "/magiceden/activities",
      STATS: "/magiceden/stats",
      LISTINGS: "/magiceden/listings",
    },
    DEFAULT_LIMIT: 10,
  };

  // Cache for collection data
  const meCache = {
    activities: {},
    stats: {},
    lastFetch: {},
  };

  // Magic Eden API Helper Functions
  window.MagicEdenAPI = {
    // Fetch collection activities
    fetchActivities: async function (collectionSymbol, limit = 10) {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}${MAGICEDEN_CONFIG.ENDPOINTS.ACTIVITIES}?symbol=${collectionSymbol}&limit=${limit}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        meCache.activities[collectionSymbol] = data;
        meCache.lastFetch[collectionSymbol] = Date.now();
        return data;
      } catch (error) {
        console.error("Magic Eden API Error:", error);
        throw error;
      }
    },

    // Fetch collection stats
    fetchStats: async function (collectionSymbol) {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}${MAGICEDEN_CONFIG.ENDPOINTS.STATS}?symbol=${collectionSymbol}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        meCache.stats[collectionSymbol] = data;
        return data;
      } catch (error) {
        console.error("Magic Eden Stats API Error:", error);
        throw error;
      }
    },

    // Fetch collection listings
    fetchListings: async function (collectionSymbol, limit = 20) {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}${MAGICEDEN_CONFIG.ENDPOINTS.LISTINGS}?symbol=${collectionSymbol}&limit=${limit}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(
          `Magic Eden Listings Response (requested ${limit}, got ${data.length}):`,
          data
        );
        return data;
      } catch (error) {
        console.error("Magic Eden Listings API Error:", error);
        throw error;
      }
    },

    // Fetch holder stats
    fetchHolderStats: async function (collectionSymbol) {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}/magiceden/holder_stats?symbol=${collectionSymbol}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Magic Eden Holder Stats API Error:", error);
        throw error;
      }
    },

    // Fetch collection attributes
    fetchAttributes: async function (collectionSymbol) {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}/magiceden/attributes?symbol=${collectionSymbol}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Magic Eden Attributes API Error:", error);
        throw error;
      }
    },

    // Fetch trending/popular collections
    fetchTrending: async function (timeRange = "1d") {
      const url = `${MAGICEDEN_CONFIG.RELAYER_URL}/magiceden/trending?timeRange=${timeRange}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Magic Eden Trending API Error:", error);
        throw error;
      }
    },

    // Helper: Format SOL price
    formatSOL: function (price) {
      if (!price) return "0 SOL";
      // Handle both direct price values and priceInfo objects
      if (typeof price === "object" && price.solPrice) {
        const sol =
          parseFloat(price.solPrice.rawAmount) /
          Math.pow(10, price.solPrice.decimals);
        return `${sol.toFixed(4)} SOL`;
      }
      // Handle direct numeric price (already in SOL)
      return `${parseFloat(price).toFixed(4)} SOL`;
    },

    // Helper: Format timestamp
    formatTime: function (timestamp) {
      const date = new Date(timestamp * 1000);
      const now = Date.now();
      const diff = now - date.getTime();

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    },

    // Helper: Get activity type emoji
    getActivityEmoji: function (type) {
      const emojiMap = {
        list: "📋",
        delist: "❌",
        buyNow: "💰",
        bid: "🎯",
        acceptBid: "✅",
        cancelBid: "⛔",
      };
      return emojiMap[type] || "🔄";
    },
  };

  // Wait for terminal to be ready and integrate Magic Eden commands
  function waitForTerminalME() {
    if (
      window.terminal &&
      window.terminal.executeCommand &&
      window.OmegaCommands &&
      window.OmegaCommands.MagicEden
    ) {
      console.log(
        "🔮 Magic Eden Plugin: Terminal ready, integrating commands..."
      );
      initializeMagicEdenCommands();
    } else {
      console.log("⏳ Magic Eden Plugin: Waiting for terminal...", {
        terminal: !!window.terminal,
        executeCommand: !!(window.terminal && window.terminal.executeCommand),
        OmegaCommands: !!window.OmegaCommands,
        MagicEden: !!(window.OmegaCommands && window.OmegaCommands.MagicEden),
      });
      setTimeout(waitForTerminalME, 100);
    }
  }

  function initializeMagicEdenCommands() {
    // Store original command handler
    const originalExecuteCommand = window.terminal.executeCommand;

    // Enhanced command handler that includes Magic Eden commands
    window.terminal.executeCommand = async function (command) {
      const args = command.trim().split(/\s+/);
      const cmd = args[0].toLowerCase();

      // Handle Magic Eden commands and aliases - OVERRIDE any built-in handlers
      if (cmd === "magiceden" || cmd === "me") {
        console.log("🔮 Magic Eden: Command intercepted:", command);
        if (window.OmegaCommands && window.OmegaCommands.MagicEden) {
          try {
            await window.OmegaCommands.MagicEden.magiceden(this, args.slice(1));
          } catch (error) {
            console.error("Magic Eden Command Error:", error);
            this.log(
              "❌ Error executing Magic Eden command: " + error.message,
              "error"
            );
          }
        } else {
          this.log("❌ Magic Eden commands not loaded", "error");
        }
        return;
      }

      // Handle Blues commands
      if (cmd === "blues") {
        console.log("🎵 Blues: Command intercepted:", command);
        if (window.OmegaCommands && window.OmegaCommands.Blues) {
          try {
            await window.OmegaCommands.Blues.blues(this, args.slice(1));
          } catch (error) {
            console.error("Blues Command Error:", error);
            this.log(
              "❌ Error executing Blues command: " + error.message,
              "error"
            );
          }
        } else {
          this.log("❌ Blues commands not loaded", "error");
        }
        return;
      }

      // For all other commands, use original handler
      if (originalExecuteCommand) {
        return originalExecuteCommand.call(this, command);
      }
    };

    console.log("✅ Magic Eden Plugin: Commands integrated successfully!");
    console.log(
      '✅ Magic Eden Plugin: Override active for "magiceden" and "me" commands'
    );
  }

  // Start waiting for terminal
  console.log("🚀 Magic Eden Plugin: Initializing...");
  waitForTerminalME();
})();
