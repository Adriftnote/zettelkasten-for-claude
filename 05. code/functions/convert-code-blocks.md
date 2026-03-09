---
title: convert-code-blocks
type: function
permalink: functions/convert-code-blocks
level: low
category: automation/workflow/conversion
semantic: convert fenced code blocks to html
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
- html
---

# convert-code-blocks

마크다운 펜스 코드블록(` ```lang ... ``` `)을 Flow.team용 `<pre><code>` HTML로 변환

## 시그니처

```javascript
function convertCodeBlocks(content: string): string
```

## Observations
- [impl] 단일 정규식으로 전체 content를 한 번에 치환: `` /```(\w*)\s*\n?([\s\S]*?)```/g `` #regex
- [impl] 언어명(`\w*`)은 캡처해서 `[lang]` 레이블로 출력 — `lang ? '<strong>[lang]</strong><br>' : ''` #pattern
- [impl] HTML 특수문자 이스케이프 3단계: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;` #algo
- [impl] 줄바꿈을 `<br>`로 교체: Flow 에디터가 `\n`을 렌더링하지 않기 때문 #caveat
- [impl] `[\s\S]*?` non-greedy 매칭으로 여러 코드블록이 하나로 합쳐지는 것 방지 #regex
- [impl] Flow 에디터는 `<pre><code>` 수정 시 깨지는 문제 → `editor-table-wrap` 1칸 테이블로 대체 (수정 후에도 구조 유지) #caveat
- [impl] 배경색 `#f5f5f5`, `font-family:monospace`, `font-size:13px` 인라인 스타일로 코드 시각화 #pattern
- [return] 코드블록이 Flow 에디터 네이티브 1칸 테이블 포맷으로 교체된 문자열
- [note] contentToHtml의 1단계 전처리: 테이블 변환 전에 실행해야 코드 안의 `|`가 테이블로 오파싱되지 않음 #caveat

## 출력 HTML 구조
```html
<!-- Flow 에디터 네이티브 포맷 — 1칸 테이블로 코드블록 표현 -->
<div class="editor-table-wrap">
  <table border="1" cellspacing="1" cellpadding="1" style="width:605px">
    <tbody>
      <tr>
        <td style="background:#f5f5f5;padding:8px;font-family:monospace;font-size:13px">
          <strong>[python]</strong><br>
          def hello():<br>
          &nbsp;&nbsp;&nbsp;&nbsp;pass
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- called_by [[content-to-html]] (line 289)
