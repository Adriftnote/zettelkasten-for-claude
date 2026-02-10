---
title: find-naver-file
type: function
level: low
category: "search/file/pattern"
semantic: "find naver file"
permalink: functions/find-naver-file
path: "outputs/26.1Q/[전략기획팀] SNS 정합성 검증/202601/REVIEW_202601.qmd"
tags:
- python
- naver
---

# find-naver-file

Naver 통계 CSV/XLSX 파일을 패턴 매칭으로 찾는 함수

## 📖 시그니처

```python
def find_naver_file(
    data_path: Path, 
    prefix: str, 
    month_range: str
) -> Path | None
```

## Observations

- [impl] glob 패턴 매칭으로 prefix와 날짜 범위로 탐색 #pattern
- [return] 파일 경로 (Path) 또는 None
- [usage] `naver_views_path = find_naver_file(data_path, 'views_monthly', '2026-01-01_2026-01-31')`
- [deps] pathlib, glob #import
- [note] Naver 파일은 다운로드 시 타임스탬프 붙음, CSV 먼저 시도 후 XLSX #context

## 파일명 패턴

```
{prefix}_{month_range}_{timestamp}.csv
예: views_monthly_2026-01-01_2026-01-31_20260202_110048.csv
```

## Relations

- part_of [[review-qmd]] (소속 모듈)
- data_flows_to [[parse-csv-column-sum]] (파일 경로 → CSV 파싱)