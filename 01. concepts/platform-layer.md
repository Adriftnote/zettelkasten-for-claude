---
title: 플랫폼 레이어 (Platform Layer)
type: concept
permalink: knowledge/concepts/platform-layer
tags:
- programming-basics
- runtime
- system-programming
- abstraction
category: 실행 도구
difficulty: 중급
---

# 플랫폼 레이어 (Platform Layer)

엔진과 운영체제 사이에서 시스템 기능을 중계하는 추상화 계층

## 📖 개요

플랫폼 레이어는 프로그래밍 엔진이 직접 할 수 없는 시스템 레벨 작업(파일 읽기, 네트워크 통신, 프로세스 관리 등)을 운영체제에 요청하고 결과를 돌려주는 중간 다리 역할을 한다.

핵심 가치는 **크로스 플랫폼 추상화**이다. Windows, macOS, Linux 각각 시스템 호출 방식이 다르지만, 플랫폼 레이어가 이 차이를 숨겨서 동일한 코드가 어떤 OS에서든 동작하게 만든다.

## 🎭 비유

해외여행의 통역사와 같다. 여행자(엔진)가 "물 주세요"라고 하면, 통역사(플랫폼 레이어)가 현지 언어(OS 시스템 콜)로 번역해서 전달한다. 나라(OS)가 바뀌어도 여행자는 같은 말만 하면 된다.

## ✨ 특징

- **OS 추상화**: Windows/macOS/Linux의 시스템 호출 차이를 하나의 인터페이스로 통일
- **비동기 I/O**: 파일 읽기, 네트워크 요청 등을 논블로킹 방식으로 처리 (이벤트 루프)
- **시스템 자원 접근**: 파일시스템, 소켓, 자식 프로세스, 시그널 등 OS 기능 제공
- **엔진 독립적**: 어떤 엔진과도 결합 가능 — libuv는 V8(Node.js)에도, QuickJS-ng(txiki.js)에도 사용됨

## 💡 예시

### libuv — 대표적 플랫폼 레이어

```
[JS 코드]  fetch("https://example.com")
    │
    ▼
[엔진]     "이건 네트워크 요청이네"
    │
    ▼
[libuv]    Windows → IOCP 사용
           macOS   → kqueue 사용
           Linux   → epoll 사용
    │
    ▼
[OS 커널]  실제 네트워크 통신 수행
```

같은 JS 코드가 모든 OS에서 동작하는 이유 = libuv가 OS별 차이를 흡수하기 때문.

### 런타임 = 엔진 + 플랫폼 레이어

| 런타임 | 엔진 | 플랫폼 레이어 |
|--------|------|-------------|
| Node.js | V8 | **libuv** |
| txiki.js | QuickJS-ng | **libuv** |
| Deno | V8 | **Tokio** (Rust) |
| Bun | JSC | **자체 구현** (Zig) |

## Relations

- part_of [[런타임 (Runtime)|런타임 (Runtime)]] (런타임의 시스템 접근 계층)
- complemented_by [[engine|엔진 (Engine)]] (엔진의 순수 연산 능력을 시스템 레벨로 확장)
- implements [[추상화 (Abstraction)]] (OS별 차이를 하나의 인터페이스로 추상화)
- enables [[javascript|JavaScript]] (JS에서 파일/네트워크 등 시스템 자원에 접근 가능하게 함)

---
**난이도**: 중급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 3월
