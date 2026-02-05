---
title: AST (Abstract Syntax Tree)
type: concept
permalink: knowledge/concepts/ast
tags:
- compiler
- code-analysis
- programming-basics
category: 컴파일러/분석
difficulty: 중급
---

# AST (Abstract Syntax Tree)

소스 코드의 구조를 트리 형태로 표현한 것

## 📖 개요

AST는 코드의 문법 구조를 추상화한 트리입니다. 컴파일러, 인터프리터, 코드 분석 도구가 코드를 이해하기 위해 사용합니다. 불필요한 정보(괄호, 세미콜론 등)는 제거하고 의미 있는 구조만 남깁니다.

## 🎭 비유

문장의 품사 분석과 같습니다:
- "나는 밥을 먹는다" → 주어(나) + 목적어(밥) + 서술어(먹는다)
- 코드도 함수, 변수, 연산자 등으로 구조화됩니다.

## ✨ 특징

- **계층적 구조**: 트리 형태로 중첩 표현
- **추상화**: 불필요한 문법 요소 제거
- **언어 독립적**: 여러 언어에 적용 가능한 개념
- **분석 기반**: 코드 분석, 변환, 최적화의 기초

## 💡 예시

```python
# 원본 코드
def login(user):
    return True

# AST 구조
FunctionDef
├─ name: "login"
├─ args: 
│   └─ arg: "user"
└─ body:
    └─ Return
        └─ value: True
```

### Python에서 AST 확인

```python
import ast

code = "x = 1 + 2"
tree = ast.parse(code)
print(ast.dump(tree, indent=2))

# 출력:
# Module(body=[
#   Assign(
#     targets=[Name(id='x')],
#     value=BinOp(
#       left=Constant(value=1),
#       op=Add(),
#       right=Constant(value=2)))])
```

## Relations

- used_by [[RPG (Repository Planning Graph)]] (의존성 추출에 사용)
- relates_to [[dependency]] (AST로 의존성 분석)
- part_of [[compiler|컴파일러]] (컴파일 과정의 일부)
- enables [[source-code]] (소스 코드 분석 가능케 함)

---

**난이도**: 중급
**카테고리**: 컴파일러/분석
**마지막 업데이트**: 2026년 2월