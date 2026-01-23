---
title: Same-Origin Policy (동일 출처 정책)
type: concept
permalink: knowledge/concepts/same-origin-policy
tags:
- web-basics
- concepts
- web-security
category: 웹 보안
difficulty: 중급
---

# Same-Origin Policy (동일 출처 정책)

브라우저가 다른 출처(Origin)의 리소스 접근을 제한하는 보안 메커니즘입니다.

## 📖 개요

Same-Origin Policy는 **웹 보안의 핵심 원칙**입니다. 브라우저는 한 출처에서 로드된 스크립트가 다른 출처의 리소스에 접근하는 것을 기본적으로 차단합니다. 이를 통해 악성 사이트가 사용자의 다른 사이트 데이터를 훔치는 것을 방지합니다.

### Origin(출처)의 구성

```
https://example.com:443/page
  ↓        ↓         ↓
프로토콜   도메인      포트

→ 셋 중 하나라도 다르면 Cross-Origin
```

## 🎭 비유

아파트 보안 시스템과 같습니다. 같은 아파트(Same-Origin) 주민끼리는 자유롭게 오갈 수 있지만, 다른 아파트(Cross-Origin) 사람은 허가 없이 들어올 수 없습니다.

## ✨ 특징

- **브라우저 적용**: 서버가 아닌 브라우저가 적용하는 정책
- **3가지 기준**: 프로토콜 + 도메인 + 포트가 모두 같아야 동일 출처
- **서브도메인도 다름**: `api.example.com` ≠ `www.example.com`
- **CORS로 완화**: 서버가 명시적으로 허용하면 접근 가능

## 💡 예시

**Same-Origin vs Cross-Origin 비교**:

| 기준 URL | 비교 URL | 결과 |
|----------|----------|------|
| `https://naver.com` | `https://naver.com/news` | ✅ Same-Origin |
| `https://naver.com` | `https://google.com` | ❌ Cross-Origin (도메인) |
| `https://naver.com` | `http://naver.com` | ❌ Cross-Origin (프로토콜) |
| `https://naver.com` | `https://naver.com:8080` | ❌ Cross-Origin (포트) |
| `https://naver.com` | `https://api.naver.com` | ❌ Cross-Origin (서브도메인) |

**제한되는 것들**:
```javascript
// Cross-Origin에서 차단되는 작업들
fetch('https://other-site.com/api')     // ❌ CORS 없으면 차단
iframe.contentDocument                   // ❌ iframe 내부 DOM 접근 불가
window.open().document                   // ❌ 팝업 창 DOM 접근 불가
```

**허용되는 것들**:
```html
<!-- Cross-Origin이어도 허용 (읽기만 불가) -->
<img src="https://other-site.com/image.jpg">
<script src="https://other-site.com/script.js"></script>
<link href="https://other-site.com/style.css">
<iframe src="https://other-site.com">  <!-- 표시는 됨, 내부 접근은 불가 -->
```

## Relations

- relates_to [[DOM (Document Object Model)]]
- used_by [[Content Script]]

---

**난이도**: 중급
**카테고리**: 웹 보안
**마지막 업데이트**: 2026년 1월