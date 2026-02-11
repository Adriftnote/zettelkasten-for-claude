---
title: SpreadsheetLLM-compression - SheetCompressor 학습용 데모
type: doc-summary
permalink: sources/reference/spreadsheetllm-compression-demo
date: 2026-02-10
tags:
- python
- spreadsheet
- compression
- LLM
- demo
- github
---

# SpreadsheetLLM-compression - SheetCompressor 학습용 데모

SpreadsheetLLM 논문의 SheetCompressor 3개 모듈을 pandas DataFrame으로 구현한 학습용 데모 레포.

## 📖 핵심 아이디어

Microsoft Research의 SpreadsheetLLM 논문(arXiv:2407.09025)에서 소개한 3가지 압축 기법을 독립 실행 가능한 Python 스크립트로 구현. 각 파일이 하나의 기법을 시연하며, 샘플 데이터를 생성하고 압축 결과를 print로 출력하는 교육 목적의 코드.

## 🛠️ 구성 요소

| 항목           | 설명                                                    |
| ------------ | ----------------------------------------------------- |
| **레포**       | https://github.com/DUrayev/SpreadsheetLLM-compression |
| **License**  | MIT                                                   |
| **Language** | Python                                                |
| **의존성**      | pandas, itertools, re, collections                    |
| **입력**       | pandas DataFrame (하드코딩된 샘플)                           |

### 파일 구조

| 파일                                | 구현 내용                | 논문 모듈    |
| --------------------------------- | -------------------- | -------- |
| `structural_anchors_demo.py`      | 인접 행/열 유사도 비교로 앵커 탐지 | Module 1 |
| `inverted_index_demo.py`          | 값→주소 역인덱스 + 범위 병합    | Module 2 |
| `data_format_aggregation_demo.py` | 정규식 기반 9가지 타입 판별     | Module 3 |
| `*.ipynb`                         | 3가지 기법 통합 노트북        | 전체       |
|                                   |                      |          |

## 🔧 특징과 한계

**특징:**
- 각 파일이 독립 실행 가능 (demo 섹션 포함)
- 알고리즘 핵심만 간결하게 구현
- 입문자가 논문 개념을 코드로 이해하기 좋음

**한계:**
- pandas DataFrame만 지원 (실제 .xlsx 파일 불가)
- 단일 문자 열(A~Z)만 처리
- 셀 서식/병합 셀/NFS 미지원
- 1D 범위 병합만 (같은 열 연속 행)

## 💡 실용적 평가

논문의 핵심 알고리즘을 빠르게 파악하는 데 유용. 실제 Excel 파일 처리에는 [[Spreadsheet_LLM_Encoder - SpreadsheetLLM 실전 인코더]] 사용 필요.

## 🔗 관련 개념

- [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] - 원본 논문 리뷰
- [[SpreadsheetLLM 구현 로직]] - RPG 프로젝트 노트
- [[Spreadsheet_LLM_Encoder - SpreadsheetLLM 실전 인코더]] - 실사용 가능한 인코더 레포
- [[역인덱스 변환 (Inverted-Index Translation)]] - Module 2 개념
- [[NFS 타입 인식 (Number Format String Recognition)]] - Module 3 개념

---

**작성일**: 2026-02-10
**분류**: AI / 스프레드시트 처리