---
title: get-arg
type: function
permalink: functions/get-arg
level: low
category: data/sns/validation
semantic: parse cli argument
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- cli
---

# get-arg

CLI 인수 배열에서 특정 이름의 인수 값을 추출하는 헬퍼 함수.

## 시그니처

```js
function getArg(name, defaultVal)
```

## Observations

- [impl] `process.argv.slice(2)`에서 `--name value` 패턴으로 값 추출 #pattern
- [impl] 인수 없으면 `defaultVal` 반환 #pattern
- [return] 인수 값(string) 또는 `defaultVal`

## Relations

- part_of [[verify-integrity]] (소속 모듈)