---
title: Basic Memory MCP 완전 가이드
type: guide
permalink: sources/reference/basic-memory-mcp-guide
tags:
- mcp
- basic-memory
- knowledge-graph
- obsidian
date: 2026-01-29
---

# Basic Memory MCP 완전 가이드

AI와 인간이 함께 지식을 구축하는 로컬 우선 지식 관리 시스템

## 📖 핵심 아이디어

**Basic Memory**는 마크다운 파일 기반의 지식 그래프 시스템입니다. 사용자와 AI 모두 노트를 읽고 쓸 수 있으며, Obsidian과 완벽 호환됩니다.

핵심 원칙: **Observations = 사실 기록, Relations = 개념 연결**

## 🛠️ 지식 그래프 3요소

| 요소 | 설명 | 형식 |
|------|------|------|
| **Entities** | 파일 = 엔티티 | 각 .md 파일이 하나의 개념 |
| **Observations** | 사실 기반 정보 | `- [category] 내용 #tag` |
| **Relations** | 노트 간 연결 | `- type [[대상]] (context)` |

### Observation 카테고리 (6개)

| 카테고리 | 용도 |
|---------|------|
| `[fact]` | 객관적 사실 |
| `[method]` | 방법, 절차 |
| `[decision]` | 선택/결정 기록 |
| `[example]` | 구체적 사례 |
| `[reference]` | 참고자료 |
| `[question]` | 미해결 질문 |

### 표준 Relation 타입

`relates_to`, `extends`, `part_of`, `implements`, `depends_on`, `used_by`, `mitigates`, `similar_to`, `contains`, `organizes`, `connects_to`, `derived_from`

## 🔧 핵심 파싱 규칙 (매우 중요!)

### ⚠️ Context 저장 형식

```markdown
# ❌ Context 저장 안됨
- extends [[A]] - 설명

# ✅ Context 정상 저장
- extends [[A]] (설명)
```

**`]] (괄호)` 형식만 DB의 context 필드에 저장됨!**

### 피해야 할 패턴

| 패턴 | 문제 |
|------|------|
| `- [index:N] [[링크]]` | `[index:N]`이 relation_type으로 파싱 |
| `- [태그] **볼드**: [[링크]]` | 전체가 relation_type으로 파싱 |
| 테이블/blockquote 안 wikilink | 예상치 못한 파싱 |

**원칙**: Relations 섹션에서만 wikilink 사용

## 🔧 주요 MCP 도구

| 도구 | 용도 |
|------|------|
| `write_note` | 노트 생성/수정 |
| `read_note` | 노트 읽기 |
| `edit_note` | 부분 수정 (append, replace_section 등) |
| `search_notes` | 검색 |
| `build_context` | memory:// URL로 관계 탐색 |
| `recent_activity` | 최근 활동 조회 |

### build_context 예시

```
build_context(url="memory://Progressive Disclosure", depth=2)
build_context(url="memory://concepts/*", timeframe="7d")
```

## 💡 실용적 적용

### 워크플로우

```
1. search_notes로 관련 노트 찾기
2. read_note로 내용 확인
3. build_context로 관계 탐색
4. write_note로 새 지식 추가
```

### Best Practices

- **Observations**: `## Observations` 섹션에서만 사용
- **Relations**: `## Relations` 섹션에서만 wikilink
- **Context**: 반드시 `]] (괄호)` 형식
- **Forward Reference**: 아직 없는 노트도 참조 가능 (나중에 자동 연결)

### 한글 검색 주의

- FTS5 + unicode61 토크나이저 사용
- 조사가 붙은 단어는 별개 토큰 ("문제" ≠ "문제가")

## 🔗 관련 개념

- [[Basic Memory 허브 (Basic Memory Hub)]] - 허브 노트
- [[컨텍스트 엔지니어링 (Context Engineering)]] - 컨텍스트 최적화

---

**작성일**: 2026-01-29
**출처**: docs.basicmemory.com + 실제 테스트