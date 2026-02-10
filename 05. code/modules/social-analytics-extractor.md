---
title: social-analytics-extractor
type: module
level: high
category: "automation/sns/extraction"
semantic: "extract sns statistics"
permalink: modules/social-analytics-extractor
path: "working/projects/social-analytics-extractor/"
tags:
- chrome-extension
- manifest-v3
- javascript
---

# social-analytics-extractor

X, Facebook, Naver 통계 데이터를 추출하는 Chrome Extension

## 📖 개요

각 SNS 플랫폼의 통계 페이지에서 조회수, 반응수, 팔로워 변동 데이터를 추출하고, n8n webhook으로 DB에 자동 저장하는 Chrome Extension.

## Observations

- [impl] Manifest V3 기반, Service Worker + Content Scripts 구조 #pattern
- [impl] 플랫폼별 content script가 DOM/API에서 데이터 추출 #algo
- [impl] 3개 플랫폼 모두 `getDailyInsights` 통일 액션 + 표준 응답구조 #pattern
- [deps] chrome.runtime, chrome.storage, fetch API #import
- [usage] 각 플랫폼 통계 페이지에서 팝업 열고 "추출" 버튼 클릭
- [note] X/Facebook는 GraphQL API 사용, Naver는 DOM 파싱 #context

## 파일 구조

```
social-analytics-extractor/
├── manifest.json        ← Extension 설정
├── popup.html/js        ← UI + 데이터 정규화
├── background.js        ← n8n webhook 호출
└── content/
    ├── x.js             ← X GraphQL API 추출
    ├── facebook.js      ← GraphQL API 추출
    └── naver.js         ← Naver DOM 파싱
```

## 주요 로직

### 표준 응답 구조 (content scripts 공통)
```javascript
// 3개 플랫폼 모두 동일한 구조로 응답
{
  success: true,
  data: {
    extractedAt: "ISO timestamp",
    period: "7일" | "2026-01-25",
    totals: { views, interactions, ... },
    dailyData: [{ date: "YYYY-MM-DD", ...metrics }]
  }
}
```

### 데이터 정규화 (popup.js → webhook)
```javascript
// 플랫폼별 필드를 webhook 스키마로 매핑
{
  platform: 'x',
  views: day.impressions,
  interactions: day.engagements,
  followers_diff: day.followers
}
```

### Webhook 전송 (background.js)
```javascript
// popup → background → n8n
chrome.runtime.sendMessage({
  action: 'sendToWebhook',
  data: normalizedData
});
```

## Relations

- part_of [[SNS 기초 데이터 수집 자동화]] (소속 프로젝트)
- contains [[x-extractor]] (X 데이터 추출)
- contains [[facebook-extractor]] (Facebook 데이터 추출)
- contains [[naver-extractor]] (Naver 데이터 추출)
- contains [[background-service-worker]] (Webhook 호출)
- contains [[popup-controller]] (팝업 UI 컨트롤러)


## Change Log

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-06 | path 수정: `worker/from-code/` → `projects/` (실제 코드 위치 반영) |
| 2026-02-06 | Facebook 설명 수정: DOM 파싱 → GraphQL API |
| 2026-02-06 | 인터페이스 통일: 3개 플랫폼 getDailyInsights 액션 + 표준 응답구조 적용 |
