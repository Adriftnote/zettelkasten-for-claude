---
title: 브랜드전략기획팀 데이터분석 — Flow.team 업로드 정리
type: note
permalink: 03.-sources/workcases/beuraendeujeonryaggihoegtim-deiteobunseog-flow.team-eobrodeu-jeongri
tags:
- flow
- data-analysis
- team
- upload
- content-mapping
---

# 브랜드전략기획팀 데이터분석 — Flow.team 업로드 정리

## 상황
- 기존 데이터 분석 작업물을 Flow.team에 체계적으로 등록하여 팀 내 가시성 확보
- 8개 Task로 매핑하여 컨텐츠 정리

## Task 매핑
1. 데이터수집
2. 분류정규화
3. 데이터가공
4. 정제검증
5. overview 대시보드
6. 채널별 대시보드
7. 정기리포트
8. 주제분석

## 프로젝트 구조
```
브랜드전략기획팀-데이터분석/
├── spec/ (01-why, 02-what, 04-how)
├── content-mapping/ (task-01~08 매핑 문서)
├── scripts/ (collect-outputs.py, upload-to-flow.py 미생성)
├── outputs/
└── 01~05. Phase별 폴더 (데이터렌더링, 대시보드구축, 인사이트도출, 플로우업로드, KPI)
```

## 결과
- content-mapping까지 완료
- upload-to-flow.py 미구현 상태에서 종료
- 이후 flow-task-creator 확장프로그램이 이 역할을 대체

## 소스
- `C:\Projects\브랜드전략기획팀-데이터분석\` (archive 대상)
