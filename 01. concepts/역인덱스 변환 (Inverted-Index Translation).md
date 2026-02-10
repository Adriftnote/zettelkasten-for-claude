---
title: 역인덱스 변환 (Inverted-Index Translation)
type: concept
permalink: knowledge/concepts/inverted-index-translation
tags:
- AI
- LLM
- spreadsheet
- compression
- 무손실압축
category: AI 기법
difficulty: 중급
---

# 역인덱스 변환 (Inverted-Index Translation)

스프레드시트의 빈 셀을 제거하고 동일 값 셀을 병합하여 토큰을 줄이는 무손실 압축 기법

## 📖 개요

기존 방식은 스프레드시트를 행 단위로 직렬화한다. A1, A2, A3... 순서대로 모든 셀을 나열하는 것이다. 문제는 실제 스프레드시트의 대부분이 빈 셀이고, 같은 값이 반복된다는 점이다. 역인덱스 변환은 이 관점을 뒤집어서 "셀 → 값" 대신 "값 → 셀 주소 목록"으로 인코딩한다. 검색 엔진의 역인덱스(단어 → 문서 목록)와 같은 원리다.

## 🎭 비유

도서관에서 책을 찾는 두 가지 방법:
- **기존 방식**: 1번 서가부터 끝까지 한 칸씩 돌면서 "여긴 비어있고, 여기도 비어있고, 여기 책 있고..." → 빈 칸도 다 보고함
- **역인덱스**: "파이썬 책은 3번·7번·12번 서가에 있음" 식의 색인 카드 → 빈 서가는 아예 언급 안 함

## ✨ 작동 원리

### Step 1: 빈 셀 완전 제거

```
원본 (행 단위 직렬화):
A1: ""  B1: ""  C1: "이름"  D1: ""  E1: ""
A2: ""  B2: ""  C2: "김철수" D2: ""  E2: ""
→ 10개 셀 인코딩 (빈 셀 8개 포함)

역인덱스:
"이름": C1
"김철수": C2
→ 2개만 인코딩 (빈 셀 0개)
```

빈 셀은 딕셔너리에 아예 등장하지 않으므로 토큰이 0이다.

### Step 2: 동일 값 셀 주소 병합

같은 값이 여러 셀에 있으면 한 번만 쓰고 주소를 묶는다:

```
원본:
A2: "Q1"  A3: "Q1"  A4: "Q1"  (3번 인코딩)
C2: "$100K"  C4: "$100K"  C6: "$100K"  (3번 인코딩)

역인덱스:
"Q1": A2:A4          ← 연속 셀은 범위로 병합
"$100K": C2, C4, C6  ← 비연속 셀은 쉼표로 나열
```

### Step 3: 연속 주소 → 범위 표기

A2, A3, A4처럼 연속된 셀은 `A2:A4`로 축약한다. 비연속이면 `C2, C4, C6`으로 개별 나열.

## 💡 코드 예시

```python
from collections import defaultdict

def invert_index(df):
    index = defaultdict(list)
    
    for row in range(df.shape[0]):
        for col in range(df.shape[1]):
            val = df.iat[row, col]
            if pd.notna(val) and str(val).strip() != '':  # 빈 셀 스킵
                addr = f"{df.columns[col]}{row + 1}"
                index[str(val)].append(addr)
    
    # 연속 주소를 범위로 병합
    return {val: merge_ranges(addrs) for val, addrs in index.items()}
```

핵심은 `if pd.notna(val) and str(val).strip() != ''` — 이 한 줄이 빈 셀을 전부 걸러낸다.

## 📊 압축 효과

| 지표 | 수치 |
|------|------|
| 압축률 | 14.91배 |
| 정보 손실 | 없음 (무손실) |
| 원리 | 빈 셀 제거 + 중복 값 병합 + 범위 축약 |

SpreadsheetLLM 3단계 중 유일한 무손실 모듈이며, 단독으로도 가장 실용적이다.

## Relations

- part_of [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (SheetCompressor Module 2)
- similar_to [[역인덱스 (Inverted Index)]] (검색 엔진의 역인덱스와 동일 원리 — 단어→문서를 값→셀주소로 적용)
- enables [[스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy)]] (소규모 환경에서도 빈셀 제거 아이디어 차용 가능)
- relates_to [[토큰 압축 (Token Compression)]] (LLM 입력 효율화 기법 중 하나)