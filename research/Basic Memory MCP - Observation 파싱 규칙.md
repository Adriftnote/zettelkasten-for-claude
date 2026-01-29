---
title: Basic Memory MCP - Observation 파싱 규칙
type: note
permalink: research/basic-memory-mcp-observation-pasing-gyucig
tags:
- basic-memory
- MCP
- parsing
- observation
- knowledge-format
---

# Basic Memory MCP - Observation 파싱 규칙

## 1. Observation Format (정확한 문법)

```
- [category] Content text #tag (optional context)
```

**구조 분석:**
- `- ` : Markdown 리스트 항목 시작
- `[category]` : 대괄호로 감싼 카테고리 (대문자/소문자 모두 가능)
- `Content text` : 메인 내용 (필수)
- `#tag` : 해시태그 (선택사항, 여러 개 가능)
- `(optional context)` : 괄호 안 추가 문맥 (선택사항)

**예시:**
```
- [method] Pour over extracts more floral notes than French press
- [tip] Grind size should be medium-fine for pour over #brewing
- [fact] Lighter roasts contain more caffeine than dark roasts
- [experiment] Tried 1:15 coffee-to-water ratio with good results (tested Jan 2026)
- [preference] Ethiopian beans have bright, fruity flavors (especially from Yirgacheffe)
```

---

## 2. 표준 Category 종류

| Category | 용도 | 예시 |
|----------|------|------|
| `[method]` | 절차, 접근 방식 | 추출 방법, 기술 |
| `[fact]` | 객관적 정보 | 과학적 사실, 데이터 |
| `[tip]` | 실용적 조언 | 베스트 프랙티스 |
| `[experiment]` | 테스트 결과 | 시도한 것, 결과 |
| `[preference]` | 개인 선호도 | 좋아하는 것, 의견 |
| `[resource]` | 외부 자료 참고 | 책, 영상, 링크 |
| `[question]` | 미답변 질문 | 조사할 것 |
| `[note]` | 일반 관찰 | 기타 정보 |
| `[tech]`, `[design]`, `[feature]`, `[decision]` | 기술/설계 분야 전용 |  |

**중요:** Category는 자유롭게 커스터마이징 가능. 위는 권장 표준.

---

## 3. Tag 파싱 규칙

**형식:**
- `#tagname` : 단일 태그
- 여러 태그 가능: `#tag1 #tag2`
- 태그는 observation 내 어디든 위치 가능

**파싱 방식:**
- `#` 다음의 연속 문자(영문, 숫자, 언더스코어)가 하나의 태그
- 공백이나 괄호로 구분
- 태그는 시스템이 자동 추출 → 검색/필터링용

**예시:**
```
- [tip] Grind size should be medium-fine #brewing #technique
- [fact] Lighter roasts #caffeine (more than dark roasts)
```

---

## 4. Context 파싱 규칙

**형식:**
- `(optional context)` : 괄호 안 텍스트
- 보조 정보 제공용

**파싱 방식:**
- 괄호 `()` 안의 모든 텍스트를 context로 추출
- 메인 콘텐츠를 보충하는 추가 정보
- 필수 아님

**예시:**
```
- [preference] Ethiopian beans have bright, fruity flavors (especially from Yirgacheffe)
- [experiment] Tried 1:15 coffee-to-water ratio with good results (tested Jan 2026)
- [resource] James Hoffman's V60 technique (YouTube link in description)
```

---

## 5. 파싱 우선순위

```
리스트 시작 (- ) 
  ↓
[category] 추출
  ↓
메인 콘텐츠 추출 (괄호 전까지)
  ↓
#tag 모두 추출
  ↓
(context) 추출
```

---

## 6. Relations (보너스)

Observations와 별도로, Relations로 문서 간 연결:

```
relation_type [[Document Name]] (optional context)
```

**표준 relation_type:**
- `implements`, `depends_on`, `relates_to`
- `inspired_by`, `requires`, `improves_with`
- `pairs_well_with`, `grown_in`, `contrasts_with`
- `documented_in`

---

## 7. 전체 예제

```markdown
# Coffee Brewing

- [fact] Lighter roasts contain more caffeine than dark roasts
- [method] Pour over extracts more floral notes than French press #technique
- [tip] Grind size should be medium-fine for pour over #brewing
- [preference] Ethiopian beans have bright, fruity flavors (Yirgacheffe region)
- [experiment] Tried 1:15 water-to-coffee ratio with good results #testing (Jan 2026)
- [resource] James Hoffman's V60 guide on YouTube

depends_on [[Grinder Setup]] (need burr grinder)
pairs_well_with [[Filter Selection]]
```

---

## 8. 핵심 정리

| 항목 | 규칙 |
|------|------|
| **기본 문법** | `- [category] text #tag (context)` |
| **Category** | 대괄호, 자유로운 커스터마이징 가능 |
| **Tag** | `#` + 문자, 자동 추출, 여러 개 가능 |
| **Context** | 괄호 `()`, 선택사항, 보조 정보 |
| **파일 형식** | Markdown (.md), YAML 프론트매터 포함 |
| **저장소** | 로컬 파일 기반 (클라우드 옵션 있음) |

---

## 출처
- GitHub: https://github.com/basicmachines-co/basic-memory
- 공식 문서: https://docs.basicmemory.com/
- MCP Tools Reference: https://docs.basicmemory.com/guides/mcp-tools-reference/
- Knowledge Format Guide: https://docs.basicmemory.com/guides/knowledge-format/