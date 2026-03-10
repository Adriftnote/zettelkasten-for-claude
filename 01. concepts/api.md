---
title: API (Application Programming Interface)
type: concept
tags:
- programming-basics
- concepts
- code-structures
permalink: knowledge/concepts/api
category: 코드 구조
difficulty: 중급
---

# API (Application Programming Interface)

소프트웨어끼리 소통할 수 있게 해주는 규칙과 도구입니다.

## 📖 개요

API는 두 프로그램이 어떻게 상호작용할지를 정의합니다. 개발자는 API를 통해 다른 소프트웨어의 기능을 사용할 수 있습니다. 웹 API, 라이브러리 API, OS API 등 다양한 종류가 있습니다.

## 🎭 비유

레스토랑의 메뉴판과 같습니다. 주문 방법과 받을 수 있는 음식이 정해져 있습니다.

## ✨ 특징

- **표준화된 규칙**: 누구나 같은 방식으로 사용
- **문서화됨**: 사용 방법이 명확히 설명됨
- **확장성**: 새로운 기능 추가 가능
- **안정성**: 정의된 인터페이스는 변하지 않음

## 💡 예시

**웹 API 호출**:
```python
import requests
response = requests.get("https://api.weather.com/current")
weather = response.json()
print(weather['temperature'])
```

**API 종류**:
- **웹 API**: HTTP를 통한 통신 (카카오 지도, 날씨)
- **라이브러리 API**: 함수 호출 (Python `open()`)
- **OS API**: 운영체제 기능 (Windows API)

## 🔗 추상화와의 관계

API는 [[추상화 (Abstraction)|추상화]]의 **결과물**입니다.

| 구분 | 추상화 | API |
|------|--------|-----|
| 정의 | 복잡한 것을 단순하게 표현하는 **원칙** | 외부에 노출된 **인터페이스** |
| 성격 | 설계 철학, 과정 | 구체적인 계약, 산출물 |
| 비유 | 자동차 내부 엔진을 숨기는 **행위** | 운전대, 페달 같은 **조작 장치** |

> [!tip] 핵심
> **추상화** = "무엇을 숨기고 무엇을 보여줄지" 결정하는 **과정**
> **API** = 추상화를 통해 "보여주기로 한 것"의 **명세**

좋은 추상화가 좋은 API를 만듭니다.

## Relations

- result_of [[추상화 (Abstraction)]]
- provides_interface [[library]]
- provides_interface [[framework]]
- part_of [[sdk]]

---

**난이도**: 중급
**카테고리**: 코드 구조
**마지막 업데이트**: 2026년 1월