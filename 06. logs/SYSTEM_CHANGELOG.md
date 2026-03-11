---
title: SYSTEM_CHANGELOG
type: changelog
permalink: logs/system-changelog
tags:
- system
- changelog
- episodic-memory
date: 2026-02-24
---

# SYSTEM_CHANGELOG

> AI 시스템 환경설정, 볼트 구조, 워크플로우 진화 이력.
> 시맨틱 메모리(reference, workcase, concept)와 구분되는 에피소딕 기록.
> 소규모 변경은 여기에, 큰 변경은 개별 에피소드(LOG-NNN)로.

---

## 2026-03-11 에피소딕 메모리 체계 도입

- REF-096/097/098 리뷰 패턴 논의 → REF 💡 섹션은 시맨틱, 유지 확정
- 기존 세션 로그(2/24) workcase 규격 불일치 → 에피소딕/시맨틱 구분 확립
- PROJECT_LOG = 산출물 에피소딕 (이미 있음), 시스템/워크플로우 에피소딕 = 빠져 있었음
- `06. logs/` 폴더 신설, changelog 타입 도입, LOG-NNN 넘버링
- workcases에서 에피소딕 노트 4건 분리 이관

---

## 2026-02-24 시스템 프롬프트 3-tier Compaction

→ **LOG-004**: [[LOG-004 시스템 프롬프트 3-tier Compaction]]
→ **워크케이스**: [[Memory.md Compaction 전략 - Attention Matching에서 배운 것]]

- 논문 리뷰 → REF-NNN 넘버링 도입 → 3-tier compaction 실전 적용 → frequency.json 폐지
- 시스템 프롬프트 199→140줄 (-30%), 정보 손실 0

---

## 2026-01-21 Claude Code 환경설정 정비

→ **LOG-003**: [[LOG-003 Claude Code 환경설정 정비]]

- MCP 등록 오류 + Junction 중첩 + hooks matcher 불일치 발견 및 해결
- settings.json / .claude.json 역할 분리 확립

---

## 2026-01-15 Agent Swarm에서 Orchestration으로

→ **LOG-002**: [[LOG-002 Agent Swarm → Orchestration 전환]]

- 에러 분석 자동화용 Agent Swarm 설계 → orchestration.db + basic-memory 체계로 전환

---

## 2025-12-23 Tool-Hub 탄생

→ **LOG-001**: [[LOG-001 Tool-Hub 탄생]]

- Claude Code defer_loading 미지원 → 5단계 진화 → Progressive Disclosure 구현
- 토큰 89,000 → 4,000 (95.5% 절감)
