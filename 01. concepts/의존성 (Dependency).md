---
title: 의존성 (Dependency)
type: concept
permalink: knowledge/concepts/dependency
tags:
- programming-basics
- software-architecture
- code-structures
category: 소프트웨어 구조
difficulty: 중급
---

# 의존성 (Dependency)

"A가 B를 필요로 함" - 코드 간의 사용/참조 관계

## 📖 개요

의존성은 하나의 코드가 다른 코드를 필요로 하는 관계입니다. 내가 만든 코드끼리의 내부 의존성과, 외부 라이브러리에 대한 외부 의존성으로 구분됩니다. 프로젝트 규모가 커질수록 의존성 관리가 중요해지며, 파일 50개 이상부터는 자동화 도구가 필수입니다.

## 🎭 비유

집을 짓는 것에 비유하면:
- **내부 의존성**: 집 안의 방들 관계 (거실 → 주방 → 식당)
- **외부 의존성**: 외부에서 재료 구매 (시멘트, 철근)

## ✨ 특징

### 의존성 종류

| 유형 | 설명 | 예시 |
|-----|------|-----|
| 계층 의존성 | 부모-자식 포함 관계 | 패키지 → 모듈 |
| 데이터 흐름 | 사용 관계 | login → database |
| 실행 순서 | 먼저-나중 관계 | database → login |

### 내부 vs 외부 의존성

| 구분 | 내부 의존성 | 외부 의존성 |
|-----|-----------|-----------|
| 코드 | 내가 만듦 | 남이 만듦 |
| 수정 | 가능 | 불가 |
| 위치 | 내 폴더 안 | 별도 설치 |
| 관리 | 세밀하게 추적 | "사용함" 정도만 |

### 규모별 관리 가이드

- 🟢 **함수 1~5개**: 신경 안 써도 됨
- 🟡 **파일 3~10개**: 조금 신경 써야 함 ← 여기서부터!
- 🟠 **파일 10~50개**: 꼭 관리해야 함 (Excel 등)
- 🔴 **파일 50개 이상**: 자동화 도구 필수!

## 💡 예시

```python
# 내부 의존성
from database import find_user  # 내 파일
from utils import validate      # 내 파일

# 외부 의존성
import pandas  # 남이 만듦
import numpy   # 남이 만듦
```

## Relations

- relates_to [[module]] (모듈 간 의존성)
- relates_to [[library]] (라이브러리는 외부 의존성)
- relates_to [[package]] (패키지 간 의존성)
- relates_to [[code-granularity]] (규모에 따라 관리 방식 달라짐)
- tracked_by [[RPG (Repository Planning Graph)]] (RPG가 자동 추적)

---

**난이도**: 중급
**카테고리**: 소프트웨어 구조
**핵심**: 파일 10개 이상부터 의존성 관리 중요!
**마지막 업데이트**: 2026년 2월