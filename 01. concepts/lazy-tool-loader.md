---
title: Lazy Tool Loader
type: pattern
tags: [lazy-loading, caching, mcp, tool-management, performance]
permalink: knowledge/concepts/lazy-tool-loader
category: MCP/Tool
difficulty: intermediate
created: 2026-01-19
updated: 2026-01-22
---

# Lazy Tool Loader

> ⚠️ **용어 참고**: "Lazy Tool Loader"는 일반적인 소프트웨어 용어가 아닌, [[Lazy Loading]]과 [[Cache|Caching]] 패턴을 MCP CLI 도구 관리에 적용한 **복합 패턴**입니다.

## 📖 개요

**Lazy Loading**(지연 로딩)과 **Caching**(캐싱)을 결합하여 MCP CLI 도구를 효율적으로 관리하는 패턴입니다.

- **Lazy Loading**: 도구를 미리 로드하지 않고 실제 필요할 때 로드
- **Caching**: 한 번 로드한 도구 정보를 저장하여 재사용

## 🎭 비유

대형 도서관에서 모든 책을 카운터에 준비하는 대신:
1. 필요한 책을 신청하면 그때 꺼내주고 (**Lazy Loading**)
2. 자주 필요한 책은 카운터 근처에 보관 (**Caching**)

→ 처음 방문은 빠르고(초기화 빠름), 자주 찾는 책은 금방 받을 수 있습니다(캐시 효율).

## ✨ 핵심 구성

| 일반 개념 | 이 패턴에서의 적용 |
|----------|-------------------|
| **Lazy Loading** | 도구를 처음 호출할 때 MCP 서버에 연결하여 로드 |
| **Caching** | 로드된 도구 목록을 메모리/디스크에 저장 |
| **Lazy Initialization** | 첫 요청 시 자동으로 도구 준비 |
| **Cache Invalidation** | TTL 또는 수동 갱신으로 캐시 무효화 |

## 💡 MCP CLI에서의 문제와 해결

### 문제: 등록 시점과 실행 시점 분리

```
[Anti-pattern]
시작 → 서버 연결 → 도구 목록 조회 → 연결 해제 → ... → 실행 시 (연결 끊김!)
```

CLI가 시작될 때 도구 목록을 가져오려고 서버에 연결하면, 나중에 실제 실행할 때는 이미 연결이 끊어져 있습니다.

### 해결: Lazy Loading + Caching

```
[이 패턴]
시작 → 캐시에서 도구 목록 조회 (연결 없음) → ... → 실행 시 연결 → 실행 → 연결 해제
```

1. **캐시 확인**: 도구 목록이 캐시에 있으면 서버 연결 없이 사용
2. **Lazy Connect**: 실제 도구 실행이 필요할 때만 서버 연결
3. **즉시 해제**: 실행 완료 후 연결 해제
4. **캐시 갱신**: TTL 만료 또는 수동 갱신 시에만 새로 조회

## 🛠️ 구현 예시

```javascript
class ToolLoader {
  constructor() {
    this.cache = new Map();      // 메모리 캐시
    this.cacheTTL = 24 * 60 * 60 * 1000; // 24시간
  }

  // Lazy Loading: 필요할 때만 로드
  async getTool(toolName) {
    // 1. 캐시 확인 (Caching)
    if (this.cache.has(toolName) && !this.isExpired(toolName)) {
      return this.cache.get(toolName);
    }

    // 2. 캐시 미스: 서버에서 로드 (Lazy Loading)
    const client = await this.connect();
    const tool = await client.getTool(toolName);
    await client.disconnect();

    // 3. 캐시에 저장
    this.cache.set(toolName, { tool, timestamp: Date.now() });
    return tool;
  }

  // 캐시 무효화
  invalidate(toolName) {
    this.cache.delete(toolName);
  }
}
```

## 📊 적용 조건

이 패턴이 효과적인 경우:

| 조건 | 설명 |
|------|------|
| ✅ 도구 목록이 자주 변경되지 않음 | 캐싱 효과가 큼 |
| ✅ 서버 연결 비용이 높음 | Lazy Loading으로 불필요한 연결 방지 |
| ✅ 등록과 실행 시점이 분리됨 | CLI처럼 명령 등록 후 나중에 실행 |
| ❌ 실시간 도구 목록 필요 | 캐시 무효화 전략 필요 |

## Relations

- based_on [[Lazy Loading]] - 지연 로딩 원칙 적용
- based_on [[Cache]] - 캐싱 메커니즘 사용
- similar_to [[dynamic-tool-fetching]] - 둘 다 조건부 도구 로드
- used_by [[tool-discovery-pattern]] - 발견된 도구를 효율적으로 로드
- related_to [[progressive-disclosure]] - 점진적 공개 원칙과 유사
