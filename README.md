# AWD GitHub Action 🚀
**Write AI workflows in markdown, not custom GitHub Actions.**

> **🔧 Powered by [AWD CLI](https://github.com/danielmeppiel/awd-cli)** - The package manager for Agentic Workflows written in markdown

Enable [Continuous AI](https://githubnext.com/projects/continuous-ai/) in your repository. Test locally with `awd run`, deploy confidently with GitHub Actions.

## Quick Start (30 seconds)

**Copy this into `.github/workflows/ai.yml`:**

```yaml
name: AI Issue Triage
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
          script: start
          parameters: |
            {
              "issue_number": "${{ github.event.issue.number }}"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**That's it.** Open an issue to see AI triage in action.

> **Want custom workflows?** [Install AWD CLI](https://github.com/danielmeppiel/awd-cli) to create your own markdown AI workflows.

## Examples

**Issue Analysis:**
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: analyze
    parameters: |
      {
        "issue_number": "${{ github.event.issue.number }}"
      }
```

**PR Review with Custom Parameters:**
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: review
    parameters: |
      {
        "pr_number": "${{ github.event.number }}",
        "focus": "security"
      }
```

## Why Continuous AI?

**[Continuous AI](https://githubnext.com/projects/continuous-ai/)** applies AI to enhance software collaboration - just like CI/CD transformed deployment. AWD Action makes it accessible:

- ✅ **One action, many workflows** - No need to build separate GitHub Actions for each AI script
- ✅ **Local-to-CI sync** - Test with `awd run` locally, deploy confidently with GitHub Actions
- ✅ **Write in markdown** - Portable AI workflows that run anywhere AWD CLI works
- ✅ **Event-driven automation** - Trigger on issues, PRs, releases, any GitHub event

## Inputs

| Input | Description | Example |
|-------|-------------|---------|
| `script` | AWD script to run | `start`, `review`, `analyze` |
| `parameters` | JSON parameters for your script | `{"name": "value"}` |
| `working-directory` | Where to run (if AWD project in subfolder) | `./ai-workflows` |

## Troubleshooting

**❌ Permission denied?** Add this to your job:
```yaml
permissions:
  models: read  # Required for GitHub Models API
```

**❌ Script not found?** Your repo needs an AWD project. [Set one up →](https://github.com/danielmeppiel/awd-cli#quick-start-30-seconds)

---

**[📖 AWD CLI Documentation](https://github.com/danielmeppiel/awd-cli)** • **[🐛 Issues](https://github.com/danielmeppiel/action-awd-cli/issues)**
