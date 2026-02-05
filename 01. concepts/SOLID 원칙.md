---
title: SOLID 원칙
type: concept
permalink: knowledge/concepts/solid
tags:
- software-engineering
- design-principles
- oop
category: 설계 원칙
difficulty: 중급
---

# SOLID 원칙

객체지향 설계의 5가지 핵심 원칙

## 📖 개요

SOLID는 Robert C. Martin(Uncle Bob)이 정리한 객체지향 설계의 5가지 원칙입니다. 각 원칙의 앞글자를 따서 SOLID라고 부릅니다. 이 원칙들을 따르면 유지보수하기 쉽고, 확장 가능하며, 테스트하기 쉬운 코드를 작성할 수 있습니다.

## ✨ 5가지 원칙

### S - 단일 책임 원칙 (Single Responsibility)

```
"한 클래스는 한 가지 일만!"

❌ 나쁜 예:
class User:
    def login(): ...
    def send_email(): ...
    def generate_report(): ...

✅ 좋은 예:
class User: ...
class EmailService: ...
class ReportGenerator: ...
```

### O - 개방/폐쇄 원칙 (Open/Closed)

```
"확장에는 열고, 수정에는 닫기"

→ 새 기능 추가 시 기존 코드 수정 없이
→ 새 클래스/함수 추가로 해결

비유: 스마트폰에 앱 추가 (OS 수정 안 함)
```

### L - 리스코프 치환 원칙 (Liskov Substitution)

```
"자식은 부모를 대체할 수 있어야"

→ 부모 클래스 자리에 자식 클래스 넣어도
→ 프로그램이 정상 동작해야 함

비유: 리모컨 → TV리모컨, 에어컨리모컨 교체 가능
```

### I - 인터페이스 분리 원칙 (Interface Segregation)

```
"필요한 것만 의존하기"

❌ 나쁜 예:
interface Machine:
    print(), scan(), fax()
→ 프린터만 있는데 fax() 구현해야?

✅ 좋은 예:
interface Printer: print()
interface Scanner: scan()
interface Fax: fax()
```

### D - 의존성 역전 원칙 (Dependency Inversion)

```
"구체가 아닌 추상에 의존"

❌ 나쁜 예:
class Login:
    def __init__(self):
        self.db = MySQLDatabase()  # 구체 클래스

✅ 좋은 예:
class Login:
    def __init__(self, db: Database):  # 추상 인터페이스
        self.db = db
```

## 🎭 비유

레고 블록 규칙과 같습니다:
- **S**: 각 블록은 한 가지 모양
- **O**: 새 블록 추가해도 기존 블록 안 바꿈
- **L**: 같은 크기 블록은 서로 교체 가능
- **I**: 필요한 연결부만 사용
- **D**: 블록 규격(추상)에 맞추면 어떤 블록이든 연결

## 💡 예시

```python
# SOLID 적용 전
class OrderService:
    def create_order(self, data):
        # 검증도 하고
        # DB 저장도 하고
        # 이메일도 보내고
        # 로그도 남기고
        pass  # 500줄...

# SOLID 적용 후
class OrderValidator: ...      # S: 검증만
class OrderRepository: ...     # S: 저장만
class NotificationService: ... # S: 알림만
class OrderService:            # 조율만
    def __init__(self, validator, repo, notifier):
        ...
```

## Relations

- implements [[클린 아키텍처 (Clean Architecture)]] (클린 아키텍처의 기반)
- reduces [[기술 부채 (Technical Debt)]] (원칙 준수로 부채 감소)
- relates_to [[의존성 (Dependency)]] (D 원칙이 의존성 관리)
- extends [[Dependency Inversion Principle (DIP)]] (D 원칙 상세)

---

**난이도**: 중급
**카테고리**: 설계 원칙
**제안자**: Robert C. Martin (Uncle Bob)
**마지막 업데이트**: 2026년 2월