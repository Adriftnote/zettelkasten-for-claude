---
title: SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)
type: paper-review
permalink: sources/reference/spreadsheetllm-encoding
tags:
- AI
- LLM
- spreadsheet
- RAG
- compression
- Microsoft-Research
date: 2026-02-10
---

# SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩

Microsoft Research에서 제안한 프레임워크로, 스프레드시트를 LLM이 이해할 수 있도록 효율적으로 인코딩하는 방법. 25배 압축으로 96% 비용 절감하면서 SOTA 성능 달성.

## 📖 핵심 아이디어

스프레드시트는 2D 그리드 + 유연한 레이아웃 + 다양한 포맷으로 인해 LLM이 처리하기 어렵다. 단순히 텍스트로 변환하면 구조가 손실되고, 그대로 넘기면 토큰 한도를 초과한다. SpreadsheetLLM은 **SheetCompressor**라는 3단계 압축 프레임워크로 이 문제를 해결한다. 핵심은 "구조적으로 중요한 정보만 남기고 나머지를 똑똑하게 버리는 것".

## 🛠️ 구성 요소 (SheetCompressor 3단계)

| 모듈 | 이름 | 방법 | 압축률 | 특징 |
|------|------|------|--------|------|
| Module 1 | Structural-anchor-based Compression | 테이블 경계의 이질적 행/열(앵커)만 보존, 동질적 데이터 영역 제거 | 4.41x | 75% 데이터 제거, 경계 97% 보존 |
| Module 2 | Inverted-index Translation | 빈 셀 제거 + 동일 값 셀 주소 병합 → 딕셔너리 형태 | 14.91x | **무손실** 압축 |
| Module 3 | Data-format-aware Aggregation | 숫자 셀을 NFS(Number Format String)로 타입 분류 후 클러스터링 | 24.79x | 10가지 데이터 타입 인식 |

### 추가 구성: Chain of Spreadsheet (CoS)

Chain of Thought에서 영감받은 2단계 추론:
1. **Stage 1**: 압축된 시트 + 쿼리 → 관련 테이블 식별
2. **Stage 2**: 식별된 테이블 + 쿼리 → 정확한 응답 생성

## 🔧 작동 방식

```
[원본 스프레드시트]
  576행 x 23열, 61,240 토큰
         │
         ▼
  ┌─── SheetCompressor ───┐
  │                        │
  │  1. 구조 앵커 추출     │  → 경계 근처 행/열만 남김
  │     (4.41x 압축)       │
  │         │              │
  │  2. 역인덱스 변환      │  → 빈셀 제거, 같은 값 병합
  │     (14.91x 압축)      │     무손실!
  │         │              │
  │  3. 포맷 인식 집계     │  → 숫자→타입으로 추상화
  │     (24.79x 압축)      │
  │                        │
  └────────────────────────┘
         │
         ▼
  [압축된 인코딩]
  708 토큰 (25배 압축, 96% 절감)
         │
         ▼
  ┌─── Chain of Spreadsheet ───┐
  │  Stage 1: 테이블 식별      │
  │  Stage 2: 응답 생성        │
  └────────────────────────────┘
         │
         ▼
  [최종 답변]
```

## 📊 실험 결과

### Task 1: Spreadsheet Table Detection

| 모델 | F1 Score | 비고 |
|------|----------|------|
| TableSense-CNN (기존 SOTA) | 66.6% | 기존 최고 |
| GPT-4 vanilla | 51.9% | 압축 없이 |
| **GPT-4 + SheetCompressor** | **78.9%** | +12.3% vs 기존 SOTA |

- Huge 스프레드시트에서 GPT-4 대비 75% 향상
- 스프레드시트가 클수록 압축 효과가 더 큼

### Task 2: Spreadsheet QA

| 모델 | Accuracy |
|------|----------|
| TAPEx | 37.8% |
| Binder | 62.2% |
| **GPT-4 + Compress + FT + CoS** | **74.3%** |

### 파인튜닝 모델

- Deepspeed + LoRA로 오픈소스 모델 파인튜닝
- 테스트 모델: Llama2, Llama3, Phi3, Mistral-v2

## 💡 실용적 평가

### 강점
- **극적인 비용 절감**: 96% 토큰 감소 → API 비용 대폭 절감
- **대형 스프레드시트에서 특히 강력**: 클수록 압축 이점이 큼
- **Module 2는 무손실**: 정보 손실 없이 14.91배 압축
- **모듈형 설계**: 필요에 따라 모듈 선택 적용 가능 (Module 3 제외하면 정확도 약간 상승)

### 한계
- **시각적 포맷 미지원**: 배경색, 테두리 등 시각적 단서 활용 불가 (토큰 과다)
- **의미 기반 압축 부재**: "China, America, France" → "Country"로 통합하는 의미 압축 미구현
- **별도 패키지 없음**: pip install로 바로 쓸 수 있는 라이브러리가 아님, 논문 기반 직접 구현 필요

### 적용 방안
- Excel 데이터 기반 RAG 시스템 구축 시 인코딩 전략으로 참고
- 대량 스프레드시트 분석 파이프라인에서 전처리 단계로 활용
- Module 1+2만 적용해도 무손실 14.91배 압축 가능 → 정확도 우선 시 추천

## 📋 논문 메타데이터

| 항목 | 내용 |
|------|------|
| 제목 | SPREADSHEETLLM: Encoding Spreadsheets for Large Language Models |
| 저자 | Yuzhang Tian, Jianbo Zhao, Haoyu Dong 외 8명 |
| 소속 | Microsoft Corporation |
| arXiv | 2407.09025v1 |
| 페이지 | 20 |

## 🔗 관련 개념

- [[RAG (Retrieval-Augmented Generation)]] - 문서 기반 AI 질의 프레임워크
- [[Chain of Thought (CoT)]] - CoS의 영감이 된 단계적 추론 방법론
- [[토큰 압축 (Token Compression)]] - LLM 입력 효율화 기법
- [[Quivr]] - RAG 프레임워크, Excel 처리 시 이 인코딩 전략과 결합 가능

---

**작성일**: 2026-02-10
**분류**: AI / LLM / 스프레드시트 처리
**원본**: https://arxiv.org/html/2407.09025v1