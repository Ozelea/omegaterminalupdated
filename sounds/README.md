# Omega Terminal Sound Effects

This directory contains MP4 audio files for the Omega Terminal sound effects system.

## Required Sound Files

The following sound files should be placed in this directory:

- `wookie.mp4.mp3` - Sound played when user selects Dashboard interface option - Wookie sound
- `robot-gmb.mp3` - Sound played when user successfully connects any wallet (NEAR, MetaMask, etc.)
- `i-am-a-robot.mp3` - Sound played when user toggles AI on (NEAR AI or OpenAI) - Robot sound (plays to natural end)
- `so-you-rich.mp3` - Sound played when user checks balance, tracks portfolio, or opens chart viewer (balance command, pgt track command, chart command) - Wealth sound (plays to natural end)
- `oh-fucking.mp3` - Sound played when user selects Basic Terminal interface in welcome screen - Basic view sound (plays to natural end)
- `you-cocky.mp3` - Sound played when user clears the terminal (clear command) - Clear terminal sound (plays to natural end)
- `grandmas-boy.mp3` - Sound played when user selects modern UI theme (theme modern, theme apple, theme modern-ui) or calls help command - Modern UI theme and help sound (plays to natural end)
- `button-click.mp4` - General button click feedback sound
- `command-execute.mp4` - Sound for command execution
- `system-notify.mp4` - System notification sound
- `error.mp4` - Error notification sound
- `success.mp4` - Success confirmation sound

## Sound File Specifications

- **Format**: MP4 (H.264 video with AAC audio)
- **Duration**: 0.5-2 seconds recommended
- **Volume**: Normalized to prevent clipping
- **Sample Rate**: 44.1kHz or 48kHz
- **Bitrate**: 128kbps or higher for good quality

## Adding Custom Sounds

To add custom sound effects:

1. Create your MP4 file following the specifications above
2. Place it in this `sounds/` directory
3. Register it in the sound effects system using:
   ```javascript
   window.OmegaSoundEffects.registerSound('custom-sound', {
       src: 'sounds/custom-sound.mp4',
       volume: 0.7,
       duration: 1000,
       description: 'Custom sound effect'
   });
   ```

## Testing Sounds

You can test sounds in the browser console:
```javascript
// Play a specific sound
window.OmegaSoundEffects.playSound('interface-select');

// Check if sounds are enabled
window.OmegaSoundEffects.isSoundEnabled();

// List all registered sounds
window.OmegaSoundEffects.getRegisteredSounds();
```
