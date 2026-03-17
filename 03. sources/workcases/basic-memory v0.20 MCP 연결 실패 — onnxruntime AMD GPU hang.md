---
title: basic-memory v0.20 MCP 연결 실패 — onnxruntime AMD GPU hang
type: note
permalink: zettelkasten/03.-sources/workcases/basic-memory-v0.20-mcp-yeongyeol-silpae-onnxruntime-amd-gpu-hang
tags:
- basic-memory
- mcp
- onnxruntime
- amd-gpu
- troubleshooting
- uvx
---

# basic-memory v0.20 MCP 연결 실패 — onnxruntime AMD GPU hang

## 문제 상황

Claude Code에서 `/mcp` reconnect 시 basic-memory MCP 서버 연결 실패. "Failed to reconnect to basic-memory" 에러. 이전 세션까지 정상 작동했으나 갑자기 발생.

## 시도했지만 안 된 방법

1. **uv cache clean** → 캐시 1.8GB 삭제했으나 uvx가 최신 버전 다시 resolve하면서 동일 hang
2. **pip install basic-memory** → 설치는 되지만 `basic-memory --version` 실행 시 동일 hang
3. **v0.17.6 롤백** → v0.20이 이미 DB 마이그레이션(alembic revision `k4e5f6g7h8i9`) 적용 → `Can't locate revision` 에러로 실패

## 근본 원인

```
원인 체인:
.claude.json MCP: "uvx basic-memory mcp"
    → uvx는 매번 최신 버전 resolve (v0.17.6 → v0.20.2 자동 업그레이드)
    → v0.20에서 fastembed 의존성 추가 (임베딩 검색 기능)
    → fastembed → onnxruntime 1.24.3 설치
    → onnxruntime 초기화 시 AMD GPU (Vulkan) 접근 시도
    → AMD GPU + onnxruntime = 무한 hang (프로세스 응답 없음)
    → MCP stdio 서버 시작 불가 → 연결 실패
```

**핵심**: uvx는 `pip install`과 달리 실행할 때마다 최신 버전을 가져오는 구조. 사용자가 업데이트하지 않아도 자동으로 breaking change를 맞을 수 있다.

**추가 문제**: v0.20이 한 번이라도 실행되면 DB 마이그레이션이 적용되어 v0.17 롤백 불가 (alembic revision 불일치).

## 해결책

### 1. MCP command 변경: uvx → 직접 exe

```json
// Before (매번 최신 resolve → 예측 불가)
"command": "C:\\Users\\RL\\.local\\bin\\uvx.exe",
"args": ["basic-memory", "mcp"]

// After (고정 버전 실행)
"command": "C:\\Users\\RL\\.local\\bin\\basic-memory.exe",
"args": ["mcp"]
```

### 2. GPU 비활성화 환경변수 추가

```json
"env": {
  "ORT_PROVIDERS": "CPUExecutionProvider"
}
```

### 3. 버전 업그레이드

```bash
uv tool install basic-memory==0.20.2 --force
```

## 적용

- `.claude.json` → `mcpServers.basic-memory` 설정 변경 완료
- MEMORY.md 트러블슈팅 섹션에 기록

## 관련 Task

- 세션 내 즉시 해결 (별도 task 미등록)

## Relations

- uses [[basic-memory]] (MCP 서버로 사용 중인 지식베이스 도구)
- learned_from [[qmd embed AMD Vulkan GPU 크래시 — CPU 폴백으로 해결]] (동일한 AMD GPU + onnxruntime hang 패턴)
- uses [[MCP CLI Polymorphism]] (MCP stdio 서버 실행 구조)

## Observations

- [fact] uvx는 매번 최신 버전을 resolve하므로 사용자 모르게 breaking change 적용 가능 #uvx #version-management
- [fact] basic-memory v0.20에서 fastembed(→onnxruntime) 의존성 추가됨 #basic-memory #breaking-change
- [fact] onnxruntime은 AMD GPU(Vulkan)에서 초기화 시 무한 hang — import 단계에서 블로킹 #onnxruntime #amd-gpu
- [solution] MCP env에 `ORT_PROVIDERS=CPUExecutionProvider` 추가하면 GPU 우회 가능 #onnxruntime #workaround
- [solution] uvx 대신 uv tool install로 고정 설치 후 직접 exe 경로 지정이 안정적 #uvx #mcp-config
- [warning] v0.20이 한 번이라도 실행되면 DB 마이그레이션 적용 → v0.17 롤백 불가 #alembic #migration
- [pattern] AMD GPU + onnxruntime hang은 qmd, basic-memory 등 반복 발생 — 새 Python 패키지에 onnxruntime 의존성 있으면 항상 주의 #amd-gpu #recurring-issue