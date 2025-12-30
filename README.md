# P2P Chatter Lite 🏴‍☠️

**Privacy-Focused • Decentralized • Lightweight Peer-to-Peer Messaging**

A minimal, fast, and secure peer-to-peer messaging application with end-to-end encryption, Tor support, and multiple hacker themes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%2064bit-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### 🔐 Security & Privacy
- 🔐 **AES-256-GCM End-to-End Encryption** - Military-grade encryption
- 🧅 **Tor Integration** - Route through Tor network for anonymity
- 🕵️ **OPSEC Features** - Anonymous mode, screenshot detection, text scrambling
- 📸 **Screenshot Detection** - Alerts when PrintScreen is pressed
- 💬 **Text Scrambling** - Blur effect when copying sensitive text

### ⚡ Performance
- **Fast Startup**: Launches in under 2 seconds
- **Lightweight**: ~50MB portable executable
- **Low Memory**: Minimal RAM footprint
- **Optimized Code**: Streamlined for speed

### 🎨 Themes & UI
- **6 Color Themes**: Matrix Green, Cyberpunk, Terminal Amber, Hacker Red, Dark Web, Neon Void
- **Discord-Like Interface**: Compact, modern design
- **Clean Aesthetics**: Professional hacker aesthetic
- **Smooth Animations**: Theme switching animations

### 💬 Messaging
- 👤 **Auto-Generated Usernames** - Funny names like P2P-LaughingLlama
- 🔑 **Password Authentication** - Secure peer connection
- ✅ **Read Receipts** - Know when messages are seen
- ✍️ **Typing Indicators** - See when peer is typing
- 👍 **Reactions** - React with emojis
- 📌 **Pin Messages** - Important message management
- 🔊 **Sound Notifications** - Audio alerts

## 🚀 Getting Started

### Installation

#### Windows (Fastest)
1. Download: `P2P-Chatter-Lite-v1.0.0.zip`
2. Extract files
3. Run: `P2P Chatter Lite 1.0.0.exe`
4. Or use desktop shortcut (skull 🏴‍☠️ icon)

git clone https://github.com/bad-antics/p2p-chatter-lite.git
cd p2p-chatter-lite
npm install
npm start
```

### System Requirements
- **OS:** Windows 10/11 (64-bit) or later
- **RAM:** 500MB minimum
- **Storage:** ~70MB for installation

## 📖 Setup Guide

### 1. Generate Username
- **Auto-generated** with format `P2P-[FunnyName]`
- Examples: `P2P-LaughingLlama`, `P2P-SpeedyTiger`, `P2P-CrazyWombat`
- Click 🔄 to regenerate, 📋 to copy

### 2. Connection Setup
- **Your Username:** Auto-generated
- **Peer Username:** Enter who you want to chat with
- **Connection Password:** Share outside the app with peer

### 3. Enable Security
- **🔐 Encryption Toggle** - Enable AES-256-GCM encryption
  - Flashing red = OFF
  - Flashing blue = ON
- **🧅 Tor Toggle** - Route through Tor network
  - Purple glow = Active

### 4. Themes & Options
Click **"🎨 Themes & Options ▼"** to:
- **Switch Themes:**
  - Matrix Green (default)
  - Cyberpunk (pink/cyan)
  - Terminal Amber (retro)
  - Hacker Red (intense)
  - Dark Web (purple/orange)
  - Neon Void (cyan/blue)
- **Chat Options:**
  - ☑ Read Receipts
  - ☑ Typing Indicators
  - ☑ Message Reactions
  - ☑ Pin Messages
  - ☑ Sound Notifications

## 🎨 Themes Gallery

| Theme | Colors | Vibe |
|-------|--------|------|
| **Matrix Green** | Green/Black | Classic hacker |
| **Cyberpunk** | Pink/Cyan | Neon future |
| **Terminal Amber** | Amber/Orange | Retro computing |
| **Hacker Red** | Red/Black | Intense & bold |
| **Dark Web** | Purple/Orange | Mysterious |
| **Neon Void** | Cyan/Blue | Digital void |

## 🔐 Security & Privacy

### End-to-End Encryption
- **AES-256-GCM** military-grade encryption
- **No servers** - Messages never leave your device
- **No accounts** - No registration required
- **No tracking** - Complete anonymity

### OPSEC Status Indicator
Real-time display showing:
- **Encryption:** ON (blue) / OFF (red)
- **Tor:** ON (blue) / OFF (red)
- **Security Level:** LOW / MEDIUM / HIGH

### Privacy Features
- **Screenshot Detection** - Alerts on PrintScreen
- **Text Scrambling** - Blur effect when copying
- **No Logs** - Ephemeral message mode available
- **Local Storage Only** - Messages stay on device

## 🏗️ Project Structure

```
p2p-chatter-lite/
├── main.js              # Electron main process
├── preload.js           # IPC security layer
├── package.json         # Dependencies
├── src/
│   ├── index.html       # Main UI
│   ├── app.js           # 675+ lines of logic
│   ├── styles.css       # 1000+ lines, 6 themes
│   └── app.ico          # Skull & crossbones icon
└── dist/
    └── P2P Chatter Lite 1.0.0.exe (67.9 MB)
```

## 🚀 Building from Source

### Prerequisites
```bash
- Node.js 16+
- npm 8+
- Windows 10/11 (64-bit)
```

### Build Steps
```bash
git clone https://github.com/bad-antics/p2p-chatter-lite.git
cd p2p-chatter-lite
npm install
npm run build-win        # Create Windows executable
npm start               # Development mode
```

## 🛠️ Development

### Dev Mode
```bash
npm install
npm start
```

### Build Executable
```bash
npm run build-win
```

Output: `dist/P2P Chatter Lite 1.0.0.exe`

## 📋 Features Checklist

### Security ✅
- ✅ AES-256-GCM Encryption
- ✅ Tor Integration
- ✅ Screenshot Detection
- ✅ Text Scrambling
- ✅ OPSEC Indicators

### Messaging ✅
- ✅ P2P Direct Connection
- ✅ Auto-Generated Usernames
- ✅ Password Authentication
- ✅ Read Receipts
- ✅ Typing Indicators
- ✅ Message Reactions
- ✅ Pin Messages
- ✅ Sound Notifications

### UI ✅
- ✅ 6 Color Themes
- ✅ Discord-Like Compact Design
- ✅ Dark Mode Only
- ✅ Modern Fonts (Segoe UI)
- ✅ Smooth Animations
- ✅ Dropdown Menu System

### Installation ✅
- ✅ Portable Executable
- ✅ Desktop Shortcut (with skull icon)
- ✅ Custom Branding
- ✅ Open Source

## 🎓 Getting Started

### Quick Launch
1. Download `P2P-Chatter-Lite-v1.0.0.zip`
2. Extract ZIP
3. Double-click `P2P Chatter Lite 1.0.0.exe`
4. Or use Desktop shortcut

### First Chat
1. Copy your username (📋 button)
2. Share with peer via secure channel
3. Peer enters their username
4. Exchange connection password (outside app)
5. Enable encryption (🔐)
6. Start chatting!

## 🐛 Troubleshooting

### App won't start
```
- Windows Defender may be blocking (add exception)
- Try --disable-gpu flag
- Ensure 500MB+ RAM available
```

### Can't connect to peer
```
- Verify same connection password
- Both users must have app running
- Check Firewall settings
```

### Tor not working
```
- Ensure internet connection
- Tor may take 10-15 seconds
- Check Windows Firewall
- Restart app and try again
```

## 📞 Support & Issues

Found a bug? Have a feature request?
- **Issues:** [GitHub Issues](https://github.com/bad-antics/p2p-chatter-lite/issues)
- **Discussions:** [GitHub Discussions](https://github.com/bad-antics/p2p-chatter-lite/discussions)

## ⚠️ Disclaimer

- Not audited by security experts
- Hobby project for learning
- For non-critical communications
- Always verify peer identity separately
- Use established messengers for sensitive operations

## 📝 License

**MIT License** - Free to use, modify, distribute

See [LICENSE](LICENSE) for full text

## 👤 Authors

**bad-antics / antX** - Privacy advocate, open-source developer

## 🏆 cr3dz

Special recognition to:
- **FairyRos3** - UI/UX design & user experience
- **sleep** - Inspiration & security guidance
- **no.login** - P2P architecture & decentralization principles

## �🗺️ Roadmap

- [ ] Linux/macOS support
- [ ] Mobile apps (iOS/Android)
- [ ] Group messaging
- [ ] File transfer
- [ ] Voice/video calls
- [ ] Message search/history
- [ ] Backup & restore
- [ ] Hardware security key support

---

**P2P Chatter Lite**  
*Privacy • Anonymity • Freedom* 🏴‍☠️

Made with ❤️ for those who value privacy

Privacy. Anonymity. Freedom.
