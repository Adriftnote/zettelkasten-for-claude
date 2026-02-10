---
title: Dependency Inversion Principle (DIP)
type: concept
tags: [solid, design-principles, oop, software-architecture]
permalink: knowledge/concepts/dependency-inversion-principle
category: 설계 원칙
difficulty: 중급
created: 2026-01-22
---

# Dependency Inversion Principle (DIP)

**"고수준 모듈이 저수준 모듈에 의존하면 안 된다. 둘 다 추상화에 의존해야 한다."**

SOLID 원칙 중 다섯 번째(D). 의존성의 방향을 역전시켜 유연한 설계를 만드는 원칙입니다.

## 📖 개요

DIP의 두 가지 규칙:

1. **고수준 모듈은 저수준 모듈에 의존하면 안 된다** → 둘 다 추상화에 의존
2. **추상화는 세부사항에 의존하면 안 된다** → 세부사항이 추상화에 의존

```
[일반적 의존]           [DIP 적용]
고수준 → 저수준         고수준 → 추상화 ← 저수준
                              ↑
                         의존성 역전!
```

## 🎭 비유

### ❌ DIP 위반: 특정 브랜드 전용
```
노트북 ──의존──→ 삼성 충전기 (구체적)
→ 삼성 충전기 없으면 노트북 못 씀
```

### ✅ DIP 준수: USB-C 표준
```
노트북 ──의존──→ USB-C (추상화) ←──의존── 삼성 충전기
                    ↑                    LG 충전기
                    │                    애플 충전기
              표준 인터페이스
```

노트북(고수준)과 충전기(저수준) 모두 USB-C(추상화)에 의존. 어떤 제조사 충전기든 사용 가능.

## 💡 예시

### ❌ DIP 위반

```python
class MySQLDatabase:
    def save(self, data):
        print(f"MySQL에 저장: {data}")

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # 구체 클래스에 직접 의존!

    def create_user(self, name):
        self.db.save({"name": name})
```

**문제**: `UserService`가 `MySQLDatabase`에 직접 의존
- PostgreSQL로 바꾸려면 `UserService` 수정 필요
- 테스트 시 실제 DB 연결 필요

### ✅ DIP 준수

```python
from abc import ABC, abstractmethod

# 추상화 (인터페이스)
class Database(ABC):
    @abstractmethod
    def save(self, data):
        pass

# 저수준 모듈: 추상화에 의존
class MySQLDatabase(Database):
    def save(self, data):
        print(f"MySQL에 저장: {data}")

class PostgreSQLDatabase(Database):
    def save(self, data):
        print(f"PostgreSQL에 저장: {data}")

class MockDatabase(Database):  # 테스트용
    def save(self, data):
        print(f"Mock 저장: {data}")

# 고수준 모듈: 추상화에 의존
class UserService:
    def __init__(self, db: Database):  # 추상화 타입!
        self.db = db

    def create_user(self, name):
        self.db.save({"name": name})

# 사용
service = UserService(MySQLDatabase())      # 프로덕션
service = UserService(PostgreSQLDatabase()) # 다른 DB
service = UserService(MockDatabase())       # 테스트
```

**장점**:
- DB 교체 시 `UserService` 코드 수정 불필요
- 테스트 시 Mock 객체 주입 가능

## 🔄 IoC vs DIP 차이

|           | IoC (제어의 역전)    | DIP (의존성 역전)     |
| --------- | --------------- | ---------------- |
| **초점**    | 제어 흐름           | 의존성 방향           |
| **질문**    | "누가 누구를 호출하는가?" | "누가 누구에게 의존하는가?" |
| **역전 대상** | 호출 방향           | 의존 방향            |
| **예시**    | 프레임워크가 내 코드 호출  | 고수준이 추상화에 의존     |

```
IoC: 프레임워크 ──호출──→ 내 코드
DIP: 고수준 ──의존──→ 추상화 ←──의존── 저수준
```

둘은 관련 있지만 **다른 개념**입니다. [[Inversion of Control (제어의 역전)|IoC]] 참조.

## 🛠️ 적용 방법

| 기법 | 설명 |
|------|------|
| **인터페이스/추상 클래스** | 의존할 추상화 정의 |
| **의존성 주입 (DI)** | 생성자/메서드로 의존성 주입 |
| **팩토리 패턴** | 객체 생성을 별도 클래스에 위임 |
| **DI 컨테이너** | Spring, Angular 등 프레임워크 활용 |

## 📊 계층 구조에서의 DIP

```
[일반적 계층]                 [DIP 적용]
Presentation                 Presentation
     ↓                            ↓
  Business  ──→               Business ──→ Interface
     ↓                            ↑            ↑
Data Access                  Data Access ─────┘

→ Business가 Data Access에      → 둘 다 Interface에 의존
  직접 의존                        의존성 역전!
```

## ⚠️ 주의사항

- **과도한 추상화 금지**: 단순한 경우는 직접 의존도 OK
- **인터페이스 폭발 방지**: 모든 클래스에 인터페이스 만들 필요 없음
- **안정된 의존성**: 자주 변경되는 것에만 추상화 적용

## Relations

- part_of [[SOLID 원칙]] - SOLID의 다섯 번째 원칙
- enables [[Open-Closed Principle (OCP)]] - DIP가 OCP 달성을 도움
- related_to [[Inversion of Control (제어의 역전)]] - 관련 있지만 다른 개념
- implemented_by [[Strategy Pattern]] - 전략 패턴이 DIP 활용
- implemented_by [[dependency-injection]] - DI가 DIP 구현 방법 중 하나
