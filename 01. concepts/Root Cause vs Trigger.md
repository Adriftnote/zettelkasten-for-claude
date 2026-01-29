---
title: Root Cause vs Trigger
type: concept
tags: [debugging, analysis, methodology, bug-tracking, troubleshooting]
permalink: knowledge/concepts/root-cause-vs-trigger
category: 디버깅 방법론
difficulty: 중급
created: 2026-01-22
---

# Root Cause vs Trigger

**"버그의 근본 원인과 증상을 드러나게 한 계기를 구분하라"**

디버깅 시 흔히 하는 실수: 증상이 나타난 버전을 버그 도입 버전으로 착각함. 근본 원인(Root Cause)과 트리거(Trigger)는 다른 시점에 발생할 수 있습니다.

## 📖 개요

핵심 아이디어: **"증상 발생 버전 ≠ 버그 도입 버전"**

```
v2.0.61: 버그 도입 (Root Cause)  ← 실제 문제 코드 추가
v2.0.62: 정상 동작처럼 보임       ← 트리거 조건 미충족
v2.0.63: 정상 동작처럼 보임       ← 트리거 조건 미충족
v2.0.64: 증상 발생! (Trigger)    ← 다른 변경이 버그를 드러냄
         ↑
      "v2.0.64가 버그 도입" ← ❌ 흔한 착각
```

## 🎭 비유

### 시한폭탄

```
[Root Cause = 폭탄 설치]
누군가 폭탄을 설치함 (버그 코드 추가)

[Trigger = 타이머 작동]
다른 사람이 타이머를 건드림 (관련 코드 변경)

[증상 = 폭발]
폭탄이 터짐 (에러 발생)

→ 폭발 시점만 보면 "타이머 건드린 사람" 탓
→ 실제 원인은 "폭탄 설치한 사람"
```

## 💡 구분 방법

| 구분 | Root Cause (근본 원인) | Trigger (트리거) |
|------|------------------------|------------------|
| **정의** | 실제 버그가 있는 코드 | 버그를 드러나게 한 변경 |
| **시점** | 더 과거일 수 있음 | 증상 발생 직전 |
| **관계** | 필수 조건 | 충분 조건 |
| **수정 대상** | ✅ 이것을 고쳐야 함 | 고쳐도 임시방편 |

## 💻 실제 사례

### Claude Code Windows 타임스탬프 버그

```
[Root Cause] v2.0.61
- NTFS 타임스탬프 정밀도(100ns)와 JS Date(ms) 불일치
- 타임스탬프 검증 로직 변경

[Trigger] v2.0.64
- "instant auto-compacting" 기능 추가
- 파일 쓰기 빈도 증가 → 타임스탬프 불일치 노출

[증상]
- "File has been unexpectedly modified" 에러
- v2.0.64에서 갑자기 발생
```

**잘못된 분석**: "v2.0.64가 버그를 만들었다"
**올바른 분석**: "v2.0.61의 버그가 v2.0.64의 변경으로 드러났다"

## 📊 분석 프로세스

### 1단계: 증상 기록

```markdown
- 언제: v2.0.64부터
- 무엇이: 파일 편집 시
- 어떻게: "unexpectedly modified" 에러
```

### 2단계: 버전 히스토리 조사

```bash
# GitHub Issues에서 관련 버그 검색
# v2.0.64 이전 버전에서도 유사 증상 있었는지 확인
```

### 3단계: 변경 로그 분석

```markdown
v2.0.64:
- instant auto-compacting 추가 ← Trigger 후보
- UI 개선

v2.0.61:
- VSCode 터미널 관련 revert
- 타임스탬프 검증 로직 변경 ← Root Cause 후보
```

### 4단계: 가설 검증

```markdown
[ ] v2.0.60에서 증상 재현 시도 → 안 됨 (Trigger 없음)
[ ] v2.0.61 + v2.0.64 코드 조합 → 재현됨
[ ] v2.0.61 타임스탬프 로직만 롤백 → 해결됨 ✅
```

## ⚠️ 흔한 실수

### 증상 버전만 보고 판단

```
❌ "v2.0.64 OK, v2.0.65 NG → v2.0.65가 버그 도입"

✅ 올바른 접근:
1. v2.0.65의 변경사항 확인 (Trigger인가?)
2. 관련 코드의 히스토리 추적 (Root Cause 찾기)
3. 더 오래된 버전에서 조건 변경 시 재현되는지 확인
```

### 핫픽스 vs 근본 해결

```
[Trigger만 수정]
v2.0.64의 auto-compacting 롤백
→ 증상은 사라지지만 버그는 여전히 존재
→ 다른 Trigger로 다시 발생 가능

[Root Cause 수정]
v2.0.61의 타임스탬프 로직 수정
→ 근본적으로 해결
```

## ✅ 조사 체크리스트

| 단계 | 체크 |
|------|------|
| 1 | GitHub Issues에서 버그 리포트 시점 확인 |
| 2 | 리포트된 버전과 현재 버전 비교 |
| 3 | 해당 버전의 핵심 변경사항 분석 |
| 4 | 더 이전 버전에서 Root Cause 발견 여부 확인 |
| 5 | Root Cause와 Trigger 분리하여 기록 |

## 📝 문서화 템플릿

```markdown
## 버그 분석

### 증상
- 발생 버전: v2.0.64
- 에러 메시지: "File has been unexpectedly modified"

### Root Cause
- 도입 버전: v2.0.61
- 원인: NTFS 타임스탬프 정밀도 불일치
- 관련 코드: timestamp-validation.ts

### Trigger
- 트리거 버전: v2.0.64
- 변경 내용: instant auto-compacting 추가
- 왜 트리거?: 파일 쓰기 빈도 증가

### 해결
- [ ] Root Cause 수정 (권장)
- [ ] Trigger 롤백 (임시)
```

## Relations

- enables [[Defensive Coding]] (근본 원인 이해로 재발 방지)
- used_in 버그 트래킹 (Issue 분석 시 필수 구분)
- related_to [[graceful-degradation]] (Trigger 대응 vs Root Cause 해결)
