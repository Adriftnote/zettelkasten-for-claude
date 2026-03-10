---
title: Lessons from Building Claude Code - Prompt Caching Is Everything
type: guide
permalink: sources/reference/claude-code-prompt-caching-lessons
tags:
- prompt-caching
- claude-code
- agent-architecture
- optimization
- cost-reduction
date: 2026-02-23
---

# Lessons from Building Claude Code: Prompt Caching Is Everything

Thariq(@trq212, Anthropic Claude Code 팀)이 공유한 Claude Code의 프롬프트 캐싱 설계 원칙과 실전 교훈.

## 📖 핵심 아이디어

프롬프트 캐싱은 **prefix matching** 방식으로 작동한다. 요청 시작부터 cache_control 브레이크포인트까지를 캐시하므로, 프롬프트 내 요소의 **배치 순서**가 결정적으로 중요하다. Claude Code는 처음부터 이 제약을 중심으로 전체 시스템을 설계했으며, 캐시 히트율을 uptime처럼 모니터링하고 낮으면 SEV를 선언한다.

## 🛠️ 핵심 교훈 7가지

### 1. 프롬프트 배치 순서: 정적 → 동적

```
① Static system prompt & Tools  (전역 캐시)
② CLAUDE.md                     (프로젝트 내 캐시)
③ Session context               (세션 내 캐시)
④ Conversation messages          (매 턴 변경)
```

깨지기 쉬운 예: 시스템 프롬프트에 타임스탬프, 도구 순서 셔플, 도구 파라미터 동적 변경

### 2. 업데이트는 메시지로 전달

시스템 프롬프트를 수정하면 캐시 미스 발생. 대신 다음 턴의 user message에 `<system-reminder>` 태그로 업데이트 정보를 삽입.

### 3. 세션 중 모델 변경 금지

캐시는 모델별로 고유. 100k 토큰 대화 중 Opus→Haiku 전환 시 Haiku용 캐시를 처음부터 다시 구축해야 하므로 오히려 더 비쌈. 모델 전환이 필요하면 **subagent**로 핸드오프 (예: Explore 에이전트에 Haiku 사용).

### 4. 세션 중 도구 추가/제거 금지

도구는 cached prefix의 일부. 도구 변경 = 전체 대화의 캐시 무효화.

### 5. Plan Mode: 캐시 중심 설계

직관적 접근(plan 모드 시 읽기 전용 도구만 제공)은 캐시를 깨뜨림. 대신 **EnterPlanMode/ExitPlanMode를 도구 자체로** 정의하고, 도구 세트는 항상 동일하게 유지. 보너스: 모델이 어려운 문제를 감지하면 스스로 plan mode 진입 가능.

### 6. Tool Search: 제거 대신 지연 로딩

MCP 도구가 수십 개일 때 전부 포함하면 비용↑, 제거하면 캐시↓. 해결: **defer_loading** — 경량 스텁(이름만)을 항상 포함하고, 모델이 ToolSearch로 필요한 도구를 선택하면 그때 전체 스키마 로드.

### 7. Compaction: 캐시 안전 포킹

컨텍스트 윈도우 소진 시 대화를 요약(compaction). 단순 구현(별도 시스템 프롬프트+도구 없음)은 캐시 전혀 재사용 불가.

**해결**: 부모 대화와 동일한 system prompt, context, tools, messages를 유지하고, compaction 프롬프트만 마지막 user message로 추가. 이렇게 하면 부모의 cached prefix를 그대로 재사용. "compaction buffer"를 미리 확보해야 함.

## 🔧 실전 적용 체크리스트

| 원칙 | 실천 |
|------|------|
| 정적 먼저, 동적 나중에 | system prompt → tools → CLAUDE.md → messages 순서 고정 |
| 시스템 프롬프트 변경 금지 | `<system-reminder>`로 메시지에 삽입 |
| 모델/도구 세트 불변 | subagent로 모델 전환, defer_loading으로 도구 관리 |
| 상태 전환은 도구로 | plan mode 등 모드 전환을 도구 호출로 구현 |
| 캐시 히트율 모니터링 | uptime처럼 알림 설정, 낮으면 SEV 대응 |
| 포크 시 prefix 공유 | compaction/summarization에 부모와 동일 파라미터 사용 |

## 💡 실용적 평가 / 적용

**우리 환경에의 시사점:**
- CLAUDE.md를 세션 중 수정하면 다음 턴에서 캐시 무효화됨 (ishan의 댓글에서 확인)
- MCP 도구를 세션 중 추가하면 캐시 깨짐 (Kerem Nalbant 댓글)
- Agent Teams에서 subagent 위임 시 모델 전환이 캐시 관점에서도 합리적
- Compaction은 API에 내장되어 있으므로 직접 구현 불필요

**한계:**
- 캐시 TTL 5분 — 사용자가 느리게 작업하면 자연 만료
- prefix matching이므로 중간 삽입/수정에 취약

## 🔗 관련 개념

- [[컨텍스트 엔지니어링 (Context Engineering)]] - 프롬프트 캐싱은 컨텍스트 엔지니어링의 핵심 요소
- [[Claude Code]] - 이 글의 대상 제품
- [[메모리 시스템 (Memory Systems)]] - compaction은 메모리 시스템의 일종

---

**작성일**: 2026-02-23
**분류**: agent-architecture / optimization
**출처**: https://x.com/trq212/status/2024574133011673516