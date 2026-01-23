---
title: Entity Resolution (엔티티 해결)
type: concept
permalink: knowledge/concepts/entity-resolution
tags:
- ai-basics
- concepts
- data-processing
category: 데이터 처리
difficulty: 중급
---

# Entity Resolution (엔티티 해결)

같은 대상을 **다르게 표현한 것들을 찾아내서 하나로 통합**하는 데이터 처리 기법입니다.

## 📖 개요

현실에서 같은 대상을 여러 방식으로 표현합니다. Entity Resolution은 이런 다양한 표현들이 실제로 같은 대상을 가리킨다는 것을 인식하고 통합합니다.

**다른 이름**:
- Entity Matching
- Record Linkage
- Deduplication (중복 제거)
- Coreference Resolution

## 🎭 비유

**같은 사람을 다른 이름으로 부르는 것**:
```
"김철수"
"철수"
"철수형"
"Kim Chulsoo"
→ 모두 같은 사람!
```

Entity Resolution은 "어? 이 이름들 전부 같은 사람이네!"를 알아내는 과정입니다.

## ✨ 특징

- **중복 제거**: 같은 대상의 다중 표현 통합
- **관계 강화**: 통합으로 연결 증가
- **품질 향상**: 일관성 있는 데이터
- **자동화 가능**: AI로 자동 처리 가능

## 💡 예시

### 실생활 예시

**이름 표기**:
```
Steve Jobs
S. Jobs
Steven Paul Jobs
잡스
스티브 잡스
→ 하나로 통합: "Steve Jobs"
```

**회사명**:
```
Apple
Apple Inc.
Apple Computer
애플
→ 하나로 통합: "Apple"
```

**장소**:
```
서울
Seoul
서울특별시
Seoul, South Korea
→ 하나로 통합: "Seoul"
```

### 문제 상황

**[[Knowledge Graph (지식 그래프)]]에서**:
```
Without Entity Resolution (희소함):
  Steve Jobs --[founded]--> Apple
  S. Jobs --[CEO_of]--> Apple Inc.
  잡스 --[died]--> 2011
  (3개 노드, 연결 없음)

With Entity Resolution (밀도 높음):
  Steve Jobs --[founded]--> Apple
      |
      +--[CEO_of]--> Apple
      |
      +--[died]--> 2011
  (1개 노드, 연결 풍부)
```

## 🔧 해결 방법

### 1. 전통적 방법 (규칙 기반)

**문자열 유사도**:
```python
# Levenshtein 거리
"Apple" vs "Apple Inc." → 유사도 계산
→ 임계값 넘으면 같은 것으로 판단
```

**장점**: 빠름, 단순
**단점**: 유연성 부족, 오류 많음

### 2. 현대적 방법 (AI 기반)

**벡터 임베딩**:
```python
# 임베딩 생성
"Steve Jobs" → [0.2, 0.8, 0.3, ...]
"S. Jobs"    → [0.19, 0.81, 0.29, ...]

# 코사인 유사도 계산
similarity = 0.98  # 매우 유사!

# 클러스터링
→ 같은 클러스터 → 같은 엔티티
```

**LLM 검증**:
```
질문: "Steve Jobs와 S. Jobs는 같은 사람인가요?"
LLM: "Yes, 같은 사람입니다."
→ 통합 확정
```

**장점**: 유연함, 정확함
**단점**: 계산 비용 높음

## 📊 비교: 전통 vs AI 기반

| | 규칙 기반 | AI 기반 (KGGen) |
|---|---|---|
| **방법** | 문자열 유사도 | 벡터 임베딩 + LLM |
| **유연성** | 낮음 | 높음 |
| **정확도** | 보통 | 높음 |
| **속도** | 빠름 | 느림 |
| **예시** | "Apple" = "Apple Inc." 못 찾음 | 찾아냄 ✅ |

## 🎯 KGGen에서의 활용

### 3단계: Resolution (해결)

```
1. 임베딩 생성
   모든 엔티티를 벡터로 변환

2. 클러스터링
   유사한 벡터를 그룹으로 묶음

3. LLM 검증
   "이것들 같은 대상 맞아?"

4. 통합
   같은 대상으로 확정되면 하나로 병합
```

### 결과

**Before (희소함)**:
```
100개 문장 → 300개 노드 (중복 많음)
→ 연결 약함
```

**After (밀도 높음)**:
```
100개 문장 → 150개 노드 (중복 제거)
→ 연결 2배 증가
```

## ⚡ 왜 중요한가?

### 데이터 품질
```
중복 제거 → 일관성 향상
```

### 그래프 밀도
```
통합 → 연결 증가 → 검색 품질 향상
```

### 저장 공간
```
중복 제거 → 효율적 저장
```

## 🔍 실제 활용

### Google Search
```
"Steve Jobs"로 검색
→ "S. Jobs", "잡스" 관련 결과도 포함
→ Entity Resolution 적용됨
```

### 고객 데이터 통합
```
이메일: steve@apple.com
전화번호: 010-1234-5678 (Steve J.)
주소: Apple (담당: 스티브)
→ 모두 같은 고객으로 통합
```

### Wikipedia
```
"Barack Obama"
"버락 오바마"
"Obama"
→ 모두 같은 문서로 리다이렉트
```

## Relations

- used_by [[Knowledge Graph (지식 그래프)]]
- part_of [[Triple (트리플)]]

## 📚 더 알아보기

- [[KGGen - Knowledge Graph Generation Framework|KGGen]] - AI 기반 Entity Resolution 활용 사례

---

**난이도**: 중급
**카테고리**: 데이터 처리
**마지막 업데이트**: 2026년 1월
