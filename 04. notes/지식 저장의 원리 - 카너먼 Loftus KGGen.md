---
title: 지식 저장의 원리 - 카너먼 Loftus KGGen
type: note
tags:
- knowledge-management
- methodology
- memory
- derived
permalink: notes/knowledge-storage-principles
source_facts:
- 시스템1-2와 기억 재구성
- KGGen 지식 처리 방식
- Loftus 기억 연구
---

# 지식 저장의 원리 - 카너먼 Loftus KGGen

인간 기억의 한계를 극복하는 지식 저장 4원칙: 맥락, 출처, 관계, 해석 분리.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **시스템1은 감정과 사실을 섞는다** - 출처 없이 저장하면 재구성됨
2. **기억은 6개월 후 "가짜 기억"으로 대체될 수 있다** - Loftus 연구
3. **KGGen은 명시적 관계와 검증으로 지식을 처리한다** - 확증편향 방지

→ 따라서: **지식 저장 4원칙**
1. **맥락**: 왜 찾았는지 기록 → "왜 이걸 저장했지?" 방지
2. **사실 + 출처**: 출처 없는 사실은 시스템1의 착각일 수 있음
3. **관계**: 명시적 연결 (KGGen처럼 동사로)
4. **해석 분리**: 사실과 내 생각을 구분

→ 핵심 통찰: **"미래의 나는 바보다"** — 지금 확신하는 것도 재구성될 수 있다.

## Observations

- [fact] 감정(시스템1)과 사실이 섞이면 출처가 사라진다 #memory
- [fact] 3개월 후 "이거 어디서 봤더라?" 현상이 발생한다 #forgetting
- [fact] 6개월 후 시스템1이 재구성한 가짜 기억으로 대체된다 #loftus
- [fact] 인간 기억은 감정 강도로 인덱싱하고 자동 연상으로 연결한다 #memory
- [fact] 인간 기억에는 검증 단계가 없다 (확증편향) #bias
- [fact] KGGen은 벡터 유사도로 인덱싱하고 명시적 관계로 연결한다 #kggen
- [fact] KGGen은 LLM으로 "같은 것인가?" 검증한다 #kggen
- [method] 명사(노드)는 벡터 임베딩으로 유사성 파악 후 통합 #kggen
- [method] 동사(관계)는 규칙 기반 정규화로 명시적 연결 #kggen
- [method] 맥락 기록 → 출처 명시 → 관계 연결 → 해석 분리 #workflow
- [example] 인간: 감정 강도 인덱싱 vs KGGen: 벡터 유사도 #comparison

## Relations

- derived_from [[시스템1-2와 기억 재구성]] (기억의 한계에서 도출)
- derived_from [[KGGen 이해 - 명사 통합과 동사 관계]] (해결 방법에서 도출)
- applies_to [[research-note-template]] (이 원칙의 실용적 적용)
- mitigates [[기억 재구성]] (가짜 기억 문제 완화)

---

**도출일**: 2026-01-20
**출처**: 카너먼 시스템1/2 + Loftus 기억 연구 + KGGen 방법론 조합