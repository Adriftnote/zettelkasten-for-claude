---
title: Server Selection Pattern
type: pattern
tags: [metabase, data-source, database, configuration]
permalink: knowledge/concepts/server-selection-pattern
category: Metabase
difficulty: intermediate
created: 2026-01-19
---

# Server Selection Pattern

## 📖 개요

Metabase에서 여러 데이터베이스 서버 중 원하는 서버를 선택하여 쿼리를 실행하는 패턴입니다. 개발/테스트/프로덕션 환경을 구분하거나, 여러 지점의 데이터베이스를 동시에 모니터링할 때 유용합니다.

## 🎭 비유

여러 지점의 ATM 기기에서 원하는 지점의 거래를 조회하는 것과 같습니다. 서울 지점 잔액을 보고 싶으면 "서울 은행" 서버를 선택하고, 부산 지점 잔액을 보고 싶으면 "부산 은행" 서버를 선택합니다.

## ✨ 특징

- **Multi-Database Support**: 여러 데이터베이스 동시 관리
- **Environment Separation**: Dev/Test/Prod 분리
- **Flexible Query Execution**: 어느 서버에서든 쿼리 실행 가능
- **Unified Dashboard**: 같은 대시보드에서 다양한 서버 데이터 표시
- **Dynamic Server Selection**: 런타임에 서버 선택

## 💡 예시

### 예시 1: 기본 서버 선택 설정

```markdown
## Metabase 데이터베이스 연결 설정

### 설정 상황
조직: 온라인 쇼핑몰
데이터베이스:
  - dev-mysql: 개발 환경
  - staging-mysql: 스테이징 환경
  - prod-mysql: 프로덕션 환경

### 1단계: 데이터베이스 추가
Metabase 관리자 → "설정" → "데이터베이스"

데이터베이스 1:
  - 이름: Development
  - 호스트: dev-mysql.internal.com
  - 포트: 3306
  - DB명: shopdb_dev
  - 사용자: metabase_dev

데이터베이스 2:
  - 이름: Production
  - 호스트: prod-mysql.internal.com
  - 포트: 3306
  - DB명: shopdb_prod
  - 사용자: metabase_prod

### 2단계: 카드에서 데이터 소스 선택
카드 작성 시:
- "데이터 선택" → "Development" 선택
- 또는 "Production" 선택
→ 선택된 데이터베이스에서 데이터 로드

### 3단계: 쿼리 실행
작성한 쿼리가 선택된 데이터베이스에서 실행됨
```

### 예시 2: 다중 데이터베이스 대시보드

```markdown
## 멀티 서버 모니터링 대시보드

### 대시보드 구성

**메인 카드**: 요약 통계
```
┌─────────────────────────────────────┐
│ 종합 판매 현황                        │
├─────────────────────────────────────┤
│ Development: 어제 판매 $45,320       │
│ Production: 어제 판매 $892,450       │
│ 차이: +1866%                        │
└─────────────────────────────────────┘
```

**세부 카드**: 데이터베이스별 분석
```
Left Column (Development):
  - 활성 사용자: 250
  - 주문 건수: 125
  - 평균 주문액: $362

Right Column (Production):
  - 활성 사용자: 8,540
  - 주문 건수: 2,845
  - 평균 주문액: $314
```

### 3단계: 필터 적용
필터: "판매 지역" (드롭다운)

같은 필터가 모든 카드에 적용되지만,
각 카드는 자신이 지정한 데이터베이스에서 데이터를 가져옴
```

### 예시 3: 서버 선택 구현 체크리스트

```markdown
## 멀티 데이터베이스 설정 체크리스트

### 준비 단계
□ 연결할 모든 데이터베이스 목록 작성
□ 각 DB의 접근 정보 준비 (호스트, 포트, 사용자, 비밀번호)
□ 네트워크 연결성 확인
□ DB 사용자 권한 설정 완료

### 메타베이스 설정
□ 데이터베이스 1 추가
  - 연결명 입력
  - 연결 정보 입력
  - 테스트 연결
□ 데이터베이스 2 추가
  - (위와 동일)
□ 필요한 만큼 추가
□ 각 DB 동기화 설정
  - 자동 메타데이터 갱신
  - 동기화 시간 설정

### 권한 설정
□ 각 DB별 접근 권한 설정
□ 그룹별 접근 제한
  - 개발팀: Development DB만 접근
  - 분석팀: All DB 접근
  - 임원진: Production DB만 접근

### 검증
□ 각 DB에서 샘플 쿼리 실행
□ 결과 데이터 정확성 확인
□ 응답 시간 측정
□ 보안 정책 준수 확인
```

### 예시 4: 동적 서버 선택 패턴

```markdown
## 고급: 매개변수 기반 서버 선택

### 사용 사례
사용자가 선택한 환경에 따라 자동으로 올바른 DB에서 쿼리 실행

### 구성 방법

1) 필터 추가: "환경 선택"
   - 옵션: Development, Staging, Production

2) 대시보드 설정
   - 필터값이 "Development" → Development DB에서 쿼리
   - 필터값이 "Production" → Production DB에서 쿼리

### 주의사항
Metabase의 기본 기능으로는 쿼리 자체의 DB 선택은 동적으로 불가
→ 대신 여러 카드를 미리 준비하고, 필요한 것만 표시하는 방식 사용

또는 SQL 쿼리에서 파라미터 사용:
```sql
SELECT * FROM {{Database}}.users
WHERE region = {{region_filter}}
```
(주: 이는 실제 Metabase 문법은 아니며, 개념 설명)
```

## 🛠️ 해결/적용 방법

### 1단계: 데이터베이스 연결 준비
```
필요 정보:
- 호스트명 (또는 IP 주소)
- 포트 번호
- 데이터베이스명
- 사용자명
- 비밀번호
```

### 2단계: Metabase에서 데이터베이스 추가
- 관리자 패널 → 데이터베이스 설정
- 각 데이터베이스별 연결명 지정 (이용하기 쉬운 이름)
- 연결 정보 입력
- 테스트 연결로 정상 여부 확인

### 3단계: 메타데이터 동기화
- 각 DB의 테이블/컬럼 정보 로드
- 자동 동기화 설정

### 4단계: 권한 관리
```
역할별 접근 제한:
- 개발팀: Dev DB만
- QA팀: Dev + Staging
- 비즈니스팀: Prod DB만
```

### 5단계: 대시보드/카드 작성
- 각 카드 생성 시 데이터 소스(DB) 명시적 선택
- 동일한 쿼리도 여러 DB에서 실행 가능

### 6단계: 성능 모니터링
- 각 DB의 쿼리 성능 모니터링
- 느린 쿼리 최적화

## Relations

- enables [[model-configuration-pattern|Model Configuration Pattern]] - configures model data source
- relates_to [[dropdown-filter-pattern|Dropdown Filter Pattern]] - similar source selection pattern
- used_by [[text-card-addition-pattern|Text Card Addition Pattern]] - provides database context
- part_of [[metabase-dashboard-framework|Metabase Framework]] - multi-environment support
