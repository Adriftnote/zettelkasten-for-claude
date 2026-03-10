---
title: winsearch CLI 한글 경로 검색 실패 트러블슈팅
type: workcase
permalink: sources/workcases/winsearch-cli-korean-path-search-failure
tags:
- winsearch
- powershell
- encoding
- utf-8
- git-bash
- troubleshooting
---

# winsearch CLI 한글 경로 검색 실패 트러블슈팅

> winsearch CLI 도구에서 한글 관련 3가지 문제(SQL 파싱, 출력 깨짐, 플래그 무시)를 동시에 해결한 경험
> source: C:\claude-workspace\_system\tools\winsearch*

## 문제 상황

- winsearch로 `C:\유정우\Projects\` 하위 파일 검색 시 3가지 문제 동시 발생
- 도구 체인: Git Bash → bash wrapper → powershell.exe → winsearch.ps1 → Windows Search Index (ADODB COM)

## 근본 원인

### 문제 1: 한글 키워드 SQL 파싱 에러

**증상:**
```
winsearch "배포"
# → 0x80040E14 SQL parse error
```

**원인:** Windows Search SQL에서 한글 문자열의 작은따옴표가 이스케이프 안 됨. `LIKE '%배포%'` 구문이 ADODB COM 레벨에서 파싱 실패.

### 문제 2: 한글 경로 출력 깨짐 (mojibake)

**증상:**
```
winsearch "docker-compose"
# → C:\������\Projects\infra\...  (유정우가 깨짐)
```

**원인:** PowerShell 기본 OutputEncoding이 시스템 로캘(CP949)이고, Git Bash는 UTF-8 기대.

### 문제 3: --limit 플래그 무시됨

**증상:**
```
winsearch "query" --limit 5
# → 전체 결과 출력 (limit 무시)
```

**원인 (핵심):** 실제 호출 체인이 예상과 달랐음.
- 예상: `winsearch.cmd` → `powershell.exe -File winsearch.ps1`
- 실제: `winsearch` (bash script, PATH 우선) → `powershell.exe -File winsearch.ps1`
- bash wrapper에 `--limit` case가 없어서 인자가 무시됨. PS 스크립트에 `-Limit` 파라미터를 아무리 추가해도 bash에서 전달을 안 하니 동작 안 함.

## 해결책

### 문제 1: SQL 이스케이프
```powershell
# winsearch.ps1
$escapedQuery = $Query.Replace("'", "''")
```
SQL 인젝션 방지 겸 한글 쿼리 안정성 확보.

### 문제 2: 인코딩 통일
```powershell
# winsearch.ps1 상단
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```
```cmd
# winsearch.cmd 상단
chcp 65001 >nul 2>&1
```

### 문제 3: bash wrapper 플래그 추가
```bash
# winsearch (bash wrapper) - case문에 추가
while [[ $# -gt 0 ]]; do
  case "$1" in
    -l|--limit) LIMIT="$2"; shift 2 ;;
    # ... 기존 플래그들
  esac
done

# PS 호출 시 변환
[[ -n "$LIMIT" ]] && PS_ARGS+=(-Limit "$LIMIT")
```
```powershell
# winsearch.ps1 - TOP N 지원
$topClause = if ($Limit -gt 0) { "TOP $Limit" } else { "" }
$sql = "SELECT $topClause System.ItemPathDisplay FROM SystemIndex WHERE ..."
```

## 적용

### 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `_system/tools/winsearch` | bash wrapper: --limit, --ext, --scope GNU 플래그 지원 |
| `_system/tools/winsearch.ps1` | UTF-8 인코딩, 쿼리 이스케이프, 다중 키워드 AND, TOP N |
| `_system/tools/winsearch.cmd` | chcp 65001 UTF-8 콘솔 설정 |

### 교훈

1. **도구 체인 전체를 파악하라** — `which winsearch` 또는 `type winsearch`로 실제 호출되는 파일 확인 필수. PATH에 같은 이름의 bash/cmd/ps1이 있으면 bash가 우선 (Git Bash 환경).

2. **인코딩은 체인의 모든 단계에서 맞춰야 한다**
```
Git Bash (UTF-8) ← powershell.exe (CP949 기본) ← ADODB COM (시스템 로캘)
```
한 곳만 고치면 안 됨. PS output + console codepage 둘 다 설정.

3. **Windows Search SQL은 일반 SQL과 다르다** — `TOP N` 지원 (LIMIT 아님), `System.ItemPathDisplay LIKE '%keyword%'` 패턴, 다중 키워드는 `AND`로 분리하여 각각 LIKE 조건.

## 관련 Task
- (해당 Task 연결 시 추가)

## Relations
- uses [[Character Encoding]] (인코딩 체인 전체 이해)
- uses [[UTF-8]] (Git Bash ↔ PowerShell 인코딩 통일)
- uses [[CP949]] (PowerShell 기본 출력 인코딩 — 문제의 원인)
- uses [[BOM (Byte Order Mark)]] (PS 파일 인코딩 관련)
- led_to [[powershell-korean-encoding-fix]] (PS 파일 읽기 인코딩 BOM 관련 후속 작업)
- led_to [[NAS Docker 배포 경험 (n8n + Metabase)]] (이 트러블슈팅의 원인이 된 검색 작업)

## Observations
- [fact] Git Bash 환경에서 PATH에 같은 이름의 bash/cmd/ps1이 있으면 bash가 우선 실행됨 #Git-Bash #PATH
- [fact] PowerShell 5.x 기본 OutputEncoding은 시스템 로캘(CP949)임 #PowerShell #encoding
- [fact] Windows Search SQL은 `LIMIT` 대신 `TOP N` 구문을 사용함 #Windows-Search #SQL
- [solution] 한글 SQL 파싱 에러는 `$Query.Replace("'", "''")`로 이스케이프하여 해결 #PowerShell #SQL
- [solution] Git Bash↔PowerShell 인코딩 불일치는 `[Console]::OutputEncoding = UTF8` + `chcp 65001` 동시 적용 #encoding #UTF-8
- [warning] 도구 체인에서 인코딩을 한 곳만 고치면 안 됨 — 전체 체인을 맞춰야 함 #encoding
- [warning] `which`/`type`으로 실제 호출 파일을 확인하지 않으면 엉뚱한 파일을 수정하게 됨 #debugging
- [method] 도구 체인 디버깅 시 `which [명령]`으로 실제 실행 파일 경로부터 확인 #debugging #Git-Bash
- [tech] Windows Search SQL 다중 키워드는 `AND`로 분리하여 각각 `LIKE` 조건 적용 #Windows-Search
