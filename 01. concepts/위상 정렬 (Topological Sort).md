---
title: 위상 정렬 (Topological Sort)
type: concept
permalink: knowledge/concepts/topological-sort
tags:
- algorithm
- graph-theory
- dependency-resolution
category: 알고리즘
difficulty: 중급
---

# 위상 정렬 (Topological Sort)

의존성을 고려하여 실행 순서를 결정하는 알고리즘

## 📖 개요

위상 정렬은 방향 비순환 그래프(DAG)에서 노드들을 의존성 순서대로 나열하는 알고리즘입니다. A가 B에 의존하면, B가 A보다 먼저 나옵니다. 빌드 시스템, 작업 스케줄링, 코드 생성 순서 결정에 필수적입니다.

## 🎭 비유

건물 짓기 순서와 같습니다:
- 기초 → 기둥 → 벽 → 지붕
- 기초 없이 기둥을 세울 수 없듯이, 의존성을 고려한 순서가 필요합니다.

## ✨ 특징

- **선행 조건 보장**: 의존하는 것이 먼저 처리됨
- **순환 불가**: 순환 의존성이 있으면 불가능
- **여러 해 존재**: 정답이 하나가 아닐 수 있음
- **DAG 필수**: 방향 비순환 그래프에서만 가능

## 💡 예시

```
의존성 관계:
database.py → models.py → login.py → main.py

위상 정렬 결과 (실행 순서):
1. database.py
2. models.py
3. login.py
4. main.py

순환 의존성 (불가능):
A → B → C → A  ❌
```

### 실제 활용

```python
# 빌드 순서 결정
dependencies = {
    'main.py': ['login.py'],
    'login.py': ['models.py', 'database.py'],
    'models.py': ['database.py'],
    'database.py': []
}

# 위상 정렬 결과
build_order = ['database.py', 'models.py', 'login.py', 'main.py']
```

## Relations

- relates_to [[의존성 (Dependency)]] (의존성 해결에 사용)
- used_by [[RPG (Repository Planning Graph)]] (코드 생성 순서 결정)
- relates_to [[코드 수준 계층 (Code Granularity)]] (계층 간 순서)

---

**난이도**: 중급
**카테고리**: 알고리즘
**마지막 업데이트**: 2026년 2월