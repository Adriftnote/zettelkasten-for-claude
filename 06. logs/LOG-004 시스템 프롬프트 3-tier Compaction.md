---
title: 시스템 프롬프트 3-tier Compaction
type: changelog
permalink: logs/system-prompt-3tier-compaction-1
tags:
- compaction
- memory
- prompt-caching
- reference-numbering
date: 2026-02-24
---

# 시스템 프롬프트 3-tier Compaction

> 논문 리뷰에서 시작해 넘버링 체계 도입, compaction 실전 적용, frequency.json 폐지까지 이어진 세션.

## 흐름
```
REF-058 작성 (Fast KV Compaction via Attention Matching 논문)
  ├── Reference 넘버링 체계 도입
  │     └── REF-NNN prefix, 기존 57개 → 001~057 예약
  │
  ├── Workcase 원칙을 실전 적용 (4단계 프레임워크)
  │     ├── MEMORY.md: 71→56줄 (-21%)
  │     │     └── Value Refit: 환경/설정 도구경로 4→1 (최대 효과)
  │     ├── CLAUDE.md Orchestrator: 59→37줄 (-37%)
  │     │     └── table→inline, 스킬 table(10줄)→pointer 2줄
  │     ├── CLAUDE.md Worker: 57→35줄 (-39%)
  │     │     └── Task도구 table→inline, 체크리스트 merge
  │     └── 합계: 199→140줄 (-30%), 정보 손실 0
  │
  ├── 프롬프트 캐싱 관점 정리
  │     ├── CLAUDE.md = prefix 앞쪽 → 구조 보존, 밀도만 올림
  │     └── MEMORY.md = prefix 뒤쪽 → 항목 merge, rewrite 허용
  │
  └── frequency.json 폐지 → orchestration_log 통합
        └── 이진 카운트(+1) 부정확 + 도메인 체계 이원화 + 56줄이라 불필요
```

## Observations
- [decision] Reference 넘버링: REF-NNN prefix는 파일명만, frontmatter title은 원제목 유지 #reference #naming
- [decision] Compaction 강도: 공격적 선택 — WSL tmux archive + 패턴 merge 포함 #compaction
- [decision] 캐싱 순서 서술: 관찰 기반 추론이지만 원칙 자체는 유효하므로 유지 #prompt-caching
- [decision] frequency.json 폐지: orchestration_log domain별 task 수가 더 정확한 proxy #frequency #simplification
- [result] 시스템 프롬프트 199→140줄 (-30%), 정보 손실 0 #compaction
- [result] /reference 스킬 넘버링, /summarize-session frequency 제거, archive.md 신설, frequency.json 폐지(.bak) #system

## Relations
- learned_from [[REF-058 Fast KV Compaction via Attention Matching]] (논문에서 compaction 원칙 도출)
- led_to [[Memory.md Compaction 전략 - Attention Matching에서 배운 것]] (실전 적용 결과를 workcase로 정리)