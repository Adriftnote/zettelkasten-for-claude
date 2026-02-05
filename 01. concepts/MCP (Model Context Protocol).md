---
title: MCP (Model Context Protocol)
type: concept
permalink: knowledge/concepts/mcp
tags:
- ai
- protocol
- anthropic
- concepts
category: AI 프로토콜
difficulty: 중급
---

# MCP (Model Context Protocol)

AI 모델이 외부 도구/데이터 소스와 통신하는 **표준화된 프로토콜**입니다.

## 📖 개요

MCP는 Anthropic이 만든 프로토콜로, AI 모델이 외부 도구 및 데이터 소스와 **표준화된 방식으로 통신**할 수 있게 합니다. JSON-RPC 기반으로, 도구 정의 → 호출 → 결과 반환 흐름을 규격화합니다.

## 🎭 비유

**전화로 대화할 때 쓰는 언어/문법**과 같습니다. 전화선(Native Host)이 물리적 연결이라면, MCP는 그 위에서 주고받는 대화의 규칙입니다.

## ✨ 특징

- **표준화된 규격**: 도구 정의, 호출, 결과 반환 형식 통일
- **JSON-RPC 기반**: 요청-응답 구조 명확
- **도구 발견**: AI가 사용 가능한 도구가 무엇인지 알 수 있음
- **확장 가능**: 다양한 도구/데이터 소스 연결 가능

## 💡 예시

**Claude Code에서의 등록**:
```
Built-in MCPs (always available)
claude-in-chrome · ✔ connected
```
→ Claude Code가 브라우저 조작 도구들을 인식

**전체 통신 흐름**:
```
Claude Code (또는 claude.ai)
    ↓ MCP 프로토콜
Chrome 확장 (MCP 서버 역할)
    ↓ Native Messaging
Native Host (로컬 실행 파일)
    ↓
브라우저 조작 / 파일 접근 등
```

## 🆚 왜 둘 다 필요한가?

| 구분 | 역할 | 없으면? |
|------|------|---------|
| MCP | AI가 도구 인식/호출 | Claude가 어떤 도구가 있는지 모름 |
| Native Host | 로컬 시스템 접근 | 브라우저 밖에 접근 못함 |

> 파일/터미널 작업은 MCP만 있으면 됨. Claude Code 자체가 로컬 실행 프로그램이라 샌드박스 제약 없음.
> Chrome 제어만 특수 케이스: 브라우저 샌드박스를 우회해야 하므로 Native Host 필요.

## Relations

- different_from [[Native Host]] (프로토콜 vs 통신 채널)
- created_by [[Anthropic]] (Anthropic이 개발)
- used_by [[Claude Code]] (Claude Code의 핵심 기능)
- relates_to [[Chrome Extension]] (MCP 서버로 동작)

---

**난이도**: 중급
**카테고리**: AI 프로토콜
**마지막 업데이트**: 2026년 2월