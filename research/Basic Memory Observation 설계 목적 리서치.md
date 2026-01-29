---
title: Basic Memory Observation 설계 목적 리서치
type: note
permalink: research/basic-memory-observation-seolgye-mogjeog-riseoci
tags:
- basic-memory
- observation
- design
- knowledge-graph
---

# Basic Memory Observation 설계 목적 분석

## 핵심 발견

### Observation의 정의
- **Categorized facts about entities**
- 포맷: `- [category] content #tag (optional context)`
- 단일 Entity 내의 구조화된 정보 단위

---

## 1. 설계 목적 (Philosophy)

### 목표: 구조화된 의미론적 지식베이스
Observation은 마크다운의 단순성을 유지하면서도 **기계가 읽을 수 있는 구조화된 의미**를 부여하는 것이 핵심입니다.

- Plain text markdown 형식 유지 → 인간과 AI 모두 동일한 포맷으로 읽고 쓸 수 있음
- 카테고리화 `[decision]`, `[fact]`, `[technique]` → 정보 유형 명시화
- 태그 추가 `#tag` → 횡단적(cross-cutting) 검색 및 필터링 가능
- 의도 명확화 → 구조가 없으면 일반 텍스트일 뿐

---

## 2. Entity/Relation과의 근본적 차이

| 구분 | 범위 | 기능 | 예시 |
|------|------|------|------|
| **Entity** | 독립 노트/파일 | 지식 단위의 주제 | "Tokyo Neighborhood Guide" (노트 제목) |
| **Observation** | Entity 내부 | Entity에 대한 사실/속성 | `[area] Shibuya is busy #shopping` |
| **Relation** | Entity 간 연결 | 네트워크 형성 | `located_in [[Tokyo]]` |

### 계층 구조
```
Entity (컨테이너)
├── Observation 1 (내용)
├── Observation 2 (내용)
└── Observation 3 (내용)
   ↓ (Relation으로 다른 Entity 연결)
Entity 2
```

---

## 3. Observation이 없으면 안 되는 이유

### 문제 1: 정보 분류 불가
- Observation 없음 → "일반 텍스트 불릿 포인트"일 뿐
- Observation 있음 → `[method]` vs `[tip]` 구분 가능, 검색 필터링 가능

### 문제 2: AI가 맥락 추출 불가
- `build_context()` 호출 시 Observation의 카테고리/태그로 관련 정보 필터링
- 구조 없으면 전체 텍스트를 분석해야 함 (비효율)

### 문제 3: 의미 손실
- Entity만 있으면: "여러 사실들의 혼합"
- Observation 있으면: "어떤 종류의 사실인가"를 명시적으로 표현

---

## 4. 검색 및 지식 그래프 활용

### search_notes()에서의 역할
```python
search_notes(query, entity_types=["..."], types=["observation"])
# ↑ types 필터로 Observation만 검색 가능
```

### build_context()에서의 활용
- 관련 entity를 검색할 때 **Observation의 태그/카테고리를 메타데이터**로 사용
- 예: `#coffee` 태그를 가진 Observation들 → 검색 시 관련성 판단 기준

### MCP Tool 관점
- Observation은 **쿼리 가능한 메타데이터** 역할
- 카테고리와 태그 → 지식 그래프 탐색의 진입점 제공

---

## 5. 설계 철학 정리

Basic Memory의 핵심: **"Plain text as source of truth + Structured patterns for machines"**

- **인간 친화적**: 마크다운 쓰면 됨
- **기계 친화적**: 일관된 패턴으로 파싱 가능
- **양방향**: Human과 AI 모두 동일 형식으로 읽고 쓸 수 있음

Observation은 이 철학을 구현하는 **최소 단위의 의미 단위(semantic unit)**입니다.

---

## 6. 비유로 이해

### Traditional Note-taking
```
Coffee Brewing
- Pour over is good
- French press is also nice
```
→ 기계가 이게 "팁"인지 "사실"인지 "경험"인지 알 수 없음

### Basic Memory
```
Coffee Brewing
- [tip] Pour over extracts more floral notes #brewing
- [experience] French press was cleaner #experiment
```
→ 카테고리로 유형 구분, 태그로 주제 표시 → 기계가 맥락 파악 가능

---

## 결론

**Observation이 필요한 이유:**

1. **정보 분류**: 같은 Entity 내 다양한 유형의 사실 구분
2. **검색 최적화**: 카테고리/태그로 빠른 필터링
3. **의미 명확화**: "어떤 종류의 정보인가"를 구조로 표현
4. **양방향 동작**: Human과 AI가 동일한 포맷으로 협업
5. **맥락 구축**: AI가 관련 정보를 효율적으로 검색/추론