---
title: SOP와 CORS는 독립 기술이 아니라 "출처 기반 접근 제어"의 차단-허용 한 쌍이다 #
type: note
permalink: synthesized/sop와-cors는-독립-기술이-아니라-출처-기반-접근-제어의-차단-허용-한-쌍이다
tags: ["mental_model", "synthesized"]
evidence_count: 4
generated: 2026-03-17T09:02:42Z
sources:
  - "notes/sop-blocks-cors-allows"
  - "notes/sop-blocks-cors-allows"
  - "notes/sop-blocks-cors-allows"
  - "functions/nid-kpi"
---

## 통찰

- SOP와 CORS는 웹 보안의 핵심 메커니즘으로, 브라우저, 서버, 그리고 사용자 간의 상호 작용을 정의한다.
- CORS는 브라우저의 차단과 서버의 허용을 통해 작동하며, 각 단계에서 책임이 분담된다.
- CORS 문제 해결의 핵심은 서버 측 헤더 설정이며, 프론트엔드 수정보다는 서버의 역할 변경에 집중해야 한다.

## 근거

- notes/sop-blocks-cors-allows
- notes/sop-blocks-cors-allows
- notes/sop-blocks-cors-allows
- functions/nid-kpi