---
title: REF-125 Code-Review-Graph — Tree-sitter 기반 코드 지식 그래프 (Claude Code 플러그인)
type: doc-summary
permalink: sources/reference/code-review-graph-treesitter-knowledge-graph
tags:
- code-analysis
- tree-sitter
- knowledge-graph
- Claude-Code
- MCP
- code-review
date: 2026-03-24
---

# Code-Review-Graph — Tree-sitter 기반 코드 지식 그래프

소스코드를 Tree-sitter AST 파싱 → SQLite 그래프로 저장하여, 코드 리뷰 시 토큰 소모를 줄이는 Claude Code 플러그인. 6.8배 평균 토큰 절감.

## 📖 핵심 아이디어

매 코드 리뷰마다 전체 코드베이스를 읽는 대신, 변경된 파일에서 BFS로 영향 범위(blast radius)만 추적하여 관련 코드만 컨텍스트로 제공한다. git diff 기반 인크리멘탈 업데이트로 2초 미만 갱신.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| 파서 | Tree-sitter (14개 언어) |
| 저장 | SQLite (`.code-review-graph/graph.db`, WAL 모드) |
| 노드 타입 | File, Function (Class/Type은 언어에 따라) |
| 엣지 타입 | README 7종 선언, **실제 JS에서는 CALLS + CONTAINS만 동작** |
| MCP 도구 | 8개 (build, impact_radius, query, review_context 등) |
| CLI | build, update, watch, status, visualize, serve |
| 시각화 | D3.js force-directed graph (자체 HTML) |

## 🔧 작동 방식

```
소스코드
  │
  ▼
① Tree-sitter AST 파싱 — 함수/클래스/파일 노드 추출
  ▼
② SQLite 저장 — nodes(qualified_name, kind, line range) + edges(kind, source, target)
  ▼
③ 인크리멘탈 — git diff → 변경 파일만 재파싱 → edges 갱신
  ▼
④ 검색 — impact_radius(BFS, depth 설정) / callers_of / callees_of
```

### 실측 결과 (playwright-test 프로젝트)

- 15 파일, 97 노드, 1019 엣지
- 엣지 분포: CALLS 893개, CONTAINS 126개
- CALLS에 빌트인 메서드 포함 (`log`, `push`, `goto`, `includes` 등) — 노이즈 높음

## 💡 실용적 평가

### 강점
- **blast radius** — 변경 영향 범위 자동 추적 (BFS, depth 설정)
- **인크리멘탈 업데이트** — git diff 기반, 2초 미만
- **14개 언어** — Tree-sitter 기반으로 폭넓은 언어 지원
- **토큰 절감** — 6.8배 평균 (최대 49배)

### 한계 (실측 기반)
- **JS/TS에서 엣지 2종만 동작** — IMPORTS_FROM 버그(source가 file_path), TESTED_BY 미구현, IMPLEMENTS 선언만
- **Python에서만 풍부** — TESTED_BY, IMPORTS_FROM 정상 동작
- **CALLS 노이즈** — 빌트인 메서드까지 전부 CALLS로 잡아서 signal/noise 비율 낮음
- **Observation 없음** — "왜 이렇게 만들었는지" 저장 불가
- **Windows cp949** — `PYTHONUTF8=1` 환경변수 필요

### GitNexus와 비교
| | CRG | GitNexus |
|---|---|---|
| 저장 | SQLite (플랫) | KuzuDB (그래프 DB) |
| 엣지 | 2~7종 (언어별 편차 큼) | 7종 + confidence/reason 메타 |
| 클러스터링 | 없음 | Leiden 알고리즘 자동 |
| 실행 흐름 | 없음 | Process 노드로 추상화 |
| 라이선스 | MIT | PolyForm NC |

CRG는 GitNexus의 경량 버전. MIT라 자유롭게 쓸 수 있지만 JS/TS 파서 품질이 낮음.

## 🔗 관련 개념

- [[GitNexus - AST 기반 코드 지식 그래프 엔진]] - (동일 패턴의 상위 호환, KuzuDB+Leiden 클러스터링)
- [[MCP Tool 패턴 (MCP Tool Patterns)]] - (CRG의 MCP 서버 구현 패턴)

---

**작성일**: 2026-03-24
**분류**: code-analysis / knowledge-graph
**출처**: https://github.com/tirth8205/code-review-graph