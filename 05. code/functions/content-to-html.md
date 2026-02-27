---
title: content-to-html
type: function
permalink: 05.-code/functions/content-to-html
level: low
category: automation/workflow/conversion
semantic: convert markdown to html
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- markdown
- html
---

# content-to-html

마크다운 문자열을 Flow.team 에디터가 렌더링할 수 있는 HTML로 변환하는 파이프라인 진입점

## 시그니처

```javascript
function contentToHtml(content: string): string
```

## Observations

- [impl] 2단계 전처리 → 라인별 순회 → 후처리 파이프라인 구조 #algo
- [impl] 전처리 순서 중요: 코드블록 먼저 → 테이블 → 라인 파싱. 코드블록 내부 `|`가 테이블로 오파싱되는 것을 방지 #caveat
- [impl] 중첩 리스트를 스택(`listStack`)으로 추적: `{type: 'ul'|'ol', indent: number}[]` #pattern
- [impl] `closeListsToIndent(targetIndent)` / `closeAllLists()` 클로저로 스택 관리 — 들여쓰기 감소 시 스택에서 pop하며 닫는 태그 emit #algo
- [impl] 이미 변환된 HTML 행(table/tr/th/td 시작)은 그대로 통과시켜 이중 변환 방지 #pattern
- [impl] 리스트 연속성: 빈 줄이 리스트 스택 안에 있으면 무시(리스트 분리 방지), 바깥에서는 `<div><br></div>` emit #algo
- [return] 연결된 HTML 문자열 (result 배열을 `join('')`)
- [usage] `createTaskAPI`, `createSubtaskAPI`에서 task content 전달 전 호출

## 변환 파이프라인

```
입력: MD 문자열
    ↓
[1] convertCodeBlocks()     ─── ```lang\n...\n``` → <pre><code>...</code></pre>
    ↓
[2] convertTables()         ─── | col | ... | 행 그룹 → <table>...</table>
    ↓
[3] split('\n') 라인 순회
    │
    ├─ <table|tr|th|td 시작 행  → 그대로 통과 (이중변환 방지)
    ├─ --- / *** / ___ (3+)     → <hr>
    ├─ ### / ## / #             → <h3>/<h2>/<h1> + applyInlineStyles()
    ├─ 숫자 리스트 N. text      → <ol><li> (스택 관리)
    ├─ 불릿 - text             → <ul><li> (스택 관리)
    ├─ 빈 줄                    → 리스트 안이면 skip / 밖이면 <div><br></div>
    └─ 일반 텍스트              → closeAllLists() + <div>applyInlineStyles()</div>
    ↓
[4] closeAllLists()          ─── 파일 끝에 남은 리스트 스택 전부 닫기
    ↓
출력: result.join('') HTML 문자열
```

## 중첩 리스트 스택 동작

```
입력 MD:
  - A
    - B
    - C
  - D

처리 흐름:
  "- A"  indent=0  → listStack=[], push <ul>(indent=0) → listStack=[{ul,0}], emit <li>A</li>
  "  - B" indent=2 → closeListsToIndent(3): 0<3 → 유지, push <ul>(indent=2) → listStack=[{ul,0},{ul,2}], emit <li>B</li>
  "  - C" indent=2 → closeListsToIndent(3): top.indent=2<3 → 유지, 재사용, emit <li>C</li>
  "- D"   indent=0 → closeListsToIndent(1): pop {ul,2}→emit </ul>, top {ul,0}.indent=0<1 → 유지, emit <li>D</li>
  EOF    → closeAllLists(): pop {ul,0}→emit </ul>
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- calls [[convert-code-blocks]] (line 289)
- calls [[convert-tables]] (line 292)
- called_by [[create-subtask-api]] (line 555)
- called_by [[create-task-api]] (line 491)
