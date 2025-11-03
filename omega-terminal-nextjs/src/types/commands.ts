/**
 * Command System Type Definitions
 * Type definitions for the terminal command execution system
 */

import type {
  Theme,
  AIProvider,
  TerminalLine,
  WalletState,
  OmegaConfig,
} from "@/types";
import type {
  SolanaWalletState,
  NEARWalletState,
  EclipseWalletState,
} from "@/types/multichain";
import type {
  SpotifyPlayerState,
  SpotifyAuthState,
  YouTubePlayerState,
  NewsReaderState,
  NewsFilter,
} from "@/types/media";

/**
 * Command context provided to all command handlers
 * Contains methods and state needed for command execution
 */
export interface CommandContext {
  /**
   * Log a message to the terminal output
   * @param message - The message to log
   * @param type - The type of message (determines styling)
   */
  log: (message: string, type: TerminalLine["type"]) => void;

  /**
   * Log HTML content to terminal output
   * @param htmlContent - The HTML content to log (should be sanitized)
   * @description Useful for interactive elements like copy buttons, formatted wallet info, etc.
   * Note: HTML content should be sanitized to prevent XSS attacks.
   * HTML lines are always rendered with type 'html' regardless of context.
   */
  logHtml: (htmlContent: string) => void;

  /**
   * Clear all terminal output
   */
  clearTerminal: () => void;

  /**
   * Execute another command (for command chaining or AI execution)
   * @param command - The command string to execute
   */
  executeCommand: (command: string) => Promise<void>;

  /**
   * Theme management context
   */
  theme: {
    /** Current active theme */
    currentTheme: Theme;
    /** Set a specific theme */
    setTheme: (theme: Theme) => void;
    /** Toggle to next theme in list */
    toggleTheme: () => void;
  };

  /**
   * Wallet management context
   */
  wallet: {
    /** Current wallet state */
    state: WalletState;
    /** Connect to MetaMask wallet */
    connect: () => Promise<boolean>;
    /** Disconnect current wallet */
    disconnect: () => Promise<void>;
    /**
     * Create a new session wallet
     * @returns Object with address and privateKey, or null on error
     */
    createSessionWallet: () => Promise<{
      address: string;
      privateKey: string;
    } | null>;
    /**
     * Import a session wallet from private key
     * @param privateKey - The private key to import
     * @returns true if successful, false otherwise
     */
    importSessionWallet: (privateKey: string) => Promise<boolean>;
    /**
     * Get current wallet balance
     * @returns Balance as string (e.g. "1.234 OMEGA") or null if not connected
     */
    getBalance: () => Promise<string | null>;
    /**
     * Get wallet signer for transactions
     * @returns Ethers signer object or null if not available
     */
    getSigner: () => Promise<any | null>;
    /**
     * Get wallet provider
     * @returns Ethers provider object or null if not available
     */
    getProvider: () => any | null;
    /**
     * Add Omega Network to MetaMask
     * @returns true if successful, false otherwise
     */
    addOmegaNetwork: () => Promise<boolean>;
  };

  /**
   * Application configuration
   */
  config: OmegaConfig;

  /**
   * Current AI provider setting
   */
  aiProvider: AIProvider;

  /**
   * Update AI provider setting
   * @param provider - The AI provider to use
   */
  setAiProvider: (provider: AIProvider) => void;

  /**
   * Mining state management
   * Enables commands to manage long-running mining operations
   */
  miningState?: {
    /** Whether mining is currently active */
    isMining: boolean;
    /** Number of blocks mined in current session */
    mineCount: number;
    /** Total OMEGA earned in current session */
    totalEarned: number;
    /** Start mining operation */
    startMining: () => void;
    /** Stop mining operation */
    stopMining: () => void;
  };

  /**
   * Stress test state management
   * Enables commands to manage network stress testing operations
   */
  stressTestState?: {
    /** Whether stress test is currently running */
    isStressTesting: boolean;
    /** Stress test statistics */
    stats: {
      /** Number of wallets created for testing */
      walletsCreated: number;
      /** Total number of transactions sent */
      transactionsSent: number;
      /** Number of successful transactions */
      successfulTxs: number;
      /** Number of failed transactions */
      failedTxs: number;
      /** Test start timestamp */
      startTime: number;
    };
    /** Start stress test */
    startStressTest: () => void;
    /** Stop stress test */
    stopStressTest: () => void;
  };

  /**
   * Create contract instance for smart contract interactions
   * @param address - Contract address
   * @param abi - Contract ABI
   * @param signerOrProvider - Optional ethers signer or provider
   * @returns Contract instance
   */
  getContract?: (address: string, abi: any[], signerOrProvider?: any) => any;

  /**
   * Multi-chain wallet management context
   * Enables commands to manage Solana, NEAR, and Eclipse wallet operations
   */
  multichain?: {
    /** Solana blockchain operations */
    solana: {
      /** Current Solana wallet state */
      state: SolanaWalletState;
      /** Connect to Phantom wallet */
      connectPhantom: () => Promise<boolean>;
      /** Generate a new browser wallet */
      generateWallet: () => Promise<{
        publicKey: string;
        secretKey: string;
      } | null>;
      /** Get balance for a public key */
      getBalance: (publicKey: string) => Promise<number | null>;
      /** Send a transaction */
      sendTransaction: (transaction: any) => Promise<string | null>;
    };
    /** NEAR Protocol operations */
    near: {
      /** Current NEAR wallet state */
      state: NEARWalletState;
      /** Connect to NEAR wallet */
      connect: () => Promise<boolean>;
      /** Disconnect NEAR wallet */
      disconnect: () => Promise<void>;
      /** Get balance for an account ID */
      getBalance: (accountId: string) => Promise<string | null>;
      /** Sign and send a transaction */
      signAndSendTransaction: (transaction: any) => Promise<any>;
    };
    /** Eclipse network operations */
    eclipse: {
      /** Current Eclipse wallet state */
      state: EclipseWalletState;
      /** Connect to Phantom wallet for Eclipse */
      connectPhantom: () => Promise<boolean>;
      /** Generate a new browser wallet */
      generateWallet: () => Promise<{
        publicKey: string;
        secretKey: string;
      } | null>;
      /** Get balance for a public key */
      getBalance: (publicKey: string) => Promise<number | null>;
      /** Send a transaction */
      sendTransaction: (transaction: any) => Promise<string | null>;
    };
  };

  /**
   * Media player management context
   * Enables commands to control Spotify, YouTube, and News reader panels
   */
  media?: {
    /** Spotify music player operations */
    spotify: {
      /** Current player state */
      state: SpotifyPlayerState;
      /** Authentication state */
      authState: SpotifyAuthState;
      /** Initiate OAuth authentication */
      authenticate: () => Promise<void>;
      /** Disconnect and clear session */
      logout: () => void;
      /** Search Spotify catalog for tracks */
      searchTracks: (query: string) => Promise<void>;
      /** Play a specific track by URI */
      playTrack: (uri: string) => Promise<void>;
      /** Toggle play/pause */
      togglePlayPause: () => Promise<void>;
      /** Skip to next track */
      skipNext: () => Promise<void>;
      /** Skip to previous track */
      skipPrevious: () => Promise<void>;
      /** Set volume (0-100) */
      setVolume: (volume: number) => Promise<void>;
      /** Show Spotify panel */
      openPanel: () => void;
      /** Hide Spotify panel */
      closePanel: () => void;
    };
    /** YouTube video player operations */
    youtube: {
      /** Current player state */
      state: YouTubePlayerState;
      /** Search YouTube for videos */
      searchVideos: (query: string) => Promise<void>;
      /** Play a specific video by ID */
      playVideo: (videoId: string, index: number) => void;
      /** Toggle play/pause */
      togglePlayPause: () => void;
      /** Play next video in playlist */
      next: () => void;
      /** Play previous video in playlist */
      previous: () => void;
      /** Toggle mute */
      toggleMute: () => void;
      /** Show YouTube panel */
      openPanel: () => void;
      /** Hide YouTube panel */
      closePanel: () => void;
    };
    /** Crypto news reader operations */
    news: {
      /** Current news reader state */
      state: NewsReaderState;
      /** Load news with specific filter */
      loadNews: (filter: NewsFilter, limit?: number) => Promise<void>;
      /** Refresh current news */
      refreshNews: (silent?: boolean) => Promise<void>;
      /** Change news category filter */
      setFilter: (filter: NewsFilter) => void;
      /** Show news reader panel */
      openPanel: () => Promise<void>;
      /** Hide news reader panel */
      closePanel: () => void;
    };
  };
}

/**
 * Command handler function type
 * Receives context and arguments, executes command logic
 */
export type CommandHandler = (
  context: CommandContext,
  args: string[]
) => Promise<void> | void;

/**
 * Command metadata for registration and help display
 */
export interface CommandMetadata {
  /** Command name (primary identifier) */
  name: string;
  /** Alternative names for the command (optional) */
  aliases?: string[];
  /** Human-readable description */
  description: string;
  /** Usage example (optional) */
  usage?: string;
  /** Command category for grouping (optional) */
  category?: string;
}

/**
 * Complete command definition
 * Combines metadata with execution handler
 */
export interface Command extends CommandMetadata {
  /** Command execution handler */
  handler: CommandHandler;
}

/**
 * Command registry interface
 * Manages command registration and execution routing
 */
export interface CommandRegistry {
  /**
   * Register a new command
   * @param command - The command to register
   */
  register: (command: Command) => void;

  /**
   * Unregister a command by name
   * @param name - The command name to remove
   */
  unregister: (name: string) => void;

  /**
   * Execute a command string with context
   * @param commandString - The full command string to execute
   * @param context - The command execution context
   */
  execute: (commandString: string, context: CommandContext) => Promise<void>;

  /**
   * Get a registered command by name
   * @param name - The command name to look up
   * @returns The command if found, undefined otherwise
   */
  getCommand: (name: string) => Command | undefined;

  /**
   * Get all registered commands
   * @returns Array of all commands (excluding aliases)
   */
  getAllCommands: () => Command[];

  /**
   * Get commands filtered by category
   * @param category - The category to filter by
   * @returns Array of commands in the category
   */
  getCommandsByCategory: (category: string) => Command[];

  /**
   * Get all command names including aliases
   * Used for autocomplete
   * @returns Array of all command names and aliases
   */
  getCommandNames: () => string[];

  /**
   * Get unique command names (canonical names only, no aliases)
   * Used for autocomplete to avoid showing duplicates
   * @returns Array of unique canonical command names
   */
  getUniqueCommandNames: () => string[];
}
