---
title: Model Configuration Pattern
type: pattern
tags: [metabase, models, configuration, query]
permalink: knowledge/concepts/model-configuration-pattern
category: Metabase
difficulty: intermediate
created: 2026-01-19
---

# Model Configuration Pattern

## 📖 개요

Metabase의 Model(데이터 모델)을 구성하여 복잡한 쿼리를 단순화하고, 재사용 가능한 데이터 집합을 만드는 패턴입니다. 모델은 사전 정의된 쿼리 결과를 마치 하나의 테이블처럼 취급할 수 있게 하며, 이를 여러 대시보드와 카드에서 공유할 수 있습니다.

## 🎭 비유

음식점의 "조리된 재료"와 같습니다. 고객이 직접 생 재료를 가지고 요리하는 대신(복잡한 쿼리), 이미 준비된 "미트볼" 같은 조리 제품(모델)을 사용하면 훨씬 쉽고 빠르게 요리할 수 있습니다.

## ✨ 특징

- **Query Encapsulation**: 복잡한 쿼리를 모델로 캡슐화
- **Reusability**: 한 번 만들면 여러 곳에서 재사용
- **Simplified Interface**: 사용자는 모델을 일반 테이블처럼 사용
- **Performance Caching**: 모델 결과를 캐시하여 성능 향상
- **Maintainability**: 쿼리 변경 시 모든 카드가 자동 반영

## 💡 예시

### 예시 1: 기본 모델 구성

```markdown
## 사용 사례: "월별 판매 분석" 모델

### 모델 목표
복잡한 JOIN과 GROUP BY를 포함한 쿼리를 단순화

### 원본 쿼리 (복잡함)
```sql
SELECT
  DATE_TRUNC('month', o.order_date) as month,
  c.region,
  COUNT(o.id) as order_count,
  SUM(o.amount) as total_sales,
  AVG(o.amount) as avg_order
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= DATE_ADD(CURDATE(), INTERVAL -12 MONTH)
GROUP BY DATE_TRUNC('month', o.order_date), c.region
ORDER BY month DESC
```

### 모델 설정
```
모델명: monthly_sales
데이터 소스: 위의 쿼리
필드 구성:
  - month (날짜) → 기본 필터용
  - region (텍스트) → 드롭다운 필터용
  - order_count (숫자) → 계산 필드용
  - total_sales (숫자) → 시각화용
  - avg_order (숫자) → 비교용

### 모델 사용
대시보드 작성자:
  - 복잡한 쿼리 작성 불필요
  - "monthly_sales" 모델 선택
  - "total_sales" 필드만 차트에 사용
  - "region" 필터링 적용
```

### 예시 2: 모델 구성 단계별 가이드

```markdown
### 1단계: 모델 생성
- Metabase 좌측 메뉴 → "Models"
- "+ 모델" 버튼 클릭
- 기본 쿼리 설정 (테이블 선택 또는 SQL)

### 2단계: 데이터 소스 정의
옵션 A - UI 기반 모델:
  - 테이블 선택
  - 필터 추가
  - JOIN 추가
  - GROUP BY 추가

옵션 B - SQL 기반 모델:
  - "SQL 편집기" 클릭
  - 복잡한 SQL 쿼리 작성
  - 실행하여 결과 확인

### 3단계: 필드 메타데이터 설정
각 필드에 대해:
  - 이름: month
  - 유형: Temporal (날짜)
  - 표시 형식: "January 2024"
  - 숨김: No
  - 필터링 가능: Yes

### 4단계: 모델 저장
- 모델명: 영문, 스네이크 케이스 권장
- 설명: 사용 목적 및 주요 필드 설명
- 데이터베이스 위치 지정

### 5단계: 권한 설정
- 누가 이 모델을 사용할 수 있는지 지정
- 특정 그룹만 접근 허용 가능
```

### 예시 3: 모델 활용 시나리오

```
모델: customer_analytics
쿼리:
  SELECT
    c.id, c.name, c.region,
    COUNT(o.id) as order_count,
    SUM(o.amount) as lifetime_value,
    MAX(o.order_date) as last_order_date
  FROM customers c
  LEFT JOIN orders o ON c.id = o.customer_id
  GROUP BY c.id

활용 사례:

1) "고객 가치" 카드
   - 모델: customer_analytics
   - 필드: lifetime_value
   - 필터: region = "서울"
   → 서울 고객들의 평생 가치 표시

2) "활동 고객" 카드
   - 모델: customer_analytics
   - 필드: order_count, last_order_date
   - 필터: order_count > 5, last_order_date > 3개월
   → 충성도 높은 활동 고객 목록

3) "지역별 고객 분포" 차트
   - 모델: customer_analytics
   - X축: region
   - Y축: COUNT(id)
   - 필터: lifetime_value > 100000
   → 고가치 고객의 지역 분포

모든 카드가 같은 "customer_analytics" 모델 사용
→ 모델 쿼리 변경 시 모든 카드가 자동 반영
```

### 예시 4: 모델 체크리스트

```markdown
## 모델 구성 체크리스트

### 설계 단계
□ 모델 목적 정의 (무엇을 표현하는가?)
□ 필요한 테이블 파악
□ 필요한 JOIN 전략 결정
□ 그룹화 로직 정의
□ 필요한 계산 필드 목록화

### 구현 단계
□ 모델명 정의 (영문, snake_case)
□ 설명 작성 (한글 가능)
□ 데이터 소스 구성
  - □ 테이블/쿼리 선택
  - □ JOIN 설정
  - □ 필터 추가
  - □ 그룹화 설정
□ 필드 메타데이터 설정
  - □ 각 필드 이름 정의
  - □ 필드 유형 설정
  - □ 숨김/표시 여부 설정
  - □ 기본 필터링 옵션 설정

### 검증 단계
□ 쿼리 실행 시간 확인 (< 5초 권장)
□ 결과 데이터 정확성 검증
□ 필드 데이터 유형 확인
□ 샘플 데이터 시각화 확인

### 배포 단계
□ 권한 설정 완료
□ 문서화 (사용법, 필드 설명)
□ 사용자 공지
□ 성능 모니터링 준비
```

## 🛠️ 해결/적용 방법

### 1단계: 모델 필요성 평가
```
모델을 만들어야 하는 경우:
✓ 같은 쿼리가 5개 이상 카드에서 사용됨
✓ 쿼리가 복잡함 (3개 이상 JOIN)
✓ 계산 필드가 자주 필요함
✓ 여러 팀이 같은 데이터 사용
```

### 2단계: 모델 쿼리 설계
- UI 기반: 단순 쿼리
- SQL 기반: 복잡한 쿼리

### 3단계: 성능 최적화
- 필요한 필드만 SELECT
- 인덱스 활용하는 JOIN 조건
- GROUP BY 최소화

### 4단계: 메타데이터 정의
- 각 필드의 의미 명확화
- 필터링 옵션 설정
- 표시 형식 결정

### 5단계: 배포 및 문서화
- 권한 설정
- 사용자 교육
- 정기적 유지보수

## Relations

- used_by [[dropdown-filter-pattern|Dropdown Filter Pattern]] - provides filterable fields
- relates_to [[server-selection-pattern|Server Selection Pattern]] - specifies data source
- used_by [[text-card-addition-pattern|Text Card Addition Pattern]] - supports model documentation
- part_of [[metabase-dashboard-framework|Metabase Framework]] - core data abstraction
