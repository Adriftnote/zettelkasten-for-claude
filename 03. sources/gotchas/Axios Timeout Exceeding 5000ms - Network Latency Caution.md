---
title: Axios Timeout Exceeding 5000ms - Network Latency Caution
type: note
permalink: gotchas/axios-timeout-5000ms-network-latency-caution
tags:
- network
- axios
- timeout
- claude-code
- gotcha
extraction_status: pending
---

# Axios Timeout Exceeding 5000ms - Network Latency Caution

## Observation

Claude Code CLI의 Anthropic API 호출 시 `AxiosError: timeout of 5000ms exceeded` 에러 발생.

### Symptoms
- Error: `AxiosError: AxiosError: timeout of 5000ms exceeded`
- Environment: Windows, Claude Code CLI (npm)
- Frequency: One-time (2025-12-26T05:10:45)
- Occurred during Hook processing (Debug log shows Hook matcher active)

### Root Cause
1. **Axios HTTP Timeout**: API response not received within 5 seconds
2. **Possible Causes**:
   - Network latency (ISP, proxy, VPN)
   - Anthropic API server response delay
   - Additional network requests during Hook execution causing time exceedance

### Technical Analysis
```
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 unique hooks for query "Bash" (1 before deduplication)
[DEBUG] Hooks: Checking initial response for async: {}
[DEBUG] Successfully parsed and validated hook JSON output
```
Hook processing was in progress, so additional API calls or processing in the Hook may have exceeded the basic 5-second timeout.

## Gotcha Points (Cautions)

### DON'T
- ❌ Treat one-time timeout as serious failure
- ❌ Retry infinitely when timeout occurs
- ❌ Assume default 5-second timeout is appropriate for all situations

### DO
- ✅ Set longer timeout for complex requests (Hook included) - 10~30 seconds
- ✅ Retry with exponential backoff
- ✅ Check network status beforehand (ping, tracert)
- ✅ Ensure timeout margin when additional processing is involved

## Solutions

### 1. Adjust Timeout Value
```javascript
// Increase timeout in Claude Code settings
const config = {
  timeout: 30000, // Increase to 30 seconds
};
```

### 2. Retry Logic
```javascript
const axiosRetry = require('axios-retry');
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => 
    error.code === 'ECONNABORTED' || error.message.includes('timeout')
});
```

### 3. Network Environment Optimization
- Test VPN/proxy bypass
- Use direct connection
- Ensure stable internet connection

### 4. Hook Optimization
- Review Hook configuration: `claude config get hooks`
- Disable or optimize problematic Hooks

## Prevention Measures
1. Timeout monitoring: Track frequency/patterns
2. Configuration optimization:
   ```json
   {
     "timeout": {
       "default": 10000,
       "streaming": 60000,
       "hook": 15000
     }
   }
   ```
3. Network environment improvement

## Relations
- Related: Streaming Timeout (API Streaming Request Timeout)
- Category: Network Errors
- Severity: Medium

## Observations
- [bug] Axios timeout of 5000ms exceeded during Claude Code API calls with Hook processing active #axios #timeout #network
- [cause] 5-second default timeout insufficient for Hook processing with additional API calls #performance #configuration
- [solution] Increase timeout to 10-30 seconds for complex requests involving Hooks #retry #timeout-tuning
- [warning] One-time timeout errors should not trigger infinite retry loops #error-handling #backoff
- [pattern] Network latency issues often coincide with VPN/proxy usage or Hook execution #debugging #network-optimization