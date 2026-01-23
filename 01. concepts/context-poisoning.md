---
title: Context Poisoning
type: pattern
tags:
  - context-engineering
  - error-handling
  - pattern
  - anti-pattern
permalink: knowledge/concepts/context-poisoning
category: Context Engineering
difficulty: 중급
---

# Context Poisoning

오류나 환각이 컨텍스트에 축적되면서 피드백 루프를 형성하는 현상입니다.

## 📖 개요

모델이 생성한 오류가 다시 컨텍스트로 들어가면, 모델은 그 오류를 사실로 인식하게 됩니다. 이렇게 오류가 계속 강화되는 것을 **Context Poisoning**이라 합니다.

## 🎭 비유

잘못된 정보가 복사되어 퍼져나가면서 원본보다 더 많은 오류 정보가 존재하게 되는 상황입니다.

## ✨ 특징

- **자기 강화**: 오류가 컨텍스트에 들어가면 더 큰 오류 생성
- **누적 효과**: 시간이 지날수록 심화
- **은폐**: 원본 오류를 찾기 어려움
- **복구 어려움**: 수동 개입 필요

## 💡 예시

**오염된 피드백 루프**:
```
1. 모델 응답: "파일 경로는 /usr/bin입니다" (오류)
   ↓
2. 사용자 모르고 이를 컨텍스트에 포함
   ↓
3. 모델 다음 응답: "앞서 언급한 /usr/bin에서..."
   ↓
4. 오류가 계속 반복되고 강화됨
```

## 🛠️ 해결 방법

1. **오류 감지**: 도구 실행 결과로 오류 확인
2. **컨텍스트 재시작**: 오류가 누적되었으면 새 세션 시작
3. **명시적 수정**: 오류 부분을 명확히 지적하고 수정
4. **검증 루프**: 중요한 작업은 도구로 검증

## Relations

- mitigates_by [[four-bucket-optimization|Four-Bucket Optimization]] - solves through Isolate strategy
- mitigates_by [[graceful-degradation|Graceful Degradation]] - applies through session restart/recovery
- relates_to [[context-distraction|Context Distraction]] - similar context quality problem
- relates_to [[context-confusion|Context Confusion]] - both cause information degradation
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - prevents error accumulation

---

**난이도**: 중급
**카테고리**: Context Engineering
**마지막 업데이트**: 2026년 1월
**출처**: context-engineering-guide.md
