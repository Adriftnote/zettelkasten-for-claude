---
title: KV-Cache Optimization
type: pattern
tags: [optimization, cache, performance, inference]
permalink: knowledge/concepts/kv-cache-optimization
category: Optimization
difficulty: advanced
created: 2026-01-19
---

# KV-Cache Optimization

## 📖 개요

트랜스포머 모델의 추론 과정에서 Key-Value(KV) [[Cache|캐시]]를 효율적으로 활용하여 계산량과 메모리 사용량을 줄이는 최적화 기법입니다. 반복 토큰 생성 중에 이미 계산된 [[Attention|어텐션]] 값을 [[VRAM]]에 저장하고 재사용함으로써 성능을 향상시킵니다.

## 🎭 비유

학생이 이전 학년의 필기를 다시 보는 것과 같습니다. 새로운 개념을 배울 때마다 처음부터 모든 기초를 다시 설명할 필요 없이, 이미 학습한 내용을 참고하여 빠르게 진행합니다. 캐시는 그 "이미 정리된 필기"입니다.

## ✨ 특징

- **Reusable Computation**: 이전 토큰의 어텐션 계산 결과 재사용
- **Reduced Latency**: 각 토큰 생성 시간 단축
- **Memory Trade-off**: 메모리를 더 사용하여 계산 시간 절약
- **Linear Complexity**: KV 길이에 선형 관계 (원래는 제곱)
- **Automatic Mechanism**: 모델 추론 시 자동으로 작동

## 💡 예시

### 예시 1: KV-Cache의 기본 원리

```javascript
class KVCacheOptimization {
  // KV-Cache 없을 때: O(n²) 복잡도
  naiveAttention(query, keyValue) {
    console.log('KV-Cache 없음');
    const seqLen = keyValue.length;
    let computations = 0;

    for (let i = 0; i < seqLen; i++) {
      // 새로운 토큰 생성 시마다 모든 이전 토큰과 계산
      computations += seqLen;
    }

    return computations;
  }

  // KV-Cache 있을 때: O(n) 복잡도
  cachedAttention(query, keyValueCache) {
    console.log('KV-Cache 활용');
    const seqLen = keyValueCache.length;
    let computations = 0;

    for (let i = 0; i < seqLen; i++) {
      // 캐시된 이전 KV를 재사용, 새 토큰하고만 계산
      computations += 1;
    }

    return computations;
  }

  demonstrateImprovement() {
    console.log('\n=== KV-Cache 성능 개선 ===\n');

    const sequenceLengths = [100, 500, 1000, 2000];

    for (const seqLen of sequenceLengths) {
      const naive = this.naiveAttention(null, new Array(seqLen));
      const cached = this.cachedAttention(null, new Array(seqLen));

      const speedup = (naive / cached).toFixed(1);
      console.log(`길이 ${seqLen}: ${speedup}배 빠름`);
      console.log(`  계산량: ${naive} → ${cached}\n`);
    }
  }
}

// 사용
const kvCache = new KVCacheOptimization();
kvCache.demonstrateImprovement();

// 출력:
// =========================
// 길이 100: 100.0배 빠름
//   계산량: 10000 → 100
// 길이 500: 500.0배 빠름
//   계산량: 250000 → 500
// 길이 1000: 1000.0배 빠름
//   계산량: 1000000 → 1000
// 길이 2000: 2000.0배 빠름
//   계산량: 4000000 → 2000
```

### 예시 2: 동적 KV-Cache 크기 조정

```javascript
class DynamicKVCacheManager {
  constructor(maxCacheSize = 8192) {
    this.maxCacheSize = maxCacheSize;
    this.cache = {
      keys: [],
      values: [],
      tokenIndices: []
    };
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  addToken(token, attention) {
    // 캐시 크기 확인
    if (this.cache.keys.length >= this.maxCacheSize) {
      this.evictOldest();
    }

    // 새 토큰의 KV 저장
    this.cache.keys.push(attention.key);
    this.cache.values.push(attention.value);
    this.cache.tokenIndices.push(token.index);
  }

  evictOldest() {
    // 오래된 토큰의 KV 제거 (LRU)
    this.cache.keys.shift();
    this.cache.values.shift();
    this.cache.tokenIndices.shift();
    this.stats.evictions++;
  }

  getAttention(tokenIndex) {
    // 캐시에서 검색
    const idx = this.cache.tokenIndices.indexOf(tokenIndex);

    if (idx !== -1) {
      this.stats.hits++;
      return {
        key: this.cache.keys[idx],
        value: this.cache.values[idx]
      };
    }

    this.stats.misses++;
    return null;
  }

  getHitRate() {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : (this.stats.hits / total) * 100;
  }

  getReport() {
    console.log('\n=== KV-Cache 성능 보고서 ===');
    console.log(`히트율: ${this.getHitRate().toFixed(1)}%`);
    console.log(`캐시 히트: ${this.stats.hits}`);
    console.log(`캐시 미스: ${this.stats.misses}`);
    console.log(`제거된 항목: ${this.stats.evictions}`);
    console.log(`현재 캐시 크기: ${this.cache.keys.length}/${this.maxCacheSize}`);

    const tokensSaved = this.stats.hits;
    const estimatedTimeSaved = tokensSaved * 0.05;  // 토큰당 50ms 절감
    console.log(`\n추정 시간 절감: ${estimatedTimeSaved.toFixed(1)}초`);
  }
}

// 사용
const manager = new DynamicKVCacheManager(100);

// 토큰 생성 시뮬레이션
for (let i = 0; i < 50; i++) {
  manager.addToken(
    { index: i },
    {
      key: `key_${i}`,
      value: `value_${i}`
    }
  );

  // 주기적으로 이전 토큰 재사용
  if (Math.random() > 0.3) {
    manager.getAttention(Math.floor(Math.random() * i));
  }
}

manager.getReport();
```

### 예시 3: 적응형 캐시 전략

```javascript
class AdaptiveKVCacheStrategy {
  constructor() {
    this.strategies = {
      full: {
        name: '전체 캐시',
        description: '모든 토큰의 KV 캐시',
        memoryUsage: 'high',
        speedup: 100,
        suitable: 'short sequences (<1K tokens)'
      },
      sliding: {
        name: '슬라이딩 윈도우',
        description: '최근 N개 토큰만 캐시',
        memoryUsage: 'medium',
        speedup: 10,
        suitable: 'long sequences (>4K tokens)'
      },
      sparse: {
        name: '희소 캐시',
        description: '중요 토큰만 선택적 캐시',
        memoryUsage: 'low',
        speedup: 5,
        suitable: 'extremely long sequences (>16K tokens)'
      }
    };
  }

  selectStrategy(sequenceLength, availableMemory) {
    console.log(`시퀀스 길이: ${sequenceLength}, 가용 메모리: ${availableMemory}MB\n`);

    if (sequenceLength <= 1000 && availableMemory >= 4000) {
      return this.strategies.full;
    } else if (sequenceLength <= 4000 && availableMemory >= 2000) {
      return this.strategies.sliding;
    } else {
      return this.strategies.sparse;
    }
  }

  demonstrateStrategies() {
    const scenarios = [
      { length: 500, memory: 8000 },
      { length: 2000, memory: 4000 },
      { length: 10000, memory: 2000 }
    ];

    for (const scenario of scenarios) {
      const strategy = this.selectStrategy(scenario.length, scenario.memory);
      console.log(`✓ 선택된 전략: ${strategy.name}`);
      console.log(`  속도 향상: ${strategy.speedup}배`);
      console.log(`  메모리: ${strategy.memoryUsage}`);
      console.log(`  적합성: ${strategy.suitable}\n`);
    }
  }
}

// 사용
const adaptive = new AdaptiveKVCacheStrategy();
adaptive.demonstrateStrategies();

// 출력:
// 시퀀스 길이: 500, 가용 메모리: 8000MB
// ✓ 선택된 전략: 전체 캐시
//   속도 향상: 100배
//   메모리: high
//   적합성: short sequences (<1K tokens)
//
// 시퀀스 길이: 2000, 가용 메모리: 4000MB
// ✓ 선택된 전략: 슬라이딩 윈도우
//   속도 향상: 10배
//   메모리: medium
//   적합성: long sequences (>4K tokens)
//
// 시퀀스 길이: 10000, 가용 메모리: 2000MB
// ✓ 선택된 전략: 희소 캐시
//   속도 향상: 5배
//   메모리: low
//   적합성: extremely long sequences (>16K tokens)
```

### 예시 4: KV-Cache 메모리 계산

```javascript
class KVCacheMemoryCalculator {
  calculateMemoryUsage(sequenceLength, hiddenSize, numHeads, dtype = 'float32') {
    // dtype에 따른 바이트 수
    const dtypeSize = {
      'float32': 4,
      'float16': 2,
      'int8': 1
    };

    const bytesPerElement = dtypeSize[dtype] || 4;

    // K와 V 각각: seqLen × hiddenSize × 바이트 수
    const keyMemory = sequenceLength * hiddenSize * bytesPerElement;
    const valueMemory = sequenceLength * hiddenSize * bytesPerElement;

    // 모든 헤드에 대해
    const totalMemory = (keyMemory + valueMemory) * numHeads;

    // MB로 변환
    return (totalMemory / 1024 / 1024).toFixed(2);
  }

  demonstrateMemoryUsage() {
    console.log('\n=== KV-Cache 메모리 사용량 ===\n');

    const configurations = [
      { seqLen: 2048, hidden: 768, heads: 12, name: 'Small Model (2K tokens)' },
      { seqLen: 8192, hidden: 1024, heads: 16, name: 'Medium Model (8K tokens)' },
      { seqLen: 32768, hidden: 2048, heads: 32, name: 'Large Model (32K tokens)' }
    ];

    for (const config of configurations) {
      const memory = this.calculateMemoryUsage(
        config.seqLen,
        config.hidden,
        config.heads
      );
      console.log(`${config.name}: ${memory} MB`);

      // 캐시 없을 때의 메모리 비교
      const withoutCache = (config.hidden * 1.5 / 1024).toFixed(2);
      console.log(`  (캐시 없을 때: ${withoutCache} MB)\n`);
    }
  }
}

// 사용
const memoryCalc = new KVCacheMemoryCalculator();
memoryCalc.demonstrateMemoryUsage();
```

## 🛠️ 해결/적용 방법

### 1단계: 현황 파악
```
- 현재 추론 시간 측정
- 메모리 사용량 확인
- 시퀀스 길이 분포 분석
```

### 2단계: 캐시 전략 선택
```
짧은 시퀀스 (<1K): 전체 캐시
중간 길이 (1-8K): 슬라이딩 윈도우
긴 시퀀스 (>8K): 희소 또는 동적 캐시
```

### 3단계: 캐시 크기 설정
```
공식: KV 캐시 크기 (MB) =
      2 × 시퀀스길이 × 히든크기 × 헤드수 × 바이트수 / 1024²
```

### 4단계: 모니터링
- 캐시 히트율 추적
- 메모리 사용 추적
- 지연시간 개선 측정

### 5단계: 동적 조정 (선택)
- 메모리 부족 시 자동으로 캐시 크기 축소
- 실시간 성능에 따라 전략 변경

## Relations

- implements [[Cache]]
- uses [[VRAM]]
- optimizes [[Attention]]
