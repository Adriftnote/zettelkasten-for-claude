---
title: platform-stores-legacy
type: note
permalink: zettelkasten/05.-code/modules/platform-stores-legacy
tags:
- module
- go
- store
- legacy
---

## 경로
`internal/store/{tiktok,meta_organic,meta_ads,navertv,naver_blog,google_ads}.go`

## 역할
[legacy] 6개 플랫폼 상세 페이지 store — youtube-store와 동일 패턴이지만 규모 작음

## 파일별 규모
- tiktok.go: 191줄
- meta_organic.go: 277줄
- meta_ads.go: 150줄
- navertv.go: 148줄
- naver_blog.go: 234줄
- google_ads.go: 68줄 (더미)

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[multi]]

## Observations
- [note] [legacy] 개별 문서화하기엔 패턴 동일. youtube-store와 같은 구조(GetPlatform → Info+Charts+Tables) #context
- [impl] google_ads.go는 더미 데이터 반환 (실제 수집 미완) #caveat
- [note] v2에서 제네릭 상세 페이지로 통합 전환 예정 #context