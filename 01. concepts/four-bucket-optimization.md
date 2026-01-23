---
title: Four-Bucket Optimization
type: pattern
tags:
  - context-engineering
  - optimization
  - strategy
  - token-efficiency
permalink: knowledge/concepts/four-bucket-optimization
category: Context Engineering
difficulty: 중급
---

# Four-Bucket Optimization

컨텍스트 최적화를 위한 4가지 전략을 체계적으로 적용하는 패턴입니다.

## 📖 개요

컨텍스트 최적화는 단일 기법이 아니라, 4가지 버킷(전략)을 상황에 맞게 조합하는 것입니다: Write → Select → Compress → Isolate

## 🎭 비유

짐을 꾸릴 때: 일부는 집에 둔 후 → 필요한 것만 고르고 → 압축해서 담은 후 → 여행 멤버별로 역할 분담합니다.

## ✨ 4가지 버킷

### 1️⃣ **Write** - 컨텍스트 외부 저장
- 컨텍스트가 비정상적으로 커지면 외부 저장소 활용
- 파일, 데이터베이스, 스크래치패드 등
- 예: 장기 대화 요약을 파일로 저장

### 2️⃣ **Select** - 관련 정보만 선별
- 검색으로 필요한 정보만 로드
- 전체 로드 대신 JIT(Just-in-Time) 로딩
- 예: 도구 설명은 필요할 때만 로드

### 3️⃣ **Compress** - 정보 밀도 증가
- 토큰을 줄이면서 정보는 유지
- 요약, 마스킹, 축약
- 예: 도구 출력을 핵심만 추출

### 4️⃣ **Isolate** - 서브에이전트로 분리
- 복잡한 작업을 별개 에이전트에 위임
- 각 에이전트가 독립적 컨텍스트 사용
- 예: 파일 분석은 별개 태스크로 실행

## 💡 적용 순서

```
1단계: Write + Select (사전 최적화)
   ↓
2단계: Compress (70-80% 사용 시 트리거)
   ↓
3단계: Isolate (여전히 부족하면 분산)
```

## Relations

- extends [[anchored-iterative-summarization|Anchored Iterative Summarization]] - Compress strategy
- extends [[observation-masking|Observation Masking]] - Compress strategy implementation
- extends [[progressive-disclosure|Progressive Disclosure]] - Select strategy
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - core optimization framework
- mitigates [[lost-in-middle|Lost-in-Middle]] - through strategic information placement
- mitigates [[context-poisoning|Context Poisoning]] - through Isolate pattern

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
