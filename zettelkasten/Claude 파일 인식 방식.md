---
title: Claude 파일 인식 방식
type: note
permalink: zettelkasten/claude-pail-insig-bangsig
tags:
- claude
- multimodal
- file-processing
- ai-architecture
---

# Claude 파일 인식 방식

## 핵심 개념

Claude는 **텍스트 기반 언어 모델**이다. 바이너리 바이트를 직접 처리하는 게 아니라 텍스트(문자열)를 이해하고 생성한다.

## 파일 유형별 처리 방식

### 직접 읽을 수 있는 파일 (텍스트 기반)

- [텍스트 파일] .txt, .md, .json, .yaml, .xml, .csv
- [코드 파일] .py, .js, .ts, .java, .c, .cpp, .go, .rs, .html, .css
- [설정 파일] .log, .ini, .conf, .env, .sh, .ps1

**기준**: 메모장으로 열었을 때 글자가 보이면 읽을 수 있음

### 멀티모달로 "보는" 파일

- [이미지] .png, .jpg - 픽셀 데이터를 학습된 방식으로 이해
- [PDF] 텍스트 추출 + 시각 인식 하이브리드

### 외부 도구가 필요한 파일

- [Excel] .xlsx, .xls → openpyxl, pandas 필요
- [Word] .docx → python-docx 필요
- [압축] .zip, .tar.gz → zipfile 필요
- [DB] .sqlite → sqlite3 필요

## 멀티모달(Multimodal)이란?

**Modal = 입력 방식**

- Single Modal: 텍스트만 입력/출력
- Multi Modal: 텍스트 + 이미지 입력 → 텍스트 출력

## 인간 시각과의 비유 (정우 인사이트)

```
[인간]
빛 → 망막(픽셀처럼 수용) → 시신경 → 시각피질 → "고양이다!"

[Claude]  
픽셀 → Vision Encoder → 신경망 → "고양이다!"
```

둘 다 **raw 데이터 → 패턴 인식 → 의미 추출** 구조

시신경이 빛을 받아서 뇌에서 눈을 통해 "본다"는 느낌과 비슷하게, Claude도 픽셀 데이터를 학습된 패턴으로 "이해"한다.

## PDF vs xlsx 차이

| 파일 | 설계 목적 | Claude 처리 |
|------|----------|------------|
| PDF | "사람이 보는 문서" | ✅ 페이지 렌더링 + 텍스트 추출 |
| xlsx | "프로그램이 처리하는 데이터" | ❌ 전용 파서 필요 |

PDF는 시각적으로 보면서 텍스트도 추출 가능하지만, xlsx는 셀/수식/시트 구조가 복잡해서 전용 파서(openpyxl)가 필요하다.

## 관련 개념

- [멀티모달] relates_to [Vision Encoder]
- [Claude 파일 처리] requires [Read 도구]
- [바이너리 파일] requires [외부 파서]
- [PDF 처리] combines [텍스트 추출, 시각 인식]
