---
title: Knowledge Refinement Pipeline
type: architecture
permalink: knowledge/concepts/knowledge-refinement-pipeline
tags:
- knowledge-management
- pipeline
- data-flow
- sqlite
- markdown
- basic-memory
category: System Architecture
difficulty: 고급
---

# Knowledge Refinement Pipeline

claude-mem SQLite → Markdown → Basic Memory로 이어지는 다단계 지식 정제 파이프라인입니다.

## 📖 개요

Knowledge Refinement Pipeline은 **원시 데이터(SQLite)를 구조화된 마크다운으로 변환하고, 최종적으로 Basic Memory의 정제된 지식베이스로 변환**하는 아키텍처입니다. 각 단계에서 노이즈 제거, 의미 추출, 관계 그래프 생성이 이루어집니다.

## 🎭 비유

광석에서 금을 추출하는 과정 같습니다. 광산(SQLite) → 정제소(Markdown) → 보석상(Basic Memory)으로 거쳐가며 점점 순수하고 가치 있는 형태로 변환됩니다.

## ✨ 특징

- **3단계 정제**: Raw Data → Structured Text → Semantic Knowledge
- **노이즈 필터링**: 각 단계에서 불필요한 정보 제거
- **메타데이터 추출**: 제목, 태그, 카테고리, 관계도 추출
- **양방향 가능**: 기존 정보 업데이트 시 역방향 동기화
- **감사 추적**: 각 단계의 변환 이력 기록

## 💡 예시

**단계별 변환**:

```
[Step 1: SQLite Raw Data]
| id | task_id      | output_summary                    |
|----|--------------|----------------------------------|
| 15 | task-20260115-005 | "Claude Code 환경 설정 완료"  |

    ↓ [Extract & Structure]

[Step 2: Markdown]
---
title: Claude Code 환경 설정
type: task
task_id: task-20260115-005
tags: [setup, claude-code, environment]
---

완료된 작업: Claude Code의 MCP 서버 기본 설정...

    ↓ [Semanticize & Link]

[Step 3: Basic Memory]
- Entity: "Claude Code Setup"
- Relations: [relatesTo: "MCP Architecture"]
- Embeddings: [0.234, 0.567, ...]
- Cross-references: 자동 생성
```

## 🛠️ 구현 방식

**1단계: SQLite 추출**
```
SELECT task_id, output_summary, created_at FROM orchestration_log
WHERE status='completed'
```

**2단계: Markdown 생성**
```
- 프론트매터 생성 (제목, 태그, 메타데이터)
- 구조화된 섹션 (개요, 결과, 교훈)
- 내부 링크 자동 생성
```

**3단계: Basic Memory 동기화**
```
- 엔티티 생성 (노드)
- 관계 맵핑 (엣지)
- 검색 인덱스 업데이트
- 임베딩 생성
```

## Relations

- relates_to [[hybrid-search-architecture]]
- relates_to [[knowledge-agent-architecture]]
- relates_to [[tool-hub-philosophy]]
- relates_to [[consolidation-principle]]
- relates_to [[jarvis-lite-architecture]]

---

**난이도**: 고급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: Knowledge Management Architecture