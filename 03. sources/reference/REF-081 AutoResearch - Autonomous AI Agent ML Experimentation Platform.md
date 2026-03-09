---
title: REF-081 AutoResearch - Autonomous AI Agent ML Experimentation Platform
type: doc-summary
permalink: sources/reference/autoresearch-autonomous-ml-experimentation
tags:
- ai-agent
- ml-experimentation
- karpathy
- autonomous-agent
- gpt
- research
date: 2026-03-09
---

# AutoResearch - Autonomous AI Agent ML Experimentation Platform

AI 에이전트가 밤새 자율적으로 ML 실험을 수행하는 플랫폼. Andrej Karpathy 제작. 에이전트가 코드를 수정하고, 학습시키고, 평가하고, 개선을 반복한다.

## 📖 핵심 아이디어

"AI 에이전트에게 작지만 실제 LLM 학습 환경을 주고 밤새 자율 실험하게 한다." 에이전트는 `train.py` 하나만 수정하며, 5분 고정 학습 → 결과 평가 → 개선/폐기를 반복한다. 시간당 ~12회, 하룻밤에 ~100회 실험 가능.

핵심 설계 철학은 **제약을 통한 자유**: 수정 범위를 단일 파일로, 학습 시간을 5분으로, 평가 지표를 하나로 고정함으로써 에이전트가 실질적인 아키텍처 실험에 집중하게 만든다.

## 🛠️ 구성 요소 / 주요 내용

| 항목             | 설명                                                                     |
| -------------- | ---------------------------------------------------------------------- |
| **prepare.py** | 불변 상수. 데이터 준비, 토크나이저 학습, 데이터로더, 평가 유틸리티                                |
| **train.py**   | 에이전트가 수정하는 유일한 파일. GPT 모델 + 옵티마이저 + 학습 루프 전체 포함                        |
| **program.md** | 에이전트에게 주는 마크다운 지시서. 인간이 편집하여 연구 방향 설정                                  |
| **val_bpb**    | 검증 지표 (validation bits per byte). 낮을수록 개선. 어휘 크기 독립적 → 아키텍처 변경 간 공정 비교 |
| **5분 고정 학습**   | 하드웨어 무관 동일 시간. H100에서 시간당 ~12회 실험                                      |
|                |                                                                        |

## 🔧 작동 방식

```
[program.md] ──지시──▶ [AI 에이전트]
                           │
                    train.py 수정 (diff)
                           │
                           ▼
                    [5분 학습 실행]
                           │
                    val_bpb 평가
                           │
                     ┌─────┴─────┐
                     ▼           ▼
                 개선됨        악화됨
                 (유지)        (폐기)
                     │           │
                     └─────┬─────┘
                           ▼
                      다음 실험 반복
                    (~12회/시간, ~100회/밤)
```

**설계 원칙:**
1. **Constrained Scope** — `train.py`만 수정 → 리뷰 가능한 diff
2. **Fixed Time Budget** — 5분 고정 → 하드웨어 무관 공정 비교
3. **Self-Contained** — PyTorch 외 최소 의존성, 단일 GPU, 단일 지표
4. **Fair Comparison** — vocab-size-independent bpb → 아키텍처 변경도 직접 비교 가능

## 💡 실용적 평가

**장점:**
- 극도로 단순한 구조 (파일 3개)로 복잡한 자율 실험 실현
- "제약이 곧 자유" 패턴 — 에이전트의 행동 공간을 좁혀 실질적 탐색 유도
- `program.md`로 연구 방향 조종 → 인간-에이전트 협업 인터페이스
- 시간 기반 고정 예산으로 실험 간 공정성 보장

**한계:**
- NVIDIA GPU 전용 (H100 테스트). macOS/MLX는 커뮤니티 포크
- 소규모 GPT에 한정 — 대규모 모델 실험에는 시간 예산 재설계 필요
- 단일 지표(val_bpb)만으로는 다양한 품질 차원 포착 어려움

**설계 패턴으로서의 가치:**
- "파일 하나만 수정 + 고정 시간 + 단일 지표" 패턴은 다른 자율 에이전트 시스템에도 적용 가능
- `program.md` = 에이전트에 대한 자연어 인터페이스 패턴 (CLAUDE.md와 유사한 역할)

## 🔗 관련 개념

- [[A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory)]] - (둘 다 LLM 에이전트 자율성을 다루지만, A-Mem은 메모리 관리, AutoResearch는 실험 자동화라는 다른 자율성 축)
- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (ALMA는 메모리 설계를 자동화, AutoResearch는 모델 학습을 자동화 — "메타 수준 자동화"라는 공통 접근)

---

**작성일**: 2026-03-09
**분류**: AI Agent / ML Experimentation
**출처**: https://github.com/karpathy/autoresearch