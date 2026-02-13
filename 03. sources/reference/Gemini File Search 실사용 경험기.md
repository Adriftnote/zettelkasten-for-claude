---
title: Gemini File Search 실사용 경험기
type: guide
permalink: sources/reference/gemini-file-search-experience
tags:
- gemini
- file-search
- rag
- vector-search
- 경험기
date: 2026-02-13
---

# Gemini File Search 실사용 경험기

옵시디언 vault를 Gemini File Search에 올려본 실전 경험. vecsearch 대체 가능성 검토에서 시작했으나 "내 노트 기반 AI 챗봇"이라는 본질을 발견.

## 📖 배경

vecsearch(로컬 벡터 검색)의 두 가지 불편함에서 출발:
1. 옵시디언 → git sync가 귀찮음
2. fastembed 모델 로딩이 느림 (Python 시작 + 모델 로드)

Gemini File Search API가 클라우드 기반 대안이 될 수 있을까?

## 🛠️ 실행 과정 / 삽질 기록

### 1단계: API 연결 (즉시 벽)

- Free tier에서 `gemini-2.0-flash` 호출 → **429 RESOURCE_EXHAUSTED** (limit: 0)
- 원인: Free tier 쿼터가 0 — 무료로는 generate_content 자체가 불가
- 해결: Google Cloud Billing 연결 (Tier 1 전환)

### 2단계: 모델 호환 (두 번째 벽)

- Billing 연결 후 재시도 → **400 INVALID_ARGUMENT** ("tool_type required")
- SDK 업그레이드해도 동일 에러
- 원인: **gemini-2.0-flash가 File Search를 아예 지원하지 않음**
- 지원 모델: gemini-3-flash-preview, gemini-2.5-pro, gemini-2.5-flash-lite 등
- 해결: `gemini-2.5-flash-lite`로 변경 → 성공

### 3단계: 파일 업로드 (세 번째 벽)

- 한글 파일명 → **ascii codec 인코딩 에러**
- SDK가 Windows에서 한글 경로를 ASCII로 인코딩하려다 실패
- 해결: 임시 ASCII 파일명(`doc_1.md`)으로 복사 → 업로드 → 삭제
- 245개 파일 (01.concepts + 03.sources/reference) 업로드 완료, 실패 0건
- 소요시간: 약 20분 (파일당 ~5초)

### 4단계: 검색 테스트 (드디어 성공)

```bash
# Python 스크립트
python gemini-filesearch.py search "컨텍스트 엔지니어링이란?"

# Gemini CLI (yolo 모드)
GEMINI_API_KEY=... gemini --yolo -p "Rust 소유권 시스템" -m gemini-2.5-flash-lite
```

답변 + Citations(출처 문서명) 정상 반환.

## 💡 핵심 깨달음

### "이건 검색이 아니라 챗봇이다"

Gemini File Search는 독립 검색 API가 없다. 검색 결과만 받을 수 없고, 반드시 `generateContent`(= AI 답변 생성)를 거쳐야 한다. 즉:

```
[기대한 것]  질문 → 유사 문서 목록 반환 (벡터 검색)
[실제 구조]  질문 → Gemini 모델 → Store 검색 → AI가 답변 생성
```

NotebookLM, Custom GPT with files와 본질적으로 같은 것.

### 벡터 DB의 구조적 한계

업데이트 API가 없다. 파일 수정 시:
1. 기존 문서 삭제
2. 수정된 파일 다시 업로드

이건 vecsearch도 동일 — 원본 → 청킹 → 임베딩 파이프라인에서 원본이 바뀌면 전부 다시 해야 한다. Gemini든 Pinecone이든 다 같은 문제.

### 벡터 검색의 본질

벡터 검색에 요구하는 건 "정확도"가 아니다:
- **발견**: "이거랑 비슷한 거 있어?"
- **중복 방지**: "이미 쓴 노트 있나?"
- **시맨틱 리콜**: 키워드 모를 때 의미로 찾기

그물처럼 넓게 거는 역할이라 동기화가 좀 밀려도 실사용에 큰 문제 없음.

## 🔧 vecsearch vs Gemini File Search 비교

| 항목 | vecsearch (로컬) | Gemini File Search |
|------|-----------------|-------------------|
| 검색 결과 | 유사 문서 목록 + distance | AI 생성 답변 + Citations |
| 순수 검색 | O (벡터만 반환) | X (모델 생성 필수) |
| 동기화 | checksum 기반 증분 | 삭제 → 재업로드 |
| 속도 | 느림 (모델 로딩) | 빠름 (API 호출) |
| 비용 | 무료 | 유료 (소액) |
| 오프라인 | O | X |
| 용도 | 중복 방지, 유사 노트 탐색 | 노트 기반 Q&A 챗봇 |

## 📌 결론

- **vecsearch 대체로는 부적합** — 순수 검색이 안 되므로 용도가 다름
- **노트 기반 Q&A 챗봇으로는 좋음** — Gemini CLI에서 vault 지식 활용
- **vecsearch는 vecsearch대로 유지** — sync 오류 수정이 더 실용적
- Gemini File Search는 보조 도구로 활용 (Claude Code 밖에서 vault 질문 시)

## 🔗 관련 개념

- [[Gemini File Search API 공식 문서]] - API 상세 레퍼런스
- [[Gemini CLI 공식 문서]] - CLI 사용법
- [[벡터 시맨틱 검색]] - vecsearch 프로젝트 문서

---

**작성일**: 2026-02-13
**분류**: 실사용 경험 / 도구 비교