---
title: SOP가 차단하고 CORS가 허용한다 — 브라우저 보안의 한 쌍
type: note
permalink: notes/sop-blocks-cors-allows
tags:
- web-security
- browser
- derived
source_facts:
- Same-Origin Policy (브라우저가 cross-origin 접근을 기본 차단)
- CORS (서버가 허용할 출처를 헤더로 선언)
---

# SOP가 차단하고 CORS가 허용한다 — 브라우저 보안의 한 쌍

SOP와 CORS는 독립된 기술이 아니라, "출처가 같은가?"라는 하나의 질문에 대한 차단-허용 한 쌍이다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **SOP는 브라우저가 적용하는 기본 차단 정책이다** — 프로토콜 + 도메인 + 포트가 하나라도 다르면 Cross-Origin으로 판정하고, fetch 요청, iframe 내부 DOM 접근, 팝업 창 DOM 접근을 차단한다. 서버가 아닌 브라우저가 적용한다.
   - 출처: Same-Origin Policy (동일 출처 정책)

2. **CORS는 서버가 선언하는 예외 허용이다** — 서버가 `Access-Control-Allow-Origin` 헤더로 "이 출처에서 오는 요청은 허용한다"고 명시적으로 선언한다. 브라우저는 이 헤더를 확인한 뒤 허용하거나 차단한다.
   - 출처: CORS (Cross-Origin Resource Sharing)

3. **SOP에도 예외가 있다 — "표시는 되지만 읽기는 안 된다"** — `<img>`, `<script>`, `<link>`, `<iframe>`으로 cross-origin 리소스를 표시하는 것은 허용된다. 그러나 JavaScript로 그 내용을 읽는 것(iframe.contentDocument, fetch response body)은 차단된다.
   - 출처: Same-Origin Policy (동일 출처 정책)

→ 따라서: **SOP와 CORS는 하나의 보안 메커니즘의 양면이다. SOP가 없으면 CORS가 필요 없고, CORS가 없으면 SOP가 너무 제한적이다. 프론트엔드에서 CORS 에러를 만나면, 프론트엔드에서는 해결할 수 없다 — 서버가 CORS 헤더를 보내야 한다. 이것은 설계상 의도된 역할 분담이다.**

## 역할 분담 구조

```
[브라우저] SOP 적용: "출처가 다르니까 차단"
     ↓
[서버] CORS 헤더 응답: "이 출처는 허용한다" (또는 헤더 없음)
     ↓
[브라우저] CORS 헤더 확인: "서버가 허용했으니 통과" 또는 "허용 안 했으니 차단"
```

보안 결정의 흐름:
- **정책 적용**: 브라우저 (SOP)
- **예외 선언**: 서버 (CORS 헤더)
- **최종 결정**: 브라우저 (CORS 헤더 확인)

서버는 "누구를 허용할지" 결정하지만, 실제 차단/허용을 집행하는 건 브라우저다.

## CORS 에러가 프론트엔드 문제가 아닌 이유

CORS 에러의 흔한 오해: "프론트엔드 코드를 고치면 된다"

실제 구조:
| 단계 | 주체 | 행동 |
|------|------|------|
| 1 | 프론트엔드 | fetch 요청 발생 |
| 2 | 브라우저 | "cross-origin이네" → SOP 적용 |
| 3 | 서버 | CORS 헤더를 보내거나 안 보냄 |
| 4 | 브라우저 | 헤더 없으면 → 에러 |

프론트엔드는 1단계만 관여한다. 에러의 원인은 3단계(서버)에 있고, 차단의 집행은 2, 4단계(브라우저)에서 일어난다. 프론트엔드 코드를 아무리 수정해도 서버가 CORS 헤더를 보내지 않으면 해결되지 않는다.

## Observations

- [fact] SOP와 CORS는 독립 기술이 아니라 "출처 기반 접근 제어"의 차단-허용 한 쌍이다 #web-security
- [fact] SOP는 브라우저가 적용하고, CORS의 허용 범위는 서버가 결정하고, 최종 집행은 다시 브라우저가 한다 — 3단계 역할 분담 #mechanism
- [method] CORS 에러 해결은 프론트엔드가 아닌 서버 측 헤더 설정이 정석이다 — 프록시 서버 경유도 같은 원리(서버가 대신 요청) #troubleshooting
- [fact] cross-origin 리소스의 "표시"는 허용되지만 "읽기"는 차단된다 — img, script, iframe 표시 가능, contentDocument 접근 불가 #sop-exception

## Relations

- derived_from [[Same-Origin Policy (동일 출처 정책)]] (브라우저가 cross-origin 접근을 기본 차단하는 정책)
- derived_from [[CORS (Cross-Origin Resource Sharing)]] (서버가 허용 출처를 헤더로 선언하는 예외 메커니즘)
- connects_to [[iframe (Inline Frame)]] (SOP가 적용되어 cross-origin iframe 내부 DOM 접근이 차단되는 대표 사례)
- connects_to [[웹 기초]] (웹 보안의 기본 구조)

---

**도출일**: 2026-02-13
**출처**: SOP(브라우저 기본 차단) + CORS(서버 예외 선언) — "출처 기반 접근 제어"라는 하나의 메커니즘에서 차단과 허용의 역할 분담 구조를 도출