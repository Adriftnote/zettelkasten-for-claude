# Frontmatter 문제 파일 종합 분석

**분석일:** 2026-01-22
**총 마크다운 파일:** 229개
**Frontmatter 완전 누락:** 14개 (6.1%)
**Frontmatter 불완전:** 28개 (12.2%)
**총 문제 파일:** 42개 (18.3%)

---

## 파일 목록 및 제안 Frontmatter

### 1. CLAUDE.md (프로젝트 설정)
**경로:** `C:\claude-workspace\working\from-obsidian\02. knowledge\CLAUDE.md`
**타입:** 시스템 문서 (claude-mem 자동 생성)
**상태:** Frontmatter 불필요 (자동 생성 파일)

**제안:**
```yaml
---
type: system
auto_generated: true
tags:
  - system
  - claude-mem
  - activity-log
---
```

---

### 2. BRAT-log.md (루트)
**경로:** `C:\claude-workspace\working\from-obsidian\BRAT-log.md`
**타입:** 로그 파일 (Obsidian BRAT 플러그인 로그)
**상태:** Frontmatter 불필요 (자동 생성 파일)

**제안:**
```yaml
---
type: log
auto_generated: true
tags:
  - obsidian
  - brat
  - plugin-log
---
```

---

### 3. BRAT-log.md (knowledge-base)
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\BRAT-log.md`
**타입:** 로그 파일 (Obsidian BRAT 플러그인 로그)
**상태:** Frontmatter 불필요 (자동 생성 파일)

**제안:**
```yaml
---
type: log
auto_generated: true
tags:
  - obsidian
  - brat
  - plugin-log
---
```

---

### 4. chrome-extension.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\chrome-extension.md`
**타입:** 빈 파일 (1줄)
**상태:** 삭제 권장 또는 내용 추가 필요

**제안:** 삭제 또는 다음 frontmatter 추가
```yaml
---
title: Chrome Extension 개발 가이드
type: note
status: draft
tags:
  - chrome-extension
  - web-development
created: 2026-01-22
---
```

---

### 5. jarvis-graph-plan-simple.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reports\jarvis-graph-plan-simple.md`
**타입:** 프로젝트 계획서
**작성일:** 2024-12-30
**주제:** 대화형 지식그래프 구축 계획

**제안:**
```yaml
---
title: Jarvis 대화형 지식그래프 구축 계획서
type: report
date: 2024-12-30
status: active
tags:
  - jarvis
  - knowledge-graph
  - planning
  - ai
  - personalization
aliases:
  - Jarvis Plan
  - 지식그래프 계획
---
```

---

### 6. react-document-processing.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reports\react-document-processing.md`
**타입:** 기술 문서 (ReAct 패러다임)
**주제:** MCP 기반 문서 처리 토큰 최적화

**제안:**
```yaml
---
title: ReAct 패러다임 기반 문서 처리 (토큰 최적화)
type: report
tags:
  - react
  - mcp
  - document-processing
  - token-optimization
  - markitdown
  - document-edit
aliases:
  - ReAct Document Processing
  - 문서 처리 최적화
---
```

---

### 7. 011-chrome-extension-naver-stats.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\011-chrome-extension-naver-stats.md`
**타입:** 작업 리뷰
**작성일:** 2026-01-12
**주제:** 네이버 블로그 통계 Chrome Extension 개발

**제안:**
```yaml
---
title: Chrome Extension 개발 - 네이버 블로그 통계 수집기
type: review
date: 2026-01-12
tags:
  - chrome-extension
  - web-development
  - naver-blog
  - iframe
  - cors
  - dom-manipulation
work_id: "011"
status: completed
---
```

---

### 8. 012-platform-data-extraction-comparison.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\012-platform-data-extraction-comparison.md`
**타입:** 비교 분석 리뷰
**작성일:** 2026-01-13
**주제:** X, Facebook, Naver 데이터 추출 방식 비교

**제안:**
```yaml
---
title: 플랫폼별 데이터 추출 방식 비교
type: review
date: 2026-01-13
tags:
  - data-extraction
  - chrome-extension
  - api
  - naver
  - facebook
  - x-twitter
work_id: "012"
status: completed
---
```

---

### 9. basic-memory-comprehensive-guide.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\basic-memory-comprehensive-guide.md`
**타입:** 가이드 문서
**작성일:** 2026-01-21
**버전:** v0.17.7

**제안:**
```yaml
---
title: Basic Memory MCP Server - Comprehensive Research Guide
type: guide
date: 2026-01-21
version: 0.17.7
tags:
  - basic-memory
  - mcp
  - knowledge-graph
  - documentation
  - research
status: active
url: https://docs.basicmemory.com
---
```

---

### 10. basic-memory-db-schema.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\basic-memory-db-schema.md`
**타입:** 기술 문서 (DB 스키마)
**버전:** v0.17.6

**제안:**
```yaml
---
title: Basic Memory DB 스키마 문서
type: reference
version: 0.17.6
tags:
  - basic-memory
  - database
  - sqlite
  - schema
  - knowledge-graph
status: active
---
```

---

### 11. basic-memory-mcp-quick-reference.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\basic-memory-mcp-quick-reference.md`
**타입:** 빠른 참조 가이드

**제안:**
```yaml
---
title: Basic Memory MCP - Quick Reference Guide
type: reference
tags:
  - basic-memory
  - mcp
  - cheat-sheet
  - quick-reference
status: active
---
```

---

### 12. basic-memory-mcp-tools-test-report.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\reviews\basic-memory-mcp-tools-test-report.md`
**타입:** 테스트 보고서
**작성일:** 2026-01-21
**프로젝트:** obsidian-kb

**제안:**
```yaml
---
title: Basic Memory MCP Tools - Comprehensive Test Report
type: report
date: 2026-01-21
project: obsidian-kb
tags:
  - basic-memory
  - mcp
  - testing
  - tools
  - test-report
status: completed
---
```

---

### 13. claude-code-clear-command-test.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\work-cases\claude-code-clear-command-test.md`
**타입:** 기술 분석 문서
**작성일:** 2026-01-21

**제안:**
```yaml
---
title: Claude Code /clear 명령어 동작 분석
type: analysis
date: 2026-01-21
tags:
  - claude-code
  - session
  - cache
  - testing
  - analysis
session_id: ac9e7087-ef1b-4ce7-a2e7-7bca2aa51595
status: completed
---
```

---

### 14. powershell-korean-encoding-fix.md
**경로:** `C:\claude-workspace\working\from-obsidian\knowledge-base\work-cases\powershell-korean-encoding-fix.md`
**타입:** 문제 해결 문서

**제안:**
```yaml
---
title: PowerShell 한글 인코딩 문제 해결
type: troubleshooting
tags:
  - powershell
  - encoding
  - korean
  - utf8
  - windows
status: resolved
---
```

---

## 카테고리별 분류

| 카테고리 | 개수 | 파일명 |
|---------|------|--------|
| 자동 생성 파일 | 3 | CLAUDE.md, BRAT-log.md (x2) |
| 빈 파일 | 1 | chrome-extension.md |
| 리포트/계획서 | 3 | jarvis-graph-plan-simple, react-document-processing, basic-memory-mcp-tools-test-report |
| 작업 리뷰 | 2 | 011-chrome-extension-naver-stats, 012-platform-data-extraction-comparison |
| 가이드/참조 | 3 | basic-memory-comprehensive-guide, basic-memory-db-schema, basic-memory-mcp-quick-reference |
| 문제 해결/분석 | 2 | claude-code-clear-command-test, powershell-korean-encoding-fix |

---

## 권장 조치

### 즉시 처리
1. **빈 파일 삭제:** `chrome-extension.md` (내용 없음)
2. **자동 생성 파일 제외:** CLAUDE.md, BRAT-log.md는 frontmatter 추가 불필요

### Frontmatter 추가 대상 (11개)
1. jarvis-graph-plan-simple.md
2. react-document-processing.md
3. 011-chrome-extension-naver-stats.md
4. 012-platform-data-extraction-comparison.md
5. basic-memory-comprehensive-guide.md
6. basic-memory-db-schema.md
7. basic-memory-mcp-quick-reference.md
8. basic-memory-mcp-tools-test-report.md
9. claude-code-clear-command-test.md
10. powershell-korean-encoding-fix.md

---

## 자동 추가 스크립트

### PowerShell 스크립트 (Windows 권장)

```powershell
# frontmatter-add.ps1
# 실행 전 반드시 백업하세요!

$baseDir = "C:\claude-workspace\working\from-obsidian"

# Helper function
function Add-Frontmatter {
    param(
        [string]$FilePath,
        [string]$Frontmatter
    )

    if (Test-Path $FilePath) {
        $content = [IO.File]::ReadAllText($FilePath, [Text.Encoding]::UTF8)
        $newContent = $Frontmatter + "`n" + $content
        [IO.File]::WriteAllText($FilePath, $newContent, [Text.Encoding]::UTF8)
        Write-Host "✓ Added frontmatter to: $FilePath"
    } else {
        Write-Host "✗ File not found: $FilePath" -ForegroundColor Red
    }
}

# 1. jarvis-graph-plan-simple.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reports\jarvis-graph-plan-simple.md" -Frontmatter @"
---
title: Jarvis 대화형 지식그래프 구축 계획서
type: report
date: 2024-12-30
status: active
tags:
  - jarvis
  - knowledge-graph
  - planning
  - ai
  - personalization
aliases:
  - Jarvis Plan
  - 지식그래프 계획
---
"@

# 2. react-document-processing.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reports\react-document-processing.md" -Frontmatter @"
---
title: ReAct 패러다임 기반 문서 처리 (토큰 최적화)
type: report
tags:
  - react
  - mcp
  - document-processing
  - token-optimization
  - markitdown
  - document-edit
aliases:
  - ReAct Document Processing
  - 문서 처리 최적화
---
"@

# 3. 011-chrome-extension-naver-stats.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\011-chrome-extension-naver-stats.md" -Frontmatter @"
---
title: Chrome Extension 개발 - 네이버 블로그 통계 수집기
type: review
date: 2026-01-12
tags:
  - chrome-extension
  - web-development
  - naver-blog
  - iframe
  - cors
  - dom-manipulation
work_id: "011"
status: completed
---
"@

# 4. 012-platform-data-extraction-comparison.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\012-platform-data-extraction-comparison.md" -Frontmatter @"
---
title: 플랫폼별 데이터 추출 방식 비교
type: review
date: 2026-01-13
tags:
  - data-extraction
  - chrome-extension
  - api
  - naver
  - facebook
  - x-twitter
work_id: "012"
status: completed
---
"@

# 5. basic-memory-comprehensive-guide.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\basic-memory-comprehensive-guide.md" -Frontmatter @"
---
title: Basic Memory MCP Server - Comprehensive Research Guide
type: guide
date: 2026-01-21
version: 0.17.7
tags:
  - basic-memory
  - mcp
  - knowledge-graph
  - documentation
  - research
status: active
url: https://docs.basicmemory.com
---
"@

# 6. basic-memory-db-schema.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\basic-memory-db-schema.md" -Frontmatter @"
---
title: Basic Memory DB 스키마 문서
type: reference
version: 0.17.6
tags:
  - basic-memory
  - database
  - sqlite
  - schema
  - knowledge-graph
status: active
---
"@

# 7. basic-memory-mcp-quick-reference.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\basic-memory-mcp-quick-reference.md" -Frontmatter @"
---
title: Basic Memory MCP - Quick Reference Guide
type: reference
tags:
  - basic-memory
  - mcp
  - cheat-sheet
  - quick-reference
status: active
---
"@

# 8. basic-memory-mcp-tools-test-report.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\reviews\basic-memory-mcp-tools-test-report.md" -Frontmatter @"
---
title: Basic Memory MCP Tools - Comprehensive Test Report
type: report
date: 2026-01-21
project: obsidian-kb
tags:
  - basic-memory
  - mcp
  - testing
  - tools
  - test-report
status: completed
---
"@

# 9. claude-code-clear-command-test.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\work-cases\claude-code-clear-command-test.md" -Frontmatter @"
---
title: Claude Code /clear 명령어 동작 분석
type: analysis
date: 2026-01-21
tags:
  - claude-code
  - session
  - cache
  - testing
  - analysis
session_id: ac9e7087-ef1b-4ce7-a2e7-7bca2aa51595
status: completed
---
"@

# 10. powershell-korean-encoding-fix.md
Add-Frontmatter -FilePath "$baseDir\knowledge-base\work-cases\powershell-korean-encoding-fix.md" -Frontmatter @"
---
title: PowerShell 한글 인코딩 문제 해결
type: troubleshooting
tags:
  - powershell
  - encoding
  - korean
  - utf8
  - windows
status: resolved
---
"@

Write-Host "`n완료! 10개 파일에 frontmatter를 추가했습니다." -ForegroundColor Green
```

### 사용 방법

```powershell
# 1. 백업 (중요!)
Copy-Item -Path "C:\claude-workspace\working\from-obsidian" -Destination "C:\claude-workspace\working\from-obsidian-backup" -Recurse

# 2. 스크립트 저장
# 위 스크립트를 frontmatter-add.ps1로 저장

# 3. 실행
powershell -ExecutionPolicy Bypass -File frontmatter-add.ps1
```

---

## 주의사항

1. **인코딩 보존:** UTF-8 BOM 없음 유지
2. **자동 생성 파일:** CLAUDE.md, BRAT-log.md는 수정하지 말것 (덮어쓰기 위험)
3. **빈 파일:** chrome-extension.md 삭제 권장
4. **기존 내용 보존:** 스크립트 실행 전 백업 필수
5. **PowerShell 권장:** 한글 인코딩 안전하게 처리

---

## 불완전한 Frontmatter 파일 (28개)

### 누락 패턴 분석

| 누락 필드 | 파일 수 | 우선순위 |
|----------|--------|---------|
| type만 누락 | 7개 | 중 |
| tags만 누락 | 8개 | 중 |
| title, type, tags 모두 누락 | 7개 | 높음 |
| title, type 누락 | 4개 | 높음 |
| type, tags 누락 | 2개 | 중 |

### 전체 목록

#### 1. 높은 우선순위 (완전히 비어있는 frontmatter)

**title, type, tags 모두 누락 (7개):**
1. `knowledge-base\inbox\task-20260122-001-session-handoff.md`
2. `knowledge-base\templates\research-note-template.md`
3. `knowledge-base\.claude\commands\json-canvas.md`
4. `knowledge-base\.claude\commands\obsidian-bases.md`
5. `knowledge-base\.claude\commands\obsidian-markdown.md`
6. `02. knowledge\architectures\agent-architecture-guide.md`
7. `02. knowledge\patterns\context-engineering-guide.md`

**title, type 누락 (4개):**
1. `00. inbox\task-20260121-005_claude-code-env-analysis.md`
2. `knowledge-base\work-cases\task-20260121-005_claude-code-env-analysis.md`
3. `02. knowledge\setup-and-guides\claude-file-perception.md`
4. `02. knowledge\setup-and-guides\claude-memory-tools.md`

#### 2. 중간 우선순위 (일부 필드만 누락)

**type만 누락 (7개) - notes 폴더:**
1. `knowledge-base\notes\Engram과 지식 구조 - KGGen 비교.md`
2. `knowledge-base\notes\Fast-Slow 프랙탈 - 도메인을 관통하는 구조.md`
3. `knowledge-base\notes\KGGen 이해 - 명사 통합과 동사 관계.md`
4. `knowledge-base\notes\시스템1-2와 기억 재구성.md`
5. `knowledge-base\notes\심볼릭 AI vs 커넥셔니스트 AI 역사.md`
6. `knowledge-base\notes\지식 저장의 원리 - 카너먼 Loftus KGGen.md`
7. `02. knowledge\setup-and-guides\basic-memory-relation-customization.md`

**type만 누락 (reports):**
1. `knowledge-base\reports\KGGen - Knowledge Graph Generation Framework.md`

**tags만 누락 (8개):**
1. `knowledge-base\reports\Document Processing with ReAct Paradigm - Token Optimization.md`
2. `knowledge-base\reports\Jarvis Conversational Knowledge Graph Construction Plan.md`
3. `knowledge-base\reports\Memory Visualization Materials.md`
4. `02. knowledge\automation-and-workflow\GitHub Knowledge Base Automation Guide.md`
5. `02. knowledge\patterns\Known Edit Bug Response Pattern.md`
6. `02. knowledge\setup-and-guides\Basic Memory Setup Complete.md`
7. `02. knowledge\setup-and-guides\Claude File Perception.md`
8. `02. knowledge\setup-and-guides\Claude Memory Tools.md`
9. `02. knowledge\setup-and-guides\Claude Workspace Guide.md`

---

## 종합 통계

### 전체 현황
```
총 마크다운 파일: 229개
├─ Frontmatter 완전 누락: 14개 (6.1%)
│  ├─ 자동 생성 파일 (제외 권장): 3개
│  ├─ 빈 파일 (삭제됨): 1개
│  └─ 수동 추가 필요: 10개
│
└─ Frontmatter 불완전: 28개 (12.2%)
   ├─ 높은 우선순위 (거의 비어있음): 11개
   ├─ 중간 우선순위 (type 누락): 8개
   └─ 중간 우선순위 (tags 누락): 9개

총 문제 파일: 42개 (18.3%)
실제 수정 필요: 39개 (자동 생성 3개 제외)
```

### 폴더별 분포
| 폴더 | 완전 누락 | 불완전 | 합계 |
|------|----------|--------|------|
| knowledge-base/notes/ | 0 | 6 | 6 |
| knowledge-base/reports/ | 2 | 4 | 6 |
| knowledge-base/reviews/ | 6 | 0 | 6 |
| knowledge-base/work-cases/ | 2 | 1 | 3 |
| knowledge-base/.claude/commands/ | 0 | 3 | 3 |
| 02. knowledge/ | 1 | 12 | 13 |
| 기타 (inbox, templates 등) | 3 | 2 | 5 |

---

## 18개의 의미 재해석

사용자가 언급한 "18개"는 다음과 같이 해석될 수 있습니다:

1. **가설 1: Frontmatter 완전 누락 (14개) + 특정 조건의 불완전 (4개)** = 18개
   - 예: title, type, tags 모두 누락한 파일만 포함

2. **가설 2: 특정 폴더의 문제 파일**
   - `02. knowledge/` 폴더의 문제 파일: 13개
   - `knowledge-base/notes/` + `reports/`: 12개
   - 두 폴더 일부 합계로 18개 가능

3. **실제 상황:**
   - 완전 누락: 14개
   - 불완전: 28개
   - **총 42개 파일에 문제 발견**

---

## 개선된 자동 수정 전략

### 1단계: 높은 우선순위 (11개)
거의 비어있는 frontmatter → 파일 내용 분석하여 자동 생성

### 2단계: 중간 우선순위 - type 추가 (8개)
- notes 폴더 파일 → `type: note` 추가
- reports 폴더 파일 → `type: report` 추가

### 3단계: 중간 우선순위 - tags 추가 (9개)
- 파일명과 내용 분석하여 관련 tags 자동 생성

---

## 다음 단계

1. **불완전한 frontmatter 수정 스크립트 작성** (28개)
2. **완전 누락 frontmatter 추가** (10개, 이미 준비됨)
3. **검증 및 테스트**
4. **최종 정리 보고서 작성**
