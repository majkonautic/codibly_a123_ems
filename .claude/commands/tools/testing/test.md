---
description: Run TDD, E2E, or integration tests for any target with reporting
argument-hint: --type=unit|e2e|integration --target=platform|module|feature [--module=name] [--feature=name] [--ui] [--watch]
---

# Test Command

Run tests for **$ARGUMENTS.target** with comprehensive reporting and screenshot capture.

## Pre-execution Validation

1. **Validate target exists:**
   - Platform: Check `ccu_workspace/platform/`
   - Module: Check `ccu_workspace/modules/$ARGUMENTS.module/`
   - Feature: Check `ccu_workspace/modules/$ARGUMENTS.module/features/$ARGUMENTS.feature/`

2. **Check test type availability:**
   - Unit tests: Check for `src/` directory
   - E2E tests: Check for `03-e2e-tests/` directory
   - Integration tests: Check for multiple modules

3. **Load status.json:**
   - Get current test statistics
   - Check phase (development/testing/validation)

## Test Types

### Unit Tests (TDD)

**Run unit tests in src/ directory:**

```
/ccu:test --type=unit --target=module --module=auth

Actions:
1. Change to project root
2. Run: npm test modules/auth
3. If --watch: npm test --watch modules/auth
4. If --coverage: npm test --coverage
5. Update status.json with results
```

**Output format:**
```
🧪 Running unit tests for auth module...

PASS  src/modules/auth/auth.service.test.ts (12 tests)
PASS  src/modules/auth/auth.controller.test.ts (8 tests)

Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
Coverage:    85% statements, 78% branches

✅ All unit tests passing!
```

### E2E Tests (Playwright)

**Run E2E tests with Playwright:**

```
/ccu:test --type=e2e --target=module --module=auth

Actions:
1. Change to ccu_workspace/modules/auth/03-e2e-tests/
2. If not initialized: npx playwright install
3. Run tests based on options:
   - Default: npx playwright test
   - With --ui: npx playwright test --ui
   - With --debug: npx playwright test --debug
4. Capture screenshots to screenshots/
5. Generate HTML report
6. Update status.json with results
```

**Screenshot management:**
```
Screenshots saved to:
03-e2e-tests/screenshots/
├── 2024-01-14/
│   ├── login-success.png
│   ├── login-error.png
│   └── dashboard.png
```

**Output format:**
```
🎭 Running E2E tests for auth module...

Running 5 tests using 3 workers

  ✓ auth › login › successful login (2.1s)
  ✓ auth › login › handles invalid credentials (1.8s)
  ✓ auth › logout › clears session (1.2s)
  ✓ auth › mfa › setup flow (3.4s)
  ✗ auth › password-reset › email validation (2.9s)

  4 passed, 1 failed

Screenshots captured: 5
Report: 03-e2e-tests/reports/index.html

❌ 1 E2E test failing - bug report needed
Run: /ccu:bug --create --module=auth --test=password-reset
```

### Integration Tests

**Test module interactions:**

```
/ccu:test --type=integration --target=platform

Actions:
1. Run tests that span multiple modules
2. Test API endpoints
3. Test data flow between modules
4. Verify module contracts
```

**Output format:**
```
🔗 Running integration tests...

Testing module interactions:
✓ auth → user-management: User creation after signup
✓ auth → billing: Premium features access control
✗ billing → notifications: Payment failure alerts

2 passed, 1 failed

Integration issue detected between billing and notifications
```

## Options

### --ui (E2E only)
Opens Playwright UI mode for interactive debugging:
```
/ccu:test --type=e2e --target=module --module=auth --ui

Opens browser with:
- Test list
- Live test execution
- Time travel debugging
- DOM snapshots
```

### --watch (Unit tests only)
Runs tests in watch mode for TDD:
```
/ccu:test --type=unit --target=module --module=auth --watch

Watches for file changes and re-runs affected tests
Perfect for TDD development cycle
```

### --coverage (Unit tests only)
Generates coverage report:
```
/ccu:test --type=unit --target=module --module=auth --coverage

Generates:
- Console coverage summary
- HTML coverage report in coverage/
- Updates status.json with coverage percentage
```

### --headed (E2E only)
Runs E2E tests with visible browser:
```
/ccu:test --type=e2e --target=module --module=auth --headed

Shows browser windows during test execution
Useful for debugging test failures
```

### --reporter (E2E only)
Specify report format:
```
/ccu:test --type=e2e --target=module --module=auth --reporter=html,json

Available reporters:
- html: Interactive HTML report
- json: Machine-readable JSON
- junit: CI/CD compatible XML
- github: GitHub Actions annotations
```

## Test Reports

### HTML Report (E2E)
After E2E tests, view report:
```
Report generated: 03-e2e-tests/reports/index.html

To view: npx playwright show-report 03-e2e-tests/reports

Contains:
- Test results with timing
- Screenshots for each test
- Video recordings (if enabled)
- Trace files for debugging
```

### Coverage Report (Unit)
After unit tests with coverage:
```
Coverage report: coverage/lcov-report/index.html

Shows:
- Line coverage
- Branch coverage
- Function coverage
- Uncovered lines highlighted
```

## Status Updates

**Update status.json after each test run:**

```json
{
  "validation": {
    "development": {
      "tdd_tests": {
        "passing": 18,
        "failing": 2,
        "total": 20,
        "coverage": 85,
        "last_run": "2024-01-14T10:30:00Z"
      }
    },
    "testing": {
      "e2e_tests": {
        "passing": 4,
        "failing": 1,
        "total": 5,
        "screenshots": [
          "login-success.png",
          "login-error.png"
        ],
        "last_run": "2024-01-14T10:35:00Z"
      },
      "integration_tests": {
        "passing": 2,
        "failing": 1,
        "total": 3
      }
    }
  }
}
```

## Error Handling

**No tests found:**
```
ERROR: No unit tests found for $ARGUMENTS.module
Expected location: src/modules/$ARGUMENTS.module/**/*.test.ts

Create tests first with:
/ccu:develop --target=module --module=$ARGUMENTS.module
```

**E2E not initialized:**
```
ERROR: E2E tests not set up for $ARGUMENTS.module
Expected: ccu_workspace/modules/$ARGUMENTS.module/03-e2e-tests/

Initialize E2E tests:
/ccu:develop --target=module --module=$ARGUMENTS.module
```

**Playwright not installed:**
```
ERROR: Playwright browsers not installed

Installing browsers...
npx playwright install

This may take a few minutes on first run.
```

**Test failures:**
```
⚠️ Tests failing - cannot proceed to validation

Failed tests:
- auth.service.test.ts: 2 failures
- login.spec.ts: 1 failure

Fix failures before validation:
1. Review test output above
2. Fix implementation in src/
3. Run tests again
```

## Integration with Other Commands

### After test failures:
```
/ccu:bug --create --module=auth --test=login-flow
→ Creates bug report from test failure
```

### Before validation:
```
/ccu:test --type=unit --target=module --module=auth
/ccu:test --type=e2e --target=module --module=auth
→ Both must pass before /ccu:validate
```

### During development:
```
/ccu:test --type=unit --target=module --module=auth --watch
→ Keep running during TDD development
```

## Output Messages

**All tests passing:**
```
✅ All tests passing for $ARGUMENTS.module!

Unit Tests: 20/20 passing (85% coverage)
E2E Tests: 5/5 passing
Screenshots: 5 captured

Ready for validation!
Next: /ccu:validate --target=module --module=$ARGUMENTS.module
```

**Some tests failing:**
```
❌ Tests failing for $ARGUMENTS.module

Unit Tests: 18/20 passing
E2E Tests: 4/5 passing

Failed tests need attention:
- Fix unit test failures first
- Then fix E2E test failures
- Create bug reports if needed

Cannot proceed to validation until all tests pass.
```

---

Remember: Tests are the quality gates - they must pass before moving forward!