---
title: REF-137 Building syntaqlite with AI — 8년간 미뤘던 프로젝트를 AI로 3개월 만에 완성한 경험기
type: guide
permalink: zettelkasten/03.-sources/reference/ref-137-building-syntaqlite-with-ai-8nyeongan-mirweossdeon-peurojegteureul-airo-3gaeweol-mane-wanseonghan-gyeongheomgi
tags:
- ai-coding
- claude-code
- software-engineering
- sqlite
- rust
- experience-report
---

# Building syntaqlite with AI — 8년간 미뤘던 프로젝트를 AI로 3개월 만에 완성한 경험기

Google PerfettoSQL 메인테이너가 SQLite 개발 도구(파서/포매터/린터/LSP)를 Claude Code로 3개월(~250시간) 만에 구축한 솔직한 회고.

## 📖 핵심 아이디어

AI는 **구현의 힘 배수(force multiplier)**이지만 **설계의 위험한 대체제**다. 로컬하게 올바른 코드(함수 단위로 컴파일되고 테스트 통과)를 빠르게 만들어주지만, 글로벌한 아키텍처 정합성은 보장하지 못한다. 이 구분을 인식하지 못하면 "잘못된 목적지에 더 빨리 도착"하게 된다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| syntaqlite | SQLite용 포매터/린터/LSP/파서 도구 모음 (Rust) |
| 규모 | ~400개 문법 규칙, 1,390개 업스트림 테스트, 에디터 확장/WASM/Python 바인딩까지 |
| 도구 | Claude Code |
| 기간 | 3개월 (~250시간) — 솔로라면 6개월+ 추정 |

## 🔧 작동 방식 / 적용 방법

### AI가 잘한 것

| 영역 | 왜 잘했나 |
|------|----------|
| 명확한 스펙의 코드 생성 | 입출력이 정의된 함수 → 빠르고 관용적 |
| 낯선 도메인 학습 | Wadler-Lindig 알고리즘, VS Code API 등 → 며칠 → 몇 시간 |
| 롱테일 피처 | 에디터 확장, 패키징, 바인딩 → 경제적으로 가능해짐 |
| 관성 극복 | 추상적 불확실성 → 구체적 프로토타입으로 전환 |

### AI가 해로웠던 것

| 영역 | 왜 해로웠나 |
|------|----------|
| 아키텍처 설계 | "좋은 API"에 객관적 지표 없음 → AI가 즉흥적으로 결정 |
| 코드베이스 멘탈모델 상실 | AI가 짠 코드를 이해 못하면 대화가 장황해지고 오류 누적 |
| 결정 미루기 | 리팩터링이 싸지니까 아키텍처 결정을 계속 미룸 → 혼란 누적 |
| 시간 감각 부재 | 모델은 API가 왜 그렇게 진화했는지, 과거 실수가 뭐였는지 모름 |

### Phase 1 vs Phase 2

```
Phase 1 (1월): "바이브 코딩" — AI에게 설계+구현 위임
  → 기능은 되지만 취약 → 전면 재작성 필요

Phase 2 (2-3월): 역전된 통제 — 인간이 설계, AI는 "스테로이드 자동완성"
  → 사전 설계, 철저한 리뷰, 공격적 리팩터, 검증 인프라(1,390 테스트 병렬)
```

### 핵심 비유: Local vs Global Correctness

> 물리학에서 국소적으로는 뉴턴역학이 맞지만, 전역적으로는 시공간이 휜다. 코드도 마찬가지 — **함수 단위로는 올바르지만 시스템 전체로는 잘못**될 수 있다. AI는 로컬 정합성에 뛰어나지만, 글로벌 정합성은 시스템 전체 상호작용에서 나오는 것이라 AI가 잡지 못한다.

## 💡 실용적 평가 / 적용

**AI 코딩에서의 5가지 교훈**
1. **멘탈 모델 유지** — 생성 직후 반드시 코드 리뷰
2. **지속적 리팩터링** — 산업적 규모로, 엔트로피 방지
3. **아키텍처 결정은 인간이** — 미루지 말고 선행
4. **검증 인프라 투자** — 테스트 수가 많다고 안심하면 안 됨 (500+ 테스트가 구조적 문제를 가렸음)
5. **도메인별 효과 차이 인식** — AI 품질은 작업의 검증 가능성에 비례

**중독 패턴 경고**
- 프롬프트 → 대기 → 결과(유용하거나 쓸모없거나) = 슬롯머신과 유사한 보상 루프
- 수면 부족 → 모호한 프롬프트 → 더 나쁜 결과 → 악순환

## 🔗 관련 개념

- [[REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (AI 에이전트가 복잡한 코드베이스에서 작업할 때 컨텍스트 인프라의 중요성)

---

**작성일**: 2026-04-09
**원문**: https://lalitm.com/post/building-syntaqlite-ai/
**저자**: Lalit Maganti (Google, PerfettoSQL 메인테이너)
**분류**: AI 코딩 경험기 / 소프트웨어 엔지니어링