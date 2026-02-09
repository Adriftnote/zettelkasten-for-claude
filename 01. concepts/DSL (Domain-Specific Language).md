---
title: DSL (Domain-Specific Language)
type: concept
permalink: knowledge/concepts/dsl
tags:
- 프로그래밍
- 언어설계
category: 컴퓨터과학
difficulty: 초급
---

# DSL (Domain-Specific Language)

특정 도메인의 문제를 풀기 위해 설계된 전용 언어

## 📖 개요

DSL은 범용 프로그래밍 언어(Python, JavaScript 등)와 달리, 하나의 특정 영역(도메인)에 최적화된 작은 언어입니다. 좁은 범위에서 "무엇을" 할지 선언적으로 기술하며, 해당 도메인 전문가도 읽고 이해할 수 있도록 설계됩니다. DSL 코드를 해석하려면 별도의 파서가 필요합니다.

## 🎭 비유

요리 레시피와 같습니다. 프로그래밍 언어가 "모든 것을 만들 수 있는 공작 기계"라면, DSL은 "특정 요리만 잘 만드는 레시피북"입니다. 레시피는 요리사(파서)가 읽고 실행하며, 요리를 모르는 사람도 대략 무슨 음식인지 알 수 있습니다.

## ✨ 특징

- **좁은 범위**: 한 가지 도메인의 일만 잘 함
- **선언적**: "어떻게"가 아닌 "무엇을" 기술
- **가독성**: 해당 도메인 전문가도 이해 가능
- **파서 필요**: DSL을 해석하는 별도 도구가 있어야 동작
- **범용 언어 대비 간결**: 같은 작업을 훨씬 적은 코드로 표현

## 💡 예시

| DSL           | 도메인        | 하는 일                    |
| ------------- | ---------- | ----------------------- |
| SQL           | 데이터베이스     | 데이터 조회/조작               |
| HTML          | 웹 문서       | 문서 구조 정의                |
| CSS           | 스타일링       | 시각적 스타일 정의              |
| RegEx         | 텍스트 패턴     | 문자열 패턴 매칭               |
| Mermaid       | 다이어그램      | 차트/흐름도 정의               |
| LikeC4 DSL    | 아키텍처       | 시스템 구조 정의               |
| 엑셀 수식         | 스프레드시트 계산  | =SUM(A1:A10)            |
| Power Query M | 데이터 변환/ETL | `Table.SelectRows(...)` |
| DAX           | 데이터 분석(피벗) | `CALCULATE(SUM(...))`   |

```sql
-- SQL: 데이터베이스 도메인의 DSL
SELECT name FROM users WHERE age > 20;
```

```html
<!-- HTML: 웹 문서 도메인의 DSL -->
<h1>제목</h1>
<p>본문입니다</p>
```

```excel
// 엑셀 수식: 스프레드시트 도메인의 DSL (가장 많은 비개발자가 사용하는 DSL)
=IF(SUM(A1:A10) > 100, "초과", "미만")
```

## Relations

- different_from [[범용 프로그래밍 언어 (General-Purpose Language)]] (범용 vs 특화)
- relates_to [[선언형 프로그래밍 (Declarative Programming)]] (DSL의 주된 패러다임)
- used_by [[LikeC4 - 코드 기반 아키텍처 다이어그램 도구]] (아키텍처 DSL 활용)
- relates_to [[01. concepts/파서 (Parser)]] (DSL 해석에 필요)