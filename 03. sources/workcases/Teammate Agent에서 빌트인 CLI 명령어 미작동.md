---
title: Teammate Agent에서 빌트인 CLI 명령어 미작동
type: workcase
permalink: sources/workcases/teammate-builtin-cli-unavailable
tags:
- claude-code
- agent-teams
- teammate
- builtin-commands
---

# Teammate Agent에서 빌트인 CLI 명령어 미작동

## 문제 상황

Claude Code Agent Teams에서 teammate(researcher)에게 `/clear`, `/context`, `/compact` 등 빌트인 CLI 명령어를 입력했으나 실행되지 않았다. teammate는 이를 일반 텍스트 메시지로 수신하여 "해당 스킬이 없다"고 응답했다.

## 근본 원인

```
사용자 입력 → 팀 리더(메인 에이전트) → teammate(별도 스레드)
                    ↑                        ↑
              CLI 빌트인 처리 가능     Agent SDK 스레드 (CLI 접근 없음)
```

teammate는 CLI를 직접 조작하는 것이 아니라 **Agent SDK 위에서 돌아가는 별도 스레드**다. 빌트인 CLI 명령어(`/clear`, `/context`, `/compact`, `/help`, `/fast` 등)는 CLI 레벨에서 처리되는데, teammate에게 전달된 메시지는 이미 CLI를 통과한 후이므로:

1. 팀 리더에게 보낸 메시지 → 팀 리더 CLI에서 빌트인 처리
2. teammate에게 보낸 메시지 → 일반 텍스트로 전달 (빌트인 인터셉트 없음)
3. Skill tool → 커스텀 슬래시 커맨드만 대상 (빌트인 CLI 명령어 불가)

## 해결책

| 명령어 | teammate에서 대체 방법 |
|--------|----------------------|
| `/clear` | 불가. shutdown 후 재spawn으로 리셋 |
| `/context` | 불가. teammate가 자체 컨텍스트 상태 설명 |
| `/compact` | 불가. 시스템 자동 압축에 의존 |
| `/help` | 불가. teammate가 자체 도구 목록 설명 |
| `/fast` | 불가. teammate spawn 시 model 파라미터로 지정 |

**핵심**: teammate 컨텍스트 제어가 필요하면 **팀 리더 측에서** 관리해야 한다.

## 적용

- teammate에게 빌트인 명령어 전달하지 않기
- teammate 리셋이 필요하면 shutdown_request → 재spawn
- teammate 컨텍스트 상태 확인은 직접 질문("현재 컨텍스트 상태?")으로 대체

## 관련 노트

- `sources/workcases/claude-code-clear-command-test`: /clear vs /compact 비교
- `sources/workcases/custom-agent-mcp-access`: 커스텀 에이전트 MCP 접근 불가 (유사한 에이전트 제약 패턴)

## Observations

- [fact] teammate는 Agent SDK 별도 스레드로, CLI 빌트인 명령어 인터셉트가 없다 #claude-code #agent-teams
- [fact] /clear는 팀 리더 대화만 초기화하고 teammate 컨텍스트는 독립 유지된다 #agent-teams #context
- [pattern] 에이전트 유형별 기능 제약 패턴: 커스텀 에이전트=MCP 불가, teammate=빌트인 CLI 불가 #agent-teams
- [solution] teammate 리셋은 shutdown_request 후 재spawn으로 처리한다 #agent-teams
- [warning] teammate에 빌트인 명령어를 보내면 일반 텍스트로 처리되어 혼란 발생 #agent-teams