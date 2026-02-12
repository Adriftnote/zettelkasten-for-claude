---
name: reference
description: reference 노트를 03. sources/reference에 생성합니다. inbox 노트 변환 또는 대화 내용에서 직접 생성. 논문, 공식문서, 가이드 등.
argument-hint: "[링크/노트명/주제]"
---

# Reference Note Creator

reference 노트를 `03. sources/reference`에 생성합니다.

> **목적**: 외부 지식(논문, 문서, 가이드)을 정리하여 나중에 참조

## 실행 모드

| 상황 | 모드 | 방법 |
|------|------|------|
| **메인에서 직접 호출** (`/reference`) | 직접 실행 | 현재 컨텍스트에서 MCP 도구로 바로 저장 |
| **위임이 필요할 때** (팀/오케스트레이터) | 에이전트 위임 | `Task tool: subagent_type=Explore, model=haiku` 로 수동 위임 |

> **MCP 도구 사용**: write_note, edit_note, read_note 등 basic-memory MCP 도구를 직접 사용합니다.

## 핵심 규칙 (반드시 준수)

- **permalink는 반드시 폴더 포함 영문 slug**: `sources/reference/[영문-slug]`
  - O: `sources/reference/ai-video-tools-2026`
  - X: `ai-video-tools-2026` (폴더 누락)
    - 저장된 노트 제목과 permalink 반환
```

## 사용법

```
/reference [노트명 또는 주제]
```

## 실행 절차

### Step 1: 원본 확인 (노트명 지정 시)

```
mcp__basic-memory__read_note
identifier: [노트명]
project: zettelkasten
```

노트가 없으면 대화 내용에서 reference 생성.

### Step 2: 벡터 검색 (중복 방지 + 연결 강화)

노트 작성 전 기존 유사 노트를 검색하여 중복 생성을 방지하고 연결을 강화합니다.

```bash
vecsearch search "[주제 키워드]" --top 5 --unique
```

**결과에 따라:**

| 유사도 | 조치 |
|--------|------|
| 매우 유사 (distance < 14) | 기존 노트 업데이트 (edit_note) — 새로 만들지 않음 |
| 관련 있음 (14~17) | 새 노트 생성 + 🔗 관련 개념에 연결 추가 |
| 관련 없음 (> 17) | 그대로 새 노트 생성 |

### Step 3: type 판단

내용 분석하여 타입 선택:

| 타입 | 용도 | 예시 |
|------|------|------|
| `paper-review` | 논문 리뷰 | AgeMem 논문 리뷰 |
| `doc-summary` | 공식 문서 정리 | Chrome Extension 공식문서 |
| `guide` | 가이드/튜토리얼 | Basic Memory 사용법 |

### Step 4: 형식 작성

> **필수**: permalink는 반드시 **영문 slug**로 지정. basic-memory는 frontmatter의 permalink를 그대로 사용함.
> 한글 제목이어도 permalink는 영문으로. 예: `sources/reference/ai-video-tools-2026`

```yaml
---
title: [제목]
type: paper-review | doc-summary | guide
tags:
- [기술태그]
date: YYYY-MM-DD
permalink: sources/reference/[영문-slug]
---
```

### Step 5: 본문 작성

```markdown
# [제목]

[한 줄 요약]

## 📖 핵심 아이디어

[2-3문장 핵심 설명]

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| ... | ... |

## 🔧 작동 방식 / 적용 방법

[다이어그램이나 코드 블록]

## 💡 실용적 평가 / 적용

[장점, 한계, 실제 적용 방안]

## 🔗 관련 개념

- [[관련개념1]] - 설명
- [[관련개념2]] - 설명

---

**작성일**: YYYY-MM-DD
**분류**: [카테고리]
```

### Step 6: 저장

```
mcp__basic-memory__write_note
title: [제목]
folder: 03. sources/reference
project: zettelkasten
content: [변환된 내용]
```

## 섹션별 가이드

### 📖 핵심 아이디어
- 이 문서/논문의 핵심 주장 2-3문장
- "한 마디로 이게 뭔가?"에 답변

### 🛠️ 구성 요소
- 주요 구성요소나 개념을 테이블로 정리
- 논문: 제안 방법의 구성요소
- 문서: 주요 API/기능

### 🔧 작동 방식
- 어떻게 동작하는지 시각화
- ASCII 다이어그램, 코드 블록 활용

### 💡 실용적 평가
- 실제 적용할 수 있는 점
- 한계나 주의사항
- "우리한테 어떻게 유용한가?"

### 🔗 관련 개념
- wikilink로 연결
- Relations 형식 아님 (단순 링크)

## 핵심 규칙

- **이모지 섹션 헤더** 사용 (📖🛠️🔧💡🔗)
- **🔗 관련 개념**에서 wikilink로 연결 (Relations 형식 아님)
- **Observations 없음** - 외부 지식 정리이므로
- 필요 시 섹션 추가/생략 가능 (유연하게)
