# AWD GitHub Action 🚀

> **📖 [Full Documentation & Getting Started →](https://github.com/danielmeppiel/awd-cli)**

GitHub Action wrapper for [AWD CLI](https://github.com/danielmeppiel/awd-cli) - run AI workflows seamlessly in GitHub Actions.

**Transform GitHub Actions into the universal runtime for AI workflows.** Same workflows work locally (`awd run`) and in GitHub Actions.

## Quick Usage

```yaml
# .github/workflows/ai-workflow.yml
name: AI Workflow
on: [issues, pull_request]
jobs:
  ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
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

*Write AI workflows in markdown, run them everywhere* 🚀
