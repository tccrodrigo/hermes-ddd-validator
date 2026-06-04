# Installation Guide

## Quick Install

### Option 1: Clone and Run (Recommended)

```bash
# Clone the repository
git clone https://github.com/tccrodrigo/hermes-ddd-validator.git

# Navigate to your project
cd your-project

# Run the validator
node /path/to/hermes-ddd-validator/scripts/validate-ddd.js . --visual
```

### Option 2: Copy Script to Your Project

```bash
# Copy the validator script to your project
cp scripts/validate-ddd.js your-project/scripts/

# Make it executable (optional)
chmod +x your-project/scripts/validate-ddd.js

# Run it
cd your-project
./scripts/validate-ddd.js . --visual --doc=./docs
```

### Option 3: Global Install (NPM)

```bash
# Link globally
npm link

# Or install from local source
npm install -g /path/to/hermes-ddd-validator

# Run anywhere
validate-ddd . --visual
```

## Requirements

- **Node.js** >= 18.0.0
- Your project must have one of:
  - `package.json` (Node.js/React projects)
  - `pom.xml` or `build.gradle` (Java projects)
  - `requirements.txt` or `pyproject.toml` (Python projects)

## First Run

1. **Validate your project:**

```bash
cd your-project
node /path/to/hermes-ddd-validator/scripts/validate-ddd.js . --visual
```

2. **Check the output:**

```
📂 Location: /your-project/docs

Generated files:
   📄 index.html       ← Open in browser (human view)
   📄 INDEX.md         ← Read first (AI context)
   📄 VALIDATION_REPORT.md    ← Violations found
   📄 C4_CONTEXT.md           ← C4 Level 1
   📄 C4_CONTAINERS.md        ← C4 Level 2
   📄 C4_COMPONENTS.md        ← C4 Level 3
   📄 BOUNDED_CONTEXTS.md     ← Context map
```

3. **Review violations (if any):**

If violations are found, the validator will recommend:

```
📝 RECOMMENDATION: Invoke /brainstorming to create DDD adequacy plan
```

4. **Create adequacy plan (if violations exist):**

Use your AI agent (Hermes/Claude/etc) with the `brainstorming` skill:

```
/brainstorming Create DDD adequacy plan for this project.

Context:
- Framework: [auto-detected]
- Violations: [from VALIDATION_REPORT.md]
- Docs: ./docs/
```

## Configuration

### Output Directory

```bash
# Default: ./docs
node validate-ddd.js . --visual

# Custom: ./architecture
node validate-ddd.js . --visual --doc=./architecture

# CI/CD output
node validate-ddd.js . --visual --doc=$CI_ARTIFACTS_DIR
```

### Strict Mode (CI/CD)

```bash
# Fail on any violation (useful for CI)
node validate-ddd.js . --strict

# In CI (GitHub Actions, GitLab, etc)
node validate-ddd.js . --strict || exit 1
```

### Specific Bounded Context

```bash
# Validate only user context
node validate-ddd.js . --bounded-context=user --visual
```

## Integration Examples

### GitHub Actions

```yaml
name: DDD Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Clone DDD Validator
        run: |
          git clone https://github.com/tccrodrigo/hermes-ddd-validator.git /tmp/ddd-validator
      
      - name: Run DDD Validation
        run: |
          node /tmp/ddd-validator/scripts/validate-ddd.js . --strict --doc=./docs
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ddd-docs
          path: docs/
```

### GitLab CI

```yaml
validate-ddd:
  stage: test
  image: node:18
  before_script:
    - git clone https://github.com/tccrodrigo/hermes-ddd-validator.git /tmp/ddd-validator
  script:
    - node /tmp/ddd-validator/scripts/validate-ddd.js . --strict --doc=./docs
  artifacts:
    paths:
      - docs/
    expire_in: 1 week
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run DDD validator
node path/to/hermes-ddd-validator/scripts/validate-ddd.js . --strict
if [ $? -ne 0 ]; then
    echo "❌ DDD validation failed. Fix violations before committing."
    exit 1
fi
```

## Troubleshooting

### "No layers found"

Your project structure doesn't match expected DDD layers. Expected:

```
project/
├── src/
│   ├── domain/           ← Required
│   ├── application/      ← Required
│   ├── infrastructure/   ← Required
│   └── controllers/      ← Optional
```

Or root-level:

```
project/
├── domain/               ← Required
├── application/          ← Required
├── infrastructure/       ← Required
```

### "Framework not detected"

Ensure your project has one of:
- `package.json` (Node.js)
- `pom.xml` or `build.gradle` (Java)
- `requirements.txt` or `pyproject.toml` (Python)

### Permission denied

```bash
chmod +x scripts/validate-ddd.js
```

## Supported Frameworks

| Framework | Detection File | Status |
|-----------|---------------|--------|
| Node.js/TypeScript | `package.json`, `tsconfig.json` | ✅ Supported |
| React | `package.json` with react | ✅ Supported |
| Java Spring Boot | `pom.xml`, `build.gradle` | ✅ Supported |
| Python | `requirements.txt`, `pyproject.toml` | ✅ Supported |

## How It Works

1. **Detection:** Scans root directory for framework markers
2. **Layer Scanning:** Recursively scans `domain/`, `application/`, `infrastructure/`
3. **Violation Check:** Parses imports to detect layer violations
   - Domain → Application/Infra ❌
   - Application → Infra ❌
   - Infra → Domain ✅ (interface)
4. **Doc Generation:** Creates C4 diagrams and validation reports
5. **Recommendation:** Suggests `brainstorming` if violations exist

## Next Steps

After installation and initial validation:

1. **Review** `docs/index.html` in browser
2. **Read** `docs/INDEX.md` for AI context
3. **Fix** violations or create adequacy plan with `/brainstorming`
4. **Re-run** validation after fixes: `validate-ddd . --strict`
5. **Integrate** into CI/CD for continuous validation

## Getting Help

- **Issues:** https://github.com/tccrodrigo/hermes-ddd-validator/issues
- **Discussions:** Open a GitHub Discussion
- **Examples:** See `examples/` directory (coming soon)

## License

MIT License - Free for personal and commercial use.