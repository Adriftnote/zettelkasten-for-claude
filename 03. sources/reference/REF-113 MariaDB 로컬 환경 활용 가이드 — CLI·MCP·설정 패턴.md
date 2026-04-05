---
title: REF-113 MariaDB 로컬 환경 활용 가이드 — CLI·MCP·설정 패턴
type: note
permalink: zettelkasten/03.-sources/reference/ref-113-maria-db-rokeol-hwangyeong-hwalyong-gaideu-cli-mcp-seoljeong-paeteon
date: '2026-03-13'
tags:
- mariadb
- mcp
- cli
- database
- devenv
---

# MariaDB 로컬 환경 활용 가이드 — CLI·MCP·설정 패턴

로컬 MariaDB v12.2.2 환경에서 CLI 직접 실행과 MCP 서버를 조합하여 효율적으로 DB 작업을 수행하는 방법.

## 📖 핵심 아이디어

로컬 MariaDB 활용은 3단계로 나뉜다: **(1) CLI 직접 실행** — sqlite3 패턴과 동일하게 `mariadb -e` 원라이너, **(2) MCP 서버** — 자연어 쿼리·스키마 탐색 자동화, **(3) .my.cnf** — 인증 생략으로 두 방식 모두 편의성 확보. 상황별 최적 도구 선택이 핵심.

## 🛠️ 구성 요소 / 주요 내용

### 현재 환경

| 항목 | 값 |
|------|-----|
| 버전 | MariaDB 12.2.2 |
| 경로 | `C:\Program Files\MariaDB 12.2\` (PATH 등록) |
| 인증 | root / 정우1164 |
| 인코딩 | utf8mb4 (client/server/database 모두) |
| Collation | utf8mb4_uca1400_ai_ci |
| 커넥션 | max_connections=151, wait_timeout=28800 |

### MCP 서버 비교

| 서버 | 설치 | 읽기전용 | MariaDB 지원 | 특징 |
|------|------|----------|-------------|------|
| **DBHub** (Bytebase) | npx (zero-install) | `--readonly` 플래그 | 공식 DSN | 멀티DB, SSH터널, Workbench |
| **MariaDB/mcp** (공식) | uv (git clone) | `MCP_READ_ONLY=true` | 공식 | 벡터 검색 유일 |
| **benborla/mysql** | npx | 기본 on | 비공식 호환 | SQL injection 방어, 풀링 |
| **designcomputer/mysql** | uvx | 설계 by default | 비공식 호환 | 단순, Python |
| **abel9851/mariadb** | uvx | 항상 읽기전용 | MariaDB 전용 | 소규모 커뮤니티 |

## 🔧 작동 방식 / 적용 방법

### 1. CLI 패턴 (sqlite3과 동일)

```bash
# 단일 쿼리
mariadb -u root -p'정우1164' dbname -e "SELECT * FROM t LIMIT 10"

# 배치 모드 (TSV, 헤더 포함)
mariadb -u root -p'정우1164' dbname -B -e "SELECT * FROM t"

# 헤더 없는 raw 데이터
mariadb -u root -p'정우1164' dbname -BN -e "SELECT col FROM t"

# .sql 파일 실행
mariadb -u root -p'정우1164' dbname < script.sql

# CSV 변환 (rsv 조합)
mariadb -u root -p'정우1164' dbname -B -e "SELECT * FROM t" > /tmp/out.tsv
```

### 2. .my.cnf 설정 (인증 생략)

```ini
# ~/.my.cnf (Git Bash: ~/.my.cnf)
[client]
user=root
password=정우1164
```

설정 후: `mariadb dbname -e "쿼리"`만으로 접속.

### 3. MCP 서버 — DBHub (추천)

```json
{
  "mcpServers": {
    "dbhub": {
      "command": "cmd",
      "args": [
        "/c", "npx", "-y", "@bytebase/dbhub",
        "--transport", "stdio",
        "--readonly",
        "--dsn", "mariadb://root:정우1164@127.0.0.1:3306/dbname"
      ]
    }
  }
}
```

**Windows 주의**: `"command": "npx"` 직접 사용 시 "Connection closed" 오류. 반드시 `cmd /c npx` 래퍼.

### 4. MCP 서버 — 공식 MariaDB/mcp (벡터 검색 필요 시)

```json
{
  "mcpServers": {
    "mariadb-official": {
      "command": "uv",
      "args": ["--directory", "C:/_system/tools/mariadb-mcp/", "run", "server.py"],
      "env": {
        "MCP_MARIADB_HOST": "127.0.0.1",
        "MCP_MARIADB_PORT": "3306",
        "MCP_MARIADB_USER": "root",
        "MCP_MARIADB_PASSWORD": "정우1164",
        "MCP_MARIADB_DATABASE": "dbname",
        "MCP_READ_ONLY": "true"
      }
    }
  }
}
```

git clone + `uv sync` 선행 필요.

## 💡 실용적 평가 / 적용

### 상황별 도구 선택

| 상황 | 도구 | 이유 |
|------|------|------|
| 빠른 쿼리·스크립트 | CLI `mariadb -e` | 설치 불필요, Bash 에이전트 위임 |
| 스키마 탐색·복잡 분석 | MCP (DBHub) | 자연어 쿼리, 자동 스키마 |
| 벡터 시맨틱 검색 | 공식 MariaDB/mcp | 임베딩 지원 유일 |
| NAS DB 이관 분석 | CLI + mariadb-dump | SSH 파이프 조합 |

### CLI vs MCP 하이브리드 전략

```
사용자 → Claude → MCP 서버 → 내부 CLI 실행 → 구조화된 결과
```

- **분석·탐색**: MCP (스키마 자동 노출, 자연어 인터페이스)
- **변환·파이프**: CLI (rsv, jaq 조합, Bash 위임)
- **위험 작업**: CLI + `--readonly` MCP (이중 안전장치)

### NAS dashboard_atomic.db 이관 시나리오

```bash
# NAS에서 SQLite dump → MariaDB import
ssh admin123@192.168.0.9 "sqlite3 /volume1/docker/n8n/databases/dashboard_atomic.db .dump" \
  | mariadb dbname
```

### 한계

- MCP 서버는 단일 DB만 지정 — 여러 DB 전환 시 설정 변경 필요
- 공식 MariaDB/mcp는 Windows에서 uv 환경 이슈 가능
- DBHub npx 첫 실행 시 설치 시간 (이후 캐시)

## 🔗 관련 개념

- [[REF-069 MCP is Dead Long Live the CLI - MCP vs CLI 비교]] - (MCP 안에서 CLI 실행하는 하이브리드 패턴의 구체적 적용 사례)
- [[MCP CLI Polymorphism]] - (서로 다른 MCP 서버를 동일 CLI 인터페이스로 접근하는 추상화 패턴)

---

**작성일**: 2026-03-13
**분류**: 데이터베이스, 개발환경