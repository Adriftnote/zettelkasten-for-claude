---
title: RPG (Repository Planning Graph)
type: concept
permalink: knowledge/concepts/rpg
tags:
- code-representation
- ai-engineering
- software-architecture
category: AI/코드 표현
difficulty: 고급
---

# RPG (Repository Planning Graph)

저장소의 기능과 구현 로직을 노드와 엣지로 인코딩하는 구조화된 그래프 표현

## 📖 개요

RPG는 소프트웨어 저장소를 그래프 구조로 표현하는 방법입니다. 자연어 기반 계획의 모호성과 계층 구조 부재 문제를 해결하기 위해 제안되었습니다. 노드는 기능(함수, 클래스, 모듈 등)을, 엣지는 관계(데이터 흐름, 실행 순서, 의존성)를 나타냅니다.

## 🎯 핵심 문제와 해결

```
[문제]
대규모 레포 (수만 LOC) → 컨텍스트 윈도우 한계 → 전체 못 넣음
                                              ↓
                                    "LLM에게 어떻게 이해시키지?"

[해결]
코드 → 구조화 쪼개기 → 의미론 태그 + 의존성 관계 → 저장
                              ↓
                질문 → 검색 → 관련 코드만 LLM에 전달
```

**핵심 공식**: `RPG = 코드베이스의 "검색 인덱스" + "네비게이션 맵"`

## 🎭 비유

건물의 설계도와 같습니다. 설계도 없이 "쇼핑몰 지어줘"라고 하면 작은 건물만 가능하지만, RPG라는 상세 설계도가 있으면 수천 개의 방(기능)이 있는 대형 건물도 정확하게 지을 수 있습니다.

## ✨ 특징

- **계층적 노드 구조**: 레포지토리 → 모듈 → 파일 → 클래스 → 함수 (5단계)
- **이중 의미**: 각 노드가 기능 관점과 구조 관점 모두 표현
- **엣지 유형**: 계층 연결(부모-자식), 데이터 흐름, 실행 순서
- **양방향 활용**: 코드 생성(ZeroRepo)과 코드 이해(RPG-Encoder) 모두 지원
- **확장성**: 1,000개 이상의 기능도 구조화 가능

### 노드의 속성 2개

| 속성 | 설명 | 예시 |
|-----|------|------|
| **의미론** (semantic) | 뭘 하는지 | "load csv file" |
| **위상** (structural) | 어디에 있는지 | `src/data/loader.py::load_csv` |

### 엣지의 종류 2개

| 종류 | 설명 | 출처 |
|-----|------|------|
| **기능** (feature) | 추상적 데이터 흐름 | LLM 추론 |
| **의존성** (dependency) | 코드 레벨 연결 | AST 추출 |

> **Ablation 결과**: 의미론 + 위상 구조는 상호 보강적 → 둘 다 필수

## 💡 예시

```
수식: G = (V, E)
     V = V_H ∪ V_L (고수준 + 저수준 노드)
     E = E_feature ∪ E_dep (기능 + 의존성 엣지)

실제 예시:
쇼핑몰_앱 [노드1: 루트]
   ↓
사용자관리/ [노드2: 모듈]
   ↓
login.py [노드3: 파일]
   ↓
User [노드4: 클래스]
   ↓
login() [노드5: 함수]
```

## Relations

- part_of [[Knowledge Graph (지식 그래프)]] (코드 특화 버전)
- relates_to [[code-granularity]] (계층 구조 표현)
- relates_to [[의존성 (Dependency)]] (의존성 관계 표현)
- connects_to [[context-engineering]] (컨텍스트 윈도우 한계 해결)
- connects_to [[Hybrid Search]] (의미론적 검색 활용)
- enables [[Code Generation]] (코드 생성 가능케 함)
- enables [[Code Understanding]] (코드 이해 가능케 함)
- used_by [[RPG 논문 시리즈 리뷰]] (연구 출처)

---

**난이도**: 고급
**카테고리**: AI/코드 표현
**출처**: Microsoft Research - ZeroRepo, RPG-Encoder 논문
**마지막 업데이트**: 2026년 2월