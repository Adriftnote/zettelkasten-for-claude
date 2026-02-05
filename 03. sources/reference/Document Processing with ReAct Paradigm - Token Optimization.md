---
title: Document Processing with ReAct Paradigm - Token Optimization
type: guide
permalink: sources/reference/react-document-processing-token-optimization
extraction_status: pending
---

# Document Processing with ReAct Paradigm - Token Optimization

## Core Concepts

**ReAct = Reasoning + Acting**

| Phase | Role | Executor |
|-------|------|----------|
| Thought | Planning, analysis | Claude (directly) |
| Action | Tool invocation | MCP server (external) |
| Observation | Result reception | MCP server (external) |

**Goal**: Claude handles Thought directly, delegates Action+Observation to MCP → 90% token savings

---

## MCP Server Configuration

| Role         | MCP Server      | Supported Formats                                   |
| ------------ | --------------- | --------------------------------------------------- |
| Read/Convert | `markitdown`    | PDF, Word, Excel, PPT, Images(OCR), HTML, CSV, JSON |
| Edit/Create  | `document-edit` | Word, Excel, PDF, CSV                               |

---

## Workflow

### 1. Document Reading (MarkItDown)

```
# Convert PDF to Markdown
markitdown tool - convert /path/to/document.pdf

# Extract Excel data
markitdown to check /path/to/data.xlsx contents
```

### 2. Document Generation/Editing (Document-Edit)

```
# Create Word document
document-edit to create Word file with title "Meeting Notes"

# Create Excel file
document-edit to save this data as Excel

# Create PDF
document-edit to convert Word file to PDF
```

### 3. Integrated Workflow

```
1. Read original PDF with markitdown
2. Claude analyzes/summarizes content
3. Create summary Word document with document-edit
4. Convert to PDF with document-edit
```

---

## Token Savings Effect

| Scenario | Traditional Method | ReAct Method | Savings |
|----------|-------------------|--------------|---------|
| Analyze 100-page PDF | ~50,000 tokens | ~5,000 tokens | 90% |
| Excel data processing | ~20,000 tokens | ~2,000 tokens | 90% |
| Image OCR | ~10,000 tokens | ~1,000 tokens | 90% |

---

## Tool Reference

### MarkItDown Tool

| Tool | Description |
|------|-------------|
| `convert_to_markdown` | Convert file to Markdown |

**Supported Formats**: PDF, DOCX, XLSX, PPTX, HTML, CSV, JSON, XML, ZIP, Images(OCR)

### Document-Edit Tool

| Category | Tool | Description |
|----------|------|-------------|
| Word | `create_word_document` | Create Word from text |
| Word | `edit_word_document` | Edit existing Word |
| Excel | `create_excel_file` | Create Excel from JSON/CSV |
| Excel | `edit_excel_file` | Edit existing Excel |
| PDF | `create_pdf_file` | Create PDF from text |
| PDF | `convert_word_to_pdf` | Convert Word → PDF |

---

## Usage Tips

### DO

- Always process large documents via MCP
- Request only necessary sections to save tokens
- Preserve original after editing (use temporary files)

### DON'T

- Paste entire documents into chat ❌
- Attempt to read binary files directly ❌
- Simultaneous read/write on same file ❌

---

## Installation Information

**MCP Configuration File**: `/root/projects/.mcp.json`

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

**Dependencies**:
- PDF conversion: `apt-get install libreoffice-writer`
- OCR: `apt-get install tesseract-ocr` (optional)

---

Written: 2026-01-06