---
title: CSS (Cascading Style Sheets)
type: concept
permalink: knowledge/concepts/css
tags:
- web-basics
- concepts
- frontend
category: 웹 기초
difficulty: 초급
---

# CSS (Cascading Style Sheets)

HTML 요소의 시각적 표현(스타일)을 정의하는 스타일시트 언어입니다.

## 📖 개요

CSS는 웹 페이지의 **디자인과 레이아웃을 담당**합니다. HTML이 "무엇을" 보여줄지 정의한다면, CSS는 "어떻게" 보여줄지 정의합니다. 색상, 크기, 여백, 배치, 애니메이션 등 모든 시각적 요소를 제어합니다.

- **Cascading**: 여러 스타일 규칙이 우선순위에 따라 적용
- **Style Sheets**: 스타일 규칙을 모아놓은 문서

## 🎭 비유

건물의 **인테리어와 외장**입니다. 벽 색상, 가구 배치, 조명 등을 결정합니다. 뼈대(HTML)는 그대로지만, 인테리어(CSS)만 바꿔도 완전히 다른 느낌이 됩니다.

## ✨ 특징

- **분리의 원칙**: 구조(HTML)와 표현(CSS) 분리
- **재사용성**: 하나의 CSS로 여러 페이지 스타일링
- **반응형**: 화면 크기에 따라 다른 스타일 적용
- **우선순위**: 더 구체적인 선택자가 우선 적용

## 💡 예시

**기본 CSS 문법**:
```css
/* 선택자 { 속성: 값; } */
h1 {
  color: blue;
  font-size: 24px;
}

.highlight {
  background-color: yellow;
  padding: 10px;
}

#header {
  width: 100%;
  position: fixed;
}
```

**HTML에 CSS 적용**:
```html
<!-- 1. 인라인 스타일 -->
<p style="color: red;">빨간 텍스트</p>

<!-- 2. 내부 스타일시트 -->
<style>
  p { color: blue; }
</style>

<!-- 3. 외부 스타일시트 (권장) -->
<link rel="stylesheet" href="style.css">
```

**주요 속성**:

| 속성 | 용도 | 예시 |
|------|------|------|
| `color` | 글자 색상 | `color: #333;` |
| `background` | 배경 | `background: #fff;` |
| `font-size` | 글자 크기 | `font-size: 16px;` |
| `margin` | 바깥 여백 | `margin: 10px;` |
| `padding` | 안쪽 여백 | `padding: 20px;` |
| `display` | 표시 방식 | `display: flex;` |

## Relations

- used_by [[html]]
- similar_to [[javascript]]
- relates_to [[iframe]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월