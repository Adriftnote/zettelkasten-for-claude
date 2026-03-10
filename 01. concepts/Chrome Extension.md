---
title: Chrome Extension
type: concept
permalink: knowledge/concepts/chrome-extension
tags:
- web-basics
- concepts
- browser
- tools
category: 브라우저 확장
difficulty: 중급
---

# Chrome Extension

Chrome 브라우저의 기능을 확장하는 프로그램입니다.

## 📖 개요

Chrome Extension은 **웹 페이지 수정, 자동화, 브라우저 기능 추가** 등을 가능하게 하는 작은 프로그램입니다. HTML, CSS, JavaScript로 작성되며, manifest.json으로 설정을 관리합니다.

> [!important] 보안 경계
> Extension은 **브라우저가 받아온 데이터**를 읽는 것이지, 서버 원본을 변경하지 않습니다.

## 🎭 비유

브라우저에 설치하는 **앱**과 같습니다. 기본 브라우저에 없는 기능을 추가로 붙여서 사용합니다.

## ✨ 특징

- **웹 기술 기반**: HTML, CSS, JavaScript로 개발
- **권한 시스템**: 필요한 권한만 명시적으로 요청
- **분리된 실행 환경**: Content Script, Background Script 등 역할 분리
- **메시지 통신**: 컴포넌트 간 메시지로 데이터 전달

## 💡 예시

**기본 파일 구조**:
```
my-extension/
├── manifest.json      ← 설정 파일 (필수)
├── popup.html         ← 팝업 UI
├── popup.js           ← 팝업 로직
├── content/           ← Content Scripts
│   └── main.js        ← 웹 페이지에 주입되는 스크립트
├── background.js      ← Background Script (Service Worker)
└── icons/             ← 아이콘 이미지
```

**manifest.json 예시**:
```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["https://*.example.com/*"],
    "js": ["content/main.js"],
    "all_frames": true
  }],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}
```

**주요 구성 요소**:

| 구성 요소 | 실행 위치 | 역할 |
|-----------|----------|------|
| [[Content Script|Content Script]] | 웹 페이지 | DOM 읽기/수정 |
| [[Background Script (Service Worker)|Background Script]] | Extension 환경 | API 호출, 이벤트 처리 |
| Popup | 팝업 창 | 사용자 인터페이스 |

**메시지 통신 흐름**:
```
Content Script (DOM 읽기)
       │
       │ chrome.runtime.sendMessage()
       ▼
Background Script (API 호출)
       │
       │ fetch()
       ▼
외부 서버
```

## Relations

- part_of [[Content Script]]
- part_of [[Background Script (Service Worker)]]
- used_by [[DOM (Document Object Model)]]
- relates_to [[CORS (Cross-Origin Resource Sharing)]]

---

**난이도**: 중급
**카테고리**: 브라우저 확장
**마지막 업데이트**: 2026년 1월