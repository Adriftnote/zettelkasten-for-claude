---
title: Streaming Timeout Fallback - Graceful Degradation Pattern
type: note
permalink: patterns/streaming-timeout-fallback-graceful-degradation
tags:
- network
- streaming
- timeout
- fallback
- claude-code
- pattern
extraction_status: pending
---

# Streaming Timeout Fallback - Graceful Degradation Pattern

## Observation

Claude Code CLI shows `Error streaming, falling back to non-streaming mode: Request timed out.` error during streaming API request.

### Symptoms
- Error: `Error streaming, falling back to non-streaming mode: Request timed out.`
- Time: 2025-12-26T05:47:36.645Z
- Elapsed: ~10.6 seconds (from Hook search start to error)
- Impact: Minimal (auto fallback to non-streaming mode handles request)

## Pattern: Graceful Degradation

This error demonstrates **Claude Code's automatic fallback mechanism**.

### Auto Fallback Flow
```
1. Attempt API request in streaming mode
   ↓
2. Timeout occurs (streaming connection fails)
   ↓
3. Error log: "Error streaming, falling back..."
   ↓
4. Auto switch to non-streaming mode
   ↓
5. Retry request (normal processing)
```

## Root Cause Analysis

### Timing Analysis
```
2025-12-26T05:47:26.011Z [DEBUG] Getting matching hook commands...
2025-12-26T05:47:26.038Z [DEBUG] LSP Diagnostics: getLSPDiagnosticAttachments called
2025-12-26T05:47:36.645Z [ERROR] Error streaming, falling back...
```
- Hook search: 0 matches (no overhead)
- LSP Diagnostics: 0 pending (normal)
- **~10.6 seconds later** timeout occurs (streaming connection issue)

### Possible Causes
1. **Network Latency**: Delay reaching Anthropic API
2. **Server Load**: API server response delay
3. **Streaming Connection Issue**: WebSocket/SSE connection failure, proxy blocking

## Expected Behavior
```
From user perspective, request ultimately processes normally.
Real-time response not received via streaming,
but full response available via non-streaming mode.

Trade-off:
  - Streaming: Fast response start, can fail on network instability
  - Non-streaming: Slow response start, stable full response delivery
```

## Error Classification (Comparison)
| Error Type | Message | Impact | Severity |
|-----------|---------|--------|----------|
| Axios Timeout | `timeout of 5000ms exceeded` | Request complete failure | Medium |
| Request Aborted | `Request was aborted` | None (user abort) | Low |
| **Streaming Timeout** | **`falling back to non-streaming`** | **Minimal (auto fallback)** | **Low** |

## Solutions

### 1. Usually No Action Needed
This error **auto-recovers**, just wait.

### 2. Network Environment Check if Repeating
```bash
# Test network connection
ping api.anthropic.com

# Verify DNS response
nslookup api.anthropic.com

# Check network path
tracert api.anthropic.com
```

### 3. Environment Configuration Check
```bash
# Check proxy settings
echo %HTTP_PROXY%
echo %HTTPS_PROXY%

# Test direct connection if using VPN
# Disable VPN and retry
```

## Prevention: Adaptive Configuration
```json
{
  "streaming": {
    "enabled": true,
    "timeout": 15000,
    "fallback": {
      "enabled": true,
      "mode": "non-streaming"
    }
  }
}
```

## DO (Recommendations)
- ✅ Verify request processed normally after error
- ✅ Only check network environment if repeated
- ✅ Review full log context to assess actual impact
- ✅ Understand streaming vs non-streaming difference (response speed vs stability)

## DON'T (Don't worry about)
- ❌ Treat single streaming timeout as critical failure
- ❌ Misinterpret fallback message as fatal error
- ❌ Attempt immediate restart or reinstall

## Relations
- Axios Timeout Error: General timeout patterns (2026-01-09)
- Request Aborted Pattern: User abort patterns (2026-01-09)

## Observations

- [pattern] Streaming 실패 시 non-streaming 모드로 자동 전환하는 Graceful Degradation 패턴 #resilience #fallback
- [tech] Streaming은 빠른 응답 시작, non-streaming은 안정적인 전체 응답 전달 트레이드오프 #streaming #tradeoff
- [fact] ~10.6초 타임아웃 후 자동 fallback, 사용자 관점에서는 최종적으로 정상 처리됨 #timeout #auto-recovery
- [solution] 반복 발생 시 네트워크 환경 점검 (ping, DNS, proxy 설정) #troubleshooting #network
- [tip] 단일 streaming timeout은 치명적 오류가 아님, 자동 복구 메커니즘 신뢰 #best-practice