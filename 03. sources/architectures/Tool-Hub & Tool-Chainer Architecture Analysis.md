---
title: Tool-Hub & Tool-Chainer Architecture Analysis
type: note
permalink: architecture/tool-hub-tool-chainer-architecture-analysis
tags:
- architecture
- tool-hub
- tool-chainer
- clean-architecture
- refactoring
- mcp
extraction_status: pending
---

# Tool-Hub & Tool-Chainer 아키텍처 분석 문서

## 개요

[Tool-Hub] [is a] [MCP 서버]
[Tool-Chainer] [is a] [MCP 서버]
[Tool-Hub] [provides] [Progressive Disclosure - 선택적 도구 로딩]
[Tool-Chainer] [provides] [도구 체인 실행 - LLM 왕복 없는 파이프라인]

---

# Part 1: Tool-Hub (Progressive Loader)

## 1.1 프로젝트 개요

[Tool-Hub] [located at] [/root/projects/progressive-loader/]
[Tool-Hub] [achieves] [90% 토큰 절감]
[Tool-Hub] [combines] [Vector Search + Knowledge Graph]

**목적**: LLM 컨텍스트에 모든 도구(89개)를 로드하는 대신, 쿼리와 관련된 도구만 선택적으로 로드

---

## 1.2 현재 파일 구조

[Tool-Hub] [has structure] [Strategy 패턴 기반]

```
progressive-loader/
├── src/
│   ├── types.ts                    # 핵심 타입 정의
│   ├── index.ts                    # Public API exports
│   ├── ProgressiveLoader.ts        # 메인 진입점 클래스
│   ├── VectorSearchStrategy.ts     # ChromaDB 벡터 검색
│   ├── KnowledgeGraphStrategy.ts   # JSON 그래프 순회
│   ├── HybridSearchStrategy.ts     # Vector + Graph 조합
│   ├── UnifiedSearchStrategy.ts    # Claude-mem + Custom DB 통합
│   ├── AutoExecutor.ts             # mcp-cli 자동 실행
│   └── cli.ts                      # CLI 인터페이스
├── dist/                           # 컴파일된 JS
└── package.json
```

---

## 1.3 핵심 데이터 구조

### KnowledgeSource (도구 엔티티)
[KnowledgeSource] [is a] [핵심 엔티티]
[KnowledgeSource] [has fields] [name, type, description, similarity, metadata]

```typescript
interface KnowledgeSource {
  name: string;
  type: 'MCP_Server' | 'Skill' | 'Tool' | 'Command';
  description: string;
  similarity?: number;
  metadata?: { source?: string; id?: number; };
}
```

### Relation (도구 간 관계)
[Relation] [defines] [도구 간 의존성]
[Relation] [has types] [REQUIRES, WORKS_WITH, EXECUTABLE_VIA, OUTPUTS_TO, BENEFITS_FROM]

| 타입 | 의미 | 예시 |
|------|------|------|
| REQUIRES | 필수 의존성 | n8n-workflow-builder → n8n-node-templates |
| WORKS_WITH | 협력 관계 | sqlite_tiktok ↔ pandas-excel |
| EXECUTABLE_VIA | 실행 도구 | n8n-workflow-builder → mcp-cli |
| OUTPUTS_TO | 데이터 흐름 | sqlite_tiktok → pandas-excel |
| BENEFITS_FROM | 선택적 향상 | metabase-dashboard → 데이터-구조-파악 |

---

## 1.4 동작 방식

### 전체 흐름
[VectorSearchStrategy] [calls] [Python 래퍼 (search-tools.py)]
[VectorSearchStrategy] [queries] [ChromaDB]
[KnowledgeGraphStrategy] [traverses] [JSON Knowledge Graph via BFS]
[HybridSearchStrategy] [combines] [Vector 결과 + Graph 결과]

```
사용자 쿼리: "n8n 워크플로우 자동화"
        ↓
[1] VectorSearchStrategy → ChromaDB 의미 검색 → 상위 K개
        ↓
[2] KnowledgeGraphStrategy → BFS 의존성 순회 (depth=2)
        ↓
[3] HybridSearchStrategy → 병합 + 중복 제거
        ↓
결과: [n8n-workflow-builder, n8n-node-templates, n8n-expressions, mcp-cli]
토큰 절감: 89,000 → 4,000 (95.5%)
```

### Python 래퍼가 필요한 이유
[JavaScript ChromaDB] [limitation] [persistent mode 미지원]
[Python PersistentClient] [enables] [파일 직접 접근]

---

## 1.5 MCP 도구 명세

[toolhub_search] [purpose] [쿼리로 도구 검색]
[toolhub_expand] [purpose] [특정 도구의 의존성 확장]
[toolhub_cluster] [purpose] [쿼리에 필요한 전체 클러스터]
[toolhub_register] [purpose] [새 도구 등록]
[toolhub_delete] [purpose] [도구 삭제]
[toolhub_list] [purpose] [전체 도구 목록]

---

## 1.6 설계 결정

### Strategy 패턴
[Tool-Hub] [uses] [SearchStrategy 인터페이스]
[설계 이유] [enables] [새로운 검색 방식 추가 시 기존 코드 수정 불필요]

### Python 브릿지
[Tool-Hub] [uses] [Python 래퍼 스크립트]
[설계 이유] [enables] [기존 claude-mem의 ChromaDB 파일 재사용]

### JSON Knowledge Graph
[Tool-Hub] [stores] [entities + relations in JSON]
[설계 이유] [enables] [별도 DB 없이 파일 관리, 수동 편집 용이]

---

## 1.7 문제점

[Problem 1] [is] [의존성 직접 생성 - 생성자에서 new]
[Problem 1] [causes] [단위 테스트 시 Mock 주입 불가, 결합도 높음]

[Problem 2] [is] [Python 프로세스 스폰이 Strategy 내부]
[Problem 2] [causes] [테스트 어려움, 에러 핸들링 분산]

[Problem 3] [is] [파일 I/O가 생성자에서 동기 실행]
[Problem 3] [causes] [초기화 지연, 파일 없으면 즉시 크래시]

[Problem 4] [is] [에러 핸들링 불일치]
[Problem 4] [causes] [통합된 에러 처리 전략 없음]

[Problem 5] [is] [설정 하드코딩 (경로)]
[Problem 5] [causes] [환경별 설정 변경 어려움]

---

# Part 2: Tool-Chainer

## 2.1 프로젝트 개요

[Tool-Chainer] [located at] [/root/projects/mcp-tool-chainer/]
[Tool-Chainer] [uses] [CHAIN_RESULT 플레이스홀더]
[Tool-Chainer] [uses] [JSONPath 필터링]

**목적**: 여러 MCP 도구를 순차적으로 실행, LLM 왕복 없이 복잡한 워크플로우 실행

---

## 2.2 현재 파일 구조

[Tool-Chainer] [has structure] [단일 파일 441줄]

```
mcp-tool-chainer/
├── index.ts          # 441줄 단일 파일 (모든 로직)
├── dist/index.js     # 컴파일된 진입점
├── package.json
└── README.md
```

---

## 2.3 핵심 데이터 구조

### ChainStep (체인 단계)
[ChainStep] [defines] [도구 체인의 각 단계]

```typescript
interface ChainStep {
  toolName: string;       // 전체 도구 이름 (server_tool)
  toolArgs: string;       // JSON 문자열 (CHAIN_RESULT 포함 가능)
  inputPath?: string;     // 입력 필터 JSONPath
  outputPath?: string;    // 출력 필터 JSONPath
}
```

---

## 2.4 동작 방식

### 초기화 흐름
[startDiscovery] [discovers] [모든 MCP 서버의 도구 병렬 수집]
[startDiscovery] [stores] [tools 배열에 연결 정보 포함]

### 체인 실행 흐름
[chainTools] [executes] [도구를 순차적으로 실행]
[chainTools] [replaces] [CHAIN_RESULT를 이전 결과로 치환]
[chainTools] [filters] [JSONPath로 입출력 필터링]

```
[1] 도구 클라이언트 생성
[2] 이전 결과에 inputPath 적용
[3] CHAIN_RESULT 치환
[4] 도구 실행
[5] outputPath 적용
[6] 리소스 정리
```

### CHAIN_RESULT 치환 예시
```
케이스 1: 첫 번째 단계 → 치환 없음
케이스 2: "CHAIN_RESULT" → "실제결과값"
케이스 3: [CHAIN_RESULT] → [실제결과값]
```

---

## 2.5 MCP 도구 명세

[mcp_chain] [purpose] [도구 체인 실행]
[chainable_tools] [purpose] [발견된 도구 목록]
[discover_tools] [purpose] [도구 재발견]

---

## 2.6 설계 결정

### 단일 파일
[설계 결정] [was] [빠른 프로토타이핑]
[설계 이유] [was] [초기 개발 속도, 의존성 최소화]

### CHAIN_RESULT 플레이스홀더
[설계 결정] [was] [문자열 치환 방식]
[설계 이유] [was] [LLM이 이해하기 쉬움, 간단한 구현]

### JSONPath 필터링
[설계 결정] [was] [inputPath/outputPath]
[설계 이유] [was] [표준화된 문법, 유연한 데이터 접근]

### 매 실행마다 새 Client
[설계 결정] [was] [도구 실행마다 Client 생성/종료]
[설계 이유] [was] [리소스 누수 방지, 상태 격리]

---

## 2.7 문제점

[Problem 1] [is] [단일 파일에 모든 책임 (441줄)]
[Problem 1] [causes] [유지보수 어려움, 코드 탐색 어려움]

[Problem 2] [is] [전역 상태 (config, tools)]]
[Problem 2] [causes] [테스트 격리 어려움, 동시성 문제]

[Problem 3] [is] [전역 유틸리티 함수 (deepUnescape)]]
[Problem 3] [causes] [재사용 어려움, 테스트 어려움]

[Problem 4] [is] [인라인 JSONPath 처리 (30줄+)]]
[Problem 4] [causes] [함수 길이 증가, 재사용 불가]

[Problem 5] [is] [에러 핸들링 분산 (여러 try-catch)]]
[Problem 5] [causes] [일관성 없음, 에러 추적 어려움]

---

# Part 3: 공통 문제점 요약

[공통 문제] [includes] [의존성 주입 없음]
[공통 문제] [includes] [레이어 분리 부족]
[공통 문제] [includes] [인프라 로직 혼재]
[공통 문제] [includes] [테스트 어려움]
[공통 문제] [includes] [에러 핸들링 불일치]

| 문제 | Tool-Hub | Tool-Chainer |
|------|----------|--------------|
| 의존성 주입 없음 | ✅ 생성자에서 직접 생성 | ✅ 전역 변수 사용 |
| 레이어 분리 없음 | △ Strategy로 일부 분리 | ✅ 단일 파일 |
| 인프라 로직 혼재 | ✅ Python 스폰 내부 | ✅ MCP Client 혼재 |
| 테스트 어려움 | ✅ Mock 주입 불가 | ✅ 전역 상태 |
| 에러 핸들링 불일치 | ✅ | ✅ |

---

# Part 4: 클린 아키텍처 적용 방향

[Clean Architecture] [has layers] [Presentation, Application, Domain, Infrastructure]

## 목표 구조

```
┌─────────────────────────────────────┐
│  Presentation (MCP Server / CLI)    │  진입점만 담당
├─────────────────────────────────────┤
│  Application (Use Cases)            │  비즈니스 로직 오케스트레이션
├─────────────────────────────────────┤
│  Domain (Entities, Interfaces)      │  핵심 규칙, 외부 의존 없음
├─────────────────────────────────────┤
│  Infrastructure (Adapters)          │  DB, 외부 서비스, 파일 I/O
└─────────────────────────────────────┘
```

## 핵심 원칙
[의존성 역전] [means] [안쪽 레이어는 바깥쪽을 모름]
[인터페이스 분리] [means] [Domain에 인터페이스, Infrastructure에 구현]
[단일 책임] [means] [각 클래스는 하나의 이유로만 변경]

## 기대 효과
[Clean Architecture] [enables] [Mock 주입으로 단위 테스트 가능]
[Clean Architecture] [enables] [인프라 교체 시 비즈니스 로직 수정 불필요]
[Clean Architecture] [enables] [코드 탐색과 유지보수 용이]

## Observations

- [architecture] Tool-Hub는 Vector Search + Knowledge Graph로 93% 토큰 절감 달성 #tool-hub #token-optimization
- [pattern] Strategy 패턴으로 검색 방식 확장 가능 (Vector, Graph, Hybrid, Unified) #design-pattern #extensibility
- [tech] Python 브릿지로 ChromaDB persistent mode 우회 (JS 클라이언트 한계) #workaround #python
- [architecture] Tool-Chainer는 CHAIN_RESULT 플레이스홀더와 JSONPath 필터링으로 LLM 왕복 제거 #tool-chainer #workflow
- [decision] 두 프로젝트 모두 의존성 주입 부재, 인프라 로직 혼재로 클린 아키텍처 적용 필요 #refactoring #clean-architecture