---
title: Context Positioning Strategy
type: note
tags:
- context-engineering
- derived
- llm
- optimization
permalink: notes/context-positioning-strategy
source_facts:
- context-engineering
- lost-in-middle
---

# Context Positioning Strategy

중요한 정보를 컨텍스트의 시작과 끝에 배치하는 전략.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **LLM은 컨텍스트 윈도우 안에서만 본다** - 입력된 정보만 처리 가능
2. **중간 위치 정보는 잘 잊혀진다** - Lost-in-Middle 현상

→ 따라서: **중요한 정보는 시작/끝에 배치해야 한다**

## Observations

- [method] 중요한 정보는 컨텍스트의 시작 또는 끝에 배치한다 #positioning
- [method] 덜 중요한 정보는 중간에 배치한다 #positioning
- [fact] 이 전략은 lost-in-middle 현상을 완화한다 #effectiveness
- [example] 시스템 프롬프트는 맨 앞, 최종 지시는 맨 뒤에 배치 #llm

## Relations

- derived_from [[컨텍스트 엔지니어링 (Context Engineering)]] (컨텍스트 윈도우 제한에서 도출)
- derived_from [[Lost-in-Middle 현상]] (중간 망각 현상에서 도출)
- mitigates [[Lost-in-Middle 현상]] (문제 완화 전략)
- part_of [[컨텍스트 엔지니어링 (Context Engineering)]] (컨텍스트 엔지니어링의 구성요소)

---

**도출일**: 2026-01-29
**출처**: context-engineering 허브의 facts 조합
