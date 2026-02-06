---
title: In-Context Learning
type: concept
permalink: knowledge/concepts/in-context-learning
tags:
- AI
- LLM
- 머신러닝
category: AI/ML
difficulty: 중급
---

# In-Context Learning

파라미터 업데이트 없이 프롬프트 내 예시만으로 새 태스크를 수행하는 LLM의 능력

## 📖 개요

In-Context Learning(ICL)은 대규모 언어 모델이 fine-tuning 없이 프롬프트에 주어진 몇 개의 예시만 보고 패턴을 파악하여 새로운 태스크를 수행하는 능력입니다. GPT-3 논문에서 처음 주목받았으며, 현대 LLM의 핵심 특성 중 하나입니다.

## 🎭 비유

시험 직전에 선생님이 "이런 유형의 문제는 이렇게 풀어"라고 예시 2-3개를 보여주면, 학생이 비슷한 새 문제를 풀 수 있는 것과 같습니다. 별도로 공부(학습)하지 않아도 패턴만 보고 적용합니다.

## ✨ 특징

- **Zero-shot**: 예시 없이 지시만으로 수행
- **Few-shot**: 몇 개의 예시 제공 후 수행
- **파라미터 고정**: 가중치 업데이트 없이 추론 시점에 학습
- **맥락 의존**: 프롬프트 구성에 따라 성능 변화

## 💡 예시

```
# Few-shot 번역 예시
Q: 사과는 영어로? A: apple
Q: 바나나는 영어로? A: banana  
Q: 포도는 영어로? A: ???
→ 모델 출력: grape
```

## Relations

- part_of [[LLM]] (핵심 능력)
- enables [[Few-shot Learning]] (가능케 함)
- relates_to [[Prompt Engineering]] (활용 방법)
- relates_to [[Sycophancy (아첨)]] (부작용 원인)