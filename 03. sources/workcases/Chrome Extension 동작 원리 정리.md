---
title: Chrome Extension 동작 원리 정리
type: workcase
extraction_status: pending
tags:
- chrome-extension
- web-security
- cors
- dom
- 학습정리
date: 2026-01-19
project: Social Analytics Extractor
status: completed
permalink: sources/workcases/chrome-extension-operation-guide
---

# Chrome Extension 동작 원리 정리

> Social Analytics Extractor Extension 분석하면서 학습한 내용

---

## 1. 전체 동작 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      네이버 서버                             │
│   blog.stat.naver.com (HTML/CSS/JS)                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ ① HTTP 응답 (HTML 전송)
                         │    서버는 여기까지만 관여
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Chrome 브라우저                           │
│                                                             │
│  ② 렌더링 엔진: HTML → DOM 트리 생성                         │
│                         │                                   │
│                         ▼                                   │
│  ③ DOM (Document Object Model)                             │
│     통계 데이터가 화면에 표시됨                               │
│                         │                                   │
│                         │ ④ Extension이 Content Script 주입 │
│                         ▼                                   │
│  ⑤ Content Script (naver.js)                               │
│     DOM에서 데이터 읽기                                      │
│                         │                                   │
│                         │ ⑥ 메시지 전달                      │
│                         ▼                                   │
│  ⑦ popup.js → JSON 다운로드                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> [!important] 핵심
> Extension은 "브라우저가 받아온 데이터"를 읽는 것이지, 서버를 건드리는 게 아님

---

## 2. iframe Cross-Origin 문제와 해결

### 문제 상황

네이버 블로그 통계 페이지 구조:
```
admin.blog.naver.com (부모 페이지)
└── iframe: blog.stat.naver.com (다른 도메인)
              └── 실제 통계 데이터
```

[[Same-Origin Policy (동일 출처 정책)|Same-Origin Policy]] 때문에 부모 페이지에서 다른 도메인의 [[iframe (Inline Frame)|iframe]] 내부 접근 불가

### 해결 방법

manifest.json에서 `all_frames: true` 설정:
```json
{
  "content_scripts": [{
    "matches": ["https://admin.blog.naver.com/*", "https://blog.stat.naver.com/*"],
    "js": ["content/naver.js"],
    "all_frames": true   // iframe 내부에도 스크립트 주입
  }]
}
```

---

## 3. Content Script vs Background Script

| 구분 | [[Content Script]] | [[Background Script (Service Worker)|Background Script]] |
|------|-------------------|---------------------|
| 실행 위치 | 웹 페이지 안 | Extension 독립 공간 |
| 할 수 있는 것 | [[DOM (Document Object Model)|DOM]] 읽기/수정 | 외부 API 호출, 스토리지 |
| 할 수 없는 것 | 외부 API 호출 (CORS) | DOM 접근 |

### 메시지 전달 패턴

```
Content Script (DOM 읽기)
       │
       │ chrome.runtime.sendMessage()
       ▼
Background Script (API 호출)
       │
       │ fetch()
       ▼
외부 서버 (n8n, DB 등)
```

---

## 4. CORS 제한과 우회

[[CORS (Cross-Origin Resource Sharing)|CORS]]는 보안상 브라우저가 다른 도메인으로의 요청을 차단하는 메커니즘

### Content Script에서의 제한

```javascript
// Content Script (naver.com에서 실행)
fetch('https://내서버.com/api')  // ❌ CORS 에러
```

### Background Script로 우회

```javascript
// Background Script (Extension 권한)
fetch('https://내서버.com/api')  // ✅ 가능
```

---

## 5. Extension 파일 구조

```
social-analytics-extractor/
├── manifest.json      ← 설정 (권한, 스크립트 주입 규칙)
├── content/           ← Content Scripts
│   ├── naver.js       ← 네이버 DOM에서 데이터 추출
│   ├── facebook.js    ← 페이스북 DOM에서 데이터 추출
│   └── x.js           ← X(트위터) DOM에서 데이터 추출
├── popup.html         ← 팝업 UI
├── popup.js           ← 데이터 가공 + JSON 다운로드
└── background.js      ← (없음 - 추가하면 외부 API 직접 호출 가능)
```

---

## 6. 보안 경계 이해

```
┌──────────────┐        ┌──────────────┐
│  웹 서버     │ ←───── │   브라우저    │
│ (원본 유지)  │  요청   │              │
│              │ ──────→│  Extension   │
│  변경 불가   │  응답   │  (읽기만)    │
└──────────────┘        └──────────────┘
```

| 구분 | 영향 |
|------|------|
| 서버 원본 | ❌ 절대 변경 안 됨 |
| 내 브라우저 DOM | ✅ 읽기/수정 가능 |
| 다른 사용자 | ❌ 영향 없음 |
| 새로고침 후 | 원래대로 복구 |

---

## 7. 관련 개념 문서

| 개념 | 분야 |
|------|------|
| [[DOM (Document Object Model)|DOM]], [[JavaScript (JS)|JavaScript]] | 프론트엔드 |
| [[CORS (Cross-Origin Resource Sharing)|CORS]], [[Same-Origin Policy (동일 출처 정책)|Same-Origin Policy]] | 웹 보안 |
| [[Content Script]], [[Background Script (Service Worker)|Background Script]] | Chrome Extension |
| [[Chrome Extension]] | 브라우저 확장 |

### 추천 자료

1. **MDN Web Docs** - 웹 개발 공식 교과서
   - https://developer.mozilla.org/ko/
2. **Chrome Extension 공식 문서**
   - https://developer.chrome.com/docs/extensions/
3. **"How Browsers Work"** 검색 - 브라우저 렌더링 원리

---

## 8. 개선 가능 사항

| 현재 | 개선 |
|------|------|
| Content Script → popup.js → JSON 다운로드 → n8n → DB | Content Script → Background Script → n8n webhook → DB |

Background Script 추가하면 다운로드 없이 버튼 클릭 한 번으로 DB 저장 가능

> [!tip] 관련 Task
> → task-20260119-007 참고

## Observations

- [fact] Chrome Extension은 브라우저가 렌더링한 DOM을 읽는 것이며 서버 원본 데이터를 변경하지 않음 #chrome-extension #web-security
- [solution] iframe cross-origin 문제는 manifest.json의 all_frames: true 설정으로 해결 #iframe #cors
- [pattern] Content Script는 DOM 접근 전용, Background Script는 외부 API 호출 전용으로 역할 분리 #chrome-extension #architecture
- [tech] Content Script의 CORS 제한은 Background Script를 통해 우회 가능 #cors #chrome-extension
- [method] 개선된 구조: Content Script → Background Script → webhook → DB (다운로드 단계 제거) #workflow