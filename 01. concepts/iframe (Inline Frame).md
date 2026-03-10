---
title: iframe (Inline Frame)
type: concept
permalink: knowledge/concepts/iframe
tags:
- web-basics
- concepts
- frontend
- html-element
category: 웹 기초
difficulty: 초급
---

# iframe (Inline Frame)

웹 페이지 안에 다른 HTML 문서를 삽입하는 HTML 요소입니다.

## 📖 개요

iframe은 **페이지 안에 또 다른 페이지를 넣는** HTML 태그입니다. YouTube 동영상 임베드, Google Maps 삽입, 결제 폼, 광고 표시 등에 널리 사용됩니다. 메인 페이지와 iframe 내부는 별도의 문서 컨텍스트로 분리됩니다.

## 🎭 비유

건물 안의 **별도 공간(부스)**입니다. 건물 안에 있지만 독립적인 공간으로, 내부에 자체적인 인테리어와 규칙을 가집니다.

## ✨ 특징

- **독립적 컨텍스트**: 메인 페이지와 별도의 DOM, CSS, JS
- **보안 격리**: 신뢰할 수 없는 콘텐츠 샌드박싱 가능
- **외부 콘텐츠 삽입**: 다른 도메인의 콘텐츠도 표시 가능
- **크기 조절**: width, height 속성으로 크기 지정

## 💡 예시

**기본 iframe**:
```html
<iframe src="https://example.com" width="600" height="400"></iframe>
```

**YouTube 동영상 삽입**:
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allowfullscreen>
</iframe>
```

**보안 설정**:
```html
<iframe 
  src="https://untrusted-site.com"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer">
</iframe>
```

**주요 용도**:

| 용도 | 예시 |
|------|------|
| 동영상 임베드 | YouTube, Vimeo |
| 지도 삽입 | Google Maps, 카카오맵 |
| 결제 폼 | Stripe, PayPal |
| 광고 | 배너 광고, 애드센스 |
| 외부 위젯 | 트위터 타임라인, 날씨 |

## ⚠️ 주의사항

| 단점 | 설명 |
|------|------|
| **SEO 불리** | 검색엔진이 iframe 내용을 잘 인덱싱하지 못함 |
| **보안 위험** | 클릭재킹(clickjacking) 공격에 취약 |
| **접근성** | 스크린 리더 사용자에게 혼란 유발 |
| **성능** | 추가 HTTP 요청으로 로딩 시간 증가 |

## Relations

- part_of [[HTML (HyperText Markup Language)]]
- relates_to [[CSS (Cascading Style Sheets)]]
- relates_to [[javascript]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월