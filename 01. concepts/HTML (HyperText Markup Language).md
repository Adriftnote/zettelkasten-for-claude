---
title: HTML (HyperText Markup Language)
type: concept
permalink: knowledge/concepts/html
tags:
- web-basics
- concepts
- frontend
category: 웹 기초
difficulty: 초급
---

# HTML (HyperText Markup Language)

웹 페이지의 구조와 내용을 정의하는 마크업 언어입니다.

## 📖 개요

HTML은 웹의 가장 기본이 되는 기술로, **모든 웹사이트는 HTML로 만들어집니다**. 태그(`<>`)를 사용해 콘텐츠의 의미와 구조를 표시하며, 브라우저는 HTML을 해석해 화면에 표시합니다.

- **HyperText**: 링크를 통해 다른 문서로 이동할 수 있는 텍스트
- **Markup**: 태그로 콘텐츠의 의미와 구조를 표시
- **Language**: 브라우저가 이해하는 약속된 문법 체계

## 🎭 비유

건물의 **뼈대와 구조**입니다. 벽, 방, 창문의 위치를 정의하지만, 색상이나 인테리어(CSS)는 포함하지 않습니다.

## ✨ 특징

- **시맨틱(의미론적)**: 태그가 콘텐츠의 의미를 나타냄
- **계층적 구조**: 부모-자식 관계로 중첩된 트리 구조
- **플랫폼 독립적**: 모든 브라우저에서 동작
- **확장 가능**: CSS, JavaScript와 결합해 풍부한 웹 경험

## 💡 예시

**기본 HTML 구조**:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>페이지 제목</title>
  </head>
  <body>
    <h1>안녕하세요!</h1>
    <p>이것은 문단입니다.</p>
    <a href="https://example.com">링크</a>
  </body>
</html>
```

**주요 태그**:

| 태그 | 용도 |
|------|------|
| `<h1>`~`<h6>` | 제목 (1이 가장 큼) |
| `<p>` | 문단 |
| `<a>` | 하이퍼링크 |
| `<img>` | 이미지 |
| `<div>` | 구역 나누기 |
| `<ul>`, `<li>` | 목록 |
| `<table>` | 표 |

## Relations

- similar_to [[css]]
- similar_to [[javascript]]
- part_of [[iframe]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월