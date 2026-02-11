---
title: LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크
type: doc-summary
permalink: sources/reference/liftkit-ui-framework
tags:
- ui-framework
- design-system
- frontend
- next-js
- accessibility
date: 2026-02-11
---

# LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크

개발자를 "더 나은 디자이너"로 만들어주는 플랫폼 독립적 UI 프레임워크로, 황금비율, 광학적 대칭, 접근성 대비를 자동으로 적용한다.

## 📖 핵심 아이디어

LiftKit는 디자인 공식을 코드에 내재화하여 개발자가 의식하지 않아도 정교한 디자인 원칙을 준수하도록 한다. 유틸리티 클래스를 제공하되, 백그라운드에서 황금비율 스케일링, 광학적 대칭, 접근성 대비 검증을 자동 처리한다. shadcn 기반 컴포넌트 시스템으로 Next.js 프로젝트와 원활하게 통합된다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **핵심 디자인 공식** | 황금비율 스케일링, 광학적 대칭, 대비율 검증 |
| **기술 스택** | CSS3 (50.5%), TypeScript (46.3%), Next.js 기반 |
| **컴포넌트 시스템** | shadcn 기반, 의존성 자동 포함 (예: Badge → Icon) |
| **설정 파일** | `components.json` (레지스트리), `tailwind.config.ts` (디자인 시스템) |
| **통합 도구** | Figma (커뮤니티 템플릿), Webflow (템플릿) |
| **라이선스** | Apache-2.0 |

## 🔧 작동 방식 / 적용 방법

### 설치 방법

```bash
# 템플릿에서 시작
git clone [liftkit-template-repo]
npm install

# 기존 프로젝트에 추가
npm install @chainlift/liftkit --save-dev
npx liftkit init
npm run add [component-name]    # 개별 컴포넌트
npm run add --all               # 모든 컴포넌트
npm run add --base              # 기본 CSS/타입만
```

### CSS 설정

```css
/* globals.css */
@import url("@/lib/css/index.css");
```

### 자동 디자인 원칙 적용 흐름

```
개발자가 컴포넌트 사용
    ↓
LiftKit 유틸리티 클래스 적용
    ↓
백그라운드 자동 처리:
├── 황금비율 스케일링 (간격, 크기)
├── 광학적 대칭 (시각적 정렬)
└── 대비율 검증 (WCAG 준수)
    ↓
빌드 시 tree-shaking (미사용 CSS 제거)
```

## 💡 실용적 평가 / 적용

**강점:**
- 디자인 원칙을 자동화하여 일관성 있는 UI 생성
- 접근성 기준 자동 준수로 WCAG 검증 용이
- Tailwind CSS 없이도 사용 가능 (config만 필요)
- 사용하지 않는 CSS 자동 제거로 번들 크기 최적화

**한계:**
- Figma 템플릿이 미완성 상태
- 컴포넌트 문서화 부족 (카탈로그 미제공)
- React 19 호환성 고려 필요
- 파트타임 메인테이너로 업데이트 속도 제한적
- Button 컴포넌트의 padding props 제어 제한

**적용 방안:**
- Next.js 프로젝트에서 디자인 시스템 구축 시 활용
- 접근성이 중요한 프로젝트 (공공기관, 금융 등)
- shadcn/ui 생태계와 통합하여 컴포넌트 확장

## 🔗 관련 개념

- [[shadcn-ui]] - 컴포넌트 스캐폴딩 기반
- [[Next.js]] - 주 타겟 프레임워크
- [[WCAG]] - 접근성 기준 자동 검증
- [[Design Systems]] - 자동화된 디자인 시스템 구축
- [[Tailwind CSS]] - 호환 가능한 유틸리티 CSS

---

**작성일**: 2026-02-11
**출처**: https://github.com/Chainlift/liftkit
**분류**: UI Framework / Design System
**저장소**: Chainlift/liftkit (Apache-2.0)