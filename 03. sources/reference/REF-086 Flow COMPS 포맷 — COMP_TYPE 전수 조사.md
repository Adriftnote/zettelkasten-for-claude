---
title: REF-086 Flow COMPS 포맷 — COMP_TYPE 전수 조사
type: doc-summary
permalink: sources/reference/flow-comps-format-comp-type
tags:
- flow
- api
- internal-api
- chrome-extension
date: 2026-03-09
---

# Flow COMPS 포맷 — COMP_TYPE 전수 조사

Flow.team 내부 API의 CNTN(콘텐츠) 필드 내 COMPS 배열 구조와 지원되는 COMP_TYPE 7종을 JS 번들 분석으로 전수 파악한 결과.

## 📖 핵심 아이디어

Flow.team의 게시물/Task 콘텐츠는 `CNTN` 필드에 JSON 문자열로 저장된다. 이 JSON의 최상위 구조는 `{ "COMPS": [...] }` 배열이며, 각 요소는 `{ COMP_TYPE, COMP_DETAIL }` 쌍으로 구성된다. COMPS 배열은 복수 타입을 혼합할 수 있어 TEXT + FILE + IMAGE를 한 게시물에 동시 포함 가능하다.

## 🛠️ 구성 요소 / 주요 내용

### CNTN 최상위 구조

```json
{
  "COMPS": [
    { "COMP_TYPE": "TEXT", "COMP_DETAIL": { ... } },
    { "COMP_TYPE": "FILE", "COMP_DETAIL": { ... } },
    ...
  ]
}
```

### COMP_TYPE 7종 전수 목록

| COMP_TYPE | 용도 | COMP_DETAIL 구조 | 소스 |
|-----------|------|-----------------|------|
| **TEXT** | 텍스트 본문 | `{ CONTENTS: string, HASHTAGS: string[], MENTIONS: string[], PRODUCT_MENTIONS: string[] }` | detail.min.js |
| **FILE** | 파일 첨부 | `ATCH_REC` 배열의 개별 파일 객체 (FILE_NM 등) | detail.min.js |
| **IMAGE** | 이미지 첨부 | `IMG_ATCH_REC` 배열의 개별 이미지 객체 | detail.min.js |
| **VOTE** | 투표/설문 | `VOTE_REC[0]` 객체 | detail.min.js |
| **SUBTASK** | 서브태스크 목록 | `SUBTASK_REC` 객체 | detail.min.js |
| **LINK** | 하이퍼링크/URL 프리뷰 | DOM `editor-hyperlink` 요소에서 `Often.getAttrs()` 추출 | detail.min.js |
| **MAP** | 지도/위치 | `{ URL: string, LOCATION: string, PLACE: string, PLACE_TITLE: string }` | detail.min.js |

### 추가 확인된 키

| 키 | 설명 |
|----|------|
| `COMP_SIZE` | 파일/이미지 크기 관련 (추정) |
| `FILE_NM` | 파일명 |
| `IMG_REC`, `IMG_CLOUD_REC` | 이미지 레코드/클라우드 레코드 |
| `FILE_CLOUD_REC` | 파일 클라우드 레코드 |

## 🔧 작동 방식 / 적용 방법

### COMPS 조립 흐름 (JS 번들 분석)

```
에디터 DOM 파싱
  ├─ 텍스트 영역       → { COMP_TYPE: "TEXT", COMP_DETAIL: { CONTENTS, HASHTAGS, MENTIONS } }
  ├─ .js-map-item      → { COMP_TYPE: "MAP",  COMP_DETAIL: getMapAttr(element) }
  ├─ editor-hyperlink   → { COMP_TYPE: "LINK", COMP_DETAIL: Often.getAttrs(element) }
  ├─ ATCH_REC 배열      → forEach → { COMP_TYPE: "FILE",  COMP_DETAIL: fileObj }
  ├─ IMG_ATCH_REC 배열  → forEach → { COMP_TYPE: "IMAGE", COMP_DETAIL: imgObj }
  ├─ VOTE_REC           → { COMP_TYPE: "VOTE", COMP_DETAIL: VOTE_REC[0] }
  └─ SUBTASK_REC        → { COMP_TYPE: "SUBTASK", COMP_DETAIL: SUBTASK_REC }

→ JSON.stringify({ COMPS: [...] }) → CNTN 필드
```

### 현재 flow-task-creator 사용 현황

```javascript
// content.js:512, 576 — TEXT 타입만 사용 중
CNTN: JSON.stringify({
  COMPS: [{ COMP_TYPE: 'TEXT', COMP_DETAIL: {
    CONTENTS: content || '', HASHTAGS: [], MENTIONS: []
  }}]
})
```

리치 콘텐츠(파일, 이미지, 체크리스트) 지원 시 COMPS 배열에 해당 타입 추가 필요.

### HTML_CNTN과의 관계

- `CNTN`: 구조화된 JSON (COMPS 배열) — 데이터 모델
- `HTML_CNTN`: URI 인코딩된 HTML — 렌더링용
- 두 필드 모두 Task 생성 API에 동시 전송. `EDITOR_YN: "Y"` 시 HTML_CNTN이 에디터에 표시됨

## 💡 실용적 평가 / 적용

### 활용 가능한 확장

| 기능 | 필요 타입 | 난이도 |
|------|-----------|--------|
| 체크리스트 내장 | SUBTASK | 중 (SUBTASK_REC 구조 파악 필요) |
| 파일 첨부 | FILE | 높음 (업로드 API 별도 필요) |
| 이미지 첨부 | IMAGE | 높음 (업로드 API 별도 필요) |
| URL 프리뷰 | LINK | 중 (getAttrs 구조 파악 필요) |
| 위치 공유 | MAP | 낮음 (구조 완전 파악됨) |
| 투표 | VOTE | 중 (VOTE_REC 구조 파악 필요) |

### 조사 방법론

JS 번들 분석 (fetch → regex matchAll)이 가장 효율적. 네트워크 캡처 대비 빠르고 전수 파악 가능. `detail.min.js`에 COMPS 관련 로직 집중.

### 한계

- FILE/IMAGE의 COMP_DETAIL 내부 속성은 실제 첨부 파일 생성 후 네트워크 캡처로 추가 확인 필요
- LINK의 Often.getAttrs() 반환값 상세 구조 미확인
- VOTE_REC, SUBTASK_REC 내부 스키마 미확인

## 🔗 관련 개념

- [[Flow 업무처리 자동화]] - (이 API의 소비자인 flow-task-creator 프로젝트)
- [[flow-task-creator-extension]] - (현재 TEXT 타입만 사용하는 Chrome Extension 모듈)

---

**작성일**: 2026-03-09
**분류**: 내부 API 리버스 엔지니어링
**조사 방법**: Chrome MCP → Flow.team JS 번들(detail.min.js) fetch + regex 분석