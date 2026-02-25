---
title: KpiCard
type: module
permalink: modules/kpi-card
level: high
category: frontend/ui/components
semantic: render kpi level card
path: C:/claude-workspace/working/worker-frontend/figma-components/KpiCard.tsx
tags:
- typescript
- react
- figma
---

# KpiCard

KPI 레벨(본부/팀/개인)에 따라 색상이 다르게 렌더링되는 React 카드 컴포넌트.

## 개요

Figma KPI ComponentSet(Node 2:28)의 3가지 Variant를 `level` prop으로 제어. LEVEL_STYLES 맵으로 레벨별 배경색·텍스트색을 관리하며, CSS Custom Properties(tokens.css)를 fallback으로 사용하는 인라인 스타일 방식.

## Observations

- [impl] `LEVEL_STYLES` 상수 맵으로 Level→{bg, text} 매핑. `var(--token, fallback)` 패턴으로 CSS 토큰 우선 적용 #pattern
- [impl] 인라인 스타일 방식 사용 — 외부 CSS 클래스 없이 Figma 스펙(224×128px, padding 16px, border-radius 8px) 그대로 적용 #figma
- [deps] React (JSX), tokens.css (CSS Custom Properties) #import
- [usage] `<KpiCard title="목표달성률" level="본부" />`
- [note] `level` prop은 `"본부" | "팀" | "개인"` 한국어 리터럴 유니온 타입 #caveat

## 타입 정의

```typescript
type Level = "본부" | "팀" | "개인";

interface KpiCardProps {
  title: string;
  level: Level;
}

const LEVEL_STYLES: Record<Level, { bg: string; text: string }> = {
  본부: { bg: "var(--level1-bg, #7b61ff)", text: "var(--level1-text, #ffffff)" },
  팀:   { bg: "var(--level2-bg, #9b7fff)", text: "var(--level2-text, #ffffff)" },
  개인: { bg: "var(--level3-bg, #bba8ff)", text: "var(--level3-text, #333333)" },
};
```

## Figma 매핑

| Figma Variant | level prop | bg token | text token |
|---|---|---|---|
| Level=본부 KPI (2:19) | `"본부"` | `--level1-bg` #7b61ff | `--level1-text` #ffffff |
| Level=팀 KPI (2:22) | `"팀"` | `--level2-bg` #9b7fff | `--level2-text` #ffffff |
| Level=개인 KPI (2:25) | `"개인"` | `--level3-bg` #bba8ff | `--level3-text` #333333 |

## Relations

- part_of [[Figma 컴포넌트 라이브러리]] (소속 프로젝트)
- contains [[kpi-card]] (KpiCard 함수형 컴포넌트)
- depends_on [[tokens]] (CSS 디자인 토큰 참조)