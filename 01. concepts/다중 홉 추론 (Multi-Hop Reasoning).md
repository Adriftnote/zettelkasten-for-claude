---
title: 다중 홉 추론 (Multi-Hop Reasoning)
type: concept
permalink: knowledge/concepts/multi-hop-reasoning
tags:
- 정보검색
- 지식그래프
- AI
category: AI
difficulty: 중급
---

# 다중 홉 추론 (Multi-Hop Reasoning)

여러 지식 노드 사이의 관계를 연쇄적으로 탐색해야 답에 도달하는 추론 방식

## 📖 개요

홉(hop)은 두 지식 노드 사이의 관계(relation) 하나를 건너뛰는 단위다. 단일 홉으로 답이 나오지 않는 질문은, 중간 지식을 거쳐 여러 홉을 연쇄적으로 탐색해야 한다. 네트워크 용어에서 유래했으며, 지식 그래프에서 노드 간 경로 탐색과 동일한 구조를 가진다.

## 🎭 비유

위키피디아 서핑과 같다. "아인슈타인이 졸업한 대학의 현재 총장은?" 이라는 질문에 답하려면, 아인슈타인 문서에서 대학 링크를 클릭하고(홉 1), 그 대학 문서에서 총장 정보를 찾아야 한다(홉 2). 한 페이지에서 답이 나오지 않고 링크를 타고 넘어가야 하는 것이 다중 홉이다.

## ✨ 특징

- 홉 수 = 질문의 탐색 복잡도 (2홉, 3홉, 4홉...)
- 각 홉은 사실 조회(fact retrieval)이므로, 홉이 많아도 본질은 팩트 체인이다
- 제텔카스텐의 위키링크 하나가 곧 홉 하나에 대응한다
- 다중 홉 QA 벤치마크: HotpotQA(2홉), 2WikiMultiHopQA(2홉), MuSiQue(2~4홉)

## 💡 예시

```
단일 홉: "한국의 수도는?" → 서울 (검색 1회)

다중 홉: "한국 수도에 있는 가장 오래된 대학의 설립자는?"
  홉 1: 한국 수도 → 서울
  홉 2: 서울의 가장 오래된 대학 → 성균관대학교
  홉 3: 성균관대학교 설립자 → 조선 태조
```

## Relations

- relates_to [[QDMR (Question Decomposition Meaning Representation)]] (복잡한 질문을 분해하는 방법론)
- relates_to [[REF-064 Search-R1++ Deep Research Agent RL Training]] (다중 홉 QA 벤치마크로 검색 에이전트 평가)