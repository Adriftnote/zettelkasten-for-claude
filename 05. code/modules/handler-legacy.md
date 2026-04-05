---
title: handler-legacy
type: note
permalink: zettelkasten/05.-code/modules/handler-legacy
tags:
- module
- go
- handler
- legacy
---

## 경로
`internal/handler/api.go`

## 역할
[legacy] 플랫폼별 하드코딩 핸들러 11개 — handler/generic.go로 대체됨

## 함수
- **Overview**: Overview 핸들러
- **YouTube**: YouTube 상세
- **TikTok**: TikTok 상세
- **MetaOrganic**: Meta Organic 상세
- **MetaAds**: Meta Ads 상세
- **NaverTV**: Naver TV 상세
- **NaverBlog**: Naver Blog 상세
- **GoogleAds**: Google Ads 상세
- **ContentDetail**: 콘텐츠 상세
- **ContentList**: 콘텐츠 목록
- **Health**: 헬스체크

## Relations
- part_of [[MOT 실시간 대시보드]]

## Observations
- [note] [legacy] handler/generic.go로 대체. 기존 라우트 호환용으로 main.go에서 아직 등록 #deprecated
- [impl] 11개 함수가 동일한 복붙 패턴 — 제네릭화의 동기 #pattern