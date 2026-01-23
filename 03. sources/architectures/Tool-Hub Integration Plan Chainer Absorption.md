---
title: Tool-Hub Integration Plan Chainer Absorption
type: plan
permalink: architecture/tool-hub-integration-plan-chainer-absorption
tags:
- tool-hub
- tool-chainer
- integration
- progressive-loader
- mcp
extraction_status: pending
---

# Tool-Hub 통합 계획: Chainer 흡수

## 핵심 결정

[Tool-Hub] [will absorb] [Tool-Chainer]
[Knowledge Graph] [will inform] [자동 체인 생성]
[mcp-tool-chainer] [will become] [Deprecated]

---

## 배경

### 현재 문제
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

- `toolhub_cluster`가 관계 정보 반환하지만 활용 안 됨
- `tool-chainer`는 수동으로 체인 구성해야 함
- 두 프로젝트가 따로 놀고 있음

### 해결 방향
- Tool-Hub가 Chainer 로직 흡수
- Knowledge Graph 관계를 자동 체이닝에 활용
- 단일 MCP 서버로 통합

---

## 목표 상태

```
[Tool-Hub (통합)]
toolhub_search      ← 기존
toolhub_cluster     ← 기존 + suggestedChain 추가
toolhub_expand      ← 기존
toolhub_execute     ← 새로운 실행 도구
toolhub_register    ← 기존
toolhub_delete      ← 기존
toolhub_list        ← 기존

내부 모듈:
- ChainBuilder      ← 새로운 Knowledge Graph → mcpPath 변환
- ChainExecutor     ← Tool-Chainer 로직 이식
```

---

## 관계 타입별 체인 규칙

[관계 타입] [determines] [체인 순서와 역할]

| 관계 타입 | 체인 역할 | 예시 |
|-----------|----------|------|
| OUTPUTS_TO | 순차 실행 (A → B) | sqlite → pandas |
| REQUIRES | 선행 조건 (먼저 실행) | API 호출 전 인증 |
| WORKS_WITH | 병렬 가능 | 여러 데이터 소스 |
| BENEFITS_FROM | 선택적 포함 | 분석 전 구조 파악 |
| EXECUTABLE_VIA | 실행 도구 지정 | mcp-cli 사용 |

---

## 새 파일 구조

```
progressive-loader/src/
├── chain/
│   ├── types.ts             # ChainStep, ChainResult 타입
│   ├── ChainExecutor.ts     # 체인 순차 실행
│   └── ChainBuilder.ts      # Knowledge Graph → mcpPath 변환
├── types.ts                 # 기존 + 체인 타입 추가
├── index.ts                 # toolhub_execute 등록
└── ...
```

---

## toolhub_execute 스펙

[toolhub_execute] [is] [새로운 MCP 도구]

```typescript
{
  name: "toolhub_execute",
  description: "Execute a tool chain based on cluster results or manual mcpPath",
  inputSchema: {
    query: string,           // 자동 체인 생성용
    mcpPath?: ChainStep[],   // 수동 체인 지정 (선택)
    autoChain?: boolean      // true면 Knowledge Graph 기반 자동 생성
  }
}
```

### 실행 흐름
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

---

## 기대 효과

[통합] [achieves] [토큰 절감 + 안정성]

| 항목 | Before | After |
|------|--------|-------|
| 도구 발견 | toolhub_search | 동일 |
| 실행 방법 | Bash mcp-cli | toolhub_execute |
| 체인 구성 | 수동 | 자동 (Knowledge Graph) |
| 토큰 | ~850 + 결과 | ~650 + 결과 (20% 절감) |
| 파라미터 | Bash 문자열 (이스케이핑 필요) | JSON (안전) |

---

## 구현 Phase

| Phase | 내용 | 파일 |
|-------|------|------|
| 1 | ChainExecutor 이식 | `chain/types.ts`, `chain/ChainExecutor.ts` |
| 2 | ChainBuilder 구현 | `chain/ChainBuilder.ts` |
| 3 | toolhub_execute 추가 | `index.ts`, `ProgressiveLoader.ts` |
| 4 | cluster 확장 | `HybridSearchStrategy.ts` |
| 5 | 문서화 | README, deprecated 표시 |

---

## mcp-tool-chainer 처리

[mcp-tool-chainer] [status] [Deprecated]

- 프로젝트 삭제하지 않음
- README에 deprecated 표시
- Tool-Hub가 공식 실행 도구로 대체
- 로직 참조용으로 보관

---

## 관련 문서

[관련 문서] [includes] [아키텍처 분석]

| 문서 | 내용 |
|------|------|
| [[Tool-Hub & Tool-Chainer Architecture Analysis]] | 현재 구조 분석 |
| [[Tool-Hub Birth Background Claude Code to Progressive Disclosure]] | 역사적 맥락 |

## Observations

- [decision] Tool-Hub가 Tool-Chainer 흡수하여 단일 MCP 서버로 통합 #integration #consolidation
- [architecture] Knowledge Graph 관계 타입(OUTPUTS_TO, REQUIRES 등)으로 자동 체인 생성 #knowledge-graph #automation
- [tech] toolhub_execute로 자동 체이닝, 20% 토큰 절감 및 Bash 이스케이핑 문제 해결 #toolhub-execute #token-optimization
- [decision] mcp-tool-chainer는 Deprecated 처리, 로직 참조용 보관 #deprecated #backward-compatibility
- [pattern] 관계 타입별 체인 규칙 정의 (순차 실행, 선행 조건, 병렬 가능, 선택적 포함) #chain-rules #workflow