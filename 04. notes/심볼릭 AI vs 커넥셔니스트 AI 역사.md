---
title: 심볼릭 AI vs 커넥셔니스트 AI 역사
type: note
tags:
- AI-history
- symbolic-ai
- connectionist
- derived
permalink: notes/symbolic-vs-connectionist-ai-history
source_facts:
- 심볼릭 AI 역사
- 커넥셔니스트 AI 역사
- Engram 아키텍처
---

# 심볼릭 AI vs 커넥셔니스트 AI 역사

심볼릭 AI의 패배 원인과 Engram의 "50년 만의 결합"이 가능해진 이유.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **심볼릭 AI는 빠르고 설명 가능했다** - 규칙 테이블 조회, O(1)
2. **심볼릭 AI는 수작업 확장이 불가능했다** - 모든 규칙을 사람이 입력
3. **커넥셔니스트 AI는 데이터로 자동 학습한다** - 확장 가능

→ 따라서: **"조회가 틀린 게 아니라 확장이 안 됐다"**
→ 해결책: 조회(심볼릭) + 자동 구축(커넥셔니스트) = Engram

## Observations

- [fact] 심볼릭 AI는 지식을 규칙으로 표현하고 논리로 추론한다 #symbolic
- [fact] 심볼릭 AI의 조회는 정확하고 빠르다 (규칙 테이블 검색) #symbolic
- [fact] 심볼릭 AI는 모든 규칙을 사람이 수작업으로 입력해야 한다 #limitation
- [fact] 세상의 복잡성과 예외를 규칙으로 표현 불가능하다 #limitation
- [fact] 커넥셔니스트 AI는 신경망이 데이터에서 패턴을 학습한다 #connectionist
- [fact] 커넥셔니스트는 데이터만 더 주면 성능이 향상된다 #scalability
- [fact] 커넥셔니스트는 매번 신경망 연산이 필요하다 (느림, 비쌈) #limitation
- [example] IF 고양이 THEN 동물 → 논리 추론 (심볼릭) #symbolic
- [example] 수백만 문장 → "고양이-동물" 연결 발견 (커넥셔니스트) #connectionist
- [example] 박쥐는 동물인데 날개가 있다 - 예외 처리 어려움 #edge-case
- [decision] 1980년대 후반: 심볼릭 AI 몰락 (AI 겨울) #history
- [decision] 2010년대: 커넥셔니스트 AI 승리 (딥러닝 혁명) #history
- [method] Engram: 심볼릭의 빠른 조회 + 커넥셔니스트의 자동 구축 #hybrid
- [reference] Medium - Engram 50-Year-Old AI Idea #source

## Relations

- similar_combination [[KGGen 이해 - 명사 통합과 동사 관계]] (유사한 결합 접근)

---

**도출일**: 2026-01-20
**출처**: AI 역사 + Engram 아키텍처 분석