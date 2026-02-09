---
title: 범용 프로그래밍 언어 (General-Purpose Language)
type: concept
permalink: knowledge/concepts/general-purpose-language
tags:
- 프로그래밍
- 언어설계
category: 컴퓨터과학
difficulty: 초급
---

# 범용 프로그래밍 언어 (General-Purpose Language)

특정 도메인에 국한되지 않고 다양한 종류의 프로그램을 만들 수 있는 언어

## 📖 개요

범용 프로그래밍 언어(GPL)는 웹, 모바일, 서버, 데이터 분석, 게임 등 거의 모든 영역의 소프트웨어를 만들 수 있도록 설계된 언어입니다. DSL이 "하나의 일을 잘 하는 전문 도구"라면, GPL은 "무엇이든 만들 수 있는 범용 도구"입니다. 그만큼 표현력이 넓지만, 특정 도메인에서는 DSL보다 장황해질 수 있습니다.

## 🎭 비유

스위스 아미 나이프와 같습니다. 칼, 가위, 드라이버, 병따개 등 여러 도구가 하나에 들어있어 대부분의 상황에서 쓸 수 있습니다. 하지만 요리할 때는 전문 요리칼(DSL)이, 나사 조일 때는 전동 드라이버(DSL)가 더 편리합니다.

## ✨ 특징

- **범용성**: 거의 모든 종류의 프로그램 작성 가능
- **튜링 완전**: 이론적으로 모든 계산을 표현 가능
- **생태계**: 라이브러리, 프레임워크, 커뮤니티가 풍부
- **학습 곡선**: DSL보다 배울 것이 많음
- **장황함**: 특정 도메인 작업에서는 DSL보다 코드가 길어짐

## 💡 예시

### 대표적인 범용 언어

| 언어 | 주요 활용 분야 |
|------|---------------|
| Python | 데이터 분석, 웹, AI, 자동화 |
| JavaScript | 웹 프론트/백엔드, 모바일 |
| Java | 엔터프라이즈, 안드로이드 |
| C/C++ | 시스템, 게임, 임베디드 |
| Go | 서버, 클라우드 인프라 |
| Rust | 시스템, 고성능 |
| TypeScript | 웹 (JavaScript + 타입) |

### GPL vs DSL 비교

```python
# GPL (Python): 데이터 필터링 - 단계별로 명시
import csv
results = []
with open('users.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if int(row['age']) > 20:
            results.append(row['name'])
```

```sql
-- DSL (SQL): 같은 작업 - 한 줄로 선언
SELECT name FROM users WHERE age > 20;
```

특정 도메인에서는 DSL이 훨씬 간결하지만, GPL은 어떤 작업이든 처리할 수 있는 유연성을 가집니다.

## Relations

- different_from [[DSL (Domain-Specific Language)]] (범용 vs 특화)
- relates_to [[명령형 프로그래밍 (Imperative Programming)]] (GPL의 주된 패러다임)
- relates_to [[선언형 프로그래밍 (Declarative Programming)]] (일부 GPL도 선언형 지원)