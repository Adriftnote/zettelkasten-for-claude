---
title: Claude Code 환경설정 정비 — Junction 중첩과 MCP 등록 오류 해결
type: changelog
permalink: logs/claude-code-env-cleanup-junction-mcp
tags:
- claude-code
- environment
- mcp
- junction
- troubleshooting
date: 2026-01-21
---

# Claude Code 환경설정 정비 — Junction 중첩과 MCP 등록 오류 해결

> Task-002/003 완료 후 환경설정이 의도와 다르게 되어있어 심층 분석. MCP 등록 방식 오류, 중첩 .claude 폴더, hooks matcher 불일치 발견 및 해결.

## 흐름
```
환경설정 의도와 실제가 불일치
  ├── 문제 1: MCP 등록 방식 오류
  │     ├── settings.json에 mcpServers 있지만 인식 안 됨
  │     ├── 원인: Claude Code는 settings.json이 아닌 .claude.json에서 MCP 로드
  │     └── 해결: `claude mcp add -s user basic-memory uvx basic-memory mcp`
  │
  ├── 문제 2: 중첩된 .claude 폴더
  │     ├── Task-003 Junction 생성 시 원본 폴더 미삭제
  │     ├── 두 settings.json이 다른 설정 (basic-memory vs google-sheets)
  │     └── 해결: 원본 → _system/backups/ 이동
  │
  ├── 문제 3: hooks matcher 불일치
  │     ├── 원본: "*" (모든 도구) → 병합 후: "" (빈 문자열)
  │     └── 해결: "" → "*" 수정
  │
  └── 최종 상태
        ├── settings.json: hooks + env (MCP 없음)
        ├── .claude.json: MCP basic-memory ✓ Connected
        └── 중첩 폴더 제거, 백업 완료
```

## Observations
- [fact] Claude Code 설정 파일 역할 분리: settings.json(hooks/env/plugins), settings.local.json(권한), .claude.json(MCP/프로젝트) #claude-code #config
- [fact] MCP 등록은 `claude mcp add` 명령어만 유효 — settings.json 직접 편집은 인식 안 됨 #mcp #registration
- [warning] Junction 생성 시 원본 폴더 삭제/이동 필수 — 안 하면 중첩 구조 발생 #junction #cleanup
- [decision] basic-memory MCP를 user 스코프로 등록 — Claudian(Obsidian)과 Claude Code 간 지식 공유 목적 #mcp #basic-memory

## Relations
- part_of [[Windows Junction에서 Claude Code 팀 도구 실패 해결]] (Junction 관련 트러블슈팅)
