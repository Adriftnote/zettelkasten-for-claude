---
title: REF-124 PageIndex — Vectorless Reasoning-Based RAG Framework
type: doc-summary
permalink: sources/reference/pageindex-vectorless-reasoning-rag
tags:
- RAG
- document-retrieval
- LLM-reasoning
- knowledge-graph
- vectorless
date: 2026-03-24
---

# PageIndex — Vectorless Reasoning-Based RAG Framework

벡터 검색 없이 LLM 추론만으로 문서 내 관련 섹션을 찾아오는 RAG 프레임워크. "similarity ≠ relevance" 라는 문제의식에서 출발.

## 📖 핵심 아이디어

전통 RAG는 문서를 청킹 → 임베딩 → 유사도 검색하지만, PageIndex는 문서의 자연 계층 구조(헤더 기반 트리)를 보존하고 LLM이 트리를 보고 추론해서 관련 섹션을 선택한다. FinanceBench에서 98.7% 정확도 달성. 핵심 통찰: 문서 구조 자체가 이미 정보 조직의 메타데이터이므로, 이를 파괴하는 청킹 대신 구조를 활용해야 한다.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| 입력 | PDF (TOC 기반), Markdown (헤더 기반) |
| 파싱 | 헤더 레벨(`#`~`######`)로 계층 트리 구축 |
| 저장 | JSON 파일 (`{document}_structure.json`) |
| 노드 속성 | title, node_id, level, text, text_token_count, summary, nodes(자식) |
| 검색 | LLM이 트리 구조 + 질문을 받고 관련 node_id 목록 반환 |
| 관계 | parent-child 계층만 (typed edge 없음) |
| 벡터 DB | 불필요 |

## 🔧 작동 방식

```
문서(md/pdf)
  │
  ▼
① 헤더 파싱 — 정규식으로 # 레벨 감지
  ▼
② 트리 구축 — 스택 기반 parent-child 관계 설정
  ▼
③ 토큰 씨닝 — 토큰 수 미달 노드 병합 (선택)
  ▼
④ 요약 생성 — LLM으로 각 섹션 요약 (선택)
  ▼
⑤ JSON 저장 — 계층 트리를 직렬화
  ▼
⑥ 검색 — LLM에 트리+질문 전달 → LLM이 추론으로 node_id 선택
  ▼
⑦ 본문 반환 — 선택된 노드의 text를 응답 생성에 사용
```

### 검색 예시

```
질문: "이 문서의 결론은?"
  → LLM reasoning: "node_0019 '5. Conclusion, Limitations, and Future Work'가 가장 직접적"
  → node_0019의 text 반환 → 답변 생성
```

## 💡 실용적 평가

### 강점
- **청킹 불필요** — 문서 구조 보존, 의미 단위 자연 분할
- **해석 가능** — 어떤 섹션을 왜 선택했는지 reasoning 경로가 투명
- **벡터 인프라 불필요** — JSON 파일 하나로 끝
- **전문 문서에 강함** — SEC 보고서, 법률 문서, 기술 스펙 등 구조적 문서

### 한계
- **매 검색마다 LLM 호출** — 비용 + 레이턴시 (벡터 검색 대비 10~100배)
- **횡적 연결 불가** — 계층만 있고 문서 간/섹션 간 의미적 연결 없음
- **비구조적 문서에 약함** — 헤더 없는 자유 텍스트, 대화록 등은 트리 구축 불가
- **대규모 문서** — 트리 전체를 LLM에 넣어야 해서 토큰 한계

### 적용 시사점
- "문서 내부 탐색"에 최적화 — 하나의 스펙 문서에서 관련 섹션 정확히 찾기
- "문서 간 연결"은 못함 — 여러 문서를 가로지르는 지식 그래프와는 다른 레이어
- basic-memory(BM)와 조합 가능: BM이 문서 간 관계, PageIndex가 문서 내부 탐색

## 🔗 관련 개념

- [[BM25]] - (PageIndex가 대체하려는 전통 키워드 검색 방식)
- [[TF-IDF]] - (벡터 임베딩 이전의 문서 검색 기법, PageIndex는 이 계보 자체를 우회)
- [[ReAct Paradigm]] - (LLM 추론 기반 행동 패턴, PageIndex의 검색도 추론 기반)

---

**작성일**: 2026-03-24
**분류**: document-retrieval / RAG
**출처**: https://github.com/VectifyAI/PageIndex