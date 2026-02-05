---
title: Claude Code StatusLine 컨텍스트 정확도 해결 사례 조사
type: workcase
permalink: sources/workcases/claude-code-statusline-context-analysis
tags:
- claude-code
- statusline
- context
- token-counting
---

# Claude Code StatusLine 컨텍스트 정확도 해결 사례

**Task ID**: task-20260129-010-a | **상태**: ✅ 완료

## 문제와 해결책

### 1. 핵심 버그 (GitHub #13783)

StatusLine의 `context_window` 필드가 **누적 세션 토큰**을 전송:
- 실제 컨텍스트: 80k/200k (40%)
- StatusLine 표시: 340k/200k (169%) ← 불가능

**원인**: `total_input_tokens` = 세션 전체 누적값, 현재값 아님

### 2. 공식 해결책 (v2.1+)

Claude Code v2.1부터 정확한 필드 제공:
```json
"context_window": {
  "used_percentage": 42.5,        // ✅ 정확한 사전계산
  "remaining_percentage": 57.5,
  "current_usage": {              // ✅ 현재값
    "input_tokens": 8500,
    "cache_creation_input_tokens": 5000,
    "cache_read_input_tokens": 2000
  }
}
```

**사용법**:
```bash
PERCENT=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
echo "Context: ${PERCENT}%"
```

### 3. 커뮤니티 워크어라운드

**v2.1 이전**:
- **levz0r/claude-code-statusline**: Transcript 파싱 (정확하지만 느림)
- **ccstatusline**: 동적 모델 감지 (중상 정확도)
- **manual calculation**: `current_usage` 필드 수동 계산

**계산식**:
```
current = input + cache_creation + cache_read
percent = (current / 200000) × 100
```

### 4. 해결 현황

| 버전 | 상태 | 권장 |
|------|------|------|
| v2.0.x | ❌ 버그 | Transcript 파싱 도구 사용 |
| v2.1+ | ✅ 수정 | 공식 `used_percentage` 사용 |

**결론**: v2.1로 업그레이드하면 정확도 문제 해결. 하위 버전은 커뮤니티 도구 활용.