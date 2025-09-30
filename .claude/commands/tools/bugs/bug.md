---
description: Create, track, and resolve bugs found during testing
argument-hint: --action=create|list|fix|close --target=module|feature [--module=name] [--feature=name] [--id=BUG-XXX] [--test=test-name]
---

# Bug Management Command

Manage bugs for **$ARGUMENTS.target** with screenshots, tracking, and resolution workflow.

## Bug Actions

### Create Bug

**Create bug report from test failure:**

```
/ccu:bug --action=create --target=module --module=auth --test=login-flow

Actions:
1. Create bug folder: ccu_workspace/modules/auth/04-bugs/BUG-001/
2. Capture screenshot from latest test run
3. Generate bug report from test output
4. Update status.json with new bug
5. Create bug.md with details
```

**Bug folder structure:**
```
04-bugs/BUG-001/
├── bug.md                    # Bug description and details
├── screenshot-failure.png    # Screenshot showing the issue
├── test-output.log          # Test failure output
├── expected-behavior.md     # What should happen
├── actual-behavior.md       # What actually happened
├── steps-to-reproduce.md    # How to reproduce
└── fix-notes.md            # Developer notes during fixing
```

**Generated bug.md template:**
```markdown
# BUG-001: [Test Name] Failure

**Module**: auth
**Feature**: login
**Test**: login-flow.spec.ts
**Created**: 2024-01-14T10:30:00Z
**Status**: OPEN
**Severity**: HIGH|MEDIUM|LOW
**Assigned**: unassigned

## Summary
[Auto-generated from test failure message]

## Test Failure
```
[Test output showing the failure]
```

## Expected Behavior
[From test assertion]

## Actual Behavior
[What happened instead]

## Steps to Reproduce
1. [From test steps]
2. ...

## Screenshot
![Failure Screenshot](screenshot-failure.png)

## Environment
- Node version: [version]
- Browser: [from Playwright]
- OS: [system info]

## Fix Attempts
- [ ] Attempt 1: [description]
- [ ] Attempt 2: [description]

## Resolution
[To be filled when fixed]
```

### List Bugs

**Show all bugs for a module:**

```
/ccu:bug --action=list --target=module --module=auth

Output:
📋 Bugs for auth module:

OPEN (2):
- BUG-001: Login fails with special characters (HIGH)
  Created: 2024-01-14, Test: login-flow.spec.ts

- BUG-003: Session timeout not handled (MEDIUM)
  Created: 2024-01-14, Test: session.spec.ts

IN PROGRESS (1):
- BUG-002: MFA setup incomplete (HIGH)
  Created: 2024-01-13, Assigned: developer

CLOSED (3):
- BUG-004: ✅ Password reset email not sent
- BUG-005: ✅ Invalid token handling
- BUG-006: ✅ Rate limiting not applied

Summary: 2 open, 1 in progress, 3 closed
```

### Fix Bug

**Mark bug as being worked on:**

```
/ccu:bug --action=fix --target=module --module=auth --id=BUG-001

Actions:
1. Update bug status to IN_PROGRESS
2. Add timestamp to fix-notes.md
3. Update status.json
4. Show bug details and test command
```

**Output:**
```
🔧 Working on BUG-001

Bug: Login fails with special characters
Test: login-flow.spec.ts
Screenshot: 04-bugs/BUG-001/screenshot-failure.png

To reproduce:
1. Run: /ccu:test --type=e2e --target=module --module=auth --headed
2. Watch test: login-flow.spec.ts

Fix in: src/modules/auth/login/
Add regression test to prevent recurrence.

When fixed, run:
/ccu:bug --action=close --target=module --module=auth --id=BUG-001
```

### Close Bug

**Verify fix and close bug:**

```
/ccu:bug --action=close --target=module --module=auth --id=BUG-001

Actions:
1. Run the failing test to verify it passes
2. If test passes:
   - Update bug status to CLOSED
   - Add resolution notes
   - Move from open to closed in status.json
   - Capture "fixed" screenshot
3. If test still fails:
   - Keep bug open
   - Show error
```

**Verification process:**
```
🔍 Verifying fix for BUG-001...

Running test: login-flow.spec.ts
✅ Test now passing!

Capturing success screenshot...
Updating bug status to CLOSED

Resolution added:
- Fixed by: Escaping special characters in login handler
- Regression test added: login.service.test.ts
- Verified on: 2024-01-14T15:30:00Z

Bug closed successfully!
```

## Bug Workflow

### Automatic Bug Creation

When E2E tests fail during development:

```
1. Test fails → Screenshot captured
2. Bug automatically created
3. Added to status.json bugs.open[]
4. Developer notified

Example:
"❌ E2E test failed: login-flow
Bug created: BUG-001
Screenshot: 04-bugs/BUG-001/screenshot-failure.png"
```

### Bug Fix Cycle

```
┌─────────────────────────────────────┐
│ 1. Bug created from test failure    │
│                                      │
│ 2. Developer reviews bug:            │
│    /ccu:bug --action=list           │
│                                      │
│ 3. Start fixing:                     │
│    /ccu:bug --action=fix --id=BUG-X │
│                                      │
│ 4. Fix implementation in src/        │
│                                      │
│ 5. Add regression test               │
│                                      │
│ 6. Run tests to verify:              │
│    /ccu:test --type=e2e              │
│                                      │
│ 7. Close bug if fixed:               │
│    /ccu:bug --action=close --id=X   │
│                                      │
│ 8. If not fixed, return to step 4   │
└─────────────────────────────────────┘
```

## Status Tracking

**Update status.json for all bug operations:**

```json
{
  "bugs": {
    "open": ["BUG-001", "BUG-003"],
    "in_progress": ["BUG-002"],
    "closed": ["BUG-004", "BUG-005", "BUG-006"],
    "total_found": 6,
    "total_fixed": 3,
    "last_bug_id": "BUG-006"
  }
}
```

## Bug Reports

### Generate Bug Summary

```
/ccu:bug --action=report --target=module --module=auth

Generates bug report:

# Bug Report: auth module
Generated: 2024-01-14

## Open Bugs (2)
1. BUG-001: Login fails with special characters
   - Severity: HIGH
   - Days open: 2
   - Screenshot: Available

2. BUG-003: Session timeout not handled
   - Severity: MEDIUM
   - Days open: 1
   - Screenshot: Available

## Fixed This Week (3)
- BUG-004: Password reset email
- BUG-005: Token handling
- BUG-006: Rate limiting

## Metrics
- Average fix time: 1.5 days
- Bug discovery rate: 2 per module
- Test coverage impact: 85% → 92%
```

## Integration with Screenshots

### Screenshot Management

E2E test failures automatically capture screenshots:

```
03-e2e-tests/screenshots/
├── failures/
│   ├── login-flow-failure-2024-01-14.png
│   └── mfa-setup-failure-2024-01-14.png
└── success/
    ├── login-flow-success-2024-01-14.png
    └── mfa-setup-success-2024-01-14.png
```

Bug command copies failure screenshot to bug folder:
```
cp 03-e2e-tests/screenshots/failures/login-flow-failure.png \
   04-bugs/BUG-001/screenshot-failure.png
```

## Error Handling

**No bugs found:**
```
✅ No bugs found for $ARGUMENTS.module
All tests are passing!
```

**Bug already closed:**
```
ERROR: BUG-001 is already closed
Status: CLOSED
Closed on: 2024-01-13
Resolution: Fixed in commit abc123
```

**Test still failing:**
```
ERROR: Cannot close BUG-001
Test still failing: login-flow.spec.ts

Please fix the issue first:
1. Review the test failure
2. Fix the implementation
3. Run test again
4. Then close the bug
```

**Invalid bug ID:**
```
ERROR: Bug BUG-999 not found
Available bugs for auth module:
- BUG-001 (OPEN)
- BUG-002 (IN_PROGRESS)
- BUG-003 (OPEN)
```

## Output Messages

**Bug created:**
```
🐛 Bug created: BUG-001

Title: Login fails with special characters
Module: auth
Test: login-flow.spec.ts
Screenshot: Captured
Status: OPEN

View details: 04-bugs/BUG-001/bug.md
Fix with: /ccu:bug --action=fix --id=BUG-001
```

**All bugs fixed:**
```
✅ All bugs fixed for $ARGUMENTS.module!

Total bugs found: 5
Total bugs fixed: 5
All tests passing

Ready for validation:
/ccu:validate --target=module --module=$ARGUMENTS.module
```

**Bugs blocking validation:**
```
⚠️ Cannot validate - open bugs exist

Open bugs: 2
- BUG-001: Login special characters
- BUG-003: Session timeout

Fix all bugs before validation.
Start with: /ccu:bug --action=fix --id=BUG-001
```

---

Remember: Every bug must be tracked, fixed, and verified before validation!