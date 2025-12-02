# Electron Desktop App Guide

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run electron-dev
```

This will start the React dev server and launch Electron automatically.

### Building Executables

#### Windows
```bash
npm run electron-build-win
```
Creates: `dist/DiffView Setup x.x.x.exe` (NSIS installer)

#### macOS
```bash
npm run electron-build-mac
```
Creates: `dist/DiffView-x.x.x.dmg`

#### Linux
```bash
npm run electron-build-linux
```
Creates: 
- `dist/DiffView-x.x.x.AppImage` (portable)
- `dist/diff-view_x.x.x_amd64.deb` (Debian package)

#### All Platforms
```bash
npm run electron-build
```

## Features

- ✅ **Standalone Executable**: No installation required (AppImage on Linux)
- ✅ **Native Performance**: Fast and responsive
- ✅ **Offline Support**: Works without internet connection
- ✅ **Cross-Platform**: Windows, macOS, and Linux support
- ✅ **Auto-Updates Ready**: Can be configured for automatic updates

## File Structure

```
DiffView/
├── electron/
│   ├── main.js       # Main Electron process
│   └── preload.js    # Preload script (security)
├── src/              # React app source
├── build/            # Production build (created by npm run build)
└── dist/             # Electron executables (created by electron-builder)
```

## Troubleshooting

### Build Fails

1. **Clear cache and rebuild:**
```bash
rm -rf node_modules build dist
npm install
npm run build
npm run electron-build
```

2. **Check Node.js version:**
   - Requires Node.js 18+

3. **Platform-specific issues:**
   - **Windows**: May need Visual Studio Build Tools
   - **macOS**: May need Xcode Command Line Tools
   - **Linux**: May need `fakeroot` and `dpkg` for .deb builds

### App Won't Start

1. Check if React build exists:
```bash
npm run build
```

2. Verify Electron main file:
```bash
node electron/main.js
```

### Performance Issues

- The app uses Monaco Editor which is optimized for performance
- Large files (>10MB) may experience slight delays
- Consider splitting very large comparisons

## Customization

### Change App Icon

1. Create icon files:
   - Windows: `build/icon.ico` (256x256)
   - macOS: `build/icon.icns` (512x512)
   - Linux: `build/icon.png` (512x512)

2. Update `package.json` build configuration if needed

### Change Window Size

Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // Change this
  height: 900,  // Change this
  // ...
});
```

### Disable DevTools in Production

In `electron/main.js`, remove or comment out:
```javascript
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

## Distribution

### Code Signing (Optional)

For production releases, configure code signing in `package.json`:

```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password"
  },
  "mac": {
    "identity": "Developer ID Application: Your Name"
  }
}
```

### Auto-Updates

Configure auto-updates using `electron-updater`:

1. Install:
```bash
npm install electron-updater --save-dev
```

2. Add update configuration to `package.json` build section

3. Implement update logic in `electron/main.js`

## License

Same as main project license.

