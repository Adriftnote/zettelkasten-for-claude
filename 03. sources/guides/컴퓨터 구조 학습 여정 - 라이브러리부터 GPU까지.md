---
title: 컴퓨터 구조 학습 여정 - 라이브러리부터 GPU까지
type: note
tags:
  - computer-architecture
  - cognitive-science
  - gpu
  - memory
  - derived
permalink: notes/computer-architecture-learning-journey
source_facts:
  - 데이터 구조와 메모리 배치
  - 메모리 계층 구조
  - GPU 병렬 처리
  - 시스템1-2 이론
---

# 컴퓨터 구조 학습 여정 - 라이브러리부터 GPU까지

라이브러리 → GPU까지 탐구하며 발견한 핵심: **컴퓨터는 뇌를 모방하고, 모든 설계에는 트레이드오프가 있다.**

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **데이터 구조는 하드웨어 특성에 맞춘 메모리 배치다** - 캐시가 64바이트 단위로 가져옴
2. **메모리 계층은 인간 기억 구조와 유사하다** - 레지스터(의식) → 캐시(주의) → RAM(작업기억) → SSD(장기기억)
3. **GPU는 시스템1(직관)을 모방한다** - 병렬 처리 = 뉴런의 동시 활성화
4. **모든 설계에는 트레이드오프가 있다** - 속도-발열-통합 중 2개만 선택 가능

→ 따라서: **"컴퓨터는 뇌를 모방하고 있다"**
- 시스템1 (빠른 직관) ≈ GPU (병렬 패턴 인식)
- 시스템2 (느린 논리) ≈ CPU (순차 처리)
- 작업 기억 (7±2) ≈ RAM (제한적)
- 장기 기억 ≈ SSD/HDD (영구)

→ 메타 인사이트: **"좋은 질문이 좋은 답보다 중요하다"**

## Observations

- [fact] 컴퓨터는 연속된 메모리를 선호한다 (캐시 64바이트 단위) #cache
- [fact] 배열 vs 연결 리스트 = 직선 vs 미로 (접근 패턴) #data-structure
- [fact] 레지스터=의식, 캐시=주의, RAM=작업기억, SSD=장기기억 #memory-hierarchy
- [fact] GPU는 시스템1의 패턴 인식 능력을 모방한다 #gpu #cognition
- [fact] 병렬 처리는 뉴런의 동시 활성화와 유사하다 #parallel
- [fact] 딥러닝은 인공 직관이다 (AlphaGo, 이미지 인식) #ai
- [fact] RAM→VRAM 전송 비용 < 접근 속도 이득 (1회 전송 vs 10000회 접근) #vram
- [fact] 속도-발열-통합 트릴레마: 3개 중 2개만 선택 가능 #tradeoff
- [example] Apple: 통합 + 저발열 (속도 희생) #apple
- [example] NVIDIA: 속도 + 분리 (발열 감수) #nvidia
- [method] 질문 주도 학습: "이게 뭐야?" → "왜 이래?" → "이렇게 하면 안 돼?" #learning
- [method] 추상화 단계: 고수준(라이브러리) → 저수준(캐시) → 하드웨어(물리법칙) #abstraction
- [question] GPU가 "진짜" 직관을 가질 수 있는가? #philosophy
- [question] 패턴 인식 ≠ 이해인가? #consciousness
- [question] 뉴로모픽 칩은 진정한 통합을 이룰까? #future

## 학습 흐름

```
라이브러리 → 언어 생태계 → 파서 → 데이터 구조 → 캐시 친화성
    → 메모리 계층 → GPU vs CPU → 시스템1-2 연결 → RAM-VRAM 분리
    → Apple Silicon 통합 메모리
```

## 생성된 노트

- [[library-ecosystem-statistics]] - 언어별 라이브러리 통계
- [[data-structure]] - 데이터 구조와 메모리 배치
- [[computer-memory-hierarchy]] - 메모리 계층 구조
- [[gpu]] - GPU 기본 개념
- [[GPU 병렬처리와 뇌 시각피질은 연산 구조가 같다]] - GPU가 시스템1을 모방하는 방법

## Relations

- derived_from [[시스템1-2와 기억 재구성]] (인지과학 개념에서 비유 도출)
- derived_from [[computer-memory-hierarchy]] (메모리 계층에서 뇌 비유 도출)
- derived_from [[gpu]] (GPU 구조에서 시스템1 연결 도출)
- derived_from [[data-structure]] (데이터 구조에서 하드웨어 특성 도출)
- organizes [[GPU 병렬처리와 뇌 시각피질은 연산 구조가 같다]] (이 여정에서 생성된 노트)
- connects_to [[cognitive-science]] (인지과학과 컴퓨터 구조 연결)

---

**도출일**: 2026-01-28
**출처**: 라이브러리 → GPU 학습 과정에서 다중 개념 조합
