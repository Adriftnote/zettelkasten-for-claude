---
extraction_status: pending
type: workcase
permalink: sources/workcases/claude-code-clear-command-test
---

# Claude Code /clear 명령어 동작 분석

## 개요

- **테스트 일시**: 2026-01-21
- **목적**: `/clear` 명령어가 세션 파일과 캐시에 미치는 영향 분석
- **세션 ID**: `ac9e7087-ef1b-4ce7-a2e7-7bca2aa51595`

## 테스트 방법

1. 현재 세션 파일 백업 (`~/session-backup-before-test.jsonl`)
2. `/clear` 실행
3. 세션 파일 비교 분석

## 핵심 발견

### 1. 세션 파일은 삭제되지 않음

| 항목 | Clear 전 | Clear 후 |
|------|----------|----------|
| 파일 크기 | 158KB (115줄) | 164KB (119줄) |
| 세션 ID | 유지 | 유지 |
| 이전 대화 | 존재 | **그대로 존재** |

**결론**: `/clear`는 로컬 세션 파일(`.jsonl`)을 삭제하지 않음. 파일은 append-only 로그 형태로 계속 누적됨.

### 2. 캐시는 Anthropic 서버에 존재

```
┌─────────────────────┐                  ┌─────────────────────────┐
│     로컬 (내 PC)     │                  │    Anthropic 서버        │
├─────────────────────┤                  ├─────────────────────────┤
│  session.jsonl      │   API 요청        │  Prompt Cache           │
│  (대화 기록)         │ ───────────────► │  (GPU 메모리)            │
│                     │                  │                         │
│  캐시 데이터 ❌      │ ◄─────────────── │  - TTL: ~5분            │
│                     │   응답 + usage   │  - prefix 해시로 관리    │
└─────────────────────┘                  └─────────────────────────┘
```

### 3. 캐시 토큰 변화

```
세션 시작:     14,052 토큰  ← 시스템프롬프트 + CLAUDE.md
                 ↓
              대화 누적
                 ↓
Clear 직전:   59,670 토큰  ← +45,618 토큰 (대화 내용)
                 ↓
            /clear 실행
                 ↓
Clear 직후:  ~14,000 토큰  ← 다시 시스템+CLAUDE.md만 (예상)
```

## /clear 실제 동작

| 구분 | 동작 |
|------|------|
| 로컬 파일 | ❌ 삭제 안 함 (체크포인트 복구용 보존) |
| API 컨텍스트 | ✅ 이전 대화 제외 (새 대화로 시작) |
| 서버 캐시 | 자연 만료 (직접 삭제 아님) |
| 세션 ID | 유지 |
| 체크포인트 | 유지 (Esc+Esc 복구 가능) |

## /clear vs /compact 비교

| 항목 | /clear | /compact |
|------|--------|----------|
| 대화 이력 | **완전 제외** | 요약으로 압축 |
| 컨텍스트 | 0 토큰 (새 시작) | 핵심만 보존 |
| 사용 시점 | 완전히 새 작업 | 컨텍스트 길어질 때 |

## 실용적 의미

1. **민감 정보 완전 삭제**: `/clear`만으로는 불충분. 세션 파일 직접 삭제 필요.
   ```bash
   rm ~/.claude/projects/{project}/session-id.jsonl
   ```

2. **토큰 비용 절감**: `/clear` 후 캐시가 리셋되어 고정 부분(~14K)만 캐시 hit.

3. **캐시 만료**: Anthropic 서버 캐시는 ~5분 미사용 시 자동 만료.

## 관련 파일 경로

- 세션 파일: `~/.claude/projects/{project-path}/{session-id}.jsonl`
- 설정: `~/.claude/settings.json`
- 권한: `~/.claude/settings.local.json`

## 참고

- 테스트 백업 파일: `~/session-backup-before-test.jsonl`
- Claude Code 버전: 2.1.6