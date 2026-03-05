---
title: strip-output-section
type: function
permalink: functions/strip-output-section
level: low
category: automation/workflow/task-creation
semantic: strip output section from markdown
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- content-script
---

# strip-output-section

마크다운 content에서 "산출물" 헤딩 이하 섹션을 제거하여 반환

## 시그니처

```javascript
function stripOutputSection(content: string | null): string | null
```

## Observations

- [impl] 정규식으로 `#~######` 모든 헤딩 레벨의 "산출물" 섹션 탐지 후 해당 인덱스 이전까지 slicing #regex
- [impl] content가 falsy면 그대로 반환 (null/undefined 안전 처리) #pattern
- [return] 산출물 섹션이 없으면 원본 content 그대로 반환, 있으면 그 이전 부분만 반환
- [note] "산출물"은 댓글로 별도 등록하므로 Task/Subtask content에서 제외하는 설계 #caveat
- [usage] `stripOutputSection(data.content)` — createTaskAPI, createSubtaskAPI 진입 시 호출

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[create-task-api]] (line 500)
- called_by [[create-subtask-api]] (line 566)