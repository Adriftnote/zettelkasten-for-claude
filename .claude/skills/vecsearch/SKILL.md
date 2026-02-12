---
name: vecsearch
description: basic-memory 지식베이스에서 벡터 시맨틱 검색을 실행합니다. 유사 노트 찾기, 중복 확인, 관련 지식 탐색.
---

# vecsearch - 벡터 시맨틱 검색

basic-memory 지식베이스에서 벡터 유사도 기반 시맨틱 검색을 실행합니다.

## 사용법

```
/vecsearch [검색어]
/vecsearch [검색어] --top 10
/vecsearch [검색어] --type workcase
/vecsearch stats
```

## 실행 절차

### Step 1: 인자 파싱

사용자 입력(`$ARGUMENTS`)을 파싱:

- **검색어만**: `vecsearch search "[검색어]" --top 5 --unique`
- **옵션 포함**: `vecsearch search "[검색어]" [옵션들]`
- **stats**: `vecsearch stats`
- **sync**: `vecsearch sync`
- **인자 없음**: `vecsearch stats` 실행 후 사용법 안내

### Step 2: 명령 실행

```bash
vecsearch [파싱된 명령어]
```

### Step 3: 결과 정리 (search인 경우)

검색 결과를 테이블로 정리:

| # | Distance | Type | 제목 | Project |
|---|----------|------|------|---------|
| 1 | 12.67 | workcase | 제목... | zettelkasten |

Distance 해석도 함께 표시:

| Distance | 의미 |
|----------|------|
| < 14 | 매우 유사 — 같은 주제 |
| 14 ~ 17 | 관련 있음 — 참고할 만함 |
| > 17 | 관련 약함 |

## 옵션 참고

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--top N` | 결과 수 | 5 |
| `--type TYPE` | 엔티티 타입 필터 (workcase, module, reference 등) | 전체 |
| `--project NAME` | 프로젝트 필터 | 전체 |
| `--unique` | 엔티티당 1결과 (청크 중복 제거) | 기본 적용 |
