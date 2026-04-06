---
title: Projects Index
type: note
permalink: zettelkasten/05.-code/projects/projects-index
tags:
- index
- llm-only
---

# Projects Index

> 13 entries, last updated 2026-04-06
> LLM 전용 인덱스. 프로젝트 목록 탐색 및 연결용.

## 대시보드 / 시각화

- [[MOT 실시간 대시보드]] — MOT 채널(소셜+블로그) 실시간 모니터링 대시보드
- [[크리에이터 실시간 대시보드]] — SNS 6개 플랫폼 게시물 조회수를 병렬 수집하고 Go Gin 대시보드로 실시간 시각화하는 프로젝트
- [[댓글 피드백 대시보드]] — 온드미디어 채널 댓글/피드백 데이터를 Metabase 대시보드로 시각화하고, Excel → DB 증분 동기화하는 프로젝트
- [[KPI 관계도 시각화 도구]] — Excel KPI 관계 데이터(JSON)를 Graphviz DOT 다이어그램으로 변환하는 시각화 도구

## SNS 데이터 수집

- [[SNS 게시물별 조회수 추적]] — Playwright를 이용하여 5개 플랫폼 게시물 조회수를 1시간 단위로 수집하고 n8n webhook으로 전송하는 스냅샷 수집기
- [[SNS 기초 데이터 수집 자동화]] — X, Facebook, Naver 블로그의 통계 데이터를 자동으로 수집하여 DB에 저장하는 프로젝트
- [[SNS 정합성 검증]] — SNS 플랫폼 데이터의 CSV 원본과 DB Summary 간 정합성을 검증하는 프로젝트
- [[SNS 크리에이터 스튜디오 API ERD]] — REF-104 전수 조사 결과를 기반으로, 각 API를 테이블로 모델링한 ERD

## 업무 자동화 / UI

- [[Flow 업무처리 자동화]] — Flow.team에 Task/Subtask를 자동으로 생성하는 도구 개발 프로젝트
- [[Figma 컴포넌트 라이브러리]] — Figma 디자인에서 추출한 React UI 컴포넌트와 디자인 토큰 모음

## 지식 / AI 도구

- [[벡터 시맨틱 검색]] — basic-memory 지식베이스에 벡터 임베딩 기반 시맨틱 검색을 추가하는 프로젝트
- [[basic-memory]] — Local-first knowledge management combining Zettelkasten with knowledge graphs, exposed as MCP server
- [[SpreadsheetLLM 구현 로직]] — Microsoft Research의 SpreadsheetLLM 논문(arXiv:2407.09025)을 커뮤니티가 구현한 코드 모음