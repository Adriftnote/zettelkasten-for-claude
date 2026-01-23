---
title: Tool-Hub MCP Server 코드 리뷰
type: note
permalink: reviews/tool-hub-mcp-server-kodeu-ribyu
tags:
- code-review
- mcp
- tool-hub
- typescript
- improvement
extraction_status: pending
---

# Tool-Hub MCP Server 코드 리뷰

## 개요

- **프로젝트**: `/root/progressive-loader-mcp-server`
- **패키지명**: `tool-box-mcp`
- **버전**: 1.0.0
- **리뷰 일자**: 2026-01-12
- **리뷰 기준**: MCP Best Practices, mcp-builder 스킬

---

## 아키텍처 분석

### 파일 구조

```
src/
├── index.ts              # 메인 서버 (11개 도구 등록)
├── constants.ts          # 설정 상수
├── schemas/
│   └── input.ts          # Zod 스키마 정의
├── services/
│   ├── hybrid-search.ts  # Vector + Graph 통합 검색
│   ├── vector-search.ts  # ChromaDB 시맨틱 검색
│   ├── graph-search.ts   # Knowledge Graph 탐색
│   ├── tool-discovery.ts # MCP 도구 자동 발견
│   ├── transforms.ts     # 데이터 변환
│   └── types.ts          # 타입 정의
└── lib/progressive-loader/
    ├── chain/
    │   ├── ChainBuilder.ts   # 체인 구성
    │   └── ChainExecutor.ts  # 체인 실행
    └── types.ts
```

### 등록된 도구 (11개)

| 도구                    | 용도                 | readOnly | destructive |
| --------------------- | ------------------ | -------- | ----------- |
| toolhub_search        | 시맨틱 도구 검색          | ✅        | ❌           |
| toolhub_expand        | Knowledge Graph 확장 | ✅        | ❌           |
| toolhub_cluster       | 태스크용 도구 클러스터       | ✅        | ❌           |
| toolhub_register      | 도구 등록              | ❌        | ❌           |
| toolhub_delete        | 도구 삭제              | ❌        | ✅           |
| toolhub_list          | 등록 도구 목록           | ✅        | ❌           |
| toolhub_execute       | 체인 구조 생성           | ❌        | ❌           |
| toolhub_chain         | 체인 실행              | ❌        | ❌           |
| toolhub_discover      | 도구 재발견             | ✅        | ❌           |
| toolhub_chainable     | 체인 가능 도구 목록        | ✅        | ❌           |
| toolhub_prepare_chain | 체인 사전 분석           | ✅        | ❌           |

---

## ✅ 잘 된 부분

### 1. MCP SDK 활용
- `@modelcontextprotocol/sdk` 최신 버전 사용
- `structuredContent` 반환으로 타입 안전성 확보
- Tool Annotations 전체 적용

### 2. 스키마 설계
- Zod로 체계적인 입력 검증
- `ResponseFormat` enum으로 JSON/Markdown 지원
- `.strict()` 사용으로 unknown 필드 차단

### 3. 서비스 분리
- Hybrid Search = Vector + Graph 조합
- 관심사 분리 (검색, 그래프, 변환)
- Lazy initialization 패턴 (`ensureDiscoveryInitialized`)

### 4. 응답 설계
- 토큰 절감 통계 제공 (`savingsPercent`)
- Truncation 처리 (`CHARACTER_LIMIT`)
- Markdown 포맷터 함수 분리

---

## ⚠️ 개선 필요 사항

### 🔴 Critical (우선 해결)

#### 1. Python 스크립트 의존성
**위치**: `src/index.ts:494-527`, `src/index.ts:551-582`

```typescript
// 현재 (문제)
const command = `${PATHS.pythonPath} ${PATHS.registerScript} register '${data}'`;
execSync(command, ...);
```

**문제점**:
- Windows에서 `python3` 명령어 없음
- Shell injection 위험 (데이터에 따옴표 포함 시)
- 프로세스 생성 오버헤드

**해결책**:
```typescript
// TypeScript 네이티브 구현
import { ChromaClient } from 'chromadb';

async function registerTool(params: RegisterToolInput) {
  const client = new ChromaClient();
  const collection = await client.getOrCreateCollection('tools');
  await collection.add({
    ids: [params.name],
    documents: [params.description],
    metadatas: [{ type: params.type, ...params }]
  });
}
```

#### 2. JSON 파싱 미검증
**위치**: `src/index.ts:871-905` (toolhub_chain)

```typescript
// 현재 (문제) - toolArgs가 잘못된 JSON이면 런타임 에러
const steps = params.mcpPath.map(s => ({
  toolName: s.toolName,
  toolArgs: s.toolArgs,  // 검증 없음
  ...
}));
```

**해결책**:
```typescript
// 사전 검증 추가
for (const step of params.mcpPath) {
  try {
    JSON.parse(step.toolArgs);
  } catch (e) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: `Invalid JSON in toolArgs for "${step.toolName}": ${e.message}`
      }]
    };
  }
}
```

---

### 🟡 Important (중요)

#### 3. Tool Naming 불일치
**현재**: `toolhub_search`, `toolhub_expand`
**권장**: `tool_hub_search` (서비스명에 하이픈 → 언더스코어)

MCP Best Practice: `{service}_{action}_{resource}` 형식

#### 4. Pagination 미구현
**위치**: `src/index.ts:589-668` (toolhub_list)

```typescript
// 현재 - 전체 반환
let tools = result.tools;
if (params.type_filter !== 'all') {
  tools = tools.filter(...);
}
```

**해결책**:
```typescript
// 스키마 수정
export const ListToolsInputSchema = z.object({
  type_filter: z.enum([...]).default("all"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// 반환값
return {
  tools: tools.slice(offset, offset + limit),
  pagination: {
    total: tools.length,
    limit,
    offset,
    has_more: offset + limit < tools.length
  }
};
```

#### 5. 도구 역할 중복
- `toolhub_execute`: 체인 **구조만** 생성 (실행 안 함)
- `toolhub_chain`: 체인 **실행**

**혼란 요소**:
- `toolhub_execute`라는 이름이지만 실제로 실행하지 않음
- 사용자가 execute 호출 후 chain을 다시 호출해야 함

**해결책**:
- `toolhub_execute` → `toolhub_build_chain` 으로 이름 변경
- 또는 통합해서 `autoExecute: boolean` 옵션 추가

---

### 🟢 Nice to Have

#### 6. 에러 메시지 개선
**현재**:
```typescript
text: `Error searching tools: ${error.message}`
```

**권장** (actionable):
```typescript
text: `Error searching tools: ${error.message}

Troubleshooting:
- Check if ChromaDB is running
- Verify query is not empty
- Try a more specific search term`
```

#### 7. Tool Description에 Examples 추가
현재 description에 예시가 있지만, 별도 `examples` 필드 권장

#### 8. Health Check 엔드포인트
서비스 상태 확인용 도구 추가 권장:
```typescript
server.registerTool("toolhub_health", {
  description: "Check Tool Hub service status",
  ...
});
```

---

## 📋 세심히 봐야 할 부분

### 1. `src/services/tool-discovery.ts`
- MCP 서버 연결/해제 로직
- 타임아웃 처리 (60초)
- 에러 시 복구 메커니즘

### 2. `src/lib/progressive-loader/chain/ChainExecutor.ts`
- CHAIN_RESULT 플레이스홀더 치환 로직
- JSONPath 추출 정확성
- Transform 함수 동작

### 3. `src/services/hybrid-search.ts`
- Vector + Graph 결과 중복 제거
- 토큰 계산 정확성 (`AVG_TOKENS_PER_TOOL`)

### 4. Shell Command Injection
**위치**: `src/index.ts:497`
```typescript
const data = JSON.stringify(params);
const command = `... '${data.replace(/'/g, "'\\''")}'`;
```
- 현재 escape 처리 있으나, 근본적으로 execSync 제거 권장

---

## 📊 점수 요약

| 카테고리 | 점수 | 상세 |
|----------|------|------|
| 아키텍처 | 8/10 | 서비스 분리 깔끔, 타입 안전 |
| API 설계 | 7/10 | 일부 도구 역할 모호 |
| 에러 처리 | 6/10 | 기본 처리 O, actionable 부족 |
| 호환성 | 5/10 | Python 의존성 = Windows 문제 |
| 보안 | 6/10 | execSync 사용, injection 위험 |
| 문서화 | 7/10 | description 상세, examples 부족 |

**총점: 39/60 (65%) - Good, needs refinement**

---

## 다음 단계 (Action Items)

1. [ ] Python 스크립트 → TypeScript 네이티브 마이그레이션
2. [ ] toolArgs JSON 사전 검증 추가
3. [ ] toolhub_execute 이름 변경 또는 기능 통합
4. [ ] toolhub_list에 pagination 추가
5. [ ] 에러 메시지에 troubleshooting 가이드 추가
6. [ ] LSP 활성화 후 타입 검사 강화

---

## 관련 링크

- [MCP Best Practices](memory://skills/mcp-builder/reference/mcp_best_practices.md)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Tool Hub GitHub](https://github.com/user/progressive-loader-mcp-server)
