---
extraction_status: pending
permalink: 03.-sources/reports/jarvis-graph-plan-simple
---

# jarvis 대화형 지식그래프 구축 계획서

**작성일:** 2024-12-30  
**목표:** AI와의 모든 대화를 지식그래프로 변환하여 개인화 AI 데이터셋 구축

---

## 📋 프로젝트 개요

### 핵심 목표
1. **지식 DB 통합:** 모든 기기에서 같은 맥락의 AI와 대화
2. **개인화 데이터셋:** 미래 개인화 AI 학습용 구조화된 데이터 확보
3. **완전한 프라이버시:** 모든 데이터는 집 컴퓨터(Ubuntu)에서 관리

### 전체 워크플로우
```
Claude와 대화
    ↓
jarvis_save → SQLite 저장
    ↓
GitHub 자동 동기화
    ↓
집 컴퓨터 (야간 cron)
    ↓
대화 → Entity/Relation 추출 → 지식그래프 생성
    ↓
개인화 AI 데이터셋
```

### 핵심 원칙
- 회사 네트워크와 완전 분리 (VPN 불필요)
- 대화 히스토리 기반 자동 그래프 생성
- Temporal(시간) 추적 - 생각의 변화 기록
- 최종적으로 TypeDB 사용 (추론 기능 활용)

---

## 🎯 기술 스택

### Phase 1: 프로토타입 (검증용)

| 구성요소 | 선택 | 이유 |
|---------|------|------|
| **그래프 DB** | Neo4j | Graphiti 공식 지원, 빠른 검증 |
| **자동화 프레임워크** | Graphiti | Entity/Relation 자동 추출, Temporal 내장 |
| **LLM** | Claude API | 한국어 성능 우수 |
| **노트 저장** | SQLite | jarvis 기존 구조 유지 |
| **동기화** | GitHub | 간단하고 안정적 |

### Phase 2: 최종 목표

| 구성요소 | 선택 | 이유 |
|---------|------|------|
| **그래프 DB** | TypeDB | 강력한 추론 엔진, Type System |
| **자동화** | Graphiti 코드 재사용 | 80% 로직 유지 가능 |
| **쿼리 언어** | TypeQL | 복잡한 추론 가능 |

---

## 🏗️ 시스템 아키텍처

### 전체 구성도

```
┌─────────────────────────────────┐
│  어디서든 (회사/집/모바일)        │
│  Claude Desktop / Code / Web    │
└────────────┬────────────────────┘
             │
             ▼
      ┌──────────────┐
      │ jarvis_save  │
      │  (MCP)       │
      └──────┬───────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ SQLite  │      │ GitHub  │
│ (노트)   │      │ (동기화) │
└─────────┘      └────┬────┘
                      │
                      ▼
          ┌───────────────────┐
          │  집 Ubuntu 서버     │
          │  (야간 처리)        │
          └─────────┬─────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  ┌────────┐  ┌────────┐  ┌─────────┐
  │Graphiti│  │ Neo4j  │  │ TypeDB  │
  │(자동화) │─▶│ (임시) │─▶│ (최종)  │
  └────────┘  └────────┘  └─────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ 개인화 AI     │
                        │ 데이터셋      │
                        └──────────────┘
```

### 데이터 흐름

**실시간:**
1. 대화 → jarvis_save
2. SQLite 저장
3. GitHub push

**야간 (집 컴퓨터):**
1. GitHub pull
2. 새 대화 추출
3. Entity/Relation 자동 생성
4. 그래프 DB 저장
5. 데이터셋 Export

---

## 📅 구현 로드맵

### Week 1: Graphiti + Neo4j 프로토타입

**목표:** 대화 → 그래프 자동 생성 검증

**작업:**
- [ ] Neo4j Docker 설치
- [ ] Graphiti 설치 및 설정
- [ ] 샘플 대화로 테스트
- [ ] Entity/Relation 자동 추출 확인
- [ ] Temporal 속성 확인

**검증 기준:**
- Entity 자동 추출 정확도 70% 이상
- Relation 자동 추론 작동
- 검색 기능 정상 작동

---

### Week 2-3: jarvis 통합

**목표:** 실제 대화 데이터로 그래프 생성

**작업:**
- [ ] jarvis_save MCP 수정 (Git push 추가)
- [ ] 집 컴퓨터 야간 처리 스크립트 작성
- [ ] Cron 설정 (매일 밤 11시)
- [ ] 1주일 실사용 테스트

**검증 기준:**
- GitHub 동기화 안정성
- 야간 처리 자동 실행
- Neo4j에 데이터 누적 확인

---

### Week 4-5: TypeDB 전환 준비

**목표:** TypeDB 스키마 설계 및 마이그레이션 준비

**작업:**
- [ ] TypeDB 설치
- [ ] 스키마 설계 (Entity, Relation, Temporal)
- [ ] 추론 규칙 정의
- [ ] Neo4j → TypeDB 마이그레이션 스크립트 작성
- [ ] 병렬 테스트 (Neo4j + TypeDB)

**TypeDB 스키마 핵심:**
- Entity Types: person, concept, technology, organization, event
- Relation Types: 시간 속성 포함 (valid_from, valid_to, invalid_at)
- Inference Rules: 추론 자동화, Temporal 무효화

**검증 기준:**
- TypeDB 스키마 로드 성공
- 마이그레이션 스크립트 동작
- 추론 규칙 작동 확인

---

### Week 6: 완전 전환

**목표:** TypeDB로 완전 전환

**작업:**
- [ ] 기존 Neo4j 데이터 → TypeDB 이전
- [ ] jarvis 야간 처리를 TypeDB로 변경
- [ ] Graphiti 로직 TypeDB용으로 재작성
- [ ] 데이터셋 Export 기능 구현

**최종 구조:**
- SQLite (원본 대화 저장)
- GitHub (동기화)
- TypeDB (지식그래프 최종본)
- Export 스크립트 (AI 학습용 데이터)

---

## 🔄 TypeDB 전환 계획

### 왜 Graphiti → TypeDB인가?

| 기능 | Graphiti (Neo4j) | TypeDB |
|------|------------------|--------|
| **자동 Entity 추출** | ✅ | ⚠️ 직접 구현 |
| **자동 Relation 추론** | ✅ | ⚠️ 직접 구현 |
| **Temporal 추적** | ✅ | ⚠️ 직접 구현 |
| **Type System** | ⚠️ 약함 | ✅ 강력 |
| **추론 엔진** | ❌ | ✅ 내장 |
| **다형성** | ❌ | ✅ |
| **복잡한 쿼리** | ⚠️ | ✅ |

### 전환 전략

**단계적 전환 (권장):**
1. **Week 1-3:** Neo4j + Graphiti로 자동화 검증
2. **Week 4-5:** Graphiti 로직 학습, TypeDB 스키마 설계
3. **Week 6:** TypeDB로 전환, Graphiti 코드 80% 재사용

**병렬 운영 (옵션):**
- Graphiti (Neo4j): 자동 추출 계속 사용
- TypeDB: 복잡한 추론 및 쿼리용
- 매일 밤 Neo4j → TypeDB 동기화

### 전환 가능 시점

✅ **전환 준비 완료 조건:**
- [ ] Graphiti 1주 이상 안정 작동
- [ ] 100+ 대화 데이터 누적
- [ ] TypeDB 스키마 완성
- [ ] 마이그레이션 스크립트 테스트 완료

---

## 🎁 기대 효과

### 즉시 효과 (Phase 1)
- ✅ 어디서든 같은 맥락의 AI 대화
- ✅ 대화 히스토리 자동 구조화
- ✅ Entity/Relation 자동 추출
- ✅ 시간에 따른 생각 변화 추적

### 장기 효과 (Phase 2)
- ✅ TypeDB 추론으로 숨겨진 관계 발견
- ✅ 복잡한 지식 쿼리 가능
- ✅ 개인화 AI 학습용 고품질 데이터셋
- ✅ 완전한 데이터 소유권

---

## 💡 주요 결정 사항

### 1. Graphiti 먼저 vs TypeDB 직접 구현?
**결정:** Graphiti 먼저 → TypeDB 전환

**이유:**
- 빠른 검증 (3일 vs 15일)
- Graphiti 로직 80% 재사용 가능
- 리스크 최소화

### 2. 데이터 저장 위치
**결정:** 집 컴퓨터 Ubuntu

**이유:**
- 완전한 프라이버시
- 회사 네트워크 분리
- 무료 (클라우드 비용 없음)

### 3. 동기화 방법
**결정:** GitHub

**이유:**
- 간단하고 안정적
- 버전 관리 자동
- SQLite 파일 충돌 없음

### 4. 야간 처리 시간
**결정:** 매일 밤 11시 (Cron)

**이유:**
- 집 컴퓨터 유휴 시간
- GraphRAG 처리 부하 분산
- 다음날 아침 최신 그래프 사용 가능

---

## 📊 성공 지표

### Phase 1 (Week 3 종료 시)
- [ ] 대화 → 그래프 변환 성공률 70%+
- [ ] Entity 추출 정확도 70%+
- [ ] 일주일간 중단 없이 작동
- [ ] 100+ 대화 데이터 누적

### Phase 2 (Week 6 종료 시)
- [ ] TypeDB로 완전 전환 완료
- [ ] 추론 규칙 5개 이상 작동
- [ ] 데이터셋 Export 기능 완성
- [ ] 복잡한 쿼리 5초 이내 응답

---

## ⚠️ 리스크 관리

### 기술적 리스크

| 리스크 | 확률 | 대응 방안 |
|--------|------|-----------|
| Entity 추출 정확도 낮음 | 중 | LLM 프롬프트 튜닝, 수동 보정 |
| Neo4j → TypeDB 이전 실패 | 중 | Neo4j 병렬 유지 |
| 야간 처리 스크립트 오류 | 중 | 로그 모니터링, 알림 설정 |
| GitHub 동기화 충돌 | 저 | Append-only 로그 방식 고려 |

### 일정 리스크

| 리스크 | 확률 | 대응 방안 |
|--------|------|-----------|
| TypeDB 학습 곡선 | 고 | Graphiti 먼저, 충분한 학습 시간 |
| Graphiti 버그 | 중 | 커뮤니티 활용, 직접 구현 백업 |
| 집 컴퓨터 세팅 지연 | 중 | Phase 1은 개발 PC로 시작 |

---

## 📚 참고 자료

### 공식 문서
- **Graphiti:** https://github.com/getzep/graphiti
- **Neo4j:** https://neo4j.com/docs/
- **TypeDB:** https://typedb.com/docs
- **jarvis MCP:** (기존 구현 참고)

### 학습 자료
- Graphiti Quickstart: https://github.com/getzep/graphiti/tree/main/examples
- TypeQL Tutorial: https://typedb.com/docs/typeql/overview
- Temporal Knowledge Graphs 논문: Zep Architecture Paper

### 커뮤니티
- Graphiti Discord: https://discord.gg/zep
- TypeDB Forum: https://forum.typedb.com
- Neo4j Community: https://community.neo4j.com

---

## 🎯 다음 단계

### 즉시 실행 (집 컴퓨터 준비 전)
1. Graphiti 문서 정독
2. TypeDB 문서 정독  
3. 샘플 스키마 설계 연습

### 집 컴퓨터 세팅 후
1. Ubuntu 설치
2. Docker 설치
3. Neo4j + Graphiti 설치
4. 테스트 실행

### Week 1 목표
- Graphiti 작동 확인
- jarvis 연동 계획 수립
- 첫 그래프 생성 성공

---

## 📝 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2024-12-30 | 초안 작성 - Graphiti → TypeDB 전환 전략 수립 |

---

**문서 끝**

이 계획서는 진행하면서 계속 업데이트될 예정입니다.