# Diffly - Code Comparison Tool

A beautiful code comparison tool with syntax highlighting, formatting, and visual diff capabilities. Built with React.js and Monaco Editor.

**Live Site:** [https://pratikcodezee.github.io/diffly](https://pratikcodezee.github.io/diffly)

## Features

- ✨ **Live Diff Comparison**: Real-time text comparison with live updates as you type
- 🔍 **Visual Diff**: Monaco Diff Editor showing additions (green) and deletions (red)
- 🎨 **Syntax Highlighting**: Full syntax highlighting support for 14+ programming languages
- 🌓 **Light/Dark Mode**: Toggle between light and dark themes (persists across sessions)
- 📐 **Code Formatting**: Format button to beautify code/text (JSON, JavaScript, HTML, etc.)
- 👁️ **View Modes**: Toggle between side-by-side and inline diff views
- 🧹 **Clear Controls**: Clear all button to reset both editors
- 🎯 **Language Selection**: Choose from 14+ programming languages and text formats
- 🖥️ **Electron App**: Standalone desktop application (Windows, macOS, Linux)
- 🐳 **Docker Support**: Fully containerized for easy deployment

## Prerequisites

- Node.js 18+ and npm (for local development)
- Docker and Docker Compose (for containerized deployment)
- Electron (for desktop app - installed automatically)

## Local Development

### Installation

1. Clone or navigate to the project directory:

```bash
cd Diffly
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Google Analytics (Optional)

To enable Google Analytics 4:

1. **Create a GA4 property** at [analytics.google.com](https://analytics.google.com) and get your Measurement ID (format: `G-XXXXXXXXXX`).

2. **Local development** – Create a `.env` file in the project root:

   ```
   REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **GitHub Pages** – Add the ID as a repository secret:
   - Repo → **Settings** → **Secrets and variables** → **Actions**
   - New repository secret: `REACT_APP_GA_MEASUREMENT_ID` = your Measurement ID
   - The next deployment will include Analytics.

## Electron Desktop App

### Development Mode

Run the app in Electron development mode:

```bash
npm run electron-dev
```

This will:

1. Start the React development server
2. Launch Electron when the server is ready
3. Open DevTools automatically

### Building Executable

Build platform-specific executables:

**Windows:**

```bash
npm run electron-build-win
```

**macOS:**

```bash
npm run electron-build-mac
```

**Linux:**

```bash
npm run electron-build-linux
```

**All Platforms:**

```bash
npm run electron-build
```

The built executables will be in the `dist` folder:

- **Windows**: `.exe` installer (NSIS)
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` and `.deb` files

### Electron Features

- ✅ Standalone executable - no installation needed (AppImage on Linux)
- ✅ Native performance
- ✅ Works offline
- ✅ Auto-updates ready (can be configured)
- ✅ Cross-platform (Windows, macOS, Linux)

## Docker Deployment

### Quick Start with Docker Compose

1. Build and run the container:

```bash
docker-compose up -d
```

2. Access the application at [http://localhost:9800](http://localhost:9800)

3. Stop the container:

```bash
docker-compose down
```

### Manual Docker Build

1. Build the Docker image:

```bash
docker build -t diffly:latest .
```

2. Run the container:

```bash
docker run -d -p 9800:80 --name diffly-app diffly:latest
```

3. Access the application at [http://localhost:9800](http://localhost:9800)

4. Stop and remove the container:

```bash
docker stop diffly-app
docker rm diffly-app
```

## Usage

1. **Select Language**: Choose the appropriate language from the dropdown (affects syntax highlighting and formatting)

2. **Paste Text**:

   - Paste your original text in the left editor
   - Paste your modified text in the right editor

3. **Format Code**: Click the "Format" button to beautify your text (works best with JSON, JavaScript, HTML, etc.)

4. **View Differences**: Differences are shown in real-time with color-coded changes:

   - 🟢 Green: Added content
   - 🔴 Red: Removed content

5. **Toggle View Mode**: Switch between "Side by Side" and "Inline" views

6. **Clear**: Use "Clear" button to reset both editors

## Supported Languages

- Plain Text
- JavaScript
- TypeScript
- JSON
- HTML
- CSS
- Python
- Java
- C#
- C++
- XML
- YAML
- Markdown
- SQL

## Technology Stack

- **React.js** - UI framework
- **Monaco Editor** - Code editor (the same editor that powers VS Code)
- **Monaco Diff Editor** - Visual diff comparison
- **Nginx** - Web server for production deployment
- **Docker** - Containerization
- **Electron** - Desktop application framework

## Project Structure

```
Diffly/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── electron/
│   ├── main.js         # Electron main process
│   └── preload.js      # Electron preload script
├── Dockerfile          # Docker build configuration
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx server configuration
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Author

**Pratik Gohil**

## License

This project is open source and available for personal and commercial use.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
