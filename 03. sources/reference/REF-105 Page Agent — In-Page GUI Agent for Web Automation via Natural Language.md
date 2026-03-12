---
title: REF-105 Page Agent — In-Page GUI Agent for Web Automation via Natural Language
type: doc-summary
permalink: sources/reference/page-agent-in-page-gui-agent
tags:
- browser-automation
- ai-agent
- javascript
- dom
- gui-agent
- alibaba
date: 2026-03-12
---

# Page Agent — In-Page GUI Agent for Web Automation via Natural Language

Alibaba의 오픈소스 JavaScript 라이브러리. 웹페이지 **내부에서** 실행되는 GUI 에이전트로, 자연어 명령으로 웹 인터페이스를 제어한다. 스크린샷 기반 외부 자동화와 달리 DOM을 직접 조작하는 텍스트 중심 접근.

## 📖 핵심 아이디어

기존 브라우저 자동화(Playwright, Puppeteer, browser-use 등)는 **외부에서** 브라우저를 제어한다 — headless 브라우저, 스크린샷, 비전 모델. Page Agent는 정반대로, **웹페이지 안에 에이전트를 삽입**하여 DOM을 직접 읽고 조작한다. 스크린샷 없이 텍스트 기반으로 UI 상태를 파악하므로 비전 모델이 불필요하고, script 태그 하나로 통합 가능하다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| 실행 모델 | In-page JavaScript — DOM 직접 접근, 클라이언트사이드 처리 |
| UI 인식 | 텍스트/DOM 구조 기반 (스크린샷/비전 모델 불필요) |
| LLM 연동 | OpenAI-compatible 엔드포인트 (Qwen, GPT 등 아무 모델) |
| 통합 방식 | `<script>` 태그 또는 `npm install page-agent` |
| Human-in-the-loop | 빌트인 UI로 사용자 확인/개입 가능 |
| 멀티탭 | Chrome 확장프로그램으로 크로스탭 자동화 지원 |
| DOM 처리 | browser-use 프로젝트의 DOM 파싱 컴포넌트 기반 |
| 언어 | TypeScript, 5.2k+ GitHub Stars (2026-03) |

## 🔧 작동 방식 / 적용 방법

```
[웹페이지 DOM]
      ↓ DOM 구조 텍스트 추출
[Page Agent (in-page JS)]
      ↓ 자연어 명령 + DOM 컨텍스트
[LLM API (Qwen, GPT 등)]
      ↓ 액션 결정
[Page Agent] → DOM 조작 (클릭, 입력, 네비게이션)
```

```javascript
// 최소 통합 예시
const agent = new PageAgent({
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'YOUR_API_KEY',
    language: 'en-US',
});
await agent.execute('Click the login button');
```

4가지 주요 유즈케이스:
1. **SaaS AI Copilot** — 백엔드 수정 없이 제품에 AI 어시스턴트 임베딩
2. **워크플로우 자동화** — 멀티스텝 폼을 자연어 한 줄로 처리
3. **접근성** — 음성 제어, 스크린리더 호환
4. **크로스탭 에이전트** — Chrome 확장으로 멀티탭 작업

## 💡 실용적 평가 / 적용

**장점:**
- 통합 비용 극저 — script 태그 하나로 기존 웹앱에 즉시 추가
- 비전 모델 불필요 — DOM 텍스트 기반이라 토큰 비용 절감, 속도 향상
- 모델 비종속 — OpenAI-compatible 엔드포인트면 아무거나 가능
- SaaS 제품에 AI 기능 추가할 때 백엔드 변경 없이 프론트엔드만으로 구현 가능

**한계:**
- 클라이언트 사이드 실행 → API 키 노출 위험 (프로덕션에서는 프록시 필수)
- DOM이 복잡하거나 Shadow DOM/iframe이 많으면 제한적
- 서버사이드 렌더링 전 DOM 미완성 상태에서는 동작 불가
- 외부 자동화(Playwright 등)와 달리 브라우저 외부 조작(파일 다운로드, 시스템 연동) 불가

**우리 맥락 적용:**
- Chrome MCP(claude-in-chrome)와 상호보완적 — MCP는 외부 제어, Page Agent는 내부 제어
- SaaS 대시보드(Metabase 등)에 자연어 인터페이스 추가 시 참고할 패턴
- browser-use의 DOM 파싱 로직을 재사용한 점 — 기존 도구 조합의 좋은 예시

## 🔗 관련 개념

- [[AI Agency (AI 에이전시)]] - (Page Agent는 "도구로서의 에이전트" 사례 — 웹페이지 안에서 사용자 의도를 실행하는 자동화 도구)
- [[Knowledge Agent Architecture]] - (에이전트가 구조화된 정보(DOM)를 기반으로 추론하고 행동하는 패턴이 유사)
- [[Multi-Agent Patterns]] - (멀티탭 확장은 여러 에이전트가 탭별로 분산 작업하는 패턴)

---

**작성일**: 2026-03-12
**분류**: 브라우저 자동화, AI 에이전트
**출처**: https://github.com/alibaba/page-agent