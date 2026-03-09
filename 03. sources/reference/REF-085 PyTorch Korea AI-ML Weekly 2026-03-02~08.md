---
title: REF-085 PyTorch Korea AI-ML Weekly 2026-03-02~08
type: doc-summary
permalink: sources/reference/pytorch-korea-ai-ml-weekly-2026-03-02-08
tags:
- AI
- ML
- 논문
- 주간정리
- multi-agent
- world-model
- memory
date: 2026-03-08
---

# PyTorch Korea AI/ML Weekly (2026/03/02~08)

PyTorch 한국 사용자 모임의 주간 AI/ML 논문 모음. 다중 에이전트 협업 한계, 장기 기억/지식 기반 구축, 특화 지능과 월드 모델 세 가지 트렌드를 다룸.

## 📖 핵심 아이디어

이번 주 10편의 논문은 세 축으로 수렴한다: (1) 멀티 에이전트가 합의에 실패하는 현실적 한계와 이질적 에이전트 협업 해법, (2) SkillNet·Codified Context·MOOSE-Star 등 에이전트의 장기 기억과 지식 기반 확보, (3) AGI 대신 특화 지능(SAI) 제안과 월드 모델의 일관성 삼위일체 이론화.

## 🛠️ 주요 논문 10편

### 트렌드 1: 다중 에이전트 협업의 현실적 한계 돌파

| 논문                            | 핵심                          | 성과                              |
| ----------------------------- | --------------------------- | ------------------------------- |
| **Can AI Agents Agree?**      | LLM 에이전트의 비잔틴 합의 게임 실패 진단   | 그룹 크기↑ → 성능↓, 타임아웃·수렴 실패가 주원인   |
| **HACRL**                     | 이질적 에이전트 양방향 상호 학습          | GSPO 대비 +3.3% 성능, 롤아웃 비용 50% 절감 |
| **Evaluating Theory of Mind** | ToM + BDI 내부 신념 + 기호 해결기 결합 | 협업 의사결정 정확도 향상                  |

### 트렌드 2: 장기 기억 확보 및 지식 기반 구축

| 논문                   | 핵심                      | 성과                                     |
| -------------------- | ----------------------- | -------------------------------------- |
| **SkillNet**         | 200K+ AI 기술을 온톨로지로 구조화  | 평균 보상 +40%, 실행 단계 -30%                 |
| **Codified Context** | 핫/콜드 메모리 + 19개 도메인 에이전트 | 283개 세션, 108K줄 C# 시스템 일관성 유지           |
| **MOOSE-Star**       | 지식 기반 검색 복잡도 대폭 감소      | O(N^k) → O(log N), TOMATO-Star 데이터셋 공개 |

### 트렌드 3: 특화 지능과 월드 모델 진화

| 논문 | 핵심 | 성과 |
|------|------|------|
| **AI Must Embrace Specialization** | AGI 비판, 초인적 적응 지능(SAI) 제안 | 범용성보다 도메인 전문화 강조 |
| **The Trinity of Consistency** | 공간·시간·모달 일관성 삼위일체 | CoW-Bench 벤치마크 공개 |
| **Beyond Language Modeling** | RAE + MoE로 스케일링 비대칭성 해결 | 비전은 언어보다 데이터 요구량 훨씬 많다는 발견 |

### 기타

| 논문 | 핵심 |
|------|------|
| **Nemotron-Terminal** | 터미널 특화 LLM, 8B: 2.5→13.0%, 32B: 3.4→27.4% 향상. Terminal-Corpus 오픈소스 |

## 💡 실용적 평가

- **Codified Context**는 우리 orchestration 시스템과 유사한 접근 — 핫/콜드 메모리 분리, 도메인 에이전트 활용
- **SkillNet**의 기술 온톨로지 구조화는 RPG 코드 문서화 체계와 연결 가능
- **MOOSE-Star**의 O(log N) 검색은 vecsearch 확장 시 참고할 만한 아키텍처
- **SAI(특화 지능)** 관점은 현재 커스텀 에이전트 설계 철학과 일치

## 📌 읽기 우선순위

| 순위  | 논문                       | 연결 포인트                                                                                       |
| :-: | ------------------------ | -------------------------------------------------------------------------------------------- |
| ⭐1  | **Codified Context**     | 3계층 메모리 아키텍처(Working→SQLite→Obsidian)와 동일 문제. 핫/콜드 분리, 도메인 에이전트 패턴. 283개 세션 장기 일관성 유지 방법론 참고 |
| ⭐2  | **MOOSE-Star**           | vecsearch(sqlite-vec + e5-large) 확장 시 검색 복잡도 병목 해결. multi-hop 지식 그래프 검색에 O(log N) 아키텍처 적용 가능 |
| ⭐3  | **SkillNet**             | RPG 문서화 체계와 유사한 온톨로지 기반 기술 구조화. `.claude/skills/` 계층화 및 에이전트 스킬 선택 효율화에 참고                   |
|  4  | **Can AI Agents Agree?** | 멀티에이전트 실패 모드 분석. 오케스트레이터-워커 패턴에서 서브에이전트 간 결과 충돌 이해에 도움 (직접 적용보다 인사이트)                        |
|  5  | **Nemotron-Terminal**    | CLI 에이전트 벤치마크 참고. Terminal-Corpus 오픈소스를 에이전트 평가 데이터셋으로 활용 가능                                 |

## 🔗 관련 개념

- [[REF-070 PyTorch Korea AI-ML Weekly 2026-02-23~03-01]] - (지난주 시리즈, 동적 효율성·자율 시스템·개인화 학습 트렌드)
- [[AI Agent (인공지능 에이전트)]] - (Can AI Agents Agree, HACRL 등 멀티에이전트 협업 연구)
- [[Knowledge Graph (지식 그래프)]] - (SkillNet 온톨로지 구조화와 관련)

---

**출처**: https://discuss.pytorch.kr/t/2026-03-02-08-ai-ml/9162
**작성일**: 2026-03-09
**분류**: AI/ML 주간 논문 모음