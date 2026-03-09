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
- [impl] 첫 번째 행(idx===0)은 헤더로 처리: `<td><strong>내용</strong></td>` (Flow 네이티브 방식 — `<th>` 미사용) #pattern
- [impl] 셀 분리: `tline.split('|').filter((c, ci, arr) => ci > 0 && ci < arr.length - 1)` — 양끝 빈 셀 제거 #algo
- [impl] 균등 컬럼 너비: `colWidth = Math.floor(605 / colCount)` — Flow 기본 테이블 폭 605px 기준 #pattern
- [impl] 각 셀 내용에 `applyInlineStyles()` 적용 (굵게/기울임/코드 인라인) #pattern
- [return] 테이블 행이 Flow 에디터 네이티브 포맷으로 교체된 문자열 (나머지 줄은 그대로)
- [note] contentToHtml의 2단계 전처리: 코드블록 변환 후 실행되므로 코드 안의 `|`는 이미 테이블로 래핑된 상태 #context

## 출력 HTML 구조
```html
<!-- Flow 에디터 네이티브 포맷 (editor-table-wrap 래퍼 필수) -->
<div class="editor-table-wrap">
  <table border="1" cellspacing="1" cellpadding="1" style="width:605px">
    <tbody>
      <tr>
        <td style="width:302px"><strong>헤더1</strong></td>
        <td style="width:302px"><strong>헤더2</strong></td>
      </tr>
      <tr>
        <td style="width:302px">값1</td>
        <td style="width:302px">값2</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- calls [[apply-inline-styles]] (line 444)
- called_by [[content-to-html]] (line 292)
