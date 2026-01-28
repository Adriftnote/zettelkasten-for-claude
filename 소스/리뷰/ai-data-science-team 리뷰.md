---
title: ai-data-science-team 리뷰
type: note
permalink: soseu/ribyu/ai-data-science-team-ribyu
tags:
- github
- review
- agent-framework
- langchain
- data-science
- python
---

# AI Data Science Team 리뷰

## 내 생각

> [!quote] 한줄 평
> 굳이 프레임워크까지 안 써도 될 것 같은데, 각각의 에이전트를 두고 해도 충분하지 않나? 시각화 정도는 좀 귀찮긴 하지만.

- 개인이 쓰기엔 오버엔지니어링
- Claude Code 같은 도구로 직접 시키면 됨
- 결국 프롬프트 템플릿 + 실행 순서 관리일 뿐
- LLM이 똑똑해진 지금, 과도기적 산물에 가까움

---

## 개요
- **저장소**: https://github.com/business-science/ai-data-science-team
- **유형**: LangChain/LangGraph 기반 에이전트 프레임워크
- **목적**: 데이터 과학 워크플로우 자동화
- **라이선스**: MIT
- **상태**: Beta (0.1.0 이전)

## 핵심 기능
- [AI Pipeline Studio](feature) - 시각적 파이프라인 편집기 (Streamlit 기반)
- [전문 에이전트 시스템](feature) - 데이터 로딩, 정제, 시각화, ML 등 담당
- [하이브리드 워크플로우](feature) - 수동 작업 + AI 자동화 조합
- [재현성](feature) - 모든 단계 코드 기록, 계보 추적

## 에이전트 종류
- [Data Loader Agent](agent) - 파일 로딩 및 디렉토리 탐색
- [Data Cleaning Agent](agent) - 데이터 정제
- [Data Wrangling Agent](agent) - 데이터 변환 및 가공
- [Visualization Agent](agent) - 시각화 생성
- [Feature Engineering Agent](agent) - 피처 엔지니어링
- [SQL Database Agent](agent) - SQL 데이터베이스 상호작용
- [H2O ML Agent](agent) - H2O AutoML 통합
- [MLflow Agent](agent) - 실험 추적

## 기술 스택
- [LangChain](technology) - AI 에이전트 프레임워크
- [LangGraph](technology) - 워크플로우 오케스트레이션
- [Streamlit](technology) - 웹 UI
- [OpenAI/Ollama](technology) - LLM 백엔드
- [pandas](technology) - 데이터 처리
- [Plotly](technology) - 시각화
- [H2O](technology) - AutoML
- [MLflow](technology) - 실험 추적

## 평가

### MCP가 아님
- MCP는 프로토콜 표준 (연결 규격)
- 이건 독립 실행형 에이전트 프레임워크

### 에이전트 프레임워크 필요성
- [과도기적 산물](observation) - LLM 성능 향상으로 필요성 감소
- 2023년 GPT-3.5 시절에는 가드레일 필요했음
- 2025년 현재 Claude/GPT-4는 직접 시켜도 잘함

### 의미 있는 경우
- 프로덕션 시스템 (매일 같은 분석 자동 실행)
- 비개발자용 도구 (UI로 포장)
- 감사/규제 환경 (모든 단계 로깅 필수)

### 결론
- [개인 사용시 오버엔지니어링](conclusion) - Claude Code 직접 사용이 효율적
- 비즈니스 모델로서 가치 (교육/컨설팅 판매)
- 비개발자용 UI 포장에 유용

## 관련 개념
- [에이전트 프레임워크](relates_to) - LangChain, CrewAI, AutoGen 등
- [MCP](differs_from) - 도구 연결 프로토콜 (다른 개념)
- [Claude Code](alternative) - 직접 데이터 분석 가능