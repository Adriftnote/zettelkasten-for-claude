---
permalink: patterns/context-engineering-guide
extraction_status: pending
---

# Context Engineering 가이드

> 학습 완료된 스킬들의 핵심 내용 정리 (2025-12-30)

---

## 1. Context 기초

### Context란?
- 모델이 추론 시 참조하는 모든 정보: 시스템 프롬프트, 도구 정의, 검색 문서, 메시지 히스토리, 도구 출력

### 핵심 구성요소
| 구성요소 | 특징 | 최적화 포인트 |
|----------|------|--------------|
| System Prompt | 세션 시작시 로드, 영구 | 명확하고 구조화된 지시 |
| Tool Definitions | 도구 사용법 | 통합 원칙 적용 |
| Retrieved Documents | 런타임 로드 | Just-in-time 로딩 |
| Message History | 대화 누적 | 요약/압축 필요 |
| Tool Outputs | 도구 결과 | 83.9%까지 차지 가능 → 마스킹 필요 |

### Progressive Disclosure 원칙
- 필요할 때만 정보 로드
- 스킬 이름/설명만 먼저 → 필요시 전체 로드
- 파일 시스템 = 자연스러운 progressive disclosure

---

## 2. Context 저하 패턴

### Lost-in-Middle 현상
- 컨텍스트 중간 정보는 10-40% 낮은 recall
- **해결**: 중요 정보는 시작/끝에 배치

### Context Poisoning
- 오류/환각이 컨텍스트에 들어가면 피드백 루프로 강화
- **해결**: 오류 발생 시 컨텍스트 재시작 또는 명시적 수정

### Context Distraction
- 관련 없는 정보가 관련 정보와 attention 경쟁
- **해결**: 컨텍스트에 넣기 전 관련성 필터링

### 저하 임계값 (모델별)
| 모델 | 저하 시작 | 심각한 저하 |
|------|----------|------------|
| Claude Opus 4.5 | ~100K | ~180K |
| Claude Sonnet 4.5 | ~80K | ~150K |
| GPT-5.2 | ~64K | ~200K |

---

## 3. Context 최적화 전략

### 4-Bucket 접근법
1. **Write**: 컨텍스트 밖으로 저장 (파일, 스크래치패드)
2. **Select**: 관련 정보만 검색해서 로드
3. **Compress**: 요약으로 토큰 축소
4. **Isolate**: 서브에이전트로 분리

### Compaction (압축)
- **트리거**: 70-80% 사용률에서
- **대상**: 도구 출력 → 오래된 턴 → 검색 문서
- **절대 압축 X**: 시스템 프롬프트

### Observation Masking
- 도구 출력을 참조로 대체: `[Obs:ref_id elided. Key: 핵심내용]`
- 3턴 이상 지난 출력 마스킹 고려

### KV-Cache 최적화
- 안정적인 내용(시스템 프롬프트)을 앞에 배치
- 동적 내용(타임스탬프 등) 회피

---

## 4. Context 압축 전략

### Tokens-per-Task 최적화
- tokens-per-request (X) → **tokens-per-task (O)**
- 과도한 압축 → 재검색 비용 증가 → 총 토큰 더 많이 소모

### Anchored Iterative Summarization (권장)
```markdown
## Session Intent
[사용자 목표]

## Files Modified
- auth.controller.ts: JWT 수정
- config/redis.ts: 연결 풀 설정

## Decisions Made
- Redis 연결 풀 사용
- 지수 백오프 재시도

## Current State
- 14 테스트 통과, 2 실패

## Next Steps
1. 실패 테스트 수정
2. 전체 테스트 실행
```

### 압축 방식 비교
| 방식 | 압축률 | 품질 | 용도 |
|------|--------|------|------|
| Anchored Iterative | 98.6% | 3.70 | 장기 세션, 파일 추적 중요 |
| Regenerative | 98.7% | 3.44 | 해석 가능성 중요 |
| Opaque | 99.3% | 3.35 | 최대 압축 필요 |

---

## 5. 핵심 가이드라인

1. **컨텍스트는 유한 자원** - 수확 체감
2. **중요 정보는 시작/끝에** - Lost-in-middle 회피
3. **70-80%에서 압축 트리거**
4. **품질 > 양** - 작은 고신호 컨텍스트가 큰 저신호보다 나음
5. **저하에 대비해 설계** - 회피가 아닌 대응 설계

---

## 출처
- context-fundamentals, context-optimization, context-compression, context-degradation 스킬 (2025-12-20~22)

## Observations

- [pattern] Progressive Disclosure 원칙: 필요할 때만 정보 로드하여 컨텍스트 윈도우 효율적으로 사용 #progressive-disclosure #context-optimization
- [fact] Lost-in-Middle 현상: 컨텍스트 중간 정보는 10-40% 낮은 recall, 중요 정보는 시작/끝 배치 필수 #context-degradation #llm-limitation
- [method] 4-Bucket 접근법: Write/Select/Compress/Isolate로 컨텍스트 최적화 전략 분류 #methodology #optimization
- [tech] Anchored Iterative Summarization이 98.6% 압축률로 장기 세션에 최적 (품질 3.70) #compression #summarization
- [solution] 70-80% 사용률에서 압축 트리거, 도구 출력부터 압축하고 시스템 프롬프트는 절대 압축 금지 #best-practice #compaction
- [tip] tokens-per-request가 아닌 tokens-per-task로 최적화, 과도한 압축은 재검색 비용 증가 #performance #tradeoff