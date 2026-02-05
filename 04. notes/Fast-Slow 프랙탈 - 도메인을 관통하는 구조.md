---
title: Fast-Slow 프랙탈 - 도메인을 관통하는 구조
type: note
tags:
- pattern
- framework
- derived
permalink: notes/fast-slow-fractal-domain-structure
source_facts:
- 시스템1-2 이중과정이론
- Engram 아키텍처 분석
- KGGen 지식 처리 구조
- 컴퓨터 메모리 계층
---

# Fast-Slow 프랙탈 - 도메인을 관통하는 구조

서로 다른 도메인(인지, AI, 컴퓨터, 생물학)에서 **Fast-Slow 이중 구조**가 반복되며, 이것이 "효율성-정확성 트레이드오프"를 해결하는 보편적 패턴이라는 도출.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **카너먼 시스템1/2** - 빠른 직관 vs 느린 숙고
   - 출처: [[시스템1-2와 기억 재구성]]

2. **Engram 아키텍처** - 해시 조회(O(1)) vs 신경망 추론
   - 출처: [[Engram과 지식 구조 - KGGen 비교]]

3. **KGGen 구조** - 벡터 유사도(빠름) vs LLM 검증(정확)
   - 출처: [[KGGen 이해 - 명사 통합과 동사 관계]]

4. **컴퓨터 메모리** - Cache(빠름) vs Main Memory(큼)
   - 출처: 컴퓨터 구조 기본 원리

→ 따라서: **이 패턴은 특정 도메인의 특수 해법이 아니라, 자원 제약 하에서 효율성과 정확성을 동시에 추구하는 보편적 구조다**

## 도메인별 비교

| 도메인 | Fast (빠름/저렴) | Slow (느림/정확) |
|--------|-----------------|-----------------|
| 인간 사고 | 시스템1 | 시스템2 |
| AI 아키텍처 | Engram 해시 조회 | 신경망 추론 |
| 지식 처리 | KGGen 벡터 유사도 | LLM 검증 |
| 컴퓨터 | Cache | Main Memory |
| 3계층 메모리 | Knowledge Cache | LTM 검색 |

## Observations

- [fact] 이중과정이론(카너먼)은 이 프랙탈의 한 인스턴스일 뿐, 패턴 자체가 더 근본적 #meta
- [fact] 전통적 프랙탈은 스케일만 다르고, 도메인 프랙탈은 구현 레벨(생물학→소프트웨어→하드웨어)만 다름 #definition
- [method] Fast → Threshold 판단 → (신뢰도 낮으면) Slow 전환의 공통 메커니즘 #mechanism
- [example] 조직 구조: 현장 판단(Fast) vs 본사 검토(Slow) #application
- [example] 경제: 직관적 소비(Fast) vs 분석적 투자(Slow) #application
- [example] 면역: 선천 면역(Fast) vs 적응 면역(Slow) #application
- [question] 왜 반복되나? → 물리적 제약(에너지/시간/자원 유한) + 최적화 압력 #why
- [question] 실패 케이스? → 시스템1 오류, 정적 지식 구식화, Threshold 오설정 #limitation

## Relations

- derived_from [[시스템1-2와 기억 재구성]] (이중과정 구조)
- derived_from [[Engram과 지식 구조 - KGGen 비교]] (AI 아키텍처 사례)
- derived_from [[KGGen 이해 - 명사 통합과 동사 관계]] (지식 처리 사례)
- provides_context [[심볼릭 AI vs 커넥셔니스트 AI 역사]] (역사적 배경)
- implements [[Three-Layer Memory Architecture]] (구현 사례)

---

**도출일**: 2026-01-20
**출처**: 시스템1/2, KGGen, Engram, Cache/Memory 비교에서 공통 패턴 추출
