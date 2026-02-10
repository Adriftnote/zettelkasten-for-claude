---
title: find-youtube-folder
type: function
level: low
category: "search/file/pattern"
semantic: "find youtube folder"
permalink: functions/find-youtube-folder
path: "outputs/26.1Q/[전략기획팀] SNS 정합성 검증/202601/REVIEW_202601.qmd"
tags:
- python
- youtube
---

# find-youtube-folder

YouTube Studio 데이터 폴더를 패턴으로 찾는 함수

## 📖 시그니처

```python
def find_youtube_folder(
    data_path: Path, 
    year: int, 
    month: int, 
    next_month: int
) -> Path | None
```

## Observations

- [impl] 폴더명 패턴으로 해당 월 폴더 탐색 #pattern
- [return] 폴더 경로 (Path) 또는 None
- [usage] `yt_folder = find_youtube_folder(data_path, 2026, 1, 2)`
- [deps] pathlib #import
- [note] YouTube Studio 다운로드 데이터는 폴더 단위로 저장됨 #context

## 폴더명 패턴

```
youtube_content_{year}-{month:02d}-01_{year}-{next_month:02d}-01
예: youtube_content_2026-01-01_2026-02-01
```

## Relations

- part_of [[review-qmd]] (소속 모듈)
- data_flows_to [[main-review-qmd]] (폴더 경로 → YouTube 데이터 처리)