---
title: SpreadsheetLLM 구현 로직
type: project
permalink: projects/spreadsheetllm-impl
level: high
category: ai/spreadsheet
path: 99. resources/
tags:
- python
- AI
- LLM
- spreadsheet
- compression
---

# SpreadsheetLLM 구현 로직

Microsoft Research의 SpreadsheetLLM 논문(arXiv:2407.09025)을 커뮤니티가 구현한 코드 모음. SheetCompressor 3단계 압축 + CoS 추론 파이프라인.

## 개요

스프레드시트를 LLM이 이해할 수 있도록 인코딩하는 프레임워크의 구현체. 공식 코드가 없어 커뮤니티 레포 2개를 참조하며, 각각 학습용(모듈별 데모)과 실전용(CLI + API)으로 역할이 다르다.

## 코드 구성

**모듈 (SheetCompressor 3단계)**
- structural-anchors-demo: Module 1 — 테이블 경계 행/열만 보존하는 구조 앵커 추출
- inverted-index-demo: Module 2 — 빈 셀 제거 + 동일 값 병합 역인덱스 변환 (무손실)
- data-format-aggregation-demo: Module 3 — 정규식 기반 9가지 데이터 타입 인식 + 그룹화

**모듈 (CoS 추론)**
- chain-of-spreadsheet: "테이블 찾기 → 답 구하기" 2단계 추론 파이프라인

**함수 (역인덱스)**
- create-cell-address: 행/열 인덱스 → 엑셀 주소 변환
- merge-cell-ranges: 연속 셀 주소를 범위로 병합
- invert-index-with-ranges: 역인덱스 변환 메인 함수

**함수 (타입 인식)**
- create-rule-based-recognizer: 정규식 기반 타입 판별 함수 팩토리
- aggregate-by-data-format: 타입별 셀 그룹화 메인 함수

**함수 (CoS)**
- identify-table: Stage 1 — 질문에 관련된 테이블 범위 식별
- generate-response: Stage 2 — 식별된 테이블에서 답변 생성
- table-split-qa: 대형 테이블 분할 QA

## 소스 레포

| 레포 | 용도 | 경로 |
|------|------|------|
| DUrayev/SpreadsheetLLM-compression | 모듈별 데모 (학습용) | 99. resources/SpreadsheetLLM-compression/ |
| kingkillery/Spreadsheet_LLM_Encoder | CLI + Python API (실전용) | 99. resources/Spreadsheet_LLM_Encoder/ |

## Relations

- contains [[inverted-index-demo]] (Module 2: 역인덱스 변환 데모)
- contains [[data-format-aggregation-demo]] (Module 3: 타입 인식 데모)
- contains [[chain-of-spreadsheet]] (CoS 2단계 추론 파이프라인)
- relates_to [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (구현 대상 논문)
- relates_to [[스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)]] (실용적 활용 전략)