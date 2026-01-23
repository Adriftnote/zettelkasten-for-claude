---
title: 프레임워크 (Framework)
type: concept
tags:
- programming-basics
- concepts
- code-structures
permalink: knowledge/concepts/framework
category: 코드 구조
difficulty: 중급
---

# 프레임워크 (Framework)

애플리케이션 개발을 위한 골격과 규칙을 제공하는 소프트웨어 구조입니다.

## 📖 개요

프레임워크는 라이브러리와 달리, 개발자가 작성한 코드를 호출합니다. 프레임워크가 전체 구조를 결정하고, 개발자는 정해진 틀 내에서 기능을 구현합니다. 웹 개발, 게임 개발, 모바일 앱 개발 등 다양한 분야에 프레임워크가 있습니다.

## 🎭 비유

조립식 가구 세트와 같습니다. 틀과 규칙이 정해져 있어서, 그 안에서 작업하면 됩니다.

## ✨ 특징

- **구조 제공**: 애플리케이션의 골격 제공
- **규칙 강제**: 따라야 할 패턴과 규칙 정의
- **통합 기능**: 라우팅, 데이터베이스, 템플릿 등 포함
- **개발 속도**: 반복적인 코드 줄임

## 🔄 제어의 역전 (Inversion of Control)

프레임워크의 핵심은 [[Inversion of Control (제어의 역전)|제어의 역전 (IoC)]]입니다.

**일반 코드**: 내가 코드를 호출 (I call the code)
```python
response = requests.get('https://api.example.com')  # 내가 호출
```

**프레임워크**: 프레임워크가 내 코드를 호출 (Framework calls my code)
```python
def index(request):  # Django가 알아서 호출함
    return HttpResponse("Hello")
```

이 차이 때문에 프레임워크는 **구조와 규칙이 포함된 [[source-code|소스코드]]**이며, 정해진 틀 안에서 작업해야 합니다.

자세한 내용은 [[Inversion of Control (제어의 역전)|제어의 역전]] 참조.

## 💡 예시

- **웹**: Django (Python), Spring (Java), Express (JavaScript)
- **모바일**: Flutter, React Native
- **게임**: Unity, Unreal Engine

## Relations

- implements [[Inversion of Control (제어의 역전)]]
- similar_to [[library]]
- implements [[source-code]]
- part_of [[sdk]]
- provides [[api]]

---

**난이도**: 중급
**카테고리**: 코드 구조
**마지막 업데이트**: 2026년 1월