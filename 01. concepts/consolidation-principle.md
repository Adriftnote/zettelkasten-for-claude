---
title: Consolidation Principle
type: pattern
tags: [mcp, optimization, tool-management, efficiency]
permalink: knowledge/concepts/consolidation-principle
category: MCP/Tool
difficulty: intermediate
created: 2026-01-19
---

# Consolidation Principle

## 📖 개요

기능이 겹치거나 유사한 여러 도구를 하나로 통합하는 원칙입니다. 도구의 개수를 줄임으로써 모델의 선택지를 단순화하고, 토큰 사용량을 감소시키며, 유지보수 복잡도를 낮춥니다. "작지만 강력한 도구"를 지향합니다.

## 🎭 비유

주방 도구를 정리하는 것과 같습니다. 과일 깎기, 채소 깎기, 고기 썰기용 칼이 여러 개 있다면, 다용도 칼 하나로 통합하는 것이 더 효율적입니다. 칼이 적으면 꺼낼 것도 적고, 관리할 것도 적습니다.

## ✨ 특징

- **Functional Overlap Reduction**: 중복 기능 통합
- **Unified Interface**: 통합 도구는 하나의 일관된 인터페이스 제공
- **Token Efficiency**: 도구 정보 설명에 필요한 토큰 감소
- **Reduced Cognitive Load**: 사용자 입장에서 선택지 단순화
- **Easier Maintenance**: 유지보수할 도구 개수 감소

## 💡 예시

### 예시 1: 파일 작업 도구 통합

**통합 전 (5개 도구, 많은 설명 필요)**:
```
- readFile: 파일 읽기
- writeFile: 파일 쓰기
- deleteFile: 파일 삭제
- renameFile: 파일 이름 변경
- getFileInfo: 파일 정보 조회
```

**통합 후 (1개 도구, 간단한 설명)**:
```
- fileManager: 파일 조작
  - action: read, write, delete, rename, info
  - filePath: 대상 파일 경로
  - content: (write 시) 파일 내용
```

**모델의 관점**:
```javascript
// 통합 전: 도구 선택이 복잡
"지금 readFile을 써야 하나, getFileInfo를 써야 하나?"

// 통합 후: 도구 선택이 단순
"fileManager를 쓰고, action을 read로 설정하자"
```

### 예시 2: 데이터 조회 도구 통합

**통합 전 (4개 도구)**:
```javascript
const tools = [
  {
    name: 'querySQLDatabase',
    description: '관계형 DB 쿼리'
  },
  {
    name: 'queryNoSQLDatabase',
    description: 'NoSQL DB 쿼리'
  },
  {
    name: 'readCSVFile',
    description: 'CSV 파일 읽기'
  },
  {
    name: 'fetchAPI',
    description: 'REST API 호출'
  }
];
```

**통합 후 (1개 도구)**:
```javascript
const tool = {
  name: 'dataQuery',
  description: '다양한 소스에서 데이터 조회',
  parameters: {
    source: {
      type: 'enum',
      values: ['sql', 'nosql', 'csv', 'api'],
      description: '데이터 소스'
    },
    query: {
      type: 'string',
      description: 'SQL 쿼리 또는 API 엔드포인트'
    },
    format: {
      type: 'enum',
      values: ['json', 'table', 'raw']
    }
  },
  examples: [
    { source: 'sql', query: 'SELECT * FROM users' },
    { source: 'api', query: '/api/users?limit=10' },
    { source: 'csv', query: 'data.csv' }
  ]
};
```

### 예시 3: 통합 결정 기준

```javascript
class ConsolidationAnalyzer {
  analyzeTools(tools) {
    const consolidationCandidates = [];

    // 1. 기능 유사도 분석
    for (let i = 0; i < tools.length; i++) {
      for (let j = i + 1; j < tools.length; j++) {
        const similarity = this.calculateSimilarity(tools[i], tools[j]);

        if (similarity > 0.7) {  // 70% 이상 유사
          consolidationCandidates.push({
            tool1: tools[i].name,
            tool2: tools[j].name,
            similarity,
            reason: 'high_functional_overlap'
          });
        }
      }
    }

    // 2. 호출 패턴 분석
    for (const candidate of consolidationCandidates) {
      const coOccurrenceRate = this.analyzeCoOccurrence(
        candidate.tool1,
        candidate.tool2
      );

      if (coOccurrenceRate > 0.5) {  // 50% 이상 함께 호출
        candidate.consolidationPotential = 'high';
        candidate.reason += ' + frequently_used_together';
      }
    }

    return consolidationCandidates;
  }

  calculateSimilarity(tool1, tool2) {
    // 파라미터 유사도, 설명 유사도 등 비교
    const paramSimilarity = this.compareParameters(tool1, tool2);
    const descSimilarity = this.compareDescriptions(tool1, tool2);
    return (paramSimilarity + descSimilarity) / 2;
  }

  analyzeCoOccurrence(tool1Name, tool2Name) {
    // 사용 로그 분석: 두 도구가 같은 요청에서 얼마나 자주 호출되는가
    // (실제 구현은 로그 데이터 필요)
    return Math.random(); // 시뮬레이션
  }

  compareParameters(tool1, tool2) {
    // 파라미터 집합 비교
    return 0.8; // 시뮬레이션
  }

  compareDescriptions(tool1, tool2) {
    // 설명 텍스트 유사도
    return 0.6; // 시뮬레이션
  }
}

// 사용
const analyzer = new ConsolidationAnalyzer();
const tools = [
  { name: 'readFile', description: '파일 읽기' },
  { name: 'readJSON', description: 'JSON 파일 읽기' },
  { name: 'parseCSV', description: 'CSV 파일 파싱' },
  { name: 'visualizeData', description: '데이터 시각화' }
];

const candidates = analyzer.analyzeTools(tools);
candidates.forEach(c => {
  console.log(`${c.tool1} + ${c.tool2}: ${(c.similarity * 100).toFixed(0)}% 유사`);
});
```

### 예시 4: 단계별 통합 적용

```javascript
class ToolConsolidationStrategy {
  planConsolidation(tools) {
    console.log('=== 도구 통합 계획 ===\n');

    // 1단계: 명백한 중복 제거
    console.log('1단계: 명백한 중복 제거');
    console.log('  - getFileSize, getFileStats → getFileInfo로 통합');
    console.log('  - deleteAll, deleteSelected → delete(filter)로 통합\n');

    // 2단계: 유사 기능 그룹화
    console.log('2단계: 유사 기능 그룹화');
    console.log('  - readFile, writeFile → fileOperation(action)로 통합');
    console.log('  - querySQL, queryNoSQL → dataQuery(type)로 통합\n');

    // 3단계: 통합 도구 설계
    console.log('3단계: 통합 도구 설계');
    console.log('  Tool: fileOperation');
    console.log('    - action: read | write | delete | rename');
    console.log('    - filePath: string');
    console.log('    - content?: string (write시)\n');

    // 4단계: 토큰 절감 계산
    console.log('4단계: 토큰 절감 효과');
    const before = 8 * 50;  // 8개 도구 × 평균 50토큰
    const after = 3 * 100;  // 3개 통합 도구 × 평균 100토큰
    console.log(`  - 통합 전: ${before} 토큰`);
    console.log(`  - 통합 후: ${after} 토큰`);
    console.log(`  - 절감: ${before - after} 토큰 (${((1 - after/before) * 100).toFixed(0)}%)`);
  }
}

// 사용
const strategy = new ToolConsolidationStrategy();
strategy.planConsolidation([]);
```

## 🛠️ 해결/적용 방법

### 1단계: 도구 카탈로그 분석
- 모든 도구의 기능 목록화
- 기능 중복도 파악

### 2단계: 유사도 평가
```
높음: 80% 이상 → 반드시 통합
중간: 50-80% → 조건부 통합 (호출 패턴 고려)
낮음: 50% 이하 → 분리 유지
```

### 3단계: 통합 도구 설계
- 파라미터를 `action` 또는 `type` 열거형으로 통합
- 각 action의 고유 파라미터는 선택적으로 설정

### 4단계: 마이그레이션 계획
- 기존 호출 코드 업데이트
- 호환성 레이어 (선택)

### 5단계: 토큰 효율 검증
- 통합 전후 토큰 사용량 비교
- 모델의 선택 정확도 검증

## Relations

- part_of [[token-optimization-strategy|Token Optimization Strategy]] - tool consolidation component
- mitigates [[tool-discovery-pattern|Tool Discovery Pattern]] - reduces tools to discover
- mitigates [[dynamic-tool-fetching|Dynamic Tool Fetching]] - reduces tools to fetch
- mitigates [[lazy-tool-loader|LazyToolLoader Pattern]] - reduces tools to cache
- used_by [[hook-based-mcp-auto-activation|Hook-based MCP Auto-Activation]] - reduces hooks needed
