---
title: MCP Tool Search Implementation Guide
type: note
permalink: architecture/mcp-tool-search-implementation-guide
tags:
- mcp
- tool-search
- embeddings
- defer-loading
- api
- token-optimization
extraction_status: pending
---

# MCP Tool Search 구현 가이드

## Observations

### 문제 상황
- [problem] MCP 도구가 10개+ 많아지면 토큰 소비가 급증
- [solution] Tool Search 구현으로 필요한 도구만 로드 → 90%+ 토큰 절약

### 두 가지 구현 방식
- [method-1] API defer_loading - 간단, 공식 지원 (Beta, 모델 제한)
- [method-2] Client-side Embeddings - 유연, 커스터마이징 (직접 구현 필요)

### 방식 1: API defer_loading
- [requirement] Beta 헤더 필수: "advanced-tool-use-2025-11-20"
- [requirement] 지원 모델: claude-sonnet-4-5, claude-opus-4-5 (Haiku 미지원)
- [concept] 도구에 defer_loading: True 설정 → Tool Search Tool만 로드
- [concept] 필요할 때 검색 → 관련 도구 발견 → 자동 확장

### 방식 2: Client-side Embeddings
- [advantage] 모델 제한 없음 (Haiku도 가능)
- [advantage] 검색 로직 커스터마이징 가능
- [advantage] 로컬에서 완전 제어
- [requirement] sentence-transformers, numpy 필요

### 도구별 접근 전략
- [reference] ~10개: 그냥 전부 로드
- [reference] 10-50개: API defer_loading
- [reference] 50개+: Client-side Embeddings
- [reference] 200개+: Embeddings + 캐싱

### 하이브리드 전략
- [pattern] 자주 쓰는 핵심 도구 → 즉시 로드
- [pattern] 나머지 도구 → 검색으로 발견
- [pattern] 임베딩 캐싱으로 초기화 시간 단축

### 제한사항
- [limit-api] 최대 도구 수: 10,000개
- [limit-api] 검색당 반환: 3-5개
- [limit-embeddings] 임베딩 모델 로드: ~100MB 메모리
- [limit-embeddings] 초기화 시간 필요

## Relations