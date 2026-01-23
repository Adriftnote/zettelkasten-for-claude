# 01. concepts 폴더 분류 계획 (88개 파일)

**분석일**: 2026-01-22
**총 파일 수**: 88개
**기존 인덱스 등재**: 60개
**미등재 파일**: 28개

---

## 📊 카테고리별 파일 개수

| 카테고리 | 파일 수 | 적정 크기 | 비고 |
|---------|---------|----------|------|
| **web-fundamentals** | 14개 | ✅ 적정 (10~15) | 웹 기초, HTTP, Chrome Extension |
| **programming-basics** | 18개 | ✅ 적정 (15~20) | 코드, 컴파일러, 구조 |
| **encoding-systems** | 11개 | ✅ 적정 (10~15) | 문자 인코딩, 바이트, 비트 |
| **design-patterns** | 23개 | ⚠️ 크다 (20~25) | Context Engineering, MCP, Metabase |
| **architectures** | 9개 | ✅ 적정 (5~10) | 시스템 아키텍처 |
| **ai-ml-concepts** | 5개 | ✅ 적정 (5~10) | Attention, BM25, TF-IDF, 지식 그래프 |
| **memory-systems** | 2개 | ✅ 적정 (2~5) | RAM, VRAM, Cache |
| **general-cs** | 5개 | ✅ 적정 (3~7) | Endpoint, Payload, Inversion of Control |
| **index** | 1개 | - | 00.index.md |

**총합**: 88개

---

## 🗂️ 상세 분류

### 1. web-fundamentals (14개)

**웹 3요소 (3개)**:
- HTML (HyperText Markup Language).md
- CSS (Cascading Style Sheets).md
- JavaScript (JS).md

**DOM & 웹 구조 (2개)**:
- DOM (Document Object Model).md
- iframe (Inline Frame).md

**웹 보안 (2개)**:
- Same-Origin Policy (동일 출처 정책).md
- CORS (Cross-Origin Resource Sharing).md

**HTTP 프로토콜 (4개)**:
- HTTP Header.md
- HTTP Methods.md
- HTTP Status Codes.md
- Web Communication.md

**브라우저 확장 (3개)**:
- Chrome Extension.md
- Content Script.md
- Background Script (Service Worker).md

---

### 2. programming-basics (18개)

**코드의 종류 (5개)**:
- source-code.md
- script.md
- program.md
- binary.md
- machine-language.md

**실행 도구 (6개)**:
- compiler.md
- interpreter.md
- runtime.md
- assembler.md
- linker.md
- virtual-machine.md

**코드 구조 (6개)**:
- module.md
- package.md
- library.md
- framework.md
- sdk.md
- api.md

**설계 원칙 (1개)**:
- Inversion of Control (제어의 역전).md

---

### 3. encoding-systems (11개)

**문자 인코딩 (7개)**:
- Character Encoding.md
- ASCII.md
- Unicode.md
- UTF-8.md
- UTF-16.md
- UTF-32.md
- CP949.md

**바이트 레벨 (4개)**:
- Bit.md
- Byte.md
- BOM (Byte Order Mark).md
- Endianness.md

---

### 4. design-patterns (23개)

**Context Engineering 패턴 (9개)**:
- progressive-disclosure.md
- lost-in-middle.md
- context-poisoning.md
- context-distraction.md
- context-confusion.md
- context-clash.md
- four-bucket-optimization.md
- observation-masking.md
- anchored-iterative-summarization.md

**MCP/Tool 패턴 (5개)**:
- lazy-tool-loader.md
- dynamic-tool-fetching.md
- hook-based-mcp-auto-activation.md
- tool-discovery-pattern.md
- consolidation-principle.md

**최적화 전략 (3개)**:
- token-optimization-strategy.md
- kv-cache-optimization.md
- graceful-degradation.md

**Metabase 패턴 (5개)**:
- dropdown-filter-pattern.md
- model-configuration-pattern.md
- server-selection-pattern.md
- text-card-addition-pattern.md
- using-variables-in-card-titles.md

**Context 관리 (1개)**:
- Context Management Levels.md

---

### 5. architectures (9개)

**도구 관리 아키텍처 (4개)**:
- tool-hub-philosophy.md
- progressive-loader.md
- tool-hub-vs-tool-chainer.md
- mcp-cli-polymorphism.md

**지식 관리 아키텍처 (3개)**:
- knowledge-refinement-pipeline.md
- hybrid-search-architecture.md
- jarvis-lite-architecture.md

**에이전트 아키텍처 (2개)**:
- knowledge-agent-architecture.md
- agent-architecture-guide.md

---

### 6. ai-ml-concepts (5개)

**검색 알고리즘 (3개)**:
- BM25.md
- TF-IDF.md
- Contextual Retrieval.md

**AI 기초 (1개)**:
- Attention.md

**지식 표현 (1개)**:
- Knowledge Graph (지식 그래프).md
- Triple (트리플).md *(실제로는 2개)*
- Entity Resolution (엔티티 해결).md *(실제로는 3개)*

---

### 7. memory-systems (2개)

- RAM.md
- VRAM.md
- Cache.md *(실제로는 3개)*

---

### 8. general-cs (5개)

**네트워크/API (2개)**:
- Endpoint.md
- Payload.md

**설계 원칙 (1개)**:
- Inversion of Control (제어의 역전).md *(중복 - programming-basics로 이동)*

---

### 9. index (1개)

- 00.index.md

---

## 🔍 미등재 파일 분석 (28개)

기존 인덱스(00.index.md)에 없지만 발견된 파일들:

### HTTP 프로토콜 (4개)
- HTTP Header.md
- HTTP Methods.md
- HTTP Status Codes.md
- Web Communication.md

### 문자 인코딩 (7개)
- Character Encoding.md
- Unicode.md
- UTF-8.md
- UTF-16.md
- UTF-32.md
- CP949.md
- BOM (Byte Order Mark).md

### 바이트/비트 (2개)
- Bit.md
- Byte.md
- Endianness.md

### AI/ML 개념 (3개)
- Attention.md
- BM25.md
- TF-IDF.md
- Contextual Retrieval.md

### 지식 그래프 (3개)
- Knowledge Graph (지식 그래프).md
- Triple (트리플).md
- Entity Resolution (엔티티 해결).md

### 메모리 시스템 (3개)
- RAM.md
- VRAM.md
- Cache.md

### 일반 CS (2개)
- Endpoint.md
- Payload.md
- Inversion of Control (제어의 역전).md

### Context 관리 (1개)
- Context Management Levels.md

---

## 📈 통계 요약

| 지표 | 수치 |
|------|------|
| 총 파일 수 | 88개 |
| 인덱스 등재 | 60개 (68%) |
| 미등재 | 28개 (32%) |
| 신규 카테고리 제안 | 3개 (encoding-systems, ai-ml-concepts, memory-systems) |

---

## 💡 권장 사항

### 1. 인덱스 업데이트
00.index.md를 업데이트하여 누락된 28개 파일 추가:

```markdown
### 4️⃣ 문자 인코딩 & 바이트 시스템 (11개)
- Character Encoding, ASCII, Unicode, UTF-8/16/32, CP949
- Bit, Byte, BOM, Endianness

### 5️⃣ AI/ML 개념 (5개)
- Attention, BM25, TF-IDF, Contextual Retrieval
- Knowledge Graph, Triple, Entity Resolution

### 6️⃣ 메모리 시스템 (3개)
- RAM, VRAM, Cache

### 7️⃣ HTTP & 네트워크 (4개)
- HTTP Header, Methods, Status Codes, Web Communication
```

### 2. 카테고리 재구성
현재 "디자인 패턴" 카테고리가 23개로 너무 큽니다.
다음과 같이 분리 고려:

- **Context Engineering** (9개) - 별도 카테고리
- **MCP/Tool Patterns** (5개) - 별도 카테고리
- **Optimization** (3개) - 별도 카테고리
- **Metabase** (5개) - 별도 카테고리 또는 프로젝트별 폴더로 이동

### 3. 중복 제거
- `Inversion of Control`이 두 카테고리에 중복 가능성 확인 필요

---

## 🎯 최종 제안 카테고리 구조 (88개)

| # | 카테고리 | 파일 수 | 설명 |
|---|---------|---------|------|
| 0 | **index** | 1 | 인덱스 파일 |
| 1 | **web-fundamentals** | 14 | HTML/CSS/JS, HTTP, Chrome Extension |
| 2 | **programming-basics** | 18 | 코드, 컴파일러, 모듈, API |
| 3 | **encoding-systems** | 11 | 문자 인코딩, 바이트, 비트 |
| 4 | **context-engineering** | 9 | Progressive Disclosure, Context Poisoning 등 |
| 5 | **mcp-tool-patterns** | 5 | MCP 및 도구 관리 패턴 |
| 6 | **optimization-patterns** | 3 | Token, KV-Cache, Graceful Degradation |
| 7 | **metabase-patterns** | 5 | Metabase UI 패턴 |
| 8 | **architectures** | 9 | Tool Hub, Knowledge Agent, Jarvis Lite |
| 9 | **ai-ml-concepts** | 8 | Attention, 검색 알고리즘, 지식 그래프 |
| 10 | **memory-systems** | 3 | RAM, VRAM, Cache |
| 11 | **general-cs** | 2 | Endpoint, Payload |

**총합**: 88개

---

**생성일**: 2026-01-22
**도구**: Claude Code
**목적**: 01. concepts 폴더 재구성 계획
