---
title: convert-tables
type: function
permalink: functions/convert-tables
level: low
category: automation/workflow/conversion
semantic: convert markdown tables to html
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
- html
---

# convert-tables

마크다운 테이블을 `<table>` HTML로 변환. 구분선 행 자동 감지 및 헤더 행 분리 처리

## 시그니처

```javascript
function convertTables(content: string): string
```

## Observations

- [impl] 라인 단위 순회(while 루프, i 포인터)로 `|`로 시작/끝나는 연속 행을 테이블 단위로 수집 #algo
- [impl] 구분선 행 판별 정규식: `/^[\|\s\-:]+$/` AND `/---/` — GFM 정렬 표기(`:---:`, `---:`)도 처리 #regex
- [impl] 테이블 조건: `tableLines.length >= 2` (헤더 + 구분선 최소 필요) #algo
- [impl] 첫 번째 행(idx===0)은 `<th>`, 나머지는 `<td>`로 자동 구분 #pattern
- [impl] 셀 분리: `tline.split('|').filter((c, ci, arr) => ci > 0 && ci < arr.length - 1)` — 양끝 빈 셀 제거 #algo
- [impl] 각 셀 내용에 `applyInlineStyles()` 적용 (굵게/기울임/코드 인라인) #pattern
- [return] 테이블 행이 `<table>...<tr>...<th|td>...</table>`로 교체된 문자열 (나머지 줄은 그대로)
- [note] contentToHtml의 2단계 전처리: 코드블록 변환 후 실행되므로 코드 안의 `|`는 이미 `<pre>`로 래핑된 상태 #context

## 출력 HTML 구조

```html
<table style="border-collapse:collapse;border:1px solid #ddd;">
  <tr>
    <th style="border:1px solid #ddd;padding:8px;">헤더1</th>
    <th style="border:1px solid #ddd;padding:8px;">헤더2</th>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;">값1</td>
    <td style="border:1px solid #ddd;padding:8px;">값2</td>
  </tr>
</table>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- calls [[apply-inline-styles]] (line 444)
- called_by [[content-to-html]] (line 292)
