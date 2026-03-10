---
title: RPG-Encoder 논문 리뷰
type: paper-review
permalink: sources/reference/rpg-encoder
tags:
- code-understanding
- repository-agent
- graph-representation
- microsoft-research
date: 2026-02-05
---

# RPG-Encoder 논문 리뷰

코드 레포지토리를 의미+구조 그래프(RPG)로 인코딩하여 AI가 코드베이스를 체계적으로 이해하게 만드는 기술

## 📖 핵심 아이디어

기존 레포 에이전트들이 API 문서나 의존성 그래프 같은 단편적 표현에 의존해 추론 단절 문제를 겪는다. RPG-Encoder는 코드 이해(comprehension)와 생성(generation)을 역과정으로 보고, 기존 코드에서 RPG(Repository Planning Graph)를 자동 추출하는 인코더를 제안한다. "생성은 의도→구현 확장, 이해는 구현→의도 압축"이라는 관점.

## 🛠️ 구성 요소 / 주요 내용

| 구성요소 | 설명 |
|---------|------|
| RPG 노드 (고수준) | 아키텍처 디렉토리 표현 |
| RPG 노드 (저수준) | 파일, 클래스, 함수 등 원자적 구현 |
| 기능 엣지 | 기능적 계층 구조 연결 |
| 의존성 엣지 | 코드 의존성 연결 |
| SearchNode | 의도 기반 전역 검색 도구 |
| FetchNode | 노드별 데이터/소스 코드 추출 도구 |
| ExploreRPG | 교차 관점 순회 도구 |

### 3가지 핵심 메커니즘

| 메커니즘 | 설명 | 효과 |
|---------|------|------|
| 인코딩 | Semantic Lifting → Architecture Recovery → Artifact Grounding | 코드→RPG 변환 |
| 진화 | 커밋 diff 파싱으로 증분 업데이트 | 95.7% 오버헤드 감소 |
| 운영 | SearchNode, FetchNode, ExploreRPG | 구조 인식 추론 |

## 🔧 작동 방식 / 적용 방법

```
[Phase 1] Semantic Lifting
          코드 엔티티 → 원자적 의미 특징 변환

[Phase 2] Latent Architecture Recovery  
          3단계 계층 구조로 조직화

[Phase 3] Artifact Grounding
          추상 구조 → 물리적 디렉토리 연결

[Phase 4] Incremental Maintenance
          커밋 레벨 특징 추출 (토큰 95.7% 감소)
```

### 기존 RPG vs RPG-Encoder

```
기존 RPG:    의도 → 코드 (생성 전용, 한 방향)
RPG-Encoder: 코드 ↔ 의도 (이해+생성, 양방향)
```

## 💡 실용적 평가 / 적용

### 성능 결과

| 벤치마크 | 모델 | 결과 | 개선폭 |
|---------|------|------|--------|
| SWE-bench Verified | Claude-4.5-Sonnet | 93.7% Acc@5 | +14.4% |
| SWE-bench Live | GPT-5 | 87.8% Acc@5 | +11.6% |
| RepoCraft | GPT-5-mini | 98.5% 커버리지 | +24.3% |

### 핵심 발견

- 의미론 + 위상 구조 = 시너지 (둘 다 필수)
- 증분 유지보수로 대규모 레포에서도 효율적
- 의미론 제거 시 50.5% → 43.1% 성능 하락

### 적용 가능 모델

o3-mini, GPT-4o, GPT-4.1, GPT-5, DeepSeek-V3.1, Claude-4.5-Sonnet

## 🔗 관련 개념

- [[Knowledge Graph (지식 그래프)]] - RPG는 코드 특화 지식 그래프
- [[Code Understanding]] - 코드 이해 태스크
- [[SWE-bench]] - 소프트웨어 엔지니어링 벤치마크
- [[AST (Abstract Syntax Tree)]] - 추상 구문 트리, 의존성 엣지 추출에 사용

---

**작성일**: 2026-02-05
**분류**: AI/ML 논문
**출처**: Microsoft Research Asia, UCSD, Tsinghua University
**arXiv**: https://arxiv.org/abs/2602.02084
**GitHub**: https://github.com/microsoft/RPG-ZeroRepo