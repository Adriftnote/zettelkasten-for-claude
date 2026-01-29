---
title: Strategy Pattern
type: concept
tags: [design-patterns, gof, behavioral-patterns, oop]
permalink: knowledge/concepts/strategy-pattern
category: 디자인 패턴
difficulty: 중급
created: 2026-01-22
---

# Strategy Pattern

**"알고리즘을 캡슐화하여 런타임에 교체 가능하게 한다"**

GoF 행동 패턴 중 하나. 동일한 문제를 해결하는 여러 알고리즘을 정의하고, 상황에 따라 선택적으로 사용할 수 있게 합니다.

## 📖 개요

핵심 아이디어: **"알고리즘을 클래스로 분리한다"**

```
[if-else 방식]
if (type == "A") { algorithmA(); }
else if (type == "B") { algorithmB(); }
→ 새 알고리즘 추가 시 코드 수정 필요

[Strategy Pattern]
strategy.execute();  // 어떤 전략이든 동일한 인터페이스
→ 새 알고리즘 = 새 Strategy 클래스 추가
```

## 🎭 비유

### 네비게이션 경로 안내

```
목적지: 강남역
├── 🚗 자동차 전략: 고속도로 → 올림픽대로 (30분)
├── 🚇 대중교통 전략: 지하철 2호선 (45분)
├── 🚴 자전거 전략: 한강 자전거도로 (1시간)
└── 🚶 도보 전략: (3시간)

→ 같은 목적지, 다른 전략
→ 사용자가 전략 선택
→ 네비게이션 앱 코드는 변경 없음
```

## 💡 구조

```
┌────────────┐        ┌────────────────┐
│   Context  │───────→│   Strategy     │
│            │        │  (interface)   │
│ - strategy │        │  + execute()   │
│ + setStrategy()     └───────┬────────┘
│ + doWork() │                │
└────────────┘      ┌─────────┼─────────┐
                    ↓         ↓         ↓
              ┌──────────┐┌──────────┐┌──────────┐
              │StrategyA ││StrategyB ││StrategyC │
              │+execute()││+execute()││+execute()│
              └──────────┘└──────────┘└──────────┘
```

| 역할 | 설명 |
|------|------|
| **Strategy** | 알고리즘의 공통 인터페이스 |
| **ConcreteStrategy** | 구체적인 알고리즘 구현 |
| **Context** | Strategy를 사용하는 클래스 |

## 💻 예시

### 기본 구현: 결제 시스템

```python
from abc import ABC, abstractmethod

# Strategy 인터페이스
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

# Concrete Strategies
class CardPayment(PaymentStrategy):
    def __init__(self, card_number):
        self.card_number = card_number

    def pay(self, amount):
        print(f"카드({self.card_number[-4:]})로 {amount}원 결제")

class KakaoPayment(PaymentStrategy):
    def __init__(self, user_id):
        self.user_id = user_id

    def pay(self, amount):
        print(f"카카오페이({self.user_id})로 {amount}원 결제")

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet_address):
        self.wallet = wallet_address

    def pay(self, amount):
        print(f"암호화폐({self.wallet[:8]}...)로 {amount}원 결제")

# Context
class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None

    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy

    def checkout(self):
        total = sum(item['price'] for item in self.items)
        self.payment_strategy.pay(total)

# 사용
cart = ShoppingCart()
cart.items = [{"name": "책", "price": 15000}]

cart.set_payment_strategy(CardPayment("1234-5678-9012-3456"))
cart.checkout()  # 카드(3456)로 15000원 결제

cart.set_payment_strategy(KakaoPayment("user123"))
cart.checkout()  # 카카오페이(user123)로 15000원 결제
```

### MCP 도구 스키마 처리

```javascript
// 각 inputSchema 타입별 Strategy
const schemaStrategies = {
  string: (schema) => ({ type: 'string', ...schema }),
  number: (schema) => ({ type: 'number', parse: parseInt, ...schema }),
  object: (schema) => ({ type: 'object', parse: JSON.parse, ...schema }),
  array: (schema) => ({ type: 'array', parse: JSON.parse, ...schema }),
};

// Context
function buildCliOption(property) {
  const strategy = schemaStrategies[property.type];
  return strategy(property);
}

// 새 타입 추가: Strategy만 추가, 기존 코드 수정 없음
schemaStrategies.boolean = (schema) => ({
  type: 'boolean',
  parse: (v) => v === 'true',
  ...schema
});
```

## 🔄 Strategy vs Command 차이

| | Strategy Pattern | Command Pattern |
|---|---|---|
| **목적** | 알고리즘 교체 | 요청 캡슐화 |
| **초점** | "어떻게 할 것인가" | "무엇을 할 것인가" |
| **상태** | 보통 무상태 | 요청 정보 포함 |
| **Undo** | 일반적으로 없음 | 자주 구현 |
| **예시** | 정렬 알고리즘 교체 | 메뉴 클릭 처리 |

```python
# Strategy: "정렬 방법"을 교체
list.sort(strategy=QuickSort())
list.sort(strategy=MergeSort())

# Command: "정렬하라"는 명령 자체를 객체화
command = SortCommand(list, QuickSort())
command.execute()
command.undo()
```

## ✨ 장점

| 장점 | 설명 |
|------|------|
| **OCP 준수** | 새 전략 추가 시 기존 코드 수정 불필요 |
| **if-else 제거** | 조건문 대신 다형성 사용 |
| **런타임 교체** | 실행 중 전략 변경 가능 |
| **테스트 용이** | 각 전략 독립적으로 테스트 |
| **재사용** | 전략을 여러 Context에서 사용 |

## 📊 적용 사례

| 사례 | 전략 예시 |
|------|----------|
| **정렬** | QuickSort, MergeSort, BubbleSort |
| **압축** | Zip, Gzip, Brotli |
| **인증** | JWT, OAuth, BasicAuth |
| **캐싱** | Memory, Redis, File |
| **로깅** | Console, File, Cloud |
| **결제** | Card, PayPal, Crypto |

## ⚠️ 주의사항

- **전략 수가 적으면 과잉 설계**: 2-3개면 if-else도 OK
- **클라이언트가 전략을 알아야 함**: 어떤 전략을 선택할지 결정 필요
- **전략 간 공통 로직**: 중복 코드 발생 가능 → Template Method 고려

## Relations

- achieves [[Open-Closed Principle (OCP)]] (새 전략 추가 시 OCP 준수)
- implements [[Dependency Inversion Principle (DIP)]] (추상화에 의존)
- similar_to [[Command Pattern]] (둘 다 행동을 캡슐화하지만 목적이 다름)
- alternative_to [[Template Method Pattern]] (상속 대신 합성 사용)
- part_of [[GoF 디자인 패턴]] (행동 패턴 중 하나)
