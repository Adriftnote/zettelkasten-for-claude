---
title: Knowledge Cache Implementation Plan
type: plan
permalink: tests/knowledge-cache-implementation-plan
tags:
- knowledge-cache
- implementation
- plan
- skills
status: planned
created: 2026-01-23
---

# Knowledge Cache 구현 계획

## 📋 개요

[[Knowledge Cache Refrigerator Model Implementation]] 설계를 기반으로 한 단계별 구현 계획.

**목표**: MCP CLI ToolCache 패턴을 적용한 Knowledge Cache 냉장고 모델 구현

---

## 🎯 Phase 1: 기반 구조 (Day 1)

### 1.1 캐시 폴더 생성

```bash
# vault 루트에 캐시 폴더 생성
mkdir .knowledge-cache
```

**산출물**: `.knowledge-cache/` 폴더

### 1.2 인덱스 파일 초기화

```json
// .knowledge-cache/_index.json
{
  "loaded": [],
  "last_updated": null
}
```

**산출물**: `.knowledge-cache/_index.json`

### 1.3 .gitignore 추가 (선택)

```
# vault/.gitignore
.knowledge-cache/
```

---

## 🎯 Phase 2: /load-cache Skill (Day 1-2)

### 2.1 Skill 파일 생성

**경로**: `skills/load-cache.md`

```markdown
---
name: load-cache
description: 허브 노트의 지식을 Knowledge Cache에 로드
---

# /load-cache

허브 노트를 기반으로 관련 지식을 캐시에 로드합니다.

## 사용법

/load-cache "허브이름"

## 예시

/load-cache "Context-Memory Integration"
/load-cache "Tool-Hub"

## 동작

1. 허브 이름을 slug로 변환 (공백 → 하이픈, 소문자)
2. 캐시 파일 확인 (.knowledge-cache/{slug}.json)
3. 캐시 존재 시: 파일에서 읽어서 표시
4. 캐시 미존재 시: build_context 호출 → 저장 → 표시
5. _index.json에 로드 상태 기록
```

### 2.2 핵심 로직

```
입력: "Context-Memory Integration"
    ↓
slug 변환: "context-memory-integration"
    ↓
캐시 경로: ".knowledge-cache/context-memory-integration.json"
    ↓
파일 존재 확인 (Read 시도)
    ↓
├─ 존재 (Cache Hit):
│   └─ 파일 내용 파싱
│   └─ _index.json 업데이트
│   └─ 결과 출력
│
└─ 미존재 (Cache Miss):
    └─ build_context(url="memory://02.-hubs/context-memory-integration", depth=2)
    └─ 결과를 JSON으로 저장
    └─ _index.json 업데이트
    └─ 결과 출력
```

### 2.3 출력 형식

```
🧊 Context-Memory Integration 로드됨

📚 포함된 지식:
- context-poisoning: 오류 축적/강화 문제
- progressive-disclosure: 필요한 것만 점진적 공개
- fast-slow-프랙탈: 도메인을 관통하는 구조
... (총 12개)

🔗 관계:
- organizes → 6개
- connects_to → 3개
- references → 3개

💡 핵심 사실:
- [fact] Context Engineering = Memory Management의 다른 이름
- [fact] Fast-Slow 프랙탈이 통합의 열쇠
... (총 8개)

✅ 캐시에서 로드됨 (또는 "새로 캐시됨")
```

---

## 🎯 Phase 3: /cache-status Skill (Day 2)

### 3.1 Skill 파일 생성

**경로**: `skills/cache-status.md`

```markdown
---
name: cache-status
description: 현재 로드된 Knowledge Cache 상태 확인
---

# /cache-status

현재 Working Memory에 로드된 캐시 목록을 표시합니다.

## 사용법

/cache-status

## 동작

1. _index.json 읽기
2. 로드된 각 캐시의 요약 정보 표시
```

### 3.2 출력 형식

```
🧊 Knowledge Cache 상태

조리대 (현재 로드됨):
┌────────────────────────────────────────┐
│ 1. Context-Memory Integration          │
│    📚 노트: 12개 | 🔗 관계: 12개        │
│    💡 사실: 8개                         │
│    ⏰ 로드: 10분 전                     │
├────────────────────────────────────────┤
│ 2. Tool-Hub                            │
│    📚 노트: 8개 | 🔗 관계: 21개         │
│    💡 사실: 5개                         │
│    ⏰ 로드: 5분 전                      │
└────────────────────────────────────────┘

총: 20개 노트, 33개 관계, 13개 사실
```

---

## 🎯 Phase 4: /unload-cache Skill (Day 2)

### 4.1 Skill 파일 생성

**경로**: `skills/unload-cache.md`

```markdown
---
name: unload-cache
description: 로드된 캐시에서 특정 허브 제거
---

# /unload-cache

Working Memory에서 특정 허브의 캐시를 제거합니다.

## 사용법

/unload-cache "허브이름"

## 동작

1. _index.json에서 해당 허브 제거
2. (캐시 파일은 유지 - 나중에 다시 쓸 수 있음)
```

### 4.2 출력 형식

```
🗑️ Context-Memory Integration 언로드됨

남은 캐시: Tool-Hub
```

---

## 🎯 Phase 5: /cache-list Skill (Day 3)

### 5.1 Skill 파일 생성

**경로**: `skills/cache-list.md`

```markdown
---
name: cache-list
description: 캐시 가능한 허브 목록 및 캐시 상태 표시
---

# /cache-list

냉장고(vault)에 있는 허브 목록과 캐시 상태를 표시합니다.

## 사용법

/cache-list

## 동작

1. 02. hubs/ 폴더의 허브 노트 목록 조회
2. .knowledge-cache/ 폴더의 캐시 파일 확인
3. 각 허브의 캐시 상태 표시
```

### 5.2 출력 형식

```
🗄️ 냉장고 (사용 가능한 허브)

✅ Context-Memory Integration (캐시됨, 로드됨)
✅ Tool-Hub (캐시됨, 로드됨)
📦 Memory Systems (캐시됨, 언로드됨)
⬜ Optimization Patterns (캐시 없음)
⬜ Architectures (캐시 없음)

💡 /load-cache "허브이름" 으로 로드하세요
```

---

## 🎯 Phase 6: /cache-refresh Skill (Day 3)

### 6.1 Skill 파일 생성

**경로**: `skills/cache-refresh.md`

```markdown
---
name: cache-refresh
description: 특정 허브의 캐시를 강제로 새로고침
---

# /cache-refresh

허브의 캐시를 삭제하고 다시 생성합니다.

## 사용법

/cache-refresh "허브이름"

## 동작

1. 기존 캐시 파일 삭제
2. build_context 다시 호출
3. 새 결과 저장
```

---

## 📦 산출물 체크리스트

### 파일 구조

```
vault/
├── .knowledge-cache/
│   ├── _index.json              ← Phase 1
│   ├── context-memory-integration.json  ← Phase 2 (자동 생성)
│   └── tool-hub.json            ← Phase 2 (자동 생성)
│
└── skills/
    ├── load-cache.md            ← Phase 2
    ├── cache-status.md          ← Phase 3
    ├── unload-cache.md          ← Phase 4
    ├── cache-list.md            ← Phase 5
    └── cache-refresh.md         ← Phase 6
```

### 기능 체크리스트

| Phase | 기능 | 상태 |
|-------|------|------|
| 1 | `.knowledge-cache/` 폴더 | ⬜ |
| 1 | `_index.json` 초기화 | ⬜ |
| 2 | `/load-cache` Skill | ⬜ |
| 2 | Cache Hit 로직 | ⬜ |
| 2 | Cache Miss 로직 (build_context) | ⬜ |
| 3 | `/cache-status` Skill | ⬜ |
| 4 | `/unload-cache` Skill | ⬜ |
| 5 | `/cache-list` Skill | ⬜ |
| 6 | `/cache-refresh` Skill | ⬜ |

---

## 🧪 테스트 시나리오

### 시나리오 1: 첫 로드 (Cache Miss)

```
1. /load-cache "Context-Memory Integration"
2. 예상: build_context 호출 → 캐시 파일 생성 → 결과 표시
3. 확인: .knowledge-cache/context-memory-integration.json 존재
```

### 시나리오 2: 재로드 (Cache Hit)

```
1. /load-cache "Context-Memory Integration" (두 번째)
2. 예상: 캐시 파일에서 읽기 (MCP 호출 없음)
3. 확인: "캐시에서 로드됨" 메시지
```

### 시나리오 3: 여러 허브 로드

```
1. /load-cache "Context-Memory Integration"
2. /load-cache "Tool-Hub"
3. /cache-status
4. 예상: 두 허브 모두 표시
```

### 시나리오 4: 언로드 후 상태

```
1. /unload-cache "Context-Memory Integration"
2. /cache-status
3. 예상: Tool-Hub만 표시
4. /cache-list
5. 예상: Context-Memory는 "캐시됨, 언로드됨" 상태
```

### 시나리오 5: 캐시 갱신

```
1. /cache-refresh "Context-Memory Integration"
2. 예상: 기존 캐시 삭제 → 새로 생성
3. 확인: 파일 수정 시간 변경
```

---

## 📅 일정

| 날짜 | Phase | 작업 |
|------|-------|------|
| Day 1 | 1, 2 | 기반 구조 + /load-cache |
| Day 2 | 3, 4 | /cache-status + /unload-cache |
| Day 3 | 5, 6 | /cache-list + /cache-refresh |
| Day 4 | - | 테스트 및 문서 업데이트 |

---

## 🔗 관련 문서

- [[Knowledge Cache Refrigerator Model Implementation]] - 설계 문서
- [[Three-Layer Memory Architecture]] - 상위 아키텍처
- [[MCP CLI LazyToolLoader Pattern]] - 영감 패턴

---

## Observations

- [plan] Phase 1-2가 핵심: 캐시 구조 + /load-cache가 동작하면 나머지는 쉬움 #mvp #priority
- [tech] slug 변환 로직이 일관되어야 함: 공백→하이픈, 소문자, 특수문자 제거 #naming
- [decision] 캐시 파일은 삭제하지 않고 유지 (unload는 인덱스에서만 제거) #persistence
