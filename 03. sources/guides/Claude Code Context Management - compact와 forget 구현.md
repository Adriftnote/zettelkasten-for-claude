---
title: Claude Code Context Management - compact와 forget 구현
type: note
permalink: knowledge/guides/claude-code-context-management-compactwa-forget-guhyeon
tags:
- claude-code
- context-management
- compact
- forget
- context-engineering
extraction_status: pending
---

# Claude Code Context Management - compact와 forget 구현

Claude Code에서 컨텍스트를 관리하는 핵심 명령어와 `/forget` 구현 방법입니다.

## 📖 핵심 발견

> **`/compact`는 새 세션이 아니라, 같은 세션에서 컨텍스트만 교체한다**

## 🔧 `/compact` 동작 원리

### 세션과 컨텍스트

| 항목 | `/compact` 후 |
|------|--------------|
| **세션 ID** | 유지 (같은 세션) |
| **컨텍스트** | 요약본으로 교체 |
| **원본 이력** | transcript 파일에 저장 |
| **복원** | `/resume`으로 원본 복귀 가능 |

### 동작 흐름

```
Before /compact:
[msg1] [msg2] [msg3] ... [msg100]  ← 전체 이력 (토큰 많음)

After /compact:
[Summary: 핵심 내용 요약...]  ← 압축본 (토큰 적음)
```

- [observation:fact] 요약은 시스템 프롬프트가 아닌 컨텍스트 내에 직접 주입됨
- [observation:fact] 원본 대화는 transcript 파일에 보존됨
- [observation:fact] `/resume` 명령어로 압축 전 상태로 복귀 가능

### 선택적 압축 지시

```bash
/compact [optional instructions]
```

예시:
```bash
/compact Keep only authentication logic, remove debugging logs
/compact 에러 관련 내용 제외하고 핵심만 요약
```

- [observation:pattern] 지시사항을 주면 특정 내용만 유지/제거 가능

## 🧠 `/forget` 구현 방법

### 개념

- [observation:insight] `/forget`은 실제 삭제가 아닌 `/compact` 래퍼로 구현 가능
- [observation:insight] "선택적 잊기" = "해당 내용 제외하고 요약"

### 구현 매핑

| `/forget` 명령 | 실제 동작 |
|---------------|----------|
| `/forget last-3` | `/compact` + "마지막 3개 메시지 제외하고 요약" |
| `/forget topic:에러` | `/compact` + "에러 관련 내용 제외하고 요약" |
| `/forget tool-outputs` | `/compact` + "도구 출력 제외하고 요약" |

### 예상 구현 (skill)

```yaml
Command: /forget
Arguments:
  - target: "last-n" | "topic" | "tool-outputs"
  - n: number (last-n일 때)
  - topic: string (topic일 때)

Implementation:
  1. 인자 파싱
  2. /compact 지시사항 생성
  3. /compact 실행 (또는 사용자에게 실행 안내)
```

## 🔗 관련 명령어 비교

| 명령어 | 동작 | 세션 | 복구 |
|--------|------|------|------|
| `/clear` | 전체 컨텍스트 삭제 | 유지 | ❌ |
| `/compact` | 요약으로 교체 | 유지 | `/resume` |
| `/rewind` (Esc+Esc) | 마지막 턴 되돌리기 | 유지 | - |
| `/forget` (구현 예정) | 선택적 제외 후 요약 | 유지 | `/resume` |

## 📊 Context Editing API (참고)

Claude API 레벨에서는 더 정교한 컨텍스트 편집 가능:

| 기능 | 설명 |
|------|------|
| `clear_tool_uses` | 도구 출력만 선택적 삭제 |
| `clear_thinking` | thinking 블록만 삭제 |

- [observation:limitation] Claude Code CLI에서는 직접 노출되지 않음
- [observation:tip] Claude Agent SDK 사용 시 직접 접근 가능

## 🎯 실용적 워크플로우

### Context Poisoning 발생 시

```bash
# 1. 오류가 축적된 상황
> (잘못된 방향으로 여러 시도...)

# 2. /forget으로 오류 부분 제거
/forget topic:에러

# 3. 또는 직접 /compact 사용
/compact 에러 디버깅 시도 내용 제외하고, 원래 목표와 성공한 부분만 요약

# 4. 깨끗한 컨텍스트로 재시작
> 이제 다시 시도해보자
```

## Relations

- extends [[knowledge/architectures/context-memory-integration|Context Engineering x Memory Architecture Integration]]
- implements [[context-poisoning|Context Poisoning]] 해결책
- relates_to [[knowledge/architectures/three-layer-memory-architecture|Three-Layer Memory Architecture]]

---

**카테고리**: Guide
**난이도**: 중급
**마지막 업데이트**: 2026-01-21
**출처**: Claude Code 공식 문서 + 실험적 확인
