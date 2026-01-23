---
title: Context Quality Management Guide
type: note
permalink: knowledge/guides/context-quality-management-guide
tags:
- context-engineering
- memory
- commands
- mcp
- workflow
- practical
extraction_status: pending
---

# Context Quality Management Guide

컨텍스트를 좋은 퀄리티로 유지하기 위한 실용 가이드입니다.

## 📖 왜 컨텍스트 관리가 필요한가?

컨텍스트 윈도우는 **유한한 자원**입니다. 무분별하게 쌓이면:

| 문제 | 증상 | 결과 |
|------|------|------|
| **Context Poisoning** | 초반 오류가 계속 참조됨 | 오류 증폭 |
| **Context Distraction** | 무관한 정보가 많음 | 관련 정보 주의 분산 |
| **Context Confusion** | 여러 작업 맥락 혼재 | 잘못된 맥락 참조 |
| **Lost-in-Middle** | 긴 컨텍스트의 중간 정보 | 회수율 저하 |

**목표**: 적시에 적절한 정보만 컨텍스트에 유지

## 🛠️ AgeMem → 실제 도구 매핑

AgeMem 논문의 메모리 관리 도구를 실제 환경에 매핑합니다.

### 도구 대응표

| AgeMem       | 역할           | 실제 구현                                     | 상태       |
| ------------ | ------------ | ----------------------------------------- | -------- |
| **ADD**      | LTM에 저장      | `basic-memory:write_note`                 | ✅ 있음     |
| **UPDATE**   | LTM 수정       | `basic-memory:edit_note`                  | ✅ 있음     |
| **DELETE**   | LTM 삭제       | `basic-memory:delete_note`                | ✅ 있음     |
| **RETRIEVE** | LTM → STM 로드 | `basic-memory:read_note`, `build_context` | ✅ 있음     |
| **SUMMARY**  | STM 요약       | `/compact` (Claude Code 내장)               | ✅ 있음     |
| **FILTER**   | STM 정리       | `/compact [instructions]` 또는 새 대화 시작     | ⚠️ 제한적   |

### ⚠️ 중요: 컨텍스트 관리의 한계 [fact]

**SUMMARY와 FILTER 모두 서버의 KV-Cache를 직접 조절하는 것이 아닙니다.**

```
┌─────────────────────────────────────────────────────────┐
│  사용자 레벨 (제어 가능)                                  │
│  → API에 보내는 입력(컨텍스트)을 조절                     │
│  → /compact, /clear, build_context 등                  │
└───────────────────────┬─────────────────────────────────┘
                        │ (API 경계)
                        ▼
┌─────────────────────────────────────────────────────────┐
│  서비스 레벨 (제어 불가)                                  │
│  → Anthropic 서버의 GPU VRAM에 있는 KV-Cache            │
│  → 캐시 저장/삭제/TTL 정책은 Anthropic이 관리            │
└─────────────────────────────────────────────────────────┘
```

**결론**: 사용자는 `/compact`를 잘 활용하여 **입력 자체를 조절**하는 수밖에 없습니다.
- SUMMARY: `/compact`로 요약하여 입력 크기 줄이기
- FILTER: `/compact [보존할 것]`으로 특정 내용만 남기기 (선별 제거는 불가, 보존 지정만 가능)

자세한 내용: [[Context Management Levels]]

### 현재 사용 가능한 도구

#### 1. `/compact` - STM 요약 (SUMMARY)
**기능**: 현재 대화를 요약하여 컨텍스트 압축

**문법**:
```
/compact [instructions]
```

| 형식                        | 설명                          |
| ------------------------- | --------------------------- |
| `/compact`                | 전체 대화 압축 (CLAUDE.md 기본값 사용) |
| `/compact [instructions]` | **토픽 기반 압축** - 특정 주제 보존     |

**토픽 기반 압축 예시**:
```bash
# 특정 토픽 보존
/compact Focus on authentication logic and security fixes

# 파일 기반 보존
/compact Preserve changes to auth.ts and config.json only

# 여러 조건 결합
/compact Keep failing tests, API changes, and error messages

# 작업 결과만 보존
/compact only keep the code changes and test results
```

**동작 방식**:

| 대상 | 처리 |
|------|------|
| instructions에 명시된 토픽 | **상세 보존** |
| 나머지 대화 | 요약/압축 |
| 관련 없는 내용 | 공격적으로 삭제 |

**CLAUDE.md에서 기본값 설정**:
```markdown
# Compact instructions

When you are using compact, please focus on:
- Test output and failures
- Code changes made
- Architecture decisions
- Key findings from exploration
```

**자동 압축**:
- 컨텍스트 95% 도달 시 자동 실행
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`으로 조기 압축 가능

**PreCompact 훅 연동**:
```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "manual|auto",
      "hooks": [{ "type": "command", "command": "pre-compact.sh" }]
    }]
  }
}
```
- `trigger: manual` - `/compact` 명령어로 호출
- `trigger: auto` - 자동 압축으로 호출
- `custom_instructions` - 사용자가 전달한 토픽 지정 내용

**언제 사용**:
- 컨텍스트가 길어져서 응답이 느려질 때
- 작업 중간에 맥락 정리가 필요할 때
- 특정 주제만 보존하고 나머지는 정리할 때

**주의**: compact는 세부 정보를 잃을 수 있음. 중요한 건 먼저 LTM에 저장!
#### 2. `basic-memory:write_note` - LTM 저장 (ADD)

**기능**: 검증된 인사이트를 영구 저장

**언제 사용**:
- 중요한 발견/결론이 나왔을 때
- 반복 사용할 패턴을 정리할 때
- 세션 종료 전 핵심 내용 보존

**사용 패턴**:
```
User: 이 내용 basic-memory에 저장해줘
→ write_note로 LTM에 저장
→ 다음 세션에서 read_note로 복원 가능
```

#### 3. `basic-memory:build_context` - 맥락 로드 (RETRIEVE)

**기능**: 관련 지식을 컨텍스트에 로드

**언제 사용**:
- 세션 시작 시 이전 작업 맥락 복원
- 특정 주제 작업 전 관련 지식 로드
- "이전에 뭐라고 했더라?" 확인

**사용 패턴**:
```
User: memory://knowledge/architectures/* 컨텍스트 빌드해줘
→ 관련 노트들의 요약 + 관계 로드
→ 풍부한 맥락에서 작업 시작
```

## 📋 필요한 커맨드 스펙 (개발 필요)

### 1. `/forget` - 오류 격리 (FILTER)

**목적**: Context Poisoning 방지

```yaml
Command: /forget
Arguments:
  - target: "last-n" | "topic" | "tool-outputs"
  - n: number (last-n일 때)
  - topic: string (topic일 때)

Examples:
  /forget last-3        # 마지막 3개 메시지 무시
  /forget tool-outputs  # 도구 출력만 정리
  /forget topic:에러    # 에러 관련 맥락 제거
```

**현재 한계**:
- 서버의 KV-Cache를 직접 삭제하는 것은 **불가능**
- "선별 제거"는 사용자 레벨에서 지원되지 않음

**현실적인 대안 (compact 활용)**:
```bash
# "제거"가 아닌 "보존"으로 접근
/compact Keep only the successful implementation, ignore all error messages

# 에러 관련 제거 → 성공한 것만 보존
/compact Focus on working code and final decisions only

# 도구 출력 제거 → 결론만 보존
/compact Keep conclusions and decisions, not tool outputs
```

**구현 방식 (미래)**:
- 실제 삭제가 아닌 "무시 마커" 추가
- 또는 `/compact`와 결합하여 해당 부분 제외 요약

### 2. `/log` - 작업 기록 (STM → DB)

**목적**: Context Confusion 방지, 작업 이력 추적

```yaml
Command: /log
Arguments:
  - intent: string (작업 목적)
  - output_summary: string (결과 요약)
  
Examples:
  /log "MCP 서버 설정 완료" 
  /log intent:"버그 수정" output:"파일 3개 수정"
```

**구현 방식**:
- orchestration.db의 orchestration_log 테이블에 기록
- task_id 자동 생성

### 3. `/load-cache` - Knowledge Cache 로드

**목적**: Lost-in-Middle 방지, Fast Path 준비

```yaml
Command: /load-cache
Arguments:
  - scope: "project" | "topic" | "recent"
  - topic: string (topic일 때)
  
Examples:
  /load-cache project        # 현재 프로젝트 핵심 지식
  /load-cache topic:memory   # memory 관련 핵심만
  /load-cache recent         # 최근 7일 작업 요약
```

**구현 방식**:
- basic-memory에서 [fact] 태그된 observation만 추출
- 트리플 형식으로 압축하여 컨텍스트 앞부분에 배치

### 4. `/status` - 컨텍스트 상태 확인
**목적**: 현재 컨텍스트 건강도 파악 + `/compact` 연계

```yaml
Command: /status
Output:
  - token_usage: "45,000 / 200,000 (22%)"
  - session_duration: "45분"
  - topics: ["memory architecture", "MCP 설정"]
  - warning: "컨텍스트 70% 초과 시 /compact 권장"
```

**`/status` → `/compact` 연계 워크플로우**:

```
┌─────────────────────────────────────────────────────────┐
│  1. 상태 확인                                            │
│     /status                                             │
│     → token_usage: "150,000 / 200,000 (75%)"           │
│     → topics: ["memory architecture", "MCP 설정"]       │
│     → warning: "컨텍스트 70% 초과, /compact 권장"        │
│                                                         │
│  2. 토픽 기반 압축                                       │
│     /compact Focus on memory architecture and MCP 설정  │
│     → topics에 나온 주제들을 보존                        │
│     → 나머지는 압축                                      │
│                                                         │
│  3. 결과 확인                                            │
│     /status                                             │
│     → token_usage: "35,000 / 200,000 (17%)"            │
│     → 핵심 토픽 보존된 상태로 계속 작업                   │
└─────────────────────────────────────────────────────────┘
```

**핵심 아이디어**: 
- `/status`의 `topics` 필드가 현재 대화의 주요 주제를 자동 추출
- 이 토픽들을 `/compact [instructions]`에 그대로 전달
- 중요한 맥락은 보존하면서 불필요한 내용만 압축

**구현 방식**:
- 대화 분석하여 주요 토픽 자동 추출
- 토픽은 Claude의 NLU로 식별 (키워드 매칭 아님)
- `/compact`의 instructions와 동일한 형식으로 출력
## 🔄 워크플로우별 가이드

### 세션 시작

```
┌─────────────────────────────────────────────────────────┐
│  1. 맥락 복원                                            │
│     /load-cache recent                                  │
│     → 최근 작업 요약 로드                                │
│                                                         │
│  2. 관련 지식 로드 (필요시)                               │
│     basic-memory:build_context("memory://topic/*")      │
│     → 오늘 작업 관련 지식 로드                           │
│                                                         │
│  3. 작업 시작 선언                                       │
│     "오늘은 XXX 작업할 거야"                             │
│     → Claude가 관련 맥락에 집중                          │
└─────────────────────────────────────────────────────────┘
```

### 작업 진행 중

```
┌─────────────────────────────────────────────────────────┐
│  상황별 대응:                                            │
│                                                         │
│  [컨텍스트 길어짐]                                       │
│  → /compact                                             │
│  → 또는 중요한 건 먼저 /remember 후 compact             │
│                                                         │
│  [오류 발생, 잘못된 방향]                                │
│  → "이 접근은 잘못됐어, 다시 생각해보자"                 │
│  → 또는 /forget last-3 (해당 부분 무시)                 │
│  → 새로운 접근으로 재시작                                │
│                                                         │
│  [주제 전환]                                             │
│  → /log "이전 작업 완료"                                │
│  → 새 주제 시작                                         │
│  → 필요시 /load-cache topic:새주제                      │
│                                                         │
│  [중요한 발견]                                           │
│  → "이거 기억해둬" / basic-memory에 저장                 │
│  → [fact] 태그로 검증된 사실 표시                        │
└─────────────────────────────────────────────────────────┘
```

### 세션 종료

```
┌─────────────────────────────────────────────────────────┐
│  1. 작업 기록                                            │
│     /log "오늘 한 일 요약"                               │
│     → STM(orchestration.db)에 기록                      │
│                                                         │
│  2. 인사이트 저장                                        │
│     "오늘 배운 거 정리해서 저장해줘"                      │
│     → basic-memory:write_note                           │
│     → 검증된 [fact]만 저장                               │
│                                                         │
│  3. (선택) 요약 저장                                     │
│     /compact 후 요약 내용을 노트로 저장                   │
│     → 다음 세션 빠른 복원용                              │
└─────────────────────────────────────────────────────────┘
```

## ⚡ 실천 체크리스트

### 매 세션

- [ ] 시작: `/load-cache` 또는 관련 노트 로드
- [ ] 진행: 중요 발견 즉시 저장 (나중에 잊음)
- [ ] 종료: `/log`로 작업 기록

### 컨텍스트가 길어질 때

- [ ] 중요한 내용 먼저 LTM에 저장했는지 확인
- [ ] `/compact` 실행
- [ ] 필요하면 새 대화 시작 (깨끗한 컨텍스트)

### 오류/혼란 발생 시

- [ ] 잘못된 부분 명시적으로 지적
- [ ] "이건 무시하고" 명확히 표현
- [ ] 심하면 새 대화 시작 (Poisoning 격리)

### 주기적으로

- [ ] 주 1회: 이번 주 작업 요약 정리
- [ ] 월 1회: Knowledge Cache 업데이트 (핵심 지식 정리)

## 🎯 핵심 원칙

1. **저장 먼저, 압축 나중**: compact 전에 중요한 건 LTM에
2. **명시적 전환**: 주제 바꿀 때 이전 작업 로깅
3. **오류 격리**: 잘못된 방향은 빨리 끊고 새로 시작
4. **Fast Path 유지**: 핵심 지식은 Knowledge Cache에

## Relations

- implements [[AgeMem-paper-review|AgeMem 논문 리뷰]] - 이론적 기반
- extends [[knowledge/architectures/context-memory-integration|Context Engineering x Memory Architecture Integration]] - 통합 아키텍처
- uses [[knowledge/architectures/three-layer-memory-architecture|Three-Layer Memory Architecture]] - 메모리 구조
- explains [[knowledge/concepts/context-management-levels|Context Management Levels]] - 서비스/사용자 레벨 구분
- requires basic-memory MCP - 실제 LTM 구현
- requires /compact - STM 요약 (Claude Code 내장)

---

**난이도**: 중급
**카테고리**: Practical Guide
**상태**: Draft - 커맨드 구현 필요
**마지막 업데이트**: 2026-01-21
