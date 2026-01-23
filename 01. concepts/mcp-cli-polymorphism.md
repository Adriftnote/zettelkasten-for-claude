---
title: MCP CLI Polymorphism
type: architecture
permalink: knowledge/concepts/mcp-cli-polymorphism
tags:
- mcp
- cli
- polymorphism
- abstraction
- multi-server
category: System Architecture
difficulty: 중급
---

# MCP CLI Polymorphism

다양한 MCP 서버를 단일 CLI 인터페이스로 관리하는 다형성 아키텍처입니다.

## 📖 개요

MCP CLI Polymorphism은 **서로 다른 MCP 서버들이 동일한 CLI 인터페이스를 통해 접근 가능**하도록 추상화하는 패턴입니다. 서버의 구현 방식(Python, Node.js, 등)이나 기능 범위와 무관하게 일관된 방식으로 상호작용합니다.

## 🎭 비유

USB 포트 같습니다. 마우스, 키보드, 프린터 등 다양한 기기가 같은 USB 포트에 꽂히고, 운영체제가 각각의 드라이버를 자동으로 찾아 실행합니다.

## ✨ 특징

- **공통 인터페이스**: 모든 MCP 서버가 동일한 API 준수
- **동적 디스패칭**: 런타임에 올바른 서버로 요청 라우팅
- **타입 안정성**: 서버별 기능 차이를 타입 시스템으로 관리
- **확장성**: 새로운 MCP 서버 추가 시 CLI 코드 수정 불필요
- **역호환성**: 기존 서버의 변경이 CLI에 영향 없음

## 💡 예시

**다양한 MCP 서버 관리**:

```
CLI Interface: mcp-cli
    ↓
┌──────────────────────────────────────────┐
│  Polymorphic Router (Protocol Handler)    │
└──────────────────────────────────────────┘
    ↓
┌────────────┬────────────┬────────────┐
│ File MCP   │ Web MCP    │ Memory MCP │
│ (Python)   │ (Node.js)  │ (Rust)     │
└────────────┴────────────┴────────────┘

[사용자 명령어]
$ mcp-cli file list /path
  ↓ [Router가 서버 타입 판단]
  ↓ File MCP 서버로 라우팅
  ✓ 파일 목록 반환

$ mcp-cli web fetch https://...
  ↓ [Web MCP 서버로 라우팅]
  ✓ 웹 콘텐츠 반환

$ mcp-cli memory search "query"
  ↓ [Memory MCP 서버로 라우팅]
  ✓ 검색 결과 반환
```

## 🛠️ 구현 방식

**1. 추상 기본 클래스 정의**
```
MCPServer (Abstract)
  ├── name: string
  ├── version: string
  ├── execute(command, args) → Result
  └── validate(command) → bool
```

**2. 서버별 구현**
```
FileMCPServer extends MCPServer { ... }
WebMCPServer extends MCPServer { ... }
MemoryMCPServer extends MCPServer { ... }
```

**3. 라우팅 레이어**
```
MCPRouter
  ├── registry: Map<name, server>
  ├── route(command) → server
  └── dispatch(server, args) → result
```

## Relations

- relates_to [[tool-hub-philosophy]]
- relates_to [[tool-discovery-pattern]]
- relates_to [[hook-based-mcp-auto-activation]]
- relates_to [[server-selection-pattern]]
- relates_to [[01. concepts/agent-architecture-guide]]

---

**난이도**: 중급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: MCP Architecture Patterns