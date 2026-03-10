---
title: MCP CLI 토큰 절약 — Bash 직접 호출로 46k 토큰 제거
type: note
permalink: 03.-sources/workcases/mcp-cli-tokeun-jeolyag-bash-jigjeob-hoculro-46k-tokeun-jegeo
tags:
- mcp
- cli
- token
- optimization
- claude-code
---

# MCP CLI 토큰 절약 — Bash 직접 호출로 46k 토큰 제거

## 상황
- Claude Code에 MCP 서버 연결 시 매 메시지마다 46k+ 토큰 소모
- /context 기준 MCP tools가 전체 컨텍스트의 23.1% 차지
- MCP 서버가 많을수록 토큰 낭비 심화

## 발단
- YouTube 영상 "코드깎는노인" 채널에서 토큰 절약 방법 소개
- `ENABLE_EXPERIMENTAL_MCP_CLI=true` 환경변수와 `mcp-cli` 도구

## 결과
- MCP 서버를 Claude Code에 직접 연결하지 않고 Bash로 호출
- 46k+ 토큰 → 0 토큰으로 MCP 도구 사용 가능
- agent-delegation-poc/ 하위에 POC 구현

## 교훈
- MCP 도구 정의가 컨텍스트의 큰 비중을 차지함
- 자주 쓰지 않는 MCP는 CLI 래핑이 효율적
- 현재는 Claude Code 자체 최적화로 개선됨 (이 방법의 필요성 감소)

## 소스
- `C:\Projects\data-analytics\mcp-cli-project\` (archive 대상)
