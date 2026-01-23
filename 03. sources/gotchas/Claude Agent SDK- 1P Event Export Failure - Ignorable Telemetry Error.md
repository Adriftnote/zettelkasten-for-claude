---
title: 'Claude Agent SDK: 1P Event Export Failure - Ignorable Telemetry Error'
type: note
permalink: gotchas/claude-agent-sdk-1p-event-export-failure-telemetry
tags:
- claude-agent-sdk
- telemetry
- network-error
- sdk-error
extraction_status: pending
---

# Claude Agent SDK: 1P Event Export Failure

## Overview
Claude Agent SDK internal telemetry events fail to send to Anthropic servers. **No impact on core SDK functionality.**

## Symptoms
```
Error: 1P event logging: N events failed to export
    at Pj1.queueFailedEvents (cli.js:201:90771)
    at Pj1.doExport (cli.js:201:89870)
```

## Root Cause
Claude Agent SDK internally collects 1P (First-Party) telemetry and transmits to Anthropic servers:

1. **Temporary Network Failure** - Connection failure to Anthropic telemetry endpoint
2. **API Rate Limiting** - Rate limits applied when sending large volumes of events
3. **Firewall/Proxy** - Enterprise networks blocking telemetry endpoint
4. **Timing Issue** - Events not yet transmitted at SDK shutdown

**Important**: Telemetry failure = Anthropic internal analysis data loss only. Agent operation unaffected.

## Impact Analysis

| Item | Impact |
|------|--------|
| Agent Execution | None |
| API Calls | None |
| Response Quality | None |
| Anthropic Internal Analytics | Data Loss |

## Recommended Actions

**Immediate:**
```bash
# Check network connection
ping api.anthropic.com

# SDK restart (often resolves temporary errors)
```

**Persistent Issues:**
```bash
npm update @anthropic-ai/claude-agent-sdk
rm -rf node_modules && npm install
```

## Learning (DO/DON'T)

### DON'T
- Stop work because of this error
- Suspect entire SDK due to telemetry error and perform unnecessary reinstalls
- Treat telemetry errors as critical failures in production

### DO
- Treat telemetry errors as INFO/WARNING level, not critical
- Check network environment (VPN, proxy, firewall)
- Consider SDK version update if errors persist
- **Distinguish between core functionality errors and auxiliary feature errors**

## Occurrence History
- 2025-12-26 01:38 UTC - 32 events failed (claude-agent-swarm)
- 2025-12-26 05:26 UTC - 20 events failed (claude-agent-swarm)

## Relations
- Related: Claude Code CLI Undefined Map Error
- SDK: @anthropic-ai/claude-agent-sdk

## Observations
- [fact] 1P event export failures are telemetry-only errors with no impact on Agent SDK core functionality #telemetry #non-critical
- [warning] Do not stop work or suspect entire SDK due to telemetry errors #error-handling #severity
- [cause] Telemetry failures caused by network issues, rate limiting, or firewall blocking Anthropic endpoints #network #firewall
- [solution] Treat telemetry errors as INFO/WARNING level, not critical failures #logging #error-classification
- [tip] Distinguish between core functionality errors and auxiliary feature errors in SDK #debugging #prioritization