---
description: Phase 2 - Define product requirements and specifications
activates: technical-product-manager
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=discovery] [--no-discovery]
allowed-tools: Read, Write, Edit, MultiEdit, Bash(*), WebSearch, WebFetch, Grep, Glob, mcp__sequential-thinking__sequentialthinking, mcp__context7__*, mcp__claude-context__*, mcp__mem0__*
model: claude-opus-4-1-20250805
max-turns: 15
timeout: 600
mcp-servers: claude-context, context7, mem0, sequential-thinking
---

# Specification Command - Phase 2: Product Requirements

Transform discovery insights into detailed product requirements, defining **WHAT** needs to be built (not HOW).

## Command Syntax

```bash
/ccu:specify --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=discovery] [--no-discovery]
```

## Parameters

- `--target=platform|module|feature` - Specification scope
- `--track=instant|rapid|standard|enterprise` - Development track complexity
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature
- `--from=discovery` - Load insights from discovery phase (default)
- `--no-discovery` - Bypass discovery requirement (manual mode)

## Step 0: Initialize

1. **Determine project root** by checking for ccu_workspace
2. **Load discovery data** from appropriate path based on target and track
3. **Initialize TodoWrite** with track-specific tasks

## Step 1: Pattern Recognition with Mem0

Search for similar specifications using multiple strategies:
- Primary: PATTERN:DISCOVERY:PROJECT
- Fallback 1: Module patterns by type
- Fallback 2: Generic specification search

If patterns found with >70% similarity, offer to apply them.

## Step 2: Track-Based Question Flow

### 🚀 INSTANT Track (0 Questions)
- Auto-generate specifications from discovery data
- Apply all defaults from module patterns
- Create basic user stories (1 per module)
- Skip all user interaction

### ⚡ RAPID Track (4 Questions)
Load contextual questions from `module-patterns.yaml` based on discovered modules:
- 4 module-specific business rules questions
- Pre-filled with smart defaults
- Progress tracking with visual indicators

### 📋 STANDARD Track (5 Questions)
Comprehensive business policy questions:
- User stories & workflows
- Business rules & validation
- Data management policies
- Integration requirements
- Success metrics definition

### 🏢 ENTERPRISE Track (8 Questions)
Enterprise-grade governance questions across 4 categories:
- Requirements management (2 questions)
- Detailed specifications (3 questions)
- Compliance & governance (2 questions)
- Integration behavior (1 question)

## Step 3: Agent Analysis

Activate `technical-product-manager` agent with collected requirements:
- Transform answers into structured specifications
- Generate user stories with acceptance criteria
- Define business rules and constraints
- Set success metrics and KPIs
- Assess risks and dependencies

## Step 4: File Generation

Use centralized file generation function:

```javascript
createSpecificationFiles({
  target: ARGUMENTS.target,
  track: ARGUMENTS.track,
  agent_analysis: agent_analysis,
  discovery_data: discovery_data,
  project_root: project_root,
  module: ARGUMENTS.module,
  feature: ARGUMENTS.feature
})
```

### Generated Files (All Tracks)
- `specification.json` - Structured data
- `spec.md` - Human-readable specification
- `user-stories.md` - All user stories
- `business-rules.md` - Validation logic
- `success-metrics.md` - KPIs
- `status.json` - Phase tracking

### Additional Files by Track
- **STANDARD**: `feature-priorities.md`
- **ENTERPRISE**: Complete compliance documentation suite (15+ files)

## Step 5: One-Level-Down Generation

Automatically generate child specifications:
- **Platform → Modules** (not features)
- **Module → Features**
- **Feature** (leaf level, no children)

## Step 6: Pattern Storage

Store successful patterns in Mem0 for future reuse:
- Module-type patterns
- Industry patterns
- Success patterns
- UI/design hints for next phase

## File Generation Function

```javascript
function createSpecificationFiles(config) {
  # Determine output path based on target
  output_path = buildOutputPath(config.target, config.module, config.feature)

  # Create directory
  Create directory: output_path

  # Load template
  Load template = ccu_framework/templates/specification/unified-spec.template.md

  # Create specification data structure
  specification_data = {
    metadata: {
      phase: "specification",
      target: config.target,
      track: config.track,
      timestamp: now(),
      from_discovery: true,
      version: "2.0"
    },
    discovered_context: config.discovery_data || {},
    functional_requirements: {
      user_stories: config.agent_analysis.user_stories || [],
      business_rules: config.agent_analysis.business_rules || [],
      success_metrics: config.agent_analysis.success_metrics || []
    },
    modules: config.agent_analysis.modules || []
  }

  # Create files
  generateCoreFiles(output_path, specification_data, config)
  generateTrackSpecificFiles(output_path, config.track, config.agent_analysis)

  Say to user: "✅ Created specification files for {config.target}"
}

function buildOutputPath(target, module, feature) {
  If target == "platform":
    return "{project_root}/ccu_workspace/platform/02-specification/"
  Else if target == "module":
    return "{project_root}/ccu_workspace/modules/{module}/02-specification/"
  Else if target == "feature":
    return "{project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/"
}

function generateCoreFiles(path, data, config) {
  Create file: {path}/specification.json
    Content: JSON.stringify(data, null, 2)

  Create file: {path}/spec.md
    Content: Fill template with config.agent_analysis

  Create file: {path}/user-stories.md
    Content: config.agent_analysis.user_stories || generateDefaultUserStories()

  Create file: {path}/business-rules.md
    Content: config.agent_analysis.business_rules || generateDefaultBusinessRules()

  Create file: {path}/success-metrics.md
    Content: config.agent_analysis.success_metrics || generateDefaultMetrics()

  Create file: {path}/status.json
    Content: {"phase": "specified", "track": config.track, "timestamp": now()}
}
```

## Output Structure

```
ccu_workspace/
├── platform/02-specification/           # Platform specs
├── modules/{module}/02-specification/   # Module specs
└── modules/{module}/features/{feature}/02-specification/  # Feature specs
```

## Next Phase

After completion:
```bash
/ccu:design --target={same} --track={same}
```

---

*Simplified CCU 2.0 Framework - Phase 2: Specification*