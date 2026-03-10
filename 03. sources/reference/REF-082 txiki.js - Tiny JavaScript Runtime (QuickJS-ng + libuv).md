---
title: REF-082 txiki.js - Tiny JavaScript Runtime (QuickJS-ng + libuv)
type: doc-summary
permalink: sources/reference/txiki-js-tiny-javascript-runtime
tags:
- javascript
- runtime
- quickjs
- libuv
- embedded
- wasm
- ffi
date: 2026-03-09
---

# txiki.js - Tiny JavaScript Runtime (QuickJS-ng + libuv)

QuickJS-ng 엔진과 libuv 플랫폼 레이어를 결합한 초경량 JavaScript 런타임. WinterTC 표준을 지향하며 최소 풋프린트로 Web Platform API + 시스템 레벨 기능을 제공한다.

## 📖 핵심 아이디어

Node.js/Deno/Bun과 같은 JS 런타임 계보에서 **최소 크기와 임베딩 가능성**에 초점을 맞춘 런타임이다. V8 대신 QuickJS-ng(경량 JS 엔진)을, Node의 libuv를 그대로 재활용하여 크로스 플랫폼 비동기 I/O를 구현한다.

핵심 차별점: V8 기반 런타임들이 수백 MB 규모인 반면, txiki.js는 C 80% + JS 19%의 미니멀 구성으로 임베디드/엣지 환경에서도 동작할 수 있는 크기를 유지한다.

## 🛠️ 구성 요소 / 주요 내용

| 항목                    | 설명                                                                |
| --------------------- | ----------------------------------------------------------------- |
| **QuickJS-ng**        | JS 엔진. 최신 ECMAScript 지원, 작은 바이너리 크기                               |
| **libuv**             | 비동기 I/O 플랫폼 레이어 (Node.js에서도 사용)                                   |
| **Web Platform APIs** | `fetch`, `WebSocket`, `console`, `setTimeout`, `crypto`, `Worker` |
| **네트워크**              | TCP/UDP 소켓, Unix 도메인 소켓, HTTP 서버 + WebSocket 통합                   |
| **파일시스템**             | 비동기 FS 연산, 자식 프로세스, 시그널 처리                                        |
| **tjs:sqlite**        | 내장 SQLite 접근 모듈                                                   |
| **tjs:ffi**           | Foreign Function Interface — C 라이브러리 직접 호출                        |
| **tjs:path**          | 경로 유틸리티                                                           |
| **tjs:hashing**       | 해싱 모듈                                                             |
| **tjs compile**       | 단독 실행 파일 컴파일 (self-contained executable)                          |

## 🔧 작동 방식

```
[JavaScript 코드]
       │
       ▼
 [QuickJS-ng 엔진]  ←── ECMAScript 파싱/실행
       │
       ├──▶ [Web APIs]      fetch, WebSocket, Worker ...
       │
       ├──▶ [tjs:* 모듈]    sqlite, ffi, path, hashing
       │
       └──▶ [libuv]         TCP/UDP, FS, 자식프로세스, 시그널
              │
              ▼
       [OS 커널] (Linux/macOS/Windows)
```

**빌드:**
```bash
git clone --recursive --shallow-submodules https://github.com/saghul/txiki.js
cd txiki.js && make
./build/tjs   # REPL 실행
```

**단독 실행 파일 컴파일:**
```bash
tjs compile app.js    # → 단일 바이너리
```

## 💡 실용적 평가

**장점:**
- 극소 바이너리 크기 — IoT/엣지/임베디드 환경 적합
- libuv 재활용으로 검증된 비동기 I/O 안정성
- WinterTC 표준 지향 — 웹 호환 API
- FFI로 C 라이브러리 직접 호출 가능 → 확장성
- SQLite 내장 — 로컬 데이터 처리에 유리
- 단독 실행 파일 컴파일 지원

**한계:**
- npm 생태계 호환성 제한 — Node.js API 완전 호환 아님
- V8 대비 JS 실행 성능 열세 (QuickJS는 인터프리터 기반)
- 커뮤니티/생태계 규모가 Node/Deno/Bun 대비 매우 작음

**활용 시나리오:**
- 스크립팅 엔진으로 앱에 JS 임베딩
- 경량 CLI 도구/유틸리티 배포 (단일 바이너리)
- 엣지/IoT 환경에서 JS 실행
- C 라이브러리와 JS의 FFI 브릿지

## 🔗 관련 개념

- [[런타임 (Runtime)|런타임 (Runtime)]] - (txiki.js는 QuickJS-ng+libuv 조합의 경량 JS 런타임 구현체)
- [[javascript|JavaScript]] - (JS 언어의 대안적 실행 환경 — V8 독점에서 벗어난 QuickJS 기반 접근)
- [[engine|엔진 (Engine)]] - (QuickJS-ng는 JS 코드를 파싱/실행하는 엔진 역할)
- [[platform-layer|플랫폼 레이어 (Platform Layer)]] - (libuv는 OS와의 비동기 I/O를 중계하는 플랫폼 레이어)
- [[footprint|풋프린트 (Footprint)]] - (txiki.js의 핵심 설계 목표 — 극소 바이너리/메모리 크기)
- [[wintertc|WinterTC]] - (txiki.js가 지향하는 런타임 간 Web API 호환성 표준)

---

**작성일**: 2026-03-09
**분류**: JavaScript Runtime / Embedded Systems
**출처**: https://github.com/saghul/txiki.js