---
title: basic-memory v0.20 MCP 재발 - onnxruntime DLL import hang과 cp949 인코딩
type: workcase
permalink: sources/workcases/basic-memory-v020-mcp-onnxruntime-dll-import-hang-cp949
tags:
- basic-memory
- mcp
- onnxruntime
- amd-gpu
- cp949
- troubleshooting
---

# basic-memory v0.20 MCP 재발 - onnxruntime DLL import hang과 cp949 인코딩

## 문제 상황

Claude Code에서 `/mcp` reconnect 시 basic-memory MCP 서버 연결 실패. "Failed to reconnect to basic-memory" 에러. 이전 세션(같은 날 오전)까지 정상 작동했으나 갑자기 발생.

이전 워크케이스에서 적용한 해결책(`ORT_PROVIDERS=CPUExecutionProvider`, exe 직접 실행)이 이미 `.claude.json`에 설정된 상태.

## 시도했지만 안 된 방법

1. **`/mcp` reconnect** → "Failed to reconnect to basic-memory"
2. **Claude Code 재시작** → 동일 실패
3. **`PYTHONUTF8=1` 환경변수 추가** → cp949 인코딩 문제는 해결하지만 근본 hang은 해결 불가
4. **`semantic_search_enabled: false` (config.json)** → config 읽기 전 import 단계에서 이미 hang

## 근본 원인

두 개의 독립적 문제가 겹침:

### 문제 1: onnxruntime DLL import hang (치명적)

```
원인 체인:
basic-memory.exe mcp 실행
    → Python 모듈 import 시작
    → fastembed → import onnxruntime
    → onnxruntime C++ DLL 로딩 시 AMD GPU(DirectML) 하드웨어 감지
    → AMD GPU 접근에서 무한 hang (프로세스 응답 없음)
    → MCP stdio 서버 시작 불가 → 연결 실패
```

**이전 워크케이스와의 차이**: 이전에는 `ORT_PROVIDERS=CPUExecutionProvider`로 해결됐는데, 이번에는 **DLL 로딩(import) 단계**에서 이미 hang. 환경변수는 import 이후 세션 생성 시에만 작동하므로 무효.

**추정 원인**: `basic-memory.exe`가 오늘(09:57) 재설치되면서 onnxruntime도 업데이트됨. 새 버전의 onnxruntime이 import 시점에 GPU 프로빙을 더 적극적으로 수행.

### 문제 2: cp949 인코딩 에러 (부차적)

```
UnicodeEncodeError: 'cp949' codec can't encode character '\u2014' (em dash)
```

- `watch_service.py`가 `watch-status.json`에 에러 상태를 기록할 때 `write_text()` 호출
- `write_text()`는 Windows 기본 인코딩(cp949) 사용
- 이전 워크케이스 파일명의 em dash(`—`, U+2014)가 에러 메시지에 포함
- cp949는 em dash 인코딩 불가 → file sync runner 크래시

## 해결책

### 문제 1: onnxruntime-cpu 교체 시도 (실패)

~~basic-memory venv 내 `onnxruntime`을 GPU 코드가 없는 `onnxruntime-cpu`로 교체~~ — **실패**.

**2026-03-13 추가 검증 결과:**

PyPI의 `onnxruntime` Windows wheel은 **모든 버전에서 DirectML이 메인 DLL에 내장**:

```
시도 1: onnxruntime 1.24.3 → hang (원본)
시도 2: onnxruntime 1.21.1 → hang (다운그레이드)
시도 3: onnxruntime 1.19.2 → cp313 wheel 없음 (Python 3.13 미지원)
시도 4: onnxruntime_providers_shared.dll rename → hang (메인 DLL에 GPU 코드 내장)
시도 5: ORT_PROVIDERS=CPUExecutionProvider 환경변수 → hang (import 이전 단계)
```

- `onnxruntime-cpu`는 PyPI에 **별도 패키지로 존재하지 않음** (Windows cp313 기준)
- MS 별도 인덱스(`aiinfra.pkgs.visualstudio.com`)에 있을 수 있으나 미검증
- GPU 코드가 `onnxruntime.dll` 자체에 컴파일되어 있어 DLL 분리/삭제 불가

### 문제 1 실제 해결 방향 (미완)

1. **MS onnxruntime-cpu 전용 인덱스에서 설치** — `--index-url https://aiinfra.pkgs.visualstudio.com/PublicPackages/_packaging/onnxruntime-cpu/pypi/simple/` (미검증)
2. **fastembed를 onnxruntime 없이 동작하도록 basic-memory 패치** — 업스트림 PR 필요
3. **WSL에서 basic-memory 실행** — Linux wheel은 DirectML 미포함
4. **onnxruntime 자체를 fastembed에서 제거하고 다른 추론 백엔드 사용** — 근본 해결이지만 대규모 수정

### 문제 2 해결: PYTHONUTF8=1

`.claude.json`의 basic-memory env에 추가:

```json
"env": {
  "ORT_PROVIDERS": "CPUExecutionProvider",
  "PYTHONUTF8": "1"
}
```

Python UTF-8 모드를 강제하여 `write_text()` 등에서 cp949 대신 UTF-8 사용.

### config.json 벡터 검색 비활성화 (보조)

```json
"semantic_search_enabled": false
```

단독으로는 해결 불가 (import 스킵 안 함), 하지만 onnxruntime-cpu 교체 후 불필요한 임베딩 연산 방지용.

## 적용

- `.claude.json` → `PYTHONUTF8=1` 추가 완료
- `~/.basic-memory/config.json` → `semantic_search_enabled: false` 변경 완료
- onnxruntime-cpu 교체 → **실패** (Windows PyPI wheel에 DirectML 내장, 별도 CPU 패키지 없음)
- 현재 상태: basic-memory MCP + CLI 모두 사용 불가, vecsearch CLI도 동일 hang
- onnxruntime 1.21.1로 다운그레이드 상태 (hang은 동일)

## 관련 Task

- 세션 내 즉시 대응 (별도 task 미등록)

## Relations

- uses [[basic-memory]] (MCP 서버로 사용 중인 지식베이스 도구)
- learned_from [[basic-memory v0.20 MCP 연결 실패 - onnxruntime AMD GPU hang]] (이전 동일 패턴 워크케이스 — 해결책이 이번엔 불충분)
- learned_from [[qmd embed AMD Vulkan GPU 크래시 - CPU 폴백으로 해결]] (AMD GPU + onnxruntime 반복 패턴)
- uses [[MCP CLI Polymorphism]] (MCP stdio 서버 실행 구조)

## Observations

- [fact] `ORT_PROVIDERS=CPUExecutionProvider`는 onnxruntime 세션 생성 시에만 작동, DLL import 단계 hang에는 무효 #onnxruntime #env-var-scope
- [fact] onnxruntime 업데이트 시 GPU 프로빙 동작이 변경될 수 있어 이전에 작동하던 환경변수 우회가 실패할 수 있음 #onnxruntime #breaking-change
- [fact] basic-memory config.json의 `semantic_search_enabled: false`는 fastembed import를 스킵하지 않음 (모듈 레벨 import) #basic-memory #config-limitation
- [fact] Python `pathlib.write_text()`는 Windows에서 기본 locale 인코딩(cp949) 사용, em dash 등 유니코드 특수문자 인코딩 실패 #python #windows #cp949
- [warning] `onnxruntime-cpu`는 Windows cp313에서 별도 PyPI 패키지로 존재하지 않음 — 교체 불가 #onnxruntime #windows #pypi
- [fact] PyPI onnxruntime Windows wheel은 버전 무관 DirectML이 메인 DLL(`onnxruntime.dll`)에 내장 — DLL 분리/rename 무효 #onnxruntime #directml
- [fact] onnxruntime hang은 basic-memory뿐 아니라 vecsearch 등 onnxruntime 의존 도구 전체에 영향 #onnxruntime #blast-radius
- [solution] `PYTHONUTF8=1` 환경변수로 Python 전체 UTF-8 모드 강제하면 cp949 인코딩 문제 해결 #python #windows
- [warning] em dash(—, U+2014)가 파일명에 포함되면 Windows cp949 환경에서 연쇄 실패 가능 — 파일명은 ASCII 안전 문자 사용 권장 #windows #filename
- [pattern] AMD GPU + onnxruntime hang은 qmd, basic-memory 등에서 3회째 반복 — 새 Python 패키지에 onnxruntime 의존성 있으면 항상 onnxruntime-cpu 사용 검토 #amd-gpu #recurring-issue
