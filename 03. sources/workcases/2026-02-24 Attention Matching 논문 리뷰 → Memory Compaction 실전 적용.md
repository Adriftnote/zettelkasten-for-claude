---
title: 2026-02-24 Attention Matching 논문 리뷰 → Memory Compaction 실전 적용
type: note
permalink: notes/2026-02-24-attention-matching-memory-compaction-session
tags:
- session-log
- compaction
- attention-matching
- memory-management
- prompt-caching
date: 2026-02-24
---

# 2026-02-24 Attention Matching 논문 리뷰 → Memory Compaction 실전 적용

논문 JSON 리뷰 → reference 작성 → 넘버링 체계 도입 → workcase 원칙을 실전 적용하여 MEMORY.md + CLAUDE.md 3-tier compaction 수행.

## 세션 흐름
```
1. REF-058 작성 (Fast KV Compaction via Attention Matching)
   │  논문 JSON → /reference 스킬로 레퍼런스 노트 생성
   │
2. Reference 넘버링 체계 도입
   │  파일명: REF-NNN prefix, frontmatter title은 원제목 유지
   │  기존 57개 → REF-001~057 예약, 신규는 REF-058부터
   │  /reference 스킬에 넘버링 규칙 반영
   │
3. Workcase 원칙을 실전 적용
   │  "Memory.md Compaction 전략" workcase의 4단계 프레임워크 적용
   │
   ├─ MEMORY.md: 71→56줄 (-21%)
   │   - 환경/설정 도구경로 4→1 (Value Refit)
   │   - 스킬 시스템 3→1
   │   - WSL tmux → archive.md (첫 아카이브)
   │   - Git Bash+PS변수 merge
   │   - 자기진화 요약 5→3
   │
   ├─ CLAUDE.md Orchestrator: 59→37줄 (-37%)
   │   - 에이전트 table→inline 2줄
   │   - 스킬 table(10줄)→pointer 2줄
   │   - Task ID+운영 섹션 merge
   │
   ├─ CLAUDE.md Worker: 57→35줄 (-39%)
   │   - Task 도구 table→inline 1줄
   │   - 체크리스트→작업완료에 1줄 흡수
   │   - NAS table 제거(inline 유지)
   │
   └─ 합계: 199→140줄 (-30%), 정보 손실 0
   
4. 프롬프트 캐싱 관점 정리
   │  CLAUDE.md = prefix 앞쪽 → 구조 보존, 밀도만 올림
   │  MEMORY.md = prefix 뒤쪽 → 항목 merge, rewrite 허용
   │  로딩 순서는 관찰 기반 (Claude Code 내부 구현)
   │
5. Workcase 업데이트
   │  실전 결과(수치), Nonuniform Budget 실측, 캐싱 시너지 테이블,
   │  Observations 5건 추가
   │
6. frequency.json 폐지 → orchestration_log 통합
      문제: 이진 카운트(+1)가 부정확, 도메인 체계 이원화,
      목적 불명확 (archive 판단용인데 56줄이라 불필요)
      → frequency.json 백업 후 비활성화
      → /summarize-session 스킬에서 frequency 섹션 제거
      → MEMORY.md에서 Frequency 시스템 → 아카이브 섹션으로 교체
      → 도메인 빈도는 orchestration_log domain별 task 수로 집계
```


## 핵심 판단들

| 판단 | 선택 | 근거 |
|------|------|------|
| Reference 넘버링 방식 | REF-NNN prefix (파일명만) | 사용자 선호: 넘버링, title은 깔끔하게 |
| Compaction 강도 | 공격적 | 사용자 선택. WSL tmux archive + 패턴 merge 포함 |
| 캐싱 순서 서술 | 그대로 유지 | 관찰 기반 추론임을 인지하되 원칙 자체는 유효 |

## 산출물
- [[REF-058 Fast KV Compaction via Attention Matching]] — 논문 레퍼런스
- [[Memory Compaction 전략 - Attention Matching에서 배운 것]] — workcase 업데이트 (실전 결과 반영)
- MEMORY.md compacted (71→56줄) + frequency 섹션 제거
- CLAUDE.md 3-tier compacted (128→84줄)
- /reference 스킬 업데이트 (REF-NNN 넘버링 규칙)
- /summarize-session 스킬 업데이트 (frequency 섹션 제거)
- archive.md 첫 항목 (WSL tmux)
- frequency.json 폐지 (.bak 백업)


## Observations
- [decision] Reference 넘버링: 파일명=REF-NNN prefix, frontmatter title=원제목. 기존 57개는 001~057 예약 #reference #naming
- [result] 첫 실전 compaction: 시스템 프롬프트 총량 199→140줄(-30%), 정보 손실 0. Value Refit(도구경로 4→1)이 최대 효과 #compaction #memory
- [insight] CLAUDE.md vs MEMORY.md 압축 전략이 달라야 함 — 변경빈도·손실허용·캐시위치가 다르기 때문 #prompt-caching #compaction
- [insight] table→inline 변환이 CLAUDE.md에서 가장 효율적. 자기기술적(self-descriptive) 항목의 중복 목록은 pointer로 대체 가능 #density #self-descriptive
- [decision] frequency.json 폐지: 이진 카운트(+1)가 활용 빈도를 반영 못함 + 도메인 체계 이원화 + 56줄이라 archive 판단 불필요. orchestration_log domain별 task 수가 더 정확한 proxy #frequency #simplification
