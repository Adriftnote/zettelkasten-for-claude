---
title: Tool-Hub Birth Background Claude Code to Progressive Disclosure
type: note
permalink: architecture/tool-hub-birth-background-claude-code-to-progressive-disclosure
tags:
- tool-hub
- progressive-disclosure
- claude-code
- mcp-cli
- lazy-loading
- clean-architecture
- history
extraction_status: pending
---

# Tool-Hub 탄생 배경: Claude Code 한계에서 Progressive Disclosure까지

## 핵심 요약

[Tool-Hub] [was born from] [Claude Code의 defer_loading 미지원 문제]
[Tool-Hub] [evolved through] [3단계 발견 과정]
[Tool-Hub] [combines] [Memory 검색 + mcp-cli 실행 + 클린 아키텍처]

---

# Phase 1: Claude Code의 한계 발견

## 1.1 Anthropic Cookbook의 이상적 패턴

[Anthropic Cookbook] [describes] [Tool Search 패턴]
[Tool Search 패턴] [enables] [동적 도구 로딩]

```
┌─────────────────────────────────────────────────────┐
│ 1. 대화 시작: tools = [tool_search]  (도구 1개만)    │
├─────────────────────────────────────────────────────┤
│ 2. Claude: "sqlite query 도구 필요해"               │
│    → tool_search 호출                              │
├─────────────────────────────────────────────────────┤
│ 3. 검색 결과: read_query 발견 (input_schema 포함)   │
├─────────────────────────────────────────────────────┤
│ 4. 동적 추가: tools = [tool_search, read_query]    │
├─────────────────────────────────────────────────────┤
│ 5. Claude: read_query 호출 가능!                   │
└─────────────────────────────────────────────────────┘
```

**핵심**: 대화 중간에 도구가 **동적으로 추가**됨

## 1.2 Claude Code에서 구현 불가: 세션 모델의 근본적 차이

[Claude Code] [does not support] [defer_loading]
[근본 원인] [is] [API와 Claude Code의 세션 모델 차이]

### API vs Claude Code 세션 차이

| | Anthropic API | Claude Code |
|---|---|---|
| **세션** | Stateless (매번 새로) | Persistent (계속 유지) |
| **도구 로드** | 요청마다 동적 추가 가능 | 시작 시 고정, 변경 불가 |
| **defer_loading** | ✅ 가능 | ❌ 불가 |

**API (defer_loading 가능)**:
```
세션 1: tools = [tool_search] → 검색 → tools = [tool_search, read_query]
세션 2: tools = [tool_search] → 검색 → tools = [tool_search, list_tables]
→ 매번 새 세션이니까 그때그때 필요한 도구만 추가하면 됨
```

**Claude Code (defer_loading 불가)**:
```
세션 시작: 모든 MCP 서버 연결 → 모든 도구 로드 (89개 = 89,000+ 토큰)
대화 중: 도구 추가/제거 불가능
→ 항상 같은 세션이라 도구가 컨텍스트에 박혀있어야 함
```

| 기능 | GitHub Issue | 상태 |
|------|-------------|------|
| Tool Search Tool | #12836 | OPEN |
| defer_loading | #7336 | OPEN |

### 우회 방법: CLI로 호출

MCP 직접 연결 대신 **CLI로 우회**하면 도구 정의가 컨텍스트에 없어도 됨:
- AI가 bash로 mcp-cli 호출
- 필요한 도구만 그때그때 실행
- 토큰 절약 + 유연성 확보

## 1.3 초기 대안: Memory + mcp-cli-tool

[초기 대안] [was] [Memory에 스키마 저장 + mcp-cli로 호출]

```
┌──────────────────────────────────────────────────────┐
│ 1. Memory (세션 시작 시 로드)                         │
│    - MCP 도구 스키마 저장 (input_schema 포함)         │
│    - search_nodes로 검색 가능                        │
├──────────────────────────────────────────────────────┤
│ 2. 도구 필요할 때                                    │
│    mcp__memory__search_nodes("sqlite query")         │
│    → 스키마 반환 (파라미터 정보 포함)                 │
├──────────────────────────────────────────────────────┤
│ 3. 실제 호출                                         │
│    npx @wong2/mcp-cli call-tool server:tool --args   │
└──────────────────────────────────────────────────────┘
```

---

# Phase 2: thedotmack/mcp-client-cli 발견과 LazyToolLoader 패턴

## 2.1 MCP CLI의 동적 도구 로딩 철학

[MCP CLI 철학] [prioritizes] [tool freshness over speed]

MCP CLI는 **매 명령 실행마다 도구를 동적으로 fetch**한다. 왜?

```
$ mcp-cli sqlite_tiktok list_tables
Fetching tools for sqlite_tiktok...   ← 매번 이 메시지가 뜸
# 결과 반환
```

**설계 철학**:
- 영속적 캐시 없음 → 서버 도구가 바뀌면 자동 반영 (tool freshness)
- Lazy Loading → 호출한 서버의 도구만 로드 (startup overhead 감소)

**트레이드오프**:

| | 장점 | 단점 |
|---|---|---|
| 매번 fetch | 항상 최신 도구 | 매번 연결 비용 |
| 캐시 없음 | 서버 변경 자동 반영 | 반복 호출 시 느림 |

이 "매번 fetch" 철학이 **CLI의 등록-실행 분리 구조**와 충돌하면서 버그가 발생한다.

## 2.2 @wong2/mcp-cli의 한계: 토큰은 아끼는데 느림

[초기 선택] [@wong2/mcp-cli] [saves tokens but slow]

CLI 우회 방법으로 **@wong2/mcp-cli**를 사용하고 있었음:
```bash
npx @wong2/mcp-cli call-tool server:tool --args '{}'
```

| | 토큰 | 속도 |
|---|---|---|
| MCP 직접 연결 | ❌ 많음 (89,000+) | ✅ 빠름 |
| **@wong2/mcp-cli** | ✅ 적음 | ❌ 느림 🐢 |

**문제**: 토큰은 아끼는데, AI가 bash로 호출할 때마다 느림

→ 더 빠른 CLI를 찾다가 **thedotmack/mcp-client-cli** 발견

## 2.3 mcp-client-cli란? (원래 목적을 몰랐음)

[mcp-client-cli] [was designed for] [사람이 터미널에서 MCP 도구 직접 호출]

나는 AI가 CLI로 MCP를 호출하게 하려고 찾았는데, 알고 보니 **원래 사람용**이었음.

MCP는 원래 AI가 도구를 호출하는 프로토콜인데, mcp-client-cli는 **사람이 터미널에서** 직접 MCP 서버의 도구를 호출할 수 있게 해주는 CLI wrapper다.

```
원래 MCP:        AI (Claude) ──→ MCP 서버 ──→ 도구 실행
mcp-client-cli:  사람 (터미널) ──→ CLI ──→ MCP 서버 ──→ 도구 실행
내가 하려던 것:   AI ──→ bash ──→ CLI ──→ MCP 서버 ──→ 도구 실행
```

**원래 목적을 몰랐기 때문에** 버그도 발견하고, 캐싱 전략도 배우게 됨.

## 2.4 CLI 특성과 버그 발견: 등록 시점 ≠ 실행 시점

[CLI 특성] [requires] [명령어 사전 등록 + 사용자 입력 대기]

**CLI의 동작 방식** (commander.js 기반):
```
$ mcp-cli sqlite list_tables
        │
        ↓
   1. 프로그램 시작
   2. 명령어 등록 (서버 연결 → 목록 조회 → 연결 끊음)
   3. program.parse()로 argv 파싱
   4. 해당 action 실행
   5. 종료
```

**연결 끊는 건 자연스러움**: 등록 끝나면 연결 유지할 이유 없음 ✓

**진짜 문제**: action 안에서 **새 client를 만들지 않고**, 등록 시점에 만든 **기존 client를 재사용**하려고 함

```bash
$ mcp-cli sqlite_tiktok list_tables
Error: Client not initialized
```

**원인 분석**:
```typescript
// ❌ 문제: 기존 client 재사용
async function registerServerTools(...) {
  const client = new MCPClient();   // client 하나 만듦
  await client.connect();           // 1. 연결
  const tools = await client.listTools();  // 2. 도구 목록

  for (const tool of tools) {
    toolCmd.action(async (options) => {
      await executeToolCommand(client, ...);  // 4. 같은 client 재사용하려고 함!
    });
  }

  await client.disconnect();  // 3. 연결 끊음 (자연스러움)
}

program.parse();  // 이때 action 실행됨 → 근데 client 이미 죽어있음
```

**문제의 본질**: action에서 **새 client 인스턴스를 만들어야** 하는데, **등록 시점에 만든 client를 클로저로 참조**해서 재사용

## 2.5 LazyToolLoader 패턴으로 버그 수정

[LazyToolLoader 패턴] [fixes] [Client not initialized 에러]
[핵심 아이디어] [is] [등록 시점에는 캐시, 실행 시점에는 새 연결]

### Anti-pattern vs LazyToolLoader 로직 비교

```
[Anti-pattern] 등록 시점에 연결 → 실행 시점에 죽어있음
┌─────────────────────────────────────────────────┐
│ 1. 프로그램 시작                                  │
│ 2. 서버 연결 → 도구 목록 fetch → 연결 끊음        │  ← 여기서 끊김
│ 3. 명령어 등록 (action 클로저가 client 참조)      │
│ 4. program.parse() → action 실행                │
│ 5. client.call() → ❌ "Client not initialized"  │
└─────────────────────────────────────────────────┘

[LazyToolLoader] 등록은 캐시로, 실행 시점에 새 연결
┌─────────────────────────────────────────────────┐
│ 1. 프로그램 시작                                  │
│ 2. 캐시에서 도구 목록 (연결 없음!)                 │  ← 연결 안 함
│ 3. 명령어 등록                                    │
│ 4. program.parse() → action 실행                │
│ 5. action 내부: 새 client 생성 → 연결 → 실행 ✅   │  ← 여기서 연결
└─────────────────────────────────────────────────┘
```

### ToolCache의 역할

[ToolCache] [enables] [연결 없이 도구 목록 제공]

```
도구 목록이 필요할 때:
┌────────────────────────────────────────┐
│ 1. 캐시 확인 → 있고 신선하면 반환 (연결 ✗) │
│ 2. 캐시 없거나 만료 → 연결해서 fetch       │
│ 3. 디스크에 저장                          │
│ 4. 이후 요청은 캐시에서 (연결 ✗)           │
└────────────────────────────────────────┘
```

**핵심**: 등록 시점에 "도구 목록"만 필요하지 "연결"이 필요한 게 아님
→ 캐시로 분리하면 등록과 실행의 생명주기가 독립됨

### 해결책 코드

**해결책**: action 안에서 **새 client 인스턴스**를 만들면 됨

```typescript
// ✅ 해결: action에서 새 client 생성
toolCmd.action(async (options) => {
  const client = new MCPClient(serverConfig);  // ← 새로 만듦!
  await client.connect();
  await executeToolCommand(client, tool.name, options);
  await client.disconnect();
});
```

## 2.6 캐싱으로 속도 개선

[캐싱] [solves] [@wong2의 느린 속도 문제]

**Anthropic Cookbook에서 배운 캐싱 아이디어**를 CLI에 적용:
- 원래: 임베딩 캐싱 (도구 검색 초기화 시간 단축)
- 적용: 도구 목록 캐싱 (매번 서버 연결 안 해도 됨)

```typescript
// ✅ LazyToolLoader 패턴 (해결 + 캐싱)
const toolCache = new ToolCache();

async function registerServerTools(...) {
  // 캐시에서 도구 목록 (연결 안 함! 빠름!)
  const tools = await toolCache.getOrFetch(serverName, serverConfig);

  for (const tool of tools) {
    toolCmd.action(async (options) => {
      // 실행 시점에 새 client 생성
      const client = new MCPClient(serverConfig);
      await client.connect();
      await executeToolCommand(client, tool.name, options);
      await client.disconnect();
    });
  }
}
```

**결과**: AI가 CLI로 호출할 때 속도 개선!

| | 토큰 | 속도 |
|---|---|---|
| MCP 직접 연결 | ❌ 많음 | ✅ 빠름 |
| @wong2/mcp-cli | ✅ 적음 | ❌ 느림 |
| **thedotmack + 캐싱** | ✅ 적음 | ✅ 빨라짐! |

**핵심 변화**:
```
Before: 시작 → 연결 → 도구 목록 → 연결 끊음 → ... → 실행 (실패)
After:  시작 → 캐시에서 목록 → ... → 실행 시점에 연결 → 실행 → 끊음
```

---

# Phase 3: 클린 아키텍처 적용과 설계 철학

## 3.1 @wong2 vs thedotmack 설계 비교

[설계 철학] [differentiates] [절차적 vs 다형성]

| 설계        | @wong2/mcp-cli                      | thedotmack/mcp-client-cli   |
| --------- | ----------------------------------- | --------------------------- |
| **패러다임**  | 문자열 파싱 (절차적)                        | 다형성 (객체지향)                  |
| **문법**    | `call-tool server:tool --args '{}'` | `server tool --param value` |
| **타입 안전** | JSON 문자열                            | 도구별 타입 체크                   |
| **확장성**   | 모든 도구 같은 처리                         | 도구별 다른 인터페이스                |

### 서버 타입별 다형성

[다형성] [enables] [같은 CLI 인터페이스, 다른 실행 환경]

thedotmack의 설계가 빛나는 지점: **서버 타입이 달라도 같은 방식으로 호출**

```
사용자 입장 (동일한 인터페이스):
$ mcp-cli markitdown convert_to_markdown --file doc.pdf
$ mcp-cli sqlite_tiktok list_tables
$ mcp-cli n8n create_workflow --name test

내부 실행 (다른 환경):
┌─────────────────┬────────────────────────────────┐
│ 서버 타입        │ 실제 실행 방식                   │
├─────────────────┼────────────────────────────────┤
│ uvx 기반        │ uvx markitdown-mcp             │
│ Python venv     │ venv/bin/python -m module      │
│ Node.js         │ node path/to/server.js         │
└─────────────────┴────────────────────────────────┘
```

**로직**: `.mcp-cli.json`에서 command/args를 읽어서 서버별로 다르게 실행
→ 사용자는 서버가 Python인지 Node인지 **몰라도 됨**

## 3.2 적용된 디자인 패턴

[thedotmack] [applies] [Command Pattern + Strategy Pattern + Polymorphism]

### Command Pattern
```typescript
// 각 MCP 도구 = Command 객체
for (const tool of tools) {
  const toolCmd = serverCmd.command(tool.name);  // ← Command 생성
  generateCommandOptions(tool, toolCmd);          // ← 파라미터 설정
  toolCmd.action(async (options) => {...});       // ← execute() 정의
}
```

### Strategy Pattern
```typescript
// inputSchema = 전략(Strategy)
function generateCommandOptions(tool, cmd) {
  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    if (prop.type === 'string') {
      cmd.option(`--${propName} <string>`, ...);  // 전략 A
    } else if (prop.type === 'number') {
      cmd.option(`--${propName} <number>`, ...);  // 전략 B
    }
  }
}
```

## 3.3 클린 아키텍처 레이어

[클린 아키텍처] [structures] [4개 레이어]

```
┌──────────────────────────────────────┐
│  Presentation (CLI)              │  ← index.ts
├──────────────────────────────────────┤
│  Application (Generator)         │  ← generator.ts
├──────────────────────────────────────┤
│  Domain (ToolCache)              │  ← ToolCache.ts
├──────────────────────────────────────┤
│  Infrastructure (MCPClient)      │  ← MCPClient.ts
└──────────────────────────────────────┘
```

**의존성 규칙**: 안쪽 레이어는 바깥쪽을 모름

---

# Phase 4: Tool-Hub 탄생

## 4.1 학습 내용 종합

[Tool-Hub 설계] [integrates] [3가지 학습]

| 출처 | 학습 내용 | Tool-Hub 적용 |
|------|----------|-----------------|
| Phase 1 | Memory + mcp-cli 패턴 | ChromaDB 벡터 검색 + MCP 서버 |
| Phase 2 | LazyToolLoader 패턴 | 캐시 기반 도구 발견 |
| Phase 3 | 다형성 + 클린 아키텍처 | Strategy 패턴, 레이어 분리 |

## 4.2 Tool-Hub 아키텍처

[Tool-Hub] [implements] [Progressive Disclosure 패턴]

```
┌─────────────────────────────────────────────────────┐
│ 1. 쿼리: "n8n 워크플로우 자동화"                      │
├─────────────────────────────────────────────────────┤
│ 2. VectorSearchStrategy (ChromaDB)                  │
│    → 의미 검색으로 관련 도구 발견                    │
├─────────────────────────────────────────────────────┤
│ 3. KnowledgeGraphStrategy (JSON Graph)              │
│    → BFS로 의존성 확장                              │
├─────────────────────────────────────────────────────┤
│ 4. HybridSearchStrategy                             │
│    → 결과 병합 + 중복 제거                          │
├─────────────────────────────────────────────────────┤
│ 5. 결과: [n8n-workflow-builder, n8n-node-templates] │
│    토큰 절감: 89,000 → 4,000 (95.5%)               │
└─────────────────────────────────────────────────────┘
```

## 4.3 왜 이렇게 설계되었나

### Strategy 패턴 사용 이유
[Phase 1에서 학습] [teaches] [다양한 검색 방식 필요]
- Claude Code가 defer_loading 미지원 → 자체 검색 시스템 필요
- 벡터 검색, 그래프 검색 등 다양한 전략 → Strategy 패턴

### Python 브릿지 사용 이유
[Phase 2에서 학습] [teaches] [캐시 필수]
- JS ChromaDB 클라이언트는 persistent mode 미지원
- LazyToolLoader 패턴처럼 캐시 파일 접근 필요 → Python 래퍼

### HybridSearch 조합 이유
[Phase 3에서 학습] [teaches] [다형성 + 클린 아키텍처]
- 단일 전략으로 부족 → 벡터 + 그래프 조합
- OCP 준수 → 새 전략 추가 시 코드 수정 불필요

---

# Phase 5: 다중 도구 연결 문제와 Chainer 흡수

## 5.1 새로운 문제: MCP → MCP 직접 전달이 안 됨

[문제] [was] [MCP 도구끼리 직접 연결 불가, AI가 매번 중간 개입 필요]

Tool-Hub로 도구를 **찾는 건** 해결됐는데, 여러 도구를 쓰려니 예상과 달랐음.

**내 예상**: AI가 "sqlite 결과를 pandas로 보내" 하면 MCP끼리 직접 전달
```
❌ 예상: AI → "MCP A → MCP B → MCP C" → 결과
              (도구끼리 직접 데이터 전달)
```

**실제**: 여러 MCP 서버라서 **도구끼리 직접 통신이 안 됨**. AI가 매번 중간에 개입해야 함.
```
✅ 실제: AI → MCP A → AI → MCP B → AI → MCP C → AI
              ↑_________↑_________↑
              매번 AI 왕복 (토큰 소비)
```

### Tool-Chainer란?

[Tool-Chainer] [is] [AI 왕복 없이 여러 도구를 순차 실행하는 MCP 서버]

이 문제를 해결하려고 만든 게 Tool-Chainer:
```
AI → Tool-Chainer → [MCP A → MCP B → MCP C] → AI
                    (Chainer가 직접 연결)
```

Tool-Chainer는 **CHAIN_RESULT 플레이스홀더**로 이전 결과를 자동 전달:
```typescript
// 체인 정의
[
  { toolName: "sqlite_query", toolArgs: '{"sql": "SELECT *..."}' },
  { toolName: "pandas_to_excel", toolArgs: '{"data": "CHAIN_RESULT"}' }
  //                                              ↑ 이전 결과로 자동 치환
]
```

**핵심 기능**:
- **CHAIN_RESULT**: 이전 단계 결과를 다음 단계 입력으로 자동 전달
- **JSONPath 필터링**: 결과에서 필요한 부분만 추출 (`$.data[0].name`)

### 문제: 두 프로젝트가 따로 놀고 있음

```
[Tool-Hub]                    [Tool-Chainer]
toolhub_search ────┐          mcp_chain (실행)
toolhub_cluster    │          chainable_tools
toolhub_expand     │          discover_tools
                   │
Knowledge Graph    │
(OUTPUTS_TO 등)    │
                   │
        ❌ 연결 없음 ❌
```

**상황**:
- `toolhub_cluster`가 관계 정보 반환하지만 **활용 안 됨**
- `tool-chainer`는 **수동으로** 체인 구성해야 함
- 두 프로젝트가 따로 놀고 있음

### 공통 문제점 (클린 아키텍처 관점)

| 문제        | Tool-Hub          | Tool-Chainer    |
| --------- | ----------------- | --------------- |
| 의존성 주입 없음 | ✅ 생성자에서 직접 생성     | ✅ 전역 변수 사용      |
| 레이어 분리 없음 | △ Strategy로 일부 분리 | ✅ 단일 파일 441줄    |
| 인프라 로직 혼재 | ✅ Python 스폰 내부    | ✅ MCP Client 혼재 |
| 테스트 어려움   | ✅ Mock 주입 불가      | ✅ 전역 상태         |

→ 통합하면서 **클린 아키텍처 적용 필요**

## 5.2 해결: Tool-Hub가 Chainer 흡수

[해결책] [is] [Tool-Hub가 Tool-Chainer 로직 흡수]

```
[Tool-Hub (통합)]
toolhub_search      ← 기존
toolhub_cluster     ← 기존 + suggestedChain 추가
toolhub_expand      ← 기존
toolhub_execute     ← 새로운 실행 도구 ✨
toolhub_register    ← 기존
toolhub_delete      ← 기존
toolhub_list        ← 기존

내부 모듈:
- ChainBuilder      ← Knowledge Graph → mcpPath 변환
- ChainExecutor     ← Tool-Chainer 로직 이식
```

### toolhub_execute 실행 흐름

```
toolhub_execute("TikTok 데이터 → Excel")
    ↓
[1] toolhub_cluster 호출 → 관련 도구 발견
    ↓
[2] ChainBuilder → Knowledge Graph 분석 → mcpPath 생성
    ↓
[3] ChainExecutor → 순차 실행
    ↓
[4] 결과 반환
```

### Knowledge Graph 관계 → 자동 체인

| 관계 타입 | 체인 역할 | 예시 |
|-----------|----------|------|
| OUTPUTS_TO | 순차 실행 (A → B) | sqlite → pandas |
| REQUIRES | 선행 조건 (먼저 실행) | API 호출 전 인증 |
| WORKS_WITH | 병렬 가능 | 여러 데이터 소스 |
| BENEFITS_FROM | 선택적 포함 | 분석 전 구조 파악 |

## 5.3 기대 효과

[통합] [achieves] [토큰 절감 + Bash 문제 해결]

| 항목 | Before | After |
|------|--------|-------|
| 실행 방법 | Bash mcp-cli | toolhub_execute |
| 체인 구성 | 수동 | 자동 (Knowledge Graph) |
| 토큰 | ~850 + 결과 | ~650 + 결과 (20% 절감) |
| 파라미터 | Bash 문자열 (이스케이핑 필요) | JSON (안전) |

**핵심**: Bash로 mcp-cli 호출할 때 **이스케이핑 문제**가 있었는데, toolhub_execute로 **JSON 파라미터** 사용하면 안전해짐.

---

# 진화 타임라인

[진화 과정] [follows] [5단계]

```
2025-12-23: Claude Code 한계 발견
            └─→ defer_loading 미지원, Tool Search 미지원
            └─→ 대안: Memory + mcp-cli 패턴 제안

2025-12-30: thedotmack/mcp-client-cli 발견 및 수정
            └─→ 다형성 설계 (vs @wong2의 절차적 설계)
            └─→ "Client not initialized" 버그 발견
            └─→ LazyToolLoader 패턴으로 수정 (PR 기여)

2026-01-02: 클린 아키텍처 분석
            └─→ 다형성, Command/Strategy 패턴
            └─→ 4계층 레이어 구조 학습

2026-01-02: Tool-Hub 구현
            └─→ Progressive Disclosure 패턴
            └─→ Vector + Graph 하이브리드 검색
            └─→ 90%+ 토큰 절감 달성

2026-01-??: 다중 도구 연결 문제 발생
            └─→ Tool-Hub와 Tool-Chainer가 따로 놀고 있음
            └─→ Chainer 흡수 계획 수립
            └─→ toolhub_execute로 자동 체이닝 + Bash 이스케이핑 문제 해결
```

---

# 핵심 교훈

## Claude Code 한계 → 창의적 해결

[핵심 교훈 1] [is] [제약이 혁신을 낳음]
- defer_loading 미지원 → 자체 Progressive Disclosure 구현
- 동적 도구 추가 불가 → 검색 기반 선택적 로딩

## LazyToolLoader → 성능 최적화

[핵심 교훈 2] [is] [등록 시점 ≠ 실행 시점]
- 도구 목록은 캐시에서 (연결 안 함)
- 실제 실행 시에만 연결 (Lazy Connect)

## 클린 아키텍처 → 확장성

[핵심 교훈 3] [is] [인터페이스로 추상화]
- SearchStrategy 인터페이스로 검색 방식 추상화
- 새 전략 추가 시 기존 코드 수정 불필요 (OCP)

---

# 관련 문서

[관련 문서] [includes] [핵심 문서들]

| 문서 | 역할 | 핵심 내용 |
|------|------|---------|
| MCP Tool Search Implementation Limitations | 문제 정의 | Claude Code 한계, Memory + mcp-cli 대안 |
| [[MCP CLI Dynamic Tool Fetching]] | 동적 로딩 | 매번 fetch하는 철학, tool freshness |
| [[MCP CLI LazyToolLoader Pattern]] | 패턴 학습 | 등록/실행 분리, ToolCache 역할 |
| [[MCP-CLI Command Conventions]] | 규칙 | 언더스코어 명명, 서버 타입별 설정 |
| [[MCP CLI Polymorphism Pattern Clean Architecture]] | 아키텍처 | 다형성, 클린 아키텍처 4계층 |
| [[Tool-Hub & Tool-Chainer Architecture Analysis]] | 현재 분석 | 두 프로젝트 구조, 공통 문제점 |
| [[Tool-Hub Integration Plan Chainer Absorption]] | 통합 계획 | Chainer 흡수, 자동 체이닝, toolhub_execute |

## Observations

- [architecture] Tool-Hub는 Claude Code의 defer_loading 미지원 한계에서 탄생 #tool-hub #origin #claude-code
- [pattern] LazyToolLoader 패턴으로 "Client not initialized" 버그 해결 (등록 시점 ≠ 실행 시점) #lazy-loading #bug-fix
- [idea] MCP CLI는 "tool freshness" 철학으로 매번 fetch → 캐시 없음이 의도된 설계 #mcp-cli #design-philosophy
- [idea] ToolCache의 핵심: 등록 시점에 필요한 건 "도구 목록"이지 "연결"이 아님 → 분리 가능 #cache #separation
- [pattern] 서버 타입 다형성: 같은 CLI 인터페이스로 uvx/Python venv/Node.js 서버를 투명하게 호출 #polymorphism #abstraction
- [decision] @wong2(절차적) vs thedotmack(다형성) 설계 비교 후 다형성 선택 #design-philosophy #polymorphism
- [architecture] Memory 검색 + mcp-cli 실행 + 클린 아키텍처 조합으로 Progressive Disclosure 구현 #integration #clean-architecture
- [fact] 5단계 진화 (Phase 1: 한계 발견 → Phase 2: LazyToolLoader → Phase 3: 클린 아키텍처 → Phase 4: Tool-Hub → Phase 5: Chainer 흡수) #evolution #timeline
- [problem] Tool-Hub와 Tool-Chainer가 따로 놀아서 여러 도구 연결이 수동이었음 #integration #problem
- [decision] Tool-Hub가 Chainer 흡수 → toolhub_execute로 자동 체이닝 + Bash 이스케이핑 문제 해결 #chainer #automation
- [tech] Tool-Chainer의 핵심: CHAIN_RESULT 플레이스홀더로 이전 결과 자동 전달 + JSONPath 필터링 #chain-result #jsonpath
- [problem] 두 프로젝트 모두 의존성 주입 부재, 인프라 로직 혼재 → 통합 시 클린 아키텍처 적용 필요 #refactoring #clean-architecture