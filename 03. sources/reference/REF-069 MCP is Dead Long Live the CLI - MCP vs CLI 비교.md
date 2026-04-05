---
title: REF-069 MCP is Dead Long Live the CLI - MCP vs CLI 비교
type: doc-summary
permalink: sources/reference/mcp-vs-cli-comparison
tags:
- mcp
- cli
- llm-tools
- architecture
date: 2026-03-05
---

# MCP is Dead, Long Live the CLI - MCP vs CLI 비교

Eric Holmes의 "MCP is dead. Long live the CLI" 글(2026.02.28) 분석과 MCP/CLI 각각의 강약점 정리.

## 📖 핵심 아이디어

Holmes는 MCP가 불필요한 추상화 레이어이며, CLI가 더 간단하고 빠르고 디버깅하기 쉽다고 주장한다. 그러나 AI 간 실시간 통신, 세션 상태 유지, 양방향 스트리밍 등 CLI의 설계 범위 밖 영역에서는 MCP가 필수적이다. 결론적으로 둘은 대체 관계가 아닌 보완 관계.

## 🛠️ Holmes의 MCP 비판 (CLI 우위 영역)

| 관점 | MCP 문제 | CLI 장점 |
|------|---------|---------|
| 디버깅 | LLM 대화 안에서만 존재, 재현 어려움 | 같은 명령어 그대로 실행해서 재현 가능 |
| 조합성 | 파이핑/체이닝 불가 | `\|`, `grep`, `jq` 등 자유 조합 |
| 인증 | 별도 레이어 추가 필요 | AWS SSO, GitHub auth 등 기존 인증 재사용 |
| 안정성 | 초기화 불안정, 재인증 문제 | 수십 년간 검증된 도구 |
| 권한 | all-or-nothing | 세밀한 스코핑 가능 |
| LLM 호환성 | 새 프로토콜 학습 필요 | LLM이 CLI 문서/예제로 이미 훈련됨 |

## 🔧 MCP가 필수적인 영역 (CLI 불가)

| 기능 | CLI | MCP |
|------|-----|-----|
| 양방향 실시간 통신 | X | O |
| 세션/상태 유지 | X | O |
| 도구 자동 발견(Discovery) | X | O |
| 스트리밍/구독 | 어려움 | O |
| AI 간 통신 | X | O |

비유:
- CLI = 전화로 한마디 하고 끊기 (빠르고 간단, 매번 다시 걸어야 함)
- MCP = 화상회의 연결 유지 (연결 비용 있지만 계속 주고받기 가능)

## 💡 실용적 적용 (우리 환경 기준)

MCP 안에서 CLI를 실행하는 하이브리드 패턴이 가장 효과적:

```
사용자 → LLM → MCP 서버 → 내부에서 CLI 실행 → 구조화된 결과 반환
```

| 상황 | 적합 도구 | 이유 |
|------|----------|------|
| `sqlite3 "SELECT ..."` | CLI | 단발성 쿼리 |
| Figma ↔ 코드 동기화 | MCP | 양방향 실시간 상태 공유 |
| `jq .data file.json` | CLI | 단발성 변환 |
| Basic Memory 컨텍스트 | MCP | 세션 내 관계 그래프 유지 |
| `git status` | CLI | 상태 확인하고 끝 |
| AI 에이전트 간 협업 | MCP | 지속적 메시지 교환 |

판단 기준: **연결 유지가 필요하면 MCP, 한번 실행하고 끝이면 CLI.**

## 🔗 관련 개념

- [[mcp-cli-polymorphism]] - (MCP와 CLI를 동일 인터페이스로 추상화하는 패턴)
- [[MCP (Model Context Protocol)]] - (MCP 프로토콜 자체의 개념 정의)
- [[MCP Tool 패턴 (MCP Tool Patterns)]] - (MCP 도구 사용 패턴 허브)

---

**작성일**: 2026-03-05
**출처**: https://ejholmes.github.io/2026/02/28/mcp-is-dead-long-live-the-cli.html