# Threat Model Template - STRIDE Analysis

## System Overview
**System Name**: {{SYSTEM_NAME}}
**Version**: {{VERSION}}
**Date**: {{DATE}}
**Classification**: {{PUBLIC|INTERNAL|CONFIDENTIAL|SECRET}}

## Architecture Context

### System Boundaries
```
┌─────────────────────────────────────────────────────────┐
│                   Trust Boundary                        │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐     │
│  │  Web App │ ───> │   API    │ ───> │ Database │     │
│  └──────────┘      └──────────┘      └──────────┘     │
│       ↑                  ↑                  ↑          │
│       │                  │                  │          │
└───────┼──────────────────┼──────────────────┼──────────┘
        │                  │                  │
    [Users]          [External API]      [Admin]
```

### Data Flow Diagram
```
1. User Authentication Flow
   User → Login Form → API → Auth Service → Database

2. Data Processing Flow
   User → Upload → Validation → Processing → Storage

3. Admin Flow
   Admin → Dashboard → API → Database → Audit Log
```

## STRIDE Analysis

### S - Spoofing Identity

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| Stolen credentials | Login | High | High | Critical | MFA, rate limiting |
| Session hijacking | API | Medium | High | High | Secure cookies, HTTPS |
| API key theft | External API | Medium | Medium | Medium | Key rotation, vault |

### T - Tampering with Data

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| SQL injection | Database | Low | Critical | High | Parameterized queries |
| XSS attacks | Web App | Medium | Medium | Medium | Input sanitization |
| Man-in-middle | Network | Low | High | Medium | TLS/SSL, cert pinning |

### R - Repudiation

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| Audit log tampering | Logging | Low | High | Medium | Immutable logs |
| Transaction denial | Payment | Low | High | Medium | Digital signatures |
| Action denial | Admin | Low | Medium | Low | Comprehensive logging |

### I - Information Disclosure

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| Database breach | Database | Low | Critical | High | Encryption at rest |
| API data leak | API | Medium | High | High | Rate limiting, auth |
| Error messages | All | High | Low | Medium | Generic errors |
| Log exposure | Logs | Medium | Medium | Medium | Log sanitization |

### D - Denial of Service

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| DDoS attack | Web App | Medium | High | High | CDN, rate limiting |
| Resource exhaustion | API | Medium | Medium | Medium | Throttling, quotas |
| Database overload | Database | Low | High | Medium | Query optimization |

### E - Elevation of Privilege

| Threat | Component | Likelihood | Impact | Risk | Mitigation |
|--------|-----------|------------|--------|------|------------|
| Privilege escalation | Auth | Low | Critical | High | RBAC, least privilege |
| Admin access | Admin panel | Low | Critical | High | MFA, IP whitelist |
| API abuse | API | Medium | High | High | Scoped permissions |

## Risk Matrix

```
         Impact
    Low  Medium  High  Critical
Low  [L]   [L]   [M]    [H]
Medium[L]   [M]   [H]    [C]
High [M]   [H]   [C]    [C]
```

- L: Low Risk (Accept)
- M: Medium Risk (Monitor)
- H: High Risk (Mitigate)
- C: Critical Risk (Eliminate)

## Security Controls

### Preventive Controls
- [ ] Input validation
- [ ] Authentication (MFA)
- [ ] Authorization (RBAC)
- [ ] Encryption (TLS/SSL)
- [ ] Secure coding practices
- [ ] Security headers

### Detective Controls
- [ ] Logging and monitoring
- [ ] Intrusion detection
- [ ] File integrity monitoring
- [ ] Anomaly detection
- [ ] Security scanning

### Corrective Controls
- [ ] Incident response plan
- [ ] Backup and recovery
- [ ] Patch management
- [ ] Rollback procedures
- [ ] Security updates

## Attack Trees

### Authentication Bypass
```
Goal: Bypass Authentication
├── Brute Force
│   ├── Dictionary Attack
│   └── Credential Stuffing
├── Social Engineering
│   ├── Phishing
│   └── Pretexting
└── Technical Exploit
    ├── Session Fixation
    └── Token Manipulation
```

## Security Requirements

### Authentication
- Multi-factor authentication for admin accounts
- Password complexity requirements
- Account lockout after failed attempts
- Session timeout after inactivity

### Authorization
- Role-based access control (RBAC)
- Principle of least privilege
- Regular permission audits
- Segregation of duties

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3+)
- Key management system
- Data classification and handling

### Audit & Compliance
- Comprehensive audit logging
- Log retention policy
- Regular security assessments
- Compliance reporting (GDPR, HIPAA, etc.)

## Recommendations

### Critical (Implement Immediately)
1. {{CRITICAL_RECOMMENDATION}}
2. {{CRITICAL_RECOMMENDATION}}

### High Priority (Within 30 days)
1. {{HIGH_PRIORITY_RECOMMENDATION}}
2. {{HIGH_PRIORITY_RECOMMENDATION}}

### Medium Priority (Within 90 days)
1. {{MEDIUM_PRIORITY_RECOMMENDATION}}
2. {{MEDIUM_PRIORITY_RECOMMENDATION}}

### Low Priority (Planned)
1. {{LOW_PRIORITY_RECOMMENDATION}}
2. {{LOW_PRIORITY_RECOMMENDATION}}

## Appendix

### Assets Inventory
| Asset | Type | Classification | Owner |
|-------|------|----------------|-------|
| User Data | Data | Confidential | DPO |
| API Keys | Credential | Secret | DevOps |
| Source Code | IP | Internal | Engineering |

### Threat Actors
| Actor | Motivation | Capability | Intent |
|-------|------------|------------|--------|
| Script Kiddie | Fame | Low | Disruption |
| Hacktivist | Ideology | Medium | Exposure |
| Cybercriminal | Financial | High | Theft |
| Nation State | Espionage | Very High | APT |

### References
- OWASP Top 10
- NIST Cybersecurity Framework
- ISO 27001/27002
- CIS Controls