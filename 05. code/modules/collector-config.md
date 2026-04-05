---
title: collector-config
type: note
permalink: zettelkasten/05.-code/modules/collector-config
semantic: module
category: code/modules
path: playwright-test/collector-config.js
tags:
- module
- javascript
- playwright
- collector
---

## 역할
수집기 Platform Registry — 8개 플랫폼의 수집 설정 (서버 YAML과 동기화)

## 경로
`playwright-test/collector-config.js`

## 구성
- `collector-config.js` — 플랫폼 레지스트리 (테이블명, 컬럼, URL 등)
- `collectors/` — 플랫폼별 수집 스크립트 (현재 stub)
- `lib/normalizer.js` — raw records → 표준 포맷 변환
- `lib/saver.js` — MariaDB upsert 처리

## Relations
- part_of [[MOT 실시간 대시보드]]
- data_flows_to [[mariadb]]
- contains [[normalizer]]
- contains [[saver]]

## Observations
- [impl] 서버 platform_config.yaml과 1:1 대응 — 테이블명/컬럼명 동일 #architecture
- [impl] collectors/ 하위에 플랫폼별 스크립트 (현재 stub, 미팅 후 구현) #note
- [impl] lib/saver.js: mysql2/promise 사용, ON DUPLICATE KEY UPDATE로 upsert #pattern
- [impl] lib/normalizer.js: raw records → { platform, id, title, metrics, captured_at } 표준화 #pattern