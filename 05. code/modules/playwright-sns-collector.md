---
title: playwright-sns-collector
type: note
permalink: 05.-code/modules/playwright-sns-collector
tags:
- playwright
- automation
- sns
- persistent-context
- data-collection
---

# playwright-sns-collector

Playwright Persistent Context 기반 SNS 자동 데이터 수집 모듈

## 📖 개요

Chrome Extension(social-analytics-extractor)의 activeTab 제약으로 자동화 불가 → Playwright가 브라우저 세션(쿠키/로그인)을 유지한 채 각 플랫폼 내부 API를 `page.evaluate()`로 직접 호출하는 방식으로 전환. 19초에 3개 플랫폼 전체 수집 완료.

## Observations

- [impl] Playwright `launchPersistentContext`로 세션 유지 — 로그인 1회만 수동 #pattern
- [impl] `page.evaluate()` 안에서 내부 API fetch — 브라우저 쿠키로 인증 통과 #algo
- [impl] 2개 스크립트 분리: `collect-channels.js`(채널 일별 요약) / `collect-posts.js`(게시물별 스냅샷) #pattern
- [impl] n8n webhook POST로 DB 저장 (daily_channel_summary / post_view_snapshots) #pattern
- [deps] playwright ^1.58.2, Node.js #import
- [note] headless: false 필수 — 일부 플랫폼 headless 감지 차단 #context
- [note] `--disable-blink-features=AutomationControlled` + `ignoreDefaultArgs: ['--enable-automation']` 봇 탐지 회피 #context

## 파일 구조

```
playwright-test/
├── package.json              ← scripts: setup/collect-channels/collect-posts
├── setup.js                  ← 최초 로그인 세션 저장 (1회)
├── test-session.js           ← 세션 유지 확인 테스트
├── collect-channels.js       ← 채널 일별 요약 수집 (Facebook, X, Naver Blog)
├── collect-posts.js          ← 게시물별 조회수 스냅샷 (5플랫폼)
├── register-scheduler.ps1    ← Task Scheduler 등록 스크립트
└── playwright-data/          ← Persistent Context (쿠키, 세션, localStorage)
```

## 아키텍처 비교: Extension vs Playwright

| 항목     | Chrome Extension     | Playwright               |
| ------ | -------------------- | ------------------------ |
| 자동화    | ❌ activeTab 수동 클릭 필요 | ✅ 완전 자동 (Task Scheduler) |
| 세션 유지  | Chrome 프로필 의존        | playwright-data/ 독립      |
| API 호출 | content script 컨텍스트  | page.evaluate() 컨텍스트     |
| 배포     | 확장프로그램 설치 필요         | Node.js만 있으면 실행          |
| 속도     | 수동 3~5분              | 자동 ~19초                  |

## 수집 대상 플랫폼

### collect-channels.js (채널 일별 요약 → daily_channel_summary)
| 플랫폼 | API 방식 | 데이터 |
|--------|---------|--------|
| Facebook | GraphQL doc_id 3종 병렬 | views, interactions, followers (7일) |
| X | AccountOverviewQuery GraphQL | impressions, engagements, follows (7일) |
| Naver Blog | admin.blog iframe DOM 파싱 | views, likes, comments, neighbors (7일) |

### collect-posts.js (게시물별 스냅샷 → post_view_snapshots)
| 플랫폼 | API 방식 | 데이터 |
|--------|---------|--------|
| YouTube | `list_creator_videos` API 가로채기 | 동영상+Shorts 전체 (페이지네이션) |
| 네이버TV | apis.naver.com clips API | 최근 10개 클립 totalPlayCount |
| 네이버 블로그 | blog.stat.naver.com cvContentPc API | 전체 게시물 조회수 |
| Meta | GraphQL LIFETIME + count 500 | FB+IG 통합 게시물 views |
| TikTok | `/creator/manage/item_list/v1` 가로채기 | 최근 게시물 play_count |

## Relations
- part_of [[SNS 기초 데이터 수집 자동화]] (소속 프로젝트)
- replaces [[social-analytics-extractor]] (Chrome Extension → Playwright 전환)
- contains [[run-channel-collector]] (채널 일별 요약 수집)
- contains [[collect-posts]] (게시물별 조회수 스냅샷)
- contains [[playwright-setup]] (세션 초기화)
- contains [[verify-integrity]] (정합성 검증)
- uses [[n8n-webhook-workflow]] (데이터 DB 저장)
