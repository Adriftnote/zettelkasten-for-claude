# ryu-memory Architecture Guide

## 전체 구조

```
                          사용자
                            │
                    ┌───────┴───────┐
                    │   CLI (bm)    │
                    │   MCP Server  │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────┴─────┐ ┌────┴────┐ ┌──────┴──────┐
        │  Services  │ │ Repos   │ │  External   │
        │            │ │         │ │             │
        │ embed      │ │ bm_read │ │ embed_srv   │
        │ classify   │ │ vector  │ │ (BGE-M3)    │
        │ discover   │ │ meta    │ │             │
        │ recall     │ │ discover│ │ ollama      │
        └─────┬──────┘ └────┬────┘ │ (gemma3)    │
              │              │     └──────┬──────┘
              │              │            │
    ┌─────────┴──────────────┴────────────┘
    │
    │   ┌─────────────────┐    ┌──────────────────┐
    │   │  Fast DB (R/O)  │    │  Slow DB (R/W)   │
    │   │  ATTACH AS bm   │    │  ryu-memory.db   │
    │   │                 │    │                  │
    │   │  entity         │    │  entity_embed    │
    │   │  relation       │    │  memory_meta     │
    │   │  observation    │    │  discovered_rel  │
    │   │  search_index   │    │  process_log     │
    │   └─────────────────┘    └──────────────────┘
    │   ~/.basic-memory/        ~/.ryu-memory/
    │   memory.db               ryu-memory.db
    └──────────────────────────────────────────────
```

---

## DB 구조

### Fast DB (Basic Memory) — READ ONLY

BM이 관리. ryu-memory는 `ATTACH DATABASE ... AS bm`으로 읽기만.

```
bm.entity                              bm.relation
┌──────────────────────────┐            ┌─────────────────────────┐
│ id          INTEGER PK   │            │ id            INTEGER PK│
│ title       TEXT         │←──────────│ from_id       INTEGER FK│
│ entity_type TEXT         │            │ to_id         INTEGER FK│
│ permalink   TEXT         │            │ to_name       TEXT      │
│ file_path   TEXT         │            │ relation_type TEXT      │
│ checksum    TEXT         │            │ context       TEXT      │
│ entity_metadata JSON    │            │ project_id    INTEGER   │
│ project_id  INTEGER     │            └─────────────────────────┘
│ mtime       FLOAT       │
│ size        INTEGER     │            bm.observation
└──────────────────────────┘            ┌─────────────────────────┐
                                        │ id            INTEGER PK│
각 노트 = 1 entity                      │ entity_id     INTEGER FK│
file_path = vault 내 상대경로            │ content       TEXT      │
checksum = SHA-256 (변경 감지)           │ category      TEXT      │
                                        │ tags          JSON      │
                                        │ project_id    INTEGER   │
                                        └─────────────────────────┘
```

### Slow DB (ryu-memory) — READ/WRITE, 재생성 가능

```
entity_embed (sqlite-vec)               memory_meta
┌──────────────────────────┐            ┌─────────────────────────┐
│ entity_id  INTEGER PK    │            │ entity_id    INTEGER PK │
│ embedding  float[1024]   │            │ memory_type  TEXT       │
│            (BGE-M3)      │            │  → world               │
└──────────────────────────┘            │  → experience          │
                                        │  → mental_model        │
bm.entity.id와 동일한 PK               │ confidence   REAL      │
                                        └─────────────────────────┘

discovered_relation                     process_log
┌──────────────────────────┐            ┌─────────────────────────┐
│ id          INTEGER PK   │            │ entity_id    INTEGER    │
│ from_id     INTEGER      │            │ process_type TEXT       │
│ to_id       INTEGER      │            │  → embed               │
│ relation_type TEXT       │            │  → classify             │
│ evidence    TEXT          │            │  → discover             │
│ method      TEXT          │            │ checksum     TEXT       │
│  → vector_similarity     │            │ processed_at TIMESTAMP  │
│  → ollama                │            │ PK(entity_id, type)     │
│  → graph_inference       │            └─────────────────────────┘
│ confidence  REAL         │
└──────────────────────────┘            checksum = bm.entity.checksum
                                        변경되면 재처리 대상
bm.relation과 별개 저장
```

---

## 데이터 흐름

### 1. embed (벡터화)

```
bm.entity ──→ process_log 확인 ──→ checksum 변경? ──→ 파일 읽기
                                        │                  │
                                    변경 없음          vault/file_path
                                    → skip              │
                                                   BGE-M3 서버
                                                   POST /embed
                                                        │
                                                   float[1024]
                                                        │
                                        ┌───────────────┴───────────────┐
                                        │                               │
                                   entity_embed                    process_log
                                   INSERT OR REPLACE               (entity_id,
                                                                    'embed',
                                                                    checksum)
```

### 2. classify (3-type 분류)

```
bm.entity ──→ 휴리스틱 규칙 체크
                    │
            ┌───────┴───────────────────────────┐
            │                                   │
        규칙 매칭                           매칭 안 됨
            │                                   │
    ┌───────┴───────┐                      Ollama 호출
    │               │                      POST /api/generate
  concepts/     workcases/                      │
  hubs/         logs/                      JSON 파싱
  guides/           │                      {"type": "world"}
    │           experience                      │
  world                                    memory_meta
    │                                      INSERT OR REPLACE
  memory_meta
  INSERT OR REPLACE

규칙:
  concepts/, hubs/, guides/, entity_type=concept → world
  workcases/, logs/, entity_type=workcase       → experience
  notes/                                         → mental_model
  그 외                                          → Ollama 또는 world
```

### 3. discover (관계 발견)

```
bm.entity (각각) ──→ entity_embed에서 벡터 가져오기
                         │
                    vec0 MATCH 검색
                    top_k=20, distance 순
                         │
                    후보 쌍 목록
                         │
                ┌────────┴────────┐
                │                 │
          bm.relation에       discovered_relation에
          이미 있나?           이미 있나?
                │                 │
              있음 → skip       있음 → skip
              없음 ↓             없음 ↓
                │                 │
                └────────┬────────┘
                         │
                  distance < threshold?
                         │
                    yes → INSERT
                    discovered_relation
                    (from_id, to_id,
                     'similar_to',
                     evidence=distance,
                     method='vector_similarity')
```

### 4. recall (하이브리드 검색)

```
쿼리 텍스트
    │
    ├──→ BGE-M3 서버 ──→ query_vec ──→ entity_embed MATCH
    │                                       │
    │                               Stage 1: 벡터 히트
    │                               {entity_id: similarity}
    │
    ├──→ (FTS5 — 미구현, BM search_index 비어있음)
    │
    │                               Stage 2: 그래프 확장
    │                               상위 벡터 히트에서
    │    ┌──────────────────────────→ bm.relation 탐색
    │    │                           discovered_relation 탐색
    │    │                                  │
    │    │                           연결된 entity 추가
    │    │                           score = 원본 * 0.5
    │    │
    │    └──────────────────────────→ Stage 3: 점수 조정
    │                                memory_meta 조회
    │                                mental_model → × 1.5
    │                                experience   → × 1.0
    │                                world        → × 0.7
    │
    └──→ 정렬 + top_k 자르기 ──→ RecallResult
```

### 5. context (build_context 확장)

```
쿼리 ──→ bm.entity LIKE 검색 ──→ 시작 노트 결정
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              bm.relation        bm.observation     recall(title)
              (명시적 관계)       (구조화 사실)       (벡터 검색)
                    │                  │                  │
              🔗 BM 관계          👁️ Observations    🔍 벡터 유사
              relates_to →        [fact] ...          (BM에 없는
              derived_from →      [method] ...         새로운 연결)
              part_of →           [decision] ...
                    │                  │                  │
                    └──────────────────┴──────────────────┘
                                       │
                              터미널에 비교 출력
```

---

## CLI 명령어

```
bm embed [--force]              BM entity → BGE-M3 → entity_embed
bm classify [--force]           BM entity → 휴리스틱/Ollama → memory_meta
bm discover [--threshold 0.7]   entity_embed → 유사 쌍 → discovered_relation
bm recall "쿼리" [--k 10]      벡터 + 그래프 + 발견 관계 → 통합 검색
bm context "노트 제목"          BM 관계 + observations + 벡터 유사 비교
bm stats                        전체 통계
bm embed-server start           BGE-M3 FastAPI 서버 (port 9100)
bm mcp                          Claude Code MCP 서버
```

### 실행 순서

```
[최초 1회]
  basic-memory sync ──→ bm embed-server start ──→ bm embed ──→ bm classify ──→ bm discover

[이후]
  노트 수정 → basic-memory sync → bm embed (변경분만) → bm discover
  검색: bm recall "쿼리"  |  bm context "노트 제목"
```

---

## 파일 → 역할 매핑

```
src/ryu_memory/
│
├── config.py                    설정값 (DB 경로, 서버 URL, 임계값)
├── db.py                        ATTACH + 마이그레이션 + 세션 관리
│
├── models/slow.py               데이터 클래스 4개
│   ├── BMEntity                   BM entity 읽기용
│   ├── MemoryMeta                 3-type 분류 결과
│   ├── DiscoveredRelation         발견된 관계
│   └── ProcessLog                 처리 이력 (checksum 기반)
│
├── repository/                  DB 접근 계층
│   ├── bm_reader.py               Fast DB 읽기 (bm.entity/relation/observation)
│   ├── vector_repo.py             sqlite-vec (entity_embed)
│   ├── meta_repo.py               memory_meta + process_log
│   └── discover_repo.py           discovered_relation
│
├── services/                    비즈니스 로직
│   ├── embed_service.py           파일 읽기 → BGE-M3 → 벡터 저장
│   ├── classify_service.py        휴리스틱 → Ollama 폴백 → 분류 저장
│   ├── discover_service.py        벡터 유사도 → 기존 관계 제외 → 새 관계 저장
│   └── recall_service.py          벡터 + 그래프 + 발견 → 점수 합산 → 정렬
│
├── embedding/                   BGE-M3 임베딩
│   ├── server.py                  FastAPI 서버 (/health, /embed)
│   └── client.py                  httpx 비동기 클라이언트
│
├── extraction/ollama.py         Ollama (classify, discover_relation)
├── cli/app.py                   Typer CLI (bm 명령어)
└── mcp/server.py                FastMCP (Claude Code 연동)
```
