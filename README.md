# APM GitHub Action 🚀
**Run APM workflows in GitHub Actions with full dependency management**

> **🔧 Powered by [APM CLI](https://github.com/danielmeppiel/apm)** - Agent Package Manager

Enable AI-native development workflows in CI/CD. Automatic APM dependency resolution, AGENTS.md compilation, and Copilot CLI integration.

## Quick Start - Corporate Website Audit

**Copy this into `.github/workflows/compliance.yml`:**

```yaml
name: Compliance Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-apm-cli@v1
        with:
          script: audit
        env:
          GITHUB_COPILOT_PAT: ${{ secrets.GITHUB_COPILOT_PAT }}
```

**That's it.** This runs the compliance audit workflow from [corporate-website](https://github.com/danielmeppiel/corporate-website), including:
- ✅ Automatic APM dependency installation (`danielmeppiel/compliance-rules`, `danielmeppiel/design-guidelines`)
- ✅ AGENTS.md compilation for agent compatibility
- ✅ Full GDPR compliance checking with audit trails

## Real-World Example: Corporate Website

See the complete setup at [danielmeppiel/corporate-website](https://github.com/danielmeppiel/corporate-website):

**`apm.yml`:**
```yaml
name: corporate-website
dependencies:
  apm:
    - danielmeppiel/compliance-rules
    - danielmeppiel/design-guidelines
  mcp:
    - microsoft/playwright-mcp

scripts:
  audit: "copilot --log-level all --log-dir copilot-logs --allow-all-tools -p compliance-audit.prompt.md"
  gdpr-check: "copilot --log-level all --log-dir copilot-logs --allow-all-tools -p gdpr-assessment.prompt.md"
  accessibility: "copilot --log-level all --log-dir copilot-logs --allow-all-tools -p accessibility-audit.prompt.md"
```

**Workflow triggers:**
```yaml
# Full compliance suite on PR
      - uses: danielmeppiel/action-apm-cli@v1
        with:
          script: audit

# GDPR-specific check
- uses: danielmeppiel/action-apm-cli@v1
  with:
    script: gdpr-check
    
# Accessibility validation
- uses: danielmeppiel/action-apm-cli@v1
  with:
    script: accessibility
```

## What This Action Does

1. 🚀 **Installs APM CLI** - Latest stable version
2. 🤖 **Sets up Copilot CLI** - Modern AI runtime with GITHUB_COPILOT_PAT
3. 📦 **Installs Dependencies** - Both APM packages and MCP servers from `apm.yml`
4. 🔄 **Compiles AGENTS.md** - Generates agent-compatible context from dependencies
5. ▶️ **Runs Workflow** - Executes your APM script with full context

## Inputs

| Input | Description | Default | Example |
|-------|-------------|---------|----------|
| `script` | APM script from apm.yml to run | `start` | `audit`, `gdpr-check` |
| `working-directory` | Directory containing apm.yml | `.` | `./workflows` |
| `apm-version` | APM CLI version to install | `latest` | `0.4.1` |
| `skip-install` | Skip dependency installation | `false` | `true` |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_COPILOT_PAT` | Fine-grained PAT with Copilot access | Yes |
| `GITHUB_APM_PAT` | PAT for private APM dependencies | No |

## Setup Requirements

1. **Get GitHub Copilot PAT**: [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
   - Select "Fine-grained personal access token"
   - Add Copilot CLI access permissions

2. **Add to Repository Secrets**: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
   - Name: `GITHUB_COPILOT_PAT`
   - Value: Your fine-grained token

3. **Create apm.yml** in your repository root (see corporate-website example)

---

**[📖 APM CLI Documentation](https://github.com/danielmeppiel/apm)** • **[🏢 Corporate Website Example](https://github.com/danielmeppiel/corporate-website)** • **[🐛 Issues](https://github.com/danielmeppiel/action-apm-cli/issues)**
