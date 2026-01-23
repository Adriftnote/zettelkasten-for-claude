---
title: Context Clash
type: pattern
tags: [context-engineering, conflict-resolution, information-management]
permalink: knowledge/concepts/context-clash
category: Context Engineering
difficulty: intermediate
created: 2026-01-19
---

# Context Clash

## 📖 개요

동일한 주제에 대해 상충하는 정보나 전제(context)가 모델의 응답에 영향을 미치는 현상입니다. 예를 들어, 시스템 프롬프트와 사용자 입력이 다른 요구를 하거나, 서로 다른 시간대의 지식이 섞여 있을 때 발생합니다. 이를 인식하고 명시적으로 처리하는 것이 패턴입니다.

## 🎭 비유

두 명의 상사가 같은 직원에게 서로 다른 지시를 내리는 상황입니다. 직원은 혼란스럽고, 어떤 지시를 따를지 명확하지 않습니다. 이때 "누구의 지시가 우선인지" 명시적으로 정하면 clash를 해결할 수 있습니다.

## ✨ 특징

- **정보 충돌 감지**: 상충하는 정보의 존재를 명시적으로 인식
- **우선순위 명확화**: 어떤 정보를 우선할지 명확히 지정
- **시간대 관리**: 구식 정보와 최신 정보의 구분
- **투명성**: clash 해결 과정을 모델에게 명시적으로 제시

## 💡 예시

### 예시 1: 시스템 프롬프트 vs 사용자 입력의 clash

**상황**:
```
시스템 프롬프트: "당신은 매우 신중하고 보수적입니다. 항상 의심하는 입장에서..."
사용자: "이 코드 빠르게 작성해주세요. 완벽할 필요는 없습니다."
```

**Clash 처리**:
```
[CONTEXT PRIORITY]
- 사용자 요청: "속도 우선, 완벽성은 이차"
- 시스템 설정: "신중한 접근"
=> 결정: 사용자 요청이 최우선. 신중함을 버리고 빠른 프로토타입 작성.

[응답]
```

### 예시 2: 다양한 시간대의 정보 clash

**상황**:
```
문맥 1 (2년 전): "React의 모범 사례는 Class Component입니다"
문맥 2 (2024): "React의 모범 사례는 Functional Component입니다"
```

**Clash 처리**:
```
[INFORMATION TIMELINE]
- 구 표준: Class Component (2020-2022)
- 현 표준: Functional Component + Hooks (2023-현재)
=> 결정: 최신 표준 기준으로 답변. 레거시는 필요시만 언급.

[응답]
```

### 예시 3: 기술 관점의 clash

**상황**:
```
요구사항 A: "최대한 추상화하여 재사용성 높이기"
요구사항 B: "즉시 구현 가능한 구체적 코드"
```

**Clash 처리**:
```
[PRIORITY CONFLICT RESOLUTION]
충돌: 추상화 vs 구체성

우선순위: 즉시 구현 > 추상화
(이유: 현재 마감이 1주)

[응답: 동작 가능한 구체 코드, 리팩토링 제안으로 연결]
```

## 🛠️ 해결/적용 방법

### 1단계: Clash 식별
- 프롬프트, 시스템 설정, 문맥 정보 간 상충점 찾기
- 명확한 우선순위가 없는 요구사항 구분

### 2단계: 우선순위 명시
- "[CONTEXT PRIORITY]" 섹션 추가
- 어떤 정보를 따를지 명시적으로 선언

### 3단계: 타이ム라인 정보 표시
- 오래된 정보와 최신 정보 구분
- 시간적 배경 제시

### 4단계: 응답에 반영
- 우선순위 기반으로 답변 작성
- 필요시 clash의 다른 측면도 언급하되 우선순위 명확화

### 5단계: 명시적 기록
- 왜 이 우선순위를 택했는지 모델에게 설명
- 향후 유사한 clash 방지

## Relations

- mitigates_by [[anchored-iterative-summarization|Anchored Iterative Summarization]] - resolves through priority anchoring
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - addresses in priority resolution
- mitigates_by [[lazy-tool-loader|LazyToolLoader Pattern]] - prevents through conditional activation
- relates_to [[context-confusion|Context Confusion]] - both manage conflicting information
- example_of [[graceful-degradation|Graceful Degradation]] - demonstrates handling of conflicting demands
