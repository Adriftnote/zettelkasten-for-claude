---
title: Cognitive Load (인지 부하)
type: concept
tags:
  - cognition
  - ux
  - code-readability
  - learning
  - psychology
permalink: knowledge/concepts/cognitive-load
category: Cognitive Science
difficulty: 초급
---

# Cognitive Load (인지 부하)

**작업 기억(Working Memory)**에 가해지는 정신적 부담의 총량입니다. 인지 부하가 높으면 이해와 학습이 어려워집니다.

## 📖 개요

인지 부하 이론(Cognitive Load Theory)은 John Sweller가 1988년 제안한 이론으로, 인간의 작업 기억 용량이 제한적이라는 전제에서 출발합니다. 정보 처리 시 이 용량을 초과하면 학습과 문제 해결 능력이 저하됩니다.

## 🎭 비유

**책상 위 공간 비유**:
```
작업 기억 = 책상 위 공간 (제한적)

인지 부하가 낮을 때:
┌─────────────────────────────┐
│  📄 과제    📝 메모         │
│                    [여유]   │
└─────────────────────────────┘
→ 생각할 공간 충분, 효율적 작업

인지 부하가 높을 때:
┌─────────────────────────────┐
│📄📄📄📝📝📝📚📚📚📚📚│
│📊📊📊📁📁📁📁📋📋📋📋│
└─────────────────────────────┘
→ 공간 부족, 혼란, 실수 증가
```

## ✨ 세 가지 유형

| 유형 | 설명 | 예시 | 통제 가능 |
|------|------|------|:--------:|
| **Intrinsic** (내재적) | 과제 자체의 복잡성 | 알고리즘의 본질적 어려움 | △ |
| **Extraneous** (외재적) | 불필요한 복잡성 | 나쁜 코드 구조, 혼란스러운 UI | ✓ |
| **Germane** (관련적) | 학습에 기여하는 부하 | 스키마 형성, 패턴 학습 | ✓ |

### 최적화 전략

```
좋은 설계:
  Intrinsic  = 최소화 (단순화)
  Extraneous = 제거 (노이즈 제거)
  Germane    = 최대화 (학습 촉진)

나쁜 설계:
  모든 유형이 뒤섞여 → 과부하 → 실패
```

## 💡 코드에서의 인지 부하

### 예시 1: 높은 인지 부하 (나쁜 코드)

```javascript
// 한 번에 너무 많은 것을 처리
function p(d) {
  return d.filter(x => x.a > 0 && x.b !== null)
    .map(x => ({...x, c: x.a * (x.b || 1) + (x.d ? x.d.reduce((s,i) => s+i, 0) : 0)}))
    .sort((a,b) => b.c - a.c).slice(0, 10);
}
```

**문제점**:
- 변수명이 의미 없음 (`d`, `x`, `a`, `b`)
- 한 줄에 여러 로직 압축
- 중첩된 삼항 연산자
- **외재적 부하 ↑**

### 예시 2: 낮은 인지 부하 (좋은 코드)

```javascript
function getTopProducts(products, limit = 10) {
  const activeProducts = products.filter(isActive);
  const withScores = activeProducts.map(calculateScore);
  const sorted = withScores.sort(byScoreDescending);
  return sorted.slice(0, limit);
}

function isActive(product) {
  return product.stock > 0 && product.price !== null;
}

function calculateScore(product) {
  const baseScore = product.stock * (product.price || 1);
  const bonusScore = sumArray(product.bonuses);
  return { ...product, score: baseScore + bonusScore };
}
```

**개선점**:
- 의미 있는 함수/변수명
- 한 함수 = 한 가지 일
- 로직 분리로 단계별 이해 가능
- **외재적 부하 ↓, 관련적 부하 ↑**

## 📊 측정 지표

| 지표 | 설명 | 적용 |
|------|------|------|
| **Cyclomatic Complexity** | 분기 수 | 함수 복잡도 |
| **Nesting Depth** | 중첩 깊이 | 조건문/반복문 |
| **Working Memory Units** | 동시 기억 항목 수 | 변수, 상태 |
| **Cognitive Dimensions** | 인지 차원 분석 | API/UI 설계 |

## 🛠️ 인지 부하 줄이기

### 코드에서

| 전략 | 방법 |
|------|------|
| **청킹** | 관련 코드를 함수로 묶기 |
| **명명** | 의미 있는 이름 사용 |
| **추상화** | 세부사항 숨기기 |
| **일관성** | 패턴 반복 사용 |
| **단순화** | 불필요한 복잡성 제거 |

### UX에서

| 전략 | 방법 |
|------|------|
| **점진적 공개** | 필요할 때만 정보 표시 |
| **시각적 계층** | 중요도에 따른 배치 |
| **친숙한 패턴** | 기존 멘탈 모델 활용 |
| **피드백** | 현재 상태 명확히 표시 |

## ⚡ 관련 개념

### 작업 기억의 한계

```
Miller's Law: 7 ± 2

한 번에 기억할 수 있는 항목: 약 7개
→ 함수 파라미터 7개 이상? 위험!
→ 중첩 3단계 이상? 위험!
→ 한 화면에 정보 너무 많음? 위험!
```

### MDN과의 관계

[[Multiple Demand Network]]가 처리할 수 있는 용량을 초과하면:
- 오류 증가
- 처리 속도 저하
- 피로 누적

## Relations

- processed_by [[Multiple Demand Network]] - 인지 부하를 처리하는 뇌 영역
- related_to [[Attention]] - 주의 자원과 연관
- applied_to [[progressive-disclosure]] - 부하 감소 전략
- measured_by [[Cyclomatic Complexity]] - 코드 복잡도 지표

---

**난이도**: 초급
**카테고리**: Cognitive Science / UX / Software Engineering
**출처**: [[03. sources/reference/코드 가독성과 신경과학 - Evan Moon|코드 가독성과 신경과학 - Evan Moon]]
