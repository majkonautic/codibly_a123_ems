---
description: Phase 7 - Pure execution of the development plan
activates: solution-architect, frontend-developer, backend-developer, quality-engineer
argument-hint: --target=platform|module|feature [--track=instant|rapid|standard|enterprise] --from=plan [--container=docker|local] [--cascade=true]
---

# Develop Command - Phase 7: Pure Execution

This is **Phase 7** of the 7-phase development process. The develop phase is pure execution - implementing the plan created in Phase 6 with NO new decisions, just building according to specifications.

Execute the development plan for **$ARGUMENTS.target** with ZERO questions.

## Command Syntax

```bash
/ccu:develop --target=platform|module|feature --from=plan [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Scope of execution
- `--from=plan` - Load execution plan from Phase 6 (required)
- `--module=<name>` - Required when target=module or feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--track=instant|rapid|standard|enterprise` - Override track from plan
- `--container=docker|local` - Containerization option (default: local)
- `--cascade=true|false` - Auto-execute child elements (default: false)
- `--skip-tests` - Skip test gates (NOT recommended)

## Execution Philosophy

**This command asks ZERO questions across all tracks:**
- **INSTANT**: 0 questions - pure execution
- **RAPID**: 0 questions - follows plan exactly
- **STANDARD**: 0 questions - systematic build
- **ENTERPRISE**: 0 questions - comprehensive program execution

**All decisions were made in Phases 1-6. This phase is PURE EXECUTION.**

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used during execution:

1. **Tool: mcp__mem0__search_memory**
   - When: Before generating each component
   - Purpose: Find proven code patterns
   - Usage:
   ```
   mcp__mem0__search_memory(
     query: "implementation [component] in [framework] for [use case]"
   )
   ```

2. **Tool: mcp__mem0__add_memory**
   - When: After successful implementation
   - Purpose: Store working code patterns
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "Working implementation: [component] using [pattern] - tested and verified"
   )
   ```

3. **Tool: mcp__context7__get-library-docs**
   - When: Implementing framework-specific code
   - Purpose: Get exact implementation syntax
   - Usage:
   ```
   mcp__context7__get-library-docs(
     context7CompatibleLibraryID: "/vercel/next.js",
     topic: "[specific API or component]",
     tokens: 3000
   )
   ```

4. **Tool: mcp__claude-context__search_code**
   - When: Integrating with existing code
   - Purpose: Find integration points
   - Usage:
   ```
   mcp__claude-context__search_code(
     path: "/absolute/path/to/project",
     query: "[component to integrate with]"
   )
   ```

5. **Tool: mcp__playwright__browser_navigate**
   - When: Running test gates
   - Purpose: Execute E2E tests
   - Usage:
   ```
   mcp__playwright__browser_navigate(
     url: "http://localhost:3000/[test-route]"
   )
   ```

6. **Tool: mcp__playwright__browser_click**
   - When: Testing user interactions
   - Purpose: Validate UI functionality
   - Usage:
   ```
   mcp__playwright__browser_click(
     element: "[button or link]",
     ref: "[element reference]"
   )
   ```

7. **Tool: mcp__playwright__browser_fill_form**
   - When: Testing forms
   - Purpose: Validate form submissions
   - Usage:
   ```
   mcp__playwright__browser_fill_form(
     fields: [{name: "email", value: "test@example.com"}]
   )
   ```

8. **Tool: mcp__playwright__browser_snapshot**
   - When: Verifying UI states
   - Purpose: Capture test results
   - Usage:
   ```
   mcp__playwright__browser_snapshot()
   ```

9. **Tool: mcp__ide__executeCode**
   - When: Running unit tests
   - Purpose: Execute test suites
   - Usage:
   ```
   mcp__ide__executeCode(
     code: "npm test [module]"
   )
   ```

10. **Tool: mcp__ide__getDiagnostics**
    - When: After code generation
    - Purpose: Check for errors
    - Usage:
    ```
    mcp__ide__getDiagnostics(
      uri: "file:///path/to/generated/file"
    )
    ```

### Test Gate Execution with Playwright MCP

**MANDATORY for all tracks:**
```
After each module implementation:
1. Start dev server
2. mcp__playwright__browser_navigate(url: "http://localhost:3000")
3. Execute module test suite:
   - mcp__playwright__browser_click for interactions
   - mcp__playwright__browser_fill_form for forms
   - mcp__playwright__browser_snapshot for verification
4. Check results with mcp__ide__getDiagnostics
5. STOP if tests fail - fix before continuing
```

### MCP Usage by Track

**ALL TRACKS (including INSTANT):**
- mcp__mem0__search_memory before code generation
- mcp__context7__get-library-docs for framework code
- mcp__playwright__ tools for test gates
- mcp__ide__getDiagnostics after generation

**RAPID Track adds:**
- mcp__mem0__add_memory after success
- Basic mcp__playwright__ test flows

**STANDARD Track adds:**
- mcp__claude-context__search_code for integration
- Comprehensive mcp__playwright__ testing
- mcp__ide__executeCode for unit tests

**ENTERPRISE Track adds:**
- Full mcp__playwright__ test automation
- Multiple mcp__ide__getDiagnostics checks
- Extensive pattern storage in mcp__mem0__add_memory

## Step -1: Determine Project Output Directory

**Set up project output location:**
```bash
# Get project slug from discovery or prompt user
project_slug = Load from ccu_workspace/platform/01-discovery/discovery.json
If not exists:
  Ask user: "Project name (slug format): "
  project_slug = user_input.toLowerCase().replace(spaces, '-')

# Set output directory in root
project_output_dir = "{pwd}/{project_slug}"

# Create project directory
Create directory: {project_output_dir}

Say to user: "📍 Project will be created in: {project_output_dir}"
Say to user: "🐳 Docker configuration will be included by default"

# All code generation will use project_output_dir
```

## Pre-execution Validation

### Visual Progress Header
```
┌─────────────────────────────────────────────────────────────────────┐
│  🚀 CODE EXECUTION - $ARGUMENTS.track TRACK     [0% ░░░░░░░░░░]     │
└─────────────────────────────────────────────────────────────────────┘
```

### MCP Playwright Detection
```
Load helper: helpers/mcp-playwright-detector

If MCP_PLAYWRIGHT_AVAILABLE:
  Say: "✅ MCP Playwright ready for test gate execution"
  Set TEST_RUNNER = "mcp"
Elif LOCAL_PLAYWRIGHT_AVAILABLE:
  Say: "⚠️ Using local Playwright for test gates"
  Set TEST_RUNNER = "local"
Else:
  Say: "❌ No test runner available - gates will be skipped"
  Set TEST_RUNNER = "none"
```

1. **Check for --from parameter:**
   - If `--from=plan` is provided:
     - If target=platform: load `ccu_workspace/platform/06-development-plan/implementation-plan.json`
     - If target=module: load `ccu_workspace/modules/$ARGUMENTS.module/06-development-plan/implementation-plan.json`
     - If target=feature: load `ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/06-development-plan/implementation-plan.json`
   - Implementation plan is REQUIRED for execution
   - If no plan exists, inform user to run `/ccu:plan` first
   - Note: Plans are loaded from ccu_workspace, but code is generated in {project_output_dir}

2. **Extract track from the plan:**
   - Read `track` field from implementation-plan.json
   - Use this track for all execution decisions
   - If --track parameter provided without --from=plan, use it for standalone development

3. **Load ALL phase outputs:**
   - 01-discovery/discovery-{track}.json
   - 02-specification/specification.json
   - 03-design/design-system.json
   - 04-security/security-config.json
   - 05-architecture/tech-stack.json
   - 06-development-plan/implementation-plan.json

4. **Validate target scope:**
   - For `--target=module`: Require `--module=<name>` parameter
   - For `--target=feature`: Require both `--module=<name>` and `--feature=<name>` parameters

5. **Determine execution location:
   - Platform: Execute in current directory (src/)
   - Module/Feature: Execute in worktree if configured

## Step 0: Initialize Claude Context for Development

Say to user: "🔍 Initializing Claude Context for intelligent code generation..."

1. **Connect to Claude Context MCP:**
   ```
   MCP Server: claude-context
   Protocol: stdio
   Backend: OpenAI (embeddings) + Milvus (storage)
   ```

2. **Index codebase for development:**
   ```
   Determine scope based on target:
   - Platform: Index entire src/
   - Module: Index module directory + interfaces
   - Feature: Index feature directory + module context

   MCP Call: claude-context.index
   Parameters: {
     path: determined_path,
     include: ["*.ts", "*.tsx", "*.js", "*.jsx"],
     exclude: ["node_modules", "dist", "build", ".next"]
   }
   ```

3. **Pre-cache common patterns:**
   ```
   Component patterns:
   MCP Call: claude-context.search
   Query: "component props interface React TypeScript"

   API patterns:
   MCP Call: claude-context.search
   Query: "api endpoint handler middleware async"

   Test patterns:
   MCP Call: claude-context.search
   Query: "test describe it expect jest testing"
   ```

4. **Display readiness:**
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔍 CLAUDE CONTEXT READY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Indexed: 312 files | 1,847 code chunks
   Patterns cached: Components, APIs, Tests, Styles
   Vector database: Connected to Milvus cloud
   Ready for context-aware development ✅
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

## Agent Team Activation

Based on track (extracted from plan or provided via --track), activate the appropriate team:

### Visual Team Display
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 ACTIVATING AGENT TEAM FOR $ARGUMENTS.track TRACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### INSTANT/RAPID
- **Solution Architect**: Handles all planning and coding (with Claude Context access)
- No other agents needed for these tracks

### STANDARD
- **Solution Architect**: Coordinates team (with Claude Context access)
- **Frontend Developer**: UI implementation (with Claude Context access)
- **Backend Developer**: API/services (with Claude Context access)
- **Quality Engineer**: Testing (with Claude Context access)

### ENTERPRISE
- **Solution Architect**: Program management (with Claude Context access)
- **Frontend Developer**: UI team lead (with Claude Context access)
- **Backend Developer**: Services team lead (with Claude Context access)
- **Quality Engineer**: QA team lead (with Claude Context access)
- Additional specialists as needed

### Context-Aware Agent Capabilities

Each agent now has access to Claude Context for intelligent code generation:

**Solution Architect:**
- Searches for architectural patterns before designing
- Ensures consistency with existing architecture
- Finds similar implementations for reference
- Query example: "architecture pattern module structure dependency"

**Frontend Developer:**
- Finds and reuses existing components
- Maintains consistent styling patterns
- Discovers existing hooks and utilities
- Query example: "component {type} props interface styling"

**Backend Developer:**
- Locates existing API patterns
- Finds database models and schemas
- Identifies middleware and services
- Query example: "api endpoint {method} validation middleware"

**Quality Engineer:**
- Discovers existing test patterns
- Maintains testing consistency
- Finds coverage gaps
- Query example: "test {component} mock spy assertion"

## Pattern Reuse with Mem0

### Before Code Generation
```
For each component/module to generate:

1. Search Mem0 for similar patterns:
   mem0_search({
     type: "component|api|service",
     framework: detected_framework,
     functionality: component_purpose
   })

2. Apply reuse strategy:
   If similarity > 80%:
     → Reuse pattern with minimal modifications
     Say: "♻️ Reusing proven pattern: {pattern_name}"

   If similarity 50-80%:
     → Adapt pattern to current requirements
     Say: "🔄 Adapting pattern: {pattern_name}"

   If similarity < 50%:
     → Generate new implementation
     Say: "🆕 Creating new implementation"

3. After successful completion:
   mem0_save("develop_pattern", {
     component: component_info,
     pattern: implementation_pattern,
     success: true,
     metrics: performance_metrics
   })
```

## Track-Based Execution Process

### 🚀 INSTANT Track
**If track is "instant":**

1. **Load implementation plan and initialize:**
   ```
   # Load the detailed plan from planning phase
   implementation_plan = Load implementation-plan.json from 06-development-plan/
   module_breakdown = Load module-breakdown.md from 06-development-plan/
   execution_order = Load execution-order.md from 06-development-plan/
   test_gates = Load test-gates.md from 06-development-plan/

   # Create TodoWrite from actual plan
   Create TodoWrite list from implementation_plan.modules:
   For each module in execution_order:
     - "Build {module} module"
     - "Test {module} module"
     - "Verify {module} (no 404s)"
   ```

2. **Rapid execution:**
   ```
   Update TodoWrite: "Setup project structure" → in_progress

   Say to user: "🚀 INSTANT MODE: Executing rapid build"
   Say to user: "🚀 Rapid execution mode activated"

   Display progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Phase Progress:    ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Tasks:            [0/5] ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Test Gates:       [0/1] ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   # No questions, no decisions - just build
   Execute according to plan with all defaults

   Update TodoWrite tasks as completed
   ```

3. **Module-by-module implementation:**
   ```
   For each module in execution_order:
     Update TodoWrite: "Build {module} module" → in_progress

     # Read module details from plan
     module_spec = module_breakdown[module]

     Activate solution-architect:
     "Build {module} module according to plan.
     Module specification: {module_spec}
     Required functions: {module_spec.functions}
     Required endpoints: {module_spec.endpoints}
     Required components: {module_spec.components}

     Implementation requirements:
     - Create all specified files
     - Implement all functions/methods
     - Ensure all routes work (no 404s)
     - Follow the exact specification"

     # After building, immediately test
     Update TodoWrite: "Build {module} module" → completed
     Update TodoWrite: "Test {module} module" → in_progress
   ```

4. **Test Gate & Fix Loop for each module:**
   ```
   For each completed module:
     # Run module-specific tests
     test_spec = test_gates[module]

     If TEST_RUNNER == "mcp":
       Execute: mcp://playwright/run --suite={module} --check-routes=true
       results = mcp://playwright/results --format=json
     Else:
       Execute: npx playwright test tests/{module}/*.spec.ts
       results = parse_test_output()

     # Check for failures (especially 404s)
     If results.failed > 0:
       Say to user: "⚠️ {module} tests failed: {results.failures}"

       # Analyze failures
       For each failure in results.failures:
         If failure.type == "404":
           Say: "🔧 Fixing missing route: {failure.route}"
           # Fix the missing route
           Activate solution-architect:
           "Fix 404 error for route {failure.route}.
           Add missing endpoint/page.
           Ensure it returns proper response."

         Elif failure.type == "error":
           Say: "🔧 Fixing error: {failure.message}"
           # Fix the error
           Activate solution-architect:
           "Fix error in {module}: {failure.message}
           Debug and correct the implementation."

       # Re-run tests after fixes
       Say: "🔄 Re-running tests after fixes..."
       Execute: {same test command}

       # Repeat until all tests pass
       While tests_failing:
         Fix issues
         Re-run tests

     Update TodoWrite: "Test {module} module" → completed
     Update TodoWrite: "Verify {module} (no 404s)" → completed
   Elif TEST_RUNNER == "local":
     Execute: {test_gate.fallback_command}
   Else:
     Skip with warning

   If tests fail:
     Say: "❌ Test gate failed - stopping execution"
     Display failed tests
     EXIT
   ```

5. **Verify completion:**
   ```
   Run:
   - npm install
   - npm run build
   - npm test (1 basic test)

   Display final progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Phase Progress:    ████████████████████ 100% ✅
   Tasks:            [5/5] ████████████████████ 100% ✅
   Test Gates:       [1/1] ████████████████████ 100% ✅
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Say to user: "✅ INSTANT build complete!"
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite:**
   ```
   Load tasks from implementation plan
   Create TodoWrite list for Phase 1 and Phase 2
   ```

2. **Phase 1: Core (10 minutes):**
   ```
   Update TodoWrite: Current phase tasks → in_progress

   Say to user: "⚡ RAPID MODE: Phase 1 - Core Implementation"

   Display progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Phase 1 Progress:  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Phase 2 Progress:  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Test Gates:       [0/2] ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Activate solution-architect:
   Execute Phase 1 tasks from plan:
   - Backend API implementation
   - Frontend components
   - Basic integration
   - Core business logic
   - Handle all coding yourself

   Update TodoWrite as tasks complete
   ```

   TEST GATE: Execute phase 1 test gate
   If test_gate fails: STOP execution
   ```

3. **Module-by-module implementation with Testing:**
   ```
   # Read modules from specification.json
   modules = specification.json.modules || []

   For each module in modules:
     Say to user: "🔨 Building {module.name} module"
     Update TodoWrite: "Build {module.name} module" → in_progress

     # Build the module
     Activate solution-architect:
     "Build {module.name} module according to plan.
     Module specification from plan: {module_breakdown[module.name]}
     Implementation requirements:
     - Create all specified files
     - Implement all functions/methods
     - Ensure all routes work (no 404s)
     - Add error handling
     - Basic optimization"

     Update TodoWrite: "Build {module.name} module" → completed

     # IMMEDIATELY TEST THE MODULE
     Say to user: "🧪 Testing {module.name} module"
     Update TodoWrite: "Test {module.name} module" → in_progress

     # Run module-specific tests
     If TEST_RUNNER == "mcp":
       Execute: mcp://playwright/run --suite={module.name} --check-routes=true
       results = mcp://playwright/results --format=json
     Else:
       Execute: npm test -- {module.name}
       results = parse_test_output()

     # Check for failures and fix
     If results.failed > 0:
       Say to user: "⚠️ {module.name} tests failed: {results.failures}"

       # Fix failures
       For each failure in results.failures:
         If failure.type == "404":
           Say: "🔧 Fixing missing route: {failure.route}"
           Activate solution-architect:
           "Fix 404 error for route {failure.route}.
           Add missing endpoint/page."
         Elif failure.type == "error":
           Say: "🔧 Fixing error: {failure.message}"
           Activate solution-architect:
           "Fix error in {module.name}: {failure.message}"

       # Re-run tests
       Say: "🔄 Re-running tests after fixes..."
       Execute: {same test command}

       # Keep fixing until tests pass
       While tests_failing:
         Fix issues
         Re-run tests

     Say to user: "✅ {module.name} module complete and tested"
     Update TodoWrite: "Test {module.name} module" → completed
   ```

4. **Phase 2: Polish & Integration Testing (5 minutes):**
   ```
   Say to user: "⚡ RAPID MODE: Phase 2 - Integration & Polish"

   Update progress:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Module Building:   ████████████████████ 100% ✅
   Module Testing:    ████████████████████ 100% ✅
   Integration:       ████████░░░░░░░░░░░░ 40% 🔄
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

   Execute integration tasks:
   - Run 3 E2E tests with MCP Playwright
   - Verify module interactions
   - Final optimizations

   Update TodoWrite as tasks complete
   ```

5. **Final verification:**
   ```
   Run full test suite:
   - All module tests
   - Integration tests
   - E2E tests

   Display coverage report
   Run build verification

   Say to user: "✅ RAPID build complete - All modules built and tested"
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite:**
   ```
   Load complete WBS from plan
   Create detailed TodoWrite for all phases
   ```

2. **Module-by-module execution with Testing:**
   ```
   # Read modules from specification.json
   modules = specification.json.modules || []
   phases = plan.phases || []

   For each phase in phases:
     Say to user: "📋 STANDARD MODE: Phase {phase.number} - {phase.name}"

     # Get modules for this phase
     phase_modules = phase.modules || []

     For each module in phase_modules:
       Say to user: "🔨 Building {module.name} module"
       Update TodoWrite: "Build {module.name} module" → in_progress

       Display module progress:
       ```
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Module: {module.name}  ██████████░░░░░░░░░░ 50% 🔄
       Phase Progress:        ██████░░░░░░░░░░░░░░ 30% 🔄
       Test Coverage:         ████████████████░░░░ 80% 📊
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ```

       # Activate specialist agents for module
       Activate specialist agents:
       - Solution Architect: Coordinates {module.name} build
       - Frontend Developer: {module.name} UI components
       - Backend Developer: {module.name} API endpoints

       # Build module implementation
       Execute module tasks according to plan
       Update TodoWrite: "Build {module.name} module" → completed

       # IMMEDIATELY TEST THE MODULE
       Say to user: "🧪 Testing {module.name} module"
       Update TodoWrite: "Test {module.name} module" → in_progress

       # Run comprehensive module tests
       Execute module test gate:
       - Unit tests for {module.name} (target: 80% coverage)
       - Integration tests for {module.name}
       - API contract validation
       - UI component testing
       - Performance benchmarks

       If TEST_RUNNER == "mcp":
         Execute: mcp://playwright/run --suite={module.name} --comprehensive --coverage
         results = mcp://playwright/results --format=json
       Else:
         Execute: npm test -- {module.name} --coverage
         results = parse_test_output()

       # Fix any failures
       If results.failed > 0:
         Say: "⚠️ {module.name} tests failed. Fixing issues..."

         retry_count = 0
         While retry_count < 3 AND tests_failing:
           # Activate Quality Engineer to fix issues
           Activate quality-engineer:
           "Fix test failures in {module.name}:
           Failures: {results.failures}
           Coverage: {results.coverage}%
           Target coverage: 80%"

           # Re-run tests
           Say: "🔄 Retrying tests (attempt {retry_count + 1} of 3)..."
           Execute: {same test command}
           retry_count += 1

         If still failing:
           Say: "🚫 HARD STOP: Module {module.name} tests must pass"
           EXIT with error

       Say: "✅ {module.name} module complete - Tests passed, Coverage: {results.coverage}%"
       Update TodoWrite: "Test {module.name} module" → completed

     # Phase-level quality gate
     Run phase verification:
     - All modules in phase tested
     - Integration between phase modules
     - Overall phase quality metrics
   ```

3. **Quality gates with Test Execution:**
   ```
   After each phase:
   Load phase.test_gate from implementation-plan.json

   Say: "🔒 MANDATORY TEST GATE: {phase.test_gate.name}"
   Say: "Enforcement: CANNOT SKIP - MUST PASS 100%"

   Execute test gate with Working-First Validator:
     retry_count = 0
     While retry_count < 3:
       If TEST_RUNNER == "mcp":
         Execute: {phase.test_gate.mcp_command} --enforce-404-check --require-100-pass
         Get results: mcp://playwright/results --format=json
       Elif TEST_RUNNER == "local":
         Execute: {phase.test_gate.fallback_command}

       If tests pass 100%:
         Break  # Proceed to next phase
       Else:
         Say: "❌ TEST GATE FAILED - Attempt {retry_count + 1} of 3"
         Fix issues
         retry_count += 1

     If still failing after 3 attempts:
       Say: "🛑 HARD STOP: Cannot proceed - tests must pass"
       EXIT with error

   Additional mandatory checks:
     - NO 404 errors (zero tolerance)
     - All CRUD operations working
     - Data persistence verified
     - Check code coverage (target from plan)
     - Verify API contracts
     - Validate UI components
     - Security scan (if configured)

   If any gate fails:
     Display: "❌ Quality gate failed: {gate_name}"
     Show failure details
     STOP execution

   Only proceed if ALL quality gates pass
   ```

4. **Final integration:**
   ```
   Say to user: "🔧 Running full system integration"

   - End-to-end testing with MCP Playwright
   - Performance benchmarks
   - Accessibility checks
   - Final build verification
   ```

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize program execution:**
   ```
   Load enterprise program plan
   Create comprehensive TodoWrite
   Setup governance checkpoints
   ```

2. **Work stream coordination with module testing:**
   ```
   Solution Architect coordinates multiple work streams:

   Say to user: "🏢 ENTERPRISE MODE: Executing Program Plan"
   Say to user: "Work Streams: {stream_count}"
   Say to user: "Total Modules: {module_count}"

   # Read modules from specification.json
   modules = specification.json.modules || []
   work_streams = plan.work_streams || []

   For each work_stream in work_streams:
     Say to user: "📦 Work Stream: {work_stream.name}"

     For each module in work_stream.modules:
       Say to user: "🆕 Building {module.name} module - Enterprise Grade"
       Update TodoWrite: "Build {module.name} module (Enterprise)" → in_progress

       # Assign specialist agent team
       Assign team:
       - Solution Architect: Overall coordination
       - Frontend Architect: UI architecture
       - Backend Architect: API architecture
       - Security Engineer: Security implementation
       - Quality Engineer: Testing strategy
       - DevOps Engineer: CI/CD integration

       # Build module with enterprise standards
       Execute module build:
       - Implement core functionality
       - Add enterprise features (audit, monitoring)
       - Implement security controls
       - Add compliance requirements
       - Create comprehensive documentation

       Update TodoWrite: "Build {module.name} module (Enterprise)" → completed

       # ENTERPRISE-GRADE MODULE TESTING
       Say to user: "🧪 Enterprise Testing: {module.name}"
       Update TodoWrite: "Test {module.name} module (Enterprise)" → in_progress

       # Execute comprehensive test suite
       Execute enterprise test gate:
       1. Unit Testing (minimum 80% coverage)
       2. Integration Testing (all endpoints)
       3. E2E Testing (25+ scenarios)
       4. Performance Testing (load, stress)
       5. Security Testing (OWASP Top 10)
       6. Accessibility Testing (WCAG 2.1)
       7. Compliance Validation

       If TEST_RUNNER == "mcp":
         Execute parallel tests:
         - mcp://playwright/run --suite={module.name} --enterprise --parallel
         - mcp://security/scan --module={module.name} --owasp
         - mcp://performance/run --module={module.name} --load
         results = aggregate_test_results()
       Else:
         Execute: npm run test:enterprise -- {module.name}
         results = parse_enterprise_test_output()

       # Enterprise-level failure handling
       If results.failed > 0 OR results.coverage < 80:
         Say: "⚠️ Enterprise quality gate failed for {module.name}"

         # Create detailed failure report
         Generate failure report:
         - Test failures: {results.failures}
         - Coverage gaps: {results.coverage_gaps}
         - Security issues: {results.security_issues}
         - Performance bottlenecks: {results.performance_issues}

         # Activate specialized teams to fix
         For each issue_category in results.issues:
           Activate appropriate team:
           If issue_category == "security":
             Activate security-engineer: "Fix security issues in {module.name}"
           If issue_category == "performance":
             Activate performance-engineer: "Optimize {module.name} performance"
           If issue_category == "quality":
             Activate quality-engineer: "Improve test coverage for {module.name}"

         # Re-run entire test suite
         Say: "🔄 Re-running enterprise test suite..."
         Execute: {full enterprise test command}

         # Governance checkpoint
         If still failing after fixes:
           Say: "🚫 GOVERNANCE GATE: Module {module.name} blocked"
           Generate executive report
           Request approval to proceed or halt
           EXIT if not approved

       # Module certification
       Say: "✅ {module.name} CERTIFIED - Enterprise Standards Met"
       Generate module certification:
       - Coverage: {results.coverage}%
       - Security: PASSED
       - Performance: {results.performance_metrics}
       - Compliance: {results.compliance_status}

       Update TodoWrite: "Test {module.name} module (Enterprise)" → completed

     # Work stream synchronization point
     Synchronize at integration points
     Run cross-module integration tests
   ```

3. **Governance gates:**
   ```
   At each governance checkpoint:
   - Architecture review
   - Security review
   - Compliance check
   - Performance validation
   - Documentation review
   - Change control board

   Document decisions and approvals
   ```

4. **Phased delivery with continuous testing:**
   ```
   For each release phase:
     Say to user: "🚀 Release Phase: {phase.name}"

     # All modules in phase must be tested and certified
     Verify all module certifications

     # Run full system testing
     Say to user: "🌐 Running Full System Testing"
     Execute comprehensive testing:
     - All module tests (must be 100% passing)
     - Cross-module integration (all touchpoints)
     - Full E2E suite (25+ scenarios)
     - Performance benchmarks (vs. requirements)
     - Security audit (penetration testing)
     - Accessibility audit (WCAG 2.1 AA)
     - Compliance validation (SOC2, GDPR, etc.)

     # Only proceed if all tests pass
     If any test fails:
       Say: "🚫 RELEASE BLOCKED: Quality gates not met"
       Generate detailed report
       Return to module fixing

     # Create release artifacts
     Create release artifacts:
     - Deployment packages (tested)
     - Documentation (reviewed)
     - Release notes (approved)
     - Rollback procedures (validated)
     - Test reports (comprehensive)
     - Compliance certificates

     Say to user: "✅ Release Phase {phase.name} - READY FOR DEPLOYMENT"
   ```

5. **Program reporting:**
   ```
   Generate executive dashboard:
   - Progress metrics
   - Quality metrics
   - Risk status
   - Issue tracking
   - Resource utilization
   - Milestone status
   ```

## Execution Patterns

### Project Structure Setup

**Platform (Unified):**
```
src/
├── app/          # Next.js app router
├── components/   # React components
├── lib/          # Business logic
├── api/          # API routes
└── tests/        # Test files
```

**Module (in worktree):**
```
ccu_worktree/module-{name}/
├── src/
├── tests/
└── package.json
```

### Code Generation

All code generation follows:
1. Specifications from Phase 2
2. Design patterns from Phase 3
3. Security requirements from Phase 4
4. Architecture decisions from Phase 5
5. Task sequence from Phase 6

NO NEW DECISIONS during execution!

## Context-Aware Code Generation with Claude Context

All agents leverage Claude Context MCP for intelligent generation:

### Pattern Discovery Before Generation

1. **Search for existing implementations:**
   ```
   Before creating any component/function:

   MCP Call: claude-context.search
   Query: "{component_type} {functionality} {technology}"

   Returns:
   - Similar code chunks with similarity scores
   - File locations of matches
   - Pattern confidence levels
   ```

2. **Reuse vs Create Decision:**
   ```
   If similarity > 0.8:
     → Adapt existing code
     → Maintain consistency

   If similarity 0.5-0.8:
     → Use as reference pattern
     → Create variation

   If similarity < 0.5:
     → Create new implementation
     → Follow general conventions
   ```

### Example Generation Flow

Creating a new button component:
```
1. Search existing buttons:
   MCP Call: claude-context.search
   Query: "button component props onClick disabled primary"

2. Analyze results:
   Found: PrimaryButton (0.92 similarity)
   Location: src/components/ui/PrimaryButton.tsx

3. Adapt pattern:
   - Copy structure from PrimaryButton
   - Modify for new requirements
   - Maintain same prop patterns
   - Use consistent styling approach

4. Result: Consistent, pattern-following code
```

### Track-Specific Context Usage

**INSTANT/RAPID Tracks:**
- Quick pattern matching for fast development
- Reuse existing code with minimal modifications
- Focus on working implementation over optimization

**STANDARD Track:**
- Comprehensive pattern analysis
- Ensure architectural consistency
- Balance reuse with custom implementation

**ENTERPRISE Track:**
- Strict adherence to approved patterns
- Governance compliance checking
- Audit trail of pattern sources

## Cascade Operations

### Auto-Processing Child Elements
**If --cascade=true:**

When executing at platform level:
```
After platform execution completes:
  For each module in platform:
    Say: "🔄 CASCADE: Auto-executing module {module_name}"
    Execute: /ccu:develop --target=module --module={name} --from=plan

    If module has features and cascade still true:
      For each feature in module:
        Say: "🔄 CASCADE: Auto-executing feature {feature_name}"
        Execute: /ccu:develop --target=feature --feature={name} --from=plan
```

**Benefits**:
- Complete implementation in one command
- Consistent execution across all levels
- Automatic dependency handling
- Reduces manual execution by 80%

### Visual Cascade Progress
```
🔄 CASCADE EXECUTION PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:         ████████████████████ 100% ✅
├─ Module 1:      ████████████████████ 100% ✅
│  ├─ Feature A:  ████████████████████ 100% ✅
│  └─ Feature B:  ████████████░░░░░░░░ 60% 🔄
├─ Module 2:      ██████░░░░░░░░░░░░░░ 30% 🔄
└─ Module 3:      ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## MCP Integration Details

### Claude Context MCP
- **Package**: @zilliz/claude-context-mcp@latest
- **Protocol**: stdio (Model Context Protocol)
- **Dependencies**:
  - OpenAI API: Code embedding generation
  - Milvus Cloud: Vector storage and search
- **Development Benefits**:
  - Semantic understanding of existing code
  - Pattern reuse through similarity search
  - Consistency across generated code
  - 40% token usage reduction
  - Faster development through smart retrieval
- **Agent Integration**:
  - All agents can query Claude Context
  - Searches performed before generation
  - Patterns cached for performance
  - Results influence generation strategy

## Container Support (Docker)

When `--container=docker` is specified:

### Docker File Generation

**INSTANT/RAPID Track:**
```dockerfile
# Simple single-stage Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**STANDARD Track:**
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

**ENTERPRISE Track:**
```dockerfile
# Production-optimized with security hardening
FROM node:18-alpine AS builder
# Security updates
RUN apk update && apk upgrade
WORKDIR /app
# Use specific user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production
COPY --chown=nodejs:nodejs . .
RUN npm run build

FROM node:18-alpine
RUN apk update && apk upgrade && apk add --no-cache dumb-init
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
USER nodejs
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build/index.js"]
```

### Docker Compose Configuration

Generate `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Container Benefits

1. **Consistent Environment**: Same container runs everywhere
2. **Easy Deployment**: `docker-compose up` for local development
3. **Dependency Isolation**: No local installation required
4. **Hot Reload**: Volume mounting for development
5. **Production Ready**: Multi-stage builds for optimization

## Testing Strategy

### MCP Playwright Integration

**INSTANT**: 1 smoke test
```javascript
test('App launches', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/App/)
})
```

**RAPID**: 3 critical paths
```javascript
- User can log in
- Main feature works
- Data persists
```

**STANDARD**: 10 user journeys
```javascript
- Complete user workflows
- Error scenarios
- Edge cases
```

**ENTERPRISE**: 25+ comprehensive scenarios
```javascript
- Full regression suite
- Cross-browser testing
- Performance testing
- Accessibility testing
```

## Progress Tracking

Throughout execution:
```
╔═══════════════════════════════════════════════════════════════════╗
║  📊 EXECUTION PROGRESS                                           ║
╚═══════════════════════════════════════════════════════════════════╝

Phase 1: Foundation    ████████████████████ 100% ✅
Phase 2: Core         ████████████░░░░░░░░ 60% 🔄
Phase 3: Integration  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
Phase 4: Polish       ░░░░░░░░░░░░░░░░░░░░ 0% ⏳

Current Task: Implementing user authentication API
Agent: Backend Developer
Status: In Progress
Time Elapsed: 23 minutes
```

## Execution Metrics

### Real-time Metrics Display
```
📊 EXECUTION METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tasks per minute:        3.2
• Lines of code generated: 1,847
• Test pass rate:          98%
• Pattern reuse:           65%
• Error rate:              2%
• Time vs estimate:        -5% (ahead of schedule)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Smart Error Recovery

If task fails:
```
1. Capture error context
2. Search Mem0 for similar errors:
   mem0_search({
     type: "error",
     message: error_message,
     context: task_context
   })

3. If solution found (confidence > 70%):
   Say: "🔧 Found potential fix from previous project"
   Attempt auto-fix

4. Otherwise:
   Display clear fix options:
   [A] Retry task
   [B] Skip task (may break dependencies)
   [C] Manual fix required
   [D] Abort execution
```

## Output Messages

Upon completion:

```
✅ Development complete for {target}
🎉 Successfully executed {phase-count} phases

📊 Execution Summary:
- Tasks completed: {task-count}
- Tests passed: {test-count}
- Coverage: {coverage}%
- Build status: SUCCESS

📁 Output location:
- Platform: ./src/
- Module: ./ccu_worktree/module-{name}/
- Feature: ./ccu_worktree/module-{name}/features/{feature}/

🚀 Ready for next phase!

⚡ Next Steps:
• For local testing: npm start
• For validation: /ccu:validate --target={target}
• For deployment: /ccu:deploy --target={target}
• For documentation: /ccu:document --target={target}
```

## Error Handling

- If no plan found:
  ```
  ERROR: No development plan found
  Run first: /ccu:plan --target={target} --track={complexity}
  Cannot execute without a plan!
  ```

- If phase fails:
  ```
  ERROR: Phase {phase-name} failed
  Failed task: {task-name}
  Error: {error-message}

  Options:
  1. Fix and retry this phase
  2. Skip to next phase (not recommended)
  3. Abort execution
  ```

## Post-Execution

After successful execution:
1. All code is generated and tested
2. Application is ready to run
3. Documentation is complete
4. Tests are passing

The development phase is complete!

## Important Note

This command is PURELY EXECUTION - no planning, no decisions, just building according to the plan. All thinking and decision-making happened in Phases 1-6. This ensures:
- Predictable outcomes
- Consistent quality
- Efficient execution
- No scope creep

## Important Notes

### Pure Execution Philosophy
This command is PURELY EXECUTION with ZERO questions:
- No planning decisions
- No architectural choices
- No scope additions
- No optimizations unless specified
- Just building according to the plan

### Success Factors
- Follow the plan exactly
- Execute test gates religiously
- Reuse patterns when possible
- Maintain code quality standards
- Complete all tasks in sequence

Remember: This command is part of the 7-phase engineering process:
discover → specify → design → security → architect → plan → **develop**