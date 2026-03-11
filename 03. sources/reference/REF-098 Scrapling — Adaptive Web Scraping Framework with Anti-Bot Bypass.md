---
title: REF-098 Scrapling — Adaptive Web Scraping Framework with Anti-Bot Bypass
type: doc-summary
permalink: sources/reference/scrapling-adaptive-web-scraping-framework-1
tags:
- web-scraping
- Python
- anti-bot
- Playwright
- Cloudflare
- MCP
- spider
date: 2026-03-11
---

# Scrapling — Adaptive Web Scraping Framework with Anti-Bot Bypass

단일 요청부터 대규모 크롤링까지 처리하는 적응형 웹 스크래핑 프레임워크. 사이트 구조 변경 시 요소를 자동 재탐색하고, Cloudflare Turnstile 등 안티봇을 우회. GitHub 28K+ 스타.

## 📖 핵심 아이디어

Scrapling의 차별점은 두 가지: (1) **Adaptive Selector** — 사이트 DOM이 변경되어도 유사도 알고리즘으로 요소를 자동 재탐색하여 셀렉터 깨짐 문제를 해결. (2) **3-tier Fetcher** — 단순 HTTP부터 스텔스 브라우저까지 상황에 맞게 선택하며, TLS 핑거프린트 위장과 Cloudflare 우회를 기본 제공.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **Fetcher** | 빠른 HTTP 요청, TLS 핑거프린트 위장 (Chrome/Firefox/Safari) |
| **StealthyFetcher** | 헤드리스 브라우저 + 스텔스 모드, Cloudflare Turnstile 자동 해결 |
| **DynamicFetcher** | Playwright Chromium 기반 풀 브라우저 자동화 |
| **Session 클래스** | 쿠키/상태 유지, 세션 기반 요청 |
| **Adaptive Selector** | DOM 변경 시 유사도 기반 요소 자동 재탐색 |
| **Spider** | Scrapy 스타일 API (start_urls, async parse, 동시성 제어, checkpoint 재개) |
| **MCP Server** | Claude/Cursor와 연동하여 AI 기반 추출 |

## 🔧 작동 방식 / 적용 방법

```
[Fetcher 선택 기준]

정적 HTML, API 호출         → Fetcher (HTTP, 가장 빠름)
JS 렌더링 필요              → DynamicFetcher (Playwright)
안티봇/Cloudflare 우회 필요 → StealthyFetcher (스텔스 브라우저)

[Adaptive Selector 동작]
1. 첫 스크래핑 시 요소 특징 저장 (태그, 속성, 텍스트, 위치)
2. 사이트 구조 변경 감지
3. 유사도 알고리즘으로 변경된 요소 자동 매칭
4. 셀렉터 깨짐 없이 계속 수집
```

```python
# Cloudflare 우회 예시
from scrapling.fetchers import StealthySession
with StealthySession(headless=True, solve_cloudflare=True) as session:
    page = session.fetch('https://target-site.com')

# Spider 크롤링
from scrapling.spiders import Spider, Response
class MySpider(Spider):
    name = "my_spider"
    start_urls = ["https://example.com"]
    async def parse(self, response: Response):
        for item in response.css('.item'):
            yield {"title": item.css('h2::text').get()}
MySpider().start()
```

## 💡 실용적 평가 / 적용

- **강점**: Cloudflare 우회가 기본 내장이라 별도 프록시 없이도 보호된 사이트 수집 가능. Adaptive Selector로 유지보수 비용 감소
- **Spider 프레임워크**: Scrapy와 유사한 API라 학습 비용 낮음. checkpoint 기반 중단/재개 지원
- **MCP 서버**: AI 에이전트가 직접 웹 스크래핑을 도구로 사용 가능
- **우리 환경 적용**: SNS 게시물별 조회수 추적에서 Playwright 직접 사용 중 — Scrapling의 StealthyFetcher가 안티봇 우회에 더 안정적일 수 있음. 단, 현재 collect-posts.js가 Node.js 기반이라 전환 비용 고려 필요
- **한계**: Python 전용, Node.js 미지원. 28K 스타지만 비교적 신규 프로젝트
- **도입 시나리오**: 현재 Playwright(Node.js) 수집이 안티봇으로 막힐 때, 해당 플랫폼만 Scrapling Python 스크립트로 분리 검토. 전면 전환은 비용 과다 (6개 플랫폼 로직 재작성 + Docker 환경 변경). 테스트 단계 완료 후 안티봇 이슈 발생 시 재검토

## 🔗 관련 개념

- [[SNS 게시물별 조회수 추적]] - (현재 Playwright로 수집 중, StealthyFetcher 대안 검토 가능)

---

**작성일**: 2026-03-11
**분류**: 웹 스크래핑 도구
**원문**: https://github.com/D4Vinci/Scrapling