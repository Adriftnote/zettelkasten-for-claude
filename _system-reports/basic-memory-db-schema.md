# Basic Memory DB 스키마 문서

## 개요

Basic Memory는 SQLite 데이터베이스를 사용하여 마크다운 노트에서 추출한 지식 그래프를 저장합니다.

### DB 위치

두 경로가 **하드링크**로 연결되어 있어 동일한 파일입니다:

```
C:\Users\RL\.basic-memory\memory.db
    ↕ (하드링크)
C:\claude-workspace\_system\basic-memory\memory.db
```

> 하드링크: 두 경로가 같은 물리적 파일을 가리킴. 어느 경로로 접근해도 동일한 데이터.

### 버전
- Basic Memory: 0.17.6
- 데이터베이스 백엔드: SQLite (로컬) 또는 PostgreSQL (클라우드)

---

## 테이블 구조

### 1. project (프로젝트)

프로젝트 단위로 지식베이스를 관리합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER | PK, 자동증가 |
| `name` | STRING | 프로젝트 이름 (UNIQUE) |
| `description` | TEXT | 프로젝트 설명 |
| `permalink` | STRING | URL-safe 식별자 (UNIQUE) |
| `path` | STRING | 프로젝트 폴더 경로 |
| `is_active` | BOOLEAN | 활성화 여부 |
| `is_default` | BOOLEAN | 기본 프로젝트 여부 (UNIQUE) |
| `external_id` | STRING | UUID, 클라우드 동기화용 |
| `last_scan_timestamp` | FLOAT | 마지막 스캔 시간 |
| `last_file_count` | INTEGER | 마지막 스캔 시 파일 수 |
| `created_at` | DATETIME | 생성 시간 |
| `updated_at` | DATETIME | 수정 시간 |

**용도**: 여러 Obsidian vault나 마크다운 폴더를 개별 프로젝트로 관리

---

### 2. entity (엔티티)

지식 그래프의 **노드**. 각 마크다운 파일이 하나의 엔티티가 됩니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER | PK, 자동증가 |
| `project_id` | INTEGER | FK → project.id |
| `title` | STRING | 노트 제목 |
| `entity_type` | STRING | 타입 (note, concept, pattern, gotcha 등) |
| `entity_metadata` | JSON | 프론트매터 메타데이터 |
| `content_type` | STRING | MIME 타입 (text/markdown) |
| `permalink` | STRING | URL-safe 고유 식별자 |
| `file_path` | STRING | 실제 파일 경로 |
| `checksum` | STRING | 파일 체크섬 (변경 감지용) |
| `external_id` | STRING | UUID, 클라우드 동기화용 |
| `mtime` | FLOAT | 파일 수정 시간 (sync 최적화) |
| `size` | INTEGER | 파일 크기 (sync 최적화) |
| `created_at` | DATETIME | 생성 시간 |
| `updated_at` | DATETIME | 수정 시간 |

**용도**: 각 마크다운 노트를 지식 그래프의 노드로 표현

---

### 3. observation (관찰)

엔티티 내의 **개별 사실/관찰** 내용. 마크다운에서 `- [category] content` 형식으로 추출됩니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER | PK, 자동증가 |
| `entity_id` | INTEGER | FK → entity.id (CASCADE DELETE) |
| `content` | TEXT | 관찰 내용 |
| `category` | STRING | 카테고리 (fact, opinion, question 등) |
| `context` | TEXT | 추가 맥락 정보 |
| `tags` | JSON | 태그 배열 (기본값: []) |

**용도**: 노트 내의 개별 지식 조각을 구조화하여 저장

**예시**:
```markdown
## Observations
- [fact] Python은 인터프리터 언어다
- [opinion] 가독성이 좋다
```

---

### 4. relation (관계)

지식 그래프의 **엣지**. 엔티티 간의 관계를 표현합니다.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | INTEGER | PK, 자동증가 |
| `from_id` | INTEGER | FK → entity.id (출발 노드) |
| `to_id` | INTEGER | FK → entity.id (도착 노드, nullable) |
| `to_name` | STRING | 대상 이름 (미해결 링크용) |
| `relation_type` | STRING | 관계 타입 |
| `context` | TEXT | 관계의 맥락 정보 |

**용도**: `[[wikilink]]` 파싱 결과 및 명시적 관계 저장

**관계 타입 예시**:
- `references` - 일반 참조
- `implements` - 구현 관계
- `extends` - 확장 관계
- `related_to` - 관련 항목

**미해결 관계**: `to_id`가 NULL이고 `to_name`만 있는 경우, 대상 노트가 아직 생성되지 않은 상태

---

### 5. search_index (검색 인덱스)

**SQLite FTS5 가상 테이블**. 전문 검색을 위한 인덱스입니다.

| 컬럼 | 인덱싱 | 설명 |
|------|--------|------|
| `id` | UNINDEXED | entity/relation/observation ID |
| `title` | ✅ 인덱싱 | 제목 검색 |
| `content_stems` | ✅ 인덱싱 | 본문 검색 (어간 추출) |
| `content_snippet` | UNINDEXED | 표시용 스니펫 |
| `permalink` | ✅ 인덱싱 | 경로 검색 |
| `file_path` | UNINDEXED | 파일 경로 |
| `type` | UNINDEXED | 타입 (entity/relation/observation) |
| `from_id` | UNINDEXED | 관계 출발 노드 |
| `to_id` | UNINDEXED | 관계 도착 노드 |
| `relation_type` | UNINDEXED | 관계 타입 |
| `entity_id` | UNINDEXED | 관찰의 부모 엔티티 |
| `category` | UNINDEXED | 관찰 카테고리 |
| `metadata` | UNINDEXED | JSON 메타데이터 |
| `created_at` | UNINDEXED | 생성 시간 |
| `updated_at` | UNINDEXED | 수정 시간 |

**FTS5 설정**:
```sql
tokenize='unicode61 tokenchars 0x2F'  -- / 문자를 토큰에 포함
prefix='1,2,3,4'                       -- 접두사 검색 지원
```

**용도**: `search_notes`, `build_context` 등의 검색 기능 지원

---

## 인덱스 목록

### entity 테이블

| 인덱스 | 컬럼 | UNIQUE | 용도 |
|--------|------|--------|------|
| `ix_entity_title` | title | ❌ | 제목 검색 |
| `ix_entity_type` | entity_type | ❌ | 타입별 필터링 |
| `ix_entity_permalink` | permalink | ✅ | permalink로 조회 |
| `ix_entity_file_path` | file_path | ❌ | 파일 경로 조회 |
| `ix_entity_project_id` | project_id | ❌ | 프로젝트별 필터링 |
| `ix_entity_created_at` | created_at | ❌ | 생성일 정렬 |
| `ix_entity_updated_at` | updated_at | ❌ | 수정일 정렬 |
| `ix_entity_external_id` | external_id | ✅ | 클라우드 동기화 |
| `uix_entity_file_path_project` | file_path, project_id | ✅ | 프로젝트 내 파일 유일성 |
| `uix_entity_permalink_project` | permalink, project_id | ✅ | 프로젝트 내 permalink 유일성 |

### observation 테이블

| 인덱스 | 컬럼 | UNIQUE | 용도 |
|--------|------|--------|------|
| `ix_observation_entity_id` | entity_id | ❌ | 엔티티별 관찰 조회 |
| `ix_observation_category` | category | ❌ | 카테고리별 필터링 |

### relation 테이블

| 인덱스 | 컬럼 | UNIQUE | 용도 |
|--------|------|--------|------|
| `ix_relation_from_id` | from_id | ❌ | 출발 노드 기준 조회 |
| `ix_relation_to_id` | to_id | ❌ | 도착 노드 기준 조회 |
| `ix_relation_type` | relation_type | ❌ | 관계 타입별 필터링 |
| `uix_relation` | from_id, to_id, relation_type | ✅ | 중복 관계 방지 |

### project 테이블

| 인덱스 | 컬럼 | UNIQUE | 용도 |
|--------|------|--------|------|
| `ix_project_name` | name | ✅ | 이름으로 조회 |
| `ix_project_permalink` | permalink | ✅ | permalink로 조회 |
| `ix_project_path` | path | ❌ | 경로로 조회 |
| `ix_project_created_at` | created_at | ❌ | 생성일 정렬 |
| `ix_project_updated_at` | updated_at | ❌ | 수정일 정렬 |
| `ix_project_external_id` | external_id | ✅ | 클라우드 동기화 |

---

## ER 다이어그램

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   project   │       │   entity    │       │ observation │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ project_id  │       │ id (PK)     │
│ name        │   1:N │ id (PK)     │◄──────│ entity_id   │
│ permalink   │       │ title       │   1:N │ content     │
│ path        │       │ entity_type │       │ category    │
│ ...         │       │ permalink   │       │ context     │
└─────────────┘       │ file_path   │       │ tags        │
                      │ ...         │       └─────────────┘
                      └──────┬──────┘
                             │
                      ┌──────┴──────┐
                      │  relation   │
                      ├─────────────┤
                      │ id (PK)     │
                      │ from_id (FK)│
                      │ to_id (FK)  │
                      │ to_name     │
                      │ relation_type│
                      │ context     │
                      └─────────────┘
```

---

## 통계 조회 쿼리 예시

```sql
-- 프로젝트별 통계
SELECT
    p.name,
    COUNT(DISTINCT e.id) as entities,
    COUNT(DISTINCT o.id) as observations,
    COUNT(DISTINCT r.id) as relations
FROM project p
LEFT JOIN entity e ON e.project_id = p.id
LEFT JOIN observation o ON o.entity_id = e.id
LEFT JOIN relation r ON r.from_id = e.id
GROUP BY p.id;

-- 미해결 관계 (대상 노트 없음)
SELECT from_id, to_name, relation_type
FROM relation
WHERE to_id IS NULL;

-- 엔티티 타입별 분포
SELECT entity_type, COUNT(*) as count
FROM entity
GROUP BY entity_type
ORDER BY count DESC;

-- 가장 연결이 많은 엔티티
SELECT e.title, COUNT(r.id) as connections
FROM entity e
JOIN relation r ON r.from_id = e.id OR r.to_id = e.id
GROUP BY e.id
ORDER BY connections DESC
LIMIT 10;
```

---

## 참고

### DB 접근 방법

```bash
# 방법 1: 홈 경로
sqlite3 "C:\Users\RL\.basic-memory\memory.db"

# 방법 2: claude-workspace 경로 (하드링크로 동일 파일)
sqlite3 "C:\claude-workspace\_system\basic-memory\memory.db"
```

### 유용한 명령어
- 스키마 확인: `.schema`
- 인덱스 확인: `.indexes`
- 테이블 목록: `.tables`
- Basic Memory CLI: `uvx basic-memory status`
- 프로젝트 정보: `uvx basic-memory project info obsidian-kb`
