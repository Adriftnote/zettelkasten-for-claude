---
title: 데이터 모니터링 시스템 구축 경험 — NAS SQLite + n8n
type: workcase
permalink: sources/workcases/nas-sqlite-n8n-data-monitoring
tags:
- workcase
- monitoring
- nas
- sqlite
- n8n
- data-freshness
---

# 데이터 모니터링 시스템 구축 경험 — NAS SQLite + n8n

> SNS 데이터 수집 파이프라인(n8n → NAS SQLite → Sheets → Dashboard) 모니터링 시스템을 구축하면서 학습한 내용

## 1. 전체 흐름

4-Phase 프로젝트로 설계 (2025-12-05 ~ 12-08):

- **Phase 1 — Data Freshness**: 플랫폼별 최신 데이터 날짜 vs 현재 비교
- **Phase 2 — Workflow Health**: n8n 내장 Error Workflow 활용 (별도 구현 불필요)
- **Phase 3 — Sheets Sync**: NAS DB vs Google Sheets 행 수 비교
- **Phase 4 — Daily Report**: 3개 섹션 집계 (신선도 + 워크플로우 + Sheets)

## 2. 핵심 개념

### SQLite + SMB 비호환

- Synology SMB 공유(Z:\)로 SQLite 접근 불가 — 파일 잠금 제약
- WAL 모드 전환해도 SMB 문제 해결 안됨
- SSH 직접 접근 또는 로컬 복사본으로 해결

### n8n SQLite 노드 제약

- 세미콜론 연결 멀티쿼리 미지원 (CREATE + INSERT 한 번에 불가)
- 노드 분리로 해결: CREATE TABLE 노드 + INSERT 노드 각각

### data_sync_status 설계

- SQLite는 수정 시점 자동 추적 안함 → 명시적 sync status 테이블 필요
- 플랫폼별 API 지연이 달라 단순 COUNT 쿼리로 신선도 판단 불가

### 워크플로우 모니터링

- n8n 기본 제공: /healthz, /metrics, Error Workflow로 충분
- 별도 모니터링 워크플로우 불필요 — Daily Report에서 API 집계

## 3. 실제 적용

### 산출물

- workflow-daily-report.json (3섹션 리포트 워크플로우)
- data-monitoring-research.md (모니터링 베스트 프랙티스)
- tiktok-api-research.md (TikTok API 일별 메트릭 한계)

### 미완료

- 04-a 워크플로우 NAS 배포 + Credential 연결 미완
- TikTok Business API 전환 미검토 (채널 레벨 일별 메트릭 필요)
- 이후 SNS 데이터 수집 프로젝트로 흡수됨

## 관련 Task

- 작업기간: 2025-12-05 ~ 12-08
- 원본: `C:\Projects\_archive\infra\data-monitoring\`

## Observations

- [fact] Synology SMB 공유로 SQLite 접근 시 파일 잠금 제약으로 사용 불가 #sqlite #nas
- [solution] SQLite 네트워크 드라이브 문제는 SSH 직접 접근 또는 로컬 복사본으로 해결 #sqlite #smb
- [warning] SQLite는 네트워크 드라이브에서 사용하면 안됨 — 로컬 파일 전용 DB #sqlite
- [fact] n8n SQLite 노드는 세미콜론 연결 멀티쿼리 미지원 #n8n #sqlite
- [solution] n8n에서 CREATE + INSERT는 별도 노드로 분리해야 함 #n8n
- [pattern] SQLite는 수정 시점 자동 추적 안함 → 명시적 sync status 테이블 설계 필요 #sqlite #monitoring
- [pattern] 플랫폼별 API 지연이 달라 단순 COUNT로 데이터 신선도 판단 불가 #data-freshness
- [tech] n8n 기본 제공 /healthz, /metrics, Error Workflow만으로 워크플로우 모니터링 충분 #n8n #monitoring

---

**관련 노트**: [[NAS Docker 배포 경험 (n8n + Metabase)]], 
[[SNS 채널 자동화 파이프라인 — automation-pipeline 완료 기록]]
