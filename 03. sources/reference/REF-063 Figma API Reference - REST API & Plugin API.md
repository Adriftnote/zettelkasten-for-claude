---
title: REF-063 Figma API Reference - REST API & Plugin API
type: doc-summary
permalink: sources/reference/figma-api-reference
tags:
- figma
- api
- rest-api
- plugin-api
- oauth
- webhooks
date: 2026-02-25
---

# Figma API Reference - REST API & Plugin API

Figma의 두 가지 핵심 API(REST API, Plugin API)의 엔드포인트, 인증, 노드 구조를 정리한 레퍼런스.

## 📖 핵심 아이디어

Figma는 **REST API**(외부 서비스에서 HTTP 호출)와 **Plugin API**(에디터 내부 확장)라는 두 축의 API를 제공한다. REST API는 파일 데이터 읽기/쓰기, 이미지 렌더링, 웹훅, 변수 관리 등을 지원하고, Plugin API는 `figma` 글로벌 객체를 통해 문서 트리를 직접 조작한다. 인증은 Personal Access Token(간편)과 OAuth 2.0(프로덕션)을 지원하며, 22개의 세분화된 스코프로 접근 범위를 제어한다.

## 🛠️ 구성 요소 / 주요 내용

### 인증

| 방식 | 헤더/방법 | 용도 |
|------|----------|------|
| Personal Access Token | `X-Figma-Token: TOKEN` | 개인 스크립트, 프로토타이핑 |
| OAuth 2.0 | Bearer Token | 프로덕션 앱, 다중 사용자, Activity Logs |

### REST API 엔드포인트 (Base: `https://api.figma.com`)

| 카테고리 | 주요 엔드포인트 | 설명 |
|----------|----------------|------|
| Files | `GET /v1/files/{file_key}` | 파일 JSON (document, components, styles) |
| Images | `GET /v1/images/{file_key}` | 노드를 png/jpeg/svg/gif로 렌더링 (URL 30일 만료) |
| Image Fills | `GET /v1/files/{file_key}/images` | 이미지 fill 다운로드 URL |
| Components | `GET /v1/files/{file_key}/components` | 파일 내 컴포넌트 목록 |
| Component Sets | `GET /v1/files/{file_key}/component_sets` | 컴포넌트 셋 (variants) |
| Styles | `GET /v1/files/{file_key}/styles` | 스타일 (FILL, TEXT, EFFECT, GRID) |
| Comments | `GET/POST/DELETE /v1/files/{file_key}/comments` | 댓글 CRUD |
| Projects | `GET /v1/teams/{team_id}/projects` | 팀 프로젝트 목록 |
| Variables | `GET /v1/files/{file_key}/variables/local` | 로컬 변수/컬렉션 (Enterprise 전용) |
| Webhooks | `POST/GET/DELETE /v2/webhooks` | 이벤트 알림 등록 (FILE_UPDATE 등) |
| Dev Resources | `GET /v1/dev_resources` | 노드에 연결된 외부 리소스 |
| Activity Logs | `GET /v1/activity_logs` | 조직 활동 로그 (Enterprise 관리자) |
| Users | `GET /v1/me` | 현재 인증된 사용자 |
| Payments | `GET /v1/payments` | Community 리소스 결제 정보 |

### Plugin API 문서 구조

```
DocumentNode (root, 파일당 1개)
  └── PageNode (각 페이지, 동적 로딩)
       └── SceneNode (레이어/객체)
            ├── FrameNode, RectangleNode, EllipseNode
            ├── TextNode, VectorNode, LineNode
            ├── ComponentNode, InstanceNode, ComponentSetNode
            ├── GroupNode, SectionNode, BooleanOperationNode
            └── StickyNode, ConnectorNode, TableNode, WidgetNode ...
```

### Rate Limits (분당, Dev/Full seat 기준)

| API Tier | Starter | Professional | Organization/Enterprise |
|----------|---------|--------------|------------------------|
| Tier 1 | 10/분 | 15/분 | 20/분 |
| Tier 2 | 25/분 | 50/분 | 100/분 |
| Tier 3 | 50/분 | 100/분 | 150/분 |

### 주요 스코프

| Scope | 설명 |
|-------|------|
| `file_content:read` | 파일 노드 읽기 |
| `file_variables:read/write` | 변수 (Enterprise) |
| `webhooks:read/write` | 웹훅 관리 |
| `library_analytics:read` | 디자인 시스템 분석 (Enterprise) |
| ~~`files:read`~~ | Deprecated → 세분화 스코프 사용 |

## 🔧 작동 방식 / 적용 방법

### REST API 호출 (TypeScript)

```typescript
import { type GetFileResponse } from '@figma/rest-api-spec'

const res = await axios.get<GetFileResponse>(
  `https://api.figma.com/v1/files/${fileKey}`,
  { headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN },
    params: { ids: '1:5,1:6', depth: 2 } }
)
```

### Plugin API 노드 생성

```javascript
// 사각형
const rect = figma.createRectangle()
rect.resize(200, 100)
rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]

// 텍스트 (폰트 로딩 필수)
const text = figma.createText()
await figma.loadFontAsync(text.fontName)
text.characters = 'Hello!'
```

### URL → fileKey/nodeId 파싱

| URL 패턴 | 추출 규칙 |
|----------|----------|
| `/design/:fileKey/:name?node-id=:nodeId` | nodeId의 `-` → `:` 변환 |
| `/design/:fileKey/branch/:branchKey/...` | branchKey를 fileKey로 |
| `/board/:fileKey/...` | FigJam 파일 |

## 💡 실용적 평가 / 적용

- **REST API**: 자동화, CI/CD 연동, 디자인 토큰 추출에 적합. Enterprise가 아니면 Variables API 사용 불가
- **Plugin API**: 에디터 내 커스텀 도구 제작. Mixin 패턴으로 노드 속성이 조합되므로 타입 체계 이해 필수
- **이미지 URL 30일 만료**: 영구 저장 필요 시 즉시 다운로드 필요
- **TypeScript 지원**: `@figma/rest-api-spec`(REST), `@figma/plugin-typings`(Plugin) 패키지 제공
- **Webhook**: 팀 단위 등록, FILE_UPDATE/COMMENT_CREATE 등 이벤트 실시간 수신 가능

## 🔗 관련 개념

- [[REF-062 Figma 비디자이너 활용 가이드 2025]] - (Figma 활용 맥락 — 이 API 문서의 실제 사용 환경)
- [[MCP (Model Context Protocol)]] - (Figma MCP 서버가 이 REST API를 래핑하여 AI 도구에 노출)
- [[OAuth 2.0]] - (Figma 인증의 프로덕션 방식)
- [[Webhook (웹훅)]] - (Figma 이벤트를 외부 서비스로 전달하는 메커니즘)

---

**작성일**: 2026-02-25
**분류**: API Documentation / Design Tools