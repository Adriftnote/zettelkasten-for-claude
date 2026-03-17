---
title: REF-115 데이터 대시보드 UX 4원칙 — Glanceability, Hierarchy, Comparison, Actionability
type: guide
permalink: sources/reference/dashboard-ux-4-principles
tags:
- ux
- dashboard
- data-visualization
date: 2026-03-16
---

# 데이터 대시보드 UX 4원칙

데이터 대시보드 설계 시 핵심이 되는 4가지 UX 원칙 정리. 일반 UX(사용성, 접근성, 일관성 등)와 겹치지만, **정보 전달에 특화된 도메인 원칙**이라는 점에서 구분됨.

## 📖 핵심 아이디어

대시보드 UX의 본질은 **"인지 비용을 줄이는 것"**. 사용자가 보는 순간 현재 상태를 파악하고, 비교하고, 행동을 결정할 수 있어야 한다. 호버, 클릭, 필터 조작 등 추가 인터랙션은 핵심 정보가 아닌 세부 정보에만 허용.

## 🛠️ 4가지 원칙

| 원칙 | 핵심 질문 | 출처 |
|------|-----------|------|
| **Glanceability** (한눈에 파악) | "화면을 3초 봤을 때 상태를 알 수 있는가?" | Stephen Few, *Information Dashboard Design* |
| **Information Hierarchy** (정보 위계) | "가장 중요한 정보가 가장 눈에 띄는가?" | Edward Tufte, *data-ink ratio* |
| **Comparison** (비교 가능성) | "시간·채널·콘텐츠 간 비교가 바로 되는가?" | Edward Tufte — "시각화의 본질은 비교" |
| **Actionability** (행동 유도) | "이걸 보고 다음에 뭘 해야 하는지 아는가?" | Ben Shneiderman, *Visual Information Seeking Mantra* |

## 🔧 원칙별 적용 패턴

### 1. Glanceability
- 숫자 옆에 **전주/전일 대비 증감률** 기본 표시 (호버 아닌 노출)
- 차트에 peak/valley **마커 + 날짜 라벨** 기본 노출
- 시간축은 ISO 포맷 대신 **상대 시간** ("3시간 전", "어제 오후 2시")
- 현재 시점 최신 값은 항상 보이게

### 2. Information Hierarchy
- "모든 정보가 같은 크기면, 아무것도 중요하지 않다"
- **이상 징후 자동 강조** — 평소 대비 급등/급락 시 카드 색상·크기 변화
- 핵심 KPI는 크게, 세부 지표는 작게
- Tufte의 data-ink ratio: 장식 최소화, 모든 시각 요소는 정보 전달 목적

### 3. Comparison
- **시간 비교**: "오늘 vs 어제", "이번 주 vs 지난 주" 오버레이 토글
- **플랫폼 간 비교**: 같은 콘텐츠의 플랫폼별 성과 비율 시각화
- **기준선**: 평균선, 목표선으로 "잘 가고 있는지" 즉시 판단
- 단일 시계열만으로는 트렌드 판단 불가

### 4. Actionability
- **"그래서 뭐?" 테스트** — 각 차트/숫자를 보고 어떤 행동을 해야 하는지 답이 없으면 불필요한 정보
- 단순 나열 대신 **프레이밍** — "이번 주 베스트", "성과 부진"
- **알림 임계값** — 특정 조건(조회수 1만 돌파, 전일 대비 50% 하락) 시 시각적 알림
- Progressive disclosure: 요약→클릭→상세. 단, 핵심은 요약 레벨에 이미 존재

## 💡 실용적 평가 / 적용

### 일반 UX와의 관계
일반 UX 원칙(사용성, 접근성, 일관성, 피드백, 학습용이성)의 하위 집합이 아니라, **데이터 시각화라는 도메인에서 재해석한 전문 원칙**. 일반 UX가 "사용자가 목표를 달성할 수 있는가"라면, 대시보드 UX는 "사용자가 데이터를 보고 판단할 수 있는가"에 집중.

### 검증 체크리스트
- [ ] 3초 룰: 화면을 3초 봤을 때 "상황이 좋은지 나쁜지" 알 수 있는가?
- [ ] 호버 의존성: 핵심 수치가 호버 없이 보이는가?
- [ ] 비교 가능: 어제/지난주와 비교할 수 있는가?
- [ ] 행동 연결: 각 시각화를 보고 "다음에 할 일"이 떠오르는가?

### 참고 문헌
- Stephen Few, *Information Dashboard Design* (2006, 2013 2nd ed.)
- Edward Tufte, *The Visual Display of Quantitative Information* (1983, 2001 2nd ed.)
- Ben Shneiderman, "The Eyes Have It" (1996) — Visual Information Seeking Mantra: "Overview first, zoom and filter, then details on demand"

## 🔗 관련 개념

- [[Figma 컴포넌트 라이브러리]] - (대시보드 UI 컴포넌트 구현 — KpiCard 등 시각화 컴포넌트와 연결)
- [[SNS 게시물별 조회수 추적]] - (이 원칙이 적용되는 실제 대시보드 프로젝트)

---

**작성일**: 2026-03-16
**분류**: UX / 데이터 시각화