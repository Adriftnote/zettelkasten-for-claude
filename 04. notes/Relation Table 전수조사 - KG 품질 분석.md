---
title: Relation Table 전수조사 - KG 품질 분석
type: note
permalink: 04.-notes/relation-table-jeonsujosa-kg-pumjil-bunseog
tags:
- knowledge-graph
- entity-resolution
- data-quality
- analysis
---

# Relation Table 전수조사: Basic Memory KG 품질 분석

memory.db의 relation 테이블을 KGGen의 동사 정규화 관점에서 전수 분석한 결과. 172종 2,308개 관계를 3-tier로 분류하고 정규화 매핑을 도출했다.

## 현황 요약

- [fact] 총 2,308개 관계, 172종 relation_type #scale
- [fact] linked(to_id 연결됨): 1,975 (85.6%) / unlinked: 333 (14.4%) #link-quality
- [fact] 상위 10종이 전체의 72% 차지 (1,668/2,308) #distribution
- [fact] 1-2건짜리 롱테일이 120종 이상 #long-tail

## Tier 1: 노이즈 (파싱 오류) — 28종, 38건

마크다운 파싱 오류로 생긴 쓰레기 관계. 정보 가치 없음.

### 마크다운 서식 오류 (볼드/코드블록 잔해)
| relation_type | 건수 | 원인 |
|---|---|---|
| `**` | 3 | 볼드 마크다운 파싱 실패 |
| `` ` `` | 3 | 코드블록 마크다운 파싱 실패 |
| `✅` | 1 | 체크박스 이모지 파싱 |
| `✅ 잘못된 해석 방지 (예: UTF-8 →` | 1 | 본문 내용 유출 |
| `현재 \`` | 1 | 코드블록 열림 실패 |
| `**demonstrates**` | 2 | 볼드 감싸진 relation_type |
| `**uses**:` | 1 | 볼드+콜론 |
| `**requires**:` | 1 | 볼드+콜론 |
| `**related**:` | 1 | 볼드+콜론 |
| `**part_of**:` | 1 | 볼드+콜론 |
| `**part_of**` | 1 | 볼드만 |
| `**alternative_to**:` | 1 | 볼드+콜론 |

### 본문/메타 내용 유출
| relation_type | 건수 | 원인 |
|---|---|---|
| `컨텍스트가 필요하면 **Relations 섹션**에서...` | 1 | 설명문 파싱 |
| `Relations: \`- relation_type` | 1 | 문법 설명 파싱 |
| `[ ] **Relations 형식 정확함**...` | 1 | 체크리스트 파싱 |
| `[method] Relations는...` | 1 | 태그 내용 파싱 |
| `[impl] format_relations...` | 1 | 구현 설명 파싱 |
| `[impl] source_path 기반...` | 1 | 구현 설명 파싱 |
| `[tip] In Metabase filters...` | 1 | 팁 내용 파싱 |

### 콜론 접미사 오류 (유효 타입의 변형)
| relation_type | 건수 | 실제 의도 |
|---|---|---|
| `출처:` | 5 | `derived_from` 또는 `references` |
| `causes:` | 1 | `causes` |
| `references:` | 1 | `references` |
| `uses:` | 1 | `uses` |
| `related:` | 1 | `related_to` |

### 브래킷 접미사 오류
| relation_type | 건수 | 실제 의도 |
|---|---|---|
| `[reference]` | 2 | `references` |
| `[connects]` | 1 | `connects_to` |

## Tier 2: 정규화 대상 (동의어/방향쌍) — 정규화 매핑 테이블

### 정규화 매핑: 범용 관계

| Canonical | 방향 | 원본 relation_type (건수) | 의미 |
|---|---|---|---|
| **relates_to** | → | `relates_to`(478), `related_to`(44) | 범용 연관. 구체적 관계 불명 시 사용 |
| **links_to** | → | `links_to`(145) | 노트 간 위키링크 참조 |
| **connects_to** | → | `connects_to`(102) | 허브 간/도메인 간 연결 |
| **hub** | → | `hub`(28) | 개념→허브 소속 (zettelkasten 전용) |

### 정규화 매핑: 구조 관계

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **part_of** | A⊂B | `part_of`(229), `packaged_in`(1) | A는 B의 부분 |
| **contains** | A⊃B | `contains`(128), `includes`(11), `composed_of`(4) | A는 B를 포함 |
| **organizes** | → | `organizes`(112) | 허브가 하위 개념을 조직화 |
| **organized_by** | ← | `organized_by`(4) | organizes의 역방향 |
| **extends** | A→B | `extends`(107), `extends_to`(1) | A가 B를 확장/상세화 |
| **extended_by** | B→A | `extended_by`(1) | extends의 역방향 |
| **is_a** | A→B | `is_a`(3), `is_instance_of`(1) | A는 B의 인스턴스/유형 |
| **specializes** | A→B | `specializes`(2), `specializes_to`(1), `refines`(1) | A가 B를 특수화 |
| **generalizes** | A→B | `generalizes`(1), `subsumes`(1), `is_superset_of`(1) | A가 B를 일반화 |

### 정규화 매핑: 출처/파생 관계

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **derived_from** | A←B | `derived_from`(72), `based_on`(14), `from_source`(2), `sourced_from`(1), `created_from`(1), `origin`(1), `concept_from`(2) | A가 B에서 파생됨 |
| **references** | → | `references`(7), `mentions`(9), `discussed_in`(2), `referenced_by`(2) | 참조/인용 관계 |
| **explains** | → | `explains`(9), `explains_history`(1), `covers`(6) | 설명/해설 관계 |
| **explained_by** | ← | `explained_by`(1) | explains의 역방향 |

### 정규화 매핑: 유사/대비 관계

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **similar_to** | ↔ | `similar_to`(41), `analogous_to`(2), `similar_combination`(1), `mimics`(1) | 유사한 개념 |
| **different_from** | ↔ | `different_from`(13), `contrasts_with`(13), `opposite_of`(1), `structurally_different`(1) | 대비/차이 |
| **compared_with** | ↔ | `compared_with`(2), `compared_to`(1), `compare_with`(1) | 비교 관계 |
| **mathematically_related** | ↔ | `mathematically_related`(2) | 수학적 관계 (유지) |

### 정규화 매핑: 사용/의존 관계

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **uses** | A→B | `uses`(63), `used_with`(3), `used_in`(1), `used_for`(1), `works_with`(1), `consumes`(2) | A가 B를 사용 |
| **used_by** | A←B | `used_by`(89) | uses의 역방향 |
| **depends_on** | A→B | `depends_on`(26), `requires`(4), `prerequisite_for`(3) | A가 B에 의존 |
| **runs_on** | A→B | `runs_on`(3) | 플랫폼/런타임 의존 (유지) |
| **compatible_with** | ↔ | `compatible_with`(1) | 호환성 (유지) |

### 정규화 매핑: 코드 구조 관계 (RPG)

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **calls** | A→B | `calls`(94) + 16종 함수별 calls(55) | 함수 호출 |
| **called_by** | A←B | `called_by`(57) | calls의 역방향 |
| **data_flows_to** | A→B | `data_flows_to`(46) | 데이터 흐름 |
| **data_flows_from** | A←B | `data_flows_from`(5) | data_flows_to의 역방향 |
| **implements** | A→B | `implements`(35) | A가 B를 구현 |
| **implemented_by** | A←B | `implemented_by`(4) | implements의 역방향 |

**함수별 calls 상세** (RPG 파싱으로 생성, `{fn} calls` 패턴):
`add-tasks-to-project calls`(12), `create-project-with-api calls`(5), `create-task-api calls`(4), `create-subtask-api calls`(4), `get-auth-info calls`(4), `get-group-list-api calls`(3), `update-task-status-api calls`(2), `set-task-depth-api calls`(2), `move-task-to-group-api calls`(2), `create-task-with-api calls`(2), `create-single-task calls`(2), `create-project-api calls`(2), `create-group-api calls`(2), `close-all-lists calls`(2), `content-to-html calls`(2), `convert-tables calls`(1)
→ 이들은 `calls` canonical로 통합 가능하나, from/to entity에 함수명이 이미 있으므로 relation_type에 함수명이 중복 기록된 것.

### 정규화 매핑: 인과/영향 관계

| Canonical | 방향 | 원본 (건수) | 의미 |
|---|---|---|---|
| **enables** | A→B | `enables`(28), `supports`(2), `foundation_of`(5) | A가 B를 가능하게 함 |
| **enabled_by** | A←B | `enabled_by`(1) | enables의 역방향 |
| **causes** | A→B | `causes`(5), `leads_to`(2), `produces`(5), `triggers`(1) | A가 B를 야기 |
| **caused_by** | A←B | `caused_by`(4), `produced_by`(3), `result_of`(1) | causes의 역방향 |
| **prevents** | A→B | `prevents`(5), `mitigates`(15), `mitigates_by`(13), `reduces`(2), `addresses`(1), `solves`(2) | A가 B를 방지/완화 |
| **prevented_by** | A←B | `prevented_by`(1), `mitigated_by`(1), `reduced_by`(1) | prevents의 역방향 |

### 정규화 매핑: 기타 유지 관계

| Canonical | 건수 | 의미 | 비고 |
|---|---|---|---|
| **applies_to** | 5+4+2=11 | 적용 관계 | `applies_to`, `applied_in`, `applied_to` 통합 |
| **has_guide** | 5 | 가이드 연결 | zettelkasten 전용 |
| **challenged_by** | 5+1=6 | 비판/도전 | `challenged_by`, `questioned_by` 통합 |
| **critiques** | 1+1=2 | 비평 | `critiques`, `critiqued_by` |
| **follows** | 2+2=4 | 순서 | `follows`, `precedes` |
| **example_of** | 2+1+1=4 | 예시 | `example_of`, `example_in`, `example` 통합 |
| **bridges** | 2 | 연결/중재 | 유지 |
| **complements** | 2 | 보완 | 유지 |
| **demonstrates** | 1 | 시연 | 유지 |
| **evaluates** | 1 | 평가 | 유지 |
| **created_by** | 3 | 생성자 | 유지 |
| **affects** | 1 | 영향 | 유지 |
| **transforms** | 1 | 변환 | 유지 |
| **watches** | 1 | 관찰 | 유지 |
| **upstream** | 1 | 상위 흐름 | 유지 |
| **optimizes** | 2 | 최적화 | 유지 |
| **measured_by** | 2 | 측정 | 유지 |
| **tracked_by** | 1 | 추적 | 유지 |
| **provides** | 2 | 제공 | 유지 |
| **provides_interface** | 1 | 인터페이스 제공 | 유지 |
| **input_is** | 1 | 입력 | 유지 |
| **output_to** | 1 | 출력 | 유지 |
| **success_case** | 1 | 성공 사례 | 유지 |
| **modernized_by** | 1 | 현대화 | 유지 |
| **motivated_by** | 1+1=2 | 동기 | `motivated_by`, `motivates` |
| **modeled_as** | 1 | 모델링 | 유지 |
| **interpreted_by** | 1 | 해석 | 유지 |
| **compiled_by** | 1 | 컴파일 | 유지 |
| **executed_by** | 1+1=2 | 실행 | `executed_by`, `executes` |
| **alternative_to** | 1 | 대안 | `different_from`에 통합 가능 |
| **processed_by** | 1 | 처리 | 유지 |

## 정규화 효과 추정

### Before (현재)
- relation_type 종류: **172종**
- 노이즈 비율: **28종 (16.3%) / 38건 (1.6%)**
- 동의어 중복: ~50종이 ~25종으로 통합 가능

### After (정규화 후 예상)
- canonical relation_type: **~50종** (172 → 50, **71% 감소**)
  - 핵심 20종 (전체 관계의 92% 커버)
  - 기타 30종 (각 1-5건, 특수 관계)
- 노이즈 제거: 38건 삭제 또는 수정
- 함수별 calls 16종 → `calls` 1종 통합 (55건)

### 품질 지표
| 지표 | Before | After | 개선 |
|---|---|---|---|
| relation_type 종류 | 172 | ~50 | 71% 감소 |
| 노이즈 건수 | 38 | 0 | 100% 제거 |
| 동의어 그룹 | ~50쌍 | 0 | 완전 통합 |
| 연결 밀도 (linked%) | 85.6% | ~87% | 미미한 개선 |
| 정보 밀도 (의미있는 관계%) | 98.4% | 100% | 노이즈 제거 |

## KGGen 관점의 시사점

- [insight] KGGen의 동사 정규화 원칙이 그대로 적용됨 — relation_type도 종류가 제한적이라 규칙 기반으로 충분 #verb-normalization
- [insight] 노이즈의 원인은 마크다운 파서의 Relations 섹션 파싱 오류. 파서 개선이 근본 해결책 #parser-fix
- [insight] `{fn} calls` 패턴은 RPG 코드 문서화의 설계 문제. relation_type에 함수명을 넣지 않고 from/to로 충분 #rpg-design
- [insight] `relates_to`(478건)가 지배적 — "구체적 관계를 모를 때 기본값"으로 사용됨. 의미 없는 관계가 아니라 정제 필요 #default-relation
- [insight] entity 중복 제거(KGGen의 명사 통합)는 다음 단계. relation 정규화만으로도 71% 종류 감소 달성 #next-step
- [decision] 정규화 매핑 테이블을 DB UPDATE 스크립트로 변환하면 즉시 적용 가능 #actionable

## 다음 단계

1. 노이즈 38건의 원본 노트 확인 → 파서 오류 패턴 분석
2. 정규화 매핑 SQL UPDATE 스크립트 작성 (적용은 별도 승인)
3. `relates_to` 478건 정밀 분석 — 구체적 관계로 재분류 가능한지
4. Entity 중복 분석 (KGGen의 명사 통합 단계)

## Relations

- derived_from [[KGGen 이해 - 명사 통합과 동사 관계]] (동사 정규화 원칙 적용)
- relates_to [[Knowledge Graph (지식 그래프)]] (KG 품질 분석)
- relates_to [[Entity Resolution (엔티티 해결)]] (다음 단계 연결)
- relates_to [[Basic Memory 허브 (Basic Memory Hub)]] (분석 대상 시스템)
