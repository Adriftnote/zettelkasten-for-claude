---
title: main-vec-watcher
type: function
permalink: functions/main-vec-watcher
level: low
category: search/semantic/watcher
semantic: watch memory db for changes
path: C:\claude-workspace\_system\vector-search\vec-watcher.py
tags:
- python
- watchfiles
---

# main-vec-watcher

memory.db의 변경을 감시하여 자동 sync를 실행하는 메인 루프

## 📖 시그니처

```python
def main()
```

## Observations

- [impl] watchfiles.watch()로 OS 수준 파일 변경 이벤트 감지 (polling 아님) #os-events
- [impl] watch_filter로 memory.db 파일만 감시 (다른 파일 무시) #filter
- [impl] 5초 debounce로 basic-memory 쓰기 완료 대기 후 반응 #debounce
- [impl] Change.modified 이벤트만 처리 (생성/삭제는 무시) #event-filter
- [impl] 이벤트 묶음당 sync 1회 실행 (중복 방지) #dedup
- [impl] memory.db 존재 확인 후 시작, 없으면 sys.exit(1) #validation
- [return] None (무한 루프)
- [deps] watchfiles #import
- [note] 선택적 구성요소, Claude Code Stop hook이 기본 동기화 방식 #optional

## Relations

- part_of [[vec-watcher]] (소속 모듈)
- calls [[run-sync-watcher]] (변경 감지 시 sync 실행)