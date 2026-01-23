---
title: 패키지 (Package)
type: concept
tags:
- programming-basics
- concepts
- code-structures
permalink: knowledge/concepts/package
category: 코드 구조
difficulty: 초급
---

# 패키지 (Package)

여러 모듈을 디렉토리(폴더)로 구조화한 것입니다.

## 📖 개요

패키지는 관련된 모듈들을 폴더로 조직화한 것입니다. 많은 모듈이 있을 때 이들을 카테고리별로 폴더에 나누어 관리하면 코드 구조가 명확해집니다. Python의 패키지, Java의 package가 이에 해당합니다.

## 🎭 비유

레고 세트처럼 관련된 블록들을 하나의 상자에 담은 것입니다.

## ✨ 특징

- **계층적 구조**: 폴더 내 폴더로 깊이 있게 조직화
- **네임스페이스**: 모듈명 충돌 방지
- **명확한 의도**: 폴더명으로 역할 표현
- **유지보수 용이**: 관련 코드를 한 곳에서 관리

## 💡 예시

```
mypackage/
  ├── __init__.py
  ├── math/
  │   ├── __init__.py
  │   ├── basic.py      (덧셈, 뺄셈)
  │   └── advanced.py   (미적분, 통계)
  └── graphics/
      ├── __init__.py
      ├── 2d.py
      └── 3d.py
```

## Relations

- composed_of [[module]]
- part_of [[library]]
- similar_to [[framework]]

---

**난이도**: 초급
**카테고리**: 코드 구조
**마지막 업데이트**: 2026년 1월