---
title: playwright-setup
type: note
permalink: 05.-code/functions/playwright-setup
tags:
- playwright
- setup
- session
---

# playwright-setup

세션 초기화 스크립트 (setup.js)

## 📖 개요

최초 1회 실행하여 Facebook, X, Naver Blog에 수동 로그인. 브라우저를 닫으면 세션이 `playwright-data/`에 자동 저장되어 이후 run.js/run-posts.js에서 재사용.

## Observations

- [sig] `setup()` → launchPersistentContext → 사용자 수동 로그인 대기 → close 이벤트로 종료 #entry
- [impl] Extension도 함께 로딩 (`--load-extension`) — run.js에서 Extension 병행 사용 가능 #pattern
- [note] 세션 만료 시 재실행 필요 (플랫폼마다 만료 주기 다름) #context

## Relations

- part_of [[playwright-sns-collector]] (소속 모듈)
