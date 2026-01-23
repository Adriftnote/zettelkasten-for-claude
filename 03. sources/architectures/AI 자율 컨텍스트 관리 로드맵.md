---
title: AI 자율 컨텍스트 관리 로드맵
type: note
permalink: knowledge/architectures/ai-jayul-keontegseuteu-gwanri-rodeumaeb
tags:
- agemem
- context-engineering
- automation
- roadmap
- hooks
- skills
extraction_status: pending
---

# AI 자율 컨텍스트 관리 로드맵

AgeMem의 핵심 원칙을 현실에 적용하기 위한 단계별 자동화 로드맵입니다.

## 🎯 AgeMem 핵심 원칙

AgeMem 논문의 핵심은 **AI가 스스로 메모리 관리 도구를 호출**한다는 것입니다.

```
┌─────────────────────────────────────────────────────────┐
│  AgeMem 이상적 모델                                      │
│                                                         │
│  AI: "컨텍스트가 70% 찼네, SUMMARY 호출해야겠다"         │
│      → AI가 직접 SUMMARY 도구 실행                       │
│      → 결과 확인 후 작업 계속                            │
│                                                         │
│  핵심: 사용자 개입 없이 AI가 자율적으로 관리              │
└─────────────────────────────────────────────────────────┘
```

### AgeMem 도구와 자율성

| 도구          | 역할           | AI 자율 호출      |
| ----------- | ------------ | ------------- |
| ADD         | LTM에 저장      | AI가 판단하여 호출   |
| UPDATE      | LTM 수정       | AI가 판단하여 호출   |
| DELETE      | LTM 삭제       | AI가 판단하여 호출   |
| RETRIEVE    | LTM → STM 로드 | AI가 필요시 호출    |
| **SUMMARY** | STM 요약       | **AI가 직접 호출** |
| FILTER      | STM 정리       | AI가 판단하여 호출   |

## ⚠️ 현재 한계

Claude Code 환경에서의 제약:

| 도구 | 현재 상태 | AI 자율 호출 |
|------|----------|-------------|
| `basic-memory:write_note` | ✅ 사용 가능 | ✅ AI가 직접 호출 가능 |
| `basic-memory:edit_note` | ✅ 사용 가능 | ✅ AI가 직접 호출 가능 |
| `basic-memory:delete_note` | ✅ 사용 가능 | ✅ AI가 직접 호출 가능 |
| `basic-memory:read_note` | ✅ 사용 가능 | ✅ AI가 직접 호출 가능 |
| **`/compact`** | ✅ 사용 가능 | ❌ **사용자만 실행 가능** |

**핵심 문제**: `/compact`는 slash command로, Claude가 직접 실행할 수 없음

```
현재 모델:
User: /compact  ← 사용자가 직접 타이핑해야 함
Claude: (실행 불가, 제안만 가능)
```

## 📊 자율성 수준 정의

### Level 0: 수동 (현재 기본)

```
사용자가 모든 것을 직접 실행
- /compact 직접 입력
- 토픽 직접 분석
- 타이밍 직접 판단
```

### Level 1: 제안 (Suggestion)

```
AI가 상황을 분석하고 제안
- "컨텍스트 75% 사용 중입니다"
- "현재 토픽: [memory architecture, MCP 설정]"
- "/compact Focus on memory architecture and MCP 설정 실행하시겠어요?"
→ 사용자가 승인하면 실행
```

### Level 2: 반자동 (Hook 기반)

```
조건 충족 시 Hook이 자동 트리거
- 토큰 70% 초과 → PreCompact 훅 실행
- 훅이 토픽 분석 + compact 실행
- 사용자는 결과만 확인
```

### Level 3: 자율 (AI 직접 호출)

```
AI가 필요시 직접 도구 호출 (AgeMem 이상)
- AI: "컨텍스트 정리 필요" → 직접 compact 호출
- 현재 Claude Code에서는 불가능
- 향후 도구 확장 필요
```

## 🛠️ 단계별 구현 로드맵

### Phase 1: Level 1 구현 (제안 시스템)

**목표**: AI가 상황 인식하고 적절한 제안

**구현 방법**:

1. **CLAUDE.md에 제안 규칙 추가**
```markdown
# Context Management Rules

컨텍스트 관리 시 다음 규칙을 따르세요:

1. 대화가 길어지면 (체감상 많은 도구 호출 후) 사용자에게 알림:
   - 현재 주요 토픽 분석
   - /compact 명령어 제안
   - 예: "/compact Focus on [토픽1] and [토픽2] 실행하시겠어요?"

2. 주제가 전환될 때:
   - 이전 주제 요약 제안
   - basic-memory에 저장 제안
```

2. **StatusLine으로 토큰 모니터링**
```json
{
  "statusLine": {
    "type": "command",
    "command": "echo \"Tokens: $CLAUDE_CONTEXT_TOKENS\""
  }
}
```

**결과**: AI가 "제안"하고 사용자가 승인

---

### Phase 2: Level 2 구현 (Hook 자동화)

**목표**: 조건 충족 시 자동 실행

**구현 방법**:

1. **PreCompact 훅 설정**
```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "auto",
      "hooks": [{
        "type": "command",
        "command": "python analyze_topics.py"
      }]
    }]
  }
}
```

2. **토픽 분석 스크립트** (`analyze_topics.py`)
```python
# 대화 로그에서 토픽 추출
# compact instructions 생성
# 결과를 Claude에게 전달
```

3. **자동 압축 임계값 조정**
```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70
```

**결과**: 70% 도달 시 자동으로 토픽 기반 압축

---

### Phase 3: Skill 개발 (`/smart-compact`)

**목표**: AI 주도의 지능형 압축

**Skill 스펙**:
```yaml
Command: /smart-compact
Flow:
  1. AI가 현재 대화 분석
  2. 주요 토픽 추출
  3. 토픽 기반 compact 명령 생성
  4. 사용자에게 확인 요청
  5. 승인 시 실행
  
Example:
  User: /smart-compact
  AI: "현재 대화 분석 결과:
       - 주요 토픽: memory architecture, MCP 설정, Hook 구현
       - 컨텍스트 사용률: 72%
       
       다음 명령을 실행할까요?
       /compact Focus on memory architecture, MCP 설정, and Hook 구현"
  User: ㅇㅇ
  → 실행
```

**구현 방식**:
- Claude Code Skill로 등록
- 내부적으로 대화 분석 + `/compact` 호출

---

### Phase 4: Level 3 탐색 (장기)

**목표**: AI 직접 호출 가능한 compact 도구

**가능한 접근**:

1. **MCP 서버로 compact 래핑**
   - `context-manager` MCP 서버 개발
   - `compact` 도구를 MCP 도구로 노출
   - AI가 직접 호출 가능

2. **Claude Code 기능 요청**
   - `/compact`를 도구로 변환 요청
   - AI가 호출 가능한 `tools.compact()` 형태

3. **Headless 모드 활용**
   - 별도 Claude 인스턴스가 compact 실행
   - 메인 세션과 동기화

## 📋 구현 우선순위

| 순위 | 항목 | 난이도 | 영향도 |
|------|------|--------|--------|
| 1 | CLAUDE.md 제안 규칙 | 쉬움 | 중간 |
| 2 | StatusLine 토큰 모니터링 | 쉬움 | 낮음 |
| 3 | `/smart-compact` Skill | 중간 | 높음 |
| 4 | PreCompact 훅 자동화 | 중간 | 높음 |
| 5 | MCP compact 래퍼 | 어려움 | 매우 높음 |

## 🎯 현실적 목표

**단기 (지금 가능)**:
- Level 1: AI가 제안, 사용자가 실행
- CLAUDE.md에 규칙 추가로 즉시 적용

**중기 (개발 필요)**:
- Level 2: Hook + Skill로 반자동화
- `/smart-compact` Skill 개발

**장기 (구조 변경 필요)**:
- Level 3: AI 자율 호출
- MCP 래퍼 또는 Claude Code 기능 확장

## Relations

- implements [[AgeMem-paper-review|AgeMem 논문 리뷰]] - 이론적 기반
- extends [[knowledge/guides/context-quality-management-guide|Context Quality Management Guide]] - 실용 가이드
- uses [[knowledge/architectures/three-layer-memory-architecture|Three-Layer Memory Architecture]] - 메모리 구조
- requires Claude Code Hooks - 자동화 메커니즘
- requires Claude Code Skills - 커스텀 명령어

---

**상태**: Draft - Phase 1부터 순차 구현 예정
**마지막 업데이트**: 2026-01-21