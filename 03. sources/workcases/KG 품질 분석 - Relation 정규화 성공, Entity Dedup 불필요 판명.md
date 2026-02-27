---
title: KG 품질 분석 - Relation 정규화 성공, Entity Dedup 불필요 판명
type: note
permalink: 03.-sources/workcases/kg-pumjil-bunseog-relation-jeonggyuhwa-seonggong-entity-dedup-bulpilyo-panmyeong
tags:
- workcase
- knowledge-graph
- entity-resolution
- KGGen
- deduplication
---

# KG 품질 분석: Relation 정규화 성공, Entity Dedup 불필요 판명

basic-memory의 knowledge graph 품질을 KGGen 프레임워크 관점에서 분석. Relation 정규화는 71% 타입 감소로 큰 효과를 보였으나, Entity 중복 제거는 벡터 임베딩까지 동원해도 의미 있는 결과가 없었다.

## 배경

[[KGGen 이해 - 명사 통합과 동사 관계]] 노트에서 학습한 KGGen의 2축 전략(명사=벡터 임베딩, 동사=규칙 기반)을 자체 지식 그래프에 적용하려 했다.

## 작업 내용

### Phase 1: Relation Table 전수조사 (성공)

memory.db의 relation 테이블 172종 2,308개 관계를 Bottom-Up 전수 분석.

**3-tier 분류 결과:**
- Tier 1 노이즈: 28종 38건 (마크다운 파싱 오류 — `**텍스트**`, `*패턴*` 등이 relation_type으로 유입)
- Tier 2 동의어/방향 쌍: ~94종 → ~25개 정규 타입으로 통합 가능
- Tier 3 독립 타입: ~50종

**핵심 성과:** 172종 → ~50종 (71% 감소). 상세 매핑은 [[Relation Table 전수조사 - KG 품질 분석]] 참조.

### Phase 2: Entity Dedup 시도 (불필요 판명)

504개 엔티티의 중복 여부를 3가지 방법으로 검증:

**방법 1: 문자열 검사**
- 504개 title 전부 unique (정확 일치 중복 0건)
- substring 매칭으로 `JavaScript (JS)` ↔ `JavaScript` 등 소수 발견

**방법 2: SemHash (potion-base-8M)**
- KGGen이 실제 사용하는 dedup 엔진
- threshold=0.9에서 140/504 필터링 (27.8%) → **과도한 false positive**
- 원인: 8M 파라미터 소형 모델이 한국어 긴 제목을 제대로 구분 못함
- 단, relation_type dedup에서는 threshold=0.85로 정확한 동의어 감지 (수작업 분석 결과와 일치)

**방법 3: multilingual-e5-large (1024d)**
- vecsearch와 동일 모델, 504×504 pairwise cosine similarity
- threshold=0.95: 0쌍
- threshold=0.90: 2쌍만 감지 (둘 다 진짜 중복)
  - `JavaScript (JS)` ↔ `JavaScript` (0.9468)
  - `노트 도출 3원칙 - 범위, 제목, 서술` ↔ `노트 도출 3원칙 — 범위, 제목, 서술` (0.9283, dash vs em-dash)
- threshold=0.85: 수천 쌍 노이즈

## Observations

- [insight] Relation 정규화는 자동 추출 KG든 수작업 KG든 효과적이다. 동사/관계어는 자연스럽게 변이가 생기기 때문 #relation-normalization
- [insight] Entity dedup은 **데이터 생성 방식에 따라 필요성이 결정**된다. KGGen의 대상은 자동 추출된 messy KG이고, 우리는 사람이 직접 이름 짓는 제텔카스텐이다 #entity-resolution
- [insight] 벡터 임베딩 기반 entity dedup은 "리스트로 보는 것과 큰 차이 없다" — 사람이 일관된 명명 규칙을 지키면 벡터가 추가 가치를 주지 않는다 #naming-convention
- [lesson] SemHash의 potion-base-8M은 한국어 긴 제목에 부적합. 모든 한국어 제목이 0.9+로 나옴 #model-selection
- [lesson] multilingual-e5-large는 한국어 엔티티 구별에 우수하지만, 잘 정리된 데이터에서는 trivial한 2건만 발견 #e5-large
- [lesson] SemHash는 relation_type 같은 짧은 영어 문자열 dedup에 적합. 한국어 긴 제목에는 부적합 #semhash-usecase
- [tool] `entity_dedup.py` (SemHash), `entity_dedup_e5.py` (e5-large) → `working/` 폴더에 스크립트 보관 #scripts
- [decision] Entity dedup은 현 시점에서 불필요. 향후 자동 추출 엔티티가 유입되면 재검토 #deferred
- [pattern] KGGen 파이프라인에서 실제 쓸모 있는 것: SemHash relation dedup + 규칙 기반 정규화 매핑. Entity dedup은 제텔카스텐에 해당 없음 #selective-adoption

## 관련 Task

- task-20260227: KG 품질 분석 (relation 전수조사 + entity dedup 시도)

## 수치 요약

| 항목 | Before | After | 효과 |
|------|--------|-------|------|
| Relation types | 172종 | ~50종 | 71% 감소 |
| 노이즈 관계 | 38건 | 0건 (제거 대상) | 파서 버그 식별 |
| Entity 중복 | 504개 검사 | 2건 trivial | 벡터 dedup 불필요 |
| 분석 도구 | - | SemHash + e5-large | 스크립트 재사용 가능 |
