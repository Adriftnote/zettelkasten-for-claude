---
title: Background Script (Service Worker)
type: concept
permalink: knowledge/concepts/background-script
tags:
- web-basics
- concepts
- chrome-extension
category: 브라우저 확장
difficulty: 중급
---

# Background Script (Service Worker)

Extension의 독립된 환경에서 실행되어 외부 API 호출과 이벤트 처리를 담당하는 스크립트입니다.

## 📖 개요

Background Script는 [[Chrome Extension|Chrome Extension]]에서 **웹 페이지와 독립적으로 실행**됩니다. [[CORS (Cross-Origin Resource Sharing)|CORS]] 제한 없이 외부 서버와 통신할 수 있고, 브라우저 이벤트를 처리합니다. Manifest V3부터 Service Worker 형태로 동작합니다.

## 🎭 비유

Extension의 **본부(백오피스)**입니다. 현장 요원([[Content Script|Content Script]])이 수집한 정보를 받아서 외부 서버와 통신하고, 전체 작전을 관리합니다.

## ✨ 특징

- **CORS 무제한**: 외부 API 자유롭게 호출
- **DOM 접근 불가**: 웹 페이지 내용 직접 접근 안 됨
- **이벤트 기반**: 필요할 때만 활성화 (Manifest V3)
- **스토리지 관리**: chrome.storage API 사용

## 💡 예시

**manifest.json 설정**:
```json
{
  "background": {
    "service_worker": "background.js",
    "type": "module"  // ES modules 사용 시
  },
  "permissions": ["storage"],
  "host_permissions": ["https://api.example.com/*"]
}
```

**Background Script 예시 (background.js)**:
```javascript
// Content Script에서 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SEND_DATA') {
    // 외부 API 호출 (CORS 제한 없음!)
    fetch('https://api.example.com/webhook', {
      method: 'POST',
      body: JSON.stringify(message.payload)
    })
    .then(res => res.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    
    return true; // 비동기 응답 사용
  }
});
```

**할 수 있는 것 vs 없는 것**:

| 할 수 있는 것 | 할 수 없는 것 |
|--------------|--------------|
| ✅ 외부 API 호출 | ❌ DOM 접근 |
| ✅ chrome.storage 사용 | ❌ 페이지 내용 읽기 |
| ✅ 브라우저 이벤트 처리 | ❌ CSS 주입 |
| ✅ 알림 표시 | ❌ 페이지 수정 |

**Content Script와의 협업 패턴**:
```
┌─────────────────┐          ┌─────────────────┐
│  Content Script │          │ Background Script│
│  (웹 페이지)     │          │  (Extension)     │
├─────────────────┤          ├─────────────────┤
│ DOM 읽기 ✅      │  ──────▶ │ 외부 API ✅      │
│ 외부 API ❌     │  메시지   │ DOM 접근 ❌     │
└─────────────────┘          └─────────────────┘
         ↓                           ↓
    데이터 수집                  서버로 전송
```

## Relations

- part_of [[chrome-extension]]
- relates_to [[content-script]]
- relates_to [[CORS (Cross-Origin Resource Sharing)]]
- implements [[api]]

---

**난이도**: 중급
**카테고리**: 브라우저 확장
**마지막 업데이트**: 2026년 1월