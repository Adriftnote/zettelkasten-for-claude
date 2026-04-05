---
created: 2026-03-10
type: maintenance
tags:
- vault-health
- broken-links
permalink: 00.-index/broken-wikilink-report
---

# Broken Wikilink Report (2026-03-10)

## Summary

| Metric | Value |
|--------|-------|
| Total wikilinks | 2770 |
| Broken links | 706 |
| Health | 74.5% |

### Breakdown

| Category | Count | Action |
|----------|-------|--------|
| Backslash bugs | 18 | Auto-fix (remove `\` before `\|`) |
| Template/example | 65 | Ignore |
| Task references | 4 | Ignore (external) |
| Missing notes | 619 | Review & fix |

## [A] Backslash Bugs (Auto-fixable)

Pipe alias (`|`) 앞에 `\`가 붙어서 링크가 깨진 경우. 자동 수정 가능.

- [x] `01. concepts/Attention.md` L92: `[[kv-cache-optimization|KV-Cache]]` -> `[[kv-cache-optimization|...]]`
- [x] `01. concepts/Chrome Extension.md` L75: `[[Content Script|Content Script]]` -> `[[Content Script|...]]`
- [x] `01. concepts/Chrome Extension.md` L76: `[[Background Script (Service Worker)|Background Script]]` -> `[[Background Script (Service Worker)|...]]`
- [x] `01. concepts/compiler.md` L52: `[[01. concepts/파서 (Parser)\|파서]]` -> `[[01. concepts/파서 (Parser)|...]]`
- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L73: `[[Background Script (Service Worker)|Background Script]]` -> `[[Background Script (Service Worker)|...]]`
- [x] `01. concepts/HTTP Header.md` L82: `[[CORS (Cross-Origin Resource Sharing)|CORS]]` -> `[[CORS (Cross-Origin Resource Sharing)|...]]`
- [x] `01. concepts/Web Communication.md` L241: `[[Endpoint|Endpoint]]` -> `[[Endpoint|...]]`
- [x] `01. concepts/Web Communication.md` L242: `[[Payload|Payload]]` -> `[[Payload|...]]`
- [x] `01. concepts/Web Communication.md` L243: `[[Encoding\|Encoding]]` -> `[[Encoding|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L90: `[[Background Script (Service Worker)|Background Script]]` -> `[[Background Script (Service Worker)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L93: `[[DOM (Document Object Model)|DOM]]` -> `[[DOM (Document Object Model)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L172: `[[DOM (Document Object Model)|DOM]]` -> `[[DOM (Document Object Model)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L172: `[[JavaScript (JS)|JavaScript]]` -> `[[JavaScript (JS)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L173: `[[CORS (Cross-Origin Resource Sharing)|CORS]]` -> `[[CORS (Cross-Origin Resource Sharing)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L173: `[[Same-Origin Policy (동일 출처 정책)|Same-Origin Policy]]` -> `[[Same-Origin Policy (동일 출처 정책)|...]]`
- [x] `03. sources/workcases/Chrome Extension 동작 원리 정리.md` L174: `[[Background Script (Service Worker)|Background Script]]` -> `[[Background Script (Service Worker)|...]]`
- [x] `04. notes/Three-Layer Memory Architecture.md` L947: `[[03. sources/reviews/basic-memory-db-schema\|Basic Memory DB 스키마]]` -> `[[03. sources/reviews/basic-memory-db-schema|...]]`
- [x] `04. notes/Three-Layer Memory Architecture.md` L948: `[[AgeMem-paper-review|AgeMem 논문 리뷰]]` -> `[[AgeMem-paper-review|...]]`

## [B] Missing Notes (Review Required)

실제 존재하지 않는 노트를 참조. 노트 생성 또는 링크 수정 필요.

### `[[data-structure]]` (14x)

- [ ] `01. concepts/array.md` L109
- [ ] `01. concepts/cache-friendliness.md` L112
- [ ] `01. concepts/computer-memory-hierarchy.md` L306
- [ ] `01. concepts/computer-memory-hierarchy.md` L319
- [ ] `01. concepts/hashmap.md` L227
- [ ] `01. concepts/linked-list.md` L203
- [ ] `01. concepts/queue.md` L187
- [ ] `01. concepts/ram-memory-access.md` L306
- [ ] `01. concepts/stack.md` L132
- [ ] `01. concepts/파서 (Parser).md` L209
- [ ] `01. concepts/파서 (Parser).md` L215
- [ ] `03. sources/guides/컴퓨터 구조 학습 여정 - 라이브러리부터 GPU까지.md` L68
- [ ] `03. sources/guides/컴퓨터 구조 학습 여정 - 라이브러리부터 GPU까지.md` L78
- [ ] `03. sources/reference/GitNexus - AST 기반 코드 지식 그래프 엔진.md` L123

### `[[context-engineering]]` (11x)

- [ ] `01. concepts/RPG (Repository Planning Graph).md` L89
- [ ] `02. hubs/00.index.md` L39
- [ ] `02. hubs/00.index.md` L96
- [ ] `03. sources/reference/Basic Memory MCP 완전 가이드.md` L114
- [ ] `03. sources/reference/BrainDump Butler 코드 분석 (Code Analysis).md` L133
- [ ] `03. sources/reference/Entire - AI 시대의 차세대 개발자 플랫폼.md` L134
- [ ] `03. sources/reference/Gemini File Search API 공식 문서.md` L222
- [ ] `03. sources/reference/Lessons from Building Claude Code - Prompt Caching Is Everything.md` L86
- [ ] `03. sources/reference/REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase.md` L78
- [ ] `03. sources/reference/REF-090 SkillNet - Create, Evaluate, and Connect AI Skills.md` L94
- [ ] `03. sources/reference/Taste for Makers - Paul Graham.md` L73

### `[[run-posts]]` (10x)

- [ ] `05. code/functions/call-graph-ql.md` L35
- [ ] `05. code/functions/collect-meta.md` L42
- [ ] `05. code/functions/collect-naver-blog.md` L37
- [ ] `05. code/functions/collect-naver-tv.md` L36
- [ ] `05. code/functions/collect-tik-tok.md` L38
- [ ] `05. code/functions/collect-you-tube.md` L39
- [ ] `05. code/functions/fetch-edges.md` L36
- [ ] `05. code/functions/get-captured-at.md` L32
- [ ] `05. code/functions/run-run-posts.md` L36
- [ ] `05. code/functions/send-to-webhook.md` L34

### `[[Claude Code]]` (8x)

- [ ] `01. concepts/AI 에이전트 지식 전달 패턴.md` L68
- [ ] `01. concepts/MCP (Model Context Protocol).md` L67
- [ ] `01. concepts/Native Host.md` L56
- [ ] `01. concepts/Native Host와 MCP.md` L58
- [ ] `03. sources/reference/Anthropic Engineering Blog 2025-2026 주요 글 정리.md` L115
- [ ] `03. sources/reference/Entire - AI 시대의 차세대 개발자 플랫폼.md` L138
- [ ] `03. sources/reference/Gemini CLI 공식 문서.md` L187
- [ ] `03. sources/reference/Lessons from Building Claude Code - Prompt Caching Is Everything.md` L87

### `[[run]]` (8x)

- [ ] `05. code/functions/collect-meta.md` L43
- [ ] `05. code/functions/collect-naver-blog.md` L38
- [ ] `05. code/functions/collect-naver-tv.md` L37
- [ ] `05. code/functions/collect-tik-tok.md` L39
- [ ] `05. code/functions/collect-you-tube.md` L40
- [ ] `05. code/functions/get-captured-at.md` L33
- [ ] `05. code/functions/run-posts-collector.md` L86
- [ ] `05. code/functions/send-to-webhook.md` L35

### `[[programming-languages]]` (6x)

- [ ] `01. concepts/java.md` L124
- [ ] `01. concepts/javascript.md` L109
- [ ] `01. concepts/rust.md` L204
- [ ] `01. concepts/typescript.md` L120
- [ ] `03. sources/guides/Java vs JavaScript vs TypeScript - 완전 다른 언어들.md` L276
- [ ] `03. sources/guides/Rust 완전 정복 - 기술적 한계부터 풀스택까지.md` L390

### `[[SQLAlchemy]]` (6x)

- [ ] `01. concepts/ORM (Object-Relational Mapping).md` L55
- [ ] `05. code/modules/db.md` L43
- [ ] `05. code/modules/knowledge.md` L45
- [ ] `05. code/modules/project-model.md` L37
- [ ] `05. code/modules/search-ddl.md` L39
- [ ] `05. code/projects/basic-memory.md` L116

### `[[rust-language]]` (6x)

- [ ] `01. concepts/rust-code-organization.md` L311
- [ ] `01. concepts/rust-concurrency.md` L221
- [ ] `01. concepts/rust-unsafe.md` L216
- [ ] `01. concepts/rust.md` L203
- [ ] `03. sources/guides/Rust 완전 정복 - 기술적 한계부터 풀스택까지.md` L388
- [ ] `03. sources/reference/Zellij - Terminal Multiplexer.md` L93

### `[[programming-basics]]` (6x)

- [ ] `01. concepts/transpilation.md` L101
- [ ] `02. hubs/00.index.md` L30
- [ ] `02. hubs/00.index.md` L91
- [ ] `03. sources/guides/컴퓨팅 역사의 선구자들.md` L335
- [ ] `03. sources/guides/코드 실행 흐름 - 고급 언어에서 기계어까지.md` L450
- [ ] `03. sources/guides/프로그래밍 기초 용어 가이드.md` L537

### `[[memory-systems]]` (6x)

- [ ] `02. hubs/00.index.md` L32
- [ ] `03. sources/reference/BrainDump Butler 코드 분석 (Code Analysis).md` L132
- [ ] `03. sources/reference/Entire - AI 시대의 차세대 개발자 플랫폼.md` L135
- [ ] `03. sources/reference/Gemini File Search API 공식 문서.md` L223
- [ ] `03. sources/reference/Lessons from Building Claude Code - Prompt Caching Is Everything.md` L88
- [ ] `03. sources/reference/REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase.md` L81

### `[[RAG]]` (5x)

- [ ] `01. concepts/AI 에이전트 지식 전달 패턴.md` L67
- [ ] `01. concepts/Task 분해와 AI Attention의 관계.md` L61
- [ ] `03. sources/reference/AI 컨텍스트 효율화 전략 비교 - ZigZag, SWE-Pruner, PageIndex.md` L70
- [ ] `03. sources/reference/Dep-Search- Dependency-Aware Reasoning with Persistent Memory.md` L122
- [ ] `03. sources/reference/SWE-Pruner 논문 리뷰.md` L92

### `[[computing-history]]` (5x)

- [ ] `01. concepts/Boolean Algebra (불 대수).md` L205
- [ ] `01. concepts/Turing Machine (튜링 머신).md` L140
- [ ] `01. concepts/Turing Test (튜링 테스트).md` L190
- [ ] `01. concepts/Von Neumann Architecture (폰 노이만 구조).md` L166
- [ ] `03. sources/guides/컴퓨팅 역사의 선구자들.md` L329

### `[[RAG (Retrieval-Augmented Generation)]]` (5x)

- [ ] `01. concepts/Chain of Spreadsheet (CoS).md` L117
- [ ] `01. concepts/스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy).md` L57
- [ ] `03. sources/reference/A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory).md` L171
- [ ] `03. sources/reference/Jina Reader API.md` L93
- [ ] `03. sources/reference/SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding).md` L127

### `[[runtime]]` (5x)

- [ ] `01. concepts/engine.md` L60
- [ ] `01. concepts/footprint.md` L61
- [ ] `01. concepts/platform-layer.md` L67
- [ ] `01. concepts/wintertc.md` L64
- [ ] `03. sources/reference/REF-082 txiki.js - Tiny JavaScript Runtime (QuickJS-ng + libuv).md` L94

### `[[ai-ml-concepts]]` (5x)

- [ ] `01. concepts/ReAct Paradigm.md` L174
- [ ] `01. concepts/Turing Test (튜링 테스트).md` L191
- [ ] `02. hubs/00.index.md` L42
- [ ] `02. hubs/00.index.md` L102
- [ ] `03. sources/guides/컴퓨팅 역사의 선구자들.md` L336

### `[[Code Understanding]]` (5x)

- [ ] `01. concepts/RPG (Repository Planning Graph).md` L92
- [ ] `01. concepts/Semantic Lifting (의미 상승).md` L69
- [ ] `01. concepts/SWE-bench.md` L71
- [ ] `03. sources/reference/RPG 논문 시리즈 리뷰.md` L186
- [ ] `03. sources/reference/RPG-Encoder 논문 리뷰.md` L87

### `[[rust-memory-management]]` (5x)

- [ ] `01. concepts/rust-book-overview.md` L43
- [ ] `01. concepts/rust-collections.md` L189
- [ ] `01. concepts/rust-projects.md` L140
- [ ] `01. concepts/rust-type-system.md` L423
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L234

### `[[target]]` (5x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L22
- [ ] `03. sources/workcases/Basic Memory Observation Context 미반환 이슈.md` L76
- [ ] `05. code/modules/entity-parser.md` L22
- [ ] `05. code/modules/markdown-processor.md` L32
- [ ] `05. code/modules/markdown-schemas.md` L23

### `[[Task 분해 통합 프레임워크]]` (5x)

- [ ] `03. sources/reference/Granularity in Project Management (Meegle).md` L50
- [ ] `03. sources/reference/Granularity, Abstraction & Coherence (Cynefin).md` L55
- [ ] `03. sources/reference/Task 분해 방법론 리서치.md` L71
- [ ] `03. sources/reference/Task 분해 프레임워크 - 경영학 관점.md` L62
- [ ] `03. sources/reference/Task-Level Granularity (Emergent Mind).md` L58

### `[[iframe]]` (4x)

- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L81
- [ ] `01. concepts/CSS (Cascading Style Sheets).md` L85
- [ ] `01. concepts/HTML (HyperText Markup Language).md` L69
- [ ] `01. concepts/JavaScript (JS).md` L78

### `[[metabase-dashboard-framework]]` (4x)

- [ ] `01. concepts/dropdown-filter-pattern.md` L190
- [ ] `01. concepts/model-configuration-pattern.md` L224
- [ ] `01. concepts/server-selection-pattern.md` L217
- [ ] `01. concepts/text-card-addition-pattern.md` L270

### `[[API (Application Programming Interface)]]` (4x)

- [ ] `01. concepts/Endpoint.md` L180
- [ ] `01. concepts/HTTP Methods.md` L884
- [ ] `01. concepts/HTTP Status Codes.md` L650
- [ ] `01. concepts/Payload.md` L634

### `[[Code Generation]]` (4x)

- [ ] `01. concepts/RPG (Repository Planning Graph).md` L91
- [ ] `01. concepts/rust-macros.md` L268
- [ ] `01. concepts/Semantic Lifting (의미 상승).md` L70
- [ ] `03. sources/reference/RPG 논문 시리즈 리뷰.md` L185

### `[[rust-functional-programming]]` (4x)

- [ ] `01. concepts/rust-book-overview.md` L47
- [ ] `01. concepts/rust-collections.md` L190
- [ ] `01. concepts/rust-type-system.md` L426
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L229

### `[[프로그래밍 패러다임]]` (4x)

- [ ] `01. concepts/객체지향 프로그래밍 (OOP).md` L111
- [ ] `01. concepts/명령형 프로그래밍 (Imperative Programming).md` L70
- [ ] `01. concepts/선언형 프로그래밍 (Declarative Programming).md` L71
- [ ] `01. concepts/함수형 프로그래밍 (Functional Programming).md` L87

### `[[mcp-tool-patterns]]` (4x)

- [ ] `02. hubs/00.index.md` L40
- [ ] `02. hubs/00.index.md` L97
- [ ] `03. sources/reference/BrainDump Butler 코드 분석 (Code Analysis).md` L135
- [ ] `03. sources/reference/GitNexus - AST 기반 코드 지식 그래프 엔진.md` L125

### `[[architectures]]` (4x)

- [ ] `02. hubs/00.index.md` L48
- [ ] `02. hubs/00.index.md` L101
- [ ] `03. sources/reference/GitNexus - AST 기반 코드 지식 그래프 엔진.md` L124
- [ ] `03. sources/reference/Taste for Makers - Paul Graham.md` L72

### `[[Task 분해 Hub]]` (4x)

- [ ] `03. sources/reference/alive-analysis - AI 데이터 분석 워크플로우 스킬.md` L95
- [ ] `03. sources/reference/BrainDump Butler 코드 분석 (Code Analysis).md` L134
- [ ] `04. notes/Orchestrator의 의도 보존 분해 역할.md` L51
- [ ] `04. notes/Orchestrator의 의도 보존 분해 역할.md` L54

### `[[강화학습 (Reinforcement Learning)]]` (4x)

- [ ] `03. sources/reference/MemSkill - 자기진화 메모리 스킬.md` L154
- [ ] `03. sources/reference/REF-064 Search-R1++ Deep Research Agent RL Training.md` L86
- [ ] `03. sources/reference/REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization.md` L91
- [ ] `03. sources/reference/REF-089 MOOSE-Star - Tractable Training for Scientific Discovery.md` L82

### `[[fastembed]]` (4x)

- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L156
- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L309
- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L360
- [ ] `05. code/modules/vecsearch.md` L140

### `[[sqlite-vec]]` (4x)

- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L157
- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L309
- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L360
- [ ] `05. code/modules/vecsearch.md` L139

### `[[token-optimization-strategy]]` (3x)

- [ ] `01. concepts/Chain of Thought (CoT).md` L64
- [ ] `01. concepts/Deep-Thinking Ratio (DTR).md` L85
- [ ] `03. sources/reference/REF-075 Think Deep Not Just Long - Measuring LLM Reasoning Effort via Deep-Thinking Tokens.md` L75

### `[[html]]` (3x)

- [ ] `01. concepts/CSS (Cascading Style Sheets).md` L83
- [ ] `01. concepts/iframe (Inline Frame).md` L81
- [ ] `01. concepts/JavaScript (JS).md` L76

### `[[Task Decomposition]]` (3x)

- [ ] `01. concepts/DAG (Directed Acyclic Graph).md` L56
- [ ] `01. concepts/Sequential Decomposition (순차 분해).md` L52
- [ ] `04. notes/QDMR 기반 Task 분해.md` L43

### `[[SQL (Structured Query Language)]]` (3x)

- [ ] `01. concepts/DCL (Data Control Language).md` L44
- [ ] `01. concepts/DDL (Data Definition Language).md` L43
- [ ] `01. concepts/DML (Data Manipulation Language).md` L46

### `[[css]]` (3x)

- [ ] `01. concepts/HTML (HyperText Markup Language).md` L67
- [ ] `01. concepts/iframe (Inline Frame).md` L82
- [ ] `01. concepts/JavaScript (JS).md` L77

### `[[AI 안전성]]` (3x)

- [ ] `01. concepts/Mechanistic Interpretability.md` L46
- [ ] `01. concepts/Sycophancy (아첨).md` L48
- [ ] `02. hubs/LLM 해석 가능성 (LLM Interpretability).md` L48

### `[[추상화 패턴 (Abstraction Pattern)]]` (3x)

- [ ] `01. concepts/ORM (Object-Relational Mapping).md` L54
- [ ] `02. hubs/추상화와 설계 원칙 (Abstraction Principles).md` L30
- [ ] `04. notes/추상화는 3단 구조로 반복된다.md` L58

### `[[rust-error-handling]]` (3x)

- [ ] `01. concepts/rust-book-overview.md` L45
- [ ] `01. concepts/rust-projects.md` L142
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L231

### `[[rust-concurrency]]` (3x)

- [ ] `01. concepts/rust-book-overview.md` L46
- [ ] `01. concepts/rust-projects.md` L141
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L233

### `[[The Rust Programming Language]]` (3x)

- [ ] `01. concepts/rust-collections.md` L194
- [ ] `01. concepts/rust-macros.md` L265
- [ ] `01. concepts/rust-projects.md` L139

### `[[토큰 압축 (Token Compression)]]` (3x)

- [ ] `01. concepts/스프레드시트 AI 처리 전략 (Spreadsheet AI Processing Strategy).md` L59
- [ ] `01. concepts/역인덱스 변환 (Inverted-Index Translation).md` L101
- [ ] `03. sources/reference/SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding).md` L129

### `[[web-fundamentals]]` (3x)

- [ ] `02. hubs/00.index.md` L29
- [ ] `02. hubs/00.index.md` L92
- [ ] `03. sources/reference/Zellij - Terminal Multiplexer.md` L92

### `[[encoding-systems]]` (3x)

- [ ] `02. hubs/00.index.md` L31
- [ ] `02. hubs/00.index.md` L93
- [ ] `03. sources/guides/Character Encoding - BOM, UTF, and History.md` L412

### `[[Pure Function과 Side Effect]]` (3x)

- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L240
- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L71
- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L72

### `[[AI Agent (인공지능 에이전트)]]` (3x)

- [ ] `03. sources/reference/Anthropic Engineering Blog 2025-2026 주요 글 정리.md` L114
- [ ] `03. sources/reference/REF-070 PyTorch Korea AI-ML Weekly 2026-02-23~03-01.md` L68
- [ ] `03. sources/reference/REF-085 PyTorch Korea AI-ML Weekly 2026-03-02~08.md` L76

### `[[링크]]` (3x)

- [ ] `03. sources/reference/Basic Memory MCP 완전 가이드.md` L64
- [ ] `03. sources/reference/Basic Memory MCP 완전 가이드.md` L65
- [x] `04. notes/Three-Layer Memory Architecture.md` L535

### `[[03. sources/reviews/basic-memory-db-schema]]` (3x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L500
- [x] `04. notes/Three-Layer Memory Architecture.md` L863
- [x] `04. notes/Three-Layer Memory Architecture.md` L929

### `[[n8n-webhook-workflow]]` (3x)

- [ ] `05. code/functions/run-channel-collector.md` L42
- [ ] `05. code/functions/run-posts-collector.md` L95
- [ ] `05. code/modules/playwright-sns-collector.md` L79

### `[[넥서스 (Nexus)]]` (2x)

- [ ] `01. concepts/AI Agency (AI 에이전시).md` L178
- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L100

### `[[abstraction]]` (2x)

- [ ] `01. concepts/api.md` L49
- [ ] `01. concepts/api.md` L65

### `[[트랜잭션]]` (2x)

- [ ] `01. concepts/Atomic File Modification.md` L206
- [ ] `01. concepts/Race Condition.md` L193

### `[[Content Script]]` (2x)

- [ ] `01. concepts/Background Script (Service Worker).md` L90
- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L79

### `[[cors]]` (2x)

- [ ] `01. concepts/Background Script (Service Worker).md` L91
- [x] `01. concepts/HTTP Header.md` L147

### `[[PowerShell]]` (2x)

- [ ] `01. concepts/BOM (Byte Order Mark).md` L54
- [ ] `01. concepts/BOM (Byte Order Mark).md` L146

### `[[Type System과 Category Theory]]` (2x)

- [ ] `01. concepts/Category Theory (카테고리 이론).md` L171
- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L70

### `[[GoF 디자인 패턴]]` (2x)

- [ ] `01. concepts/Command Pattern.md` L197
- [ ] `01. concepts/Strategy Pattern.md` L209

### `[[Zettelkasten]]` (2x)

- [ ] `01. concepts/Concept Note.md` L47
- [ ] `03. sources/reference/A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory).md` L170

### `[[basic-memory]]` (2x)

- [ ] `01. concepts/Concept Note.md` L49
- [ ] `03. sources/reference/A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory).md` L173

### `[[Path Graph (경로 그래프)]]` (2x)

- [ ] `01. concepts/DAG (Directed Acyclic Graph).md` L57
- [ ] `01. concepts/Sequential Decomposition (순차 분해).md` L54

### `[[dependency-injection]]` (2x)

- [ ] `01. concepts/Dependency Inversion Principle (DIP).md` L163
- [ ] `01. concepts/Inversion of Control (제어의 역전).md` L158

### `[[CRUD]]` (2x)

- [ ] `01. concepts/DML (Data Manipulation Language).md` L49
- [ ] `01. concepts/Domain Driven Design (DDD).md` L152

### `[[CPU]]` (2x)

- [ ] `01. concepts/gpu.md` L239
- [ ] `03. sources/guides/코드 실행 흐름 - 고급 언어에서 기계어까지.md` L449

### `[[Lazy Loading]]` (2x)

- [ ] `01. concepts/lazy-tool-loader.md` L14
- [ ] `01. concepts/lazy-tool-loader.md` L109

### `[[Representation Engineering]]` (2x)

- [ ] `01. concepts/Linear Representation Hypothesis.md` L79
- [ ] `01. concepts/Steering Vector.md` L46

### `[[Monoid와 비가환 구조]]` (2x)

- [ ] `01. concepts/Middleware (미들웨어).md` L162
- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L112

### `[[code-granularity]]` (2x)

- [ ] `01. concepts/RPG (Repository Planning Graph).md` L87
- [ ] `01. concepts/의존성 (Dependency).md` L70

### `[[Hybrid Search]]` (2x)

- [ ] `01. concepts/RPG (Repository Planning Graph).md` L90
- [ ] `02. hubs/AI-ML 개념 (AI-ML Concepts).md` L36

### `[[rust-type-system]]` (2x)

- [ ] `01. concepts/rust-book-overview.md` L44
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L230

### `[[rust-collections]]` (2x)

- [ ] `01. concepts/rust-book-overview.md` L48
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L232

### `[[rust-oop]]` (2x)

- [ ] `01. concepts/rust-book-overview.md` L54
- [ ] `01. concepts/rust-type-system.md` L424

### `[[rust-learning-paths]]` (2x)

- [ ] `01. concepts/rust-book-overview.md` L59
- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L235

### `[[rust-projects]]` (2x)

- [ ] `01. concepts/rust-error-handling.md` L472
- [ ] `01. concepts/rust-functional-programming.md` L247

### `[[Rust Programming Language Overview]]` (2x)

- [ ] `01. concepts/rust-functional-programming.md` L242
- [ ] `01. concepts/rust-oop.md` L317

### `[[optimization-patterns]]` (2x)

- [ ] `02. hubs/00.index.md` L41
- [ ] `02. hubs/00.index.md` L98

### `[[metabase-patterns]]` (2x)

- [ ] `02. hubs/00.index.md` L49
- [ ] `02. hubs/00.index.md` L103

### `[[mcp-cli-polymorphism]]` (2x)

- [ ] `02. hubs/추상화와 설계 원칙 (Abstraction Principles).md` L32
- [ ] `03. sources/reference/REF-069 MCP is Dead Long Live the CLI - MCP vs CLI 비교.md` L67

### `[[Git]]` (2x)

- [ ] `02. hubs/컴퓨팅 역사 (Computing History).md` L39
- [ ] `03. sources/reference/Entire - AI 시대의 차세대 개발자 플랫폼.md` L136

### `[[대상]]` (2x)

- [ ] `03. sources/reference/Basic Memory MCP 완전 가이드.md` L29
- [ ] `03. sources/workcases/RPG 구조 설계.md` L181

### `[[basic-memory]]` (2x)

- [ ] `03. sources/reference/Basic Memory MCP 완전 가이드.md` L113
- [ ] `04. notes/Relation Table 전수조사 - KG 품질 분석.md` L228

### `[[Agent Teams]]` (2x)

- [ ] `03. sources/reference/Claude C Compiler.md` L86
- [ ] `03. sources/reference/Claude Code - Anthropic 공식 CLI 에이전트.md` L84

### `[[Linear Representation Hypothesis]]` (2x)

- [ ] `03. sources/reference/Emergence of Linear Truth Encodings in LMs.md` L112
- [ ] `03. sources/reference/Linear Representation Hypothesis - LLM 기하학.md` L90

### `[[Hallucination]]` (2x)

- [ ] `03. sources/reference/Emergence of Linear Truth Encodings in LMs.md` L115
- [ ] `04. notes/맥락 오염 - 사람과 AI의 공통 취약점.md` L45

### `[[MCP]]` (2x)

- [ ] `03. sources/reference/Gemini CLI 공식 문서.md` L186
- [ ] `03. sources/reference/GitHub Copilot Spaces 공식 문서.md` L152

### `[[에이전트 메모리 (Agent Memory)]]` (2x)

- [ ] `03. sources/reference/MemSkill - 자기진화 메모리 스킬.md` L153
- [ ] `03. sources/reference/REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization.md` L92

### `[[n8n]]` (2x)

- [ ] `03. sources/reference/Obsidian CLI.md` L161
- [ ] `03. sources/reference/Paramiko - Python SSH 라이브러리.md` L86

### `[[포인터 기반 메모리 설계 (Pointer-Based Memory Design)]]` (2x)

- [ ] `03. sources/reference/REF-072 Memory System Blind Test - Multi-Persona Verification.md` L85
- [ ] `03. sources/reference/REF-073 Agent Memory Retrieve Gap Analysis - ALMA × Blind Test × Usage Report.md` L124

### `[[Knowledge Graph]]` (2x)

- [ ] `03. sources/reference/RPG 논문 시리즈 리뷰.md` L182
- [ ] `03. sources/reference/RPG-Encoder 논문 리뷰.md` L86

### `[[AST]]` (2x)

- [ ] `03. sources/reference/RPG 논문 시리즈 리뷰.md` L183
- [ ] `03. sources/reference/RPG-Encoder 논문 리뷰.md` L89

### `[[AND condition]]` (2x)

- [ ] `03. sources/workcases/Metabase Dashboard Looker Studio Migration Plan.md` L40
- [ ] `03. sources/workcases/Metabase Dashboard Looker Studio Migration Plan.md` L60

### `[[노드]]` (2x)

- [ ] `03. sources/workcases/RPG 구조 설계.md` L98
- [ ] `03. sources/workcases/RPG 구조 설계.md` L100

### `[[MCP CLI Dynamic Tool Fetching]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L671
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L709

### `[[MCP CLI LazyToolLoader Pattern]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L672
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L707

### `[[MCP-CLI Command Conventions]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L673
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L710

### `[[MCP CLI Polymorphism Pattern Clean Architecture]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L674
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L708

### `[[Tool-Hub & Tool-Chainer Architecture Analysis]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L675
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L711

### `[[Tool-Hub Integration Plan Chainer Absorption]]` (2x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L676
- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L712

### `[[workcase-skill-integration]]` (2x)

- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L310
- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L362

### `[[Context Engineering]]` (2x)

- [ ] `04. notes/context-positioning-strategy.md` L37
- [ ] `04. notes/context-positioning-strategy.md` L40

### `[[lost-in-middle]]` (2x)

- [ ] `04. notes/context-positioning-strategy.md` L38
- [ ] `04. notes/context-positioning-strategy.md` L39

### `[[Engram]]` (2x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L677
- [x] `04. notes/Three-Layer Memory Architecture.md` L678

### `[[기억 재구성]]` (2x)

- [ ] `04. notes/시스템1-2와 기억 재구성.md` L46
- [ ] `04. notes/지식 저장의 원리 - 카너먼 Loftus KGGen.md` L55

### `[[n8n webhook]]` (2x)

- [ ] `05. code/functions/send-to-webhook.md` L36
- [ ] `05. code/modules/collect-posts.md` L66

### `[[flow-task-creator]]` (2x)

- [ ] `05. code/modules/build-exe.md` L54
- [ ] `05. code/modules/create-hint-files.md` L62

### `[[markdown-it]]` (2x)

- [ ] `05. code/modules/entity-parser.md` L43
- [ ] `05. code/projects/basic-memory.md` L117

### `[[FastMCP]]` (2x)

- [ ] `05. code/modules/mcp-server.md` L49
- [ ] `05. code/projects/basic-memory.md` L115

### `[[watchfiles]]` (2x)

- [ ] `05. code/modules/watch-service.md` L40
- [ ] `05. code/projects/basic-memory.md` L118

### `[[Algorithmic Bias]]` (1x)

- [ ] `01. concepts/AI Agency (AI 에이전시).md` L181

### `[[Philosophy of Mind]]` (1x)

- [ ] `01. concepts/AI Agency (AI 에이전시).md` L182

### `[[Facebook Myanmar Genocide]]` (1x)

- [ ] `01. concepts/AI Agency (AI 에이전시).md` L183

### `[[Model Knowledge Cutoff]]` (1x)

- [ ] `01. concepts/AI 에이전트 지식 전달 패턴.md` L66

### `[[SKILL]]` (1x)

- [ ] `01. concepts/AI 에이전트 지식 전달 패턴.md` L69

### `[[dependency]]` (1x)

- [ ] `01. concepts/AST (Abstract Syntax Tree).md` L73

### `[[Chrome Extension]]` (1x)

- [ ] `01. concepts/Background Script (Service Worker).md` L89

### `[[rust-functional-programming]]` (1x)

- [ ] `01. concepts/Category Theory (카테고리 이론).md` L169

### `[[Type Theory]]` (1x)

- [ ] `01. concepts/Category Theory (카테고리 이론).md` L170

### `[[Cyclomatic Complexity]]` (1x)

- [ ] `01. concepts/Cognitive Load (인지 부하).md` L165

### `[[Memento Pattern]]` (1x)

- [ ] `01. concepts/Command Pattern.md` L198

### `[[performance-optimization]]` (1x)

- [ ] `01. concepts/computer-memory-hierarchy.md` L320

### `[[백엔드]]` (1x)

- [ ] `01. concepts/Concept Note.md` L42

### `[[Atomic Note]]` (1x)

- [ ] `01. concepts/Concept Note.md` L48

### `[[Multi-Agent Patterns]]` (1x)

- [ ] `01. concepts/Context Isolation.md` L83

### `[[관련노트]]` (1x)

- [ ] `01. concepts/Context Management Levels.md` L109

### `[[kv-cache-optimization]]` (1x)

- [ ] `01. concepts/Context Management Levels.md` L133

### `[[Context Quality Management Guide]]` (1x)

- [ ] `01. concepts/Context Management Levels.md` L134

### `[[HTTP Header]]` (1x)

- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L77

### `[[same-origin-policy]]` (1x)

- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L78

### `[[background-script]]` (1x)

- [x] `01. concepts/CORS (Cross-Origin Resource Sharing).md` L80

### `[[PowerShell 한글 인코딩 문제]]` (1x)

- [ ] `01. concepts/CP949.md` L129

### `[[데이터베이스 보안]]` (1x)

- [ ] `01. concepts/DCL (Data Control Language).md` L47

### `[[ADHD]]` (1x)

- [ ] `01. concepts/Default Mode Network.md` L151

### `[[Rumination (반추)]]` (1x)

- [ ] `01. concepts/Default Mode Network.md` L152

### `[[Clean Architecture]]` (1x)

- [ ] `01. concepts/Domain Driven Design (DDD).md` L151

### `[[embedded-systems]]` (1x)

- [ ] `01. concepts/footprint.md` L63

### `[[deep-learning]]` (1x)

- [ ] `01. concepts/gpu.md` L240

### `[[hash-function]]` (1x)

- [ ] `01. concepts/hashmap.md` L229

### `[[collision-resolution]]` (1x)

- [ ] `01. concepts/hashmap.md` L230

### `[[load-factor]]` (1x)

- [ ] `01. concepts/hashmap.md` L231

### `[[http]]` (1x)

- [x] `01. concepts/HTTP Header.md` L148

### `[[rest-api]]` (1x)

- [x] `01. concepts/HTTP Header.md` L149

### `[[cookie]]` (1x)

- [x] `01. concepts/HTTP Header.md` L150

### `[[LLM]]` (1x)

- [ ] `01. concepts/In-Context Learning.md` L44

### `[[Few-shot Learning]]` (1x)

- [ ] `01. concepts/In-Context Learning.md` L45

### `[[Prompt Engineering]]` (1x)

- [ ] `01. concepts/In-Context Learning.md` L46

### `[[design-pattern]]` (1x)

- [ ] `01. concepts/Inversion of Control (제어의 역전).md` L159

### `[[Anthropic]]` (1x)

- [ ] `01. concepts/MCP (Model Context Protocol).md` L66

### `[[Context Isolation]]` (1x)

- [ ] `01. concepts/Multi-Agent Patterns.md` L102

### `[[Code Readability]]` (1x)

- [ ] `01. concepts/Multiple Demand Network.md` L110

### `[[Language Network]]` (1x)

- [ ] `01. concepts/Multiple Demand Network.md` L111

### `[[Information Theory]]` (1x)

- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L101

### `[[Epistemology]]` (1x)

- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L102

### `[[Information Literacy]]` (1x)

- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L103

### `[[Filter Bubble]]` (1x)

- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L104

### `[[Confirmation Bias]]` (1x)

- [ ] `01. concepts/Naive View of Information (순진한 정보관).md` L105

### `[[Chrome 브라우저 자동화]]` (1x)

- [ ] `01. concepts/Native Host와 MCP.md` L59

### `[[일반 MCP 도구]]` (1x)

- [ ] `01. concepts/Native Host와 MCP.md` L61

### `[[Transformer]]` (1x)

- [ ] `01. concepts/Neural Network Layer Depth.md` L88

### `[[정규표현식 (Regular Expression)]]` (1x)

- [ ] `01. concepts/NFS 타입 인식 (Number Format String Recognition).md` L106

### `[[병렬 실행 최적화]]` (1x)

- [ ] `01. concepts/QDMR (Question Decomposition Meaning Representation).md` L57

### `[[Break It Down - A Question Understanding Benchmark]]` (1x)

- [ ] `01. concepts/QDMR (Question Decomposition Meaning Representation).md` L58

### `[[Chain-of-Thought]]` (1x)

- [ ] `01. concepts/ReAct Paradigm.md` L171

### `[[rust-control-flow]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L49

### `[[rust-code-organization]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L50

### `[[rust-testing]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L51

### `[[rust-macros]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L52

### `[[rust-unsafe]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L53

### `[[rust-projects]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L55

### `[[Ownership System]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L83

### `[[Borrowing & References]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L84

### `[[Lifetimes]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L85

### `[[Smart Pointers]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L86

### `[[Concurrency]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L87

### `[[Async Programming]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L88

### `[[Systems Programming]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L89

### `[[Memory Safety]]` (1x)

- [ ] `01. concepts/rust-book-overview.md` L90

### `[[rust-module-system]]` (1x)

- [ ] `01. concepts/rust-code-organization.md` L312

### `[[cargo-ecosystem]]` (1x)

- [ ] `01. concepts/rust-code-organization.md` L313

### `[[rust-visibility]]` (1x)

- [ ] `01. concepts/rust-code-organization.md` L314

### `[[rust-ownership]]` (1x)

- [ ] `01. concepts/rust-concurrency.md` L223

### `[[fearless-concurrency]]` (1x)

- [ ] `01. concepts/rust-concurrency.md` L224

### `[[Rust Language Hub]]` (1x)

- [ ] `01. concepts/rust-error-handling.md` L469

### `[[rust-testing]]` (1x)

- [ ] `01. concepts/rust-error-handling.md` L470

### `[[Option]]` (1x)

- [ ] `01. concepts/rust-error-handling.md` L471

### `[[Advanced Error Handling with thiserror]]` (1x)

- [ ] `01. concepts/rust-error-handling.md` L473

### `[[rust-concurrency]]` (1x)

- [ ] `01. concepts/rust-functional-programming.md` L245

### `[[rust-collections]]` (1x)

- [ ] `01. concepts/rust-functional-programming.md` L246

### `[[rust-type-system]]` (1x)

- [ ] `01. concepts/rust-functional-programming.md` L250

### `[[rust-memory-management]]` (1x)

- [ ] `01. concepts/rust-functional-programming.md` L251

### `[[Procedural Macros]]` (1x)

- [ ] `01. concepts/rust-macros.md` L266

### `[[Declarative Macros]]` (1x)

- [ ] `01. concepts/rust-macros.md` L267

### `[[Metaprogramming]]` (1x)

- [ ] `01. concepts/rust-macros.md` L269

### `[[Domain Specific Languages (DSL)]]` (1x)

- [ ] `01. concepts/rust-macros.md` L270

### `[[rust-traits]]` (1x)

- [ ] `01. concepts/rust-memory-management.md` L316

### `[[rust-generics]]` (1x)

- [ ] `01. concepts/rust-memory-management.md` L319

### `[[rust-modules]]` (1x)

- [ ] `01. concepts/rust-memory-management.md` L320

### `[[trait-system]]` (1x)

- [ ] `01. concepts/rust-oop.md` L319

### `[[polymorphism]]` (1x)

- [ ] `01. concepts/rust-oop.md` L320

### `[[class-based-oop]]` (1x)

- [ ] `01. concepts/rust-oop.md` L321

### `[[Rust Language (러스트 언어)]]` (1x)

- [ ] `01. concepts/rust-type-system.md` L422

### `[[Rust - Generics and Traits]]` (1x)

- [ ] `01. concepts/rust-type-system.md` L425

### `[[ffi]]` (1x)

- [ ] `01. concepts/rust-unsafe.md` L218

### `[[raw-pointers]]` (1x)

- [ ] `01. concepts/rust-unsafe.md` L219

### `[[rust-references]]` (1x)

- [ ] `01. concepts/rust-unsafe.md` L220

### `[[c-cpp]]` (1x)

- [ ] `01. concepts/rust.md` L205

### `[[ownership]]` (1x)

- [ ] `01. concepts/rust.md` L207

### `[[memory-safety]]` (1x)

- [ ] `01. concepts/rust.md` L208

### `[[Superposition]]` (1x)

- [ ] `01. concepts/SAE (Sparse Autoencoder).md` L58

### `[[병렬 분해 (Parallel Decomposition)]]` (1x)

- [ ] `01. concepts/Sequential Decomposition (순차 분해).md` L53

### `[[Template Method Pattern]]` (1x)

- [ ] `01. concepts/Strategy Pattern.md` L208

### `[[RepoCraft]]` (1x)

- [ ] `01. concepts/SWE-bench.md` L72

### `[[RLHF]]` (1x)

- [ ] `01. concepts/Sycophancy (아첨).md` L47

### `[[Attention Mechanism]]` (1x)

- [ ] `01. concepts/Task 분해와 AI Attention의 관계.md` L60

### `[[Hoisting]]` (1x)

- [ ] `01. concepts/TDZ (Temporal Dead Zone).md` L149

### `[[Vector Store Limitations]]` (1x)

- [ ] `01. concepts/Temporal Knowledge Graph.md` L131

### `[[Alan Turing]]` (1x)

- [ ] `01. concepts/Turing Test (튜링 테스트).md` L186

### `[[Chinese Room Argument]]` (1x)

- [ ] `01. concepts/Turing Test (튜링 테스트).md` L188

### `[[LLM, ChatGPT, Claude]]` (1x)

- [ ] `01. concepts/Turing Test (튜링 테스트).md` L189

### `[[Temporal Knowledge Graph]]` (1x)

- [ ] `01. concepts/Vector Store Limitations.md` L102

### `[[ecmascript]]` (1x)

- [ ] `01. concepts/wintertc.md` L67

### `[[Normativity (규범성)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L158

### `[[Meta-ethics (메타윤리학)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L159

### `[[Moral Relativism (도덕 상대주의)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L160

### `[[Universal Values (보편적 가치)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L161

### `[[Phronesis (실천적 지혜)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L162

### `[[Sophia (이론적 지혜)]]` (1x)

- [ ] `01. concepts/Wisdom (지혜).md` L163

### `[[절차지향 프로그래밍]]` (1x)

- [ ] `01. concepts/객체지향 프로그래밍 (OOP).md` L110

### `[[역인덱스 (Inverted Index)]]` (1x)

- [ ] `01. concepts/역인덱스 변환 (Inverted-Index Translation).md` L99

### `[[hexagonal-architecture]]` (1x)

- [ ] `01. concepts/클린 아키텍처 (Clean Architecture).md` L85

### `[[general-cs]]` (1x)

- [ ] `02. hubs/00.index.md` L33

### `[[어텐션 점수 계산]]` (1x)

- [ ] `02. hubs/AI-ML 개념 (AI-ML Concepts).md` L31

### `[[agent-architecture-guide]]` (1x)

- [ ] `02. hubs/AI-ML 개념 (AI-ML Concepts).md` L38

### `[[Hub Note]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L30

### `[[Basic Memory MCP 올바른 사용법]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L32

### `[[Basic Memory Setup Complete]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L33

### `[[knowledge-refinement-pipeline]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L34

### `[[Zettelkasten Hub]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L37

### `[[Obsidian Hub]]` (1x)

- [ ] `02. hubs/Basic Memory 허브 (Basic Memory Hub).md` L38

### `[[template-tags-setup]]` (1x)

- [ ] `02. hubs/Metabase 패턴 (Metabase Patterns).md` L28

### `[[parameters-configuration]]` (1x)

- [ ] `02. hubs/Metabase 패턴 (Metabase Patterns).md` L29

### `[[model-reusability]]` (1x)

- [ ] `02. hubs/Metabase 패턴 (Metabase Patterns).md` L31

### `[[dynamic-titles]]` (1x)

- [ ] `02. hubs/Metabase 패턴 (Metabase Patterns).md` L33

### `[[Pipeline Pattern]]` (1x)

- [ ] `02. hubs/Task 분해 (Task Decomposition).md` L47

### `[[Parallel Specialists Pattern]]` (1x)

- [ ] `02. hubs/Task 분해 (Task Decomposition).md` L48

### `[[Swarm Pattern]]` (1x)

- [ ] `02. hubs/Task 분해 (Task Decomposition).md` L49

### `[[L1-cache]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L28

### `[[L2-cache]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L29

### `[[L3-cache]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L30

### `[[RAM-access-patterns]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L32

### `[[gpu-compute]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L34

### `[[kv-cache-vram]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L35

### `[[memory-hierarchy]]` (1x)

- [ ] `02. hubs/메모리 시스템 (Memory Systems).md` L36

### `[[prompt-compression]]` (1x)

- [ ] `02. hubs/최적화 패턴 (Optimization Patterns).md` L28

### `[[output-format-optimization]]` (1x)

- [ ] `02. hubs/최적화 패턴 (Optimization Patterns).md` L29

### `[[cache-reuse-strategy]]` (1x)

- [ ] `02. hubs/최적화 패턴 (Optimization Patterns).md` L31

### `[[fallback-patterns]]` (1x)

- [ ] `02. hubs/최적화 패턴 (Optimization Patterns).md` L33

### `[[retry-logic]]` (1x)

- [ ] `02. hubs/최적화 패턴 (Optimization Patterns).md` L34

### `[[The Rust Programming Language - 개요]]` (1x)

- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L228

### `[[Functor (함자)]]` (1x)

- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L237

### `[[Monad (모나드)]]` (1x)

- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L238

### `[[Monoid (모노이드)]]` (1x)

- [ ] `02. hubs/카테고리 이론 (Category Theory).md` L239

### `[[Three-Layer Memory Architecture]]` (1x)

- [ ] `02. hubs/컨텍스트-메모리 통합 (Context-Memory Integration).md` L47

### `[[working-memory]]` (1x)

- [ ] `02. hubs/컨텍스트-메모리 통합 (Context-Memory Integration).md` L48

### `[[knowledge-cache]]` (1x)

- [ ] `02. hubs/컨텍스트-메모리 통합 (Context-Memory Integration).md` L49

### `[[short-term-memory]]` (1x)

- [ ] `02. hubs/컨텍스트-메모리 통합 (Context-Memory Integration).md` L50

### `[[long-term-memory]]` (1x)

- [ ] `02. hubs/컨텍스트-메모리 통합 (Context-Memory Integration).md` L51

### `[[COBOL]]` (1x)

- [ ] `02. hubs/컴퓨팅 역사 (Computing History).md` L35

### `[[HTTP]]` (1x)

- [ ] `02. hubs/컴퓨팅 역사 (Computing History).md` L37

### `[[Linux]]` (1x)

- [ ] `02. hubs/컴퓨팅 역사 (Computing History).md` L38

### `[[프로그래밍 언어 비교]]` (1x)

- [ ] `02. hubs/프로그래밍 패러다임 (Programming Paradigms).md` L59

### `[[glossary]]` (1x)

- [ ] `03. sources/guides/Character Encoding - BOM, UTF, and History.md` L390

### `[[history]]` (1x)

- [ ] `03. sources/guides/Character Encoding - BOM, UTF, and History.md` L391

### `[[JavaScript의 동적 타입 문제]]` (1x)

- [ ] `03. sources/guides/Java vs JavaScript vs TypeScript - 완전 다른 언어들.md` L278

### `[[Java의 정적 타입 시스템]]` (1x)

- [ ] `03. sources/guides/Java vs JavaScript vs TypeScript - 완전 다른 언어들.md` L278

### `[[웹 플랫폼의 제약]]` (1x)

- [ ] `03. sources/guides/Java vs JavaScript vs TypeScript - 완전 다른 언어들.md` L278

### `[[Rust 언어의 기술적 범위와 실제 사용성에 대한 질문들]]` (1x)

- [ ] `03. sources/guides/Rust 완전 정복 - 기술적 한계부터 풀스택까지.md` L387

### `[[cognitive-science]]` (1x)

- [ ] `03. sources/guides/컴퓨터 구조 학습 여정 - 라이브러리부터 GPU까지.md` L80

### `[[오픈소스 운동]]` (1x)

- [ ] `03. sources/guides/컴퓨팅 역사의 선구자들.md` L330

### `[[ComfyUI]]` (1x)

- [ ] `03. sources/reference/3D 소프트웨어 AI 통합 현황 (2025-2026).md` L106

### `[[LLM 코드 생성]]` (1x)

- [ ] `03. sources/reference/3D 소프트웨어 AI 통합 현황 (2025-2026).md` L107

### `[[MemGPT]]` (1x)

- [ ] `03. sources/reference/A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory).md` L172

### `[[Compound Engineering Plugin]]` (1x)

- [ ] `03. sources/reference/A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory).md` L174

### `[[AI as Exoskeleton]]` (1x)

- [ ] `03. sources/reference/alive-analysis - AI 데이터 분석 워크플로우 스킬.md` L94

### `[[SKILL.md 표준]]` (1x)

- [ ] `03. sources/reference/alive-analysis - AI 데이터 분석 워크플로우 스킬.md` L96

### `[[LLM Evaluation]]` (1x)

- [ ] `03. sources/reference/Anthropic Engineering Blog 2025-2026 주요 글 정리.md` L116

### `[[Multi-Agent System]]` (1x)

- [ ] `03. sources/reference/Anthropic Engineering Blog 2025-2026 주요 글 정리.md` L117

### `[[Context Window]]` (1x)

- [ ] `03. sources/reference/Anthropic Engineering Blog 2025-2026 주요 글 정리.md` L118

### `[[CLI 기반 개발]]` (1x)

- [ ] `03. sources/reference/Claude Code - Anthropic 공식 CLI 에이전트.md` L85

### `[[자연어 인터페이스]]` (1x)

- [ ] `03. sources/reference/Claude Code - Anthropic 공식 CLI 에이전트.md` L86

### `[[Agentic RL]]` (1x)

- [ ] `03. sources/reference/Dep-Search- Dependency-Aware Reasoning with Persistent Memory.md` L121

### `[[Search-R1]]` (1x)

- [ ] `03. sources/reference/Dep-Search- Dependency-Aware Reasoning with Persistent Memory.md` L123

### `[[Agent Memory Systems]]` (1x)

- [ ] `03. sources/reference/Dep-Search- Dependency-Aware Reasoning with Persistent Memory.md` L124

### `[[Layer Normalization]]` (1x)

- [ ] `03. sources/reference/Emergence of Linear Truth Encodings in LMs.md` L113

### `[[agentic-coding]]` (1x)

- [ ] `03. sources/reference/Entire - AI 시대의 차세대 개발자 플랫폼.md` L137

### `[[웹 스크래핑 (Web Scraping)]]` (1x)

- [ ] `03. sources/reference/Jina Reader API.md` L92

### `[[shadcn-ui]]` (1x)

- [ ] `03. sources/reference/LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크.md` L94

### `[[Next.js]]` (1x)

- [ ] `03. sources/reference/LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크.md` L95

### `[[WCAG]]` (1x)

- [ ] `03. sources/reference/LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크.md` L96

### `[[Design Systems]]` (1x)

- [ ] `03. sources/reference/LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크.md` L97

### `[[Tailwind CSS]]` (1x)

- [ ] `03. sources/reference/LiftKit - 자동화된 디자인 원칙 적용 UI 프레임워크.md` L98

### `[[C4 Model]]` (1x)

- [ ] `03. sources/reference/LikeC4 - 코드 기반 아키텍처 다이어그램 도구.md` L75

### `[[Mermaid]]` (1x)

- [ ] `03. sources/reference/LikeC4 - 코드 기반 아키텍처 다이어그램 도구.md` L76

### `[[Structurizr]]` (1x)

- [ ] `03. sources/reference/LikeC4 - 코드 기반 아키텍처 다이어그램 도구.md` L77

### `[[Emergence of Linear Truth Encodings in LMs]]` (1x)

- [ ] `03. sources/reference/Linear Representation Hypothesis - LLM 기하학.md` L93

### `[[Jailbreak]]` (1x)

- [ ] `03. sources/reference/Linear Representations Change During Conversation.md` L83

### `[[자기진화 에이전트 (Self-Evolving Agent)]]` (1x)

- [ ] `03. sources/reference/MemSkill - 자기진화 메모리 스킬.md` L155

### `[[메모리 뱅크 (Memory Bank)]]` (1x)

- [ ] `03. sources/reference/MemSkill - 자기진화 메모리 스킬.md` L156

### `[[스킬 발견 (Skill Discovery)]]` (1x)

- [ ] `03. sources/reference/MemSkill - 자기진화 메모리 스킬.md` L157

### `[[PydanticAI]]` (1x)

- [ ] `03. sources/reference/Monty - Rust 기반 AI 코드 실행 샌드박스.md` L104

### `[[Docker]]` (1x)

- [ ] `03. sources/reference/Monty - Rust 기반 AI 코드 실행 샌드박스.md` L105

### `[[WebAssembly]]` (1x)

- [ ] `03. sources/reference/Monty - Rust 기반 AI 코드 실행 샌드박스.md` L106

### `[[Obsidian]]` (1x)

- [ ] `03. sources/reference/Obsidian CLI.md` L157

### `[[Obsidian Bases]]` (1x)

- [ ] `03. sources/reference/Obsidian CLI.md` L158

### `[[Obsidian Publish]]` (1x)

- [ ] `03. sources/reference/Obsidian CLI.md` L159

### `[[Obsidian Sync]]` (1x)

- [ ] `03. sources/reference/Obsidian CLI.md` L160

### `[[automation]]` (1x)

- [ ] `03. sources/reference/Obsidian CLI.md` L162

### `[[멀티 에이전트 시스템 (Multi-Agent System)]]` (1x)

- [ ] `03. sources/reference/PaperBanana - AI 학술 일러스트 생성 프레임워크.md` L95

### `[[Gemini API]]` (1x)

- [ ] `03. sources/reference/PaperBanana - AI 학술 일러스트 생성 프레임워크.md` L96

### `[[Fabric]]` (1x)

- [ ] `03. sources/reference/Paramiko - Python SSH 라이브러리.md` L85

### `[[근사이론]]` (1x)

- [ ] `03. sources/reference/REF-059 Learning Without Training.md` L81

### `[[매니폴드 학습]]` (1x)

- [ ] `03. sources/reference/REF-059 Learning Without Training.md` L82

### `[[전이학습]]` (1x)

- [ ] `03. sources/reference/REF-059 Learning Without Training.md` L83

### `[[Active Learning]]` (1x)

- [ ] `03. sources/reference/REF-059 Learning Without Training.md` L84

### `[[신호분리]]` (1x)

- [ ] `03. sources/reference/REF-059 Learning Without Training.md` L85

### `[[OAuth 2.0]]` (1x)

- [ ] `03. sources/reference/REF-063 Figma API Reference - REST API & Plugin API.md` L130

### `[[Webhook (웹훅)]]` (1x)

- [ ] `03. sources/reference/REF-063 Figma API Reference - REST API & Plugin API.md` L131

### `[[소스코드 (Source Code)]]` (1x)

- [ ] `03. sources/reference/REF-067 Interview with Thomas Wouters - Python Core Developer.md` L61

### `[[Continual Learning (지속 학습)]]` (1x)

- [ ] `03. sources/reference/REF-070 PyTorch Korea AI-ML Weekly 2026-02-23~03-01.md` L70

### `[[How to Train Your Deep Research Agent? Prompt, Reward, and Policy Optimization in Search-R1]]` (1x)

- [ ] `03. sources/reference/REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization.md` L88

### `[[Chain of Thought (CoT)]]` (1x)

- [ ] `03. sources/reference/REF-075 Think Deep Not Just Long - Measuring LLM Reasoning Effort via Deep-Thinking Tokens.md` L76

### `[[Python (파이썬)]]` (1x)

- [ ] `03. sources/reference/REF-076 Pyrefly - PyTorch 타입 체커 전환.md` L73

### `[[플랫폼별 데이터 추출 방식 비교]]` (1x)

- [ ] `03. sources/reference/REF-077 Meta Business Suite 게시물별 GraphQL API 분석.md` L190

### `[[LLM Inference Optimization]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L131

### `[[Autoscaling]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L132

### `[[Integer Linear Programming (ILP)]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L133

### `[[ARIMA]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L134

### `[[SLA Management]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L135

### `[[Spot Instance]]` (1x)

- [ ] `03. sources/reference/SAGEServe - LLM Serving 최적화.md` L136

### `[[Quivr]]` (1x)

- [ ] `03. sources/reference/SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding).md` L130

### `[[Claude Code Best Practice]]` (1x)

- [ ] `03. sources/reference/Superpowers - Claude Code 개발 워크플로우 프레임워크.md` L86

### `[[context-window-optimization]]` (1x)

- [ ] `03. sources/reference/SWE-Pruner 논문 리뷰.md` L91

### `[[Clean Code (클린 코드)]]` (1x)

- [ ] `03. sources/reference/코드 가독성과 신경과학 - Evan Moon.md` L65

### `[[Developer Intuition (개발자 직관)]]` (1x)

- [ ] `03. sources/reference/코드 가독성과 신경과학 - Evan Moon.md` L66

### `[[01. concepts/json-serialization]]` (1x)

- [ ] `03. sources/workcases/development-gotchas-summary.md` L133

### `[[01. concepts/javascript-hoisting]]` (1x)

- [ ] `03. sources/workcases/development-gotchas-summary.md` L134

### `[[metabase-skill]]` (1x)

- [ ] `03. sources/workcases/metabase-mcp-patterns-summary.md` L148

### `[[MCP Tool Search Implementation Limitations]]` (1x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L706

### `[[Tool-Hub Architecture]]` (1x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L713

### `[[Claude Code 한계와 우회 전략]]` (1x)

- [ ] `03. sources/workcases/Tool-Hub Birth Background Claude Code to Progressive Disclosure.md` L714

### `[[reference-skill-integration]]` (1x)

- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L362

### `[[rpg-skill-integration]]` (1x)

- [ ] `03. sources/workcases/vecsearch 벡터 시맨틱 검색 구현.md` L362

### `[[벡터 임베딩]]` (1x)

- [ ] `04. notes/KGGen 이해 - 명사 통합과 동사 관계.md` L208

### `[[코사인 유사도]]` (1x)

- [ ] `04. notes/KGGen 이해 - 명사 통합과 동사 관계.md` L209

### `[[OpenIE]]` (1x)

- [ ] `04. notes/KGGen 이해 - 명사 통합과 동사 관계.md` L210

### `[[Orchestrator 역할 불명확]]` (1x)

- [ ] `04. notes/Orchestrator의 의도 보존 분해 역할.md` L53

### `[[Task 맥락 손실]]` (1x)

- [ ] `04. notes/QDMR 기반 Task 분해.md` L42

### `[[웹 기초]]` (1x)

- [ ] `04. notes/SOP가 차단하고 CORS가 허용한다 — 브라우저 보안의 한 쌍.md` L76

### `[[위키링크]]` (1x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L632

### `[[시스템1-2]]` (1x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L677

### `[[KGGen]]` (1x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L678

### `[[basic-memory-relation-customization]]` (1x)

- [x] `04. notes/Three-Layer Memory Architecture.md` L864

### `[[카너먼 시스템1/2]]` (1x)

- [ ] `04. notes/시스템1-2와 기억 재구성.md` L45

### `[[context-poisoning]]` (1x)

- [ ] `04. notes/자가 생성 메모리의 파라미터 내재화는 왜곡을 영구화한다.md` L67

### `[[research-note-template]]` (1x)

- [ ] `04. notes/지식 저장의 원리 - 카너먼 Loftus KGGen.md` L54

### `[[일반 CS 개념]]` (1x)

- [ ] `04. notes/추상화는 3단 구조로 반복된다.md` L62

### `[[Simple Graph와 Category Theory의 연결]]` (1x)

- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L110

### `[[Order와 Relation의 계층]]` (1x)

- [ ] `04. notes/category-theory/01-chapter-roadmap.md` L111

### `[[call-graphql-x]]` (1x)

- [ ] `05. code/functions/extract-tokens-fb.md` L52

### `[[sqlite_vec.load]]` (1x)

- [ ] `05. code/functions/init-vector-db.md` L35

### `[[new-group-folder]]` (1x)

- [ ] `05. code/functions/new-project-folder.md` L59

### `[[playwright]]` (1x)

- [ ] `05. code/modules/collect-posts.md` L67

### `[[basic-memory-config]]` (1x)

- [ ] `05. code/modules/config.md` L47

### `[[config-manager]]` (1x)

- [ ] `05. code/modules/config.md` L48

### `[[pydantic-settings]]` (1x)

- [ ] `05. code/modules/config.md` L49

### `[[create-sample-dataframe]]` (1x)

- [ ] `05. code/modules/data-format-aggregation-demo.md` L79

### `[[database-type]]` (1x)

- [ ] `05. code/modules/db.md` L42

### `[[alembic]]` (1x)

- [ ] `05. code/modules/db.md` L44

### `[[entity-parser-class]]` (1x)

- [ ] `05. code/modules/entity-parser.md` L40

### `[[normalize-frontmatter-value]]` (1x)

- [ ] `05. code/modules/entity-parser.md` L41

### `[[parse-content]]` (1x)

- [ ] `05. code/modules/entity-parser.md` L42

### `[[entity-model]]` (1x)

- [ ] `05. code/modules/knowledge.md` L42

### `[[observation-model]]` (1x)

- [ ] `05. code/modules/knowledge.md` L43

### `[[relation-model]]` (1x)

- [ ] `05. code/modules/knowledge.md` L44