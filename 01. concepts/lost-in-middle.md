---
title: Lost-in-Middle 현상
type: pattern
tags:
  - context-engineering
  - attention
  - pattern
  - limitation
permalink: knowledge/concepts/lost-in-middle
category: Context Engineering
difficulty: 중급
---

# Lost-in-Middle 현상

컨텍스트 중간에 위치한 정보의 회수율이 10-40% 낮아지는 현상입니다.

## 📖 개요

모델의 주의 메커니즘 때문에 컨텍스트의 시작과 끝에 있는 정보는 잘 활용하지만, 중간에 있는 정보는 상대적으로 무시하는 경향이 있습니다. 이를 **Lost-in-Middle** 현상이라 합니다.

## 🎭 비유

긴 문서를 읽을 때 처음과 마지막 부분은 기억하지만, 중간 내용은 잊어버리는 것처럼 작동합니다.

## ✨ 특징

- **회수율 저하**: 중간 정보는 10-40% 낮은 recall
- **U자형 주의 곡선**: 처음과 끝이 높고 중간이 낮음
- **정보 위치 중요**: 같은 정보도 위치에 따라 효율 변함
- **누적 효과**: 더 많은 컨텍스트 → 문제 심화

## 💡 예시

**나쁜 배치**:
```
[System Prompt - 높은 우선순위]
[도구 정의들... - 중간]
[중요한 지시사항... - 중간] ❌ 무시될 가능성 높음
[메시지 히스토리...]
[최근 도구 출력 - 높은 우선순위]
```

**좋은 배치**:
```
[System Prompt - 높은 우선순위]
[중요한 지시사항... - 최상단] ✅
[도구 정의들...]
[메시지 히스토리...]
[중요한 참고사항... - 최하단] ✅
```

## 🛠️ 해결 방법

1. **중요한 정보를 시작/끝에 배치**
2. **중간에는 관련도 높은 정보만 로드**
3. **Progressive Disclosure로 불필요한 정보 제거**
4. **Compression으로 중간 정보 요약**

## Relations

- mitigates_by [[progressive-disclosure|Progressive Disclosure]] - solves through selective loading
- mitigates_by [[anchored-iterative-summarization|Anchored Iterative Summarization]] - solves through anchor-based compression
- relates_to [[context-distraction|Context Distraction]] - related information management problem
- part_of [[four-bucket-optimization|Four-Bucket Optimization]] - component of context engineering
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - applies attention positioning strategy

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
