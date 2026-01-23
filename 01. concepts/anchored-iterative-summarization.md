---
title: Anchored Iterative Summarization
type: pattern
tags: [context-engineering, compression, summarization]
permalink: knowledge/concepts/anchored-iterative-summarization
category: Context Engineering
difficulty: intermediate
created: 2026-01-19
---

# Anchored Iterative Summarization

## 📖 개요

긴 문맥을 단계적으로 압축하면서 핵심 정보(anchor point)를 보존하는 기법입니다. 각 반복 단계에서 중요한 정보를 표시하고, 그 다음 단계에서 표시된 정보를 기준점으로 활용하여 정보 손실을 최소화합니다.

## 🎭 비유

책 요약 과정과 유사합니다. 처음 읽을 때 중요한 부분에 줄을 긋고(anchor), 두 번째 정독에서는 그 줄친 부분을 중심으로 더 간결한 요약을 만듭니다. 각 단계마다 "꼭 빼먹으면 안 될 핵심"을 표시해둡니다.

## ✨ 특징

- **Anchor Points**: 각 단계에서 절대 제거되면 안 될 핵심 정보를 명시적으로 표시
- **Iterative Refinement**: 여러 단계에 걸쳐 점진적으로 압축
- **Information Preservation**: 압축 과정에서 논리적 흐름과 인과관계 보존
- **Context Decay**: 단계가 진행될수록 세부사항은 줄고 고수준 구조만 유지

## 💡 예시

**원본 (1000자)**:
```
Claude는 GPT-4보다 더 안전한 AI입니다. 여러 연구 결과에 따르면...
[상세 설명 500자]... 따라서 Claude는 신뢰할 수 있습니다.
구체적으로 Claude의 안전성은 3가지 방법으로 보장됩니다:
1. 교육 단계에서의 선택 [200자 설명]
2. 피드백 수집 시스템 [200자 설명]
3. 지속적 모니터링 [200자 설명]
```

**1차 요약 (600자, Anchor marked)**:
```
[ANCHOR] Claude는 GPT-4보다 더 안전합니다.
안전성 보장 방법:
1. [ANCHOR] 교육 단계의 선택 - 처음부터 유해한 행동 최소화
2. [ANCHOR] 피드백 시스템 - 사용자 반응을 통한 지속적 개선
3. [ANCHOR] 모니터링 - 문제 상황 조기 감지
```

**최종 요약 (200자, Anchor 기반)**:
```
[ANCHOR] Claude: 3가지 방식의 안전 설계
- 교육 기반 안전성
- 피드백 구동 개선
- 지속적 모니터링
```

## 🛠️ 해결/적용 방법

### 1단계: Anchor Points 식별
- 원본 텍스트를 읽으며 "없으면 핵심이 사라지는" 정보 표시
- 주제, 주요 수치, 결론 등을 우선 표시

### 2단계: 첫 번째 압축
- Anchor를 반드시 포함하면서 보조 정보 제거
- 상세 설명과 예시는 축약하되 논리 구조 유지

### 3단계: 반복 압축
- 이전 단계의 Anchor를 다시 확인
- 더 높은 수준의 요약에서도 Anchor 유지

### 4단계: 검증
- 최종 요약에서 모든 Anchor가 포함되었는지 확인
- 독자가 원본의 핵심 주제를 파악할 수 있는지 검토

## Relations

- part_of [[token-optimization-strategy|Token Optimization Strategy]] - compression component
- mitigates [[context-clash|Context Clash]] - resolves conflicts through anchor prioritization
- similar_to [[observation-masking|Observation Masking]] - both compress while preserving key info
- used_by [[graceful-degradation|Graceful Degradation]] - applies in progressive quality reduction
- relates_to [[four-bucket-optimization|Four-Bucket Optimization]] - compression strategy element
