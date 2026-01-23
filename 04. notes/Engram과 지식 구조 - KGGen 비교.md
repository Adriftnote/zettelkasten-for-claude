---
title: Engram과 지식 구조 - KGGen 비교
date: 2026-01-20
tags:
- research
- AI-architecture
- knowledge-management
permalink: notes/engramgwa-jisig-gujo-kggen-bigyo-1
---

# Engram과 지식 구조 - KGGen 비교

## 맥락

**왜 찾았나**: 딥시크의 새 아키텍처 Engram이 지식 저장/호출에서 기존과 뭐가 다른지 궁금해서. 우리가 논의한 시스템1/2, KGGen과 어떻게 연결되는지 보려고.


## 사실

### 1. Engram의 핵심 구조
정적 지식 저장 ↔ 동적 추론 분리
- 정적: 시스템 RAM에 해시 테이블로 저장, O(1) 조회
- 동적: GPU에서 신경망 추론
- 최적 비율: 75% 추론 / 25% 정적 조회
- 출처: [DeepSeek Engram - Introl Blog](https://introl.com/blog/deepseek-engram-conditional-memory-architecture-january-2026)

### 2. 성능 개선
- 장문맥 정확도: 84.2% → 97%
- 추론 벤치마크: 70% → 74%
- 지식 벤치마크: 57% → 61%
- 출처: [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/deepseek-touts-memory-breakthrough-engram)

### 3. 역사적 의미
Engram은 50년 만에 심볼릭과 커넥셔니스트 AI를 결합
- 배경: [[심볼릭 AI vs 커넥셔니스트 AI 역사]]
- 출처: [Medium - 50-Year-Old AI Idea](https://medium.com/@ljingshan6/deepseeks-engram-architecture-resurrects-a-50-year-old-ai-idea-and-it-actually-works-02c62a9ac1cb)

### 4. KGGen vs Engram 차이
| | KGGen | Engram |
|---|-------|--------|
| 목적 | 지식 정리 (도서관) | 뇌 구조 설계 |
| 정적 | 명사 (임베딩) | 사실 (해시) |
| 동적 | 동사 (규칙) | 관계/추론 (신경망) |
| 관계 | 명시적, 고정 | 맥락 의존적, 유동 |
- 출처: 대화 중 도출


## Relations

- similar_to [[시스템1-2와 기억 재구성]]
- compared_to [[KGGen 이해 - 명사 통합과 동사 관계]]
- extends [[지식 저장의 원리 - 카너먼 Loftus KGGen]]


## 내 해석

> ⚠️ 2026-01-20 시점의 생각

세 가지가 같은 패턴:

| | 정적/빠름 | 동적/느림 |
|---|----------|----------|
| 카너먼 | 시스템1 | 시스템2 |
| KGGen | 명사 | 동사 |
| Engram | 사실 | 관계/추론 |

**Obsidian vault는 하이브리드:**
- 노트 내용 = Engram처럼 (동적, 맥락 의존)
- 노트 간 링크 = KGGen처럼 (정적, 명시적 관계)

용도에 따라 다르게 작동한다.