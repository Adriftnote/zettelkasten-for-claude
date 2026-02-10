---
title: NFS 타입 인식 (Number Format String Recognition)
type: concept
permalink: knowledge/concepts/nfs-type-recognition
tags:
- AI
- LLM
- spreadsheet
- 데이터타입
- 정규식
category: AI 기법
difficulty: 중급
---

# NFS 타입 인식 (Number Format String Recognition)

스프레드시트의 숫자 셀을 실제 값 대신 데이터 타입으로 추상화하여 AI가 "이 열이 뭘 담는지"를 이해하게 하는 기법

## 📖 개요

AI에게 스프레드시트를 이해시킬 때, 개별 숫자값은 구조 파악에 불필요한 경우가 많다. "$1,234.56"이라는 값에서 AI가 알아야 할 건 "이 셀은 통화다"라는 타입 정보이지, 1234.56이라는 구체적 수치가 아니다. NFS 타입 인식은 정규식 기반 규칙으로 셀 값의 데이터 타입을 판별하고, 같은 타입의 셀들을 하나의 그룹으로 묶어 토큰을 줄인다.

## 🎭 비유

서류 캐비닛을 정리하는 상황:
- **기존 방식**: 모든 서류의 내용을 전부 읽어서 전달 → "이 서류에는 2026-02-10이라 쓰여있고, 저 서류에는 2026-01-15라 쓰여있고..."
- **타입 인식**: 서류를 분류 탭으로 정리 → "이 칸은 [날짜]들, 저 칸은 [금액]들, 그 옆은 [백분율]들" → AI는 캐비닛의 구조를 바로 파악

## ✨ 인식하는 9가지 타입

| 타입 | 패턴 예시 | 정규식 핵심 |
|------|----------|------------|
| Year | 2024, 2026 | `^(19\|20\|21)\d{2}$` |
| Integer | 42, 1000 | `^-?\d+$` |
| Float | 3.14, 2.718 | `^-?\d+\.\d+$` |
| Percentage | 75%, 12.5% | `^-?\d+\.?\d*%$` |
| Currency | $1,234.56, £9,876 | `^[\$£€¥₹]\s*-?\d{1,3}(,\d{3})*` |
| Date | 2024-01-15, 01/15/2024 | 다중 패턴 매칭 |
| Time | 14:30, 2:30 PM | `^\d{1,2}:\d{2}(:\d{2})?` |
| Scientific | 6.022e23 | `^-?\d+\.?\d*[eE][+-]?\d+$` |
| Email | user@example.com | 이메일 패턴 |

나머지는 Others(텍스트)로 분류되어 개별 값이 보존된다.

## 💡 작동 방식

```
원본 시트:
  A열: [$1,200  $3,400  $2,100  $5,600  $980  $4,300]
  B열: [2024-01-15  2024-02-20  2024-03-10  ...]
  C열: [85.2%  72.1%  91.5%  ...]

타입 인식 후:
  A열 전체 → [Currency]: A1:A6
  B열 전체 → [Date]: B1:B6  
  C열 전체 → [Percentage]: C1:C6

→ 18개 셀값 → 3개 타입 그룹 (6배 압축)
```

핵심: AI는 "A열은 금액, B열은 날짜, C열은 비율"이란 것만 알면 시트 구조를 이해할 수 있다.

## 💡 코드 핵심 로직

```python
def recognize_data_type(value):
    value_str = str(value).strip()
    
    # 정규식으로 순차 매칭 (구체적 → 일반적 순서가 중요)
    if re.match(r'^(19|20|21)\d{2}$', value_str):      return 'Year'
    if re.match(r'^[\$£€¥₹].*\d', value_str):          return 'Currency'
    if re.match(r'^-?\d+\.?\d*%$', value_str):          return 'Percentage'
    if re.match(r'^\d{4}[-/]\d{1,2}[-/]\d{1,2}$', ...): return 'Date'
    if re.match(r'^-?\d+\.\d+$', value_str):            return 'Float'
    if re.match(r'^-?\d+$', value_str):                 return 'Integer'
    return 'Others'  # 텍스트는 개별 보존
```

매칭 순서가 중요하다 — "2024"는 Integer보다 Year가 먼저 매칭되어야 한다.

## 📊 압축 효과

| 지표 | 수치 |
|------|------|
| 단독 압축률 | 약 5.1배 |
| 누적 압축률 (Module 1+2+3) | 24.79배 |
| 정보 손실 | 있음 (숫자 구체값 손실, 타입만 보존) |
| 트레이드오프 | Module 3 제외 시 정확도가 약간 상승하기도 함 |

논문에서도 Module 1+2만 쓰면 무손실 14.91배, Module 3 추가하면 유손실 24.79배로, 정확도 vs 압축률 트레이드오프가 존재한다.

## ⚡ 프롬프트에서 활용하기

직접 구현하지 않더라도, AI에게 엑셀을 넘길 때 타입 힌트를 프롬프트에 명시하면 같은 효과를 낼 수 있다:

```
"A열은 날짜(YYYY-MM-DD), B열은 금액(원화), C열은 달성률(%)입니다.
이 데이터에서 월별 매출 추이를 분석해주세요."
```

## Relations

- part_of [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (SheetCompressor Module 3)
- depends_on [[역인덱스 변환 (Inverted-Index Translation)]] (Module 2 이후에 적용, 이미 역인덱스화된 데이터에 타입 분류 적용)
- enables [[스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)]] (타입 힌트 프롬프트 전략의 원형)
- relates_to [[정규표현식 (Regular Expression)]] (9가지 타입 판별이 모두 정규식 기반)