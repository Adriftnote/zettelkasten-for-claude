---
title: CCS (Contrast Consistent Search)
type: concept
permalink: knowledge/concepts/ccs
tags:
- AI
- LLM
- interpretability
- truth-detection
category: AI/ML
difficulty: 고급
---

# CCS (Contrast Consistent Search)

레이블 없이 모델 내부에서 "truth direction"을 추출하는 비지도 방법

## 📖 개요

CCS(Contrast Consistent Search)는 Burns et al. (2022)이 제안한 방법으로, 대조적 문장 쌍(참/거짓)의 hidden states 차이에서 일관된 "진실 방향"을 찾아내는 비지도 기법입니다. 모델이 "아는 것"과 "말하는 것"이 다를 수 있다는 전제 하에, 모델의 진짜 지식을 추출하려는 시도입니다.

## 🎭 비유

거짓말 탐지기와 비슷합니다. 사람이 무엇을 말하든, 내부 생체 반응(뇌파, 심박수)을 보면 진실을 알 수 있다는 발상입니다. CCS는 모델의 "생체 반응"(hidden states)에서 진실 신호를 추출합니다.

## ✨ 특징

- **비지도**: 정답 레이블 없이 작동
- **대조 쌍**: "X는 사실이다" vs "X는 거짓이다" 비교
- **일관성 제약**: 논리적 일관성(부정 대칭) 활용
- **레이어 선택**: 특정 레이어에서 더 잘 작동

## 💡 작동 방식

```
입력 쌍:
  "파리는 프랑스의 수도이다" → hidden state h+
  "파리는 프랑스의 수도가 아니다" → hidden state h-

CCS 학습:
  probe(h+) ≈ 1 - probe(h-)  (일관성)
  probe(h)  ≈ 0 or 1          (확신성)
        ↓
  "truth direction" 추출
```

## ⚠️ 한계

- 맥락에 따라 truth direction이 변할 수 있음
- 복잡한 추론이 필요한 문장에서 정확도 저하
- 모델이 실제로 "아는 것"인지, 통계적 패턴인지 불명확

## Relations

- part_of [[Mechanistic Interpretability]] (해석 방법)
- based_on [[Linear Representation Hypothesis]] (선형 방향 가정)
- challenged_by [[Linear Representations Change During Conversation]] (맥락 변화 시 무력화)
- similar_to [[Steering Vector]] (방향 벡터 활용 공통점)