---
title: Tool-Hub vs Tool-Chainer
type: architecture
permalink: knowledge/concepts/tool-hub-vs-tool-chainer
tags:
- design-pattern
- tool-orchestration
- comparison
- architecture
- workflow
category: System Architecture
difficulty: 중급
---

# Tool-Hub vs Tool-Chainer

검색 기반 도구 허브와 순차 실행 기반 도구 체이너의 비교 분석입니다.

## 📖 개요

**Tool-Hub**는 사용자의 요청에 맞는 도구를 검색하여 추천하는 방식(Pull-based)이고, **Tool-Chainer**는 목표 달성을 위해 여러 도구를 순차적으로 연결 실행하는 방식(Push-based)입니다. 각각의 장단점이 있으며, 상황에 따라 선택하거나 혼합하여 사용합니다.

## 🎭 비유

**Tool-Hub**: 구글 검색 엔진. 사용자가 쿼리를 입력하면 관련 도구/결과를 반환.

**Tool-Chainer**: 조리법 레시피. 목표(음식 완성)를 위해 단계별로 도구(냄비, 칼, 불)를 순서대로 사용.

## ✨ 특징 비교

| 특성 | Tool-Hub | Tool-Chainer |
|------|----------|--------------|
| **작동 방식** | Pull-based (사용자 선택) | Push-based (자동 실행) |
| **주도권** | 사용자 중심 | AI/시스템 중심 |
| **도구 검색** | 요청에 맞는 도구 추천 | 목표 달성 경로 자동 계획 |
| **실행 순서** | 사용자가 결정 | 시스템이 결정 |
| **실패 처리** | 사용자가 다시 시도 | 대체 경로 자동 탐색 |
| **토큰 효율성** | 매우 높음 (필요한 것만) | 중간~낮음 (시도 과정) |
| **적응성** | 낮음 (정적) | 높음 (동적) |
| **에러 가능성** | 낮음 | 중간~높음 (무한 루프) |

## 💡 예시

**시나리오: "한국 음식점 근처 호텔 찾기"**

### Tool-Hub 방식 (검색 기반)
```
User: "한국 음식점 근처 호텔 찾기"
    ↓
Hub: [관련 도구 추천]
1. 식당 검색 도구 (매칭도 95%)
2. 지도 API (매칭도 88%)
3. 호텔 예약 도구 (매칭도 85%)
    ↓
User: [1번 도구 선택] → 한국 음식점 찾기
    ↓
User: [2번 도구 사용] → 근처 맵 확인
    ↓
User: [3번 도구 사용] → 호텔 예약

장점: 사용자 선택, 최소 토큰 사용
단점: 사용자가 모든 단계 결정해야 함
```

### Tool-Chainer 방식 (순차 실행)
```
User: "한국 음식점 근처 호텔 찾기"
    ↓
System: [실행 계획 수립]
1. 한국 음식점 검색 → (위치)
2. 근처 호텔 검색 → (호텔 목록)
3. 호텔 상세 정보 조회 → (선택지)
    ↓
[자동으로 순차 실행]
Step 1: "서울 한국 음식점" 검색
Step 2: 검색된 위치로부터 5km 내 호텔 검색
Step 3: 상위 3개 호텔 상세 정보 로드
    ↓
결과: 호텔 3개 추천

장점: 자동 실행, 최소 사용자 개입
단점: 높은 토큰 사용, 에러 누적 위험
```

## 🛠️ 하이브리드 접근

**최적 전략**:
```
[단순 작업] → Tool-Hub (사용자 제어)
예: 특정 도구 1-2개 사용

[복잡한 작업] → Tool-Chainer (자동 오케스트레이션)
예: 다단계 계획 필요, 조건부 분기 많음

[적응형 작업] → Hub + Chain 혼합
1. Hub로 도구 후보 추천
2. 사용자 선택 또는 자동 Chain 실행
3. 결과에 따라 추가 Hub 검색 가능
```

## Relations

- relates_to [[tool-hub-philosophy]]
- relates_to [[progressive-loader]]
- relates_to [[01. concepts/agent-architecture-guide]]
- relates_to [[knowledge-agent-architecture]]
- relates_to [[mcp-cli-polymorphism]]

---

**난이도**: 중급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: Tool Orchestration Architecture