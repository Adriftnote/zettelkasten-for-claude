---
title: REF-109 Thinking to Recall — 추론이 LLM 파라메트릭 지식 회상을 확장하는 메커니즘
type: note
permalink: zettelkasten/03.-sources/reference/ref-109-thinking-to-recall-curoni-llm-parameteurig-jisig-hoesangeul-hwagjanghaneun-mekeonijeum
date: '2026-03-13'
tags:
- LLM
- reasoning
- parametric-knowledge
- factual-priming
- hallucination
- pass-at-k
---

# Thinking to Recall — 추론이 LLM 파라메트릭 지식 회상을 확장하는 메커니즘

> 단순 사실 질문에서도 추론이 도움되는 이유: 계산 버퍼(content-independent) + 사실 프라이밍(content-dependent) 두 메커니즘이 잠재 지식을 끌어낸다.

## 📖 핵심 아이디어

"네팔의 10번째 왕은 누구?" 같은 단순 사실 질문은 논리적 분해가 필요 없는데도 추론 모드(thinking ON)에서 정답률이 크게 오른다. 왜? 이 논문은 두 메커니즘을 분리 검증한다: (1) **계산 버퍼** — 추론 토큰이 의미 없는 더미여도 추가 연산 기회를 제공해 성능 향상 (하지만 상한 있음), (2) **사실 프라이밍** — 관련 사실을 생성하면서 의미적 다리를 놓아 정답 회상을 촉진 (주된 효과). 단, 중간 추론에서 환각된 사실이 최종 답 환각 확률을 높이는 양날의 검.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| 모델 | Gemini-2.5-Flash/Pro, Qwen3-32B (추론 ON/OFF 토글 가능) |
| 데이터셋 | SimpleQA-Verified (1,000), EntityQuestions (1,000) |
| 핵심 지표 | pass@k — 능력 경계(capability boundary) 측정 |
| Ω (오메가) | 추론 효과 정량화 지표 (pass@k 이득) |
| 사실 추출 | LLM으로 추론 트레이스에서 사실 추출 → 질문/답 관련 필터링 |
| 환각 검증 | Gemini-2.5-Flash + 웹검색 (~100% 정확도) |

## 🔧 작동 방식 / 적용 방법

```
추론이 파라메트릭 회상을 돕는 두 경로
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

경로 1: 계산 버퍼 (Content-Independent)
  질문 → [더미 토큰 2048개] → 답
  효과: 추가 연산 기회 → 성능 ↑ (상한 있음)
  증거: 더미 시퀀스도 성능 향상, but 진짜 추론에 못 미침
  스케일링: ~2048 토큰까지 향상 → 이후 하락 (비단조)

경로 2: 사실 프라이밍 (Content-Dependent)
  질문 → [1번째 왕은 X, 2번째는 Y, ... 9번째는 Z] → 10번째 왕 = 정답
  효과: 의미적 활성화 확산 → 정답 회상 촉진 (주된 효과)
  증거: 추출된 사실만 제공해도(추론 OFF) 대부분의 pass@k 이득 회복
  인지과학 대응: Collins & Loftus (1975) 의미 네트워크 활성화

위험: 환각 전파
  추론 트레이스에 환각 사실 포함 → 최종 답 환각 확률 ↑
  Clean trace 정답률: 41.4% (SimpleQA) / 71.1% (Entity)
  Hallucinated trace:   26.4% (SimpleQA) / 32.2% (Entity)
```

**실용적 개선 (테스트 타임 선택):**

| 전략 | SimpleQA 향상 | EntityQ 향상 |
|------|-------------|-------------|
| Only Facts (사실 포함 트레이스만) | +8.2% | +2.6% |
| Only Correct Facts (환각 없는 트레이스만) | **+12.2%** | **+5.1%** |

## 💡 실용적 평가 / 적용

**핵심 인사이트:**
- 질문 복잡도는 추론 이득의 나쁜 예측자 — 단순 질문에서도 추론이 크게 도움
- 덜 능력 있는 모델이 추론에서 더 많이 이득 → "숨겨진 지식"이 더 많다는 의미
- 사실 프라이밍이 주된 메커니즘 → 중간 사실의 품질이 최종 답 품질을 결정
- process reward로 중간 사실의 정확성에 보상하면 환각을 줄이면서 회상을 강화할 수 있음

**우리 맥락에서의 시사점:**
- 에이전트가 "생각하면서" 관련 사실을 떠올리는 과정 자체가 검색 성능을 높임 → basic-memory 검색 시 관련 컨텍스트를 먼저 빌드하는 2단계 전략(build_context → read_note)과 동일한 원리
- 중간 추론의 환각이 최종 결과를 오염시킴 → 에이전트에게 "확인 없이 추측 금지" 규칙이 메커니즘적으로 정당화됨

## 🔗 관련 개념

- [[Emergence of Linear Truth Encodings in LMs]] - (LLM 내부 사실 표현 메커니즘 — 이 논문은 추론 시 사실 회상의 외적 메커니즘)
- [[LLM 해석 가능성 (LLM Interpretability)]] - (LLM 내부 작동 이해 허브 — 파라메트릭 지식 회상도 해석 가능성의 일부)
- [[Three-Layer Memory Architecture]] - (우리 메모리 구조의 검색 전략이 사실 프라이밍과 동일 원리 — 컨텍스트 빌드 후 상세 회상)

---

**작성일**: 2026-03-13
**분류**: LLM, Reasoning, Knowledge Recall, Hallucination
**출처**: Gekhman et al. (Google Research, Technion, Tel Aviv University)