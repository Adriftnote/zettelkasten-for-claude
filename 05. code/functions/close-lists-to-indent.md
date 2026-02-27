---
title: close-lists-to-indent
type: function
permalink: functions/close-lists-to-indent
level: low
category: automation/workflow/markdown
semantic: close nested list stack to target indent level
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
---

# closeListsToIndent

중첩 리스트 스택에서 targetIndent 이상 깊이의 리스트 태그 닫기

## 시그니처

```javascript
const closeListsToIndent = (targetIndent: number): void
```

## Observations

- [impl] `contentToHtml` 내부에 클로저로 정의 — `listStack`, `result` 배열 공유 #pattern
- [impl] `listStack` 뒤에서부터 `indent >= targetIndent` 인 항목 pop하며 `</ol>` 또는 `</ul>` 추가 #algo
- [note] 독립 함수 노드지만 실제로는 `contentToHtml` 스코프 내 클로저 #context

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[close-all-lists]] (line 356)