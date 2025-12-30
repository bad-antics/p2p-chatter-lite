#!/usr/bin/env node

/**
 * P2P Chatter Lite - Dependency Installer
 * Installs all required dependencies for the application
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}═══ ${msg} ═══${colors.reset}\n`)
};

// Main installation function
async function install() {
  try {
    log.header('P2P Chatter Lite - Installer');
    
    log.info(`Platform: ${os.platform()}`);
    log.info(`Node Version: ${process.version}`);
    
    // Check if npm is available
    log.info('Checking for npm...');
    const npmVersion = await runCommand('npm', ['-v']);
    log.success(`npm ${npmVersion.trim()} found`);
    
    // Install dependencies
    log.header('Installing Dependencies');
    
    log.info('Installing npm dependencies...');
    await runCommand('npm', ['install'], { stdio: 'inherit' });
    log.success('npm dependencies installed');
    
    // Verify installation
    log.header('Verifying Installation');
    
    if (fs.existsSync(path.join(__dirname, 'node_modules', 'electron'))) {
      log.success('Electron installed');
    } else {
      throw new Error('Electron installation failed');
    }
    
    if (fs.existsSync(path.join(__dirname, 'node_modules', 'electron-builder'))) {
      log.success('electron-builder installed');
    } else {
      throw new Error('electron-builder installation failed');
    }
    
    // Check source files
    log.info('Checking source files...');
    const requiredFiles = [
      'main.js',
      'preload.js',
      'package.json',
      'src/index.html',
      'src/app.js',
      'src/styles.css'
    ];
    
    let allFilesPresent = true;
    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        log.success(`Found ${file}`);
      } else {
        log.error(`Missing ${file}`);
        allFilesPresent = false;
      }
    }
    
    if (!allFilesPresent) {
      throw new Error('Some required files are missing');
    }
    
    // Installation complete
    log.header('Installation Complete');
    log.success('All dependencies installed successfully!');
    
    console.log(`
${colors.cyan}Next Steps:${colors.reset}
1. Run: ${colors.bright}npm start${colors.reset} (to launch in dev mode)
2. Run: ${colors.bright}npm run build-win${colors.reset} (to build portable executable)
3. Check: ${colors.bright}dist/${colors.reset} for built application

${colors.cyan}Features:${colors.reset}
✓ AES-256-GCM Encryption
✓ Tor Support
✓ 6 Hacker Themes
✓ Auto-generated Usernames
✓ Network Monitor
✓ Discord-like UI

${colors.green}Thank you for installing P2P Chatter Lite!${colors.reset}
Privacy. Anonymity. Freedom. 🏴‍☠️
    `);
    
    process.exit(0);
    
  } catch (error) {
    log.error(`Installation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Helper function to run commands
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio || 'pipe',
      ...options
    });
    
    let stdout = '';
    let stderr = '';
    
    if (child.stdout) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }
    
    if (child.stderr) {
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`${command} exited with code ${code}: ${stderr}`));
      }
    });
  });
}

// Run installer
install();
