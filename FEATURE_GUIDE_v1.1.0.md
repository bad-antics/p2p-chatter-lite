# P2P Chatter Lite v1.1.0 - Quick Feature Guide

## 🎯 New Features at a Glance

### 1. Auto-Generated Username & Password 🎲
**What it does**: When you open the app, it automatically generates:
- A fun username like "P2P-SpeedyPhoenix" 
- A 16-character random password for peer connections

**Where to find it**:
- Username displays in the "Your Username" field
- Password auto-fills in the "Share Password" field (read-only)

**Code Location**: `src/app.js` - Lines 34-36 (initialization), Lines 195-203 (generateRandomPassword function)

---

### 2. Enhanced Encryption Button 🔐
**What it does**: Toggles encryption on/off with visual feedback

**Visual Effects When ON**:
- Button glows RED (#ff3333)
- Notification: "🔐 Encryption ENABLED"
- Box-shadow glow effect

**Visual Effects When OFF**:
- Button returns to normal
- Notification: "🔓 Encryption DISABLED"

**Code Location**: `src/app.js` - Lines 500-520 (toggleEncryption function)

---

### 3. Enhanced Tor Button 🧅
**What it does**: Toggles Tor routing on/off with visual feedback

**Visual Effects When ON**:
- Button glows BLUE (#0066cc)
- Status text changes to "ON" with green color
- Notification: "🧅 Tor ENABLED - Routing through Tor network"
- torSettings.enabled = true

**Visual Effects When OFF**:
- Button returns to normal
- Status text changes to "OFF" with red color
- Notification: "🧅 Tor DISABLED"

**Code Location**: `src/app.js` - Lines 523-556 (toggleTor function)

---

### 4. Network Manager Modal 🌐
**How to Access**: Click the "Network Manager" button in the network monitoring panel

**Tor Settings Section**:
- Enable/Disable Tor checkbox
- Select Exit Node (Auto, US, EU, Asia, Custom)
- Configure Circuit Timeout (1000-60000ms)
- Add Bridge Addresses (for censorship circumvention)
- Shows current Tor status

**VPN Settings Section**:
- Enable/Disable VPN checkbox
- Select VPN Provider (ExpressVPN, NordVPN, Mullvad, ProtonVPN, Custom)
- Choose Protocol (OpenVPN, WireGuard, IPSec, IKEv2)
- Select Location (Auto, US, UK, EU, Asia)
- Shows current VPN status

**Actions**:
- **Apply Settings**: Saves all Tor & VPN configuration to localStorage
- **Test Connection**: Tests current network connectivity and shows latency
- **Close**: Dismisses the modal

**Code Location**: `src/app.js` - Lines 410-555 (showNetworkManager function)

---

### 5. Dropdown Menus 📂
**What it does**: Shows available settings and options when clicked

**Features**:
- Click menu button to toggle visibility
- Click outside to close automatically
- Smooth animations
- Integrates with theme switcher

**Code Location**: `src/app.js` - setupThemeSwitcher(), initializeAllDropdowns()

---

## 🔧 Configuration Storage

All settings are saved to **localStorage** with these keys:
```javascript
// Tor Settings
localStorage.setItem('torSettings', JSON.stringify(torSettings))

// VPN Settings
localStorage.setItem('vpnSettings', JSON.stringify(vpnSettings))

// Encryption State
localStorage.setItem('encryptionEnabled', encryptionEnabled)

// Tor State
localStorage.setItem('torEnabled', torEnabled)
```

---

## 🎮 Usage Examples

### Enabling Tor with Custom Settings
1. Click "Network Manager" button
2. Check "Enable Tor" checkbox
3. Select "Custom" from Exit Node dropdown
4. Add bridge addresses if needed
5. Click "Apply Settings"
6. Status updates to "🟢 ACTIVE"

### Testing Network Connection
1. Open Network Manager
2. Configure Tor/VPN as needed
3. Click "Test Connection" button
4. Wait 2 seconds for results
5. View latency and status information

### Changing Encryption Status
1. Click the Encryption button (shows current state)
2. Button glows RED when encryption is ON
3. Button returns to normal when OFF
4. Notification appears confirming the change

---

## 📊 Global Variables Added

```javascript
let currentSharePassword = '';      // Auto-generated on startup
let torSettings = {
  enabled: false,                   // Toggle Tor
  exitNode: 'auto',                // Where to exit from Tor network
  bridges: [],                      // Tor bridges for censorship bypass
  circuitTimeout: 10000             // Circuit timeout in milliseconds
};
let vpnSettings = {
  enabled: false,                   // Toggle VPN
  provider: 'none',                // Which VPN provider to use
  protocol: 'none',                // VPN protocol
  location: 'auto'                 // VPN server location
};
```

---

## 🚀 Initialization Flow

When you open the app:
1. ✅ Random username generated (e.g., "P2P-BrightOtter")
2. ✅ Random password generated (16 characters)
3. ✅ Form fields populated with values
4. ✅ Event listeners attached to buttons
5. ✅ Dropdown menus initialized
6. ✅ Network monitoring started
7. ✅ Settings loaded from localStorage

---

## 🔐 Security Notes

- **Password Field**: Read-only (prevents accidental modification)
- **Tor Bridges**: Essential for accessing Tor in restricted regions
- **Circuit Timeout**: Higher values = more secure but slower
- **VPN + Tor**: Can use together for maximum privacy (but may be slower)
- **Connection Test**: Shows latency to help optimize settings

---

## 📝 Browser Console Commands (Dev Mode)

```javascript
// Check current username
console.log(currentUsername);

// Check current password
console.log(currentSharePassword);

// Check encryption status
console.log(encryptionEnabled);

// Check Tor status
console.log(torEnabled);

// Check all Tor settings
console.log(torSettings);

// Check all VPN settings
console.log(vpnSettings);

// Manually save settings
localStorage.setItem('torSettings', JSON.stringify(torSettings));
localStorage.setItem('vpnSettings', JSON.stringify(vpnSettings));
```

---

## 🆘 Troubleshooting

### Button not showing visual feedback?
- Check browser console for errors
- Ensure CSS includes glow effects
- Verify button ID matches HTML element

### Settings not saving?
- Check localStorage availability (not in private/incognito mode)
- Open DevTools > Application > LocalStorage
- Verify JSON format is correct

### Network Manager won't open?
- Ensure networkManagerBtn element exists in HTML
- Check browser console for errors
- Try clicking "Network Monitor" toggle first

### Password field showing wrong value?
- Refresh the page (it regenerates on each session)
- Check localStorage for saved values
- Password is auto-generated, don't edit manually

---

## 📞 Support

For issues or questions:
1. Check the CHANGELOG_LATEST.md for detailed changes
2. Review browser console (F12) for error messages
3. Verify all HTML element IDs match the JavaScript code
4. Ensure no conflicting JavaScript is running

---

**Version**: 1.1.0
**Last Updated**: December 29, 2025
**Status**: ✅ All Features Implemented and Tested
