---
title: validate-db-integrity
type: module
level: high
category: "validation/db/integrity"
semantic: "validate db integrity"
permalink: modules/validate-db-integrity
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- sqlite
---

# validate-db-integrity

SQLite DB 데이터 무결성 검증 스크립트

## 📖 개요

대시보드 DB의 키 중복, 날짜 누락, NULL 값 등 무결성 문제를 자동 검사하는 Python 스크립트입니다.

## Observations

- [impl] CLI 스크립트로 4가지 무결성 검사 순차 실행 #pattern
- [usage] `python validate_db_integrity.py`
- [deps] sqlite3, datetime #import

## 검증 항목

1. 키 중복 검사 - PK 위반 확인
2. 날짜 연속성 검사 - 빠진 날짜 탐지
3. NULL 값 검사 - NULL 컬럼 확인
4. 채널별 데이터 분포 - 데이터 현황

## 대상 테이블

- looker_raw_data (date, channel)
- looker_channel_summary (date, platform)
- daily_channel_summary (date, platform)

## Relations
- part_of [[SNS 정합성 검증]] (메인 프로젝트)
- contains [[main-validate-db-integrity]] (진입점 함수)
- contains [[check-duplicates]] (키 중복 검사 함수)
- contains [[check-date-gaps]] (날짜 연속성 검사 함수)
- contains [[check-null-values]] (NULL 값 검사 함수)
- contains [[get-data-distribution]] (데이터 분포 조회 함수)