---
title: Obsidian CLI
type: doc-summary
permalink: sources/reference/obsidian-cli
tags:
- obsidian
- cli
- automation
- terminal
date: 2026-02-11
---

# Obsidian CLI

Obsidian을 터미널에서 제어하는 명령줄 인터페이스. 스크립팅, 자동화, 외부 도구 통합에 활용.

## 📖 핵심 아이디어

Obsidian에서 할 수 있는 모든 것을 커맨드라인으로 수행 가능. 단일 명령 실행과 TUI(Terminal User Interface) 두 가지 모드를 지원하며, 개발자 도구(DevTools, 스크린샷, 플러그인 리로드, JS 실행 등)도 포함한다. Early Access 기능으로 Obsidian 1.12+ 및 Catalyst 라이선스가 필요하다.

## 🛠️ 주요 명령 카테고리

| 카테고리 | 대표 명령 | 용도 |
|----------|----------|------|
| **General** | `help`, `version`, `reload`, `restart` | 기본 제어 |
| **Files** | `create`, `read`, `append`, `prepend`, `move`, `delete`, `open` | 파일 CRUD |
| **Daily Notes** | `daily`, `daily:read`, `daily:append`, `daily:prepend` | 데일리 노트 |
| **Search** | `search query="..."`, `search:open` | 볼트 검색 |
| **Tasks** | `tasks`, `task` (toggle/done/todo) | 태스크 관리 |
| **Tags** | `tags`, `tag` | 태그 조회/관리 |
| **Properties** | `properties`, `property:set`, `property:remove`, `property:read` | 프론트매터 속성 |
| **Links** | `backlinks`, `links`, `unresolved`, `orphans`, `deadends` | 링크 분석 |
| **Plugins** | `plugins`, `plugin:enable/disable/install/uninstall/reload` | 플러그인 관리 |
| **Templates** | `templates`, `template:read`, `template:insert` | 템플릿 |
| **Bases** | `bases`, `base:views`, `base:create`, `base:query` | Bases 쿼리 |
| **Bookmarks** | `bookmarks`, `bookmark` | 북마크 |
| **Outline** | `outline` | 헤딩 트리 |
| **File History** | `diff`, `history`, `history:read/restore` | 버전 비교/복원 |
| **Sync** | `sync on/off`, `sync:status/history/read/restore` | Sync 관리 |
| **Publish** | `publish:site/list/status/add/remove/open` | Publish 관리 |
| **Themes** | `themes`, `theme:set/install/uninstall`, `snippets` | 테마/스니펫 |
| **Workspace** | `workspace`, `workspaces`, `tabs`, `tab:open`, `recents` | 워크스페이스/탭 |
| **Vault** | `vault`, `vaults`, `vault:open` | 볼트 정보/전환 |
| **Wordcount** | `wordcount` | 단어/글자 수 |
| **Developer** | `devtools`, `dev:debug`, `dev:cdp`, `eval`, `dev:screenshot` 등 | 개발자 도구 |

## 🔧 작동 방식 / 적용 방법

### 설치

1. Obsidian 인스톨러 1.11.7+ 및 Early Access 1.12.x로 업그레이드
2. Settings → General → Command line interface 활성화 → 프롬프트에 따라 등록
3. Windows는 추가로 `Obsidian.com` 파일 필요 (Discord #insider-desktop-release)

### 기본 사용법

```bash
# 단일 명령 실행
obsidian help

# TUI(인터랙티브 모드) 진입
obsidian
> help
```

### 파라미터와 플래그

```bash
# 파라미터: key=value 형식 (공백 포함 시 따옴표)
obsidian create name="Trip to Paris" template=Travel

# 플래그: 불리언 스위치 (값 없이 이름만)
obsidian create name=Note content="Hello" silent overwrite

# 멀티라인: \n으로 줄바꿈, \t으로 탭
obsidian create name=Note content="# Title\n\nBody text"

# 출력 복사: --copy 추가
obsidian read --copy
```

### 볼트/파일 타겟팅

```bash
# 볼트 지정 (첫 번째 파라미터로)
obsidian vault=Notes daily
obsidian vault="My Vault" search query="test"

# 파일 지정: file= (위키링크 해석) vs path= (정확한 경로)
obsidian read file=Recipe          # 이름으로 찾기
obsidian read path="Templates/Recipe.md"  # 경로로 찾기
```

### 자동화 활용 예시

```bash
# 데일리 노트에 태스크 추가
obsidian daily:append content="- [ ] Buy groceries"

# 볼트 전체 태스크 목록
obsidian tasks all todo

# 태스크 토글
obsidian task ref="Recipe.md:8" toggle

# 템플릿으로 노트 생성
obsidian create name="Meeting Notes" template=Meeting silent

# 프로퍼티 설정
obsidian property:set name=status value=done

# Bases 쿼리 (JSON/CSV/TSV/MD 출력)
obsidian base:query file=Tasks format=json

# JS 실행
obsidian eval code="app.vault.getFiles().length"

# 스크린샷
obsidian dev:screenshot path=screenshot.png
```

### TUI 키보드 단축키

| 기능 | 단축키 |
|------|--------|
| 줄 시작/끝 이동 | `Ctrl+A` / `Ctrl+E` |
| 단어 단위 이동 | `Alt+B` / `Alt+F` |
| 줄 삭제 (앞/뒤) | `Ctrl+U` / `Ctrl+K` |
| 자동완성 진입/수락 | `Tab` |
| 히스토리 검색 | `Ctrl+R` |
| 화면 정리 | `Ctrl+L` |
| 종료 | `Ctrl+C` / `Ctrl+D` |

## 💡 실용적 평가 / 적용

**강점:**
- Obsidian의 거의 모든 기능을 CLI로 노출 — 스크립팅/자동화에 강력
- `base:query`로 Bases 데이터를 JSON/CSV로 추출 가능 → 외부 파이프라인 연동
- `eval`로 임의 JS 실행 가능 → Obsidian API 직접 접근
- 개발자 도구 (CDP, DOM 쿼리, CSS 검사 등) 포함 → 플러그인/테마 개발 시 유용
- TUI 모드의 자동완성, 히스토리 검색으로 인터랙티브 사용도 편리

**한계:**
- Early Access(1.12+) + Catalyst 라이선스 필수 — 일반 사용자 접근 불가
- Obsidian 앱이 반드시 실행 중이어야 함 (headless 불가)
- Windows는 별도 `Obsidian.com` 파일 필요 (Discord에서 다운로드)
- 명령/구문이 Early Access 기간 중 변경될 수 있음

**우리 환경 적용:**
- n8n Execute Command 노드에서 `obsidian` CLI 호출 → 노트 자동 생성/수정 가능
- Claude Code에서 Bash 도구로 직접 호출 가능 (Windows 환경 Obsidian.com 설정 후)
- `obsidian base:query` → 대시보드 데이터 추출 자동화
- `obsidian tasks` → 태스크 상태 일괄 조회/업데이트

## 🔗 관련 개념

- [[Obsidian]] - 기반 앱
- [[Obsidian Bases]] - `base:query`로 CLI에서 쿼리 가능
- [[Obsidian Publish]] - `publish:*` 명령으로 관리
- [[Obsidian Sync]] - `sync:*` 명령으로 관리
- [[n8n]] - Execute Command 노드에서 CLI 호출 가능
- [[automation]] - 스크립팅/자동화 핵심 도구

---

**작성일**: 2026-02-11
**출처**: https://help.obsidian.md/cli
**분류**: Obsidian / CLI / Automation