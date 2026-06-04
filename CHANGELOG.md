# Changelog

All notable changes to the DDD Architecture Validator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-04

### Added

- **Initial release** - DDD Architecture Validator
- Multi-language support: TypeScript, JavaScript, Java, Python
- Pattern detection: Entities, Value Objects, Repositories, Domain Events, Services
- Layer detection: Domain, Application, Infrastructure, Interfaces
- HTML report generation with `--visual` flag
- JSON output with `--json` flag for CI/CD integration
- Watch mode with `--watch` flag for development
- Configurable rules via `.dddrc.json`
- Strict mode with `--strict` flag (fails on violations)
- Cross-domain dependency detection
- Three complete examples: Node.js API, Java Spring, Python FastAPI
- Setup script with automatic Node.js installation
- GitHub Actions workflow for CI

## [Unreleased]

### Planned

- [ ] React component validation
- [ ] Graph visualization (dependency graphs)
- [ ] Custom rule plugins
- [ ] VS Code extension
- [ ] IntelliJ/WebStorm plugin

### Ideas

- Integration with PlantUML for architecture diagrams
- SARIF output for security scanners
- Performance metrics (cyclomatic complexity)
- API documentation generation from domain code

---

## Version History

- **v1.0.0** (2024-06-04) - First stable release
