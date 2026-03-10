---
title: Gemini CLI 공식 문서
type: doc-summary
permalink: sources/reference/gemini-cli
tags:
- gemini
- cli
- ai-agent
- mcp
- google
date: 2026-02-13
---

# Gemini CLI 공식 문서

Google의 오픈소스 AI 에이전트. 터미널에서 Gemini 모델을 직접 사용하며, Claude Code와 동일한 포지션의 CLI 도구.

## 📖 핵심 아이디어

Gemini CLI는 터미널에서 Gemini 모델로 코드 작성, 파일 관리, 웹 검색, 셸 실행을 수행하는 ReAct 루프 에이전트다. Apache 2.0 오픈소스이며, 무료 tier (1,000 req/day)를 제공한다. MCP 서버와 Extensions 시스템으로 기능 확장이 가능하고, GEMINI.md로 프로젝트별 컨텍스트를 설정한다.

## 🛠️ 구성 요소 / 주요 내용

### 설치

```bash
# 설치 없이 바로 실행
npx @google/gemini-cli

# 전역 설치
npm install -g @google/gemini-cli

# macOS
brew install gemini-cli
```

### 인증

| 방식 | 비용 | Rate Limit | 비고 |
|------|------|-----------|------|
| Google OAuth | 무료 | 60 req/min, 1,000 req/day | Gemini 3 모델 |
| Gemini API Key | 무료 | 1,000 req/day | 모델 선택 자유 |
| Vertex AI | 유료 | 확장 가능 | 엔터프라이즈 |

### 내장 도구

| 도구                  | 별칭         | 기능                      |
| ------------------- | ---------- | ----------------------- |
| `list_directory`    | ReadFolder | 디렉토리 목록                 |
| `read_file`         | ReadFile   | 파일 읽기 (텍스트/이미지/오디오/PDF) |
| `write_file`        | WriteFile  | 파일 생성/덮어쓰기              |
| `glob`              | FindFiles  | 글로브 패턴 파일 검색            |
| `grep_search`       | SearchText | 정규식 내용 검색               |
| `replace`           | Edit       | 파일 내용 수정                |
| `run_shell_command` | -          | 셸 명령 실행                 |
| `web_fetch`         | -          | URL 콘텐츠 가져오기            |
| `google_web_search` | -          | Google Search grounding |
| `save_memory`       | -          | 세션 간 정보 저장              |
| `write_todos`       | -          | 서브태스크 관리                |
| `ask_user`          | -          | 사용자 입력 요청               |

### 주요 기능

| 기능 | 설명 |
|------|------|
| GEMINI.md | 프로젝트별 컨텍스트 설정 (= CLAUDE.md) |
| Checkpointing | 세션 저장/복원 |
| Headless 모드 | CI/CD 파이프라인용 |
| 코드 샌드박싱 | 격리 컨테이너 실행 |
| 토큰 캐싱 | 성능 최적화 |
| .geminiignore | 민감 파일 제외 |
| 1M 토큰 | 컨텍스트 윈도우 |
| `-m` 플래그 | 모델 선택 (예: `gemini-2.5-flash`) |

## 🔧 작동 방식 / 적용 방법

### MCP 서버 연동

설정 파일: `~/.gemini/settings.json`

```json
{
  "mcpServers": {
    "myServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {"API_KEY": "$MY_TOKEN"},
      "timeout": 15000
    }
  }
}
```

지원 전송 방식: **stdio**, **SSE**, **HTTP streaming**

관리 명령:

```bash
gemini mcp add <name> <command>      # 서버 추가
gemini mcp list                      # 목록 조회
gemini mcp remove <name>             # 서버 제거
gemini mcp enable/disable <name>     # 활성화/비활성화
```

옵션:
- `includeTools` / `excludeTools`: 도구 필터링
- `trust: true`: 확인 없이 실행 (주의)
- OAuth 인증 지원

### Extensions 시스템

```bash
# 설치 (GitHub URL 또는 로컬 경로)
gemini extensions install https://github.com/user/extension

# 관리
gemini extensions list
gemini extensions update <name>
```

Extension 구조:
```
my-extension/
├── gemini-extension.json    # 설정 파일 (필수)
├── GEMINI.md                # 컨텍스트 (선택)
└── commands/                # 커스텀 명령 TOML (선택)
```

포함 가능: MCP 서버, GEMINI.md, 커스텀 슬래시 명령, 커스텀 커맨드

### File Search 연동

```bash
gemini extensions install https://github.com/tanaikech/FileSearchStore-extension
```

11개 도구 제공:

| 도구 | 기능 |
|------|------|
| `file_search_store_create` | Store 생성 |
| `file_search_store_list` | Store 목록 |
| `file_search_store_get` | Store 메타데이터 조회 |
| `file_search_store_delete` | Store 삭제 |
| `file_search_store_import_file` | 파일/텍스트 업로드 |
| `file_search_store_upload_media` | 미디어 업로드 |
| `document_list` | 문서 목록 |
| `document_get` | 문서 조회 |
| `document_delete` | 문서 삭제 |
| `generate_content` | RAG 기반 응답 생성 |
| `operation_get` | 비동기 작업 상태 확인 |

## 💡 실용적 평가 / 적용

### Claude Code와 비교

| 항목 | Gemini CLI | Claude Code |
|------|-----------|-------------|
| 모델 | Gemini 3, 2.5 등 | Claude Sonnet/Opus |
| 설정파일 | GEMINI.md | CLAUDE.md |
| MCP | 지원 | 지원 |
| 확장 | Extensions 시스템 | Skills |
| 라이선스 | Apache 2.0 (오픈소스) | 상용 |
| 무료 tier | 1,000 req/day | 없음 |
| 컨텍스트 | 1M 토큰 | 200K 토큰 |

**장점:**
- 오픈소스 + 무료 tier → 진입 장벽 낮음
- Extensions 생태계로 커뮤니티 확장 활발
- File Search extension으로 RAG 즉시 사용 가능
- Google Search grounding 내장

**한계:**
- Gemini 모델 품질이 Claude 대비 코딩에서 약할 수 있음
- 무료 tier rate limit (1,000 req/day)
- Extensions가 커뮤니티 의존 (공식 품질 보증 제한)

**적용 방안:**
- Gemini CLI의 Extensions/MCP 구조를 Claude Code 스킬 설계 시 참고
- File Search extension 방식을 Claude Code MCP로 포팅 가능
- 무료 tier로 보조 에이전트/워커 운용 가능성

## 🔗 관련 개념

- [[Gemini File Search API 공식 문서]] - File Search API 상세
- [[MCP (Model Context Protocol)]] - Model Context Protocol
- [[Claude Code]] - 경쟁 CLI 도구

---

**작성일**: 2026-02-13
**출처**: https://github.com/google-gemini/gemini-cli, https://geminicli.com/docs/
**분류**: CLI 도구 문서 정리
