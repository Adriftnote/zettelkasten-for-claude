---
title: Hook-based MCP Auto-Activation
type: pattern
tags: [mcp, automation, trigger, activation]
permalink: knowledge/concepts/hook-based-mcp-auto-activation
category: MCP/Tool
difficulty: intermediate
created: 2026-01-19
---

# Hook-based MCP Auto-Activation

## 📖 개요

사용자의 입력에서 특정 키워드나 패턴을 감지하여 자동으로 관련 MCP(Model Context Protocol) 도구를 활성화하는 패턴입니다. "훅(hook)"은 트리거 지점을 의미하며, 특정 조건이 만족되면 자동으로 도구가 로드되고 실행됩니다.

## 🎭 비유

자동 문과 같습니다. 사람이 접근하면(키워드 감지) 문이 자동으로 열립니다(도구 활성화). 사람이 수동으로 문을 열 필요가 없습니다. 특정 조건(접근 거리)이 만족되면 자동 반응합니다.

## ✨ 특징

- **Keyword Detection**: 사용자 입력의 키워드를 감지
- **Automatic Activation**: 조건 만족 시 도구 자동 활성화
- **Zero Manual Configuration**: 사용자는 도구를 명시적으로 요청할 필요 없음
- **Contextual Triggering**: 상황에 맞는 정확한 도구만 활성화
- **Event-driven Architecture**: 이벤트 기반 도구 관리

## 💡 예시

### 예시 1: 키워드 기반 훅

```javascript
const hooks = {
  fileOperations: {
    keywords: ['파일', 'file', '읽기', 'read', '쓰기', 'write'],
    tools: ['fileReader', 'fileWriter', 'fileAnalyzer'],
    priority: 'high'
  },
  database: {
    keywords: ['데이터베이스', 'database', 'DB', 'SQL', 'query'],
    tools: ['sqlExecutor', 'queryOptimizer', 'schemaInspector'],
    priority: 'high'
  },
  webBrowsing: {
    keywords: ['웹', 'web', 'URL', 'http', '검색', 'search'],
    tools: ['webScraper', 'httpClient', 'linkValidator'],
    priority: 'medium'
  },
  dataVisualization: {
    keywords: ['시각화', 'visualization', '그래프', 'chart', 'plot'],
    tools: ['chartGenerator', 'dataPlotter', 'reportBuilder'],
    priority: 'low'
  }
};

class HookBasedActivator {
  async detectAndActivate(userInput) {
    const detectedHooks = this.detectKeywords(userInput);
    const toolsToActivate = [];

    // 우선순위가 높은 훅부터 처리
    const sortedHooks = detectedHooks.sort(
      (a, b) => this.getPriority(b) - this.getPriority(a)
    );

    for (const hookName of sortedHooks) {
      const hook = hooks[hookName];
      toolsToActivate.push(...hook.tools);
      console.log(`[훅 활성화] ${hookName}: ${hook.tools.join(', ')}`);
    }

    return await this.activateTools(toolsToActivate);
  }

  detectKeywords(userInput) {
    const detectedHooks = [];
    const lowerInput = userInput.toLowerCase();

    for (const [hookName, hookConfig] of Object.entries(hooks)) {
      if (hookConfig.keywords.some(kw => lowerInput.includes(kw))) {
        detectedHooks.push(hookName);
      }
    }

    return detectedHooks;
  }

  getPriority(hookName) {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return priorityMap[hooks[hookName].priority] || 0;
  }

  async activateTools(toolNames) {
    const activated = [];
    for (const toolName of toolNames) {
      activated.push(await this.loadTool(toolName));
    }
    return activated;
  }

  async loadTool(toolName) {
    return `[로드됨: ${toolName}]`;
  }
}

// 사용
const activator = new HookBasedActivator();
await activator.detectAndActivate('CSV 파일을 읽어서 데이터베이스에 저장해줘');
// [훅 활성화] fileOperations: fileReader,fileWriter,fileAnalyzer
// [훅 활성화] database: sqlExecutor,queryOptimizer,schemaInspector
```

### 예시 2: 패턴 기반 훅

```javascript
const patternHooks = [
  {
    pattern: /^create.*table/i,
    tools: ['sqlExecutor', 'schemaValidator'],
    description: 'SQL CREATE TABLE 명령'
  },
  {
    pattern: /plot|chart|visualize/i,
    tools: ['dataVisualizer', 'chartLibrary'],
    description: '데이터 시각화'
  },
  {
    pattern: /deploy|push|release/i,
    tools: ['gitClient', 'deploymentManager', 'cicdPipeline'],
    description: 'CI/CD 배포'
  }
];

class PatternHookActivator {
  async activateByPattern(userInput) {
    for (const hook of patternHooks) {
      if (hook.pattern.test(userInput)) {
        console.log(`[패턴 일치] ${hook.description}`);
        await this.activateTools(hook.tools);
      }
    }
  }

  async activateTools(toolNames) {
    for (const toolName of toolNames) {
      console.log(`  → ${toolName} 활성화`);
    }
  }
}

// 사용
const patternActivator = new PatternHookActivator();
await patternActivator.activateByPattern('테이블을 CREATE하고 데이터를 INSERT해');
// [패턴 일치] SQL CREATE TABLE 명령
//   → sqlExecutor 활성화
//   → schemaValidator 활성화
```

### 예시 3: 상태 기반 훅

```javascript
class StatefulHookActivator {
  constructor() {
    this.sessionState = {
      currentProject: null,
      activeTools: [],
      context: {}
    };
  }

  registerStateHooks() {
    this.hooks = {
      projectInitialization: {
        condition: (state) => state.currentProject === null &&
                              this.inputContains(['new project', '프로젝트 생성']),
        tools: ['projectGenerator', 'configCreator'],
        onActivate: (state) => {
          state.currentProject = 'new_project_001';
        }
      },
      developmentMode: {
        condition: (state) => state.currentProject !== null &&
                              this.inputContains(['개발', 'develop', 'code']),
        tools: ['codeEditor', 'debugger', 'testRunner'],
        onActivate: (state) => {
          state.activeTools = ['codeEditor', 'debugger'];
        }
      },
      deploymentMode: {
        condition: (state) => state.currentProject !== null &&
                              this.inputContains(['배포', 'deploy', 'release']),
        tools: ['buildTool', 'deploymentManager', 'monitoringTool'],
        onActivate: (state) => {
          state.activeTools = ['deploymentManager'];
        }
      }
    };
  }

  async processWithStateHooks(userInput) {
    this.currentInput = userInput;

    for (const [hookName, hook] of Object.entries(this.hooks)) {
      if (hook.condition(this.sessionState)) {
        console.log(`[상태 훅 활성화] ${hookName}`);
        await this.activateTools(hook.tools);
        hook.onActivate(this.sessionState);
      }
    }
  }

  inputContains(keywords) {
    const lower = this.currentInput.toLowerCase();
    return keywords.some(kw => lower.includes(kw));
  }

  async activateTools(toolNames) {
    for (const toolName of toolNames) {
      console.log(`  → ${toolName}`);
    }
  }
}

// 사용
const stateActivator = new StatefulHookActivator();
stateActivator.registerStateHooks();
await stateActivator.processWithStateHooks('새로운 프로젝트를 생성해줘');
// [상태 훅 활성화] projectInitialization
//   → projectGenerator
//   → configCreator
```

## 🛠️ 해결/적용 방법

### 1단계: 훅 정의
- 각 MCP 도구에 대한 키워드/패턴 목록 작성
- 훅의 우선순위 설정

### 2단계: 감지 로직 구현
```
키워드/패턴 매칭 → 훅 식별 → 도구 목록 추출
```

### 3단계: 활성화 메커니즘
- 감지된 훅에 해당하는 도구 로드
- 중복 방지

### 4단계: 상태 관리 (선택)
- 세션 상태 추적
- 상태 변화에 따른 훅 동적 조정

### 5단계: 모니터링 및 개선
- 훅 활성화 로그 기록
- 오탐지(false positive) 모니터링

## Relations

- triggers [[dynamic-tool-fetching|Dynamic Tool Fetching]] - activates conditional tool loading
- uses [[tool-discovery-pattern|Tool Discovery Pattern]] - searches for tools to activate
- used_by [[lazy-tool-loader|LazyToolLoader Pattern]] - caches activated tools
- mitigates_by [[consolidation-principle|Consolidation Principle]] - reduces hooks needed
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - avoids loading unnecessary tools

