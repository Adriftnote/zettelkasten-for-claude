---
title: SNS 정합성 검증
type: project
level: high
category: "validation/sns/dashboard"
permalink: projects/sns-jeonghabseong-geomjeung
path: "outputs/26.1Q/[전략기획팀] SNS 정합성 검증/"
tags:
- data-validation
- sns
---

# SNS 정합성 검증

SNS 플랫폼 데이터의 CSV 원본과 DB Summary 간 정합성을 검증하는 프로젝트

## 📖 개요

브랜드전략기획팀에서 운영하는 SNS 대시보드의 데이터 정확성을 월간 단위로 검증합니다. Instagram, Facebook, YouTube, TikTok, X, Naver 총 6개 플랫폼을 대상으로 합니다.

## 코드 구성

**모듈**
- review-qmd: Quarto 검증 리포트 (메인 문서)
- validate-db-integrity: DB 무결성 검증 스크립트

**함수 (CSV 파싱)**
- parse-csv-column-sum: CSV 컬럼 합계 추출
- find-naver-file: Naver 파일 탐색
- find-youtube-folder: YouTube 폴더 탐색

**함수 (DB 검증)**
- check-duplicates: 키 중복 검사
- check-date-gaps: 날짜 연속성 검사
- check-null-values: NULL 값 검사
- get-data-distribution: 데이터 분포 조회

## Relations
- contains [[review-qmd]] (Quarto 검증 리포트 모듈)
- contains [[validate-db-integrity]] (DB 무결성 검증 모듈)
- based_on [[Metabase 패턴 (Metabase Patterns)]] (대시보드 데이터 정합성 검증)