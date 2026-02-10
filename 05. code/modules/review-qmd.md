---
title: review-qmd
type: module
level: high
category: validation/sns/report
semantic: validate sns integrity
permalink: modules/review-qmd
path: outputs/26.1Q/[전략기획팀] SNS 정합성 검증/202601/REVIEW_202601.qmd
tags:
- python
- quarto
- validation
- report
---

# review-qmd

SNS 정합성 검증 Quarto 리포트 모듈

## 📖 개요

월별 SNS 데이터 정합성을 검증하고 이슈를 추적하는 실행 가능한 문서.
CSV 원본과 DB 저장값을 비교하여 데이터 파이프라인의 정확성을 확인.

## Observations

- [impl] Quarto 마크다운으로 코드와 문서를 통합 #format
- [impl] 6단계 검증: 산출물 확인 → CSV vs Summary → DB 검증 → 이슈 → 조치 → 판정 #algo
- [deps] pandas, sqlite3, pathlib, re, glob #import
- [usage] `quarto render REVIEW_202601.qmd` 실행 시 HTML 리포트 생성
- [note] 매월 파라미터(YEAR, MONTH, LAST_DAY)만 수정하여 재사용 #context

## 검증 단계

| 단계 | 내용 | 핵심 로직 |
|------|------|----------|
| 0 | 환경 설정 | 파라미터, DB 연결, 공통 함수 |
| 1 | 산출물 확인 | 파일 존재 여부 |
| 2 | CSV vs Summary | 플랫폼별 정합성 비교 (핵심) |
| 3 | DB 테이블 검증 | Atomic vs Summary, 이상치 탐지 |
| 4 | 이슈 리스트 | 자동 이슈 추출 |
| 5 | 조치 및 검증 | Before/After 비교 |
| 6 | 최종 판정 | PASS / CONDITIONAL PASS / FAIL |

## 주요 로직

### CSV vs Summary 비교
```python
# 플랫폼별 CSV 합계와 DB 합계 비교
차이율 = abs(CSV - DB) / CSV * 100
상태 = "✅" if 차이율 < 1 else "⚠️"
```

### IQR 이상치 탐지
```python
# 전월 데이터로 IQR 계산
상한 = Q3 + 2 * IQR
이상치 = 값 > 상한 AND 값 >= 임계값
```

### Late Attribution 처리
```python
# Instagram: DB > CSV (음수 차이)는 정상
if platform == 'instagram' and diff < 0:
    status = "✅"  # Late Attribution
```

## Relations

- part_of [[SNS 정합성 검증]] (소속 프로젝트)
- calls [[parse-csv-column-sum]] (CSV 파싱)
- calls [[find-naver-file]] (네이버 파일 탐색)
- calls [[find-youtube-folder]] (유튜브 폴더 탐색)