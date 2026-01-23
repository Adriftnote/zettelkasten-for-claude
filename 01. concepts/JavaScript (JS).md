---
title: JavaScript (JS)
type: concept
permalink: knowledge/concepts/javascript
tags:
- web-basics
- concepts
- frontend
- programming-language
category: 웹 기초
difficulty: 초급
---

# JavaScript (JS)

웹 페이지에 동적 기능과 상호작용을 추가하는 프로그래밍 언어입니다.

## 📖 개요

JavaScript는 웹의 **동작과 기능을 담당**합니다. 버튼 클릭, 폼 검증, 애니메이션, 서버 통신 등 사용자와의 상호작용을 처리합니다. 원래 브라우저 전용이었지만, 현재는 Node.js를 통해 서버에서도 실행됩니다.

> [!note] Java와 다릅니다
> 이름이 비슷하지만 **Java와 JavaScript는 완전히 다른 언어**입니다. 마케팅 이유로 비슷한 이름을 붙였을 뿐입니다.

## 🎭 비유

건물의 **전자기기와 자동화 시스템**입니다. 조명 스위치, 자동문, 엘리베이터 등 사용자 행동에 반응하는 모든 것을 담당합니다.

## ✨ 특징

- **동적 타이핑**: 변수 타입을 미리 선언하지 않음
- **이벤트 기반**: 사용자 행동(클릭, 입력)에 반응
- **비동기 처리**: 서버 요청 중에도 화면 멈추지 않음
- **멀티 패러다임**: 함수형, 객체지향 모두 지원

## 💡 예시

**기본 JavaScript**:
```javascript
// 변수 선언
let message = "안녕하세요!";
const PI = 3.14159;

// 함수 정의
function greet(name) {
  return `Hello, ${name}!`;
}

// 이벤트 처리
document.getElementById("btn").addEventListener("click", () => {
  alert("버튼이 클릭되었습니다!");
});
```

**HTML과 연결**:
```html
<!-- 내부 스크립트 -->
<script>
  console.log("Hello, World!");
</script>

<!-- 외부 스크립트 (권장) -->
<script src="app.js"></script>
```

**웹 3요소 역할 비교**:

| 기술 | 역할 | 담당 |
|------|------|------|
| HTML | 구조 | "이것은 버튼이다" |
| CSS | 스타일 | "버튼은 파란색이다" |
| **JS** | **동작** | **"클릭하면 팝업 열어"** |

## Relations

- used_by [[html]]
- similar_to [[css]]
- relates_to [[iframe]]
- implements [[api]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월