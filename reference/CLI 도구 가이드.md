---
title: CLI 도구 가이드
type: note
permalink: reference/cli-dogu-gaideu
tags:
- cli
- rust
- rsv
- xsv
- jaq
- sqlite3
- token-efficiency
- memory-efficiency
- reference
---

# CLI 도구 가이드

## 핵심 원칙

**CLI 우선, Rust CLI > Python CLI, 코드는 최후 수단**

```
1. CLI 도구 먼저 시도
2. Rust CLI 우선 (메모리 효율)
3. 없으면 Python/C CLI
4. CLI 없을 때만 코드 작성
```

### 왜 Rust CLI 우선인가?

| 항목 | Rust CLI | Python CLI |
|------|----------|------------|
| 메모리 | ~2MB | ~30MB+ (런타임 포함) |
| 실행 | 바로 실행 | 인터프리터 로드 필요 |
| 종료 후 | 즉시 해제 | GC 대기 |

**메모리 부족 환경 (Chrome, Obsidian, Warp 동시 실행)에서 중요**

## 도구 우선순위

| 작업           | 1순위 (Rust)        | 2순위 (Python/C)    |
| ------------ | ----------------- | ----------------- |
| Excel→CSV    | **rsv**           | xlsx2csv          |
| CSV 분석       | **rsv** / **xsv** | pandas 코드         |
| JSON 파싱      | **jaq**           | **jq** (C)        |
| SQLite       | -                 | **sqlite3** (C)   |
| Word→텍스트/PDF | -                 | **soffice** (C++) |
| PPT→PDF      | -                 | **soffice** (C++) |

## rsv (Rust) ⭐ 권장

Excel 변환 + CSV 분석 통합 도구

### Excel → CSV

```bash
# 기본 (첫 번째 시트, 같은 위치에 .csv 생성)
rsv excel2csv "file.xlsx"

# 특정 시트 (0부터 시작)
rsv excel2csv --sheet 1 "file.xlsx"
```

### CSV 분석

```bash
# 통계
rsv stats file.csv

# 상위 N개
rsv head -n 10 file.csv

# 특정 컬럼
rsv select "col1,col2" file.csv

# 검색
rsv search "패턴" file.csv
```

## xsv (Rust)

CSV 전용 분석 도구

```bash
# 통계
xsv stats file.csv

# 특정 컬럼
xsv select "col1,col2" file.csv

# 검색
xsv search "패턴" file.csv

# 정렬
xsv sort -s "col1" file.csv
```

## jaq (Rust) / jq (C)

JSON 파싱 (둘 다 사용법 동일)

```bash
# 전체 출력
jq "." file.json
jaq "." file.json

# 특정 키
jq ".name" file.json

# 배열 요소
jq ".[0]" file.json

# 필터링
jq '.items[] | select(.status == "active")' file.json
```

## sqlite3 (C)

### 기본 사용법

```bash
# Windows 경로는 반드시 따옴표로 감싸기
sqlite3 "C:\path\to\file.db" "SELECT * FROM table;"
```

### 주요 명령

```bash
# 테이블 목록
sqlite3 "file.db" ".tables"

# 스키마 확인
sqlite3 "file.db" ".schema table_name"

# 쿼리 실행
sqlite3 "file.db" "SELECT * FROM table LIMIT 10;"

# 헤더 + 컬럼 정렬
sqlite3 -column -header "file.db" "SELECT * FROM table;"
```

## LibreOffice CLI (C++) - Word/PPT 전용

Office 문서 변환 (Word, PPT → PDF/텍스트)

### 주의사항

- **Excel은 rsv 사용** (LibreOffice Excel 변환은 깨짐)
- PowerShell `Start-Process -Wait`로 호출해야 함 (일반 cmd는 조용히 실패)

### Word → 텍스트

```powershell
powershell.exe -Command "Start-Process -FilePath 'C:\Program Files\LibreOffice\program\soffice.exe' -ArgumentList '--headless','--convert-to','txt','--outdir','출력폴더','input.docx' -Wait -NoNewWindow"
```

### Word/PPT → PDF

```powershell
powershell.exe -Command "Start-Process -FilePath 'C:\Program Files\LibreOffice\program\soffice.exe' -ArgumentList '--headless','--convert-to','pdf','--outdir','출력폴더','input.pptx' -Wait -NoNewWindow"
```

### 변환 포맷

| 입력 | 출력 옵션 |
|------|----------|
| .docx | txt, pdf, html |
| .pptx | pdf, png |
| .xlsx | ❌ rsv 사용 권장 |

## xlsx2csv (Python) - 2순위

rsv 안 될 때 사용

```bash
# 중요: 파일로 저장 후 읽기 (Windows 인코딩 문제)
xlsx2csv -c utf-8 "input.xlsx" "/tmp/output.csv" && cat /tmp/output.csv

# 모든 시트
xlsx2csv -a -c utf-8 "file.xlsx" "/tmp/out.csv"

# 특정 시트
xlsx2csv -n "Sheet1" -c utf-8 "file.xlsx" "/tmp/out.csv"
```

## 토큰 효율 비교

| 비교 | 차이 |
|------|------|
| CLI vs CLI | 거의 없음 |
| **CLI vs 코드** | **3~5배** |

```
CLI 도구가 있으면 → 언어 상관없이 토큰 효율 좋음
CLI 도구가 없으면 → 코드 작성 필요 → 토큰 많이 씀
```

## 트러블슈팅 체크리스트

### CLI 실패 시

1. [ ] 경로에 따옴표 있는지?
2. [ ] Windows 경로면 백슬래시 문제?
3. [ ] 인코딩 옵션 (-c utf-8) 있는지?
4. [ ] 파일로 저장하고 cat으로 읽는지?

### 새 CLI 설치 전 확인

```bash
# 이미 있는지 먼저 확인!
where jq
where xsv
```

## 설치된 CLI 경로

```
C:\Users\RL\.local\bin\
├── rsv.exe      (Rust, Excel+CSV)
├── xsv.exe      (Rust, CSV)
├── jaq.exe      (Rust, JSON)

C:\ProgramData\chocolatey\bin\
├── jq.exe       (C, JSON)

C:\Program Files\LibreOffice\program\
├── soffice.exe  (C++, Word/PPT→PDF/txt)
```

## 관련 개념

- [CLI 도구] prioritizes [토큰 효율]
- [Rust CLI] prioritizes [메모리 효율]
- [rsv] replaces [xlsx2csv, xsv]
- [sqlite3] queries [SQLite DB]
- [Windows 인코딩] requires [파일 저장 후 읽기]
