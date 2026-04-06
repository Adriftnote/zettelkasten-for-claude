---
title: Context Management Levels
type: concept
tags:
  - context-engineering
  - kv-cache
  - memory
  - architecture
permalink: knowledge/concepts/context-management-levels
category: Context Engineering
difficulty: 중급
---

# Context Management Levels

컨텍스트 관리의 두 레벨과 사용자가 실제로 제어할 수 있는 범위를 정리합니다.

## 📖 개요

컨텍스트 관리는 **서비스 레벨**과 **사용자 레벨**로 나뉩니다. 사용자는 API 입력만 제어 가능하며, 서버의 KV-Cache는 직접 조작할 수 없습니다.

## 🏗️ 두 레벨 구조

```
┌─────────────────────────────────────────────────────────┐
│  사용자 레벨 (Claude Code 클라이언트)                      │
│  ─────────────────────────────────────                   │
│  /compact, /clear, filter, build_context 등             │
│  → "API에 뭘 보낼지" 결정                                 │
│  → 컨텍스트 자체를 줄이거나 정리                           │
└───────────────────────┬─────────────────────────────────┘
                        │ API 요청
                        ▼
┌─────────────────────────────────────────────────────────┐
│  서비스 레벨 (Anthropic 서버)                             │
│  ─────────────────────────────────────                   │
│  Prompt Cache (KV-Cache 활용)                           │
│  → "받은 걸 어떻게 효율적으로 처리할지" 결정                 │
│  → GPU VRAM에 KV 저장/재사용                             │
└─────────────────────────────────────────────────────────┘
```

## 🎭 비유

| 레벨 | 비유 | 하는 일 |
|------|------|--------|
| **사용자** | 식당에 주문하는 손님 | "이건 빼고 주세요" (compact/filter) |
| **서비스** | 주방 | "자주 쓰는 재료는 미리 손질해두자" (KV-Cache) |

## 🔒 사용자가 제어 가능/불가능한 것

| 영역 | 가능 여부 | 예시 |
|------|----------|------|
| 입력(컨텍스트) 조절 | ✅ | /compact, /clear, build_context |
| VRAM 캐시 직접 삭제 | ❌ | - |
| 캐시 TTL 변경 | ❌ | - |
| 캐시 정책 변경 | ❌ | - |

## 🛠️ 사용자 레벨 도구 스펙트럼

```
줄이기 ←───────────────────────────────→ 채우기

/clear      /compact      /filter      build_context
(전체 제거)   (요약)        (선별 제거)    (선별 추가)
```

| 도구 | 방향 | 목적 |
|------|------|------|
| /clear | 제거 | 완전히 새로 시작 |
| /compact | 압축 | 핵심만 남기기 |
| filter (/forget) | 선별 제거 | 노이즈 제거 (미구현) |
| build_context | 선별 추가 | 관련 지식 로드 |

## 📋 컨텍스트 관리 전략

### 전략 1: Compact 기반 (점진적 정리)

```
[컨텍스트 쌓임] → /compact [보존할 것] → [압축된 상태]
```

- **장점**: 맥락 유지
- **단점**: 완벽한 필터링 어려움, 요약 품질에 의존
- **적합**: 컨텍스트가 좀 길어졌을 때

### 전략 2: Clear + Build (클린 리셋)

```
[중요한 것 저장] → /clear → build_context [필요한 것]
```

- **장점**: 깨끗한 컨텍스트, 정확한 선별
- **단점**: 저장 안 한 것은 손실
- **적합**: Context Poisoning, 완전히 새 작업 시작

## ⚡ 핵심 인사이트 [fact]

> **저장 품질 = 복원 품질**

Clear + Build 전략의 성공은 **어떻게 저장하느냐**에 달려 있습니다.

### 좋은 저장의 조건

| 항목 | 나쁜 저장 | 좋은 저장 |
|------|----------|----------|
| 내용 | 대화 전체 복붙 | 핵심 결론만 |
| 구조 | 문단 나열 | 헤더, 표, 관계 명시 |
| 연결 | 단독 노트 | `[[관련노트]]` 링크 |
| 태그 | 없음 | `[fact]`, `[decision]` 등 |

## 🔗 KV-Cache와의 관계

- **KV-Cache**: 트랜스포머의 Key-Value 저장 메커니즘 (GPU VRAM)
- **Prompt Cache**: Anthropic이 KV-Cache를 서비스 레벨에서 활용
- **사용자 명령**: 입력을 바꿔서 간접적으로 캐시 hit/miss에 영향

```
사용자 명령 (/clear, /compact)
       │
       ▼
  컨텍스트(입력) 변경
       │
       ▼
  API 요청 내용 달라짐
       │
       ▼
  서버: "prefix 달라졌네" → 캐시 miss (간접 효과)
```

## Relations

- extends [[kv-cache-optimization]] - KV-Cache 기술 기반
- implements [[Context Quality Management Guide]] - 실용 가이드
- uses [[Three-Layer Memory Architecture]] - 메모리 구조
- relates_to [[Cache]] - 캐시 개념

---

**난이도**: 중급
**카테고리**: Concept
**마지막 업데이트**: 2026-01-21
