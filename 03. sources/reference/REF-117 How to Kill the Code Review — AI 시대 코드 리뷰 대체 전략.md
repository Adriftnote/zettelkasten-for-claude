---
title: REF-117 How to Kill the Code Review — AI 시대 코드 리뷰 대체 전략
type: note
permalink: zettelkasten/03.-sources/reference/ref-117-how-to-kill-the-code-review-ai-sidae-kodeu-ribyu-daece-jeonryag
tags:
- code-review
- ai-agent
- verification
- bdd
- spec-driven
- software-engineering
---

# How to Kill the Code Review — AI 시대 코드 리뷰 대체 전략

AI가 코드를 대량 생성하는 시대에 전통적 코드 리뷰가 왜 실패하며, 어떤 시스템으로 대체해야 하는지를 제안하는 글.

- source: https://www.latent.space/p/reviews-dead
- author: Ankit Jain (Aviator CEO)
- publication: Latent.Space (guest post)
- date: 2026-03-02
- type: opinion/framework
- permalink: sources/reference/how-to-kill-the-code-review

## 📖 핵심 아이디어

전통적 코드 리뷰는 AI 이전에도 이미 실패하고 있었다. AI 코드 생성이 보편화되면서 리뷰 병목은 더 심각해짐(PR 98% 증가, 리뷰 시간 91% 증가). 해법은 "코드 리뷰를 개선"하는 게 아니라, 인간의 역할을 **리뷰(사후)에서 스펙 정의(사전)로 이동**시키고, 검증은 자동화된 다층 시스템으로 대체하는 것.

핵심 전환: **"이걸 제대로 짰어?"(사후 리뷰) → "올바른 문제를 풀고 있어?"(사전 스펙)**

## 🔑 현황 데이터 (Faros.ai)

| 지표 | 변화 |
|------|------|
| 완료 태스크 | +21% |
| 머지된 PR | +98% |
| PR 리뷰 시간 | +91% |

AI가 코드를 더 많이 만들수록 리뷰 부담이 지수적으로 증가하는 역설.

## 🏗️ Five Layers of Trust (신뢰 5계층)

### Layer 1: 다중 옵션 비교
- 여러 에이전트에게 같은 작업을 다르게 풀게 함
- 검증 통과율, diff 크기, 신규 의존성으로 랭킹
- 인간 개입 없이 optionality 확보

### Layer 2: 결정론적 가드레일
- 테스트, 타입 체크, 컨트랙트 검증, 커스텀 린터
- 조직 불변량 (예: 하드코딩 크레덴셜 금지)
- 도메인별 컨트랙트 (예: 결제 타입)
- **"검증 단계는 코드 작성 전에 정의해야 한다, 작성 후에 발명하지 말라"**

### Layer 3: 인간은 Acceptance Criteria만 정의
- BDD(Behavior-Driven Development)로 자연어 스펙 작성
- 에이전트가 구현, BDD 프레임워크가 검증
- **"스펙이 부가 작업이 아니라 주요 산출물이다"**

### Layer 4: 권한 시스템 = 아키텍처
- 에이전트 파일시스템 접근을 관련 파일만으로 제한
- 민감 패턴 자동 플래깅 (인증, DB 스키마, 의존성)
- 아키텍처 변경만 인간 에스컬레이션

### Layer 5: 적대적 검증
- 코딩과 검증 역할을 서로 다른 에이전트에 분리
- 제3 에이전트가 엣지 케이스로 구현을 깨뜨리려 시도

## 🧀 Swiss Cheese Model

안전공학의 스위스 치즈 모델 적용 — 불완전한 필터를 겹겹이 쌓아서 실패 모드가 정렬되지 않도록 함. 각 Layer가 다른 종류의 결함을 잡는다.

## 💡 주요 시사점

1. **가독성의 중요도 하락**: 에이전트가 코드를 잘 다루면, 인간이 읽을 수 있는지가 덜 중요해짐
2. **Ship fast, observe, revert**: 느린 리뷰 → 빠른 배포+관찰+롤백 패러다임
3. **인센티브 구조 명시적 인코딩**: 에이전트에겐 내재적 신뢰성 없음 → 가드레일에 제약을 빌드인
4. **AI 코드의 표준화**: AI 코드가 더 균일해지면서 방향성 가이드 필요성 감소

## ⚠️ 맥락 주의

- Latent.Space 게스트 포스트 (편집자 주: "AI 리뷰 도구를 출시했지만 아직 충분하지 않다")
- 저자가 Aviator(코드 리뷰/머지 자동화) CEO — 포지션 바이어스 고려 필요
- 코드 리뷰가 2012-2014년에야 표준화됐다는 주장은 오픈소스 커뮤니티 관행과 다소 충돌

## Relations

- [[Superpowers - Claude Code 개발 워크플로우 프레임워크]] - (Superpowers의 Code Review 단계가 이 글의 Layer 2-3 자동 검증과 대비 — 인간 리뷰 vs 자동화 리뷰의 스펙트럼)
