---
description: Interactive discovery - gather requirements through Q&A or analyze existing code with AI-powered context
activates: business-analyst, code-analyzer
argument-hint: --target=platform|module|feature [--track=instant|rapid|standard|enterprise] [--from=questions|code] [--path=../project] [--module=name] [--feature=name]
allowed-tools: Read, Write, Edit, MultiEdit, Bash(*), WebSearch, WebFetch, Grep, Glob, mcp__sequential-thinking__sequentialthinking, mcp__context7__*, mcp__claude-context__*, mcp__mem0__*
model: claude-opus-4-1-20250805
max-turns: 15
timeout: 600
mcp-servers: claude-context, context7, mem0, sequential-thinking
---

# Discovery Command - Phase 1: Brainstorming & Exploration

This is **Phase 1** of the 7-phase development process. The discovery phase focuses on understanding the problem space, market needs, and potential solutions through two modes:

1. **Questions Mode** (default): Interactive brainstorming session to explore ideas
2. **Code Mode**: Analyze existing codebase to discover current implementation

Both modes activate the business-analyst agent for market insights and strategic analysis.

## Command Syntax

```bash
/ccu:discover --target=platform|module|feature --track=instant|rapid|standard|enterprise [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Scope of discovery
- `--track=instant|rapid|standard|enterprise` - Complexity track for the discovery
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=<source>` - Discovery source (default: questions)
  - `questions`: Interactive Q&A session
  - `code`: Analyze existing codebase
  - `https://...`: Fetch and analyze from URL
  - `./file.md`: Load from local file
  - `github:org/repo`: Analyze GitHub repository
  - `figma:file_id`: Extract from Figma designs
  - `notion:page_id`: Import from Notion docs
- `--path=<directory>` - Path to existing project (used when --from=code)
- `--description="text"` - Initial concept description - adds CONTEXT
- `--format=markdown|json|yaml` - Output format (default: markdown)
- `--update` - Update existing discovery (loads previous analysis for refinement)
- `--dry-run` - Preview mode without file generation
- `--force` - Override validation checks
- `--skip-spec` - Skip specification recommendation (NOT recommended)
- `--profile=technical|business|balanced` - Question focus area (default: balanced)

## Parameter Validation

### Important: --path vs --from

**Common mistake prevention:**
```
If --path is provided and points to a FILE (not a directory):
  If file ends with .md, .txt, .json, .yaml:
    Say to user: "⚠️ Parameter correction needed!"
    Say to user: ""
    Say to user: "You provided: --path={file_path}"
    Say to user: "But --path should point to a DIRECTORY for code analysis"
    Say to user: ""
    Say to user: "💡 For file import, use: --from={file_path}"
    Say to user: ""
    Say to user: "Suggested command:"
    Say to user: "/ccu:discover --target={target} --track={track} --from={file_path}"

    Exit command with helpful error
```

**Correct usage:**
- `--path=./project-directory` - For analyzing existing code
- `--from=./file.md` - For importing requirements from a file
- `--from=code --path=./project` - Explicit code analysis

## Generation Behavior (One-Level-Down)

This command follows the **one-level-down** rule for automatic generation:

| Target | Generates | Example |
|--------|-----------|---------|
| platform | Platform + all modules | Platform discovery + 5 module discoveries |
| module | Module + its features | Auth module discovery + 4 auth feature discoveries |
| feature | Feature only | Login feature discovery only |

**Important:**
- Platform discovery automatically discovers all modules (but NOT features)
- Module discovery automatically discovers all its features
- Feature discovery is a leaf level (no children)
- All child discoveries use the same track as the parent

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking** (ALL TRACKS)
   - When: After receiving initial user answers
   - Purpose: Generate questions and options, NOT assumptions
   - Usage:
     - Identify needed modules from user requirements
     - Generate QUESTIONS about how each module should work
     - Suggest best practice OPTIONS for each question
     - Help users discover needs through intelligent questions
   - CRITICAL:
     - INSTANT track: Makes simple assumptions
     - RAPID/STANDARD/ENTERPRISE: Generates questions for user confirmation

2. **Tool: mcp__mem0__search_memory**
   - When: Start of discovery
   - Purpose: Find similar past projects and patterns
   - Query: "similar projects {industry} {type}"

3. **Tool: mcp__mem0__add_memory**
   - When: End of discovery
   - Purpose: Store successful discovery patterns
   - Text: "Discovery for {project}: {key_findings}"

4. **Tool: mcp__claude-context__index_codebase** (if --from=code)
   - When: Analyzing existing codebase
   - Purpose: Index code for semantic search
   - Parameters: { "path": "{project_root}" }

5. **Tool: mcp__claude-context__search_code** (if --from=code)
   - When: Finding patterns in existing code
   - Purpose: Understand current implementation
   - Query: "main features architecture patterns components"

### Sequential-Thinking MCP
- **Purpose**: Progressive question refinement and intelligent follow-ups
- **Usage**: Analyzes each answer to determine if clarification needed
- **Tracks**: Active in RAPID/STANDARD/ENTERPRISE (not INSTANT)

### Mem0 MCP
- **Purpose**: Pattern memory and project similarity detection
- **Usage Points**:
  1. **Step 4 - Start of Discovery**: Search for similar projects and patterns
     - Query: "similar projects {industry} {type}"
     - Returns: Past project patterns with confidence scores
  2. **Step 9 - End of Discovery**: Store all patterns and insights
     - Stores: Project profile, tech decisions, patterns, Q&A insights
     - Preserves: Module structures, industry requirements, integrations
  3. **Module Discovery**: Store module-specific patterns
     - Captures: Module types, dependencies, test strategies
- **Storage Strategy**:
  - Overall project characteristics and confidence scores
  - Technology stack recommendations with reasoning
  - Architectural patterns and design decisions
  - Module structures, features, and dependencies
  - Successful Q&A patterns (RAPID/STANDARD/ENTERPRISE)
  - Industry-specific requirements and compliance needs
  - Integration patterns and external services
  - User types, roles, and permission models
- **Benefits**:
  - Future projects leverage past discoveries
  - Similar projects can skip redundant questions
  - Continuous improvement with each discovery
  - Build institutional knowledge over time

### Context7 MCP
- **Purpose**: Multi-file context awareness across discovery hierarchy
- **Usage**:
  - Links platform → module → feature discoveries
  - Maintains context across all project phases
  - Provides holistic understanding for better recommendations

### Claude Context MCP (@zilliz/claude-context-mcp)
- **Type**: stdio protocol MCP server
- **Purpose**: Semantic code search using vector embeddings
- **Technology Stack**:
  - OpenAI API: Generates code embeddings
  - Milvus Cloud: Stores and searches vectors
  - NPX: Executes without installation
- **Usage in Code Discovery** (`--from=code`):
  - Indexes entire codebase into vectors
  - Performs semantic similarity search
  - Detects patterns beyond keyword matching
  - Returns confidence scores based on vector similarity
- **Active for**: `--from=code` workflows
- **Benefits**:
  - 40% token reduction through smart retrieval
  - Better pattern detection via semantic understanding
  - Fast search with Milvus vector database

## Execution Flow

### Step -1: Determine Project Root Directory

**Find the project root by checking for ccu_workspace:**
```bash
# Start from current directory
current_dir = pwd

# Check up to 3 levels up for existing ccu_workspace
project_root = current_dir
for i in range(3):
  if exists("{current_dir}/ccu_workspace"):
    project_root = current_dir
    break
  current_dir = parent_of(current_dir)

# If no ccu_workspace found, use original current directory
if not found:
  project_root = pwd

Say to user: "📍 Using project root: {project_root}"

# All subsequent paths will use this project_root
```

### Step 0: Determine Discovery Source

Parse `$ARGUMENTS.from` parameter (default: "questions"):

```javascript
// Smart source detection
const source = $ARGUMENTS.from || "questions";

if (source === "questions") {
  // Continue with: Interactive Q&A Workflow
} else if (source === "code") {
  // Jump to: Code Discovery Workflow
} else if (source.startsWith("http://") || source.startsWith("https://")) {
  // Jump to: URL Import Workflow
} else if (source.startsWith("github:")) {
  // Jump to: GitHub Import Workflow
} else if (source.startsWith("figma:")) {
  // Jump to: Figma Import Workflow
} else if (source.startsWith("notion:")) {
  // Jump to: Notion Import Workflow
} else if (source.startsWith("./") || source.startsWith("/")) {
  // Jump to: File Import Workflow
} else {
  // Try to auto-detect based on pattern
  Say to user: "🔍 Analyzing source: {source}"
}
```

**Source-specific workflows:**
- **questions**: Interactive Q&A (default flow)
- **code**: Analyze existing codebase
- **URL**: Fetch and extract requirements
- **File**: Load local requirements document
- **GitHub**: Analyze repo structure and README
- **Figma**: Extract UI requirements
- **Notion**: Import structured docs

## Interactive Q&A Workflow (--from=questions)

### Step 0.1: Validate Required Parameters

**Validate track parameter:**
```
valid_tracks = ["instant", "rapid", "standard", "enterprise"]

If $ARGUMENTS.track NOT in valid_tracks:
  # Check for common mistakes and suggest corrections
  If $ARGUMENTS.track == "normal":
    suggested = "standard"
  Else if $ARGUMENTS.track == "quick":
    suggested = "rapid"
  Else if $ARGUMENTS.track == "fast":
    suggested = "instant"
  Else if $ARGUMENTS.track == "full":
    suggested = "enterprise"
  Else if $ARGUMENTS.track == "simple":
    suggested = "rapid"
  Else:
    suggested = null

  Display error:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ INVALID TRACK PARAMETER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  You specified: --track={$ARGUMENTS.track}

  {if suggested}
  💡 Did you mean: --track={suggested}?
  {/if}

  Valid track options are:
  • instant    - AI-powered extraction (0 questions)
  • rapid      - Essential questions (5 questions)
  • standard   - Comprehensive analysis (15+ questions)
  • enterprise - Detailed deep-dive (25+ questions)

  Example usage:
  /ccu:discover --target=platform --track=standard

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Exit command.
```

**Validate target parameter:**
```
valid_targets = ["platform", "module", "feature"]

If $ARGUMENTS.target NOT in valid_targets:
  Display error:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ INVALID TARGET PARAMETER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  You specified: --target={$ARGUMENTS.target}

  Valid target options are:
  • platform - Discover entire application
  • module   - Discover specific module
  • feature  - Discover specific feature

  Example usage:
  /ccu:discover --target=platform --track=rapid
  /ccu:discover --target=module --module=auth --track=standard
  /ccu:discover --target=feature --module=auth --feature=login --track=rapid

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Exit command.
```

**Validate required dependencies:**
```
If $ARGUMENTS.target == "module" AND !$ARGUMENTS.module:
  Display error:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ MISSING REQUIRED PARAMETER: --module
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  When --target=module, you must specify the module name:
  --module=<module_name>

  Example:
  /ccu:discover --target=module --module=auth --track=rapid
  /ccu:discover --target=module --module=payments --track=standard

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Exit command.

If $ARGUMENTS.target == "feature" AND (!$ARGUMENTS.module OR !$ARGUMENTS.feature):
  Display error:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ MISSING REQUIRED PARAMETERS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  When --target=feature, you must specify:
  --module=<module_name>
  --feature=<feature_name>

  Example:
  /ccu:discover --target=feature --module=auth --feature=two-factor --track=rapid
  /ccu:discover --target=feature --module=payments --feature=subscriptions --track=standard

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Exit command.
```

### Step 0.2: Load Parent Context (for module/feature targets)

**If target == "module":**

1. **Load platform discovery context:**
   ```bash
   Read {project_root}/ccu_workspace/platform/01-discovery/discovery-[track].json
   ```

   If platform discovery doesn't exist:
   Say to user: "❌ Platform discovery required first. Please run: /ccu:discover --target=platform --track=[track]"
   Exit command.

2. **Display platform context:**

   ╔════════════════════════════════════════════════════════════════════╗
   ║  📋 PLATFORM CONTEXT                                                ║
   ╚════════════════════════════════════════════════════════════════════╝

   🎯 Application: [app name from platform discovery]
   📝 Purpose: [core concept from platform discovery]
   👥 Target Users: [user types from platform discovery]
   🛠️ Tech Stack: [selected stack from platform discovery]

   📦 Discovering Module: {module}
   ══════════════════════════════════════════════════════════════════════

**If target == "feature":**

1. **Load platform and module context:**
   ```bash
   Read {project_root}/ccu_workspace/platform/01-discovery/discovery-[complexity].json
   Read {project_root}/ccu_workspace/modules/{module}/module-context.md
   ```

   If either doesn't exist:
   Say to user: "❌ Module discovery required first. Please run: /ccu:discover --target=module --module={module} --track=[complexity]"
   Exit command.

2. **Display combined context:**

   ╔════════════════════════════════════════════════════════════════════╗
   ║  📋 DISCOVERY CONTEXT                                                ║
   ╚════════════════════════════════════════════════════════════════════╝

   🏢 Platform: [app name] - [purpose]
   📦 Module: {module} - [module purpose from context]
   ⚡ Module Capabilities: [key features from module context]

   🔧 Discovering Feature: {feature}
   ══════════════════════════════════════════════════════════════════════

### Step 0.5: Check for Update Mode (if --update flag present)

If `--update` flag is present:

1. **Load existing discovery data:**
   ```bash
   # Determine correct path based on target
   If target == "platform":
     Read {project_root}/ccu_workspace/platform/01-discovery/discovery-[complexity].json
     Read {project_root}/ccu_workspace/platform/01-discovery/discovery-summary.md
   If target == "module":
     Read {project_root}/ccu_workspace/modules/{module}/01-discovery/discovery-[complexity].json
     Read {project_root}/ccu_workspace/modules/{module}/01-discovery/discovery-summary.md
   If target == "feature":
     Read {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/discovery-[complexity].json
     Read {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/discovery-summary.md
   ```

   If files don't exist:
   Say to user: "❌ No existing discovery found. Running fresh discovery instead..."
   Continue to Step 1 without update mode.

2. **Present current understanding:**

   ╔════════════════════════════════════════════════════════════════════╗
   ║  📋 EXISTING DISCOVERY SUMMARY                                       ║
   ╚════════════════════════════════════════════════════════════════════╝

   🎯 Application Type: [from existing data]
   👥 Target Users: [from existing data]
   ✨ Core Features: [from existing data]
   🛠️ Tech Stack: [from existing data]
   🕐 Last Analysis: [timestamp]
   📊 Confidence Score: [previous score]%

   ══════════════════════════════════════════════════════════════════════

3. **Ask what needs updating:**

   🔄 **What aspects need recalibration?**

   a) Add missing features or modules
   b) Change how features should work (functionality)
   c) Update user types or personas
   d) Add or modify integration needs (AI services, APIs)
   e) Refine success criteria and business goals
   f) Complete refinement (re-ask all questions)

   Your choice (a-f or describe):

4. **Based on user's choice:**

   **For specific updates (a-e):**
   - Present 1-3 targeted questions related to the update area

   **For option a) "Add missing features or modules":**
   - "What additional features/modules need to be included?"
   - "How should these new features work?"
   - "How do they enhance the user experience?"

   **For option b) "Change how features should work":**
   - "Which features need different functionality?"
   - "How should they work instead?"
   - "What user needs drive these changes?"

   **For option c) "Update user types or personas":**
   - "What user types should be added/removed?"
   - "How do their needs differ?"
   - "What features do they specifically need?"

   **For option d) "Add or modify integration needs":**
   - "What external services would enhance features?"
   - "Which features would benefit from AI/API integration?"
   - "Are there integrations to remove?"

   **For option e) "Refine success criteria":**
   - "What defines success for this project?"
   - "What metrics matter most?"
   - "What are the key business goals?"

   **For complete refinement (f):**
   - Continue to regular Step 1 but pre-fill answers from existing data
   - Allow user to modify each pre-filled answer

5. **Merge updates with existing data:**
   - Preserve unchanged aspects
   - Update modified sections
   - Add version complexitying:
     ```json
     "update_history": [
       {
         "timestamp": "[ISO timestamp]",
         "changes": ["Added payment processing", "Changed to React Native"],
         "previous_confidence": 75,
         "new_confidence": 85
       }
     ]
     ```

### Step 1: Initialize Discovery

**Display initial progress header:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 DISCOVERY - $ARGUMENTS.track TRACK          [0% ░░░░░░░░░░]     │
└─────────────────────────────────────────────────────────────────────┘
```

**If in update mode (from Step 0.5):**
Say to user: "🔄 Updating $ARGUMENTS.track discovery with your changes..."

**Check track and display appropriate message:**
```
If $ARGUMENTS.track == "instant":
  Say to user: "🚀 INSTANT DISCOVERY - AI-POWERED EXTRACTION"
  Say to user: "⚡ Auto-processing instant discovery..."

  # INSTANT complexity internal processing:
  - Extract requirements from description
  - Auto-proceed without confirmation
  - Analyze with business-analyst
  - Generate discovery documentation
  - Auto-trigger specification phase

Else if $ARGUMENTS.track == "rapid":
  Say to user: "⚡ RAPID DISCOVERY - ESSENTIAL QUESTIONS"

  # Check questions count from YAML
  If target == "feature":
    questions_count = 4  # Feature rapid has 4 questions
  Else if target == "module":
    questions_count = 5  # Module rapid has 5 questions
  Else:
    questions_count = Load from YAML

  Say to user: "📊 Starting rapid discovery with {questions_count} essential questions..."

Else if $ARGUMENTS.track == "standard":
  Say to user: "📋 STANDARD DISCOVERY - COMPREHENSIVE QUESTIONS"
  Say to user: "📊 Starting standard discovery process..."

Else if $ARGUMENTS.track == "enterprise":
  Say to user: "🏢 ENTERPRISE DISCOVERY - DETAILED ANALYSIS"
  Say to user: "📊 Starting enterprise discovery process..."
```

**Internal complexitying:** TodoWrite manages progress silently throughout execution.

### Step 1.5: Search for Existing Discovery Patterns

**Search for similar discovery patterns using Mem0 MCP:**
```
# Only search if we have enough context (not for INSTANT track without description)
If $ARGUMENTS.track != "instant" OR $ARGUMENTS.description:
  Say to user: "🔍 Searching for similar discovery patterns..."

  # Build search query based on available context
  search_query = "PATTERN:DISCOVERY"
  If $ARGUMENTS.target:
    search_query += " ${ARGUMENTS.target}"
  If $ARGUMENTS.track:
    search_query += " ${ARGUMENTS.track}"
  If $ARGUMENTS.module:
    search_query += " module:${ARGUMENTS.module}"
  If $ARGUMENTS.feature:
    search_query += " feature:${ARGUMENTS.feature}"
  If $ARGUMENTS.description:
    search_query += " ${ARGUMENTS.description}"

  # Search for patterns
  discovery_patterns = mcp__mem0__search_memory(
    query: search_query,
    limit: 10
  )

  If discovery_patterns AND discovery_patterns.results.length > 0:
    Say to user: "✨ Found ${discovery_patterns.results.length} similar discovery patterns"

    # Use patterns to enhance questions and suggestions
    For pattern in discovery_patterns.results (max 3 most relevant):
      Extract and display relevant insights:
      - Similar project type and features
      - Successful module structures
      - Common integration patterns
      - Confidence scores from past discoveries

    Say to user: "💡 Using these patterns to enhance discovery process..."

    # Store patterns for use in question generation
    similar_patterns = discovery_patterns.results
  Else:
    Say to user: "📝 Starting fresh discovery (no similar patterns found)"
```

### Step 1.6: Validate Framework Installation

**Check if framework is properly installed:**
```
# Validate that framework templates exist
If not exists(".claude/templates/discovery/discovery-questions.yaml"):
  Say to user: "❌ Framework templates not found at .claude/templates/"
  Say to user: "The CCU framework may not be properly installed."
  Say to user: "Please ensure you have run the installation script."
  Say to user: "Expected file: .claude/templates/discovery/discovery-questions.yaml"
  Exit with error

Say to user: "✅ Framework templates found"
```

### Step 1.7: Display Rich Discovery Context

**Display context based on complexity:**
```
If $ARGUMENTS.track != "instant":
  # Show context for rapid/standard/enterprise complexitys
```

**For RAPID/STANDARD/ENTERPRISE complexitys, display context before questions:**

```
📋 DISCOVERY CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're defining: [{TARGET}: {name}]
{if target == "feature"}
  Parent Module: [{module} - {module_purpose from context}]
  Parent Platform: [{platform} - {platform_purpose from context}]
{elif target == "module"}
  Parent Platform: [{platform} - {platform_purpose from context}]
{/if}

This discovery will help us understand:
✓ What you want to build
✓ How it fits into your existing system
✓ Technical requirements needed

Your answers will be analyzed by AI agents to:
✓ Detect patterns and suggest best practices
✓ Identify potential issues early
✓ Generate complete specifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Display progress indicator:**

```
🔄 DISCOVERY PROGRESS - {TRACK} Track
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Questions: [0/{QUESTION_COUNT}] ⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪
{if track == "rapid"}
  Total: 5 essential questions
{elif track == "standard"}
  Total: 10 comprehensive questions
{elif track == "enterprise"}
  Total: 15 deep-dive questions
{/if}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Load Questions from YAML

**MANDATORY ACTION - YOU MUST LOAD QUESTIONS FROM YAML:**

```
⚠️ CRITICAL: Before proceeding, you MUST:
1. Use the Read tool to load: .claude/templates/discovery/discovery-questions.yaml
2. Parse the YAML content
3. Extract questions for the specific track and target

Path to read:
.claude/templates/discovery/discovery-questions.yaml

Note: This file is created during framework installation.
If it doesn't exist, the framework may not be properly installed.

Extract questions based on target and track:

If target == "platform":
  Extract from: tracks.[track]
  - instant: 0 questions (skip to AI exploration)
  - rapid: 5 questions from tracks.rapid.questions
  - standard: 10 questions from tracks.standard.categories.*.questions
  - enterprise: 15 questions from tracks.enterprise.categories.*.questions

If target == "module":
  Extract from: targets.module.[track]

If target == "feature":
  Extract from: targets.feature.[track]

VALIDATION REQUIREMENTS:
✅ STANDARD must have EXACTLY 10 questions (not 15!)
✅ Questions must come from YAML file only
✅ If you cannot load YAML, STOP and report error
✅ If question count doesn't match, STOP and report error

FORBIDDEN QUESTIONS (Never ask these - they belong in other phases):
❌ Security compliance details → Architect phase
❌ Scale/performance metrics → Architect phase
❌ Timeline/delivery dates → Plan phase
❌ Technical stack choices → Architect phase
❌ Data storage methods → Architect phase
❌ Deployment options → Deploy phase
❌ User count projections → Architect phase
❌ MVP timeline expectations → Plan phase
❌ Business model details → Specify phase

REQUIRED FOCUS (All questions must explore):
✅ WHAT we're building
✅ HOW features should work
✅ WHO uses it (type, not count)
✅ WHICH integrations enhance functionality
✅ WHAT makes users successful
```

### Step 2.5: Market Research (Optional for STANDARD/ENTERPRISE)

**Conduct market research for comprehensive discovery:**

```
# Only for STANDARD/ENTERPRISE tracks and platform targets
If $ARGUMENTS.track in ["standard", "enterprise"] AND $ARGUMENTS.target == "platform":

  # Check if user has provided initial concept/description
  If $ARGUMENTS.description OR initial_concept_established:
    Say to user: "🔍 Researching similar applications and best practices..."

    # Build search query based on initial concept
    search_query = ""
    If $ARGUMENTS.description:
      search_query = "${ARGUMENTS.description} application architecture best practices 2025"
    Else if application_type:
      search_query = "${application_type} application best practices trends 2025"

    # Perform web search for market insights
    web_results = WebSearch(
      query: search_query,
      blocked_domains: ["pinterest.com", "facebook.com"],  # Avoid social media
      allowed_domains: []  # Allow all technical sites
    )

    # If relevant results found, fetch detailed content
    If web_results AND web_results.results.length > 0:
      Say to user: "📚 Analyzing ${web_results.results.length} relevant sources..."

      # Fetch top 3 most relevant articles (based on relevance score)
      market_insights = []
      For result in web_results.results.slice(0, 3):
        If result.relevance_score > 0.7:
          article = WebFetch(
            url: result.url,
            prompt: "Extract key insights about: architecture patterns, common features, best practices, pitfalls to avoid, technology recommendations"
          )

          market_insights.push({
            source: result.title,
            url: result.url,
            insights: article.extracted_content
          })

      # Store market research for agent analysis
      If market_insights.length > 0:
        market_research = {
          "trends": extracted_trends,
          "best_practices": extracted_practices,
          "common_features": extracted_features,
          "pitfalls": extracted_pitfalls,
          "tech_recommendations": extracted_tech
        }

        Say to user: "✅ Market research completed - ${market_insights.length} sources analyzed"

        # Store insights for use in business-analyst activation
        Store market_research for inclusion in agent prompt
      Else:
        Say to user: "📝 Limited market data found - proceeding with standard discovery"

  Else:
    # Skip if no initial concept to research
    Say to user: "💡 Skipping market research - will gather after initial questions"

Else:
  # Skip for INSTANT/RAPID tracks or non-platform targets
  # Market research not needed for simpler discoveries
```

### Step 3: Interactive Q&A with User (Skip ONLY for INSTANT complexity)

**Check complexity parameter:**
```
If $ARGUMENTS.track == "instant":
  Skip to Step 3.5 (AI-Powered Extraction)
Else:
  Continue with questions below
```

**For RAPID/STANDARD/ENTERPRISE tracks:**

**ENFORCEMENT CHECK - MUST DO BEFORE PRESENTING ANY QUESTIONS:**
```
1. Confirm you have used Read tool to load: .claude/templates/discovery/discovery-questions.yaml
2. Verify question counts from YAML:
   - RAPID: Must have exactly 5 questions
   - STANDARD: Must have exactly 10 questions
   - ENTERPRISE: Must have exactly 15 questions
3. If YAML not loaded or count wrong: STOP and report error
4. NEVER generate your own questions - use only questions from YAML
```

**Show progress display:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Questions:    [0/$TOTAL] ░░░░░░░░░░░░░░░░░░░░ 0% 🔄
Analysis:     [Wait]     ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
Confidence:   [...]      ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IMPORTANT: For RAPID track (5 questions), present ALL questions at once:**
```
If $ARGUMENTS.track == "rapid":
  Load all 5 questions from YAML
  Present ALL 5 questions together in the format below
  Wait for user to answer ALL questions
  After user answers all → Go to Step 3.2 (Module Identification)
  Then proceed to Step 3.3 for module-specific questions
  No incremental analysis for rapid track - proceed after module questions
```

**For STANDARD track (10 questions):**
```
**MUST FIRST**: Use Read tool to load .claude/templates/discovery/discovery-questions.yaml
Then extract exactly 10 questions from tracks.standard.categories:

Batch 1 (Questions 1-3) from core_feature_exploration:
- application_vision
- feature_functionality
- module_identification

Batch 2 (Questions 4-5) from workflow_exploration:
- user_workflows
- edge_cases

Batch 3 (Questions 6-8) from feature_details:
- data_per_feature
- feature_settings
- integration_opportunities

Batch 4 (Questions 9-10) from validation:
- definition_of_working
- non_negotiable_quality
```

**For ENTERPRISE track (15 questions):**
```
**MUST FIRST**: Use Read tool to load .claude/templates/discovery/discovery-questions.yaml
Then extract exactly 15 questions from tracks.enterprise.categories:

Batch 1 (Questions 1-3) from feature_discovery
Batch 2 (Questions 4-6) from feature_discovery (continued)
Batch 3 (Questions 7-9) from module_architecture
Batch 4 (Questions 10-12) from module_architecture (continued)
Batch 5 (Questions 13-15) from user_experience
```

**Present each batch in this format:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔢 QUESTION [N]/[TOTAL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[emoji from YAML] **[category from YAML]**

[Actual question text from YAML file - MUST be loaded, not generated]

💡 **Suggestions based on your description:**
  a) [Generate contextual suggestion based on user's project]
  b) [Generate contextual suggestion]
  c) [Generate contextual suggestion]
  d) [Generate contextual suggestion]
  e) Other: [please specify]

**Your answer:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**RAPID TRACK FORMAT (All 5 Questions Together):**
```
**MUST FIRST**: Use Read tool to load .claude/templates/discovery/discovery-questions.yaml
Then extract these 5 questions from tracks.rapid.questions:
1. problem_solution - Problem & Solution Exploration
2. target_users - Target Users & Needs
3. core_features - Feature Deep Dive (HOW they work)
4. integrations_exploration - Integration Opportunities
5. success_definition - Success Criteria

Present in this format:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ RAPID DISCOVERY - 5 ESSENTIAL QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each question from YAML, display:]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔢 QUESTION [N]/5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[emoji] **[category]**

[question text from YAML]

[If question has sequential_exploration, display as:]
  [N].1: [First sub-question]
  [N].2: [Second sub-question]
  [N].3: [Third sub-question]
  [N].4: [Fourth sub-question]

💡 **Suggestions:** [generate contextual suggestions]

**Your answer:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**IMPORTANT:**
- **For RAPID complexity**: Present ALL 5 questions at once using the format above
- **For STANDARD/ENTERPRISE**: Present 3 questions at a time (or remaining if less than 3)
- Wait for user to answer ALL questions in batch before continuing
- **For RAPID**: After all answers collected → Go to Step 3.2 (Module Identification) → Step 3.3 (Module Confirmation) → Step 3.4 (Module Questions)
- **For STANDARD/ENTERPRISE**: After each batch → Go to Step 3.5 for incremental analysis
  After ALL questions complete → Go to Step 3.2 (Module Identification) → Step 3.3 (Module Confirmation) → Step 3.4 (Module Questions)
- Brief status: "Collecting answers..." (TodoWrite complexitys internally)
- If --description provided, enhance suggestions with context
- **For module/feature targets**: Enhance suggestions using parent context
  - Module questions reference platform capabilities
  - Feature questions reference module responsibilities
  - Use context to make suggestions more specific and relevant

### Step 3.2: Module Identification from Answers

**Use Sequential-Thinking MCP to identify modules and generate questions:**

```
Sequential Thinking analyzes user's answers to:
1. Identify needed modules
2. Generate QUESTIONS about each module (not assumptions)
3. Suggest best practice options for each question

Example:
User answers: "expense tracking for family"
Sequential identifies modules:
- Family Management module
- Expense Tracking module
- Analytics module

Sequential generates questions:
- "How should family setup work?"
- "How should expense entry work?"
- "What analytics do you need?"
```

### Step 3.3: Module Confirmation (RAPID/STANDARD/ENTERPRISE)

**INSTANT Track:**
- Skip this step - auto-detect modules
- Proceed directly to discovery.json creation

**RAPID/STANDARD/ENTERPRISE Tracks:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SUGGESTED MODULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your requirements, I suggest these modules:

[List modules identified by sequential thinking]
For each module:
  ✓ {module_name} - {module_description}

Would you like to:
[A] Accept all suggested modules
[R] Remove some modules
[E] Add additional modules
[M] Modify module names/descriptions
[C] Continue with these modules

Your choice: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If user selects [R], [E], or [M]:
  Handle modifications interactively
  Show updated module list
  Confirm final list

After confirmation:
  Say to user: "💾 Storing confirmed modules in memory..."

  # Store confirmed modules to memory with PATTERN prefix
  mcp__mem0__add_memory(
    text: "PATTERN:DISCOVERY:MODULES - Project: {project_type}, Modules: {modules_list}, Description: {description}, Target: {target}, Track: {track}"
  )

  Say to user: "✅ Modules saved for future reference"
```

### Step 3.4: Module-Specific Questions (Skip for INSTANT)

**Ask users HOW each confirmed module should work:**

**INSTANT Track:**
- Skip this step - make simple assumptions
- Proceed directly to discovery.json creation

**RAPID Track (1 question per module):**
```
module_count = len(confirmed_modules)
For index, module in enumerate(confirmed_modules):
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "📦 MODULE {index+1} of {module_count}: {module.name}"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: ""
  Say to user: "**MODULE QUESTION 1/1**"
  Say to user: ""
  Say to user: "How should {module.name} work?"
  Say to user: ""
  Say to user: "  a) Simple: [basic option suggested by sequential thinking]"
  Say to user: "  b) Standard: [common option suggested by sequential thinking]"
  Say to user: "  c) Advanced: [complex option suggested by sequential thinking]"
  Say to user: "  d) Custom: [describe your needs]"
  Say to user: ""
  Say to user: "**Your choice:** "

  Collect answer

  # Store module configuration to memory with PATTERN prefix
  mcp__mem0__add_memory(
    text: "PATTERN:MODULE:{module.type} - Name: {module.name}, Config: {selected_option}, Complexity: {choice}, Requirements: {any_custom_requirements}, Track: RAPID"
  )

  Say to user: "💾 {module.name} configuration saved"
```

**STANDARD Track (2-3 questions per module):**
```
module_count = len(confirmed_modules)
For index, module in enumerate(confirmed_modules):
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "📦 MODULE {index+1} of {module_count}: {module.name}"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: ""

  Say to user: "**MODULE QUESTION 1/2-3**"
  Say to user: ""
  Say to user: "**1. Core Functionality:**"
  Say to user: "How should {module.name} handle its main features?"
  Display options suggested by sequential thinking
  Collect answer

  Say to user: ""
  Say to user: "**MODULE QUESTION 2/2-3**"
  Say to user: ""
  Say to user: "**2. User Interaction:**"
  Say to user: "How will users work with {module.name}?"
  Display workflow options suggested by sequential thinking
  Collect answer

  If applicable:
    Say to user: ""
    Say to user: "**MODULE QUESTION 3/3**"
    Say to user: ""
    Say to user: "**3. Special Requirements:**"
    Say to user: "Any special needs for {module.name}?"
    Display customization options
    Collect answer

  # Store module configuration to memory with PATTERN prefix
  mcp__mem0__add_memory(
    text: "PATTERN:MODULE:{module.type} - Name: {module.name}, Functionality: {answer1}, Interaction: {answer2}, Special: {answer3 if applicable}, Track: STANDARD"
  )

  Say to user: "💾 {module.name} configuration saved"
```

**ENTERPRISE Track (4-5 questions per module):**
```
module_count = len(confirmed_modules)
For index, module in enumerate(confirmed_modules):
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "📦 MODULE {index+1} of {module_count}: {module.name}"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: ""

  Say to user: "**MODULE QUESTION 1/4-5**"
  Say to user: ""
  Say to user: "**1. Core Functionality:**"
  Display and collect answer

  Say to user: ""
  Say to user: "**MODULE QUESTION 2/4-5**"
  Say to user: ""
  Say to user: "**2. Workflows & Permissions:**"
  Display and collect answer

  Say to user: ""
  Say to user: "**MODULE QUESTION 3/4-5**"
  Say to user: ""
  Say to user: "**3. Integration Requirements:**"
  Display and collect answer

  Say to user: ""
  Say to user: "**MODULE QUESTION 4/4-5**"
  Say to user: ""
  Say to user: "**4. Edge Cases & Exceptions:**"
  Display and collect answer

  If applicable:
    Say to user: ""
    Say to user: "**MODULE QUESTION 5/5**"
    Say to user: ""
    Say to user: "**5. Compliance & Audit Needs:**"
    Display and collect answer

  # Store module configuration to memory with PATTERN prefix
  mcp__mem0__add_memory(
    text: "PATTERN:MODULE:{module.type} - Name: {module.name}, Enterprise Config: {all_answers}, Compliance: {compliance_needs}, Integrations: {integrations}, Track: ENTERPRISE"
  )

  Say to user: "💾 {module.name} enterprise configuration saved"
```

### Step 3.4: Deep Feature Exploration (After Module Questions)

**Based on user's MODULE ANSWERS, explore details:**

```
For each identified feature/module:
  Sequential-Thinking MCP explores:
    - Feature: "{feature_name}"
    - Context: {application_type, user_needs}
    - Deep dive questions:
      → "How should users interact with this?"
      → "What data needs to be captured?"
      → "What options/settings are needed?"
      → "What edge cases exist?"
      → "What would make this delightful?"

  Example - Food Tracking Feature:
    Initial: "Track what I eat"
    Sequential exploration:
      → "How to log food?" (manual entry, barcode scan, photo, voice?)
      → "What nutrition data?" (calories only, full macros, micronutrients?)
      → "Custom foods?" (create own, modify existing, save recipes?)
      → "Portion control?" (weights, visual guides, standard servings?)
      → "Meal planning?" (pre-log future meals, templates, shopping lists?)
      → "Historical data?" (copy previous meals, favorites, quick-add?)

  For INSTANT track:
    - Make intelligent assumptions about simplest useful implementation
    - Focus on core functionality only

  For RAPID track:
    - Ask 1-2 key questions per module about functionality
    - "Should users be able to create custom foods or use database only?"
    - "Do you need meal planning or just tracking?"

  For STANDARD/ENTERPRISE tracks:
    - Deep exploration of each module's functionality
    - Multiple follow-ups to understand complete workflows
    - Edge cases and special scenarios
```

**Update progress after adaptive questions:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Questions:    [7/20+2] ██████████░░░░░░░░░░ 45% 🔄 (2 adaptive added)
Analysis:     [Active] ████████░░░░░░░░░░░░ 40% 🔍
Confidence:   [Building] ██████░░░░░░░░░░░░ 30% 📈
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3.5: Incremental Analysis (After Each Batch - Skip for INSTANT and RAPID)

After each batch of 3 questions (for STANDARD/ENTERPRISE only):

1. **Use Sequential Thinking MCP for deeper analysis:**

   ```
   # Calculate batch information
   batch_number = (questions_asked / 3) rounded up
   total_batches = total_questions / 3 rounded up

   # Use Sequential Thinking for pattern analysis
   mcp__sequential-thinking__sequentialthinking(
     thought: "Analyzing batch ${batch_number} responses for ${ARGUMENTS.target}.
              User has answered: ${brief_summary_of_answers}.
              Identifying patterns and potential gaps...
              Checking if clarification is needed...
              Determining if approach adjustment is required...",
     nextThoughtNeeded: true,
     thoughtNumber: batch_number,
     totalThoughts: total_batches + 2,
     isRevision: false
   )

   # The sequential thinking will help identify:
   # - Emerging patterns from user's answers
   # - Potential contradictions or gaps
   # - Areas needing clarification
   # - Opportunities for deeper exploration
   ```

2. **Send enhanced data to business-analyst with visible output:**

   Say to user: "🤖 ANALYZING YOUR ANSWERS..."

   Activate business-analyst with Opus 4.1:
   "Perform incremental analysis on these partial discovery answers, enhanced by sequential thinking insights.
   Sequential thinking identified: [patterns and gaps from MCP]
   Provide USER-VISIBLE insights including:
   - Patterns detected so far
   - Recommendations for approach
   - Potential issues or gaps identified
   - Suggestions for remaining questions
   - Confidence level assessment
   Format your response for direct display to the user: [Partial JSON with answers collected so far]"

3. **Display agent insights to user:**

   ```
   ╔════════════════════════════════════════════════════════════════════╗
   ║  🤖 AGENT INSIGHTS ─ business-analyst                               ║
   ╚════════════════════════════════════════════════════════════════════╝

   🔍 Patterns Detected:
   ✅ [Pattern 1 from agent analysis]
   ✅ [Pattern 2 from agent analysis]
   ✅ [Pattern 3 from agent analysis]

   💡 Recommendations:
   • [Recommendation 1 from agent]
   • [Recommendation 2 from agent]

   ⚠️ Potential Considerations:
   [Issue or gap if identified]

   🎯 Confidence Level: [X]%

   🔄 Adjusting remaining questions based on your needs...
   ══════════════════════════════════════════════════════════════════════
   ```

3. **Update progress indicator:**

   ```
   ╔════════════════════════════════════════════════════════════════════╗
   ║  📊 DISCOVERY PROGRESS ─ {COMPLEXITY} Track                              ║
   ╚════════════════════════════════════════════════════════════════════╝

   Progress: [🟢🟢🟢⚪⚪⚪⚪⚪⚪⚪] {ANSWERED}/{TOTAL} Questions ({percentage}%)
   🎯 Agent Confidence: {confidence}%

   ══════════════════════════════════════════════════════════════════════
   ```

4. **Command evaluates agent feedback:**

   **If confidence < 60% OR critical gaps detected:**

   Present clarification (max 1 question):

   ╔════════════════════════════════════════════════════════════════════╗
   ║  💡 CLARIFICATION NEEDED                                             ║
   ╚════════════════════════════════════════════════════════════════════╝

   Based on your answers and agent analysis:

   🤔 [Agent-suggested clarification question]

   🖊️ Your clarification:

   ══════════════════════════════════════════════════════════════════════

   Add clarification to collected answers.

5. **Continue to next batch or proceed to Step 3.2 if all questions completed**
   - If more questions remain: Return to Step 3 for next batch
   - If all questions answered: Continue to Step 3.2 (Module Identification)


### Step 4: Gather Enhanced Context from MCPs

**Gather additional context if technical details were mentioned:**

```
# Check if technical stack or libraries were mentioned in answers
technical_mentioned = false
detected_technologies = []

For answer in all_collected_answers:
  If answer contains technology/library/framework names:
    technical_mentioned = true
    detected_technologies.add(detected_tech)

If technical_mentioned AND track in ["standard", "enterprise"]:
  Say to user: "🔍 Gathering technical documentation context..."

  # Get relevant technical documentation from Context7
  For tech in detected_technologies:
    context7_result = mcp__context7__resolve-library-id(
      libraryName: tech
    )

    If context7_result AND context7_result.found:
      technical_docs = mcp__context7__get-library-docs(
        context7CompatibleLibraryID: context7_result.id,
        topic: "architecture best-practices getting-started",
        tokens: 2000
      )

      # Store technical context for agent analysis
      technical_context[tech] = technical_docs

  Say to user: "✅ Technical context gathered for: ${detected_technologies.join(', ')}"

# Search for similar project patterns regardless of technical mention
If track != "instant":
  similar_search = "${application_type} ${core_features.join(' ')} requirements"

  similar_projects = mcp__mem0__search_memory(
    query: similar_search,
    limit: 5
  )

  If similar_projects AND similar_projects.results.length > 0:
    Say to user: "📊 Found ${similar_projects.results.length} similar project patterns"
    # Store for use in agent analysis
    project_patterns = similar_projects.results

# Use Sequential Thinking for requirement synthesis
If track in ["standard", "enterprise"]:
  mcp__sequential-thinking__sequentialthinking(
    thought: "Synthesizing discovery data for ${ARGUMENTS.target}:
             - User answers collected: ${all_answers.length}
             - Patterns detected: ${patterns_identified}
             - Similar projects found: ${similar_projects ? similar_projects.results.length : 0}
             - Technical context gathered: ${technical_mentioned}
             Creating comprehensive discovery analysis...",
    nextThoughtNeeded: false,
    thoughtNumber: 1,
    totalThoughts: 1
  )
```

### Step 4.5: Complete Discovery Memory Storage

**After all module questions are complete, store the complete discovery:**

```
Say to user: "💾 Storing complete discovery pattern..."

# Store complete discovery to memory with PATTERN prefix
mcp__mem0__add_memory(
  text: "PATTERN:DISCOVERY:COMPLETE - Type: {project_type}, Modules: {all_confirmed_modules}, " +
        "ModuleConfigs: {all_module_answers}, Target: {target}, Track: {track}, " +
        "Users: {identified_users}, Features: {core_features}"
)

Say to user: "✅ Discovery pattern saved for future projects"
```

### Step 4.6: Pattern Recognition (Optional - Only if matches found)

**Only for RAPID/STANDARD/ENTERPRISE tracks, search for similar patterns:**

```
# Only search after we have full context from all questions
If track != "instant":
  # Build comprehensive search query from collected information
  search_query = "{project_description} {confirmed_modules} {module_configurations} {user_requirements}"

  # Search for overall project similarity
  similar_projects = mcp__mem0__search_memory(
    query: search_query
  )

   # Search for specific technical patterns
   technical_patterns = mcp__mem0__search_memory(
     query: "{identified_requirements} {technical_challenges} {integration_needs}"
   )

   # Search for industry-specific patterns (if applicable)
   If industry specified:
     industry_patterns = mcp__mem0__search_memory(
       query: "{industry} compliance security regulations best-practices"
     )

   # Search for module patterns (if platform target)
   If target == "platform":
     module_patterns = mcp__mem0__search_memory(
       query: "modules for {project_type} {confirmed_modules}"
     )

  # Only display if we found relevant patterns
  If similar_projects.similarity > 70% OR technical_patterns.similarity > 70%:
    Display:
    💡 PATTERN DETECTION (Powered by Mem0 MCP)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Similar patterns found from previous projects:
    [Display relevant matches with similarity scores]

    These patterns suggest:
    [Display suggestions based on patterns]

    Would you like to apply any of these patterns? [Y/n]: _
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Else:
    # Don't show anything - no relevant patterns found
    Continue to next step

2. **Explore integration opportunities (RAPID/STANDARD/ENTERPRISE only):**
   ```
   Load .claude/templates/discovery/integrations-registry.yaml
   Based on application type and features:

   Ask user:
   "Would any of these integrations enhance your features?"
   - [Relevant AI services for the app type]
   - [Relevant automation tools]
   - [Relevant data sources]

   Only include integrations user confirms wanting.
   ```

3. If pattern matches found (similarity > 70%), display results:

   📦 SIMILAR PROJECTS:

   🌟 E-commerce Platform (85% match)
      Previous: "B2C marketplace for handmade goods"
      Stack: Next.js + Stripe + PostgreSQL
      Modules: Auth, Products, Cart, Checkout, Dashboard
      Success: High (92% confidence)
      Time saved: ~40% using this pattern
      Key insights: "Stripe Connect for multi-vendor"

   📦 Marketplace Platform (72% match)
      Previous: "Multi-vendor platform"
      Stack: React + Supabase + Stripe Connect
      Modules: Users, Listings, Payments, Analytics
      Success: Medium (78% confidence)
      Lessons learned: "Supabase RLS for tenant isolation"

   🔧 TECHNICAL PATTERNS:

   ✓ Authentication: JWT with refresh tokens (90% success)
   ✓ State Management: Zustand for React apps (85% success)
   ✓ API Pattern: RESTful with OpenAPI spec (88% success)
   ✓ Testing: Playwright for E2E (95% success)

   🎯 MODULE RECOMMENDATIONS:

   Based on similar projects, consider these modules:
   • Authentication (found in 95% of similar projects)
   • User Management (found in 90%)
   • Payment Processing (found in 80%)
   • Analytics Dashboard (found in 75%)
   • Notifications (found in 70%)

   Options:
   [A] Apply first project pattern
   [B] Apply second project pattern
   [C] Use recommended module structure
   [D] View detailed pattern analysis
   [N] Continue without applying patterns

   Choice [A/B/C/D/N]:

3. If pattern selected:
   - Pre-fill technical decisions from successful patterns
   - Apply module structure recommendations
   - Include lessons learned in analysis
   - Add pattern confidence scores to discovery.json
   - Store pattern application in mem0 for learning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Prepare Enhanced Discovery Data for Agent

**Include parent context (for module/feature targets):**
For module/feature discovery, include parent context in JSON:
```json
{
  "command": "discover",
  "target": "[target]",
  "parent_context": {
    "platform": {
      // Platform discovery data if target is module/feature
      "app_name": "[from platform discovery]",
      "purpose": "[from platform discovery]",
      "tech_stack": "[from platform discovery]",
      "users": "[from platform discovery]"
    },
    "module": {
      // Module context if target is feature
      "name": "[module name]",
      "purpose": "[from module context]",
      "capabilities": "[from module context]",
      "dependencies": "[from module context]"
    }
  },
  // rest of structure...
}
```

**Include incremental analysis history (if applicable):**
For complexitys with incremental analysis, include the progression:
```json
{
  "command": "discover",
  "complexity": "[complexity]",
  "target": "[target]",
  "incremental_analyses": [
    {
      "batch": 1,
      "patterns_detected": [...],
      "confidence_at_batch": 65,
      "clarification_added": "[if any]"
    },
    {
      "batch": 2,
      "patterns_detected": [...],
      "confidence_at_batch": 75,
      "clarification_added": "[if any]"
    }
  ],
  "clarification_history": [
    {
      "after_batch": 1,
      "issue": "[gap identified]",
      "clarification_asked": "[question]",
      "answer": "[user response]"
    }
  ],
  // rest of structure based on mode
}
```

**If in update mode:**
Include update context in JSON:
```json
{
  "command": "discover",
  "mode": "update",
  "complexity": "[complexity]",
  "target": "[target]",
  "previous_analysis": {
    "confidence_score": [previous],
    "patterns": [...],
    "gaps": [...]
  },
  "updates": {
    "type": "[what was updated]",
    "changes": [...],
    "new_answers": [...]
  },
  "update_history": [...],
  "context": {
    "description": "[if provided]",
    "from_source": "[if provided]"
  }
}
```

**For INSTANT complexity (fresh discovery):**
Create JSON with AI-explored features:
```json
{
  "command": "discover",
  "complexity": "instant",
  "target": "[target]",
  "exploration_method": "sequential_thinking",
  "discovery": {
    "initial_concept": "[user's original description]",
    "expanded_concept": "[after sequential thinking exploration]",
    "application_type": "[detected type]",
    "identified_modules": {
      "module_name": {
        "purpose": "[module purpose]",
        "features": [...],
        "functionality": "[how it works - assumptions]"
      }
    },
    "core_features": [
      {
        "name": "[feature]",
        "how_it_works": "[assumed functionality]",
        "user_flow": "[basic workflow]"
      }
    ],
    "integrations": ["only explicit mentions from user"],
    "target_users": "[identified users]",
    "success_criteria": "[assumed success metrics]"
  }
}
```

**For other complexitys (fresh discovery):**
After deep feature exploration, create comprehensive JSON:

```json
{
  "command": "discover",
  "complexity": "[complexity]",
  "target": "[target]",
  "exploration_method": "sequential_thinking_interactive",
  "discovery": {
    "initial_concept": "[starting point]",
    "expanded_concept": "[after exploration]",
    "application_type": "[identified type]",
    "identified_modules": {
      "module_name": {
        "purpose": "[module purpose]",
        "core_features": [...],
        "functionality_details": {
          "how_it_works": "[detailed from exploration]",
          "user_workflows": [...],
          "data_handled": [...],
          "options_settings": [...],
          "edge_cases": [...]
        }
      }
    },
    "core_features": [
      {
        "name": "[feature]",
        "module": "[parent module]",
        "functionality": "[detailed how it works]",
        "user_flow": "[complete workflow]",
        "data_requirements": [...],
        "enhancement_opportunities": [...]
      }
    ],
    "identified_integrations": [
      {
        "service": "[only user-confirmed]",
        "purpose": "[why they want it]",
        "features_enhanced": [...]
      }
    ],
    "user_personas": [...],
    "success_criteria": [...],
    "business_model": "[if applicable]"
  },
  "questions_answers": [
    // Original Q&A for reference
  ]
}
```

### Step 5: Activate Business-Analyst Agent

**CRITICAL: Must use business-analyst, NEVER solution-architect!**

Say to user: "🔍 Analyzing your confirmed requirements with expert business analyst..."

Activate business-analyst agent with Opus 4.1 model (NOT solution-architect):
"Analyze the user's CONFIRMED choices and requirements from their answers.

CRITICAL RULES:
- For INSTANT track: You may enhance simple assumptions
- For RAPID/STANDARD/ENTERPRISE: Base analysis ONLY on user's confirmed module choices
- DO NOT make assumptions about functionality user hasn't confirmed
- DO NOT add features or modules user didn't explicitly choose
- User has already answered how each module should work - respect their choices

Your analysis should:
- Validate feasibility of user's chosen functionality
- Identify any gaps in user's stated requirements
- Assess completeness of user's choices
- Provide success factors based on what user confirmed
- Calculate confidence score

DO NOT include:
- Technical architecture (goes to Architect phase)
- Security details (goes to Security phase)
- UI/UX specifics (goes to Design phase)
- Features user didn't confirm

Base EVERYTHING on user's confirmed answers from:
1. Initial 5 questions
2. Module-specific questions (how each module should work)

Format your response for direct user display: [User's confirmed discovery data]"

**Display comprehensive agent analysis to user:**

```
🤖 FINAL ANALYSIS (business-analyst)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Pattern Analysis:
✓ [Key pattern 1 identified by agent]
✓ [Key pattern 2 identified by agent]
✓ [Key pattern 3 identified by agent]

🎯 Recommended Approach:
[Agent's architectural and implementation recommendations]

💼 Business Value:
• [Value proposition 1]
• [Value proposition 2]
• ROI Impact: [High/Medium/Low]

⚙️ Technical Feasibility:
• Track: [Low/Medium/High]
• Required Resources: [Key resources needed]
• Key Challenges: [Main technical challenges]

⚠️ Risks & Gaps:
[Any identified risks or missing information]

✅ Success Factors:
1. [Critical success factor 1]
2. [Critical success factor 2]
3. [Critical success factor 3]

📈 Confidence Score: [X]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Note**: The agent uses Opus 4.1 for superior analysis capabilities.

### Step 5.5: Evaluate Need for Deep-Dive (Command Decision)

After receiving agent's analysis:

**Command evaluates:**
1. Check confidence score from agent
2. Review identified gaps from agent's "Identified Gaps & Risks" section
3. Assess impact ratings from gaps

**If confidence < 70% AND critical gaps exist AND not already did deep-dive:**

Command formulates follow-up questions based on gaps using the mapping table below.

Say to user: "📋 Based on the analysis, I need to clarify a few critical points to ensure comprehensive requirements..."

Present up to 3 follow-up questions (maximum 1 deep-dive round):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLARIFICATION QUESTION 1/[TOTAL]

[Command-formulated question based on gap]

Your answer:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Continue with remaining clarification questions]

After collecting follow-up answers:
- Append answers to original JSON structure as "deep_dive_answers"
- Re-activate business-analyst with enhanced data
- Proceed to Step 6 with improved analysis

### Step 6: Generate Documentation Files

**CRITICAL: Files MUST be created in ccu_workspace, NEVER in root folder!**

**Determine output path based on target:**
```bash
If target == "platform":
  output_path = {project_root}/ccu_workspace/platform/01-discovery/
If target == "module":
  output_path = {project_root}/ccu_workspace/modules/{module}/01-discovery/
If target == "feature":
  output_path = {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/

# NEVER create files in root folder!
# NEVER use custom file names!
# ALWAYS use the template-specified file names below!
```

Based on agent's analysis response, create files in the determined output_path:

Brief status: "Generating discovery documentation..."

**Template Loading:**
Load templates from `.claude/templates/discovery/`:
- `discovery-instant.template.md` for INSTANT complexity
- `discovery-standard.template.md` for STANDARD complexity
- `interfaces-registry.template.md` when UI components detected
- `authentication.template.md` when auth patterns detected
- `payment.template.md` when payment patterns detected

Fill template placeholders with agent's analysis data.

**For INSTANT complexity (3 files):**
```bash
1. Write {output_path}/discovery-instant.json    # Structured data with Q&A and analysis
2. Load and fill discovery-instant.template.md → Write {output_path}/discovery-instant.md
3. If target == "platform":
   Write {output_path}/modules-overview.md      # Auto-generated module list
```

**For RAPID complexity (3-4 files):**
```bash
1. Write {output_path}/discovery.json            # Structured data with Q&A and analysis
2. Write {output_path}/discovery-summary.md      # Executive summary with agent insights
3. If target == "platform":
   Write {output_path}/modules-overview.md      # Module identification
4. If external integrations detected:
   Write {output_path}/integration-points.md    # ONLY external integrations (not API design)
```

**For STANDARD complexity (4-5 files):**
```bash
# CRITICAL: Discovery phase ONLY creates discovery-focused files!
1. Write {output_path}/discovery.json                # Complete structured data with all insights
2. Write {output_path}/discovery-summary.md          # Executive summary
3. If target == "platform":
   Write {output_path}/modules-overview.md          # Module identification and overview
4. If external integrations detected:
   Write {output_path}/integration-points.md        # ONLY external integrations discovered (not API design)

# Conditional files based on patterns:
If auth patterns detected:
   Load and fill authentication.template.md → Write {output_path}/authentication.md
If payment patterns detected:
   Load and fill payment.template.md → Write {output_path}/payment.md

# IMPORTANT: The following files are created by OTHER phases:
# ❌ requirements-functional.md → Created by /ccu:specify
# ❌ requirements-technical.md → Created by /ccu:architect
# ❌ user-stories.md → Created by /ccu:specify
# ❌ data-model.md → Created by /ccu:architect
# ❌ risk-assessment.md → Created by /ccu:security

# Store insights in discovery.json for other phases to consume:
# - "requirements_hints" → Used by /ccu:specify for functional requirements
# - "technical_considerations" → Used by /ccu:architect for technical requirements
# - "entity_hints" → Used by /ccu:architect for data model
# - "risk_indicators" → Used by /ccu:security for risk assessment
```

**For ENTERPRISE complexity (6-8 files):**
```bash
# All STANDARD files plus:
Write {output_path}/stakeholder-map.md           # Identified stakeholders from discovery
Write {output_path}/compliance-notes.md          # Discovered compliance needs (not requirements)
If migration patterns detected:
   Write {output_path}/migration-notes.md        # Migration considerations discovered

# IMPORTANT: The following files are created by OTHER phases:
# ❌ compliance-requirements.md → Created by /ccu:security
# ❌ security-requirements.md → Created by /ccu:security
# ❌ scalability-plan.md → Created by /ccu:architect
# ❌ success-metrics.md → Created by /ccu:specify
# ❌ migration-strategy.md → Created by /ccu:architect
# ❌ training-requirements.md → Created by /ccu:plan
# ❌ support-model.md → Created by /ccu:deliver
```

### Step 6.5: Module Identification for Output (Platform Target Only)

**If target == "platform":**

Say to user: "📦 Identifying core modules for platform..."

**IMPORTANT: Do NOT create any folders - only identify modules for discovery.json**

Based on feature exploration and agent's analysis:

**Identify modules from explored features:**
- Authentication needs → auth module
- User management needs → users module
- Core business features → [domain-specific] modules
- Analytics/reporting needs → analytics module
- Admin features → admin module

**Add to discovery.json structure:**
```json
"modules": {
  "auth": {
    "purpose": "User authentication and authorization",
    "core_features": ["login", "signup", "password-reset"],
    "functionality_details": "[From feature exploration]"
  },
  "food_tracking": {
    "purpose": "Core food logging functionality",
    "core_features": ["food-search", "custom-foods", "meal-logging"],
    "functionality_details": {
      "entry_methods": ["manual", "barcode", "favorites"],
      "data_tracked": ["calories", "macros"],
      "user_flow": "Quick-add from favorites or search"
    }
  }
  // ... other identified modules
}
```

**Create platform modules overview:**
```bash
Write {project_root}/ccu_workspace/platform/01-discovery/modules-overview.md:
"""
# Platform Modules Overview

## Identified Modules ({count})

### Core Modules
{for each module in core_modules:}
- **{module}** - {purpose from agent's analysis}
  - Key Features: {list}
  - Priority: {High/Medium/Low based on criticality}
{end for}

### Supporting Modules
{for each module in supporting_modules:}
- **{module}** - {purpose}
  - Dependencies: {list}
{end for}

## Module Dependency Graph
```
{module} → {depends_on}
{module} → {depends_on}
```

## Development Priority Order
1. {module} - {reason}
2. {module} - {reason}
...

## External Source Import Workflows

### URL Import Workflow (--from=https://...)

When source is a URL:

```
📊 IMPORTING FROM URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fetching: {url}
Status: ████████████░░░░░░░░ 60% 🔄
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Use WebFetch tool to retrieve content
2. Convert HTML/PDF/DOC to markdown
3. Pass to business-analyst with prompt:
   "Extract requirements and project details from this document"
4. Generate discovery based on extracted information
5. Show confidence score for extraction
```

### File Import Workflow (--from=./file)

When source is a local file:

```
📂 IMPORTING FROM FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reading: {file_path}
Type: {detected_format}
Size: {file_size}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Read file content
2. Detect format (markdown, json, yaml, text)
3. Extract initial requirements and modules
```

**CRITICAL: File imports MUST still ask questions for non-INSTANT tracks!**

**For INSTANT track:**
```
4. Skip user questions - make assumptions
5. Activate business-analyst with file content
6. Generate discovery output automatically
```

**For RAPID/STANDARD/ENTERPRISE tracks:**
```
4. Present discovered modules for confirmation:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦 MODULES DISCOVERED FROM FILE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Based on your document, I found these modules:

   ✓ {module_name} - {description from file}
   ✓ {module_name} - {description from file}

   Would you like to:
   [A] Accept all suggested modules
   [R] Remove some modules
   [E] Add additional modules
   [M] Modify module names/descriptions
   [C] Continue with these modules

   Your choice: _
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. Ask module-specific questions (HOW each should work):
   - RAPID: 1 question per module
   - STANDARD: 2-3 questions per module
   - ENTERPRISE: 4-5 questions per module

   Example for STANDARD:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📦 MODULE CONFIGURATION: {module_name}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   1. Core Functionality:
   How should {module_name} handle its main features?
   a) Simple implementation
   b) Standard implementation
   c) Advanced implementation
   d) Custom (describe)

   2. User Workflows:
   How will users interact with {module_name}?
   a) Quick and minimal
   b) Guided process
   c) Full control
   d) Custom (describe)

   Your choices: _
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. Activate business-analyst with:
   - Original file content
   - User-confirmed modules
   - User's answers about HOW modules should work

7. Generate discovery output in CORRECT location
```

### GitHub Import Workflow (--from=github:org/repo)

When source is a GitHub repository:

```
🐙 IMPORTING FROM GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository: {org}/{repo}
Analyzing: README, package.json, docs/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Fetch README.md via GitHub API
2. Analyze package.json for tech stack
3. Check for documentation folder
4. Extract project description and features
5. Identify architecture from code structure
6. Generate discovery with GitHub context
```

### Pattern Detection for Similar Projects

When importing from any external source:

```
💡 PATTERN DETECTION (Powered by Mem0 MCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analyzing project patterns...

Similar projects found:
📦 E-commerce Platform (78% match)
   Previous stack: Next.js + Stripe + PostgreSQL
   Success confidence: 92%

📦 SaaS Dashboard (65% match)
   Previous stack: React + Supabase + Tailwind
   Success confidence: 88%

Apply similar pattern? [1/2/n]:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Code Discovery Workflow (--from=code)

### Step 1: Validate Path and Target

1. **Check --path parameter:**
   ```
   If not provided:
     Default to: ../[inferred-project-name] or current directory

   If path doesn't exist:
     ERROR: "Project path not found: {path}"
     Exit command
   ```

2. **Validate project exists:**
   ```
   Check for indicators:
   - package.json (Node.js project)
   - requirements.txt or pyproject.toml (Python)
   - go.mod (Go project)
   - Cargo.toml (Rust project)

   If no indicators found:
     WARNING: "No project files found. Attempting structure detection anyway..."
   ```

### Step 2: Activate Code Analyzer

1. **Pass to code-analyzer agent:**
   ```
   Activate: code-analyzer

   Input: {
     "path": "{project_path}",
     "target": "{target}",
     "module": "{module}" (if applicable),
     "feature": "{feature}" (if applicable)
   }
   ```

2. **Code analyzer performs:**
   - Structure detection (unified/separated/monorepo)
   - Technology stack identification
   - Module discovery and mapping
   - Pattern recognition
   - Convention extraction

### Step 2.5: Initialize Claude Context MCP

Say to user: "🔍 Indexing codebase with Claude Context for semantic search..."

1. **Initialize Claude Context MCP:**
   ```
   Claude Context MCP is configured with:
   - stdio protocol for communication
   - OpenAI API for embedding generation
   - Milvus cloud for vector storage

   The MCP server will:
   - Index your codebase into vector embeddings
   - Store embeddings in Milvus cloud database
   - Enable semantic search across your code
   ```

2. **Index the project:**
   ```
   MCP Call: claude-context.index
   Parameters: {
     path: "{project_path}",
     extensions: [".js", ".ts", ".jsx", ".tsx", ".py", ".go", ".java"],
     exclude: ["node_modules", ".git", "dist", "build", ".next", "coverage"]
   }
   ```

3. **Show indexing progress:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 SEMANTIC CODE INDEXING (Claude Context + Milvus)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Status: Creating embeddings with OpenAI
   Storage: Milvus cloud vector database
   Progress: [████████████░░░░░░░] 75% | 234/312 files
   Embeddings: 1,247 code chunks indexed
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### Step 3: Structure Detection (Enhanced with Claude Context)

1. **Semantic search for structure patterns:**
   ```
   # Find application entry points
   MCP Call: claude-context.search
   Query: "application entry point main bootstrap app initialization"

   # Detect authentication patterns
   MCP Call: claude-context.search
   Query: "authentication login jwt session middleware guard"

   # Find data layer
   MCP Call: claude-context.search
   Query: "database model schema prisma typeorm mongoose entity"

   # Locate API endpoints
   MCP Call: claude-context.search
   Query: "api route endpoint controller rest graphql handler"
   ```

2. **Analyze search results to determine structure:**
   ```
   # Vector similarity scores indicate pattern strength
   # File clustering reveals structure type

   If high concentration in src/app/ (similarity > 0.8):
     → structure: "unified" (Next.js style)
     → confidence: {score}% based on vector similarity

   If separate frontend/ and backend/ clusters:
     → structure: "separated"
     → confidence: {score}% based on clustering

   If apps/ and packages/ patterns detected:
     → structure: "monorepo"
     → confidence: {score}% based on patterns

   Else:
     → structure: "custom"
     → require manual confirmation
   ```

3. **Display enhanced detection results:**
   ```
   📊 STRUCTURE ANALYSIS (Powered by Claude Context)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Structure Type: {detected} (Confidence: {score}%)
   Entry Points: {count} found via semantic search
   API Layer: {type} detected with {confidence}% match
   Data Layer: {orm/database} identified
   Vector Matches: {total} relevant code chunks
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### Step 4: Technology Stack Discovery

```
Analyze package.json and imports:

Frontend Detection:
- Next.js: "next" in dependencies
- React: "react" in dependencies
- Vue: "vue" in dependencies
- Angular: "@angular/core" in dependencies

Backend Detection:
- Express: "express" in dependencies
- NestJS: "@nestjs/core" in dependencies
- Fastify: "fastify" in dependencies

Database Detection:
- Prisma: "@prisma/client" or prisma/schema.prisma
- TypeORM: "typeorm" in dependencies
- Mongoose: "mongoose" in dependencies

UI Library Detection:
- shadcn: components/ui directory pattern
- MUI: "@mui/material" in dependencies
- Ant Design: "antd" in dependencies
```

### Step 5: Module Discovery (Powered by Claude Context)

1. **Semantic module detection:**
   ```
   Module searches via Claude Context MCP:

   auth: "authentication login logout password reset jwt token"
   users: "user profile account settings preferences"
   payments: "payment stripe subscription billing invoice"
   dashboard: "dashboard analytics metrics charts overview"
   notifications: "notification email sms push alert"

   For each module query:
   - MCP Call: claude-context.search
   - Query: {module_search_terms}
   - Milvus returns top-k similar code chunks
   - Similarity > 0.7 indicates module exists
   ```

2. **Module boundary analysis:**
   ```
   For discovered modules:
   - Extract common file paths from results
   - Identify cross-references between files
   - Calculate cohesion scores from clustering
   - Map dependencies from imports
   ```

3. **Display module discovery results:**
   ```
   📦 MODULE DISCOVERY (Claude Context Analysis)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   ✅ auth (95% similarity) - 12 files
      Vector matches: 47 code chunks
      Primary location: src/modules/auth/
      Key patterns: JWT, sessions, OAuth

   ✅ users (88% similarity) - 8 files
      Vector matches: 31 code chunks
      Primary location: src/modules/users/
      Key patterns: profiles, settings, roles

   ✅ payments (76% similarity) - 6 files
      Vector matches: 22 code chunks
      Primary location: src/modules/payments/
      Key patterns: Stripe, subscriptions

   Module Dependencies (from semantic analysis):
   auth → users (strong coupling)
   payments → users (medium coupling)
   dashboard → [auth, users, payments] (weak coupling)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### Step 6: Generate Discovery Report

```
Create discovery-from-code.json:
{
  "discovery_method": "code",
  "discovered_at": "{timestamp}",
  "project_structure": "{detected_structure}",
  "confidence_score": {score},
  "technology_stack": {
    "frontend": "{framework}",
    "backend": "{framework}",
    "database": "{type}",
    "ui_library": "{library}"
  },
  "existing_modules": [
    {
      "name": "{module}",
      "type": "{detected_type}",
      "has_api": {boolean},
      "has_ui": {boolean},
      "files_count": {number}
    }
  ],
  "patterns_detected": {
    "auth_method": "{jwt|session|oauth}",
    "state_management": "{detected}",
    "api_style": "{rest|graphql}",
    "testing_framework": "{detected}"
  },
  "recommendations": [
    "Consider adding {missing_module}",
    "Upgrade {outdated_package}"
  ]
}
```

### Step 7: User Confirmation

```
Display discovery summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CODE DISCOVERY RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Project Structure: {structure} (confidence: {score}%)
✅ Frontend: {frontend_framework}
✅ Backend: {backend_framework}
✅ Database: {database_type}
✅ Existing Modules: {count} discovered

Modules Found:
• {module1} - API + UI components
• {module2} - Backend service only
• {module3} - Frontend feature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Is this analysis correct? [Y/n]:
```

If user confirms:
- Save discovery-from-code.json
- Update specification.json with discovered_from_code flag
- Continue to specification phase

If user rejects:
- Ask for corrections
- Allow manual override of detected values

### Step 8: Generate Discovery Documentation

Update TodoWrite: "Generate discovery files" → in_progress

Say to user: "📝 Creating discovery documentation..."

**Determine output path based on target:**
```bash
If target == "platform":
  output_path = {project_root}/ccu_workspace/platform/01-discovery/
If target == "module":
  output_path = {project_root}/ccu_workspace/modules/{module}/01-discovery/
If target == "feature":
  output_path = {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/
```

**Extract from business-analyst's response:**
- Executive summary
- Key patterns detected
- Confidence score
- Strategic recommendations
- Identified gaps and risks

**Load templates from ccu_framework/templates/discovery/**
- discovery-summary.md template
- patterns.md template (if patterns detected)
- recommendations.md template

**Fill templates with agent's analysis data:**
- Replace {{summary}} with agent's executive summary
- Replace {{patterns}} with detected patterns
- Replace {{confidence}} with confidence score
- Replace {{recommendations}} with strategic recommendations

Create unified discovery files:
- `{output_path}/discovery.json` - Structured data from agent's JSON response
- `{output_path}/discovery-summary.md` - Filled template with agent's insights
- `{output_path}/patterns.md` - Pattern analysis from agent (if patterns detected)
- `{output_path}/recommendations.md` - Agent's strategic recommendations
- Additional MD files based on track complexity

Update TodoWrite: "Generate discovery files" → completed

Mark all files with header:
```
# Discovery From Existing Code
Generated: {timestamp}
Source: {project_path}
Confidence: {score}%
```

## Next Steps
Each module has been initialized with discovery context.
Proceed to specification for detailed technical planning.
"""
```

Display to user:
```
📦 Module Structure Created:
- {module1}
- {module2}
- {module3}
- {module4}

Each module initialized with:
- module-context.md (discovery analysis)
```

### Step 6.5: Store Discovery Patterns

**Save successful discovery pattern to Mem0 for future reference:**

```
Say to user: "💾 Saving discovery patterns for future reference..."

# Calculate confidence score from agent's analysis
confidence_score = agent_response.confidence || 80

# Store the main discovery pattern
mcp__mem0__add_memory(
  text: "PATTERN:DISCOVERY:${ARGUMENTS.target} - Track: ${ARGUMENTS.track}, " +
        "Type: ${application_type}, Features: ${core_features.join(', ')}, " +
        "Confidence: ${confidence_score}%, Modules: ${identified_modules.join(', ')}, " +
        "Project: ${project_name || 'unnamed'}",
  metadata: {
    "project": project_name,
    "target": ARGUMENTS.target,
    "track": ARGUMENTS.track,
    "timestamp": new Date().toISOString(),
    "confidence": confidence_score,
    "file_path": "${output_path}/discovery-${track}.json"
  }
)

# Store module-specific patterns if platform target
If target == "platform" AND identified_modules.length > 0:
  For each module in identified_modules:
    mcp__mem0__add_memory(
      text: "PATTERN:MODULE:${module.type} - Name: ${module.name}, " +
            "Features: ${module.features.join(', ')}, Project: ${project_name}, " +
            "Dependencies: ${module.dependencies.join(', ')}"
    )

# Store technology stack pattern if identified
If technology_stack:
  mcp__mem0__add_memory(
    text: "PATTERN:TECH:${project_type} - Frontend: ${tech_stack.frontend}, " +
          "Backend: ${tech_stack.backend}, Database: ${tech_stack.database}, " +
          "UI: ${tech_stack.ui_library}, Confidence: ${confidence_score}%"
  )

Say to user: "✅ Discovery pattern saved for future projects"
```

### Step 6.6: Index Discovery Documentation

**Index generated files for searchability with Claude-Context:**

```
Say to user: "🔍 Indexing discovery documentation..."

# Determine path based on target
index_path = ""
If target == "platform":
  index_path = "${project_root}/ccu_workspace/platform/01-discovery/"
Else if target == "module":
  index_path = "${project_root}/ccu_workspace/modules/${module}/01-discovery/"
Else if target == "feature":
  index_path = "${project_root}/ccu_workspace/modules/${module}/features/${feature}/01-discovery/"

# Index the discovery files
mcp__claude-context__index_codebase(
  path: index_path,
  customExtensions: [".md", ".json"],
  splitter: "langchain",
  ignorePatterns: ["*.tmp", "*.bak"]
)

Say to user: "✅ Discovery files indexed for search"

# Display indexing summary
Display:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 DISCOVERY DOCUMENTATION INDEXED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Location: ${index_path}
Files Indexed: ${files_created.length} files
Search Ready: ✅ Yes
Pattern Storage: ✅ Saved to Mem0

The discovery documentation is now searchable for:
- Future specification phase
- Cross-reference during development
- Pattern matching in similar projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Present Results

**For update mode:**
```
✅ Discovery Successfully Updated!

📊 Updated Analysis:
[Include agent's new executive summary]

🔄 Changes Applied:
- [List key changes made]

📈 Confidence Improvement: [old]% → [new]%

📁 Documentation Updated: [count] files in:
   Platform: {project_root}/ccu_workspace/platform/01-discovery/ (if platform)
   Module: {project_root}/ccu_workspace/modules/{module}/01-discovery/ (if module)
   Feature: {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/ (if feature)
   Version: [update count]
```

**For fresh discovery:**
```
✅ Discovery Complete!

📊 Analysis Insights:
[Include agent's executive summary here]

📁 Documentation Created: [count] files in:
   Platform: {project_root}/ccu_workspace/platform/01-discovery/ (if platform)
   Module: {project_root}/ccu_workspace/modules/{module}/01-discovery/ (if module)
   Feature: {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/ (if feature)
📦 Modules Initialized: [count] modules in {project_root}/ccu_workspace/modules/ (if platform target)
🎯 Confidence Score: [agent's confidence score]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 8: Automatic Module Discovery (Platform Target Only)

**If target == "platform" and modules were identified:**

```
📦 MODULE DISCOVERY (One-Level-Down)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform discovery complete. Now discovering modules...

Identified [count] modules:
1. authentication - User auth and permissions
2. payments - Payment processing
3. analytics - Data and reporting
4. notifications - Alerts and messaging

Generating module discoveries with same track: {track}
```

**Show progress:**
```
📦 MODULE DISCOVERY PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:       ████████████████████ ✅ Complete
Modules: [2/4]  ██████████░░░░░░░░░░ 50% 🔄
├─ auth:        ████████████████████ ✅ Complete
├─ payments:    ████████░░░░░░░░░░░░ 🔄 In Progress
├─ analytics:   ░░░░░░░░░░░░░░░░░░░░ ⏳ Pending
└─ notify:      ░░░░░░░░░░░░░░░░░░░░ ⏳ Pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Execute module discoveries automatically:**
```
If target == "platform":
  For each module in discovered_modules:
    Execute module discovery with same track as platform
    Save to: {project_root}/ccu_workspace/modules/{module.name}/01-discovery/

  Say to user: "✅ Discovered platform + {count} modules"
  Say to user: "📝 Note: Features will be discovered when you run module-level discovery"
```

**If target == "module" and features were identified:**

```
🔧 FEATURE DISCOVERY (One-Level-Down)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Module discovery complete. Now discovering features...

Identified [count] features for {module}:
1. login - User login flow
2. register - New user registration
3. password-reset - Password recovery
4. two-factor - 2FA setup

Generating feature discoveries with same track: {track}
```

**Execute feature discoveries automatically:**
```
If target == "module":
  For each feature in module.features:
    Execute feature discovery with same track as module
    Save to: {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/

  Say to user: "✅ Discovered module + {count} features"
```

### Step 9: Store Discovery in Memory with Mem0 MCP

**Store all discovery patterns and insights for future reuse:**

```
Say to user: "💾 Storing discovery patterns for future projects..."

# Store overall project discovery with PATTERN prefix
mcp__mem0__add_memory(
  text: "PATTERN:DISCOVERY:PROJECT - Name: {project_name}, " +
        "Type: {project_type}, Industry: {industry}, " +
        "Scale: {scale}, TargetUsers: {target_users}, " +
        "CoreFeatures: {core_features}, " +
        "TechStack: {recommended_stack}, " +
        "Architecture: {architecture_pattern}, " +
        "Modules: {module_list}, " +
        "Track: {track}, Confidence: {confidence_score}%"
)

# Store technology decisions with PATTERN prefix
mcp__mem0__add_memory(
  text: "PATTERN:TECH:STACK - ProjectType: {project_type}, " +
        "Frontend: {frontend_framework}, Backend: {backend_framework}, " +
        "Database: {database_choice}, UI: {ui_library}, " +
        "Deployment: {deployment_platform}, " +
        "Reasoning: {tech_stack_reasoning}"
)

# Store specific patterns discovered with PATTERN prefix
For each key_pattern in discovered_patterns:
  mcp__mem0__add_memory(
    text: "PATTERN:SOLUTION:{pattern_type} - ProjectType: {project_type}, " +
          "Solution: {recommended_solution}, " +
          "Considerations: {key_considerations}, " +
          "Risks: {identified_risks}"
  )

# Store successful Q&A patterns (if not INSTANT track) with PATTERN prefix
If track != "instant":
  mcp__mem0__add_memory(
    text: "PATTERN:QA:DISCOVERY - ProjectType: {project_type}, Track: {track}, " +
          "EffectiveQuestions: {high_value_questions}, " +
          "KeyInsights: {critical_answers}, " +
          "GapsIdentified: {gaps_found}, " +
          "FollowUpsNeeded: {deep_dive_areas}"
  )

# Store module-specific discoveries (if platform target) with PATTERN prefix
If target == "platform":
  For each module in discovered_modules:
    mcp__mem0__add_memory(
      text: "PATTERN:MODULE:{module.type_classification} - Name: {module.name}, ProjectType: {project_type}, " +
            "Features: {module.core_features}, " +
            "Dependencies: {module.dependencies}, " +
            "APIEndpoints: {module.api_count}, " +
            "UIComponents: {module.ui_components}, " +
            "TestStrategy: {module.test_requirements}, " +
            "BusinessRules: basic"
    )

# Store industry-specific requirements with PATTERN prefix
If industry_specific_requirements:
  mcp__mem0__add_memory(
    text: "PATTERN:INDUSTRY:{industry} - ProjectType: {project_type}, " +
          "Compliance: {compliance_needs}, " +
          "Security: {security_requirements}, " +
          "Regulations: {regulatory_requirements}, " +
          "BestPractices: {industry_best_practices}, " +
          "specifications: basic"
  )

# Store integration patterns with PATTERN prefix
If external_integrations:
  mcp__mem0__add_memory(
    text: "PATTERN:INTEGRATION:{project_type} - " +
          "ExternalServices: {integration_list}, " +
          "APIPatterns: {api_patterns}, " +
          "AuthMethods: {auth_integrations}, " +
          "PaymentSystems: {payment_integrations}"
  )

# Store user type patterns with PATTERN prefix
mcp__mem0__add_memory(
  text: "PATTERN:USERS:{project_type} - " +
        "UserTypes: {user_types}, " +
        "Roles: {role_hierarchy}, " +
        "Permissions: {permission_model}, " +
        "ExpectedScale: {user_scale}"
)

Say to user: "✅ Discovery patterns stored successfully"

# Display memory storage summary
Display:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 DISCOVERY MEMORY STORED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Project Profile: {project_name} ({project_type})
✅ Patterns Stored: {pattern_count} patterns
✅ Modules Documented: {module_count} modules
✅ Tech Stack Saved: {tech_stack_summary}
✅ Q&A Insights: {qa_pattern_count} patterns

This knowledge will improve future discoveries for similar projects.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT PHASE:

**Phase 2: Specification** ⭐ REQUIRED
/ccu:specify --target=[target] --track=[complexity] --from=discovery
→ Transform discovery insights into detailed product requirements

📋 Alternative Options:
- Review generated files:
  Platform: {project_root}/ccu_workspace/platform/01-discovery/ (if platform)
  Module: {project_root}/ccu_workspace/modules/{module}/01-discovery/ (if module)
  Feature: {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/ (if feature)
- Refine discovery: /ccu:discover --target=[target] --track=[complexity] --update

⚠️ Note: Direct build without specification is NOT recommended.
   Proper specification ensures alignment and reduces development risks.
   Use --skip-spec flag only if you have existing specifications.
```

## Deep-Dive Question Mapping

When agent identifies gaps, command uses this mapping to formulate follow-up questions:

| Gap Pattern | Follow-up Question |
|------------|-------------------|
| Authentication unclear/missing | "What authentication methods do you need? (email/password, SSO, social login, multi-factor, etc.)" |
| Scale/volume undefined | "Expected number of users and data volume? (10s, 100s, 1000s, millions)" |
| Integration requirements vague | "Which specific external systems/APIs need integration? Please list them." |
| Payment processing undefined | "Payment processing needs? (none, one-time payments, subscriptions, marketplace/split payments)" |
| Multi-tenancy unclear | "Single organization or multi-tenant? If multi-tenant, how many organizations expected?" |
| Performance requirements missing | "Expected concurrent users and response time requirements? (e.g., 100 concurrent, <2s response)" |
| Deployment environment unclear | "Deployment preference? (localhost only, cloud provider, on-premise, hybrid)" |
| Data persistence unclear | "Data storage needs? (temporary/session only, persistent database, file storage)" |
| User roles undefined | "User types and permission levels needed? (e.g., admin, user, guest)" |
| Compliance requirements missing | "Any regulatory compliance needed? (GDPR, HIPAA, PCI-DSS, SOC2, none)" |

## File Generation Templates

When creating files in Step 6, use these templates based on agent's analysis:

### discovery.json (Enhanced Feature-Focused Structure)
```json
{
  "meta": {
    "version": "2.0",
    "framework": "CCU 2.0",
    "phase": "discovery",
    "timestamp": "[ISO timestamp]",
    "track": "[track]",
    "target": "[target]",
    "exploration_method": "sequential_thinking",
    "scope": {
      "platform": "[name if applicable]",
      "module": "[name if applicable]",
      "feature": "[name if applicable]"
    }
  },
  "discovery": {
    "initial_concept": "[what user started with]",
    "expanded_concept": "[after creative exploration]",
    "application_type": "[web_app|mobile|api|script|microservices|etc]",

    "identified_modules": {
      "module_name": {
        "purpose": "[core responsibility]",
        "core_features": ["list of features"],
        "functionality_details": {
          "how_it_works": "[detailed exploration]",
          "user_workflows": ["step by step flows"],
          "data_handled": ["what data this module manages"],
          "settings_options": ["configurability"],
          "edge_cases": ["special scenarios"]
        },
        "dependencies": ["other modules it needs"]
      }
    },

    "core_features": [
      {
        "name": "[feature name]",
        "module": "[parent module]",
        "functionality": "[how it works in detail]",
        "user_flow": "[complete workflow]",
        "data_requirements": ["what data needed"],
        "success_metrics": "[how to measure success]"
      }
    ],

    "identified_integrations": [
      {
        "service": "[only user-confirmed services]",
        "purpose": "[why user wants it]",
        "features_enhanced": ["which features benefit"]
      }
    ],

    "user_personas": [
      {
        "type": "[persona name]",
        "needs": ["what they need"],
        "workflows": ["how they'll use it"]
      }
    ],

    "business_model": "[if applicable - freemium, subscription, etc]",

    "success_criteria": [
      "[specific measurable criteria]",
      "[user satisfaction metrics]",
      "[business goals]"
    ],

    "technical_requirements": [
      "[high-level only - no architecture]",
      "[performance needs]",
      "[scale expectations]"
    ]
  },
  "analysis": {
    "feasibility_assessment": "[from agent]",
    "completeness_score": "[from agent]",
    "gaps_identified": "[functionality gaps]",
    "similar_patterns": "[from Mem0]",
    "recommendations": "[from agent]"
  },
  "mcp_context": {
    "mem0_session_id": "[session_id if available]",
    "patterns_found": "[number of similar patterns from Mem0]",
    "context7_libraries": ["list of detected libraries from Context7"],
    "sequential_thoughts": "[number of sequential thinking steps]",
    "claude_context_indexed": "[true if files were indexed]",
    "similar_projects": [
      {
        "type": "[project type]",
        "confidence": "[similarity score]",
        "key_patterns": ["patterns from similar project"]
      }
    ]
  },
  "outputs": {
    "files_generated": ["list of files created"],
    "next_phase": {
      "command": "/ccu:specify",
      "parameters": "--target=[target] --track=[track] --from=discovery",
      "confidence_threshold_met": "[true if confidence >= 80%]"
    }
  },
  "confidence": {
    "overall": "[from agent]",
    "by_module": {
      "module_name": "[confidence %]"
    }
  }
}
```

### discovery-summary.md
```markdown
# Discovery Summary - [Target] [Track]

## Application Vision
**Initial Concept:** [What user started with]
**Expanded Vision:** [After exploration]
**Application Type:** [Identified type]

## Core Modules Identified
[For each module:]
### [Module Name]
- **Purpose:** [Core responsibility]
- **Key Features:** [List]
- **How It Works:** [Functionality details]
- **User Flow:** [Primary workflows]

## Feature Deep Dive
[For each major feature:]
### [Feature Name]
- **Functionality:** [Detailed how it works]
- **User Interaction:** [Step-by-step]
- **Data Handled:** [What information]
- **Edge Cases:** [Special scenarios]
- **Success Metrics:** [How to measure]

## Confirmed Integrations
[Only user-confirmed services:]
- **[Service Name]:** [Purpose and features enhanced]

## User Personas
[Identified user types and their needs]

## Success Criteria
[What defines project success]

## Next Step
Run: `/ccu:specify --target=[target] --track=[track] --from=discovery`
- The technical product manager will create formal specifications from this discovery
```

## Important Notes

**This command handles:**
- User interaction and question presentation
- Answer collection and validation
- Agent activation for strategic analysis
- File generation based on agent insights
- Workflow orchestration and next step guidance

**The agent provides:**
- Strategic insights and pattern recognition
- Risk assessment and gap analysis
- Technology recommendations
- Confidence scoring
- Business intelligence

**Anti-Duplication:**
- Questions defined ONLY in discovery-questions.yaml
- Agent provides insights, command creates files
- Clear separation of concerns

---

**Command Version**: 3.0-Orchestrator
**Framework**: Claude Code Ultimate 2.0
**Architecture**: Command orchestrates, Agent analyzes