---
title: Gemini File Search API 공식 문서
type: doc-summary
permalink: sources/reference/gemini-file-search-api
tags:
- gemini
- file-search
- rag
- google-api
- vector-search
date: 2026-02-13
---

# Gemini File Search API 공식 문서

Gemini API의 RAG 도구. 파일을 업로드하면 자동 청킹/임베딩/인덱싱 후 시맨틱 검색 제공.

## 📖 핵심 아이디어

File Search는 문서를 FileSearchStore에 업로드하면 자동으로 임베딩하여 저장하고, generateContent 호출 시 관련 문서를 검색하여 모델 응답의 컨텍스트로 제공하는 RAG 도구다. 저장과 쿼리 시 임베딩은 무료이고, 인덱싱 시 임베딩 비용만 발생한다.

## 🛠️ 구성 요소 / 주요 내용

### 지원 모델 (중요!)

| 모델 | 지원 |
|------|------|
| gemini-3-pro-preview | O |
| gemini-3-flash-preview | O |
| gemini-2.5-pro | O |
| gemini-2.5-flash-lite | O |
| **gemini-2.0-flash** | **X (미지원!)** |
| **gemini-2.5-flash** | **X (미지원!)** |

### 가격

| 항목 | 비용 |
|------|------|
| 인덱싱 시 임베딩 | $0.15 / 1M tokens |
| 저장 | 무료 |
| 쿼리 시 임베딩 | 무료 |
| Retrieved 문서 토큰 | 모델 input 토큰 요금 |

### Rate Limits (Store 크기)

| Tier | 최대 크기 |
|------|----------|
| Free | 1 GB |
| Tier 1 | 10 GB |
| Tier 2 | 100 GB |
| Tier 3 | 1 TB |

파일 1개 최대 100MB. Store 크기는 입력 데이터의 약 3배 (임베딩 포함).

### 제한사항

- Live API 미지원
- Google Search, URL Context 등 다른 도구와 동시 사용 불가

## 🔧 작동 방식 / 적용 방법

### 워크플로우

```
1. FileSearchStore 생성
2. 파일 업로드 (upload) 또는 기존 File 임포트 (import)
   → 자동 청킹 → 임베딩 (gemini-embedding-001) → 인덱싱
3. generateContent 호출 시 FileSearch 도구 지정
   → 쿼리 임베딩 → KNN 검색 → 관련 청크를 컨텍스트로 주입
```

### Python SDK 예제

```python
from google import genai
from google.genai import types
import time

client = genai.Client(api_key="YOUR_KEY")

# Store 생성
store = client.file_search_stores.create(
    config={'display_name': 'my-store'}
)

# 파일 업로드
op = client.file_search_stores.upload_to_file_search_store(
    file='document.md',
    file_search_store_name=store.name,
    config={'display_name': 'document.md'}
)
while not op.done:
    time.sleep(5)
    op = client.operations.get(op)

# 검색 (지원 모델만!)
response = client.models.generate_content(
    model="gemini-2.5-flash-lite",  # gemini-2.0-flash 안됨!
    contents="질문 내용",
    config=types.GenerateContentConfig(
        tools=[types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[store.name]
            )
        )]
    )
)
print(response.text)
```

### REST API 예제

```bash
# Store 생성
curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"displayName": "My Store"}'

# 검색 (gemini-3-flash-preview 사용)
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
    -H "x-goog-api-key: ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "contents": [{"parts": [{"text": "질문"}]}],
        "tools": [{"fileSearch": {"fileSearchStoreNames": ["STORE_NAME"]}}]
    }'
```

### 청킹 설정

```python
op = client.file_search_stores.upload_to_file_search_store(
    file_search_store_name=store.name,
    file_name=sample_file.name,
    config={
        'chunking_config': {
            'white_space_config': {
                'max_tokens_per_chunk': 200,
                'max_overlap_tokens': 20
            }
        }
    }
)
```

### 메타데이터 필터

```python
# 업로드 시 메타데이터 추가
op = client.file_search_stores.import_file(
    file_search_store_name=store.name,
    file_name=sample_file.name,
    custom_metadata=[
        {"key": "author", "string_value": "John"},
        {"key": "year", "numeric_value": 2026}
    ]
)

# 검색 시 필터 적용
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="질문",
    config=types.GenerateContentConfig(
        tools=[types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[store.name],
                metadata_filter="author=John",
            )
        )]
    )
)
```

### Citations 접근

```python
meta = response.candidates[0].grounding_metadata
if meta and meta.grounding_chunks:
    for chunk in meta.grounding_chunks:
        if chunk.retrieved_context:
            print(chunk.retrieved_context.title)
```

### Store/문서 관리

```python
# Store 목록
for store in client.file_search_stores.list():
    print(store)

# 문서 목록
for doc in client.file_search_stores.documents.list(parent='fileSearchStores/xxx'):
    print(doc)

# 문서 삭제
client.file_search_stores.documents.delete(name='fileSearchStores/xxx/documents/yyy')

# Store 삭제
client.file_search_stores.delete(name='fileSearchStores/xxx', config={'force': True})
```

## 💡 실용적 평가 / 적용

**장점:**
- 자동 청킹/임베딩 → 직접 벡터DB 관리 불필요 (vecsearch 대체 가능)
- 저장 무료, 인덱싱 비용 매우 저렴 ($0.15/1M tokens)
- 옵시디언 vault를 git sync 없이 직접 업로드 가능

**한계:**
- 지원 모델 제한 (gemini-2.0-flash, 2.5-flash 미지원)
- 다른 도구(Google Search, URL Context)와 동시 사용 불가
- Free tier에서 generate_content 쿼터 0 → 결제 필수

**적용 방안:**
- vecsearch의 클라우드 대체: 로컬 임베딩 대신 Gemini API로 전환
- 옵시디언 vault를 Google Drive 대신 직접 FileSearchStore에 업로드
- MCP 서버로 래핑하면 Claude Code에서도 활용 가능

## 🔗 관련 개념

- [[벡터 시맨틱 검색]] - 로컬 vecsearch와 비교
- [[컨텍스트 엔지니어링 (Context Engineering)]] - RAG 컨텍스트 주입 전략
- [[메모리 시스템 (Memory Systems)]] - 메모리 계층 설계

---

**작성일**: 2026-02-13
**출처**: https://ai.google.dev/gemini-api/docs/file-search
**분류**: API 문서 정리