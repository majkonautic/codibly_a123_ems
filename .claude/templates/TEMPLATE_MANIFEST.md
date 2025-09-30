# Template Manifest - CCU Framework 7-Phase System

## Overview
This document catalogs all templates ACTUALLY USED in the 7-phase development process.

## 📊 Active Templates by Phase

### Phase 1: DISCOVERY ✅
**Location**: `/templates/discovery/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| discovery-questions.yaml | Question bank for all complexity levels | discover.md |
| discovery-instant.template.md | Instant discovery output | discover.md |
| discovery-standard.template.md | Standard discovery output | discover.md |
| interfaces-registry.template.md | UI component catalog | discover.md |
| authentication.template.md | Auth pattern discovery | discover.md |
| payment.template.md | Payment pattern discovery | discover.md |

### Phase 2: SPECIFICATION ✅
**Location**: `/templates/specification/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| specification-questions.yaml | Question bank for specs | specify.md |
| unified-spec.template.md | Unified specification | specify.md |
| module-patterns.yaml | Module detection patterns | specify.md |

### Phase 3: DESIGN ✅
**Location**: `/templates/design/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| wireframe-dashboard.template.md | Dashboard wireframe | Not yet referenced |
| user-flow.template.md | User journey flows | Not yet referenced |
| design-system.template.json | Design system config | Not yet referenced |

*Note: These templates are ready for use but not yet referenced in design.md*

### Phase 4: SECURITY ✅
**Location**: `/templates/security/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| threat-model.template.md | STRIDE analysis | Not yet referenced |

*Note: Template ready for use but not yet referenced in security.md*

### Phase 5: ARCHITECT ✅
**Location**: `/templates/architecture/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| architecture-decision-record.template.md | ADR documentation | Not yet referenced |
| tech-stack.template.json | Technology stack | Not yet referenced |

*Note: Templates ready for use but not yet referenced in architect.md*

### Phase 6: PLAN ✅
**Location**: `/templates/plan/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| implementation-plan.template.json | Master plan | Not yet referenced |

*Note: Template ready for use but not yet referenced in plan.md*

### Phase 7: DEVELOP ✅
**Location**: `/templates/tests/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| unit-instant.template.test.ts | Unit tests | develop-separated.md |
| integration-instant.template.test.ts | Integration tests | develop-separated.md |
| playwright.config.instant.ts | Playwright config | develop-separated.md |

### Supporting: CI/CD ✅
**Location**: `/templates/cicd/`

| Template | Purpose | Used In Command |
|----------|---------|-----------------|
| github-actions-main.yml | Main branch CI | cicd.md |
| github-actions-staging.yml | Staging deployment | cicd.md |
| github-actions-production.yml | Production deployment | cicd.md |
| cicd-config.yaml | CI/CD configuration | cicd.md |
| worktree-pr-template.md | PR template | cicd.md |

## 📊 Cleanup Summary

### Removed Templates (Not Referenced):
- **40+ unused templates** removed
- **4 entire directories** deleted (nextjs/, reports/, ui-configuration/, layouts/)
- **Reduced from ~65 templates to ~20 active templates**

### Why Removed:
1. Not referenced in any command files
2. Duplicated functionality
3. Old architecture patterns
4. Overly complex for current needs

## 🔄 Template Usage Flow

```
Phase 1: DISCOVERY
├── discovery-questions.yaml → Collect insights
├── discovery-instant.template.md → Instant output
├── discovery-standard.template.md → Standard output
└── Pattern templates → When patterns detected

Phase 2: SPECIFICATION
├── specification-questions.yaml → Collect requirements
├── module-patterns.yaml → Detect modules
└── unified-spec.template.md → Generate spec

Phase 3-6: DESIGN/SECURITY/ARCHITECT/PLAN
└── Templates created but await command integration

Phase 7: DEVELOP
├── unit-instant.template.test.ts → Unit tests
├── integration-instant.template.test.ts → Integration tests
└── playwright.config.instant.ts → E2E setup
```

## 📋 Template Principles

### Keep It Simple
- Only templates that are ACTUALLY USED
- No duplicate functionality
- Clear purpose for each template

### Naming Convention
- `{name}.template.{ext}` - Template files
- `{name}-questions.yaml` - Question banks
- `{name}.config.{ext}` - Configuration files

## 🚀 Next Steps

1. **Integrate Phase 3-6 Templates**: Update commands to actually use the new templates
2. **Create Minimal Templates**: Only add templates when commands need them
3. **Regular Cleanup**: Remove unused templates quarterly

## 📝 Maintenance

- **Before Adding**: Check if existing template can be extended
- **After Removing**: Update this manifest
- **Regular Audit**: Verify all listed templates are still used

---

**Last Updated**: 2025-01-19
**Version**: 2.0.0 (Post-Cleanup)
**Active Templates**: ~20 (down from 65+)