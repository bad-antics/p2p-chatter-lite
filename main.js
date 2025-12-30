const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Disable GPU to fix graphics issues on some systems
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;
let splashWindow;
let desktopShortcutCreated = false;

// Create splash screen
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 900,
    height: 700,
    center: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: true,
    icon: path.join(__dirname, 'assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  const splashPath = path.join(__dirname, 'src/splash.html');
  splashWindow.loadFile(splashPath).catch(err => {
    console.error('Failed to load splash:', err);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  });

  // Close splash after 4 seconds and show main window
  setTimeout(() => {
    try {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
      }
    } catch (e) {}
    splashWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  }, 4000);

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

// Create main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, 'assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  const indexPath = path.join(__dirname, 'src/index.html');
  console.log('Loading:', indexPath);
  console.log('File exists:', fs.existsSync(indexPath));
  
  mainWindow.loadFile(indexPath).catch(err => {
    console.error('Failed to load file:', err);
  });

  // Show window when ready (splash will handle display timing)
  mainWindow.webContents.on('did-finish-load', () => {
    // Window will be shown by splash screen closing
  });

  // Create application menu
  createMenu();

  // Open developer tools in dev mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Create Desktop Shortcut',
          click: () => {
            createDesktopShortcut();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About P2P Chatter Lite',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-about');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Create desktop shortcut
function createDesktopShortcut() {
  try {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const shortcutPath = path.join(desktopPath, 'P2P Chatter Lite.lnk');
    
    // For Windows, we use a batch file approach or rely on installer
    const exePath = process.execPath;
    const appPath = app.getAppPath();

    // Create shortcut using shell.createShortCut (Windows)
    if (process.platform === 'win32') {
      const WshShell = new (require('wscript.shell'))();
      const shortcut = WshShell.CreateShortCut(shortcutPath);
      shortcut.TargetPath = exePath;
      shortcut.WorkingDirectory = appPath;
      shortcut.Description = 'P2P Chatter Lite - Privacy-Focused Messaging';
      shortcut.IconLocation = path.join(appPath, 'assets/icon.ico');
      shortcut.Save();
      
      desktopShortcutCreated = true;
      if (mainWindow) {
        mainWindow.webContents.send('shortcut-created', true);
      }
    }
  } catch (err) {
    console.log('Shortcut creation method 1 failed, using alternative...');
    // Fallback: use PowerShell script
    createShortcutWithPowerShell();
  }
}

// Fallback method using PowerShell
function createShortcutWithPowerShell() {
  try {
    const { exec } = require('child_process');
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const exePath = process.execPath;
    const shortcutPath = path.join(desktopPath, 'P2P Chatter Lite.lnk');
    const iconPath = path.join(app.getAppPath(), 'assets/icon.ico').replace(/\\/g, '\\\\');

    const psScript = `
      $WshShell = New-Object -ComObject WScript.Shell
      $shortcut = $WshShell.CreateShortcut("${shortcutPath}")
      $shortcut.TargetPath = "${exePath}"
      $shortcut.IconLocation = "${iconPath}"
      $shortcut.Description = "P2P Chatter Lite - Privacy-Focused Messaging"
      $shortcut.Save()
    `;

    exec(`powershell -Command "${psScript}"`, (error) => {
      if (!error && mainWindow) {
        desktopShortcutCreated = true;
        mainWindow.webContents.send('shortcut-created', true);
      }
    });
  } catch (err) {
    console.error('Failed to create shortcut:', err);
  }
}

// IPC handlers
ipcMain.on('create-shortcut', () => {
  createDesktopShortcut();
});

ipcMain.handle('get-app-info', async () => {
  return {
    version: app.getVersion(),
    appPath: app.getAppPath(),
    shortcutCreated: desktopShortcutCreated
  };
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
  app.quit();
});

// App event handlers
// Use modern async pattern for Electron 27+
app.whenReady().then(() => {
  createWindow();
  createSplashWindow();
}).catch(err => {
  console.error('Failed to initialize app:', err);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    createSplashWindow();
  }
});

// Handle Windows installer first run
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

module.exports = { createDesktopShortcut };
