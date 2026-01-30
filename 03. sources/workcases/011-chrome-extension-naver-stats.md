---
extraction_status: pending
permalink: 03.-sources/reviews/011-chrome-extension-naver-stats
---

# Chrome Extension 개발 - 네이버 블로그 통계 수집기

**날짜:** 2026-01-12
**작업:** 네이버 블로그 통계 페이지에서 상호작용 데이터 추출하는 Chrome Extension 개발

---

## 배운 개념들

### 1. iframe (Inline Frame)

**정의:** 웹 페이지 안에 또 다른 웹 페이지를 삽입하는 HTML 요소

```html
<iframe id="statmain" src="https://blog.stat.naver.com/..."></iframe>
```

**특징:**
- 페이지 안에 페이지가 있는 구조 (액자 안의 그림처럼)
- 각 iframe은 독립적인 document를 가짐
- 부모 페이지와 iframe은 서로 다른 컨텍스트

**왜 중요했나:**
- 네이버 블로그 관리 페이지: `admin.blog.naver.com`
- 실제 통계 데이터: `blog.stat.naver.com` (iframe 안에 있음)
- top frame에서 `document.querySelectorAll()`하면 iframe 내용은 안 보임!

---

### 2. Cross-Origin (교차 출처)

**정의:** 서로 다른 도메인(출처) 간의 관계

```
admin.blog.naver.com  →  다른 origin
blog.stat.naver.com   →  다른 origin
```

**보안 정책 (Same-Origin Policy):**
- 브라우저가 보안을 위해 다른 origin 접근을 차단
- A 도메인에서 B 도메인의 iframe 내용에 직접 접근 불가

**에러 메시지:**
```
Blocked a frame with origin "https://admin.blog.naver.com"
from accessing a cross-origin frame.
```

**해결 방법:**
- Chrome Extension의 `content_scripts`를 해당 도메인에도 주입
- `manifest.json`의 `matches`에 도메인 추가

---

### 3. DevTools Console (개발자 도구 콘솔)

**열기:** F12 또는 Ctrl+Shift+I

**주요 기능:**
- JavaScript 코드 실행
- 로그 확인 (`console.log()` 출력)
- 에러/경고 메시지 확인

**중요한 기능 - Frame 선택:**
```
┌─────────────────────────────────┐
│ top ▼ │ 필터                    │  ← 이 드롭다운!
└─────────────────────────────────┘
```

- `top`: 메인 페이지
- `statmain`: iframe 내부
- 선택한 frame의 컨텍스트에서 JavaScript 실행됨

**왜 중요했나:**
- top에서 `document.querySelectorAll()`하면 top의 DOM만 검색
- iframe 내용 검색하려면 해당 frame 선택 후 실행해야 함

---

### 4. Content Script

**정의:** Chrome Extension이 웹 페이지에 주입하는 JavaScript

**특징:**
- 페이지의 DOM에 접근 가능
- 페이지의 JavaScript와는 격리된 환경 (isolated world)
- `chrome.runtime` API로 Extension과 통신

**manifest.json 설정:**
```json
"content_scripts": [
  {
    "matches": ["https://blog.stat.naver.com/*"],
    "js": ["content.js"],
    "all_frames": true  // iframe에서도 실행!
  }
]
```

---

### 5. CSS Selector with Attribute Contains

**문법:** `[class*="검색어"]`

```javascript
// class 이름에 "u_ni_item"이 포함된 모든 요소
document.querySelectorAll('[class*="u_ni_item"]')
```

**왜 필요했나:**
- 네이버가 CSS Modules 사용 → 클래스명에 해시 붙음
- `u_ni_item__W6KnJ` (해시가 빌드마다 바뀔 수 있음)
- 정확한 클래스명 대신 패턴으로 검색

---

## 작업 과정에서 겪은 문제들

### 문제 1: 데이터를 찾을 수 없음

**증상:**
```
[네이버 통계] 0개 통계 항목 발견
```

**원인:** 데이터가 iframe 안에 있었음

**해결:**
1. `document.querySelectorAll('iframe')` → 8개 iframe 발견
2. `iframe#statmain`에 통계 데이터 있음 확인

---

### 문제 2: iframe 내부 접근 불가

**증상:**
```
Blocked a frame with origin... from accessing a cross-origin frame
```

**원인:** `admin.blog.naver.com`에서 `blog.stat.naver.com` iframe 직접 접근 불가 (cross-origin)

**해결:**
- manifest.json에 `"all_frames": true` 추가
- matches에 `https://blog.stat.naver.com/*` 추가
- iframe 내부에서 content script가 직접 실행되게 함

---

### 문제 3: top frame이 먼저 응답

**증상:**
- content script가 top과 iframe 둘 다에서 실행됨
- top frame이 먼저 응답해서 빈 결과 반환

**해결:**
```javascript
// 데이터가 없는 frame은 응답 안 함
if (!hasData && request.action !== 'ping') {
  return false; // 다른 frame이 응답할 수 있게 함
}
```

---

## 최종 해결 구조

```
admin.blog.naver.com (top frame)
├── content.js 실행 → 데이터 없음 → 응답 안 함
│
└── iframe#statmain (blog.stat.naver.com)
    └── content.js 실행 → 데이터 있음! → 응답 ✓
```

---

## 핵심 교훈

1. **화면에 보이면 가져올 수 있다** - DOM에 렌더링된 건 접근 가능
2. **iframe은 별도의 document** - top에서 직접 접근 불가
3. **cross-origin 제한** - 다른 도메인 iframe은 content script를 별도로 주입해야 함
4. **DevTools Console의 frame 선택** - 디버깅 시 어떤 frame인지 확인 중요
5. **CSS Modules 대응** - `[class*="패턴"]` selector 사용

---

## 생성된 파일

```
C:\유정우\Projects\data-analytics\convert\naver-stats-extension\
├── manifest.json      # Extension 설정 (도메인, 권한)
├── content.js         # 데이터 추출 로직
├── popup.html         # 팝업 UI
├── popup.js           # 팝업 로직
└── README.md          # 사용법

C:\유정우\Projects\data-analytics\convert\
└── import_naver_interactions.py  # JSON → DB 입력 스크립트
```