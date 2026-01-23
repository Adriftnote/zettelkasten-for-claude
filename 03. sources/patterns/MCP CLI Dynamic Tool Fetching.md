---
title: MCP CLI Dynamic Tool Fetching
type: note
permalink: patterns/mcp-cli-dynamic-tool-fetching
tags:
- mcp-cli
- pattern
- caching
- tool-discovery
extraction_status: pending
---

# MCP CLI Dynamic Tool Fetching

## 동작 방식

MCP CLI는 **매 명령 실행마다 도구를 동적으로 가져옴**.

- [mcp-cli] [fetches] [tools on every command execution]
- [tool discovery] [happens at] [runtime invocation]

## 관찰된 동작

```bash
$ mcp-cli sqlite_tiktok list_tables
Fetching tools for sqlite_tiktok...
# 테이블 목록 반환
```

- 매 실행마다 "Fetching tools for {server}..." 메시지 표시
- 실행 간 영속적 캐시 없음 (단일 실행 내에서만 캐시 가능)
- 잘못된 명령어 입력 시 제안 기능 제공 (`list-tables` → `list_tables`)

## 명명 규칙

- 도구 이름: **언더스코어** 사용 (`list_tables`)
- 하이픈 아님 (`list-tables` ❌)

## 시사점

1. **Lazy Loading 구현**: 서버 서브커맨드 호출 시에만 도구 로드
2. **캐시 갱신**: 서버 도구 변경 시 자동 반영
3. **성능 고려**: 반복 호출 시 네트워크 오버헤드 발생 가능

- [lazy loading pattern] [reduces] [startup overhead]
- [no persistent cache] [ensures] [tool freshness]

---

*Promoted from claude-mem: #277, #281 (2026-01-06)*

## Observations

- [fact] MCP CLI는 매 명령 실행마다 도구를 동적으로 가져옴 (영속적 캐시 없음) #mcp-cli #caching
- [pattern] Lazy loading으로 필요한 서버의 도구만 런타임에 로드 #lazy-loading #performance
- [tech] 잘못된 명령어 입력 시 자동 제안 기능 제공 (list-tables → list_tables) #ux #autocorrect
- [tip] 도구 이름은 언더스코어 규칙 사용, 하이픈 불가 #naming-convention
