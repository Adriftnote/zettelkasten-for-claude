---
title: REF-061 Ontology Development 101
type: guide
permalink: sources/reference/ontology-development-101
tags:
- ontology
- knowledge-representation
- taxonomy
- class-hierarchy
date: 2026-02-24
---

# Ontology Development 101

Stanford의 온톨로지 개발 입문 가이드. 도메인 지식을 클래스-속성-제약 구조로 형식화하는 7단계 방법론을 와인 도메인 예제로 설명.

## 📖 핵심 아이디어

온톨로지는 도메인 내 개념(클래스)과 그 관계(슬롯)를 명시적으로 정의한 형식적 명세다. 핵심 주장은 "정답인 온톨로지는 없다" — 설계는 목적, 범위, 설계자의 관점에 따라 달라지며 반복적으로 개선된다. 온톨로지 + 개별 인스턴스 = 지식 베이스(knowledge base).

## 🛠️ 구성 요소 / 주요 내용

| 구성요소 | 역할 | 예시 (와인 도메인) |
|---------|------|-------------------|
| Class (클래스) | 도메인 내 개념/객체 유형 | Wine, Red Wine, Winery |
| Slot (슬롯) | 클래스의 속성/관계 | maker, body, color, flavor |
| Facet (파셋) | 슬롯에 대한 제약 | cardinality, value type, range |
| Instance (인스턴스) | 클래스의 구체적 개체 | Chateau-Morgon-Beaujolais |

## 🔧 작동 방식 / 적용 방법

### 7단계 개발 방법론

```
Step 1: 도메인·범위 결정
  └─ "competency questions"로 범위 정의
Step 2: 기존 온톨로지 재사용 검토
Step 3: 주요 용어 열거
  └─ 클래스/속성 구분 없이 일단 나열
Step 4: 클래스 + 계층 구조 정의
  ├─ Top-down: 일반 → 구체
  ├─ Bottom-up: 구체 → 일반
  └─ Combination: 혼합
Step 5: 슬롯(속성) 정의
  └─ 가장 일반적인 클래스에 부착 → 하위 상속
Step 6: 파셋(제약) 정의
  └─ cardinality, value type, domain, range
Step 7: 인스턴스 생성
  └─ 클래스 선택 → 슬롯 값 채우기
```

### 클래스 계층 설계 핵심 규칙

| 규칙 | 설명 |
|------|------|
| is-a 관계 | 계층은 "~의 일종" 관계만 — "~의 부분"은 슬롯으로 |
| 순환 금지 | A→B→A 되면 동치 → 모델링 오류 |
| siblings 동일 수준 | 형제 클래스는 같은 일반성 수준 |
| 2~12 하위 클래스 | 1개면 불필요, 너무 많으면 중간 범주 필요 |
| 다중 상속 | Port = Red Wine ∩ Dessert Wine (양쪽 속성 상속) |

### 클래스 vs 속성값 판단 기준

| 질문 | 클래스로 | 속성값으로 |
|------|---------|-----------|
| 다른 객체와의 관계에 영향? | O | X |
| 다른 클래스의 제약으로 사용? | O | X |
| 인스턴스의 소속이 변할 수 있나? | 속성값 | 클래스 |

## 💡 실용적 평가 / 적용

**제텔카스텐과의 대응:**

| 온톨로지 | 제텔카스텐 (basic-memory) | 차이점 |
|---------|--------------------------|--------|
| Class | Hub / Concept 노트 | 온톨로지는 형식적 계층, 제텔은 유연한 네트워크 |
| Slot | Observation | 온톨로지 슬롯은 타입 제약 있음, Observation은 자유 형식 |
| Facet | — | 제텔카스텐에는 제약 메커니즘 없음 |
| Instance | 개별 Reference/Workcase | 비슷 |
| is-a 계층 | wikilink 연결 | 제텔은 is-a 외에도 다양한 관계 혼재 |

**시사점:**
- basic-memory의 relation에 관계 유형(is-a, has-part, related-to)을 명시하면 온톨로지에 가까워짐
- 현재 `[[노트]] - (연결 이유)` 형식이 이미 그 방향
- 완전한 온톨로지는 과도하지만, "is-a인지 has-part인지" 구분만 해도 검색 품질 향상

**한계:**
- 2001년 문서로 도구(Protege-2000)는 구식
- Semantic Web 표준(RDF, OWL)은 이후 발전이 더 큼
- 개인 지식관리에 직접 적용하기엔 형식성이 과도 — 원칙만 차용

## 🔗 관련 개념

- [[Knowledge Graph (지식 그래프)]] - (온톨로지는 KG의 스키마 레이어 — 노드/엣지의 타입과 제약을 정의)
- [[Category Theory (카테고리 이론)]] - (클래스 계층의 is-a 관계가 카테고리의 morphism과 구조적으로 대응)
- [[Temporal Knowledge Graph]] - (정적 온톨로지에 시간 차원을 추가한 확장 — 지식의 변화를 다룸)

---

**작성일**: 2026-02-24
**분류**: Knowledge Representation
**원본**: Noy & McGuinness, Stanford (2001)