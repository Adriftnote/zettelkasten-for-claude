---
title: Observation 레벨 KG 품질 분석 - Tags, Content, Unlinked References
type: note
permalink: 04.-notes/observation-rebel-kg-pumjil-bunseog-tags-content-unlinked-references
tags:
- derived
- knowledge-graph
- deduplication
- observation
- entity-resolution
---

# Observation 레벨 KG 품질 분석

노트 제목(504개 entity) 레벨이 아닌, observation content 안의 **단어/개념 레벨**로 내려가서 KG 품질을 분석한 결과. Tags(663종), Observation content(1,393건), Unlinked references(319건) 세 축으로 검사.

## 도출 근거

[[Relation Table 전수조사 - KG 품질 분석]]에서 relation 정규화는 71% 감소 성과를 냈지만, entity 레벨 dedup은 2건만 발견(벡터가 리스트 검사 대비 추가 가치 없음). 그래서 한 단계 아래인 observation 레벨로 내려가 분석함.

## A. Observation Tags Dedup (663종)

e5-large pairwise cosine similarity 0.92+ 기준 66쌍 발견. 4가지 패턴으로 분류됨.

### 패턴 1: Backtick 노이즈 (파싱 오류)
마크다운 파싱 시 backtick이 태그에 유입된 것.
- `context` ↔ `context\`` (0.9718)
- `encoding` ↔ `encoding\`` (0.9810)
- `cache` ↔ `cache\`` (0.9682)
- `tag` ↔ `tag\`` (0.9664)
→ **조치**: backtick 포함 태그 일괄 정리

### 패턴 2: 대소문자 불일관
- `API` ↔ `api` (0.9821)
- `llm` ↔ `LLM` (0.9531)
→ **조치**: 소문자 통일 또는 대소문자 무시 정규화

### 패턴 3: 동사/명사 형태 변이
- `filter` ↔ `filtering` (0.9681)
- `order` ↔ `ordering` (0.9652)
- `parsing` ↔ `parse` (0.9430)
- `compiler` ↔ `compile` (0.9322)
- `hierarchy` ↔ `hierarchical` (0.9379)
→ **조치**: 기본형 통일 규칙 (명사 우선)

### 패턴 4: 부분집합 관계
- `AI영상` ↔ `AI영상제작` (0.9549)
- `model-selection` ↔ `model-selection-pattern` (0.9491)
- `design-principles` ↔ `design-principle` (0.9882)
→ **조치**: 세분화 태그는 유지하되 상위 태그 매핑 정의

### False Positive (통합 부적합)
- `psychology` ↔ `philosophy` (0.9421) — 다른 학문
- `gpu` ↔ `cpu` (0.9213) — 대비 개념
- `security` ↔ `safety` (0.9548) — 미묘하게 다른 의미

## B. Observation Content Dedup (1,138건)

deps/return/usage 카테고리 제외 후 1,138건에 대해 e5-large pairwise cosine similarity 분석. 0.95+ 기준:

- **Cross-note pairs**: 49쌍 (서로 다른 entity 간)
- **Same-note pairs**: 7쌍 (같은 entity 내부 중복)

### Exact Duplicates (>= 0.99): 4쌍
1. `노트 도출 3원칙 —` ↔ `노트 도출 3원칙 -` — 동일 내용, dash vs em-dash 변형 노트
2. `get-style-kpi` ↔ `generate-dot-v5` — function이 module에 포함되면서 동일 observation 중복 기술
3. `create-project-with-api` ↔ `flow-content-script` — 동일 구현 패턴을 개별 function/module에서 반복
4. `추상화와 설계 원칙` ↔ `추상화는 3단 구조로 반복된다` — hub에서 파생된 note가 동일 패턴 반복

### Near Duplicates (0.97-0.99): 14쌍
주로 RPG 코드 문서화에서 발생:
- function과 상위 module이 동일 구현 세부사항을 각각 기술
- 같은 프로젝트의 다른 모듈이 동일 패턴 사용 (예: Bearer Token 인증, chrome.runtime.sendMessage)

### Semantic Similar (0.95-0.97): 31쌍
개념 노트 간 중복:
- hub와 파생 note가 같은 사실을 다른 표현으로 기술
- workcase와 note가 동일 사건의 다른 관점 기술

### Same-note Internal: 7쌍
KpiCard entity에서 4건 — RPG 문서 2개(kpi-card, KpiCard)가 동일 observation 보유

### 주요 발견: RPG 중복 패턴
**function이 module에 포함될 때 동일 observation이 양쪽에 기술되는 구조적 문제.**
- `get-style-kpi`(function) = `generate-dot-v5`(module) 안의 함수
- 함수의 impl observation이 모듈의 size observation과 동일
→ RPG 문서화 시 function은 자체 impl만, module은 overview만 기술하는 규칙 필요

## C. Unlinked References (319건)

relation 테이블에서 to_id가 NULL인 319건(308 고유 to_name).

### 분류

| 유형 | 건수 | 원인 | 예시 |
|------|------|------|------|
| CANDIDATE | 266 | 아직 entity가 없는 참조 | ADHD, ARIMA, Atomic Note |
| PIPE_ALIAS | 33 | wikilink alias 파싱 실패 | `파서 (Parser)\|파서` |
| PATH | 18 | 파일 경로가 to_name에 유입 | `03. sources/reviews/...` |
| PARSE_ERROR | 1 | relation_type 파싱 오류 | `[reference]` |
| TOO_SHORT | 1 | 2자 이하 의미 없는 값 | `A` |

### CANDIDATE 266건 분석
- **Case-insensitive 매칭 가능**: `Cache` → `Cache (캐시)`, `VRAM` → `VRAM (Video RAM)` 등
- **약칭 매칭**: `rust` → Rust 관련 18개 entity, `java` → Java 관련 entity
- **미생성 concept**: ADHD, ARIMA, Docker, Git, Epistemology 등 — 아직 concept note가 없는 참조
- **다대다 문제**: `framework`가 `프레임워크 (Framework)`과 `KGGen - Knowledge Graph Generation Framework` 양쪽에 매칭

## Observations

- [insight] Observation 레벨 분석은 노트 레벨보다 훨씬 풍부한 품질 문제를 드러낸다 — tag 노이즈, content 중복, dangling reference 모두 발견 #observation-level
- [insight] Tags의 주요 노이즈 원인은 마크다운 파싱 오류(backtick 유입)와 네이밍 불일관(대소문자, 형태 변이) #tag-noise
- [insight] Content 중복의 주요 원인은 RPG 문서화에서 function/module 간 동일 observation 중복 기술 #rpg-duplication
- [insight] Unlinked reference 266건 중 상당수는 아직 concept note가 없는 정당한 참조 — 이것은 "앞으로 만들 노트" 목록 #future-notes
- [pattern] RPG 중복 방지 규칙: function은 자체 고유 impl만 기술, module은 전체 구조만 기술, 공유 패턴은 module에서만 #rpg-rule
- [pattern] Tag 정규화 규칙: 소문자 통일, 기본형(명사) 사용, backtick 제거, 상위-하위 태그 매핑 #tag-normalization
- [decision] PIPE_ALIAS 33건은 basic-memory 파서의 wikilink alias 처리 버그 → upstream 이슈 후보 #parser-bug
- [question] Unlinked CANDIDATE 중 어디까지를 concept note로 만들고 어디까지를 외부 참조로 둘 것인가? #scope
