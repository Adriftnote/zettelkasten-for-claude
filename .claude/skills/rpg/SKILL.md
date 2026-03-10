---
name: rpg
description: Use when analyzing source code to generate RPG (Repository Planning Graph) documentation. Triggers on code documentation, module analysis, codebase structure mapping, function/class cataloging.
allowed-tools: Bash(rpg-extract *), Bash(python *vecsearch*), mcp__basic-memory__write_note, mcp__basic-memory__read_note, mcp__basic-memory__edit_note, mcp__basic-memory__search_notes, mcp__basic-memory__build_context, mcp__basic-memory__list_directory, Glob, Grep, Read
argument-hint: "extract <path> | update <module> | doc"
---

# RPG (Repository Planning Graph)

소스 코드를 분석하여 zettelkasten(basic-memory)에 코드 문서를 생성합니다.
그래프 구조: project → module → function/class

## 모드

### /rpg extract <file|folder>

소스 코드에서 RPG 노트를 새로 생성.

1. `rpg-extract <path> --module-name <name>` 실행 → 구조 데이터 확보
   - 함수/클래스 목록, 내부 호출 관계, import, RPG Relations 섹션 자동 생성
2. 소스 코드 Read → 자동 추출이 못 잡는 부분만 파악 (목적, 설계 의도, 외부 의존)
3. vecsearch로 중복 확인 (→ 공통 절차 참조)
4. 소속 프로젝트 확인 (`list_directory dir_name=/05. code/projects`)
5. 노드 타입별 템플릿 참조하여 작성:
   - project → `Read references/project-template.md`
   - module → `Read references/module-template.md`
   - function/class → `Read references/function-template.md`
6. **모든 계층 생성 필수** — project/module만 만들고 끝내지 말 것. function/class까지 생성
7. write_note로 저장 → build_context depth 2로 트리 검증

### /rpg update <module-name>

기존 RPG 노트를 코드 변경사항에 맞게 업데이트.

1. `read_note identifier=modules/<module-name>` → 기존 노트 로딩
2. 노트의 `path`에서 소스 파일 경로 확인
3. `rpg-extract <소스파일>` → 현재 코드 상태 추출
4. 기존 노트와 비교:
   - 추가된 함수 → 새 function 노드 생성
   - 삭제된 함수 → 기존 function 노드에 [deprecated] 표기
   - 변경된 호출 관계 → Relations 업데이트
5. `edit_note`로 업데이트 → build_context로 검증

### /rpg doc

대화 컨텍스트에서 RPG 노드를 작성. (인자 없이 `/rpg` 호출 시에도 이 모드)

1. 대화에서 논의된 코드 구조 파악
2. vecsearch로 중복 확인
3. 노드 타입 판단 → 해당 템플릿 참조 (Read references/...)
4. write_note로 저장

## 공통 절차

### vecsearch 중복 확인

```bash
vecsearch search "[모듈/함수 키워드]" --top 5 --unique --type module
vecsearch search "[모듈/함수 키워드]" --top 5 --unique --type function
```

| 유사도 | 조치 |
|--------|------|
| distance < 14 | 기존 노트 업데이트 (edit_note) — 새로 만들지 않음 |
| 14~17 | 새 노트 생성 + Relations에 연결 추가 |
| > 17 | 그대로 새 노트 생성 |

### 저장

```
write_note: folder=05. code/projects | modules | functions | classes, project=zettelkasten
edit_note: identifier=[permalink], operation=replace_section, section=[섹션명]
```

### 트리 검증

생성 후 `build_context url=[permalink] project=zettelkasten depth=2` — project에서 module→function까지 보여야 정상.

## 핵심 규칙

1. **양방향 Relations 필수** — contains↔part_of 반드시 쌍으로
2. **모든 함수/클래스 문서화 필수** — 유틸리티 함수도 포함 (인라인 코드만 제외)
3. **rpg-extract의 "RPG Relations" 섹션 그대로 사용** — contains/calls 수동 나열 금지
4. **수동 분석은 외부 관계만** — depends_on, data_flows_to, extends
5. **semantic은 verb-object** — "load csv", "validate user"
6. **category는 area/cat/sub** — 의미 계층 분류
7. **wikilink는 Relations에서만** — 테이블, blockquote에 wikilink 금지
8. **기존 프로젝트 업데이트 시** — 프로젝트의 코드 구성 + Relations도 함께 업데이트

## 네이밍 규칙

| 항목 | 변환 | 예시 |
|------|------|------|
| 함수명 | snake_case → kebab-case | `check_duplicates` → `check-duplicates` |
| 클래스명 | PascalCase → kebab-case | `UserValidator` → `user-validator` |
| 모듈명 | 파일명 그대로 (확장자 제거) | `vecsearch.py` → `vecsearch` |
| main 함수 | `main-[모듈명]` | main() in vecsearch.py → `main-vecsearch` |
| JS 메서드 | camelCase → kebab-case | `handleClick` → `handle-click` |

## Observation 카테고리

| 카테고리 | 용도 | 태그 예시 |
|---------|------|----------|
| `[impl]` | 구현 방식, 알고리즘 | `#algo`, `#pattern` |
| `[return]` | 반환값 설명 | `#type` |
| `[usage]` | 사용법 | `#cli` |
| `[deps]` | 의존성 | `#import` |
| `[note]` | 참고사항 | `#context`, `#caveat` |

## Relations 패턴

| relation | 용도 | 예시 |
|----------|------|------|
| `contains` | 부모→자식 | project→module, module→function |
| `part_of` | 자식→부모 | function→module |
| `calls` | 함수 호출 | func-a calls func-b |
| `data_flows_to` | 데이터 흐름 | parser → validator |
| `depends_on` | 외부 의존성 | module depends_on library |
| `extends` | 기능 확장 | vecsearch extends basic-memory |
| `uses` | 라이브러리 사용 | module uses sqlite-vec |
