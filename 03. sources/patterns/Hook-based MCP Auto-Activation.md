---
title: Hook-based MCP Auto-Activation
type: note
permalink: patterns/hook-based-mcp-auto-activation
tags:
- hook
- pattern
- mcp
- automation
- configuration
extraction_status: pending
---

# Hook-based MCP Auto-Activation

## 패턴 개요

"mcp" 키워드 감지 시 tool-hub를 자동 활성화하는 Hook 기반 설정 패턴.

- [mcp keyword] [triggers] [tool-hub activation]
- [hook pattern] [enables] [context-aware loader selection]

## 구현 방식

Claude Code의 Hook 시스템을 활용:
- `UserPromptSubmit` 또는 `PreToolUse` 이벤트 감지
- 키워드 매칭으로 관련 도구 자동 로드
- 수동 설정 없이 지능적 도구 선택

## 설정 예시

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "mcp|MCP|도구|tool",
        "action": "toolhub_search"
      }
    ]
  }
}
```

## 장점

1. **자동화**: 사용자가 명시적으로 도구를 지정할 필요 없음
2. **맥락 인식**: 대화 흐름에 따라 적절한 도구 제안
3. **토큰 절약**: 필요할 때만 도구 정보 로드

- [automatic activation] [reduces] [manual configuration burden]
- [keyword detection] [improves] [user experience]

---

*Promoted from claude-mem: #1135 (2026-01-06)*

## Observations

- [pattern] Hook 시스템으로 키워드 기반 도구 자동 활성화 구현 가능 #hook #automation
- [tech] UserPromptSubmit/PreToolUse 이벤트를 활용한 컨텍스트 인식 #mcp #event-driven
- [solution] 정규식 matcher로 다국어 키워드 감지 (mcp|MCP|도구|tool) #i18n #regex
- [tip] 토큰 절약을 위해 필요할 때만 도구 정보 로드하는 lazy loading 패턴 #token-optimization
