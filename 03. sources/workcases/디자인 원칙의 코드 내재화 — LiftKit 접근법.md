---
title: 디자인 원칙의 코드 내재화 — LiftKit 접근법
type: workcase
permalink: sources/workcases/design-principles-in-code-liftkit
tags:
- design-system
- golden-ratio
- accessibility
- ui-framework
- ai-design
- code-principles
---

# 디자인 원칙의 코드 내재화 — LiftKit 접근법

**유형**: Learning Pattern B (학습 정리)  
**날짜**: 2026-02-11  
**태그**: design-system, golden-ratio, accessibility, ui-framework, ai-design

---

## 전체 흐름

```
자연의 비율 (황금비 1.618)
    ↓
CSS/TypeScript에 수식 하드코딩
    ↓
AI는 "규칙 판단" 대신 "영역만 지정"
    ↓
자동으로 우수한 디자인 산출
```

**핵심 통찰**: LiftKit는 AI가 비율을 "보는" 게 아니라, 디자인 원칙(rule)을 코드에 내재화하는 접근 방식

---

## 핵심 개념 3가지

### 1. 황금비율 (Golden Ratio) — 1.618 배수

**원칙**: 자연에서 반복되는 비율. 인간이 "편안하다"고 느끼는 보편적 기준.

**수식**:
- 기본값 `1` → `× 1.618` → `× 1.618` → `× 1.618` ...
- 시퀀스: `1 → 1.618 → 2.618 → 4.236 → 6.854 ...`

**적용 사례**:
- 본문 16px → 소제목 26px → 대제목 42px (각 단계 × 1.618)
- 간격(spacing): 8px → 13px → 21px → 34px ...
- 컴포넌트 높이/너비 일관성 유지

**코드화**: CSS 변수로 고정
```css
--size-base: 1rem;
--size-sm: calc(var(--size-base) / 1.618);   /* 0.618 */
--size-md: calc(var(--size-base) * 1.618);   /* 1.618 */
--size-lg: calc(var(--size-base) * 2.618);   /* 2.618 */
```

---

### 2. 광학적 대칭 (Optical Symmetry)

**원칙**: 수학적 중앙 ≠ 눈에 보이는 중앙

**구체적 예**:
- 원 안에 삼각형을 정확히 중앙에 놓으면 → 눈에는 **아래로 처져 보임**
- 해결: 약간 위로 올려야 눈에 중앙으로 보임
- 보정값이 컴포넌트에 **미리 내장** 됨

**버튼 패딩 사례**:
```css
/* 수학적 비대칭이지만 눈에는 중앙 */
padding-top: 10px;
padding-bottom: 12px;
```

**의미**: 기하학적 정확성과 인지적 정확성의 간극을 코드 레벨에서 미리 해결

---

### 3. WCAG 대비율 — 최소 4.5:1 (접근성)

**공식**:
```
대비율 = (밝은색의 상대휘도 + 0.05) / (어두운색의 상대휘도 + 0.05)
```

**기준**:
- 일반 텍스트: **최소 4.5:1** (AA 등급)
- 큰 텍스트(18px 이상): **최소 3:1**
- 큰 컴포넌트: **최소 3:1**

**실제 계산**:
- 흰 배경 + `#767676` = 4.54:1 ✅ (통과)
- 흰 배경 + `#AAA` = 2.32:1 ❌ (불통과)

**코드화**: 컴포넌트별로 검증된 색상 조합을 미리 정의

---

## 실제 적용

### LiftKit (현재 구현)
- **기술**: shadcn 기반 UI 프레임워크 (Next.js)
- **언어**: CSS 50.5% + TypeScript 46.3%
- **라이선스**: Apache-2.0 (오픈소스)
- **저장소**: https://github.com/Chainlift/liftkit

### PPT에 같은 접근 적용 가능

**문제**: LLM이 PPT 좌표를 못 맞추는 이유
- LLM은 텍스트만 다룸 (화면을 "본" 적 없음)
- 좌표를 EMU 단위로 써야 하는데 감이 없음
- 결과물 미리보기 불가 → 피드백 루프 없음

**해결책**:
1. **마스터 슬라이드에 황금비 그리드 미리 세팅** → AI는 영역만 지정
2. **PPT 템플릿 + 좌표 맵** → AI는 내용만 채움
3. **python-pptx 래퍼 개발** → LiftKit 같은 자동화 계층

```python
# 개념적 예시
class PPTLayoutKit:
    GOLDEN_RATIO = 1.618
    slide_width = 10  # inches
    
    def get_title_y(self):
        return self.slide_width / self.GOLDEN_RATIO
    
    def get_body_y(self):
        return self.slide_width / (self.GOLDEN_RATIO ** 2)
```

---

## Observations

### Fact
- 황금비는 수학적 상수(1.618...) — 코드에 하드코딩 가능
- 광학적 대칭의 보정값은 도형 유형별로 일정 (원, 삼각형, 사각형 등)
- WCAG 대비율은 색상 공간(sRGB) 기준의 수식 — 자동 검증 가능

### Pattern
- **규칙을 먼저, 판단을 나중에**: AI가 "이 크기가 맞을까?"를 고민하지 않도록 규칙을 코드에 내재화
- **템플릿 + 매개변수 분리**: 디자인 원칙(고정)과 콘텐츠(변수)를 명확히 구분
- **피드백 루프 제거**: "맞는지 확인" 대신 "맞는 규칙만 제공"

### Method
1. 디자인 원칙을 수식화 (황금비, 대비율 등)
2. 수식을 CSS/코드 상수로 변환
3. 컴포넌트가 상수를 참조하도록 강제
4. AI는 "어디에 놓을지" 이상 판단 불필요

### Tech
- **CSS 변수 (Custom Properties)** — 비율 정의 및 계산
- **shadcn + Next.js** — 현대 UI 프레임워크 기반
- **TypeScript** — 타입 안정성으로 규칙 위반 방지
- **python-pptx** — PPT 자동화 레이어 (미구현, 응용 가능)

---

## 맥락적 확장

### 관련 개념
- **Design Systems**: LiftKit은 설계 체계의 코드화 버전
- **AI 제약 극복**: 비율 판단 능력이 없는 AI의 한계를 "규칙 프로그래밍"으로 해결
- **UX 일관성**: 템플릿에 원칙을 내장하면 일관된 경험 자동 제공

### 응용 영역
- 웹 UI 자동 생성 (LiftKit)
- 프레젠테이션 자동화 (python-pptx + 래퍼)
- 디자인 토큰 기반 시스템 (Figma ↔ 코드)
- 접근성 자동 검증 시스템

---

## 참고
- **LiftKit Repository**: https://github.com/Chainlift/liftkit
- **WCAG 2.1 Color Contrast**: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- **Golden Ratio in Design**: 자연과 미학의 수학적 기초
