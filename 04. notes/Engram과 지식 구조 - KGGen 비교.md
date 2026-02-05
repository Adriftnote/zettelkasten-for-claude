---
title: Engram과 지식 구조 - KGGen 비교
type: note
tags:
- AI-architecture
- knowledge-management
- derived
permalink: notes/engram-knowledge-structure-kggen-comparison
source_facts:
- Engram 아키텍처 분석
- KGGen 구조 이해
- 시스템1-2 이론
---

# Engram과 지식 구조 - KGGen 비교

딥시크의 Engram 아키텍처와 KGGen, 카너먼의 시스템1/2가 **정적-동적 분리**라는 동일한 패턴을 공유한다는 도출.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **Engram 아키텍처** - 정적 지식(해시 테이블, O(1))과 동적 추론(GPU 신경망)을 75:25로 분리
   - 출처: [DeepSeek Engram - Introl Blog](https://introl.com/blog/deepseek-engram-conditional-memory-architecture-january-2026)

2. **KGGen 구조** - 명사(임베딩, 정적)와 동사(규칙, 동적)로 지식을 분리
   - 출처: [[KGGen 이해 - 명사 통합과 동사 관계]]

3. **카너먼 시스템1/2** - 빠른 직관(시스템1)과 느린 숙고(시스템2)의 이중 처리
   - 출처: [[시스템1-2와 기억 재구성]]

→ 따라서: **세 가지 모두 "정적/빠름 vs 동적/느림" 패턴을 공유하며, 이는 효율적 지식 처리의 보편적 구조일 수 있다**

## 정적/동적 비교

| | 정적/빠름 | 동적/느림 |
|---|----------|----------|
| 카너먼 | 시스템1 | 시스템2 |
| KGGen | 명사 | 동사 |
| Engram | 사실 | 관계/추론 |

## Observations

- [fact] Engram은 50년 만에 심볼릭과 커넥셔니스트 AI를 결합한 첫 사례 #AI-history
- [fact] Engram 성능: 장문맥 정확도 84.2%→97%, 추론 70%→74%, 지식 57%→61% #benchmark
- [method] 정적/동적 비교표로 세 이론의 공통점 시각화 #comparison
- [example] Obsidian vault는 하이브리드: 노트 내용(동적, 맥락 의존) + 노트 간 링크(정적, 명시적 관계) #application
- [reference] 역사적 배경: [[심볼릭 AI vs 커넥셔니스트 AI 역사]] #context
- [reference] Engram 출처: DeepSeek Engram - Introl Blog (2026-01) #source

## Relations

- derived_from [[시스템1-2와 기억 재구성]] (정적/동적 이중 처리 개념)
- derived_from [[KGGen 이해 - 명사 통합과 동사 관계]] (명사/동사 분리 구조)
- derived_from [[지식 저장의 원리 - 카너먼 Loftus KGGen]] (지식 저장 원리 통합)

---

**도출일**: 2026-01-20
**출처**: Engram 아키텍처 분석 + KGGen/시스템1-2 기존 지식 조합
