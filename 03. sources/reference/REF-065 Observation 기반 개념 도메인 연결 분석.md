---
title: REF-065 Observation 기반 개념 도메인 연결 분석
type: doc-summary
permalink: sources/reference/observation-concept-domain-analysis
tags:
- knowledge-graph
- observation
- cross-entity
- concept-domain
date: 2026-02-27
---

# Observation 기반 개념 도메인 연결 분석

basic-memory KG의 observation 테이블에서 코드 카테고리(impl/deps/return/usage/method/size/tech/tip)를 제외하고, 개념 관찰(fact/note/decision/pattern/question/warning/solution/lesson/insight/example/reference)만 추출하여 cross-entity 태그 연결과 의미 카테고리별 지식 구조를 분석한 결과.

## 📖 핵심 아이디어

1,146건 observation 중 코드 카테고리 제외 후 **629건 개념 관찰**을 분석. 440종 정규화 태그 중 **81종이 cross-entity** (2개+ entity에 걸침). 인지-창발-메모리 클러스터가 가장 밀도 높은 개념 연결을 형성.

## 🛠️ Cross-Entity 태그 주요 클러스터

### 도메인 지식

| 태그 | 건/entity | 내용 |
|------|-----------|------|
| `#architecture` | 13/10 | Vault 구조, Chrome 확장, 추상화 3단, Three-Layer |
| `#history` | 10/7 | IBM 8비트, ASCII, 오픈소스, 호퍼 컴파일러 |
| `#memory` | 9/7 | 인간기억(감정인덱싱), HW계층, LLM VRAM |
| `#encoding` | 7/4 | UTF-8/16, BOM, PowerShell CP949 |
| `#emergence` | 5/3 | 창발 메커니즘=정보 손실, LLM 자생적 내부 기준 |
| `#attention` | 4/3 | 20k 토큰 임계점, U자형 주의곡선, 트랜스포머 |
| `#cognition` | 4/3 | 시스템1/2, GPU=패턴인식, 적응적 정보 손실 |

### 실무/도구

| 태그 | 건/entity | 내용 |
|------|-----------|------|
| `#claude-code` | 19/6 | 팀설정 경로, 에이전트 MCP, Named Pipe |
| `#mcp` | 9/3 | 도구 선택장애, PATH 의존, 절대경로 해결 |
| `#powershell` | 5/3 | BOM, CP949 하위호환, mklink cmd /c |
| `#metabase` | 3/2 | 24컬럼 그리드, update 시 삭제 버그 |

### 메타/방법론

| 태그 | 건/entity | 내용 |
|------|-----------|------|
| `#open` | 8/5 | LLM 창발 왜?, 추론 vs 패턴매칭 경계 |
| `#limitation` | 9/7 | FTS 미인덱싱, 의미검색 미지원, 해석불가능성 |
| `#performance` | 8/7 | Big O < 캐시친화성, 토큰 95.5% 절감 |
| `#tradeoff` | 4/4 | 속도-안전, 압축-손실, 속도-발열-통합 |

## 🔧 의미 카테고리별 분포

| 카테고리 | 건수 | 핵심 주제 |
|----------|------|-----------|
| fact | 277 | 가장 많음 — 사실 진술 |
| note | 118 | 맥락/주석 |
| decision | 40 | convention(5), open-source(4), history(4), architecture(3) |
| pattern | 35 | architecture(3), ai-video(2), claude-code(2) |
| question | 31 | open(7), 미해결(3), future-work(3) |
| warning | 19 | powershell(2), claude-code(2), n8n(2) |
| insight | 18 | architecture(2), prompt-caching(2) |
| solution | 13 | claude-code(2) |
| lesson | 3 | model-selection, e5-large, semhash |

## 💡 Entity간 개념 연결 (공유 태그 2개+)

### 인지/창발 계열 (가장 밀도 높음)

- `의도적 정보 손실이 지능이다` ↔ `창발과 AI 해석 불가능성` — emergence, information-loss, open
- `Fast-Slow 인지 패턴 Hub` ↔ `시스템1-2와 기억 재구성` — memory, system1, system2
- `시스템1-2와 기억 재구성` ↔ `의도적 정보 손실이 지능이다` — cognition, memory
- `시스템1-2와 기억 재구성` ↔ `지식 저장의 원리 - 카너먼 Loftus KGGen` — loftus, memory
- `ML 훈련은 과정을 버리고...` ↔ `창발과 AI 해석 불가능성` — emergence, open
- `KV 캐시 압축과 선택적 주의` ↔ `의도적 정보 손실이 지능이다` — compression, open

### 메모리/최적화 계열

- `Attention Matching 논문` ↔ `Memory.md Compaction 전략` — compaction, frequency, prompt-caching, self-descriptive (4개 공유)
- `Three-Layer Memory` ↔ `최적화 패턴` — optimization, performance
- `Context-Memory Integration` ↔ `의도적 정보 손실이 지능이다` — context-engineering, memory
- `메모리 시스템` ↔ `컴퓨터 구조 학습 여정` — cache, gpu

### 도구/트러블슈팅 계열

- `Claude in Chrome 연결` ↔ `Windows Junction Claude Code` — claude-code, windows
- `MCP 서버 PATH 문제` ↔ `커스텀 에이전트 MCP 접근 제한` — claude-code, mcp
- `Teammate Agent 빌트인 미작동` ↔ `커스텀 에이전트 MCP 접근 제한` — agent-teams, claude-code

### 개념/역사 계열

- `Character Encoding` ↔ `문자 인코딩 시스템` — encoding, history
- `Java vs JS vs TS` ↔ `Rust 언어 가이드` — ecosystem, tradeoff
- `KGGen 이해` ↔ `Tool-Hub Birth Background` — design-choice, future-work

## 🔗 관련 개념

- [[Observation 레벨 KG 품질 분석 - Tags, Content, Unlinked References]] - (이 분석의 선행 작업: 태그 66쌍, 콘텐츠 56쌍 dedup 결과)
- [[Relation Table 전수조사 - KG 품질 분석]] - (relation 정규화 매핑 172→50종, 이 분석에서 재활용)
- [[KG 품질 분석 - Relation 정규화 성공, Entity Dedup 불필요 판명]] - (entity dedup은 2건만, observation 레벨 분석이 더 유용)
- [[KGGen 이해 - 명사 통합과 동사 관계]] - (KGGen의 동사 정규화 원칙이 relation 정규화에 그대로 적용됨)

---

**작성일**: 2026-02-27
**분류**: KG 품질 분석 시리즈
**분석 도구**: `working/kg_obs_analysis.py` (tag 정규화 + cross-entity + 의미 카테고리)