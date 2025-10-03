// Network Stress Testing Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Network = {
    // Start stress test
    stress: async function(terminal) {
        if (terminal.isStressTesting) {
            terminal.log('❌ Stress test already running. Use "stopstress" to stop.', 'error');
            return;
        }

        if (!window.ethers) {
            terminal.log('❌ Ethers library not loaded', 'error');
            return;
        }

        terminal.log('🚀 Starting network stress test...', 'info');
        terminal.log('⚠️  This will create many transactions on the Omega network', 'warning');
        terminal.log('💡 Use "stopstress" to stop the test at any time', 'info');
        
        // Initialize stress test state
        terminal.isStressTesting = true;
        terminal.stressTestStats = {
            walletsCreated: 0,
            transactionsSent: 0,
            successfulTxs: 0,
            failedTxs: 0,
            startTime: Date.now()
        };

        try {
            // Create stress test wallet
            const provider = new window.ethers.providers.JsonRpcProvider(OmegaConfig.OMEGA_RPC_URL);
            terminal.stressWallet = window.ethers.Wallet.createRandom().connect(provider);
            terminal.stressNonce = 0;
            terminal.stressTestStats.walletsCreated = 1;

            terminal.log(`📊 Stress wallet created: ${terminal.stressWallet.address}`, 'info');
            
            // Request initial funding for stress wallet
            await this.requestStressFunding(terminal, terminal.stressWallet.address);
            
            // Start stress test loop
            terminal.stressTestInterval = setInterval(async () => {
                if (!terminal.isStressTesting) {
                    clearInterval(terminal.stressTestInterval);
                    return;
                }
                await this.performStressTransaction(terminal);
            }, 2000); // Transaction every 2 seconds

            terminal.log('✅ Stress test started successfully', 'success');
            terminal.log('📊 Use "stressstats" to view real-time statistics', 'info');

        } catch (error) {
            terminal.log('❌ Failed to start stress test: ' + error.message, 'error');
            terminal.isStressTesting = false;
        }
    },

    // Stop stress test
    stopstress: function(terminal) {
        if (!terminal.isStressTesting) {
            terminal.log('❌ No stress test is currently running', 'error');
            return;
        }

        terminal.log('🛑 Stopping stress test...', 'info');
        
        terminal.isStressTesting = false;
        if (terminal.stressTestInterval) {
            clearInterval(terminal.stressTestInterval);
            terminal.stressTestInterval = null;
        }

        // Calculate final stats
        const duration = Math.floor((Date.now() - terminal.stressTestStats.startTime) / 1000);
        const txRate = terminal.stressTestStats.transactionsSent / (duration || 1);
        
        terminal.log('✅ Stress test stopped', 'success');
        terminal.log('=== FINAL STRESS TEST RESULTS ===', 'info');
        terminal.log(`Duration: ${OmegaUtils.formatDuration(duration)}`, 'info');
        terminal.log(`Wallets Created: ${terminal.stressTestStats.walletsCreated}`, 'info');
        terminal.log(`Total Transactions: ${terminal.stressTestStats.transactionsSent}`, 'info');
        terminal.log(`Successful: ${terminal.stressTestStats.successfulTxs}`, 'success');
        terminal.log(`Failed: ${terminal.stressTestStats.failedTxs}`, 'error');
        terminal.log(`Average Rate: ${txRate.toFixed(2)} tx/second`, 'info');
        
        const successRate = terminal.stressTestStats.transactionsSent > 0 ? 
            (terminal.stressTestStats.successfulTxs / terminal.stressTestStats.transactionsSent * 100) : 0;
        terminal.log(`Success Rate: ${successRate.toFixed(1)}%`, successRate > 80 ? 'success' : 'warning');
    },

    // Show stress test statistics
    stressstats: function(terminal) {
        if (!terminal.isStressTesting) {
            terminal.log('❌ No stress test is currently running', 'error');
            terminal.log('💡 Use "stress" to start a stress test', 'info');
            return;
        }

        const duration = Math.floor((Date.now() - terminal.stressTestStats.startTime) / 1000);
        const txRate = terminal.stressTestStats.transactionsSent / (duration || 1);
        
        terminal.log('=== LIVE STRESS TEST STATISTICS ===', 'info');
        terminal.log(`⏱️  Duration: ${OmegaUtils.formatDuration(duration)}`, 'info');
        terminal.log(`👛 Wallets Created: ${terminal.stressTestStats.walletsCreated}`, 'info');
        terminal.log(`📊 Total Transactions: ${terminal.stressTestStats.transactionsSent}`, 'info');
        terminal.log(`✅ Successful: ${terminal.stressTestStats.successfulTxs}`, 'success');
        terminal.log(`❌ Failed: ${terminal.stressTestStats.failedTxs}`, 'error');
        terminal.log(`⚡ Current Rate: ${txRate.toFixed(2)} tx/second`, 'info');
        
        if (terminal.stressTestStats.transactionsSent > 0) {
            const successRate = (terminal.stressTestStats.successfulTxs / terminal.stressTestStats.transactionsSent * 100);
            terminal.log(`📈 Success Rate: ${successRate.toFixed(1)}%`, successRate > 80 ? 'success' : 'warning');
        }
        
        if (terminal.stressWallet) {
            terminal.log(`💰 Stress Wallet: ${OmegaUtils.shortenAddress(terminal.stressWallet.address)}`, 'info');
        }
    },

    // Request funding for stress wallet via relayer
    requestStressFunding: async function(terminal, address) {
        try {
            terminal.log('💰 Requesting funding for stress wallet...', 'info');
            
            const response = await fetch(OmegaConfig.RELAYER_URL + '/fund-stress-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: address,
                    amount: '1.0' // Request 1 OMEGA for stress testing
                })
            });

            const result = await response.json();
            
            if (result.success) {
                terminal.log(`✅ Stress wallet funded: ${result.amount} OMEGA`, 'success');
            } else {
                terminal.log(`⚠️ Funding request sent but may have failed: ${result.error}`, 'warning');
            }
            
        } catch (error) {
            terminal.log(`⚠️ Could not request stress funding: ${error.message}`, 'warning');
            terminal.log('💡 Stress test will continue but transactions may fail due to insufficient funds', 'info');
        }
    },

    // Perform a single stress test transaction
    performStressTransaction: async function(terminal) {
        if (!terminal.stressWallet || !terminal.isStressTesting) {
            return;
        }

        try {
            // Generate random transaction parameters
            const transactionTypes = ['transfer', 'contract_call', 'mining'];
            const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
            
            let tx;
            terminal.stressTestStats.transactionsSent++;
            
            switch (txType) {
                case 'transfer':
                    // Create random transfer
                    const randomReceiver = window.ethers.Wallet.createRandom().address;
                    const randomAmount = (Math.random() * 0.01).toFixed(6); // 0-0.01 OMEGA
                    
                    tx = await terminal.stressWallet.sendTransaction({
                        to: randomReceiver,
                        value: window.ethers.utils.parseEther(randomAmount),
                        nonce: terminal.stressNonce++
                    });
                    break;
                    
                case 'contract_call':
                    // Try to call mining contract if available
                    if (OmegaConfig.CONTRACT_ADDRESS) {
                        const contract = new window.ethers.Contract(
                            OmegaConfig.CONTRACT_ADDRESS,
                            OmegaConfig.CONTRACT_ABI,
                            terminal.stressWallet
                        );
                        
                        const nonce = Math.floor(Math.random() * 1000000);
                        const solution = '0x' + OmegaUtils.randomHex(64);
                        
                        tx = await contract.mineBlock(nonce, solution, {
                            nonce: terminal.stressNonce++
                        });
                    } else {
                        // Fallback to transfer if no contract
                        const randomReceiver = window.ethers.Wallet.createRandom().address;
                        tx = await terminal.stressWallet.sendTransaction({
                            to: randomReceiver,
                            value: window.ethers.utils.parseEther('0.001'),
                            nonce: terminal.stressNonce++
                        });
                    }
                    break;
                    
                case 'mining':
                    // Simple mining-like transaction
                    const nonce = Math.floor(Math.random() * 1000000);
                    const data = '0x' + OmegaUtils.randomHex(32); // Random data
                    
                    tx = await terminal.stressWallet.sendTransaction({
                        to: terminal.stressWallet.address, // Self-transaction
                        value: 0,
                        data: data,
                        nonce: terminal.stressNonce++
                    });
                    break;
            }
            
            // Don't wait for confirmation to maintain high throughput
            terminal.stressTestStats.successfulTxs++;
            
            // Occasionally log progress
            if (terminal.stressTestStats.transactionsSent % 10 === 0) {
                const duration = Math.floor((Date.now() - terminal.stressTestStats.startTime) / 1000);
                const rate = terminal.stressTestStats.transactionsSent / (duration || 1);
                terminal.log(`📊 Progress: ${terminal.stressTestStats.transactionsSent} txs sent (${rate.toFixed(1)} tx/s)`, 'info');
            }
            
        } catch (error) {
            terminal.stressTestStats.failedTxs++;
            
            // Log occasional errors but don't spam
            if (terminal.stressTestStats.failedTxs % 5 === 1) {
                terminal.log(`⚠️ Stress transaction failed: ${error.message}`, 'warning');
            }
            
            // If too many consecutive failures, consider stopping
            const recentFailureRate = terminal.stressTestStats.failedTxs / Math.max(terminal.stressTestStats.transactionsSent, 1);
            if (recentFailureRate > 0.8 && terminal.stressTestStats.transactionsSent > 10) {
                terminal.log('🛑 High failure rate detected. Consider stopping stress test.', 'warning');
                terminal.log('💡 The network may be congested or wallet may be out of funds', 'info');
            }
        }
    }
}; 