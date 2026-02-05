---
title: 증분 업데이트 (Incremental Update)
type: concept
permalink: knowledge/concepts/incremental-update
tags:
- software-engineering
- optimization
- maintenance
category: 소프트웨어 공학
difficulty: 중급
---

# 증분 업데이트 (Incremental Update)

전체를 다시 처리하지 않고, 변경된 부분만 업데이트하는 방식

## 📖 개요

증분 업데이트는 시스템 전체를 재처리하지 않고 변경된 부분만 갱신하는 최적화 기법입니다. 시간과 리소스를 크게 절약할 수 있습니다. RPG-Encoder에서는 커밋 diff를 분석하여 해당 부분만 RPG를 업데이트함으로써 95.7%의 비용을 절감했습니다.

## 🎭 비유

책 전체를 다시 쓰지 않고, 오타가 난 페이지만 수정하는 것과 같습니다.

## ✨ 특징

- **효율성**: 변경 부분만 처리하여 리소스 절약
- **빠른 반영**: 전체 재빌드 없이 빠른 업데이트
- **변경 추적**: diff/delta 기반으로 변경 감지
- **일관성 유지**: 부분 업데이트 후에도 전체 일관성 보장

### 이벤트별 처리 방법

| 이벤트 | 처리 방법 |
|-------|----------|
| DELETE | 재귀적 정리 (recursive pruning) |
| MODIFY (마이너) | 제자리 업데이트 |
| MODIFY (주요) | 재라우팅 (삭제 후 재삽입) |
| INSERT | 의미론적 라우팅 |

## 💡 예시

```
전체 재처리 (비효율):
500개 파일 전체 분석 → 10분

증분 업데이트 (효율):
변경된 3개 파일만 분석 → 5초
→ 95.7% 비용 절감!
```

### 적용 분야

```
- 빌드 시스템: 변경된 파일만 재컴파일
- 데이터베이스: 변경된 레코드만 인덱스 갱신
- 검색 엔진: 새로운/수정된 문서만 재색인
- RPG: 커밋 diff 기반 그래프 업데이트
```

## Relations

- used_by [[RPG (Repository Planning Graph)]] (Evolution 메커니즘)
- relates_to [[의존성 (Dependency)]] (의존성 기반 영향 범위 파악)
- relates_to [[위상 정렬 (Topological Sort)]] (업데이트 순서 결정)

---

**난이도**: 중급
**카테고리**: 소프트웨어 공학
**핵심 수치**: 95.7% 오버헤드 감소 (RPG-Encoder)
**마지막 업데이트**: 2026년 2월