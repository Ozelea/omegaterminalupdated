/**
 * useCommandExecution Hook
 * Custom React hook for command execution that integrates with command registry and React contexts
 *
 * This hook manages all command execution state and provides the bridge between
 * UI components and the command system. It integrates with ThemeProvider and
 * WalletProvider to provide full context to command handlers.
 *
 * @example
 * function TerminalContainer() {
 *   const { executeCommand, terminalLines, clearTerminal } = useCommandExecution();
 *
 *   return (
 *     <>
 *       <TerminalOutput lines={terminalLines} />
 *       <TerminalInput onSubmit={executeCommand} />
 *     </>
 *   );
 * }
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useWallet } from "@/hooks/useWallet";
import { useMultiChain } from "@/hooks/useMultiChain";
import { useSpotify } from "@/hooks/useSpotify";
import { useYouTube } from "@/hooks/useYouTube";
import { useNewsReader } from "@/hooks/useNewsReader";
import { commandRegistry } from "@/lib/commands";
import { config } from "@/lib/config";
import { Contract } from "ethers";
import type { TerminalLine, CommandContext, AIProvider } from "@/types";

/**
 * Return type for useCommandExecution hook
 */
export interface UseCommandExecutionReturn {
  /** Execute a command string */
  executeCommand: (command: string) => Promise<void>;
  /** Array of terminal output lines */
  terminalLines: TerminalLine[];
  /** Clear all terminal output */
  clearTerminal: () => void;
  /** Command history for navigation */
  commandHistory: string[];
  /** Current history index (-1 = not navigating) */
  historyIndex: number;
  /** Navigate command history (up/down arrows) */
  navigateHistory: (direction: "up" | "down") => string | null;
  /** Get autocomplete matches for partial command */
  autocomplete: (partial: string) => string[];
  /** Current AI provider */
  aiProvider: AIProvider;
  /** Update AI provider */
  setAiProvider: (provider: AIProvider) => void;
  /** Mining state for UI components */
  miningState: {
    isMining: boolean;
    mineCount: number;
    totalEarned: number;
  };
  /** Stress test state for UI components */
  stressTestState: {
    isStressTesting: boolean;
    stats: {
      walletsCreated: number;
      transactionsSent: number;
      successfulTxs: number;
      failedTxs: number;
      startTime: number;
    };
  };
}

/**
 * Custom hook for command execution
 *
 * Manages terminal state, command execution, history navigation, and autocomplete.
 * Integrates with ThemeProvider and WalletProvider for full command context.
 *
 * @returns Command execution interface
 */
export function useCommandExecution(): UseCommandExecutionReturn {
  // Get context from providers
  const theme = useTheme();
  const wallet = useWallet();
  const multichain = useMultiChain();
  const spotify = useSpotify();
  const youtube = useYouTube();
  const newsReader = useNewsReader();

  // Terminal output state (start with welcome messages)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: "welcome-1",
      type: "success",
      content: "Welcome to Omega Terminal v2.0.1",
      timestamp: Date.now(),
    },
    {
      id: "welcome-2",
      type: "info",
      content: "Type 'help' to see available commands",
      timestamp: Date.now(),
    },
    {
      id: "welcome-3",
      type: "info",
      content:
        "Type 'connect' to connect your wallet or 'create' for a session wallet",
      timestamp: Date.now(),
    },
  ]);

  // Command history state
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // AI provider state (persisted in localStorage)
  const [aiProvider, setAiProviderState] = useState<AIProvider>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("omega-ai-mode");
      if (saved === "near" || saved === "openai" || saved === "off") {
        return saved;
      }
    }
    return "off";
  });

  // Mining state management
  const [miningState, setMiningState] = useState({
    isMining: false,
    mineCount: 0,
    totalEarned: 0,
  });
  const miningInterval = useRef<NodeJS.Timeout | null>(null);
  const miningTimeoutRef = useRef<number | null>(null);
  const miningActiveRef = useRef<boolean>(false);

  // Stress test state management
  const [stressTestState, setStressTestState] = useState({
    isStressTesting: false,
    stats: {
      walletsCreated: 0,
      transactionsSent: 0,
      successfulTxs: 0,
      failedTxs: 0,
      startTime: 0,
    },
  });
  const stressTestInterval = useRef<NodeJS.Timeout | null>(null);
  const stressTestTimeoutRef = useRef<number | null>(null);
  const stressActiveRef = useRef<boolean>(false);
  const stressWallet = useRef<any>(null);

  // Command queue for sequential execution (FIFO)
  const commandQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef<boolean>(false);

  /**
   * Add a line to terminal output
   */
  const addLine = useCallback(
    (type: TerminalLine["type"], content: string): void => {
      const newLine: TerminalLine = {
        id: `line-${Date.now()}-${Math.random()}`,
        type,
        content,
        timestamp: Date.now(),
      };
      setTerminalLines((prev) => [...prev, newLine]);
    },
    []
  );

  /**
   * Log function for command context
   */
  const log = useCallback(
    (message: string, type: TerminalLine["type"]): void => {
      addLine(type, message);
    },
    [addLine]
  );

  /**
   * Log HTML content for command context
   */
  const logHtml = useCallback((htmlContent: string): void => {
    const newLine: TerminalLine = {
      id: `line-${Date.now()}-${Math.random()}`,
      type: "html",
      content: "", // Empty string for HTML lines
      timestamp: Date.now(),
      htmlContent: htmlContent,
    };
    setTerminalLines((prev) => [...prev, newLine]);
  }, []);

  /**
   * Clear terminal output
   */
  const clearTerminal = useCallback((): void => {
    setTerminalLines([]);
  }, []);

  /**
   * Start mining operation
   */
  const startMining = useCallback((): void => {
    miningActiveRef.current = true;
    setMiningState((prev) => ({
      ...prev,
      isMining: true,
    }));
  }, []);

  /**
   * Stop mining operation
   */
  const stopMining = useCallback((): void => {
    miningActiveRef.current = false;
    setMiningState({
      isMining: false,
      mineCount: 0,
      totalEarned: 0,
    });
    if (miningInterval.current) {
      clearInterval(miningInterval.current);
      miningInterval.current = null;
    }
    if (miningTimeoutRef.current !== null) {
      clearTimeout(miningTimeoutRef.current);
      miningTimeoutRef.current = null;
    }
  }, []);

  /**
   * Update mining count
   */
  const incrementMineCount = useCallback((): void => {
    setMiningState((prev) => ({
      ...prev,
      mineCount: prev.mineCount + 1,
    }));
  }, []);

  /**
   * Update total earned
   */
  const addToTotalEarned = useCallback((amount: number): void => {
    setMiningState((prev) => ({
      ...prev,
      totalEarned: prev.totalEarned + amount,
    }));
  }, []);

  /**
   * Start stress test operation
   */
  const startStressTest = useCallback((): void => {
    stressActiveRef.current = true;
    setStressTestState({
      isStressTesting: true,
      stats: {
        walletsCreated: 0,
        transactionsSent: 0,
        successfulTxs: 0,
        failedTxs: 0,
        startTime: Date.now(),
      },
    });
  }, []);

  /**
   * Stop stress test operation
   */
  const stopStressTest = useCallback((): void => {
    stressActiveRef.current = false;
    setStressTestState((prev) => ({
      ...prev,
      isStressTesting: false,
    }));
    if (stressTestInterval.current) {
      clearInterval(stressTestInterval.current);
      stressTestInterval.current = null;
    }
    if (stressTestTimeoutRef.current !== null) {
      clearTimeout(stressTestTimeoutRef.current);
      stressTestTimeoutRef.current = null;
    }
    stressWallet.current = null;
  }, []);

  /**
   * Update stress test stats
   */
  const updateStressTestStats = useCallback(
    (updates: Partial<typeof stressTestState.stats>): void => {
      setStressTestState((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          ...updates,
        },
      }));
    },
    []
  );

  /**
   * Atomic increment helpers for stress test stats
   */
  const incTransactionsSent = useCallback((): void => {
    setStressTestState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        transactionsSent: prev.stats.transactionsSent + 1,
      },
    }));
  }, []);

  const incSuccessfulTxs = useCallback((): void => {
    setStressTestState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        successfulTxs: prev.stats.successfulTxs + 1,
      },
    }));
  }, []);

  const incFailedTxs = useCallback((): void => {
    setStressTestState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        failedTxs: prev.stats.failedTxs + 1,
      },
    }));
  }, []);

  /**
   * Get contract instance helper
   */
  const getContract = useCallback(
    (address: string, abi: any[], signerOrProvider?: any): any => {
      try {
        return new Contract(address, abi, signerOrProvider);
      } catch (error) {
        console.error("Error creating contract instance:", error);
        throw error;
      }
    },
    []
  );

  /**
   * Process the command queue sequentially
   */
  const processQueue = useCallback(async (): Promise<void> => {
    // If already processing, return
    if (isProcessingQueue.current) {
      return;
    }

    // Start processing
    isProcessingQueue.current = true;

    try {
      // Process commands while queue is not empty
      while (commandQueue.current.length > 0) {
        // Dequeue the next command
        const trimmedCommand = commandQueue.current.shift()!;

        try {
          // Add command to terminal output
          addLine("command", trimmedCommand);

          // Add to command history
          setCommandHistory((prev) => [...prev, trimmedCommand]);
          setHistoryIndex(-1);

          // Create command context
          const context: CommandContext = {
            log,
            logHtml,
            clearTerminal,
            executeCommand, // Allow nested command execution (for AI)
            theme: {
              currentTheme: theme.currentTheme,
              setTheme: theme.setTheme,
              toggleTheme: theme.toggleTheme,
            },
            wallet: {
              state: wallet.state,
              connect: async () => {
                return await wallet.connectMetaMask();
              },
              disconnect: async () => {
                await wallet.disconnect();
              },
              createSessionWallet: async () => {
                try {
                  // Call the wallet provider method to create and connect
                  const success = await wallet.createSessionWallet();
                  if (!success) {
                    return null;
                  }

                  // Get the private key from session storage (where WalletProvider stores it)
                  const privateKey =
                    typeof window !== "undefined"
                      ? sessionStorage.getItem("omega-session-wallet-key")
                      : null;

                  if (!privateKey || !wallet.state.address) {
                    return null;
                  }

                  return {
                    address: wallet.state.address,
                    privateKey: privateKey,
                  };
                } catch (error) {
                  console.error("Error creating session wallet:", error);
                  return null;
                }
              },
              importSessionWallet: async (privateKey: string) => {
                try {
                  return await wallet.importSessionWallet(privateKey);
                } catch (error) {
                  console.error("Error importing session wallet:", error);
                  return false;
                }
              },
              getBalance: async () => {
                try {
                  return await wallet.getBalance();
                } catch (error) {
                  console.error("Error getting balance:", error);
                  return null;
                }
              },
              getSigner: async () => {
                try {
                  return await wallet.getSigner();
                } catch (error) {
                  console.error("Error getting signer:", error);
                  return null;
                }
              },
              getProvider: () => {
                try {
                  return wallet.getProvider();
                } catch (error) {
                  console.error("Error getting provider:", error);
                  return null;
                }
              },
              addOmegaNetwork: async () => {
                try {
                  return await wallet.addOmegaNetwork();
                } catch (error) {
                  console.error("Error adding Omega network:", error);
                  return false;
                }
              },
            },
            config,
            aiProvider,
            setAiProvider: (provider: AIProvider) => {
              setAiProviderState(provider);
              if (typeof window !== "undefined") {
                localStorage.setItem("omega-ai-mode", provider);
              }
            },
            miningState: {
              isMining: miningState.isMining,
              mineCount: miningState.mineCount,
              totalEarned: miningState.totalEarned,
              startMining,
              stopMining,
            },
            stressTestState: {
              isStressTesting: stressTestState.isStressTesting,
              stats: stressTestState.stats,
              startStressTest,
              stopStressTest,
            },
            getContract,
            multichain: {
              solana: {
                state: multichain.solanaState,
                connectPhantom: multichain.connectSolanaPhantom,
                generateWallet: multichain.generateSolanaWallet,
                getBalance: multichain.getSolanaBalance,
                sendTransaction: multichain.sendSolanaTransaction,
              },
              near: {
                state: multichain.nearState,
                connect: multichain.connectNear,
                disconnect: multichain.disconnectNear,
                getBalance: multichain.getNearBalance,
                signAndSendTransaction: multichain.signAndSendNearTransaction,
              },
              eclipse: {
                state: multichain.eclipseState,
                connectPhantom: multichain.connectEclipsePhantom,
                generateWallet: multichain.generateEclipseWallet,
                getBalance: multichain.getEclipseBalance,
                sendTransaction: multichain.sendEclipseTransaction,
              },
            },
            media: {
              spotify: {
                state: spotify.playerState,
                authState: spotify.authState,
                authenticate: spotify.authenticate,
                logout: spotify.logout,
                searchTracks: spotify.searchTracks,
                playTrack: spotify.playTrack,
                togglePlayPause: spotify.togglePlayPause,
                skipNext: spotify.skipNext,
                skipPrevious: spotify.skipPrevious,
                setVolume: spotify.setVolume,
                openPanel: spotify.openPanel,
                closePanel: spotify.closePanel,
              },
              youtube: {
                state: youtube.playerState,
                searchVideos: youtube.searchVideos,
                playVideo: youtube.playVideo,
                togglePlayPause: youtube.togglePlayPause,
                next: youtube.next,
                previous: youtube.previous,
                toggleMute: youtube.toggleMute,
                openPanel: youtube.openPanel,
                closePanel: youtube.closePanel,
              },
              news: {
                state: newsReader.readerState,
                loadNews: newsReader.loadNews,
                refreshNews: newsReader.refreshNews,
                setFilter: newsReader.setFilter,
                openPanel: newsReader.openPanel,
                closePanel: newsReader.closePanel,
              },
            },
          };

          // Execute command via registry
          await commandRegistry.execute(trimmedCommand, context);
        } catch (error) {
          // Log execution errors for this command
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          log(`Error: ${errorMessage}`, "error");
        }
      }
    } finally {
      // Release processing flag
      isProcessingQueue.current = false;
    }
  }, [
    addLine,
    log,
    logHtml,
    clearTerminal,
    theme,
    wallet,
    multichain,
    spotify,
    youtube,
    newsReader,
    aiProvider,
    miningState,
    stressTestState,
    startMining,
    stopMining,
    startStressTest,
    stopStressTest,
    getContract,
  ]);

  /**
   * Execute a command (adds to queue and starts processing if not already running)
   */
  const executeCommand = useCallback(
    async (command: string): Promise<void> => {
      // Trim command and check if empty
      const trimmedCommand = command.trim();
      if (!trimmedCommand) {
        return;
      }

      // Add to queue
      commandQueue.current.push(trimmedCommand);

      // Start processing if not already processing
      if (!isProcessingQueue.current) {
        await processQueue();
      }
    },
    [processQueue]
  );

  /**
   * Navigate command history
   */
  const navigateHistory = useCallback(
    (direction: "up" | "down"): string | null => {
      if (direction === "up") {
        // Navigate backwards in history
        if (commandHistory.length === 0) {
          return null;
        }

        let newIndex: number;
        if (historyIndex === -1) {
          // Start from end of history
          newIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
          // Move back one
          newIndex = historyIndex - 1;
        } else {
          // Already at start, stay there
          return commandHistory[historyIndex] ?? null;
        }

        setHistoryIndex(newIndex);
        return commandHistory[newIndex] ?? null;
      } else {
        // Navigate forwards in history
        if (historyIndex === -1) {
          // Not navigating, return null
          return null;
        }

        if (historyIndex < commandHistory.length - 1) {
          // Move forward one
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          return commandHistory[newIndex] ?? null;
        } else {
          // Reached end, reset to current
          setHistoryIndex(-1);
          return "";
        }
      }
    },
    [commandHistory, historyIndex]
  );

  /**
   * Get autocomplete matches for partial command
   */
  const autocomplete = useCallback((partial: string): string[] => {
    if (!partial) {
      // Return all unique command names (no aliases) if no partial
      return commandRegistry.getUniqueCommandNames();
    }

    // Filter unique command names that start with partial (case-insensitive)
    const matches = commandRegistry
      .getUniqueCommandNames()
      .filter((cmd) => cmd.toLowerCase().startsWith(partial.toLowerCase()));

    return matches;
  }, []);

  /**
   * Update AI provider in localStorage when it changes
   */
  const setAiProvider = useCallback((provider: AIProvider): void => {
    setAiProviderState(provider);
    if (typeof window !== "undefined") {
      localStorage.setItem("omega-ai-mode", provider);
    }
  }, []);

  /**
   * Cleanup on unmount - stop mining and stress test
   */
  useEffect(() => {
    return () => {
      if (miningInterval.current) {
        clearInterval(miningInterval.current);
      }
      if (miningTimeoutRef.current !== null) {
        clearTimeout(miningTimeoutRef.current);
      }
      if (stressTestInterval.current) {
        clearInterval(stressTestInterval.current);
      }
      if (stressTestTimeoutRef.current !== null) {
        clearTimeout(stressTestTimeoutRef.current);
      }
    };
  }, []);

  // Expose refs and state updaters for commands to use
  // Store in a ref that commands can access
  const miningIntervalRef = miningInterval;
  const stressTestIntervalRef = stressTestInterval;
  const stressWalletRef = stressWallet;

  // Make updater functions available through context
  useEffect(() => {
    // Attach updater functions to window for command access
    if (typeof window !== "undefined") {
      (window as any).__omegaMiningUpdaters = {
        incrementMineCount,
        addToTotalEarned,
        updateStressTestStats,
        incTransactionsSent,
        incSuccessfulTxs,
        incFailedTxs,
        miningIntervalRef,
        miningTimeoutRef,
        miningActiveRef,
        stressTestIntervalRef,
        stressTestTimeoutRef,
        stressActiveRef,
        stressWalletRef,
      };
    }
  }, [
    incrementMineCount,
    addToTotalEarned,
    updateStressTestStats,
    incTransactionsSent,
    incSuccessfulTxs,
    incFailedTxs,
  ]);

  return {
    executeCommand,
    terminalLines,
    clearTerminal,
    commandHistory,
    historyIndex,
    navigateHistory,
    autocomplete,
    aiProvider,
    setAiProvider,
    miningState,
    stressTestState,
  };
}

export default useCommandExecution;
