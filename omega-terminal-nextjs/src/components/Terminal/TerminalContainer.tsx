"use client";

/**
 * TerminalContainer Component
 * Main terminal wrapper managing state and coordinating child components
 *
 * Command execution is now handled by useCommandExecution hook and CommandRegistry.
 * This component focuses on UI state management and integrating the command system
 * with theme and wallet contexts.
 */

import { useState, useCallback, useEffect } from "react";
import { BootAnimation } from "./BootAnimation";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { MiningStatus, StressTestStats } from "@/components/Mining";
import { useTheme } from "@/hooks/useTheme";
import { useWallet } from "@/hooks/useWallet";
import { useCommandExecution } from "@/hooks/useCommandExecution";
import { registerAllCommands } from "@/lib/commands";
import { shortenAddress } from "@/lib/utils";
import { APP_VERSION } from "@/lib/constants";
import type { ConnectionStatus } from "@/types";
import styles from "./TerminalContainer.module.css";

export function TerminalContainer() {
  // State management
  const [showBoot, setShowBoot] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Get theme context
  const { currentTheme, toggleTheme } = useTheme();

  // Get wallet context
  const { state: walletState } = useWallet();

  // Get command execution context
  const {
    executeCommand,
    terminalLines,
    clearTerminal,
    navigateHistory,
    autocomplete,
    aiProvider,
    setAiProvider,
    miningState,
    stressTestState,
  } = useCommandExecution();

  // Register all commands on mount
  useEffect(() => {
    registerAllCommands();
  }, []);

  // Update connection status based on wallet state
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("disconnected");
    }
  }, [walletState.isConnected, walletState.address]);

  // Boot animation complete handler
  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
  }, []);

  // Theme cycle handler
  const handleThemeCycle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Palette cycle handler (placeholder)
  const handlePaletteCycle = useCallback(() => {
    console.log("Palette cycle not implemented yet");
    executeCommand(""); // Could add a palette cycle command in future
  }, [executeCommand]);

  // Light/dark toggle handler (placeholder)
  const handleLightDarkToggle = useCallback(() => {
    console.log("Light/dark toggle not implemented yet");
    executeCommand(""); // Could add a light/dark toggle command in future
  }, [executeCommand]);

  // Dashboard toggle handler (placeholder)
  const handleDashboardToggle = useCallback(() => {
    console.log("Dashboard toggle not implemented yet");
    executeCommand("view toggle");
  }, [executeCommand]);

  // AI provider change handler
  const handleAiProviderChange = useCallback(
    (provider: string) => {
      setAiProvider(provider as typeof aiProvider);
    },
    [setAiProvider]
  );

  // Render boot animation
  if (showBoot) {
    return <BootAnimation onComplete={handleBootComplete} />;
  }

  // Render main terminal interface
  return (
    <div className={styles.container}>
      {/* Terminal Header */}
      <TerminalHeader
        onThemeCycle={handleThemeCycle}
        onPaletteCycle={handlePaletteCycle}
        onLightDarkToggle={handleLightDarkToggle}
        onDashboardToggle={handleDashboardToggle}
        aiProvider={aiProvider}
        onAiProviderChange={handleAiProviderChange}
        connectionStatus={connectionStatus}
        walletAddress={
          walletState.isConnected && walletState.address
            ? shortenAddress(walletState.address)
            : undefined
        }
      />

      {/* Mining Status Widget - Shows when mining is active */}
      {miningState.isMining && (
        <MiningStatus
          isMining={miningState.isMining}
          mineCount={miningState.mineCount}
          totalEarned={miningState.totalEarned}
          onStop={() => executeCommand("stop")}
        />
      )}

      {/* Stress Test Stats Widget - Shows when stress test is running */}
      {stressTestState.isStressTesting && (
        <StressTestStats
          isActive={stressTestState.isStressTesting}
          stats={stressTestState.stats}
          onStop={() => executeCommand("stopstress")}
        />
      )}

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <div className={`${styles.tab} ${styles.tabActive}`}>Terminal 1</div>
        <button className={styles.addTabButton} title="Add new terminal tab">
          +
        </button>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <div>⏳ Faucet cooldown: 24 hours between requests</div>
        <div>📱 Mobile users: Use landscape mode for best experience</div>
      </div>

      {/* Terminal Output */}
      <TerminalOutput lines={terminalLines} isScrolling={true} />

      {/* Terminal Input */}
      <TerminalInput
        onSubmit={executeCommand}
        onHistoryUp={() => navigateHistory("up")}
        onHistoryDown={() => navigateHistory("down")}
        onAutocomplete={autocomplete}
      />
    </div>
  );
}
