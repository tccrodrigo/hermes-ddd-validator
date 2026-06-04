# 🏗️ DDD Architecture Validator

[![CI](https://github.com/tccrodrigo/hermes-ddd-validator/actions/workflows/validate.yml/badge.svg)](https://github.com/tccrodrigo/hermes-ddd-validator/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Validate Domain-Driven Design patterns across **Java**, **Node.js/TypeScript**, and **Python** projects.

Generate interactive visual reports, export JSON for CI/CD, or run in watch mode during development.

<p align="center">
  <img src="https://img.shields.io/badge/Domain-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Application-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Infrastructure-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Interfaces-purple?style=for-the-badge" />
</p>

## ✨ Features

- 🔍 **Multi-language support**: TypeScript, JavaScript, Java, Python
- 📊 **Visual reports**: Beautiful HTML with architecture diagrams
- 🔄 **Watch mode**: Auto-validate on file changes
- 📤 **JSON output**: Perfect for CI/CD pipelines
- ⚙️ **Configurable**: `.dddrc.json` for custom rules
- 🎯 **Pattern detection**: Entities, Value Objects, Repositories, Domain Events
- 🚨 **Violations**: Detection of missing layers or anti-patterns

## 🚀 Quick Start

### Installation

```bash
# Clone the skill
git clone https://github.com/tccrodrigo/hermes-ddd-validator.git

# Automatic setup (installs Node.js if needed)
cd hermes-ddd-validator
node scripts/setup.js
```

### Validate Your Project

```bash
# Basic validation
node scripts/validate-ddd.js /path/to/project

# With visual report
node scripts/validate-ddd.js /path/to/project --visual

# JSON output for CI/CD
node scripts/validate-ddd.js /path/to/project --json > report.json

# Watch mode (re-runs on file change)
node scripts/validate-ddd.js /path/to/project --watch --visual

# Strict mode (fails on violations)
node scripts/validate-ddd.js /path/to/project --strict
```

## 📋 Usage

```
Usage: node validate-ddd.js <path> [options]

Options:
  --visual          Generate interactive HTML report
  --json            Output results as JSON
  --watch           Watch mode: re-run on file changes
  --config=<file>   Config file path (default: .dddrc.json)
  --silent          Suppress console output
  --strict          Exit with code 1 if violations found
  -h, --help        Show help
```

## 🏗️ Config File (.dddrc.json)

```json
{
  "rules": {
    "domainLayer": { "enabled": true, "required": true },
    "applicationLayer": { "enabled": true, "required": true },
    "infrastructureLayer": { "enabled": true, "required": false },
    "entities": { "enabled": true, "required": true },
    "repositories": { "enabled": true, "required": true, "interfaceOnly": true },
    "crossDomainDeps": { "enabled": true, "allowed": false }
  },
  "exclude": ["node_modules", "dist", "build", "__pycache__"],
  "output": { "format": "console", "colors": true }
}
```

## 📊 Example Output

### Console

```
📊 Statistics
  Files analyzed: 45
  Languages: typescript, javascript
  
🏛️ Layers
  domain: 12 files ✅
  application: 8 files ✅
  infrastructure: 6 files
  interfaces: 19 files
  
🎯 Patterns Detected
  entity: 8
  valueObject: 3
  repository: 12
  
⚠️ Violations
  ✓ None!
```

### HTML Report

Generates `ddd-report.html` with:
- Architecture layer visualization
- File-by-file breakdown
- Pattern detection badges
- Violation highlighting

## 🌐 Supported Patterns

| Pattern | TS/JS | Java | Python |
|---------|-------|------|--------|
| Entities | ✅ | ✅ | ✅ |
| Value Objects | ✅ | ✅ | ✅ |
| Repositories | ✅ | ✅ | ✅ |
| Domain Events | ✅ | ✅ | ✅ |
| Domain Services | ✅ | ✅ | ✅ |
| Application Services | ✅ | ✅ | ✅ |
| DTOs | ✅ | ✅ | ✅ |

## 📁 Examples

Check the `examples/` directory for complete DDD implementations:

- **[Node.js API](examples/nodejs-api/)** - TypeScript with clean architecture
- **[Java Spring](examples/java-spring/)** - Spring Boot with JPA
- **[Python FastAPI](examples/python-fastapi/)** - FastAPI with dataclasses

Run validation on examples:

```bash
node scripts/validate-ddd.js examples/nodejs-api --visual
node scripts/validate-ddd.js examples/java-spring --visual
node scripts/validate-ddd.js examples/python-fastapi --visual
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Validate DDD
  run: node scripts/validate-ddd.js . --json --strict
```

### Generic

```bash
# In your build script
if ! node scripts/validate-ddd.js . --strict; then
  echo "DDD violations found!"
  exit 1
fi
```

## 📜 License

MIT - See [LICENSE](LICENSE)

## 🤝 Contributing

Issues and PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

<p align="center">
  Made with ❤️ for the Hermes Agent community
</p>
