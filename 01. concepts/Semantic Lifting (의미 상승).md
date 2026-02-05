---
title: Semantic Lifting (의미 상승)
type: concept
permalink: knowledge/concepts/semantic-lifting
tags:
- code-understanding
- abstraction
- ai-engineering
category: 코드 이해
difficulty: 고급
---

# Semantic Lifting (의미 상승)

구체적인 코드에서 추상적인 의미/의도를 추출하는 과정

## 📖 개요

Semantic Lifting은 저수준의 구체적 코드를 고수준의 추상적 의미로 변환하는 기법입니다. 코드가 "무엇을 하는지"를 파악하여 기능적 설명으로 추출합니다. RPG-Encoder에서 코드 엔티티를 원자적 의미 특징으로 변환할 때 사용됩니다.

## 🎭 비유

레시피를 보고 "이건 피자 만드는 거구나" 파악하는 것과 같습니다. 재료 목록과 조리 과정(코드)을 보고 최종 결과물의 의미(피자)를 추출합니다.

## ✨ 특징

- **추상화**: 구현 세부사항 → 기능적 의미
- **정규화**: verb-object 구문으로 표준화 (예: "authenticate user")
- **계층 구축**: 추출된 의미로 기능 계층 구성
- **검색 가능**: 의미 기반 코드 검색 가능

### 변환 과정

```
코드 엔티티 → 원자적 의미 특징 → 기능 계층
```

## 💡 예시

```python
# 원본 코드
def login(user, pw):
    if db.find(user).pw == pw:
        return True
    return False

# Semantic Lifting 결과
의미: "사용자 인증 기능"
verb-object: "authenticate user"
계층: authentication/login/verify_credentials
```

### RPG-Encoder에서의 활용

```
Phase 1: Semantic Lifting
  코드 엔티티 → 원자적 의미 특징
  정규화된 verb-object 구문
  
Phase 2: Latent Architecture Recovery
  특징 → 3단계 계층
  <functional area>/<category>/<subcategory>
```

## Relations

- used_by [[RPG (Repository Planning Graph)]] (RPG-Encoder 핵심 기법)
- relates_to [[AST (Abstract Syntax Tree)]] (코드 구조 분석 기반)
- enables [[Code Understanding]] (코드 이해 가능케 함)
- opposite_of [[Code Generation]] (반대 방향: 의미 → 코드)

---

**난이도**: 고급
**카테고리**: 코드 이해
**출처**: RPG-Encoder 논문 (Microsoft Research)
**마지막 업데이트**: 2026년 2월