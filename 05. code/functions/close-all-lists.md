---
title: close-all-lists
type: function
permalink: functions/close-all-lists
level: low
category: automation/workflow/markdown
semantic: close all open nested list tags
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
---

# closeAllLists

열려 있는 모든 중첩 리스트 태그 닫기

## 시그니처

```javascript
const closeAllLists = (): void
```

## Observations

- [impl] `contentToHtml` 내부 클로저 — `listStack` 전부 비울 때까지 pop하며 닫는 태그 추가 #algo
- [impl] 헤딩, 수평선, 일반 문단 등 비리스트 요소 만날 때 호출 #pattern

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[apply-inline-styles]] (line 332)
- calls [[close-lists-to-indent]] (line 356)