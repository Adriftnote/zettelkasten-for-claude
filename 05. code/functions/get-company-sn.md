---
title: get-company-sn
type: function
permalink: functions/get-company-sn
level: low
category: automation/workflow/auth
semantic: extract company serial number from dom
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- authentication
- flow-team
---

# getCompanySn

Flow.team 페이지에서 회사 식별자(USE_INTT_ID) 추출

## 시그니처

```javascript
function getCompanySn(): string | null
```

## Observations

- [impl] script 태그에서 `_USE_INTT_ID = "BFLOW_..."` 패턴 우선 탐색 #algo
- [impl] fallback 1: `COMPANY_SN` 패턴 (숫자형) #pattern
- [impl] fallback 2: localStorage `N_ONLY_USER_SETTING.COMPANY_SN` #pattern
- [impl] 결과 캐싱 (`window._cachedCompanySn`) #pattern
- [return] 회사 ID 문자열 (예: "BFLOW_...") 또는 null
- [note] 그룹 생성 시 USE_INTT_ID로 필수 전달 #caveat

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[get-auth-info]] (line 114)