---
name: concept
description: 컨셉노트를 01. concepts에 생성합니다. 단일 개념 정의와 Relations 연결.
---

# Concept Note Creator

컨셉노트를 생성합니다.

## 사용법

```
/concept [노트명]
```

- **노트명 생략 시**: 사용자에게 변환할 노트명 질문
- **노트명 지정 시**: 해당 노트 변환

## 실행 절차

### Step 1: 원본 노트 읽기

```
mcp__basic-memory__read_note
identifier: [노트명]
project: zettelkasten
```

노트를 찾을 수 없으면 사용자에게 알림.

### Step 2: 컨셉노트로 변환

원본 내용을 분석하여 아래 형식으로 변환:

```yaml
---
title: [개념 이름]
type: concept
permalink: knowledge/concepts/[slug]
tags:
- [카테고리]
category: [분류]
difficulty: 초급 | 중급 | 고급
---
```

### Step 3: 본문 작성

1. **# 제목** - 한 줄 정의
2. **📖 개요** - 2-3문장 상세 설명
3. **🎭 비유** - 일상적 비유 (선택)
4. **✨ 특징** - 불릿 리스트
5. **💡 예시** - 코드나 구체적 사례 (선택)
6. **🔗 내 연결** - 루만식 한 줄 메모 (필수)
7. **Relations** - 관계 링크

**🔗 내 연결 작성법:**

concept 저장 전에 반드시 사용자에게 질문:

> "이 개념, 내가 아는 거랑 어떻게 연결돼? 어디서 겪어봤거나 다른 개념이랑 부딪히는 느낌 있으면 한 줄로."

사용자 답변을 그대로 기록. 형식 없음. 자기한테 하는 메모.

예시:
- "이거 캐시라인 얘기랑 같은 원리 아닌가?"
- "지난주 Tool-Hub 짤 때 이 패턴 그대로 썼음"
- "RAG랑 반대 방향인 것 같은데"
- (모르겠으면 "아직 연결점 안 보임"도 가능)

### Step 4: 저장

```
mcp__basic-memory__write_note
title: [개념 이름]
folder: 01. concepts
project: zettelkasten
content: [변환된 내용]
```

## Relations 형식

```markdown
## Relations

- relates_to [[관련노트]] (설명)
- similar_to [[유사노트]] (공통점)
- different_from [[대조노트]] (차이점)
- part_of [[상위개념]] (포함관계)
- used_by [[활용처]] (사용처)
- enables [[가능해지는것]] (가능케 함)
```

## 핵심 규칙

1. **wikilink는 Relations 섹션에서만** 사용
2. 본문에서 개념 언급 시 `#태그` 또는 일반 텍스트
3. 테이블, blockquote에 wikilink 금지
4. 원본의 핵심 내용은 보존하되 형식만 변환

## 예시

### 입력 (inbox 노트)

```markdown
# API란?

API는 Application Programming Interface의 약자.
프로그램들이 서로 대화하는 방법이라고 보면 됨.

예를 들어 레스토랑에서 웨이터가 손님 주문을 주방에 전달하는 것처럼,
API가 앱의 요청을 서버에 전달함.

REST API, GraphQL 등이 있음.
```

### 출력 (concept 노트)

```markdown
---
title: API
type: concept
permalink: knowledge/concepts/api
tags:
- 개발
- 백엔드
category: 기술
difficulty: 초급
---

# API

프로그램 간 통신을 위한 인터페이스 (Application Programming Interface)

## 📖 개요

API는 서로 다른 소프트웨어 시스템이 상호작용할 수 있게 해주는 인터페이스입니다. 정해진 규칙에 따라 요청을 보내면 응답을 받는 구조로 작동합니다.

## 🎭 비유

레스토랑의 웨이터와 같습니다. 손님(클라이언트)이 메뉴를 보고 주문하면, 웨이터(API)가 주방(서버)에 전달하고 음식(응답)을 가져다줍니다.

## ✨ 특징

- 표준화된 요청/응답 형식
- 내부 구현 숨김 (추상화)
- 재사용 가능한 기능 제공

## 💡 예시

```python
import requests
response = requests.get("https://api.example.com/users")
```

## Relations

- part_of [[백엔드]] (구성요소)
- relates_to [[REST]] (구현 방식)
- relates_to [[GraphQL]] (대안 방식)
```
