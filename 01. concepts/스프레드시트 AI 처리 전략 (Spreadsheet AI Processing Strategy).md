---
title: 스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)
type: concept
permalink: knowledge/concepts/spreadsheet-ai-processing-strategy
tags:
- AI
- LLM
- spreadsheet
- 프롬프트전략
- 실용
category: AI 활용
difficulty: 중급
---

# 스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)

스프레드시트를 AI에게 효과적으로 전달하기 위한 실용적 접근법. 환경 규모에 따라 전략을 달리 선택한다.

## 📖 개요

AI(LLM)는 2D 그리드 구조를 직접 이해하지 못하므로, 스프레드시트를 "AI가 읽을 수 있는 형태"로 번역해야 한다. 대형 시트(수백 행 이상)에는 SpreadsheetLLM 같은 압축 프레임워크가 유효하지만, 소규모 환경에서는 캡처(시각) + CSV(데이터) 조합이 가성비와 정확도 모두에서 우월하다.

## ✨ 환경별 전략

### 소규모 엑셀 (개인/팀 환경) → 캡처 + CSV

- **화면 캡처**: 색상, 테두리, 병합셀 등 시각적 구조를 멀티모달 AI에게 직접 전달
- **CSV 변환**: CLI 도구로 데이터를 텍스트화, 작은 파일은 토큰 부담 없이 전체 전달 가능
- **장점**: SpreadsheetLLM이 못하는 시각적 단서까지 커버, 구현 비용 제로

### 대규모 엑셀 (엔터프라이즈) → SpreadsheetLLM 압축

- 수백 행 × 수십 열 이상에서 토큰 한도 초과 시 필수
- 25배 압축으로 96% 비용 절감
- 파일이 클수록 압축 효과 극대화

## 💡 SpreadsheetLLM에서 차용할 프롬프트 전략

규모와 무관하게 활용 가능한 아이디어 3가지:

1. **빈 셀 제거 (역인덱스 방식)**: CSV 전달 시 빈 셀을 제거하고 값이 있는 셀만 "값: [위치목록]" 형태로 정리하면 토큰 절약
2. **타입 힌트 제공**: "A열은 날짜, B열은 금액, C열은 백분율" 같은 메타정보를 프롬프트에 명시하면 AI 이해도 향상
3. **CoS 2단계 추론**: "먼저 관련 영역을 식별하고 → 그 영역에서 답을 찾아라"는 프롬프트 구조가 정확도를 높임

## 🔧 실전 워크플로우

```
1. 화면 캡처 → AI에게 구조 파악 요청
2. CLI로 CSV 변환 (libreoffice --headless 또는 python)
3. 프롬프트에 타입 힌트 + CoS 구조 적용
4. AI에게 캡처 + CSV + 프롬프트 전달
```

## Relations

- derived_from [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (논문에서 실용 전략 도출)
- relates_to [[RAG (Retrieval-Augmented Generation)]] (Excel 기반 RAG 시 전처리 전략으로 활용)
- relates_to [[Chain of Thought (CoT)]] (CoS 2단계 추론의 기반 개념)
- relates_to [[토큰 압축 (Token Compression)]] (빈 셀 제거, 타입 추상화 등 토큰 효율화)