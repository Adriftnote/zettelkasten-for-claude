---
title: 파서 (Parser)
type: concept
tags:
  - programming-basics
  - computer-science
  - text-processing
category: 프로그래밍 기초
difficulty: 초급
date: 2026-01-28
permalink: knowledge/concepts/parser
---

# 파서 (Parser)

**텍스트를 분석해서 프로그램이 다룰 수 있는 데이터 구조로 변환하는 도구**

## 📖 핵심 개념

```
파서 = "텍스트 분석기"

텍스트 (사람이 읽는 형태)
    ↓
  [파서]
    ↓
데이터 구조 (프로그램이 다루는 형태, RAM에 저장)
```

> [!important] 핵심 포인트
> 파서는 **기계어로 변환하는 게 아니라**, 프로그램이 사용할 수 있는 **데이터 구조**로 변환합니다!

## 🆚 파서 vs 컴파일러 vs 변환기

| 도구       | 역할     | 입력 → 출력            |
| -------- | ------ | ------------------ |
| **파서**   | 텍스트 분석 | 텍스트 → 데이터 구조 (RAM) |
| **컴파일러** | 코드 번역  | 소스코드 → 기계어         |
| **변환기**  | 형식 변환  | 데이터 → 다른 형식 데이터    |

### 레벨 비교

```
레벨 1: 사람      →  텍스트          ("홍길동,30")
레벨 2: 프로그램  →  데이터 구조     {name: "홍길동", age: 30}  ← 파서!
레벨 3: CPU       →  기계어          01010101 10001000         ← 컴파일러!
```

## 📚 파서의 종류

### 1. CLI 파서 (Command Line Interface)

터미널 명령어를 분석:

```bash
# 입력 (텍스트)
cargo build --release --verbose
```

```rust
// 파서가 만든 데이터 구조 (메모리)
Args {
    command: "build",
    release: true,
    verbose: true
}
```

**Rust에서**: `clap` 라이브러리

### 2. CSV 파서

CSV 텍스트를 분석:

```
입력 (텍스트):
"이름,나이,직업
홍길동,30,개발자
김철수,25,디자이너"

    ↓ [CSV 파서]

출력 (메모리 상의 데이터):
[
  Row { name: "홍길동", age: 30, job: "개발자" },
  Row { name: "김철수", age: 25, job: "디자이너" }
]
```

### 3. JSON 파서

JSON 텍스트를 분석:

```
입력:
{"name": "John", "age": 30}

    ↓ [JSON 파서]

출력:
User {
    name: "John",
    age: 30
}
```

### 4. HTML 파서

HTML 텍스트를 DOM 트리로:

```
입력:
<div><p>Hello</p></div>

    ↓ [HTML 파서]

출력:
DOM Tree
├── div
│   └── p
│       └── "Hello"
```

## 🔍 자주 헷갈리는 개념

### 엑셀 → CSV는 파서가 아님!

```
❌ 파서가 아님:
엑셀 파일 (.xlsx) → [변환기] → CSV 파일 (.csv)
(형식만 바꿈, 분석 아님)

✅ 이게 파서:
CSV 파일 → [CSV 파서] → 프로그램 데이터 구조
(텍스트를 분석해서 데이터로)
```

### 엑셀 파서는 있음!

```rust
// 엑셀 파일을 읽어서 데이터 구조로 만드는 것 = 파서
use calamine::{Reader, open_workbook, Xlsx};

let mut workbook: Xlsx<_> = open_workbook("data.xlsx")?;
// 엑셀 파일을 파싱해서 데이터로!
```

## 🎨 비유

```
파서 = 번역가 📖
- 영어 문장 → [번역가] → 한국어로 이해
- CSV 텍스트 → [파서] → 프로그램이 이해하는 데이터

변환기 = 포맷 변경 📝
- 워드 문서 → [변환기] → PDF 문서
- 엑셀 파일 → [변환기] → CSV 파일
```

## 📊 파서 종류 정리

| 파서 종류 | 읽는 것 | 만드는 것 |
|----------|--------|----------|
| JSON 파서 | JSON 텍스트 | 객체/구조체 |
| XML 파서 | XML 텍스트 | 트리 구조 |
| CSV 파서 | CSV 텍스트 | 테이블/배열 |
| CLI 파서 | 명령어 텍스트 | 옵션/인자 구조체 |
| HTML 파서 | HTML 텍스트 | DOM 트리 |
| Markdown 파서 | MD 텍스트 | AST (추상 구문 트리) |

## 🦀 Rust 파서 라이브러리

| 용도 | 라이브러리 | 설명 |
|------|-----------|------|
| CLI | `clap` | 명령어 파싱 |
| JSON | `serde_json` | JSON 파싱 |
| CSV | `csv` | CSV 파싱 |
| TOML | `toml` | 설정 파일 파싱 |
| HTML | `scraper` | HTML 파싱 |
| 범용 | `nom`, `pest` | 커스텀 파서 작성 |

## 💡 왜 파서가 필요한가?

```rust
// 파서 없이 직접 처리하면 😰
let args: Vec<String> = std::env::args().collect();
if args[1] == "--release" {
    // ...복잡한 처리
}

// 파서 사용하면 😊
#[derive(Parser)]
struct Cli {
    #[arg(long)]
    release: bool,
}
let cli = Cli::parse();  // 끝!
```

## 🔗 관련 개념

### 상위 개념
- [[compiler]] - 소스코드를 기계어로 변환
- [[interpreter]] - 코드를 한 줄씩 실행

### 관련 개념
- [[source-code]] - 사람이 작성한 코드
- [[machine-language]] - CPU가 이해하는 언어
- [[데이터 구조 (Data Structure)]] - 파싱 결과로 만들어지는 구조

## Relations

- related_to [[compiler]]
- related_to [[interpreter]]
- produces [[데이터 구조 (Data Structure)]]
- input_is [[source-code]]

---

**난이도**: 초급
**카테고리**: 프로그래밍 기초
**최종 업데이트**: 2026-01-28

**핵심 요약**: 파서는 텍스트를 **분석**해서 프로그램이 사용할 수 있는 **데이터 구조**로 변환합니다. 기계어 변환은 컴파일러의 역할!
