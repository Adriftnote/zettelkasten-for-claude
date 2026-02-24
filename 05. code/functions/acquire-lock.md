---
title: acquire-lock
type: function
permalink: functions/acquire-lock
level: low
category: search/semantic/concurrency
semantic: prevent concurrent vecsearch sync processes using OS-level file lock
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- concurrency
- file-lock
---

# acquire-lock

동시에 여러 vecsearch sync가 실행되는 것을 방지하는 OS 레벨 파일 락

## 📖 시그니처

```python
def acquire_lock() -> Optional[file_object]
```

## Observations

- [impl] Windows: msvcrt.locking(LK_NBLCK), Unix: fcntl.flock(LOCK_EX|LOCK_NB) #cross-platform
- [impl] 락 획득 실패 시 None 반환 → cmd_sync에서 "Already running" 출력 후 스킵 #graceful
- [impl] 락 파일 경로: `_system/vector-search/.vecsearch.lock` #lockfile
- [note] Stop hook + 수동 sync 동시 실행 방지 목적으로 추가 (2026-02-13) #history
- [deps] msvcrt (Windows), fcntl (Unix) #import

## Relations

- part_of [[vecsearch]] (소속 모듈)
- called_by [[cmd-sync]] (line 306)