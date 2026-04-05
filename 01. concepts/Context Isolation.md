---
title: Context Isolation
type: note
permalink: knowledge/concepts/context-isolation
tags:
- multi-agent
- architecture
- context
- optimization
---

# Context Isolation

## 📖 개요

멀티에이전트 시스템에서 서브에이전트를 사용하는 **핵심 목적**입니다. 역할 분담이 아닌, 각 에이전트의 컨텍스트 윈도우를 분리하여 정보 과부하를 방지하고 집중도를 높입니다.

## 🎭 비유

사무실의 팀 구성과 같습니다. 모든 직원이 회사의 모든 정보를 알 필요는 없습니다. 마케팅팀은 마케팅 정보만, 개발팀은 기술 정보만 알면 됩니다. 정보를 분리하면 각자의 업무에 더 집중할 수 있습니다.

## ✨ 특징

- **Context Window 보호**: 단일 에이전트의 컨텍스트 한계 도달 방지
- **정보 집중**: 각 에이전트는 필요한 정보만 보유
- **노이즈 감소**: 불필요한 정보로 인한 혼란 방지
- **병렬 처리 가능**: 독립된 컨텍스트로 동시 작업 수행
- **전문화**: 도메인별 최적화된 컨텍스트 구성

## 💡 예시

### 예시 1: 연구 에이전트 시스템

```
[Orchestrator] - 전체 조율, 최소 컨텍스트
    ├── [Research Agent A] - 논문 분석 컨텍스트만
    ├── [Research Agent B] - 시장 조사 컨텍스트만
    └── [Writer Agent] - 최종 보고서 작성 컨텍스트만
```

각 에이전트는 자신의 도메인 정보만 보유하여 200K 토큰 한계를 효율적으로 사용합니다.

### 예시 2: 코드 리뷰 시스템

```python
# 잘못된 접근: 단일 에이전트에 모든 정보
single_agent_context = {
    "all_files": [...],           # 100+ 파일
    "all_issues": [...],          # 모든 이슈
    "all_documentation": [...]    # 전체 문서
}  # → 컨텍스트 오버플로우

# 올바른 접근: 컨텍스트 격리
security_agent_context = {"security_related_files": [...]}
performance_agent_context = {"performance_critical_code": [...]}
style_agent_context = {"style_guide": [...], "target_files": [...]}
```

## 🛠️ 적용 방법

### 1단계: 컨텍스트 요구사항 분석
- 각 작업에 필요한 정보 범위 파악
- 정보 간 의존성 맵핑

### 2단계: 에이전트 분리 설계
```
격리 기준:
- 도메인별 (보안, 성능, UI 등)
- 작업 단계별 (분석, 실행, 검증)
- 데이터 소스별 (DB, API, 파일)
```

### 3단계: 최소 필요 정보만 전달
- Orchestrator → Sub-agent: 필요한 컨텍스트만 전달
- Sub-agent → Orchestrator: 요약된 결과만 반환

### 4단계: forward_message 패턴 적용
- "전화 게임" 문제 방지
- 원본 메시지 직접 전달로 왜곡 최소화

## Relations

- enables [[Multi-Agent Patterns]] - 멀티에이전트 아키텍처의 핵심 원칙
- mitigates [[context-confusion]] - 컨텍스트 혼란 방지
- mitigates [[context-distraction]] - 컨텍스트 산만 방지
- relates_to [[progressive-disclosure]] - 점진적 정보 공개와 유사한 원칙