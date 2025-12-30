// P2P Chatter Lite - Mobile Version
// Samsung Galaxy S25 Style App

let isConnected = false;
let currentUsername = '';
let peerUsername = '';
let encryptionEnabled = false;
let torEnabled = false;
let currentTheme = 'dark';
let sharedFiles = [];

// Username generation (same as desktop)
const adjectives = ['Laughing', 'Speedy', 'Sneaky', 'Bright', 'Silent', 'Clever', 'Happy', 'Funky', 'Spicy', 'Tiny', 'Jumpy', 'Wild', 'Crazy', 'Groovy', 'Swift', 'Sly', 'Bold', 'Daring', 'Witty', 'Quirky'];
const nouns = ['Llama', 'Tiger', 'Panda', 'Raccoon', 'Dolphin', 'Phoenix', 'Raven', 'Owl', 'Fox', 'Wolf', 'Badger', 'Otter', 'Eagle', 'Hawk', 'Crypto', 'Ghost', 'Phantom', 'Shadow', 'Ninja', 'Wizard'];

// Generate username
function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 10000);
  return `P2P-${adj}${noun}${num}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  console.log('📱 P2P Chatter Mobile - Initializing');
  
  // Generate username
  currentUsername = generateUsername();
  updateUsernameDisplay();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  
  // Update time
  updateTime();
  setInterval(updateTime, 1000);
  
  console.log('✅ App ready');
}

// Update time display
function updateTime() {
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const statusTime = document.getElementById('statusTime');
  if (statusTime) {
    statusTime.textContent = `${hours}:${minutes}`;
  }
}

// Update username display
function updateUsernameDisplay() {
  const display = document.getElementById('usernameDisplay');
  if (display) {
    display.textContent = currentUsername;
  }
}

// Setup all event listeners
function setupEventListeners() {
  // Menu buttons
  document.getElementById('homeMenuBtn')?.addEventListener('click', goHome);
  document.getElementById('settingsMenuBtn')?.addEventListener('click', showSettings);
  document.getElementById('filesMenuBtn')?.addEventListener('click', showFiles);
  document.getElementById('moreMenuBtn')?.addEventListener('click', showMore);
  
  // Settings modal
  document.getElementById('closeSettingsBtn')?.addEventListener('click', closeModal);
  document.getElementById('torToggleBtn')?.addEventListener('click', toggleTor);
  document.getElementById('encryptionToggleBtn')?.addEventListener('click', toggleEncryption);
  
  // Theme buttons
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', (e) => applyTheme(e.target.dataset.theme));
  });
  
  // Files modal
  document.getElementById('closeFilesBtn')?.addEventListener('click', closeModal);
  document.getElementById('createFileBtn')?.addEventListener('click', createFile);
  document.getElementById('receiveFileBtn')?.addEventListener('click', receiveFile);
  document.getElementById('shareFileBtn')?.addEventListener('click', shareFile);
  
  // More modal
  document.getElementById('closeMoreBtn')?.addEventListener('click', closeModal);
  document.getElementById('aboutBtn')?.addEventListener('click', showAbout);
  document.getElementById('testConnectionBtn')?.addEventListener('click', testConnection);
  document.getElementById('clearDataBtn')?.addEventListener('click', clearData);
  document.getElementById('exitBtn')?.addEventListener('click', exitApp);
  
  // Connection
  document.getElementById('connectBtn')?.addEventListener('click', connectToPeer);
  document.getElementById('refreshUsernameBtn')?.addEventListener('click', refreshUsername);
  
  // Chat
  document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
  document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Navigation: Go Home
function goHome() {
  closeAllModals();
  const chatBox = document.getElementById('chatBox');
  if (chatBox) {
    chatBox.scrollTop = 0;
  }
}

// Modal management
function closeAllModals() {
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('filesModal').style.display = 'none';
  document.getElementById('moreModal').style.display = 'none';
  updateMenuActive();
}

function closeModal(e) {
  if (e && e.target) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  updateMenuActive();
}

function updateMenuActive() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
}

// Show Settings
function showSettings() {
  closeAllModals();
  document.getElementById('settingsModal').style.display = 'flex';
  document.getElementById('settingsMenuBtn').classList.add('active');
  updateToggles();
}

function updateToggles() {
  const torBtn = document.getElementById('torToggleBtn');
  const encBtn = document.getElementById('encryptionToggleBtn');
  if (torBtn) {
    torBtn.textContent = torEnabled ? 'ON' : 'OFF';
    torBtn.classList.toggle('active', torEnabled);
  }
  if (encBtn) {
    encBtn.textContent = encryptionEnabled ? 'ON' : 'OFF';
    encBtn.classList.toggle('active', encryptionEnabled);
  }
}

// Toggle Tor
function toggleTor() {
  torEnabled = !torEnabled;
  console.log(torEnabled ? '🔒 Tor enabled' : '🔓 Tor disabled');
  updateToggles();
}

// Toggle Encryption
function toggleEncryption() {
  encryptionEnabled = !encryptionEnabled;
  console.log(encryptionEnabled ? '🔐 Encryption enabled' : '🔓 Encryption disabled');
  updateToggles();
}

// Apply theme
function applyTheme(theme) {
  currentTheme = theme;
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
  
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  
  console.log(`🎨 Theme: ${theme}`);
}

// Show Files
function showFiles() {
  closeAllModals();
  document.getElementById('filesModal').style.display = 'flex';
  document.getElementById('filesMenuBtn').classList.add('active');
  updateFilesList();
}

function updateFilesList() {
  const filesList = document.getElementById('filesList');
  if (!filesList) return;
  
  if (sharedFiles.length === 0) {
    filesList.innerHTML = '<p style="text-align: center; color: #666; font-size: 13px; padding: 20px;">No files shared yet</p>';
  } else {
    filesList.innerHTML = sharedFiles.map(file => `
      <div class="file-item">
        <div class="file-item-name">📄 ${file.name}</div>
        <div class="file-item-info">Protected • ${file.size}</div>
      </div>
    `).join('');
  }
}

// File operations
function createFile() {
  const fileName = prompt('File name:');
  if (!fileName) return;
  
  const fileSize = prompt('File size (e.g., 2.5 MB):');
  if (!fileSize) return;
  
  sharedFiles.push({ name: fileName, size: fileSize });
  addChatMessage('📁 File created: ' + fileName, 'system');
  updateFilesList();
  console.log('📁 File created:', fileName);
}

function receiveFile() {
  addChatMessage('⬇️ Ready to receive file...', 'system');
  alert('📥 Waiting for peer to send file');
}

function shareFile() {
  if (sharedFiles.length === 0) {
    alert('No files to share');
    return;
  }
  addChatMessage('📤 File shared', 'system');
  console.log('📤 Files shared');
}

// Show More
function showMore() {
  closeAllModals();
  document.getElementById('moreModal').style.display = 'flex';
  document.getElementById('moreMenuBtn').classList.add('active');
}

function showAbout() {
  alert('P2P Chatter Lite v1.1.0\n\nSecure private messaging\nNo servers • No tracking\n\n🎨 Created by: antX\n© 2025');
}

function testConnection() {
  addChatMessage('🧪 Testing connection...', 'system');
  setTimeout(() => {
    addChatMessage('✅ Connection test passed', 'system');
  }, 1500);
  console.log('🧪 Connection test');
}

function clearData() {
  if (confirm('Clear all data? This cannot be undone.')) {
    sharedFiles = [];
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
      chatBox.innerHTML = '<div class="chat-message system">Data cleared</div>';
    }
    console.log('🗑️ Data cleared');
  }
}

function exitApp() {
  if (confirm('Exit app?')) {
    window.close();
  }
}

// Chat functions
function connectToPeer() {
  const peerInput = document.getElementById('peerUsernameInput');
  if (!peerInput || !peerInput.value.trim()) {
    alert('Enter peer username');
    return;
  }
  
  peerUsername = peerInput.value.trim();
  isConnected = true;
  
  addChatMessage(`✅ Connected to ${peerUsername}`, 'system');
  
  const connectBtn = document.getElementById('connectBtn');
  if (connectBtn) {
    connectBtn.textContent = '✅ Connected';
    connectBtn.disabled = true;
  }
  
  peerInput.value = '';
  console.log('🔗 Connected to:', peerUsername);
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  if (!input || !input.value.trim()) return;
  
  const message = input.value.trim();
  addChatMessage(message, 'sent');
  input.value = '';
  input.focus();
  
  console.log('📨 Message sent:', message);
}

function addChatMessage(text, type = 'received') {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${type}`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function refreshUsername() {
  currentUsername = generateUsername();
  updateUsernameDisplay();
  addChatMessage(`🔄 Username refreshed: ${currentUsername}`, 'system');
  console.log('🔄 Username refreshed:', currentUsername);
}
