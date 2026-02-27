---
title: get-group-list-from-dom
type: function
permalink: functions/get-group-list-from-dom
level: low
category: automation/workflow/task-creation
semantic: parse group list from dom elements
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team
- dom-parsing
---

# getGroupListFromDOM

Flow.team Task 보드 DOM에서 그룹(섹션) 목록 파싱

## 시그니처

```javascript
function getGroupListFromDOM(): { groups: Array<{sectionSrno, name}>, projectName: string }
```

## Observations

- [impl] `h3.js-group-title[data-section-srno]` 요소에서 섹션 ID와 이름 추출 #algo
- [impl] sectionSrno 형식 `"2787315_734376"` → 언더스코어 뒤 숫자가 실제 ID #pattern
- [impl] 그룹명에서 숫자 카운트 제거: `"0. 주제선정(2)"` → `"0. 주제선정"` #pattern
- [impl] 템플릿 문자열(`{SECTION_SRNO}`) 포함 요소 제외 처리 #pattern
- [impl] 프로젝트명은 `#projectTitle` 또는 `h3.project-title` 에서 추출 #pattern
- [return] `{ groups: [{sectionSrno, name}], projectName }` — groups가 빈 배열일 수 있음

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[get-group-list-api]] (line 198)