# P2P Chatter Lite - Installation & Launch Guide

## Overview

**P2P Chatter Lite** is a lightweight, privacy-focused peer-to-peer messaging application with a beautiful Matrix green theme and intuitive interface.

- **Version**: 1.0.0
- **Platform**: Windows
- **Framework**: Electron + Node.js
- **License**: MIT

## System Requirements

- Windows 7 or later
- Node.js 18+ (for npm/development)
- npm (comes with Node.js)

## Installation Methods

### Method 1: Desktop Shortcut (Recommended)

1. **Run the launcher file directly**:
   - Double-click `Launch P2P Chatter Lite.bat`
   - The application will start immediately
   - No installation required!

### Method 2: Manual Installation

1. **Run the installer**:
   - Double-click `Install.bat`
   - Follow the on-screen prompts
   - Desktop and Start Menu shortcuts will be created

2. **Launch from shortcut**:
   - Click the desktop shortcut "P2P Chatter Lite"
   - Or search "P2P Chatter Lite" in Windows Start Menu

### Method 3: Development Mode

1. **Run with developer tools**:
   - Double-click `Launch P2P Chatter Lite (Dev Mode).bat`
   - Developer tools will open automatically for debugging

### Method 4: Command Line

```bash
# Navigate to application directory
cd "C:\path\to\p2p-chatter-lite"

# Launch application
npm start

# Or launch in dev mode
npm run dev
```

## Usage

### Starting a Chat Session

1. **Enter your username** in the input field
2. **Click "Start Chat"** to initialize
3. **Enter peer's address** (IP or hostname) and username
4. **Click "Connect"** to establish connection
5. **Send messages** using the message input area
6. Press **Enter** or click **Send** button to send

### Features

- **Real-time messaging**: Send messages instantly to connected peers
- **Settings**: Customize your experience
- **About**: View application information and version
- **Desktop shortcuts**: Easy access from desktop or Start Menu
- **Dark theme**: Matrix green styled interface for comfortable viewing

## Shortcuts

- **Ctrl+Q**: Quit application
- **Enter**: Send message while in message input
- **Esc**: Close modals/dialogs

## Uninstallation

To remove the application:

1. Double-click `Uninstall.bat`
2. Confirm the uninstall when prompted
3. Application and shortcuts will be removed

**Note**: To keep your files safe, the uninstaller only removes:
- Shortcuts (Desktop + Start Menu)
- Installation directory in Program Files

If you installed manually, just delete the folder.

## Troubleshooting

### Application won't start

- **Ensure Node.js is installed**: Download from https://nodejs.org/
- **Check npm installation**: Open Command Prompt and type `npm -v`
- **Verify file permissions**: Run installer as Administrator

### Can't connect to peer

- Verify the peer's IP address or hostname
- Ensure both computers are on the same network
- Check firewall settings if on different networks
- Try using IP address instead of hostname

### Window not displaying

- Try closing and reopening the application
- If using dev mode, check console for errors (F12)
- Ensure your graphics drivers are up to date

## Support

For issues or questions:
1. Check TEST_RESULTS.txt for feature verification
2. Review the About section in the app
3. Check console output when running in dev mode

## Development

To contribute or modify:

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build executable
npm run build-win
```

For more details, see the project structure and README.md files.

## License

MIT License - See LICENSE file for details

---

**P2P Chatter Lite v1.0.0** © 2024 - Privacy-Focused Messaging
