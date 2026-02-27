---
title: KV 캐시 압축과 선택적 주의는 같은 최적화 문제를 푼다
type: note
permalink: 04.-notes/kv-kaesi-abcuggwa-seontaegjeog-juyineun-gateun-coejeoghwa-munjereul-punda
tags:
- kv-cache
- attention
- selective-attention
- cognition
- memory-hierarchy
- compression
- derived
---

# KV 캐시 압축과 선택적 주의는 같은 최적화 문제를 푼다

KV 캐시의 Attention Matching과 인간의 선택적 주의는 둘 다 "제한된 용량에서 관련성 기준으로 보존 대상을 결정"하는 동일한 최적화 문제를 풀고 있다. 이것은 비유가 아니라 구조적 대응이다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **Attention Matching은 compact KV가 원본과 동일한 attention 출력을 재현하도록 closed-form 해로 맞춘다** — 60k→1.2k tokens(50x 압축)에서도 "모델 입장에서 같은 결과"를 보장. 핵심은 Key Selection(어떤 K를 보존할 것인가) + Value Fitting(보존된 K에 맞는 V 재계산)
2. **KV 캐시의 적응형 전략은 메모리 제약에 따라 전체/슬라이딩/희소 캐시를 선택한다** — 짧은 시퀀스는 전체 보존, 긴 시퀀스는 "중요한 것만" 보존. 용량 제약이 선택을 강제
3. **메모리는 속도 vs 용량의 트레이드오프이며 계층 구조를 형성한다** — CPU 캐시(극고속, 극소)→RAM(고속, 중)→SSD(저속, 대). 상위 계층일수록 빠르지만 작아서 "무엇을 올릴 것인가" 선택이 필수
4. **시스템1은 자동적, 병렬적 패턴 매칭이며 선택적 주의로 관련 자극만 working memory에 유지한다** — 인간도 감각 입력의 극소 부분만 의식적 처리로 올림. 무관한 자극은 자동 필터링
5. **Cognitive Load는 Working Memory의 제한된 용량에서 발생하는 정신적 부담이다** — 정보가 용량을 초과하면 처리 능력 저하. LLM의 Lost-in-Middle도 같은 구조

→ 따라서: **KV 캐시 압축에서 "어떤 Key를 보존할 것인가"와 인간 선택적 주의에서 "어떤 자극을 working memory에 올릴 것인가"는 정확히 같은 문제다. 둘 다 용량 제약 아래서 관련성(attention score / 생존 가치)을 기준으로 보존 대상을 결정한다. Attention Matching의 Key Selection ≈ 선택적 주의의 관련성 필터, KV eviction policy ≈ 망각(forgetting)이라는 구조적 대응이 성립한다.**

## Observations

- [fact] KV 캐시의 Key Selection과 인간의 선택적 주의는 같은 최적화 문제의 두 구현이다: 제한된 용량에서 관련성 기준으로 보존 대상 결정 #kv-cache #selective-attention
- [fact] Attention Matching은 60k→1.2k(50x) 압축에서도 원본과 동일한 attention 출력을 보장한다 #attention-matching #compression
- [fact] 인간 선택적 주의는 감각 입력의 극소 부분만 working memory로 올린다 — 칵테일 파티 효과 #selective-attention
- [fact] 두 시스템 모두 용량 초과 시 품질이 저하된다: LLM은 Lost-in-Middle, 인간은 Cognitive Load #capacity-limit
- [fact] KV eviction policy ≈ 인간의 망각: 둘 다 "오래되고 관련 없는 것부터 버린다"는 전략을 사용 #forgetting #eviction
- [example] KV 캐시 적응형 전략(전체→슬라이딩→희소)은 인간 주의력 전략(집중→분산→선택적)과 용량 제약에 따른 대응이 유사하다 #adaptive-strategy
- [question] KV 캐시의 head별 nonuniform budget은 인간 주의력의 도메인별 편향과 대응하는가 #open

## Relations

- derived_from [[Attention Matching]] (KV 캐시 압축의 구체적 기법과 Key Selection 메커니즘)
- derived_from [[kv-cache-optimization]] (KV 캐시의 적응형 전략과 용량-속도 트레이드오프)
- derived_from [[Cognitive Load (인지 부하)]] (Working Memory 용량 제한과 정신적 부담)
- derived_from [[시스템1-2와 기억 재구성]] (시스템1의 자동적 패턴 매칭과 선택적 주의)
- derived_from [[computer-memory-hierarchy]] (메모리 계층의 속도-용량 트레이드오프)
- extends [[의도적 정보 손실이 지능이다 — 압축은 창발의 의도적 버전]] (정보 손실의 의도적 양상의 구체적 사례)
- hub [[메모리 시스템 (Memory Systems)]]
- hub [[Fast-Slow 인지 패턴 (Fast-Slow Cognition)]]
- hub [[컨텍스트-메모리 통합 (Context-Memory Integration)]]

---

**도출일**: 2026-02-27
**출처**: Attention Matching 논문 + KV 캐시 최적화 + 인지 부하 이론 + 선택적 주의 종합