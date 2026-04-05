---
title: Chain of Thought (CoT)
type: concept
permalink: knowledge/concepts/chain-of-thought
tags:
- LLM
- reasoning
- prompting
- inference
category: AI 추론
difficulty: 초급
---

# Chain of Thought (CoT)

LLM이 답을 바로 내놓지 않고, 중간 추론 단계를 텍스트로 풀어쓰며 최종 답에 도달하는 추론 방식

## 📖 개요

Chain of Thought는 "사고의 연쇄"라는 뜻 그대로, 모델이 복잡한 문제를 풀 때 한 번에 답을 내는 대신 **단계별 사고 과정을 자연어로 생성**하는 기법이다. 2022년 Google의 Wei et al. 논문에서 제안되었으며, 수학·논리·상식 추론 등 다양한 태스크에서 정확도를 크게 향상시켰다. 현재 대부분의 reasoning 모델(o1, DeepSeek-R1, Claude 등)의 기반이 되는 핵심 패러다임이다.

## 🎭 비유

시험에서 "풀이 과정을 쓰시오"와 같다.

- **CoT 없이**: "정답: 42" → 맞으면 좋지만, 틀리면 어디서 틀렸는지 모름
- **CoT 사용**: "먼저 A를 구하면 7, B에 대입하면 6, 7×6=42" → 각 단계가 검증 가능하고, 중간에 오류가 나면 되돌릴 수 있음

## ✨ 특징

- **단계적 분해**: 복잡한 문제를 작은 하위 문제로 나눠 순서대로 해결
- **자기 검증**: 중간 결과를 텍스트로 남기므로, 모델 스스로 오류를 감지할 수 있음
- **프롬프트 유도 가능**: "Let's think step by step" 한 줄 추가만으로 CoT 유도 (Zero-shot CoT)
- **길이 ≠ 품질**: 길게 쓴다고 정확한 것은 아님. 토큰 길이와 정확도는 음의 상관관계(r=-0.594)를 보이기도 함

## 💡 예시

```
# CoT 없이
Q: 카페에서 4,500원짜리 커피 3잔, 6,000원짜리 케이크 2개를 샀다. 총액은?
A: 25,500원

# CoT 적용
Q: 카페에서 4,500원짜리 커피 3잔, 6,000원짜리 케이크 2개를 샀다. 총액은?
A: 커피 3잔 = 4,500 × 3 = 13,500원
   케이크 2개 = 6,000 × 2 = 12,000원
   총액 = 13,500 + 12,000 = 25,500원
```

## 🔀 변형

| 변형 | 설명 |
|------|------|
| **Zero-shot CoT** | "단계별로 생각해보자" 한 줄로 유도 |
| **Few-shot CoT** | 예시와 함께 풀이 과정을 보여줌 |
| **Self-Consistency** | 여러 CoT 경로를 생성 후 다수결로 답 선택 |
| **Tree of Thought** | 분기하는 여러 사고 경로를 탐색 |

## Relations

- enables [[Chain of Spreadsheet (CoS)]] (CoT의 스프레드시트 특화 버전)
- extends [[ReAct Paradigm]] (CoT에 행동을 추가한 확장)
- measured_by [[Deep-Thinking Ratio (DTR)]] (CoT의 "깊이" 품질을 측정하는 지표)
- relates_to [[token-optimization-strategy]] (CoT 토큰 효율화 전략과 연관)
