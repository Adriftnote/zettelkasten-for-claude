---
title: content-to-html
type: function
permalink: functions/content-to-html
level: low
category: automation/workflow/conversion
semantic: convert markdown to html
path: working/worker/from-code/flow-task-creator/content.js
tags:
- javascript
- markdown
- html
---

# content-to-html

마크다운 문자열을 Flow.team용 HTML로 변환

## 시그니처

```javascript
function contentToHtml(content: string): string
```

## Observations

- [impl] 코드블록, 테이블, 리스트, 헤딩 순차 변환 #algo
- [impl] 중첩 리스트 스택으로 처리 (ul/ol) #pattern
- [impl] 인라인 스타일: **굵게**, *기울임*, `코드` #pattern
- [return] HTML 문자열
- [deps] convertCodeBlocks, convertTables, applyInlineStyles #import

## 변환 순서

```
1. convertCodeBlocks()  - ```...```
2. convertTables()      - | 테이블 |
3. 라인별 처리:
   - # 헤딩 → <h1>~<h3>
   - 1. 숫자 → <ol><li>
   - - 불릿 → <ul><li>
   - 일반 → <div>
4. applyInlineStyles()  - **bold**, *italic*, `code`
```

## 하위 함수

| 함수 | 역할 |
|------|------|
| `convertCodeBlocks(content)` | ```lang``` → `<pre><code>` |
| `convertTables(content)` | 마크다운 테이블 → `<table>` |
| `applyInlineStyles(text)` | 인라인 스타일 변환 |

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- data_flows_to [[create-task-api]] (HTML 제공)