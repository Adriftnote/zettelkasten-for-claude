---
title: vecsearch vs basic-memory 공식 벡터검색 비교
type: note
permalink: sources/workcases/vecsearch-vs-basic-memory-vector-search
tags:
- vecsearch
- basic-memory
- vector-search
- comparison
- evaluation
---

# vecsearch vs basic-memory 공식 벡터검색 비교

> basic-memory v0.20에서 fastembed 기반 벡터검색이 공식 지원됨을 확인하고, 커스텀 vecsearch와 정확도/편의성을 비교한 기록. (2026-03-13)

## 배경

basic-memory v0.20 업그레이드 시 fastembed 의존성이 추가되면서 onnxruntime AMD GPU hang 문제가 발생했었음. 이를 해결한 후, basic-memory CLI에 `--vector` 플래그가 생긴 것을 확인. 기존 커스텀 vecsearch와 기능이 겹치는지 비교 필요.

## 비교 테스트

3개 쿼리로 동일 조건 비교 실행.

### 쿼리 1: "collect-posts parallel sqlite" (영문 기술 키워드)
| | vecsearch | basic-memory |
|---|---|---|
| 1위 | collect-posts (14.2) | 크리에이터 실시간 대시보드 (0.77) |
| 2위 | run-posts-collector (14.5) | collect-posts (0.70) |
| 평가 | 직접 관련 모듈 정확 매칭 | 프로젝트 레벨 매칭 (넓은 범위) |

### 쿼리 2: "Meta GraphQL tofu" (type=function 필터)
| | vecsearch | basic-memory |
|---|---|---|
| 1위 | call-graphql-x (15.2) | get-meta (0.71) |
| 2위 | fetch-edges (15.3) | call-graphql-x (0.71) |
| 3위 | call-graph-ql (15.8) | gen-series-10m (0.69) |
| 평가 | 3개 모두 정확한 관련 함수 | 3위에 무관한 결과 혼입 |

### 쿼리 3: "AMD GPU 크래시 해결" (한국어)
| | vecsearch | basic-memory |
|---|---|---|
| 1위 | qmd AMD GPU 크래시 (13.4) | basic-memory v0.20 hang (0.82) |
| 2위 | basic-memory v0.20 hang (15.2) | data-structure (0.75) |
| 평가 | 1위 정확, 2위도 관련 | 1위 관련, 2위부터 노이즈 |

## 종합 비교

| 항목 | vecsearch (커스텀) | basic-memory (공식) |
|------|---|---|
| 모델 | e5-large (1024d) | fastembed (내장) |
| 검색 정확도 | 더 정확 (특히 타입 필터) | 넓은 매칭, 노이즈 있음 |
| 타입 필터 | 정확 (chunks 테이블 직접 필터) | 느슨 (관계없는 결과 혼입) |
| 동기화 | 수동 (`vecsearch sync`) | 자동 (노트 저장 시 즉시) |
| 속도 | 모델 로딩 ~3초 | 서버 상주, 로딩 없음 |
| 유지보수 | 커스텀 (스키마 깨짐 위험) | 공식 지원 |
| 안정성 | memory.db 스키마 변경에 취약 | 자체 관리 |

## 결론

- **당장 전환하지 않음** — vecsearch가 정확도에서 아직 우위
- **병행 유지** — basic-memory 검색 품질 개선 지켜보기
- **vecsearch의 리스크** — basic-memory DB 스키마에 직접 의존하여 업그레이드 시 깨질 수 있음 (이미 entity_type→note_type 건 발생)
- **전환 조건** — basic-memory 타입 필터 정확도가 개선되면 전환 검토

## 관련 Task

- task-20260313-004: collect-posts.js 병렬화 + Go Gin 대시보드 (작업 중 발견)
- task-20260313-005: RPG 문서화 (basic-memory CLI 시도 중 발견)

## Relations

- uses [[vecsearch]] (비교 대상 A — 커스텀 벡터 검색)
- uses [[basic-memory]] (비교 대상 B — 공식 벡터 검색)
- learned_from [[basic-memory v0.20 MCP 연결 실패 — onnxruntime AMD GPU hang]] (v0.20 fastembed 추가가 이 비교의 기원)
- learned_from [[vecsearch entity_type→note_type 컬럼명 수정]] (스키마 깨짐 사례)
- part_of [[벡터 시맨틱 검색]] (소속 프로젝트)

## Observations

- [fact] basic-memory v0.20+에서 `bm tool search-notes --vector` 로 벡터 시맨틱 검색 공식 지원 #basic-memory #vector-search
- [fact] basic-memory CLI `bm tool` 서브커맨드로 MCP 도구를 CLI에서 직접 호출 가능 (write-note, edit-note, search-notes 등) #basic-memory #cli
- [fact] basic-memory CLI의 edit-note 등 일부 명령은 fastmcp 의존성 누락으로 불안정 (v0.20.2 기준) #basic-memory #bug
- [pattern] 커스텀 도구가 외부 DB 스키마에 직접 의존하면 업그레이드 시 반복적으로 깨짐 — 공식 API 레이어 사용이 장기적으로 안전 #integration #coupling
- [method] 동일 쿼리 3종(영문/타입필터/한국어)으로 비교하면 검색 품질 차이가 명확히 드러남 #evaluation #benchmark
