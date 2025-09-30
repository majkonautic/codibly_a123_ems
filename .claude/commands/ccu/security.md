---
description: Phase 4 - Security recommendations and user choices based on your app
activates: security-architect
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=design]
---

# Security Command - Phase 4: Security Recommendations & Choices

This is **Phase 4** of the 7-phase development process. The security phase recommends appropriate security options based on what you're building, explains trade-offs, and implements your chosen security approach.

Recommend security options for **$ARGUMENTS.target** based on your discovered requirements and design choices, then implement your selected security approach.

## Command Syntax

```bash
/ccu:security --target=platform|module|feature --track=instant|rapid|standard|enterprise [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Security assessment scope
- `--track=instant|rapid|standard|enterprise` - Security depth and complexity level
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=design` - Load UI components from design phase for security analysis
- `--compliance=gdpr|hipaa|pci|soc2|sox|all` - Specific compliance framework focus
- `--threat-model=stride|owasp|custom` - Threat modeling framework to use
- `--cascade=true` - Auto-assess security for child elements
- `--pattern=<name>` - Apply known security pattern from Mem0
- `--risk-level=low|medium|high|critical` - Set baseline risk assessment level

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking**
   - When: Analyzing security threats and attack vectors
   - Purpose: Systematically evaluate security risks
   - Usage:
   ```
   mcp__sequential-thinking__sequentialthinking(
     thought: "Analyzing authentication flow for vulnerabilities...",
     nextThoughtNeeded: true,
     thoughtNumber: 1,
     totalThoughts: 10
   )
   ```
   - Track specifics: RAPID (1-2 analyses), STANDARD (3-5), ENTERPRISE (5-10)

2. **Tool: mcp__mem0__search_memory**
   - When: Finding known security patterns and vulnerabilities
   - Purpose: Leverage past security assessments
   - Usage:
   ```
   mcp__mem0__search_memory(
     query: "security vulnerabilities in [tech stack] authentication"
   )
   ```

3. **Tool: mcp__mem0__add_memory**
   - When: After identifying new vulnerabilities or patterns
   - Purpose: Store security findings for future
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "Security pattern: [type] for [use case] - implementation: [details]"
   )
   ```

4. **Tool: mcp__context7__get-library-docs**
   - When: Checking security best practices for frameworks
   - Purpose: Get official security documentation
   - Usage:
   ```
   mcp__context7__get-library-docs(
     context7CompatibleLibraryID: "/vercel/next.js",
     topic: "security" | "authentication" | "authorization",
     tokens: 5000
   )
   ```

5. **Tool: mcp__claude-context__search_code**
   - When: Scanning codebase for security issues
   - Purpose: Find potential vulnerabilities in existing code
   - Usage:
   ```
   mcp__claude-context__search_code(
     path: "/absolute/path/to/project",
     query: "password" | "secret" | "token" | "api key" | "credential"
   )
   ```

6. **Tool: mcp__claude-context__index_codebase**
   - When: Starting security audit of large codebase (ENTERPRISE)
   - Purpose: Enable comprehensive security scanning
   - Usage:
   ```
   mcp__claude-context__index_codebase(
     path: "/absolute/path/to/project",
     splitter: "ast"
   )
   ```

7. **Tool: mcp__playwright__browser_navigate**
   - When: Testing for XSS, CSRF vulnerabilities (ENTERPRISE)
   - Purpose: Interactive security testing
   - Usage:
   ```
   mcp__playwright__browser_navigate(
     url: "http://localhost:3000/vulnerable-endpoint"
   )
   ```

8. **Tool: mcp__playwright__browser_evaluate**
   - When: Testing client-side security (ENTERPRISE)
   - Purpose: Check for exposed sensitive data
   - Usage:
   ```
   mcp__playwright__browser_evaluate(
     function: "() => { return window.localStorage; }"
   )
   ```

### MCP Usage by Track

**INSTANT Track:**
- Skip MCP for speed, use defaults

**RAPID Track:**
- mcp__mem0__search_memory for known vulnerabilities
- mcp__context7__get-library-docs for framework security
- Quick mcp__claude-context__search_code for secrets

**STANDARD Track:**
- All RAPID tools plus:
- mcp__sequential-thinking__sequentialthinking for threat modeling
- mcp__claude-context__index_codebase for comprehensive scan
- mcp__mem0__add_memory for findings storage

**ENTERPRISE Track:**
- All STANDARD tools plus:
- mcp__playwright__browser_navigate for penetration testing
- mcp__playwright__browser_evaluate for client-side testing
- Multiple mcp__sequential-thinking__sequentialthinking for complex threats
- Deep vulnerability analysis with all tools

### Context7 MCP
- **Purpose**: Scan existing codebase for security implementations
- **Usage**: Identify security measures already in place, suggest enhancements

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

## Step 0: Security Pattern Recognition with Mem0 MCP (Active for RAPID/STANDARD/ENTERPRISE)

**Query for similar security configurations:**
```
mem0_search({
  type: "security_pattern",
  target: $ARGUMENTS.target,
  components: loaded_components_from_design,
  track: $ARGUMENTS.track
})
```

**If matches found (similarity > 70%), display:**
```
💡 SECURITY PATTERN DETECTION (Powered by Mem0 MCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Similar security configurations found:

📦 E-Commerce Platform (85% match)
   Auth: JWT + OAuth2 (Google, GitHub)
   Components: Secured forms with zod validation
   Threats Mitigated: XSS, CSRF, SQL Injection, Session Hijacking
   Compliance: PCI-DSS Level 2, GDPR compliant
   Security Score: A+ (SSL Labs)

📦 SaaS Dashboard (72% match)
   Auth: Auth0 with MFA
   Components: RBAC on all tables and actions
   Threats Mitigated: OWASP Top 10 covered
   Compliance: SOC 2 Type II

Options:
[A] Apply best matching security pattern
[C] Customize security measures
[N] Start fresh security assessment
[V] View detailed pattern analysis

Choice [A/C/N/V]: _
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Pre-execution Validation

1. **Check for --from parameter:**
   - If `--from=design` is provided:
     - If target=platform: load from `{project_root}/ccu_workspace/platform/03-design/`:
       - `design-system.json` (theme and auth configurations)
       - `components.json` (shadcn component inventory)
       - `component-inventory.json` (detailed component list)
     - If target=module: load from `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/03-design/`
     - If target=feature: load from `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/03-design/`
   - Parse components to identify security requirements
   - Also load specification.json from 02-specification/ for context
   - If no design exists, that's OK - security can proceed independently

2. **Validate target scope:**
   - For `--target=module`: Require `--module=<name>` parameter
   - For `--target=feature`: Require both `--module=<name>` and `--feature=<name>` parameters

3. **Set working paths based on target:**
   - Platform: `{project_root}/ccu_workspace/platform/`
   - Module: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/`
   - Feature: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/`

## shadcn/ui Component Security Analysis

### Component-Specific Security Considerations

Based on shadcn/ui components from the design phase, analyze security implications:

**Form Components (input, textarea, select, checkbox, radio):**
- Input validation requirements (client + server side)
- XSS prevention through proper sanitization
- SQL injection protection via parameterized queries
- File upload security (if applicable)
- CSRF token implementation
- Rate limiting on form submissions

**Authentication Components (form, card, dialog, tabs):**
- Password strength requirements and validation
- Multi-factor authentication (MFA) implementation
- Session management and secure cookies
- Remember me functionality security
- Social authentication security (OAuth2/OIDC)
- Account lockout mechanisms

**Data Display Components (table, data-table, list, card):**
- Data masking for sensitive information (PII)
- Export security and authorization
- Pagination security (no data leakage)
- Search injection prevention
- Column-level security
- Row-level security (RLS)

**Interactive Components (button, dropdown-menu, command, combobox):**
- Click-jacking prevention (X-Frame-Options)
- Action authorization checks
- Rate limiting for actions
- Confirmation dialogs for destructive operations
- Command injection prevention

**Communication Components (toast, alert, dialog, sheet):**
- Information disclosure in error messages
- Notification content sanitization
- Real-time update authentication
- WebSocket security (if used)

**Navigation Components (navigation-menu, breadcrumb, tabs):**
- URL manipulation prevention
- Deep linking security
- Navigation guard implementation
- Route-level authorization

## Track-Based Security Process

### 🚀 INSTANT Track
**If track is "instant":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context data"
   - "Apply minimal security"
   - "Generate security config"
   ```

2. **Load context:**
   ```
   Update TodoWrite: "Load context data" → in_progress

   Say to user: "🚀 INSTANT MODE: Applying basic security defaults"

   Load specification and design if available
   Identify basic auth needs from spec

   Update TodoWrite: "Load context data" → completed
   ```

3. **Apply minimal security:**
   ```
   Update TodoWrite: "Apply minimal security" → in_progress

   # INSTANT = Minimal viable security, no questions
   Say: "🚀 Applying minimal security for quick prototype:"

   Auto-configure:
   - Authentication: Simple JWT (if users needed)
   - Password hashing: bcrypt
   - CORS: Allow localhost for development
   - HTTPS: Recommended but not enforced
   - Basic input validation

   Say: "✅ Basic security applied. You can enhance this later when needed."

   Update TodoWrite: "Apply minimal security" → completed
   ```

4. **Generate output:**
   ```
   Update TodoWrite: "Generate security config" → in_progress

   Create directory: {path}/04-security/
   Generate:
   - security-config.json (primary output)
   - component-security-matrix.json (component requirements)
   - threat-model.json (minimal)
   - risk-assessment.md (basic risk analysis from discovery risk_indicators)
   - security-requirements.md (basics)
   - auth-config.json (JWT setup)

   Update TodoWrite: "Generate security config" → completed
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Collect security requirements"
   - "Analyze with security-architect"
   - "Generate security documentation"
   ```

2. **Load and ask questions from security-questions.yaml:**
   ```
   Update TodoWrite: "Collect security requirements" → in_progress

   # Display visual progress
   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:     [0/3]   ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Security Rec:  [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Components:    [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # Load questions from templates/security/security-questions.yaml
   Load RAPID track questions from: ccu_framework/templates/security/security-questions.yaml

   # Analyze context from previous phases
   app_type = Get from specification.json or discovery requirements
   detected_data = Analyze entities from specification

   # QUESTION 1: Authentication Method
   Say to user: "
   🔐 AUTHENTICATION
   Based on your {app_type}, we recommend {suggested_auth}. What would you prefer?

   [1] Simple Email & Password
       → Quick to implement, good for MVP (1-2 hours)

   [2] Social Login (Google/GitHub)
       → Better UX, requires OAuth setup (2-4 hours)

   [3] Magic Links (Passwordless)
       → Modern UX, needs email service (3-4 hours)

   [4] No auth needed yet
       → Fastest prototype, add later (0 hours)"

   Ask user: "Please choose [1-4]: "
   Store answer as: auth_method

   # Update progress
   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:     [1/3]   ██████░░░░░░░░░░░░░░ 33% 🔄
   Security Rec:  [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Components:    [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 2: Data Protection
   Say to user: "
   🔒 DATA PROTECTION
   Your app handles {detected_data}. Choose protection level:

   [1] Minimal - Password hashing only
       → Good for: Prototypes, internal tools
       → Implements: bcrypt for passwords

   [2] Standard - Recommended
       → Good for: Most applications
       → Implements: Encryption at rest, HTTPS

   [3] Enhanced - Sensitive data
       → Good for: Financial, health, personal data
       → Implements: Field encryption, audit logs"

   Ask user: "Please choose [1-3]: "
   Store answer as: data_protection

   # Update progress
   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:     [2/3]   █████████████░░░░░░░ 66% 🔄
   Security Rec:  [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   Components:    [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 3: Compliance Timing
   Say to user: "
   📋 COMPLIANCE
   Do you need compliance features now?
   (We can add compliance later without major rework)

   [1] Not needed - Personal/internal use
       → Focus: Ship features first

   [2] Prepare structure - Add later
       → Focus: Build compliant-ready architecture

   [3] Need now - Specific requirements
       → Will ask: Which? (GDPR/HIPAA/PCI/SOC2)"

   Ask user: "Please choose [1-3]: "
   Store answer as: compliance_timing

   # If user chose option 3, ask follow-up
   If compliance_timing == "3":
     Ask user: "Which compliance frameworks? (comma-separated: GDPR, HIPAA, PCI, SOC2): "
     Store answer as: compliance_frameworks

   # Final progress update
   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:     [3/3]   ████████████████████ 100% ✅
   Security Rec:  [Init]  ████░░░░░░░░░░░░░░░░ 20% 🔄
   Components:    [Wait]  ░░░░░░░░░░░░░░░░░░░░ 0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # ADAPTIVE QUESTIONING with Sequential-Thinking MCP (RAPID: 1-2 follow-ups)
   **Use Sequential-Thinking to suggest additional options:**
   ```
   sequential_think({
     "context": "User provided security requirements",
     "answers": collected_requirements,
     "components": loaded_components,
     "goal": "Suggest additional security features for RAPID track",
     "max_follow_ups": 2
   })
   ```

   **If additional options found:**
   Say to user: "💡 ADDITIONAL SECURITY OPTIONS (Powered by Sequential-Thinking MCP)"
   Ask user: "Would you like to add any of these? [Y/N]: "

   # Save all answers to security-choices.json
   Create file: {path}/04-security/security-choices.json
   Content: {
     "track": "rapid",
     "timestamp": current_timestamp(),
     "questions_answered": 3,
     "choices": {
       "authentication": auth_method_value,
       "data_protection": data_protection_value,
       "compliance": compliance_timing_value,
       "compliance_frameworks": compliance_frameworks_value (if applicable)
     }
   }

   Update TodoWrite: "Collect security requirements" → completed
   ```

3. **Activate security-auditor agent:**
   ```
   Update TodoWrite: "Analyze with security-auditor" → in_progress

   Activate security-auditor agent with Opus 4.1:
   "Perform comprehensive security assessment for {target} with track={track}.
   Context: {specification_data + design_data}
   User requirements: {collected_security_requirements}

   Provide structured security assessment including:
   - Vulnerability identification
   - Compliance gaps
   - Security recommendations by priority
   - Threat model
   - Security controls required"

   # Agent returns structured JSON with:
   # - executive_summary
   # - risk_level
   # - vulnerabilities (list with severity)
   # - compliance_assessment
   # - security_controls (auth, encryption, etc)
   # - threat_model
   # - priority_actions
   # - security_score
   # - confidence

   # Update progress
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:     [3/3]   ████████████████████ 100% ✅
   Security Rec:  [Done]  ████████████████████ 100% ✅
   Components:    [8/10]  ████████████████░░░░ 80% 🔄
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Update TodoWrite: "Analyze with security-auditor" → completed
   ```

4. **Generate Security Documentation from Agent:**
   ```
   Update TodoWrite: "Generate security documentation" → in_progress

   # Extract from security-auditor agent's response
   agent_security = agent_analysis from security-auditor

   # Load templates from ccu_framework/templates/security/
   Load security_audit_template = ccu_framework/templates/security/security-audit.template.md
   Load remediation_template = ccu_framework/templates/security/remediation-plan.template.md
   Load compliance_template = ccu_framework/templates/security/compliance-checklist.template.md

   # Create security documentation path
   If target == "platform":
     security_path = {project_root}/ccu_workspace/platform/04-security/
   Elif target == "module":
     security_path = {project_root}/ccu_workspace/modules/{module}/04-security/
   Else:
     security_path = {project_root}/ccu_workspace/modules/{module}/features/{feature}/04-security/

   Create directory: {security_path} if not exists

   # Generate security audit report from agent's analysis
   Write file: {security_path}/security-audit.md
   Content: Fill security_audit_template with:
     - Executive summary: agent_security.executive_summary
     - Risk level: agent_security.risk_level
     - Vulnerabilities: agent_security.vulnerabilities
     - Security score: agent_security.security_score

   # Generate remediation plan from agent's priority actions
   Write file: {security_path}/remediation-plan.md
   Content: Fill remediation_template with agent_security.priority_actions

   # Generate compliance checklist from agent's assessment
   Write file: {security_path}/compliance-checklist.md
   Content: Fill compliance_template with agent_security.compliance_assessment

   # Save structured security data
   Write file: {security_path}/security-assessment.json
   Content: agent_security (complete JSON response)

   Update TodoWrite: "Generate security documentation" → completed
   ```

3. **Dynamic Component Security Analysis:**
   ```
   Update TodoWrite: "Analyze component security" → in_progress

   # Load and parse design system files
   Say to user: "🔍 Loading design system components..."
   components = Load components.json from {path}/../03-design/
   inventory = Load component-inventory.json from {path}/../03-design/
   design_system = Load design-system.json from {path}/../03-design/

   # Create component security matrix
   security_matrix = {}
   component_count = 0

   # Map each used component to specific security requirements
   Say to user: "🔐 Analyzing security requirements for each component..."

   For each component in inventory.components:
     component_count += 1

     if component in ["form", "input", "textarea", "select", "checkbox", "radio"]:
       security_matrix[component] = {
         "category": "form_input",
         "risk_level": "high",
         "requirements": [
           "Input validation: client + server side required",
           "XSS prevention: sanitize all user inputs",
           "CSRF token: implement for all form submissions",
           "Rate limiting: max 5 submissions per minute",
           "SQL injection: use parameterized queries only"
         ]
       }

     elif component in ["data-table", "table"]:
       security_matrix[component] = {
         "category": "data_display",
         "risk_level": "medium",
         "requirements": [
           "Row-level security (RLS) implementation required",
           "Export authorization: check user permissions",
           "Pagination: must be server-side only",
           "Column filtering: whitelist allowed columns",
           "Search queries: prevent injection attacks"
         ]
       }

     elif component in ["dialog", "sheet", "modal", "alert-dialog"]:
       security_matrix[component] = {
         "category": "modal",
         "risk_level": "medium",
         "requirements": [
           "Clickjacking prevention: set X-Frame-Options",
           "Content sanitization: clean all dynamic content",
           "Action authorization: verify permissions",
           "Session validation: check for sensitive actions"
         ]
       }

     elif component in ["file-upload", "dropzone"]:
       security_matrix[component] = {
         "category": "file_handling",
         "risk_level": "critical",
         "requirements": [
           "File type validation: strict whitelist only",
           "Size limits: enforce max 10MB default",
           "Virus scanning: integrate ClamAV or similar",
           "Storage location: isolate from web root",
           "Filename sanitization: prevent path traversal",
           "MIME type verification: check actual content"
         ]
       }

     elif component in ["avatar", "image"]:
       security_matrix[component] = {
         "category": "media",
         "risk_level": "low",
         "requirements": [
           "Image validation: check format and size",
           "CDN security: use secure URLs only",
           "Alt text sanitization: prevent XSS"
         ]
       }

     elif component in ["command", "combobox", "search"]:
       security_matrix[component] = {
         "category": "search",
         "risk_level": "medium",
         "requirements": [
           "Query sanitization: prevent injection",
           "Rate limiting: prevent abuse",
           "Result filtering: check user permissions",
           "Autocomplete security: limit exposed data"
         ]
       }

     else:
       # Default security for other components
       security_matrix[component] = {
         "category": "general",
         "risk_level": "low",
         "requirements": [
           "Standard XSS prevention",
           "User permission checks",
           "Rate limiting where applicable"
         ]
       }

   # Generate component-security-matrix.json
   Say to user: "📋 Generating component security matrix..."

   Create file: {path}/04-security/component-security-matrix.json
   Content: {
     "timestamp": current_timestamp(),
     "track": "$ARGUMENTS.track",
     "target": "$ARGUMENTS.target",
     "components_analyzed": component_count,
     "security_matrix": security_matrix,
     "high_risk_components": [c for c in security_matrix if security_matrix[c]["risk_level"] in ["high", "critical"]],
     "auth_components": [c for c in security_matrix if "auth" in c or "login" in c],
     "data_components": [c for c in security_matrix if security_matrix[c]["category"] == "data_display"],
     "summary": {
       "total_components": component_count,
       "critical_risk": count_by_risk("critical"),
       "high_risk": count_by_risk("high"),
       "medium_risk": count_by_risk("medium"),
       "low_risk": count_by_risk("low")
     }
   }

   Say to user: "✅ Component security analysis complete"
   Say to user: "📊 Analyzed {component_count} components:"
   Say to user: "   - Critical risk: {critical_count}"
   Say to user: "   - High risk: {high_count}"
   Say to user: "   - Medium risk: {medium_count}"
   Say to user: "   - Low risk: {low_count}"

   Update TodoWrite: "Analyze component security" → completed
   ```

4. **Store Security Pattern in Mem0:**
   ```
   Update TodoWrite: "Store security pattern" → in_progress

   # Store successful security configuration
   mem0_save("security_[target]_[timestamp]", {
     "target": "$ARGUMENTS.target",
     "auth_method": selected_auth,
     "security_approach": "STRIDE-based recommendations",
     "components_secured": component_security_list,
     "compliance": selected_compliance,
     "success": true,
     "track": "rapid"
   })

   Say to user: "💾 Security pattern stored for future reuse"

   Update TodoWrite: "Store security pattern" → completed
   ```

5. **Generate documentation:**
   ```
   Update TodoWrite: "Generate security documentation" → in_progress

   Create directory: {path}/04-security/
   Generate:
   - security-choices.json (user's selected options)
   - security-config.json (technical configuration)
   - security-recommendations.md (options presented with rationales)
   - component-security-matrix.json (security for chosen components)
   - auth-config.json (chosen auth method setup)
   - risk-assessment.md (risk analysis from discovery risk_indicators)
   - risk-acknowledgments.md (what user accepted/deferred)

   NO assessment reports, vulnerability lists, or time-based plans!

   Update TodoWrite: "Generate security documentation" → completed
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Ask authentication questions"
   - "Ask authorization questions"
   - "Ask data protection question"
   - "Analyze with security-architect"
   - "Generate security recommendations"
   ```

2. **Load questions from security-questions.yaml and ask interactively:**
   ```
   Update TodoWrite: "Ask authentication questions" → in_progress

   # Load STANDARD track questions from: ccu_framework/templates/security/security-questions.yaml
   # Analyze context from previous phases
   user_count = Get from discovery or specification
   app_type = Get from specification.json

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔐 AUTHENTICATION (2 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 1: Authentication Strategy
   Say to user: "
   Choose authentication strategy for production
   (Based on {user_count} users and {app_type} application)

   [1] JWT with Refresh Tokens
       → Stateless auth with token rotation
       → Security: High | Complexity: Medium

   [2] Session-based with Redis
       → Server-side sessions with caching
       → Security: High | Complexity: Low

   [3] OAuth 2.0 + Internal Auth
       → Social login with fallback
       → Security: High | Complexity: Medium"

   Ask user: "Please choose [1-3]: "
   Store answer as: auth_strategy

   # QUESTION 2: MFA Strategy
   Say to user: "
   Multi-factor authentication approach:

   [1] Optional MFA
       → Users can enable TOTP/SMS
       → User adoption: Higher

   [2] Required for Admin
       → Enforce MFA for privileged users
       → User adoption: Balanced

   [3] Required for All
       → Maximum security
       → User adoption: Lower"

   Ask user: "Please choose [1-3]: "
   Store answer as: mfa_strategy

   Update TodoWrite: "Ask authentication questions" → completed
   Update TodoWrite: "Ask authorization questions" → in_progress

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔑 AUTHORIZATION (2 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 3: Permission Model
   Say to user: "
   Define permission model complexity:

   [1] Role-Based (RBAC)
       → Users have roles, roles have permissions
       → Example: Admin, Editor, Viewer
       → Complexity: Low

   [2] Attribute-Based (ABAC)
       → Permissions based on attributes
       → Example: Department, Location, Time
       → Complexity: Medium

   [3] Policy-Based
       → Complex rules and policies
       → Example: Conditional access policies
       → Complexity: High"

   Ask user: "Please choose [1-3]: "
   Store answer as: permission_model

   # QUESTION 4: API Security
   Say to user: "
   API security requirements:

   [1] API Keys
       → Simple key-based auth
       → Rate limiting: Basic

   [2] OAuth 2.0 Scopes
       → Fine-grained API permissions
       → Rate limiting: Advanced

   [3] mTLS
       → Mutual TLS for service-to-service
       → Rate limiting: Custom"

   Ask user: "Please choose [1-3]: "
   Store answer as: api_security

   Update TodoWrite: "Ask authorization questions" → completed
   Update TodoWrite: "Ask data protection question" → in_progress

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒 DATA PROTECTION (1 question)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 5: Encryption Strategy
   Say to user: "
   Data encryption and protection level:

   [1] Standard Encryption
       Includes:
       • TLS 1.3 in transit
       • AES-256 at rest
       • Bcrypt for passwords

   [2] Enhanced Encryption
       Includes:
       • All standard features
       • Field-level encryption for PII
       • Key rotation
       • Hardware security modules

   [3] Compliance-Ready
       Includes:
       • All enhanced features
       • Audit logging
       • Data retention policies
       • Right to erasure"

   Ask user: "Please choose [1-3]: "
   Store answer as: encryption_strategy

   # Save all answers to security-choices.json
   Create file: {path}/04-security/security-choices.json
   Content: {
     "track": "standard",
     "timestamp": current_timestamp(),
     "questions_answered": 5,
     "choices": {
       "authentication": {
         "strategy": auth_strategy_value,
         "mfa": mfa_strategy_value
       },
       "authorization": {
         "permission_model": permission_model_value,
         "api_security": api_security_value
       },
       "data_protection": {
         "encryption": encryption_strategy_value
       }
     }
   }

   Say to user: "✅ Security requirements collected successfully!"

   Update TodoWrite: "Ask data protection question" → completed
   ```

3. **Activate security-architect agent:**
   ```
   Update TodoWrite: "Analyze with security-architect" → in_progress

   Activate security-architect agent:
   "Provide STANDARD security recommendations for {target}.
   Context: [discovered features and design]
   User preferences: [collected choices from security-choices.json]

   IMPORTANT RULES:
   - RECOMMEND appropriate options, don't assess
   - EXPLAIN trade-offs (dev time vs security level)
   - NO vulnerability reports or priority lists
   - NO time-based implementation plans
   - ACCEPT user's choices without judgment

   For each component/feature:
   - Present security options with pros/cons
   - Suggest reasonable defaults
   - Let user choose their comfort level
   - Configure based on selections"

   Display recommendations and implement choices

   Update TodoWrite: "Analyze with security-architect" → completed
   ```

4. **Generate security recommendations:**
   ```
   Update TodoWrite: "Generate security recommendations" → in_progress

   Create directory: {path}/04-security/
   Generate:
   - security-config.json (primary output)
   - component-security-matrix.json (component recommendations)
   - security-choices.json (user selections)
   - security-recommendations.md (options with rationales)
   - risk-assessment.md (comprehensive risk analysis from discovery)
   - compliance-options.md (if applicable)
   - access-control-config.json (chosen RBAC)
   - encryption-strategy.md
   - incident-response-plan.md (if selected)
   - security-testing-approach.md
   - security-controls.json

   Update TodoWrite: "Generate security recommendations" → completed
   ```

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Ask identity management questions"
   - "Ask compliance framework questions"
   - "Ask threat management questions"
   - "Ask data governance questions"
   - "Analyze with security-architect"
   - "Generate enterprise security recommendations"
   ```

2. **Load ENTERPRISE questions from security-questions.yaml and ask interactively:**
   ```
   Update TodoWrite: "Ask identity management questions" → in_progress

   # Load ENTERPRISE track questions from: ccu_framework/templates/security/security-questions.yaml
   # 15 consolidated questions across 4 categories

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🏢 ENTERPRISE SECURITY FRAMEWORK
   15 comprehensive questions to design your security architecture
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   👤 IDENTITY MANAGEMENT (4 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 1: Identity & Authentication
   Say to user: "
   [1/15] Identity provider and authentication strategy?

   [1] Enterprise SSO (SAML 2.0)
       → Centralized authentication, single sign-on
       → Integrates with AD/LDAP

   [2] Modern OAuth/OIDC
       → Cloud-native, API-friendly
       → Works with Auth0, Okta, Azure AD

   [3] Hybrid (SSO + OAuth)
       → Best of both worlds
       → Complex but flexible"

   Ask user: "Please choose [1-3]: "
   Store answer as: identity_authentication

   # QUESTION 2: Password & Account Policy
   Say to user: "
   [2/15] Password policy and account lifecycle?

   [1] Standard Enterprise
       → 12+ chars, quarterly rotation
       → Manual provisioning/deprovisioning

   [2] High Security
       → 16+ chars, monthly rotation, complexity rules
       → Automated lifecycle management

   [3] Passwordless First
       → Biometrics, hardware keys priority
       → Password as fallback only"

   Ask user: "Please choose [1-3]: "
   Store answer as: password_account_policy

   # QUESTION 3: Privileged Access
   Say to user: "
   [3/15] Privileged access management (PAM)?

   [1] Basic PAM
       → Separate admin accounts
       → Manual approval process

   [2] Advanced PAM
       → Just-in-time access
       → Session recording

   [3] Zero Standing Privilege
       → All privileges temporary
       → Full automation & monitoring"

   Ask user: "Please choose [1-3]: "
   Store answer as: privileged_access

   # QUESTION 4: Session Management
   Say to user: "
   [4/15] Session and token management?

   [1] Conservative
       → 30-min timeout, single session
       → No refresh tokens

   [2] Balanced
       → 2-hour timeout, limited concurrent
       → Secure refresh strategy

   [3] User-Friendly
       → Flexible timeout, multiple sessions
       → Long-lived refresh tokens"

   Ask user: "Please choose [1-3]: "
   Store answer as: session_management

   Update TodoWrite: "Ask identity management questions" → completed
   Update TodoWrite: "Ask compliance framework questions" → in_progress

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 COMPLIANCE FRAMEWORK (4 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 5: Regulatory Compliance
   Say to user: "
   [5/15] Regulatory compliance and audit framework?

   [1] Single Framework
       → Focus on one primary (GDPR/HIPAA/PCI)
       → Streamlined compliance

   [2] Multi-Framework
       → 2-3 regulations covered
       → Moderate complexity

   [3] Comprehensive
       → All applicable regulations
       → Full audit trail & reporting"

   Ask user: "Please choose [1-3]: "
   Store answer as: regulatory_compliance

   If regulatory_compliance != "1":
     Ask user: "Which frameworks? (comma-separated: GDPR, HIPAA, PCI, SOC2, ISO27001): "
     Store answer as: selected_frameworks

   # QUESTION 6: Data Privacy & Residency
   Say to user: "
   [6/15] Data privacy and residency controls?

   [1] Regional
       → Data stays in primary region
       → Basic privacy controls

   [2] Multi-Regional
       → Controlled cross-region replication
       → Enhanced privacy features

   [3] Global with Sovereignty
       → Full data residency compliance
       → Country-specific privacy laws"

   Ask user: "Please choose [1-3]: "
   Store answer as: data_privacy_residency

   # QUESTION 7: Compliance Monitoring
   Say to user: "
   [7/15] Compliance monitoring and attestation?

   [1] Quarterly Reviews
       → Manual compliance checks
       → Basic reporting

   [2] Monthly Automated
       → Automated scanning
       → Dashboard reporting

   [3] Continuous
       → Real-time monitoring
       → Instant alerts & remediation"

   Ask user: "Please choose [1-3]: "
   Store answer as: compliance_monitoring

   # QUESTION 8: Third-Party Compliance
   Say to user: "
   [8/15] Third-party and vendor compliance?

   [1] Trust-Based
       → Annual questionnaires
       → Basic SLA tracking

   [2] Risk-Based
       → Tiered vendor assessment
       → Regular audits for critical

   [3] Zero-Trust Vendors
       → Continuous monitoring
       → Real-time compliance validation"

   Ask user: "Please choose [1-3]: "
   Store answer as: third_party_compliance

   Update TodoWrite: "Ask compliance framework questions" → completed
   Update TodoWrite: "Ask threat management questions" → in_progress

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🛡️ THREAT MANAGEMENT (4 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 9: Threat & Vulnerability Model
   Say to user: "
   [9/15] Threat modeling and vulnerability management?

   [1] Basic STRIDE
       → Annual threat modeling
       → Monthly vulnerability scans

   [2] Advanced STRIDE + OWASP
       → Quarterly threat reviews
       → Weekly scans, monthly pen tests

   [3] Continuous Threat Intelligence
       → Real-time threat modeling
       → Daily scans, continuous pen testing"

   Ask user: "Please choose [1-3]: "
   Store answer as: threat_vulnerability_model

   # QUESTION 10: Incident Response
   Say to user: "
   [10/15] Incident response and recovery plan?

   [1] Basic Playbooks
       → Core incident types covered
       → 24-hour response SLA

   [2] Comprehensive IR
       → All incident types
       → 4-hour response, DR included

   [3] Advanced SOC
       → 24/7 SOC team
       → 15-min response, hot standby"

   Ask user: "Please choose [1-3]: "
   Store answer as: incident_response

   # QUESTION 11: Security Monitoring
   Say to user: "
   [11/15] Security monitoring and SIEM strategy?

   [1] Log Aggregation
       → Central logging
       → Daily review

   [2] SIEM Platform
       → Real-time correlation
       → Automated alerts

   [3] Advanced Analytics
       → AI/ML threat detection
       → Predictive analytics"

   Ask user: "Please choose [1-3]: "
   Store answer as: security_monitoring

   # QUESTION 12: Security Testing
   Say to user: "
   [12/15] Security testing and penetration testing?

   [1] Annual Testing
       → Yearly pen test
       → Basic SAST/DAST

   [2] Quarterly Testing
       → Quarterly pen tests
       → CI/CD security scanning

   [3] Continuous Security
       → Bug bounty program
       → Red team exercises"

   Ask user: "Please choose [1-3]: "
   Store answer as: security_testing

   Update TodoWrite: "Ask threat management questions" → completed
   Update TodoWrite: "Ask data governance questions" → in_progress

   Say to user: "
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔒 DATA GOVERNANCE (3 questions)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

   # QUESTION 13: Data Classification & Encryption
   Say to user: "
   [13/15] Data classification and encryption strategy?

   [1] Two-Tier
       → Public/Confidential
       → Standard AES-256

   [2] Four-Tier
       → Public/Internal/Confidential/Restricted
       → Tiered encryption + HSM

   [3] Granular
       → Custom classification matrix
       → Field-level encryption, key per tenant"

   Ask user: "Please choose [1-3]: "
   Store answer as: data_classification_encryption

   # QUESTION 14: Data Loss Prevention
   Say to user: "
   [14/15] Data loss prevention and backup security?

   [1] Basic DLP
       → Email/file scanning
       → Daily encrypted backups

   [2] Comprehensive DLP
       → All channels monitored
       → Continuous replication

   [3] Advanced DLP + CASB
       → AI-powered detection
       → Immutable backups, air-gapped"

   Ask user: "Please choose [1-3]: "
   Store answer as: data_protection_dlp

   # QUESTION 15: Data Lifecycle
   Say to user: "
   [15/15] Data lifecycle and secure destruction?

   [1] Standard Retention
       → Policy-based retention
       → Secure delete on expiry

   [2] Automated Lifecycle
       → Tiered storage migration
       → Cryptographic erasure

   [3] Forensic-Grade
       → Legal hold capabilities
       → Multi-pass DOD erasure"

   Ask user: "Please choose [1-3]: "
   Store answer as: data_lifecycle

   # Save all 15 answers to security-choices.json
   Create file: {path}/04-security/security-choices.json
   Content: {
     "track": "enterprise",
     "timestamp": current_timestamp(),
     "questions_answered": 15,
     "choices": {
       "identity_management": {
         "authentication": identity_authentication_value,
         "password_policy": password_account_policy_value,
         "privileged_access": privileged_access_value,
         "session_management": session_management_value
       },
       "compliance_framework": {
         "regulatory": regulatory_compliance_value,
         "selected_frameworks": selected_frameworks_value (if applicable),
         "data_privacy": data_privacy_residency_value,
         "monitoring": compliance_monitoring_value,
         "third_party": third_party_compliance_value
       },
       "threat_management": {
         "threat_model": threat_vulnerability_model_value,
         "incident_response": incident_response_value,
         "siem": security_monitoring_value,
         "testing": security_testing_value
       },
       "data_governance": {
         "classification": data_classification_encryption_value,
         "dlp": data_protection_dlp_value,
         "lifecycle": data_lifecycle_value
       }
     }
   }

   Say to user: "✅ Enterprise security framework requirements collected successfully!"

   Update TodoWrite: "Ask data governance questions" → completed
   ```

3. **Activate security-architect agent:**
   ```
   Update TodoWrite: "Analyze with security-architect" → in_progress

   Activate security-architect agent:
   "Design ENTERPRISE security framework for {target}.
   User's 15 security choices: [loaded from security-choices.json]
   Risk Assessment: [comprehensive risks]
   Governance: [security governance based on choices]
   Zero-Trust: [architecture design if selected]
   Compliance: [program requirements from user selections]

   Deliver:
   - Enterprise security architecture
   - Defense-in-depth strategy
   - Security operations design
   - Compliance frameworks
   - Incident response plan
   - Disaster recovery plan
   - Security metrics & KPIs
   - Vendor risk management
   - Security roadmap"

   Display enterprise-grade analysis based on user's choices

   Update TodoWrite: "Analyze with security-architect" → completed
   ```

4. **Generate enterprise recommendations:**
   ```
   Update TodoWrite: "Generate enterprise security recommendations" → in_progress

   Create directory: {path}/04-security/
   Generate:
   - security-config.json (primary output)
   - component-security-matrix.json (enterprise component recommendations)
   - security-choices.json (all user selections)
   - governance-recommendations.md (chosen policies)
   - architecture-design.md (selected approach)
   - risk-assessment.md (enterprise-level risk analysis with mitigation strategies)
   - compliance-framework.json (selected requirements)
   - incident-response-plan.md (if selected)
   - disaster-recovery-plan.md (if selected)
   - security-operations-guide.md
   - vendor-management-policy.md (if applicable)
   - audit-preparation-guide.md
   - training-recommendations.md
   - metrics-dashboard-config.json
   - security-roadmap.md
   - executive-summary.md

   Update TodoWrite: "Generate enterprise security recommendations" → completed
   ```

## Security Configuration Output

All complexity levels generate a `security-config.json` as the **primary output file** that consolidates all security decisions. This file is consumed by the architecture phase to ensure secure technical design:

**File location**: `{path}/04-security/security-config.json`

### INSTANT (Minimal)
```json
{
  "authentication": "jwt",
  "authorization": "basic-roles",
  "encryption": "at-rest",
  "compliance": "none"
}
```

### RAPID (Essential)
```json
{
  "authentication": {
    "method": "selected",
    "mfa": "optional"
  },
  "authorization": {
    "model": "rbac",
    "roles": ["defined"]
  },
  "encryption": {
    "at_rest": true,
    "in_transit": true
  },
  "compliance": ["selected"],
  "api_security": {
    "rate_limiting": true,
    "authentication": "configured"
  }
}
```

### STANDARD (Comprehensive)
```json
{
  "security_framework": "STRIDE-based",
  "authentication": "multi-factor",
  "authorization": "detailed-rbac",
  "encryption": "full-strategy",
  "compliance": "multiple-frameworks",
  "monitoring": "security-events",
  "incident_response": "defined"
}
```

### ENTERPRISE (Complete Framework)
```json
{
  "complete security framework with":
  "- Risk management program",
  "- Zero-trust architecture",
  "- Security governance",
  "- Compliance program",
  "- Security operations center",
  "- Incident response team",
  "- Continuous monitoring",
  "- Vendor risk management"
}
```

## Security Architecture Visualization

```markdown
## STRIDE-Based Security Recommendations

### Data Flow Diagram
```
┌─────────┐      HTTPS       ┌─────────┐      mTLS        ┌─────────┐
│ Client  │ ──────────────> │   API   │ ──────────────> │Database │
└─────────┘                  └─────────┘                  └─────────┘
     │                            │                            │
     │                            │                            │
     ▼                            ▼                            ▼
[Spoofing]                  [Tampering]              [Info Disclosure]
- MFA Required              - Input Validation      - Encryption at Rest
- Session Management        - HMAC Signatures       - Field-level Encrypt
```

### Security Recommendations Matrix
| Component | Security Need | Recommendation | User Choice |
|-----------|--------------|----------------|-------------|
| Auth API  | Identity     | MFA + JWT      | Selected    |
| Database  | Integrity    | Audit Logs     | Optional    |
| Network   | Availability | Rate Limiting  | Selected    |
```

## OWASP Top 10 Integration

**Security recommendations aligned with industry standards:**

### OWASP Mapping by Track

**INSTANT Track - Top 3 Critical:**
```json
{
  "owasp_coverage": {
    "A01_broken_access": "Basic auth checks",
    "A02_crypto_failures": "Password hashing",
    "A07_security_misconfig": "Default settings review"
  }
}
```

**RAPID Track - Top 5 Essential:**
```json
{
  "owasp_coverage": {
    "A01_broken_access": "Full RBAC implementation",
    "A02_crypto_failures": "Encryption at rest/transit",
    "A03_injection": "Input validation patterns",
    "A07_security_misconfig": "Security headers & CSP",
    "A09_logging_failures": "Basic audit logging"
  }
}
```

**STANDARD Track - Top 7 Comprehensive:**
```json
{
  "owasp_coverage": {
    "A01_broken_access": "Advanced authorization matrix",
    "A02_crypto_failures": "Key management & rotation",
    "A03_injection": "Parameterized queries & validation",
    "A04_insecure_design": "Threat modeling integration",
    "A07_security_misconfig": "Hardened configurations",
    "A08_software_integrity": "Dependency scanning",
    "A09_logging_failures": "Comprehensive audit trails"
  }
}
```

**ENTERPRISE Track - All 10 Complete:**
```json
{
  "owasp_2021_full": {
    "A01_broken_access_control": {
      "controls": ["RBAC", "ABAC", "Zero Trust"],
      "testing": "Automated pen testing"
    },
    "A02_cryptographic_failures": {
      "controls": ["HSM integration", "Quantum-ready"],
      "testing": "Crypto audit trails"
    },
    "A03_injection": {
      "controls": ["WAF rules", "Input sanitization"],
      "testing": "Fuzzing & static analysis"
    },
    "A04_insecure_design": {
      "controls": ["Security architecture review"],
      "testing": "Design pattern validation"
    },
    "A05_security_misconfiguration": {
      "controls": ["IaC security", "CIS benchmarks"],
      "testing": "Configuration scanning"
    },
    "A06_vulnerable_components": {
      "controls": ["SCA", "SBOM generation"],
      "testing": "Dependency tracking"
    },
    "A07_identification_authentication": {
      "controls": ["MFA", "Passwordless", "SSO"],
      "testing": "Auth flow testing"
    },
    "A08_software_data_integrity": {
      "controls": ["Code signing", "Integrity monitoring"],
      "testing": "Supply chain validation"
    },
    "A09_security_logging_monitoring": {
      "controls": ["SIEM integration", "Real-time alerts"],
      "testing": "Incident response drills"
    },
    "A10_server_side_request_forgery": {
      "controls": ["URL validation", "Network segmentation"],
      "testing": "SSRF prevention testing"
    }
  }
}
```

## Component Security Matrix

**Auto-generated security requirements per UI component (from design phase):**

### Form Components Security
```json
{
  "input_fields": {
    "validation": "Client & server-side",
    "sanitization": "HTML entity encoding",
    "xss_protection": "CSP headers + DOMPurify"
  },
  "file_uploads": {
    "size_limits": true,
    "type_validation": "MIME + extension",
    "virus_scanning": "ClamAV integration",
    "storage": "Isolated + encrypted"
  }
}
```

### Authentication Components
```json
{
  "login_form": {
    "rate_limiting": "5 attempts/15 min",
    "captcha": "After 3 failed attempts",
    "password_policy": "Min 12 chars, complexity",
    "session_management": "Secure + HttpOnly cookies"
  },
  "oauth_providers": {
    "google": "PKCE flow required",
    "github": "Scope minimization",
    "microsoft": "Tenant validation"
  }
}
```

### Data Display Components
```json
{
  "tables": {
    "pagination": "Server-side only",
    "filtering": "Parameterized queries",
    "sorting": "Whitelist columns",
    "export": "Permission-based + audit"
  },
  "charts": {
    "data_masking": "PII redaction",
    "aggregation": "Role-based access",
    "caching": "User-scoped only"
  }
}
```

## Compliance Framework Mapping

### GDPR Requirements (EU)
```yaml
instant:
  - Privacy notice display
  - Cookie consent basic
rapid:
  - Data portability API
  - Right to deletion
  - Consent management
standard:
  - Full audit trail
  - Data minimization
  - Purpose limitation
  - DPO assignment
enterprise:
  - Privacy by design
  - DPIA automation
  - Cross-border transfer controls
  - Automated compliance reporting
```

### HIPAA Requirements (Healthcare)
```yaml
rapid:
  - PHI encryption at rest/transit
  - Access controls (basic RBAC)
  - Audit logging
standard:
  - BAA management
  - Minimum necessary principle
  - De-identification procedures
  - Incident response plan
enterprise:
  - Advanced encryption (AES-256)
  - Automated risk assessments
  - Complete audit controls
  - Disaster recovery planning
```

### PCI-DSS Requirements (Payment)
```yaml
instant:
  - Never store CVV
  - Basic tokenization
rapid:
  - PCI Level 4 compliance
  - Secure transmission
  - Access control
standard:
  - PCI Level 2-3 compliance
  - Network segmentation
  - Vulnerability scanning
enterprise:
  - PCI Level 1 compliance
  - Full card data encryption
  - Penetration testing
  - Compensating controls
```

### SOC2 Requirements (Service Organizations)
```yaml
instant:
  - Basic access controls
  - HTTPS enforcement
  - Session management

rapid:
  - SOC2 Type I readiness
  - Basic audit logging
  - Change management process
  - Data backup procedures

standard:
  - SOC2 Type II preparation
  - Comprehensive audit trails
  - Vendor risk management
  - Risk assessment documentation
  - Incident response procedures

enterprise:
  - Full SOC2 Type II compliance
  - Continuous control monitoring
  - Automated compliance reporting
  - Trust service criteria coverage:
    - Security
    - Availability
    - Processing Integrity
    - Confidentiality
    - Privacy
  - Annual third-party audits
```

## Cascade Security Operations

**When --cascade=true, automatically process child elements:**

```bash
# Platform level triggers all modules
/ccu:security --target=platform --track=standard --cascade=true

→ Automatically runs:
  /ccu:security --target=module --module=auth --track=standard
  /ccu:security --target=module --module=dashboard --track=standard
  /ccu:security --target=module --module=api --track=standard

# Module level triggers all features
/ccu:security --target=module --module=auth --cascade=true

→ Automatically runs:
  /ccu:security --target=feature --module=auth --feature=login
  /ccu:security --target=feature --module=auth --feature=registration
  /ccu:security --target=feature --module=auth --feature=password-reset
```

**Cascade Progress Display:**
```
🔐 Security Recommendation Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:     [Done]  ████████████████████ 100% ✅
Modules:      [3/5]   ████████████░░░░░░░░ 60% 🔄
Features:     [8/15]  ██████████░░░░░░░░░░ 53% 🔄
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Messages

Upon completion:

```
✅ Security recommendations complete for {target}
🔒 Security level: {track}

📁 Created in: {path}/04-security/

Key configurations:
- Authentication: {chosen_method}
- Compliance: {selected_frameworks}
- Security choices: {saved}

Next: /ccu:architect --target={target} --track={track}
```

## Error Handling

- If target requires parent context not found:
  ```
  WARNING: No parent specification found
  Security recommendations will use defaults
  Consider running: /ccu:specify --target={parent} first
  ```

## Next Phase Transition

### 🏗️ Proceed to Architecture Phase

After completing security recommendations, the next phase defines the technical architecture:

```bash
/ccu:architect --target={target} --track={track} --from=security
```

**What Architecture Phase Will Use from Security:**
- ✅ Security choices & recommendations
- ✅ Authentication & authorization selections
- ✅ Component security matrix
- ✅ Compliance requirements chosen
- ✅ OWASP-aligned security features

### Phase Progress Visualization

```
7-PHASE ENGINEERING PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] Discover   ████████████████████ 100% ✅ Requirements gathered
[2] Specify    ████████████████████ 100% ✅ Features defined
[3] Design     ████████████████████ 100% ✅ UI/UX completed
[4] Security   ████████████████████ 100% ✅ Security chosen ← YOU ARE HERE
[5] Architect  ░░░░░░░░░░░░░░░░░░░░ 0%   ⏳ Technical design pending
[6] Plan       ░░░░░░░░░░░░░░░░░░░░ 0%   ⏳ Sprint planning pending
[7] Execute    ░░░░░░░░░░░░░░░░░░░░ 0%   ⏳ Development pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: 57% Complete (4/7 phases)
```

### Alternative Paths

**Skip to Planning** (if architecture is predetermined):
```bash
/ccu:plan --target={target} --track={track} --from=security
```

**Jump to Execution** (for rapid prototyping):
```bash
/ccu:execute --target={target} --track=instant --from=security
```

### 💡 Pro Tips

1. **Use --from=security** in next phase to automatically load security requirements
2. **Architecture phase will create** secure component diagrams based on security choices
3. **Track consistency** - maintain same track level for best results
4. **Review security** before architecture to ensure all choices are documented