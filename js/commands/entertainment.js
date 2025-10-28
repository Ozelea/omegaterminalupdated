// Entertainment Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Entertainment = {
    // Rick roll command
    rickroll: function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('rickroll', '🎵 INITIALIZING RICK ROLL PROTOCOL...');
        }
        
        terminal.log('🎵 Rick Roll starting...', 'info');
        
        // Show text-only Rick Roll with lyrics
        this.showTextRickRoll(terminal);
        
        // Show completion message after a delay
        setTimeout(() => {
            terminal.log('', '');
            terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ff6699, #ff0066); border-radius:15px; margin:10px 0; animation:pulse 1s infinite;">', 'output');
            terminal.logHtml('<h2 style="color:#fff; text-shadow:0 0 20px #fff; margin:0;">💖 YOU JUST GOT RICK ROLLED! 💖</h2>', 'output');
            terminal.logHtml('</div>', 'output');
            terminal.log('🕺 Thanks for being a good sport!', 'info');
            
            // Update futuristic UI feedback
            if (window.FuturisticDashboard) {
                window.FuturisticDashboard.showCommandFeedback('rickroll', '✅ RICK ROLL COMPLETE!');
            }
        }, 3000); // Show after 3 seconds
    },

    // Text-only Rick Roll fallback
    showTextRickRoll: function(terminal) {
        terminal.log('🎵 Never gonna give you up...', 'info');
        terminal.log('🎵 Never gonna let you down...', 'info');
        terminal.log('🎵 Never gonna run around and desert you...', 'info');
        terminal.log('🎵 Never gonna make you cry...', 'info');
        terminal.log('🎵 Never gonna say goodbye...', 'info');
        terminal.log('🎵 Never gonna tell a lie and hurt you...', 'info');
        terminal.log('', '');
        terminal.logHtml('<span style="color:#ff6699">💖 You just got Rick Rolled! 💖</span>', 'success');
        terminal.log('🕺 Thanks for being a good sport!', 'info');
    },

    // Matrix animation
    matrix: function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('matrix', '🔰 INITIALIZING MATRIX SIMULATION...');
        }
        
        // Clear terminal and show dramatic intro
        terminal.log('', '');
        terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #000, #00ff00); border-radius:15px; margin:10px 0; border:2px solid #00ff00;">', 'output');
        terminal.logHtml('<h2 style="color:#00ff00; text-shadow:0 0 20px #00ff00; margin:0; font-family:monospace;">🔰 MATRIX SIMULATION ACTIVE 🔰</h2>', 'output');
        terminal.logHtml('</div>', 'output');
        
        terminal.log('🔰 Initializing Matrix simulation...', 'info');
        
        const matrixChars = ['0', '1', 'Ω', '⛏️', '🔰', '💎', '⚡', '█', '▓', '▒', '░'];
        let lineCount = 0;
        const maxLines = 20;
        
        const matrixInterval = setInterval(() => {
            if (lineCount >= maxLines) {
                clearInterval(matrixInterval);
                terminal.log('', '');
                terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #00ff00, #000); border-radius:15px; margin:10px 0; border:2px solid #00ff00;">', 'output');
                terminal.logHtml('<h2 style="color:#00ff00; text-shadow:0 0 20px #00ff00; margin:0; font-family:monospace;">🔰 MATRIX SIMULATION COMPLETE 🔰</h2>', 'output');
                terminal.logHtml('<p style="color:#00ff00; margin:10px 0;">Welcome to the real world.</p>', 'output');
                terminal.logHtml('</div>', 'output');
                
                // Update futuristic UI feedback
                if (window.FuturisticDashboard) {
                    window.FuturisticDashboard.showCommandFeedback('matrix', '✅ MATRIX SIMULATION COMPLETE!');
                }
                return;
            }
            
            let line = '';
            for (let i = 0; i < 70; i++) {
                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                const intensity = Math.random();
                const glowIntensity = Math.floor(intensity * 5) + 1;
                line += `<span style="color:#00ff00;font-family:monospace;text-shadow:0 0 ${glowIntensity}0px #00ff00;">${char}</span> `;
            }
            
            terminal.logHtml(`<div style="font-family:monospace; line-height:1.2;">${line}</div>`, 'output');
            lineCount++;
        }, 120);
        
        // Store interval for potential cleanup
        terminal.currentAnimation = matrixInterval;
    },

    // Hacker simulation
    hack: function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('hack', '🏴‍☠️ INITIATING ELITE HACKER SEQUENCE...');
        }
        
        // Clear terminal and show dramatic intro
        terminal.log('', '');
        terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #000, #ff3333); border-radius:15px; margin:10px 0; border:2px solid #ff3333;">', 'output');
        terminal.logHtml('<h2 style="color:#ff3333; text-shadow:0 0 20px #ff3333; margin:0; font-family:monospace;">🏴‍☠️ ELITE HACKER SEQUENCE INITIATED 🏴‍☠️</h2>', 'output');
        terminal.logHtml('</div>', 'output');
        
        terminal.log('🏴‍☠️ Initiating elite hacker sequence...', 'info');
        
        const hackSteps = [
            '🔍 Scanning network for vulnerabilities...',
            '🔓 Bypassing firewall (strength: VERY HIGH)...',
            '💾 Accessing mainframe database...',
            '🔐 Cracking encryption (4096-bit RSA)...',
            '📊 Extracting transaction data...',
            '⚡ Uploading mining virus to the blockchain...',
            '💰 Redirecting all OMEGA tokens to our wallet...',
            '🎭 Covering digital tracks...',
            '🚨 ALERT: Omega Terminal Security detected!',
            '🏃‍♂️ Initiating emergency disconnect...'
        ];
        
        let stepIndex = 0;
        const hackInterval = setInterval(() => {
            if (stepIndex >= hackSteps.length) {
                clearInterval(hackInterval);
                terminal.log('', '');
                terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ff3333, #000); border-radius:15px; margin:10px 0; border:2px solid #ff3333;">', 'output');
                terminal.logHtml('<h2 style="color:#ff3333; text-shadow:0 0 20px #ff3333; margin:0; font-family:monospace;">❌ HACK FAILED ❌</h2>', 'output');
                terminal.logHtml('<p style="color:#ff3333; margin:10px 0;">Just kidding! This terminal is secure! 😄</p>', 'output');
                terminal.logHtml('<p style="color:#ff3333; margin:10px 0;">💡 Remember: Always practice ethical hacking!</p>', 'output');
                terminal.logHtml('</div>', 'output');
                
                // Update futuristic UI feedback
                if (window.FuturisticDashboard) {
                    window.FuturisticDashboard.showCommandFeedback('hack', '✅ HACK SIMULATION COMPLETE!');
                }
                return;
            }
            
            const step = hackSteps[stepIndex];
            const color = stepIndex < 8 ? '#00ff00' : '#ffaa00';
            const glowColor = stepIndex < 8 ? '#00ff00' : '#ffaa00';
            
            terminal.logHtml(`<div style="color:${color}; text-shadow:0 0 10px ${glowColor}; font-family:monospace; padding:5px; background:rgba(0,0,0,0.3); border-left:3px solid ${color}; margin:2px 0;">${step}</div>`, 'output');
            stepIndex++;
        }, 800);
        
        terminal.currentAnimation = hackInterval;
    },

    // Disco mode
    disco: function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('disco', '🕺 DISCO MODE ACTIVATED! 🕺');
        }
        
        // Clear terminal and show dramatic intro
        terminal.log('', '');
        terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff0000); border-radius:15px; margin:10px 0; animation:rainbow 2s infinite;">', 'output');
        terminal.logHtml('<h2 style="color:#fff; text-shadow:0 0 20px #fff; margin:0;">🕺 DISCO MODE ACTIVATED! 🕺</h2>', 'output');
        terminal.logHtml('<p style="color:#fff; margin:10px 0;">💃 Let\'s boogie! 💃</p>', 'output');
        terminal.logHtml('</div>', 'output');
        
        terminal.log('🕺 DISCO MODE ACTIVATED! 🕺', 'success');
        terminal.log('💃 Let\'s boogie! 💃', 'info');
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
        const discoText = ['🕺', '💃', '🎵', '🎶', '✨', '🌟', '💫', '🎉', '🎊', '🌈', '⭐', '🔥'];
        
        let discoCount = 0;
        const maxDisco = 25;
        
        const discoInterval = setInterval(() => {
            if (discoCount >= maxDisco) {
                clearInterval(discoInterval);
                terminal.log('', '');
                terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff0000); border-radius:15px; margin:10px 0;">', 'output');
                terminal.logHtml('<h2 style="color:#fff; text-shadow:0 0 20px #fff; margin:0;">🎉 DISCO MODE COMPLETE! 🎉</h2>', 'output');
                terminal.logHtml('<p style="color:#fff; margin:10px 0;">Thanks for dancing!</p>', 'output');
                terminal.logHtml('</div>', 'output');
                
                // Update futuristic UI feedback
                if (window.FuturisticDashboard) {
                    window.FuturisticDashboard.showCommandFeedback('disco', '✅ DISCO MODE COMPLETE!');
                }
                return;
            }
            
            let line = '';
            for (let i = 0; i < 50; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const char = discoText[Math.floor(Math.random() * discoText.length)];
                const size = Math.random() * 0.5 + 0.8;
                line += `<span style="color:${color};text-shadow:0 0 15px ${color};font-size:${size}em;display:inline-block;transform:rotate(${Math.random() * 20 - 10}deg);">${char}</span> `;
            }
            
            terminal.logHtml(`<div style="text-align:center; padding:10px; background:rgba(0,0,0,0.2); border-radius:10px; margin:5px 0;">${line}</div>`, 'output');
            discoCount++;
        }, 180);
        
        terminal.currentAnimation = discoInterval;
    },

    // Fortune cookie
    fortune: function(terminal) {
        // Add futuristic UI feedback
        if (window.FuturisticDashboard) {
            window.FuturisticDashboard.showCommandFeedback('fortune', '🥠 OPENING FORTUNE COOKIE...');
        }
        
        // Clear terminal and show dramatic intro
        terminal.log('', '');
        terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ffd700, #ff8800); border-radius:15px; margin:10px 0; border:2px solid #ffd700;">', 'output');
        terminal.logHtml('<h2 style="color:#ffd700; text-shadow:0 0 20px #ffd700; margin:0;">🥠 FORTUNE COOKIE PROTOCOL 🥠</h2>', 'output');
        terminal.logHtml('</div>', 'output');
        
        const fortunes = [
            "🔮 Your mining rewards will multiply like rabbits in spring.",
            "🔮 A wise investor once said: 'HODL tight and mine right.'",
            "🔮 The blockchain reveals: great wealth comes to those who mine patiently.",
            "🔮 Your future holds many successful transactions and profitable trades.",
            "🔮 Beware of the paper hands - diamond hands bring diamond rewards.",
            "🔮 The stars align for your next big mining score this week.",
            "🔮 A generous faucet will soon overflow with unexpected tokens.",
            "🔮 Your wallet address will be blessed by the crypto gods.",
            "🔮 Smart contracts favor the bold - make that brave transaction.",
            "🔮 The blockchain whispers: 'Omega Terminal users are destined for greatness.'",
            "🔮 Your private key is safe, but your gains will be very public.",
            "🔮 Gas fees will bow before your transaction prowess.",
            "🔮 A mysterious airdrop approaches your horizon.",
            "🔮 The mining difficulty will decrease just when you need it most.",
            "🔮 Your seed phrase contains the seeds of future prosperity."
        ];
        
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        
        terminal.log('🥠 Opening fortune cookie...', 'info');
        setTimeout(() => {
            terminal.log('✨ Your fortune reveals:', 'info');
            terminal.log('', '');
            terminal.logHtml('<div style="text-align:center; padding:20px; background:linear-gradient(45deg, #ffd700, #ff8800); border-radius:15px; margin:10px 0; border:2px solid #ffd700;">', 'output');
            terminal.logHtml(`<h3 style="color:#ffd700; text-shadow:0 0 20px #ffd700; margin:0; font-style:italic;">${randomFortune}</h3>`, 'output');
            terminal.logHtml('</div>', 'output');
            terminal.log('🥠 May your mining be fruitful and your HODLing strong!', 'info');
            
            // Update futuristic UI feedback
            if (window.FuturisticDashboard) {
                window.FuturisticDashboard.showCommandFeedback('fortune', '✅ FORTUNE REVEALED!');
            }
        }, 1500);
    },

    // Stop animations and activities
    stop: function(terminal) {
        let stoppedActivities = [];
        
        // Stop mining
        if (terminal.isMining) {
            terminal.isMining = false;
            stoppedActivities.push('mining');
        }
        
        // Stop stress testing
        if (terminal.isStressTesting) {
            terminal.isStressTesting = false;
            if (terminal.stressTestInterval) {
                clearInterval(terminal.stressTestInterval);
                terminal.stressTestInterval = null;
            }
            stoppedActivities.push('stress testing');
        }
        
        // Stop animations
        if (terminal.currentAnimation) {
            clearInterval(terminal.currentAnimation);
            terminal.currentAnimation = null;
            stoppedActivities.push('animations');
        }
        
        // Clear disco mode
        document.body.className = '';
        
        if (stoppedActivities.length > 0) {
            terminal.log(`⏹️ Stopped: ${stoppedActivities.join(', ')}`, 'success');
        } else {
            terminal.log('ℹ️ No activities currently running', 'info');
        }
    },

    // ASCII art display
    ascii: function(terminal, args) {
        if (!args || args.length < 2) {
            terminal.log('Available ASCII art: omega, pickaxe, diamond, rocket', 'info');
            terminal.log('Usage: ascii <name>', 'info');
            return;
        }

        const artName = args[1].toLowerCase();
        let art = '';

        switch (artName) {
            case 'omega':
                art = `
     ███████╗███╗   ███╗███████╗ ██████╗  █████╗ 
     ██╔════╝████╗ ████║██╔════╝██╔════╝ ██╔══██╗
     ███████╗██╔████╔██║█████╗  ██║  ███╗███████║
     ╚════██║██║╚██╔╝██║██╔══╝  ██║   ██║██╔══██║
     ███████║██║ ╚═╝ ██║███████╗╚██████╔╝██║  ██║
     ╚══════╝╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝`;
                break;
            case 'pickaxe':
                art = `
        ⚒️    ⛏️     
       /  \\  /  \\   
      /    \\/    \\  
     |      |      | 
     |   ⛏️ MINING ⛏️ |
     |      |      | 
      \\    /\\    /  
       \\__/  \\__/   `;
                break;
            case 'diamond':
                art = `
         💎✨💎
        💎✨💎✨💎
       ✨💎✨💎✨💎✨
        💎✨💎✨💎
         ✨💎✨
          💎`;
                break;
            case 'rocket':
                art = `
           🚀
          /|\\
         / | \\
        🌟 | 🌟
           |
         🔥🔥🔥
        TO THE MOON!`;
                break;
            default:
                terminal.log('❌ Unknown ASCII art: ' + artName, 'error');
                return;
        }

        terminal.log('🎨 Displaying ASCII art:', 'info');
        terminal.logHtml(`<pre style="color:#00ffff;font-family:monospace">${art}</pre>`, 'output');
    },
    
    // Spotify music player
    spotify: async function(terminal, args) {
        const subcommand = args[0]?.toLowerCase();

        if (!subcommand || subcommand === 'open' || subcommand === 'player') {
            if (window.OmegaSpotify) {
                terminal.log('🎵 Opening Spotify player...', 'info');
                await window.OmegaSpotify.openPanel();
            } else {
                terminal.log('❌ Spotify player not loaded', 'error');
            }
            return;
        }

        if (subcommand === 'connect' || subcommand === 'login') {
            terminal.log('🎵 Opening Spotify authentication...', 'info');
            if (window.OmegaSpotify) {
                window.OmegaSpotify.authenticate();
            }
            return;
        }

        if (subcommand === 'disconnect' || subcommand === 'logout') {
            if (window.OmegaSpotify) {
                window.OmegaSpotify.logout();
                terminal.log('✅ Disconnected from Spotify', 'success');
            }
            return;
        }

        if (subcommand === 'close') {
            if (window.OmegaSpotify) {
                window.OmegaSpotify.closePanel();
                terminal.log('✅ Spotify player closed', 'success');
            }
            return;
        }

        if (subcommand === 'play') {
            if (window.OmegaSpotify) {
                await window.OmegaSpotify.togglePlay();
                terminal.log('▶️  Playback toggled', 'success');
            }
            return;
        }

        if (subcommand === 'next') {
            if (window.OmegaSpotify) {
                await window.OmegaSpotify.nextTrack();
                terminal.log('⏭️  Next track', 'success');
            }
            return;
        }

        if (subcommand === 'prev' || subcommand === 'previous') {
            if (window.OmegaSpotify) {
                await window.OmegaSpotify.previousTrack();
                terminal.log('⏮️  Previous track', 'success');
            }
            return;
        }

        if (subcommand === 'search') {
            const query = args.slice(1).join(' ');
            if (!query) {
                terminal.log('❌ Usage: spotify search <query>', 'error');
                return;
            }
            
            terminal.log(`🔍 Searching for: ${query}`, 'info');
            if (window.OmegaSpotify) {
                await window.OmegaSpotify.openPanel();
                setTimeout(() => {
                    window.OmegaSpotify.performSearch(query);
                }, 500);
            }
            return;
        }

        if (subcommand === 'help') {
            terminal.log('🎵 Spotify Player Commands', 'info');
            terminal.log('');
            terminal.log('spotify [open]         - Open Spotify player');
            terminal.log('spotify connect        - Connect to Spotify');
            terminal.log('spotify disconnect     - Disconnect');
            terminal.log('spotify play          - Toggle play/pause');
            terminal.log('spotify next          - Next track');
            terminal.log('spotify prev          - Previous track');
            terminal.log('spotify search <query> - Search music');
            terminal.log('spotify close         - Close player');
            terminal.log('');
            terminal.log('📝 Setup Instructions:', 'warning');
            terminal.log('1. Go to https://developer.spotify.com/dashboard', 'output');
            terminal.log('2. Create a new app (name: "Omega Terminal")', 'output');
            terminal.log('3. Add redirect URI: ' + window.location.origin + '/pages/spotify-callback.html', 'output');
            terminal.log('4. Copy your Client ID', 'output');
            terminal.log('5. Edit js/plugins/omega-spotify-player.js (line 12)', 'output');
            terminal.log('6. Replace YOUR_SPOTIFY_CLIENT_ID with your actual ID', 'output');
            terminal.log('7. Reload page and run: spotify connect', 'output');
            terminal.log('');
            terminal.log('🎧 Listen to music while coding!', 'success');
            return;
        }

        terminal.log('❌ Unknown command. Type "spotify help"', 'error');
    }
}; 