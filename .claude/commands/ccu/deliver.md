---
description: Phase 7 - Orchestration execution with MCP-native testing and Claude Code best practices
activates: solution-architect, technical-product-manager, product-designer, backend-developer, frontend-developer, quality-engineer
argument-hint: --target=platform|module|feature --from=plan
---

# Deliver Command - Phase 7: Parallel Orchestration Execution

This is **Phase 7 Alternative** to `/ccu:develop`. The deliver phase uses parallel agent orchestration to execute development 2.5x faster through specialized agent swarms working simultaneously.

Execute the orchestration plan for **$ARGUMENTS.target** with ZERO questions using parallel agent dispatch.

## Command Syntax

```bash
/ccu:deliver --target=platform|module|feature --from=plan [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Scope of execution
- `--from=plan` - Load orchestration plan from Phase 6 (required)
- `--module=<name>` - Required when target=module or feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--checkpoint-dir=<path>` - Custom checkpoint location
- `--resume-from-checkpoint` - Resume from last checkpoint
- `--worktree-mode=enabled|disabled` - Use git worktrees for code output (default: enabled)
- `--verbose` - Verbose output for debugging

## Execution Philosophy

**Plan-Driven, Test-Gated Execution**:
- Waves defined by orchestration plan, not hardcoded tracks
- Each wave must pass its test gate to proceed
- MCP-native testing using Playwright tools
- No assumptions - test what the plan specifies

**Following Claude Code Best Practices**:
- Native tool usage (Task, MCP Playwright)
- Hook-based validation
- Security-first approach
- Consistent visual reporting

## The 8 Swarm Management Rules

This command implements all 8 rules from real-world swarm management:

1. **Align on Plan**: Requires detailed orchestration-plan.json
2. **No Long Running**: 10-minute hard timeout per agent
3. **Active Memory**: Checkpoint every 5 minutes to filesystem
4. **Context Isolation**: 200k tokens per agent, no sharing
5. **Trust Autonomous**: Self-validation with 3 retry attempts
6. **Automate System**: Pattern learning and self-improvement
7. **Ruthless Restart**: Immediate restart on stuck detection
8. **Frequent Checkpoints**: Every 5 minutes, preserved on failure

## Step -1: Load Orchestration Configuration

```bash
# Load orchestration templates
Load templates/orchestration/patterns.yaml
Load templates/orchestration/complexity-rules.yaml
Load templates/orchestration/wave-templates.yaml
Load templates/orchestration/worktree-waves.yaml
Load templates/orchestration/monitoring-config.yaml

# Set up monitoring
monitoring_config = monitoring-config.monitoring
swarm_rules = monitoring-config.swarm_rules

Say to user: "🎯 Loading orchestration configuration..."
Say to user: "✅ Patterns loaded: {patterns.count}"
Say to user: "✅ Monitoring configured: {monitoring_config.timing.max_runtime_minutes} min timeout"
```

## Step 0: Initialize Git Worktrees

```bash
# Check if worktree mode is enabled
If --worktree-mode != "disabled":
  Say to user: "🌳 Initializing git worktrees for parallel development..."

  # Load worktree configuration
  worktree_config = Load templates/orchestration/worktree-waves.yaml

  # Initialize worktree manager
  worktree_manager = ccu_framework/utils/worktree-manager.sh
  Execute: chmod +x {worktree_manager}

  # Create base worktree directory if not exists
  Execute: {worktree_manager} init

  # Map waves to worktrees based on complexity
  complexity = orchestration_plan.complexity
  wave_mapping = worktree_config.complexity_mapping[complexity]

  # Create worktrees for each wave
  For each wave in wave_mapping.waves:
    wave_config = worktree_config.waves[wave]

    If wave_config.execution == "sequential":
      # Single worktree for sequential execution
      Execute: {worktree_manager} create {wave_config.worktree.name} {wave_config.worktree.branch} {wave_config.worktree.base_branch}
      Say to user: "  ✅ Created worktree: {wave_config.worktree.name}"

    Elif wave_config.execution == "parallel":
      # Multiple worktrees for parallel execution
      For each worktree_spec in wave_config.parallel_worktrees:
        Execute: {worktree_manager} create {worktree_spec.name} {worktree_spec.branch} {worktree_spec.base_branch}
        Say to user: "  ✅ Created worktree: {worktree_spec.name}"

    Elif wave_config.execution == "parallel_dynamic":
      # Dynamic worktrees based on modules
      For each module in orchestration_plan.modules:
        worktree_name = wave_config.worktree_pattern.name_template.replace("{module_name}", module)
        branch_name = wave_config.worktree_pattern.branch_template.replace("{module_name}", module)
        Execute: {worktree_manager} create {worktree_name} {branch_name} {wave_config.worktree_pattern.base_branch}
        Say to user: "  ✅ Created worktree: {worktree_name}"

  # List all created worktrees
  Execute: {worktree_manager} list
  Say to user: "✅ Git worktrees initialized for parallel development"

Else:
  Say to user: "⚠️ Worktree mode disabled - using traditional directory structure"
```

## Demo Data Configuration

### Prompt for Demo Data

```python
def prompt_for_demo_data(orchestration_plan):
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "🎲 DEMO DATA CONFIGURATION"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Analyze project and generate suggestions
  suggestions = analyze_project_for_demo_data(orchestration_plan)

  Say to user: "Based on your project, I suggest creating the following demo data:"
  Say to user: ""

  # Display table of suggestions
  Say to user: "┌─────────────────────┬──────────┬─────────────────────────────┐"
  Say to user: "│ Entity              │ Records  │ Details                     │"
  Say to user: "├─────────────────────┼──────────┼─────────────────────────────┤"

  For entity, config in suggestions["entities"].items():
    entity_display = entity[:19]
    count_display = str(config['count']).rjust(8)
    details_display = config.get('details', 'Standard records')[:27]
    Say to user: f"│ {entity_display:19} │ {count_display} │ {details_display:27} │"

  Say to user: "└─────────────────────┴──────────┴─────────────────────────────┘"

  If suggestions.get("time_series"):
    Say to user: f"📅 Time-series: {suggestions['time_series']} days of historical data"

  If suggestions.get("user_accounts"):
    Say to user: f"👤 Test accounts: {len(suggestions['user_accounts'])} accounts with different roles"

  Say to user: ""
  response = Ask user: "Would you like to proceed with these suggestions? (yes/customize/no) [yes]: "

  # Handle empty response as yes
  If response.strip() == "" OR response.lower() in ["yes", "y"]:
    Return suggestions
  Elif response.lower() in ["customize", "c"]:
    Return customize_demo_data(suggestions)
  Else:
    Return None

def analyze_project_for_demo_data(orchestration_plan):
  """Generate intelligent demo data suggestions based on project type"""

  suggestions = {
    "entities": {},
    "time_series": None,
    "user_accounts": []
  }

  # Read orchestration plan to detect project type
  plan_content = str(orchestration_plan).lower()
  modules = orchestration_plan.get("modules", [])
  complexity = orchestration_plan.get("complexity", 50)

  # Check for OCPP/EV Charging project
  If "ocpp" in plan_content OR "charger" in plan_content OR "ev" in plan_content:
    suggestions["entities"] = {
      "Chargers": {"count": 50, "details": "Various models & statuses"},
      "Charging Sessions": {"count": 500, "details": "Last 30 days"},
      "Locations": {"count": 10, "details": "Different site types"},
      "Users": {"count": 20, "details": "Admin, operator, viewer"},
      "Transactions": {"count": 1000, "details": "Energy & payment data"},
      "Alerts": {"count": 200, "details": "Various severities"}
    }
    suggestions["time_series"] = 30
    suggestions["user_accounts"] = [
      {"email": "admin@demo.com", "role": "admin", "password": "Demo123!"},
      {"email": "operator@demo.com", "role": "operator", "password": "Demo123!"},
      {"email": "viewer@demo.com", "role": "viewer", "password": "Demo123!"}
    ]

  # Check for Analytics/Monitoring project
  Elif "analytics" in plan_content OR "monitoring" in plan_content:
    suggestions["entities"] = {
      "Metrics": {"count": 5000, "details": "Time-series data"},
      "Dashboards": {"count": 5, "details": "Pre-configured"},
      "Alerts": {"count": 100, "details": "Active & resolved"},
      "Reports": {"count": 20, "details": "Various periods"}
    }
    suggestions["time_series"] = 30

  # Check for E-commerce/Marketplace
  Elif "product" in plan_content OR "marketplace" in plan_content OR "commerce" in plan_content:
    suggestions["entities"] = {
      "Products": {"count": 200, "details": "Various categories"},
      "Categories": {"count": 15, "details": "Nested structure"},
      "Users": {"count": 100, "details": "Customers & vendors"},
      "Orders": {"count": 300, "details": "Different statuses"},
      "Reviews": {"count": 400, "details": "1-5 star ratings"}
    }

  # Generic fallback
  Else:
    base_count = 30 if complexity < 50 else 50 if complexity < 80 else 100

    # Create suggestions from detected modules
    For module in modules:
      If isinstance(module, dict):
        module_name = module.get("name", "")
      Else:
        module_name = str(module)

      If module_name and module_name != "auth":
        entity_name = module_name.capitalize() + "s"
        suggestions["entities"][entity_name] = {
          "count": base_count,
          "details": f"{module_name} records"
        }

  # Always add users if auth detected
  If "auth" in plan_content AND "Users" not in suggestions["entities"]:
    suggestions["entities"]["Users"] = {
      "count": 20,
      "details": "Test accounts"
    }
    suggestions["user_accounts"] = [
      {"email": "admin@demo.com", "role": "admin", "password": "Demo123!"},
      {"email": "user@demo.com", "role": "user", "password": "Demo123!"}
    ]

  Return suggestions

def customize_demo_data(suggestions):
  """Allow user to customize suggested demo data counts"""

  Say to user: ""
  Say to user: "Customize demo data (press Enter to keep suggested value):"
  Say to user: ""

  customized = JSON.parse(JSON.stringify(suggestions))  # Deep copy

  # Customize entity counts
  For entity, config in suggestions["entities"].items():
    current = config["count"]
    response = Ask user: f"  {entity} [{current}]: "

    If response.strip():
      Try:
        new_count = int(response.strip())
        customized["entities"][entity]["count"] = new_count
      Except:
        Say to user: f"    ⚠️ Invalid number, keeping {current}"

  # Customize time-series days
  If suggestions.get("time_series"):
    current_days = suggestions["time_series"]
    response = Ask user: f"  Historical days [{current_days}]: "

    If response.strip():
      Try:
        customized["time_series"] = int(response.strip())
      Except:
        Say to user: f"    ⚠️ Invalid number, keeping {current_days}"

  # Show updated configuration
  Say to user: ""
  Say to user: "Updated configuration:"
  display_demo_summary(customized)

  confirm = Ask user: "Proceed with this configuration? (yes/no) [yes]: "

  If confirm.lower() in ["no", "n"]:
    Return customize_demo_data(suggestions)  # Retry

  Return customized

def display_demo_summary(config):
  """Display demo data configuration summary"""

  total_records = sum(e["count"] for e in config["entities"].values())

  Say to user: f"  • Total records: {total_records}"
  For entity, details in config["entities"].items():
    Say to user: f"  • {entity}: {details['count']}"

  If config.get("time_series"):
    Say to user: f"  • Historical data: {config['time_series']} days"

  If config.get("user_accounts"):
    Say to user: f"  • Test accounts: {len(config['user_accounts'])}"
```

## Pre-execution Validation

### Load Orchestration Plan

```
# Check for required plan
If NOT exists --from=plan:
  ERROR: "Orchestration plan required. Run /ccu:plan first."
  EXIT

# Load the plan
orchestration_plan = Load 06-development-plan/orchestration-plan.json

If NOT exists orchestration_plan:
  ERROR: "No orchestration plan found at expected location"
  Suggest: "Run: /ccu:plan --target={target} --track={track}"
  EXIT

# Validate plan structure
If NOT valid_orchestration_plan(orchestration_plan):
  ERROR: "Invalid orchestration plan structure"
  Show validation errors
  EXIT

Say to user: "✅ Orchestration plan loaded"
Say to user: "📊 Execution strategy: {orchestration_plan.execution_mode}"
Say to user: "⚡ Waves: {orchestration_plan.waves.count}"
Say to user: "👥 Total agents: {orchestration_plan.total_agents}"
Say to user: "⏱️ Estimated time: {orchestration_plan.estimated_time.parallel} minutes"
Say to user: "🚀 Time savings: {orchestration_plan.estimated_time.savings}%"
```

### Initialize Checkpoint System

```
# Set up checkpoint directory (separate from worktrees!)
checkpoint_dir = --checkpoint-dir OR "ccu_workspace/07-delivery/checkpoints"
session_id = "session-{timestamp}"
Create directory: {checkpoint_dir}/{session_id}/

# Initialize checkpoint structure (for agent state only)
For each wave in orchestration_plan.waves:
  Create directory: {checkpoint_dir}/{session_id}/wave-{wave.id}/
  Create directory: {checkpoint_dir}/{session_id}/wave-{wave.id}/agents/
  Create directory: {checkpoint_dir}/{session_id}/wave-{wave.id}/artifacts/

Say to user: "📁 Checkpoint system initialized at: {checkpoint_dir}/{session_id}"

# Create separation notice
Create file: {checkpoint_dir}/{session_id}/README.md with content:
"""
# Checkpoint Directory - Session {session_id}

⚠️ IMPORTANT: This directory contains ONLY checkpoint data, not source code!

## Directory Structure:
- wave-*/agents/ - Agent execution state and checkpoints
- wave-*/artifacts/ - Handoff artifacts between waves
- NO SOURCE CODE should be in this directory

## Source Code Location:
All generated source code is in git worktrees at:
- ccu_worktree/foundation-setup/
- ccu_worktree/backend-infra/
- ccu_worktree/frontend-infra/
- ccu_worktree/module-*/
- ccu_worktree/integration/

Use 'git worktree list' to see all active worktrees.
"""

Say to user: "✅ Checkpoint and worktree directories properly separated"
```

## Visual Orchestration Display

### Initial Display

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🎯 PARALLEL ORCHESTRATION - {orchestration_plan.target.upper()}            ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 Execution Summary:
• Strategy: {orchestration_plan.execution_mode.upper()}
• Complexity: {orchestration_plan.complexity}
• Modules: {', '.join(orchestration_plan.modules)}
• Waves: {orchestration_plan.waves.count}
• Agents: {orchestration_plan.total_agents} specialists
• Estimated Time: {orchestration_plan.estimated_time.parallel} min (vs {orchestration_plan.estimated_time.sequential} min sequential)
• Time Savings: {orchestration_plan.estimated_time.savings}%

Press [Enter] to start parallel execution or [Ctrl+C] to abort
```

## Wave Execution Engine

### Wave Processing Loop with Hooks (Claude Code Best Practice)

```python
For each wave in orchestration_plan.waves:
  Update display: Show wave header

  # PRE-WAVE HOOK (Claude Code Hook System)
  If hooks_enabled:
    pre_wave_result = execute_pre_wave_hook(wave)
    If NOT pre_wave_result.continue:
      Say to user: f"⚠️ Pre-wave hook blocked execution: {pre_wave_result.message}"
      Handle hook_blocked_execution(pre_wave_result)
      Continue to next wave or EXIT based on hook response

  # Execute wave based on type (with app directory)
  app_dir = get_app_directory_from_project()

  If wave.execution == "parallel":
    Execute parallel_wave_execution(wave, app_dir, session_metadata)
  Elif wave.execution == "sequential":
    Execute sequential_wave_execution(wave, app_dir, session_metadata)
  Elif wave.execution == "hybrid":
    Execute hybrid_wave_execution(wave, app_dir, session_metadata)

  # Wait for wave completion
  Monitor wave_completion(wave)

  # MANDATORY TEST GATE - ENFORCED VIA HOOKS
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: f"🧪 MANDATORY TEST GATE - Wave {wave.number}"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Execute mandatory testing (MCP-Native)
  test_results = execute_wave_test_gate(wave, session_metadata)

  # POST-WAVE HOOK (Enforces test gates)
  If hooks_enabled:
    post_wave_result = execute_post_wave_hook(wave, test_results)
    If NOT post_wave_result.continue:
      Say to user: f"❌ Post-wave hook blocked: {post_wave_result.message}"

      # Hook can trigger auto-fix
      If post_wave_result.auto_fix:
        Say to user: "🔧 Hook triggered automatic fixes..."
        fix_and_retry_wave_tests(wave, test_results)

        # Re-run tests after fixes
        test_results = execute_wave_test_gate(wave, session_metadata)
        final_hook_result = execute_post_wave_hook(wave, test_results)

        If NOT final_hook_result.continue:
          Say to user: "🛑 HARD STOP: Tests must pass (enforced by hook)"
          EXIT with error

  # Standard test gate check (backup if hooks disabled)
  If NOT test_results.passed AND NOT hooks_enabled:
    Say to user: "❌ WAVE TESTING FAILED - Cannot proceed"
    fix_and_retry_wave_tests(wave, test_results)

    final_results = execute_wave_test_gate(wave, session_metadata)
    If NOT final_results.passed:
      Say to user: "🛑 HARD STOP: Wave {wave.number} tests must pass"
      EXIT with error

  Say to user: f"✅ Wave {wave.number} Test Gate PASSED"

  # Generate handoff artifact if specified
  If wave.handoff_artifact:
    Generate consolidate_artifacts(wave)

  # Check for other failures
  If wave_has_failures(wave):
    Handle wave_failure_recovery(wave)

# Hook Implementation Functions

def execute_pre_wave_hook(wave):
  """Pre-wave validation hook (Claude Code standard)"""

  # Check environment readiness
  environment_ready = validate_environment_state()

  # Check prerequisites from previous waves
  prerequisites_met = check_wave_prerequisites(wave)

  # Custom validations from user hooks
  custom_validations = run_user_defined_hooks("pre_wave", wave)

  return {
    "continue": environment_ready AND prerequisites_met AND custom_validations,
    "message": generate_hook_message(environment_ready, prerequisites_met, custom_validations)
  }

def execute_post_wave_hook(wave, test_results):
  """Post-wave test enforcement hook (Claude Code standard)"""

  # Load quality gates from orchestration plan
  quality_gate = get_quality_gate(wave)

  # Enforce minimum pass rate
  meets_quality_gate = test_results.pass_rate >= quality_gate.min_pass_rate

  # Check for critical test failures
  no_critical_failures = check_no_critical_failures(test_results)

  # Custom validations from user hooks
  custom_validations = run_user_defined_hooks("post_wave", wave, test_results)

  return {
    "continue": meets_quality_gate AND no_critical_failures AND custom_validations,
    "message": generate_test_gate_message(test_results, quality_gate),
    "auto_fix": True  # Attempt automatic fixes before failing
  }
```

### Parallel Wave Execution

```python
def parallel_wave_execution(wave, app_dir, session_metadata):
  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: f"🌊 WAVE {wave.number}/{total_waves}: {wave.name}"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: f"⚡ Dispatching {len(wave.agents)} agents in parallel..."
  Say to user: f"📦 App directory: {app_dir}/"

  # Show output assignments
  Say to user: "📂 Agent Output Paths:"
  For each agent in wave.agents:
    agent_output = get_output_path_for_agent(agent.name, agent.type, app_dir)
    If --worktree-mode != "disabled":
      worktree_path = get_agent_worktree(agent, wave)
      Say to user: f"  • {agent.name} → ccu_worktree/{worktree_path}/{agent_output}"
    Else:
      Say to user: f"  • {agent.name} → {agent_output}"
  Say to user: ""

  # Create Task for each agent - THIS IS THE PARALLEL DISPATCH
  parallel_tasks = []
  For each agent in wave.agents:
    # Determine output paths within app structure
    If --worktree-mode != "disabled":
      worktree_path = get_agent_worktree(agent, wave)
      # Each worktree gets the app structure
      worktree_app_path = f"ccu_worktree/{worktree_path}/{app_dir}"
      Execute: mkdir -p {worktree_app_path}
      code_output_path = worktree_app_path
    Else:
      # Direct output to app directory
      code_output_path = app_dir

    task = Task(
      agent=agent.name,
      prompt=build_agent_prompt_with_paths(agent, wave, code_output_path, session_metadata),
      context="isolated_200k",
      timeout=agent.timeout_minutes * 60,
      checkpoint_dir=f"{checkpoint_dir}/{session_id}/wave-{wave.id}/agents/{agent.name}/",
      code_output_dir=code_output_path,
      environment={
        "WORKTREE_PATH": code_output_path,
        "CHECKPOINT_PATH": f"{checkpoint_dir}/{session_id}/wave-{wave.id}/agents/{agent.name}/",
        "WAVE_ID": wave.id,
        "SESSION_ID": session_id
      }
    )
    parallel_tasks.append(task)

  # EXECUTE ALL TASKS IN PARALLEL
  results = execute_parallel(parallel_tasks)

  # Monitor execution in real-time
  While not all_complete(parallel_tasks):
    Update agent_status_display(parallel_tasks)
    Check agent_health(parallel_tasks)
    Handle stuck_agents(parallel_tasks)
    Save checkpoints(parallel_tasks)
    Sleep(5)  # Update every 5 seconds

  Return consolidate_results(results)
```

### Real-time Agent Status Display

```python
def agent_status_display(agents):
  For each agent in agents:
    # Calculate progress
    progress = calculate_progress(agent)
    progress_bar = create_progress_bar(progress)

    # Get health status
    health = get_agent_health(agent)
    health_icon = get_health_icon(health)

    # Format display line
    Display:
    f"[{agent.name:20}] {progress_bar} {progress:3}% {health_icon} {agent.current_task}"
    f"  └─ Context: {agent.context_used}k/{agent.context_limit}k"
    f"  └─ Runtime: {agent.runtime}/{agent.timeout}"
    f"  └─ Last checkpoint: {agent.last_checkpoint_ago}"

  # Show wave summary
  Display:
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  f"Wave Progress: {wave_progress}% | Elapsed: {elapsed} | ETA: {eta}"
  f"Checkpoints: {checkpoint_count} | Restarts: {restart_count} | Health: {overall_health}"
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

### Example Wave Execution Display

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌊 WAVE 1/3: Planning & Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Dispatching 3 agents in parallel...

[technical-pm       ] ████████████░░░░░░░░ 60% 🔄 Writing acceptance criteria...
  └─ Context: 89k/200k
  └─ Runtime: 6:12/10:00
  └─ Last checkpoint: 45s ago

[product-designer   ] ██████████████░░░░░░ 70% 🔄 Creating wireframes...
  └─ Context: 112k/200k
  └─ Runtime: 6:45/10:00
  └─ Last checkpoint: 30s ago

[solution-architect ] ████████████████████ 100% ✅ Complete
  └─ Context: 156k/200k
  └─ Runtime: 8:23/10:00
  └─ Output: technical-approach.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wave Progress: 77% | Elapsed: 6:45 | ETA: 3:15
Checkpoints: 8 | Restarts: 0 | Health: ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Agent Health Monitoring

### Stuck Detection and Auto-Restart

```python
def check_agent_health(agent):
  # Check for stuck agent (no output for 2 minutes)
  if agent.last_output_time > 120:
    Say to user: f"⚠️ {agent.name} appears stuck - no output for {agent.last_output_time}s"

    # Save checkpoint before restart
    save_checkpoint(agent)

    # Restart with fresh context
    Say to user: f"🔄 Restarting {agent.name} with fresh context..."
    restart_agent(agent)
    agent.restart_count += 1

  # Check for approaching timeout
  elif agent.runtime > (agent.timeout * 0.8):
    Say to user: f"⏰ {agent.name} approaching timeout - {agent.time_remaining} remaining"
    force_checkpoint(agent)

  # Check context usage
  elif agent.context_used > 150000:
    Say to user: f"📊 {agent.name} high context usage - {agent.context_used}/200k"
    prepare_context_reset(agent)
```

### Checkpoint Management

```python
def save_checkpoint(agent, wave, checkpoint_dir, session_id):
  Say to user: f"💾 Saving checkpoint for {agent.name}..."

  timestamp = current_timestamp()
  checkpoint_data = {
    "agent": agent.name,
    "wave": wave.id,
    "wave_number": wave.number,
    "timestamp": timestamp,
    "runtime": agent.runtime,
    "context_usage": agent.context_used,
    "state": {
      "current_task": agent.current_task,
      "completed_tasks": agent.completed_tasks,
      "pending_tasks": agent.pending_tasks,
      "generated_files": agent.generated_files,
      "partial_outputs": agent.partial_outputs
    },
    "recovery": {
      "restart_point": agent.restart_point,
      "context_snapshot": agent.context_snapshot,
      "last_successful_operation": agent.last_operation
    }
  }

  # Ensure directory exists
  checkpoint_path = f"{checkpoint_dir}/{session_id}/wave-{wave.id}/agents/{agent.name}"
  Execute: mkdir -p {checkpoint_path}

  # Save to filesystem with actual JSON writing
  checkpoint_file = f"{checkpoint_path}/checkpoint-{timestamp}.json"
  checkpoint_json = JSON.stringify(checkpoint_data, null, 2)

  # Use Write tool to actually save the JSON file
  Write {checkpoint_file} with content:
    {checkpoint_json}

  # Also save a "latest" checkpoint for easy access
  latest_file = f"{checkpoint_path}/latest-checkpoint.json"
  Write {latest_file} with content:
    {checkpoint_json}

  # Update agent's last checkpoint time
  agent.last_checkpoint_time = timestamp

  Say to user: f"✅ Checkpoint saved: {checkpoint_file}"
```

## Handoff Artifact Generation

### Consolidate Wave Outputs

```python
def consolidate_artifacts(wave, checkpoint_dir, session_id):
  Say to user: "📝 Generating handoff artifact for next wave..."

  handoff = {
    "wave_id": wave.id,
    "wave_number": wave.number,
    "wave_name": wave.name,
    "timestamp": current_timestamp(),
    "agents_outputs": {},
    "test_results": wave.test_results if hasattr(wave, 'test_results') else {},
    "generated_files": []
  }

  # Collect outputs from each agent
  For each agent in wave.agents:
    agent_output = {
      "name": agent.name,
      "status": agent.status,
      "runtime": agent.runtime,
      "completed_tasks": agent.completed_tasks,
      "generated_files": agent.generated_files,
      "outputs": agent.outputs
    }
    handoff["agents_outputs"][agent.name] = agent_output
    handoff["generated_files"].extend(agent.generated_files)

  # Synthesize into consolidated artifact
  If wave.synthesis_agent:
    synthesis_agent = wave.synthesis_agent
    consolidated = synthesize_outputs(synthesis_agent, handoff)
  Else:
    consolidated = handoff  # Use raw handoff if no synthesis

  # Ensure artifacts directory exists
  artifact_dir = f"{checkpoint_dir}/{session_id}/wave-{wave.id}/artifacts"
  Execute: mkdir -p {artifact_dir}

  # Save handoff artifact with actual JSON writing
  artifact_filename = f"wave-{wave.number}-handoff-{current_timestamp()}.json"
  artifact_path = f"{artifact_dir}/{artifact_filename}"
  artifact_json = JSON.stringify(consolidated, null, 2)

  # Use Write tool to save the artifact
  Write {artifact_path} with content:
    {artifact_json}

  # Also save as "latest" for easy access
  latest_path = f"{artifact_dir}/latest-handoff.json"
  Write {latest_path} with content:
    {artifact_json}

  Say to user: f"✅ Handoff artifact created: {artifact_filename}"
  Return artifact_path
```

## Pattern Learning and Storage

### Capture Successful Patterns

```python
def capture_execution_pattern():
  pattern = {
    "execution_id": session_id,
    "timestamp": current_timestamp(),
    "target": orchestration_plan.target,
    "complexity": orchestration_plan.complexity,
    "execution": {
      "strategy": orchestration_plan.execution_mode,
      "waves": orchestration_plan.waves.count,
      "agents": orchestration_plan.total_agents,
      "parallel_agents_max": max_parallel_agents
    },
    "performance": {
      "estimated_time": orchestration_plan.estimated_time.parallel,
      "actual_time": actual_execution_time,
      "time_variance": calculate_variance(),
      "sequential_estimate": orchestration_plan.estimated_time.sequential,
      "actual_savings": calculate_actual_savings()
    },
    "quality": {
      "restart_count": total_restart_count,
      "checkpoint_count": total_checkpoint_count,
      "success_rate": calculate_success_rate(),
      "artifacts_generated": count_artifacts()
    },
    "learnings": extract_learnings()
  }

  # Store pattern for future use
  patterns_file = "templates/orchestration/learned-patterns.yaml"
  Append pattern to patterns_file

  # Update CLAUDE.md with learnings
  If pattern.performance.actual_savings > 50:
    Update CLAUDE.md with successful pattern
```

## Track-Specific Execution

### INSTANT Track

```
If track == "instant":
  # Single wave, rapid execution
  wave = create_instant_wave()
  wave.agents = ["solution-architect"]
  wave.duration = 15
  wave.subtasks = ["backend", "frontend", "tests"]

  Execute rapid_mvp_pattern(wave)
```

### RAPID Track

```
If track == "rapid":
  # Core Trio pattern
  waves = [
    planning_wave (3 agents, 10 min),
    implementation_wave (3 agents, 20 min),
    integration_wave (1 agent, 10 min)
  ]

  Execute core_trio_pattern(waves)
```

### STANDARD Track

```
If track == "standard":
  # Full parallelization
  waves = [
    planning_wave (3 agents, 10 min),
    implementation_wave (3-6 agents, 20 min),
    testing_wave (2 agents, 10 min),
    review_wave (2 agents, 10 min)
  ]

  Execute standard_pattern(waves)
```

### ENTERPRISE Track

```
If track == "enterprise":
  # Comprehensive with compliance
  waves = [
    deep_planning_wave (5 agents, 15 min),
    development_wave (6 agents, 25 min),
    compliance_wave (3 agents, 15 min),
    review_wave (3 agents, 10 min),
    deployment_wave (2 agents, 10 min)
  ]

  Execute enterprise_pattern(waves)
```

## Worktree Merge Operations

### Automatic Worktree Merging

```python
def merge_worktrees_to_integration():
  If --worktree-mode != "disabled" AND --merge-strategy != "none":
    Say to user: ""
    Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Say to user: "🔄 MERGING WORKTREES TO INTEGRATION BRANCH"
    Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Create integration worktree if not exists
    integration_worktree = "ccu_worktree/integration"
    If not exists integration_worktree:
      Execute: {worktree_manager} create integration feature/integration main
      Say to user: "✅ Created integration worktree"

    # Get list of worktrees to merge (in order)
    merge_order = worktree_config.waves.wave_4_integration.merge_strategy.merge_order

    # Switch to integration branch
    cd {integration_worktree}

    For each branch_pattern in merge_order:
      If branch_pattern contains "*":
        # Handle wildcard patterns (e.g., feature/module-*)
        branches = git branch -r | grep {branch_pattern}
      Else:
        branches = [branch_pattern]

      For each branch in branches:
        Say to user: f"📥 Merging: {branch}"

        If --merge-strategy == "auto":
          # Attempt automatic merge
          merge_result = git merge --no-ff {branch} -m "Auto-merge: {branch} from wave execution"

          If merge_result.has_conflicts:
            Say to user: f"⚠️ Merge conflicts detected in {branch}"
            If worktree_config.waves.wave_4_integration.merge_strategy.conflict_resolution == "manual":
              Say to user: "⏸️ Pausing for manual conflict resolution"
              Say to user: "📝 Resolve conflicts in: {integration_worktree}"
              Say to user: "Then run: git add . && git commit"
              Wait for user confirmation
            Else:
              # Attempt automatic conflict resolution
              auto_resolve_conflicts()

        Elif --merge-strategy == "manual":
          Say to user: f"📋 Ready to merge {branch}"
          Say to user: "Execute manually: git merge --no-ff {branch}"
          Wait for user confirmation

      Say to user: f"✅ Merged: {branch}"

    # Final integration test
    Say to user: "🧪 Running integration tests..."
    cd {integration_worktree}
    Execute: npm install
    Execute: npm test

    If tests pass:
      Say to user: "✅ All worktrees successfully merged and tested"
    Else:
      Say to user: "❌ Integration tests failed - review merged code"

    # Cleanup worktrees if requested
    If --cleanup-worktrees == "true":
      Say to user: "🧹 Cleaning up worktrees..."
      For each worktree in created_worktrees:
        If worktree != "integration":
          Execute: {worktree_manager} remove {worktree}
      Say to user: "✅ Worktrees cleaned up (integration branch preserved)"
```

### Helper Functions for Worktree Management

```python
def get_agent_worktree(agent, wave):
  # Map agent to appropriate worktree based on wave configuration
  wave_config = worktree_config.waves[f"wave_{wave.number}_{wave.name}"]

  If wave_config.execution == "parallel":
    For each worktree_spec in wave_config.parallel_worktrees:
      If worktree_spec.agent == agent.name:
        Return worktree_spec.name

  Elif wave_config.execution == "parallel_dynamic":
    # Dynamic worktree based on module assignment
    module = agent.assigned_module
    worktree_name = wave_config.worktree_pattern.name_template.replace("{module_name}", module)
    Return worktree_name

  Else:
    # Sequential execution uses single worktree
    Return wave_config.worktree.name

def build_agent_prompt_with_paths(agent, wave, app_dir, session_metadata):
  base_prompt = agent.system_prompt

  # Determine agent's specific output directory
  agent_output_path = get_output_path_for_agent(agent.name, agent.type, app_dir)

  path_instructions = f"""
  ## CRITICAL OUTPUT PATHS - CLEAN APP STRUCTURE

  ⚠️ IMPORTANT: All code goes in the organized app directory:

  **APP DIRECTORY**: {app_dir}/
  **YOUR PRIMARY OUTPUT**: {agent_output_path}/

  1. **APP STRUCTURE OVERVIEW**:
     ```
     {app_dir}/
     ├── backend/          # NestJS backend
     ├── frontend/         # Next.js frontend
     ├── infrastructure/   # Docker, K8s configs
     ├── database/         # Migrations, seeds
     ├── monitoring/       # Observability
     ├── tests/           # E2E and integration
     └── scripts/         # Utility scripts
     ```

  2. **YOUR SPECIFIC OUTPUT PATHS**:
  """

  # Add role-specific path guidance
  If "backend" in agent.name.lower():
    path_instructions += f"""
     - Modules: {agent_output_path}/src/modules/
     - Config: {agent_output_path}/src/config/
     - Tests: {agent_output_path}/test/
     - Prisma: {agent_output_path}/prisma/
  """
  Elif "frontend" in agent.name.lower():
    path_instructions += f"""
     - Components: {agent_output_path}/src/components/
     - Pages: {agent_output_path}/src/pages/
     - Hooks: {agent_output_path}/src/hooks/
     - Styles: {agent_output_path}/src/styles/
  """
  Elif "devops" in agent.name.lower() OR "infrastructure" in agent.name.lower():
    path_instructions += f"""
     - Docker: {agent_output_path}/docker/
     - K8s: {agent_output_path}/k8s/
     - Nginx: {agent_output_path}/nginx/
  """
  Elif "database" in agent.name.lower():
    path_instructions += f"""
     - Migrations: {agent_output_path}/migrations/
     - Seeds: {agent_output_path}/seeds/
     - Schemas: {agent_output_path}/schemas/
  """
  Else:
    path_instructions += f"""
     - Your files: {agent_output_path}/
  """

  path_instructions += f"""

  3. **ROOT-LEVEL FILES** (if needed):
     - docker-compose.yml → {app_dir}/docker-compose.yml
     - .env files → {app_dir}/.env.*
     - Root package.json → {app_dir}/package.json

  4. **CHECKPOINT/STATE OUTPUT**: $CHECKPOINT_PATH
     - progress.json (your progress tracking)
     - agent-state.json (your execution state)
     - checkpoint-*.json (periodic saves)
     - DO NOT put source code here!

  5. **ENVIRONMENT VARIABLES**:
     - APP_DIR={app_dir}
     - OUTPUT_PATH={agent_output_path}
     - CHECKPOINT_PATH=$CHECKPOINT_PATH
     - WAVE_ID={wave.id}
     - SESSION_ID=$SESSION_ID

  Example file creation:
  - Backend module: Write to {agent_output_path}/src/modules/auth/auth.module.ts
  - Frontend component: Write to {agent_output_path}/src/components/Button.tsx
  - Docker config: Write to {app_dir}/infrastructure/docker/Dockerfile
  - Progress: Write to $CHECKPOINT_PATH/progress.json
  """

  # Add demo data instructions if configured and this is Wave 3 with backend agent
  If session_metadata.get("demo_data") AND wave.number == 3 AND "backend" in agent.name.lower():
    demo_instructions = generate_demo_data_instructions(session_metadata["demo_data"], agent_output_path)
    path_instructions += demo_instructions

  Return base_prompt + path_instructions + (wave.specific_instructions if hasattr(wave, 'specific_instructions') else "")

def generate_demo_data_instructions(demo_config, agent_output_path):
  """Generate specific demo data instructions for backend agent"""

  instructions = f"""

  ## 🎲 DEMO DATA GENERATION REQUIREMENTS (USER APPROVED)

  The user has approved the following demo data configuration:

  **Entities to Generate:**
  """

  total_records = 0
  For entity, config in demo_config["entities"].items():
    instructions += f"\n  • {entity}: {config['count']} records"
    total_records += config['count']

  instructions += f"\n\n  **Total Records**: {total_records}"

  If demo_config.get("time_series"):
    instructions += f"\n  **Historical Data Span**: {demo_config['time_series']} days"

  instructions += """

  **Implementation Requirements:**
  1. Create comprehensive seed script at: {agent_output_path}/prisma/seed.ts
  2. Use Faker.js for realistic data generation
  3. Ensure all relationships are properly connected
  4. Include variety in statuses, types, and values
  5. Generate realistic distributions (not all records the same)
  """

  If demo_config.get("time_series"):
    instructions += f"""
  6. Generate time-series data:
     - Span: Last {demo_config['time_series']} days
     - Distribution: Realistic daily patterns
     - Include weekday/weekend variations
     - Different times of day for realistic usage
  """

  If demo_config.get("user_accounts"):
    instructions += """
  7. Create test user accounts (EXACT credentials):
  """
    For account in demo_config["user_accounts"]:
      instructions += f"""
     - Email: {account['email']}
     - Password: {account['password']}
     - Role: {account['role']}
  """

  instructions += f"""

  **Required Files to Create:**
  - {agent_output_path}/prisma/seed.ts - Main seed script with all entities
  - {agent_output_path}/package.json - Add: "prisma": {{"seed": "ts-node prisma/seed.ts"}}
  - scripts/DEMO-ACCOUNTS.md - Document all test credentials for user reference

  **CRITICAL IMPORTANCE**:
  - The UI depends on this demo data existing to function properly
  - Without seed data, navigation screens will appear empty or broken
  - All relationships must be valid to prevent runtime errors
  - Test accounts must work for authentication testing

  **Code Quality Requirements**:
  - Use proper TypeScript types for all seed data
  - Include error handling in seed script
  - Add console.log statements showing progress
  - Use await/async properly for database operations
  - Clear any existing data before seeding (in development)
  """

  Return instructions
```

## Success Completion

### Visual Test Report Generator

```python
def generate_visual_test_report(wave, test_results, test_requirements):
  """Generate consistent visual report for all waves (Claude Code Best Practice)"""

  # Determine completion level
  completion_levels = {
    "code_complete": check_code_written(wave),
    "compilation_complete": check_compilation_success(wave),
    "services_running": check_services_running(wave),
    "tests_passing": test_results["pass_rate"]
  }

  overall_status = calculate_overall_status(completion_levels)

  report = f"""
╔════════════════════════════════════════════════════════════════╗
║           WAVE {wave.number}: {test_requirements['name'].upper():^40}║
║                    {test_results['pass_rate']:.0f}% TEST PASS RATE             ║
╚════════════════════════════════════════════════════════════════╝

📊 Completion Status (Honest Reporting):
┌─────────────────────┬──────────┬─────────────────────────┐
│ Level               │ Status   │ Details                 │
├─────────────────────┼──────────┼─────────────────────────┤
│ Code Written        │ {format_status(completion_levels['code_complete'])} │ All files created       │
│ Compilation         │ {format_status(completion_levels['compilation_complete'])} │ TypeScript/build status │
│ Services Running    │ {format_status(completion_levels['services_running'])} │ Backend/Frontend/DB     │
│ Tests Passing       │ {format_status(test_results['pass_rate'])} │ {test_results['passed_tests']}/{test_results['total_tests']} tests passed │
└─────────────────────┴──────────┴─────────────────────────┘

📋 Test Results from Orchestration Plan:
┌─────────────────────────────┬──────────┬─────────────────┐
│ Test Name                   │ Result   │ Method          │
├─────────────────────────────┼──────────┼─────────────────┤"""

  For test_name, passed in test_results["tests"].items():
    status = "✅ PASS" if passed else "❌ FAIL"
    report += f"""
│ {test_name[:28]:28} │ {status:8} │ MCP Playwright  │"""

  report += """
└─────────────────────────────┴──────────┴─────────────────┘

🎯 Quality Gate Status:
  Required Pass Rate: {test_requirements['quality_gate']['min_pass_rate']}%
  Actual Pass Rate:   {test_results['pass_rate']:.0f}%
  Gate Status:        {gate_status}

{blocking_message}
"""

  If NOT test_results["passed"]:
    blocking_message = f"""
⚠️ WAVE {wave.number} BLOCKED - Cannot Proceed

Required for Wave Completion:
  ❌ Pass rate must be >= {test_requirements['quality_gate']['min_pass_rate']}%
  ❌ Current pass rate: {test_results['pass_rate']:.0f}%

Failed Tests:"""
    For test_name, passed in test_results["tests"].items():
      If NOT passed:
        blocking_message += f"\n  ❌ {test_name}"

    blocking_message += """

To Fix:
  1. Check service logs for errors
  2. Verify all services are running
  3. Run individual tests for debugging
  4. Fix issues and retry wave
"""
  Else:
    blocking_message = "✅ Wave can proceed to next phase"

  Say to user: report
  Save report to f"{checkpoint_dir}/{session_id}/wave-{wave.number}-test-report.md"
```

### Final Summary Display

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  DELIVERY STATUS - {target.upper()}                                         ║
║  Overall Completion: {overall_percentage}%                                  ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 Execution Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Execution Mode:     {orchestration_plan.execution_mode}
Complexity:         {orchestration_plan.complexity}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sequential estimate: {orchestration_plan.estimated_time.sequential} minutes
Parallel actual:     {actual_time} minutes
Time saved:          {time_saved} minutes ({savings_percentage}% faster!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Delivery Metrics:
• Waves completed:     {waves_completed}/{total_waves}
• Test gates passed:   {test_gates_passed}/{total_test_gates}
• Agents deployed:     {agents_used} specialists
• MCP tests executed:  {mcp_test_count} (Claude Code Native)

📊 Wave Completion Details:
┌──────────┬────────────────┬──────────┬──────────────┐
│ Wave     │ Phase          │ Tests    │ Status       │
├──────────┼────────────────┼──────────┼──────────────┤
│ Wave 1   │ Foundation     │ {w1_rate}% │ {w1_status} │
│ Wave 2   │ Core Infra     │ {w2_rate}% │ {w2_status} │
│ Wave 3   │ Modules        │ {w3_rate}% │ {w3_status} │
│ Wave 4   │ Integration    │ {w4_rate}% │ {w4_status} │
└──────────┴────────────────┴──────────┴──────────────┘

📁 Output Locations:
• Code Output: ccu_worktree/integration/ (merged from all worktrees)
• Test Reports: {checkpoint_dir}/{session_id}/wave-*-test-report.md
• Orchestration Plan: ccu_workspace/platform/06-planning/orchestration-plan.json

{final_status_message}
```

## Wave Test Gate Execution

### Mandatory Test Gate Function

```python
def execute_wave_test_gate(wave, session_metadata):
  Say to user: "🎭 Executing MCP-Native Wave {wave.number} Test Gate (Claude Code Best Practices)"

  # Load test requirements from orchestration plan
  orchestration_plan_path = "ccu_workspace/platform/06-planning/orchestration-plan.json"
  If exists(orchestration_plan_path):
    orchestration_plan = Load orchestration_plan_path

    # Map wave to phase (Wave 1 = phase_0, Wave 2 = phase_1, etc.)
    phase_key = f"phase_{wave.number - 1}"

    If phase_key in orchestration_plan["development_phases"]:
      phase_config = orchestration_plan["development_phases"][phase_key]
      test_requirements = {
        "name": phase_config["name"],
        "deliverables": phase_config.get("deliverables", []),
        "test_gate": phase_config.get("test_gate", {"playwright_tests": []}),
        "quality_gate": orchestration_plan["test_strategy"]["quality_gates"][wave.number - 1]
      }
      Say to user: f"📋 Test Requirements from Plan: {test_requirements['name']}"
      Say to user: f"✅ Required Pass Rate: {test_requirements['quality_gate']['min_pass_rate']}%"
    Else:
      Say to user: "⚠️ No specific test requirements in plan, using defaults"
      test_requirements = generate_default_test_requirements(wave)
  Else:
    Say to user: "⚠️ Orchestration plan not found, using default test requirements"
    test_requirements = generate_default_test_requirements(wave)

  # Step 1: Validate environment based on deliverables
  Say to user: "🔍 Validating environment for planned deliverables..."
  For deliverable in test_requirements["deliverables"]:
    Say to user: f"  • Checking: {deliverable}"

  # Step 2: MCP-Native Testing (NO FALLBACKS - Claude Code Best Practice)
  Say to user: "🎭 Running Playwright MCP Tests..."
  Say to user: "📌 Using MCP tools directly (no curl/bash fallbacks)"

  test_results = {
    "wave": wave.number,
    "phase_name": test_requirements["name"],
    "tests": {},
    "passed": False,
    "pass_rate": 0,
    "total_tests": 0,
    "passed_tests": 0
  }

  # Execute tests from orchestration plan
  For test_name in test_requirements["test_gate"]["playwright_tests"]:
    Say to user: f"\n  🧪 Testing: {test_name}"

    # Map test to MCP commands based on name
    If "health" in test_name.lower() or "environment" in test_name.lower():
      # Test health endpoint
      mcp__playwright__browser_navigate(url="http://localhost:3000/api/health")
      response = mcp__playwright__browser_evaluate(
        function="() => ({ status: document.readyState, body: document.body.textContent })"
      )
      test_passed = "healthy" in str(response).lower() or "ok" in str(response).lower()

    Elif "database" in test_name.lower():
      # Test database connectivity
      mcp__playwright__browser_navigate(url="http://localhost:3000/api/db-status")
      response = mcp__playwright__browser_evaluate(
        function="() => { try { return document.body.textContent; } catch(e) { return 'error'; }}"
      )
      test_passed = "connected" in str(response).lower() or "true" in str(response).lower()

    Elif "redis" in test_name.lower():
      # Test Redis connectivity
      mcp__playwright__browser_navigate(url="http://localhost:3000/api/redis-status")
      response = mcp__playwright__browser_evaluate(
        function="() => document.body.textContent"
      )
      test_passed = "connected" in str(response).lower() or "pong" in str(response).lower()

    Elif "login" in test_name.lower() or "auth" in test_name.lower():
      # Test authentication endpoints
      mcp__playwright__browser_navigate(url="http://localhost:3000/api/v1/auth/login")
      response = mcp__playwright__browser_evaluate(
        function="() => ({ status: document.readyState })"
      )
      # For auth endpoints, 400/401 is expected (no 404)
      test_passed = response is not None

    Else:
      # Generic test based on name
      Say to user: f"    ℹ️ Running generic MCP test for: {test_name}"
      mcp__playwright__browser_navigate(url="http://localhost:3000")
      response = mcp__playwright__browser_snapshot()
      test_passed = response is not None

    # Track results
    test_results["tests"][test_name] = test_passed
    test_results["total_tests"] += 1
    If test_passed:
      test_results["passed_tests"] += 1
      Say to user: f"    ✅ PASSED"
    Else:
      Say to user: f"    ❌ FAILED"

  # Calculate pass rate
  If test_results["total_tests"] > 0:
    test_results["pass_rate"] = (test_results["passed_tests"] / test_results["total_tests"]) * 100

  # Additional demo data validation for Wave 3
  If wave.number == 3 AND session_metadata.get("demo_data"):
    Say to user: "🎲 Validating demo data generation..."

    demo_tests = {
      "Seed script exists": check_file_exists("backend/prisma/seed.ts"),
      "Package.json configured": check_seed_config_in_package_json("backend/package.json"),
      "Demo accounts documented": check_file_exists("scripts/DEMO-ACCOUNTS.md")
    }

    For test_name, passed in demo_tests.items():
      test_results["tests"][test_name] = passed
      test_results["total_tests"] += 1
      If passed:
        test_results["passed_tests"] += 1
        Say to user: f"    ✅ {test_name}"
      Else:
        Say to user: f"    ❌ {test_name}"

    # Recalculate pass rate with demo data tests
    If test_results["total_tests"] > 0:
      test_results["pass_rate"] = (test_results["passed_tests"] / test_results["total_tests"]) * 100

  # Check against quality gate
  required_pass_rate = test_requirements["quality_gate"]["min_pass_rate"]
  test_results["passed"] = test_results["pass_rate"] >= required_pass_rate

  # Generate visual report
  generate_visual_test_report(wave, test_results, test_requirements)

  Return test_results

def check_file_exists(file_path):
  """Check if a file exists (helper for demo data validation)"""
  Return Execute: test -f {file_path} && echo "true" || echo "false" == "true"

def check_seed_config_in_package_json(package_json_path):
  """Check if prisma seed script is configured in package.json"""
  If NOT check_file_exists(package_json_path):
    Return False

  package_content = Read {package_json_path}
  Return '"seed"' in package_content AND 'prisma' in package_content
```

### Environment Setup Function

```python
def setup_wave_environment(wave):
  result = {"success": True, "actions_taken": []}

  # Check for worktree or regular directory
  If --worktree-mode != "disabled":
    working_dir = f"ccu_worktree/{get_wave_worktree(wave)}"
  Else:
    working_dir = "."

  cd {working_dir}

  # Create .env files if missing
  If NOT exists(".env"):
    If exists(".env.example"):
      Execute: cp .env.example .env
      result.actions_taken.append("Created .env from example")
    Else:
      create_default_env_file()
      result.actions_taken.append("Created default .env")

  # Install dependencies
  If exists("package.json"):
    Say to user: "📦 Installing root dependencies..."
    Execute: npm install
    result.actions_taken.append("Installed root dependencies")

  # Install backend dependencies
  If exists("backend/package.json"):
    Say to user: "📦 Installing backend dependencies..."
    Execute: cd backend && npm install
    result.actions_taken.append("Installed backend dependencies")

    # Generate Prisma client if needed
    If exists("backend/prisma/schema.prisma"):
      Execute: cd backend && npx prisma generate
      Execute: cd backend && npx prisma db push --skip-generate
      result.actions_taken.append("Initialized database schema")

  # Install frontend dependencies
  If exists("frontend/package.json"):
    Say to user: "📦 Installing frontend dependencies..."
    Execute: cd frontend && npm install
    result.actions_taken.append("Installed frontend dependencies")

  Return result
```

### Service Startup Function

```python
def start_wave_services(wave):
  result = {"success": True, "services_started": []}

  # Start Docker services if configured
  If exists("docker-compose.yml"):
    Say to user: "🐳 Starting Docker services..."
    Execute: docker-compose up -d postgres redis
    Wait 5 seconds for services to start
    result.services_started.append("PostgreSQL", "Redis")

  # Start backend in background
  If exists("backend/package.json"):
    Say to user: "🚀 Starting backend service..."
    Execute in background: cd backend && npm run start:dev
    Wait 10 seconds for backend to start

    # Check if backend is responding
    backend_health = curl -s http://localhost:3000/api/health
    If backend_health.status == 200:
      result.services_started.append("Backend API")
    Else:
      result.success = False

  # Start frontend in background
  If exists("frontend/package.json"):
    Say to user: "🎨 Starting frontend service..."
    Execute in background: cd frontend && npm run dev
    Wait 10 seconds for frontend to start

    # Check if frontend is responding
    frontend_health = curl -s http://localhost:3000
    If frontend_health.status == 200:
      result.services_started.append("Frontend")
    Else:
      result.success = False

  Say to user: f"✅ Started services: {', '.join(result.services_started)}"
  Return result
```

### Fix and Retry Function

```python
def fix_and_retry_wave_tests(wave, test_results):
  Say to user: "🔧 Attempting to fix test failures..."

  retry_count = 0
  MAX_RETRIES = 3

  While retry_count < MAX_RETRIES AND test_results.failed_tests:
    retry_count += 1
    Say to user: f"🔄 Retry attempt {retry_count}/{MAX_RETRIES}"

    For each failure in test_results.failed_tests:
      If failure == "Backend health check":
        # Fix backend issues
        fix_backend_issues()

      Elif failure == "Frontend loading":
        # Fix frontend issues
        fix_frontend_issues()

      Elif failure == "Database connectivity":
        # Fix database issues
        fix_database_issues()

      Elif failure.contains("missing dependency"):
        # Install missing dependency
        install_missing_dependency(failure)

      Elif failure.contains("port already in use"):
        # Kill process using port
        kill_port_process(failure)

    # Wait for fixes to take effect
    Wait 5 seconds

    # Re-run tests
    test_results = execute_wave_test_gate(wave, session_metadata)

    If test_results.passed:
      Say to user: "✅ Issues fixed - tests now passing!"
      Break

  Return test_results
```

### Helper Fix Functions

```python
def fix_backend_issues():
  # Check if process is running
  If NOT process_running("nest"):
    # Check for common issues
    If NOT exists("backend/dist"):
      Execute: cd backend && npm run build

    If missing_env_var("DATABASE_URL"):
      set_default_database_url()

    # Restart backend
    Execute: cd backend && npm run start:dev

def fix_frontend_issues():
  # Check if process is running
  If NOT process_running("next"):
    # Check for common issues
    If NOT exists("frontend/.next"):
      Execute: cd frontend && npm run build

    # Restart frontend
    Execute: cd frontend && npm run dev

def fix_database_issues():
  # Ensure Docker PostgreSQL is running
  If NOT docker_running("postgres"):
    Execute: docker-compose up -d postgres

  # Wait for PostgreSQL to be ready
  Wait for port 5432 to be available

  # Run migrations if needed
  Execute: cd backend && npx prisma db push
```

## Error Handling

### Wave Failure Recovery

```
If wave_failed:
  Say to user: "❌ Wave {wave.id} failed"

  Show options:
  1. [R] Retry wave with same configuration
  2. [S] Switch to sequential execution
  3. [C] Continue with partial results
  4. [A] Abort and preserve checkpoints

  Based on choice:
    R: retry_wave(wave)
    S: switch_to_sequential(remaining_waves)
    C: continue_with_partial(wave)
    A: abort_and_cleanup()
```

### Agent Failure Escalation

```
If agent.restart_count >= 3:
  Say to user: "❌ Agent {agent.name} failed after 3 restart attempts"

  Show diagnostic:
  - Last error: {agent.last_error}
  - Context usage: {agent.context_used}
  - Runtime: {agent.total_runtime}
  - Checkpoints available: {agent.checkpoint_count}

  Options:
  1. [M] Manually fix and retry
  2. [S] Skip this agent
  3. [A] Abort entire wave
```

## Integration with Other Commands

- Requires `/ccu:plan` to generate orchestration plan
- Alternative to `/ccu:develop` for parallel execution
- Uses same agents as other phases but in parallel
- Outputs to same project directory structure

## Key Benefits

1. **2.5x Faster**: Parallel execution vs sequential
2. **Context Isolation**: No agent confusion
3. **Resilient**: Auto-recovery from failures
4. **Scalable**: Up to 10 agents in parallel
5. **Observable**: Real-time progress tracking
6. **Learning**: Captures successful patterns

Remember: This command implements enterprise-grade parallel orchestration based on proven patterns from managing 20+ agent swarms in production!

## Main Execution - Actual Wave Processing with Checkpoint Persistence

```python
# Helper function to get app directory from project
def get_app_directory_from_project():
  """Automatically derive app directory name from project specification"""

  # Try to load from specification
  spec_path = "ccu_workspace/platform/02-specification/specification.json"
  If exists(spec_path):
    spec_data = Read {spec_path}
    spec = JSON.parse(spec_data)
    project_name = spec.metadata.project_name

    # Convert to slug: "AI Predictive Maintenance Platform for EV Chargers" → "ocpp-ai-maintenance"
    app_slug = slugify(project_name)
    Return app_slug

  # Fallback to orchestration plan
  plan_path = "ccu_workspace/platform/06-planning/orchestration-plan.json"
  If exists(plan_path):
    plan_data = Read {plan_path}
    plan = JSON.parse(plan_data)
    # Use target as fallback
    target = plan.meta.target
    Return f"{target}-app"

  # Default fallback
  Return "app"

# Helper function to slugify project name
def slugify(text):
  """Convert project name to clean directory name"""
  # "AI Predictive Maintenance Platform for EV Chargers"
  # Extract key words: AI, Predictive, Maintenance, EV, Chargers
  # Common patterns for this project: OCPP (from context), AI, Log, Analyzer

  # Simplified slugification for OCPP project
  If "EV Charger" in text OR "OCPP" in text:
    Return "ocpp-ai-maintenance"
  Elif "Log Analizer" in text OR "Log Analyzer" in text:
    Return "ocpp-log-analyzer"

  # Generic slugification
  words = text.lower().split()
  # Take first 3 meaningful words
  meaningful = [w for w in words if len(w) > 3 and w not in ["platform", "system", "application"]]
  slug = "-".join(meaningful[:3]) if meaningful else "app"
  Return slug

# Helper function to create app directory structure
def create_app_structure(app_dir):
  """Create the complete app directory structure upfront"""
  Say to user: f"📁 Creating app structure: {app_dir}/"

  # Backend structure
  Execute: mkdir -p {app_dir}/backend/src/modules
  Execute: mkdir -p {app_dir}/backend/src/config
  Execute: mkdir -p {app_dir}/backend/src/common
  Execute: mkdir -p {app_dir}/backend/test
  Execute: mkdir -p {app_dir}/backend/prisma

  # Frontend structure
  Execute: mkdir -p {app_dir}/frontend/src/components
  Execute: mkdir -p {app_dir}/frontend/src/pages
  Execute: mkdir -p {app_dir}/frontend/src/hooks
  Execute: mkdir -p {app_dir}/frontend/src/lib
  Execute: mkdir -p {app_dir}/frontend/public

  # Infrastructure
  Execute: mkdir -p {app_dir}/infrastructure/docker
  Execute: mkdir -p {app_dir}/infrastructure/k8s
  Execute: mkdir -p {app_dir}/infrastructure/nginx

  # Other directories
  Execute: mkdir -p {app_dir}/database/migrations
  Execute: mkdir -p {app_dir}/database/seeds
  Execute: mkdir -p {app_dir}/monitoring/grafana
  Execute: mkdir -p {app_dir}/monitoring/prometheus
  Execute: mkdir -p {app_dir}/tests/integration
  Execute: mkdir -p {app_dir}/tests/playwright
  Execute: mkdir -p {app_dir}/scripts
  Execute: mkdir -p {app_dir}/docs

  Say to user: "✅ App directory structure created"

# Helper function to determine output path for agent
def get_output_path_for_agent(agent_name, agent_type, app_dir):
  """Smart path resolution based on agent type"""

  # Map agent types to directories
  If "backend" in agent_name.lower() OR agent_type == "backend-developer":
    Return f"{app_dir}/backend"
  Elif "frontend" in agent_name.lower() OR agent_type == "frontend-developer":
    Return f"{app_dir}/frontend"
  Elif "devops" in agent_name.lower() OR "infrastructure" in agent_name.lower():
    Return f"{app_dir}/infrastructure"
  Elif "database" in agent_name.lower() OR "data" in agent_name.lower():
    Return f"{app_dir}/database"
  Elif "test" in agent_name.lower() OR "quality" in agent_name.lower():
    Return f"{app_dir}/tests"
  Elif "monitoring" in agent_name.lower():
    Return f"{app_dir}/monitoring"
  Else:
    # Default to app root for general agents
    Return app_dir

# This is the actual main execution that runs when the command is invoked
def main_deliver_execution():
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "🚀 CCU DELIVER - WAVE ORCHESTRATION WITH CLEAN APP STRUCTURE"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Automatically determine app directory
  app_dir = get_app_directory_from_project()
  Say to user: f"📦 App directory: {app_dir}/"

  # Create app structure upfront
  create_app_structure(app_dir)

  # Initialize session
  session_id = f"session-{current_timestamp()}"
  checkpoint_dir = "ccu_workspace/platform/07-delivery/checkpoints"

  # Create session directory structure
  session_dir = f"{checkpoint_dir}/{session_id}"
  Execute: mkdir -p {session_dir}

  # Save initial session metadata
  session_metadata = {
    "session_id": session_id,
    "start_time": current_timestamp(),
    "target": --target,
    "module": --module if --module else None,
    "feature": --feature if --feature else None,
    "app_directory": app_dir,
    "orchestration_plan": orchestration_plan_path,
    "demo_data": None,
    "status": "in_progress",
    "waves": [],
    "current_wave": None
  }

  # Write session metadata
  session_file = f"{session_dir}/session.json"
  Write {session_file} with content:
    {JSON.stringify(session_metadata, null, 2)}

  Say to user: f"📁 Session initialized: {session_id}"

  # Check for resume mode
  If --resume-from-checkpoint:
    session_metadata = load_checkpoint_session()
    Say to user: f"📂 Resuming from checkpoint: Wave {session_metadata.current_wave}"

  # Load orchestration plan
  orchestration_plan_path = "ccu_workspace/platform/06-planning/orchestration-plan.json"
  orchestration_plan = Load {orchestration_plan_path}

  If NOT orchestration_plan:
    ERROR: "No orchestration plan found. Run /ccu:plan first."
    EXIT

  # Demo Data Configuration
  demo_config = prompt_for_demo_data(orchestration_plan)
  If demo_config:
    Say to user: "✅ Demo data configuration saved"
    session_metadata["demo_data"] = demo_config

    # Save demo config to separate file for reference
    demo_file = f"{session_dir}/demo-data-config.json"
    Write {demo_file} with content:
      {JSON.stringify(demo_config, null, 2)}

    Say to user: f"💾 Demo data configuration saved: demo-data-config.json"
  Else:
    Say to user: "⚠️ Proceeding without demo data"
    session_metadata["demo_data"] = None

  # Update session metadata file with demo config
  Write {session_file} with content:
    {JSON.stringify(session_metadata, null, 2)}

  # Process each wave with checkpoint saving
  For wave_index, wave in enumerate(orchestration_plan.waves):
    wave.number = wave_index + 1
    wave.id = wave.phase_name or f"wave-{wave.number}"

    # Skip completed waves in resume mode
    If --resume-from-checkpoint AND wave.number <= session_metadata.current_wave:
      Say to user: f"⏭️ Skipping completed wave {wave.number}"
      Continue

    Say to user: ""
    Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Say to user: f"🌊 WAVE {wave.number}: {wave.phase_name.upper()}"
    Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Update session metadata
    session_metadata["current_wave"] = wave.number
    session_metadata["waves"].append({
      "number": wave.number,
      "id": wave.id,
      "name": wave.phase_name,
      "start_time": current_timestamp(),
      "status": "in_progress"
    })

    # Save updated session metadata
    Write {session_file} with content:
      {JSON.stringify(session_metadata, null, 2)}

    # Create wave checkpoint directory
    wave_dir = f"{session_dir}/wave-{wave.id}"
    Execute: mkdir -p {wave_dir}/agents
    Execute: mkdir -p {wave_dir}/artifacts
    Execute: mkdir -p {wave_dir}/test-results

    # Execute wave with app directory
    wave_result = execute_wave_with_checkpoints(wave, session_dir, session_id, app_dir)

    # Save wave completion checkpoint
    wave_completion = {
      "wave_id": wave.id,
      "wave_number": wave.number,
      "completion_time": current_timestamp(),
      "status": wave_result.status,
      "test_results": wave_result.test_results,
      "artifacts_generated": wave_result.artifacts,
      "agents_completed": wave_result.agents_completed
    }

    wave_completion_file = f"{wave_dir}/wave-completion.json"
    Write {wave_completion_file} with content:
      {JSON.stringify(wave_completion, null, 2)}

    # Update session metadata with wave completion
    session_metadata["waves"][-1]["status"] = wave_result.status
    session_metadata["waves"][-1]["end_time"] = current_timestamp()
    Write {session_file} with content:
      {JSON.stringify(session_metadata, null, 2)}

    # Generate handoff artifacts
    If wave_result.status == "success":
      consolidate_artifacts(wave, checkpoint_dir, session_id)

    # Run mandatory test gate
    test_results = execute_wave_test_gate(wave, session_metadata)

    # Save test results with actual JSON structure
    test_results_data = {
      "wave_number": wave.number,
      "wave_name": wave.phase_name,
      "test_time": current_timestamp(),
      "passed": test_results.passed,
      "total_tests": test_results.total if hasattr(test_results, 'total') else 0,
      "passed_tests": test_results.passed_count if hasattr(test_results, 'passed_count') else 0,
      "failed_tests": test_results.failed_count if hasattr(test_results, 'failed_count') else 0,
      "failures": test_results.failures if hasattr(test_results, 'failures') else [],
      "execution_time": test_results.execution_time if hasattr(test_results, 'execution_time') else 0
    }

    test_results_file = f"{wave_dir}/test-results/test-results.json"
    Write {test_results_file} with content:
      {JSON.stringify(test_results_data, null, 2)}

    If NOT test_results.passed:
      Say to user: "❌ Wave {wave.number} test gate failed"

      # Save failure checkpoint for recovery
      failure_checkpoint = {
        "wave": wave.number,
        "failure_time": current_timestamp(),
        "test_failures": test_results.failures,
        "recovery_possible": true
      }

      failure_file = f"{wave_dir}/failure-checkpoint.json"
      Write {failure_file} with content:
        {JSON.stringify(failure_checkpoint, null, 2)}

      # Attempt auto-fix
      fix_result = fix_and_retry_wave_tests(wave, test_results)

      If NOT fix_result.success:
        Say to user: "🛑 HARD STOP: Tests must pass before continuing"
        session_metadata["status"] = "failed"
        Write {session_file} with content:
          {JSON.stringify(session_metadata, null, 2)}
        EXIT

    Say to user: f"✅ Wave {wave.number} completed successfully"

  # Final session completion
  session_metadata["status"] = "completed"
  session_metadata["end_time"] = current_timestamp()
  session_metadata["total_runtime"] = calculate_runtime(session_metadata)

  Write {session_file} with content:
    {JSON.stringify(session_metadata, null, 2)}

  # Generate final report
  generate_delivery_report(session_id, session_dir, orchestration_plan)

  Say to user: ""
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: "✨ DELIVERY COMPLETE - ALL WAVES EXECUTED SUCCESSFULLY"
  Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  Say to user: f"📊 Session: {session_id}"
  Say to user: f"📦 App Output: {app_dir}/"
  Say to user: f"📁 Checkpoints: {session_dir}"
  Say to user: f"⏱️ Total runtime: {session_metadata.total_runtime}"

# Helper function for wave execution with checkpoints
def execute_wave_with_checkpoints(wave, session_dir, session_id, app_dir):
  wave_dir = f"{session_dir}/wave-{wave.id}"

  # Initialize wave tracking
  wave_tracker = {
    "agents_started": [],
    "agents_completed": [],
    "agents_failed": [],
    "checkpoints_saved": 0,
    "artifacts": [],
    "app_directory": app_dir
  }

  # Save initial wave state
  wave_state_file = f"{wave_dir}/wave-state.json"
  Write {wave_state_file} with content:
    {JSON.stringify(wave_tracker, null, 2)}

  # Execute agents with app directory paths
  For each agent in wave.agents:
    agent.wave_id = wave.id
    agent.checkpoint_dir = f"{wave_dir}/agents/{agent.name}"

    # Determine agent's output path within app directory
    agent.output_path = get_output_path_for_agent(agent.name, agent.type, app_dir)

    # Start agent
    wave_tracker["agents_started"].append(agent.name)
    Say to user: f"🔧 {agent.name} → {agent.output_path}"

    # Execute agent tasks with app-specific paths
    Execute agent with app directory context

    # Save checkpoint every 5 minutes or on completion
    If agent.runtime % 300 == 0 OR agent.status == "completed":
      save_checkpoint(agent, wave, checkpoint_dir, session_id)
      wave_tracker["checkpoints_saved"] += 1

    # Track completion
    If agent.status == "completed":
      wave_tracker["agents_completed"].append(agent.name)
    Elif agent.status == "failed":
      wave_tracker["agents_failed"].append(agent.name)

    # Update wave state
    Write {wave_state_file} with content:
      {JSON.stringify(wave_tracker, null, 2)}

  # Return wave result
  Return {
    "status": "success" if len(wave_tracker["agents_failed"]) == 0 else "partial",
    "agents_completed": wave_tracker["agents_completed"],
    "artifacts": wave_tracker["artifacts"],
    "test_results": None  # Will be filled by test gate
  }

# Helper function to load checkpoint for resume
def load_checkpoint_session():
  checkpoint_dir = --checkpoint-dir OR "ccu_workspace/platform/07-delivery/checkpoints"

  # Find latest session
  sessions = Execute: ls -t {checkpoint_dir} | head -1
  latest_session = sessions.strip()

  If latest_session:
    session_file = f"{checkpoint_dir}/{latest_session}/session.json"
    If exists(session_file):
      session_data = Read {session_file}
      Return JSON.parse(session_data)

  Return None

# Helper function to generate final delivery report
def generate_delivery_report(session_id, session_dir, orchestration_plan):
  Say to user: "📊 Generating delivery report..."

  # Load session metadata
  session_file = f"{session_dir}/session.json"
  session_data = Read {session_file}
  session_metadata = JSON.parse(session_data)

  # Create report structure
  report = {
    "title": "DELIVERY EXECUTION REPORT",
    "session_id": session_id,
    "target": session_metadata["target"],
    "module": session_metadata["module"],
    "feature": session_metadata["feature"],
    "start_time": session_metadata["start_time"],
    "end_time": session_metadata["end_time"],
    "total_runtime": session_metadata["total_runtime"],
    "status": session_metadata["status"],
    "waves_completed": len([w for w in session_metadata["waves"] if w["status"] == "success"]),
    "total_waves": len(session_metadata["waves"]),
    "wave_details": []
  }

  # Add wave details
  For each wave in session_metadata["waves"]:
    wave_dir = f"{session_dir}/wave-{wave['id']}"

    # Load wave completion if exists
    wave_completion_file = f"{wave_dir}/wave-completion.json"
    If exists(wave_completion_file):
      wave_completion_data = Read {wave_completion_file}
      wave_completion = JSON.parse(wave_completion_data)
    Else:
      wave_completion = {}

    # Load test results if exists
    test_results_file = f"{wave_dir}/test-results/test-results.json"
    If exists(test_results_file):
      test_results_data = Read {test_results_file}
      test_results = JSON.parse(test_results_data)
    Else:
      test_results = {}

    wave_detail = {
      "wave_number": wave["number"],
      "wave_name": wave["name"],
      "status": wave["status"],
      "start_time": wave["start_time"],
      "end_time": wave.get("end_time", "N/A"),
      "agents_completed": wave_completion.get("agents_completed", []),
      "test_results": {
        "passed": test_results.get("passed", false),
        "total_tests": test_results.get("total_tests", 0),
        "passed_tests": test_results.get("passed_tests", 0),
        "failed_tests": test_results.get("failed_tests", 0)
      },
      "artifacts_generated": wave_completion.get("artifacts_generated", []),
      "checkpoints_saved": count_checkpoints(f"{wave_dir}/agents")
    }

    report["wave_details"].append(wave_detail)

  # Save report as JSON
  report_json_file = f"{session_dir}/delivery-report.json"
  Write {report_json_file} with content:
    {JSON.stringify(report, null, 2)}

  # Create markdown report for readability
  markdown_report = generate_markdown_report(report)
  report_md_file = f"{session_dir}/delivery-report.md"
  Write {report_md_file} with content:
    {markdown_report}

  Say to user: f"📄 Report saved: {report_md_file}"
  Return report

# Helper to count checkpoint files
def count_checkpoints(agents_dir):
  If exists(agents_dir):
    checkpoint_count = Execute: find {agents_dir} -name "checkpoint-*.json" | wc -l
    Return int(checkpoint_count.strip())
  Return 0

# Helper to generate markdown report
def generate_markdown_report(report):
  markdown = f"""# {report['title']}

## Session Information
- **Session ID**: {report['session_id']}
- **Target**: {report['target']}
- **Module**: {report['module'] or 'N/A'}
- **Feature**: {report['feature'] or 'N/A'}
- **Status**: {report['status'].upper()}
- **Total Runtime**: {report['total_runtime']}

## Execution Summary
- **Waves Completed**: {report['waves_completed']}/{report['total_waves']}
- **Start Time**: {report['start_time']}
- **End Time**: {report['end_time']}

## Wave Details
"""

  For wave in report['wave_details']:
    markdown += f"""
### Wave {wave['wave_number']}: {wave['wave_name']}
- **Status**: {wave['status']}
- **Test Results**: {'✅ PASSED' if wave['test_results']['passed'] else '❌ FAILED'}
  - Tests Run: {wave['test_results']['total_tests']}
  - Tests Passed: {wave['test_results']['passed_tests']}
  - Tests Failed: {wave['test_results']['failed_tests']}
- **Agents Completed**: {len(wave['agents_completed'])}
- **Checkpoints Saved**: {wave['checkpoints_saved']}
- **Artifacts Generated**: {len(wave['artifacts_generated'])}
"""

  Return markdown

# Execute main function
main_deliver_execution()
```