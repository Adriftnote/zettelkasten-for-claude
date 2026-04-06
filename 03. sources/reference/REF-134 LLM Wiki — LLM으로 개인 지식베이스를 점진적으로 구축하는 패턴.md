---
title: REF-134 LLM Wiki — LLM으로 개인 지식베이스를 점진적으로 구축하는 패턴
type: note
permalink: zettelkasten/03.-sources/reference/ref-134-llm-wiki-llmeuro-gaein-jisigbeiseureul-jeomjinjeogeuro-gucughaneun-paeteon
tags:
- LLM
- knowledge-base
- wiki
- RAG
- Obsidian
- personal-knowledge-management
---

# LLM Wiki — LLM으로 개인 지식베이스를 점진적으로 구축하는 패턴

RAG의 "매번 재발견" 한계를 넘어, LLM이 위키를 점진적으로 구축·유지하는 개인 지식베이스 패턴.

## 📖 핵심 아이디어

RAG는 질문마다 원문에서 지식을 재발견한다. LLM Wiki는 다르다 — LLM이 새 소스를 읽으면 기존 위키에 **통합**한다. 엔티티 페이지 업데이트, 모순 플래그, 교차 참조 추가. 위키는 소스를 추가할수록 복리로 풍부해지는 **영속적 산출물**이다. 사람은 소스 큐레이션과 질문을 담당하고, LLM이 요약·교차참조·정리의 부기(bookkeeping)를 전담한다.

## 🛠️ 구성 요소 / 주요 내용

| 레이어 | 역할 | 소유자 |
|--------|------|--------|
| Raw Sources | 원본 문서 (논문, 기사, 데이터). 불변 — LLM은 읽기만 | 사람 |
| Wiki | LLM이 생성·유지하는 마크다운 파일 모음 (요약, 엔티티, 개념, 비교, 종합) | LLM |
| Schema | 위키 구조·컨벤션·워크플로우를 LLM에게 알려주는 설정 문서 (CLAUDE.md, AGENTS.md 등) | 사람+LLM 공진화 |

### 3대 오퍼레이션

| 오퍼레이션      | 설명                                                     |
| ---------- | ------------------------------------------------------ |
| **Ingest** | 새 소스 → LLM이 요약 작성 + 인덱스 업데이트 + 관련 엔티티·개념 페이지 10~15개 갱신 |
| **Query**  | 위키 기반 질문 응답. 좋은 답변은 위키에 재투입 → 탐색도 축적됨                  |
| **Lint**   | 주기적 건강검진 — 모순, 고아 페이지, 누락 교차참조, 데이터 갭 발견               |

### 인덱싱 & 로깅

| 파일 | 성격 | 용도 |
|------|------|------|
| `index.md` | 콘텐츠 지향 | 위키 전체 카탈로그. 카테고리별 링크+한줄 요약. LLM이 쿼리 시 먼저 읽음 |
| `log.md` | 시간순 | append-only 이벤트 기록 (인제스트, 쿼리, 린트). `grep` 파싱 가능한 포맷 |

## 🔧 작동 방식 / 적용 방법

```
[사람] 소스 큐레이션 + 질문
    ↓
[Schema] CLAUDE.md / AGENTS.md — 구조·규칙 정의
    ↓
[LLM] Ingest → 요약 + 인덱스 + 엔티티/개념 페이지 갱신 (10~15 파일 터치)
    ↓
[Wiki] 마크다운 파일 모음 (Obsidian으로 브라우징)
    ↓
[LLM] Query → 인덱스 → 관련 페이지 읽기 → 종합 답변
    ↓
[LLM] Lint → 모순/고아/갭 발견 → 자동 수정 제안
```

**실용 도구 추천:**
- Obsidian Web Clipper — 웹 아티클 → 마크다운 변환
- qmd — 로컬 하이브리드 검색 (BM25+벡터, CLI+MCP)
- Marp — 마크다운 기반 슬라이드덱
- Dataview — YAML 프론트매터 기반 동적 테이블

## 💡 실용적 평가 / 적용

**강점:**
- 위키 유지 비용이 0에 수렴 → 인간이 포기하는 부기를 LLM이 전담
- 소스 추가마다 복리 효과 — 교차참조·종합이 자동 축적
- 100개 소스, 수백 페이지 규모에서 index.md만으로 충분히 작동 (RAG 인프라 불필요)
- Git으로 버전관리·협업 자연스럽게 확보

**한계:**
- 스케일 한계 — 수천 페이지 이상에서는 임베딩 기반 검색 필요
- LLM 환각이 위키에 축적될 위험 — Lint 주기적 실행 필수
- 도메인별 Schema 튜닝이 품질 결정 — 초기 시행착오 필요

**현 zettelkasten 시스템과 비교:**
- 우리의 3-layer (raw sources → wiki/notes → CLAUDE.md schema)가 정확히 이 패턴
- /source ingest → index 갱신 → hub cascade = Karpathy의 Ingest 오퍼레이션과 동형
- /reindex = Lint에 해당
- 차이점: 우리는 hub 계층(02.hubs)으로 토픽 허브를 명시적으로 관리

## 🔗 관련 개념

- [[REF-087 65 Lines of Markdown - A Claude Code Sensation]] - (CLAUDE.md를 Schema 레이어로 활용하는 동일 패턴)
- [[REF-126 AI를 위한 문서 저장·검색·호출 패턴 비교 — Vector vs Graph vs Reasoning]] - (RAG vs Wiki 접근법의 검색 전략 비교)
- [[context-engineering]] - (Schema 레이어가 컨텍스트 엔지니어링의 구체적 적용)
- [[memory-systems]] - (LLM Wiki = 외부 영속 기억 시스템의 한 형태)

---

**출처**: [Andrej Karpathy, "LLM Wiki" (2026-04-04)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
**작성일**: 2026-04-06
**분류**: AI/Knowledge Management