---
title: 선언형 프로그래밍 (Declarative Programming)
type: concept
permalink: knowledge/concepts/declarative-programming
tags:
- 프로그래밍
- 패러다임
category: 컴퓨터과학
difficulty: 초급
---

# 선언형 프로그래밍 (Declarative Programming)

"어떻게(How)" 가 아니라 "무엇을(What)" 원하는지 기술하는 프로그래밍 패러다임

## 📖 개요

선언형 프로그래밍은 원하는 결과를 선언하면, 실행 방법은 시스템이 알아서 결정하는 방식입니다. 개발자는 "무엇을 얻고 싶은지"만 표현하고, "어떤 순서로 어떻게 처리할지"는 신경 쓰지 않습니다. 명령형 프로그래밍의 반대 개념이며, 대부분의 DSL이 이 패러다임을 따릅니다.

## 🎭 비유

택시를 탈 때와 같습니다. 선언형은 "강남역으로 가주세요"(목적지만 말함), 명령형은 "직진하세요, 두 번째 사거리에서 우회전, 300m 후 좌회전..."(경로를 하나하나 지시). 둘 다 강남역에 도착하지만, 선언형은 운전사(시스템)에게 방법을 맡깁니다.

## ✨ 특징

- **결과 중심**: 과정이 아닌 최종 결과를 기술
- **추상화 수준 높음**: 내부 구현을 몰라도 사용 가능
- **가독성 좋음**: 의도가 코드에 바로 드러남
- **최적화 위임**: 시스템이 실행 방법을 최적화
- **부수효과 최소화**: 상태 변경을 줄이는 경향

## 💡 예시

### 선언형 vs 명령형 비교

```javascript
// 명령형: "어떻게" 필터링하는지 설명
const results = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age > 20) {
    results.push(users[i]);
  }
}

// 선언형: "무엇을" 원하는지만 선언
const results = users.filter(user => user.age > 20);
```

```sql
-- SQL: 선언형의 대표 사례
-- "20살 넘는 사용자의 이름을 가져와" (어떻게 검색할지는 DB 엔진이 결정)
SELECT name FROM users WHERE age > 20;
```

### 선언형 언어/기술 예시

| 언어/기술 | 선언하는 것 |
|-----------|------------|
| SQL | 원하는 데이터 |
| HTML | 문서 구조 |
| CSS | 시각적 스타일 |
| React JSX | UI 상태 |
| Kubernetes YAML | 인프라 상태 |
| 엑셀 수식 | 계산 결과 |

## Relations

- different_from [[명령형 프로그래밍 (Imperative Programming)]] (How vs What)
- relates_to [[DSL (Domain-Specific Language)]] (DSL의 주된 패러다임)
- relates_to [[함수형 프로그래밍 (Functional Programming)]] (선언형의 하위 패러다임)
- organized_by [[프로그래밍 패러다임]] (패러다임 허브)