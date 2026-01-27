---
extraction_status: pending
permalink: 03.-sources/reports/react-document-processing
---

# ReAct 패러다임 기반 문서 처리 (토큰 최적화)

## 핵심 개념

**ReAct = Reasoning + Acting**

| 단계          | 역할        | 처리 주체       |
| ----------- | --------- | ----------- |
| Thought     | 계획 수립, 분석 | Claude (직접) |
| Action      | 도구 호출     | MCP 서버 (외부) |
| Observation | 결과 수신     | MCP 서버 (외부) |

**목표**: Thought만 Claude가 직접 처리, Action+Observation은 MCP로 위임 → 토큰 90% 절감

---

## MCP 서버 구성

| 역할 | MCP 서버 | 지원 포맷 |
|------|----------|-----------|
| 읽기/변환 | `markitdown` | PDF, Word, Excel, PPT, 이미지(OCR), HTML, CSV, JSON |
| 편집/생성 | `document-edit` | Word, Excel, PDF, CSV |

---

## 워크플로우

### 1. 문서 읽기 (MarkItDown)

```
# PDF를 Markdown으로 변환
markitdown 도구로 /path/to/document.pdf 변환해줘

# Excel 데이터 추출
markitdown으로 /path/to/data.xlsx 내용 확인해줘
```

### 2. 문서 생성/편집 (Document-Edit)

```
# Word 문서 생성
document-edit으로 "회의록" 제목의 Word 파일 생성해줘

# Excel 파일 생성
document-edit으로 이 데이터를 Excel로 저장해줘

# PDF 생성
document-edit으로 Word 파일을 PDF로 변환해줘
```

### 3. 통합 워크플로우

```
1. markitdown으로 원본 PDF 읽기
2. Claude가 내용 분석/요약
3. document-edit으로 요약본 Word 생성
4. document-edit으로 PDF 변환
```

---

## 토큰 절감 효과

| 시나리오 | 기존 방식 | ReAct 방식 | 절감율 |
|----------|-----------|------------|--------|
| 100페이지 PDF 분석 | ~50,000 토큰 | ~5,000 토큰 | 90% |
| Excel 데이터 처리 | ~20,000 토큰 | ~2,000 토큰 | 90% |
| 이미지 OCR | ~10,000 토큰 | ~1,000 토큰 | 90% |

---

## 도구 레퍼런스

### MarkItDown 도구

| 도구 | 설명 |
|------|------|
| `convert_to_markdown` | 파일을 Markdown으로 변환 |

**지원 포맷**: PDF, DOCX, XLSX, PPTX, HTML, CSV, JSON, XML, ZIP, 이미지(OCR)

### Document-Edit 도구

| 카테고리 | 도구 | 설명 |
|----------|------|------|
| Word | `create_word_document` | 텍스트로 Word 생성 |
| Word | `edit_word_document` | 기존 Word 편집 |
| Excel | `create_excel_file` | JSON/CSV로 Excel 생성 |
| Excel | `edit_excel_file` | 기존 Excel 편집 |
| PDF | `create_pdf_file` | 텍스트로 PDF 생성 |
| PDF | `convert_word_to_pdf` | Word → PDF 변환 |

---

## 사용 팁

### DO

- 대용량 문서는 항상 MCP로 처리
- 필요한 섹션만 요청하여 토큰 절약
- 편집 후 원본 보존 (임시 파일 활용)

### DON'T

- 전체 문서를 채팅창에 붙여넣기 ❌
- 바이너리 파일 직접 읽기 시도 ❌
- 동일 파일에 동시 읽기/쓰기 ❌

---

## 설치 정보

**MCP 설정 파일**: `/root/projects/.mcp.json`

```json
"markitdown": {
  "type": "stdio",
  "command": "uvx",
  "args": ["markitdown-mcp"]
},
"document-edit": {
  "type": "stdio",
  "command": "/root/projects/document-edit-mcp/venv/bin/python",
  "args": ["-m", "claude_document_mcp.server"]
}
```

**의존성**:
- PDF 변환: `apt-get install libreoffice-writer`
- OCR: `apt-get install tesseract-ocr` (선택)

---

작성일: 2026-01-06