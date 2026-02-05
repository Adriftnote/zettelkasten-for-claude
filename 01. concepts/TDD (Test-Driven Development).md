---
title: TDD (Test-Driven Development)
type: concept
permalink: knowledge/concepts/tdd
tags:
- software-engineering
- development-methodology
- testing
category: 개발 방법론
difficulty: 중급
---

# TDD (Test-Driven Development)

테스트를 먼저 작성하고, 그 테스트를 통과하는 코드를 작성하는 개발 방법론

## 📖 개요

TDD는 코드보다 테스트를 먼저 작성하는 개발 방식입니다. "Red-Green-Refactor" 사이클을 반복하며 개발합니다. 실패하는 테스트 작성(Red) → 테스트 통과하는 최소 코드 작성(Green) → 코드 개선(Refactor) 순으로 진행합니다.

## 🎭 비유

답안지를 먼저 만들고 문제를 푸는 것과 같습니다. "이런 결과가 나와야 해"를 먼저 정의하고, 그 결과를 만들어내는 코드를 작성합니다.

## ✨ 특징

- **테스트 우선**: 코드 작성 전에 테스트 먼저
- **작은 단위**: 한 번에 하나의 기능만 테스트
- **빠른 피드백**: 즉시 성공/실패 확인
- **문서 역할**: 테스트가 스펙 문서 역할

### Red-Green-Refactor 사이클

```
1. Red: 실패하는 테스트 작성
2. Green: 테스트 통과하는 최소 코드
3. Refactor: 코드 품질 개선
→ 반복
```

## 💡 예시

```python
# 1. Red - 테스트 먼저 (아직 함수 없음)
def test_add():
    assert add(2, 3) == 5  # 실패!

# 2. Green - 최소 코드
def add(a, b):
    return a + b  # 통과!

# 3. Refactor - 개선
def add(a: int, b: int) -> int:
    """두 숫자를 더합니다."""
    return a + b
```

## Relations

- relates_to [[의존성 (Dependency)]] (테스트 의존성 관리)
- used_by [[RPG (Repository Planning Graph)]] (ZeroRepo에서 TDD 적용)
- enables [[Defensive Coding]] (방어적 코딩 가능케 함)

---

**난이도**: 중급
**카테고리**: 개발 방법론
**마지막 업데이트**: 2026년 2월