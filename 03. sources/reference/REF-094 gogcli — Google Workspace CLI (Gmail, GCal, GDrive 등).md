---
title: REF-094 gogcli — Google Workspace CLI (Gmail, GCal, GDrive 등)
type: doc-summary
permalink: sources/reference/gogcli-google-workspace-cli
tags:
- cli
- google-workspace
- gmail
- gdrive
- gcal
- automation
- go
date: 2026-03-10
---

# gogcli — Google Workspace CLI

터미널에서 Google Workspace 서비스(Gmail, Calendar, Drive, Docs, Sheets 등 16개+)를 직접 조작하는 Go 기반 CLI 도구. JSON 출력으로 스크립트/자동화 친화적.

## 📖 핵심 아이디어

gogcli는 Google의 개별 API(Gmail, Calendar, Drive, Sheets, Docs, Chat, Classroom, People, Tasks, Forms, Apps Script, Groups, Keep 등)를 하나의 CLI로 통합하여 터미널에서 직접 조작할 수 있게 한다. 복수 계정 동시 지원, OAuth2/서비스 계정 인증, `--json` 출력으로 n8n이나 셸 스크립트 기반 자동화 파이프라인에 바로 연결 가능하다.

## 🛠️ 구성 요소 / 주요 내용

| 항목        | 설명                                                                 |
| --------- | ------------------------------------------------------------------ |
| **언어**    | Go                                                                 |
| **Stars** | 6,000+ (2026-03 기준)                                                |
| **라이선스**  | Other (비표준)                                                        |
| **설치**    | `brew install gogcli` (macOS/Linux), `yay -S gogcli` (Arch), 소스 빌드 |
| **인증**    | OAuth2 Desktop + OS Keyring, 서비스 계정 (도메인 위임), ADC                  |
| **출력**    | 기본 테이블, `--json` (자동화용), `--plain` (TSV, 파이프용)                     |
| **복수 계정** | 계정 alias + per-client OAuth 버킷                                     |
| **홈페이지**  | https://gogcli.sh                                                  |
| **저자**    | Stefan Paulus (steipete)                                           |

### 지원 서비스 (16개+)

| 카테고리 | 서비스 |
|----------|--------|
| 커뮤니케이션 | Gmail, Chat (Workspace), Contacts/People |
| 일정/태스크 | Calendar, Tasks (RRULE 지원) |
| 문서 | Docs, Sheets, Slides, Forms |
| 파일 | Drive (공유 드라이브 포함) |
| 자동화 | Apps Script |
| 관리 | Admin, Groups (Workspace), Classroom, Keep (Workspace only) |

## 🔧 작동 방식 / 적용 방법

```
인증 흐름:
  gog auth credentials  →  OAuth2 Desktop 등록
  gog auth login        →  브라우저 인증 → OS Keyring 토큰 저장
                            (자동 갱신, 재로그인 불필요)

사용 예시:
  gog gmail search "from:boss subject:urgent" --json
  gog cal events list --from today --to "+7d"
  gog drive upload ./report.pdf --folder "Reports"
  gog sheets read SPREADSHEET_ID "Sheet1!A1:D10" --json
  gog tasks list --json | jq '.[] | .title'

자동화 파이프:
  gog gmail search "label:inbox" --json | jq ... | gog gmail modify ...
```

### 보안/샌드박스

- Command allowlisting: 에이전트/MCP 환경에서 허용 명령어만 실행 가능
- 최소 권한 스코프: 서비스별 granular permission
- 서비스 계정: 도메인 전체 위임 (Workspace 전용 기능)

## 💡 실용적 평가 / 적용

**장점:**
- Google Workspace 16개 서비스를 단일 CLI로 통합 — 개별 API 코드 작성 불필요
- `--json` 출력으로 n8n, 셸 스크립트, AI 에이전트 파이프라인에 즉시 연결
- 복수 계정 전환이 간단 (alias 기반)
- Command allowlisting으로 AI 에이전트 환경에서 안전하게 사용 가능

**한계:**
- Keep, Groups 등 일부 기능은 Workspace 계정 전용 (개인 Gmail 불가)
- 라이선스가 비표준 — 상업적 사용 시 확인 필요
- Google Cloud Console에서 OAuth 설정 + API 활성화 선행 필요

**적용 가능성:**
- n8n Execute Command 노드와 결합하여 Gmail/Calendar 자동화
- MCP 서버 래핑하여 Claude Code에서 Google Workspace 직접 조작
- 일괄 메일 처리, 캘린더 동기화, Drive 파일 관리 스크립트

## 🔗 관련 개념

- [[Claude Code - Anthropic 공식 CLI 에이전트]] - (CLI 기반 에이전트 도구라는 공통 패턴, gogcli도 에이전트에서 도구로 활용 가능)

---

**작성일**: 2026-03-10
**분류**: CLI / Google Workspace / 자동화
**원본**: https://github.com/steipete/gogcli