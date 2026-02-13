---
title: GitHub Copilot Spaces 공식 문서
type: doc-summary
permalink: sources/reference/github-copilot-spaces
tags:
- github
- copilot
- semantic-search
- rag
- mcp
date: 2026-02-13
---

# GitHub Copilot Spaces 공식 문서

Copilot이 답변에 사용할 컨텍스트를 큐레이팅하는 기능. 레포/파일/텍스트를 넣으면 자동 인덱싱 + 시맨틱 검색 제공. 사실상 무료 관리형 RAG.

## 📖 핵심 아이디어

Copilot Spaces는 Knowledge Base의 후속작(2025년 11월 KB 종료)으로, 코드·문서·이슈·자유텍스트·이미지를 하나의 Space에 모아두면 Copilot이 시맨틱 검색으로 관련 컨텍스트를 찾아 답변에 활용한다. Copilot Free 포함 모든 라이선스에서 사용 가능하며, GitHub 소스는 변경 시 자동 동기화된다.

## 🛠️ 구성 요소 / 주요 내용

### 지원 콘텐츠

| 소스 | 동기화 | 비고 |
|------|:---:|------|
| GitHub 레포지토리 | 자동 | 코드 변경 시 자동 재인덱싱 |
| 코드 파일 | 자동 | github.com 코드 뷰어에서 직접 추가 가능 |
| Pull Requests | 자동 | |
| Issues | 자동 | |
| 자유 텍스트 | 수동 | 메모, 트랜스크립트 등 |
| 이미지 | 수동 | |
| 파일 업로드 | 수동 | |

### 인덱싱 성능

- 레포 인덱싱: **수초 ~ 최대 60초**
- 소스 변경 시 자동 동기화
- 시맨틱 검색 (키워드 매칭이 아닌 의미 기반)

### 접근 방법

| 채널 | 방식 |
|------|------|
| GitHub 웹 | Copilot Chat에서 Space 선택 |
| IDE | VS Code 등 Copilot 확장 + GitHub MCP 서버 |
| MCP | `api.githubcopilot.com/mcp/` 엔드포인트 |

### 공유 모델

| 소유 | 옵션 |
|------|------|
| 조직 소유 | admin / editor / viewer 역할 기반 |
| 개인 소유 | public (읽기 전용) / private / 특정 사용자 |

### 비용

| 항목 | 비용 |
|------|------|
| Space 생성/인덱싱 | **무료** |
| 질문 (Chat 요청) | Copilot Chat 할당량 차감 |
| Free tier | 월간 채팅 한도 내 |
| 프리미엄 모델 | 별도 할당량 (모델별 배수 적용) |

## 🔧 작동 방식 / 적용 방법

### 기본 워크플로우

```
1. Space 생성
2. 소스 추가 (레포, 파일, 텍스트, 이미지)
   → 자동 인덱싱 (수초~60초)
   → 시맨틱 임베딩 생성
3. Copilot Chat에서 Space 선택 후 질문
   → 시맨틱 검색 → 관련 컨텍스트 주입 → 답변
```

### MCP 서버 연동 (IDE에서 접근)

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "X-MCP-Toolsets": "default,copilot_spaces"
      }
    }
  }
}
```

MCP 도구:
- `list_copilot_spaces` — Space 목록 조회
- `get_copilot_space` — Space 컨텍스트 가져오기

### Obsidian Vault 활용 시나리오

```
Obsidian Vault
     │
     ▼ git push
GitHub Private Repo
     │
     ▼ Space에 연결
Copilot Space (자동 인덱싱 + 자동 동기화)
     │
     ├→ GitHub 웹 Copilot Chat: "이런 맥락의 노트 있었나?"
     ├→ VS Code Copilot: IDE에서 vault 시맨틱 검색
     └→ MCP: get_copilot_space로 컨텍스트 가져오기
```

## 💡 실용적 평가 / 적용

### 장점

- **무료 시맨틱 검색**: Space 생성/인덱싱 비용 없음
- **관리 zero**: 임베딩·벡터DB·청킹 전부 자동
- **자동 동기화**: GitHub 소스 변경 시 재인덱싱 자동
- **인덱싱 속도**: 수초~60초 (vecsearch의 분 단위 대비 빠름)
- **진입 장벽 낮음**: Copilot Free로 충분

### 한계

- **REST API 없음**: 외부 프로그래밍 접근 불가, UI 종속 설계
- **GitHub 생태계 종속**: Copilot OAuth 인증 필수
- **Claude Code 직접 연동 어려움**: MCP 엔드포인트는 Copilot 토큰 요구
- **시맨틱 검색만 추출 불가**: "검색 결과만 가져오기" 같은 API 없음
- **Chat 할당량 소비**: 무제한이 아님, Free tier 월간 한도

### 시맨틱 검색 옵션 비교

| 방식 | 비용 | 관리 | 외부 API | Claude 연동 |
|------|:---:|:---:|:---:|:---:|
| **로컬 vecsearch** | 무료 | 직접 | CLI | ✅ 직접 호출 |
| **Gemini File Search** | 유료 | 자동 | MCP 있음 | ✅ MCP 연결 |
| **Copilot Spaces** | 무료 | 자동 | MCP (제한) | ❌ 인증 벽 |

### 적용 방안

- **단독 사용**: vault를 private repo로 push → Space 연결 → Copilot Chat에서 시맨틱 검색 (무료)
- **보조 채널**: 로컬 vecsearch가 메인, Copilot Spaces는 웹/모바일에서 빠르게 검색할 때
- **팀 공유**: 조직 Space로 만들면 팀원들도 vault 시맨틱 검색 가능

## 🔗 관련 개념

- [[Gemini File Search API 공식 문서]] - 경쟁 클라우드 RAG 서비스
- [[Gemini CLI 공식 문서]] - Gemini 진영 CLI 도구
- [[벡터 시맨틱 검색]] - 로컬 vecsearch와 비교
- [[MCP]] - Model Context Protocol 연동

---

**작성일**: 2026-02-13
**출처**: https://docs.github.com/en/copilot/concepts/context/spaces
**분류**: 서비스 문서 정리
