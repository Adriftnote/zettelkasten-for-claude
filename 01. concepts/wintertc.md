---
title: WinterTC
type: concept
permalink: knowledge/concepts/wintertc
tags:
- javascript
- runtime
- web-standards
- standardization
category: 웹 표준
difficulty: 중급
---

# WinterTC

JavaScript 런타임들 사이의 Web API 호환성을 표준화하는 Ecma 기술 위원회 (TC55)

## 📖 개요

WinterTC(Web-Interoperable Runtimes Technical Committee)는 Node.js, Deno, Bun, Cloudflare Workers 등 서버 사이드 JS 런타임들이 공통된 Web Platform API를 사용하도록 표준을 정하는 위원회다. 2025년 1월 기존 W3C WinterCG에서 Ecma 산하 TC55로 전환되었다.

핵심 원칙은 **"브라우저가 기준"** — 서버 런타임들이 새 API를 발명하는 대신, 브라우저의 기존 표준(fetch, WebSocket, crypto 등)을 그대로 채택하여 "한 번 작성하면 어디서든 실행"을 실현하는 것이다.

## 🎭 비유

전세계 콘센트 규격 통일 위원회와 같다. 나라(런타임)마다 콘센트 모양(API)이 달라서 여행자(개발자)가 매번 어댑터를 가져다녀야 하는데, WinterTC는 "모두 같은 규격을 씁시다"라고 합의하는 자리다.

## ✨ 특징

- **브라우저 = 기준선**: 서버 런타임이 브라우저 Web API를 그대로 구현하는 것이 목표
- **Minimum Common API**: fetch, URL, crypto, TextEncoder 등 최소 공통 API 규격을 정의
- **Ecma 공식 표준**: W3C 커뮤니티 그룹(WinterCG)에서 Ecma 기술 위원회(TC55)로 격상 — 정식 표준 발행 가능
- **런타임 중립**: 특정 런타임이 아닌, 모든 서버 사이드 JS 환경에 적용

## 💡 예시

### WinterTC 이전 vs 이후

```
WinterTC 이전:
  Node.js  → fetch가 v18부터 실험적 지원, 자체 http 모듈 사용
  Deno     → fetch 기본 지원, Node 호환 레이어 별도
  Bun      → fetch 지원하지만 세부 동작 미묘하게 다름

WinterTC 이후 (목표):
  모든 런타임 → 동일한 fetch 동작 보장
  → "write once, run anywhere" 실현
```

### txiki.js와의 관계

txiki.js가 "WinterTC 표준을 지향한다"는 것은:
- fetch, WebSocket, console, setTimeout, crypto 등을 브라우저와 동일하게 구현
- 런타임 간 코드 이식성을 보장하려는 설계 철학

## Observations

- WinterCG(2022~2024) → WinterTC/TC55(2025.01~)로 명칭 변경
- 첫 번째 정식 규격: Minimum Common Web API (2025 스냅샷)
- 참여 주체: Cloudflare, Deno, Vercel, Shopify, Bloomberg 등

## Relations

- standardizes [[런타임 (Runtime)|런타임 (Runtime)]] (서버 사이드 JS 런타임의 API를 표준화)
- standardizes [[javascript|JavaScript]] (JS 런타임 간 Web API 호환성 규격)
- relates_to [[engine|엔진 (Engine)]] (엔진과 무관하게 API 수준의 표준을 정의)
- similar_to [[ecmascript]] (TC39가 언어 규격이라면, TC55는 런타임 API 규격)

---
**난이도**: 중급
**카테고리**: 웹 표준
**마지막 업데이트**: 2026년 3월
