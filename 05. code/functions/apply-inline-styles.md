---
title: apply-inline-styles
type: function
permalink: functions/apply-inline-styles
level: low
category: automation/workflow/conversion
semantic: apply inline markdown styles
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
- html
---

# apply-inline-styles

마크다운 인라인 문법(`**굵게**`, `*기울임*`, `` `코드` ``)을 HTML 태그로 변환

## 시그니처

```javascript
function applyInlineStyles(text: string): string
```

## Observations

- [impl] 3개 정규식 체인으로 순차 치환 #regex
  - `**text**` → `<strong>text</strong>` (`/\*\*([^*]+)\*\*/g`)
  - `*text*` → `<em>text</em>` (`/\*([^*]+)\*/g`)
  - `` `text` `` → `<code style="...">text</code>` (`/\`([^\`]+)\`/g`)
- [impl] 굵게 먼저 처리 필수: `*` 단독 처리 전에 `**` 먼저 매칭해야 이중 래핑 방지 #caveat
- [impl] `[^*]+` non-greedy 대신 character class로 매칭 — `*` 자체를 포함하지 않아 중첩 문법 오파싱 방지 #regex
- [return] 인라인 태그가 적용된 문자열 (null/undefined 입력 시 원본 반환)
- [usage] contentToHtml 라인 처리 루프, convertTables 셀 처리, closeAllLists 내부에서 공통 호출

## 인라인 코드 스타일

```html
<code style="background:#f0f0f0;padding:2px 4px;border-radius:3px;">코드</code>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- called_by [[close-all-lists]] (line 332)
- called_by [[convert-tables]] (line 444)
