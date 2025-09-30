---
description: Validate module/feature meets all quality requirements before progression
argument-hint: --target=platform|module|feature [--module=name] [--feature=name] [--force]
---

# Validation Command

Quality gate to ensure **$ARGUMENTS.target** meets all requirements before allowing progression.

## 🔥 MANDATORY: Working-First Validator Integration

```
Load helper: helpers/working-first-validator
Load helper: helpers/mcp-playwright-detector

IF NOT working_first_validator.is_active():
  ERROR: "Working-First Validator must be active for validation"
  EXIT with code 1
```

## Validation Criteria

### Module Validation Checklist

For a module to be validated, ALL must pass:

1. ✅ **Specification complete** - All specification files exist
2. ✅ **TDD tests passing** - 100% of unit tests pass
3. ✅ **404 Detection** - ZERO 404 errors allowed (MANDATORY)
4. ✅ **Code coverage met** - Meets track threshold (60-90%)
5. ✅ **E2E tests passing** - 100% of E2E tests pass
6. ✅ **CRUD operations** - All CRUD operations working
7. ✅ **No open bugs** - All bugs closed
8. ✅ **Screenshots captured** - E2E screenshots exist
9. ✅ **Dependencies validated** - Required modules validated
10. ✅ **Documentation exists** - README and API docs

## Validation Process

### Step 1: Pre-validation Checks

```
/ccu:validate --target=module --module=auth

1. Load status.json
2. Check current phase
3. Verify development complete
4. Check dependency validation
```

### Step 2: Run Test Suite with Mandatory Gates

```python
# MANDATORY TEST GATE EXECUTION
test_passed = False
retry_count = 0

While retry_count < 3:
  Say: "🔍 Running test gate - Attempt {retry_count + 1} of 3"

  # Run test suite
  tests_results = {
    "404_detection": Execute 404-detection.spec.ts,
    "unit_tests": npm test modules/{module},
    "e2e_tests": npx playwright test,
    "crud_tests": Execute crud-operations.spec.ts,
    "coverage": npm test --coverage
  }

  # Check ALL tests pass
  If ALL tests pass 100%:
    test_passed = True
    Say: "✅ TEST GATE PASSED - All tests successful"
    Break

  Else:
    Say: "❌ TEST GATE FAILED - Attempt {retry_count + 1} of 3"
    List failed tests

    If retry_count < 2:
      Say: "🔧 Attempting to fix issues..."
      Fix identified issues
      retry_count += 1
    Else:
      ERROR: "❌ VALIDATION FAILED - Tests did not pass after 3 attempts"
      Say: "Module cannot be validated with failing tests"
      EXIT with code 1
```

### Step 3: 404 Detection Gate (MANDATORY)

```python
# ZERO TOLERANCE FOR 404 ERRORS
Say: "🔍 Running 404 detection gate..."

Execute: npx playwright test 404-detection.spec.ts

If ANY 404 errors detected:
  ERROR: "❌ 404 ERRORS DETECTED - ZERO TOLERANCE VIOLATED"
  List all 404 URLs
  Say: "Fix all 404 errors before validation can proceed"
  EXIT with code 1

Else:
  Say: "✅ No 404 errors detected"
```

### Step 4: Bug Verification

```
Check bugs in status.json:
- If bugs.open.length > 0: FAIL
- If bugs.in_progress.length > 0: FAIL
- All bugs must be in bugs.closed[]
```

### Step 5: Coverage Verification

```
Track thresholds:
- INSTANT: 60% minimum
- RAPID: 70% minimum
- STANDARD: 80% minimum
- ENTERPRISE: 90% minimum

If coverage < threshold: FAIL
```

### Step 6: Documentation Check

```
Verify files exist:
- README.md in module folder
- API documentation if applicable
- Test documentation
```

### Step 7: Update Status

```
If all checks pass:
- Set validation.validated = true
- Set phase = "validated"
- Record validation timestamp
- Update blockers for dependent modules
```

## Validation Output

### Successful Validation

```
/ccu:validate --target=module --module=auth

🔍 Validating auth module...

✅ Specification complete
✅ 404 Detection: ZERO errors found
✅ TDD Tests: 25/25 passing (100%)
✅ Code Coverage: 85% (threshold: 80%)
✅ E2E Tests: 8/8 passing (100%)
✅ CRUD Operations: All working
✅ Bugs: 0 open, 5 closed
✅ Screenshots: 8 captured
✅ Dependencies: All validated
✅ Documentation: Complete

🎉 VALIDATION SUCCESSFUL!

auth module is validated and complete.
Other modules can now depend on auth.

Next steps:
- Start next module: /ccu:develop --target=module --module=billing
- Or validate platform: /ccu:validate --target=platform
```

### Failed Validation

```
/ccu:validate --target=module --module=billing

🔍 Validating billing module...

✅ Specification complete
❌ 404 Detection: 3 errors found (ZERO TOLERANCE)
❌ TDD Tests: 18/20 passing (2 failing)
✅ Code Coverage: 82% (threshold: 80%)
❌ E2E Tests: 6/8 passing (2 failing)
❌ CRUD Operations: DELETE failing
❌ Bugs: 3 open, 2 closed
✅ Screenshots: 8 captured
✅ Dependencies: All validated
⚠️ Documentation: README missing

❌ VALIDATION FAILED!

Issues to fix:
1. ❌ CRITICAL: Fix 404 errors:
   - /api/billing/invoice (404)
   - /dashboard/subscriptions (404)
   - /static/icons/payment.svg (404)

2. Fix 2 failing TDD tests:
   - billing.service.test.ts: calculateTax()
   - subscription.test.ts: renewSubscription()

3. Fix 2 failing E2E tests:
   - checkout-flow.spec.ts
   - subscription-upgrade.spec.ts

4. Fix CRUD operation:
   - DELETE /api/billing/subscription failing

5. Close 3 open bugs:
   - BUG-007: Payment processing timeout
   - BUG-008: Tax calculation error
   - BUG-009: Subscription state mismatch

6. Add missing documentation:
   - Create README.md

Cannot proceed until all issues are resolved.
Fix issues and run validation again.
```

## Platform Validation

### Validate Entire Platform

```
/ccu:validate --target=platform

Validates:
1. All modules are validated
2. Integration tests pass
3. Platform-level E2E tests pass
4. No cross-module bugs
5. Deployment configuration valid
```

**Output:**
```
🔍 Validating platform...

Modules:
✅ auth - validated
✅ user-management - validated
✅ billing - validated
✅ dashboard - validated

Integration Tests:
✅ 15/15 passing

Platform E2E Tests:
✅ 12/12 passing

Cross-module Dependencies:
✅ All contracts satisfied

🎉 PLATFORM VALIDATION SUCCESSFUL!

Platform is ready for deployment.
All modules validated and integrated.

Next: /ccu:deploy --target=platform
```

## Force Validation

### ❌ DISABLED for Test Gates

```
/ccu:validate --target=module --module=auth --force

❌ ERROR: Force validation is DISABLED

Working-First Validator principle prohibits bypassing test gates.

Current issues MUST be fixed:
- Fix all 404 errors (ZERO tolerance)
- Fix all failing tests
- Close all bugs

The framework enforces 100% working software.
No exceptions. No workarounds.
```

**This ensures:**
- Every module works 100%
- No broken features shipped
- No technical debt accumulation
- Users get working software

## Status Updates

### Update status.json on validation:

```json
{
  "phase": "validated",
  "validation": {
    "validated": true,
    "validated_at": "2024-01-14T16:00:00Z",
    "validated_by": "ccu:validate",
    "validation_report": {
      "404_detection": "passed",
      "tdd_tests": "25/25",
      "e2e_tests": "8/8",
      "crud_operations": "all_working",
      "coverage": 85,
      "bugs_closed": 5,
      "checks_passed": 10,
      "checks_failed": 0
    }
  },
  "next_steps": {
    "immediate": "Next module ready to develop",
    "blocked_by": []
  }
}
```

## Validation Reports

### Generate Validation Report

```
/ccu:validate --target=module --module=auth --report

Generates: validation-report.md

# Validation Report: auth module
Date: 2024-01-14
Status: PASSED

## Test Results
- Unit Tests: 25/25 (100%)
- E2E Tests: 8/8 (100%)
- Coverage: 85%

## Bug History
- Total Found: 5
- Total Fixed: 5
- Average Fix Time: 1.2 days

## Performance Metrics
- Build Time: 12s
- Test Execution: 45s
- Bundle Size: 234KB

## Dependencies
- Validated: 0 (no dependencies)
- Dependents: 3 (billing, dashboard, user-management)
```

## Error Handling

**Module not found:**
```
ERROR: Module 'unknown' not found
Available modules:
- auth
- billing
- dashboard
- user-management
```

**Development not complete:**
```
ERROR: Cannot validate - development not complete

Current phase: development
TDD tests: 15/20 passing

Complete development first:
/ccu:develop --target=module --module=auth
```

**Dependencies not validated:**
```
ERROR: Cannot validate - dependencies not validated

billing module depends on:
- auth: ❌ Not validated
- user-management: ❌ Not validated

Validate dependencies first:
/ccu:validate --target=module --module=auth
/ccu:validate --target=module --module=user-management
```

## Validation Workflow

### Sequential Module Validation

```
1. Develop auth module
2. Validate auth → ✅
3. Develop user-management (depends on auth)
4. Validate user-management → ✅
5. Develop billing (depends on both)
6. Validate billing → ✅
7. Develop dashboard (depends on all)
8. Validate dashboard → ✅
9. Validate platform → ✅
```

### Validation Gates

Each module must be validated before:
- Starting dependent modules
- Running integration tests
- Deploying to staging
- Proceeding to production

### 🔥 MANDATORY Test Gate Requirements

```python
For EVERY validation:
  1. Run 404 detection → Must be ZERO
  2. Run unit tests → Must be 100%
  3. Run E2E tests → Must be 100%
  4. Run CRUD tests → Must be 100%
  5. Check coverage → Must meet threshold

If ANY test fails:
  Retry up to 3 times with fixes
  If still failing after 3 attempts:
    STOP - Cannot proceed
```

## Output Messages

**Ready for next module:**
```
✅ auth module validated!

Unlocked for development:
- user-management (depends on auth)
- notification (depends on auth)

Start next module:
/ccu:specify --target=module --module=user-management
```

**All modules validated:**
```
🎉 All modules validated!

Platform Summary:
- Modules: 4/4 validated
- Total Tests: 120 passing
- Total Bugs Fixed: 18
- Average Coverage: 86%

Platform ready for final validation:
/ccu:validate --target=platform
```

**Validation blocked:**
```
⚠️ Validation blocked

Cannot validate billing until:
1. Fix 3 failing tests
2. Close 2 open bugs
3. Increase coverage from 68% to 80%

Current blockers prevent progression.
```

---

## 🚨 CRITICAL VALIDATION PRINCIPLES

### The Working-First Validator Mandate

1. **ZERO 404 TOLERANCE**: Not a single 404 error is acceptable
2. **100% TEST PASSAGE**: All tests must pass, no exceptions
3. **NO FORCE FLAGS**: Cannot bypass validation gates
4. **FIX-RETRY LOOPS**: Maximum 3 attempts to fix issues
5. **HARD STOPS**: Validation fails completely if tests don't pass

### Why This Matters

- **Users get working software**: Every validated module works 100%
- **No accumulating debt**: Issues fixed immediately, not later
- **Predictable quality**: Same standards across all tracks
- **Confidence in deployment**: Validated = Production-ready

Remember: Validation is the quality gate - it ensures each piece is production-ready before moving forward!