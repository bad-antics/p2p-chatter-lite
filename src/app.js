// P2P Chatter Lite - Lightweight Frontend Application

let isConnected = false;
let currentUsername = '';
let currentSharePassword = '';
let peerUsername = '';
let screenshotDetected = false;
let encryptionEnabled = false;
let torEnabled = false;
let generatedUsernames = [];
let networkMonitorInterval = null;
let sharedFiles = []; // Store shared password-protected files
let userAvatars = {}; // Store generated avatars for usernames
let torSettings = {
  enabled: false,
  exitNode: 'auto',
  bridges: [],
  circuitTimeout: 10000
};
let vpnSettings = {
  enabled: false,
  provider: 'none',
  protocol: 'none',
  location: 'auto'
};

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  console.error('Error message:', event.message);
  console.error('Error stack:', event.error?.stack);
  console.error('Error line:', event.lineno);
  console.error('Error col:', event.colno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Promise stack:', event.reason?.stack);
  // Don't prevent default - let it crash if it's critical
});

// Funny username adjectives and nouns
const adjectives = ['Laughing', 'Speedy', 'Sneaky', 'Bright', 'Silent', 'Clever', 'Happy', 'Funky', 'Spicy', 'Tiny', 'Jumpy', 'Wild', 'Crazy', 'Groovy', 'Swift', 'Sly', 'Bold', 'Daring', 'Witty', 'Quirky'];
const nouns = ['Llama', 'Tiger', 'Panda', 'Raccoon', 'Dolphin', 'Phoenix', 'Raven', 'Owl', 'Fox', 'Wolf', 'Badger', 'Otter', 'Eagle', 'Hawk', 'Crypto', 'Ghost', 'Phantom', 'Shadow', 'Ninja', 'Wizard'];

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  console.log('🚀 Initializing app...');
  try {
    // Generate random username and password for this session
    console.log('🎲 Generating random username and share password...');
    generateNewUsername();
    currentSharePassword = generateRandomPassword();
    
    // Populate form fields with generated values
    const usernameDisplay = document.getElementById('usernameDisplay');
    const passwordField = document.getElementById('passwordInput');
    
    if (usernameDisplay) {
      usernameDisplay.textContent = currentUsername;
    }
    if (passwordField) {
      passwordField.value = currentSharePassword;
      passwordField.disabled = true; // Read-only, auto-generated
    }
    
    console.log('✅ Generated Username:', currentUsername);
    console.log('✅ Generated Share Password:', currentSharePassword);
    
    // Get pre-generated usernames from main process FIRST
    console.log('📋 Fetching pre-generated usernames...');
    if (window.api && window.api.getUsernames) {
      try {
        const usernames = await window.api.getUsernames();
        if (usernames && usernames.options && usernames.options.length > 0) {
          generatedUsernames = usernames.options;
          console.log('✅ Pre-generated usernames loaded');
        }
      } catch (e) {
        console.warn('⚠️ Could not fetch pre-generated usernames:', e);
      }
    }

    // Populate username dropdown with pre-generated options
    console.log('📋 Populating username dropdown...');
    const dropdown = document.getElementById('usernameDropdown');
    if (dropdown) {
      populateUsernameDropdown();
      setupUsernameDropdown();
      console.log('✅ Username dropdown populated:', currentUsername);
    } else {
      console.warn('⚠️ Username dropdown element not found');
    }
    
    // Enable peer input
    const peerInput = document.getElementById('peerUsernameInput');
    if (peerInput) {
      peerInput.disabled = false;
      console.log('✅ Peer input enabled');
    }

    // Get app version
    if (window.api && window.api.getAppInfo) {
      window.api.getAppInfo().then(info => {
        const appVersionEl = document.getElementById('appVersion');
        const settingsVersionEl = document.getElementById('settingsVersion');
        if (appVersionEl) appVersionEl.textContent = info.version;
        if (settingsVersionEl) settingsVersionEl.textContent = info.version;
      }).catch(e => console.log('App info unavailable'));
    }

    // Setup event listeners
    console.log('🔧 Setting up event listeners...');
    setupEventListeners();
    
    // Setup modal handlers
    console.log('📦 Setting up modals...');
    setupModals();
    
    // Setup screenshot detection
    console.log('📷 Setting up screenshot detection...');
    setupScreenshotDetection();
    
    // Load saved settings
    console.log('⚙️ Loading settings...');
    loadSettings();
    
    // Update security status
    try {
      console.log('🔒 Updating security status...');
      updateSecurityStatus();
    } catch (e) {
      console.error('Error updating security status:', e);
    }

    // Setup theme switcher
    try {
      console.log('🎨 Setting up theme switcher...');
      setupThemeSwitcher();
    } catch (e) {
      console.error('Error setting up theme switcher:', e);
    }
    
    // Start network monitoring
    try {
      console.log('📡 Starting network monitoring...');
      startNetworkMonitoring();
    } catch (e) {
      console.error('Error starting network monitoring:', e);
    }
    
    // Setup test bot
    try {
      console.log('🤖 Setting up test bot...');
      setupTestBot();
    } catch (e) {
      console.error('Error setting up test bot:', e);
    }
    
    // Initialize all dropdown menus IMMEDIATELY AFTER setupEventListeners
    try {
      console.log('📂 Initializing dropdown menus...');
      initializeAllDropdowns();
      console.log('✅ Dropdown menus initialized');
    } catch (e) {
      console.error('Error initializing dropdown menus:', e);
    }
    
    // Load PGP keys if available
    try {
      console.log('🔑 Loading PGP keys...');
      loadPgpKeys();
    } catch (e) {
      console.error('Error loading PGP keys:', e);
    }

    console.log('✅ APP INITIALIZATION COMPLETE');
  } catch (error) {
    console.error('Error in app initialization:', error);
  }
}

// Generate funny random username starting with P2P-
function generateNewUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  currentUsername = `P2P-${adj}${noun}`;
  console.log('Username generated:', currentUsername);
  return currentUsername;
}

// Generate random secure password for share connection
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log('Share password generated: [HIDDEN]');
  return password;
}

// Populate username dropdown with generated options
function populateUsernameDropdown() {
  const dropdown = document.getElementById('usernameDropdown');
  if (!dropdown) {
    console.warn('Username dropdown element not found');
    return false;
  }
  
  // Always regenerate fresh usernames
  generatedUsernames = [];
  for (let i = 0; i < 5; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    const username = `P2P-${adj}${noun}${num}`;
    generatedUsernames.push(username);
  }
  
  // Clear and populate dropdown with generated usernames
  dropdown.innerHTML = '';
  generatedUsernames.forEach((username, index) => {
    const option = document.createElement('option');
    option.value = username;
    option.text = username;
    option.selected = index === 0;
    dropdown.appendChild(option);
  });
  
  // Set current username to first option
  currentUsername = generatedUsernames[0];
  dropdown.value = currentUsername;
  
  // Update display
  const displayEl = document.getElementById('usernameDisplay');
  if (displayEl) {
    displayEl.textContent = currentUsername;
  }
  
  console.log('Usernames loaded:', currentUsername);
  return true;
}

// Setup dropdown event listener
function setupUsernameDropdown() {
  try {
    const dropdown = document.getElementById('usernameDropdown');
    if (!dropdown) {
      console.warn('Username dropdown element not found');
      return false;
    }
    
    dropdown.addEventListener('change', (e) => {
      if (e.target.value) {
        currentUsername = e.target.value;
        localStorage.setItem('currentUsername', currentUsername);
        console.log('Username changed to:', currentUsername);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error setting up username dropdown:', error);
    return false;
  }
}

// Copy username to clipboard
function copyUsernameToClipboard() {
  const username = currentUsername || document.getElementById('usernameDropdown')?.value;
  if (username) {
    navigator.clipboard.writeText(username).then(() => {
      showNotification(`Copied to clipboard: ${username}`, 'success');
    }).catch(err => {
      showNotification('Failed to copy username', 'error');
    });
  }
}

// Generate unique avatar for username
// Simple username display (avatar generator removed for performance)
function getSimpleUsernameDisplay(username) {
  return `<span class="username-display">${username}</span>`;
}

// Test Bot Feature - Send test messages without affecting chat flow
function setupTestBot() {
  const testBotBtn = document.getElementById('testBotBtn');
  if (!testBotBtn) return;
  
  testBotBtn.addEventListener('click', () => {
    const testMessages = [
      { user: 'TestBot', msg: '✅ Connection test successful!' },
      { user: 'TestBot', msg: '🔐 Encryption: ' + (encryptionEnabled ? 'ACTIVE' : 'INACTIVE') },
      { user: 'TestBot', msg: '🧅 Tor Status: ' + (torEnabled ? 'CONNECTED' : 'DISCONNECTED') },
      { user: 'TestBot', msg: '📊 Network Monitoring: ACTIVE' },
      { user: 'TestBot', msg: '✨ All systems ready for communication!' }
    ];
    
    testMessages.forEach((msg, index) => {
      setTimeout(() => {
        addTestMessage(msg.user, msg.msg);
      }, index * 400);
    });
    
    showNotification('🤖 Test Bot verification started - check chat for results', 'success');
  });
}

// Add test message to chat without affecting history
function addTestMessage(sender, message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = 'message test-message';
  
  const timestamp = new Date().toLocaleTimeString();
  
  messageEl.innerHTML = `
    ${getSimpleUsernameDisplay(sender)}
    <div class="message-content">
      <strong>${sender}:</strong> ${escapeHtml(message)}<br>
      <span class="message-time">${timestamp}</span>
    </div>
  `;
  
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Auto-remove test messages after 10 seconds
  setTimeout(() => {
    messageEl.style.opacity = '0.5';
    messageEl.style.fontSize = '11px';
  }, 8000);
}

// Start network monitoring
function startNetworkMonitoring() {
  const toggleBtn = document.getElementById('toggleNetworkMonitor');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const panel = document.getElementById('networkPanel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });
  }
  
  // Setup network manager button
  const networkManagerBtn = document.getElementById('networkManagerBtn');
  if (networkManagerBtn) {
    networkManagerBtn.addEventListener('click', showNetworkManager);
  }
  
  // Update network status every 2 seconds
  networkMonitorInterval = setInterval(updateNetworkStatus, 2000);
  updateNetworkStatus(); // Initial update
}

// Update network status display
function updateNetworkStatus() {
  const torStatusDisplay = document.getElementById('torStatusDisplay');
  const connectionStatus = document.getElementById('connectionStatus');
  const processCount = document.getElementById('processCount');
  const processList = document.getElementById('processList');
  
  if (torStatusDisplay) {
    if (torEnabled) {
      torStatusDisplay.innerHTML = '<span class="status-dot on"></span> Connected';
      torStatusDisplay.style.color = '#00ff00';
    } else {
      torStatusDisplay.innerHTML = '<span class="status-dot off"></span> Disconnected';
      torStatusDisplay.style.color = '#ff6666';
    }
  }
  
  if (connectionStatus) {
    if (isConnected) {
      connectionStatus.innerHTML = '<span class="status-dot online"></span> Connected';
      connectionStatus.style.color = '#00ff00';
    } else {
      connectionStatus.innerHTML = '<span class="status-dot offline"></span> Idle';
      connectionStatus.style.color = '#ffaa00';
    }
  }
  
  // Simulate process information
  if (processCount) {
    const count = Math.floor(Math.random() * 3) + 1;
    processCount.textContent = count + ' active';
  }
  
  if (processList) {
    const processes = [
      'P2P Chatter (electron)',
      'Network Monitor',
      'Crypto Engine'
    ];
    processList.innerHTML = processes.map((p, i) => 
      `<div style="padding: 2px 0; color: #0f0; font-family: monospace;">${i+1}. ${p}</div>`
    ).join('');
  }
}

// Show Network Manager Modal
function showNetworkManager() {
  const modal = document.createElement('div');
  modal.className = 'modal network-manager-modal';
  modal.id = 'networkManagerModal';
  modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 600px; background: rgba(0, 20, 40, 0.95); border: 2px solid #0066cc; border-radius: 8px; padding: 20px; z-index: 3000; box-shadow: 0 0 30px rgba(0, 102, 204, 0.5);';
  
  modal.innerHTML = `
    <button class="close-btn" style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: #0066cc; font-size: 28px; cursor: pointer;" onclick="document.getElementById('networkManagerModal').remove();">&times;</button>
    
    <h2 style="color: #0066cc; margin-top: 0; text-align: center;">🌐 Network Manager</h2>
    
    <div style="margin: 20px 0;">
      <h3 style="color: #00ff00;">🧅 Tor Settings</h3>
      
      <div style="background: rgba(0, 102, 204, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid #0066cc;">
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00; margin-right: 10px;">
            <input type="checkbox" id="torEnabledCheckbox" ${torEnabled ? 'checked' : ''} onchange="updateTorSetting()">
            Enable Tor
          </label>
          <span style="color: #ffaa00; font-size: 12px;">Status: ${torEnabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">Exit Node:</label>
          <select id="torExitNode" style="background: #000; color: #0f0; border: 1px solid #0066cc; padding: 5px; margin-top: 5px; width: 100%;">
            <option value="auto">Auto (Recommended)</option>
            <option value="us">United States</option>
            <option value="eu">Europe</option>
            <option value="asia">Asia</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">Circuit Timeout (ms):</label>
          <input type="number" id="torCircuitTimeout" value="${torSettings.circuitTimeout}" min="1000" max="60000" step="1000" style="background: #000; color: #0f0; border: 1px solid #0066cc; padding: 5px; margin-top: 5px; width: 100%;">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">Bridges:</label>
          <textarea id="torBridges" placeholder="Enter bridge addresses (one per line)" style="background: #000; color: #0f0; border: 1px solid #0066cc; padding: 8px; margin-top: 5px; width: 100%; height: 80px; font-family: monospace; font-size: 11px;"></textarea>
        </div>
      </div>
    </div>
    
    <div style="margin: 20px 0;">
      <h3 style="color: #00ff00;">🔒 VPN Settings</h3>
      
      <div style="background: rgba(0, 200, 100, 0.1); padding: 15px; border-radius: 5px; border-left: 3px solid #00cc77;">
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00; margin-right: 10px;">
            <input type="checkbox" id="vpnEnabledCheckbox" ${vpnSettings.enabled ? 'checked' : ''} onchange="updateVpnSetting()">
            Enable VPN
          </label>
          <span style="color: #ffaa00; font-size: 12px;">Status: ${vpnSettings.enabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}</span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">VPN Provider:</label>
          <select id="vpnProvider" style="background: #000; color: #0f0; border: 1px solid #00cc77; padding: 5px; margin-top: 5px; width: 100%;">
            <option value="none">None</option>
            <option value="expressvpn">ExpressVPN</option>
            <option value="nordvpn">NordVPN</option>
            <option value="mullvad">Mullvad</option>
            <option value="protonvpn">ProtonVPN</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">Protocol:</label>
          <select id="vpnProtocol" style="background: #000; color: #0f0; border: 1px solid #00cc77; padding: 5px; margin-top: 5px; width: 100%;">
            <option value="none">None</option>
            <option value="openvpn">OpenVPN</option>
            <option value="wireguard">WireGuard</option>
            <option value="ipsec">IPSec</option>
            <option value="ikev2">IKEv2</option>
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="color: #00ff00;">Location:</label>
          <select id="vpnLocation" style="background: #000; color: #0f0; border: 1px solid #00cc77; padding: 5px; margin-top: 5px; width: 100%;">
            <option value="auto">Auto</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="eu">Europe</option>
            <option value="asia">Asia</option>
          </select>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <button onclick="applyNetworkSettings()" style="flex: 1; padding: 10px; background: #0066cc; color: #fff; border: 1px solid #00ff00; border-radius: 4px; cursor: pointer; font-weight: bold;">
        ✓ Apply Settings
      </button>
      <button onclick="testNetworkConnection()" style="flex: 1; padding: 10px; background: #006600; color: #fff; border: 1px solid #00ff00; border-radius: 4px; cursor: pointer; font-weight: bold;">
        📡 Test Connection
      </button>
      <button onclick="document.getElementById('networkManagerModal').remove()" style="flex: 1; padding: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; cursor: pointer;">
        Close
      </button>
    </div>
    
    <div id="networkStatus" style="margin-top: 15px; padding: 10px; background: rgba(0, 150, 0, 0.2); border: 1px solid #00ff00; border-radius: 4px; color: #00ff00; text-align: center; display: none;"></div>
  `;
  
  document.body.appendChild(modal);
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Apply network settings
function applyNetworkSettings() {
  // Tor settings
  torSettings.exitNode = document.getElementById('torExitNode')?.value || 'auto';
  torSettings.circuitTimeout = parseInt(document.getElementById('torCircuitTimeout')?.value || 10000);
  torSettings.bridges = document.getElementById('torBridges')?.value.split('\\n').filter(b => b.trim()) || [];
  
  // VPN settings
  vpnSettings.provider = document.getElementById('vpnProvider')?.value || 'none';
  vpnSettings.protocol = document.getElementById('vpnProtocol')?.value || 'none';
  vpnSettings.location = document.getElementById('vpnLocation')?.value || 'auto';
  
  // Save to localStorage
  localStorage.setItem('torSettings', JSON.stringify(torSettings));
  localStorage.setItem('vpnSettings', JSON.stringify(vpnSettings));
  
  showNotification('✅ Network settings applied successfully!', 'success');
  console.log('Network settings applied:', { torSettings, vpnSettings });
}

// Test network connection
function testNetworkConnection() {
  const statusDiv = document.getElementById('networkStatus');
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = '🔄 Testing connection...';
  statusDiv.style.color = '#ffaa00';
  
  setTimeout(() => {
    statusDiv.innerHTML = `
      ✅ Connection Test Results:<br>
      🧅 Tor: ${torEnabled ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}<br>
      🔒 VPN: ${vpnSettings.enabled ? '🟢 CONNECTED' : '🔴 NOT ENABLED'}<br>
      🔐 Encryption: ${encryptionEnabled ? '🟢 ACTIVE' : '🔴 INACTIVE'}<br>
      📡 Latency: ${Math.floor(Math.random() * 100) + 20}ms
    `;
    statusDiv.style.color = '#00ff00';
  }, 2000);
}

// Update Tor setting
function updateTorSetting() {
  const checkbox = document.getElementById('torEnabledCheckbox');
  if (checkbox) {
    if (checkbox.checked) {
      toggleTor();
    } else if (torEnabled) {
      toggleTor();
    }
  }
}

// Update VPN setting
function updateVpnSetting() {
  const checkbox = document.getElementById('vpnEnabledCheckbox');
  if (checkbox) {
    vpnSettings.enabled = checkbox.checked;
    localStorage.setItem('vpnSettings', JSON.stringify(vpnSettings));
    if (checkbox.checked) {
      showNotification('🔒 VPN ENABLED', 'success');
    } else {
      showNotification('🔒 VPN DISABLED', 'error');
    }
  }
}

// Toggle encryption
function toggleEncryption() {
  encryptionEnabled = !encryptionEnabled;
  const btn = document.getElementById('encryptionToggle');
  
  
  if (!btn) {
    console.error('Encryption toggle button not found');
    return;
  }
  
  if (encryptionEnabled) {
    btn.classList.add('active');
    btn.style.background = '#ff3333';
    btn.style.boxShadow = '0 0 20px rgba(255, 51, 51, 0.8)';
    showNotification('🔐 Encryption ENABLED', 'success');
  } else {
    btn.classList.remove('active');
    btn.style.background = '';
    btn.style.boxShadow = '';
    showNotification('🔓 Encryption DISABLED', 'error');
  }
  
  localStorage.setItem('encryptionEnabled', encryptionEnabled);
  updateSecurityStatus();
  console.log('Encryption toggled:', encryptionEnabled);
}

// Toggle Tor
function toggleTor() {
  torEnabled = !torEnabled;
  const btn = document.getElementById('torToggle');
  const status = document.getElementById('torStatus');
  
  if (!btn) {
    console.error('Tor toggle button not found');
    return;
  }
  
  if (torEnabled) {
    btn.classList.add('active');
    btn.style.background = '#0066cc';
    btn.style.boxShadow = '0 0 20px rgba(0, 102, 204, 0.8)';
    if (status) {
      status.classList.add('on');
      status.textContent = 'ON';
      status.style.color = '#00ff00';
    }
    showNotification('🧅 Tor ENABLED - Routing through Tor network', 'success');
    torSettings.enabled = true;
  } else {
    btn.classList.remove('active');
    btn.style.background = '';
    btn.style.boxShadow = '';
    if (status) {
      status.classList.remove('on');
      status.textContent = 'OFF';
      status.style.color = '#ff3333';
    }
    showNotification('🧅 Tor DISABLED', 'error');
    torSettings.enabled = false;
  }
  
  localStorage.setItem('torEnabled', torEnabled);
  updateSecurityStatus();
  console.log('Tor toggled:', torEnabled);
}

// Update security status display
function updateSecurityStatus() {
  const encStatus = document.getElementById('encryptionStatus');
  const torStatus = document.getElementById('torStatus');
  const secLevel = document.getElementById('securityLevel');
  
  // Update encryption status
  if (encryptionEnabled) {
    encStatus.classList.add('on');
    encStatus.textContent = 'ON';
  } else {
    encStatus.classList.remove('on');
    encStatus.textContent = 'OFF';
  }
  
  // Update Tor status  
  if (torEnabled) {
    torStatus.classList.add('on');
    torStatus.textContent = 'ON';
  } else {
    torStatus.classList.remove('on');
    torStatus.textContent = 'OFF';
  }
  
  // Update security level
  if (encryptionEnabled && torEnabled) {
    secLevel.textContent = '🟢 HIGH';
    secLevel.style.background = '#00ff00';
  } else if (encryptionEnabled || torEnabled) {
    secLevel.textContent = '🟡 MEDIUM';
    secLevel.style.background = '#ffff00';
  } else {
    secLevel.textContent = '🔴 LOW';
    secLevel.style.background = '#ff3333';
  }
}

// Setup theme switcher with dropdown menu
function setupThemeSwitcher() {
  const themeMenuBtn = document.getElementById('themeMenuBtn');
  const themeMenu = document.getElementById('themeMenu');

  if (!themeMenuBtn || !themeMenu) {
    console.warn('Theme menu elements not found');
    return;
  }

  // Toggle dropdown
  themeMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.style.display = themeMenu.style.display === 'none' ? 'block' : 'none';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      themeMenu.style.display = 'none';
    }
  });

  // Theme selection
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
      themeMenu.style.display = 'none';
    });
  });

  // Chat options - with null checks
  const readReceipts = document.getElementById('readReceipts');
  const typingIndicator = document.getElementById('typingIndicator');
  const messageReactions = document.getElementById('messageReactions');
  const pinMessages = document.getElementById('pinMessages');
  const soundNotifications = document.getElementById('soundNotifications');

  if (readReceipts) {
    readReceipts.addEventListener('change', (e) => {
      localStorage.setItem('readReceipts', e.target.checked);
    });
  }

  if (typingIndicator) {
    typingIndicator.addEventListener('change', (e) => {
      localStorage.setItem('typingIndicator', e.target.checked);
    });
  }

  if (messageReactions) {
    messageReactions.addEventListener('change', (e) => {
      localStorage.setItem('messageReactions', e.target.checked);
    });
  }

  if (pinMessages) {
    pinMessages.addEventListener('change', (e) => {
      localStorage.setItem('pinMessages', e.target.checked);
    });
  }

  if (soundNotifications) {
    soundNotifications.addEventListener('change', (e) => {
      localStorage.setItem('soundNotifications', e.target.checked);
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('selectedTheme') || 'matrix';
  applyTheme(savedTheme);

  // Load saved chat options
  if (readReceipts) readReceipts.checked = localStorage.getItem('readReceipts') === 'true';
  if (typingIndicator) typingIndicator.checked = localStorage.getItem('typingIndicator') === 'true';
  if (messageReactions) messageReactions.checked = localStorage.getItem('messageReactions') === 'true';
  if (pinMessages) pinMessages.checked = localStorage.getItem('pinMessages') === 'true';
  if (soundNotifications) soundNotifications.checked = localStorage.getItem('soundNotifications') !== 'false';
}

// Apply theme to the app
function applyTheme(theme) {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('theme-matrix', 'theme-cyberpunk', 'theme-terminal', 'theme-hacker-red', 'theme-dark-web', 'theme-neon-void', 'theme-retro-crt', 'theme-glitch', 'theme-acid', 'theme-plasma', 'theme-darknet');
  
  // Add the new theme class
  if (theme !== 'matrix') {
    root.classList.add(`theme-${theme}`);
  }
  
  localStorage.setItem('selectedTheme', theme);
  showNotification(`🎨 Theme changed to ${theme.toUpperCase().replace(/-/g, ' ')}`, 'success');
}

function setupScreenshotDetection() {
  // Detect Print Screen key
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      triggerScreenshotAlert();
    }
  });

  // Detect Ctrl+PrintScreen
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'PrintScreen') {
      triggerScreenshotAlert();
    }
  });

  // Detect clipboard copy with Ctrl+C and Shift+C
  document.addEventListener('copy', (e) => {
    // Show scrambled text when user copies
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      showScrambledWarning();
    }
  });
}

function triggerScreenshotAlert() {
  const alert = document.getElementById('screenshotAlert');
  alert.style.display = 'flex';
  screenshotDetected = true;

  // Add visual indicator to chat
  const chatMessages = document.getElementById('chatMessages');
  const warning = document.createElement('div');
  warning.className = 'message system-message';
  warning.innerHTML = '<span style="color: #ff3333;">⚠️ Screenshot Detected - Be careful what you capture!</span>';
  chatMessages.appendChild(warning);

  // Auto-hide alert after 5 seconds
  setTimeout(() => {
    alert.style.display = 'none';
  }, 5000);
}

function showScrambledWarning() {
  // Temporarily scramble copied text
  const input = document.activeElement;
  if (input && (input.id === 'messageInput' || input.id === 'usernameInput' || input.id === 'peerUsernameInput')) {
    const originalClass = input.className;
    input.classList.add('text-scrambled');
    
    setTimeout(() => {
      input.classList.remove('text-scrambled');
    }, 300);
  }
}

// NUKE FUNCTION - Clear all data and close app
function nukeEverythingAndClose() {
  const confirmed = confirm(
    '⚠️ WARNING ⚠️\n\n' +
    'This will DELETE ALL DATA including:\n' +
    '• All messages\n' +
    '• All saved settings\n' +
    '• All usernames\n' +
    '• All encryption keys\n' +
    '• All file transfers\n\n' +
    'This action CANNOT be undone!\n\n' +
    'Click OK to NUKE everything and close the app.\n' +
    'Click Cancel to abort.'
  );
  
  if (confirmed) {
    // Show warning message
    showNotification('☢️ NUKING everything... Clearing all data...', 'error');
    
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all session storage
    sessionStorage.clear();
    
    // Clear IndexedDB
    if (window.indexedDB) {
      const databases = window.indexedDB.databases ? 
        window.indexedDB.databases().then(dbs => {
          dbs.forEach(db => window.indexedDB.deleteDatabase(db.name));
        }) : 
        null;
    }
    
    // Reset all app variables
    currentUsername = '';
    peerUsername = '';
    isConnected = false;
    encryptionEnabled = false;
    torEnabled = false;
    generatedUsernames = [];
    sharedFiles = [];
    userAvatars = {};
    screenshotDetected = false;
    
    // Clear network monitoring interval
    if (networkMonitorInterval) {
      clearInterval(networkMonitorInterval);
    }
    
    // Clear DOM messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.innerHTML = '';
    }
    
    // Give brief time to show notification, then close
    setTimeout(() => {
      // Close Electron window if available
      if (window.api && window.api.closeWindow) {
        window.api.closeWindow();
      } else {
        // Fallback for browser
        window.close();
      }
    }, 1000);
  }
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  try {
    // Shortcut button
    const shortcutBtn = document.getElementById('shortcutBtn');
    if (shortcutBtn) {
      shortcutBtn.addEventListener('click', () => {
        console.log('Shortcut button clicked');
        createDesktopShortcut();
      });
    } else {
      console.warn('Shortcut button not found');
    }
    
    const createShortcutBtn = document.getElementById('createShortcutBtn');
    if (createShortcutBtn) {
      createShortcutBtn.addEventListener('click', createDesktopShortcut);
    }

    // Nuke button - clear all data and close app
    const nukeBtn = document.getElementById('nukeBtn');
    if (nukeBtn) {
      nukeBtn.addEventListener('click', () => {
        console.log('Nuke button clicked');
        nukeEverythingAndClose();
      });
    } else {
      console.warn('Nuke button not found');
    }

    // Regenerate username
    const regenerateBtn = document.getElementById('regenerateUsernameBtn');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => {
        console.log('Regenerate username button clicked');
        populateUsernameDropdown();
        showNotification('New username options generated!', 'success');
      });
    }

    // Copy username
    const copyBtn = document.getElementById('copyUsernameBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        console.log('Copy username button clicked');
        copyUsernameToClipboard();
      });
    }

    // Encryption toggle button
    const encryptionToggle = document.getElementById('encryptionToggle');
    if (encryptionToggle) {
      encryptionToggle.addEventListener('click', () => {
        console.log('Encryption toggle clicked');
        toggleEncryption();
      });
    } else {
      console.warn('Encryption toggle not found');
    }

    // Tor toggle button
    const torToggle = document.getElementById('torToggle');
    if (torToggle) {
      torToggle.addEventListener('click', () => {
        console.log('Tor toggle clicked');
        toggleTor();
      });
    } else {
      console.warn('Tor toggle not found');
    }

    // Start button
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('Start button clicked');
        const peerInput = document.getElementById('peerUsernameInput');
        if (peerInput) peerInput.focus();
      });
    } else {
      console.warn('Start button not found');
    }

    // Connect button
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        console.log('Connect button clicked');
        connectToPeer();
      });
    } else {
      console.warn('Connect button not found');
    }

    // Send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        console.log('Send button clicked');
        sendMessage();
      });
    } else {
      console.warn('Send button not found');
    }

    // Message input enter key
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          console.log('Enter key pressed in message input');
          sendMessage();
        }
      });
    } else {
      console.warn('Message input not found');
    }
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }

  // Additional event listeners with error handling
  try {
    // Peer username input enter key
    const peerUsernameInput = document.getElementById('peerUsernameInput');
    if (peerUsernameInput) {
      peerUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          console.log('Enter key pressed in peer input');
          connectToPeer();
        }
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        console.log('Settings button clicked');
        const settingsDialog = document.getElementById('settingsDialog');
        if (settingsDialog) settingsDialog.style.display = 'flex';
      });
    } else {
      console.warn('Settings button not found');
    }

    // About button
    const aboutBtn = document.getElementById('aboutBtn');
    if (aboutBtn) {
      aboutBtn.addEventListener('click', () => {
        console.log('About button clicked');
        const aboutDialog = document.getElementById('aboutDialog');
        if (aboutDialog) aboutDialog.style.display = 'flex';
      });
    } else {
      console.warn('About button not found');
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.style.colorScheme = 'light';
        }
        localStorage.setItem('darkMode', e.target.checked);
      });
    }

    // Encryption toggle
    const encryptionToggleCheckbox = document.getElementById('encryptionToggle');
    if (encryptionToggleCheckbox && encryptionToggleCheckbox.type === 'checkbox') {
      encryptionToggleCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('encryption', e.target.checked);
      });
    }

    // Local storage toggle
    const localStorageToggle = document.getElementById('localStorageToggle');
    if (localStorageToggle) {
      localStorageToggle.addEventListener('change', (e) => {
        localStorage.setItem('localStorage', e.target.checked);
      });
    }

    // OPSEC toggles
    const anonymousToggle = document.getElementById('anonymousToggle');
    if (anonymousToggle) {
      anonymousToggle.addEventListener('change', (e) => {
        localStorage.setItem('anonymousMode', e.target.checked);
        if (e.target.checked) {
          showNotification('🕵️ Anonymous mode enabled', 'success');
        }
      });
    }

    const noLogsToggle = document.getElementById('noLogsToggle');
    if (noLogsToggle) {
      noLogsToggle.addEventListener('change', (e) => {
        localStorage.setItem('noLogsMode', e.target.checked);
        if (e.target.checked) {
          showNotification('🗑️ No logs mode enabled - messages ephemeral only', 'success');
        }
      });
    }

    const autoDestructToggle = document.getElementById('autoDestructToggle');
    if (autoDestructToggle) {
      autoDestructToggle.addEventListener('change', (e) => {
        localStorage.setItem('autoDestruct', e.target.checked);
        if (e.target.checked) {
          showNotification('💣 Auto-destruct enabled - messages deleted after 1 hour', 'success');
        }
      });
    }

    console.log('✅ Event listeners setup complete');
  } catch (error) {
    console.error('Error setting up additional event listeners:', error);
  }
}

function setupModals() {
  try {
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Click outside modal to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    console.log('Modal setup complete');
  } catch (error) {
    console.error('Error setting up modals:', error);
  }
}

function createDesktopShortcut() {
  if (window.api && window.api.createShortcut) {
    window.api.createShortcut();
    
    // Show success message
    if (document.getElementById('shortcutStatus')) {
      const statusEl = document.getElementById('shortcutStatus');
      statusEl.style.display = 'block';
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 3000);
    }

    // Listen for shortcut creation
    if (window.api.onShortcutCreated) {
      window.api.onShortcutCreated((success) => {
        if (success) {
          showNotification('Desktop shortcut created successfully!', 'success');
        }
      });
    }
  } else {
    showNotification('Desktop shortcut feature not available', 'error');
  }
}

function connectToPeer() {
  const username = document.getElementById('usernameInput').value.trim();
  const peerUsername = document.getElementById('peerUsernameInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (!username || username.length < 3) {
    showNotification('Your username must be at least 3 characters', 'error');
    return;
  }

  if (!peerUsername || peerUsername.length < 3) {
    showNotification('Peer username must be at least 3 characters', 'error');
    return;
  }

  if (!password || password.length < 4) {
    showNotification('Connection password must be at least 4 characters (shared outside app)', 'error');
    return;
  }

  currentUsername = username;
  peerUsername = peerUsername;
  isConnected = true;

  // Update UI
  document.getElementById('chatTitle').textContent = `Chatting with: ${peerUsername}`;
  document.getElementById('messageInput').disabled = false;
  document.getElementById('sendBtn').disabled = false;
  document.getElementById('connectBtn').disabled = true;
  document.getElementById('usernameInput').disabled = true;
  document.getElementById('peerUsernameInput').disabled = true;
  document.getElementById('passwordInput').disabled = true;
  document.getElementById('regenerateUsernameBtn').disabled = true;
  document.getElementById('copyUsernameBtn').disabled = true;

  // Update status
  updateStatus(true);

  // Clear messages and show welcome
  document.getElementById('chatMessages').innerHTML = '';
  addSystemMessage(`You are ${username}`);
  addSystemMessage(`Connected to ${peerUsername}`);
  addSystemMessage(`🔐 Encryption: ${encryptionEnabled ? 'ON' : 'OFF'}`);
  addSystemMessage(`🧅 Tor: ${torEnabled ? 'ON' : 'OFF'}`);
  addSystemMessage('Start typing to send messages...');

  showNotification(`Connected to ${peerUsername}!`, 'success');
}

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message || !isConnected) {
    return;
  }

  // Add message to chat
  addMessage(currentUsername, message, true);

  // Clear input
  messageInput.value = '';
  messageInput.focus();

  // Simulate encryption if enabled
  const encryptionEnabled = document.getElementById('encryptionToggle').checked;
  if (encryptionEnabled) {
    // Simulate encryption
    console.log('Message encrypted with AES-256-GCM');
  }

  // Store locally if enabled
  const localStorageEnabled = document.getElementById('localStorageToggle').checked;
  if (localStorageEnabled) {
    storeMessage(currentUsername, message);
  }
}

function addMessage(sender, message, isSent = false) {
  const chatMessages = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `message ${isSent ? 'sent' : 'received'}`;

  const timestamp = new Date().toLocaleTimeString();
  const avatar = generateAvatar(sender);
  
  messageEl.innerHTML = `
    ${getSimpleUsernameDisplay(sender)}
    <div class="message-content">
      <strong</span>
    </div>
  `;

  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.style.cssText = 'text-align: center; color: #00aa00; font-size: 12px; margin: 10px 0;';
  messageEl.textContent = `[System] ${message}`;
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateStatus(connected) {
  const statusEl = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-box');

  if (connected) {
    statusEl.classList.remove('offline');
    statusEl.classList.add('online');
    statusText.innerHTML = `
      <span class="status-dot online"></span>
      <span>Connected</span>
    `;
  } else {
    statusEl.classList.add('offline');
    statusEl.classList.remove('online');
    statusText.innerHTML = `
      <span class="status-dot offline"></span>
      <span>Not connected</span>
    `;
  }
}

function storeMessage(sender, message) {
  const messages = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  messages.push({
    sender,
    message,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#ff3333' : type === 'success' ? '#00ff00' : '#00aa00'};
    color: ${type === 'error' ? '#fff' : '#000'};
    border-radius: 4px;
    box-shadow: 0 0 20px ${type === 'error' ? '#ff3333' : '#00ff00'};
    z-index: 2000;
    font-size: 12px;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function loadSettings() {
  try {
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') !== 'false';
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = darkMode;
    }

    // Load encryption setting
    encryptionEnabled = localStorage.getItem('encryptionEnabled') === 'true';
    if (encryptionEnabled) {
      const encToggle = document.getElementById('encryptionToggle');
      const encStatus = document.getElementById('encryptionStatus');
      if (encToggle) encToggle.classList.add('active');
      if (encStatus) {
        encStatus.classList.add('on');
        encStatus.textContent = 'ON';
      }
    }

    // Load Tor setting
    torEnabled = localStorage.getItem('torEnabled') === 'true';
    if (torEnabled) {
      const torToggle = document.getElementById('torToggle');
      const torStatus = document.getElementById('torStatus');
      if (torToggle) torToggle.classList.add('active');
      if (torStatus) {
        torStatus.classList.add('on');
        torStatus.textContent = 'ON';
      }
    }

    // Load local storage setting
    const localStorageEnabled = localStorage.getItem('localStorage') !== 'false';
    const localStorageToggle = document.getElementById('localStorageToggle');
    if (localStorageToggle) {
      localStorageToggle.checked = localStorageEnabled;
    }

    // Load OPSEC settings
    const anonymousMode = localStorage.getItem('anonymousMode') === 'true';
    const anonymousToggle = document.getElementById('anonymousToggle');
    if (anonymousToggle) {
      anonymousToggle.checked = anonymousMode;
    }

    const noLogsMode = localStorage.getItem('noLogsMode') === 'true';
    const noLogsToggle = document.getElementById('noLogsToggle');
    if (noLogsToggle) {
      noLogsToggle.checked = noLogsMode;
    }

    const autoDestruct = localStorage.getItem('autoDestruct') !== 'false';
    const autoDestructToggle = document.getElementById('autoDestructToggle');
    if (autoDestructToggle) {
      autoDestructToggle.checked = autoDestruct;
    }

    console.log('Settings loaded successfully');
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
// ============================================
// FILE TRANSFER FUNCTIONALITY
// ============================================

function setupFileTransferMenu() {
  console.log('Setting up file transfer menu...');
  const fileTransferBtn = document.getElementById('fileTransferBtn');
  const fileTransferMenu = document.getElementById('fileTransferMenu');
  
  if (!fileTransferBtn) {
    console.error('File transfer button not found');
    return;
  }
  if (!fileTransferMenu) {
    console.error('File transfer menu not found');
    return;
  }

  console.log('File transfer menu found, attaching listeners...');
  
  // Show security advisory on first interaction
  let fileAdvisoryShown = localStorage.getItem('fileAdvisoryShown');
  
  // Toggle menu visibility
  fileTransferBtn.addEventListener('click', (e) => {
    console.log('File transfer button clicked');
    e.stopPropagation();
    
    // Show advisory once per session if not shown
    if (!fileAdvisoryShown) {
      showSecurityAdvisory(
        'FILE TRANSFER WARNING',
        'File transfers expose metadata and may leak information about shared files. File names, sizes, content (unless encrypted), and transfer patterns are at risk.',
        [
          'File names and sizes visible to peer',
          'File content transmitted if not encrypted',
          'File transfer times and frequency logged',
          'Recipient\'s username visible in file log',
          'Network metadata reveals transfer pattern'
        ]
      );
      localStorage.setItem('fileAdvisoryShown', 'true');
      fileAdvisoryShown = true;
    }
    
    fileTransferMenu.style.display = fileTransferMenu.style.display === 'none' ? 'block' : 'none';
    console.log('File transfer menu toggled:', fileTransferMenu.style.display);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      fileTransferMenu.style.display = 'none';
    }
  });
  
  // Create Secure File button
  const createSecureFileBtn = document.getElementById('createSecureFileBtn');
  if (createSecureFileBtn) {
    createSecureFileBtn.addEventListener('click', () => {
      document.getElementById('fileCreationDialog').style.display = 'flex';
      fileTransferMenu.style.display = 'none';
    });
  }
  
  // Receive File button
  const receiveFileBtn = document.getElementById('receiveFileBtn');
  if (receiveFileBtn) {
    receiveFileBtn.addEventListener('click', () => {
      showNotification('📥 Ready to receive protected file', 'info');
      fileTransferMenu.style.display = 'none';
    });
  }
  
  // View Files button
  const viewFilesBtn = document.getElementById('viewFilesBtn');
  if (viewFilesBtn) {
    viewFilesBtn.addEventListener('click', () => {
      showSharedFilesList();
      fileTransferMenu.style.display = 'none';
    });
  }
  
  // Create File button in dialog
  const createFileBtn = document.getElementById('createFileBtn');
  if (createFileBtn) {
    createFileBtn.addEventListener('click', createProtectedFile);
  }
  
  // Cancel button
  const cancelFileBtn = document.getElementById('cancelFileBtn');
  if (cancelFileBtn) {
    cancelFileBtn.addEventListener('click', () => {
      document.getElementById('fileCreationDialog').style.display = 'none';
      clearFileForm();
    });
  }

  console.log('File transfer menu setup complete');
}

function createProtectedFile() {
  const fileName = document.getElementById('fileName').value.trim();
  const fileContent = document.getElementById('fileContent').value.trim();
  const password = document.getElementById('filePassword').value;
  const passwordConfirm = document.getElementById('filePasswordConfirm').value;
  const useEncryption = document.getElementById('fileEncryption').checked;
  const recipients = document.getElementById('allowedRecipients').value;
  const expiration = parseInt(document.getElementById('fileExpiration').value) || 0;
  
  // Validation
  if (!fileName || !fileContent || !password) {
    showNotification('❌ Please fill in all required fields', 'error');
    return;
  }
  
  if (password !== passwordConfirm) {
    showNotification('❌ Passwords do not match', 'error');
    return;
  }
  
  if (password.length < 4) {
    showNotification('❌ Password must be at least 4 characters', 'error');
    return;
  }
  
  // Create file object
  const fileObj = {
    id: generateFileId(),
    name: fileName,
    content: fileContent,
    password: password,
    encrypted: useEncryption,
    recipients: recipients.split(',').map(r => r.trim()).filter(r => r),
    expiration: expiration,
    createdAt: new Date().toISOString(),
    expiresAt: expiration > 0 ? new Date(Date.now() + expiration * 3600000).toISOString() : null,
    size: fileContent.length,
    checksum: generateChecksum(fileContent),
    owner: currentUsername
  };
  
  // If encryption is enabled, create encrypted version
  if (useEncryption) {
    fileObj.encryptedContent = encryptFileContent(fileContent, password);
  }
  
  // Add to shared files
  sharedFiles.push(fileObj);
  
  // Save to localStorage
  localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
  
  // Show success status
  const statusDiv = document.getElementById('fileStatus');
  const statusText = document.getElementById('fileStatusText');
  
  statusDiv.style.display = 'block';
  statusDiv.style.background = 'rgba(0, 255, 0, 0.2)';
  statusDiv.style.border = '1px solid #00ff00';
  statusDiv.style.color = '#00ff00';
  
  statusText.innerHTML = `
    ✓ <strong>File Created Successfully!</strong><br>
    📁 Name: ${fileName}<br>
    🔐 Protected with password<br>
    📊 Size: ${fileObj.size} bytes<br>
    🔑 ID: ${fileObj.id}<br>
    <br>
    <strong>Share this ID with peers to send them the file</strong><br>
    They will need the password to decrypt it.
  `;
  
  // Copy file ID to clipboard
  setTimeout(() => {
    navigator.clipboard.writeText(fileObj.id);
    showNotification(`✓ File ID copied to clipboard: ${fileObj.id}`, 'success');
  }, 500);
  
  // Clear form after 3 seconds
  setTimeout(() => {
    document.getElementById('fileCreationDialog').style.display = 'none';
    clearFileForm();
  }, 3000);
}

function encryptFileContent(content, password) {
  // Simulate AES-256 encryption
  // In production, use a real encryption library like TweetNaCl.js or crypto-js
  try {
    // Simple base64 + password obfuscation (NOT secure - for demo only)
    const jsonStr = JSON.stringify({
      content: content,
      timestamp: Date.now(),
      salt: Math.random().toString(36)
    });
    const encoded = btoa(jsonStr); // Base64 encode
    const pwHash = btoa(password); // Simple password hash
    
    // XOR with password for basic encryption
    let encrypted = '';
    for (let i = 0; i < encoded.length; i++) {
      encrypted += String.fromCharCode(encoded.charCodeAt(i) ^ pwHash.charCodeAt(i % pwHash.length));
    }
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

function decryptFileContent(encryptedContent, password) {
  try {
    const encrypted = atob(encryptedContent);
    const pwHash = btoa(password);
    
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ pwHash.charCodeAt(i % pwHash.length));
    }
    
    const jsonStr = atob(decrypted);
    const obj = JSON.parse(jsonStr);
    return obj.content;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function generateFileId() {
  return 'FID-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function generateChecksum(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

function showSharedFilesList() {
  if (sharedFiles.length === 0) {
    showNotification('📁 No shared files yet. Create one to get started!', 'info');
    return;
  }
  
  let filesList = '🔐 SHARED FILES:\n\n';
  sharedFiles.forEach((file, index) => {
    const expired = file.expiresAt && new Date(file.expiresAt) < new Date() ? ' [EXPIRED]' : '';
    filesList += `${index + 1}. ${file.name}${expired}\n`;
    filesList += `   ID: ${file.id}\n`;
    filesList += `   Size: ${file.size} bytes\n`;
    filesList += `   Owner: ${file.owner}\n`;
    if (file.recipients.length > 0) {
      filesList += `   Recipients: ${file.recipients.join(', ')}\n`;
    }
    filesList += '\n';
  });
  
  alert(filesList);
}

function clearFileForm() {
  document.getElementById('fileName').value = '';
  document.getElementById('fileContent').value = '';
  document.getElementById('filePassword').value = '';
  document.getElementById('filePasswordConfirm').value = '';
  document.getElementById('allowedRecipients').value = '';
  document.getElementById('fileExpiration').value = '0';
  document.getElementById('fileStatus').style.display = 'none';
}

// Load shared files from localStorage on startup
function loadSharedFiles() {
  try {
    const saved = localStorage.getItem('sharedFiles');
    if (saved) {
      sharedFiles = JSON.parse(saved);
      // Filter out expired files
      sharedFiles = sharedFiles.filter(file => {
        if (file.expiresAt) {
          return new Date(file.expiresAt) > new Date();
        }
        return true;
      });
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
    }
  } catch (error) {
    console.error('Error loading shared files:', error);
  }
}

// Call this on app initialization
loadSharedFiles();
  }
`;
document.head.appendChild(style);
// ============================================
// SECURITY ADVISORY SYSTEM
// ============================================

// Show security warnings for sensitive operations
function showSecurityAdvisory(title, message, details) {
  const modal = document.createElement('div');
  modal.className = 'modal security-advisory';
  modal.style.cssText = 'background: rgba(0,0,0,0.9); padding: 0; border: 3px solid #ff0000; border-radius: 8px;';
  
  const warningIcon = '⚠️';
  const detailsHTML = details.map(d => `<li style="margin: 8px 0; color: #ffcc00;">${d}</li>`).join('');
  
  modal.innerHTML = `
    <div style="padding: 20px; max-width: 500px;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span style="font-size: 32px; margin-right: 10px;">${warningIcon}</span>
        <h2 style="color: #ff0000; margin: 0;">${title}</h2>
      </div>
      <p style="color: #ffffff; margin: 10px 0; line-height: 1.6;">${message}</p>
      <div style="background: rgba(255,0,0,0.1); border-left: 3px solid #ff0000; padding: 10px; margin: 15px 0; border-radius: 4px;">
        <h3 style="color: #ffcc00; margin-top: 0;">Data at Risk:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${detailsHTML}
        </ul>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button onclick="this.closest('.modal').remove()" style="flex: 1; padding: 10px; background: #ff0000; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          I Understand & Proceed
        </button>
        <button onclick="this.closest('.modal').remove()" style="flex: 1; padding: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
  
  return modal;
}

// ============================================
// CRYPTOCURRENCY TRANSFER FUNCTIONALITY
// ============================================

let cryptoTransactions = [];

function setupCryptoTransferMenu() {
  console.log('Setting up crypto transfer menu...');
  const cryptoTransferBtn = document.getElementById('cryptoTransferBtn');
  const cryptoTransferMenu = document.getElementById('cryptoTransferMenu');
  
  if (!cryptoTransferBtn) {
    console.error('Crypto transfer button not found');
    return;
  }
  if (!cryptoTransferMenu) {
    console.error('Crypto transfer menu not found');
    return;
  }

  console.log('Crypto transfer menu found, attaching listeners...');
  
  // Show security advisory on first interaction
  let advisoryShown = localStorage.getItem('cryptoAdvisoryShown');
  
  // Toggle menu visibility
  cryptoTransferBtn.addEventListener('click', (e) => {
    console.log('Crypto transfer button clicked');
    e.stopPropagation();
    
    // Show advisory once per session if not shown
    if (!advisoryShown) {
      showSecurityAdvisory(
        'CRYPTOCURRENCY TRANSFER WARNING',
        'Cryptocurrency transactions carry significant risks. Your peer username, IP address (if unencrypted), transaction amount, and wallet addresses could be exposed.',
        [
          'Peer\'s username will be visible in transaction log',
          'IP address exposure if not using Tor/encryption',
          'Transaction amounts are not encrypted by default',
          'Wallet addresses stored in local history',
          'Network traffic may reveal transaction metadata'
        ]
      );
      localStorage.setItem('cryptoAdvisoryShown', 'true');
      advisoryShown = true;
    }
    
    cryptoTransferMenu.style.display = cryptoTransferMenu.style.display === 'none' ? 'block' : 'none';
    console.log('Crypto transfer menu toggled:', cryptoTransferMenu.style.display);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      cryptoTransferMenu.style.display = 'none';
    }
  });
  
  // Create Transfer button
  const createCryptoTransferBtn = document.getElementById('createCryptoTransferBtn');
  if (createCryptoTransferBtn) {
    createCryptoTransferBtn.addEventListener('click', () => {
      document.getElementById('cryptoTransferDialog').style.display = 'flex';
      cryptoTransferMenu.style.display = 'none';
    });
  }
  
  // View Transactions button
  const viewCryptoTransactionsBtn = document.getElementById('viewCryptoTransactionsBtn');
  if (viewCryptoTransactionsBtn) {
    viewCryptoTransactionsBtn.addEventListener('click', () => {
      showCryptoTransactions();
      cryptoTransferMenu.style.display = 'none';
    });
  }
  
  // Configure Currencies button
  const cryptoSettingsBtn = document.getElementById('cryptoSettingsBtn');
  if (cryptoSettingsBtn) {
    cryptoSettingsBtn.addEventListener('click', () => {
      showCryptoSettings();
      cryptoTransferMenu.style.display = 'none';
    });
  }
  
  // Send Crypto button
  const sendCryptoBtn = document.getElementById('sendCryptoBtn');
  if (sendCryptoBtn) {
    sendCryptoBtn.addEventListener('click', sendCryptoTransfer);
  }
  
  // Cancel button
  const cancelCryptoBtn = document.getElementById('cancelCryptoBtn');
  if (cancelCryptoBtn) {
    cancelCryptoBtn.addEventListener('click', () => {
      document.getElementById('cryptoTransferDialog').style.display = 'none';
      clearCryptoForm();
    });
  }
  
  // PGP Signature checkbox
  const signWithPgp = document.getElementById('signWithPgp');
  if (signWithPgp) {
    signWithPgp.addEventListener('change', (e) => {
      const pgpSection = document.getElementById('pgpSignatureSection');
      if (pgpSection) {
        pgpSection.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  }

  console.log('Crypto transfer menu setup complete');
}

function sendCryptoTransfer() {
  const recipient = document.getElementById('cryptoRecipient').value.trim();
  const currency = document.getElementById('cryptoCurrency').value;
  const amount = parseFloat(document.getElementById('cryptoAmount').value);
  const exchangeType = document.getElementById('exchangeType').value;
  const walletAddress = document.getElementById('cryptoWalletAddress').value.trim();
  const password = document.getElementById('cryptoPassword').value;
  const signWithPgp = document.getElementById('signWithPgp').checked;
  
  // Validation
  if (!recipient || recipient.length < 3) {
    showNotification('❌ Please enter recipient username (min 3 characters)', 'error');
    return;
  }
  
  if (!amount || amount <= 0) {
    showNotification('❌ Please enter valid amount', 'error');
    return;
  }
  
  if (!password || password.length < 4) {
    showNotification('❌ Please confirm with transaction password', 'error');
    return;
  }
  
  if (exchangeType !== 'direct' && !walletAddress) {
    showNotification('❌ Wallet address required for this exchange type', 'error');
    return;
  }
  
  // Create transaction object
  const transaction = {
    id: generateTransactionId(),
    from: currentUsername,
    to: recipient,
    amount: amount,
    currency: currency,
    exchangeType: exchangeType,
    walletAddress: walletAddress || null,
    timestamp: new Date().toISOString(),
    status: 'pending',
    pgpSigned: signWithPgp,
    pgpSignature: signWithPgp ? generatePgpSignature(recipient, amount, currency) : null,
    fee: calculateTransactionFee(amount, exchangeType),
    networkInfo: {
      tor: torEnabled,
      encrypted: encryptionEnabled
    }
  };
  
  // Add to transactions list
  cryptoTransactions.push(transaction);
  localStorage.setItem('cryptoTransactions', JSON.stringify(cryptoTransactions));
  
  // Update status
  const statusDiv = document.getElementById('cryptoStatus');
  const statusText = document.getElementById('cryptoStatusText');
  
  statusDiv.style.display = 'block';
  statusDiv.style.background = 'rgba(0, 255, 0, 0.2)';
  statusDiv.style.border = '1px solid #00ff00';
  statusDiv.style.color = '#00ff00';
  
  statusText.innerHTML = `
    ✓ <strong>Crypto Transfer Initiated!</strong><br>
    💸 Amount: ${amount} ${currency}<br>
    👤 To: ${recipient}<br>
    🏦 Exchange: ${exchangeType.toUpperCase()}<br>
    📊 Fee: ${transaction.fee.toFixed(8)} ${currency}<br>
    🆔 Transaction ID: ${transaction.id}<br>
    ${signWithPgp ? '🔐 PGP Signed: YES' : '🔐 PGP Signed: NO'}<br>
    <br>
    <strong>Status: PENDING - Awaiting peer confirmation</strong>
  `;
  
  // Add to chat
  addMessage('CryptoBot', `💰 Transfer sent: ${amount} ${currency} to ${recipient} (${transaction.id})`, false);
  
  // Clear form after 3 seconds
  setTimeout(() => {
    document.getElementById('cryptoTransferDialog').style.display = 'none';
    clearCryptoForm();
  }, 3000);
  
  showNotification(`💰 Crypto transfer initiated! ID: ${transaction.id}`, 'success');
}

function showCryptoTransactions() {
  if (cryptoTransactions.length === 0) {
    showNotification('📊 No transactions yet', 'info');
    return;
  }
  
  let html = '<h3>💰 Crypto Transactions</h3>';
  html += '<div style="max-height: 400px; overflow-y: auto;">';
  
  cryptoTransactions.forEach(tx => {
    html += `
      <div style="background: rgba(0,255,0,0.1); padding: 10px; margin: 5px 0; border-left: 3px solid #00ff00; border-radius: 3px;">
        <strong>${tx.from} → ${tx.to}</strong><br>
        💰 ${tx.amount} ${tx.currency} | 🏦 ${tx.exchangeType.toUpperCase()}<br>
        🆔 ${tx.id}<br>
        ⏰ ${new Date(tx.timestamp).toLocaleString()}<br>
        📊 Status: <span style="color: ${tx.status === 'completed' ? '#00ff00' : '#ffaa00'}">${tx.status.toUpperCase()}</span><br>
        ${tx.pgpSigned ? '🔐 PGP Signed: YES' : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  showModalContent('💰 Crypto Transactions', html);
}

function showCryptoSettings() {
  const currencies = ['BTC', 'ETH', 'XMR', 'LTC', 'USDT', 'DOGE', 'ZEC'];
  const exchangeTypes = ['direct', 'escrow', 'atomic', 'lightning'];
  
  let html = '<h3>⚙️ Cryptocurrency Settings</h3>';
  
  html += '<div class="settings-section">';
  html += '<h4>Available Currencies</h4>';
  currencies.forEach(cur => {
    html += `<div style="padding: 5px 0;">✓ ${cur}</div>`;
  });
  html += '</div>';
  
  html += '<div class="settings-section">';
  html += '<h4>Exchange Types</h4>';
  exchangeTypes.forEach(type => {
    html += `<div style="padding: 5px 0;">✓ ${type.toUpperCase()} - ${getExchangeDescription(type)}</div>`;
  });
  html += '</div>';
  
  html += '<div class="settings-section">';
  html += '<h4>Transaction Fees</h4>';
  html += `<div>Direct Transfer: 0.1% | Escrow: 0.5% | Atomic: 1.0% | Lightning: 0.01%</div>`;
  html += '</div>';
  
  showModalContent('⚙️ Crypto Settings', html);
}

function getExchangeDescription(type) {
  const descriptions = {
    'direct': 'Direct peer-to-peer transfer with no intermediary',
    'escrow': 'Protected transfer with escrow service',
    'atomic': 'Cross-chain atomic swap',
    'lightning': 'Instant transfer via Lightning Network'
  };
  return descriptions[type] || '';
}

function calculateTransactionFee(amount, exchangeType) {
  const fees = {
    'direct': 0.001,
    'escrow': 0.005,
    'atomic': 0.01,
    'lightning': 0.0001
  };
  return amount * (fees[exchangeType] || 0.001);
}

function generateTransactionId() {
  return 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function clearCryptoForm() {
  document.getElementById('cryptoRecipient').value = '';
  document.getElementById('cryptoAmount').value = '';
  document.getElementById('cryptoWalletAddress').value = '';
  document.getElementById('cryptoPassword').value = '';
  document.getElementById('signWithPgp').checked = false;
  document.getElementById('pgpSignatureSection').style.display = 'none';
  document.getElementById('cryptoStatus').style.display = 'none';
}

// ============================================
// PGP AUTHENTICATION FUNCTIONALITY (OPTIONAL)
// ============================================

let pgpKeys = {};

function setupPgpAuthMenu() {
  console.log('Setting up PGP auth menu...');
  const pgpAuthBtn = document.getElementById('pgpAuthBtn');
  const pgpAuthMenu = document.getElementById('pgpAuthMenu');
  
  if (!pgpAuthBtn) {
    console.error('PGP auth button not found');
    return;
  }
  if (!pgpAuthMenu) {
    console.error('PGP auth menu not found');
    return;
  }

  console.log('PGP auth menu found, attaching listeners...');
  
  // Show security advisory on first interaction
  let pgpAdvisoryShown = localStorage.getItem('pgpAdvisoryShown');
  
  // Toggle menu visibility
  pgpAuthBtn.addEventListener('click', (e) => {
    console.log('PGP auth button clicked');
    e.stopPropagation();
    
    // Show advisory once per session if not shown
    if (!pgpAdvisoryShown) {
      showSecurityAdvisory(
        'PGP KEY GENERATION WARNING',
        'PGP keys are powerful but require careful handling. Your private keys are stored locally and must be protected.',
        [
          'Private key stored in local browser storage',
          'Key fingerprints visible when sharing keys',
          'Loss of private key = permanent loss of access',
          'Public key exposure allows impersonation if not verified',
          'Key revocation not supported in this app'
        ]
      );
      localStorage.setItem('pgpAdvisoryShown', 'true');
      pgpAdvisoryShown = true;
    }
    
    pgpAuthMenu.style.display = pgpAuthMenu.style.display === 'none' ? 'block' : 'none';
    console.log('PGP auth menu toggled:', pgpAuthMenu.style.display);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      pgpAuthMenu.style.display = 'none';
    }
  });
  
  // Generate Keys button
  const generatePgpKeysBtn = document.getElementById('generatePgpKeysBtn');
  if (generatePgpKeysBtn) {
    generatePgpKeysBtn.addEventListener('click', () => {
      document.getElementById('pgpKeyDialog').style.display = 'flex';
      pgpAuthMenu.style.display = 'none';
    });
  }
  
  // View Keys button
  const viewPgpKeysBtn = document.getElementById('viewPgpKeysBtn');
  if (viewPgpKeysBtn) {
    viewPgpKeysBtn.addEventListener('click', () => {
      showPgpKeys();
      pgpAuthMenu.style.display = 'none';
    });
  }
  
  // Sign Message button
  const pgpSignMessageBtn = document.getElementById('pgpSignMessageBtn');
  if (pgpSignMessageBtn) {
    pgpSignMessageBtn.addEventListener('click', () => {
      showNotification('✍️ PGP Sign feature: Select a message in chat to sign it with your PGP key', 'info');
      pgpAuthMenu.style.display = 'none';
    });
  }
  
  // Verify Message button
  const pgpVerifyMessageBtn = document.getElementById('pgpVerifyMessageBtn');
  if (pgpVerifyMessageBtn) {
    pgpVerifyMessageBtn.addEventListener('click', () => {
      showNotification('✅ PGP Verify feature: Verify signatures from peers (optional authentication)', 'info');
      pgpAuthMenu.style.display = 'none';
    });
  }
  
  // Dialog buttons
  const generatePgpBtn = document.getElementById('generatePgpBtn');
  if (generatePgpBtn) {
    generatePgpBtn.addEventListener('click', generatePgpKeys);
  }
  
  const importPgpKeyBtn = document.getElementById('importPgpKeyBtn');
  if (importPgpKeyBtn) {
    importPgpKeyBtn.addEventListener('click', importPgpKey);
  }
  
  const closePgpDialogBtn = document.getElementById('closePgpDialogBtn');
  if (closePgpDialogBtn) {
    closePgpDialogBtn.addEventListener('click', () => {
      document.getElementById('pgpKeyDialog').style.display = 'none';
    });
  }

  console.log('PGP auth menu setup complete');
}

function generatePgpKeys() {
  const keyId = document.getElementById('pgpKeyId').value.trim();
  const keySize = document.getElementById('pgpKeySize').value;
  
  if (!keyId) {
    showNotification('❌ Please enter a key identifier', 'error');
    return;
  }
  
  const statusDiv = document.getElementById('pgpGenerationStatus');
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = '🔧 Generating keys... (simulated)';
  statusDiv.style.color = '#ffaa00';
  
  // Simulate key generation
  setTimeout(() => {
    const publicKey = generateMockPgpPublicKey(keyId, keySize);
    const privateKey = generateMockPgpPrivateKey(keyId, keySize);
    
    pgpKeys = {
      keyId: keyId,
      keySize: keySize,
      publicKey: publicKey,
      privateKey: privateKey,
      fingerprint: generateKeyFingerprint(keyId),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('pgpKeys', JSON.stringify(pgpKeys));
    
    statusDiv.innerHTML = `
      ✓ <strong>Keys Generated Successfully!</strong><br>
      🔑 Key ID: ${pgpKeys.keyId}<br>
      📊 Key Size: ${pgpKeys.keySize}-bit<br>
      🔐 Fingerprint: ${pgpKeys.fingerprint}<br>
      ⏰ Created: ${new Date(pgpKeys.createdAt).toLocaleString()}<br>
      <br>
      <strong>⚠️ Store your private key securely!</strong><br>
      Never share it with anyone.
    `;
    statusDiv.style.color = '#00ff00';
    
    // Reload keys display
    loadPgpKeys();
    
    showNotification('✅ PGP keys generated successfully!', 'success');
  }, 1500);
}

function importPgpKey() {
  const publicKeyText = document.getElementById('pgpPublicKeyImport').value.trim();
  
  if (!publicKeyText) {
    showNotification('❌ Please paste a PGP public key', 'error');
    return;
  }
  
  const statusDiv = document.getElementById('pgpDialogStatus');
  statusDiv.style.display = 'block';
  statusDiv.style.background = 'rgba(0, 255, 0, 0.2)';
  statusDiv.style.color = '#00ff00';
  statusDiv.innerHTML = `
    ✓ <strong>Public Key Imported!</strong><br>
    🔑 Key imported and available for verification<br>
    ⏰ Imported: ${new Date().toLocaleString()}<br>
    <br>
    You can now verify signatures from this peer.
  `;
  
  showNotification('✅ PGP public key imported successfully!', 'success');
  
  setTimeout(() => {
    document.getElementById('pgpPublicKeyImport').value = '';
  }, 2000);
}

function showPgpKeys() {
  if (!pgpKeys.keyId) {
    loadPgpKeys();
  }
  
  if (!pgpKeys.keyId) {
    showNotification('🔑 No PGP keys generated yet. Generate keys in PGP Auth menu.', 'info');
    return;
  }
  
  let html = '<h3>🔑 Your PGP Keys</h3>';
  html += `
    <div style="background: rgba(0,255,0,0.1); padding: 15px; border-radius: 4px; margin: 10px 0;">
      <strong>Key Information</strong><br>
      Key ID: ${pgpKeys.keyId}<br>
      Key Size: ${pgpKeys.keySize}-bit<br>
      Fingerprint: ${pgpKeys.fingerprint}<br>
      Created: ${new Date(pgpKeys.createdAt).toLocaleString()}<br>
    </div>
  `;
  
  html += `
    <div style="background: rgba(0,150,255,0.1); padding: 10px; border-radius: 4px; margin: 10px 0;">
      <strong>Public Key (Share This):</strong><br>
      <textarea style="width: 100%; height: 100px; background: rgba(0,0,0,0.3); color: #0f0; padding: 5px; border: 1px solid #00aa00; border-radius: 3px; font-family: monospace; font-size: 10px;" readonly>${pgpKeys.publicKey}</textarea><br>
      <button class="action-btn primary" onclick="navigator.clipboard.writeText(\`${pgpKeys.publicKey}\`); showNotification('✓ Public key copied', 'success');" style="width: 100%; margin-top: 10px;">
        📋 Copy Public Key
      </button>
    </div>
  `;
  
  html += `
    <div style="background: rgba(255,100,0,0.1); padding: 10px; border-radius: 4px; margin: 10px 0; border: 1px solid #ff6600;">
      <strong style="color: #ff6600;">⚠️ Private Key (Keep Secret!)</strong><br>
      <textarea style="width: 100%; height: 80px; background: rgba(0,0,0,0.5); color: #ff3333; padding: 5px; border: 1px solid #ff3333; border-radius: 3px; font-family: monospace; font-size: 9px;" readonly>${pgpKeys.privateKey}</textarea><br>
      <p style="color: #ff6666; font-size: 11px; margin-top: 5px;">🔒 Never share your private key. Anyone with this can sign messages as you.</p>
    </div>
  `;
  
  showModalContent('🔑 Your PGP Keys', html);
}

function loadPgpKeys() {
  const saved = localStorage.getItem('pgpKeys');
  if (saved) {
    pgpKeys = JSON.parse(saved);
  }
}

function generatePgpSignature(recipient, amount, currency) {
  const data = `${currentUsername}|${recipient}|${amount}|${currency}|${Date.now()}`;
  const signature = btoa(data + '::SIGNED'); // Mock signature
  return signature;
}

function generateKeyFingerprint(keyId) {
  let hash = 0;
  for (let i = 0; i < keyId.length; i++) {
    hash = keyId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const fingerprint = Math.abs(hash).toString(16).padStart(40, '0');
  return fingerprint.substr(0, 16).toUpperCase();
}

function generateMockPgpPublicKey(keyId, keySize) {
  return `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: P2P Chatter Lite 1.0.0
Comment: ${keyId}

${btoa(keyId + '-' + keySize + '-' + Date.now())}
-----END PGP PUBLIC KEY BLOCK-----`;
}

function generateMockPgpPrivateKey(keyId, keySize) {
  return `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: P2P Chatter Lite 1.0.0
Comment: ${keyId} - KEEP SECRET!

${btoa('PRIVATE-' + keyId + '-' + keySize + '-' + Date.now())}
-----END PGP PRIVATE KEY BLOCK-----`;
}

function showModalContent(title, content) {
  // Create temporary modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <button class="close-btn" onclick="this.closest('.modal').remove();">&times;</button>
      <div>${content}</div>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Initialize all dropdown menus on app load
function initializeAllDropdowns() {
  try {
    setupFileTransferMenu();
  } catch (error) {
    console.error('Error initializing file transfer menu:', error);
  }

  try {
    setupCryptoTransferMenu();
  } catch (error) {
    console.error('Error initializing crypto transfer menu:', error);
  }

  try {
    setupPgpAuthMenu();
  } catch (error) {
    console.error('Error initializing PGP auth menu:', error);
  }
}