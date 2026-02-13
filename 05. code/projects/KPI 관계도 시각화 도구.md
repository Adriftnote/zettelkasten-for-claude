---
title: KPI 관계도 시각화 도구
type: project
permalink: projects/kpi-relation-visualizer
level: high
category: visualization/kpi
path: outputs/kpi-likec4/
tags:
- python
- visualization
- graphviz
- kpi
---

# KPI 관계도 시각화 도구

Excel KPI 관계 데이터(JSON)를 Graphviz DOT 다이어그램으로 변환하는 시각화 도구.

## 개요

kpi_relations.xlsx에서 추출한 129개 관계, 137개 KPI를 시각적 트리 다이어그램으로 생성.
5개 본부(CS, 경영지원실, 마케팅, 영업, 연구소) 계층 구조를 컬러 코딩으로 구분.
전사KPI별 개별 서브트리 분리 방식으로 10개 독립 트리 생성.

## 코드 구성

**모듈**
- generate-dot-v5: Graphviz DOT 최종판 — 전사KPI별 개별 서브트리로 분리 (10개 SVG)

## 데이터

| 파일 | 내용 |
|------|------|
| kpi_relations.json | 129개 KPI 인과관계 (from → to, drives/reduces) |
| kpi_master.json | 137개 KPI 메타 (이름, 본부, 레벨) |

## 산출물

- trees/*.dot → 10개 전사KPI별 서브트리 DOT
- kpi-관계도-standalone.html — SVG 인라인 임베딩 단일 HTML (122KB)
- index.html — 로컬 서버용 대시보드 (sticky header + 범례)

## Relations

- contains [[generate-dot-v5]] (Graphviz DOT 최종판)
