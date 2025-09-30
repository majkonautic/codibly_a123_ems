---
description: Configure and manage CI/CD pipeline with branch strategies
argument-hint: [--setup|--action|--env|--strategy|--platform]
---

# CI/CD Pipeline Management

Configure comprehensive CI/CD workflows with automated branch management, worktree integration, and flexible deployment strategies.

## Core Parameters

- `--setup` - Run interactive CI/CD configuration wizard
- `--action=init|configure|deploy|status` - Specific CI/CD action
- `--env=development|staging|production` - Target environment
- `--strategy=simple|standard|custom` - Deployment strategy (simple: main→prod, standard: main→staging→prod)
- `--platform=github|gitlab|bitbucket|auto` - CI/CD platform (auto-detects from remote)

## Execution Flow

### 1. Initial Setup Detection

When `--setup` is provided or no CI/CD configuration exists:

**Git Repository Analysis:**
- Check if git is initialized
- Identify remote repository platform
- List existing local and remote branches
- Detect existing CI/CD configurations

**Project Type Determination:**
- **Greenfield**: No git or only main branch exists
- **Existing**: Multiple branches or CI/CD files present
- **Hybrid**: Has git but no CI/CD setup

### 2. Strategy Selection

Based on project analysis, recommend deployment strategy:

**Simple Strategy** (main → production):
- For small teams (< 5 contributors)
- Rapid prototyping projects
- Internal tools
- Worktree branches merge to main, main deploys to production

**Standard Strategy** (main → staging → production):
- For medium teams (5-20 contributors)
- Customer-facing applications
- Projects requiring QA phase
- Worktree branches → main (auto) → staging (auto) → production (manual)

**Custom Strategy**:
- Enterprise projects
- Complex approval workflows
- Multi-region deployments
- User defines complete pipeline

### 3. Branch Structure Creation

**For Greenfield Projects:**
```bash
# Create and push branches based on strategy
git checkout -b main  # If not exists
git push -u origin main

# If standard strategy selected
git checkout -b staging
git push -u origin staging

git checkout -b production
git push -u origin production
```

**For Existing Projects:**
- Analyze current branch structure
- Suggest missing branches
- Preserve existing workflow
- Offer to add staging/production if missing

### 4. Worktree Integration

**Automatic Worktree-CI/CD Linking:**
```yaml
worktree_config:
  auto_features:
    - Create PR when worktree branch pushed
    - Link commits to issues automatically
    - Generate PR description from commits
    - Auto-delete worktree after merge

  branch_patterns:
    feature/*: Target main for PR
    bugfix/*: Target main for PR
    hotfix/*: Target production for PR
    module/*: Target main for PR
```

### 5. Platform-Specific Configuration

**GitHub Actions Setup:**
```yaml
# Generate .github/workflows/ files
- main.yml: Tests and quality checks
- staging.yml: Deploy to staging environment
- production.yml: Deploy to production with approval

# Branch protection rules via GitHub API
- main: Require PR, tests must pass
- staging: Auto-deploy from main
- production: Require manual approval
```

**GitLab CI Setup:**
```yaml
# Generate .gitlab-ci.yml
- Build, test, deploy stages
- Environment-specific jobs
- Manual production gates
```

### 6. Environment Configuration

**Development Environment:**
- Local development in worktrees
- No deployment needed
- Focus on testing

**Staging Environment:**
- Auto-deploy from main (if exists)
- Full test suite execution
- Preview URL generation

**Production Environment:**
- Manual approval required
- Rollback capability
- Version tagging

### 7. Interactive Prompts

The command will guide through setup with smart defaults:

```
🚀 CCU CI/CD Setup Wizard

Detected: GitHub repository
Current branches: main

? Select deployment strategy:
  ○ Simple (main → production)
  ● Standard (main → staging → production)  [Recommended]
  ○ Custom (define your own)

? Configure automated features:
  ✓ Auto-create PR from worktree branches
  ✓ Auto-run tests before merge
  ✓ Auto-deploy to staging
  □ Auto-deploy to production

? Production deployment requires:
  ✓ All CI checks passing
  ✓ Manual approval
  □ Multiple reviewers
  □ Security scan

? Create missing branches now?
  → Will create: staging, production
  (Y/n): Y

Setting up CI/CD pipeline...
✓ Created staging branch
✓ Created production branch
✓ Generated GitHub Actions workflows
✓ Configured branch protection
✓ Created environment configs
```

### 8. Generated File Structure

```
project/
├── .github/
│   └── workflows/
│       ├── main.yml          # CI for main branch
│       ├── staging.yml        # Auto-deploy to staging
│       ├── production.yml     # Manual deploy to production
│       └── pr-checks.yml      # PR validation
├── .ccu/
│   └── cicd/
│       ├── config.yaml        # CI/CD configuration
│       ├── environments.yaml  # Environment settings
│       └── branch-rules.yaml  # Branch protection rules
└── ccu_worktree/
    └── [worktree branches]    # Integrated with CI/CD
```

### 9. Status and Management

**Check CI/CD Status:**
```bash
/ccu:cicd --action=status

CI/CD Status Report:
✓ Platform: GitHub
✓ Strategy: Standard (main → staging → production)
✓ Branches:
  - main: Protected, requires PR
  - staging: Auto-deploy enabled
  - production: Manual approval required
✓ Active worktrees: 3
✓ Recent deployments:
  - Staging: 2 hours ago (v1.2.3)
  - Production: 2 days ago (v1.2.2)
```

### 10. Safety Features

- **Non-destructive**: Never overwrites existing CI/CD configs without permission
- **Confirmation prompts**: For all branch creation and protection changes
- **Rollback capability**: Can revert CI/CD setup if needed
- **Dry-run mode**: Preview changes with `--dry-run`

## Integration with CCU Development Flow

The CI/CD system seamlessly integrates with existing CCU commands:

- `/ccu:discover` → Creates initial project understanding
- `/ccu:specify` → Defines requirements including deployment needs
- `/ccu:develop` → Creates worktree branches that auto-integrate with CI/CD
- `/ccu:cicd` → Manages the deployment pipeline
- `/ccu:validate` → Ensures CI/CD requirements are met

## Examples

```bash
# Initial setup
/ccu:cicd --setup

# Setup with specific strategy
/ccu:cicd --setup --strategy=simple

# Configure staging environment
/ccu:cicd --env=staging --action=configure

# Check current status
/ccu:cicd --action=status

# Deploy to production (if manual)
/ccu:cicd --env=production --action=deploy
```

## Notes

- Respects existing git workflows
- Platform-agnostic design
- Worktree-first approach
- Progressive enhancement supported
- Can start simple and add staging later