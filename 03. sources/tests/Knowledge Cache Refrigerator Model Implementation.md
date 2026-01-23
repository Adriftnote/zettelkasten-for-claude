---
title: Knowledge Cache Refrigerator Model Implementation
type: design
permalink: tests/knowledge-cache-refrigerator-model
tags:
- knowledge-cache
- implementation
- mcp-cli
- lazy-loading
- hub-notes
- three-layer-memory
status: draft
created: 2026-01-23
---

# Knowledge Cache 냉장고 모델 구현 설계

## 📖 개요

MCP CLI ToolCache 패턴에서 영감받은 **Knowledge Cache 냉장고 모델**.
허브 노트를 캐시 프로필로 사용하여, 필요한 지식만 선택적으로 Working Memory에 로드한다.

## 🎯 핵심 아이디어

### MCP CLI ToolCache에서 배운 것

[MCP CLI ToolCache] [inspires] [Knowledge Cache 냉장고 모델]

```
MCP CLI ToolCache:
  처음: MCP 서버 연결 → 도구 목록 fetch → 로컬 파일에 저장
  이후: 로컬 파일에서 읽기 (MCP 연결 없음)

Knowledge Cache:
  처음: build_context() 호출 → 결과를 로컬 파일에 저장
  이후: 로컬 파일에서 읽기 (MCP 호출 없음)
```

### TTL vs 냉장고 모델

[냉장고 모델] [differs from] [TTL 기반 자동 만료]

| | MCP CLI ToolCache | Knowledge Cache (냉장고) |
|---|---|---|
| **만료** | TTL 24시간 (자동) | **수동** (내가 뺄 때까지) |
| **선택** | 서버별 자동 | **허브별 수동 선택** |
| **비유** | 자동 가비지 컬렉션 | 냉장고에서 꺼내기 |

### 허브 노트 = 캐시 프로필

[허브 노트] [serves as] [Knowledge Cache의 시드(seed)]

```
허브 노트 (수동 구성):
  Context-Memory Integration (허브)
  ├── organizes [[context-poisoning]]
  ├── organizes [[progressive-disclosure]]
  └── ...

build_context (자동 탐색):
  build_context(url="memory://hubs/context-memory", depth=2)
  ├── depth=1: 직접 연결된 노트들
  └── depth=2: 그 노트들과 연결된 노트들
```

**둘 다 하는 일**: 중심점에서 관련 지식을 펼쳐나감

---

## 🧊 냉장고 모델 비유

```
냉장고 (LTM - Obsidian vault):
├── Context-Memory Integration (허브)
├── Tool-Hub (허브)
├── Memory Systems (허브)
└── ...

조리대 (Working Memory):
  [비어있음]

/load-cache "Context-Memory Integration"
  → 냉장고에서 꺼내서 조리대에 올림

조리대 (Working Memory):
  [Context-Memory Integration의 지식들...]

/load-cache "Tool-Hub"
  → 추가로 더 올림

/unload-cache "Context-Memory Integration"
  → 필요 없으면 조리대에서 치움
```

---

## 🛠️ 구현 구조

### 폴더 구조

```
vault/
├── .knowledge-cache/           ← 캐시 저장소 (gitignore 권장)
│   ├── context-memory-integration.json
│   ├── tool-hub.json
│   └── _index.json             ← 현재 로드된 캐시 목록
│
├── 02. hubs/                   ← 허브 노트들 (캐시 프로필)
│   ├── Context-Memory Integration.md
│   ├── Tool-Hub.md
│   └── ...
│
└── skills/                     ← Skill 정의
    ├── load-cache.md
    ├── unload-cache.md
    ├── cache-status.md
    └── cache-list.md
```

### 캐시 파일 형식

```json
// .knowledge-cache/context-memory-integration.json
{
  "hub": "Context-Memory Integration",
  "url": "memory://hubs/context-memory-integration",
  "created_at": "2026-01-23T10:30:00+09:00",
  "depth": 2,
  "entities": [
    {
      "title": "context-poisoning",
      "type": "note",
      "summary": "오류 축적/강화 문제"
    },
    {
      "title": "progressive-disclosure",
      "type": "pattern",
      "summary": "필요한 것만 점진적 공개"
    }
  ],
  "relations": [
    { "from": "Context-Memory Integration", "type": "organizes", "to": "context-poisoning" },
    { "from": "Context-Memory Integration", "type": "organizes", "to": "progressive-disclosure" }
  ],
  "observations": [
    "[fact] Context Engineering = Memory Management의 다른 이름",
    "[fact] Fast-Slow 프랙탈이 통합의 열쇠"
  ]
}
```

### 인덱스 파일 형식

```json
// .knowledge-cache/_index.json
{
  "loaded": [
    "context-memory-integration",
    "tool-hub"
  ],
  "last_updated": "2026-01-23T10:35:00+09:00"
}
```

---

## 📝 커맨드 설계

### /load-cache

**용도**: 허브의 지식을 캐시에서 로드 (없으면 build_context 후 저장)

```
/load-cache "Context-Memory Integration"
```

**동작 흐름**:

```
1. 입력 파싱: 허브 이름 → slug 변환 (context-memory-integration)

2. 캐시 확인: .knowledge-cache/{slug}.json 존재?
   ├─ YES (Cache Hit):
   │   └─ Read(.knowledge-cache/{slug}.json)
   │   └─ _index.json에 추가
   │   └─ 내용 반환
   │
   └─ NO (Cache Miss):
       └─ mcp__basic-memory__build_context(
            url="memory://hubs/{slug}",
            depth=2,
            max_related=10
          )
       └─ 결과를 .knowledge-cache/{slug}.json에 저장
       └─ _index.json에 추가
       └─ 내용 반환

3. 출력:
   "🧊 Context-Memory Integration 로드됨
    - 노트: 12개
    - 트리플: 34개
    - 핵심 사실: 8개"
```

### /unload-cache

**용도**: 로드된 캐시에서 특정 허브 제거

```
/unload-cache "Context-Memory Integration"
```

**동작 흐름**:

```
1. _index.json에서 해당 허브 제거
2. (파일은 삭제하지 않음 - 다음에 다시 쓸 수 있으니까)

3. 출력:
   "🗑️ Context-Memory Integration 언로드됨"
```

### /cache-status

**용도**: 현재 로드된 캐시 목록 확인

```
/cache-status
```

**동작 흐름**:

```
1. Read(.knowledge-cache/_index.json)
2. 각 로드된 캐시의 요약 정보 표시

3. 출력:
   "🧊 현재 조리대 (Working Memory):

    1. Context-Memory Integration
       - 노트: 12개, 트리플: 34개
       - 로드 시간: 10분 전

    2. Tool-Hub
       - 노트: 8개, 트리플: 21개
       - 로드 시간: 5분 전

    총: 20개 노트, 55개 트리플"
```

### /cache-list

**용도**: 냉장고에 있는 허브 목록 (캐시 가능한 허브들)

```
/cache-list
```

**동작 흐름**:

```
1. 02. hubs/ 폴더의 허브 노트 목록 조회
2. 각 허브의 캐시 상태 표시 (캐시됨/안됨)

3. 출력:
   "🗄️ 냉장고 (사용 가능한 허브):

    ✅ Context-Memory Integration (캐시됨)
    ✅ Tool-Hub (캐시됨)
    ⬜ Memory Systems (캐시 없음)
    ⬜ Optimization Patterns (캐시 없음)

    /load-cache \"허브이름\" 으로 로드하세요"
```

### /cache-refresh

**용도**: 특정 허브의 캐시를 강제로 새로고침

```
/cache-refresh "Context-Memory Integration"
```

**동작 흐름**:

```
1. 기존 캐시 파일 삭제
2. build_context() 다시 호출
3. 새 결과 저장

4. 출력:
   "🔄 Context-Memory Integration 캐시 갱신됨"
```

---

## 🔄 동작 흐름 다이어그램

### Cache Hit (빠른 경로)

```
/load-cache "허브"
    │
    ▼
캐시 파일 확인
    │
    ▼ (있음)
Read(.knowledge-cache/허브.json)    ← MCP 호출 없음!
    │
    ▼
Working Memory에 주입
    │
    ▼
"🧊 허브 로드됨"
```

### Cache Miss (느린 경로 - 처음만)

```
/load-cache "허브"
    │
    ▼
캐시 파일 확인
    │
    ▼ (없음)
mcp__basic-memory__build_context()  ← MCP 호출
    │
    ▼
Write(.knowledge-cache/허브.json)   ← 캐시 저장
    │
    ▼
Working Memory에 주입
    │
    ▼
"🧊 허브 로드됨 (새로 캐시됨)"
```

---

## 🆚 MCP CLI ToolCache와의 비교

| 측면 | MCP CLI ToolCache | Knowledge Cache |
|------|-------------------|-----------------|
| **목적** | 도구 목록 캐싱 | 지식 그래프 캐싱 |
| **저장 위치** | `~/.mcp-cli/cache/` | `.knowledge-cache/` |
| **키** | 서버 이름 | 허브 이름 |
| **값** | 도구 스키마 목록 | 엔티티 + 관계 + 관찰 |
| **만료** | TTL 24시간 | 수동 (`/cache-refresh`) |
| **로드** | CLI 시작 시 자동 | `/load-cache` 명시적 |

---

## 🎯 기대 효과

### Fast Path 확보

```
Before (매번 MCP 호출):
  질문 → build_context() → 응답 (느림)

After (캐시 활용):
  /load-cache "허브" (세션 시작 시 1회)
  질문 → 캐시에서 읽기 → 응답 (빠름)
  질문 → 캐시에서 읽기 → 응답 (빠름)
  ...
```

### 선택적 컨텍스트 로딩

```
작업 A: Tool-Hub 관련
  → /load-cache "Tool-Hub"
  → 해당 지식만 Working Memory에

작업 B: Memory 관련
  → /unload-cache "Tool-Hub"
  → /load-cache "Memory Systems"
  → 컨텍스트 전환
```

### 토큰 효율

- 필요한 허브만 로드 → 불필요한 지식이 컨텍스트 차지 안 함
- 캐시 파일에서 읽기 → MCP 왕복 비용 없음

---

## 📋 구현 체크리스트

### Phase 1: 기본 구조

- [ ] `.knowledge-cache/` 폴더 생성
- [ ] 캐시 파일 형식 정의 (JSON 스키마)
- [ ] `_index.json` 인덱스 파일 구조

### Phase 2: 핵심 커맨드

- [ ] `/load-cache` Skill 구현
  - [ ] slug 변환 로직
  - [ ] 캐시 hit/miss 분기
  - [ ] build_context 호출 및 저장
- [ ] `/unload-cache` Skill 구현
- [ ] `/cache-status` Skill 구현

### Phase 3: 보조 커맨드

- [ ] `/cache-list` Skill 구현
- [ ] `/cache-refresh` Skill 구현
- [ ] `/cache-clear` Skill 구현 (전체 캐시 삭제)

### Phase 4: 통합

- [ ] Three-Layer Memory Architecture 문서 업데이트
- [ ] 세션 시작 워크플로우에 통합
- [ ] 자동화 트리거 검토

---

## 🔗 관련 문서

| 문서 | 관계 | 설명 |
|------|------|------|
| [[Three-Layer Memory Architecture]] | 상위 설계 | Knowledge Cache가 속한 아키텍처 |
| [[Context-Memory Integration]] | 허브 예시 | 캐시 프로필로 사용될 허브 |
| [[MCP CLI LazyToolLoader Pattern]] | 영감 | ToolCache 패턴의 원본 |
| [[Tool-Hub Birth Background Claude Code to Progressive Disclosure]] | 맥락 | 전체 진화 과정 |

---

## Observations

- [idea] MCP CLI ToolCache 패턴을 Knowledge Cache에 적용: 캐시 미스 시에만 MCP 호출 #cache #lazy-loading
- [idea] 허브 노트 = 캐시 프로필: build_context의 시드로 활용 #hub #cache-profile
- [idea] 냉장고 모델: TTL 자동 만료 대신 사용자 주도 선택적 로드/언로드 #user-driven #manual
- [pattern] Fast path 확보: 세션 시작 시 /load-cache → 이후 캐시에서 읽기 #performance #fast-path
- [design] 캐시 파일 구조: entities + relations + observations JSON #data-structure
