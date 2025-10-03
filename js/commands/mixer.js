// Mixer Privacy Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Mixer = {
    // Main mixer command router
    mixer: async function(terminal, args) {
        if (!args || args.length < 2) {
            this.showMixerHelp(terminal);
            return;
        }

        const subCommand = args[1].toLowerCase();
        
        switch (subCommand) {
            case '-help':
            case 'help':
                this.showMixerHelp(terminal);
                break;
            case 'deposit':
                await this.deposit(terminal, args);
                break;
            case 'deposit-execute':
                await this.depositExecute(terminal, args);
                break;
            case 'deposit-direct':
                this.depositDirect(terminal, args);
                break;
            case 'withdraw':
                this.withdraw(terminal, args);
                break;
            case 'withdraw-execute':
                await this.withdrawExecute(terminal, args);
                break;
            case 'withdraw-direct':
                this.withdrawDirect(terminal);
                break;
            default:
                terminal.log(`❌ Unknown mixer command: ${subCommand}`, 'error');
                this.showMixerHelp(terminal);
        }
    },

    // Show mixer help
    showMixerHelp: function(terminal) {
        terminal.log('=== Omega Mixer Help ===', 'info');
        terminal.log('The Omega Mixer allows you to privately send OMEGA tokens by breaking the on-chain link between sender and receiver.', 'info');
        terminal.log('How it works:', 'info');
        terminal.log('1. Use "mixer deposit" to generate a secret and commitment, then manually call the contract.', 'info');
        terminal.log('2. Use "mixer deposit-execute" to generate secret and call contract via MetaMask.', 'info');
        terminal.log('3. Use "mixer deposit-direct" to generate secret and call contract directly (requires private key).', 'info');
        terminal.log('4. Wait for the mixing round to complete (more users = more privacy).', 'info');
        terminal.log('5. Use "mixer withdraw" to prepare your withdrawal. Enter your secret and the new address you want to receive funds at.', 'info');
        terminal.log('6. In MetaMask (or via a relayer), call the withdraw function on the mixer contract with your secret and new address.', 'info');
        terminal.log('', '');
        terminal.log('=== Commands ===', 'info');
        terminal.log('mixer deposit <amount>        - Generate commitment and show manual deposit instructions', 'info');
        terminal.log('mixer deposit-execute <amount> - Generate commitment and execute deposit via MetaMask', 'info');
        terminal.log('mixer deposit-direct         - Direct deposit using private key (requires private key input)', 'info');
        terminal.log('mixer withdraw               - Prepare withdrawal (requires secret and recipient address)', 'info');
        terminal.log('mixer withdraw-execute       - Execute withdrawal via MetaMask', 'info');
        terminal.log('mixer withdraw-direct        - Direct withdrawal using private key', 'info');
        terminal.log('', '');
        terminal.logHtml(`<span style="color:#ff6666">⚠️ IMPORTANT: Save your secret! You need it to withdraw your funds!</span>`, 'error');
        terminal.logHtml(`<span style="color:#33bbff">🔗 Mixer Contract: <a href="https://0x4e454228.explorer.aurora-cloud.dev/address/${OmegaConfig.MIXER_ADDRESS}" target="_blank">${OmegaConfig.MIXER_ADDRESS}</a></span>`, 'info');
    },

    // Basic deposit (generate commitment, show instructions)
    deposit: async function(terminal, args) {
        if (args.length < 3) {
            terminal.log('Usage: mixer deposit <amount>', 'error');
            terminal.log('Example: mixer deposit 1.5', 'info');
            return;
        }

        const amount = args[2];
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            terminal.log('❌ Invalid amount. Must be a positive number.', 'error');
            return;
        }

        terminal.log('=== Omega Mixer Deposit ===', 'info');
        terminal.log(`Deposit amount: ${amount} OMEGA`, 'info');
        
        // Generate secret and commitment
        const { secret, commitment } = OmegaUtils.generateMixerCommitment();
        
        terminal.logHtml(`<span style="color:#ff6666">🔐 Your secret (SAVE THIS!):</span> <span class="copyable" onclick="navigator.clipboard.writeText('${secret}').then(() => window.terminal.log('✅ Secret copied to clipboard!', 'success')).catch(() => window.terminal.log('❌ Failed to copy secret', 'error'))">${secret}</span>`, 'error');
        terminal.log(`🔗 Commitment: ${commitment}`, 'info');
        terminal.log('', '');
        terminal.log('=== Manual Deposit Instructions ===', 'info');
        terminal.log('1. Go to the mixer contract on the block explorer:', 'info');
        terminal.logHtml(`   <a href="https://0x4e454228.explorer.aurora-cloud.dev/address/${OmegaConfig.MIXER_ADDRESS}" target="_blank">${OmegaConfig.MIXER_ADDRESS}</a>`, 'info');
        terminal.log('2. Connect your wallet and call the "deposit" function', 'info');
        terminal.log(`3. Use commitment: ${commitment}`, 'info');
        terminal.log(`4. Send ${amount} OMEGA with the transaction`, 'info');
        terminal.log('', '');
        terminal.logHtml('<span style="color:#ff6666">⚠️ CRITICAL: Save your secret! You need it to withdraw your funds!</span>', 'error');
    },

    // Execute deposit via MetaMask
    depositExecute: async function(terminal, args) {
        if (args.length < 3) {
            terminal.log('Usage: mixer deposit-execute <amount>', 'error');
            terminal.log('Example: mixer deposit-execute 1.5', 'info');
            return;
        }

        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        const amount = args[2];
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            terminal.log('❌ Invalid amount. Must be a positive number.', 'error');
            return;
        }

        try {
            terminal.log('=== Omega Mixer Deposit (Execute) ===', 'info');
            terminal.log(`Deposit amount: ${amount} OMEGA`, 'info');
            
            // Generate secret and commitment
            const { secret, commitment } = OmegaUtils.generateMixerCommitment();
            
            terminal.logHtml(`<span style="color:#ff6666">🔐 Your secret (SAVE THIS!):</span> <span class="copyable" onclick="navigator.clipboard.writeText('${secret}').then(() => window.terminal.log('✅ Secret copied to clipboard!', 'success')).catch(() => window.terminal.log('❌ Failed to copy secret', 'error'))">${secret}</span>`, 'error');
            terminal.log(`🔗 Commitment: ${commitment}`, 'info');
            
            // Create mixer contract instance
            const mixerContract = new window.ethers.Contract(
                OmegaConfig.MIXER_ADDRESS,
                OmegaConfig.MIXER_ABI,
                OmegaWallet.getSigner()
            );
            
            const depositAmount = window.ethers.utils.parseEther(amount);
            
            terminal.log('📡 Submitting deposit transaction...', 'info');
            const tx = await mixerContract.deposit(commitment, { value: depositAmount });
            
            terminal.log(`✅ Deposit transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('⏳ Waiting for confirmation...', 'info');

            try {
                const receipt = await tx.wait();
                terminal.log(`✅ Deposit confirmed! Block: ${receipt.blockNumber}`, 'success');
                terminal.log('🎉 Your funds are now in the mixer!', 'success');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`, 'info');
                terminal.logHtml('<span style="color:#ff6666">⚠️ SAVE YOUR SECRET! You need it to withdraw your funds!</span>', 'error');
            } catch (waitError) {
                terminal.log('⚠️ Deposit transaction was submitted but confirmation could not be detected.', 'warning');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">Check status on Explorer</a>`, 'info');
            }

        } catch (error) {
            terminal.log(`❌ Deposit failed: ${error.message}`, 'error');
        }
    },

    // Direct deposit (requires private key)
    depositDirect: function(terminal, args) {
        terminal.log('=== Omega Mixer Deposit (Direct) ===', 'info');
        terminal.log('This method requires your private key and will execute the deposit directly.', 'warning');
        terminal.log('Enter your private key and amount separated by a space:', 'info');
        terminal.log('Format: <private_key> <amount>', 'info');
        terminal.log('Example: 0x1234...abcd 1.5', 'info');
        
        // Set awaiting state for direct input
        terminal.awaitingMixerDirectInput = true;
    },

    // Basic withdraw (show instructions)
    withdraw: function(terminal, args) {
        terminal.log('=== Omega Mixer Withdraw ===', 'info');
        terminal.log('To withdraw your funds, you need:', 'info');
        terminal.log('1. Your secret (from when you deposited)', 'info');
        terminal.log('2. The address where you want to receive the funds', 'info');
        terminal.log('', '');
        terminal.log('=== Manual Withdraw Instructions ===', 'info');
        terminal.log('1. Go to the mixer contract on the block explorer:', 'info');
        terminal.logHtml(`   <a href="https://0x4e454228.explorer.aurora-cloud.dev/address/${OmegaConfig.MIXER_ADDRESS}" target="_blank">${OmegaConfig.MIXER_ADDRESS}</a>`, 'info');
        terminal.log('2. Connect your wallet and call the "withdraw" function', 'info');
        terminal.log('3. Enter your secret (32-byte hex string)', 'info');
        terminal.log('4. Enter the recipient address where you want to receive funds', 'info');
        terminal.log('', '');
        terminal.log('💡 Use "mixer withdraw-execute" to do this automatically via MetaMask', 'info');
        terminal.log('💡 Use "mixer withdraw-direct" to withdraw using a private key', 'info');
    },

    // Execute withdraw via MetaMask
    withdrawExecute: async function(terminal, args) {
        if (!OmegaWallet.isConnected()) {
            terminal.log('❌ No wallet connected. Use "connect" first.', 'error');
            return;
        }

        terminal.log('=== Omega Mixer Withdraw (Execute) ===', 'info');
        
        try {
            // Get secret from user
            terminal.log('Enter your secret (from when you deposited):', 'info');
            const secret = await terminal.promptTerminalInput();
            
            if (!secret || secret.length !== 64) {
                terminal.log('❌ Invalid secret. Must be 64 hex characters.', 'error');
                return;
            }
            
            // Get recipient address
            terminal.log('Enter recipient address (where to send the funds):', 'info');
            const recipient = await terminal.promptTerminalInput();
            
            if (!OmegaUtils.isValidEthereumAddress(recipient)) {
                terminal.log('❌ Invalid recipient address.', 'error');
                return;
            }
            
            terminal.log(`🔐 Secret: ${secret}`, 'info');
            terminal.log(`📨 Recipient: ${recipient}`, 'info');
            
            // Create mixer contract instance
            const mixerContract = new window.ethers.Contract(
                OmegaConfig.MIXER_ADDRESS,
                OmegaConfig.MIXER_ABI,
                OmegaWallet.getSigner()
            );
            
            const secretHex = '0x' + secret;
            
            terminal.log('📡 Submitting withdraw transaction...', 'info');
            const tx = await mixerContract.withdraw(secretHex, recipient);
            
            terminal.log(`✅ Withdraw transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('⏳ Waiting for confirmation...', 'info');

            try {
                const receipt = await tx.wait();
                terminal.log(`✅ Withdraw confirmed! Block: ${receipt.blockNumber}`, 'success');
                terminal.log(`🎉 Funds withdrawn to: ${recipient}`, 'success');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">View on Explorer</a>`, 'info');
            } catch (waitError) {
                terminal.log('⚠️ Withdraw transaction was submitted but confirmation could not be detected.', 'warning');
                terminal.logHtml(`🔍 <a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">Check status on Explorer</a>`, 'info');
            }

        } catch (error) {
            terminal.log(`❌ Withdraw failed: ${error.message}`, 'error');
            if (error.message.includes('Invalid secret')) {
                terminal.log('💡 Make sure you are using the correct secret from your deposit', 'info');
            }
        }
    },

    // Direct withdraw (requires private key)
    withdrawDirect: function(terminal) {
        terminal.log('=== Omega Mixer Withdraw (Direct) ===', 'info');
        terminal.log('This method requires your private key and will execute the withdrawal directly.', 'warning');
        terminal.log('Enter your private key:', 'info');
        
        // Set awaiting state
        terminal.awaitingPrivateKey = true;
        terminal.awaitingMixerWithdrawDirect = true;
    },

    // Handle mixer direct input (for deposit-direct)
    handleMixerDirectInput: async function(terminal, privateKeyInput, amountStr) {
        try {
            const mixerABI = [
                "function deposit(bytes32 commitment) external payable"
            ];
            
            // Always use a JsonRpcProvider for direct private key flows
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            const provider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            const privateKey = privateKeyInput.startsWith('0x') ? privateKeyInput : '0x' + privateKeyInput;
            const wallet = new window.ethers.Wallet(privateKey, provider);
            
            // Debug: print wallet address
            terminal.log(`Using wallet address: ${wallet.address}`, 'info');
            // Debug: print provider network
            const network = await provider.getNetwork();
            terminal.log(`Provider network: ${network.name} (chainId: ${network.chainId})`, 'info');
            // Debug: print wallet balance
            const balance = await wallet.getBalance();
            terminal.log(`Wallet balance: ${window.ethers.utils.formatEther(balance)} OMEGA`, 'info');
            
            const mixerContract = new window.ethers.Contract(OmegaConfig.MIXER_ADDRESS, mixerABI, wallet);
            const depositAmount = window.ethers.utils.parseEther(amountStr);
            
            // Generate secret and commitment
            const { secret, commitment } = OmegaUtils.generateMixerCommitment();
            
            terminal.logHtml(`1. Generated secret: <span class="copyable" onclick="navigator.clipboard.writeText('${secret}').then(() => window.terminal.log('✅ Secret copied to clipboard!', 'success')).catch(() => window.terminal.log('❌ Failed to copy secret', 'error'))">${secret}</span>`, 'info');
            terminal.log(`2. Commitment: ${commitment}`, 'info');
            terminal.log(`3. Deposit amount: ${amountStr} OMEGA`, 'info');
            terminal.log('4. Creating wallet and calling contract...', 'info');
            
            const tx = await mixerContract.deposit(commitment, { value: depositAmount });
            terminal.log(`✅ Deposit transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('Waiting for confirmation...', 'info');
            
            try {
                const receipt = await tx.wait();
                terminal.log(`✅ Deposit confirmed! Block: ${receipt.blockNumber}`, 'success');
                terminal.log('Your funds are now in the mixer. Use your secret to withdraw later.', 'info');
            } catch (err) {
                terminal.log('⚠️ Transaction was submitted but confirmation could not be detected in time.', 'warning');
                terminal.log('You can check the status manually on the block explorer:', 'info');
                terminal.logHtml(`<a href="https://0x4e454228.explorer.aurora-cloud.dev/tx/${tx.hash}" target="_blank">${tx.hash}</a>`, 'info');
            }
            
        } catch (error) {
            terminal.log(`❌ Deposit failed: ${error.message}`, 'error');
            terminal.log('Make sure you have enough OMEGA and a valid private key.', 'info');
        }
    },

    // Handle withdraw direct parameters
    handleMixerWithdrawDirectParams: async function(terminal, secret, address, privateKey) {
        try {
            terminal.log('=== Omega Mixer Withdraw (Direct) ===', 'info');
            terminal.log('Withdrawing funds directly from contract...', 'info');
            
            // Validate secret
            let secretHex = secret;
            if (!secretHex.startsWith('0x')) secretHex = '0x' + secretHex;
            if (secretHex.length !== 66) { // 2 for '0x' + 64 hex chars
                terminal.log('❌ Secret must be 32 bytes (64 hex characters).', 'error');
                return;
            }
            
            // Create wallet from private key
            const OMEGA_RPC_URL = 'https://0x4e454228.rpc.aurora-cloud.dev';
            const provider = new window.ethers.providers.JsonRpcProvider(OMEGA_RPC_URL);
            const privKey = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
            const wallet = new window.ethers.Wallet(privKey, provider);
            
            // Mixer contract ABI
            const mixerABI = [
                "function withdraw(bytes32 secret, address to) external"
            ];
            const mixerContract = new window.ethers.Contract(OmegaConfig.MIXER_ADDRESS, mixerABI, wallet);
            
            const tx = await mixerContract.withdraw(secretHex, address);
            terminal.log(`✅ Withdrawal transaction submitted! Hash: ${tx.hash}`, 'success');
            terminal.log('Waiting for confirmation...', 'info');
            
            const receipt = await tx.wait();
            terminal.log(`✅ Withdrawal confirmed! Block: ${receipt.blockNumber}`, 'success');
            terminal.log(`✅ Funds withdrawn to: ${address}`, 'success');
            
        } catch (error) {
            terminal.log(`❌ Withdrawal failed: ${error.message}`, 'error');
            terminal.log('Make sure you have a valid private key and the secret is correct.', 'info');
        }
    }
}; 