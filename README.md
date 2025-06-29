# AWD GitHub Action 🚀
## Enabling Continuous AI with Markdown Workflows

> **📖 [Full Documentation & Getting Started →](https://github.com/danielmeppiel/awd-cli)**

GitHub Action for [AWD CLI](https://github.com/danielmeppiel/awd-cli) - bringing [Continuous AI](https://githubnext.com/projects/continuous-ai/) to your repositories through simple markdown workflows.

**Transform any repository into a Continuous AI powerhouse.** Write AI workflows in markdown, test locally with `awd run`, deploy seamlessly with GitHub Actions.

## Continuous AI Examples

Enable these Continuous AI patterns with simple markdown workflows:

### 🏷️ Continuous Triage
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: issue-triage
    issue_number: ${{ github.event.issue.number }}
    max_labels: 3
    focus: "bug vs feature categorization"
    # ↑ These become: --param issue_number=123 --param max_labels=3 --param focus="bug vs feature categorization"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 📋 Continuous Documentation  
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: update-docs
    changed_files: ${{ steps.changes.outputs.files }}
    format: "markdown"
```

### 🔍 Continuous Code Review
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: code-review
    pr_number: ${{ github.event.number }}
    focus_areas: "security,performance"
```

>## Why Continuous AI with AWD?

**Continuous AI** (from [GitHub Next](https://githubnext.com/projects/continuous-ai/)) is the automated application of AI to enhance software collaboration - just like CI/CD transformed deployment.

AWD Action makes Continuous AI **accessible and maintainable**:

- ✅ **Markdown workflows** instead of complex TypeScript actions
- ✅ **Local testing** with `awd run` before deployment  
- ✅ **Event-driven automation** for issues, PRs, releases
- ✅ **Team control** over AI models and workflows
- ✅ **Auditable and transparent** AI automation

> **📚 [Complete Examples & Tutorials →](https://github.com/danielmeppiel/awd-cli/tree/main/examples)**

## Action Inputs & Outputs

### Inputs
| Input | Description | Default |
|-------|-------------|---------|
| `script` | Script name from awd.yml to run | `start` |
| `awd-version` | AWD CLI version to install | `latest` |
| `working-directory` | Working directory for execution | `.` |

**All other inputs** are passed as `--param key=value` to your AWD script.

### Outputs
| Output | Description |
|--------|-------------|
| `success` | Whether execution succeeded (`true`/`false`) |
| `output` | Full execution output from AWD |

## Prerequisites

Your repository needs an [AWD project](https://github.com/danielmeppiel/awd-cli#quick-start-30-seconds):
- `awd.yml` configuration file
- `.prompt.md` workflow files  
- `GITHUB_TOKEN` environment variable

## Links

- **📖 [AWD CLI Documentation](https://github.com/danielmeppiel/awd-cli)** - Getting started, tutorials, examples
- **🔧 [Action Examples](https://github.com/danielmeppiel/action-awd-cli/tree/main/examples)** - Real GitHub workflows
- **🐛 [Issues](https://github.com/danielmeppiel/action-awd-cli/issues)** - Bug reports and feature requests

---

*Enabling Continuous AI through markdown workflows* 🚀
