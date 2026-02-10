---
title: parse-csv-column-sum
type: function
level: low
category: "parsing/csv/extract"
semantic: "parse csv column sum"
permalink: functions/parse-csv-column-sum
path: "outputs/26.1Q/[전략기획팀] SNS 정합성 검증/202601/REVIEW_202601.qmd"
tags:
- python
- csv
---

# parse-csv-column-sum

CSV 파일에서 정규식으로 숫자를 추출하고 합계를 반환하는 함수

## 📖 시그니처

```python
def parse_csv_column_sum(
    filepath, 
    column_idx=-1, 
    skip_rows=3, 
    encoding='utf-8', 
    pattern=r'"(\d+)"'
) -> int
```

## Observations

- [impl] 정규식 패턴으로 숫자 추출 후 합산 #algo
- [return] 컬럼 합계 (int), 에러 시 0
- [usage] `instagram_views = parse_csv_column_sum(data_path / 'instagram_views_utf8.csv')`
- [deps] re, csv, pathlib #import
- [note] Instagram, Facebook 등 플랫폼별 CSV 파싱에 사용 #context 
## 파라미터

- filepath: CSV 파일 경로
- column_idx: 컬럼 인덱스 (기본 -1, 미사용)
- skip_rows: 건너뛸 헤더 행 수 (기본 3)
- encoding: 인코딩 (기본 utf-8)
- pattern: 숫자 추출 정규식 (기본 r'"(\d+)"')

## Relations

- part_of [[review-qmd]] (소속 모듈)
- data_flows_to [[main-review-qmd]] (합계값 → 비교 로직)