# Contributing Guide

Thank you for your interest in contributing to the Hermes DDD Validator!

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/tccrodrigo/hermes-ddd-validator/issues)
2. If not, create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node.js version, framework)
   - Sample code or repository (if applicable)

### Suggesting Features

1. Open a GitHub Discussion or Issue
2. Describe the feature and its use case
3. Explain how it fits DDD principles
4. Consider providing implementation ideas

### Code Contributions

#### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/hermes-ddd-validator.git
cd hermes-ddd-validator
```

#### Setup Development Environment

```bash
# Install dependencies (none currently, but good practice)
npm install

# Create a test project
mkdir test-project
cd test-project
npm init -y
```

#### Make Changes

1. Create a branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally: `node scripts/validate-ddd.js /path/to/test-project --visual`
4. Commit: `git commit -m "Add feature: description"`
5. Push: `git push origin feature/my-feature`
6. Open Pull Request

#### Code Style

- Use consistent formatting
- Add comments for complex logic
- Keep functions small and focused
- No external dependencies (keep it standalone)

### Documentation

- Update README.md if adding features
- Add JSDoc comments for functions
- Update examples if behavior changes

### Testing

Before submitting PR:

```bash
# Test on a Node.js project
node scripts/validate-ddd.js /path/to/nodejs-project --visual

# Test on a React project  
node scripts/validate-ddd.js /path/to/react-project --visual

# Test on a Java project
node scripts/validate-ddd.js /path/to/java-project --visual

# Verify output files exist
ls -la /path/to/project/docs/
```

## Areas Needing Help

1. **Framework Support**
   - Better C#/.NET detection
   - Go support
   - Rust support

2. **Violation Detection**
   - Circular dependency detection
   - Better import parsing for dynamic imports
   - Support for monorepos

3. **Documentation**
   - More examples
   - Video tutorials
   - Translation to other languages

4. **Templates**
   - More C4 diagram styles
   - Additional output formats (JSON, YAML)

## Recognition

Contributors will be listed in the README.md file.

## Code of Conduct

- Be respectful and constructive
- Focus on improving the project
- Help others learn DDD concepts

## Questions?

Open a GitHub Discussion or reach out via issues.

Thank you for contributing! 🎉