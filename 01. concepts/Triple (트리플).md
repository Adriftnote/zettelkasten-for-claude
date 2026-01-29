---
title: Triple (트리플)
type: concept
permalink: knowledge/concepts/triple
tags:
- ai-basics
- concepts
- data-structures
category: 데이터 구조
difficulty: 초급
---

# Triple (트리플)

[[Knowledge Graph (지식 그래프)]]의 기본 단위로, **(주체) - (관계) - (객체)** 형태로 하나의 사실을 표현합니다.

## 📖 개요

Triple은 "세 개 조각"이라는 뜻으로, 세 가지 요소로 하나의 정보를 구조화합니다:

1. **주체 (Subject)**: 누가/무엇이
2. **관계 (Predicate/Relation)**: 어떤 관계로
3. **객체 (Object)**: 누구를/무엇을

```
(주체) --[관계]--> (객체)
```

## 🎭 비유

**문장의 주어-동사-목적어**와 같습니다:

```
문장: "철수가 사과를 먹는다"
주어: 철수
동사: 먹다
목적어: 사과

Triple:
(철수) --[먹다]--> (사과)
```

## ✨ 특징

- **원자적**: 더 이상 쪼갤 수 없는 최소 단위
- **명확함**: 주체-관계-객체 명시
- **확장 가능**: 여러 트리플을 연결해 복잡한 지식 표현
- **기계 이해**: 컴퓨터가 처리하기 쉬운 형태

## 💡 예시

### 기본 예시

```
(Steve Jobs) --[founded]--> (Apple)
주체: Steve Jobs
관계: founded (설립했다)
객체: Apple
```

### 다양한 트리플

**사람 관계**:
```
(Steve Jobs) --[CEO_of]--> (Apple)
(Steve Jobs) --[born_in]--> (1955)
(Steve Jobs) --[died_in]--> (2011)
(Steve Jobs) --[co-founded_with]--> (Steve Wozniak)
```

**회사 정보**:
```
(Apple) --[founded_year]--> (1976)
(Apple) --[headquartered_in]--> (Cupertino)
(Apple) --[industry]--> (Technology)
```

**관계 연결**:
```
(Steve Jobs) --[founded]--> (Apple) --[produces]--> (iPhone)
```

## 📊 트리플의 구성 요소

### 1. 주체 (Subject)
- **엔티티** (명사): 사람, 장소, 사물, 개념
- 예: Steve Jobs, Apple, Seoul

### 2. 관계 (Predicate)
- **동사/속성**: 행동, 상태, 속성
- 예: founded, CEO_of, located_in, has_color

### 3. 객체 (Object)
- **엔티티 또는 값**: 다른 엔티티 또는 구체적 값
- 예: Apple (엔티티), 1976 (값), "red" (값)

## 🔍 트리플 표기법

### 그래프 표기
```
(Steve Jobs) --[founded]--> (Apple)
```

### RDF 표기 (Semantic Web)
```turtle
<Steve_Jobs> <founded> <Apple> .
```

### JSON 표기
```json
{
  "subject": "Steve Jobs",
  "predicate": "founded",
  "object": "Apple"
}
```

### 자연어 변환
```
Triple: (Apple) --[founded_year]--> (1976)
→ "Apple was founded in 1976"
→ "Apple의 설립 연도는 1976년이다"
```

## 🔧 트리플로 지식 그래프 구축

### 단일 트리플
```
(Steve Jobs) --[founded]--> (Apple)
```

### 여러 트리플 결합
```
(Steve Jobs) --[founded]--> (Apple)
(Steve Jobs) --[CEO_of]--> (Apple)
(Apple) --[founded_year]--> (1976)
(Apple) --[headquartered_in]--> (Cupertino)

→ 연결된 지식 그래프:

    Steve Jobs
      /    \
  founded  CEO_of
    /        \
  Apple ←────┘
    |    \
founded_year  headquartered_in
    |              \
   1976          Cupertino
```

## 🎯 트리플 추출 예시

### 텍스트에서 트리플 추출

**입력 텍스트**:
```
"Steve Jobs founded Apple in 1976 in Cupertino."
```

**추출된 트리플**:
```
(Steve Jobs) --[founded]--> (Apple)
(Apple) --[founded_year]--> (1976)
(Apple) --[founded_location]--> (Cupertino)
```

### LLM을 이용한 추출

**LLM 프롬프트**:
```
"다음 문장에서 트리플을 추출하세요:
Steve Jobs founded Apple in 1976."
```

**LLM 응답**:
```
1. (Steve Jobs, founded, Apple)
2. (Apple, founded_year, 1976)
```

## ⚡ 트리플의 장점

### 1. 구조화
```
텍스트: "Steve Jobs founded Apple in 1976"
→ 검색 어려움

트리플:
(Steve Jobs) --[founded]--> (Apple)
(Apple) --[founded_year]--> (1976)
→ 질의 가능: "누가 Apple을 설립했나?" → Steve Jobs
```

### 2. 확장성
```
새로운 정보 추가 쉬움:
(Apple) --[products]--> (iPhone)
(iPhone) --[released_year]--> (2007)
```

### 3. 관계 명확
```
"Steve Jobs와 Apple의 관계는?"
→ founded, CEO_of (명확한 관계 확인)
```

## Relations

- extends [[Knowledge Graph (지식 그래프)]]
- used_by [[Entity Resolution (엔티티 해결)]]

## 📚 더 알아보기

- [[KGGen - Knowledge Graph Generation Framework|KGGen]] - 자동 트리플 추출 프레임워크

---

**난이도**: 초급
**카테고리**: 데이터 구조
**마지막 업데이트**: 2026년 1월
