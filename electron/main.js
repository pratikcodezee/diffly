const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  // Set icon based on platform
  let iconPath;
  const fs = require('fs');
  
  // Icon paths - in dev, go up one level, in production they're at the same level
  const iconBasePath = isDev 
    ? path.join(__dirname, '../assets/icons')
    : path.join(__dirname, 'assets/icons');
  
  if (process.platform === 'win32') {
    iconPath = path.join(iconBasePath, 'icon.ico');
  } else if (process.platform === 'darwin') {
    iconPath = path.join(iconBasePath, 'icon.icns');
  } else {
    iconPath = path.join(iconBasePath, 'icon.png');
  }

  // Determine preload path based on environment
  let preloadPath;
  if (isDev) {
    // In development, preload.js is in the electron directory
    preloadPath = path.join(__dirname, 'preload.js');
  } else {
    // In production (packaged), electron.js is at root, preload.js is in electron/ subdirectory
    preloadPath = path.join(__dirname, 'electron', 'preload.js');
  }

  // Only set icon if file exists
  const windowOptions = {
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: preloadPath,
    },
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  };

  if (fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOptions);

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window controls (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

