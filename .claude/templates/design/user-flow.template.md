# User Flow Template

## Flow: {{FLOW_NAME}}

### Overview
**Purpose**: {{FLOW_PURPOSE}}
**User Goal**: {{USER_GOAL}}
**Success Metric**: {{SUCCESS_METRIC}}

### Flow Diagram

```
┌──────────────┐
│  Entry Point │
│   ({{ENTRY}}) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Step 1     │
│  {{ACTION}}  │
└──────┬───────┘
       │
       ▼
   ◆ Decision ◆
   {{CONDITION}}
    ╱        ╲
   Yes        No
   ╱           ╲
  ▼             ▼
┌─────────┐  ┌─────────┐
│ Path A  │  │ Path B  │
│{{ACTION}}│  │{{ACTION}}│
└────┬────┘  └────┬────┘
     │            │
     └─────┬──────┘
           │
           ▼
    ┌──────────────┐
    │   Step N     │
    │  {{ACTION}}  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Success    │
    │   {{RESULT}} │
    └──────────────┘
```

### Detailed Steps

#### Step 1: {{STEP_NAME}}
**User Action**: {{USER_ACTION}}
**System Response**: {{SYSTEM_RESPONSE}}
**Validation**: {{VALIDATION_RULES}}
**Error Handling**: {{ERROR_CASES}}

#### Step 2: {{STEP_NAME}}
**User Action**: {{USER_ACTION}}
**System Response**: {{SYSTEM_RESPONSE}}
**Validation**: {{VALIDATION_RULES}}
**Error Handling**: {{ERROR_CASES}}

### Alternative Paths

#### Path A: {{PATH_NAME}}
**Trigger**: {{TRIGGER_CONDITION}}
**Steps**:
1. {{STEP}}
2. {{STEP}}
**Outcome**: {{OUTCOME}}

#### Path B: {{PATH_NAME}}
**Trigger**: {{TRIGGER_CONDITION}}
**Steps**:
1. {{STEP}}
2. {{STEP}}
**Outcome**: {{OUTCOME}}

### Error States

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| {{ERROR_TYPE}} | {{USER_MESSAGE}} | {{RECOVERY}} |
| {{ERROR_TYPE}} | {{USER_MESSAGE}} | {{RECOVERY}} |

### Success Criteria
- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}

### Metrics to Track
- {{METRIC_1}}: {{MEASUREMENT}}
- {{METRIC_2}}: {{MEASUREMENT}}
- {{METRIC_3}}: {{MEASUREMENT}}

### UI Components Required
- {{COMPONENT}}: {{PURPOSE}}
- {{COMPONENT}}: {{PURPOSE}}
- {{COMPONENT}}: {{PURPOSE}}

### API Endpoints
- `{{METHOD}} {{ENDPOINT}}`: {{DESCRIPTION}}
- `{{METHOD}} {{ENDPOINT}}`: {{DESCRIPTION}}

### Security Considerations
- {{SECURITY_REQUIREMENT}}
- {{SECURITY_REQUIREMENT}}

### Accessibility Requirements
- {{A11Y_REQUIREMENT}}
- {{A11Y_REQUIREMENT}}