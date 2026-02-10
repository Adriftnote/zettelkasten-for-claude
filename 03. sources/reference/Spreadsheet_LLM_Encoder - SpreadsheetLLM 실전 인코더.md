---
title: Spreadsheet_LLM_Encoder - SpreadsheetLLM 실전 인코더
type: doc-summary
permalink: sources/reference/spreadsheet-llm-encoder
date: 2026-02-10
tags:
- python
- spreadsheet
- LLM
- encoder
- openpyxl
- github
- CLI
---

# Spreadsheet_LLM_Encoder - SpreadsheetLLM 실전 인코더

실제 .xlsx 파일을 SpreadsheetLLM 형식 JSON으로 변환하는 프로덕션급 인코더. CLI + Streamlit + CoS 파이프라인 포함.

## 📖 핵심 아이디어

openpyxl로 실제 Excel 파일을 직접 읽어서 논문의 3개 모듈(Structural Anchors → Inverted Index → Format Aggregation)을 순차 적용한 뒤 압축된 JSON을 출력. 병합 셀, 다중 문자 열(AA, AB...), NFS(Number Format String) 기반 타입 판별 등 실제 Excel의 복잡성을 반영. Chain of Spreadsheet(CoS) 2단계 추론 파이프라인도 포함.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **레포** | https://github.com/kingkillery/Spreadsheet_LLM_Encoder |
| **License** | MIT |
| **Language** | Python |
| **의존성** | openpyxl, pandas, streamlit |
| **입력** | .xlsx 파일 (openpyxl 직접 로드) |
| **출력** | JSON (structural_anchors + cells + formats + numeric_ranges) |

### 파일 구조

| 파일 | 역할 |
|------|------|
| `Spreadsheet_LLM_Encoder.py` | 메인 인코더 (CLI 진입점 포함) |
| `temp_helpers.py` | NFS 기반 타입 판별 헬퍼 |
| `chain_of_spreadsheet.py` | CoS 2단계 추론 파이프라인 |
| `streamlit_app.py` | 웹 UI |
| `evaluation.py` | 평가 프레임워크 |
| `test_*.py` | 테스트 5개 |

## 🔧 작동 방식

```
.xlsx 파일
    ↓ openpyxl.load_workbook()
    ↓ 시트별 처리:
    ├─ Module 1: find_structural_anchors()
    │    └ boundary candidates + IoU + NMS → 앵커 행/열
    ├─ Module 2: create_inverted_index() + create_inverted_index_translation()
    │    └ 병합 셀 처리 + 2D 직사각형 범위 병합
    └─ Module 3: aggregate_formats() + cluster_numeric_ranges()
         └ NFS + semantic type → 영역 집계
    ↓
JSON 출력 (압축률 메트릭 포함)
```

### 사용법

```bash
# CLI
python Spreadsheet_LLM_Encoder.py 파일.xlsx -o result.json --k 2

# Vanilla 인코딩 (압축 없이 행 단위)
python Spreadsheet_LLM_Encoder.py 파일.xlsx --vanilla -o baseline.txt

# Streamlit 앱
streamlit run streamlit_app.py
```

### 학습용 데모와의 차이

| | 학습 데모 (compression) | 이 인코더 |
|---|---|---|
| 입력 | pandas DataFrame | .xlsx (openpyxl) |
| 앵커 탐지 | 행 유사도 비교 | boundary + IoU + NMS |
| 범위 병합 | 1D (열 내 연속) | 2D (직사각형) |
| 타입 판별 | 정규식 (값 문자열) | NFS 메타데이터 |
| 병합 셀 | 미지원 | 지원 |
| CoS | 없음 | 포함 |

## ⚠️ 알려진 이슈

- `aggregate_regions_dfs()` 함수가 호출되지만 정의가 없음 — 실제로는 `aggregate_formats()`가 존재. 실행 시 NameError 발생 가능
- `_call_llm()`은 placeholder — 실제 LLM API 연동 필요
- Stage 2 비압축 재인코딩 미구현

## 💡 실용적 평가

**장점:**
- CLI로 바로 Excel → JSON 변환 가능
- 압축률 메트릭을 단계별로 리포팅
- CoS 파이프라인 구조가 잘 설계됨

**한계:**
- `aggregate_regions_dfs` 버그로 그대로 실행 불가 (수정 필요)
- LLM 연동 부분은 placeholder
- 테스트 커버리지 확인 필요

## 🔗 관련 개념

- [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] - 원본 논문 리뷰
- [[SpreadsheetLLM 구현 로직]] - RPG 프로젝트 노트
- [[SpreadsheetLLM-compression - SheetCompressor 학습용 데모]] - 학습용 데모 레포
- [[Chain of Spreadsheet (CoS)]] - CoS 개념
- [[스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)]] - 실무 적용 전략

---

**작성일**: 2026-02-10
**분류**: AI / 스프레드시트 처리