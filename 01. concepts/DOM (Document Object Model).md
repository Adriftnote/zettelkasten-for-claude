---
title: DOM (Document Object Model)
type: concept
permalink: knowledge/concepts/dom
tags:
- web-basics
- concepts
- frontend
- javascript
category: 웹 기초
difficulty: 초급
---

# DOM (Document Object Model)

HTML 문서를 JavaScript가 읽고 조작할 수 있는 객체 트리 구조입니다. 실제 조작 가능함.

## 📖 개요

DOM은 **브라우저가 HTML을 파싱해서 만드는 객체 구조**입니다. JavaScript는 HTML 텍스트를 직접 이해할 수 없기 때문에, 브라우저가 HTML을 DOM 트리로 변환합니다. 이를 통해 JavaScript로 웹 페이지의 내용, 구조, 스타일을 동적으로 변경할 수 있습니다.

- **Document**: HTML 문서 전체
- **Object**: 각 요소가 객체로 표현됨
- **Model**: 트리 구조로 모델링됨

## 🎭 비유

HTML이 **설계도**라면, DOM은 설계도를 바탕으로 만든 **레고 블록 조립체**입니다. 설계도(HTML)는 그냥 종이지만, 조립체(DOM)는 실제로 손으로 조작할 수 있습니다.

## ✨ 특징

- **트리 구조**: 부모-자식 관계의 계층적 구조
- **실시간 반영**: DOM 변경 시 화면에 즉시 반영
- **언어 독립적**: JavaScript 외 다른 언어도 접근 가능
- **이벤트 처리**: 클릭, 입력 등 사용자 상호작용 감지

## 💡 예시

**HTML → DOM 변환**:
```html
<html>
  <body>
    <h1 id="title">안녕하세요</h1>
    <p class="content">문단입니다</p>
  </body>
</html>
```

```
        DOM 트리
        
        document
            │
          html
            │
          body
         /    \
       h1      p
       │       │
   "안녕하세요" "문단입니다"
```

**JavaScript로 DOM 조작**:
```javascript
// 요소 찾기
const title = document.getElementById("title");
const content = document.querySelector(".content");

// 내용 변경
title.textContent = "새 제목";

// 스타일 변경
title.style.color = "blue";

// HTML 읽기/쓰기
console.log(content.innerHTML);
content.innerHTML = "<strong>굵은 문단</strong>";

// 새 요소 추가
const newDiv = document.createElement("div");
document.body.appendChild(newDiv);
```

**주요 DOM 메서드**:

| 메서드 | 용도 | 예시 |
|--------|------|------|
| `getElementById()` | ID로 찾기 | `document.getElementById("id")` |
| `querySelector()` | CSS 선택자로 찾기 | `document.querySelector(".class")` |
| `querySelectorAll()` | 여러 개 찾기 | `document.querySelectorAll("p")` |
| `createElement()` | 요소 생성 | `document.createElement("div")` |
| `appendChild()` | 자식 추가 | `parent.appendChild(child)` |
| `remove()` | 요소 삭제 | `element.remove()` |

## ⚠️ 주의사항

| 상황 | 설명 |
|------|------|
| **Cross-Origin iframe** | 다른 출처의 iframe 내부 DOM은 접근 불가 |
| **로딩 타이밍** | DOM이 완성되기 전에 접근하면 `null` 반환 |
| **성능** | 과도한 DOM 조작은 렌더링 성능 저하 |

```javascript
// DOM 로딩 완료 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 여기서 DOM 조작
});
```

## Relations

- extends [[HTML (HyperText Markup Language)]]
- used_by [[JavaScript (JS)]]
- used_by [[Content Script]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월