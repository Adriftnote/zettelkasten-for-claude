---
title: REF-083 Google 검색 망가짐 - 오픈소스 SEO 전쟁과 가짜사이트 상위 노출 문제
type: doc-summary
permalink: sources/reference/google-search-broken-opensource-seo-war
tags:
- seo
- google-search
- open-source
- security
- scraping
- ai-search
date: 2026-03-09
---

# Google 검색 망가짐 - 오픈소스 SEO 전쟁과 가짜사이트 상위 노출 문제

오픈소스 프로젝트(NanoClaw, GitHub 18K+ stars)가 정당한 SEO 조치에도 Google 검색에서 가짜 스크래핑 사이트에 밀리는 사례. 검색엔진 신뢰성과 오픈소스 보안의 교차점.

## 📖 핵심 아이디어

NanoClaw 개발자(@Gavriel_Cohen)가 프로젝트명 검색 시 공식사이트(nanoclaw.dev)는 5페이지 이후에도 미노출되고, README를 스크래핑한 가짜사이트(nanoclaw.net)가 2위에 노출되는 문제를 제기했다. 구조화된 데이터, Search Console 15회 제출, 15개 언어 번역, 주요 매체(The Register, VentureBeat) 백링크 등 모든 정당한 SEO 조치를 완료했음에도 변화 없음.

보안 중심 프로젝트에서 가짜사이트가 상위 노출되면 악성코드 삽입·피싱 등 직접적 보안 위협이 된다 — "Google 검색 자체가 보안 취약점"이라는 주장.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **NanoClaw** | 보안 중심 에이전트 런타임. 격리 컨테이너/샌드박스 실행. GitHub 18K+ stars |
| **공식 사이트** | nanoclaw.dev — 검색 5페이지 이후에도 미노출 |
| **가짜 사이트** | nanoclaw.net — README 스크래핑, 검색 2위 노출 |
| **수행한 SEO** | Schema 마크업, Search Console(15회), 15개 언어, 매체 백링크 |
| **핵심 위협** | 가짜사이트에 악성코드 삽입 가능 → 다운로드 경유 공격 |

## 🔧 작동 방식 / 문제 구조

```
[개발자] ── 정당한 SEO 조치 ──▶ [Google]
  │  Schema, Search Console,        │
  │  백링크, 다국어 번역             │
  │                                  ▼
  │                          [순위 알고리즘]
  │                                  │
  │         ┌────────────────────────┤
  │         ▼                        ▼
  │   nanoclaw.net (가짜)      nanoclaw.dev (공식)
  │   → 검색 2위 노출          → 5페이지 이후
  │
  └── 보안 위협: 사용자가 가짜사이트에서 악성 바이너리 다운로드
```

**왜 가짜가 이기는가:**
- Google 알고리즘이 "신호 해석"에 실패 — 스크래핑 콘텐츠와 원본 구분 못함
- 가짜사이트가 SEO 최적화(키워드 스터핑 등)를 더 공격적으로 수행
- 도메인 연식(age)이나 다른 전통적 신호가 공식 .dev 도메인보다 높을 수 있음

## 💡 실용적 평가

**오픈소스 프로젝트에 대한 시사점:**
- 프로젝트명 검색 결과를 주기적으로 모니터링해야 함
- GitHub README에 공식 사이트 URL을 눈에 띄게 표시
- UDRP(도메인 분쟁) 등 법적 대응도 고려 필요
- 공식 소셜 프로필(Twitter, LinkedIn) 구축으로 Knowledge Graph 강화

**근본적 트렌드:**
- AI 검색(ChatGPT, Claude)이 전통 검색보다 공식 출처를 더 정확히 식별한다는 커뮤니티 공감
- "SEO 전쟁을 벌여야 하는 상황 자체가 문제" — 검색엔진 신뢰성의 구조적 하락
- 패키지 매니저(npm, pip)의 typosquatting 문제와 유사한 패턴

**한계:**
- 단일 사례이므로 Google 검색 전반의 문제로 일반화하기엔 제한적
- Google 측 대응이나 알고리즘 변경 가능성 미반영

## 🔗 관련 개념

- [[Same-Origin Policy (동일 출처 정책)]] - (웹 보안 정책과 가짜사이트 문제의 접점 — SOP는 브라우저 레벨 보호이지만, 검색 레벨에서는 보호 없음)

---

**작성일**: 2026-03-09
**분류**: Web Security / Search Engine / Open Source
**출처**: https://news.hada.io/topic?id=27184 (원문: twitter.com/Gavriel_Cohen)