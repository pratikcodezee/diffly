# Icon Setup Instructions

This guide explains how to add your chameleon icon to both the web app and Electron desktop app.

## Icon Requirements

### Web App Icons (React)

Place these files in the `public/` directory:

1. **favicon.ico**

   - Size: 16x16, 32x32, or 48x48 pixels
   - Format: ICO (multi-resolution)
   - Location: `public/favicon.ico`

2. **icon.png**
   - Size: 192x192 and/or 512x512 pixels (PNG can scale)
   - Format: PNG with transparency
   - Location: `public/icon.png`

### Electron Desktop App Icons

Place these files in the `assets/icons/` directory:

1. **icon.ico** (Windows)

   - Size: 256x256 pixels minimum
   - Format: ICO file
   - Location: `assets/icons/icon.ico`
   - Convert PNG to ICO: https://convertio.co/png-ico/

2. **icon.icns** (macOS)

   - Size: 512x512 pixels minimum
   - Format: ICNS file
   - Location: `assets/icons/icon.icns`
   - Convert PNG to ICNS: https://cloudconvert.com/png-to-icns
   - Or use: `iconutil -c icns icon.iconset` (macOS only)

3. **icon.png** (Linux)
   - Size: 512x512 pixels
   - Format: PNG with transparency
   - Location: `assets/icons/icon.png`

## Quick Setup Steps

### Step 1: Prepare Your Chameleon Icon

1. Start with a high-resolution PNG (1024x1024 or larger)
2. Ensure it has a transparent background
3. The icon should be recognizable at small sizes

### Step 2: Create Web App Icons

1. **For favicon.ico:**

   - Use an online converter: https://favicon.io/favicon-converter/
   - Upload your PNG
   - Download the generated `favicon.ico`
   - Replace `public/favicon.ico`

2. **For icon.png:**
   - Resize your source image to 512x512 pixels
   - Save as PNG with transparency
   - Replace `public/icon.png`

### Step 3: Create Electron Icons

1. **Windows (icon.ico):**

   - Go to https://convertio.co/png-ico/
   - Upload your 512x512 PNG
   - Download the ICO file
   - Replace `assets/icons/icon.ico`

2. **macOS (icon.icns):**

   - Go to https://cloudconvert.com/png-to-icns
   - Upload your 512x512 PNG
   - Download the ICNS file
   - Replace `assets/icons/icon.icns`

   **OR** on macOS, create an iconset:

   ```bash
   mkdir icon.iconset
   # Add images at different sizes (icon_16x16.png, icon_32x32.png, etc.)
   iconutil -c icns icon.iconset
   ```

3. **Linux (icon.png):**
   - Use your 512x512 PNG
   - Replace `assets/icons/icon.png`

## Verification

### Web App

1. Run `npm start`
2. Check the browser tab - you should see your favicon
3. Check `http://localhost:3000/favicon.ico` in browser

### Electron App

1. Run `npm run electron-dev`
2. Check the window icon in the title bar
3. Build the app: `npm run electron-build-win` (or mac/linux)
4. Check the executable icon

## Icon Design Tips

- **Keep it simple**: Icons should be recognizable at 16x16 pixels
- **Use high contrast**: Ensure visibility on both light and dark backgrounds
- **Test at small sizes**: Make sure details don't disappear when scaled down
- **Consistent style**: Match your app's design language

## Troubleshooting

### Icon not showing in Electron

- Ensure the icon file exists in `assets/icons/`
- Check file format is correct (.ico, .icns, .png)
- Rebuild the app: `npm run build && npm run electron-build`

### Favicon not showing in browser

- Clear browser cache
- Check `public/favicon.ico` exists
- Verify the HTML includes the favicon link (already configured)

### Icon looks blurry

- Use higher resolution source images (1024x1024 or larger)
- Ensure you're using the correct format for each platform
- For ICO files, include multiple resolutions (16x16, 32x32, 48x48, 256x256)

## File Structure After Setup

```
DiffView/
├── public/
│   ├── favicon.ico          ← Your chameleon icon (web)
│   └── icon.png             ← Your chameleon icon (web)
├── assets/
│   └── icons/
│       ├── icon.ico          ← Your chameleon icon (Windows)
│       ├── icon.icns         ← Your chameleon icon (macOS)
│       └── icon.png          ← Your chameleon icon (Linux)
└── ...
```

## Automated Icon Generation (Optional)

If you have ImageMagick installed:

```bash
# Generate favicon.ico from source.png
convert source.png -resize 256x256 favicon.ico

# Generate Windows icon
convert source.png -resize 256x256 icon.ico

# Generate Linux icon
convert source.png -resize 512x512 icon.png
```

For macOS, you'll need to use the iconutil command or an online converter.
