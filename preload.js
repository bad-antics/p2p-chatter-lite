const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('api', {
  // Create desktop shortcut
  createShortcut: () => {
    return ipcRenderer.send('create-shortcut');
  },

  // Get app information
  getAppInfo: () => {
    return ipcRenderer.invoke('get-app-info');
  },

  // Listen for shortcut creation result
  onShortcutCreated: (callback) => {
    ipcRenderer.on('shortcut-created', (event, success) => {
      callback(success);
    });
  },

  // Listen for about dialog
  onShowAbout: (callback) => {
    ipcRenderer.on('show-about', () => {
      callback();
    });
  }
});
