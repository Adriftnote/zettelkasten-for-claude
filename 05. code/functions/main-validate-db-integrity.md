---
title: main-validate-db-integrity
type: function
level: low
category: "validation/db/entrypoint"
semantic: "run db integrity validation"
permalink: functions/main-validate-db-integrity
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- entrypoint
---

# main-validate-db-integrity

validate-db-integrity 모듈의 진입점 함수

## 📖 시그니처

```python
def main():
```

## Observations

- [impl] TABLES 리스트를 순회하며 4개 검증 함수를 순차 실행 #algo
- [return] None (결과는 stdout 출력)
- [usage] `python validate_db_integrity.py`
- [deps] sqlite3 #import
- [note] 모듈 진입점, sqlite3 연결 생성 후 cursor를 각 함수에 전달 #context

## 실행 흐름

```python
for table in TABLES:
    check_duplicates(cursor, name, table["keys"])
    check_date_gaps(cursor, name, table["date_col"], table["channel_col"])
    check_null_values(cursor, name)
    get_data_distribution(cursor, name, table["channel_col"])
```

## Relations

- part_of [[validate-db-integrity]] (소속 모듈)
- calls [[check-duplicates]] (키 중복 검사 호출)
- calls [[check-date-gaps]] (날짜 연속성 검사 호출)
- calls [[check-null-values]] (NULL 값 검사 호출)
- calls [[get-data-distribution]] (데이터 분포 조회 호출)