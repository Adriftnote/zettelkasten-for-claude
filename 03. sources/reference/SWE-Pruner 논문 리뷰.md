---
title: SWE-Pruner 논문 리뷰
type: paper-review
permalink: sources/reference/swe-pruner-paper-review
tags:
- llm
- coding-agent
- context-pruning
- token-optimization
---

# SWE-Pruner 논문 리뷰

코딩 에이전트의 **컨텍스트를 23~38% 압축**하면서 성능은 유지하는 프레임워크입니다.

## 📖 핵심 아이디어

코딩 에이전트(Claude, GPT 등)가 코드를 읽을 때 **토큰의 76%가 읽기 작업**에 소비됩니다. SWE-Pruner는 사람 개발자의 **"훑어보기(skimming)"** 행동을 모방하여, 목표와 관련된 코드 라인만 선별합니다.

## 🛠️ 구성 요소

| 컴포넌트 | 역할 |
| --- | --- |
| Goal Hint Generation | 에이전트가 "뭘 찾는지" 자연어로 명시 |
| Neural Skimmer | 0.6B 경량 모델이 라인별 관련성 점수 계산 |
| CRF Head | 연속된 코드 블록 유지하며 필터링 |

## 🔧 작동 방식

```
코딩 에이전트 (Claude)
       │
       │ "auth.py 파일 읽어줘" + Goal Hint
       ▼
┌─────────────────────────┐
│    SWE-Pruner 미들웨어    │
│  → 0.6B 모델로 필터링     │
│  → 관련 라인만 남김       │
└─────────────────────────┘
       │
       │ (원본 500줄 → 압축 150줄)
       ▼
     코드 파일
```

## 🎯 Self-Adaptive의 의미

**Self-Adaptive = 목표에 따라 압축률이 동적으로 변함**

| 상황 | 압축률 |
| --- | --- |
| "리턴 타입 뭐야?" (구체적) | 최대 93% (14.8배) |
| "전체 로직 설명해줘" (모호) | 10~20% |
| 평균 (멀티턴) | 23~38% |

**핵심**: 목표가 구체적일수록 압축률 ↑, 모호할수록 ↓

## 📊 실험 결과

| 모델 | 압축률 | 성능 변화 | 비용 절감 |
| --- | --- | --- | --- |
| Claude Sonnet 4.5 | 23%↓ | 70.6→70.2% (유지) | 27%↓ |
| GLM-4.6 | 38%↓ | 55.4→54.8% (유지) | 36%↓ |

싱글턴 태스크에서는 최대 **14.8배 압축** 가능.

## 🆚 기존 방식과 비교

| 방식             | 문제점                     |
| -------------- | ----------------------- |
| LLMLingua      | 토큰 단위 삭제 → 코드 문법 깨짐     |
| RAG            | 파일 단위 → 세밀한 필터링 안됨      |
| LLM 요약         | 디버깅 정보 손실               |
| **SWE-Pruner** | ✅ 라인 단위 + 문법 유지 + 목표 기반 |

## 💡 실용적 평가

**장점:**
- 성능 유지하면서 23~38% 토큰 절약
- 0.6B로 가벼움 (추론 비용 낮음)
- MIT 라이선스 오픈소스
- Claude Agent SDK 통합 예제 제공

**한계:**
- 압축률 자체는 드라마틱하지 않음 (압축률 ≈ 토큰 절약률)
- 멀티턴에서는 23~38% 수준

## 🔗 관련 개념

- [[AgeMem-paper-review|AgeMem 논문 리뷰]] - LLM 에이전트 메모리 관리
- [[context-window-optimization|컨텍스트 윈도우 최적화]]
- [[RAG]] - 기존 검색 증강 생성 방식

## 📎 리소스

- GitHub: https://github.com/Ayanami1314/swe-pruner
- HuggingFace: ayanami-kitasan/code-pruner
- PyPI: `pip install swe-pruner`

---

**작성일**: 2026-01-27
**분류**: Paper Review / Coding Agent / Context Optimization
