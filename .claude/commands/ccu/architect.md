---
description: Phase 5 - Architecture recommendations based on your app's needs
activates: system-architect
argument-hint: --target=platform|module|feature --track=instant|rapid|standard|enterprise [--from=security]
---

# Architect Command - Phase 5: Architecture Recommendations & Choices

This is **Phase 5** of the 7-phase development process. The architect phase recommends appropriate architecture options based on what you're building, explains trade-offs, and implements your chosen technical approach.

Recommend architecture options for **$ARGUMENTS.target** based on your discovered requirements, design choices, and security decisions, then implement your selected architecture.

## Command Syntax

```bash
/ccu:architect --target=platform|module|feature --track=instant|rapid|standard|enterprise [options]
```

## Parameters

### Required Parameters
- `--target=platform|module|feature` - Architecture scope and level
- `--track=instant|rapid|standard|enterprise` - Architecture depth and sophistication
- `--module=<name>` - Required when target=module or target=feature
- `--feature=<name>` - Required when target=feature

### Optional Parameters
- `--from=security` - Load security requirements and threat model
- `--pattern=monolith|microservices|serverless|hybrid` - Architecture style preference
- `--cloud=aws|azure|gcp|multi` - Cloud provider preference
- `--database=postgres|mysql|mongo|multi` - Database preference
- `--cascade=true` - Auto-architect child elements (modules/features)
- `--cost-optimize=true` - Include cost optimization analysis
- `--ai-ready=true` - Include AI/ML infrastructure patterns

## MCP Integration

### CRITICAL: Active MCP Tool Usage

The following MCP tools MUST be actively used in this phase:

1. **Tool: mcp__sequential-thinking__sequentialthinking**
   - When: Designing complex system architectures
   - Purpose: Break down architectural decisions systematically
   - Usage:
   ```
   mcp__sequential-thinking__sequentialthinking(
     thought: "Analyzing scalability requirements for microservices...",
     nextThoughtNeeded: true,
     thoughtNumber: 1,
     totalThoughts: 8
   )
   ```
   - Track specifics: RAPID (2-3 analyses), STANDARD (4-6), ENTERPRISE (8-10)

2. **Tool: mcp__mem0__search_memory**
   - When: Finding proven architectural patterns
   - Purpose: Reuse successful architectures
   - Usage:
   ```
   mcp__mem0__search_memory(
     query: "architecture pattern [type] for [scale] [requirements]"
   )
   ```

3. **Tool: mcp__mem0__add_memory**
   - When: After finalizing architecture
   - Purpose: Store architectural decisions
   - Usage:
   ```
   mcp__mem0__add_memory(
     text: "Architecture: [pattern] for [scale] using [stack] - decisions: [details]"
   )
   ```

4. **Tool: mcp__context7__resolve-library-id**
   - When: Selecting architectural frameworks
   - Purpose: Get accurate framework documentation
   - Usage:
   ```
   mcp__context7__resolve-library-id(
     libraryName: "nestjs" | "express" | "fastapi" | "django"
   )
   ```

5. **Tool: mcp__context7__get-library-docs**
   - When: Implementing specific architectural patterns
   - Purpose: Get framework architecture guides
   - Usage:
   ```
   mcp__context7__get-library-docs(
     context7CompatibleLibraryID: "/vercel/next.js",
     topic: "app-architecture" | "api-routes" | "middleware",
     tokens: 5000
   )
   ```

6. **Tool: mcp__claude-context__search_code**
   - When: Analyzing existing architecture
   - Purpose: Understand current patterns
   - Usage:
   ```
   mcp__claude-context__search_code(
     path: "/absolute/path/to/project",
     query: "router" | "middleware" | "service" | "repository" | "controller"
   )
   ```

7. **Tool: mcp__claude-context__index_codebase**
   - When: Starting architecture analysis (STANDARD/ENTERPRISE)
   - Purpose: Map existing codebase structure
   - Usage:
   ```
   mcp__claude-context__index_codebase(
     path: "/absolute/path/to/project",
     splitter: "ast"
   )
   ```

8. **Tool: mcp__ide__getDiagnostics**
   - When: Checking architecture implementation
   - Purpose: Validate architectural decisions
   - Usage:
   ```
   mcp__ide__getDiagnostics(
     uri: "file:///path/to/architecture/file"
   )
   ```

### MCP Usage by Track

**INSTANT Track:**
- Skip MCP, use framework defaults

**RAPID Track:**
- mcp__mem0__search_memory for patterns
- mcp__context7__get-library-docs for framework architecture
- mcp__mem0__add_memory to store decisions

**STANDARD Track:**
- All RAPID tools plus:
- mcp__sequential-thinking__sequentialthinking for design decisions
- mcp__claude-context__search_code for existing patterns
- mcp__context7__resolve-library-id for framework selection
- mcp__ide__getDiagnostics for validation

**ENTERPRISE Track:**
- All STANDARD tools plus:
- mcp__claude-context__index_codebase for full analysis
- Multiple mcp__sequential-thinking__sequentialthinking for complex decisions
- Extensive mcp__context7__get-library-docs for all frameworks
- Deep architectural pattern analysis

### Context7 MCP
- **Purpose**: Analyze existing codebase structure and patterns
- **Usage**: Identify current architecture, technical debt, migration needs

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

1. **Check for --from parameter:**
   - If `--from=security` is provided:
     - If target=platform: load `{project_root}/ccu_workspace/platform/04-security/security-config.json`
     - If target=module: load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/04-security/security-config.json`
     - If target=feature: load `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/04-security/security-config.json`
   - Also load specification.json, design-system.json from previous phases
   - Use security requirements to inform architecture decisions

2. **Validate target scope:**
   - For `--target=module`: Require `--module=<name>` parameter
   - For `--target=feature`: Require both `--module=<name>` and `--feature=<name>` parameters

3. **Set working paths based on target:**
   - Platform: `{project_root}/ccu_workspace/platform/`
   - Module: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/`
   - Feature: `{project_root}/ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/`

## Step 0: Architecture Pattern Recognition with Mem0 MCP

**Query for similar architecture patterns:**
```
mem0_search({
  type: "architecture_pattern",
  target: $ARGUMENTS.target,
  components: loaded_components_from_design,
  security: loaded_security_requirements,
  track: $ARGUMENTS.track
})
```

**If matches found (similarity > 75%), display:**
```
💡 ARCHITECTURE PATTERN DETECTION (Powered by Mem0 MCP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Similar architectures found:

📦 E-Commerce Platform (88% match)
   Pattern: Modular Monolith → Microservices
   Stack: Next.js + NestJS + PostgreSQL + Redis
   Scale: 100K users, 1M requests/day
   Cost: ~$2,500/month on AWS

📦 SaaS Dashboard (82% match)
   Pattern: Serverless + Edge Functions
   Stack: Remix + Cloudflare Workers + PlanetScale
   Scale: 50K users, real-time updates
   Cost: ~$800/month

Use these patterns? [Y/n]: _
```

**If user accepts, pre-fill architecture decisions and continue.**

## Track-Based Architecture Process

### 🚀 INSTANT Track
**If track is "instant":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load previous phase data"
   - "Apply standard architecture"
   - "Generate architecture config"
   ```

2. **Load context:**
   ```
   Update TodoWrite: "Load previous phase data" → in_progress

   Say to user: "🚀 INSTANT MODE: Applying proven architecture patterns"

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Loading:      ████████████████████ 100% ✅
   Applying:     ████████░░░░░░░░░░░░  40% 🔄
   Generating:   ░░░░░░░░░░░░░░░░░░░░   0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Load specification, design, security configs
   Extract requirements

   Update TodoWrite: "Load previous phase data" → completed
   ```

3. **Apply standard architecture:**
   ```
   Update TodoWrite: "Apply standard architecture" → in_progress

   # INSTANT = Simple Application pattern
   Auto-configure:
   - Pattern: Simple Application (all in src/)
   - Stack: Next.js + Prisma + PostgreSQL
   - API: REST with Next.js API routes
   - State: React Context + Zustand
   - Styling: Tailwind + shadcn/ui
   - Testing: Jest + React Testing Library
   - Deployment: Vercel/Netlify

   Update TodoWrite: "Apply standard architecture" → completed
   ```

4. **Generate output:**
   ```
   Update TodoWrite: "Generate architecture config" → in_progress

   Create directory: {path}/05-architecture/
   Generate:
   - architecture-decisions.md (ADRs)
   - tech-stack.json
   - requirements-technical.md (technical requirements from specification)
   - data-model.md (database entities and relationships)
   - database-schema.prisma (generated from data model)
   - api-structure.md (API design patterns)

   Update TodoWrite: "Generate architecture config" → completed
   ```

### ⚡ RAPID Track
**If track is "rapid":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Collect architecture decisions"
   - "Analyze with system-architect"
   - "Generate architecture documentation"
   ```

2. **Present AI-Driven Architecture Recommendations:**
   ```
   Update TodoWrite: "Collect architecture decisions" → in_progress

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Analyzing:    ████████████████████ 100% ✅
   Recommending: ████████████░░░░░░░░  60% 🔄
   Questions:    [0/4]                  0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   # Load questions from templates/architecture/architect-questions.yaml
   # But first, AI analyzes context and presents recommendations

   For each question, AI presents:

   🤖 AI ARCHITECTURE RECOMMENDATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Based on analysis:
   • Features: [count loaded features]
   • Scale: [expected user count]
   • Components: [UI component count] from design phase
   • Security: [authentication method] from security phase

   📊 I RECOMMEND: [Architecture pattern recommendation]

   Reasoning:
   - [Key reason 1]
   - [Key reason 2]
   - [Key reason 3]

   Docker Setup:
   services: [service list]
   environments: [environment configuration]

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Do you agree with this approach?
   [✅ Accept] [🔄 View Alternatives] [📝 Customize]

   # After collecting answers, update progress
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Questions:    [4/4] ████████████████████ 100% ✅
   Analysis:           ████░░░░░░░░░░░░░░░░  20% 🔄
   Generating:         ░░░░░░░░░░░░░░░░░░░░   0% ⏳
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   # ADAPTIVE QUESTIONING with Sequential-Thinking MCP (RAPID: 2-3 follow-ups)
   **Use Sequential-Thinking to identify architecture gaps:**
   ```
   sequential_think({
     "context": "User provided architecture choices",
     "components": loaded_ui_components_from_design,
     "security": loaded_security_requirements,
     "goal": "Identify missing architecture considerations for RAPID track",
     "max_follow_ups": 3
   })
   ```

   **If gaps identified:**
   💡 ADAPTIVE ARCHITECTURE CLARIFICATION (Powered by Sequential-Thinking MCP)
   [Ask 2-3 follow-up questions about scaling, caching, or integration needs]

   Update TodoWrite: "Collect architecture decisions" → completed
   ```

3. **Activate system-architect agent:**
   ```
   Update TodoWrite: "Analyze with system-architect" → in_progress

   Activate system-architect agent:
   "Based on the discovered {app_type} with {features} and {design_choices}:

   1. RECOMMEND appropriate architecture options (not prescribe)
   2. EXPLAIN trade-offs clearly (dev time, cost, complexity)
   3. ACCEPT user's choices without judgment
   4. CONFIGURE only what user selected
   5. FOCUS on working software with chosen architecture level

   Remember: User may want a quick prototype with simple architecture,
   or may want enterprise-grade architecture. Both are valid choices."

   Display architecture analysis

   Update TodoWrite: "Analyze with system-architect" → completed
   ```

4. **Generate comprehensive architecture documentation:**
   ```
   Update TodoWrite: "Generate architecture documentation" → in_progress

   Create directory: {path}/05-architecture/

   # Generate PRIMARY OUTPUT: architecture-manifest.json
   Create architecture-manifest.json with:
   {
     "meta": {
       "version": "1.0.0",
       "generated": "{timestamp}",
       "track": "{track}",
       "target": "{target}"
     },
     "architecture": {
       "pattern": "{selected_pattern}",
       "stack": {
         "frontend": {...},
         "backend": {...},
         "database": {...},
         "infrastructure": {...}
       },
       "modules": {...},
       "integrations": {...},
       "deployment": {...},
       "docker": {...},
       "environments": {...},
       "testing": {...},
       "performance": {...},
       "cost": {...}
     }
   }

   # Generate supporting documents:
   - architecture-decisions.md (ADR format)
   - requirements-technical.md (technical requirements from specification)
   - data-model.md (database entities and relationships)
   - docker-compose.yml (ready to run)
   - .env.example (all variables)
   - database/schema.prisma
   - api/openapi.yaml
   - deployment/README.md

   Update TodoWrite: "Generate architecture documentation" → completed
   ```

### 📋 STANDARD Track
**If track is "standard":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Define system architecture"
   - "Design data architecture"
   - "Plan integration architecture"
   - "Define DevOps architecture"
   - "Analyze with system-architect"
   - "Generate comprehensive architecture"
   ```

2. **System architecture (6-7 questions):**
   ```
   Update TodoWrite: "Define system architecture" → in_progress

   Detailed questions about:
   - Architecture style (modular monolith vs microservices)
   - Service boundaries
   - Communication patterns (sync/async)
   - Event-driven components
   - Background job processing
   - Real-time requirements

   Update TodoWrite: "Define system architecture" → completed
   ```

3. **Data architecture:**
   ```
   Update TodoWrite: "Design data architecture" → in_progress

   Design:
   - Primary database strategy
   - Read/write splitting
   - Caching layers
   - Data partitioning
   - Backup strategy
   - Data migration approach

   Update TodoWrite: "Design data architecture" → completed
   ```

4. **Integration architecture:**
   ```
   Update TodoWrite: "Plan integration architecture" → in_progress

   Plan:
   - External API integrations
   - Webhook handling
   - Message queuing
   - Event streaming
   - Third-party services
   - API gateway needs

   Update TodoWrite: "Plan integration architecture" → completed
   ```

5. **DevOps architecture:**
   ```
   Update TodoWrite: "Define DevOps architecture" → in_progress

   Define:
   - CI/CD pipeline
   - Environment strategy
   - Container orchestration
   - Infrastructure as Code
   - Monitoring stack
   - Log aggregation

   Update TodoWrite: "Define DevOps architecture" → completed
   ```

6. **Activate system-architect agent:**
   ```
   Update TodoWrite: "Analyze with system-architect" → in_progress

   Activate system-architect agent:
   "Based on the discovered {app_type} with {features} and {design_choices}:

   1. RECOMMEND architecture patterns appropriate for your scale
   2. SUGGEST data architecture options with clear trade-offs
   3. PROPOSE integration approaches based on your needs
   4. OFFER deployment strategies that fit your timeline
   5. ACCEPT your choices and configure accordingly

   Focus on practical, working architecture that matches
   your actual needs, not theoretical best practices."

   Display comprehensive analysis

   Update TodoWrite: "Analyze with system-architect" → completed
   ```

7. **Generate architecture suite:**
   ```
   Update TodoWrite: "Generate comprehensive architecture" → in_progress

   Create directory: {path}/05-architecture/
   Generate:
   - requirements-technical.md (technical requirements from specification)
   - data-model.md (comprehensive database entities and relationships)
   - system-architecture/ (diagrams & docs)
   - data-architecture/ (schemas & strategies)
   - api-architecture/ (OpenAPI specs)
   - integration-architecture/
   - infrastructure/ (IaC templates)
   - devops/ (CI/CD configs)
   - monitoring/ (observability setup)
   - architecture-decisions/ (ADRs)
   - tech-radar.md

   Update TodoWrite: "Generate comprehensive architecture" → completed
   ```

### 🏢 ENTERPRISE Track
**If track is "enterprise":**

1. **Initialize TodoWrite:**
   ```
   Create TodoWrite list:
   - "Load context"
   - "Design enterprise architecture"
   - "Define domain architecture"
   - "Plan cloud architecture"
   - "Design data platform"
   - "Plan platform engineering"
   - "Analyze with system-architect"
   - "Generate enterprise architecture framework"
   ```

2. **Enterprise architecture (10+ areas):**
   ```
   Update TodoWrite: "Design enterprise architecture" → in_progress

   Design:
   - Business capability mapping
   - Application portfolio
   - Technology standards
   - Integration patterns
   - Service mesh design
   - API ecosystem
   - Event-driven architecture
   - CQRS/Event Sourcing needs
   - Multi-tenancy strategy
   - Global distribution

   Update TodoWrite: "Design enterprise architecture" → completed
   ```

3. **Domain architecture:**
   ```
   Update TodoWrite: "Define domain architecture" → in_progress

   Apply DDD principles:
   - Bounded contexts
   - Aggregates
   - Domain events
   - Anti-corruption layers
   - Context mapping
   - Ubiquitous language

   Update TodoWrite: "Define domain architecture" → completed
   ```

4. **Cloud architecture:**
   ```
   Update TodoWrite: "Plan cloud architecture" → in_progress

   Plan:
   - Multi-cloud strategy
   - Region distribution
   - Availability zones
   - Load balancing
   - Auto-scaling groups
   - Disaster recovery
   - Cost optimization
   - Reserved capacity

   Update TodoWrite: "Plan cloud architecture" → completed
   ```

5. **Data platform:**
   ```
   Update TodoWrite: "Design data platform" → in_progress

   Design:
   - Data lake/warehouse
   - Real-time streaming
   - ETL/ELT pipelines
   - Master data management
   - Data governance
   - Analytics infrastructure
   - ML platform integration

   Update TodoWrite: "Design data platform" → completed
   ```

6. **Platform engineering:**
   ```
   Update TodoWrite: "Plan platform engineering" → in_progress

   Plan:
   - Internal developer platform
   - Self-service infrastructure
   - Golden paths
   - Platform APIs
   - Developer experience
   - Platform metrics
   - Cost management

   Update TodoWrite: "Plan platform engineering" → completed
   ```

7. **Activate system-architect agent:**
   ```
   Update TodoWrite: "Analyze with system-architect" → in_progress

   Activate system-architect agent:
   "Based on the discovered {app_type} with {features} at enterprise scale:

   1. RECOMMEND enterprise architecture patterns with rationale
   2. SUGGEST technology choices based on your requirements
   3. PROPOSE governance approaches appropriate for your org
   4. OFFER platform engineering options with cost/benefit
   5. RESPECT your priorities and timeline

   Present options that balance ideal architecture with
   practical implementation constraints you may have."

   Display enterprise-grade analysis

   Update TodoWrite: "Analyze with system-architect" → completed
   ```

8. **Generate enterprise framework:**
   ```
   Update TodoWrite: "Generate enterprise architecture framework" → in_progress

   Create directory: {path}/05-architecture/
   Generate:
   - requirements-technical.md (comprehensive technical requirements)
   - data-model.md (enterprise data entities and relationships)
   - enterprise-architecture/
   - reference-architecture/
   - domain-models/
   - cloud-architecture/
   - data-platform/
   - platform-engineering/
   - service-catalog/
   - api-ecosystem/
   - event-catalog/
   - technology-standards/
   - architecture-governance/
   - migration-roadmap/
   - technical-debt-register/
   - architecture-decisions/ (C4 + ADRs)

   Update TodoWrite: "Generate enterprise architecture framework" → completed
   ```

## Modern Architecture Patterns

### Serverless Architectures
**Track availability: RAPID, STANDARD, ENTERPRISE**

```yaml
edge_functions:
  - Cloudflare Workers (global edge)
  - Vercel Edge Functions
  - AWS Lambda@Edge
  use_cases: "API gateways, auth, image optimization"

serverless_compute:
  - AWS Lambda + API Gateway
  - Google Cloud Functions
  - Azure Functions
  benefits: "Auto-scaling, pay-per-use, zero maintenance"

backend_as_service:
  - Supabase (PostgreSQL + Auth + Realtime)
  - Firebase (NoSQL + Auth + Hosting)
  - Appwrite (Self-hosted option)
```

### AI/ML Infrastructure
**Track availability: STANDARD, ENTERPRISE**

```yaml
vector_databases:
  - Pinecone (managed)
  - Weaviate (hybrid)
  - Qdrant (self-hosted)
  - Milvus (open-source)
  use_cases: "Semantic search, recommendations, RAG"

ml_platforms:
  - Hugging Face Inference
  - Replicate API
  - AWS SageMaker
  - Google Vertex AI
  integration: "Model serving, fine-tuning, pipelines"

gpu_compute:
  - Modal.com (serverless GPU)
  - RunPod (dedicated instances)
  - Vast.ai (marketplace)
```

### Real-time Architectures
**Track availability: RAPID, STANDARD, ENTERPRISE**

```yaml
websocket_solutions:
  - Socket.io (fallback support)
  - Pusher (managed channels)
  - Ably (global presence)

server_sent_events:
  - Native SSE (simple unidirectional)
  - EventSource polyfills

webrtc_platforms:
  - LiveKit (open-source)
  - Agora.io (global infrastructure)
  - Daily.co (embedded video)
```

### Edge Computing Patterns
**Track availability: STANDARD, ENTERPRISE**

```yaml
cdn_compute:
  - Cloudflare Workers + KV/R2
  - Fastly Compute@Edge
  - AWS CloudFront Functions

edge_databases:
  - Cloudflare D1 (SQLite)
  - PlanetScale (MySQL edge)
  - Turso (libSQL distributed)

edge_state:
  - Durable Objects (Cloudflare)
  - Upstash (Redis at edge)
  - Momento (serverless cache)
```

## Component-Aware Architecture

**Auto-configure architecture based on UI components from design phase:**

### Component → Architecture Mapping

```javascript
// Load component-inventory.json from design phase
const componentArchitecture = {
  "forms": {
    "input_validation": "Zod + React Hook Form",
    "file_upload": "S3 presigned URLs + Lambda processing",
    "multi_step": "XState for state management"
  },
  "auth": {
    "oauth": "NextAuth.js or Lucia",
    "passwordless": "Magic links via SendGrid",
    "mfa": "Twilio Verify or Auth0"
  },
  "data_display": {
    "tables": "TanStack Table + server pagination",
    "charts": "Recharts or Victory",
    "realtime": "WebSocket or SSE based on scale"
  },
  "payment": {
    "stripe": "Stripe Checkout + webhooks",
    "subscriptions": "Stripe Billing + Prisma models"
  }
}
```

### Security-Driven Architecture

**Architecture decisions based on security requirements:**

```yaml
high_security:
  - API Gateway with rate limiting
  - WAF rules (AWS/Cloudflare)
  - Secrets management (Vault/AWS Secrets)
  - Zero-trust networking

compliance_driven:
  gdpr:
    - Data residency (EU regions)
    - Encryption at rest/transit
    - Audit logging (immutable)
  hipaa:
    - HIPAA-compliant hosting
    - BAA with cloud providers
    - PHI isolation architecture
  pci:
    - Network segmentation
    - Tokenization service
    - PCI-compliant infrastructure
```

## Technology Radar

### Adopt (Production Ready)
```yaml
frontend:
  - Next.js 14+ (App Router)
  - Remix (Edge-first)
  - shadcn/ui components

backend:
  - Node.js 20 LTS
  - Bun (performance)
  - PostgreSQL 15+

infrastructure:
  - Vercel/Netlify (simple)
  - AWS/GCP/Azure (complex)
  - Cloudflare (edge)
```

### Trial (Evaluate for Use)
```yaml
emerging:
  - Astro (content sites)
  - SolidStart (fine-grained reactivity)
  - Qwik (resumability)

databases:
  - Turso (edge SQLite)
  - Neon (serverless Postgres)
  - CockroachDB (global)
```

### Assess (Worth Exploring)
```yaml
experimental:
  - HTMX (hypermedia)
  - Alpine.js (lightweight)
  - Fresh (Deno framework)
```

### Hold (Avoid/Migrate Away)
```yaml
deprecated:
  - Create React App
  - Angular.js (v1)
  - Webpack (use Vite/Turbopack)
```

## Cost Optimization

### Track-Based Cost Estimates

**INSTANT Track:**
```yaml
monthly_cost: ~$20-50
- Vercel Hobby: $0-20
- PostgreSQL (Supabase free): $0
- Total: Minimal costs
```

**RAPID Track:**
```yaml
monthly_cost: ~$200-500
- Vercel Pro: $20
- Database (Neon/PlanetScale): $50-100
- Redis (Upstash): $10-50
- CDN: $20-50
- Monitoring: $50-100
```

**STANDARD Track:**
```yaml
monthly_cost: ~$1,000-3,000
- AWS/GCP infrastructure: $500-1,500
- Multiple environments: $300-500
- CI/CD and monitoring: $200-400
- Database replicas: $300-600
```

**ENTERPRISE Track:**
```yaml
monthly_cost: ~$5,000-50,000+
- Multi-region deployment
- High availability setup
- Enterprise support contracts
- Compliance infrastructure
- ML/AI compute resources
```

### Cost Optimization Strategies

```yaml
serverless_first:
  - Pay only for actual usage
  - Auto-scaling without over-provisioning
  - No idle resources

reserved_instances:
  - 1-3 year commitments
  - 30-70% cost savings
  - Predictable workloads

spot_instances:
  - 50-90% cost savings
  - Non-critical workloads
  - Batch processing

edge_caching:
  - Reduce origin requests
  - Lower bandwidth costs
  - Improved performance
```

## Architecture Fitness Functions

### Performance Metrics
```yaml
instant_track:
  - Page load < 3s
  - API response < 500ms
  - 90+ Lighthouse score

rapid_track:
  - Page load < 2s
  - API response < 200ms
  - 95+ Lighthouse score
  - Core Web Vitals pass

standard_track:
  - Page load < 1.5s
  - API p95 < 100ms
  - 99.9% uptime SLA
  - <50ms TTFB

enterprise_track:
  - Page load < 1s globally
  - API p99 < 50ms
  - 99.99% uptime SLA
  - Multi-region failover < 30s
```

### Scalability Benchmarks
```yaml
user_capacity:
  instant: "100-1K concurrent"
  rapid: "1K-10K concurrent"
  standard: "10K-100K concurrent"
  enterprise: "100K+ concurrent"

request_handling:
  instant: "100 req/sec"
  rapid: "1K req/sec"
  standard: "10K req/sec"
  enterprise: "100K+ req/sec"

data_volume:
  instant: "< 1GB"
  rapid: "1-100GB"
  standard: "100GB-1TB"
  enterprise: "1TB+"
```

## Cascade Architecture Operations

**When --cascade=true, automatically architect child elements:**

```bash
# Platform level triggers all modules
/ccu:architect --target=platform --track=standard --cascade=true

→ Automatically runs:
  /ccu:architect --target=module --module=auth --track=standard
  /ccu:architect --target=module --module=dashboard --track=standard
  /ccu:architect --target=module --module=api --track=standard

# Module level triggers all features
/ccu:architect --target=module --module=auth --cascade=true

→ Automatically runs:
  /ccu:architect --target=feature --module=auth --feature=login
  /ccu:architect --target=feature --module=auth --feature=oauth
  /ccu:architect --target=feature --module=auth --feature=mfa
```

**Cascade Progress Display:**
```
🏗️ Architecture Cascade Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:     [Done]  ████████████████████ 100% ✅
Modules:      [3/5]   ████████████░░░░░░░░ 60% 🔄
Features:     [7/12]  ███████████░░░░░░░░░ 58% 🔄
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: 73% Complete
```

## Architecture Patterns Reference

### Simple Application
```
src/
├── app/          # Next.js app router
├── components/   # React components
├── lib/          # Utilities
├── api/          # API routes
└── prisma/       # Database
```

### Modular Application
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── billing/
├── shared/
├── infrastructure/
└── api/
```

### Distributed Services
```
services/
├── api-gateway/
├── auth-service/
├── user-service/
├── billing-service/
└── shared-libs/
```

## Architecture Decision Record (ADR) Template

```markdown
# ADR-001: {Decision Title}

## Status
Accepted

## Context
{What is the issue we're addressing?}

## Decision
{What have we decided?}

## Consequences
### Positive
- {Benefits}

### Negative
- {Trade-offs}

## Alternatives Considered
1. {Alternative 1}
2. {Alternative 2}
```

## Architecture Manifest Structure

The primary output is `architecture-manifest.json` - a comprehensive reference for all subsequent phases:

```json
{
  "meta": {
    "version": "1.0.0",
    "generated": "2024-01-19T10:00:00Z",
    "track": "rapid",
    "target": "platform",
    "confidence": {
      "architecture": 0.95,
      "stack": 0.92,
      "integrations": 0.88
    }
  },

  "context": {
    "from_specification": {
      "features": ["auth", "dashboard", "api"],
      "data_models": 12,
      "api_endpoints": 45
    },
    "from_design": {
      "components": 35,
      "ui_framework": "shadcn/ui"
    },
    "from_security": {
      "auth_method": "JWT + OAuth",
      "compliance": ["GDPR"]
    }
  },

  "architecture": {
    "pattern": "modular-monolith",
    "rationale": "Best balance for your scale and team size",

    "stack": {
      "frontend": {
        "framework": "next@14.2.0",
        "ui": "shadcn/ui@latest",
        "styling": "tailwind@3.4.0"
      },
      "backend": {
        "runtime": "node@20-lts",
        "framework": "next-api-routes",
        "orm": "prisma@5.9.0"
      },
      "database": {
        "primary": {
          "type": "postgresql",
          "version": "15"
        },
        "cache": {
          "type": "redis",
          "version": "7"
        }
      }
    },

    "modules": {
      "auth": {
        "priority": 1,
        "components": ["login-form", "oauth-buttons"],
        "api_routes": ["/api/auth/*"],
        "database_models": ["User", "Session"]
      },
      "dashboard": {
        "priority": 2,
        "dependencies": ["auth"],
        "components": ["stats-card", "chart"],
        "api_routes": ["/api/dashboard/*"]
      }
    },

    "integrations": {
      "stripe": {
        "purpose": "payments",
        "env_vars": ["STRIPE_PUBLIC_KEY", "STRIPE_SECRET_KEY"]
      },
      "oauth": {
        "providers": ["google", "github"],
        "env_vars": ["GOOGLE_CLIENT_ID", "GITHUB_CLIENT_ID"]
      }
    },

    "docker": {
      "development": {
        "services": ["app", "postgres", "redis", "mailhog"],
        "compose_file": "docker-compose.yml"
      }
    },

    "deployment": {
      "platform": "vercel",
      "environments": {
        "local": "docker-compose",
        "staging": "vercel-preview",
        "production": "vercel"
      }
    },

    "performance": {
      "targets": {
        "api_response": "200ms",
        "page_load": "1.5s",
        "lighthouse": 90
      }
    },

    "cost": {
      "monthly_estimate": {
        "development": 0,
        "staging": 25,
        "production": 100
      }
    }
  },

  "decisions": [
    {
      "id": "ADR-001",
      "title": "Modular Monolith over Microservices",
      "rationale": "Simpler to develop with small team",
      "status": "accepted"
    }
  ]
}
```

## Tech Stack Configuration

All track levels generate architecture configurations:

### INSTANT
```json
{
  "frontend": "next.js",
  "backend": "next.js-api",
  "database": "postgresql",
  "orm": "prisma",
  "cache": "none",
  "deployment": "vercel"
}
```

### RAPID
```json
{
  "frontend": {
    "framework": "selected",
    "state": "configured",
    "styling": "tailwind+shadcn"
  },
  "backend": {
    "framework": "selected",
    "api": "rest/graphql"
  },
  "database": {
    "primary": "selected",
    "cache": "optional"
  },
  "deployment": "configured"
}
```

### STANDARD
```json
{
  "detailed architecture with":
  "- Service boundaries",
  "- Data architecture",
  "- Integration patterns",
  "- DevOps pipeline",
  "- Monitoring stack"
}
```

### ENTERPRISE
```json
{
  "complete enterprise stack":
  "- Multi-service architecture",
  "- Cloud platform",
  "- Data platform",
  "- Platform engineering",
  "- Observability platform"
}
```

## Output Messages

Upon completion:

```
✅ Architecture defined for {target}
🏗️ Pattern: {architecture-pattern}

📁 Created in: {path}/05-architecture/

📋 ARCHITECTURE SUMMARY:
• Application: {architecture_type}
• Stack: {tech_stack}
• Database: {database} + {cache}
• Integrations: {integration_count} services
• Deployment: {deployment_platform}
• Docker: {container_count} containers
• Environments: Local, Staging, Production
• Estimated Cost: ${monthly_cost}/month

Key files generated:
✅ architecture-manifest.json (complete reference)
✅ docker-compose.yml (ready to run)
✅ .env.example (all variables documented)
✅ Architecture Decision Records (ADRs)

Next: /ccu:plan --target={target} --track={track} --from=architecture
```

## Error Handling

- If missing required context:
  ```
  WARNING: No specification found
  Architecture will use general best practices
  Recommend running full flow from /ccu:discover
  ```

## Next Phase Transition

### 📅 Proceed to Planning Phase

After completing architecture definition, the next phase creates the development plan:

```bash
/ccu:plan --target={target} --track={track} --from=architecture
```

**What Planning Phase Will Use from Architecture:**
- ✅ Technology stack decisions
- ✅ Architecture patterns & structure
- ✅ Database schemas & models
- ✅ API design specifications
- ✅ Performance requirements
- ✅ Cost estimates

### Phase Progress Visualization

```
7-PHASE ENGINEERING PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] Discover   ████████████████████ 100% ✅ Requirements gathered
[2] Specify    ████████████████████ 100% ✅ Features defined
[3] Design     ████████████████████ 100% ✅ UI/UX completed
[4] Security   ████████████████████ 100% ✅ Security assessed
[5] Architect  ████████████████████ 100% ✅ Architecture defined ← YOU ARE HERE
[6] Plan       ░░░░░░░░░░░░░░░░░░░░ 0%   ⏳ Sprint planning pending
[7] Execute    ░░░░░░░░░░░░░░░░░░░░ 0%   ⏳ Development pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: 71% Complete (5/7 phases)
```

### Alternative Paths

**Jump to Execution** (for rapid prototyping with predefined plan):
```bash
/ccu:execute --target={target} --track=instant --from=architecture
```

**Generate Infrastructure** (deploy architecture immediately):
```bash
/ccu:deploy --target={target} --infrastructure-only --from=architecture
```

### 💡 Pro Tips

1. **Use --from=architecture** in next phase to inherit all technical decisions
2. **Planning phase will generate** sprint tasks based on architecture complexity
3. **Track consistency** - maintain same track for optimal task breakdown
4. **Architecture documentation** serves as technical reference during development

### Architecture Artifacts Generated

Your architecture phase created:
- 📁 `05-architecture/` directory with:
  - Architecture Decision Records (ADRs)
  - Technology stack configuration
  - Database schemas and models
  - API specifications
  - Infrastructure as Code templates
  - Performance benchmarks
  - Cost analysis reports

Remember: This command is part of the 7-phase engineering process:
discover → specify → design → security → **architect** → plan → execute