---
title: Content Script
type: concept
permalink: knowledge/concepts/content-script
tags:
- web-basics
- concepts
- chrome-extension
category: 브라우저 확장
difficulty: 중급
---

# Content Script

웹 페이지의 컨텍스트에서 실행되어 DOM을 읽고 수정할 수 있는 Extension 스크립트입니다.

## 📖 개요

Content Script는 [[Chrome Extension|Chrome Extension]]의 핵심 구성 요소로, **웹 페이지 안에서 실행**됩니다. 페이지의 [[DOM (Document Object Model)|DOM]]에 직접 접근해 데이터를 읽거나 페이지를 수정할 수 있습니다. 단, 외부 API 호출은 [[CORS (Cross-Origin Resource Sharing)|CORS]] 제한을 받습니다.

## 🎭 비유

웹 페이지에 파견된 **현장 요원**입니다. 현장(DOM)에서 직접 정보를 수집할 수 있지만, 외부(다른 서버)와 직접 연락하려면 본부([[Background Script (Service Worker)|Background Script]])를 거쳐야 합니다.

## ✨ 특징

- **DOM 접근 가능**: 페이지의 모든 요소 읽기/수정
- **격리된 JavaScript 환경**: 페이지의 JS 변수에는 접근 불가
- **CORS 제한**: 외부 API 직접 호출 불가
- **메시지 통신**: Background Script와 메시지로 통신

## 💡 예시

**manifest.json 설정**:
```json
{
  "content_scripts": [{
    "matches": ["https://*.naver.com/*"],
    "js": ["content/naver.js"],
    "css": ["content/style.css"],
    "all_frames": true,        // iframe에도 주입
    "run_at": "document_idle"  // DOM 로딩 완료 후 실행
  }]
}
```

**Content Script 예시 (naver.js)**:
```javascript
// DOM에서 데이터 추출
const title = document.querySelector('h1').textContent;
const data = { title, url: window.location.href };

// Background Script로 전송
chrome.runtime.sendMessage({ type: 'DATA', payload: data });
```

**할 수 있는 것 vs 없는 것**:

| 할 수 있는 것 | 할 수 없는 것 |
|--------------|--------------|
| ✅ DOM 읽기/수정 | ❌ 외부 API 직접 호출 |
| ✅ CSS 주입 | ❌ 페이지 JS 변수 접근 |
| ✅ 메시지 전송 | ❌ Extension storage 직접 접근 |
| ✅ 이벤트 리스너 등록 | ❌ chrome.* API 일부 제한 |

**iframe 내부 접근 (`all_frames: true`)**:
```
페이지 (example.com)
    │ ← content.js 주입 ✅
    │
    └── iframe (other.com)
              │ ← content.js 또 주입 ✅
              │   (all_frames: true 덕분)
              └── 이 DOM도 접근 가능!
```

## Relations

- part_of [[Chrome Extension]]
- uses [[DOM (Document Object Model)]]
- used_by [[Same-Origin Policy (동일 출처 정책)]]

---

**난이도**: 중급
**카테고리**: 브라우저 확장
**마지막 업데이트**: 2026년 1월