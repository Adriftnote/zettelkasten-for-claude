---
title: Claude Code Overview - 공식 문서
type: reference
permalink: 03.-sources/reference/claude-code-overview-gongsig-munseo
tags:
- claude-code
- anthropic
- cli
- agent
- agentic-tool
---

# Claude Code Overview - 공식 문서

## 개요

Claude Code는 Anthropic의 **agentic coding tool**로, 코드베이스를 읽고, 파일을 편집하고, 명령어를 실행하고, 개발 도구와 통합하는 AI 기반 코딩 어시스턴트다.

**주요 특징**: 터미널, IDE(VS Code/JetBrains), 데스크톱 앱, 웹 브라우저, 모바일 앱 등 다양한 환경에서 동작

---

## 주요 기능

### 1. 코드 작업 자동화
- 테스트 작성 (untested code에 대한 자동 테스트)
- Lint 에러 수정
- 병합 충돌(merge conflicts) 해결
- 의존성 업데이트
- 릴리스 노트 작성

### 2. 기능 개발 & 버그 수정
- 자연어 설명으로 기능 구현
- 에러 메시지 분석 및 root cause 추적
- 다중 파일 수정 및 검증

### 3. Git 워크플로우 통합
- 변경사항 staged
- 자동 커밋 메시지 작성
- 브랜치 생성
- Pull Request 자동 생성

### 4. MCP(Model Context Protocol) 통합
- Google Drive 디자인 문서 읽기
- Jira 티켓 업데이트
- Slack 데이터 수집
- 커스텀 도구 연동

### 5. 커스터마이징
- **CLAUDE.md**: 코딩 표준, 아키텍처, 라이브러리 선호도, 리뷰 체크리스트
- **Skills**: `/review-pr`, `/deploy-staging` 같은 커스텀 슬래시 명령어
- **Hooks**: 파일 편집 후 포맷팅, 커밋 전 lint 실행 등

### 6. 에이전트 팀 & 커스텀 에이전트
- 다중 Claude Code 에이전트가 병렬로 작동
- Lead agent가 작업 조율
- Agent SDK로 완전 커스텀 에이전트 구축 가능

### 7. CLI 파이핑 & 자동화
- 로그를 파이프로 전달하여 분석
- CI/CD 환경에서 실행
- Unix 철학에 따른 조합 가능:
  ```bash
  tail -f app.log | claude -p "Slack me if you see anomalies"
  git diff main --name-only | claude -p "review for security"
  ```

### 8. 모든 환경에서 작동
- 로컬에서 시작한 작업을 모바일에서 계속 (Web + iOS app)
- 클라우드 인프라에서 실행하므로 로컬 개발환경 불필요

---

## 설치 환경

### Terminal CLI (권장)
**macOS/Linux/WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

실행:
```bash
cd your-project
claude
```

**옵션**: Homebrew, WinGet, Manual install 지원

### IDE 지원
- **VS Code**: 인라인 diffs, @-mentions, plan review, 대화 기록
- **JetBrains**: IntelliJ IDEA, PyCharm, WebStorm 등 플러그인
- **Cursor**: VS Code 확장 동일 지원

### 데스크톱 앱
- macOS (Intel, Apple Silicon), Windows (x64)
- 동시 세션 실행, 클라우드 세션 kick-off

### 웹 & 모바일
- `claude.ai/code`에서 브라우저로 실행
- Claude iOS app에서 모바일 작업 가능
- 로컬 설정 불필요, 클라우드 실행

---

## 통합 옵션

| 목표 | 최적 옵션 |
|------|----------|
| 로컬→모바일 이동 | Web + Claude iOS app |
| PR 리뷰/이슈 자동화 | GitHub Actions / GitLab CI/CD |
| Slack→PR 연결 | Slack 통합 |
| 라이브 웹 디버깅 | Chrome 통합 |
| 커스텀 에이전트 | Agent SDK |

---

## 설정 & 커스터마이징

### CLAUDE.md (프로젝트 루트)
- 코딩 표준
- 아키텍처 결정사항
- 선호 라이브러리
- 리뷰 체크리스트
- 모든 환경(Terminal, IDE, Web, Desktop)에서 자동 읽기

### Skills (커스텀 슬래시 명령어)
팀이 공유할 수 있는 반복 가능한 워크플로우 정의

### Hooks
파일 편집 후, 커밋 전 등 특정 시점에 쉘 명령어 자동 실행

---

## 사용 사례

1. **테스트 및 품질**: `claude "write tests for the auth module, run them, fix failures"`
2. **자동화된 PR/커밋**: 변경사항 자동 커밋 및 PR 생성
3. **CI/CD 통합**: GitHub Actions, GitLab CI에서 자동 코드 리뷰
4. **팀 채팅**: Slack에서 버그 리포트 → PR 생성
5. **병렬 작업**: 에이전트 팀으로 대형 작업 분산

---

## 출처
- URL: https://code.claude.com/docs/en/overview
- 리다이렉트 원본: https://docs.anthropic.com/en/docs/claude-code/overview
- 문서 인덱스: https://code.claude.com/docs/llms.txt
