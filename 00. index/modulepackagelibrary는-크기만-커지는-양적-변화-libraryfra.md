---
title: Module→Package→Library는 크기만 커지는 양적 변화, Library→Fra
type: note
permalink: synthesized/modulepackagelibrary는-크기만-커지는-양적-변화-libraryfra
tags: ["mental_model", "synthesized"]
evidence_count: 3
generated: 2026-03-17T07:54:24Z
sources:
  - "notes/library-vs-framework-call-direction"
  - "notes/library-vs-framework-call-direction"
  - "notes/library-vs-framework-call-direction"
---

## 통찰

- 코드의 추상화 수준이 높아질수록 복잡성이 증가하는 경향이 있으며, 이는 규모 확장과 관련된 중요한 고려 사항이다.
- IoC (제어의 역전) 원리는 라이브러리와 프레임워크를 구분하는 핵심적인 차이점을 제시하며, 이는 애플리케이션의 제어 흐름을 어떻게 관리하는지에 대한 전략을 결정한다.
- 프레임워크는 IoC를 통해 엄격한 규칙을 적용하여 일관된 동작을 보장하는 반면, 라이브러리는 유연성을 제공하기 위해 규칙을 무시할 수 있다.

## 근거

- notes/library-vs-framework-call-direction
- notes/library-vs-framework-call-direction
- notes/library-vs-framework-call-direction