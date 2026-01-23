---
title: Contextual Retrieval
type: concept
tags:
  - rag
  - search
  - anthropic
  - embedding
  - context-engineering
permalink: knowledge/concepts/contextual-retrieval
category: RAG / Information Retrieval
difficulty: 중급
---

# Contextual Retrieval

Anthropic이 제안한 **청크 검색 개선 기법**으로, 각 청크에 맥락 설명을 추가하여 검색 정확도를 높입니다.

## 📖 개요

RAG(Retrieval-Augmented Generation)에서 문서를 청크로 쪼개면 **맥락이 사라지는 문제**가 발생합니다. Contextual Retrieval은 LLM을 사용해 각 청크 앞에 맥락 설명을 붙여 이 문제를 해결합니다.

## 🎭 비유

책을 찢어서 한 페이지만 보면 무슨 내용인지 모릅니다.
Contextual Retrieval은 각 페이지 상단에 **"이 페이지는 3장 '마케팅 전략'의 일부로..."** 라는 메모를 붙이는 것과 같습니다.

## ⚠️ 문제: 맥락 손실

```
원본 문서:
"ACME사 2023년 2분기 실적 보고서
...
전분기 매출: $314M
...
매출이 3% 증가했다"

청크로 쪼갠 후:
"매출이 3% 증가했다"  ← 뭐가 3% 증가? 언제? 어디서?
```

## ✅ 해결책: 맥락 추가

LLM이 각 청크에 맥락 설명을 생성합니다:

```
컨텍스트화된 청크:
"[ACME사 2023 Q2 보고서. 전분기 매출 $314M 기준.]
매출이 3% 증가했다"
```

## 🔀 하이브리드 검색

**Contextual Embeddings + Contextual BM25**를 결합하면:

| 방식 | 검색 실패율 감소 |
|------|-----------------|
| Contextual Embeddings만 | 35% |
| Contextual BM25만 | 30% |
| **하이브리드** | **49~67%** |

두 방식의 장점을 결합:
- BM25: 정확한 키워드 매칭
- 벡터 검색: 의미적 유사성

## 💡 구현 포인트

1. **프롬프트 설계**: 청크와 전체 문서를 LLM에 제공
2. **맥락 생성**: "이 청크는 [문서명]의 [섹션]에서 [주제]를 다룹니다"
3. **캐싱**: 같은 문서의 청크는 문서 맥락을 재사용 (토큰 절약)

## Relations

- used_by [[BM25]]
- implements [[TF-IDF]]

---

**난이도**: 중급
**카테고리**: RAG / Information Retrieval
**마지막 업데이트**: 2026년 1월
**출처**: Anthropic Blog - "Introducing Contextual Retrieval"
