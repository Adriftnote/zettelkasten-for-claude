---
title: Monty - Rust 기반 AI 코드 실행 샌드박스
type: doc-summary
permalink: sources/reference/monty-rust-ai-code-sandbox
tags:
- rust
- ai-agent
- sandbox
- pydantic
- python
- code-execution
date: 2026-02-09
---

# Monty - Rust 기반 AI 코드 실행 샌드박스

AI 에이전트가 생성한 Python 코드를 Docker 없이 안전하게 실행하는 Rust 기반 경량 인터프리터. Docker 대비 약 3000배 빠른 시작 시간.

## 📖 핵심 아이디어

Pydantic 팀이 만든 미니 Python 인터프리터. LLM이 생성한 코드를 실행할 때 Docker 컨테이너를 띄우는 대신, Rust로 작성된 샌드박스 인터프리터에서 마이크로초 단위로 실행한다. 파일시스템/네트워크 접근을 인터프리터 레벨에서 차단하여 보안을 확보하면서도 컨테이너 오버헤드를 제거한다.

PydanticAI의 "code-mode"를 위한 인프라로, 기존 tool-call 순차 호출 패턴을 코드 한 번 실행으로 대체하는 것이 목표.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **레포** | https://github.com/pydantic/monty |
| **Stars** | 2.8k |
| **License** | MIT |
| **Language** | Rust (Python/JS 바인딩 제공) |
| **제작** | Pydantic 팀 |
| **상태** | Experimental |
| **지원 stdlib** | sys, typing, asyncio, dataclasses, json만 |
| **미지원** | 서드파티 라이브러리, 클래스 정의(예정), match 구문(예정) |

## 🔧 작동 방식

```
기존 (Docker):
AI → 코드 생성 → Docker 컨테이너 띄움 (~200ms) → Python 실행 → 결과
                  ├ Linux 환경 초기화
                  ├ Python 런타임 로드
                  └ 격리된 파일시스템

Monty:
AI → 코드 생성 → Monty 인터프리터 호출 (마이크로초) → 결과
                  ├ Rust 레벨에서 파일/네트워크 차단
                  ├ 허용된 함수만 호출 가능
                  └ 리소스 제한 (메모리, 시간, 스택)
```

### 샌드박스 실행 비교

| 방식 | 시작 시간 | 보안 | 비고 |
|------|----------|------|------|
| Docker | ~195ms | 높음 | 컨테이너 오버헤드 |
| Pyodide (WASM) | ~2800ms | 중간 | 브라우저용 |
| 직접 실행 | 0.1ms | 없음 | 위험 |
| **Monty** | **마이크로초** | **높음** | Rust 인터프리터 |

### tool-call vs code-mode

```
tool-call (기존):
LLM: "검색해줘" → tool_call → 결과
LLM: "계산해줘" → tool_call → 결과
LLM: "저장해줘" → tool_call → 결과
(3번 왕복 = 느림 + 비용)

code-mode (Monty):
LLM이 코드 작성:
    result = search("키워드")
    calculated = result["value"] * 1.1
    save(calculated)
→ Monty에서 한 번에 실행 (왕복 1번)
```

### 주요 기능
- 실행 스냅샷 직렬화 → 프로세스 간 재개
- Rust, Python, JavaScript에서 호출 가능
- async/await 지원
- stdout/stderr 캡처

## 💡 실용적 평가

**장점:**
- Docker 오버헤드 제거 → AI 에이전트가 수백 번 코드 실행해야 할 때 결정적 차이
- CPython 의존 없음 → 비Python 환경에서도 사용 가능
- tool-call → code-mode 전환 시 핵심 인프라

**한계:**
- 아직 Experimental - 프로덕션 사용 불가
- stdlib 대부분 미지원 → 범용 Python 실행은 불가
- 클래스 정의 미지원 → OOP 코드 실행 불가

**적용 전망:**
- PydanticAI code-mode가 성숙하면 tool-call 패턴 자체가 변화할 수 있음
- 지금 당장 활용보다는 AI 에이전트 생태계 방향성 참고용

## 🔗 관련 개념

- [[PydanticAI]] - Monty를 code-mode 인프라로 사용할 AI 프레임워크
- [[Docker]] - 기존 코드 실행 샌드박스 방식
- [[WebAssembly]] - Pyodide 등 브라우저 기반 샌드박스 대안
- [[Shannon - AI 자율형 펜테스팅 도구]] - Claude Code 기반 AI 자동화 사례

---

**작성일**: 2026-02-09
**분류**: AI 에이전트 인프라