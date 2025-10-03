// Entertainment Commands Module
window.OmegaCommands = window.OmegaCommands || {};

window.OmegaCommands.Entertainment = {
    // Rick roll command
    rickroll: function(terminal) {
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
        terminal.log('🔰 Initializing Matrix simulation...', 'info');
        
        const matrixChars = ['0', '1', 'Ω', '⛏️', '🔰', '💎', '⚡'];
        let lineCount = 0;
        const maxLines = 15;
        
        const matrixInterval = setInterval(() => {
            if (lineCount >= maxLines) {
                clearInterval(matrixInterval);
                terminal.log('🔰 Matrix simulation complete. Welcome to the real world.', 'success');
                return;
            }
            
            let line = '';
            for (let i = 0; i < 60; i++) {
                line += matrixChars[Math.floor(Math.random() * matrixChars.length)] + ' ';
            }
            
            terminal.logHtml(`<span style="color:#00ff00;font-family:monospace">${line}</span>`, 'output');
            lineCount++;
        }, 150);
        
        // Store interval for potential cleanup
        terminal.currentAnimation = matrixInterval;
    },

    // Hacker simulation
    hack: function(terminal) {
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
                terminal.logHtml('<span style="color:#ff3333">❌ HACK FAILED: Just kidding! This terminal is secure! 😄</span>', 'error');
                terminal.log('💡 Remember: Always practice ethical hacking!', 'info');
                return;
            }
            
            terminal.log(hackSteps[stepIndex], stepIndex < 8 ? 'info' : 'warning');
            stepIndex++;
        }, 800);
        
        terminal.currentAnimation = hackInterval;
    },

    // Disco mode
    disco: function(terminal) {
        terminal.log('🕺 DISCO MODE ACTIVATED! 🕺', 'success');
        terminal.log('💃 Let\'s boogie! 💃', 'info');
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const discoText = ['🕺', '💃', '🎵', '🎶', '✨', '🌟', '💫', '🎉'];
        
        let discoCount = 0;
        const maxDisco = 20;
        
        const discoInterval = setInterval(() => {
            if (discoCount >= maxDisco) {
                clearInterval(discoInterval);
                terminal.log('🎉 Disco mode complete! Thanks for dancing!', 'success');
                return;
            }
            
            let line = '';
            for (let i = 0; i < 40; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const char = discoText[Math.floor(Math.random() * discoText.length)];
                line += `<span style="color:${color}">${char}</span> `;
            }
            
            terminal.logHtml(line, 'output');
            discoCount++;
        }, 200);
        
        terminal.currentAnimation = discoInterval;
    },

    // Fortune cookie
    fortune: function(terminal) {
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
            terminal.logHtml(`<span style="color:#ffd700;font-style:italic">${randomFortune}</span>`, 'success');
            terminal.log('🥠 May your mining be fruitful and your HODLing strong!', 'info');
        }, 1000);
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
    }
}; 