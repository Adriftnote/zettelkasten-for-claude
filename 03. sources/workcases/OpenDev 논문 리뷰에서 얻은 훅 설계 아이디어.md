---
title: OpenDev 논문 리뷰에서 얻은 훅 설계 아이디어
type: workcase
tags:
- claude-code
- hooks
- context-engineering
- event-detection
- memory-retrieval
permalink: sources/workcases/opendev-paper-hook-design-idea
---

# OpenDev 논문 리뷰에서 얻은 훅 설계 아이디어

> REF-093 OpenDev 논문(81쪽 기술 보고서) 리뷰 중 도출한 인사이트와 Claude Code 훅 활용 아이디어 (2026-03-10)

## 1. 논문에서 직접 얻은 3가지 설계 교훈

### 컨텍스트는 버퍼가 아니라 예산

대부분의 에이전트가 컨텍스트 윈도우를 "채울 수 있는 공간"으로 취급하지만, OpenDev는 **소비할 수 있는 예산**으로 취급한다.

- ACC(Adaptive Context Compaction) 5단계: 자원 압박 임계값(70%→80%→85%→90%→99%)에서 점진적으로 오래된 정보를 버림 (graceful degradation)
- 대용량 출력은 컨텍스트에 두지 않고 파일시스템으로 오프로드
- 결과: 피크 컨텍스트 소비 ~54% 감소, 프롬프트 캐싱으로 비용 ~88% 절감

### 안전은 차단이 아니라 비가시화

서브에이전트에게 "쓰기 도구를 쓰지 마"라고 프롬프트로 지시하는 대신, **스키마에서 쓰기 도구를 아예 제거**한다. 모델이 존재를 모르면 사용할 수도 없다.

### 리마인더는 사전이 아닌 결정 시점에 주입

시스템 프롬프트에 모든 규칙을 미리 넣는 대신, **8가지 이벤트 감지기**가 문제 상황을 탐지하면 그때 리마인더를 주입한다:

- 도구 실패 후 재시도 안 함 → 리마인더
- 탐색 스파이럴 5회+ → 리마인더
- 미완료 todo로 조기 완료 → 리마인더

사전에 전부 주입하면 Lost-in-Middle로 무시될 수 있지만, 결정 시점에 주입하면 attention이 집중된 상태에서 읽힌다.

## 2. 훅 = 이벤트 감지기 아이디어

OpenDev의 "시스템 리마인더"는 에이전트 내부에 구현되어 있지만, Claude Code에서는 **훅(외부 스크립트)**으로 같은 패턴을 구현할 수 있다.

### 핵심 아이디어: Bash 에러 시 메모리 검색

```
Bash 실행 → 에러 발생 (exit ≠ 0)
    ↓
PostToolUse:Bash 훅 트리거
    ↓
에러 메시지 추출 → vecsearch/basic-memory 검색
    ↓
관련 workcase 있으면 → message로 주입
```

예시 응답:
```json
{
  "decision": "allow",
  "message": "관련 경험 발견: [[vecsearch 벡터 시맨틱 검색 구현]] — fastembed 설치 시 동일 에러, 해결: Python 3.11 venv 사용"
}
```

### 훅 응답 패턴 2가지

```json
// 패턴 1: 차단 (비가시화)
{ "decision": "block", "message": "vault 외부 접근 불가" }

// 패턴 2: 허용 + 리마인더 주입 (결정 시점 리마인더)
{ "decision": "allow", "message": "관련 경험: [[workcase명]] — 해결법 요약" }
```

### 실제 데모

이 세션에서 vault 밖 경로에 Glob을 시도하자 **PreToolUse 훅이 즉시 차단**했다. 이것이 논문의 "도구 레벨 검증"과 같은 패턴이다.

### OpenDev 에피소딕 메모리와의 차이

|         | OpenDev 에피소딕 메모리 | 훅 기반 메모리 검색     |
| ------- | ---------------- | --------------- |
| **트리거** | 5메시지마다 자동        | 에러 발생 시에만       |
| **방식**  | 전체 대화 LLM 요약     | 에러 메시지로 벡터 검색   |
| **비용**  | 매 5메시지마다 LLM 호출  | 실패 시에만 검색       |
| **정확도** | 범용 요약            | 특정 에러에 대한 관련 경험 |

### 확장 가능한 이벤트 감지기 목록

| 이벤트 | 훅 타입 | 동작 |
|---|---|---|
| Bash 에러 | PostToolUse:Bash | 에러 메시지로 workcase 검색 → 관련 경험 주입 |
| 위험 명령 | PreToolUse:Bash | `rm -rf`, `git push --force` 등 패턴 매칭 → 차단 |
| 읽지 않은 파일 수정 | PreToolUse:Edit | 최근 Read 기록과 비교 → 경고 |
| 반복 검색 | PreToolUse:Grep | 최근 N회 호출 패턴 → 탐색 스파이럴 경고 |
| 세션 종료 | Stop | 미완료 todo 체크 → 경고 |

## 3. 과한 해석의 교훈

이 세션에서 OpenDev와 Thompson/Simon 조직론의 "1:1 대응"을 시도했으나, 자기 비판에서 대부분 무너졌다:

- 6개 대응 중 견고한 것은 **1개**(Sequential↔쓰기 순차)뿐
- Reciprocal↔5역할 통합은 **논리적 오류** (5역할은 순차 파이프라인이지 양방향 의존이 아님)
- Simon ACC↔안정적 중간 형태는 **비약** (검증점 ≠ 자원 임계값)
- 도출 노트를 만들었으나 원본 reference 반복이라 **삭제**

> **교훈: 표면적 비유 공유 ≠ 메커니즘 공유. 비유가 먹히는 것 같으면 한 번 더 의심할 것.**

## 관련 Task

- (이 세션에서 자발적으로 수행 — 별도 task ID 없음)

## Relations

- learned_from [[REF-093 OpenDev — 터미널 AI 코딩 에이전트 아키텍처 및 컨텍스트 엔지니어링]] (논문의 이벤트 감지기/ACC/비가시화 안전 패턴에서 도출)
- uses [[Claude Code - Anthropic 공식 CLI 에이전트]] (훅 시스템을 활용한 구현 대상)
- connects_to [[Task 분해 프레임워크 - 경영학 관점]] (약한 연결 — 비판 과정에서 대부분의 대응이 과한 해석으로 판명)
- connects_to [[vecsearch 벡터 시맨틱 검색 구현]] (훅에서 메모리 검색 시 활용할 인프라)

## Observations

- [method] Claude Code 훅의 `{ "decision": "allow", "message": "..." }` 패턴이 OpenDev의 "결정 시점 리마인더"와 동일한 효과를 낸다 #hooks #context-engineering
- [fact] PostToolUse:Bash에서 에러 감지 → vecsearch로 관련 workcase 검색 → message 주입하면, 에이전트가 과거 경험을 실패 시점에 자동으로 참조할 수 있다 #memory-retrieval
- [fact] OpenDev 에피소딕 메모리(5메시지마다 자동 요약)보다 이벤트 트리거 방식이 비용 효율적일 수 있다 — 실패 시에만 검색하므로 #efficiency
- [warning] 논문 간 유사 패턴을 발견했을 때 "1:1 대응" 또는 "재발견"이라 주장하기 전에 메커니즘 수준의 검증이 필요하다 — 표면적 비유 공유 ≠ 메커니즘 공유 #critical-thinking
- [pattern] 논문 리뷰의 유효한 산출물은 "대응 관계 증명"이 아니라 "구체적 설계 아이디어 도출"이었다 #meta-learning
