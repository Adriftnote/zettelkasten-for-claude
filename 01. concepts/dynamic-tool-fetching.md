---
title: Dynamic Tool Fetching
type: pattern
tags: [mcp, tool-management, runtime, flexibility]
permalink: knowledge/concepts/dynamic-tool-fetching
category: MCP/Tool
difficulty: intermediate
created: 2026-01-19
---

# Dynamic Tool Fetching

## 📖 개요

런타임 중에 모델의 요청이나 컨텍스트에 따라 필요한 도구를 동적으로 로드하고 활성화하는 패턴입니다. 정적 도구 목록 대신 현재 상황에 맞는 도구 집합을 구성하여 유연성과 효율성을 동시에 달성합니다.

## 🎭 비유

요리사가 미리 모든 도구를 준비하지 않고, 오늘의 메뉴에 따라 필요한 도구만 준비하는 것입니다. 프렌치 요리를 할 때는 프렌치 칼을 꺼내고, 중식 요리 때는 웍을 꺼냅니다. 필요없는 도구를 준비하지 않아 작업 공간이 효율적입니다.

## ✨ 특징

- **Context-Aware Loading**: 사용자 입력과 상황에 따라 도구 선택
- **Runtime Configuration**: 런타임 중 도구 집합 변경 가능
- **Flexible Tool Sets**: 역할(role)이나 작업 유형에 따른 도구 그룹핑
- **Reduced Overhead**: 불필요한 도구 로드 방지
- **Adaptive Behavior**: 사용 패턴에 따른 자동 최적화

## 💡 예시

### 예시 1: 역할 기반 도구 로드

```javascript
const toolGroups = {
  analyst: [
    'dataQuery',      // DB 쿼리
    'csvParser',      // CSV 분석
    'visualizer'      // 그래프 생성
  ],
  developer: [
    'codeCompiler',   // 코드 컴파일
    'debugger',       // 디버깅
    'gitClient'       // Git 작업
  ],
  writer: [
    'spellCheck',     // 맞춤법
    'thesaurus',      // 유의어 검색
    'formatter'       // 포맷팅
  ]
};

class DynamicToolManager {
  async fetchToolsForRole(role) {
    const toolNames = toolGroups[role] || [];
    const tools = [];

    for (const toolName of toolNames) {
      tools.push(await this.loadTool(toolName));
    }

    return tools;
  }

  async loadTool(toolName) {
    console.log(`[동적 로드] ${toolName}`);
    // 도구 로드 로직
    return require(`./tools/${toolName}`);
  }
}

// 사용
const manager = new DynamicToolManager();
const analystTools = await manager.fetchToolsForRole('analyst');
// [동적 로드] dataQuery
// [동적 로드] csvParser
// [동적 로드] visualizer
```

### 예시 2: 사용자 입력 기반 도구 선택

```javascript
async function fetchToolsByIntent(userInput) {
  const intent = analyzeIntent(userInput);

  const toolMappings = {
    'database-query': ['sqlExecutor', 'queryOptimizer'],
    'file-operation': ['fileReader', 'fileWriter', 'fileAnalyzer'],
    'api-call': ['httpClient', 'authManager', 'responseValidator'],
    'data-transformation': ['csvParser', 'jsonParser', 'transformer']
  };

  const toolNames = toolMappings[intent] || [];
  return await Promise.all(
    toolNames.map(name => loadTool(name))
  );
}

// 사용
const tools1 = await fetchToolsByIntent('CSV 파일에서 데이터를 읽어줘');
// ['csvParser']

const tools2 = await fetchToolsByIntent('데이터베이스에서 모든 사용자를 조회해줘');
// ['sqlExecutor', 'queryOptimizer']
```

### 예시 3: 점진적 도구 확장

```javascript
class ProgressiveToolLoader {
  constructor() {
    this.baseTool = null;
    this.extensionTools = [];
  }

  async initialize(primaryTask) {
    // 1단계: 기본 도구만 로드
    this.baseTool = await this.loadTool('core');
    console.log('기본 도구 준비 완료');

    // 2단계: 작업 분석
    const extensions = await this.analyzeRequiredExtensions(primaryTask);

    // 3단계: 필요한 확장 도구만 로드
    this.extensionTools = await Promise.all(
      extensions.map(ext => this.loadTool(ext))
    );
    console.log(`추가 도구 ${extensions.length}개 로드`);

    return { base: this.baseTool, extensions: this.extensionTools };
  }

  async analyzeRequiredExtensions(task) {
    // task 분석 후 필요한 도구 목록 반환
    if (task.includes('visualization')) return ['visualizer', 'chartLib'];
    if (task.includes('machine-learning')) return ['mlModel', 'sklearn'];
    return [];
  }

  async loadTool(toolName) {
    // 도구 로드 시뮬레이션
    return new Promise(resolve => {
      setTimeout(() => resolve(`[${toolName}]`), 100);
    });
  }
}

// 사용
const loader = new ProgressiveToolLoader();
await loader.initialize('데이터 시각화 및 머신러닝 분석');
// 기본 도구 준비 완료
// 추가 도구 3개 로드
```

## 🛠️ 해결/적용 방법

### 1단계: 도구 분류
- 역할별, 작업 유형별, 우선순위별로 도구 그룹핑
- 기본 도구와 선택 도구 구분

### 2단계: 의도 분석 로직
- 사용자 입력에서 필요한 도구 유형 판단
- 키워드, 패턴, NLP 기반 분석

### 3단계: 동적 로딩 구현
```
intent 분석 → 필요한 도구 목록 결정 → 도구 로드 → 반환
```

### 4단계: 성능 최적화
- 도구 로드 병렬화
- 자주 사용되는 조합은 사전 로드

### 5단계: 캐싱 전략
- 로드된 도구 캐시 유지
- 메모리 vs 성능 트레이드오프 관리

## Relations

- relates_to [[lazy-tool-loader|LazyToolLoader Pattern]] - both defer tool initialization
- used_by [[hook-based-mcp-auto-activation|Hook-based MCP Auto-Activation]] - fetches activated tools
- mitigates_by [[tool-discovery-pattern|Tool Discovery Pattern]] - discovers available tools
- mitigates_by [[consolidation-principle|Consolidation Principle]] - reduces tool set needed
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - loads only needed tools

