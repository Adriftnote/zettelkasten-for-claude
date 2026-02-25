---
title: Figma 컴포넌트 라이브러리
type: project
permalink: projects/figma-component-library
level: high
category: frontend/ui/components
path: C:/claude-workspace/working/worker-frontend/figma-components
tags:
- react
- typescript
- figma
- css
---

# Figma 컴포넌트 라이브러리

Figma 디자인에서 추출한 React UI 컴포넌트와 디자인 토큰 모음.

## 개요

Figma Variables를 CSS Custom Properties로 변환하여 토큰 파일에 정의하고, 각 컴포넌트가 해당 토큰을 참조하는 구조. Figma ComponentSet의 Variant(Level=본부/팀/개인)를 React props로 매핑.

Figma 원본: https://www.figma.com/design/ncdAWEdge8uasRJhrANNha/KPI

## 코드 구성

**모듈**
- KpiCard: KPI 레벨별 카드 컴포넌트 (본부/팀/개인 3가지 Variant)
- tokens: Figma Variables 기반 CSS 디자인 토큰

**함수 (컴포넌트)**
- KpiCard: KPI 카드 렌더링 함수형 컴포넌트

## Relations

- contains [[KpiCard]] (KPI 카드 컴포넌트 모듈)
- contains [[tokens]] (CSS 디자인 토큰 모듈)