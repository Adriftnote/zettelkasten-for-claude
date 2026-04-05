---
title: kimoring 검증 스킬 체계 (manage-skills, verify-implementation, merge-worktree)
type: workcase
permalink: sources/workcases/kimoring-verify-skill-system
tags:
- claude-code
- skills
- verification
- git
- kimoring
---

> kimoring 스킬 설치 후 첫 테스트 (2026-03-18)
> source: codefactory-co/kimoring-ai-skills

## 1. 전체 흐름

코드 작업 → `/manage-skills`(verify 스킬 자동 생성/갱신) → `/verify-implementation`(등록된 verify 스킬 순차 실행) → `/merge-worktree`(squash-merge + 구조화 커밋)

```
코드 변경 감지 (git diff)
    ↓
/manage-skills
    ├─ 변경 파일 수집
    ├─ 기존 verify 스킬과 매핑
    ├─ 커버리지 갭 분석
    └─ verify-* 스킬 CREATE or UPDATE
         ↓
/verify-implementation
    ├─ 등록된 verify 스킬 순차 실행
    ├─ PASS/FAIL 판정 + 예외 처리
    └─ 이슈 발견 시 수정 제안
         ↓
/merge-worktree
    ├─ worktree 브랜치 검증
    ├─ 전체 diff 분석 (Phase 2 Research)
    ├─ squash-merge
    └─ 구조화 커밋 메시지 작성
```

## 2. 핵심 개념

### disable-model-invocation: true
세 스킬 모두 이 설정이 켜져 있음. 모델이 자동으로 호출할 수 없고 사용자가 슬래시 명령(`/manage-skills`)으로만 실행 가능. 검증은 의도적으로 트리거해야 하는 행위이므로 적절한 설계.

### verify 스킬 레지스트리
- `manage-skills/SKILL.md` 안에 "등록된 검증 스킬" 테이블 관리
- `verify-implementation/SKILL.md` 안에 "실행 대상 스킬" 테이블 관리
- 두 테이블은 항상 동기화 필요 — `/manage-skills`가 자동으로 양쪽 업데이트

### git 의존성
- `/manage-skills`: `git diff`로 변경 파일 감지 → git 필수
- `/verify-implementation`: Grep/Glob/Read 기반 → 기술적으로 git 불필요하지만 스킬 생성이 git 의존
- `/merge-worktree`: git worktree + squash-merge → git 필수
- **결론: 범용 작업공간(working/)이 아닌 git 프로젝트에서 사용**

## 3. 테스트 결과

| 스킬 | 테스트 조건 | 결과 | 비고 |
|------|------------|------|------|
| `/manage-skills` | 비git, 변경사항 0 | 정상 종료 | "변경 파일 0개" 보고 |
| `/verify-implementation` | verify 스킬 0개 | 정상 종료 | "스킬 없음, /manage-skills 실행하세요" 안내 |
| `/merge-worktree` | 비git 디렉토리 | 정상 에러 | "worktree에서 실행하세요" 안내 |

경계 조건에서 모두 적절한 안내 메시지 출력. 크래시나 무한루프 없음.

## 4. 적용 계획

ryu-memory, playwright-test 등 git 프로젝트에서 코드 작업 후 실행.
Episode Memory Redesign 구현 시 첫 실전 사용 예정.

## 관련 Task
- task-20260318-011: kimoring 스킬 3종 테스트

## Relations
- uses [[Claude Code Skills]] (스킬 시스템 활용)
- learned_from [[REF-107 Claude Skills — 177개 프로덕션 스킬 컬렉션 (Multi-Agent 호환)]] (kimoring 출처 컬렉션)
- part_of [[ryu-memory]] (첫 실전 적용 대상)

## Observations
- [fact] kimoring 스킬 3종은 모두 disable-model-invocation:true — 슬래시 호출 전용 #claude-code #skills
- [pattern] verify 스킬 레지스트리 패턴: manage-skills가 생성하고 verify-implementation이 소비하는 생산자-소비자 구조 #verification #pattern
- [method] 스킬 테스트 순서: manage-skills → verify-implementation → merge-worktree (의존성 순) #testing
- [warning] git 프로젝트에서만 유의미 — working/ 같은 범용 폴더에서는 git diff 불가로 manage-skills 무용 #git
- [tech] Skill 도구로 호출 시 disable-model-invocation 에러 반환 — 슬래시 명령으로만 정상 동작 #claude-code