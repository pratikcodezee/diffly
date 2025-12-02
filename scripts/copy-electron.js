const fs = require('fs');
const path = require('path');

// Copy electron files to build directory
const electronDir = path.join(__dirname, '../electron');
const buildDir = path.join(__dirname, '../build');

// Create electron directory in build for preload.js
const buildElectronDir = path.join(buildDir, 'electron');
if (!fs.existsSync(buildElectronDir)) {
  fs.mkdirSync(buildElectronDir, { recursive: true });
}

// Copy main.js to build/electron.js (react-cra preset expects it here)
const mainSrc = path.join(electronDir, 'main.js');
const mainDest = path.join(buildDir, 'electron.js');
if (fs.existsSync(mainSrc)) {
  fs.copyFileSync(mainSrc, mainDest);
  console.log('Copied main.js to build/electron.js');
}

// Copy preload.js to build/electron/ (needed for the main.js to reference)
const preloadSrc = path.join(electronDir, 'preload.js');
const preloadDest = path.join(buildElectronDir, 'preload.js');
if (fs.existsSync(preloadSrc)) {
  fs.copyFileSync(preloadSrc, preloadDest);
  console.log('Copied preload.js to build/electron/');
}

// Update package.json in build directory to point to electron.js
const buildPackageJsonPath = path.join(buildDir, 'package.json');
if (fs.existsSync(buildPackageJsonPath)) {
  const buildPackageJson = JSON.parse(fs.readFileSync(buildPackageJsonPath, 'utf8'));
  buildPackageJson.main = 'electron.js';
  fs.writeFileSync(
    buildPackageJsonPath,
    JSON.stringify(buildPackageJson, null, 2)
  );
  console.log('Updated package.json main path to electron.js');
} else {
  // If package.json doesn't exist in build, create it
  const rootPackageJson = require('../package.json');
  const buildPackageJson = {
    ...rootPackageJson,
    main: 'electron.js'
  };
  fs.writeFileSync(
    buildPackageJsonPath,
    JSON.stringify(buildPackageJson, null, 2)
  );
  console.log('Created package.json in build directory with main: electron.js');
}

