---
title: 기계어 (Machine Language)
type: concept
tags:
- programming-basics
- concepts
- code-types
permalink: knowledge/concepts/machine-language
category: 코드의 종류
difficulty: 중급
---

# 기계어 (Machine Language)

CPU가 직접 이해하고 실행할 수 있는 0과 1의 명령어입니다.

## 📖 개요

기계어는 가장 낮은 수준의 프로그래밍 언어로, CPU의 명령어 세트에 정의된 형태입니다. 모든 고급 언어는 최종적으로 기계어로 변환되어 실행됩니다. 프로세서마다 다른 기계어를 사용합니다.

## 🎭 비유

뇌세포가 이해하는 전기 신호와 같습니다. 가장 근본적인 수준의 언어이며, 여기서 모든 계산이 실제로 일어납니다.

## ✨ 특징

- **이진법**: 0과 1로만 구성
- **CPU 종속성**: 프로세서마다 다름 (x86, ARM 등)
- **순수 숫자**: 인간이 직접 읽기 거의 불가능
- **최고 속도**: CPU가 즉시 실행

## 💡 예시

```
10110000 01100001  (ADD 명령)
11000111 01000101  (MOV 명령)

16진수: B8 61 C7 45
```

## Relations

- implements [[binary]]
- produced_by [[assembler]]
- produced_by [[compiler]]

---

**난이도**: 중급
**카테고리**: 코드의 종류
**마지막 업데이트**: 2026년 1월