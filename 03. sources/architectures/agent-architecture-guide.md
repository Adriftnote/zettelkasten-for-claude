---
permalink: architecture/agent-architecture-guide
extraction_status: complete
extracted_to:
  - "[[01. concepts/Context Isolation]]"
  - "[[01. concepts/Multi-Agent Patterns]]"
  - "[[01. concepts/Vector Store Limitations]]"
  - "[[01. concepts/Temporal Knowledge Graph]]"
---

# Agent Architecture 가이드

> 학습 완료된 스킬들의 핵심 내용 정리 (2025-12-30)

---

## 1. 멀티에이전트 패턴

### 왜 멀티에이전트?
- **Context 병목**: 단일 에이전트는 컨텍스트 한계에 도달
- **병렬화**: 독립 작업을 동시 실행
- **전문화**: 도메인별 최적화된 에이전트

### 토큰 경제학
| 아키텍처 | 토큰 배수 | 용도 |
|----------|----------|------|
| 단일 에이전트 채팅 | 1× | 단순 쿼리 |
| 단일 + 도구 | ~4× | 도구 사용 작업 |
| 멀티에이전트 | ~15× | 복잡한 연구/조정 |

> 모델 업그레이드가 토큰 2배보다 더 큰 성능 향상 제공

### 아키텍처 패턴

**1. Supervisor/Orchestrator**
```
User → Supervisor → [Worker, Worker, Worker] → Aggregation → Output
```
- 용도: 명확한 분해가 있는 복잡한 작업
- 문제: "전화 게임" - supervisor가 sub-agent 응답 왜곡
- 해결: `forward_message` 도구로 직접 전달

**2. Peer-to-Peer/Swarm**
```python
def transfer_to_agent_b():
    return agent_b  # 핸드오프
```
- 용도: 유연한 탐색, 창발적 요구사항
- 장점: 단일 실패점 없음
- 단점: 조정 복잡도 증가

**3. Hierarchical**
```
Strategy Layer → Planning Layer → Execution Layer
```
- 용도: 대규모 프로젝트, 기업 워크플로우

### 핵심 원칙: Context Isolation
- 서브에이전트의 주 목적 = **컨텍스트 격리**
- 역할 분담이 아닌 컨텍스트 분리가 핵심

---

## 2. 도구 설계

### 통합 원칙 (Consolidation Principle)
> "인간 엔지니어가 어떤 도구를 써야 할지 확실히 못하면, 에이전트도 못한다"

- 여러 좁은 도구 (X) → **하나의 포괄적 도구 (O)**
- `list_users`, `list_events`, `create_event` → `schedule_event`

### 아키텍처 축소 (Architectural Reduction)
- 전문 도구 제거 → 원시 도구 (파일 시스템, 셸)로 대체
- 작동 조건: 데이터가 잘 문서화됨, 모델 추론 능력 충분

### 좋은 도구 설명 구조
```python
def get_customer(customer_id: str, format: str = "concise"):
    """
    고객 정보 조회.

    Use when:
    - 특정 고객 정보 필요
    - 고객 신원 확인

    Args:
        customer_id: "CUST-######" 형식
        format: "concise" (핵심만) | "detailed" (전체)

    Returns:
        Customer 객체

    Errors:
        NOT_FOUND: ID 없음
        INVALID_FORMAT: 형식 오류
    """
```

### MCP 도구 네이밍
```python
# 올바름: 정규화된 이름
"BigQuery:bigquery_schema"
"GitHub:create_issue"

# 오류: 서버 접두사 없음
"bigquery_schema"  # 다중 서버시 실패
```

---

## 3. 메모리 시스템

### 메모리 계층
| 레이어 | 지속성 | 지연 | 용도 |
|--------|--------|------|------|
| Working Memory | 세션 중 | 0 | 컨텍스트 윈도우 |
| Short-term | 세션 중 | 낮음 | 세션 스코프 DB |
| Long-term | 영구 | 중간 | 크로스 세션 |
| Entity Memory | 영구 | 중간 | 엔티티 일관성 |
| Temporal KG | 영구 | 높음 | 시간 인식 쿼리 |

### 메모리 아키텍처 비교
| 시스템 | DMR 정확도 | 특징 |
|--------|-----------|------|
| Zep (Temporal KG) | 94.8% | 최고 정확도, 빠른 검색 |
| MemGPT | 93.4% | 좋은 범용 성능 |
| GraphRAG | ~75-85% | 관계 추론 가능 |
| Vector RAG | ~60-70% | 관계 구조 손실 |

### Vector Store의 한계
- 관계 정보 손실: "Customer X가 Product Y 구매" 저장 가능
- 하지만: "Product Y 구매자들이 또 뭘 샀나?" 불가
- 시간 유효성 없음: 현재 vs 과거 구분 불가

### Temporal Knowledge Graph
```python
# 2024년 1월 15일 시점 주소 조회
MATCH (user)-[r:LIVES_AT]->(address)
WHERE user.id = $user_id
AND r.valid_from <= $query_time
AND (r.valid_until IS NULL OR r.valid_until > $query_time)
RETURN address
```

---

## 4. 핵심 가이드라인

### 멀티에이전트
1. Context isolation이 주 목적
2. 조직 메타포가 아닌 조정 필요에 따라 패턴 선택
3. 가중 투표 또는 토론 프로토콜로 합의
4. Supervisor 병목 모니터링

### 도구 설계
1. 무엇을, 언제, 무엇을 반환하는지 명확히
2. 통합으로 모호성 감소
3. 에러 메시지는 복구 가이드 포함
4. 10-20개 도구 권장, 초과시 네임스페이싱

### 메모리
1. 쿼리 요구사항에 맞는 아키텍처 선택
2. Progressive disclosure로 메모리 접근
3. Temporal validity로 충돌 방지
4. 주기적 통합으로 무한 성장 방지

---

## Observations

- [architecture] 멀티에이전트의 주 목적은 역할 분담이 아닌 컨텍스트 격리 #multi-agent #context-isolation
- [tech] 도구 통합 원칙: 여러 좁은 도구보다 하나의 포괄적 도구가 에이전트 성능 향상 #tool-design #consolidation
- [tech] Temporal Knowledge Graph는 시간 유효성을 통해 Vector RAG 대비 94.8% 정확도 달성 #memory #temporal-kg
- [decision] MCP 도구는 서버 접두사로 정규화된 이름 사용 필수 (다중 서버 환경) #mcp #naming
- [pattern] Progressive disclosure로 메모리 접근하여 무한 성장 방지 #memory #optimization

---

## 출처
- multi-agent-patterns, tool-design, memory-systems 스킬 (2025-12-20~23)