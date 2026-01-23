---
title: Dropdown Filter Pattern
type: pattern
tags: [metabase, ui, filtering, dashboard]
permalink: knowledge/concepts/dropdown-filter-pattern
category: Metabase
difficulty: beginner
created: 2026-01-19
---

# Dropdown Filter Pattern

## 📖 개요

Metabase 대시보드에서 드롭다운 필터를 구현하여 사용자가 쿼리 결과를 동적으로 필터링할 수 있게 하는 패턴입니다. 드롭다운 선택값이 변하면 대시보드의 모든 연결된 카드들이 자동으로 업데이트됩니다.

## 🎭 비유

쇼핑 사이트에서 "카테고리" 드롭다운을 선택하면 전체 상품 목록이 그 카테고리로 필터링되는 것처럼, 대시보드의 드롭다운을 변경하면 모든 카드가 해당 필터에 맞게 업데이트됩니다.

## ✨ 특징

- **Dynamic Filtering**: 드롭다운 선택 시 실시간 필터 적용
- **Multi-card Update**: 하나의 필터가 여러 카드에 영향
- **Data-driven Options**: 드롭다운 항목을 데이터베이스에서 로드
- **Cascading Filters**: 필터끼리 연결하여 종속 관계 설정 가능
- **User-friendly**: 코드 없이 UI로 설정

## 💡 예시

### 예시 1: 기본 드롭다운 필터 설정

```markdown
## Metabase 대시보드 설정

### 1단계: 필터 추가
- 대시보드 편집 모드 진입
- "필터 추가" 클릭
- "드롭다운" 선택
- 필터명: "지역"

### 2단계: 필터 소스 구성
옵션 1 - 데이터베이스에서 동적 로드:
```
데이터 소스: 고객 테이블
컬럼: region
```

옵션 2 - 정적 목록:
```
- 서울
- 부산
- 대구
- 인천
```

### 3단계: 카드와 필터 연결
- 매출 합계 카드 클릭
- "필터와 연결"
- region 필터와 연결
- 매핑: 필터 값 → 카드의 region 컬럼

### 4단계: 결과 확인
드롭다운에서 "서울" 선택 → 모든 카드가 서울 데이터만 표시
```

### 예시 2: 실제 구현 시나리오

**상황**: 일일 판매 대시보드
```
필터 구조:

[지역 드롭다운]
  ├─ 서울 (10개 지점)
  ├─ 부산 (5개 지점)
  └─ 인천 (3개 지점)
      ↓ 영향

카드들:
  - 어제 판매액: 서울 기준만 표시
  - 상위 상품: 서울 기준 TOP 10
  - 시간대별 매출: 서울 시간대만
```

**설정 방법**:
```javascript
// 메타베이스 UI로 설정 (코드 불필요)

필터 1: 지역 드롭다운
  - 소스: 데이터베이스 → stores 테이블 → region 컬럼
  - 기본값: "서울"
  - 여러 선택 가능: Yes

필터 2: 기간 드롭다운
  - 소스: 정적 목록 (오늘, 어제, 이번주, 이번달)
  - 여러 선택 가능: No
```

### 예시 3: 드롭다운 필터 종류별 구현

```
필터 유형별 구성:

1) 카테고리 필터 (고정값)
   필터명: 상품 카테고리
   옵션: 의류, 식품, 가전, 도서
   → 드롭다운 선택 시 해당 카테고리만 표시

2) 숫자 범위 필터
   필터명: 판매액 범위
   범위: 0 ~ 1000000
   입력 형식: 슬라이더 또는 텍스트
   → 선택한 범위 내 데이터만 표시

3) 날짜 필터
   필터명: 판매 기간
   옵션: 오늘, 이번주, 이번달, 커스텀 범위
   → 선택한 기간의 데이터만 표시

4) 데이터베이스 연동 필터
   필터명: 담당자
   소스: employees 테이블 → name 컬럼
   → DB에 새 직원이 추가되면 자동 반영
```

### 예시 4: 드롭다운 필터 체크리스트

```markdown
## 드롭다운 필터 구현 체크리스트

□ 필터 생성
  - 필터명 정의 (영문 권장: region)
  - 표시명 정의 (UI: "지역")
  - 필터 유형 선택

□ 데이터 소스 설정
  - ☐ 정적 목록: 선택지 직접 입력
  - ☐ 데이터베이스: 테이블/컬럼 지정
  - ☐ 커스텀 쿼리: SQL로 동적 목록 생성

□ 기본값 설정
  - 기본 선택값 지정
  - 필수 선택 여부 설정
  - 빈 값 허용 여부 설정

□ 카드와 연결
  - 필터링할 카드 선택
  - 필터 → 카드 컬럼 매핑
  - AND/OR 조건 설정

□ 테스트
  - 드롭다운 선택 시 카드 업데이트 확인
  - 모든 선택지가 정상 작동 확인
  - 기본값이 올바르게 적용되는지 확인
```

## 🛠️ 해결/적용 방법

### 1단계: 필터 추가
- 대시보드를 편집 모드로 진입
- "필터 추가" 버튼 클릭
- "드롭다운" 선택

### 2단계: 필터명과 옵션 정의
- 필터 ID (내부용): 영문 소문자
- 표시명 (사용자용): 한글 가능
- 옵션 소스 선택:
  - 고정 목록 입력
  - 또는 데이터베이스 테이블 선택

### 3단계: 기본값 설정 (선택)
- 필터 로드 시 자동 선택될 값 지정
- "필수 항목" 체크 (기본값 반드시 있어야 함)

### 4단계: 카드와 연결
- 필터를 적용할 각 카드 선택
- 필터값과 카드의 데이터베이스 컬럼 매핑
- AND/OR 연산자 선택 (다중 필터 시)

### 5단계: 테스트
- 드롭다운 값 변경 시 카드 업데이트 확인
- 모든 선택지 테스트
- 성능 확인 (쿼리 로딩 시간)

## Relations

- used_by [[model-configuration-pattern|Model Configuration Pattern]] - filters model output
- relates_to [[server-selection-pattern|Server Selection Pattern]] - similar filtering pattern
- used_by [[text-card-addition-pattern|Text Card Addition Pattern]] - provides context for filtered data
- part_of [[metabase-dashboard-framework|Metabase Framework]] - core dashboard component
