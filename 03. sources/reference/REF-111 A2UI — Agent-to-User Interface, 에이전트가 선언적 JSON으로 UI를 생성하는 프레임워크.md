---
title: REF-111 A2UI — Agent-to-User Interface, 에이전트가 선언적 JSON으로 UI를 생성하는 프레임워크
type: note
permalink: zettelkasten/03.-sources/reference/ref-111-a2-ui-agent-to-user-interface-eijeonteuga-seoneonjeog-jsoneuro-uireul-saengseonghaneun-peureimweokeu
date: '2026-03-13'
tags:
- AI-agent
- UI-framework
- declarative-UI
- Google
- cross-platform
- A2A-protocol
---

# A2UI — Agent-to-User Interface

Google이 만든 오픈소스 프레임워크. AI 에이전트가 선언적 JSON 페이로드로 리치 UI를 생성하고, 클라이언트가 네이티브 컴포넌트로 렌더링한다. "Safe like data, but expressive like code."

## 📖 핵심 아이디어

에이전트는 UI를 **코드가 아닌 데이터(JSON)**로 표현한다. 클라이언트 앱이 자체 컴포넌트 라이브러리로 렌더링하므로, LLM이 임의 코드를 실행하는 보안 위험 없이 풍부한 UI를 생성할 수 있다. UI intent(의도)와 platform-specific implementation(구현)을 분리하는 것이 핵심 설계 원칙.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| Specification | UI 컴포넌트를 기술하는 선언적 JSON 포맷 정의 |
| Renderers | Lit(Web), Flutter(GenUI SDK) 등 프레임워크별 렌더러 |
| Agent SDKs | Python, TypeScript 에이전트 개발 도구 |
| Smart Wrapper Registry | 커스텀 컴포넌트 매핑 + 샌드박싱 정책 관리 |
| Transport | A2A Protocol, AG UI 등 전송 계층 |

## 🔧 작동 방식 / 적용 방법

```
[AI Agent]
    ↓ A2UI JSON 생성 (컴포넌트 구성 선언)
[Transport] ← A2A Protocol / AG UI
    ↓
[A2UI Renderer] ← 클라이언트 사이드 JSON 파싱
    ↓
[Native Components] ← Lit / Flutter / React 등으로 렌더링
```

**핵심 메커니즘:**
- 플랫 컴포넌트 리스트 + ID 참조 → 점진적 UI 업데이트, 프로그레시브 렌더링 가능
- 에이전트는 사전 승인된 컴포넌트 카탈로그만 사용 (임의 코드 실행 불가)
- 하나의 JSON 페이로드가 Flutter, Angular, Lit, React 등 여러 프레임워크에서 렌더링 가능

## 💡 실용적 평가 / 적용

**장점:**
- 보안: 코드 실행 없이 데이터만 전송 → LLM hallucination으로 인한 보안 사고 방지
- 크로스 플랫폼: JSON 한 번 생성으로 웹/모바일/데스크톱 렌더링
- LLM 친화적: 플랫 구조라 토큰 효율적, 점진적 생성 가능

**한계:**
- v0.8 Public Preview 단계 — 스펙 미확정
- React, Jetpack Compose, SwiftUI 렌더러는 로드맵 (미구현)
- 사전 정의된 컴포넌트 카탈로그에 제한됨 → 완전 자유로운 UI 생성은 불가

**적용 시나리오:**
- 동적 데이터 수집 (컨텍스트 인식 폼)
- 서브 에이전트가 부모 앱 내에서 UI 렌더링
- 엔터프라이즈 대시보드/시각화 온디맨드 생성

**기술 스택:** TypeScript 86.8%, Python 10.9% | Apache 2.0

## 🔗 관련 개념

- [[REF-105 Page Agent — In-Page GUI Agent for Web Automation via Natural Language]] - (에이전트 기반 UI 자동화라는 공통 도메인, Page Agent는 기존 DOM 조작, A2UI는 새 UI 선언 생성이라는 접근 차이)
- [[AI Agent (인공지능 에이전트)]] - (에이전트가 UI를 생성하는 새로운 interaction 패턴)
- [[MCP (Model Context Protocol)]] - (에이전트 통신 프로토콜이라는 공통 레이어, A2UI는 UI 렌더링에 특화)

---

**작성일**: 2026-03-13
**출처**: https://github.com/google/A2UI
**분류**: AI Agent, UI Framework, Google