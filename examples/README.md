# Example AWD Workflows for GitHub Actions

This directory contains real-world examples of AI workflows using the AWD Action.

## Quick Start Examples

### 0. Test Project - Action validation
**Directory**: `examples/test-project/`

A minimal AWD project used for testing the action in CI/CD. Great for understanding the basics:

```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: test-params
    working-directory: examples/test-project
    name: "Developer"
    message: "Hello World"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 1. Issue Triage - Automatically label new issues
**File**: `.github/workflows/issue-triage.yml`

```yaml
name: AI Issue Triage
on:
  issues:
    types: [opened]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: issue-triage
          issue_number: ${{ github.event.issue.number }}
          max_labels: 3
          focus: "bug vs feature categorization"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Code Review - AI-powered PR analysis
**File**: `.github/workflows/code-review.yml`

```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: code-review
          pr_number: ${{ github.event.number }}
          focus_areas: "security,performance"
          max_comments: 5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Release Notes - Generate release notes from commits
**File**: `.github/workflows/release-notes.yml`

```yaml
name: Generate Release Notes
on:
  release:
    types: [created]
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: release-notes
          version: ${{ github.event.release.tag_name }}
          format: "markdown"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Complete Project Example

### Project Structure
```
your-repo/
├── awd.yml                           # AWD configuration
├── prompts/
│   ├── issue-triage.prompt.md       # Issue labeling workflow  
│   ├── code-review.prompt.md        # PR analysis workflow
│   ├── release-notes.prompt.md      # Release notes generation
│   ├── security-scan.prompt.md      # Security analysis
│   ├── docs-update.prompt.md        # Documentation updates
│   ├── comprehensive-review.prompt.md # Deep code analysis
│   ├── quick-review.prompt.md       # Surface-level review
│   └── advanced-triage.prompt.md    # Advanced issue analysis
└── .github/workflows/
    ├── issue-triage.yml             # Issue automation
    ├── code-review.yml              # PR automation  
    ├── release-notes.yml            # Release automation
    └── comprehensive-ai.yml         # Multi-purpose workflow
```

### `awd.yml` Configuration
```yaml
name: my-ai-workflows
version: 1.0.0
description: AI-powered repository automation
author: Your Team

scripts:
  issue-triage: "codex prompts/issue-triage.prompt.md"
  code-review: "codex prompts/code-review.prompt.md"
  codex-review: "codex prompts/code-review.prompt.md"
  llm-review: "llm prompts/code-review.prompt.md -m github/gpt-4o-mini"
  security-scan: "codex prompts/security-scan.prompt.md"
  release-notes: "codex prompts/release-notes.prompt.md"
  docs-update: "codex prompts/docs-update.prompt.md"
  comprehensive-review: "codex prompts/comprehensive-review.prompt.md"
  quick-review: "codex prompts/quick-review.prompt.md"
  advanced-triage: "codex prompts/advanced-triage.prompt.md"

dependencies:
  mcp:
    - ghcr.io/github/github-mcp-server
```

### Comprehensive Multi-Purpose Workflow
**File**: `.github/workflows/comprehensive-ai.yml`

```yaml
name: Comprehensive AI Automation
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened, synchronize, closed]
  release:
    types: [created]
  push:
    branches: [main]
    paths: ['src/**', 'lib/**']

jobs:
  ai-automation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Issue Triage
      - name: AI Issue Triage
        if: github.event_name == 'issues'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: issue-triage
          issue_number: ${{ github.event.issue.number }}
          max_labels: 3
          priority_detection: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Code Review
      - name: AI Code Review
        if: github.event_name == 'pull_request' && github.event.action != 'closed'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: code-review
          pr_number: ${{ github.event.number }}
          focus_areas: "security,performance,maintainability"
          max_comments: 10
          severity_threshold: "medium"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Security Scan on PR merge
      - name: AI Security Scan
        if: github.event_name == 'pull_request' && github.event.action == 'closed' && github.event.pull_request.merged == true
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: security-scan
          pr_number: ${{ github.event.number }}
          scan_type: "comprehensive"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Documentation Updates
      - name: AI Documentation Update  
        if: github.event_name == 'push'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: docs-update
          commit_sha: ${{ github.sha }}
          auto_commit: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Release Notes Generation
      - name: Generate Release Notes
        if: github.event_name == 'release'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: release-notes
          version: ${{ github.event.release.tag_name }}
          format: "markdown"
          include_contributors: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Advanced Examples

### Matrix Strategy - Multiple Scripts
```yaml
name: Multi-Script Analysis
on:
  pull_request:
    types: [opened]
jobs:
  analyze:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        script: [codex-review, llm-review, security-scan]
        include:
          - script: codex-review
            focus: "performance,maintainability"
          - script: llm-review  
            focus: "security,style"
          - script: security-scan
            focus: "vulnerabilities"
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: ${{ matrix.script }}
          focus_area: ${{ matrix.focus }}
          pr_number: ${{ github.event.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Conditional Execution
```yaml
name: Smart AI Automation
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  smart-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Only run AI review for large PRs
      - name: AI Code Review (Large PRs)
        if: github.event.pull_request.additions > 100
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: comprehensive-review
          pr_number: ${{ github.event.number }}
          depth: "deep"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Quick review for small PRs
      - name: AI Quick Review (Small PRs)
        if: github.event.pull_request.additions <= 100
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: quick-review
          pr_number: ${{ github.event.number }}
          depth: "surface"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Separate Dependency Installation
```yaml
name: Advanced AI Setup
on:
  pull_request:
    types: [opened]
jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Install MCP dependencies once
      - name: Setup AWD Dependencies
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: install
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      # Run multiple scripts without reinstalling
      - name: Security Review
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: security-scan
          skip-install: true
          pr_number: ${{ github.event.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Performance Review
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: performance-review
          skip-install: true
          pr_number: ${{ github.event.number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
### Custom Environment Variables
```yaml
name: Advanced AI Workflow
on:
  issues:
    types: [opened]
jobs:
  advanced:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: advanced-triage
          issue_number: ${{ github.event.issue.number }}
          complexity: "high"
          # Note: Model selection is handled in the script definition in awd.yml
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          CUSTOM_CONFIG: "production"
```

## Prompt Examples

### Issue Triage Prompt
**File**: `prompts/issue-triage.prompt.md`

```markdown
---
description: Automatically triage and label GitHub issues
mcp:
  - ghcr.io/github/github-mcp-server
input: [issue_number, max_labels, focus]
---

# Issue Triage Assistant

Analyze GitHub issue #${input:issue_number} and provide intelligent labeling.

## Instructions

1. **Get issue details** using the GitHub MCP tools
2. **Analyze content** for:
   - Issue type (bug, feature, documentation, etc.)
   - Priority level (low, medium, high, critical)
   - Component affected (frontend, backend, API, etc.)
   - Complexity estimation (simple, moderate, complex)

3. **Apply up to ${input:max_labels} labels** based on analysis
4. **Focus on**: ${input:focus}

## Output Format

Provide a brief analysis and apply appropriate labels to the issue.
```

### Code Review Prompt  
**File**: `prompts/code-review.prompt.md`

```markdown
---
description: AI-powered code review for pull requests
mcp:
  - ghcr.io/github/github-mcp-server
input: [pr_number, focus_areas, max_comments]
---

# Code Review Assistant

Review pull request #${input:pr_number} with focus on: ${input:focus_areas}

## Instructions

1. **Get PR details** and changed files using GitHub MCP tools
2. **Analyze changes** for:
   - Code quality and best practices
   - Security vulnerabilities
   - Performance implications
   - Test coverage
   - Documentation updates

3. **Focus areas**: ${input:focus_areas}
4. **Provide up to ${input:max_comments} constructive comments**

## Review Guidelines

- Be constructive and helpful
- Suggest specific improvements
- Highlight positive aspects
- Consider maintainability and readability
```

## Getting Started

1. **Copy example workflows** to your `.github/workflows/` directory
2. **Create AWD project** with `awd init`
3. **Add prompt files** to your project
4. **Configure awd.yml** with your scripts
5. **Test locally** with `awd run script-name --param key=value`
6. **Commit and push** to trigger GitHub Actions

## Tips

- **Test locally first** with `awd run` before deploying
- **Start simple** with one workflow, then expand
- **Use meaningful parameter names** for clarity
- **Check Actions logs** for debugging
- **Iterate based on results** - AI workflows improve over time

---

Ready to transform your GitHub workflows with AI? Pick an example and get started! 🚀
