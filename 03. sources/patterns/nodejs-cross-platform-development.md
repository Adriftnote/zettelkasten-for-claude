---
title: Node.js Cross-Platform Development Patterns
type: note
permalink: knowledge/node.js-cross-platform-development-patterns
tags:
- nodejs
- cross-platform
- windows
- linux
- python
- mcp
- best-practices
extraction_status: pending
---

# Node.js Cross-Platform Development Patterns

Windows와 Linux/Mac 모두에서 동작하는 Node.js 프로젝트를 만들기 위한 패턴들.

## Python 명령어

Windows는 `python`, Linux/Mac은 `python3`를 사용한다.

```typescript
// TypeScript/JavaScript
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

// 환경변수로 오버라이드 가능하게
const PYTHON_PATH = process.env.PYTHON_PATH 
  || (process.platform === 'win32' ? 'python' : 'python3');
```

- [pattern] Platform detection using `process.platform === 'win32'`
- [applies_to] Any Node.js project that calls Python

## 파일/디렉토리 삭제

`rm -rf`는 Windows cmd에서 안 된다.

```json
// package.json - BAD
"clean": "rm -rf dist"

// package.json - GOOD (Node.js 14.14+)
"clean": "node -e \"require('fs').rmSync('dist', {recursive: true, force: true})\""
```

또는 `rimraf` 패키지 사용:
```json
"devDependencies": { "rimraf": "^5.0.0" },
"scripts": { "clean": "rimraf dist" }
```

- [pattern] Use `fs.rmSync()` or `rimraf` package for cross-platform file deletion
- [requires] Node.js 14.14+ for `fs.rmSync()`

## Python venv 경로

venv의 site-packages 경로가 OS마다 다르다.

| OS | 경로 |
|----|------|
| Windows | `venv/Lib/site-packages` |
| Linux/Mac | `venv/lib/python3.x/site-packages` |

```python
# Python에서 cross-platform venv 탐색
import os, glob, sys

def find_venv_site_packages(project_root):
    # Windows 먼저
    win_path = os.path.join(project_root, "venv", "Lib", "site-packages")
    if os.path.exists(win_path):
        return win_path
    # Linux/Mac
    unix_lib = os.path.join(project_root, "venv", "lib")
    if os.path.exists(unix_lib):
        matches = glob.glob(os.path.join(unix_lib, "python*/site-packages"))
        if matches:
            return matches[0]
    return None
```

- [pattern] Check Windows path first, then glob for Unix path
- [gotcha] Windows uses `Lib` (capital L), Unix uses `lib`

## Shell 스크립트

bash 스크립트는 Windows에서 직접 실행 안 됨.

| 방법 | 파일 |
|------|------|
| Linux/Mac/Git Bash | `setup.sh` |
| Windows PowerShell | `setup.ps1` |

두 스크립트 모두 제공하는 것이 좋다.

- [best_practice] Provide both `.sh` and `.ps1` scripts for setup tasks
- [alternative] Git Bash on Windows can run `.sh` scripts

## MCP SDK 참고

`@modelcontextprotocol/sdk`는 Windows를 지원한다. `StdioClientTransport`가 내부적으로 cross-platform spawn을 처리함.

- [discovery] MCP SDK itself handles Windows compatibility
- [gotcha] Issues come from surrounding code (Python calls, npm scripts, paths)

## 관련 작업

- [created_from] Tool Box MCP Windows 지원 추가 작업 (2026-01-09)
- [applies_to] MCP 서버 개발, Node.js CLI 도구 개발
