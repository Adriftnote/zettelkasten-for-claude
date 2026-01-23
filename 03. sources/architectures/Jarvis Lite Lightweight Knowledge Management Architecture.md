---
title: Jarvis Lite Lightweight Knowledge Management Architecture
type: note
permalink: architecture/jarvis-lite-lightweight-knowledge-management-architecture
tags:
- jarvis-lite
- mcp-memory
- architecture
- finetuning
extraction_status: pending
---

# Jarvis Lite: MCP Memory 기반 지식 관리 시스템

## 개요
TypeDB 없이 Anthropic 공식 MCP Memory를 활용하는 경량 지식 관리 시스템.

## 아키텍처

```
Claude Code
├── MCP Servers
│   ├── @modelcontextprotocol/server-memory
│   │   └── memory.jsonl (지식 그래프)
│   └── obsidian-mcp (옵션)
├── Skills
│   ├── jarvis-memory   → prove + Obsidian 저장
│   ├── jarvis-dataset  → 파인튜닝 데이터셋 생성
│   └── jarvis-observe  → 의사결정 기록 가이드
├── Agent (백그라운드)
│   └── D2D Recording Agent
│       → 작업 중 의사결정 자동 감지/저장
```

## 제거된 요소
- ❌ TypeDB 서버
- ❌ 복잡한 온톨로지 분류 (Law, State, Process)
- ❌ 복잡한 관계 타입
- ❌ 추론 규칙

## 유지/추가 요소
- ✅ Anthropic MCP Memory (공식)
- ✅ prove 워크플로우 (검증 대화)
- ✅ Obsidian 저장 (Fleeting → Permanent)
- ✅ 파인튜닝 데이터셋 생성
- ✅ D2D Recording Agent (백그라운드)

## MCP Memory 주요 도구
| 도구 | 용도 |
|------|------|
| `create_entities` | 새 엔티티 생성 |
| `create_relations` | 관계 생성 |
| `add_observations` | 엔티티에 정보 추가 |
| `search_nodes` | 검색 |
| `read_graph` | 전체 그래프 조회 |

## D2D Schema (의사결정 기록)
```json
{
  "name": "D2D_20251223_001",
  "entityType": "decision_record",
  "observations": [
    "Context: [상황 설명]",
    "Thought: [고려한 대안들]",
    "Decision: [최종 선택]",
    "Rationale: [이유]",
    "Preference: [사용자 스타일/가치관]"
  ]
}
```

## DO/DON'T

### DO
- MCP Memory 공식 도구 활용
- 백그라운드에서 조용히 기록
- prove 워크플로우로 품질 보장
- Obsidian 연동으로 영구 저장

### DON'T
- TypeDB 같은 외부 데이터베이스 의존
- 복잡한 온톨로지 분류 체계
- 사용자 작업 방해하는 기록 요청

## Observations

- [architecture] TypeDB 제거하고 Anthropic 공식 MCP Memory로 경량화 #jarvis-lite #simplification
- [decision] D2D Schema로 의사결정 기록 (Context-Thought-Decision-Rationale-Preference) #decision-recording #d2d
- [pattern] prove 워크플로우로 검증 대화 후 Obsidian에 영구 저장 #workflow #quality
- [tech] 백그라운드 D2D Recording Agent로 사용자 작업 방해 없이 자동 기록 #agent #background