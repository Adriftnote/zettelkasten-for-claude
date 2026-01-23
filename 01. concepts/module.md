---
title: 모듈 (Module)
type: concept
tags:
- programming-basics
- concepts
- code-structures
permalink: knowledge/concepts/module
category: 코드 구조
difficulty: 초급
---

# 모듈 (Module)

특정 기능을 수행하는 코드들을 하나의 파일로 묶은 것입니다.

## 📖 개요

모듈은 프로그래밍에서 코드를 구조화하는 기본 단위입니다. 하나의 파일이 하나의 모듈이며, 특정 기능에 관련된 함수와 변수들을 한데 모아 놓습니다. 다른 파일에서 모듈을 import하여 재사용할 수 있습니다.

## 🎭 비유

레고 블록 하나와 같습니다. 작지만 특정 기능을 가진 독립적인 부품입니다.

## ✨ 특징

- **파일 단위**: 하나의 파일 = 하나의 모듈
- **재사용 가능**: 다른 프로젝트에서도 사용 가능
- **코드 정리**: 관련 함수들을 한 곳에 모음
- **캡슐화**: 내부 구현 숨기고 인터페이스만 공개

## 💡 예시

```python
# math_utils.py (모듈)
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# main.py
import math_utils
result = math_utils.add(5, 3)  # 8
```

## Relations

- part_of [[package]]
- part_of [[library]]
- implements [[source-code]]

---

**난이도**: 초급
**카테고리**: 코드 구조
**마지막 업데이트**: 2026년 1월