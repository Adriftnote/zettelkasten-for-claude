---
title: Claude 환경 설정 구조
type: note
permalink: reference/claude-hwangyeong-seoljeong-gujo
tags:
- claude
- configuration
- environment
- reference
---

# Claude 환경 설정 구조

## 개요

Windows에서 사용 중인 Claude 관련 환경 설정의 위치와 역할을 정리한 문서.

## 핵심 구조

- [Claude Code 설정 폴더](claude-code-settings) [is located at] `C:\claude-workspace\environments\claude-code`
- [사용자 홈 .claude](user-home-claude) [is junction to] [Claude Code 설정 폴더](claude-code-settings)
- [Junction 경로](junction-path) [points from] `C:\Users\RL\.claude` [to] `C:\claude-workspace\environments\claude-code`

## 설정 파일 역할

### settings.json
- [settings.json](settings-json) [controls] 환경변수, 플러그인, statusLine
- [settings.json](settings-json) [contains] DISABLE_AUTOUPDATER=1
- [settings.json](settings-json) [contains] alwaysThinkingEnabled=true
- [settings.json](settings-json) [configures] statusLine PowerShell 스크립트

### settings.local.json
- [settings.local.json](settings-local-json) [controls] 권한 설정 (allow/deny)
- [settings.local.json](settings-local-json) [allows] sqlite3, python, pip install
- [settings.local.json](settings-local-json) [allows] WebFetch for github.com

### .claude.json
- [.claude.json](claude-json) [stores] MCP 서버 설정
- [.claude.json](claude-json) [stores] 프로젝트별 설정 및 통계
- [.claude.json](claude-json) [stores] OAuth 계정 정보
- [.claude.json](claude-json) [configures] basic-memory MCP 서버

### .credentials.json
- [.credentials.json](credentials-json) [contains] OAuth 토큰 (민감정보)
- [.credentials.json](credentials-json) [is managed by] Claude Code 자동 생성

### CLAUDE.md
- [CLAUDE.md](claude-md-global) [provides] 전역 지침
- [CLAUDE.md](claude-md-global) [defines] 작업 규칙, MCP 관리 방법

## 다른 Claude 경로

### APPDATA\Claude
- [APPDATA Claude](appdata-claude) [is located at] `C:\Users\RL\AppData\Roaming\Claude`
- [APPDATA Claude](appdata-claude) [contains] Claude Desktop 앱 설정
- [APPDATA Claude](appdata-claude) [contains] claude_desktop_config.json (Desktop MCP 설정)
- [APPDATA Claude](appdata-claude) [contains] claude-code/2.1.8 (설치 버전)

### Claude Desktop MCP vs Claude Code MCP
- [Claude Desktop MCP](desktop-mcp) [is configured in] `%APPDATA%\Claude\claude_desktop_config.json`
- [Claude Code MCP](code-mcp) [is configured in] `.claude.json` via `claude mcp add`
- [Claude Desktop MCP](desktop-mcp) [is separate from] [Claude Code MCP](code-mcp)

## environments 폴더 구조

### claude-code/ (실사용)
- [claude-code 폴더](env-claude-code) [status] ✅ Junction 연결됨
- [claude-code 폴더](env-claude-code) [contains] 모든 Claude Code 설정
- [claude-code 폴더](env-claude-code) [includes] cache, commands, config, debug, plugins, projects, todos, transcripts

### 기타 환경 폴더
- [chrome-claude](env-chrome-claude) [purpose] Chrome Claude 다운로드
- [claudian](env-claudian) [purpose] Obsidian Claudian (commands, sessions)
- [cowork](env-cowork) [purpose] Cowork 공유 폴더
- [excel-claude](env-excel-claude) [purpose] Excel Claude 출력물
- [claude-code-backup.20260115](env-backup) [purpose] 백업

## 설정 변경 방법

### MCP 서버 추가
```bash
claude mcp add -s user <name> <command> [args...]
# 예: claude mcp add -s user basic-memory uvx basic-memory mcp
```

### 권한 설정
- 직접 `settings.local.json` 편집
- 또는 런타임에서 승인 시 자동 추가

### 환경변수/플러그인
- 직접 `settings.json` 편집

## 주의사항

- [Junction 링크](junction-warning) [requires] 삭제 시 원본 폴더 영향 주의
- [.credentials.json](credentials-warning) [should not be] 공유 또는 버전관리
- [settings.json](settings-warning) [should be] 백업 권장


---

## Obsidian (Claudian) 환경

### Junction 구조
- [Obsidian 설정 폴더](obsidian-settings) [is located at] `C:\claude-workspace\environments\obsidian`
- [Vault .claude](vault-claude) [is junction to] [Obsidian 설정 폴더](obsidian-settings)
- [Junction 경로](obsidian-junction) [points from] `C:\claude-workspace\working\from-obsidian\.claude` [to] `environments\obsidian`

### 폴더 구조
```
environments/obsidian/
├── claudian-settings.json   ← Claudian 앱 설정
├── mcp.json                 ← MCP 서버 설정
├── commands/                ← 커스텀 슬래시 명령어
└── sessions/                ← 대화 세션 메타데이터
```

### 설정 파일
- [claudian-settings.json](claudian-settings) [controls] 사용자명, 권한모드, 모델, 키보드 설정
- [claudian-settings.json](claudian-settings) [contains] permissionMode=yolo, model=opus
- [mcp.json](claudian-mcp) [configures] basic-memory MCP

### Vault 위치
- [Obsidian Vault](obsidian-vault) [is located at] `C:\claude-workspace\working\from-obsidian`
- [Obsidian Vault](obsidian-vault) [uses plugin] Claudian, Dataview, Templater, BRAT
