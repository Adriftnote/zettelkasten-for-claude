---
name: hub
description: 노트를 허브노트 형식으로 변환하여 02. hubs에 저장합니다. Obsidian Basic Memory에서 개념들을 조직화하는 허브 생성에 사용합니다.
---

# Hub Note Creator

노트를 허브노트 형식으로 변환합니다.

## 사용법

```
/hub [노트명 또는 주제]
```

- **노트명 지정 시**: 해당 노트를 허브로 변환
- **주제 지정 시**: 해당 주제로 새 허브 생성

## 허브노트란?

관련 개념들을 조직화하고 연결하는 중심 노트입니다. 지식의 목차/인덱스 역할을 합니다.

## 실행 절차

### Step 1: 원본 확인 (노트 지정 시)

```
mcp__basic-memory__read_note
identifier: [노트명]
project: zettelkasten
```

노트가 없으면 주제로 새 허브 생성.

### Step 2: 관련 노트 검색

```
mcp__basic-memory__search_notes
query: [주제 키워드]
project: zettelkasten
```

관련 개념들 파악.

### Step 3: 허브노트로 변환

```yaml
---
title: [허브 이름]
type: hub
tags:
- hub
- [주제태그들]
permalink: hubs/[slug]
---
```

### Step 4: 본문 작성

```markdown
# [허브 이름]

[1-2문장 설명]

## Observations

- [fact] 객관적 사실 #태그
- [method] 방법이나 절차 #태그
- [decision] 선택/결정 사항 #태그

## Relations

- organizes [[개념A]] (1. 설명)
  - extends [[개념A-1]] (1a. 파생)
- organizes [[개념B]] (2. 설명)
- connects_to [[다른-허브]] (연결)
```

### Step 5: 저장

```
mcp__basic-memory__write_note
title: [허브 이름]
folder: 02. hubs
project: zettelkasten
content: [변환된 내용]
```

## Observation 카테고리

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 객관적 사실 | `[fact] Python은 1991년 출시 #역사` |
| `[method]` | 방법, 절차 | `[method] TDD는 테스트 먼저 작성 #개발방법` |
| `[decision]` | 선택/결정 | `[decision] TypeScript 도입 결정 #기술선택` |
| `[example]` | 구체적 사례 | `[example] React 컴포넌트 예시 #프론트엔드` |
| `[reference]` | 참고자료 | `[reference] 공식문서 링크 #문서` |
| `[question]` | 미해결 질문 | `[question] 성능 최적화 방안? #과제` |

## Relations 계층 표현

```markdown
- organizes [[A]] (1)      ← 레벨 0
  - extends [[B]] (1a)     ← 레벨 1 (공백 2칸)
    - part_of [[C]] (1a1)  ← 레벨 2 (공백 4칸)
```

## 핵심 규칙

1. **wikilink는 Relations 섹션에서만** 사용
2. Observations에서는 `#태그` 사용
3. 들여쓰기로 계층 구조 표현
4. 번호 매기기로 구조 명확화

## 예시

### 입력

"JavaScript 허브 만들어줘"

### 출력

```markdown
---
title: JavaScript Hub
type: hub
tags:
- hub
- programming
- frontend
permalink: hubs/javascript
---

# JavaScript Hub

웹 개발의 핵심 프로그래밍 언어인 JavaScript 관련 지식을 조직화합니다.

## Observations

- [fact] 1995년 Brendan Eich가 10일 만에 개발 #역사
- [fact] 브라우저와 Node.js에서 실행 가능 #런타임
- [method] 비동기 처리는 Promise/async-await 사용 #패턴
- [decision] ES6+ 문법을 표준으로 사용 #규칙

## Relations

- organizes [[변수와-스코프]] (1. 기초)
  - extends [[let-const-var]] (1a. 변수 선언)
  - extends [[클로저]] (1b. 스코프 심화)
- organizes [[비동기-처리]] (2. 핵심 개념)
  - extends [[Promise]] (2a. 기본)
  - extends [[async-await]] (2b. 현대 문법)
- organizes [[DOM-조작]] (3. 브라우저)
- connects_to [[TypeScript-Hub]] (타입 확장)
- connects_to [[Node.js-Hub]] (서버사이드)
```
