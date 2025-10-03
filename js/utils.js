// Omega Terminal Utilities
window.OmegaUtils = {
    // Cache busting for refreshes (DISABLED - was causing redirect loops)
    checkCacheBust: function() {
        // Disabled to prevent redirect loops
        console.log('[DEBUG] 🔧 Cache bust check disabled');
    },
    
    // Simple base58 decoder implementation
    base58Chars: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    
    base58Decode: function(str) {
        const base58Lookup = {};
        for (let i = 0; i < this.base58Chars.length; i++) {
            base58Lookup[this.base58Chars[i]] = i;
        }
        
        let decoded = 0n;
        let multi = 1n;
        const base = 58n;
        
        for (let i = str.length - 1; i >= 0; i--) {
            const char = str[i];
            if (!(char in base58Lookup)) {
                throw new Error('Invalid base58 character: ' + char);
            }
            decoded += BigInt(base58Lookup[char]) * multi;
            multi *= base;
        }
        
        // Convert to bytes
        const bytes = [];
        while (decoded > 0n) {
            bytes.unshift(Number(decoded % 256n));
            decoded = decoded / 256n;
        }
        
        // Handle leading zeros
        for (let i = 0; i < str.length && str[i] === '1'; i++) {
            bytes.unshift(0);
        }
        
        return new Uint8Array(bytes);
    },
    
    // Format time duration
    formatDuration: function(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    },
    
    // Format large numbers
    formatNumber: function(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    },
    
    // Generate random hex
    randomHex: function(length = 64) {
        const array = window.crypto.getRandomValues(new Uint8Array(length / 2));
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    // Wait for element to exist
    waitForElement: function(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Copy text to clipboard
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            return true;
        }).catch((err) => {
            console.error('Failed to copy text: ', err);
            return false;
        });
    },
    
    // Validate Ethereum address
    isValidEthereumAddress: function(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    },
    
    // Validate private key
    isValidPrivateKey: function(key) {
        if (!key.startsWith('0x')) key = '0x' + key;
        return /^0x[a-fA-F0-9]{64}$/.test(key);
    },
    
    // Shorten address for display
    shortenAddress: function(address, chars = 4) {
        if (!address) return '';
        return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
    },
    
    // Generate commitment for mixer
    generateMixerCommitment: function() {
        const array = window.crypto.getRandomValues(new Uint8Array(32));
        const secret = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        const commitment = window.ethers ? 
            ethers.utils.keccak256('0x' + secret) : 
            '0x' + this.randomHex(64);
        return { secret, commitment };
    },
    
    // Parse command arguments
    parseCommandArgs: function(command) {
        return command.trim().split(/\s+/);
    },
    
    // HTML escape
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    // Format balance display
    formatBalance: function(balance, symbol = 'OMEGA', decimals = 4) {
        const num = parseFloat(balance);
        if (isNaN(num)) return '0.0000 ' + symbol;
        return num.toFixed(decimals) + ' ' + symbol;
    },
    
    // Get current timestamp
    getCurrentTimestamp: function() {
        return Math.floor(Date.now() / 1000);
    },
    
    // Format timestamp to readable date
    formatTimestamp: function(timestamp) {
        return new Date(timestamp * 1000).toLocaleString();
    }
};

// Ethers fallback implementation - only loads if all CDN sources fail
window.loadEthersFallback = function() {
    console.log('Loading ethers fallback...');
    window.ethers = {
        providers: {
            Web3Provider: function(provider) {
                this.provider = provider;
                this.getSigner = () => ({ 
                    getAddress: () => Promise.resolve('0x0000000000000000000000000000000000000000'),
                    sendTransaction: () => Promise.reject(new Error('Fallback ethers - no real transactions'))
                });
                this.getGasPrice = () => Promise.resolve({ toString: () => '20000000000' });
                this.getBalance = () => Promise.resolve({ isZero: () => true });
                this.getTransactionCount = () => Promise.resolve(0);
            },
            JsonRpcProvider: function(url) {
                this.connection = { url };
                this.getNetwork = () => Promise.resolve({ chainId: 1313161256, name: 'omega' });
            }
        },
        Contract: function(address, abi, signer) {
            this.address = address;
            this.abi = abi;
            this.signer = signer;
            // Add basic contract methods
            this.startMining = () => Promise.resolve({ wait: () => Promise.resolve() });
            this.claimRewards = () => Promise.resolve({ wait: () => Promise.resolve() });
        },
        Wallet: {
            createRandom: function() {
                return {
                    address: '0x' + OmegaUtils.randomHex(40),
                    privateKey: '0x' + OmegaUtils.randomHex(64),
                    connect: function(provider) { return this; },
                    sendTransaction: function(tx) { 
                        return Promise.resolve({ 
                            hash: '0x' + OmegaUtils.randomHex(64),
                            wait: () => Promise.resolve()
                        }); 
                    }
                };
            }
        },
        utils: {
            formatEther: (wei) => (parseInt(wei) / 1e18).toString(),
            parseEther: (ether) => (parseFloat(ether) * 1e18).toString(),
            id: (text) => '0x' + OmegaUtils.randomHex(64),
            keccak256: (data) => '0x' + OmegaUtils.randomHex(64),
            defaultAbiCoder: {
                decode: () => ['0x0000000000000000000000000000000000000000', '1000000000000000000', '1']
            },
            hexDataSlice: (data, start) => data
        }
    };
    console.log('Ethers fallback loaded successfully');
};

// Simplified ethers loading with fallback support
window.loadEthers = function() {
    return new Promise((resolve, reject) => {
        // Small delay to ensure CDN script has time to load
        setTimeout(() => {
            console.log('Checking for ethers availability...');
            
            // Check if ethers is already loaded (CDN success)
            if (typeof ethers !== 'undefined') {
                console.log('Ethers loaded successfully from CDN');
                resolve(ethers);
                return;
            }
            
            console.log('CDN ethers not loaded, trying additional CDN sources...');
            
            // Try multiple CDN sources
            const cdnSources = [
                'https://unpkg.com/ethers@5.7.2/dist/ethers.umd.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js'
            ];
            
            let currentSource = 0;
            
            function tryNextSource() {
                if (currentSource >= cdnSources.length) {
                    // All CDN sources failed, load fallback
                    console.log('All CDN sources failed, loading fallback ethers...');
                    window.loadEthersFallback();
                    resolve(ethers);
                    return;
                }
                
                const script = document.createElement('script');
                script.src = cdnSources[currentSource];
                script.onload = () => {
                    if (typeof ethers !== 'undefined') {
                        console.log(`Ethers loaded successfully from: ${cdnSources[currentSource]}`);
                        resolve(ethers);
                    } else {
                        currentSource++;
                        tryNextSource();
                    }
                };
                script.onerror = () => {
                    console.warn(`Failed to load ethers from: ${cdnSources[currentSource]}`);
                    currentSource++;
                    tryNextSource();
                };
                document.head.appendChild(script);
            }
            
            tryNextSource();
        }, 500); // 500ms delay to ensure CDN script has time to load
    });
}; 