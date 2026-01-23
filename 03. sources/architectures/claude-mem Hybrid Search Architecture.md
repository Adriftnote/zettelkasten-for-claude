---
title: claude-mem Hybrid Search Architecture
type: note
permalink: architecture/claude-mem-hybrid-search-architecture
tags:
- claude-mem
- search
- fts5
- bm25
- chroma
- vector
- hybrid-search
extraction_status: pending
---

# claude-mem 하이브리드 검색 아키텍처

## Observations

### 검색 엔진 구성
- [layer] Chroma 벡터 DB - 시맨틱 검색 (임베딩 기반)
- [layer] SQLite FTS5 - 키워드 검색 (전문 검색)
- [concept] 둘을 조합하여 정확도와 회수율 모두 확보

### 검색 전략 3가지
- [strategy] ChromaStrategy - query 있고 Chroma 사용가능
- [strategy] SQLiteStrategy - query 없거나 필터만 있음
- [strategy] HybridStrategy - concepts/files/type + query 조합

### FTS5 (Full-Text Search 5)
- [concept] SQLite 내장 전문 검색 엔진
- [structure] 역인덱스로 저장: 단어 → [rowid들]
- [ranking] BM25 알고리즘으로 관련도 점수 계산
- [performance] O(1) 인덱스 조회 vs LIKE의 O(n) 전체 스캔

### FTS5 자동 동기화
- [pattern] 트리거로 observations 테이블 변경 자동 추적
- [pattern] INSERT/UPDATE 시 자동 토큰화 및 인덱싱
- [pattern] observations_fts 가상 테이블이 항상 동기화됨

### BM25 랭킹
- [concept] TF (Term Frequency) - 검색어가 많을수록 점수 상승
- [concept] IDF (Inverse Document Frequency) - 드문 단어일수록 점수 상승
- [concept] 문서 길이 정규화 - 짧은 문서에서 중요 단어 강조
- [note] rank 컬럼으로 ASC 정렬하면 관련도 높은 순

### LIKE vs FTS5
- [performance] LIKE: O(n) 전체 스캔, FTS5: O(1) 인덱스 조회
- [ranking] LIKE: 없음, FTS5: BM25 점수
- [complexity] LIKE: 복합 검색 어려움, FTS5: "error AND connection" 가능

### 하이브리드 검색 흐름
- [step] SQLite로 타입/개념/날짜 필터 후 ID 추출
- [step] Chroma로 시맨틱 유사도 검색
- [step] 교집합에 Chroma 순서 적용
- [result] 정확도 + 시맨틱 관련도 모두 고려

### 90일 최신성 필터
- [pattern] RECENCY_WINDOW_MS = 7776e6 (90일)
- [pattern] Date.now() - created_at_epoch로 최근 기록 우선
- [concept] 시간이 지난 구 정보보다 최근 정보 선호

### 특정 에러 타입이 잘 검색되는 이유
- [reason] type 필터링으로 오류 타입 좁히기
- [reason] concepts 태깅으로 의미 분류
- [reason] 시맨틱 유사도로 표현 변형 매칭
- [reason] 90일 최신성으로 최근 사례 우선

### 저장 구조
- [layer] observations 테이블 - 원본 데이터
- [layer] observations_fts 테이블 - FTS5 가상 테이블 (자동 동기화)
- [internal] FTS5 내부적으로 역인덱스 구조 유지

## Relations