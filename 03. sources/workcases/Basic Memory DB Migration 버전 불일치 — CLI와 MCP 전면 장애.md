---
title: Basic Memory DB Migration 버전 불일치 — CLI와 MCP 전면 장애
type: workcase
permalink: sources/workcases/basic-memory-db-migration-version-mismatch
tags:
- basic-memory
- sqlite
- alembic
- migration
- cli
- mcp
- troubleshooting
---

# Basic Memory DB Migration 버전 불일치 — CLI와 MCP 전면 장애

## 문제 상황

`bm tool write-note`, `bm status` 등 **모든 bm CLI 명령**이 아래 에러로 실패:

```
Error: Can't locate revision identified by 'k4e5f6g7h8i9'
```

- bm 버전: 0.17.6
- 환경: Windows 11, uvx로 설치
- MCP 서버(basic-memory)도 동일 에러로 작동 불가 추정

## 발견 경위

Claude Code 플러그인 로드 실패 건을 workcase로 남기려고 `bm tool write-note` 실행 → 연쇄적으로 발견.

## 진단 과정

### 1단계: config 스키마 에러 (선행 문제)

```
pydantic_core.ValidationError: projects.zettelkasten
  Input should be a valid string, input_type=dict
```

- `~/.basic-memory/config.json`의 `projects.zettelkasten`이 dict 형태
- bm 0.17.6이 string(경로)을 기대 → pydantic 에러
- **해결**: dict → string으로 변경 (`"zettelkasten": "C:\\claude-workspace\\from-obsidian"`)

### 2단계: revision 에러 (근본 문제)

config 수정 후 CLI가 뜨지만, 모든 DB 접근에서 실패.

### 3단계: DB 파일 조사

| 파일 | 크기 | 내용 |
|------|------|------|
| `memory.db` | 정상 | entity, relation, observation 등 전체 데이터 보유 |
| `zettelkasten.db` | **0바이트** | 빈 파일 (config 변경 후 새로 생성 시도했으나 실패) |

```sql
-- memory.db의 alembic_version
SELECT * FROM alembic_version;
-- 결과: k4e5f6g7h8i9
```

## 근본 원인

```
bm 업데이트 (→ 0.17.6)
  └─ 내부 Alembic migration revision 체계 변경
       └─ 기존 DB의 revision 'k4e5f6g7h8i9'를 새 코드에서 인식 못 함
            └─ 모든 DB 접근 실패 (CLI + MCP 동시)
```

- bm이 config 변경 감지 후 `zettelkasten.db`를 새로 만들려 했으나, migration 자체가 실패해서 0바이트 빈 파일만 남음
- 실제 데이터는 `memory.db`에 온전히 존재 (entity, relation, observation 테이블 확인)

## 해결 방안 (미적용)

### 방안 1: DB 리빌드 (안전)

```bash
bm reset --reindex
```

- DB를 드롭 후 vault 파일시스템에서 재스캔
- 노트 파일은 건드리지 않으므로 데이터 손실 없음
- 임베딩 재생성에 시간 소요

### 방안 2: bm 버전 조정

- revision `k4e5f6g7h8i9`를 지원하는 버전으로 다운그레이드
- 또는 최신 버전에서 migration path가 있는지 확인

### 방안 3: 수동 revision 수정

```sql
-- memory.db에서 현재 bm 코드의 head revision으로 덮어쓰기
UPDATE alembic_version SET version_num = '<correct_head>';
```

- 스키마가 실제로 호환되는 경우에만 가능

## 교훈

- bm 자동 업데이트 시 **DB migration 호환성 깨질 수 있음** — 업데이트 전 `bm status` 확인 필요
- config 스키마 변경(dict ↔ string)이 DB 파일 분리를 유발할 수 있음 (`memory.db` vs `zettelkasten.db`)
- CLI와 MCP가 같은 DB를 공유하므로, 한쪽 장애 = 양쪽 장애
- vault 파일은 별도 존재하므로, bm 장애 시 **직접 파일 배치**로 우회 가능 (watcher가 복구 후 sync)

## 임시 우회

bm CLI/MCP 사용 불가 시:
- **노트 생성**: vault 폴더에 직접 `.md` 파일 생성 (frontmatter 포함)
- **노트 검색**: Grep/Glob으로 vault 직접 검색
- bm 복구 후 자동 sync 기대

## 관련 노트

- [[Basic Memory]]
- [[Alembic (Migration Framework)]]
- [[Claude Code 플러그인 전체 로드 실패 — 마켓플레이스 동기화 문제]]

## Relations

- solves [[Basic Memory CLI 전면 장애]]
- caused_by [[Alembic revision 불일치]]
- preceded_by [[Basic Memory config 스키마 변경]]
- related_to [[Basic Memory Observation Context 미반환 이슈]]
- environment [[Windows 11]]
- tool [[Basic Memory]]
