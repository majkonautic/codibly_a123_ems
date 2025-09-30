---
description: Phase 6 - Technical execution planning and task sequencing
activates: solution-architect
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=architect] [--cascade=true]
---

# Plan Command - Phase 6: Technical Execution Planning

This is **Phase 6** of the 7-phase development process. The plan phase synthesizes all previous insights to create comprehensive technical execution plans, confirming HOW things will be built with optimal task sequences and testing strategies.

Generate AI-synthesized development plan for **$ARGUMENTS.target** at **$ARGUMENTS.track** level.

## Command Syntax

```bash
/ccu:plan --target=platform|module|feature --track=instant|rapid|standard|enterprise [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Scope of planning
- `--track=instant|rapid|standard|enterprise` - Development track complexity
- `--module=<name>` - Required when target=module or feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=architect` - Load architecture decisions from previous phase
- `--cascade=true|false` - Auto-generate child plans (default: true)
- `--interactive=true|false` - Enable interactive mode (default: false for instant)
- `--pattern=<type>` - Force specific planning pattern

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking**
   - When: Breaking down complex implementation tasks
   - Purpose: Generate optimal task sequences and dependencies
   - Usage:
   ```
   mcp__sequential-thinking__sequentialthinking(
     thought: "Breaking down implementation of [module] into tasks...",
     nextThoughtNeeded: true,
     thoughtNumber: 1,
     totalThoughts: 10
   )
   ```
   - Track specifics: RAPID (3-5 breakdowns), STANDARD (5-8), ENTERPRISE (10-15)

2. **Tool: mcp__mem0__search_memory**
   - When: Finding successful planning patterns
   - Purpose: Reuse proven task sequences
   - Usage:
   ```
   mcp__mem0__search_memory(
     query: "development plan for [architecture] [scale] [tech stack]"
   )
   ```

3. **Tool: mcp__mem0__add_memory**
   - When: After creating successful plans
   - Purpose: Store planning patterns
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "Successful plan: [modules] in [sequence] with [test strategy]"
   )
   ```

4. **Tool: mcp__context7__get-library-docs**
   - When: Planning implementation details
   - Purpose: Get implementation guides
   - Usage:
   ```
   mcp__context7__get-library-docs(
     context7CompatibleLibraryID: "/vercel/next.js",
     topic: "deployment" | "testing" | "performance",
     tokens: 5000
   )
   ```

5. **Tool: mcp__claude-context__index_codebase**
   - When: Planning for existing codebase
   - Purpose: Map current implementation
   - Usage:
   ```
   mcp__claude-context__index_codebase(
     path: "/absolute/path/to/project",
     splitter: "ast"
   )
   ```

6. **Tool: mcp__claude-context__search_code**
   - When: Finding integration points
   - Purpose: Identify dependencies and conflicts
   - Usage:
   ```
   mcp__claude-context__search_code(
     path: "/absolute/path/to/project",
     query: "import [module]" | "dependency" | "integration"
   )
   ```

7. **Tool: mcp__playwright__browser_navigate**
   - When: Setting up test scenarios
   - Purpose: Plan E2E test flows
   - Usage:
   ```
   mcp__playwright__browser_navigate(
     url: "http://localhost:3000"
   )
   ```

8. **Tool: mcp__playwright__browser_snapshot**
   - When: Documenting test requirements
   - Purpose: Capture UI states for test planning
   - Usage:
   ```
   mcp__playwright__browser_snapshot()
   ```

### Playwright MCP Test Integration

**CRITICAL for all tracks:**
```
# Check Playwright MCP availability
mcp__playwright__browser_navigate(
  url: "http://localhost:3000"
)

# Plan test suites for each module
For each module:
  - Unit tests: 5-10 per module
  - Integration tests: 3-5 per module
  - E2E tests: 1-3 critical paths
  - Test command: mcp__playwright__browser_* tools
```

### MCP Usage by Track

**INSTANT Track:**
- Minimal MCP, focus on speed
- Only critical mcp__playwright__ for test setup

**RAPID Track:**
- mcp__mem0__search_memory for patterns
- mcp__sequential-thinking__sequentialthinking for task breakdown
- mcp__playwright__ tools for test planning

**STANDARD Track:**
- All RAPID tools plus:
- mcp__claude-context__search_code for dependencies
- mcp__context7__get-library-docs for implementation
- Multiple mcp__sequential-thinking__sequentialthinking

**ENTERPRISE Track:**
- All STANDARD tools plus:
- mcp__claude-context__index_codebase for full analysis
- Extensive mcp__playwright__ test planning
- Deep dependency analysis with all tools

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

## Pre-execution Validation

### Visual Progress Header
```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 PLAN GENERATION - $ARGUMENTS.track TRACK    [0% ░░░░░░░░░░]     │
└─────────────────────────────────────────────────────────────────────┘

Todos:
☑ Load context from all phases
☐ Define development phases
☐ Analyze with solution-architect
☐ Generate development plan
```

### MCP Playwright Detection
```
Load helper: helpers/mcp-playwright-detector

If MCP_PLAYWRIGHT_AVAILABLE:
  Say: "✅ MCP Playwright server detected - will generate optimized test commands"
  Set TEST_RUNNER = "mcp"

  Display:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧪 PLAYWRIGHT MCP STATUS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCP Server:       ✅ Connected
  Test Runner:      mcp://playwright/
  Parallel Tests:   ✅ Enabled
  Browser Engines:  Chromium, Firefox, WebKit
  Test Location:    tests/e2e/

  Mandatory Gates:
  ✓ After EACH module completion
  ✓ Zero tolerance for 404 errors
  ✓ All CRUD operations must work
  ✓ Data persistence must be verified
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```

Elif LOCAL_PLAYWRIGHT_AVAILABLE:
  Say: "⚠️ Using local Playwright - will use npx commands"
  Set TEST_RUNNER = "local"

  Display:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧪 PLAYWRIGHT STATUS (Local)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCP Server:       ❌ Not Available
  Test Runner:      npx playwright test
  Fallback Mode:    ✅ Active
  Test Location:    tests/e2e/

  Mandatory Gates:
  ✓ After EACH module completion
  ✓ Zero tolerance for 404 errors
  ✓ All CRUD operations must work
  ✓ Data persistence must be verified
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```

Else:
  Say: "⚠️ No Playwright detected - test planning will be limited"
  Set TEST_RUNNER = "none"

  Display:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️ PLAYWRIGHT NOT DETECTED
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Please install Playwright MCP server for optimal testing:

  npm install -g @playwright/mcp

  Or install locally:
  npm install --save-dev @playwright/test
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```
```

1. **Check for --from parameter:**
   - If `--from=architect` is provided:
     Say to user: "📂 Loading architecture data from previous phase..."
     - If target=platform:
       load `{project_root}/ccu_workspace/platform/05-architecture/tech-stack.json`
       Say to user: "✅ Platform architecture loaded: {tech_stack.primary_language}, {len(tech_stack.frameworks)} frameworks"
     - If target=module:
       load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/05-architecture/tech-stack.json`
       Say to user: "✅ Module architecture loaded: {module_name} with {len(components)} components"
     - If target=feature:
       load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/05-architecture/tech-stack.json`
       Say to user: "✅ Feature architecture loaded: {feature_name} implementation details"
   - Load ALL previous phase outputs for comprehensive planning

2. **Validate target scope:**
   - For `--target=module`: Require `--module=<name>` parameter
   - For `--target=feature`: Require both `--module=<name>` and `--feature=<name>` parameters

3. **Set working paths based on target:**
   - Platform: `{project_root}/ccu_workspace/platform/`
   - Module: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/`
   - Feature: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/`

## Orchestration Strategy Decision

### Complexity Analysis and Execution Strategy
```
# Load orchestration templates for intelligent planning
Load templates/orchestration/complexity-rules.yaml
Load templates/orchestration/patterns.yaml
Load templates/orchestration/wave-templates.yaml
Load templates/orchestration/monitoring-config.yaml

# Analyze project complexity
complexity_score = calculate_complexity_score({
  modules: specification.modules.length,
  effort_hours: architecture.estimated_effort,
  files_to_change: architecture.file_count,
  architecture_changes: architecture.requires_refactoring,
  compliance_required: security.compliance_level,
  performance_critical: specification.performance_requirements
})

# Determine complexity level
If complexity_score < 30:
  complexity_level = "LIGHT"
  recommended_execution = "sequential"
  Say: "📊 Complexity: LIGHT - Single agent sequential execution recommended"
Elif complexity_score < 200:
  complexity_level = "STANDARD"
  recommended_execution = "parallel"
  Say: "📊 Complexity: STANDARD - Parallel agent orchestration recommended (2.5x faster)"
Else:
  complexity_level = "DEEP"
  recommended_execution = "multi_wave_parallel"
  Say: "📊 Complexity: DEEP - Multi-wave parallel execution recommended (3x faster)"
```

## AI Synthesis Engine

Before any planning, AI synthesizes all previous phase outputs:

### Claude Context Initialization
```
# Check for existing codebase
If exists("{project_root}/src") or exists("{project_root}/app"):
  Say: "🔍 Existing codebase detected - initializing Claude Context MCP"

  # Initialize Claude Context
  mcp://claude-context/init --project={project_root}

  # Analyze existing patterns
  existing_analysis = mcp://claude-context/analyze --type=all

  Display:
  ```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Existing Code:    ████████████████████ 100% ✅
  Pattern Analysis: ████████████████████ 100% ✅
  Reusable Found:   ████████████████████ 100% ✅
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ```
Else:
  Say: "📦 Greenfield project - starting fresh"
```

### Context-Aware Synthesis
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Loading Context:  ████████████████████ 100% ✅
AI Analysis:      ████████████░░░░░░░░ 60% 🔄
Pattern Matching: ████████░░░░░░░░░░░░ 40% 🔄
Plan Generation:  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**AI Analyzes**:
1. **Existing Code**: Components, modules, and patterns already implemented
2. **Architecture Pattern**: Monolith vs Modular vs Microservices
3. **Tech Stack**: Frameworks, databases, services detected
4. **Module Structure**: Dependencies and relationships
5. **Security Requirements**: Auth methods, compliance needs
6. **Integration Points**: APIs, external services, payments
7. **Reusable Components**: Existing code that can be leveraged

**AI Generates**:
- Optimal build sequence based on dependencies
- Module breakdown with clear boundaries
- Identification of reusable existing components (via Claude Context)
- New vs Modified components list
- Test requirements per phase with MCP commands
- Test gates between development phases
- Docker configuration templates
- CI/CD pipeline recommendations
- Environment-specific configurations
- Playwright test scenarios for each module
- Integration plan for existing codebase (if applicable)

## Track-Based Planning Process

### 🚀 INSTANT Track
**If track is "instant":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load all phase outputs"
   - "Generate single-phase plan"
   - "Create task list"
   ```

2. **Load context:**
   ```
   Update TodoWrite: "Load all phase outputs" → in_progress

   Say to user: "🚀 INSTANT MODE: AI-powered plan generation - zero questions"

   Display:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Context Load:     ████████████████████ 100% ✅
   AI Synthesis:     ████████████████████ 100% ✅
   Plan Generation:  ████████████████████ 100% ✅
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Load:
   - specification.json (extract modules[] array)
   - design-system.json
   - security-config.json
   - tech-stack.json

   # Extract modules for later use
   modules = specification.json.modules || []
   Say to user: "📦 Detected {modules.length} modules to plan"

   Update TodoWrite: "Load all phase outputs" → completed
   ```

3. **Generate plan:**
   ```
   Update TodoWrite: "Generate single-phase plan" → in_progress

   # INSTANT = Single phase with integrated testing
   Create plan:
   - Phase 1: Complete Implementation
     - Setup
     - Core implementation
     - Basic tests
     - MCP Playwright smoke test
       If TEST_RUNNER == "mcp":
         Command: mcp://playwright/run --suite=smoke --browsers=chromium
       Elif TEST_RUNNER == "local":
         Command: npx playwright test tests/smoke/*.spec.ts
       Else:
         Skip with warning

   # Show what was generated
   Say to user: ""
   Say to user: "📋 AI-Generated Plan Preview:"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "Single-phase implementation:"
   Say to user: "  • Total tasks: {task_count}"
   Say to user: "  • Estimated duration: {duration}"
   Say to user: "  • Test requirements: Smoke tests only"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   Update TodoWrite: "Generate single-phase plan" → completed
   ```

4. **Generate detailed module breakdown:**
   ```
   Update TodoWrite: "Generate module breakdown" → in_progress

   # Load architecture to understand components
   architecture = Load architecture.json from 05-architecture/

   # Check for existing implementations using Claude Context
   If exists("{project_root}/src") or exists("{project_root}/app"):
     existing_modules = mcp://claude-context/analyze --type=modules
     reusable_components = mcp://claude-context/suggest --type=reusable
   Else:
     existing_modules = []
     reusable_components = []

   # For INSTANT track: minimal breakdown
   modules = identify_core_modules(architecture)

   For each module:
     # Check if module already exists
     If module in existing_modules:
       - Mark as "existing - needs integration"
       - List required modifications
     Else:
       - Mark as "new - needs creation"
       - List files to create
       - Define main functions

     # Always specify test requirements
     - Specify test requirements
     - Identify reusable components from existing code

   Update TodoWrite: "Generate module breakdown" → completed
   ```

5. **Create output:**
   ```
   Update TodoWrite: "Create task list" → in_progress

   Create directory: {path}/06-development-plan/
   Generate:
   - implementation-plan.json (with test gates)
   - module-breakdown/ (directory)
     FOR EACH module in modules:
       - {module.name}-module.md (detailed implementation guide)
       - {module.name}-test-plan.json (test strategy and counts)
   - execution-order.md (dependencies and sequence)
   - task-list.md (5-10 tasks with test checkpoints)
   - test-strategy.md (overall testing approach)
   - test-planning/ (directory)
     FOR EACH module in modules:
       - {module.name}-test-plan.json with:
         {
           "module": "{module.name}",
           "type": "backend|frontend|fullstack",
           "test_counts": {
             "unit": 3,  // minimal for INSTANT
             "integration": 2,
             "e2e": 1
           },
           "coverage_target": "60%",
           "test_gates": ["smoke"],
           "scenarios": ["basic_flow"]
         }
   - verification-checklist.md (how to verify working)
   - playwright-tests/ (generated test files)
     - smoke/app-running.spec.ts
     - smoke/health-check.spec.ts
     FOR EACH module in modules:
       - module-tests/{module.name}.spec.ts

   Update TodoWrite: "Create task list" → completed
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Define development phases"
   - "Analyze with solution-architect"
   - "Generate development plan"
   ```

2. **Load modules and analyze for orchestration:**
   ```
   # Load modules from specification
   Load specification.json
   modules = specification.modules || []
   Say to user: "📦 Detected {modules.length} modules to plan"

   # Calculate time estimates
   sequential_time = modules.length * 15  # 15 minutes per module sequential
   parallel_time = Math.ceil(modules.length / 3) * 10 + 10  # Waves of 3 agents
   time_savings = Math.round((1 - parallel_time / sequential_time) * 100)

   Say to user: "⏱️ Time Analysis:"
   Say to user: "  • Sequential execution: ~{sequential_time} minutes"
   Say to user: "  • Parallel execution: ~{parallel_time} minutes ({time_savings}% faster!)"
   Say to user: ""

   Update TodoWrite: "Define development phases" → in_progress

   Display:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Context Load:     ████████████████████ 100% ✅
   AI Synthesis:     ████████████████████ 100% ✅
   Orchestration:    ████████████████████ 100% ✅
   Questions:        [0/1]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   # Load orchestration questions from templates
   Load templates/plan/orchestration-questions.yaml
   Load RAPID track questions (1 question):

   Questions loaded dynamically from:
   ccu_framework/templates/plan/orchestration-questions.yaml

   Display orchestration question:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 EXECUTION STRATEGY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Based on your {modules.length} modules, how should we execute development?

     a) Sequential Module Development (/ccu:develop)
        • Build each module one at a time
        • Single agent carries full context
        • Easier debugging and iteration
        • Total time: ~{sequential_time} minutes
        • Best for: Learning, debugging, simple projects
        📝 Command: /ccu:develop

     b) Parallel Agent Orchestration (/ccu:deliver) [RECOMMENDED]
        • Multiple specialist agents work simultaneously
        • 3 agents per wave, {Math.ceil(modules.length/3)} waves total
        • Each agent has isolated 200k token context
        • Total time: ~{parallel_time} minutes ({time_savings}% faster!)
        • Best for: Speed, quality, production projects
        ⚡ Command: /ccu:deliver

     c) Hybrid Approach (/ccu:deliver --mode=hybrid)
        • Critical path sequential, rest parallel
        • Balance of speed and safety
        • Total time: ~{(sequential_time + parallel_time) / 2} minutes
        • Best for: Complex dependencies, phased rollout
        🔀 Command: /ccu:deliver --mode=hybrid

   AI Recommendation: Based on complexity {complexity_level}
   ✅ Recommended: (b) Parallel Agent Orchestration - {time_savings}% faster execution

   Your choice:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Plan approach (based on selection):
   - Module-by-module: Playwright MCP tests after EACH module
     Test Gates: MANDATORY mcp://playwright/run --suite={level} --module={name}
     Must achieve 100% pass rate before proceeding
   - Two-phase: Playwright tests after each phase completion
     Test Gates: mcp://playwright/run --suite=smoke,features --phase={num}
     Higher risk of cascading failures
   - Feature-vertical: E2E Playwright tests after each feature stack
     Test Gates: mcp://playwright/run --suite=e2e --feature={name}
     Complete validation of user journeys

   Update TodoWrite: "Define development phases" → completed
   ```

3. **Activate solution-architect agent:**
   ```
   Update TodoWrite: "Analyze with solution-architect" → in_progress

   Say to user: ""
   Say to user: "🤖 Activating solution-architect agent..."
   Say to user: "📋 Analyzing all phase outputs:"
   Say to user: "  • Specification: ✅ Loaded"
   Say to user: "  • Design: ✅ Loaded"
   Say to user: "  • Security: ✅ Loaded"
   Say to user: "  • Architecture: ✅ Loaded"
   Say to user: ""
   Say to user: "🔧 Solution architect is now generating:"
   Say to user: "  • Detailed module breakdowns"
   Say to user: "  • Implementation specifications"
   Say to user: "  • Dependency mapping"
   Say to user: "  • Test requirements"
   Say to user: ""

   Display progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Agent Analysis:   ████████████░░░░░░░░ 60% 🔄
   Module Planning:  ████████░░░░░░░░░░░░ 40% 🔄
   Test Generation:  ████░░░░░░░░░░░░░░░░ 20% 🔄
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Activate solution-architect agent:
   "Create RAPID development plan for {target}.
   Context: [all phase outputs]
   Architecture: [loaded architecture.json]
   Approach: [collected preferences]
   Testing: Playwright MCP at level {selected_test_level}

   Provide:
   - Module breakdown with specific implementations:
     * Auth module: login(), register(), resetPassword() functions
       → Playwright test: mcp://playwright/run --suite=smoke,features --module=auth
     * Dashboard module: fetchData(), renderCharts() components
       → Playwright test: mcp://playwright/run --suite=smoke,features --module=dashboard
     * API module: all endpoints with request/response specs
       → Playwright test: mcp://playwright/run --suite=smoke,features --module=api
   - Execution order based on dependencies
   - MANDATORY Playwright MCP test gates after each module
   - Specific MCP commands for each test gate
   - Verification steps to ensure no 404s (zero tolerance)
   - Task breakdown (15-20 tasks) with embedded test points
   - Time estimates including test execution
   - Risk mitigation through continuous testing"

   Display detailed module plan

   Say to user: ""
   Say to user: "✅ Solution architect analysis complete!"
   Say to user: "📊 Generated {modules.length} detailed module plans"
   Say to user: ""

   # Show preview of what was generated
   Say to user: "📋 Solution Architect Output Preview:"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   For first 2 modules:
     Say to user: "Module: {module.name}"
     Say to user: "  • Duration: {module.duration}"
     Say to user: "  • Dependencies: {module.dependencies}"
     Say to user: "  • Test requirements: {module.tests}"
     Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   Update TodoWrite: "Analyze with solution-architect" → completed
   ```

4. **Generate detailed plan with module breakdown and orchestration:**
   ```
   Update TodoWrite: "Generate development plan" → in_progress

   # Generate orchestration plan if parallel execution selected
   If user_selection == "parallel" or user_selection == "hybrid":
     Generate orchestration-plan.json:
     {
       "execution_strategy": "parallel",
       "complexity": "{complexity_level}",
       "estimated_times": {
         "sequential": {sequential_time},
         "parallel": {parallel_time},
         "savings_percentage": {time_savings}
       },
       "waves": [
         {
           "wave_number": 1,
           "name": "Planning & Specification",
           "duration_minutes": 10,
           "agents": [
             "technical-product-manager",
             "product-designer",
             "solution-architect"
           ],
           "execution": "parallel",
           "outputs": ["requirements.md", "ux-design.md", "technical-approach.md"]
         },
         {
           "wave_number": 2,
           "name": "Implementation",
           "duration_minutes": 20,
           "agents": [
             "backend-developer",
             "frontend-developer",
             "quality-engineer"
           ],
           "execution": "parallel",
           "outputs": ["api/", "ui/", "tests/"]
         },
         {
           "wave_number": 3,
           "name": "Integration & Review",
           "duration_minutes": 10,
           "agents": ["solution-architect"],
           "execution": "sequential",
           "outputs": ["integration-report.md"]
         }
       ],
       "checkpoint_config": {
         "frequency_minutes": 5,
         "location": "ccu_workspace/07-execution-checkpoints/",
         "preserve_on_failure": true
       },
       "monitoring": {
         "health_check_interval": 30,
         "stuck_detection_seconds": 120,
         "auto_restart": true,
         "max_restarts": 3
       },
       "command": "/ccu:deliver --target={target} --track={track}"
     }

     Say to user: ""
     Say to user: "✅ Parallel orchestration plan generated!"
     Say to user: "📊 Execution will use {total_agents} specialist agents in {waves.length} waves"
     Say to user: "⚡ Time savings: {time_savings}% compared to sequential"
     Say to user: ""

   Create directory: {path}/06-development-plan/
   Generate:
   - implementation-plan.json (master plan with exact steps)
   - orchestration-plan.json (if parallel execution selected)
   - module-breakdown/
     FOR EACH module in modules:
       - {module.name}-module.md with:
         * Implementation details
         * File structure
         * Dependencies to install
         * API endpoints
         * Database schema
         * UI components
         * Success criteria
       - {module.name}-test-plan.json with:
         * Test counts by type (unit/integration/e2e)
         * Coverage targets
         * Test scenarios
         * Test gates and checkpoints
   - execution-order.md (dependency graph, build sequence)
   - phase-1-tasks.md (with test checkpoints)
   - phase-2-tasks.md (with test requirements)
   - test-gates.md (what to test after each module)
   - verification-checklist.md (how to verify no 404s)
   - dependencies.md
   - test-strategy.md (phased test approach)
   - risk-register.md
   - playwright-tests/
     - smoke/*.spec.ts
     - features/*.spec.ts
     - module-tests/
       FOR EACH module in modules:
         - {module.name}.spec.ts
   - test-commands.md (MCP and fallback commands)

   Update TodoWrite: "Generate development plan" → completed
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Plan development phases"
   - "Define task dependencies"
   - "Plan testing strategy"
   - "Analyze with solution-architect"
   - "Generate comprehensive plan"
   ```

2. **Load modules and orchestration analysis:**
   ```
   # Load modules from specification
   Load specification.json
   modules = specification.modules || []
   Say to user: "📦 Detected {modules.length} modules for comprehensive planning"

   # Calculate orchestration benefits
   sequential_time = modules.length * 20  # 20 min per module for STANDARD
   waves_needed = Math.ceil(modules.length / 3) + 2  # Implementation waves + planning/review
   parallel_time = waves_needed * 15  # 15 min per wave average
   time_savings = Math.round((1 - parallel_time / sequential_time) * 100)

   # Determine optimal wave pattern
   If modules.length <= 3:
     recommended_pattern = "core_trio"
     agent_count = 6
   Elif modules.length <= 6:
     recommended_pattern = "implementation_wave"
     agent_count = 8
   Else:
     recommended_pattern = "enterprise_comprehensive"
     agent_count = 10

   Say to user: "🎯 Orchestration Analysis:"
   Say to user: "  • Complexity: STANDARD ({modules.length} modules)"
   Say to user: "  • Sequential time: ~{sequential_time} minutes"
   Say to user: "  • Parallel time: ~{parallel_time} minutes"
   Say to user: "  • Time savings: {time_savings}% with parallel execution"
   Say to user: "  • Recommended: {recommended_pattern} pattern"
   Say to user: ""

   Display:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Context Load:     ████████████████████ 100% ✅
   AI Synthesis:     ████████████████████ 100% ✅
   Orchestration:    ████████████████████ 100% ✅
   Questions:        [0/2]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   # Load orchestration questions for STANDARD track
   Load templates/plan/orchestration-questions.yaml

   Display questions in clean format:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 EXECUTION STRATEGY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Complexity detected: STANDARD ({complexity_score} points)
   Modules: {modules.length} | Estimated effort: {effort_hours} hours

   How should we orchestrate the development?

     a) Traditional Sequential (/ccu:develop)
        • Module-by-module development
        • Single context thread
        • Time: ~{sequential_time} minutes
        • Risk: Lower (easier to debug)

     b) Core Trio Pattern (/ccu:deliver) [RECOMMENDED]
        • Wave 1: Product Manager + Designer + Architect (parallel)
        • Wave 2: Backend + Frontend + QA (parallel)
        • Wave 3: Integration & Review
        • Time: ~{parallel_time} minutes ({time_savings}% faster!)
        • Risk: Managed (checkpoints every 5 min)
        ⚡ Best for production speed

     c) Custom Wave Configuration
        • Define your own wave structure
        • Choose specific agents per wave
        • Full control over parallelization

   AI Recommendation: (b) Core Trio Pattern - Proven {time_savings}% speed improvement

   Your choice:

   ────────────────────────────────────────────────────────────────────

   📊 WAVE CONFIGURATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   How should we structure the execution waves?

     a) Standard 3-Wave Pattern [DEFAULT]
        Wave 1: Planning (10 min) - PM, Designer, Architect
        Wave 2: Implementation (20 min) - Backend, Frontend, QA
        Wave 3: Integration (10 min) - Architect review

     b) Compressed 2-Wave Pattern
        Wave 1: Planning + Backend (15 min)
        Wave 2: Frontend + Testing + Integration (15 min)

     c) Extended 4-Wave Pattern
        Wave 1: Deep Planning (15 min)
        Wave 2: Core Development (20 min)
        Wave 3: Testing & Review (15 min)
        Wave 4: Polish & Documentation (10 min)

   Your choice:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

3. **Development phases (multi-phase):**
   ```
   Update TodoWrite: "Plan development phases" → in_progress

   # Analyze existing code with Claude Context
   If exists("{project_root}/src") or exists("{project_root}/app"):
     existing_analysis = mcp://claude-context/analyze --type=all
     completed_features = existing_analysis.implemented
     partial_features = existing_analysis.partial
     missing_features = existing_analysis.missing

     Say: "🔍 Claude Context Analysis:"
     Say: "  ✅ Already implemented: {len(completed_features)} features"
     Say: "  ⚠️  Partially complete: {len(partial_features)} features"
     Say: "  📝 Need to implement: {len(missing_features)} features"
   Else:
     completed_features = []
     partial_features = []
     missing_features = specification.features

   # Adjust phases based on existing code
   Plan 3-4 phases:
   1. Foundation (infrastructure, setup) - skip if exists
   2. Core Features (business logic) - focus on missing
   3. Integration (APIs, services) - enhance existing
   4. Polish (UI, testing, optimization)

   Ask about:
   - Phase priorities
   - Parallel work streams
   - Critical path items
   - Iteration strategy

   Update TodoWrite: "Plan development phases" → completed
   ```

3. **Task dependencies:**
   ```
   Update TodoWrite: "Define task dependencies" → in_progress

   Map:
   - Task relationships
   - Blocking dependencies
   - Parallel opportunities
   - Critical path
   - Resource requirements

   Update TodoWrite: "Define task dependencies" → completed
   ```

4. **Testing strategy:**
   ```
   Update TodoWrite: "Plan testing strategy" → in_progress

   Plan:
   - Unit test coverage (target %)
   - Integration test points
   - E2E test scenarios with Playwright
     If TEST_RUNNER == "mcp":
       - mcp://playwright/run --suite=e2e --module={module}
       - mcp://playwright/results --include-screenshots=true
     Else:
       - npx playwright test e2e/{module}/*.spec.ts
   - Performance benchmarks
   - Security testing
   - Accessibility testing

   Update TodoWrite: "Plan testing strategy" → completed
   ```

5. **Activate solution-architect agent:**
   ```
   Update TodoWrite: "Analyze with solution-architect" → in_progress

   Say to user: ""
   Say to user: "🤖 Activating solution-architect agent for comprehensive planning..."
   Say to user: "🔍 Deep analysis in progress:"
   If architecture loaded:
     Say to user: "  • Architecture pattern: {architecture.pattern}"
     Say to user: "  • Tech stack: {architecture.stack}"
     Say to user: "  • Module dependencies: Mapping..."
   If existing_modules found:
     Say to user: "  • Existing code: {existing_modules.length} modules found"
     Say to user: "  • Reusable components: {reusable_components.length} identified"
   Say to user: ""
   Say to user: "📐 Solution architect is creating:"
   Say to user: "  • Complete module specifications"
   Say to user: "  • API contracts with examples"
   Say to user: "  • Database queries and models"
   Say to user: "  • Quality gates and milestones"
   Say to user: ""

   Display progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Agent Analysis:   ████████████████░░░░ 80% 🔄
   Module Planning:  ████████████░░░░░░░░ 60% 🔄
   Test Strategy:    ████████░░░░░░░░░░░░ 40% 🔄
   Documentation:    ████░░░░░░░░░░░░░░░░ 20% 🔄
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Activate solution-architect agent:
   "Create STANDARD development plan for {target}.
   Architecture: [loaded architecture.json]
   Phases: [defined phases]
   Dependencies: [mapped dependencies]
   Testing: [test strategy]

   Deliver:
   - Complete module breakdown:
     * Each module's files, functions, endpoints
     * Component specifications with props/state
     * API contracts with examples
     * Database queries and models
   - Execution sequence with test gates:
     * Build Module A → Test A → Fix A → Verify A
     * Build Module B → Test B → Fix B → Verify B
   - Verification for each module (no 404s, all routes work)
   - Detailed WBS (50+ tasks)
   - Resource allocation
   - Risk management plan
   - Quality gates
   - Milestone definitions"

   Display comprehensive module-by-module plan

   Say to user: ""
   Say to user: "✅ Solution architect analysis complete!"
   Say to user: "📊 Generated comprehensive plan with {tasks.length} tasks"
   Say to user: ""

   # Show preview of what was generated
   Say to user: "📋 Solution Architect Output Preview:"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   For first 3 modules:
     Say to user: "Module: {module.name}"
     Say to user: "  • Implementation tasks: {module.task_count}"
     Say to user: "  • API endpoints: {module.api_count}"
     Say to user: "  • Components: {module.component_count}"
     Say to user: "  • Test requirements: {module.test_count}"
     Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   Update TodoWrite: "Analyze with solution-architect" → completed
   ```

6. **Generate comprehensive plan:**
   ```
   Update TodoWrite: "Generate comprehensive plan" → in_progress

   Create directory: {path}/06-development-plan/
   Generate:
   - implementation-plan.json (master execution plan)
   - module-breakdown/
     FOR EACH module in modules:
       - {module.name}/ (subdirectory per module)
         - overview.md (module architecture)
         - implementation.md (step-by-step guide)
         - api-spec.md (endpoints and contracts)
         - database.md (schemas and queries)
         - ui-components.md (component specifications)
         - test-plan.json (comprehensive test strategy):
           {
             "module": "{module.name}",
             "type": "[from specification]",
             "complexity": "[analyzed]",
             "test_counts": {
               "unit": [15-25 for STANDARD],
               "integration": [10-15 for STANDARD],
               "e2e": [5-10 for STANDARD]
             },
             "coverage_target": "80%",
             "test_types": ["unit", "integration", "e2e", "performance"],
             "test_gates": [
               "pre-commit", "module-complete",
               "integration-ready", "release-ready"
             ]
           }
         - integration.md (how it connects to other modules)
   - execution-order.md (detailed dependency graph)
   - work-breakdown-structure/
   - phases/ (detailed phase plans with test gates)
     - phase-1-foundation.md (auth module + test gate)
     - phase-2-core.md (dashboard module + test gate)
     - phase-3-integration.md (api integration + E2E tests)
     - phase-4-polish.md (optimization + full test suite)
   - test-gates/
     - module-gates.md (test after each module)
     - integration-gates.md (test module interactions)
     - system-gates.md (full system tests)
   - verification/
     - route-checklist.md (all routes that must work)
     - api-checklist.md (all endpoints to verify)
     - ui-checklist.md (all components to test)
   - dependencies/ (dependency graphs)
   - testing/
     - test-pyramid.md
     - playwright-tests/ (module-specific tests)
     - mcp-commands.md (if MCP available)
     - fix-feedback-loop.md (how to fix when tests fail)
   - milestones.md
   - critical-path.md
   - resource-plan.md
   - quality-gates.md
   - risk-mitigation.md

   Update TodoWrite: "Generate comprehensive plan" → completed
   ```

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Define program structure"
   - "Plan release strategy"
   - "Define governance model"
   - "Plan team allocation"
   - "Analyze with solution-architect"
   - "Analyze with other specialists"
   - "Generate enterprise program plan"
   ```

2. **Load modules and ask questions:**
   ```
   # Load modules from specification
   Load specification.json
   modules = specification.modules || []
   Say to user: "📦 Detected {modules.length} modules for enterprise planning"

   Display:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Context Load:     ████████████████████ 100% ✅
   AI Synthesis:     ████████████████████ 100% ✅
   Enterprise Prep:  ████████████████████ 100% ✅
   Questions:        [0/X]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Display questions in clean format:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏢 ENTERPRISE PLANNING - PROGRAM STRUCTURE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   [Questions presented in clean format similar to rapid]
   ```

3. **Program structure:**
   ```
   Update TodoWrite: "Define program structure" → in_progress

   # Deep analysis with Claude Context for enterprise
   If exists("{project_root}/src") or exists("{project_root}/app"):
     # Comprehensive codebase analysis
     mcp://claude-context/init --project={project_root} --mode=deep

     codebase_report = mcp://claude-context/analyze --type=enterprise

     Display codebase_report:
     - Total LOC: {codebase_report.lines_of_code}
     - Complexity score: {codebase_report.complexity}
     - Technical debt: {codebase_report.tech_debt}
     - Architecture patterns: {codebase_report.patterns}
     - Integration points: {codebase_report.integrations}
     - Security concerns: {codebase_report.security_issues}

     # Suggest refactoring opportunities
     refactoring_plan = mcp://claude-context/suggest --type=refactoring

   Define:
   - Program phases (6-8 phases)
   - Work streams (adjusted based on existing code)
   - Epics and features (minus already implemented)
   - Sprint planning
   - Release trains
   - Dependencies between teams
   - Refactoring milestones (if applicable)

   Update TodoWrite: "Define program structure" → completed
   ```

3. **Release strategy:**
   ```
   Update TodoWrite: "Plan release strategy" → in_progress

   Plan:
   - MVP definition
   - Alpha/Beta releases
   - Feature flags
   - Rollback procedures
   - Canary deployments
   - A/B testing strategy
   - Production rollout

   Update TodoWrite: "Plan release strategy" → completed
   ```

4. **Governance model:**
   ```
   Update TodoWrite: "Define governance model" → in_progress

   Establish:
   - Decision gates
   - Review processes
   - Change control
   - Risk management
   - Compliance checkpoints
   - Architecture reviews
   - Security reviews

   Update TodoWrite: "Define governance model" → completed
   ```

5. **Team allocation:**
   ```
   Update TodoWrite: "Plan team allocation" → in_progress

   Plan:
   - Team structure
   - Skill requirements
   - Resource loading
   - Onboarding needs
   - Knowledge transfer
   - Documentation requirements

   Update TodoWrite: "Plan team allocation" → completed
   ```

6. **Activate solution-architect agent:**
   ```
   Update TodoWrite: "Analyze with solution-architect" → in_progress

   Say to user: ""
   Say to user: "🤖 Activating solution-architect agent for enterprise program..."
   Say to user: "🏢 Enterprise-level orchestration beginning:"
   Say to user: "  • Program phases: {phases.length} identified"
   Say to user: "  • Work streams: {workstreams.length} parallel tracks"
   Say to user: "  • Teams required: {teams.length} specialized teams"
   Say to user: ""
   Say to user: "🤝 Orchestrating with specialist agents:"
   Say to user: "  • Solution Architect: Leading coordination"
   Say to user: "  • Frontend Developer: UI implementation planning"
   Say to user: "  • Backend Developer: API development planning"
   Say to user: "  • Quality Engineer: Test automation strategy"
   Say to user: ""

   Display progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Program Structure: ████████████████████ 100% ✅
   Agent Coordination:████████████████░░░░ 80% 🔄
   Portfolio Planning:████████████░░░░░░░░ 60% 🔄
   Risk Analysis:     ████████░░░░░░░░░░░░ 40% 🔄
   Resource Planning: ████░░░░░░░░░░░░░░░░ 20% 🔄
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Activate solution-architect agent:
   "Create ENTERPRISE program plan for {target}.
   Program Structure: [defined structure]
   Release Strategy: [release plan]
   Governance: [governance model]
   Teams: [team allocation]

   Orchestrate with other agents to deliver:
   - Complete program plan
   - Portfolio view
   - Roadmap with milestones
   - Resource management plan
   - Risk and issue management
   - Communication plan
   - Change management strategy"

   Say to user: ""
   Say to user: "✅ Solution architect orchestration complete!"
   Say to user: "📊 Enterprise program plan generated"
   Say to user: ""

   # Show preview of what was generated
   Say to user: "📋 Solution Architect Output Preview:"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "Program Structure:"
   Say to user: "  • Workstreams: {workstream_count}"
   Say to user: "  • Total modules: {module_count}"
   Say to user: "  • Phases: {phase_count}"
   Say to user: "  • Teams required: {team_count}"
   Say to user: ""
   For first 2 workstreams:
     Say to user: "Workstream: {workstream.name}"
     Say to user: "  • Duration: {workstream.duration}"
     Say to user: "  • Resources: {workstream.resources}"
     Say to user: "  • Dependencies: {workstream.dependencies}"
     Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   Update TodoWrite: "Analyze with solution-architect" → completed
   ```

7. **Multi-agent collaboration:**
   ```
   Update TodoWrite: "Analyze with other specialists" → in_progress

   Say to user: "🤝 Specialist agents providing domain expertise:"
   Say to user: "  • Frontend Developer: Creating UI implementation roadmap..."
   Say to user: "  • Backend Developer: Designing API development plan..."
   Say to user: "  • Quality Engineer: Building test automation framework..."
   Say to user: ""

   Solution Architect coordinates with:
   - Frontend Developer (UI implementation plan)
   - Backend Developer (API development plan)
   - Quality Engineer (test automation plan)

   Each provides specialized input for their domain

   Say to user: "✅ Multi-agent collaboration complete!"
   Say to user: ""

   Update TodoWrite: "Analyze with other specialists" → completed
   ```

8. **Generate enterprise program:**
   ```
   Update TodoWrite: "Generate enterprise program plan" → in_progress

   Create directory: {path}/06-development-plan/
   Generate:
   - program-plan/
   - portfolio-view/
   - roadmap/ (with visualizations)
   - work-streams/
   - modules/
     FOR EACH module in modules:
       - {module.name}/ (comprehensive documentation)
         - architecture.md
         - implementation-guide.md
         - api-specification.md
         - database-design.md
         - ui-components.md
         - test-plan.json (enterprise-grade test strategy):
           {
             "module": "{module.name}",
             "criticality": "[business criticality]",
             "test_coverage": {
               "unit": { "target": "90%", "count": 30-50 },
               "integration": { "target": "85%", "count": 20-30 },
               "e2e": { "target": "80%", "count": 15-25 },
               "performance": { "count": 10-15 },
               "security": { "count": 10-15 },
               "accessibility": { "count": 5-10 }
             },
             "test_automation": "100%",
             "test_environments": ["dev", "qa", "staging", "prod"],
             "compliance_validation": ["GDPR", "SOC2", "HIPAA"]
           }
         - deployment.md
         - monitoring.md
         - security-review.md
         - performance-benchmarks.md
   - release-plan/
   - team-structure/
   - governance/
   - risk-register/
   - testing-strategy/
     FOR EACH module in modules:
       - {module.name}-test-strategy.md
   - communication-plan/
   - change-management/
   - metrics-dashboard/
   - implementation-plan.json (master plan)

   Update TodoWrite: "Generate enterprise program plan" → completed
   ```

## Cascade Operations

### Auto-Processing Child Elements
**If --cascade=true (default):**

When planning at platform level:
```
Platform plan generated
  ↓ Auto-generates
  Module 1 plan
  Module 2 plan
  Module 3 plan
    ↓ Each auto-generates
    Feature plans
```

**Benefits**:
- Complete planning hierarchy in one command
- Consistent structure across levels
- Dependency chains automatically mapped
- Reduces manual planning effort by 80%

### Intelligent Dependency Mapping
AI automatically:
- Identifies blocking dependencies
- Suggests parallel work streams
- Optimizes critical path
- Highlights potential bottlenecks

## Pattern Recognition & Learning

### Mem0 Pattern Storage
After successful project completion:
```
Store pattern:
- Project type: ${type}
- Architecture: ${pattern}
- Task sequence: ${successful_sequence}
- Execution efficiency: ${actual_vs_planned}
- Key optimizations: ${lessons_learned}
```

### Pattern Retrieval
For new projects:
```
Retrieve similar patterns:
- Match architecture type
- Match tech stack
- Match track complexity
- Apply learned optimizations
- Adjust estimates based on history
```

## Test-Development Phase Mapping

### Phase-to-Test Gate Strategy (MANDATORY ENFORCEMENT with Playwright MCP)
Each development phase has a MANDATORY Playwright MCP test gate that MUST pass before proceeding:

```
Phase 1: Foundation & Setup
  ↓ PLAYWRIGHT MCP TEST GATE: Smoke Tests (MANDATORY)
    Command: mcp://playwright/run --suite=smoke --phase=foundation
    - App availability (MUST PASS)
    - Health endpoints (MUST PASS)
    - Database connection (MUST PASS)
    - Basic navigation (MUST PASS)
    - NO 404 ERRORS (ZERO TOLERANCE)
    ↓ Pass → Continue | Fail → FIX IMMEDIATELY
    ↓ Retry: mcp://playwright/run --suite=smoke --retry

Phase 2: Core Features (Module-by-Module)
  ↓ PLAYWRIGHT MCP TEST GATE: Per-Module Validation (MANDATORY)
    Command: mcp://playwright/run --suite=smoke,features --module={current}
    - Module functionality (100% WORKING)
    - CRUD operations (ALL MUST WORK)
    - Business logic (VERIFIED)
    - API endpoints (NO 404s)
    - Data persistence (CONFIRMED)
    - UI components (RENDER CORRECTLY)
    ↓ Pass → Next Module | Fail → FIX BEFORE PROCEEDING
    ↓ Debug: mcp://playwright/show-report --module={current}

Phase 3: Integration
  ↓ TEST GATE: E2E Tests
    - User journeys
    - Cross-module flows
    - External integrations
    - Payment flows
    ↓ Pass/Fail → Continue/Fix

Phase 4: Polish & Optimization
  ↓ TEST GATE: Performance Tests
    - Load testing
    - Response times
    - Resource usage
    - Stress testing
    ↓ Pass/Fail → Deploy/Optimize
```

## Plan Structure (implementation-plan.json)

### INSTANT
```json
{
  "track": "instant",
  "mcp_availability": {
    "playwright": true,
    "test_runner": "mcp",
    "claude_context": true
  },
  "existing_code_analysis": {
    "has_existing": false,
    "reusable_components": [],
    "modification_needed": []
  },
  "phases": [{
    "name": "Complete Build",
    "tasks": [
      { "id": "1.1", "name": "setup" },
      { "id": "1.2", "name": "implement" },
      { "id": "1.3", "name": "test" }
    ],
    "test_gate": {
      "name": "Smoke Test",
      "enforcement": "MANDATORY - CANNOT SKIP",
      "mcp_command": "mcp://playwright/run --suite=smoke",
      "fallback_command": "npx playwright test smoke/",
      "required": true,
      "pass_criteria": "100% tests must pass",
      "tests": [
        "app-running.spec.ts",
        "health-check.spec.ts",
        "no-404-errors.spec.ts",
        "docker-validation.spec.ts"
      ],
      "failure_protocol": [
        "Stop execution immediately",
        "Generate fix suggestions",
        "Retry after fixes (max 3)"
      ]
    }
  }]
}
```

### RAPID
```json
{
  "track": "rapid",
  "mcp_availability": {
    "playwright": true,
    "test_runner": "mcp",
    "claude_context": true,
    "commands": {
      "run": "mcp://playwright/run",
      "results": "mcp://playwright/results",
      "report": "mcp://playwright/report",
      "context_analyze": "mcp://claude-context/analyze"
    }
  },
  "existing_code_analysis": {
    "has_existing": false,
    "reusable_components": [],
    "modules_to_modify": [],
    "modules_to_create": []
  },
  "phases": [
    {
      "name": "Core",
      "tasks": [
        { "id": "1.1", "name": "backend-api" },
        { "id": "1.2", "name": "frontend-ui" },
        { "id": "1.3", "name": "integration" }
      ],
      "test_gate": {
        "name": "Smoke & Feature Tests",
        "enforcement": "MANDATORY PER MODULE",
        "mcp_command": "mcp://playwright/run --suite=smoke,features",
        "fallback_command": "npx playwright test tests/{smoke,features}/",
        "required": true,
        "pass_criteria": "Each module 100% working",
        "tests": [
          "smoke/app-running.spec.ts",
          "smoke/no-404-errors.spec.ts",
          "features/auth.spec.ts",
          "features/crud-operations.spec.ts",
          "features/dashboard.spec.ts",
          "features/data-persistence.spec.ts"
        ],
        "working_validation": [
          "All routes accessible",
          "All CRUD operations work",
          "All data persists",
          "Zero console errors"
        ]
      }
    },
    {
      "name": "Polish",
      "tasks": [
        { "id": "2.1", "name": "optimization" },
        { "id": "2.2", "name": "final-testing" }
      ],
      "test_gate": {
        "name": "Integration Tests",
          "mcp_command": "mcp://playwright/run --suite=integration",
        "fallback_command": "npx playwright test integration/",
        "required": false
      }
    }
  ]
}
```

### STANDARD
```json
{
  "track": "standard",
  "mcp_availability": {
    "playwright": true,
    "test_runner": "mcp",
    "claude_context": true
  },
  "existing_code_analysis": {
    "has_existing": true,
    "lines_of_code": 15000,
    "reusable_components": [
      "auth/login-component",
      "shared/api-client"
    ],
    "modules_to_modify": [
      "dashboard",
      "settings"
    ],
    "modules_to_create": [
      "analytics",
      "reports"
    ],
    "suggested_refactoring": [
      "Extract common patterns to shared lib",
      "Update auth to use new security standards"
    ]
  },
  "phases": [
    {
      "name": "Foundation",
      "tasks": [/* 10-15 setup tasks */],
      "test_gate": {
        "name": "Infrastructure Tests",
        "mcp_command": "mcp://playwright/run --suite=infrastructure",
        "tests": ["db-connection", "cache-connection", "api-health"]
      }
    },
    {
      "name": "Core Development",
      "tasks": [/* 20-25 feature tasks */],
      "test_gate": {
        "name": "Feature Tests",
        "mcp_command": "mcp://playwright/run --suite=features --parallel=4",
        "per_module_tests": true,
        "coverage_target": "80%"
      }
    },
    {
      "name": "Integration",
      "tasks": [/* 15-20 integration tasks */],
      "test_gate": {
        "name": "E2E Tests",
        "mcp_command": "mcp://playwright/run --suite=e2e --browsers=all",
        "scenarios": ["user-journey", "payment-flow", "admin-flow"]
      }
    },
    {
      "name": "Optimization",
      "tasks": [/* 10-15 optimization tasks */],
      "test_gate": {
        "name": "Performance Tests",
        "mcp_command": "mcp://playwright/run --suite=performance",
        "benchmarks": { "response_time": "<200ms", "lighthouse": ">90" }
      }
    }
  ],
  "test_orchestration": {
    "continuous": true,
    "parallel_execution": true,
    "screenshot_on_failure": true,
    "retry_failed": 2
  }
}
```

### ENTERPRISE
```json
{
  "track": "enterprise",
  "mcp_availability": {
    "playwright": true,
    "test_runner": "mcp",
    "advanced_features": ["parallel", "sharding", "cloud-grid"]
  },
  "program_phases": [
    {
      "name": "Foundation & Infrastructure",
      "work_streams": ["infrastructure", "security", "monitoring"],
      "test_strategy": {
        "continuous_testing": true,
        "test_environments": ["dev", "staging", "pre-prod"],
        "mcp_orchestration": {
          "infrastructure_tests": "mcp://playwright/run --suite=infra --env=dev",
          "security_tests": "mcp://playwright/run --suite=security --env=staging",
          "chaos_tests": "mcp://playwright/run --suite=chaos --env=pre-prod"
        }
      }
    },
    {
      "name": "Service Development",
      "work_streams": ["api-gateway", "microservices", "data-layer"],
      "test_strategy": {
        "per_service_tests": true,
        "contract_testing": true,
        "mcp_commands": [
          "mcp://playwright/run --suite=contracts --service={service}",
          "mcp://playwright/run --suite=integration --service=all"
        ]
      }
    },
    {
      "name": "Quality & Performance",
      "test_strategy": {
        "test_pyramid": {
          "unit": "90% coverage",
          "integration": "80% coverage",
          "e2e": "Critical paths 100%",
          "performance": "All endpoints <100ms p95",
          "security": "OWASP Top 10 covered"
        },
        "mcp_test_grid": {
          "browsers": ["chrome", "firefox", "safari", "edge"],
          "devices": ["desktop", "tablet", "mobile"],
          "regions": ["us-east", "eu-west", "ap-south"]
        }
      }
    }
  ],
  "governance": {
    "test_gates": "mandatory at each phase",
    "quality_metrics": "dashboard with real-time results",
    "compliance_tests": "automated GDPR, HIPAA, PCI checks"
  }
}
```

## Intelligent Test Generation

### Component-Based Test Scenarios
AI analyzes detected components and generates appropriate tests:

```
If AUTH_DETECTED (OAuth, JWT, Sessions):
  Generate tests:
  - auth/login.spec.ts
  - auth/logout.spec.ts
  - auth/token-refresh.spec.ts
  - auth/protected-routes.spec.ts
  MCP Command: mcp://playwright/run --suite=auth --parallel

If PAYMENTS_DETECTED (Stripe, PayPal):
  Generate tests:
  - payments/checkout-flow.spec.ts
  - payments/subscription.spec.ts
  - payments/webhook-handling.spec.ts
  - payments/refund-process.spec.ts
  MCP Command: mcp://playwright/run --suite=payments --test-mode

If API_DETECTED (REST, GraphQL):
  Generate tests:
  - api/endpoints-availability.spec.ts
  - api/data-validation.spec.ts
  - api/error-handling.spec.ts
  - api/rate-limiting.spec.ts
  MCP Command: mcp://playwright/run --suite=api --workers=4

If REALTIME_DETECTED (WebSockets, SSE):
  Generate tests:
  - realtime/connection.spec.ts
  - realtime/message-flow.spec.ts
  - realtime/reconnection.spec.ts
  MCP Command: mcp://playwright/run --suite=realtime --timeout=30000
```

### Architecture-Specific Test Strategies

```
For MONOLITH:
  Test Strategy: Sequential module testing
  MCP: mcp://playwright/run --suite=all --workers=1
  Focus: Integration between modules

For MICROSERVICES:
  Test Strategy: Service isolation + contract testing
  MCP: mcp://playwright/run --suite=contracts --per-service
  Focus: Service boundaries and communication

For SERVERLESS:
  Test Strategy: Function-level + cold start testing
  MCP: mcp://playwright/run --suite=functions --cold-start
  Focus: Function triggers and timeouts
```

## Test Execution Timeline

### Track-Specific Test Schedules

#### INSTANT Track
```
Phase: Complete Implementation
  - Setup & Dependencies
  - Core Implementation
  - Basic Unit Tests
  - MCP Playwright Smoke Test
              → mcp://playwright/run --suite=smoke --fast
              → 2 tests: app-running, health-check
              → Pass/Fail = Deploy/Fix
```

#### RAPID Track
```
Phase 1: Core Development
  - Setup & Configuration
  - Core Development
  TEST GATE 1: Smoke + Feature Tests
              → mcp://playwright/run --suite=smoke,features
              → 5-7 tests covering core functionality
Phase 2: Enhancement & Integration
  TEST GATE 2: Integration Tests
              → mcp://playwright/run --suite=integration
              → 3-5 end-to-end scenarios
```

#### STANDARD Track
```
Phase 1: Foundation Setup
         TEST GATE: Infrastructure tests
Phase 2: Core Feature Development
         TEST GATE: Per-module feature tests (continuous)
Phase 3: Integration & APIs
         TEST GATE: E2E tests with all browsers
Phase 4: Polish & Optimization
         TEST GATE: Performance benchmarks

              Total Tests: 50-100
              MCP Parallel Execution: Yes
              Coverage Target: 80%+
```

#### ENTERPRISE Track (Multi-day)
```
Day 1:        Infrastructure & Security
              Continuous Testing: Every commit
              MCP Grid: Multi-region testing
Day 2-3:      Service Development
              Per-Service Tests: Isolated + Integrated
              Contract Testing: All service boundaries
Day 4-5:      Integration & Performance
              Full E2E Suite: 200+ scenarios
              Load Testing: 1000+ concurrent users
Day 6-7:      Security & Compliance
              Penetration Testing: Automated + Manual
              Compliance Checks: GDPR, HIPAA, PCI

              Total Tests: 500-1000+
              MCP Cloud Grid: Yes
              Coverage Target: 90%+
```

## Task Breakdown Example

```markdown
## Phase 1: Foundation

### Task 1.1: Project Setup
- Initialize repository
- Install dependencies
- Configure environment
- Setup CI/CD
**Dependencies**: None
**Assigned**: DevOps Engineer

### Task 1.2: Database Setup
- Create schema
- Run migrations
- Seed test data
**Dependencies**: 1.1
**Assigned**: Backend Developer

### Task 1.3: Authentication Framework
- Implement JWT
- Setup middleware
- Create auth endpoints
**Dependencies**: 1.1, 1.2
**Assigned**: Backend Developer
```

## Visual Plan Representation

```
Phase 1: Foundation        ████████████░░░░░░░░ 60%
         TEST GATE 🧪      [SMOKE TESTS: ✅ PASSED]

Phase 2: Core Features     █████░░░░░░░░░░░░░░░ 25%
         TEST GATE 🧪      [FEATURE TESTS: 🔄 RUNNING]

Phase 3: Integration       ░░░░░░░░░░░░░░░░░░░░ 0%
         TEST GATE 🧪      [E2E TESTS: ⏳ PENDING]

Phase 4: Polish            ░░░░░░░░░░░░░░░░░░░░ 0%
         TEST GATE 🧪      [PERFORMANCE: ⏳ PENDING]

Critical Path with Test Gates:
Setup → [🧪 Smoke] → Database → Auth → [🧪 Feature] → API → UI → [🧪 E2E] → Optimize → [🧪 Perf]

MCP Playwright Status: ✅ Connected | Test Runner: MCP | Parallel: Enabled
```

## Adaptive Intelligence

### Context-Aware Planning
Based on detected patterns:

**If Next.js detected**:
- Suggest Vercel deployment
- Include API routes planning
- Add ISR/SSR considerations

**If Microservices detected**:
- Plan service communication
- Include API gateway setup
- Add service discovery tasks

**If OAuth detected**:
- Include auth flow implementation
- Add token refresh logic
- Plan session management

**If Stripe detected**:
- Include webhook endpoints
- Add payment flow testing
- Plan subscription logic

### Smart Task Prioritization
AI prioritizes based on:
- Critical path analysis
- Risk assessment
- Dependency chains
- Resource availability
- Business value

## Automatic Test File Generation

### Generated Test Structure
The plan command automatically generates actual Playwright test files:

```
06-development-plan/
├── playwright-tests/
│   ├── smoke/                    # Basic availability tests
│   │   ├── app-running.spec.ts   # App responds on localhost
│   │   ├── health-check.spec.ts  # Health endpoint returns 200
│   │   ├── no-404-errors.spec.ts # MANDATORY: Zero 404 tolerance
│   │   └── docker-validation.spec.ts # Docker containers healthy
│   ├── features/                 # Per-module functionality tests
│   │   ├── auth.spec.ts         # Authentication flows
│   │   ├── crud-operations.spec.ts # MANDATORY: All CRUD works
│   │   ├── data-persistence.spec.ts # Data saves and loads
│   │   └── [module].spec.ts     # Generated per detected module
│   ├── integration/              # Cross-module tests
│   │   ├── user-journey.spec.ts # End-to-end user flows
│   │   ├── api-integration.spec.ts # API endpoint verification
│   │   └── module-interaction.spec.ts # Module dependencies
│   └── performance/              # Performance validation (STANDARD+)
│       ├── load-testing.spec.ts # Concurrent user testing
│       └── response-time.spec.ts # Latency requirements
```

### Example Generated Test: no-404-errors.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('404 Error Detection (ZERO TOLERANCE)', () => {
  const routes = [
    '/',
    '/dashboard',
    '/login',
    '/register',
    // Routes dynamically added from discovery/specification
  ];

  for (const route of routes) {
    test(`Route ${route} should NOT return 404`, async ({ page }) => {
      const response = await page.goto(`http://localhost:3000${route}`);
      expect(response?.status()).not.toBe(404);
      expect(response?.status()).toBeLessThan(400);
    });
  }

  test('All API endpoints should respond', async ({ request }) => {
    const endpoints = ['/api/health', '/api/auth/session'];
    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).not.toBe(404);
    }
  });
});
```

### Test Gate Enforcement Protocol
```yaml
enforcement:
  level: MANDATORY
  skip_allowed: false
  failure_handling:
    immediate_action: STOP_EXECUTION
    max_retries: 3
    fix_protocol:
      1: "Identify failing test"
      2: "Generate fix suggestion"
      3: "Apply fix"
      4: "Re-run test suite"
      5: "Proceed only if 100% pass"
```

## Plan Validation

### Pre-Output Validation
Before generating final plan:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating Plan:   ████████████████████ 100% ✅
- Requirements:    All covered ✅
- Dependencies:    Valid chains ✅
- Test Coverage:   MANDATORY gates defined ✅
- Test Files:      Generated and ready ✅
- Architecture:    Aligned ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Messages

Upon completion:

```
✅ Development plan created for {target}
📋 Track: {track}

📁 Created in: {path}/06-development-plan/

Plan summary:
- Phases: {phase-count}
- Tasks: {task-count}
- Development phases: {phase-count}
- Test coverage: {test-target}%

Next: /ccu:develop --target={target} --track={track}
```

## Error Handling

- If missing architecture:
  ```
  ERROR: No architecture found
  Run first: /ccu:architect --target={target} --track={track}
  ```

- If incomplete context:
  ```
  WARNING: Some phase outputs missing
  Plan will use available data and defaults
  Recommend running complete flow from /ccu:discover
  ```

## Next Steps

After completing planning, proceed to:
- `/ccu:develop` - Phase 7: Pure execution of the plan

Remember: This command is part of the 7-phase engineering process:
discover → specify → design → security → architect → **plan** → develop