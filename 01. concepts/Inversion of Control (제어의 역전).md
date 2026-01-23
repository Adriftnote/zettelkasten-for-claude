---
title: Inversion of Control (제어의 역전)
type: concept
permalink: knowledge/concepts/inversion-of-control
tags:
- programming-basics
- concepts
- design-patterns
category: 디자인 패턴
difficulty: 중급
---

# Inversion of Control (제어의 역전)

프로그램의 제어 흐름을 개발자가 아닌 **프레임워크나 외부 시스템이 결정**하는 설계 원칙입니다.

## 📖 개요

일반적인 프로그래밍에서는 개발자가 작성한 코드가 라이브러리 함수를 호출합니다. IoC는 이를 **"역전"**시켜, 프레임워크가 개발자의 코드를 호출하도록 만듭니다.

**핵심 질문**: **"누가 누구를 호출하는가?"**

```
일반적인 방식:  내 코드 → 라이브러리 호출
IoC 방식:       프레임워크 → 내 코드 호출
```

## 🎭 비유

### 일반 방식 = 레시피북
```
나: "오늘 파스타 만들자"
나: (레시피북 펼침) "1. 물 끓이기, 2. 면 삶기..."
→ 내가 언제, 무엇을, 어떻게 할지 결정
```

### IoC 방식 = 요리학원
```
학원: "오늘은 파스타 수업입니다"
학원: "1번 자리에 앉으세요" (정해진 구조)
학원: "재료는 여기 있습니다" (제공되는 기능)
학원: "제가 '시작'하면 만드세요" (학원이 호출)
나: (정해진 자리에서 정해진 순서대로 요리)
→ 학원이 전체 흐름 통제, 나는 정해진 틀 안에서 작업
```

## ✨ 특징

- **제어 흐름 역전**: 개발자가 아닌 시스템이 흐름 제어
- **규칙 강제**: 정해진 인터페이스/구조 따라야 함
- **느슨한 결합**: 구현체를 외부에서 주입
- **유연성 증가**: 코드 변경 없이 동작 교체 가능

## 💡 예시

### 1. 일반 방식 (내가 호출)

```python
import requests

# 내가 코드를 호출
response = requests.get('https://api.example.com')
data = response.json()
print(data)
```

→ **내가 주도권을 가짐** (I call the code)

### 2. IoC 방식 (프레임워크가 호출)

```python
# Django 프레임워크
def index(request):  # 반드시 이 형식으로 작성해야 함
    return HttpResponse("Hello")

# 내가 이 함수를 직접 호출하지 않음!
# Django가 HTTP 요청이 오면 자동으로 index() 호출
```

→ **프레임워크가 내 코드를 호출** (Framework calls my code)

### 3. 이벤트 핸들러 (브라우저가 호출)

```javascript
// 내가 함수 정의
function handleClick() {
  console.log("클릭됨!");
}

// 브라우저에 등록만 함
button.addEventListener('click', handleClick);

// 내가 handleClick()을 직접 호출하지 않음
// 사용자가 버튼 클릭하면 브라우저가 handleClick() 호출
```

→ **브라우저가 내 코드를 호출**

### 4. 의존성 주입 (DI)

```python
# IoC 없이 (직접 생성)
class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # 직접 의존성 생성

# IoC 적용 (외부에서 주입)
class UserService:
    def __init__(self, database):  # 외부에서 받음
        self.db = database

# 사용
db = MySQLDatabase()
service = UserService(db)  # 의존성 주입
```

→ **외부에서 제어**

## 📊 비교표

| | 일반 코드 | IoC 적용 |
|---|---|---|
| **호출 방향** | 내가 코드 호출 | 시스템이 내 코드 호출 |
| **제어권** | 개발자 | 프레임워크/시스템 |
| **구조 결정** | 자유롭게 설계 | 정해진 틀 따라야 함 |
| **규칙 강제** | 권장사항 (무시 가능) | 필수 (안 따르면 작동 안 함) |
| **예시** | 라이브러리 사용 | 프레임워크, 이벤트 핸들러 |

## 🔍 IoC가 적용된 곳

| 영역 | 설명 | 예시 |
|------|------|------|
| **[[framework\|프레임워크]]** | 프레임워크가 개발자 코드 호출 | Django, Spring, React |
| **이벤트 핸들러** | 이벤트 발생 시 시스템이 호출 | `addEventListener`, `onClick` |
| **의존성 주입 (DI)** | 외부에서 의존성 주입 | Spring DI, Angular DI |
| **템플릿 메서드** | 상위 클래스가 하위 구현 호출 | 디자인 패턴 |
| **콜백 함수** | 시스템이 콜백 호출 | `setTimeout`, `Promise.then` |

## 🎯 장단점

### 장점
- **유연성**: 구현체 교체 쉬움
- **테스트 용이**: Mock 객체 주입 가능
- **느슨한 결합**: 모듈 간 의존성 감소
- **재사용성**: 공통 로직 프레임워크에 집중

### 단점
- **학습 곡선**: 초보자에게 어려움
- **복잡도 증가**: 흐름 파악 어려울 수 있음
- **디버깅 어려움**: 호출 스택 복잡
- **규칙 강제**: 정해진 틀 따라야 함

## Relations

- used_by [[framework]]
- similar_to [[library]]
- implements [[source-code]]
- relates_to [[dependency-injection]]
- relates_to [[design-pattern]]

---

**난이도**: 중급
**카테고리**: 디자인 패턴
**마지막 업데이트**: 2026년 1월
