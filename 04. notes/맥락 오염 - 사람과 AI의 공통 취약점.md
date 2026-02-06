---
title: 맥락 오염 - 사람과 AI의 공통 취약점
type: note
permalink: notes/context-contamination-human-ai
tags:
- 인지과학
- AI
- 편향
- mechanistic-interpretability
- derived
source_facts:
- Emergence of Linear Truth Encodings in LMs (TCH, LLAMA3 실험)
- 지식 저장의 원리 - 카너먼 Loftus KGGen (확증편향, 기억 재구성)
---

# 맥락 오염 - 사람과 AI의 공통 취약점

맥락에 의한 판단 왜곡은 특정 시스템의 버그가 아니라, 패턴 기반 학습을 하는 지능 일반의 구조적 속성이다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **AI는 참/거짓 감각을 명시적 학습 없이 체득한다** - Truth Co-occurrence Hypothesis에 따르면, 학습 데이터에서 "사실끼리 뭉치고 거짓끼리 뭉치는" 통계적 패턴만으로 모델 내부에 truth direction이 자연 발생한다
2. **이 감각은 맥락 단위로 작동한다** - 문장 하나가 아니라 선행 맥락 전체를 보고 참/거짓을 판단하므로, 거짓 맥락이 선행하면 이후 판단도 거짓 쪽으로 쏠린다 (LLAMA3-8B에서 거짓 2문장 선행 시 정답 확률 4.55배 감소)
3. **인간 기억에는 검증 단계가 없다** - 카너먼의 시스템1은 감정과 사실을 섞고, Loftus 연구에 따르면 6개월 후 가짜 기억으로 대체될 수 있다. 확증편향으로 반복 노출된 정보를 무비판적으로 수용한다

→ 따라서: **사람과 AI 모두 "반복 노출 → 패턴 체화 → 감각 형성"이라는 동일한 원리로 참/거짓 판단력을 획득하며, 이 때문에 맥락 오염에 대한 취약점도 구조적으로 동일하다.**

## Observations

- [fact] AI의 truth direction은 명시적 학습이 아닌 데이터의 통계적 패턴에서 자연 발생한다 #TCH #암묵적학습
- [fact] 거짓 맥락 2문장 선행만으로 LLAMA3-8B의 정답 확률이 4.55배 감소한다 #실험결과
- [fact] 사람도 가짜뉴스 반복 노출 시 사실 정보에 대한 판단력이 저하된다 #확증편향
- [fact] AI든 사람이든 오염된 사실을 본인(시스템)이 인지하지 못한다 #공통취약점
- [method] AI 교정: truth steering vector로 오염된 판단을 진실 방향으로 밀어서 복원 #AI교정
- [method] 사람 교정: 팩트체크, 미디어 리터러시 훈련으로 판단력 회복 #인간교정
- [question] 이 구조적 유사성은 "지능"의 필수 조건인가, 아니면 우연의 일치인가? #후속질문

## Relations

- derived_from [[Emergence of Linear Truth Encodings in LMs]] (TCH 가설과 LLAMA3 맥락 오염 실험에서 도출)
- derived_from [[지식 저장의 원리 - 카너먼 Loftus KGGen]] (확증편향, 인간 기억의 검증 부재에서 도출)
- relates_to [[Linear Representation Hypothesis]] (truth direction이 선형 공간에 존재한다는 상위 가설)
- relates_to [[Hallucination]] (AI에서 맥락 오염이 초래하는 대표적 결과)

---

**도출일**: 2026-02-06
**출처**: Emergence of Linear Truth Encodings 논문의 TCH/맥락 실험 + 카너먼/Loftus의 인간 인지 편향 연구 조합