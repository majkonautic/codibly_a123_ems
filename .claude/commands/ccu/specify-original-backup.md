---
description: Phase 2 - Define product requirements and specifications
activates: technical-product-manager
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=discovery]
---

# Specification Command - Phase 2: Product Requirements

This is **Phase 2** of the 7-phase designment process. The specification phase transforms discovery insights into detailed product requirements, defining WHAT needs to be built (not HOW).

Generate comprehensive product specifications for **$ARGUMENTS.target** at **$ARGUMENTS.track** level.

## Command Syntax

```bash
/ccu:specify --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=discovery]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Specification scope
- `--track=instant|rapid|standard|enterprise` - Development track for complexity management
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=discovery` - Load insights from discovery phase
- `--no-discovery` - Bypass discovery requirement (manual mode)

## Generation Behavior (One-Level-Down)

This command follows the **one-level-down** rule for automatic generation:

| Target | Generates | Example |
|--------|-----------|---------|
| platform | Platform + all modules | Platform spec + 5 module specs |
| module | Module + its features | Auth module spec + 4 auth feature specs |
| feature | Feature only | Login feature spec only |

**Important:**
- Platform specification automatically generates all module specifications (but NOT features)
- Module specification automatically generates all its feature specifications
- Feature specification is a leaf level (no children)
- All child specifications use the same track as the parent

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking**
   - When: After collecting initial answers to identify gaps
   - Purpose: Refine and improve specification questions
   - Usage:
   ```
   mcp__sequential-thinking__sequentialthinking(
     thought: "Analyzing user's specification answers for gaps...",
     nextThoughtNeeded: true,
     thoughtNumber: 1,
     totalThoughts: 3
   )
   ```
   - Track specifics: RAPID (1-2 refinements), STANDARD (3-5), ENTERPRISE (5-10)

2. **Tool: mcp__mem0__search_memory**
   - When: At start to find similar specifications
   - Purpose: Reuse successful patterns from past projects
   - Usage:
   ```
   mcp__mem0__search_memory(
     query: "specification for [project type] with [tech stack]"
   )
   ```

3. **Tool: mcp__mem0__add_memory**
   - When: After successful specification completion
   - Purpose: Store patterns for future reuse
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "Successful specification: [target] using [architecture] with [decisions]"
   )
   ```


### MCP Usage by Track

**INSTANT Track:**
- Skip MCP for maximum speed
- Use only if critical pattern found in Mem0

**RAPID Track:**
- mcp__mem0__search_memory at start (find patterns)
- mcp__sequential-thinking__sequentialthinking (1-2 refinements)
- mcp__mem0__add_memory at end (store success)

**STANDARD Track:**
- All RAPID tools plus:
- mcp__sequential-thinking__sequentialthinking (3-5 refinements)
- Enhanced pattern analysis with mcp__mem0__search_memory

**ENTERPRISE Track:**
- All STANDARD tools plus:
- mcp__sequential-thinking__sequentialthinking (5-10 refinements)
- Deep pattern analysis with mcp__mem0__search_memory
- Multiple pattern searches for compliance and governance

## Step -1: Determine Project Root Directory

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

## Step 0: Pattern Recognition with Mem0 MCP (Active for RAPID/STANDARD/ENTERPRISE)

**Query for similar specifications using multiple strategies:**
```
# NOTE: Searches use PATTERN: prefix for new patterns and fallback to old format
# Discovery saves with PATTERN:MODULE, PATTERN:INDUSTRY, PATTERN:DISCOVERY prefixes

# Primary search - look for patterns saved by discovery
specification_patterns = mcp__mem0__search_memory(
  query: "PATTERN:DISCOVERY:PROJECT"
)

# If no results, fallback to broader search
If specification_patterns.results.length == 0:
  # Build query string based on available data
  query_string = "specification " + ARGUMENTS.target
  If discovery_data exists and discovery_data.project_type:
    query_string = query_string + " " + discovery_data.project_type
  Else:
    query_string = query_string + " web application"

  specification_patterns = mcp__mem0__search_memory(
    query: query_string
  )
```

**If matches found (similarity > 70%), display:**
```
💡 PATTERN DETECTION (Powered by Mem0 MCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Similar specifications found:

📦 E-Commerce Platform (85% match)
   Previous: "Multi-vendor marketplace with payments"
   Tech Stack: Next.js, PostgreSQL, Stripe
   Success: High (delivered on time)

📦 SaaS Dashboard (72% match)
   Previous: "Analytics platform with subscriptions"
   Tech Stack: React, MongoDB, Auth0
   Success: Medium (minor delays)

Options:
[A] Apply best matching pattern
[S] Select specific pattern
[N] Continue without pattern

Choice [A/S/N]: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Pre-execution Validation

1. **Discovery-First Default Behavior:**
   - **DEFAULT: Discovery is EXPECTED for all tracks except INSTANT**
   - **No --from parameter needed - discovery is implicit default**
   - Discovery files checked automatically:
     - Platform: `{project_root}/ccu_workspace/platform/01-discovery/discovery-$ARGUMENTS.track.json`
     - Module: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/01-discovery/discovery-$ARGUMENTS.track.json`
     - Feature: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/01-discovery/discovery-$ARGUMENTS.track.json`
   - **Track behaviors:**
     - INSTANT: Proceeds without discovery (auto-detection)
     - RAPID/STANDARD/ENTERPRISE: Requires discovery or explicit `--no-discovery` flag
   - **Override with `--no-discovery`:**
     - Explicitly bypass discovery requirement
     - Enter manual mode (must specify all modules/features)
     - Shows warning about reduced intelligence

2. **Validate target scope:**
   - For `--target=module`: Require `--module=<name>` parameter
   - For `--target=feature`: Require both `--module=<name>` and `--feature=<name>` parameters

3. **Set working paths based on target:**
   - Platform: `{project_root}/ccu_workspace/platform/`
   - Module: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/`
   - Feature: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/`

## Track-Based Specification Process

### Step 0.5: Display Specification Context

**For all targets and tracks:**

1. **Display rich context header:**
   ```
   ╔═══════════════════════════════════════════════════════════════════════╗
   ║  📋 SPECIFICATION CONTEXT ─ $ARGUMENTS.track TRACK                       ║
   ╚═══════════════════════════════════════════════════════════════════════╝

   🎯 You're specifying: Module: auth
   ⚡ Development track: RAPID

   This specification will define:
   ✓ User stories and acceptance criteria
   ✓ Business rules and constraints
   ✓ Functional requirements (what system does)
   ✓ Success metrics and KPIs
   ✓ Data requirements (what data, not how)

   Your decisions will be analyzed by specialized agents:
   ✓ Product Manager ─ Requirements and features
   ✓ System Architect ─ Technical feasibility

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### Step 0: Load Discovery Data (Automatic by Default)

**Discovery-First Default - Automatic loading unless bypassed:**

1. **Determine discovery file path based on target:**
   ```
   # Set discovery file path based on target and track
   If target == "platform":
     discovery_path = {project_root}/ccu_workspace/platform/01-discovery/discovery-{track}.json
   If target == "module":
     discovery_path = {project_root}/ccu_workspace/modules/{module}/01-discovery/discovery-{track}.json
   If target == "feature":
     discovery_path = {project_root}/ccu_workspace/modules/{module}/features/{feature}/01-discovery/discovery-{track}.json

   # Check if user wants to bypass discovery
   If --no-discovery PROVIDED:
     Say to user: "⚠️ Manual mode: Proceeding without discovery data"
     DISCOVERED_MODULES = []
     DISCOVERED_FEATURES = []
     DISCOVERED_WORKFLOWS = []
     Skip to Step 1

   # DEFAULT: Try to load discovery (unless INSTANT track)
   If track != "instant":
     # User explicitly wants to use discovery data
     If exists(discovery_path):
       discovery_data = Load discovery-{track}.json
       # Continue to display discovered modules (see below)
     Else:
       # User asked for discovery but file doesn't exist
       Say to user: ""
       Say to user: "╔═════════════════════════════════════════════════════════════════════════════╗"
       Say to user: "║  ❌ ERROR: Discovery File Not Found                                        ║"
       Say to user: "╚═════════════════════════════════════════════════════════════════════════════╝"
       Say to user: ""
       Say to user: "You specified --from=discovery but discovery file not found:"
       Say to user: "{discovery_path}"
       Say to user: ""
       Say to user: "🔄 Please run first:"
       Say to user: "👉 /ccu:discover --target={target} --track={track}"
       Say to user: ""
       Say to user: "Then run:"
       Say to user: "👉 /ccu:specify --target={target} --track={track} --from=discovery"
       Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
       EXIT COMMAND  # Stop execution - discovery file required

   # Discovery file doesn't exist (and not bypassed)
   Else:
     If track == "instant":
       # INSTANT can proceed without discovery
       Say to user: "🚀 INSTANT MODE: Proceeding with auto-detection (no discovery needed)"
       DISCOVERED_MODULES = []  # Will be auto-detected
       DISCOVERED_FEATURES = []
       DISCOVERED_WORKFLOWS = []
       DISCOVERED_HOW_IT_WORKS = {}

     Else:  # RAPID, STANDARD, or ENTERPRISE
       # Discovery required but not found
       Say to user: ""
       Say to user: "╔═════════════════════════════════════════════════════════════════════════════╗"
       Say to user: "║  ❌ Discovery Required for {track.upper()} Track                           ║"
       Say to user: "╚═════════════════════════════════════════════════════════════════════════════╝"
       Say to user: ""
       Say to user: "Discovery file not found: {discovery_path}"
       Say to user: ""
       Say to user: "Option 1: Run discovery first (RECOMMENDED):"
       Say to user: "👉 /ccu:discover --target={target} --track={track}"
       Say to user: ""
       Say to user: "Option 2: Proceed without discovery (manual mode):"
       Say to user: "👉 /ccu:specify --target={target} --track={track} --no-discovery"
       Say to user: ""
       Say to user: "Recommended flow:"
       Say to user: "1️⃣ /ccu:discover --target={target} --track={track}"
       Say to user: "2️⃣ /ccu:specify --target={target} --track={track} --from=discovery"
       Say to user: ""
       Ask user: "Continue without discovery? [y/N]: "

       If user responds "N" or no response:
         Say to user: "Exiting. Please run discovery first."
         EXIT COMMAND

       If user responds "Y":
         Say to user: "Continuing in manual mode (you'll need to specify modules)..."
         DISCOVERED_MODULES = []  # Empty - will need manual input
         DISCOVERED_FEATURES = []
         DISCOVERED_WORKFLOWS = []
         DISCOVERED_HOW_IT_WORKS = {}

   # If we have discovery data (from --from=discovery), display it
   If discovery_data exists:

     Say to user: ""
     Say to user: "╔═══════════════════════════════════════════════════════════════════════════╗"
     Say to user: "║  📋 BUILDING ON DISCOVERY DATA ({track.upper()} TRACK)                         ║"
     Say to user: "╚═══════════════════════════════════════════════════════════════════════════╝"
     Say to user: ""
     Say to user: "🎯 Application: {discovery_data.discovery.expanded_concept}"
     Say to user: "📱 Type: {discovery_data.discovery.application_type}"
     Say to user: ""
     Say to user: "📦 DISCOVERED MODULES & HOW THEY WORK:"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     For each module in discovery_data.discovery.identified_modules:
       Say to user: ""
       Say to user: "▸ {module.name.upper()}"
       Say to user: "  Purpose: {module.purpose}"
       Say to user: "  How it works: {module.functionality_details.how_it_works}"
       Say to user: "  Features: {', '.join(module.core_features)}"
       If module.functionality_details.user_workflows:
         Say to user: "  User flow: {first workflow summary}"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""

     # Module confirmation dialog
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "✅ MODULE CONFIRMATION"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""
     Say to user: "Found {len(discovery_data.discovery.identified_modules)} modules from discovery."
     Say to user: ""
     Ask user: "Do these modules look correct? [Y/n/edit]: "

     If user responds "edit" or "e":
       Say to user: "Which module would you like to modify? (enter name): "
       module_to_edit = user input
       For module in DISCOVERED_MODULES:
         If module.name == module_to_edit:
           Say to user: "Current purpose: {module.purpose}"
           Ask: "New purpose (or Enter to keep): "
           If user provides input:
             module.purpose = user input
           Say to user: "Current description: {module.functionality_details.how_it_works}"
           Ask: "New description (or Enter to keep): "
           If user provides input:
             module.functionality_details.how_it_works = user input
           Say to user: "✅ Module updated"

     If user responds "n":
       Say to user: "Would you like to:"
       Say to user: "  [1] Add a module"
       Say to user: "  [2] Remove a module"
       Say to user: "  [3] Start over with manual input"
       Ask: "Your choice: "

       If choice == "1":
         Ask: "Module name: "
         Ask: "Module purpose: "
         Ask: "How it works: "
         Add new module to DISCOVERED_MODULES

       If choice == "2":
         Ask: "Which module to remove?: "
         Remove module from DISCOVERED_MODULES

       If choice == "3":
         DISCOVERED_MODULES = []
         Ask for manual module input

     # Default "Y" or Enter continues with discovered modules
     Say to user: ""
     Say to user: "✅ Now I'll ask for BUSINESS RULES and CONSTRAINTS for each module."
     Say to user: "💡 I'll provide smart defaults - just press Enter to accept or type new value."
     Say to user: ""

     # Store discovered data for use throughout specification
     DISCOVERED_MODULES = discovery_data.discovery.identified_modules
     DISCOVERED_FEATURES = discovery_data.discovery.core_features
     DISCOVERED_WORKFLOWS = discovery_data.discovery.user_workflows
     DISCOVERED_HOW_IT_WORKS = {module.name: module.functionality_details.how_it_works}
   # After this point, all tracks (except INSTANT without discovery) have discovery data loaded
   ```

### Step 0.1: Analyze Discovery with Sequential Thinking (NEW)

**Use Sequential Thinking to analyze discovery and generate contextual questions:**

```
If discovery_data exists && track != "instant":
  Say to user: "🧠 Analyzing discovery data to generate intelligent questions..."

  # Load module business rules patterns
  Load module_rules = ccu_framework/templates/specification/module-business-rules.yaml

  # Use Sequential Thinking to analyze discovered modules
  mcp__sequential-thinking__sequentialthinking(
    thought: "Analyzing discovered modules: ${discovery_data.modules.map(m => m.name)}.
             Module types detected: ${discovery_data.modules.map(m => detect_module_type(m.name))}.
             User workflows: ${discovery_data.workflows.length} found.
             Determining which business rules are critical for each module type...",
    nextThoughtNeeded: true,
    thoughtNumber: 1,
    totalThoughts: 3
  )

  # Second thought: Generate contextual questions
  mcp__sequential-thinking__sequentialthinking(
    thought: "Based on module types, generating contextual questions.
             User module needs: data validation, workflow rules, notifications.
             Payment module needs: transaction limits, refund policy.
             File module needs: size limits, retention, processing.
             Creating question set tailored to discovered modules...",
    nextThoughtNeeded: true,
    thoughtNumber: 2,
    totalThoughts: 3
  )

  # Third thought: Transform workflows to stories
  mcp__sequential-thinking__sequentialthinking(
    thought: "Transforming discovered workflows into user stories.
             Found ${discovery_data.workflows.length} workflows.
             Each workflow becomes a user story with acceptance criteria.
             Mapping how_it_works to business rules...",
    nextThoughtNeeded: false,
    thoughtNumber: 3,
    totalThoughts: 3
  )

  # Store analysis results
  CONTEXTUAL_QUESTIONS = generated_questions
  AUTO_GENERATED_STORIES = workflow_stories
  MODULE_SPECIFIC_RULES = module_rules_map

  Say to user: "✅ Analysis complete. Generated ${CONTEXTUAL_QUESTIONS.length} contextual questions."
```

### Step 0.2: Search Mem0 for Pattern Matches (Enhanced)

```
If track != "instant":
  Say to user: "🔍 Searching for similar specification patterns..."

  # Build intelligent search query based on discovery
  search_query = build_pattern_query(discovery_data)

  # Search for module-specific patterns with fallback strategy
  For each module in discovery_data.modules:
    module_type = detect_module_type(module.name)

    # Primary search with PATTERN prefix
    query_string = "PATTERN:MODULE:" + module_type + " business rules"
    patterns = mcp__mem0__search_memory(
      query: query_string
    )

    # Fallback 1: Search without PATTERN prefix (for older stored patterns)
    If patterns.results.length == 0:
      query_string = "Module " + module.name + " " + module_type + " configuration"
      patterns = mcp__mem0__search_memory(
        query: query_string
      )

    # Fallback 2: Broader module type search
    If patterns.results.length == 0:
      query_string = module_type + " module"
      patterns = mcp__mem0__search_memory(
        query: query_string
      )

    If patterns.results.length > 0:
      Apply pattern defaults to module
      Skip questions covered by pattern

  # Search for industry patterns with fallback
  # Build industry pattern query
  industry_query = "PATTERN:INDUSTRY:"
  If discovery_data && discovery_data.business_model:
    industry_query = industry_query + discovery_data.business_model + " specifications"
  Else:
    industry_query = "PATTERN:INDUSTRY:general specifications"

  industry_patterns = mcp__mem0__search_memory(
    query: industry_query
  )

  # Fallback: Search for project type patterns
  If industry_patterns.results.length == 0:
    industry_patterns = mcp__mem0__search_memory(
      query: "PATTERN:DISCOVERY:PROJECT"
    )

  # Fallback 2: Broader discovery search
  If industry_patterns.results.length == 0:
    # Build discovery query from available data
    discovery_query = "Discovery"
    If discovery_data && discovery_data.app_type:
      discovery_query = discovery_query + " " + discovery_data.app_type
    If discovery_data && discovery_data.business_model:
      discovery_query = discovery_query + " " + discovery_data.business_model

    industry_patterns = mcp__mem0__search_memory(
      query: discovery_query
    )

  If industry_patterns.results.length > 0:
    Apply industry best practices
    Pre-fill success metrics

  Say to user: "💡 Applied ${patterns_applied} patterns from previous projects"
```

### Step 0.5: Load Parent Context (for module/feature targets)

**If target == "module":**

1. **Load platform specification context:**
   ```
   Read {project_root}/ccu_workspace/platform/02-specification/specification.json
   ```

   If platform specification doesn't exist:
   Say to user: "❌ Platform specification required first. Please run: /ccu:specify --target=platform --track=[track]"
   Exit command.

2. **Display platform context:**

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 **PLATFORM CONTEXT (Inherited)**
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   **Architecture**: [pattern from platform spec]
   **Database**: [technology from platform spec]
   **API Style**: [REST/GraphQL from platform spec]
   **Authentication**: [method from platform spec]
   **Caching**: [strategy from platform spec]

   **Specifying Module**: {module}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**If target == "feature":**

1. **Load platform and module context:**
   ```
   Read {project_root}/ccu_workspace/platform/02-specification/specification.json
   Read {project_root}/ccu_workspace/modules/{module}/02-specification/specification.json
   ```

   If either doesn't exist:
   Say to user: "❌ Module specification required first. Please run: /ccu:specify --target=module --module={module} --track=[track]"
   Exit command.

2. **Display combined context:**

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 **INHERITED CONTEXT**
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   **Platform Architecture**: [from platform spec]
   **Module**: {module} - [purpose from module spec]
   **Module Data Model**: [from module spec]
   **Module APIs**: [from module spec]

   **Specifying Feature**: {feature}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🚀 INSTANT Track
**If track is "instant":**

1. **Initialize TodoWrite tracking:**
   ```
   Create TodoWrite list:
   - "Check for pattern matches with Mem0"
   - "Analyze with technical-product-manager"
   - "Generate instant specification"
   - "Auto-detect modules/features if needed"
   ```

2. **Use discovery data from Step 0:**
   ```
   # INSTANT mode - NO questions asked to user
   Say to user: "🚀 INSTANT MODE: Zero-friction auto-generation activated"
   Say to user: "📝 No questions will be asked - using smart defaults and agent analysis"

   # Use DISCOVERED_MODULES from Step 0 (may be empty if no discovery)
   If DISCOVERED_MODULES is empty:
     Say to user: "🔎 Auto-detecting common module patterns..."
   Else:
     Say to user: "📦 Using {len(DISCOVERED_MODULES)} modules from discovery"
   ```

3. **Activate technical-product-manager agent:**
   ```
   Update TodoWrite: "Analyze with technical-product-manager" → in_progress

   Say to user: "🚀 INSTANT MODE: Auto-generating optimized specification..."

   If target == "platform":
     Activate technical-product-manager agent with opus-4-1:
     "Using your product strategy expertise, analyze this discovery data and generate an INSTANT track specification:
     [discovery data or user requirements]

     For INSTANT track, focus on:
     - MVP functionality only
     - Fastest path to working demo
     - Framework defaults and conventions
     - Zero configuration choices

     Provide specification as structured insights for file generation.
     DO NOT create files directly - return content for orchestrator to write."

   # Display agent insights to user
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🤖 TECHNICAL PRODUCT MANAGER INSIGHTS - INSTANT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   [Display agent's analysis including:]
   - Key patterns detected
   - Recommended MVP features
   - Risk assessments
   - Success factors

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   If target == "module":
     Activate technical-product-manager agent with opus-4-1:
     "Generate INSTANT module specification for {module} module.
     Platform context: [platform specification]
     Module discovery: [module discovery data]

     Auto-inherit all platform decisions. Focus on:
     - Module data model
     - API endpoints
     - Module boundaries
     Use all platform patterns."

   If target == "feature":
     Activate technical-product-manager agent with opus-4-1:
     "Generate INSTANT feature specification for {feature}.
     Platform context: [platform specification]
     Module context: [module specification]
     Feature discovery: [feature discovery data]

     Auto-inherit all decisions. Focus on:
     - Implementation approach
     - UI components (if frontend)
     - Business logic
     Use existing patterns."

   Update TodoWrite: "Analyze with technical-product-manager" → completed
   ```

4. **Generate specification files:**
   ```
   Update TodoWrite: "Generate instant specification" → in_progress

   Say to user: "📝 Creating instant specification files..."

   # Load templates from framework
   Load spec_template = ccu_framework/templates/specification/instant-spec.template.md
   Load json_template = ccu_framework/templates/specification/specification.template.json

   # Process agent insights into specification format
   specification_data = {
     "metadata": {
       "phase": "specification",
       "target": ARGUMENTS.target,
       "track": "instant",
       "timestamp": now(),
       "from_discovery": true,
       "version": "2.0"
     },
     "discovered_context": discovery_data if discovery_data else {},
     "functional_requirements": {
       "user_stories": agent_analysis.user_stories,
       "business_rules": agent_analysis.business_rules,
       "success_metrics": agent_analysis.success_metrics
     },
     "modules": agent_analysis.modules,
     "files": {
       "spec": "./spec.md",
       "requirements": "./requirements.md",
       "functional_spec": "./functional-spec.md",
       "business_rules": "./business-rules.md",
       "success_metrics": "./success-metrics.md",
       "user_stories": "./user-stories.md"
     }
   }

   # Create directory and files based on target
   If target == "platform":
     Create directory: {project_root}/ccu_workspace/platform/02-specification/

     Create file: {project_root}/ccu_workspace/platform/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/platform/02-specification/spec.md
       Content: Fill spec_template with agent_analysis

     Create file: {project_root}/ccu_workspace/platform/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Functional Requirements\n\n{extracted requirements from discovery}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Functional Specification\n\n{detailed feature specs}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/business-rules.md
       Content: agent_analysis.business_rules or "# Business Rules\n\n{validation and business logic}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Success Metrics\n\n{KPIs and measurable outcomes}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/user-stories.md
       Content: agent_analysis.user_stories or "# User Stories\n\n{1-2 basic stories per module}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/status.json
       Content: {"phase": "specified", "track": "instant", "timestamp": now()}

     Say to user: "✅ Created platform specification files"

   If target == "module":
     Create directory: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/spec.md
       Content: Fill spec_template with agent_analysis

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Module Requirements\n\n{module functional requirements}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Module Functional Specification\n\n{module feature specs}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/business-rules.md
       Content: agent_analysis.business_rules or "# Module Business Rules\n\n{module validation logic}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Module Success Metrics\n\n{module KPIs}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/status.json
       Content: {"phase": "specified", "track": "instant", "timestamp": now()}

     Say to user: "✅ Created module specification files"

   If target == "feature":
     Create directory: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/spec.md
       Content: Fill spec_template with agent_analysis

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Feature Requirements\n\n{feature functional requirements}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Feature Functional Specification\n\n{feature details}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/business-rules.md
       Content: agent_analysis.business_rules or "# Feature Business Rules\n\n{feature validation}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Feature Success Metrics\n\n{feature KPIs}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/status.json
       Content: {"phase": "specified", "track": "instant", "timestamp": now()}

     Say to user: "✅ Created feature specification files"

   Update TodoWrite: "Generate instant specification" → completed
   ```

5. **Apply All Business Rule Defaults (INSTANT - NO QUESTIONS):**
   ```
   Update TodoWrite: "Apply business rule defaults" → in_progress

   Say to user: "⚙️ Applying standard business rules from templates..."

   # Load defaults from business-rules.yaml
   Load business_rules = ccu_framework/templates/specification/business-rules.yaml

   # INSTANT mode: Apply ALL defaults automatically, ask ZERO questions
   For each module in DISCOVERED_MODULES:
     module_type = detect_module_type(module.name)
     defaults = business_rules.module_patterns[module_type] || business_rules.generic_rules

     # Apply all defaults without asking - NO SECURITY RULES
     module.business_rules = {
       # Business validation defaults
       data_validation_required: true,
       input_sanitization: "strict",
       form_validation: "client_and_server",

       # File module defaults
       max_file_size_mb: 10,
       allowed_extensions: ["csv", "xlsx", "txt", "pdf"],
       retention_days: 90,

       # Transaction defaults (if applicable)
       min_transaction_amount: 1.00,
       max_transaction_amount: 10000.00,
       refund_window_days: 30,

       # Data module defaults
       data_retention_days: 2555,  # 7 years
       backup_frequency_hours: 24,
       export_formats: ["csv", "pdf", "excel"],

       # API and performance defaults
       rate_limiting_requests: 100,
       pagination_size: 25,
       cache_ttl_seconds: 300
     }

     Say to user: "  ✓ {module.name}: Applied standard business rules"

   Update TodoWrite: "Apply business rule defaults" → completed
   ```

6. **Auto-Generate Basic User Stories (INSTANT):**
   ```
   Update TodoWrite: "Generate user stories" → in_progress

   Say to user: "📝 Auto-generating basic user stories..."

   # INSTANT: Generate 1 basic story per module
   For each module in DISCOVERED_MODULES:
     Generate basic story:
       title: "Use {module.name}"
       as_a: "user"
       i_want: "to use {module.purpose}"
       so_that: "I can achieve my goals"
       acceptance_criteria: [
         "GIVEN system is working",
         "WHEN I use the feature",
         "THEN it works as expected"
       ]

     Say to user: "  ✓ Generated story for {module.name}"

   Update TodoWrite: "Generate user stories" → completed
   ```

7. **Module Creation (if target=platform):**
   ```
   For each module in DISCOVERED_MODULES:
     - Create directory: {project_root}/ccu_workspace/modules/{module.name}/02-specification/
     - Generate: {project_root}/ccu_workspace/modules/{module.name}/02-specification/specification.json
       Content: {
         "metadata": {
           "module": "{module.name}",
           "phase": "specification",
           "track": "instant",
           "timestamp": now(),
           "from_discovery": true
         },
         "module_context": {
           "purpose": "{module.purpose}",
           "how_it_works": "{module.how_it_works}",
           "dependencies": [],
           "features": [auto-detected features]
         },
         "business_rules": {basic defaults},
         "user_stories": [1-2 basic stories],
         "success_metrics": {simple KPIs}
       }

   Update platform specification.json with modules array
   Say to user: "✅ Created specifications for {count} modules"
   ```

6. **Feature Auto-Detection (if target=module):**
   ```
   Update TodoWrite: "Auto-detect module features" → in_progress

   Say to user: "🔧 Auto-detecting features for {module}..."

   # INSTANT mode: 100% automatic based on module type
   Common feature patterns by module:

   user module → profile, settings, preferences, notifications, account
   user-management → team, members, permissions, invites, roles
   billing → subscription, payment-methods, invoices, usage, plans
   dashboard → overview, widgets, recent-activity, quick-actions
   products → list, details, search, categories, reviews
   commerce → cart, checkout, orders, shipping, returns
   messaging → inbox, compose, notifications, settings
   admin → users, permissions, audit-log, system-settings

   Detected features: [list based on module type]
   Say to user: "✅ Auto-detected features: [list]"

   For each detected feature:
     - Create: {project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/
     - Generate: specification.json (minimal feature spec)
     - Generate: spec.md (brief feature description)
     - Generate: test-scenarios.md (3-5 tests)
     - Generate: e2e-scenarios.md (1-2 smoke tests)
     - Generate: status.json (initial state)

   Update module specification.json with features array
   Update TodoWrite: "Auto-detect module features" → completed
   ```

7. **Store in Memory with MCP Tools:**
   ```
   # Store module information for future phases
   Say to user: "💾 Storing specification in memory..."

   # Store each module created
   For each module in detected_modules:
     mcp__mem0__add_memory(
       text: "Module created: {module.name} - {module.description}, functional purpose: {module.purpose}"
     )

   # Store overall specification pattern
   mcp__mem0__add_memory(
       text: "INSTANT specification completed for {target}: {module_count} modules, architecture: {architecture}"
   )

   # Store UI/design hints for the design phase
   mcp__mem0__add_memory(
     text: "PATTERN:UI:HINTS - Target: {target}, " +
           "AppType: {app_type || 'web application'}, " +
           "Modules: {detected_modules.map(m => m.name).join(', ')}, " +
           "UserModel: single-user, " +
           "DataFocus: {primary_data_types || 'standard CRUD'}, " +
           "Track: instant"
   )

   Say to user: "✅ Specification memorized for future phases"
   ```

8. **Final output and auto-proceed:**
   ```
   # Display completion message and next command

   If target == "platform":
     Display:
     ╔═══════════════════════════════════════════════════════════════════════╗
     ║  🚀 INSTANT Specification Complete ─ Zero-Touch Generation          ║
     ╚═══════════════════════════════════════════════════════════════════════╝

     ✨ INSTANT SUCCESS! Zero questions asked!

     📁 Auto-generated in {project_root}/ccu_workspace/platform/02-specification/
     🤖 Modules auto-detected: [list of modules]
     📝 User stories and requirements generated from discovery

     🚀 Track: INSTANT
     ⚡ Next: /ccu:design --target=platform --track=instant

     🎯 Auto-proceeding to designment phase...
     ══════════════════════════════════════════════════════════════════════

   If target == "module":
     Display:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ✅ INSTANT Module Specification Complete: $ARGUMENTS.module
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     📁 Auto-generated in {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/
     🔧 Features auto-detected: [list of features]

     Track: INSTANT
     Next: /ccu:design --target=module --module=$ARGUMENTS.module --track=instant

     ⚡ Auto-proceeding to designment phase...
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   If target == "feature":
     Display:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ✅ INSTANT Feature Specification Complete: $ARGUMENTS.feature
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     📁 Auto-generated: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/

     Track: INSTANT
     Next: /ccu:design --target=feature --module=$ARGUMENTS.module --feature=$ARGUMENTS.feature --track=instant

     ⚡ Auto-proceeding to designment phase...
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Update TodoWrite: All tasks → completed
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite tracking:**
   ```
   Create TodoWrite list:
   - "Check for pattern matches with Mem0"
   - "Collect critical decisions (4 questions)"
   - "Apply business rules to modules"
   - "Analyze with technical-product-manager"
   - "Generate specification files"
   - "Store patterns in Mem0"
   ```

2. **Check for pattern matches with Mem0:**
   ```
   Update TodoWrite: "Check for pattern matches with Mem0" → in_progress

   # Use Mem0 to find similar specifications with multiple strategies
   specification_patterns = mcp__mem0__search_memory(
     query: "PATTERN:DISCOVERY:PROJECT"
   )

   # Fallback: Search for module patterns if no project patterns found
   If specification_patterns.results.length == 0 && discovery_data && discovery_data.modules:
     # Build module pattern query
     module_type = "generic"
     If discovery_data.modules[0] && discovery_data.modules[0].type:
       module_type = discovery_data.modules[0].type

     specification_patterns = mcp__mem0__search_memory(
       query: "PATTERN:MODULE " + module_type
     )

   # Fallback 2: Generic specification search
   If specification_patterns.results.length == 0:
     # Build generic query
     generic_query = "specification " + ARGUMENTS.target
     If discovery_data && discovery_data.core_features:
       generic_query = generic_query + " " + discovery_data.core_features
     Else:
       generic_query = generic_query + " requirements"

     specification_patterns = mcp__mem0__search_memory(
       query: generic_query
     )

   If matches found (similarity > 70%):
     Display:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     💡 PATTERN DETECTION (Powered by Mem0)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     Similar specifications found:
     [Show top 2-3 matches with similarity scores]

     Apply pattern? [Y/n]: _
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   If user selects Yes:
     Pre-fill some answers based on pattern

   Update TodoWrite: "Check for pattern matches with Mem0" → completed
   ```

3. **Module-Specific Business Rules (RAPID - Contextual Questions):**
   ```
   Update TodoWrite: "Collect module-specific business rules" → in_progress

   # Load module business rules patterns
   Load module_rules = ccu_framework/templates/specification/module-business-rules.yaml

   # Use contextual questions generated in Step 0.1
   If CONTEXTUAL_QUESTIONS exists:
     questions_to_ask = CONTEXTUAL_QUESTIONS.filter(q => q.track == "rapid")
   Else:
     # Fallback: Generate questions based on discovered modules
     questions_to_ask = []
     For each module in DISCOVERED_MODULES:
       module_type = detect_module_type(module.name, module_rules.module_type_detection)
       module_pattern = module_rules.module_patterns[module_type] || module_rules.generic
       questions_to_ask.append(module_pattern.rapid_questions.slice(0, 2))

   # Limit to 4 total questions for RAPID
   questions_to_ask = questions_to_ask.slice(0, 4)

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "📋 RAPID TRACK - MODULE-SPECIFIC BUSINESS RULES"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "⚡ Based on your discovered modules, asking targeted questions:"
   Say to user: ""

   # Show progress bar for questions
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "Questions:    [0/{len(questions_to_ask)}] ░░░░░░░░░░░░░░░░░░░░ 0% ⏳"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   question_number = 1
   module_rules_collected = {}

   For each question in questions_to_ask:
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "{question_number}️⃣  MODULE: {question.module}"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""
     Say to user: "📝 {question.question}"
     Say to user: ""
     Say to user: "   Default: [{question.default}]"

     If question.examples:
       Say to user: "   💡 Examples: {question.examples.join(', ')}"

     Say to user: ""
     Say to user: "   Your answer: "

     user_answer = User input or question.default
     module_rules_collected[question.module][question.id] = parse_answer(user_answer, question.format)

     # Update progress
     progress_percent = (question_number / len(questions_to_ask)) * 100
     progress_bar = "█" * int(progress_percent / 5) + "░" * (20 - int(progress_percent / 5))

     Say to user: ""
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "Questions:    [{question_number}/{len(questions_to_ask)}] {progress_bar} {progress_percent}% 🔄"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""

     question_number++

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "✅ Applying smart defaults for remaining business rules..."
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Apply collected module-specific rules
   For each module in DISCOVERED_MODULES:
     module_type = detect_module_type(module.name)
     module_pattern = module_rules.module_patterns[module_type]

     # Apply collected answers or defaults
     module.business_rules = merge(
       module_pattern.instant_defaults,
       module_rules_collected[module.name] || {}
     )

   Update TodoWrite: "Collect module-specific business rules" → completed
   ```

4. **Generate Module Specifications (RAPID - automated):**
   ```
   Update TodoWrite: "Generate module specifications" → in_progress

   For each module detected in discovery:
     # RAPID track: Automated specifications based on patterns
     Load template from: templates/specification/module-patterns/
     Apply discovered features to template
     Generate: {project_root}/ccu_workspace/modules/{module}/02-specification/specification-rapid.json

     Say to user: "✅ Generated specification for {module} module"

   Update TodoWrite: "Generate module specifications" → completed
   ```

5. **Technical Product Manager Analysis:**
   ```
   Update TodoWrite: "Analyze with technical-product-manager" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🤖 Activating Technical Product Manager for analysis..."
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   Activate technical-product-manager agent with opus-4-1:
     "Transform the collected requirements into RAPID track specifications:
     Discovery data: {discovery_data}
     Business rules: {module_rules_collected}
     Target: {target}
     Focus on: User stories, acceptance criteria, success metrics
     Track: RAPID - balance speed with quality

     Provide specification as structured insights for file generation.
     DO NOT create files directly - return content for orchestrator to write."

   # Display agent's insights with enhanced UI
   Say to user: ""
   Say to user: "╔════════════════════════════════════════════════════════════════════╗"
   Say to user: "║  🤖 AGENT INSIGHTS ─ technical-product-manager                    ║"
   Say to user: "╚════════════════════════════════════════════════════════════════════╝"
   Say to user: ""
   Say to user: "📋 User Stories Generated:"
   For each story in agent_analysis.user_stories.slice(0, 3):
     Say to user: "   ✅ {story.title}"
   If agent_analysis.user_stories.length > 3:
     Say to user: "   ... and {agent_analysis.user_stories.length - 3} more"

   Say to user: ""
   Say to user: "🎯 Acceptance Criteria:"
   Say to user: "   • {agent_analysis.acceptance_criteria.summary}"

   Say to user: ""
   Say to user: "📊 Success Metrics:"
   For each metric in agent_analysis.success_metrics.slice(0, 2):
     Say to user: "   • {metric}"

   Say to user: ""
   Say to user: "⚠️ Risk Assessment:"
   Say to user: "   {agent_analysis.risk_level || 'Low'} - {agent_analysis.risk_summary || 'Standard implementation risks'}"

   Say to user: ""
   Say to user: "══════════════════════════════════════════════════════════════════════"
   Say to user: ""
   Say to user: "Confirm specifications? [Y/n]: "

   Update TodoWrite: "Analyze with technical-product-manager" → completed
   ```

6. **Generate specification outputs:**
   ```
   Update TodoWrite: "Generate specification suite" → in_progress

   Say to user: "📝 Creating RAPID specification files..."

   # Load templates
   Load spec_template = ccu_framework/templates/specification/rapid-spec.template.md
   Load json_template = ccu_framework/templates/specification/specification.template.json
   Load stories_template = ccu_framework/templates/specification/user-stories.template.md

   # Extract structured data from technical-product-manager agent's response
   # Agent returns JSON with: executive_summary, user_stories, functional_requirements,
   # business_rules, success_metrics, confidence_score

   # Process agent output into specification data
   specification_data = {
     "metadata": {
       "phase": "specification",
       "target": target,
       "track": "rapid",
       "timestamp": now(),
       "from_discovery": true,
       "version": "2.0",
       "confidence": agent_analysis.confidence_score
     },
     "discovered_context": discovery_data if discovery_data else {},
     "executive_summary": agent_analysis.executive_summary,
     "functional_requirements": {
       "user_stories": agent_analysis.user_stories,
       "business_rules": agent_analysis.business_rules,
       "success_metrics": agent_analysis.success_metrics,
       "acceptance_criteria": Extract from agent_analysis.user_stories
     },
     "modules": DISCOVERED_MODULES,
     "files": {
       "spec": "./spec.md",
       "requirements": "./requirements.md",
       "functional_spec": "./functional-spec.md",
       "business_rules": "./business-rules.md",
       "success_metrics": "./success-metrics.md",
       "user_stories": "./user-stories.md"
     }
   }

   # Create files based on target:
   If target == "platform":
     Create directory: {project_root}/ccu_workspace/platform/02-specification/

     Create file: {project_root}/ccu_workspace/platform/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/platform/02-specification/spec.md
       Content: Fill spec_template with agent_analysis

     Create file: {project_root}/ccu_workspace/platform/02-specification/user-stories.md
       Content: Fill stories_template with user stories

     Create file: {project_root}/ccu_workspace/platform/02-specification/requirements.md
       Content: Functional requirements extracted from discovery.json requirements_hints

     Create file: {project_root}/ccu_workspace/platform/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Functional Specification\n\n{essential feature specs}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/business-rules.md
       Content: module_rules_collected or "# Business Rules\n\n{key business rules and validation}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Success Metrics\n\n{core KPIs and metrics}"

     Say to user: "✅ Created platform specification files"

   If target == "module":
     Create directory: {project_root}/ccu_workspace/modules/{module}/02-specification/

     Create file: {project_root}/ccu_workspace/modules/{module}/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/modules/{module}/02-specification/spec.md
       Content: Fill spec_template with agent_analysis

     Create file: {project_root}/ccu_workspace/modules/{module}/02-specification/acceptance-criteria.md
       Content: Acceptance criteria for module features

     Say to user: "✅ Created module specification files"

   Update TodoWrite: "Generate specification suite" → completed
   ```

7. **Generate Module Specifications (if target=platform):**
   ```
   Update TodoWrite: "Generate module specifications" → in_progress

   # Use modules from discovery - NEVER ask for modules again
   If DISCOVERED_MODULES && DISCOVERED_MODULES.length > 0:
     Say to user: ""
     Say to user: "📦 Generating specifications for discovered modules..."

     For each module in DISCOVERED_MODULES:
       - Create directory: {project_root}/ccu_workspace/modules/{module.name}/02-specification/
       - Generate: {project_root}/ccu_workspace/modules/{module.name}/02-specification/specification.json
         Content: {
           "metadata": {
             "module": "{module.name}",
             "phase": "specification",
             "track": "rapid",
             "timestamp": now(),
             "from_discovery": true
           },
           "module_context": {
             "purpose": "{module.purpose from discovery}",
             "how_it_works": "{module.how_it_works from discovery}",
             "dependencies": [],
             "features": [3-5 features]
           },
           "business_rules": {key rules collected},
           "user_stories": [3-5 stories],
           "success_metrics": {core KPIs}
         }
       - Generate: {project_root}/ccu_workspace/modules/{module.name}/02-specification/spec.md
         Content: Module specification overview

     Say to user: "✅ Generated specifications for {DISCOVERED_MODULES.length} modules"

   Else:
     Say to user: "⚠️ No modules found in discovery. Run discovery first."

   Update platform specification.json with modules array
   Update TodoWrite: "Generate module specifications" → completed
   ```
8. **Apply Business Rules to Modules:**
   ```
   Update TodoWrite: "Apply business rules to modules" → in_progress

   # Business rules were already collected in step 3 for RAPID
   # Now apply them to all discovered modules

   IF track == "rapid":
     # Business rules already collected in step 3
     # Apply the 4 collected values to all modules

     Load business_rules = ccu_framework/templates/specification/business-rules.yaml

     For each module in DISCOVERED_MODULES:
       module_type = detect_module_type(module.name)
       defaults = business_rules.module_patterns[module_type] || business_rules.generic_rules

       # Apply collected values from step 3 - NO SECURITY
       module.business_rules = merge(defaults, {
         max_file_size_mb: max_file_size,
         data_retention_days: data_retention,
         validation_rules: validation_collected,
         business_constraints: constraints_collected
       })

       Say to user: "  ✓ Applied business rules to {module.name}"

   ELIF track == "standard":
     # Business rules already collected in step 3
     # Apply the 5 collected policies to all modules

     Load business_rules = ccu_framework/templates/specification/business-rules.yaml

     For each module in DISCOVERED_MODULES:
       module_type = detect_module_type(module.name)
       defaults = business_rules.module_patterns[module_type] || business_rules.generic_rules

       # Parse and apply collected policies from step 3 - NO SECURITY
       parsed_file = parse(file_policy)
       parsed_rate = parse(rate_policy)
       parsed_data = parse(data_policy)
       parsed_validation = parse(validation_policy)
       parsed_business = parse(business_policy)

       module.business_rules = merge(defaults, parsed_values)

       Say to user: "  ✓ Applied comprehensive rules to {module.name}"

   ELIF track == "enterprise":
     # Business rules already collected in step 3
     # Apply the 8 collected governance policies to all modules

     Load business_rules = ccu_framework/templates/specification/business-rules.yaml

     For each module in DISCOVERED_MODULES:
       module_type = detect_module_type(module.name)
       defaults = business_rules.module_patterns[module_type] || business_rules.generic_rules

       # Parse and apply collected policies from step 3 - NO SECURITY
       parsed_data = parse(data_governance)
       parsed_compliance = parse(compliance)
       parsed_sla = parse(sla_targets)
       parsed_integration = parse(integration_policy)
       parsed_recovery = parse(disaster_recovery)
       parsed_business = parse(business_governance)
       parsed_operational = parse(operational_policy)
       parsed_quality = parse(quality_standards)

       module.business_rules = merge(defaults, parsed_values, compliance_requirements)

       Say to user: "  ✓ Applied enterprise governance to {module.name}"

   ELSE:  # instant track - handled earlier, no questions
     pass

   Update TodoWrite: "Specify module business rules" → completed
   ```

9. **Transform Workflows to User Stories (Discovery-Driven):**
   ```
   Update TodoWrite: "Transform workflows to user stories" → in_progress

   # Use AUTO_GENERATED_STORIES from Step 0.1 or generate now
   If AUTO_GENERATED_STORIES exists:
     user_stories = AUTO_GENERATED_STORIES
   Else:
     # Transform discovered workflows into stories
     user_stories = []

     Say to user: ""
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "📝 TRANSFORMING DISCOVERED WORKFLOWS INTO USER STORIES"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

     For each module in DISCOVERED_MODULES:
       Say to user: ""
       Say to user: "📦 {module.name}: Transforming {module.user_workflows.length} workflows..."

       For each workflow in module.user_workflows:
         # Parse workflow to extract actor, action, outcome
         parsed = parse_workflow(workflow)

         story = {
           id: generate_story_id(),
           module: module.name,
           title: workflow.title || "Core workflow",
           as_a: parsed.actor || extract_persona(workflow),
           i_want: parsed.action || extract_action(workflow),
           so_that: parsed.outcome || extract_benefit(workflow),
           acceptance_criteria: generate_acceptance_criteria(workflow, module.how_it_works)
         }

         user_stories.append(story)

     Say to user: "✅ Transformed {user_stories.length} workflows into user stories"

   # Track-specific story enrichment
   IF track == "instant":
     # INSTANT: Keep stories simple
     For each story in user_stories:
       story.acceptance_criteria = ["System works as expected"]
       Say to user: "  ✓ Simplified story: {story.title}"

   ELIF track == "rapid":
     # RAPID: Add basic acceptance criteria
     For each story in user_stories:
       story.acceptance_criteria = generate_basic_criteria(story, module.how_it_works)
       Say to user: "  ✓ Enhanced story: {story.title} with {story.acceptance_criteria.length} criteria"

   ELIF track == "standard":
     # STANDARD: 5+ stories per module with edge cases
     For each module in DISCOVERED_MODULES:
       Generate comprehensive stories:
         - All discovered workflows
         - Edge cases from discovery
         - Error scenarios
         - Alternative paths

       For each story:
         Include detailed acceptance criteria:
           - Happy path criteria
           - Error handling criteria
           - Performance criteria
           - Validation criteria

       Say to user: "  ✓ Generated {count} detailed stories for {module.name}"

   ELIF track == "enterprise":
     # ENTERPRISE: Complete story coverage with compliance
     For each module in DISCOVERED_MODULES:
       Generate exhaustive stories:
         - All user workflows
         - All edge cases
         - Compliance scenarios
         - Audit scenarios
         - Integration scenarios
         - Disaster recovery scenarios

       For each story:
         Include enterprise acceptance criteria:
           - Functional criteria
           - Performance SLAs
           - Security requirements
           - Compliance checks
           - Audit trail requirements

       Say to user: "  ✓ Generated {count} enterprise stories for {module.name}"

   Say to user: ""
   Say to user: "✅ Generated {total_stories} {track} user stories"

   # After all modules specified and stories generated, confirm
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "✅ SPECIFICATION SUMMARY"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   For each module:
     Say to user: "📦 {module.name}: {selected_option_summary}"

   Say to user: ""
   Say to user: "Is this correct? [Y/n/edit]: "

   If user selects edit:
     Ask: "Which module needs adjustment? "
     Re-present options for that module

   Update TodoWrite: "Specify module functionality" → completed
   ```

9. **Generate Feature Specifications (if target=module):**
   ```
   Update TodoWrite: "Generate feature specifications" → in_progress

   # Use features from discovery - NEVER ask for features again
   If DISCOVERED_MODULES && current_module.features:
     Say to user: "🔧 Generating specifications for discovered features..."

     For each feature in current_module.features:
       - Create: {project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/
       - Generate: specification.json (apply business rules)
       - Generate: spec.md (from discovery data)
       - Generate: test-scenarios.md from templates
       - Generate: e2e-scenarios.md from templates
       - Generate: status.json with initial state
       - Add to module's features-overview.md

     Say to user: "✅ Generated specifications for {features.length} features"
   Else:
     Say to user: "⚠️ No features found in discovery for {module}"

   Update module specification.json with features array
   Update TodoWrite: "Generate feature specifications" → completed
   ```

9. **Store Intelligent Patterns in Memory (Enhanced):**
   ```
   # Store PATTERNS for future reuse, not just project data
   Say to user: "💾 Storing reusable specification patterns..."

   # Store module-type patterns
   For each module in created_modules:
     module_type = detect_module_type(module.name)

     # Store as a PATTERN for future projects
     mcp__mem0__add_memory(
       text: "PATTERN:MODULE:{module_type} " +
             "business_rules:{JSON.stringify(module.business_rules)} " +
             "success_metrics:{JSON.stringify(module.success_metrics)} " +
             "common_features:{module.features.join(',')} " +
             "typical_stories:{module.user_stories.length}"
     )

   # Store industry patterns
   If discovery_data?.business_model:
     mcp__mem0__add_memory(
       text: "PATTERN:INDUSTRY:{discovery_data.business_model} " +
             "modules:{created_modules.map(m => m.name).join(',')} " +
             "business_rules:{JSON.stringify(collected_business_rules)} " +
             "track:{track} confidence:high"
     )

   # Store success patterns
   mcp__mem0__add_memory(
     text: "PATTERN:SUCCESS:{discovery_data.app_type} " +
           "module_count:{created_modules.length} " +
           "question_count:{questions_asked} " +
           "patterns_applied:{patterns_used.length} " +
           "generation_time:{elapsed_time}"
   )

   # Store UI/design hints for the design phase
   mcp__mem0__add_memory(
     text: "PATTERN:UI:HINTS - Target: {target}, " +
           "AppType: {discovery_data?.app_type || app_type}, " +
           "Modules: {created_modules.map(m => m.name).join(', ')}, " +
           "UserModel: {user_model || 'multi-user'}, " +
           "DataFocus: {primary_data_operations || 'data management'}, " +
           "UserProfiles: {user_profiles_collected || 'standard users'}, " +
           "BusinessRules: {business_rules_count} rules defined, " +
           "Track: rapid"
   )

   Say to user: "✅ Stored {patterns_stored} reusable patterns for future projects"
   ```

10. **Output summary and next steps:**
   ```
   # Display completion message based on target

   If target == "platform":
     Display:
     ╔═══════════════════════════════════════════════════════════════════════╗
     ║  🎉 RAPID Specification Complete ─ Platform                          ║
     ╚═══════════════════════════════════════════════════════════════════════╝

     ✨ SUCCESS! Your specification is ready!

     📁 Files generated in {project_root}/ccu_workspace/platform/02-specification/:
       ✅ specification.json
       ✅ spec.md (human-readable specification)
       ✅ test-scenarios.md       ✅ e2e-scenarios.md       ✅ status.json (designment tracking)

     📦 Modules created: [list of modules] in {project_root}/ccu_workspace/modules/

     🏗️ Architecture: [selected architecture]
     💾 Database: [selected database]
     🔌 API Style: [selected API style]

     ⚡ Track: RAPID
     🚀 Next: /ccu:design --target=platform --track=rapid
     ══════════════════════════════════════════════════════════════════════

   If target == "module":
     Display:
     ╔═══════════════════════════════════════════════════════════════════════╗
     ║  🎉 RAPID Specification Complete ─ Module: $ARGUMENTS.module         ║
     ╚═══════════════════════════════════════════════════════════════════════╝

     📁 Files generated in {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/:
       • specification.json
       • spec.md
       •        •        • status.json

     🔧 Features created: [list of features] in features/

     Track: RAPID
     Next: /ccu:design --target=module --module=$ARGUMENTS.module --track=rapid
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   If target == "feature":
     Display:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ✅ RAPID Specification Complete - Feature: $ARGUMENTS.feature
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     📁 Files generated:
       {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/
       • specification.json
       • spec.md
       •        •        • status.json

     Parent module: $ARGUMENTS.module
     Track: RAPID
     Next: /ccu:design --target=feature --module=$ARGUMENTS.module --feature=$ARGUMENTS.feature --track=rapid
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite tracking:**
   ```
   Create TodoWrite list:
   - "Check for pattern matches with Mem0"
   - "Collect business rules (5 questions)"
   - "Apply business rules to modules"
   - "Analyze with technical-product-manager"
   - "Generate specification suite"
   - "Store patterns in Mem0"
   ```

2. **Deep pattern recognition with Mem0:**
   ```
   Update TodoWrite: "Check for pattern matches with Mem0" → in_progress

   # STANDARD track gets deeper pattern analysis with multiple attempts
   standard_patterns = mcp__mem0__search_memory(
     query: "PATTERN:MODULE business rules validation"
   )

   # Also search for QA patterns
   qa_patterns = mcp__mem0__search_memory(
     query: "PATTERN:QA:DISCOVERY Track: standard"
   )

   # Fallback: Broader search if specific patterns not found
   If standard_patterns.results.length == 0:
     standard_patterns = mcp__mem0__search_memory(
       query: "specification ${ARGUMENTS.target} ${discovery_data?.core_features || ''} business rules"
     )

   If multiple matches found (similarity > 60%):
     Display:
     ╔══════════════════════════════════════════════════════════════════════╗
     ║  💡 PATTERN LIBRARY (Powered by Mem0)                               ║
     ╚══════════════════════════════════════════════════════════════════════╝

     Found ${match_count} similar specifications:

     For each match:
       📦 ${match.name} (${match.similarity}% match)
          - Architecture: ${match.architecture}
          - Success Metrics: ${match.metrics}
          - Business Rules: ${match.rule_count} rules

     Options:
     [A] Apply best practices from all
     [S] Select specific pattern
     [N] Continue without patterns

     Choice: _

   If user selects A or S:
     Pre-fill relevant sections with proven patterns
     Adapt patterns to current discovery context

   Update TodoWrite: "Check for pattern matches with Mem0" → completed
   ```

3. **Collect Business Rules (STANDARD - 5 questions):**
   ```
   Update TodoWrite: "Collect business rules (5 questions)" → in_progress

   # STANDARD: Ask 5 comprehensive questions
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "📋 STANDARD TRACK - COMPREHENSIVE BUSINESS RULES"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "🎯 Press Enter to use defaults for quick setup"
   Say to user: ""

   # Progress tracking
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "Rules:        [0/5]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   # Load business logic questions from specification-questions.yaml
   # Security questions have been moved to security phase (Phase 4)
   # See: ccu_framework/templates/security/security-questions.yaml

   Load questions from: ccu_framework/templates/specification/specification-questions.yaml
   Based on track = "standard"

   # For standard track, ask business logic questions about:
   # - User stories and acceptance criteria
   # - Business rules and validation
   # - Data entities and relationships
   # - Core workflows and processes
   # - Integration requirements

   Ask business logic questions formatted per ui-commands-standards.md

   Say to user: "✅ Business logic questions collected..."

   Update TodoWrite: "Collect business rules (5 questions)" → completed
   ```

4. **Activate technical-product-manager agent:**
   ```
   Update TodoWrite: "Analyze with technical-product-manager" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🤖 ACTIVATING TECHNICAL PRODUCT MANAGER"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "📋 Creating comprehensive user stories and requirements..."
   Say to user: ""

   Activate technical-product-manager agent with opus-4-1:
   "Using your product strategy expertise, create STANDARD track functional specifications:
   Discovery data: [discovery data if available]
   User requirements: [collected user flows, rules, priorities]

   CRITICAL: Do NOT mention or suggest any time frames, weeks, months, or deadlines.
   Focus only on feature scope, prioritization, and functionality.
   The user will determine timelines separately.

   Based on discovery data: [complete feature list from discovery]
   User's specification answers: [collected requirements]

   For STANDARD track, generate:
   - Transform all discovered features into user stories (10-20)
   - Comprehensive acceptance criteria with edge cases
   - Functional requirements (what system must DO)
   - Business rules and validation logic (10-15 rules)
   - Workflow definitions and state transitions
   - Success metrics with measurable targets (5-7)

   Build entirely on discovery data.
   DO NOT re-ask about features or users.
   Focus on requirements, rules, and success criteria.

   Provide specification as structured insights for file generation.
   DO NOT create files directly - return content for orchestrator to write."

   # Display comprehensive agent analysis with enhanced UI
   Say to user: ""
   Say to user: "╔════════════════════════════════════════════════════════════════════╗"
   Say to user: "║  🤖 AGENT INSIGHTS ─ technical-product-manager                    ║"
   Say to user: "╚════════════════════════════════════════════════════════════════════╝"
   Say to user: ""
   Say to user: "📊 Requirements Analysis:"
   Say to user: "   • Total user stories generated: {agent_analysis.user_stories.length}"
   Say to user: "   • Edge cases identified: {agent_analysis.edge_cases.length}"
   Say to user: "   • Business rules documented: {agent_analysis.business_rules.length}"
   Say to user: ""
   Say to user: "🎯 Priority Matrix:"
   Say to user: "   Critical:    {agent_analysis.critical_features.slice(0,3).join(', ')}"
   Say to user: "   Important:   {agent_analysis.important_features.slice(0,3).join(', ')}"
   Say to user: "   Nice-to-have: {agent_analysis.nice_features.slice(0,2).join(', ')}"
   Say to user: ""
   Say to user: "📈 Success Metrics:"
   For each metric in agent_analysis.success_metrics.slice(0, 5):
     Say to user: "   • {metric.name}: {metric.target}"
   Say to user: ""
   Say to user: "⚠️ Risk Assessment:"
   Say to user: "   Level: {agent_analysis.risk_level || 'Medium'}"
   Say to user: "   Key Risks: {agent_analysis.key_risks || 'Standard implementation challenges'}"
   Say to user: ""
   Say to user: "══════════════════════════════════════════════════════════════════════"

   Update TodoWrite: "Analyze with technical-product-manager" → completed
   ```

5. **Generate specification suite:**
   ```
   Update TodoWrite: "Generate specification suite" → in_progress

   Say to user: "📝 Creating comprehensive STANDARD specification files..."

   # Load templates
   Load spec_template = ccu_framework/templates/specification/standard-spec.template.md
   Load json_template = ccu_framework/templates/specification/specification.template.json
   Load stories_template = ccu_framework/templates/specification/user-stories.template.md
   Load rules_template = ccu_framework/templates/specification/business-rules.template.md
   Load metrics_template = ccu_framework/templates/specification/success-metrics.template.md

   # Process agent output
   specification_data = {
     "metadata": {
       "phase": "specification",
       "target": target,
       "track": "standard",
       "timestamp": now(),
       "from_discovery": true,
       "version": "2.0"
     },
     "discovered_context": discovery_data if discovery_data else {},
     "functional_requirements": {
       "user_stories": agent_analysis.user_stories,
       "business_rules": agent_analysis.business_rules,
       "success_metrics": agent_analysis.success_metrics,
       "acceptance_criteria": agent_analysis.acceptance_criteria,
       "feature_priorities": agent_analysis.priorities
     },
     "modules": DISCOVERED_MODULES,
     "files": {
       "spec": "./spec.md",
       "requirements": "./requirements.md",
       "functional_spec": "./functional-spec.md",
       "business_rules": "./business-rules.md",
       "success_metrics": "./success-metrics.md",
       "user_stories": "./user-stories.md",
       "feature_priorities": "./feature-priorities.md"
     }
   }

   # Determine output path and create files
   If target == "platform":
     Create directory: {project_root}/ccu_workspace/platform/02-specification/

     Create file: {project_root}/ccu_workspace/platform/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/platform/02-specification/spec.md
       Content: Fill spec_template with comprehensive specifications

     Create file: {project_root}/ccu_workspace/platform/02-specification/user-stories.md
       Content: Fill stories_template with all user stories and acceptance criteria

     Create file: {project_root}/ccu_workspace/platform/02-specification/business-rules.md
       Content: Fill rules_template with business logic and validation rules

     Create file: {project_root}/ccu_workspace/platform/02-specification/success-metrics.md
       Content: Fill metrics_template with KPIs and measurable outcomes

     Create file: {project_root}/ccu_workspace/platform/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Functional Requirements\n\n{comprehensive functional requirements}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Functional Specification\n\n{detailed feature specifications}"

     Create file: {project_root}/ccu_workspace/platform/02-specification/feature-priorities.md
       Content: Feature prioritization matrix from agent analysis

     Say to user: "✅ Created comprehensive platform specification suite"

   If target == "module":
     Create directory: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/specification.json
       Content: Fill json_template with specification_data

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/spec.md
       Content: Fill spec_template with module specifications

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/user-stories.md
       Content: Fill stories_template with module user stories

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/business-rules.md
       Content: Fill rules_template with module business rules

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Module Requirements\n\n{module functional requirements}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Module Functional Specification\n\n{module specifications}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Module Success Metrics\n\n{module KPIs}"

     Say to user: "✅ Created comprehensive module specification suite"

   If target == "feature":
     Create directory: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/specification.json
       Content: Fill json_template with feature specification

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/spec.md
       Content: Fill spec_template with feature details

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/acceptance-criteria.md
       Content: Detailed acceptance criteria for feature

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/requirements.md
       Content: agent_analysis.requirements or "# Feature Requirements\n\n{feature requirements}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/functional-spec.md
       Content: agent_analysis.functional_spec or "# Feature Functional Specification\n\n{feature specifications}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/business-rules.md
       Content: agent_analysis.business_rules or "# Feature Business Rules\n\n{feature validation rules}"

     Create file: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/success-metrics.md
       Content: agent_analysis.success_metrics or "# Feature Success Metrics\n\n{feature KPIs}"

     Say to user: "✅ Created comprehensive feature specification suite"

   Update TodoWrite: "Generate specification suite" → completed
   ```

6. **Generate Module Specifications (if target=platform):**
   ```
   Update TodoWrite: "Generate module specifications" → in_progress

   # Use modules from discovery - NEVER ask for modules again
   If DISCOVERED_MODULES && DISCOVERED_MODULES.length > 0:
     Say to user: "📦 Generating comprehensive module specifications..."

     For each module in DISCOVERED_MODULES:
       - Create: {project_root}/ccu_workspace/modules/{module.name}/02-specification/
       - Generate: {project_root}/ccu_workspace/modules/{module.name}/02-specification/specification.json
         Content: {
           "metadata": {
             "module": "{module.name}",
             "phase": "specification",
             "track": "standard",
             "timestamp": now(),
             "from_discovery": true
           },
           "module_context": {
             "purpose": "{module.purpose from discovery}",
             "how_it_works": "{module.how_it_works from discovery}",
             "dependencies": [analyzed dependencies],
             "features": [5-10 features]
           },
           "business_rules": {comprehensive rules},
           "user_stories": [5-10 stories with acceptance criteria],
           "success_metrics": {detailed KPIs}
         }
       - Generate: spec.md (detailed module specification)
       - Generate: user-stories.md (module-specific stories)
       - Generate: business-rules.md (module business logic)

     Say to user: "✅ Generated comprehensive specs for {DISCOVERED_MODULES.length} modules"
   Else:
     Say to user: "⚠️ No modules found in discovery. Run discovery first."

   Update platform specification.json with modules array
   Update TodoWrite: "Generate module specifications" → completed
   ```

7. **Generate Feature Specifications (if target=module):**
    ```
    Update TodoWrite: "Generate feature specifications" → in_progress

    # Use features from discovery - NEVER ask for features again
    If DISCOVERED_MODULES && current_module.features:
      Say to user: "🔧 Generating comprehensive feature specifications..."

      For each feature in current_module.features:
        - Create: {project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/
        - Generate: specification.json (comprehensive business rules)
        - Generate: spec.md (detailed from discovery)
        - Generate: test-scenarios.md from templates
        - Generate: e2e-scenarios.md from templates
        - Generate: status.json with initial validation state
        - Add to module's features-overview.md

      Say to user: "✅ Generated comprehensive specs for {features.length} features"
    Else:
      Say to user: "⚠️ No features found in discovery for {module}"

    Update module specification.json with features array
    Update TodoWrite: "Generate feature specifications" → completed
    ```

8. **Store Comprehensive Specifications in Memory:**
   ```
   # Store detailed specifications for knowledge retention
   Say to user: "💾 Storing comprehensive specifications..."

   # Store each module with detailed specifications
   For each module in created_modules:
     mcp__mem0__add_memory(
       text: "STANDARD module: {module.name} - {module.description}, " +
             "User stories: {module.user_story_count}, " +
             "Business rules: {module.business_rules}, " +
             "API spec: {module.api_contracts}, " +
             "Data models: {module.data_models}, " +
             "Test scenarios: {module.test_scenario_count}"
     )

   # Store architecture and technical decisions
   mcp__mem0__add_memory(
     text: "STANDARD architecture: {target} specification with " +
           "{module_count} modules, {user_story_count} user stories, " +
           "Architecture: {selected_architecture}, " +
           "Database: {selected_database} with {cache_solution}, " +
           "API Style: {selected_api_style}, " +
           "Success metrics: {success_metrics}"
   )

   # Store UI/design hints for the design phase
   mcp__mem0__add_memory(
     text: "PATTERN:UI:HINTS - Target: {target}, " +
           "AppType: {discovery_data?.app_type || app_type}, " +
           "Modules: {created_modules.map(m => m.name).join(', ')}, " +
           "UserModel: {user_model || 'team/multi-user'}, " +
           "DataFocus: {primary_data_operations || 'comprehensive data management'}, " +
           "UserProfiles: {user_personas?.join(', ') || 'multiple user types'}, " +
           "BusinessRules: {business_rules_collected?.length || 'detailed'} rules, " +
           "Architecture: {selected_architecture}, " +
           "APIStyle: {selected_api_style}, " +
           "Track: standard"
   )

   # Index the created workspace structure if existing code
   If exists("{project_root}/src") or exists("{project_root}/app"):
     Say to user: "📂 Indexing codebase structure..."
     mcp__claude-context__index_codebase(
       path: "{project_root}",
       splitter: "ast"
     )
     Say to user: "✅ Codebase indexed for context awareness"

   Say to user: "✅ Comprehensive specifications stored"
   ```

9. **Create in:** Appropriate path based on target
    - Platform: `{project_root}/ccu_workspace/platform/02-specification/`
    - Module: `{project_root}/ccu_workspace/modules/{module}/02-specification/`
    - Feature: `{project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/`

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize TodoWrite tracking:**
   ```
   Create TodoWrite list:
   - "Check for enterprise pattern matches with Mem0"
   - "Collect business rules (8 questions)"
   - "Apply governance rules to modules"
   - "Analyze with technical-product-manager"
   - "Generate enterprise specification suite"
   - "Store patterns in Mem0"
   ```

2. **Deep enterprise pattern analysis with Mem0:**
   ```
   Update TodoWrite: "Check for enterprise pattern matches with Mem0" → in_progress

   # ENTERPRISE track gets extensive pattern matching with multiple searches
   enterprise_patterns = mcp__mem0__search_memory(
     query: "PATTERN:INDUSTRY compliance governance"
   )

   # Search for enterprise module patterns
   enterprise_modules = mcp__mem0__search_memory(
     query: "PATTERN:MODULE Track: ENTERPRISE"
   )

   # Search for integration patterns
   integration_patterns = mcp__mem0__search_memory(
     query: "PATTERN:INTEGRATION"
   )

   # Fallback: General enterprise search
   If enterprise_patterns.results.length == 0:
     enterprise_patterns = mcp__mem0__search_memory(
       query: "enterprise ${discovery_data?.business_model || ''} compliance ${discovery_data?.core_features || ''}"
     )

   If matches found:
     Display:
     ╔══════════════════════════════════════════════════════════════════════╗
     ║  💎 ENTERPRISE PATTERN LIBRARY (Powered by Mem0)                    ║
     ╚══════════════════════════════════════════════════════════════════════╝

     Found ${match_count} enterprise implementations:
     For each match:
       🏢 ${match.name} - ${match.industry}
          - Compliance: ${match.compliance_frameworks}
          - Governance: ${match.governance_model}
          - Success Rate: ${match.success_rate}%

     Applying enterprise best practices to your specification...

   Update TodoWrite: "Check for enterprise pattern matches with Mem0" → completed
   ```

3. **Collect Business Rules (ENTERPRISE - 8 questions):**
   ```
   Update TodoWrite: "Collect business rules (8 questions)" → in_progress

   # ENTERPRISE: Ask 8 governance and compliance questions
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🏢 ENTERPRISE: 8 GOVERNANCE & COMPLIANCE RULES"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Load enterprise business logic questions from specification-questions.yaml
   # Security and governance questions have been moved to security phase (Phase 4)
   # See: ccu_framework/templates/security/security-questions.yaml

   Load questions from: ccu_framework/templates/specification/specification-questions.yaml
   Based on track = "enterprise"

   # Compliance questions moved to security phase

   # SLA definitions moved to deployment/operations phase

   # Audit requirements moved to security phase

   # Question 7 - Integration Constraints
   Say to user: "7️⃣ Integration limits (timeout sec/retries/rate)? [30/3/100]: "
   integration_policy = User input or "30/3/100"

   # Question 8 - Disaster Recovery
   Say to user: "8️⃣ Recovery targets (RTO hrs/RPO hrs/backup freq)? [4/1/hourly]: "
   disaster_recovery = User input or "4/1/hourly"

   Say to user: ""
   Say to user: "✅ Generating enterprise-grade specifications..."

   Update TodoWrite: "Collect business rules (8 questions)" → completed
   ```

   Display:
   ╔══════════════════════════════════════════════════════════════════════╗
   ║  🏢 ENTERPRISE TRACK ─ 8 Non-Redundant Questions                    ║
   ╚══════════════════════════════════════════════════════════════════════╝

   🌟 Enterprise-grade specification with expert agent validation:

   ┌──────────────────────────────────────────────────────────────────────┐
   │  📋 Requirements Management (2 questions)                           │
   │  📖 Detailed Specifications (3 questions)                           │
   │  📜 Compliance & Governance (2 questions)                           │
   │  🔌 Integration Behavior (1 question)                               │
   └──────────────────────────────────────────────────────────────────────┘

   🤖 Each category reviewed by specialized agents:
   • 📊 Technical Product Manager
   • 🔒 Compliance Auditor
   • 🎨 Product Designer

   Progress: [⚫⚫⚫⚫⚫⚫⚫⚫] 0/8 questions

   ══════════════════════════════════════════════════════════════════════

   ```
   # Load questions focused on requirements only (WHAT, not HOW)
   Load questions from templates/specification/specification-questions.yaml

   If target == "platform":
     Load questions from: tracks.enterprise
   If target == "module":
     Load questions from: targets.module.enterprise
   If target == "feature":
     Load questions from: targets.feature.enterprise

   Display appropriate header based on target

   For each category in enterprise.categories:
     Update TodoWrite: "Collect {category.name.lower()} requirements" → in_progress

     # Show category batch with agent assignment - premium styling
     Display:
     ╔══════════════════════════════════════════════════════════════════════╗
     ║  {category.emoji} {category.name} ─ {len(category.questions)} Questions                                  ║
     ║  🤖 Agent Reviewer: {category.agent}                                ║
     ╚══════════════════════════════════════════════════════════════════════╝

     # List all questions in this category upfront
     For each question in category.questions:
       Display: "• {question.question}"

     Display: "\nStarting {category.name} questions:\n"

     # Now ask each question with enterprise-grade formatting
     total_questions = calculate_total_questions_across_all_categories()
     For each question in category.questions:
       current_number = calculate_overall_question_number()
       Display:
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       🔢 QUESTION {current_number}/{total_questions}
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       💎 **{category.name}**
       🤖 Expert Domain: {category.agent}

       Display: "**{question.question}**"
       Display: ""
       Display question.format with enterprise context

       # Show consolidation info for enterprise
       If question.consolidates:
         Display: "This question covers: {', '.join(question.consolidates)}"

       Display: "**Your answer:**"
       Accept user input
       Store response with validation

       # Update progress bar with premium visual indicators
       filled = current_number
       total = 8
       progress_percentage = int(filled / total * 100)

       # Use gradient of colors for progress
       if filled <= 3:
         progress_icons = '🔴' * filled  # Red for early stage
       elif filled <= 6:
         progress_icons = '🔴' * 3 + '🟡' * (filled - 3)  # Yellow for mid stage
       else:
         progress_icons = '🔴' * 3 + '🟡' * 3 + '🟢' * (filled - 6)  # Green for final stage

       empty_icons = '⚫' * (total - filled)
       Display: "📊 Progress: [{progress_icons}{empty_icons}] {current_number}/8 questions ({progress_percentage}%)"

       # After every 2-3 questions, use Sequential Thinking for deep analysis (ENTERPRISE)
       If current_number % 2 == 0 and current_number < 8:
         mcp__sequential-thinking__sequentialthinking(
           thought: "Enterprise specification analysis after ${current_number} questions. Reviewing: ${collected_answers}. Checking for compliance gaps, governance requirements, integration complexities...",
           nextThoughtNeeded: true,
           thoughtNumber: int(current_number / 2),
           totalThoughts: 4
         )

         If critical_gaps_identified:
           Display:
           ╔══════════════════════════════════════════════════════════════════════╗
           ║  🔍 DEEP ANALYSIS (Powered by Sequential Thinking)                  ║
           ╚══════════════════════════════════════════════════════════════════════╝

           Critical findings:
           ⚠️ ${finding_1}
           ⚠️ ${finding_2}

           Adjusting remaining questions to address these areas...
           ══════════════════════════════════════════════════════════════════════

     # Activate specialist agent for category analysis with rich visuals
     Display:
     ╔══════════════════════════════════════════════════════════════════════╗
     ║  🤖 {category.agent.upper()} ─ Expert Analysis                               ║
     ╚══════════════════════════════════════════════════════════════════════╝

     🔍 Analyzing {category.name} requirements...

     ✅ Compliance check: [status]
     🎯 Best practices: [validation]
     ⚠️ Risk assessment: [findings]
     💡 Recommendations: [suggestions]

     🌟 Enterprise readiness score: ⭐⭐⭐⭐⭐ [X/10]

     ══════════════════════════════════════════════════════════════════════

   ```
   Update TodoWrite: "Analyze with technical-product-manager" → in_progress

   Say to user: "🏢 Analyzing enterprise requirements for comprehensive specification..."

   Activate technical-product-manager agent with opus-4-1:
   "Using your product strategy expertise, create ENTERPRISE track functional specifications:
   Discovery data: [discovery data if available]
   Business requirements: [all collected business requirements]

   CRITICAL: Do NOT mention or suggest any time frames, weeks, months, or deadlines.
   Focus only on feature scope, prioritization, and functionality.
   The user will determine timelines separately.

   For ENTERPRISE track:
   - Exhaustive user story coverage (20+)
   - Complete edge case documentation
   - Detailed acceptance criteria with regulatory compliance
   - Multiple user personas with journey mapping
   - Comprehensive business rules with decision trees
   - Feature roadmap with dependencies
   - 10+ success metrics with dashboards
   - Stakeholder requirements matrix

   Provide comprehensive functional requirements with compliance considerations.

   Provide specification as structured insights for file generation.
   DO NOT create files directly - return content for orchestrator to write."

   # Display enterprise-level analysis
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🤖 TECHNICAL PRODUCT MANAGER - ENTERPRISE Analysis
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 Comprehensive Requirements:
   • User stories: [count] with full coverage
   • Edge cases: [count] documented
   • Compliance requirements: [list]
   • User personas: [count] defined

   🎯 Feature Roadmap:
   Phase 1: [features]
   Phase 2: [features]
   Phase 3: [features]

   📈 Success Dashboard:
   [10+ metrics with monitoring strategy]

   ✅ Stakeholder Matrix:
   [Key stakeholder requirements]

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Update TodoWrite: "Analyze with technical-product-manager" → completed
   ```

5. **Generate comprehensive specification suite:**
   ```
   Update TodoWrite: "Generate enterprise specification suite" → in_progress

   # Determine output path based on target
   If target == "platform":
     output_path = {project_root}/ccu_workspace/platform/02-specification/
   If target == "module":
     output_path = {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/
   If target == "feature":
     output_path = {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/
   ```

   Say to user: "📝 Creating comprehensive ENTERPRISE specification files..."

   # Create all standard files
   Create file: {output_path}/specification.json
     Content: Complete structured specification from all agent insights

   Create file: {output_path}/spec.md
     Content: Comprehensive specification document

   Create file: {output_path}/requirements.md
     Content: agent_analysis.requirements or "# Enterprise Requirements\n\n{comprehensive functional requirements from technical-product-manager}"

   Create file: {output_path}/functional-spec.md
     Content: agent_analysis.functional_spec or "# Enterprise Functional Specification\n\n{detailed feature specifications from technical-product-manager}"

   Create file: {output_path}/business-rules.md
     Content: agent_analysis.business_rules or "# Enterprise Business Rules\n\n{validation logic and business constraints}"

   Create file: {output_path}/success-metrics.md
     Content: agent_analysis.success_metrics or "# Enterprise Success Metrics\n\n{KPIs and measurable outcomes}"

   Create file: {output_path}/user-stories.md
     Content: Comprehensive user stories with edge cases and personas

   # Create additional enterprise files
   Create file: {output_path}/01-user-stories-complete.md
     Content: Extended user stories with all scenarios from technical-product-manager

   Create file: {output_path}/02-data-entities.md
     Content: Business data model (not technical schema)

   Create file: {output_path}/03-integration-requirements.md
     Content: External system touchpoints and integration needs

   Create file: {output_path}/04-compliance-requirements.md
     Content: Compliance requirements from business analysis

   Create file: {output_path}/05-feature-roadmap.md
     Content: Phased release strategy and feature prioritization

   Create file: {output_path}/06-acceptance-criteria.md
     Content: Comprehensive testing scenarios and acceptance criteria

   Create file: {output_path}/07-compliance-documentation.md
     Content: Detailed compliance documentation from requirements analysis

   Say to user: "✅ Created comprehensive enterprise specification suite"

   Update TodoWrite: "Generate enterprise specification suite" → completed

   # Display multi-agent consensus
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🤖 MULTI-AGENT CONSENSUS - ENTERPRISE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Technical Product Manager says:
   "Strong business case with clear ROI path"

   System Architect says:
   "Architecture supports 10x scale requirements"

   Product Designer says:
   "Enterprise UI patterns properly structured"

   Consensus Points:
   ✓ Architecture aligns with business goals
   ✓ Security meets compliance requirements
   ✓ UI framework supports multi-brand needs
   ✓ Scalability proven for enterprise load

   Recommended Path Forward:
   [Unified recommendation from all agents]

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

7. **Generate Module Specifications (if target=platform):**
    ```
    Update TodoWrite: "Generate module specifications" → in_progress

    # Use modules from discovery - NEVER ask for modules again
    If DISCOVERED_MODULES && DISCOVERED_MODULES.length > 0:
      Say to user: "🏢 Generating enterprise module specifications..."

      For each module in DISCOVERED_MODULES:
        - Create: {project_root}/ccu_workspace/modules/{module.name}/02-specification/
        - Generate: {project_root}/ccu_workspace/modules/{module.name}/02-specification/specification.json
          Content: {
            "metadata": {
              "module": "{module.name}",
              "phase": "specification",
              "track": "enterprise",
              "timestamp": now(),
              "from_discovery": true
            },
            "module_context": {
              "purpose": "{module.purpose from discovery}",
              "how_it_works": "{module.how_it_works from discovery}",
              "dependencies": [detailed dependency analysis],
              "features": [10-20 features with variants]
            },
            "business_rules": {exhaustive rules with governance},
            "user_stories": [10-20 stories with edge cases],
            "success_metrics": {comprehensive KPIs with SLAs},
            "compliance": {compliance requirements},
            "compliance": {compliance requirements}
          }
        - Generate: spec.md (comprehensive module specification)
        - Generate: user-stories.md (exhaustive stories)
        - Generate: business-rules.md (complete rule set)
        - Generate: test-scenarios.md (comprehensive test coverage)
        - Generate: api-contracts.md (detailed API specs)
        - Generate: compliance-requirements.md (compliance framework)

      Say to user: "✅ Generated enterprise specs for {DISCOVERED_MODULES.length} modules"
    Else:
      Say to user: "⚠️ No modules found in discovery. Run discovery first."

    Update platform specification.json with modules array
    Update platform status.json with modules list
    Update TodoWrite: "Generate module specifications" → completed
    ```

8. **Generate Feature Specifications (if target=module):**
    ```
    Update TodoWrite: "Generate feature specifications" → in_progress

    # Use features from discovery - NEVER ask for features again
    If DISCOVERED_MODULES && current_module.features:
      Say to user: "🏢 Generating enterprise feature specifications..."

      For each feature in current_module.features:
        - Create: {project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/
        - Generate: specification.json (enterprise business rules)
        - Generate: spec.md (detailed from discovery)
        - Generate: test-scenarios.md from templates
        - Generate: e2e-scenarios.md from templates
        - Generate: status.json with initial validation state
        - Add to module's features-overview.md

      Say to user: "✅ Generated enterprise specs for {features.length} features"
    Else:
      Say to user: "⚠️ No features found in discovery for {module}"

    Update module specification.json with features array
    Update module status.json with features list
    Update TodoWrite: "Generate feature specifications" → completed
    ```

9. **Store Enterprise Specifications with Full Context:**
   ```
   # Store enterprise-grade specifications with compliance tracking
   Say to user: "💾 Storing enterprise specifications with compliance metadata..."

   # Store each module with enterprise details
   For each module in created_modules:
     mcp__mem0__add_memory(
       text: "ENTERPRISE module: {module.name} - {module.description}, " +
             "Criticality: {module.business_criticality}, " +
             "User stories: {module.user_story_count}, " +
             "Business rules: {module.business_rules}, " +
             "Compliance: {module.compliance_requirements}, " +
             "Compliance requirements: {module.compliance_requirements}, " +
             "Performance targets: {module.performance_requirements}, " +
             "Integration points: {module.integration_requirements}"
     )

   # Store enterprise architecture decisions
   mcp__mem0__add_memory(
     text: "ENTERPRISE architecture: {target} with {module_count} modules, " +
           "Compliance: {compliance_frameworks}, " +
           "Compliance: {compliance_framework}, " +
           "Architecture: {selected_architecture}, " +
           "Database: {selected_database} with HA/DR strategy, " +
           "Success metrics: {enterprise_metrics}, " +
           "Stakeholders: {stakeholder_matrix}"
   )

   # Store compliance and audit information
   mcp__mem0__add_memory(
     text: "ENTERPRISE compliance: {compliance_requirements}, " +
           "Audit readiness: {audit_checklist}, " +
           "Compliance controls: {compliance_controls}, " +
           "Data governance: {data_governance_policies}"
   )

   # Store UI/design hints for the design phase
   mcp__mem0__add_memory(
     text: "PATTERN:UI:HINTS - Target: {target}, " +
           "AppType: {discovery_data?.app_type || app_type}, " +
           "Modules: {created_modules.map(m => m.name).join(', ')}, " +
           "UserModel: enterprise/multi-tenant, " +
           "DataFocus: {primary_data_operations || 'enterprise data platform'}, " +
           "UserProfiles: {enterprise_personas?.join(', ') || 'enterprise stakeholders'}, " +
           "BusinessRules: {business_rules?.length || 'comprehensive'} enterprise rules, " +
           "Architecture: {selected_architecture}, " +
           "Compliance: {compliance_frameworks}, " +
           "Scalability: {scalability_requirements}, " +
           "ComplianceLevel: enterprise-grade, " +
           "Track: enterprise"
   )

   # Index entire codebase for enterprise context
   Say to user: "📂 Performing enterprise codebase analysis..."
   mcp__claude-context__index_codebase(
     path: "{project_root}",
     splitter: "ast",
     customExtensions: [".yaml", ".yml", ".json", ".md"],
     ignorePatterns: ["node_modules/**", "dist/**", "build/**"]
   )
   Say to user: "✅ Enterprise codebase fully indexed"

   Say to user: "✅ Enterprise specifications stored with full traceability"
   ```

10. **Create in:** Appropriate path based on target
    - Platform: `{project_root}/ccu_workspace/platform/02-specification/`
    - Module: `{project_root}/ccu_workspace/modules/{module}/02-specification/`
    - Feature: `{project_root}/ccu_workspace/modules/{module}/features/{feature}/02-specification/`

## JSON Output Structure

All tracks (except INSTANT) generate a `specification.json` with this structure:

```json
{
  "metadata": {
    "phase": "specification",
    "target": "$ARGUMENTS.target",
    "track": "$ARGUMENTS.track",
    "timestamp": "ISO-8601",
    "from_discovery": true,
    "version": "2.0"
  },
  "discovered_context": {
    "application_type": "web_app",
    "initial_concept": "expense tracking application",
    "expanded_concept": "Family expense tracking with insights",
    "modules_discovered": ["auth", "file_upload", "dashboard", "analytics"],
    "how_modules_work": {
      "user": "profile_and_authentication",
      "file_upload": "csv_and_excel_processing",
      "dashboard": "real_time_metrics",
      "analytics": "ai_powered_insights"
    }
  },
  "functional_requirements": {
    "user_stories": [
      {
        "id": "US001",
        "as_a": "user type",
        "i_want": "to perform action",
        "so_that": "achieve benefit",
        "acceptance_criteria": [
          "Given initial state",
          "When action occurs",
          "Then expected outcome"
        ]
      }
    ],
    "business_rules": [
      {
        "module": "auth",
        "rule": "Password minimum length",
        "constraint": "8 characters",
        "validation": "length >= 8"
      },
      {
        "module": "auth",
        "rule": "Session timeout",
        "constraint": "30 minutes",
        "validation": "inactivity > 30min triggers logout"
      }
    ],
    "constraints": [
      "Max file size: 10MB",
      "Session timeout: 30 minutes",
      "Password complexity: uppercase, lowercase, number, symbol"
    ],
    "success_metrics": [
      {
        "metric": "User login time",
        "target": "< 2 seconds",
        "measurement": "Time from submit to dashboard",
        "frequency": "Per login attempt"
      }
    ]
  },
  "modules": {
    "user": {
      "inherited_from_discovery": {
        "purpose": "User management and profiles",
        "how_it_works": "user_profile_management",
        "features": ["profile", "settings", "notifications", "preferences"],
        "user_workflows": {
          "login": "Enter email → Enter password → Click login → Dashboard"
        }
      },
      "specified_business_rules": {
        "data_validation_required": true,
        "input_sanitization": "strict",
        "form_validation": "client_and_server",
        "rate_limiting_requests": 100,
        "pagination_size": 25,
        "cache_ttl_seconds": 300,
        "email_verification_required": true,
        "notification_preferences": ["email", "in_app"]
      },
      "generated_user_stories": [
        {
          "title": "User Login",
          "as_a": "registered user",
          "i_want": "to access my account",
          "so_that": "I can view my dashboard",
          "acceptance_criteria": [
            "GIVEN valid credentials",
            "WHEN I submit login form",
            "THEN dashboard loads within 2 seconds",
            "AND I can access my data"
          ]
        }
      ],
      "success_metrics": [
        {
          "metric": "Login success rate",
          "target": "> 95%",
          "measurement": "Successful logins / Total attempts"
        }
      ]
    }
  }
}
```

## Key Behaviors

1. **With --from=discovery:**
   - Read `discovery-$ARGUMENTS.track.json` from previous phase
   - Pre-fill answers from discovery data
   - Reduce questions based on known information

2. **Progressive Disclosure:**
   - INSTANT: Hide all complexity details, show only final decisions
   - RAPID: Show only critical choices
   - STANDARD: Balance detail with clarity
   - ENTERPRISE: Full transparency and documentation

3. **Smart Defaults:**
   - Use discovery data when available (from discovery-$ARGUMENTS.track.json)
   - Apply industry best practices
   - Consider target type (platform/module/feature) for defaults

4. **User Safety:**
   - INSTANT track always requires explicit acceptance
   - Allow users to modify assumptions before proceeding
   - Provide clear explanations for technical choices

5. **Validation:**
   - Ensure all required information is gathered
   - Validate technical feasibility of choices
   - Check for conflicts or incompatibilities

## Output Messages

Upon completion, provide clear next steps:

**ALL TRACKS (Platform):**
```
✅ Specification created: {project_root}/ccu_workspace/platform/02-specification/
📁 Files generated:
  - specification.json
  - spec.md (human-readable specification)
  - test-scenarios.md  - e2e-scenarios.md  - status.json (designment tracking)
Modules created: [list of modules] in {project_root}/ccu_workspace/modules/
Track: $ARGUMENTS.track
Next: /ccu:design --target=platform --track=$ARGUMENTS.track
```

**ALL TRACKS (Module):**
```
✅ Module specification created: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/
📁 Files generated:
  - specification.json
  - spec.md
  -   -   - status.json
Features created: [list of features] in features/
Track: $ARGUMENTS.track
Next: /ccu:design --target=module --module=$ARGUMENTS.module --track=$ARGUMENTS.track
```

**ALL TRACKS (Feature):**
```
✅ Feature specification created: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/
📁 Files generated:
  - specification.json
  - spec.md
  -   -   - status.json
Parent module: $ARGUMENTS.module
Track: $ARGUMENTS.track
Next: /ccu:design --target=feature --module=$ARGUMENTS.module --feature=$ARGUMENTS.feature --track=$ARGUMENTS.track
```

## Error Handling

- If `--from=discovery` but no discovery-$ARGUMENTS.track.json exists:
  ```
  ERROR: No discovery found for $ARGUMENTS.target with track $ARGUMENTS.track
  Expected file:
    Platform: {project_root}/ccu_workspace/platform/01-discovery/discovery-$ARGUMENTS.track.json
    Module: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/01-discovery/discovery-$ARGUMENTS.track.json
    Feature: {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/01-discovery/discovery-$ARGUMENTS.track.json
  Run first: /ccu:discover --target=$ARGUMENTS.target --track=$ARGUMENTS.track
  Or remove --from parameter to start fresh
  ```

- If required parameters missing:
  ```
  ERROR: Module name required for target=module
  Usage: /ccu:specify --target=module --module=<name> --track=<track>
  ```

## Next Steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT PHASE:

**Phase 3: Design** ⭐ RECOMMENDED
`/ccu:design --target=$ARGUMENTS.target --track=$ARGUMENTS.track --from=specification`
→ Create UX/UI designs, user flows, and interaction patterns

📋 Alternative Options:
- **Phase 4: Security** (if high-risk application)
  `/ccu:security --target=$ARGUMENTS.target --track=$ARGUMENTS.track --from=specification`
  → Perform security assessment early if dealing with sensitive data

- **Phase 5: Architect** (if skipping visual design)
  `/ccu:architect --target=$ARGUMENTS.target --track=$ARGUMENTS.track --from=specification`
  → Jump to technical architecture if UI is not a priority

⚠️ Note: Following the sequential phases ensures comprehensive coverage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remember: This command is part of the 7-phase engineering process:
discover → **specify** → design → security → architect → plan → design