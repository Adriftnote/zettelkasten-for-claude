---
title: SNS 기초 데이터 수집 자동화
type: project
level: high
category: automation/sns/collection
permalink: projects/sns-gico-deiteo-sujib-jadonghwa-1
path: outputs/26.1Q/[전략기획_데이터렌더링] SNS 기초 데이터 수집 자동화/
tags:
- chrome-extension
- automation
- sns
- n8n
---

# SNS 기초 데이터 수집 자동화

X, Facebook, Naver 블로그의 통계 데이터를 자동으로 수집하여 DB에 저장하는 프로젝트

## 📖 개요

SNS 채널(X, Facebook, 네이버 블로그)의 기초 데이터(조회수, 반응수, 팔로워수)를 수동 수집에서 자동화로 전환. Chrome Extension으로 각 플랫폼 통계 페이지에서 데이터를 추출하고, n8n webhook을 통해 SQLite DB에 자동 저장.

## 코드 구성

**모듈**
- social-analytics-extractor: Chrome Extension (데이터 추출 + n8n 연동) — 수동 수집용 (레거시)
- playwright-sns-collector: Playwright Persistent Context 기반 자동 수집 — **현재 주력**
- n8n-webhook-workflow: n8n 워크플로우 (DB 저장)

**함수 (Playwright — 자동)**
- run-channel-collector: 채널 일별 요약 (Facebook, X, Naver Blog → daily_channel_summary)
- run-posts-collector: 게시물별 조회수 스냅샷 (NaverTV, Naver Blog, Meta FB/IG → post_view_snapshots)
- playwright-setup: 세션 초기화 (1회 수동 로그인)

**함수 (Extension — 레거시)**
- x-extractor: X(Twitter) GraphQL API 데이터 추출
- facebook-extractor: Facebook Insights 데이터 추출
- naver-extractor: 네이버 블로그 통계 데이터 추출
- background-service: n8n webhook 호출 담당
- popup-controller: UI 및 데이터 정규화

## 데이터 흐름

```
=== Playwright (자동, 주력) ===
[Playwright Persistent Context]
       ↓ page.evaluate() + 내부 API
[run.js]        → [n8n webhook] → daily_channel_summary
[run-posts.js]  → [n8n webhook] → post_view_snapshots

=== Extension (수동, 레거시) ===
[플랫폼 통계 페이지]
       ↓ content script
[Chrome Extension] → [background.js] → [n8n webhook] → daily_channel_summary
```

## 통합 스키마

| 통합 필드 | X | Facebook | Naver |
|----------|---|----------|-------|
| views | impressions | views | views |
| interactions | engagements | engagement | likes + comments |
| followers_diff | followers | followers | neighbors |

## Relations

- contains [[social-analytics-extractor]] (Chrome Extension 모듈 — 레거시)
- contains [[playwright-sns-collector]] (Playwright 자동 수집 — 주력)
- based_on [[웹 기초 (Web Fundamentals)]] (Chrome Extension, HTTP 통신)