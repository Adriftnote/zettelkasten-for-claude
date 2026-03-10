---
title: Domain Driven Design (DDD)
type: concept
permalink: knowledge/concepts/ddd
tags:
- architecture
- software-design
- methodology
category: 소프트웨어 설계/방법론
difficulty: 고급
---

# Domain Driven Design (DDD)

비즈니스 도메인을 중심으로 소프트웨어를 설계하는 방법론

## 📖 개요

DDD는 복잡한 비즈니스 로직을 다루는 소프트웨어 설계 방법입니다. 기술이 아닌 **비즈니스(도메인)**를 먼저 이해하고, 그것을 코드에 반영합니다.

**핵심 질문**: "우리 비즈니스를 코드로 어떻게 표현할까?"

## 🎭 비유

```
[일반적인 개발]
건축가: "먼저 철골 구조 정하고, 거기에 맞춰 방 배치하자"

[DDD]
건축가: "어떻게 살 건지 먼저 듣고, 그에 맞는 구조를 설계하자"
```

## ✨ 핵심 개념

### 전술적 패턴 (코드 수준)

| 개념 | 설명 | 예시 |
|------|------|------|
| **Entity** | 고유 ID로 구분되는 객체 | `User(id=1)` |
| **Value Object** | 값으로 비교 (ID 없음) | `Money(1000, "KRW")` |
| **Aggregate** | 관련 엔티티 묶음 + 루트 | `Order` + `OrderItem` |
| **Repository** | 저장소 추상화 | `UserRepository.find(id)` |
| **Domain Service** | 엔티티에 안 맞는 로직 | `TransferService` |
| **Factory** | 복잡한 객체 생성 | `OrderFactory.create()` |

### 전략적 패턴 (설계 수준)

| 개념 | 설명 |
|------|------|
| **Bounded Context** | 도메인의 경계 (주문, 결제, 배송) |
| **Ubiquitous Language** | 개발자-도메인전문가 공통 언어 |
| **Context Map** | 경계 간 관계 정의 |

## 💡 예시

### Entity vs Value Object

```python
# Entity - ID로 구분
class User:
    def __init__(self, id, name):
        self.id = id      # 같은 id면 같은 User
        self.name = name

# Value Object - 값으로 비교
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __eq__(self, other):
        return self.amount == other.amount and self.currency == other.currency

# Money(1000, "KRW") == Money(1000, "KRW")  → True (값이 같으면 같음)
```

### Aggregate

```python
# Order가 Aggregate Root
class Order:
    def __init__(self, id):
        self.id = id
        self.items = []  # OrderItem은 Order 통해서만 접근

    def add_item(self, product, qty):
        # 비즈니스 규칙 적용
        if qty <= 0:
            raise ValueError("수량은 1 이상이어야 합니다")
        self.items.append(OrderItem(product, qty))

# 외부에서 OrderItem 직접 수정 불가
# 반드시 Order.add_item() 통해서만 가능
```

### Rich vs Anemic Model

```python
# Anemic (빈혈) - 데이터만
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserService:
    def change_email(self, user, new_email):  # 로직이 서비스에
        user.email = new_email

# Rich (풍부한) - DDD 권장
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def change_email(self, new_email):  # 로직이 엔티티에
        if not self._is_valid_email(new_email):
            raise ValueError("유효하지 않은 이메일")
        self.email = new_email
```

## 🔄 언제 쓰나?

| 상황 | DDD 적합도 |
|------|------------|
| 복잡한 비즈니스 로직 | ✅ 매우 적합 |
| 도메인 전문가 협업 | ✅ 매우 적합 |
| 장기 유지보수 | ✅ 적합 |
| 단순 CRUD | ❌ 오버엔지니어링 |
| 빠른 MVP | ❌ 시간 부족 |
| 작은 프로젝트 | ❌ 복잡도 증가 |

## 📊 레이어 구조

```
[Presentation Layer]  ← API, UI
        ↓
[Application Layer]   ← Use Case, 조율
        ↓
[Domain Layer]        ← 핵심 비즈니스 (Entity, Value Object)
        ↓
[Infrastructure]      ← DB, 외부 서비스
```

**핵심**: Domain Layer가 다른 레이어에 의존하지 않음

## Relations

- relates_to [[객체지향 프로그래밍 (OOP)]] (Rich Model에 OOP 활용)
- relates_to [[캡슐화 (Encapsulation)]] (Aggregate로 경계 캡슐화)
- relates_to [[추상화 (Abstraction)]] (Repository로 저장소 추상화)
- used_by [[클린 아키텍처 (Clean Architecture)]] (DDD 개념 활용)
- contrasts_with [[CRUD]] (단순 CRUD vs 도메인 중심)

---

**난이도**: 고급
**카테고리**: 소프트웨어 설계/방법론
**출처**: Eric Evans - "Domain-Driven Design" (2003)
**마지막 업데이트**: 2026년 2월
