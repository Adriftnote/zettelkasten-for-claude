---
title: Graceful Degradation
type: pattern
tags: [optimization, resilience, performance, fallback]
permalink: knowledge/concepts/graceful-degradation
category: Optimization
difficulty: intermediate
created: 2026-01-19
---

# Graceful Degradation

## 📖 개요

시스템 리소스가 부족하거나 최적의 조건이 아닐 때, 기능 손실을 최소화하면서 점진적으로 성능을 낮추는 패턴입니다. 완전 실패(catastrophic failure) 대신 점진적 품질 저하(graceful degradation)를 통해 사용자 경험을 유지합니다.

## 🎭 비유

자동차의 고장 상황과 같습니다. 에어백이 펼쳐질 수 없으면 안 펼쳐지는 대신, 브레이크는 계속 작동하고, 엔진이 멈추어도 조향은 가능하게 설계합니다. 완전히 멈추는 대신 최소한의 기능은 유지됩니다.

## ✨ 특징

- **Progressive Quality Reduction**: 단계별로 기능 축소
- **Maintained Usability**: 핵심 기능은 계속 작동
- **User Notification**: 성능 저하를 명확히 알림
- **Predictable Behavior**: 저하되는 방식이 일관적
- **No Catastrophic Failure**: 완전 실패는 회피

## 💡 예시

### 예시 1: 컨텍스트 크기 제한 시 우아한 저하

```javascript
class ContextManager {
  constructor(maxTokens = 8000) {
    this.maxTokens = maxTokens;
    this.currentTokens = 0;
    this.degradationStages = [];
  }

  planDegradation(context) {
    console.log('=== 우아한 성능 저하 계획 ===\n');

    const tokenCount = this.estimateTokens(context);
    this.currentTokens = tokenCount;

    // 6단계 성능 저하 전략
    this.degradationStages = [
      {
        name: '최적 상태',
        maxTokens: this.maxTokens * 1.0,
        quality: 'maximum',
        actions: ['전체 컨텍스트 사용', '상세 분석'],
        impact: '100%'
      },
      {
        name: '경미 저하',
        maxTokens: this.maxTokens * 0.9,
        quality: 'high',
        actions: ['최근 정보 우선', '오래된 세부사항 축약'],
        impact: '-5% 정확도'
      },
      {
        name: '중간 저하',
        maxTokens: this.maxTokens * 0.7,
        quality: 'medium',
        actions: ['관련 정보만 선택', '예시 일부 제거'],
        impact: '-15% 정확도'
      },
      {
        name: '현저한 저하',
        maxTokens: this.maxTokens * 0.5,
        quality: 'fair',
        actions: ['핵심만 유지', '다중 선택지 제공'],
        impact: '-30% 정확도'
      },
      {
        name: '심각한 저하',
        maxTokens: this.maxTokens * 0.3,
        quality: 'poor',
        actions: ['최소 기능만 제공', '사용자 확인 필수'],
        impact: '-50% 정확도'
      },
      {
        name: '최소 모드',
        maxTokens: this.maxTokens * 0.1,
        quality: 'minimal',
        actions: ['키워드만 사용', '추가 입력 요청'],
        impact: '제한된 기능'
      }
    ];

    // 현재 상황에 맞는 단계 결정
    const currentStage = this.determineCurrentStage(tokenCount);

    console.log(`컨텍스트: ${tokenCount} 토큰 (제한: ${this.maxTokens})`);
    console.log(`현재 단계: ${currentStage.name}`);
    console.log(`품질 수준: ${currentStage.quality}`);
    console.log(`성능 영향: ${currentStage.impact}\n`);

    console.log('조치 사항:');
    currentStage.actions.forEach((action, idx) => {
      console.log(`  ${idx + 1}. ${action}`);
    });

    return currentStage;
  }

  determineCurrentStage(tokenCount) {
    for (let i = this.degradationStages.length - 1; i >= 0; i--) {
      if (tokenCount <= this.degradationStages[i].maxTokens) {
        return this.degradationStages[i];
      }
    }
    return this.degradationStages[0];
  }

  estimateTokens(context) {
    return Math.ceil((context.length || 0) / 4 * 1.3);
  }
}

// 사용
const contextMgr = new ContextManager(8000);

// 다양한 크기의 컨텍스트 테스트
const contexts = [
  'a'.repeat(32000),   // 10400 토큰
  'a'.repeat(24000),   // 7800 토큰
  'a'.repeat(16000),   // 5200 토큰
  'a'.repeat(8000)     // 2600 토큰
];

contexts.forEach(ctx => {
  contextMgr.planDegradation(ctx);
  console.log('\n---\n');
});
```

### 예시 2: 도구 가용성에 따른 저하

```javascript
class ToolAvailabilityHandler {
  constructor() {
    this.tools = {
      database: { available: true, importance: 'critical' },
      cache: { available: true, importance: 'high' },
      visualization: { available: true, importance: 'medium' },
      externalAPI: { available: true, importance: 'low' }
    };
  }

  handleToolFailure(toolName) {
    console.log(`⚠️ 도구 실패: ${toolName}\n`);

    this.tools[toolName].available = false;
    const strategy = this.selectDegradationStrategy();

    console.log(`선택된 전략:\n`);
    strategy.forEach((action, idx) => {
      console.log(`${idx + 1}. ${action}`);
    });

    return strategy;
  }

  selectDegradationStrategy() {
    const unavailableTools = Object.entries(this.tools)
      .filter(([_, status]) => !status.available)
      .map(([name, _]) => name);

    const strategy = [];

    // 중요도에 따른 우아한 저하
    if (unavailableTools.includes('database')) {
      strategy.push('메모리 캐시에서 조회 시도');
      strategy.push('최근 쿼리 결과 사용');
      strategy.push('사용자에게 데이터 신선도 경고');
    }

    if (unavailableTools.includes('cache')) {
      strategy.push('각 요청마다 데이터베이스 직접 쿼리');
      strategy.push('응답 시간 증가 경고');
    }

    if (unavailableTools.includes('visualization')) {
      strategy.push('텍스트 기반 데이터 제공');
      strategy.push('테이블 형식으로 표시');
    }

    if (unavailableTools.includes('externalAPI')) {
      strategy.push('내부 데이터만으로 답변');
      strategy.push('외부 정보 필요시 사용자에게 요청');
    }

    strategy.push('핵심 기능: 계속 제공');

    return strategy;
  }

  getSystemStatus() {
    console.log('\n=== 시스템 상태 ===\n');

    for (const [tool, status] of Object.entries(this.tools)) {
      const indicator = status.available ? '✓' : '✗';
      console.log(`${indicator} ${tool} (${status.importance})`);
    }

    const unavailable = Object.values(this.tools).filter(t => !t.available).length;
    const operationalLevel = ((Object.keys(this.tools).length - unavailable) /
                              Object.keys(this.tools).length * 100).toFixed(0);

    console.log(`\n운영 레벨: ${operationalLevel}%`);
  }
}

// 사용
const toolHandler = new ToolAvailabilityHandler();
toolHandler.getSystemStatus();

// 데이터베이스 실패 시뮬레이션
console.log('\n---\n');
toolHandler.handleToolFailure('database');

console.log('\n---\n');
toolHandler.getSystemStatus();
```

### 예시 3: 메모리 부족 시 우아한 저하

```javascript
class MemoryAwareOptimizer {
  constructor(totalMemory = 16000) {
    this.totalMemory = totalMemory;  // MB
    this.usedMemory = 0;
    this.modes = [];
  }

  initializeModes() {
    this.modes = [
      {
        name: 'Full Mode',
        memoryThreshold: 0.0,
        kvCache: 'complete',
        batchSize: 32,
        contextLength: 8192,
        optimization: 'maximum'
      },
      {
        name: 'Balanced Mode',
        memoryThreshold: 0.6,
        kvCache: 'sliding',
        batchSize: 16,
        contextLength: 4096,
        optimization: 'moderate'
      },
      {
        name: 'Efficient Mode',
        memoryThreshold: 0.8,
        kvCache: 'sparse',
        batchSize: 8,
        contextLength: 2048,
        optimization: 'aggressive'
      },
      {
        name: 'Minimal Mode',
        memoryThreshold: 0.95,
        kvCache: 'none',
        batchSize: 1,
        contextLength: 512,
        optimization: 'extreme'
      }
    ];
  }

  checkMemoryAndAdapt(currentUsage) {
    this.usedMemory = currentUsage;
    const memoryRatio = currentUsage / this.totalMemory;

    console.log(`메모리 사용: ${currentUsage}/${this.totalMemory} MB (${(memoryRatio * 100).toFixed(1)}%)\n`);

    let selectedMode = this.modes[0];

    for (const mode of this.modes) {
      if (memoryRatio >= mode.memoryThreshold) {
        selectedMode = mode;
      }
    }

    console.log(`선택된 모드: ${selectedMode.name}\n`);
    console.log(`설정:`);
    console.log(`  KV-Cache: ${selectedMode.kvCache}`);
    console.log(`  배치 크기: ${selectedMode.batchSize}`);
    console.log(`  컨텍스트 길이: ${selectedMode.contextLength}`);
    console.log(`  최적화 수준: ${selectedMode.optimization}`);

    if (memoryRatio > 0.9) {
      console.log(`\n경고: 메모리가 위험 수준입니다!`);
      console.log(`권장사항: 불필요한 도구 언로드 또는 세션 종료`);
    }

    return selectedMode;
  }
}

// 사용
const memoryOptimizer = new MemoryAwareOptimizer(16000);
memoryOptimizer.initializeModes();

const memoryScenarios = [5000, 9600, 12800, 15200];

memoryScenarios.forEach(usage => {
  memoryOptimizer.checkMemoryAndAdapt(usage);
  console.log('\n---\n');
});
```

### 예시 4: 응답 품질 다단계 전략

```javascript
class ResponseQualityStrategy {
  selectStrategy(qualityBudget) {
    // qualityBudget: 0-1 범위 (1 = 최고 품질)

    if (qualityBudget >= 0.9) {
      return {
        level: 'Premium',
        examples: 5,
        explanations: 'detailed',
        alternatives: 3,
        citations: 'complete',
        formatting: 'rich'
      };
    } else if (qualityBudget >= 0.7) {
      return {
        level: 'Standard',
        examples: 3,
        explanations: 'moderate',
        alternatives: 2,
        citations: 'basic',
        formatting: 'simple'
      };
    } else if (qualityBudget >= 0.5) {
      return {
        level: 'Basic',
        examples: 1,
        explanations: 'brief',
        alternatives: 1,
        citations: 'minimal',
        formatting: 'plain'
      };
    } else {
      return {
        level: 'Minimal',
        examples: 0,
        explanations: 'none',
        alternatives: 0,
        citations: 'none',
        formatting: 'text-only'
      };
    }
  }

  demonstrateQualityLevels() {
    console.log('=== 응답 품질 수준 ===\n');

    const budgets = [1.0, 0.8, 0.6, 0.3];

    budgets.forEach(budget => {
      const strategy = this.selectStrategy(budget);
      console.log(`품질 예산: ${(budget * 100).toFixed(0)}%`);
      console.log(`수준: ${strategy.level}`);
      console.log(`  예시: ${strategy.examples}개`);
      console.log(`  설명: ${strategy.explanations}`);
      console.log(`  인용: ${strategy.citations}`);
      console.log('');
    });
  }
}

// 사용
const qualityStrategy = new ResponseQualityStrategy();
qualityStrategy.demonstrateQualityLevels();
```

## 🛠️ 해결/적용 방법

### 1단계: 임계값 정의
```
- 리소스별 임계값 설정 (메모리, CPU, 컨텍스트 등)
- 각 저하 단계에서의 행동 정의
```

### 2단계: 저하 전략 수립
```
우선순위: 핵심 기능 > 보조 기능 > 부가 기능
- 어떤 기능부터 줄일지 결정
```

### 3단계: 사용자 통지
```
- 저하된 상태임을 명확히 알림
- 일시적인지 영구적인지 표시
- 복구 방법 제시
```

### 4단계: 단계별 구현
```
1. 정보 수집 (현재 리소스 상태)
2. 위험도 평가
3. 적절한 저하 수준 선택
4. 조치 실행
```

### 5단계: 모니터링 및 복구
- 리소스 상태 지속 추적
- 정상 상태 복구 시 즉시 상향

## Relations

- used_by [[token-optimization-strategy|Token Optimization Strategy]] - applies in token-constrained scenarios
- mitigates [[context-poisoning|Context Poisoning]] - recovers through graceful session degradation
- mitigates [[context-confusion|Context Confusion]] - applies through explicit session boundaries
- mitigates [[context-clash|Context Clash]] - applies through flexible requirement adjustment
- relates_to [[anchored-iterative-summarization|Anchored Iterative Summarization]] - both compress with quality preservation
