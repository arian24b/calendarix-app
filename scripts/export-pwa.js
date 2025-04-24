#!/usr/bin/env node

/**
 * PWA Export Helper Script
 *
 * This script helps automate the process of exporting your PWA for Android and iOS app stores.
 * It provides interactive prompts to guide you through the export process.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function log(message, color = COLORS.reset) {
    console.log(`${color}${message}${COLORS.reset}`);
}

function executeCommand(command, errorMessage) {
    try {
        log(`Executing: ${command}`, COLORS.blue);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        log(errorMessage || `Error executing command: ${command}`, COLORS.red);
        log(error.message, COLORS.red);
        return false;
    }
}

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(`${COLORS.yellow}${question}${COLORS.reset}`, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function checkPrerequisites() {
    log('Checking prerequisites...', COLORS.bright);

    // Check Node.js version
    try {
        const nodeVersion = execSync('node --version').toString().trim();
        log(`✓ Node.js ${nodeVersion}`, COLORS.green);
    } catch (error) {
        log('✗ Node.js not found. Please install Node.js v10 or higher.', COLORS.red);
        return false;
    }

    // Check if build directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'out'))) {
        log('✗ Build directory not found. Run "npm run build" first.', COLORS.red);
        return false;
    }

    return true;
}

async function androidExport() {
    log('\n=== ANDROID EXPORT ===', COLORS.bright);

    // Check if Bubblewrap is installed
    try {
        execSync('bubblewrap --version');
        log('✓ Bubblewrap CLI found', COLORS.green);
    } catch (error) {
        log('Bubblewrap CLI not found. Installing...', COLORS.yellow);
        if (!executeCommand('npm install -g @bubblewrap/cli', 'Failed to install Bubblewrap CLI')) {
            return;
        }
    }

    // Create android-export directory if it doesn't exist
    const androidExportDir = path.join(process.cwd(), 'android-export');
    if (!fs.existsSync(androidExportDir)) {
        fs.mkdirSync(androidExportDir);
    }

    // Ask for PWA URL
    const pwaUrl = await askQuestion('Enter your deployed PWA URL (e.g., https://example.com): ');
    if (!pwaUrl) {
        log('PWA URL is required.', COLORS.red);
        return;
    }

    // Initialize Bubblewrap
    process.chdir(androidExportDir);
    if (!executeCommand(`bubblewrap init --manifest=${pwaUrl}/manifest.json`, 'Failed to initialize Bubblewrap')) {
        return;
    }

    // Build Android App Bundle
    if (executeCommand('bubblewrap build', 'Failed to build Android App Bundle')) {
        log('\n✓ Android App Bundle created successfully!', COLORS.green);
        log('You can find the .aab file in the android-export directory.', COLORS.green);

        // Get fingerprint for Digital Asset Links
        log('\nGenerating Digital Asset Links fingerprint...', COLORS.bright);
        try {
            const fingerprint = execSync('bubblewrap fingerprint').toString().trim();
            log('\nAdd the following to your website at .well-known/assetlinks.json:', COLORS.bright);
            const assetLinks = `[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "pro.calendarix.app",
    "sha256_cert_fingerprints": [
      "${fingerprint}"
    ]
  }
}]`;
            log(assetLinks, COLORS.blue);

            // Create assetlinks.json file
            const wellKnownDir = path.join(process.cwd(), '..', 'public', '.well-known');
            if (!fs.existsSync(wellKnownDir)) {
                fs.mkdirSync(wellKnownDir, { recursive: true });
            }
            fs.writeFileSync(path.join(wellKnownDir, 'assetlinks.json'), assetLinks);
            log('\n✓ Created assetlinks.json in public/.well-known/', COLORS.green);
        } catch (error) {
            log('Failed to generate fingerprint.', COLORS.red);
            log(error.message, COLORS.red);
        }
    }

    process.chdir('..');
}

async function iosExport() {
    log('\n=== iOS EXPORT ===', COLORS.bright);

    // Check if running on macOS
    const platform = process.platform;
    if (platform !== 'darwin') {
        log('iOS export is only available on macOS.', COLORS.red);
        log('Please use PWABuilder.com on a Mac to generate an iOS package.', COLORS.yellow);
        return;
    }

    // Check if Capacitor iOS is installed
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', '@capacitor', 'ios'))) {
        log('Capacitor iOS not found. Installing...', COLORS.yellow);
        if (!executeCommand('npm install @capacitor/ios', 'Failed to install Capacitor iOS')) {
            return;
        }
    }

    // Add iOS platform
    if (!executeCommand('npx cap add ios', 'Failed to add iOS platform')) {
        return;
    }

    // Sync web code to native project
    if (!executeCommand('npx cap sync ios', 'Failed to sync web code to iOS project')) {
        return;
    }

    // Open in Xcode
    if (executeCommand('npx cap open ios', 'Failed to open iOS project in Xcode')) {
        log('\n✓ iOS project opened in Xcode', COLORS.green);
        log('Follow the instructions in PWA_EXPORT_GUIDE.md to configure and submit your app to the App Store.', COLORS.green);
    }
}

async function main() {
    log('\n🚀 PWA Export Helper', COLORS.bright);
    log('This script will help you export your PWA for Android and iOS app stores.\n');

    if (!await checkPrerequisites()) {
        rl.close();
        return;
    }

    const choice = await askQuestion('\nChoose export platform:\n1. Android\n2. iOS\n3. Both\nEnter choice (1-3): ');

    if (choice === '1' || choice === '3') {
        await androidExport();
    }

    if (choice === '2' || choice === '3') {
        await iosExport();
    }

    log('\n🎉 Export process completed!', COLORS.bright);
    log('Refer to PWA_EXPORT_GUIDE.md for additional information and submission instructions.\n');

    rl.close();
}

main();
