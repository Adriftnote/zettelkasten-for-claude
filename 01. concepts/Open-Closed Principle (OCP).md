---
title: Open-Closed Principle (OCP)
type: concept
tags: [solid, design-principles, oop, software-architecture]
permalink: knowledge/concepts/open-closed-principle
category: 설계 원칙
difficulty: 중급
created: 2026-01-22
---

# Open-Closed Principle (OCP)

**"확장에는 열려 있고, 수정에는 닫혀 있어야 한다"**

SOLID 원칙 중 두 번째(O). 기존 코드를 수정하지 않고도 새로운 기능을 추가할 수 있도록 설계해야 한다는 원칙입니다.

## 📖 개요

- **Open for Extension**: 새로운 동작/기능 추가 가능
- **Closed for Modification**: 기존 코드 변경 불필요

핵심은 **추상화**입니다. 구체적인 구현이 아닌 추상화에 의존하면, 새 구현체를 추가해도 기존 코드를 건드릴 필요가 없습니다.

## 🎭 비유

### ❌ OCP 위반: 콘센트 직결
```
새 가전제품 → 벽 뜯고 전선 연결 → 기존 배선 수정 필요
```

### ✅ OCP 준수: 표준 콘센트
```
새 가전제품 → 플러그 꽂기 → 기존 배선 그대로
```

콘센트(인터페이스)라는 추상화 덕분에 새 가전제품(확장)을 추가해도 벽 배선(기존 코드)을 수정할 필요가 없습니다.

## 💡 예시

### ❌ OCP 위반

```python
class PaymentProcessor:
    def process(self, payment_type, amount):
        if payment_type == "card":
            # 카드 결제 로직
            print(f"카드로 {amount}원 결제")
        elif payment_type == "cash":
            # 현금 결제 로직
            print(f"현금으로 {amount}원 결제")
        elif payment_type == "crypto":  # 새 결제 수단 추가할 때마다
            # 암호화폐 결제 로직    # 이 클래스를 수정해야 함!
            print(f"암호화폐로 {amount}원 결제")
```

**문제**: 새 결제 수단 추가 시 기존 코드 수정 필요 → OCP 위반

### ✅ OCP 준수

```python
from abc import ABC, abstractmethod

# 추상화 (인터페이스)
class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount):
        pass

# 구현체들
class CardPayment(PaymentMethod):
    def process(self, amount):
        print(f"카드로 {amount}원 결제")

class CashPayment(PaymentMethod):
    def process(self, amount):
        print(f"현금으로 {amount}원 결제")

# 새 결제 수단 추가: 기존 코드 수정 없음!
class CryptoPayment(PaymentMethod):
    def process(self, amount):
        print(f"암호화폐로 {amount}원 결제")

# 사용하는 쪽
class PaymentProcessor:
    def process(self, method: PaymentMethod, amount):
        method.process(amount)  # 어떤 구현체든 동작
```

**장점**: 새 결제 수단 = 새 클래스 추가만. 기존 코드 수정 없음.

## 🛠️ 적용 방법

| 기법 | 설명 |
|------|------|
| **추상 클래스/인터페이스** | 공통 계약 정의, 구현은 하위 클래스에 위임 |
| **[[Strategy Pattern]]** | 알고리즘을 캡슐화하여 교체 가능하게 |
| **[[Command Pattern]]** | 요청을 객체로 캡슐화 |
| **다형성** | 같은 인터페이스, 다른 구현 |
| **의존성 주입** | 구현체를 외부에서 주입 |

## 📊 OCP 위반 징후

| 징후 | 설명 |
|------|------|
| `if-else` / `switch` 체인 | 타입별 분기가 계속 늘어남 |
| 새 기능 = 기존 코드 수정 | 확장할 때마다 핵심 클래스 건드림 |
| 한 클래스가 너무 많은 책임 | 여러 타입의 로직이 한 곳에 |

## 🔍 OCP와 다른 원칙의 관계

```
OCP ←── 달성 수단 ──→ Strategy Pattern
 │                      Command Pattern
 │                      다형성
 │
 └──── 상호 보완 ────→ DIP (의존성 역전)
                      LSP (리스코프 치환)
```

- **[[Dependency Inversion Principle (DIP)|DIP]]**: 추상화에 의존 → OCP 달성 용이
- **[[Strategy Pattern]]**: OCP를 구현하는 대표적 패턴
- **LSP**: 하위 클래스가 상위를 대체 가능해야 OCP가 의미 있음

## ⚠️ 주의사항

- **과도한 추상화 금지**: 모든 것에 적용하면 복잡도만 증가
- **예측 가능한 확장점에 적용**: 변경 가능성이 높은 부분에 집중
- **YAGNI와 균형**: "나중에 필요할 것 같아서" 미리 추상화하지 말 것

## Relations

- part_of [[SOLID 원칙]] - SOLID의 두 번째 원칙
- achieved_by [[Strategy Pattern]] - 전략 패턴으로 OCP 구현
- achieved_by [[Command Pattern]] - 커맨드 패턴으로 OCP 구현
- supports [[Dependency Inversion Principle (DIP)]] - DIP가 OCP 달성을 도움
- related_to [[Inversion of Control (제어의 역전)]] - 제어 역전도 확장성 제공
