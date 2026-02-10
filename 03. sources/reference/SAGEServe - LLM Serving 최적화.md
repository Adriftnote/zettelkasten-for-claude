---
title: SAGEServe - LLM Serving 최적화
type: paper-review
permalink: sources/reference/sageserve-llm-serving
tags:
- LLM
- inference-serving
- autoscaling
- cloud-optimization
- resource-management
- paper-review
date: 2025-12-01
---

# SAGEServe: Optimizing LLM Serving on Cloud Data Centers with Forecast Aware Auto-Scaling

Microsoft O365 프로덕션 트래픽(일 1천만+ 요청) 기반으로 LLM 서빙 자원을 예측적으로 최적화하는 프레임워크. GPU 시간 25% 절감, 낭비 80% 감소, 월 $2.5M 비용 절감 가능.

## 📖 핵심 아이디어

클라우드 LLM 서빙에서 **Interactive(빠른 응답)** 워크로드와 **Non-Interactive(배치)** 워크로드를 별도 GPU 풀로 분리(siloed)하면 비싼 가속기가 낭비된다. SAGEServe는 **통합 자원 풀** + **ARIMA 기반 트래픽 예측** + **ILP 최적화**로 다중 시간척도에서 라우팅과 스케일링을 동시 최적화한다. 핵심은 "예측해서 미리 준비하되, 실시간 반응도 병행"하는 멀티-타임스케일 제어.

## 🛠️ 구성 요소

### 워크로드 계층 (SLA Tiers)

| 계층 | 지연 목표 | 용도 | 비중 |
|------|----------|------|------|
| **IW-F** (Interactive Fast) | <1초 | 챗봇, 코드생성, 이메일 제안 | 72% (IW 합산) |
| **IW-N** (Interactive Normal) | <1분 | 일반 인터랙티브 | - |
| **NIW** (Non-Interactive) | ~24시간 | 야간 요약, 데이터 어노테이션 | 28% |

### 프레임워크 구성

| 컴포넌트 | 역할 |
|----------|------|
| **Global Router** | 리전 간 라우팅 (메모리 활용률 <70% 우선) |
| **Queue Manager** | NIW 비동기 라우팅 (활용률 <60% 시 방출) |
| **Load Predictor** | ARIMA 시계열 예측 (다음 1시간 최대 TPS) |
| **ILP Solver** | 인스턴스 배치 최적화 (소규모 1.4초, 대규모 33초) |
| **Autoscaler** | 예측 기반 스케일 아웃/인 + Spot 인스턴스 전환 |
| **Request Scheduler** | 우선순위 기반 스케줄링 (DPA 정책) |

## 🔧 작동 방식

```
[트래픽 예측 (장기)]          [실시간 반응 (단기)]
        │                           │
   ARIMA 예측                  메모리 활용률 모니터링
   (1시간 단위)                 (15초 쿨다운)
        │                           │
   ILP 최적화                  스케일 트리거
   (δ_ij 계산)                 (>70% up, <30% down)
        │                           │
        └──────── Autoscaler ────────┘
                     │
              ┌──────┴──────┐
              │             │
         Scale Out     Scale In
         (Spot 회수)   (Spot 기부)
```

### 스케일링 전략 비교

| 전략 | 방식 | 특징 |
|------|------|------|
| **LT-I** (Immediate) | 매시간 즉시 조정 | 과도 프로비저닝 위험 |
| **LT-U** (Deferred) | 활용률 기반 점진 조정 | SLO 안전 |
| **LT-UA** (Deferred+ARIMA) | LT-U + 예측 오차 보정 | 버스트 대응력 최고 |

LT-UA는 마지막 20분에 관측 TPS가 예측의 5배 이상이면 추가 스케일아웃, 0.5배 이하면 추가 스케일인.

### 스케줄링 정책 (DPA)

```
우선순위: 심각만료 > 긴급 IW-F > 긴급 IW-N > 비긴급 IW-F > 비긴급 IW-N > 최근만료
```

τ_n, τ_p 파라미터로 계층 간 공정성 조절 가능.

## 📊 실험 결과

### 환경
- 데이터: Microsoft O365 프로덕션 (Jul 2025 + Nov 2024)
- 모델: Bloom-176B, Llama2-70B, Llama3.1-8B, Llama3.2-3B (+ Llama4 Scout-109B)
- GPU: H100-80GB, 리전당 인스턴스 20개
- 시뮬레이터: Splitwise 확장 (MAPE <3%, R²=0.99/0.83)

### 주요 성과

| 지표 | Reactive (기존) | LT-UA (SAGEServe) | 개선 |
|------|----------------|-------------------|------|
| 인스턴스-시간 (Llama2 피크) | 362.25h | 277.5h | **-23.4%** |
| 낭비 GPU 사이클 | 기준 | - | **-80%** |
| 주간 비용 절감 | - | ~$0.6M | - |
| 월간 비용 절감 잠재 | - | ~$2.5M | - |
| SLO 준수 | 기준 | 유지 | TTFT 변동 <12% |

### 통합 vs 분리 풀
- 통합 풀: 분리 대비 **34.5% 인스턴스-시간 감소**
- Spot 기부: 통합 52시간 vs 분리 더 적음
- 모델 간 GPU 재배치 가능 (Llama→Bloom)

### 워크로드 특성 발견
- IW-F: 강한 주기성 (점수 0.7-0.95), 주말 감소
- NIW: 예측 어려움 (점수 0-0.286)
- 7개월간 요청률 **5배 성장**
- RAG 시스템이 전체 요청의 **41.2%** 차지

## 💡 실용적 평가

### 장점
- **프로덕션 검증**: Microsoft O365 실 트래픽 기반 — 이론이 아닌 실제 워크로드
- **비용 효과 명확**: H100 시간당 $98.32 기준 월 수백만 달러 절감
- **확장성**: MoE 아키텍처(Llama4 Scout)에도 일반화
- **오픈소스**: 시뮬레이터 + 트레이스 + 스케줄러 공개

### 한계
- Cold start 비용 큼: 로컬 10분, 원격 ~2시간 (모델 크기 문제)
- ARIMA 예측은 NIW처럼 비주기적 워크로드에 취약
- 리전 3개(미국)만 검증 — 글로벌 확장 시 네트워크 지연 변수
- 현재 이산적 SLA 계층 → 연속 SLA 스펙트럼은 미래 과제

### 적용 시사점
- LLM 서빙 인프라 운영 시 **분리 풀 → 통합 풀** 전환이 즉각적 효과
- 예측 모델은 ARIMA면 충분 (HMM 대비 정확도 약간 낮지만 훈련 비용 압도적 유리)
- NIW를 "빈 자원 채우기"로 활용하는 패턴은 범용적

## 🔗 관련 개념

- [[LLM Inference Optimization]] - 추론 최적화 전반
- [[Autoscaling]] - 클라우드 자동 스케일링
- [[Integer Linear Programming (ILP)]] - 최적화 기법
- [[ARIMA]] - 시계열 예측 모델
- [[SLA Management]] - 서비스 수준 관리
- [[Spot Instance]] - 유휴 자원 활용

---

**저자**: Jaiswal, Jain et al. (UIUC, Georgia Tech, IISc, Microsoft)
**출처**: Proc. ACM Meas. Anal. Comput. Syst., Vol.9 No.3, Dec 2025
**DOI**: 10.1145/3771576
**코드**: https://github.com/shashwatj07/SageServe
**작성일**: 2026-02-10
**분류**: LLM Infrastructure / Cloud Optimization