# AWD GitHub Action 🚀
**Run AI workflows written in natural language markdown with AWD CLI**

> **📖 [Full Documentation & Getting Started →](https://github.com/danielmeppiel/awd-cli)**

Transform any repository into a Continuous AI powerhouse. Write AI workflows in markdown, test locally with `awd run`, deploy seamlessly with GitHub Actions.

## Quick Start (30 seconds)

### 1. Add to your workflow
```yaml
name: AI Workflow
on: [issues]

jobs:

  ai-workflow:
    runs-on: ubuntu-latest
    permissions:
      models: read  # ⚠️ Required for GitHub Models API
      
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: start
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Create an AWD project
```bash
# In your repository root
awd init .
awd install
```

### 3. Test locally, deploy globally
```bash
awd run start --param issue_number=123
# Works? Deploy with git push!
```

## Prerequisites

- **AWD CLI project** in your repo (`awd.yml` + `.prompt.md` files)
- **`GITHUB_TOKEN`** environment variable  
- **GitHub Models API access** - Add `permissions: { models: read }` to your workflow

> **🆘 Need help setting up?** See [AWD CLI Quick Start](https://github.com/danielmeppiel/awd-cli#quick-start-30-seconds)

## Examples

## Examples

### Basic Issue Triage
```yaml
on: [issues]
jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: issue-triage
          issue_number: ${{ github.event.issue.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### PR Code Review  
```yaml
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: code-review
          pr_number: ${{ github.event.number }}
          focus_areas: "security,performance"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Documentation Updates
```yaml
on: 
  push:
    paths: ['src/**']
jobs:
  docs:
    runs-on: ubuntu-latest
    permissions:
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: update-docs
          changed_files: ${{ steps.changes.outputs.files }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> **📚 [More Examples & Tutorials →](./examples/)**

## Action Reference

### Inputs
| Input | Description | Default |
|-------|-------------|---------|
| `script` | Script name from awd.yml to run | `start` |
| `awd-version` | AWD CLI version to install | `latest` |
| `working-directory` | Working directory for execution | `.` |
| `skip-install` | Skip automatic MCP dependency installation | `false` |

**All other inputs** are automatically passed as `--param key=value` to your AWD script.

### Outputs
| Output | Description |
|--------|-------------|
| `success` | Whether execution succeeded (`true`/`false`) |
| `output` | Full execution output from AWD |

## Why Continuous AI with AWD?

**Continuous AI** is the automated application of AI to enhance software collaboration - just like CI/CD transformed deployment. 

AWD Action makes it **accessible and maintainable**:

- ✅ **Write workflows in markdown** instead of complex TypeScript
- ✅ **Test locally** with `awd run` before deploying  
- ✅ **Event-driven automation** for issues, PRs, releases
- ✅ **Transparent and auditable** AI automation

## Troubleshooting

### Permission Denied (401 Unauthorized)
```yaml
# ❌ Missing permissions
jobs:
  ai-task:
    runs-on: ubuntu-latest  # Missing permissions!
    
# ✅ Correct setup  
jobs:
  ai-task:
    runs-on: ubuntu-latest
    permissions:
      models: read  # Required for GitHub Models API
```

### AWD Project Not Found
Make sure your repository has:
- `awd.yml` configuration file
- At least one `.prompt.md` workflow file
- Run `awd init .` in your repo root if missing

## Links

- **📖 [AWD CLI Documentation](https://github.com/danielmeppiel/awd-cli)** - Complete guide and tutorials
- **🔧 [Action Examples](./examples/)** - Real-world GitHub workflows  
- **🐛 [Issues & Support](https://github.com/danielmeppiel/action-awd-cli/issues)** - Get help or report bugs

---

**Enabling Continuous AI through markdown workflows** 🚀
