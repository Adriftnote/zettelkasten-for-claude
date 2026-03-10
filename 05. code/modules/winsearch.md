---
title: winsearch
type: module
permalink: 05.-code/modules/winsearch
tags:
- powershell
- bash
- windows-search
- cli
- adodb
---

# winsearch

Windows Search Index CLI 래퍼 도구

## 📖 개요

Windows Search Index(ADODB COM)를 CLI에서 사용할 수 있게 해주는 도구.
Git Bash에서 호출하면 bash wrapper → powershell.exe → ADODB COM 체인으로 동작.
파일명/경로 검색, 전문(content) 검색, 확장자 필터, JSON 출력 지원.

## Observations

- [impl] ADODB COM (`Search.CollatorDSO`) 인터페이스로 Windows Search Index 쿼리 #core
- [impl] 한글 쿼리 이스케이프: `$Query.Replace("'", "''")` (SQL 파싱 에러 방지) #encoding
- [impl] UTF-8 출력: `[Console]::OutputEncoding = UTF8` + `chcp 65001` (Git Bash 한글 경로 깨짐 방지) #encoding
- [impl] 다중 키워드 AND 분리: `"n8n deploy NAS"` → 각 단어별 `LIKE '%word%'` AND 조합 #search
- [impl] `TOP N` SQL 절로 결과 제한 (Windows Search SQL은 LIMIT 미지원) #search
- [impl] content 검색: `CONTAINS(System.Search.Contents, ...)` FTS 구문 사용 #search
- [impl] scope 필터: `scope='file:path'` 절 (인덱싱된 경로만 동작) #filter
- [impl] extension 필터: `System.ItemPathDisplay LIKE '%.ext'` 패턴 #filter
- [impl] `ValueFromRemainingArguments`로 bash wrapper가 못 파싱한 `--flag` 인자 fallback 처리 #interop
- [deps] ADODB COM (Windows 내장), PowerShell 5.1+ #requirement
- [usage] `winsearch "query"` 파일명/경로 검색
- [usage] `winsearch "query" --limit 5` 결과 수 제한
- [usage] `winsearch "query" --ext md` 확장자 필터
- [usage] `winsearch "query" --content` 전문 검색
- [usage] `winsearch "query" --scope "C:/path"` 폴더 범위 지정
- [usage] `winsearch "query" --json` JSON 출력 (path, name, size, modified)
- [note] Windows Search Index에 등록된 경로만 검색됨. 미등록 시 결과 0건 #limitation
- [note] 호출 체인: Git Bash → `winsearch` (bash) → `powershell.exe -File` → `winsearch.ps1` #architecture

## 파일 구조

```
C:\claude-workspace\_system\tools\
├── winsearch        (bash wrapper — Git Bash 진입점, GNU 플래그 파싱)
├── winsearch.ps1    (PowerShell 메인 — SQL 생성, ADODB 실행, 결과 출력)
└── winsearch.cmd    (cmd wrapper — cmd.exe용, chcp 65001)
```

## 호출 체인

```
Git Bash
  └→ winsearch (bash script, PATH 우선)
       └→ GNU 플래그 파싱 (--limit → -Limit, --ext → -Ext 등)
            └→ powershell.exe -NoProfile -ExecutionPolicy Bypass -File winsearch.ps1
                 └→ param() 바인딩 + $Remaining fallback
                      └→ SQL 생성 → ADODB COM → SystemIndex 쿼리
                           └→ 결과 stdout (UTF-8)
```

## SQL 생성 로직

```sql
-- 단일 키워드
SELECT TOP 5 System.ItemPathDisplay, System.ItemName, System.Size, System.DateModified
FROM SystemIndex
WHERE System.ItemType <> 'Directory'
  AND System.ItemPathDisplay LIKE '%keyword%'

-- 다중 키워드 ("n8n deploy NAS")
WHERE (System.ItemPathDisplay LIKE '%n8n%'
  AND System.ItemPathDisplay LIKE '%deploy%'
  AND System.ItemPathDisplay LIKE '%NAS%')

-- content 검색
WHERE CONTAINS(System.Search.Contents, '"keyword"')

-- 확장자 + scope
WHERE scope='file:C:/projects'
  AND System.ItemPathDisplay LIKE '%.md'
  AND System.ItemPathDisplay LIKE '%keyword%'
```

## bash wrapper 인자 변환

| bash 플래그 | PS 파라미터 | 설명 |
|-------------|-------------|------|
| `--limit N` / `-l N` | `-Limit N` | 결과 수 제한 (TOP N) |
| `--ext md` / `-e md` | `-Ext md` | 확장자 필터 |
| `--scope path` / `-s path` | `-Scope path` | 폴더 범위 |
| `--content` / `-c` | `-Content` | 전문 검색 모드 |
| `--json` / `-j` | `-Json` | JSON 출력 |

## Relations

- part_of [[CLI 도구]] (claude-workspace 시스템 도구)
- uses [[Windows Search Index]] (Windows 내장 인덱싱 서비스)
- uses [[ADODB COM]] (데이터베이스 접근 인터페이스)
- related_to [[vecsearch]] (시맨틱 검색 — winsearch는 파일시스템 검색)
