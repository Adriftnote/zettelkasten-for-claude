---
title: 기술 부채 (Technical Debt)
type: concept
permalink: knowledge/concepts/technical-debt
tags:
- software-engineering
- maintenance
- refactoring
category: 소프트웨어 공학
difficulty: 중급
---

# 기술 부채 (Technical Debt)

빠른 개발을 위해 품질을 희생한 결과로 쌓이는 미래의 추가 작업

## 📖 개요

기술 부채는 금융의 '부채' 개념을 소프트웨어에 적용한 것입니다. 당장 빠르게 개발하기 위해 "나중에 고치자"고 넘어간 코드들이 쌓여서 미래에 더 큰 비용(이자)을 발생시킵니다. Ward Cunningham이 1992년에 처음 제안한 개념입니다.

## 🎭 비유

신용카드 빚과 같습니다. 당장 돈(시간)이 없어서 카드(빠른 코드)로 결제하면, 나중에 원금+이자(리팩토링 비용)를 갚아야 합니다. 갚지 않으면 이자가 계속 쌓입니다.

## ✨ 특징

### 부채의 종류

| 유형 | 설명 | 예시 |
|-----|------|-----|
| 의도적 | 알면서 빠르게 | "MVP 먼저, 나중에 고치자" |
| 무의식적 | 모르고 발생 | 경험 부족으로 나쁜 설계 |
| 환경적 | 외부 변화 | 라이브러리 deprecated |

### 이자(비용)의 형태

```
- 버그 수정 시간 증가
- 새 기능 개발 속도 저하
- 개발자 온보딩 시간 증가
- 시스템 장애 위험 증가
```

### 실제 데이터

```
우버 (2014년): 엔지니어 50%가 리팩토링에 시간 사용
페이스북: 기술 부채로 새 언어(Hack) 개발
트위터: Ruby → Scala 전체 재작성
```

## 💡 예시

```python
# 기술 부채 발생 (빠르게)
def process(data):
    # TODO: 에러 처리 추가
    # TODO: 로깅 추가
    # TODO: 테스트 작성
    return data * 2  # 일단 동작만

# 부채 상환 (나중에)
def process(data: int) -> int:
    """데이터를 처리합니다."""
    logger.info(f"Processing: {data}")
    if not isinstance(data, int):
        raise TypeError("int required")
    result = data * 2
    logger.info(f"Result: {result}")
    return result
```

### 부채 관리 전략

```
1. 인식: 부채 목록 관리 (TODO, FIXME)
2. 측정: 정기적 코드 품질 점검
3. 상환: 스프린트마다 20% 리팩토링
4. 예방: 코드 리뷰, 테스트 작성
```

### 재작성 타이밍 (핵심!)

```
성공 패턴:
1단계 (0-2년): 빠르게 (부채 발생 OK)
2단계 (2-4년): 재작성 (부채 상환) ← 핵심!
3단계 (4년~): 확장 가능

실패 패턴:
❌ 2단계 안 함 → 확장 불가 (인스타, 우버)
❌ 2단계 너무 늦음 → 시장 잃음 (Yahoo)
```

## Relations

- reduced_by [[클린 아키텍처 (Clean Architecture)]] (좋은 구조로 예방)
- relates_to [[의존성 (Dependency)]] (복잡한 의존성이 부채)
- motivates [[SOLID 원칙]] (원칙 준수로 부채 감소)
- measured_by [[SWE-bench]] (코드 품질 평가)

---

**난이도**: 중급
**카테고리**: 소프트웨어 공학
**제안자**: Ward Cunningham (1992)
**핵심**: 2-4년 내 재작성이 성공의 열쇠!
**마지막 업데이트**: 2026년 2월