---
title: Three-Layer Memory Architecture
type: note
tags:
- memory
- llm
- mcp
- context-engineering
- agemem
- sqlite
- obsidian
- knowledge-cache
- fast-slow
- basic-memory
- knowledge-graph
- derived
permalink: notes/three-layer-memory-architecture
source_facts:
- AgeMem (STM/LTM 분리, Progressive RL)
- DeepSeek Engram (Fast/Slow 메모리, O(1) 조회)
- KGGen (지식 그래프 생성, 트리플 구조)
- 카너먼 (시스템1/2 이중과정이론)
- Loftus (구성적 기억, 출처 추적)
---

# Three-Layer Memory Architecture

> ⚠️ **자체 설계 (Synthesis Note)**: 이 아키텍처는 AgeMem, DeepSeek Engram, KGGen 등 최신 연구를 종합하여 **자체 설계**한 프레임워크입니다. 표준화된 명칭이나 공식 사양은 아닙니다.

인간의 기억 시스템을 모방한 **3계층 메모리 관리 아키텍처**입니다.

## 🔬 도출 근거

### 핵심 사실의 조합

**사실 1**: AgeMem 연구에서 에이전트는 STM(단기 작업 이력)과 LTM(장기 지식)을 분리하여 관리할 때 성능이 향상됨을 보였다.

**사실 2**: DeepSeek Engram은 Fast path(O(1) 해시 조회)와 Slow path(신경망 추론)를 구분하여, 자주 쓰는 정보는 빠르게, 새 정보는 정확하게 처리한다.

**사실 3**: KGGen은 지식을 (주체-동사-객체) 트리플로 구조화하면 명시적 관계를 유지할 수 있음을 보였다.

**사실 4**: 카너먼의 시스템1(빠른 직관)과 시스템2(느린 분석)는 모든 도메인에 나타나는 패턴이다.

**사실 5**: Loftus의 기억 연구는 기억이 고정된 것이 아니라 재구성되므로, 출처를 명시적으로 기록해야 정확도가 높아짐을 보였다.

### 따라서

위 연구들의 패턴을 Claude Code 맥락에 적용하면:
- **Working Memory**: 현재 대화(컨텍스트 윈도우)
- **STM (Short-Term)**: 최근 작업 이력(orchestration.db)
- **LTM (Long-Term)**: 추출된 지식(Obsidian/Basic Memory)

이 세 계층을 명확히 분리하고, 자주 참조하는 지식은 Knowledge Cache로 미리 로드하면(Fast path), 컨텍스트를 컴팩트하게 유지하면서도 필요한 정보를 빠르게 찾을 수 있다.

---

## 📖 개요

**목표**: 컨텍스트를 컴팩트하게 유지하면서, 작업 이력(STM)과 지식(LTM)을 분리 관리

### 인간 기억 시스템과의 매핑

| 인간 기억                     | Claude 구현 | 저장소                       | 특성         |
| ------------------------- | --------- | ------------------------- | ---------- |
| **작업기억 (Working Memory)** | 컨텍스트 윈도우  | [[VRAM]] (KV-Cache)       | 지금 당장 쓰는 것 |
| **단기기억 (STM)**            | Task 이력   | SQLite (orchestration.db) | 최근 작업 기록   |
| **장기기억 (LTM)**            | 추출된 지식    | Obsidian / Basic Memory   | 영구 보존 지식   |
|                           |           |                           |            |

### 3계층 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│            1️⃣ Working Memory (작업기억)                      │
│               = Claude Code 컨텍스트 & KV-Cache              │
│               = Anthropic VRAM                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📦 Knowledge Cache (Fast Path)                     │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ • 핵심 트리플 (주체-동사-객체)                 │  │   │
│  │  │ • 프로젝트 컨텍스트                           │  │   │
│  │  │ • 자주 쓰는 개념 정의                         │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  + 현재 대화 + 시스템 프롬프트 + 로드된 STM/LTM 조각 │   │
│  │  → 최소한으로 유지! (COMPACT)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↑↓
         PRELOAD ↑ LOAD_CONTEXT ↑  ↓ LOG_TASK
┌─────────────────────────────────────────────────────────────┐
│            2️⃣ STM (단기기억) - Task 기반                     │
│               = SQLite (orchestration.db)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📋 작업 이력 (What)                                 │   │
│  │  - "어제 뭐 했지?" → 최근 task 조회                  │   │
│  │  - "지난주 작업 요약" → 기간별 집계                  │   │
│  │  - task_id, intent, output_summary, created_at      │   │
│  │                                                      │   │
│  │  ⏰ 시간 기반 검색                                   │   │
│  │  - 오늘 / 어제 / 이번주 / 지난주 / 이번달           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↑↓
              RETRIEVE ↑     ↓ REMEMBER
┌─────────────────────────────────────────────────────────────┐
│            3️⃣ LTM (장기기억) - 지식 기반                     │
│               = Obsidian / Basic Memory / Graph Memory      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📚 추출된 지식 (Know-how)                           │   │
│  │  - 개념 정의 (_concepts/)                           │   │
│  │  - 아키텍처 (architectures/)                        │   │
│  │  - 패턴/가이드 (patterns/)                          │   │
│  │  - 주의사항 (gotchas/)                              │   │
│  │                                                      │   │
│  │  👤 사용자 주도 관리                                 │   │
│  │  - 뭘 저장할지 직접 결정                            │   │
│  │  - 구조/태그 직접 설계                              │   │
│  │  - 위키링크로 그래프 연결                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 각 계층의 역할

| 계층 | 질문 유형 | 예시 |
|------|----------|------|
| **Working Memory** | "지금 뭐 하고 있지?" | 현재 대화 맥락 |
| **STM** | "어제/지난주 뭐 했지?" | task-20260120-003 완료 |
| **LTM** | "BM25가 뭐였지?" | 키워드 매칭 검색 알고리즘 |

## 🚀 Knowledge Cache: Fast Path 구현

> **핵심 아이디어**: "추출된 구조화된 지식을 캐시로 넣는다"
> — Fast-Slow 패턴(카너먼 시스템1/2, Engram, KGGen 등 다수 도메인에서 반복되는 구조)에서 착안

### Fast-Slow 패턴과 Knowledge Cache

| | Fast (빠름/저렴) | Slow (느림/정확) |
|---|-----------------|-----------------|
| **Engram** | 해시 조회 O(1) | 신경망 추론 |
| **KGGen** | 벡터 유사도 | LLM 검증 |
| **카너먼** | 시스템1 (직관) | 시스템2 (분석) |
| **3계층 아키텍처** | **Knowledge Cache** | LTM 검색 |

기존 방식은 모든 검색이 Slow path를 거침:
```
Query → LTM 검색 (느림) → 결과 반환 → Working Memory
```

Knowledge Cache 적용 후:
```
세션 시작 시:
  LTM → 핵심 지식 추출 → Knowledge Cache에 미리 로드 (Fast)

세션 중:
  Query → [1] Cache 조회 (O(1)) → 있으면 즉시 사용 ✓
          [2] 없으면 → LTM 검색 (Slow) → 결과 캐싱
```

### Knowledge Cache에 포함될 내용

**1. 핵심 트리플 (KGGen 방식)**
```markdown
## 핵심 트리플
- (Fast-Slow) --[is_pattern_in]--> (시스템1/2, Engram, KGGen, Cache)
- (Working Memory) --[is]--> (VRAM의 KV-Cache)
- (Engram) --[combines]--> (심볼릭 + 커넥셔니스트)
- (BM25) --[improves]--> (TF-IDF)
```

**2. 프로젝트 컨텍스트**
```markdown
## 프로젝트 컨텍스트
- 현재 작업: 3계층 메모리 아키텍처 구현
- 관련 노트: AgeMem, 지식 저장의 원리, KGGen
- 핵심 원칙: "미래의 나는 바보다" → 출처 기록 필수
```

**3. 자주 참조하는 개념 (압축)**
```markdown
## 핵심 개념 (Quick Reference)
- BM25: 키워드 매칭 검색, TF-IDF 개선판
- Contextual Retrieval: 청크에 문서 맥락 추가
- KV-Cache: 어텐션 키/밸류 저장, VRAM에 위치
```

### Knowledge Cache vs Engram 비교

| Engram (DeepSeek) | Knowledge Cache (3계층) |
| ----------------- | --------------------- |
| 해시 테이블 (RAM)      | 구조화된 지식 (컨텍스트 윈도우)    |
| 신경망 (GPU)         | LTM 검색 (Basic Memory) |
| 정적 사실 조회 O(1)     | 미리 로드된 트리플 즉시 참조      |
| 동적 관계 추론          | 새 지식 검색 + 연결          |
| 75% 추론 / 25% 조회   | 상황에 따라 비율 조정          |

### Knowledge Cache 구현 방안

**Option A: Basic Memory observation 활용 (권장)**

Basic Memory의 `observation` 테이블을 활용하여 구조화된 사실을 자동 추출:

```markdown
## 노트 작성 시 (사용자)
- [fact] BM25는 TF-IDF를 개선한 키워드 검색 알고리즘이다
- [fact] KV-Cache는 VRAM에 저장된다
- [opinion] Engram이 가장 혁신적인 접근이다

## Knowledge Cache 로드 시 (자동)
SELECT content FROM observation WHERE category='fact'
→ "BM25는 TF-IDF를 개선한 키워드 검색 알고리즘이다"
→ "KV-Cache는 VRAM에 저장된다"
```

**Option B: build_context 그래프 탐색**

특정 노트에서 시작하여 연결된 지식을 depth 기반으로 로드:

```python
# /load-cache 내부 구현
result = build_context(
    url="memory://notes/three-layer-memory-architecture",
    depth=2,
    max_related=10,
    project="obsidian-kb"
)
# → 관련 entity + relation 자동 로드
```

**Option C: CLAUDE.md 확장**

정적 Knowledge Cache를 CLAUDE.md에 직접 포함:

```markdown
# CLAUDE.md 에 추가

## Knowledge Cache

### 핵심 트리플
- (Fast-Slow) --[is_pattern]--> (시스템1/2, Engram, KGGen)
- (Working Memory) --[is]--> (VRAM의 KV-Cache)

### 핵심 사실 (observation.category='fact')
- BM25: 키워드 매칭 검색, TF-IDF 개선판
- Contextual Retrieval: 청크에 문서 맥락 추가
```

**Option D: 하이브리드 (권장)**

```
/load-cache 실행 시:
  1. build_context() → 최근 활동 기반 그래프 로드
  2. observation WHERE category='fact' → 핵심 사실 추출
  3. entity.entity_metadata → 프론트매터 활용
  4. 결과를 압축하여 Working Memory에 주입
```

### Knowledge Cache 커맨드

| 커맨드 | 동작 | 설명 |
|--------|------|------|
| `/load-cache` | PRELOAD | LTM에서 핵심 지식 로드 |
| `/cache-status` | INFO | 현재 캐시된 지식 표시 |
| `/update-cache` | REFRESH | 캐시 내용 갱신 |
| `/clear-cache` | RESET | 캐시 비우기 |

### 워크플로우 통합

```
1️⃣ 세션 시작
   ├→ /load-cache: Knowledge Cache 로드 (Fast path 준비)
   └→ /tasks today: 오늘 작업 확인 (STM)

2️⃣ 대화 중
   ├→ Cache hit: 즉시 응답 (Fast) ✓
   └→ Cache miss: /recall → LTM 검색 (Slow) → 캐시 추가

3️⃣ 세션 종료
   └→ /update-cache: 새로 발견한 핵심 지식으로 캐시 갱신
```

### Knowledge Cache의 장점

| 장점 | 설명 |
|------|------|
| **응답 속도** | 자주 쓰는 지식 즉시 참조 |
| **컨텍스트 효율** | 필요한 것만 미리 로드 |
| **일관성** | 세션 내 동일한 정의 사용 |
| **커스터마이징** | 프로젝트/작업별 캐시 프로필 |

### Knowledge Cache의 한계

| 한계 | 대응 |
|------|------|
| **캐시 크기** | 핵심만 선별 (트리플 형식) |
| **업데이트 비용** | 세션 종료 시 일괄 갱신 |
| **캐시 무효화** | LTM 변경 시 자동 감지 필요 |
| **콜드 스타트** | 기본 캐시 프로필 준비 |

## 🎯 3계층별 도구 매핑

### 1️⃣ Working Memory 관리

| 커맨드 | 동작 | 설명 |
|--------|------|------|
| `/load-cache` | PRELOAD | Knowledge Cache 로드 (Fast path) |
| `/cache-status` | INFO | 캐시된 지식 표시 |
| `/update-cache` | REFRESH | 캐시 내용 갱신 |
| `/compact` | SUMMARY | 현재 컨텍스트 압축 |
| `/forget` | FILTER | 특정 주제 무시 지시 |
| `/clear` | RESET | 컨텍스트 완전 초기화 |
| `/status` | INFO | 현재 토큰 사용량 확인 |

### 2️⃣ STM (Task DB) 관리

| 커맨드 | SQL 동작 | 설명 |
|--------|----------|------|
| `/log` | INSERT | 현재 작업을 task로 기록 |
| `/tasks` | SELECT | 최근 task 목록 조회 |
| `/tasks today` | SELECT WHERE | 오늘 작업 조회 |
| `/tasks week` | SELECT WHERE | 이번주 작업 조회 |
| `/task-summary` | SELECT + LLM | 기간별 작업 요약 |

**STM 저장소**: `orchestration.db`
```sql
SELECT task_id, intent, output_summary, created_at
FROM orchestration_log
WHERE created_at > datetime('now', '-7 days')
ORDER BY created_at DESC;
```

### 3️⃣ LTM (Knowledge Base) 관리

| 커맨드 | MCP 도구 | 설명 |
|--------|----------|------|
| `/remember` | `write_note` | 지식을 LTM에 저장 |
| `/recall` | `search_notes` | LTM에서 검색 → Working Memory로 |
| `/update-knowledge` | `edit_note` | 기존 지식 수정 |
| `/browse` | `list_directory` | LTM 구조 탐색 |

**LTM 저장소**: Obsidian vault (Basic Memory)

## 🛠️ 커맨드 설계

### Working Memory 커맨드

#### `/compact` - 컨텍스트 압축

```
사용법: /compact

내부 동작:
  1. 현재까지 대화 분석
  2. 핵심만 추출하여 요약
  3. 요약본으로 컨텍스트 "재구성" 효과

출력:
  "📦 컨텍스트 압축 완료:
   - 주제: 3계층 메모리 아키텍처
   - 핵심: Working Memory / STM(Task) / LTM(지식) 분리
   - 다음 단계: 커맨드 구현"
```

#### `/forget` - 특정 주제 무시

```
사용법: /forget [키워드/주제]

예시:
  /forget "잡담"
  /forget "아까 고양이 얘기"

내부 동작:
  1. 해당 주제를 "무시 목록"에 추가
  2. 이후 응답 시 해당 내용에 어텐션 가중치 낮춤
```

---

### STM (Task DB) 커맨드

#### `/log` - 작업 기록

```
사용법: /log [작업 설명]
또는: /log (현재 대화에서 자동 추출)

예시:
  /log "3계층 메모리 아키텍처 문서 작성"

내부 동작:
  1. task_id 생성 (task-YYYYMMDD-NNN)
  2. orchestration.db에 INSERT
  3. 확인 메시지

SQL:
  INSERT INTO orchestration_log
    (task_id, created_at, intent, target, status)
  VALUES
    ('task-20260121-007', '2026-01-21T15:30:00',
     '3계층 메모리 아키텍처 문서 작성', 'obsidian', 'completed');
```

#### `/tasks` - 작업 조회

```
사용법:
  /tasks           → 최근 10개
  /tasks today     → 오늘 작업
  /tasks yesterday → 어제 작업
  /tasks week      → 이번주 작업
  /tasks month     → 이번달 작업

출력:
  "📋 이번주 작업 (5건):
   - task-20260121-007: 3계층 메모리 아키텍처 문서 작성 ✅
   - task-20260121-006: TF-IDF 개념 노트 생성 ✅
   - task-20260120-003: BM25 노트 생성 ✅
   ..."
```

#### `/task-summary` - 기간 요약

```
사용법: /task-summary [기간]

예시:
  /task-summary week
  /task-summary "2026-01"

출력:
  "📊 이번주 작업 요약:
   - 총 12건 완료
   - 주요 주제: 메모리 아키텍처, 검색 알고리즘
   - 생성 노트: 8개
   - 패턴: 개념 학습 → 문서화 → 아키텍처 설계"
```

---

### LTM (Knowledge Base) 커맨드

#### `/remember` - 지식 저장

```
사용법: /remember [제목] [내용]
또는: /remember (이전 대화 자동 요약 저장)

예시:
  /remember "BM25 핵심" "키워드 매칭 기반 검색 알고리즘, TF-IDF 개선판"
  /remember  ← 최근 대화에서 핵심 추출하여 저장

내부 동작:
  1. 내용 분석 → 적절한 폴더/태그 결정
  2. Basic Memory write_note 호출
  3. 저장 확인 메시지
```

#### `/recall` - 지식 검색

```
사용법: /recall [검색어]

예시:
  /recall "BM25"
  /recall "메모리 관리"

내부 동작:
  1. Basic Memory search_notes 호출
  2. 관련 노트 내용을 Working Memory에 로드
  3. "다음 정보를 LTM에서 불러왔습니다: ..."
```

---

### `/memory-status` - 전체 상태 확인

```
사용법: /memory-status

출력:
  "🧠 3계층 메모리 상태:

   1️⃣ Working Memory (컨텍스트): ~15,000 토큰

   2️⃣ STM (orchestration.db):
      - 오늘: 3건
      - 이번주: 12건
      - 전체: 127건

   3️⃣ LTM (Basic Memory):
      - 노트: 89개
      - 폴더: _concepts(52), architectures(15), patterns(22)

   최근 로드: BM25.md, Contextual Retrieval.md"
```

## 🗄️ LTM 실제 구현: Basic Memory DB 스키마

> 상세 스키마: [[03. sources/reviews/basic-memory-db-schema|Basic Memory DB 스키마 문서]]

Basic Memory는 **이미 KGGen과 유사한 지식 그래프 구조**를 구현하고 있습니다.

### DB 위치 및 테이블 구조

```
~/.basic-memory/memory.db (SQLite)

┌─────────────────────────────────────────────────────────────┐
│  entity (노드)            ← KGGen의 "명사"                   │
│  ├── id, title, entity_type, permalink                     │
│  ├── file_path, checksum, mtime                            │
│  └── entity_metadata (JSON) ← 프론트매터!                   │
├─────────────────────────────────────────────────────────────┤
│  relation (엣지)          ← KGGen의 "동사"                   │
│  ├── from_id → to_id (또는 to_name)                        │
│  ├── relation_type (relates_to, implements, extends...)    │
│  └── context                                               │
├─────────────────────────────────────────────────────────────┤
│  observation (관찰)       ← 노트 내 개별 사실               │
│  ├── entity_id (FK)                                        │
│  ├── content, category (fact, opinion, question)           │
│  └── tags (JSON)                                           │
├─────────────────────────────────────────────────────────────┤
│  search_index (FTS5)      ← 전문 검색                       │
│  └── BM25 대체 가능                                         │
└─────────────────────────────────────────────────────────────┘
```

### 3계층 아키텍처와 Basic Memory 매핑

| 3계층 설계 | Basic Memory 테이블 | 용도 |
|-----------|---------------------|------|
| Entity (명사) | `entity` | 각 노트 = 하나의 엔티티 |
| Relation (동사) | `relation` | `[[링크]]` → 자동 추출 |
| 트리플 | `from_id → relation_type → to_id` | 지식 그래프 엣지 |
| **Observation** | `observation` | **노트 내 개별 사실** |
| 검색 | `search_index` | FTS5 전문 검색 |

### 핵심 발견: observation 테이블

`observation`은 **Knowledge Cache의 소스**가 될 수 있습니다:

```markdown
## Observations
- [fact] Python은 인터프리터 언어다
- [opinion] 가독성이 좋다
- [question] GIL 문제는 어떻게 해결?
```

→ Basic Memory가 자동으로 `observation` 테이블에 저장:
- `category = 'fact'` → Knowledge Cache에 로드할 핵심 사실
- `category = 'opinion'` → 해석/의견
- `category = 'question'` → 미해결 질문

### Knowledge Cache용 SQL 쿼리

```sql
-- 1. 핵심 사실 추출 (category='fact')
SELECT e.title, o.content, o.category
FROM observation o
JOIN entity e ON o.entity_id = e.id
WHERE o.category = 'fact'
AND e.updated_at > datetime('now', '-7 days')
LIMIT 50;

-- 2. 트리플 추출 (relation 테이블)
SELECT
  e1.title as from_entity,
  r.relation_type,
  COALESCE(e2.title, r.to_name) as to_entity
FROM relation r
JOIN entity e1 ON r.from_id = e1.id
LEFT JOIN entity e2 ON r.to_id = e2.id
WHERE e1.updated_at > datetime('now', '-7 days');

-- 3. 가장 연결이 많은 엔티티 (허브 노드)
SELECT e.title, COUNT(r.id) as connections
FROM entity e
JOIN relation r ON r.from_id = e.id OR r.to_id = e.id
GROUP BY e.id
ORDER BY connections DESC
LIMIT 10;
```

### Basic Memory MCP 도구와 매핑

| MCP 도구 | 내부 동작 | Knowledge Cache 활용 |
|----------|----------|---------------------|
| `build_context(url, depth)` | entity + relation 그래프 탐색 | 관련 트리플 로드 |
| `search_notes(query)` | search_index FTS5 검색 | 키워드 검색 |
| `recent_activity(timeframe)` | entity/relation 최신순 | 최근 활동 추적 |
| `read_note(identifier)` | entity 조회 | 전체 내용 로드 |

## 🧠 LTM 지식 구조 (Engram + KGGen 기반)

### 이론적 배경

세 가지 연구가 같은 패턴을 보여줌:

| | 정적/빠름 (시스템1) | 동적/느림 (시스템2) |
|---|----------|----------|
| **카너먼** | 직관적 판단 | 분석적 사고 |
| **KGGen** | 명사 (벡터 임베딩) | 동사 (규칙 기반) |
| **Engram** | 사실 (해시 O(1)) | 관계/추론 (신경망) |

**핵심 통찰**: Obsidian vault는 하이브리드
- 노트 내용 = Engram처럼 (동적, 맥락 의존)
- 노트 간 링크 = KGGen처럼 (정적, 명시적 관계)

### LTM 저장 원칙 (Loftus 기반)

> "미래의 나는 바보다" — 지금 확신하는 것도 재구성될 수 있다.

| 원칙 | 설명 | 예시 |
|------|------|------|
| **맥락** | 왜 찾았는지 기록 | "AgeMem 구현하려고 찾음" |
| **사실 + 출처** | 출처 없는 사실 = 시스템1의 착각 | "출처: AgeMem 논문 p.5" |
| **관계** | 명시적 연결 (동사로) | `[[A]] --개선함--> [[B]]` |
| **해석 분리** | 사실 vs 내 생각 구분 | "## 내 해석" 섹션 |

### LTM 구조: Engram 단위

```
지식 단위 (Engram)
├── Entity (명사/엔티티)
│   ├── 고유 ID
│   ├── 유형: concept, pattern, gotcha, decision...
│   └── 벡터 임베딩 (검색용)
│
├── Relations (동사/관계)
│   ├── 명시적: [[위키링크]]
│   ├── 의미적: "개선함", "기반이 됨", "비교됨"
│   └── 시간적: created_at, updated_at
│
└── Context (맥락)
    ├── 왜 저장했나 (intent)
    ├── 출처 (source)
    └── 내 해석 (interpretation)
```

### LTM 폴더 구조

```
knowledge-base/
│
├── knowledge/                  ← Engrams (지식 단위)
│   ├── _concepts/              ← 명사/엔티티 (정적)
│   │   ├── BM25.md
│   │   ├── TF-IDF.md
│   │   └── Attention.md
│   │
│   ├── patterns/               ← 동사/관계 (동적)
│   │   └── how-X-improves-Y.md
│   │
│   ├── architectures/          ← 구조/설계
│   │   └── Three-Layer Memory Architecture.md
│   │
│   └── gotchas/                ← 주의사항/예외
│
├── notes/                      ← 맥락 포함 기록
│   ├── 지식 저장의 원리 - 카너먼 Loftus KGGen.md
│   └── KGGen 이해 - 명사 통합과 동사 관계.md
│
└── reviews/                    ← 외부 지식 리뷰
    └── AgeMem-paper-review.md
```

### KGGen 스타일 관계 표현

노트 간 관계를 **동사**로 명시:

```markdown
## 관계

- [[BM25]] — `기반이 됨` → [[TF-IDF]]
- [[Engram]] — `구조가 유사함` → [[시스템1-2]]
- [[KGGen]] — `비교됨` → [[Engram]]
```

### 검색 전략 (Hybrid)

| 검색 유형 | 방식 | 용도 |
|----------|------|------|
| **키워드** | BM25 | "BM25가 뭐지?" |
| **의미적** | 벡터 검색 | "검색 알고리즘 관련" |
| **그래프** | 링크 탐색 | "BM25와 연결된 개념들" |

```
/recall "검색 알고리즘"
  │
  ├── BM25 검색 (키워드 매칭)
  ├── 벡터 유사도 (의미 검색)
  └── 그래프 탐색 (연결된 노트)
```

## 🔄 워크플로우

### 일반 대화 흐름 (3계층 활용)

```
1️⃣ 새 대화 시작
   ├→ /tasks week: "지난주에 뭐 했더라?" (STM 조회)
   └→ /recall: 관련 지식 로드 (LTM → Working Memory)

2️⃣ 대화 진행
   ├→ 작업 완료 시 /log (→ STM에 기록)
   └→ 인사이트 발생 시 /remember (→ LTM에 저장)

3️⃣ 컨텍스트 길어짐
   ├→ /compact: 컨텍스트 압축 (Working Memory 정리)
   └→ /forget: 불필요한 주제 무시

4️⃣ 대화 종료 전
   ├→ /log: 오늘 작업 기록 (→ STM)
   └→ /remember: 핵심 지식 저장 (→ LTM)

5️⃣ 다음 세션
   ├→ /tasks: "어제 뭐 했지?" (STM에서)
   └→ /recall: 관련 지식 복원 (LTM에서)
```

### 계층 간 데이터 흐름

```
                    /compact, /forget
                          ↓
Working Memory ←──────────────────────── (압축/필터)
       ↑
       │ /recall          │ /log
       │ (지식 로드)       │ (작업 기록)
       ↓                  ↓
     LTM ←─────────────→ STM
   (지식)    /task-summary (작업)
           "이번주 뭐 배웠지?"
              → STM 조회
              → 관련 LTM 연결
```

### 자동화 가능 영역

| 트리거 | 자동 동작 | 계층 |
|--------|----------|------|
| 컨텍스트 > 50K 토큰 | `/compact` 제안 | Working Memory |
| 작업 완료 키워드 | `/log` 자동 실행 | STM |
| "기억해" 키워드 | `/remember` 실행 | LTM |
| "지난번에" 언급 | `/tasks` + `/recall` | STM + LTM |
| 새 대화 시작 | 오늘 task 요약 표시 | STM |
| 대화 30분 경과 | `/memory-status` 표시 |

## 🏗️ 구현 옵션

### Option A: Skills (슬래시 커맨드)

Claude Code의 Skills 시스템으로 구현:

```
skills/
├── memory-log.md       # /log - STM에 task 기록
├── memory-tasks.md     # /tasks - STM에서 task 조회
├── memory-remember.md  # /remember - LTM에 지식 저장
├── memory-recall.md    # /recall - LTM에서 검색
├── memory-compact.md   # /compact - 컨텍스트 압축
└── memory-status.md    # /memory-status - 전체 상태
```

### Option B: MCP 서버

전용 MCP 서버로 구현:

```typescript
// three-layer-memory MCP 서버

const tools = {
  // 2️⃣ STM (Task DB) 도구
  log_task: {
    description: "Log current task to STM (orchestration.db)",
    parameters: { intent: string, target?: string },
    handler: async ({ intent, target = 'obsidian' }) => {
      const taskId = generateTaskId();
      await sqlite.run(`
        INSERT INTO orchestration_log (task_id, created_at, intent, target, status)
        VALUES (?, datetime('now'), ?, ?, 'completed')
      `, [taskId, intent, target]);
      return `Logged: ${taskId}`;
    }
  },

  get_tasks: {
    description: "Query tasks from STM",
    parameters: { period: 'today' | 'yesterday' | 'week' | 'month' },
    handler: async ({ period }) => {
      const dateFilter = getPeriodFilter(period);
      return await sqlite.all(`
        SELECT task_id, intent, created_at
        FROM orchestration_log
        WHERE ${dateFilter}
        ORDER BY created_at DESC
      `);
    }
  },

  // 3️⃣ LTM (Knowledge) 도구
  remember: {
    description: "Save knowledge to LTM (Obsidian)",
    parameters: { title: string, content: string, folder?: string },
    handler: async ({ title, content, folder = 'memory/insights' }) => {
      // Basic Memory write_note 호출
    }
  },

  recall: {
    description: "Search LTM and load to Working Memory",
    parameters: { query: string },
    handler: async ({ query }) => {
      // Basic Memory search_notes → 결과 반환
    }
  },

  // 전체 상태
  memory_status: {
    description: "Show 3-layer memory status",
    handler: async () => {
      const stmStats = await getSTMStats();
      const ltmStats = await getLTMStats();
      return formatMemoryStatus(stmStats, ltmStats);
    }
  }
};
```

## ⚖️ 트레이드오프

| 장점 | 단점 |
|------|------|
| 컨텍스트 비용 절감 | 검색 오버헤드 |
| 작업 이력 추적 (STM) | 3개 저장소 관리 |
| 영구 지식 보존 (LTM) | 수동 정리 필요 |
| 세션 간 연속성 | 초기 설정 비용 |
| 사용자 주도 관리 | 습관 형성 필요 |

## 🔗 관련 개념

### 이론적 배경
- Fast-Slow 패턴 (카너먼 시스템1/2 등 다수 도메인에서 반복) - Knowledge Cache의 이론적 기반
- [[AgeMem-paper-review|AgeMem 논문 리뷰]] - STM/LTM 에이전트 메모리
- [[지식 저장의 원리 - 카너먼 Loftus KGGen|지식 저장의 원리]] - 카너먼 시스템1/2 + Loftus 기억 연구
- [[KGGen 이해 - 명사 통합과 동사 관계|KGGen 이해]] - 명사(벡터) + 동사(규칙) 지식 그래프
- [[심볼릭 AI vs 커넥셔니스트 AI 역사|심볼릭 vs 커넥셔니스트]] - "조회는 맞고 구축이 문제"
- [[시스템1-2와 기억 재구성|시스템1-2와 기억]] - 빠른 인출 ≠ 정확한 것

### Working Memory (1계층)
- [[kv-cache-optimization|KV-Cache Optimization]] - Working Memory의 실체
- [[Cache]] - 캐시 기본 개념
- [[VRAM]] - Working Memory 물리적 위치
- [[Attention]] - 검색/무시의 메커니즘

### STM & LTM (2, 3계층)
- [[RAM]] - 메모리 기본 개념
- [[Contextual Retrieval]] - LTM 검색 개선 기법
- [[BM25]] - 키워드 검색 알고리즘
- [[TF-IDF]] - BM25의 기반 개념
- [[03. sources/reviews/basic-memory-db-schema|Basic Memory DB 스키마]] - LTM 실제 구현 (entity/relation/observation)
- [[basic-memory-relation-customization|관계 커스터마이징 가이드]] - relation_type 자유 정의

## 📋 구현 체크리스트

### Knowledge Cache (Fast Path)
- [ ] Knowledge Cache 형식 정의 (트리플 + 컨텍스트 + 개념)
- [ ] `/load-cache` 커맨드 구현
  - [ ] `build_context()` 활용 그래프 탐색
  - [ ] `observation` 테이블 fact 추출 쿼리
  - [ ] 결과 압축 포맷 정의
- [ ] `/cache-status` 커맨드 구현
- [ ] `/update-cache` 커맨드 구현
- [ ] 기본 캐시 프로필 작성
- [ ] 노트에 `[fact]`, `[opinion]` 마커 사용 가이드

### Working Memory 관리
- [ ] `/compact` 커맨드 구현
- [ ] `/forget` 커맨드 구현

### STM (Task DB)
- [ ] `/log` 커맨드 구현
- [ ] `/tasks` 커맨드 구현 (today/week/month)
- [ ] `/task-summary` 커맨드 구현
- [ ] orchestration.db 스키마 확인

### LTM (Knowledge Base)
- [ ] `/remember` 커맨드 구현
- [ ] `/recall` 커맨드 구현
- [ ] `/browse` 커맨드 구현
- [ ] LTM 폴더 구조 설계

### 통합
- [ ] `/memory-status` 커맨드 구현
- [ ] 자동화 트리거 설정 (선택)
- [ ] MCP 서버 래퍼 (선택)

---

**난이도**: 고급
**카테고리**: Architecture
**마지막 업데이트**: 2026년 1월 22일

---

## Observations

- [method] Fast-Slow 패턴은 모든 도메인에서 반복되는 구조: AgeMem(STM/LTM), DeepSeek Engram(Quick/Deep), 카너먼(시스템1/2) #fast-slow
- [method] 지식을 (주체-동사-객체) 트리플로 구조화하면 명시적 관계 추적 가능 (KGGen 방식) #knowledge-graph
- [method] Knowledge Cache = "자주 쓰는 정보는 미리 로드, 필요할 때만 LTM 검색" (Engram의 O(1) + Fast path) #caching
- [fact] AgeMem 연구: STM(최근 작업)/LTM(지식) 분리 시 에이전트 성능 향상 #research
- [fact] DeepSeek Engram: Fast path(해시 O(1)) + Slow path(신경망), 75% 추론/25% 조회 비율 #architecture
- [fact] Basic Memory DB: entity(명사), relation(동사), observation(사실)으로 KGGen과 유사하게 구현됨 #implementation
- [fact] Loftus 기억 연구: 기억은 고정된 것이 아니라 재구성되므로 출처 명시 필수 #psychology
- [decision] Working Memory: 현재 대화 + KV-Cache (VRAM) #layer-1
- [decision] STM: orchestration.db에 task 이력 저장 (시간 기반 검색) #layer-2
- [decision] LTM: Obsidian/Basic Memory에 구조화된 지식 저장 (그래프 기반 검색) #layer-3
- [decision] Knowledge Cache: observation.category='fact'를 세션 시작 시 미리 로드 #optimization
- [example] Knowledge Cache 쿼리: `SELECT content FROM observation WHERE category='fact' AND created_at > datetime('now', '-7 days')` #sql
- [example] 3계층 명령어: `/load-cache`(전 세션), `/tasks today`(오늘 작업), `/recall "BM25"`(지식 검색) #commands
- [example] 트리플 표현: (Fast-Slow) --[is_pattern_in]--> (Engram, KGGen, 카너먼) #triple
- [question] 세션 중 새로운 사실이 발견되면 Knowledge Cache 어떻게 갱신할 것인가? → `/update-cache` 제안 #cache-invalidation
- [question] 3개 저장소(Working/STM/LTM) 동기화 비용은 얼마나 되는가? → 측정 필요 #performance
- [question] Knowledge Cache의 최적 크기는? → 프로젝트별 프로필 필요 #tuning
- [reference] Fast-Slow 패턴 (카너먼 시스템1/2 등) - 이 아키텍처의 이론적 기반 #source
- [reference] [[AgeMem-paper-review|AgeMem 논문 리뷰]] - STM/LTM 도구 상세 #source
- [reference] [[03. sources/reviews/basic-memory-db-schema|Basic Memory DB 스키마]] - LTM 실제 구현 #source

---

## 📚 참고문헌

### 학술 논문/연구
| 출처 | 핵심 차용 개념 | 링크 |
|------|---------------|------|
| **AgeMem** (arXiv 2601.01885, 2026.01) | STM/LTM 분리, 6개 메모리 도구, Progressive RL | [arXiv](https://arxiv.org/abs/2601.01885) |
| **DeepSeek Engram** (2026.01.12) | Fast/Slow 분리, 75%추론/25%조회 비율, O(1) 해시 조회 | [GitHub](https://github.com/deepseek-ai/Engram), [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/deepseek-touts-memory-breakthrough-engram) |
| **KGGen** (NeurIPS 2025) | 트리플 구조, 엔티티 해결, 지식 그래프 자동 생성 | [NeurIPS](https://neurips.cc/virtual/2025/poster/117386), [GitHub](https://github.com/stair-lab/kg-gen) |
| **카너먼** | 시스템1/2 이중과정이론 | *Thinking, Fast and Slow* (2011) |
| **Loftus** | 구성적 기억, 출처 추적의 중요성 | 기억 연구 (1970s~) |

### 볼트 내 자체 문서
| 문서 | 역할 |
|------|------|
| [[03. sources/reviews/basic-memory-db-schema|Basic Memory DB 스키마]] | LTM 실제 구현 (entity/relation/observation) |
| [[AgeMem-paper-review|AgeMem 논문 리뷰]] | STM/LTM 도구 상세 |
| [[KGGen - Knowledge Graph Generation Framework]] | 트리플 추출 방법론 |

### 자체 정의 개념
> 아래 개념들은 이 문서에서 정의한 것으로, 일반적인 학술 용어가 아닙니다.

- **Three-Layer Memory Architecture**: 이 문서 전체
- **Knowledge Cache**: Engram의 Fast path를 Basic Memory에 적용한 아이디어
- **Fast-Slow 패턴**: 카너먼 시스템1/2, Engram, KGGen 등 여러 도메인에서 반복되는 Fast/Slow 이중구조를 추상화한 메타 개념 (별도 노트 없음, 이 문서 내 "Fast-Slow 패턴과 Knowledge Cache" 섹션 참조)

---

## 🏷️ Meta

**도출일**: 2026-01-21
**출처**: AgeMem(STM/LTM 분리), DeepSeek Engram(Fast-Slow 메모리), KGGen(트리플 구조), 카너먼(시스템1/2), Loftus(구성적 기억) 등 다섯 가지 독립적인 연구를 종합하여 Claude Code 맥락에 맞게 재설계한 아키텍처 프레임워크
**상태**: draft (구현 체크리스트 기반으로 개선 중)