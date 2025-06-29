# AWD - AI Workflow Runner 🚀

[![GitHub Super-Linter](https://github.com/danielmeppiel/action-awd-cli/actions/workflows/linter.yml/badge.svg)](https://github.com/danielmeppiel/action-awd-cli/actions/workflows/linter.yml)

**Transform GitHub Actions into the universal runtime for AI workflows.**

Instead of building custom TypeScript actions for every AI task, write markdown prompts and let AWD handle the complexity. Same workflows work locally (`awd run`) and in GitHub Actions seamlessly.

## Versioning Strategy

### Action vs AWD CLI Versions

This GitHub Action follows **independent versioning** from AWD CLI:

- **Action versions**: `v1.0.0`, `v1.1.0`, etc. (semantic versioning)
- **AWD CLI versions**: Automatically installs latest stable by default
- **Version control**: Use `awd-version` input to pin specific AWD CLI versions

```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    awd-version: 'v0.1.0'  # Pin to specific AWD CLI version
    # or
    awd-version: 'latest'  # Use latest stable (default)
```

### Compatibility Matrix

| Action Version | Default AWD CLI | Tested With |
|----------------|-----------------|-------------|
| v1.0.x         | latest stable   | v0.1.0+     |

### When to Update

- **Action updates**: New features, bug fixes, GitHub Actions improvements
- **AWD CLI updates**: Automatically picked up (unless pinned)
- **Breaking changes**: Major version bumps only

## Quick Start


```yaml
# .github/workflows/ai-triage.yml
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
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**That's it!** The same `issue-triage` script that works locally with `awd run issue-triage` now works in GitHub Actions.

## Why AWD Action?

### ❌ Before: Custom Actions Are Hard
- **Each AI task = Custom TypeScript action** (hundreds of lines)
- **No reusability** across teams or projects  
- **No local testing** - commit-push-wait cycles
- **Vendor lock-in** to specific LLM providers

### ✅ After: Universal AI Workflows
- **Write markdown prompts** instead of TypeScript
- **Test locally** with `awd run` before deploying
- **Runtime portable** - switch between codex/llm/future runtimes
- **Share workflows** like npm packages

## Real-World Examples

### Issue Triage (2 minutes to set up)
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: issue-triage
    issue_number: ${{ github.event.issue.number }}
    max_labels: 3
    focus: "bug vs feature categorization"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Code Review (5 minutes to set up)
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: code-review
    pr_number: ${{ github.event.number }}
    focus_areas: "security,performance"
    max_comments: 5
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Release Notes (1 minute to set up)
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: release-notes
    version: ${{ github.event.release.tag_name }}
    format: "markdown"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## How It Works

1. **Install AWD CLI** automatically in the runner
2. **Setup AI runtime** (Codex with GitHub Models by default)
3. **Run your script** with parameters from action inputs
4. **Stream output** in real-time to Actions logs

## Inputs

### Core Inputs
| Input | Description | Default |
|-------|-------------|---------|
| `script` | Script name from awd.yml to run | `start` |
| `working-directory` | Working directory for execution | `.` |

### Dynamic Parameters
**All other inputs** are automatically passed as `--param key=value` to your AWD script.

Common parameters include:
- `issue_number`, `pr_number` - GitHub event data
- `max_labels`, `max_comments` - Limits for AI output
- `focus`, `focus_areas` - Instructions for AI analysis
- `version`, `format` - Output formatting options

## Outputs

| Output | Description |
|--------|-------------|
| `success` | Whether execution succeeded (`true`/`false`) |
| `output` | Full execution output from AWD |

## Prerequisites

Your repository needs an AWD project with:

1. **`awd.yml`** - Project configuration with scripts
2. **`.prompt.md` files** - AI workflow definitions
3. **Environment variables** - `GITHUB_TOKEN` for AI models

### Example AWD Project Structure
```
your-repo/
├── awd.yml                    # AWD configuration
├── prompts/
│   ├── issue-triage.prompt.md # Issue labeling workflow
│   ├── code-review.prompt.md  # PR analysis workflow
│   └── release-notes.prompt.md # Release notes generation
└── .github/workflows/
    └── ai.yml                 # GitHub Actions using AWD
```

### Example `awd.yml`
```yaml
name: my-ai-workflows
version: 1.0.0
scripts:
  issue-triage: "codex prompts/issue-triage.prompt.md"
  code-review: "codex prompts/code-review.prompt.md"
  release-notes: "codex prompts/release-notes.prompt.md"
dependencies:
  mcp:
    - ghcr.io/github/github-mcp-server
```

## Complete Workflow Examples

### Multi-Purpose AI Workflow
```yaml
name: Continuous AI
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened, synchronize]
  release:
    types: [created]

jobs:
  ai-automation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: AI Issue Triage
        if: github.event_name == 'issues'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: issue-triage
          issue_number: ${{ github.event.issue.number }}
          max_labels: 3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: AI Code Review
        if: github.event_name == 'pull_request'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: code-review
          pr_number: ${{ github.event.number }}
          focus_areas: "security,performance"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Generate Release Notes
        if: github.event_name == 'release'
        uses: danielmeppiel/action-awd-cli@v1
        with:
          script: release-notes
          version: ${{ github.event.release.tag_name }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Advanced: Custom Runtime
```yaml
- uses: danielmeppiel/action-awd-cli@v1
  with:
    script: advanced-analysis
    model: "gpt-4o"
    complexity: "high"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Getting Started

### 1. Set up AWD Project
```bash
# Install AWD CLI locally
curl -sSL https://raw.githubusercontent.com/danielmeppiel/awd-cli/main/install.sh | sh

# Create AWD project
awd init my-ai-workflows
cd my-ai-workflows

# Test locally first
awd run start --param name="Test"
```

### 2. Add GitHub Action
```yaml
# .github/workflows/ai.yml
name: AI Workflows
on:
  issues:
    types: [opened]
jobs:
  ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: danielmeppiel/action-awd-cli@v1
        with:
          script: start
          name: "GitHub Actions"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Commit and Push
Your AI workflow now runs automatically in GitHub Actions!

## Supported Runtimes

- **Codex** (default) - OpenAI's advanced code model via GitHub Models
- **LLM** - Simon Willison's library with 100+ models
- **Future runtimes** - Anthropic, local models, etc.

## Development

### Local Development
```bash
# Clone and setup
git clone https://github.com/danielmeppiel/action-awd-cli.git
cd action-awd-cli
npm install

# Build
npm run build

# Test locally (requires AWD project)
node dist/index.js
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with real AWD projects
5. Submit a pull request

## FAQ

**Q: Do I need to install AWD CLI manually?**  
A: No! The action automatically installs AWD CLI in the runner.

**Q: How do I pass complex parameters?**  
A: Use action inputs directly - they become AWD parameters automatically.

**Q: Can I use different AI models?**  
A: Yes! AWD supports multiple runtimes and models. Configure in your `awd.yml`.

**Q: Does this work with private repositories?**  
A: Yes! Use `GITHUB_TOKEN` secret for authentication.

**Q: How do I debug issues?**  
A: Check the Actions logs - AWD output is streamed in real-time.

## License

MIT License - see [LICENSE](LICENSE) file.

## Links

- **AWD CLI**: https://github.com/danielmeppiel/awd-cli
- **Documentation**: https://github.com/danielmeppiel/awd-cli/tree/main/docs
- **Examples**: https://github.com/danielmeppiel/action-awd-cli/tree/main/examples
- **Issue Tracker**: https://github.com/danielmeppiel/action-awd-cli/issues

---

**Transform your GitHub workflows with AI - write markdown, not TypeScript!** 🚀
