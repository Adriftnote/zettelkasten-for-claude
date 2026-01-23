---
title: KGGen 이해 - 명사 통합과 동사 관계
date: 2026-01-20
tags:
- personal-notes
- knowledge-graph
- understanding
category: 학습 노트
permalink: notes/kggen-ihae-myeongsa-tonghabgwa-dongsa-gwangye-1
---

# KGGen 이해: 명사 통합과 동사 관계로 지식 그래프 만들기

## 🎯 핵심 이해

**KGGen은 명사(엔티티)에만 벡터 임베딩을 써서 유사성을 파악하고, 동사로는 관계를 파악해서 지식 그래프를 만든다.**

## 📋 구조

```
텍스트 → 명사 + 동사 → 지식 그래프

명사 (엔티티)             동사 (관계)
    ↓                        ↓
벡터 임베딩              관계 정규화
    ↓                        ↓
유사도 비교              그래프 엣지
    ↓                        ↓
통합/병합               연결 생성
```

## 🔍 명사 처리: 벡터 임베딩으로 통합

### 1. 명사 추출
```
텍스트:
"Steve Jobs founded Apple in 1976.
S. Jobs was the CEO of Apple Inc."

추출된 명사:
- Steve Jobs
- S. Jobs
- Apple
- Apple Inc.
- 1976
```

### 2. 벡터 임베딩 생성
```python
# 각 명사를 벡터로 변환
"Steve Jobs" → [0.2, 0.8, 0.3, 0.5, ...]  # 수백 차원
"S. Jobs"    → [0.19, 0.81, 0.29, 0.51, ...]
"Apple"      → [0.7, 0.1, 0.6, 0.2, ...]
"Apple Inc." → [0.71, 0.09, 0.61, 0.19, ...]
```

**왜 벡터로?**
- 의미가 비슷한 단어는 벡터도 비슷함
- 숫자로 유사도 계산 가능

### 3. 유사도 계산
```python
# 코사인 유사도 (0~1, 높을수록 유사)
similarity("Steve Jobs", "S. Jobs") = 0.98  # 매우 유사!
similarity("Apple", "Apple Inc.") = 0.95     # 매우 유사!
similarity("Steve Jobs", "Apple") = 0.23     # 다름
```

### 4. 클러스터링
```
유사도 > 0.9 → 같은 그룹으로 묶음

클러스터 1: "Steve Jobs", "S. Jobs"
클러스터 2: "Apple", "Apple Inc."
클러스터 3: "1976"
```

### 5. LLM 검증 + 통합
```
LLM에게 질문:
"Steve Jobs와 S. Jobs는 같은 사람인가요?"
→ "Yes"

LLM에게 질문:
"Apple과 Apple Inc.는 같은 회사인가요?"
→ "Yes"

통합 결과:
- "Steve Jobs" (대표 이름)
- "Apple" (대표 이름)
- "1976"
```

## 🔗 동사 처리: 관계 정규화

### 1. 동사 추출
```
텍스트:
"Steve Jobs founded Apple.
Jobs started Apple Inc.
S. Jobs established Apple."

추출된 동사:
- founded
- started
- established
```

### 2. 관계 정규화
```
의미가 같은 동사 → 하나로 통일

founded    ┐
started    ├→ "founded" (대표 관계)
established┘
```

**왜 벡터 임베딩 안 쓰나?**
- 동사는 종류가 제한적 (founded, CEO_of, born_in 등)
- 규칙 기반으로 충분히 처리 가능
- 명사보다 표현 다양성이 낮음

### 3. 관계 생성
```
(주체) --[동사]--> (객체)

(Steve Jobs) --[founded]--> (Apple)
```

## 🎯 전체 프로세스

### 입력
```
텍스트:
"Steve Jobs founded Apple in 1976.
S. Jobs was the CEO of Apple Inc."
```

### 단계별 처리

**1. 추출**
```
명사: Steve Jobs, S. Jobs, Apple, Apple Inc., 1976
동사: founded, CEO_of
```

**2. 명사 임베딩 + 통합**
```
Steve Jobs ┐
S. Jobs    ┘→ "Steve Jobs"

Apple      ┐
Apple Inc. ┘→ "Apple"
```

**3. 동사 정규화**
```
founded → "founded"
CEO_of → "CEO_of"
```

**4. 트리플 생성**
```
(Steve Jobs) --[founded]--> (Apple)
(Steve Jobs) --[CEO_of]--> (Apple)
(Apple) --[founded_year]--> (1976)
```

### 최종 그래프
```
    Steve Jobs
      /    \
  founded  CEO_of
     |      |
     v      v
    Apple ←─┘
      |
  founded_year
      |
     1976
```

## 📊 기존 방식 vs KGGen

### 기존 방식 (OpenIE)
```
문자열 그대로 사용:
- "Steve Jobs" (노드 1)
- "S. Jobs" (노드 2) ← 별개!
- "Apple" (노드 3)
- "Apple Inc." (노드 4) ← 별개!

결과: 4개 노드, 연결 약함 (희소함)
```

### KGGen
```
벡터 임베딩으로 통합:
- "Steve Jobs" (통합됨)
- "Apple" (통합됨)

결과: 2개 노드, 연결 강함 (밀도 높음)
```

## 💡 왜 명사만 임베딩?

### 명사의 특성
```
다양한 표현:
- Steve Jobs
- S. Jobs
- Steven Paul Jobs
- 잡스
- 스티브 잡스
- Jobs

→ 임베딩으로 유사도 파악 필요
```

### 동사의 특성
```
제한적 표현:
- founded
- created
- established

→ 규칙으로 충분
```

### 비용 고려
```
명사: 수백만 개 (임베딩 필수)
동사: 수천 개 (규칙으로 처리)
```

## 🎯 성능 향상 원리

### 중복 제거 효과
```
Before: 100개 문장 → 300개 노드 (중복 많음)
After:  100개 문장 → 150개 노드 (50% 감소)
```

### 연결 증가 효과
```
통합 전:
  Steve Jobs --[founded]--> Apple
  S. Jobs --[CEO_of]--> Apple Inc.
  (연결 없음)

통합 후:
  Steve Jobs --[founded]--> Apple
      |
      +--[CEO_of]--> Apple
  (같은 노드에서 2개 관계!)
```

### 정보 밀도 향상
```
노드 수: 50% 감소
연결 수: 100% 증가
→ 정보 밀도: 4배 향상!
```

## 🔗 관련 문서

- [[KGGen - Knowledge Graph Generation Framework]] - 원문 요약
- [[Knowledge Graph (지식 그래프)]] - 지식 그래프 개념
- [[Entity Resolution (엔티티 해결)]] - 명사 통합 기법
- [[Triple (트리플)]] - 주체-동사-객체 구조

## 📚 핵심 요약

1. **명사**: 벡터 임베딩 → 유사도 계산 → 통합
2. **동사**: 규칙 기반 → 정규화 → 관계 생성
3. **결과**: 중복 제거 + 연결 강화 = 고품질 그래프

---

**작성일**: 2026년 1월 20일
**카테고리**: 학습 노트