---
title: Native Host와 MCP
type: note
permalink: knowledge/concepts/native-host-mcp
tags:
- native-host
- mcp
- chrome-extension
- claude-code
- concept
---

# Native Host와 MCP

브라우저-로컬 시스템 간 통신을 위한 두 가지 계층: 물리적 채널(Native Host)과 프로토콜(MCP)

## 📖 개요

**Native Host**는 Chrome 확장이 로컬 시스템과 통신하는 물리적 채널이고, **MCP(Model Context Protocol)**는 AI 모델이 외부 도구와 표준화된 방식으로 통신하는 프로토콜입니다. Chrome 브라우저를 AI로 제어하려면 둘 다 필요합니다.

## 🎭 비유

- **Native Host** = 전화선 (물리적 연결)
- **MCP** = 전화로 대화할 때 쓰는 언어/문법 (프로토콜)

## ✨ 핵심 차이

| 구분 | Native Host | MCP |
|------|-------------|-----|
| **역할** | 통신 채널 | 메시지 규격 + 도구 정의 |
| **수준** | 물리적 연결 | 프로토콜 |
| **담당** | stdin/stdout 메시지 교환 | JSON-RPC 기반 도구 호출 |

## 💡 왜 둘 다 필요한가?

```
Claude Code
    ↓ MCP 프로토콜
Chrome 확장 (MCP 서버)
    ↓ Native Messaging
Native Host (로컬 실행 파일)
    ↓
브라우저 조작 / 파일 접근
```

- **MCP만**: Chrome 확장이 브라우저 밖(로컬 시스템)에 접근 못함
- **Native Host만**: Claude가 어떤 도구가 있는지, 어떻게 호출하는지 모름

## ✨ Claude Code에서의 특수성

| 기능 | 필요한 것 | 이유 |
|------|----------|------|
| 파일/터미널 | MCP만 | Claude Code가 로컬에서 실행 |
| **Chrome 제어** | MCP + Native Host | 브라우저 샌드박스 우회 필요 |

## Relations

- part_of [[Claude Code]] (구성요소)
- enables [[Chrome 브라우저 자동화]] (가능케 함)
- relates_to [[Chrome Extension]] (함께 동작)
- different_from [[일반 MCP 도구]] (추가 요구사항)

---

**작성일**: 2026-02-05
**분류**: 기술 / Chrome Extension / AI 통합