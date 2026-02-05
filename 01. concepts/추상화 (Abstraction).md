---
title: 추상화 (Abstraction)
type: concept
permalink: knowledge/concepts/abstraction
tags:
- oop
- software-design
- encapsulation
category: 프로그래밍/OOP
difficulty: 중급
---

# 추상화 (Abstraction)

복잡한 내부 구현을 숨기고 단순한 인터페이스만 노출하는 것

## 📖 개요

추상화는 "어떻게(How)"를 숨기고 "무엇을(What)"만 보여주는 개념입니다. 사용자는 내부 로직을 몰라도 기능을 사용할 수 있습니다.

## 🎭 비유

자동차 운전과 같습니다. 운전자는 엔진 내부 작동을 몰라도 핸들, 가속페달, 브레이크만 알면 운전할 수 있습니다.

## ✨ 특징

- **단순화**: 복잡한 것을 간단하게 보이게
- **인터페이스**: 사용법만 공개, 구현은 숨김
- **변경 용이**: 내부 수정해도 사용자 코드 영향 없음

## 💡 예시

```python
# 추상화된 인터페이스
validator = Validator()
result = validator.email("test@test.com")  # 내부 로직 몰라도 됨

# 내부 구현 (숨겨진 부분)
class Validator:
    def email(self, value):
        # 정규식 패턴 매칭
        # DNS MX 레코드 확인
        # 블랙리스트 체크
        # ... 복잡한 로직
        return is_valid
```

### 추상화 수준

```
높은 추상화 (High Level)
├── "이메일 검증해줘"           ← 사용자 관점
│
├── validator.email(value)     ← API 수준
│
├── 정규식 + DNS 체크          ← 로직 수준
│
└── 소켓 통신, 바이트 처리      ← 저수준
낮은 추상화 (Low Level)
```

## 🔄 추상화 vs 캡슐화

| 개념      | 초점  | 목적          |
| ------- | --- | ----------- |
| **캡슐화** | 묶기  | 관련된 것들을 하나로 |
| **추상화** | 숨기기 | 복잡성 감추기     |

**관계**: 캡슐화하면 추상화가 자연스럽게 따라옴

```
함수들을 클래스로 묶음 → 캡슐화
    ↓
사용자가 내부 구현 몰라도 사용 가능 → 추상화
```

## Relations

- relates_to [[캡슐화 (Encapsulation)]] (함께 사용되는 개념)
- part_of [[객체지향 프로그래밍 (OOP)]] (OOP의 핵심 원칙)
- used_by [[RPG (Repository Planning Graph)]] (V_H/V_L 추상화 수준 구분)

---

**난이도**: 중급
**카테고리**: 프로그래밍/OOP
**마지막 업데이트**: 2026년 2월
