---
title: Shell Korean and Special Character Path Handling
type: note
permalink: knowledge/shell-korean-and-special-character-path-handling
tags:
- shell
- korean
- path
- argparse
- wsl
- special-characters
- gotcha
extraction_status: pending
---

# Shell Korean and Special Character Path Handling

한글, 공백, 괄호 등 특수문자가 포함된 파일 경로를 Shell/Python에서 처리하는 패턴.

## 문제 상황

```bash
# 이런 경로가 문제를 일으킴
/mnt/c/유정우/Projects/브랜드전략기획팀/전사 핵심성과지표(KPI) 목표.xlsx
```

문제 요소:
- 한글: `유정우`, `브랜드전략기획팀`
- 공백: `전사 핵심성과지표`
- 괄호: `(KPI)`

- [gotcha] Korean characters, spaces, and parentheses in paths cause argument parsing issues

## Shell에서의 처리

### 방법 1: 작은따옴표 (추천)

```bash
# 작은따옴표는 모든 특수문자를 리터럴로 처리
python script.py --input '/mnt/c/유정우/Projects/파일(KPI).xlsx'
```

- [pattern] Single quotes treat everything literally, safest for Korean paths

### 방법 2: 큰따옴표 + 이스케이프

```bash
# 큰따옴표 안에서 특수문자 이스케이프
python script.py --input "/mnt/c/유정우/Projects/파일\(KPI\).xlsx"
```

- [gotcha] Double quotes still interpret some special chars, need escaping

### 방법 3: 변수 사용

```bash
# 변수에 담아서 전달
INPUT_FILE='/mnt/c/유정우/Projects/파일.xlsx'
python script.py --input "$INPUT_FILE"
```

## Python argparse에서의 처리

### 문제: argparse 파싱 실패

```python
# 이렇게 하면 공백에서 인자가 분리됨
parser.add_argument('--input', type=str)

# 에러: unrecognized arguments: 핵심성과지표(KPI) 목표.xlsx
```

- [error] argparse splits arguments at spaces even with shell quoting

### 해결: nargs 또는 Path 처리

```python
# 방법 1: 나머지 인자를 모두 받기
parser.add_argument('input', nargs='*')
input_path = ' '.join(args.input)

# 방법 2: pathlib 사용
from pathlib import Path
input_path = Path(args.input).resolve()
```

- [solution] Use nargs='*' and join, or handle path separately

## 추천 패턴

### 1. 파일 복사 후 처리 (가장 안전)

```bash
# 복잡한 경로의 파일을 단순한 경로로 복사
cp '/mnt/c/유정우/전사(KPI).xlsx' /tmp/input.xlsx
python script.py --input /tmp/input.xlsx
```

- [best_practice] Copy file to simple path like /tmp before processing

### 2. stdin으로 경로 전달

```python
# script.py
import sys
input_path = sys.stdin.readline().strip()
```

```bash
echo '/mnt/c/유정우/파일.xlsx' | python script.py
```

- [pattern] Use stdin to avoid shell argument parsing entirely

### 3. 환경변수 사용

```bash
export INPUT_FILE='/mnt/c/유정우/파일.xlsx'
python script.py  # 스크립트 내에서 os.environ['INPUT_FILE'] 사용
```

## 관련 에러 히스토리

| 날짜 | 상황 | 해결 |
|------|------|------|
| 2026-01-08 | KPI Excel 파일 처리 | /tmp로 복사 후 처리 |

- [learned_from] Excel KPI 파일 전처리 작업 중 발생
- [applies_to] WSL 환경에서 Windows 경로 접근, 한국어 파일명 처리
