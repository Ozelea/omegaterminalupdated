// Mining Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Mining = {
    // Mine command (uses relayer to avoid MetaMask confirmations)
    mine: async function(terminal) {
        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        // Check if already mining
        if (terminal.isMining) {
            terminal.log('⛏️  Mining is already running. Use "stop" to stop it.', 'warning');
            return;
        }

        try {
            terminal.log('⛏️  Starting automated mining session...', 'info');
            terminal.log('💡 Mining will use relayer to avoid constant MetaMask confirmations', 'info');
            
            terminal.isMining = true;
            terminal.mineCount = terminal.mineCount || 0;
            terminal.totalEarned = terminal.totalEarned || 0;
            
            // Start mining loop
            const mineLoop = async () => {
                if (!terminal.isMining) return;
                
                try {
                    terminal.mineCount++;
                    terminal.log(`⛏️  Mining block #${terminal.mineCount}...`, 'info');
                    
                    // Show mining animation
                    const spinnerFrames = ['|', '/', '-', '\\'];
                    let spinnerIndex = 0;
                    for (let i = 0; i < 8; i++) {
                        if (!terminal.isMining) break;
                        await new Promise(resolve => setTimeout(resolve, 100));
                        terminal.log(`🔒 [${spinnerFrames[spinnerIndex]}] Hashing: ${this.generateFakeHash()}`, 'output');
                        spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
                    }
                    
                    if (!terminal.isMining) return;
                    
                    // Send mining request to relayer
                    terminal.log('⛏️  Sending mining request to network...', 'info');
                    const response = await fetch(OmegaConfig.RELAYER_URL + '/mine', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            address: OmegaWallet.getCurrentAddress() 
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success && data.reward && data.reward > 0) {
                        terminal.log(`✅ Mining successful! Reward: +${data.reward} OMEGA`, 'success');
                        terminal.totalEarned += parseFloat(data.reward);
                        if (data.txHash) {
                            terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${data.txHash}" target="_blank">View transaction</a>`, 'info');
                        }
                    } else {
                        terminal.log('⛏️  Block mined (no reward this time)', 'output');
                    }
                    
                } catch (error) {
                    // Handle mining failures gracefully
                    terminal.log('⛏️  Block mined (no reward this time)', 'output');
                }
                
                // Continue mining loop
                if (terminal.isMining) {
                    setTimeout(mineLoop, 15000); // 15 second intervals
                }
            };
            
            // Start the mining loop
            mineLoop();
            
        } catch (error) {
            terminal.log('❌ Failed to start mining: ' + error.message, 'error');
            terminal.isMining = false;
        }
    },

    // Claim command
    claim: async function(terminal) {
        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        if (!terminal.contract) {
            terminal.log('❌ Mining contract not connected', 'error');
            return;
        }

        try {
            // Check pending rewards first
            const minerInfo = await terminal.contract.getMinerInfo(OmegaWallet.getCurrentAddress());
            const pendingRewards = window.ethers.utils.formatEther(minerInfo._pendingRewards);
            
            if (parseFloat(pendingRewards) === 0) {
                terminal.log('💰 No pending rewards to claim', 'info');
                return;
            }

            terminal.log(`💰 Claiming ${OmegaUtils.formatBalance(pendingRewards)} in pending rewards...`, 'info');
            
            const tx = await terminal.contract.claimRewards();
            terminal.log(`✅ Claim transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('⏳ Waiting for confirmation...', 'info');

            try {
                const receipt = await tx.wait();
                terminal.log(`✅ Claim confirmed! Block: ${receipt.blockNumber}`, 'success');
                terminal.log(`🎉 Successfully claimed ${OmegaUtils.formatBalance(pendingRewards)}!`, 'success');
                
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`, 'info');
                
            } catch (waitError) {
                terminal.log('⚠️ Claim transaction was submitted but confirmation could not be detected.', 'warning');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">Check status on Explorer</a>`, 'info');
            }

        } catch (error) {
            terminal.log('❌ Failed to claim rewards: ' + error.message, 'error');
        }
    },

    // Faucet command (direct contract interaction like original)
    faucet: async function(terminal, args) {
        if (args && args.length > 1 && args[1] === 'status') {
            await this.showFaucetStatus(terminal);
            return;
        }

        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        // Check if user needs to approve Omega wallet transaction
        if (OmegaWallet.sessionOmegaWallet) {
            const approved = await this.confirmOmegaTransaction(terminal);
            if (!approved) return;
        }

        try {
            terminal.log('🚰 Claiming from faucet...', 'info');
            
            // Create faucet contract instance
            const faucetContract = new window.ethers.Contract(
                OmegaConfig.FAUCET_ADDRESS, 
                OmegaConfig.FAUCET_ABI, 
                OmegaWallet.getSigner()
            );
            
            // Execute faucet claim
            const tx = await faucetContract.claim({ gasLimit: 100000 });
            
            terminal.log(`✅ Faucet transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('⏳ Waiting for confirmation...', 'info');
            
            try {
                await tx.wait();
                terminal.log('✅ Faucet claim successful!', 'success');
                terminal.log('💡 Remember: You can only claim once every 24 hours', 'info');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`, 'info');
            } catch (waitError) {
                terminal.log('⚠️ Faucet transaction was submitted but confirmation could not be detected.', 'warning');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">Check status on Explorer</a>`, 'info');
            }
            
        } catch (error) {
            terminal.log('❌ Faucet claim failed: ' + error.message, 'error');
            if (error.message.includes('cooldown') || error.message.includes('wait')) {
                terminal.log('💡 You may need to wait for the 24-hour cooldown period', 'info');
            }
        }
    },

    // Show faucet status (direct contract interaction like original)
    showFaucetStatus: async function(terminal) {
        // VERSION CHECK - If you see this message, the updated code is loaded
        terminal.log('🔄 UPDATED CODE VERSION: Using direct RPC provider for faucet status', 'info');
        
        if (!OmegaWallet.getSigner()) {
            terminal.log('Please connect your wallet first using: connect', 'error');
            return;
        }
        
        try {
            const address = await OmegaWallet.getSigner().getAddress();
            
            // Use direct RPC provider to avoid MetaMask issues
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            const directProvider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            const faucetContract = new window.ethers.Contract(OmegaConfig.FAUCET_ADDRESS, OmegaConfig.FAUCET_ABI, directProvider);
            
            // Get faucet status using direct RPC
            const info = await faucetContract.getFaucetStatus(address);
            
            const canClaim = info.canClaimNow;
            const lastClaim = info.lastClaim;
            const timeUntil = info.timeUntilNextClaim;
            const claimAmount = info.claimAmount;
            const faucetBalance = info.faucetBalance;
            
            terminal.log('=== Faucet Status ===', 'info');
            terminal.log(`Can claim now: ${canClaim ? '✅ Yes' : '❌ No'}`, canClaim ? 'success' : 'error');
            if (!canClaim) {
                const mins = Math.floor(timeUntil / 60);
                const secs = timeUntil % 60;
                terminal.log(`Time until next claim: ${mins}m ${secs}s`, 'warning');
            }
            terminal.log(`Faucet balance: ${window.ethers.utils.formatEther(faucetBalance)} OMEGA`, 'info');
            terminal.log(`Claim amount: ${window.ethers.utils.formatEther(claimAmount)} OMEGA`, 'info');
        } catch (error) {
            terminal.log('❌ Failed to fetch faucet status: ' + error.message, 'error');
        }
    },

    // Stats command
    stats: async function(terminal) {
        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        terminal.log('=== MINING STATISTICS ===', 'info');
        
        try {
            // Get wallet balance
            const balance = await OmegaWallet.getBalance(terminal);
            terminal.log(`💰 Current Balance: ${OmegaUtils.formatBalance(balance)}`, 'info');
            
            // Get mining stats if contract is connected
            if (terminal.contract) {
                try {
                    const minerInfo = await terminal.contract.getMinerInfo(OmegaWallet.getCurrentAddress());
                    const totalMined = window.ethers.utils.formatEther(minerInfo._totalMined);
                    const lastMineTime = parseInt(minerInfo._lastMineTime.toString());
                    const pendingRewards = window.ethers.utils.formatEther(minerInfo._pendingRewards);
                    
                    terminal.log(`⛏️  Total Mined: ${OmegaUtils.formatBalance(totalMined)}`, 'info');
                    terminal.log(`⚡ Pending Rewards: ${OmegaUtils.formatBalance(pendingRewards)}`, 'info');
                    
                    if (lastMineTime > 0) {
                        terminal.log(`🕐 Last Mine Time: ${OmegaUtils.formatTimestamp(lastMineTime)}`, 'info');
                    } else {
                        terminal.log(`🕐 Last Mine Time: Never`, 'info');
                    }
                    
                    // Get cooldown info
                    const cooldownPeriod = await terminal.contract.cooldownPeriod();
                    const cooldownMinutes = parseInt(cooldownPeriod.toString()) / 60;
                    terminal.log(`⏱️  Mining Cooldown: ${cooldownMinutes} minutes`, 'info');
                    
                    // Check if can mine now
                    const currentTime = Math.floor(Date.now() / 1000);
                    const timeSinceLastMine = currentTime - lastMineTime;
                    const canMineNow = timeSinceLastMine >= cooldownPeriod || lastMineTime === 0;
                    
                    terminal.log(`🚦 Can Mine Now: ${canMineNow ? '✅ Yes' : '❌ No'}`, canMineNow ? 'success' : 'warning');
                    
                    if (!canMineNow) {
                        const timeRemaining = parseInt(cooldownPeriod.toString()) - timeSinceLastMine;
                        terminal.log(`⏳ Time Until Next Mine: ${OmegaUtils.formatDuration(timeRemaining)}`, 'info');
                    }
                    
                } catch (contractError) {
                    terminal.log('⚠️  Could not fetch mining contract stats', 'warning');
                }
                
                // Get global contract stats
                try {
                    const totalRewards = await terminal.contract.totalRewardsDistributed();
                    const totalRewardsEth = window.ethers.utils.formatEther(totalRewards);
                    terminal.log(`🌍 Global Rewards Distributed: ${OmegaUtils.formatBalance(totalRewardsEth)}`, 'info');
                } catch (globalError) {
                    // Ignore global stats errors
                }
            }
            
            // Session stats
            if (terminal.totalEarned && terminal.totalEarned > 0) {
                terminal.log(`📊 Session Earnings: ${OmegaUtils.formatBalance(terminal.totalEarned.toString())}`, 'success');
            }
            
        } catch (error) {
            terminal.log('❌ Failed to get statistics: ' + error.message, 'error');
        }
    },

    // Generate fake hash for mining animation
    generateFakeHash: function() {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 64; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },

    // Confirm Omega wallet transaction
    confirmOmegaTransaction: async function(terminal) {
        return new Promise((resolve) => {
            terminal.log('⚠️  This will use your Omega session wallet for the transaction', 'warning');
            terminal.log('Type "yes" to confirm or "no" to cancel:', 'info');
            
            const originalExecuteCommand = terminal.executeCommand.bind(terminal);
            terminal.executeCommand = async function(command) {
                const response = command.trim().toLowerCase();
                if (response === 'yes' || response === 'y') {
                    terminal.executeCommand = originalExecuteCommand;
                    resolve(true);
                } else if (response === 'no' || response === 'n') {
                    terminal.executeCommand = originalExecuteCommand;
                    terminal.log('Transaction cancelled by user', 'info');
                    resolve(false);
                } else {
                    terminal.log('Please type "yes" or "no"', 'warning');
                }
            };
        });
    }
}; 