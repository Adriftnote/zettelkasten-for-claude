---
title: Vault Conventions
type: note
permalink: 00.-inbox/vault-conventions
tags:
- meta
- conventions
- template
---

# Vault Conventions

이 볼트의 노트 작성 규칙입니다.

## 폴더 구조

| 폴더 | 용도 | 스킬 |
|------|------|:----:|
| `00. inbox` | 임시 노트, 정리 전 | - |
| `01. concepts` | 개념 노트 (컨샙노트) | `/concept` |
| `02. hubs` | 허브 노트 (개념 모음) | `/hub` |
| `03. sources/reference` | 외부 출처 (논문, 문서) | `/reference` |
| `03. sources/workcases` | 업무 사례 (트러블슈팅, 학습) | `/workcase` |
| `04. notes` | 도출된 지식 (derived) | `/note` |

## 컨샙노트 형식

```yaml
---
title: [개념 이름]
type: concept
permalink: knowledge/concepts/[slug]
tags:
- [카테고리]
category: [분류]
difficulty: 초급 | 중급 | 고급
---
```

### 필수 섹션

1. **# 제목** - 한 줄 정의
2. **📖 개요** - 2-3문장 상세 설명
3. **🎭 비유** - 일상적 비유
4. **✨ 특징** - 불릿 리스트
5. **💡 예시** - 코드나 구체적 사례
6. **Relations** - 관계 링크 (wikilink는 여기서만!)

### Relations 형식

```markdown
## Relations

- relation_type [[대상노트]] (설명)
```

주요 relation_type: `relates_to`, `similar_to`, `different_from`, `part_of`, `used_by`, `enables`

## 핵심 규칙

- **wikilink는 Relations 섹션에서만** 사용
- 본문에서 개념 언급 시 `#태그` 또는 일반 텍스트
- 테이블, blockquote에 wikilink 금지