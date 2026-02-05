---
title: 개발 Gotchas 요약 (핵심만)
type: workcase
tags:
- gotcha
- summary
- korean-path
- excel
- json
- javascript
permalink: sources/workcases/development-gotchas-summary
created: 2026-01-30
---

# 개발 Gotchas 요약

46개 gotcha 문서에서 **반복적으로 유용한 핵심 패턴**만 추출.

---

## 1. 한글/특수문자 경로 처리 (Shell/Python)

### 문제
```bash
# 이런 경로가 argparse에서 문제 발생
/mnt/c/유정우/전사 핵심성과지표(KPI) 목표.xlsx
```

### 해결책 (3가지)

| 방법 | 코드 | 안전도 |
|------|------|--------|
| **작은따옴표** | `'경로'` | ⭐⭐⭐ |
| **임시 복사** | `cp '원본' /tmp/input.xlsx` | ⭐⭐⭐⭐ |
| **stdin 전달** | `echo '경로' \| python script.py` | ⭐⭐⭐⭐ |

```bash
# 추천: 임시 경로로 복사 후 처리
cp '/mnt/c/유정우/파일(KPI).xlsx' /tmp/input.xlsx
python script.py --input /tmp/input.xlsx
```

---

## 2. Excel 병합 셀 → NaN 문제

### 문제
- Claude는 Excel을 **markitdown**으로 변환 후 인식
- 병합 셀 → **NaN**으로 표시 → 계층 구조 손실

### 해결책

| 형식 | Claude 인식 방식 | 병합 셀 처리 |
|------|-----------------|-------------|
| CSV/JSON | 직접 읽기 | ✅ 문제없음 |
| Excel | markitdown 변환 | ⚠️ NaN 발생 |
| 스크린샷 | vision 분석 | ✅ 시각적 확인 |

```python
# preprocess_excel.py - forward fill로 복원
import pandas as pd
df = pd.read_excel('input.xlsx')
df = df.ffill()  # NaN을 위의 값으로 채움
```

**Best Practice**: 스크린샷 + 전처리 스크립트 조합

---

## 3. JSON 파라미터 이중 직렬화 (400 에러)

### 문제
```javascript
// ❌ 잘못된 방식 - String 전달
visualization_settings: "{\"column_settings\": ...}"

// ✅ 올바른 방식 - Object 전달
visualization_settings: { "column_settings": { ... } }
```

### 진단
- `\"` 이스케이프 문자 보이면 → 이미 문자열화된 신호
- 400 Bad Request → 이중 직렬화 의심

### 해결책
1. MCP 도구 파라미터 타입 **먼저 확인**
2. `object` 타입 → JavaScript 객체 그대로 전달
3. `string` 타입 → `JSON.stringify()` 사용

**Anti-pattern**: REST API 습관(curl/fetch)을 MCP에 그대로 적용 ❌

---

## 4. JavaScript TDZ (Temporal Dead Zone)

### 문제
```javascript
console.log(myVar);  // ❌ ReferenceError!
let myVar = "hello";
```

### 원인: var vs let/const 차이

| 키워드 | 호이스팅 | 초기값 | TDZ |
|--------|----------|--------|-----|
| `var` | ✅ | `undefined` | ❌ |
| `let`/`const` | ✅ | (접근불가) | ✅ |

### 해결책
```javascript
// ✅ 선언 후 사용
let myVar = "hello";
console.log(myVar);
```

**Prevention**: ESLint `no-use-before-define` 규칙 활성화

---

## 요약 테이블

| Gotcha | 증상 | 핵심 해결책 |
|--------|------|------------|
| 한글 경로 | argparse 분리 | `/tmp` 복사 또는 작은따옴표 |
| Excel 병합셀 | NaN 표시 | `ffill()` 전처리 |
| JSON 직렬화 | 400 에러 | 타입 확인 후 Object 전달 |
| JS TDZ | ReferenceError | 선언 후 사용 |

---

## Relations

- relates_to [[01. concepts/json-serialization]] (JSON 직렬화 개념)
- relates_to [[01. concepts/javascript-hoisting]] (JS 호이스팅)

---

**정리일**: 2026-01-30
**원본**: `03. sources/gotchas/` 폴더 46개 문서에서 추출
