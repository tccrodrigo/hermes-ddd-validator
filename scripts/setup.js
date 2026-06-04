#!/usr/bin/env node
// Setup script - installs Node.js if needed and dependencies

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNode() {
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    const major = parseInt(version.slice(1).split('.')[0]);
    if (major >= 16) {
      log(`✓ Node.js ${version} detected`, 'green');
      return true;
    }
    log(`⚠ Node.js ${version} is too old (need >= 16)`, 'yellow');
    return false;
  } catch {
    log('✗ Node.js not found', 'red');
    return false;
  }
}

function installNode() {
  log('\n📦 Installing Node.js...', 'cyan');
  
  const platform = process.platform;
  
  try {
    if (platform === 'darwin') {
      // macOS
      try {
        execSync('brew --version', { stdio: 'ignore' });
        log('Installing via Homebrew...', 'cyan');
        execSync('brew install node', { stdio: 'inherit' });
      } catch {
        log('Homebrew not found. Please install Node.js manually:', 'red');
        log('  https://nodejs.org/', 'yellow');
        process.exit(1);
      }
    } else if (platform === 'linux') {
      // Linux
      log('Installing via package manager...', 'cyan');
      try {
        // Try apt (Debian/Ubuntu)
        execSync('apt-get --version', { stdio: 'ignore' });
        execSync('curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -', { stdio: 'inherit' });
        execSync('sudo apt-get install -y nodejs', { stdio: 'inherit' });
      } catch {
        // Try yum/dnf (RHEL/CentOS/Fedora)
        try {
          execSync('yum --version', { stdio: 'ignore' });
          execSync('curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -', { stdio: 'inherit' });
          execSync('sudo yum install -y nodejs', { stdio: 'inherit' });
        } catch {
          log('Please install Node.js manually:', 'red');
          log('  https://nodejs.org/', 'yellow');
          process.exit(1);
        }
      }
    } else if (platform === 'win32') {
      // Windows
      log('Please install Node.js manually:', 'red');
      log('  https://nodejs.org/', 'yellow');
      log('  Or use winget: winget install OpenJS.NodeJS', 'yellow');
      process.exit(1);
    }
    
    log('✓ Node.js installed successfully', 'green');
  } catch (error) {
    log('Failed to install Node.js', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function installDependencies() {
  const skillDir = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(skillDir, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('\n📦 Creating package.json...', 'cyan');
    const pkg = {
      "name": "hermes-ddd-validator",
      "version": "1.0.0",
      "description": "DDD Architecture Validator",
      "bin": {
        "ddd-validate": "./scripts/validate-ddd.js"
      },
      "scripts": {
        "validate": "node scripts/validate-ddd.js"
      },
      "dependencies": {
        "chokidar": "^3.5.3"
      }
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  }
  
  log('\n📦 Installing dependencies...', 'cyan');
  try {
    execSync('npm install', { cwd: skillDir, stdio: 'inherit' });
    log('✓ Dependencies installed', 'green');
  } catch (error) {
    log('✗ Failed to install dependencies', 'red');
    process.exit(1);
  }
}

function createConfig(configPath) {
  if (fs.existsSync(configPath)) {
    log(`✓ Config exists: ${configPath}`, 'green');
    return;
  }
  
  const defaultConfig = {
    "rules": {
      "domainLayer": { "enabled": true, "required": true },
      "applicationLayer": { "enabled": true, "required": true },
      "infrastructureLayer": { "enabled": true, "required": false },
      "interfacesLayer": { "enabled": true, "required": false },
      "entities": { "enabled": true, "required": true },
      "valueObjects": { "enabled": true, "required": false },
      "domainServices": { "enabled": true, "required": false },
      "repositories": { "enabled": true, "required": true, "interfaceOnly": true },
      "domainEvents": { "enabled": true, "required": false },
      "applicationServices": { "enabled": true, "required": false },
      "dto": { "enabled": true, "required": false },
      "crossDomainDeps": { "enabled": true, "allowed": false }
    },
    "exclude": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "*.test.*",
      "*.spec.*"
    ],
    "output": {
      "format": "console",
      "colors": true,
      "verbose": false
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  log(`✓ Created config: ${configPath}`, 'green');
}

// Main
log('🔧 DDD Validator Setup\n', 'cyan');

if (!checkNode()) {
  installNode();
  if (!checkNode()) {
    log('Node.js installation failed', 'red');
    process.exit(1);
  }
}

installDependencies();

// Create example config in project if running in a project
const projectConfigPath = path.join(process.cwd(), '.dddrc.json');
createConfig(projectConfigPath);

log('\n✅ Setup complete! Run:', 'green');
log('   node scripts/validate-ddd.js . --visual', 'cyan');
