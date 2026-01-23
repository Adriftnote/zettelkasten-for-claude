---
title: Observation Masking
type: pattern
tags:
  - context-engineering
  - optimization
  - tool-output
  - compression
permalink: knowledge/concepts/observation-masking
category: Context Engineering
difficulty: 고급
---

# Observation Masking

도구 출력의 전체 내용 대신 참조와 핵심만 남기는 압축 기법입니다.

## 📖 개요

도구 출력은 컨텍스트의 83.9%를 차지하는 주요 토큰 소비원입니다. 모든 출력을 유지할 필요는 없고, 3턴 이상 지난 출력은 마스킹으로 대체할 수 있습니다.

## 🎭 비유

책의 긴 각주를 "참고 p.123" 처럼 축약하되, 필요하면 원문을 찾아볼 수 있게 하는 방식입니다.

## ✨ 특징

- **선택적 마스킹**: 최신 3턴은 유지, 그 이전은 마스킹
- **참조 제공**: 마스킹된 출력도 ID로 참조 가능
- **토큰 절약**: 도구 출력 80%+ 감축 가능
- **정보 손실 최소**: 필요한 핵심만 추출

## 💡 예시

**원본 도구 출력**:
```
[Tool: bash]
Output: total 256
-rw-r--r-- 1 user staff 4096 Jan 19 10:45 index.md
-rw-r--r-- 1 user staff 2048 Jan 19 10:44 about.md
...
(수십 줄의 파일 목록)
```

**마스킹 처리**:
```
[Obs:ref_id:bash_1234567 elided.
Key: 파일 목록 - index.md, about.md 등 10개 파일]
```

## 🛠️ 마스킹 규칙

1. **시간 기준**: 3턴 이상 이전 출력부터 마스킹
2. **크기 기준**: 1000 토큰 이상의 출력
3. **관련성**: 현재 작업과 무관한 이전 출력
4. **보존 예외**: 오류 메시지, 중요 결과는 유지

## Relations

- part_of [[four-bucket-optimization|Four-Bucket Optimization]] - Compress strategy component
- part_of [[token-optimization-strategy|Token Optimization Strategy]] - tool output optimization
- similar_to [[anchored-iterative-summarization|Anchored Iterative Summarization]] - both preserve key info while compressing
- used_by [[graceful-degradation|Graceful Degradation]] - applies in memory-constrained scenarios
- mitigates [[lost-in-middle|Lost-in-Middle]] - reduces context length issues

---

**난이도**: 고급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
