---
title: SWE-bench
type: concept
permalink: knowledge/concepts/swe-bench
tags:
- benchmark
- ai-evaluation
- software-engineering
category: AI 벤치마크
difficulty: 중급
---

# SWE-bench

실제 GitHub 이슈를 기반으로 AI의 소프트웨어 엔지니어링 능력을 평가하는 벤치마크

## 📖 개요

SWE-bench는 실제 오픈소스 프로젝트의 버그 리포트와 수정 사항을 기반으로 AI 코딩 에이전트의 능력을 평가합니다. 단순 코드 생성이 아닌, 버그 위치 파악 → 코드 수정 → 테스트 통과까지의 전체 과정을 평가합니다.

## 🎭 비유

개발자 실력 테스트와 같습니다. 단순히 "코드 짜봐"가 아니라, 실제 이슈를 받아서 해결하는 능력을 평가합니다.

## ✨ 특징

- **실제 이슈 기반**: GitHub의 실제 버그 리포트 사용
- **엔드투엔드 평가**: 버그 찾기 → 수정 → 검증
- **다양한 프로젝트**: Django, Flask, Pandas 등 유명 오픈소스
- **사람이 검증**: 테스트 케이스로 정답 확인

### 버전별 특징

| 버전 | 예제 수 | 특징 |
|-----|--------|------|
| SWE-bench Verified | 500개 | 사람이 검증한 실제 버그 |
| SWE-bench Live Lite | 300개 | 최근 이슈 (데이터 오염 방지) |

## 💡 예시

```
평가 흐름:
1. 버그 리포트 제공
   "pandas merge에서 날짜 컬럼이 깨져요"

2. AI가 해결
   - 코드베이스 탐색
   - 버그 위치 파악
   - 코드 수정

3. 테스트로 검증
   - 기존 테스트 통과
   - 버그 재현 테스트 통과
```

### RPG-Encoder 성능 (예시)

```
SWE-bench Verified:
- Claude-4.5-Sonnet + RPG: 93.7% Acc@5
- 개선폭: +14.4%

SWE-bench Live:
- GPT-5 + RPG: 87.8% Acc@5
- 개선폭: +11.6%
```

## Relations

- evaluates [[RPG (Repository Planning Graph)]] (RPG 성능 평가)
- relates_to [[Code Understanding]] (코드 이해 능력 평가)
- similar_to [[RepoCraft]] (레포 생성 벤치마크)

---

**난이도**: 중급
**카테고리**: AI 벤치마크
**링크**: https://www.swebench.com/
**마지막 업데이트**: 2026년 2월