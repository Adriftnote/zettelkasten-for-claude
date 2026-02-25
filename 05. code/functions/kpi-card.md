---
title: kpi-card
type: function
permalink: functions/kpi-card
level: low
category: frontend/ui/components
semantic: render kpi card by level
path: C:/claude-workspace/working/worker-frontend/figma-components/KpiCard.tsx
tags:
- typescript
- react
---

# kpi-card

KPI 레벨(본부/팀/개인)에 따라 색상이 다른 카드를 렌더링하는 함수형 컴포넌트.

## 시그니처

```typescript
export function KpiCard({ title, level }: KpiCardProps): JSX.Element
```

## Observations

- [impl] `LEVEL_STYLES[level]`로 레벨에 맞는 bg/text 색상 조회 후 인라인 스타일에 적용 #pattern
- [impl] 고정 크기(224×128px) + flex column 레이아웃으로 title(bold 16px)과 레벨 레이블(regular 12px, opacity 0.7) 렌더링 #figma
- [return] JSX `<div>` 컨테이너 — 내부에 title `<p>`와 level 레이블 `<p>` 포함
- [usage] `<KpiCard title="목표달성률" level="본부" />`
- [note] level 레이블은 `{level} KPI` 형식으로 하드코딩 출력 (예: "본부 KPI") #caveat

## Relations

- part_of [[KpiCard]] (소속 모듈)
- called_by (외부 페이지/뷰에서 직접 사용 — 내부 호출자 없음)
- data_flows_to (렌더링 결과 → DOM 출력)