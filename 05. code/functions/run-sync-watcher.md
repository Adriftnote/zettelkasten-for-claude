---
title: run-sync-watcher
type: function
permalink: functions/run-sync-watcher
level: low
category: search/semantic/watcher
semantic: run vector sync subprocess
path: C:\claude-workspace\_system\vector-search\vec-watcher.py
tags:
- python
- subprocess
---

# run-sync-watcher

vecsearch.py sync를 subprocess로 호출하는 함수

## 📖 시그니처

```python
def run_sync()
```

## Observations

- [impl] subprocess.run으로 vecsearch.py sync 호출 #subprocess
- [impl] capture_output=True로 stdout/stderr 캡처 #capture
- [impl] encoding="utf-8", errors="replace"로 Windows 인코딩 대응 #encoding
- [impl] 실행 시간 측정 후 결과와 함께 출력 #timing
- [impl] "Sync complete" 또는 "new" 포함된 줄만 출력 (모델 로딩 메시지 제외) #filter
- [return] None (콘솔 출력)
- [deps] subprocess, sys, time #import

## Relations

- part_of [[vec-watcher]] (소속 모듈)
- calls [[cmd-sync]] (vecsearch.py sync 간접 호출)