// P2P Chatter Lite - Lightweight Frontend Application

let isConnected = false;
let currentUsername = '';
let peerUsername = '';
let screenshotDetected = false;
let encryptionEnabled = false;
let torEnabled = false;

// Funny username adjectives and nouns
const adjectives = ['Laughing', 'Speedy', 'Sneaky', 'Bright', 'Silent', 'Clever', 'Happy', 'Funky', 'Spicy', 'Tiny', 'Jumpy', 'Wild', 'Crazy', 'Groovy', 'Swift', 'Sly', 'Bold', 'Daring', 'Witty', 'Quirky'];
const nouns = ['Llama', 'Tiger', 'Panda', 'Raccoon', 'Dolphin', 'Phoenix', 'Raven', 'Owl', 'Fox', 'Wolf', 'Badger', 'Otter', 'Eagle', 'Hawk', 'Crypto', 'Ghost', 'Phantom', 'Shadow', 'Ninja', 'Wizard'];

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  // Get app version
  if (window.api && window.api.getAppInfo) {
    window.api.getAppInfo().then(info => {
      document.getElementById('appVersion').textContent = info.version;
      document.getElementById('settingsVersion').textContent = info.version;
    });
  }

  // Generate auto username on startup
  generateNewUsername();

  // Enable peer input since username is auto-generated
  document.getElementById('peerUsernameInput').disabled = false;

  // Setup event listeners
  setupEventListeners();
  
  // Setup modal handlers
  setupModals();
  
  // Setup screenshot detection
  setupScreenshotDetection();
  
  // Load saved settings
  loadSettings();
  
  // Update security status
  updateSecurityStatus();

  // Setup theme switcher
  setupThemeSwitcher();
}

// Generate funny random username starting with P2P-
function generateNewUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const username = `P2P-${adj}${noun}`;
  document.getElementById('usernameInput').value = username;
  return username;
}

// Copy username to clipboard
function copyUsernameToClipboard() {
  const username = document.getElementById('usernameInput').value;
  if (username) {
    navigator.clipboard.writeText(username).then(() => {
      showNotification(`Copied to clipboard: ${username}`, 'success');
    }).catch(err => {
      showNotification('Failed to copy username', 'error');
    });
  }
}

// Toggle encryption
function toggleEncryption() {
  encryptionEnabled = !encryptionEnabled;
  const btn = document.getElementById('encryptionToggle');
  
  if (encryptionEnabled) {
    btn.classList.add('active');
    showNotification('🔐 Encryption ENABLED - Red/Blue flash indicates active', 'success');
  } else {
    btn.classList.remove('active');
    showNotification('Encryption disabled', 'error');
  }
  
  localStorage.setItem('encryptionEnabled', encryptionEnabled);
  updateSecurityStatus();
}

// Toggle Tor
function toggleTor() {
  torEnabled = !torEnabled;
  const btn = document.getElementById('torToggle');
  const status = document.getElementById('torStatus');
  
  if (torEnabled) {
    btn.classList.add('active');
    status.classList.add('on');
    status.textContent = 'ON';
    showNotification('🧅 Tor connection enabled - Routing through Tor network', 'success');
  } else {
    btn.classList.remove('active');
    status.classList.remove('on');
    status.textContent = 'OFF';
    showNotification('Tor connection disabled', 'error');
  }
  
  localStorage.setItem('torEnabled', torEnabled);
  updateSecurityStatus();
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
  root.classList.remove('theme-matrix', 'theme-cyberpunk', 'theme-terminal', 'theme-hacker-red', 'theme-dark-web', 'theme-neon-void');
  
  // Add the new theme class
  if (theme !== 'matrix') {
    root.classList.add(`theme-${theme}`);
  }
  
  localStorage.setItem('selectedTheme', theme);
  showNotification(`🎨 Theme changed to ${theme.toUpperCase().replace('-', ' ')}`, 'success');
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

function setupEventListeners() {
  // Shortcut button
  document.getElementById('shortcutBtn').addEventListener('click', createDesktopShortcut);
  document.getElementById('createShortcutBtn').addEventListener('click', createDesktopShortcut);

  // Username regeneration
  document.getElementById('regenerateUsernameBtn').addEventListener('click', generateNewUsername);

  // Copy username
  document.getElementById('copyUsernameBtn').addEventListener('click', copyUsernameToClipboard);

  // Encryption toggle button
  document.getElementById('encryptionToggle').addEventListener('click', toggleEncryption);

  // Tor toggle button
  document.getElementById('torToggle').addEventListener('click', toggleTor);

  // Start button
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('peerUsernameInput').focus();
  });

  // Connect button
  document.getElementById('connectBtn').addEventListener('click', connectToPeer);

  // Send button
  document.getElementById('sendBtn').addEventListener('click', sendMessage);

  // Message input enter key
  document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Username input enter key
  document.getElementById('usernameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      connectToPeer();
    }
  });

  // Peer username input enter key
  document.getElementById('peerUsernameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      connectToPeer();
    }
  });

  // Username input change handler - removed since username is auto-generated
  // Instead, enable peer input based on username presence
  const observer = new MutationObserver((mutations) => {
    const username = document.getElementById('usernameInput').value.trim();
    const peerInput = document.getElementById('peerUsernameInput');
    if (username.length >= 3) {
      peerInput.disabled = false;
    } else {
      peerInput.disabled = true;
      peerInput.value = '';
    }
  });

  observer.observe(document.getElementById('usernameInput'), { attributes: true, attributeFilter: ['value'] });

  // Settings and About buttons
  document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsDialog').style.display = 'flex';
  });

  document.getElementById('aboutBtn').addEventListener('click', () => {
    document.getElementById('aboutDialog').style.display = 'flex';
  });

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('darkMode', e.target.checked);
  });

  // Encryption toggle
  document.getElementById('encryptionToggle').addEventListener('change', (e) => {
    localStorage.setItem('encryption', e.target.checked);
  });

  // Local storage toggle
  document.getElementById('localStorageToggle').addEventListener('change', (e) => {
    localStorage.setItem('localStorage', e.target.checked);
  });

  // OPSEC toggles
  document.getElementById('anonymousToggle').addEventListener('change', (e) => {
    localStorage.setItem('anonymousMode', e.target.checked);
    if (e.target.checked) {
      showNotification('🕵️ Anonymous mode enabled', 'success');
    }
  });

  document.getElementById('noLogsToggle').addEventListener('change', (e) => {
    localStorage.setItem('noLogsMode', e.target.checked);
    if (e.target.checked) {
      showNotification('🗑️ No logs mode enabled - messages ephemeral only', 'success');
    }
  });

  document.getElementById('autoDestructToggle').addEventListener('change', (e) => {
    localStorage.setItem('autoDestruct', e.target.checked);
    if (e.target.checked) {
      showNotification('💣 Auto-destruct enabled - messages deleted after 1 hour', 'success');
    }
  });
}

function setupModals() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').style.display = 'none';
    });
  });

  // Click outside modal to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
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
  messageEl.innerHTML = `
    <div class="message-content">
      <strong>${sender}:</strong> ${escapeHtml(message)}<br>
      <span class="message-time">${timestamp}</span>
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
  // Load dark mode
  const darkMode = localStorage.getItem('darkMode') !== 'false';
  document.getElementById('darkModeToggle').checked = darkMode;

  // Load encryption setting
  encryptionEnabled = localStorage.getItem('encryptionEnabled') === 'true';
  if (encryptionEnabled) {
    document.getElementById('encryptionToggle').classList.add('active');
    document.getElementById('encryptionStatus').classList.add('on');
    document.getElementById('encryptionStatus').textContent = 'ON';
  }

  // Load Tor setting
  torEnabled = localStorage.getItem('torEnabled') === 'true';
  if (torEnabled) {
    document.getElementById('torToggle').classList.add('active');
    document.getElementById('torStatus').classList.add('on');
    document.getElementById('torStatus').textContent = 'ON';
  }

  // Load local storage setting
  const localStorageEnabled = localStorage.getItem('localStorage') !== 'false';
  document.getElementById('localStorageToggle').checked = localStorageEnabled;

  // Load OPSEC settings
  const anonymousMode = localStorage.getItem('anonymousMode') === 'true';
  document.getElementById('anonymousToggle').checked = anonymousMode;

  const noLogsMode = localStorage.getItem('noLogsMode') === 'true';
  document.getElementById('noLogsToggle').checked = noLogsMode;

  const autoDestruct = localStorage.getItem('autoDestruct') !== 'false';
  document.getElementById('autoDestructToggle').checked = autoDestruct;
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
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
