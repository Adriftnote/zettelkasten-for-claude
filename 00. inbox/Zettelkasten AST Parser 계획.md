---
title: Zettelkasten AST Parser 계획
type: note
tags:
- project-plan
- rust
- ast
- zettelkasten
- tool-building
permalink: inbox/zettelkasten-ast-parser-plan
---

# Zettelkasten AST Parser 계획

Markdown 노트를 구조화된 형태로 파싱하여 AI에게 효율적으로 전달하기 위한 도구 개발 계획.

## 목표

1. **토큰 절약**: 전체 노트 대신 구조화된 정보만 전달
2. **Rust 학습**: 파싱을 통한 Rust 실습
3. **그래프 구조**: 노트 간 링크 관계 추출

---

## 핵심 개념 정리

### "AST 파싱"의 실제 의미

이 프로젝트에서 하는 일은 순수한 AST(깊은 트리)가 아니라 **구조화된 추출 + 매핑**:

| 구분 | 구조 깊이 | 예시 |
|------|----------|------|
| 코드 AST | 5~10단계 | 함수 → 본문 → 조건문 → 표현식 → ... |
| concept/note 파싱 | 1~2단계 | 필드 → 값 (얕은 매핑) |
| hub Relations | 3~4단계 | 계층적 링크 트리 |
| 볼트 전체 | N단계 | 노트 간 그래프 |

**노트 타입에 따라 다름:**
- concept, note → **필드 매핑** (얕음)
- hub Relations → **트리 구조** (깊음)
- 볼트 전체 → **그래프 구조**

### AI에게 주는 이점

AI가 트리를 "특별히" 이해하는 게 아님. 이점은:

1. **노이즈 제거**: 이모지, 비유 섹션, 마크다운 문법 제거
2. **명시적 필드명**: `"features"`, `"links"` 등 의미가 명확
3. **일관된 형식**: 모든 노트가 같은 패턴
4. **토큰 절약**: 불필요한 부분 제거

---

## 두 레벨 구조

### 레벨 1: 노트 내부 (파싱 + 매핑)

```
Markdown 원본
     ↓
1. 파싱: 섹션별 분리
2. 매핑: "이 섹션은 features야"라고 라벨링
3. 필터링: 비유 섹션은 버림
4. 정규화: 모든 노트가 같은 형태
     ↓
구조화된 JSON
```

### 레벨 2: 노트 간 (그래프)

```
assembler
├── produces → machine-language
├── similar_to → compiler
│   └── outputs → bytecode
└── precedes → linker
    └── produces → executable
```

노트 → 노트 → 노트로 연결되는 **그래프 구조**

---

## 지원 노트 타입

### 1. concept (100개)

**용도**: 개념 정의
**구조 깊이**: 얕음 (필드 매핑)

**추출 대상**:

| 필드 | 설명 | 필수 |
|------|------|------|
| frontmatter | title, tags, category, difficulty | O |
| summary | 첫 문단 (정의) | O |
| features | 특징 리스트 | O |
| examples | 코드 블록 | O |
| links | Relations 섹션의 [[링크]] | O |

**제외**: 비유 섹션

**출력 예시**:
```json
{
  "type": "concept",
  "path": "01. concepts/assembler.md",
  "frontmatter": {
    "title": "어셈블러 (Assembler)",
    "tags": ["programming-basics", "execution-tools"],
    "category": "실행 도구",
    "difficulty": "고급"
  },
  "summary": "어셈블리어를 기계어로 번역하는 프로그램",
  "features": [
    "저수준 번역: CPU 아키텍처에 직접 대응",
    "1:1 대응: 어셈블리 명령어가 기계어로 직접 변환"
  ],
  "examples": [
    { "lang": "assembly", "code": "MOV AX, 5\nADD AX, 3" }
  ],
  "links": {
    "produces": ["machine-language"],
    "similar_to": ["compiler"],
    "precedes": ["linker"]
  }
}
```

---

### 2. hub (18개)

**용도**: 노트 조직화 (MOC)
**구조 깊이**: 깊음 (Relations가 트리)

**추출 대상**:

| 필드 | 설명 | 필수 |
|------|------|------|
| frontmatter | title, tags | O |
| summary | 첫 문단 | O |
| observations | [fact], [method] 등 | O |
| relations | 계층적 링크 구조 (트리) | O |
| tables | 비교표 | △ |

**Relations 트리 예시**:
```
encoding-systems (hub)
├── organizes: Character Encoding
│   ├── part_of: Bit
│   └── part_of: Byte
└── organizes: Unicode
    ├── extends: UTF-8
    │   └── part_of: BOM
    ├── extends: UTF-16
    └── extends: UTF-32
```

**출력 예시**:
```json
{
  "type": "hub",
  "path": "02. hubs/encoding-systems.md",
  "frontmatter": {
    "title": "문자 인코딩 시스템",
    "tags": ["hub", "encoding", "unicode"]
  },
  "summary": "컴퓨터는 숫자만 안다. 문자를 저장하려면 매핑 규칙이 필요하다.",
  "observations": [
    { "type": "fact", "text": "UTF-8이 웹 표준인 이유: 영어는 1바이트", "tags": ["utf8"] }
  ],
  "relations": {
    "organizes": [
      { "target": "Character Encoding", "children": ["Bit", "Byte"] },
      { "target": "ASCII", "children": ["CP949"] },
      { "target": "Unicode", "children": ["UTF-8", "UTF-16", "UTF-32"] }
    ],
    "connects_to": ["web-fundamentals", "programming-basics"]
  },
  "tables": [
    {
      "title": "핵심 비교표",
      "headers": ["인코딩", "크기", "장점", "단점", "사용처"],
      "rows": [...]
    }
  ]
}
```

---

### 3. note (42개)

**용도**: 통찰 도출 (여러 fact 조합)
**구조 깊이**: 얕음 (필드 매핑)

**추출 대상**:

| 필드 | 설명 | 필수 |
|------|------|------|
| frontmatter | title, tags, source_facts | O |
| summary | 첫 문단 (핵심 통찰) | O |
| derivation | 도출 근거 섹션 | O |
| observations | [fact], [method], [example] | O |
| links | derived_from, applies_to 등 | O |

**출력 예시**:
```json
{
  "type": "note",
  "path": "04. notes/지식 저장의 원리.md",
  "frontmatter": {
    "title": "지식 저장의 원리",
    "tags": ["knowledge-management", "methodology"],
    "source_facts": ["시스템1-2와 기억 재구성", "KGGen 지식 처리 방식"]
  },
  "summary": "인간 기억의 한계를 극복하는 지식 저장 4원칙",
  "derivation": {
    "sources": [
      "시스템1은 감정과 사실을 섞는다",
      "기억은 6개월 후 가짜 기억으로 대체"
    ],
    "conclusion": "지식 저장 4원칙: 맥락, 출처, 관계, 해석 분리"
  },
  "observations": [
    { "type": "fact", "text": "감정과 사실이 섞이면 출처가 사라진다", "tags": ["memory"] },
    { "type": "method", "text": "맥락 기록 → 출처 명시 → 관계 연결", "tags": ["workflow"] }
  ],
  "links": {
    "derived_from": ["시스템1-2와 기억 재구성", "KGGen 이해"],
    "applies_to": ["research-note-template"],
    "mitigates": ["기억 재구성"]
  }
}
```

---

## 저장 방식

### 옵션 비교

| 방식 | 장점 | 단점 | 추천 상황 |
|------|------|------|----------|
| 단일 JSON | 간단, 디버깅 쉬움 | 검색 느림 | 노트 200개 이하 |
| SQLite | 빠른 검색, 쿼리 가능 | 복잡도 증가 | 노트 1000개 이상 |

### 추천: 단일 JSON으로 시작

```json
// vault.json
{
  "version": "1.0",
  "generated_at": "2026-02-01T10:00:00Z",
  "notes": {
    "assembler": { ... },
    "compiler": { ... }
  },
  "graph": {
    "edges": [
      { "from": "assembler", "to": "machine-language", "type": "produces" }
    ]
  }
}
```

### 나중에 필요하면: SQLite

```sql
-- 핵심 필드는 컬럼으로 (검색용)
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  type TEXT,
  title TEXT,
  summary TEXT,
  ast_json TEXT  -- 나머지는 JSON blob
);

-- 링크는 별도 테이블 (그래프 탐색용)
CREATE TABLE links (
  from_note TEXT,
  to_note TEXT,
  relation_type TEXT
);
```

**저장은 효율적으로, AI 전달은 항상 JSON으로**

---

## 기술 스택

| 구성요소 | 도구 | 이유 |
|----------|------|------|
| 언어 | Rust | 학습 목적 + 성능 |
| Markdown 파싱 | `pulldown-cmark` | Rust 표준, 빠름 |
| YAML 파싱 | `serde_yaml` | frontmatter 처리 |
| 그래프 | `petgraph` | 노트 간 관계 |
| CLI | `clap` | 명령줄 인터페이스 |
| JSON 출력 | `serde_json` | 구조화된 출력 |

---

## 데이터 구조 (Rust)

```rust
// 노트 내부: 타입별 구조
enum NoteContent {
    Concept {
        summary: String,
        features: Vec<String>,
        examples: Vec<CodeBlock>,
    },
    Hub {
        summary: String,
        observations: Vec<Observation>,
        relations: RelationTree,  // 트리 구조
        tables: Vec<Table>,
    },
    Note {
        summary: String,
        derivation: Derivation,
        observations: Vec<Observation>,
    },
}

// 볼트 전체: 그래프
struct Vault {
    notes: HashMap<String, ParsedNote>,
    graph: Graph<NoteId, LinkType>,  // 노트 간 연결
}
```

---

## 구현 단계

### Phase 1: 기본 파싱 (MVP)

- [ ] Rust 프로젝트 셋업
- [ ] Markdown 파일 읽기
- [ ] frontmatter 파싱 (YAML)
- [ ] 섹션별 분리 (Heading 기준)
- [ ] [[wikilink]] 추출
- [ ] JSON 출력

**목표**: 단일 노트 → JSON 변환

### Phase 2: 타입별 스키마

- [ ] concept 타입 파서 (필드 매핑)
- [ ] hub 타입 파서 (Relations 트리)
- [ ] note 타입 파서 (필드 매핑)
- [ ] 타입 자동 감지 (frontmatter type 필드)

**목표**: 타입별로 다른 필드 추출

### Phase 3: 볼트 전체 처리

- [ ] 디렉토리 순회
- [ ] 전체 노트 인덱스 생성 (vault.json)
- [ ] 노트 간 그래프 구축
- [ ] 역방향 링크 계산

**목표**: 전체 볼트 → 단일 JSON + 그래프

### Phase 4: AI 통합

- [ ] CLI로 특정 노트 조회
- [ ] 관련 노트 자동 포함 (그래프 탐색)
- [ ] 깊이 제한 옵션
- [ ] Claude Code 연동 테스트

**목표**: AI가 효율적으로 사용

---

## CLI 사용 예시 (목표)

```bash
# 단일 노트 파싱
zk-parse note "01. concepts/assembler.md"

# 전체 볼트 인덱스 생성
zk-parse index ./zettelkasten-for-claude -o vault.json

# 특정 노트 + 관련 노트 (depth 1)
zk-parse context "assembler" --depth 1

# 그래프 출력
zk-parse graph --format dot > vault.dot
```

---

## 예상 토큰 절약

| 상황 | 원본 | 파싱 후 | 절약 |
|------|------|---------|------|
| concept 노트 | ~500 토큰 | ~150 토큰 | 70% |
| hub 노트 | ~800 토큰 | ~300 토큰 | 62% |
| note 노트 | ~600 토큰 | ~200 토큰 | 67% |

**핵심**: 비유, 반복 설명, 마크다운 문법, 이모지 제거

---

## 다음 단계

1. Rust 프로젝트 생성
2. `pulldown-cmark`로 Markdown 파싱 테스트
3. concept 타입 먼저 구현 (가장 단순)
4. 점진적으로 hub → note 확장

---

**작성일**: 2026-02-01
**수정일**: 2026-02-01
**상태**: 계획 단계
