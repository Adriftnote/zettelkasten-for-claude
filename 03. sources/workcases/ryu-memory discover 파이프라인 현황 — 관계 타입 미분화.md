---
title: ryu-memory discover 파이프라인 현황 — 관계 타입 미분화
type: workcase
permalink: zettelkasten/03.-sources/workcases/ryu-memory-discover-paipeurain-hyeonhwang-gwangye-taib-mibunhwa
tags:
- ryu-memory
- discover
- vector-similarity
- relation-type
- 에피소딕메모리
---

# ryu-memory discover 파이프라인 현황 — 관계 타입 미분화

## 현황 (2026-03-16)

### 통계
- BM 엔티티: 664개 (world 566, experience 67, mental_model 30, 미분류 1)
- 임베딩 서버: 정상 연결
- Orch 태스크: 451개 완료, 448개 임베딩됨 (99.3%)
- 발견된 관계: 414개 (discover 첫 실행)

### discover 결과 분석
- **relation_type**: 전부 `related_to` (414건 100%) — 단일 타입
- **method**: 전부 `vector_similarity`
- **confidence 분포**: 평균 0.68, 0.75+ 22건, 0.65~0.75 393건
- **threshold**: 0.65 (기본값 0.7에서 조정된 것으로 추정)

### 상위 유의미 관계
| confidence | from | to | 해석 |
|---|---|---|---|
| 0.784 | run-main | run-run-posts | SNS 수집 실행 스크립트 |
| 0.779 | setup | playwright-setup | 세션 초기화 |
| 0.771 | naver-extractor | extract-daily-stats | 네이버 수집기 |
| 0.769 | run-posts-collector | collect-posts | 게시물 수집기 |
| 0.769 | flow-generator-gui | flow-generator-cli | Flow 생성기 GUI/CLI 쌍 |
| 0.759 | Claude Agent Swarm 설계 경험 | Claude Agent Swarm에서 Orchestration으로 | 경험→진화 |

## 한계

벡터 유사도는 **"비슷한 것"**만 찾음. 사용자가 필요한 관계 타입:
- **인과**: A causes B (예: GPU hang → CPU fallback)
- **의존**: A depends_on B (예: collect-posts → setup)
- **진화**: A evolves_to B (예: Agent Swarm → Orchestration)
- **구현**: A implements B (예: flow-generator-cli → Flow API)
- **호출**: A calls B (코드 간 관계, RPG에서 추출 가능)

## 다음 단계 (미착수)

1. **LLM 분류 파이프라인**: 상위 confidence 쌍 → Ollama/Claude에 관계 타입 라벨링
2. **규칙 기반 추출**: RPG 코드 노트 → calls/imports, workcase→source → derived_from 등 메타데이터 활용
3. **하이브리드**: 벡터 발견(discover) → LLM 분류(classify_relation) → DB 저장

## Observations
- discover는 벡터 유사도 기반으로 잘 동작함. 동일 기능 코드, 논문-구현, API 함수군 등 의미 있는 쌍 발견
- 다만 "비슷하다"와 "관계가 있다"는 다름 — 관계 타입 분류가 핵심 다음 단계
- confidence 1.0 이상값 1건 (vector_distance=0.0000) 존재 — 임베딩 중복 또는 버그 확인 필요
- vecsearch는 bun 크래시 (Segfault) 발생 중 — 별도 이슈

## Relations
- [[ryu-memory]] - (discover 파이프라인의 모체 프로젝트)
- [[memory-systems]] - (에피소딕 메모리 관계 발견의 이론적 기반)
- [[basic-memory v0.20 onnxruntime hang]] - (벡터검색 대체 배경)

## 관련 Task
- task-20260316: Phase 0~2 완료 (안정화, orch 연결, BM25 통합)
- 다음: 관계 타입 분류 파이프라인 설계
