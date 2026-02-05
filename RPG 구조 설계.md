---
title: RPG 구조 설계
type: note
permalink: shared/rpg-gujo-seolgye
tags:
- meta
- architecture
- rpg
---

# RPG 구조 설계

Repository Planning Graph의 폴더 구조와 노트 작성 규칙

## 📖 개요

RPG는 코드베이스를 그래프 구조로 관리하는 시스템입니다. 함수, 클래스, 모듈을 노드로, 의존성과 호출관계를 엣지로 표현합니다.

**핵심 목적**: 대규모 코드베이스를 LLM이 검색 가능한 형태로 구조화

## Observations

- [fact] RPG는 Repository Planning Graph의 약자 #naming
- [fact] 프로젝트 경로는 C:/claude-workspace/reference/code/ #location
- [method] 제텔카스텐의 허브노트 패턴을 코드 관리에 적용 #pattern
- [fact] 노드는 V_H(고수준/추상) + V_L(저수준/구체)로 구분 #논문
- [fact] 의미 태그는 verb-object 형식으로 정규화 #논문

## 폴더 구조

```
reference/code/
├── functions/    ← 함수 단위 노드 (V_L)
├── classes/      ← 클래스 단위 노드 (V_L)
├── modules/      ← 모듈/파일 단위 노드 (V_H or V_L)
├── projects/     ← 허브노트 (프로젝트별 코드 구성)
└── shared/       ← 메타/설정 문서
```

## 프론트매터 필드

### 필수

```yaml
---
title: 함수/클래스명
type: rpg-function | rpg-class | rpg-module | rpg-project
semantic: "verb object"   # 정규화된 의미 태그
path: "실제/파일/경로.py"
---
```

### 선택 (나중에 필요시 추가)

```yaml
level: high | low         # 추상화 수준
category: "area/cat/sub"  # 의미 계층 (폴더 구조와 별개)
```

## 의미 태그 (verb-object)

코드의 의미를 **"동사 + 목적어"** 형식으로 일관되게 표현

| 코드 | semantic |
|-----|----------|
| `def load_csv()` | "load csv" |
| `class UserValidator` | "validate user" |
| `def send_email()` | "send email" |

## 연결 패턴

```
projects/my-project (허브)
    ├── modules/some-module
    │   ├── functions/func-a
    │   └── functions/func-b
    └── classes/some-class
```

## Relations 패턴

```markdown
## Relations

- contains [[하위노드]] (계층 - 부모→자식)
- depends_on [[노드]] (의존성 - import/require)
- calls [[함수]] (호출 관계)
- data_flows_to [[노드]] (데이터 흐름 - 추상적)
- implements [[인터페이스]] (구현)
- part_of [[모듈]] (소속)
```

## 작성 규칙

- Observations: `- [category] 내용 #태그` 형식
- Relations: `- relation_type [[대상]] (설명)` 형식
- wikilink는 Relations 섹션에서만 사용
- 테이블, blockquote에 wikilink 금지

## Relations

- based_on [[RPG (Repository Planning Graph)]] (논문 개념)
- based_on [[RPG 논문 시리즈 리뷰]] (논문 원본)
