---
title: main-vecsearch
type: function
permalink: functions/main-vecsearch
level: low
category: search/semantic/cli
semantic: cli entry point
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- cli
- argparse
---

# main-vecsearch

vecsearch.py의 CLI 엔트리포인트 (argparse 기반)

## 📖 시그니처

```python
def main()
```

## Observations

- [impl] argparse로 4개 서브커맨드 정의: index, sync, search, stats #argparse
- [impl] search 서브커맨드에 --top, --type, --project, --unique 옵션 #options
- [impl] `if __name__ == "__main__"` 가드로 스크립트 직접 실행 시만 동작 #guard
- [return] None (서브커맨드 함수에 위임)
- [deps] argparse #import

## 서브커맨드 매핑

```
index  → cmd_index(args)   전체 재인덱싱
sync   → cmd_sync(args)    증분 동기화
search → cmd_search(args)  시맨틱 검색
stats  → cmd_stats(args)   인덱스 통계
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[cmd-index]] (index 명령)
- calls [[cmd-sync]] (sync 명령)
- calls [[cmd-search]] (search 명령)
- calls [[cmd-stats]] (stats 명령)