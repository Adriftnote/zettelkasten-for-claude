---
title: FastMCP Constructor API Breaking Change
type: note
permalink: gotchas/fastmcp-constructor-api-breaking-change
tags:
- fastmcp
- gotcha
- api-change
- mcp
- python
- breaking-change
extraction_status: pending
---

# FastMCP Constructor API Breaking Change

## Problem

FastMCP library constructor API changed, breaking existing code.

- FastMCP constructor removed description parameter
- FastMCP constructor removed dependencies parameter

## Error Message

```
TypeError: FastMCP.__init__() got an unexpected keyword argument 'description'
```

## Solution

### ❌ Old Version (Error Occurs)

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    "Document Operations",
    description="MCP server for document operations (Word, Excel, PDF)",
    dependencies=[
        "python-docx",
        "pandas", 
        "openpyxl",
        "reportlab",
        "docx2pdf"
    ]
)
```

### ✅ Current Version

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Document Operations")
```

## Impact

- MCP server initialization fails → all tools unusable
- Server won't start and terminates immediately

## Recommendations

1. FastMCP constructor passes **server name only**
2. Metadata (description, dependencies) documented separately
3. New MCP server development starts with minimal constructor

- Minimal constructor ensures library compatibility
- Metadata documentation in README or docstrings

---

*Promoted from claude-mem: #1208, #1210 (2026-01-06)*
*Affected file: document-edit-mcp/claude_document_mcp/server.py*

## Observations

- [breaking-change] FastMCP constructor removed `description` and `dependencies` parameters, now accepts only server name #api-change #fastmcp
- [bug] Using old constructor with description/dependencies causes `TypeError: __init__() got an unexpected keyword argument` #initialization-error
- [solution] Use minimal constructor: `FastMCP("Server Name")`, document metadata separately in README/docstrings #migration #best-practice
- [pattern] Minimal constructor ensures library compatibility across versions, preventing breaking changes on updates #future-proofing