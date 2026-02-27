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
- [impl] 언어명(`\w*`)은 캡처하지만 현재는 미사용 (향후 syntax highlight 확장 여지) #note
- [impl] HTML 특수문자 이스케이프 3단계: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;` #algo
- [impl] 줄바꿈을 `<br>`로 교체: Flow 에디터가 `\n`을 렌더링하지 않기 때문 #caveat
- [impl] `[\s\S]*?` non-greedy 매칭으로 여러 코드블록이 하나로 합쳐지는 것 방지 #regex
- [return] 코드블록이 `<pre><code>...</code></pre>`로 교체된 문자열
- [note] contentToHtml의 1단계 전처리: 테이블 변환 전에 실행해야 코드 안의 `|`가 테이블로 오파싱되지 않음 #caveat

## 출력 HTML 구조

```html
<pre style="background:#f5f5f5;padding:10px;border-radius:4px;overflow-x:auto;">
  <code>{HTML-escaped 코드, 줄바꿈=<br>}</code>
</pre>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- called_by [[content-to-html]] (line 289)
