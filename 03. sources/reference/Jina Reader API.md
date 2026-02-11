---
title: Jina Reader API
type: doc-summary
permalink: sources/reference/jina-reader-api
tags:
- api
- web-scraping
- llm
- jina
date: 2026-02-11
---

# Jina Reader API

URL을 LLM 친화적 마크다운 텍스트로 변환하는 API. HTML 노이즈를 제거하고 본문만 추출.

## 📖 핵심 아이디어

웹페이지 URL 앞에 `https://r.jina.ai/`를 붙이면 HTML 태그, 광고, 네비게이션 등을 걷어내고 깨끗한 마크다운으로 변환해준다. LLM/RAG 파이프라인에 웹 콘텐츠를 넣을 때 전처리 도구로 활용. 별도 파싱 코드 없이 API 한 줄로 해결.

## 🛠️ 주요 엔드포인트

| 엔드포인트 | 기능 | 사용법 |
|-----------|------|--------|
| `r.jina.ai` | URL → 마크다운 변환 | `https://r.jina.ai/{URL}` |
| `s.jina.ai` | 웹 검색 → 텍스트 결과 | `https://s.jina.ai/?q={검색어}` |

- GET/POST 모두 지원
- JSON 응답 옵션 (URL, title, content, timestamp)

## 🔧 사용법 및 옵션

### 기본 사용

```
GET https://r.jina.ai/https://example.com/article
```

### 주요 헤더 옵션

| 옵션 | 설명 |
|------|------|
| CSS 선택자 | 특정 요소만 추출/제외 |
| 이미지 캡셔닝 | VLM으로 이미지 설명 자동 생성 |
| PDF 지원 | PDF URL 네이티브 읽기 |
| 프록시 | 특정 국가 IP로 접근 |
| 캐싱 | 5분 캐시, 바이패스 옵션 |
| Shadow DOM/iframe | 포함 가능 |
| 커스텀 User-Agent | 설정 가능 |

### ReaderLM-v2

1.5B 파라미터 모델로 고품질 HTML→마크다운 변환. 토큰 3배 소비.

## 💡 실용적 평가

### 장점
- **극도로 간단** - URL 앞에 prefix만 붙이면 됨
- **무료 티어 넉넉** - API 키당 1,000만 토큰
- **프로덕션 레디** - SOC 2 준수, 활발한 유지보수
- **PDF 지원** - 별도 처리 없이 PDF도 텍스트 변환

### 레이트 제한

| 티어 | Reader (r.) | Search (s.) |
|-----|:-----------:|:-----------:|
| 키 없음 | 20 RPM | 미지원 |
| 무료 키 | 500 RPM | 100 RPM |
| 프리미엄 | 5,000 RPM | 1,000 RPM |

### 한계
- **로그인 필요 사이트 불가** (Medium 멤버 전용 등)
- **봇 차단(Cloudflare/CAPTCHA) 사이트 불가**
- 유료 키로도 차단 사이트 접근 안 됨 (레이트만 상향)
- 평균 응답 7.9초 (Search는 2.5초)

### 테스트 결과 (2026-02-11)

| 사이트 | 결과 |
|--------|------|
| GeekNews (hada.io) | O - 정상 추출 |
| Medium (멤버 전용) | X - 403 Forbidden |

### 활용 시나리오
- Claude Code에서 WebFetch 대안으로 사용
- n8n 워크플로우에서 웹 콘텐츠 전처리
- RAG 파이프라인 입력 데이터 정제
- MCP 서버로 래핑하여 `/jina` 스킬 구현 가능

## 🔗 관련 개념

- [[웹 스크래핑 (Web Scraping)]] - 전통적 웹 데이터 추출 방식
- [[RAG (Retrieval-Augmented Generation)]] - Jina Reader가 전처리로 활용되는 패턴
- [[MCP (Model Context Protocol)]] - Jina Reader MCP 서버로 확장 가능

---

**작성일**: 2026-02-11
**분류**: API / 웹 데이터 추출
**출처**: https://jina.ai/reader/