---
title: main-review-qmd
type: function
level: low
category: "validation/csv/entrypoint"
semantic: "run review validation"
permalink: functions/main-review-qmd
path: "outputs/26.1Q/[전략기획팀] SNS 정합성 검증/202601/REVIEW_202601.qmd"
tags:
- python
- quarto
- entrypoint
---

# main-review-qmd

review-qmd 모듈의 검증 실행 흐름 (Quarto 코드 청크)

## 📖 개요

QMD 파일의 Python 코드 청크들이 순차 실행되며 검증 로직을 수행합니다. 환경 설정 → CSV 파싱 → DB 조회 → 비교 분석 순서로 진행됩니다.

## Observations

- [impl] 플랫폼별 CSV 파싱 후 DB Summary와 비교 #algo
- [return] pandas DataFrame으로 비교 결과 생성
- [usage] `quarto render REVIEW_202601.qmd`
- [deps] sqlite3, pandas, re, pathlib, csv, glob #import
- [note] Quarto render 시 코드 청크가 순차 실행됨 #context

## 실행 흐름

```python
# 1. 환경 설정
conn = sqlite3.connect(db_path)

# 2. CSV 값 추출
instagram_views_csv = parse_csv_column_sum(...)
facebook_views_csv = parse_csv_column_sum(...)
naver_views_path = find_naver_file(...)
yt_folder = find_youtube_folder(...)

# 3. DB 조회 및 비교
df_summary = pd.read_sql(query_summary, conn)
df_comparison = pd.DataFrame(comparison_data)
```

## Relations

- part_of [[review-qmd]] (소속 모듈)
- calls [[parse-csv-column-sum]] (CSV 컬럼 합계 추출)
- calls [[find-naver-file]] (Naver 파일 탐색)
- calls [[find-youtube-folder]] (YouTube 폴더 탐색)