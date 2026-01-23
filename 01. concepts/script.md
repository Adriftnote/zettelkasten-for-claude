---
title: 스크립트 (Script)
type: concept
tags:
- programming-basics
- concepts
- code-types
permalink: knowledge/concepts/script
category: 코드의 종류
difficulty: 초급
---

# 스크립트 (Script)

별도의 컴파일 과정 없이 바로 실행되는 소스코드입니다.

## 📖 개요

스크립트는 소스코드를 기계어로 미리 변환하지 않고, 실행 시점에 인터프리터가 한 줄씩 읽으면서 바로 실행합니다. 주로 자동화, 웹페이지 동작, 간단한 작업 수행에 사용됩니다.

## 🎭 비유

배우의 대본과 같습니다. 대본을 보면서 바로 연기할 수 있듯이, 컴퓨터가 스크립트를 읽으면서 바로 실행합니다.

## ✨ 특징

- **즉시 실행**: 작성 후 바로 실행 가능
- **수정 용이**: 코드 수정 후 즉시 결과 확인
- **플랫폼 독립적**: 해석기만 있으면 어디서나 실행
- **느린 속도**: 실행 시마다 해석 필요

## 💡 예시

```javascript
// 웹페이지 JavaScript
document.getElementById("button").addEventListener("click", function() {
  alert("버튼이 클릭되었습니다!");
});
```

## Relations

- implements [[source-code]]
- executed_by [[interpreter]]
- similar_to [[program]]

---

**난이도**: 초급
**카테고리**: 코드의 종류
**마지막 업데이트**: 2026년 1월