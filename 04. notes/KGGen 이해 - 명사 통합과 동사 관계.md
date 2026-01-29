---
title: KGGen 이해 - 명사 통합과 동사 관계
type: note
date: 2026-01-20
tags:
  - derived
  - knowledge-graph
  - understanding
  - entity-resolution
category: 학습 노트
permalink: notes/kggen-ihae-myeongsa-tonghabgwa-dongsa-gwangye-1
source_facts:
  - KGGen 프레임워크의 명사 처리 방식 (벡터 임베딩)
  - 동사 처리 방식 (규칙 기반 정규화)
  - Entity Resolution 개념 (유사도 기반 통합)
  - 기존 OpenIE와의 차이점
---

# KGGen 이해: 명사 통합과 동사 관계로 지식 그래프 만들기

**KGGen은 명사(엔티티)에 벡터 임베딩을 적용해 유사성을 파악하고, 동사에는 규칙 기반 정규화를 적용해 관계를 정의함으로써 고품질의 지식 그래프를 생성한다.**

---

## 도출 근거

### Facts
1. 텍스트의 명사는 다양한 표현 형태(Steve Jobs, S. Jobs, 잡스, 스티브 잡스 등)로 나타남
2. 의미가 비슷한 단어의 벡터는 공간상 가까운 위치에 분포함
3. 동사는 제한적인 표현(founded, created, established)만 존재함
4. 기존 OpenIE는 문자열 그대로 사용해 중복된 노드를 생성함

### 따라서:
→ 명사는 벡터 임베딩(코사인 유사도)으로 동일 엔티티를 자동 감지하고 통합할 수 있다.
→ 동사는 벡터 임베딩 대신 규칙 기반 정규화로 충분하며, 비용도 낮다.
→ 이 조합으로 중복 제거(50% 감소) + 연결 강화(100% 증가)를 동시에 달성할 수 있다.

---

## 핵심 구조

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

---

## Observations

### Facts
- [fact] 명사 벡터는 수백 차원의 숫자 배열로 표현되며, 의미 유사도를 수치화 가능 #embedding
- [fact] 코사인 유사도(0~1)는 명사 간 유사도 판단의 수학적 기준 (0.9 이상 → 통합 후보) #similarity
- [fact] 동사는 종류가 제한적(founded, CEO_of, born_in 등)이라 규칙 기반 처리만으로 충분 #verb-normalization
- [fact] 기존 OpenIE는 동일 인물/기관을 4개 이상 노드로 분산시켜 그래프 희소성 높음 #openIE-limitation

### Methods
- [method] 벡터 임베딩: 각 명사를 다차원 벡터로 변환하여 의미 거리 계산 #entity-embedding
- [method] 클러스터링: 유사도 임계값(0.9)으로 동일 엔티티 후보군 자동 도출 #clustering
- [method] LLM 검증: 클러스터링 후 LLM에 재질문하여 의미적 일치성 확인 #validation

### Decisions
- [decision] 명사만 벡터 임베딩 사용 → 동사는 규칙 기반 (비용 효율성) #design-choice
- [decision] 통합 기준을 0.9 유사도로 설정 (False Positive 방지) #threshold-tuning
- [decision] LLM 검증 단계 추가 (순수 수학적 유사도만으로는 문맥 오류 가능) #quality-assurance

### Examples
- [example] "Steve Jobs" + "S. Jobs" → 유사도 0.98 → LLM 확인 → 같은 인물 통합 #person-deduplication
- [example] "Apple" + "Apple Inc." → 유사도 0.95 → LLM 확인 → 같은 회사 통합 #company-deduplication
- [example] "founded" + "started" + "established" → 모두 "founded" 관계로 정규화 #verb-normalization-example

### References
- [[KGGen - Knowledge Graph Generation Framework]] - 원문 구현 상세
- [[Entity Resolution (엔티티 해결)]] - 명사 통합 이론
- [[Knowledge Graph (지식 그래프)]] - KG 개념 및 용도
- [[Triple (트리플)]] - (주체, 동사, 객체) 구조 정의
- OpenIE 논문 - 기존 접근 방식

### Questions
- [question] 동사도 일부 다형성이 있는데(CEO_of vs manage) 규칙만으로 충분한가? #future-work
- [question] 벡터 임베딩 모델이 언어별로 다르면 다언어 그래프는 어떻게 구성? #multilingual
- [question] 실시간 스트리밍 텍스트에서 벡터 재계산 비용은? #scalability

---

## 상세 설명

### 명사 처리 파이프라인

#### Step 1: 명사 추출
```
텍스트:
"Steve Jobs founded Apple in 1976.
S. Jobs was the CEO of Apple Inc."

추출 결과:
- Steve Jobs
- S. Jobs
- Apple
- Apple Inc.
- 1976
```

#### Step 2: 벡터 임베딩 생성
```python
"Steve Jobs" → [0.2, 0.8, 0.3, 0.5, ...]  # 수백 차원
"S. Jobs"    → [0.19, 0.81, 0.29, 0.51, ...]
"Apple"      → [0.7, 0.1, 0.6, 0.2, ...]
"Apple Inc." → [0.71, 0.09, 0.61, 0.19, ...]

# 의미 유사 단어 = 벡터도 유사
```

#### Step 3: 유사도 계산 (코사인 유사도)
```
similarity("Steve Jobs", "S. Jobs")    = 0.98  ✓ 매우 유사
similarity("Apple", "Apple Inc.")      = 0.95  ✓ 매우 유사
similarity("Steve Jobs", "Apple")      = 0.23  ✗ 다름
```

#### Step 4: 클러스터링
```
임계값 > 0.9 → 동일 클러스터로 묶음

클러스터 1: ["Steve Jobs", "S. Jobs"]
클러스터 2: ["Apple", "Apple Inc."]
클러스터 3: ["1976"]
```

#### Step 5: LLM 검증 + 최종 통합
```
LLM 질문: "Steve Jobs와 S. Jobs는 같은 사람인가?"
답변: "Yes" → 통합

LLM 질문: "Apple과 Apple Inc.는 같은 회사인가?"
답변: "Yes" → 통합

최종 엔티티:
- "Steve Jobs" (대표명)
- "Apple" (대표명)
- "1976"
```

---

### 동사 처리 파이프라인

#### Step 1: 동사 추출
```
텍스트:
"Steve Jobs founded Apple.
Jobs started Apple Inc.
S. Jobs established Apple."

추출 결과:
- founded
- started
- established
```

#### Step 2: 관계 정규화
```
founded     ┐
started     ├→ "founded" (표준 관계명)
established┘

→ 규칙: founded/created/started/established = "founded"
```

**왜 벡터 임베딩을 쓰지 않나?**
- 동사는 종류가 극히 제한적
- 규칙 기반(패턴 매칭, 동의어 사전)으로 충분히 처리 가능
- 명사에 비해 임베딩 필요성 낮음
- 비용 효율성 (수백만 명사 vs 수천 동사)

#### Step 3: 관계 엣지 생성
```
(주체) --[정규화된_동사]--> (객체)

(Steve Jobs) --[founded]--> (Apple)
(Steve Jobs) --[CEO_of]--> (Apple)
(Apple) --[founded_year]--> (1976)
```

---

### 전체 처리 흐름 (종합 예시)

#### 입력
```
"Steve Jobs founded Apple in 1976.
S. Jobs was the CEO of Apple Inc."
```

#### 처리 단계

**1단계: 추출**
```
명사들: Steve Jobs, S. Jobs, Apple, Apple Inc., 1976
동사들: founded, CEO_of
```

**2단계: 명사 벡터화 + 통합**
```
Steve Jobs ┐
S. Jobs    ┘→ "Steve Jobs"  (유사도 0.98)

Apple      ┐
Apple Inc. ┘→ "Apple"       (유사도 0.95)
```

**3단계: 동사 정규화**
```
founded → "founded"
CEO_of → "CEO_of"
```

**4단계: 트리플(관계) 생성**
```
Triple 1: (Steve Jobs, founded, Apple)
Triple 2: (Steve Jobs, CEO_of, Apple)
Triple 3: (Apple, founded_year, 1976)
```

#### 최종 지식 그래프

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

---

## KGGen vs 기존 방식 (비교)

### OpenIE (기존 방식)
```
문자열 그대로 노드로 생성:
- Node 1: "Steve Jobs"
- Node 2: "S. Jobs" ← 중복! (같은 인물)
- Node 3: "Apple"
- Node 4: "Apple Inc." ← 중복! (같은 회사)

결과 분석:
- 4개 노드
- 연결 약함 (관련성 희소)
- 정보 밀도 낮음
```

### KGGen (개선 방식)
```
벡터 임베딩으로 의미적 통합:
- Node 1: "Steve Jobs" (통합)
- Node 2: "Apple" (통합)

결과 분석:
- 2개 노드
- 연결 강함 (관련성 밀집)
- 정보 밀도 4배 향상
```

### 성능 지표
```
중복 제거 효과:
  Before: 100개 문장 → 300개 노드
  After:  100개 문장 → 150개 노드
  → 50% 감소

연결 증가 효과:
  Before: Steve Jobs --[founded]--> Apple
          S. Jobs --[CEO_of]--> Apple Inc.
          (연결 없음)

  After:  Steve Jobs --[founded]--> Apple
          S. Jobs --[CEO_of]--> Apple (같은 노드!)
          → 100% 증가

정보 밀도:
  노드 50% 감소 + 연결 100% 증가 = 4배 향상
```

---

## 핵심 통찰

### 왜 명사만 임베딩하는가?

**명사의 특성**: 표현 다양성이 극도로 높음
```
Steve Jobs
S. Jobs
Steven Paul Jobs
잡스
스티브 잡스
Jobs

→ 문자열 비교만으로는 못 찾음
→ 의미 거리를 수치화해야 함
→ 벡터 임베딩 필수
```

**동사의 특성**: 표현이 제한적
```
founded
created
started
established

→ 패턴 매칭만으로 충분
→ 동의어 사전 정규화로 해결
→ 벡터 임베딩 불필요
```

**비용 고려사항**
```
명사: 일반적으로 수백만 개 이상 존재
      → 자동화된 임베딩 필수

동사: 실제로는 수천 개 정도만 사용
      → 사람이 규칙 정의 가능
      → 유지보수 효율적
```

---

## Relations

### derived_from
- [[KGGen - Knowledge Graph Generation Framework]] (원본 프레임워크 구현)
- [[Entity Resolution (엔티티 해결)]] (명사 통합 이론)
- [[Knowledge Graph (지식 그래프)]] (KG 기초 개념)
- [[Triple (트리플)]] ((주체, 동사, 객체) 구조)

### related_to
- [[벡터 임베딩]] (명사 처리 기술)
- [[코사인 유사도]] (유사도 계산 방식)
- [[클러스터링]] (유사 엔티티 그룹화)
- [[LLM 기반 검증]] (임베딩 결과 재검증)

### contrasts_with
- [[OpenIE]] (기존 문자열 기반 방식)

---

**도출일**: 2026-01-29
**출처**: KGGen 프레임워크 분석 및 Entity Resolution 이론 통합

---

**작성일**: 2026년 1월 20일
**카테고리**: 학습 노트
