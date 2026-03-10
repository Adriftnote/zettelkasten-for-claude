---
title: 개념 노트 템플릿
type: template
tags:
- template
- concept
- basic-memory
permalink: concepts/template-1
---

# 개념 노트 템플릿

이 문서는 **Basic Memory 호환** 개념 노트 작성 가이드입니다.

> **⚠️ 핵심 규칙**
> 1. `[[wikilink]]`는 **Relations 섹션에서만** 사용!
> 2. 다른 곳에서 개념 언급 → 일반 텍스트 또는 `#태그`
>
> Basic Memory는 `- {뭔가} [[링크]]` 패턴을 **문서 전체에서** relation으로 파싱합니다.

---

## 올바른 구조

```markdown
---
title: [개념 이름]
type: concept
tags:
- [카테고리]
- [관련태그]
permalink: knowledge/concepts/[개념-permalink]
category: [분류]
difficulty: 초급 | 중급 | 고급
---

# [개념 이름]

[한 줄 정의 - 무엇인가를 간결하게]

## 📖 개요

[2-3문장 상세 설명]

## 🎭 비유

[일상적인 비유로 개념 설명]

## ✨ 특징

- **특징 1**: 설명
- **특징 2**: 설명
- **특징 3**: 설명

## 💡 예시

[코드 예시나 구체적 사례]

## Relations

- relation_type [[대상노트]] (관계 설명/맥락)
- relation_type [[대상노트|별칭]] (관계 설명/맥락)

---

**난이도**: 중급
**카테고리**: [분류]
**마지막 업데이트**: 2026년 1월
```

---

## Observations 사용 (선택)

Concept 노트에서 Observations는 **선택 사항**입니다. 필요한 경우에만 사용하세요.

### 사용하는 경우 (6개 category, 사실 기반만)

```markdown
## Observations

- [fact] 객관적 사실 #태그
- [method] 방법이나 절차 #태그
- [decision] 선택/결정 기록 #태그
- [example] 구체적 사례 #태그
- [reference] 참고자료 #태그
- [question] 미해결 질문 #태그
```

> **원칙**: 의견 배제, 사실 기반만. 한 observation = 한 가지 정보.

### ❌ 절대 하지 말 것

```markdown
## Observations

- [fact] [[compiler]]는 미리 번역한다   ← ❌ wikilink 금지!
- [fact] 컴파일러는 미리 번역한다 #compiler   ← ✅ 태그로 대체
```

---

## Relations 작성법

### 기본 형식

```markdown
## Relations

- relation_type [[타겟노트]] (관계 설명/맥락)
- relation_type [[타겟노트|표시이름]] (관계 설명/맥락)
```

### 자주 쓰는 관계 타입

| 타입 | 의미 | 예시 |
|------|------|------|
| `relates_to` | 일반적 관련 | `- relates_to [[memory-safety]] (메모리 안전성 관련)` |
| `similar_to` | 유사한 개념 | `- similar_to [[interpreter]] (둘 다 코드 실행)` |
| `different_from` | 대비되는 개념 | `- different_from [[파서 (Parser)]] (파서와 역할 다름)` |
| `extends` | 확장/발전 | `- extends [[ascii]] (ASCII를 확장함)` |
| `part_of` | 구성요소 | `- part_of [[unicode]] (Unicode의 구현체)` |
| `depends_on` | 의존성 | `- depends_on [[런타임 (Runtime)]] (런타임 필요)` |
| `produces` | 생성함 | `- produces [[binary]] (바이너리 생성)` |
| `consumes` | 소비함 | `- consumes [[source-code]] (소스코드 입력)` |
| `mitigates` | 문제 해결 | `- mitigates [[memory-leak]] (메모리 누수 방지)` |
| `hub` | 허브 연결 | `- hub [[프로그래밍 기초 (Programming Basics)]] (소속 허브)` |

### 모범 예시 (lost-in-middle.md)

```markdown
## Relations

- mitigates_by [[progressive-disclosure]] (선택적 로딩으로 해결)
- relates_to [[context-distraction]] (관련 정보 관리 문제)
- part_of [[four-bucket-optimization]] (컨텍스트 엔지니어링 구성요소)
- used_by [[token-optimization-strategy]] (토큰 최적화에 적용)
```

---

## ❌ 피해야 할 패턴

### 1. 본문에서 wikilink 리스트

```markdown
## 특징

- 빠른 실행 ← ✅
- [[compiler]]와 비교하면... ← ❌ 리스트에 wikilink!
```

### 2. 테이블에서 wikilink

```markdown
| 도구 | [[파서 (Parser)]] | 분석 |   ← ❌ relation으로 파싱됨
| 도구 | parser | 분석 |         ← ✅ 일반 텍스트
```

**테이블에 링크가 필요하면 Relations에 추가:**

```markdown
## 🆚 비교

| 도구 | 역할 |
|------|------|
| 파서 | 텍스트 분석 |
| 컴파일러 | 코드 번역 |

## Relations

- different_from [[파서 (Parser)]] (역할이 다름)
```

### 3. blockquote에서 wikilink

```markdown
> 참고: [[가이드]]   ← ❌
> 참고: 가이드 문서  ← ✅
```

### 4. 잘못된 Relations 형식

```markdown
## Relations

- hub [[rust-language]] Rust 가이드   ← ❌ 괄호 없음
- is_a [[compiler]] 언어              ← ❌ 괄호 없음
- hub [[rust-language]] (Rust 가이드) ← ✅ 올바른 형식
```

---

## 타입별 템플릿

### type: concept (일반 개념)

```markdown
---
title: 컴파일러 (Compiler)
type: concept
tags:
- programming-basics
- execution-tools
permalink: knowledge/concepts/compiler
category: 실행 도구
difficulty: 중급
---
```

### type: pattern (패턴/기법)

```markdown
---
title: Progressive Disclosure
type: pattern
tags:
- context-engineering
- optimization
permalink: knowledge/concepts/progressive-disclosure
category: Context Engineering
difficulty: 중급
---
```

### type: architecture (아키텍처)

```markdown
---
title: Knowledge Refinement Pipeline
type: architecture
tags:
- knowledge-management
- data-flow
permalink: knowledge/concepts/knowledge-refinement-pipeline
category: System Architecture
difficulty: 고급
---
```

---

## 체크리스트

개념 노트 작성 시:

- [ ] `type: concept | pattern | architecture` 설정
- [ ] 한 줄 정의 작성
- [ ] 비유(🎭) 추가
- [ ] **⚠️ wikilink는 Relations 섹션에서만 사용!**
- [ ] 본문에서 개념 언급 시 `#태그` 또는 일반 텍스트
- [ ] **Relations 형식 정확함** (`- type [[target]] (설명)`)
- [ ] 난이도/카테고리 명시

---

**생성일**: 2026-01-29
**버전**: 1.0
