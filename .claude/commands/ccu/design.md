---
description: Phase 3 - Create UX/UI designs and user flows
activates: ux-ui-designer
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=specification]
---

# Design Command - Phase 3: UX/UI Design

This is **Phase 3** of the 7-phase development process. The design phase transforms product specifications into visual wireframes, user flows, and component inventories, defining how the product LOOKS and FEELS.

Generate comprehensive UX/UI designs for **$ARGUMENTS.target** at **$ARGUMENTS.track** level.

## Command Syntax

```bash
/ccu:design --target=platform|module|feature --track=instant|rapid|standard|enterprise [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Design scope for the UI/UX work
- `--track=instant|rapid|standard|enterprise` - Development track complexity
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=specification` - Load insights from specification phase
- `--style=default|new-york` - shadcn/ui style variant
- `--base-color=slate|gray|zinc|stone|neutral` - shadcn/ui base color theme
- `--components=<list>` - Explicit component list override
- `--template=blank|custom` - Start with blank slate or custom components
- `--industry=<type>` - Use industry-specific design templates

## Generation Behavior (One-Level-Down)

This command follows the **one-level-down** rule for automatic generation:

| Target | Generates | Example |
|--------|-----------|---------|
| platform | Platform + all modules | Platform design + 5 module designs |
| module | Module + its features | Auth module design + 4 auth feature designs |
| feature | Feature only | Login feature design only |

**Important:**
- Platform design automatically generates all module designs (but NOT features)
- Module design automatically generates all its feature designs
- Feature design is a leaf level (no children)
- All child designs use the same track as the parent

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking**
   - When: Analyzing complex design decisions and user flows
   - Purpose: Break down UI/UX problems systematically
   - Usage:
   ```
   mcp__sequential-thinking__sequentialthinking(
     thought: "Analyzing user flow from login to dashboard...",
     nextThoughtNeeded: true,
     thoughtNumber: 1,
     totalThoughts: 5
   )
   ```
   - Track specifics: RAPID (1-2 refinements), STANDARD (3-5), ENTERPRISE (5-10)

2. **Tool: mcp__mem0__search_memory**
   - When: Looking for successful design patterns
   - Purpose: Find proven UI/UX solutions and component combinations
   - Usage:
   ```
   # Primary search with PATTERN prefix
   mcp__mem0__search_memory(
     query: "PATTERN:DESIGN shadcn dashboard components for [project type]"
   )

   # Fallback if no results
   If results.length == 0:
     mcp__mem0__search_memory(
       query: "UI design components [project type]"
     )
   ```

3. **Tool: mcp__mem0__add_memory**
   - When: After creating successful designs
   - Purpose: Store component patterns for reuse
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "PATTERN:DESIGN:[type] - Components: [components], Theme: [theme], UseCase: [use case], Success: true"
   )
   ```

4. **Tool: mcp__context7__resolve-library-id**
   - When: Working with shadcn/ui components
   - Purpose: Get accurate component documentation
   - Usage:
   ```
   mcp__context7__resolve-library-id(
     libraryName: "shadcn-ui"
   )
   ```

5. **Tool: mcp__context7__get-library-docs**
   - When: Implementing specific UI components
   - Purpose: Get shadcn/ui component patterns
   - Usage:
   ```
   mcp__context7__get-library-docs(
     context7CompatibleLibraryID: "/shadcn-ui/ui",
     topic: "data-table" | "forms" | "navigation",
     tokens: 3000
   )
   ```

6. **Tool: Read**
   - When: Extracting colors from images
   - Purpose: Analyze image files for color palette extraction
   - Usage:
   ```
   Read(
     file_path: "/path/to/brand/image.png"
   )
   # Image will be analyzed for dominant colors
   ```

7. **Tool: mcp__playwright__browser_navigate**
   - When: Researching competitor UIs (STANDARD/ENTERPRISE)
   - Purpose: Analyze existing solutions
   - Usage:
   ```
   mcp__playwright__browser_navigate(
     url: "https://example-app.com"
   )
   ```

8. **Tool: mcp__playwright__browser_take_screenshot**
   - When: Capturing design references and website colors
   - Purpose: Document UI decisions and extract color schemes
   - Usage:
   ```
   mcp__playwright__browser_take_screenshot(
     filename: "color-reference.png",
     fullPage: false
   )
   ```

9. **Tool: mcp__playwright__browser_evaluate**
   - When: Extracting CSS variables from websites
   - Purpose: Get exact brand colors from live sites
   - Usage:
   ```
   mcp__playwright__browser_evaluate(
     function: "() => {
       const styles = getComputedStyle(document.documentElement);
       return {
         primary: styles.getPropertyValue('--primary'),
         secondary: styles.getPropertyValue('--secondary'),
         accent: styles.getPropertyValue('--accent')
       };
     }"
   )
   ```

### MCP Usage by Track

**INSTANT Track:**
- Minimal MCP usage for speed
- Only mcp__context7__get-library-docs for critical components

**RAPID Track:**
- mcp__mem0__search_memory for quick pattern matching
- mcp__context7__get-library-docs for shadcn/ui components
- mcp__mem0__add_memory to store successful patterns

**STANDARD Track:**
- All RAPID tools plus:
- mcp__sequential-thinking__sequentialthinking for user flows
- mcp__playwright__browser_navigate for competitor analysis
- mcp__claude-context__search_code for existing patterns

**ENTERPRISE Track:**
- All STANDARD tools plus:
- Extensive mcp__playwright__browser_take_screenshot for documentation
- Multiple mcp__sequential-thinking__sequentialthinking for complex flows
- Deep pattern analysis with mcp__mem0__search_memory
- Multiple mcp__context7__get-library-docs for all component variants

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

## shadcn/ui CLI Integration

### Core Philosophy
Every design decision translates directly to shadcn/ui components. The design phase determines:
- Which shadcn components to install
- Theme configuration (style, base color, CSS variables)
- Component patterns and compositions
- Custom component requirements

### Automatic Component Detection
Based on specification and design requirements, automatically determine:
- **Core Components**: button, card, dialog, form, input, label
- **Layout Components**: sidebar, navigation-menu, header, footer
- **Data Display**: table, data-table, list, chart, badge
- **Feedback**: toast, alert, progress, skeleton, spinner
- **Advanced**: command, combobox, calendar, date-picker

## Dynamic Module Analysis Functions

### Module Characteristic Analyzer
```python
def analyze_module_characteristics(module_name, module_spec):
    """
    Analyzes module characteristics to determine its type dynamically.
    Returns module category and suggested components.
    """
    # Keywords for module categorization
    categories = {
        'authentication': {
            'keywords': ['auth', 'login', 'user', 'account', 'session', 'password', 'register', 'signup', 'signin'],
            'components': ['form', 'input', 'button', 'card', 'alert', 'checkbox'],
            'patterns': ['login-form', 'register-form', 'password-reset']
        },
        'data_management': {
            'keywords': ['admin', 'management', 'crud', 'table', 'list', 'edit', 'delete', 'create'],
            'components': ['data-table', 'pagination', 'dialog', 'form', 'dropdown-menu'],
            'patterns': ['crud-table', 'bulk-actions', 'filter-bar']
        },
        'analytics': {
            'keywords': ['dashboard', 'analytics', 'metrics', 'report', 'chart', 'graph', 'stats', 'kpi'],
            'components': ['card', 'chart', 'table', 'tabs', 'badge', 'skeleton'],
            'patterns': ['stats-grid', 'chart-panel', 'kpi-cards']
        },
        'file_processing': {
            'keywords': ['upload', 'import', 'export', 'csv', 'file', 'document', 'attachment'],
            'components': ['dialog', 'progress', 'alert', 'button', 'input'],
            'patterns': ['file-upload', 'drag-drop', 'import-wizard']
        },
        'ai_intelligence': {
            'keywords': ['ai', 'ml', 'analysis', 'predict', 'model', 'intelligent', 'smart', 'auto'],
            'components': ['card', 'badge', 'progress', 'skeleton', 'tooltip'],
            'patterns': ['ai-suggestions', 'confidence-badge', 'analysis-panel']
        },
        'communication': {
            'keywords': ['chat', 'message', 'notification', 'comment', 'feed', 'social', 'share'],
            'components': ['avatar', 'scroll-area', 'input', 'badge', 'popover'],
            'patterns': ['chat-interface', 'comment-thread', 'activity-feed']
        },
        'commerce': {
            'keywords': ['product', 'cart', 'payment', 'order', 'checkout', 'price', 'shop'],
            'components': ['card', 'dialog', 'select', 'radio-group', 'badge'],
            'patterns': ['product-card', 'cart-sheet', 'checkout-form']
        },
        'content': {
            'keywords': ['content', 'article', 'blog', 'post', 'media', 'editor', 'publish'],
            'components': ['textarea', 'card', 'tabs', 'separator', 'badge'],
            'patterns': ['editor-toolbar', 'media-picker', 'content-card']
        },
        'organization': {
            'keywords': ['team', 'family', 'group', 'member', 'role', 'permission', 'hierarchy'],
            'components': ['avatar', 'card', 'select', 'checkbox', 'badge'],
            'patterns': ['member-card', 'role-manager', 'team-list']
        },
        'financial': {
            'keywords': ['payment', 'transaction', 'budget', 'expense', 'invoice', 'billing', 'cost'],
            'components': ['table', 'form', 'input', 'select', 'alert', 'card'],
            'patterns': ['transaction-table', 'budget-gauge', 'expense-form']
        }
    }

    # Convert module name and spec to lowercase for matching
    module_text = f"{module_name} {str(module_spec)}".lower()

    # Score each category based on keyword matches
    category_scores = {}
    for category, config in categories.items():
        score = sum(1 for keyword in config['keywords'] if keyword in module_text)
        if score > 0:
            category_scores[category] = score

    # Get the best matching category
    if category_scores:
        best_category = max(category_scores, key=category_scores.get)
        return {
            'category': best_category,
            'confidence': category_scores[best_category],
            'components': categories[best_category]['components'],
            'patterns': categories[best_category]['patterns']
        }

    # Default category if no matches
    return {
        'category': 'generic',
        'confidence': 0,
        'components': ['card', 'table', 'form', 'button'],
        'patterns': ['basic-crud', 'list-view']
    }

def group_modules_by_category(modules_dict):
    """
    Groups modules by their detected categories for consolidated questioning.
    """
    categorized_modules = {}

    for module_name, module_spec in modules_dict.items():
        analysis = analyze_module_characteristics(module_name, module_spec)
        category = analysis['category']

        if category not in categorized_modules:
            categorized_modules[category] = {
                'modules': [],
                'components': analysis['components'],
                'patterns': analysis['patterns']
            }

        categorized_modules[category]['modules'].append({
            'name': module_name,
            'confidence': analysis['confidence']
        })

    return categorized_modules
```

## Step 0: Pattern Recognition with Mem0 MCP (Active for RAPID/STANDARD/ENTERPRISE)

**Query for similar design patterns:**
```
# Primary search - look for patterns saved from previous phases
mcp__mem0__search_memory(
  query: "PATTERN:DESIGN shadcn ${ARGUMENTS.target} ${specification?.ui_framework?.layout?.pattern}"
)

# If no results, fallback to broader search
If results.length == 0:
  mcp__mem0__search_memory(
    query: "design patterns ${ARGUMENTS.target} ${specification?.project_type || 'application'}"
  )

# If still no results, search for any UI patterns
If results.length == 0:
  mcp__mem0__search_memory(
    query: "UI components shadcn ${ARGUMENTS.track}"
  )
```

**If patterns found, also check shadcn documentation:**
```
mcp__context7__get-library-docs(
  context7CompatibleLibraryID: "/shadcn-ui/ui",
  topic: "${detected_pattern}",
  tokens: 3000
)
```

**If matches found (similarity > 70%), display:**
```
💡 SHADCN PATTERN DETECTION (Powered by Mem0 MCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Similar shadcn configurations found:

📦 E-Commerce Dashboard (85% match)
   Components: card, table, chart, tabs, badge, product-card
   Style: default, base-color: slate
   Layout: dashboard with collapsible sidebar
   Custom: inventory-tracker, sales-widget

📦 SaaS Platform (72% match)
   Components: form, dialog, data-table, command
   Style: new-york, base-color: zinc
   Layout: admin panel with fixed sidebar

Options:
[A] Apply best matching pattern
[C] Customize component selection
[N] Start fresh without pattern
[V] View component details

Choice [A/C/N/V]: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Input Validation Helpers

### Validation Functions
```
# Validate track selection
function validate_track_input(input):
  valid_tracks = ["instant", "rapid", "standard", "enterprise"]
  input_lower = input.toLowerCase().trim()

  # Handle shortcuts
  if input_lower == "i": return "instant"
  if input_lower == "r": return "rapid"
  if input_lower == "s": return "standard"
  if input_lower == "e": return "enterprise"

  # Check full names
  if input_lower in valid_tracks: return input_lower

  # Invalid input
  Say to user: "⚠️ Invalid track: '{input}'"
  Say to user: "Valid options: instant, rapid, standard, enterprise"
  return null

# Validate numeric choice with range
function validate_numeric_choice(input, min, max, allow_custom=false):
  # Clean input
  cleaned = input.trim().toUpperCase()

  # Check for custom options if allowed
  if allow_custom:
    if cleaned in ["C", "CUSTOM"]: return "custom"
    if cleaned in ["S", "SKIP"]: return "skip"
    if cleaned in ["A", "AUTO"]: return "auto"

  # Parse as number
  num = parseInt(input)
  if isNaN(num):
    Say to user: "⚠️ Invalid input: '{input}' - Please enter a number between {min}-{max}"
    return null

  if num < min or num > max:
    Say to user: "⚠️ Out of range: {num} - Please enter a number between {min}-{max}"
    return null

  return num

# Validate yes/no confirmation
function validate_confirmation(input, default="y"):
  cleaned = input.trim().toLowerCase()

  # Handle empty input with default
  if cleaned == "": return default == "y"

  # Check variations
  if cleaned in ["y", "yes", "yeah", "yep", "confirm"]: return true
  if cleaned in ["n", "no", "nope", "cancel", "abort"]: return false

  Say to user: "⚠️ Invalid input: '{input}' - Please enter Y/yes or N/no"
  return null

# Validate multiple choice selection
function validate_multiple_choice(input, valid_options):
  cleaned = input.trim().toUpperCase()

  # Check if input is in valid options
  if cleaned in valid_options: return cleaned

  # Try as number if options are numeric
  num = parseInt(input)
  if !isNaN(num) and num.toString() in valid_options:
    return num.toString()

  Say to user: "⚠️ Invalid choice: '{input}'"
  Say to user: "Valid options: {valid_options.join(', ')}"
  return null

# Retry helper for invalid inputs
function get_validated_input(prompt, validator, max_retries=3):
  retries = 0
  while retries < max_retries:
    Ask: prompt
    result = validator(user_input)
    if result != null: return result
    retries++
    if retries < max_retries:
      Say to user: "Please try again ({retries}/{max_retries})"

  Say to user: "❌ Maximum retries exceeded. Using default or exiting."
  return null
```

## Pre-execution Validation

1. **Validate Required Parameters:**
   ```
   # Check required target parameter
   If not ARGUMENTS.target:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ❌ ERROR: Missing Required Parameter
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     What happened:
       Target scope not specified

     How to fix:
       Specify target with: --target=platform|module|feature

     Example:
       /ccu:design --target=platform --track=rapid

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Exit

   # Check module parameter when needed
   If ARGUMENTS.target == "module" and not ARGUMENTS.module:
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ❌ ERROR: Module Name Required
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     What happened:
       Module target selected but no module name provided

     How to fix:
       Add module parameter: --module=<module-name>

     Example:
       /ccu:design --target=module --module=authentication --track=rapid

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Exit

   # Check feature parameters when needed
   If ARGUMENTS.target == "feature" and (not ARGUMENTS.module or not ARGUMENTS.feature):
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ❌ ERROR: Module and Feature Names Required
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     What happened:
       Feature target requires both module and feature names

     How to fix:
       Add both parameters: --module=<name> --feature=<name>

     Example:
       /ccu:design --target=feature --module=auth --feature=login --track=rapid

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Exit
   ```

2. **Check for --from parameter:**
   - If `--from=specification` is provided:
     - If target=platform: load `{project_root}/ccu_workspace/platform/02-specification/specification.json`
     - If target=module: load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/02-specification/specification.json`
     - If target=feature: load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/02-specification/specification.json`
   - Use specification data to inform design decisions
   - Extract modules/pages for component selection
   - If no specification.json exists:
     ```
     ⚠️ Warning: No specification found
     Run `/ccu:specify` first for better results
     Continuing with defaults...
     ```

3. **Set and Validate Working Paths:**
   ```
   # Determine paths based on target
   If ARGUMENTS.target == "platform":
     working_path = {project_root}/ccu_workspace/platform/
   Elif ARGUMENTS.target == "module":
     working_path = {project_root}/ccu_workspace/modules/$ARGUMENTS.module/
   Elif ARGUMENTS.target == "feature":
     working_path = {project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/

   # Validate workspace exists
   If not exists({project_root}/ccu_workspace):
     Say to user: "📁 Creating ccu_workspace structure..."
     Create directory: {project_root}/ccu_workspace

   Say to user: "✅ Working in: {working_path}"
   ```

## 🎯 TodoWrite Initialization

**Initialize task tracking immediately after parameter validation:**
```
# Create initial todo list based on track and parameters
todos = []

# CRITICAL: Add validation and setup tasks first
todos.append("Validate parameters")
todos.append("Load specification if --from provided")
todos.append("Create platform design structure")
todos.append("Create module design structures")

# Core tasks for all tracks
todos.append("Determine design approach")

# Theme tasks will be added dynamically based on user choices during conversation

# Track-specific tasks
If track == "instant":
  todos.append("Auto-generate personas from modules")
  todos.append("Apply default components per module")
  todos.append("Generate default wireframes")
  todos.append("Create component inventory")
  todos.append("Generate design.json")
Elif track == "rapid":
  todos.append("Auto-generate personas")
  todos.append("Collect module UI preferences")
  todos.append("Select theme")
  todos.append("Confirm design configuration")
  todos.append("Analyze with ux-ui-designer")
  todos.append("Generate design assets")
  todos.append("Generate design.json")
  todos.append("Store design pattern")
Elif track == "standard":
  todos.append("Auto-generate personas from modules")
  todos.append("Collect module UI preferences")
  todos.append("Select theme")
  todos.append("Confirm design plan")
  todos.append("Analyze with ux-ui-designer")
  todos.append("Generate comprehensive designs")
  todos.append("Generate design.json")
Elif track == "enterprise":
  todos.append("Auto-generate enterprise personas")
  todos.append("Collect comprehensive module UI preferences")
  todos.append("Configure enterprise theme & branding")
  todos.append("Design system architecture")
  todos.append("Analyze with ux-ui-designer")
  todos.append("Generate enterprise design system")
  todos.append("Generate design.json")

# Final tasks for all tracks
todos.append("Create completion summary")
todos.append("Display next steps")

TodoWrite(todos: todos with status="pending")

# Start first task
Update TodoWrite: "Validate parameters" → in_progress

# Then in the actual flow, update tasks as you progress:
# Update TodoWrite: "Validate parameters" → completed
# Update TodoWrite: "Load specification if --from provided" → in_progress
# etc.
```

## Appendix A: Optional Theme Extraction Workflows

These workflows can be integrated into any track when custom theme extraction is needed.
They are triggered by optional parameters or user choices during the design process.

### 🎨 Color Extraction from Image
**Triggered by: `--theme-from-image=<path>` parameter or user selection**
```
Update TodoWrite: "Extract colors from image" → in_progress

image_path = $ARGUMENTS.theme-from-image

# Validate image exists
If not exists(image_path):
  Say to user: "❌ Image not found: {image_path}"
  Exit command

# Read and analyze image
Say to user: "🎨 EXTRACTING COLORS FROM IMAGE"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: "Analyzing: {image_path}"

# Use Read tool to load image
image_data = Read(file_path: image_path)

# Use Sequential Thinking to analyze colors
mcp__sequential-thinking__sequentialthinking(
  thought: "Analyzing image for color extraction.
           Looking for: dominant colors, brand colors, accent colors.
           Need to identify: primary, secondary, background, foreground.
           Creating harmonious color palette...",
  nextThoughtNeeded: true,
  thoughtNumber: 1,
  totalThoughts: 3
)

# Extract dominant colors (simulated analysis)
extracted_colors = {
  primary: Extract most dominant brand color,
  secondary: Extract complementary color,
  accent: Extract highlight/CTA color,
  background: Extract light background,
  foreground: Extract text color,
  muted: Extract subtle UI elements color,
  destructive: Red variant for errors,
  success: Green variant for success
}

# Display extracted palette
Say to user: ""
Say to user: "📊 EXTRACTED COLOR PALETTE"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: ""
Say to user: "Primary:     █ {extracted_colors.primary} - Main brand color"
Say to user: "Secondary:   █ {extracted_colors.secondary} - Supporting color"
Say to user: "Accent:      █ {extracted_colors.accent} - CTAs and highlights"
Say to user: "Background:  █ {extracted_colors.background} - Page background"
Say to user: "Foreground:  █ {extracted_colors.foreground} - Text color"
Say to user: "Muted:       █ {extracted_colors.muted} - Borders and dividers"
Say to user: ""
Say to user: "Preview theme with these colors? [Y/adjust/retry]: "

If user selects "adjust":
  Ask: "Which color to adjust? [primary/secondary/accent/background/foreground]: "
  Ask: "New color (hex or name): "
  Update extracted_colors

If user selects "retry":
  Ask: "Provide new image path: "
  Repeat extraction process

# Store extracted theme after user confirms
theme_config = extracted_colors

Update TodoWrite: "Extract colors from image" → completed
Return theme_config
```

### 🌐 Color Extraction from Website
**Function: website_color_extraction_workflow()**
```
# This workflow is triggered when user chooses option 3 in Brand Colors menu

Update TodoWrite: Add task "Extract colors from website" → in_progress

Ask: "Please provide the website URL:"
website_url = user_input

Say to user: "🌐 EXTRACTING COLORS FROM WEBSITE"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: "Navigating to: {website_url}"

# Navigate to website
mcp__playwright__browser_navigate(
  url: website_url
)

# Wait for page load
Say to user: "⏳ Waiting for page to load..."

# Extract CSS variables
Say to user: "🔍 Extracting CSS variables..."

css_colors = mcp__playwright__browser_evaluate(
  function: "() => {
    const styles = getComputedStyle(document.documentElement);
    const root = document.documentElement;
    const allStyles = [...root.style].filter(prop => prop.startsWith('--'));

    // Common color variable patterns
    const colorPatterns = ['primary', 'secondary', 'accent', 'brand', 'main', 'base', 'background', 'foreground', 'text'];
    const colors = {};

    // Extract from CSS variables
    allStyles.forEach(prop => {
      const value = styles.getPropertyValue(prop);
      if (value && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))) {
        colors[prop] = value;
      }
    });

    // Extract from common elements
    const button = document.querySelector('button, .btn, [role=button]');
    if (button) colors.button = getComputedStyle(button).backgroundColor;

    const link = document.querySelector('a');
    if (link) colors.link = getComputedStyle(link).color;

    const header = document.querySelector('header, nav, .header, .navbar');
    if (header) colors.header = getComputedStyle(header).backgroundColor;

    return colors;
  }"
)

# Take screenshot for visual reference
Say to user: "📸 Capturing visual reference..."

mcp__playwright__browser_take_screenshot(
  filename: "website-color-reference.png",
  fullPage: false
)

# Analyze extracted colors
mcp__sequential-thinking__sequentialthinking(
  thought: "Analyzing extracted colors from {website_url}.
           Found colors: {css_colors}.
           Determining primary brand colors...
           Creating cohesive theme palette...",
  nextThoughtNeeded: true
)

# Generate theme from website colors
website_theme = {
  primary: Identify main brand color from extraction,
  secondary: Find complementary color,
  accent: Identify CTA/highlight color,
  background: Extract background color,
  foreground: Extract text color,
  muted: Find border/divider color
}

# Display extracted theme
Say to user: ""
Say to user: "🎨 WEBSITE COLOR THEME"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: ""
Say to user: "Extracted from: {website_url}"
Say to user: ""
Say to user: "Primary:     █ {website_theme.primary}"
Say to user: "Secondary:   █ {website_theme.secondary}"
Say to user: "Accent:      █ {website_theme.accent}"
Say to user: "Background:  █ {website_theme.background}"
Say to user: "Foreground:  █ {website_theme.foreground}"
Say to user: ""
Say to user: "Screenshot saved: website-color-reference.png"
Say to user: ""
Say to user: "Use this theme? [Y/adjust/different-url]: "

If user confirms:
  theme_config = website_theme

Update TodoWrite: "Extract colors from website" → completed
Return theme_config
```

### 🤖 AI Theme Generation from Description
**Function: ai_theme_generation_workflow()**
```
# This workflow is triggered when user chooses option 4 in Brand Colors menu

Update TodoWrite: Add task "Generate theme from description" → in_progress

Ask: "Describe the theme you want (e.g., 'modern and minimalist', 'warm and friendly', 'tech startup'):"
theme_description = user_input

Say to user: "🤖 AI THEME GENERATION"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: "Description: {theme_description}"
Say to user: ""
Say to user: "🧠 Analyzing description and generating theme..."

# Use Sequential Thinking to generate theme
mcp__sequential-thinking__sequentialthinking(
  thought: "User wants: {theme_description}.
           Analyzing keywords for color associations...
           Industry context suggests...
           Emotional tone implies...
           Generating harmonious color palette...",
  nextThoughtNeeded: true,
  thoughtNumber: 1,
  totalThoughts: 4
)

# Generate theme based on description analysis
generated_theme = {
  primary: Color that matches main theme intent,
  secondary: Complementary supporting color,
  accent: Energetic highlight color,
  background: Appropriate background tone,
  foreground: Readable text color,
  muted: Subtle UI elements
}

# Display generated theme with reasoning
Say to user: ""
Say to user: "✨ GENERATED THEME"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: ""
Say to user: "Based on: '{theme_description}'"
Say to user: ""
Say to user: "Primary:     █ {generated_theme.primary} - {reasoning}"
Say to user: "Secondary:   █ {generated_theme.secondary} - {reasoning}"
Say to user: "Accent:      █ {generated_theme.accent} - {reasoning}"
Say to user: "Background:  █ {generated_theme.background}"
Say to user: "Foreground:  █ {generated_theme.foreground}"
Say to user: ""
Say to user: "Accept generated theme? [Y/regenerate/manual]: "

If user confirms:
  theme_config = generated_theme

Update TodoWrite: "Generate theme from description" → completed
Return theme_config
```

### 📱 Visual Theme Preview
**Function: show_theme_preview(theme_config)**
```
# This function is called after any theme is selected/generated
# Shows visual preview and asks for confirmation

Update TodoWrite: Add task "Show theme preview" → in_progress

Say to user: ""
Say to user: "📱 VISUAL THEME PREVIEW"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: ""
Say to user: "╭─── Button Components ────────────────────────╮"
Say to user: "│                                              │"
Say to user: "│  [▓▓ Primary ▓▓] [░░ Secondary ░░] [  Ghost  ]│"
Say to user: "│                                              │"
Say to user: "│  [◻ Outline ◻] [✕ Destructive ✕] [✓ Success]│"
Say to user: "│                                              │"
Say to user: "╰──────────────────────────────────────────────╯"
Say to user: ""
Say to user: "╭─── Card Component ───────────────────────────╮"
Say to user: "│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │"
Say to user: "│ Dashboard Metrics                            │"
Say to user: "│ ░░░░░░░░░░░░░░░░░░░░░░░░░░                  │"
Say to user: "│                                              │"
Say to user: "│ Revenue        ▲ +12.5%                     │"
Say to user: "│ $124,563       ░░░░░░░░░                    │"
Say to user: "│                                              │"
Say to user: "│ [View Details →]                             │"
Say to user: "╰──────────────────────────────────────────────╯"
Say to user: ""
Say to user: "╭─── Form Elements ────────────────────────────╮"
Say to user: "│                                              │"
Say to user: "│ Email                                        │"
Say to user: "│ ┌────────────────────────────────────┐      │"
Say to user: "│ │ user@example.com                   │      │"
Say to user: "│ └────────────────────────────────────┘      │"
Say to user: "│                                              │"
Say to user: "│ Password                                     │"
Say to user: "│ ┌────────────────────────────────────┐      │"
Say to user: "│ │ ••••••••••••                       │      │"
Say to user: "│ └────────────────────────────────────┘      │"
Say to user: "│                                              │"
Say to user: "│ ☑ Remember me     [▓▓ Sign In ▓▓]          │"
Say to user: "│                                              │"
Say to user: "╰──────────────────────────────────────────────╯"
Say to user: ""
Say to user: "Theme Options:"
Say to user: "[A]ccept  [P]rimary  [S]econdary  [C]ontrast  [R]adius"
Say to user: ""
Say to user: "Choice: "

If user selects adjustment option:
  Show adjustment interface
  Update theme_config
  Regenerate preview

Update TodoWrite: "Show theme preview" → completed
Return finalized_theme_config
```

## CRITICAL: New File Structure Requirements

### 1. Platform-Level Design Structure
**ALL files must be created in proper locations - NEVER in project root!**

```bash
# Create platform design structure
{project_root}/ccu_workspace/platform/03-design/
├── design.json                    # SINGLE SOURCE OF TRUTH
├── design-system.json            # Core design system
├── information-architecture.md   # IA and sitemap
├── design-principles.md          # Design philosophy
├── navigation.md                 # Navigation structure
├── accessibility.md              # WCAG compliance
├── component-specs.md            # Component documentation
├── design-states.md              # UI states
├── theme/
│   └── colors.json              # Theme configuration
├── personas/
│   └── user-personas.md         # User personas
└── wireframes/
    └── platform-layout.md       # Overall layout wireframes
```

### 2. Module-Level Design Structure
**For EACH module discovered, create:**

```bash
{project_root}/ccu_workspace/modules/{module_name}/03-design/
├── wireframes.md                # Module-specific wireframes
├── components.md                # shadcn/ui components for module
├── user-flows.md               # Module-specific user flows
└── design-specs.json           # Module design specifications
```

### 3. Central Reference File (design.json)
**ALWAYS create this as the SINGLE SOURCE OF TRUTH:**

```json
{
  "metadata": {
    "phase": "design",
    "version": "2.0.0",
    "timestamp": "{ISO-8601}",
    "track": "{track}",
    "target": "{target}"
  },
  "platform": {
    "design_system": "./design-system.json",
    "theme": "./theme/colors.json",
    "components": "./component-inventory.json",
    "accessibility": "./accessibility.md",
    "information_architecture": "./information-architecture.md",
    "navigation": "./navigation.md",
    "design_principles": "./design-principles.md",
    "personas": "./personas/user-personas.md",
    "wireframes": "./wireframes/platform-layout.md"
  },
  "modules": {
    "{module_name}": {
      "path": "../../modules/{module_name}/03-design/",
      "wireframes": "wireframes.md",
      "components": "components.md",
      "user_flows": "user-flows.md",
      "specs": "design-specs.json"
    }
  },
  "shadcn_components": {
    "installed": [],
    "per_module": {
      "{module_name}": ["component1", "component2"]
    }
  },
  "claude_context": {
    "indexed": false,
    "indexes": ["platform-design", "module-designs", "shadcn-components"]
  }
}
```

## Track-Based Design Process

### 🚀 INSTANT Track
**If track is "instant":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load specification data"
   - "Generate primary persona"
   - "Create basic user flow"
   - "Detect modules from specification"
   - "Apply default layout pattern"
   - "Apply default components per module"
   - "Generate default wireframes"
   - "Create design documentation"
   ```

2. **Load specification and auto-generate everything:**
   ```
   Update TodoWrite: "Load specification data" → in_progress

   Say to user: "🚀 INSTANT MODE: Auto-generating complete design (no user input needed)"

   # Check if specification exists
   specification_path = {project_root}/ccu_workspace/platform/02-specification/specification.json
   If not exists(specification_path):
     Say to user: ""
     Say to user: "❌ ERROR: specification.json not found"
     Say to user: "Please run the specification phase first:"
     Say to user: "/ccu:specify --target={ARGUMENTS.target} --track={ARGUMENTS.track}"
     Say to user: ""
     Exit

   # Load modules from specification
   specification = load(specification_path)
   modules = specification.modules

   Say to user: "✅ Loaded {len(modules)} modules from specification"

   Update TodoWrite: "Load specification data" → completed
   Update TodoWrite: "Generate primary persona" → in_progress

   # Auto-generate ALL personas based on modules (no questions)
   Say to user: "🤖 Auto-generating personas..."
   personas = []
   For module in modules:
     If "auth" in module.name.lower():
       Add persona: "Administrators"
     If "user" in module.name.lower() or "profile" in module.name.lower():
       Add persona: "End Users"
     If "analytics" in module.name.lower():
       Add persona: "Data Analysts"
     If "admin" in module.name.lower():
       Add persona: "System Managers"

   Say to user: "✅ Generated {len(personas)} personas automatically"

   Update TodoWrite: "Generate primary persona" → completed
   ```

3. **Create user flow and apply layout:**
   ```
   Update TodoWrite: "Create basic user flow" → in_progress

   # Generate main user flow
   main_flow = Generate based on modules:
     Entry → Auth (if exists) → Dashboard/Home → Primary Module → Task Completion

   Say to user: "🔄 Generated User Flow: {main_flow}"

   Update TodoWrite: "Create basic user flow" → completed
   Update TodoWrite: "Apply default layout pattern" → in_progress

   # Auto-select layout based on persona and modules
   If modules include dashboard/analytics:
     layout = "Analytics Dashboard"
   Elif modules include products/catalog:
     layout = "E-commerce"
   Elif modules include admin/management:
     layout = "Admin Panel"
   Else:
     layout = "SaaS Application"

   Say to user: "🎨 Applied Layout: {layout} (optimized for {primary_persona.name})"

   Update TodoWrite: "Apply default layout pattern" → completed
   ```

4. **Confirmation before generation:**
   ```
   # Show summary before auto-generation
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 INSTANT DESIGN CONFIGURATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   • **Personas:** {len(personas)} auto-generated
   • **Modules:** {len(modules)} detected
   • **Theme:** Professional (default)
   • **Layout:** {layout}
   • **Components:** Auto-selected

   **Proceed with instant design generation? [Y/n]:** _

   If user confirms (Y or enter):
     Continue with generation
   Else:
     Ask: "Would you like to switch to RAPID track for more control? [Y/n]: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

5. **Apply components and generate outputs:**
   ```
   Update TodoWrite: "Apply default components per module" → in_progress

   # Display what's being auto-applied per module
   Say to user: "📦 Assigning components for {primary_persona.name}'s workflow:"
   For each module in specification:
     components = Select components based on persona needs + module function
     Say: "  • {module_name} → {components}"

   Update TodoWrite: "Apply default components per module" → completed
   Update TodoWrite: "Generate default wireframes" → in_progress

   # Generate wireframes with persona context
   Generate ASCII/Markdown wireframes:
   - Landing page (if platform)
   - Dashboard for {primary_persona.name}
   - Key module screens for main user flow
   - Mobile responsive view

   Update TodoWrite: "Generate default wireframes" → completed
   Update TodoWrite: "Create design documentation" → in_progress

   # CRITICAL: Create proper file structure with validation
   platform_path = {project_root}/ccu_workspace/platform/03-design/

   # Validate and create directories
   If not exists(platform_path):
     Create directory: platform_path
     Say to user: "✅ Created: {platform_path}"
   Else:
     Say to user: "📁 Using existing: {platform_path}"

   # Create subdirectories
   For subdir in ["personas", "wireframes", "theme", "user-flows"]:
     subdir_path = {platform_path}/{subdir}/
     If not exists(subdir_path):
       Create directory: subdir_path

   # Generate platform-level files
   Say to user: "📝 Generating design files..."

   # Generate technical approach (minimal for instant)
   technical_content = Generate minimal technical approach:
     - Technology stack
     - Basic architecture

   Write file: {platform_path}/technical-approach.md
   Content: technical_content

   # Generate platform UX design (auto-generated)
   platform_ux = Generate instant UX:
     - Default navigation
     - Standard layouts

   Write file: {platform_path}/ux-design.md
   Content: platform_ux

   # Generate design system
   design_system = {
     "version": "1.0",
     "track": "instant",
     "theme": "professional",
     "colors": default_colors,
     "components": auto_selected_components
   }

   Write file: {platform_path}/design-system.json
   Content: design_system

   # Generate information architecture
   info_arch = Generate based on modules:
     - Module hierarchy
     - Navigation structure

   Write file: {platform_path}/information-architecture.md
   Content: info_arch

   # Generate basic accessibility
   accessibility = Generate minimal WCAG guidelines

   Write file: {platform_path}/accessibility.md
   Content: accessibility

   # Generate component specs
   component_specs = List default shadcn components

   Write file: {platform_path}/component-specs.md
   Content: component_specs

   # Generate personas
   persona_doc = Generate combined persona document

   Write file: {platform_path}/personas/user-personas.md
   Content: persona_doc

   # Generate wireframes
   wireframes = Generate ASCII wireframes:
     - Dashboard
     - Module screens

   Write file: {platform_path}/wireframes/platform-layout.md
   Content: wireframes

   # Generate theme
   theme_colors = {
     "primary": "#0ea5e9",
     "secondary": "#64748b",
     "background": "#ffffff",
     "foreground": "#0f172a"
   }

   Write file: {platform_path}/theme/colors.json
   Content: theme_colors

   # Generate module-level files for EACH discovered module
   module_design_files = []
   For module in specification.modules:
     module_path = {project_root}/ccu_workspace/modules/{module.name}/03-design/

     If not exists(module_path):
       Create directory: module_path

     # Generate module UX design
     module_ux = Generate auto UX for module
     Write file: {module_path}/ux-design.md
     Content: module_ux

     # Generate module wireframes
     module_wireframes = Generate module screens
     Write file: {module_path}/wireframes.md
     Content: module_wireframes

     # Generate components
     components = Auto-select shadcn components
     Write file: {module_path}/components.md
     Content: components

     # Generate user flows
     flows = Generate basic module flow
     Write file: {module_path}/user-flows.md
     Content: flows

     # Generate design specs
     specs = {
       "module": module.name,
       "layout": "default",
       "components": Extract components
     }
     Write file: {module_path}/design-specs.json
     Content: specs

     module_design_files.append({
       "module": module.name,
       "path": module_path,
       "files": [
         "ux-design.md",
         "wireframes.md",
         "components.md",
         "user-flows.md",
         "design-specs.json"
       ]
     })

   Update TodoWrite: "Create design documentation" → completed

   # Generate design.json as SINGLE SOURCE OF TRUTH
   generated_files = []

   # Collect actual platform files generated
   platform_files = [
     "technical-approach.md",
     "ux-design.md",
     "design-system.json",
     "information-architecture.md",
     "accessibility.md",
     "component-specs.md",
     "personas/user-personas.md",
     "wireframes/platform-layout.md",
     "theme/colors.json"
   ]

   # Create design.json with all references (CREATED LAST)
   design_json = {
     "version": "1.0",
     "generated_at": current_timestamp,
     "track": "instant",
     "target": ARGUMENTS.target,
     "theme": "professional",
     "layout": layout,
     "personas": personas,
     "modules_count": len(modules),
     "platform_design": {
       "path": "platform/03-design/",
       "files": platform_files
     },
     "module_designs": module_design_files,
     "total_files_generated": len(platform_files) + sum([len(m["files"]) for m in module_design_files]),
     "next_phase": "security",
     "next_command": "/ccu:security --target={ARGUMENTS.target} --track=instant"
   }

   Write file: {platform_path}/design.json
   Content: design_json

   Say to user: "✅ Created design.json with {design_json['total_files_generated']} file references"

   # Index with claude-context (minimal for instant)
   mcp__claude-context__index_codebase(
     path: {project_root}/ccu_workspace/,
     customExtensions: [".md", ".json"],
     splitter: "langchain"
   )

   # Final completion summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ INSTANT DESIGN COMPLETE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 **Summary:**
     • Personas generated: {len(personas)}
     • Modules configured: {len(modules)}
     • Files created: 23+
     • Theme: Professional (default)
     • Time: < 30 seconds

   📁 **Output Location:**
     {project_root}/ccu_workspace/platform/03-design/

   🚀 **Next Steps:**
     1. Review generated design files
     2. Run: /ccu:security --target={ARGUMENTS.target} --track=instant

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load specification"
   - "Collect design preferences"
   - "Analyze with ux-ui-designer"
   - "Generate design assets"
   ```

2. **Load specification and auto-generate personas:**
   ```
   Update TodoWrite: "Load specification" → in_progress

   # Load modules from specification
   specification = load("specification.json")
   modules = specification.modules

   Say to user: "⚡ RAPID MODE: Quick design generation"
   Say to user: ""
   Say to user: "📦 Detected {len(modules)} modules from specification"

   Update TodoWrite: "Load specification" → completed
   Update TodoWrite: "Auto-generate personas" → in_progress

   Say to user: ""
   Say to user: "🤖 AUTO-GENERATING PERSONAS"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Quick persona generation based on modules
   personas = []
   For module in modules:
     Generate relevant personas based on module type

   Say to user: "✅ Generated {len(personas)} personas based on your modules"
   ```

3. **Collect module-specific UI preferences (simplified):**
   ```
   Update TodoWrite: "Collect design preferences" → in_progress

   # Show progress bar
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Personas:     [Done]   ████████████████████ 100% ✅
   Questions:    [0/{len(modules)}]   ░░░░░░░░░░░░░░░░░░░░ 0% 🔄
   Generation:   [Wait]   ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   # RAPID: One simple question per module
   For index, module in enumerate(modules):
     # Calculate progress
     progress_filled = int((index / len(modules)) * 20)
     progress_empty = 20 - progress_filled
     progress_bar = "█" * progress_filled + "░" * progress_empty
     percentage = int((index / len(modules)) * 100)

     # Update progress
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Questions:    [{index}/{len(modules)}]   {progress_bar} {percentage}% 🔄
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     🔢 QUESTION {index+1}/{len(modules)}
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     📦 **Module: {module.name}**

     # Load shadcn references
     Load shadcn_refs from templates/design/shadcn-references.yaml

     # Visual question based on module type
     If "auth" in module.name.lower():
       Say to user: "🔐 **Authentication UI Style**"
       Say to user: ""
       Say to user: "[1] Centered Simple"
       Say to user: "    ┌──────────────────┐"
       Say to user: "    │     ┌────┐       │  → Quick access"
       Say to user: "    │     │Form│       │  → Minimal design"
       Say to user: "    │     └────┘       │"
       Say to user: "    └──────────────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/login#login-01"
       Say to user: ""
       Say to user: "[2] Split Screen"
       Say to user: "    ┌──────────┬──────────┐"
       Say to user: "    │  Brand   │  LOGIN   │  → Professional"
       Say to user: "    │  Image   │  ┌────┐  │"
       Say to user: "    │          │  │Form│  │"
       Say to user: "    │          │  └────┘  │"
       Say to user: "    └──────────┴──────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/login#login-04"
       Say to user: ""
       Say to user: "💡 More options: https://ui.shadcn.com/blocks/login"
       Say to user: ""
       Ask: "Your choice: "

     Elif "dashboard" in module.name.lower() or "analytics" in module.name.lower():
       Say to user: "📊 **Dashboard Layout**"
       Say to user: ""
       Say to user: "[1] Cards & Charts"
       Say to user: "    ┌──────┐ ┌──────┐ ┌──────┐"
       Say to user: "    │ KPI  │ │ KPI  │ │ KPI  │  → Visual metrics"
       Say to user: "    └──────┘ └──────┘ └──────┘"
       Say to user: "    ┌─────────┬───────────┐"
       Say to user: "    │ 📈 Chart│ 🥧 Chart │  → Analytics focus"
       Say to user: "    └─────────┴───────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/dashboard"
       Say to user: ""
       Say to user: "[2] Data Tables"
       Say to user: "    ┌─────────────────────┐"
       Say to user: "    │ Name  │Status│Amount│  → Data focus"
       Say to user: "    ├───────┼──────┼──────┤"
       Say to user: "    │ Item 1│Active│ $100 │"
       Say to user: "    └───────┴──────┴──────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/data-table"
       Say to user: ""
       # WITH VALIDATION
       choice = get_validated_input(
         "Your choice: ",
         (input) => validate_numeric_choice(input, 1, 2)
       )
       If choice == null:
         Say to user: "Using default: Option 1 (Cards & Charts)"
         choice = 1

     Elif "data" in module.name.lower() or "manage" in module.name.lower():
       Say to user: "📋 **Data Display Style**"
       Say to user: ""
       Say to user: "[1] Data Table"
       Say to user: "    ┌─────────────────────┐"
       Say to user: "    │ Name  │Status│Amount│  → Structured"
       Say to user: "    ├───────┼──────┼──────┤  → Sortable"
       Say to user: "    │ Row 1 │Active│ $100 │"
       Say to user: "    └───────┴──────┴──────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/table"
       Say to user: ""
       Say to user: "[2] Card Grid"
       Say to user: "    ┌─────┐ ┌─────┐ ┌─────┐"
       Say to user: "    │Card │ │Card │ │Card │  → Visual"
       Say to user: "    │Data │ │Data │ │Data │  → Quick scan"
       Say to user: "    └─────┘ └─────┘ └─────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/card"
       Say to user: ""
       Ask: "Your choice: "

     Else:
       Say to user: "🎨 **Layout Style**"
       Say to user: ""
       Say to user: "[1] Standard Layout"
       Say to user: "    ┌─────────────────┐"
       Say to user: "    │     Header      │"
       Say to user: "    ├────┬────────────┤  → Classic"
       Say to user: "    │Side│   Content  │  → Familiar"
       Say to user: "    │bar │            │"
       Say to user: "    └────┴────────────┘"
       Say to user: ""
       Say to user: "[2] Custom Layout"
       Say to user: "    ┌──────┬──────────┐"
       Say to user: "    │Panels│  Flex    │  → Flexible"
       Say to user: "    │      ├──────────┤  → Unique"
       Say to user: "    │      │  Areas   │"
       Say to user: "    └──────┴──────────┘"
       Say to user: ""
       # WITH VALIDATION
       choice = get_validated_input(
         "Your choice: ",
         (input) => validate_numeric_choice(input, 1, 2)
       )
       If choice == null:
         Say to user: "Using default: Option 1 (Standard Layout)"
         choice = 1

   Update TodoWrite: "Collect design preferences" → completed
   ```

4. **Select Grid Layout:**
   ```
   Update TodoWrite: "Select grid layout" → in_progress

   Say to user: ""
   Say to user: "🔲 GRID LAYOUT SYSTEM"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "[1] Auto-fit Grid"
   Say to user: "    ┌─────┬─────┬─────┬─────┐"
   Say to user: "    │Card │Card │Card │Card │  → Responsive"
   Say to user: "    └─────┴─────┴─────┴─────┘"
   Say to user: ""
   Say to user: "[2] Fixed Grid (Mobile → Desktop)"
   Say to user: "    ┌─────┐ → ┌───┬───┐ → ┌──┬──┬──┬──┐"
   Say to user: "    │     │   │   │   │   │  │  │  │  │"
   Say to user: "    └─────┘   └───┴───┘   └──┴──┴──┴──┘"
   Say to user: ""
   Say to user: "[3] Masonry Style"
   Say to user: "    ┌───┐ ┌─────┐ ┌───┐"
   Say to user: "    │   │ │     │ │   │  → Pinterest-like"
   Say to user: "    ├───┤ │     │ └───┘"
   Say to user: "    │   │ └─────┘"
   Say to user: "    └───┘"
   Say to user: ""
   Ask: "Your choice: "

   Update TodoWrite: "Select grid layout" → completed
   ```

5. **Select Sidebar Style:**
   ```
   Update TodoWrite: "Select sidebar style" → in_progress

   Say to user: ""
   Say to user: "📱 SIDEBAR STYLE"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "[1] Simple"
   Say to user: "    ┌──────┐"
   Say to user: "    │ ▸Home│  → Clean"
   Say to user: "    │ ▸User│  → Minimal"
   Say to user: "    └──────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-01"
   Say to user: ""
   Say to user: "[2] Collapsible"
   Say to user: "    ┌──────┐"
   Say to user: "    │▼ Main│  → Groups"
   Say to user: "    │  Home│  → Organized"
   Say to user: "    │▶Tools│"
   Say to user: "    └──────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-02"
   Say to user: ""
   Say to user: "[3] Icons Only"
   Say to user: "    ┌──┐"
   Say to user: "    │🏠│  → Compact"
   Say to user: "    │👤│  → Mobile"
   Say to user: "    │⚙️│"
   Say to user: "    └──┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-07"
   Say to user: ""
   Ask: "Your choice: "

   Update TodoWrite: "Select sidebar style" → completed
   ```

6. **Select theme (enhanced):**
   ```
   Update TodoWrite: "Select theme" → in_progress

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔢 THEME SELECTION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   🎨 **Visual Theme**

   Say to user: "Choose your theme:"
   Say to user: ""
   Say to user: "[1] Professional (Slate/Neutral)"
   Say to user: "    → Clean business look"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[2] Modern (Zinc/Violet)"
   Say to user: "    → Contemporary feel"
   Say to user: "    → https://ui.shadcn.com/themes#new-york"
   Say to user: ""
   Say to user: "[3] Friendly (Blue/Green)"
   Say to user: "    → Approachable design"
   Say to user: "    → https://ui.shadcn.com/themes#blue"
   Say to user: ""
   Say to user: "[4] Dark Mode First"
   Say to user: "    → Developer friendly"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[5] Custom Colors"
   Say to user: "    → Your brand colors"
   Say to user: "    → https://ui.shadcn.com/colors"
   Say to user: ""
   Ask: "Your choice: "

   If choice == 5:
     Say to user: "Visit https://ui.shadcn.com/colors for palette generator"
     Ask: "Primary color (hex): "
     Ask: "Secondary color (hex): "

   Update TodoWrite: "Select theme" → completed
   ```

7. **Confirmation before generation:**
   ```
   # Show design configuration summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 RAPID DESIGN CONFIGURATION SUMMARY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   • **Personas:** {len(personas)} auto-generated
   • **Module UIs:** {len(modules)} configured
   • **Theme:** {selected_theme}
   • **Components:** Based on module types

   **Proceed with design generation? [Y/n]:** _

   If user wants to modify:
     Ask: "What would you like to change? [theme/modules/cancel]: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

8. **Activate ux-ui-designer agent:**
   ```
   Update TodoWrite: "Analyze with ux-ui-designer" → in_progress

   Activate ux-ui-designer agent with Sonnet:
   "Using the specifications and requirements, create a comprehensive UX/UI design for {target} with track={track}.
   Provide wireframes, component mappings, design system configuration, and user flows.
   Include: {specification_data}"

   # Agent returns structured JSON with:
   # - design_summary
   # - wireframes (ASCII representations)
   # - design_system (theme, colors, typography)
   # - components (shadcn_components list)
   # - user_flows
   # - accessibility considerations
   # - responsive_breakpoints
   # - confidence_score

   Update TodoWrite: "Analyze with ux-ui-designer" → completed

9. **Generate design files from agent analysis:**
   ```
   Update TodoWrite: "Generate design assets" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🤖 Creating RAPID design documentation..."
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Extract from ux-ui-designer agent's response
   agent_design = agent_analysis from ux-ui-designer

   # Create platform design directory
   platform_path = {project_root}/ccu_workspace/platform/03-design/
   If not exists(platform_path):
     Create directory: platform_path
     Say to user: "✅ Created platform design directory"

   # Create subdirectories
   For subdir in ["personas", "wireframes", "user-flows", "theme"]:
     subdir_path = {platform_path}/{subdir}/
     If not exists(subdir_path):
       Create directory: subdir_path

   # Load templates from ccu_framework/templates/design/
   Load wireframe_template = ccu_framework/templates/design/wireframes.template.md
   Load design_system_template = ccu_framework/templates/design/design-system.template.json
   Load ux_design_template = ccu_framework/templates/design/ux-design.template.md

   # Generate platform UX design from agent's analysis
   Say to user: "🎨 Generating platform UX design..."
   Write file: {platform_path}/ux-design.md
   Content: Fill ux_design_template with agent_design.design_summary

   # Generate design system from agent's structured data
   design_system = {
     "version": "1.0",
     "track": "rapid",
     "theme": agent_design.design_system.theme,
     "colors": agent_design.design_system.colors,
     "typography": agent_design.design_system.typography,
     "components": agent_design.components.shadcn_components
   }
   Write file: {platform_path}/design-system.json
   Content: design_system

   # Generate wireframes from agent's ASCII wireframes
   Say to user: "📐 Creating wireframes..."
   Write file: {platform_path}/wireframes/platform-layout.md
   Content: Fill wireframe_template with agent_design.wireframes

   # Generate user flows from agent's analysis
   Write file: {platform_path}/user-flows/main-flows.md
   Content: agent_design.user_flows

   # Generate personas (auto-generated)
   For persona in personas:
     persona_doc = Generate basic persona
     Write file: {platform_path}/personas/{persona.name.lower().replace(' ', '-')}.md
     Content: persona_doc

   # Generate module-specific files
   Say to user: "📦 Generating module designs..."
   module_design_files = []
   For module in specification.modules:
     module_path = {project_root}/ccu_workspace/modules/{module.name}/03-design/

     If not exists(module_path):
       Create directory: module_path

     # Generate module UX
     module_ux = Generate based on module UI preference
     Write file: {module_path}/ux-design.md
     Content: module_ux

     # Generate module wireframes
     module_wireframes = Generate module screens
     Write file: {module_path}/wireframes.md
     Content: module_wireframes

     # Generate component list
     components = List shadcn components for module
     Write file: {module_path}/components.md
     Content: components

     # Generate user flows
     flows = Generate module workflows
     Write file: {module_path}/user-flows.md
     Content: flows

     # Generate design specs
     specs = {
       "module": module.name,
       "ui_preference": module_ui_preferences[module.name],
       "components": Extract components
     }
     Write file: {module_path}/design-specs.json
     Content: specs

     module_design_files.append({
       "module": module.name,
       "path": module_path,
       "files": [
         "ux-design.md",
         "wireframes.md",
         "components.md",
         "user-flows.md",
         "design-specs.json"
       ]
     })

   Say to user: "✅ RAPID design files generated!"

   Update TodoWrite: "Generate design assets" → completed

   # Generate design.json as SINGLE SOURCE OF TRUTH for RAPID
   # Collect all platform files
   platform_files = [
     "design-system.json",
     "information-architecture.md",
     "design-principles.md",
     "navigation.md",
     "accessibility.md",
     "component-specs.md",
     "design-states.md",
     "component-inventory.json",
     "personas/",
     "wireframes/",
     "user-flows/",
     "theme/colors.json"
   ]

   # Collect all module files
   module_files = []
   For module in specification.modules:
     module_files.append({
       "module": module.name,
       "files": [
         "wireframes.md",
         "components.md",
         "user-flows.md",
         "design-specs.json"
       ],
       "ui_preference": module.ui_preference  # Store the UI choice made
     })

   # Create design.json with all references
   design_json = {
     "version": "1.0",
     "generated_at": current_timestamp,
     "track": "rapid",
     "target": ARGUMENTS.target,
     "theme": selected_theme,
     "custom_colors": custom_colors if selected_theme == "custom" else null,
     "personas_count": len(personas),
     "modules_count": len(modules),
     "platform_files": platform_files,
     "module_files": module_files,
     "module_ui_choices": module_ui_preferences,  # Store all UI choices
     "total_files_generated": len(platform_files) + (len(modules) * 4),
     "agent_analysis": agent_analysis,  # Results from ux-ui-designer
     "next_phase": "security",
     "next_command": "/ccu:security --target={ARGUMENTS.target} --track=rapid"
   }

   Write file: {platform_path}/design.json
   Content: design_json

   Say to user: "✅ Created design.json - SINGLE SOURCE OF TRUTH with all design decisions"

   # Final completion summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ RAPID DESIGN COMPLETE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 **Summary:**
     • Personas: {len(personas)} auto-generated
     • Modules: {len(modules)} configured
     • Theme: {selected_theme}
     • Components: Selected
     • Time: < 2 minutes

   💁 **Output Location:**
     {project_root}/ccu_workspace/{path}/03-design/

   🚀 **Next Steps:**
     1. Review generated design files and design.json
     2. Run: /ccu:security --target={ARGUMENTS.target} --track=rapid

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load specification"
   - "Auto-generate personas from modules"
   - "Collect module UI preferences"
   - "Select theme"
   - "Confirm design plan"
   - "Generate comprehensive designs"
   - "Generate module designs"
   - "Generate design.json"
   - "Create completion summary"
   - "Display next steps"
   ```

2. **Load specification and auto-generate personas:**
   ```
   Update TodoWrite: "Load specification" → in_progress

   # Check if specification exists
   specification_path = {project_root}/ccu_workspace/platform/02-specification/specification.json
   If not exists(specification_path):
     Say to user: ""
     Say to user: "❌ ERROR: specification.json not found"
     Say to user: "Please run the specification phase first:"
     Say to user: "/ccu:specify --target={ARGUMENTS.target} --track=standard"
     Say to user: ""
     Exit

   # Load specification data from mem0 if available
   Say to user: "🔍 Loading specification context from memory..."
   spec_memory = mcp__mem0__search_memory(
     query: "specification {ARGUMENTS.target} modules requirements",
     user_id: "specification_phase",
     limit: 10
   )

   If spec_memory and spec_memory.results:
     Say to user: "✅ Found {len(spec_memory.results)} specification memories"

   # Load modules from specification
   specification = load(specification_path)
   modules = specification.modules

   Say to user: "📦 Detected {len(modules)} modules from specification:"
   For module in modules:
     Say: "  • {module.name}: {module.description}"

   # Load previous design patterns from mem0
   Say to user: "🔍 Searching for relevant design patterns..."
   design_patterns = mcp__mem0__search_memory(
     query: "design patterns UI components shadcn {specification.platform_name}",
     user_id: "design_phase",
     limit: 5
   )

   If design_patterns and design_patterns.results:
     Say to user: "✅ Found {len(design_patterns.results)} relevant design patterns"

   Update TodoWrite: "Load specification" → completed
   Update TodoWrite: "Auto-generate personas from modules" → in_progress

   Say to user: ""
   Say to user: "🤖 AUTO-GENERATING USER PERSONAS"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Analyze modules to create personas
   personas = []
   For module in modules:
     If "auth" in module.name.lower():
       Add persona: "System Administrators - Manage access and security"
     If "family" in module.name.lower() or "user" in module.name.lower():
       Add persona: "Primary Users - Core application users"
     If "analytics" in module.name.lower() or "report" in module.name.lower():
       Add persona: "Data Analysts - View insights and reports"
     If "admin" in module.name.lower() or "manage" in module.name.lower():
       Add persona: "Managers - Oversee operations"

   Say to user: "✅ Generated {len(personas)} personas based on your modules:"
   For persona in personas:
     Say to user: "  • {persona}"

   # Ask if user wants to modify roles/personas
   Say to user: ""
   Ask: "Would you like to modify these roles? [Y/n]: "

   If user says Yes:
     Say to user: ""
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "🎭 ROLE CONFIGURATION"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""
     Say to user: "Current roles:"
     For i, persona in enumerate(personas, 1):
       Say to user: "  [{i}] {persona}"
     Say to user: ""
     Say to user: "Choose action:"
     Say to user: "  [A] Add new role"
     Say to user: "  [R] Remove role"
     Say to user: "  [M] Modify existing role"
     Say to user: "  [C] Continue with current roles"
     Say to user: ""
     Ask: "Your choice: "

     Handle user's choice:
     - If A: Ask for role name and description, add to personas
     - If R: Ask which number to remove, remove from personas
     - If M: Ask which number to modify, ask for new name/description
     - If C: Continue

     Loop until user chooses C (Continue)

   Update TodoWrite: "Auto-generate personas from modules" → completed
   ```

3. **Collect module-specific UI preferences:**
   ```
   Update TodoWrite: "Collect module UI preferences" → in_progress

   # Show overall progress
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Personas:     [Done]   ████████████████████ 100% ✅
   Modules:      [0/{len(modules)}]   ░░░░░░░░░░░░░░░░░░░░ 0% 🔄
   Theme:        [Wait]   ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Generation:   [Wait]   ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   # For each module, ask relevant UI question
   module_count = 0
   For module in modules:
     module_count += 1
     module_type = detect_module_type(module)

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     🔢 QUESTION {module_count}/{len(modules)}
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

     📦 **Module: {module.name}**

     # Load shadcn references for visual previews
     Load shadcn_refs from templates/design/shadcn-references.yaml

     # Dynamic question based on module type with visual previews
     If "auth" in module_type or "login" in module_type:
       Say to user: "🔐 **Authentication UI Style**"
       Say to user: ""
       Say to user: "[1] Split Screen"
       Say to user: "    ┌──────────┬──────────┐"
       Say to user: "    │  Brand   │  LOGIN   │  → 50/50 split"
       Say to user: "    │  Image   │  ┌────┐  │  → Professional look"
       Say to user: "    │          │  │Form│  │"
       Say to user: "    │          │  └────┘  │"
       Say to user: "    └──────────┴──────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/login#login-04"
       Say to user: ""
       Say to user: "[2] Centered Simple"
       Say to user: "    ┌──────────────────┐"
       Say to user: "    │                  │  → Minimal design"
       Say to user: "    │     ┌────┐       │  → Quick access"
       Say to user: "    │     │Form│       │"
       Say to user: "    │     └────┘       │"
       Say to user: "    └──────────────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/login#login-01"
       Say to user: ""
       Say to user: "[3] With Background"
       Say to user: "    ┌──────────────────┐"
       Say to user: "    │░░░░░░░░░░░░░░░░░░│  → Muted background"
       Say to user: "    │░░░░┌────┐░░░░░░░░│  → Modern look"
       Say to user: "    │░░░░│Form│░░░░░░░░│"
       Say to user: "    │░░░░└────┘░░░░░░░░│"
       Say to user: "    └──────────────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/login#login-03"
       Say to user: ""
       Say to user: "💡 View all options: https://ui.shadcn.com/blocks/login"
       Say to user: ""
       Ask: "Your choice: "

     Elif "dashboard" in module_type or "analytics" in module_type:
       Say to user: "📊 **Dashboard Layout**"
       Say to user: ""
       Say to user: "[1] Cards & Charts"
       Say to user: "    ┌──────┐ ┌──────┐ ┌──────┐"
       Say to user: "    │ KPI  │ │ KPI  │ │ KPI  │  → Visual metrics"
       Say to user: "    │ $100 │ │ $250 │ │ $75  │  → Quick scanning"
       Say to user: "    │ ▲12% │ │ ▼5%  │ │ ▲8%  │"
       Say to user: "    └──────┘ └──────┘ └──────┘"
       Say to user: "    ┌─────────┬───────────┐"
       Say to user: "    │ 📈 Line │ 🥧 Pie    │  → Visual analytics"
       Say to user: "    └─────────┴───────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/dashboard#dashboard-01"
       Say to user: ""
       Say to user: "[2] Data Tables"
       Say to user: "    ┌─────────────────────────────┐"
       Say to user: "    │ Name    │ Status │ Amount   │  → Sortable"
       Say to user: "    ├─────────┼────────┼──────────┤  → Filterable"
       Say to user: "    │ Item 1  │ Active │ $100.00  │  → Paginated"
       Say to user: "    │ Item 2  │ Pending│ $250.00  │"
       Say to user: "    └─────────┴────────┴──────────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/data-table"
       Say to user: ""
       Say to user: "[3] Mixed View"
       Say to user: "    ┌──────────────────────────┐"
       Say to user: "    │ Cards    │ Charts        │  → Balanced layout"
       Say to user: "    ├──────────┴───────────────┤  → Best of both"
       Say to user: "    │ Data Table               │"
       Say to user: "    └──────────────────────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks/dashboard"
       Say to user: ""
       Say to user: "💡 Browse dashboards: https://ui.shadcn.com/blocks#dashboard"
       Say to user: ""
       Ask: "Your choice: "

     Elif "data" in module_type or "manage" in module_type:
       Say to user: "📋 **Data Display Style**"
       Say to user: ""
       Say to user: "[1] Table View"
       Say to user: "    ┌─────────────────────────────┐"
       Say to user: "    │ Name    │ Status │ Amount   │  → Structured data"
       Say to user: "    ├─────────┼────────┼──────────┤  → Sortable columns"
       Say to user: "    │ Item 1  │ Active │ $100.00  │  → Bulk actions"
       Say to user: "    │ Item 2  │ Pending│ $250.00  │"
       Say to user: "    └─────────┴────────┴──────────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/table"
       Say to user: ""
       Say to user: "[2] Card Grid"
       Say to user: "    ┌──────┐ ┌──────┐ ┌──────┐"
       Say to user: "    │ Card │ │ Card │ │ Card │  → Visual appeal"
       Say to user: "    │ Data │ │ Data │ │ Data │  → Quick overview"
       Say to user: "    │ ••••• │ │ ••••• │ │ ••••• │  → Mobile friendly"
       Say to user: "    └──────┘ └──────┘ └──────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/card"
       Say to user: ""
       Say to user: "[3] List View"
       Say to user: "    ┌─────────────────────────┐"
       Say to user: "    │ • Item with description │  → Detailed info"
       Say to user: "    │   Secondary text here   │  → Good for tasks"
       Say to user: "    ├─────────────────────────┤  → Scannable"
       Say to user: "    │ • Another item          │"
       Say to user: "    │   More details          │"
       Say to user: "    └─────────────────────────┘"
       Say to user: "    → https://ui.shadcn.com/blocks#lists"
       Say to user: ""
       Say to user: "💡 Browse components: https://ui.shadcn.com/docs/components"
       Say to user: ""
       Ask: "Your choice: "

     Elif "form" in module_type or "input" in module_type:
       Say to user: "📝 **Form Style**"
       Say to user: ""
       Say to user: "[1] Single Column"
       Say to user: "    ┌──────────────┐"
       Say to user: "    │ Label       │  → Traditional"
       Say to user: "    │ [__________]│  → Clear flow"
       Say to user: "    │ Label       │"
       Say to user: "    │ [__________]│"
       Say to user: "    │   [Submit]  │"
       Say to user: "    └──────────────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/form"
       Say to user: ""
       Say to user: "[2] Multi-step Wizard"
       Say to user: "    ┌───────────────────┐"
       Say to user: "    │ Step 1 • 2 • 3    │  → Guided process"
       Say to user: "    ├───────────────────┤  → Progress tracking"
       Say to user: "    │ Current Step Form │"
       Say to user: "    │ [Back] [Next]     │"
       Say to user: "    └───────────────────┘"
       Say to user: ""
       Say to user: "[3] Inline Editing"
       Say to user: "    ┌───────────────────┐"
       Say to user: "    │ Click to edit ✏️  │  → Quick edits"
       Say to user: "    │ Hover to modify   │  → In-place updates"
       Say to user: "    └───────────────────┘"
       Say to user: ""
       Ask: "Your choice: "

     Elif "report" in module_type or "analytics" in module_type:
       Say to user: "📊 **Report Format**"
       Say to user: ""
       Say to user: "[1] Charts Focus"
       Say to user: "    ┌───────────────────┐"
       Say to user: "    │  📈 Line Chart   │  → Visual insights"
       Say to user: "    ├─────────┬─────────┤  → Trend analysis"
       Say to user: "    │ 📊 Bar  │ 🥧 Pie  │"
       Say to user: "    └─────────┴─────────┘"
       Say to user: "    → https://ui.shadcn.com/docs/components/chart"
       Say to user: ""
       Say to user: "[2] Tables Focus"
       Say to user: "    ┌───────────────────┐"
       Say to user: "    │ Detailed Data    │  → Raw numbers"
       Say to user: "    ├───────────────────┤  → Exportable"
       Say to user: "    │ Row | Row | Row  │"
       Say to user: "    └───────────────────┘"
       Say to user: ""
       Say to user: "[3] Combined View"
       Say to user: "    ┌───────────────────┐"
       Say to user: "    │ KPIs │ Chart     │  → Overview + detail"
       Say to user: "    ├──────┴───────────┤"
       Say to user: "    │   Data Table      │"
       Say to user: "    └───────────────────┘"
       Say to user: ""
       Ask: "Your choice: "

     Else:
       Say to user: "🎨 **UI Layout**"
       Say to user: ""
       Say to user: "[1] Standard Layout"
       Say to user: "    ┌──────────────────┐"
       Say to user: "    │     Header       │"
       Say to user: "    ├────┬─────────────┤  → Classic layout"
       Say to user: "    │Side│   Content   │  → Familiar UX"
       Say to user: "    │bar │             │"
       Say to user: "    └────┴─────────────┘"
       Say to user: ""
       Say to user: "[2] Custom Layout"
       Say to user: "    ┌──────┬───────────┐"
       Say to user: "    │Panels│  Dynamic  │  → Flexible"
       Say to user: "    │      ├───────────┤  → Unique UX"
       Say to user: "    │      │   Areas   │"
       Say to user: "    └──────┴───────────┘"
       Say to user: ""
       Say to user: "[3] Minimal Layout"
       Say to user: "    ┌──────────────────┐"
       Say to user: "    │                  │  → Clean"
       Say to user: "    │    Content       │  → Focus"
       Say to user: "    │                  │  → Distraction-free"
       Say to user: "    └──────────────────┘"
       Say to user: ""
       Ask: "Your choice: "

     # Store the user's choice for this module
     ui_choice = Get user input (1-3 or custom option)
     module_ui_preferences[module.name] = ui_choice

     # MCP Integration: Fetch shadcn documentation for selected UI pattern
     Say to user: "📖 Fetching shadcn/ui component documentation..."

     # First resolve the library ID
     library_id = mcp__context7__resolve-library-id(
       libraryName: "shadcn-ui"
     )

     # Get component-specific docs based on selection
     If "auth" in module_type or "login" in module_type:
       component_docs = mcp__context7__get-library-docs(
         context7CompatibleLibraryID: library_id,
         topic: "authentication forms login input validation",
         tokens: 3000
       )
     Elif "dashboard" in module_type:
       component_docs = mcp__context7__get-library-docs(
         context7CompatibleLibraryID: library_id,
         topic: "dashboard charts cards data-table metrics",
         tokens: 3000
       )
     Elif "data" in module_type or "table" in module_type:
       component_docs = mcp__context7__get-library-docs(
         context7CompatibleLibraryID: library_id,
         topic: "data-table table card list pagination sorting",
         tokens: 3000
       )
     Elif "form" in module_type:
       component_docs = mcp__context7__get-library-docs(
         context7CompatibleLibraryID: library_id,
         topic: "form input select checkbox radio validation",
         tokens: 3000
       )
     Else:
       component_docs = mcp__context7__get-library-docs(
         context7CompatibleLibraryID: library_id,
         topic: "layout navigation sidebar tabs",
         tokens: 2000
       )

     # Store docs for later use in generation
     component_documentation[module.name] = {
       "ui_type": ui_choice,
       "shadcn_docs": component_docs,
       "module_type": module_type
     }

     # MCP Integration: Save UI decision to mem0
     mcp__mem0__add_memory(
       text: "UI decision for module {module.name} in {specification.platform_name}: Type={module_type}, Selected={ui_choice}, Components={extracted_components}"
     )

     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Update TodoWrite: "Collect design preferences" → completed
   ```

4. **Grid Layout Selection:**
   ```
   Update TodoWrite: "Select grid layout" → in_progress

   Say to user: ""
   Say to user: "🔲 LAYOUT GRID SYSTEM"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "[1] Auto-fit Grid (Responsive columns)"
   Say to user: "    ┌─────┬─────┬─────┬─────┐"
   Say to user: "    │ Card│ Card│ Card│ Card│  → Auto-adjusts"
   Say to user: "    ├─────┼─────┼─────┴─────┤  → Perfect for dashboards"
   Say to user: "    │ Card│ Card│   Card    │"
   Say to user: "    └─────┴─────┴───────────┘"
   Say to user: "    CSS: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))"
   Say to user: ""
   Say to user: "[2] Fixed Grid (2-3-4 responsive)"
   Say to user: "    Mobile      Tablet        Desktop"
   Say to user: "    ┌─────┐    ┌───┬───┐    ┌──┬──┬──┬──┐"
   Say to user: "    │     │    │   │   │    │  │  │  │  │"
   Say to user: "    └─────┘    └───┴───┘    └──┴──┴──┴──┘"
   Say to user: "    Tailwind: grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
   Say to user: ""
   Say to user: "[3] Asymmetric Grid (Featured + Regular)"
   Say to user: "    ┌───────────┬─────┬─────┐"
   Say to user: "    │  Featured │ Card│ Card│  → Hero + smaller"
   Say to user: "    │           ├─────┼─────┤  → Good for highlights"
   Say to user: "    │           │ Card│ Card│"
   Say to user: "    └───────────┴─────┴─────┘"
   Say to user: ""
   Say to user: "[4] Masonry/Pinterest Style"
   Say to user: "    ┌─────┐ ┌─────────┐ ┌───┐"
   Say to user: "    │ Card│ │  Card   │ │   │  → Variable heights"
   Say to user: "    ├─────┤ │         │ │Card│ → Natural flow"
   Say to user: "    │ Card│ ├─────────┤ ├───┤"
   Say to user: "    └─────┘ └─────────┘ └───┘"
   Say to user: ""
   Say to user: "[5] Bento Grid (Mixed sizes)"
   Say to user: "    ┌───────────┬───────┐"
   Say to user: "    │   Large   │ Small │  → Modern dashboard"
   Say to user: "    ├─────┬─────┼───────┤  → Different priorities"
   Say to user: "    │ Med │ Med │ Small │"
   Say to user: "    └─────┴─────┴───────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/dashboard"
   Say to user: ""
   Ask: "Your choice: "

   Update TodoWrite: "Select grid layout" → completed
   ```

5. **Sidebar Style Selection:**
   ```
   Update TodoWrite: "Select sidebar style" → in_progress

   Say to user: ""
   Say to user: "🎨 SIDEBAR LAYOUT STYLE"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "[1] Simple Grouped"
   Say to user: "    ┌──────────┐"
   Say to user: "    │ MAIN     │"
   Say to user: "    │ ▸ Home   │  → Clean, minimal"
   Say to user: "    │ ▸ Profile│  → Best for <10 items"
   Say to user: "    │ SETTINGS │"
   Say to user: "    │ ▸ General│"
   Say to user: "    └──────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-01"
   Say to user: ""
   Say to user: "[2] Collapsible Sections"
   Say to user: "    ┌──────────┐"
   Say to user: "    │ ▼ MAIN   │  → Expandable groups"
   Say to user: "    │   Home   │  → Good for many items"
   Say to user: "    │   Profile│"
   Say to user: "    │ ▶ TOOLS  │"
   Say to user: "    └──────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-02"
   Say to user: ""
   Say to user: "[3] With Submenus"
   Say to user: "    ┌──────────┐"
   Say to user: "    │ ▼ Projects│  → Nested navigation"
   Say to user: "    │   └ Active│  → Deep hierarchies"
   Say to user: "    │   └ Done  │"
   Say to user: "    │ ▸ Settings│"
   Say to user: "    └──────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-03"
   Say to user: ""
   Say to user: "[4] Icon Collapsed"
   Say to user: "    Full          Collapsed"
   Say to user: "    ┌──────────┐  ┌──┐"
   Say to user: "    │ 🏠 Home  │  │🏠│  → Space-saving"
   Say to user: "    │ 👤 Profile│  │👤│  → Tooltips on hover"
   Say to user: "    └──────────┘  └──┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-07"
   Say to user: ""
   Say to user: "💡 View all 13 sidebar options: https://ui.shadcn.com/blocks/sidebar"
   Say to user: ""
   Ask: "Your choice: "

   Update TodoWrite: "Select sidebar style" → completed
   ```

6. **Select theme (with visual references):**
   ```
   Update TodoWrite: "Select theme" → in_progress

   Say to user: ""
   Say to user: "🎨 THEME SELECTION"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "[1] Professional (Slate/Neutral)"
   Say to user: "    → Clean, business-focused"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[2] Modern (Zinc/Violet)"
   Say to user: "    → Contemporary with violet accents"
   Say to user: "    → https://ui.shadcn.com/themes#new-york"
   Say to user: ""
   Say to user: "[3] Friendly (Blue/Green)"
   Say to user: "    → Approachable, calming"
   Say to user: "    → https://ui.shadcn.com/themes#blue"
   Say to user: ""
   Say to user: "[4] Dark Mode First"
   Say to user: "    → High contrast, developer-friendly"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[5] Custom Colors"
   Say to user: "    → Design your own palette"
   Say to user: "    → https://ui.shadcn.com/colors"
   Say to user: ""
   Say to user: "💡 Explore all themes: https://ui.shadcn.com/themes"
   Say to user: ""
   Ask: "Your choice: "

   If choice == 5:
     Say to user: "Visit https://ui.shadcn.com/colors to generate your palette"
     Ask: "Primary color (hex): "
     Ask: "Secondary color (hex): "

   # MCP Integration: Save theme decision to mem0
   mcp__mem0__add_memory(
     text: "Theme decision for {specification.platform_name}: Selected={selected_theme}, Colors={theme_colors if custom else 'default'}, Reasoning=User preference for {theme_style}"
   )

   Update TodoWrite: "Select theme" → completed
   ```

7. **Confirm design plan:**
   ```
   Update TodoWrite: "Confirm design plan" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "✅ DESIGN PLAN SUMMARY"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "📤 Personas: {len(personas)} auto-generated"
   Say to user: "📦 Module UIs: {len(modules)} configured"
   Say to user: "🎨 Theme: {selected_theme}"
   Say to user: ""
   Ask: "Proceed with design generation? [Y/n]: "

   If user confirms:
     Update TodoWrite: "Confirm design plan" → completed
   Else:
     Ask what to modify and loop back
   ```

8. **Generate comprehensive designs:**
   ```
   Update TodoWrite: "Generate comprehensive designs" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🤖 Generating STANDARD UX/UI designs..."
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   # Load mem0 patterns for design
   Say to user: "🔍 Loading design patterns from memory..."
   mcp__mem0__search_memory(
     query: "UI patterns design components {specification.platform_name}",
     user_id: "design_phase",
     limit: 10
   )

   # Create platform design directory structure
   platform_path = {project_root}/ccu_workspace/platform/03-design/
   If not exists(platform_path):
     Create directory: platform_path
     Say to user: "✅ Created platform design directory"

   # Create subdirectories
   subdirs = ["personas", "wireframes", "user-flows", "journey-maps", "components", "patterns", "theme"]
   For subdir in subdirs:
     subdir_path = {platform_path}/{subdir}/
     If not exists(subdir_path):
       Create directory: subdir_path

   # Generate technical approach document
   Say to user: "📝 Generating technical approach..."
   technical_content = Generate based on:
     - Specification requirements
     - Selected architecture patterns
     - Module interactions
     - API design
     - Database schema
     - Security considerations

   Write file: {platform_path}/technical-approach.md
   Content: technical_content

   # Generate platform-level UX design
   Say to user: "🎨 Generating platform UX design..."
   platform_ux = Generate:
     - Overall navigation structure
     - Global components (header, sidebar, footer)
     - Platform-wide patterns
     - Responsive breakpoints
     - Accessibility guidelines

   Write file: {platform_path}/ux-design.md
   Content: platform_ux

   # Generate design system
   Say to user: "🎨 Creating design system..."
   design_system = {
     "version": "1.0",
     "theme": selected_theme,
     "colors": theme_colors,
     "typography": typography_config,
     "spacing": spacing_scale,
     "components": shadcn_components,
     "breakpoints": responsive_breakpoints
   }

   Write file: {platform_path}/design-system.json
   Content: design_system

   # Generate information architecture
   Say to user: "🏗️ Defining information architecture..."
   info_arch = Generate based on modules:
     - Site map
     - Navigation hierarchy
     - Content organization
     - Module relationships

   Write file: {platform_path}/information-architecture.md
   Content: info_arch

   # Generate personas
   Say to user: "👥 Creating detailed personas..."
   For persona in personas:
     persona_doc = Generate detailed persona:
       - Demographics
       - Goals and motivations
       - Pain points
       - User scenarios
       - Technology proficiency

     Write file: {platform_path}/personas/{persona.name.lower().replace(' ', '-')}.md
     Content: persona_doc

   # Generate platform wireframes
   Say to user: "📐 Creating platform wireframes..."
   platform_wireframes = Generate ASCII/Markdown wireframes for:
     - Dashboard/Home
     - Main navigation layouts
     - Common page templates
     - Mobile responsive views

   Write file: {platform_path}/wireframes/platform-layout.md
   Content: platform_wireframes

   # Generate user flows
   Say to user: "🔄 Mapping user flows..."
   main_flows = Generate flows for:
     - Authentication flow
     - Main user journey
     - Error handling flows
     - Success paths

   Write file: {platform_path}/user-flows/main-flows.md
   Content: main_flows

   # Generate component specifications
   Say to user: "📦 Defining component specifications..."
   component_specs = Generate based on shadcn/ui:
     - Component inventory
     - Usage guidelines
     - Customization notes
     - Composition patterns

   Write file: {platform_path}/component-specs.md
   Content: component_specs

   # Generate component library documentation for components/ folder
   Say to user: "📚 Building component library..."
   component_library = Generate comprehensive component documentation:
     - List of all shadcn/ui components used across platform
     - Component configuration for each (props, variants, states)
     - Component dependencies and relationships
     - Usage examples for each component
     - Customization guidelines
     - Integration patterns with modules

   Write file: {platform_path}/components/component-library.md
   Content: component_library

   # Generate component index JSON
   component_index = {
     "total_components": Count of unique components,
     "shadcn_components": List of shadcn/ui components used,
     "custom_components": List of custom components needed,
     "component_map": {
       "buttons": ["Button", "IconButton", "LoadingButton"],
       "forms": ["Input", "Select", "Checkbox", "Radio", "Switch"],
       "data_display": ["Table", "DataTable", "Card", "Chart"],
       "navigation": ["Sidebar", "Tabs", "Breadcrumb", "NavigationMenu"],
       "feedback": ["Alert", "Toast", "Dialog", "Spinner", "Progress"]
     },
     "usage_by_module": Map of which modules use which components
   }

   Write file: {platform_path}/components/component-index.json
   Content: component_index

   # Generate UI patterns documentation for patterns/ folder
   Say to user: "🎯 Documenting UI patterns..."
   ui_patterns = Generate comprehensive pattern guide:
     - Form patterns (single-step, multi-step, validation, dynamic forms)
     - Navigation patterns (sidebar, tabs, breadcrumb, stepped navigation)
     - Data display patterns (tables, cards, lists, grids, charts)
     - Interaction patterns (modals, tooltips, dropdowns, command palettes)
     - Loading patterns (skeletons, spinners, progress indicators)
     - Error patterns (inline validation, toast notifications, error pages)

   Write file: {platform_path}/patterns/ui-patterns.md
   Content: ui_patterns

   # Generate pattern library JSON
   pattern_library = {
     "forms": {
       "single_step": ["login", "contact", "feedback", "settings"],
       "multi_step": ["registration", "checkout", "onboarding", "wizard"],
       "validation": ["real-time", "on-submit", "async", "field-level"]
     },
     "navigation": {
       "primary": sidebar_choice or "sidebar",
       "secondary": ["tabs", "breadcrumb", "steps"],
       "mobile": ["hamburger", "bottom-nav", "drawer"]
     },
     "data_display": {
       "tables": ["data-table", "simple-table", "sortable-table"],
       "cards": ["stat-card", "content-card", "product-card", "profile-card"],
       "lists": ["simple-list", "complex-list", "timeline"],
       "grids": ["card-grid", "masonry", "responsive-grid"]
     },
     "interactions": {
       "overlays": ["modal", "drawer", "popover", "tooltip"],
       "notifications": ["toast", "alert", "banner", "snackbar"],
       "feedback": ["loading", "success", "error", "warning"]
     }
   }

   Write file: {platform_path}/patterns/pattern-library.json
   Content: pattern_library

   # Generate complete theme configuration (beyond just colors) for theme/ folder
   Say to user: "🎨 Creating comprehensive theme configuration..."
   # Note: theme/colors.json is already created earlier, now add more theme files
   theme_config = {
     "colors": theme_colors,
     "typography": {
       "fontFamily": {
         "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
         "mono": ["Fira Code", "Monaco", "Consolas", "monospace"]
       },
       "fontSize": {
         "xs": "0.75rem",
         "sm": "0.875rem",
         "base": "1rem",
         "lg": "1.125rem",
         "xl": "1.25rem",
         "2xl": "1.5rem",
         "3xl": "1.875rem",
         "4xl": "2.25rem",
         "5xl": "3rem"
       },
       "fontWeight": {
         "light": 300,
         "normal": 400,
         "medium": 500,
         "semibold": 600,
         "bold": 700
       },
       "lineHeight": {
         "tight": 1.25,
         "normal": 1.5,
         "relaxed": 1.75
       }
     },
     "spacing": {
       "0": "0",
       "1": "0.25rem",
       "2": "0.5rem",
       "3": "0.75rem",
       "4": "1rem",
       "5": "1.25rem",
       "6": "1.5rem",
       "8": "2rem",
       "10": "2.5rem",
       "12": "3rem",
       "16": "4rem",
       "20": "5rem"
     },
     "borderRadius": {
       "none": "0",
       "sm": "0.125rem",
       "default": "0.25rem",
       "md": "0.375rem",
       "lg": "0.5rem",
       "xl": "0.75rem",
       "2xl": "1rem",
       "full": "9999px"
     },
     "shadows": {
       "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
       "default": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
       "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
       "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
       "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)",
       "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
     },
     "animations": {
       "duration": {
         "fast": "150ms",
         "normal": "300ms",
         "slow": "500ms",
         "slower": "700ms"
       },
       "easing": {
         "linear": "linear",
         "in": "cubic-bezier(0.4, 0, 1, 1)",
         "out": "cubic-bezier(0, 0, 0.2, 1)",
         "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
       }
     }
   }

   Write file: {platform_path}/theme/theme-config.json
   Content: theme_config

   # Generate CSS variables file
   css_variables = Generate CSS custom properties:
     :root {
       /* Colors */
       --primary: theme_colors.primary;
       --secondary: theme_colors.secondary;
       --background: theme_colors.background;
       --foreground: theme_colors.foreground;
       --muted: theme_colors.muted;
       --accent: theme_colors.accent;

       /* Typography */
       --font-sans: Inter, system-ui, -apple-system, sans-serif;
       --font-mono: Fira Code, Monaco, Consolas, monospace;

       /* Spacing */
       --spacing-unit: 0.25rem;

       /* Animations */
       --animation-fast: 150ms;
       --animation-normal: 300ms;
       --animation-slow: 500ms;

       /* Border Radius */
       --radius-sm: 0.125rem;
       --radius-md: 0.375rem;
       --radius-lg: 0.5rem;
     }

   Write file: {platform_path}/theme/variables.css
   Content: css_variables

   # Generate detailed user flows for each persona in user-flows/ folder
   Say to user: "👤 Creating persona-specific user flows..."
   For persona in personas:
     persona_flow = Generate detailed flow for {persona.name}:
       - Entry points (how they discover/access the platform)
       - Primary tasks (what they need to accomplish)
       - Decision points (where they make choices)
       - Pain points (where they might struggle)
       - Success criteria (what success looks like)
       - Exit points (how they complete/leave)
       - Alternative paths (different ways to accomplish tasks)

     persona_filename = persona.name.lower().replace(' ', '-') + "-flow.md"
     Write file: {platform_path}/user-flows/{persona_filename}
     Content: persona_flow

   # Generate flow diagrams
   Say to user: "📊 Creating flow diagrams..."
   flow_diagrams = Generate visual flow representations:
     - Mermaid diagrams for complex flows
     - ASCII diagrams for simple flows
     - Decision trees for branching logic
     - State machines for interactive components
     - User journey maps

   Write file: {platform_path}/user-flows/flow-diagrams.md
   Content: flow_diagrams

   # Generate accessibility documentation
   Say to user: "♿ Creating accessibility guidelines..."
   accessibility = Generate:
     - WCAG 2.1 compliance checklist
     - Keyboard navigation specs
     - Screen reader considerations
     - Color contrast requirements

   Write file: {platform_path}/accessibility.md
   Content: accessibility

   Say to user: "✅ Platform design files generated"
   Say to user: ""

   Update TodoWrite: "Generate comprehensive designs" → completed
   ```

9. **Generate module-specific designs:**
   ```
   Update TodoWrite: "Generate module designs" → in_progress

   Say to user: "📦 GENERATING MODULE-SPECIFIC DESIGNS"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   # Generate design files for EACH module
   module_design_files = []
   For module in specification.modules:
     module_path = {project_root}/ccu_workspace/modules/{module.name}/03-design/

     # Create module design directory
     If not exists(module_path):
       Create directory: module_path
       Say to user: "📁 Created design folder for module: {module.name}"

     # Create subdirectories for module
     For subdir in ["wireframes", "components", "user-flows"]:
       subdir_path = {module_path}/{subdir}/
       If not exists(subdir_path):
         Create directory: subdir_path

     Say to user: "🎨 Generating UI/UX for module: {module.name}"

     # Generate module-specific UX design
     module_ux_content = Generate based on:
       - Module functionality from specification
       - Selected UI preference for this module
       - Module-specific user flows
       - Module components and layouts
       - Integration points with other modules

     Write file: {module_path}/ux-design.md
     Content: module_ux_content

     # Generate module wireframes
     module_wireframes = Generate ASCII/Markdown wireframes for:
       - Module main screen
       - Module-specific forms
       - Data displays for this module
       - Module navigation

     Write file: {module_path}/wireframes/module-screens.md
     Content: module_wireframes

     # Generate module component list
     module_components = Generate based on module UI preference:
       - shadcn/ui components needed
       - Custom components required
       - Component compositions
       - State management needs

     Write file: {module_path}/components.md
     Content: module_components

     # Generate module user flows
     module_flows = Generate:
       - Entry points to module
       - Main module workflows
       - Module-specific error handling
       - Success/completion flows

     Write file: {module_path}/user-flows.md
     Content: module_flows

     # Generate module design specs
     module_design_spec = {
       "module": module.name,
       "ui_preference": module_ui_preferences[module.name],
       "primary_components": Extract main components,
       "color_overrides": Module-specific colors if any,
       "layout_pattern": Module layout type,
       "responsive_behavior": Mobile/tablet/desktop specs,
       "accessibility_notes": Module-specific a11y requirements
     }

     Write file: {module_path}/design-specs.json
     Content: module_design_spec

     # MCP Integration: Index module-specific UI code with claude-context
     Say to user: "🔍 Indexing module UI components for {module.name}..."
     mcp__claude-context__index_codebase(
       path: {module_path},
       customExtensions: [".md", ".json"],
       splitter: "ast"
     )

     # Track generated files for this module
     module_design_files.append({
       "module": module.name,
       "path": module_path,
       "files": [
         "ux-design.md",
         "wireframes/module-screens.md",
         "components.md",
         "user-flows.md",
         "design-specs.json"
       ]
     })

     Say to user: "✅ Completed design for module: {module.name}"
     Say to user: ""

   Update TodoWrite: "Generate module designs" → completed

   ```

10. **Generate design.json and index files:**
   ```
   Update TodoWrite: "Generate design.json" → in_progress

   # Component usage tracking and validation
   Say to user: "📊 Analyzing component usage across modules..."
   component_matrix = {
     "platform_components": [],
     "module_components": {},
     "shared_components": [],
     "total_unique": 0
   }

   # Analyze component usage across all modules
   For module in specification.modules:
     module_components_list = Extract components from module design files
     component_matrix["module_components"][module.name] = module_components_list

     # Identify shared components
     For component in module_components_list:
       If component used in multiple modules:
         Add to component_matrix["shared_components"]
       Else:
         Add to module-specific list

   component_matrix["total_unique"] = Count unique components

   # Write component usage matrix
   Write file: {platform_path}/components/usage-matrix.json
   Content: component_matrix

   # Save component architecture to mem0
   mcp__mem0__add_memory(
     text: "Component architecture for {specification.platform_name}: Total={component_matrix['total_unique']} components, Shared={len(component_matrix['shared_components'])}, Module-specific={sum([len(v) for v in component_matrix['module_components'].values()])}"
   )

   # Validate all directories have content
   Say to user: "✅ Validating generated content..."
   empty_dirs = []
   For subdir in ["components", "patterns", "theme", "user-flows", "personas", "wireframes"]:
     dir_path = {platform_path}/{subdir}/
     file_count = Count files in dir_path
     If file_count == 0:
       empty_dirs.append(subdir)
       Say to user: "⚠️ Warning: {subdir}/ is empty - generating default content..."
       # Generate minimal default content
       default_content = Generate placeholder content for {subdir}
       Write file: {dir_path}/README.md
       Content: default_content

   If len(empty_dirs) > 0:
     Say to user: "📝 Generated default content for {len(empty_dirs)} directories"

   Say to user: "📄 Creating master design.json with all references..."

   # Collect all generated platform files
   platform_path = {project_root}/ccu_workspace/platform/03-design/
   platform_files = [
     "technical-approach.md",
     "ux-design.md",
     "design-system.json",
     "information-architecture.md",
     "component-specs.md",
     "accessibility.md"
   ]

   # Add persona files
   For persona in personas:
     persona_file = "personas/{persona.name.lower().replace(' ', '-')}.md"
     platform_files.append(persona_file)

   # Add other platform files
   platform_files.extend([
     "wireframes/platform-layout.md",
     "user-flows/main-flows.md"
   ])

   # Create comprehensive design.json as SINGLE SOURCE OF TRUTH
   design_json = {
     "version": "1.0",
     "generated_at": current_timestamp,
     "track": "standard",
     "target": ARGUMENTS.target,
     "specification_reference": specification_path,
     "theme": {
       "selected": selected_theme,
       "colors": theme_colors if selected_theme == "custom" else null,
       "shadcn_theme": selected_theme
     },
     "personas": {
       "count": len(personas),
       "list": personas,
       "primary": personas[0] if personas else null
     },
     "modules": {
       "count": len(modules),
       "configurations": module_ui_preferences
     },
     "platform_design": {
       "path": "platform/03-design/",
       "files": platform_files,
       "file_count": len(platform_files)
     },
     "module_designs": module_design_files,
     "total_files_generated": len(platform_files) + sum([len(m["files"]) for m in module_design_files]),
     "design_insights": {
       "wireframes_count": len(modules) + 4,  # Module screens + platform screens
       "user_flows_count": len(modules) + 1,  # Module flows + main flow
       "personas_count": len(personas),
       "components_selected": len(shadcn_components),
       "wcag_level": "AA",
       "responsive_breakpoints": ["640px", "768px", "1024px", "1280px"]
     },
     "next_phase": "security",
     "next_command": "/ccu:security --target={ARGUMENTS.target} --track=standard"
   }

   Write file: {platform_path}/design.json
   Content: design_json

   Say to user: "✅ Created design.json - Master reference with all {design_json['total_files_generated']} generated files"

   # Index with claude-context MCP
   Say to user: "🔍 Indexing design files for search..."
   mcp__claude-context__index_codebase(
     path: {project_root}/ccu_workspace/,
     customExtensions: [".md", ".json"],
     splitter: "langchain"
   )

   # Save patterns to mem0
   Say to user: "💾 Saving successful patterns to memory..."
   mcp__mem0__add_memory(
     messages: "Design patterns for {specification.platform_name}:\n" +
              "Theme: {selected_theme}\n" +
              "Modules: {', '.join([m.name for m in modules])}\n" +
              "UI Choices: {json.dumps(module_ui_preferences)}",
     user_id: "design_phase",
     metadata: {
       "project": specification.platform_name,
       "track": "standard",
       "phase": "design"
     }
   )

   Update TodoWrite: "Generate design.json" → completed

   ```

11. **Show completion summary:**
   ```
   Update TodoWrite: "Create completion summary" → in_progress

   # Show completion summary
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "✅ STANDARD DESIGN COMPLETE"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "📊 **Summary:**"
   Say to user: "     • Personas: {len(personas)} comprehensive"
   Say to user: "     • Modules: {len(modules)} fully configured"
   Say to user: "     • Theme: {selected_theme}"
   Say to user: "     • Total Files: {design_json['total_files_generated']}"
   Say to user: ""
   Say to user: "📁 **Output Locations:**"
   Say to user: "     Platform: {project_root}/ccu_workspace/platform/03-design/"
   For module in module_design_files:
     Say to user: "     {module['module']}: {module['path']}"
   Say to user: ""
   Say to user: "📄 **Master Reference:**"
   Say to user: "     design.json - Contains all file references and configurations"
   Say to user: ""
   Say to user: "🚀 **Next Steps:**"
   Say to user: "     1. Review design.json for complete design system"
   Say to user: "     2. Check module-specific designs in their folders"
   Say to user: "     3. Run: /ccu:security --target={ARGUMENTS.target} --track=standard"
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   Update TodoWrite: "Create completion summary" → completed
   Update TodoWrite: "Display next steps" → completed
   ```

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load specification"
   - "Auto-generate personas from modules"
   - "Collect comprehensive module UI preferences"
   - "Configure enterprise theme & branding"
   - "Design system architecture"
   - "Analyze with ux-ui-designer"
   - "Generate enterprise design system"
   ```

2. **Load specification & auto-generate personas:**
   ```
   Update TodoWrite: "Load specification" → in_progress

   # Check if specification exists
   specification_path = {project_root}/ccu_workspace/platform/02-specification/specification.json
   If not exists(specification_path):
     Say to user: ""
     Say to user: "❌ ERROR: specification.json not found"
     Say to user: "Please run the specification phase first:"
     Say to user: "/ccu:specify --target={ARGUMENTS.target} --track=enterprise"
     Say to user: ""
     Exit

   # Load specification
   Load specification.json from specification_path

   Update TodoWrite: "Load specification" → completed
   Update TodoWrite: "Auto-generate personas from modules" → in_progress

   Say to user: "🤖 Auto-generating enterprise personas based on {module_count} modules..."

   # Auto-generate comprehensive personas from modules
   For module in specification.modules:
     IF "auth" in module.name.lower():
       personas.add("System Administrator", "Security Officer", "End User")
     IF "analytics" in module.name.lower():
       personas.add("Data Analyst", "Business Executive", "Report Consumer")
     IF "payment" in module.name.lower():
       personas.add("Finance Manager", "Customer", "Auditor")
     IF "api" in module.name.lower():
       personas.add("Developer", "API Consumer", "Integration Partner")
     IF "admin" in module.name.lower():
       personas.add("Super Admin", "Department Admin", "Support Staff")
     IF "collaboration" in module.name.lower():
       personas.add("Team Lead", "Team Member", "External Collaborator")

   Say to user: "✅ Generated {persona_count} enterprise personas"

   Update TodoWrite: "Auto-generate personas from modules" → completed
   ```

3. **Module UI questions (comprehensive for enterprise):**
   ```
   Update TodoWrite: "Collect comprehensive module UI preferences" → in_progress

   Say to user: "🎨 ENTERPRISE MODULE UI CONFIGURATION"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Analyze and categorize all modules
   categorized = group_modules_by_category(specification.modules)

   Say to user: "📊 Enterprise Module Architecture:"
   Say to user: ""

   # Show category breakdown
   For category, data in categorized.items():
     module_list = ', '.join([m['name'] for m in data['modules']])
     Say to user: "🏢 {category.replace('_', ' ').upper()} CATEGORY"
     Say to user: "   Modules: {module_list}"
     Say to user: "   Suggested Stack: {', '.join(data['components'][:5])}"
     Say to user: ""

   # ENTERPRISE: 2-3 questions per module category (12-18 total)
   total_questions = 0

   For category, data in categorized.items():
     if total_questions >= 18:
       break

     Say to user: "━━━ {category.replace('_', ' ').upper()} MODULE GROUP ━━━"
     Say to user: "Modules in this group: {', '.join([m['name'] for m in data['modules']])}"
     Say to user: ""

     # Question 1: Architecture pattern for this category
     total_questions += 1
     Say to user: ""
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "🔢 QUESTION {total_questions}/18"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""
     Say to user: "**Architecture pattern for {category} modules:**"
     Say to user: ""

     IF category == 'analytics':
       Say to user: "[1] Real-time streaming dashboard"
       Say to user: "    ┌────────────┐"
       Say to user: "    │ WebSocket  │ → Live updates"
       Say to user: "    │ ↓ Stream ↓ │ → Sub-second latency"
       Say to user: "    │ Dashboard  │ → Real-time charts"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[2] Batch processing with caching"
       Say to user: "    ┌────────────┐"
       Say to user: "    │   Batch    │ → Scheduled processing"
       Say to user: "    │  [Cache]   │ → Fast retrieval"
       Say to user: "    │   Report   │ → Optimized performance"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[3] Hybrid real-time + historical"
       Say to user: "    ┌──────┬─────┐"
       Say to user: "    │ Live │ DB  │ → Best of both"
       Say to user: "    │  ↕   │  ↕  │ → Flexible queries"
       Say to user: "    │ View │ API │ → Complete insights"
       Say to user: "    └──────┴─────┘"
       Say to user: ""
       Say to user: "[4] Edge computing analytics"
       Say to user: "    ┌────────────┐"
       Say to user: "    │   Edge     │ → Local processing"
       Say to user: "    │  Devices   │ → Low latency"
       Say to user: "    │ ↓ Sync ↓   │ → Distributed AI"
       Say to user: "    └────────────┘"

     ELIF category == 'data_management':
       Say to user: "[1] Event-sourced CQRS"
       Say to user: "    ┌──────┬─────┐"
       Say to user: "    │ Cmd  │Query│ → Separated concerns"
       Say to user: "    │  ↓   │  ↑  │ → Event history"
       Say to user: "    │Events│ View│ → Full audit trail"
       Say to user: "    └──────┴─────┘"
       Say to user: ""
       Say to user: "[2] Traditional CRUD with audit"
       Say to user: "    ┌────────────┐"
       Say to user: "    │   CRUD     │ → Simple operations"
       Say to user: "    │  + Audit   │ → Change tracking"
       Say to user: "    │   Tables   │ → Familiar patterns"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[3] GraphQL with subscriptions"
       Say to user: "    ┌────────────┐"
       Say to user: "    │  GraphQL   │ → Flexible queries"
       Say to user: "    │ Subscribe  │ → Real-time updates"
       Say to user: "    │  Schema    │ → Type safety"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[4] Microservices per entity"
       Say to user: "    ┌───┬───┬───┐"
       Say to user: "    │ A │ B │ C │ → Service per domain"
       Say to user: "    │ P │ P │ P │ → Independent scaling"
       Say to user: "    │ I │ I │ I │ → Fault isolation"
       Say to user: "    └───┴───┴───┘"

     ELIF category == 'authentication':
       Say to user: "[1] SSO with SAML/OAuth"
       Say to user: "    ┌────────────┐"
       Say to user: "    │    SSO     │ → Single sign-on"
       Say to user: "    │ SAML/OAuth │ → Enterprise ready"
       Say to user: "    │  Provider  │ → Multi-protocol"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[2] Multi-factor authentication"
       Say to user: "    ┌────────────┐"
       Say to user: "    │  Password  │"
       Say to user: "    │     +      │ → Layered security"
       Say to user: "    │  2FA/MFA   │ → High protection"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[3] Passwordless/biometric"
       Say to user: "    ┌────────────┐"
       Say to user: "    │    🔐      │ → No passwords"
       Say to user: "    │ Biometric  │ → Modern UX"
       Say to user: "    │   Magic    │ → Secure links"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[4] Zero-trust architecture"
       Say to user: "    ┌────────────┐"
       Say to user: "    │ Verify All │ → Never trust"
       Say to user: "    │  Context   │ → Always verify"
       Say to user: "    │  Policies  │ → Granular control"
       Say to user: "    └────────────┘"

     ELSE:
       Say to user: "[1] Monolithic with modules"
       Say to user: "    ┌────────────┐"
       Say to user: "    │ ┌──┬──┬──┐ │ → Single deployment"
       Say to user: "    │ │M1│M2│M3│ │ → Shared resources"
       Say to user: "    │ └──┴──┴──┘ │ → Simple ops"
       Say to user: "    └────────────┘"
       Say to user: ""
       Say to user: "[2] Microservices"
       Say to user: "    ┌──┐ ┌──┐ ┌──┐"
       Say to user: "    │S1│ │S2│ │S3│ → Independent services"
       Say to user: "    │  │←→│  │←→│  │ → API communication"
       Say to user: "    └──┘ └──┘ └──┘"
       Say to user: ""
       Say to user: "[3] Serverless functions"
       Say to user: "    ┌ƒ─┐ ┌ƒ─┐ ┌ƒ─┐"
       Say to user: "    │λ1│ │λ2│ │λ3│ → Event-driven"
       Say to user: "    └──┘ └──┘ └──┘ → Auto-scaling"
       Say to user: ""
       Say to user: "[4] Hybrid architecture"
       Say to user: "    ┌──────┬────┐"
       Say to user: "    │ Core │ƒλ  │ → Mixed approach"
       Say to user: "    │  API │Func│ → Best tool per job"
       Say to user: "    └──────┴────┘"

     # WITH VALIDATION
     architecture_choice = get_validated_input(
       "Select architecture pattern [1-4]: ",
       (input) => validate_numeric_choice(input, 1, 4)
     )
     If architecture_choice == null:
       Say to user: "Using default: Option 1"
       architecture_choice = 1

     # Question 2: Performance requirements
     total_questions += 1
     Say to user: ""
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: "🔢 QUESTION {total_questions}/18"
     Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
     Say to user: ""
     Say to user: "**Performance requirements for {category}:**"
     Say to user: "☑ Virtual scrolling (10k+ items)"
     Say to user: "☑ Lazy loading"
     Say to user: "☐ Offline mode"
     Say to user: "☑ Background sync"
     Say to user: "☐ PWA capabilities"
     Say to user: "☑ CDN optimization"
     Say to user: "☐ Edge computing"
     Say to user: "☑ WebSocket real-time"

     # Question 3: Enterprise features (if not at limit)
     if total_questions < 18:
       total_questions += 1
       Say to user: ""
       Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
       Say to user: "🔢 QUESTION {total_questions}/18"
       Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
       Say to user: ""
       Say to user: "**Enterprise features for {category}:**"
       Say to user: "☑ Multi-tenancy"
       Say to user: "☑ Role-based access (RBAC)"
       Say to user: "☐ Audit logging"
       Say to user: "☑ Data encryption at rest"
       Say to user: "☐ Compliance reporting (SOC2/HIPAA)"
       Say to user: "☑ API versioning"
       Say to user: "☐ White-labeling"
       Say to user: "☑ Internationalization (i18n)"

   # Summary of enterprise configuration
   Say to user: ""
   Say to user: "━━━ ENTERPRISE CONFIGURATION SUMMARY ━━━"
   Say to user: ""
   Say to user: "Total Questions Asked: {total_questions}"
   Say to user: "Module Categories: {len(categorized)}"
   Say to user: "Components Selected: Auto-applied based on categories"
   Say to user: "Accessibility: WCAG 2.1 AAA compliance"
   Say to user: "Performance: Enterprise-grade optimization"

   Update TodoWrite: "Configure UI per module comprehensively" → completed
   ```

4. **Enterprise grid layout selection:**
   ```
   Update TodoWrite: "Select enterprise grid layout" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🔢 ENTERPRISE GRID LAYOUT SELECTION"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "Select your enterprise grid layout pattern:"
   Say to user: ""
   Say to user: "[1] Auto-fit Grid (Enterprise Dashboard)"
   Say to user: "    ┌─────┬─────┬─────┬─────┐"
   Say to user: "    │ KPI │ KPI │ KPI │ KPI │  → Auto-adjusts columns"
   Say to user: "    ├─────┼─────┼─────┴─────┤  → Perfect for metrics"
   Say to user: "    │Chart│Table│  Insights  │  → Responsive scaling"
   Say to user: "    └─────┴─────┴────────────┘"
   Say to user: "    CSS: grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
   Say to user: ""
   Say to user: "[2] Enterprise Fixed Responsive"
   Say to user: "    Desktop (1920px+)     Tablet         Mobile"
   Say to user: "    ┌──┬──┬──┬──┬──┐    ┌───┬───┬───┐   ┌─────┐"
   Say to user: "    │  │  │  │  │  │    │   │   │   │   │     │"
   Say to user: "    ├──┼──┼──┼──┼──┤    ├───┼───┼───┤   ├─────┤"
   Say to user: "    │  │  │  │  │  │    │   │   │   │   │     │"
   Say to user: "    └──┴──┴──┴──┴──┘    └───┴───┴───┘   └─────┘"
   Say to user: "    Tailwind: grid-cols-1 md:grid-cols-3 xl:grid-cols-5"
   Say to user: ""
   Say to user: "[3] Executive Dashboard (Asymmetric)"
   Say to user: "    ┌───────────────┬─────┬─────┐"
   Say to user: "    │               │ KPI │ KPI │  → Hero metrics"
   Say to user: "    │ Main Insights ├─────┼─────┤  → Focus areas"
   Say to user: "    │               │ KPI │ KPI │  → Supporting data"
   Say to user: "    ├───────┬───────┼─────┴─────┤"
   Say to user: "    │ Chart │ Table │  Actions   │"
   Say to user: "    └───────┴───────┴────────────┘"
   Say to user: "    CSS: grid-template-areas + span"
   Say to user: ""
   Say to user: "[4] Data Center View (Dense Grid)"
   Say to user: "    ┌──┬──┬──┬──┬──┬──┬──┬──┐"
   Say to user: "    │▓▓│░░│▓▓│░░│▓▓│░░│▓▓│░░│  → High density"
   Say to user: "    ├──┼──┼──┼──┼──┼──┼──┼──┤  → Maximum info"
   Say to user: "    │░░│▓▓│░░│▓▓│░░│▓▓│░░│▓▓│  → Status monitoring"
   Say to user: "    ├──┼──┼──┼──┼──┼──┼──┼──┤"
   Say to user: "    │▓▓│░░│▓▓│░░│▓▓│░░│▓▓│░░│"
   Say to user: "    └──┴──┴──┴──┴──┴──┴──┴──┘"
   Say to user: "    CSS: display: grid; gap: 1px; grid-auto-flow: dense"
   Say to user: ""
   Say to user: "[5] Command Center (Bento Grid)"
   Say to user: "    ┌───────────────┬───────┬───────┐"
   Say to user: "    │  Live Stream  │ Alert │Status │  → Real-time monitoring"
   Say to user: "    │               ├───────┴───────┤  → Critical metrics"
   Say to user: "    ├───────┬───────┤   Analytics   │  → Deep insights"
   Say to user: "    │ Logs  │ Queue │               │  → Operational view"
   Say to user: "    └───────┴───────┴───────────────┘"
   Say to user: "    → Enterprise operations focus"
   Say to user: ""
   Say to user: "💡 Reference: https://ui.shadcn.com/blocks/dashboard"
   Say to user: ""
   # WITH VALIDATION
   grid_choice = get_validated_input(
     "Select grid layout [1-5]: ",
     (input) => validate_numeric_choice(input, 1, 5)
   )
   If grid_choice == null:
     Say to user: "Using default: Option 1 (Auto-fit Grid)"
     grid_choice = 1

   Update TodoWrite: "Select enterprise grid layout" → completed
   ```

5. **Enterprise sidebar configuration:**
   ```
   Update TodoWrite: "Configure enterprise sidebar" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🔢 ENTERPRISE SIDEBAR CONFIGURATION"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "Select your enterprise navigation style:"
   Say to user: ""
   Say to user: "[1] Multi-level Enterprise Navigation"
   Say to user: "    ┌────────────┐"
   Say to user: "    │ ▼ PLATFORM │"
   Say to user: "    │   Dashboard│  → Department access"
   Say to user: "    │   Analytics│  → Role-based menus"
   Say to user: "    │ ▼ MODULES  │  → Granular permissions"
   Say to user: "    │   └ Sales  │"
   Say to user: "    │   └ Finance│"
   Say to user: "    │ ▶ ADMIN    │"
   Say to user: "    │ ▶ SETTINGS │"
   Say to user: "    └────────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-09"
   Say to user: ""
   Say to user: "[2] Department-based Sections"
   Say to user: "    ┌────────────┐"
   Say to user: "    │ OPERATIONS │"
   Say to user: "    │ ▸ Monitor  │"
   Say to user: "    │ ▸ Deploy   │  → Clear hierarchy"
   Say to user: "    │            │  → Department focus"
   Say to user: "    │ ANALYTICS  │  → Team separation"
   Say to user: "    │ ▸ Reports  │"
   Say to user: "    │ ▸ Insights │"
   Say to user: "    │            │"
   Say to user: "    │ GOVERNANCE │"
   Say to user: "    │ ▸ Compliance│"
   Say to user: "    │ ▸ Audit    │"
   Say to user: "    └────────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-02"
   Say to user: ""
   Say to user: "[3] Icon + Text Collapsible (Power Users)"
   Say to user: "    Expanded          Collapsed"
   Say to user: "    ┌──────────────┐  ┌──┐"
   Say to user: "    │ 📊 Analytics  │  │📊│  → Space-saving"
   Say to user: "    │ 👥 Teams      │  │👥│  → Quick access"
   Say to user: "    │ 💼 Business   │  │💼│  → Power user mode"
   Say to user: "    │ ⚙️ System     │  │⚙️│  → Tooltips on hover"
   Say to user: "    │ 🔒 Security   │  │🔒│"
   Say to user: "    └──────────────┘  └──┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-07"
   Say to user: ""
   Say to user: "[4] Command Center Style"
   Say to user: "    ┌────────────┐"
   Say to user: "    │ [Command]  │  → Quick search"
   Say to user: "    ├────────────┤"
   Say to user: "    │ ▸ Mission  │  → Priority access"
   Say to user: "    │ ▸ Control  │  → Critical functions"
   Say to user: "    │ ▸ Intel    │  → Real-time data"
   Say to user: "    │ ▸ Ops      │  → Operations"
   Say to user: "    └────────────┘"
   Say to user: "    → Command palette integration"
   Say to user: ""
   Say to user: "[5] Executive Floating Panel"
   Say to user: "    ┌─ Executive Menu ─┐"
   Say to user: "    │                  │"
   Say to user: "    │ Strategic View   │  → C-level access"
   Say to user: "    │ Board Reports    │  → High-level only"
   Say to user: "    │ KPI Dashboard    │  → Minimal options"
   Say to user: "    │ Settings        │  → Clean interface"
   Say to user: "    └──────────────────┘"
   Say to user: "    → https://ui.shadcn.com/blocks/sidebar#sidebar-10"
   Say to user: ""
   Say to user: "💡 All styles support role-based visibility and permissions"
   Say to user: ""
   # WITH VALIDATION
   sidebar_choice = get_validated_input(
     "Select sidebar style [1-5]: ",
     (input) => validate_numeric_choice(input, 1, 5)
   )
   If sidebar_choice == null:
     Say to user: "Using default: Option 1 (Simple grouped)"
     sidebar_choice = 1

   Update TodoWrite: "Configure enterprise sidebar" → completed
   ```

6. **Enterprise theme & branding configuration:**
   ```
   Update TodoWrite: "Configure enterprise theme & branding" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🎨 ENTERPRISE THEME & BRANDING"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "Select enterprise branding approach:"
   Say to user: ""
   Say to user: "[1] Corporate Professional (Multi-brand)"
   Say to user: "    Primary: Navy #1e3a8a"
   Say to user: "    Secondary: Silver #94a3b8"
   Say to user: "    → Multi-tenant support"
   Say to user: "    → White-label ready"
   Say to user: "    → https://ui.shadcn.com/themes#slate"
   Say to user: ""
   Say to user: "[2] Enterprise Dark Mode First"
   Say to user: "    Background: #0a0a0a"
   Say to user: "    Accent: Electric Blue #3b82f6"
   Say to user: "    → 24/7 operations centers"
   Say to user: "    → Reduces eye strain"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[3] Financial/Banking Theme"
   Say to user: "    Primary: Forest Green #14532d"
   Say to user: "    Trust: Deep Blue #1e3a8a"
   Say to user: "    → Trust & stability"
   Say to user: "    → Regulatory compliant"
   Say to user: "    → https://ui.shadcn.com/themes#green"
   Say to user: ""
   Say to user: "[4] Healthcare/Medical Theme"
   Say to user: "    Primary: Medical Teal #0f766e"
   Say to user: "    Alert: Safety Orange #ea580c"
   Say to user: "    → WCAG AAA compliant"
   Say to user: "    → High contrast alerts"
   Say to user: "    → https://ui.shadcn.com/themes"
   Say to user: ""
   Say to user: "[5] Custom Enterprise Branding"
   Say to user: "    → Upload brand guidelines"
   Say to user: "    → Import design tokens"
   Say to user: "    → Multi-brand system"
   Say to user: "    → https://ui.shadcn.com/colors"
   Say to user: ""
   Say to user: "💡 Enterprise themes include:"
   Say to user: "   • Design token system"
   Say to user: "   • Multi-brand support"
   Say to user: "   • WCAG AAA compliance"
   Say to user: "   • Print stylesheets"
   Say to user: "   • Email templates"
   Say to user: ""
   # WITH VALIDATION
   theme_choice = get_validated_input(
     "Select theme approach [1-5]: ",
     (input) => validate_numeric_choice(input, 1, 5)
   )
   If theme_choice == null:
     Say to user: "Using default: Option 1 (Corporate Professional)"
     theme_choice = 1

   IF choice == 5:
     Say to user: "Enter your brand configuration:"
     Ask: "Primary brand color (hex): "
     Ask: "Secondary brand color (hex): "
     Ask: "Number of sub-brands to support: "
     Ask: "Dark mode requirement [required/optional/disabled]: "

   Update TodoWrite: "Configure enterprise theme & branding" → completed
   ```

7. **Generate enterprise design analysis:**
   ```
   Update TodoWrite: "Analyze with ux-ui-designer" → in_progress

   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "🤖 Generating ENTERPRISE design system..."
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""

   # Load patterns from mem0 for enterprise
   Say to user: "🔍 Loading enterprise patterns from memory..."
   enterprise_patterns = mcp__mem0__search_memory(
     query: "enterprise design patterns architecture scalability",
     user_id: "design_phase",
     limit: 15
   )

   # Display insights
   Say to user: ""
   Say to user: "╔════════════════════════════════════════════════════════════════════╗"
   Say to user: "║  🏢 ENTERPRISE DESIGN SYSTEM GENERATION                          ║"
   Say to user: "╚════════════════════════════════════════════════════════════════════╝"
   Say to user: ""
   Say to user: "🏢 Enterprise Design System:"
   Say to user: "   ✅ Design tokens: 150+"
   Say to user: "   ✅ Component library: 80+ components"
   Say to user: "   ✅ Pattern library: 40+ patterns"
   Say to user: "   ✅ Multi-brand support: Enabled"
   Say to user: ""
   Say to user: "📊 Comprehensive Deliverables:"
   Say to user: "   • Wireframes: All screens + states"
   Say to user: "   • User journeys: Complete mapping"
   Say to user: "   • Service blueprints: Full coverage"
   Say to user: "   • Interaction specs: Detailed"
   Say to user: ""
   Say to user: "♿ Accessibility & Compliance:"
   Say to user: "   • WCAG compliance: AAA"
   Say to user: "   • Section 508: ✓"
   Say to user: "   • Multi-language support: ✓"
   Say to user: ""
   Say to user: "🎯 Design Governance:"
   Say to user: "   • Style guide: Complete"
   Say to user: "   • Documentation: Comprehensive"
   Say to user: "   • Version control: Implemented"
   Say to user: ""
   Say to user: "══════════════════════════════════════════════════════════════════════"
   Say to user: ""

   Update TodoWrite: "Analyze with ux-ui-designer" → completed

   # Show confirmation before generation
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: "✅ READY TO GENERATE ENTERPRISE DESIGN SYSTEM"
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
   Say to user: ""
   Say to user: "Based on your responses, I will generate:"
   Say to user: ""
   Say to user: "📁 **Platform Design System:**"
   Say to user: "  • Strategy documentation"
   Say to user: "  • User research & personas"
   Say to user: "  • Comprehensive wireframes"
   Say to user: "  • Service blueprints"
   Say to user: "  • Pattern library"
   Say to user: "  • Accessibility compliance (WCAG 2.1 AAA)"
   Say to user: "  • Brand guidelines"
   Say to user: "  • Governance documentation"
   Say to user: ""
   Say to user: "📦 **Module Designs ({len(modules)} modules):**"
   For module in modules:
     Say to user: "  • {module}: Enterprise-grade design specifications"
   Say to user: ""
   Say to user: "**Proceed with ENTERPRISE design generation? [Y/n]:**"
   Say to user: ""
   Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   Read user confirmation
   If user says no/n:
     Say to user: "Design generation cancelled. You can run the command again when ready."
     Exit
   ```

8. **Generate enterprise design system:**
   ```
   Update TodoWrite: "Generate enterprise design system" → in_progress

   # Create platform design directory
   platform_path = {project_root}/ccu_workspace/platform/03-design/
   If not exists(platform_path):
     Create directory: platform_path
     Say to user: "✅ Created platform design directory"

   # Create enterprise subdirectories
   subdirs = [
     "strategy", "research", "personas", "wireframes", "prototypes",
     "user-flows", "journey-maps", "service-blueprints", "design-system",
     "components", "patterns", "accessibility", "brand", "governance"
   ]
   For subdir in subdirs:
     subdir_path = {platform_path}/{subdir}/
     If not exists(subdir_path):
       Create directory: subdir_path

   # Generate technical approach (comprehensive for enterprise)
   Say to user: "📝 Generating enterprise technical architecture..."
   technical_content = Generate comprehensive technical approach:
     - Microservices architecture
     - Scalability strategies
     - Performance optimization
     - Security architecture
     - API gateway design
     - Event-driven patterns
     - Data governance

   Write file: {platform_path}/technical-approach.md
   Content: technical_content

   # Generate platform UX design (enterprise-grade)
   Say to user: "🎨 Generating enterprise UX strategy..."
   platform_ux = Generate enterprise UX:
     - Multi-tenant architecture
     - Role-based interfaces
     - Customizable dashboards
     - Advanced analytics views
     - Enterprise workflows

   Write file: {platform_path}/ux-design.md
   Content: platform_ux

   # Generate design strategy
   Say to user: "📊 Creating design strategy documentation..."
   strategy_doc = Generate based on stakeholder requirements:
     - Business goals alignment
     - User experience strategy
     - Design principles
     - Success metrics

   Write file: {platform_path}/strategy/design-strategy.md
   Content: strategy_doc

   # Generate user research
   Say to user: "🔍 Documenting user research..."
   research_doc = Generate research documentation:
     - User interviews summary
     - Market analysis
     - Competitive landscape
     - User needs matrix

   Write file: {platform_path}/research/user-research.md
   Content: research_doc

   # Generate detailed personas
   Say to user: "👥 Creating detailed enterprise personas..."
   For persona in personas:
     persona_doc = Generate comprehensive persona:
       - Demographics
       - Goals and motivations
       - Pain points
       - Technology stack
       - Decision-making process
       - Enterprise workflows

     Write file: {platform_path}/personas/{persona.name.lower().replace(' ', '-')}.md
     Content: persona_doc

   # Generate comprehensive wireframes
   Say to user: "📐 Creating comprehensive wireframes..."
   wireframes = Generate detailed wireframes for:
     - All screen states
     - Responsive breakpoints
     - Interaction states
     - Error states
     - Loading states

   Write file: {platform_path}/wireframes/all-screens.md
   Content: wireframes

   # Generate service blueprints
   Say to user: "🗺️ Creating service blueprints..."
   blueprints = Generate service blueprints for:
     - User journeys
     - Backend processes
     - Integration points
     - Support processes

   Write file: {platform_path}/service-blueprints/blueprints.md
   Content: blueprints

   # Generate design system
   Say to user: "🎨 Building enterprise design system..."
   design_system = {
     "version": "1.0",
     "track": "enterprise",
     "tokens": Generate design tokens,
     "components": Generate component library,
     "patterns": Generate pattern library,
     "brand": brand_configuration,
     "themes": multi_brand_themes
   }

   Write file: {platform_path}/design-system/design-system.json
   Content: design_system

   # Generate accessibility documentation
   Say to user: "♿ Creating accessibility compliance docs..."
   accessibility = Generate comprehensive:
     - WCAG 2.1 AAA compliance
     - Section 508 compliance
     - ARIA implementation guide
     - Accessibility testing plan

   Write file: {platform_path}/accessibility/compliance.md
   Content: accessibility

   # Generate brand guidelines
   Say to user: "🎨 Documenting brand guidelines..."
   brand = Generate brand documentation:
     - Visual identity
     - Voice and tone
     - Multi-brand support
     - Co-branding rules

   Write file: {platform_path}/brand/guidelines.md
   Content: brand

   # Generate governance documentation
   Say to user: "📜 Creating governance documentation..."
   governance = Generate governance docs:
     - Design review process
     - Component contribution
     - Version control
     - Design ops workflows

   Write file: {platform_path}/governance/design-ops.md
   Content: governance

   # Generate module-specific enterprise designs
   Say to user: "📦 Generating enterprise module designs..."
   module_design_files = []
   For module in specification.modules:
     module_path = {project_root}/ccu_workspace/modules/{module.name}/03-design/

     If not exists(module_path):
       Create directory: module_path
       Create directory: {module_path}/wireframes/
       Create directory: {module_path}/specifications/

     # Generate module UX design (enterprise)
     module_ux = Generate enterprise module UX:
       - Module architecture
       - Integration points
       - Performance requirements
       - Security requirements

     Write file: {module_path}/ux-design.md
     Content: module_ux

     # Generate comprehensive wireframes
     module_wireframes = Generate detailed module wireframes
     Write file: {module_path}/wireframes/module-screens.md
     Content: module_wireframes

     # Generate component specifications
     components = Generate enterprise component specs
     Write file: {module_path}/components.md
     Content: components

     # Generate user flows
     flows = Generate detailed module workflows
     Write file: {module_path}/user-flows.md
     Content: flows

     # Generate service blueprint
     blueprint = Generate module service blueprint
     Write file: {module_path}/service-blueprint.md
     Content: blueprint

     # Generate interaction specs
     interactions = Generate interaction specifications
     Write file: {module_path}/specifications/interaction-specs.md
     Content: interactions

     # Generate design specs
     specs = {
       "module": module.name,
       "architecture_pattern": module_architecture_patterns[module.name],
       "performance_requirements": module_performance_requirements[module.name],
       "enterprise_features": module_enterprise_features[module.name],
       "integrations": module_integrations[module.name]
     }
     Write file: {module_path}/design-specs.json
     Content: specs

     module_design_files.append({
       "module": module.name,
       "path": module_path,
       "files": [
         "ux-design.md",
         "wireframes/module-screens.md",
         "components.md",
         "user-flows.md",
         "service-blueprint.md",
         "specifications/interaction-specs.md",
         "design-specs.json"
       ]
     })

   Say to user: "✅ Enterprise design system generated!"

   Update TodoWrite: "Generate enterprise design system" → completed

   # Generate design.json as SINGLE SOURCE OF TRUTH for ENTERPRISE
   Say to user: "📄 Creating master enterprise design.json..."

   platform_path = {project_root}/ccu_workspace/platform/03-design/

   # Collect actual enterprise platform files generated
   platform_files = [
     "technical-approach.md",
     "ux-design.md",
     "strategy/design-strategy.md",
     "research/user-research.md",
     "wireframes/all-screens.md",
     "service-blueprints/blueprints.md",
     "design-system/design-system.json",
     "accessibility/compliance.md",
     "brand/guidelines.md",
     "governance/design-ops.md"
   ]

   # Add all persona files
   For persona in personas:
     platform_files.append("personas/{persona.name.lower().replace(' ', '-')}.md")

   # Create comprehensive enterprise design.json
   design_json = {
     "version": "1.0",
     "generated_at": current_timestamp,
     "track": "enterprise",
     "target": ARGUMENTS.target,
     "stakeholder_requirements": stakeholder_requirements,
     "competitive_analysis": competitive_analysis_summary,
     "design_strategy": design_strategy_summary,
     "personas": personas,
     "modules_count": len(modules),
     "platform_design": {
       "path": "platform/03-design/",
       "files": platform_files,
       "file_count": len(platform_files)
     },
     "module_designs": module_design_files,
     "module_configurations": {
       "architecture_patterns": module_architecture_patterns,
       "performance_requirements": module_performance_requirements,
       "enterprise_features": module_enterprise_features
     },
     "design_insights": {
       "design_tokens": "150+",
       "components": "80+",
       "patterns": "40+",
       "brands_supported": brand_count,
       "wireframes": "All screens + states",
       "journeys": "Complete mapping",
       "blueprints": "Full coverage",
       "interactions": "Detailed specifications",
       "wcag_level": "AAA"
     },
     "governance": {
       "style_guide": "complete",
       "documentation": "comprehensive",
       "version_control": "implemented",
       "design_ops": "documented"
     },
     "total_files_generated": len(platform_files) + sum([len(m["files"]) for m in module_design_files]),
     "next_phase": "security",
     "next_command": "/ccu:security --target={ARGUMENTS.target} --track=enterprise"
   }

   Write file: {platform_path}/design.json
   Content: design_json

   Say to user: "✅ Created design.json with {design_json['total_files_generated']} enterprise file references"

   # Comprehensive indexing with claude-context
   Say to user: "🔍 Indexing enterprise design system for search..."
   mcp__claude-context__index_codebase(
     path: {project_root}/ccu_workspace/,
     customExtensions: [".md", ".json"],
     splitter: "ast"
   )

   # Save enterprise patterns to mem0
   Say to user: "💾 Saving enterprise design patterns..."
   mcp__mem0__add_memory(
     messages: "Enterprise design system for {specification.platform_name}:\n" +
              "Stakeholders: {stakeholder_count}\n" +
              "Modules: {', '.join([m.name for m in modules])}\n" +
              "Architecture patterns: {json.dumps(module_architecture_patterns)}\n" +
              "Brand configuration: {json.dumps(brand_configuration)}",
     user_id: "design_phase",
     metadata: {
       "project": specification.platform_name,
       "track": "enterprise",
       "phase": "design",
       "complexity": "high"
     }
   )

   Update TodoWrite: "Generate design.json" → completed

   # Show completion summary
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ ENTERPRISE DESIGN COMPLETE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 **Summary:**
     • Stakeholder interviews: Complete
     • Competitive analysis: Complete
     • Design strategy: Documented
     • Personas: {len(personas)} detailed
     • Modules: {len(modules)} enterprise-configured
     • Design system: Comprehensive
     • Time: < 15 minutes

   📁 **Output Location:**
     {project_root}/ccu_workspace/{path}/03-design/

   📄 **Master Reference:**
     design.json - Complete enterprise design system reference

   🚀 **Next Steps:**
     1. Review design.json for complete system
     2. Review governance/ for design operations
     3. Run: /ccu:security --target={ARGUMENTS.target} --track=enterprise

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

## 🧠 Enhanced shadcn Component Mapping with Sequential Thinking

### Intelligent Component Assignment
**Uses Sequential-Thinking MCP to analyze modules and assign optimal components:**

```
Update TodoWrite: "Analyze modules for component mapping" → in_progress

# Use Sequential Thinking to deeply analyze each module
For module in specification.modules:
  mcp__sequential-thinking__sequentialthinking(
    thought: "Analyzing module: {module.name}.
             Functionality: {module.functionality}.
             User interactions needed: {module.interactions}.
             Data operations: {module.data_operations}.
             Determining optimal shadcn components...",
    nextThoughtNeeded: true,
    thoughtNumber: 1,
    totalThoughts: len(modules) * 2
  )

  # Second pass for component relationships
  mcp__sequential-thinking__sequentialthinking(
    thought: "For {module.name}, considering relationships:
             - Component dependencies
             - Shared patterns across modules
             - Performance implications
             - Accessibility requirements
             Creating optimized component set...",
    nextThoughtNeeded: true
  )

# Generate intelligent component mapping
component_mapping = {
  module.name: {
    "core": [essential shadcn components],
    "extended": [additional components for full functionality],
    "patterns": [composite components to build],
    "rationale": "Why these components were chosen",
    "alternatives": [other viable options],
    "performance": "lazy-load" | "critical" | "deferred"
  }
}

# Display intelligent recommendations
Say to user: "🧠 AI-OPTIMIZED COMPONENT ASSIGNMENT"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

For module, components in component_mapping:
  Say to user: ""
  Say to user: "📦 {module} Module"
  Say to user: "   Analysis: {components.rationale}"
  Say to user: "   "
  Say to user: "   Core Components:"
  For component in components.core:
    Say to user: "   ✓ {component}"
  Say to user: "   "
  Say to user: "   Extended Components:"
  For component in components.extended:
    Say to user: "   + {component}"
  Say to user: "   "
  Say to user: "   Custom Patterns:"
  For pattern in components.patterns:
    Say to user: "   🔧 {pattern}"

Say to user: ""
Say to user: "Accept AI recommendations? [Y/customize/regenerate]: "

Update TodoWrite: "Analyze modules for component mapping" → completed
```

### Component Requirements Documentation
```
Update TodoWrite: "Generate component requirements documentation" → in_progress

# Generate documentation for required components
Create file: {path}/03-design/component-requirements.md
Content:
  # Component Requirements for {target}

  ## Track: {track}

  ## shadcn/ui Components Needed

  ### Core Components (Essential)
  These components are required for basic functionality:
  - {list of core components with descriptions}

  ### Extended Components (Full Features)
  These components enable complete functionality:
  - {list of extended components with purpose}

  ### Custom Patterns to Build
  These patterns need to be created using base components:
  - {pattern name}: {description and components used}

  ## Installation Instructions
  Components will be installed during the development phase using:
  ```bash
  npx shadcn@latest add [component-name]
  ```

  ## Module-Specific Components
  For module in modules:
    ### {module} Module
    - Required: {components}
    - Purpose: {why these components}
    - Patterns: {custom patterns needed}

Create file: {path}/03-design/components.json
Content:
  {
    "shadcn": {
      "core": [list of core components],
      "extended": [list of extended components],
      "custom": [list of custom patterns]
    },
    "modules": {
      module_name: {
        "components": [list],
        "rationale": "why these components"
      }
    },
    "theme": extracted_or_selected_theme,
    "layout": selected_layout_pattern
  }

Say to user: "✅ Generated component-requirements.md and components.json"

Update TodoWrite: "Generate component requirements documentation" → completed
```

## Component Mapping by Application Type

### Comprehensive Component Categories

The design phase intelligently selects shadcn/ui components based on your application type and specific modules. Components are suggested contextually for each module based on its purpose:

**1. Authentication & User Management:**
- Core: form, input, button, card, alert, checkbox, label, switch
- Extended: avatar, tabs, separator, dialog, toast
- Patterns: login-form, register-form, password-reset, profile-settings, mfa-setup
- Optional: social-auth-buttons, captcha-component, session-manager

**2. Dashboard & Analytics:**
- Core: card, chart, table, tabs, badge, skeleton, progress
- Extended: select, date-picker, command, tooltip
- Layout: sidebar, navigation-menu, header, breadcrumb
- Data Viz: bar-chart, line-chart, pie-chart, area-chart, kpi-cards
- Optional: real-time-indicator, export-menu, filter-panel

**3. E-commerce & Marketplace:**
- Core: card, button, dialog, select, radio-group, input, badge
- Extended: carousel, accordion, slider, sheet, aspect-ratio
- Patterns: product-card, cart-sheet, checkout-form, order-summary
- Filters: range-slider, checkbox-group, search-command
- Optional: wishlist-button, comparison-table, review-stars, image-zoom

**4. Admin & Management:**
- Core: data-table, pagination, command, dropdown-menu, button
- Extended: context-menu, toolbar, alert-dialog, toast
- Patterns: crud-table, bulk-actions, filter-bar, export-dialog
- Forms: form, input, select, textarea, checkbox, switch
- Optional: audit-log-viewer, role-manager, permission-matrix

**5. Content Management (CMS/Blog):**
- Core: textarea, card, button, dialog, tabs, form
- Extended: separator, avatar, badge, popover, tooltip
- Layout: navigation-menu, breadcrumb, scroll-area
- Patterns: editor-toolbar, media-picker, tag-input, category-tree
- Optional: markdown-preview, seo-form, publish-scheduler

**6. Social & Communication:**
- Core: avatar, card, input, button, badge, scroll-area
- Extended: popover, dialog, sheet, tabs, separator
- Patterns: chat-interface, comment-thread, notification-list, user-card
- Real-time: status-indicator, typing-animation, message-composer
- Optional: emoji-picker, mention-dropdown, reaction-bar

**7. Financial & Banking:**
- Core: table, form, input, select, alert, card, tabs
- Extended: dialog, badge, progress, tooltip, separator
- Charts: line-chart, area-chart, bar-chart, candlestick
- Patterns: transaction-table, account-card, transfer-form
- Security: alert-dialog, badge, lock-indicator
- Optional: calculator-modal, currency-selector, portfolio-chart

**8. Project Management & Collaboration:**
- Core: card, checkbox, select, date-picker, avatar, badge
- Extended: dialog, dropdown-menu, tabs, progress, popover
- Patterns: task-card, kanban-column, timeline-view, team-list
- Collaboration: comment-thread, mention-input, activity-feed
- Optional: gantt-chart, burndown-chart, sprint-board

**9. Media & Entertainment:**
- Core: card, carousel, dialog, tabs, skeleton, aspect-ratio
- Extended: slider, button, badge, scroll-area, sheet
- Patterns: video-player, playlist, episode-grid, media-card
- Interactive: like-button, share-popover, bookmark-toggle
- Optional: subtitle-menu, quality-selector, playback-controls

**10. Education & Learning:**
- Core: card, progress, tabs, accordion, checkbox, button
- Extended: badge, dialog, separator, scroll-area, alert
- Patterns: course-card, lesson-list, quiz-component, progress-tracker
- Interactive: code-block, flashcard, assignment-form
- Optional: certificate-display, achievement-badges, study-timer

**11. Healthcare & Wellness:**
- Core: form, card, calendar, select, alert, tabs, badge
- Extended: dialog, date-picker, radio-group, progress
- Charts: line-chart, area-chart, progress-rings
- Patterns: appointment-card, patient-form, medication-list
- Optional: symptom-checker, vital-signs-display, emergency-alert

**12. Real Estate & Property:**
- Core: card, carousel, select, slider, tabs, badge
- Extended: dialog, sheet, aspect-ratio, button, popover
- Filters: range-slider, checkbox-group, location-search
- Patterns: property-card, gallery-view, contact-form
- Optional: floor-plan-viewer, mortgage-calculator, map-integration

**13. Travel & Hospitality:**
- Core: date-picker, select, card, tabs, input, button
- Extended: calendar, badge, dialog, carousel, alert
- Patterns: booking-form, itinerary-card, hotel-listing
- Interactive: guest-counter, date-range-picker, location-autocomplete
- Optional: seat-selector, weather-widget, currency-converter

**14. Gaming & Entertainment:**
- Core: button, card, progress, avatar, badge, tabs
- Extended: dialog, popover, slider, scroll-area, sheet
- Patterns: player-profile, leaderboard, achievement-list
- Interactive: game-lobby, inventory-grid, stats-display
- Optional: tournament-bracket, loot-animation, skill-tree

**15. IoT & Smart Home:**
- Core: switch, slider, card, badge, alert, tabs
- Extended: button, progress, select, dialog, popover
- Patterns: device-card, control-panel, automation-rule
- Real-time: status-indicator, sensor-display, activity-log
- Optional: schedule-builder, scene-selector, energy-monitor

**[B] Blank Template:**
- Start with no predefined components
- Full control over component selection
- Build from scratch

**[C] Custom Selection:**
- Manually specify exact components needed
- Mix and match from any category
- Define unique requirements

**[O] Other/Specialized:**
- Describe your unique application type
- Get AI-suggested component combinations
- Industry-specific patterns

## Component Selection Interface

### Step 1: Application Type Selection

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SHADCN COMPONENT SELECTION FOR: $ARGUMENTS.target
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select your application type:

[1]  Authentication & User Management
[2]  Dashboard & Analytics
[3]  E-commerce & Marketplace
[4]  Admin & Management
[5]  Content Management (CMS/Blog)
[6]  Social & Communication
[7]  Financial & Banking
[8]  Project Management & Collaboration
[9]  Media & Entertainment
[10] Education & Learning
[11] Healthcare & Wellness
[12] Real Estate & Property
[13] Travel & Hospitality
[14] Gaming & Entertainment
[15] IoT & Smart Home

[B]  Blank - Start with no components
[C]  Custom - Specify exact components
[M]  Mix - Combine multiple categories
[O]  Other - Describe your needs

Choice [1-15/B/C/M/O]: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Handle Selection

**If numbered category (1-15):**
Load predefined component set and ask for customization

**If Blank (B):**
```
Starting with blank template.
You'll add components manually using: npx shadcn add [component]
No components will be pre-installed.
```

**If Custom (C):**
```
Enter components you need (comma-separated):
Example: button, card, custom-calendar, special-chart
> _
```

**If Mix (M):**
```
Select categories to combine (comma-separated numbers):
Example: 1,2,4 for Auth + Dashboard + Admin
> _
```

**If Other (O):**
```
Describe your application type:
> _

[AI will suggest appropriate components based on description]
```

## Design System Configuration

All tracks generate a `design-system.json` with appropriate detail:

### INSTANT (Minimal)
```json
{
  "layout": "dashboard",
  "theme": "slate",
  "components": ["auto-detected from spec"]
}
```

### RAPID (Essential)
```json
{
  "layout": {
    "type": "dashboard",
    "sidebar": "collapsible"
  },
  "theme": {
    "primary": "slate",
    "mode": "system"
  },
  "typography": {
    "font": "system"
  },
  "components": ["detailed list"],
  "patterns": ["basic patterns"]
}
```

### STANDARD (Complete)
```json
{
  "layout": {
    "type": "selected",
    "sidebar": "configured",
    "responsive": "breakpoints"
  },
  "theme": {
    "colors": "palette",
    "typography": "scale",
    "spacing": "system",
    "shadows": "levels"
  },
  "components": "full inventory",
  "patterns": "comprehensive",
  "interactions": "defined",
  "accessibility": "WCAG 2.1 AA"
}
```

### ENTERPRISE (Full System)
```json
{
  "complete design system with":
  "- Multi-brand support",
  "- Token system",
  "- Component variants",
  "- Pattern library",
  "- Animation specs",
  "- Accessibility compliance",
  "- Governance rules"
}
```

## Automatic Module Design Generation

### For Platform Target (One-Level-Down)

**After platform design completes, automatically design modules:**
```
📦 MODULE DESIGN (One-Level-Down)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform design complete. Now designing modules...

Detected modules from specification:
• auth - Authentication & access control
• dashboard - Data visualization & metrics
• admin - System management interface
• inventory - Custom inventory tracking

Generating module designs with same track: {track}
Module designs will inherit platform design system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Show progress:**
```
📦 MODULE DESIGN PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:     ████████████████████ ✅ Complete
Modules: [2/4] ██████████░░░░░░░░░░ 50% 🔄
├─ auth:      ████████████████████ ✅ Complete
├─ dashboard: ████████████████████ ✅ Complete
├─ admin:     ████████░░░░░░░░░░░░ 🔄 In Progress
└─ inventory: ░░░░░░░░░░░░░░░░░░░░ ⏳ Pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**For Module Target (One-Level-Down):**
```
🔧 FEATURE DESIGN (One-Level-Down)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Module design complete. Now designing features...

Detected features for {module}:
• login - User login flow
• register - New user registration
• password-reset - Password recovery
• two-factor - 2FA setup

Generating feature designs with same track: {track}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## shadcn Configuration Generation

### Generated Files Structure

**components.json (shadcn configuration):**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**component-inventory.json:**
```json
{
  "category": "[selected_category]",
  "template": "[blank|custom|predefined]",
  "shadcn": {
    "installed": ["button", "card", "form", "input"],
    "planned": ["table", "dialog", "tabs"],
    "version": "latest"
  },
  "custom": [
    {
      "name": "inventory-scanner",
      "based_on": "input + camera",
      "location": "components/custom/"
    }
  ],
  "patterns": {
    "auth": ["login-form", "register-form"],
    "dashboard": ["stats-grid", "chart-panel"]
  },
  "theme": {
    "style": "default",
    "baseColor": "slate",
    "darkMode": true
  }
}
```

## Wireframe Generation

### ASCII/Markdown Format Example:
```markdown
## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┬─────────────────────────────────────────────┐ │
│ │ LOGO    │            Top Navigation Bar               │ │
│ ├─────────┼─────────────────────────────────────────────┤ │
│ │         │                                             │ │
│ │  Side   │           Main Content Area                 │ │
│ │  Nav    │                                             │ │
│ │         │   ┌─────────┐ ┌─────────┐ ┌─────────┐     │ │
│ │  ─────  │   │ Card 1  │ │ Card 2  │ │ Card 3  │     │ │
│ │         │   └─────────┘ └─────────┘ └─────────┘     │ │
│ │  Item 1 │                                             │ │
│ │  Item 2 │   ┌────────────────────────────────┐       │ │
│ │  Item 3 │   │       Data Table/Chart         │       │ │
│ │  Item 4 │   │                                │       │ │
│ │         │   └────────────────────────────────┘       │ │
│ └─────────┴─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```
```

## Enhanced Output Files

### Theme-Related Outputs
**When theme extraction is used:**
```
{path}/03-design/
├── theme/
│   ├── extracted-theme.json      # Colors from image/website/description
│   ├── theme-preview.md          # Visual preview of theme
│   ├── color-palette.json        # Full color system
│   ├── css-variables.css         # Ready-to-use CSS vars
│   └── website-screenshot.png    # If extracted from URL
├── component-requirements.md      # Documentation of required components
└── component-mapping.json         # AI-optimized component assignments
```

### Standard Design Outputs
```
{path}/03-design/
├── wireframes/                    # UI mockups for all screens
├── user-flows/                    # User journey diagrams
├── design-system.json             # Complete design configuration
├── components.json                # shadcn component inventory
├── component-inventory.json       # Detailed component specifications
├── navigation.md                  # Site map and navigation structure
├── theme/                         # Theme configuration
│   ├── colors.json               # Color system
│   ├── typography.json           # Type scale
│   └── spacing.json              # Spacing system
└── patterns/                      # Reusable UI patterns
    ├── forms/                    # Form patterns
    ├── tables/                   # Data table patterns
    └── layouts/                  # Layout patterns
```

## Claude-Context Integration

### Create .claude-context.yaml Configuration
```yaml
# Generate in project root
indexes:
  - name: "platform-design"
    path: "./ccu_workspace/platform/03-design"
    includes: ["*.md", "*.json"]
  - name: "module-designs"
    path: "./ccu_workspace/modules"
    includes: ["*/03-design/*.md", "*/03-design/*.json"]
  - name: "shadcn-components"
    path: "./components/ui"
    includes: ["*.tsx", "*.ts"]
```

### Index Design Files
```bash
# Use claude-context MCP to index design files
mcp__claude-context__index_codebase(
  path: "{project_root}/ccu_workspace/platform/03-design",
  splitter: "ast"
)

# Index each module's design
For module in modules:
  mcp__claude-context__index_codebase(
    path: "{project_root}/ccu_workspace/modules/{module}/03-design",
    splitter: "ast"
  )

# Update design.json to reflect indexing
Update design.json:
  claude_context.indexed = true
  claude_context.indexed_at = current_timestamp
```

## Final TodoWrite Completion

```
# Mark final tasks complete
Update TodoWrite: "Generate design system files" → completed
Update TodoWrite: "Create output documentation" → completed
Update TodoWrite: "Generate design.json reference file" → completed
Update TodoWrite: "Create module design structures" → completed
Update TodoWrite: "Setup claude-context indexing" → completed

# Display final todo list status
Say to user: "✅ ALL DESIGN TASKS COMPLETED"
Say to user: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Say to user: ""
For todo in todos:
  Say to user: "✓ {todo.content} - COMPLETED"
Say to user: ""
Say to user: "Total tasks completed: {len(todos)}"
Say to user: "Design phase execution time: {elapsed_time}"
```

## Appendix B: Output File Summary by Track

### 📊 Consolidated Output Documentation

| Track | Platform Files | Module Files | Special Features | design.json Contents |
|-------|---------------|--------------|------------------|---------------------|
| **INSTANT** | 10 core files + 3 folders | 4 per module | Auto-generated personas<br>Default theme<br>Zero questions | Basic references<br>Auto configurations<br>Default theme |
| **RAPID** | 12 files + 4 folders | 4 per module | Module UI choices<br>Theme selection<br>2-3 questions | UI preferences<br>Theme selection<br>Module configs |
| **STANDARD** | 15 files + 7 folders | 4-6 per module | Comprehensive personas<br>Journey maps<br>Patterns | Full configurations<br>Agent insights<br>WCAG compliance |
| **ENTERPRISE** | 14 folders with multiple files | 6-8 per module | Service blueprints<br>Governance<br>Multi-brand | Enterprise system<br>Strategy docs<br>Complete governance |

### 📁 Standard Output Structure

```
✅ Design phase complete for {target}
📁 Created in: {path}/03-design/

Files generated:

PLATFORM LEVEL ({path}/platform/03-design/):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 design.json (SINGLE SOURCE OF TRUTH)
   └─ References ALL files below
   └─ Contains ALL design decisions
   └─ Used by /ccu:plan for master planning

Core Design Files:
- design-system.json (theme and component configuration)
- information-architecture.md (IA and sitemap)
- design-principles.md (design philosophy)
- navigation.md (navigation structure)
- accessibility.md (WCAG compliance)
- component-specs.md (component documentation)
- design-states.md (UI states)
- component-inventory.json (detailed component list)

Folders:
- wireframes/ (platform-wide UI mockups)
- personas/ (user personas)
- theme/ (color system and theme)
- user-flows/ (user journey diagrams)
[Additional folders based on track]

MODULE LEVEL ({path}/modules/{module_name}/03-design/):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For each module:
- wireframes.md (module-specific wireframes)
- components.md (shadcn components for module)
- user-flows.md (module user flows)
- design-specs.json (module design configuration)
[Additional files based on track]

Theme Source: {image|website|description|default}
Components: {count} shadcn components selected
Custom Patterns: {count} patterns to implement

Track: {track}
Next: /ccu:security --target={target} --track={track}
```

## Error Handling

- If `--from=specification` but no specification.json exists:
  ```
  ERROR: No specification found for {target}
  Run first: /ccu:specify --target={target} --track={track}
  ```

## Next Steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT PHASE OPTIONS:

**Phase 4: Security** ⭐ RECOMMENDED NEXT
`/ccu:security --target=$ARGUMENTS.target --track=$ARGUMENTS.track --from=design`
→ Analyze security requirements and create security configuration

**Phase 5: Architecture**
`/ccu:architect --target=$ARGUMENTS.target --track=$ARGUMENTS.track --from=design`
→ Define technical architecture based on design specifications

**Phase 6: Plan** (After Security & Architecture)
`/ccu:plan --target=$ARGUMENTS.target --track=$ARGUMENTS.track`
→ Aggregate all phase outputs into master implementation plan
→ Will use: specification.json, design.json, security-config.json, architecture.json
→ Produces: implementation-plan.json for /ccu:develop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 **Output Generated:**
- **design.json** - SINGLE SOURCE OF TRUTH containing:
  - All generated file references
  - Design decisions and configurations
  - Module UI preferences
  - Theme and component selections
  - Agent analysis results
  - Used by /ccu:plan for implementation planning

⚠️ **Important Notes:**
- Design phase ONLY produces specifications, no implementation
- Component installation happens in /ccu:develop phase
- All design decisions are captured in design.json
- Review design.json before proceeding to next phase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remember: This command is part of the 7-phase engineering process:
discover → specify → **design** → security → architect → plan → develop