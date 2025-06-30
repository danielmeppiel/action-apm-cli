# AWD GitHub Action Examples

Real-world examples of using AWD GitHub Action for Continuous AI workflows.

> **🔑 IMPORTANT**: All workflows require the `models: read` permission to access GitHub Models API.

## Quick Examples

### 1. Issue Triage
```yaml
name: AI Issue Triage
on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: issue-triage
          parameters: |
            {
              "issue_number": "${{ github.event.issue.number }}",
              "issue_title": "${{ github.event.issue.title }}"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. PR Code Review
```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: code-review
          parameters: |
            {
              "pr_number": "${{ github.event.number }}",
              "author": "${{ github.event.pull_request.user.login }}",
              "focus_areas": "security,performance"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Release Notes Generation
```yaml
name: Generate Release Notes
on:
  release:
    types: [created]

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      models: read
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: release-notes
          parameters: |
            {
              "version": "${{ github.event.release.tag_name }}",
              "format": "markdown"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Project Setup

### Required Files
Your repository needs an AWD project with these files:

```
your-repo/
├── awd.yml                    # AWD configuration
├── prompts/
│   ├── issue-triage.prompt.md
│   ├── code-review.prompt.md
│   └── release-notes.prompt.md
└── .github/workflows/
    └── ai.yml                 # Your GitHub Actions workflow
```

### Sample `awd.yml`
```yaml
name: my-ai-workflows
version: 1.0.0
description: AI-powered repository automation

scripts:
  issue-triage: "codex prompts/issue-triage.prompt.md"
  code-review: "codex prompts/code-review.prompt.md"
  release-notes: "codex prompts/release-notes.prompt.md"

dependencies:
  mcp:
    - ghcr.io/github/github-mcp-server
```

### Sample Prompt
**File**: `prompts/issue-triage.prompt.md`

```markdown
---
description: Automatically triage and label GitHub issues
mcp:
  - ghcr.io/github/github-mcp-server
input: [issue_number, issue_title]
---

# Issue Triage Assistant

Analyze GitHub issue #${input:issue_number}: "${input:issue_title}"

## Instructions

1. **Get issue details** using GitHub MCP tools
2. **Analyze content** for type, priority, and component
3. **Apply appropriate labels** based on analysis
4. **Provide brief summary** of the issue

Focus on being helpful and accurate.
```

## Advanced Patterns

### Multi-Step Workflow
```yaml
name: Comprehensive AI Review
on:
  pull_request:
    types: [opened]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      models: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      
      # Step 1: Quick analysis
      - name: Quick Review
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: quick-review
          parameters: |
            {
              "pr_number": "${{ github.event.number }}"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Step 2: Security scan for large PRs
      - name: Security Review
        if: github.event.pull_request.additions > 100
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: security-scan
          parameters: |
            {
              "pr_number": "${{ github.event.number }}",
              "scan_type": "comprehensive"
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Different Working Directory
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: analyze
    working-directory: ./ai-workflows
    parameters: |
      {
        "data_source": "production"
      }
```

## Getting Started

1. **Set up AWD project**: Run `awd init` in your repo
2. **Create prompts**: Write your AI workflows in `.prompt.md` files
3. **Test locally**: Use `awd run script-name --param key=value`
4. **Deploy**: Add GitHub Actions workflow
5. **Iterate**: Improve based on results

## Tips

- **Start simple** with one workflow, expand gradually
- **Test locally first** with `awd run` before deploying
- **Use meaningful parameter names** for clarity
- **Check Actions logs** for debugging
- **Focus on one use case** per prompt for better results

---

**[📖 AWD CLI Documentation](https://github.com/danielmeppiel/awd-cli)** • **[🐛 Report Issues](https://github.com/danielmeppiel/action-awd-cli/issues)**
