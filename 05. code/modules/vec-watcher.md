---
title: vec-watcher
type: module
permalink: modules/vec-watcher
level: low
category: search/semantic/automation
semantic: auto-sync vector embeddings on db change
path: C:\claude-workspace\_system\vector-search\vec-watcher.py
tags:
- python
- watchfiles
- automation
- vector-search
---

# vec-watcher

memory.db 변경 감지 시 벡터 임베딩 자동 동기화

## 📖 개요

basic-memory의 memory.db 파일을 OS-level 이벤트로 감시하여, 변경 시 vecsearch sync를 자동 실행.
watchfiles 라이브러리(Rust 네이티브) 사용으로 폴링이 아닌 이벤트 기반.

## Observations

- [impl] watchfiles 라이브러리로 memory.db 감시 (OS-level 이벤트, 폴링 아님) #mechanism
- [impl] 5초 debounce로 basic-memory 쓰기 완료 대기 후 sync 실행 #timing
- [deps] watchfiles, subprocess #import
- [usage] `python vec-watcher.py` 실행 후 백그라운드 유지
- [note] 현재는 Claude Code Stop hook으로 대체 (세션 종료 시 sync) #status
- [note] 상시 감시가 필요하면 이 스크립트를 실행 #optional

## 동작 흐름

```
노트 수정 (Obsidian)
    ↓ basic-memory file watcher (watchfiles, 실시간)
memory.db 업데이트
    ↓ vec-watcher 감지 (watchfiles, 5초 debounce)
vecsearch sync 실행
    ↓ 변경된 노트만 재임베딩
vectors.db 업데이트
```

## Relations
- part_of [[벡터 시맨틱 검색]] (소속 프로젝트)
- depends_on [[vecsearch]] (sync 명령 호출)
- watches [[basic-memory]] (memory.db 감시)
- contains [[run-sync-watcher]] (subprocess sync 호출)
- contains [[main-vec-watcher]] (watchfiles 감시 루프)
