---
title: tokens
type: module
permalink: modules/tokens-css
level: high
category: frontend/ui/design-tokens
semantic: define figma design tokens
path: C:/claude-workspace/working/worker-frontend/figma-components/tokens.css
tags:
- css
- figma
- design-tokens
---

# tokens

Figma Variables에서 추출한 CSS Custom Properties 디자인 토큰 파일.

## 개요

Figma KPI 컴포넌트셋의 Variables를 `:root` CSS Custom Properties로 변환. 이 파일을 수정하면 모든 컴포넌트에 자동 반영(Layer 2: STYLE). 컴포넌트는 `var(--token, fallback)` 패턴으로 토큰을 참조하므로 이 파일 없이도 동작.

Figma 원본: https://www.figma.com/design/ncdAWEdge8uasRJhrANNha/KPI

## Observations

- [impl] 3개 레벨(level1=본부, level2=팀, level3=개인) × 2개 색상(bg, text) = 6개 컬러 토큰 #figma
- [impl] 카드 레이아웃 토큰(padding, border-radius), 타이포그래피 토큰(font-family, size, weight) 포함 #design-tokens
- [deps] 의존성 없음 — 순수 CSS Custom Properties #import
- [usage] HTML에 `<link rel="stylesheet" href="tokens.css" />` 또는 번들러에서 import
- [note] 컴포넌트(KpiCard)가 fallback 값을 가지므로 이 파일은 선택적 의존성 #caveat

## 토큰 목록

```css
:root {
  /* Level Colors */
  --level1-bg: #7b61ff;      /* 본부 배경 */
  --level1-text: #ffffff;    /* 본부 텍스트 */
  --level2-bg: #9b7fff;      /* 팀 배경 */
  --level2-text: #ffffff;    /* 팀 텍스트 */
  --level3-bg: #bba8ff;      /* 개인 배경 */
  --level3-text: #333333;    /* 개인 텍스트 */

  /* Card */
  --card-padding: 16px;
  --card-border-radius: 8px;

  /* Typography */
  --font-primary: 'Inter', 'Noto Sans KR', sans-serif;
  --font-size-title: 16px;
  --font-size-subtitle: 12px;
  --font-weight-bold: 700;
  --font-weight-regular: 400;
}
```

## Relations

- part_of [[Figma 컴포넌트 라이브러리]] (소속 프로젝트)
- data_flows_to [[KpiCard]] (토큰을 KpiCard 컴포넌트가 참조)