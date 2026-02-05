---
title: RPG 논문 시리즈 리뷰
type: paper-review
permalink: sources/reference/rpg-series
tags:
- code-understanding
- code-generation
- repository-agent
- graph-representation
- microsoft-research
date: 2026-02-05
---

# RPG 논문 시리즈 리뷰

Repository Planning Graph(RPG) 기반으로 대규모 저장소 생성과 이해를 통합하는 2편의 연속 논문

## 📖 핵심 아이디어

### 연구 시리즈 구조

```
[1차 논문] ZeroRepo (2025.10)
           의도 → 코드 (생성)
                ↓
[2차 논문] RPG-Encoder (2026.02)  
           코드 → 의도 (이해)
                ↓
[완성] Closed Loop - 양방향 순환
```

### RPG란?

Repository Planning Graph - 저장소의 기능과 구현 로직을 노드와 엣지로 인코딩하는 구조화된 표현

**등장 배경 (기존 문제점)**
- 자연어 기반 계획의 모호성
- 명시적 계층 구조 부재로 의존성 추적 어려움
- 장기 계획에서 점진적 품질 저하
- 불완전하거나 중복되는 기능 제안

## 🛠️ RPG 구조

### 노드 (이중 의미)

| 수준 | 기능 관점 | 구조 관점 |
|-----|----------|----------|
| 고수준 | 모듈 (알고리즘, 평가 등) | 파일 영역 |
| 중간 | 컴포넌트 (세부 기능 분해) | 파일 |
| 리프 | 구체적 알고리즘 | 함수/클래스 |

### 엣지

| 유형 | 설명 | 표시 |
|-----|------|-----|
| 모듈 간 | 데이터 흐름 | 검은색 화살표 |
| 모듈 내 | 파일 수준 순서 | 회색 점선 |

```
수식: G = (V, E)
     V = V_H ∪ V_L (고수준 + 저수준 노드)
     E = E_feature ∪ E_dep (기능 + 의존성 엣지)
```

## 🔧 1차 논문: ZeroRepo (생성)

**목적**: RPG를 활용해 완전한 저장소를 처음부터 생성

### 3단계 파이프라인

```
[1] 제안 수준 구축
    사용자 사양 → Feature Tree → 모듈식 기능 그래프
    - Explore-Exploit 전략으로 서브트리 선택
    
[2] 구현 수준 구축
    기능 그래프 → 완전한 RPG
    - 파일 구조 인코딩
    - 데이터 흐름 인코딩 (글로벌/로컬)
    - 인터페이스 추상화
    - 함수 인코딩
    
[3] 그래프 가이드 코드 생성
    RPG → 위상 순서 순회 → 코드
    - TDD 적용
    - 그래프 가이드 지역화/편집/검증
```

### 성능 (RepoCraft 벤치마크)

| 지표 | ZeroRepo (o3-mini) | vs Claude Code |
|-----|-------------------|----------------|
| 커버리지 | 81.5% | +27.3% |
| 정확도 | 69.7% | +35.8% |
| 코드 규모 | 36K LOC | 3.9× |
| 참신성 | 13.6% (150+ 새 기능) | - |

## 🔧 2차 논문: RPG-Encoder (이해)

**목적**: 기존 코드베이스를 RPG로 변환하여 순환 완성

### 3가지 메커니즘

#### 1. 인코딩 (Encoding)

```
[Phase 1] Semantic Lifting
          코드 엔티티 → 원자적 의미 특징
          정규화된 verb-object 구문
          
[Phase 2] Latent Architecture Recovery
          특징 → 3단계 계층
          <functional area>/<category>/<subcategory>
          
[Phase 3] Artifact Grounding
          추상 구조 → 물리적 디렉토리
          AST 분석으로 의존성 엣지 주입
```

#### 2. 진화 (Evolution)

| 이벤트 | 처리 방법 |
|-------|----------|
| DELETE | 재귀적 정리 (recursive pruning) |
| MODIFY (마이너) | 제자리 업데이트 |
| MODIFY (주요) | 재라우팅 (삭제 후 재삽입) |
| INSERT | LLM 기반 의미론적 라우팅 |

**효과**: 95.7% 오버헤드 감소 (변경 규모에 비례)

#### 3. 운영 (Operation)

| 도구 | 기능 |
|-----|------|
| SearchNode | 의미 특징/메타데이터 기반 검색 |
| FetchNode | 노드별 데이터 + 소스 코드 추출 |
| ExploreRPG | 의존성/포함 관계 순회 |

**패턴**: Semantic discovery → Precision verification → Local expansion

### 성능

| 벤치마크 | 모델 | 결과 | 개선폭 |
|---------|------|------|--------|
| SWE-bench Verified | Claude-4.5-Sonnet | 93.7% Acc@5 | +14.4% |
| SWE-bench Live | GPT-5 | 87.8% Acc@5 | +11.6% |
| RepoCraft 재구성 | GPT-5-mini | 98.5% 커버리지 | +24.3% |

### Ablation 결과

- 의미론적 특징 제거: 50.5% → 43.1% (함수 Acc@1)
- 의존성 엣지 제거: 파일 수준 검색 저하
- **결론**: 의미론 + 위상 구조 = 상호 보강적, 둘 다 필수

## 💡 실용적 평가 / 적용

### 응용 시나리오

| 시나리오 | 프레임워크 | 입력 | 출력 |
|---------|-----------|------|------|
| 저장소 생성 | ZeroRepo | 자연어 사양 | 완전한 레포 |
| 저장소 이해 | RPG-Encoder | 기존 코드 | RPG 표현 |
| 유지보수 | 증분 업데이트 | 커밋 diff | 업데이트된 RPG |
| 재구성 | RPG-Encoder | 문서/RPG | 복원된 코드 |

### vs 기존 방법

| 비교 대상 | 한계 | RPG 장점 |
|----------|-----|---------|
| API 문서 | 구조적 지침 부족 (17% 복원) | 98.5% 복원 |
| 의존성 그래프 | 의미적 깊이 부족 | 의미+구조 통합 |
| 자연어 계획 | 모호성, 장기 저하 | 명시적 청사진 |

### 한계

- Python 프로젝트에 주로 집중
- 테스트 생성이 여전히 병목
- LLM 의존성

## 🔗 관련 개념

- [[Knowledge Graph]] - RPG는 코드 특화 지식 그래프
- [[AST]] - Artifact Grounding에서 의존성 추출
- [[SWE-bench]] - 소프트웨어 엔지니어링 벤치마크
- [[Code Generation]] - ZeroRepo의 핵심 태스크
- [[Code Understanding]] - RPG-Encoder의 핵심 태스크

---

**작성일**: 2026-02-05
**분류**: AI/ML 논문 시리즈
**소속**: Microsoft Research Asia, UCSD, Tsinghua University

**1차 논문 (ZeroRepo)**
- 제목: RPG: A Repository Planning Graph for Unified and Scalable Codebase Generation
- arXiv: https://arxiv.org/abs/2509.16198
- 발행일: 2025-10-21

**2차 논문 (RPG-Encoder)**
- 제목: Closing the Loop: Universal Repository Representation with RPG-Encoder
- arXiv: https://arxiv.org/abs/2602.02084
- GitHub: https://github.com/microsoft/RPG-ZeroRepo
- 발행일: 2026-02-04