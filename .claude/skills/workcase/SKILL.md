---
name: workcase
description: Use when documenting troubleshooting experiences, learning summaries, or converting inbox notes to structured workcases. Triggers on problem-solving records, debugging journals, lessons learned.
argument-hint: "[노트명 또는 주제]"
---

# Workcase Note Creator

workcase 노트를 `03. sources/workcases`에 생성합니다.

> **목적**: 업무 경험에서 배운 것을 기록하여 재사용

> **MCP 도구 사용 가능**: write_note, edit_note, read_note 등 basic-memory MCP 도구를 사용할 수 있습니다.

## 핵심 규칙 (반드시 준수)

- **permalink는 반드시 폴더 포함 영문 slug**: `sources/workcases/[영문-slug]`
  - O: `sources/workcases/wsl-tmux-memory-issue`
  - X: `wsl-tmux-memory-issue` (폴더 누락)
- **Relations 섹션 없음** - workcase는 경험 기록이므로
- **Observations 필수** - 배운 것을 명시적으로 추출
- **관련 Task 섹션** - 업무 맥락 연결

## 실행 절차

### Step 1: 원본 확인 (노트명 지정 시)

```
mcp__basic-memory__read_note
identifier: [노트명]
project: zettelkasten
```

노트가 없으면 대화 내용에서 workcase 생성.

### Step 2: 벡터 검색 (중복 방지 + 연결 강화)

노트 작성 전 기존 유사 노트를 검색하여 중복 생성을 방지하고 연결을 강화합니다.

```bash
vecsearch search "[주제 키워드]" --top 5 --unique
```

**결과에 따라:**

| 유사도 | 조치 |
|--------|------|
| 매우 유사 (distance < 14) | 기존 노트 업데이트 (edit_note) — 새로 만들지 않음 |
| 관련 있음 (14~17) | 새 노트 생성 + Observations에 관련 노트 언급 |
| 관련 없음 (> 17) | 그대로 새 노트 생성 |

### Step 3: 패턴 판단

내용 분석하여 패턴 선택:
- **트러블슈팅**: 문제 해결 과정 → 패턴 A
- **학습정리**: 새로 배운 것 → 패턴 B

### Step 4: 형식 변환

> **필수**: permalink는 반드시 **폴더 포함 영문 slug**로 지정.
> basic-memory는 frontmatter의 permalink를 그대로 사용함.
> 예: `sources/workcases/wsl-tmux-memory-issue`

```yaml
---
title: [제목]
type: workcase
tags:
- [기술태그]
permalink: sources/workcases/[영문-slug]
---
```

### Step 5: 본문 작성

#### 패턴 A: 트러블슈팅

```markdown
# [제목]

## 문제 상황
[어떤 문제가 발생했는지]

## 시도했지만 안 된 방법
[선택 - 삽질 기록]

## 근본 원인
[왜 발생했는지 - 다이어그램 권장]

## 해결책
[어떻게 해결했는지 - 코드/설정 포함]

## 적용
[어디에 적용했는지]

## 관련 Task
- task-YYYYMMDD-NNN: 설명

## Observations
- [fact] 객관적 사실 #태그
- [solution] 해결책 요약 #태그
- [warning] 주의사항 #태그
```

#### 패턴 B: 학습 정리

```markdown
# [제목]

> [프로젝트/작업] 하면서 학습한 내용

## 1. 전체 흐름
[다이어그램으로 큰 그림]

## 2. 핵심 개념
### [개념 1]
[설명]

### [개념 2]
[설명]

## 3. 실제 적용
[코드나 설정 예시]

## 관련 Task
- task-YYYYMMDD-NNN: 설명

## Observations
- [fact] 객관적 사실 #태그
- [pattern] 발견한 패턴 #태그
- [method] 방법/절차 #태그
- [tech] 기술 팁 #태그
```

### Step 6: 저장

```
mcp__basic-memory__write_note
title: [제목]
folder: 03. sources/workcases
project: zettelkasten
content: [변환된 내용]
```

## Observation 카테고리

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 객관적 사실 | "PowerShell 5.x는 CP949로 읽음" |
| `[solution]` | 해결책 | "UTF-8 BOM 추가로 해결" |
| `[warning]` | 주의사항 | "OutputEncoding은 출력만 변경" |
| `[pattern]` | 반복 패턴 | "Content/Background 역할 분리" |
| `[method]` | 방법/절차 | "System.Text.UTF8Encoding($true)" |
| `[tech]` | 기술 팁 | "PowerShell 7+는 기본 UTF-8" |
