---
title: Multiple Demand Network (MDN)
type: concept
tags:
  - neuroscience
  - cognition
  - brain
  - code-readability
permalink: knowledge/concepts/multiple-demand-network
category: Neuroscience
difficulty: 중급
---

# Multiple Demand Network (MDN)

**복잡한 인지 작업**을 처리할 때 활성화되는 뇌 영역 네트워크입니다. 코드를 읽을 때도 언어 영역이 아닌 이 영역이 활성화됩니다.

## 📖 개요

Multiple Demand Network(다중 요구 네트워크)는 논리적 추론, 수학, 문제 해결 등 **도메인에 상관없이** 복잡한 인지 작업에 관여하는 뇌 영역입니다. 전두엽과 두정엽에 걸쳐 분포합니다.

## 🎭 비유

**만능 해결사 팀 비유**:
```
회사에서 문제 발생 시:

Language Network = 커뮤니케이션팀
  → 언어, 대화, 글쓰기 담당
  → "이메일 작성해주세요"

Multiple Demand Network = 전략기획팀
  → 복잡한 문제 해결, 논리 분석
  → "이 퍼즐을 풀어주세요"
  → "코드 버그를 찾아주세요"
  → "수학 문제를 풀어주세요"

코드 읽기 = 전략기획팀이 담당!
(언어처럼 보이지만 실제로는 논리 문제)
```

## ✨ 특징

| 특징 | 설명 |
|------|------|
| **Domain-general** | 특정 분야에 국한되지 않음 |
| **Fluid intelligence** | 유동 지능과 관련 |
| **Executive function** | 집행 기능 담당 |
| **Adaptive coding** | 현재 과제에 맞게 적응 |

## 🧠 담당 기능

MDN이 활성화되는 작업들:

- **논리적 추론** - if-then, cause-effect 파악
- **수학적 계산** - 숫자, 패턴 처리
- **공간적 추론** - 구조, 관계 파악
- **문제 해결** - 퍼즐, 알고리즘
- **코드 읽기** - 프로그램 로직 이해

## 💡 코드 읽기와 MDN

### 왜 Language Network가 아닌가?

| 활동 | 활성화 영역 | 이유 |
|------|------------|------|
| 소설 읽기 | Language Network | 언어적 의미, 서사 이해 |
| 코드 읽기 | **MDN** | 논리 구조, 실행 흐름 파악 |
| 대화하기 | Language Network | 의사소통 |
| 수학 풀기 | **MDN** | 논리적 추론 |

### 시사점

```
코드 가독성 ≠ "잘 쓴 글"
코드 가독성 = "잘 정리된 논리"

좋은 코드:
  ✓ 논리적 흐름이 명확
  ✓ 구조적 패턴이 일관됨
  ✓ 추상화 수준이 적절함

나쁜 코드:
  ✗ 로직이 얽혀있음
  ✗ 패턴이 불규칙
  ✗ 추상화가 뒤죽박죽
```

## 🔬 연구 배경

MIT 연구팀의 fMRI 연구 결과:
- 프로그래머가 코드를 읽을 때 Language Network 활성화 미미
- 대신 MDN이 강하게 활성화됨
- Python, ScratchJr 등 언어와 무관하게 동일한 패턴

## ⚡ vs Language Network

| 구분 | Language Network | Multiple Demand Network |
|------|-----------------|------------------------|
| **위치** | 좌측 측두엽, 전두엽 | 전두엽, 두정엽 (양측) |
| **담당** | 언어 이해/생성 | 복잡한 인지 작업 |
| **활성화** | 읽기, 듣기, 말하기 | 추론, 계산, 문제해결 |
| **코드 읽기** | 약함 | **강함** |

## Relations

- contrasts_with [[Default Mode Network]] - 반비례 관계 (집중 vs 휴식)
- related_to [[Cognitive Load (인지 부하)]] - MDN의 처리 한계
- related_to [[Attention]] - 주의 집중과 연관
- explains [[Code Readability]] - 코드 가독성의 신경과학적 기반
- contrasts_with [[Language Network]] - 언어 처리 네트워크

---

**난이도**: 중급
**카테고리**: Neuroscience / Cognitive Science
**출처**: [[03. sources/reference/코드 가독성과 신경과학 - Evan Moon|코드 가독성과 신경과학 - Evan Moon]]
