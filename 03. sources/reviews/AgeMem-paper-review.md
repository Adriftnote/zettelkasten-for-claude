---
title: AgeMem 논문 리뷰
type: paper-review
tags:
  - llm
  - memory
  - agent
  - reinforcement-learning
permalink: reviews/agemem-paper-review
date: 2026-01-21
extraction_status: pending
---

# AgeMem 논문 리뷰

LLM 에이전트가 **장기기억(LTM)과 단기기억(STM)을 스스로 관리**하도록 학습시키는 연구입니다.

## 📖 핵심 아이디어

기존 접근법들이 메모리 관리를 규칙 기반으로 처리하는 것과 달리, AgeMem은 에이전트가 **강화학습(RL)을 통해 메모리 관리 전략을 학습**합니다.

## 🛠️ 제공 도구

| 대상  | 도구       | 설명                  |
| --- | -------- | ------------------- |
| LTM | ADD      | 정보를 장기기억에 저장        |
| LTM | UPDATE   | 기존 장기기억 수정          |
| LTM | DELETE   | 장기기억에서 삭제           |
| STM | RETRIEVE | LTM에서 STM으로 정보 가져오기 |
| STM | SUMMARY  | STM 내용 요약           |
| STM | FILTER   | STM에서 불필요한 정보 제거    |

## 📚 학습 방법: 3단계 Progressive RL

| 단계 | 초점 | 학습 내용 |
|------|------|----------|
| **Stage 1** | LTM | 뭘 저장할지 학습 |
| **Stage 2** | STM | 방해 정보 속에서 뭘 버릴지 학습 |
| **Stage 3** | 통합 | 저장한 걸 검색해서 과제 해결 |

점진적으로 복잡한 상황에 노출시키며 메모리 관리 능력을 키웁니다.

## 🧠 메모리 구조

```
┌─────────────────────────────────────────┐
│        컨텍스트 윈도우 안 (STM)           │
│  ┌─────────────────────────────────┐    │
│  │  대화 히스토리                   │    │
│  │  + 검색해온 LTM 조각들           │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
                    ↑ RETRIEVE
                    ↓ ADD/UPDATE/DELETE
┌─────────────────────────────────────────┐
│        컨텍스트 윈도우 밖 (LTM)           │
│  ┌─────────────────────────────────┐    │
│  │  외부 저장소 (벡터 DB 등)         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**핵심 통찰**: 컨텍스트 관리 = STM 관리

- **RETRIEVE**: LTM에서 STM으로 가져옴
- **FILTER/SUMMARY**: STM 정리 (컨텍스트 윈도우 최적화)
- **ADD**: STM에서 LTM으로 저장

## 💡 실용적 적용

파인튜닝 없이도 **프롬프트 + MCP 도구 설계**로 70~80% 효과를 낼 수 있습니다:

1. 메모리 관리 도구를 MCP 서버로 구현
2. 시스템 프롬프트에 메모리 관리 지침 포함
3. 예시를 통해 in-context learning 유도

→ 구체적인 구현: [[Three-Layer Memory Architecture|3계층 메모리 아키텍처]]

## 🔗 관련 개념

- [[Three-Layer Memory Architecture|3계층 메모리 아키텍처]] - 실제 구현 설계
- [[BM25]] - 텍스트 검색 알고리즘 (LTM 검색에 활용)
- [[Contextual Retrieval]] - 청크 검색 개선 기법
- [[kv-cache-optimization|KV-Cache Optimization]] - STM의 물리적 구현
- [[progressive-disclosure|Progressive Disclosure]] - 단계적 정보 공개

---

**작성일**: 2026-01-21
**분류**: Paper Review / LLM Memory
