---
title: Metabase Model 학습 — 드롭다운 필터용 가상 테이블
type: workcase
permalink: sources/workcases/metabase-model-dropdown-filter
tags:
- workcase
- metabase
- model
- dropdown
- filter
---

# Metabase Model 학습 — 드롭다운 필터용 가상 테이블

> Dashboard에 기간 필터 드롭다운이 필요했으나 DB에 옵션 목록 테이블이 없어, Metabase Model로 해결하면서 학습한 내용

## 1. 전체 흐름

Dashboard 15에 기간 필터(오늘/이번 주/이번 달) 드롭다운 필요 → DB에 물리 테이블 없음 → Metabase Model로 가상 테이블 생성 → Field Filter로 연결

```
SQL Question (UNION ALL) → Turn into Model → Dashboard Field Filter → 드롭다운
```

## 2. 핵심 개념

### Model이란

- **저장된 Question을 테이블처럼 사용**하는 가상 테이블
- 복잡한 SQL을 한 번 정의하고 재사용
- 다른 Question에서 참조 가능 (Field Filter 등)
- DB에 물리 테이블 생성 없이 동일 효과

### 생성 흐름

1. SQL Question 생성 (UNION ALL로 정적 옵션 정의)
2. Question 저장 → ⋮ 메뉴 → "Turn into a model"
3. Dashboard 필터 → Field Filter → model.column 선택

### 실습 적용

- period_options Model을 Question 121로 생성
- Dashboard 15에서 드롭다운 필터로 연결
- Question 116-119이 period_options 드롭다운을 참조

## 3. 실제 적용

- DB 테이블 없이 드롭다운 구현: SQL UNION ALL → Model → Field Filter
- 정적 옵션 목록은 이 패턴이 가장 간단

## 관련 Task

- 작업일: 2025-12-10
- 원본: `C:\Projects\_archive\infra\metabase-model-learning\`

## Observations

- [fact] Metabase Model은 Question과 동일하게 ID를 가짐 — API로도 접근 가능 #metabase
- [pattern] Model 수정 시 참조하는 모든 곳에 자동 반영 — Single Source of Truth #metabase #model
- [method] 정적 옵션 목록은 UNION ALL SQL + Model이 가장 간단한 패턴 #metabase #dropdown
- [method] DB 테이블 없이 드롭다운 구현: SQL UNION ALL → Model → Field Filter #metabase #filter
- [tech] Model 생성: Question 저장 → ⋮ → "Turn into a model" #metabase

---

**관련 노트**: [[Metabase Dashboard Looker Studio Migration Plan]], [[NAS Docker 배포 경험 (n8n + Metabase)]]