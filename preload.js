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

  // Close the application window
  closeWindow: () => {
    return ipcRenderer.send('close-window');
  },

