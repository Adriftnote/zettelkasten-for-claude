---
title: Basic Memory 관계(Relation) 커스터마이징 가이드
date: 2026-01-21
tags:
- basic-memory
- knowledge-graph
- guide
- mcp
permalink: knowledge/setup-and-guides/basic-memory-relation-customization-1
category: Guide
extraction_status: pending
---

# Basic Memory 관계(Relation) 커스터마이징 가이드

## 개요

Basic Memory의 `relation_type`(엣지)은 **완전히 커스터마이징 가능**합니다.

> **출처**: [Basic Memory GitHub - User Guide](https://github.com/basicmachines-co/basic-memory/blob/main/docs/User%20Guide.md)

---

## 올바른 문법 ✅

```markdown
## Relations
- relation_type [[Target]]
```

**핵심**: `relation_type`이 **앞에** 오고, `[[wikilink]]`가 **뒤에** 옵니다.

### 예시

```markdown
## Relations

- 인스턴스 [[notes/시스템1-2와 기억 재구성]]
- 구현됨 [[knowledge/architectures/Three-Layer Memory Architecture]]
- 배경_제공 [[notes/심볼릭 AI vs 커넥셔니스트 AI 역사]]
- implements [[Security Requirements]]
- depends_on [[User Authentication]]
```

### DB 저장 결과

| from_entity | relation_type | to_entity |
|-------------|---------------|-----------|
| 현재 노트 | 인스턴스 | 시스템1-2와 기억 재구성 |
| 현재 노트 | 구현됨 | Three-Layer Memory Architecture |
| 현재 노트 | 배경_제공 | 심볼릭 AI vs 커넥셔니스트 AI 역사 |

---

## 잘못된 문법 ❌

```markdown
## 관계
- [[Target]] — `relation_type`   ← DB에 저장 안됨!
```

이 형식은 **마크다운 가독성**에만 유용하고, Basic Memory가 **커스텀 타입을 인식하지 못합니다**.
→ 모두 `relates_to`로 저장됨

---

## 관계 타입 설계 가이드

### 권장 관계 타입 (한글/영어)

| 카테고리 | 한글 | 영어 | 의미 |
|----------|------|------|------|
| **계층** | 인스턴스 | instance_of | 추상 → 구체 |
| | 구현됨 | implements | 설계 → 구현 |
| | 확장함 | extends | 기반 → 확장 |
| **연결** | 참조 | references | 단순 참조 |
| | 관련됨 | relates_to | 느슨한 연결 |
| | 유사 | similar_to | 유사성 기반 |
| **맥락** | 배경_제공 | provides_context | 역사/이론 |
| | 출처 | source | 정보 출처 |
| **상태** | 해결함 | resolves | 문제 → 해결책 |
| | 대체함 | replaces | 구버전 → 신버전 |
| | 의존 | depends_on | 의존 관계 |

### 주의사항

- **공백 사용 금지**: `배경 제공` ❌ → `배경_제공` ✅
- **일관성 유지**: 프로젝트 전체에서 같은 타입명 사용

---

## Memory URL로 관계 탐색

### 특정 관계 타입 조회

```
memory://auth-system/implements/*
```
→ auth-system에서 `implements` 관계를 가진 모든 문서

### 패턴 문법

| 패턴 | 의미 |
|------|------|
| `memory://path/relation_type/*` | 특정 타입의 모든 관계 |
| `memory://path/*/target` | target과 연결된 모든 관계 |

---

## 활용 예시

### 1. 연구 노트 구조화

```markdown
---
title: Fast-Slow 프랙탈 연구
---

## Relations

- 인스턴스 [[notes/시스템1-2와 기억 재구성]]
- 인스턴스 [[notes/Engram과 지식 구조]]
- 인스턴스 [[notes/KGGen 이해]]
- 배경_제공 [[notes/심볼릭 AI vs 커넥셔니스트 AI 역사]]
- 구현됨 [[knowledge/architectures/Three-Layer Memory Architecture]]
```

### 2. 아키텍처 문서

```markdown
---
title: Three-Layer Memory Architecture
---

## Relations

- 이론적_기반 [[notes/Fast-Slow 프랙탈]]
- 출처 [[reviews/AgeMem-paper-review]]
- 구현_상세 [[reviews/basic-memory-db-schema]]
- 활용 [[knowledge/_concepts/BM25]]
```

### 3. 문제 해결 기록

```markdown
---
title: Windows Timestamp Bug 해결
---

## Relations

- 해결함 [[knowledge/gotchas/Claude Code Windows Edit Bug]]
- 해결_방법 [[knowledge/patterns/Safely Patching CLI.js with sed]]
- 관련됨 [[knowledge/gotchas/Claude Code File Watcher Cache]]
```

---

## build_context 활용

### 그래프 탐색

```python
result = build_context(
    url="memory://notes/Fast-Slow 프랙탈",
    depth=2,
    project="obsidian-kb"
)
```

**결과 예시:**
```json
{
  "relations": [
    {
      "from_entity": "Fast-Slow 프랙탈",
      "relation_type": "인스턴스",
      "to_entity": "시스템1-2와 기억 재구성"
    },
    {
      "from_entity": "Fast-Slow 프랙탈",
      "relation_type": "구현됨",
      "to_entity": "Three-Layer Memory Architecture"
    }
  ]
}
```

### SQL로 관계 타입 분석

```sql
-- 관계 타입별 분포
SELECT relation_type, COUNT(*) as count
FROM relation
GROUP BY relation_type
ORDER BY count DESC;

-- 특정 관계 타입만 조회
SELECT e1.title, r.relation_type, COALESCE(e2.title, r.to_name)
FROM relation r
JOIN entity e1 ON r.from_id = e1.id
LEFT JOIN entity e2 ON r.to_id = e2.id
WHERE r.relation_type = '인스턴스';
```

---

## Observations 문법 (참고)

관계와 함께 사용하면 유용한 observation 문법:

```markdown
## Observations

- [fact] BM25는 TF-IDF를 개선한 키워드 검색 알고리즘이다
- [opinion] Engram이 가장 혁신적인 접근이다
- [question] GIL 문제는 어떻게 해결하나?
```

→ `observation` 테이블에 `category`와 함께 저장됨

---

## 요약

| 항목 | 문법 | 예시 |
|------|------|------|
| **커스텀 관계** | `- type [[Target]]` | `- 인스턴스 [[노트]]` |
| **Observation** | `- [category] content` | `- [fact] 사실 내용` |
| **단순 링크** | `[[Target]]` | `[[노트]]` → `relates_to` |

---

## 🔗 관련 문서

- [[03. sources/reviews/basic-memory-db-schema|Basic Memory DB 스키마]] - relation 테이블 상세
- [[Three-Layer Memory Architecture|3계층 메모리 아키텍처]] - 관계 활용 예시
- [[KGGen 이해 - 명사 통합과 동사 관계|KGGen 이해]] - 지식 그래프 이론

## 🔗 외부 참고

- [Basic Memory GitHub](https://github.com/basicmachines-co/basic-memory)
- [Basic Memory User Guide](https://github.com/basicmachines-co/basic-memory/blob/main/docs/User%20Guide.md)

---

**작성일**: 2026-01-21
**카테고리**: Guide / Basic Memory
**검증**: 2026-01-21 테스트 완료