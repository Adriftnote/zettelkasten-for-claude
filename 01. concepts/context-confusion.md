---
title: Context Confusion
type: pattern
tags:
  - context-engineering
  - error-handling
  - pattern
  - multi-turn
permalink: knowledge/concepts/context-confusion
category: Context Engineering
difficulty: 중급
---

# Context Confusion

여러 작업이나 대화의 문맥이 혼용되어 발생하는 오류입니다.

## 📖 개요

한 세션에서 여러 작업을 수행할 때, 이전 작업의 컨텍스트가 현재 작업으로 누출되는 현상입니다. 모델이 어느 작업의 변수인지 구분하지 못합니다.

## 🎭 비유

전화로 여러 건의 상담을 받을 때, 이전 고객의 정보를 다음 고객에게 실수로 말하는 것처럼 컨텍스트가 섞입니다.

## ✨ 특징

- **작업 간섭**: 이전 작업의 파일/변수명이 새 작업에 영향
- **파일명 충돌**: 서로 다른 프로젝트의 같은 파일명이 혼동
- **변수 혼동**: 어느 작업의 변수인지 불명확
- **누적됨**: 세션이 길수록 심화

## 💡 예시

**혼동된 상황**:
```
작업 1: 프로젝트 A의 auth.controller.ts 수정
작업 2: 프로젝트 B의 auth.controller.ts 수정

모델이 실수로:
"프로젝트 B의 auth.controller.ts에서
프로젝트 A의 구조를 적용..."
```

## 🛠️ 해결 방법

1. **작업 분리**: 중요한 작업은 별개 세션으로
2. **명확한 네이밍**: 작업/프로젝트 이름을 명시
3. **컨텍스트 분할**: Isolate 패턴으로 서브에이전트 사용
4. **세션 리셋**: 작업 전환 시 명시적 선언

## Relations

- mitigates_by [[four-bucket-optimization|Four-Bucket Optimization]] - solves through Isolate strategy
- mitigates_by [[graceful-degradation|Graceful Degradation]] - applies through session reset
- relates_to [[context-distraction|Context Distraction]] - similar multi-task context issue
- relates_to [[context-poisoning|Context Poisoning]] - both cause cumulative degradation
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - prevents confusion in optimization

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
