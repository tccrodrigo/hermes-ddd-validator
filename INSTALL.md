# Installation Guide

## Prerequisites

- **Node.js >= 16.0.0** (automatically installed by setup if missing)
- Git (for cloning the repository)

## One-Step Install

```bash
git clone https://github.com/tccrodrigo/hermes-ddd-validator.git
cd hermes-ddd-validator
node scripts/setup.js
```

The setup script will:
1. ✅ Check for Node.js (installs if needed)
2. ✅ Install dependencies (`npm install`)
3. ✅ Create sample `.dddrc.json` config

## Hermes Agent Integration

### Install as Skill

```bash
# Go to your Hermes skills directory
cd ~/.hermes/skills/

# Clone
git clone https://github.com/tccrodrigo/hermes-ddd-validator.git

# Setup (auto-installs Node.js if needed)
cd hermes-ddd-validator
node scripts/setup.js
```

Hermes Agent will automatically:
- Detect the skill is installed
- Run setup if Node.js is missing
- Make `ddd-validate` available in PATH

## Manual Installation

### 1. Install Node.js

#### macOS
```bash
brew install node
```

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### RHEL/CentOS/Fedora
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

#### Windows
Download from: https://nodejs.org/

Or via winget:
```bash
winget install OpenJS.NodeJS
```

### 2. Clone and Install

```bash
git clone https://github.com/tccrodrigo/hermes-ddd-validator.git
cd hermes-ddd-validator
npm install
```

## Global Install (Optional)

```bash
npm install -g
# or
ln -s $(pwd)/scripts/validate-ddd.js /usr/local/bin/ddd-validate
```

Now use globally:
```bash
ddd-validate /path/to/project --visual
```

## Verify Installation

```bash
# Check Node.js
node --version  # Should be >= 16

# Check validator
node scripts/validate-ddd.js --help

# Test on examples
node scripts/validate-ddd.js examples/nodejs-api --visual
```

## Troubleshooting

### "node: command not found"

Node.js not installed or not in PATH.

**Fix:**
```bash
# Re-run setup
node scripts/setup.js

# Or install manually via nvm/window installer
```

### Permission denied (Linux/macOS)

```bash
chmod +x scripts/validate-ddd.js
chmod +x scripts/setup.js
```

### Watch mode requires chokidar

```bash
cd hermes-ddd-validator
npm install chokidar
```

## Uninstall

```bash
# Remove skill directory
rm -rf ~/.hermes/skills/hermes-ddd-validator

# Or globally
npm uninstall -g hermes-ddd-validator
```

---

**Next:** Read [README.md](README.md) for usage examples.
