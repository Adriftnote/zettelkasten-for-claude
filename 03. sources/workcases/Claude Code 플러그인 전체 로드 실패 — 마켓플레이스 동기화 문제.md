---
title: Claude Code 플러그인 전체 로드 실패 — 마켓플레이스 동기화 문제
type: workcase
permalink: sources/workcases/claude-code-plugin-load-failure-marketplace-sync
tags:
- claude-code
- plugin
- git
- cache
- windows
- troubleshooting
---

# Claude Code 플러그인 전체 로드 실패 — 마켓플레이스 동기화 문제

## 문제 상황

Claude Code에 설치된 **8개 공식 플러그인 전부 `failed to load`** 상태로 작동 불가.

- 설치된 플러그인: superpowers, frontend-design, playwright, commit-commands, code-review, claude-code-setup, claude-md-management, figma
- `/plugin` → Installed 탭에서 전부 에러 표시
- 환경: Windows 11, Claude Code standalone

## 시도했지만 안 된 방법

1. `claude plugin install <name>` 재설치 시도 → Claude Code 세션 내부에서 중첩 실행 불가
2. `/plugin` UI에서 직접 재설치 → 동일 에러 반복

## 근본 원인

```
마켓플레이스 Git 리포 (claude-plugins-official)
  └─ local이 origin/main보다 24 commits 앞서 있음
       └─ 플러그인 캐시와 실제 마켓플레이스 상태 불일치
            └─ 모든 플러그인 manifest 로드 실패
```

- 마켓플레이스 위치: `C:\ClaudeCode\plugins\marketplaces\claude-plugins-official`
- `git status`에서 `ahead of origin/main by 24 commits` 확인
- 캐시 위치: `~/.claude/plugins/cache/claude-plugins-official`

## 해결 방법

### 1단계: 마켓플레이스 Git 리셋

```bash
cd "C:\ClaudeCode\plugins\marketplaces\claude-plugins-official"
git fetch origin
git reset --hard origin/main
```

### 2단계: 플러그인 캐시 삭제

캐시 디렉토리를 수동으로 삭제:

```
%USERPROFILE%\.claude\plugins\cache\claude-plugins-official
```

### 3단계: 세션 재시작 후 재설치

별도 터미널에서:

```bash
claude plugin install superpowers@claude-plugins-official
claude plugin install frontend-design@claude-plugins-official
# ... 각 플러그인별 반복
```

## 교훈

- 플러그인 전체 실패 시 **마켓플레이스 Git 동기화 상태**를 먼저 확인
- 캐시 디렉토리와 마켓플레이스 리포가 분리되어 있으므로 양쪽 다 정리해야 함
- Claude Code 세션 안에서는 `claude plugin install` 중첩 실행 불가 → 별도 터미널 필요
- block-dangerous-bash hook이 유지보수 명령 패턴을 차단하므로, 이런 작업 시 hook 화이트리스트 또는 수동 실행 필요

## 관련 노트

- [[Claude Code 플러그인 시스템 (Plugin System)]]
- [[block-dangerous-bash hook]]

## Relations

- solves [[Claude Code 플러그인 로드 실패]]
- caused_by [[마켓플레이스 Git 동기화 불일치]]
- related_to [[Claude in Chrome 연결 문제 해결 (Named Pipe)]]
- environment [[Windows 11]]
- tool [[Claude Code]]
