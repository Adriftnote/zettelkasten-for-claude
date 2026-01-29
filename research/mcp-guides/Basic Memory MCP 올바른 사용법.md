---
title: Basic Memory MCP 올바른 사용법
type: note
permalink: research/mcp-guides/basic-memory-mcp-olbareun-sayongbeob
tags:
- mcp
- basic-memory
- markdown
- knowledge-graph
---

## 핵심 발견

### 1. write_note 함수의 역할
- **목적**: 노트를 생성/업데이트하고 자동으로 시맨틱 관계를 생성
- **반환**: SQLite DB의 relation 테이블에 자동 저장됨
- **주의**: relation 테이블의 'context' 필드는 자동 생성 안 됨

### 2. Markdown 포맷 (필수)

#### YAML 프론트매터
```yaml
title: 노트 제목
type: note
tags: [tag1, tag2]
permalink: custom-slug
```

#### Observations (사실)
- 형식: `- [category] Content #tag (optional context)`
- 필수: 3-5개 이상의 observation
- 카테고리: [fact], [decision], [technique], [method], [tip], [preference], [experiment], [resource], [question], [note]

#### Relations (연결)
- 형식: `- relation_type [[Target Entity]]`
- 필수: 2개 이상의 relation
- 관계 유형: implements, requires, relates_to, extends, part_of, contains, depends_on, inspired_by, contrasts_with, pairs_well_with, grown_in, improves_with, affects, links_to
- **중요**: wikilink는 자동으로 대상 entity와 bidirectional 연결 생성

### 3. Relation Table 구조

DB의 relation 테이블:
- `source`: 현재 entity
- `target`: 링크된 entity
- `relation_type`: 관계 유형
- `context`: **사용자가 직접 입력할 필드 (자동 생성 안 됨)**

**문제**: write_note에서 context 필드를 직접 설정할 방법 없음
- 해결: relation 생성 후 edit_note로 수정하거나, wikilink 뒤 (parenthesis)에서 제공

### 4. WikiLink 자동 파싱

기본 메커니즘:
1. 마크다운에 `[[Entity Name]]` 작성
2. Basic Memory가 자동으로 entity와 relation 생성
3. forward reference 지원 (아직 존재하지 않는 entity도 가능)
4. entity 생성 시 자동으로 relation 해결

### 5. write_note 사용 시 주의사항

#### 올바른 사용
```
write_note(
  title="Task: 데이터 분석",
  content="""
title: Task: 데이터 분석
type: task
tags: [analytics]
permalink: task-data-analysis

## Observations
- [decision] 파이썬 pandas 사용하기로 결정
- [technique] 월별 집계는 groupby() 사용
- [requirement] 외부 API 호출 성능 최적화 필요

## Relations
- part_of [[프로젝트: 대시보드]]
- requires [[도구: Pandas]]
- affects [[산출물: 월간보고서]]
  """,
  folder="tasks",
  tags=["analytics"],
  project="zettelkasten"
)
```

#### 피해야 할 것
- relation section에 context 직접 입력 (자동 파싱 안 됨)
- observation 부족 (3개 미만)
- wikilink 없이 관계 설명 (파싱 안 됨)
- project 지정 안 함 (필수)

### 6. Context 필드 올바른 작성 방법

#### 방법 1: wikilink에 context 추가 (권장)
```markdown
- requires [[Pandas]] (데이터 프레임 변환용)
- part_of [[Dashboard Project]] (분기별 리뷰 용도)
```

#### 방법 2: 설명 다음에 주석
```markdown
## Relations
- requires [[Pandas]]
  참고: 데이터 프레임 변환용
- implements [[Spec: API Design]]
  목표: RESTful API 표준 준수
```

### 7. Relation Table 자동 생성 조건

다음 조건을 **모두** 만족할 때만 relation이 DB에 저장됨:
1. ✓ Markdown 포맷이 정확 (`- type [[Entity]]`)
2. ✓ write_note로 저장
3. ✓ project 파라미터 지정
4. ✓ title이 명확함
5. ✓ folder가 유효함

### 8. 현재 문제점과 해결 방안

**문제**: relation 테이블의 context 필드가 비어있음

**원인**: 
- write_note의 content 파라미터에서 context 정보를 추출하는 방법 없음
- relation이 자동 파싱될 때 context 필드는 기본값으로 저장됨

**해결 방안**:
1. Markdown에서 `[[Entity]] (context)` 형태로 작성
2. edit_note로 저장 후 수정
3. build_context() 호출할 때 memory:// URL에서 추가 context 로드
4. 대신 description 필드에서 관계 설명 제공

### 9. build_context() 활용

relation table 없이도 컨텍스트 생성 가능:

```
build_context(
  url="memory://task-data-analysis",
  project="zettelkasten",
  depth=2,
  timeframe="1 week"
)
```

이를 통해:
- 관련 entity 자동 탐색
- 시간 범위 내 변경사항 추적
- 깊이만큼 관계 따라가기

## 결론

**올바른 사용법**:
1. Markdown 프론트매터 + observation + relation 작성
2. wikilink로 관계 정의 (자동 파싱)
3. context는 wikilink 뒤 (parenthesis)에 기록
4. write_note로 저장 시 project 필수 지정
5. context 정보가 필요하면 build_context() 사용

**틀린 것**:
- relation section에 따옴표나 중괄호로 context 감싸기
- context를 별도 필드로 전달하기
- project 파라미터 생략

## 출처

- [Basic Memory 공식 문서](https://docs.basicmemory.com)
- [MCP Tools Reference](https://docs.basicmemory.com/guides/mcp-tools-reference/)
- [Knowledge Format Guide](https://docs.basicmemory.com/guides/knowledge-format/)
- [User Guide](https://docs.basicmemory.com/user-guide/)
- [GitHub: basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory)