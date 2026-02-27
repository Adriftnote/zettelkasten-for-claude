---
title: get-auth-info
type: function
permalink: functions/get-auth-info
level: low
category: automation/workflow/auth
semantic: get flow auth info
path: working/worker/from-code/flow-task-creator/content.js
tags:
- javascript
- authentication
- flow-team
---

# get-auth-info

Flow.team 페이지에서 인증 정보 추출 (userId, companySn, token)

## 시그니처

```javascript
function getAuthInfo(): { userId, companySn, token, userName }
```

## Observations

- [impl] script 태그에서 _USER_ID, _USE_INTT_ID, _RGSN_DTTM 정규식 추출 #algo
- [impl] fallback으로 localStorage 확인 #pattern
- [impl] 결과 캐싱 (window._cachedXxx) #pattern
- [deps] document.querySelectorAll, localStorage #import

## 하위 함수

| 함수 | 역할 |
|------|------|
| `getUserId()` | 사용자 ID 추출 |
| `getCompanySn()` | 회사 ID 추출 |
| `getAuthToken()` | RGSN_DTTM 토큰 추출 |
| `getCurrentUserName()` | 프로필에서 이름 추출 |

## 코드

```javascript
function getAuthInfo() {
  return {
    userId: getUserId(),
    companySn: getCompanySn(),
    token: getAuthToken(),
    userName: getCurrentUserName()
  };
}
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-token]] (line 114)
- calls [[get-company-sn]] (line 114)
- calls [[get-current-user-name]] (line 114)
- calls [[get-user-id]] (line 114)
- called_by [[add-tasks-to-project]] (line 910)
- called_by [[create-group-api]] (line 266)
- called_by [[create-project-api]] (line 252)
- called_by [[create-subtask-api]] (line 558)
- called_by [[create-task-api]] (line 489)
- called_by [[get-group-list-api]] (line 195)
- called_by [[move-task-to-group-api]] (line 521)
- called_by [[set-task-depth-api]] (line 581)
- called_by [[update-task-status-api]] (line 535)
