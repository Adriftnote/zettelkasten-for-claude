---
title: 클린 아키텍처 (Clean Architecture)
type: concept
permalink: knowledge/concepts/clean-architecture
tags:
- software-architecture
- design-pattern
- uncle-bob
category: 소프트웨어 아키텍처
difficulty: 고급
---

# 클린 아키텍처 (Clean Architecture)

의존성이 안쪽으로만 향하는 동심원 구조의 소프트웨어 아키텍처

## 📖 개요

클린 아키텍처는 Robert C. Martin(Uncle Bob)이 제안한 아키텍처 패턴입니다. 핵심 비즈니스 로직을 외부 요소(DB, UI, 프레임워크)로부터 독립시켜, 변경에 유연하고 테스트하기 쉬운 구조를 만듭니다. 의존성은 반드시 바깥에서 안쪽으로만 향해야 합니다.

## 🎭 비유

양파 구조와 같습니다. 가장 안쪽에 핵심(비즈니스 규칙)이 있고, 껍질을 벗겨도 핵심은 변하지 않습니다. DB를 MySQL에서 PostgreSQL로 바꿔도 핵심 로직은 그대로입니다.

## ✨ 특징

### 동심원 구조 (안쪽 → 바깥)

```
[중심] Entities: 핵심 비즈니스 규칙
  ↓
[안쪽] Use Cases: 애플리케이션 로직
  ↓
[중간] Adapters: 인터페이스 변환
  ↓
[바깥] Frameworks: DB, 웹, UI
```

### 핵심 규칙

- **의존성 방향**: 바깥 → 안쪽으로만!
- **핵심 독립**: 비즈니스 로직은 외부에 의존하지 않음
- **테스트 용이**: 핵심만 따로 테스트 가능

### 장단점

| 장점 | 단점 |
|-----|-----|
| 핵심 로직 독립적 | 초기 개발 느림 |
| DB/프레임워크 교체 쉬움 | 파일 수 많아짐 |
| 테스트 용이 | 작은 프로젝트에 과함 |
| 장기 유지보수 좋음 | 학습 곡선 있음 |

## 💡 예시

```
# 간단한 구조 (login 하나에 1파일)
login.py (100줄)

# 클린 아키텍처 (login 하나에 6파일)
domain/
├── entities/user.py
├── use_cases/login_use_case.py
adapters/
├── repositories/user_repository.py
├── controllers/login_controller.py
infrastructure/
├── db/user_db.py
└── web/login_api.py
```

### 적합한 상황

```
🟢 대규모 (10만 줄+): 필수!
🟡 중간 (1만 줄): 고려
🔴 소규모 (1천 줄): 과함
```

## Relations

- implements [[SOLID 원칙]] (SOLID 기반 설계)
- reduces [[기술 부채 (Technical Debt)]] (장기적 부채 감소)
- relates_to [[의존성 (Dependency)]] (의존성 방향 관리)
- similar_to [[hexagonal-architecture|헥사고날 아키텍처]] (Ports & Adapters)
- uses [[Domain Driven Design (DDD)]] (도메인 레이어에 DDD 개념 활용)
- used_by [[RPG (Repository Planning Graph)]] (구조 시각화)

---

**난이도**: 고급
**카테고리**: 소프트웨어 아키텍처
**제안자**: Robert C. Martin (Uncle Bob)
**마지막 업데이트**: 2026년 2월