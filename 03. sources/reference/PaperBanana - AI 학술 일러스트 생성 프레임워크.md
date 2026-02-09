---
title: PaperBanana - AI 학술 일러스트 생성 프레임워크
type: paper-review
permalink: sources/reference/paperbanana
tags:
- AI
- multi-agent
- illustration
- gemini
- academic
date: 2026-02-09
---

# PaperBanana - AI 학술 일러스트 생성 프레임워크

Google이 개발한 5-에이전트 파이프라인으로, 학술 논문의 텍스트 설명을 전문적인 학술 일러스트레이션으로 변환하는 AI 프레임워크.

## 📖 핵심 아이디어

학술 논문의 Figure/Diagram 생성을 자동화한다. 단순 이미지 생성이 아닌, 논문 맥락을 이해하고 학술 커뮤니티의 시각적 관례에 맞는 일러스트를 생성하는 것이 핵심. 5개 전문 에이전트가 순차적으로 협업하여 품질을 보장한다.

## 🛠️ 구성 요소

| 에이전트 | 역할 | 사용 모델 |
|----------|------|-----------|
| **Retriever** | 논문에서 관련 정보 추출 | Gemini 2.0 Flash |
| **Planner** | 일러스트 구조/레이아웃 계획 | Gemini 2.0 Flash |
| **Stylist** | 시각적 스타일 결정 (색상, 폰트 등) | Gemini 2.0 Flash |
| **Visualizer** | 실제 이미지 생성 | Gemini 2.0 Flash |
| **Critic** | 생성 결과 평가 및 피드백 | Gemini 2.0 Flash |

### 벤치마크: PaperBananaBench

- NeurIPS 2025 논문 292편 기반
- 학술 일러스트 생성 품질 평가용

## 🔧 작동 방식

```
논문 텍스트 입력
       ↓
[Retriever] → 핵심 정보 추출 (개념, 관계, 데이터)
       ↓
[Planner]   → 레이아웃 구조 설계 (배치, 흐름)
       ↓
[Stylist]   → 시각 스타일 결정 (학술 관례 반영)
       ↓
[Visualizer] → 이미지 생성
       ↓
[Critic]    → 품질 평가 → 불합격 시 피드백 루프
       ↓
최종 학술 일러스트
```

### 커뮤니티 구현체 (llmsresearch/paperbanana)

- GitHub: https://github.com/llmsresearch/paperbanana
- `pip install paperbanana`으로 설치
- CLI 지원: `paperbanana generate "설명"`
- MCP 서버 지원: Claude 등 AI 도구와 연동 가능
- Gemini API 키 필요 (2.0 Flash + 이미지 생성용)

```bash
# 설치
pip install paperbanana

# CLI 사용
paperbanana generate "A diagram showing the transformer architecture"

# MCP 서버 실행
paperbanana mcp-server
```

## 💡 실용적 평가

### 장점
- 학술 논문 작성 시 Figure 생성 자동화
- 5-에이전트 분업으로 단계별 품질 관리
- Critic 에이전트의 피드백 루프로 결과물 개선
- MCP 서버 지원으로 AI 워크플로우에 통합 가능

### 한계
- Gemini API 의존 (비용 발생)
- 학술 일러스트 특화 → 범용 이미지 생성 도구는 아님
- 커뮤니티 구현체는 Google 원본과 동일하지 않을 수 있음
- 복잡한 수학적 다이어그램이나 데이터 시각화 품질은 미확인

### 적용 가능성
- 논문 작성 시 초기 Figure 드래프트 자동 생성
- 멀티 에이전트 파이프라인 설계 참고 사례
- MCP 서버 패턴 참고 (AI 도구 통합)

## 🔗 관련 개념

- [[멀티 에이전트 시스템 (Multi-Agent System)]] - 5개 에이전트 협업 구조
- [[Gemini API]] - Google의 생성 AI API
- [[MCP (Model Context Protocol)]] - AI 도구 연동 프로토콜

---

**작성일**: 2026-02-09
**분류**: AI / Multi-Agent / Academic Tools