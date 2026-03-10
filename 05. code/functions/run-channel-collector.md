---
title: run-channel-collector
type: note
permalink: 05.-code/functions/run-channel-collector
tags:
- playwright
- facebook
- x-twitter
- naver-blog
- graphql
- webhook
---

# run-channel-collector

채널 일별 요약 데이터 수집 (collect-channels.js)

## 📖 개요

Facebook, X, Naver Blog 3개 플랫폼의 채널 레벨 일별 통계(조회수, 반응수, 팔로워 변동)를 수집하여 n8n webhook → daily_channel_summary DB에 저장.

## Observations

- [sig] `run()` (line 92) → context 생성 → FB/X/Naver 순차 수집 → normalizeForWebhook → sendToWebhook #entry
- [impl] `normalizeForWebhook(platform, rawData)` (line 17) — 플랫폼별 raw → `{date, platform, views, interactions, followers_diff}` 정규화 #algo
- [impl] `sendToWebhook(platform, records)` (line 68) — n8n webhook POST, Extension popup.js와 동일한 payload 형식 #algo
- [impl] `callGraphQL(docId, variables)` (line 140) — Facebook GraphQL 공통 헬퍼 (page.evaluate 내부) #algo
- [impl] `findPrevButton()` (line 255) — Naver Blog iframe에서 이전 날짜 버튼 탐색 #algo
- [impl] `extractCurrentDay()` (line 264) — Naver Blog 현재 날짜 통계 DOM 파싱 #algo
- [impl] Facebook: `page.evaluate()` 안에서 DTSGInitialData 토큰 + pageID 추출 → GraphQL 3종 병렬 (views/interactions/followers) #algo
- [impl] X: ct0 쿠키 + Bearer 토큰 → AccountOverviewQuery GraphQL GET #algo
- [impl] Naver Blog: admin.blog iframe 내 prev 버튼 7회 클릭 → 날짜별 DOM 파싱 (확정 데이터만) #algo
- [deps] playwright, path, fetch (Node 내장) #import
- [note] Facebook GraphQL doc_id: 25139519128986465(views), 24296175803410872(interactions), 24470603935939530(followers) #context
- [note] X Bearer 토큰은 공개 토큰 (모든 X 웹앱 공유) #context
- [note] 파일명 변경: run.js → collect-channels.js (2026-03-10) #context

## Relations
- part_of [[collect-channels]] (소속 모듈)
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)
- implements [[social-analytics-extractor]] (동일 수집 로직, Playwright 버전)
- data_flows_to [[n8n webhook]] (daily-channel-summary)
