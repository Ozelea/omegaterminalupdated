"use client";

/**
 * Wallet Provider Component
 *
 * Provides global wallet state management using React Context.
 * Supports three wallet types:
 * - MetaMask: Browser extension wallet
 * - Session: Ephemeral wallet created in-session
 * - Imported: Wallet imported via private key
 *
 * Security Considerations:
 * - Session wallets are ephemeral and should not be used for large amounts
 * - Private keys should never be shared or committed to version control
 * - MetaMask is recommended for production use
 *
 * Usage:
 * ```tsx
 * import { WalletProvider } from '@/providers/WalletProvider';
 *
 * function App() {
 *   return (
 *     <WalletProvider>
 *       <YourApp />
 *     </WalletProvider>
 *   );
 * }
 * ```
 */

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { BrowserProvider, JsonRpcProvider, Wallet } from "ethers";
import {
  WalletState,
  WalletContextValue,
  WalletProviderProps,
} from "@/types/wallet";
import {
  connectMetaMask as connectMetaMaskModule,
  createSessionWallet as createSessionWalletModule,
  importSessionWallet as importSessionWalletModule,
  getBalance as getBalanceModule,
  addOmegaNetwork as addOmegaNetworkModule,
  getEthereumProvider,
} from "@/lib/wallet";

// Create wallet context
export const WalletContext = createContext<WalletContextValue | undefined>(
  undefined
);

/**
 * WalletProvider component
 *
 * Manages wallet state and provides wallet methods to all child components.
 */
export function WalletProvider({ children }: WalletProviderProps) {
  // Wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    type: null,
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    chainId: null,
    error: null,
  });

  // Provider and signer state
  const [provider, setProvider] = useState<
    BrowserProvider | JsonRpcProvider | null
  >(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [sessionWallet, setSessionWallet] = useState<Wallet | null>(null);

  // Refs for stable event listener wrappers (Comment 1)
  const accountsChangedHandlerRef = useRef<(accounts: string[]) => void>(
    () => {}
  );
  const chainChangedHandlerRef = useRef<(chainIdHex: string) => void>(() => {});

  /**
   * Connect to MetaMask wallet
   */
  const handleConnectMetaMask = useCallback(async (): Promise<boolean> => {
    try {
      // Set connecting state
      setWalletState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      // Call connection module
      const result = await connectMetaMaskModule();

      if (!result.success) {
        setWalletState((prev) => ({
          ...prev,
          isConnecting: false,
          error: result.error || "Failed to connect to MetaMask",
        }));
        return false;
      }

      // Store provider
      if (result.provider) {
        setProvider(result.provider);

        // Get signer (async in v6)
        const newSigner = await result.provider.getSigner();
        setSigner(newSigner);

        // Get network info
        const network = await result.provider.getNetwork();

        // Update state
        setWalletState({
          type: "metamask",
          address: result.address || null,
          isConnected: true,
          isConnecting: false,
          balance: null,
          chainId: Number(network.chainId),
          error: null,
        });

        // Fetch balance (Comment 2: pass provider and address directly to avoid race condition)
        if (result.address) {
          handleGetBalance(result.provider, result.address);
        }

        // Set up event listeners (Comment 1: using stable wrapper functions)
        const ethereumProvider = getEthereumProvider();
        if (ethereumProvider) {
          // Account changed
          ethereumProvider.on(
            "accountsChanged",
            accountsChangedHandlerRef.current
          );
          // Chain changed
          ethereumProvider.on("chainChanged", chainChangedHandlerRef.current);
        }

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("walletType", "metamask");
        }

        return true;
      }

      return false;
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect to MetaMask",
      }));
      return false;
    }
  }, []);

  /**
   * Create new session wallet
   */
  const handleCreateSessionWallet = useCallback(async (): Promise<boolean> => {
    try {
      // Set connecting state
      setWalletState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      // Call session wallet module
      const result = await createSessionWalletModule();

      // Store provider, signer, and wallet
      setProvider(result.provider);
      setSigner(result.wallet);
      setSessionWallet(result.wallet);

      // Persist private key in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("omega-session-wallet-key", result.privateKey);
      }

      // Update state
      setWalletState({
        type: "session",
        address: result.address,
        isConnected: true,
        isConnecting: false,
        balance: null,
        chainId: null,
        error: null,
      });

      // Fetch balance (Comment 2: pass provider and address directly to avoid race condition)
      handleGetBalance(result.provider, result.address);

      return true;
    } catch (error: any) {
      console.error("Session wallet creation error:", error);
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to create session wallet",
      }));
      return false;
    }
  }, []);

  /**
   * Import wallet using private key
   */
  const handleImportSessionWallet = useCallback(
    async (privateKey: string): Promise<boolean> => {
      try {
        // Set connecting state
        setWalletState((prev) => ({
          ...prev,
          isConnecting: true,
          error: null,
        }));

        // Call import wallet module
        const result = await importSessionWalletModule(privateKey);

        if (result.error) {
          setWalletState((prev) => ({
            ...prev,
            isConnecting: false,
            error: result.error || "Failed to import wallet",
          }));
          return false;
        }

        // Store provider, signer, and wallet
        setProvider(result.provider);
        setSigner(result.wallet);
        setSessionWallet(result.wallet);

        // Persist private key in sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("omega-session-wallet-key", privateKey);
        }

        // Update state
        setWalletState({
          type: "imported",
          address: result.address,
          isConnected: true,
          isConnecting: false,
          balance: null,
          chainId: null,
          error: null,
        });

        // Fetch balance (Comment 2: pass provider and address directly to avoid race condition)
        handleGetBalance(result.provider, result.address);

        return true;
      } catch (error: any) {
        console.error("Wallet import error:", error);
        setWalletState((prev) => ({
          ...prev,
          isConnecting: false,
          error: error.message || "Failed to import wallet",
        }));
        return false;
      }
    },
    []
  );

  /**
   * Disconnect wallet
   */
  const handleDisconnect = useCallback(async (): Promise<void> => {
    try {
      // Remove event listeners if MetaMask (Comment 1: using stable wrapper functions)
      if (walletState.type === "metamask") {
        const ethereumProvider = getEthereumProvider();
        if (ethereumProvider) {
          ethereumProvider.removeListener(
            "accountsChanged",
            accountsChangedHandlerRef.current
          );
          ethereumProvider.removeListener(
            "chainChanged",
            chainChangedHandlerRef.current
          );
        }
      }

      // Clear state
      setProvider(null);
      setSigner(null);
      setSessionWallet(null);
      setWalletState({
        type: null,
        address: null,
        isConnected: false,
        isConnecting: false,
        balance: null,
        chainId: null,
        error: null,
      });

      // Clear localStorage and sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("walletType");
        sessionStorage.removeItem("omega-session-wallet-key");
      }
    } catch (error: any) {
      console.error("Disconnect error:", error);
    }
  }, [walletState.type]);

  /**
   * Get wallet balance (Comment 2: accepts optional provider and address to avoid race conditions)
   */
  const handleGetBalance = useCallback(
    async (
      overrideProvider?: BrowserProvider | JsonRpcProvider,
      overrideAddress?: string
    ): Promise<string | null> => {
      try {
        const targetProvider = overrideProvider || provider;
        const targetAddress = overrideAddress || walletState.address;

        if (!targetProvider || !targetAddress) {
          return null;
        }

        // Fetch balance
        const balance = await getBalanceModule(targetProvider, targetAddress);

        // Update state
        setWalletState((prev) => ({
          ...prev,
          balance,
        }));

        return balance;
      } catch (error: any) {
        console.error("Failed to get balance:", error);
        return null;
      }
    },
    [provider, walletState.address]
  );

  /**
   * Add Omega Network to MetaMask
   */
  const handleAddOmegaNetwork = useCallback(async (): Promise<boolean> => {
    try {
      const ethereumProvider = getEthereumProvider();
      if (!ethereumProvider) {
        return false;
      }

      const result = await addOmegaNetworkModule(ethereumProvider);
      return result.success;
    } catch (error: any) {
      console.error("Failed to add Omega Network:", error);
      return false;
    }
  }, []);

  /**
   * Get signer
   */
  const handleGetSigner = useCallback(async (): Promise<any | null> => {
    if (signer) {
      return signer;
    }

    if (provider && provider instanceof BrowserProvider) {
      const newSigner = await provider.getSigner();
      setSigner(newSigner);
      return newSigner;
    }

    return null;
  }, [provider, signer]);

  /**
   * Get provider
   */
  const handleGetProvider = useCallback((): any | null => {
    return provider;
  }, [provider]);

  /**
   * Handle accounts changed event (MetaMask)
   */
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        handleDisconnect();
      } else {
        // Account changed
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0],
        }));
        // Refresh balance
        handleGetBalance();
      }
    },
    [handleDisconnect, handleGetBalance]
  );

  /**
   * Handle chain changed event (MetaMask)
   */
  const handleChainChanged = useCallback((chainIdHex: string) => {
    // Reload page on chain change (recommended by MetaMask)
    window.location.reload();
  }, []);

  /**
   * Update ref functions to point to latest handlers (Comment 1)
   */
  useEffect(() => {
    accountsChangedHandlerRef.current = handleAccountsChanged;
    chainChangedHandlerRef.current = handleChainChanged;
  }, [handleAccountsChanged, handleChainChanged]);

  /**
   * Attempt to reconnect on mount if previously connected
   */
  useEffect(() => {
    const reconnect = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const savedWalletType = localStorage.getItem("walletType");

      if (savedWalletType === "metamask") {
        // Try to reconnect to MetaMask
        const ethereumProvider = getEthereumProvider();
        if (ethereumProvider) {
          try {
            // Check if already connected
            const accounts = await ethereumProvider.request({
              method: "eth_accounts",
            });
            if (accounts && accounts.length > 0) {
              // Reconnect
              await handleConnectMetaMask();
            }
          } catch (error) {
            console.error("Auto-reconnect failed:", error);
          }
        }
      }
    };

    reconnect();
  }, [handleConnectMetaMask]);

  // Context value
  const value: WalletContextValue = {
    state: walletState,
    connectMetaMask: handleConnectMetaMask,
    createSessionWallet: handleCreateSessionWallet,
    importSessionWallet: handleImportSessionWallet,
    disconnect: handleDisconnect,
    getBalance: handleGetBalance,
    addOmegaNetwork: handleAddOmegaNetwork,
    getSigner: handleGetSigner,
    getProvider: handleGetProvider,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
