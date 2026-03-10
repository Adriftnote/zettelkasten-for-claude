---
title: setup
type: module
permalink: modules/setup
level: high
category: data/sns/session
semantic: initialize playwright session
path: C:/claude-workspace/working/projects/playwright-test/setup.js
tags:
- javascript
- playwright
- session
- setup
---

# setup

Playwright 퍼시스턴트 컨텍스트 세션 초기화 스크립트. 최초 1회 실행하여 SNS 플랫폼에 수동 로그인하고 세션을 `playwright-data/`에 저장한다.

## 개요

`collect-channels.js`와 `collect-posts.js`가 로그인 없이 반복 실행되려면 세션 쿠키가 미리 저장되어 있어야 한다. 이 스크립트를 1회 실행하면 브라우저가 열리고, 사용자가 각 플랫폼(Facebook, X, Naver Blog)에 수동 로그인 후 브라우저를 닫으면 세션이 자동 저장된다.

## Observations

- [impl] `chromium.launchPersistentContext(USER_DATA_DIR)` — `playwright-data/` 디렉토리에 쿠키/세션/localStorage 영구 저장 #pattern
- [impl] Extension도 함께 로딩 (`--load-extension=${EXTENSION_PATH}`) — 수집 스크립트와 동일한 환경 #pattern
- [impl] `--disable-blink-features=AutomationControlled` + `ignoreDefaultArgs: ['--enable-automation']` — 봇 탐지 회피 #pattern
- [impl] `context.on('close', resolve)` — 사용자가 브라우저를 닫을 때까지 프로세스 대기 #pattern
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node setup.js` — 최초 1회 또는 세션 만료 시 재실행 #usage
- [note] 세션 만료 주기: 플랫폼마다 다름. 세션 만료 시 collect-channels/collect-posts에서 "로그인 만료" 오류 발생 #context
- [note] 로그인 대상: Facebook(business.facebook.com), X(x.com), Naver Blog(admin.blog.naver.com) #context

## Relations

- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[setup]]
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)
- depends_on [[playwright]]